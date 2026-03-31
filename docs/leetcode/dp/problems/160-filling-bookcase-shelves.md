---
layout: page
title: "Filling Bookcase Shelves"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/filling-bookcase-shelves"
---

# Filling Bookcase Shelves / Xếp Sách Lên Kệ

🟡 Medium | DP on prefix, greedy shelf packing

## 🧠 Intuition

**VI:** Như xếp sách lên kệ thật — với mỗi cuốn sách mới, thử bắt đầu kệ mới hoặc
gộp vào kệ hiện tại nếu vừa chiều rộng. Chiều cao của kệ = cuốn sách cao nhất.

**EN:** For each book, decide: start a new shelf, or squeeze onto the current shelf.
`dp[i]` = minimum total height using the first `i` books.

```
books = [[1,1],[2,3],[2,3],[1,1],[1,1],[1,1],[1,2]], shelfWidth=4

dp[0]=0
Book1 w=1 h=1: new shelf → dp[1]=1
Book2 w=2 h=3: new shelf → dp[2]=1+3=4; join book1? w=3≤4 h=3 → 0+3=3 ✓
Book3 w=2 h=3: new shelf → 3+3=6; join book2? w=4≤4 h=3 → 1+3=4 ✓
...
```

## 📝 Interview Tips

- 🔑 **EN:** `dp[i]` represents minimum height for first `i` books — think prefix DP.
  **VI:** `dp[i]` là chiều cao tối thiểu cho `i` cuốn sách đầu — DP trên tiền tố.
- 🔑 **EN:** Outer loop: for each book `i`; inner loop: extend current shelf backwards.
  **VI:** Vòng ngoài: từng cuốn sách; vòng trong: mở rộng kệ về phía trước.
- 🔑 **EN:** Track cumulative width and max height of books on current shelf.
  **VI:** Theo dõi tổng chiều rộng và chiều cao tối đa của kệ hiện tại.
- 🔑 **EN:** Start each inner loop fresh: `width = 0, height = 0`.
  **VI:** Khởi tạo lại `width=0, height=0` cho mỗi kệ thử nghiệm.
- 🔑 **EN:** Break inner loop when width exceeds `shelfWidth`.
  **VI:** Dừng vòng trong khi chiều rộng vượt quá `shelfWidth`.
- 🔑 **EN:** Answer is `dp[n]`, initialized with Infinity except `dp[0]=0`.
  **VI:** Kết quả là `dp[n]`, khởi tạo Infinity trừ `dp[0]=0`.

## Solutions

### Solution 1: Bottom-Up DP

```typescript
/**
 * Filling Bookcase Shelves — DP on prefix
 * @param books [width, height][] list of books
 * @param shelfWidth maximum shelf width
 * @returns minimum total bookcase height
 * Time: O(n^2)  Space: O(n)
 */
function minHeightShelves(books: number[][], shelfWidth: number): number {
  const n = books.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    let width = 0;
    let maxHeight = 0;
    // try putting books[j-1..i-1] on the same shelf
    for (let j = i; j >= 1; j--) {
      const [w, h] = books[j - 1];
      width += w;
      if (width > shelfWidth) break;
      maxHeight = Math.max(maxHeight, h);
      dp[i] = Math.min(dp[i], dp[j - 1] + maxHeight);
    }
  }

  return dp[n];
}

console.log(
  minHeightShelves(
    [
      [1, 1],
      [2, 3],
      [2, 3],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 2],
    ],
    4,
  ),
); // 6
console.log(
  minHeightShelves(
    [
      [1, 3],
      [2, 4],
      [3, 2],
    ],
    6,
  ),
); // 4
```

### Solution 2: Space-Optimised with Early Break

```typescript
/**
 * Same DP — explicit early-exit when accumulated width overflows
 * Time: O(n^2)  Space: O(n)
 */
function minHeightShelves2(books: number[][], shelfWidth: number): number {
  const n = books.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 0; i < n; i++) {
    let width = 0;
    let maxH = 0;
    for (let j = i; j >= 0; j--) {
      width += books[j][0];
      if (width > shelfWidth) break;
      maxH = Math.max(maxH, books[j][1]);
      dp[i + 1] = Math.min(dp[i + 1], dp[j] + maxH);
    }
  }

  return dp[n];
}

console.log(
  minHeightShelves2(
    [
      [1, 1],
      [2, 3],
      [2, 3],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 2],
    ],
    4,
  ),
); // 6
console.log(
  minHeightShelves2(
    [
      [1, 3],
      [2, 4],
      [3, 2],
    ],
    6,
  ),
); // 4
```

## 🔗 Related Problems

| Problem                                                                                             | Difficulty | Key Idea           |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [322. Coin Change](https://leetcode.com/problems/coin-change/)                                      | 🟡 Medium  | Prefix DP minimise |
| [1043. Partition Array for Max Sum](https://leetcode.com/problems/partition-array-for-maximum-sum/) | 🟡 Medium  | Partition DP       |
| [1105. Filling Bookcase Shelves](https://leetcode.com/problems/filling-bookcase-shelves/)           | 🟡 Medium  | This problem       |
| [813. Largest Sum of Averages](https://leetcode.com/problems/largest-sum-of-averages/)              | 🟡 Medium  | Group partition DP |
