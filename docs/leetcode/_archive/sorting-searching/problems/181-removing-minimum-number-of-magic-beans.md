---
layout: page
title: "Removing Minimum Number of Magic Beans"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Enumeration, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/removing-minimum-number-of-magic-beans"
---

# Removing Minimum Number of Magic Beans / Loại Bỏ Tối Thiểu Hạt Đậu Ma Thuật

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** After operations, all non-zero bags must have equal beans. Sort the array. For each threshold value `beans[i]`, the cost is: remove all beans in bags < beans[i] (they become 0), and reduce all bags > beans[i] down to beans[i]. The total removed = total - (n - i) × beans[i]. Try all thresholds.

**VI:** Sau thao tác, tất cả túi khác 0 phải có số đậu bằng nhau. Sắp xếp mảng. Với mỗi ngưỡng `beans[i]`, chi phí là: xóa hết túi < beans[i] (thành 0), giảm túi > beans[i] xuống beans[i]. Tổng bị xóa = total - (n-i) × beans[i]. Thử mọi ngưỡng.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Removing Minimum Number of Magic Beans example:**

```
beans = [4, 1, 6, 5]
sorted: [1, 4, 5, 6]   total = 16

Threshold = 1 (i=0): remove = 16 - 4×1 = 12
Threshold = 4 (i=1): remove = 16 - 3×4 = 4   ← min
Threshold = 5 (i=2): remove = 16 - 2×5 = 6
Threshold = 6 (i=3): remove = 16 - 1×6 = 10

Answer: 4  (set all to 4: remove 1, reduce 5→4, reduce 6→4 → 1+1+2=4 ✓)

Key formula: cost[i] = total - (n - i) * beans[i]
  All bags i..n-1 stay at beans[i]; all bags 0..i-1 get fully removed.
```

---

---

## Problem Description

| #   | Problem                                               | Difficulty | Pattern                |
| --- | ----------------------------------------------------- | ---------- | ---------------------- |
| 1   | Minimum Cost to Move Chips                            | 🟢 Easy    | greedy parity          |
| 2   | Minimum Number of Operations to Make Array Continuous | 🔴 Hard    | sort + sliding window  |
| 3   | Sum of Absolute Differences                           | 🟡 Medium  | prefix sum enumeration |

---

## 📝 Interview Tips

- 🔑 **EN:** The optimal final state must be one of the existing bean values (or 0). So try each beans[i] as the threshold. **VI:** Trạng thái tối ưu cuối cùng phải là một trong các giá trị đậu hiện có (hoặc 0). Thử mỗi beans[i] làm ngưỡng.
- 📊 **EN:** Formula: `cost = total - (n - i) * beans[i]`. The `(n-i)` bags at positions i..n-1 each contribute exactly beans[i]; rest are zeroed. **VI:** Công thức: `cost = total - (n-i) × beans[i]`. Đơn giản vì chúng ta biết phần còn lại sau khi giữ (n-i) túi ở mức beans[i].
- ✅ **EN:** Sort first so `beans[0] ≤ beans[1] ≤ ... ≤ beans[n-1]` — threshold increases monotonically with i. **VI:** Sắp xếp trước để đảm bảo ngưỡng tăng đơn điệu theo i.
- 🔢 **EN:** Total sum can reach 10^9 × 10^5 = 10^14 — use regular JS numbers (safe up to 2^53 ≈ 9×10^15). **VI:** Tổng tối đa 10^14 — số JS thường vẫn an toàn (giới hạn 2^53 ≈ 9×10^15).
- 🚫 **EN:** Threshold = 0 means empty all bags: cost = total. This is the baseline worst case. **VI:** Ngưỡng = 0 nghĩa là xóa hết tất cả: chi phí = total. Đây là trường hợp tệ nhất.
- ⚡ **EN:** No prefix sum needed explicitly — the formula computes cost in O(1) per threshold. **VI:** Không cần tính prefix sum riêng — công thức cho O(1) mỗi ngưỡng.

