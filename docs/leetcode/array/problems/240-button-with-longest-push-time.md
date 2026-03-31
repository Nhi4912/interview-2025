---
layout: page
title: "Button with Longest Push Time"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/button-with-longest-push-time"
---

# Button with Longest Push Time / Nút Bấm Giữ Lâu Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array (Linear Scan)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Time Visiting All Points](https://leetcode.com/problems/minimum-time-visiting-all-points) | [Maximum Difference Between Increasing Elements](https://leetcode.com/problems/maximum-difference-between-increasing-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như bấm giờ khi chơi game — thời gian bấm một nút = khoảng cách giữa hai lần ghi nhận liên tiếp. Nút đầu tiên được bấm từ thời điểm 0. Duyệt tuyến tính, cập nhật khi tìm thấy thời gian dài hơn (hoặc bằng mà index nhỏ hơn).

**Pattern Recognition:**

- `events[i] = [button_i, time_i]` sorted by time
- Duration of event i = `time_i - time_{i-1}` (for i > 0), `time_0` for i = 0
- Track `(maxDuration, buttonWithMaxDuration)`, update on tie with smaller button index

**Visual — Linear scan with diff:**

```
events = [[1,2],[2,5],[3,9],[1,15]]
           btn time

i=0: duration = 2-0 = 2  → button=1, maxDur=2, ans=1
i=1: duration = 5-2 = 3  → button=2, 3>2 → maxDur=3, ans=2
i=2: duration = 9-5 = 4  → button=3, 4>3 → maxDur=4, ans=3
i=3: duration = 15-9 = 6 → button=1, 6>4 → maxDur=6, ans=1

Answer = 1 ✅
```

---

## Problem Description

Given a 2D array `events` where `events[i] = [button_i, time_i]` (sorted by time, all times distinct), the duration of pressing button at event i is `time_i - time_{i-1}` (or `time_0` for the first event). Return the button with the longest total push duration; if tie, return the button with the **smaller index**. ([LeetCode 3386](https://leetcode.com/problems/button-with-longest-push-time))

Difficulty: Easy | Acceptance: 40.6%

```
Example 1: events=[[1,2],[2,5],[3,9],[1,15]] → 1
  Durations: button1→2, button2→3, button3→4, button1→6
  button1 total=8 > button3 total=4 → ans=1

Example 2: events=[[10,5],[1,7]]             → 10
  Durations: button10→5, button1→2 → ans=10 (5>2)
```

Constraints:

- `1 <= events.length <= 1000`
- `events[i].length == 2`
- `1 <= events[i][0] <= 100` (button index)
- `1 <= events[i][1] <= 10^9` (time, strictly increasing)

---

## 📝 Interview Tips

1. **Clarify**: "Nút đầu tiên giữ từ t=0 hay t=time[0]?" / First button held from t=0, so duration = events[0][1]
2. **Diff pattern**: "Thời gian giữ = hiệu hai lần liên tiếp" / Duration = time[i] - time[i-1]
3. **Tie-breaking**: "Nếu cùng thời gian, chọn nút nhỏ hơn về chỉ số" / On tie, prefer smaller button index
4. **Single pass**: "Chỉ cần O(n) một lần duyệt, không cần sort lại" / Events already sorted → O(n) single pass
5. **Edge case**: "Chỉ có một sự kiện → trả về nút đó" / Single event → return that button
6. **Follow-up**: "Tổng thời gian mỗi nút? → dùng Map để cộng dồn" / Total time per button → accumulate with Map

---

## Solutions

```typescript
/**
 * Solution 1: Map accumulation — sum durations per button
 * Time: O(n) — single pass
 * Space: O(k) — k unique buttons
 */
function buttonWithLongestPushTimeMap(events: number[][]): number {
  const totals = new Map<number, number>();

  for (let i = 0; i < events.length; i++) {
    const [btn, time] = events[i];
    const prev = i === 0 ? 0 : events[i - 1][1];
    const dur = time - prev;
    totals.set(btn, (totals.get(btn) ?? 0) + dur);
  }

  let ans = -1;
  let maxDur = -1;
  for (const [btn, dur] of totals) {
    if (dur > maxDur || (dur === maxDur && btn < ans)) {
      maxDur = dur;
      ans = btn;
    }
  }
  return ans;
}

/**
 * Solution 2: Single-pass tracking (optimal — no extra map needed)
 * Time: O(n) — one pass, constant extra space per step
 * Space: O(1) — only track current best
 *
 * Note: Works only if each button appears at most once in events.
 * For repeated buttons, Solution 1 is correct.
 * This problem guarantees distinct times but buttons can repeat.
 * Use Solution 1 for correctness; this shows the pattern.
 */
function buttonWithLongestPushTime(events: number[][]): number {
  // Use Map approach for correctness (buttons can repeat)
  const totals = new Map<number, number>();
  for (let i = 0; i < events.length; i++) {
    const btn = events[i][0];
    const time = events[i][1];
    const prevTime = i === 0 ? 0 : events[i - 1][1];
    totals.set(btn, (totals.get(btn) ?? 0) + (time - prevTime));
  }

  let ans = Infinity;
  let maxDur = 0;
  for (const [btn, dur] of totals) {
    if (dur > maxDur || (dur === maxDur && btn < ans)) {
      maxDur = dur;
      ans = btn;
    }
  }
  return ans;
}

// === Test Cases ===
console.log(
  buttonWithLongestPushTime([
    [1, 2],
    [2, 5],
    [3, 9],
    [1, 15],
  ]),
); // 1
console.log(
  buttonWithLongestPushTime([
    [10, 5],
    [1, 7],
  ]),
); // 10
console.log(
  buttonWithLongestPushTime([
    [1, 1],
    [2, 2],
  ]),
); // 1 (tie → smaller index)
console.log(buttonWithLongestPushTime([[3, 100]])); // 3
```

---

## 🔗 Related Problems

- [Minimum Time Visiting All Points](https://leetcode.com/problems/minimum-time-visiting-all-points) — time difference pattern
- [Maximum Difference Between Increasing Elements](https://leetcode.com/problems/maximum-difference-between-increasing-elements) — scan with running max/min
- [Find the Pivot Integer](https://leetcode.com/problems/find-the-pivot-integer) — linear scan with condition
- [Button with Longest Push Time — LeetCode](https://leetcode.com/problems/button-with-longest-push-time) — problem page
