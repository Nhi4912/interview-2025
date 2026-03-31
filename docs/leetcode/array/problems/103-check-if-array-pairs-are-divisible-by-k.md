---
layout: page
title: "Check If Array Pairs Are Divisible by k"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Counting]
leetcode_url: "https://leetcode.com/problems/check-if-array-pairs-are-divisible-by-k"
---

# Check If Array Pairs Are Divisible by k / Kiểm Tra Cặp Phần Tử Chia Hết Cho k

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map / Remainder Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng bạn chia học sinh vào các nhóm theo "số dư khi chia chiều cao cho k". Để ghép cặp, học sinh nhóm dư `r` phải ghép với nhóm dư `k-r`. Nhóm dư `0` tự ghép với nhau, nhóm dư `k/2` (nếu k chẵn) cũng tự ghép — và mỗi nhóm phải có số chẵn thành viên.

**Pattern Recognition:**

- Hai số `a + b` chia hết cho k ↔ `(a%k + b%k) % k == 0`
- Nhóm phần dư `r` phải khớp với nhóm `k-r`
- Trường hợp đặc biệt: `r=0` (tự ghép), `r=k/2` khi k chẵn (tự ghép)

**Visual:**

```
arr = [1,2,3,4,5,10,6,7,8,9], k = 5
Remainders: [1,2,3,4,0,0,1,2,3,4]
Count: {0:2, 1:2, 2:2, 3:2, 4:2}

Check r=0: count[0]=2 even ✅
Check r=1: count[1]=2 == count[4]=2 ✅
Check r=2: count[2]=2 == count[3]=2 ✅
→ true
```

## Problem Description

Given an integer array `arr` of even length `n` and an integer `k`, return `true` if you can divide the array into exactly `n/2` pairs such that the sum of each pair is divisible by `k`.

**Example 1:** `arr = [1,2,3,4,5,10,6,7,8,9], k = 5` → `true`

**Example 2:** `arr = [1,2,3,4,5,6], k = 7` → `true`

**Constraints:** `arr.length == n`, `2 <= n <= 10^5`, `n` is even, `-10^9 <= arr[i] <= 10^9`, `1 <= k <= 10^5`.

## 📝 Interview Tips

1. **Clarify**: Số âm thì sao? — Negative numbers: use `((x % k) + k) % k` for positive remainder.
2. **Approach**: Group by remainder → pair remainder `r` with `k-r` — O(n) solution.
3. **Edge cases**: `r=0` must have even count; `r=k/2` (k even) must have even count; negative inputs need modulo fix.
4. **Optimize**: O(n²) brute force pairing → O(n) with remainder frequency map.
5. **Test**: `arr=[-1,-2,-3,-4,-5,6,7,8,9,10], k=5` — test with negatives.
6. **Follow-up**: What if k=1? — Every sum divisible by 1, always true if n is even.

## Solutions

```typescript
/** Solution 1: Brute Force — try all pairings (backtracking)
 * Time: O(n!) | Space: O(n) — only for small inputs
 */
function canArrange1(arr: number[], k: number): boolean {
  const used = new Array(arr.length).fill(false);
  const backtrack = (count: number): boolean => {
    if (count === arr.length / 2) return true;
    const first = used.indexOf(false);
    if (first === -1) return false;
    used[first] = true;
    for (let j = first + 1; j < arr.length; j++) {
      if (!used[j] && (arr[first] + arr[j]) % k === 0) {
        used[j] = true;
        if (backtrack(count + 1)) return true;
        used[j] = false;
      }
    }
    used[first] = false;
    return false;
  };
  return backtrack(0);
}

/** Solution 2: Remainder Counting — group by (x % k + k) % k
 * Time: O(n) | Space: O(k)
 */
function canArrange(arr: number[], k: number): boolean {
  const remainderCount = new Array(k).fill(0);

  for (const num of arr) {
    // Handle negative numbers: ensure positive remainder
    const rem = ((num % k) + k) % k;
    remainderCount[rem]++;
  }

  // Remainder 0: must be even count (pair with themselves)
  if (remainderCount[0] % 2 !== 0) return false;

  for (let r = 1; r <= Math.floor(k / 2); r++) {
    // Pair r with k-r — must have equal counts
    if (remainderCount[r] !== remainderCount[k - r]) return false;
  }

  // Edge: if k is even, remainder k/2 must also be even count
  if (k % 2 === 0 && remainderCount[k / 2] % 2 !== 0) return false;

  return true;
}

/** Solution 3: Map-based (cleaner for interview) — same O(n) approach
 * Time: O(n) | Space: O(k)
 */
function canArrange3(arr: number[], k: number): boolean {
  const freq = new Map<number, number>();
  for (const num of arr) {
    const r = ((num % k) + k) % k;
    freq.set(r, (freq.get(r) ?? 0) + 1);
  }
  for (const [r, cnt] of freq) {
    if (r === 0) {
      if (cnt % 2 !== 0) return false;
    } else {
      if (cnt !== (freq.get(k - r) ?? 0)) return false;
    }
  }
  return true;
}

// Test cases
console.log(canArrange([1, 2, 3, 4, 5, 10, 6, 7, 8, 9], 5)); // true
console.log(canArrange([1, 2, 3, 4, 5, 6], 7)); // true
console.log(canArrange([1, 2, 3, 4, 5, 6], 10)); // false
console.log(canArrange([-1, -2, -3, -4, -5, 6], 5)); // false (5 elements, odd arr)
console.log(canArrange3([1, 2, 3, 4, 5, 10, 6, 7, 8, 9], 5)); // true
```

## 🔗 Related Problems

| Problem                                                                                                                                  | Relationship                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Pairs of Songs With Total Durations Divisible by 60](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60) | Same remainder-pairing concept with k=60              |
| [Two Sum](https://leetcode.com/problems/two-sum)                                                                                         | Find one pair summing to target; this finds all pairs |
| [Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k)                                               | Prefix sum modulo k — same remainder math             |
