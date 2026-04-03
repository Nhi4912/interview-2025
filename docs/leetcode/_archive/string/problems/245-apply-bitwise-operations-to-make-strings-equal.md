---
layout: page
title: "Apply Bitwise Operations to Make Strings Equal"
difficulty: Medium
category: String
tags: [String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/apply-bitwise-operations-to-make-strings-equal"
---

# Apply Bitwise Operations to Make Strings Equal / Áp Dụng Phép Bit Để Hai Chuỗi Bằng Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Add Binary](https://leetcode.com/problems/add-binary) | [Palindrome Permutation](https://leetcode.com/problems/palindrome-permutation)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Tưởng tượng bạn có một phòng với n bóng đèn (0=tắt, 1=sáng). Nếu phòng tối hoàn toàn (toàn số 0), không có phép nào có thể tạo ra ánh sáng — OR/AND/XOR trên (0,0) luôn cho 0. Nhưng nếu có ít nhất một bóng đang sáng, bạn có thể lan truyền ánh sáng đến bất kỳ bóng nào bằng OR, rồi dùng XOR để tắt những bóng không cần.

**Pattern Recognition:**

- Signal: "binary string" + "symmetric OR/AND/XOR on two positions" → **Bit Manipulation / Invariant**
- Key insight: Phép (0,0)→(0,0) với mọi phép toán. Nếu s không có '1' thì không thể tạo '1'. Chỉ cần kiểm tra xem cả hai chuỗi có cùng trạng thái "có chứa '1'" hay không.

**Visual — s="010", t="110":**

```
s="010" → has '1'? YES
t="110" → has '1'? YES  → same presence → CAN transform ✓

Proof: idx 0,1: s[0]=0, s[1]=1
  OR op: s[0] = 0|1=1, s[1] = 0|1=1 → s="110" = t ✓

s="000" → has '1'? NO
t="111" → has '1'? YES  → different → CANNOT transform ✗
(no operation on all-zeros can produce a 1)

Rule: s → t iff s.includes('1') === t.includes('1')
```

---

## 📝 Problem Description

Given two binary strings `s` and `t` of equal length, you may pick any `i ≠ j` and apply one operation (both positions update symmetrically): OR, AND, or XOR. Return `true` if `s` can be made equal to `t`.

- **Example 1:** s="010", t="110" → `true`
- **Example 2:** s="011", t="001" → `true`

Constraints: `1 ≤ n ≤ 10^5`, strings contain only '0' and '1'.

---

## 🎯 Interview Tips

1. **Find the invariant** / Tìm bất biến: OR/AND/XOR on (0,0) always gives 0 — zeros can't generate ones.
2. **One '1' is enough** / Một '1' là đủ: A single '1' can spread everywhere via OR operations.
3. **Two '1's can cancel** / Hai '1' có thể triệt tiêu: XOR(1,1)=(0,0) — we can remove ones too.
4. **Edge: s==t** / Trường hợp s==t: Always true, covered by the same-presence check.
5. **O(n) scan** / Quét O(n): `includes('1')` or a simple loop — no complex logic needed.
6. **Communicate the insight** / Trình bày insight: Tell the interviewer the invariant before coding.

---

## 💡 Solutions

### Approach 1: Linear Scan — Count Ones

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function makeStringsEqualScan(s: string, t: string): boolean {
  let sOnes = 0,
    tOnes = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "1") sOnes++;
    if (t[i] === "1") tOnes++;
  }
  // Both all-zeros, or both have at least one '1'
  return (sOnes === 0) === (tOnes === 0);
}
```

### Approach 2: One-Liner — String Includes (Optimal)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function makeStringsEqual(s: string, t: string): boolean {
  // Key insight: the only invariant is whether '1' is present.
  // All-zero is a "black hole" — no op creates a 1 from (0,0).
  // If both have '1': freely rearrange via OR/XOR. Equal → true.
  // If neither has '1': s=t="000...0". Already equal → true.
  // Mixed: impossible → false.
  return s.includes("1") === t.includes("1");
}
```

---

## 🧪 Test Cases

```typescript
console.log(makeStringsEqual("010", "110")); // → true
console.log(makeStringsEqual("0101", "0000")); // → false
console.log(makeStringsEqual("000", "000")); // → true
console.log(makeStringsEqual("111", "000")); // → false
console.log(makeStringsEqual("1", "1")); // → true
```

---

## 🔗 Related Problems

| Problem                                                                        | Difficulty | Pattern          |
| ------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Add Binary](https://leetcode.com/problems/add-binary)                         | Easy       | Bit Manipulation |
| [Palindrome Permutation](https://leetcode.com/problems/palindrome-permutation) | Easy       | Bit Manipulation |
| [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) | Medium     | Sliding Window   |
| [IP to CIDR](https://leetcode.com/problems/ip-to-cidr)                         | Medium     | Bit Manipulation |
