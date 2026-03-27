# Networking Theory / Lý Thuyết Mạng Máy Tính

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [OS Theory](./os-theory.md)
> **See also**: [OS Theory](./os-theory.md) | [FE Networking](../../fe-track/10-networking/) | [BE Networking](../../be-track/02-backend-knowledge/06-networking-go.md)

---

## Real-World Scenario / Tình Huống Thực Tế

User ở Hà Nội gõ `https://google.com` và nhấn Enter. Trong vòng 200ms:

1. DNS lookup → IP address `142.250.x.x`
2. TCP 3-way handshake → connection established
3. TLS 1.3 handshake → encrypted channel (1 RTT)
4. HTTP/2 request → multiplexed response
5. Browser nhận HTML, render trang

Hiểu networking = hiểu tại sao app chậm (DNS lookup? TCP latency? TLS overhead?), tại sao CORS error xảy ra, và tại sao HTTPS bảo vệ users.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Gửi thư quốc tế:**

- **IP** = địa chỉ nhà — xác định nơi đến
- **TCP** = dịch vụ bưu chính có xác nhận — đảm bảo thư đến đủ, đúng thứ tự
- **UDP** = thả thư vào thùng — nhanh hơn, không đảm bảo
- **HTTP** = ngôn ngữ trong thư — request/response format
- **DNS** = danh bạ điện thoại — chuyển tên miền thành IP
- **HTTPS/TLS** = phong bì bịt kín — chỉ người nhận đọc được

| Concept            | Frontend Impact                       |
| ------------------ | ------------------------------------- |
| HTTP/1.1 vs HTTP/2 | Bundle strategies, request waterfalls |
| DNS lookup         | Preconnect hints, DNS prefetch        |
| TLS handshake      | HSTS, certificate pinning             |
| CORS               | Every API call từ browser             |
| WebSocket          | Real-time (chat, notifications)       |

---

## Concept Map / Bản Đồ Khái Niệm

```
         [NETWORKING THEORY]
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
  [Protocols]  [Transport]  [Application]
  OSI model    TCP vs UDP    HTTP/1.1/2/3
  IP routing   3-way shake   REST/GraphQL
  DNS          TLS/SSL       WebSocket/SSE
  ARP/ICMP     Flow control  CORS/CSP
         │
         ▼
  [Performance]
  Latency | Bandwidth | RTT | CDN | Caching headers
         │
         ▼
  [Applied: Security]
  HTTPS | Certificate chain | HSTS | TLS 1.3
```

---

## Overview / Tổng Quan

| #   | Concept                        | Vai trò                                                 | Interview Weight |
| --- | ------------------------------ | ------------------------------------------------------- | ---------------- |
| 1   | OSI & TCP/IP Models            | Framework phân tầng — hiểu mỗi layer xử lý gì           | ⭐⭐⭐           |
| 2   | TCP vs UDP                     | Transport layer tradeoff — reliability vs speed         | ⭐⭐⭐⭐         |
| 3   | HTTP Evolution (1.1→2→3)       | Application protocol — multiplexing, QUIC, HOL blocking | ⭐⭐⭐⭐⭐       |
| 4   | TLS/HTTPS                      | Security layer — handshake, certificates, encryption    | ⭐⭐⭐⭐         |
| 5   | DNS System                     | Name resolution — hierarchy, caching, TTL               | ⭐⭐⭐⭐         |
| 6   | IP Addressing & Routing        | Network layer — subnetting, CIDR, BGP                   | ⭐⭐⭐           |
| 7   | Network Performance & Security | Latency, QoS, firewalls, attacks                        | ⭐⭐⭐           |

**Mối quan hệ:** OSI model là khung lý thuyết → TCP/UDP là transport thực tế → HTTP chạy trên TCP (hoặc QUIC/UDP) → TLS mã hóa channel → DNS resolve tên trước khi bắt đầu → IP routing vận chuyển packets → Performance/Security xuyên suốt mọi layer.

---

## Core Concepts — Phase 2 Deep Dive / Khái Niệm Cốt Lõi — Đào Sâu

### Concept 1: OSI & TCP/IP Models

🧠 **Memory Hook:** "**Please Do Not Throw Sausage Pizza Away**" = Physical → Data Link → Network → Transport → Session → Presentation → Application. Nhưng thực tế chỉ cần nhớ TCP/IP 4 layers.

❓ **Why exists (Tại sao tồn tại):**

- Level 1: Để chia nhỏ networking thành layers độc lập — mỗi layer lo một việc, thay đổi layer này không ảnh hưởng layer khác.
- Level 2: Interoperability — mọi vendor implement cùng spec cho mỗi layer → devices từ Cisco, Juniper, Linux đều communicate được vì tuân theo cùng protocol stack.
- Level 3: Abstraction cho phát triển — application developer không cần biết TCP retransmit, network engineer không cần biết HTTP headers.

🔵 **Layer 1 — Analogy / Liên tưởng:**
OSI như hệ thống bưu điện quốc tế. Physical = đường vận chuyển (xe, máy bay). Data Link = nhãn trên kiện hàng (MAC). Network = địa chỉ nhà (IP). Transport = dịch vụ bảo đảm hoặc thường (TCP/UDP). Session-Presentation-Application = nội dung và ngôn ngữ trong thư.

🟡 **Layer 2 — Mechanics / Cơ chế:**

```
TCP/IP thực tế (4 layers) vs OSI (7 layers):

Application (L7) ─┐
Presentation (L6) ─┤─── Application Layer (TCP/IP)
Session (L5)      ─┘
Transport (L4)    ─────  Transport Layer
Network (L3)      ─────  Internet Layer
Data Link (L2)    ─┐
Physical (L1)     ─┘───  Network Access Layer

Encapsulation process:
[Data] → [TCP Header + Data] → [IP Header + Segment] → [Frame Header + Packet + Frame Trailer] → Bits
```

Mỗi layer thêm header riêng khi gửi (encapsulation) và bóc header khi nhận (decapsulation). MTU (Maximum Transmission Unit) = 1500 bytes cho Ethernet — nếu packet lớn hơn thì phải fragment.

🔴 **Layer 3 — Edge Cases / Cạnh:**

- OSI model là **lý thuyết**, TCP/IP mới là thực tế — Session và Presentation layer gần như không tồn tại riêng biệt trong implementation.
- **MTU mismatch**: nếu path có link với MTU nhỏ hơn → fragmentation → performance drop. Path MTU Discovery (PMTUD) giải quyết nhưng bị block bởi firewalls chặn ICMP.
- **Layer violation**: NAT (Network Address Translation) sửa cả L3 (IP) và L4 (port) headers → phá vỡ end-to-end principle, gây khó cho IPSec, FTP active mode.

| Sai lầm                                | Tại sao sai                               | Đúng là                                                       |
| -------------------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Học thuộc 7 layer OSI chi tiết         | Thực tế chỉ dùng TCP/IP 4 layers          | Focus TCP/IP model, dùng OSI cho reference                    |
| Nghĩ mỗi packet đi qua tất cả 7 layers | Switch chỉ xử lý L2, router chỉ xử lý L3  | Mỗi device xử lý đến layer tương ứng                          |
| Quên encapsulation overhead            | Mỗi layer thêm header → giảm payload thực | IP header 20B + TCP header 20B = 40B overhead trên mỗi packet |

🎯 **Interview Pattern:** "Explain the OSI model" → Nói ngắn 7 layers, sau đó PIVOT sang TCP/IP 4 layers thực tế + encapsulation process + ví dụ concrete: "Khi browser gửi HTTP request, data đi qua Application → TCP segment → IP packet → Ethernet frame → bits."

🔗 **Knowledge Chain:** OSI layers → [TCP/UDP transport] → [IP routing] → [HTTP application] → [TLS security]

---

### Concept 2: TCP vs UDP

🧠 **Memory Hook:** "**TCP = Registered Mail**" (xác nhận, đảm bảo, chậm hơn). "**UDP = Postcard**" (gửi và quên, nhanh, không guarantee).

❓ **Why exists (Tại sao tồn tại):**

- Level 1: Hai nhu cầu khác nhau — reliable delivery (web, file, email) vs low-latency delivery (video, gaming, DNS).
- Level 2: TCP overhead (handshake, ACK, retransmit, flow control) tốn ~40-100ms extra latency. Với video call, 100ms delay tệ hơn mất 1 frame → UDP phù hợp hơn.
- Level 3: Modern protocols blur the line — QUIC (HTTP/3) chạy trên UDP nhưng implement reliability per-stream, lấy best of both worlds.

🔵 **Layer 1 — Analogy:**
TCP như gọi điện thoại: phải dial → đợi answer → nói chuyện → hang up. Biết chắc đối phương nghe được. UDP như hét qua cửa sổ: nhanh, không cần setup, nhưng không biết họ có nghe không.

🟡 **Layer 2 — Mechanics:**

```
TCP Connection Lifecycle:
┌──────────────────────────────────────┐
│ CLOSED → SYN_SENT → ESTABLISHED     │  ← 3-way handshake
│                  ↓                   │
│ ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2│  ← Active close
│            → TIME_WAIT → CLOSED      │  ← Wait 2×MSL (120s)
└──────────────────────────────────────┘

TCP Features:
- Seq/Ack numbers → ordered delivery
- Window size → flow control (receiver controls rate)
- Congestion window → congestion control (slow start, AIMD)
- Checksum → error detection
- Retransmission → reliability (timeout + fast retransmit)

UDP Header (8 bytes only):
┌─────────────┬─────────────┐
│ Src Port    │ Dst Port    │  4 bytes
├─────────────┼─────────────┤
│ Length      │ Checksum    │  4 bytes
└─────────────┴─────────────┘
No seq numbers, no ACK, no flow control.
```

