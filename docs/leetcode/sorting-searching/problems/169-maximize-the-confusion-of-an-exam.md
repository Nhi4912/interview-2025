---
layout: page
title: "Maximize the Confusion of an Exam"
difficulty: Medium
category: Sorting-Searching
tags: [String, Binary Search, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximize-the-confusion-of-an-exam"
---

# Maximize the Confusion of an Exam / Tối Đa Hóa Sự Nhầm Lẫn Trong Bài Kiểm Tra

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Tìm chuỗi con dài nhất có tối đa k ký tự khác với ký tự còn lại. Thực ra cần tìm max của hai bài: (1) chuỗi con dài nhất với ≤ k chữ 'F', và (2) chuỗi con dài nhất với ≤ k chữ 'T'. Dùng sliding window cho mỗi bài.

**Analogy:** Bạn muốn đổi nhiều nhất k câu trả lời để có chuỗi liên tiếp dài nhất cùng loại — như sơn k căn nhà để có dãy phố dài nhất cùng màu.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximize the Confusion of an Exam example:**

```
answerKey = "TTFTTFTT"  k=1

Sliding window for max T's with ≤1 F:
  [T T F T T F T T]
  expand right, shrink left when F count > 1
  best window: "TTFTT" len=5

Sliding window for max F's with ≤1 T:
  best "F" run with 1 T = "FTF"? No T in original but...
  Actual: scan for ≤1 T in window
  "TTFTTFTT" → windows: T(1T)→invalid quickly → answer=3

max(5, 3) = 5
```

---

---

## Problem Description

| Problem                                                                                                                                    | Difficulty | Connection                        |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------- |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                                                         | 🟡 Medium  | Same sliding window, binary array |
| [Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters) | 🟡 Medium  | Sliding window with constraint    |
| [Get Equal Substrings Within Budget](https://leetcode.com/problems/get-equal-substrings-within-budget)                                     | 🟡 Medium  | Sliding window on cost            |

---

## 📝 Interview Tips

- **EN:** Run sliding window twice: once maximizing T's (count F's ≤ k), once maximizing F's (count T's ≤ k) / **VI:** Chạy sliding window 2 lần: đếm F ≤ k và đếm T ≤ k
- **EN:** Inside the window: at most k of the "minority" character / **VI:** Trong cửa sổ: tối đa k ký tự "thiểu số"
- **EN:** Expand right pointer; when count of minority > k, shrink left / **VI:** Mở rộng right, khi đếm > k thu hẹp left
- **EN:** Answer = max window size seen in either run / **VI:** Đáp án = max kích thước cửa sổ qua 2 lần chạy
- **EN:** Time O(n), Space O(1) — optimal for this problem / **VI:** O(n) thời gian, O(1) không gian
- **EN:** Related: Max Consecutive Ones III is the boolean version of this exact pattern / **VI:** Max Consecutive Ones III là phiên bản boolean của đúng bài này

---

---

## Solutions

```typescript
/**
 * Run sliding window twice: limit 'F' count to k, then limit 'T' count to k.
 * Time: O(n)  Space: O(1)
 */
function maxConsecutiveAnswers(answerKey: string, k: number): number {
  const maxWindow = (target: string): number => {
    let lo = 0,
      count = 0,
      best = 0;
    for (let hi = 0; hi < answerKey.length; hi++) {
      if (answerKey[hi] !== target) count++;
      while (count > k) {
        if (answerKey[lo] !== target) count--;
        lo++;
      }
      best = Math.max(best, hi - lo + 1);
    }
    return best;
  };

  // Best all-T window (flip ≤k F's) vs best all-F window (flip ≤k T's)
  return Math.max(maxWindow("T"), maxWindow("F"));
}

// Tests
console.log(maxConsecutiveAnswers("TTFF", 2)); // 4
console.log(maxConsecutiveAnswers("TFFT", 1)); // 3
console.log(maxConsecutiveAnswers("TTFTTFTT", 1)); // 5

/**
 * Combine both windows in a single loop using two separate windows.
 * Time: O(n)  Space: O(1)
 */
function maxConsecutiveAnswers2(answerKey: string, k: number): number {
  const n = answerKey.length;
  let best = 0;

  // Window 1: count of 'F' in window [lo1..hi]
  let lo1 = 0,
    cntF = 0;
  // Window 2: count of 'T' in window [lo2..hi]
  let lo2 = 0,
    cntT = 0;

  for (let hi = 0; hi < n; hi++) {
    if (answerKey[hi] === "F") cntF++;
    else cntT++;

    while (cntF > k) {
      if (answerKey[lo1++] === "F") cntF--;
    }
    while (cntT > k) {
      if (answerKey[lo2++] === "T") cntT--;
    }

    best = Math.max(best, hi - lo1 + 1, hi - lo2 + 1);
  }
  return best;
}

// Tests
console.log(maxConsecutiveAnswers2("TTFF", 2)); // 4
console.log(maxConsecutiveAnswers2("TFFT", 1)); // 3
console.log(maxConsecutiveAnswers2("TTFTTFTT", 1)); // 5

/**
 * Binary search on length l; check if any window of size l is valid.
 * Time: O(n log n)  Space: O(1)
 */
function maxConsecutiveAnswers3(answerKey: string, k: number): number {
  const n = answerKey.length;

  const canAchieve = (len: number): boolean => {
    let cntF = 0,
      cntT = 0;
    for (let i = 0; i < len; i++) {
      answerKey[i] === "F" ? cntF++ : cntT++;
    }
    if (cntF <= k || cntT <= k) return true;
    for (let i = len; i < n; i++) {
      answerKey[i] === "F" ? cntF++ : cntT++;
      answerKey[i - len] === "F" ? cntF-- : cntT--;
      if (cntF <= k || cntT <= k) return true;
    }
    return false;
  };

  let lo = 1,
    hi = n;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    canAchieve(mid) ? (lo = mid) : (hi = mid - 1);
  }
  return lo;
}

// Tests
console.log(maxConsecutiveAnswers3("TTFF", 2)); // 4
console.log(maxConsecutiveAnswers3("TFFT", 1)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                                    | Difficulty | Connection                        |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------- |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                                                         | 🟡 Medium  | Same sliding window, binary array |
| [Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters) | 🟡 Medium  | Sliding window with constraint    |
| [Get Equal Substrings Within Budget](https://leetcode.com/problems/get-equal-substrings-within-budget)                                     | 🟡 Medium  | Sliding window on cost            |
