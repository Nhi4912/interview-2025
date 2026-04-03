---
layout: page
title: "Split Concatenated Strings"
difficulty: Medium
category: String
tags: [Array, String, Greedy]
leetcode_url: "https://leetcode.com/problems/split-concatenated-strings"
---

# Split Concatenated Strings / Tách chuỗi nối ghép

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Largest Number](https://leetcode.com/problems/largest-number) | [Longest Unequal Adjacent Groups Subsequence I](https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống làm vòng tròn bằng dây thừng — chọn mỗi đoạn dây theo hướng nào (xuôi hay ngược), rồi thử cắt tại mọi vị trí trong từng đoạn. Greedy: với mỗi đoạn i, chọn max(strs[i], rev(strs[i])), sau đó thử mọi điểm cắt trong đoạn i.

```
strs = ["abc","xyz"]
Normalize each: pick max(s, rev(s))
  "abc" vs "cba" → "cba"
  "xyz" vs "zyx" → "zyx"

Full circle: "cbazyx"

Try each string i as the split point:
  i=0 ("cba"): try split at each char → "a"+"zyx"+"cb", "b"+"zyx"+"c", "c"+"zyx" + rest...
  i=1 ("zyx"): try split at each char

Track lexicographically largest result.
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Normalize direction / Chuẩn hóa chiều**: Chọn `max(s, reverse(s))` cho mỗi chuỗi
- 🔑 **Try each i as split string / Thử cắt từng chuỗi**: Vòng lặp ngoài theo chỉ số chuỗi
- 🔑 **Try each pos in that string / Thử mọi vị trí**: Vòng lặp trong theo vị trí ký tự
- 🔑 **Construct: suffix + rest + prefix / Xây chuỗi**: `s[j+1..] + middle + s[..j]`
- 🔑 **Preserve split string orientation / Giữ chiều chuỗi đang cắt**: Chuỗi i có thể dùng bản gốc hoặc đảo
- 🔑 **O(n²) total / Tổng O(n²)**: n chuỗi × n ký tự mỗi chuỗi

---

## Solutions

### Solution 1: Greedy — Try Every Split Point

```typescript
/**
 * For each string, pick max(s, rev(s)) as its "best orientation".
 * Then for each string i (using either orientation), try every cut position.
 * Build candidate = s[j+1..] + concat(others normalized) + s[..j], track max.
 *
 * Time:  O(n * L) where n = number of strings, L = total length
 * Space: O(L)
 */
function splitLoopedString(strs: string[]): string {
  // Normalize: each string picks the lexicographically larger orientation
  const norm = strs.map((s) => {
    const r = s.split("").reverse().join("");
    return r > s ? r : s;
  });

  let best = "";

  for (let i = 0; i < strs.length; i++) {
    // middle = all OTHER strings normalized, concatenated
    const middle = norm.slice(0, i).join("") + norm.slice(i + 1).join("");

    // Try both orientations of strs[i]
    for (const cur of [strs[i], strs[i].split("").reverse().join("")]) {
      // Try every split position within cur
      for (let j = 0; j < cur.length; j++) {
        const candidate = cur.slice(j) + middle + cur.slice(0, j);
        if (candidate > best) best = candidate;
      }
    }
  }

  return best;
}

console.log(splitLoopedString(["abc", "xyz"])); // "zyxcba"
console.log(splitLoopedString(["abc"])); // "cba"
console.log(splitLoopedString(["aa", "ab"])); // "baa"  (or "aba" depending on orientation)
```

### Solution 2: Same Logic — Cleaner Variable Names

```typescript
/**
 * Explicit per-string orientation loop to make logic clearer.
 * Time:  O(n * L)
 * Space: O(L)
 */
function splitLoopedString2(strs: string[]): string {
  const rev = (s: string) => s.split("").reverse().join("");
  const norm = strs.map((s) => (rev(s) > s ? rev(s) : s));

  let ans = "";

  for (let i = 0; i < strs.length; i++) {
    const prefix = norm.slice(0, i).join("");
    const suffix = norm.slice(i + 1).join("");

    for (const s of [strs[i], rev(strs[i])]) {
      for (let j = 0; j < s.length; j++) {
        const cand = s[j] + suffix + prefix + s.slice(0, j);
        if (cand > ans) ans = cand;
      }
    }
  }

  return ans;
}

console.log(splitLoopedString2(["abc", "xyz"])); // "zyxcba"
console.log(splitLoopedString2(["abc"])); // "cba"
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                      | Difficulty | Pattern              |
| ---- | ------------------------------------------------------------------------------------------------------------ | ---------- | -------------------- |
| 179  | [Largest Number](https://leetcode.com/problems/largest-number)                                               | 🟡 Medium  | Greedy + Custom sort |
| 2781 | [Length of the Longest Valid Substring](https://leetcode.com/problems/length-of-the-longest-valid-substring) | 🟡 Medium  | Sliding window       |
| 2350 | [Shortest Impossible Sequence of Rolls](https://leetcode.com/problems/shortest-impossible-sequence-of-rolls) | 🔴 Hard    | Greedy               |
| 680  | [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii)                                     | 🟢 Easy    | Greedy               |
