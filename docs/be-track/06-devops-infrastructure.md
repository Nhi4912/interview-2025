# DevOps & Infrastructure Basics — Nền tảng DevOps và hạ tầng cho Backend Developer

> Backend Track — Go/DevOps
> Difficulty: `[Junior]` `[Mid]` `[Senior]`

---

## Learning Objectives

### 🟡 Q: What should a backend engineer master about DevOps for interviews? `[Mid]`
**A:** Backend engineer không cần thành SRE full-time, nhưng phải hiểu đủ để thiết kế, vận hành, và debug dịch vụ production:

- Đóng gói dịch vụ bằng Docker hiệu quả.
- Triển khai và vận hành cơ bản trên Kubernetes.
- Thiết kế CI/CD pipeline an toàn và đáng tin cậy.
- Thiết lập monitoring/observability để phát hiện sự cố sớm.
- Dùng IaC để provisioning hạ tầng có thể lặp lại.
- Nắm networking thực chiến (LB, reverse proxy, TLS termination).

Cross-reference:
- API design và reliability: [02-backend-knowledge/01-api-design.md](./02-backend-knowledge/01-api-design.md)
- Distributed systems: [02-backend-knowledge/03-distributed-systems.md](./02-backend-knowledge/03-distributed-systems.md)
- Networking in Go: [02-backend-knowledge/06-networking-go.md](./02-backend-knowledge/06-networking-go.md)
- Security fundamentals: [../shared/04-security/01-security-fundamentals.md](../shared/04-security/01-security-fundamentals.md)

---

## 1) Docker Fundamentals

### 🟢 Q: What is containerization, and how is it different from VMs? `[Junior]`
**A:**

- **Container**: cô lập process ở mức OS (namespaces + cgroups), chia sẻ kernel host.
- **VM**: ảo hóa phần cứng, mỗi VM có guest OS riêng.

So sánh nhanh:

| Tiêu chí | Container | VM |
|---|---|---|
| Startup | Nhanh (ms-giây) | Chậm hơn (giây-phút) |
| Overhead | Thấp | Cao hơn |
| Isolation | Mức process/kernel | Mức OS/hypervisor |
| Portability | Rất tốt cho app packaging | Tốt nhưng nặng |

Container phù hợp microservices và CI/CD nhanh.

---

### 🟡 Q: What are Dockerfile best practices for Go services? `[Mid]`
**A:** Mục tiêu: image nhỏ, build nhanh, bảo mật hơn.

Principles:
1. Multi-stage build.
2. Tận dụng layer caching (copy go.mod/go.sum trước).
3. Chạy non-root nếu có thể.
4. Giảm attack surface (distroless/alpine tùy nhu cầu).

```dockerfile
# syntax=docker/dockerfile:1

FROM golang:1.23-alpine AS builder
WORKDIR /src

# Cache dependencies first
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o /out/app ./cmd/api

FROM gcr.io/distroless/static-debian12
WORKDIR /app
COPY --from=builder /out/app /app/app

USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/app/app"]
```

---

### 🟡 Q: How does Docker layer caching speed up CI builds? `[Mid]`
**A:** Docker build cache tái sử dụng layer nếu instruction + input không đổi.

Ví dụ nếu bạn copy toàn bộ source trước `go mod download`, chỉ cần đổi 1 file nhỏ là cache dependency bị invalidated. Cách đúng:

1. `COPY go.mod go.sum ./`
2. `RUN go mod download`
3. `COPY . .`

Nhờ vậy, dependency download không bị chạy lại mỗi commit.

---

### 🟢 Q: What is Docker Compose and when is it useful? `[Junior]`
**A:** Docker Compose dùng để chạy multi-container app local/dev: app + db + redis + queue.

