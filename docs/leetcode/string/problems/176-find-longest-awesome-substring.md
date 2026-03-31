---
layout: page
title: "Find Longest Awesome Substring"
difficulty: Hard
category: String
tags: [Hash Table, String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/find-longest-awesome-substring"
---

# Find Longest Awesome Substring / Tìm Xâu Con Tuyệt Vời Dài Nhất

**Difficulty:** 🔴 Hard | **Tags:** Hash Table, String, Bit Manipulation

---

## 🧠 Intuition / Trực Giác

Một xâu "tuyệt vời" là xâu có thể sắp xếp thành **palindrome** — tức là **nhiều nhất một** ký tự có tần số lẻ.

```
s = "3242415"  →  longest awesome = "2424" (length 5 with "24241")

Bitmask XOR trick (10 bits, bit i = digit i's parity):
  prefix[-1] = 0000000000  (stored at index -1)

  i=0 '3' → mask = 0000001000
  i=1 '2' → mask = 0000001100
  i=2 '4' → mask = 0000011100
  i=3 '2' → mask = 0000010100   ← s[2..3]="42" same mask as i=1? no
  i=4 '4' → mask = 0000000100
  i=5 '1' → mask = 0000000110
  i=6 '5' → mask = 0000100110

Substring s[l+1..r] is awesome ↔
  prefix[r] XOR prefix[l] has 0 or 1 bit set.
  → longest: find earliest occurrence of each mask / mask^(1<<d)
```

**Key insight:** Store the **first** time each bitmask is seen. For each position, check:

- Same mask seen before → all-even frequency substring
- Mask with one bit flipped seen before → one-odd frequency substring

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Palindrome = tối đa một ký tự lẻ**: đây là điều kiện cốt lõi
- 🇺🇸 **Palindrome ↔ at most one odd-freq char**: the core condition to internalize
- 🇻🇳 **XOR bitmask**: bit i bật → chữ số i xuất hiện số lẻ lần trong prefix
- 🇺🇸 **XOR bitmask**: bit i set means digit i has odd frequency in current prefix
- 🇻🇳 **Lưu lần ĐẦUTIÊN**: cần tối đa hoá độ dài → first occurrence cho window dài nhất
- 🇺🇸 **Store FIRST occurrence**: maximizes window length — longer = earlier left boundary
- 🇻🇳 **10 bit cho 10 chữ số**: mask có 2^10 = 1024 giá trị có thể
- 🇺🇸 **10 bits for 10 digits**: only 1024 possible masks — use array not Map
- 🇻🇳 **Kiểm tra 11 trường hợp mỗi bước**: mask giống hệt + 10 flip một bit
- 🇺🇸 **Check 11 cases per step**: exact match + 10 single-bit toggles
- 🇻🇳 **Init first[-1] = -1**: prefix trước chuỗi có mask = 0, tại index -1
- 🇺🇸 **Init first[0] = -1**: mask 0 seen before string starts (index -1)

---

## 💻 Solutions

### Solution 1 — Bitmask Prefix XOR + First Occurrence Array (Recommended)

```typescript
/**
 * For each prefix mask, record first occurrence index.
 * Check same mask and all 10 single-bit flips at each position.
 * Time: O(10n) = O(n)  Space: O(1024) = O(1)
 */
function longestAwesome(s: string): number {
  const DIGITS = 10;
  // first[mask] = earliest index where this prefix mask was seen (-2 = not seen)
  const first = new Array(1 << DIGITS).fill(-2);
  first[0] = -1; // mask 0 exists before string starts

  let mask = 0;
  let maxLen = 0;

  for (let i = 0; i < s.length; i++) {
    mask ^= 1 << (s.charCodeAt(i) - 48); // toggle bit for digit

    // Case 1: all digits even frequency (exact mask match)
    if (first[mask] !== -2) {
      maxLen = Math.max(maxLen, i - first[mask]);
    } else {
      first[mask] = i;
    }

    // Case 2: exactly one digit odd frequency (flip one bit)
    for (let d = 0; d < DIGITS; d++) {
      const toggled = mask ^ (1 << d);
      if (first[toggled] !== -2) {
        maxLen = Math.max(maxLen, i - first[toggled]);
      }
    }
  }

  return maxLen;
}

console.log(longestAwesome("3242415")); // 5
console.log(longestAwesome("12345678")); // 1
console.log(longestAwesome("213123")); // 6
console.log(longestAwesome("00")); // 2
```

### Solution 2 — HashMap variant (explicit)

```typescript
/**
 * Same algorithm, using Map instead of array for readability.
 * Time: O(n)  Space: O(1024)
 */
function longestAwesome2(s: string): number {
  const firstSeen = new Map<number, number>([[0, -1]]);
  let mask = 0;
  let maxLen = 0;

  for (let i = 0; i < s.length; i++) {
    mask ^= 1 << (s.charCodeAt(i) - 48);

    // Check all 11 target masks (0-bit + 10 single-bit differences)
    const targets = [mask];
    for (let d = 0; d < 10; d++) targets.push(mask ^ (1 << d));

    for (const t of targets) {
      if (firstSeen.has(t)) {
        maxLen = Math.max(maxLen, i - firstSeen.get(t)!);
      }
    }

    if (!firstSeen.has(mask)) firstSeen.set(mask, i);
  }

  return maxLen;
}

console.log(longestAwesome2("3242415")); // 5
console.log(longestAwesome2("213123")); // 6
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                   | Difficulty | Pattern            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Find the Longest Substring Containing Vowels in Even Counts](https://leetcode.com/problems/find-the-longest-substring-containing-vowels-in-even-counts/) | 🟡 Medium  | Bitmask prefix XOR |
| [Count Triplets That Can Form Two Arrays of Equal XOR](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/)               | 🟡 Medium  | XOR prefix         |
| [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)                                                             | 🟡 Medium  | Palindrome         |
