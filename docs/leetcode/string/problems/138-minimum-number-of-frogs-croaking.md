---
layout: page
title: "Minimum Number of Frogs Croaking"
difficulty: Medium
category: String
tags: [String, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-frogs-croaking"
---

# Minimum Number of Frogs Croaking / Số Ếch Nhái Tối Thiểu Đang Kêu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: State Counting

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Mỗi con ếch kêu theo thứ tự `c→r→o→a→k`. Khi gặp `c`, cần thêm một ếch (hoặc dùng ếch vừa kết thúc `k`). Đếm số ếch đang ở mỗi trạng thái — đỉnh đồng thời chính là đáp án.

```
croakcroak
c: start frog1        counts: c=1 r=0 o=0 a=0 k=0  frogs=1
r: frog1 c→r          counts: c=0 r=1 o=0 a=0 k=0
o: frog1 r→o          counts: c=0 r=0 o=1 a=0 k=0
a: frog1 o→a          counts: c=0 r=0 o=0 a=1 k=0
k: frog1 done         counts: c=0 r=0 o=0 a=0 k=1
c: frog2 OR reuse frog1 (k→0, c→1)  frogs=max(1,1)=1
...
Answer = 1
```

**Key insight**: At each step, the previous-state count must be ≥ 1 (a frog must have arrived at that state). Max concurrent `c`-count = answer. If any count goes negative → invalid → return -1.

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN**: Map each letter to its index in "croak" (c=0, r=1, o=2, a=3, k=4)
  **VI**: Ánh xạ mỗi chữ cái tới vị trí trong "croak" (c=0, r=1, o=2, a=3, k=4)
- 🔑 **EN**: On char `x` at position `p`: increment `counts[p]`, decrement `counts[p-1]`
  **VI**: Gặp ký tự `x` tại vị trí `p`: tăng `counts[p]`, giảm `counts[p-1]`
- 🔑 **EN**: For `c` (p=0): reuse a finished frog if `counts[4] > 0`, else spawn new frog
  **VI**: Gặp `c` (p=0): tái dùng ếch vừa kết thúc nếu `counts[4] > 0`, không thì tạo mới
- 🔑 **EN**: Invalid if `counts[p-1] < 0` before decrement (no frog reached previous state)
  **VI**: Không hợp lệ nếu `counts[p-1] < 0` trước khi giảm
- 🔑 **EN**: Answer = maximum value `counts[0]` ever reaches (peak concurrent frogs)
  **VI**: Đáp án = giá trị lớn nhất mà `counts[0]` đạt được (số ếch đồng thời lớn nhất)
- 🔑 **EN**: At the end, all counts except `counts[4]` must be 0 to be valid
  **VI**: Kết thúc, tất cả counts ngoài `counts[4]` phải = 0 mới hợp lệ

---

```typescript
// ─── Solution 1: State Counter — O(n) time, O(1) space ───────────────────────
function minNumberOfFrogs(croakOfFrogs: string): number {
  const order = "croak";
  const idx = new Map<string, number>();
  for (let i = 0; i < order.length; i++) idx.set(order[i], i);

  const counts = new Array(5).fill(0); // counts[i] = frogs currently at state i
  let maxFrogs = 0;

  for (const ch of croakOfFrogs) {
    const p = idx.get(ch);
    if (p === undefined) return -1; // invalid character

    if (p === 0) {
      // Starting 'c': reuse a finished frog (counts[4]) or add new one
      if (counts[4] > 0) {
        counts[4]--;
      }
      counts[0]++;
      maxFrogs = Math.max(maxFrogs, counts[0]);
    } else {
      // Transition: frog moves from state p-1 → p
      if (counts[p - 1] === 0) return -1; // no frog was at previous state
      counts[p - 1]--;
      counts[p]++;
    }
  }

  // Valid only if all frogs finished (all non-k states empty)
  if (counts[0] + counts[1] + counts[2] + counts[3] > 0) return -1;

  return maxFrogs;
}

// Tests
console.log(minNumberOfFrogs("croakcroak")); // 1
console.log(minNumberOfFrogs("crcoakroak")); // 2
console.log(minNumberOfFrogs("croakcrook")); // -1 (invalid)
console.log(minNumberOfFrogs("croak")); // 1
```

```typescript
// ─── Solution 2: Compact — same logic, more concise ──────────────────────────
function minNumberOfFrogs2(croakOfFrogs: string): number {
  let c = 0,
    r = 0,
    o = 0,
    a = 0,
    k = 0;
  let ans = 0;

  for (const ch of croakOfFrogs) {
    if (ch === "c") {
      c++;
      ans = Math.max(ans, c);
    } else if (ch === "r") {
      if (c === 0) return -1;
      c--;
      r++;
    } else if (ch === "o") {
      if (r === 0) return -1;
      r--;
      o++;
    } else if (ch === "a") {
      if (o === 0) return -1;
      o--;
      a++;
    } else if (ch === "k") {
      if (a === 0) return -1;
      a--;
      k++;
      c += k;
      k = 0;
    } else return -1;
  }

  return c + r + o + a + k === 0 ? ans : -1;
}

// Tests
console.log(minNumberOfFrogs2("croakcroak")); // 1
console.log(minNumberOfFrogs2("crcoakroak")); // 2
console.log(minNumberOfFrogs2("croakcrook")); // -1
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                          | Difficulty | Pattern  |
| ---- | -------------------------------- | ---------- | -------- |
| 936  | Stamping the Sequence            | 🔴 Hard    | Greedy   |
| 678  | Valid Parenthesis String         | 🟡 Medium  | Greedy   |
| 1419 | Minimum Number of Frogs Croaking | 🟡 Medium  | Counting |
| 846  | Hand of Straights                | 🟡 Medium  | Greedy   |
