---
layout: page
title: "Check if Strings Can be Made Equal With Operations II"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Sorting]
leetcode_url: "https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-ii"
---

# Check if Strings Can be Made Equal With Operations II / Kiểm Tra Chuỗi Bằng Hoán Đổi Vị Trí II

🟡 Medium | String, Sorting | [LeetCode 2840](https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-ii)

---

## 🧠 Intuition / Trực Giác

**EN:** You can swap `s[i]` and `s[j]` when `j - i` is even, meaning even-index characters can only swap with other even-index characters, and odd-index with odd-index. So: sort characters at even positions separately and odd positions separately for both strings. If they match → strings can be made equal.

**VI:** Bạn chỉ có thể hoán đổi `s[i]` và `s[j]` khi `j - i` chẵn, nghĩa là ký tự ở vị trí chẵn chỉ hoán đổi được với vị trí chẵn khác, vị trí lẻ với vị trí lẻ. Sắp xếp ký tự ở vị trí chẵn/lẻ của hai chuỗi và so sánh.

```
s1 = "cdab"  s2 = "abcd"

Even positions (0,2): s1→['c','a']  s2→['a','c']
  sorted: "ac" == "ac" ✓

Odd positions (1,3):  s1→['d','b']  s2→['b','d']
  sorted: "bd" == "bd" ✓

Result: true  (can swap s1[0]↔s1[2] and s1[1]↔s1[3])

s1 = "abcd"  s2 = "cbad"
Even: s1→['a','c'] sorted="ac"  s2→['c','a'] sorted="ac" ✓
Odd:  s1→['b','d'] sorted="bd"  s2→['b','d'] sorted="bd" ✓
Result: true
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN:** Key insight: swapping at positions with same parity is transitive — you can reach any permutation within same-parity positions. **VI:** Hoán đổi cùng chẵn/lẻ là bắc cầu — bạn có thể hoán vị tùy ý trong nhóm cùng parity.
- 📊 **EN:** This reduces to: sorted(even_chars_s1) == sorted(even_chars_s2) AND sorted(odd_chars_s1) == sorted(odd_chars_s2). **VI:** Bài toán đơn giản thành: so sánh tập ký tự đã sắp xếp ở từng nhóm vị trí.
- 🔤 **EN:** Collect chars at even indices, sort, join to string for comparison — simple and readable. **VI:** Thu thập ký tự ở chỉ số chẵn, sắp xếp, ghép chuỗi để so sánh — đơn giản và rõ ràng.
- 📏 **EN:** Both strings have equal length (guaranteed by constraints), so the parity groups have identical sizes. **VI:** Hai chuỗi có cùng độ dài (đảm bảo bởi ràng buộc).
- 🔢 **EN:** Alternative: use frequency array (26 chars) for each group — O(n) time instead of O(n log n). **VI:** Thay thế: dùng mảng tần suất 26 ký tự cho mỗi nhóm — O(n) thay O(n log n).
- ⚠️ **EN:** "Operations II" allows strings of any length; "Operations I" was restricted to length 6. Same parity logic applies. **VI:** Phiên bản II cho chuỗi bất kỳ độ dài, phiên bản I giới hạn độ dài 6. Cùng logic parity.

---

## 💡 Solutions / Giải Pháp

### Solution 1 — Split by Parity, Sort, Compare

```typescript
/**
 * Separate chars at even/odd indices, sort each group, compare
 * Time: O(n log n)  Space: O(n)
 */
function checkStrings(s1: string, s2: string): boolean {
  const even1: string[] = [],
    odd1: string[] = [];
  const even2: string[] = [],
    odd2: string[] = [];

  for (let i = 0; i < s1.length; i++) {
    if (i % 2 === 0) {
      even1.push(s1[i]);
      even2.push(s2[i]);
    } else {
      odd1.push(s1[i]);
      odd2.push(s2[i]);
    }
  }

  even1.sort();
  even2.sort();
  odd1.sort();
  odd2.sort();

  return even1.join("") === even2.join("") && odd1.join("") === odd2.join("");
}

// Tests
console.log(checkStrings("cdab", "abcd")); // true
console.log(checkStrings("abcd", "cbad")); // true
console.log(checkStrings("abcd", "adcb")); // false  (even: ac vs ad)
console.log(checkStrings("a", "a")); // true
```

### Solution 2 — Frequency Count (O(n) time)

```typescript
/**
 * Use char frequency arrays for even/odd groups — avoids sorting
 * Time: O(n)  Space: O(1) — only 26 possible chars
 */
function checkStrings2(s1: string, s2: string): boolean {
  const evenFreq = new Array(26).fill(0);
  const oddFreq = new Array(26).fill(0);

  for (let i = 0; i < s1.length; i++) {
    const c1 = s1.charCodeAt(i) - 97;
    const c2 = s2.charCodeAt(i) - 97;
    if (i % 2 === 0) {
      evenFreq[c1]++;
      evenFreq[c2]--;
    } else {
      oddFreq[c1]++;
      oddFreq[c2]--;
    }
  }

  return evenFreq.every((f) => f === 0) && oddFreq.every((f) => f === 0);
}

console.log(checkStrings2("cdab", "abcd")); // true
console.log(checkStrings2("abcd", "cbad")); // true
console.log(checkStrings2("abcd", "adcb")); // false
```

### Solution 3 — Generic Helper for Both Parts

```typescript
/**
 * Extract parity groups as sorted strings, encapsulated helper
 * Time: O(n log n)  Space: O(n)
 */
function checkStrings3(s1: string, s2: string): boolean {
  const sortedParity = (s: string, parity: number) =>
    [...s]
      .filter((_, i) => i % 2 === parity)
      .sort()
      .join("");

  return sortedParity(s1, 0) === sortedParity(s2, 0) && sortedParity(s1, 1) === sortedParity(s2, 1);
}

console.log(checkStrings3("cdab", "abcd")); // true
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                   | Difficulty | Pattern             |
| --- | ----------------------------------------- | ---------- | ------------------- |
| 1   | Check if Two String Arrays are Equivalent | 🟢 Easy    | string comparison   |
| 2   | Determine if Two Strings Are Close        | 🟡 Medium  | frequency invariant |
| 3   | Minimum Swaps to Make Strings Equal       | 🟡 Medium  | parity + swap       |
