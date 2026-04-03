---
layout: page
title: "Reaching Points"
difficulty: Hard
category: Math
tags: [Math]
leetcode_url: "https://leetcode.com/problems/reaching-points"
---

# Reaching Points / Điểm Đích Có Thể Đạt Được

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Math — Work Backwards
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Pow(x, n)](https://leetcode.com/problems/powx-n) | [Happy Number](https://leetcode.com/problems/happy-number)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Tưởng tượng bạn đứng ở đích `(tx, ty)` và muốn quay ngược về `(sx, sy)`. Thay vì đi tiến với vô số nhánh, bạn đi lùi — mỗi lần trừ số nhỏ hơn khỏi số lớn hơn. Giống Euclid GCD: dùng modulo để nhảy nhiều bước cùng lúc thay vì trừ từng bước.

**Pattern Recognition:**

- Signal: "can we reach A from B with specific operations" → thử **work backwards**
- Forward: BFS/DFS có nhánh mũ → TLE. Backward: mỗi bước xác định duy nhất
- Nếu `tx > ty`: `tx` chỉ có thể đến từ `(tx - ty, ty)` — dùng `tx % ty` để nhảy nhanh
- Edge case: khi `ty == sy`, `tx` phải giảm xuống `sx` theo bội số của `ty`

**Visual — Backward reduction (sx=1, sy=1, tx=3, ty=5):**

```
Forward (too many branches):      Backward (unique path):
(1,1)-->(2,1)-->(3,1)...          (3,5)  ty>tx → ty=5%3=2
     \->(1,2)-->(3,2)...          (3,2)  tx>ty → tx=3%2=1
     \->(1,3)...                  (1,2)  ty>tx → ty=2%1=0? No, ty>sy: ty=2%1=0...
                                  Use: ty>tx → ty=(ty-sy)%tx==0 check
                                  (1,2): tx==sx=1, (2-1)%1==0 ✓ → true
```

---

## Problem Description

Given starting point `(sx, sy)` and target `(tx, ty)`, return `true` if you can reach `(tx, ty)` from `(sx, sy)`. Each move: `(x, y) → (x+y, y)` or `(x, y) → (x, x+y)`. ([LeetCode 780](https://leetcode.com/problems/reaching-points))

Difficulty: Hard | Acceptance: 33.6%

- **Example 1**: sx=1, sy=1, tx=3, ty=5 → `true`
- **Example 2**: sx=1, sy=1, tx=2, ty=2 → `false`
- **Example 3**: sx=1, sy=1, tx=1, ty=1 → `true`

Constraints: `1 ≤ sx, sy, tx, ty ≤ 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "tx, ty có thể bằng sx, sy không?" / Can tx==sx and ty==sy? (yes → immediately true)
2. **Forward vs Backward**: "BFS sẽ TLE; đi ngược cho hành trình duy nhất" / Forward is exponential; backward is deterministic
3. **Modulo shortcut**: "`tx % ty` nhảy nhiều bước trừ cùng lúc — như Euclidean GCD" / Modulo collapses identical subtractions
4. **Edge case**: "Nếu `ty == sy`, `tx` phải giảm đến `sx` theo bội số `ty`" / Fixed-coordinate divisibility check
5. **Symmetry**: "tx > ty và ty > tx được xử lý đối xứng nhau" / Both branches are symmetric
6. **Follow-up**: "Nếu có thêm phép trừ? Nếu cho phép nhân?" / How does adding subtraction change the problem?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force BFS (TLE for large inputs — educational only)
 * Time: O(tx * ty) — exponential branching
 * Space: O(tx * ty) — queue size
 */
function reachingPointsBFS(sx: number, sy: number, tx: number, ty: number): boolean {
  const queue: [number, number][] = [[sx, sy]];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (x === tx && y === ty) return true;
    if (x > tx || y > ty) continue;
    const key = `${x},${y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    queue.push([x + y, y], [x, x + y]);
  }
  return false;
}

/**
 * Solution 2: Optimal — Work Backwards with Modulo
 * Time: O(log(max(tx, ty))) — like Euclidean GCD
 * Space: O(1)
 *
 * Go backwards from (tx, ty): the larger was always produced by adding the smaller.
 * Use modulo to skip many identical steps at once.
 * When one coordinate equals the source, check divisibility for the other.
 */
function reachingPoints(sx: number, sy: number, tx: number, ty: number): boolean {
  while (tx >= sx && ty >= sy) {
    if (tx === sx && ty === sy) return true;

    if (tx > ty) {
      if (ty === sy) return (tx - sx) % ty === 0;
      tx = tx % ty;
    } else {
      if (tx === sx) return (ty - sy) % tx === 0;
      ty = ty % tx;
    }
  }
  return false;
}

// === Test Cases ===
console.log(reachingPoints(1, 1, 3, 5)); // true
console.log(reachingPoints(1, 1, 2, 2)); // false
console.log(reachingPoints(1, 1, 1, 1)); // true
console.log(reachingPoints(3, 3, 12, 9)); // true
console.log(reachingPoints(1, 1, 1000000000, 1)); // true
```

---

## 🔗 Related Problems

- [Happy Number](https://leetcode.com/problems/happy-number) — repeated transformation until cycle or target
- [Pow(x, n)](https://leetcode.com/problems/powx-n) — logarithmic reduction via repeated halving
- [Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings) — Euclidean-style backward reasoning
- [Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem) — reachability via math (GCD condition)
- [Reaching Points — LeetCode](https://leetcode.com/problems/reaching-points) — problem page
