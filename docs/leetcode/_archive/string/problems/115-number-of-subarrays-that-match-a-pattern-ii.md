---
layout: page
title: "Number of Subarrays That Match a Pattern II"
difficulty: Hard
category: String
tags: [Array, Rolling Hash, String Matching, Hash Function]
leetcode_url: "https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii"
---

# Number of Subarrays That Match a Pattern II / Số Subarray Khớp Pattern II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Number of Subarrays That Match a Pattern I](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i) | [Count Prefix and Suffix Pairs II](https://leetcode.com/problems/count-prefix-and-suffix-pairs-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm một bài hát trong playlist — thay vì nghe từng đoạn một, KMP xây dựng "bảng gian lận" (failure function) để nhảy qua các vị trí đã biết không match, tránh so sánh lại.

**Pattern Recognition:**

- Signal: "count occurrences of pattern in array" + large n → **KMP String Matching**
- Key insight: Chuyển `nums` thành mảng comparison `cmp[]` (1/-1/0), rồi chạy KMP với `pattern[]`.
- Conversion: `cmp[i] = nums[i+1] > nums[i] ? 1 : nums[i+1] < nums[i] ? -1 : 0`

**Visual:**

```
nums    = [1, 2, 1, 2, 3, 1, 2]
pattern = [1, 1]   (both increasing)

cmp[]   = [1,-1, 1, 1,-1, 1]
            0  1  2  3  4  5

KMP search pattern [1,1] in cmp:
  i=2,3: cmp[2]=1, cmp[3]=1 → MATCH at pos 2 → subarray [2..4]
  i=4,5: cmp[4]=-1 → no
  i=3,4: ...
Result = 1
```

---

## Problem Description

Given integer array `nums` (length `n+1`) and integer array `pattern` (length `m`), return the count of indices `i` such that `nums[i..i+m]` matches `pattern`, where pattern encodes: `1`=increasing, `-1`=decreasing, `0`=equal. ([LeetCode](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-ii))

Difficulty: Hard | Acceptance: ~49%

```
Example 1: nums=[1,2,1,2,3,1,2], pattern=[1,1] → 2
  Subarrays matching: [1,2,3] at i=2 (1<2<3), [1,2] at i=5
  Actually cmp=[1,-1,1,1,-1,1], KMP finds [1,1] at pos 2 and 5 → 2

Example 2: nums=[1,4,4,1,3,5,5,3], pattern=[1,0,-1] → 2
  cmp=[1,0,-1,1,1,0,-1], pattern=[1,0,-1] found at i=0 and i=4 → 2
```

Constraints:

- `2 <= nums.length <= 10^6`
- `1 <= pattern.length < nums.length`

---

## 📝 Interview Tips

1. **Clarify**: "Pattern value 1/-1/0 có nghĩa là so sánh giữa nums[i] và nums[i+1]?" / Confirm 1=inc, -1=dec, 0=equal.
2. **Brute force**: "O(n·m) so sánh trực tiếp — TLE với n=10^6" / O(n·m) is TLE for large inputs.
3. **Optimize**: "Dùng KMP: O(n+m) với failure function" / KMP gives O(n+m) linear time.
4. **Convert step**: "Đừng quên bước chuyển nums → cmp array trước" / Must first convert nums to comparison array.
5. **Edge cases**: "Pattern dài hơn cmp? → trả về 0" / If pattern.length > cmp.length → return 0.
6. **Follow-up**: "Pattern I có n nhỏ → brute force OK; Pattern II cần KMP" / Part I brute OK, Part II needs KMP.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — O(n·m)
 * Works for Pattern I (small n), TLE for Pattern II (n=10^6)
 */
function countMatchingSubarraysBrute(nums: number[], pattern: number[]): number {
  const n = nums.length;
  const m = pattern.length;
  let count = 0;

  for (let i = 0; i + m < n; i++) {
    let match = true;
    for (let j = 0; j < m; j++) {
      const diff = nums[i + j + 1] - nums[i + j];
      const cmp = diff > 0 ? 1 : diff < 0 ? -1 : 0;
      if (cmp !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) count++;
  }
  return count;
}

/**
 * Solution 2: KMP — O(n + m)
 * Time: O(n + m) — KMP with failure function
 * Space: O(n + m) — cmp array + failure table
 *
 * Steps:
 * 1. Convert nums → cmp array (length n-1)
 * 2. Build KMP failure function for pattern
 * 3. Run KMP search → count matches
 */
function countMatchingSubarrays(nums: number[], pattern: number[]): number {
  const n = nums.length;
  const m = pattern.length;

  // Step 1: Convert nums to comparison array
  const cmp: number[] = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    cmp[i] = nums[i + 1] > nums[i] ? 1 : nums[i + 1] < nums[i] ? -1 : 0;
  }

  // Step 2: Build KMP failure function for pattern
  const fail: number[] = new Array(m).fill(0);
  let k = 0;
  for (let i = 1; i < m; i++) {
    while (k > 0 && pattern[i] !== pattern[k]) k = fail[k - 1];
    if (pattern[i] === pattern[k]) k++;
    fail[i] = k;
  }

  // Step 3: KMP search
  let count = 0;
  let j = 0; // matched length in pattern
  for (let i = 0; i < cmp.length; i++) {
    while (j > 0 && cmp[i] !== pattern[j]) j = fail[j - 1];
    if (cmp[i] === pattern[j]) j++;
    if (j === m) {
      count++;
      j = fail[j - 1];
    }
  }

  return count;
}

// === Test Cases ===
console.log(countMatchingSubarrays([1, 2, 1, 2, 3, 1, 2], [1, 1])); // 2
console.log(countMatchingSubarrays([1, 4, 4, 1, 3, 5, 5, 3], [1, 0, -1])); // 2
console.log(countMatchingSubarrays([1, 2, 3], [1])); // 2
console.log(countMatchingSubarrays([1, 1, 1], [-1])); // 0

console.log(countMatchingSubarraysBrute([1, 2, 1, 2, 3, 1, 2], [1, 1])); // 2
console.log(countMatchingSubarraysBrute([1, 4, 4, 1, 3, 5, 5, 3], [1, 0, -1])); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                    | Pattern     | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| [Find the Index of the First Occurrence](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | KMP         | Easy       |
| [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern)                                     | KMP         | Easy       |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)                                                   | KMP         | Hard       |
| [Number of Subarrays That Match a Pattern I](https://leetcode.com/problems/number-of-subarrays-that-match-a-pattern-i)     | Brute Force | Medium     |
