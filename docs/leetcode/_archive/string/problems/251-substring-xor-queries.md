---
layout: page
title: "Substring XOR Queries"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/substring-xor-queries"
---

# Substring XOR Queries / Truy Vấn XOR Chuỗi Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) | [Number of Valid Words for Each Puzzle](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ đến trò giải mã điện tín — mỗi tin nhắn được mã hóa bằng khóa XOR. Nếu biết tin nhắn gốc (first) và tin mã hóa (second), khóa XOR chính là `first XOR second`. Bài toán hỏi: trong chuỗi nhị phân s, hãy tìm vị trí ngắn nhất của "khóa" đó (giá trị `first XOR second`) như một chuỗi con.

**Pattern Recognition:**

- Signal: "substring value" + "XOR query" + "precompute map" → **Hash Map + Bit Manipulation**
- Key insight: Mỗi query [first, second] → target = first XOR second. Dựng map: {giá trị chuỗi con → [left, right] ngắn nhất}. Mỗi số nguyên 32-bit có tối đa 32 bits → chuỗi con dài nhất ≤ 32.

**Visual — s="101101", queries=[[0,5],[1,2]]:**

```
query [0,5]: target = 0 XOR 5 = 5 = "101"
  → find "101" in s → first occurrence at index [0,2]
  → answer: [0, 2]

query [1,2]: target = 1 XOR 2 = 3 = "11"
  → find "11" in s → s[2..3]="11" at index [2, 3]
  → answer: [2, 3]

Precompute map: for each start i, expand right up to 32 bits
  build decimal value of s[i..j], store first [i,j] for each value
```

---

## 📝 Problem Description

Given binary string `s` and queries `[first, second]`, for each query find the shortest substring of `s` whose integer value equals `first XOR second`. Return `[left, right]` indices (0-indexed) or `[-1,-1]` if not found.

- **Example 1:** s="101101", queries=[[0,5],[1,2]] → `[[0,2],[2,3]]`
- **Example 2:** s="0101", queries=[[12,8]] → `[[-1,-1]]`

Constraints: `1 ≤ n ≤ 10^4`, `0 ≤ first, second ≤ 10^9`.

---

## 🎯 Interview Tips

1. **XOR property** / Tính chất XOR: If val XOR first = second → val = first XOR second. Compute target first.
2. **32-bit limit** / Giới hạn 32 bit: Integers ≤ 10^9 < 2^30, so substring length ≤ 30. Key optimization!
3. **Precompute all substrings** / Tính trước mọi chuỗi con: O(32n) preprocessing, O(1) per query via hash map.
4. **Shortest substring** / Chuỗi con ngắn nhất: Among all substrings with value=target, pick smallest length (or earliest).
5. **Handle leading zeros** / Xử lý số 0 đầu: "0" has value 0; "00" also. Store shortest representation.
6. **Edge: target=0** / Trường hợp target=0: The value 0 can be represented by any substring of all zeros — find shortest.

---

## 💡 Solutions

### Approach 1: Brute Force — Per Query Scan

/\*_ @complexity Time: O(q × n²) | Space: O(1) _/

```typescript
function substringXorQueriesBrute(s: string, queries: number[][]): number[][] {
  const result: number[][] = [];
  for (const [first, second] of queries) {
    const target = first ^ second;
    let found = [-1, -1];
    outer: for (let i = 0; i < s.length; i++) {
      let val = 0;
      for (let j = i; j < s.length && j - i < 32; j++) {
        val = (val << 1) | Number(s[j]);
        if (val === target) {
          found = [i, j];
          break outer;
        }
      }
    }
    result.push(found);
  }
  return result;
}
```

### Approach 2: Precompute Hash Map — O(32n + q)

/\*_ @complexity Time: O(32n + q) | Space: O(32n) _/

```typescript
function substringXorQueries(s: string, queries: number[][]): number[][] {
  // Build map: value → [leftIdx, rightIdx] of shortest/earliest occurrence
  const map = new Map<number, [number, number]>();

  for (let i = 0; i < s.length; i++) {
    let val = 0;
    for (let j = i; j < s.length && j - i < 32; j++) {
      val = (val << 1) | (s[j] === "1" ? 1 : 0);
      if (!map.has(val)) {
        map.set(val, [i, j]); // store first (shortest from left) occurrence
      }
    }
  }

  return queries.map(([first, second]) => {
    const target = first ^ second;
    return map.get(target) ?? [-1, -1];
  });
}
```

---

## 🧪 Test Cases

```typescript
console.log(
  substringXorQueries("101101", [
    [0, 5],
    [1, 2],
  ]),
); // → [[0,2],[2,3]]
console.log(substringXorQueries("0101", [[12, 8]])); // → [[-1,-1]]
console.log(
  substringXorQueries("1", [
    [0, 1],
    [1, 0],
  ]),
); // → [[0,0],[0,0]]
console.log(substringXorQueries("00", [[0, 0]])); // → [[0,0]]
console.log(
  substringXorQueries("10", [
    [2, 3],
    [5, 1],
  ]),
); // → [[-1,-1],[0,1]]
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Difficulty | Pattern          |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring)         | Medium     | Prefix Sum       |
| [Number of Valid Words for Each Puzzle](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle)   | Hard       | Trie             |
| [Count Pairs Of Similar Strings](https://leetcode.com/problems/count-pairs-of-similar-strings)                 | Easy       | Bit Manipulation |
| [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) | Medium     | Trie / Bit       |
