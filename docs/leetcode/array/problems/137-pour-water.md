---
layout: page
title: "Pour Water"
difficulty: Medium
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/pour-water"
---

# Pour Water / Đổ Nước

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Simulation

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Hãy tưởng tượng bạn đang đổ nước lên bản đồ độ cao: nước luôn chảy xuống. Với mỗi giọt nước thả tại vị trí `k`: trước tiên quét sang TRÁI tìm nơi thấp hơn, nếu không được thì quét sang PHẢI, nếu không được thì đứng tại chỗ.

**EN:** Simulate gravity: each water drop at `k` first tries to flow LEFT to find a lower spot, then RIGHT, then stays put. Scan until you can't go lower anymore.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Pour Water example:**

```
heights:  [2, 1, 1, 2, 1, 2, 2]  k=3, 1 drop
           0  1  2  3  4  5  6

Step 1 — scan LEFT from k=3:
  h[2]=1 < h[3]=2 → can move left
  h[1]=1 = h[2]=1 → can't improve, stop at pos=2
  Water settles at 2: [2,1,2,2,1,2,2]

Step 2 — if left fails, scan RIGHT from k=3:
  look for strictly lower position
```

---

---

## Problem Description

| #   | Problem                   | Difficulty | Pattern              |
| --- | ------------------------- | ---------- | -------------------- |
| 42  | Trapping Rain Water       | 🔴 Hard    | Two Pointers / Stack |
| 407 | Trapping Rain Water II    | 🔴 Hard    | BFS / Heap           |
| 11  | Container With Most Water | 🟡 Medium  | Two Pointers         |

---

## 📝 Interview Tips

- 🟡 **EN:** Priority order is strict: LEFT first, then RIGHT, then stay.
  **VI:** Thứ tự ưu tiên: TRÁI trước, rồi PHẢI, rồi đứng tại chỗ.
- 🟡 **EN:** When scanning, move only if strictly lower; stop when equal or higher.
  **VI:** Khi quét, di chuyển chỉ khi thấp hơn thực sự; dừng khi bằng hoặc cao hơn.
- 🟡 **EN:** Find the leftmost/rightmost minimum in each scan direction.
  **VI:** Tìm vị trí thấp nhất ngoài cùng trái/phải trong mỗi hướng quét.
- 🟡 **EN:** After dropping all `vol` drops, return the modified heights array.
  **VI:** Sau khi thả hết `vol` giọt, trả về mảng độ cao đã thay đổi.
- 🟡 **EN:** Time O(n*vol) per drop in worst case; Space O(1) extra.
  **VI:** Thời gian O(n*vol) trong trường hợp tệ nhất; Không gian O(1) thêm.
- 🟡 **EN:** Edge case: plateau at drop point — water stays at k.
  **VI:** Trường hợp đặc biệt: bằng phẳng tại điểm thả — nước đứng tại k.

---

---

## Solutions

```typescript
function pourWater(heights: number[], volume: number, k: number): number[] {
  for (let v = 0; v < volume; v++) {
    let pos = k;

    // Try to flow LEFT
    let left = k;
    while (left > 0 && heights[left - 1] <= heights[left]) {
      left--;
    }
    // left is now the leftmost point we can reach going left
    // Only settle there if it's strictly lower than k
    if (heights[left] < heights[k]) {
      heights[left]++;
      continue;
    }

    // Try to flow RIGHT
    let right = k;
    while (right < heights.length - 1 && heights[right + 1] <= heights[right]) {
      right++;
    }
    // right is the rightmost point going right
    if (heights[right] < heights[k]) {
      heights[right]++;
      continue;
    }

    // Stay at k
    heights[k]++;
  }
  return heights;
}

// Test cases
console.log(JSON.stringify(pourWater([2, 1, 1, 2, 1, 2, 2], 4, 3)));
// Expected: [2,2,2,3,2,2,2]
console.log(JSON.stringify(pourWater([1, 2, 3, 4], 2, 2)));
// Expected: [2,3,3,4]  (water flows left)
console.log(JSON.stringify(pourWater([3, 1, 3], 5, 1)));
// Expected: [3,6,3]  (water stays in valley)

function pourWaterV2(heights: number[], volume: number, k: number): number[] {
  const n = heights.length;

  for (let v = 0; v < volume; v++) {
    let drop = k;

    // Scan left: find leftmost position that is strictly lower than current
    for (let i = k - 1; i >= 0; i--) {
      if (heights[i] > heights[drop]) break;
      if (heights[i] < heights[drop]) drop = i;
    }

    if (drop !== k) {
      heights[drop]++;
      continue;
    }

    // Scan right: find rightmost position that is strictly lower
    for (let i = k + 1; i < n; i++) {
      if (heights[i] > heights[drop]) break;
      if (heights[i] < heights[drop]) drop = i;
    }

    heights[drop]++;
  }

  return heights;
}

console.log(JSON.stringify(pourWaterV2([2, 1, 1, 2, 1, 2, 2], 4, 3)));
// Expected: [2,2,2,3,2,2,2]
```

---

## 🔗 Related Problems

| #   | Problem                   | Difficulty | Pattern              |
| --- | ------------------------- | ---------- | -------------------- |
| 42  | Trapping Rain Water       | 🔴 Hard    | Two Pointers / Stack |
| 407 | Trapping Rain Water II    | 🔴 Hard    | BFS / Heap           |
| 11  | Container With Most Water | 🟡 Medium  | Two Pointers         |
