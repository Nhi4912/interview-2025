---
layout: page
title: "Combination Sum II"
difficulty: Medium
category: Backtracking
tags: [Array, Backtracking]
leetcode_url: "https://leetcode.com/problems/combination-sum-ii"
---

# Combination Sum II / Tổng Tổ Hợp II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking — Sort + Skip Duplicates
> **Frequency**: 📘 Tier 2 — Gặp ở Google, Amazon, Facebook; khác Combination Sum I ở chỗ mỗi phần tử dùng 1 lần và có duplicate
> **See also**: [Combination Sum](https://leetcode.com/problems/combination-sum) | [Subsets II](https://leetcode.com/problems/subsets-ii)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn chọn nguyên liệu nấu ăn từ giỏ có nhiều cùng loại — nhưng mỗi lần chỉ lấy mỗi vật thật sự một lần (không lấy trùng cùng vật). Khi nhiều vật giống nhau, bạn bỏ qua các lựa chọn trùng lặp để không ra công thức giống nhau hai lần.

- **Pattern Recognition:**
  - Sort trước → các phần tử giống nhau nằm liền kề → dễ skip duplicate
  - Tại mỗi level của cây backtracking: `if i > start && candidates[i] == candidates[i-1]: skip`
  - Khác Combination Sum I: `start = i+1` (không dùng lại cùng index), không dùng `i` lần nữa

- **Visual — `candidates=[10,1,2,7,6,1,5], target=8`:**

  ```
  Sau sort: [1,1,2,5,6,7,10]

  backtrack(start=0, remain=8, path=[])
  ├── pick 1 (i=0): backtrack(start=1, remain=7, path=[1])
  │   ├── pick 1 (i=1): backtrack(start=2, remain=6, path=[1,1])
  │   │   ├── pick 2 → [1,1,2] remain=4...
  │   │   └── pick 6 → [1,1,6] ✅
  │   ├── SKIP 1 (i=2, candidates[2]=1=candidates[1]) ← tránh duplicate
  │   ├── pick 2 → [1,2] remain=5...
  │   └── pick 7 → [1,7] ✅
  └── SKIP 1 (i=1, candidates[1]=1=candidates[0]) ← tránh duplicate
  └── pick 2 (i=2): ...
  ```

## Problem Description

Cho mảng `candidates` (có thể chứa trùng lặp) và `target`. Tìm tất cả tổ hợp duy nhất trong `candidates` có tổng bằng `target`. Mỗi số trong `candidates` chỉ được dùng một lần trong tổ hợp.

| Input                                   | Output                          |
| --------------------------------------- | ------------------------------- |
| `candidates=[10,1,2,7,6,1,5], target=8` | `[[1,1,6],[1,2,5],[1,7],[2,6]]` |
| `candidates=[2,5,2,1,2], target=5`      | `[[1,2,2],[5]]`                 |

## 📝 Interview Tips

- 🇻🇳 **Sort trước** là bước bắt buộc — không sort thì không skip được duplicate / 🇬🇧 _Sorting is mandatory — enables the duplicate-skip check at each level_
- 🇻🇳 Điều kiện skip: `i > start && candidates[i] == candidates[i-1]` — `i > start` quan trọng để không skip phần tử đầu tiên của level / 🇬🇧 _Skip condition: i > start prevents skipping the first element at each level_
- 🇻🇳 Khác với Combination Sum I: `start = i+1` (không lặp lại index), mỗi phần tử dùng tối đa 1 lần / 🇬🇧 _Differs from Sum I: recurse with i+1 (no reuse), each element used at most once_
- 🇻🇳 Pruning mạnh: nếu `candidates[i] > remain` và mảng đã sort → break vòng lặp luôn / 🇬🇧 _Strong pruning: if sorted array has candidates[i] > remaining → break, not just continue_

## Solutions

```typescript
/**
 * Solution 1: Sort + Backtrack with Duplicate Skipping
 * Sắp xếp để các phần tử giống nhau nằm cạnh nhau.
 * Skip khi cùng level gặp phần tử giống phần tử trước đó.
 *
 * @time O(2^n) — trong trường hợp xấu nhất (không duplicate)
 * @space O(n) — depth của call stack = độ dài tổ hợp dài nhất
 */
function combinationSum2(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  candidates.sort((a, b) => a - b);

  function backtrack(start: number, remain: number, path: number[]): void {
    if (remain === 0) {
      result.push([...path]);
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      // Prune: mảng đã sort, nếu phần tử này > remain thì mọi phần tử sau cũng vậy
      if (candidates[i] > remain) break;

      // Skip duplicate tại cùng level của cây đệ quy
      if (i > start && candidates[i] === candidates[i - 1]) continue;

      path.push(candidates[i]);
      backtrack(i + 1, remain - candidates[i], path); // i+1: dùng mỗi index 1 lần
      path.pop();
    }
  }

  backtrack(0, target, []);
  return result;
}

console.log(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8));
// [[1,1,6],[1,2,5],[1,7],[2,6]]
console.log(combinationSum2([2, 5, 2, 1, 2], 5));
// [[1,2,2],[5]]
console.log(combinationSum2([1, 1, 1, 1], 2));
// [[1,1]]

/**
 * Solution 2: Counter-Based Backtracking
 * Đếm tần suất mỗi phần tử trước, dùng mỗi phần tử tối đa count[x] lần.
 * Tránh vấn đề duplicate bằng cách làm việc với (value, count) pairs.
 *
 * @time O(2^n) — mỗi unique value có thể dùng 0..count lần
 * @space O(k) — k là số unique values
 */
function combinationSum2V2(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const countMap = new Map<number, number>();
  for (const c of candidates) countMap.set(c, (countMap.get(c) ?? 0) + 1);
  const pairs = [...countMap.entries()].sort((a, b) => a[0] - b[0]); // [val, count]

  function backtrack(idx: number, remain: number, path: number[]): void {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    if (idx === pairs.length) return;

    const [val, cnt] = pairs[idx];
    if (val > remain) return; // prune

    // Thử dùng phần tử này 0, 1, ..., min(cnt, remain/val) lần
    const maxUse = Math.min(cnt, Math.floor(remain / val));
    for (let use = 0; use <= maxUse; use++) {
      for (let k = 0; k < use; k++) path.push(val);
      backtrack(idx + 1, remain - val * use, path);
      for (let k = 0; k < use; k++) path.pop();
    }
  }

  backtrack(0, target, []);
  return result;
}

console.log(combinationSum2V2([10, 1, 2, 7, 6, 1, 5], 8));
// [[1,1,6],[1,2,5],[1,7],[2,6]]
```

## 🔗 Related Problems

| Problem                                                                       | Pattern                      | Difficulty |
| ----------------------------------------------------------------------------- | ---------------------------- | ---------- |
| [39. Combination Sum](https://leetcode.com/problems/combination-sum)          | Backtracking (reuse allowed) | 🟡 Medium  |
| [90. Subsets II](https://leetcode.com/problems/subsets-ii)                    | Backtracking + Skip Dup      | 🟡 Medium  |
| [47. Permutations II](https://leetcode.com/problems/permutations-ii)          | Backtracking + Skip Dup      | 🟡 Medium  |
| [216. Combination Sum III](https://leetcode.com/problems/combination-sum-iii) | Backtracking fixed k         | 🟡 Medium  |
