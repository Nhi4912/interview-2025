---
layout: page
title: "Remove K Digits"
difficulty: Medium
category: String
tags: [String, Stack, Greedy, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/remove-k-digits"
---

# Remove K Digits / Xóa K Chữ Số Để Tạo Số Nhỏ Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack (Greedy)
> **Frequency**: 📗 Tier 2 — Gặp ở 20+ companies (Amazon, Google)
> **See also**: [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters) | [Create Maximum Number](https://leetcode.com/problems/create-maximum-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xóa chữ số gây "đột biến tăng" — giống như làm phẳng dãy núi: nếu núi trước cao hơn núi sau, hãy xóa núi trước để dãy dốc xuống đều (tăng đơn điệu = nhỏ nhất).

**Pattern Recognition:**

- Signal: "minimum number after removing k digits" → **Monotonic Stack tăng dần**
- Greedy: xóa chữ số lớn hơn chữ số kế tiếp — luôn tối ưu
- Sau khi xóa đủ k: nếu còn dư thì cắt đuôi; strip leading zeros

**Visual — `num="1432219", k=3`:**

```
Build increasing monotone stack:
  '1' → [1]
  '4' → [1, 4]
  '3' → 3<4, pop 4 (k=2), push 3 → [1, 3]
  '2' → 2<3, pop 3 (k=1), push 2 → [1, 2]
  '2' → equal, push     → [1, 2, 2]
  '1' → 1<2, pop 2 (k=0), STOP  → [1, 2, 1]  (k=0, no more pops)
  '9' → push             → [1, 2, 1, 9]

Result: "1219"  ✅
```

---

## Problem Description

Given a non-negative integer string `num` and integer `k`, remove exactly `k` digits to produce the smallest possible number. Return the result as a string with no leading zeros (return `"0"` if the result is empty). ([LeetCode 402](https://leetcode.com/problems/remove-k-digits))

**Example 1:** `num="1432219", k=3` → `"1219"`
**Example 2:** `num="10200", k=1` → `"200"` (remove 1, strip leading zero)
**Example 3:** `num="10", k=2` → `"0"` (all digits removed)

**Constraints:** `1 ≤ num.length ≤ 10⁵`, `0 ≤ k ≤ num.length`, no leading zeros in input

---

## 📝 Interview Tips

1. **Clarify**: "num có thể là '0' không? k có thể bằng num.length?" / Can num be "0"? k equal to length?
2. **Key greedy**: "Xóa chữ số lớn hơn chữ số kế tiếp — đây là lựa chọn tối ưu" / Removing a digit larger than its successor is always optimal
3. **Monotone stack**: "Stack tăng → pop khi gặp nhỏ hơn top và k > 0" / Maintain increasing stack, pop when current < top
4. **Leftover k**: "Nếu k > 0 sau khi duyệt hết → cắt k chữ số cuối" / If k > 0 after full scan, trim last k from stack
5. **Leading zeros**: "Kết quả có thể có leading zeros sau khi xóa — cần strip" / Leading zeros appear after removal, must strip
6. **Follow-up**: "Tạo số lớn nhất → dùng monotone stack giảm dần" / Maximum number uses decreasing monotone stack

---

## Solutions

```typescript
/**
 * Solution 1: Monotonic Stack (Optimal Greedy)
 * Build an increasing stack: pop larger digits when a smaller arrives (while k > 0).
 * After full scan, trim remaining k digits from tail. Strip leading zeros.
 * Time: O(n) — each digit pushed and popped at most once
 * Space: O(n) — stack holds at most n digits
 */
function removeKdigits(num: string, k: number): string {
  const stack: string[] = [];

  for (const digit of num) {
    // Pop digits larger than current while we still have removals left
    while (k > 0 && stack.length > 0 && stack[stack.length - 1] > digit) {
      stack.pop();
      k--;
    }
    stack.push(digit);
  }

  // Still have removals left → trim from the end (stack is now non-decreasing)
  while (k > 0) {
    stack.pop();
    k--;
  }

  // Strip leading zeros
  let start = 0;
  while (start < stack.length - 1 && stack[start] === "0") start++;

  const result = stack.slice(start).join("");
  return result === "" ? "0" : result;
}

/**
 * Solution 2: Greedy — find and remove leftmost "peak" each round
 * In each of k rounds, scan left-to-right and remove the first digit
 * that is greater than the digit after it (i.e., breaks monotone increase).
 * Simple but O(n×k) — fine for small inputs, TLEs on large.
 * Time: O(n × k) — k passes, each O(n)
 * Space: O(n) — string slicing per round
 */
function removeKdigitsGreedy(num: string, k: number): string {
  let s = num;
  for (let i = 0; i < k; i++) {
    let removed = false;
    for (let j = 0; j < s.length - 1; j++) {
      if (s[j] > s[j + 1]) {
        s = s.slice(0, j) + s.slice(j + 1);
        removed = true;
        break;
      }
    }
    // All digits non-decreasing → remove from the end
    if (!removed) s = s.slice(0, s.length - 1);
  }
  const trimmed = s.replace(/^0+/, "");
  return trimmed === "" ? "0" : trimmed;
}

// === Test Cases ===
console.log(removeKdigits("1432219", 3)); // "1219"
console.log(removeKdigits("10200", 1)); // "200"
console.log(removeKdigits("10", 2)); // "0"
console.log(removeKdigits("9", 1)); // "0"
console.log(removeKdigits("112", 1)); // "11"
console.log(removeKdigitsGreedy("1432219", 3)); // "1219"
console.log(removeKdigitsGreedy("10200", 1)); // "200"
```

---

## 🔗 Related Problems

| Problem                                                                                        | Pattern               | Difficulty |
| ---------------------------------------------------------------------------------------------- | --------------------- | ---------- |
| [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)             | Monotonic stack + set | 🟡 Medium  |
| [Create Maximum Number](https://leetcode.com/problems/create-maximum-number)                   | Monotonic stack max   | 🔴 Hard    |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | Monotonic stack       | 🔴 Hard    |
| [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums)             | Monotonic stack       | 🟡 Medium  |
