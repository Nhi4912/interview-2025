# Networking

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**Zalo Chat Infrastructure (thực tế):** Zalo hỗ trợ 70 triệu user nhắn tin. Đội kỹ thuật gặp vấn đề: WebSocket connections từ mobile app bị drop sau 30 phút không có activity — do NAT gateway timeout. Fix: implement heartbeat (ping/pong mỗi 25s) trong Go WebSocket handler. Thứ hai, service-to-service calls trong data center bị TCP SYN timeout khi server bận — diagnose bằng `netstat -an | grep SYN_RECEIVED`. Fix: tăng `net.core.somaxconn` (listen backlog).

**Bài học:** Network protocols không trừu tượng — chúng ảnh hưởng trực tiếp đến connection stability, latency, và throughput. Go developer cần hiểu TCP để debug đúng tầng.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Mạng máy tính giống hệ thống bưu chính có phân cấp: IP là địa chỉ bưu điện (biết gửi đâu), TCP là dịch vụ chuyển phát đảm bảo (có tracking, retry nếu mất), UDP là bỏ vào hòm thư không biết đến nơi chưa. HTTP là nội dung thư (format và ngôn ngữ). TLS là phong bì bảo mật (mã hóa trước khi gửi).

**Why it matters:** Khi service bị chậm, vấn đề thường ở network layer: connection timeout, DNS resolution delay, TLS handshake, TCP congestion. Không biết networking, không debug được root cause.

## Concept Map / Bản Đồ Khái Niệm

```
[Networking Stack for Go Backend]
        │
        ├── TCP/IP
        │     ├── 3-way handshake: SYN → SYN-ACK → ACK
        │     ├── Keep-alive: detect dead connections
        │     └── TIME_WAIT: 2*MSL after close (ports held ~60s)
        │
        ├── HTTP Protocol Evolution
        │     ├── HTTP/1.1: pipelining, keep-alive, head-of-line blocking
        │     ├── HTTP/2: multiplexing, header compression, server push
        │     └── HTTP/3: QUIC (UDP-based), 0-RTT, no HOL blocking
        │
        ├── TLS
        │     ├── TLS 1.3: 1-RTT handshake (vs 2-RTT in 1.2)
        │     ├── mTLS: mutual auth (both sides present certificate)
        │     └── Certificate pinning: prevent MITM
        │
        └── Go Networking
              ├── net.Listener: TCP server socket
              ├── http.Transport: connection pooling, timeouts
              └── context.WithTimeout: prevent goroutine leak on network calls
```

## Kiến thức Mạng máy tính cho Go Backend Developer (Middle/Senior)

> **Target**: Zalo (VNG), Grab, Axon, Employment Hero, Microsoft, Google
> **Mức độ**: Từ cơ bản đến chuyên sâu, bao gồm Go code examples thực tế

---

## Overview / Tổng Quan

File này cover 7 nhóm kiến thức Networking thiết yếu cho Go Backend Developer, từ protocol fundamentals đến production Go networking patterns:

| #   | Concept                     | Vai trò                                       | Interview Weight |
| --- | --------------------------- | --------------------------------------------- | ---------------- |
| 1   | OSI/TCP-IP Model            | Foundation of network layers                  | ⭐⭐⭐           |
| 2   | TCP Deep Dive               | Connection lifecycle, flow/congestion control | ⭐⭐⭐⭐⭐       |
| 3   | HTTP Evolution (1.1/2/3)    | Protocol selection for APIs                   | ⭐⭐⭐⭐⭐       |
| 4   | TLS/HTTPS & mTLS            | Security layer, certificate management        | ⭐⭐⭐⭐         |
| 5   | DNS & WebSocket             | Name resolution, real-time communication      | ⭐⭐⭐⭐         |
| 6   | gRPC & Load Balancing       | Service-to-service, traffic distribution      | ⭐⭐⭐⭐⭐       |
| 7   | REST API & Network Security | API design, DDoS, rate limiting               | ⭐⭐⭐⭐         |

**Mối quan hệ:** OSI Model → TCP/UDP → HTTP → TLS tạo thành stack từ dưới lên. DNS resolve trước khi TCP connect. WebSocket upgrade từ HTTP. gRPC chạy trên HTTP/2. Load Balancing phân phối traffic ở L4 (TCP) hoặc L7 (HTTP). REST API là application layer pattern, Network Security bảo vệ toàn bộ stack.

---

## Core Concepts — Deep Dive / Khái Niệm Cốt Lõi

### Concept 1: OSI/TCP-IP Model

- **🧠 Memory Hook:** "OSI 7 layers = Please Do Not Throw Sausage Pizza Away (Physical→Data Link→Network→Transport→Session→Presentation→Application)"
- **Why exists (Level 1):** Cần chuẩn hóa cách thiết bị giao tiếp → phân tầng trách nhiệm. Mỗi layer chỉ nói chuyện với layer trên và dưới nó.
- **Why exists (Level 2):** OSI là reference model (7 layers), TCP/IP là practical model (4 layers: Network Interface, Internet, Transport, Application). Sự khác biệt: OSI tách session/presentation thành layers riêng, TCP/IP gộp vào application. Thực tế dùng TCP/IP, interview hỏi OSI để test lý thuyết.
- **Common Mistakes:** ❌ "OSI model = TCP/IP model" → OSI là lý thuyết 7 layers, TCP/IP là thực tế 4 layers. ❌ "Data đi tuần tự qua 7 layers" → Thực tế có thể bypass (hardware offloading).
- **Interview Pattern:** "Khi gõ URL vào browser, chuyện gì xảy ra?" → DNS → TCP 3-way → TLS → HTTP request → server process → HTTP response → render. Mention each layer touched.
- **Knowledge Chain:** OSI Model → TCP/IP → Socket API → Go net package

### Concept 2: TCP Deep Dive

- **🧠 Memory Hook:** "TCP 3-way = 'Hey, you there?' → 'Yeah, I'm here!' → 'Great, let's talk!' (SYN → SYN-ACK → ACK)"
- **Why exists (Level 1):** Cần reliable, ordered data delivery over unreliable network. TCP đảm bảo: no data loss, correct order, no duplicates.
- **Why exists (Level 2):** 3-way handshake establishes sequence numbers for tracking. 4-way teardown ensures both sides agree to close. TIME_WAIT (2×MSL = ~60s) prevents delayed packets from old connection being accepted by new connection on same port. Flow control (receiver window) prevents sender overwhelming receiver. Congestion control (slow start → congestion avoidance → fast recovery) prevents sender overwhelming network.
- **Why exists (Level 3):** In Go: `http.Transport.MaxIdleConnsPerHost` controls connection pool. TIME_WAIT exhaustion at high traffic — fix with `SO_REUSEADDR/SO_REUSEPORT`. TCP keepalive detects dead connections — Go's `net.TCPConn.SetKeepAlive(true)` with `SetKeepAlivePeriod`.
- **Common Mistakes:** ❌ "TIME_WAIT is a bug" → It's a feature preventing data corruption. ❌ "More connections = more throughput" → TCP congestion control limits per-connection bandwidth. ❌ "TCP keepalive = HTTP keep-alive" → Different layers entirely.
- **Interview Pattern:** "Why do you see thousands of TIME_WAIT on your Go server?" → High connection churn + short-lived connections. Fix: connection pooling (`MaxIdleConnsPerHost`), SO_REUSEADDR, HTTP/2 multiplexing.
- **Knowledge Chain:** TCP Handshake → States → Flow Control → Congestion Control → Go Transport Config

### Concept 3: HTTP Evolution (1.1/2/3)

- **🧠 Memory Hook:** "HTTP/1.1 = one lane highway, HTTP/2 = multi-lane highway with same road, HTTP/3 = helicopter (no road needed, QUIC/UDP)"
- **Why exists (Level 1):** HTTP/1.1 head-of-line (HOL) blocking — one slow request blocks all behind it. HTTP/2 multiplexing fixes this over single TCP connection. HTTP/3 (QUIC) eliminates TCP-level HOL blocking.
- **Why exists (Level 2):** HTTP/2: binary framing, header compression (HPACK), stream prioritization, server push. Built on TCP → still has TCP HOL. HTTP/3 (QUIC): built on UDP, 0-RTT resumption, independent streams (no cross-stream blocking), built-in TLS 1.3. Go 1.22+ has experimental QUIC support.
- **Common Mistakes:** ❌ "HTTP/2 always faster" → For many small requests yes, but large single stream same as HTTP/1.1. ❌ "HTTP/3 replaces TCP" → Only for HTTP; database connections still use TCP. ❌ "Server push is widely used" → Most CDNs disabled it; 103 Early Hints is preferred.
- **Interview Pattern:** "When would you choose HTTP/2 vs gRPC vs HTTP/3?" → HTTP/2: browser-facing APIs, multiplexing. gRPC: internal microservices (protobuf + streaming). HTTP/3: mobile clients (connection migration on network switch).
- **Knowledge Chain:** HTTP/1.1 → HTTP/2 → gRPC → HTTP/3/QUIC → Connection Migration

### Concept 4: TLS/HTTPS & mTLS

- **🧠 Memory Hook:** "TLS handshake = showing passports at border: client verifies server's ID (certificate), optionally server verifies client's (mTLS)"
- **Why exists (Level 1):** HTTP is plaintext → anyone on network can read/modify data. TLS provides: encryption (confidentiality), authentication (server identity), integrity (tamper detection).
- **Why exists (Level 2):** TLS 1.3 reduces handshake to 1-RTT (vs 2-RTT in 1.2) by combining key exchange with ClientHello. 0-RTT resumption sends application data in first message (but vulnerable to replay attacks). mTLS: service mesh uses it for zero-trust networking — every service has certificate, both sides verify.
- **Common Mistakes:** ❌ "HTTPS = secure" → HTTPS protects transport, not application vulnerabilities (XSS, SQLi). ❌ "Certificate pinning is always good" → Makes rotation painful; prefer short-lived certificates with ACME. ❌ "mTLS is only for microservices" → Also used for IoT device authentication.
- **Interview Pattern:** "Explain TLS 1.3 handshake and why it's faster than 1.2" → 1.3 combines key exchange + cipher negotiation in single round-trip. Pre-shared keys enable 0-RTT. Removed insecure ciphers (RSA key exchange, CBC mode).
- **Knowledge Chain:** Symmetric Encryption → Asymmetric → Certificate Chain → TLS Handshake → mTLS → Service Mesh

### Concept 5: DNS & WebSocket

- **🧠 Memory Hook:** "DNS = phone book (domain→IP), WebSocket = keeping the phone line open for two-way conversation"
- **Why exists (Level 1):** Humans remember names not IP addresses → DNS. HTTP is request-response → WebSocket enables full-duplex real-time communication without polling.
- **Why exists (Level 2):** DNS resolution: browser cache → OS cache → recursive resolver → root → TLD → authoritative. TTL controls caching. Go's net.Resolver can be customized for DNS-based service discovery. WebSocket: HTTP upgrade handshake → persistent TCP connection → binary/text frames. Go `gorilla/websocket` (maintenance mode) → `nhooyr/websocket` or `coder/websocket`.
- **Common Mistakes:** ❌ "DNS is instant" → Can add 50-200ms on cache miss; use DNS prefetching. ❌ "WebSocket = always better than SSE" → SSE is simpler for server→client streaming, auto-reconnects. ❌ "WebSocket doesn't need heartbeat" → NAT gateways drop idle connections; need ping/pong.
- **Interview Pattern:** "Design a chat system — why WebSocket over polling?" → Polling: N clients × M checks/sec = N×M requests. WebSocket: N persistent connections, server pushes immediately. Trade-off: more server memory per connection, but massively less bandwidth.
- **Knowledge Chain:** DNS Resolution → Service Discovery → WebSocket → SSE → Long Polling → gRPC Streaming

### Concept 6: gRPC & Load Balancing

- **🧠 Memory Hook:** "gRPC = phone call with interpreter (protobuf translates), Load Balancer = receptionist directing calls to available agents"
- **Why exists (Level 1):** REST/JSON is human-readable but slow to serialize/large payloads. gRPC with protobuf: binary serialization (10x smaller, 10x faster parsing), HTTP/2 multiplexing, streaming, code generation.
- **Why exists (Level 2):** 4 gRPC patterns: Unary, Server Streaming, Client Streaming, Bidirectional Streaming. Load Balancing: L4 (TCP level, no HTTP awareness, fast) vs L7 (HTTP level, can route by path/header, SSL termination). Algorithms: Round Robin, Least Connections, Weighted, Consistent Hashing (for caching).
- **Common Mistakes:** ❌ "gRPC replaces REST" → gRPC not browser-friendly (needs grpc-web proxy). REST for public APIs, gRPC for internal. ❌ "L7 is always better than L4" → L7 adds latency from HTTP parsing. L4 for raw throughput. ❌ "Round robin is fair" → Not with varying request complexity; use least-connections.
- **Interview Pattern:** "How does gRPC load balancing differ from HTTP?" → gRPC uses long-lived HTTP/2 connections → L4 LB sees one connection → can't distribute. Need L7 LB that understands HTTP/2 streams, or client-side LB (grpc.WithResolvers + round_robin policy).
- **Knowledge Chain:** REST → gRPC → Protobuf → HTTP/2 → Load Balancing → Service Mesh → Envoy

### Concept 7: REST API & Network Security

