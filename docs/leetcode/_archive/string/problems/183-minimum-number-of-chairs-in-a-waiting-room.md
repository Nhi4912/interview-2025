---
layout: page
title: "Minimum Number of Chairs in a Waiting Room"
difficulty: Easy
category: String
tags: [String, Simulation]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-chairs-in-a-waiting-room"
---

# Minimum Number of Chairs in a Waiting Room / Số Ghế Tối Thiểu Trong Phòng Chờ

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài toán giống **đếm người trong phòng**: mỗi 'E' thêm một người, mỗi 'L' bớt một người.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Number of Chairs in a Waiting Room example:**

```
s = "EEEEEEE"
     ↓↓↓↓↓↓↓
     1234567      peak = 7  ← need 7 chairs

s = "ELELEEL"
     E →  cur=1  max=1
     L →  cur=0
     E →  cur=1
     L →  cur=0
     E →  cur=1
     E →  cur=2  max=2
     L →  cur=1

     peak = 2  ← need 2 chairs

s = "EELLEE"
     E → 1  E → 2  L → 1  L → 0  E → 1  E → 2
     peak = 2
```

**Key insight:** We only care about the **maximum concurrent occupancy** — that's the minimum chairs needed.

---

---

## Problem Description

| Problem                                                                                                         | Difficulty | Pattern            |
| --------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)                                             | 🟡 Medium  | Min chairs / rooms |
| [Car Fleet](https://leetcode.com/problems/car-fleet/)                                                           | 🟡 Medium  | Stack simulation   |
| [Number of Students Unable to Eat Lunch](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/) | 🟢 Easy    | Simulation         |

---

## 📝 Interview Tips

- 🇻🇳 **Số ghế = đỉnh số người đồng thời**: không cần nhớ thứ tự, chỉ cần đỉnh
- 🇺🇸 **Chairs = peak occupancy**: no history needed, just track running max
- 🇻🇳 **'E' = +1, 'L' = -1**: mỗi ký tự thay đổi counter đúng 1 đơn vị
- 🇺🇸 **'E' = +1, 'L' = -1**: each character changes counter by exactly 1
- 🇻🇳 **current không âm**: đề đảm bảo input hợp lệ, mọi 'L' đều có 'E' trước đó
- 🇺🇸 **current never negative**: problem guarantees valid input, every 'L' has a prior 'E'
- 🇻🇳 **Đây là bài toán "interval scheduling" đơn giản nhất**
- 🇺🇸 **Simplest form of resource allocation**: count max concurrent users
- 🇻🇳 **Cập nhật max sau 'E'**: chỉ cần cập nhật khi người vào (không phải ra)
- 🇺🇸 **Update max only on 'E'**: occupancy only rises on enter events
- 🇻🇳 **Độ phức tạp**: O(n) time, O(1) space — không thể tốt hơn
- 🇺🇸 **Complexity**: O(n) time, O(1) space — optimal

---

---

## Solutions

```typescript
/**
 * Simulate arrivals and departures; track peak occupancy.
 * Time: O(n)  Space: O(1)
 */
function minimumChairs(s: string): number {
  let current = 0;
  let maxChairs = 0;

  for (const c of s) {
    if (c === "E") {
      current++;
      if (current > maxChairs) maxChairs = current;
    } else {
      current--;
    }
  }

  return maxChairs;
}

console.log(minimumChairs("EEEEEEE")); // 7
console.log(minimumChairs("ELELEEL")); // 2
console.log(minimumChairs("EELLEE")); // 2
console.log(minimumChairs("E")); // 1
console.log(minimumChairs("EL")); // 1

/**
 * Update max on every iteration (slightly simpler, same complexity).
 * Time: O(n)  Space: O(1)
 */
function minimumChairs2(s: string): number {
  let cur = 0;
  let max = 0;

  for (const c of s) {
    cur += c === "E" ? 1 : -1;
    max = Math.max(max, cur);
  }

  return max;
}

console.log(minimumChairs2("EEEEEEE")); // 7
console.log(minimumChairs2("ELELEEL")); // 2

/**
 * Reduce over characters; accumulate [current, peak].
 * Time: O(n)  Space: O(1)
 */
function minimumChairs3(s: string): number {
  const [, peak] = [...s].reduce<[number, number]>(
    ([cur, max], c) => {
      const next = cur + (c === "E" ? 1 : -1);
      return [next, Math.max(max, next)];
    },
    [0, 0],
  );
  return peak;
}

console.log(minimumChairs3("EEEEEEE")); // 7
console.log(minimumChairs3("EELLEE")); // 2
console.log(minimumChairs3("ELELEEL")); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                         | Difficulty | Pattern            |
| --------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)                                             | 🟡 Medium  | Min chairs / rooms |
| [Car Fleet](https://leetcode.com/problems/car-fleet/)                                                           | 🟡 Medium  | Stack simulation   |
| [Number of Students Unable to Eat Lunch](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/) | 🟢 Easy    | Simulation         |
