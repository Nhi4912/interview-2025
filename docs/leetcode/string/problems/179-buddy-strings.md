---
layout: page
title: "Buddy Strings"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/buddy-strings"
---

# Buddy Strings / Chuỗi Bạn Đồng Hành

**Difficulty:** 🟢 Easy | **Tags:** Hash Table, String

---

## 🧠 Intuition / Trực Giác

Hai chuỗi là "buddy" nếu **hoán đổi đúng một cặp** ký tự trong `s` ra được `goal`.

```
s = "ab"   goal = "ba"   → swap(0,1): "ba" ✓
s = "ab"   goal = "ab"   → already equal, need a duplicate char
                           freq: a=1, b=1  → NO duplicate → false
s = "aa"   goal = "aa"   → equal + 'a' appears twice → swap(0,1)="aa" ✓
s = "aaaaaaabc" goal = "aaaaaaab" → diff lengths → false

Case analysis:
  len(s) ≠ len(goal)           → false
  s == goal                    → true iff s has any duplicate char
  diffs = positions where s[i]≠goal[i]
    |diffs| ≠ 2                → false
    |diffs| == 2, i & j:       → s[i]=goal[j] AND s[j]=goal[i]
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Trường hợp s == goal**: cần ký tự trùng → hoán đổi hai vị trí giống nhau
- 🇺🇸 **s == goal case**: need a duplicate char — swap two identical chars keeps string same
- 🇻🇳 **Đúng 2 vị trí khác**: kiểm tra chéo `s[i]=goal[j]` và `s[j]=goal[i]`
- 🇺🇸 **Exactly 2 diffs**: cross-check `s[i]=goal[j]` and `s[j]=goal[i]`
- 🇻🇳 **Khác bài 178**: bài này xét thêm nhánh s==goal với duplicate chars
- 🇺🇸 **Vs problem 178**: this one also handles the s==goal with duplicate branch
- 🇻🇳 **Chiều dài khác → false ngay**: early return tiết kiệm thời gian
- 🇺🇸 **Unequal length → false early**: quick guard before any char comparison
- 🇻🇳 **Phát hiện duplicate nhanh**: `new Set(s).size < s.length`
- 🇺🇸 **Fast duplicate check**: `new Set(s).size < s.length` detects any duplicate
- 🇻🇳 **1 diff không thể fix**: một swap tạo ra đúng 2 vị trí thay đổi
- 🇺🇸 **1 diff is unfixable**: one swap always changes exactly 2 positions

---

## 💻 Solutions

### Solution 1 — Three-case Analysis (Recommended)

```typescript
/**
 * Handle: unequal lengths, equal strings, and exactly-2-diffs.
 * Time: O(n)  Space: O(1)
 */
function buddyStrings(s: string, goal: string): boolean {
  if (s.length !== goal.length) return false;

  if (s === goal) {
    // Need at least one duplicate character to swap
    return new Set(s).size < s.length;
  }

  // Find differing positions
  const diffs: number[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== goal[i]) {
      diffs.push(i);
      if (diffs.length > 2) return false;
    }
  }

  if (diffs.length !== 2) return false;
  const [i, j] = diffs;
  return s[i] === goal[j] && s[j] === goal[i];
}

console.log(buddyStrings("ab", "ba")); // true
console.log(buddyStrings("ab", "ab")); // false (no duplicate)
console.log(buddyStrings("aa", "aa")); // true  (duplicate 'a')
console.log(buddyStrings("aaaaaaabc", "aaaaaaacb")); // true
console.log(buddyStrings("abcd", "badc")); // false (4 diffs)
```

### Solution 2 — Explicit freq map for duplicate check

```typescript
/**
 * Use frequency array instead of Set for duplicate detection.
 * Time: O(n)  Space: O(26)
 */
function buddyStrings2(s: string, goal: string): boolean {
  if (s.length !== goal.length) return false;

  const diffs: Array<[string, string]> = [];
  const freq = new Array(26).fill(0);
  let hasDuplicate = false;

  for (let i = 0; i < s.length; i++) {
    const idx = s.charCodeAt(i) - 97;
    freq[idx]++;
    if (freq[idx] === 2) hasDuplicate = true;

    if (s[i] !== goal[i]) {
      diffs.push([s[i], goal[i]]);
      if (diffs.length > 2) return false;
    }
  }

  if (diffs.length === 0) return hasDuplicate;
  if (diffs.length !== 2) return false;
  return diffs[0][0] === diffs[1][1] && diffs[0][1] === diffs[1][0];
}

console.log(buddyStrings2("ab", "ba")); // true
console.log(buddyStrings2("aa", "aa")); // true
console.log(buddyStrings2("ab", "ab")); // false
```

### Solution 3 — Compact with sorted diff check

```typescript
/**
 * Sort the two diff-pairs and compare; duplicate via char count.
 * Time: O(n)  Space: O(n)
 */
function buddyStrings3(s: string, goal: string): boolean {
  if (s.length !== goal.length) return false;

  const diffs = [...s].reduce<number[]>((acc, c, i) => {
    if (c !== goal[i]) acc.push(i);
    return acc;
  }, []);

  if (diffs.length === 0) return new Set(s).size < s.length;
  if (diffs.length !== 2) return false;

  const [i, j] = diffs;
  return s[i] === goal[j] && s[j] === goal[i];
}

console.log(buddyStrings3("ab", "ba")); // true
console.log(buddyStrings3("ab", "ab")); // false
console.log(buddyStrings3("aa", "aa")); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                                           | Difficulty | Pattern            |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Check if One String Swap Can Make Strings Equal](https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/) | 🟢 Easy    | Swap validation    |
| [Determine if Two Strings Are Close](https://leetcode.com/problems/determine-if-two-strings-are-close/)                           | 🟡 Medium  | Frequency analysis |
| [Check if a String Can Break Another String](https://leetcode.com/problems/check-if-a-string-can-break-another-string/)           | 🟡 Medium  | String comparison  |
