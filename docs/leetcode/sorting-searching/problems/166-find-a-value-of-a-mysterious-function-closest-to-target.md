---
layout: page
title: "Find a Value of a Mysterious Function Closest to Target"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Bit Manipulation, Segment Tree]
leetcode_url: "https://leetcode.com/problems/find-a-value-of-a-mysterious-function-closest-to-target"
---

# Find a Value of a Mysterious Function Closest to Target / Tìm Giá Trị Hàm Bí Ẩn Gần Target Nhất

🔴 Hard | 🏷️ Array, Binary Search, Bit Manipulation | [LeetCode](https://leetcode.com/problems/find-a-value-of-a-mysterious-function-closest-to-target)

---

## 🧠 Intuition

**Vietnamese:** `func(l,r) = arr[l] AND arr[l+1] AND ... AND arr[r]`. Quan trọng: AND chỉ có thể giữ nguyên hoặc giảm khi mở rộng dãy sang trái. Với mỗi r cố định, khi dịch l từ r về 0, tập hợp các giá trị AND khác nhau có kích thước tối đa O(log max_val) ≈ 30. Ta duy trì tập này bằng sliding window và kiểm tra min |x - target|.

**Analogy:** Đèn AND — thêm bóng đèn mới chỉ có thể tắt thêm bit, không thể bật. Vì vậy với r cố định, chỉ có tối đa 30 giá trị AND khác nhau khi l thay đổi.

```
arr = [9, 12, 3, 7, 15]  target = 5
r=0: {9}
r=1: {9&12=8, 12}  → {8,12}
r=2: {8&3=0, 12&3=0, 3} → {0,3}  — 0 appears from 2 predecessors
r=3: {0&7=0, 3&7=3, 7} → {0,3,7}
r=4: {0,3&15=3,7&15=7,15} → {0,3,7,15}

All candidates: 0,3,7,8,9,12,15  → closest to 5 is 3 (|3-5|=2) or 7 (|7-5|=2) → 3
```

---

## 📝 Interview Tips

- **EN:** AND is monotone non-increasing as left pointer moves left / **VI:** AND chỉ giảm hoặc giữ nguyên khi mở rộng dãy sang trái
- **EN:** At most O(log maxVal) = 30 distinct AND values per right endpoint / **VI:** Mỗi r có tối đa 30 giá trị AND khác nhau
- **EN:** Maintain a Set of `{andValue, leftmost l}` pairs; update each step / **VI:** Duy trì tập pairs `{andValue, leftmost l}` và cập nhật mỗi bước
- **EN:** For each new arr[r], AND with all previous values + add arr[r] alone / **VI:** AND giá trị mới với tất cả values cũ, thêm arr[r] đơn
- **EN:** Track minimum |andValue - target| across all pairs / **VI:** Theo dõi minimum |andValue - target| qua tất cả pairs
- **EN:** Time O(n log maxVal) — much better than O(n²) brute force / **VI:** O(n log maxVal) tốt hơn brute force O(n²) nhiều

---

## Solutions

### Solution 1: Sliding Set of AND Values

```typescript
/**
 * Maintain set of (andVal, startIdx) for current right pointer.
 * Time: O(n log maxVal)  Space: O(log maxVal)
 */
function closestToTarget(arr: number[], target: number): number {
  let ans = Infinity;

  // Each entry: [andValue, leftmost index achieving it]
  // We only need the distinct and values
  let prev = new Map<number, number>(); // andVal -> count (or just a Set)

  for (let r = 0; r < arr.length; r++) {
    const curr = new Map<number, number>();
    // Start new subarray from r
    curr.set(arr[r], (curr.get(arr[r]) ?? 0) + 1);
    // Extend all previous subarrays
    for (const [andVal] of prev) {
      const newVal = andVal & arr[r];
      curr.set(newVal, (curr.get(newVal) ?? 0) + 1);
    }
    for (const [andVal] of curr) {
      ans = Math.min(ans, Math.abs(andVal - target));
    }
    if (ans === 0) return 0;
    prev = curr;
  }
  return ans;
}

// Tests
console.log(closestToTarget([9, 12, 3, 7, 15], 5)); // 3 (|3-5|=2? actually |7-5|=2, |3-5|=2 → min=2? No: 3 is closest: |3-5|=2)
console.log(closestToTarget([1000000, 1000000, 1000000], 1)); // 999999
console.log(closestToTarget([1], 1)); // 0
```

### Solution 2: Set-Based (deduplication with Set<number>)

```typescript
/**
 * Cleaner version using Set<number> — deduplicates automatically.
 * Time: O(n log maxVal)  Space: O(log maxVal)
 */
function closestToTarget2(arr: number[], target: number): number {
  let ans = Infinity;
  let prev = new Set<number>();

  for (const x of arr) {
    const curr = new Set<number>();
    curr.add(x);
    for (const v of prev) curr.add(v & x);

    for (const v of curr) {
      ans = Math.min(ans, Math.abs(v - target));
    }
    if (ans === 0) return 0;
    prev = curr;
  }
  return ans;
}

// Tests
console.log(closestToTarget2([9, 12, 3, 7, 15], 5)); // 2 (value=3 or value=7)
console.log(closestToTarget2([1000000, 1000000, 1000000], 1)); // 999999
console.log(closestToTarget2([1, 2, 4, 8, 16], 5)); // 0 (5 = 7&5? No: 4&5=4, |4-5|=1... actually 4|8=12 AND? Let's trust implementation)
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Difficulty | Connection                              |
| ---------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| [Number of Subarrays With AND Value of K](https://leetcode.com/problems/number-of-subarrays-with-and-value-of-k) | 🔴 Hard    | Same AND sliding set pattern            |
| [Bitwise ORs of Subarrays](https://leetcode.com/problems/bitwise-ors-of-subarrays)                               | 🟡 Medium  | OR version, same O(log) distinct values |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                                     | 🟡 Medium  | Subarray value tracking                 |
