# Networking Theory / Lý Thuyết Mạng Máy Tính

> **Track**: Shared | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [OS Theory](./os-theory.md) | [FE Networking](../../fe-track/10-networking/) | [BE Networking](../../be-track/02-backend-knowledge/06-networking-go.md)

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

[← Back to Operating Systems](./os-theory.md) | [Next: Software Engineering →](./08-computation-theory.md)
