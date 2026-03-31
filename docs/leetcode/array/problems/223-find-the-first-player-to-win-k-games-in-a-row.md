---
layout: page
title: "Find The First Player to win K Games in a Row"
difficulty: Medium
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/find-the-first-player-to-win-k-games-in-a-row"
---

# Find The First Player to Win K Games in a Row / Tìm Người Chơi Đầu Tiên Thắng K Trận Liên Tiếp

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Simulation / Greedy Observation

## 🧠 Intuition / Tư Duy

**Giống như giải đấu bóng bàn kiểu vòng tròn**: người thắng ở lại bàn, người thua ra ngoài và người tiếp theo vào. Ai thắng liên tiếp K lần thì đoạt giải.

**Pattern Recognition:**

- Simulate → nhưng nhận ra rằng nếu k ≥ n-1 thì người có chỉ số lớn nhất chắc chắn thắng
- Người chiến thắng liên tiếp là người lớn hơn trong mỗi trận so sánh liên tiếp
- Không cần mảng queue, chỉ cần theo dõi current winner và streak

**Visual:**

```
skills = [4, 2, 6, 3, 1], k = 2
Round 1: 4 vs 2 → 4 wins  (streak=1)
Round 2: 4 vs 6 → 6 wins  (streak=1)
Round 3: 6 vs 3 → 6 wins  (streak=2) ✓ streak==k → return index of 6 = 2
```

## Problem Description

Có `n` người chơi với mức kỹ năng `skills[i]`. Họ thi đấu vòng tròn: `skills[0]` vs `skills[1]`, người thắng gặp `skills[2]`, v.v. Trả về **index** của người đầu tiên thắng `k` trận liên tiếp.

**Example 1:** `skills = [4,2,6,3,1], k = 2` → `2` (player at index 2, skill=6)
**Example 2:** `skills = [2,5,4], k = 3` → `1`

**Constraints:** `n == skills.length`, `2 ≤ n ≤ 10^5`, `1 ≤ k ≤ 10^9`, all skills distinct.

## 📝 Interview Tips

1. **Nhận diện key insight**: nếu k ≥ n-1, answer luôn là index của max element
2. **Tránh simulate đầy đủ**: không cần queue/deque, chỉ cần con trỏ và streak counter
3. **Early return**: ngay khi streak đạt k → trả về ngay
4. **Edge case**: k=1 → người có skill lớn hơn trong cặp đầu tiên
5. **Time complexity**: O(n) — mỗi phần tử được so sánh tối đa một lần
6. **Phân biệt index vs value**: đề hỏi index của người thắng, không phải skill value

## Solutions

```typescript
// Solution 1: Simulation with early exit — O(n) time, O(1) space
function findWinningPlayer(skills: number[], k: number): number {
  const n = skills.length;
  let currentWinner = 0; // index of current winner
  let streak = 0;

  for (let i = 1; i < n; i++) {
    if (skills[i] > skills[currentWinner]) {
      currentWinner = i;
      streak = 1;
    } else {
      streak++;
    }
    if (streak >= k) return currentWinner;
  }

  // If we exit loop without finding k-streak, the overall max won all remaining
  return currentWinner;
}

// Solution 2: Explicit greedy — if k >= n-1, return index of max
function findWinningPlayerV2(skills: number[], k: number): number {
  const n = skills.length;
  // If k >= n-1, the strongest player must win eventually
  if (k >= n - 1) {
    let maxIdx = 0;
    for (let i = 1; i < n; i++) {
      if (skills[i] > skills[maxIdx]) maxIdx = i;
    }
    return maxIdx;
  }

  let currentWinner = 0;
  let streak = 0;
  for (let i = 1; i < n; i++) {
    if (skills[i] > skills[currentWinner]) {
      currentWinner = i;
      streak = 1;
    } else {
      streak++;
    }
    if (streak === k) return currentWinner;
  }
  return currentWinner;
}

// Tests
console.log(findWinningPlayer([4, 2, 6, 3, 1], 2)); // 2
console.log(findWinningPlayer([2, 5, 4], 3)); // 1
console.log(findWinningPlayer([3, 2, 1], 10)); // 0
console.log(findWinningPlayerV2([4, 2, 6, 3, 1], 2)); // 2
console.log(findWinningPlayerV2([2, 5, 4], 3)); // 1
```

## 🔗 Related Problems

| Problem                                        | Relationship               |
| ---------------------------------------------- | -------------------------- |
| 1535 - Find the Winner of an Array Game        | Same problem, same pattern |
| 2178 - Maximum Split of Positive Even Integers | Greedy array               |
| 1706 - Where Will the Ball Fall                | Simulation on array        |
| 396 - Rotate Function                          | Array index tracking       |
