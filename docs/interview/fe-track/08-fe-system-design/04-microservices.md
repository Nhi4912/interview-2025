# Microservices Architecture / Kiến Trúc Microservices
## System Design - Chapter 4 / Thiết Kế Hệ Thống - Chương 4

[Back to Table of Contents](../00-table-of-contents.md)

---

## Microservices Principles

### Service Communication

```typescript
// API Gateway Pattern / Mẫu API Gateway
class APIGateway {
  private services: Map<string, string> = new Map([
    ['users', 'http://users-service:3001'],
    ['orders', 'http://orders-service:3002'],
    ['products', 'http://products-service:3003']
  ]);

  async route(serviceName: string, path: string, options?: RequestInit) {
    const serviceUrl = this.services.get(serviceName);
    
    if (!serviceUrl) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const response = await fetch(`${serviceUrl}${path}`, options);
    return response.json();
  }
}

// Usage / Sử dụng
const gateway = new APIGateway();

async function getUserOrders(userId: string) {
  const [user, orders] = await Promise.all([
    gateway.route('users', `/users/${userId}`),
    gateway.route('orders', `/orders?userId=${userId}`)
  ]);

  return { user, orders };
}
```

### Service Discovery

```typescript
class ServiceRegistry {
  private services: Map<string, Set<string>> = new Map();

  register(serviceName: string, instance: string): void {
    if (!this.services.has(serviceName)) {
      this.services.set(serviceName, new Set());
    }
    this.services.get(serviceName)!.add(instance);
  }

  deregister(serviceName: string, instance: string): void {
    this.services.get(serviceName)?.delete(instance);
  }

  discover(serviceName: string): string[] {
    return Array.from(this.services.get(serviceName) || []);
  }

  getHealthyInstance(serviceName: string): string | null {
    const instances = this.discover(serviceName);
    if (instances.length === 0) return null;
    
    // Round-robin selection / Chọn round-robin
    return instances[Math.floor(Math.random() * instances.length)];
  }
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
