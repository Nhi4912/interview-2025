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
6. [Circuit Breaker](#circuit-breaker)
7. [Saga Pattern](#saga-pattern)
8. [Event Sourcing](#event-sourcing)
9. [CQRS](#cqrs)
10. [Deployment Patterns](#deployment-patterns)

## Microservices Fundamentals

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

## Circuit Breaker

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

## Saga Pattern

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

## Interview Questions

**Q: When should you use microservices vs monolith?**

A: Use microservices for: large teams, need independent scaling, different technology requirements, complex domains. Use monolith for: small teams, simple domains, rapid prototyping, limited resources. Start monolith, migrate to microservices when needed.

**Q: How do you handle distributed transactions in microservices?**

A: Use Saga pattern (choreography or orchestration) for distributed transactions. Choreography uses events for coordination, orchestration uses central coordinator. Implement compensating transactions for rollback. Avoid distributed transactions when possible through better service boundaries.

**Q: Explain the Circuit Breaker pattern.**

A: Circuit Breaker prevents cascading failures by failing fast when service is unavailable. States: Closed (normal), Open (fail fast), Half-Open (test recovery). Opens after threshold failures, closes after successful test. Protects system from repeated failed calls.

**Q: What's the difference between choreography and orchestration in Saga pattern?**

A: Choreography: services react to events, decentralized coordination, loose coupling, harder to track. Orchestration: central coordinator manages flow, centralized logic, easier to understand, single point of failure. Choose based on complexity and coupling requirements.

**Q: How do you implement service discovery?**

A: Client-side: client queries service registry (Consul, Eureka), implements load balancing. Server-side: load balancer queries registry, simpler clients. Use health checks, handle failures gracefully, cache registry data. Kubernetes provides built-in service discovery.

---

[← Back to Consensus Algorithms](./06-microservices-patterns.md) | [Next: Event-Driven Architecture →](./06-microservices-patterns.md)
