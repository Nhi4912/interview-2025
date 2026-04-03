---
layout: page
title: "Implement Queue using Stacks"
difficulty: Easy
category: Design
tags: [Design, Stack, Queue]
leetcode_url: "https://leetcode.com/problems/implement-queue-using-stacks/"
---

# Implement Queue using Stacks / Cài Đặt Queue Bằng Stacks

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Stacks (Lazy Transfer)
> **Frequency**: 📘 Tier 3
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese)**: Hai thùng thư: `inbox` nhận thư, `outbox` phát thư. Khi `outbox` rỗng và cần lấy thư, đổ toàn bộ `inbox` sang `outbox` — thứ tự bị đảo ngược. Thư vào trước (đáy inbox) lên đỉnh outbox và được lấy ra trước → FIFO.

**Pattern Recognition**: Stack đảo thứ tự một lần. Hai stack đảo hai lần = thứ tự ban đầu = FIFO. **Lazy transfer** (chỉ đổ khi outbox rỗng) → O(1) amortized.

**ASCII Visual**:

```
push(1), push(2), push(3):
inbox=[1,2,3]  outbox=[]    (3 on top)

peek() → outbox empty → TRANSFER:
inbox=[]   outbox=[3,2,1]   (1 on top = front of queue)

peek()→1   pop()→1   outbox=[3,2]
push(4): inbox=[4]   outbox=[3,2]
pop() → outbox not empty → pop()→2  ✓ FIFO maintained
```

## Problem Description

Implement FIFO queue using only two stacks. Support `push(x)`, `pop()`, `peek()`, `empty()`.

**Example**:

```
Input:  ["MyQueue","push","push","peek","pop","empty"]
        [[],       [1],   [2],   [],    [],   []     ]
Output: [null,     null,  null,  1,     1,    false  ]
```

**Constraints**: `1 ≤ x ≤ 9`, ≤ 100 calls, pop/peek always called on non-empty queue.

## 📝 Interview Tips

- **Amortized O(1) là trọng tâm**: Mỗi phần tử di chuyển inbox→outbox đúng 1 lần → tổng O(2n) cho n ops → O(1) amortized.
- **Amortized O(1)**: Each element is pushed once and transferred once — total work O(2n) = O(1) amortized per op.
- **Lazy, not eager**: Chỉ transfer khi `outbox` rỗng — không transfer sau mỗi push.
- **peek() sets up pop()**: Sau `peek()`, outbox đã được fill → `pop()` ngay sau đó là O(1) guaranteed.
- **Follow-up**: "Worst-case O(1) for all ops?" — không thể với stacks đơn giản; requires more complex structure.
- **Inverse problem**: LC 225 (Implement Stack using Queues) dùng BFS queue để simulate stack.

## Solutions

```typescript
/**

- Implement Queue using Stacks — LeetCode #232
-
- Two-stack lazy transfer: amortized O(1) per operation.
- Each element moves inbox→outbox exactly once across all operations.
-
- Time: push O(1), pop/peek O(1) amortized (O(n) worst) | Space: O(n)
  */
  class MyQueue {
  private inbox: number[] = []; // receives new elements
  private outbox: number[] = []; // serves pop/peek requests

/*_ Push element to back of queue. / Thêm phần tử vào cuối hàng đợi. _/
push(x: number): void {
this.inbox.push(x);
}

/**

- Move all elements from inbox to outbox, but only when outbox is empty.
- Chuyển inbox sang outbox, chỉ khi outbox rỗng.
- Reversal restores FIFO order: bottom of inbox → top of outbox.
  */
  private transfer(): void {
  if (this.outbox.length === 0) {
  while (this.inbox.length > 0) {
  this.outbox.push(this.inbox.pop()!);
  }
  }
  }

/*_ Remove and return front element. / Xóa và trả về phần tử đầu hàng. _/
pop(): number {
this.transfer();
return this.outbox.pop()!;
}

/*_ Return front element without removing. / Xem phần tử đầu không xóa. _/
peek(): number {
this.transfer();
return this.outbox[this.outbox.length - 1];
}

empty(): boolean {
return this.inbox.length === 0 && this.outbox.length === 0;
}
}

// Inline tests — LeetCode example
const q = new MyQueue();
q.push(1); q.push(2);
console.assert(q.peek() === 1, 'peek returns front element');
console.assert(q.pop() === 1, 'pop removes front element');
console.assert(q.empty() === false);

// FIFO order across push/pop interleaved
q.push(3);
console.assert(q.pop() === 2, 'FIFO: 2 before 3');
console.assert(q.pop() === 3);
console.assert(q.empty() === true);

// peek() is idempotent — does not consume element
const q2 = new MyQueue();
q2.push(5);
console.assert(q2.peek() === 5);
console.assert(q2.peek() === 5, 'second peek still returns 5');
console.assert(q2.pop() === 5, 'pop after peek returns same element');
```

## 🔗 Related Problems

- [LC 225 — Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/) — inverse problem
- [LC 155 — Min Stack](https://leetcode.com/problems/min-stack/) — stack augmentation
- [LC 622 — Design Circular Queue](https://leetcode.com/problems/design-circular-queue/) — queue design
- [LC 641 — Design Circular Deque](https://leetcode.com/problems/design-circular-deque/) — deque design
