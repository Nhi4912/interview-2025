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

## Concept Map / Bản Đồ Khái Niệm

```
       ┌──────────────────────┐
       │  DNS LOAD BALANCING  │
       │  (global routing)    │
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  L4 LOAD BALANCER    │
       │  TCP/UDP level       │
       │  (NLB, HAProxy)      │
       └──────────┬───────────┘
                  │
       ┌──────────▼───────────┐
       │  L7 LOAD BALANCER    │
       │  HTTP/App level      │
       │  (ALB, nginx, Envoy) │
       └──────┬───────────┬───┘
              │           │
     ┌────────▼───┐  ┌───▼──────────┐
     │ ALGORITHMS │  │ HEALTH CHECK │
     │ RR │ LC    │  │ TCP │ HTTP   │
     │ Hash │ Wt  │  │ Liveness │   │
     └────────────┘  │ Readiness    │
                     └──────────────┘
```

| #   | Concept / Khái niệm           | Role / Vai trò                                                | Interview Weight |
| --- | ----------------------------- | ------------------------------------------------------------- | ---------------- |
| 1   | **L4 vs L7 Load Balancing**   | TCP vs HTTP routing — determines capabilities                 | ⭐⭐⭐⭐         |
| 2   | **LB Algorithms**             | Round Robin, Least Connections, Consistent Hash — when to use | ⭐⭐⭐⭐⭐       |
| 3   | **Health Checks**             | Detect unhealthy servers — TCP, HTTP, custom                  | ⭐⭐⭐⭐         |
| 4   | **Session Persistence**       | Sticky sessions vs externalized state — scaling impact        | ⭐⭐⭐⭐         |
| 5   | **DNS Load Balancing**        | Global routing — limitations with TTL caching                 | ⭐⭐⭐           |
| 6   | **LB Failure Modes**          | SPOF, gRPC L4 bug, thundering herd — prevention               | ⭐⭐⭐⭐⭐       |
| 7   | **K8s Liveness vs Readiness** | Restart vs traffic routing — separate concerns                | ⭐⭐⭐⭐         |

**Relationship:** L4/L7 determines what information LB can use for routing → Algorithm uses that info to distribute traffic → Health checks determine which backends are eligible → Failure modes emerge when any component fails.

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: L4 vs L7 Load Balancing

🪝 **Memory Hook:** "L4 = blind postman (chỉ đọc địa chỉ). L7 = smart receptionist (đọc nội dung thư)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** L4 nhanh vì chỉ nhìn TCP header. L7 thông minh vì đọc HTTP content → route theo path/header
- **Level 2:** L4 không decrypt SSL → pass-through. L7 terminates SSL → can inspect body, add headers, route /api vs /static. gRPC problem: L4 sees 1 TCP connection (HTTP/2 multiplexing) → all requests to 1 backend

**Layer 1 — Analogy:** L4 = bưu điện sắp thư theo mã ZIP (chỉ đọc bên ngoài). L7 = thư ký mở thư, đọc nội dung, chuyển đến department đúng.

**Layer 2 — Mechanics:**

```
L4: Client→[TCP SYN]→LB→[TCP SYN]→Backend
    Only sees: src_ip:port → dst_ip:port
    Decision: Round Robin / Least Connections

L7: Client→[HTTP GET /api/users]→LB
    LB reads: path=/api/users, Host=api.example.com
    Decision: /api → api-servers, /static → cdn-servers
    Can add: X-Request-ID, X-Forwarded-For headers
```

**Layer 3 — Edge Cases:** gRPC + L4 = classic bug (HTTP/2 mux → 1 connection → 1 backend). WebSocket upgrade: L7 must support connection upgrade. SSL passthrough: L4 can forward encrypted traffic without termination → use when backend handles its own TLS.

| Sai lầm                    | Tại sao sai                                         | Đúng là                                       |
| -------------------------- | --------------------------------------------------- | --------------------------------------------- |
| "L7 is always better"      | L7 adds latency (SSL termination, HTTP parsing)     | L4 faster for TCP-level routing (gaming, DNS) |
| "L4 can route by URL path" | L4 only sees TCP headers, not HTTP                  | Need L7 for path/header-based routing         |
| "gRPC works with L4 LB"    | HTTP/2 mux: 1 TCP = many streams → all to 1 backend | Must use L7 LB (Envoy) for gRPC               |

