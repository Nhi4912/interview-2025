---
layout: page
title: "Maximum Number of Balloons"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-balloons"
---

# Maximum Number of Balloons / Số Lượng "Balloon" Tối Đa

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map / Counting

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Từ "balloon" cần `b×1, a×1, l×2, o×2, n×1`. Đếm từng chữ trong chuỗi, rồi tính xem có thể ghép được bao nhiêu từ "balloon" — bị giới hạn bởi chữ xuất hiện ít nhất.

```
text = "nlaebolko"
Count: b=1, a=1, l=2, o=2, n=1
"balloon" needs: b=1, a=1, l=2, o=2, n=1

Instances = min(b/1, a/1, l/2, o/2, n/1)
          = min( 1,   1,   1,   1,   1 ) = 1
```

**Key insight**: Only 5 letters matter. `l` and `o` each appear twice in "balloon" → divide their counts by 2.

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN**: Only count letters `b, a, l, o, n` — others are irrelevant
  **VI**: Chỉ đếm chữ cái `b, a, l, o, n` — các chữ khác không quan trọng
- 🔑 **EN**: `l` and `o` each appear twice in "balloon" → use `Math.floor(count/2)`
  **VI**: `l` và `o` xuất hiện 2 lần trong "balloon" → dùng `Math.floor(count/2)`
- 🔑 **EN**: Answer = minimum across all 5 required counts (the bottleneck letter)
  **VI**: Đáp án = giá trị nhỏ nhất trong 5 chữ cái cần (chữ là nút cổ chai)
- 🔑 **EN**: If any required letter is missing, answer is 0
  **VI**: Nếu thiếu bất kỳ chữ nào, đáp án là 0
- 🔑 **EN**: Can generalize: build freq map for any target word, then take min of floor(count/needed)
  **VI**: Có thể tổng quát hóa: xây freq map cho bất kỳ từ nào, rồi lấy min(count/needed)
- 🔑 **EN**: Time O(n) for counting + O(5) = O(n); Space O(1) with only 5 counters
  **VI**: Thời gian O(n) đếm + O(5) = O(n); Không gian O(1) với 5 biến đếm

---

```typescript
// ─── Solution 1: Direct Counting — O(n) time, O(1) space ────────────────────
function maxNumberOfBalloons(text: string): number {
  let b = 0,
    a = 0,
    l = 0,
    o = 0,
    n = 0;

  for (const ch of text) {
    if (ch === "b") b++;
    else if (ch === "a") a++;
    else if (ch === "l") l++;
    else if (ch === "o") o++;
    else if (ch === "n") n++;
  }

  // "balloon": b×1, a×1, l×2, o×2, n×1
  return Math.min(b, a, Math.floor(l / 2), Math.floor(o / 2), n);
}

// Tests
console.log(maxNumberOfBalloons("nlaebolko")); // 1
console.log(maxNumberOfBalloons("loonbalxballpoon")); // 2
console.log(maxNumberOfBalloons("leetcode")); // 0
console.log(maxNumberOfBalloons("balloonballoon")); // 2
```

```typescript
// ─── Solution 2: Generalized Map Approach — O(n) time, O(1) space ────────────
function maxNumberOfBalloons2(text: string): number {
  const target = "balloon";
  const need = new Map<string, number>();
  for (const ch of target) need.set(ch, (need.get(ch) ?? 0) + 1);

  const have = new Map<string, number>();
  for (const ch of text) {
    if (need.has(ch)) have.set(ch, (have.get(ch) ?? 0) + 1);
  }

  let ans = Infinity;
  for (const [ch, cnt] of need) {
    ans = Math.min(ans, Math.floor((have.get(ch) ?? 0) / cnt));
  }

  return ans === Infinity ? 0 : ans;
}

// Tests
console.log(maxNumberOfBalloons2("nlaebolko")); // 1
console.log(maxNumberOfBalloons2("loonbalxballpoon")); // 2
console.log(maxNumberOfBalloons2("leetcode")); // 0
```

```typescript
// ─── Solution 3: Frequency Array (fastest) — O(n) time, O(26) space ─────────
function maxNumberOfBalloons3(text: string): number {
  const freq = new Array(26).fill(0);
  for (const ch of text) freq[ch.charCodeAt(0) - 97]++;

  // b=1, a=0, l=11, o=14, n=13  (a=0, b=1, l=11, n=13, o=14)
  return Math.min(
    freq[1], // b
    freq[0], // a
    Math.floor(freq[11] / 2), // l
    Math.floor(freq[14] / 2), // o
    freq[13], // n
  );
}

// Tests
console.log(maxNumberOfBalloons3("nlaebolko")); // 1
console.log(maxNumberOfBalloons3("loonbalxballpoon")); // 2
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                     | Difficulty | Pattern  |
| ---- | ------------------------------------------- | ---------- | -------- |
| 383  | Ransom Note                                 | 🟢 Easy    | Hash Map |
| 242  | Valid Anagram                               | 🟢 Easy    | Hash Map |
| 1160 | Find Words That Can Be Formed by Characters | 🟢 Easy    | Counting |
| 2287 | Rearrange Characters to Make Target String  | 🟢 Easy    | Counting |
