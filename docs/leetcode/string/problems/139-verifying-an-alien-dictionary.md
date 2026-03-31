---
layout: page
title: "Verifying an Alien Dictionary"
difficulty: Easy
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/verifying-an-alien-dictionary"
---

# Verifying an Alien Dictionary / Xác Minh Từ Điển Ngoài Hành Tinh

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Từ điển ngoài hành tinh có thứ tự chữ cái khác. Bạn xây bảng tra thứ tự, rồi so sánh từng cặp từ liền kề — như kiểm tra bảng chữ cái thông thường nhưng dùng thứ tự mới.

```
order = "hlabcdefgijkmnopqrstuvwxyz"
Build: h→0, l→1, a→2, b→3 ...

words = ["hello","leetcode"]
Compare "hello" vs "leetcode":
  h(0) vs l(1) → 0 < 1 → OK ✅

words = ["word","world","row"]
Compare "word" vs "world":
  w=w, o=o, r=r, d vs l → d(3) < l(?) → depends on order
  If d comes before l in order → OK ✅
Compare "world" vs "row":
  w vs r → check order[w] vs order[r]
```

**Key insight**: Build `Map<char, rank>` from `order`. Compare adjacent words: first mismatch decides order; if `w1` is prefix of `w2` but longer → invalid.

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN**: Build rank map in O(26) — `order[i]` gets rank `i`
  **VI**: Xây bảng thứ tự O(26) — `order[i]` được xếp hạng `i`
- 🔑 **EN**: Compare adjacent words only — transitivity handles the rest
  **VI**: Chỉ so sánh từng cặp liền kề — tính bắc cầu xử lý phần còn lại
- 🔑 **EN**: Walk characters simultaneously; first diff determines order
  **VI**: Duyệt ký tự song song; ký tự khác nhau đầu tiên quyết định thứ tự
- 🔑 **EN**: If `words[i]` is a prefix of `words[i+1]` → OK; reverse is invalid
  **VI**: Nếu `words[i]` là tiền tố của `words[i+1]` → OK; chiều ngược lại → không hợp lệ
- 🔑 **EN**: Return `false` immediately upon any violation (early exit)
  **VI**: Trả về `false` ngay khi vi phạm (thoát sớm)
- 🔑 **EN**: Edge case: single word list is always sorted
  **VI**: Trường hợp đặc biệt: danh sách một từ luôn đã sắp xếp

---

```typescript
// ─── Solution 1: Hash Map + Adjacent Comparison — O(n·m) time, O(1) space ───
function isAlienSorted(words: string[], order: string): boolean {
  // Build rank lookup
  const rank = new Map<string, number>();
  for (let i = 0; i < order.length; i++) rank.set(order[i], i);

  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    const len = Math.min(w1.length, w2.length);
    let foundDiff = false;

    for (let j = 0; j < len; j++) {
      const r1 = rank.get(w1[j])!;
      const r2 = rank.get(w2[j])!;
      if (r1 < r2) {
        foundDiff = true;
        break;
      } // correct order
      if (r1 > r2) return false; // wrong order
    }

    // If no diff found and w1 is longer than w2, invalid (e.g. "apple" > "app")
    if (!foundDiff && w1.length > w2.length) return false;
  }

  return true;
}

// Tests
console.log(isAlienSorted(["hello", "leetcode"], "hlabcdefgijkmnopqrstuvwxyz")); // true
console.log(isAlienSorted(["word", "world", "row"], "worldabcefghijkmnpqstuvxyz")); // false
console.log(isAlienSorted(["apple", "app"], "abcdefghijklmnopqrstuvwxyz")); // false
console.log(isAlienSorted(["app", "apple"], "abcdefghijklmnopqrstuvwxyz")); // true
```

```typescript
// ─── Solution 2: Array Rank (faster lookup) — O(n·m) time, O(26) space ──────
function isAlienSorted2(words: string[], order: string): boolean {
  const rank = new Array(26).fill(0);
  for (let i = 0; i < order.length; i++) {
    rank[order.charCodeAt(i) - 97] = i;
  }

  const compare = (a: string, b: string): boolean => {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const ra = rank[a.charCodeAt(i) - 97];
      const rb = rank[b.charCodeAt(i) - 97];
      if (ra < rb) return true;
      if (ra > rb) return false;
    }
    return a.length <= b.length; // prefix rule
  };

  for (let i = 0; i < words.length - 1; i++) {
    if (!compare(words[i], words[i + 1])) return false;
  }
  return true;
}

// Tests
console.log(isAlienSorted2(["hello", "leetcode"], "hlabcdefgijkmnopqrstuvwxyz")); // true
console.log(isAlienSorted2(["word", "world", "row"], "worldabcefghijkmnpqstuvxyz")); // false
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                               | Difficulty | Pattern     |
| ---- | ------------------------------------- | ---------- | ----------- |
| 242  | Valid Anagram                         | 🟢 Easy    | Hash Map    |
| 953  | Verifying an Alien Dictionary         | 🟢 Easy    | Hash Map    |
| 1051 | Height Checker                        | 🟢 Easy    | Sorting     |
| 1356 | Sort Integers by The Number of 1 Bits | 🟢 Easy    | Custom Sort |
