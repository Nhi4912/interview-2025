---
layout: page
title: "Replace the Substring for Balanced String"
difficulty: Medium
category: String
tags: [String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/replace-the-substring-for-balanced-string"
---

# Replace the Substring for Balanced String / Thay Thế Chuỗi Con Để Cân Bằng Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Chuỗi chỉ gồm `Q, W, E, R`. Cân bằng nghĩa là mỗi ký tự xuất hiện đúng `n/4` lần. Ta chọn một đoạn con để thay thế (đặt ký tự tùy ý). Đoạn cần thay nhỏ nhất — dùng sliding window: thu hẹp cửa sổ khi phần **ngoài** đã đủ điều kiện.

```
s = "QWER"  n=4  target=1 each
All counts: Q=1 W=1 E=1 R=1 → already balanced → answer=0

s = "QQWE"  n=4  target=1 each
Count: Q=2 W=1 E=1 R=0
Outside window must have: Q≤1, W≤1, E≤1, R≤1
Window [0..1]="QQ": outside="WE" → Q=0,W=1,E=1,R=0 ✓ → len=2
Try smaller: window [0..0]="Q": outside="QWE" → Q=1,W=1,E=1,R=0 ✓ → len=1
Try [1..1]="Q": outside="QWE" same → len=1
Answer = 1
```

**Key insight**: Slide a window over the string. The chars **outside** the window must each have count ≤ `n/4`. Minimize the window size satisfying this constraint.

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN**: Key observation: characters **inside** the window will be replaced → their count is irrelevant
  **VI**: Nhận xét chính: ký tự **trong** cửa sổ sẽ bị thay → không quan trọng số lần xuất hiện
- 🔑 **EN**: Outside chars must each be ≤ `target = n/4` for a valid replacement to exist
  **VI**: Ký tự ngoài phải ≤ `target = n/4` để có thể thay thế hợp lệ
- 🔑 **EN**: Use `count[ch]` for total freq; `count[ch] - windowCount[ch]` = outside count
  **VI**: Dùng `count[ch]` tổng; `count[ch] - windowCount[ch]` = count ngoài cửa sổ
- 🔑 **EN**: Shrink left pointer when all outside counts are ≤ target (valid state)
  **VI**: Thu hẹp con trỏ trái khi tất cả count ngoài ≤ target (trạng thái hợp lệ)
- 🔑 **EN**: If already balanced (all counts = target), answer is 0
  **VI**: Nếu đã cân bằng (mọi count = target), đáp án là 0
- 🔑 **EN**: Time O(n), Space O(1) — only 4 characters
  **VI**: Thời gian O(n), Không gian O(1) — chỉ 4 ký tự

---

```typescript
// ─── Solution 1: Sliding Window — O(n) time, O(1) space ──────────────────────
function balancedString(s: string): number {
  const n = s.length;
  const target = n / 4;
  const chars = ["Q", "W", "E", "R"];

  // Count total frequencies
  const total: Record<string, number> = { Q: 0, W: 0, E: 0, R: 0 };
  for (const ch of s) total[ch]++;

  // Already balanced?
  if (chars.every((c) => total[c] === target)) return 0;

  // Sliding window: track count of chars inside window
  const win: Record<string, number> = { Q: 0, W: 0, E: 0, R: 0 };

  // Returns true when outside counts are all ≤ target
  const isValid = () => chars.every((c) => total[c] - win[c] <= target);

  let ans = n;
  let left = 0;

  for (let right = 0; right < n; right++) {
    win[s[right]]++;

    // Shrink window from left while constraint holds
    while (isValid()) {
      ans = Math.min(ans, right - left + 1);
      win[s[left]]--;
      left++;
    }
  }

  return ans;
}

// Tests
console.log(balancedString("QWER")); // 0
console.log(balancedString("QQWE")); // 1
console.log(balancedString("QQQW")); // 2
console.log(balancedString("QQQQ")); // 3
```

```typescript
// ─── Solution 2: Explicit Valid Check (more readable) ────────────────────────
function balancedString2(s: string): number {
  const n = s.length;
  const k = n / 4; // target per char

  const freq: Record<string, number> = { Q: 0, W: 0, E: 0, R: 0 };
  for (const c of s) freq[c]++;

  // Helper: outside window counts are all ≤ k
  const outsideOk = (winFreq: Record<string, number>) =>
    Object.keys(freq).every((c) => freq[c] - (winFreq[c] ?? 0) <= k);

  const win: Record<string, number> = { Q: 0, W: 0, E: 0, R: 0 };
  let ans = n;
  let l = 0;

  for (let r = 0; r < n; r++) {
    win[s[r]] = (win[s[r]] ?? 0) + 1;

    while (l <= r && outsideOk(win)) {
      ans = Math.min(ans, r - l + 1);
      win[s[l]]--;
      l++;
    }
  }

  // Edge: already balanced → no change needed
  return outsideOk({ Q: 0, W: 0, E: 0, R: 0 }) ? 0 : ans;
}

// Tests
console.log(balancedString2("QWER")); // 0
console.log(balancedString2("QQWE")); // 1
console.log(balancedString2("QQQW")); // 2
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                            | Difficulty | Pattern        |
| ---- | ---------------------------------- | ---------- | -------------- |
| 76   | Minimum Window Substring           | 🔴 Hard    | Sliding Window |
| 1004 | Max Consecutive Ones III           | 🟡 Medium  | Sliding Window |
| 567  | Permutation in String              | 🟡 Medium  | Sliding Window |
| 1208 | Get Equal Substrings Within Budget | 🟡 Medium  | Sliding Window |
