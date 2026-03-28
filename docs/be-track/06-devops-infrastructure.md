# DevOps & Infrastructure Basics — Nền tảng DevOps và hạ tầng cho Backend Developer

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../00-table-of-contents.md)

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

> 🧠 **Memory Hook:** Docker = **"Bao bì đóng gói chuẩn hóa"** — Giống như bưu điện đóng hàng vào thùng cứng chuẩn (container), dù gửi đi đâu cũng giữ nguyên nội dung. Container ≠ VM: container chia sẻ "mái nhà chung" (kernel host), VM mỗi cái có nhà riêng hẳn. **Multi-stage** = nấu trong bếp công nghiệp, chỉ mang đồ ăn ra bàn — không mang cả bếp.

**Tại sao tồn tại? / Why does this exist?**

Trước Docker, developer gặp vấn đề kinh điển "works on my machine" → **Why?** Mỗi máy có OS/runtime/library version khác nhau → cần cách đóng gói app cùng toàn bộ environment của nó → Container ra đời dựa trên Linux namespaces + cgroups → nhưng cần tooling để build/ship/run → Docker cung cấp CLI + daemon + layer-based image format + registry ecosystem để làm điều đó nhất quán.

---

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn nấu phở tại nhà và muốn giao đến khách hàng y hệt. Thay vì chỉ giao tô phở (code), bạn đóng gói cả bếp mini, nồi, gia vị, và hướng dẫn vào một chiếc hộp chuẩn (container image). Khách mở ra là có ngay phở y chang — dù họ ở Hà Nội hay TP.HCM (dev machine hay production server). **Multi-stage build** = nấu xong rồi chỉ đặt tô phở vào hộp, không đặt cả bếp vào.

---

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
DOCKER BUILD & RUN FLOW:

Dockerfile ──[docker build]──► Image (immutable layers)
                                        │
                                [docker run]
                                        │
                              Container (writable layer on top)
                              ┌─────────────────────────────┐
                              │  Linux Namespaces            │
                              │  PID / NET / MNT / UTS / IPC │ ← process isolation
                              ├─────────────────────────────┤
                              │  cgroups                     │ ← CPU/RAM limits
                              └─────────────────────────────┘

MULTI-STAGE BUILD:
  Stage 1 (builder): golang:1.23-alpine
    COPY go.mod go.sum → go mod download  ← cache layer
    COPY . .
    RUN go build → /out/app

  Stage 2 (final): distroless/static
    COPY --from=builder /out/app .        ← only binary, no compiler
    Final image size: ~10MB vs ~400MB
