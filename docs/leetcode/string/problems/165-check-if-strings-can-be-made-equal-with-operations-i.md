---
layout: page
title: "Check if Strings Can be Made Equal With Operations I"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-i"
---

# Check if Strings Can be Made Equal With Operations I / Kiểm Tra Chuỗi Bằng Nhau Sau Các Phép Hoán Đổi I

🟢 Easy | 🏷️ String

## 🧠 Intuition

**VI:** Chuỗi dài 4 ký tự. Ta có thể hoán đổi `s[0]↔s[2]` và `s[1]↔s[3]` (vị trí cùng parity). Vì vậy các ký tự ở vị trí chẵn (0,2) có thể hoán đổi nhau, và ký tự vị trí lẻ (1,3) có thể hoán đổi nhau. Hai chuỗi bằng nhau nếu **các ký tự ở vị trí chẵn của s1 khớp tập với s2, và vị trí lẻ cũng khớp**.

**EN:** Length-4 strings. Even-indexed chars (0,2) can be freely swapped within each string; same for odd-indexed (1,3). So check that `{s1[0],s1[2]} == {s2[0],s2[2]}` and `{s1[1],s1[3]} == {s2[1],s2[3]}`.

```
s1 = "abcd"   positions: [a,c] even, [b,d] odd
s2 = "cdab"   positions: [c,a] even, [d,b] odd

Even: {a,c} == {c,a} ✅
Odd:  {b,d} == {d,b} ✅  → CAN be equal!

s1 = "abcd", s2 = "abdc"
Even: {a,c} == {a,d} ❌ → Cannot be equal
```

## 📝 Interview Tips

- 🇻🇳 **Quan sát chính:** chỉ có thể hoán đổi trong cùng nhóm parity (chẵn↔chẵn, lẻ↔lẻ)
- 🇬🇧 **Key insight:** swaps maintain parity groups; treat each group as a multiset
- 🇻🇳 **Kiểm tra sorted pair:** sắp xếp `[s1[0],s1[2]]` và `[s2[0],s2[2]]` rồi so sánh
- 🇬🇧 **Sort & compare:** sort each parity pair and compare — elegant O(1) solution
- 🇻🇳 **Chỉ cần 2 phép kiểm tra:** nhóm chẵn và nhóm lẻ
- 🇬🇧 **Generalizes:** for longer strings Operations II uses full sorting of each parity group

## Solutions

### Solution 1: Sort parity pairs

```typescript
/**
 * Sort even-indexed and odd-indexed pairs independently.
 * Time: O(1) — fixed length 4 | Space: O(1)
 */
function checkStrings(s1: string, s2: string): boolean {
  const sortPair = (a: string, b: string): string => [a, b].sort().join("");
  return (
    sortPair(s1[0], s1[2]) === sortPair(s2[0], s2[2]) &&
    sortPair(s1[1], s1[3]) === sortPair(s2[1], s2[3])
  );
}

console.log(checkStrings("abcd", "cdab")); // true  — even:{a,c}={c,a}, odd:{b,d}={d,b}
console.log(checkStrings("abcd", "dacb")); // false — even:{a,c}≠{d,c}
console.log(checkStrings("aaaa", "aaaa")); // true
console.log(checkStrings("abcd", "abcd")); // true
```

### Solution 2: Character frequency per parity

```typescript
/**
 * Use frequency comparison for each parity group.
 * Time: O(1) | Space: O(1)
 */
function checkStrings2(s1: string, s2: string): boolean {
  function sameGroup(a: string, b: string, c: string, d: string): boolean {
    // Check if multisets {a,b} === {c,d}
    return (a === c && b === d) || (a === d && b === c);
  }
  return sameGroup(s1[0], s1[2], s2[0], s2[2]) && sameGroup(s1[1], s1[3], s2[1], s2[3]);
}

console.log(checkStrings2("abcd", "cdab")); // true
console.log(checkStrings2("abcd", "cbad")); // false
console.log(checkStrings2("aabb", "bbaa")); // true
```

### Solution 3: Generalized approach (scales to Operations II)

```typescript
/**
 * Collect chars at even/odd positions, sort, compare — works for any length.
 * Time: O(n log n) | Space: O(n)
 */
function checkStrings3(s1: string, s2: string): boolean {
  const extract = (s: string, parity: number) =>
    s
      .split("")
      .filter((_, i) => i % 2 === parity)
      .sort()
      .join("");

  return extract(s1, 0) === extract(s2, 0) && extract(s1, 1) === extract(s2, 1);
}

console.log(checkStrings3("abcd", "cdab")); // true
console.log(checkStrings3("abcd", "dacb")); // false
```

## 🔗 Related Problems

| #    | Problem                                               | Difficulty | Key Idea                  |
| ---- | ----------------------------------------------------- | ---------- | ------------------------- |
| 2840 | Check if Strings Can be Made Equal With Operations II | 🟡 Medium  | Same idea, longer strings |
| 242  | Valid Anagram                                         | 🟢 Easy    | Multiset comparison       |
| 859  | Buddy Strings                                         | 🟢 Easy    | Swap positions check      |
