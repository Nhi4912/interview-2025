---
layout: page
title: "Number of Students Unable to Eat Lunch"
difficulty: Easy
category: Array
tags: [Array, Stack, Queue, Simulation]
leetcode_url: "https://leetcode.com/problems/number-of-students-unable-to-eat-lunch"
---

# Number of Students Unable to Eat Lunch / Số Học Sinh Không Ăn Được Trưa

🟢 Easy | Array · Stack · Queue · Simulation | LeetCode #1700

## 🧠 Intuition / Tư Duy

**Vietnamese:** Học sinh đứng thành hàng; bánh sandwich xếp thành chồng. Học sinh đầu hàng sẽ ăn nếu bánh đầu chồng phù hợp; nếu không, họ về cuối hàng. Quá trình dừng khi không ai thích bánh đầu chồng. Mẹo: đếm tổng số học sinh muốn loại 0 và loại 1 — nếu số học sinh muốn loại `sandwiches[i]` = 0 thì dừng.

```
students=[1,1,0,0], sandwiches=[0,1,0,1]

Count: want0=2, want1=2

Sandwich 0: want0=2>0, serve one → want0=1
Sandwich 1: want1=2>0, serve one → want1=1
Sandwich 0: want0=1>0, serve one → want0=0
Sandwich 1: want1=1>0, serve one → want1=0

All served! Answer = 0
```

## Problem Description

Students form a queue; sandwiches form a stack. If the front student wants the top sandwich, they eat it; otherwise, the student goes to the back. This continues until no queued student wants the top sandwich. Return the number of students unable to eat.

**Key insight:** No need to simulate the queue — count students wanting each type. Process sandwiches in order; if count for current sandwich type is 0, everyone remaining can't eat.

**Example 1:**

```
students=[1,1,0,0], sandwiches=[0,1,0,1]
Output: 0
```

**Example 2:**

```
students=[1,1,1,0,0,1], sandwiches=[1,0,0,0,1,1]
Output: 3
```

## 📝 Interview Tips

- **🔑 Count trick / Mẹo đếm:** Don't simulate queue rotation — just count `want[0]` and `want[1]`; stop when `want[sandwiches[i]] === 0`
- **🎯 Why it works / Tại sao đúng:** Queue rotation doesn't change total counts; we only fail when no one wants the current top sandwich
- **⚡ O(n) vs O(n²) / Tối ưu:** Simulation can be O(n²) in worst case; count approach is always O(n)
- **🔄 Simulation approach / Cách mô phỏng:** For interviews: simulate with actual queue to show understanding, then optimize with counting
- **⚠️ Termination / Điều kiện dừng:** Stop as soon as `want[sandwiches[i]] === 0` — remaining students can't eat
- **📊 Remaining count / Đếm còn lại:** Remaining students = `want[0] + want[1]` after early termination

## Solutions

```typescript
/**
 * Approach 1: Counting — O(n) optimal
 * Time: O(n)
 * Space: O(1)
 */
function countStudents(students: number[], sandwiches: number[]): number {
  const want = [0, 0];
  for (const s of students) want[s]++;

  for (const sandwich of sandwiches) {
    if (want[sandwich] === 0) break; // no one wants this type
    want[sandwich]--;
  }

  return want[0] + want[1];
}

console.log(countStudents([1, 1, 0, 0], [0, 1, 0, 1])); // 0
console.log(countStudents([1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1])); // 3
console.log(countStudents([0], [0])); // 0
console.log(countStudents([1], [0])); // 1
```

```typescript
/**
 * Approach 2: Full queue simulation (shows understanding)
 * Time: O(n^2) worst case
 * Space: O(n) for queue
 */
function countStudentsSimulation(students: number[], sandwiches: number[]): number {
  const queue = [...students];
  const stack = [...sandwiches];

  let attempts = 0; // consecutive failed attempts

  while (queue.length > 0 && attempts < queue.length) {
    if (queue[0] === stack[0]) {
      queue.shift();
      stack.shift();
      attempts = 0; // reset on success
    } else {
      queue.push(queue.shift()!);
      attempts++;
    }
  }

  return queue.length;
}

console.log(countStudentsSimulation([1, 1, 0, 0], [0, 1, 0, 1])); // 0
console.log(countStudentsSimulation([1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1])); // 3
```

```typescript
/**
 * Approach 3: One-liner using reduce
 * Time: O(n)
 * Space: O(1) extra
 */
function countStudentsOneLiner(students: number[], sandwiches: number[]): number {
  let c0 = students.filter((s) => s === 0).length;
  let c1 = students.length - c0;

  for (const s of sandwiches) {
    if (s === 0) {
      if (c0-- === 0) return c1 + 1;
    } else {
      if (c1-- === 0) return c0 + 1;
    }
  }
  return 0;
}

console.log(countStudentsOneLiner([1, 1, 0, 0], [0, 1, 0, 1])); // 0
console.log(countStudentsOneLiner([1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1])); // 3
```

## 🔗 Related Problems

| Problem                                                                                             | Difficulty | Pattern       |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets/)             | 🟢 Easy    | Queue         |
| [Reveal Cards In Increasing Order](https://leetcode.com/problems/reveal-cards-in-increasing-order/) | 🟡 Medium  | Queue         |
| [Design Circular Queue](https://leetcode.com/problems/design-circular-queue/)                       | 🟡 Medium  | Queue         |
| [Dota2 Senate](https://leetcode.com/problems/dota2-senate/)                                         | 🟡 Medium  | Greedy, Queue |
