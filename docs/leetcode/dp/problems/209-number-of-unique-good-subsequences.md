---
layout: page
title: "Number of Unique Good Subsequences"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-unique-good-subsequences"
---

# Number of Unique Good Subsequences / Số Dãy Con Nhị Phân Tốt Duy Nhất

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Cho chuỗi nhị phân, đếm các dãy con duy nhất là số nhị phân hợp lệ (không có số 0 đứng đầu, ngoại trừ "0" đơn lẻ).  
> Như đếm số mã PIN duy nhất có thể tạo từ các chữ số — mỗi lần thêm chữ số mới, nhân đôi các trường hợp.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Number of Unique Good Subsequences example:**

```
binary = "101"

Process '1': endOne = 0+0+1 = 1   → {"1"}
Process '0': endZero = 1+0 = 1    → {"10"}, hasZero=true
Process '1': endOne = 1+1+1 = 3   → {"1","101","11"}

Answer = endOne + endZero + hasZero = 3 + 1 + 1 = 5
Sequences: "0", "1", "10", "11", "101"  ✓
```

---

## Problem Description

Given a binary string `binary`, return the number of **unique** non-empty subsequences that are:

1. The string `"0"` (the zero itself), OR
2. A binary number without leading zeros (starts with `'1'`).

Return the answer modulo `10^9 + 7`.

**Constraints:** `1 <= binary.length <= 10^5`, binary contains only `'0'` and `'1'`.

---

## 📝 Interview Tips

1. **State definition** — `endOne`: # unique good subseqs ending in '1'; `endZero`: ending in '0' (not "0" alone).
2. **Transition '1'** — Any existing good subseq + '1' is still good: `endOne = (endOne + endZero + 1) % MOD` (+1 for new "1").
3. **Transition '0'** — Can't start new subseq with '0': `endZero = (endOne + endZero) % MOD`.
4. **"0" singleton** — Track `hasZero`; add 1 to answer if any '0' was seen.
5. **Why not endZero+1?** — A lone '0' would be "0" which we handle separately with `hasZero` flag.
6. **Why modulo?** — Up to 10^5 chars; 2^(10^5) possibilities — must reduce modulo 10^9+7.

---

## Solutions

```typescript
function numberOfUniqueGoodSubsequences(binary: string): number {
  const MOD = 1_000_000_007n;
  let endOne = 0n; // # unique good subsequences ending with '1'
  let endZero = 0n; // # unique good subsequences ending with '0' (not "0" alone)
  let hasZero = false;

  for (const ch of binary) {
    if (ch === "1") {
      // Extend all existing with '1', plus new single '1'
      endOne = (endOne + endZero + 1n) % MOD;
    } else {
      // Extend all existing good subseqs with '0' (can't start new with '0')
      endZero = (endOne + endZero) % MOD;
      hasZero = true;
    }
  }

  // endOne + endZero = all good subseqs NOT equal to "0"
  // hasZero = 1 if "0" itself is a valid subsequence
  return Number((endOne + endZero + (hasZero ? 1n : 0n)) % MOD);
}

console.log(numberOfUniqueGoodSubsequences("001")); // 2: "0","1"
console.log(numberOfUniqueGoodSubsequences("11")); // 2: "1","11"
console.log(numberOfUniqueGoodSubsequences("101")); // 5: "0","1","10","11","101"
console.log(numberOfUniqueGoodSubsequences("1")); // 1: "1"
console.log(numberOfUniqueGoodSubsequences("0")); // 1: "0"

function numberOfUniqueGoodSubsequencesV2(binary: string): number {
  const MOD = 1_000_000_007;
  let endOne = 0;
  let endZero = 0;
  let hasZero = 0;

  for (const ch of binary) {
    if (ch === "1") {
      endOne = (endOne + endZero + 1) % MOD;
    } else {
      endZero = (endOne + endZero) % MOD;
      hasZero = 1;
    }
  }

  return (endOne + endZero + hasZero) % MOD;
}

console.log(numberOfUniqueGoodSubsequencesV2("001")); // 2
console.log(numberOfUniqueGoodSubsequencesV2("11")); // 2
console.log(numberOfUniqueGoodSubsequencesV2("101")); // 5

function numberOfUniqueGoodSubsequencesBrute(binary: string): number {
  // Only valid for small inputs — enumerate all subsequences
  const seen = new Set<string>();
  const n = binary.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    let sub = "";
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) sub += binary[i];
    }
    // Good subsequence: "0" or starts with "1"
    if (sub === "0" || sub[0] === "1") seen.add(sub);
  }
  return seen.size;
}

// Verify against DP for small cases
console.log(numberOfUniqueGoodSubsequencesBrute("101")); // 5 ✓
console.log(numberOfUniqueGoodSubsequencesBrute("11")); // 2 ✓
console.log(numberOfUniqueGoodSubsequencesBrute("001")); // 2 ✓
```

---

## 🔗 Related Problems

| Problem                                                                                                             | Difficulty | Key Concept        |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/)                                       | Hard       | DP on subsequences |
| [Count Different Palindromic Subsequences](https://leetcode.com/problems/count-different-palindromic-subsequences/) | Hard       | DP dedup           |
| [Counting Bits](https://leetcode.com/problems/counting-bits/)                                                       | Easy       | Binary DP          |
