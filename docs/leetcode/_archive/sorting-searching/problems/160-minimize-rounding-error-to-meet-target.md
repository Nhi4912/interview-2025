---
layout: page
title: "Minimize Rounding Error to Meet Target"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, String, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimize-rounding-error-to-meet-target"
---

# Minimize Rounding Error to Meet Target / Giảm Thiểu Sai Số Làm Tròn Để Đạt Mục Tiêu

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Mỗi số thập phân có thể làm tròn xuống (floor) hoặc lên (ceil). Sai số khi floor = phần thập phân, sai số khi ceil = 1 − phần thập phân. Ta cần round-up đúng k = target − Σfloor(prices[i]) phần tử. Để tổng sai số nhỏ nhất, chọn k phần tử có phần thập phân LỚN NHẤT để ceil (vì sai số 1−frac nhỏ hơn).

**Analogy:** Bạn đổ nước vào N cốc — muốn đổ đầy đúng target cốc, hãy ưu tiên đổ những cốc đã gần đầy nhất để tiết kiệm nước nhất.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimize Rounding Error to Meet Target example:**

```
prices = ["0.700","2.800","4.900"]  target=8
floors  = [0,      2,      4]      sumFloor=6  → k=2 round-ups
fracs   = [0.7,    0.8,    0.9]

Sort fracs desc → [0.9, 0.8, 0.7]
ceil top-2:  err += (1-0.9)=0.1  +  (1-0.8)=0.2
floor rest:  err += 0.7
total error = 1.0  → "1.000"
```

---

---

## Problem Description

| Problem                                                                              | Difficulty | Connection               |
| ------------------------------------------------------------------------------------ | ---------- | ------------------------ |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                       | 🟡 Medium  | Greedy assignment        |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | 🟡 Medium  | Greedy sort by criterion |
| [Candy](https://leetcode.com/problems/candy)                                         | 🔴 Hard    | Greedy with constraints  |

---

## 📝 Interview Tips

- **EN:** Parse each string to float; `Math.floor` extracts integer part / **VI:** Dùng `parseFloat` rồi `Math.floor` lấy phần nguyên
- **EN:** k = target − Σfloor(prices[i]); if k < 0 or k > n return "-1" / **VI:** Nếu k ngoài [0,n] trả "-1"
- **EN:** Sort fractional parts descending; top-k get ceil, rest get floor / **VI:** Sắp xếp phần thập phân giảm dần, k phần tử đầu được ceil
- **EN:** Error for floor item = frac; error for ceil item = 1 − frac / **VI:** Lỗi floor = frac, lỗi ceil = 1 − frac
- **EN:** Sum all errors, format to exactly 3 decimal places with `.toFixed(3)` / **VI:** Tổng lỗi, format 3 chữ số thập phân
- **EN:** Edge: whole numbers (frac=0) contribute 0 error whether floor or ceil / **VI:** Số nguyên (frac=0) không gây lỗi dù làm tròn hướng nào

---

---

## Solutions

```typescript
/**
 * Sort fractional parts descending; ceil top-k to hit target sum.
 * Time: O(n log n)  Space: O(n)
 */
function minimizeError(prices: string[], target: number): string {
  const fracs: number[] = [];
  let sumFloor = 0;

  for (const p of prices) {
    const v = parseFloat(p);
    const f = Math.floor(v);
    sumFloor += f;
    fracs.push(v - f);
  }

  const k = target - sumFloor; // number of elements to ceil
  if (k < 0 || k > prices.length) return "-1";

  // Sort ascending so last-k are the largest fracs (cheapest to ceil)
  fracs.sort((a, b) => a - b);
  const n = fracs.length;

  let err = 0;
  for (let i = 0; i < n - k; i++) err += fracs[i]; // floor error
  for (let i = n - k; i < n; i++) err += 1 - fracs[i]; // ceil error

  return err.toFixed(3);
}

// Tests
console.log(minimizeError(["0.700", "2.800", "4.900"], 8)); // "1.000"
console.log(minimizeError(["1.500", "2.500", "3.500"], 10)); // "-1"
console.log(minimizeError(["2.000", "2.000"], 4)); // "0.000"
console.log(minimizeError(["1.500", "2.500"], 4)); // "1.000"

/**
 * Keep which items are ceil'd vs floor'd for clarity.
 * Time: O(n log n)  Space: O(n)
 */
function minimizeError2(prices: string[], target: number): string {
  const n = prices.length;
  const nums = prices.map(Number);
  const floors = nums.map(Math.floor);
  const fracs = nums.map((v, i) => v - floors[i]);

  const sumFloor = floors.reduce((s, x) => s + x, 0);
  const k = target - sumFloor;
  if (k < 0 || k > n) return "-1";

  // Indices sorted by fractional part descending
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => fracs[b] - fracs[a]);

  let totalErr = 0;
  for (let rank = 0; rank < n; rank++) {
    const i = idx[rank];
    totalErr += rank < k ? 1 - fracs[i] : fracs[i];
  }

  return totalErr.toFixed(3);
}

// Tests
console.log(minimizeError2(["0.700", "2.800", "4.900"], 8)); // "1.000"
console.log(minimizeError2(["1.500", "2.500", "3.500"], 10)); // "-1"
console.log(minimizeError2(["1.000", "2.000", "3.000"], 6)); // "0.000"
```

---

## 🔗 Related Problems

| Problem                                                                              | Difficulty | Connection               |
| ------------------------------------------------------------------------------------ | ---------- | ------------------------ |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                       | 🟡 Medium  | Greedy assignment        |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | 🟡 Medium  | Greedy sort by criterion |
| [Candy](https://leetcode.com/problems/candy)                                         | 🔴 Hard    | Greedy with constraints  |
