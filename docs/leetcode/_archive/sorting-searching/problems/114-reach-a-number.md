---
layout: page
title: "Reach a Number"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Binary Search]
leetcode_url: "https://leetcode.com/problems/reach-a-number"
---

# Reach a Number / Đến Một Con Số

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math + Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Sqrt(x)](https://leetcode.com/problems/sqrtx) | [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trò chơi nhảy ô — bước 1 nhảy 1 ô, bước 2 nhảy 2 ô... Bạn có thể nhảy trái hoặc phải. Câu hỏi: ít nhất mấy bước để đến đích? Thay vì simulate, hãy nhận ra rằng tổng sau n bước là `S = n(n+1)/2`, và ta cần `S - target` chia hết cho 2 (vì "lật" một bước i từ + thành - thay đổi S đúng 2i).

**Pattern Recognition:**

- Signal: "minimum steps to reach target on number line" + "step size = step number" → **Math**
- Bài toán đối xứng: `target < 0` thì làm với `-target` (lấy absolute value)
- Key insight: tìm n nhỏ nhất sao cho `S = n(n+1)/2 ≥ target` VÀ `(S - target) % 2 == 0`

**Visual — target = 3:**

```
Step 1: +1 → pos=1,  S=1
Step 2: +2 → pos=3 ✓ (hit target in 2 steps!)

target = 5:
Step 1: S=1 < 5
Step 2: S=3 < 5
Step 3: S=6 ≥ 5, (6-5)=1 odd → keep going
Step 4: S=10 ≥ 5, (10-5)=5 odd → keep going
Step 5: S=15 ≥ 5, (15-5)=10 even ✓ → answer = 5
(flip step 5: -5+1+2+3+4 = 5 ✓)
```

---

## Problem Description

You are at position 0 on the number line. At step `i` (1-indexed) you can move `+i` or `-i`. Return the **minimum number of steps** to reach integer `target`. ([LeetCode 754](https://leetcode.com/problems/reach-a-number))

Difficulty: Medium | Acceptance: 43.9%

```
Example 1: target = 3   → 2  (steps: +1, +2 = 3)
Example 2: target = 2   → 3  (steps: +1, +2, -3 = 0? No. +1, -2, +3 = 2 ✓)
Example 3: target = -3  → 2  (symmetric, same as target=3)
```

Constraints: `-10^9 ≤ target ≤ 10^9`

---

## 📝 Interview Tips

1. **Symmetry / Đối xứng**: "target âm thì làm với |target| — bài toán hoàn toàn symmetric"
2. **Condition 1 / Điều kiện 1**: S = n(n+1)/2 ≥ target (tổng phải đủ lớn để "vươn tới")
3. **Condition 2 / Điều kiện 2**: (S - target) % 2 == 0 (phần dư chẵn mới flip được một bước)
4. **Why parity? / Tại sao chẵn?**: Flip bước i từ +i thành -i làm S giảm 2i → chỉ thay đổi chẵn
5. **Loop at most 3 steps / Không quá 3 bước**: Khi S ≥ target, check parity; nếu lẻ thì n++ và kiểm tra lại (tối đa 2-3 lần)
6. **Complexity / Độ phức tạp**: O(√target) để tìm n từ S = n(n+1)/2 ≈ target

---

## Solutions

```typescript
/**
 * Solution 1: Simulation — increment step by step
 * Time: O(√target)  Space: O(1)
 */
function reachNumberSimulation(target: number): number {
  target = Math.abs(target);
  let sum = 0,
    step = 0;
  while (sum < target || (sum - target) % 2 !== 0) {
    step++;
    sum += step;
  }
  return step;
}

/**
 * Solution 2: Math (Optimal) — find n via quadratic formula, adjust parity
 * Time: O(1) amortized (at most 3 increments after initial estimate)  Space: O(1)
 *
 * S = n(n+1)/2 ≥ target  ⟹  n ≥ (-1 + sqrt(1 + 8*target)) / 2
 * Then increment n until (S - target) % 2 == 0.
 * Note: at most 2 increments needed (parity cycles every 2 steps).
 */
function reachNumber(target: number): number {
  target = Math.abs(target);
  // Start with minimum n where n(n+1)/2 >= target
  let n = Math.ceil((-1 + Math.sqrt(1 + 8 * target)) / 2);
  let sum = (n * (n + 1)) / 2;
  // Ensure sum >= target (floating point safety)
  while (sum < target) {
    n++;
    sum += n;
  }
  // Now adjust for parity: need (sum - target) even
  while ((sum - target) % 2 !== 0) {
    n++;
    sum += n;
  }
  return n;
}

/**
 * Solution 3: Binary Search variant — binary search on n, then fix parity
 * Time: O(log(target))  Space: O(1)
 */
function reachNumberBS(target: number): number {
  target = Math.abs(target);
  let lo = 1,
    hi = 2 * target + 2;
  // Find minimum n where n(n+1)/2 >= target
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if ((mid * (mid + 1)) / 2 >= target) hi = mid;
    else lo = mid + 1;
  }
  let n = lo;
  let sum = (n * (n + 1)) / 2;
  while ((sum - target) % 2 !== 0) {
    n++;
    sum += n;
  }
  return n;
}

// === Tests ===
console.log(reachNumber(3)); // 2
console.log(reachNumber(2)); // 3
console.log(reachNumber(-3)); // 2
console.log(reachNumber(5)); // 5
console.log(reachNumber(0)); // 0
console.log(reachNumberSimulation(3)); // 2
console.log(reachNumberBS(5)); // 5
```

---

## 🔗 Related Problems

| Problem                                                               | Relationship                           |
| --------------------------------------------------------------------- | -------------------------------------- |
| [754. Reach a Number](https://leetcode.com/problems/reach-a-number)   | This problem                           |
| [69. Sqrt(x)](https://leetcode.com/problems/sqrtx)                    | Math + binary search on integer answer |
| [263. Ugly Number](https://leetcode.com/problems/ugly-number)         | Math-based number theory               |
| [1. Two Sum](https://leetcode.com/problems/two-sum)                   | Classic pairing problem                |
| [780. Reaching Points](https://leetcode.com/problems/reaching-points) | Similar reachability on number plane   |
