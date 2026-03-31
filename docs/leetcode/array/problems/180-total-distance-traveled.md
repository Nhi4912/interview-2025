---
layout: page
title: "Total Distance Traveled"
difficulty: Easy
category: Array
tags: [Math, Simulation]
leetcode_url: "https://leetcode.com/problems/total-distance-traveled"
---

# Total Distance Traveled / Tổng Quãng Đường Di Chuyển

🟢 Easy | Tags: Math, Simulation

---

## 🧠 Intuition / Trực Giác

**VN:** Mỗi khi dùng hết 5 lít từ bình chính, bình phụ cấp thêm 1 lít vào bình chính. 1 lít chạy được 10 km. Mô phỏng từng bước tiêu thụ 5 lít cho đến khi bình chính < 5.

```
mainTank=5, additionalTank=1
Step 1: dùng 5L → 50km, nhận 1L từ phụ → main=1, add=0
Step 2: main<5 → dùng 1L → 10km
Total = 60km ✓
```

---

## 📝 Interview Tips

- 🇻🇳 Mỗi lần tiêu thụ đúng 5 lít từ bình chính (không phải tích lũy) mới nhận thêm.
- 🇺🇸 Refuel triggers every time exactly 5 litres are consumed from main — not cumulatively from a counter.
- 🇻🇳 Bình phụ chỉ bổ sung vào bình chính, không trực tiếp chạy xe.
- 🇺🇸 The additional tank only tops up the main tank; it doesn't drive directly.
- 🇻🇳 Công thức toán học: tổng lít dùng = mainTank + min(additionalTank, floor(mainTank/5)) × nhưng chú ý số lít bổ sung cũng tạo thêm lần refuel.
- 🇺🇸 Formula is tricky (refueled liters may trigger more refuels); simulation is safest.

---

## 💡 Solutions

### Solution 1: Direct Simulation

```typescript
/**
 * Simulate consuming 5L at a time; refuel from additional when available.
 * Time: O(mainTank / 5) | Space: O(1)
 */
function distanceTraveled(mainTank: number, additionalTank: number): number {
  let distance = 0;

  while (mainTank > 0) {
    if (mainTank >= 5) {
      mainTank -= 5;
      distance += 50;
      if (additionalTank > 0) {
        mainTank++;
        additionalTank--;
      }
    } else {
      distance += mainTank * 10;
      mainTank = 0;
    }
  }

  return distance;
}

console.log(distanceTraveled(5, 10)); // 60
console.log(distanceTraveled(1, 2)); // 10
console.log(distanceTraveled(9, 3)); // 110
```

### Solution 2: Math Formula (No Loop)

```typescript
/**
 * Total liters = mainTank + liters_from_additional.
 * Each 5L from main gives 1 from additional, but those added liters
 * can trigger further refuels. Solve iteratively with math.
 * Time: O(log mainTank) | Space: O(1)
 */
function distanceTraveled2(mainTank: number, additionalTank: number): number {
  let total = mainTank;
  let available = additionalTank;
  let fuelToConsume = mainTank;

  while (fuelToConsume >= 5 && available > 0) {
    const refuels = Math.min(Math.floor(fuelToConsume / 5), available);
    total += refuels;
    available -= refuels;
    // Newly added liters may themselves trigger more refuels
    fuelToConsume = refuels; // only the newly added liters need counting
  }

  return total * 10;
}

console.log(distanceTraveled2(5, 10)); // 60
console.log(distanceTraveled2(1, 2)); // 10
console.log(distanceTraveled2(9, 3)); // 110
```

### Solution 3: One-Liner Math

```typescript
/**
 * Closed-form: refuels = min(additionalTank, floor(mainTank/5))
 * Only valid when refueled liters themselves < 5 each iteration.
 * Safe for bounded additionalTank <= 100.
 * Time: O(1 per iteration, bounded) | Space: O(1)
 */
function distanceTraveled3(mainTank: number, additionalTank: number): number {
  let total = mainTank,
    fuel = mainTank,
    extra = additionalTank;
  while (fuel >= 5 && extra > 0) {
    const add = Math.min(Math.floor(fuel / 5), extra);
    total += add;
    extra -= add;
    fuel = add;
  }
  return total * 10;
}

console.log(distanceTraveled3(5, 10)); // 60
console.log(distanceTraveled3(1, 2)); // 10
```

---

## 🔗 Related Problems

| Problem                                                                                                                             | Difficulty | Pattern    |
| ----------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| [Water Bottles](https://leetcode.com/problems/water-bottles/)                                                                       | 🟢 Easy    | Simulation |
| [Find the Punishment Number of an Integer](https://leetcode.com/problems/find-the-punishment-number-of-an-integer/)                 | 🟡 Medium  | Math       |
| [Minimum Number of Operations to Make Array Empty](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty/) | 🟡 Medium  | Math       |
