---
layout: page
title: "Largest Number After Mutating Substring"
difficulty: Medium
category: String
tags: [Array, String, Greedy]
leetcode_url: "https://leetcode.com/problems/largest-number-after-mutating-substring"
---

# Largest Number After Mutating Substring / Số Lớn Nhất Sau Khi Thay Đổi

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Phép so sánh:** Giống đổi tiền — bạn chỉ đổi nếu có lợi (nhận được tờ có mệnh giá cao hơn). Dừng ngay khi đổi không có lợi nữa, vì phần còn lại không nên thay đổi.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Largest Number After Mutating Substring example:**

```
num="132", change=[9,8,5,3,7,9,2,3,4,3]
i=0: '1' → change[1]=8 > 1 → replace → "832", started=true
i=1: '3' → change[3]=3 = 3 → equal → replace → "832" (ok, same)
i=2: '2' → change[2]=5 > 2 → replace → "835"
Result: "835"

Rule: once started replacing, stop ONLY when change[d] < d
```

---

## Problem Description

Given string `num` (digit string) and array `change` of length 10, you may replace any **contiguous substring** of `num` where for each digit `d` at position `i` in the substring, you replace `d` with `change[d]`. Return the **lexicographically largest** result.

**Example 1:** `num="132"`, `change=[9,8,5,3,7,9,2,3,4,3]` → `"832"`

**Example 2:** `num="021"`, `change=[9,4,3,5,7,2,1,9,0,6]` → `"934"`

**Constraints:** `1 <= num.length <= 10^4`

---

## 📝 Interview Tips

- **Greedy start:** Begin replacement at the first position where `change[d] > d`
- **Continue while beneficial:** Once started, continue as long as `change[d] >= d` (equal is OK — no loss)
- **Stop condition:** Stop when `change[d] < d` because replacing would make number smaller
- **One contiguous segment:** Can only mutate ONE contiguous substring — if we stop, we cannot restart
- **If no improvement found:** Return `num` unchanged
- **Complexity:** O(n) time, O(n) space (for output array)

---

## Solutions

```typescript
function maximumNumber(num: string, change: number[]): string {
  const digits = num.split("");
  let started = false;

  for (let i = 0; i < digits.length; i++) {
    const d = parseInt(digits[i]);
    const c = change[d];

    if (c > d) {
      digits[i] = String(c);
      started = true;
    } else if (c === d) {
      // neutral — keep going if already started
      if (started) continue;
    } else {
      // c < d: replacing would reduce the number
      if (started) break; // stop the contiguous segment
    }
  }

  return digits.join("");
}

function maximumNumber(num: string, change: number[]): string {
  const arr = num.split("");
  let inMutation = false;

  for (let i = 0; i < arr.length; i++) {
    const orig = Number(arr[i]);
    const mutated = change[orig];

    if (!inMutation) {
      if (mutated > orig) {
        arr[i] = String(mutated);
        inMutation = true;
      }
      // if mutated <= orig, don't start
    } else {
      // already mutating
      if (mutated < orig) {
        break; // cannot continue — would decrease
      }
      arr[i] = String(mutated); // mutated >= orig, safe
    }
  }

  return arr.join("");
}

function maximumNumber(num: string, change: number[]): string {
  const n = num.length;
  let start = -1,
    end = -1;

  // Find start: first index where change[d] > d
  for (let i = 0; i < n; i++) {
    const d = Number(num[i]);
    if (change[d] > d) {
      start = i;
      break;
    }
  }
  if (start === -1) return num; // no improvement possible

  // Find end: extend as long as change[d] >= d
  end = start;
  for (let i = start; i < n; i++) {
    const d = Number(num[i]);
    if (change[d] >= d) end = i;
    else break;
  }

  const arr = num.split("");
  for (let i = start; i <= end; i++) {
    arr[i] = String(change[Number(arr[i])]);
  }
  return arr.join("");
}
```

---

## 🔗 Related Problems

| #    | Problem                                             | Difficulty | Tags                    |
| ---- | --------------------------------------------------- | ---------- | ----------------------- |
| 670  | Maximum Swap                                        | Medium     | Greedy                  |
| 402  | Remove K Digits                                     | Medium     | Greedy, Monotonic Stack |
| 1432 | Max Difference You Can Get From Changing an Integer | Medium     | Greedy                  |
| 2566 | Maximum Difference by Remapping a Digit             | Easy       | Greedy                  |
