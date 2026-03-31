---
layout: page
title: "Longest Duplicate Substring"
difficulty: Hard
category: Sorting-Searching
tags: [String, Binary Search, Sliding Window, Rolling Hash, Suffix Array]
leetcode_url: "https://leetcode.com/problems/longest-duplicate-substring"
---

# Longest Duplicate Substring / Chuỗi Con Trùng Lặp Dài Nhất

🔴 Hard | Binary Search + Rolling Hash | [LeetCode 1044](https://leetcode.com/problems/longest-duplicate-substring)

---

## 🧠 Intuition / Trực Giác

**EN:** Binary search on the duplicate substring length `L`. For each `L`, use Rabin-Karp rolling hash to find if any two substrings of length `L` have the same hash (with string verification to avoid false positives). Double hashing reduces collision probability.

**VI:** Binary search trên độ dài `L` của chuỗi con trùng lặp. Với mỗi `L`, dùng Rabin-Karp rolling hash để tìm hai chuỗi con có cùng hash (xác minh chuỗi thực tế để tránh collision). Dùng hai hàm hash để giảm khả năng va chạm.

```
s = "banana"   Binary search: L in [0,5]

L=3: check substrings of len 3
  "ban"(h1), "ana"(h2), "nan"(h3), "ana"(h4)
   h2 == h4 AND s[1..3] == s[3..5] → duplicate "ana" ✓

L=4: "bana","anan","nana" — no duplicate ✗

Answer: "ana"

Rolling Hash:
  h_new = (h_old - s[i-1]*BASE^(L-1)) * BASE + s[i+L-1]
  Window slides in O(1) per step
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN:** Binary search is on length L (monotone: if dup of len L exists, dup of len L-1 also exists). **VI:** Binary search trên độ dài L (đơn điệu: nếu có dup dài L thì cũng có dup dài L-1).
- 🧮 **EN:** Double hashing: use two different (mod, base) pairs to minimize collision probability. **VI:** Dùng hai hàm hash khác nhau để giảm xác suất va chạm giả.
- ✅ **EN:** Always verify string equality on hash collision — prevents wrong answers from hash collision. **VI:** Luôn xác minh bằng so sánh chuỗi khi hash trùng — tránh kết quả sai do collision.
- 📦 **EN:** Store starting indices in a Map keyed by hash. On collision, compare actual substrings. **VI:** Lưu chỉ số bắt đầu trong Map theo hash. Khi collision, so sánh chuỗi thực tế.
- ⚡ **EN:** Precompute `BASE^(L-1) mod MOD` to allow O(1) rolling update. **VI:** Tính trước `BASE^(L-1) mod MOD` để cập nhật O(1) khi trượt cửa sổ.
- 🔢 **EN:** Suffix array with LCP is the canonical O(n log n) solution but complex; rolling hash is interview-friendly. **VI:** Suffix array với LCP là giải pháp chuẩn O(n log n) nhưng phức tạp; rolling hash dễ cài đặt trong phỏng vấn.

---

## 💡 Solutions / Giải Pháp

### Solution 1 — Binary Search + Double Rolling Hash (Rabin-Karp)

```typescript
/**
 * Binary search on length L; rolling hash with two mods to check duplicates.
 * Time: O(n log n) average  Space: O(n)
 */
function longestDupSubstring(s: string): string {
  const n = s.length;
  const MOD1 = 1_000_000_007,
    MOD2 = 998_244_353;
  const B1 = 31,
    B2 = 37;

  /**
   * Returns start index of duplicate substring of length `len`, or -1 if none.
   */
  function check(len: number): number {
    if (len === 0) return 0;
    let h1 = 0,
      h2 = 0,
      p1 = 1,
      p2 = 1;

    // Build initial hash for s[0..len-1] and compute BASE^(len-1)
    for (let i = 0; i < len; i++) {
      const c = s.charCodeAt(i) - 96;
      h1 = (h1 * B1 + c) % MOD1;
      h2 = (h2 * B2 + c) % MOD2;
      if (i < len - 1) {
        p1 = (p1 * B1) % MOD1;
        p2 = (p2 * B2) % MOD2;
      }
    }

    // Map combined hash to list of start indices for collision verification
    const seen = new Map<string, number[]>();
    const key0 = `${h1},${h2}`;
    seen.set(key0, [0]);

    for (let i = 1; i + len <= n; i++) {
      const leave = s.charCodeAt(i - 1) - 96;
      const enter = s.charCodeAt(i + len - 1) - 96;
      h1 = ((h1 - ((leave * p1) % MOD1) + MOD1) * B1 + enter) % MOD1;
      h2 = ((h2 - ((leave * p2) % MOD2) + MOD2) * B2 + enter) % MOD2;

      const key = `${h1},${h2}`;
      if (seen.has(key)) {
        const cur = s.slice(i, i + len);
        for (const prev of seen.get(key)!) {
          if (s.slice(prev, prev + len) === cur) return i; // found real duplicate
        }
      }
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(i);
    }
    return -1;
  }

  let lo = 0,
    hi = n - 1;
  let result = "";
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const idx = check(mid);
    if (idx >= 0) {
      result = s.slice(idx, idx + mid);
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
}

// Tests
console.log(longestDupSubstring("banana")); // "ana"
console.log(longestDupSubstring("abcd")); // ""
console.log(longestDupSubstring("aababaa")); // "abaa" or "aaba"
```

### Solution 2 — Binary Search + Single Hash with Verification

```typescript
/**
 * Simpler single-hash version; relies on string verification for correctness
 * Time: O(n log n) average  Space: O(n)
 */
function longestDupSubstring2(s: string): string {
  const n = s.length;
  const MOD = 1_000_000_007n,
    BASE = 31n;

  function findDup(len: number): string {
    let h = 0n,
      pw = 1n;
    for (let i = 0; i < len; i++) {
      h = (h * BASE + BigInt(s.charCodeAt(i) - 96)) % MOD;
      if (i < len - 1) pw = (pw * BASE) % MOD;
    }
    const seen = new Map<bigint, number[]>([[h, [0]]]);

    for (let i = 1; i + len <= n; i++) {
      h = (h - ((BigInt(s.charCodeAt(i - 1) - 96) * pw) % MOD) + MOD) % MOD;
      h = (h * BASE + BigInt(s.charCodeAt(i + len - 1) - 96)) % MOD;
      if (seen.has(h)) {
        const sub = s.slice(i, i + len);
        for (const j of seen.get(h)!) {
          if (s.slice(j, j + len) === sub) return sub;
        }
      }
      if (!seen.has(h)) seen.set(h, []);
      seen.get(h)!.push(i);
    }
    return "";
  }

  let lo = 0,
    hi = n - 1,
    result = "";
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const dup = findDup(mid);
    if (dup) {
      result = dup;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return result;
}

console.log(longestDupSubstring2("banana")); // "ana"
console.log(longestDupSubstring2("abcd")); // ""
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                     | Difficulty | Pattern            |
| --- | --------------------------- | ---------- | ------------------ |
| 1   | Longest Common Substring    | 🟡 Medium  | rolling hash       |
| 2   | Repeated DNA Sequences      | 🟡 Medium  | rolling hash + set |
| 3   | String Matching in an Array | 🟢 Easy    | substring search   |
