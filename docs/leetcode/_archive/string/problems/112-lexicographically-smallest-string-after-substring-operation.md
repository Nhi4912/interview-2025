---
layout: page
title: "Lexicographically Smallest String After Substring Operation"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/lexicographically-smallest-string-after-substring-operation"
---

# Lexicographically Smallest String After Substring Operation / Chuỗi Nhỏ Nhất Sau Thao Tác Substring

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn có một dãy số và cần kéo nó xuống thấp nhất. Bỏ qua các số 'a' (đã ở đáy), tìm đoạn đầu tiên không phải 'a' rồi kéo toàn bộ xuống 1 bậc.

**Pattern Recognition:**

- Signal: "lexicographically smallest" + "decrease characters" → **Greedy**
- Key insight: Chỉ cần một substring operation duy nhất. Tìm đoạn bắt đầu bằng ký tự đầu tiên ≠ 'a', giảm đến khi gặp 'a' hoặc cuối chuỗi.
- Edge case: Nếu cả chuỗi đều là 'a', phải giảm ký tự cuối thành 'z'.

**Visual:**

```
s = "cbabc"
        ^-- first non-'a': index 0 = 'c'
scan until 'a' or end: c,b → hit 'a' at index 2
decrease [0,1]: "baabc"  ✓ lexicographically smallest

s = "aa"  (all 'a' special case)
must still do one operation → decrease s[1]: "az"
```

---

## Problem Description

Given a string `s`, apply **exactly one** substring operation: choose a non-empty substring and decrease each character in it by 1 (i.e., 'b'→'a', 'c'→'b', ...). 'a' cannot be decreased, so you must not include any 'a' in your chosen substring. Return the lexicographically smallest result. ([LeetCode](https://leetcode.com/problems/lexicographically-smallest-string-after-substring-operation))

Difficulty: Medium | Acceptance: 32.3%

```
Example 1: s = "cbabc" → "baabc"
  Decrease s[0..1] ("cb") → "ba" + "abc" = "baabc"

Example 2: s = "acbbc" → "abaac"
  Skip 'a', decrease s[1..3] ("cbb") → "a"+"baa"+"c" = "abaac"

Example 3: s = "leetcode" → "kddsbncd"  (decrease all non-'a' chars)
```

Constraints:

- `1 <= s.length <= 3 * 10^5`
- `s` consists of lowercase English letters only

---

## 📝 Interview Tips

1. **Clarify**: "Bắt buộc thực hiện đúng một lần thao tác?" / Must we perform exactly one operation (yes)?
2. **Brute force**: "Thử mọi substring O(n²) để tìm kết quả nhỏ nhất" / Try all substrings — O(n²) time, too slow.
3. **Optimize**: "Greedy: giảm đoạn không-'a' đầu tiên" / Greedy: the first non-'a' run gives optimal result.
4. **Edge cases**: "Toàn 'a' → phải giảm ký tự cuối thành 'z'" / All 'a' → last char becomes 'z'.
5. **Follow-up**: "Nếu cho phép nhiều thao tác? → giảm tất cả ký tự không phải 'a'" / Multiple ops → decrease every non-'a'.
6. **Complexity**: "O(n) time, O(n) space cho output array" / O(n) single pass greedy is optimal.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Try all non-'a' substrings
 * Time: O(n²) — try every possible non-'a' substring
 * Space: O(n) — store best result
 */
function smallestStringBruteForce(s: string): string {
  const arr = s.split("");
  let best = s;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "a") continue;
    // extend substring from i while no 'a'
    for (let j = i; j < s.length; j++) {
      if (s[j] === "a") break;
      arr[j] = String.fromCharCode(s.charCodeAt(j) - 1);
      const candidate = arr.join("");
      if (candidate < best) best = candidate;
    }
    // reset
    for (let j = i; j < s.length; j++) {
      arr[j] = s[j];
      if (s[j] === "a") break;
    }
  }

  // Edge: all 'a' — must still do one op: last char a→z
  if (best === s) {
    const a2 = arr.slice();
    a2[s.length - 1] = "z";
    best = a2.join("");
  }
  return best;
}

/**
 * Solution 2: Greedy — One-pass optimal
 * Time: O(n) — single scan
 * Space: O(n) — result array
 *
 * Key: Find first non-'a', decrease all consecutive non-'a' chars.
 * That single run is the lexicographically optimal operation.
 */
function smallestString(s: string): string {
  const arr = s.split("");
  const n = s.length;
  let i = 0;

  // skip leading 'a's
  while (i < n && arr[i] === "a") i++;

  // If all 'a', edge case: must do one op → last char becomes 'z'
  if (i === n) {
    arr[n - 1] = "z";
    return arr.join("");
  }

  // Decrease consecutive non-'a' characters
  while (i < n && arr[i] !== "a") {
    arr[i] = String.fromCharCode(arr[i].charCodeAt(0) - 1);
    i++;
  }

  return arr.join("");
}

// === Test Cases ===
console.log(smallestString("cbabc")); // "baabc"
console.log(smallestString("acbbc")); // "abaac"
console.log(smallestString("leetcode")); // "kddsbncd"
console.log(smallestString("aa")); // "az"  (all-'a' edge case)
console.log(smallestString("a")); // "z"   (single 'a')
console.log(smallestString("z")); // "y"

console.log(smallestStringBruteForce("cbabc")); // "baabc"
console.log(smallestStringBruteForce("acbbc")); // "abaac"
console.log(smallestStringBruteForce("aa")); // "az"
```

---

## 🔗 Related Problems

| Problem                                                              | Pattern                  | Difficulty |
| -------------------------------------------------------------------- | ------------------------ | ---------- |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits)     | Greedy + Monotonic Stack | Medium     |
| [Largest Number](https://leetcode.com/problems/largest-number)       | Greedy + Sort            | Medium     |
| [Reorganize String](https://leetcode.com/problems/reorganize-string) | Greedy + Heap            | Medium     |
| [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | Dynamic Programming      | Hard       |