---

---

## Solutions

```typescript
/**
 * Sort array. For each possible threshold (each beans[i]),
 * compute removed = total - (n-i)*beans[i]. Take minimum.
 * Time: O(n log n)  Space: O(1)
 */
function minimumRemoval(beans: number[]): number {
  beans.sort((a, b) => a - b);
  const n = beans.length;
  const total = beans.reduce((s, b) => s + b, 0);

  let minRemove = total; // threshold=0: remove everything
  for (let i = 0; i < n; i++) {
    // Keep beans[i..n-1] at exactly beans[i], remove beans[0..i-1] entirely
    const kept = (n - i) * beans[i];
    minRemove = Math.min(minRemove, total - kept);
  }
  return minRemove;
}

// Tests
console.log(minimumRemoval([4, 1, 6, 5])); // 4
console.log(minimumRemoval([2, 10, 3, 2])); // 7  → threshold=2: 10-2+3-2=9? No: total=17, 3×2=6, 17-6=11? Let me recalc
// sorted [2,2,3,10] total=17
// i=0: 17-4×2=9  i=1: 17-3×2=11  i=2: 17-2×3=11  i=3: 17-1×10=7  → 7
console.log(minimumRemoval([1, 1, 1])); // 0  (all equal, nothing to remove)
console.log(minimumRemoval([1, 2])); // 1  (threshold=1: remove 0; total=3,kept=1×2=2? i=0: 3-2×1=1, i=1: 3-1×2=1 → 1)

/**
 * Build prefix sums for the "remove left" cost explicitly.
 * Cost for threshold beans[i] = prefix[i] + sum of (beans[j]-beans[i]) for j>i
 *                              = prefix[i] + (total - prefix[i+1]) - (n-i-1)*beans[i]
 * Equivalent to solution 1, just derived differently.
 * Time: O(n log n)  Space: O(n)
 */
function minimumRemoval2(beans: number[]): number {
  beans.sort((a, b) => a - b);
  const n = beans.length;

  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + beans[i];
  const total = prefix[n];

  let ans = total;
  for (let i = 0; i < n; i++) {
    // Cost: remove all beans before i (prefix[i])
    //     + reduce all after i to beans[i] ((total - prefix[i+1]) - (n-i-1)*beans[i])
    const removeLeft = prefix[i];
    const reduceRight = total - prefix[i + 1] - (n - i - 1) * beans[i];
    ans = Math.min(ans, removeLeft + reduceRight);
  }
  return ans;
}

console.log(minimumRemoval2([4, 1, 6, 5])); // 4
console.log(minimumRemoval2([2, 10, 3, 2])); // 7

/**
 * Handles single-element and all-equal arrays
 * Time: O(n log n)  Space: O(1)
 */
function minimumRemoval3(beans: number[]): number {
  if (beans.length === 1) return 0; // only one bag, no removal needed
  beans.sort((a, b) => a - b);
  const total = beans.reduce((s, b) => s + b, 0);
  let min = total;
  for (let i = 0; i < beans.length; i++) {
    min = Math.min(min, total - (beans.length - i) * beans[i]);
  }
  return min;
}

console.log(minimumRemoval3([5])); // 0
console.log(minimumRemoval3([3, 3, 3])); // 0
console.log(minimumRemoval3([1, 1000000000])); // 1
```

---

## 🔗 Related Problems

| #   | Problem                                               | Difficulty | Pattern                |
| --- | ----------------------------------------------------- | ---------- | ---------------------- |
| 1   | Minimum Cost to Move Chips                            | 🟢 Easy    | greedy parity          |
| 2   | Minimum Number of Operations to Make Array Continuous | 🔴 Hard    | sort + sliding window  |
| 3   | Sum of Absolute Differences                           | 🟡 Medium  | prefix sum enumeration |
