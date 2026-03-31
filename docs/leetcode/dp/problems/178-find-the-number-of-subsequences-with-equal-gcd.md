---
layout: page
title: "Find the Number of Subsequences With Equal GCD"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Number Theory]
leetcode_url: "https://leetcode.com/problems/find-the-number-of-subsequences-with-equal-gcd"
---

# Find the Number of Subsequences With Equal GCD / Đếm Cặp Dãy Con Có GCD Bằng Nhau

🔴 Hard | Dynamic Programming · Number Theory

---

## 🧠 Intuition

**EN:** Count pairs of non-empty disjoint subsequences (S1, S2) where `gcd(S1) == gcd(S2)`. Use DP: `dp[g1][g2]` = number of ways to partition the prefix into two sets where S1 has running GCD `g1` and S2 has running GCD `g2`. For each element, either add to S1, add to S2, or skip.

**VI:** Đếm cặp dãy con rỗng (S1, S2) không giao nhau với `gcd(S1) == gcd(S2)`. DP: `dp[g1][g2]` = số cách phân chia tiền tố thành hai tập sao cho GCD của S1 là g1, GCD của S2 là g2. Với mỗi phần tử: thêm vào S1, thêm vào S2, hoặc bỏ qua.

```
dp[g1][g2] = # ways with gcd(S1)=g1, gcd(S2)=g2

For element x:
  new_dp[gcd(g1,x)][g2] += dp[g1][g2]  (add x to S1)
  new_dp[g1][gcd(g2,x)] += dp[g1][g2]  (add x to S2)
  new_dp[g1][g2]         += dp[g1][g2]  (skip x)

Also initialize: new_dp[x][0] += 1  (start new S1 with x)
                 new_dp[0][x] += 1  (start new S2 with x)

Answer: Σ dp[g][g] for g >= 1   (equal GCDs)
```

---

## 📝 Interview Tips

- 🔑 **EN:** `dp[g1][g2]`: g1=running GCD of S1 (0 means empty), g2=running GCD of S2. **VI:** dp[g1][g2]: g1=GCD hiện tại của S1 (0=rỗng), g2=GCD của S2.
- 🔑 **EN:** For each element: 3 choices — add to S1, add to S2, skip. Use GCD update formula. **VI:** Mỗi phần tử: 3 lựa chọn — thêm vào S1, S2, hoặc bỏ qua. Cập nhật GCD.
- 🔑 **EN:** Use `gcd(0, x) = x` to handle empty set initialization naturally. **VI:** Dùng gcd(0, x) = x để khởi tạo tập rỗng tự nhiên.
- 🔑 **EN:** Only `O(maxVal^2)` non-zero states; maxVal≤200 so ≤40000 states. **VI:** Tối đa O(maxVal^2) = 40000 trạng thái khác 0.
- 🔑 **EN:** Count answer as `Σ dp[g][g]` for g≥1 (both non-empty, equal GCDs). **VI:** Kết quả = Σ dp[g][g] với g≥1 (cả hai khác rỗng, GCD bằng nhau).
- 🔑 **EN:** All arithmetic mod 1e9+7. **VI:** Tất cả tính toán mod 1e9+7.

---

## 💡 Solutions

```typescript
/**
 * DP on pairs of GCDs
 * Time: O(n * maxVal^2 * log(maxVal))  Space: O(maxVal^2)
 */
function countSubsequencesWithEqualGcd(nums: number[]): number {
  const MOD = 1_000_000_007;
  const maxVal = Math.max(...nums);

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  // dp[g1][g2] = number of (S1, S2) pairs with GCD g1 and g2 respectively
  // g=0 means empty set
  const dp: number[][] = Array.from({ length: maxVal + 1 }, () => new Array(maxVal + 1).fill(0));

  for (const x of nums) {
    // Process in reverse to avoid using same element twice in same step
    // We need a new copy each iteration
    const ndp: number[][] = dp.map((row) => [...row]);

    for (let g1 = 0; g1 <= maxVal; g1++) {
      for (let g2 = 0; g2 <= maxVal; g2++) {
        if (dp[g1][g2] === 0) continue;
        const ways = dp[g1][g2];

        // Add x to S1
        const ng1 = gcd(g1 === 0 ? x : g1, x);
        ndp[ng1][g2] = (ndp[ng1][g2] + ways) % MOD;

        // Add x to S2
        const ng2 = gcd(g2 === 0 ? x : g2, x);
        ndp[g1][ng2] = (ndp[g1][ng2] + ways) % MOD;
      }
    }

    // Start new S1 with x (S2 still empty)
    ndp[x][0] = (ndp[x][0] + 1) % MOD;
    // Start new S2 with x (S1 still empty)
    ndp[0][x] = (ndp[0][x] + 1) % MOD;

    // Copy ndp back
    for (let g1 = 0; g1 <= maxVal; g1++) {
      for (let g2 = 0; g2 <= maxVal; g2++) {
        dp[g1][g2] = ndp[g1][g2];
      }
    }
  }

  let ans = 0;
  for (let g = 1; g <= maxVal; g++) {
    ans = (ans + dp[g][g]) % MOD;
  }
  return ans;
}

// Tests
console.log(countSubsequencesWithEqualGcd([1, 2, 3, 4])); // 10
console.log(countSubsequencesWithEqualGcd([6, 6])); // 2
console.log(countSubsequencesWithEqualGcd([1])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                   | Difficulty | Pattern          |
| --------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Maximize Score After N Operations](https://leetcode.com/problems/maximize-score-after-n-operations/)     | 🔴 Hard    | Bitmask DP + GCD |
| [Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array/)                 | 🔴 Hard    | Number Theory    |
| [Count Subarrays With GCD Equal to K](https://leetcode.com/problems/count-subarrays-with-gcd-equal-to-k/) | 🟡 Medium  | GCD DP           |
