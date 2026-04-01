---
layout: page
title: "Maximize Score After N Operations"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Backtracking, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/maximize-score-after-n-operations"
---

# Maximize Score After N Operations / Tối Đa Điểm Sau N Phép Toán

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Bitmask DP
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Number of Lines to Cover Points](https://leetcode.com/problems/minimum-number-of-lines-to-cover-points) | [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như ghép đôi sinh viên vào nhóm học — mỗi vòng bạn ghép 1 cặp, điểm nhận được tăng theo vòng (vòng 1 × GCD, vòng 2 × GCD...). Để biết đã ghép ai rồi, dùng bitmask. Bitmask có số bit 1 chẵn = đã ghép xong một số cặp → vòng tiếp theo là số bit 1 / 2 + 1.

**Pattern Recognition:**

- Signal: 2n elements, pair them in n rounds, score = round × gcd → **Bitmask DP**
- Key insight: `dp[mask]` = max score when the set of used elements is `mask`. If `popcount(mask) = 2k`, we just finished operation `k`. Try all pairs (i, j) in `mask` as the last pair chosen.

**Visual — nums=[3,4,6,8], n=2 example:**

```
Masks with popcount=2 (operation 1 complete):
  dp[0011] = 1 × gcd(3,4) = 1   dp[0101] = 1 × gcd(3,6) = 3
  dp[0110] = 1 × gcd(4,6) = 2   dp[1001] = 1 × gcd(3,8) = 1
  dp[1010] = 1 × gcd(4,8) = 4   dp[1100] = 1 × gcd(6,8) = 2

Masks with popcount=4 (operation 2 complete):
  dp[1111]: try all pairs (i,j) in {0,1,2,3}
    remove pair(0,2): dp[0101]+2×gcd(4,8) = 3+8 = 11 ✓ best!
    remove pair(1,3): dp[1010]+2×gcd(3,6) = 4+6 = 10

Answer: 11
```

---

## 📝 Problem Description

Given `nums` of length `2n`, perform `n` operations. In operation `k` (1-indexed), pick 2 unused numbers; score `+= k × gcd(a, b)`. Maximize total score.

- **Example 1:** `nums=[1,2]` → `1` (n=1: 1×gcd(1,2)=1)
- **Example 2:** `nums=[3,4,6,8]` → `11` (op1: 1×gcd(3,6)=3, op2: 2×gcd(4,8)=8)
- **Constraints:** `1 ≤ n ≤ 7`, `nums.length = 2n`, `1 ≤ nums[i] ≤ 10^6`

---

## 🎯 Interview Tips

1. **Bitmask = state** / Bitmask = trạng thái: mỗi bit 1 nghĩa là số đó đã được dùng; `popcount/2` = số phép đã thực hiện
2. **Operation number** / Số thứ tự phép: `cnt = popcount(mask)`, đây là sau `cnt/2` phép → phép tiếp theo là `cnt/2 + 1` hoặc dùng `cnt/2` khi tính dp[mask]
3. **Precompute GCDs** / Tính trước GCD: O(n²) bảng GCD tránh tính lại
4. **3^n complexity** / Độ phức tạp 3^n: duyệt tất cả submask của mỗi mask → 3^n với n=7 là 2187 — rất nhanh
5. **Why n ≤ 7** / Tại sao n ≤ 7: vì 2^(2n) = 2^14 = 16384 states × O(n²) pairs ≈ 800K — chấp nhận được
6. **GCD insight** / Mẹo GCD: ghép số có GCD lớn hơn vào vòng cuối (hệ số k lớn hơn)

---

## 💡 Solutions

### Approach 1: Backtracking with Memoization

/\*_ @complexity Time: O(n² × 2^(2n)) | Space: O(2^(2n)) _/

```typescript
function maximizeScoreMemo(nums: number[]): number {
  const m = nums.length;
  const memo = new Int32Array(1 << m).fill(-1);

  function gcd(a: number, b: number): number {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  function dp(mask: number): number {
    if (mask === 0) return 0;
    if (memo[mask] !== -1) return memo[mask];
    const cnt = bitCount(mask);
    const op = (m - cnt) / 2 + 1; // which operation number this is
    let best = 0;
    for (let i = 0; i < m; i++) {
      if (!(mask & (1 << i))) continue;
      for (let j = i + 1; j < m; j++) {
        if (!(mask & (1 << j))) continue;
        const next = mask ^ (1 << i) ^ (1 << j);
        best = Math.max(best, dp(next) + op * gcd(nums[i], nums[j]));
      }
    }
    return (memo[mask] = best);
  }

  function bitCount(n: number): number {
    let c = 0;
    while (n) {
      n &= n - 1;
      c++;
    }
    return c;
  }

  return dp((1 << m) - 1);
}
```

### Approach 2: Bottom-Up Bitmask DP — Optimal

/\*_ @complexity Time: O(n² × 2^(2n)) | Space: O(2^(2n)) _/

```typescript
function maximizeScore(nums: number[]): number {
  const m = nums.length; // = 2n
  const full = (1 << m) - 1;
  const dp = new Int32Array(full + 1);

  function gcd(a: number, b: number): number {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }
  function popcount(x: number): number {
    let c = 0;
    while (x) {
      x &= x - 1;
      c++;
    }
    return c;
  }

  // Precompute GCDs
  const gcds: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) gcds[i][j] = gcd(nums[i], nums[j]);

  // Process masks in increasing popcount order (0 → 2n)
  for (let mask = 1; mask <= full; mask++) {
    const cnt = popcount(mask);
    if (cnt % 2 !== 0) continue; // only process even-popcount masks
    const op = cnt / 2; // this mask represents completing operation 'op'
    for (let i = 0; i < m; i++) {
      if (!(mask & (1 << i))) continue;
      for (let j = i + 1; j < m; j++) {
        if (!(mask & (1 << j))) continue;
        const prev = mask ^ (1 << i) ^ (1 << j);
        dp[mask] = Math.max(dp[mask], dp[prev] + op * gcds[i][j]);
      }
    }
  }

  return dp[full];
}
```

---

## 🧪 Test Cases

```typescript
console.log(maximizeScore([1, 2])); // → 1  (1×gcd(1,2)=1)
console.log(maximizeScore([3, 4, 6, 8])); // → 11 (gcd(3,6)×1+gcd(4,8)×2=3+8)
console.log(maximizeScore([1, 2, 3, 4, 5, 6])); // → 14
console.log(maximizeScore([6, 6])); // → 6
```
---

## Related Problems

| Problem                                                                                                    | Difficulty | Pattern    |
| ---------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)                               | Medium     | Bitmask DP |
| [Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) | Hard       | Bitmask DP |
| [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets)         | Medium     | Bitmask DP |