🎯 **Interview Pattern:** "L4 vs L7?" → L4: fast, TCP-level, no HTTP awareness. L7: smart, path/header routing, SSL termination. Key gotcha: gRPC requires L7 (HTTP/2 multiplexing).

🔗 **Knowledge Chain:** L4/L7 → Envoy (L7 for gRPC) → Service mesh (Istio) → K8s Ingress

---

### Concept 2: LB Algorithms

🪝 **Memory Hook:** "RR = xoay vòng (fair nhưng blind). LC = đếm connection (smart nhưng stateful). Hash = loyalty card (same server)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Khác nhau về simplicity, fairness, và statefulness
- **Level 2:** RR: O(1) stateless, đều nhưng blind to server health. LC: tracks connections, better for varied request durations. Weighted: handles heterogeneous servers. Consistent Hash: cache locality

**Layer 1 — Analogy:** RR = chia bài lần lượt. LC = đi hàng ngắn nhất ở siêu thị. Hash = luôn đến quầy quen.

**Layer 2 — Mechanics:**

```
Algorithm Decision Matrix:
┌─────────────────┬──────────┬──────────┬──────────┐
│ Algorithm       │ Stateful │ Fair     │ Best For │
├─────────────────┼──────────┼──────────┼──────────┤
│ Round Robin     │ No       │ Equal    │ Stateless│
│ Weighted RR     │ No       │ Weighted │ Hetero   │
│ Least Conn      │ Yes      │ Dynamic  │ WebSocket│
│ Least Response  │ Yes      │ Adaptive │ Varied   │
│ IP/Cookie Hash  │ No       │ Sticky   │ Sessions │
│ Consistent Hash │ No       │ Sticky   │ Caching  │
└─────────────────┴──────────┴──────────┴──────────┘
```

**Layer 3 — Edge Cases:** LC with slow backend: keeps sending to it (new connections OK, but existing are long-lived). Power-of-two-choices: pick 2 random servers, send to one with fewer connections → near-optimal, simpler than full LC.

| Sai lầm                                      | Tại sao sai                                    | Đúng là                                     |
| -------------------------------------------- | ---------------------------------------------- | ------------------------------------------- |
| "Round Robin is good enough"                 | Ignores server load, health, and response time | Use LC for production, RR for dev/test      |
| "Consistent hash gives perfect distribution" | Needs virtual nodes for evenness               | Without vnodes, up to 3x imbalance          |
| "Least Connections prevents all overload"    | Long-lived connections skew counts             | Combine with response time for best results |

🎯 **Interview Pattern:** "Which algorithm for a REST API?" → Least Connections (stateless + varied response times). For gRPC streaming → Least Connections. For cache servers → Consistent Hash.

🔗 **Knowledge Chain:** Algorithms → Health checks (which servers eligible) → Monitoring (is it working?) → Auto-scaling

---

### Concept 3: Health Checks

🪝 **Memory Hook:** "Health check = bác sĩ khám bệnh. TCP = 'có thở không?' HTTP = 'nói gì đi!' Custom = 'MRI toàn thân'"

**Why exists / Tại sao tồn tại:**

- **Level 1:** LB cần biết server nào healthy để route traffic đúng
- **Level 2:** TCP check = connection succeeds → alive. HTTP check = GET /health returns 200 → app healthy. Custom = check DB, Redis, disk → deep health. Consecutive failures threshold prevents flapping.

**Layer 1 — Analogy:** TCP check = gõ cửa → ai đó trả lời. HTTP check = gõ cửa → hỏi "có ổn không?" → nghe câu trả lời. Custom = vào nhà kiểm tra điện, nước, gas.

**Layer 2 — Mechanics:**

