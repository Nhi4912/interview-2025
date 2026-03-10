# System Design Interview Questions / Câu Hỏi Phỏng Vấn Thiết Kế Hệ Thống
## Interview Practice - Chapter 3 / Thực Hành Phỏng Vấn - Chương 3

[Back to Table of Contents](../00-table-of-contents.md)

---

## Design URL Shortener

### Requirements / Yêu Cầu
- Shorten long URLs / Rút ngắn URL dài
- Redirect to original URL / Chuyển hướng đến URL gốc
- Track analytics / Theo dõi phân tích
- Handle 100M URLs / Xử lý 100M URL

### Solution / Giải Pháp

```typescript
class URLShortener {
  private urlMap = new Map<string, string>();
  private reverseMap = new Map<string, string>();
  private counter = 0;
  private baseUrl = 'https://short.url/';

  private base62Encode(num: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    
    while (num > 0) {
      result = chars[num % 62] + result;
      num = Math.floor(num / 62);
    }
    
    return result || '0';
  }

  shorten(longUrl: string): string {
    // Check if already shortened / Kiểm tra đã rút ngắn chưa
    if (this.reverseMap.has(longUrl)) {
      return this.baseUrl + this.reverseMap.get(longUrl);
    }

    // Generate short code / Tạo mã ngắn
    const shortCode = this.base62Encode(++this.counter);
    
    // Store mappings / Lưu ánh xạ
    this.urlMap.set(shortCode, longUrl);
    this.reverseMap.set(longUrl, shortCode);
    
    return this.baseUrl + shortCode;
  }

  expand(shortUrl: string): string | null {
    const shortCode = shortUrl.replace(this.baseUrl, '');
    return this.urlMap.get(shortCode) || null;
  }
}

// Usage / Sử dụng
const shortener = new URLShortener();
const short = shortener.shorten('https://example.com/very/long/url');
console.log(short); // https://short.url/1
const original = shortener.expand(short);
console.log(original); // https://example.com/very/long/url
```

---

## Design Rate Limiter

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>();
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isAllowed(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests / Xóa yêu cầu cũ
    const validRequests = userRequests.filter(
      time => now - time < this.windowMs
    );
    
    if (validRequests.length < this.limit) {
      validRequests.push(now);
      this.requests.set(userId, validRequests);
      return true;
    }
    
    return false;
  }
}

// Usage: 5 requests per minute / Sử dụng: 5 yêu cầu mỗi phút
const limiter = new RateLimiter(5, 60000);
console.log(limiter.isAllowed('user1')); // true
```

---

## Design Cache System

```typescript
class CacheSystem<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  set(key: K, value: V, ttlMs: number): void {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Evict oldest / Loại bỏ cũ nhất
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });
  }

  get(key: K): V | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