```yaml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_DSN=postgres://postgres:postgres@db:5432/app?sslmode=disable
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=app
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Compose phù hợp local integration testing nhanh.

---

### 🟡 Q: How do you optimize Docker image size effectively? `[Mid]`
**A:**

- Dùng multi-stage build.
- Tránh cài tool không cần runtime.
- Dùng `.dockerignore` để loại file không cần.
- Gộp lệnh `RUN` hợp lý để giảm layers.
- Chọn base image phù hợp (distroless/alpine/debian slim).

`.dockerignore` mẫu:

```text
.git
.github
.vscode
node_modules
bin
dist
*.log
*.md
```

---

### 🟡 Q: Explain container networking basics interviewers often ask. `[Mid]`
**A:**

- Mỗi container có network namespace riêng.
- Container trong cùng Docker network nói chuyện qua service name (DNS nội bộ).
- Publish port (`-p host:container`) để expose ra host.
- `localhost` bên trong container là chính container đó, không phải host.

Pitfall phổ biến: app container kết nối DB bằng `localhost:5432` → fail; phải dùng service name `db:5432` trong Compose.

---

## 2) Kubernetes Basics

> **Visual Overview** / Sơ Đồ Kubernetes:
> ```
> KUBERNETES CLUSTER:
>
>                         kubectl
>                            │
>                            ▼
>                   ┌─────────────────┐
>                   │  CONTROL PLANE  │
>                   │  ─────────────  │
>                   │  API Server     │ ← all communication goes here
>                   │  etcd           │ ← cluster state (key-value store)
>                   │  Scheduler      │ ← assigns pods to nodes
>                   │  Controller Mgr │ ← maintains desired state
>                   └────────┬────────┘
>                            │ watch/reconcile
>                  ┌─────────┼─────────┐
>                  ▼         ▼         ▼
>             ┌────────┐ ┌────────┐ ┌────────┐
>             │ Node 1 │ │ Node 2 │ │ Node 3 │
>             │kubelet │ │kubelet │ │kubelet │
>             │Pod A   │ │Pod B   │ │Pod C   │
>             └────────┘ └────────┘ └────────┘
>
> Pod = 1+ containers sharing network; Deployment = manages replicas + updates
> Service = stable IP for pods; Ingress = HTTP routing; HPA = autoscaling
> ```


### 🟡 Q: What core problem does Kubernetes solve? `[Mid]`
**A:** Kubernetes giải quyết orchestration ở scale:

- Scheduling containers lên nhiều nodes.
- Self-healing (restart/reschedule).
- Declarative desired state.
- Service discovery + load balancing nội bộ.
- Rolling updates/rollbacks.

Nói ngắn gọn: “Kubernetes biến hạ tầng động thành một control plane nhất quán.”

---

### 🟡 Q: Explain Pods, Deployments, Services, ConfigMaps, and Secrets. `[Mid]`
**A:**

- **Pod**: đơn vị deploy nhỏ nhất (1+ containers chia sẻ network/volume).
- **Deployment**: quản lý Pod replicas + rollout strategy.
- **Service**: stable virtual IP/DNS để truy cập Pods.
- **ConfigMap**: config không nhạy cảm.
- **Secret**: dữ liệu nhạy cảm (password/token/cert).

Ví dụ deployment + service:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-api
  template:
    metadata:
      labels:
        app: user-api
    spec:
      containers:
        - name: app
          image: ghcr.io/acme/user-api:1.4.2
          ports:
            - containerPort: 8080
          envFrom:
            - configMapRef:
                name: user-api-config
            - secretRef:
                name: user-api-secret
---
apiVersion: v1
kind: Service
metadata:
  name: user-api
spec:
  selector:
    app: user-api
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP
```

---

### 🟡 Q: What is ReplicaSet and how does HPA relate to it? `[Mid]`
**A:**

- ReplicaSet đảm bảo số Pod replicas đúng theo desired state.
- Deployment quản lý ReplicaSet (old/new khi rollout).
- HPA (Horizontal Pod Autoscaler) thay đổi replica count theo metrics (CPU, memory, custom metrics).

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-api
  minReplicas: 3
  maxReplicas: 15
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65
```

---

### 🟡 Q: Compare Service types: ClusterIP, NodePort, LoadBalancer. `[Mid]`
**A:**

- `ClusterIP`: chỉ truy cập trong cluster.
- `NodePort`: mở port trên mỗi node; phù hợp lab/test hơn production cloud.
- `LoadBalancer`: tích hợp cloud LB để expose dịch vụ ra ngoài.

Production web apps thường dùng Ingress + ClusterIP service phía sau.

---

### 🔴 Q: What role does an Ingress controller play in production? `[Senior]`
**A:** Ingress resource chỉ là config; cần Ingress Controller (Nginx, Traefik, HAProxy, cloud-specific) để thực thi routing HTTP(S):

- Host/path based routing.
- TLS termination.
- Rewrite, rate limit (tùy controller).

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: nginx
  tls:
    - hosts: ["api.example.com"]
      secretName: api-example-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /users
            pathType: Prefix
            backend:
              service:
                name: user-api
                port:
                  number: 80
```

