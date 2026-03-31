---
layout: page
title: "Asteroid Collision"
difficulty: Medium
category: Array
tags: [Array, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/asteroid-collision"
---

# Asteroid Collision / Va Chạm Tiểu Hành Tinh

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack Simulation
> **Frequency**: ⭐ Tier 2 — Gặp ở 20+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như xe hơi trên đường cao tốc một chiều — xe đi cùng chiều không đụng nhau, chỉ đụng khi xe đi ngược chiều cùng lane. Xe dương (→) đang đậu trong stack, xe âm (←) đang đến. Nếu xe âm lớn hơn, xe dương bị "loại". Nếu bằng nhau, cả hai biến mất.

**Pattern Recognition:**

- Signal: "collision/matching between opposing elements" → **Stack**
- Chỉ xảy ra va chạm khi: `stack.top > 0` AND `current < 0`
- So sánh `|current|` vs `stack.top`:
  - `|current| > stack.top` → pop stack, tiếp tục kiểm tra
  - `|current| == stack.top` → pop stack, bỏ current (cả hai hủy)
  - `|current| < stack.top` → bỏ current (current thua)

**Visual — asteroids = [5, 10, -5]:**

```
i=0: ast=5  (dương) → push        stack=[5]
i=1: ast=10 (dương) → push        stack=[5, 10]
i=2: ast=-5 (âm, va chạm?)
     top=10, |-5|=5 < 10 → -5 thua, bỏ qua  stack=[5, 10]

Result: [5, 10] ✅

───────────────────────────────────────
asteroids = [8, -8]:
i=0: push 8          stack=[8]
i=1: -8 vs 8, |-8|==8 → bằng nhau, pop 8, bỏ -8  stack=[]
Result: [] ✅

───────────────────────────────────────
asteroids = [10, 2, -5]:
i=0: push 10         stack=[10]
i=1: push 2          stack=[10, 2]
i=2: -5 vs top=2: |-5|=5 > 2 → pop 2  stack=[10]
     -5 vs top=10: |-5|=5 < 10 → -5 thua  stack=[10]
Result: [10] ✅
```

---

## Problem Description

Cho mảng `asteroids` biểu diễn tiểu hành tinh trên một hàng. Giá trị dương = bay sang phải, âm = bay sang trái. Va chạm chỉ xảy ra khi tiểu hành tinh đi ngược chiều. Trả về trạng thái cuối sau tất cả va chạm. ([LeetCode 735](https://leetcode.com/problems/asteroid-collision))

Difficulty: Medium | Acceptance: 45.5%

```
Example 1: [5, 10, -5]    → [5, 10]
Example 2: [8, -8]        → []
Example 3: [10, 2, -5]    → [10]
Example 4: [-2, -1, 1, 2] → [-2, -1, 1, 2]  (không có va chạm)
```

Constraints:

- `2 <= asteroids.length <= 10^4`
- `-1000 <= asteroids[i] <= 1000`
- `asteroids[i] != 0`

---

## 📝 Interview Tips

1. **Clarify**: "Hai tiểu hành tinh cùng chiều có va chạm không? KHÔNG" / Two asteroids going same direction never collide
2. **Collision condition**: "Va chạm CHỈ KHI stack.top > 0 AND current < 0" / Collision only when positive on stack meets incoming negative
3. **Three outcomes**: "Lớn hơn=tiếp tục loop, bằng=pop+skip, nhỏ hơn=skip (push=không va chạm)" / Three outcomes: survive and keep checking, mutual destruction, die
4. **While loop**: "Dùng while để xử lý chain collisions (một asteroid âm có thể destroy nhiều cái dương)" / Use while loop — one negative can destroy multiple positives in sequence
5. **Edge case**: "Tất cả dương, tất cả âm → không va chạm nào" / All positive or all negative — no collisions
6. **Follow-up**: "Nếu va chạm tạo ra mảnh vỡ?" / What if collisions create debris?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force (Simulation)
 * Name: Repeat Until Stable
 * Time: O(n²) — worst case repeat n times
 * Space: O(n)
 */
function asteroidCollisionBrute(asteroids: number[]): number[] {
  let arr = [...asteroids];
  let changed = true;
  while (changed) {
    changed = false;
    const next: number[] = [];
    let i = 0;
    while (i < arr.length) {
      if (i + 1 < arr.length && arr[i] > 0 && arr[i + 1] < 0) {
        changed = true;
        if (arr[i] > -arr[i + 1]) next.push(arr[i]);
        else if (arr[i] < -arr[i + 1]) next.push(arr[i + 1]);
        // equal → both destroyed
        i += 2;
      } else {
        next.push(arr[i++]);
      }
    }
    arr = next;
  }
  return arr;
}

/**
 * Solution 2: Stack Simulation  ← OPTIMAL
 * Name: One-pass Stack
 * Time: O(n) — each asteroid pushed/popped at most once
 * Space: O(n) — stack
 */
function asteroidCollision(asteroids: number[]): number[] {
  const stack: number[] = [];

  for (const ast of asteroids) {
    let destroyed = false;

    // Collision: stack top going right (+), current going left (-)
    while (stack.length > 0 && ast < 0 && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -ast) {
        // Current wins — pop top and keep checking
        stack.pop();
      } else if (top === -ast) {
        // Equal — both destroyed
        stack.pop();
        destroyed = true;
        break;
      } else {
        // Top wins — current destroyed
        destroyed = true;
        break;
      }
    }

    if (!destroyed) stack.push(ast);
  }

  return stack;
}

// === Test Cases ===
console.log(asteroidCollision([5, 10, -5])); // [5, 10]
console.log(asteroidCollision([8, -8])); // []
console.log(asteroidCollision([10, 2, -5])); // [10]
console.log(asteroidCollision([-2, -1, 1, 2])); // [-2, -1, 1, 2]
console.log(asteroidCollision([1, -1, 1, -1])); // []
console.log(asteroidCollision([-1, 5])); // [-1, 5]
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Relationship                     |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| [Robot Collisions](https://leetcode.com/problems/robot-collisions)                                                 | Direct extension with same logic |
| [Validate Stack Sequences](https://leetcode.com/problems/validate-stack-sequences)                                 | Stack simulation pattern         |
| [Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) | Stack cancellation pattern       |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures)                                             | Monotonic stack variant          |
| [Baseball Game](https://leetcode.com/problems/baseball-game)                                                       | Stack simulation                 |