```
Health Check Loop:
  Every 10s → GET /health → expect 200
  3 consecutive failures → MARK DOWN → stop routing
  3 consecutive successes → MARK UP → resume routing

Health Endpoint Pattern:
  GET /health → {"status": "ok",
                  "db": "connected",
                  "redis": "connected",
                  "disk": "85% (ok)"}

  If DB down → return 503 → LB marks unhealthy
```

**Layer 3 — Edge Cases:** Health check itself overloaded: too frequent checks add load. False positive: DB spike → slow health check → marked down → traffic shifts → cascading failure. Fix: separate health check timeout, don't check DB in liveness.

| Sai lầm                              | Tại sao sai                             | Đúng là                                             |
| ------------------------------------ | --------------------------------------- | --------------------------------------------------- |
| "TCP health check is sufficient"     | Server may accept TCP but app is broken | Use HTTP health check for application health        |
| "Check all dependencies in liveness" | Slow DB triggers unnecessary restarts   | Liveness: process alive. Readiness: dependencies OK |
| "Health check every 1 second"        | Adds load, causes flapping              | 10-30s interval with 3-failure threshold            |

🎯 **Interview Pattern:** "How does LB detect failed server?" → Health checks: TCP (L4), HTTP (L7), custom. Consecutive failures → mark down. Recovery: consecutive successes → mark up. Production: separate liveness (process) from readiness (deps).

🔗 **Knowledge Chain:** Health checks → Graceful degradation → Circuit breaker → K8s liveness/readiness → SLI/SLO

---

### Concept 4: Session Persistence

🪝 **Memory Hook:** "Sticky session = 'quầy quen' — nhanh nhưng khi quầy đóng, bạn mất hết"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Stateful apps store session in server memory → must route same user to same server
- **Level 2:** Cookie-based affinity (Set-Cookie: SERVERID=A) pins user → uneven load, session lost on server failure. Better: externalize to Redis → any server can serve any user → true horizontal scaling

**Layer 1 — Analogy:** Sticky = always go to same barber (they know your haircut). External = any barber, your profile is on the iPad.

**Layer 2 — Mechanics:**

```
Sticky Sessions:
  Req 1: user=alice → Server A (Set-Cookie: SERVERID=A)
  Req 2: user=alice → Cookie: SERVERID=A → Server A ✅
  Server A dies → user loses session → forced re-login ❌

Externalized State:
  Req 1: user=alice → Any Server → GET session from Redis
  Req 2: user=alice → Any Server → GET session from Redis
  Server A dies → user seamlessly served by B ✅
```

**Layer 3 — Edge Cases:** Heavy users pinned to one server → A at 90%, B at 10%. Canary deploy: sticky sessions prevent gradual traffic shifting. Mobile + CDN: cookie-based affinity may not work through CDN.

| Sai lầm                                 | Tại sao sai                                    | Đúng là                                    |
| --------------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| "Sticky sessions scale fine"            | Uneven load + session loss on failure          | Externalize state (Redis) for true scaling |
| "Redis session adds too much latency"   | Redis GET: <1ms. Session in Redis is standard  | Sub-millisecond for most operations        |
| "JWT eliminates need for session store" | JWT can't be revoked without server-side check | JWT + blacklist in Redis = compromise      |

🎯 **Interview Pattern:** "How to handle sessions in distributed system?" → Externalize to Redis. JWT for stateless auth, Redis for revocation. Sticky sessions = anti-pattern for cloud-native.

🔗 **Knowledge Chain:** Session → Redis externalization → JWT → Auth patterns → Stateless architecture

---

### Concept 5: DNS Load Balancing

🪝 **Memory Hook:** "DNS LB = tấm bản đồ cũ — chỉ đường tốt nhưng không cập nhật khi đường bị chặn"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Simplest form of LB — DNS returns multiple IPs, client picks one
- **Level 2:** TTL caching: client/ISP cache DNS for minutes → can't remove unhealthy IP quickly. Good for: global geo-routing. Bad for: fine-grained failover. AWS Route53 + health checks partially solve this

**Layer 1 — Analogy:** GPS app caches route for 5 minutes. Road blocked 30 seconds ago → GPS still shows old route for 4.5 more minutes.