---

### 🔴 Q: Why are liveness, readiness, and startup probes all needed? `[Senior]`
**A:**

- **Liveness**: process có bị “kẹt” cần restart không.
- **Readiness**: pod đã sẵn sàng nhận traffic chưa.
- **Startup**: app khởi động chậm, tránh liveness kill quá sớm.

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /readyz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5

startupProbe:
  httpGet:
    path: /startupz
    port: 8080
  failureThreshold: 30
  periodSeconds: 2
```

Sai lầm phổ biến: dùng chung một endpoint cho cả ba probes mà không phản ánh trạng thái thật.

---

### 🔴 Q: How do requests/limits affect scheduling and runtime stability? `[Senior]`
**A:**

- `requests`: tài nguyên tối thiểu scheduler dùng để đặt Pod.
- `limits`: trần tài nguyên runtime.

Nếu không đặt:
- Dễ noisy-neighbor.
- OOM kill bất ngờ.
- HPA méo vì metrics không phản ánh baseline.

```yaml
resources:
  requests:
    cpu: "200m"
    memory: "256Mi"
  limits:
    cpu: "1"
    memory: "512Mi"
```

---

## 3) CI/CD Pipelines

### 🟡 Q: What is CI/CD and why does it matter for backend teams? `[Mid]`
**A:**

- **CI (Continuous Integration)**: merge code thường xuyên + validate tự động (lint/test/build).
- **CD (Continuous Delivery/Deployment)**: tự động đưa artifact đã verify lên staging/production theo policy.

Lợi ích:
- Feedback nhanh, giảm integration hell.
- Triển khai lặp lại, giảm lỗi thủ công.
- Audit trail rõ ràng.

---

### 🟡 Q: What are common pipeline stages in mature teams? `[Mid]`
**A:** Thứ tự thường gặp:

1. Build
2. Unit/integration test
3. Lint + type/static checks
4. Security scan (SAST/dependency/container)
5. Push artifact/image
6. Deploy staging
7. Smoke test
8. Manual gate / auto deploy production

Cross-ref security: [../shared/04-security/01-security-fundamentals.md](../shared/04-security/01-security-fundamentals.md)

---

### 🟡 Q: Show a practical GitHub Actions workflow for Go backend. `[Mid]`
**A:**

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.23"
      - name: Cache Go modules
        uses: actions/cache@v4
        with:
          path: |
            ~/go/pkg/mod
            ~/.cache/go-build
          key: ${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}
      - run: go mod download
      - run: go test ./... -race -cover
      - run: go vet ./...

  docker:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/acme/user-api:${{ github.sha }}
```

---

### 🟡 Q: What is the structure of a GitLab CI pipeline? `[Mid]`
**A:** `.gitlab-ci.yml` định nghĩa `stages`, `jobs`, `rules/only`, artifacts và environments.

```yaml
stages:
  - lint
  - test
  - build
  - deploy

lint:
  stage: lint
  image: golang:1.23
  script:
    - go vet ./...

test:
  stage: test
  image: golang:1.23
  script:
    - go test ./... -race

build:
  stage: build
  image: docker:27
  services:
    - docker:27-dind
  script:
    - docker build -t registry.example.com/user-api:$CI_COMMIT_SHA .
    - docker push registry.example.com/user-api:$CI_COMMIT_SHA

deploy_staging:
  stage: deploy
  script:
    - echo "deploy to staging"
  environment:
    name: staging
  only:
    - main
```

---

### 🔴 Q: Compare rolling, blue-green, and canary deployment strategies. `[Senior]`
**A:**

- **Rolling update**: thay dần pods cũ bằng pods mới.
  - Ưu: đơn giản, tiết kiệm tài nguyên.
  - Nhược: rollback có thể chậm, mixed-version period.

- **Blue-green**: 2 môi trường song song, switch traffic tức thời.
  - Ưu: rollback nhanh.
  - Nhược: tốn tài nguyên gấp đôi.

