---
layout: page
title: "Maximize the Topmost Element After K Moves"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/maximize-the-topmost-element-after-k-moves"
---

# Maximize the Topmost Element After K Moves / Tối Đa Phần Tử Đỉnh Sau K Bước

**Difficulty:** Medium | **Category:** Array, Greedy | **LeetCode:** [2202](https://leetcode.com/problems/maximize-the-topmost-element-after-k-moves)

## 🧠 Intuition

> **Như cây bài úp — mỗi bước hoặc lấy đỉnh ra hoặc đặt lại vào.**
> Sau K bước, phần tử nào có thể ngồi trên cùng? Chỉ những phần tử trong tầm với.

```
nums = [5, 2, 2, 4, 0, 6],  k = 4

Có thể remove k lần → sau đó đỉnh mới là nums[k]=nums[4]=0
Hoặc: remove k-1 phần tử → rồi put-back 1 → đỉnh là bất kỳ nums[0..k-2]
Hoặc k=0 → đỉnh vẫn là nums[0]

Candidates: max(nums[0..min(k,n)-1] loại bỏ nums[k-1] nếu k<n,  + nums[k] nếu k<n)
Thực ra: max(nums[0..k-1 ngoại trừ chỉ nums[k-1]? Không!)

Đơn giản hơn:
- max của nums[0..k-1] (remove i rồi put-back top = có thể giữ nums[i] làm đỉnh)
  → trừ khi k==1, ta bắt buộc phải remove nums[0] và không có gì để put-back
- nums[k] nếu k < n (remove đúng k lần)
```

## 📝 Tips

1. **Edge case n=1:** nếu k lẻ → stack rỗng → trả -1; k chẵn → nums[0] không đổi.
2. **Edge case k=0:** không làm gì → trả nums[0].
3. **Remove k lần liên tục:** nếu k < n, đỉnh mới là `nums[k]`.
4. **Remove i lần (i < k) rồi put-back:** đỉnh có thể là bất kỳ `nums[0..i-1]`.
   - Với i ∈ [0, k-1]: khi i=0 push nums[0], khi i>0 push nums[i-1] wait...
   - Thực ra: remove 0..k-1 phần tử, mỗi lần ta có thể put-back. Để nums[j] làm đỉnh sau k bước: cần remove j+1 bước rồi push 1 bước = j+2 bước? Không đơn giản vậy.
   - **Đơn giản hóa:** candidate là `max(nums[0..min(k,n)-1])` (không kể `nums[k-1]` khi k<n vì bước cuối là remove nó) + `nums[k]` nếu k<n.
   - Thực ra window `[0..min(k-1,n-1)]` minus `nums[k-1]` phức tạp. Dùng công thức đơn giản dưới.
5. **Công thức đơn giản:** `max(nums[0..k-2])` union `nums[k]` nếu tồn tại.
6. Với k >= n: chỉ xét max(nums[0..n-1]) nhưng k phải đủ chẵn lẻ để kết thúc với phần tử trên đỉnh.

## 💡 Solutions

```typescript
/**
 * Approach 1: Case analysis with window max
 * Time: O(min(k, n)) | Space: O(1)
 *
 * Key insight: after k moves, the topmost element must come from:
 *   1. nums[k] if k < n (remove exactly k elements)
 *   2. nums[j] for j in [0, k-2] if k-1-j moves remain for push-back cycling
 *      Simplified: any of nums[0..k-2] (remove j+1, push back, use remaining)
 */
function maximumTop(nums: number[], k: number): number {
  const n = nums.length;

  // Edge: empty pile after operations
  if (n === 1 && k % 2 === 1) return -1; // forced to remove the only element
  if (k === 0) return nums[0];

  let best = -1;

  // Option A: remove exactly k elements, top = nums[k]
  if (k < n) best = Math.max(best, nums[k]);

  // Option B: remove i elements (0 ≤ i ≤ k-1), push one back,
  //           leaving i-th element on top after cycling remaining k-1-i steps.
  //           Simplified: nums[0..k-2] are all reachable (indices < k-1 with n elements)
  const limit = Math.min(k - 1, n - 1);
  for (let i = 0; i <= limit; i++) {
    best = Math.max(best, nums[i]);
  }

  return best;
}

console.log(maximumTop([5, 2, 2, 4, 0, 6], 4)); // 5
console.log(maximumTop([2], 1)); // -1  (only element, k odd)
console.log(maximumTop([2], 2)); // 2   (remove then push back)
console.log(maximumTop([1, 2, 3], 0)); // 1   (no moves)
console.log(maximumTop([1], 4)); // 1   (k even, net zero)
```

```typescript
/**
 * Approach 2: Clean formula — max of first min(k,n) excluding nums[k-1] + nums[k]
 * Time: O(min(k,n)) | Space: O(1)
 *
 * Equivalent reformulation: candidates are nums[0..k-1] (window of k from top).
 * But nums[k-1] is ONLY reachable if there's something after it to push back.
 * So take max(nums[0..k-2], nums[k]) where each exists.
 */
function maximumTop2(nums: number[], k: number): number {
  const n = nums.length;
  if (n === 1 && k % 2 === 1) return -1;
  if (k === 0) return nums[0];

  let best = -Infinity;

  // Candidates: nums[0..k-2] (we skip nums[k-1] — last removed, nothing to push)
  for (let i = 0; i < k - 1 && i < n; i++) {
    best = Math.max(best, nums[i]);
  }
  // Candidate: nums[k] (remove exactly k, this is new top)
  if (k < n) best = Math.max(best, nums[k]);

  return best === -Infinity ? -1 : best;
}

console.log(maximumTop2([5, 2, 2, 4, 0, 6], 4)); // 5
console.log(maximumTop2([2], 1)); // -1
console.log(maximumTop2([10, 20], 2)); // 10  (remove 2 → stack empty, push 10? or nums[0..0]=10, nums[2]=undef)
console.log(maximumTop2([3, 5, 1], 3)); // 5
```

## 🔗 Related

| Problem                                                                                                               | Difficulty | Connection                  |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------- |
| [1700. Number of Students Unable to Eat Lunch](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/) | Easy       | Stack/queue simulation      |
| [735. Asteroid Collision](https://leetcode.com/problems/asteroid-collision/)                                          | Medium     | Stack element survival      |
| [456. 132 Pattern](https://leetcode.com/problems/132-pattern/)                                                        | Medium     | Window max in stack context |
