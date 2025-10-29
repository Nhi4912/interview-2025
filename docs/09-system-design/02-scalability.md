# Scalability Patterns / Mẫu Khả Năng Mở Rộng
## System Design - Chapter 2 / Thiết Kế Hệ Thống - Chương 2

[Back to Table of Contents](../00-table-of-contents.md)

---

## Horizontal vs Vertical Scaling

### Vertical Scaling / Mở Rộng Dọc
- Add more resources to single server / Thêm tài nguyên cho server đơn
- Limited by hardware / Giới hạn bởi phần cứng
- Simpler but has ceiling / Đơn giản hơn nhưng có giới hạn

### Horizontal Scaling / Mở Rộng Ngang
- Add more servers / Thêm nhiều server
- Unlimited scaling potential / Tiềm năng mở rộng không giới hạn
- Requires load balancing / Yêu cầu cân bằng tải

## Load Balancing

```typescript
// Round Robin Load Balancer / Cân bằng tải Round Robin
class LoadBalancer {
  private servers: string[];
  private currentIndex = 0;

  constructor(servers: string[]) {
    this.servers = servers;
  }

  getNextServer(): string {
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return server;
  }
}

// Usage / Sử dụng
const lb = new LoadBalancer([
  'server1.example.com',
  'server2.example.com',
  'server3.example.com'
]);

async function handleRequest(req: Request) {
  const server = lb.getNextServer();
  return fetch(`https://${server}/api`, {
    method: req.method,
    body: req.body
  });
}
```

## Caching Strategies

```typescript
// Cache-Aside Pattern / Mẫu Cache-Aside
class CacheAside<T> {
  private cache = new Map<string, T>();

  async get(key: string, fetchFn: () => Promise<T>): Promise<T> {
    // Check cache / Kiểm tra cache
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Fetch from source / Lấy từ nguồn
    const data = await fetchFn();
    
    // Store in cache / Lưu vào cache
    this.cache.set(key, data);
    
    return data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }
}

// Usage / Sử dụng
const cache = new CacheAside<User>();

async function getUser(id: string): Promise<User> {
  return cache.get(`user:${id}`, async () => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  });
}
```

## Database Sharding

```typescript
// Consistent Hashing for Sharding / Băm nhất quán cho Sharding
class ConsistentHash {
  private ring: Map<number, string> = new Map();
  private sortedKeys: number[] = [];

  addNode(node: string, virtualNodes: number = 150): void {
    for (let i = 0; i < virtualNodes; i++) {
      const hash = this.hash(`${node}:${i}`);
      this.ring.set(hash, node);
      this.sortedKeys.push(hash);
    }
    this.sortedKeys.sort((a, b) => a - b);
  }

  getNode(key: string): string {
    const hash = this.hash(key);
    
    // Find first node >= hash / Tìm node đầu tiên >= hash
    for (const nodeHash of this.sortedKeys) {
      if (nodeHash >= hash) {
        return this.ring.get(nodeHash)!;
      }
    }
    
    // Wrap around / Quay vòng
    return this.ring.get(this.sortedKeys[0])!;
  }

  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

// Usage / Sử dụng
const sharding = new ConsistentHash();
sharding.addNode('shard1');
sharding.addNode('shard2');
sharding.addNode('shard3');

function getUserShard(userId: string): string {
  return sharding.getNode(userId);
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
