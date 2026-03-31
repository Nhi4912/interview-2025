---
layout: page
title: "Count Number of Teams"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/count-number-of-teams"
---

# Count Number of Teams / Đếm Số Đội Hình

🟡 Medium | For each middle soldier, count smaller-left × larger-right

## 🧠 Intuition

**VI:** Với mỗi lính ở vị trí giữa j, đếm số lính bên trái có rating nhỏ hơn (leftSmall)
và bên phải có rating lớn hơn (rightLarge). Đóng góp = leftSmall × rightLarge + leftLarge × rightSmall.

**EN:** Fix the middle element j. Count elements to the left smaller than `rating[j]`
(leftSmall) and elements to the right larger than `rating[j]` (rightLarge).
Teams in order: `leftSmall × rightLarge + leftLarge × rightSmall`.

```
rating = [2, 5, 3, 4, 1]
j=1 (r=5): leftSmall=1(r=2), leftLarge=0, rightSmall=3(r<5), rightLarge=0
j=2 (r=3): leftSmall=1, leftLarge=1, rightSmall=1(r=1), rightLarge=1(r=4)
           → 1*1 + 1*1 = 2 teams from j=2
Total = 3
```

## 📝 Interview Tips

- 🔑 **EN:** Fix middle element in O(n), count left/right with O(n) inner loop → O(n^2) total.
  **VI:** Cố định phần tử giữa O(n), đếm trái/phải với O(n) → tổng O(n^2).
- 🔑 **EN:** For increasing triples: contribution = leftSmall[j] × rightLarge[j].
  **VI:** Bộ ba tăng: đóng góp = leftSmall[j] × rightLarge[j].
- 🔑 **EN:** For decreasing triples: contribution = leftLarge[j] × rightSmall[j].
  **VI:** Bộ ba giảm: đóng góp = leftLarge[j] × rightSmall[j].
- 🔑 **EN:** O(n log n) solution: use BIT/Fenwick tree for range counts.
  **VI:** Giải pháp O(n log n): dùng BIT/Fenwick tree để đếm khoảng.
- 🔑 **EN:** rightSmall = (j-position elements after j) - rightLarge, since all are unique.
  **VI:** rightSmall = (số phần tử sau j) - rightLarge (do tất cả khác nhau).
- 🔑 **EN:** No duplicate ratings, so all comparisons are strict.
  **VI:** Không có rating trùng, mọi so sánh là nghiêm ngặt.

## Solutions

### Solution 1: O(n^2) — Fix Middle Element

```typescript
/**
 * Count Number of Teams
 * For each j: count leftSmall, leftLarge, rightSmall, rightLarge in O(n).
 * Time: O(n^2)  Space: O(1)
 */
function numTeams(rating: number[]): number {
  const n = rating.length;
  let count = 0;

  for (let j = 1; j < n - 1; j++) {
    let leftSmall = 0,
      leftLarge = 0;
    let rightSmall = 0,
      rightLarge = 0;

    for (let i = 0; i < j; i++) {
      if (rating[i] < rating[j]) leftSmall++;
      else if (rating[i] > rating[j]) leftLarge++;
    }
    for (let k = j + 1; k < n; k++) {
      if (rating[k] < rating[j]) rightSmall++;
      else if (rating[k] > rating[j]) rightLarge++;
    }

    count += leftSmall * rightLarge + leftLarge * rightSmall;
  }

  return count;
}

console.log(numTeams([2, 5, 3, 4, 1])); // 3
console.log(numTeams([2, 1, 3])); // 0
console.log(numTeams([1, 2, 3, 4])); // 4
```

### Solution 2: O(n log n) — Fenwick Tree

```typescript
/**
 * Two-pass Fenwick tree:
 * Pass 1 (left to right): leftSmall[j] = count of ratings < rating[j] inserted so far
 * Pass 2 (right to left): rightLarge[j] = count of ratings > rating[j] not yet processed
 * Time: O(n log n)  Space: O(n)
 */
function numTeams2(rating: number[]): number {
  const n = rating.length;
  // Coordinate compress
  const sorted = [...rating].sort((a, b) => a - b);
  const rank = new Map(sorted.map((v, i) => [v, i + 1]));
  const R = n;

  class BIT {
    tree: number[];
    constructor(size: number) {
      this.tree = new Array(size + 1).fill(0);
    }
    update(i: number, d = 1) {
      for (; i < this.tree.length; i += i & -i) this.tree[i] += d;
    }
    query(i: number): number {
      let s = 0;
      for (; i > 0; i -= i & -i) s += this.tree[i];
      return s;
    }
    range(l: number, r: number) {
      return l > r ? 0 : this.query(r) - this.query(l - 1);
    }
  }

  const leftSmall = new Array(n).fill(0);
  const leftLarge = new Array(n).fill(0);
  const bit1 = new BIT(R);

  for (let j = 0; j < n; j++) {
    const r = rank.get(rating[j])!;
    leftSmall[j] = bit1.query(r - 1);
    leftLarge[j] = bit1.range(r + 1, R);
    bit1.update(r);
  }

  const bit2 = new BIT(R);
  let ans = 0;
  for (let j = n - 1; j >= 0; j--) {
    const r = rank.get(rating[j])!;
    const rightSmall = bit2.query(r - 1);
    const rightLarge = bit2.range(r + 1, R);
    ans += leftSmall[j] * rightLarge + leftLarge[j] * rightSmall;
    bit2.update(r);
  }

  return ans;
}

console.log(numTeams2([2, 5, 3, 4, 1])); // 3
console.log(numTeams2([2, 1, 3])); // 0
console.log(numTeams2([1, 2, 3, 4])); // 4
```

## 🔗 Related Problems

| Problem                                                                                                        | Difficulty | Key Idea            |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [315. Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) | 🔴 Hard    | BIT/merge sort      |
| [493. Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)                                             | 🔴 Hard    | Merge sort counting |
| [1395. Count Number of Teams](https://leetcode.com/problems/count-number-of-teams/)                            | 🟡 Medium  | This problem        |
| [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)           | 🟡 Medium  | LIS DP              |
