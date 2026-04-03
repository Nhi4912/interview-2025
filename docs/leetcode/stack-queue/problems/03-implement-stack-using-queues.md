---
layout: page
title: "Implement Stack using Queues"
difficulty: Easy
category: Others
tags: [Stack, Queue, Design]
leetcode_url: "https://leetcode.com/problems/implement-stack-using-queues/"
---

# Implement Stack using Queues / Xây Dựng Stack Bằng Queue

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Single Queue Rotation
> **Frequency**: 📘 Tier 2 — Paired with Queue-via-Stacks; tests inverse design thinking
> **See also**: [Implement Queue using Stacks](./02-implement-queue-using-stacks.md) | [Design Circular Queue](./07-design-circular-queue.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng hàng đợi xe buýt — ai lên sau muốn ra trước (LIFO), nhưng hàng đợi chỉ cho rời từ đầu hàng (FIFO). Mỗi khi có người mới xếp vào, dịch chuyển cả hàng để người mới đứng đầu — tốn công nhưng sau đó lấy ra trong O(1).

- **Pattern Recognition:**
  - Signal: cần LIFO nhưng chỉ có FIFO → rotate queue on each push
  - Sau khi push mới, dequeue từng người và enqueue lại → phần tử mới lên đầu
  - push O(n), pop/top O(1) — ngược với Queue-via-Stacks trade-off

- **Visual — push(1), push(2), push(3), pop:**

```
push(1): queue=[1]

push(2): enqueue 2 → [1,2]
         rotate (size-1 times): dequeue 1, enqueue 1 → [2,1]
         queue=[2,1]  (front=top of stack ✓)

push(3): enqueue 3 → [2,1,3]
         rotate 2 times: move 2 then 1 to back → [3,2,1]
         queue=[3,2,1]

pop():   dequeue from front → 3 ✓  (LIFO!)
```

## Problem Description

Implement a LIFO stack using only queues. Operations: `push(x)`, `pop()`, `top()`, `empty()`.

```
Input:  ["MyStack","push","push","top","pop","empty"]
        [[]       ,[1]   ,[2]   ,[]  ,[]   ,[]     ]
Output: [null,    null,  null,  2,   2,    false   ]
```

## 📝 Interview Tips

1. **Rotate queue sau mỗi push: dequeue (n-1) phần tử rồi enqueue lại / Rotate on push: dequeue (n-1) elements back to end**
2. **Sau khi rotate, front của queue = top của stack / After rotation, queue front equals stack top**
3. **pop() và top() đều O(1) — không cần transfer / pop() and top() are O(1) after rotation approach**
4. **Two-queue approach: pop O(n), push O(1) — kém hơn single queue / Two-queue lazy: pop O(n) — worse trade-off**
5. **Ít khi hỏi follow-up về single element / Edge: single element push then pop immediately**

## Solutions

```typescript
/**

- Solution 1 — Two-Queue Lazy (push O(1), pop O(n))
- On pop: drain main queue except last element into temp
- Time: push O(1), pop/top O(n) | Space: O(n)
  */
  class MyStackLazy {
  private main: number[] = [];
  private temp: number[] = [];

push(x: number): void {
this.main.push(x);
}

pop(): number {
while (this.main.length > 1) this.temp.push(this.main.shift()!);
const val = this.main.shift()!;
[this.main, this.temp] = [this.temp, this.main];
return val;
}

top(): number {
while (this.main.length > 1) this.temp.push(this.main.shift()!);
const val = this.main[0];
this.temp.push(this.main.shift()!);
[this.main, this.temp] = [this.temp, this.main];
return val;
}

empty(): boolean { return this.main.length === 0; }
}

/**

- Solution 2 — Single Queue Rotate on Push (push O(n), pop O(1)) ✅ Recommended
- After each push, rotate queue so new element is at front
- Time: push O(n), pop/top O(1) | Space: O(n)
  */
  class MyStack {
  private queue: number[] = [];

push(x: number): void {
this.queue.push(x);
// Rotate all elements before x to the back
for (let i = 0; i < this.queue.length - 1; i++) {
this.queue.push(this.queue.shift()!);
}
}

pop(): number { return this.queue.shift()!; }
top(): number { return this.queue[0]; }
empty(): boolean { return this.queue.length === 0; }
}

// ── inline tests ──
// const s = new MyStack();
// s.push(1); s.push(2); s.top() // → 2 (LIFO top)
// s.pop() // → 2
// s.empty() // → false
// s.pop(); s.empty() // → true
```

## 🔗 Related Problems

- [LC #232 Implement Queue using Stacks](./02-implement-queue-using-stacks.md) — inverse problem (FIFO via LIFO)
- [LC #622 Design Circular Queue](./07-design-circular-queue.md) — fixed-capacity queue design
- [LC #155 Min Stack](https://leetcode.com/problems/min-stack/) — stack design with O(1) min tracking
- [LC #716 Max Stack](https://leetcode.com/problems/max-stack/) — stack with max retrieval