**Layer 2 — Mechanics:**

```
DNS Round Robin:
  example.com → A: 1.2.3.4 (US-East)
                A: 5.6.7.8 (US-West)
                A: 9.10.11.12 (EU)
  TTL: 60s

Problem: Server 1.2.3.4 dies at t=0
  Client cached DNS at t=-30s → still tries 1.2.3.4 for 30s
  ISP caches DNS → may hold stale IP for longer
  Fix: Route53 health check removes unhealthy IP from DNS
  Still ~60s propagation delay
```

**Layer 3 — Edge Cases:** Some ISPs cache DNS for hours regardless of TTL. Mobile clients cache DNS aggressively. GeoDNS: route to nearest DC based on client IP location → latency optimization.

| Sai lầm                            | Tại sao sai                       | Đúng là                                        |
| ---------------------------------- | --------------------------------- | ---------------------------------------------- |
| "DNS LB provides instant failover" | TTL caching delays propagation    | Use hardware/software LB for fast failover     |
| "DNS LB is fine for microservices" | No health awareness, slow updates | Use service mesh or L7 LB for internal routing |
| "Low TTL fixes DNS caching"        | ISPs and clients may ignore TTL   | Combine DNS with dedicated LB for reliability  |

🎯 **Interview Pattern:** "DNS load balancing limitations?" → TTL caching (ISP/client), no health awareness, slow failover. Use for: global geo-routing. Combine with dedicated LB (ALB/NLB) for application-level distribution.

🔗 **Knowledge Chain:** DNS → GeoDNS → Global LB → CDN routing → Multi-region architecture

---

### Concept 6: LB Failure Modes

🪝 **Memory Hook:** "LB fails 5 ways: SPOF (chết), false alarm (report nhầm), stampede (đổ xô), gRPC trap (HTTP/2), sticky trap (session loss)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** LB itself can fail or create cascading failures
- **Level 2:** SPOF → active-active pair (VRRP/keepalived). gRPC L4 → HTTP/2 multiplexing sends all to 1 backend → use L7. Thundering herd → slow_start after recovery. False positive → consecutive failure threshold

**Layer 1 — Analogy:** Traffic light failure: all cars try every intersection → gridlock. Active-active = backup traffic light activates instantly.

**Layer 2 — Mechanics:**

```
Failure Mode Prevention:
┌──────────────────┬──────────────────────────┐
│ Failure Mode     │ Prevention               │
├──────────────────┼──────────────────────────┤
│ LB SPOF          │ Active-active VRRP pair  │
│ False positive   │ 3-failure threshold      │
│ Thundering herd  │ slow_start=30s on nginx  │
│ gRPC L4 bug      │ Use L7 (Envoy)           │
│ Sticky session   │ Externalize to Redis     │
└──────────────────┴──────────────────────────┘
```

**Layer 3 — Edge Cases:** Active-active split brain: both LBs think they're primary → need VRRP/keepalived. Connection draining: during deploy, close existing connections gracefully (30s grace period). Rate limiting at LB level: protect backends from DDoS.

| Sai lầm                                            | Tại sao sai                                   | Đúng là                                      |
| -------------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| "Single LB is fine for production"                 | LB = SPOF → entire system down                | Always active-active pair                    |
| "gRPC works with any LB"                           | HTTP/2 multiplexing breaks L4 routing         | Need L7 LB (Envoy) for proper gRPC balancing |
| "Server recovered → send full traffic immediately" | Causes thundering herd → server crashes again | Use slow_start to gradually increase traffic |

🎯 **Interview Pattern:** "What can go wrong with a load balancer?" → 5 failure modes: SPOF, false positive health check, thundering herd, gRPC L4, sticky sessions. Prevention: active-active, threshold, slow_start, L7, externalize state.

🔗 **Knowledge Chain:** LB failures → HA patterns → Service mesh → Circuit breaker → Graceful degradation

---

### Concept 7: K8s Liveness vs Readiness

