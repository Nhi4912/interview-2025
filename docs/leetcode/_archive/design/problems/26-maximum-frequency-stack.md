---
layout: page
title: "Maximum Frequency Stack"
difficulty: Hard
category: Design
tags: [Hash Table, Stack, Design, Ordered Set]
leetcode_url: "https://leetcode.com/problems/maximum-frequency-stack"
---

# Maximum Frequency Stack / Stack Tần Suất Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Stack Design — Frequency + Group Map
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [LFU Cache](https://leetcode.com/problems/lfu-cache) | [Design a Stack With Increment Operation](https://leetcode.com/problems/design-a-stack-with-increment-operation)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống DJ chọn bài — luôn phát bài được yêu cầu nhiều nhất; nếu hòa, phát bài được yêu cầu gần đây nhất (LIFO tiebreak).

**Pattern Recognition:**

- Signal: "pop most frequent, LIFO tiebreak" → **Two maps: freq[] + group[]**
- `freq`: element → how many times pushed
- `group`: frequency → stack of elements at that frequency (LIFO gives tiebreak)
- Key insight: khi push(x), freq[x]++ → append x to group[freq[x]]; maxFreq tracks global max

**Visual — Push/pop simulation:**

```
push(5): freq={5:1},  group={1:[5]},        maxFreq=1
push(7): freq={5:1,7:1}, group={1:[5,7]},  maxFreq=1
push(5): freq={5:2,7:1}, group={1:[5,7],2:[5]}, maxFreq=2
push(7): freq={5:2,7:2}, group={1:[5,7],2:[5,7]}, maxFreq=2
push(4): freq={5:2,7:2,4:1}, group={1:[5,7,4],2:[5,7]}, maxFreq=2
push(5): freq={5:3,7:2,4:1}, group={...,3:[5]}, maxFreq=3

pop() → group[3] top = 5, freq[5]=2, maxFreq stays 3→2? No: group[3] empty → maxFreq=2 → return 5
pop() → group[2] top = 7, freq[7]=1 → return 7
pop() → group[2] top = 5, freq[5]=1 → return 5
```

---

## Problem Description

Design a stack-like data structure that:

- `push(val)`: Push integer `val` onto the stack.
- `pop()`: Remove and return the most frequently pushed element. If tie, return the most recently pushed among them. ([LeetCode 895](https://leetcode.com/problems/maximum-frequency-stack))

**Example:** push 5,7,5,7,4,5 → pop returns 5 (freq=3), then 7 (freq=2, most recent), then 5 (freq=2).

Constraints: `0 <= val <= 1e9`, at most `2 * 1e4` calls, pop on non-empty stack only.

---

## 📝 Interview Tips

1. **Two maps key**: "`freq` map + `group` map (freq → stack of elements)" / The pair of maps is the crux
2. **maxFreq tracking**: "Tăng maxFreq khi push, giảm 1 khi group[maxFreq] rỗng sau pop" / Only decrement by 1 on pop
3. **LIFO tiebreak**: "group[f] là array → push/pop từ cuối → automatically LIFO" / Array end = LIFO
4. **Never increase maxFreq on pop**: "Sau pop, maxFreq chỉ giảm 0 hoặc 1, không bao giờ tăng" / Monotone decrease
5. **Complexity**: "Push O(1), pop O(1) — both amortized" / Both operations are O(1)

---

## Solutions

```typescript
/**
 * Solution 1: Brute force — scan all elements on pop
 * Time: push O(1), pop O(n)
 * Space: O(n)
 */
class FreqStackBrute {
  private elements: number[] = [];

  push(val: number): void {
    this.elements.push(val);
  }

  pop(): number {
    // Count frequencies
    const freq = new Map<number, number>();
    for (const x of this.elements) freq.set(x, (freq.get(x) ?? 0) + 1);
    const maxF = Math.max(...freq.values());
    // Find last occurrence of any element with maxF
    for (let i = this.elements.length - 1; i >= 0; i--) {
      if (freq.get(this.elements[i]) === maxF) {
        this.elements.splice(i, 1);
        return this.elements[i] ?? this.elements.splice(i, 0)[0]; // workaround
      }
    }
    return -1;
  }
}

/**
 * Solution 2: Optimal — freq map + group map, O(1) push/pop
 * Time: push O(1), pop O(1)
 * Space: O(n) — total elements stored across all groups
 */
class FreqStack {
  private freq: Map<number, number>; // val → current frequency
  private group: Map<number, number[]>; // frequency → stack of vals at that freq
  private maxFreq: number;

  constructor() {
    this.freq = new Map();
    this.group = new Map();
    this.maxFreq = 0;
  }

  push(val: number): void {
    const f = (this.freq.get(val) ?? 0) + 1;
    this.freq.set(val, f);
    if (f > this.maxFreq) this.maxFreq = f;

    if (!this.group.has(f)) this.group.set(f, []);
    this.group.get(f)!.push(val);
  }

  pop(): number {
    const stack = this.group.get(this.maxFreq)!;
    const val = stack.pop()!;

    if (stack.length === 0) {
      this.group.delete(this.maxFreq);
      this.maxFreq--; // can only decrease by 1 at a time
    }

    this.freq.set(val, this.freq.get(val)! - 1);
    if (this.freq.get(val) === 0) this.freq.delete(val);

    return val;
  }
}

// === Test Cases ===
const fs = new FreqStack();
fs.push(5);
fs.push(7);
fs.push(5);
fs.push(7);
fs.push(4);
fs.push(5);
console.log(fs.pop()); // 5 (freq=3, unique)
console.log(fs.pop()); // 7 (freq=2, more recent than 5)
console.log(fs.pop()); // 5 (freq=2 now)
console.log(fs.pop()); // 4 (freq=1, most recent among freq=1)

const fs2 = new FreqStack();
fs2.push(4);
fs2.push(0);
fs2.push(9);
fs2.push(3);
fs2.push(4);
fs2.push(2);
console.log(fs2.pop()); // 4 (only element with freq=2)
```

---

## 🔗 Related Problems

- [LFU Cache](https://leetcode.com/problems/lfu-cache) — same freq+group structure, but with capacity eviction
- [Design a Stack With Increment Operation](https://leetcode.com/problems/design-a-stack-with-increment-operation) — augmented stack
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) — frequency counting
- [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) — bucket by frequency
- [Maximum Frequency Stack — LeetCode](https://leetcode.com/problems/maximum-frequency-stack) — problem page
