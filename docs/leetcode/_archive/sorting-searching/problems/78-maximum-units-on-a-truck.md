---
layout: page
title: "Maximum Units on a Truck"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-units-on-a-truck"
---

# Maximum Units on a Truck / Số Đơn Vị Tối Đa Trên Xe Tải

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy + Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Largest Number](https://leetcode.com/problems/largest-number) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Bạn đang xếp hàng vào xe tải với giới hạn số thùng. Mỗi loại thùng chứa số đơn vị hàng hóa khác nhau. Chiến lược tốt nhất: **xếp loại thùng chứa nhiều nhất trước** cho đến khi xe đầy. Greedy tham lam hoàn toàn tối ưu vì mọi thùng đều chiếm 1 chỗ như nhau.

```
boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4

Sort by unitsPerBox desc: [[1,3],[2,2],[3,1]]
Take 1 box of type [3]: units += 1×3 = 3, remaining = 3
Take 2 boxes of type [2]: units += 2×2 = 4+3 = 7, remaining = 1
Take 1 box of type [1]: units += 1×1 = 8, remaining = 0
Answer: 8  ✅
```

---

## Problem Description

Given `boxTypes[i] = [numberOfBoxes, numberOfUnitsPerBox]` and `truckSize` (max boxes), return the **maximum total units** you can put on the truck.

- **Example 1:** `boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4` → `8`
- **Example 2:** `boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10` → `91`

---

## 📝 Interview Tips

- 🎯 **Greedy proof:** Mọi thùng chiếm đúng 1 chỗ → luôn nên chọn thùng có units/box cao nhất trước
- 🔽 **Sort key:** Sort theo `numberOfUnitsPerBox` giảm dần — không phải `numberOfBoxes`
- ✂️ **Partial take:** Có thể lấy ít hơn `numberOfBoxes` nếu xe sắp đầy
- 📊 **Complexity:** O(n log n) cho sort, O(n) cho greedy scan
- ⚠️ **Edge cases:** `truckSize >= tổng tất cả boxes` → lấy hết; `truckSize = 0` → return 0
- 💡 **Follow-up:** Nếu mỗi loại thùng có trọng lượng khác nhau → knapsack DP không còn greedy

---

## Solutions

### Solution 1: Sort by units desc, greedy fill

```typescript
/**
 * Sort by unitsPerBox descending, greedily fill the truck
 * Time: O(n log n)  Space: O(1)
 */
function maximumUnits(boxTypes: number[][], truckSize: number): number {
  boxTypes.sort((a, b) => b[1] - a[1]);
  let totalUnits = 0;
  let remaining = truckSize;

  for (const [count, units] of boxTypes) {
    if (remaining <= 0) break;
    const take = Math.min(count, remaining);
    totalUnits += take * units;
    remaining -= take;
  }
  return totalUnits;
}

console.log(
  maximumUnits(
    [
      [1, 3],
      [2, 2],
      [3, 1],
    ],
    4,
  ),
); // 8
console.log(
  maximumUnits(
    [
      [5, 10],
      [2, 5],
      [4, 7],
      [3, 9],
    ],
    10,
  ),
); // 91
```

### Solution 2: Reduce pattern (functional style)

```typescript
/**
 * Same greedy logic using reduce for accumulation
 * Time: O(n log n)  Space: O(1)
 */
function maximumUnits2(boxTypes: number[][], truckSize: number): number {
  boxTypes.sort((a, b) => b[1] - a[1]);

  return boxTypes.reduce(
    (acc, [count, units]) => {
      const take = Math.min(count, acc.cap);
      return { total: acc.total + take * units, cap: acc.cap - take };
    },
    { total: 0, cap: truckSize },
  ).total;
}

console.log(
  maximumUnits2(
    [
      [1, 3],
      [2, 2],
      [3, 1],
    ],
    4,
  ),
); // 8
console.log(maximumUnits2([[1, 3]], 3)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                         | Difficulty | Connection                         |
| ----------------------------------------------------------------------------------------------- | ---------- | ---------------------------------- |
| [Assign Cookies](https://leetcode.com/problems/assign-cookies/)                                 | 🟢 Easy    | Greedy matching with sorted arrays |
| [IPO](https://leetcode.com/problems/ipo/)                                                       | 🔴 Hard    | Greedy with heap, pick max profit  |
| [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work/)         | 🟡 Medium  | Sort + greedy assignment           |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                                 | 🟡 Medium  | Greedy frequency scheduling        |
| [Minimum Cost to Hire K Workers](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/) | 🔴 Hard    | Greedy sort with constraint        |