🪝 **Memory Hook:** "Liveness = 'còn thở không?' → restart nếu chết. Readiness = 'sẵn sàng phục vụ?' → dừng traffic nếu bận"

**Why exists / Tại sao tồn tại:**

- **Level 1:** K8s needs to know when to restart pod (liveness) vs when to stop routing traffic (readiness)
- **Level 2:** Liveness: only check process alive (HTTP 200 from /healthz). Readiness: check all deps (DB, Redis, queue). If readiness fails: pod stays alive but removed from Service endpoints → no traffic. If liveness fails: kubelet restarts pod.

**Layer 1 — Analogy:** Restaurant: liveness = "is the chef in the kitchen?" (if no, hire new chef). Readiness = "is the kitchen ready to serve?" (if oven broken, don't send orders but don't fire the chef).

**Layer 2 — Mechanics:**

```
K8s Probe Configuration:
  livenessProbe:         readinessProbe:
    httpGet:               httpGet:
      path: /healthz         path: /readyz
      port: 8080             port: 8080
    periodSeconds: 30       periodSeconds: 10
    failureThreshold: 3    failureThreshold: 3

  /healthz: return 200 if process is alive
  /readyz:  return 200 if DB + Redis + all deps OK
            return 503 if any dep unhealthy

  Liveness fail → kubelet restarts pod
  Readiness fail → Service removes pod from endpoints (no traffic)
```

**Layer 3 — Edge Cases:** Startup probe: for slow-starting apps (JVM warmup), don't run liveness until startup completes. DB transient failure: readiness fails → traffic shifts → DB load decreases → DB recovers → readiness passes → traffic returns (self-healing loop).

| Sai lầm                      | Tại sao sai                              | Đúng là                                              |
| ---------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| "Use same endpoint for both" | DB spike triggers unnecessary restart    | Liveness: process only. Readiness: deps              |
| "Liveness should check DB"   | DB slow → pod restarted → makes DB worse | Only check what's truly "dead" in liveness           |
| "Skip readiness probe"       | Bad pod receives traffic → errors        | Always use readiness for graceful traffic management |

🎯 **Interview Pattern:** "Liveness vs readiness?" → Liveness: process alive → restart if dead. Readiness: deps healthy → stop traffic if not ready. Never check DB in liveness. Real example: DB spike → readiness fails → traffic reroutes → DB recovers → self-healing.

🔗 **Knowledge Chain:** K8s probes → Service endpoints → Load balancing → Graceful degradation → Auto-scaling

---

## 1. L4 vs L7 Load Balancing

### Q: What's the difference between L4 and L7 load balancers? 🟢 Junior

**A:**

| Feature               | L4 (Transport Layer)     | L7 (Application Layer)         |
| --------------------- | ------------------------ | ------------------------------ |
| **Operates at**       | TCP/UDP level            | HTTP/HTTPS level               |
| **Sees**              | IP + Port only           | URL, headers, cookies, body    |
| **Routing decisions** | By IP/Port               | By path, host, header, content |
| **Speed**             | Faster (less inspection) | Slower (parses HTTP)           |
| **SSL termination**   | Pass-through             | Terminates SSL                 |
| **Examples**          | AWS NLB, HAProxy TCP     | AWS ALB, nginx, Envoy          |

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

## Interview Q&A Summary / Tổng Kết Câu Hỏi Phỏng Vấn

| #   | Question                             | Difficulty | Core Concept        | Key Signal                                            |
| --- | ------------------------------------ | ---------- | ------------------- | ----------------------------------------------------- |
| 1   | What is a load balancer?             | 🟢         | L4 vs L7            | Phân biệt L4 (TCP routing) vs L7 (HTTP-aware)         |
| 2   | L4 vs L7 differences?                | 🟢         | L4 vs L7            | L4=fast/no inspection, L7=content-based routing       |
| 3   | Round robin vs Least Connections?    | 🟡         | Algorithms          | RR=stateless, LC=long-lived, WRR=heterogeneous        |
| 4   | Consistent hashing for LB?           | 🟡         | Algorithms          | Minimize redistribution khi add/remove servers        |
| 5   | What are sticky sessions?            | 🟡         | Session Persistence | Anti-pattern — externalise state to Redis             |
| 6   | Liveness vs readiness health checks? | 🟡         | Health Checks / K8s | Liveness=restart, readiness=traffic routing           |
| 7   | DNS load balancing limitations?      | 🔴         | DNS LB              | TTL cache → can't failover quickly                    |
| 8   | LB failure modes?                    | 🔴         | Failure Modes       | SPOF, false-positive health, gRPC L4, thundering herd |

