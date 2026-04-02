---
layout: page
title: "Minimum Moves to Make Array Complementary"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-moves-to-make-array-complementary"
---

# Minimum Moves to Make Array Complementary / Số Bước Tối Thiểu Để Làm Mảng Bổ Sung

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VN:** Với mỗi cặp `(a, b)` (a ≤ b), số lần di chuyển cần thiết phụ thuộc vào tổng đích T:

- `[2, a]`: 2 moves; `[a+1, a+b]`: 1 move; `a+b`: 0 moves; `[a+b+1, b+limit]`: 1 move; `[b+limit+1, 2*limit]`: 2 moves.
  Dùng mảng hiệu (difference array) trên khoảng `[2, 2*limit]`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Moves to Make Array Complementary example:**

```
Ranges on T for pair (a=1, b=3), limit=4:
[2,1]  → 2 moves (base)
[2,4]  → subtract 1 → 1 move
 [4]   → subtract 1 → 0 moves
[5,7]  → still 1 move (add back 1 at position 5, add 1 at 8)
```

---

---

## Problem Description

| Problem                                                             | Difficulty | Pattern          |
| ------------------------------------------------------------------- | ---------- | ---------------- |
| [Range Addition](https://leetcode.com/problems/range-addition/)     | 🟡 Medium  | Difference Array |
| [Car Pooling](https://leetcode.com/problems/car-pooling/)           | 🟡 Medium  | Difference Array |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | 🟡 Medium  | Sweep Line       |

---

## 📝 Interview Tips

- 🇻🇳 Base = n (n/2 cặp × 2 bước mỗi cặp). Dùng diff array để trừ dần.
- 🇺🇸 Start from base = n (each of n/2 pairs costs 2), use diff array to subtract.
- 🇻🇳 Cho mỗi cặp: trừ 1 trong `[a+1, b+limit]`, trừ 1 thêm tại `a+b`.
- 🇺🇸 Per pair: -1 over `[a+1, b+limit]`, then -1 more at exactly `a+b`.
- 🇻🇳 Prefix sum qua diff array để tìm giá trị nhỏ nhất trong khoảng `[2, 2*limit]`.
- 🇺🇸 Run prefix sum over diff array and track minimum across `[2, 2*limit]`.

---

---

## Solutions

```typescript
/**
 * For each mirror pair, mark savings on diff array; find min with prefix sum.
 * Time: O(n + limit) | Space: O(limit)
 */
function minMoves(nums: number[], limit: number): number {
  const n = nums.length;
  // diff indexed [0 .. 2*limit+1], covering target sums [2 .. 2*limit]
  const diff = new Array<number>(2 * limit + 2).fill(0);

  for (let i = 0; i < n / 2; i++) {
    const a = Math.min(nums[i], nums[n - 1 - i]);
    const b = Math.max(nums[i], nums[n - 1 - i]);

    // Range [a+1, b+limit]: 1 move (subtract 1 from base of 2)
    diff[a + 1] -= 1;
    diff[b + limit + 1] += 1;

    // Exact target a+b: 0 moves (subtract 1 more)
    diff[a + b] -= 1;
    diff[a + b + 1] += 1;
  }

  // Base cost = n (each of n/2 pairs needs 2 moves)
  let cur = 0,
    ans = Infinity;
  for (let t = 2; t <= 2 * limit; t++) {
    cur += diff[t];
    ans = Math.min(ans, n + cur);
  }

  return ans;
}

console.log(minMoves([1, 2, 4, 3], 4)); // 1
console.log(minMoves([1, 2, 2, 1], 2)); // 0
console.log(minMoves([1, 2, 1, 2], 2)); // 0

/**
 * For each pair record exact 0-move target and 1-move range in a map.
 * Slightly less elegant but shows the logic clearly.
 * Time: O(n + limit) | Space: O(n)
 */
function minMoves2(nums: number[], limit: number): number {
  const n = nums.length;
  const delta = new Map<number, number>();

  const add = (k: number, v: number) => delta.set(k, (delta.get(k) ?? 0) + v);

  for (let i = 0; i < n / 2; i++) {
    const a = Math.min(nums[i], nums[n - 1 - i]);
    const b = Math.max(nums[i], nums[n - 1 - i]);

    add(2, 2); // start region at T=2 with cost 2
    add(a + 1, -1); // cost drops to 1 at T=a+1
    add(a + b, -1); // cost drops to 0 at T=a+b
    add(a + b + 1, 1); // cost back to 1 at T=a+b+1
    add(b + limit + 1, 1); // cost back to 2 at T=b+limit+1
  }

  let cur = 0,
    ans = Infinity;
  for (let t = 2; t <= 2 * limit; t++) {
    cur += delta.get(t) ?? 0;
    ans = Math.min(ans, cur);
  }

  return ans;
}

console.log(minMoves2([1, 2, 4, 3], 4)); // 1
console.log(minMoves2([1, 2, 2, 1], 2)); // 0
```

---

## 🔗 Related Problems

| Problem                                                             | Difficulty | Pattern          |
| ------------------------------------------------------------------- | ---------- | ---------------- |
| [Range Addition](https://leetcode.com/problems/range-addition/)     | 🟡 Medium  | Difference Array |
| [Car Pooling](https://leetcode.com/problems/car-pooling/)           | 🟡 Medium  | Difference Array |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | 🟡 Medium  | Sweep Line       |