```

1. **Dockerfile** → blueprint mô tả cách build image từng layer.
2. **Image** → snapshot bất biến, gồm nhiều layers (từng `RUN`/`COPY` instruction).
3. **Container** → instance đang chạy từ image, có writable layer riêng ở trên.
4. **Registry** → kho chứa images (Docker Hub, GHCR, ECR).
5. **Layer cache** → instruction không đổi + input không đổi → reuse layer từ cache.

---

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Layer cache cascade**: Thay đổi bất kỳ instruction nào làm tất cả layers phía **sau** bị invalidated — `COPY . .` trước `go mod download` là anti-pattern phổ biến nhất làm CI chậm.
- **Distroless vs Alpine**: Distroless nhỏ hơn và không có shell (khó bị exploit), nhưng debug rất khó; Alpine có shell nhưng dùng musl libc có thể gây incompatibility với một số C bindings.
- **Xóa file trong RUN layer mới không giảm size**: File đã tồn tại ở layer trước vẫn được đếm — phải gộp lệnh `apt-get install && ... && apt-get clean` trong **cùng một RUN**.
- **USER nonroot**: Container root = host root nếu có container escape; luôn tạo user không đặc quyền trong production.
- **Docker socket mount** (`/var/run/docker.sock`): Container có socket = container có quyền root trên host — nguy hiểm tuyệt đối, tránh trừ khi thật sự cần.

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                                      | Đúng là                                                                  |
| ----------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `COPY . .` đặt trước `go mod download`                | Invalidates dependency cache mỗi khi bất kỳ file code nào thay đổi               | Copy `go.mod`/`go.sum` trước → download deps → rồi mới `COPY . .`        |
| Dùng `latest` làm base image tag                      | Non-deterministic: build hôm nay và tuần sau có thể khác nhau                    | Pin exact tag: `golang:1.23-alpine` hoặc digest `@sha256:...`            |
| Hardcode secrets trong Dockerfile (`ENV API_KEY=...`) | Lộ trong image layers; `docker history` thấy được plaintext                      | Inject runtime qua env mounts, secret manager, hoặc `--secret` khi build |
| Không dùng `.dockerignore`                            | Upload toàn bộ `.git`, `node_modules` vào build context làm CI chậm và image lớn | Luôn có `.dockerignore` loại `.git`, `dist`, `*.log`, `*.md`             |

---

**🎯 Interview Pattern:**

- Khi thấy: câu hỏi "Container là gì?" hoặc "Tại sao dùng Docker thay VM?"
- Nhớ đến: Container = process isolation bằng namespaces + cgroups; Docker = tooling để build/ship/run; image = immutable layers
- Mở đầu: "Container cô lập process ở mức OS dùng Linux namespaces và cgroups — nhẹ và khởi động nhanh vì chia sẻ kernel host, khác VM phải boot cả guest OS. Docker cung cấp tooling chuẩn để build image, push lên registry, và run nhất quán ở mọi môi trường."

---

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Linux Process & Networking Basics](../shared/01-cs-fundamentals/networking-theory.md)
- ➡️ Để hiểu tiếp: [Kubernetes Basics](#2-kubernetes-basics)

---

### 🟢 Q: What is containerization, and how is it different from VMs? `[Junior]`

**A:**

- **Container**: cô lập process ở mức OS (namespaces + cgroups), chia sẻ kernel host.
- **VM**: ảo hóa phần cứng, mỗi VM có guest OS riêng.

So sánh nhanh:

| Tiêu chí    | Container                 | VM                   |
| ----------- | ------------------------- | -------------------- |
| Startup     | Nhanh (ms-giây)           | Chậm hơn (giây-phút) |
| Overhead    | Thấp                      | Cao hơn              |
| Isolation   | Mức process/kernel        | Mức OS/hypervisor    |
| Portability | Rất tốt cho app packaging | Tốt nhưng nặng       |

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

**✅ Self-Check — Docker Fundamentals:**

| #   | Loại           | Câu hỏi                                                                                                |
| --- | -------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Container khác VM ở điểm cốt lõi nào về isolation mechanism?                                           |
| 2   | 🎨 Visual      | Vẽ flow từ Dockerfile → multi-stage build → final image → container với layers cụ thể                  |
| 3   | 🛠️ Application | Viết Dockerfile multi-stage cho Go app: tối ưu layer cache và dùng distroless base                     |
| 4   | 🐛 Debug       | Go app trong container không kết nối được Postgres — `localhost:5432` bị từ chối — nguyên nhân và fix? |
| 5   | 🎓 Teach       | Giải thích Docker layer caching cho junior mới join team: tại sao thứ tự COPY quan trọng?              |

---

## 2) Kubernetes Basics

> 🧠 **Memory Hook:** K8s = **"Quản đốc nhà máy thông minh"** — Bạn chỉ khai báo "Tôi muốn 3 container chạy service này, tự restart nếu chết, tự scale nếu bận." K8s lo phần còn lại. **Pod** = nhóm công nhân, **Deployment** = bảng mô tả ca làm, **Service** = số điện thoại liên lạc nhóm (stable endpoint), **HPA** = gọi thêm thời vụ khi khách đông.

**Tại sao tồn tại? / Why does this exist?**

Khi chạy nhiều container trên nhiều máy, cần ai đó quyết định container nào chạy ở máy nào → **Why?** Scheduling phức tạp khi scale lên hàng trăm node → cần self-healing khi container crash → cần rolling update không down-time → cần service discovery nội bộ → cần autoscaling theo load → Kubernetes giải quyết tất cả bằng declarative model: bạn khai báo **what** (desired state), K8s tự lo **how** và duy trì trạng thái đó liên tục.

---

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng K8s là bộ phận HR của tập đoàn lớn. Bạn (developer) nộp yêu cầu: "Cần 3 nhân viên phục vụ quầy A, thay thế ngay nếu ai nghỉ, thêm người nếu khách đông." HR (Control Plane) phân công nhân sự (schedule pods lên nodes), theo dõi ai nghỉ (health checks), và gọi thêm thời vụ (HPA scale out) khi cần. Bạn không cần biết nhân viên đang ngồi bàn nào — chỉ cần gọi số điện thoại bộ phận (Service) là có người nghe máy.

---

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
K8S TRAFFIC & CONTROL FLOW:

User ──► Ingress (nginx/traefik) ──► Service (ClusterIP) ──► Pods
                                          │
                                  [label selector match]
                                          │
                           Pod 1 (app:api)  Pod 2 (app:api)  Pod 3 (app:api)
                                 │
                         [startupProbe]   → if FAIL → not yet checked liveness
                         [readinessProbe] → if FAIL → removed from endpoints
                         [livenessProbe]  → if FAIL → container restarted

OBJECT HIERARCHY:
  Deployment
    └── ReplicaSet (old) ← kept for rollback
    └── ReplicaSet (new) ← manages new pods
          └── Pod 1
          └── Pod 2
          └── Pod 3

HPA: monitors CPU/memory metrics → adjusts replicas (minReplicas ↔ maxReplicas)
```

1. **Pod**: đơn vị nhỏ nhất, 1+ container chia sẻ network namespace + volume.
2. **Deployment** → quản lý **ReplicaSet** → quản lý **Pods** (giữ old RS để rollback).
3. **Service**: stable DNS + virtual IP, load balance tới pods qua label selector.
4. **ConfigMap/Secret**: inject config không cần rebuild image.
5. **HPA**: autoscale replicas theo CPU/memory/custom metrics.

