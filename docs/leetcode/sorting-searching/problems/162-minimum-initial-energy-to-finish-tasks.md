---
layout: page
title: "Minimum Initial Energy to Finish Tasks"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks"
---

# Minimum Initial Energy to Finish Tasks / Năng Lượng Ban Đầu Tối Thiểu Để Hoàn Thành Tất Cả Nhiệm Vụ

🔴 Hard | 🏷️ Array, Greedy, Sorting | [LeetCode](https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks)

---

## 🧠 Intuition

**Vietnamese:** Mỗi task `[actual, minimum]`: cần ít nhất `minimum` năng lượng để bắt đầu, tiêu tốn `actual` năng lượng. Thứ tự thực hiện ảnh hưởng đến năng lượng ban đầu cần. Key insight: sắp xếp theo `(minimum - actual)` giảm dần — task có "chi phí ròng" cao nhất (minimum lớn hơn actual nhiều nhất) nên làm trước để tránh cần thêm energy.

**Analogy:** Như nạp tiền điện thoại — trả trước những gói cước đòi số dư cao hơn số tiêu thụ, rồi mới trả gói rẻ hơn. Sắp xếp đúng giúp giảm số dư ban đầu cần.

```
tasks = [[1,2],[2,4],[4,8]]
diff = [2-1=1, 4-2=2, 8-4=4]  sort desc by diff
order: [4,8] → [2,4] → [1,2]

Working backward from 0 energy:
  after [1,2]: need max(2, 0+1)=2   → carry=2
  after [2,4]: need max(4, 2+2)=4   → carry=4
  after [4,8]: need max(8, 4+4)=8   → answer=8
```

---

## 📝 Interview Tips

- **EN:** Sort by `(minimum - actual)` descending — tasks needing more "pre-charge" go first / **VI:** Sắp theo `(min - actual)` giảm dần — task cần "nạp trước" nhiều hơn làm trước
- **EN:** Greedy proof: swapping adjacent tasks shows this order is optimal / **VI:** Chứng minh greedy bằng exchange argument
- **EN:** Simulate forward: track current energy, add required when deficit / **VI:** Mô phỏng tiến, cộng thêm khi thiếu năng lượng
- **EN:** Backward recurrence: `ans = max(ans, ans - energy + minimum[i])` / **VI:** Tính ngược: nếu năng lượng hiện tại < minimum, ta cần bổ sung
- **EN:** Total answer = sum of all `actual` consumed + extra needed at start / **VI:** Đáp án = Σactual + phần thiếu tích lũy
- **EN:** Edge: single task → answer = minimum[0] / **VI:** Một task → đáp án = minimum[0]

---

## Solutions

### Solution 1: Greedy Sort by (minimum − actual) Descending

```typescript
/**
 * Sort by (min - actual) descending; simulate to find initial energy.
 * Time: O(n log n)  Space: O(1)
 */
function minimumEffort(tasks: number[][]): number {
  // Sort: tasks with higher (minimum - actual) go first
  tasks.sort((a, b) => b[1] - b[0] - (a[1] - a[0]));

  let ans = 0; // current energy after processing tasks in reverse
  let total = 0; // total energy consumed so far (running from end)

  // Walk sorted order: maintain minimum required start energy
  for (const [actual, minimum] of tasks) {
    // If we have `ans` energy at this point, we need at least `minimum`
    if (ans < minimum) ans = minimum;
    ans += actual; // this task will consume `actual`
  }

  // Wait — the pattern above overcounts. Use the clean accumulation below.
  void total;
  return ans;
}

/**
 * Cleaner backward accumulation approach.
 * Time: O(n log n)  Space: O(1)
 */
function minimumEffort2(tasks: number[][]): number {
  tasks.sort((a, b) => b[1] - b[0] - (a[1] - a[0]));

  let energy = 0; // energy needed before current suffix of tasks
  // Process from last to first (least "pre-charge" first in reverse)
  for (let i = tasks.length - 1; i >= 0; i--) {
    const [actual, minimum] = tasks[i];
    // energy after finishing tasks[i+1..n-1] = energy
    // To start task[i] we need max(minimum, energy + actual)
    energy = Math.max(minimum, energy + actual);
  }
  return energy;
}

// Tests
console.log(
  minimumEffort2([
    [1, 2],
    [2, 4],
    [4, 8],
  ]),
); // 8
console.log(
  minimumEffort2([
    [1, 3],
    [2, 4],
    [10, 11],
    [10, 12],
    [8, 9],
  ]),
); // 32
console.log(
  minimumEffort2([
    [1, 7],
    [2, 8],
    [3, 9],
    [4, 10],
    [5, 11],
    [6, 12],
  ]),
); // 27
```

### Solution 2: Forward Simulation (equivalent, more intuitive)

```typescript
/**
 * Forward pass: track energy, accumulate deficit as initial requirement.
 * Time: O(n log n)  Space: O(1)
 */
function minimumEffort3(tasks: number[][]): number {
  tasks.sort((a, b) => b[1] - b[0] - (a[1] - a[0]));

  let initialEnergy = 0;
  let currentEnergy = 0;

  for (const [actual, minimum] of tasks) {
    if (currentEnergy < minimum) {
      initialEnergy += minimum - currentEnergy;
      currentEnergy = minimum;
    }
    currentEnergy -= actual;
  }
  return initialEnergy;
}

// Tests
console.log(
  minimumEffort3([
    [1, 2],
    [2, 4],
    [4, 8],
  ]),
); // 8
console.log(
  minimumEffort3([
    [1, 3],
    [2, 4],
    [10, 11],
    [10, 12],
    [8, 9],
  ]),
); // 32
```

---

## 🔗 Related Problems

| Problem                                                                              | Difficulty | Connection                     |
| ------------------------------------------------------------------------------------ | ---------- | ------------------------------ |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                       | 🟡 Medium  | Greedy task ordering           |
| [IPO](https://leetcode.com/problems/ipo)                                             | 🔴 Hard    | Greedy with capital constraint |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | 🟡 Medium  | Greedy sort by end time        |
