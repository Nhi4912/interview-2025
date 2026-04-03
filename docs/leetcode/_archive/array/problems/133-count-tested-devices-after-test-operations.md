---
layout: page
title: "Count Tested Devices After Test Operations"
difficulty: Easy
category: Array
tags: [Array, Simulation, Counting]
leetcode_url: "https://leetcode.com/problems/count-tested-devices-after-test-operations"
---

# Count Tested Devices After Test Operations / Đếm Thiết Bị Đã Kiểm Tra

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Simulation / Counting
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có một đội thợ xây, mỗi người cần pin đủ để làm việc. Mỗi lần kiểm tra một người thành công, tất cả người chưa kiểm tra mất 1% pin. Thay vì giảm toàn bộ mảng O(n²), bạn nhận ra: thiết bị thứ `i` thực sự bị kiểm tra nếu `battery[i] > số thiết bị đã kiểm tra trước đó`. Chỉ cần đếm một lần duyệt.

**Pattern Recognition:**

- "Battery decreases for all subsequent" → Can track "virtual drain" as a counter
- `effective_battery[i] = batteryPercentages[i] - tested_count_so_far`
- Test succeeds if `effective_battery[i] > 0`

**Visual:**

```
batteryPercentages = [1, 1, 2, 1, 3]
tested = 0

i=0: battery=1, effective=1-0=1 > 0 → test ✓, tested=1
i=1: battery=1, effective=1-1=0 > 0? NO → skip
i=2: battery=2, effective=2-1=1 > 0 → test ✓, tested=2
i=3: battery=1, effective=1-2=-1 > 0? NO → skip
i=4: battery=3, effective=3-2=1 > 0 → test ✓, tested=3

→ return 3
```

## Problem Description

You have `n` devices with `batteryPercentages[i]`. Test each device from left to right: if its battery > 0, mark it tested and decrease all subsequent batteries by 1. Return the count of tested devices.

- `[1,1,2,1,3]` → `3`
- `[0,1,2]` → `2`
- `[1,0,1]` → `2`

## 📝 Interview Tips

1. **Clarify**: Battery decreases by 1 for ALL subsequent devices after each test / pin giảm cho tất cả thiết bị sau
2. **Approach**: Track `tested` count — device `i` tests if `battery[i] > tested` / theo dõi biến đếm
3. **Edge cases**: Battery already 0 at start → never tested / pin ban đầu = 0 thì không kiểm tra
4. **Optimize**: O(n) with counter instead of O(n²) simulation / O(n) thay vì O(n²)
5. **Follow-up**: What if drain differs per test? → Must simulate properly / nếu drain khác nhau thì mô phỏng thật
6. **Complexity**: Time O(n), Space O(1) / thời gian O(n), không gian O(1)

## Solutions

```typescript
/** Solution 1: Naive Simulation — O(n²) directly simulate battery drain
 * Time: O(n²) | Space: O(n)
 */
function countTestedDevicesNaive(batteryPercentages: number[]): number {
  const b = [...batteryPercentages];
  let count = 0;
  for (let i = 0; i < b.length; i++) {
    if (b[i] > 0) {
      count++;
      for (let j = i + 1; j < b.length; j++) {
        b[j] = Math.max(0, b[j] - 1);
      }
    }
  }
  return count;
}

/** Solution 2: Optimized — track "virtual drain" as tested count
 * Time: O(n) | Space: O(1)
 * Key insight: device i is tested iff batteryPercentages[i] > (# tested before i)
 */
function countTestedDevices(batteryPercentages: number[]): number {
  let tested = 0;
  for (const battery of batteryPercentages) {
    // effective battery = battery - tested (total drain accumulated)
    if (battery > tested) {
      tested++;
    }
  }
  return tested;
}

/** Solution 3: Filter-based (same logic, different style)
 * Time: O(n) | Space: O(1)
 */
function countTestedDevicesFunctional(batteryPercentages: number[]): number {
  return batteryPercentages.reduce((tested, battery) => {
    return tested + (battery > tested ? 1 : 0);
  }, 0);
}

// Test cases
console.log(countTestedDevices([1, 1, 2, 1, 3])); // 3
console.log(countTestedDevices([0, 1, 2])); // 2
console.log(countTestedDevices([1, 0, 1])); // 2
console.log(countTestedDevicesNaive([1, 1, 2, 1, 3])); // 3
console.log(countTestedDevicesFunctional([0, 1, 2])); // 2
console.log(countTestedDevices([5, 5, 5, 5])); // 4 (all have plenty)
```

## 🔗 Related Problems

| Problem                                                                | Relationship                           |
| ---------------------------------------------------------------------- | -------------------------------------- |
| [Asteroid Collision](https://leetcode.com/problems/asteroid-collision) | Simulation with cascading effects      |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)         | Count tasks with resource constraints  |
| [Gas Station](https://leetcode.com/problems/gas-station)               | Running balance determines feasibility |
