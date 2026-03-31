---
layout: page
title: "Number of Visible People in a Queue"
difficulty: Hard
category: Array
tags: [Array, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/number-of-visible-people-in-a-queue"
---

# Number of Visible People in a Queue / Số Người Nhìn Thấy Trong Hàng Chờ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng ở cuối hàng rạp chiếu phim nhìn về phía trước. Bạn chỉ nhìn thấy người đứng trước mình nếu không có ai cao hơn hoặc bằng họ chặn tầm nhìn. Duyệt từ phải sang trái với stack đơn điệu giảm — khi gặp người cao hơn đỉnh stack, tất cả người thấp hơn bị chặn (nhưng họ đã được đếm khi pop ra).

**Pattern Recognition:**

- Signal: "how many people can person i see to their right" → **Monotonic Decreasing Stack** (process right-to-left)
- Each pop represents one person visible (the shorter person that gets "blocked" by current person)
- After all pops, if stack still has elements, one more taller person is visible at the top

**Visual — `heights = [10, 6, 8, 5, 11, 9]`:**

```
Process right → left, maintain decreasing stack:

i=5 h=9:  stack=[]     → 0 visible, push 9   stack=[9]
i=4 h=11: 11>9→pop(9)  → 1 pop, stack=[] → 0 rem → ans[4]=1, push 11  stack=[11]
i=3 h=5:  5<11         → 0 pops, stack=[11] has top → ans[3]=1, push 5  stack=[11,5]
i=2 h=8:  8>5→pop(5)   → 1 pop, 8<11 stop → stack=[11] has top → ans[2]=2, push 8  stack=[11,8]
i=1 h=6:  6<8          → 0 pops, stack=[11,8] has top → ans[1]=1, push 6  stack=[11,8,6]
i=0 h=10: 10>6→pop,10>8→pop → 2 pops, 10<11 stop → top → ans[0]=3, push 10

Answer: [3,1,2,1,1,0] ✅
```

---

## Problem Description

Given an array `heights` of distinct integers representing people's heights in a queue (left=front, right=back), return an array `answer` where `answer[i]` is the number of people person `i` can see to their right. Person `i` can see person `j` (i < j) if everyone between them is shorter than both `heights[i]` and `heights[j]`.

**Example 1:** `heights = [10,6,8,5,11,9]` → `[3,1,2,1,1,0]`

**Example 2:** `heights = [5,1,2,3,10]` → `[4,1,1,1,0]`

Constraints:

- `1 <= heights.length <= 10^5`
- `1 <= heights[i] <= 10^5`; all heights are **distinct**

---

## 📝 Interview Tips

1. **Clarify**: "Tất cả heights đều distinct — không có người cao bằng nhau" / Confirm all heights are distinct (simplifies logic)
2. **Brute force**: "Với mỗi người, scan toàn bộ phía phải — O(n²)" / For each person scan right maintaining running max; O(n²)
3. **Key insight**: "Người bị pop khỏi stack chính là người nhìn thấy được, rồi bị chặn" / A person popped from stack was visible to current, then blocked
4. **Stack direction**: "Duyệt từ phải sang trái, stack giảm theo chiều từ dưới lên" / Process right-to-left; stack stores heights in decreasing order bottom-to-top
5. **Count rule**: "Mỗi pop = 1 visible; nếu sau pop còn người trong stack = 1 thêm" / pops + (1 if stack non-empty after all pops)
6. **Complexity**: "O(n) — mỗi người push/pop đúng 1 lần" / Each height pushed and popped at most once → amortized O(1) per person

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — scan right with visibility tracking
 * Time: O(n²) — for each person, scan all people to the right
 * Space: O(1) extra
 */
function canSeePersonsCountBrute(heights: number[]): number[] {
  const n = heights.length;
  const ans = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let maxSoFar = 0;
    for (let j = i + 1; j < n; j++) {
      if (heights[j] > maxSoFar) {
        ans[i]++; // can see person j (they're taller than all between i and j)
        maxSoFar = heights[j];
        if (heights[j] > heights[i]) break; // no one beyond can be seen (blocked by j)
      }
    }
  }
  return ans;
}

/**
 * Solution 2: Optimized — Monotonic Decreasing Stack (right-to-left)
 * Process from right to left, maintaining a monotonically decreasing stack.
 * For person i:
 *   - Pop all shorter people (each pop = 1 visible person)
 *   - If stack still has someone after pops → that taller person is also visible (+1)
 * Time: O(n) — each height pushed and popped at most once
 * Space: O(n) — stack
 */
function canSeePersonsCount(heights: number[]): number[] {
  const n = heights.length;
  const ans = new Array(n).fill(0);
  const stack: number[] = []; // stores heights, monotonically decreasing

  for (let i = n - 1; i >= 0; i--) {
    let visible = 0;

    // Each person popped is visible to person i (shorter, then blocked by heights[i])
    while (stack.length > 0 && stack[stack.length - 1] < heights[i]) {
      stack.pop();
      visible++;
    }

    // If stack still has someone, person i can also see that taller person
    if (stack.length > 0) visible++;

    ans[i] = visible;
    stack.push(heights[i]);
  }

  return ans;
}

// === Test Cases ===
console.log(canSeePersonsCount([10, 6, 8, 5, 11, 9])); // [3,1,2,1,1,0]
console.log(canSeePersonsCount([5, 1, 2, 3, 10])); // [4,1,1,1,0]
console.log(canSeePersonsCount([1, 2, 3, 4, 5])); // [1,1,1,1,0]  (ascending — each sees only next)
console.log(canSeePersonsCount([5, 4, 3, 2, 1])); // [1,1,1,1,0]  (descending — each sees only next)
console.log(canSeePersonsCount([3])); // [0]  (single person, no one to see)
```
