---
layout: page
title: "Container With Most Water"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Greedy]
leetcode_url: "https://leetcode.com/problems/container-with-most-water/"
---

# Container With Most Water / Chứa Nhiều Nước Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 🔥 Tier 1 — Bài kinh điển hỏi về Two Pointers ở mọi công ty lớn
> **See also**: [Trapping Rain Water](./20-trapping-rain-water.md) | [3Sum](./12-3sum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn có hai tấm ván dựng đứng và muốn đổ nước vào giữa. Lượng nước chứa được = chiều rộng giữa hai tấm × chiều cao của tấm thấp hơn. Để tối đa, ta bắt đầu với hai tấm xa nhất (chiều rộng max), rồi dịch tấm thấp hơn vào trong — vì dịch tấm cao hơn chỉ làm giảm diện tích.

**Pattern Recognition:**

- Signal: "two lines / two boundaries / maximize area" → **Two Pointers từ hai đầu**
- Greedy key insight: luôn di chuyển con trỏ có chiều cao **nhỏ hơn** — moving the taller pointer can only decrease or maintain area, never increase it
- Width giảm dần khi pointers hội tụ; cơ hội tăng area duy nhất là tăng height

**Visual — Two Pointers on [1, 8, 6, 2, 5, 4, 8, 3, 7]:**

```
Step 1: L=0(h=1), R=8(h=7)  → area = min(1,7) × 8 = 8   → move L (h[L] < h[R])
Step 2: L=1(h=8), R=8(h=7)  → area = min(8,7) × 7 = 49  → move R (h[R] < h[L])
Step 3: L=1(h=8), R=7(h=3)  → area = min(8,3) × 6 = 18  → move R
Step 4: L=1(h=8), R=6(h=8)  → area = min(8,8) × 5 = 40  → move R (tie)
...
Best so far = 49 ✓
```

---

## Problem Description

Given an integer array `height` of length `n`, find two lines that together with the x-axis form a container holding the most water. Return the maximum water area. You may not slant the container.

```
Example 1: height = [1,8,6,2,5,4,8,3,7] → 49  (lines at index 1 and 8)
Example 2: height = [1,1]               → 1
```

Constraints:

- `n == height.length`, `2 <= n <= 10^5`, `0 <= height[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Có được nghiêng container không?" — Can we slant the container? (No — use min height)
2. **Brute force**: Kiểm tra mọi cặp (i, j) — Check all pairs O(n²) / O(1)
3. **Optimize**: Two Pointers — bắt đầu từ hai đầu, dịch pointer nhỏ hơn → O(n) / O(1)
4. **Edge cases**: Tất cả chiều cao bằng nhau → `(n-1) × height[0]`; chỉ 2 phần tử → `min(h[0],h[1])`
5. **Follow-up**: "Tại sao two pointers đảm bảo tìm được max?" — At each step we discard all pairs involving the shorter pointer (proof by contradiction)

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Brute Force — check all pairs
- Time: O(n²) — try every (i, j) combination
- Space: O(1)
  \*/
  function maxAreaBrute(height: number[]): number {
  let max = 0;

for (let i = 0; i < height.length; i++) {
for (let j = i + 1; j < height.length; j++) {
const area = (j - i) \* Math.min(height[i], height[j]);
max = Math.max(max, area);
}
}

return max;
}

/\*\*

- Solution 2: Two Pointers (Optimal)
- Time: O(n) — single pass, each pointer moves at most n times total
- Space: O(1)
-
- Why move the shorter side?
- If we move the taller pointer, width shrinks AND height can only stay ≤ current min.
- So area can only decrease. Moving the shorter pointer gives a chance to find taller wall.
  \*/
  function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

while (left < right) {
const area = (right - left) \* Math.min(height[left], height[right]);
max = Math.max(max, area);

    if (height[left] < height[right]) {
      left++;  // move shorter pointer inward
    } else {
      right--;
    }

}

return max;
}

// === Test Cases ===
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1])); // 1
console.log(maxArea([4, 3, 2, 1, 4])); // 16

{% endraw %}

---

## 🔗 Related Problems

- [Trapping Rain Water](./20-trapping-rain-water.md) — nước đọng giữa nhiều cột, cần xét từng vị trí
- [3Sum](./12-3sum.md) — two pointers sau khi fix một phần tử, cùng pattern thu hẹp phạm vi
