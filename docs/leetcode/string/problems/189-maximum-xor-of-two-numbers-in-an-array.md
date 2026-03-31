---
layout: page
title: "Maximum XOR of Two Numbers in an Array"
difficulty: Medium
category: String
tags: [Array, Hash Table, Bit Manipulation, Trie]
leetcode_url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array"
---

# Maximum XOR of Two Numbers in an Array / XOR Lớn Nhất Của Hai Số Trong Mảng

🟡 Medium | Array, Hash Table, Bit Manipulation, Trie

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Tham lam từ bit cao nhất — với mỗi bit từ 31 xuống 0, ta thử đặt bit đó thành 1 trong kết quả. Nếu tồn tại hai prefix mà XOR = target → giữ lại.

```
nums = [3,10,5,25,2,8]
bit 4: try result = 10000 = 16
  prefixes = {00,01,10,11,00,01} → can we find a ^ b = 10000?
  Check: for each prefix p, does p ^ target exist in set?
  Yes! → result |= (1 << 4)
...
Final answer: 28
```

## Problem Description

Given an integer array `nums`, return the **maximum result** of `nums[i] XOR nums[j]`, where `0 <= i <= j < n`. You must solve it in O(n) or O(n log n).

- **Example 1:** `nums = [3,10,5,25,2,8]` → `28` (5 XOR 25 = 28)
- **Example 2:** `nums = [14,70,53,83,49,91,36,80,92,51,66,70]` → `127`

## 📝 Interview Tips

- **🇻🇳 Greedy bit-by-bit** — thử từ bit cao nhất, giữ lại nếu khả thi / Greedy from MSB
- **🇻🇳 HashSet prefix** — với mỗi bit, lưu tất cả prefix, kiểm tra a ^ b == target / HashSet prefix check
- **🇻🇳 Trie approach** — xây trie nhị phân, với mỗi số tìm đường đối lập / Binary trie of all numbers
- **🇻🇳 XOR tính chất** — a ^ b = c ↔ a ^ c = b / XOR property: a^b=c ↔ a^c=b
- **🇻🇳 Thời gian** O(n) với HashSet, O(n \* 32) = O(n) với Trie / Both approaches are O(n)
- **🇻🇳 Phỏng vấn** — HashSet approach ít code hơn, dễ giải thích / HashSet approach is cleaner in interviews

## Solutions

### Solution 1: Greedy + HashSet (Optimal)

```typescript
/**
 * Greedy bit-by-bit with prefix HashSet
 * Time: O(n)  Space: O(n)
 */
function findMaximumXOR(nums: number[]): number {
  let maxXOR = 0;
  let mask = 0;

  for (let i = 31; i >= 0; i--) {
    mask |= 1 << i;

    // Build set of all prefixes at this bit level
    const prefixes = new Set<number>();
    for (const num of nums) {
      prefixes.add(num & mask);
    }

    // Try to achieve maxXOR with this bit set to 1
    const candidate = maxXOR | (1 << i);
    for (const prefix of prefixes) {
      // If (prefix ^ candidate) also exists in prefixes, we can achieve candidate
      if (prefixes.has(prefix ^ candidate)) {
        maxXOR = candidate;
        break;
      }
    }
  }

  return maxXOR;
}

// Test cases
console.log(findMaximumXOR([3, 10, 5, 25, 2, 8])); // 28
console.log(findMaximumXOR([14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70])); // 127
console.log(findMaximumXOR([0])); // 0
console.log(findMaximumXOR([8, 10, 2])); // 10
```

### Solution 2: Binary Trie

```typescript
/**
 * Binary Trie — insert all numbers, then query max XOR for each
 * Time: O(n * 32)  Space: O(n * 32)
 */
function findMaximumXORTrie(nums: number[]): number {
  // Build trie
  const trie: Array<[number, number]> = [[-1, -1]]; // [left(0), right(1)]

  const insert = (num: number): void => {
    let node = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (trie[node][bit] === -1) {
        trie[node][bit] = trie.length;
        trie.push([-1, -1]);
      }
      node = trie[node][bit];
    }
  };

  const queryMax = (num: number): number => {
    let node = 0;
    let xorVal = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const want = 1 - bit; // We want the opposite bit to maximize XOR
      if (trie[node][want] !== -1) {
        xorVal |= 1 << i;
        node = trie[node][want];
      } else {
        node = trie[node][bit];
      }
    }
    return xorVal;
  };

  for (const num of nums) insert(num);

  let maxXOR = 0;
  for (const num of nums) {
    maxXOR = Math.max(maxXOR, queryMax(num));
  }

  return maxXOR;
}

// Test cases
console.log(findMaximumXORTrie([3, 10, 5, 25, 2, 8])); // 28
console.log(findMaximumXORTrie([8, 10, 2])); // 10
```

### Solution 3: Brute Force (O(n²) reference)

```typescript
/**
 * Brute force — O(n^2) for comparison/small inputs
 * Time: O(n^2)  Space: O(1)
 */
function findMaximumXORBrute(nums: number[]): number {
  let max = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      max = Math.max(max, nums[i] ^ nums[j]);
    }
  }
  return max;
}

// Test cases
console.log(findMaximumXORBrute([3, 10, 5, 25, 2, 8])); // 28
console.log(findMaximumXORBrute([8, 10, 2])); // 10
```

## 🔗 Related Problems

| Problem                                                                                                         | Difficulty | Similarity             |
| --------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Maximum XOR With an Element From Array](https://leetcode.com/problems/maximum-xor-with-an-element-from-array/) | 🔴 Hard    | Trie + offline queries |
| [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/)                                       | 🟡 Medium  | Bit manipulation       |
| [Single Number](https://leetcode.com/problems/single-number/)                                                   | 🟢 Easy    | XOR properties         |
| [Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/)                                     | 🟡 Medium  | Trie data structure    |
