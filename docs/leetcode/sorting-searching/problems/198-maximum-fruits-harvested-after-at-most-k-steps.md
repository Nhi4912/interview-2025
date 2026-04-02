---
layout: page
title: "Maximum Fruits Harvested After at Most K Steps"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-fruits-harvested-after-at-most-k-steps"
---

# Maximum Fruits Harvested After at Most K Steps / Thu Hoạch Quả Tối Đa Trong K Bước

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Hình ảnh:** Bạn đứng tại vị trí `startPos` trên con đường dài. Có thể đi tối đa `k` bước — nhưng có thể đổi hướng **đúng một lần**. Mục tiêu: thu thập nhiều quả nhất trong đoạn đường ghé qua.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Fruits Harvested After at Most K Steps example:**

```
Fruits:  pos=[0,1,2,3,4,5,6],  amounts=[2,8,6,0,3,1,0]
startPos=2,  k=4

Option A: go LEFT 2 then RIGHT 4 → cover [0..4] = 2+8+6+0+3 = 19
Option B: go RIGHT 2 then LEFT 0 → cover [2..4] = 6+0+3 = 9
Option C: go RIGHT 4 then LEFT 0 → cover [2..6] = 6+0+3+1+0 = 10

Best: go left first → 19 ✓
```

**Chiến lược:** Sliding window trên positions array. Với window [L, R], chi phí bước đi = `min(|L-start|, |R-start|) * 2 + max(|L-start|, |R-start|)`.

---

## Problem Description

On a number line, `fruits[i] = [position, amount]`. You start at `startPos`, can take ≤ `k` steps. At each position you collect all available fruits. Return maximum fruits collectible.

**Example 1:** `fruits=[[2,8],[6,3],[8,6]]`, `startPos=5`, `k=4` → `9`
**Example 2:** `fruits=[[0,9],[4,1],[5,7],[6,2],[7,4],[10,9]]`, `startPos=5`, `k=4` → `14`

**Constraints:** `1 ≤ fruits.length ≤ 10^5`, `0 ≤ pos ≤ 2×10^5`, `0 ≤ amount ≤ 10^4`, `0 ≤ startPos, k ≤ 2×10^5`

---

## 📝 Interview Tips

- **Clarify:** Can you visit the same position twice (yes, but fruits already collected)? Movement is on integer line?
- **Key observation:** Optimal path either goes (all right), (all left), (left then right), or (right then left)
- **Sliding window condition:** Window [L..R] reachable if `min(lDist, rDist)*2 + max(lDist, rDist) ≤ k`
- **Two passes:** Fix left endpoint, binary search right; OR fix right endpoint, find valid left
- **Prefix sum:** Pre-compute fruit sums for O(1) range queries within the window
- **Edge cases:** startPos outside all fruit positions; k=0 (only harvest at startPos)

---

## Solutions

```typescript
function maxTotalFruits(fruits: number[][], startPos: number, k: number): number {
  const n = fruits.length;
  const positions = fruits.map(([p]) => p);
  const amounts = fruits.map(([, a]) => a);

  // Prefix sum for range queries
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + amounts[i];

  const rangeSum = (l: number, r: number) => (l > r ? 0 : prefix[r + 1] - prefix[l]);

  // Can we reach window [positions[l]..positions[r]] from startPos in k steps?
  const canReach = (l: number, r: number): boolean => {
    const leftDist = Math.max(0, startPos - positions[l]);
    const rightDist = Math.max(0, positions[r] - startPos);
    // Go left first: leftDist*2 + rightDist OR go right first: rightDist*2 + leftDist
    return Math.min(leftDist * 2 + rightDist, rightDist * 2 + leftDist) <= k;
  };

  let ans = 0;
  // Slide right pointer, binary search for leftmost valid left pointer
  let left = 0;
  for (let right = 0; right < n; right++) {
    // Shrink window from left while not reachable
    while (left <= right && !canReach(left, right)) left++;
    ans = Math.max(ans, rangeSum(left, right));
  }
  return ans;
}

function maxTotalFruitsAlt(fruits: number[][], startPos: number, k: number): number {
  const n = fruits.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + fruits[i][1];

  const sumRange = (l: number, r: number) =>
    l > r || l >= n || r < 0 ? 0 : prefix[Math.min(r, n - 1) + 1] - prefix[Math.max(l, 0)];

  // Binary search: index of first fruit at position >= pos
  const lowerBound = (pos: number): number => {
    let lo = 0,
      hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      fruits[mid][0] < pos ? (lo = mid + 1) : (hi = mid);
    }
    return lo;
  };

  let ans = 0;

  // Try: go left by `leftSteps`, then right as far as possible
  for (let leftSteps = 0; leftSteps <= k; leftSteps++) {
    const leftPos = startPos - leftSteps;
    const rightSteps = Math.max(0, k - 2 * leftSteps);
    const rightPos = startPos + rightSteps;

    const l = lowerBound(leftPos);
    const r = lowerBound(rightPos + 1) - 1;
    ans = Math.max(ans, sumRange(l, r));
  }

  // Try: go right by `rightSteps`, then left as far as possible
  for (let rightSteps = 0; rightSteps <= k; rightSteps++) {
    const rightPos = startPos + rightSteps;
    const leftSteps = Math.max(0, k - 2 * rightSteps);
    const leftPos = startPos - leftSteps;

    const l = lowerBound(leftPos);
    const r = lowerBound(rightPos + 1) - 1;
    ans = Math.max(ans, sumRange(l, r));
  }

  return ans;
}

function maxTotalFruitsOptimal(fruits: number[][], startPos: number, k: number): number {
  const n = fruits.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + fruits[i][1];

  // Steps needed to cover [fruits[l][0]..fruits[r][0]] from startPos
  const steps = (l: number, r: number): number => {
    const lo = fruits[l][0],
      hi = fruits[r][0];
    if (hi <= startPos) return startPos - lo; // entire window left of start
    if (lo >= startPos) return hi - startPos; // entire window right of start
    const leftDist = startPos - lo,
      rightDist = hi - startPos;
    return Math.min(leftDist * 2 + rightDist, rightDist * 2 + leftDist);
  };

  let ans = 0,
    left = 0;
  for (let right = 0; right < n; right++) {
    while (steps(left, right) > k) left++;
    ans = Math.max(ans, prefix[right + 1] - prefix[left]);
  }
  return ans;
}
```

---

## 🔗 Related Problems

| Problem                                                                                                         | Similarity                          |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)                           | Sliding window with constraint      |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)                             | Sliding window maximize window size |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/) | Sliding window + prefix sum         |
| [Jump Game VII](https://leetcode.com/problems/jump-game-vii/)                                                   | Reachability on a line              |
