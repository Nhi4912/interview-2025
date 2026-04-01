---
layout: page
title: "Shortest Subarray With OR at Least K I"
difficulty: Easy
category: Array
tags: [Array, Bit Manipulation, Sliding Window]
leetcode_url: "https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-i"
---

# Shortest Subarray With OR at Least K I / Mảng Con Ngắn Nhất Có OR Ít Nhất K (I)

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Subarray With OR at Least K II](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-ii) | [Longest Nice Subarray](https://leetcode.com/problems/longest-nice-subarray)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy hình dung bạn đang chọn các lá bài có số nhị phân. Phép OR giống như "gộp" các lá — một khi bit đã bật thì không tắt được trong cùng cửa sổ. Vì n ≤ 200 (nhỏ), có thể thử mọi cặp (l,r) với O(n²). Nhưng hiểu sliding window để áp dụng cho version II.

**Pattern Recognition:**

- Signal: "shortest subarray", OR operation, `n ≤ 200` (Easy version) → **Brute O(n²)** + optional sliding window
- Key insight: OR tích lũy — một khi thêm phần tử OR chỉ tăng hoặc giữ nguyên → có thể early-break

**Visual — nums=[2,1,8], k=10:**

```
l=0:
  r=0: OR=2  < 10
  r=1: OR=3  < 10
  r=2: OR=11 ≥ 10 → len=3

l=1:
  r=1: OR=1  < 10
  r=2: OR=9  < 10  (1|8=9)

l=2:
  r=2: OR=8  < 10

Best = 3 (full array 2|1|8=11≥10)
```

---

## 📝 Problem Description

Given integer array `nums` and integer `k`. Return the length of the shortest non-empty subarray whose bitwise OR is at least `k`, or `-1` if no such subarray exists.

**Example 1:** `nums=[1,2,3], k=2` → `1` (subarray [2] or [3])
**Example 2:** `nums=[2,1,8], k=10` → `3` (entire array: 2|1|8=11)

**Constraints:** `1 ≤ nums.length ≤ 200`, `1 ≤ nums[i] ≤ 1000`, `1 ≤ k ≤ 1000`

---

## 🎯 Interview Tips

1. **OR is monotone** / OR đơn điệu tăng: khi mở rộng subarray, OR chỉ tăng → early break khi OR ≥ k
2. **Brute O(n²) OK** / n ≤ 200 → O(n²) an toàn: 200² = 40K phép tính
3. **Single element check** / Kiểm tra phần tử đơn: nếu `nums[i] >= k` → trả về 1 ngay
4. **-1 case** / Trường hợp -1: nếu OR toàn mảng < k → không có subarray nào thỏa
5. **Difference from II** / Khác với version II: version I n nhỏ hơn nhiều → O(n²) đủ
6. **Upgrade path** / Nâng cấp: hiểu bit-count trick để xử lý version II (n=2×10^5)

---

## 💡 Solutions

### Approach 1: Brute Force — All Subarrays with Early Break

/\*_ @complexity Time: O(n²) | Space: O(1) _/

```typescript
function shortestSubarrayOrKBrute(nums: number[], k: number): number {
  const n = nums.length;
  let ans = Infinity;

  for (let l = 0; l < n; l++) {
    let or = 0;
    for (let r = l; r < n; r++) {
      or |= nums[r];
      if (or >= k) {
        ans = Math.min(ans, r - l + 1);
        break; // OR can only grow, so this is already shortest for this l
      }
    }
  }
  return ans === Infinity ? -1 : ans;
}
```

### Approach 2: Sliding Window + Bit Count — Scalable

/\*_ @complexity Time: O(n × 32) | Space: O(32) _/

```typescript
function minimumSubarrayLengthI(nums: number[], k: number): number {
  const bitCount = new Array(32).fill(0);
  let currentOr = 0;
  let ans = Infinity;
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    // Add nums[right] to window
    for (let b = 0; b < 32; b++) {
      if ((nums[right] >> b) & 1) {
        if (++bitCount[b] === 1) currentOr |= 1 << b;
      }
    }

    // Shrink left while OR still satisfies condition
    while (currentOr >= k) {
      ans = Math.min(ans, right - left + 1);
      for (let b = 0; b < 32; b++) {
        if ((nums[left] >> b) & 1) {
          if (--bitCount[b] === 0) currentOr &= ~(1 << b);
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
console.log(shortestSubarrayOrKBrute([1, 2, 3], 2)); // → 1
console.log(shortestSubarrayOrKBrute([2, 1, 8], 10)); // → 3
console.log(shortestSubarrayOrKBrute([1, 2], 4)); // → -1 (1|2=3 < 4)
console.log(minimumSubarrayLengthI([1, 2, 3], 2)); // → 1
console.log(minimumSubarrayLengthI([2, 1, 8], 10)); // → 3
```

---

## Related Problems

| Problem                                                                                                          | Difficulty | Pattern               |
| ---------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Shortest Subarray With OR at Least K II](https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-ii) | Medium     | Sliding Window + Bits |
| [Longest Nice Subarray](https://leetcode.com/problems/longest-nice-subarray)                                     | Medium     | Sliding Window + Bits |
| [Maximum AND Subarray](https://leetcode.com/problems/maximum-and-subarray)                                       | -          | Bit Manipulation      |
