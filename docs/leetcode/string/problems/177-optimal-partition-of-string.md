---
layout: page
title: "Optimal Partition of String"
difficulty: Medium
category: String
tags: [Hash Table, String, Greedy]
leetcode_url: "https://leetcode.com/problems/optimal-partition-of-string"
---

# Optimal Partition of String / Phân Chia Chuỗi Tối Ưu

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài toán giống **cắt bánh**: cắt sớm nhất khi có ký tự lặp, để mỗi miếng có ký tự không trùng.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Optimal Partition of String example:**

```
s = "abacaba"

Greedy scan — current partition chars:
  a  → {a}           ok
  b  → {a,b}         ok
  a  → CONFLICT! 'a' already in set
     → cut (parts=2), new part {a}
  c  → {a,c}         ok
  a  → CONFLICT!
     → cut (parts=3), new part {a}
  b  → {a,b}         ok
  a  → CONFLICT!
     → cut (parts=4), new part {a}

Answer: 4
```

**Greedy proof:** Cutting as late as possible (when we must) minimises the number of cuts, hence minimises partitions.

---

---

## Problem Description

| Problem                                                                                                                                           | Difficulty | Pattern         |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Partition Labels](https://leetcode.com/problems/partition-labels/)                                                                               | 🟡 Medium  | Greedy interval |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)                   | 🟡 Medium  | Sliding window  |
| [Maximum Number of Vowels in a Substring of Given Length](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) | 🟡 Medium  | Sliding window  |

---

## 📝 Interview Tips

- 🇻🇳 **Greedy cắt trễ nhất**: khi gặp ký tự trùng mới cắt — tối ưu vì cắt sớm chỉ tăng số lượng
- 🇺🇸 **Greedy cut latest**: cut only when forced — earlier cuts never reduce total count
- 🇻🇳 **Set hoặc bitmask**: Set cho đọc dễ, bitmask cho tốc độ (26 bit int)
- 🇺🇸 **Set or bitmask**: Set is readable; 26-bit integer is faster
- 🇻🇳 **Reset tập khi cắt**: sau mỗi lần cắt, xoá tập và thêm ký tự hiện tại
- 🇺🇸 **Reset set on cut**: clear the set and add current char after each partition
- 🇻🇳 **Đếm partitions, không cần lưu chuỗi**: chỉ cần đếm số lần cắt + 1
- 🇺🇸 **Count partitions, not substrings**: track cut count + 1, no need to build strings
- 🇻🇳 **Bitmask trick**: `seen |= (1 << (c - 97))`, conflict khi `seen & bit !== 0`
- 🇺🇸 **Bitmask trick**: `seen |= (1 << charCode)`, conflict when `seen & bit !== 0`
- 🇻🇳 **Độ phức tạp**: O(n) time, O(26) = O(1) space
- 🇺🇸 **Complexity**: O(n) time, O(26) = O(1) space

---

---

## Solutions

```typescript
/**
 * Greedily extend partition; cut when duplicate found.
 * Time: O(n)  Space: O(26) = O(1)
 */
function partitionString(s: string): number {
  let parts = 1;
  let seen = new Set<string>();

  for (const c of s) {
    if (seen.has(c)) {
      parts++;
      seen = new Set<string>();
    }
    seen.add(c);
  }

  return parts;
}

console.log(partitionString("abacaba")); // 4
console.log(partitionString("ssssss")); // 6
console.log(partitionString("abcde")); // 1

/**
 * Use 26-bit integer instead of Set for O(1) ops with smaller constant.
 * Time: O(n)  Space: O(1)
 */
function partitionString2(s: string): number {
  let parts = 1;
  let seen = 0; // bitmask of chars in current partition

  for (let i = 0; i < s.length; i++) {
    const bit = 1 << (s.charCodeAt(i) - 97);
    if (seen & bit) {
      parts++;
      seen = 0;
    }
    seen |= bit;
  }

  return parts;
}

console.log(partitionString2("abacaba")); // 4
console.log(partitionString2("ssssss")); // 6
console.log(partitionString2("abcde")); // 1

/**
 * Explicit sliding window tracking start of current partition.
 * Time: O(n)  Space: O(26) = O(1)
 */
function partitionString3(s: string): number {
  const lastSeen = new Array(26).fill(-1);
  let partStart = 0;
  let parts = 0;

  for (let i = 0; i < s.length; i++) {
    const idx = s.charCodeAt(i) - 97;
    if (lastSeen[idx] >= partStart) {
      // Current char was seen in this partition — cut before i
      parts++;
      partStart = i;
    }
    lastSeen[idx] = i;
  }

  return parts + 1; // +1 for the last partition
}

console.log(partitionString3("abacaba")); // 4
console.log(partitionString3("ssssss")); // 6
console.log(partitionString3("abcde")); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                                           | Difficulty | Pattern         |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Partition Labels](https://leetcode.com/problems/partition-labels/)                                                                               | 🟡 Medium  | Greedy interval |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)                   | 🟡 Medium  | Sliding window  |
| [Maximum Number of Vowels in a Substring of Given Length](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) | 🟡 Medium  | Sliding window  |
