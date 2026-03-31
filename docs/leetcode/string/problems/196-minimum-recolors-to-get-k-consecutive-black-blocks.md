---
layout: page
title: "Minimum Recolors to Get K Consecutive Black Blocks"
difficulty: Easy
category: String
tags: [String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks"
---

# Minimum Recolors to Get K Consecutive Black Blocks / Số Lần Tô Màu Tối Thiểu Để Có K Ô Đen Liên Tiếp

🟢 Easy | String, Sliding Window

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Dùng cửa sổ trượt kích thước `k` — đếm số ô trắng ('W') trong cửa sổ. Cửa sổ có ít ô trắng nhất = số lần tô lại ít nhất để có đủ `k` ô đen liên tiếp.

```
blocks = "WBBWWBBWBW"  k = 7
Window 0..6: W B B W W B B → 3 whites
Window 1..7: B B W W B B W → 3 whites
Window 2..8: B W W B B W B → 3 whites
Window 3..9: W W B B W B W → 4 whites

Min whites = 3 → answer = 3
```

## Problem Description

You are given a string `blocks` of `'B'` (black) and `'W'` (white) blocks, and an integer `k`. In one operation, you can recolor a white block to black. Return the **minimum number of operations** needed to get exactly `k` consecutive black blocks.

- **Example 1:** `blocks = "WBBWWBBWBW"`, `k = 7` → `3`
- **Example 2:** `blocks = "WBWBBBW"`, `k = 2` → `0`

## 📝 Interview Tips

- **🇻🇳 Sliding window** kích thước cố định `k` — pattern cổ điển / Fixed-size sliding window — classic pattern
- **🇻🇳 Đếm W trong window** = số lần tô lại cần thiết / Count W in window = operations needed
- **🇻🇳 Trượt cửa sổ** — thêm phần tử mới, bỏ phần tử cũ / Slide: add new, remove old in O(1)
- **🇻🇳 Tìm min** trong tất cả cửa sổ / Find min across all windows
- **🇻🇳 Không cần prefix sum** — trực tiếp đếm W trong O(1) mỗi bước / No prefix sum needed
- **🇻🇳 Edge** → k == blocks.length → chỉ 1 window / k == n → single window

## Solutions

### Solution 1: Sliding Window (Optimal)

```typescript
/**
 * Fixed-size sliding window: count white blocks in window
 * Time: O(n)  Space: O(1)
 */
function minimumRecolors(blocks: string, k: number): number {
  const n = blocks.length;
  let whites = 0;

  // Initialize first window
  for (let i = 0; i < k; i++) {
    if (blocks[i] === "W") whites++;
  }

  let minOps = whites;

  // Slide the window
  for (let i = k; i < n; i++) {
    if (blocks[i] === "W") whites++; // Add new element
    if (blocks[i - k] === "W") whites--; // Remove old element
    minOps = Math.min(minOps, whites);
  }

  return minOps;
}

// Test cases
console.log(minimumRecolors("WBBWWBBWBW", 7)); // 3
console.log(minimumRecolors("WBWBBBW", 2)); // 0
console.log(minimumRecolors("BBBB", 3)); // 0
console.log(minimumRecolors("WWWWWW", 6)); // 6
console.log(minimumRecolors("W", 1)); // 1
```

### Solution 2: Prefix Sum of White Counts

```typescript
/**
 * Prefix sum to quickly count W in any range
 * Time: O(n)  Space: O(n)
 */
function minimumRecolorsV2(blocks: string, k: number): number {
  const n = blocks.length;
  const prefix = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (blocks[i] === "W" ? 1 : 0);
  }

  let minOps = Infinity;
  for (let i = 0; i + k <= n; i++) {
    const whites = prefix[i + k] - prefix[i];
    minOps = Math.min(minOps, whites);
  }

  return minOps;
}

// Test cases
console.log(minimumRecolorsV2("WBBWWBBWBW", 7)); // 3
console.log(minimumRecolorsV2("WBWBBBW", 2)); // 0
console.log(minimumRecolorsV2("WWWWWW", 6)); // 6
```

### Solution 3: Count Black Blocks (Maximize B Instead)

```typescript
/**
 * Maximize black blocks in window — equivalent: minW = k - maxB
 * Time: O(n)  Space: O(1)
 */
function minimumRecolorsV3(blocks: string, k: number): number {
  const n = blocks.length;
  let blacks = 0;

  for (let i = 0; i < k; i++) {
    if (blocks[i] === "B") blacks++;
  }

  let maxBlacks = blacks;

  for (let i = k; i < n; i++) {
    if (blocks[i] === "B") blacks++;
    if (blocks[i - k] === "B") blacks--;
    maxBlacks = Math.max(maxBlacks, blacks);
  }

  // Min recolors = whites in best window = k - maxBlacks
  return k - maxBlacks;
}

// Test cases
console.log(minimumRecolorsV3("WBBWWBBWBW", 7)); // 3
console.log(minimumRecolorsV3("WBWBBBW", 2)); // 0
console.log(minimumRecolorsV3("BBBB", 3)); // 0
console.log(minimumRecolorsV3("WWWWWW", 6)); // 6
```

## 🔗 Related Problems

| Problem                                                                                                                               | Difficulty | Similarity                     |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)                                               | 🟢 Easy    | Fixed-size sliding window      |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)                                                 | 🟡 Medium  | Variable sliding window        |
| [Longest Subarray of 1s After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/) | 🟡 Medium  | Sliding window with constraint |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)                                                   | 🟡 Medium  | Sliding window flip/recolor    |
