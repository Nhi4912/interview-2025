---
layout: page
title: "Maximum Number of Removable Characters"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, String, Binary Search]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-removable-characters"
---

# Maximum Number of Removable Characters / Số Ký Tự Tối Đa Có Thể Xóa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Answer

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Bạn có chuỗi `s` và mẫu `p`. Có thể xóa tối đa bao nhiêu ký tự (theo mảng `removable`) sao cho `p` vẫn là subsequence của `s`? Tính chất đơn điệu: nếu k ký tự bị xóa mà p vẫn là subsequence, thì k-1 cũng được. Binary search trên k!

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Number of Removable Characters example:**

```
s = "abcacb", p = "ab", removable = [3,1,0]

k=0: s="abcacb" → p="ab" ⊆ s? YES
k=1: remove s[3]='a' → s="abc_cb" → p="ab" ⊆ "abccb"? YES
k=2: remove s[3],s[1] → s="a_c_cb" → p="ab"? check: a→found at 0, b→found at 5? YES
k=3: remove s[3],s[1],s[0] → p="ab"? a→not at 0,1,3, found at 4; b→found at 5? YES
Answer: 3

Binary search: lo=0, hi=3 → find max k where isSubseq(k)=true
```

---

## Problem Description

| #    | Problem                                | Pattern                 |
| ---- | -------------------------------------- | ----------------------- |
| 1898 | Maximum Number of Removable Characters | This problem            |
| 392  | Is Subsequence                         | Two Pointers            |
| 792  | Number of Matching Subsequences        | String Matching         |
| 1870 | Minimum Speed to Arrive on Time        | Binary Search on Answer |

---

## 📝 Interview Tips

- 🔑 **Monotone property** / Nếu k ký tự xóa vẫn OK → k-1 cũng OK → binary search hợp lệ
- 🔑 **Binary search on answer** / Tìm max k trong [0, removable.length] — O(log n)
- 🔑 **Subsequence check** / Two-pointer: O(|s|) — tổng O(|s| × log n)
- 🔑 **Removed set** / Dùng Set để đánh dấu chỉ số bị xóa — O(1) lookup
- 🔑 **isSubseq with removals** / Bỏ qua các vị trí trong removed set khi match p
- 🔑 **Template** / Binary search: lo=0, hi=removable.length; mid = (lo+hi+1)/2 (upper bound)

---

## Solutions

```typescript
// ─── Helper: check if p is subsequence of s with first k indices removed ───
function isSubseq(s: string, p: string, removed: Set<number>): boolean {
  let j = 0; // pointer for p
  for (let i = 0; i < s.length && j < p.length; i++) {
    if (!removed.has(i) && s[i] === p[j]) j++;
  }
  return j === p.length;
}

// ─── Solution 1: Linear scan — O(n × m) TLE for large input ───
function maximumRemovalsLinear(s: string, p: string, removable: number[]): number {
  let k = 0;
  const removed = new Set<number>();
  for (const idx of removable) {
    removed.add(idx);
    if (isSubseq(s, p, removed)) k++;
    else {
      removed.delete(idx);
      break;
    }
  }
  return k;
}

// ─── Solution 2: Binary Search on k — O(|s| × log n) ───
function maximumRemovals(s: string, p: string, removable: number[]): number {
  let lo = 0,
    hi = removable.length;

  while (lo < hi) {
    // Use upper-bound template to find maximum valid k
    const mid = Math.floor((lo + hi + 1) / 2);

    // Build removed set for first mid indices
    const removed = new Set(removable.slice(0, mid));

    if (isSubseq(s, p, removed))
      lo = mid; // mid is valid, try larger
    else hi = mid - 1; // mid too large, try smaller
  }
  return lo;
}

console.log(maximumRemovals("abcacb", "ab", [3, 1, 0])); // 2
console.log(maximumRemovals("abcbddddd", "abcd", [3, 2, 1, 4, 5, 6])); // 1
console.log(maximumRemovals("abcab", "abc", [0, 1, 2, 3, 4])); // 0

// ─── Solution 3: Binary search with array-based removed check ───
function maximumRemovalsV2(s: string, p: string, removable: number[]): number {
  const n = removable.length;
  let lo = 0,
    hi = n;

  const check = (k: number): boolean => {
    const removed = new Set(removable.slice(0, k));
    let j = 0;
    for (let i = 0; i < s.length && j < p.length; i++) {
      if (!removed.has(i) && s[i] === p[j]) j++;
    }
    return j === p.length;
  };

  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    check(mid) ? (lo = mid) : (hi = mid - 1);
  }
  return lo;
}

console.log(maximumRemovalsV2("abcacb", "ab", [3, 1, 0])); // 2
```

---

## 🔗 Related Problems

| #    | Problem                                | Pattern                 |
| ---- | -------------------------------------- | ----------------------- |
| 1898 | Maximum Number of Removable Characters | This problem            |
| 392  | Is Subsequence                         | Two Pointers            |
| 792  | Number of Matching Subsequences        | String Matching         |
| 1870 | Minimum Speed to Arrive on Time        | Binary Search on Answer |
