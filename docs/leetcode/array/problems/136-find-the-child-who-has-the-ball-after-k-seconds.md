---
layout: page
title: "Find the Child Who Has the Ball After K Seconds"
difficulty: Easy
category: Array
tags: [Math, Simulation]
leetcode_url: "https://leetcode.com/problems/find-the-child-who-has-the-ball-after-k-seconds"
---

# Find the Child Who Has the Ball After K Seconds / Tìm Đứa Trẻ Có Bóng Sau K Giây

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math / Modular Arithmetic

---

## 🧠 Intuition / Trực Giác

**VI:** Hãy tưởng tượng n đứa trẻ xếp hàng, truyền bóng qua lại như quả lắc đồng hồ: đi từ 0→n-1 rồi quay ngược n-1→0. Chu kỳ đầy đủ dài `2*(n-1)` bước. Dùng modulo để tìm vị trí trong chu kỳ, rồi xác định đang đi xuôi hay ngược.

**EN:** Think of a pendulum: ball goes 0→n-1 (forward) then n-1→0 (backward). Full cycle = `2*(n-1)` steps. Use `k % cycle` to find position, then decide direction.

```
n=4, positions: 0   1   2   3
Forward pass:   →   →   →
Backward pass:          ←   ←   ←
Cycle length = 2*(4-1) = 6

k=0→pos 0  k=1→pos 1  k=2→pos 2
k=3→pos 3  k=4→pos 2  k=5→pos 1  k=6→pos 0 (repeats)
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🟢 **EN:** Recognize the oscillation pattern — same as bouncing ball or palindrome traversal.
  **VI:** Nhận ra mẫu dao động — giống bóng nảy hoặc duyệt palindrome.
- 🟢 **EN:** Cycle length is `2*(n-1)`, NOT `2*n` — endpoints visited once per cycle.
  **VI:** Chu kỳ là `2*(n-1)` chứ không phải `2*n` — đầu mút chỉ thăm 1 lần/chu kỳ.
- 🟢 **EN:** After `k % cycle`, if remainder < n we're in forward pass; otherwise backward.
  **VI:** Sau modulo, nếu dư < n thì đang đi xuôi; ngược lại đang đi ngược.
- 🟢 **EN:** Backward position formula: `2*(n-1) - remainder`.
  **VI:** Vị trí khi đi ngược: `2*(n-1) - phần dư`.
- 🟢 **EN:** Edge case: n=1, always position 0 regardless of k.
  **VI:** Trường hợp đặc biệt: n=1, luôn ở vị trí 0 dù k bao nhiêu.
- 🟢 **EN:** Time O(1), Space O(1) — pure math beats simulation for large k.
  **VI:** Thời gian O(1), Không gian O(1) — toán thuần tốt hơn mô phỏng khi k lớn.

---

## Solutions / Giải Pháp

### Solution 1: Brute Force Simulation — O(k) Time, O(1) Space

```typescript
function numberOfChild_brute(n: number, k: number): number {
  let pos = 0;
  let dir = 1; // 1 = forward, -1 = backward
  for (let i = 0; i < k; i++) {
    pos += dir;
    if (pos === n - 1) dir = -1;
    if (pos === 0) dir = 1;
  }
  return pos;
}

console.log(numberOfChild_brute(3, 5)); // 1
console.log(numberOfChild_brute(5, 6)); // 2
console.log(numberOfChild_brute(1, 100)); // 0
```

### Solution 2: Math / Modular Arithmetic — O(1) Time, O(1) Space ✅ Optimal

```typescript
function numberOfChild(n: number, k: number): number {
  if (n === 1) return 0;
  const cycle = 2 * (n - 1);
  const rem = k % cycle;
  // rem in [0, n-1] → forward pass: position = rem
  // rem in [n, cycle-1] → backward pass: position = cycle - rem
  return rem < n ? rem : cycle - rem;
}

// Test cases
console.log(numberOfChild(3, 5)); // Expected: 1   (0→1→2→1→0→1)
console.log(numberOfChild(5, 6)); // Expected: 2   (0→1→2→3→4→3→2)
console.log(numberOfChild(1, 100)); // Expected: 0
console.log(numberOfChild(4, 0)); // Expected: 0
console.log(numberOfChild(4, 3)); // Expected: 3
console.log(numberOfChild(4, 4)); // Expected: 2
console.log(numberOfChild(4, 6)); // Expected: 0  (full cycle)
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                        | Difficulty | Pattern        |
| ---- | ------------------------------ | ---------- | -------------- |
| 2582 | Pass the Pillow                | 🟢 Easy    | Math / Modular |
| 874  | Walking Robot Simulation       | 🟡 Medium  | Simulation     |
| 1688 | Count of Matches in Tournament | 🟢 Easy    | Math           |