🔴 **Layer 3 — Edge Cases:**

- **TCP TIME_WAIT exhaustion**: Server handling 10K short connections/sec → 10K×120s = 1.2M sockets in TIME_WAIT → port exhaustion. Fix: `SO_REUSEADDR`, connection pooling, HTTP keep-alive.
- **TCP head-of-line blocking**: Single lost packet blocks entire byte stream → all HTTP/2 streams stall. Motivation for QUIC.
- **UDP reliability layer**: Games implement their own ACK on top of UDP for critical messages (player position) while dropping non-critical (old frames).

| Sai lầm                        | Tại sao sai                                                           | Đúng là                                                               |
| ------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| "UDP không bao giờ reliable"   | QUIC chạy trên UDP nhưng có reliability per-stream                    | UDP là transport — reliability có thể implement ở application layer   |
| "TCP luôn tốt hơn cho mọi thứ" | TCP overhead (3-way handshake + HOL blocking) không phù hợp real-time | Chọn theo use case: TCP cho data integrity, UDP cho latency-sensitive |
| "TIME_WAIT là bug cần disable" | TIME_WAIT bảo vệ khỏi stale packet collision                          | Dùng connection pooling, SO_REUSEADDR thay vì tắt TIME_WAIT           |

🎯 **Interview Pattern:** "TCP vs UDP" → Bắt đầu bằng tradeoff cốt lõi (reliability vs latency), cho ví dụ cụ thể mỗi bên, rồi nâng level: "Modern protocols like QUIC blur this boundary — QUIC uses UDP as transport but implements per-stream reliability."

🔗 **Knowledge Chain:** TCP 3-way handshake → [TIME_WAIT] → [Connection pooling] → [HTTP keep-alive] → [HTTP/2 multiplexing] → [QUIC/HTTP/3]

---

### Concept 3: HTTP Evolution (1.1 → 2 → 3)

🧠 **Memory Hook:** "**1.1 = One Lane Road**" (one request at a time per connection). "**2 = Highway**" (multiple lanes, one bridge = TCP). "**3 = Teleportation**" (QUIC, no bridge bottleneck).

❓ **Why exists (Tại sao tồn tại):**

- Level 1: Web pages ngày càng phức tạp (100+ resources) → HTTP/1.1 quá chậm với sequential requests.
- Level 2: HTTP/2 fix application-level HOL nhưng TCP vẫn bị transport-level HOL → cần protocol mới không dùng TCP.
- Level 3: Mobile users (WiFi→LTE switching, high packet loss) cần connection migration + 0-RTT → QUIC designed for mobile-first world.

🔵 **Layer 1 — Analogy:**
HTTP/1.1 như quầy thanh toán 1 cashier — phải xếp hàng chờ. HTTP/2 như quầy có nhiều khe song song nhưng chung 1 cửa ra (TCP) — nếu cửa kẹt thì tất cả bị chặn. HTTP/3 như mỗi khách có cửa riêng (QUIC stream) — 1 cửa kẹt không ảnh hưởng cửa khác.

🟡 **Layer 2 — Mechanics:**

```
HTTP/1.1 → HTTP/2 → HTTP/3 Evolution:

HTTP/1.1 (1997):        HTTP/2 (2015):           HTTP/3 (2022):
┌─────────┐             ┌─────────┐               ┌─────────┐
│ Request │             │ Stream 1│               │ Stream 1│ (QUIC)
│    ↓    │             │ Stream 2│ Multiplexed   │ Stream 2│ Independent
│ Response│             │ Stream 3│ over 1 TCP    │ Stream 3│ over UDP
│    ↓    │ Sequential  └────┬────┘               └────┬────┘
│ Request │             ┌────┴────┐               ┌────┴────┐
│    ↓    │             │  TCP    │ ← HOL here    │  QUIC   │ ← No HOL
│ Response│             └─────────┘               │ (UDP)   │
└─────────┘                                       └─────────┘

Key differences:
            HTTP/1.1    HTTP/2       HTTP/3
Protocol:   Text        Binary       Binary
Mux:        No          Yes          Yes
HOL:        App+TCP     TCP only     None
Handshake:  TCP+TLS     TCP+TLS      0-1 RTT
Header:     Full repeat HPACK        QPACK
```

🔴 **Layer 3 — Edge Cases:**

- **HTTP/2 server push** được thiết kế để proactively gửi resources nhưng thực tế ít dùng vì khó predict client cache state → Chrome đã bỏ support.
- **HTTP/3 middlebox issue**: Corporate firewalls/proxies chặn UDP → fallback to HTTP/2 over TCP. Happy Eyeballs algorithm: thử HTTP/3 song song HTTP/2, dùng cái nào connect trước.
- **0-RTT replay attack**: HTTP/3 0-RTT data có thể bị replay bởi attacker → chỉ dùng cho idempotent requests (GET), không cho POST/PUT.

| Sai lầm                              | Tại sao sai                                                                       | Đúng là                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| "HTTP/2 fix HOL blocking hoàn toàn"  | HTTP/2 fix app-level HOL nhưng TCP-level HOL vẫn còn                              | TCP packet loss stalls tất cả streams — chỉ HTTP/3 fix transport-level HOL |
| "HTTP/3 nhanh hơn mọi lúc"           | Network có UDP blocking hoặc low packet loss → HTTP/2 có thể ngang hoặc nhanh hơn | HTTP/3 shine nhất trên mobile/lossy networks                               |
| "Chỉ cần upgrade lên HTTP/3 là xong" | Server, CDN, middlebox, client đều phải support                                   | Deploy cần fallback strategy (HTTP/2 backup)                               |

🎯 **Interview Pattern:** "Explain HTTP/2 vs HTTP/3" → Frame bằng HOL blocking problem, show understanding ở 3 levels (app, TCP, QUIC), rồi discuss tradeoff thực tế (middlebox, 0-RTT replay, deployment complexity).

🔗 **Knowledge Chain:** HTTP/1.1 HOL → [HTTP/2 multiplexing] → [TCP HOL remains] → [QUIC/UDP] → [HTTP/3] → [0-RTT + connection migration]

---

### Concept 4: TLS/HTTPS

🧠 **Memory Hook:** "**TLS = Secret Handshake Club**" — hai bên thỏa thuận mật mã (asymmetric), rồi nói chuyện bằng mật mã nhanh hơn (symmetric). Certificate = thẻ thành viên do CA cấp.

❓ **Why exists (Tại sao tồn tại):**

- Level 1: HTTP plaintext → ai trên cùng network đọc được password, cookie, data. HTTPS mã hóa toàn bộ.
- Level 2: Ba thuộc tính bảo mật: **Confidentiality** (mã hóa), **Integrity** (tamper detection), **Authentication** (certificate chứng minh server đúng).
- Level 3: Forward secrecy (ECDHE) — ngay cả khi private key bị lộ, past sessions vẫn an toàn vì mỗi session dùng ephemeral key riêng.

🔵 **Layer 1 — Analogy:**
HTTPS như gửi thư trong hộp khóa. Lần đầu, hai bên trao đổi khóa công khai (asymmetric) — ai cũng thấy nhưng chỉ người có private key mở được. Sau đó tạo khóa chung (symmetric) nhanh hơn nhiều để mã hóa thư tiếp theo.

🟡 **Layer 2 — Mechanics:**

```
TLS 1.3 Handshake (1-RTT):
Client                          Server
  │── ClientHello ──────────────→│  cipher suites + key_share
  │                               │
  │←── ServerHello + Certificate ─│  chosen cipher + cert + key_share
  │←── Finished ──────────────────│  (encrypted with handshake keys)
  │                               │
  │── Finished ──────────────────→│  (both derive session keys)
  │                               │
  │←──── Application Data ────→  │  AES-256-GCM encrypted

Key Exchange: ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)
- Both sides contribute random → derive shared secret
- Ephemeral = new key pair each session → forward secrecy

Certificate Chain:
Server Cert ← signed by → Intermediate CA ← signed by → Root CA
Browser trusts Root CAs (pre-installed) → chain of trust
```

🔴 **Layer 3 — Edge Cases:**

- **Certificate pinning** bypass: Nếu CA bị compromise (DigiNotrust 2011) → fake cert được issue. HPKP (HTTP Public Key Pinning) giải quyết nhưng rủi ro bricking nếu pin sai → deprecated, thay bằng Certificate Transparency logs.
- **TLS termination at load balancer**: HTTPS đến LB, plaintext từ LB đến backend → attacker trên internal network đọc được. Fix: mTLS (mutual TLS) giữa LB và backends.
- **SNI (Server Name Indication)** leak: Hostname gửi plaintext trong ClientHello → ISP thấy bạn truy cập domain nào dù content encrypted. Fix: Encrypted Client Hello (ECH) trong TLS 1.3.

