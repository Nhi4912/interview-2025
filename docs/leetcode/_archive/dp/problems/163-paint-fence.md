---
layout: page
title: "Paint Fence"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/paint-fence"
---

# Paint Fence / Sơn Hàng Rào

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Không được sơn 3 cột liên tiếp cùng màu. Chia trạng thái thành:

- `same[i]`: cột i và i-1 cùng màu (có k cách)
- `diff[i]`: cột i khác màu so với i-1 (có k-1 cách mỗi trạng thái trước)

**EN:** Track two states: last two posts same colour (`same`) vs different (`diff`).
Constraint: no three consecutive same → can't extend `same` again.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Paint Fence example:**

```
n=3, k=2

       post1   post2    post3
same:   —      1 way    diff[2] ways  (post3 = post2)
diff:   —      1 way    (same[2]+diff[2])*(k-1) ways

same[i] = diff[i-1]                  (post i copies post i-1, only legal if i-1 was diff)
diff[i] = (same[i-1] + diff[i-1]) * (k-1)   (post i picks any other colour)
total[i] = same[i] + diff[i]
```

---

## Problem Description

| Problem                                                                                  | Difficulty | Key Idea               |
| ---------------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [256. Paint House](https://leetcode.com/problems/paint-house/)                           | 🟡 Medium  | Row colour DP          |
| [198. House Robber](https://leetcode.com/problems/house-robber/)                         | 🟡 Medium  | Adjacent constraint DP |
| [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)                    | 🟢 Easy    | Fibonacci DP           |
| [746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) | 🟢 Easy    | Linear DP              |

---

## 📝 Interview Tips

- 🔑 **EN:** `same[i] = diff[i-1]` — can only match previous if previous pair was different.
  **VI:** `same[i] = diff[i-1]` — chỉ khớp màu trước nếu cặp trước đã khác nhau.
- 🔑 **EN:** `diff[i] = (same[i-1] + diff[i-1]) * (k-1)` — choose any of k-1 other colours.
  **VI:** `diff[i] = (same[i-1] + diff[i-1]) * (k-1)` — chọn 1 trong k-1 màu còn lại.
- 🔑 **EN:** Base case: `same[1]=0, diff[1]=k` (first post can be any colour, "diff" by default).
  **VI:** Cơ sở: `same[1]=0, diff[1]=k` (cột đầu tự do, gán vào diff).
- 🔑 **EN:** Only two variables needed — O(1) space.
  **VI:** Chỉ cần hai biến — không gian O(1).
- 🔑 **EN:** For n=1 return k; for n=2 return k*k.
  **VI:** Với n=1 trả k; n=2 trả k*k.
- 🔑 **EN:** Alternative: total[i] = (total[i-1]) _ (k-1) + (k-1) _ diff[i-2] — simplifies to k*(k-1)^(n-1).
  **VI:** Rút gọn thành công thức: k*(k-1)^(n-1) — kiểm tra lại bằng DP.

---

## Solutions

```typescript
/**
 * Paint Fence
 * same[i] = diff[i-1]
 * diff[i] = (same[i-1] + diff[i-1]) * (k-1)
 * Time: O(n)  Space: O(1)
 */
function numWays(n: number, k: number): number {
  if (n === 0) return 0;
  if (n === 1) return k;

  let same = 0; // last two posts same colour
  let diff = k; // first post: k choices, treat as "diff" base

  for (let i = 2; i <= n; i++) {
    const newSame = diff;
    const newDiff = (same + diff) * (k - 1);
    same = newSame;
    diff = newDiff;
  }

  return same + diff;
}

console.log(numWays(3, 2)); // 6
console.log(numWays(1, 1)); // 1
console.log(numWays(7, 2)); // 42
console.log(numWays(2, 4)); // 16

/**
 * total[i] = (k-1) * (total[i-1] + total[i-2])
 * Derived by substituting same/diff recurrence.
 * Time: O(n)  Space: O(1)
 */
function numWays2(n: number, k: number): number {
  if (n === 0) return 0;
  if (n === 1) return k;
  if (n === 2) return k * k;

  let prev2 = k; // total[1]
  let prev1 = k * k; // total[2]

  for (let i = 3; i <= n; i++) {
    const cur = (k - 1) * (prev1 + prev2);
    prev2 = prev1;
    prev1 = cur;
  }

  return prev1;
}

console.log(numWays2(3, 2)); // 6
console.log(numWays2(1, 1)); // 1
console.log(numWays2(7, 2)); // 42

/**
 * Mathematical: k * (k-1)^(n-1)
 * Valid because at each fence post after the first,
 * there are exactly (k-1) valid colour choices.
 * Time: O(n)  Space: O(1)  [or O(log n) with fast exponentiation]
 */
function numWays3(n: number, k: number): number {
  if (n === 0) return 0;
  return k * Math.pow(k - 1, n - 1);
}

console.log(numWays3(3, 2)); // 6
console.log(numWays3(7, 2)); // 42 — matches DP
```

---

## 🔗 Related Problems

| Problem                                                                                  | Difficulty | Key Idea               |
| ---------------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [256. Paint House](https://leetcode.com/problems/paint-house/)                           | 🟡 Medium  | Row colour DP          |
| [198. House Robber](https://leetcode.com/problems/house-robber/)                         | 🟡 Medium  | Adjacent constraint DP |
| [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)                    | 🟢 Easy    | Fibonacci DP           |
| [746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) | 🟢 Easy    | Linear DP              |
