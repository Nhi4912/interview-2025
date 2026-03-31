---
layout: page
title: "Stone Game VI"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/stone-game-vi"
---

# Stone Game VI / Trò Chơi Đá VI

🟡 Medium | 🏷️ Array, Math, Greedy, Sorting | [LeetCode](https://leetcode.com/problems/stone-game-vi)

---

## 🧠 Intuition

**Vietnamese:** Alice và Bob luân phiên lấy đá. Alice muốn maximize điểm của mình - điểm của Bob. Key insight: khi Alice lấy viên đá i, cô ấy vừa được `aliceValues[i]` điểm VÀ ngăn Bob được `bobValues[i]` điểm. Tổng "giá trị chiến lược" = `aliceValues[i] + bobValues[i]`. Sắp xếp theo tổng này giảm dần, luân phiên chọn.

**Analogy:** Mỗi viên đá có giá trị kép: giá trị cho bạn và giá trị bạn "cướp" từ đối thủ. Hãy ưu tiên những viên có tổng giá trị kép cao nhất.

```
aliceValues = [1,3]  bobValues = [2,1]
combined = [(1+2,0), (3+1,1)] = [(3,0),(4,1)]
Sort desc: [(4,1),(3,0)]

Turn 0 (Alice picks index 1): alice += 3, score=3
Turn 1 (Bob   picks index 0): bob   += 2, score=2

alice(3) > bob(2) → Alice wins → return 1
```

---

## 📝 Interview Tips

- **EN:** Greedy key: sort by `aliceValues[i] + bobValues[i]` descending / **VI:** Sắp xếp theo tổng `a[i]+b[i]` giảm dần
- **EN:** Alice picks on even turns (0,2,4…), Bob on odd turns (1,3,5…) / **VI:** Alice chọn lượt chẵn, Bob chọn lượt lẻ
- **EN:** Return 1 if alice > bob, -1 if alice < bob, 0 if equal / **VI:** Trả 1 nếu Alice thắng, -1 nếu Bob thắng, 0 nếu hòa
- **EN:** Why sum? Picking stone i denies opponent — effective gain = own value + denied value / **VI:** Lấy viên đá = được điểm + ngăn đối thủ — tổng tối ưu = a[i]+b[i]
- **EN:** Proof by exchange argument: swapping any two adjacent picks can only worsen score / **VI:** Chứng minh bằng exchange argument: đổi chỗ 2 lượt liền kề chỉ làm kết quả xấu hơn
- **EN:** Time O(n log n), space O(n) for index sorting / **VI:** O(n log n) thời gian, O(n) không gian

---

## Solutions

### Solution 1: Sort by Combined Value, Alternate Picks

```typescript
/**
 * Sort by aliceValues[i]+bobValues[i] desc; Alice picks on even rounds.
 * Time: O(n log n)  Space: O(n)
 */
function stoneGameVI(aliceValues: number[], bobValues: number[]): number {
  const n = aliceValues.length;

  // Create (combinedValue, index) pairs sorted descending
  const order = Array.from({ length: n }, (_, i) => i).sort(
    (i, j) => aliceValues[j] + bobValues[j] - (aliceValues[i] + bobValues[i]),
  );

  let aliceScore = 0,
    bobScore = 0;
  for (let turn = 0; turn < n; turn++) {
    const i = order[turn];
    if (turn % 2 === 0)
      aliceScore += aliceValues[i]; // Alice's turn
    else bobScore += bobValues[i]; // Bob's turn
  }

  if (aliceScore > bobScore) return 1;
  if (aliceScore < bobScore) return -1;
  return 0;
}

// Tests
console.log(stoneGameVI([1, 3], [2, 1])); // 1  (Alice wins)
console.log(stoneGameVI([1, 2], [3, 1])); // 0  (Draw)
console.log(stoneGameVI([2, 4, 3], [1, 6, 7])); // -1 (Bob wins)
```

### Solution 2: Inline Sort with Tuple (cleaner)

```typescript
/**
 * Build tuples directly for clarity.
 * Time: O(n log n)  Space: O(n)
 */
function stoneGameVI2(aliceValues: number[], bobValues: number[]): number {
  const stones = aliceValues
    .map((a, i) => [a + bobValues[i], a, bobValues[i]] as const)
    .sort((x, y) => y[0] - x[0]); // descending by combined

  let alice = 0,
    bob = 0;
  for (let t = 0; t < stones.length; t++) {
    if (t % 2 === 0)
      alice += stones[t][1]; // alice's value
    else bob += stones[t][2]; // bob's value
  }

  return Math.sign(alice - bob);
}

// Tests
console.log(stoneGameVI2([1, 3], [2, 1])); // 1
console.log(stoneGameVI2([1, 2], [3, 1])); // 0
console.log(stoneGameVI2([2, 4, 3], [1, 6, 7])); // -1
```

### Solution 3: Using score difference directly

```typescript
/**
 * Track difference = aliceTotal - bobTotal.
 * Time: O(n log n)  Space: O(n)
 */
function stoneGameVI3(aliceValues: number[], bobValues: number[]): number {
  const n = aliceValues.length;
  const indices = Array.from({ length: n }, (_, i) => i).sort(
    (i, j) => aliceValues[j] + bobValues[j] - (aliceValues[i] + bobValues[i]),
  );

  let diff = 0;
  for (let t = 0; t < n; t++) {
    const i = indices[t];
    diff += t % 2 === 0 ? aliceValues[i] : -bobValues[i];
  }

  return diff > 0 ? 1 : diff < 0 ? -1 : 0;
}

// Tests
console.log(stoneGameVI3([1, 3], [2, 1])); // 1
console.log(stoneGameVI3([1, 2], [3, 1])); // 0
console.log(stoneGameVI3([2, 4, 3], [1, 6, 7])); // -1
```

---

## 🔗 Related Problems

| Problem                                                        | Difficulty | Connection                |
| -------------------------------------------------------------- | ---------- | ------------------------- |
| [Stone Game](https://leetcode.com/problems/stone-game)         | 🟡 Medium  | Same game, simpler greedy |
| [Stone Game II](https://leetcode.com/problems/stone-game-ii)   | 🟡 Medium  | DP stone game             |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler) | 🟡 Medium  | Greedy scheduling         |