- **Canary**: rollout một phần traffic nhỏ trước.
  - Ưu: giảm blast radius, quan sát metrics.
  - Nhược: phức tạp routing/observability.

Trong production lớn, canary + automated metrics gates là pattern rất mạnh.

---

### 🔴 Q: Why are feature flags critical in safe delivery? `[Senior]`
**A:** Feature flag tách release code khỏi rollout behavior:

- Bật dần theo % user/segment.
- Kill switch tắt nhanh khi sự cố.
- A/B testing hoặc dark launch.

Cảnh báo:
- Flag debt nếu không dọn dẹp.
- Cần governance: owner, expiry date, rollout plan.

---

## 4) Monitoring & Observability

### 🟡 Q: What are the three pillars of observability? `[Mid]`
**A:**

1. **Metrics**: dữ liệu số theo thời gian (RPS, latency, error rate, CPU).
2. **Logs**: sự kiện chi tiết theo dòng thời gian.
3. **Traces**: luồng request qua nhiều services.

Không pillar nào thay thế hoàn toàn pillar khác.

---

### 🟡 Q: What does Prometheus do and what should you know about PromQL? `[Mid]`
**A:** Prometheus scrape metrics endpoint (thường `/metrics`) theo interval, lưu time-series, query bằng PromQL.

PromQL cơ bản:

```promql
rate(http_requests_total{job="user-api",status=~"5.."}[5m])
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

- Query 1: tốc độ lỗi 5xx.
- Query 2: p95 latency từ histogram buckets.

---

### 🟡 Q: Why Grafana dashboards are not enough without alert quality? `[Mid]`
**A:** Dashboard tốt để quan sát thủ công, nhưng alert mới là cơ chế phát hiện chủ động. Alert phải:

- Có threshold hợp lý + duration (`for`).
- Gắn runbook link.
- Giảm false positive/noise.

Alert quá nhiều hoặc sai ngữ cảnh sẽ gây “alert fatigue”.

---

### 🔴 Q: What is structured logging and why include correlation IDs? `[Senior]`
**A:** Structured logging (JSON) giúp parse/search/aggregate tự động.

Field nên có:
- timestamp
- level
- message
- service
- env
- trace_id / request_id
- user_id (nếu policy cho phép)

Go example với zap:

```go
logger.Info("create order",
    zap.String("service", "order-api"),
    zap.String("request_id", reqID),
    zap.String("trace_id", traceID),
    zap.String("order_id", orderID),
    zap.Int64("amount", amount),
)
```

Correlation ID giúp nối logs giữa reverse proxy, API gateway, app, và downstream services.

---

### 🟡 Q: What is ELK stack at a high level? `[Mid]`
**A:**

- **Elasticsearch**: lưu trữ + tìm kiếm logs.
- **Logstash**: ingest/parse/transform.
- **Kibana**: visualization + discovery.

Hiện nay nhiều đội dùng biến thể như EFK (Fluent Bit/Fluentd thay Logstash).

---

### 🔴 Q: What problem does OpenTelemetry solve in modern systems? `[Senior]`
**A:** OpenTelemetry (OTel) chuẩn hóa instrument metrics/logs/traces để tránh vendor lock-in. Bạn instrument một lần, export sang backend khác nhau (Jaeger, Tempo, Datadog, etc.).

Lợi ích:
- Consistent semantic conventions.
- Distributed tracing xuyên service tốt hơn.
- Dễ quan sát path chậm trong microservices.

Cross-reference: [02-backend-knowledge/02-microservices.md](./02-backend-knowledge/02-microservices.md)

---

## 5) Infrastructure as Code (IaC)

### 🟡 Q: What are Terraform essentials interviewers expect? `[Mid]`
**A:** Terraform quản lý hạ tầng theo declarative config:

- **Provider**: cloud/API plugin (AWS, GCP, Azure, Kubernetes...)
- **Resource**: đối tượng hạ tầng (VPC, DB, IAM, cluster...)
- **State**: mapping giữa config và hạ tầng thực tế

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"
}

resource "aws_s3_bucket" "logs" {
  bucket = "acme-prod-logs"
}
```

State nên lưu remote backend (S3 + lock table, Terraform Cloud...) để teamwork an toàn.

---

