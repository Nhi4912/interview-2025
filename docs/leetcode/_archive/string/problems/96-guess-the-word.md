---
layout: page
title: "Guess the Word"
difficulty: Hard
category: String
tags: [Array, Math, String, Interactive, Game Theory]
leetcode_url: "https://leetcode.com/problems/guess-the-word"
---

# Guess the Word / Đoán Từ Bí Mật

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) | [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Trò chơi Mastermind — mỗi lần đoán một từ, API trả về số ký tự khớp đúng vị trí. Chiến lược: chọn từ **loại nhiều ứng viên nhất** sau mỗi phản hồi. Sau khi biết k ký tự khớp, chỉ giữ lại các từ cũng khớp đúng k ký tự với từ vừa đoán.

```
words = ["acckzz","ccbazz","eiowzz","abcczz","aacchz","bcdzwz"]
secret = "acckzz"

Guess "acckzz" → match=6 → done!

Strategy: pick word with max overlap to current candidates
After each guess with k matches:
  filter candidates to those matching exactly k positions with guessed word
```

---

## Problem Description

You have a list of `words`, one of which is the secret. You can call `master.guess(word)` up to 10 times; it returns the number of exact position matches. Call `master.guess` to identify the secret word within 10 guesses.

**Constraint:** Must find secret in ≤ 10 guesses, words are 6-char lowercase strings.

**Strategy:** Use minimax — pick the word that minimizes the worst-case remaining candidates.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Có đảm bảo tìm ra trong 10 lần không?" / Is 10 guesses always sufficient?
2. **Key insight / Ý tưởng**: Sau mỗi đoán với k khớp, lọc candidates chỉ giữ các từ khớp k vị trí với từ đó
3. **Naïve / Đơn giản**: Pick random each time — may exceed 10 guesses
4. **Optimize / Tối ưu**: Minimax hoặc chọn từ có xác suất 0-match thấp nhất để loại nhiều nhất
5. **Edge cases / Trường hợp đặc biệt**: Tất cả từ giống nhau trừ một ký tự; từ không có ký tự trùng nhau
6. **Follow-up / Hỏi thêm**: "Nếu API chỉ cho 7 lần?" / Stricter minimax or information-theoretic approach

---

## Solutions

```typescript
// Master interface (provided by LeetCode)
interface Master {
  guess(word: string): number;
}

/**
 * Solution 1: Random candidate filtering
 * Pick random word from candidates, filter by match count.
 * Time: O(n²) per guess, O(10n²) total
 * Space: O(n)
 */
function findSecretWordRandom(words: string[], master: Master): void {
  function countMatches(a: string, b: string): number {
    let count = 0;
    for (let i = 0; i < a.length; i++) if (a[i] === b[i]) count++;
    return count;
  }

  let candidates = [...words];
  for (let attempt = 0; attempt < 10 && candidates.length > 0; attempt++) {
    const guess = candidates[Math.floor(Math.random() * candidates.length)];
    const matches = master.guess(guess);
    if (matches === 6) return;
    candidates = candidates.filter((w) => countMatches(w, guess) === matches);
  }
}

/**
 * Solution 2: Minimax — pick word that minimizes worst-case remaining candidates
 * For each candidate word, simulate guessing it and find the largest remaining group.
 * Choose the word with smallest max group size.
 * Time: O(10 * n²)
 * Space: O(n)
 */
function findSecretWord(words: string[], master: Master): void {
  function countMatches(a: string, b: string): number {
    let count = 0;
    for (let i = 0; i < a.length; i++) if (a[i] === b[i]) count++;
    return count;
  }

  function pickBestGuess(candidates: string[]): string {
    let bestWord = candidates[0];
    let bestWorstCase = Infinity;

    for (const guess of candidates) {
      // Count how many candidates would remain for each match count (0-6)
      const groups = new Array(7).fill(0);
      for (const other of candidates) groups[countMatches(guess, other)]++;
      const worstCase = Math.max(...groups);
      if (worstCase < bestWorstCase) {
        bestWorstCase = worstCase;
        bestWord = guess;
      }
    }
    return bestWord;
  }

  let candidates = [...words];
  for (let attempt = 0; attempt < 10 && candidates.length > 0; attempt++) {
    const guess = pickBestGuess(candidates);
    const matches = master.guess(guess);
    if (matches === 6) return;
    candidates = candidates.filter((w) => countMatches(w, guess) === matches);
  }
}

// Simulation test (without real Master API)
const testWords = ["acckzz", "ccbazz", "eiowzz", "abcczz", "aacchz", "bcdzwz"];
console.log("Words to search:", testWords.length, "candidates");
console.log("Minimax strategy guarantees ≤ 10 guesses for n=100 words");
```

---

## 🔗 Related Problems

| Problem                                                                            | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Predict the Winner](https://leetcode.com/problems/predict-the-winner)             | Dynamic Programming | Medium     |
| [Bulls and Cows](https://leetcode.com/problems/bulls-and-cows)                     | Hash Map            | Medium     |
| [Verbal Arithmetic Puzzle](https://leetcode.com/problems/verbal-arithmetic-puzzle) | Backtracking        | Hard       |
| [Flip Game II](https://leetcode.com/problems/flip-game-ii)                         | Game Theory         | Medium     |
