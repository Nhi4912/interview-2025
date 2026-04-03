---
layout: page
title: "Longest Increasing Subsequence"
difficulty: Medium
category: DP
tags: [Array, Binary Search, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-increasing-subsequence/"
leetcode_number: 300
pattern: "DP / Binary Search (Patience Sort)"
frequency_tier: 2
companies: [Google, Amazon, Microsoft, Grab]
target_time_minutes: 25
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Longest Increasing Subsequence / Dãy Con Tăng Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP / Binary Search (Patience Sort)
> **Frequency**: ⭐ Tier 2 — Gặp ~50% interviews vòng senior, classic DP bài
> **See also**: [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) | [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn chơi patience solitaire (bài xếp chồng) — mỗi lá bài chỉ được đặt lên chồng có số nhỏ hơn giá trị lá đó, hoặc mở chồng mới. Số chồng bài cuối cùng chính là độ dài LIS. Đây là "Patience Sorting" — cách giải O(n log n) dựa trên binary search.

**Pattern Recognition:**

- Signal: "longest subsequence", "strictly increasing" → **DP** hoặc **Binary Search (Patience Sort)**
- DP: `dp[i]` = độ dài LIS kết thúc tại index i; nested loop → O(n²)
- Binary Search: duy trì mảng `tails` tăng dần, binary search vị trí chèn → O(n log n)

**Visual — DP Table vs Patience Sort:**

```
nums = [10, 9, 2, 5, 3, 7, 101, 18]

DP approach:
idx:    0  1  2  3  4  5   6   7
nums:  10  9  2  5  3  7  101  18
dp:     1  1  1  2  2  3   4   4
                                ↑ max = 4, LIS = [2, 3, 7, 101]

Patience Sort (binary search):
num=10 → tails=[10]
num=9  → replace 10    → tails=[9]
num=2  → replace 9     → tails=[2]
num=5  → append        → tails=[2, 5]
num=3  → replace 5     → tails=[2, 3]
num=7  → append        → tails=[2, 3, 7]
num=101→ append        → tails=[2, 3, 7, 101]
num=18 → replace 101   → tails=[2, 3, 7, 18]
length = 4 ✅
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                           |
| ---------------- | ---------------------------------------------------------------------------------- |
| **When you see** | "longest strictly increasing subsequence", preserve order not contiguous           |
| **Think**        | DP O(n²): `dp[i]` = LIS ending at i; or Binary Search O(n log n): patience sort   |
| **Template**     | `dp[i] = max(dp[j]+1) for j<i where nums[j]<nums[i]`                              |
| **Time target**  | ⏱️ 25 min (Medium)                                                                 |

> 💡 **Memory hook / Móc nhớ:** "Patience Sorting = xếp bài — đặt lên chồng nhỏ hơn hoặc mở chồng mới. Số chồng = độ dài LIS."

---

## Problem Description

Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence. A subsequence preserves original order but elements need not be contiguous.

```
Example 1: nums = [10,9,2,5,3,7,101,18]  → 4   (LIS: [2,3,7,101])
Example 2: nums = [0,1,0,3,2,3]           → 4   (LIS: [0,1,2,3])
Example 3: nums = [7,7,7,7,7]             → 1   (no two equal allowed)
```

Constraints:

- 1 <= nums.length <= 2500
- -10^4 <= nums[i] <= 10^4

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We need the length of the longest subsequence where elements are strictly increasing — not necessarily contiguous. Clarify: strictly increasing, so equal elements are not allowed?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (3 min)

> "Two approaches: DP at O(n²) — define dp[i] as LIS ending at index i, scan j<i for valid predecessors. Or binary search Patience Sort at O(n log n) — maintain a tails array, binary search insertion point. For n≤2500 the O(n²) is fine, but I'll mention both and implement whichever you prefer."

### Step 3 — Implement / Viết Code (7 min)

> "I'll code the DP approach: initialize all dp[i]=1. For each i, scan j from 0 to i-1: if nums[j] < nums[i], update dp[i] = max(dp[i], dp[j]+1). Return max of dp array."

### Step 4 — Review / Kiểm Tra (2 min)

> "For [10,9,2,5,3,7,101,18]: dp = [1,1,1,2,2,3,4,4]. Max is 4. LIS is [2,3,7,101]. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "DP: O(n²) time, O(n) space. Patience Sort: O(n log n), O(n). Edge cases: all same → 1, all decreasing → 1, single element → 1. Follow-up: reconstruct actual subsequence by tracking a prev[] array."

---

## 📝 Interview Tips

1. **Clarify**: Strictly increasing (no equal elements allowed in subsequence)? Or non-decreasing? / Tăng nghiêm ngặt (không bằng nhau) hay tăng không giảm?
2. **Brute force**: Check all 2^n subsequences for increasing property → O(2^n × n) — mention it, then move on / Thử tất cả 2^n dãy con — quá chậm, chỉ đề cập rồi bỏ qua
3. **DP approach**: `dp[i]` = LIS length ending at index i; for each i scan j < i where nums[j] < nums[i] → O(n²) — good enough for n ≤ 2500 / DP O(n²) đủ tốt cho constraint này
4. **Optimize**: Binary search on `tails` array: `tails[i]` = smallest tail of all increasing subsequences of length i+1 → O(n log n) / Binary search trên `tails` — nêu invariant: `tails[i]` là tail nhỏ nhất của mọi LIS độ dài i+1
5. **Edge cases**: All same elements → 1; all decreasing → 1; single element → 1 / Tất cả bằng hoặc giảm → answer = 1
6. **Follow-up**: "Reconstruct the actual subsequence?" → add a `prev[]` array to DP solution to trace back / "Tái tạo dãy con?" → thêm mảng prev trong DP

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                      | Why Wrong / Tại sao sai                                         | Fix / Cách sửa                                            |
| --- | ------------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | Thinking dp[i] = LIS length of first i elements        | dp[i] = LIS ending AT index i (must include nums[i])            | dp[i] starts at 1 (just nums[i] alone), not 0            |
| 2   | Inner loop `j <= i` instead of `j < i`                 | Comparing element with itself — adds 1 spuriously               | Use `j < i` strict inequality                             |
| 3   | Not knowing O(n log n) Patience Sort optimization      | Gets O(n²) only — may not satisfy follow-up question             | Learn: maintain sorted `tails` array + lower_bound binary search |

---

## Solutions

```typescript

/**

- Solution 1: Dynamic Programming (O(n²))
- Time: O(n²) — nested loops, j scans all previous positions for each i
- Space: O(n) — dp array of size n
  */
  function lengthOfLIS(nums: number[]): number {
  const dp = new Array(nums.length).fill(1); // dp[i] = LIS length ending at i

for (let i = 1; i < nums.length; i++) {
for (let j = 0; j < i; j++) {
if (nums[j] < nums[i]) {
dp[i] = Math.max(dp[i], dp[j] + 1);
}
}
}

return Math.max(...dp);
}

/**

- Solution 2: Binary Search / Patience Sort (Optimal)
- Time: O(n log n) — binary search O(log n) for each of n elements
- Space: O(n) — tails array length equals the LIS length
-
- Invariant: tails[i] = smallest ending value among all increasing
- subsequences of length i+1. tails is always strictly sorted.
  */
  function lengthOfLISOptimal(nums: number[]): number {
  const tails: number[] = [];

for (const num of nums) {
// Binary search: find leftmost index where tails[idx] >= num
let left = 0, right = tails.length;
while (left < right) {
const mid = (left + right) >> 1;
tails[mid] < num ? (left = mid + 1) : (right = mid);
}
tails[left] = num; // Replace existing or extend tails by one
}

return tails.length;
}

// === Test Cases ===
console.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // 4 ✅
console.log(lengthOfLIS([0,1,0,3,2,3])); // 4 ✅
console.log(lengthOfLIS([7,7,7,7,7])); // 1 ✅
console.log(lengthOfLISOptimal([10,9,2,5,3,7,101,18])); // 4 ✅

```

---

## 🔗 Related Problems

- [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) — classic DP subsequence variant
- [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/) — 2D LIS, harder application
- [Number of Longest Increasing Subsequences](https://leetcode.com/problems/number-of-longest-increasing-subsequences/) — count all LIS, not just length
- [Increasing Triplet Subsequence](https://leetcode.com/problems/increasing-triplet-subsequence/) — LIS of length exactly 3

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | ___ min (target: 25 min)                 |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
