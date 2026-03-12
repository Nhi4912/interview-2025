# Load Balancing / Cân Bằng Tải

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md) | [Message Queues](./05-message-queues.md)

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

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Answer |
|----------|-------|-----------|
| What is a load balancer? | 🟢 | Distributes traffic to prevent single server overload |
| L4 vs L7? | 🟢 | L4=TCP/IP routing, L7=HTTP-aware routing |
| Round robin vs Least Connections? | 🟡 | RR for stateless, LC for long-lived connections |
| What are sticky sessions? | 🟡 | Pin user to same server — bad for scaling, prefer Redis session |
| DNS load balancing limitations? | 🔴 | TTL cache, can't do health-based quick failover |
| Active-active vs Active-passive? | 🔴 | Active-active: both handle traffic; Passive: standby only |

---

**See also**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md) | [Message Queues](./05-message-queues.md)
