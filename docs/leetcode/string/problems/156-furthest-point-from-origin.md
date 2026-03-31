---
layout: page
title: "Furthest Point From Origin"
difficulty: Easy
category: String
tags: [String, Counting]
leetcode_url: "https://leetcode.com/problems/furthest-point-from-origin"
---

# Furthest Point From Origin / Điểm xa nhất từ gốc tọa độ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Reorganize String](https://leetcode.com/problems/reorganize-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kéo co trên trục số — mỗi 'L' kéo trái một bước, mỗi 'R' kéo phải một bước, '\_' (wildcard) có thể đi theo hướng nào thắng thế hơn. Kết quả = |countL - countR| + countUnderscore.

```
moves = "L_RL__R"
countL = 2, countR = 2, count_ = 3
net = |2 - 2| = 0
Best: assign all '_' to whichever side → 0 + 3 = 3

moves = "LLRR"
countL = 2, countR = 2, count_ = 0
Answer = |2 - 2| + 0 = 0

moves = "LLL"
countL = 3, countR = 0, count_ = 0
Answer = |3 - 0| + 0 = 3

moves = "_R__"
countL = 0, countR = 1, count_ = 3
Answer = |0 - 1| + 3 = 1 + 3 = 4
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Wildcards always help / Wildcard luôn có ích**: '\_' luôn cộng vào khoảng cách tối đa
- 🔑 **Net displacement / Độ dịch chuyển ròng**: `|L - R|` là khoảng cách cơ bản
- 🔑 **Add wildcards to winner / Cộng wildcard vào bên thắng**: Mọi '\_' nên đi cùng chiều đa số
- 🔑 **Formula: |L-R| + wildcards / Công thức**: Một dòng đơn giản
- 🔑 **No simulation needed / Không cần mô phỏng**: Phân tích toán học > mô phỏng
- 🔑 **Edge: all underscores / Toàn dấu gạch**: Trả về n (đi toàn một hướng)

---

## Solutions

### Solution 1: Count + Formula (Optimal)

```typescript
/**
 * Count L, R, and underscore. Max distance = |L - R| + underscores.
 * All wildcards are optimally assigned to the dominant direction.
 *
 * Time:  O(n)
 * Space: O(1)
 */
function furthestDistanceFromOrigin(moves: string): number {
  let L = 0,
    R = 0,
    wild = 0;
  for (const m of moves) {
    if (m === "L") L++;
    else if (m === "R") R++;
    else wild++;
  }
  return Math.abs(L - R) + wild;
}

console.log(furthestDistanceFromOrigin("L_RL__R")); // 3
console.log(furthestDistanceFromOrigin("LLRR")); // 0
console.log(furthestDistanceFromOrigin("_R__")); // 4
console.log(furthestDistanceFromOrigin("LLL")); // 3
console.log(furthestDistanceFromOrigin("___")); // 3
```

### Solution 2: reduce (Functional)

```typescript
/**
 * Same formula using reduce for counting.
 * Time:  O(n)
 * Space: O(1)
 */
function furthestDistanceFromOrigin2(moves: string): number {
  const [L, R, wild] = [...moves].reduce(
    ([l, r, w], m) => (m === "L" ? [l + 1, r, w] : m === "R" ? [l, r + 1, w] : [l, r, w + 1]),
    [0, 0, 0],
  );
  return Math.abs(L - R) + wild;
}

console.log(furthestDistanceFromOrigin2("L_RL__R")); // 3
console.log(furthestDistanceFromOrigin2("LLRR")); // 0
```

### Solution 3: split + length (One-liner)

```typescript
/**
 * Use regex match to count each character type.
 * Time:  O(n)
 * Space: O(n) — match arrays
 */
function furthestDistanceFromOrigin3(moves: string): number {
  const count = (c: string) => (moves.match(new RegExp(c, "g")) || []).length;
  return Math.abs(count("L") - count("R")) + count("_");
}

console.log(furthestDistanceFromOrigin3("L_RL__R")); // 3
console.log(furthestDistanceFromOrigin3("___")); // 3
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                                  | Difficulty | Pattern        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| 1822 | [Sign of the Product of an Array](https://leetcode.com/problems/sign-of-the-product-of-an-array)                                         | 🟢 Easy    | Counting       |
| 2011 | [Final Value of Variable After Performing Operations](https://leetcode.com/problems/final-value-of-variable-after-performing-operations) | 🟢 Easy    | Simulation     |
| 1859 | [Sorting the Sentence](https://leetcode.com/problems/sorting-the-sentence)                                                               | 🟢 Easy    | String parsing |
| 645  | [Set Mismatch](https://leetcode.com/problems/set-mismatch)                                                                               | 🟢 Easy    | Counting       |
