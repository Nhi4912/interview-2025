---
layout: page
title: "Validate IP Address"
difficulty: Medium
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/validate-ip-address"
---

# Validate IP Address / Validate IP Address

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xử lý chuỗi ký tự — thường dùng hash table, two pointers, hoặc sliding window tuỳ bài toán.

**Pattern Recognition:**

- Signal: "string transformation/validation" → **String Processing**
- Bài này thuộc dạng String Processing — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Validate IP Address example:**

```
// TODO: Add step-by-step visual for String Processing
// Show one complete example with state at each step
```

---

## Problem Description

Validate IP Address. ([LeetCode](https://leetcode.com/problems/validate-ip-address))

Difficulty: Medium | Acceptance: 27.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/validate-ip-address) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer
2. **Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize
3. **Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it
4. **Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values
5. **Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function validateIpAddressBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — String Processing
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function validateIpAddress(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using String Processing
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(validateIpAddress(/* example 1 */)); // expected
// console.log(validateIpAddress(/* example 2 */)); // expected
// console.log(validateIpAddress(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Text Justification](https://leetcode.com/problems/text-justification) — same pattern: Matrix / Simulation
- [Decode String](https://leetcode.com/problems/decode-string) — same pattern: Stack
- [Simplify Path](https://leetcode.com/problems/simplify-path) — same pattern: Stack
- [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — same pattern: Binary Search
- [Validate IP Address — LeetCode](https://leetcode.com/problems/validate-ip-address) — problem page
