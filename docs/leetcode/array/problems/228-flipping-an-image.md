---
layout: page
title: "Flipping an Image"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Bit Manipulation, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/flipping-an-image"
---

# Flipping an Image / Lật Hình Ảnh

> **Difficulty**: 🟢 Easy | **Category**: Array | **Pattern**: Two Pointers / Bit XOR

## 🧠 Intuition / Tư Duy

**Như lật tấm ảnh và đổi màu đen trắng**: đảo ngược hàng (reverse), rồi đổi bit (0→1, 1→0). Nhưng có trick: nếu hai phần tử đối xứng bằng nhau thì reverse+flip = đổi cả hai; nếu khác nhau thì giữ nguyên.

**Pattern Recognition:**

- Flip = XOR với 1; reverse = đảo thứ tự
- Two pointers: xử lý cặp đối xứng cùng lúc
- Nếu row[l] !== row[r]: sau flip+reverse vẫn bằng nhau → không đổi
- Nếu row[l] === row[r]: sau flip+reverse cả hai đổi giá trị

**Visual:**

```
row = [1,1,0]  → reverse: [0,1,1] → flip: [1,0,0]
Two-pointer trick on [1,1,0]:
l=0,r=2: row[0]=1, row[2]=0 → different → swap positions, result: 0 XOR 1 = 1 / 1 XOR 1 = 0
l=1=r=1 (middle): flip → 1 XOR 1 = 0
Final: [1,0,0] ✓
```

## Problem Description

Cho ma trận nhị phân `image`. Mỗi hàng: (1) đảo ngược thứ tự, (2) đổi bit (0↔1). Trả về ma trận sau khi biến đổi.

**Example 1:** `[[1,1,0],[1,0,1],[0,0,0]]` → `[[1,0,0],[0,1,0],[1,1,1]]`
**Example 2:** `[[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]` → `[[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]`

**Constraints:** `n == image.length == image[i].length`, `1 ≤ n ≤ 20`, `image[i][j] ∈ {0,1}`

## 📝 Interview Tips

1. **Naive approach**: reverse row, then map XOR 1 — O(n²) hoàn toàn OK
2. **Optimization trick**: two pointers — nếu row[l]===row[r], XOR cả hai với 1; nếu khác nhau, swap + XOR = không đổi giá trị tại vị trí mới
3. **XOR flip**: `val ^ 1` đổi 0↔1 nhanh hơn điều kiện if/else
4. **Middle element**: luôn phải flip vì không có cặp đối xứng
5. **In-place vs new array**: bài này an toàn khi làm in-place từng hàng
6. **Phỏng vấn**: trình bày naive trước, sau đó tối ưu với two-pointer trick

## Solutions

```typescript
// Solution 1: Simple reverse + flip — O(n²) time, O(1) extra
function flipAndInvertImage(image: number[][]): number[][] {
  for (const row of image) {
    row.reverse();
    for (let i = 0; i < row.length; i++) {
      row[i] ^= 1;
    }
  }
  return image;
}

// Solution 2: Two-pointer in-place trick — O(n²) time, O(1) space
function flipAndInvertImageV2(image: number[][]): number[][] {
  for (const row of image) {
    const n = row.length;
    let l = 0,
      r = n - 1;
    while (l <= r) {
      if (row[l] === row[r]) {
        // same value → after reverse+flip, both change
        row[l] ^= 1;
        row[r] ^= 1;
      }
      // if different: after reverse position swap + flip both → they stay the same (0,1)→(0,1)
      l++;
      r--;
    }
  }
  return image;
}

// Solution 3: Functional approach — new array
function flipAndInvertImageV3(image: number[][]): number[][] {
  return image.map((row) => [...row].reverse().map((v) => v ^ 1));
}

// Tests
console.log(
  JSON.stringify(
    flipAndInvertImage([
      [1, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ]),
  ),
);
// [[1,0,0],[0,1,0],[1,1,1]]
console.log(
  JSON.stringify(
    flipAndInvertImageV2([
      [1, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ]),
  ),
);
// [[1,0,0],[0,1,0],[1,1,1]]
console.log(
  JSON.stringify(
    flipAndInvertImageV3([
      [1, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ]),
  ),
);
// [[1,0,0],[0,1,0],[1,1,1]]
```

## 🔗 Related Problems

| Problem                                                     | Relationship               |
| ----------------------------------------------------------- | -------------------------- |
| 832 - Flipping an Image                                     | This exact problem         |
| 1886 - Determine Whether Matrix Can Be Obtained By Rotation | Matrix transformation      |
| 48 - Rotate Image                                           | In-place matrix operations |
| 2946 - Matrix Similarity After Cyclic Shifts                | Row transformation pattern |
