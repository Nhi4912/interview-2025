---
layout: page
title: "Maximal Score After Applying K Operations"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximal-score-after-applying-k-operations"
---

# maximal score after applying k operations

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang thu hoạch táo từ nhiều cây. Mỗi lần bạn hái tất cả táo từ cây **sai nhất** (nhiều nhất), rồi cây đó mọc lại đúng bằng 1/3 số cũ (làm tròn lên). Bạn hái `k` lần — làm sao tối đa hóa tổng táo thu được? Luôn chọn cây nhiều nhất → **max-heap**.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums = [10, 10, 10, 10, 10]  k = 5

Initial heap (max): [10, 10, 10, 10, 10]

Op 1: pop 10 → score=10,  push ceil(10/3)=4 → heap=[10,10,10,10,4]
Op 2: pop 10 → score=20,  push 4            → heap=[10,10,10,4,4]
Op 3: pop 10 → score=30,  push 4            → heap=[10,10,4,4,4]
Op 4: pop 10 → score=40,  push 4            → heap=[10,4,4,4,4]
Op 5: pop 10 → score=50,  push 4            → heap=[4,4,4,4,4]

Answer: 50 ✓
```

---

## Problem Description

Cho mảng `nums` và số nguyên `k`. Mỗi thao tác: chọn phần tử **lớn nhất** `x` trong `nums`, cộng `x` vào điểm, thay `x` bằng `⌈x/3⌉`. Trả về điểm tối đa sau đúng `k` thao tác.

**Ví dụ 1:**

```
Input:  nums = [10,10,10,10,10], k = 5
Output: 50
```

**Ví dụ 2:**

```
Input:  nums = [1,10,3,3,3], k = 3
Output: 17   // pick 10→score=10, pick 10→wait, pick 3→score=17 (optimal)
```

**Ràng buộc:** `1 ≤ n ≤ 10^5`, `1 ≤ nums[i] ≤ 10^9`, `1 ≤ k ≤ 10^9`

---

## 📝 Interview Tips

1. **Max-heap is natural** — always picking the max is the greedy choice; prove by exchange argument. | Chọn max mỗi lần là greedy tối ưu, chứng minh bằng lập luận hoán đổi.
2. **JS lacks built-in max-heap** — simulate with negation in a min-heap, or use a custom class. | JavaScript không có max-heap sẵn → đảo dấu để dùng min-heap.
3. **`ceil(x/3) === Math.ceil(x/3)`** — be careful with integer division; use `Math.ceil` or `(x + 2) / 3 | 0`. | Cẩn thận khi làm tròn: `(x + 2) / 3 | 0` tránh lỗi floating point.
4. **Large k**: values shrink quickly (divide by 3 each time), so effective k is O(log(max(nums))\*n). | k lớn nhưng giá trị giảm nhanh → vòng lặp thực tế có giới hạn.
5. **Identical max values** — multiple elements at max, any can be chosen; result is the same. | Khi có nhiều phần tử bằng nhau ở max, thứ tự chọn không ảnh hưởng kết quả.
6. **Overflow guard** — k up to 10^9 and nums[i] up to 10^9 → use BigInt or ensure JS number stays < 2^53. | Dùng `BigInt` hoặc kiểm tra tổng không vượt `Number.MAX_SAFE_INTEGER`.

---

## Solutions

```typescript
/**
 * Solution 1: Max-Heap (simulate greedily)
 * @complexity Time O(k·log n), Space O(n)
 */
function maxKelements(nums: number[], k: number): number {
  // Simulate max-heap via negation in a min-heap
  const heap: number[] = nums.map((v) => -v);

  // Build heap (heapify bottom-up)
  const n = heap.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(heap, i, n);

  function siftDown(h: number[], i: number, size: number) {
    while (true) {
      let s = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < size && h[l] < h[s]) s = l;
      if (r < size && h[r] < h[s]) s = r;
      if (s === i) break;
      [h[s], h[i]] = [h[i], h[s]];
      i = s;
    }
  }
  function siftUp(h: number[], i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p] <= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]];
      i = p;
    }
  }

  let score = 0;
  for (let op = 0; op < k; op++) {
    const max = -heap[0];
    score += max;
    heap[0] = -Math.ceil(max / 3);
    siftDown(heap, 0, heap.length);
  }
  return score;
}

/**
 * Solution 2: Sort + Simulate (optimal for small fixed k)
 * Re-sort after each op – only practical for very small k.
 * @complexity Time O(k·n log n), Space O(1)
 */
function maxKelementsSortSim(nums: number[], k: number): number {
  const arr = [...nums];
  let score = 0;
  for (let op = 0; op < k; op++) {
    arr.sort((a, b) => b - a);
    const max = arr[0];
    score += max;
    arr[0] = Math.ceil(max / 3);
  }
  return score;
}

/**
 * Solution 3: Early-exit optimization (values converge to 1 quickly)
 * @complexity Time O(min(k, n·log3(max))·log n), Space O(n)
 */
function maxKelementsOpt(nums: number[], k: number): number {
  const heap: number[] = nums.map((v) => -v);
  const n = heap.length;
  const sift = (i: number) => {
    while (true) {
      let s = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && heap[l] < heap[s]) s = l;
      if (r < n && heap[r] < heap[s]) s = r;
      if (s === i) break;
      [heap[s], heap[i]] = [heap[i], heap[s]];
      i = s;
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) sift(i);

  let score = 0;
  for (let op = 0; op < k; op++) {
    const max = -heap[0];
    score += max;
    if (max === 1) {
      score += k - op - 1;
      break;
    } // all 1s from here
    heap[0] = -Math.ceil(max / 3);
    sift(0);
  }
  return score;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(maxKelements([10, 10, 10, 10, 10], 5)); // 50
console.log(maxKelements([1, 10, 3, 3, 3], 3)); // 17
console.log(maxKelements([756902531, 925994236, 525666703, 918011326, 506024386, 825628996], 3)); // 2751305228 (big)
console.log(maxKelementsSortSim([10, 10, 10, 10, 10], 5)); // 50
console.log(maxKelementsOpt([1, 1, 1], 5)); // 5
```

---

## 🔗 Related Problems

