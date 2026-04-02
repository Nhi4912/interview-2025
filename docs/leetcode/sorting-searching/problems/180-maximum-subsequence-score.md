---
layout: page
title: "Maximum Subsequence Score"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximum-subsequence-score"
---

# Maximum Subsequence Score / Điểm Số Dãy Con Lớn Nhất

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** Score = (sum of chosen nums1 values) × (minimum nums2 value). Sort indices by nums2 descending — as we iterate, nums2[i] becomes the current minimum multiplier. Maintain a min-heap of size k on nums1 values to maximize their sum. Update answer at each step where heap size reaches k.

**VI:** Điểm = (tổng các giá trị nums1 chọn) × (giá trị nhỏ nhất nums2 tương ứng). Sắp xếp theo nums2 giảm dần — khi duyệt, nums2[i] là hệ số nhân nhỏ nhất hiện tại. Dùng min-heap kích thước k trên nums1 để tối đa tổng. Cập nhật kết quả khi heap đủ k phần tử.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Subsequence Score example:**

```
nums1=[1,3,3,2]  nums2=[2,1,3,4]  k=3

Sort by nums2 desc: idx → [3(4), 2(3), 0(2), 1(1)]

i=3: heap=[2], sum=2. size<k, skip
i=2: heap=[2,3], sum=5. size<k, skip
i=0: heap=[1,2,3], sum=6. size==3 → score=6×2=12  ← min of nums2 so far is 2
i=1: heap=[2,3,3] (evict 1, add 3), sum=8. size==3 → score=8×1=8

Max = 12 ✓

Min-heap lets us evict the smallest nums1 value to maximize sum.
```

---

---

## Problem Description

| #   | Problem                         | Difficulty | Pattern         |
| --- | ------------------------------- | ---------- | --------------- |
| 1   | K Closest Points to Origin      | 🟡 Medium  | heap top-k      |
| 2   | IPO                             | 🔴 Hard    | two-heap greedy |
| 3   | Find K Pairs with Smallest Sums | 🟡 Medium  | heap + sorting  |

---

## 📝 Interview Tips

- 📊 **EN:** Sorting by nums2 descending means the minimum nums2 encountered so far is always `nums2[i]` (current iteration). **VI:** Sắp xếp nums2 giảm dần → giá trị nhỏ nhất nums2 đến thời điểm hiện tại luôn là `nums2[i]`.
- 🔢 **EN:** Use a min-heap of size k: when adding a new nums1 value, if heap size exceeds k, remove the minimum. **VI:** Heap min kích thước k: khi thêm phần tử mới, nếu heap vượt k thì loại bỏ phần tử nhỏ nhất.
- ✅ **EN:** Only record answer when heap exactly has k elements (after potentially evicting one). **VI:** Chỉ cập nhật kết quả khi heap đúng k phần tử.
- 🧮 **EN:** Track running sum alongside heap — avoids re-summing heap contents each iteration. **VI:** Duy trì tổng chạy cùng heap — tránh tính lại tổng mỗi bước.
- ⚠️ **EN:** JavaScript has no built-in priority queue — implement min-heap or use sorted array trick. **VI:** JavaScript không có priority queue tích hợp — cần tự cài min-heap.
- 🎯 **EN:** Greedy correctness: once nums2[i] is the multiplier, picking the k largest nums1 values from indices 0..i maximizes the sum factor. **VI:** Tính đúng đắn: khi nums2[i] là hệ số, chọn k giá trị nums1 lớn nhất trong 0..i tối đa hoá tổng.

---

---

## Solutions

```typescript
/**
 * Sort by nums2 desc; maintain min-heap of k nums1 values.
 * Time: O(n log k)  Space: O(k)
 */
function maxScore(nums1: number[], nums2: number[], k: number): number {
  const n = nums1.length;
  // Sort indices by nums2 descending
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => nums2[b] - nums2[a]);

  // Min-heap operations
  const heap: number[] = [];

  function heapPush(val: number): void {
    heap.push(val);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p] <= heap[i]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  }

  function heapPop(): number {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l] < heap[s]) s = l;
        if (r < heap.length && heap[r] < heap[s]) s = r;
        if (s === i) break;
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      }
    }
    return top;
  }

  let sum = 0,
    ans = 0;
  for (const i of order) {
    heapPush(nums1[i]);
    sum += nums1[i];
    if (heap.length > k) sum -= heapPop(); // evict smallest
    if (heap.length === k) ans = Math.max(ans, sum * nums2[i]);
  }
  return ans;
}

// Tests
console.log(maxScore([1, 3, 3, 2], [2, 1, 3, 4], 3)); // 12
console.log(maxScore([4, 2, 3, 1, 1], [7, 5, 10, 9, 6], 1)); // 30  (idx=2: 3×10)

/**
 * Try all combinations of k indices — only feasible for small n.
 * Used to verify Solution 1 is correct.
 * Time: O(C(n,k) * k)  Space: O(k)
 */
function maxScoreBrute(nums1: number[], nums2: number[], k: number): number {
  const n = nums1.length;
  let best = 0;

  function combine(start: number, chosen: number[]): void {
    if (chosen.length === k) {
      const minN2 = Math.min(...chosen.map((i) => nums2[i]));
      const sumN1 = chosen.reduce((s, i) => s + nums1[i], 0);
      best = Math.max(best, sumN1 * minN2);
      return;
    }
    for (let i = start; i < n; i++) {
      chosen.push(i);
      combine(i + 1, chosen);
      chosen.pop();
    }
  }

  combine(0, []);
  return best;
}

// Verify
console.log(maxScoreBrute([1, 3, 3, 2], [2, 1, 3, 4], 3)); // 12
console.log(maxScoreBrute([4, 2, 3, 1, 1], [7, 5, 10, 9, 6], 1)); // 30

// Cross-check
const t1 = [1, 3, 3, 2],
  t2 = [2, 1, 3, 4];
console.log(maxScore(t1, t2, 3) === maxScoreBrute(t1, t2, 3)); // true
```

---

## 🔗 Related Problems

| #   | Problem                         | Difficulty | Pattern         |
| --- | ------------------------------- | ---------- | --------------- |
| 1   | K Closest Points to Origin      | 🟡 Medium  | heap top-k      |
| 2   | IPO                             | 🔴 Hard    | two-heap greedy |
| 3   | Find K Pairs with Smallest Sums | 🟡 Medium  | heap + sorting  |
