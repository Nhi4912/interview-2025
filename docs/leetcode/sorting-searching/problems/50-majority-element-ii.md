---
layout: page
title: "Majority Element II"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/majority-element-ii"
---

# Majority Element II / Phần Tử Đa Số II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Boyer-Moore Voting
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Trong một cuộc bầu cử n người, ứng viên phải chiếm > n/3 phiếu để thắng. Tối đa 2 ứng viên có thể thắng. Dùng "cân bằng lực lượng" — mỗi lần có 3 phiếu khác nhau, loại bỏ nhóm 3, số còn lại là ứng viên tiềm năng.

**Pattern Recognition:**

- Signal: "elements appearing > n/3 times" + "O(1) space" → **Boyer-Moore Voting (Extended)**
- Tối đa 2 phần tử có thể xuất hiện > n/3 lần → track 2 candidates
- Key insight: sau voting pass, cần verify pass thứ 2 vì candidate chưa chắc đủ tiêu chuẩn

**Visual — nums = [1, 1, 1, 3, 3, 2, 2, 2]:**

```
Pass 1 — Find candidates:
  n=1: cand1=1 cnt1=1
  n=1: cand1=1 cnt1=2
  n=1: cand1=1 cnt1=3
  n=3: cand2=3 cnt2=1
  n=3: cand2=3 cnt2=2
  n=2: (2≠1,2≠3) → cnt1--, cnt2-- → cnt1=2,cnt2=1
  n=2: cand2=2 cnt2=1  (cnt2 was 0, reassign)
  n=2: cand2=2 cnt2=2

Candidates: cand1=1, cand2=2

Pass 2 — Verify:
  count(1)=3 > 8/3=2.67 ✅
  count(2)=3 > 2.67 ✅

Result: [1, 2] ✅
```

---

## Problem Description

Cho mảng `nums` kích thước n, tìm **tất cả phần tử xuất hiện > n/3 lần**. Kết quả có thể trống, hoặc có 1-2 phần tử. ([LeetCode](https://leetcode.com/problems/majority-element-ii))

Difficulty: Medium | Acceptance: 54.4%

- `nums = [3,2,3]` → `[3]` (3 xuất hiện 2 lần > 1)
- `nums = [1]` → `[1]`
- `nums = [1,2]` → `[1,2]`

Constraints: `1 <= nums.length <= 5×10^4`, `-10^9 <= nums[i] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Cần trả về sorted không? Có thể có 0, 1 hoặc 2 kết quả" / At most 2 results; order doesn't matter
2. **Brute force**: "HashMap đếm, lọc > n/3 — O(n) time, O(n) space" / Easy O(n) with hashmap
3. **Optimal**: "Boyer-Moore mở rộng cho n/3 — O(n) time, O(1) space" / Voting with 2 candidates
4. **Verify pass**: "Sau voting, bắt buộc verify — candidate không đảm bảo đủ điều kiện" / Must verify candidates
5. **Why 2 candidates**: "Tối đa 2 phần tử có thể > n/3 — vì 3×(n/3+1) > n" / Pigeonhole principle
6. **Follow-up**: "n/k? → k-1 candidates, Boyer-Moore tổng quát" / Generalize to n/k with k-1 candidates

---

## Solutions

```typescript
/**
 * Solution 1: HashMap — Count Frequencies
 * Time: O(n) — single pass + filter
 * Space: O(n) — hash map storage
 */
function majorityElementIIHashMap(nums: number[]): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const threshold = nums.length / 3;
  return [...freq.entries()].filter(([, cnt]) => cnt > threshold).map(([val]) => val);
}

/**
 * Solution 2: Boyer-Moore Extended Voting — O(1) Space
 * Time: O(n) — two passes
 * Space: O(1) — only 4 variables
 */
function majorityElementII(nums: number[]): number[] {
  // Phase 1: Find two candidates
  let cand1 = 0,
    cnt1 = 0;
  let cand2 = 1,
    cnt2 = 0; // init different values

  for (const n of nums) {
    if (n === cand1) {
      cnt1++;
    } else if (n === cand2) {
      cnt2++;
    } else if (cnt1 === 0) {
      cand1 = n;
      cnt1 = 1;
    } else if (cnt2 === 0) {
      cand2 = n;
      cnt2 = 1;
    } else {
      cnt1--;
      cnt2--; // cancel out three distinct elements
    }
  }

  // Phase 2: Verify candidates actually exceed n/3
  cnt1 = 0;
  cnt2 = 0;
  for (const n of nums) {
    if (n === cand1) cnt1++;
    else if (n === cand2) cnt2++;
  }

  const threshold = nums.length / 3;
  const result: number[] = [];
  if (cnt1 > threshold) result.push(cand1);
  if (cnt2 > threshold) result.push(cand2);
  return result;
}

// === Test Cases ===
console.log(majorityElementII([3, 2, 3])); // [3]
console.log(majorityElementII([1])); // [1]
console.log(majorityElementII([1, 2])); // [1, 2]
console.log(majorityElementII([1, 1, 1, 3, 3, 2, 2, 2])); // [1, 2]
```

---

## 🔗 Related Problems

- [Majority Element](https://leetcode.com/problems/majority-element) — simpler: n/2, one candidate
- [Check if Array Has Good Pair](https://leetcode.com/problems/check-if-array-has-good-pair) — counting pattern
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) — frequency + heap
- [Find Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) — frequency-based detection
- [Majority Element II — LeetCode](https://leetcode.com/problems/majority-element-ii) — problem page
