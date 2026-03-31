---
layout: page
title: "Minimum Number of Flips to Make the Binary String Alternating"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming, Sliding Window]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating"
---

# Minimum Number of Flips to Make the Binary String Alternating / Số Lần Lật Tối Thiểu Để Chuỗi Xen Kẽ

🟡 Medium | Circular sliding window on doubled string

## 🧠 Intuition

**VI:** Vì phép quay (type-1 flip) tương đương với dịch chuyển vòng, ta nhân đôi chuỗi rồi
dùng cửa sổ trượt kích thước n để tìm đoạn nào cần ít lần lật nhất để thành xen kẽ.

**EN:** Type-1 moves (rotate) are equivalent to cyclic shifts. Doubling the string and
sliding a window of length n captures all rotations. Compare against both target patterns
`010101...` and `101010...`.

```
s = "111000"  n=6
Doubled: "111000111000"
Targets: "010101010101" and "101010101010"

Window [0..5]: "111000" vs "010101" → mismatches = 4  vs "101010" → 3
Window [1..6]: "110001" vs "010101" → ...
Track count[0] and count[1] (mismatches) in window, answer = min over all windows.
```

## 📝 Interview Tips

- 🔑 **EN:** Double the string to handle all cyclic rotations as a linear window.
  **VI:** Nhân đôi chuỗi để biến mọi phép xoay vòng thành cửa sổ tuyến tính.
- 🔑 **EN:** Two target patterns: starting with '0' and starting with '1'.
  **VI:** Hai mẫu mục tiêu: bắt đầu bằng '0' và bắt đầu bằng '1'.
- 🔑 **EN:** Maintain mismatch count by adding new char and removing expired char from window.
  **VI:** Duy trì số lần không khớp bằng cách thêm ký tự mới và xóa ký tự hết hạn.
- 🔑 **EN:** For position `i`, expected char in pattern `p` is `(i + p) % 2`.
  **VI:** Tại vị trí `i`, ký tự kỳ vọng trong mẫu `p` là `(i + p) % 2`.
- 🔑 **EN:** Sliding window maintains count1 (mismatches vs "0101...") and count2 ("1010...").
  **VI:** Cửa sổ trượt duy trì count1 (không khớp vs "0101...") và count2 ("1010...").
- 🔑 **EN:** Window update: add `s[i]`, remove `s[i-n]`. O(n) total.
  **VI:** Cập nhật cửa sổ: thêm `s[i]`, xóa `s[i-n]`. Tổng O(n).

## Solutions

### Solution 1: Sliding Window on Doubled String

```typescript
/**
 * Min flips to make string alternating
 * Double string, slide window of size n.
 * Time: O(n)  Space: O(n)
 */
function minFlips(s: string): number {
  const n = s.length;
  const doubled = s + s;
  let misA = 0; // mismatches vs "010101..."
  let misB = 0; // mismatches vs "101010..."
  let ans = Infinity;

  for (let i = 0; i < 2 * n; i++) {
    const ch = doubled[i] === "1" ? 1 : 0;
    const expA = i % 2; // "010101..." expects 0,1,0,1,...
    const expB = (i + 1) % 2; // "101010..." expects 1,0,1,0,...
    if (ch !== expA) misA++;
    if (ch !== expB) misB++;

    if (i >= n) {
      // remove character that left the window
      const old = doubled[i - n] === "1" ? 1 : 0;
      const oldExpA = (i - n) % 2;
      const oldExpB = (i - n + 1) % 2;
      if (old !== oldExpA) misA--;
      if (old !== oldExpB) misB--;
    }

    if (i >= n - 1) {
      ans = Math.min(ans, misA, misB);
    }
  }

  return ans;
}

console.log(minFlips("111000")); // 2
console.log(minFlips("010")); // 0
console.log(minFlips("1110")); // 1
```

### Solution 2: Prefix Mismatch Array (explicit, easier to reason)

```typescript
/**
 * Precompute cumulative mismatches for both patterns.
 * Then sliding window is O(1) per step using prefix sums.
 * Time: O(n)  Space: O(n)
 */
function minFlips2(s: string): number {
  const n = s.length;
  const t = s + s;
  const len = 2 * n;

  // pre[i] = prefix mismatch count vs "010101..." up to index i (exclusive)
  const preA = new Array(len + 1).fill(0);
  const preB = new Array(len + 1).fill(0);

  for (let i = 0; i < len; i++) {
    const ch = t[i] === "1" ? 1 : 0;
    preA[i + 1] = preA[i] + (ch !== i % 2 ? 1 : 0);
    preB[i + 1] = preB[i] + (ch !== (i + 1) % 2 ? 1 : 0);
  }

  let ans = Infinity;
  for (let i = 0; i + n <= len; i++) {
    const a = preA[i + n] - preA[i];
    const b = preB[i + n] - preB[i];
    ans = Math.min(ans, a, b);
  }

  return ans;
}

console.log(minFlips2("111000")); // 2
console.log(minFlips2("010")); // 0
console.log(minFlips2("1110")); // 1
```

## 🔗 Related Problems

| Problem                                                                                                                   | Difficulty | Key Idea        |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [1004. Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)                                 | 🟡 Medium  | Sliding window  |
| [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)                                   | 🔴 Hard    | Sliding window  |
| [1423. Maximum Points You Can Obtain from Cards](https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/) | 🟡 Medium  | Circular window |
| [2027. Minimum Moves to Convert String](https://leetcode.com/problems/minimum-moves-to-convert-string/)                   | 🟢 Easy    | Greedy flips    |
