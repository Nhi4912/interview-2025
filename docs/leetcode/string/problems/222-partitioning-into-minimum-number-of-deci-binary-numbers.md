---
layout: page
title: "Partitioning Into Minimum Number Of Deci-Binary Numbers"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/partitioning-into-minimum-number-of-deci-binary-numbers"
---

# Partitioning Into Minimum Number Of Deci-Binary Numbers / Phân Chia Thành Số Lượng Tối Thiểu Số Deci-Binary

---

## 🧠 Intuition / Tư Duy

**Analogy:** Số deci-binary là số nguyên không âm chỉ chứa các chữ số 0 và 1 (không có leading zeros). Cho chuỗi `n` là số nguyên dương, tìm số lượng tối thiểu số deci-binary cần cộng lại để được `n`.

**Ví dụ:** `n = "32"` → cần ít nhất `3` số (`11 + 11 + 10 = 32`).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Partitioning Into Minimum Number Of Deci-Binary Numbers example:**

```
n = "82213"
Columns: [8, 2, 2, 1, 3]
Each deci-binary adds at most 1 to each column.
Max digit = 8 → need 8 numbers

Round 1: 1 1 1 1 1
Round 2: 1 1 1 0 1
Round 3: 1 0 0 0 1
...
Round 8: 1 0 0 0 0
         ─────────
         8 2 2 1 3 ✓
Answer = max digit = 8
```

---

## Problem Description

- **Deci-binary number**: số nguyên dương chỉ dùng chữ số `0` và `1`.
- Cho chuỗi `n` biểu diễn số nguyên dương, trả về số lượng tối thiểu số deci-binary cần tổng để bằng `n`.

**Constraints:** `1 <= n.length <= 10^5`, `n` không có leading zeros, chỉ chứa chữ số.

---

## 📝 Interview Tips

1. **Insight chính** — mỗi số deci-binary đóng góp tối đa `1` vào mỗi vị trí chữ số.
2. **Tham lam** — chữ số lớn nhất trong `n` chính là số lượng tối thiểu.
3. **Không cần xây dựng số** — chỉ cần `Math.max` của các chữ số.
4. **Tại sao max?** — vị trí có chữ số `d` cần đúng `d` số deci-binary đóng góp `1` vào đó.
5. **One-liner** — `+Math.max(...n.split('').map(Number))` đủ để pass.
6. **String vs Number** — so sánh ký tự `'9'` > `'0'` cũng work vì ASCII ordering.

---

## Solutions

```typescript
function minPartitions(n: string): number {
  // The answer is simply the maximum digit in n
  // Each position with digit d requires exactly d deci-binary numbers
  let maxDigit = 0;
  for (const ch of n) {
    const digit = ch.charCodeAt(0) - 48; // '0'.charCodeAt(0) = 48
    if (digit > maxDigit) maxDigit = digit;
    if (maxDigit === 9) break; // Can't get higher, early exit
  }
  return maxDigit;
}

// Test cases
console.log(minPartitions("32")); // 3
console.log(minPartitions("82213")); // 8
console.log(minPartitions("27346209830709182346")); // 9
console.log(minPartitions("1")); // 1
console.log(minPartitions("10")); // 1

function minPartitionsShort(n: string): number {
  // Compare characters directly (works because '0'-'9' are ordered in ASCII)
  return parseInt(n.split("").reduce((max, ch) => (ch > max ? ch : max), "0"));
}

// Test cases
console.log(minPartitionsShort("32")); // 3
console.log(minPartitionsShort("82213")); // 8
console.log(minPartitionsShort("1")); // 1

function minPartitionsVerify(n: string): number {
  // Find max digit — this IS the minimum number of deci-binary numbers
  const maxD = Math.max(...n.split("").map(Number));

  // Verification: construct the actual deci-binary numbers (for demo)
  const nums: string[] = [];
  const digits = n.split("").map(Number);

  for (let round = 0; round < maxD; round++) {
    let num = "";
    for (let i = 0; i < digits.length; i++) {
      // Place a 1 if this digit still needs contribution
      num += digits[i] > round ? "1" : "0";
    }
    nums.push(num);
  }

  // Verify sum equals n (remove leading zeros and compute)
  // Each position: count of 1s = original digit ✓
  console.log(`  Deci-binary numbers: ${nums.join(", ")}`);
  return maxD;
}

console.log(minPartitionsVerify("32")); // 3, shows: "11", "11", "10"
console.log(minPartitionsVerify("82213")); // 8
```

---

## 🔗 Related Problems

| Giải pháp        | Thời gian | Không gian | Ghi chú             |
| ---------------- | --------- | ---------- | ------------------- |
| Duyệt tìm max    | O(n)      | O(1)       | Tối ưu nhất         |
| Spread + reduce  | O(n)      | O(n)       | Ngắn gọn, tạo array |
| Xây dựng thực tế | O(n²)     | O(n²)      | Chỉ để hiểu bài     |
