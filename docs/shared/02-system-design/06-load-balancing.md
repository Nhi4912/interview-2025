# Load Balancing / Cân Bằng Tải

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md) | [Message Queues](./05-message-queues.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**VNG MoMo payment gateway:** Trong sự kiện 11.11, một trong 8 API servers bị memory leak và response time tăng lên 5s. Với Round Robin load balancing, 12.5% traffic vẫn bị route đến server chậm. Sau khi switch sang Least Connections với active health check: server chậm tự động nhận ít requests hơn, health check detect và drain traffic trong 30s. User impact: từ 12.5% bị slow → gần 0%.

**Bài học:** Load balancing algorithm không chỉ là "chia đều" — phải kết hợp với health check và drain logic để handle real-world failure modes.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Load balancer giống người điều phối hàng tại siêu thị: quan sát hàng nào ngắn nhất (Least Connections) và hướng khách đến đó. Round Robin là "lần lượt mỗi người một quầy" — đơn giản nhưng không biết quầy nào đang bận. IP Hash là "người quen quầy quen" — đảm bảo consistency nhưng mất tác dụng khi server fail.

**Why it matters:** Load balancer là component đầu tiên trong hầu hết production systems. Sai algorithm hoặc thiếu health check = single point of failure khi một server chậm.

---

## Overview / Tổng Quan

Load balancer phân phối incoming traffic đến nhiều servers — ngăn bất kỳ server đơn lẻ nào bị quá tải.

**Vị trí trong hệ thống:**
```
Internet
    │
    ▼
[DNS]  ←── returns multiple IPs (DNS load balancing)
    │
    ▼
[Global Load Balancer / CDN]  ←── geo-routing (Route to nearest region)
    │
    ▼
[L4 Load Balancer]  ←── TCP/UDP level (AWS NLB, HAProxy)
    │
    ▼
[L7 Load Balancer]  ←── HTTP/app level (AWS ALB, nginx, Envoy)
    │
   ┌┴────────────────────┐
   ▼                     ▼
[Server 1]          [Server 2]
```

---

## 1. L4 vs L7 Load Balancing

### Q: What's the difference between L4 and L7 load balancers? 🟢 Junior

**A:**

| Feature | L4 (Transport Layer) | L7 (Application Layer) |
|---------|---------------------|----------------------|
| **Operates at** | TCP/UDP level | HTTP/HTTPS level |
| **Sees** | IP + Port only | URL, headers, cookies, body |
| **Routing decisions** | By IP/Port | By path, host, header, content |
| **Speed** | Faster (less inspection) | Slower (parses HTTP) |
| **SSL termination** | Pass-through | Terminates SSL |
| **Examples** | AWS NLB, HAProxy TCP | AWS ALB, nginx, Envoy |

```
L4 routing decision:
"TCP connection from 1.2.3.4:54321 → 10.0.0.1:80"
L4 LB sees: source IP, destination port → pick backend server
Does NOT read HTTP request

L7 routing decision:
"GET /api/users → backend-api server group"
"GET /static/img → static-server server group"
"Cookie: user_id=VIP → premium-tier server"
L7 LB reads the full HTTP request to decide
```

**Giải thích**: L4 nhanh hơn vì không cần parse application layer. L7 linh hoạt hơn — có thể route theo path, header, thậm chí theo body content (e.g., JSON field).

---

## 2. Load Balancing Algorithms / Thuật Toán Phân Phối

### Q: Compare Round Robin, Least Connections, and Consistent Hashing. 🟡 Mid

**A:**

```
ROUND ROBIN (even rotation):
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A (back to start)
Best for: homogeneous servers, stateless requests
Problem: Server A may be slow → still sends to it

WEIGHTED ROUND ROBIN:
Server A: weight=3, Server B: weight=1
Order: A, A, A, B, A, A, A, B, ...
Use when: servers have different capacity (4-core vs 8-core)

LEAST CONNECTIONS:
Server A: 10 active connections
Server B: 3 active connections  ← send here
Server C: 7 active connections
Best for: long-lived connections (WebSocket, gRPC streaming)
Problem: requires state tracking across all backends

LEAST RESPONSE TIME:
Server A: avg 50ms, Server B: avg 20ms → send to B
Adaptive — routes to fastest server
Problem: stale measurements, overhead of tracking

CONSISTENT HASHING:
hash(session_id) → always routes to same server
Use for: stateful sessions, cache locality
Same user always hits same server → their session data is local
```

**Khi nào dùng gì:**
- REST APIs (stateless) → Round Robin hoặc Least Connections
- WebSocket / long connections → Least Connections
- Session-based apps → Consistent Hashing (or sticky sessions)
- Uneven server capacity → Weighted Round Robin

---

## 3. Health Checks / Kiểm Tra Sức Khỏe

### Q: How does a load balancer know when to stop sending traffic to a failed server? 🟢 Junior

**A:**

```
Health Check Types:

1. TCP Health Check (L4):
   LB: attempts TCP connection to :8080
   Server up: TCP handshake succeeds ✓
   Server down: connection refused ✗ → mark unhealthy

2. HTTP Health Check (L7):
   LB: GET /health → expects 200 OK
   Server: {"status": "ok", "db": "ok", "redis": "ok"}
   Non-200 → mark unhealthy

3. Custom Health Check:
   Check DB connectivity
   Check cache connectivity
   Check disk space
   Return 503 if any dependency unhealthy

Health check flow:
Every 10s: LB sends GET /health to each server
  3 consecutive failures → mark server DOWN
  3 consecutive successes → mark server UP (recovery)

Traffic flow:
Normal:   LB → A, B, C (3 servers)
A crashes: LB → B, C only (50% more load per server)
A recovers: LB → A, B, C (restored)
```

**Thực tế production**: Health endpoint không chỉ check "server alive" mà còn check dependencies. Nếu DB của server A chết nhưng server còn sống → trả 503 từ `/health` → LB ngừng route đến A.

---

## 4. Session Persistence (Sticky Sessions) / Phiên Cố Định

### Q: What are sticky sessions and when are they problematic? 🟡 Mid

**A:**

```
WITHOUT sticky sessions:
Request 1 (user=alice) → Server A (creates session in memory)
Request 2 (user=alice) → Server B (no session!) → "Login again!"

WITH sticky sessions (LB uses cookie to pin user to server):
Request 1 (user=alice) → Server A (Set-Cookie: SERVERID=A)
Request 2 (user=alice, Cookie: SERVERID=A) → Server A → session found ✓

Problem 1: UNEVEN LOAD
If "heavy" users all pinned to Server A:
A: 90% CPU, B: 10% CPU → LB not helping

Problem 2: SERVER FAILURE
Server A dies → all pinned users lose session
→ forced logout for all users on A

BETTER SOLUTION: Externalize session state
Session stored in Redis (shared, fast):
Request → Any Server → Read session from Redis
No sticky sessions needed → true horizontal scaling
```

---

## 5. Advanced Topics / Chủ Đề Nâng Cao

### Q: How does DNS load balancing work and what are its limitations? 🔴 Senior

**A:**

```
DNS Load Balancing:
domain.com DNS record:
  A record: 1.2.3.4
  A record: 5.6.7.8
  A record: 9.10.11.12
  TTL: 60s

Client DNS lookup → DNS server returns IPs in rotation
Client picks first IP → sends request there

Limitations:
1. TTL cache: Client caches DNS for 60s → can't remove unhealthy IP quickly
   Client still tries failed server for up to 60s after failure
2. Client-side caching: OS/browser can cache longer than TTL
3. No connection awareness: DNS can't see server load
4. Sticky by DNS: Some ISPs cache DNS aggressively

Best for: Global traffic distribution (different regions)
Not good for: fine-grained health-based routing
```

### Q: What is the PROXY vs PASSTHROUGH model? 🔴 Senior

**A:**

```
PROXY (two-sided connection):
Client ←TCP connection 1→ LB ←TCP connection 2→ Server
LB terminates client connection, creates new one to server
LB sees all data, can modify headers, terminate SSL
Slightly higher latency (2 TCP handshakes)

PASSTHROUGH (DSR - Direct Server Return):
Client →TCP→ LB →TCP→ Server
           ↑               │
           └───────────────┘
           Server replies directly to client (bypasses LB)
LB only handles inbound, not outbound
Much faster (no LB on return path) — great for large responses
Used for: streaming video, large file downloads
```

---

## 6. Failure Modes & Advanced Patterns / Chế Độ Lỗi và Nâng Cao

### Q: What are common load balancer failure modes? / Các failure mode phổ biến của LB là gì? 🔴 Senior

**A:** Five main failure modes: LB itself as SPOF, false-positive health checks, thundering herd on recovery, head-of-line blocking, and half-open connections.

```
1. LB SPOF → Fix: Active-active pair with VRRP shared VIP
   If LB-A dies → LB-B takes VIP in ~1-2 seconds

2. False-positive health check → Fix: Require 3 consecutive failures before marking DOWN
   Cause: DB spike → health check slow → LB marks server unhealthy

3. Thundering herd on recovery → Fix: nginx slow_start=30s
   Recovered server gets flooded immediately

4. gRPC with L4 LB → all traffic to one backend!
   HTTP/2 multiplexing: one TCP connection carries all streams
   Fix: Use L7 LB (Envoy) that understands HTTP/2 frames

5. Sticky session pitfalls:
   - Uneven load (heavy user pinned to one server)
   - Session loss on server crash
   - Blocks canary deploys
   Fix: Externalise state to Redis, make services stateless
```

Vietnamese: Điểm quan trọng nhất cần nhớ: (1) LB single instance = SPOF → luôn dùng active-active pair. (2) gRPC với L4 LB là bug cổ điển — HTTP/2 multiplexing khiến tất cả requests đi vào một server duy nhất. (3) Sticky session là anti-pattern cho cloud-native — externalise state thay thế.

---

### Q: What are liveness vs readiness health checks in Kubernetes? / Liveness và readiness checks khác nhau thế nào? 🟡 Mid

**A:** Liveness asks "should Kubernetes restart this pod?" — checks only if the process is alive. Readiness asks "should the load balancer route traffic here?" — checks all dependencies (DB, cache). Separate them to avoid restarting healthy pods that have a slow DB.

Vietnamese: Đây là câu hỏi hay gặp khi phỏng vấn về K8s hoặc microservices. Liveness probe (`/healthz`): chỉ check process sống — nếu fail, K8s restart pod. Readiness probe (`/readyz`): check tất cả dependencies — nếu fail, LB dừng gửi traffic nhưng không restart. Pattern production: readiness check DB connection + Redis ping + queue lag. Nếu DB tạm slow → pod marked "not ready" → traffic rerouted → DB hết tải → pod recovered. Nếu chỉ dùng liveness thì mọi DB spike đều trigger restart vô ích.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Answer |
|----------|-------|-----------|
| What is a load balancer? | 🟢 | Distributes traffic to prevent single server overload |
| L4 vs L7? | 🟢 | L4=TCP/IP routing, L7=HTTP-aware routing |
| Round robin vs Least Connections? | 🟡 | RR for stateless, LC for long-lived connections |
| Liveness vs readiness health checks? | 🟡 | Liveness = restart trigger; readiness = traffic routing trigger |
| What are sticky sessions? | 🟡 | Pin user to same server — bad for scaling, prefer Redis session |
| DNS load balancing limitations? | 🔴 | TTL cache, can't do health-based quick failover |
| Active-active vs Active-passive? | 🔴 | Active-active: both handle traffic; Passive: standby only |
| LB failure modes? | 🔴 | SPOF, false-positive health check, gRPC L4 problem, sticky session pitfalls |

---

**See also**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md) | [Message Queues](./05-message-queues.md)

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I compare Round Robin, Least Connections, and IP Hash — use cases and trade-offs?
- [ ] Can I explain the difference between liveness and readiness health checks?
- [ ] Can I describe L4 vs L7 load balancing and when gRPC requires special consideration?
- [ ] Can I explain why sticky sessions are anti-pattern for horizontal scaling?
- 💬 **Feynman Prompt:** Giải thích tại sao DNS load balancing không đủ để route traffic away từ failed server ngay lập tức — kể cả khi server đã down hoàn toàn.

## Connections / Liên Kết

- ⬅️ **Built on**: [System Design Theory](./system-design-theory.md) — horizontal scaling requires load balancing
- ⬅️ **Built on**: [Replication & Partitioning](./replication-partitioning.md) — read replicas are behind load balancers
- ➡️ **Applied in**: [Design Framework](../../be-track/04-be-system-design/01-design-framework.md) — load balancer appears in every High-Level Design
- 🔗 **Related**: [Resilience Patterns](../../be-track/02-backend-knowledge/07-resilience-patterns.md) — circuit breaker complements load balancer health checks
