---
layout: page
title: "Strobogrammatic Number"
difficulty: Easy
category: String
tags: [Hash Table, Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/strobogrammatic-number"
---

# Strobogrammatic Number / Số Strobogrammatic

🟢 Easy | Hash Table, Two Pointers, String

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Một số Strobogrammatic là số trông giống nhau khi xoay 180°. Chỉ có 5 chữ số hợp lệ: 0↔0, 1↔1, 6↔9, 8↔8, 9↔6. Dùng hai con trỏ từ hai đầu kiểm tra từng cặp.

```
"69"  → left=6, right=9 → valid pair ✅ → true
"88"  → left=8, right=8 → valid pair ✅ → true
"962" → left=9, right=2 → 2 not in map ❌ → false
"818" → check (8,8)✅, then center 1 → valid center ✅ → true
```

## Problem Description

A strobogrammatic number looks the same when rotated 180 degrees. Given a string `num`, return `true` if it is a strobogrammatic number. Valid digit pairs when rotated: `0↔0, 1↔1, 6↔9, 8↔8, 9↔6`.

- **Example 1:** `num = "69"` → `true`
- **Example 2:** `num = "88"` → `true`
- **Example 3:** `num = "962"` → `false`

## 📝 Interview Tips

- **🇻🇳 Chỉ 5 chữ số hợp lệ**: 0, 1, 6, 8, 9 / Only 5 valid digits: 0, 1, 6, 8, 9
- **🇻🇳 Two pointers** — kiểm tra cặp (left, right) đồng thời / Check (left, right) pair simultaneously
- **🇻🇳 Ký tự trung tâm** (khi n lẻ) phải là 0, 1, hoặc 8 / Center char (odd n) must be 0, 1, or 8
- **🇻🇳 Map lookup** nhanh hơn switch / Map lookup is faster than switch
- **🇻🇳 Biến thể** — Strobogrammatic Number II cần sinh tất cả số có độ dài n / Variant II: generate all strobogrammatic of length n
- **🇻🇳 Số không** — "00" hợp lệ strobogrammatically nhưng không phải số thông thường / "00" is valid strobogrammatically

## Solutions

### Solution 1: Two Pointers with Map

```typescript
/**
 * Two-pointer approach with strobogrammatic pair map
 * Time: O(n)  Space: O(1)
 */
function isStrobogrammatic(num: string): boolean {
  const map: Record<string, string> = {
    "0": "0",
    "1": "1",
    "6": "9",
    "8": "8",
    "9": "6",
  };

  let left = 0;
  let right = num.length - 1;

  while (left <= right) {
    const l = num[left];
    const r = num[right];

    // l must be a valid strobogrammatic digit AND map to r
    if (map[l] === undefined || map[l] !== r) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}

// Test cases
console.log(isStrobogrammatic("69")); // true
console.log(isStrobogrammatic("88")); // true
console.log(isStrobogrammatic("962")); // false
console.log(isStrobogrammatic("1")); // true
console.log(isStrobogrammatic("818")); // true
console.log(isStrobogrammatic("6")); // false (6 alone is not valid — needs paired 9)
```

### Solution 2: Reverse and Compare

```typescript
/**
 * Build rotated version and compare
 * Time: O(n)  Space: O(n)
 */
function isStrobogrammaticV2(num: string): boolean {
  const rotateMap: Record<string, string> = {
    "0": "0",
    "1": "1",
    "6": "9",
    "8": "8",
    "9": "6",
  };

  let rotated = "";
  for (let i = num.length - 1; i >= 0; i--) {
    const ch = num[i];
    if (rotateMap[ch] === undefined) return false;
    rotated += rotateMap[ch];
  }

  return rotated === num;
}

// Test cases
console.log(isStrobogrammaticV2("69")); // true
console.log(isStrobogrammaticV2("88")); // true
console.log(isStrobogrammaticV2("962")); // false
console.log(isStrobogrammaticV2("619")); // true? No: 619 rotated = 619? 6→9,1→1,9→6 = "916" ≠ "619" → false
console.log(isStrobogrammaticV2("916")); // 9→6, 1→1, 6→9 reversed = "619" wait no
// 916 reversed is 619, then rotate each: 6→9,1→1,9→6 = "916" = "916" → true
```

### Solution 3: Set-Based Validation

```typescript
/**
 * Explicit valid pairs checking
 * Time: O(n)  Space: O(1)
 */
function isStrobogrammaticV3(num: string): boolean {
  const validPairs = new Set(["00", "11", "69", "88", "96"]);
  const validCenter = new Set(["0", "1", "8"]);

  let l = 0,
    r = num.length - 1;

  while (l < r) {
    if (!validPairs.has(num[l] + num[r])) return false;
    l++;
    r--;
  }

  // Check center digit if odd length
  if (l === r) {
    return validCenter.has(num[l]);
  }

  return true;
}

// Test cases
console.log(isStrobogrammaticV3("69")); // true
console.log(isStrobogrammaticV3("88")); // true
console.log(isStrobogrammaticV3("962")); // false
console.log(isStrobogrammaticV3("1")); // true
console.log(isStrobogrammaticV3("818")); // true
```

## 🔗 Related Problems

| Problem                                                                                 | Difficulty | Similarity               |
| --------------------------------------------------------------------------------------- | ---------- | ------------------------ |
| [Strobogrammatic Number II](https://leetcode.com/problems/strobogrammatic-number-ii/)   | 🟡 Medium  | Generate all of length n |
| [Strobogrammatic Number III](https://leetcode.com/problems/strobogrammatic-number-iii/) | 🔴 Hard    | Count in range           |
| [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)                     | 🟢 Easy    | Two-pointer string check |
| [Find the Difference](https://leetcode.com/problems/find-the-difference/)               | 🟢 Easy    | Character matching       |
