---
layout: page
title: "Delete Characters to Make Fancy String"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/delete-characters-to-make-fancy-string"
---

# Delete Characters to Make Fancy String / Xóa Ký Tự Để Tạo Chuỗi Đẹp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy / Two Pointer
> **Frequency**: 📘 Tier 2 — Gặp ở 3 companies
> **See also**: [Remove All Adjacent Duplicates in String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) | [Replace Elements with Greatest Element on Right Side](https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side)

---

## Vietnamese Analogy (Ví dụ thực tế)

Trong biên tập sách, quy tắc "không có 3 ký tự liên tiếp giống nhau" đảm bảo văn bản dễ đọc. Biên tập viên duyệt từng chữ một: nếu chữ hiện tại trùng với 2 chữ trước đó, bỏ qua nó; ngược lại, giữ lại. Không cần nhìn xa hơn 2 vị trí vì chúng ta luôn kiểm soát kết quả đang xây dựng. Giống như kiểm tra dây chuyền sản xuất: chỉ cần nhìn "2 phần tử cuối cùng đã thêm vào" để biết có thêm tiếp được không.

## Visual (Minh họa trực quan)

```
s = "leeetcode"
       ^
Process each char, check last 2 in result:
  'l' → result=""       → add  → "l"
  'e' → result="l"      → add  → "le"
  'e' → result="le"     → last2 not same → add  → "lee"
  'e' → result="lee"    → last2 = 'e','e', cur='e' → SKIP
  't' → result="lee"    → add  → "leet"
  'c' → add → "leetc"   'o' → add → "leetco"
  'd' → add → "leetcod" 'e' → add → "leetcode"

s = "aaabaaaa"
  a→"a"  a→"aa"  a→SKIP  b→"aab"  a→"aaba"  a→"aabaa"  a→SKIP  a→SKIP
  Result: "aabaa"
```

## Problem (Bài toán)

A **fancy string** has no three consecutive equal characters. Given string `s`, delete the minimum number of characters to make it fancy. Return the resulting string.

**Example 1:** `s = "leeetcode"` → `"leetcode"` (one 'e' removed)
**Example 2:** `s = "aaabaaaa"` → `"aabaa"` (two 'a's removed)
**Example 3:** `s = "aab"` → `"aab"` (already fancy)

**Constraints:** `1 ≤ s.length ≤ 10⁵`, `s` consists of lowercase English letters

## Tips (Mẹo phỏng vấn)

- **Greedy is optimal** / Tham lam là tối ưu: Bỏ qua ký tự thứ 3 trong chuỗi liên tiếp luôn cho kết quả ngắn nhất — không cần DP
- **Chỉ nhìn 2 phần tử cuối** / Look back 2 only: `result[n-1] === s[i] && result[n-2] === s[i]` là điều kiện đủ để bỏ qua
- **Array > string concat** / Array faster: Dùng `char[]` + `join('')` thay vì cộng chuỗi trực tiếp để tránh O(n²) copy
- **Không cần đếm run** / No run counting: Không cần biến đếm "đang trong run bao nhiêu" — chỉ cần 2 vị trí cuối
- **In-place simulation** / Mô phỏng tại chỗ: Có thể dùng hai-pointer ghi đè s nếu cho phép sửa input
- **Luôn giữ tối thiểu 1** / Always keep ≥1: Ký tự đầu tiên luôn được giữ — không có edge case bỏ hết

## Solution 1 - Build Result String O(n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * Append character only if it wouldn't create 3 consecutive same chars
 */
function makeFancyString(s: string): string {
  const res: string[] = [];
  for (const ch of s) {
    const n = res.length;
    if (n >= 2 && res[n - 1] === ch && res[n - 2] === ch) continue;
    res.push(ch);
  }
  return res.join("");
}
```

## Solution 2 - Filter with Index O(n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * Use filter on original string — concise one-liner style
 */
function makeFancyStringFilter(s: string): string {
  return [...s].filter((ch, i) => i < 2 || ch !== s[i - 1] || ch !== s[i - 2]).join("");
}
```

## Solution 3 - Two Pointer In-Place O(n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(n) for result (O(1) extra)
 * Write pointer 'w' tracks valid position; read pointer 'r' scans input
 */
function makeFancyStringInPlace(s: string): string {
  const arr = s.split("");
  let w = 0;
  for (let r = 0; r < arr.length; r++) {
    if (w >= 2 && arr[w - 1] === arr[r] && arr[w - 2] === arr[r]) continue;
    arr[w++] = arr[r];
  }
  return arr.slice(0, w).join("");
}
```

## Test Cases

```typescript
console.log(makeFancyString("leeetcode")); // → "leetcode"
console.log(makeFancyString("aaabaaaa")); // → "aabaa"
console.log(makeFancyString("aab")); // → "aab"
console.log(makeFancyStringFilter("leeetcode")); // → "leetcode"
console.log(makeFancyStringInPlace("aaabaaaa")); // → "aabaa"
console.log(makeFancyString("a")); // → "a"
console.log(makeFancyString("aaa")); // → "aa"
console.log(makeFancyString("zzz")); // → "zz"
```

## Related Problems

| Problem                                     | Difficulty | Link                                                                                 |
| ------------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| Remove All Adjacent Duplicates in String    | Easy       | [LC 1047](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string)    |
| Remove All Adjacent Duplicates in String II | Medium     | [LC 1209](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii) |
| Zuma Game                                   | Hard       | [LC 488](https://leetcode.com/problems/zuma-game)                                    |
