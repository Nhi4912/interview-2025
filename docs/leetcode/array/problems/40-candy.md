---
layout: page
title: "Candy"
difficulty: Hard
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/candy"
---

# Candy / Phân Phát Kẹo

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy — Two-Pass / Slope Counting
> **Frequency**: 📘 Tier 2 — Gặp ở Google, Uber, Amazon; bài greedy kinh điển cần chia hai chiều
> **See also**: [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water) | [Gas Station](https://leetcode.com/problems/gas-station)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng đứng trên dãy núi — mỗi đỉnh cần cao hơn hai sườn. Nếu chỉ nhìn một chiều (trái→phải) bạn chỉ đảm bảo sườn trái. Nhìn thêm phải→trái để đảm bảo sườn phải. Kết hợp hai góc nhìn bằng `max` cho mỗi vị trí.

- **Pattern Recognition:**
  - Ràng buộc 2 chiều: `ratings[i] > ratings[i-1]` AND `ratings[i] > ratings[i+1]`
  - Greedy: phân rã thành 2 điều kiện độc lập, xử lý tuần tự từng chiều
  - Hai mảng `left[i]` và `right[i]`, kết quả = `sum(max(left[i], right[i]))`

- **Visual — `[1, 0, 2]` và `[1, 2, 2]`:**

  ```
  ratings: [1, 0, 2]
  left:    [1, 1, 2]   ← trái→phải: tăng khi ratings tăng
  right:   [2, 1, 1]   ← phải→trái: tăng khi ratings giảm
  candy:   [2, 1, 2] = max(left,right) → sum = 5

  ratings: [1, 2, 2]
  left:    [1, 2, 1]
  right:   [1, 1, 1]
  candy:   [1, 2, 1]   → sum = 4
  ```

## Problem Description

Có n trẻ em xếp hàng với mảng `ratings`. Mỗi em phải nhận ít nhất 1 kẹo. Em có điểm cao hơn **hai** hàng xóm phải nhận nhiều kẹo hơn hàng xóm đó. Trả về tổng số kẹo tối thiểu cần phân phát.

| Input       | Output | Giải thích                               |
| ----------- | ------ | ---------------------------------------- |
| `[1, 0, 2]` | `5`    | Phân phát [2,1,2] — em giữa thấp nhất    |
| `[1, 2, 2]` | `4`    | Phân phát [1,2,1] — em cuối bằng kế cuối |

## 📝 Interview Tips

- 🇻🇳 Key insight: chia bài toán 2 chiều thành 2 lần quét 1 chiều, kết hợp bằng `max` / 🇬🇧 _Key: decompose bidirectional constraint into two unidirectional passes combined with max_
- 🇻🇳 Lần 1 (trái→phải): chỉ đảm bảo ràng buộc bên trái; lần 2 (phải→trái): chỉ đảm bảo bên phải / 🇬🇧 _Pass 1 enforces left neighbor, Pass 2 enforces right neighbor — neither alone is sufficient_
- 🇻🇳 Khi `ratings[i] == ratings[i-1]`: không ràng buộc gì → reset về 1 / 🇬🇧 _Equal ratings: no constraint between them — reset to 1 freely_
- 🇻🇳 Slope counting O(1) space: đếm độ dài sườn lên/xuống, tính trực tiếp số kẹo theo công thức tam giác / 🇬🇧 _Slope method: count up/down slopes, add triangular numbers directly without arrays_
- 🇻🇳 Edge case: mảng 1 phần tử → trả về 1 / 🇬🇧 _Single element: always return 1_

## Solutions

```typescript
/**
 * Solution 1: Two Arrays — Left Pass + Right Pass
 * Lần 1 (→): nếu ratings[i] > ratings[i-1] thì left[i] = left[i-1]+1 else 1
 * Lần 2 (←): nếu ratings[i] > ratings[i+1] thì right[i] = right[i+1]+1 else 1
 * Kết quả: sum(max(left[i], right[i]))
 *
 * @time O(n) — ba lần duyệt tuyến tính
 * @space O(n) — hai mảng phụ
 */
function candy(ratings: number[]): number {
  const n = ratings.length;
  const left = new Array(n).fill(1);
  const right = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) left[i] = left[i - 1] + 1;
  }
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) right[i] = right[i + 1] + 1;
  }

  let total = 0;
  for (let i = 0; i < n; i++) total += Math.max(left[i], right[i]);
  return total;
}

console.log(candy([1, 0, 2])); // 5
console.log(candy([1, 2, 2])); // 4
console.log(candy([1])); // 1

/**
 * Solution 2: Single Array — In-place Merge
 * Dùng một mảng duy nhất, lần 2 cập nhật trực tiếp bằng max.
 *
 * @time O(n) — hai lần duyệt
 * @space O(n) — một mảng phụ
 */
function candyV2(ratings: number[]): number {
  const n = ratings.length;
  const candies = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
  }
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }

  return candies.reduce((a, b) => a + b, 0);
}

console.log(candyV2([1, 0, 2])); // 5
console.log(candyV2([1, 2, 2])); // 4

/**
 * Solution 3: Slope Counting — O(1) Space
 * Đếm độ dài sườn lên (up) và xuống (down).
 * Một đỉnh núi với sườn lên=u, xuống=d cần max(u,d)+1 kẹo.
 * Tổng kẹo mỗi slope = tổng 1+2+..+k = k*(k+1)/2.
 *
 * @time O(n) — một lần duyệt
 * @space O(1) — không cần mảng phụ
 */
function candySlope(ratings: number[]): number {
  const tri = (n: number) => (n * (n + 1)) / 2;
  let total = 1;
  let up = 0;
  let down = 0;
  let peak = 0;

  for (let i = 1; i < ratings.length; i++) {
    if (ratings[i] > ratings[i - 1]) {
      // sườn lên mới: flush sườn xuống trước
      if (down > 0) {
        total += tri(up) + tri(down) + Math.max(up, down);
        up = 0;
        down = 0;
        peak = 0;
      }
      up++;
      peak = up;
    } else if (ratings[i] < ratings[i - 1]) {
      down++;
    } else {
      // bằng nhau: flush cả cụm hiện tại
      if (up > 0 || down > 0) {
        total += tri(up) + tri(down) + Math.max(up, down);
        up = 0;
        down = 0;
        peak = 0;
      }
      total += 1; // bắt đầu đỉnh mới = 1
    }
  }

  // flush phần còn lại
  if (up > 0 || down > 0) {
    total += tri(up) + tri(down) + Math.max(up, down);
  }

  return total;
}

console.log(candySlope([1, 0, 2])); // 5
console.log(candySlope([1, 2, 2])); // 4
console.log(candySlope([1, 3, 2, 2, 1])); // 7
```

## 🔗 Related Problems

| Problem                                                                                             | Pattern          | Difficulty |
| --------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water)                        | Two-pass / Stack | 🔴 Hard    |
| [134. Gas Station](https://leetcode.com/problems/gas-station)                                       | Greedy           | 🟡 Medium  |
| [135. Candy](https://leetcode.com/problems/candy)                                                   | Greedy           | 🔴 Hard    |
| [406. Queue Reconstruction by Height](https://leetcode.com/problems/queue-reconstruction-by-height) | Greedy           | 🟡 Medium  |
