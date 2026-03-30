---
layout: page
title: "Implement Queue using Stacks"
difficulty: Easy
category: Others
tags: [Stack, Queue, Design]
leetcode_url: "https://leetcode.com/problems/implement-queue-using-stacks/"
---

# Implement Queue using Stacks / Xây Dựng Queue Bằng Stack

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Stacks (Lazy Transfer)
> **Frequency**: 📘 Tier 2 — Classic design interview; tests FIFO vs LIFO understanding
> **See also**: [Implement Stack using Queues](./03-implement-stack-using-queues.md) | [Design Circular Queue](./07-design-circular-queue.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng quán trà sữa có hai chồng ly (stack). Khách xếp hàng FIFO nhưng ly chỉ được xếp chồng LIFO. Nhân viên đổ ngược chồng ly đầu sang chồng thứ hai — tự nhiên đảo thứ tự, lấy được ly khách đầu tiên. Chỉ đổ khi chồng thứ hai hết sạch.

- **Pattern Recognition:**
  - Signal: cần FIFO nhưng chỉ có LIFO → Two Stack reversal
  - Lazy transfer: chỉ chuyển khi `outputStack` rỗng → mỗi phần tử di chuyển đúng 1 lần → amortized O(1)
  - Eager alternative: transfer ngay sau mỗi push → O(n) push, O(1) pop

- **Visual — push(1,2,3) then pop twice:**

```
push(1,2,3):  inputStack=[1,2,3]  outputStack=[]

pop() called — outputStack empty → transfer all:
              inputStack=[]        outputStack=[3,2,1]
              outputStack.pop() → 1 ✓  (FIFO front!)

pop() again:  no transfer (outputStack still has items)
              outputStack=[3,2]
              outputStack.pop() → 2 ✓
```

## Problem Description

Implement a FIFO queue using only two stacks. Operations: `push(x)`, `pop()`, `peek()`, `empty()`.

```
Input:  ["MyQueue","push","push","peek","pop","empty"]
        [[]       ,[1]   ,[2]   ,[]   ,[]   ,[]    ]
Output: [null,    null,  null,  1,    1,    false  ]
```

## 📝 Interview Tips

1. **Push vào inputStack, chỉ transfer khi outputStack rỗng / Push to input; transfer lazily when output is empty**
2. **Amortized O(1): mỗi phần tử chỉ push và pop mỗi stack đúng 1 lần / Each element crosses each stack exactly once**
3. **empty() phải check CẢ HAI stack / empty() must check both stacks — common mistake**
4. **Eager vs Lazy: Lazy tốt hơn vì push thường nhiều hơn pop / Lazy preferred since push typically outnumbers pop**
5. **Follow-up: O(1) worst-case pop không thể đạt được với 2 stack / O(1) worst-case pop is impossible with only 2 stacks**

## Solutions

{% raw %}
/\*\*

- Solution 1 — Eager Transfer (push O(n), pop O(1))
- Brute approach: maintain queue order after every push
- Time: push O(n), pop/peek O(1) | Space: O(n)
  \*/
  class MyQueueEager {
  private stack: number[] = [];

push(x: number): void {
const tmp: number[] = [];
while (this.stack.length > 0) tmp.push(this.stack.pop()!);
this.stack.push(x);
while (tmp.length > 0) this.stack.push(tmp.pop()!);
}

pop(): number { return this.stack.pop()!; }
peek(): number { return this.stack[this.stack.length - 1]; }
empty(): boolean { return this.stack.length === 0; }
}

/\*\*

- Solution 2 — Lazy Transfer (all ops amortized O(1)) ✅ Recommended
- Only transfer from input→output when output is empty
- Time: push O(1), pop/peek O(1) amortized | Space: O(n)
  \*/
  class MyQueue {
  private inputStack: number[] = [];
  private outputStack: number[] = [];

push(x: number): void {
this.inputStack.push(x);
}

private transfer(): void {
if (this.outputStack.length === 0) {
while (this.inputStack.length > 0) {
this.outputStack.push(this.inputStack.pop()!);
}
}
}

pop(): number {
this.transfer();
return this.outputStack.pop()!;
}

peek(): number {
this.transfer();
return this.outputStack[this.outputStack.length - 1];
}

empty(): boolean {
return this.inputStack.length === 0 && this.outputStack.length === 0;
}
}

// ── inline tests ──
// const q = new MyQueue();
// q.push(1); q.push(2); q.peek() // → 1 (front of queue)
// q.pop() // → 1
// q.empty() // → false
// q.pop(); q.empty() // → true
{% endraw %}

## 🔗 Related Problems

- [LC #225 Implement Stack using Queues](./03-implement-stack-using-queues.md) — inverse problem (LIFO via FIFO)
- [LC #622 Design Circular Queue](./07-design-circular-queue.md) — extends to fixed-capacity ring buffer
- [LC #155 Min Stack](https://leetcode.com/problems/min-stack/) — design with auxiliary state tracking
- [LC #346 Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream/) — queue variant with fixed window
