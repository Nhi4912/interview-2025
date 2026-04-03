---
layout: page
title: "Count Pairs with XOR in a Range"
difficulty: Hard
category: String
tags: [Array, Bit Manipulation, Trie]
leetcode_url: "https://leetcode.com/problems/count-pairs-with-xor-in-a-range"
---

# Count Pairs with XOR in a Range / Đếm Cặp Có XOR Trong Khoảng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie / Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) | [Maximum XOR With an Element From Array](https://leetcode.com/problems/maximum-xor-with-an-element-from-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng kho mật mã gồm nhiều két sắt, mỗi két có mã số nhị phân 15 bit. Hai két "tương thích" nếu XOR mã số của chúng nằm trong khoảng [low, high]. Thay vì thử từng cặp két (O(n²)), ta dùng cây Trie nhị phân lưu các mã đã xét. Kỹ thuật chìa khóa: `countPairs(low, high) = countBelow(high+1) - countBelow(low)` — biến khoảng thành hiệu của hai truy vấn "nhỏ hơn". Khi duyệt Trie từng bit MSB→LSB, nếu bit giới hạn là 1 thì đếm nguyên nhánh XOR=0 rồi rẽ sang nhánh XOR=1 để tiếp tục.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Pairs with XOR in a Range example:**

```
nums = [1, 4, 2, 7], low = 2, high = 6  →  Answer = 6
Binary:  001, 100, 010, 111

countBelow(limit) strategy — query "4" against trie{1} for limit=7 (111):
  bit2: limBit=1, numBit=1 → add trie[0].count=0; go trie[0]  ← XOR bit=0 bucket
  bit1: limBit=1, numBit=0 → add trie[1].count=1; go trie[1]  ← XOR bit=0 bucket
  bit0: limBit=1, numBit=0 → add trie[1].count=0; go trie[1]
  Total for this pair = 1 (pair 1^4=5 ✓)

All valid pairs:
  1^4=5 ✓  1^2=3 ✓  1^7=6 ✓
  4^2=6 ✓  4^7=3 ✓  2^7=5 ✓  →  Total = 6
```

---

## Problem Description

Given integer array `nums` and integers `low`, `high`, return the number of **nice pairs** `(i, j)` where `i < j` and `low ≤ nums[i] XOR nums[j] ≤ high`.

**Example 1:** `nums = [1,4,2,7], low = 2, high = 6` → `6`
**Example 2:** `nums = [9,8,4,2,1], low = 5, high = 14` → `8`
**Example 3:** `nums = [1,1,1,1], low = 0, high = 0` → `6`

**Constraints:** `1 ≤ nums.length ≤ 2×10⁴`, `1 ≤ nums[i] ≤ 2×10⁴`, `0 ≤ low ≤ high ≤ 2×10⁴`

---

## 📝 Interview Tips

- **Range decomposition** / Phân tích khoảng: `count[low,high] = countBelow(high+1) - countBelow(low)` — biến 1 bài toán khoảng thành 2 bài toán "nhỏ hơn giới hạn" đơn giản hơn
- **Trie lưu lịch sử** / Trie stores history: Insert `nums[j]` sau khi query → tự động chỉ đếm cặp `j < i`, tránh đếm trùng
- **Quyết định từng bit** / Bit-by-bit: Nếu `limBit=1`, đếm toàn nhánh XOR=0, rồi tiếp tục nhánh XOR=1; nếu `limBit=0` chỉ đi nhánh XOR=0
- **count field trong node** / Count field: Mỗi TrieNode lưu số phần tử đi qua — cho phép đếm O(1) cả một subtree
- **MAX_BIT = 14** / 15 bits đủ: `nums[i] ≤ 2×10⁴ < 2^15`, dùng bit index 14..0
- **Brute O(n²) không đủ** / Brute TLEs: n=2×10⁴ → 4×10⁸ operations vượt giới hạn; Trie đưa về O(n·15)

---

## Solutions

```typescript
/**
 * @complexity Time: O(n²) | Space: O(1)
 * Check every pair — feasible only for n < 5000
 */
function countPairsBrute(nums: number[], low: number, high: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++) {
      const xor = nums[i] ^ nums[j];
      if (xor >= low && xor <= high) count++;
    }
  return count;
}

/**
 * @complexity Time: O(n·15) | Space: O(n·15)
 * For each num: query countBelow(high+1) - countBelow(low), then insert into trie.
 * countBelow(num, limit): at each bit, if limBit=1 collect XOR=0 subtree, dive XOR=1.
 */
function countPairs(nums: number[], low: number, high: number): number {
  const MAX_BIT = 14;
  const children: number[][] = [[0, 0]]; // [left-child-idx, right-child-idx]
  const cnt: number[] = [0];

  function insert(num: number): void {
    let node = 0;
    for (let bit = MAX_BIT; bit >= 0; bit--) {
      const b = (num >> bit) & 1;
      if (!children[node][b]) {
        children.push([0, 0]);
        cnt.push(0);
        children[node][b] = children.length - 1;
      }
      node = children[node][b];
      cnt[node]++;
    }
  }

  function countBelow(num: number, limit: number): number {
    let node = 0,
      result = 0;
    for (let bit = MAX_BIT; bit >= 0; bit--) {
      const numBit = (num >> bit) & 1;
      const limBit = (limit >> bit) & 1;
      if (limBit === 1) {
        const same = children[node][numBit];
        if (same) result += cnt[same]; // XOR bit=0 < limBit=1: count all
        const diff = children[node][1 - numBit]; // XOR bit=1 = limBit: continue
        if (!diff) break;
        node = diff;
      } else {
        const same = children[node][numBit];
        if (!same) break;
        node = same; // XOR bit=0 = limBit=0: continue
      }
    }
    return result;
  }

  let count = 0;
  for (const num of nums) {
    count += countBelow(num, high + 1) - countBelow(num, low);
    insert(num);
  }
  return count;
}

// === Test Cases ===
console.log(countPairsBrute([1, 4, 2, 7], 2, 6)); // → 6
console.log(countPairs([1, 4, 2, 7], 2, 6)); // → 6
console.log(countPairs([9, 8, 4, 2, 1], 5, 14)); // → 8
console.log(countPairs([1, 1, 1, 1], 0, 0)); // → 6
console.log(countPairs([5], 0, 100)); // → 0 (single element)
console.log(countPairs([1, 2, 4, 8], 0, 0)); // → 0 (no zero XOR pairs)
```

---

## 🔗 Related Problems

| Problem                                              | Difficulty | Link                                                                                          |
| ---------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| Maximum XOR of Two Numbers in an Array               | Medium     | [LC 421](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array)                |
| Maximum XOR With an Element From Array               | Hard       | [LC 1707](https://leetcode.com/problems/maximum-xor-with-an-element-from-array)               |
| Count Triplets That Can Form Two Arrays of Equal XOR | Medium     | [LC 1442](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor) |
