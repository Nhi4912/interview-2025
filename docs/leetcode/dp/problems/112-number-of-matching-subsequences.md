---
layout: page
title: "Number of Matching Subsequences"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, String, Binary Search, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-matching-subsequences"
---

# Number of Matching Subsequences / Đếm Số Từ Là Dãy Con Của Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Table + Waiting Buckets
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như nhân viên bưu điện phân loại thư — thay vì đọc hết tất cả thư mỗi lần có khách, ta nhóm thư theo chữ cái đầu tiên chờ. Khi chuỗi `s` đến ký tự `c`, tất cả từ đang "chờ" ký tự `c` được đẩy lên một bước cùng lúc.

**Pattern Recognition:**

- Brute force: với mỗi `word` quét lại `s` từ đầu → O(|s| × Σ|word|)
- Tối ưu: "Waiting Bucket" — nhóm từng `word` theo ký tự cần xét tiếp; khi quét `s`, advance cả nhóm → O(|s| + Σ|word|)

```
s = "abcde",  words = ["a","bb","acd","ace"]

Buckets theo ký tự chờ tiếp:
a → [(a,idx=0), (acd,idx=0), (ace,idx=0)]
b → [(bb,idx=0)]

s[0]='a': a→done✓, acd→chờ'c', ace→chờ'c'
s[1]='b': bb→chờ'b'
s[2]='c': acd→chờ'd', ace→chờ'e'
s[3]='d': acd→done✓
s[4]='e': ace→done✓    Result = 3
```

---

## Problem Description / Mô Tả Bài Toán

Cho chuỗi `s` và mảng `words`, trả về số từ trong `words` là **subsequence** (dãy con không liên tiếp) của `s`.

**Example 1:** `s="abcde"`, `words=["a","bb","acd","ace"]` → `3`
**Example 2:** `s="dsahjpjauf"`, `words=["ahjpjau","ja","ahbwzgqnuk","tnmlanowax"]` → `2`

**Constraints:** `1 ≤ s.length ≤ 5×10⁴`, `1 ≤ words.length ≤ 5000`, `1 ≤ words[i].length ≤ 50`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Start with brute-force O(|s|·Σ|w|), clearly state complexity before optimizing.
   **VI:** Bắt đầu brute-force, nêu rõ độ phức tạp trước khi tối ưu.

2. **EN:** The "waiting bucket" groups words by next needed char — batch processing key insight.
   **VI:** "Waiting bucket" nhóm từ theo ký tự cần tiếp theo — xử lý hàng loạt là chìa khóa.

3. **EN:** Binary search alternative: precompute sorted index lists per char, use lower_bound per char.
   **VI:** Phương án binary search: lưu danh sách vị trí theo từng ký tự, dùng lower_bound.

4. **EN:** Duplicates in `words` are handled naturally — each copy maintains its own pointer.
   **VI:** Từ trùng lặp tự xử lý — mỗi bản sao có con trỏ riêng.

5. **EN:** Time O(|s| + Σ|w|), Space O(Σ|w|) for bucket approach.
   **VI:** Thời gian O(|s| + Σ|w|), không gian O(Σ|w|) cho bucket approach.

6. **EN:** Follow-up: if `s` changes dynamically, binary search with precomputed indices adapts better.
   **VI:** Follow-up: nếu `s` thay đổi liên tục, binary search thích ứng tốt hơn.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Brute Force — O(|s| × Σ|words[i]|) ─────────────────────────
function numMatchingSubseq_brute(s: string, words: string[]): number {
  function isSubseq(word: string): boolean {
    let i = 0;
    for (const c of s) {
      if (i < word.length && c === word[i]) i++;
    }
    return i === word.length;
  }
  return words.filter(isSubseq).length;
}

// ─── Solution 2: Waiting Bucket — O(|s| + Σ|words[i]|) ──────────────────────
// Group each word by its "next needed character". When we see char c in s,
// all words waiting for c advance one step (or finish if fully matched).
function numMatchingSubseq(s: string, words: string[]): number {
  // buckets[charCode] = list of [word, nextIndex] waiting for that char
  const buckets: Array<Array<[string, number]>> = Array.from({ length: 26 }, () => []);

  for (const w of words) {
    buckets[w.charCodeAt(0) - 97].push([w, 0]);
  }

  let count = 0;
  for (const c of s) {
    const ci = c.charCodeAt(0) - 97;
    const waiting = buckets[ci];
    buckets[ci] = []; // clear, will redistribute

    for (const [word, idx] of waiting) {
      const next = idx + 1;
      if (next === word.length) {
        count++; // entire word matched
      } else {
        buckets[word.charCodeAt(next) - 97].push([word, next]);
      }
    }
  }
  return count;
}

// ─── Solution 3: Binary Search on Precomputed Positions — O(Σ|w|·log|s|) ────
function numMatchingSubseq_bs(s: string, words: string[]): number {
  const pos: number[][] = Array.from({ length: 26 }, () => []);
  for (let i = 0; i < s.length; i++) {
    pos[s.charCodeAt(i) - 97].push(i);
  }

  function lowerBound(arr: number[], target: number): number {
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      arr[mid] < target ? (lo = mid + 1) : (hi = mid);
    }
    return lo;
  }

  function isSubseq(word: string): boolean {
    let prevIdx = -1;
    for (const c of word) {
      const arr = pos[c.charCodeAt(0) - 97];
      const i = lowerBound(arr, prevIdx + 1);
      if (i === arr.length) return false;
      prevIdx = arr[i];
    }
    return true;
  }

  return words.filter(isSubseq).length;
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(numMatchingSubseq("abcde", ["a", "bb", "acd", "ace"])); // 3
console.log(numMatchingSubseq("dsahjpjauf", ["ahjpjau", "ja", "ahbwzgqnuk", "tnmlanowax"])); // 2
console.log(numMatchingSubseq_bs("abcde", ["a", "bb", "acd", "ace"])); // 3
console.log(numMatchingSubseq_brute("abcde", ["a", "bb", "acd", "ace"])); // 3
console.log(numMatchingSubseq("a", ["a", "a", "a"])); // 3
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                              | Difficulty | Pattern     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ----------- |
| 392  | [Is Subsequence](https://leetcode.com/problems/is-subsequence)                                                                       | 🟢 Easy    | Two Pointer |
| 1023 | [Camelcase Matching](https://leetcode.com/problems/camelcase-matching)                                                               | 🟡 Medium  | Subsequence |
| 2825 | [Make String a Subsequence Using Cyclic Increments](https://leetcode.com/problems/make-string-a-subsequence-using-cyclic-increments) | 🟡 Medium  | Greedy      |
