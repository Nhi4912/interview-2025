---
layout: page
title: "Event Emitter"
difficulty: Medium
category: Others
tags: []
leetcode_url: "https://leetcode.com/problems/event-emitter"
---

# Event Emitter / Bộ Phát Sự Kiện

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: OOP Design — Observer/Pub-Sub
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Publish/Subscribe Pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) | [Design HashMap](https://leetcode.com/problems/design-hashmap)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hệ thống chuông báo — nhiều người đăng ký nhận thông báo (subscribe), khi sự kiện xảy ra (emit) thì tất cả người đăng ký đều được gọi. Unsubscribe giống huỷ đăng ký báo.

**Pattern Recognition:**

- Signal: "subscribe/unsubscribe/emit events" → **Observer / Event Bus**
- Cần Map từ eventName → list of callbacks
- Key insight: trả về object `{ unsubscribe }` từ `subscribe` để caller có thể huỷ đăng ký

**Visual — Event bus structure:**

```
EventEmitter {
  listeners: Map {
    "click" → [cbA, cbB, cbC],
    "hover" → [cbD],
  }
}

emitter.subscribe("click", cbA) → {unsubscribe: () => remove cbA}
emitter.emit("click", [1,2])    → [cbA(1,2), cbB(1,2), cbC(1,2)]
unsubscribe()                   → listeners["click"] = [cbB, cbC]
```

---

## Problem Description

Implement an `EventEmitter` class supporting:

- `subscribe(eventName, callback)` → returns `{ unsubscribe() }`. Multiple callbacks can be subscribed to the same event.
- `emit(eventName, args?)` → calls all subscribers in subscription order, returns array of their return values. Empty array if none. ([LeetCode 2694](https://leetcode.com/problems/event-emitter))

**Example:** subscribe "firstEvent" with `x => x+1`, emit with `[5]` → `[6]`

Constraints: `1 <= actions.length <= 1000`, valid action types only

---

## 📝 Interview Tips

1. **Return object**: "`subscribe` trả về `{unsubscribe}`, không phải boolean" / Return an unsubscribe handle, not a plain function
2. **Multiple subs**: "Cùng event, cùng callback có thể subscribe nhiều lần" / Same callback subscribed multiple times → multiple entries
3. **Unsubscribe**: "Chỉ xoá 1 instance khi unsubscribe, không xoá tất cả" / Remove one registration at a time
4. **Emit order**: "Gọi callbacks theo thứ tự subscription" / FIFO order for callbacks
5. **Empty emit**: "Nếu không có subscriber → trả về `[]`" / No subscribers → return empty array

---

## Solutions

```typescript
/**
 * Solution 1: Map<string, Function[]> with splice for unsubscribe
 * Time: subscribe O(1), emit O(k), unsubscribe O(k) — k = number of subscribers
 * Space: O(total subscriptions)
 */
class EventEmitter {
  private listeners: Map<string, ((...args: unknown[]) => unknown)[]>;

  constructor() {
    this.listeners = new Map();
  }

  subscribe(
    eventName: string,
    callback: (...args: unknown[]) => unknown,
  ): { unsubscribe: () => void } {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    const callbacks = this.listeners.get(eventName)!;
    callbacks.push(callback);

    return {
      unsubscribe: () => {
        const idx = callbacks.indexOf(callback);
        if (idx !== -1) callbacks.splice(idx, 1);
      },
    };
  }

  emit(eventName: string, args: unknown[] = []): unknown[] {
    const callbacks = this.listeners.get(eventName);
    if (!callbacks || callbacks.length === 0) return [];
    // Snapshot to avoid mutation during emit
    return [...callbacks].map((cb) => cb(...args));
  }
}

/**
 * Solution 2: Using Set-like approach with unique wrapper objects (handles same-fn multi-subscribe)
 * Time: subscribe O(1), emit O(k), unsubscribe O(1) with wrapper map
 * Space: O(total subscriptions)
 */
class EventEmitterV2 {
  private listeners: Map<string, Map<symbol, (...args: unknown[]) => unknown>>;

  constructor() {
    this.listeners = new Map();
  }

  subscribe(
    eventName: string,
    callback: (...args: unknown[]) => unknown,
  ): { unsubscribe: () => void } {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Map());
    }
    const callbacks = this.listeners.get(eventName)!;
    const key = Symbol(); // unique key per subscription
    callbacks.set(key, callback);

    return {
      unsubscribe: () => {
        callbacks.delete(key);
      },
    };
  }

  emit(eventName: string, args: unknown[] = []): unknown[] {
    const callbacks = this.listeners.get(eventName);
    if (!callbacks || callbacks.size === 0) return [];
    return [...callbacks.values()].map((cb) => cb(...args));
  }
}

// === Test Cases ===
const emitter = new EventEmitter();
const sub1 = emitter.subscribe("click", (x: unknown) => (x as number) * 2);
const sub2 = emitter.subscribe("click", (x: unknown) => (x as number) + 10);
console.log(emitter.emit("click", [5])); // [10, 15]
sub1.unsubscribe();
console.log(emitter.emit("click", [5])); // [15]
console.log(emitter.emit("hover", [])); // []

// Same callback subscribed twice
const emitter2 = new EventEmitter();
const cb = (x: unknown) => (x as number) + 1;
const s1 = emitter2.subscribe("e", cb);
emitter2.subscribe("e", cb);
console.log(emitter2.emit("e", [1])); // [2, 2]
s1.unsubscribe();
console.log(emitter2.emit("e", [1])); // [2] (one removed)
```

---

## 🔗 Related Problems

- [Design HashMap](https://leetcode.com/problems/design-hashmap) — same pattern: class with map-based storage
- [Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues) — OOP design
- [LRU Cache](https://leetcode.com/problems/lru-cache) — complex class design with O(1) ops
- [Design Twitter](https://leetcode.com/problems/design-twitter) — pub-sub at scale
- [Event Emitter — LeetCode](https://leetcode.com/problems/event-emitter) — problem page
