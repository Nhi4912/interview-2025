---
layout: page
title: "Bag of Tokens"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/bag-of-tokens"
---

# Bag of Tokens / Túi Thẻ Bài

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: ⭐ Tier 2 — Hay gặp ở Google, Meta
> **See also**: [Two Sum Less Than K](https://leetcode.com/problems/two-sum-less-than-k) | [Boats to Save People](https://leetcode.com/problems/boats-to-save-people)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn chơi game thẻ bài: mỗi thẻ có giá. Có hai hành động — "mua điểm" (trả power, nhận 1 điểm) hoặc "bán điểm" (nhận power, trả 1 điểm). Chiến lược tham lam: mua điểm với thẻ rẻ nhất, bán điểm với thẻ đắt nhất. Sort rồi dùng hai con trỏ — `lo` (rẻ nhất) và `hi` (đắt nhất).

**Pattern Recognition:**

- Signal: "maximize score" + "power/score trade-off" → **Sort + Two Pointers greedy**
- Sort trước → thẻ nhỏ nhất ở lo, lớn nhất ở hi
- Mua thẻ rẻ (lo++) để lấy điểm; bán thẻ đắt nhất (hi--) khi thiếu power

**Visual — tokens=[100,200,300,400], power=200:**

```
Sort: [100, 200, 300, 400]  lo=0 hi=3 score=0 max=0 power=200

Step 1: power(200)>=tokens[0](100) -> buy, power=100, score=1, max=1, lo=1
Step 2: power(100)<tokens[1](200), score=1 -> sell hi, power=500, score=0, hi=2
Step 3: power(500)>=tokens[1](200) -> buy, power=300, score=1, max=1, lo=2
Step 4: power(300)>=tokens[2](300) -> buy, power=0, score=2, max=2, lo=3
lo>hi -> return 2
```

---

## Problem Description

You have tokens and power. Play face-up: spend tokens[i] power to gain 1 score. Play face-down: spend 1 score to gain tokens[i] power. Return maximum score achievable.

```
Example 1: tokens=[100], power=50              -> 0
Example 2: tokens=[100,200], power=150         -> 1
Example 3: tokens=[100,200,300,400], power=200 -> 2
```

---

## 📝 Interview Tips

1. **Sort là bắt buộc**: Không có thứ tự mặc định, phải sort để greedy đúng
2. **Khi nào bán?** Chỉ khi không đủ power VÀ còn điểm để bán
3. **Khi nào dừng?** lo > hi — không còn thẻ nào
4. **Track maxScore riêng**: Score có thể giảm khi bán, cần track max separately
5. **Hỏi follow-up**: "Nếu mỗi thẻ dùng được k lần?" → logic thay đổi
6. **Complexity**: Time O(n log n), Space O(1)

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Two Pointers Greedy (Optimal)
 * Time O(n log n), Space O(1)
 *
 * Greedy: always buy cheapest (lo), sell most expensive (hi).
 * Track maxScore — score may dip when selling, track max separately.
 */
function bagOfTokens(tokens: number[], power: number): number {
  tokens.sort((a, b) => a - b);
  let lo = 0, hi = tokens.length - 1;
  let score = 0, maxScore = 0;

  while (lo <= hi) {
    if (power >= tokens[lo]) {
      power -= tokens[lo++];
      score++;
      maxScore = Math.max(maxScore, score);
    } else if (score > 0) {
      power += tokens[hi--];
      score--;
    } else {
      break;
    }
  }
  return maxScore;
}

/**
 * Solution 2: Same greedy, slightly different termination guard
 * Time O(n log n), Space O(1)
 */
function bagOfTokens2(tokens: number[], power: number): number {
  tokens.sort((a, b) => a - b);
  let lo = 0, hi = tokens.length - 1, score = 0, best = 0;

  while (lo <= hi) {
    if (power >= tokens[lo]) {
      power -= tokens[lo++];
      best = Math.max(best, ++score);
    } else if (lo < hi && score > 0) {
      power += tokens[hi--];
      score--;
    } else {
      break;
    }
  }
  return best;
}

// --- Quick inline tests ---
console.log(bagOfTokens([100], 50));                    // 0
console.log(bagOfTokens([100, 200], 150));              // 1
console.log(bagOfTokens([100, 200, 300, 400], 200));    // 2
console.log(bagOfTokens([71, 55, 82], 54));             // 0
console.log(bagOfTokens2([100, 200, 300, 400], 200));   // 2
console.log(bagOfTokens2([], 100));                     // 0
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [948. Bag of Tokens](https://leetcode.com/problems/bag-of-tokens/) | This problem |
| [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Two pointers greedy |
| [881. Boats to Save People](https://leetcode.com/problems/boats-to-save-people/) | Sort + two pointer pairing |
| [1877. Minimize Maximum Pair Sum in Array](https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/) | Sort + pairing greedy |
| [2410. Maximum Matching of Players With Trainers](https://leetcode.com/problems/maximum-matching-of-players-with-trainers/) | Greedy matching after sort |