---

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Pending pod nguyên nhân**: thường do `requests` > available node resource, hoặc taint/affinity không match — luôn `kubectl describe pod` xem Events section trước khi debug.
- **CrashLoopBackOff**: container khởi động rồi crash ngay — xem logs của lần chạy trước bằng `kubectl logs --previous`; exponential backoff tăng delay mỗi lần.
- **Service selector vs Pod label mismatch**: 503 bí ẩn thường do label không khớp — kiểm tra `kubectl get endpoints <svc>` nếu empty thì selector sai.
- **Secret chỉ là base64, không encrypt**: mặc định etcd lưu Secret ở plaintext base64 — cần bật Encryption at Rest hoặc dùng External Secrets Operator kết nối Vault/AWS SM.
- **Image pull policy `Always`**: mỗi pod start đều pull image từ registry → cold start chậm hơn; dùng `IfNotPresent` với immutable tags cho production.

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                                                       | Đúng là                                                                             |
| ----------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Không đặt resource `requests`/`limits`          | Pod có thể dùng hết tài nguyên node (noisy neighbor), HPA có metrics baseline sai | Profile thực tế rồi đặt requests phù hợp; limits tối thiểu 2x requests              |
| Dùng liveness probe để check DB connectivity    | Nếu DB chậm/restart, liveness fail → pod restart loop vô tận dù app không lỗi     | Liveness chỉ check process health (deadlock); readiness check dependencies          |
| Hardcode image tag `latest` trong manifest      | Deploy không deterministic; `kubectl rollout undo` không biết trở về đâu          | Dùng exact SHA digest hoặc semver tag (`v1.4.2`)                                    |
| Một liveness/readiness endpoint cho cả ba probe | Không phân biệt "process alive" vs "sẵn sàng traffic" vs "đang khởi động"         | Ba probe riêng: `/healthz` (liveness), `/readyz` (readiness), `/startupz` (startup) |

---

**🎯 Interview Pattern:**

- Khi thấy: "Kubernetes giải quyết vấn đề gì?" hoặc "Deployment vs ReplicaSet khác nhau sao?"
- Nhớ đến: K8s = declarative orchestration; Deployment → ReplicaSet → Pod; Service = stable endpoint qua label selector
- Mở đầu: "Kubernetes giải quyết orchestration container ở scale: tự schedule lên nodes phù hợp, self-heal khi pod crash, rolling update không down-time, và service discovery nội bộ — tất cả từ một declarative desired state config. Deployment quản lý ReplicaSet để có thể rollback; Service là stable endpoint không phụ thuộc pod IP."

