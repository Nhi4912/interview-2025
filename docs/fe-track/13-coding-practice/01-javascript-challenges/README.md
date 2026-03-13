# JavaScript Challenges


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

> Implement các JavaScript APIs và utilities từ scratch. Đây là dạng bài phổ biến nhất trong phỏng vấn.

---

## 📋 Problem List

| # | Problem | Difficulty | Company | Time |
|---|---------|------------|---------|------|
| 1 | [Implement Promise](./implement-promise.md) | 🔴 Hard | All | 45 min |
| 2 | [Array Methods](./implement-array-methods.md) | 🟢 Easy | All | 20 min |
| 3 | [Debounce & Throttle](./debounce-throttle.md) | 🟢 Easy | All | 15 min |
| 4 | Deep Clone | 🟡 Medium | Google, Meta | 25 min |
| 5 | [Event Emitter](./event-emitter.md) | 🟡 Medium | All | 25 min |
| 6 | Curry & Compose | 🟡 Medium | All | 20 min |
| 7 | Memoize Function | 🟢 Easy | All | 15 min |
| 8 | Promise.all / race | 🟡 Medium | All | 20 min |
| 9 | Flatten Object/Array | 🟡 Medium | All | 20 min |
| 10 | Async Utilities | 🔴 Hard | Meta, Netflix | 30 min |

---

## 🎯 Quick Reference: Implementation Patterns

```javascript
// Pattern 1: Closure for state
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count,
  };
}

// Pattern 2: Function chaining
function chain(value) {
  return {
    value,
    map: (fn) => chain(fn(value)),
    filter: (fn) => chain(fn(value) ? value : undefined),
    get: () => value,
  };
}

// Pattern 3: Async handling
async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries - 1) throw e;
    }
  }
}
```

---

## 📝 Practice Order

### Week 1: Fundamentals
1. Array Methods (map, filter, reduce)
2. Debounce
3. Throttle
4. Memoize

### Week 2: Intermediate
5. Deep Clone
6. Event Emitter
7. Flatten
8. Curry & Compose

### Week 3: Advanced
9. Promise.all, race, any
10. Full Promise implementation
11. Async utilities (retry, timeout, queue)

---

> **Quay lại:** [Coding Practice](../README.md)
