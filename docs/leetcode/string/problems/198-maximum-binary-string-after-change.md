---
layout: page
title: "Maximum Binary String After Change"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-binary-string-after-change"
---

# Maximum Binary String After Change / Chuỗi Nhị Phân Lớn Nhất Sau Khi Đổi

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Phép so sánh:** Giống sắp xếp chỗ ngồi — mọi số `0` đều có thể dồn thành một khối liên tiếp. Nếu có `k` số 0 (bỏ qua tiền tố toàn `1`), kết quả luôn là: tất cả là `1` trừ đúng một vị trí là `0`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Binary String After Change example:**

```
Input:  "000110"
Zeros after leading 1s: positions 0,1,2,4 → count=4, ones_before=0
Result: "111011"  (n-1 ones, one '0' at position zeros_count-1)

Rule: "00" → "10", "10" → "01"
Key: all zeros can be bubbled right past ones → one lone 0 remains
```

---

## Problem Description

Given a binary string `binary`, you may apply **any number** of operations:

- `"00"` → `"10"`, or `"10"` → `"01"`

Return the **maximum** binary string you can get (lexicographically largest).

**Example 1:** `"000110"` → `"111011"`

**Example 2:** `"01"` → `"01"`

**Constraints:** `1 <= binary.length <= 10^5`, binary[i] ∈ `{'0','1'}`

---

## 📝 Interview Tips

- **Key insight:** All `1`s before the first `0` stay in place — leading ones are already maximal
- **Greedy observation:** Every `0` can shift past a `1` using `"10"→"01"`, so all zeros collapse into a contiguous block
- **Final form:** `(leading 1s)(all 1s)(one 0)(all 1s)` — the single `0` is placed at index `firstZero + zerosCount - 1`
- **Edge case:** String with no `0` is already maximum — return as-is
- **Complexity:** O(n) time, O(n) space (result array)
- **Interview insight:** Nhận ra "invariant của greedy" — chứng minh vị trí `0` cuối cùng không ảnh hưởng đến kết quả

---

## Solutions

```typescript
function maximumBinaryString(binary: string): string {
  const n = binary.length;
  let firstZero = -1;
  let zerosCount = 0;

  for (let i = 0; i < n; i++) {
    if (binary[i] === "0") {
      if (firstZero === -1) firstZero = i;
      zerosCount++;
    }
  }

  // No zero or only one zero → already max or just "01"
  if (zerosCount <= 1) return binary;

  // Build result: all 1s except one 0 at position (firstZero + zerosCount - 1)
  const result = new Array(n).fill("1");
  result[firstZero + zerosCount - 1] = "0";
  return result.join("");
}

function maximumBinaryString(binary: string): string {
  const n = binary.length;
  const arr = binary.split("");

  let i = 0;
  // Skip leading ones — they can't be improved
  while (i < n && arr[i] === "1") i++;

  // From first zero onward, collect all zeros and push them forward
  let j = i;
  while (j < n) {
    if (arr[j] === "0") {
      // Swap zero to position i, fill i with '1'
      arr[i] = "1";
      arr[j] = "0";
      // Now move zero one step forward: "00" → "10" leaves a new zero
      i++;
    }
    j++;
  }
  // i now points past the last zero we placed; the lone zero is at i-1
  return arr.join("");
}
```

---

## 🔗 Related Problems

| #    | Problem                       | Difficulty | Tags                    |
| ---- | ----------------------------- | ---------- | ----------------------- |
| 402  | Remove K Digits               | Medium     | Greedy, Monotonic Stack |
| 670  | Maximum Swap                  | Medium     | Greedy                  |
| 1899 | Merge Triplets to Form Target | Medium     | Greedy                  |
| 2086 | Minimum Number of Buckets     | Medium     | Greedy                  |