| Sai lầm                        | Tại sao sai                                                               | Đúng là                                     |
| ------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------- |
| "HTTPS = chậm"                 | TLS 1.3 chỉ tốn 1 RTT, 0-RTT cho reconnection                             | Performance overhead minimal với modern TLS |
| "Có HTTPS = an toàn hoàn toàn" | HTTPS chỉ bảo vệ transport — server code vẫn có thể bị SQL injection, XSS | HTTPS là necessary nhưng not sufficient     |
| "Self-signed cert cũng được"   | Browser không trust → users click through warning → train bad habit       | Dùng Let's Encrypt (free) cho valid cert    |

🎯 **Interview Pattern:** "Explain TLS handshake" → Bắt đầu bằng WHY (3 properties: CIA), rồi HOW (asymmetric for key exchange → symmetric for data), cuối cùng detail TLS 1.3 improvements (1-RTT, forward secrecy, 0-RTT).

🔗 **Knowledge Chain:** PKI + Certificate chain → [TLS handshake] → [HTTPS] → [mTLS for service-to-service] → [Certificate Transparency]

---

### Concept 5: DNS System

🧠 **Memory Hook:** "**DNS = Phone Book of the Internet**" — bạn nhớ tên (google.com), DNS trả về số điện thoại (IP). Hierarchical: Root → TLD → Authoritative = Country code → Area code → Number.

❓ **Why exists (Tại sao tồn tại):**

- Level 1: Humans nhớ tên (google.com), computers cần số (142.250.x.x). DNS bridge the gap.
- Level 2: Distributed + hierarchical để scale — nếu centralized thì single point of failure cho toàn bộ internet. 13 root servers, anycast routing.
- Level 3: DNS không chỉ resolve tên → còn là infrastructure tool: load balancing (multiple A records), failover (health-checked records), email routing (MX), service discovery (SRV records).

🔵 **Layer 1 — Analogy:**
DNS như hệ thống bưu điện. Bạn gửi thư đến "Google, Mountain View" → Bưu điện local không biết → hỏi bưu điện quốc gia → hỏi bưu điện vùng → tìm được địa chỉ chính xác. Kết quả được cache lại để lần sau không cần hỏi lại.

🟡 **Layer 2 — Mechanics:**

```
DNS Resolution Flow:
Browser Cache → OS Cache → Resolver Cache → Authoritative

┌──────────┐    ┌──────────┐    ┌────────────┐
│ Browser  │───→│ Resolver │───→│ Root (.  ) │
│ Cache    │    │ (8.8.8.8)│    └────────────┘
└──────────┘    │          │           │
     miss       │          │←── ".com NS: a.gtld-servers.net"
                │          │    ┌────────────┐
                │          │───→│ TLD (.com) │
                │          │    └────────────┘
                │          │           │
                │          │←── "google.com NS: ns1.google.com"
                │          │    ┌────────────────┐
                │          │───→│ Authoritative  │
                │          │    │ (ns1.google.com)│
                │          │    └────────────────┘
                │          │←── "A: 142.250.190.14, TTL: 300"
                └──────────┘

Record Types: A (IPv4), AAAA (IPv6), CNAME (alias),
MX (mail), NS (nameserver), TXT (verification), SOA (authority)
```

🔴 **Layer 3 — Edge Cases:**

- **DNS propagation delay**: Thay đổi DNS record → phải đợi TTL expire trên tất cả resolvers. Production: giảm TTL xuống 60s vài giờ trước migration, migrate, rồi tăng TTL lại.
- **DNS cache poisoning**: Attacker inject fake record vào resolver cache → redirect users đến malicious server. DNSSEC adds digital signatures nhưng adoption chỉ ~30%.
- **DNS over HTTPS (DoH)** vs DNS over TLS (DoT): DoH giấu DNS queries trong HTTPS traffic (port 443) → ISP không thể filter/log. Controversy: bypass corporate DNS policies, giảm visibility cho network admins.

| Sai lầm                        | Tại sao sai                                                              | Đúng là                                                |
| ------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| "DNS instant sau khi thay đổi" | TTL cache ở mọi level → propagation takes TTL duration                   | Giảm TTL trước, thay đổi, đợi old TTL expire           |
| "DNS chỉ để resolve tên → IP"  | DNS còn dùng cho email (MX), service discovery (SRV), verification (TXT) | DNS là distributed key-value store cho nhiều use cases |
| "CNAME và A record giống nhau" | CNAME là alias trỏ đến tên khác, A trỏ trực tiếp đến IP                  | CNAME cần thêm 1 lookup, không dùng được ở zone apex   |

🎯 **Interview Pattern:** "How does DNS work?" → Walk through hierarchy (Root → TLD → Authoritative), nhấn mạnh caching ở mỗi level + TTL, rồi show operational knowledge: "Khi migrate, tôi giảm TTL trước để failover nhanh hơn."

🔗 **Knowledge Chain:** DNS hierarchy → [TTL + caching] → [DNSSEC] → [DNS-based load balancing] → [CDN routing]

---

### Concept 6: IP Addressing & Routing

🧠 **Memory Hook:** "**IP = Street Address**" (xác định vị trí), "**Subnet = Neighborhood**" (nhóm địa chỉ cùng network), "**Router = Post Office**" (quyết định gửi packet đi đâu).

❓ **Why exists (Tại sao tồn tại):**

- Level 1: Mỗi device cần unique identifier trên network — IP address. Routing quyết định path từ source đến destination.
- Level 2: Subnetting chia network lớn thành nhỏ → giảm broadcast domain, tăng security, quản lý dễ hơn. CIDR thay thế classful addressing → sử dụng IP hiệu quả hơn.
- Level 3: BGP (Border Gateway Protocol) là "glue" của internet — autonomous systems exchange routing info. BGP misconfiguration/hijacking có thể redirect traffic toàn internet (Pakistan YouTube incident 2008).

🔵 **Layer 1 — Analogy:**
IPv4 subnetting như chia khu dân cư. Thành phố (network 192.168.0.0/16) chia thành quận (/24), mỗi quận có 254 nhà (hosts). Subnet mask = ranh giới quận. Router = ngã tư giao thông, quyết định packet đi quận nào.

🟡 **Layer 2 — Mechanics:**

```
Subnetting Example:
192.168.1.0/24 → cần 4 subnets → borrow 2 bits → /26

Network: 192.168.1.0   /26 = 255.255.255.192
Subnet 1: 192.168.1.0   - 192.168.1.63   (62 hosts)
Subnet 2: 192.168.1.64  - 192.168.1.127  (62 hosts)
Subnet 3: 192.168.1.128 - 192.168.1.191  (62 hosts)
Subnet 4: 192.168.1.192 - 192.168.1.255  (62 hosts)

Routing Decision:
Packet arrives → Router checks destination IP
→ Longest prefix match in routing table
→ Forward to next hop or direct delivery

BGP: Path vector protocol giữa Autonomous Systems
ISP A ←→ BGP ←→ ISP B ←→ BGP ←→ ISP C
       routing tables share reachable prefixes
```

🔴 **Layer 3 — Edge Cases:**

- **IPv4 exhaustion**: 4.3 billion addresses đã hết → NAT + private IP workaround, IPv6 (340 undecillion) là long-term solution nhưng adoption chậm.
- **BGP hijacking**: AS announce prefix không thuộc sở hữu → traffic bị redirect. Cloudflare incident 2019 — BGP leak từ small ISP affected major sites. RPKI (Resource Public Key Infrastructure) là countermeasure.
- **NAT breaks end-to-end**: NAT rewrite IP/port → P2P applications cần NAT traversal (STUN, TURN, ICE). WebRTC heavily depends on this.

| Sai lầm                              | Tại sao sai                                           | Đúng là                                                   |
| ------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------- |
| "IPv4 classful addressing vẫn dùng"  | CIDR thay thế từ 1993 — classful waste IP             | Luôn dùng CIDR notation (/24, /26)                        |
| "NAT = security feature"             | NAT không phải firewall — chỉ hide internal IPs       | NAT là workaround cho IPv4 exhaustion, cần firewall riêng |
| "Longest prefix match = exact match" | Router chọn route cụ thể nhất, không nhất thiết exact | /28 match ưu tiên hơn /24 match cho cùng destination      |

🎯 **Interview Pattern:** "Explain subnetting" → Cho ví dụ cụ thể (192.168.1.0/24 → 4 subnets), tính nhanh host count (2^n - 2), rồi explain WHY subnet (broadcast domain reduction, security isolation).

🔗 **Knowledge Chain:** IP addressing → [Subnetting/CIDR] → [Routing tables] → [BGP between AS] → [NAT/IPv6 transition]

---

### Concept 7: Network Performance & Security

🧠 **Memory Hook:** "**Latency = Distance to Restaurant**" (không thể giảm dưới speed of light). "**Bandwidth = Width of Door**" (bao nhiêu người vào cùng lúc). "**Firewall = Bouncer**" (kiểm tra ai được vào).

❓ **Why exists (Tại sao tồn tại):**

- Level 1: Performance quyết định UX — 100ms delay = 1% revenue loss (Amazon). Security bảo vệ data và service.
- Level 2: Bốn loại delay cộng dồn: propagation (distance), transmission (bandwidth), processing (router), queuing (congestion). Mỗi loại có cách tối ưu khác nhau.
- Level 3: CDN giảm propagation delay, QoS prioritize traffic, DDoS mitigation ở edge — defense-in-depth approach.

🔵 **Layer 1 — Analogy:**
Network performance như giao thông. Latency = khoảng cách (Hà Nội → HCM). Bandwidth = số làn đường. Congestion = kẹt xe giờ cao điểm. CDN = mở thêm cửa hàng ở mỗi thành phố thay vì ship từ 1 nơi.

