---
layout: page
title: "Strong Password Checker"
difficulty: Hard
category: Sorting-Searching
tags: [String, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/strong-password-checker"
---

# Strong Password Checker / Kiểm Tra Mật Khẩu Mạnh

> **Difficulty**: 🔴 Hard | **Category**: Sorting-Searching | **Pattern**: Greedy Case Analysis

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như sửa một bài văn yếu — nếu quá ngắn thì thêm câu, nếu quá dài thì xóa từ thừa, nếu lặp từ thì thay thế. Mỗi thao tác sửa chữa có thể giải quyết nhiều vấn đề cùng lúc — hãy tối ưu thứ tự để dùng ít bước nhất.

**Pattern Recognition:**
- Three separate concerns: length, character types, repeating sequences → analyze by case
- When too long (>20): deletions must happen; use them to reduce replacement needs
- Greedy priority: 1-delete saves 1 replace (k%3=0) > 2 deletes (k%3=1) > 3 deletes

**Visual:**
```
s="aaaaa" (n=5, too short, missing upper+digit, has 3-repeat)
Case n<6: max(missing=2, 6-n=1) = 2
  Step1: replace a[2]→'A': "aaAaa" (fixes repeat + adds type)
  Step2: insert '1':       "aaAaa1" (fixes length + adds type) ✓

s="aaaaaaaaaaaaaaaaaaaaaa" (n=22, too long, 1 run of 22)
toDelete=2, 22%3=1 → Phase2: runs=[20], dLeft=0
replace = floor(20/3)=6, missing=2
return 2 + max(2,6) = 8
```

## Problem Description

A password is **strong** if: length 6–20, has at least one lowercase letter, one uppercase letter, one digit, and no three consecutive identical characters. Return the **minimum steps** to make it strong (each step: insert, delete, or replace one character).

**Example:**
- s="a" → 5 (insert 5 chars to reach length 6 with required types)
- s="aaa" → 3
- s="aaaB1" → 1 (insert one char)
- s="bbaaaaaaaaaaaaaaacccccc" → 8

**Constraints:** 0 ≤ s.length ≤ 50, s consists of letters, digits, and/or '.'

## 📝 Interview Tips

1. **Clarify**: What are the exact validity rules? (len 6-20, 3 types, no 3-repeat)
2. **Approach**: Split into 3 cases: n<6 (insert), 6≤n≤20 (replace), n>20 (delete+replace)
3. **Edge cases**: Empty string, exactly valid, all same char, mix of all problems
4. **Optimize**: For n>20, greedily use deletions where each reduces replace cost most
5. **Follow-up**: What if we can also apply operations in any order simultaneously?
6. **Complexity**: Time O(n), Space O(n) for runs array

## Solutions

```typescript
// Solution 1: Greedy Case Analysis — Time: O(n) | Space: O(n)
function strongPasswordChecker(s: string): number {
  const n = s.length;

  // Count missing character types
  let hasLower = 0, hasUpper = 0, hasDigit = 0;
  for (const c of s) {
    if (c >= 'a' && c <= 'z') hasLower = 1;
    else if (c >= 'A' && c <= 'Z') hasUpper = 1;
    else if (c >= '0' && c <= '9') hasDigit = 1;
  }
  const missing = 3 - hasLower - hasUpper - hasDigit;

  // Find repeating runs of length >= 3
  const runs: number[] = [];
  let i = 0;
  while (i < n) {
    let j = i;
    while (j < n && s[j] === s[i]) j++;
    if (j - i >= 3) runs.push(j - i);
    i = j;
  }

  // Case 1: Too short — insertions serve triple duty (length + type + break repeat)
  if (n < 6) {
    return Math.max(missing, 6 - n);
  }

  // Case 2: Good length — only replacements needed
  if (n <= 20) {
    const repReplace = runs.reduce((sum, r) => sum + Math.floor(r / 3), 0);
    return Math.max(missing, repReplace);
  }

  // Case 3: Too long — must delete, then replace
  // Greedy: use deletions to reduce replacement cost first
  // k%3==0: 1 delete saves 1 replace | k%3==1: 2 deletes | k%3==2: 3 deletes
  const toDelete = n - 20;
  let dLeft = toDelete;

  // Phase 1: 1 deletion on each run with k%3 == 0
  for (let idx = 0; idx < runs.length && dLeft > 0; idx++) {
    if (runs[idx] % 3 === 0) { runs[idx]--; dLeft--; }
  }

  // Phase 2: 2 deletions on each run with k%3 == 1
  for (let idx = 0; idx < runs.length && dLeft >= 2; idx++) {
    if (runs[idx] % 3 === 1) { runs[idx] -= 2; dLeft -= 2; }
  }

  // Phase 3: 3 deletions per replacement saved, any remaining runs
  for (let idx = 0; idx < runs.length && dLeft >= 3; idx++) {
    const use = Math.min(dLeft, Math.floor(runs[idx] / 3) * 3);
    runs[idx] -= use;
    dLeft -= use;
  }

  const repReplace = runs.reduce((sum, r) => sum + Math.floor(r / 3), 0);
  return toDelete + Math.max(missing, repReplace);
}

// Solution 2: Explicit step-by-step with counts — Time: O(n) | Space: O(n)
function strongPasswordChecker2(s: string): number {
  const n = s.length;

  let hasL = 0, hasU = 0, hasD = 0;
  for (const c of s) {
    if (c >= 'a' && c <= 'z') hasL = 1;
    if (c >= 'A' && c <= 'Z') hasU = 1;
    if (c >= '0' && c <= '9') hasD = 1;
  }
  const miss = 3 - hasL - hasU - hasD;

  // Collect run lengths for runs >= 3
  const reps: number[] = [];
  for (let i = 0; i < n; ) {
    let j = i;
    while (j < n && s[j] === s[i]) j++;
    if (j - i >= 3) reps.push(j - i);
    i = j;
  }

  if (n < 6) return Math.max(miss, 6 - n);

  if (n <= 20) {
    return Math.max(miss, reps.reduce((a, r) => a + (r / 3 | 0), 0));
  }

  const del = n - 20;
  let d = del;

  // Apply deletions by cost efficiency
  [0, 1, 2].forEach(mod => {
    const cost = mod === 0 ? 1 : mod === 1 ? 2 : 3;
    for (let idx = 0; idx < reps.length && d >= cost; idx++) {
      while (reps[idx] % 3 === (mod === 2 ? reps[idx] % 3 : mod) && 
             reps[idx] >= 3 && d >= cost &&
             (mod < 2 ? reps[idx] % 3 === mod : true)) {
        reps[idx] -= cost;
        d -= cost;
        if (mod < 2) break; // one application per run in phases 1,2
      }
    }
  });

  return del + Math.max(miss, reps.reduce((a, r) => a + (r / 3 | 0), 0));
}

// Tests
console.log(strongPasswordChecker("a"));        // 5
console.log(strongPasswordChecker("aaa"));      // 3
console.log(strongPasswordChecker("aaaB1"));    // 1
console.log(strongPasswordChecker("aA1"));      // 3
console.log(strongPasswordChecker("1337C0d3")); // 0
```

## 🔗 Related Problems

| Problem | Relationship |
|---------|-------------|
| [Minimum Deletions to Make String Balanced](https://leetcode.com/problems/minimum-number-of-deletions-to-make-string-balanced) | Greedy string modification |
| [Reorganize String](https://leetcode.com/problems/reorganize-string) | Avoid consecutive same chars |
| [Minimum Changes to Make String K-Periodic](https://leetcode.com/problems/minimum-changes-to-make-k-periodic) | Greedy replacement in string |
