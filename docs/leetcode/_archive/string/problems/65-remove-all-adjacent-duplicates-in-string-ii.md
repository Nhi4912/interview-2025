---
layout: page
title: "Remove All Adjacent Duplicates in String II"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii"
---

# Remove All Adjacent Duplicates in String II / Xoá Nhóm Ký Tự Kề Trùng K Lần

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống chơi xếp gạch — khi k viên gạch cùng màu chồng nhau, chúng phát nổ biến mất. Stack lưu (ký tự, đếm liên tiếp) để xử lý O(n) thay vì quét nhiều lần.

**Pattern Recognition:**

- Cần nhớ "ký tự trước + count liên tiếp" → Stack với `[char, count]`
- Khi top stack trùng ký tự mới → tăng count; khi count == k → pop (explode)
- Build kết quả từ stack bằng `char.repeat(count)`

```
s = "deeedbbcccbdaa", k = 3

d  → [(d,1)]
e  → [(d,1),(e,1)]
e  → [(d,1),(e,2)]
e  → [(d,1),(e,3)] → POP → [(d,1)]
d  → [(d,2)]
b  → [(d,2),(b,1)]
b  → [(d,2),(b,2)]
c  → [(d,2),(b,2),(c,1)]
c  → [(d,2),(b,2),(c,2)]
c  → [(d,2),(b,2),(c,3)] → POP → [(d,2),(b,2)]
b  → [(d,2),(b,3)] → POP → [(d,2)]
d  → [(d,3)] → POP → []
a  → [(a,1)]
a  → [(a,2)]   Result: "aa" ✅
```

---

## Problem Description

Given string `s` and integer `k`, repeatedly remove `k` adjacent identical characters until no more removals possible. Return the final string after all removals.

**Examples:**

- `s = "abcd", k = 2` → `"abcd"` (no k-adjacent duplicates)
- `s = "deeedbbcccbdaa", k = 3` → `"aa"`
- `s = "pbbcggttcbbsa", k = 2` → `"ps"`

**Constraints:** `1 ≤ s.length ≤ 10^5`, lowercase letters only, `2 ≤ k ≤ 10^4`

---

## 📝 Interview Tips

- 🇻🇳 Dùng stack `[char, count]` — tránh quét lại O(n²) theo nhiều vòng
- 🇺🇸 Single-pass O(n): each character pushed and popped at most once
- 🇻🇳 Khi top.char == cur → tăng count; khi count == k → pop
- 🇺🇸 Build result bottom-to-top: `stack.map(([c,n]) => c.repeat(n)).join('')`
- 🇻🇳 Edge: k=1 → toàn bộ chuỗi bị xoá về `""`
- 🇺🇸 Variation: k=2 is LeetCode 1047 (simpler, single char stack)

---

## Solutions

### Solution 1 — Brute Force (simulate repeatedly)

```typescript
/**
 * Brute force: scan and remove k-adjacent groups, repeat until stable
 * Time: O(n²/k) — up to n/k passes, each O(n)
 * Space: O(n)
 */
function removeDuplicatesBrute(s: string, k: number): string {
  let changed = true;
  while (changed) {
    changed = false;
    let result = "";
    let i = 0;
    while (i < s.length) {
      let j = i;
      while (j < s.length && s[j] === s[i]) j++;
      const run = j - i;
      const keep = run % k;
      result += s[i].repeat(keep);
      if (run >= k) changed = true;
      i = j;
    }
    s = result;
  }
  return s;
}
```

### Solution 2 — Stack (Optimal)

```typescript
/**
 * Stack with [char, count] pairs: single linear pass
 * Time: O(n) — each char pushed/popped at most once
 * Space: O(n)
 */
function removeDuplicates(s: string, k: number): string {
  // Stack stores [character, consecutive count]
  const stack: [string, number][] = [];

  for (const ch of s) {
    if (stack.length > 0 && stack[stack.length - 1][0] === ch) {
      stack[stack.length - 1][1]++;
      if (stack[stack.length - 1][1] === k) {
        stack.pop(); // k-adjacent group explodes
      }
    } else {
      stack.push([ch, 1]);
    }
  }

  return stack.map(([c, cnt]) => c.repeat(cnt)).join("");
}

// Test cases
console.log(removeDuplicates("abcd", 2)); // "abcd"
console.log(removeDuplicates("deeedbbcccbdaa", 3)); // "aa"
console.log(removeDuplicates("pbbcggttcbbsa", 2)); // "ps"
console.log(removeDuplicates("yfttttfbbbbnnnnffbgffffgbbbbgssssgthyyyy", 4)); // "ybth"
```

---

## 🔗 Related Problems

- [1047 - Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/) — k=2 simpler version
- [394 - Decode String](https://leetcode.com/problems/decode-string/) — stack with char+count tracking
- [71 - Simplify Path](https://leetcode.com/problems/simplify-path/) — stack-based string processing
- [20 - Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) — classic stack matching
- [1249 - Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/) — stack with indices
