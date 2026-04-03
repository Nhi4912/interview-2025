---
layout: page
title: "Restore IP Addresses"
difficulty: Medium
category: Backtracking
tags: [String, Backtracking]
leetcode_url: "https://leetcode.com/problems/restore-ip-addresses/"
---

# Restore IP Addresses / Khôi Phục Địa Chỉ IP

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Constrained Backtracking (4 segments)
> **Frequency**: 📘 Tier 2 — String backtracking with validation; common at Amazon, Microsoft
> **See also**: [Palindrome Partitioning](./10-palindrome-partitioning.md) | [Word Search II](./09-word-search-ii.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như đọc một dãy số điện thoại quốc tế không có dấu chấm và bạn phải đoán tất cả cách đặt đúng 3 dấu chấm để tạo thành địa chỉ IP hợp lệ. Mỗi phần chỉ có thể là 1, 2, hoặc 3 chữ số; không được bắt đầu bằng 0 (trừ "0"); giá trị từ 0-255. Chỉ có thể đặt ở những vị trí thoả mãn tất cả điều kiện.

- **Pattern Recognition:**
  - Signal: chia chuỗi số thành đúng 4 phần với ràng buộc → constrained backtracking
  - Pruning: nếu chữ số còn lại `< parts_left` hoặc `> parts_left * 3` → dừng ngay
  - Thử length 1, 2, 3 cho mỗi segment; validate trước khi đệ quy

- **Visual — s = "25525511135":**

```
backtrack(idx=0, parts=[]):
  seg="2" valid → backtrack(1, ["2"])
    seg="5" → backtrack(2, ["2","5"])
      seg="5" → ... → eventually: "2.5.5.25511135" ✗ (too long last seg)
    seg="55" → ...
    seg="255" → backtrack(4, ["2","255"])  — wait, only 1 seg

  Actually trying seg="255":
  backtrack(3, ["255"])
    seg="255" valid → backtrack(6, ["255","255"])
      seg="1" → backtrack(7, ["255","255","1"])
        seg="1" → backtrack(8, ["255","255","1","1"])  ← 4 parts but idx=8≠11 ✗
        seg="11" → idx=9, "35"→ backtrack(9,…,"11")
          seg="3" → 4 parts, idx=10≠11 ✗
          seg="35" → 4 parts, idx=11==11 ✓ → "255.255.11.135" Wait:
      seg="11" → backtrack(8, ["255","255","11"])
        seg="1" → idx=9, still 1 seg left with "35" remaining ✗
        seg="13" → 255 ✗  seg="135" → 4 parts, idx=11 ✓ → "255.255.11.135" ✓
      seg="111" → backtrack(9, ["255","255","111"])
        seg="35" valid → 4 parts, idx=11 ✓ → "255.255.111.35" ✓

Result: ["255.255.11.135","255.255.111.35"]
```

## Problem Description

Insert dots into digit string `s` to form all valid IPv4 addresses. Cannot reorder or remove digits.

```
s = "25525511135"  → ["255.255.11.135","255.255.111.35"]
s = "0000"         → ["0.0.0.0"]
s = "101023"       → ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
```

## 📝 Interview Tips

1. **Pruning quan trọng: `digitsLeft < remaining || digitsLeft > remaining*3` → return ngay / Key pruning: too few or too many digits left for remaining segments**
2. **Leading zero: "0" hợp lệ, "01" và "001" không hợp lệ / Leading zeros: "0" ok, "01"/"001" invalid**
3. **Giới hạn length chuỗi: 4 ≤ s.length ≤ 12 → ngoài khoảng này return ngay / Valid length: 4-12 digits; return early otherwise**
4. **Iterative 3-loop: i, j, k chia chuỗi thành 4 đoạn — dễ viết, cũng O(1) do tất cả hữu hạn / 3 nested loops: explicit, also O(1) since at most 3×3×3=27 combinations**
5. **Tổng số IP hợp lệ tối đa rất nhỏ (~27 combinations) → backtracking không bao giờ TLE / At most 3^3=27 possible splits, so always fast**

## Solutions

```typescript
/**

- Solution 1 — Three Nested Loops (Iterative)
- Explicitly place 3 dots; O(1) since inputs are bounded
- Time: O(1) — at most 3×3×3=27 dot placements | Space: O(1)
  */
  function restoreIpAddressesIter(s: string): string[] {
  const n = s.length;
  if (n < 4 || n > 12) return [];
  const result: string[] = [];

function valid(seg: string): boolean {
if (seg.length > 3 || seg.length === 0) return false;
if (seg.length > 1 && seg[0] === '0') return false;
return parseInt(seg) <= 255;
}

for (let i = 1; i <= 3 && i < n; i++) {
for (let j = i + 1; j <= i + 3 && j < n; j++) {
for (let k = j + 1; k <= j + 3 && k < n; k++) {
const [a, b, c, d] = [s.slice(0,i), s.slice(i,j), s.slice(j,k), s.slice(k)];
if (valid(a) && valid(b) && valid(c) && valid(d)) {
result.push(`${a}.${b}.${c}.${d}`);
}
}
}
}

return result;
}

/**

- Solution 2 — Backtracking with Pruning ✅ Recommended
- More general; demonstrates the backtracking pattern clearly
- Time: O(3^4) = O(81) | Space: O(4) recursion depth
  */
  function restoreIpAddresses(s: string): string[] {
  const n = s.length;
  if (n < 4 || n > 12) return [];
  const result: string[] = [];

function isValid(seg: string): boolean {
if (seg.length > 1 && seg[0] === '0') return false;
return seg.length <= 3 && parseInt(seg) <= 255;
}

function backtrack(idx: number, parts: string[]): void {
const digitsLeft = n - idx;
const remaining = 4 - parts.length;

    // Pruning: not enough or too many digits for remaining segments
    if (digitsLeft < remaining || digitsLeft > remaining * 3) return;

    if (parts.length === 4) {
      result.push(parts.join('.'));
      return;
    }

    for (let len = 1; len <= 3 && idx + len <= n; len++) {
      const seg = s.slice(idx, idx + len);
      if (isValid(seg)) {
        parts.push(seg);
        backtrack(idx + len, parts);
        parts.pop();
      }
    }

}

backtrack(0, []);
return result;
}

// ── inline tests ──
// restoreIpAddresses("25525511135") → ["255.255.11.135","255.255.111.35"]
// restoreIpAddresses("0000") → ["0.0.0.0"]
// restoreIpAddresses("101023") → ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
// restoreIpAddresses("123") → [] (too short)
```

## 🔗 Related Problems

- [LC #131 Palindrome Partitioning](./10-palindrome-partitioning.md) — partition with palindrome constraint
- [LC #17 Letter Combinations of Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) — fixed-depth backtracking
- [LC #22 Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) — constrained string generation
- [LC #468 Validate IP Address](https://leetcode.com/problems/validate-ip-address/) — validation only (no generation)
