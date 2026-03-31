---
layout: page
title: "Maximum Population Year"
difficulty: Easy
category: Array
tags: [Array, Counting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-population-year"
---

# Maximum Population Year / Năm Đông Dân Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Prefix Sum / Difference Array
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hội trường có 101 ghế hàng ngang (năm 1950–2050). Mỗi người sinh ra thì "bật đèn ghế" từ năm sinh, và "tắt đèn" khi mất. Bạn cần tìm ghế nào đang sáng nhiều đèn nhất — kỹ thuật mảng hiệu (difference array) xử lý mỗi sự kiện trong O(1) rồi quét một lần tìm đỉnh.

**Pattern Recognition:**

- "Count active elements in overlapping intervals" → Difference Array
- Range [birth, death-1] với domain cố định [1950, 2050] → Bucket array size 101
- Need earliest max → iterate left to right, take strict `>`

**Visual:**

```
logs = [[1993,1999],[2000,2010]]

diff[offset]:  ...43  ...49  50  ...60
               +1     -1    +1   -1

prefix scan:
 1993(43): 0+1=1 → bestPop=1, bestYear=1993
 1999(49): 1-1=0
 2000(50): 0+1=1 → NOT > bestPop, skip (earliest wins)
→ return 1993
```

## Problem Description

Given `logs[i] = [birth_i, death_i]`, person `i` is alive during years `[birth_i, death_i - 1]`. Return the **earliest** year (1950–2050) with maximum population.

- `[[1993,1999],[2000,2010]]` → `1993`
- `[[1950,1961],[1960,1971],[1970,1981]]` → `1960`
- `[[2000,2100]]` → `2000`

## 📝 Interview Tips

1. **Clarify**: Death year is exclusive — person alive `[birth, death-1]` / năm mất không tính vào dân số
2. **Approach**: Difference array on 101-size bucket — O(n + 101) ≈ O(n) / mảng hiệu kích thước cố định
3. **Edge cases**: Multiple years with same max → return earliest / nhiều năm cùng max → trả năm nhỏ nhất
4. **Optimize**: Bucket size constant → overall O(n) time, O(1) space / kích thước bucket hằng số
5. **Follow-up**: If years arbitrary large → sort events or coordinate compression / nếu khoảng năm rất lớn thì nén tọa độ
6. **Complexity**: Time O(n), Space O(1) with constant-size array / thời gian O(n), không gian O(1)

## Solutions

```typescript
/** Solution 1: Brute Force — check population for each year in range
 * Time: O(n * 101) | Space: O(1)
 */
function maximumPopulationBrute(logs: number[][]): number {
  let bestYear = 1950,
    bestCount = 0;
  for (let year = 1950; year < 2050; year++) {
    let count = 0;
    for (const [birth, death] of logs) {
      if (birth <= year && year < death) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      bestYear = year;
    }
  }
  return bestYear;
}

/** Solution 2: Difference Array — mark +1 at birth, -1 at death, prefix scan
 * Time: O(n) | Space: O(1) — fixed 102-element array
 */
function maximumPopulation(logs: number[][]): number {
  const BASE = 1950;
  const diff = new Array(102).fill(0);

  for (const [birth, death] of logs) {
    diff[birth - BASE]++;
    diff[death - BASE]--; // person NOT alive in death year
  }

  let bestYear = BASE,
    bestPop = 0,
    cur = 0;
  for (let i = 0; i < 101; i++) {
    cur += diff[i];
    if (cur > bestPop) {
      // strict >: keeps earliest year on tie
      bestPop = cur;
      bestYear = BASE + i;
    }
  }
  return bestYear;
}

/** Solution 3: Sort Events — merge sorted birth/death events
 * Time: O(n log n) | Space: O(n)
 */
function maximumPopulationEvents(logs: number[][]): number {
  const events: [number, number][] = [];
  for (const [birth, death] of logs) {
    events.push([birth, 1]);
    events.push([death, -1]);
  }
  // deaths (-1) before births (+1) at same year so they cancel first
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  let bestYear = 1950,
    bestPop = 0,
    cur = 0;
  for (const [year, delta] of events) {
    cur += delta;
    if (cur > bestPop) {
      bestPop = cur;
      bestYear = year;
    }
  }
  return bestYear;
}

// Test cases
console.log(
  maximumPopulation([
    [1993, 1999],
    [2000, 2010],
  ]),
); // 1993
console.log(
  maximumPopulation([
    [1950, 1961],
    [1960, 1971],
    [1970, 1981],
  ]),
); // 1960
console.log(maximumPopulation([[2000, 2100]])); // 2000
console.log(
  maximumPopulationBrute([
    [1993, 1999],
    [2000, 2010],
  ]),
); // 1993
console.log(
  maximumPopulationEvents([
    [1950, 1961],
    [1960, 1971],
    [1970, 1981],
  ]),
); // 1960
console.log(
  maximumPopulation([
    [1950, 1951],
    [1950, 1951],
    [1951, 1952],
  ]),
); // 1950
```

## 🔗 Related Problems

| Problem                                                                                          | Relationship                        |
| ------------------------------------------------------------------------------------------------ | ----------------------------------- |
| [Car Pooling](https://leetcode.com/problems/car-pooling)                                         | Difference array on time intervals  |
| [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) | Identical interval counting pattern |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                     | Prefix sum on running totals        |