### 🟡 Q: Ansible vs Terraform — what is the key difference? `[Mid]`
**A:**

- **Terraform**: provisioning infrastructure (desired-state resources).
- **Ansible**: configuration management và orchestration trên hosts.

Nhiều hệ thống dùng cả hai:
- Terraform tạo VM/network/security groups.
- Ansible cấu hình package/service trên VM.

---

### 🔴 Q: What is GitOps and why do teams adopt Argo CD/Flux? `[Senior]`
**A:** GitOps: Git là source of truth cho deployment state. Controller (Argo CD/Flux) reconcile cluster về đúng trạng thái trong Git.

Ưu điểm:
- Audit trail rõ.
- Rollback bằng git revert.
- Giảm drift giữa cluster và config.

Yêu cầu:
- Repo structure chuẩn.
- Secret management phù hợp (Sealed Secrets, External Secrets).

---

## 6) Networking for DevOps

### 🟡 Q: L4 vs L7 load balancer — what is the practical difference? `[Mid]`
**A:**

- **L4 LB**: route dựa trên IP/port (TCP/UDP), nhanh, ít ngữ nghĩa HTTP.
- **L7 LB**: route dựa trên HTTP host/path/header/cookie, linh hoạt hơn.

Use-case:
- L4 cho throughput cao, protocol generic.
- L7 cho web/API routing và policy phức tạp.

Cross-ref networking theory: [../shared/01-cs-fundamentals/networking-theory.md](../shared/01-cs-fundamentals/networking-theory.md)

---

### 🟡 Q: What is a reverse proxy and why are Nginx/Envoy popular? `[Mid]`
**A:** Reverse proxy đứng trước upstream services để:

- TLS termination
- Routing/load balancing
- Rate limiting
- Compression/caching
- Authn/authz integration

Nginx phổ biến vì đơn giản/ổn định; Envoy mạnh ở dynamic config, service mesh, observability.

---

### 🟡 Q: How does service discovery typically work in cloud-native systems? `[Mid]`
**A:**

- DNS-based discovery (Kubernetes service DNS: `svc.namespace.svc.cluster.local`).
- Registry-based discovery (Consul, etcd).
- Sidecar/service mesh hỗ trợ discovery + mTLS + policy.

Backend code nên timeout/retry hợp lý khi resolve/call service để tránh cascading failures.

---

### 🔴 Q: What does SSL/TLS termination mean operationally? `[Senior]`
**A:** TLS termination là điểm kết thúc encryption (LB/Ingress/Proxy). Từ đó về backend có thể:

1. HTTP plain trong private network (đơn giản, nhưng phải tin cậy network).
2. Re-encrypt TLS tới backend (end-to-end hơn, phức tạp hơn).

Considerations:
- Certificate rotation automation.
- TLS versions/ciphers policy.
- Forward headers chuẩn (`X-Forwarded-Proto`, `X-Forwarded-For`).

---

## 7) Interview Q&A (Focused Round)

### 🟢 Q1: Why can “works on my machine” happen without containers? `[Junior]`
**A:** Vì môi trường local khác production về OS packages, runtime version, config. Container đóng gói dependency giúp giảm drift môi trường.

---

### 🟡 Q2: Why should you pin base image tags instead of `latest`? `[Mid]`
**A:** `latest` không deterministic, build hôm nay và tuần sau có thể khác nhau. Pin tag/digest giúp reproducible build và dễ audit rollback.

---

### 🔴 Q3: Your pod is Running but service returns 503. What should you check first? `[Senior]`
**A:** Kiểm tra readiness probe và endpoints của service:

1. Pod có Ready=true không?
2. Service selector có match labels của Pod không?
3. Endpoint list có backend IP nào không?
4. NetworkPolicy có chặn traffic không?

---

### 🟡 Q4: What is the risk of setting CPU limits too low? `[Mid]`
**A:** Throttling làm latency spike và timeout tăng, đặc biệt với Go runtime khi goroutines cần CPU để xử lý burst traffic.

---

### 🔴 Q5: Why can blue-green deployment still fail even with instant rollback? `[Senior]`
**A:** Vì migration/state coupling:

- Schema change không backward-compatible.
- Cache format/session format không tương thích.
- External side effects đã xảy ra rồi.

Rollback app version chưa chắc rollback data semantics.

