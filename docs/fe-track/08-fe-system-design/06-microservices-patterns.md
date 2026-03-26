# Microservices Patterns - Advanced Theory

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Building Distributed Systems at Scale

**English:** Microservices architecture is an approach to developing software systems as a collection of small, independent services that communicate through well-defined APIs, enabling scalability, flexibility, and faster development cycles.

**Tiếng Việt:** Kiến trúc microservices là cách tiếp cận phát triển hệ thống phần mềm như một tập hợp các dịch vụ nhỏ, độc lập giao tiếp thông qua API được định nghĩa rõ ràng, cho phép khả năng mở rộng, linh hoạt và chu kỳ phát triển nhanh hơn.

## Table of Contents
1. [Microservices Fundamentals](#microservices-fundamentals)
2. [Service Communication](#service-communication)
3. [Data Management](#data-management)
4. [Service Discovery](#service-discovery)
5. [API Gateway](#api-gateway)
6. [BFF — Backend for Frontend](#bff--backend-for-frontend)
7. [Circuit Breaker](#circuit-breaker)
8. [Service Mesh](#service-mesh)
9. [Micro-Frontend Patterns](#micro-frontend-patterns)
10. [Saga Pattern](#saga-pattern)
11. [Event Sourcing](#event-sourcing)
12. [CQRS](#cqrs)
13. [Deployment Patterns](#deployment-patterns)

## Microservices Fundamentals

> 🧠 **Memory Hook**: "Một team, một service, một database — độc lập hoàn toàn." (One team, one service, one DB — fully independent.)

### Definition

**Microservices:** Architectural style structuring application as collection of loosely coupled services

**Characteristics:**
```
✅ Small, focused services
✅ Independent deployment
✅ Decentralized data management
✅ Technology diversity
✅ Failure isolation
✅ Scalability
```

### Monolith vs Microservices

**Monolithic Architecture:**
```
┌─────────────────────────────┐
│                             │
│  ┌─────────────────────┐   │
│  │   User Interface    │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │  Business Logic     │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │   Data Access       │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │     Database        │   │
│  └─────────────────────┘   │
│                             │
└─────────────────────────────┘

Single deployment unit
Shared database
Tight coupling
```

**Microservices Architecture:**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ User     │  │ Order    │  │ Payment  │
│ Service  │  │ Service  │  │ Service  │
│    ↓     │  │    ↓     │  │    ↓     │
│   DB     │  │   DB     │  │   DB     │
└──────────┘  └──────────┘  └──────────┘

Independent services
Separate databases
Loose coupling
```


### Benefits

**Scalability:**
```
Scale individual services independently
Resource optimization
Handle varying loads
```

**Flexibility:**
```
Technology diversity
Independent deployment
Faster development
Team autonomy
```

**Resilience:**
```
Failure isolation
Graceful degradation
Better fault tolerance
```

**Maintainability:**
```
Smaller codebases
Easier to understand
Focused teams
Clear boundaries
```

### Challenges

**Complexity:**
```
Distributed system complexity
Network latency
Partial failures
Data consistency
```

**Operations:**
```
Deployment complexity
Monitoring challenges
Debugging difficulties
Infrastructure overhead
```

**Data Management:**
```
Distributed transactions
Data consistency
Query across services
Data duplication
```

## Service Communication

> 🧠 **Memory Hook**: "Sync = điện thoại — chờ đối phương trả lời. Async = nhắn tin — gửi rồi làm việc khác." (Sync = phone call — wait for reply. Async = text message — send and move on.)

### Synchronous Communication

**REST APIs:**
```javascript
// User Service
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Order Service calls User Service
async function getUser(userId) {
  const response = await fetch(`http://user-service/users/${userId}`);
  return response.json();
}

async function createOrder(userId, items) {
  const user = await getUser(userId);
  
  const order = await Order.create({
    userId: user.id,
    userName: user.name,
    items
  });
  
  return order;
}
```

**gRPC:**
```protobuf
// user.proto
service UserService {
  rpc GetUser (GetUserRequest) returns (User);
}

message GetUserRequest {
  string user_id = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}
```

```javascript
// Order Service
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('user.proto');
const userProto = grpc.loadPackageDefinition(packageDefinition);

const client = new userProto.UserService(
  'user-service:50051',
  grpc.credentials.createInsecure()
);

async function getUser(userId) {
  return new Promise((resolve, reject) => {
    client.GetUser({ user_id: userId }, (error, user) => {
      if (error) reject(error);
      else resolve(user);
    });
  });
}
```

### Asynchronous Communication

**Message Queue (RabbitMQ):**
```javascript
// Order Service - Publisher
const amqp = require('amqplib');

async function publishOrderCreated(order) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertExchange('orders', 'topic', { durable: true });
  
  channel.publish(
    'orders',
    'order.created',
    Buffer.from(JSON.stringify(order))
  );
  
  await channel.close();
  await connection.close();
}

// Inventory Service - Consumer
async function consumeOrderCreated() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertExchange('orders', 'topic', { durable: true });
  const queue = await channel.assertQueue('', { exclusive: true });
  
  await channel.bindQueue(queue.queue, 'orders', 'order.created');
  
  channel.consume(queue.queue, async (msg) => {
    const order = JSON.parse(msg.content.toString());
    await reserveInventory(order);
    channel.ack(msg);
  });
}
```

**Event Bus (Kafka):**
```javascript
// Producer
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function publishEvent(topic, event) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(event) }
    ]
  });
  await producer.disconnect();
}

// Consumer
const consumer = kafka.consumer({ groupId: 'inventory-service' });

async function consumeEvents() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      await handleEvent(event);
    }
  });
}
```

## Data Management

> 🧠 **Memory Hook**: "Mỗi service = chủ nhà riêng — không ai được vào nhà người khác, liên lạc qua cửa trước." (Each service = separate homeowner — nobody enters each other's house, communicate via front door.)

### Database per Service

**Pattern:** Each service owns its database

**Example:**
```
User Service → User Database
Order Service → Order Database
Payment Service → Payment Database
Inventory Service → Inventory Database
```

**Benefits:**
```
✅ Loose coupling
✅ Independent scaling
✅ Technology choice
✅ Clear ownership
```

**Challenges:**
```
❌ Data consistency
❌ Distributed queries
❌ Data duplication
❌ Transaction management
```

### Shared Database Anti-Pattern

**Problem:**
```
Service A ──┐
            ├──→ Shared Database
Service B ──┘

Issues:
- Tight coupling
- Schema changes affect all services
- No clear ownership
- Difficult to scale
```

### Data Replication

**Event-Driven Replication:**
```javascript
// Order Service
async function createOrder(order) {
  const savedOrder = await Order.create(order);
  
  // Publish event
  await publishEvent('order.created', {
    orderId: savedOrder.id,
    userId: savedOrder.userId,
    items: savedOrder.items,
    total: savedOrder.total
  });
  
  return savedOrder;
}

// Analytics Service
async function handleOrderCreated(event) {
  // Replicate data for analytics
  await OrderAnalytics.create({
    orderId: event.orderId,
    userId: event.userId,
    total: event.total,
    timestamp: new Date()
  });
}
```

## Service Discovery

> 🧠 **Memory Hook**: "Service Discovery = danh bạ điện thoại tự cập nhật — service mới đăng ký, service cũ hủy tự động." (Service Discovery = auto-updating phone book — new services register, old ones deregister automatically.)

### Client-Side Discovery

**Pattern:** Client queries service registry

```javascript
// Service Registry (Consul)
const consul = require('consul')();

// Service Registration
async function registerService() {
  await consul.agent.service.register({
    name: 'order-service',
    address: 'localhost',
    port: 3000,
    check: {
      http: 'http://localhost:3000/health',
      interval: '10s'
    }
  });
}

// Service Discovery
async function discoverService(serviceName) {
  const result = await consul.health.service({
    service: serviceName,
    passing: true
  });
  
  const services = result[0];
  // Load balance between instances
  const service = services[Math.floor(Math.random() * services.length)];
  
  return {
    address: service.Service.Address,
    port: service.Service.Port
  };
}

// Usage
async function callUserService(userId) {
  const service = await discoverService('user-service');
  const response = await fetch(
    `http://${service.address}:${service.port}/users/${userId}`
  );
  return response.json();
}
```

### Server-Side Discovery

**Pattern:** Load balancer queries service registry

```
Client → Load Balancer → Service Registry
              ↓
         Service Instances
```

**Example with Kubernetes:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## API Gateway

> 🧠 **Memory Hook**: "API Gateway = người bảo vệ cửa — tất cả khách phải qua bảo vệ trước khi vào." (API Gateway = security guard — all guests must check in before entering.)

**Tại sao tồn tại? / Why does this exist?**

Frontend cần gọi 5 microservices khác nhau cho 1 trang dashboard.
→ **Why?** Mỗi service có URL khác nhau, auth riêng, rate limit riêng → FE code trở nên cực kỳ phức tạp.
→ **Why?** FE phải tự handle retry, timeout, correlation ID cho từng service → duplicated logic, dễ lỗi, khó maintain.
→ **Giải pháp**: Một điểm vào duy nhất (API Gateway) xử lý auth, routing, aggregation, rate limiting tập trung.

```
FE App
  ↓  (1 request)
API Gateway ← auth, rate limit, logging, tracing
  ├──→ User Service    ← route /api/users/*
  ├──→ Order Service   ← route /api/orders/*
  ├──→ Payment Service ← route /api/payments/*
  └──→ Aggregation    ← /api/dashboard (fan-out → merge)
```

**API Gateway vs Direct Service Calls / So sánh:**

| Tiêu chí | Direct Calls | API Gateway |
|----------|-------------|-------------|
| FE complexity | Cao — biết mọi service URL | Thấp — 1 endpoint |
| Auth | Mỗi service tự verify | Gateway xử lý tập trung |
| Latency | Nhiều RTT song song | 1 RTT + fan-out ở server |
| Rate limiting | Phải implement từng service | Tập trung tại gateway |
| CORS | Mỗi service config riêng | Config 1 lần tại gateway |
| Debug | Khó trace | Correlation ID tập trung |

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Đặt business logic vào Gateway | Gateway thành bottleneck monolith mới | Gateway chỉ route, auth, aggregate — không xử lý domain logic |
| Quên cache tại Gateway | Gây thừa load lên services phía sau | Cache response cho GET requests có TTL hợp lý |
| 1 Gateway cho tất cả clients | Mobile cần data khác Web → gateway trả data thừa | Dùng BFF pattern cho từng client type |
| Không có circuit breaker tại Gateway | 1 service chết → Gateway chờ timeout → FE treo | Gateway phải fail fast khi service down |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: FE gọi nhiều service / "how does FE talk to microservices" / cross-cutting concerns
- → Nhớ đến: API Gateway as single entry point + fan-out pattern
- → Mở đầu trả lời: *"API Gateway là single entry point để FE không cần biết topology của backend. Nó xử lý auth, rate limiting, và request aggregation tập trung — nhưng không chứa business logic."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [HTTP & REST fundamentals](../01-javascript-core/00-overview.md), [Authentication patterns](../../shared/05-security.md)
- ➡️ Để hiểu tiếp: [BFF Pattern](#bff--backend-for-frontend), [Circuit Breaker](#circuit-breaker)

### Pattern

**Single Entry Point:**
```
Client
  ↓
API Gateway
  ├──→ User Service
  ├──→ Order Service
  ├──→ Payment Service
  └──→ Inventory Service
```

### Implementation

```javascript
const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

// Routing
app.use('/api/users', (req, res) => {
  proxy.web(req, res, { target: 'http://user-service:3000' });
});

app.use('/api/orders', (req, res) => {
  proxy.web(req, res, { target: 'http://order-service:3000' });
});

app.use('/api/payments', (req, res) => {
  proxy.web(req, res, { target: 'http://payment-service:3000' });
});

// Authentication
app.use(async (req, res, next) => {
  const token = req.headers.authorization;
  
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Rate Limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Request Aggregation
app.get('/api/user-dashboard/:userId', async (req, res) => {
  const [user, orders, payments] = await Promise.all([
    fetch(`http://user-service/users/${req.params.userId}`).then(r => r.json()),
    fetch(`http://order-service/orders?userId=${req.params.userId}`).then(r => r.json()),
    fetch(`http://payment-service/payments?userId=${req.params.userId}`).then(r => r.json())
  ]);
  
  res.json({ user, orders, payments });
});

app.listen(8080);
```

## BFF — Backend for Frontend

> 🧠 **Memory Hook**: "BFF = mỗi client có 'trợ lý riêng' — mobile assistant khác web assistant." (BFF = each client has its own assistant — mobile's assistant differs from web's.)

**Tại sao tồn tại? / Why does this exist?**

Mobile app và Web app cùng dùng 1 API Gateway → Mobile nhận data dư thừa (over-fetching) hoặc thiếu (under-fetching).
→ **Why?** Mobile cần thumbnail nhỏ, ít field, tối ưu bandwidth. Web cần nhiều data hơn, layout phức tạp hơn. 1 API không thể thoả mãn cả 2 tốt.
→ **Why?** Nếu thêm query params để customize → Gateway thành God Object, chứa business logic của từng client → vi phạm Single Responsibility.
→ **Giải pháp**: Mỗi client type có BFF riêng — một lớp mỏng aggregation + transformation nằm giữa client và microservices.

```
                    ┌─────────────────────────────────────┐
Mobile App ────────→│  Mobile BFF                         │
                    │  - Lấy ít field hơn                 │──→ User Service
Web App ───────────→│  Web BFF                            │──→ Order Service
                    │  - Lấy full data, aggregate phức tạp│──→ Payment Service
Smart TV ──────────→│  TV BFF                             │
                    │  - Chỉ cần content, không cần auth  │
                    └─────────────────────────────────────┘

Không có BFF:           Có BFF:
Client → Gateway        Client → BFF → Gateway → Services
         ↓                              (transformation
   One-size-fits-all                     per client)
```

**API Gateway vs BFF / Phân biệt:**

| Tiêu chí | API Gateway | BFF |
|----------|-------------|-----|
| Mục đích | Cross-cutting concerns (auth, rate limit) | Client-specific data shaping |
| Ai dùng | Tất cả clients | Một client type |
| Logic | Routing, không transform | Aggregate + transform cho client |
| Số lượng | 1 (hoặc vài per region) | N (1 per client type) |
| Owned by | Platform/Infra team | FE team (của client đó) |
| Thay đổi khi | Backend thay đổi | Client requirement thay đổi |

### Implementation

```javascript
// Mobile BFF — chỉ lấy data mobile cần
app.get('/mobile/product/:id', async (req, res) => {
  const [product, reviews] = await Promise.all([
    fetch(`http://product-service/products/${req.params.id}`).then(r => r.json()),
    fetch(`http://review-service/reviews?productId=${req.params.id}&limit=3`).then(r => r.json())
  ]);

  // Transform: chỉ giữ fields mobile cần
  res.json({
    id: product.id,
    name: product.name,
    price: product.price,
    thumbnail: product.images[0]?.small,   // mobile cần thumbnail nhỏ
    rating: reviews.averageRating,
    reviewCount: reviews.total
    // bỏ: product.description (dài), product.images[].large, reviews.items[]
  });
});

// Web BFF — lấy full data cho web
app.get('/web/product/:id', async (req, res) => {
  const [product, reviews, related] = await Promise.all([
    fetch(`http://product-service/products/${req.params.id}`).then(r => r.json()),
    fetch(`http://review-service/reviews?productId=${req.params.id}`).then(r => r.json()),
    fetch(`http://recommendation-service/related/${req.params.id}`).then(r => r.json())
  ]);

  // Web có thể nhận đầy đủ
  res.json({ product, reviews, related });
});
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| BFF chứa business logic | BFF thành mini-monolith, khó test | BFF chỉ aggregate + transform, không validate business rules |
| Một BFF cho cả mobile lẫn web | Lại rơi vào vấn đề ban đầu | Mỗi client type có BFF riêng |
| FE team không own BFF | Mỗi thay đổi UI phải qua BE team → chậm | FE team sở hữu và deploy BFF của mình |
| Không có caching tại BFF | N requests từ client → N×M requests tới services | Cache aggregated response tại BFF layer |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "mobile vs web API", "over-fetching/under-fetching", "who should own the aggregation layer"
- → Nhớ đến: BFF pattern — một BFF per client type, owned by FE team
- → Mở đầu trả lời: *"BFF pattern giải quyết vấn đề mỗi client có data requirement khác nhau. Thay vì một API cố gắng phục vụ tất cả, mỗi client type có một BFF riêng — một lớp mỏng aggregate và transform data từ microservices theo đúng nhu cầu của client đó."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [API Gateway](#api-gateway), GraphQL vs REST trade-offs
- ➡️ Để hiểu tiếp: [Service Mesh](#service-mesh), [Micro-Frontend Patterns](#micro-frontend-patterns)

---

## Circuit Breaker

> 🧠 **Memory Hook**: "Circuit Breaker = cầu dao điện — khi chập mạch thì ngắt ngay, đừng để cháy cả nhà." (Circuit breaker = electrical fuse — when short-circuit, cut it immediately before the whole house burns.)

**Tại sao tồn tại? / Why does this exist?**

Service A gọi Service B nhưng B đang chết. A chờ timeout 30s, trong khi 1000 requests khác cũng đang chờ.
→ **Why?** Thread pool của A bị chiếm hết bởi requests đang chờ B → A cũng chết → C gọi A cũng chết → cascading failure.
→ **Why?** Không có cơ chế fail fast → hệ thống sụp đổ theo domino thay vì gracefully degrade.
→ **Giải pháp**: Circuit Breaker đếm failures, khi vượt threshold thì "mở circuit" — fail immediately thay vì chờ timeout.

```
CLOSED (bình thường)        OPEN (đang lỗi)
┌──────────────────┐        ┌──────────────────┐
│ Requests flow    │        │ Fail immediately │
│ Count failures   │──────→ │ No calls to svc  │
│ threshold: 5/1min│        │ Wait resetTimeout│
└──────────────────┘        └────────┬─────────┘
         ↑                           │
         │    HALF-OPEN              │
         │  ┌──────────────────┐     │
         └──│ 1 test request   │←────┘
            │ Success → CLOSED │
            │ Fail → OPEN again│
            └──────────────────┘
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Không có fallback khi circuit OPEN | User thấy error thay vì degraded experience | Luôn có fallback: cached data, default value, hoặc graceful message |
| Threshold quá thấp (1 failure = OPEN) | 1 lỗi thoáng qua → circuit mở → false positive | Threshold hợp lý: 5 failures trong 60s |
| Không monitor circuit state | Không biết khi nào service recover | Export metrics: circuit state, failure rate, success rate |
| Shared circuit breaker cho nhiều services | 1 service lỗi → ngắt service khác cùng breaker | Mỗi downstream service có circuit breaker riêng |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "cascading failure", "một service chết kéo chết cả hệ thống", "resilience pattern"
- → Nhớ đến: Circuit Breaker — 3 states (Closed/Open/Half-Open) + fallback mandatory
- → Mở đầu trả lời: *"Circuit Breaker pattern ngăn cascading failure bằng cách fail fast khi downstream service không healthy. Quan trọng là phải có fallback strategy — cached data hoặc graceful degradation — để UX vẫn hoạt động khi circuit mở."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [API Gateway](#api-gateway), Promise/async error handling
- ➡️ Để hiểu tiếp: [Service Mesh](#service-mesh) (circuit breaking ở infrastructure level)

### Pattern

**Prevent Cascading Failures:**
```
States:
- Closed: Normal operation
- Open: Fail fast
- Half-Open: Test recovery
```

### Implementation

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000;
    this.resetTimeout = options.resetTimeout || 30000;
    
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }
  
  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), this.timeout)
        )
      ]);
      
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }
  
  onFailure() {
    this.failureCount++;
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}

// Usage
const breaker = new CircuitBreaker({
  failureThreshold: 5,
  timeout: 3000,
  resetTimeout: 30000
});

async function callExternalService() {
  try {
    return await breaker.call(async () => {
      const response = await fetch('http://external-service/api');
      return response.json();
    });
  } catch (error) {
    // Fallback
    return { error: 'Service unavailable' };
  }
}
```

## Service Mesh

> 🧠 **Memory Hook**: "Service Mesh = mạng lưới đường cao tốc có camera giám sát — service không cần biết đường, chỉ cần lên xe." (Service Mesh = highway network with cameras — services don't need to know routes, just get on the road.)

**Tại sao tồn tại? / Why does this exist?**

Mỗi service phải tự implement retry, circuit breaking, mTLS, distributed tracing — code bị duplicate ở hàng chục services.
→ **Why?** Cross-cutting infrastructure concerns (security, observability, resilience) không nên sống trong business logic của service.
→ **Why?** Khi cần thay đổi policy (ví dụ: thêm mTLS cho tất cả service-to-service calls), phải deploy lại tất cả services.
→ **Giải pháp**: Service Mesh dùng sidecar proxy (Envoy/Linkerd) inject vào mỗi pod — infrastructure concerns được xử lý ở network level, service chỉ viết business logic.

```
Không có Service Mesh:        Có Service Mesh (Istio/Linkerd):
┌─────────────────┐           ┌──────────────────────────────┐
│  Service A      │           │  Service A        Envoy      │
│  ┌───────────┐  │           │  ┌──────────┐   ┌─────────┐  │
│  │ retry     │  │──────────→│  │ business │   │ retry   │  │
│  │ circuit b │  │           │  │ logic    │   │ circuit │  │
│  │ mTLS      │  │           │  │ only     │──→│ mTLS    │──→
│  │ tracing   │  │           │  └──────────┘   │ tracing │  │
│  │ biz logic │  │           │                 └─────────┘  │
│  └───────────┘  │           └──────────────────────────────┘
└─────────────────┘                     (sidecar pattern)
```

**FE Developer cần biết gì về Service Mesh?**

FE devs thường không configure service mesh trực tiếp, nhưng cần hiểu:

| Khái niệm | Ý nghĩa với FE |
|-----------|----------------|
| mTLS | Service-to-service calls được mã hóa — FE không cần worry về internal security |
| Traffic splitting | Canary deployment → FE có thể test A/B tại routing level, không cần feature flags |
| Circuit breaking | Infra-level CB → API Gateway tự fail fast, FE nhận 503 nhanh thay vì timeout |
| Distributed tracing | 1 request FE tạo ra → trace qua tất cả services → debug dễ hơn |
| Retry policies | Service mesh tự retry idempotent requests → FE không cần retry logic phức tạp |

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Implement retry trong FE vì "service mesh có rồi" | Service mesh retry là server-to-server, không phải client-to-server | FE vẫn cần retry/exponential backoff cho network calls |
| Bỏ qua circuit breaker ở FE vì mesh xử lý | Mesh CB chỉ cho inter-service calls, không bảo vệ FE → mesh | FE cần own logic khi nhận 503 từ mesh |
| Nhầm service mesh với API Gateway | Gateway: edge, 1 entry point. Mesh: internal, mọi service | Hai pattern giải quyết vấn đề khác nhau, thường dùng cả hai |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "infrastructure concerns trong microservices", "observability", "zero-trust security"
- → Nhớ đến: Service Mesh = sidecar proxy pattern, tách infrastructure khỏi business logic
- → Mở đầu trả lời: *"Service Mesh giải quyết vấn đề duplicate infrastructure code ở mọi service bằng cách dùng sidecar proxy. Với FE perspective, điều quan trọng là hiểu mesh xử lý inter-service concerns — FE vẫn phải own UI-level resilience."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [Circuit Breaker](#circuit-breaker), [API Gateway](#api-gateway)
- ➡️ Để hiểu tiếp: [Micro-Frontend Patterns](#micro-frontend-patterns)

---

## Micro-Frontend Patterns

> 🧠 **Memory Hook**: "Micro-frontend = áp dụng microservices vào UI — mỗi team sở hữu và deploy feature của mình độc lập." (Micro-frontend = microservices for UI — each team owns and deploys their feature independently.)

**Tại sao tồn tại? / Why does this exist?**

10 teams cùng làm việc trên 1 React codebase monolith → mỗi deploy phải đợi tất cả teams, 1 team break build thì block mọi người.
→ **Why?** Monolith frontend không scale theo organization — Conway's Law: tổ chức thế nào thì architecture thế đó.
→ **Why?** Teams muốn tự chọn tech stack (React, Vue, Angular), tự deploy theo cadence riêng, không phụ thuộc nhau.
→ **Giải pháp**: Chia frontend thành các micro-frontend — mỗi team owns một "slice" của UI, được compose lại trên shell app.

```
Shell App (Host)
├── Navigation Micro-FE (Team Platform)
├── Product Catalog Micro-FE (Team Commerce)   ← React
├── Checkout Micro-FE (Team Payments)          ← Vue
├── Recommendations Micro-FE (Team ML)         ← vanilla JS
└── User Profile Micro-FE (Team Identity)      ← React

Mỗi team: own repo, own deploy pipeline, own tech stack
Shell: compose tất cả lại, handle routing
```

### Composition Strategies / Các cách tích hợp

**1. Build-time Integration (NPM packages)**
```javascript
// Đơn giản nhất — nhưng deploy coupled
// package.json của shell
{
  "dependencies": {
    "@company/product-catalog": "^2.1.0",
    "@company/checkout": "^1.5.0"
  }
}

// Shell app
import ProductCatalog from '@company/product-catalog';
import Checkout from '@company/checkout';
// ⚠️ Shell phải redeploy khi micro-FE thay đổi
```

**2. Runtime Integration — Module Federation (Webpack 5)**
```javascript
// product-catalog/webpack.config.js (Remote)
new ModuleFederationPlugin({
  name: 'productCatalog',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductList': './src/ProductList',
    './ProductDetail': './src/ProductDetail',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
});

// shell/webpack.config.js (Host)
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    productCatalog: 'productCatalog@https://cdn.example.com/product-catalog/remoteEntry.js',
    checkout: 'checkout@https://cdn.example.com/checkout/remoteEntry.js',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
});

// Shell usage
const ProductList = React.lazy(() => import('productCatalog/ProductList'));
// ✅ Product team deploys → shell tự pick up — không cần shell redeploy
```

**3. iFrame Integration**
```html
<!-- Đơn giản, isolation tốt nhất, nhưng UX bị giới hạn -->
<iframe
  src="https://checkout.example.com/widget"
  title="Checkout"
  style="border:none; width:100%; height:600px"
/>
<!-- Khó chia sẻ state, SEO kém, performance overhead -->
```

**4. Web Components**
```javascript
// checkout-team định nghĩa custom element
class CheckoutWidget extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div id="checkout-root"></div>`;
    ReactDOM.render(<CheckoutApp />, this.querySelector('#checkout-root'));
  }
}
customElements.define('checkout-widget', CheckoutWidget);

// Shell dùng như HTML element — framework-agnostic
// <checkout-widget user-id="123" cart-id="456"></checkout-widget>
```

**Comparison / So sánh các strategy:**

| Strategy | Deploy Independence | Performance | Isolation | Complexity |
|----------|---------------------|-------------|-----------|------------|
| NPM packages | ❌ Thấp | ✅ Tốt | ❌ Thấp | ✅ Thấp |
| Module Federation | ✅ Cao | ✅ Tốt | 🟡 Trung bình | 🟡 Trung bình |
| iFrame | ✅ Cao | ❌ Kém | ✅ Cao | ✅ Thấp |
| Web Components | ✅ Cao | 🟡 Trung bình | 🟡 Trung bình | 🟡 Trung bình |

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Mỗi micro-FE bundle React riêng | 5 micro-FEs → 5 copies of React → 5MB+ overhead | Dùng `shared: { react: { singleton: true } }` trong Module Federation |
| Chia nhỏ quá mức (1 component = 1 micro-FE) | Overhead vượt benefit, latency tăng | Chia theo team/domain boundary, không phải theo component |
| Không có design system chung | 5 teams → 5 button styles → inconsistent UI | Shell cung cấp shared design system dùng bởi tất cả micro-FEs |
| Global CSS trong micro-FE | CSS leak sang micro-FE khác | CSS-in-JS, CSS Modules, hoặc Shadow DOM |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "scale frontend team", "independent deploy", "multiple tech stacks in one page"
- → Nhớ đến: Micro-frontend với Module Federation — domain-based split, shared dependencies, shell composition
- → Mở đầu trả lời: *"Micro-frontend áp dụng nguyên tắc microservices cho UI — mỗi team owns một domain slice và deploy độc lập. Key challenge là shared dependencies (React singleton) và consistent UX qua design system chung."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [BFF Pattern](#bff--backend-for-frontend), Webpack Module Federation
- ➡️ Để hiểu tiếp: [API Gateway](#api-gateway) (micro-FEs vẫn cần gateway), [CQRS](#cqrs) at FE level

---

## Saga Pattern

> 🧠 **Memory Hook**: "Saga = dây chuyền lắp ráp có nút UNDO — mỗi bước xong thì ghi lại, nếu lỗi thì chạy ngược." (Saga = assembly line with UNDO button — log each step, run backwards on failure.)

### Choreography-Based Saga

**Event-Driven Coordination:**
```javascript
// Order Service
async function createOrder(order) {
  const savedOrder = await Order.create({
    ...order,
    status: 'PENDING'
  });
  
  await publishEvent('order.created', savedOrder);
  return savedOrder;
}

// Payment Service
async function handleOrderCreated(order) {
  try {
    const payment = await processPayment(order);
    await publishEvent('payment.completed', { orderId: order.id, payment });
  } catch (error) {
    await publishEvent('payment.failed', { orderId: order.id, error });
  }
}

// Inventory Service
async function handlePaymentCompleted(event) {
  try {
    await reserveInventory(event.orderId);
    await publishEvent('inventory.reserved', { orderId: event.orderId });
  } catch (error) {
    await publishEvent('inventory.failed', { orderId: event.orderId });
    // Compensate: refund payment
    await publishEvent('payment.refund', { orderId: event.orderId });
  }
}

// Order Service - Complete
async function handleInventoryReserved(event) {
  await Order.updateOne(
    { _id: event.orderId },
    { status: 'CONFIRMED' }
  );
}

// Order Service - Compensate
async function handleInventoryFailed(event) {
  await Order.updateOne(
    { _id: event.orderId },
    { status: 'CANCELLED' }
  );
}
```

### Orchestration-Based Saga

**Central Coordinator:**
```javascript
class OrderSaga {
  async execute(order) {
    const sagaId = generateId();
    
    try {
      // Step 1: Create Order
      const createdOrder = await this.createOrder(order);
      await this.logStep(sagaId, 'ORDER_CREATED', createdOrder);
      
      // Step 2: Process Payment
      const payment = await this.processPayment(createdOrder);
      await this.logStep(sagaId, 'PAYMENT_PROCESSED', payment);
      
      // Step 3: Reserve Inventory
      await this.reserveInventory(createdOrder);
      await this.logStep(sagaId, 'INVENTORY_RESERVED');
      
      // Step 4: Confirm Order
      await this.confirmOrder(createdOrder.id);
      await this.logStep(sagaId, 'ORDER_CONFIRMED');
      
      return createdOrder;
    } catch (error) {
      await this.compensate(sagaId);
      throw error;
    }
  }
  
  async compensate(sagaId) {
    const steps = await this.getCompletedSteps(sagaId);
    
    // Reverse order
    for (const step of steps.reverse()) {
      switch (step.type) {
        case 'INVENTORY_RESERVED':
          await this.releaseInventory(step.data);
          break;
        case 'PAYMENT_PROCESSED':
          await this.refundPayment(step.data);
          break;
        case 'ORDER_CREATED':
          await this.cancelOrder(step.data.id);
          break;
      }
    }
  }
}
```

## Event Sourcing

> 🧠 **Memory Hook**: "Event Sourcing = sổ nhật ký ngân hàng — không lưu số dư hiện tại, lưu mọi giao dịch. Số dư = tổng giao dịch." (Event Sourcing = bank ledger — don't store current balance, store every transaction. Balance = sum of transactions.)

### Pattern

**Store Events Instead of State:**
```javascript
// Traditional
const account = {
  id: '123',
  balance: 1000
};

await Account.updateOne({ id: '123' }, { balance: 900 });

// Event Sourcing
const events = [
  { type: 'ACCOUNT_CREATED', accountId: '123', initialBalance: 1000 },
  { type: 'MONEY_WITHDRAWN', accountId: '123', amount: 100 }
];

await EventStore.append(events);
```

### Implementation

```javascript
class EventStore {
  async append(streamId, events) {
    for (const event of events) {
      await Event.create({
        streamId,
        type: event.type,
        data: event.data,
        timestamp: new Date(),
        version: await this.getNextVersion(streamId)
      });
    }
  }
  
  async getEvents(streamId, fromVersion = 0) {
    return await Event.find({
      streamId,
      version: { $gte: fromVersion }
    }).sort({ version: 1 });
  }
  
  async getNextVersion(streamId) {
    const lastEvent = await Event.findOne({ streamId })
      .sort({ version: -1 });
    return lastEvent ? lastEvent.version + 1 : 1;
  }
}

// Aggregate
class Account {
  constructor(id) {
    this.id = id;
    this.balance = 0;
    this.version = 0;
  }
  
  static async load(id) {
    const account = new Account(id);
    const events = await eventStore.getEvents(id);
    
    for (const event of events) {
      account.apply(event);
    }
    
    return account;
  }
  
  apply(event) {
    switch (event.type) {
      case 'ACCOUNT_CREATED':
        this.balance = event.data.initialBalance;
        break;
      case 'MONEY_DEPOSITED':
        this.balance += event.data.amount;
        break;
      case 'MONEY_WITHDRAWN':
        this.balance -= event.data.amount;
        break;
    }
    this.version = event.version;
  }
  
  async deposit(amount) {
    const event = {
      type: 'MONEY_DEPOSITED',
      data: { amount }
    };
    
    await eventStore.append(this.id, [event]);
    this.apply(event);
  }
  
  async withdraw(amount) {
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    const event = {
      type: 'MONEY_WITHDRAWN',
      data: { amount }
    };
    
    await eventStore.append(this.id, [event]);
    this.apply(event);
  }
}
```

## CQRS

> 🧠 **Memory Hook**: "CQRS = sổ ghi chép khác sổ tra cứu — viết vào 1 chỗ, đọc từ chỗ được optimize riêng." (CQRS = write ledger differs from lookup catalog — write to one, read from an optimized view.)

**Tại sao tồn tại? / Why does this exist?**

E-commerce: 1000 users đọc product list mỗi giây, 1 admin update price. Cùng dùng 1 database model là suboptimal.
→ **Why?** Read operations cần denormalized, pre-aggregated data (fast, no joins). Write operations cần normalized, consistent data (ACID transactions).
→ **Why?** 1 model phải thỏa cả 2 → compromise: hoặc read chậm, hoặc write phức tạp. Khi scale, cả 2 hướng conflict nhau.
→ **Giải pháp**: CQRS tách Commands (write) và Queries (read) thành 2 model riêng biệt, có thể scale độc lập.

```
FE Action: "Add to Cart"
         ↓
    COMMAND side                    QUERY side
  ┌──────────────┐               ┌────────────────┐
  │ CommandBus   │               │ QueryBus        │
  │ AddToCart    │               │ GetCartItems    │
  │ Command      │               │ Query           │
  └──────┬───────┘               └───────┬────────┘
         ↓                               ↓
  ┌──────────────┐               ┌────────────────┐
  │ Write Model  │               │ Read Model     │
  │ (normalized) │──→ events ──→ │ (denormalized) │
  │ Cart table   │               │ CartView table │
  │ Items table  │               │ pre-aggregated │
  └──────────────┘               └────────────────┘
```

**CQRS tại FE Level / CQRS at Frontend:**

FE cũng áp dụng CQRS concept trong state management:

```javascript
// Redux / Zustand: CQRS-inspired pattern
// Commands (mutations) — thay đổi state
const useCartStore = create((set, get) => ({
  // Write side
  addItem: (item) => set(state => ({
    items: [...state.items, item],
    updatedAt: Date.now()
  })),
  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id)
  })),

  // Read side — derived/computed views
  // Queries: không mutation, chỉ read
  get itemCount() { return get().items.length },
  get totalPrice() { return get().items.reduce((sum, i) => sum + i.price, 0) },
  get groupedByCategory() {
    // Pre-aggregated read model — không tính toán lại mỗi render
    return Object.groupBy(get().items, item => item.category);
  }
}));

// Optimistic updates — CQRS pattern rõ nhất tại FE
function addToCart(item) {
  // 1. Update read model immediately (optimistic)
  dispatch({ type: 'CART_ITEM_ADDED_OPTIMISTIC', payload: item });

  // 2. Send command to backend
  api.post('/cart/add', item)
    .catch(() => {
      // 3. Rollback read model nếu command fail
      dispatch({ type: 'CART_ITEM_ADD_FAILED', payload: item.id });
    });
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng CQRS cho mọi feature | Overhead không worth it cho CRUD đơn giản | CQRS phù hợp khi read/write ratio chênh lệch lớn hoặc complexity cao |
| Quên eventual consistency | Read model có độ trễ so với write model | FE phải handle: optimistic updates + reconcile khi real data về |
| Read model không được invalidate | FE hiện data cũ sau command thành công | Sau command success → invalidate và refetch read model |
| Tách CQRS mà không có event sourcing | Khó rebuild read model khi schema thay đổi | CQRS + Event Sourcing cặp tốt — events là source of truth để rebuild read model |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "optimistic updates", "stale data", "read/write scaling", "dashboard performance"
- → Nhớ đến: CQRS — tách write model và read model, FE áp dụng qua optimistic updates và derived state
- → Mở đầu trả lời: *"CQRS ở FE level xuất hiện rõ nhất trong optimistic updates — FE update read model ngay lập tức khi user action, rồi reconcile với server response. Điều quan trọng là FE phải handle eventual consistency: data có thể stale trong khoảng thời gian ngắn."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [Event Sourcing](#event-sourcing), Redux/Zustand state management
- ➡️ Để hiểu tiếp: React Query / SWR (CQRS pattern trong data fetching), [Micro-Frontend Patterns](#micro-frontend-patterns)

### Pattern

**Separate Read and Write Models:**
```
Commands (Write)     Queries (Read)
      ↓                    ↓
  Write Model          Read Model
      ↓                    ↑
  Event Store ──────────────┘
```

### Implementation

```javascript
// Write Model (Commands)
class OrderCommandHandler {
  async createOrder(command) {
    const order = new Order(command.orderId);
    order.create(command.userId, command.items);
    
    await eventStore.append(order.id, order.uncommittedEvents);
    order.clearUncommittedEvents();
    
    return order;
  }
  
  async cancelOrder(command) {
    const order = await Order.load(command.orderId);
    order.cancel();
    
    await eventStore.append(order.id, order.uncommittedEvents);
    order.clearUncommittedEvents();
  }
}

// Read Model (Queries)
class OrderQueryHandler {
  async getOrder(orderId) {
    return await OrderReadModel.findOne({ orderId });
  }
  
  async getOrdersByUser(userId) {
    return await OrderReadModel.find({ userId });
  }
  
  async getOrderStats() {
    return await OrderReadModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ]);
  }
}

// Projection (Update Read Model)
class OrderProjection {
  async handleOrderCreated(event) {
    await OrderReadModel.create({
      orderId: event.orderId,
      userId: event.userId,
      items: event.items,
      total: event.total,
      status: 'PENDING',
      createdAt: event.timestamp
    });
  }
  
  async handleOrderCancelled(event) {
    await OrderReadModel.updateOne(
      { orderId: event.orderId },
      { status: 'CANCELLED' }
    );
  }
}
```

## Deployment Patterns

> 🧠 **Memory Hook**: "Blue-Green = đổi phòng khách sạn khi khách đang ngủ — mở cửa mới, chuyển khách, đóng cửa cũ. Canary = thả con chim vào hầm mỏ trước — nếu không sao thì mọi người vào." (Blue-Green = switching hotel rooms while guests sleep. Canary = send the bird into the mine first — if it survives, everyone follows.)

### Blue-Green Deployment

```
Production Traffic
        ↓
   Load Balancer
        ↓
   Blue (v1.0) ← Current
   Green (v1.1) ← New

Switch:
   Load Balancer
        ↓
   Blue (v1.0)
   Green (v1.1) ← Current
```

### Canary Deployment

```
Production Traffic
        ↓
   Load Balancer
    ↙  90%  ↘ 10%
Stable (v1.0)  Canary (v1.1)

Gradually increase canary traffic
Monitor metrics
Rollback if issues
```

### Rolling Deployment

```
Initial: [v1.0] [v1.0] [v1.0] [v1.0]
Step 1:  [v1.1] [v1.0] [v1.0] [v1.0]
Step 2:  [v1.1] [v1.1] [v1.0] [v1.0]
Step 3:  [v1.1] [v1.1] [v1.1] [v1.0]
Final:   [v1.1] [v1.1] [v1.1] [v1.1]
```

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q: When should you use microservices vs monolith? / Khi nào dùng microservices, khi nào dùng monolith? 🟡 Mid

**A:** Use microservices for: large teams, need independent scaling, different technology requirements, complex domains. Use monolith for: small teams, simple domains, rapid prototyping, limited resources. Start monolith, migrate to microservices when needed.

Tiếng Việt: Bắt đầu với monolith — "monolith first" là best practice. Khi team lớn hơn, domain rõ ràng hơn, và pain points xuất hiện (deploy bottleneck, scaling một phần) thì mới migrate. Đừng dùng microservices chỉ vì "trend".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Đề cập "monolith first" strategy + nêu specific signals để migrate (team size, deploy conflict, scaling needs) + hiểu trade-off operational complexity
- ❌ Weak: "Microservices tốt hơn monolith vì scalable hơn" — không đề cập organizational context và không thừa nhận complexity overhead

---

### Q: How do you handle distributed transactions in microservices? / Xử lý distributed transactions như thế nào? 🔴 Senior

**A:** Use Saga pattern (choreography or orchestration) for distributed transactions. Choreography uses events for coordination, orchestration uses central coordinator. Implement compensating transactions for rollback. Avoid distributed transactions when possible through better service boundaries.

Tiếng Việt: Câu trả lời tốt nhất thường là "thiết kế để tránh distributed transactions" — chia service boundaries sao cho 1 transaction nằm trong 1 service. Khi không tránh được, dùng Saga với compensating transactions. Không dùng 2PC (two-phase commit) trong production vì blocking và single point of failure.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích tại sao 2PC không phù hợp → propose Saga → phân biệt choreography vs orchestration với trade-offs cụ thể → đề cập idempotency của compensating transactions
- ❌ Weak: "Dùng database transaction" — không hiểu distributed transaction problem, hoặc chỉ liệt kê Saga mà không giải thích compensating transaction

---

### Q: Explain the Circuit Breaker pattern. / Giải thích Circuit Breaker pattern. 🟡 Mid

**A:** Circuit Breaker prevents cascading failures by failing fast when service is unavailable. States: Closed (normal), Open (fail fast), Half-Open (test recovery). Opens after threshold failures, closes after successful test. Protects system from repeated failed calls.

Tiếng Việt: Quan trọng là nhấn mạnh **tại sao** cần fail fast: để giải phóng thread pool thay vì chờ timeout, ngăn cascade failure. Và phải có **fallback strategy** — circuit open không có nghĩa là crash, mà là degrade gracefully.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích cascade failure problem → 3 states với transition conditions → **mandatory fallback strategy** (cached data, default response) → mention monitoring circuit state
- ❌ Weak: Chỉ nói "fail fast khi service down" mà không đề cập fallback hoặc không giải thích tại sao half-open state cần thiết

---

### Q: What's the difference between choreography and orchestration in Saga pattern? / Phân biệt choreography và orchestration trong Saga. 🔴 Senior

**A:** Choreography: services react to events, decentralized coordination, loose coupling, harder to track. Orchestration: central coordinator manages flow, centralized logic, easier to understand, single point of failure. Choose based on complexity and coupling requirements.

Tiếng Việt: Choreography phù hợp khi services đã có event bus sẵn và domain đủ đơn giản để theo dõi. Orchestration tốt hơn khi flow phức tạp, cần visibility rõ ràng. Nhược điểm orchestration: saga orchestrator thành single point of failure và chứa business logic.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Nêu use case cụ thể khi nào dùng mỗi loại + trade-off (choreography: harder to debug; orchestration: SPOF) + đề cập compensating transactions áp dụng ở cả hai
- ❌ Weak: Chỉ định nghĩa hai khái niệm mà không nói khi nào chọn cái nào

---

### Q: How do you implement service discovery? / Triển khai service discovery như thế nào? 🟡 Mid

**A:** Client-side: client queries service registry (Consul, Eureka), implements load balancing. Server-side: load balancer queries registry, simpler clients. Use health checks, handle failures gracefully, cache registry data. Kubernetes provides built-in service discovery.

Tiếng Việt: Trong thực tế, Kubernetes đã xử lý service discovery qua DNS và Service resources. Developer hiếm khi implement từ đầu. Điều cần hiểu là underlying mechanism: health checks, DNS-based discovery, và tại sao cần cache registry data để tránh registry becoming bottleneck.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Phân biệt client-side vs server-side + đề cập Kubernetes built-in discovery + giải thích health check importance + mention stale registry data risk
- ❌ Weak: Chỉ nói "dùng Consul" mà không giải thích mechanism hoặc trade-offs giữa client-side và server-side discovery

---

### Q: Explain BFF pattern and when to use it over a single API Gateway. / Giải thích BFF pattern và khi nào dùng thay vì 1 API Gateway. 🔴 Senior

**A:** BFF (Backend for Frontend) creates a dedicated backend layer per client type. Unlike a single API Gateway that serves all clients equally, BFF allows each client to have tailored data aggregation and transformation — mobile gets lightweight data, web gets richer responses. BFF is owned by the frontend team, enabling them to iterate without backend coordination.

Tiếng Việt: BFF phù hợp khi có multiple client types với data requirements khác nhau đáng kể — mobile vs web vs TV. Không phù hợp khi chỉ có 1 client type (overhead không đáng), hoặc khi GraphQL đã được dùng (GraphQL cho phép client query exactly what it needs — giải quyết vấn đề tương tự theo cách khác).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích vấn đề BFF giải quyết (one-size-fits-all API) → so sánh với API Gateway → đề cập FE team ownership → mention GraphQL as alternative → trade-off: thêm service để maintain
- ❌ Weak: Nhầm BFF với API Gateway, hoặc không đề cập FE team ownership là key differentiator

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Your FE app calls 5 microservices for one page. Each takes 200ms. Users are complaining the page takes 1 second+ to load. Walk me through your diagnosis and solution."**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**
1. **Define/scope**: "Vấn đề là sequential vs parallel calls, và có thể thiếu API aggregation layer. Để tôi phân tích từng nguyên nhân."
2. **Core mechanism**: "Nếu 5 calls là sequential: 5 × 200ms = 1000ms. Nếu parallel: chỉ 200ms (longest call). Cần confirm đây là vấn đề gì trước."
3. **Real example**: "Đây là vấn đề Netflix gặp — họ giải quyết bằng API Gateway với request aggregation và Hystrix circuit breaker cho fallbacks."
4. **Trade-off**: "Solution có thể là: (1) parallelize FE calls với Promise.all, (2) thêm BFF để aggregate tại server — giảm round trips, (3) caching tại Gateway. Mỗi approach có trade-off khác nhau..."

**Cấu trúc trả lời đầy đủ / Full answer structure:**
```
1. Diagnose: Sequential vs Parallel? → dùng browser Network tab, xem waterfall
2. Quick win: Promise.all() tại FE nếu đang sequential
3. Proper fix: BFF/API Gateway aggregate 5 calls → 1 response cho FE
4. Cache: Gateway cache cho static data, reduce upstream load
5. Circuit breaker: Nếu 1 service slow → fail fast, return partial data
6. Monitoring: Add tracing để biết service nào là bottleneck
```

---

## Study Cases / Tình Huống Thực Tế Sâu

### Case 1: Netflix — API Gateway + BFF Pattern (2013–2015)

**Tình huống**: Netflix streaming trên 1000+ device types: smart TV Samsung, LG, Roku, iOS, Android, web browser. Mỗi device cần data format khác nhau — TV cần large thumbnails, mobile cần compressed, web cần metadata rich.

**Vấn đề ban đầu**: 1 API Gateway phục vụ tất cả → device team phải "negotiate" với backend team cho mỗi thay đổi → slow iteration. Mobile nhận dư data → tốn bandwidth. TV nhận data format không phù hợp → phải transform ở client.

**Quyết định**: Netflix phát triển Zuul (API Gateway) + implement BFF pattern per device family. Device team sở hữu BFF của mình — có thể deploy independent. Netflix sau đó open-source Zuul và Hystrix (circuit breaker library).

**Kết quả**: Device teams iterate 10× faster. Bandwidth giảm 60% cho mobile do không over-fetch. Hystrix ngăn cascade failures — khi recommendation service down, Netflix vẫn stream được (graceful degradation: hiển thị trending thay vì personalized).

**Bài học**: BFF ownership phải thuộc FE/device team. Circuit breaker + fallback không phải optional — chúng là prerequisite để achieve resilience ở scale. Một service chết không được phép kéo chết trang chủ.

---

### Case 2: Grab — Service Mesh Adoption (2018–2020)

**Tình huống**: Grab có 200+ microservices sau rapid growth. Mỗi service tự implement retry, circuit breaking, mutual TLS — code trùng lặp, inconsistent, và khó audit security.

**Vấn đề**: Security audit phát hiện nhiều services không enforce mTLS đúng cách. Incident thường xảy ra do retry storms (service A retry aggressive khi service B slow → làm B càng slower). Distributed tracing không có → debug mất ngày.

**Quyết định**: Adopt Istio service mesh. Inject Envoy sidecar vào tất cả pods. Centralize: mTLS enforcement, retry policies, circuit breaking, distributed tracing. Tất cả policies định nghĩa tại control plane, không phải trong service code.

**Kết quả**: mTLS coverage: 30% → 100% trong 3 tháng mà không cần touch service code. Retry storms: giảm 80% sau khi centralize retry policy (max 2 retries, không phải service-defined unlimited). Incident MTTR giảm 40% nhờ Jaeger distributed tracing.

**Bài học với FE devs**: Service mesh infrastructure ảnh hưởng FE experience — khi mesh enforce circuit breaking, FE nhận 503 nhanh (< 1s) thay vì timeout 30s. FE cần handle 503 gracefully. Mesh traffic splitting (canary) cho phép FE teams test API changes với % nhỏ traffic trước khi full rollout.

---

### Case 3: Shopee — Micro-Frontend + API Gateway (2019–2021)

**Tình huống**: Shopee mobile web có 50+ frontend engineers trên cùng 1 React monolith repo. Deploy mỗi tuần → queue dài, conflicts nhiều. Product team (catalog), Checkout team, và Marketing team block nhau liên tục.

**Vấn đề**: 1 bug trong Marketing banner component → block deploy của Checkout team (critical feature). Test cycle 2 ngày vì phải test toàn bộ app. Bundle size 8MB → slow initial load trên low-end Android.

**Quyết định**: Migrate sang micro-frontend architecture dùng Module Federation (Webpack 5). Tách thành 4 micro-FEs: Shell (routing, layout), Product (catalog, search), Commerce (cart, checkout), Marketing (banners, campaigns). Kết hợp với API Gateway (BFF per team) để mỗi micro-FE có endpoint tối ưu riêng.

**Kết quả**: Deploy frequency: weekly → multiple per day per team. Initial bundle size giảm 60% (lazy load micro-FEs theo route). Time-to-interactive giảm 2.3s → 0.9s trên low-end Android. 1 team bug không block team khác. Shared React singleton (Module Federation `shared` config) giữ bundle không bị duplicate.

**Bài học**: Chia micro-FE theo team/domain, không phải theo technical layer. Design system shared là prerequisite — nếu không có trước, micro-FE sẽ tạo ra UI inconsistency. Module Federation `shared: { react: { singleton: true } }` là mandatory config để tránh multiple React instances.

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Giải thích BFF pattern từ trí nhớ — vấn đề gì nó giải quyết và khác API Gateway như thế nào?
- [ ] **Visual**: Vẽ sơ đồ API Gateway vs BFF từ trí nhớ — chỉ ra ai own mỗi layer.
- [ ] **Application**: Mobile app cần data nhẹ hơn, web cần data phong phú hơn từ cùng backend. BFF hay GraphQL? Khi nào chọn cái nào?
- [ ] **Debug**: FE gọi 5 microservices cho 1 trang, mỗi cái 200ms — page load 1s+. Sequential hay parallel? Bottleneck ở đâu? Fix theo 3 cách khác nhau.
- [ ] **Teach**: Giải thích Circuit Breaker cho người không biết lập trình bằng analogy đời thường.
- [ ] **Architect**: Team bạn có 6 frontend teams, cùng 1 React monolith repo, deploy conflict liên tục. Propose migration plan sang micro-frontend — bắt đầu từ đâu?
- [ ] **Trade-off**: Micro-frontend Module Federation vs iFrame vs NPM packages — khi nào dùng cái nào?

💬 **Feynman Prompt:** Giải thích tại sao cần BFF pattern như đang giải thích cho PM không biết code. Tại sao không thể chỉ dùng 1 API Gateway duy nhất cho cả mobile lẫn web?

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày**.

---

[← Back to FE System Design Overview](./00-overview.md) | [Next: Event-Driven Architecture →](./07-event-driven-architecture.md)