- **🧠 Memory Hook:** "REST = library card system (resources with standard operations), Network Security = locks on every door (DDoS = mob at entrance, Rate Limiting = bouncer)"
- **Why exists (Level 1):** Need standard way to expose server functionality over HTTP. Need protection against attacks exploiting network protocols.
- **Why exists (Level 2):** REST: resource-oriented URIs, HTTP methods as verbs (GET=read, POST=create), stateless, HATEOAS (rarely implemented). Security: DDoS (SYN flood, HTTP flood, amplification), Rate limiting (token bucket, sliding window, leaky bucket). CORS prevents unauthorized cross-origin requests.
- **Common Mistakes:** ❌ "REST requires JSON" → REST is protocol-agnostic; JSON is just common. ❌ "Rate limiting at application = enough" → Need at infrastructure level (CDN/LB) too. ❌ "CORS prevents attacks" → CORS only prevents browser-based cross-origin; curl/backend ignores it.
- **Interview Pattern:** "Design rate limiting for an API" → Token bucket per user (in-memory for single server, Redis for distributed). HTTP 429 with Retry-After header. Sliding window counter for precise per-second limiting.
- **Knowledge Chain:** REST Principles → API Gateway → Rate Limiting → DDoS Protection → WAF → CDN

---

## Table of Contents

