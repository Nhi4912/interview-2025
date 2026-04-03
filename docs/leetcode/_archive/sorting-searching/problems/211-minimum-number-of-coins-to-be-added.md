---
layout: page
title: "Minimum Number of Coins to be Added"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-coins-to-be-added"
---

# Minimum Number of Coins to be Added / Số Đồng Xu Tối Thiểu Cần Thêm

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: ⭐ Tier 2 — Hay gặp tại Amazon, Google
> **See also**: [Patching Array](https://leetcode.com/problems/patching-array) | [Jump Game II](https://leetcode.com/problems/jump-game-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn muốn tạo ra mọi số từ 1 đến target bằng các đồng xu. Dùng biến `reach` — "tôi có thể tạo ra mọi số từ 1 đến `reach` với các đồng xu đã có". Khi gặp đồng xu tiếp theo: nếu nó <= reach+1 thì mở rộng reach lên reach+coin. Nếu coin > reach+1 → có lỗ hổng tại reach+1 → phải thêm đồng reach+1 vào.

**Pattern Recognition:**

- Signal: "make all values 1..target representable" → **Sort + Greedy reach expansion**
- Tương tự bài "Patching Array" — classic greedy interval coverage
- Key insight: nếu [1..reach] đã covered và có coin <= reach+1 → [1..reach+coin] covered

**Visual — coins=[1,4,10], target=19:**

```
Sort: [1, 4, 10]    reach=0, additions=0

coin=1:  1<=0+1=1  -> reach=0+1=1     (can make 1..1)
coin=4:  4>1+1=2   -> add 2, reach=3, additions=1
         4<=3+1=4  -> reach=3+4=7     (can make 1..7)
coin=10: 10>7+1=8  -> add 8, reach=15, additions=2
         10<=15+1  -> reach=15+10=25 >=19 -> done
additions = 2 ✅
```

---

## Problem Description

Given a sorted-able array `coins` and integer `target`, find the minimum number of coins to add so that every integer in `[1, target]` can be represented as a subset sum of coins.

```
Example 1: coins=[1,4,10], target=19   -> 2  (add 2 and 8)
Example 2: coins=[1,2,3], target=6     -> 0  (already covers 1..6)
Example 3: coins=[1,1], target=20      -> 3
```

---

## 📝 Interview Tips

1. **Sort trước**: Coins không theo thứ tự, sort để xử lý từ nhỏ đến lớn
2. **Invariant**: reach = max value có thể tạo ra từ [1..reach] với coins đã xử lý
3. **Khi có lỗ hổng**: Thêm đồng xu reach+1 (nhỏ nhất chưa cover) → reach tăng gấp đôi +1
4. **Tại sao thêm reach+1?** Đây là đồng xu nhỏ nhất lấp đầy lỗ hổng, giúp reach tăng tối đa
5. **Hỏi follow-up**: "Nếu target thay đổi online?" → Cần rebuild từ đầu mỗi lần
6. **Complexity**: Time O(n log n + log target), Space O(1)

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Greedy Reach Expansion (Optimal)
 * Time O(n log n + log target), Space O(1)
 *
 * Maintain `reach`: can form every value in [1, reach].
 * If next coin > reach+1, gap exists at reach+1 -> must add it.
 * Adding reach+1 extends coverage to [1, 2*reach+1].
 */
function minimumAddedCoins(coins: number[], target: number): number {
  coins.sort((a, b) => a - b);
  let reach = 0;    // can make every value in [1, reach]
  let additions = 0;
  let i = 0;

  while (reach < target) {
    if (i < coins.length && coins[i] <= reach + 1) {
      // Coin is reachable — extend coverage
      reach += coins[i++];
    } else {
      // Gap at reach+1 — must add this coin
      reach += reach + 1;
      additions++;
    }
  }

  return additions;
}

/**
 * Solution 2: Same logic with explicit gap tracking
 * Time O(n log n), Space O(1)
 */
function minimumAddedCoins2(coins: number[], target: number): number {
  coins.sort((a, b) => a - b);
  let additions = 0;
  let reach = 0;
  let idx = 0;
  const n = coins.length;

  while (reach < target) {
    const next = idx < n ? coins[idx] : Infinity;
    if (next <= reach + 1) {
      reach += next;
      idx++;
    } else {
      // Patch the gap: add the coin equal to reach+1
      reach = reach + (reach + 1); // reach += (reach+1)
      additions++;
    }
  }
  return additions;
}

// --- Quick inline tests ---
console.log(minimumAddedCoins([1, 4, 10], 19));  // 2
console.log(minimumAddedCoins([1, 2, 3], 6));    // 0
console.log(minimumAddedCoins([1, 1], 20));       // 3
console.log(minimumAddedCoins([], 7));            // 3  (add 1,2,4)
console.log(minimumAddedCoins2([1, 4, 10], 19)); // 2
console.log(minimumAddedCoins2([5, 10], 20));    // 4  (need 1,2,4,8 or similar)
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [2952. Minimum Number of Coins to be Added](https://leetcode.com/problems/minimum-number-of-coins-to-be-added/) | This problem |
| [330. Patching Array](https://leetcode.com/problems/patching-array/) | Identical greedy pattern, classic version |
| [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/) | Greedy reach expansion |
| [55. Jump Game](https://leetcode.com/problems/jump-game/) | Simpler reach-based greedy |
| [1326. Minimum Number of Taps to Open to Water a Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/) | Interval coverage greedy |
