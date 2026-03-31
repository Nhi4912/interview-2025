---
layout: page
title: "Design Circular Queue"
difficulty: Medium
category: Others
tags: [Queue, Design, Array]
leetcode_url: "https://leetcode.com/problems/design-circular-queue/"
---

# Design Circular Queue / Thiết Kế Hàng Đợi Vòng Tròn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Ring Buffer (Array + Two Pointers)
> **Frequency**: 📘 Tier 2 — Foundation for circular data structures; tested in system design rounds
> **See also**: [Design Circular Deque](./08-design-circular-deque.md) | [Implement Queue using Stacks](./02-implement-queue-using-stacks.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như bãi đỗ xe vòng tròn trong siêu thị — xe vào từ một đầu, ra từ đầu kia. Khi đầy thì không nhận thêm. Khi một xe rời đi, chỗ trống được tái sử dụng ngay mà không cần dồn xe lại. Chìa khóa là con trỏ `front` và `rear` di chuyển theo vòng tròn qua phép toán modulo.

- **Pattern Recognition:**
  - Signal: queue với capacity cố định, cần tái sử dụng không gian → ring buffer
  - `rear = (rear + 1) % capacity` để wrap around khi đến cuối mảng
  - Track `size` riêng biệt để phân biệt empty vs full (cả hai đều có front==rear)

- **Visual — enQueue(1,2,3), deQueue(), enQueue(4) với cap=3:**

```
Initial:  [_,_,_]  front=0, rear=-1, size=0

enQueue(1): rear=(0)%3=0 → [1,_,_]  size=1
enQueue(2): rear=1       → [1,2,_]  size=2
enQueue(3): rear=2       → [1,2,3]  size=3  isFull=true

deQueue():  front=(0+1)%3=1 → [_,2,3]  size=2
enQueue(4): rear=(2+1)%3=0  → [4,2,3]  size=3  (wraps to index 0!)
Front()=2  Rear()=4
```

## Problem Description

Design a circular queue of capacity `k`. Support: `enQueue(val)`, `deQueue()`, `Front()`, `Rear()`, `isEmpty()`, `isFull()`.

```
Input:  ["MyCircularQueue","enQueue","enQueue","enQueue","enQueue","Rear","isFull","deQueue","enQueue","Rear"]
        [[3],             ,[1]      ,[2]      ,[3]      ,[4]      ,[]   ,[]      ,[]      ,[4]     ,[]    ]
Output: [null,            true,     true,     true,     false,    3,    true,    true,    true,    4     ]
```

## 📝 Interview Tips

1. **Dùng `size` để track empty/full thay vì so sánh front==rear / Use a size counter instead of front==rear comparison**
2. **Rear wrap: `(rear + 1) % capacity`; Front wrap: `(front + 1) % capacity` / Both use modulo for wrapping**
3. **Khởi tạo rear=-1 (trước vị trí đầu tiên hợp lệ) / Initialize rear=-1 to indicate nothing inserted yet**
4. **isFull = size==capacity; isEmpty = size==0 — không dùng so sánh pointer / Check size, not pointer equality**
5. **Linked list alternative: O(1) all ops but O(k) space vs array O(1) all ops O(k) space — same complexity**
6. **Circular queue là cơ sở cho ring buffer trong OS/networking / Ring buffer underpins OS I/O and networking buffers**

## Solutions

```typescript
/**

- Design Circular Queue — Array with Front/Rear Pointers + Size
- Time: O(1) all operations | Space: O(k)
  */
  class MyCircularQueue {
  private queue: number[];
  private front: number = 0;
  private rear: number = -1;
  private size: number = 0;
  private capacity: number;

constructor(k: number) {
this.capacity = k;
this.queue = new Array(k);
}

enQueue(value: number): boolean {
if (this.isFull()) return false;
this.rear = (this.rear + 1) % this.capacity;
this.queue[this.rear] = value;
this.size++;
return true;
}

deQueue(): boolean {
if (this.isEmpty()) return false;
this.front = (this.front + 1) % this.capacity;
this.size--;
return true;
}

Front(): number { return this.isEmpty() ? -1 : this.queue[this.front]; }
Rear(): number { return this.isEmpty() ? -1 : this.queue[this.rear]; }
isEmpty(): boolean { return this.size === 0; }
isFull(): boolean { return this.size === this.capacity; }
}

// ── inline tests ──
// const q = new MyCircularQueue(3);
// q.enQueue(1); q.enQueue(2); q.enQueue(3) // true, true, true
// q.enQueue(4) // false (full)
// q.Rear() // → 3
// q.deQueue(); q.enQueue(4) // true, true
// q.Rear() // → 4
```

## 🔗 Related Problems

- [LC #641 Design Circular Deque](./08-design-circular-deque.md) — extends to double-ended circular buffer
- [LC #232 Implement Queue using Stacks](./02-implement-queue-using-stacks.md) — queue design via stacks
- [LC #1670 Design Front Middle Back Queue](https://leetcode.com/problems/design-front-middle-back-queue/) — three-position queue
- [LC #933 Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/) — sliding window queue application
