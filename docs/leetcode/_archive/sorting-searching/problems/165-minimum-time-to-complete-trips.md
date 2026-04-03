---
layout: page
title: "Minimum Time to Complete Trips"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-complete-trips"
---

# Minimum Time to Complete Trips / Thời Gian Tối Thiểu Để Hoàn Thành Các Chuyến Đi

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Binary search trên thời gian t. Hàm kiểm tra: "với t đơn vị thời gian, tổng số chuyến = Σ⌊t/time[i]⌋ ≥ totalTrips không?". Hàm này đơn điệu tăng theo t → binary search tìm t nhỏ nhất thỏa mãn.

**Analogy:** Đặt bánh — bạn hỏi "nếu đặt lò t phút, đủ bánh không?" — tăng t đến khi đủ. Binary search trên thời gian t thay vì thử từng t.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Time to Complete Trips example:**

```
time=[1,2,3]  totalTrips=5

t=3: 3/1+3/2+3/3 = 3+1+1=5 ≥ 5 ✅
t=2: 2/1+2/2+2/3 = 2+1+0=3 < 5 ❌
→ answer = 3

Search range: [1, min(time) * totalTrips]
```

---

---

## Problem Description

| Problem                                                                                            | Difficulty | Connection                |
| -------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                           | 🟡 Medium  | Binary search on answer   |
| [Capacity to Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days) | 🟡 Medium  | Binary search on capacity |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element)                               | 🟡 Medium  | Binary search variant     |

---

## 📝 Interview Tips

- **EN:** Binary search on answer (time value), not on array index / **VI:** Binary search trên giá trị đáp án (thời gian), không phải chỉ số mảng
- **EN:** Check function: `Σ floor(t / time[i]) >= totalTrips` / **VI:** Hàm check: tổng số chuyến tại thời điểm t ≥ totalTrips
- **EN:** Lower bound = 1, upper bound = min(time) * totalTrips / **VI:** lo=1, hi = min(time)*totalTrips (worst case 1 bus)
- **EN:** Move hi = mid when condition holds (find leftmost true) / **VI:** Khi đủ chuyến, thu hẹp hi=mid để tìm nhỏ nhất
- **EN:** Watch for BigInt overflow: min(time)\*totalTrips can reach 10^14 / **VI:** Cẩn thận overflow: hi có thể đến 10^14, dùng BigInt nếu cần
- **EN:** Each check is O(n); log(hi) iterations → O(n log(minT \* total)) / **VI:** Mỗi lần check O(n), tổng O(n log(hi))

---

---

## Solutions

```typescript
/**
 * Binary search on time; check if total trips >= totalTrips.
 * Time: O(n log(minTime * totalTrips))  Space: O(1)
 */
function minimumTime(time: number[], totalTrips: number): number {
  const minTime = Math.min(...time);
  let lo = 1;
  let hi = minTime * totalTrips; // worst case: one bus does all trips

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    // Count total trips completable in `mid` time units
    const trips = time.reduce((sum, t) => sum + Math.floor(mid / t), 0);
    if (trips >= totalTrips) {
      hi = mid; // might be able to do it in less time
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}

// Tests
console.log(minimumTime([1, 2, 3], 5)); // 3
console.log(minimumTime([2], 1)); // 2
console.log(minimumTime([5, 10, 10], 9)); // 25

/**
 * Use BigInt arithmetic to avoid overflow for large inputs.
 * Time: O(n log(minTime * totalTrips))  Space: O(1)
 */
function minimumTime2(time: number[], totalTrips: number): number {
  const minTime = Math.min(...time);
  let lo = 1n;
  let hi = BigInt(minTime) * BigInt(totalTrips);
  const target = BigInt(totalTrips);

  while (lo < hi) {
    const mid = (lo + hi) / 2n;
    const trips = time.reduce((sum, t) => sum + mid / BigInt(t), 0n);
    if (trips >= target) {
      hi = mid;
    } else {
      lo = mid + 1n;
    }
  }
  return Number(lo);
}

// Tests
console.log(minimumTime2([1, 2, 3], 5)); // 3
console.log(minimumTime2([2], 1)); // 2
console.log(minimumTime2([1], 1_000_000_000)); // 1000000000

/**
 * Short-circuit check: stop counting once we hit totalTrips.
 * Time: O(n log(minTime * totalTrips))  Space: O(1)
 */
function minimumTime3(time: number[], totalTrips: number): number {
  const minTime = Math.min(...time);
  let lo = 1,
    hi = minTime * totalTrips;

  const canFinish = (t: number): boolean => {
    let count = 0;
    for (const bt of time) {
      count += Math.floor(t / bt);
      if (count >= totalTrips) return true; // early exit
    }
    return false;
  };

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    canFinish(mid) ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
}

// Tests
console.log(minimumTime3([1, 2, 3], 5)); // 3
console.log(minimumTime3([2], 1)); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                            | Difficulty | Connection                |
| -------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                           | 🟡 Medium  | Binary search on answer   |
| [Capacity to Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days) | 🟡 Medium  | Binary search on capacity |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element)                               | 🟡 Medium  | Binary search variant     |
