---
layout: page
title: "Group Shifted Strings"
difficulty: Medium
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/group-shifted-strings"
---

# Group Shifted Strings / Nhóm Các Chuỗi Dịch Chuyển

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map / String Normalization
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Giống như nhạc cụ nhạc cụ — "do re mi" và "fa sol la" có cùng khoảng cách nốt nhạc, chỉ khác về cao độ. Chúng ta cần tìm "chữ ký khoảng cách" của mỗi chuỗi để nhóm lại.

**Pattern Recognition:**

- `"group by property"` → Dùng HashMap, key là dạng chuẩn hóa của mỗi chuỗi
- Chuỗi shifted: hiệu giữa các ký tự liên tiếp (mod 26) giống nhau → cùng nhóm
- `"abc"` → diffs = `"1,1"` ; `"bcd"` → diffs = `"1,1"` → same group

**Visual:**

```
strings = ["abc","bcd","acef","xyz","az","ba","a","z"]

"abc" → diffs: (b-a)=1,(c-b)=1 → key="1,1"
"bcd" → diffs: (c-b)=1,(d-c)=1 → key="1,1"  ← same group!
"xyz" → diffs: (y-x)=1,(z-y)=1 → key="1,1"  ← same group!
"az"  → diffs: (z-a)=25        → key="25"
"ba"  → diffs: (a-b+26)%26=25  → key="25"   ← same group!
"a","z" → length=1 → key=""    ← same group!
"acef"→ diffs: 2,2,1            → key="2,2,1"
```

## Problem Description

Given an array of strings, group all strings that belong to the same **shifting sequence**. A shifting sequence shifts every letter by the same amount (wrapping z→a). Return groups in any order.

Examples: `["abc","bcd","acef","xyz","az","ba","a","z"]` → `[["acef"],["a","z"],["abc","bcd","xyz"],["az","ba"]]`.

## 📝 Interview Tips

1. **Clarify**: Chỉ lowercase letters? Strings có thể cùng nhau? / Only lowercase, can have duplicates
2. **Approach**: Chuẩn hóa bằng difference array mod 26 / Normalize by consecutive char diffs
3. **Edge cases**: Length-1 strings all in same group / Single chars always match each other
4. **Optimize**: Join diffs as string key for HashMap / Use `diffs.join(',')` as map key
5. **Follow-up**: Nếu cần sort within groups? / Add sort step after grouping
6. **Complexity**: O(n × L) time, O(n × L) space where L = avg string length

## Solutions

```typescript
/** Solution 1: HashMap with Difference Key (Optimal)
 * Time: O(n * L) | Space: O(n * L)
 */
function groupStrings(strings: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const s of strings) {
    const key = getKey(s);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }

  return Array.from(map.values());
}

function getKey(s: string): string {
  if (s.length === 1) return "";
  const diffs: number[] = [];
  for (let i = 1; i < s.length; i++) {
    diffs.push((s.charCodeAt(i) - s.charCodeAt(i - 1) + 26) % 26);
  }
  return diffs.join(",");
}

/** Solution 2: Normalize to 'a'-based string
 * Time: O(n * L) | Space: O(n * L)
 * Shift each string so it starts with 'a', use that as key
 */
function groupStringsNorm(strings: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const s of strings) {
    const shift = s.charCodeAt(0) - 97; // distance from 'a'
    let key = "";
    for (let i = 0; i < s.length; i++) {
      key += String.fromCharCode(((s.charCodeAt(i) - shift - 97 + 26) % 26) + 97);
    }
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }

  return Array.from(map.values());
}

/** Solution 3: Brute Force O(n^2 * L) — compare all pairs
 * Time: O(n^2 * L) | Space: O(n)
 */
function groupStringsBrute(strings: string[]): string[][] {
  const visited = new Set<number>();
  const result: string[][] = [];

  function isShifted(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    const diff = (b.charCodeAt(0) - a.charCodeAt(0) + 26) % 26;
    for (let i = 0; i < a.length; i++) {
      if ((b.charCodeAt(i) - a.charCodeAt(i) + 26) % 26 !== diff) return false;
    }
    return true;
  }

  for (let i = 0; i < strings.length; i++) {
    if (visited.has(i)) continue;
    const group = [strings[i]];
    visited.add(i);
    for (let j = i + 1; j < strings.length; j++) {
      if (!visited.has(j) && isShifted(strings[i], strings[j])) {
        group.push(strings[j]);
        visited.add(j);
      }
    }
    result.push(group);
  }
  return result;
}

// Tests
console.log(groupStrings(["abc", "bcd", "acef", "xyz", "az", "ba", "a", "z"]));
// [["abc","bcd","xyz"],["acef"],["az","ba"],["a","z"]] (order may vary)
console.log(groupStrings(["a"])); // [["a"]]
console.log(groupStringsNorm(["az", "ba"])); // [["az","ba"]]
console.log(groupStrings(["abc", "xyz", "bcd"]));
// [["abc","xyz","bcd"]] or grouped by shift
```

## 🔗 Related Problems

| Problem                                                                            | Relationship                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------- |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams)                     | Same HashMap grouping pattern with sort key |
| [Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern) | String normalization / pattern matching     |
| [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings)             | Character mapping / structural equivalence  |