🟡 **Layer 2 — Mechanics:**

```
Latency Breakdown:
Total = Propagation + Transmission + Processing + Queuing

Propagation: distance / speed_of_light_in_medium
  HN → SG: ~1700km / (2×10⁸ m/s) ≈ 8.5ms one-way
Transmission: packet_size / bandwidth
  1500B / 1Gbps ≈ 0.012ms (negligible)
Processing: router lookup + firewall check
  ~1-5ms per hop
Queuing: depends on congestion
  0ms (no congestion) → 100ms+ (heavy congestion)

DDoS Attack Types:
┌──────────────┬────────────────┬──────────────────┐
│ Volume-based │ Protocol       │ Application      │
│ (L3/L4)      │ (L3/L4)       │ (L7)             │
├──────────────┼────────────────┼──────────────────┤
│ UDP flood    │ SYN flood      │ HTTP flood       │
│ ICMP flood   │ Ping of Death  │ Slowloris        │
│ Amplification│ Smurf attack   │ DNS query flood  │
└──────────────┴────────────────┴──────────────────┘
```

🔴 **Layer 3 — Edge Cases:**

- **Bufferbloat**: Oversized router buffers → queuing delay tăng lên hundreds of ms nhưng không trigger congestion control vì không có packet loss. Fix: Active Queue Management (CoDel, fq_codel).
- **DDoS amplification**: DNS/NTP/Memcached amplification — attacker gửi small request với spoofed source IP → server phản hồi lớn gấp 50-100x đến victim. Fix: BCP38 (ingress filtering), rate limiting, response rate limiting.
- **Stateful firewall bypass**: Attacker craft packets matching existing connection state → bypass stateful inspection. Deep Packet Inspection (DPI) giúp nhưng tốn CPU và gây latency.

| Sai lầm                        | Tại sao sai                                                                        | Đúng là                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| "Bandwidth cao = latency thấp" | Bandwidth và latency independent — fiber 10Gbps HN-US vẫn ~150ms RTT               | Latency phụ thuộc distance, bandwidth phụ thuộc link capacity |
| "Firewall = đủ security"       | Firewall chặn ở network level — không bảo vệ application-level attacks (XSS, SQLi) | Defense-in-depth: firewall + WAF + application security       |
| "CDN chỉ cho static content"   | Modern CDN cache dynamic content, run edge functions, terminate TLS                | CDN giảm latency cho cả static và dynamic content             |

🎯 **Interview Pattern:** "How would you reduce latency?" → Systematic: CDN (propagation), compression (transmission), connection pooling (handshake overhead), caching (eliminate round-trip entirely), HTTP/2-3 (multiplexing).

🔗 **Knowledge Chain:** Latency components → [CDN] → [QoS] → [DDoS mitigation] → [Firewall + WAF] → [Defense-in-depth]

---

## Understanding Computer Networks and Communication / Hiểu về Mạng Máy Tính

**English:** Computer networking is the practice of connecting computers and devices to share resources and communicate, forming the foundation of the internet and modern distributed systems.

**Tiếng Việt:** Mạng máy tính là thực hành kết nối máy tính và thiết bị để chia sẻ tài nguyên và giao tiếp, tạo nền tảng cho internet và các hệ thống phân tán hiện đại.

## Table of Contents

