---
layout: page
title: "Taking Maximum Energy From the Mystic Dungeon"
difficulty: Medium
category: Array
tags: [Array, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/taking-maximum-energy-from-the-mystic-dungeon"
---

# Taking Maximum Energy From the Mystic Dungeon / Lấy Năng Lượng Tối Đa Từ Ngục Tối Huyền Bí

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Suffix Sum / Greedy

## 🧠 Intuition / Tư Duy

**Như leo cầu thang với bước nhảy k**: từ mỗi ô bạn chỉ nhảy tới ô cách đúng k bước. Mỗi chuỗi bắt đầu từ một ô trong k ô đầu tiên, sau đó cộng dồn năng lượng theo bước k.

**Pattern Recognition:**

- Mỗi vị trí bắt đầu i (0 ≤ i < k) tạo ra một chuỗi: i, i+k, i+2k, ...
- Tính suffix sum từ cuối mảng → dễ dàng tìm max cho mỗi chuỗi
- Duyệt từ phải sang trái, cộng dồn energy[i] += energy[i+k]

**Visual:**

```
energy = [5,2,-10,-5,1], k=3
Chains: [0,3] → 5+(-5)=0  |  [1,4] → 2+1=3  |  [2] → -10
Suffix: i=4: 1 | i=3: -5 | i=2: -10 | i=1: 2+1=3 | i=0: 5+(-5)=0
Answer = max(0, 3, -10) = 3
```

## Problem Description

Có `n` phòng dungeon với mảng `energy`. Sorcerer bắt đầu từ phòng `i` (0 ≤ i < k) và di chuyển theo bước k. Tổng energy thu được là tổng energy của các phòng đi qua. Trả về tổng energy **tối đa** có thể thu được.

**Example 1:** `energy = [5,2,-10,-5,1], k = 3` → `3`
**Example 2:** `energy = [-2,-3,-1], k = 2` → `-1`

**Constraints:** `1 ≤ energy.length ≤ 10^5`, `-10^9 ≤ energy[i] ≤ 10^9`, `1 ≤ k ≤ energy.length`

## 📝 Interview Tips

1. **Key insight**: mỗi start point i < k tạo một chuỗi độc lập với bước k
2. **Suffix sum trick**: cộng dồn ngược từ phải để tránh tính lại
3. **In-place**: có thể modify mảng gốc hoặc dùng mảng phụ
4. **Answer chỉ là max trong k ô đầu** sau khi suffix sum
5. **O(n) time**: duyệt một lần từ phải sang trái
6. **Chú ý**: k có thể = n, khi đó chỉ có một chain

## Solutions

```typescript
// Solution 1: Suffix sum in-place — O(n) time, O(1) extra space
function maximumEnergy(energy: number[], k: number): number {
  const n = energy.length;
  // Build suffix sums along each chain (step k)
  for (let i = n - 1 - k; i >= 0; i--) {
    energy[i] += energy[i + k];
  }
  // Answer is max of first k elements (start of each chain)
  let ans = -Infinity;
  for (let i = 0; i < k; i++) {
    ans = Math.max(ans, energy[i]);
  }
  return ans;
}

// Solution 2: No mutation — O(n) time, O(n) space
function maximumEnergyV2(energy: number[], k: number): number {
  const n = energy.length;
  const suffix = [...energy];
  for (let i = n - 1 - k; i >= 0; i--) {
    suffix[i] += suffix[i + k];
  }
  let ans = -Infinity;
  for (let i = 0; i < k; i++) {
    ans = Math.max(ans, suffix[i]);
  }
  return ans;
}

// Solution 3: Explicit chain enumeration — clearest O(n) approach
function maximumEnergyV3(energy: number[], k: number): number {
  const n = energy.length;
  let ans = -Infinity;
  for (let start = 0; start < k; start++) {
    let total = 0;
    for (let j = start; j < n; j += k) {
      total += energy[j];
    }
    ans = Math.max(ans, total);
  }
  return ans;
}

// Tests
console.log(maximumEnergy([5, 2, -10, -5, 1], 3)); // 3
console.log(maximumEnergy([-2, -3, -1], 2)); // -1
console.log(maximumEnergyV2([5, 2, -10, -5, 1], 3)); // 3
console.log(maximumEnergyV3([5, 2, -10, -5, 1], 3)); // 3
```

## 🔗 Related Problems

| Problem                                          | Relationship               |
| ------------------------------------------------ | -------------------------- |
| 1277 - Count Square Submatrices                  | Prefix sum 2D variant      |
| 2391 - Minimum Amount of Time to Collect Garbage | Chain processing with step |
| 724 - Find Pivot Index                           | Prefix/suffix sum          |
| 1480 - Running Sum of 1d Array                   | Basic prefix sum           |