---

### 🟡 Q6: How should you design pipeline gates for production deploy? `[Mid]`
**A:** Nên có tối thiểu:
- Required checks pass (test/lint/security).
- Artifact signed/verified.
- Staging smoke test pass.
- Approval gate cho môi trường critical.

---

### 🔴 Q7: What is an SLO-aware alerting strategy? `[Senior]`
**A:** Alert dựa trên error budget burn rate thay vì threshold cứng đơn giản. Ví dụ kết hợp fast burn + slow burn để bắt cả incident cấp tính và suy giảm kéo dài.

---

### 🟡 Q8: Why is high-cardinality metric dangerous in Prometheus? `[Mid]`
**A:** Cardinality quá cao làm memory usage và query latency tăng mạnh, có thể làm chính hệ monitoring mất ổn định.

Avoid labels như `user_id`, `request_id` trong metrics.

---

### 🔴 Q9: How do you avoid secret leakage in CI logs? `[Senior]`
**A:**
- Dùng secret masking của CI platform.
- Không echo biến secret.
- Principle of least privilege cho tokens.
- Rotate secrets định kỳ và sau incident.

---

### 🟡 Q10: Terraform state file should be protected how? `[Mid]`
**A:** Encrypt at rest, access control chặt, lock state khi apply, backup/versioning state. Không commit state chứa secret vào repo.

---

### 🔴 Q11: In GitOps, who wins if cluster is manually changed? `[Senior]`
**A:** Git wins. Controller sẽ reconcile và ghi đè drift để khôi phục desired state từ repo.

---

### 🟡 Q12: What should be included in a minimal service health endpoint? `[Mid]`
**A:**
- Liveness: chỉ kiểm tra process/event loop cơ bản.
- Readiness: kiểm tra dependency bắt buộc (DB, queue) ở mức nhẹ.
- Trả status code rõ ràng, không expose info nhạy cảm.

Cross-ref API design health endpoints: [02-backend-knowledge/01-api-design.md](./02-backend-knowledge/01-api-design.md)

---

### 🔴 Q13: Why does canary need observability maturity to be effective? `[Senior]`
**A:** Vì quyết định promote/rollback dựa vào metrics và traces theo cohort. Nếu telemetry kém, canary chỉ là “chia traffic mù”, không giảm rủi ro thực sự.

---

### 🟡 Q14: What is the practical role of .dockerignore in CI cost reduction? `[Mid]`
**A:** Giảm build context upload size, tăng tốc build và giảm bandwidth/storage cost, đặc biệt monorepo lớn.

---

### 🔴 Q15: How do you explain Kubernetes to a non-DevOps interviewer quickly? `[Senior]`
**A:** “Kubernetes là hệ điều hành cho container cluster: bạn khai báo trạng thái mong muốn (bao nhiêu instance, expose thế nào, cập nhật ra sao), nó tự giữ hệ thống ở trạng thái đó và tự phục hồi khi có lỗi.”

---

## 8) Practical Scenarios

### 🔴 Q: A deployment succeeded, but p95 latency doubled after release. What is your response plan? `[Senior]`
**A:**

1. Kích hoạt incident protocol, freeze rollout.
2. So sánh metrics theo version label.
3. Kiểm tra CPU/memory throttling, DB query latency, error rate downstream.
4. Xem traces cho endpoint chính.
5. Nếu vượt SLO, rollback/disable feature flag ngay.
6. Mở postmortem: root cause + action items.

---

### 🟡 Q: How do you set up a basic golden path for backend CI/CD in a startup? `[Mid]`
**A:**

- PR: lint + test + build.
- Main merge: build image + scan + push registry.
- Auto deploy staging + smoke test.
- Manual approval production.
- Rollback runbook + on-call ownership.

Mục tiêu là “đơn giản nhưng đáng tin”, không over-engineer từ ngày đầu.

---

### 🔴 Q: You need multi-region reliability. What DevOps topics become mandatory? `[Senior]`
**A:**
- Global load balancing + failover strategy.
- Data replication consistency model.
- Region-aware CI/CD và rollout guardrails.
- Multi-region observability dashboards/alerts.
- Chaos/game-day testing cho failover.

Cross-ref system design reliability: [../shared/02-system-design/system-design-theory.md](../shared/02-system-design/system-design-theory.md)

