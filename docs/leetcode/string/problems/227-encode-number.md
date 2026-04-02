---
layout: page
title: "Encode Number"
difficulty: Medium
category: String
tags: [Math, String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/encode-number"
---

# Encode Number / Mã Hóa Số

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cho số nguyên không âm `num`, mã hóa nó theo quy tắc:

- `encode(0) = ""`
- `encode(n) = encode((n-1)/2) + "0"` nếu `(n-1)` chẵn
- `encode(n) = encode((n-1)/2) + "1"` nếu `(n-1)` lẻ

Tương đương: lấy biểu diễn nhị phân của `(n+1)` rồi bỏ bit đầu (MSB).

**Ví dụ:** `num = 5` → binary(6) = "110" → bỏ '1' → `"10"`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Encode Number example:**

```
Mapping:
n=0 → ""
n=1 → "0"
n=2 → "1"
n=3 → "00"
n=4 → "01"
n=5 → "10"
n=6 → "11"
n=7 → "000"

Pattern: encode(n) = binary(n+1) without the leading '1'
n=5: n+1=6, binary(6)="110", strip leading '1' → "10" ✓
n=7: n+1=8, binary(8)="1000", strip → "000" ✓
```

---

## Problem Description

- Áp dụng hàm encode theo đệ quy như mô tả.
- Trả về chuỗi mã hóa của `num`.

**Constraints:** `0 <= num <= 10^9`.

---

## 📝 Interview Tips

1. **Binary insight** — `encode(n)` = `binary(n+1)` bỏ bit MSB.
2. **Tại sao?** — Ánh xạ 1-1: số nguyên → chuỗi nhị phân không có leading 1.
3. **n+1 về binary** — `(n+1).toString(2)` cho ta binary string.
4. **Slice(1)** — bỏ ký tự đầu tiên là xong.
5. **n=0** — `1.toString(2) = "1"`, `"1".slice(1) = ""` ✓.
6. **Tránh đệ quy sâu** — với `n = 10^9`, đệ quy có thể stack overflow; dùng bitwise.

---

## Solutions

```typescript
function encode(num: number): string {
  // encode(n) = binary representation of (n+1) without the leading bit
  return (num + 1).toString(2).slice(1);
}

// Test cases
console.log(encode(0)); // ""
console.log(encode(1)); // "0"
console.log(encode(2)); // "1"
console.log(encode(3)); // "00"
console.log(encode(4)); // "01"
console.log(encode(5)); // "10"
console.log(encode(6)); // "11"
console.log(encode(7)); // "000"
console.log(encode(1000000000)); // large number

function encodeRecursive(num: number): string {
  if (num === 0) return "";

  // (n-1) even → append '0'; (n-1) odd → append '1'
  // Equivalent to checking if (num-1) % 2 === 0
  const bit = (num - 1) % 2 === 0 ? "0" : "1";
  return encodeRecursive(Math.floor((num - 1) / 2)) + bit;
}

console.log(encodeRecursive(0)); // ""
console.log(encodeRecursive(5)); // "10"
console.log(encodeRecursive(7)); // "000"

// Verify both approaches agree
for (let i = 0; i <= 20; i++) {
  const a = encode(i);
  const b = encodeRecursive(i);
  if (a !== b) console.error(`Mismatch at ${i}: ${a} vs ${b}`);
}
console.log("All match for 0-20 ✓");

function encodeBitwise(num: number): string {
  if (num === 0) return "";

  const n1 = num + 1;
  // Find bit length of (num+1)
  let bits = 0;
  let tmp = n1;
  while (tmp > 0) {
    bits++;
    tmp >>= 1;
  }

  // Build result: bits from position (bits-2) down to 0
  let result = "";
  for (let i = bits - 2; i >= 0; i--) {
    result += (n1 >> i) & 1 ? "1" : "0";
  }
  return result;
}

console.log(encodeBitwise(0)); // ""
console.log(encodeBitwise(5)); // "10"
console.log(encodeBitwise(6)); // "11"
console.log(encodeBitwise(7)); // "000"

// Cross-validate
for (let i = 0; i <= 50; i++) {
  if (encode(i) !== encodeBitwise(i)) {
    console.error(`Mismatch at i=${i}`);
  }
}
console.log("Bitwise matches for 0-50 ✓");
```

---

## 🔗 Related Problems

| Giải pháp    | Thời gian | Không gian | Ghi chú             |
| ------------ | --------- | ---------- | ------------------- |
| Binary trick | O(log n)  | O(log n)   | Nhất quán, ngắn     |
| Đệ quy       | O(log n)  | O(log n)   | Stack call depth    |
| Bitwise      | O(log n)  | O(log n)   | Không dùng toString |
