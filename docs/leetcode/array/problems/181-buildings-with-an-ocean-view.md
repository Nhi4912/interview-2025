---
layout: page
title: "Buildings With an Ocean View"
difficulty: Medium
category: Array
tags: [Array, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/buildings-with-an-ocean-view"
---

# Buildings With an Ocean View / Những Tòa Nhà Có Tầm Nhìn Ra Biển

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VN:** Biển ở phía phải. Một tòa nhà có tầm nhìn ra biển khi không có tòa nhà nào cao hơn hoặc bằng nó ở phía phải. Quét từ phải sang trái, theo dõi chiều cao lớn nhất đã gặp.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Buildings With an Ocean View example:**

```
heights = [4, 2, 3, 1]
           ↑           ← quét từ phải

i=3: h=1, maxRight=0 → 1>0 ✓ [3]
i=2: h=3, maxRight=1 → 3>1 ✓ [3,2]
i=1: h=2, maxRight=3 → 2≤3 ✗
i=0: h=4, maxRight=3 → 4>3 ✓ [3,2,0]
Result (reversed): [0,2,3]
```

---

---

## Problem Description

| Problem                                                                                         | Difficulty | Pattern         |
| ----------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)                         | 🟡 Medium  | Monotonic Stack |
| [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)                 | 🟢 Easy    | Monotonic Stack |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | 🔴 Hard    | Monotonic Stack |

---

## 📝 Interview Tips

- 🇻🇳 Quét từ phải → trái: tòa nhà nào cao hơn `maxRight` đều có tầm nhìn.
- 🇺🇸 Right-to-left scan: a building has ocean view iff its height > all heights to its right.
- 🇻🇳 Sau khi thu thập, đảo ngược mảng kết quả để có thứ tự tăng dần.
- 🇺🇸 Reverse the collected indices at the end to return in ascending order.
- 🇻🇳 Stack đơn điệu cũng hoạt động: pop khi phần tử cao hơn, push sau đó.
- 🇺🇸 A monotonic stack also works: pop shorter buildings when a taller one arrives.

---

---

## Solutions

```typescript
/**
 * Track running max from the right; collect buildings taller than max so far.
 * Time: O(n) | Space: O(n) for result
 */
function findBuildings(heights: number[]): number[] {
  const result: number[] = [];
  let maxRight = 0;

  for (let i = heights.length - 1; i >= 0; i--) {
    if (heights[i] > maxRight) {
      result.push(i);
      maxRight = heights[i];
    }
  }

  return result.reverse();
}

console.log(findBuildings([4, 2, 3, 1])); // [0, 2, 3]
console.log(findBuildings([4, 3, 2, 1])); // [0, 1, 2, 3]
console.log(findBuildings([1, 3, 2, 4])); // [3]
console.log(findBuildings([2, 2, 2, 2])); // [3]

/**
 * Use a stack maintaining decreasing order; pop buildings blocked by taller ones.
 * Time: O(n) | Space: O(n)
 */
function findBuildings2(heights: number[]): number[] {
  const stack: number[] = []; // indices with ocean view so far

  for (let i = 0; i < heights.length; i++) {
    // Pop all buildings shorter than or equal to current (they lose ocean view)
    while (stack.length > 0 && heights[stack[stack.length - 1]] <= heights[i]) {
      stack.pop();
    }
    stack.push(i);
  }

  return stack;
}

console.log(findBuildings2([4, 2, 3, 1])); // [0, 2, 3]
console.log(findBuildings2([4, 3, 2, 1])); // [0, 1, 2, 3]
console.log(findBuildings2([1, 3, 2, 4])); // [3]

/**
 * Precompute suffix max; building i has view iff heights[i] > suffixMax[i+1].
 * Time: O(n) | Space: O(n)
 */
function findBuildings3(heights: number[]): number[] {
  const n = heights.length;
  const suffixMax = new Array<number>(n + 1).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    suffixMax[i] = Math.max(heights[i], suffixMax[i + 1]);
  }

  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    if (heights[i] > suffixMax[i + 1]) result.push(i);
  }

  return result;
}

console.log(findBuildings3([4, 2, 3, 1])); // [0, 2, 3]
console.log(findBuildings3([2, 2, 2, 2])); // [3]
```

---

## 🔗 Related Problems

| Problem                                                                                         | Difficulty | Pattern         |
| ----------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)                         | 🟡 Medium  | Monotonic Stack |
| [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)                 | 🟢 Easy    | Monotonic Stack |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | 🔴 Hard    | Monotonic Stack |
