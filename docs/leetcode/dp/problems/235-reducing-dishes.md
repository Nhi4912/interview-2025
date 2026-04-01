---
layout: page
title: "Reducing Dishes"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/reducing-dishes"
---

# Reducing Dishes / Giảm Số Món Ăn

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy + Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | [Minimize the Maximum Difference of Pairs](https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Bạn là bếp trưởng và phải chọn thứ tự nấu món ăn. Khách chấm điểm = thứ tự × độ ngon. Bí quyết: sort tăng dần, sau đó thêm món từ phải sang trái (món ngon nhất nấu cuối). Mỗi lần thêm 1 món vào đầu, TẤT CẢ các món đã chọn đều bị đẩy chỉ số lên 1 — tức là điểm tăng thêm đúng bằng tổng độ ngon của các món đang giữ. Tiếp tục khi lợi ích > 0.

**Pattern Recognition:**

- Signal: maximize sum of `i * satisfaction[i]` with optional element removal → **Greedy from right**
- Key insight: Sort ascending. Keep a running `suffix_sum`. Add dishes from right as long as `suffix_sum > 0` after including the new dish. Each addition shifts all selected dishes one slot right, increasing score by `suffix_sum`.

**Visual — satisfaction=[-1,-8,0,5,-9] example:**

```
Sorted: [-9, -8, -1, 0, 5]

Start from right, accumulate suffix_sum:
  Add 5:  suffix_sum = 5  > 0 → total += 5   = 5
  Add 0:  suffix_sum = 5  > 0 → total += 5   = 10  (5 shifts right to pos 2)
  Add -1: suffix_sum = 4  > 0 → total += 4   = 14  (0,5 shift right)
  Add -8: suffix_sum =-4 ≤ 0 → STOP

Selected: [-1, 0, 5] at positions [1, 2, 3]
Score: 1×(-1) + 2×0 + 3×5 = -1 + 0 + 15 = 14  ✓
```

---

## 📝 Problem Description

A chef can cook dishes in any order. The "like-time coefficient" of dish `i` is `time(i) × satisfaction(i)` where `time(i)` is its cooking order (1-indexed). The chef may discard any dishes. Maximize the sum of like-time coefficients.

- **Example 1:** `satisfaction=[-1,-8,0,5,-9]` → `14`
- **Example 2:** `satisfaction=[4,3,2]` → `20` (`2×1 + 3×2 + 4×3`)
- **Constraints:** `1 ≤ n ≤ 500`, `-10^3 ≤ satisfaction[i] ≤ 10^3`

---

## 🎯 Interview Tips

1. **Sort first** / Sort trước: để tối ưu thì nấu món ngon cuối — sort tăng dần, thêm từ cuối lên đầu
2. **Greedy insight** / Mẹo tham lam: thêm món vào đầu danh sách → mọi món đang có tăng thứ tự lên 1 → điểm tăng thêm = suffix_sum
3. **Stop condition** / Điều kiện dừng: nếu `suffix_sum + món_mới ≤ 0` thì thêm món đó chỉ làm giảm tổng
4. **Why Hard tag?** / Tại sao Hard?: insight sort + greedy không hiển nhiên; DP solution cũng hoạt động nhưng chậm hơn
5. **DP alternative** / DP thay thế: `dp[i]` = max score dùng dishes từ i..n-1 khi dish đầu tiên ở thứ tự j — O(n²)
6. **All negative** / Tất cả âm: nếu tất cả satisfaction âm, answer = 0 (nấu 0 món)

---

## 💡 Solutions

### Approach 1: DP — O(n²)

/\*_ @complexity Time: O(n²) | Space: O(n) _/

```typescript
function maxSatisfactionDP(satisfaction: number[]): number {
  satisfaction.sort((a, b) => a - b);
  const n = satisfaction.length;
  // dp[i] = max score when we cook dishes i..n-1 and dish i is served at time 1
  let res = 0;
  for (let i = 0; i < n; i++) {
    let score = 0;
    for (let j = i; j < n; j++) {
      score += (j - i + 1) * satisfaction[j];
    }
    res = Math.max(res, score);
  }
  return res;
}
```

### Approach 2: Greedy with Suffix Sum — Optimal

/\*_ @complexity Time: O(n log n) | Space: O(1) _/

```typescript
function maxSatisfaction(satisfaction: number[]): number {
  satisfaction.sort((a, b) => a - b);
  let suffixSum = 0; // sum of selected dishes' satisfaction values
  let total = 0; // running like-time coefficient total

  // Scan from right (highest satisfaction first)
  for (let i = satisfaction.length - 1; i >= 0; i--) {
    // Adding dish i shifts all previous dishes one time slot forward
    // The gain from adding dish i = suffixSum + satisfaction[i]
    if (suffixSum + satisfaction[i] <= 0) break; // no benefit
    suffixSum += satisfaction[i];
    total += suffixSum; // equivalent to: total = new sum with dish i at position 1
  }

  return total;
}
```

### Approach 3: Greedy — Explicit accumulation (same O(n log n), more readable)

/\*_ @complexity Time: O(n log n) | Space: O(1) _/

```typescript
function maxSatisfactionClear(satisfaction: number[]): number {
  satisfaction.sort((a, b) => b - a); // descending: best first
  let total = 0,
    running = 0;
  // Keep adding dishes as long as the marginal gain (running + next) > 0
  for (const s of satisfaction) {
    running += s;
    if (running <= 0) break; // adding this dish (and shifting others) hurts
    total += running;
  }
  return total;
}
```

---

## 🧪 Test Cases

```typescript
console.log(maxSatisfaction([-1, -8, 0, 5, -9])); // → 14
console.log(maxSatisfaction([4, 3, 2])); // → 20  (sort: 2,3,4 → 1×2+2×3+3×4)
console.log(maxSatisfaction([-1, -4, -5])); // → 0   (all negative, cook nothing)
console.log(maxSatisfaction([1])); // → 1
console.log(maxSatisfaction([-3, 3])); // → 3   (just cook dish with value 3)
```

---

## Related Problems

| Problem                                                                                          | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Two City Scheduling](https://leetcode.com/problems/two-city-scheduling)                         | Medium     | Greedy + Sorting |
| [IPO](https://leetcode.com/problems/ipo)                                                         | Hard       | Greedy + Heap    |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)             | Medium     | Greedy           |
| [Greatest Sum Divisible by Three](https://leetcode.com/problems/greatest-sum-divisible-by-three) | Medium     | DP               |
