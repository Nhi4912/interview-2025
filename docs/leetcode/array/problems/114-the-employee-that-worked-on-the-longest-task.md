---
layout: page
title: "The Employee That Worked on the Longest Task"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/the-employee-that-worked-on-the-longest-task"
---

# The Employee That Worked on the Longest Task / Nhân Viên Làm Nhiệm Vụ Dài Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [First Missing Positive](https://leetcode.com/problems/first-missing-positive)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống **bảng chấm công** — mỗi dòng ghi giờ kết thúc nhiệm vụ. Để tính thời gian, lấy `leaveTime[i] - leaveTime[i-1]`. Nhiệm vụ đầu tiên bắt đầu lúc `0`. Ai làm lâu nhất (tie → id nhỏ hơn) là đáp án.

```
logs = [[0,3],[2,5],[0,9],[1,15]]
Task 0: end=3,  prev=0,  duration=3,  emp=0  ← new max
Task 1: end=5,  prev=3,  duration=2,  emp=2
Task 2: end=9,  prev=5,  duration=4,  emp=0  ← new max
Task 3: end=15, prev=9,  duration=6,  emp=1  ← new max
Answer: 1
```

---

## Problem Description / Mô Tả Bài Toán

Có `n` nhân viên (id `0..n-1`). `logs[i] = [id, leaveTime]` cho biết nhân viên `id` kết thúc nhiệm vụ thứ `i` lúc `leaveTime`. Nhiệm vụ xử lý **tuần tự**. Trả về **id nhân viên** làm nhiệm vụ **dài nhất** (tie → id nhỏ hơn).

- **Input:** `n=10, logs=[[0,3],[2,5],[0,9],[1,15]]` → **Output:** `1`
- **Input:** `n=26, logs=[[1,1],[3,7],[2,12],[7,17]]` → **Output:** `3`

**Constraints:** `1 <= n <= 500`, `1 <= logs.length <= 500`, leaveTime tăng dần

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Duration of task i = logs[i][1] - logs[i-1][1] (task 0 starts at time 0). **VI:** Thời gian nhiệm vụ i = leaveTime[i] − leaveTime[i−1]; nhiệm vụ 0 bắt đầu lúc 0.
2. **EN:** Tie-breaking: update best only when `duration > maxDuration` OR `(duration === max AND id < bestId)`. **VI:** Tie: cập nhật khi bằng và id nhỏ hơn.
3. **EN:** One-pass linear scan O(n), no extra space. **VI:** Một lần duyệt O(n), O(1) bộ nhớ.
4. **EN:** Don't confuse employee id with task index. **VI:** Phân biệt id nhân viên với chỉ số nhiệm vụ.
5. **EN:** The logs are guaranteed sorted by leaveTime ascending. **VI:** logs đã sắp tăng dần theo leaveTime.
6. **EN:** Edge: single task → return that employee's id. **VI:** Một nhiệm vụ → trả id nhân viên đó.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Single Linear Scan  O(n) time, O(1) space ───────────────────
function hardestWorker(n: number, logs: number[][]): number {
  let bestEmp = logs[0][0];
  let maxDuration = logs[0][1]; // first task: starts at 0
  let prevTime = logs[0][1];

  for (let i = 1; i < logs.length; i++) {
    const [empId, leaveTime] = logs[i];
    const duration = leaveTime - prevTime;

    if (duration > maxDuration || (duration === maxDuration && empId < bestEmp)) {
      maxDuration = duration;
      bestEmp = empId;
    }
    prevTime = leaveTime;
  }

  return bestEmp;
}

// ─── Solution 2: Functional reduce style  O(n) time, O(1) space ──────────────
function hardestWorkerReduce(n: number, logs: number[][]): number {
  let prevTime = 0;
  let bestEmp = -1;
  let maxDuration = -1;

  for (const [empId, leaveTime] of logs) {
    const duration = leaveTime - prevTime;
    if (duration > maxDuration || (duration === maxDuration && empId < bestEmp)) {
      maxDuration = duration;
      bestEmp = empId;
    }
    prevTime = leaveTime;
  }

  return bestEmp;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(
  hardestWorker(10, [
    [0, 3],
    [2, 5],
    [0, 9],
    [1, 15],
  ]),
); // 1
console.log(
  hardestWorker(26, [
    [1, 1],
    [3, 7],
    [2, 12],
    [7, 17],
  ]),
); // 3
console.log(
  hardestWorker(2, [
    [0, 10],
    [1, 20],
  ]),
); // 0 (tie → smaller id)
console.log(
  hardestWorkerReduce(10, [
    [0, 3],
    [2, 5],
    [0, 9],
    [1, 15],
  ]),
); // 1
console.log(
  hardestWorkerReduce(2, [
    [0, 10],
    [1, 20],
  ]),
); // 0
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                                          | Difficulty | Pattern          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| 1275 | [Find Winner on a Tic Tac Toe Game](https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game)                                             | 🟢 Easy    | Array Simulation |
| 1512 | [Number of Good Pairs](https://leetcode.com/problems/number-of-good-pairs)                                                                       | 🟢 Easy    | Array            |
| 2160 | [Minimum Sum of Four Digit Number After Splitting Digits](https://leetcode.com/problems/minimum-sum-of-four-digit-number-after-splitting-digits) | 🟢 Easy    | Greedy           |
