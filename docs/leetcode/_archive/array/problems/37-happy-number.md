---
layout: page
title: "Happy Number"
difficulty: Easy
category: Array
tags: [Hash Table, Math, Two Pointers]
leetcode_url: "https://leetcode.com/problems/happy-number"
---

# Happy Number / Số Hạnh Phúc

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Floyd's Cycle Detection / HashSet
> **Frequency**: 📘 Tier 3 — Gặp ở 17 companies
> **See also**: [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle) | [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Tưởng tượng một cái vòng quay ở hội chợ — nếu bạn đi mãi mà quay lại điểm cũ, bạn đang trong vòng lặp vô hạn (không hạnh phúc). Nếu bạn đến được đích (số 1), bạn dừng lại (hạnh phúc). Thuật toán Floyd dùng hai người đi: một đi chậm (mỗi bước 1), một đi nhanh (mỗi bước 2). Nếu có vòng lặp, họ SẼ gặp nhau; nếu đến số 1, họ dừng.

**Pattern Recognition:**

- Signal: "repeated process" + "detect cycle or termination" → **HashSet** hoặc **Floyd's Cycle Detection**
- `getNext(n)` = sum of squares of digits: deterministic function → có thể tạo cycle
- HashSet: đơn giản hơn, O(log n) space. Floyd: O(1) space nhưng phức tạp hơn

**Visual — n = 19:**

```
19 → 1²+9² = 1+81 = 82
82 → 8²+2² = 64+4 = 68
68 → 6²+8² = 36+64 = 100
100 → 1²+0²+0² = 1  ← HAPPY! ✅

n = 2 (unhappy, enters cycle):
2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 (CYCLE!)
                                              ↑___________↓

Floyd: slow=2→4, fast=2→16
       slow=4→16→37, fast=16→58→42
       ... eventually slow==fast → cycle detected → not happy
```

---

## Problem Description

Write an algorithm to determine if a number `n` is a "happy number": repeatedly replace `n` with the sum of squares of its digits. If this process ends at `1`, it's happy. If it loops endlessly (never reaching `1`), it's not. ([LeetCode 202](https://leetcode.com/problems/happy-number))

```
Input: n = 19  → Output: true
  19 → 82 → 68 → 100 → 1 ✅

Input: n = 2   → Output: false
  2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 (cycle) ❌
```

Constraints: `1 <= n <= 2³¹ - 1`

---

## 📝 Interview Tips

1. **Clarify**: "Khi nào dừng? Khi đến 1 (happy) hoặc khi lặp lại số đã thấy (not happy)" / Stop at 1 or when a number repeats
2. **HashSet approach**: "Lưu mọi số đã thấy vào Set — nếu thấy lại → cycle → return false" / Store seen numbers, duplicate = cycle
3. **Floyd's insight**: "Áp dụng tortoise-and-hare cho sequence các số — không cần extra space" / Apply cycle detection to number sequence
4. **getNext function**: "Tách từng chữ số: `n % 10` lấy chữ số cuối, `n = Math.floor(n/10)` loại bỏ nó" / Extract digits with modulo
5. **Why it terminates**: "Mọi số > 243 giảm về số < 243 sau 1 bước (max 3 chữ số × 81)" / Numbers >243 always decrease
6. **Edge case**: "n=1 → happy ngay lập tức" / n=1 is immediately happy

---

## Solutions

```typescript
/** Helper: compute sum of squares of digits */
function getSumOfSquares(n: number): number {
  let sum = 0;
  while (n > 0) {
    const digit = n % 10;
    sum += digit * digit;
    n = Math.floor(n / 10);
  }
  return sum;
}

/**
 * Solution 1: HashSet to Detect Cycle
 * Name: HashSet Cycle Detection
 * Time: O(log n) — numbers quickly reduce; bounded iterations
 * Space: O(log n) — set stores seen values
 */
function isHappyHashSet(n: number): boolean {
  const seen = new Set<number>();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = getSumOfSquares(n);
  }
  return n === 1;
}

/**
 * Solution 2: Floyd's Cycle Detection — Tortoise and Hare (Optimal)
 * Name: Floyd's Cycle Detection
 * Time: O(log n) — same bounded iterations
 * Space: O(1) — only two pointer variables
 */
function isHappy(n: number): boolean {
  let slow = n;
  let fast = getSumOfSquares(n); // fast starts one step ahead

  while (fast !== 1 && slow !== fast) {
    slow = getSumOfSquares(slow); // one step
    fast = getSumOfSquares(getSumOfSquares(fast)); // two steps
  }

  return fast === 1; // if fast reached 1, it's happy
}

/**
 * Solution 3: Known Cycle Shortcut
 * Name: Hardcoded Unhappy Cycle
 * Time: O(log n)
 * Space: O(1)
 * Note: Any unhappy number eventually reaches 4, which loops: 4→16→37→58→89→145→42→20→4
 */
function isHappyShortcut(n: number): boolean {
  while (n !== 1 && n !== 4) {
    n = getSumOfSquares(n);
  }
  return n === 1;
}

// === Test Cases ===
console.log(isHappy(19)); // true  (19→82→68→100→1)
console.log(isHappy(2)); // false (enters cycle through 4)
console.log(isHappy(1)); // true  (already 1)
console.log(isHappy(7)); // true  (7→49→97→130→10→1)
console.log(isHappyHashSet(100)); // true
console.log(isHappyShortcut(4)); // false (4 is the cycle anchor)
```

---

## 🔗 Related Problems

| Problem | Relationship |
|---|---|
| [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle) | Floyd's cycle detection on actual linked list |
| [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) | Cycle detection via fast/slow pointers on array values |
| [Add Digits](https://leetcode.com/problems/add-digits) | Repeated digit sum — math formula (digital root) |
| [Ugly Number](https://leetcode.com/problems/ugly-number) | Similar number classification via repeated operations |
| [Palindrome Number](https://leetcode.com/problems/palindrome-number) | Digit extraction using modulo — same technique |
