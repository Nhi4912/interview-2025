---
layout: page
title: "Truncate Sentence"
difficulty: Easy
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/truncate-sentence"
---

# Truncate Sentence / Cắt Ngắn Câu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Câu là dãy từ ngăn cách bằng dấu cách. Chỉ giữ `k` từ đầu tiên — như cắt một đoạn thịt đúng `k` lát từ đầu.

```
s = "Hello how are you Contestant"  k = 4
Split: ["Hello","how","are","you","Contestant"]
Slice(0,4): ["Hello","how","are","you"]
Join: "Hello how are you"
```

**Alternative — scan without split**: Count spaces; when we've passed `k` spaces (or reached end), stop.

```
s = "Hello how are you Contestant"
     ↑     ↑   ↑   ↑
count spaces: 1, 2, 3 → at space 3 (index 13), k=4 words end at next space (index 17)
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN**: `split(" ")` + `slice(0,k)` + `join(" ")` — most readable one-liner
  **VI**: `split(" ")` + `slice(0,k)` + `join(" ")` — cách đọc hiểu nhất
- 🔑 **EN**: No-split approach: scan for k-th space, return `s.slice(0, idx)`
  **VI**: Cách không dùng split: tìm dấu cách thứ k, trả về `s.slice(0, idx)`
- 🔑 **EN**: Space count approach avoids O(n) array allocation — O(n) time, O(1) extra space
  **VI**: Đếm dấu cách tránh tạo mảng O(n) — thời gian O(n), không gian phụ O(1)
- 🔑 **EN**: If `k` equals number of words, return entire string (no trailing space issue)
  **VI**: Nếu `k` bằng số từ, trả về toàn bộ chuỗi (không có vấn đề dấu cách cuối)
- 🔑 **EN**: Words are separated by exactly one space (guaranteed by problem)
  **VI**: Các từ ngăn cách bởi đúng một dấu cách (đề đảm bảo)
- 🔑 **EN**: Edge: `k=1` → return first word; `k=n` (all words) → return whole sentence
  **VI**: Trường hợp đặc biệt: `k=1` → trả về từ đầu; `k=n` → trả về cả câu

---

```typescript
// ─── Solution 1: Split + Slice + Join — O(n) time, O(n) space ────────────────
function truncateSentence(s: string, k: number): string {
  return s.split(" ").slice(0, k).join(" ");
}

// Tests
console.log(truncateSentence("Hello how are you Contestant", 4)); // "Hello how are you"
console.log(truncateSentence("What is the solution to this problem", 4)); // "What is the solution"
console.log(truncateSentence("chopper is not a tanuki", 5)); // "chopper is not a tanuki"
console.log(truncateSentence("word", 1)); // "word"
```

```typescript
// ─── Solution 2: Count Spaces — O(n) time, O(1) extra space ──────────────────
function truncateSentence2(s: string, k: number): string {
  let spaceCount = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === " ") {
      spaceCount++;
      if (spaceCount === k) {
        return s.slice(0, i); // found k-th space → cut here
      }
    }
  }

  return s; // k equals total words → return full string
}

// Tests
console.log(truncateSentence2("Hello how are you Contestant", 4)); // "Hello how are you"
console.log(truncateSentence2("What is the solution to this problem", 4)); // "What is the solution"
console.log(truncateSentence2("word", 1)); // "word"
```

```typescript
// ─── Solution 3: IndexOf with offset — O(n) time ─────────────────────────────
function truncateSentence3(s: string, k: number): string {
  let idx = -1;
  for (let i = 0; i < k; i++) {
    idx = s.indexOf(" ", idx + 1);
    if (idx === -1) return s; // fewer than k spaces → return full string
  }
  return s.slice(0, idx);
}

// Tests
console.log(truncateSentence3("Hello how are you Contestant", 4)); // "Hello how are you"
console.log(truncateSentence3("chopper is not a tanuki", 5)); // "chopper is not a tanuki"
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                             | Difficulty | Pattern |
| ---- | ----------------------------------- | ---------- | ------- |
| 151  | Reverse Words in a String           | 🟡 Medium  | String  |
| 557  | Reverse Words in a String III       | 🟢 Easy    | String  |
| 2710 | Remove Trailing Zeros From a String | 🟢 Easy    | String  |
| 58   | Length of Last Word                 | 🟢 Easy    | String  |
