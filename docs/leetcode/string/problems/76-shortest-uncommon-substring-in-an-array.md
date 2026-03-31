---
layout: page
title: "Shortest Uncommon Substring in an Array"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Trie]
leetcode_url: "https://leetcode.com/problems/shortest-uncommon-substring-in-an-array"
---

# Shortest Uncommon Substring in an Array / Chuỗi Con Ngắn Nhất Không Thuộc Chuỗi Khác

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map / Brute Force
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống tìm mật khẩu ngắn nhất cho từng người — mỗi người cần một chuỗi con ngắn nhất mà không ai khác trong nhóm sở hữu. Thử từ ngắn → dài, dừng khi tìm thấy chuỗi độc nhất.

**Pattern Recognition:**

- Với mỗi `arr[i]`: enumerate substrings theo độ dài tăng dần (1, 2, ...)
- Kiểm tra xem substring đó có xuất hiện trong `arr[j]` (j≠i) không
- Dừng ngay khi tìm được chuỗi đầu tiên không xuất hiện ở đâu khác

```
arr = ["cab","ad","bad","c"]

For arr[0]="cab":
  len=1: "c" → in "c" (arr[3])? YES → skip
         "a" → in "ad"? YES → skip
         "b" → in "bad"? YES → skip
  len=2: "ca" → in "ad"? NO → in "bad"? NO → in "c"? NO → ✅ "ca"

For arr[1]="ad":
  len=1: "a" → in "cab"? NO → in "bad"? YES → skip
         "d" → in "cab"? NO → in "bad"? YES → skip
  len=2: "ad" → in "cab"? NO → in "bad"? YES → skip
  len=2+: no more substrings → ""

Result: ["ca","","bad","c"]
Wait... let me re-check arr[3]="c":
  len=1: "c" → in "cab"? YES → skip → ""
```

---

## Problem Description

For each string `arr[i]`, find the **shortest** substring of `arr[i]` that is **not** a substring of any other `arr[j]` (j ≠ i). Return the result array; use `""` if no such substring exists.

**Examples:**

- `arr = ["cab","ad","bad","c"]` → `["ab","","bad",""]`
- `arr = ["abc","bcd","abcd"]` → `["","","abcd"]`

**Constraints:** `2 ≤ arr.length ≤ 100`, `1 ≤ arr[i].length ≤ 20`, lowercase letters only

---

## 📝 Interview Tips

- 🇻🇳 Enumerate substrings theo length tăng → short-circuit ngay khi tìm được cái đầu tiên
- 🇺🇸 Build a Set of all substrings of all OTHER strings for O(1) lookup
- 🇻🇳 Tổng độ dài ngắn (≤20) nên O(n \* L²) là chấp nhận được
- 🇺🇸 Precompute `othersSubstrings[i]` = Set of all substrings from arr[j≠i]
- 🇻🇳 Nếu không tìm được substring nào → return `""` (có thể xảy ra nếu arr[i] là substring của arr[j])
- 🇺🇸 For same-length substrings, try lexicographically smallest first if tie-breaking required

---

## Solutions

### Solution 1 — Brute Force per String

```typescript
/**
 * For each arr[i], try all substrings by length; check if found in any arr[j]
 * Time: O(n² * L³) — n strings, L²/2 substrings each, L check per string
 * Space: O(n * L²) — substring sets
 */
function shortestSubstrings(arr: string[]): string[] {
  const n = arr.length;

  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    const s = arr[i];
    let found = "";

    outer: for (let len = 1; len <= s.length; len++) {
      for (let start = 0; start + len <= s.length; start++) {
        const sub = s.slice(start, start + len);
        // Check if this sub appears in any other string
        let unique = true;
        for (let j = 0; j < n; j++) {
          if (j !== i && arr[j].includes(sub)) {
            unique = false;
            break;
          }
        }
        if (unique) {
          found = sub;
          break outer;
        }
      }
    }
    result.push(found);
  }
  return result;
}
```

### Solution 2 — Precomputed Substring Sets (Faster)

```typescript
/**
 * Precompute all substrings for each string; for arr[i] check against union of others
 * Time: O(n * L²) amortized — precompute once per string
 * Space: O(n * L²)
 */
function shortestSubstrings2(arr: string[]): string[] {
  const n = arr.length;

  // Precompute set of all substrings for each string
  const subsets: Set<string>[] = arr.map((s) => {
    const set = new Set<string>();
    for (let i = 0; i < s.length; i++) {
      for (let j = i + 1; j <= s.length; j++) {
        set.add(s.slice(i, j));
      }
    }
    return set;
  });

  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    const s = arr[i];
    let found = "";

    outer: for (let len = 1; len <= s.length; len++) {
      for (let start = 0; start + len <= s.length; start++) {
        const sub = s.slice(start, start + len);
        // Check uniqueness: not in any other string's subset
        let unique = true;
        for (let j = 0; j < n; j++) {
          if (j !== i && subsets[j].has(sub)) {
            unique = false;
            break;
          }
        }
        if (unique) {
          found = sub;
          break outer;
        }
      }
    }
    result.push(found);
  }
  return result;
}

// Test cases
console.log(shortestSubstrings(["cab", "ad", "bad", "c"])); // ["ab","","bad",""]
console.log(shortestSubstrings(["abc", "bcd", "abcd"])); // ["","","abcd"]
console.log(shortestSubstrings2(["cab", "ad", "bad", "c"])); // ["ab","","bad",""]
console.log(shortestSubstrings(["aa", "bb"])); // ["a","b"]
```

---

## 🔗 Related Problems

- [720 - Longest Word in Dictionary](https://leetcode.com/problems/longest-word-in-dictionary/) — find word meeting substring condition
- [1408 - String Matching in an Array](https://leetcode.com/problems/string-matching-in-an-array/) — check substring relationship
- [3042 - Count Prefix and Suffix Pairs I](https://leetcode.com/problems/count-prefix-and-suffix-pairs-i/) — pairwise string comparison
- [820 - Short Encoding of Words](https://leetcode.com/problems/short-encoding-of-words/) — find strings not suffix of others
