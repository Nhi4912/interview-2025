---
layout: page
title: "Minimum Number of Operations to Make Word K-Periodic"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-operations-to-make-word-k-periodic"
---

# Minimum Number of Operations to Make Word K-Periodic / Số Thao Tác Tối Thiểu Để Từ Có Chu Kỳ K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Reorganize String](https://leetcode.com/problems/reorganize-string)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy tưởng tượng bạn cần in một tờ báo có n trang, mỗi k trang phải giống hệt nhau (chu kỳ k). Bạn chia tờ báo thành các "khúc" dài k. Mỗi khúc phải in thành nội dung giống nhau nhất. Mẹo: đếm khúc nào xuất hiện nhiều nhất — chọn nó làm mẫu, số lần thay thế = tổng khúc - tần suất khúc phổ biến nhất.

**Pattern Recognition:**

- Signal: "divide string into equal chunks" + "make all chunks the same" + "minimum operations" → **Hash Map / Mode Frequency**
- Key insight: Chia word thành n/k khúc độ dài k. Đếm tần suất mỗi khúc. Số thao tác = (tổng khúc) - (tần suất khúc nhiều nhất). Chọn khúc phổ biến nhất làm target.

**Visual — word="leetcodeleet", k=4:**

```
Chunks of length 4:
  [0..3]  = "leet"  → freq: leet=1
  [4..7]  = "code"  → freq: code=1
  [8..11] = "leet"  → freq: leet=2

Frequencies: {"leet":2, "code":1}
Max frequency = 2 (chunk "leet")
Total chunks = 3
Operations = 3 - 2 = 1  → replace "code" with "leet"

Result: "leetleetleet" ✓
```

---

## 📝 Problem Description

Given string `word` of length n (n divisible by k), one operation replaces a length-k chunk at position `i×k` with any string. Return the minimum operations to make `word` k-periodic (all chunks identical).

- **Example 1:** word="leetcodeleet", k=4 → `1`
- **Example 2:** word="leetcoleet", k=5 → `1`

Constraints: `1 ≤ n ≤ 10^5`, `1 ≤ k ≤ n`, k divides n, lowercase letters.

---

## 🎯 Interview Tips

1. **Chunk the string** / Chia chuỗi: Extract n/k substrings each of length k.
2. **Mode = best target** / Mode = mục tiêu tốt nhất: The most frequent chunk requires zero changes for itself.
3. **Operations = total - max_freq** / Thao tác = tổng - max tần suất: Replace all non-mode chunks.
4. **HashMap for counting** / HashMap để đếm: O(n) time, O(n/k × k) = O(n) space.
5. **Edge: all chunks same** / Tất cả giống nhau: max_freq = n/k → 0 operations.
6. **Substring extraction** / Trích chuỗi con: `word.slice(i*k, (i+1)*k)` for each i in [0, n/k).

---

## 💡 Solutions

### Approach 1: Brute Force — Try All Possible Target Chunks

/\*_ @complexity Time: O((n/k)² × k) | Space: O(n/k × k) _/

```typescript
function minimumOperationsBrute(word: string, k: number): number {
  const n = word.length;
  const chunks: string[] = [];
  for (let i = 0; i < n; i += k) chunks.push(word.slice(i, i + k));
  let minOps = chunks.length;
  for (const target of chunks) {
    let ops = 0;
    for (const c of chunks) if (c !== target) ops++;
    minOps = Math.min(minOps, ops);
  }
  return minOps;
}
```

### Approach 2: Frequency Map — Find Mode (Optimal)

/\*_ @complexity Time: O(n) | Space: O(n) _/

```typescript
function minimumOperations(word: string, k: number): number {
  const n = word.length;
  const freq = new Map<string, number>();
  let maxFreq = 0;

  for (let i = 0; i < n; i += k) {
    const chunk = word.slice(i, i + k);
    const cnt = (freq.get(chunk) ?? 0) + 1;
    freq.set(chunk, cnt);
    if (cnt > maxFreq) maxFreq = cnt;
  }

  const totalChunks = n / k;
  // Replace every non-mode chunk with the mode chunk
  return totalChunks - maxFreq;
}
```

---

## 🧪 Test Cases

```typescript
console.log(minimumOperations("leetcodeleet", 4)); // → 1
console.log(minimumOperations("leetcoleet", 5)); // → 1
console.log(minimumOperations("abcabc", 3)); // → 0
console.log(minimumOperations("aabbcc", 2)); // → 2
console.log(minimumOperations("aaaa", 1)); // → 0
```

---

## 🔗 Related Problems

| Problem                                                                    | Difficulty | Pattern       |
| -------------------------------------------------------------------------- | ---------- | ------------- |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | Medium     | Heap          |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)       | Medium     | Greedy / Heap |
| [Ransom Note](https://leetcode.com/problems/ransom-note)                   | Easy       | Hash Map      |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams)             | Medium     | Hash Map      |
