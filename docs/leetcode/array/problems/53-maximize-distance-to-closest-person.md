---
layout: page
title: "Maximize Distance to Closest Person"
difficulty: Medium
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/maximize-distance-to-closest-person"
---

# Maximize Distance to Closest Person / Khoảng Cách Lớn Nhất Đến Người Gần Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Array / Two Pass
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Exam Room](https://leetcode.com/problems/exam-room) | [Seat Reservation Manager](https://leetcode.com/problems/seat-reservation-manager)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn đi tìm chỗ ngồi trong rạp chiếu phim — bạn muốn ngồi xa nhất có thể so với người đã ngồi. Bạn quét từ trái sang phải, đánh dấu khoảng cách đến người ngồi gần nhất ở mỗi bên, rồi chọn vị trí giữa khoảng trống dài nhất.

**Pattern Recognition:**

- Signal: "khoảng trống giữa các vị trí occupied" → quét qua 1 lần O(n)
- Đặc biệt: khoảng ở đầu và cuối mảng tính full gap (không chia đôi)
- Key insight: duyệt qua các gap giữa 2 người ngồi, kết quả = max(leading, mid_gap/2, trailing)

**Visual — seats = [1,0,0,0,1,0,1]:**

```
Index:  0   1   2   3   4   5   6
Seats:  1   0   0   0   1   0   1
        ^           ^   ^       ^
       occ         gap  occ   occ

Gap [0..4]: length=3, best sit at idx 2 → dist = floor(3/2) = 1  ✗ (dist=2 actually)
Wait: gap between idx 0 and 4 → empty indices 1,2,3 → floor((4-0)/2)=2 ✅
Trailing gap [4..6]: idx 5 is empty, dist = 6-5 = 1
Leading gap: none (idx 0 is occupied)

Answer = max(2, 1) = 2
```

---

## Problem Description

You are given an array `seats` of 0s and 1s, where `seats[i] = 1` means a person is sitting at seat `i`. Return the **maximum distance** to the closest person if you choose an empty seat (0) optimally.

**Example 1:**

```
Input:  seats = [1,0,0,0,1,0,1]
Output: 2
Explanation: Sit at index 2, distance 2 to seat 0 and distance 2 to seat 4.
```

**Example 2:**

```
Input:  seats = [1,0,0,0]
Output: 3
Explanation: Sit at index 3, distance 3 to seat 0.
```

**Constraints:** `2 ≤ seats.length ≤ 2×10⁴`, exactly one empty seat exists at minimum, `seats[0] == 1` or `seats[n-1] == 1`.

---

## 📝 Interview Tips

1. **Clarify**: "Ghế đầu/cuối có thể trống không?" / Can the first/last seat be empty (leading/trailing gap)?
2. **Brute force**: "Với mỗi ghế trống, tính min distance đến tất cả ghế có người → O(n²)" / For each empty seat find closest occupied — O(n²)
3. **Optimize**: "Chỉ cần track last occupied seat khi duyệt 1 lần → O(n)" / Track last occupied while scanning once
4. **Leading gap**: "Nếu ghế đầu trống, khoảng cách = index của người ngồi đầu tiên" / Leading empties get full distance to first person
5. **Trailing gap**: "Nếu ghế cuối trống, khoảng cách = n-1 - last_occupied" / Trailing empties get distance to last person
6. **Follow-up**: "Nếu cần trả về index của ghế tốt nhất?" / Return the optimal seat index, not just max distance

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(n²) — for each empty seat, scan all seats for closest person
 * Space: O(1) — no extra space
 */
function maxDistToClosestBrute(seats: number[]): number {
  let maxDist = 0;
  const n = seats.length;
  for (let i = 0; i < n; i++) {
    if (seats[i] === 1) continue;
    let minDist = Infinity;
    for (let j = 0; j < n; j++) {
      if (seats[j] === 1) minDist = Math.min(minDist, Math.abs(i - j));
    }
    maxDist = Math.max(maxDist, minDist);
  }
  return maxDist;
}

/**
 * Solution 2: One-Pass Gap Scan
 * Time: O(n) — single scan tracking last occupied seat
 * Space: O(1) — constant extra space
 *
 * Key insight: scan left→right, for each occupied seat compute gap with previous.
 * - Leading gap (no prev seat): full length i
 * - Middle gap: floor((i - last) / 2)
 * - Trailing gap (after last seat): n-1 - last
 */
function maxDistToClosest(seats: number[]): number {
  const n = seats.length;
  let maxDist = 0;
  let last = -1; // index of last occupied seat seen

  for (let i = 0; i < n; i++) {
    if (seats[i] === 1) {
      if (last === -1) {
        // Leading empty seats — sit as far left as possible
        maxDist = Math.max(maxDist, i);
      } else {
        // Middle gap — best seat is the midpoint
        maxDist = Math.max(maxDist, Math.floor((i - last) / 2));
      }
      last = i;
    }
  }
  // Trailing empty seats — sit at the very end
  maxDist = Math.max(maxDist, n - 1 - last);
  return maxDist;
}

// === Test Cases ===
console.log(maxDistToClosest([1, 0, 0, 0, 1, 0, 1])); // 2
console.log(maxDistToClosest([1, 0, 0, 0])); // 3
console.log(maxDistToClosest([0, 1])); // 1
console.log(maxDistToClosest([1, 0])); // 1
console.log(maxDistToClosest([0, 0, 0, 1, 0, 0, 0])); // 3 (trailing wins)
```

---

## 🔗 Related Problems

| Problem                                                                                  | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Exam Room](https://leetcode.com/problems/exam-room)                                     | Sorted Set / Design | Medium     |
| [Seat Reservation Manager](https://leetcode.com/problems/seat-reservation-manager)       | Heap                | Medium     |
| [Find Closest Number to Zero](https://leetcode.com/problems/find-closest-number-to-zero) | Array Scan          | Easy       |
| [Missing Number](https://leetcode.com/problems/missing-number)                           | Array / Math        | Easy       |
| [Move Zeroes](https://leetcode.com/problems/move-zeroes)                                 | Two Pointers        | Easy       |
