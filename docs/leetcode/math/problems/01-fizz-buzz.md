---
layout: page
title: "Fizz Buzz"
difficulty: Easy
category: Math
tags: [Math, String, Simulation]
leetcode_url: "https://leetcode.com/problems/fizz-buzz/"
---

# Fizz Buzz / Fizz Buzz

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Modulo / Simulation
> **Frequency**: 📗 Tier 3 — Câu hỏi sàng lọc, thường dùng để test tư duy cơ bản
> **See also**: [Pow(x,n)](./02-pow-x-n.md) | [Count Primes](./02-count-primes.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Trò chơi đếm số của trẻ em — đứa trẻ đếm 1, 2, "Fizz" (chia hết 3), 4, "Buzz" (chia hết 5), "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz" (chia hết cả 3 lẫn 5). Thứ tự kiểm tra quan trọng: FizzBuzz trước, rồi mới Fizz, Buzz.

**Pattern Recognition:**

- Signal: map numbers to strings with divisibility rules → **modulo check + string concat**
- Kiểm tra `% 15 === 0` (hoặc cả `% 3 && % 5`) trước để tránh miss FizzBuzz
- Cách scalable: dùng string concat (`"" + fizz + buzz`) — dễ thêm rule mới (e.g. "Jazz" cho 7)

**Visual — n=15:**

```
i:  1   2   3   4   5   6   7   8   9  10  11  12  13  14  15
%3: .   .   0   .   .   0   .   .   0   .   .   0   .   .   0
%5: .   .   .   .   0   .   .   .   .   0   .   .   .   .   0
→:  1   2   F   4   B   F   7   8   F   B  11   F  13  14  FB

Pattern repeats every LCM(3,5) = 15 numbers
```

---

## Problem Description

Given integer `n`, return string array where:

- `"FizzBuzz"` if divisible by both 3 and 5
- `"Fizz"` if divisible by 3
- `"Buzz"` if divisible by 5
- `String(i)` otherwise

```
Example 1: n=3  → ["1","2","Fizz"]
Example 2: n=5  → ["1","2","Fizz","4","Buzz"]
Example 3: n=15 → ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
```

---

## 📝 Interview Tips

1. **Đừng dùng `% 15`** rồi hardcode — interviewer muốn logic tổng quát
2. **String concat approach** tốt hơn if-else: dễ thêm "Jazz" cho 7 mà không cần rewrite
3. **Scalable design**: show `Map<divisor, word>` pattern nếu interviewer hỏi "extensible"
4. **Đây là câu sàng lọc** — sai thứ tự check (Fizz/Buzz trước FizzBuzz) là fail ngay
5. **1-indexed**: output là 1..n, không phải 0..n-1 — đừng nhầm index
6. **Constraints**: n có thể tới 10^4, O(n) là đủ — không cần tối ưu thêm

---

## Solutions

{% raw %}
/\*\*

- Solution 1: Simple If-Else (Most Readable)
- Time O(n), Space O(n) for output
- Check FizzBuzz first to avoid missing combined case.
  \*/
  function fizzBuzzSimple(n: number): string[] {
  const result: string[] = [];
  for (let i = 1; i <= n; i++) {
  if (i % 15 === 0) result.push("FizzBuzz");
  else if (i % 3 === 0) result.push("Fizz");
  else if (i % 5 === 0) result.push("Buzz");
  else result.push(String(i));
  }
  return result;
  }

/\*\*

- Solution 2: String Concatenation (Scalable / Optimal)
- Time O(n), Space O(n)
-
- Advantage: adding a new rule (e.g. 7→"Jazz") only needs
- one extra line — no restructuring of if-else chain needed.
  \*/
  function fizzBuzz(n: number): string[] {
  const result: string[] = [];
  for (let i = 1; i <= n; i++) {
  let token = "";
  if (i % 3 === 0) token += "Fizz";
  if (i % 5 === 0) token += "Buzz";
  result.push(token || String(i));
  }
  return result;
  }

// --- Quick inline tests ---
console.log(JSON.stringify(fizzBuzz(3)) === '["1","2","Fizz"]'); // true
console.log(JSON.stringify(fizzBuzz(5)) === '["1","2","Fizz","4","Buzz"]'); // true
console.log(fizzBuzz(15)[14] === "FizzBuzz"); // true
console.log(fizzBuzz(1)[0] === "1"); // true
{% endraw %}

---

## 🔗 Related Problems

| Problem                                                                                                              | Relationship                |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| [412. Fizz Buzz](https://leetcode.com/problems/fizz-buzz/)                                                           | This problem                |
| [204. Count Primes](https://leetcode.com/problems/count-primes/)                                                     | Modulo / divisibility logic |
| [1342. Number of Steps to Reduce to Zero](https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/) | Modulo + division iteration |
| [507. Perfect Number](https://leetcode.com/problems/perfect-number/)                                                 | Divisibility checks         |
| [2413. Smallest Even Multiple](https://leetcode.com/problems/smallest-even-multiple/)                                | LCM / modulo pattern        |