1. [OSI Model & TCP/IP Stack](#1-osi-model--tcpip-stack)
2. [TCP](#2-tcp)
3. [UDP](#3-udp)
4. [HTTP/1.1 vs HTTP/2 vs HTTP/3](#4-http11-vs-http2-vs-http3)
5. [HTTPS / TLS](#5-https--tls)
6. [DNS](#6-dns)
7. [WebSocket](#7-websocket)
8. [gRPC](#8-grpc)
9. [Load Balancing](#9-load-balancing)
10. [REST API](#10-rest-api)
11. [Network Security](#11-network-security)
12. [CDN](#12-cdn)
13. [Cheat Sheet & Interview Tips](#13-cheat-sheet--interview-tips)

---

## 1. OSI Model & TCP/IP Stack

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: Trình bày 7 layers của OSI Model? 🟢 🟢 [Junior]

**A:** OSI (Open Systems Interconnection) chia network communication thành 7 tầng:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Layer │ Name           │ Protocol/Example     │ Data Unit  │ Device       │
├───────┼────────────────┼──────────────────────┼────────────┼──────────────┤
│   7   │ Application    │ HTTP, FTP, SMTP, DNS │ Data       │ -            │
│   6   │ Presentation   │ SSL/TLS, JPEG, ASCII │ Data       │ -            │
│   5   │ Session        │ NetBIOS, RPC         │ Data       │ -            │
│   4   │ Transport      │ TCP, UDP             │ Segment    │ -            │
│   3   │ Network        │ IP, ICMP, ARP        │ Packet     │ Router       │
│   2   │ Data Link      │ Ethernet, Wi-Fi      │ Frame      │ Switch       │
│   1   │ Physical       │ Cable, Fiber, Radio  │ Bit        │ Hub, Modem   │
└─────────────────────────────────────────────────────────────────────┘
```

**Giải thích từng tầng:**

- **Layer 7 - Application**: Tầng gần user nhất. HTTP cho web, SMTP cho email, DNS cho name resolution.
- **Layer 6 - Presentation**: Mã hóa/giải mã dữ liệu, nén, encryption (SSL/TLS thường đặt ở đây).
- **Layer 5 - Session**: Quản lý session giữa 2 host (bắt đầu, duy trì, kết thúc phiên).
- **Layer 4 - Transport**: Đảm bảo truyền dữ liệu tin cậy (TCP) hoặc nhanh (UDP). Port numbers.
- **Layer 3 - Network**: Định tuyến (routing), đánh địa chỉ IP, fragmentation.
- **Layer 2 - Data Link**: MAC address, error detection (CRC), flow control giữa 2 node kề nhau.
- **Layer 1 - Physical**: Truyền raw bits qua môi trường vật lý (cáp đồng, quang, sóng radio).

---

### Q: So sánh OSI Model (7 layers) vs TCP/IP Model (4 layers)? 🟢 🟢 [Junior]

**A:**

```
       OSI Model              TCP/IP Model
  ┌────────────────┐     ┌────────────────────┐
  │  Application   │     │                    │
  ├────────────────┤     │    Application     │
  │  Presentation  │     │  (HTTP, DNS, FTP)  │
  ├────────────────┤     │                    │
  │    Session     │     ├────────────────────┤
  ├────────────────┤     │    Transport       │
  │   Transport    │     │    (TCP, UDP)      │
  ├────────────────┤     ├────────────────────┤
  │    Network     │     │    Internet        │
  ├────────────────┤     │    (IP, ICMP)      │
  │   Data Link    │     ├────────────────────┤
  ├────────────────┤     │  Network Access    │
  │   Physical     │     │  (Ethernet, Wi-Fi) │
  └────────────────┘     └────────────────────┘
```

| Tiêu chí             | OSI                  | TCP/IP              |
| -------------------- | -------------------- | ------------------- |
| Số tầng              | 7                    | 4                   |
| Tính chất            | Lý thuyết tham chiếu | Thực tế, triển khai |
| Phát triển bởi       | ISO                  | DARPA (DoD)         |
| Session/Presentation | Tách riêng           | Gộp vào Application |
| Sử dụng              | Dạy học, phân tích   | Internet thực tế    |

> **Thực tế**: TCP/IP model được sử dụng trên Internet. OSI chủ yếu dùng để phân tích và học. Khi phỏng vấn, hãy nắm cả hai nhưng nhấn mạnh TCP/IP.

---

### Q: Mô tả chi tiết điều gì xảy ra khi bạn gõ URL vào browser? 🟡 🟡 [Mid]

**A:** Đây là câu hỏi kinh điển. Full journey:

**1. URL Parsing** (Browser)

- Browser parse URL: `https://www.example.com:443/path?q=1`
- Xác định: protocol (HTTPS), host, port (443), path, query

**2. DNS Resolution** (Application → Network)

- Check browser DNS cache → OS DNS cache → Router cache → ISP DNS → Recursive DNS
- Kết quả: `www.example.com` → `93.184.216.34`

**3. TCP 3-Way Handshake** (Transport)

```
Client → Server:  SYN (seq=x)
Server → Client:  SYN-ACK (seq=y, ack=x+1)
Client → Server:  ACK (seq=x+1, ack=y+1)
```

**4. TLS Handshake** (nếu HTTPS)

- Client Hello → Server Hello → Certificate → Key Exchange → Finished
- TLS 1.3: chỉ cần 1-RTT (hoặc 0-RTT cho session resumption)

**5. HTTP Request** (Application)

```http
GET /path?q=1 HTTP/1.1
Host: www.example.com
User-Agent: Chrome/...
Accept: text/html
```

**6. Server Processing** (Backend)

- Load balancer nhận request → Forward tới app server
- App server xử lý (routing, middleware, business logic, DB query)
- Trả về HTTP Response

**7. HTTP Response** (Application)

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1234

<!DOCTYPE html>...
```

**8. Browser Rendering** (Client)

- Parse HTML → Xây DOM tree
- Parse CSS → CSSOM tree
- DOM + CSSOM → Render tree
- Layout → Paint → Composite
- Tải thêm JS, images, CSS (mỗi resource lặp lại bước 2-7)

**9. TCP Connection Close** (hoặc keep-alive)

- HTTP/1.1: `Connection: keep-alive` (mặc định)
- Browser có thể giữ connection cho các request tiếp theo

> **💡 Interview Tip**: Câu này rất phổ biến ở Google và Microsoft. Hãy đi sâu vào phần bạn biết rõ nhất (VD: TLS handshake cho security role, rendering cho frontend role, server processing cho backend role).

---

## 2. TCP

### Q: Giải thích TCP 3-Way Handshake? 🟢 🟢 [Junior]

**A:** TCP 3-way handshake thiết lập connection tin cậy giữa client và server:

```
    Client                    Server
      │                         │
      │──── SYN (seq=100) ────→│   (1) Client gửi SYN, chuyển sang SYN_SENT
      │                         │
      │←─ SYN-ACK ────────────│   (2) Server nhận, gửi SYN-ACK, chuyển sang SYN_RCVD
      │   (seq=300, ack=101)   │
      │                         │
      │──── ACK (ack=301) ───→│   (3) Client gửi ACK, cả hai ESTABLISHED
      │                         │
      │═══ DATA TRANSFER ═════│
```

**Tại sao cần 3 bước (không phải 2)?**

- 2 bước không đủ: server không xác nhận được client đã nhận SYN-ACK
- Cần 3 bước để **cả hai bên** đều xác nhận khả năng gửi và nhận
- Ngăn chặn "half-open connections" từ SYN packets cũ/trùng lặp (stale duplicate)

**ISN (Initial Sequence Number):** Mỗi bên chọn ISN ngẫu nhiên để tránh bị predict → bảo mật.

---

### Q: Giải thích TCP 4-Way Teardown? 🟢 🟢 [Junior]

**A:** Đóng TCP connection cần 4 bước vì mỗi hướng đóng độc lập (half-close):

```
    Client                    Server
      │                         │
      │──── FIN (seq=x) ─────→│   (1) Client muốn đóng, gửi FIN → FIN_WAIT_1
      │                         │
      │←─── ACK (ack=x+1) ───│   (2) Server ACK → Client: FIN_WAIT_2, Server: CLOSE_WAIT
      │                         │       Server vẫn có thể gửi data
      │                         │
      │←─── FIN (seq=y) ──────│   (3) Server sẵn sàng đóng, gửi FIN → LAST_ACK
      │                         │
      │──── ACK (ack=y+1) ───→│   (4) Client ACK → TIME_WAIT (2*MSL), Server: CLOSED
      │                         │
      │     (wait 2*MSL)       │
      │     → CLOSED           │
```

**Tại sao cần 4 bước (không phải 3)?**

- TCP là full-duplex: mỗi hướng đóng độc lập
- Server có thể vẫn muốn gửi data sau khi nhận FIN từ client (half-close)
- Bước 2 và 3 có thể gộp thành 1 nếu server không có data cần gửi thêm

---

### Q: Giải thích các TCP states quan trọng? 🟡 🟡 [Mid]

**A:**

```
                              ┌──────────┐
                              │  CLOSED  │
                              └────┬─────┘
                    passive open   │   active open / SYN
                         ┌─────────┴──────────┐
                         ▼                     ▼
                    ┌──────────┐          ┌──────────┐
                    │  LISTEN  │          │ SYN_SENT │
                    └────┬─────┘          └────┬─────┘
               rcv SYN   │                     │  rcv SYN-ACK
               snd SYN-ACK                     │  snd ACK
                         ▼                     ▼
                    ┌──────────┐          ┌────────────┐
                    │ SYN_RCVD │───ACK──→│ ESTABLISHED │
                    └──────────┘          └─────┬──────┘
                                                │ close / FIN
                                                ▼
                              ┌────────────────────────┐
                              │   FIN_WAIT_1 / 2       │
                              │   CLOSE_WAIT           │
                              │   LAST_ACK             │
                              │   TIME_WAIT            │
                              │   CLOSING              │
                              └────────────────────────┘
```

**Các state quan trọng cần nhớ:**

| State        | Bên nào              | Ý nghĩa                           |
| ------------ | -------------------- | --------------------------------- |
| LISTEN       | Server               | Đang chờ connection               |
| ESTABLISHED  | Cả hai               | Connection hoạt động, truyền data |
| CLOSE_WAIT   | Bên nhận FIN         | Đã nhận FIN, chờ app đóng socket  |
| TIME_WAIT    | Bên gửi FIN đầu tiên | Chờ 2\*MSL trước khi CLOSED       |
| FIN_WAIT_1/2 | Bên chủ động đóng    | Đang trong quá trình đóng         |

---

### Q: TIME_WAIT là gì? Tại sao cần chờ 2\*MSL? Ảnh hưởng gì đến high-traffic servers? 🔴 🔴 [Senior]

**A:**

**TIME_WAIT** là trạng thái mà bên **chủ động đóng connection** (gửi FIN đầu tiên) phải chờ trước khi thực sự closed.

**MSL (Maximum Segment Lifetime)**: Thời gian tối đa một TCP segment tồn tại trên mạng (thường 60s trên Linux). Vậy `2*MSL = 120s`.

**Tại sao cần 2\*MSL?**

1. **Đảm bảo ACK cuối cùng đến được server**: Nếu ACK bị mất, server sẽ retransmit FIN. Client cần ở TIME_WAIT để nhận và re-ACK.
2. **Ngăn chặn old duplicate segments**: Đảm bảo tất cả segments của connection cũ đã "chết" trên mạng trước khi cùng (src_ip, src_port, dst_ip, dst_port) tuple được tái sử dụng.

**Vấn đề trên high-traffic servers:**

- Mỗi closed connection chiếm 1 slot trong TIME_WAIT 120 giây
- Server có thể cạn kiệt ephemeral ports (mặc định ~28,000 ports)
- Hậu quả: không thể tạo connection mới → `connect: cannot assign requested address`

**Giải pháp:**

```bash
# Linux kernel tuning
net.ipv4.tcp_tw_reuse = 1        # Cho phép reuse TIME_WAIT sockets cho outgoing connections
net.ipv4.tcp_fin_timeout = 30    # Giảm FIN_TIMEOUT (không phải TIME_WAIT trực tiếp)
net.ipv4.ip_local_port_range = 1024 65535  # Mở rộng port range

# Quan trọng: KHÔNG dùng tcp_tw_recycle (đã bị loại bỏ vì gây lỗi sau NAT)
```

**Trong Go:**

```go
// Sử dụng connection pooling để giảm TIME_WAIT
transport := &http.Transport{
    MaxIdleConns:        100,
    MaxIdleConnsPerHost: 10,
    IdleConnTimeout:     90 * time.Second,
}
client := &http.Client{Transport: transport}
```

> **💡 Interview Tip (Grab, Zalo)**: Câu hỏi TIME_WAIT rất phổ biến cho Senior. Cần giải thích được lý do tồn tại VÀ cách xử lý trên production. Grab đặc biệt quan tâm vấn đề này vì hệ thống high-traffic.

---

### Q: Giải thích Flow Control trong TCP? 🟡 🟡 [Mid]

**A:** Flow control ngăn sender gửi quá nhanh so với khả năng xử lý của receiver.

**Cơ chế: Sliding Window**

```
Sender's view:
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │12 │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
  ✓   ✓   ✓ │  ←sent→  │  ←can send→  │ cannot send
  ACKed     │  waiting  │   (window)   │
             │  for ACK  │              │
             └──────────────────────────┘
                   Sender Window
```

- **Receiver Window (rwnd)**: Receiver quảng bá trong mỗi ACK rằng buffer còn bao nhiêu byte trống
- **Sender Window**: Sender chỉ gửi tối đa `min(cwnd, rwnd)` bytes chưa được ACK
- **Window = 0**: Receiver báo "đừng gửi nữa" → Sender gửi **window probe** định kỳ

---

### Q: Giải thích Congestion Control trong TCP? 🔴 🔴 [Senior]

**A:** Congestion control ngăn chặn network bị quá tải. Khác với flow control (bảo vệ receiver), congestion control bảo vệ **network**.

**4 thuật toán chính:**

**1. Slow Start** (bắt đầu chậm)

- `cwnd` (congestion window) bắt đầu = 1 MSS
- Mỗi ACK nhận được: `cwnd += 1 MSS` → tăng gấp đôi mỗi RTT (tăng exponential)
- Dừng khi `cwnd >= ssthresh` (slow start threshold)

**2. Congestion Avoidance** (tránh tắc nghẽn)

- Khi `cwnd >= ssthresh`: tăng tuyến tính (`cwnd += 1 MSS` mỗi RTT)
- Mục tiêu: tăng cẩn thận, tránh gây congestion

**3. Fast Retransmit**

- Nhận **3 duplicate ACKs** → packet bị mất → retransmit ngay (không chờ timeout)
- Nhanh hơn đáng kể so với chờ RTO timeout

**4. Fast Recovery** (TCP Reno)

- Sau fast retransmit: `ssthresh = cwnd/2`, `cwnd = ssthresh + 3`
- Không quay về slow start mà giữ ở mức vừa phải

```
cwnd
  ^
  │         /\
  │        /  \         /────────── Congestion Avoidance (linear)
  │       /    \       /
  │      /      \     /
  │     / Slow   \   /
  │    /  Start   \ / ← Fast Recovery (cwnd halved)
  │   / (exponential)
  │  /
  │ /
  └──────────────────────────→ time
           ↑
      3 dup ACKs (packet loss detected)
```

**TCP Variants:**

- **TCP Tahoe**: Sau loss → cwnd = 1 (quay về slow start). Cũ.
- **TCP Reno**: Sau fast retransmit → fast recovery (cwnd = cwnd/2). Phổ biến.
- **TCP Cubic**: Mặc định Linux. Dùng cubic function thay vì linear. Tốt cho high bandwidth-delay.
- **TCP BBR** (Google): Dựa trên bottleneck bandwidth và RTT. Tối ưu cho Internet hiện đại.

---

### Q: TCP Keepalive là gì? 🟡 🟡 [Mid]

**A:** TCP keepalive là cơ chế kiểm tra xem connection có còn sống không khi không có data truyền.

- Sau thời gian idle (mặc định 2 giờ trên Linux), TCP gửi probe packet
- Nếu không nhận ACK sau nhiều probe → connection coi như chết

**Go code - TCP Keepalive:**

```go
conn, err := net.DialTimeout("tcp", "example.com:80", 5*time.Second)
if err != nil {
    log.Fatal(err)
}

// Bật keepalive
if tcpConn, ok := conn.(*net.TCPConn); ok {
    tcpConn.SetKeepAlive(true)
    tcpConn.SetKeepAlivePeriod(30 * time.Second)
}
```

---

### Q: Viết TCP server/client đơn giản bằng Go? 🟡 🟡 [Mid]

**A:**

**TCP Server:**

```go
package main

import (
    "bufio"
    "fmt"
    "log"
    "net"
    "strings"
)

func handleConnection(conn net.Conn) {
    defer conn.Close()

    remoteAddr := conn.RemoteAddr().String()
    log.Printf("Client connected: %s", remoteAddr)

    scanner := bufio.NewScanner(conn)
    for scanner.Scan() {
        msg := scanner.Text()
        log.Printf("[%s] Received: %s", remoteAddr, msg)

        // Echo back uppercase
        response := strings.ToUpper(msg) + "\n"
        _, err := conn.Write([]byte(response))
        if err != nil {
            log.Printf("Error writing to %s: %v", remoteAddr, err)
            return
        }
    }

    if err := scanner.Err(); err != nil {
        log.Printf("Scanner error for %s: %v", remoteAddr, err)
    }
    log.Printf("Client disconnected: %s", remoteAddr)
}

func main() {
    listener, err := net.Listen("tcp", ":8080")
    if err != nil {
        log.Fatal("Listen error:", err)
    }
    defer listener.Close()
    log.Println("TCP server listening on :8080")

    for {
        conn, err := listener.Accept()
        if err != nil {
            log.Println("Accept error:", err)
            continue
        }
        go handleConnection(conn) // Mỗi client 1 goroutine
    }
}
```

**TCP Client:**

```go
package main

import (
    "bufio"
    "fmt"
    "log"
    "net"
    "os"
)

func main() {
    conn, err := net.Dial("tcp", "localhost:8080")
    if err != nil {
        log.Fatal("Dial error:", err)
    }
    defer conn.Close()

    // Goroutine đọc response từ server
    go func() {
        scanner := bufio.NewScanner(conn)
        for scanner.Scan() {
            fmt.Println("Server:", scanner.Text())
        }
    }()

    // Đọc input từ user và gửi đến server
    scanner := bufio.NewScanner(os.Stdin)
    for scanner.Scan() {
        msg := scanner.Text()
        _, err := fmt.Fprintf(conn, "%s\n", msg)
        if err != nil {
            log.Println("Write error:", err)
            return
        }
    }
}
```

---

## 3. UDP

### Q: Đặc điểm chính của UDP? Khi nào dùng UDP? 🟢 🟢 [Junior]

**A:**

**Đặc điểm UDP:**

- **Connectionless**: Không cần handshake, gửi thẳng
- **Unreliable**: Không đảm bảo delivery, không retransmit
- **No ordering**: Packets có thể đến không theo thứ tự
- **No flow/congestion control**: Gửi nhanh nhất có thể
- **Lightweight**: Header chỉ 8 bytes (TCP: 20-60 bytes)
- **Supports multicast/broadcast**: TCP chỉ unicast

**UDP Header (8 bytes):**

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |        Destination Port       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            Length              |           Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**Khi nào dùng UDP:**

- **DNS**: Query nhỏ, cần nhanh, retry ở application layer
- **Video streaming / VoIP**: Mất vài frame chấp nhận được, latency quan trọng hơn reliability
- **Online gaming**: Real-time updates, chấp nhận mất packet
- **IoT sensors**: Gửi data nhỏ, frequent, device resource hạn chế
- **QUIC (HTTP/3)**: Xây reliability layer riêng trên UDP

---

### Q: So sánh TCP vs UDP? 🟢 🟢 [Junior]

**A:**

| Tiêu chí            | TCP                             | UDP                       |
| ------------------- | ------------------------------- | ------------------------- |
| Connection          | Connection-oriented (handshake) | Connectionless            |
| Reliability         | Guaranteed delivery, retransmit | Best-effort, no guarantee |
| Ordering            | In-order delivery               | No ordering               |
| Flow Control        | Sliding window                  | None                      |
| Congestion Control  | Slow start, AIMD, etc.          | None                      |
| Header Size         | 20-60 bytes                     | 8 bytes                   |
| Speed               | Slower (overhead)               | Faster                    |
| Broadcast/Multicast | No                              | Yes                       |
| Use Case            | Web, email, file transfer       | DNS, streaming, gaming    |

---

### Q: Viết UDP server/client bằng Go? 🟡 🟡 [Mid]

**A:**

**UDP Server:**

```go
package main

import (
    "log"
    "net"
)

func main() {
    // ListenPacket mở UDP socket
    pc, err := net.ListenPacket("udp", ":9090")
    if err != nil {
        log.Fatal(err)
    }
    defer pc.Close()
    log.Println("UDP server listening on :9090")

    buf := make([]byte, 1024)
    for {
        n, addr, err := pc.ReadFrom(buf)
        if err != nil {
            log.Println("ReadFrom error:", err)
            continue
        }

        msg := string(buf[:n])
        log.Printf("Received from %s: %s", addr, msg)

        // Echo back
        response := []byte("ACK: " + msg)
        _, err = pc.WriteTo(response, addr)
        if err != nil {
            log.Printf("WriteTo error: %v", err)
        }
    }
}
```

**UDP Client:**

```go
package main

import (
    "fmt"
    "log"
    "net"
    "time"
)

func main() {
    conn, err := net.Dial("udp", "localhost:9090")
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    // Gửi message
    msg := []byte("Hello UDP!")
    _, err = conn.Write(msg)
    if err != nil {
        log.Fatal(err)
    }

    // Đọc response với timeout
    conn.SetReadDeadline(time.Now().Add(3 * time.Second))
    buf := make([]byte, 1024)
    n, err := conn.Read(buf)
    if err != nil {
        log.Fatal("Read error:", err)
    }
    fmt.Println("Server response:", string(buf[:n]))
}
```

---

## 4. HTTP/1.1 vs HTTP/2 vs HTTP/3

### Q: Giải thích sự khác biệt giữa HTTP/1.1, HTTP/2, HTTP/3? 🟡 🟡 [Mid]

**A:**

**HTTP/1.1 (1997):**

- **Persistent connections**: `Connection: keep-alive` mặc định (không cần reconnect mỗi request)
- **Pipelining**: Gửi nhiều requests mà không cần chờ response (nhưng response phải theo thứ tự → HOL blocking)
- **Head-of-Line (HOL) Blocking**: Request chậm chặn toàn bộ requests phía sau trên cùng connection
- **Chunked Transfer**: Gửi response từng chunk mà không cần biết trước content-length
- **Workarounds**: Browser mở 6-8 TCP connections song song đến cùng domain

**HTTP/2 (2015):**

- **Binary Framing**: Thay vì text-based, dùng binary frames → parse nhanh hơn, compact hơn
- **Multiplexing**: Nhiều requests/responses đồng thời trên **1 TCP connection** → giải quyết HOL blocking ở HTTP layer
- **Stream Prioritization**: Client gợi ý priority cho mỗi stream
- **Header Compression (HPACK)**: Nén headers bằng static/dynamic table + Huffman encoding
- **Server Push**: Server chủ động push resources mà client chưa request (VD: push CSS khi client request HTML)
- **Vấn đề**: Vẫn bị TCP-level HOL blocking (1 packet loss → block tất cả streams)

```
HTTP/1.1:                    HTTP/2:
┌─────── TCP Conn 1 ───┐    ┌────── Single TCP Conn ──────┐
│ GET /style.css        │    │ Stream 1: GET /index.html   │
│ (waiting response...) │    │ Stream 2: GET /style.css    │
└───────────────────────┘    │ Stream 3: GET /script.js    │
┌─────── TCP Conn 2 ───┐    │ Stream 4: GET /image.png    │
│ GET /script.js        │    │ (all multiplexed together)  │
│ (waiting response...) │    └─────────────────────────────┘
└───────────────────────┘
```

**HTTP/3 (2022):**

- **QUIC Protocol**: Xây dựng trên **UDP** (không phải TCP)
- **Giải quyết TCP HOL blocking**: Mỗi stream độc lập, packet loss chỉ ảnh hưởng stream đó
- **0-RTT Connection**: Resumption cho returning clients → instant requests
- **Connection Migration**: Chuyển network (WiFi → 4G) mà không mất connection (dùng Connection ID thay vì IP:Port tuple)
- **Built-in TLS 1.3**: Encryption bắt buộc, tích hợp vào handshake
- **Improved Congestion Control**: Không bị giới hạn bởi kernel TCP stack

---

### Q: So sánh HTTP/1.1 vs HTTP/2 vs HTTP/3? 🟡 🟡 [Mid]

**A:**

| Feature              | HTTP/1.1              | HTTP/2                          | HTTP/3                       |
| -------------------- | --------------------- | ------------------------------- | ---------------------------- |
| Transport            | TCP                   | TCP                             | QUIC (UDP)                   |
| Format               | Text                  | Binary                          | Binary                       |
| Multiplexing         | No (pipeline limited) | Yes (streams)                   | Yes (independent streams)    |
| HOL Blocking         | HTTP + TCP level      | TCP level only                  | None                         |
| Header Compression   | None                  | HPACK                           | QPACK                        |
| Server Push          | No                    | Yes                             | Yes                          |
| TLS                  | Optional              | Optional (but browsers require) | Mandatory (built-in)         |
| Connection Setup     | TCP + TLS = 2-3 RTT   | TCP + TLS = 2-3 RTT             | 1 RTT (0-RTT for resumption) |
| Connection Migration | No                    | No                              | Yes (Connection ID)          |

---

### Q: Viết HTTP server với HTTP/2 support bằng Go? 🟡 🟡 [Mid]

**A:**

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"
)

// Middleware: logging
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %s %v", r.Method, r.URL.Path, r.Proto, time.Since(start))
        // r.Proto sẽ là "HTTP/2.0" nếu client dùng HTTP/2
    })
}

type Response struct {
    Message  string `json:"message"`
    Protocol string `json:"protocol"`
}

func main() {
    mux := http.NewServeMux()

    mux.HandleFunc("GET /api/hello", func(w http.ResponseWriter, r *http.Request) {
        resp := Response{
            Message:  "Hello, World!",
            Protocol: r.Proto, // HTTP/1.1 or HTTP/2.0
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(resp)
    })

    // HTTP/2 tự động enable khi dùng TLS (ListenAndServeTLS)
    // Go's net/http hỗ trợ HTTP/2 out-of-the-box từ Go 1.6
    server := &http.Server{
        Addr:         ":8443",
        Handler:      loggingMiddleware(mux),
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    log.Println("Server starting on :8443 (HTTP/2 enabled with TLS)")
    // Cần TLS cert để enable HTTP/2
    log.Fatal(server.ListenAndServeTLS("server.crt", "server.key"))

    // Nếu không có TLS, dùng h2c (HTTP/2 cleartext) - không khuyến khích cho production
    // import "golang.org/x/net/http2/h2c"
    // import "golang.org/x/net/http2"
    // h2s := &http2.Server{}
    // server.Handler = h2c.NewHandler(mux, h2s)
    // server.ListenAndServe()
}
```

---

## 5. HTTPS / TLS

### Q: Mô tả TLS 1.2 Handshake đầy đủ? 🟡 🟡 [Mid]

**A:**

```
Client                                          Server
  │                                                │
  │──── (1) Client Hello ───────────────────────→│
  │     - TLS version                              │
  │     - Cipher suites supported                  │
  │     - Client random (28 bytes)                 │
  │     - Session ID (for resumption)              │
  │                                                │
  │←─── (2) Server Hello ─────────────────────── │
  │     - Chosen TLS version                       │
  │     - Chosen cipher suite                      │
  │     - Server random (28 bytes)                 │
  │                                                │
  │←─── (3) Certificate ──────────────────────── │
  │     - Server's X.509 certificate chain         │
  │                                                │
  │←─── (4) Server Key Exchange ────────────────  │
  │     - DH/ECDH parameters (if needed)           │
  │                                                │
  │←─── (5) Server Hello Done ──────────────────  │
  │                                                │
  │──── (6) Client Key Exchange ────────────────→│
  │     - Pre-master secret (encrypted with        │
  │       server's public key)                     │
  │                                                │
  │──── (7) Change Cipher Spec ─────────────────→│
  │     - "Switching to encrypted communication"   │
  │                                                │
  │──── (8) Finished ───────────────────────────→│
  │     - Encrypted with derived keys              │
  │                                                │
  │←─── (9) Change Cipher Spec ────────────────  │
  │←─── (10) Finished ─────────────────────────  │
  │                                                │
  │═══════ Encrypted Data Transfer ═══════════════│
```

**Tổng cộng: 2 RTT** để hoàn thành TLS 1.2 handshake (cộng thêm 1 RTT cho TCP = 3 RTT trước khi gửi data).

**Key derivation**: `master_secret = PRF(pre_master_secret, "master secret", client_random + server_random)` → Từ master_secret sinh ra encryption keys cho cả hai bên.

---

### Q: TLS 1.3 cải tiến gì so với TLS 1.2? 🟡 🟡 [Mid]

**A:**

**Cải tiến chính:**

1. **1-RTT Handshake** (giảm từ 2-RTT):
   - Client gửi key share ngay trong Client Hello (đoán cipher suite)
   - Giảm round trips, nhanh hơn đáng kể

2. **0-RTT Resumption**:
   - Returning client gửi encrypted data ngay từ message đầu tiên
   - Lưu ý: 0-RTT có replay attack risk → chỉ dùng cho idempotent requests

3. **Loại bỏ các cipher suites yếu**:
   - Bỏ: RSA key exchange, CBC mode, RC4, SHA-1, DES, 3DES
   - Chỉ còn: AEAD ciphers (AES-GCM, ChaCha20-Poly1305)
   - Forward secrecy bắt buộc (ECDHE/DHE)

4. **Encrypted handshake**:
   - Certificate được encrypt (không lộ trên mạng)
   - Tăng privacy

```
TLS 1.2: TCP Handshake (1 RTT) + TLS Handshake (2 RTT) = 3 RTT
TLS 1.3: TCP Handshake (1 RTT) + TLS Handshake (1 RTT) = 2 RTT
TLS 1.3 (0-RTT resumption): TCP (1 RTT) + TLS (0 RTT) = 1 RTT
```

---

### Q: Giải thích Certificate Chain, CA, Certificate Pinning? 🟡 🟡 [Mid]

**A:**

**Certificate Chain (Chain of Trust):**

```
Root CA (self-signed, pre-installed in OS/browser)
  └─ Intermediate CA (signed by Root CA)
       └─ Server Certificate (signed by Intermediate CA)
```

- Browser verify: Server cert → signed bởi Intermediate CA? → Intermediate signed bởi Root CA? → Root CA trusted? ✓
- Root CAs được pre-install trong OS (khoảng 100-150 root CAs)

**Certificate Pinning:**

- Client hardcode (pin) expected certificate hoặc public key
- Ngăn MITM dù attacker có valid cert từ CA khác
- **Ưu**: Rất an toàn. **Nhược**: Khó rotate cert, cần update client.
- Mobile apps (Grab, Zalo) thường dùng certificate pinning.

---

### Q: mTLS (Mutual TLS) là gì? Khi nào dùng? 🔴 🔴 [Senior]

**A:**

**mTLS**: Cả client VÀ server đều present certificate để authenticate lẫn nhau (TLS thông thường chỉ server present cert).

**Khi nào dùng:**

- **Service-to-service** communication trong microservices (zero-trust network)
- **API authentication** thay vì API keys
- **IoT devices** authenticate với cloud server
- **Financial systems**, internal corporate networks

**Go code - mTLS Setup:**

```go
package main

import (
    "crypto/tls"
    "crypto/x509"
    "log"
    "net/http"
    "os"
)

// === mTLS Server ===
func startMTLSServer() {
    // Load CA cert để verify client certificates
    caCert, err := os.ReadFile("ca.crt")
    if err != nil {
        log.Fatal(err)
    }
    caCertPool := x509.NewCertPool()
    caCertPool.AppendCertsFromPEM(caCert)

    tlsConfig := &tls.Config{
        ClientCAs:  caCertPool,
        ClientAuth: tls.RequireAndVerifyClientCert, // Bắt buộc client cert
        MinVersion: tls.VersionTLS13,
    }

    server := &http.Server{
        Addr:      ":8443",
        TLSConfig: tlsConfig,
        Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // Access client certificate info
            if len(r.TLS.PeerCertificates) > 0 {
                clientCN := r.TLS.PeerCertificates[0].Subject.CommonName
                w.Write([]byte("Hello, " + clientCN))
            }
        }),
    }

    log.Println("mTLS server starting on :8443")
    log.Fatal(server.ListenAndServeTLS("server.crt", "server.key"))
}

// === mTLS Client ===
func createMTLSClient() *http.Client {
    // Load client certificate
    clientCert, err := tls.LoadX509KeyPair("client.crt", "client.key")
    if err != nil {
        log.Fatal(err)
    }

    // Load CA cert để verify server
    caCert, err := os.ReadFile("ca.crt")
    if err != nil {
        log.Fatal(err)
    }
    caCertPool := x509.NewCertPool()
    caCertPool.AppendCertsFromPEM(caCert)

    tlsConfig := &tls.Config{
        Certificates: []tls.Certificate{clientCert},
        RootCAs:      caCertPool,
        MinVersion:   tls.VersionTLS13,
    }

    return &http.Client{
        Transport: &http.Transport{
            TLSClientConfig: tlsConfig,
        },
    }
}
```

> **💡 Interview Tip (Axon, Grab)**: mTLS rất quan trọng trong microservices. Axon sử dụng service mesh (Istio) với mTLS. Grab dùng mTLS cho internal communication.

---

## 6. DNS

### Q: Mô tả quá trình DNS resolution? 🟢 🟢 [Junior]

**A:**

```
User types: www.example.com

(1) Browser Cache → miss
(2) OS Cache (/etc/hosts, nscd) → miss
(3) Router Cache → miss
(4) ISP Recursive Resolver

    Recursive Resolver                     Root DNS (.com, .org, .net)
         │                                        │
    (5)  │── "Who knows .com?" ──────────────────→│
         │←─ "Ask .com TLD server at x.x.x.x" ──│
         │
         │                                   .com TLD Server
    (6)  │── "Who knows example.com?" ───────────→│
         │←─ "Ask example.com NS at y.y.y.y" ────│
         │
         │                             example.com Authoritative NS
    (7)  │── "What is www.example.com?" ─────────→│
         │←─ "93.184.216.34 (TTL=3600)" ─────────│
         │
    (8)  Cache result (TTL=3600s)
         Return to client
```

**Recursive vs Iterative:**

- **Recursive**: Client hỏi resolver, resolver lo toàn bộ (VD: ISP DNS, Google 8.8.8.8)
- **Iterative**: Resolver hỏi từng server, mỗi server trả lời "tôi không biết, hỏi server kia" (giữa các DNS servers)

---

### Q: Các DNS record types quan trọng? 🟢 🟢 [Junior]

**A:**

| Record    | Chức năng                        | Ví dụ                                                   |
| --------- | -------------------------------- | ------------------------------------------------------- |
| **A**     | Map domain → IPv4                | `example.com → 93.184.216.34`                           |
| **AAAA**  | Map domain → IPv6                | `example.com → 2606:2800:220:1:...`                     |
| **CNAME** | Alias cho domain khác            | `www.example.com → example.com`                         |
| **MX**    | Mail server cho domain           | `example.com → mail.example.com (priority 10)`          |
| **NS**    | Nameserver cho domain            | `example.com → ns1.example.com`                         |
| **TXT**   | Text record (SPF, DKIM, verify)  | `example.com → "v=spf1 include:_spf.google.com"`        |
| **SRV**   | Service discovery (port, weight) | `_grpc._tcp.example.com → 0 5 8080 server1.example.com` |
| **PTR**   | Reverse DNS (IP → domain)        | `34.216.184.93.in-addr.arpa → example.com`              |
| **SOA**   | Start of Authority               | Zone admin info, serial, refresh timing                 |

**DNS Caching & TTL:**

- **TTL (Time To Live)**: Thời gian DNS record được cache (giây)
- Low TTL (60s): Linh hoạt thay đổi IP, nhưng nhiều DNS queries hơn
- High TTL (86400s/1 day): Ít queries, nhưng thay đổi IP mất thời gian propagate

**DNS Load Balancing (Round-Robin DNS):**

- Một domain có nhiều A records → DNS trả về theo round-robin
- Đơn giản nhưng không health-check, không weighted

---

### Q: Viết DNS lookup bằng Go? 🟡 🟡 [Mid]

**A:**

```go
package main

import (
    "context"
    "fmt"
    "log"
    "net"
    "time"
)

func main() {
    // === Basic DNS Lookup ===
    ips, err := net.LookupHost("www.google.com")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("IPs for www.google.com:", ips)

    // === Lookup specific record types ===
    // MX records
    mxRecords, err := net.LookupMX("google.com")
    if err == nil {
        for _, mx := range mxRecords {
            fmt.Printf("MX: %s (priority %d)\n", mx.Host, mx.Pref)
        }
    }

    // TXT records
    txtRecords, err := net.LookupTXT("google.com")
    if err == nil {
        for _, txt := range txtRecords {
            fmt.Println("TXT:", txt)
        }
    }

    // NS records
    nsRecords, err := net.LookupNS("google.com")
    if err == nil {
        for _, ns := range nsRecords {
            fmt.Println("NS:", ns.Host)
        }
    }

    // === Custom DNS Resolver ===
    resolver := &net.Resolver{
        PreferGo: true,
        Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
            d := net.Dialer{Timeout: 5 * time.Second}
            // Sử dụng Google Public DNS
            return d.DialContext(ctx, "udp", "8.8.8.8:53")
        },
    }

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    addrs, err := resolver.LookupHost(ctx, "www.example.com")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Custom resolver result:", addrs)

    // === SRV Records (Service Discovery) ===
    // Thường dùng trong microservices, Kubernetes, gRPC
    _, srvRecords, err := net.LookupSRV("grpc", "tcp", "example.com")
    if err == nil {
        for _, srv := range srvRecords {
            fmt.Printf("SRV: %s:%d (priority=%d, weight=%d)\n",
                srv.Target, srv.Port, srv.Priority, srv.Weight)
        }
    }
}
```

---

## 7. WebSocket

### Q: WebSocket hoạt động như thế nào? 🟡 🟡 [Mid]

**A:**

**HTTP Upgrade Process:**

```
Client → Server (HTTP Request):
    GET /chat HTTP/1.1
    Host: example.com
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
    Sec-WebSocket-Version: 13

Server → Client (HTTP 101 Response):
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

    ═══ Full-Duplex WebSocket Connection Established ═══
```

**Đặc điểm:**

- **Full-duplex**: Client và server gửi data bất cứ lúc nào (không cần request-response)
- **Persistent**: Connection giữ mở cho đến khi một bên close
- **Low overhead**: Sau handshake, frame header rất nhỏ (2-14 bytes)
- **Text hoặc Binary frames**: Hỗ trợ cả hai

---

### Q: So sánh WebSocket vs SSE vs Long Polling? 🟡 🟡 [Mid]

**A:**

| Feature         | WebSocket                   | SSE (Server-Sent Events) | Long Polling                |
| --------------- | --------------------------- | ------------------------ | --------------------------- |
| Direction       | Bidirectional               | Server → Client only     | Bidirectional (simulated)   |
| Protocol        | ws:// / wss://              | HTTP                     | HTTP                        |
| Connection      | Persistent                  | Persistent               | Repeated requests           |
| Overhead        | Low (small frames)          | Low                      | High (HTTP headers mỗi lần) |
| Auto-reconnect  | Manual                      | Built-in                 | Manual                      |
| Binary data     | Yes                         | No (text only)           | Yes                         |
| Browser support | Excellent                   | Good (no IE)             | Universal                   |
| Use case        | Chat, gaming, collaboration | Notifications, live feed | Legacy systems              |

**Use cases thực tế:**

- **Zalo Chat**: WebSocket (bidirectional messaging)
- **Live notifications**: SSE (server push, đơn giản hơn)
- **Dashboards**: SSE hoặc WebSocket tùy cần user input không

---

### Q: Viết WebSocket server bằng Go? 🟡 🟡 [Mid]

**A:**

```go
package main

import (
    "log"
    "net/http"
    "sync"

    "github.com/gorilla/websocket"
)

// Upgrader chuyển HTTP connection thành WebSocket
var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true // Production: kiểm tra origin cẩn thận
    },
}

// Hub quản lý tất cả clients - pattern phổ biến cho chat server
type Hub struct {
    mu      sync.RWMutex
    clients map[*websocket.Conn]bool
}

func NewHub() *Hub {
    return &Hub{clients: make(map[*websocket.Conn]bool)}
}

func (h *Hub) Register(conn *websocket.Conn) {
    h.mu.Lock()
    defer h.mu.Unlock()
    h.clients[conn] = true
    log.Printf("Client connected. Total: %d", len(h.clients))
}

func (h *Hub) Unregister(conn *websocket.Conn) {
    h.mu.Lock()
    defer h.mu.Unlock()
    delete(h.clients, conn)
    log.Printf("Client disconnected. Total: %d", len(h.clients))
}

func (h *Hub) Broadcast(messageType int, message []byte) {
    h.mu.RLock()
    defer h.mu.RUnlock()
    for conn := range h.clients {
        if err := conn.WriteMessage(messageType, message); err != nil {
            log.Println("Write error:", err)
            conn.Close()
            delete(h.clients, conn)
        }
    }
}

func main() {
    hub := NewHub()

    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        // Upgrade HTTP → WebSocket
        conn, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            log.Println("Upgrade error:", err)
            return
        }
        defer conn.Close()

        hub.Register(conn)
        defer hub.Unregister(conn)

        // Read loop: nhận message từ client, broadcast cho tất cả
        for {
            messageType, msg, err := conn.ReadMessage()
            if err != nil {
                if websocket.IsUnexpectedCloseError(err,
                    websocket.CloseGoingAway,
                    websocket.CloseNormalClosure) {
                    log.Printf("Unexpected close: %v", err)
                }
                break
            }
            log.Printf("Received: %s", msg)

            // Broadcast cho tất cả clients
            hub.Broadcast(messageType, msg)
        }
    })

    log.Println("WebSocket server on :8080/ws")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

> **💡 Interview Tip (Zalo)**: Zalo dùng WebSocket cho chat real-time. Khi phỏng vấn ở Zalo, hãy sẵn sàng thảo luận về scaling WebSocket servers (sticky sessions, pub/sub backend với Redis/Kafka, connection management).

---

## 8. gRPC

### Q: gRPC là gì? Tại sao dùng HTTP/2? 🟡 🟡 [Mid]

**A:**

**gRPC** (Google Remote Procedure Call) là framework RPC hiệu năng cao do Google phát triển:

- Sử dụng **Protocol Buffers** (protobuf) cho serialization (nhỏ, nhanh hơn JSON)
- Chạy trên **HTTP/2** → multiplexing, header compression, bidirectional streaming
- Code generation cho nhiều ngôn ngữ (Go, Java, Python, C++, ...)
- Built-in features: deadlines, cancellation, interceptors, load balancing

**Tại sao HTTP/2?**

- **Multiplexing**: Nhiều RPC calls trên 1 connection
- **Bidirectional streaming**: Cần cho streaming RPCs
- **Header compression**: Giảm overhead cho metadata/headers
- **Flow control**: Per-stream flow control

---

### Q: 4 loại gRPC communication patterns? 🟡 🟡 [Mid]

**A:**

```protobuf
// File: service.proto
syntax = "proto3";
package chat;

option go_package = "./chatpb";

message ChatMessage {
    string user = 1;
    string text = 2;
    int64 timestamp = 3;
}

message ChatResponse {
    string status = 1;
}

message Empty {}

service ChatService {
    // 1. Unary: Client gửi 1 request, server trả 1 response
    rpc SendMessage(ChatMessage) returns (ChatResponse);

    // 2. Server Streaming: Client gửi 1 request, server trả stream responses
    rpc GetMessageHistory(Empty) returns (stream ChatMessage);

    // 3. Client Streaming: Client gửi stream requests, server trả 1 response
    rpc UploadMessages(stream ChatMessage) returns (ChatResponse);

    // 4. Bidirectional Streaming: Cả hai gửi stream
    rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}
```

| Pattern          | Client     | Server      | Use Case                            |
| ---------------- | ---------- | ----------- | ----------------------------------- |
| Unary            | 1 request  | 1 response  | CRUD operations, simple queries     |
| Server Streaming | 1 request  | N responses | Feed, real-time updates, large data |
| Client Streaming | N requests | 1 response  | File upload, aggregation            |
| Bidirectional    | N requests | N responses | Chat, gaming, collaborative editing |

---

### Q: Viết gRPC server và client bằng Go? 🔴 🔴 [Senior]

**A:**

**1. Proto file** (đã định nghĩa ở trên, generate code):

```bash
protoc --go_out=. --go-grpc_out=. service.proto
```

**2. gRPC Server:**

```go
package main

import (
    "context"
    "io"
    "log"
    "net"
    "time"

    pb "myapp/chatpb"
    "google.golang.org/grpc"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

type chatServer struct {
    pb.UnimplementedChatServiceServer
    messages []*pb.ChatMessage
}

// Unary RPC
func (s *chatServer) SendMessage(ctx context.Context, msg *pb.ChatMessage) (*pb.ChatResponse, error) {
    // Check deadline/cancellation
    if ctx.Err() == context.DeadlineExceeded {
        return nil, status.Error(codes.DeadlineExceeded, "deadline exceeded")
    }

    log.Printf("Message from %s: %s", msg.User, msg.Text)
    s.messages = append(s.messages, msg)
    return &pb.ChatResponse{Status: "received"}, nil
}

// Server Streaming RPC
func (s *chatServer) GetMessageHistory(_ *pb.Empty, stream pb.ChatService_GetMessageHistoryServer) error {
    for _, msg := range s.messages {
        if err := stream.Send(msg); err != nil {
            return status.Error(codes.Internal, "failed to send message")
        }
        time.Sleep(100 * time.Millisecond) // Simulate delay
    }
    return nil
}

// Client Streaming RPC
func (s *chatServer) UploadMessages(stream pb.ChatService_UploadMessagesServer) error {
    count := 0
    for {
        msg, err := stream.Recv()
        if err == io.EOF {
            // Client done sending
            return stream.SendAndClose(&pb.ChatResponse{
                Status: fmt.Sprintf("received %d messages", count),
            })
        }
        if err != nil {
            return status.Error(codes.Internal, err.Error())
        }
        s.messages = append(s.messages, msg)
        count++
    }
}

// Bidirectional Streaming RPC
func (s *chatServer) Chat(stream pb.ChatService_ChatServer) error {
    for {
        msg, err := stream.Recv()
        if err == io.EOF {
            return nil
        }
        if err != nil {
            return err
        }

        log.Printf("Chat from %s: %s", msg.User, msg.Text)

        // Echo back with server info
        reply := &pb.ChatMessage{
            User:      "server",
            Text:      "Echo: " + msg.Text,
            Timestamp: time.Now().Unix(),
        }
        if err := stream.Send(reply); err != nil {
            return err
        }
    }
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatal(err)
    }

    // Server với interceptor (middleware)
    s := grpc.NewServer(
        grpc.UnaryInterceptor(loggingUnaryInterceptor),
        grpc.StreamInterceptor(loggingStreamInterceptor),
    )
    pb.RegisterChatServiceServer(s, &chatServer{})

    log.Println("gRPC server listening on :50051")
    log.Fatal(s.Serve(lis))
}

// Unary Interceptor (giống middleware)
func loggingUnaryInterceptor(
    ctx context.Context,
    req interface{},
    info *grpc.UnaryServerInfo,
    handler grpc.UnaryHandler,
) (interface{}, error) {
    start := time.Now()
    resp, err := handler(ctx, req)
    log.Printf("Unary RPC: %s | Duration: %v | Error: %v",
        info.FullMethod, time.Since(start), err)
    return resp, err
}

// Stream Interceptor
func loggingStreamInterceptor(
    srv interface{},
    ss grpc.ServerStream,
    info *grpc.StreamServerInfo,
    handler grpc.StreamHandler,
) error {
    start := time.Now()
    err := handler(srv, ss)
    log.Printf("Stream RPC: %s | Duration: %v | Error: %v",
        info.FullMethod, time.Since(start), err)
    return err
}
```

**3. gRPC Client:**

```go
package main

import (
    "context"
    "io"
    "log"
    "time"

    pb "myapp/chatpb"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
)

func main() {
    conn, err := grpc.Dial("localhost:50051",
        grpc.WithTransportCredentials(insecure.NewCredentials()),
    )
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    client := pb.NewChatServiceClient(conn)

    // === Unary RPC with deadline ===
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    resp, err := client.SendMessage(ctx, &pb.ChatMessage{
        User:      "alice",
        Text:      "Hello gRPC!",
        Timestamp: time.Now().Unix(),
    })
    if err != nil {
        log.Fatal("SendMessage error:", err)
    }
    log.Println("Response:", resp.Status)

    // === Server Streaming RPC ===
    stream, err := client.GetMessageHistory(ctx, &pb.Empty{})
    if err != nil {
        log.Fatal(err)
    }
    for {
        msg, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            log.Fatal(err)
        }
        log.Printf("History: [%s] %s", msg.User, msg.Text)
    }

    // === Bidirectional Streaming ===
    chatStream, err := client.Chat(ctx)
    if err != nil {
        log.Fatal(err)
    }

    // Send messages in goroutine
    go func() {
        messages := []string{"Hi", "How are you?", "Bye"}
        for _, text := range messages {
            err := chatStream.Send(&pb.ChatMessage{
                User: "alice",
                Text: text,
            })
            if err != nil {
                log.Fatal(err)
            }
            time.Sleep(500 * time.Millisecond)
        }
        chatStream.CloseSend()
    }()

    // Receive responses
    for {
        msg, err := chatStream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            log.Fatal(err)
        }
        log.Printf("Chat reply: [%s] %s", msg.User, msg.Text)
    }
}
```

---

### Q: So sánh gRPC vs REST? 🟡 🟡 [Mid]

**A:**

| Feature         | gRPC                        | REST                          |
| --------------- | --------------------------- | ----------------------------- |
| Protocol        | HTTP/2                      | HTTP/1.1 (usually)            |
| Format          | Protobuf (binary)           | JSON (text)                   |
| Contract        | .proto file (strict)        | OpenAPI/Swagger (optional)    |
| Code Gen        | Built-in, multi-language    | Third-party tools             |
| Streaming       | Bidirectional native        | Limited (SSE, WebSocket)      |
| Performance     | Fast (binary, multiplexing) | Slower (text parsing, no mux) |
| Browser Support | Limited (grpc-web)          | Native                        |
| Tooling         | gRPC-specific               | Curl, Postman, universal      |
| Error Handling  | Status codes (16 codes)     | HTTP status codes             |
| Use Case        | Internal microservices      | Public APIs, web clients      |

**gRPC Error Codes:**

- `OK (0)`, `CANCELLED (1)`, `UNKNOWN (2)`, `INVALID_ARGUMENT (3)`
- `DEADLINE_EXCEEDED (4)`, `NOT_FOUND (5)`, `ALREADY_EXISTS (6)`
- `PERMISSION_DENIED (7)`, `UNAUTHENTICATED (16)`, `UNAVAILABLE (14)`
- `INTERNAL (13)`, `UNIMPLEMENTED (12)`, `RESOURCE_EXHAUSTED (8)`

> **💡 Interview Tip (Grab, Axon)**: Grab sử dụng gRPC rộng rãi cho internal service communication. Axon cũng dùng gRPC. Hãy hiểu rõ interceptors (tương đương middleware), deadline propagation qua context, và streaming patterns.

---

## 9. Load Balancing

### Q: L4 vs L7 Load Balancing khác nhau thế nào? 🟡 🟡 [Mid]

**A:**

**L4 Load Balancing (Transport Layer):**

- Quyết định routing dựa trên: **IP address, TCP/UDP port**
- Không inspect nội dung request (không biết HTTP headers, URL path)
- Nhanh hơn (ít xử lý), latency thấp
- VD: AWS NLB, HAProxy (TCP mode), IPVS

**L7 Load Balancing (Application Layer):**

- Quyết định routing dựa trên: **HTTP headers, URL, cookies, request body**
- Content-aware: route `/api` tới API servers, `/static` tới CDN
- Hỗ trợ: SSL termination, compression, caching, WAF
- VD: AWS ALB, Nginx, Envoy, HAProxy (HTTP mode)

```
L4 Load Balancer:
Client ──→ [LB sees: src=1.2.3.4:5000, dst=LB:80] ──→ Backend Server
           (Decision based on IP:Port only)

L7 Load Balancer:
Client ──→ [LB sees: GET /api/users, Host: api.example.com] ──→ API Server
Client ──→ [LB sees: GET /images/logo.png]                  ──→ Static Server
           (Decision based on HTTP content)
```

| Feature         | L4                       | L7                       |
| --------------- | ------------------------ | ------------------------ |
| Layer           | Transport                | Application              |
| Speed           | Very fast                | Slower (inspect content) |
| Intelligence    | Dumb (IP:Port)           | Smart (HTTP-aware)       |
| SSL Termination | No (pass-through)        | Yes                      |
| Content Routing | No                       | Yes                      |
| WebSocket       | Pass-through             | Aware                    |
| Sticky Sessions | IP hash only             | Cookie-based             |
| Use Case        | High throughput, TCP/UDP | HTTP APIs, microservices |

---

### Q: Các thuật toán Load Balancing? 🟡 🟡 [Mid]

**A:**

**1. Round Robin:**

- Chia đều request theo thứ tự vòng tròn: Server 1 → 2 → 3 → 1 → ...
- Đơn giản, hiệu quả khi servers đồng đều

**2. Weighted Round Robin:**

- Gán weight cho mỗi server: Server A (weight=3) nhận 3x requests so với Server B (weight=1)
- Phù hợp khi servers có capacity khác nhau

**3. Least Connections:**

- Gửi request tới server có ít connections nhất
- Tốt cho long-lived connections (WebSocket, gRPC streaming)

**4. IP Hash:**

- Hash client IP → luôn route tới cùng server (sticky)
- Tốt cho session affinity (nhưng không uniform khi clients behind NAT)

**5. Consistent Hashing:**

- Servers và requests đặt trên hash ring
- Khi add/remove server: chỉ remap ~1/N requests (thay vì tất cả)
- Rất quan trọng cho distributed caching (Redis cluster, CDN)

```
Consistent Hash Ring:
                    Server A
                   /
          ────────●──────────
         /                    \
    ●                          ●  Server B
   Server D                     \
         \                    /
          ────────●──────────
                Server C

Request hash lands between D and A → routes to A
If A removed → only A's requests remap to B (not all)
```

**6. Random:**

- Chọn server ngẫu nhiên. Đơn giản, surprisingly effective với nhiều servers.

**7. Least Response Time:**

- Chọn server có response time thấp nhất + ít connections nhất

---

### Q: Viết simple reverse proxy / load balancer bằng Go? 🔴 🔴 [Senior]

**A:**

```go
package main

import (
    "log"
    "net/http"
    "net/http/httputil"
    "net/url"
    "sync"
    "sync/atomic"
    "time"
)

// Backend server
type Backend struct {
    URL          *url.URL
    Alive        bool
    ReverseProxy *httputil.ReverseProxy
    mu           sync.RWMutex
}

func (b *Backend) IsAlive() bool {
    b.mu.RLock()
    defer b.mu.RUnlock()
    return b.Alive
}

func (b *Backend) SetAlive(alive bool) {
    b.mu.Lock()
    defer b.mu.Unlock()
    b.Alive = alive
}

// Load Balancer with Round Robin
type LoadBalancer struct {
    backends []*Backend
    current  uint64
}

func NewLoadBalancer(urls []string) *LoadBalancer {
    var backends []*Backend
    for _, rawURL := range urls {
        u, err := url.Parse(rawURL)
        if err != nil {
            log.Fatal(err)
        }

        proxy := httputil.NewSingleHostReverseProxy(u)

        // Custom error handler
        proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
            log.Printf("Proxy error for %s: %v", u, err)
            w.WriteHeader(http.StatusBadGateway)
            w.Write([]byte("Bad Gateway"))
        }

        backends = append(backends, &Backend{
            URL:          u,
            Alive:        true,
            ReverseProxy: proxy,
        })
    }

    return &LoadBalancer{backends: backends}
}

// Round Robin: chọn backend tiếp theo
func (lb *LoadBalancer) NextBackend() *Backend {
    n := len(lb.backends)
    // Thử tối đa n lần để tìm server alive
    for i := 0; i < n; i++ {
        idx := atomic.AddUint64(&lb.current, 1) % uint64(n)
        backend := lb.backends[idx]
        if backend.IsAlive() {
            return backend
        }
    }
    return nil
}

// Health check: kiểm tra backend còn sống không
func (lb *LoadBalancer) HealthCheck() {
    for _, b := range lb.backends {
        // Thử TCP connect
        alive := isBackendAlive(b.URL)
        b.SetAlive(alive)
        status := "UP"
        if !alive {
            status = "DOWN"
        }
        log.Printf("Health check: %s [%s]", b.URL, status)
    }
}

func isBackendAlive(u *url.URL) bool {
    conn, err := net.DialTimeout("tcp", u.Host, 2*time.Second)
    if err != nil {
        return false
    }
    conn.Close()
    return true
}

func (lb *LoadBalancer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    backend := lb.NextBackend()
    if backend == nil {
        http.Error(w, "Service unavailable", http.StatusServiceUnavailable)
        return
    }

    log.Printf("Forwarding to %s", backend.URL)
    backend.ReverseProxy.ServeHTTP(w, r)
}

func main() {
    lb := NewLoadBalancer([]string{
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:8083",
    })

    // Periodic health check
    go func() {
        ticker := time.NewTicker(10 * time.Second)
        for range ticker.C {
            lb.HealthCheck()
        }
    }()

    server := &http.Server{
        Addr:    ":8080",
        Handler: lb,
    }

    log.Println("Load Balancer started on :8080")
    log.Fatal(server.ListenAndServe())
}
```

> **💡 Interview Tip**: Câu hỏi load balancing rất phổ biến trong system design. Hiểu rõ trade-offs giữa L4/L7, biết consistent hashing cho cache layer. Grab và Google thường hỏi sâu về consistent hashing.

---

## 10. REST API

### Q: REST principles là gì? 🟢 🟢 [Junior]

**A:**

REST (Representational State Transfer) - 6 nguyên tắc của Roy Fielding:

1. **Client-Server**: Tách biệt client và server, phát triển độc lập
2. **Stateless**: Mỗi request chứa đủ thông tin, server không lưu session state
3. **Cacheable**: Response phải chỉ rõ cacheable hay không
4. **Uniform Interface**: 4 sub-constraints:
   - Resource identification (URI)
   - Resource manipulation through representations (JSON/XML)
   - Self-descriptive messages (Content-Type, status codes)
   - HATEOAS (Hypermedia as the engine of application state)
5. **Layered System**: Client không biết đang nói chuyện trực tiếp với server hay proxy
6. **Code on Demand** (optional): Server có thể gửi executable code (JS)

---

### Q: HTTP Methods và Status Codes quan trọng? 🟢 🟢 [Junior]

**A:**

**HTTP Methods:**

| Method  | Idempotent | Safe | Purpose                                     |
| ------- | ---------- | ---- | ------------------------------------------- |
| GET     | Yes        | Yes  | Lấy resource                                |
| POST    | No         | No   | Tạo resource mới                            |
| PUT     | Yes        | No   | Replace toàn bộ resource                    |
| PATCH   | No\*       | No   | Update một phần resource                    |
| DELETE  | Yes        | No   | Xóa resource                                |
| HEAD    | Yes        | Yes  | Như GET nhưng không body (check existence)  |
| OPTIONS | Yes        | Yes  | Kiểm tra methods được phép (CORS preflight) |

\*PATCH có thể idempotent tùy implementation.

**Idempotent**: Gọi N lần cho cùng kết quả như gọi 1 lần. Quan trọng cho retry logic.

**Status Codes:**

| Code    | Name                  | Ý nghĩa                              |
| ------- | --------------------- | ------------------------------------ |
| **2xx** | **Success**           |                                      |
| 200     | OK                    | Thành công                           |
| 201     | Created               | Tạo resource mới (POST)              |
| 204     | No Content            | Thành công, không có body (DELETE)   |
| **3xx** | **Redirection**       |                                      |
| 301     | Moved Permanently     | URL đã thay đổi vĩnh viễn            |
| 302     | Found                 | Redirect tạm thời                    |
| 304     | Not Modified          | Resource chưa thay đổi (caching)     |
| **4xx** | **Client Error**      |                                      |
| 400     | Bad Request           | Request không hợp lệ                 |
| 401     | Unauthorized          | Chưa authenticate                    |
| 403     | Forbidden             | Đã authenticate nhưng không có quyền |
| 404     | Not Found             | Resource không tồn tại               |
| 405     | Method Not Allowed    | HTTP method không hỗ trợ             |
| 409     | Conflict              | Conflict (VD: duplicate email)       |
| 422     | Unprocessable Entity  | Validation error                     |
| 429     | Too Many Requests     | Rate limited                         |
| **5xx** | **Server Error**      |                                      |
| 500     | Internal Server Error | Lỗi server không xác định            |
| 502     | Bad Gateway           | Upstream server lỗi                  |
| 503     | Service Unavailable   | Server quá tải / maintenance         |
| 504     | Gateway Timeout       | Upstream server timeout              |

---

### Q: Pagination strategies? 🟡 🟡 [Mid]

**A:**

**1. Offset-based Pagination:**

```
GET /api/users?page=3&limit=20
-- SQL: SELECT * FROM users LIMIT 20 OFFSET 40
```

- **Ưu**: Đơn giản, nhảy đến page bất kỳ
- **Nhược**: Chậm với offset lớn (OFFSET 1000000), kết quả không ổn định khi data thay đổi (missing/duplicate items)

**2. Cursor-based Pagination (Recommended):**

```
GET /api/users?cursor=eyJpZCI6MTIzfQ==&limit=20
-- SQL: SELECT * FROM users WHERE id > 123 ORDER BY id LIMIT 20
```

- **Ưu**: Hiệu năng ổn định, kết quả consistent khi data thay đổi
- **Nhược**: Không nhảy đến page bất kỳ, chỉ next/prev

**3. Keyset Pagination** (cursor variant):

```
GET /api/users?after_id=123&after_created_at=2024-01-01&limit=20
-- SQL: SELECT * FROM users
--      WHERE (created_at, id) > ('2024-01-01', 123)
--      ORDER BY created_at, id LIMIT 20
```

---

### Q: CORS là gì? Preflight request? 🟡 🟡 [Mid]

**A:**

**CORS (Cross-Origin Resource Sharing):** Cơ chế cho phép web page ở domain A gọi API ở domain B.

**Same-Origin Policy**: Browser mặc định chặn cross-origin requests. CORS nới lỏng policy này.

**Preflight Request**: Browser tự động gửi `OPTIONS` request trước actual request khi:

- Method không phải GET, HEAD, POST
- Có custom headers
- Content-Type không phải `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`

```
Browser                              API Server (api.example.com)
  │                                        │
  │── OPTIONS /api/data ──────────────────→│  Preflight
  │   Origin: https://web.example.com      │
  │   Access-Control-Request-Method: PUT   │
  │   Access-Control-Request-Headers:      │
  │     Content-Type, Authorization        │
  │                                        │
  │←── 204 No Content ───────────────────│  Response
  │   Access-Control-Allow-Origin: *       │
  │   Access-Control-Allow-Methods:        │
  │     GET, POST, PUT, DELETE             │
  │   Access-Control-Allow-Headers:        │
  │     Content-Type, Authorization        │
  │   Access-Control-Max-Age: 86400        │
  │                                        │
  │── PUT /api/data ──────────────────────→│  Actual request
  │   (with body)                          │
  │                                        │
  │←── 200 OK ────────────────────────────│
```

---

### Q: Viết RESTful API với middleware chain bằng Go? 🟡 🟡 [Mid]

**A:**

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "strconv"
    "strings"
    "sync"
    "time"
)

// === Models ===
type User struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

type ErrorResponse struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
}

type PaginatedResponse struct {
    Data       interface{} `json:"data"`
    NextCursor string      `json:"next_cursor,omitempty"`
    Total      int         `json:"total"`
}

// === In-memory store ===
type UserStore struct {
    mu    sync.RWMutex
    users map[int]*User
    seq   int
}

func NewUserStore() *UserStore {
    return &UserStore{users: make(map[int]*User)}
}

// === Middleware ===
type Middleware func(http.Handler) http.Handler

// Chain: apply middlewares từ ngoài vào trong
func Chain(handler http.Handler, middlewares ...Middleware) http.Handler {
    for i := len(middlewares) - 1; i >= 0; i-- {
        handler = middlewares[i](handler)
    }
    return handler
}

// Logging middleware
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// CORS middleware
func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.Header().Set("Access-Control-Max-Age", "86400")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }
        next.ServeHTTP(w, r)
    })
}

// Recovery middleware (catch panics)
func RecoveryMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                log.Printf("PANIC: %v", err)
                writeJSON(w, http.StatusInternalServerError,
                    ErrorResponse{Code: 500, Message: "Internal Server Error"})
            }
        }()
        next.ServeHTTP(w, r)
    })
}

// === Handlers ===
func (s *UserStore) handleUsers(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        s.listUsers(w, r)
    case http.MethodPost:
        s.createUser(w, r)
    default:
        writeJSON(w, http.StatusMethodNotAllowed,
            ErrorResponse{Code: 405, Message: "Method not allowed"})
    }
}

func (s *UserStore) handleUser(w http.ResponseWriter, r *http.Request) {
    // Extract ID from path: /api/users/{id}
    parts := strings.Split(r.URL.Path, "/")
    if len(parts) < 4 {
        writeJSON(w, http.StatusBadRequest,
            ErrorResponse{Code: 400, Message: "Invalid path"})
        return
    }
    id, err := strconv.Atoi(parts[3])
    if err != nil {
        writeJSON(w, http.StatusBadRequest,
            ErrorResponse{Code: 400, Message: "Invalid user ID"})
        return
    }

    switch r.Method {
    case http.MethodGet:
        s.getUser(w, id)
    case http.MethodPut:
        s.updateUser(w, r, id)
    case http.MethodDelete:
        s.deleteUser(w, id)
    default:
        writeJSON(w, http.StatusMethodNotAllowed,
            ErrorResponse{Code: 405, Message: "Method not allowed"})
    }
}

func (s *UserStore) listUsers(w http.ResponseWriter, r *http.Request) {
    s.mu.RLock()
    defer s.mu.RUnlock()

    users := make([]*User, 0, len(s.users))
    for _, u := range s.users {
        users = append(users, u)
    }

    writeJSON(w, http.StatusOK, PaginatedResponse{
        Data:  users,
        Total: len(users),
    })
}

func (s *UserStore) createUser(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        writeJSON(w, http.StatusBadRequest,
            ErrorResponse{Code: 400, Message: "Invalid request body"})
        return
    }

    if user.Name == "" || user.Email == "" {
        writeJSON(w, http.StatusUnprocessableEntity,
            ErrorResponse{Code: 422, Message: "Name and email are required"})
        return
    }

    s.mu.Lock()
    s.seq++
    user.ID = s.seq
    user.CreatedAt = time.Now()
    s.users[user.ID] = &user
    s.mu.Unlock()

    w.Header().Set("Location", "/api/users/"+strconv.Itoa(user.ID))
    writeJSON(w, http.StatusCreated, user)
}

func (s *UserStore) getUser(w http.ResponseWriter, id int) {
    s.mu.RLock()
    defer s.mu.RUnlock()

    user, ok := s.users[id]
    if !ok {
        writeJSON(w, http.StatusNotFound,
            ErrorResponse{Code: 404, Message: "User not found"})
        return
    }
    writeJSON(w, http.StatusOK, user)
}

func (s *UserStore) updateUser(w http.ResponseWriter, r *http.Request, id int) {
    s.mu.Lock()
    defer s.mu.Unlock()

    user, ok := s.users[id]
    if !ok {
        writeJSON(w, http.StatusNotFound,
            ErrorResponse{Code: 404, Message: "User not found"})
        return
    }

    var update User
    if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
        writeJSON(w, http.StatusBadRequest,
            ErrorResponse{Code: 400, Message: "Invalid request body"})
        return
    }

    if update.Name != "" {
        user.Name = update.Name
    }
    if update.Email != "" {
        user.Email = update.Email
    }

    writeJSON(w, http.StatusOK, user)
}

func (s *UserStore) deleteUser(w http.ResponseWriter, id int) {
    s.mu.Lock()
    defer s.mu.Unlock()

    if _, ok := s.users[id]; !ok {
        writeJSON(w, http.StatusNotFound,
            ErrorResponse{Code: 404, Message: "User not found"})
        return
    }
    delete(s.users, id)
    w.WriteHeader(http.StatusNoContent)
}

// === Helpers ===
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}

// === Main ===
func main() {
    store := NewUserStore()

    mux := http.NewServeMux()
    mux.HandleFunc("/api/users", store.handleUsers)
    mux.HandleFunc("/api/users/", store.handleUser)

    // Apply middleware chain
    handler := Chain(mux,
        RecoveryMiddleware,
        LoggingMiddleware,
        CORSMiddleware,
    )

    server := &http.Server{
        Addr:         ":8080",
        Handler:      handler,
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    log.Println("REST API server on :8080")
    log.Fatal(server.ListenAndServe())
}
```

---

## 11. Network Security

### Q: Các loại DDoS attack phổ biến và cách phòng chống? 🟡 🟡 [Mid]

**A:**

**Các loại DDoS:**

| Type          | Layer | Cơ chế                         | Ví dụ                                |
| ------------- | ----- | ------------------------------ | ------------------------------------ |
| Volumetric    | L3/L4 | Flood bandwidth                | UDP flood, ICMP flood                |
| Protocol      | L4    | Exploit protocol weakness      | SYN flood, Ping of Death             |
| Application   | L7    | Exhaust server resources       | HTTP flood, Slowloris                |
| Amplification | L3/L4 | Nhân bội traffic qua reflector | DNS amplification, NTP amplification |

**SYN Flood Attack:**

```
Attacker gửi hàng triệu SYN packets với spoofed source IP
→ Server tạo hàng triệu half-open connections (SYN_RCVD)
→ Server hết memory cho SYN queue → từ chối connections hợp lệ
```

**Mitigation:**

- **SYN Cookies**: Server không lưu state cho SYN. Encode info vào ISN, verify khi nhận ACK.
- **Rate limiting**: Giới hạn requests/second từ mỗi IP
- **CDN / WAF**: Cloudflare, AWS Shield, Akamai
- **Anycast**: Phân tán traffic đến nhiều data centers
- **Over-provisioning**: Đủ bandwidth/servers để absorb attack

---

### Q: Rate Limiting algorithms? Implement trong Go? 🔴 🔴 [Senior]

**A:**

**1. Token Bucket:**

- Bucket chứa tokens, mỗi request lấy 1 token
- Tokens được thêm vào bucket theo rate cố định
- Nếu bucket rỗng → reject request
- Cho phép burst (dùng tokens tích lũy)

**2. Leaky Bucket:**

- Requests vào bucket, xử lý ra với rate cố định
- Nếu bucket đầy → reject
- Smooths out bursty traffic

**3. Fixed Window Counter:**

- Đếm requests trong mỗi time window (VD: 100 req/phút)
- Reset counter mỗi window
- Nhược: Spike ở boundary (200 req nếu 100 cuối window + 100 đầu window)

**4. Sliding Window Log:**

- Lưu timestamp mỗi request
- Đếm requests trong sliding window
- Chính xác nhưng tốn memory

**5. Sliding Window Counter:**

- Kết hợp fixed window + trọng số
- `count = prev_window_count * overlap% + current_count`
- Cân bằng giữa accuracy và memory

**Go Implementation với golang.org/x/time/rate:**

```go
package main

import (
    "encoding/json"
    "log"
    "net"
    "net/http"
    "sync"
    "time"

    "golang.org/x/time/rate"
)

// Per-client rate limiter
type RateLimiter struct {
    mu       sync.Mutex
    clients  map[string]*rate.Limiter
    rate     rate.Limit
    burst    int
    cleanup  time.Duration
}

func NewRateLimiter(r rate.Limit, burst int) *RateLimiter {
    rl := &RateLimiter{
        clients: make(map[string]*rate.Limiter),
        rate:    r,
        burst:   burst,
        cleanup: 3 * time.Minute,
    }
    go rl.cleanupLoop()
    return rl
}

func (rl *RateLimiter) GetLimiter(ip string) *rate.Limiter {
    rl.mu.Lock()
    defer rl.mu.Unlock()

    limiter, exists := rl.clients[ip]
    if !exists {
        limiter = rate.NewLimiter(rl.rate, rl.burst)
        rl.clients[ip] = limiter
    }
    return limiter
}

// Dọn dẹp clients cũ tránh memory leak
func (rl *RateLimiter) cleanupLoop() {
    ticker := time.NewTicker(rl.cleanup)
    for range ticker.C {
        rl.mu.Lock()
        // Trong production, cần track last-seen time
        // Ở đây đơn giản hóa: xóa toàn bộ (limiter sẽ tạo lại)
        rl.clients = make(map[string]*rate.Limiter)
        rl.mu.Unlock()
    }
}

// Middleware
func RateLimitMiddleware(rl *RateLimiter) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            ip, _, _ := net.SplitHostPort(r.RemoteAddr)

            limiter := rl.GetLimiter(ip)
            if !limiter.Allow() {
                w.Header().Set("Retry-After", "1")
                w.Header().Set("X-RateLimit-Limit", "10")
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusTooManyRequests)
                json.NewEncoder(w).Encode(map[string]string{
                    "error": "Rate limit exceeded. Try again later.",
                })
                return
            }

            next.ServeHTTP(w, r)
        })
    }
}

func main() {
    // 10 requests/second, burst of 20
    limiter := NewRateLimiter(10, 20)

    mux := http.NewServeMux()
    mux.HandleFunc("/api/data", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(map[string]string{
            "message": "Hello! You are within rate limit.",
        })
    })

    handler := RateLimitMiddleware(limiter)(mux)

    log.Println("Server with rate limiting on :8080")
    log.Fatal(http.ListenAndServe(":8080", handler))
}
```

**Custom Token Bucket từ đầu (không dùng library):**

```go
package main

import (
    "sync"
    "time"
)

type TokenBucket struct {
    mu         sync.Mutex
    tokens     float64
    maxTokens  float64
    refillRate float64 // tokens per second
    lastRefill time.Time
}

func NewTokenBucket(maxTokens, refillRate float64) *TokenBucket {
    return &TokenBucket{
        tokens:     maxTokens,
        maxTokens:  maxTokens,
        refillRate: refillRate,
        lastRefill: time.Now(),
    }
}

func (tb *TokenBucket) Allow() bool {
    tb.mu.Lock()
    defer tb.mu.Unlock()

    now := time.Now()
    elapsed := now.Sub(tb.lastRefill).Seconds()
    tb.tokens += elapsed * tb.refillRate
    if tb.tokens > tb.maxTokens {
        tb.tokens = tb.maxTokens
    }
    tb.lastRefill = now

    if tb.tokens >= 1 {
        tb.tokens--
        return true
    }
    return false
}
```

---

## 12. CDN

### Q: CDN hoạt động như thế nào? 🟡 🟡 [Mid]

**A:**

**CDN (Content Delivery Network)**: Mạng lưới edge servers phân tán toàn cầu, cache nội dung gần user.

```
                              ┌──────────────┐
                              │ Origin Server│
                              │ (Singapore)  │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                 │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌──────▼─────┐
              │ Edge Node │   │ Edge Node │   │ Edge Node  │
              │ (Vietnam) │   │ (Japan)   │   │ (US West)  │
              └─────┬─────┘   └─────┬─────┘   └──────┬─────┘
                    │               │                 │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌──────▼─────┐
              │ VN Users  │   │ JP Users  │   │  US Users  │
              └───────────┘   └───────────┘   └────────────┘
```

**Flow:**

1. User (Vietnam) request `https://cdn.example.com/image.jpg`
2. DNS resolve → CDN edge server gần nhất (Vietnam edge)
3. **Cache HIT**: Edge có file → trả về ngay (latency thấp)
4. **Cache MISS**: Edge không có → fetch từ origin server → cache → trả về user

**CDN Strategies:**

| Strategy     | Pull                                       | Push                                  |
| ------------ | ------------------------------------------ | ------------------------------------- |
| Cơ chế       | Edge fetch từ origin khi có request (lazy) | Origin push content lên edge trước    |
| Cache Miss   | Có (first request chậm)                    | Không (content đã có sẵn)             |
| Khi nào dùng | Content phổ biến, accessed frequently      | Content quan trọng cần available ngay |
| Ví dụ        | Images, CSS, JS                            | Video release, software update        |

**Cache Invalidation:**

- **TTL-based**: Set Cache-Control headers, tự expire
- **Purge**: Chủ động invalidate specific URLs
- **Versioning**: Thêm hash vào filename (`style.abc123.css`)
- **Tag-based**: Purge theo tag/group

**Khi nào dùng CDN:**

- Static assets (images, CSS, JS, fonts)
- Video streaming
- API responses có thể cache (public data)
- Software downloads, game patches
- Bảo vệ origin server khỏi DDoS

> **💡 Interview Tip**: CDN thường xuất hiện trong system design. Grab dùng CDN cho driver/rider app assets. Zalo dùng CDN cho media delivery.

---

## 13. Cheat Sheet & Interview Tips

### Networking Cheat Sheet

**Common Ports:**

| Port  | Protocol | Service               |
| ----- | -------- | --------------------- |
| 20/21 | TCP      | FTP (data/control)    |
| 22    | TCP      | SSH                   |
| 25    | TCP      | SMTP                  |
| 53    | TCP/UDP  | DNS                   |
| 80    | TCP      | HTTP                  |
| 443   | TCP      | HTTPS                 |
| 3306  | TCP      | MySQL                 |
| 5432  | TCP      | PostgreSQL            |
| 6379  | TCP      | Redis                 |
| 8080  | TCP      | HTTP Alt (common dev) |
| 9092  | TCP      | Kafka                 |
| 27017 | TCP      | MongoDB               |
| 50051 | TCP      | gRPC (common default) |
| 2181  | TCP      | ZooKeeper             |
| 8443  | TCP      | HTTPS Alt             |

**Protocol Summary:**

| Protocol  | Layer | Transport           | Key Feature             |
| --------- | ----- | ------------------- | ----------------------- |
| HTTP/1.1  | L7    | TCP                 | Persistent connections  |
| HTTP/2    | L7    | TCP                 | Multiplexing, binary    |
| HTTP/3    | L7    | QUIC/UDP            | 0-RTT, no HOL blocking  |
| WebSocket | L7    | TCP                 | Full-duplex, persistent |
| gRPC      | L7    | HTTP/2              | Protobuf, streaming     |
| DNS       | L7    | UDP (TCP for large) | Name resolution         |
| TLS 1.3   | L6    | TCP                 | 1-RTT encryption        |
| TCP       | L4    | -                   | Reliable, ordered       |
| UDP       | L4    | -                   | Fast, unreliable        |
| IP        | L3    | -                   | Routing, addressing     |

**HTTP Status Codes Quick Reference:**

```
2xx: Success       → 200 OK, 201 Created, 204 No Content
3xx: Redirect      → 301 Permanent, 302 Found, 304 Not Modified
4xx: Client Error  → 400 Bad Request, 401 Unauthorized, 403 Forbidden,
                     404 Not Found, 409 Conflict, 429 Too Many Requests
5xx: Server Error  → 500 Internal, 502 Bad Gateway, 503 Unavailable, 504 Timeout
```

---

### Interview Tips Per Company

**🔵 Zalo (VNG):**

- Focus: TCP/UDP fundamentals, WebSocket (chat system), DNS, CDN
- Câu hỏi thường gặp: "Thiết kế hệ thống chat real-time", TIME_WAIT handling
- Biết rõ: Connection pooling, socket programming, message delivery guarantees

**🟢 Grab:**

- Focus: gRPC, Load Balancing, mTLS, HTTP/2, Rate Limiting
- Câu hỏi thường gặp: "L4 vs L7 LB", "Consistent hashing", microservices communication
- Biết rõ: Service mesh (Istio), Envoy proxy, circuit breaker patterns

**🟠 Axon:**

- Focus: gRPC (heavy user), TLS/mTLS, REST API design, WebSocket
- Câu hỏi thường gặp: gRPC streaming patterns, interceptors, protobuf schema evolution
- Biết rõ: gRPC error handling, deadline propagation, backward compatibility

**🟣 Employment Hero:**

- Focus: REST API, HTTP basics, CORS, pagination, rate limiting
- Câu hỏi thường gặp: API design best practices, HTTP methods idempotency
- Biết rõ: Middleware patterns, authentication flows, webhook design

**🔴 Microsoft:**

- Focus: OSI model, TCP internals, DNS, TLS, system design networking
- Câu hỏi thường gặp: "What happens when you type URL?", TCP state machine, congestion control
- Biết rõ: Network troubleshooting, traceroute/ping/netstat analysis

**⚫ Google:**

- Focus: TCP congestion control (BBR!), HTTP/3 QUIC, gRPC (Google created it), load balancing
- Câu hỏi thường gặp: "Design a CDN", "Design a load balancer", QUIC vs TCP
- Biết rõ: BBR congestion control, gRPC internals, Maglev (Google's LB)

---

### Common Networking Interview Questions

**🟢 Junior Level:**

1. Sự khác nhau giữa TCP và UDP?
2. 7 layers của OSI model?
3. HTTP status codes 401 vs 403?
4. GET vs POST?
5. DNS hoạt động như thế nào?
6. HTTPS khác HTTP ở đâu?

**🟡 Middle Level:** 7. TCP 3-way handshake hoạt động thế nào? 8. HTTP/2 cải tiến gì so với HTTP/1.1? 9. Giải thích CORS và preflight requests? 10. Cursor-based vs Offset-based pagination? 11. WebSocket vs SSE vs Long Polling? 12. gRPC vs REST - khi nào dùng cái nào? 13. L4 vs L7 load balancing? 14. TLS handshake process? 15. CDN hoạt động thế nào?

**🔴 Senior Level:** 16. Giải thích TCP congestion control algorithms (slow start, AIMD, BBR)? 17. TIME_WAIT state: vấn đề và giải pháp trên production? 18. HTTP/3 QUIC giải quyết vấn đề gì của TCP? 19. Thiết kế rate limiter cho distributed system? 20. mTLS: khi nào cần, cách implement? 21. Consistent hashing cho load balancing? 22. Design a CDN system? 23. TCP vs QUIC head-of-line blocking? 24. Cách handle millions of concurrent WebSocket connections? 25. gRPC deadline propagation across microservices?

---

### Quick Review Checklist

```
Before Interview:
□ Vẽ được TCP 3-way handshake & 4-way teardown
□ Giải thích được "URL in browser" flow
□ So sánh được HTTP/1.1 vs 2 vs 3
□ Hiểu TLS handshake (1.2 và 1.3)
□ Code được TCP/UDP/HTTP/WebSocket server bằng Go
□ Hiểu gRPC 4 patterns và viết được .proto file
□ Giải thích được LB algorithms (especially consistent hashing)
□ Implement được rate limiter
□ Biết DNS record types và resolution process
□ Hiểu CDN caching strategies
```

---

> **Tài liệu tham khảo:**
>
> - "Computer Networking: A Top-Down Approach" - Kurose & Ross
> - RFC 793 (TCP), RFC 9000 (QUIC), RFC 7540 (HTTP/2)
> - Go Documentation: net, net/http, crypto/tls packages
> - gRPC Official Documentation: grpc.io
> - Cloudflare Learning Center: cloudflare.com/learning

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                         | Difficulty | Core Concept    | Key Signal                                         |
| --- | -------------------------------- | ---------- | --------------- | -------------------------------------------------- |
| Q1  | 7 layers OSI Model               | 🟢         | OSI/TCP-IP      | Layer names, protocols per layer                   |
| Q2  | OSI vs TCP/IP comparison         | 🟢         | OSI/TCP-IP      | 7 vs 4 layers, practical TCP/IP                    |
| Q3  | URL→browser full journey         | 🟡         | OSI/TCP-IP      | DNS→TCP→TLS→HTTP→render                            |
| Q4  | TCP 3-Way Handshake              | 🟢         | TCP             | SYN→SYN-ACK→ACK, sequence numbers                  |
| Q5  | TCP 4-Way Teardown               | 🟢         | TCP             | FIN→ACK→FIN→ACK, graceful close                    |
| Q6  | TCP states quan trọng            | 🟡         | TCP             | ESTABLISHED, TIME_WAIT, CLOSE_WAIT                 |
| Q7  | TIME_WAIT + 2×MSL                | 🔴         | TCP             | Prevent delayed packet confusion, port exhaustion  |
| Q8  | Flow Control                     | 🟡         | TCP             | Receiver window, sliding window                    |
| Q9  | Congestion Control               | 🔴         | TCP             | Slow start, cwnd, fast recovery                    |
| Q10 | TCP Keepalive                    | 🟡         | TCP             | Dead connection detection, Go SetKeepAlive         |
| Q11 | Go TCP server/client             | 🟡         | TCP             | net.Listen, net.Dial, goroutine-per-conn           |
| Q12 | UDP characteristics              | 🟢         | UDP             | Connectionless, no guarantee, low latency          |
| Q13 | TCP vs UDP comparison            | 🟢         | UDP             | Reliable vs fast, use cases                        |
| Q14 | Go UDP server/client             | 🟡         | UDP             | net.ListenPacket, ReadFrom/WriteTo                 |
| Q15 | HTTP/1.1 vs 2 vs 3 differences   | 🟡         | HTTP Evolution  | HOL blocking, multiplexing, QUIC                   |
| Q16 | HTTP comparison table            | 🟡         | HTTP Evolution  | Binary framing, 0-RTT, connection migration        |
| Q17 | Go HTTP/2 server                 | 🟡         | HTTP Evolution  | crypto/tls, h2 ALPN                                |
| Q18 | TLS 1.2 full handshake           | 🟡         | TLS/HTTPS       | 2-RTT, cipher suite negotiation                    |
| Q19 | TLS 1.3 improvements             | 🟡         | TLS/HTTPS       | 1-RTT, 0-RTT, removed RSA exchange                 |
| Q20 | Certificate chain + pinning      | 🟡         | TLS/HTTPS       | Root CA→intermediate→leaf, trust chain             |
| Q21 | mTLS when to use                 | 🔴         | TLS/HTTPS       | Service mesh, zero-trust, mutual cert verification |
| Q22 | DNS resolution process           | 🟢         | DNS & WebSocket | Cache→recursive→root→TLD→authoritative             |
| Q23 | DNS record types                 | 🟢         | DNS & WebSocket | A, AAAA, CNAME, MX, TXT, NS                        |
| Q24 | Go DNS lookup                    | 🟡         | DNS & WebSocket | net.LookupHost, custom Resolver                    |
| Q25 | WebSocket how it works           | 🟡         | DNS & WebSocket | HTTP upgrade, persistent TCP, frames               |
| Q26 | WebSocket vs SSE vs Long Polling | 🟡         | DNS & WebSocket | Full-duplex vs server-push vs polling              |
| Q27 | Go WebSocket server              | 🟡         | DNS & WebSocket | gorilla/websocket, upgrade, read/write pump        |
| Q28 | gRPC + HTTP/2                    | 🟡         | gRPC & LB       | Protobuf, binary, multiplexing                     |
| Q29 | 4 gRPC patterns                  | 🟡         | gRPC & LB       | Unary, server/client/bidi streaming                |
| Q30 | Go gRPC server + client          | 🔴         | gRPC & LB       | protoc codegen, grpc.NewServer                     |
| Q31 | gRPC vs REST comparison          | 🟡         | gRPC & LB       | Binary vs text, streaming vs request-response      |
| Q32 | L4 vs L7 Load Balancing          | 🟡         | gRPC & LB       | TCP vs HTTP layer, routing granularity             |
| Q33 | LB algorithms                    | 🟡         | gRPC & LB       | Round robin, least connections, consistent hash    |
| Q34 | Go reverse proxy / LB            | 🔴         | gRPC & LB       | httputil.ReverseProxy, custom director             |
| Q35 | REST principles                  | 🟢         | REST & Security | Resources, HTTP methods, stateless                 |
| Q36 | HTTP methods + status codes      | 🟢         | REST & Security | GET/POST/PUT/DELETE, 2xx/4xx/5xx                   |
| Q37 | Pagination strategies            | 🟡         | REST & Security | Offset, cursor, keyset                             |
| Q38 | CORS + preflight                 | 🟡         | REST & Security | OPTIONS request, Access-Control headers            |
| Q39 | Go RESTful API + middleware      | 🟡         | REST & Security | Handler chain, middleware pattern                  |
| Q40 | DDoS attack types                | 🟡         | REST & Security | SYN flood, HTTP flood, amplification               |
| Q41 | Rate limiting algorithms + Go    | 🔴         | REST & Security | Token bucket, sliding window, Redis                |
| Q42 | CDN how it works                 | 🟡         | REST & Security | Edge caching, origin shield, TTL                   |

**Distribution:** 🟢 10 (24%) | 🟡 26 (62%) | 🔴 6 (14%) — Total: 42 Q&As

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

**Interviewer:** "Your Go microservice is making HTTP calls to another service and you see increasing latency over time. `netstat` shows thousands of connections in TIME_WAIT. What's happening and how do you fix it?"

**30-second answer:**

> TIME_WAIT occurs after a TCP connection closes — the side that initiates the close holds the port for 2×MSL (~60s) to prevent delayed packets from being misinterpreted by a new connection on the same port. With high request volume and default `http.Client` (no connection pooling config), each request opens and closes a connection, exhausting local ports. Fix: configure `http.Transport` with `MaxIdleConnsPerHost` (default 2, raise to 100+), `IdleConnTimeout`, and ensure response body is fully read and closed (`io.Copy(io.Discard, resp.Body)` + `resp.Body.Close()`). Also consider HTTP/2 which multiplexes over a single connection.

**Follow-up:** "How is gRPC load balancing different from HTTP load balancing?"

> gRPC maintains long-lived HTTP/2 connections. A L4 load balancer sees one TCP connection and sends all traffic to the same backend — no distribution. Need either L7 LB that understands HTTP/2 frames (like Envoy/Istio), or client-side load balancing where the client resolves multiple backends and distributes streams (using `grpc.WithDefaultServiceConfig` with `round_robin` policy + a custom resolver).

---

## Self-Check / Tự Kiểm Tra

> **Retrieval Practice / Thực Hành Truy Xuất:** Đóng tài liệu, trả lời từ trí nhớ trước khi kiểm tra đáp án.

| #   | Question                                                                   | Key Points                                                                                                                                                                |
| --- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Vẽ TCP 3-way handshake + 4-way teardown. Tại sao cần TIME_WAIT?            | SYN→SYN-ACK→ACK. FIN→ACK→FIN→ACK. TIME_WAIT 2×MSL prevents delayed packet confusion, 60s hold                                                                             |
| 2   | So sánh HTTP/1.1 vs HTTP/2 vs HTTP/3. HOL blocking ở đâu?                  | 1.1: application HOL. 2: TCP HOL (single connection). 3/QUIC: no HOL (independent UDP streams). 2 has multiplexing + HPACK                                                |
| 3   | TLS 1.3 handshake nhanh hơn 1.2 thế nào? 0-RTT trade-off?                  | 1.3: 1-RTT (combine key exchange+hello). 0-RTT: send data immediately but vulnerable to replay attacks                                                                    |
| 4   | Go http.Transport cần config gì cho high-traffic service?                  | MaxIdleConnsPerHost (100+), IdleConnTimeout, TLSHandshakeTimeout, ResponseHeaderTimeout. Always drain+close response body                                                 |
| 5   | gRPC 4 patterns? Khi nào dùng streaming?                                   | Unary (request-response), Server Streaming (server pushes list), Client Streaming (client uploads), Bidi (chat). Streaming for large data or real-time                    |
| 6   | L4 vs L7 LB trade-offs? Tại sao gRPC cần L7?                               | L4: fast, no HTTP parsing, TCP level. L7: path/header routing, SSL termination, HTTP aware. gRPC: long-lived HTTP/2 connection → L4 sees 1 conn → no distribution         |
| 7   | Rate limiting: token bucket vs sliding window? Distributed implementation? | Token bucket: burst-friendly, refill tokens/sec. Sliding window: precise per-second. Distributed: Redis INCR + EXPIRE, or Redis Lua script for atomic check-and-increment |

### 📅 Spaced Repetition Schedule / Lịch Ôn Tập

| Round | When          | Focus                                                                |
| ----- | ------------- | -------------------------------------------------------------------- |
| 1     | Day 1 (Today) | Read all Memory Hooks + draw TCP state diagram from memory           |
| 2     | Day 3         | Self-Check questions 1-4 without notes                               |
| 3     | Day 7         | Cold Call simulation + explain HTTP/2 multiplexing to rubber duck    |
| 4     | Day 14        | Full Self-Check + write Go HTTP/2 + gRPC server from scratch         |
| 5     | Day 30        | Mock interview: TIME_WAIT debugging + gRPC LB design + rate limiting |

---

## Connections / Liên Kết

### Same Track / Cùng Track

- ⬅️ **Built on**: [OS for Go](./05-os-go.md) — networking I/O builds on OS socket model, epoll/kqueue, netpoller
- ➡️ **Enables**: [gRPC & Protobuf](./09-grpc-protobuf.md) — gRPC runs on HTTP/2, deep-dive into protobuf serialization
- ➡️ **Enables**: [Resilience Patterns](./07-resilience-patterns.md) — circuit breaker, timeout, retry patterns for network failures
- 🔗 **Related**: [API Design](./01-api-design.md) — REST API design principles, versioning, pagination
- 🔗 **Related**: [Auth & Security](./04-auth-security.md) — TLS/mTLS, CORS, OWASP overlap

### Cross Track / Khác Track

- 🔗 **[System Design](../04-be-system-design/01-design-framework.md)** — CDN, load balancing, and networking decisions in architecture
- 🔗 **[Distributed Systems](./03-distributed-systems.md)** — consensus protocols run on TCP, message queues on network layer
- 🔗 **[CS Networking Theory](../../shared/01-cs-fundamentals/networking-theory.md)** — deeper protocol theory, routing algorithms
