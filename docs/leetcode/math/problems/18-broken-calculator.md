---
layout: page
title: "Broken Calculator"
difficulty: Medium
category: Math
tags: [Math, Greedy]
leetcode_url: "https://leetcode.com/problems/broken-calculator"
---

# Broken Calculator / Máy Tính Hỏng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy (Work Backwards)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) | [Jump Game](https://leetcode.com/problems/jump-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Thay vì đi từ start → target (nhiều nhánh), hãy đi ngược từ target → start. Từ target: nếu chẵn thì chia 2 (đảo ngược của ×2), nếu lẻ thì +1 (đảo ngược của −1). Khi target ≤ start, chỉ cần trừ dần.

**Pattern Recognition:**

- Signal: "minimum operations" + "×2 or −1" → **Greedy backward traversal**
- Forward: nhiều nhánh, exponential states. Backward: target dẫn về start theo đường duy nhất
- Key insight: nếu target lẻ, phải +1 trước khi chia 2 (không thể chia 2 số lẻ nguyên)

**Visual — startValue=3, target=10:**

```
Forward:  3 → 6 → 5 → 10            (×2, −1, ×2) = 3 ops
Backward: 10 → 5 → 4 → 3           (÷2, +1, ÷2... wait)
Backward: 10÷2=5(1), 5+1=6(2), 6÷2=3(3) → reaches start → 3 ops ✅
```

---

## Problem Description

On a broken calculator displaying `startValue`, each operation either multiplies by 2 or subtracts 1. Return the minimum number of operations to reach `target`. ([LeetCode #991](https://leetcode.com/problems/broken-calculator))

Difficulty: Medium | Acceptance: 55.1%

- **Example 1**: `start=2, target=3` → `2` (2×2=4, 4−1=3)
- **Example 2**: `start=5, target=8` → `2` (5×2=10, 10−1−1=8 → 3? No: 5−1=4, 4×2=8 → 2 ops)
- **Example 3**: `start=3, target=10` → `3`

Constraints:

- `1 ≤ startValue, target ≤ 10⁹`

---

## 📝 Interview Tips

1. **Clarify**: "Chỉ có 2 operations: ×2 và −1, không có +1 hay ÷2?" / Confirm only ×2 and −1 are allowed (not +1 or /2)
2. **Forward issue**: "Đi xuôi tạo ra cây quyết định rộng — khó optimize" / Forward BFS is too wide to be efficient
3. **Backward trick**: "Đi ngược từ target: chẵn → ÷2 (greedy); lẻ → +1 rồi ÷2" / Reverse ops shrink target deterministically
4. **Base case**: "Khi target ≤ start, không cần ×2 nữa — chỉ cần trừ (start − target) lần" / When target ≤ start, only subtract needed
5. **Why greedy?**: "Nếu target lẻ, ta phải dùng −1 ít nhất 1 lần trước khi có thể ÷2 — +1 là lựa chọn duy nhất hợp lý" / Odd target must be made even before halving
6. **Edge cases**: `start = target` → 0 ops; `start > target` → `start - target` ops

---

## Solutions

```typescript
/**
 * Solution 1: BFS / Simulation (Forward) — TLE for large inputs
 * Time: O(target) — too slow for 10^9
 * Space: O(target)
 */
function brokenCalculatorBFS(startValue: number, target: number): number {
  if (startValue >= target) return startValue - target;
  const queue: [number, number][] = [[startValue, 0]];
  const seen = new Set<number>([startValue]);
  while (queue.length) {
    const [cur, ops] = queue.shift()!;
    if (cur === target) return ops;
    for (const next of [cur * 2, cur - 1]) {
      if (next === target) return ops + 1;
      if (next > 0 && next <= target * 2 && !seen.has(next)) {
        seen.add(next);
        queue.push([next, ops + 1]);
      }
    }
  }
  return -1;
}

/**
 * Solution 2: Greedy Backward — Optimal
 * Time: O(log target) — target halves every 2 steps at most
 * Space: O(1) — only counter variable
 *
 * Key: work backwards from target.
 *   - target even  → divide by 2 (reverse of ×2)
 *   - target odd   → add 1 then divide by 2 (make it even first)
 *   - target ≤ start → just subtract: answer += (start - target)
 */
function brokenCalculator(startValue: number, target: number): number {
  let ops = 0;
  while (target > startValue) {
    if (target % 2 === 0) {
      target /= 2;
    } else {
      target += 1; // reverse of subtract 1 going forward
    }
    ops++;
  }
  // target ≤ startValue: only subtract operations remain
  return ops + (startValue - target);
}

// === Test Cases ===
console.log(brokenCalculator(2, 3)); // 2
console.log(brokenCalculator(5, 8)); // 2
console.log(brokenCalculator(3, 10)); // 3
console.log(brokenCalculator(1024, 1)); // 1023
console.log(brokenCalculator(1, 1)); // 0
console.log(brokenCalculator(5, 5)); // 0
```

---

## 🔗 Related Problems

- [Jump Game](https://leetcode.com/problems/jump-game) — greedy reachability
- [Jump Game II](https://leetcode.com/problems/jump-game-ii) — minimum steps with greedy
- [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous) — operation counting
- [Integer Replacement](https://leetcode.com/problems/integer-replacement) — similar ×/÷ transformation minimization
- [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest) — greedy counting
