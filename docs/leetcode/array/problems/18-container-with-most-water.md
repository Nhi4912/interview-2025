---
layout: page
title: "Container With Most Water"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Greedy]
leetcode_url: "https://leetcode.com/problems/container-with-most-water/"
leetcode_number: 11
pattern: "Two Pointers"
frequency_tier: 1
companies: [Amazon, Google, Meta, Goldman Sachs]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Container With Most Water / Chứa Nhiều Nước Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 🔥 Tier 1 — Bài kinh điển hỏi về Two Pointers ở mọi công ty lớn
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Google, Meta, Goldman Sachs
> **See also**: [Trapping Rain Water](./20-trapping-rain-water.md) | [3Sum](./12-3sum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng hai tấm ván dựng đứng — lượng nước chứa = chiều rộng × chiều cao tấm thấp hơn. Bắt đầu với hai tấm xa nhất (width max), rồi dịch tấm thấp hơn vào trong — vì dịch tấm cao hơn chỉ làm giảm diện tích.

**Pattern Recognition:**

- Signal: "two lines / maximize area" → **Two Pointers từ hai đầu**
- Greedy: luôn di chuyển con trỏ có chiều cao **nhỏ hơn** — moving taller pointer can only decrease area
- Width giảm khi pointers hội tụ; cơ hội tăng area duy nhất là tăng height

**Visual — Two Pointers on [1, 8, 6, 2, 5, 4, 8, 3, 7]:**

```
L=0(1), R=8(7)  → area = min(1,7)×8 = 8   → move L (shorter)
L=1(8), R=8(7)  → area = min(8,7)×7 = 49  → move R (shorter)
L=1(8), R=7(3)  → area = min(8,3)×6 = 18  → move R
L=1(8), R=6(8)  → area = min(8,8)×5 = 40  → move R
Best = 49 ✓
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                      |
| ---------------- | ------------------------------------------------------------- |
| **When you see** | "two boundaries", "maximize area", "container", "two lines"   |
| **Think**        | Two Pointers from both ends — move the shorter side inward    |
| **Template**     | `while (l < r) { area = (r-l)*min(h[l],h[r]); move shorter }` |
| **Time target**  | ⏱️ 20 min (Medium)                                            |

> 💡 **Memory hook / Móc nhớ:** "Ván thấp giới hạn nước — dịch ván thấp vào, hy vọng gặp ván cao hơn!"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have an array of heights representing vertical lines.
> We need to find two lines that form the container holding the most water.
> Clarification: Water level = min of two heights, width = distance between them?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Brute force: check all pairs — O(n²).
> But I notice: start from widest (left=0, right=n-1). Area = width × min height.
> Moving the taller pointer can't help — width shrinks and height stays ≤ min.
> So always move the shorter pointer. Two Pointers: O(n) time, O(1) space."

### Step 3 — Implement / Viết Code (5-7 min)

> "Initialize left=0, right=n-1, maxArea=0.
> While left < right: compute area, update max, move the shorter pointer inward."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace [1,8,6,2,5,4,8,3,7]: L=0(1),R=8(7) → area=8, move L.
> L=1(8),R=8(7) → area=49, move R. ... Best=49. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — each pointer moves at most n times. Space: O(1).
> Edge cases: two elements → min×1; all equal heights → (n-1)×h.
> Why correct? Moving shorter: proof by contradiction — all pairs involving shorter are dominated."

---

## 📝 Interview Tips

1. **Clarify**: Can we slant the container? (No — use min height) / Không nghiêng được
2. **Brute force**: Check all pairs O(n²) / Kiểm tra mọi cặp
3. **Optimize**: Two Pointers — start widest, move shorter pointer → O(n) / O(1)
4. **Edge cases**: All heights equal → `(n-1) × h[0]`; only 2 elements → `min(h[0],h[1])`
5. **Follow-up**: Why greedy works? Proof by contradiction — moving taller pointer can't improve area

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                | Why Wrong / Tại sao sai                                             | Fix / Cách sửa                           |
| --- | -------------------------------- | ------------------------------------------------------------------- | ---------------------------------------- |
| 1   | Move the taller pointer          | Width shrinks, height stays ≤ current min → area can't grow         | Always move the shorter pointer          |
| 2   | Confuse with Trapping Rain Water | Container = area between 2 lines; Trapping = sum over all positions | Different formula: area = width × min(h) |
| 3   | Not handling equal heights       | Both pointers have same height — which to move?                     | Move either one (both are valid choices) |

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all pairs
 * Time: O(n²) — try every (i, j) combination
 * Space: O(1)
 */
function maxAreaBrute(height: number[]): number {
  let max = 0;

  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const area = (j - i) * Math.min(height[i], height[j]);
      max = Math.max(max, area);
    }
  }

  return max;
}

/**
 * Solution 2: Two Pointers (Optimal)
 * Time: O(n) — single pass, each pointer moves at most n times
 * Space: O(1)
 *
 * Why move the shorter side? If we move the taller pointer,
 * width shrinks AND height stays ≤ current min → area can only decrease.
 */
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    max = Math.max(max, area);

    if (height[left] < height[right]) {
      left++;
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
```

---

## 🔗 Related Problems

- [Trapping Rain Water](./20-trapping-rain-water.md) — nước đọng giữa nhiều cột, xét từng vị trí
- [3Sum](./12-3sum.md) — two pointers sau khi fix một phần tử, cùng pattern thu hẹp phạm vi

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