1. [Network Fundamentals](#network-fundamentals)
2. [OSI Model](#osi-model)
3. [TCP/IP Model](#tcpip-model)
4. [Network Protocols](#network-protocols)
5. [IP Addressing](#ip-addressing)
6. [Routing and Switching](#routing-and-switching)
7. [DNS System](#dns-system)
8. [Network Security](#network-security)
9. [Performance](#performance)
10. [Modern Networking](#modern-networking)

## Network Fundamentals

### What is a Network?

**Definition:** Collection of interconnected devices that can communicate and share resources

**Network Types by Size:**

**PAN (Personal Area Network):**

- Range: Few meters
- Example: Bluetooth devices, USB connections
- Use: Personal device connectivity

**LAN (Local Area Network):**

- Range: Building or campus
- Example: Office network, home WiFi
- Use: Local resource sharing

**MAN (Metropolitan Area Network):**

- Range: City or metropolitan area
- Example: City-wide WiFi, cable TV networks
- Use: Regional connectivity

**WAN (Wide Area Network):**

- Range: Country or global
- Example: Internet, corporate networks
- Use: Long-distance communication

### Network Topologies

**Bus Topology:**

```
Device1 ─┬─ Device2 ─┬─ Device3 ─┬─ Device4
         │           │           │
    Single cable (backbone)

Advantages:
- Simple, inexpensive
- Easy to extend

Disadvantages:
- Single point of failure
- Performance degrades with traffic
- Difficult to troubleshoot
```

**Star Topology:**

```
        Device1
           |
Device2 ─ Hub ─ Device3
           |
        Device4

Advantages:
- Easy to add devices
- Failure isolated to one device
- Easy to troubleshoot

Disadvantages:
- Hub is single point of failure
- More cable required
- Hub cost
```

**Ring Topology:**

```
Device1 ─ Device2
   |         |
Device4 ─ Device3

Advantages:
- Equal access for all devices
- Predictable performance

Disadvantages:
- Single device failure affects network
- Difficult to add/remove devices
- Troubleshooting complex
```

**Mesh Topology:**

```
Device1 ─── Device2
  |  \    /  |
  |   \/\/   |
  |   /  \   |
  |  /    \  |
Device3 ─── Device4

Advantages:
- High redundancy
- No single point of failure
- Multiple paths

Disadvantages:
- Expensive (many connections)
- Complex configuration
- Difficult to maintain
```

### Network Components

**Network Interface Card (NIC):**

- Hardware for network connection
- Has unique MAC address
- Converts data to network signals

**Hub:**

- Broadcasts to all ports
- Layer 1 device (Physical)
- No intelligence
- Creates collision domain

**Switch:**

- Forwards to specific port
- Layer 2 device (Data Link)
- Uses MAC address table
- Reduces collisions

**Router:**

- Connects different networks
- Layer 3 device (Network)
- Uses IP addresses
- Makes routing decisions

**Gateway:**

- Connects different protocols
- Protocol translation
- Can operate at any layer

**Modem:**

- Modulates/demodulates signals
- Converts digital to analog
- Connects to ISP

## OSI Model

### Seven Layers

**Layer 7 - Application:**

```
Purpose: User interface, application services
Protocols: HTTP, FTP, SMTP, DNS, SSH
Data Unit: Data
Devices: Application gateways

Functions:
- Network services to applications
- User authentication
- Data formatting
- Resource sharing

Examples:
- Web browsers (HTTP)
- Email clients (SMTP, POP3)
- File transfer (FTP)
```

**Layer 6 - Presentation:**

```
Purpose: Data translation, encryption, compression
Protocols: SSL/TLS, JPEG, MPEG, ASCII
Data Unit: Data
Devices: Gateways

Functions:
- Data encryption/decryption
- Data compression
- Character encoding
- Format conversion

Examples:
- SSL/TLS encryption
- JPEG image format
- MPEG video format
```

**Layer 5 - Session:**

```
Purpose: Session management, synchronization
Protocols: NetBIOS, RPC, PPTP
Data Unit: Data
Devices: Gateways

Functions:
- Session establishment
- Session maintenance
- Session termination
- Synchronization

Examples:
- Login sessions
- Video conferencing
- Remote procedure calls
```

**Layer 4 - Transport:**

```
Purpose: End-to-end communication, reliability
Protocols: TCP, UDP, SCTP
Data Unit: Segment (TCP), Datagram (UDP)
Devices: Gateways

Functions:
- Segmentation and reassembly
- Flow control
- Error detection and recovery
- Port addressing

TCP:
- Connection-oriented
- Reliable delivery
- Flow control
- Error checking

UDP:
- Connectionless
- Unreliable delivery
- No flow control
- Faster than TCP
```

**Layer 3 - Network:**

```
Purpose: Logical addressing, routing
Protocols: IP, ICMP, ARP, OSPF, BGP
Data Unit: Packet
Devices: Routers, Layer 3 switches

Functions:
- Logical addressing (IP)
- Routing
- Packet forwarding
- Fragmentation

Examples:
- IP addressing
- Routing between networks
- Internet connectivity
```

**Layer 2 - Data Link:**

```
Purpose: Physical addressing, error detection
Protocols: Ethernet, PPP, HDLC, Frame Relay
Data Unit: Frame
Devices: Switches, Bridges, NICs

Functions:
- Physical addressing (MAC)
- Frame formatting
- Error detection
- Media access control

Sublayers:
- LLC (Logical Link Control)
- MAC (Media Access Control)

Examples:
- Ethernet frames
- MAC addresses
- Switch forwarding
```

**Layer 1 - Physical:**

```
Purpose: Physical transmission
Protocols: Ethernet physical, USB, Bluetooth
Data Unit: Bits
Devices: Hubs, Repeaters, Cables

Functions:
- Bit transmission
- Physical topology
- Signal encoding
- Physical medium

Examples:
- Cables (copper, fiber)
- Wireless signals
- Voltage levels
- Bit rates
```

### Data Encapsulation

**Process:**

```
Application Layer:     Data
Presentation Layer:    Data
Session Layer:         Data
Transport Layer:       Segment/Datagram (Data + Port)
Network Layer:         Packet (Segment + IP)
Data Link Layer:       Frame (Packet + MAC)
Physical Layer:        Bits

Encapsulation (Sending):
Data → Segment → Packet → Frame → Bits

Decapsulation (Receiving):
Bits → Frame → Packet → Segment → Data
```

## TCP/IP Model

### Four Layers

**Application Layer:**

```
Combines OSI Layers 5, 6, 7
Protocols: HTTP, FTP, SMTP, DNS, SSH, Telnet

Provides:
- Application services
- Data formatting
- Session management
```

**Transport Layer:**

```
Same as OSI Layer 4
Protocols: TCP, UDP

TCP (Transmission Control Protocol):
- Connection-oriented
- Three-way handshake
- Reliable delivery
- Flow control
- Congestion control

UDP (User Datagram Protocol):
- Connectionless
- No handshake
- Unreliable delivery
- No flow control
- Lower overhead
```

**Internet Layer:**

```
Same as OSI Layer 3
Protocols: IP, ICMP, ARP, RARP

IP (Internet Protocol):
- Logical addressing
- Routing
- Fragmentation
- Best-effort delivery

ICMP (Internet Control Message Protocol):
- Error reporting
- Diagnostic tools (ping, traceroute)

ARP (Address Resolution Protocol):
- Maps IP to MAC address
```

**Network Access Layer:**

```
Combines OSI Layers 1, 2
Protocols: Ethernet, WiFi, PPP

Provides:
- Physical addressing
- Media access
- Physical transmission
```

### TCP Three-Way Handshake

**Connection Establishment:**

```
Client                    Server
  |                          |
  |-------- SYN ------------>|  (Client initiates)
  |                          |
  |<----- SYN-ACK ----------|  (Server acknowledges)
  |                          |
  |-------- ACK ------------>|  (Client confirms)
  |                          |
  |   Connection Established |

SYN: Synchronize sequence numbers
ACK: Acknowledge receipt
```

**Connection Termination:**

```
Client                    Server
  |                          |
  |-------- FIN ------------>|  (Client wants to close)
  |                          |
  |<------- ACK ------------|  (Server acknowledges)
  |                          |
  |<------- FIN ------------|  (Server wants to close)
  |                          |
  |-------- ACK ------------>|  (Client acknowledges)
  |                          |
  |   Connection Closed      |

FIN: Finish, no more data
```

## Network Protocols

### HTTP/HTTPS

**HTTP (HyperText Transfer Protocol):**

```
Application layer protocol
Port: 80
Stateless
Request-response model

Request Methods:
- GET: Retrieve resource
- POST: Create resource
- PUT: Update resource
- DELETE: Remove resource
- HEAD: Get headers only
- OPTIONS: Get supported methods

Status Codes:
- 1xx: Informational
- 2xx: Success
- 3xx: Redirection
- 4xx: Client error
- 5xx: Server error
```

**HTTPS (HTTP Secure):**

```
HTTP over TLS/SSL
Port: 443
Encrypted communication
Certificate-based authentication

Security Features:
- Encryption (confidentiality)
- Authentication (identity verification)
- Integrity (tamper detection)
```

### FTP

**File Transfer Protocol:**

```
Application layer protocol
Ports: 20 (data), 21 (control)
File transfer between systems

Modes:
- Active: Server initiates data connection
- Passive: Client initiates data connection

Commands:
- USER: Username
- PASS: Password
- LIST: List files
- RETR: Retrieve file
- STOR: Store file
- QUIT: Disconnect
```

### SMTP/POP3/IMAP

**SMTP (Simple Mail Transfer Protocol):**

```
Sending email
Port: 25 (unencrypted), 587 (TLS)
Push protocol

Process:
1. Client connects to SMTP server
2. HELO/EHLO greeting
3. MAIL FROM: sender
4. RCPT TO: recipient
5. DATA: message content
6. QUIT: disconnect
```

**POP3 (Post Office Protocol v3):**

```
Receiving email
Port: 110 (unencrypted), 995 (SSL)
Download and delete from server

Characteristics:
- Simple protocol
- Downloads to local device
- Limited server interaction
- No synchronization
```

**IMAP (Internet Message Access Protocol):**

```
Receiving email
Port: 143 (unencrypted), 993 (SSL)
Keeps email on server

Characteristics:
- Complex protocol
- Server-side management
- Multiple device synchronization
- Folder support
```

### DNS

**Domain Name System:**

```
Translates domain names to IP addresses
Port: 53 (UDP for queries, TCP for zone transfers)
Hierarchical distributed database

DNS Hierarchy:
Root (.)
  └── Top-Level Domain (.com, .org, .net)
      └── Second-Level Domain (example.com)
          └── Subdomain (www.example.com)

Record Types:
- A: IPv4 address
- AAAA: IPv6 address
- CNAME: Canonical name (alias)
- MX: Mail exchange
- NS: Name server
- TXT: Text information
- SOA: Start of authority
```

**DNS Resolution Process:**

```
1. User enters www.example.com
2. Check local cache
3. Query recursive resolver
4. Query root name server
5. Query TLD name server (.com)
6. Query authoritative name server (example.com)
7. Return IP address
8. Cache result
9. Connect to IP address

Recursive Query:
Client → Resolver → Root → TLD → Authoritative → Resolver → Client

Iterative Query:
Client → Resolver
Resolver → Root (returns TLD server)
Resolver → TLD (returns authoritative server)
Resolver → Authoritative (returns IP)
Resolver → Client
```

### DHCP

**Dynamic Host Configuration Protocol:**

```
Automatic IP address assignment
Port: 67 (server), 68 (client)
UDP protocol

DORA Process:
1. Discover: Client broadcasts request
2. Offer: Server offers IP address
3. Request: Client requests offered IP
4. Acknowledge: Server confirms assignment

Provides:
- IP address
- Subnet mask
- Default gateway
- DNS servers
- Lease time
```

## IP Addressing

### IPv4

**Format:**

```
32-bit address
Dotted decimal notation
Example: 192.168.1.1

Binary: 11000000.10101000.00000001.00000001
Decimal: 192.168.1.1

Address Classes:
Class A: 0.0.0.0 to 127.255.255.255
  - First bit: 0
  - Network bits: 8
  - Host bits: 24
  - Networks: 128
  - Hosts per network: 16,777,214

Class B: 128.0.0.0 to 191.255.255.255
  - First bits: 10
  - Network bits: 16
  - Host bits: 16
  - Networks: 16,384
  - Hosts per network: 65,534

Class C: 192.0.0.0 to 223.255.255.255
  - First bits: 110
  - Network bits: 24
  - Host bits: 8
  - Networks: 2,097,152
  - Hosts per network: 254

Class D: 224.0.0.0 to 239.255.255.255
  - Multicast addresses

Class E: 240.0.0.0 to 255.255.255.255
  - Reserved for future use
```

**Private IP Ranges:**

```
Class A: 10.0.0.0 to 10.255.255.255
Class B: 172.16.0.0 to 172.31.255.255
Class C: 192.168.0.0 to 192.168.255.255

Not routable on internet
Used in private networks
NAT for internet access
```

**Special Addresses:**

```
0.0.0.0: Default route
127.0.0.1: Loopback (localhost)
255.255.255.255: Broadcast
169.254.0.0/16: Link-local (APIPA)
```

### Subnetting

**Subnet Mask:**

```
Divides IP address into network and host portions

Example: 192.168.1.0/24
IP: 192.168.1.0
Mask: 255.255.255.0 (24 bits)
Network: 192.168.1.0
Broadcast: 192.168.1.255
Usable hosts: 192.168.1.1 to 192.168.1.254
Total hosts: 254

CIDR Notation:
/24 = 255.255.255.0
/25 = 255.255.255.128
/26 = 255.255.255.192
/27 = 255.255.255.224
/28 = 255.255.255.240
/29 = 255.255.255.248
/30 = 255.255.255.252
```

**Subnetting Example:**

```
Network: 192.168.1.0/24
Requirement: 4 subnets

Borrow 2 bits: /24 → /26
Subnet mask: 255.255.255.192
Hosts per subnet: 62

Subnets:
1. 192.168.1.0/26 (0-63)
2. 192.168.1.64/26 (64-127)
3. 192.168.1.128/26 (128-191)
4. 192.168.1.192/26 (192-255)
```

### IPv6

**Format:**

```
128-bit address
Hexadecimal notation
8 groups of 4 hex digits
Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334

Abbreviation Rules:
1. Leading zeros can be omitted
   2001:0db8 → 2001:db8

2. Consecutive zeros can be replaced with ::
   2001:0db8:0000:0000:0000:0000:0000:0001
   → 2001:db8::1

Address Types:
- Unicast: Single interface
- Multicast: Multiple interfaces
- Anycast: Nearest interface

Special Addresses:
::1 - Loopback
:: - Unspecified
fe80::/10 - Link-local
ff00::/8 - Multicast
```

**IPv6 Advantages:**

```
- Larger address space (340 undecillion)
- No NAT required
- Built-in IPSec
- Simplified header
- Auto-configuration
- Better multicast support
- No broadcast (uses multicast)
```

## Routing and Switching

### Routing Concepts

**Static Routing:**

```
Manually configured routes
Administrator defines paths
No automatic updates

Advantages:
- Predictable
- No routing protocol overhead
- Secure (no route advertisements)

Disadvantages:
- Not scalable
- No automatic failover
- Manual configuration required
```

**Dynamic Routing:**

```
Automatic route discovery
Protocols exchange routing information
Adapts to network changes

Routing Protocols:
- Distance Vector (RIP, EIGRP)
- Link State (OSPF, IS-IS)
- Path Vector (BGP)
```

### Routing Protocols

**RIP (Routing Information Protocol):**

```
Distance vector protocol
Metric: Hop count
Maximum: 15 hops
Updates every 30 seconds

Characteristics:
- Simple configuration
- Slow convergence
- Limited scalability
- Routing loops possible
```

**OSPF (Open Shortest Path First):**

```
Link state protocol
Metric: Cost (bandwidth-based)
No hop limit
Fast convergence

Characteristics:
- Hierarchical design (areas)
- Efficient updates
- Scalable
- Complex configuration
```

**BGP (Border Gateway Protocol):**

```
Path vector protocol
Used between autonomous systems
Internet routing protocol

Characteristics:
- Policy-based routing
- Highly scalable
- Slow convergence
- Complex configuration
```

### Switching

**MAC Address Table:**

```
Switch learns MAC addresses
Associates MAC with port
Forwards frames to specific port

Learning Process:
1. Frame arrives on port
2. Record source MAC and port
3. Check destination MAC in table
4. Forward to destination port
5. If unknown, flood all ports
```

**VLAN (Virtual LAN):**

```
Logical network segmentation
Broadcast domain separation
Security and performance

Benefits:
- Reduced broadcast traffic
- Improved security
- Flexible network design
- Cost savings

VLAN Types:
- Port-based: Assign ports to VLANs
- Tagged (802.1Q): VLAN tags in frames
```

## DNS System

### DNS Architecture

**Hierarchical Structure:**

```
Root Level (.)
  ├── .com (TLD)
  │   ├── example.com
  │   │   ├── www.example.com
  │   │   └── mail.example.com
  │   └── google.com
  ├── .org (TLD)
  └── .net (TLD)

13 Root servers (A-M)
Distributed globally
Anycast routing
```

### DNS Query Types

**Recursive Query:**

```
Client expects complete answer
Resolver does all the work
Most common for end users

Process:
Client → Resolver
Resolver queries multiple servers
Resolver returns final answer
```

**Iterative Query:**

```
Server returns best answer it has
Client may need multiple queries
Used between DNS servers

Process:
Client → Server
Server returns referral
Client queries next server
Repeat until answer found
```

### DNS Caching

**Cache Levels:**

```
1. Browser cache
2. Operating system cache
3. Resolver cache
4. Authoritative server cache

TTL (Time To Live):
- Determines cache duration
- Set by authoritative server
- Balance between performance and freshness
```

### DNS Security

**DNSSEC (DNS Security Extensions):**

```
Cryptographic signatures
Prevents DNS spoofing
Chain of trust from root

Components:
- DNSKEY: Public key
- RRSIG: Resource record signature
- DS: Delegation signer
- NSEC/NSEC3: Proof of non-existence
```

## Network Security

### Firewalls

**Types:**

```
Packet Filtering:
- Examines packet headers
- Based on IP, port, protocol
- Stateless
- Fast but limited

Stateful Inspection:
- Tracks connection state
- Context-aware decisions
- More secure than packet filtering

Application Layer:
- Deep packet inspection
- Application-aware
- Can block specific content
- Slower but most secure
```

**Firewall Rules:**

```
Rule Components:
- Source IP/network
- Destination IP/network
- Protocol (TCP, UDP, ICMP)
- Source port
- Destination port
- Action (allow, deny)

Rule Order:
- Processed top to bottom
- First match wins
- Default deny at end
```

### VPN (Virtual Private Network)

**Types:**

```
Site-to-Site VPN:
- Connects networks
- Always-on connection
- Transparent to users

Remote Access VPN:
- Connects individual users
- On-demand connection
- Client software required
```

**VPN Protocols:**

```
IPSec:
- Network layer
- Strong security
- Complex configuration

SSL/TLS:
- Application layer
- Browser-based
- Easy deployment

OpenVPN:
- Open source
- Flexible
- Cross-platform
```

### Network Attacks

**DoS/DDoS:**

```
Denial of Service
Overwhelm target with traffic
Make service unavailable

Types:
- Volume-based (floods)
- Protocol attacks (SYN flood)
- Application layer (HTTP flood)

Mitigation:
- Rate limiting
- Traffic filtering
- CDN/DDoS protection
- Increased capacity
```

**Man-in-the-Middle:**

```
Attacker intercepts communication
Can read/modify data
Impersonates both parties

Prevention:
- Encryption (TLS/SSL)
- Certificate validation
- VPN
- Secure protocols
```

**DNS Spoofing:**

```
Fake DNS responses
Redirect to malicious sites
Cache poisoning

Prevention:
- DNSSEC
- Secure resolvers
- HTTPS
- Certificate pinning
```

## Performance

### Latency

**Components:**

```
Propagation Delay:
- Time for signal to travel
- Speed of light in medium
- Distance dependent

Transmission Delay:
- Time to push bits onto wire
- Bandwidth dependent

Processing Delay:
- Router/switch processing
- Routing decisions
- Queue management

Queuing Delay:
- Waiting in buffer
- Congestion dependent
- Variable
```

### Bandwidth

**Definition:**

```
Maximum data transfer rate
Measured in bits per second (bps)
Theoretical vs actual throughput

Factors:
- Physical medium
- Protocol overhead
- Network congestion
- Distance
```

### Quality of Service (QoS)

**Traffic Prioritization:**

```
Classification:
- Identify traffic types
- Mark packets

Queuing:
- Priority queuing
- Weighted fair queuing
- Class-based queuing

Shaping:
- Control traffic rate
- Smooth bursts
- Prevent congestion

Policing:
- Enforce rate limits
- Drop excess traffic
```

## Modern Networking

### Software-Defined Networking (SDN)

**Architecture:**

```
Application Layer:
- Network applications
- Business logic

Control Layer:
- Centralized controller
- Network intelligence
- Policy decisions

Infrastructure Layer:
- Network devices
- Packet forwarding
- Data plane

Benefits:
- Centralized management
- Programmable
- Flexible
- Cost-effective
```

### Network Function Virtualization (NFV)

**Concept:**

```
Virtualize network functions
Run on standard hardware
Replace dedicated appliances

Examples:
- Virtual routers
- Virtual firewalls
- Virtual load balancers
- Virtual WAN optimizers

Benefits:
- Reduced costs
- Faster deployment
- Scalability
- Flexibility
```

### 5G Networks

**Characteristics:**

```
Enhanced Mobile Broadband:
- Higher data rates
- Improved capacity
- Better coverage

Ultra-Reliable Low Latency:
- <1ms latency
- Mission-critical applications
- Industrial automation

Massive IoT:
- Millions of devices
- Low power consumption
- Wide area coverage
```

## Interview Questions

**🟢 [Junior] Q: Explain the difference between TCP and UDP.**

A: TCP is connection-oriented, reliable, with flow control and error checking (three-way handshake, acknowledgments, retransmission). UDP is connectionless, unreliable, no flow control, faster with lower overhead. Use TCP for accuracy (web, email, file transfer), UDP for speed (streaming, gaming, DNS).

**🟡 [Mid] Q: What happens when you type a URL in a browser?**

A: 1) DNS lookup (domain to IP), 2) TCP connection (three-way handshake), 3) TLS handshake (HTTPS), 4) HTTP request sent, 5) Server processes and responds, 6) Browser receives HTML, 7) Parse and render, 8) Load additional resources (CSS, JS, images), 9) Execute JavaScript, 10) Page interactive.

