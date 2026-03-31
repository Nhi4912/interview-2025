---
layout: page
title: "Number of Sub-arrays With Odd Sum"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum"
---

# Number of Sub-arrays With Odd Sum / Số Mảng Con Có Tổng Lẻ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) | [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như đếm đồng xu lẻ — tổng từ i đến j lẻ khi và chỉ khi prefix[i-1] và prefix[j] khác tính chẵn lẻ. Chỉ cần đếm bao nhiêu prefix trước đó có pariry khác!

```
arr = [1, 3, 5]
prefix parity: [0, 1, 0, 1]  (0=even, 1=odd)
                 ^start

At each index i (prefix parity):
  i=0: parity=1 (odd) → count subarrays ending here with odd sum
       = number of EVEN prefix parities before = 1 (the initial 0)
  i=1: parity=0 (even) → add ODD prefix parities before = 1
  i=2: parity=1 (odd)  → add EVEN prefix parities before = 2

Total = 1 + 1 + 2 = 4
```

**Key insight:** `sum(i..j)` is odd iff `prefix[j]` and `prefix[i-1]` have different parity. Track `evenCount` and `oddCount` of prefix parities seen so far.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Parity trick**: `sum(l,r)` odd iff `prefix[r]` XOR `prefix[l-1]` = 1 / tổng lẻ khi prefix khác pariry
- 🔑 **Track counts**: Keep `evenCount` and `oddCount` of prefix parities seen / đếm số prefix chẵn và lẻ
- 🔑 **At each step**: If current prefix is odd → add `evenCount`; else add `oddCount` / thêm số prefix khác pariry
- 🔑 **Init**: `evenCount = 1` (empty prefix has sum 0, which is even) / prefix rỗng là chẵn
- 🔑 **MOD = 1e9+7**: Result can be huge, apply modulo at each step / lấy dư mỗi bước
- 🔑 **O(n) time, O(1) space**: No prefix array needed — just two counters / chỉ cần 2 biến đếm

---

## Solutions / Giải Pháp

### Solution 1: Prefix Parity Count (O(n) time, O(1) space)

```typescript
/**
 * Number of Sub-arrays With Odd Sum — Prefix Parity
 *
 * Key: sum(l..r) is odd iff parity(prefix[r]) != parity(prefix[l-1]).
 * Track how many even and odd prefix sums we've seen.
 * At each position: if prefix is odd, add evenCount (pairs with odd sum); else add oddCount.
 *
 * Time:  O(n)
 * Space: O(1)
 */
function numOfSubarrays(arr: number[]): number {
  const MOD = 1_000_000_007;
  let evenCount = 1; // prefix sum 0 is even
  let oddCount = 0;
  let prefixSum = 0;
  let result = 0;

  for (const num of arr) {
    prefixSum += num;
    if (prefixSum % 2 === 1) {
      // Current prefix is odd: pairs with all previous even prefixes → odd sub-array sum
      result = (result + evenCount) % MOD;
      oddCount++;
    } else {
      // Current prefix is even: pairs with all previous odd prefixes → odd sub-array sum
      result = (result + oddCount) % MOD;
      evenCount++;
    }
  }

  return result;
}

console.log(numOfSubarrays([1, 3, 5])); // 4
console.log(numOfSubarrays([2, 4, 6])); // 0
console.log(numOfSubarrays([1, 2, 3, 4, 5])); // 8
console.log(numOfSubarrays([100, 100, 99, 99])); // 4
```

### Solution 2: DP Approach (O(n) time, O(1) space)

```typescript
/**
 * Number of Sub-arrays With Odd Sum — DP
 *
 * dp[i] = number of subarrays ending at index i with odd sum.
 * If arr[i] is odd: dp[i] = (subarrays ending at i-1 with even sum) + 1 (just arr[i] itself)
 *                          = (i - dp[i-1]) + 1  ... wait, simpler:
 * If arr[i] is odd:  dp[i] = (i - oddEnding) where oddEnding = subarrays with odd sum ending before
 *
 * Cleaner: track directly how many subarrays ending here have odd/even sum.
 *
 * Time:  O(n)
 * Space: O(1)
 */
function numOfSubarraysDP(arr: number[]): number {
  const MOD = 1_000_000_007;
  let oddEnding = 0; // subarrays ending at previous index with odd sum
  let evenEnding = 0; // subarrays ending at previous index with even sum
  let result = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 1) {
      // Odd element flips parity: odd→even, even→odd, plus new subarray [arr[i]] is odd
      const newOdd = evenEnding + 1;
      const newEven = oddEnding;
      oddEnding = newOdd;
      evenEnding = newEven;
    } else {
      // Even element keeps parity unchanged
      // oddEnding and evenEnding stay the same
    }
    result = (result + oddEnding) % MOD;
  }

  return result;
}

console.log(numOfSubarraysDP([1, 3, 5])); // 4
console.log(numOfSubarraysDP([2, 4, 6])); // 0
console.log(numOfSubarraysDP([1, 2, 3, 4, 5])); // 8
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                              | Difficulty | Pattern              |
| -------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                                         | 🟡 Medium  | Prefix Sum + HashMap |
| [Contiguous Array](https://leetcode.com/problems/contiguous-array)                                                   | 🟡 Medium  | Prefix Sum Parity    |
| [Count Subarrays with More Ones than Zeros](https://leetcode.com/problems/count-subarrays-with-more-ones-than-zeros) | 🟡 Medium  | Prefix Sum           |
| [Stone Game VIII](https://leetcode.com/problems/stone-game-viii)                                                     | 🔴 Hard    | Prefix Sum           |
