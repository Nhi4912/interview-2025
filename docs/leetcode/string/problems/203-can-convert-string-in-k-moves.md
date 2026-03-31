---
layout: page
title: "Can Convert String in K Moves"
difficulty: Medium
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/can-convert-string-in-k-moves"
---

# Can Convert String in K Moves / Có Thể Chuyển Chuỗi Trong K Bước

🟡 Medium

## 🧠 Intuition

> **Phép so sánh:** Giống đặt lịch hẹn — mỗi "bước dịch chuyển" cần một slot thời gian riêng. Nếu hai ký tự đều cần dịch 3 bước, chúng phải dùng các lượt khác nhau: lượt 3 và lượt 29 (3 + 26), ...

```
s="input", t="ouput", k=9
Positions needing shift:
 i→o: (15-9+26)%26=6, or wait: slots 6, 32, 58,...
 n→u: (21-14)=7, slots 7, 33, 59,...
 p→p: same → no shift needed
 u→u: same
 t→t: same

For each diff d (1-25): need slots d, d+26, d+52,...
Slot used by i-th occurrence = d + 26*(i-1)
Must have slot <= k
```

## Problem Description

Given strings `s` and `t` (same length) and integer `k`, determine if you can convert `s` to `t` in **at most k moves**. In move `i` (1-indexed) you can choose one character and shift it forward by `i` positions (mod 26). Each move is used at most once.

**Example 1:** `s="input"`, `t="ouput"`, `k=9` → `true`

**Example 2:** `s="abc"`, `t="bcd"`, `k=10` → `false`

**Constraints:** `1 <= s.length <= 10^5`, `0 <= k <= 10^9`

## 📝 Interview Tips

- **No-op shifts:** If `s[i] == t[i]`, skip — no move needed
- **Shift value:** `diff = (t[i] - s[i] + 26) % 26`; if `diff == 0` skip
- **Slot allocation:** Multiple positions with same diff use slots `diff, diff+26, diff+52,...`
- **Key check:** For the j-th occurrence of diff `d`, required slot = `d + 26*(j-1)` ≤ k
- **Count array:** Track how many times each diff value (1..25) has appeared so far
- **Complexity:** O(n) time, O(26) = O(1) space

## Solutions

### Solution 1: Count array + slot formula — O(n) time, O(1) space

```typescript
function canConvertString(s: string, t: string, k: number): boolean {
  if (s.length !== t.length) return false;

  // count[d] = how many positions already need shift of d
  const count = new Array(26).fill(0);

  for (let i = 0; i < s.length; i++) {
    const diff = (t.charCodeAt(i) - s.charCodeAt(i) + 26) % 26;
    if (diff === 0) continue;

    // The (count[diff]+1)-th occurrence of this diff uses slot: diff + 26*count[diff]
    const requiredSlot = diff + 26 * count[diff];
    if (requiredSlot > k) return false;

    count[diff]++;
  }

  return true;
}
```

### Solution 2: Hash map approach (equivalent) — O(n) time, O(26) space

```typescript
function canConvertString(s: string, t: string, k: number): boolean {
  if (s.length !== t.length) return false;

  const usedSlots = new Map<number, number>();

  for (let i = 0; i < s.length; i++) {
    const diff = (t.charCodeAt(i) - s.charCodeAt(i) + 26) % 26;
    if (diff === 0) continue;

    const uses = usedSlots.get(diff) ?? 0;
    const slot = diff + 26 * uses;

    if (slot > k) return false;
    usedSlots.set(diff, uses + 1);
  }

  return true;
}
```

### Solution 3: Sorted slot assignment — O(n log n) time, O(n) space

```typescript
function canConvertString(s: string, t: string, k: number): boolean {
  if (s.length !== t.length) return false;

  const shifts: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const diff = (t.charCodeAt(i) - s.charCodeAt(i) + 26) % 26;
    if (diff !== 0) shifts.push(diff);
  }

  // Group by diff value and assign slots in order
  shifts.sort((a, b) => a - b);
  const slotOf = new Map<number, number>();

  for (const d of shifts) {
    const uses = slotOf.get(d) ?? 0;
    const slot = d + 26 * uses;
    if (slot > k) return false;
    slotOf.set(d, uses + 1);
  }

  return true;
}
```

## 🔗 Related Problems

| #    | Problem                         | Difficulty | Tags       |
| ---- | ------------------------------- | ---------- | ---------- |
| 205  | Isomorphic Strings              | Easy       | Hash Table |
| 290  | Word Pattern                    | Easy       | Hash Table |
| 1323 | Maximum 69 Number               | Easy       | Greedy     |
| 2027 | Minimum Moves to Convert String | Easy       | Greedy     |
