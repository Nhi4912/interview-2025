---
layout: page
title: "H-Index"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Counting Sort]
leetcode_url: "https://leetcode.com/problems/h-index"
---

# H-Index / Chỉ Số H

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [How Many Numbers Are Smaller Than the Current Number](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number) | [Sort an Array](https://leetcode.com/problems/sort-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** H-index của một nhà nghiên cứu là số `h` lớn nhất sao cho họ có ít nhất `h` bài báo được trích dẫn ít nhất `h` lần. Hãy nghĩ như chọn "ngưỡng": nếu sort giảm dần, đi từ trái sang phải, tìm vị trí `i` cuối cùng mà `citations[i] >= i+1`.

```
citations = [3, 0, 6, 1, 5]
Sort desc: [6, 5, 3, 1, 0]

i=0: citations[0]=6 >= 1? ✅ h=1
i=1: citations[1]=5 >= 2? ✅ h=2
i=2: citations[2]=3 >= 3? ✅ h=3
i=3: citations[3]=1 >= 4? ❌ stop
Answer: 3  ✅
```

---

## Problem Description

Given an array of integers `citations` where `citations[i]` is the number of citations for the i-th paper, return the researcher's **h-index**: the maximum `h` such that `h` papers have at least `h` citations each.

- **Example 1:** `citations = [3,0,6,1,5]` → `3`
- **Example 2:** `citations = [1,3,1]` → `1`

---

## 📝 Interview Tips

- 🔽 **Sort desc:** Sau khi sort giảm dần, `h = i+1` khi `citations[i] >= i+1`
- 📈 **Key invariant:** Tại vị trí `i` (0-indexed) có `i+1` papers với ít nhất `citations[i]` citations
- 🪣 **Counting sort variant:** O(n) — bucket `count[min(c, n)]++`, scan từ n xuống 0
- 📊 **Complexity:** O(n log n) sort, O(n) counting sort
- ⚠️ **Edge:** All zeros → h=0; all large values → h=n
- 💡 **Binary search variant:** Binary search on h (0 to n) — check if enough papers have ≥h citations

---

## Solutions

### Solution 1: Sort descending, linear scan

```typescript
/**
 * Sort desc, find last index where citations[i] >= i+1
 * Time: O(n log n)  Space: O(1)
 */
function hIndex(citations: number[]): number {
  citations.sort((a, b) => b - a);
  let h = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) h = i + 1;
    else break;
  }
  return h;
}

console.log(hIndex([3, 0, 6, 1, 5])); // 3
console.log(hIndex([1, 3, 1])); // 1
console.log(hIndex([0])); // 0
```

### Solution 2: Counting sort — O(n)

```typescript
/**
 * Bucket by citation count (capped at n), scan from high to low
 * Time: O(n)  Space: O(n)
 */
function hIndexCounting(citations: number[]): number {
  const n = citations.length;
  const count = new Array(n + 1).fill(0);

  for (const c of citations) {
    count[Math.min(c, n)]++;
  }

  let papers = 0;
  for (let h = n; h >= 0; h--) {
    papers += count[h];
    if (papers >= h) return h;
  }
  return 0;
}

console.log(hIndexCounting([3, 0, 6, 1, 5])); // 3
console.log(hIndexCounting([100])); // 1
```

### Solution 3: Binary search on h

```typescript
/**
 * Binary search: find max h where >= h papers have >= h citations
 * Time: O(n log n)  Space: O(1)
 */
function hIndexBinarySearch(citations: number[]): number {
  citations.sort((a, b) => b - a);
  const n = citations.length;
  let lo = 0,
    hi = n;

  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    // Is there a valid h = mid?
    if (citations[mid - 1] >= mid) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

console.log(hIndexBinarySearch([3, 0, 6, 1, 5])); // 3
console.log(hIndexBinarySearch([1, 3, 1])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                             | Difficulty | Connection                        |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------- |
| [H-Index II](https://leetcode.com/problems/h-index-ii/)                                                             | 🟡 Medium  | Binary search on sorted citations |
| [How Many Numbers Are Smaller](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/) | 🟢 Easy    | Counting sort pattern             |
| [Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/)                               | 🟡 Medium  | Selection via sort                |
| [Find the Kth Largest Integer](https://leetcode.com/problems/find-the-kth-largest-integer-in-the-array/)            | 🟡 Medium  | Sort + indexing                   |
| [Sort an Array](https://leetcode.com/problems/sort-an-array/)                                                       | 🟡 Medium  | Sorting implementation practice   |