**🟢 [Junior] Q: Explain the OSI model layers.**

A: Seven layers from bottom: Physical (bits, cables), Data Link (frames, MAC), Network (packets, IP routing), Transport (segments, TCP/UDP), Session (connections), Presentation (encryption, formatting), Application (user interface, HTTP/FTP). Remember: Please Do Not Throw Sausage Pizza Away.

**🟡 [Mid] Q: What is subnetting and why is it used?**

A: Subnetting divides network into smaller subnetworks using subnet mask. Benefits: efficient IP usage, reduced broadcast traffic, improved security, better organization. Example: 192.168.1.0/24 can be split into 192.168.1.0/26, 192.168.1.64/26, etc. Each subnet has own network/broadcast addresses.

**🟡 [Mid] Q: How does DNS work?**

A: DNS translates domain names to IP addresses. Process: 1) Check local cache, 2) Query recursive resolver, 3) Resolver queries root server, 4) Root returns TLD server, 5) Query TLD server, 6) TLD returns authoritative server, 7) Query authoritative server, 8) Return IP address, 9) Cache result. Hierarchical distributed database.

---

## Interview Q&A — Networking / Câu Hỏi Phỏng Vấn Networking

---

### Q: When should you use TCP vs UDP? / Khi nào dùng TCP, khi nào dùng UDP? 🟢 Junior

**A:** TCP (Transmission Control Protocol) is connection-oriented, reliable, and ordered. It guarantees delivery through acknowledgments, retransmission, and sequencing. Use TCP when data integrity matters: HTTP/HTTPS, file transfer (FTP, SFTP), email (SMTP, IMAP), database connections.

