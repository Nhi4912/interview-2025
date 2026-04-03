---
layout: page
title: "Task Scheduler"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/task-scheduler"
---

# Task Scheduler / Lập Lịch Nhiệm Vụ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / Heap
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Reorganize String](https://leetcode.com/problems/reorganize-string) | [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống lịch làm việc của bác sĩ — mỗi loại bệnh nhân cần nghỉ n ngày trước lần khám kế tiếp. Bác sĩ nên luôn gặp loại bệnh nhân **đông nhất còn lại** để tránh lãng phí thời gian idle. Greedy: luôn ưu tiên task có tần suất cao nhất.

**Pattern Recognition:** "Minimum time with cooldown" → đếm tần suất task nhiều nhất (`maxFreq`) + số task cùng tần suất đó (`maxCount`).

```
tasks = [A,A,A,B,B,B], n = 2
maxFreq = 3 (cả A lẫn B)
Formula: max(len(tasks), (maxFreq-1)*(n+1) + maxCount)
        = max(6,        (3-1)*(2+1)    + 2    )
        = max(6, 8) = 8
Sequence: A B _ A B _ A B  → 8 slots
```

---

## 📋 Problem / Bài Toán

Given a list of CPU tasks (characters) and cooldown `n`, find the **minimum intervals** needed to finish all tasks. Between two same tasks, at least `n` intervals must pass (filled with other tasks or idle).

- `tasks=["A","A","A","B","B","B"], n=2` → `8`
- `tasks=["A","A","A","B","B","B"], n=0` → `6`
- `tasks=["A","A","A","A","A","A","B","C","D","E","F","G"], n=2` → `16`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Formula insight**: Kết quả = `max(tasks.length, (maxFreq-1)*(n+1) + maxCount)`. Giải thích: tạo `(maxFreq-1)` "frames" kích thước `(n+1)`, tailing với `maxCount` tasks bằng maxFreq.
- 🔑 **Nhận biết**: "Cooldown" + "minimum time" → thường là greedy math formula hoặc heap simulation.
- ⚡ **Greedy math O(n)**: Đếm freq, tìm maxFreq và số task có maxFreq, áp công thức — không cần mô phỏng thực sự.
- ⚡ **Max-heap simulation O(n log 26)**: Dùng priority queue để luôn chọn task phổ biến nhất còn cooldown.
- 🚨 **n=0 edge case**: Không cần cooldown, kết quả đúng bằng `tasks.length`.
- 💡 **Chứng minh formula**: Khi tasks đủ đa dạng để lấp đầy frames, không có idle → kết quả = `tasks.length`.

---

## Solutions

### Solution 1 — Greedy Math Formula · O(n) time · O(1) space

```typescript
/**
 * Key formula: result = max(n_tasks, (maxFreq-1)*(n+1) + maxCount)
 * maxFreq  = highest task frequency
 * maxCount = number of tasks sharing maxFreq
 * Time: O(n) | Space: O(1) — only 26 task types
 */
function leastInterval_greedy(tasks: string[], n: number): number {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
  freq.sort((a, b) => b - a);
  const maxFreq = freq[0];
  let maxCount = 0;
  for (const f of freq) {
    if (f === maxFreq) maxCount++;
    else break;
  }
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
}

console.log(leastInterval_greedy(["A", "A", "A", "B", "B", "B"], 2)); // 8
console.log(leastInterval_greedy(["A", "A", "A", "B", "B", "B"], 0)); // 6
console.log(leastInterval_greedy(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2)); // 16
```

### Solution 2 — Max-Heap Simulation · O(n log 26) time · O(1) space

```typescript
/**
 * Each round of n+1 slots: greedily pick the most frequent remaining tasks.
 * Simulate cooldown rounds, decrement frequencies, accumulate time.
 * Time: O(n log 26) ≈ O(n) | Space: O(1)
 */
function leastInterval(tasks: string[], n: number): number {
  const freq = new Map<string, number>();
  for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);

  // max-heap: sort desc by count each round (≤26 elements → fast)
  let counts = [...freq.values()].sort((a, b) => b - a);
  let time = 0;

  while (counts.length > 0) {
    const roundSize = n + 1;
    const next: number[] = [];
    let slots = 0;
    // fill up to roundSize slots with highest-freq tasks
    for (let i = 0; i < roundSize && i < counts.length; i++) {
      slots++;
      if (counts[i] - 1 > 0) next.push(counts[i] - 1);
    }
    next.sort((a, b) => b - a);
    counts = next;
    // if no tasks remain, use exactly slots; else use full round
    time += counts.length === 0 ? slots : roundSize;
  }
  return time;
}

console.log(leastInterval(["A", "A", "A", "B", "B", "B"], 2)); // 8
console.log(leastInterval(["A", "A", "A", "B", "B", "B"], 0)); // 6
console.log(leastInterval(["A", "C", "A", "B", "D", "B"], 1)); // 6
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                                            | Difficulty | Pattern            |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)                                                               | 🟡 Medium  | Greedy / Heap      |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)                                                   | 🟡 Medium  | Bucket Sort / Heap |
| [Maximum Frequency Stack](https://leetcode.com/problems/maximum-frequency-stack)                                                   | 🔴 Hard    | Greedy / Heap      |
| [Least Number of Unique Integers after K Removals](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals) | 🟡 Medium  | Greedy             |
