---
layout: page
title: "Find the Number of Good Pairs II"
difficulty: Medium
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/find-the-number-of-good-pairs-ii"
---

# Find the Number of Good Pairs II / Tìm Số Cặp Tốt II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map / Divisor Enumeration

---

## 🧠 Intuition / Trực Giác

**VI:** Cho hai mảng `nums1`, `nums2` và số `k`. Đếm cặp (i,j) sao cho `nums1[i] % (nums2[j] * k) == 0`. Thay vì kiểm tra từng cặp O(n*m), với mỗi `nums1[i]` ta liệt kê tất cả ước số của nó, rồi kiểm tra ước nào bằng `nums2[j]*k` thông qua hash map.

**EN:** Count pairs (i,j) where `nums1[i] % (nums2[j] * k) == 0`. Instead of O(n\*m) brute force, for each `nums1[i]` enumerate its divisors in O(sqrt(val)) and look up `divisor/k` in a frequency map of nums2.

```
nums1=[1,3,4], nums2=[1,3,4], k=1
freqMap of nums2: {1:1, 3:1, 4:1}

nums1[i]=4, divisors of 4: 1,2,4
  check 1/k=1 → in map → +1
  check 2/k=2 → not in map
  check 4/k=4 → in map → +1
Total from i=2: 2 pairs
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🟡 **EN:** Key transform: `nums1[i] % (nums2[j]*k) == 0` ↔ `(nums1[i]/k) % nums2[j] == 0` when k divides nums1[i].
  **VI:** Biến đổi: điều kiện tương đương với `nums2[j]` là ước của `nums1[i]/k`.
- 🟡 **EN:** Build a frequency map of nums2 values first, then for each nums1[i] enumerate divisors.
  **VI:** Xây dựng map tần số nums2 trước, rồi liệt kê ước của từng nums1[i].
- 🟡 **EN:** Enumerate divisors up to sqrt(x) — each divisor d gives pair (d, x/d).
  **VI:** Liệt kê ước đến sqrt(x) — mỗi ước d cho cặp (d, x/d).
- 🟡 **EN:** Only consider divisors that are multiples of k.
  **VI:** Chỉ xét ước chia hết cho k.
- 🟡 **EN:** Time O(n*sqrt(max1) + m) where max1 = max(nums1).
  **VI:** Thời gian O(n*sqrt(max1) + m) — tốt hơn brute force O(n\*m).
- 🟡 **EN:** nums2[j]*k can overflow int; use BigInt or check bounds.
  **VI:** nums2[j]*k có thể tràn số; kiểm tra giới hạn.

---

## Solutions / Giải Pháp

### Solution 1: Brute Force — O(n \* m) Time, O(1) Space

```typescript
function numberOfPairs_brute(nums1: number[], nums2: number[], k: number): number {
  let count = 0;
  for (const a of nums1) {
    for (const b of nums2) {
      if (a % (b * k) === 0) count++;
    }
  }
  return count;
}

console.log(numberOfPairs_brute([1, 3, 4], [1, 3, 4], 1)); // 5
console.log(numberOfPairs_brute([1, 2, 4, 12], [2, 4], 3)); // 2
```

### Solution 2: Divisor Enumeration + Hash Map — O(n\*sqrt(max) + m) ✅ Optimal

```typescript
function numberOfPairs(nums1: number[], nums2: number[], k: number): number {
  // Build frequency map for nums2
  const freq = new Map<number, number>();
  for (const b of nums2) {
    freq.set(b, (freq.get(b) ?? 0) + 1);
  }

  let count = 0;
  for (const a of nums1) {
    if (a % k !== 0) continue; // nums1[i] must be divisible by k first
    const reduced = a / k;
    // Enumerate divisors of reduced; check if divisor is in nums2 freq map
    for (let d = 1; d * d <= reduced; d++) {
      if (reduced % d === 0) {
        count += freq.get(d) ?? 0;
        if (d !== reduced / d) {
          count += freq.get(reduced / d) ?? 0;
        }
      }
    }
  }
  return count;
}

// Test cases
console.log(numberOfPairs([1, 3, 4], [1, 3, 4], 1)); // Expected: 5
console.log(numberOfPairs([1, 2, 4, 12], [2, 4], 3)); // Expected: 2
console.log(numberOfPairs([10, 20], [2, 5], 2)); // Expected: 2
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                     | Difficulty | Pattern     |
| ---- | ------------------------------------------- | ---------- | ----------- |
| 3162 | Find the Number of Good Pairs I             | 🟢 Easy    | Hash Map    |
| 2176 | Count Equal and Divisible Pairs in an Array | 🟢 Easy    | Brute Force |
| 1512 | Number of Good Pairs                        | 🟢 Easy    | Hash Map    |
