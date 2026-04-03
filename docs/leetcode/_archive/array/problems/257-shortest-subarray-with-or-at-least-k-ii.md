---
layout: page
title: "Shortest Subarray With OR at Least K II"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation, Sliding Window]
leetcode_url: "https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-ii"
---

# Shortest Subarray With OR at Least K II / Mảng Con Ngắn Nhất Có OR Ít Nhất K (II)

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Subarray With OR at Least K I](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-i) | [Longest Nice Subarray](https://leetcode.com/problems/longest-nice-subarray)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy tưởng tượng bạn đang thu thập các đèn LED nhiều màu (mỗi bit = 1 màu). Khi cửa sổ trượt sang phải thêm đèn mới; khi trượt sang trái bỏ đèn cũ — nhưng bỏ đèn khó hơn vì phải đếm xem màu đó còn đèn nào trong cửa sổ không. Dùng mảng `bitCount[32]` để đếm số lần mỗi bit xuất hiện trong cửa sổ.

**Pattern Recognition:**

- Signal: "shortest subarray", OR operation, sliding window possible → **Sliding Window + Bit Count Array**
- Key insight: OR dễ thêm bit nhưng khó bỏ bit → dùng `bitCount[]` đếm tần suất từng bit trong window

**Visual — nums=[1,2,3], k=2:**

```
bitCount tracks how many times each bit appears in window

l=0,r=0: add 1(01) → bitCount[0]++; OR=01=1 < 2
l=0,r=1: add 2(10) → bitCount[1]++; OR=11=3 ≥ 2 → len=2, shrink left
l=1,r=1: remove 1(01) → bitCount[0]--; OR=10=2 ≥ 2 → len=1, shrink
l=2,r=1: l>r, stop. Result = 1 ✓
```

---

## 📝 Problem Description

Given integer array `nums` and integer `k`. Return the length of the shortest non-empty subarray whose bitwise OR is at least `k`, or `-1` if no such subarray exists.

**Example 1:** `nums=[1,2,3], k=2` → `1` (subarray [2] or [3])
**Example 2:** `nums=[2,1,8], k=10` → `3` (entire array: 2|1|8=11)

**Constraints:** `1 ≤ nums.length ≤ 2×10^5`, `1 ≤ nums[i] ≤ 10^9`, `1 ≤ k ≤ 10^9`

---

## 🎯 Interview Tips

1. **Bit count array** / Mảng đếm bit: `bitCount[i]` = số phần tử trong window có bit i bật
2. **OR from bitCount** / OR từ bitCount: `OR = sum of (1 << i) for each i where bitCount[i] > 0`
3. **Remove element** / Xóa phần tử khỏi window: `for each bit of num: if(--bitCount[bit] === 0) turn off that bit in OR`
4. **Shrink when valid** / Thu nhỏ khi thỏa mãn: khi `OR >= k`, cố gắng thu hẹp từ trái để tìm ngắn nhất
5. **Single element** / Phần tử đơn: nếu `nums[i] >= k` thì trả về 1 ngay
6. **Return -1** / Trả -1: nếu OR của toàn bộ mảng < k → không có subarray nào thỏa

---

## 💡 Solutions

### Approach 1: Brute Force — All Subarrays

/\*_ @complexity Time: O(n² × 32) | Space: O(1) _/

```typescript
function shortestSubarrayWithOrKIIBrute(nums: number[], k: number): number {
  const n = nums.length;
  let ans = Infinity;
  for (let l = 0; l < n; l++) {
    let or = 0;
    for (let r = l; r < n; r++) {
      or |= nums[r];
      if (or >= k) {
        ans = Math.min(ans, r - l + 1);
        break;
      }
    }
  }
  return ans === Infinity ? -1 : ans;
}
```

### Approach 2: Sliding Window + Bit Count — Optimal

/\*_ @complexity Time: O(n × 32) | Space: O(32) _/

```typescript
function minimumSubarrayLength(nums: number[], k: number): number {
  const bitCount = new Array(32).fill(0);
  let currentOr = 0;
  let ans = Infinity;
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    // Add nums[right] to window
    for (let b = 0; b < 32; b++) {
      if ((nums[right] >> b) & 1) {
        bitCount[b]++;
        if (bitCount[b] === 1) currentOr |= 1 << b; // new bit set
      }
    }

    // Shrink from left while OR >= k
    while (currentOr >= k) {
      ans = Math.min(ans, right - left + 1);
      // Remove nums[left] from window
      for (let b = 0; b < 32; b++) {
        if ((nums[left] >> b) & 1) {
          bitCount[b]--;
          if (bitCount[b] === 0) currentOr &= ~(1 << b); // bit no longer in window
        }
      }
      left++;
    }
  }
  return ans === Infinity ? -1 : ans;
}
```

---

## 🧪 Test Cases

```typescript
console.log(minimumSubarrayLength([1, 2, 3], 2)); // → 1
console.log(minimumSubarrayLength([2, 1, 8], 10)); // → 3
console.log(minimumSubarrayLength([1, 2], 0)); // → 1
console.log(minimumSubarrayLength([1, 2, 32, 21], 55)); // → 3
console.log(shortestSubarrayWithOrKIIBrute([1, 2, 3], 2)); // → 1
```

---

## Related Problems

| Problem                                                                                                                                      | Difficulty | Pattern               |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Shortest Subarray With OR at Least K I](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-i)                               | Easy       | Sliding Window        |
| [Longest Nice Subarray](https://leetcode.com/problems/longest-nice-subarray)                                                                 | Medium     | Sliding Window + Bits |
| [Subarray With Elements Greater Than Varying Threshold](https://leetcode.com/problems/subarray-with-elements-greater-than-varying-threshold) | Hard       | Monotonic Stack       |
