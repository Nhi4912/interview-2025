---
layout: page
title: "Design Circular Deque"
difficulty: Medium
category: Others
tags: [Deque, Design, Array]
leetcode_url: "https://leetcode.com/problems/design-circular-deque/"
---

# Design Circular Deque / Thiết Kế Deque Vòng Tròn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Ring Buffer (Double-Ended)
> **Frequency**: 📘 Tier 3 — Extension of circular queue; tests bidirectional pointer arithmetic
> **See also**: [Design Circular Queue](./07-design-circular-queue.md) | [Design Browser History](./10-design-browser-history.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như toa xe lửa hai đầu máy — hành khách có thể lên xuống ở cả phía trước lẫn phía sau. Số ghế cố định và được dùng theo vòng tròn. Khi thêm phía trước, con trỏ `front` lùi lại (wrap bằng modulo); khi thêm phía sau, `rear` tiến tới. Cả hai chiều đều O(1).

- **Pattern Recognition:**
  - Signal: queue cố định với thao tác ở cả hai đầu → double-ended ring buffer
  - insertFront: `front = (front - 1 + capacity) % capacity` (lùi lại, tránh âm)
  - insertLast: `rear  = (rear  + 1) % capacity` (tiến tới)
  - Giống circular queue nhưng thêm phép di chuyển ngược chiều

- **Visual — insertLast(1,2), insertFront(3), deleteLast(), insertFront(4) với cap=3:**

```
Initial:   [_,_,_]  front=0, rear=0, size=0

insertLast(1):  [1,_,_]  f=0, r=0, size=1
insertLast(2):  [1,2,_]  f=0, r=1, size=2
insertFront(3): front=(0-1+3)%3=2 → [1,2,3]  f=2, r=1, size=3  isFull!
getRear()=2, getFront()=3

deleteLast():   rear=(1-1+3)%3=0  → [1,_,3]  f=2, r=0, size=2
insertFront(4): front=(2-1+3)%3=1 → [1,4,3]  f=1, r=0, size=3
getFront()=4  ✓
```

## Problem Description

Design a circular deque of capacity `k`. Support: `insertFront(val)`, `insertLast(val)`, `deleteFront()`, `deleteLast()`, `getFront()`, `getRear()`, `isEmpty()`, `isFull()`.

```
Input:  ["MyCircularDeque","insertLast","insertLast","insertFront","insertFront","getRear","isFull","deleteLast","insertFront","getFront"]
        [[3],             ,[1]         ,[2]         ,[3]          ,[4]          ,[]      ,[]      ,[]          ,[4]         ,[]        ]
Output: [null,            true,        true,        true,         false,        2,       true,    true,        true,        4         ]
```

## 📝 Interview Tips

1. **insertFront lùi pointer: `(front-1+cap)%cap` để tránh âm / insertFront moves back: add cap before mod to avoid negative**
2. **Trường hợp `size==1`: xóa front hoặc rear đều reset về cùng 1 vị trí / When size==1: both front and rear reset to same position**
3. **Dùng `size` thay vì so sánh front==rear như circular queue / Use size counter, same reason as circular queue**
4. **Kiểm tra isFull() trước mọi insert; isEmpty() trước mọi delete / Guard every insert with isFull(), every delete with isEmpty()**
5. **Deque = Double-Ended Queue; không phải "dequeue" (remove) / Deque means double-ended queue, not the verb "dequeue"**

## Solutions

```typescript
/**

- Design Circular Deque — Array with Front/Rear Pointers + Size
- Time: O(1) all operations | Space: O(k)
  */
  class MyCircularDeque {
  private deque: number[];
  private front: number = 0;
  private rear: number = 0;
  private size: number = 0;
  private capacity: number;

constructor(k: number) {
this.capacity = k;
this.deque = new Array(k);
}

insertFront(value: number): boolean {
if (this.isFull()) return false;
if (this.size > 0) {
this.front = (this.front - 1 + this.capacity) % this.capacity;
}
this.deque[this.front] = value;
this.size++;
return true;
}

insertLast(value: number): boolean {
if (this.isFull()) return false;
if (this.size > 0) {
this.rear = (this.rear + 1) % this.capacity;
}
this.deque[this.rear] = value;
this.size++;
return true;
}

deleteFront(): boolean {
if (this.isEmpty()) return false;
if (this.size > 1) this.front = (this.front + 1) % this.capacity;
this.size--;
return true;
}

deleteLast(): boolean {
if (this.isEmpty()) return false;
if (this.size > 1) this.rear = (this.rear - 1 + this.capacity) % this.capacity;
this.size--;
return true;
}

getFront(): number { return this.isEmpty() ? -1 : this.deque[this.front]; }
getRear(): number { return this.isEmpty() ? -1 : this.deque[this.rear]; }
isEmpty(): boolean { return this.size === 0; }
isFull(): boolean { return this.size === this.capacity; }
}

// ── inline tests ──
// const d = new MyCircularDeque(3);
// d.insertLast(1); d.insertLast(2); d.insertFront(3) // true, true, true
// d.insertFront(4) // false (full)
// d.getRear() // → 2
// d.deleteLast(); d.insertFront(4) // true, true
// d.getFront() // → 4
```

## 🔗 Related Problems

- [LC #622 Design Circular Queue](./07-design-circular-queue.md) — single-ended version (simpler)
- [LC #641 Design Circular Deque](https://leetcode.com/problems/design-circular-deque/) — this problem
- [LC #1670 Design Front Middle Back Queue](https://leetcode.com/problems/design-front-middle-back-queue/) — three-position variant
- [LC #239 Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) — classic deque application
