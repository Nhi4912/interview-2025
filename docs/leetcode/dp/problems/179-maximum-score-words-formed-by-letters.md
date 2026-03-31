---
layout: page
title: "Maximum Score Words Formed by Letters"
difficulty: Hard
category: Dynamic Programming
tags: [Array, String, Dynamic Programming, Backtracking, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/maximum-score-words-formed-by-letters"
---

# Maximum Score Words Formed by Letters / Điểm Tối Đa Từ Được Tạo Từ Chữ Cái

🔴 Hard | Bitmask DP · Backtracking

---

## 🧠 Intuition

**EN:** At most 14 words → enumerate all `2^14` subsets. For each subset, check if total letter usage ≤ available letters, then sum up scores. Take the maximum.

**VI:** Tối đa 14 từ → duyệt hết `2^14` tập con. Mỗi tập con kiểm tra tổng chữ cái dùng ≤ chữ cái có sẵn, rồi cộng điểm. Lấy max.

```
words = ["dog","cat","dad","good"], letters = "aadddgoo", score=[...a=1,c=0,d=2,g=3,o=2...]

Subset 0b0111 = {dog, cat, dad}:
  d:3, o:1, g:1, c:1, a:1 → check against freq(letters)
  valid? → score = score(dog)+score(cat)+score(dad)

Subset 0b1001 = {dog, good}:
  d:1, o:3, g:2 → valid → higher score!

Enumerate all 2^14 subsets, track max valid score
```

---

## 📝 Interview Tips

- 🔑 **EN:** At most 14 words → 2^14 = 16384 subsets, tractable. Key flag: `words.length ≤ 14`. **VI:** Tối đa 14 từ → 2^14 = 16384 tập con, có thể duyệt hết.
- 🔑 **EN:** Precompute letter frequency of available letters and score per letter. **VI:** Tính trước tần suất chữ cái có sẵn và điểm mỗi chữ cái.
- 🔑 **EN:** For each subset: count required letters and compute score simultaneously. **VI:** Mỗi tập con: đếm chữ cái cần và tính điểm đồng thời.
- 🔑 **EN:** Early termination: if any letter count exceeds available, break. **VI:** Kết thúc sớm: nếu bất kỳ chữ cái nào vượt quá có sẵn, bỏ qua.
- 🔑 **EN:** Bitmask trick: iterate subsets in increasing bit count for cleaner pruning. **VI:** Mẹo bitmask: duyệt tập con theo số bit tăng dần để pruning hiệu quả hơn.
- 🔑 **EN:** Backtracking also works and can be more intuitive (choose/skip each word). **VI:** Backtracking cũng hoạt động và trực quan hơn (chọn/bỏ từng từ).

---

## 💡 Solutions

```typescript
/**
 * Bitmask enumeration over all word subsets
 * Time: O(2^W * (W*L + 26))  Space: O(W * 26)
 * where W=words count, L=avg word length
 */
function maxScoreWords(words: string[], letters: string[], score: number[]): number {
  const W = words.length;

  // Available letter frequencies
  const avail = new Array(26).fill(0);
  for (const c of letters) avail[c.charCodeAt(0) - 97]++;

  // Precompute letter counts and scores for each word
  const wordFreq: number[][] = words.map((w) => {
    const freq = new Array(26).fill(0);
    for (const c of w) freq[c.charCodeAt(0) - 97]++;
    return freq;
  });

  const wordScore: number[] = words.map((w) =>
    [...w].reduce((s, c) => s + score[c.charCodeAt(0) - 97], 0),
  );

  let best = 0;

  // Enumerate all 2^W subsets
  for (let mask = 1; mask < 1 << W; mask++) {
    const used = new Array(26).fill(0);
    let totalScore = 0;
    let valid = true;

    for (let i = 0; i < W; i++) {
      if (mask & (1 << i)) {
        totalScore += wordScore[i];
        for (let c = 0; c < 26; c++) {
          used[c] += wordFreq[i][c];
          if (used[c] > avail[c]) {
            valid = false;
            break;
          }
        }
        if (!valid) break;
      }
    }

    if (valid) best = Math.max(best, totalScore);
  }

  return best;
}

/**
 * Backtracking approach (choose/skip each word)
 * Time: O(2^W * W * L)  Space: O(26)
 */
function maxScoreWordsBacktrack(words: string[], letters: string[], score: number[]): number {
  const avail = new Array(26).fill(0);
  for (const c of letters) avail[c.charCodeAt(0) - 97]++;
  let best = 0;

  function bt(idx: number, used: number[], cur: number): void {
    best = Math.max(best, cur);
    if (idx === words.length) return;

    for (let i = idx; i < words.length; i++) {
      // Try adding words[i]
      const freq = new Array(26).fill(0);
      let gain = 0;
      let ok = true;
      for (const c of words[i]) {
        const ci = c.charCodeAt(0) - 97;
        freq[ci]++;
        gain += score[ci];
        if (used[ci] + freq[ci] > avail[ci]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        for (let c = 0; c < 26; c++) used[c] += freq[c];
        bt(i + 1, used, cur + gain);
        for (let c = 0; c < 26; c++) used[c] -= freq[c];
      }
    }
  }

  bt(0, new Array(26).fill(0), 0);
  return best;
}

// Tests
console.log(
  maxScoreWords(
    ["dog", "cat", "dad", "good"],
    ["a", "a", "c", "d", "d", "d", "g", "o", "o"],
    [1, 0, 9, 5, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ),
); // 23

console.log(
  maxScoreWords(
    ["xxxz", "ax", "bx", "cx"],
    ["z", "a", "b", "c", "x", "x", "x"],
    [4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 10],
  ),
); // 27
```

---

## 🔗 Related Problems

| Problem                                                                             | Difficulty | Pattern              |
| ----------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word/)     | 🔴 Hard    | Bitmask DP           |
| [Maximum AND Sum of Array](https://leetcode.com/problems/maximum-and-sum-of-array/) | 🔴 Hard    | Bitmask DP           |
| [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement/)       | 🟡 Medium  | Bitmask Backtracking |
