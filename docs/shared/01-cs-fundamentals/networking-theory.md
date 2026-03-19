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

| Concept | Frontend Impact |
|---------|----------------|
| HTTP/1.1 vs HTTP/2 | Bundle strategies, request waterfalls |
| DNS lookup | Preconnect hints, DNS prefetch |
| TLS handshake | HSTS, certificate pinning |
| CORS | Every API call từ browser |
| WebSocket | Real-time (chat, notifications) |

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

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| TCP vs UDP | 🟢 | Reliable vs fast — choose by tolerance for data loss |
| URL to page lifecycle | 🟢 | DNS → TCP → TLS → HTTP → render |
| HTTP/1.1 vs 2 vs 3 | 🟡 | Multiplexing → QUIC eliminates transport-level HOL |
| TLS handshake | 🟡 | Asymmetric for key exchange, symmetric for data |
| DNS resolution | 🟡 | Hierarchical + caching at every layer with TTL |
| TCP 3-way handshake & TIME_WAIT | 🔴 | TIME_WAIT = 2×MSL prevents stale packet collision |
| Head-of-line blocking | 🔴 | HTTP/2 fixes app-level HOL; HTTP/3 fixes transport-level HOL |
[← Back to Operating Systems](./os-theory.md) | [Next: Software Engineering →](./08-computation-theory.md)

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích TCP 3-way handshake và tại sao nó tốn thời gian không?
- [ ] Tôi có thể giải thích HTTPS/TLS và tại sao HTTP plain-text không an toàn không?
- [ ] Tôi có thể giải thích tại sao HTTP/2 nhanh hơn HTTP/1.1 (multiplexing, header compression) không?
- [ ] Tôi có thể giải thích CORS và cách server cần cấu hình để allow cross-origin requests không?
- [ ] Tôi có thể giải thích khi nào dùng WebSocket thay vì REST API không?

💬 **Feynman Prompt:** Giải thích HTTPS cho người dùng thông thường đang hỏi "tại sao browser hiện ổ khóa xanh?" Dữ liệu được bảo vệ như thế nào trong khi truyền?

---

## Connections / Liên Kết

- ⬅️ **Built on:** [OS Theory](./os-theory.md) — sockets là OS-level concept; networking builds on OS I/O model
- ➡️ **Enables:** [Security Fundamentals](../04-security/01-security-fundamentals.md) | [HTTP Fundamentals](../../fe-track/10-networking/01-http-fundamentals.md)
- 🔗 **Applied in:** Every API call | CDN configuration | WebSocket/SSE for real-time | Browser Network DevTools