UDP (User Datagram Protocol) is connectionless, with no delivery guarantee or ordering. It is faster due to zero handshake overhead and no retransmission. Use UDP when speed matters more than reliability: video/audio streaming, DNS queries, online gaming, VoIP, DHCP.

Vietnamese: TCP đảm bảo dữ liệu đến đúng thứ tự và đầy đủ, nhưng tốn overhead (handshake, ACK, retransmit). UDP nhanh hơn vì không cần thiết lập kết nối và không retry — phù hợp với các ứng dụng real-time chấp nhận mất một vài packet (video call mất 1 frame vẫn OK, nhưng file bị mất byte thì hỏng hoàn toàn). Trade-off cốt lõi: reliability vs latency.

---

### Q: What happens when you type a URL in the browser? / Điều gì xảy ra khi bạn gõ URL vào trình duyệt? 🟢 Junior

**A:** The full lifecycle involves multiple layers of the networking stack:

1. **URL parsing** — Browser parses scheme, host, port, path.
2. **DNS resolution** — Browser cache → OS cache → Recursive resolver → Root NS → TLD NS → Authoritative NS → returns IP address.
3. **TCP 3-way handshake** — SYN → SYN-ACK → ACK establishes connection to the server IP on port 80 (HTTP) or 443 (HTTPS).
4. **TLS handshake** (HTTPS only) — ClientHello → ServerHello + Certificate → Key Exchange → Finished. Negotiates cipher suite, verifies certificate, establishes session keys.
5. **HTTP request** — Browser sends `GET /path HTTP/1.1` with headers (Host, Accept, Cookies, etc.).
6. **Server processing** — Server routes request, executes application logic, queries database if needed, builds response.
7. **HTTP response** — Server returns status code, headers, and body (HTML).
8. **Rendering** — Browser parses HTML → builds DOM → fetches sub-resources (CSS, JS, images) → renders page.

Vietnamese: Đây là câu hỏi kinh điển để test hiểu biết toàn stack. Điểm quan trọng cần nhớ: DNS xảy ra trước TCP, TCP handshake xảy ra trước TLS, TLS xong mới gửi HTTP request. Mỗi bước đều có latency: DNS lookup (~20-120ms), TCP handshake (1 RTT), TLS handshake (1-2 RTT), HTTP round-trip. HTTP/2 và HTTP/3 ra đời phần lớn để giảm các latency này.

---

### Q: What are the key differences between HTTP/1.1, HTTP/2, and HTTP/3? / Sự khác biệt chính giữa HTTP/1.1, HTTP/2 và HTTP/3? 🟡 Mid

**A:**

**HTTP/1.1** (1997): Text-based protocol. One request per TCP connection at a time (head-of-line blocking). Workaround: browser opens 6–8 parallel TCP connections per domain. No header compression — headers resent in full on every request. Keep-Alive allows connection reuse but still sequential.

**HTTP/2** (2015): Binary framing layer. Key improvements:

- **Multiplexing**: multiple streams over a single TCP connection, eliminating application-layer HOL blocking.
- **Header compression (HPACK)**: compresses repetitive headers using a shared table.
- **Server push**: server can proactively send resources the client will need.
- **Stream prioritization**: client signals which resources are more important.
  Still suffers from **TCP-level head-of-line blocking** — a single lost TCP packet stalls all streams.

**HTTP/3** (2022): Runs over **QUIC** instead of TCP. QUIC is built on UDP and implements reliability, congestion control, and TLS 1.3 natively. Key improvements:

- **Eliminates HOL blocking at transport layer**: each QUIC stream is independent — a lost packet only stalls its own stream.
- **0-RTT connection establishment**: reconnecting clients can send data immediately.
- **Connection migration**: connections survive IP changes (useful on mobile switching from WiFi to LTE).

Vietnamese: Mỗi version ra đời để giải quyết bottleneck của version trước. HTTP/1.1 bị HOL blocking ở application layer → HTTP/2 fix bằng multiplexing nhưng vẫn bị HOL ở TCP layer → HTTP/3 bỏ TCP hoàn toàn, dùng QUIC trên UDP. Trong phỏng vấn, điểm hay bị hỏi nhầm là "HTTP/2 đã fix HOL blocking chưa?" — câu trả lời là fix được application-level HOL nhưng không fix TCP-level HOL.

---

### Q: What is the TLS handshake and how does it work? / TLS handshake là gì và hoạt động như thế nào? 🟡 Mid

**A:** TLS (Transport Layer Security) establishes an encrypted, authenticated channel before any HTTP data flows. The handshake in TLS 1.2 takes 2 RTTs:

1. **ClientHello** — Client sends supported TLS versions, cipher suites, and a random nonce.
2. **ServerHello + Certificate** — Server picks cipher suite, sends its X.509 certificate (containing public key), and its own random nonce.
3. **Certificate verification** — Client verifies the certificate against trusted Certificate Authorities (CA chain), checks expiry and domain match.
4. **Key Exchange** — Client and server use asymmetric cryptography (RSA or ECDHE) to agree on a shared **pre-master secret**, from which symmetric session keys are derived.
5. **Finished** — Both sides send a Finished message encrypted with session keys to confirm handshake integrity.

**TLS 1.3** (2018) reduces this to **1-RTT** by eliminating the separate key exchange round-trip — the client sends key share parameters in the ClientHello. It also supports **0-RTT resumption** for repeat connections (with replay attack caveats).

Key principle: **asymmetric encryption** (expensive) is only used to exchange keys; all actual data is encrypted with **symmetric keys** (AES-GCM, ChaCha20), which are much faster.

Vietnamese: TLS dùng hai loại mã hóa kết hợp — asymmetric (RSA/ECDHE) để trao đổi khóa an toàn vì không thể gửi symmetric key qua đường chưa mã hóa, rồi symmetric (AES) để mã hóa data vì nhanh hơn nhiều. PKI (Public Key Infrastructure) là hệ thống niềm tin dựa trên CA — browser tin server vì CA (Lets Encrypt, DigiCert) đã ký xác nhận. TLS 1.3 bỏ các cipher suite yếu (RSA key exchange không có forward secrecy), chỉ giữ ECDHE — đây là lý do mọi modern site nên dùng TLS 1.3.

---

### Q: How does DNS resolution work step by step? / DNS resolution hoạt động từng bước như thế nào? 🟡 Mid

**A:** DNS (Domain Name System) is a distributed hierarchical database that maps domain names to IP addresses. Resolution follows this order:

1. **Browser cache** — Most browsers cache DNS results for the duration specified by TTL. Chrome: `chrome://net-internals/#dns`.
2. **OS cache** — Operating system checks its resolver cache (`/etc/hosts` on Linux/Mac, Windows hosts file checked first).
3. **Recursive resolver** (ISP or 8.8.8.8) — If not cached, OS queries the configured recursive resolver. The resolver does the heavy lifting.
4. **Root nameservers** (13 logical servers, anycast) — Resolver asks "who handles `.com`?" → gets TLD nameserver addresses.
5. **TLD nameserver** — Resolver asks "who handles `example.com`?" → gets authoritative nameserver addresses.
6. **Authoritative nameserver** — Resolver asks "what is the IP for `www.example.com`?" → gets the A (IPv4) or AAAA (IPv6) record.
7. **Response + caching** — Resolver caches the result per TTL, returns IP to OS, OS caches and returns to browser.

Key details: **TTL** (Time To Live) controls cache duration — low TTL (60s) allows fast DNS changes, high TTL (86400s) reduces resolver load. **Negative caching** (NXDOMAIN) caches "domain does not exist" responses to prevent repeated lookups. **DNSSEC** adds cryptographic signatures to prevent cache poisoning.

Vietnamese: Chuỗi phân cấp Root → TLD → Authoritative chỉ xảy ra khi không có cache. Trong thực tế, recursive resolver (của ISP hoặc 8.8.8.8) đã cache hầu hết các domain phổ biến, nên query thường kết thúc ở bước 3. TTL là trade-off quan trọng: TTL thấp = dễ đổi IP nhưng tốn nhiều DNS query hơn; TTL cao = ít query nhưng propagation chậm khi cần đổi. Khi deploy, nên giảm TTL vài giờ trước khi migrate để failover nhanh hơn.

---

### Q: What is TCP's 3-way handshake and why does TIME_WAIT state exist? / 3-way handshake của TCP là gì và tại sao có trạng thái TIME_WAIT? 🔴 Senior

**A:** **3-way handshake** establishes a TCP connection:

1. **SYN** — Client sends SYN with its Initial Sequence Number (ISN), enters SYN_SENT state.
2. **SYN-ACK** — Server acknowledges client ISN and sends its own ISN, enters SYN_RECEIVED state.
3. **ACK** — Client acknowledges server ISN, both enter ESTABLISHED state.

**Connection termination** (4-way): FIN → ACK → FIN → ACK. The side initiating close enters TIME_WAIT after sending the final ACK.

**TIME_WAIT** lasts **2×MSL** (Maximum Segment Lifetime, typically 60s, so TIME_WAIT = 120s). Two reasons:

1. **Prevent stale packet collision**: ensures any delayed packets from the old connection expire before a new connection with the same 4-tuple (src IP, src port, dst IP, dst port) is established. Without TIME_WAIT, a delayed packet could corrupt a new connection.
2. **Reliable connection termination**: if the final ACK is lost, the remote side retransmits its FIN — TIME_WAIT allows the client to re-send the ACK.

