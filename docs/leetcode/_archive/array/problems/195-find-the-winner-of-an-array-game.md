---
layout: page
title: "Find the Winner of an Array Game"
difficulty: Medium
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/find-the-winner-of-an-array-game"
---

# Find the Winner of an Array Game / Tìm Người Chiến Thắng Trong Trò Chơi Mảng

🟡 Medium | Array · Simulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Hai người đứng đầu hàng so sức. Người thua ra cuối hàng, người thắng ở lại. Ai thắng k trận liên tiếp thì chiến thắng. Nếu không ai thắng đủ k lần trước khi vòng về, người có giá trị lớn nhất chắc chắn thắng mãi mãi.

```
arr = [2,1,3,5,4], k=2
Round 1: 2 vs 1 → 2 wins (streak=1), arr=[2,3,5,4,1]
Round 2: 2 vs 3 → 3 wins (streak=1), arr=[3,5,4,1,2]
Round 3: 3 vs 5 → 5 wins (streak=1), arr=[5,4,1,2,3]
Round 4: 5 vs 4 → 5 wins (streak=2) → 5 wins! ✓
```

## Problem Description

Given array `arr` and integer `k`, two players compete: compare `arr[0]` and `arr[1]`; the winner stays at index 0, loser goes to end. Return the first element that wins `k` consecutive rounds.

- **Example 1**: `arr = [2,1,3,5,4], k = 2` → `5`
- **Example 2**: `arr = [3,2,1], k = 10` → `3` (3 wins all rounds, k > n means max wins)

## 📝 Interview Tips

- 💡 **Max always wins / Max luôn thắng**: If k ≥ n-1, the global max will inevitably be the champion / nếu k ≥ n-1, max toàn cục thắng
- 🔍 **Streak counting / Đếm chuỗi**: Track current leader and consecutive wins / theo dõi người dẫn đầu và số thắng liên tiếp
- ⚠️ **No actual queue needed / Không cần hàng đợi**: The leader doesn't change position — only compare with next element in array / chỉ so sánh leader với phần tử tiếp theo
- 🧮 **O(n) single pass / Một lượt O(n)**: Just scan arr once, updating current winner / quét mảng một lần
- 📊 **Key insight / Ý tưởng chính**: After a full cycle, the current maximum must win forever / sau một vòng đầy đủ, max hiện tại thắng mãi
- 🎯 **Return max / Trả về max**: If no winner found after n-1 rounds, return max(arr) / nếu không tìm được, trả về max

## Solutions

### Solution 1: Simulation without actual queue (Optimal)

```typescript
/**
 * Track current leader and win streak, scan array once
 * Time: O(n) | Space: O(1)
 */
function getWinner(arr: number[], k: number): number {
  let current = arr[0];
  let streak = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > current) {
      current = arr[i];
      streak = 1;
    } else {
      streak++;
    }
    if (streak === k) return current;
  }
  // If no winner found, current is the global max (wins everything)
  return current;
}

// Tests
console.log(getWinner([2, 1, 3, 5, 4], 2)); // 5
console.log(getWinner([3, 2, 1], 10)); // 3
console.log(getWinner([1, 9, 8, 2, 3], 3)); // 9
console.log(getWinner([1, 11, 22, 33, 44, 55, 66, 77, 88, 99], 1000)); // 99
```

### Solution 2: Explicit Queue Simulation

```typescript
/**
 * Simulate with actual queue for clarity
 * Time: O(n) | Space: O(n)
 */
function getWinnerQueue(arr: number[], k: number): number {
  const queue = [...arr];
  let wins = 0;
  let leader = queue.shift()!;

  while (wins < k) {
    const challenger = queue.shift()!;
    if (leader > challenger) {
      wins++;
      queue.push(challenger);
    } else {
      queue.push(leader);
      leader = challenger;
      wins = 1;
    }
    // If leader has beaten everyone once, they're the max
    if (queue.length === 0) break;
  }
  return leader;
}

// Tests
console.log(getWinnerQueue([2, 1, 3, 5, 4], 2)); // 5
console.log(getWinnerQueue([3, 2, 1], 10)); // 3
```

### Solution 3: Early exit with max detection

```typescript
/**
 * If k >= n, return global max directly
 * Time: O(n) | Space: O(1)
 */
function getWinnerOptimized(arr: number[], k: number): number {
  const n = arr.length;
  if (k >= n - 1) return Math.max(...arr);

  let current = arr[0];
  let streak = 0;
  for (let i = 1; i < n; i++) {
    if (arr[i] > current) {
      current = arr[i];
      streak = 1;
    } else {
      streak++;
    }
    if (streak === k) return current;
  }
  return current;
}

// Tests
console.log(getWinnerOptimized([2, 1, 3, 5, 4], 2)); // 5
console.log(getWinnerOptimized([3, 2, 1], 10)); // 3
console.log(getWinnerOptimized([5, 4, 3, 2, 1], 1)); // 5
```

## 🔗 Related Problems

| #    | Problem                                | Difficulty | Tags                     |
| ---- | -------------------------------------- | ---------- | ------------------------ |
| 1535 | Find the Winner of an Array Game       | Medium     | Array, Simulation        |
| 950  | Reveal Cards In Increasing Order       | Medium     | Array, Queue, Simulation |
| 1700 | Number of Students Unable to Eat Lunch | Easy       | Stack, Queue             |
| 2073 | Time Needed to Buy Tickets             | Easy       | Queue, Simulation        |