**Distribution:** 🟢 Junior (2) | 🟡 Mid (4) | 🔴 Senior (2)

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **"After deploying gRPC microservices, one pod gets 90% of traffic while others idle. Diagnosis?"**

**30-second answer / Trả lời 30 giây:**
Classic L4 LB + HTTP/2 multiplexing problem. HTTP/2 reuses a single TCP connection for all streams. L4 LB routes at TCP level — one connection = one backend. Solution: switch to L7 LB (Envoy/Istio) that understands HTTP/2 frames and distributes individual requests across backends, not just connections.

**Follow-up / Hỏi thêm:** "How would you implement graceful draining during rolling deploys — ensuring in-flight requests complete while new traffic routes elsewhere?"

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời:

| #   | Type           | Question                                                           | Key Points                                                                          |
| --- | -------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Liệt kê 4 LB algorithms và khi nào dùng mỗi loại                   | RR→stateless, LC→varied latency, WRR→heterogeneous, IP Hash→session affinity        |
| 2   | 🎨 Visual      | Vẽ diagram L4 vs L7 LB data flow — packet vs HTTP-aware            | L4: TCP packets forwarded, L7: HTTP headers inspected + modified                    |
| 3   | 🛠️ Application | Design LB cho 50 gRPC microservices trên K8s                       | L7 LB (Envoy sidecar), per-request routing, readiness probes, slow_start            |
| 4   | 🐛 Debug       | LB health check says server healthy nhưng users report errors      | Health check endpoint quá đơn giản — cần check dependencies (DB, cache, queue)      |
| 5   | 🎓 Teach       | Giải thích cho team tại sao sticky sessions gây problems khi scale | Pin user → uneven load, crash = session loss, blocks canary deploys → Redis instead |

💬 **Feynman Prompt:** Giải thích tại sao DNS load balancing không đủ để route traffic away từ failed server ngay lập tức — kể cả khi server đã down hoàn toàn (TTL caching, client DNS cache, no health-aware routing).

---

## 📅 Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | When   | Focus                                                        |
| ----- | ------ | ------------------------------------------------------------ |
| 1     | Day 1  | L4 vs L7, algorithms comparison, health checks basics        |
| 2     | Day 3  | Session persistence, DNS LB limits, gRPC problem             |
| 3     | Day 7  | Failure modes (SPOF, thundering herd, false-positive health) |
| 4     | Day 14 | K8s probes, proxy vs passthrough, VRRP active-active         |
| 5     | Day 30 | Full cold call: design LB strategy cho 100 microservices     |

---

## Connections / Liên Kết

**Same track (Shared — System Design):**

- ⬅️ [System Design Theory](./system-design-theory.md) — horizontal scaling requires load balancing
- ⬅️ [Replication & Partitioning](./replication-partitioning.md) — read replicas sit behind load balancers
- 🔗 [Caching Patterns](./caching-patterns.md) — CDN is a form of DNS-based load distribution
- 🔗 [Message Queues](./05-message-queues.md) — queue-based load leveling complements LB
- 🔗 [Consensus Algorithms](./consensus-algorithms.md) — leader election patterns for active-passive LB

**Cross-track:**

- ➡️ [Design Framework](../../be-track/04-be-system-design/01-design-framework.md) — LB appears in every High-Level Design
- 🔗 [Resilience Patterns](../../be-track/02-backend-knowledge/07-resilience-patterns.md) — circuit breaker complements LB health checks
- 🔗 [Networking (Go)](../../be-track/02-backend-knowledge/06-networking-go.md) — TCP/HTTP protocol details for L4/L7 decisions