---

## 9) Rapid-Fire Q&A

### 🟢 Q: Is Docker a replacement for Kubernetes? `[Junior]`
**A:** Không. Docker là công cụ build/run container; Kubernetes là hệ orchestration cho nhiều containers ở scale.

### 🟢 Q: Should you bake secrets directly into Docker image? `[Junior]`
**A:** Tuyệt đối không. Secrets phải inject runtime qua secret manager/env mounts.

### 🟡 Q: Why run tests before building/pushing image in pipeline? `[Mid]`
**A:** Tránh tốn tài nguyên build/push cho commit fail quality gates.

### 🟡 Q: What is a deployment rollout pause useful for? `[Mid]`
**A:** Dừng rollout giữa chừng để quan sát metrics trước khi tiếp tục.

### 🔴 Q: Why can readiness fail while liveness passes? `[Senior]`
**A:** Process vẫn sống (liveness OK) nhưng phụ thuộc bắt buộc chưa sẵn sàng (DB unavailable, warmup chưa xong), nên readiness fail là đúng.

### 🟡 Q: Should logs be plain text or JSON in distributed systems? `[Mid]`
**A:** Ưu tiên JSON structured logs để parse/query tốt hơn.

### 🔴 Q: What is the danger of unlimited retries in CI deploy step? `[Senior]`
**A:** Có thể gây deployment storm, lock contention, và làm outage kéo dài. Retry cần giới hạn + backoff + điều kiện rõ.

### 🟡 Q: Why use immutable image tags (SHA) in Kubernetes manifests? `[Mid]`
**A:** Tránh tag drift, đảm bảo deploy đúng artifact đã test.

### 🔴 Q: How does mTLS differ from one-way TLS in service-to-service calls? `[Senior]`
**A:** mTLS xác thực hai chiều (client và server cùng có cert), tăng trust nội bộ và giảm spoofing risk.

### 🟡 Q: Why is “alert on every 5xx” a bad policy? `[Mid]`
**A:** Dễ noise khi traffic lớn; nên alert theo error rate, duration, và SLO impact.

### 🔴 Q: What is the first anti-pattern you’d fix in a fragile pipeline? `[Senior]`
**A:** Deploy production trực tiếp từ unreviewed branch hoặc thiếu test gates; đây là nguồn rủi ro cao nhất.

### 🟡 Q: Why separate build and deploy permissions in CI? `[Mid]`
**A:** Principle of least privilege, giảm blast radius khi token bị lộ hoặc job bị compromise.

---

## 10) Cross-Reference Map

- Go advanced testing/profiling: [01-golang/05-testing-profiling.md](./01-golang/05-testing-profiling.md)
- Advanced Go patterns: [01-golang/08-advanced-patterns.md](./01-golang/08-advanced-patterns.md)
- Microservices operations: [02-backend-knowledge/02-microservices.md](./02-backend-knowledge/02-microservices.md)
- Distributed reliability: [02-backend-knowledge/03-distributed-systems.md](./02-backend-knowledge/03-distributed-systems.md)
- Networking deep dive: [02-backend-knowledge/06-networking-go.md](./02-backend-knowledge/06-networking-go.md)
- Shared networking theory: [../shared/01-cs-fundamentals/networking-theory.md](../shared/01-cs-fundamentals/networking-theory.md)
- Shared security fundamentals: [../shared/04-security/01-security-fundamentals.md](../shared/04-security/01-security-fundamentals.md)
- Shared system design theory: [../shared/02-system-design/system-design-theory.md](../shared/02-system-design/system-design-theory.md)

---

## 11) Final Interview Checklist

### 🟡 Q: What structure gives a strong DevOps interview answer? `[Mid]`
**A:** Dùng khung 5 bước:

1. **Context**: quy mô hệ thống, constraints.
2. **Design**: pipeline/deployment/observability architecture.
3. **Risk**: failure modes và blast radius.
4. **Controls**: probes, rollback, feature flags, alerts.
5. **Trade-offs**: chi phí vs độ tin cậy vs tốc độ release.

Nếu bạn gắn được câu trả lời với ví dụ thực tế (incident hoặc optimization cụ thể), interviewer sẽ đánh giá rất cao tính thực chiến.
