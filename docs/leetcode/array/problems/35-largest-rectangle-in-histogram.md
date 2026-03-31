---
layout: page
title: "Largest Rectangle in Histogram"
difficulty: Hard
category: Array
tags: [Array, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/largest-rectangle-in-histogram"
---

# Largest Rectangle in Histogram / Hình Chữ Nhật Lớn Nhất Trong Biểu Đồ Cột

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Monotonic Stack
> **Frequency**: ⭐ Tier 2 — Gặp ở 25+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Hãy tưởng tượng bạn đứng ở một tòa nhà trong dãy phố. Mỗi tòa nhà có chiều cao khác nhau. Bạn muốn trải tấm bạt che từ tòa này sang tòa khác — tấm bạt chỉ được cao bằng tòa thấp nhất trong khoảng. Monotonic stack giúp biết ngay: cột nào là "tường chắn" bên trái và phải cho mỗi chiều cao.

**Pattern Recognition:**

- Signal: "cho mỗi phần tử, tìm phần tử smaller/larger đầu tiên ở trái/phải" → **Monotonic Stack**
- Khi pop phần tử `h` khỏi stack vì gặp cột thấp hơn → ta biết chính xác boundary của rectangle có height=h
- Width = current_index - stack_top_after_pop - 1

**Visual — heights = [2, 1, 5, 6, 2, 3]:**

```
Heights: [2, 1, 5, 6, 2, 3]
         ───────────────────
i=0: push 0       stack=[0]       (h=[2])
i=1: h[1]=1 < h[0]=2 → POP 0
       area = 2*(1-(-1)-1) = 2*1 = 2. maxArea=2
     push 1        stack=[1]      (h=[1])
i=2: 5>1 push 2   stack=[1,2]    (h=[1,5])
i=3: 6>5 push 3   stack=[1,2,3]  (h=[1,5,6])
i=4: h[4]=2 < h[3]=6 → POP 3
       area = 6*(4-2-1) = 6*1 = 6. maxArea=6
     h[4]=2 < h[2]=5 → POP 2
       area = 5*(4-1-1) = 5*2 = 10. maxArea=10
     push 4        stack=[1,4]    (h=[1,2])
i=5: 3>2 push 5   stack=[1,4,5]  (h=[1,2,3])
End: flush stack
     POP 5: area = 3*(6-4-1) = 3*1 = 3
     POP 4: area = 2*(6-1-1) = 2*4 = 8
     POP 1: area = 1*(6-(-1)-1) = 1*6 = 6
Answer: 10 ✅
```

---

## Problem Description

Cho mảng `heights` biểu diễn chiều cao các cột trong biểu đồ (mỗi cột rộng 1 đơn vị), tìm diện tích hình chữ nhật lớn nhất có thể vẽ bên trong biểu đồ. ([LeetCode 84](https://leetcode.com/problems/largest-rectangle-in-histogram))

Difficulty: Hard | Acceptance: 47.4%

```
Example 1: heights = [2,1,5,6,2,3] → 10  (hình chữ nhật rộng 2, cao 5)
Example 2: heights = [2,4]         → 4
Example 3: heights = [1]           → 1
```

Constraints:

- `1 <= heights.length <= 10^5`
- `0 <= heights[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Heights có thể bằng 0 không? Mảng có thể có 1 phần tử?" / Can heights be 0? Single element array?
2. **Brute force**: "Với mỗi cặp (i,j), tìm min height rồi tính area — O(n²)" / For each pair find min height, O(n²)
3. **Key insight**: "Với mỗi cột, hình chữ nhật lớn nhất dùng cột đó làm chiều cao mở rộng đến đâu?" / For each bar as height, how far can it extend?
4. **Stack trick**: "Stack lưu chỉ số, maintain monotonic increasing → pop khi gặp cột thấp hơn" / Stack stores indices of increasing heights, pop on shorter bar
5. **Sentinel**: "Thêm sentinel height=0 vào cuối để flush stack tự động" / Append 0 to heights to auto-flush stack at end
6. **Width formula**: "Width = i - stack[top-1] - 1 (sau khi pop)" / Width = i - new_stack_top - 1 after popping

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Name: Check All Pairs
 * Time: O(n²) — fix left bound, scan right
 * Space: O(1)
 */
function largestRectangleBrute(heights: number[]): number {
  let maxArea = 0;
  for (let i = 0; i < heights.length; i++) {
    let minH = heights[i];
    for (let j = i; j < heights.length; j++) {
      minH = Math.min(minH, heights[j]);
      maxArea = Math.max(maxArea, minH * (j - i + 1));
    }
  }
  return maxArea;
}

/**
 * Solution 2: Monotonic Stack  ← OPTIMAL
 * Name: Monotonic Increasing Stack
 * Time: O(n) — each element pushed/popped once
 * Space: O(n) — stack
 */
function largestRectangleInHistogram(heights: number[]): number {
  const stack: number[] = []; // stores indices
  let maxArea = 0;
  // Append sentinel 0 to flush remaining elements
  const h = [...heights, 0];

  for (let i = 0; i < h.length; i++) {
    while (stack.length > 0 && h[i] < h[stack[stack.length - 1]]) {
      const height = h[stack.pop()!];
      const left = stack.length > 0 ? stack[stack.length - 1] : -1;
      const width = i - left - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }

  return maxArea;
}

// === Test Cases ===
console.log(largestRectangleInHistogram([2, 1, 5, 6, 2, 3])); // 10
console.log(largestRectangleInHistogram([2, 4])); // 4
console.log(largestRectangleInHistogram([1])); // 1
console.log(largestRectangleInHistogram([0])); // 0
console.log(largestRectangleInHistogram([3, 3, 3])); // 9
```

---

## 🔗 Related Problems

| Problem                                                                        | Relationship                        |
| ------------------------------------------------------------------------------ | ----------------------------------- |
| [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle)           | Uses this exact solution row by row |
| [Maximal Square](https://leetcode.com/problems/maximal-square)                 | Same matrix DP idea                 |
| [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water)       | Same monotonic stack thinking       |
| [Car Fleet](https://leetcode.com/problems/car-fleet)                           | Monotonic stack pattern             |
| [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i) | Core monotonic stack skill          |
