---
layout: page
title: "Find Resultant Array After Removing Anagrams"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, String, Sorting]
leetcode_url: "https://leetcode.com/problems/find-resultant-array-after-removing-anagrams"
---

# Find Resultant Array After Removing Anagrams / Mảng Kết Quả Sau Khi Xóa Các Anagram

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting + Simulation
> **Frequency**: 📗 Tier 1 — Gặp ở Amazon, Microsoft
> **See also**: [Group Anagrams](https://leetcode.com/problems/group-anagrams) | [Valid Anagram](https://leetcode.com/problems/valid-anagram)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng dọn hàng đợi: nếu người đứng sau có cùng "bộ chữ cái" với người trước → đuổi ra khỏi hàng. Chỉ giữ lại người đầu tiên của mỗi nhóm anagram liên tiếp nhau.

**Pattern Recognition:**

- Scan từ trái sang phải, so sánh word hiện tại với word **đã giữ** cuối cùng
- Anagram ↔ sorted version bằng nhau → `word.split('').sort().join('')`
- Một lần duyệt là đủ: xóa phần tử không tạo ra cặp anagram mới kề nhau

**Visual — words = ["abba","baba","bbaa","cd","cd"]:**

```
i=0: keep "abba"  → key="aabb", result=["abba"]
i=1: "baba" key="aabb" == "aabb" → SKIP
i=2: "bbaa" key="aabb" == "aabb" → SKIP
i=3: keep "cd"   → key="cd",   result=["abba","cd"]
i=4: "cd"  key="cd"   == "cd"   → SKIP
Final: ["abba","cd"] ✅
```

---

## Problem Description

Given array `words`, repeatedly remove `words[i]` if it is an anagram of `words[i-1]`. Return the final array after all such removals.

- Example 1: `words = ["abba","baba","bbaa","cd","cd"]` → `["abba","cd"]`
- Example 2: `words = ["a","b","c","d","e"]` → `["a","b","c","d","e"]` (no adjacent anagrams)
- Example 3: `words = ["z","yy","x","z"]` → `["z","yy","x","z"]`

**Constraints:** `1 ≤ words.length ≤ 100`, `1 ≤ words[i].length ≤ 10`, lowercase English letters only.

---

## 📝 Interview Tips

1. **Clarify**: "Xóa xảy ra lặp lại đến khi không còn anagram kề nhau nữa" / Removals repeat until no adjacent anagrams remain
2. **One-pass insight**: "Không cần while loop — một lần duyệt đủ vì xóa không tạo ra cặp anagram kề mới" / Single pass works; deletions never create new adjacent anagrams
3. **Anagram check**: "Sort string O(k log k) hoặc freq array O(k) — với k ≤ 10 thì sort tốt hơn cho code ngắn" / For small k, sort is simpler; freq array is O(k)
4. **Result building**: "Dùng mảng result, so sánh với phần tử cuối — không cần stack riêng" / Use result array directly, compare last element
5. **Edge case**: "Mảng 1 phần tử → trả về ngay; toàn anagram → chỉ giữ phần tử đầu" / Single word → return as-is; all anagrams → keep only first
6. **Follow-up**: "Nếu xóa bất kỳ cặp anagram nào, không cần liền kề?" / What if removing any pair of anagrams, not just adjacent?

---

## Solutions

```typescript
/**
 * Solution 1: Filter with sorted-string comparison
 * Time: O(n * k log k) — n words × sort each word O(k log k)
 * Space: O(n * k) — result array
 */
function removeAnagrams(words: string[]): string[] {
  const key = (w: string) => w.split("").sort().join("");
  const result: string[] = [words[0]];
  for (let i = 1; i < words.length; i++) {
    if (key(words[i]) !== key(result[result.length - 1])) {
      result.push(words[i]);
    }
  }
  return result;
}

/**
 * Solution 2: Frequency array comparison — O(k) per word
 * Time: O(n * k) — n words × freq comparison O(k)
 * Space: O(n + 26)
 */
function removeAnagramsFreq(words: string[]): string[] {
  const getFreq = (w: string): string => {
    const freq = new Array(26).fill(0);
    for (const c of w) freq[c.charCodeAt(0) - 97]++;
    return freq.join(",");
  };

  const result: string[] = [words[0]];
  let lastFreq = getFreq(words[0]);
  for (let i = 1; i < words.length; i++) {
    const freq = getFreq(words[i]);
    if (freq !== lastFreq) {
      result.push(words[i]);
      lastFreq = freq;
    }
  }
  return result;
}

/**
 * Solution 3: Functional one-liner (most concise)
 * Time: O(n * k log k), Space: O(n)
 * Note: compares each word with original previous — same result because
 * skipped words were anagrams of kept predecessor
 */
function removeAnagramsFunctional(words: string[]): string[] {
  const key = (w: string) => [...w].sort().join("");
  return words.filter((w, i) => i === 0 || key(w) !== key(words[i - 1]));
}

// === Test Cases ===
console.log(removeAnagrams(["abba", "baba", "bbaa", "cd", "cd"])); // ["abba","cd"]
console.log(removeAnagrams(["a", "b", "c", "d", "e"])); // ["a","b","c","d","e"]
console.log(removeAnagrams(["z", "yy", "x", "z"])); // ["z","yy","x","z"]
console.log(removeAnagrams(["foo"])); // ["foo"]
console.log(removeAnagrams(["abc", "bca", "cab"])); // ["abc"]
```

---

## 🔗 Related Problems

| Problem                                                                                                                                  | Pattern           | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Valid Anagram](https://leetcode.com/problems/valid-anagram)                                                                             | Counting Sort     | Easy       |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams)                                                                           | Hash Table + Sort | Medium     |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string)                                             | Sliding Window    | Medium     |
| [Minimum Number of Steps to Make Two Strings Anagram](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram) | Frequency Count   | Medium     |
| [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)                                                       | Greedy + Stack    | Medium     |
