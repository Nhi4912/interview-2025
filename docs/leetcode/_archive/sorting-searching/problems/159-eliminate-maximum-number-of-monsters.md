---
layout: page
title: "Eliminate Maximum Number of Monsters"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/eliminate-maximum-number-of-monsters"
---

# Eliminate Maximum Number of Monsters / Loại Bỏ Tối Đa Số Quái Vật

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đứng ở cổng thành — mỗi phút bạn chỉ bắn được một mũi tên. Quái vật nào đến sớm nhất thì phải diệt trước. Nếu có quái vật đến trước khi bạn kịp bắn đến lượt nó → **game over**.

**Pattern Recognition:**

- Signal: "kill one per minute" + "arrival times" → Greedy by earliest arrival
- Key insight: tính `arrival[i] = ceil(dist[i] / speed[i])`, sắp xếp tăng dần, kiểm tra tại mỗi vị trí `i` xem `arrival[i] > i` không

**Visual — ví dụ dist=[1,3,4], speed=[1,1,1]:**

```
Arrival times: ceil(1/1)=1, ceil(3/1)=3, ceil(4/1)=4
Sorted:        [1, 3, 4]

Minute 0 → kill monster arriving at t=1  ✅ (1 > 0)
Minute 1 → kill monster arriving at t=3  ✅ (3 > 1)
Minute 2 → kill monster arriving at t=4  ✅ (4 > 2)
Result: 3 (all eliminated!)

Example 2: dist=[1,1,2,3], speed=[1,2,1,1]
Arrivals: [1, 1, 2, 3] → sorted: [1, 1, 2, 3]

Minute 0 → t=1 ✅ (1 > 0)
Minute 1 → t=1 ❌ (1 ≤ 1) → stop!
Result: 1
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **Clarify constraints / Làm rõ ràng buộc**: Hỏi xem `dist[i]` và `speed[i]` có phải integer không? Có thể có quái vật tới ngay t=0 không?
2. **Greedy justification / Giải thích tham lam**: "Diệt quái đến sớm nhất trước — nếu không diệt nó, không có cách nào khác cứu vãn" → locally optimal = globally optimal.
3. **Ceiling division trick / Chia lấy trần**: Dùng `Math.ceil(d/s)` hoặc `Math.floor((d - 1) / s) + 1` để tránh lỗi float với số nguyên lớn.
4. **Off-by-one check / Kiểm tra sai một đơn vị**: Điều kiện phải là `arrival[i] <= i` thì thua (quái đến trước hoặc đúng lúc bạn bắn). `arrival[i] > i` mới kịp bắn.
5. **Edge cases / Trường hợp biên**: Chỉ 1 quái vật → luôn kill được tại t=0 trước khi nó đến; tất cả đến t=1 → chỉ kill 1.
6. **Follow-up / Câu hỏi mở rộng**: "What if we can kill k monsters per minute?" → giữ tư duy greedy, thay điều kiện thành `arrival[i] <= floor(i/k)`.

---

## Solutions

```typescript
/**
 * Solution 1: Greedy — Sort by Arrival Time
 * Tính thời gian đến của từng quái, sort, rồi greedy kiểm tra từng phút.
 *
 * Time:  O(n log n) — dominated by sorting
 * Space: O(n) — arrival time array
 */
function eliminateMaximum(dist: number[], speed: number[]): number {
  const n = dist.length;

  // Tính arrival time: ceil(dist[i] / speed[i])
  const arrival: number[] = dist.map((d, i) => Math.ceil(d / speed[i]));

  // Sort ascending — deal with the closest threat first
  arrival.sort((a, b) => a - b);

  // Greedy: at minute i, we can kill if monster hasn't arrived yet (arrival > i)
  for (let i = 0; i < n; i++) {
    if (arrival[i] <= i) return i; // monster i arrives at or before minute i → game over
  }

  return n; // eliminated all
}

// === Tests ===
console.log(eliminateMaximum([1, 3, 4], [1, 1, 1])); // 3
console.log(eliminateMaximum([1, 1, 2, 3], [1, 2, 1, 1])); // 1
console.log(eliminateMaximum([3, 2, 4], [5, 3, 2])); // 1
console.log(eliminateMaximum([5], [2])); // 1 (only 1 monster)
```

```typescript
/**
 * Solution 2: In-place sort with index pairing (no extra array allocation trick)
 * Sort dist/speed pairs together by arrival time — useful if you need to track
 * which monster you eliminated.
 *
 * Time:  O(n log n)
 * Space: O(n) — pair array
 */
function eliminateMaximumWithTracking(dist: number[], speed: number[]): number {
  // Zip into pairs and sort by arrival time
  const pairs = dist
    .map((d, i) => ({ arrival: Math.ceil(d / speed[i]), idx: i }))
    .sort((a, b) => a.arrival - b.arrival);

  let killed = 0;
  for (let minute = 0; minute < pairs.length; minute++) {
    if (pairs[minute].arrival <= minute) break; // arrived before we shoot → game over
    killed++;
  }

  return killed;
}

// === Tests ===
console.log(eliminateMaximumWithTracking([1, 3, 4], [1, 1, 1])); // 3
console.log(eliminateMaximumWithTracking([1, 1, 2, 3], [1, 2, 1, 1])); // 1
console.log(eliminateMaximumWithTracking([3, 2, 4], [5, 3, 2])); // 1
```

```typescript
/**
 * Solution 3: Integer-safe ceiling (no floating point)
 * Math.ceil(d/s) works for most inputs, but for very large integers,
 * use integer arithmetic: ceil(a/b) = Math.floor((a + b - 1) / b)
 *
 * Time:  O(n log n)
 * Space: O(n)
 */
function eliminateMaximumSafe(dist: number[], speed: number[]): number {
  // Integer ceiling: avoid floating-point precision issues
  const arrival = dist
    .map((d, i) => Math.floor((d + speed[i] - 1) / speed[i]))
    .sort((a, b) => a - b);

  for (let i = 0; i < arrival.length; i++) {
    if (arrival[i] <= i) return i;
  }

  return arrival.length;
}

// === Tests ===
console.log(eliminateMaximumSafe([1, 3, 4], [1, 1, 1])); // 3
console.log(eliminateMaximumSafe([1, 1, 2, 3], [1, 2, 1, 1])); // 1
console.log(eliminateMaximumSafe([3, 2, 4], [5, 3, 2])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Pattern           | Note                                     |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                                         | Greedy + Counting | Greedy scheduling under time constraints |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)                                   | Greedy + Sorting  | Sort by end time, greedy removal         |
| [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons) | Greedy + Sorting  | Sort by end, count shots                 |
| [IPO](https://leetcode.com/problems/ipo)                                                                               | Greedy + Heap     | Maximize profit with constraints         |
