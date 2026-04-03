---
layout: page
title: "Make Sum Divisible by P"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/make-sum-divisible-by-p"
---

# Make Sum Divisible by P / Xóa Mảng Con Nhỏ Nhất Để Chia Hết Cho P

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Hash Map
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán chia tiền thừa: bạn có tổng tiền dư `r` sau khi chia cho P. Bạn cần tìm đoạn ngắn nhất trong tổng hiện tại cũng dư đúng `r`, rồi cắt bỏ nó. Dùng prefix sum mod P và hash map để tìm cặp này trong O(1).

**Pattern Recognition:**

- "Remove subarray to make total divisible" → Find subarray with sum ≡ target (mod P)
- "Subarray sum mod k" + "minimum length" → Prefix Sum + Hash Map (same as Subarray Sum Equals K variant)
- `prefix[j] - prefix[i] ≡ target (mod P)` → store `prefix[i]` keyed by its mod value

**Visual:**

```
nums=[3,1,4,2], p=6 → total=10, target=10%6=4

prefix mod 6:  0   3   4   2   4
               ^               ^
idx:          -1   0   1   2   3

At i=3: prefix=4, need=(4-4+6)%6=0 → found at idx=-1 → len=3-(-1)-1=3
At i=2: prefix=2, need=(2-4+6)%6=4 → found at idx=1 → len=2-1-1=0? No wait len=2-1=1
→ answer = 1 (remove index 2, value 4)
```

## Problem Description

Given `nums` and integer `p`, remove the **shortest** subarray (possibly empty) such that the remaining sum is divisible by `p`. Return the length of that subarray, or `-1` if impossible.

- `nums=[3,1,4,2], p=6` → `1` (remove `[4]`)
- `nums=[6,3,5,2], p=9` → `2` (remove `[5,2]`)
- `nums=[1,2,3], p=3` → `0` (sum already divisible)

## 📝 Interview Tips

1. **Clarify**: Can we remove the entire array? No — remaining must be non-empty / không xóa cả mảng
2. **Approach**: Prefix sum mod P + HashMap to find shortest sub with sum ≡ target / dùng prefix sum modulo
3. **Edge cases**: `total % p == 0` → return 0; subarray length = n → return -1 / tổng đã chia hết hoặc phải xóa hết
4. **Optimize**: Negative mod in JS: use `((x % p) + p) % p` / mod âm trong JS cần xử lý
5. **Follow-up**: Count all such subarrays? → Use frequency map / đếm tất cả đoạn thỏa mãn
6. **Complexity**: Time O(n), Space O(n) for hash map / thời gian O(n), không gian O(n)

## Solutions

```typescript
/** Solution 1: Brute Force — try all subarrays O(n²)
 * Time: O(n²) | Space: O(1)
 */
function makeSumDivisibleByPBrute(nums: number[], p: number): number {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % p === 0) return 0;
  const n = nums.length;
  let ans = n;

  for (let i = 0; i < n; i++) {
    let sub = 0;
    for (let j = i; j < n; j++) {
      sub += nums[j];
      const rem = (total - sub) % p;
      if (rem === 0) ans = Math.min(ans, j - i + 1);
    }
  }
  return ans === n ? -1 : ans;
}

/** Solution 2: Prefix Sum + HashMap — find shortest subarray sum ≡ target (mod p)
 * Time: O(n) | Space: O(n)
 */
function makeSumDivisibleByP(nums: number[], p: number): number {
  const total = nums.reduce((a, b) => (a + b) % p, 0);
  const target = total % p;
  if (target === 0) return 0;

  // map: prefix_mod → last index where this mod was seen
  const lastSeen = new Map<number, number>();
  lastSeen.set(0, -1); // prefix sum 0 at virtual index -1

  let prefix = 0;
  let ans = nums.length; // impossible sentinel

  for (let i = 0; i < nums.length; i++) {
    prefix = (prefix + nums[i]) % p;
    // we want prefix[j] - prefix[i-1] ≡ target (mod p)
    // i.e. prefix[i-1] ≡ prefix[j] - target (mod p)
    const need = (((prefix - target) % p) + p) % p;

    if (lastSeen.has(need)) {
      const prevIdx = lastSeen.get(need)!;
      ans = Math.min(ans, i - prevIdx);
    }
    lastSeen.set(prefix, i);
  }

  return ans === nums.length ? -1 : ans;
}

/** Solution 3: Same as Solution 2 but with running total instead of reduce
 * Time: O(n) | Space: O(n)
 */
function makeSumDivisibleByPv2(nums: number[], p: number): number {
  let total = 0;
  for (const x of nums) total = (total + x) % p;
  if (total === 0) return 0;

  const map = new Map([[0, -1]]);
  let cur = 0,
    ans = nums.length;

  for (let i = 0; i < nums.length; i++) {
    cur = (cur + nums[i]) % p;
    const need = (((cur - total) % p) + p) % p;
    if (map.has(need)) ans = Math.min(ans, i - map.get(need)!);
    map.set(cur, i);
  }
  return ans >= nums.length ? -1 : ans;
}

// Test cases
console.log(makeSumDivisibleByP([3, 1, 4, 2], 6)); // 1
console.log(makeSumDivisibleByP([6, 3, 5, 2], 9)); // 2
console.log(makeSumDivisibleByP([1, 2, 3], 3)); // 0
console.log(makeSumDivisibleByP([1, 2, 3], 7)); // -1
console.log(makeSumDivisibleByPBrute([3, 1, 4, 2], 6)); // 1
console.log(makeSumDivisibleByPv2([6, 3, 5, 2], 9)); // 2
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship                             |
| ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)               | Same prefix sum + hash map technique     |
| [Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k) | Count instead of minimize length         |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)       | Minimize subarray length with constraint |