**Operational implications**: High-traffic servers may exhaust available ports due to TIME_WAIT accumulation. Mitigations: `SO_REUSEADDR`, `net.ipv4.tcp_tw_reuse` (Linux), or increasing the local port range (`net.ipv4.ip_local_port_range`).

**SYN flood attack**: Attacker sends many SYN packets with spoofed IPs, filling the server's SYN backlog (half-open connections). Server waits for ACK that never comes. Mitigation: **SYN cookies** — server encodes connection state in the SYN-ACK's sequence number, requires no memory until ACK arrives.

Vietnamese: TIME_WAIT thường bị hiểu nhầm là bug — thực ra là tính năng bảo vệ tính toàn vẹn của TCP. Vấn đề thực tế: server xử lý hàng nghìn kết nối ngắn (REST API calls) có thể bị cạn kiệt port vì TIME_WAIT. Giải pháp không phải disable TIME_WAIT mà là dùng connection pooling, HTTP keep-alive, hoặc tuning OS params. SYN flood là DDoS cổ điển — SYN cookies là giải pháp stateless cho phép server handle flood mà không tốn RAM cho mỗi half-open connection.

---

### Q: What is head-of-line blocking and how do HTTP/2 and HTTP/3 address it differently? / Head-of-line blocking là gì và HTTP/2, HTTP/3 giải quyết khác nhau như thế nào? 🔴 Senior

**A:** **Head-of-line (HOL) blocking** occurs when a queue of requests is blocked by the first request, preventing subsequent requests from being processed.

**HTTP/1.1 application-level HOL**: A connection can only have one in-flight request at a time. The browser must wait for a response before sending the next request on that connection. Workaround: browsers open 6–8 parallel TCP connections per domain, which wastes resources and adds TCP handshake overhead.

**HTTP/2 solution (partial)**: Multiplexing maps multiple logical **streams** onto a single TCP connection. Each stream is independent at the HTTP layer — stream 3 does not wait for stream 1. This eliminates application-level HOL blocking. However, TCP sees one byte stream. If a single TCP **segment is lost**, the TCP layer holds all subsequent data in the receive buffer until the lost segment is retransmitted — all HTTP/2 streams are stalled regardless. This is **TCP-level HOL blocking**, which HTTP/2 cannot solve.

**HTTP/3 solution (complete)**: HTTP/3 runs over **QUIC**, which operates over UDP and implements its own stream multiplexing. QUIC's streams are truly independent: a lost UDP packet only triggers retransmission for the affected QUIC stream — other streams continue unimpeded. QUIC achieves this by managing per-stream flow control and loss recovery at the application layer, bypassing TCP's rigid byte-stream model.

Trade-off: QUIC adds complexity and some CPU overhead since it implements reliability in user space. On networks with high packet loss, HTTP/3 significantly outperforms HTTP/2. On reliable networks (low loss), the difference narrows.

Vietnamese: HOL blocking là vấn đề cơ bản của queue — một item đầu queue bị chậm thì toàn bộ queue bị ảnh hưởng. HTTP/2 giải quyết ở application layer nhưng không thể làm gì với TCP vì TCP là ordered byte stream — nếu packet bị mất, TCP phải đợi retransmit trước khi deliver data tiếp theo cho application. HTTP/3 đổi luật chơi bằng cách bỏ TCP hoàn toàn: QUIC implement reliability trên UDP nhưng per-stream, nên packet loss của stream A không ảnh hưởng stream B. Trong thực tế, HTTP/3 quan trọng nhất với mobile users vì mạng di động có packet loss cao hơn nhiều so với wired connections.

---

## Interview Q&A Summary / Tổng Kết Câu Hỏi Phỏng Vấn

| #   | Question                        | Difficulty | Core Concept   | Key Signal                                                         |
| --- | ------------------------------- | ---------- | -------------- | ------------------------------------------------------------------ |
| 1   | TCP vs UDP differences          | 🟢         | TCP vs UDP     | Nêu tradeoff reliability/latency + ví dụ use case cụ thể           |
| 2   | What happens when you type URL  | 🟢         | Full stack     | Walk through DNS→TCP→TLS→HTTP→render theo thứ tự đúng              |
| 3   | OSI model layers                | 🟢         | OSI/TCP-IP     | Focus TCP/IP 4 layers thực tế, không chỉ thuộc lòng 7 layers       |
| 4   | HTTP/1.1 vs 2 vs 3              | 🟡         | HTTP Evolution | Explain HOL blocking ở 3 levels (app, TCP, QUIC)                   |
| 5   | TLS handshake                   | 🟡         | TLS/HTTPS      | Asymmetric for key exchange → symmetric for data + forward secrecy |
| 6   | DNS resolution step by step     | 🟡         | DNS            | Hierarchy + caching ở mỗi level + TTL operational knowledge        |
| 7   | Subnetting                      | 🟡         | IP/Routing     | Tính nhanh host count + explain broadcast domain reduction         |
| 8   | TCP 3-way handshake + TIME_WAIT | 🔴         | TCP Deep       | TIME_WAIT = 2×MSL, port exhaustion, SYN cookies                    |
| 9   | Head-of-line blocking           | 🔴         | HTTP/2 vs 3    | TCP-level HOL = HTTP/2's fundamental limit → QUIC solves           |

**Distribution:** 🟢 3 | 🟡 4 | 🔴 2

---

## Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **⚡ "Our API response times increased from 50ms to 500ms after deploying to a new region. What's your debugging approach?"**

**30-second answer:**
"First, I'd check **latency breakdown**: DNS resolution time (new region may hit different resolvers), TCP handshake RTT (distance to client increased?), TLS handshake overhead, and actual server processing time. Tools: `curl -w` with timing breakdown, traceroute to measure hop count. Most likely causes: no CDN/edge cache in new region (propagation delay), cold DNS caches (resolver lookup hitting authoritative servers), or missing connection pooling (each request pays TCP+TLS handshake cost)."

**Follow-up: "We found it's the TLS handshake adding 200ms. How do you optimize?"**
"TLS 1.3 reduces to 1-RTT (vs 2-RTT in TLS 1.2). Enable 0-RTT resumption for repeat connections. Deploy TLS termination at edge/CDN close to users. Use OCSP stapling to avoid certificate validation round-trip. If internal service-to-service, consider mTLS with session tickets."

---

## Self-Check / Tự Kiểm Tra

Đóng tài liệu và trả lời:

| #   | Câu hỏi                                                                         | Key Points                                                                                                       |
| --- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | **Retrieval:** Vẽ TCP 3-way handshake và giải thích mỗi bước                    | SYN (ISN) → SYN-ACK (server ISN + ACK) → ACK → ESTABLISHED                                                       |
| 2   | **Visual:** Vẽ DNS resolution flow từ browser → authoritative server            | Browser cache → OS cache → Resolver → Root → TLD → Authoritative → cache + return                                |
| 3   | **Application:** API endpoint bị 500ms latency — phân tích từng component delay | DNS + TCP handshake + TLS + server processing + response size + network path                                     |
| 4   | **Debug:** HTTP/2 site có latency spike khi packet loss 2% — giải thích tại sao | TCP-level HOL blocking — single lost packet stalls all multiplexed streams                                       |
| 5   | **Teach:** Giải thích cho junior tại sao HTTPS quan trọng dù "chỉ là blog"      | Confidentiality (ISP tracking), integrity (middlebox injection), authentication (phishing), SEO penalty for HTTP |

💬 **Feynman Prompt:** Giải thích HTTPS cho người dùng thông thường đang hỏi "tại sao browser hiện ổ khóa xanh?" Dữ liệu được bảo vệ như thế nào trong khi truyền?

---

## Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | Thời điểm | Focus                                                          |
| ----- | --------- | -------------------------------------------------------------- |
| 1     | Day 1     | Đọc full bài, vẽ Concept Map từ trí nhớ                        |
| 2     | Day 3     | Cold Call + Self-Check (đóng tài liệu)                         |
| 3     | Day 7     | Giải thích TCP vs UDP, HTTP evolution, TLS cho bạn/rubber duck |
| 4     | Day 14    | Mock interview: URL lifecycle + DNS + HOL blocking             |
| 5     | Day 30    | Chỉ review Common Mistakes tables + diagram từ trí nhớ         |

---

## Connections / Liên Kết

**Same-track (Shared CS Fundamentals):**

- ⬅️ [OS Theory](./os-theory.md) — Sockets, I/O models, process/thread = foundation cho network programming
- ↔️ [Concurrency & Parallelism](./07-concurrency-and-parallelism.md) — Async I/O, event loop = network server architecture
- ↔️ [Data Structures Theory](./data-structures-theory.md) — Hash tables (routing), trees (DNS hierarchy), graphs (network topology)
- ↔️ [Algorithms Theory](./algorithms-theory.md) — Graph algorithms (routing), hashing (load balancing)
- ↔️ [Information Theory](./information-theory.md) — Encoding, compression, error detection codes

**Cross-track:**

- 🔗 [Security Fundamentals](../04-security/01-security-fundamentals.md) — TLS, HTTPS, certificate chains, network security
- 🔗 [BE Networking](../../be-track/02-backend-knowledge/06-networking-go.md) — Go-specific TCP/HTTP implementation, net package
- 🔗 [System Design Theory](../02-system-design/system-design-theory.md) — CDN, load balancing, DNS-based routing in distributed systems