---

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Docker Fundamentals](#1-docker-fundamentals)
- ➡️ Để hiểu tiếp: [CI/CD Pipelines](#3-cicd-pipelines)

---

> **Visual Overview** / Sơ Đồ Kubernetes:
>
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

Nói ngắn gọn: "Kubernetes biến hạ tầng động thành một control plane nhất quán."

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

- **Liveness**: process có bị "kẹt" cần restart không.
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

**✅ Self-Check — Kubernetes Basics:**

| #   | Loại           | Câu hỏi                                                                                 |
| --- | -------------- | --------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Deployment, ReplicaSet, Pod quan hệ quản lý nhau thế nào? Tại sao Deployment giữ RS cũ? |
| 2   | 🎨 Visual      | Vẽ sơ đồ request flow: browser → Ingress → Service → Pod với label selector             |
| 3   | 🛠️ Application | Viết HPA config scale Deployment từ 3→15 replicas dựa trên CPU 65%                      |
| 4   | 🐛 Debug       | Pod status là Running nhưng `curl` service trả 503 — debug từng bước bằng kubectl       |
| 5   | 🎓 Teach       | Giải thích 3 loại probe (liveness/readiness/startup) cho junior: khi nào cần từng loại? |

---

## 3) CI/CD Pipelines

> 🧠 **Memory Hook:** CI/CD = **"Băng chuyền nhà máy tự động"** — CI là dây chuyền kiểm tra chất lượng (test → lint → security scan), CD là dây chuyền đóng gói và giao hàng (build image → deploy staging → deploy prod). Hàng lỗi thì dừng băng chuyền ngay, không để qua công đoạn sau. **Artifact immutability** = cùng một hộp bánh từ QA đến cửa hàng, không nướng lại.

**Tại sao tồn tại? / Why does this exist?**

Khi team lớn, merge code thủ công và deploy tay tốn thời gian, dễ lỗi, không audit được → **Why?** Integration conflict tăng theo số developer → cần validate tự động mỗi commit để phát hiện sớm → cần artifact được build nhất quán một lần duy nhất → cần deploy lặp lại không phụ thuộc ai ngồi terminal → CI/CD pipeline tự động hóa toàn bộ vòng lặp này, giảm lead time từ commit đến production từ ngày/tuần xuống giờ/phút.

---

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn mở tiệm bánh mì dây chuyền. **CI** = nhân viên kiểm tra nguyên liệu và hương vị mỗi mẻ bánh trước khi đưa vào lò (test + lint + security). Nếu nguyên liệu hỏng thì dừng lại ngay, không tiếp tục làm. **CD** = quy trình tự động đóng gói bánh và chuyển đến cửa hàng (deploy). Mẻ bánh được đóng gói một lần duy nhất và cùng hộp đó đi từ kho đến cửa hàng Hà Nội và TP.HCM — không nướng lại ở mỗi điểm (artifact immutability).

---

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
MATURE CI/CD PIPELINE FLOW:

PR opened/updated
        │
  [1] Lint + vet ──────────── FAIL → block merge, notify author
        │
  [2] Unit tests (-race) ───── FAIL → block merge
        │
  [3] Integration tests ────── FAIL → block merge
        │
  [4] Security scan ────────── FAIL → block merge (SAST + deps + container)
        │
  [5] Build image ─────────── tag: ghcr.io/app:$GIT_SHA (immutable)
        │
  [6] Push to registry
        │
  [7] Deploy staging ──────── same artifact, different config
        │
  [8] Smoke test staging ───── FAIL → alert, rollback staging, NO prod deploy
        │
  [9] Manual approval gate ──► Deploy production (same image from step 5)

KEY PRINCIPLE: Build once, promote everywhere (immutable artifact)
```

Key principles:

1. **Fail fast**: tốn ít nhất trước (`lint < test < build < scan`).
2. **Artifact immutability**: image SHA không đổi từ staging đến production.
3. **Separation of concerns**: build job ≠ deploy job (khác quyền, khác trust level).
4. **Idempotent deploy**: chạy lại pipeline không gây side effects.

---

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Secret leakage in CI logs**: `echo $SECRET_KEY` trong pipeline script = lộ giá trị trong logs; dùng secret masking của CI platform và chỉ print prefix.
- **Flaky tests destroy trust**: flaky test trong CI làm developer bỏ qua failures → tệ hơn không có CI; quarantine flaky tests vào separate job ngay khi phát hiện.
- **Branch-based deploy to production**: deploy từ feature branch thẳng lên prod là anti-pattern phổ biến ở startup — enforce chỉ deploy từ `main`/release branch.
- **Cache poisoning risk**: CI cache không được hash-keyed có thể bị poisoned bởi supply chain attack — luôn dùng content-addressable cache keys (`hashFiles('**/go.sum')`).
- **Rolling vs blue-green vs canary**: rolling = đơn giản/tiết kiệm tài nguyên; blue-green = rollback nhanh/tốn 2x resource; canary = giảm blast radius nhất nhưng cần observability mature.

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                                           | Đúng là                                                                     |
| ----------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Build và deploy chung job với quyền production  | Compromise bước build = compromise production deploy                  | Tách build job (ít quyền) vs deploy job (cần approval + scoped token)       |
| Không cache Go modules trong CI                 | `go mod download` chạy mỗi pipeline ~2-5 phút thừa                    | Cache `~/go/pkg/mod` + `~/.cache/go-build` theo `hashFiles('**/go.sum')`    |
| Build image mới khi promote từ staging lên prod | Staging test artifact A, production deploy artifact B — không đảm bảo | Build image một lần, push với SHA tag, promote cùng SHA qua environments    |
| Skip smoke test sau deploy staging              | Không phát hiện regression từ production-specific config/secret       | Luôn có health endpoint + smoke test request sau mỗi deploy, gate tiếp theo |

---

**🎯 Interview Pattern:**

- Khi thấy: "Mô tả CI/CD pipeline của bạn?" hoặc "So sánh rolling vs blue-green vs canary?"
- Nhớ đến: CI = validate (fail fast); CD = deliver (immutable artifact, promote); strategies = rolling/blue-green/canary theo trade-off resource vs speed vs risk
- Mở đầu: "Pipeline tôi có 3 phase: CI validates mỗi commit (lint → test → security scan → fail fast), CD build immutable artifact (một lần duy nhất) rồi promote cùng artifact qua staging → approval gate → production. Deployment strategy tùy trade-off: rolling đơn giản, canary cho production lớn khi cần quan sát metrics trước khi promote."

---

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Docker Fundamentals](#1-docker-fundamentals), [Kubernetes Basics](#2-kubernetes-basics)
- ➡️ Để hiểu tiếp: [Monitoring & Observability](#4-monitoring--observability)

---

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

**✅ Self-Check — CI/CD Pipelines:**

| #   | Loại           | Câu hỏi                                                                               |
| --- | -------------- | ------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | CI khác CD như thế nào? Kể 3 stage quan trọng nhất và lý do thứ tự fail-fast          |
| 2   | 🎨 Visual      | Vẽ pipeline flow từ PR merge đến production với gate points và rollback arrows        |
| 3   | 🛠️ Application | Viết GitHub Actions workflow: test (race) + build Docker image (chỉ khi merge main)   |
| 4   | 🐛 Debug       | Pipeline build pass, staging deploy xong, nhưng smoke test trả 503 — kiểm tra gì?     |
| 5   | 🎓 Teach       | Giải thích rolling vs blue-green vs canary cho PM không biết kỹ thuật: trade-off nào? |

---

## 4) Monitoring & Observability

> 🧠 **Memory Hook:** Observability = **"Bộ ba mắt của bác sĩ"** — **Metrics** là máy đo nhiệt độ/huyết áp tổng hợp (số đo nhanh, biết _có gì bất thường_). **Logs** là hồ sơ bệnh án chi tiết (biết _chính xác event gì xảy ra lúc mấy giờ_). **Traces** là camera theo chân bệnh nhân qua từng khoa (biết _request đi qua đâu bị chậm_). Thiếu một trong ba, chẩn đoán bệnh hệ thống sẽ mù.

**Tại sao tồn tại? / Why does this exist?**

Production system thỉnh thoảng lỗi bí ẩn không ai biết tại sao → **Why?** Không có dữ liệu thì không thể debug → cần metrics để phát hiện ngưỡng bất thường → nhưng metrics không cho biết event cụ thể nào xảy ra → cần logs → nhưng logs trong microservices không trace được request đi qua đâu → cần distributed traces → ba pillar bổ sung nhau tạo thành observability; thiếu một cái là mù một góc nhìn.

---

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bệnh viện lớn. **Metrics** = bảng điện tử trung tâm hiển thị nhiệt độ/huyết áp tổng hợp của 100 bệnh nhân — nhìn một cái biết ai bất thường. **Logs** = hồ sơ bệnh án chi tiết: bệnh nhân X lúc 14:32 dùng thuốc Y, lúc 14:45 nhiệt độ tăng. **Traces** = camera theo chân bệnh nhân: vào viện (request vào) → phòng khám A (service A) → xét nghiệm B (service B) → bị kẹt 2 tiếng ở phòng chờ C (service C bottleneck). **Correlation ID** = số hồ sơ bệnh nhân, dùng để nối cả 3 nguồn lại.

---

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
THREE PILLARS — INTERACTION MODEL:

Request ──────────────────────────────────────────────────────►
         Service A ──► Service B ──► Service C (DB call slow)
              │              │              │
         [emit metrics] [emit logs]   [emit span]
              │              │              │
              ▼              ▼              ▼
         Prometheus       Loki/ELK      Jaeger/Tempo
         (scrape /metrics) (push logs)  (collect spans)
              │              │              │
              └──────────────┴──────────────┘
                                    │
                           Grafana Dashboard
                           (unified by trace_id)

ALERT STRATEGY (SLO-based):
  ❌ Bad:  alert when 5xx count > 10          ← threshold: ignores traffic volume
  ✅ Good: alert when error_rate > 1% for 5m  ← rate: traffic-aware
  ✅ Best: alert on error budget burn rate    ← SLO-aware: fast + slow burn
```

1. **Metrics**: aggregated numbers over time — `rate()`, `histogram_quantile()` trong PromQL.
2. **Logs**: per-event structured JSON với trace_id để correlate.
3. **Traces**: per-request spans qua services, identify bottleneck.
4. **Alert**: symptom-based (latency/error rate) không phải cause-based (CPU%).
5. **Correlation ID**: `trace_id` nối metrics → logs → traces cho cùng request.

---

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **High-cardinality metrics**: label `user_id` hay `request_id` trong Prometheus → memory explosion (hàng triệu time series); high-cardinality data thuộc về logs/traces, không phải metrics.
- **Alert fatigue**: quá nhiều noise làm on-call mất trust, bắt đầu bỏ qua alert → implement error budget burn rate (fast burn: 14x trong 1h; slow burn: 1x trong 3 ngày).
- **Log sampling**: log 100% request ở high volume tốn storage lớn — sample 1-5% cho success, 100% cho errors/slow requests.
- **Trace sampling**: distributed tracing có overhead không nhỏ — tail-based sampling (chỉ giữ trace của slow/error requests) hiệu quả hơn head-based sampling cứng 10%.
- **Dashboard ≠ alert**: dashboard cho investigation (thụ động), alert cho detection (chủ động) — đừng bắt on-call ngồi nhìn dashboard; dashboard là công cụ sau khi đã nhận alert.

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                             | Tại sao sai                                                     | Đúng là                                                                            |
| --------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Alert mỗi khi có 5xx response                       | Noise cao khi traffic lớn, gây alert fatigue, on-call bỏ qua    | Alert theo error rate % + sustained duration (VD: >1% error trong 5 phút)          |
| Dùng plain text logs trong distributed system       | Khó parse, không thể correlate qua services, search chậm        | Structured JSON logs với `trace_id`, `request_id`, `service`, `level`, `timestamp` |
| Không propagate correlation ID                      | Không thể trace request qua API gateway → service A → service B | Inject `request_id`/`trace_id` từ entry point, propagate qua HTTP headers          |
| Label Prometheus metrics với `user_id`/`request_id` | Cardinality explosion → OOM Prometheus → hệ monitoring sập      | Dùng logs/traces cho high-cardinality; metrics chỉ dùng low-cardinality labels     |

---

**🎯 Interview Pattern:**

- Khi thấy: "Làm sao debug production incident?" hoặc "Three pillars of observability là gì?"
- Nhớ đến: Metrics=_có gì bất thường_, Logs=_chính xác event gì_, Traces=_request đi đâu bị chậm_; correlation ID nối 3 nguồn
- Mở đầu: "Tôi dùng 3 pillars: Metrics cho thấy _có spike_ (Prometheus/Grafana), Logs cho biết _event cụ thể gì xảy ra_ (ELK/Loki), Traces cho thấy _request bottleneck ở service nào_ (Jaeger/Tempo). Tôi correlate 3 nguồn bằng `trace_id` — trong 5 phút tôi biết incident ở đâu thay vì mò mẫm."

---

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [CI/CD Pipelines](#3-cicd-pipelines), [Microservices](./02-backend-knowledge/02-microservices.md)
- ➡️ Để hiểu tiếp: [Infrastructure as Code](#5-infrastructure-as-code-iac)

---

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

Alert quá nhiều hoặc sai ngữ cảnh sẽ gây "alert fatigue".

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

**✅ Self-Check — Monitoring & Observability:**

| #   | Loại           | Câu hỏi                                                                                 |
| --- | -------------- | --------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Ba pillars là gì? Mỗi pillar trả lời câu hỏi nào khác nhau?                             |
| 2   | 🎨 Visual      | Vẽ sơ đồ: Go app emit metrics/logs/traces → Prometheus/Loki/Jaeger → Grafana            |
| 3   | 🛠️ Application | Viết 2 PromQL queries: (1) error rate 5xx trong 5 phút, (2) p95 latency                 |
| 4   | 🐛 Debug       | P95 latency tăng gấp đôi sau deploy — dùng metrics → logs → traces investigate thế nào? |
| 5   | 🎓 Teach       | Giải thích tại sao alert theo error budget burn rate tốt hơn alert threshold cứng       |

---

## 5) Infrastructure as Code (IaC)

> 🧠 **Memory Hook:** IaC = **"Công thức nấu ăn cho hạ tầng"** — Thay vì vào bếp click click tay trên AWS Console (manual, snowflake), bạn viết recipe (Terraform config). Ai nấu cũng ra món y chang, review được, reproduce được, rollback được bằng git revert. **Terraform** = khai báo nguyên liệu cần (infrastructure provisioning). **Ansible** = hướng dẫn từng bước nấu trên máy có sẵn (configuration management). **GitOps** = Git là sách công thức chính thức duy nhất.

**Tại sao tồn tại? / Why does this exist?**

Provisioning hạ tầng thủ công qua console tốn thời gian và không reproducible → **Why?** Server config drift qua thời gian khi ai đó sửa tay → "snowflake servers" không ai dám thay vì không biết nó được config thế nào → cần mô tả hạ tầng như code để version control, review, reproduce bất kỳ lúc nào → IaC ra đời → GitOps đẩy xa hơn: Git là single source of truth cho cả deployment state, controller tự reconcile cluster về đúng trạng thái trong repo.

---

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng xây nhà. Thay vì thợ xây tự ý quyết định mỗi ngày (manual provisioning), bạn có **bản vẽ kỹ thuật chi tiết** (Terraform config) — thợ nào cũng xây đúng, lần nào cũng như nhau. Bản vẽ lưu trong tủ hồ sơ (Git), mỗi thay đổi đều có chữ ký phê duyệt (PR review + approval). Nếu nhà bị sập (incident), dùng lại bản vẽ xây lại y hệt trong 10 phút thay vì nhớ lại click click gì trên console.

---

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
TERRAFORM WORKFLOW:

terraform init    → Download providers + modules
        │
terraform plan    → Diff: desired state vs actual state (DRY RUN)
        │          Output: "+ create 3, ~ modify 1, - destroy 0"
        │          ← ALWAYS review this before apply
        │
terraform apply   → Execute changes via cloud provider API
        │
        └──► Updates terraform.tfstate (source of truth mapping)

REMOTE STATE (Team Safety):
  Local tfstate ──DANGER: git conflict, no lock──►
  Remote: S3 bucket (encrypted at rest)
          + DynamoDB table (state lock)
          ← Prevents concurrent apply corruption

GITOPS FLOW (Argo CD/Flux):
  Git repo (desired state)
       │
       │ controller watches
       ▼
  K8s cluster (actual state)
       │
       │ if drift detected
       └──► auto-reconcile back to Git state
```

1. **Provider**: plugin kết nối cloud API (`aws`, `google`, `kubernetes`...).
2. **Resource**: đối tượng cần quản lý (`aws_s3_bucket`, `kubernetes_deployment`...).
3. **State**: file mapping config → actual infrastructure (bảo vệ kỹ!).
4. **Module**: bundle tái sử dụng (giống library cho Terraform).
5. **GitOps**: Git = source of truth; controller reconcile cluster liên tục.

---

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **State lock timeout**: ai đó `terraform apply` bị interrupt không release lock → `terraform force-unlock <lock_id>` nhưng cẩn thận, verify không có apply đang chạy trước.
- **`terraform destroy` accident**: một lệnh có thể xóa production database — dùng `lifecycle { prevent_destroy = true }`, separate workspace, IAM deny `terraform:destroy` cho prod.
- **Drift detection**: ai đó sửa tay qua console → state không khớp thực tế → `terraform plan` hiện diff; GitOps controllers làm điều này tự động và liên tục.
- **Sensitive values in state**: state file chứa plaintext values (DB passwords, API keys) — encrypt at rest bắt buộc, restrict S3 bucket access, không bao giờ commit vào repo.
- **Module version pinning**: không pin version module → breaking changes ngầm khi module author release version mới; luôn `version = "~> 3.0"`.

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                              | Tại sao sai                                                              | Đúng là                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Commit `terraform.tfstate` vào Git repo              | State chứa sensitive data plaintext; conflict khi nhiều người apply      | Dùng remote state backend: S3 (encrypted) + DynamoDB (lock)                   |
| `terraform apply` không xem `plan` trước             | Không biết có `destroy` resource nào không; có thể xóa nhầm DB           | Luôn review `plan` output, đặc biệt chú ý dòng `-` (destroy)                  |
| Dùng một workspace cho tất cả environments           | Dev action có thể ảnh hưởng production state; không isolate blast radius | Tách workspace/directory theo env: `envs/dev/`, `envs/staging/`, `envs/prod/` |
| Không đặt `prevent_destroy` cho resources quan trọng | `terraform destroy` hoặc resource replacement sẽ xóa DB/network          | `lifecycle { prevent_destroy = true }` cho RDS, VPC, core resources           |

---

**🎯 Interview Pattern:**

- Khi thấy: "Terraform là gì?" hoặc "GitOps là gì và tại sao dùng Argo CD?"
- Nhớ đến: IaC = hạ tầng như code (version/review/reproduce); Terraform = declarative desired state; GitOps = Git as source of truth, controller reconciles
- Mở đầu: "IaC cho phép chúng tôi provision hạ tầng như code — version control, code review, và reproducible. Terraform dùng declarative config mô tả desired state, `plan` cho thấy diff trước khi apply. GitOps đẩy xa hơn: Git là source of truth cho deployment state, Argo CD tự reconcile cluster về đúng trạng thái trong repo, drift được phát hiện và fix tự động."

---

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Kubernetes Basics](#2-kubernetes-basics), [CI/CD Pipelines](#3-cicd-pipelines)
- ➡️ Để hiểu tiếp: [Networking for DevOps](#6-networking-for-devops)

---

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

**✅ Self-Check — Infrastructure as Code:**

| #   | Loại           | Câu hỏi                                                                                |
| --- | -------------- | -------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Terraform state là gì? Tại sao cần remote backend và state lock?                       |
| 2   | 🎨 Visual      | Vẽ Terraform workflow: init → plan → apply với remote state S3 + DynamoDB lock         |
| 3   | 🛠️ Application | Viết Terraform resource tạo S3 bucket có versioning enabled và `prevent_destroy`       |
| 4   | 🐛 Debug       | `terraform apply` báo lỗi "Error acquiring state lock" — có nghĩa gì và xử lý thế nào? |
| 5   | 🎓 Teach       | Giải thích GitOps cho developer mới: tại sao `git revert` = rollback deployment?       |

---

## 6) Networking for DevOps

> 🧠 **Memory Hook:** DevOps Networking = **"Hệ thống đường giao thông thành phố"** — **L4 LB** như trạm thu phí tự động (biết xe từ đường nào, làn nào — IP/port — không cần biết hàng chở gì). **L7 LB** như cảnh sát giao thông thông minh (đọc được nội dung kiện hàng — HTTP host/path/header — phân luồng khác nhau theo loại). **TLS termination** = cổng bảo mật tập trung đầu vào. **Reverse proxy** = trạm trung chuyển đa năng.

**Tại sao tồn tại? / Why does this exist?**

Nhiều services cần expose ra internet nhưng không thể expose trực tiếp từng service → **Why?** Security risk khi để nội bộ thẳng ra internet → cần single entry point để control TLS, auth, rate limit → cần distribute traffic giữa nhiều instances → cần services tìm thấy nhau khi IP thay đổi liên tục (pod IP trong K8s) → networking layer giải quyết tất cả: routing, security, discovery, observability tại edge.

---

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bưu điện trung tâm lớn (L7 reverse proxy). Tất cả thư đều vào **một cửa duy nhất** (entry point/Ingress). Nhân viên bưu điện đọc địa chỉ chi tiết trên phong bì (HTTP path: `/users`, `/orders`) rồi chuyển đến đúng bộ phận (service). Thư quan trọng được đặt trong phong bì bảo mật (TLS — chỉ cần mở khóa một lần ở cửa, bên trong không cần). Nếu bộ phận nào bận, bưu điện tự chia thư cho nhiều nhân viên (load balance). Thư đến từ địa chỉ lạ không có xác nhận thì từ chối (auth/rate limit).

---

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
PRODUCTION TRAFFIC FLOW:

Internet
    │
    ▼ DNS resolve
[Global LB / CDN edge]     ← anycast, geographic routing
    │
    │ TLS termination       ← cert managed here (Let's Encrypt/ACM)
    ▼
[L7 Ingress / Reverse Proxy]  ← nginx / envoy / traefik
    │ host: api.example.com
    │ path: /users/* ──────────► [user-svc ClusterIP] ──► [Pod 1] [Pod 2] [Pod 3]
    │ path: /orders/* ─────────► [order-svc ClusterIP] ──► [Pod A] [Pod B]
    │ path: /admin/* + auth ───► [admin-svc ClusterIP]
    │
    └── rate limit, cors, access log, compression (all at Ingress layer)

SERVICE DISCOVERY OPTIONS:
  K8s DNS:      svc-name.namespace.svc.cluster.local → ClusterIP
  Consul:       dynamic registry + health check → any IP
  Service mesh: Istio/Linkerd sidecar → mTLS + policy + observability
```

1. **L4 LB**: route theo IP/port (TCP) — nhanh, không hiểu HTTP content.
2. **L7 LB/Ingress**: route theo HTTP host/path/header — linh hoạt, policy phức tạp.
3. **TLS termination**: decrypt TLS một lần tại edge; backend nhận HTTP (đơn giản) hoặc re-encrypt (secure hơn).
4. **Reverse proxy**: single entry point — TLS, routing, rate limit, authn, logging.
5. **Service discovery**: K8s DNS (built-in) > Consul (flexible) > service mesh (full-featured + overhead).

---

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **mTLS complexity**: mutual TLS trong service mesh tăng security nhưng cần cert rotation automation và thêm latency overhead từ sidecar — không phải silver bullet, trade-off vs operational complexity.
- **Connection draining**: khi scale down hoặc rolling update, pod cần drain in-flight requests trước khi shutdown (`terminationGracePeriodSeconds`); không có draining = user thấy error mid-request.
- **DNS caching TTL**: client cache DNS lâu → không route đến pod mới sau scale-out; đặt TTL thấp (5-30s) hoặc dùng LB làm trung gian giải quyết hoàn toàn.
- **X-Forwarded-For trust**: tin bừa header `X-Forwarded-For` = dễ bị IP spoofing; chỉ trust từ reverse proxy tin cậy, kiểm tra số hop, hoặc dùng `PROXY protocol`.
- **NodePort trong production cloud**: expose port trực tiếp trên tất cả nodes, bypass firewall logic, kém bảo mật và tốn tiền; dùng Ingress + ClusterIP là best practice.

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                                   | Đúng là                                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Kết nối service bằng `localhost` trong Docker Compose | `localhost` trong container là container đó, không phải host hay service khác | Dùng service name làm hostname: `db:5432`, `redis:6379`                                  |
| Không forward `X-Forwarded-*` headers qua proxy       | Backend thấy IP của proxy (VD: `10.0.0.1`), không thấy IP thật của client     | Config proxy: `proxy_set_header X-Forwarded-For $remote_addr; X-Forwarded-Proto $scheme` |
| Dùng NodePort service cho production cloud            | Expose port trực tiếp trên mọi node, kém bảo mật, không scalable              | Ingress + ClusterIP service: single entry point, TLS ở edge, internal HTTP               |
| TLS chỉ ở edge, HTTP cleartext toàn bộ nội bộ         | Attacker trong internal network có thể intercept; zero-trust model fail       | Xem xét mTLS cho service-to-service hoặc ít nhất TLS với cert validation nội bộ          |

---

**🎯 Interview Pattern:**

- Khi thấy: "L4 vs L7 load balancer khác nhau sao?" hoặc "TLS termination ở đâu trong architecture?"
- Nhớ đến: L4 = TCP/IP routing (fast, no HTTP context); L7 = HTTP-aware (flexible, host/path/header); TLS terminate ở edge (đơn giản) vs re-encrypt (secure)
- Mở đầu: "L4 LB route theo IP/port nên nhanh nhưng không hiểu HTTP. L7 LB hiểu host/path/header nên linh hoạt — tôi thường dùng Ingress làm L7 với ClusterIP phía sau. TLS terminate ở Ingress để đơn giản hóa backend; nếu cần end-to-end security thì re-encrypt đến backend hoặc dùng mTLS qua service mesh."

---

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Infrastructure as Code](#5-infrastructure-as-code-iac), [Networking Theory](../shared/01-cs-fundamentals/networking-theory.md)
- ➡️ Để hiểu tiếp: [Distributed Systems](./02-backend-knowledge/03-distributed-systems.md)

---

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

**✅ Self-Check — Networking for DevOps:**

| #   | Loại           | Câu hỏi                                                                                      |
| --- | -------------- | -------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | L4 vs L7 LB khác nhau cơ bản ở điểm nào? Cho ví dụ use-case phù hợp từng loại                |
| 2   | 🎨 Visual      | Vẽ traffic flow: Internet → DNS → TLS termination → Ingress → Service → Pod                  |
| 3   | 🛠️ Application | Viết Kubernetes Ingress route `/users` → user-service và `/orders` → order-service với TLS   |
| 4   | 🐛 Debug       | Service A gọi service B bằng `localhost:8080` trong Kubernetes nhưng timeout — vấn đề là gì? |
| 5   | 🎓 Teach       | Giải thích tại sao cần TLS termination tại Ingress thay vì expose HTTP thẳng ra internet     |

💬 **Feynman Prompt:** Hãy giải thích hành trình đầy đủ của một HTTP request từ lúc user bấm Enter trên browser — qua DNS, TLS termination, Ingress, Service, Pod, xử lý trong Go app, emit structured log với trace_id, metrics được Prometheus scrape — như thể bạn đang giảng cho sinh viên năm 2 chưa biết gì về DevOps. Không được dùng jargon mà không giải thích.

---

## 7) Interview Q&A (Focused Round)

### 🟢 Q1: Why can "works on my machine" happen without containers? `[Junior]`

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

**A:** Vì quyết định promote/rollback dựa vào metrics và traces theo cohort. Nếu telemetry kém, canary chỉ là "chia traffic mù", không giảm rủi ro thực sự.

---

### 🟡 Q14: What is the practical role of .dockerignore in CI cost reduction? `[Mid]`

**A:** Giảm build context upload size, tăng tốc build và giảm bandwidth/storage cost, đặc biệt monorepo lớn.

---

### 🔴 Q15: How do you explain Kubernetes to a non-DevOps interviewer quickly? `[Senior]`

**A:** "Kubernetes là hệ điều hành cho container cluster: bạn khai báo trạng thái mong muốn (bao nhiêu instance, expose thế nào, cập nhật ra sao), nó tự giữ hệ thống ở trạng thái đó và tự phục hồi khi có lỗi."

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

Mục tiêu là "đơn giản nhưng đáng tin", không over-engineer từ ngày đầu.

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

### 🟡 Q: Why is "alert on every 5xx" a bad policy? `[Mid]`

**A:** Dễ noise khi traffic lớn; nên alert theo error rate, duration, và SLO impact.

### 🔴 Q: What is the first anti-pattern you'd fix in a fragile pipeline? `[Senior]`

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
