---
layout: page
title: "Pass the Pillow"
difficulty: Easy
category: Array
tags: [Math, Simulation]
leetcode_url: "https://leetcode.com/problems/pass-the-pillow"
---

# Pass the Pillow / Chuyền Gối

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Multiply Strings](https://leetcode.com/problems/multiply-strings) | [Add Binary](https://leetcode.com/problems/add-binary)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ tới trò chơi truyền bóng ở lớp học — 4 bạn ngồi hàng ngang, quả bóng truyền 1→2→3→4 rồi quay ngược 4→3→2→1. Mỗi chu kỳ đi-về dài `n-1` bước. Biết số giây đã trôi qua, chỉ cần tính dư theo chu kỳ để biết bóng đang ở tay ai!

**Pattern Recognition:**

- Signal: "direction reverses at ends", "time t seconds", find position → **Modular Math / Period**
- Key insight: chu kỳ đầy đủ là `2*(n-1)` bước; `t % (2*(n-1))` cho vị trí trong một chu kỳ

**Visual — n=4, time=5:**

```
Pos: 1   2   3   4   3   2   1   2   3   4
t:   0   1   2   3   4   5   6   7   8   9

cycle = 2*(4-1) = 6
t=5: rem = 5 % 6 = 5
rem=5 > n-1=3 → going back: 2*(n-1) - rem + 1 = 6-5+1 = 2 ✓
```

---

## 📝 Problem Description

`n` people stand in line numbered 1 to n. Person 1 starts with the pillow. Each second the pillow moves to the next person; at the ends it reverses. Given `n` and `time`, return who holds the pillow.

**Example 1:** `n=4, time=5` → `2`
**Example 2:** `n=3, time=2` → `3`

**Constraints:** `2 ≤ n ≤ 1000`, `1 ≤ time ≤ 1000`

---

## 🎯 Interview Tips

1. **Identify the period** / Xác định chu kỳ: một vòng đầy đủ gồm `2*(n-1)` bước
2. **Modulo to reduce** / Dùng modulo để rút gọn: `rem = time % (2*(n-1))`
3. **Two cases** / Hai trường hợp: `rem ≤ n-1` đi tới → `rem+1`; ngược lại đi về → `2*(n-1)-rem+1`
4. **Simulation fallback** / Dự phòng mô phỏng: constraints nhỏ → O(time) simulation cũng OK
5. **Edge case** / Trường hợp đặc biệt: `time=0` → trả về 1; `n=2` chu kỳ chỉ 2 bước
6. **Off-by-one** / Lỗi lệch 1: vị trí bắt đầu là 1, không phải 0 — cẩn thận khi convert index

---

## 💡 Solutions

### Approach 1: Simulation — Brute Force

/\*_ @complexity Time: O(time) | Space: O(1) _/

```typescript
function passPillowSimulation(n: number, time: number): number {
  let pos = 1,
    dir = 1;
  for (let t = 0; t < time; t++) {
    pos += dir;
    if (pos === n)
      dir = -1; // hit right end, reverse
    else if (pos === 1) dir = 1; // hit left end, reverse
  }
  return pos;
}
```

### Approach 2: Math with Modulo — Optimal

/\*_ @complexity Time: O(1) | Space: O(1) _/

```typescript
function passPillow(n: number, time: number): number {
  const cycle = 2 * (n - 1); // full round-trip length
  const rem = time % cycle; // position within current cycle

  if (rem <= n - 1) {
    return rem + 1; // going forward (1-indexed)
  } else {
    return 2 * (n - 1) - rem + 1; // going backward
  }
}
```

### Approach 3: divmod Alternative

/\*_ @complexity Time: O(1) | Space: O(1) _/

```typescript
function passPillowAlt(n: number, time: number): number {
  const fullRounds = Math.floor(time / (n - 1));
  const extra = time % (n - 1);
  // even rounds → going forward; odd rounds → going backward
  return fullRounds % 2 === 0 ? extra + 1 : n - extra;
}
```

---

## 🧪 Test Cases

```typescript
console.log(passPillow(4, 5)); // → 2
console.log(passPillow(3, 2)); // → 3
console.log(passPillow(2, 1)); // → 2
console.log(passPillow(4, 6)); // → 1 (full cycle back to start)
console.log(passPillowSimulation(4, 5)); // → 2
console.log(passPillowAlt(4, 5)); // → 2
```

---

## Related Problems

| Problem                                                                                              | Difficulty | Pattern     |
| ---------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Zigzag Conversion](https://leetcode.com/problems/zigzag-conversion)                                 | Medium     | Math/Period |
| [Find Winner on a Tic Tac Toe Game](https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game) | Easy       | Simulation  |
| [Robot Return to Origin](https://leetcode.com/problems/robot-return-to-origin)                       | Easy       | Simulation  |
