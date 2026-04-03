---
layout: page
title: "Minimum Array Changes to Make Differences Equal"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-array-changes-to-make-differences-equal"
---

# Minimum Array Changes to Make Differences Equal / Số Thay Đổi Tối Thiểu Để Sai Số Bằng Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum / Difference Array

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Cho mảng n phần tử (n chẵn). Với mỗi cặp (i, n-1-i), tính hiệu `d = |nums[i] - nums[n-1-i]|` và max có thể đạt được với 1 thay đổi: `maxVal = max(nums[i], nums[n-1-i])` hoặc `k`. Dùng difference array: nếu chọn target `x`, pair cần 0 thay đổi nếu d==x, cần 1 nếu x <= maxVal, cần 2 nếu x > maxVal.

**EN:** For each pair (i, n-1-i): diff `d`, max reach with one change = `max(nums[i], nums[n-1-i])` or `k`. Use a difference array over all possible target values: mark [0, maxReach] needs at most 1 change, but at value `d` needs 0. Then find the minimum over all targets.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Array Changes to Make Differences Equal example:**

```
nums=[1,0,1,2,4,3], k=4
Pairs: (1,3),(0,4),(1,2) → diffs: 2,4,1, maxReach: 3,4,2

For target x, cost:
  pair(1,3): d=2, reach=3 → cost=0 if x==2, cost=1 if 0<x<=3, cost=2 if x>3
Sweep with diff array to find min total cost over all x in [0,k].
```

---

---

## Problem Description

| #    | Problem                                                   | Difficulty | Pattern          |
| ---- | --------------------------------------------------------- | ---------- | ---------------- |
| 2772 | Apply Operations to Make All Array Elements Equal to Zero | 🟡 Medium  | Difference Array |
| 1094 | Car Pooling                                               | 🟡 Medium  | Difference Array |
| 2381 | Shifting Letters II                                       | 🟡 Medium  | Difference Array |

---

## 📝 Interview Tips

- 🟡 **EN:** Each pair independently: cost 0 if target equals current diff, cost 1 if within reach, cost 2 otherwise.
  **VI:** Mỗi cặp độc lập: chi phí 0 nếu target = diff hiện tại, 1 nếu trong tầm với, 2 nếu không.
- 🟡 **EN:** "Max reach with one change" = max(a, b, k) where a,b are pair values and k is bound.
  **VI:** "Tầm với tối đa với 1 thay đổi" = max(a, b, k).
- 🟡 **EN:** Use a difference/delta array to count cheaply how many pairs need 2 changes for each target.
  **VI:** Dùng mảng delta để đếm rẻ số cặp cần 2 thay đổi cho mỗi target.
- 🟡 **EN:** Base cost = n/2 (one change per pair). Subtract pairs where target == diff (save 1) or target in range (save 1).
  **VI:** Chi phí cơ sở = n/2. Trừ đi cặp tiết kiệm được.
- 🟡 **EN:** Sweep over all targets 0..k using prefix sums of the delta array.
  **VI:** Duyệt tất cả target 0..k bằng prefix sum của mảng delta.
- 🟡 **EN:** Time O(n + k), Space O(k) — elegant once you see the difference array trick.
  **VI:** Thời gian O(n + k), Không gian O(k) — thanh lịch khi nhận ra trick mảng delta.

---

---

## Solutions

```typescript
function minimumChanges_brute(nums: number[], k: number): number {
  const n = nums.length;
  let ans = Infinity;
  for (let target = 0; target <= k; target++) {
    let cost = 0;
    for (let i = 0; i < n / 2; i++) {
      const a = nums[i],
        b = nums[n - 1 - i];
      const d = Math.abs(a - b);
      if (d === target) cost += 0;
      else if (target <= Math.max(a, b, k)) cost += 1;
      else cost += 2;
    }
    ans = Math.min(ans, cost);
  }
  return ans;
}

console.log(minimumChanges_brute([1, 0, 1, 2, 4, 3], 4)); // 2
console.log(minimumChanges_brute([0, 1, 2, 3, 4], 4)); // 0 (odd n, only n/2 pairs)

function minimumChanges(nums: number[], k: number): number {
  const n = nums.length;
  const half = n >> 1;

  // delta[x] += change in "pairs needing 2 changes" as target increases past x
  // We track: for each pair, the range where cost is 1 vs 2
  // cost[target] = (# pairs with diff != target AND target > maxReach) * 2
  //              + (# pairs with diff != target AND target <= maxReach) * 1
  // Base: assume all half pairs need 1 change → total = half
  // For pairs where target == diff: save 1 (need 0 changes)
  // For pairs where target > maxReach: pay extra 1 (need 2 instead of 1)

  const delta = new Array(k + 2).fill(0);
  const exactSave = new Array(k + 1).fill(0); // pairs where diff == target

  for (let i = 0; i < half; i++) {
    const a = nums[i],
      b = nums[n - 1 - i];
    const d = Math.abs(a - b);
    const maxReach = Math.max(a, b, k);
    if (d <= k) exactSave[d]++;
    // For target > maxReach: this pair costs 2 instead of 1 (+1 extra)
    if (maxReach + 1 <= k) delta[maxReach + 1]++;
  }

  // Sweep: base cost = half (1 change per pair), adjust with delta
  let ans = Infinity;
  let extra = 0; // accumulated extra cost (pairs needing 2 changes)
  for (let x = 0; x <= k; x++) {
    extra += delta[x];
    const cost = half - exactSave[x] + extra; // pairs needing change, minus saved
    ans = Math.min(ans, cost);
  }
  return ans;
}

// Test cases
console.log(minimumChanges([1, 0, 1, 2, 4, 3], 4)); // Expected: 2
console.log(minimumChanges([3, 1, 2, 2, 1, 3], 4)); // Expected: 0 (all diffs equal 0 or same)
console.log(minimumChanges([2, 2], 3)); // Expected: 0
```

---

## 🔗 Related Problems

| #    | Problem                                                   | Difficulty | Pattern          |
| ---- | --------------------------------------------------------- | ---------- | ---------------- |
| 2772 | Apply Operations to Make All Array Elements Equal to Zero | 🟡 Medium  | Difference Array |
| 1094 | Car Pooling                                               | 🟡 Medium  | Difference Array |
| 2381 | Shifting Letters II                                       | 🟡 Medium  | Difference Array |
