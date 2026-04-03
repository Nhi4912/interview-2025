---
layout: page
title: "Find Original Array From Doubled Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/find-original-array-from-doubled-array"
---

# Find Original Array From Doubled Array / Tìm Mảng Gốc Từ Mảng Đôi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Array of Doubled Pairs](https://leetcode.com/problems/array-of-doubled-pairs) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có một túi bi — ai đó đã nhân đôi từng viên bi gốc rồi trộn tất cả lại. Nhiệm vụ: tìm lại bộ bi gốc. Chiến lược: sắp xếp từ nhỏ đến lớn — viên nhỏ nhất hiện tại **buộc phải** là gốc (không có giá trị nào nhỏ hơn sinh ra nó). Tìm đúng 1 viên gấp đôi để "tiêu thụ", nếu không có → bộ gốc không tồn tại.

**Pattern Recognition:**

- Signal: "doubled array", "original array" → **Sort + Freq Map greedy**
- Với mỗi phần tử x (nhỏ nhất chưa xử lý), nó phải là số gốc → freq[2x] phải > 0
- Edge case: x=0 thì 2x=0, phải có chẵn số 0 để ghép cặp

**Visual — changed = [1, 3, 4, 2, 6, 8]:**

```
Sorted: [1, 2, 3, 4, 6, 8]   freq: {1:1, 2:1, 3:1, 4:1, 6:1, 8:1}

Process 1: freq[1]=1 → use; need freq[2]=1 ✓ → result=[1], consume 2
Process 2: freq[2]=0 → skip (consumed)
Process 3: freq[3]=1 → use; need freq[6]=1 ✓ → result=[1,3], consume 6
Process 4: freq[4]=1 → use; need freq[8]=1 ✓ → result=[1,3,4] ✅
```

---

## Problem Description

An integer array `original` is transformed to `changed` by appending twice the value of every element then shuffling. Given `changed`, return `original` if it exists, else `[]`.

```
Example 1: changed = [1,3,4,2,6,8]  → [1,3,4]
Example 2: changed = [6,3,0,1]      → []   (odd length)
Example 3: changed = [3,1]          → []   (no 2 for 1)
Example 4: changed = [0,0,0,0]      → [0,0]
```

---

## 📝 Interview Tips

1. **Hỏi ngay**: "Có phần tử 0 không?" → x=0: 2x=0, cần chẵn số 0 để ghép cặp
2. **Tại sao sort?** Đảm bảo khi xử lý x, mọi số nhỏ hơn đã xử lý → x chắc chắn là gốc
3. **Nếu length lẻ**: Trả về `[]` ngay — không thể chia đôi mảng
4. **Skip đã dùng**: Sau khi tiêu thụ freq[x]-- và freq[2x]--, bỏ qua x nếu freq[x]=0
5. **Hỏi follow-up**: "Triple thay vì double?" → Cùng logic, thay 2x bằng 3x
6. **Complexity**: Time O(n log n), Space O(n) — tối ưu vì cần sort + freq map

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Frequency Map (Optimal)
 * Time O(n log n), Space O(n)
 *
 * Key insight: after sorting, the smallest unprocessed element MUST be
 * an original value — no smaller value could have generated it.
 */
function findOriginalArray(changed: number[]): number[] {
  if (changed.length % 2 !== 0) return [];

  const freq = new Map<number, number>();
  for (const x of changed) freq.set(x, (freq.get(x) ?? 0) + 1);

  changed.sort((a, b) => a - b);
  const result: number[] = [];

  for (const x of changed) {
    if ((freq.get(x) ?? 0) === 0) continue; // already consumed
    freq.set(x, freq.get(x)! - 1);

    const doubled = x * 2;
    if ((freq.get(doubled) ?? 0) === 0) return []; // no matching double
    freq.set(doubled, freq.get(doubled)! - 1);
    result.push(x);
  }

  return result;
}

/**
 * Solution 2: Sorted Unique Keys (Handles 0-edge-case cleanly)
 * Time O(n log n), Space O(n)
 *
 * Iterate over unique keys so x=0 is handled: need 2*cnt zeros total.
 */
function findOriginalArray2(changed: number[]): number[] {
  if (changed.length % 2 !== 0) return [];

  const freq = new Map<number, number>();
  for (const x of changed) freq.set(x, (freq.get(x) ?? 0) + 1);

  const keys = [...freq.keys()].sort((a, b) => a - b);
  const result: number[] = [];

  for (const x of keys) {
    const cnt = freq.get(x)!;
    if (cnt === 0) continue;

    const doubled = x * 2;
    const cntDoubled = freq.get(doubled) ?? 0;
    if (cntDoubled < cnt) return []; // not enough doubles available

    freq.set(doubled, cntDoubled - cnt);
    for (let i = 0; i < cnt; i++) result.push(x);
  }

  return result;
}

// --- Quick inline tests ---
console.log(JSON.stringify(findOriginalArray([1, 3, 4, 2, 6, 8]))); // [1,3,4]
console.log(JSON.stringify(findOriginalArray([6, 3, 0, 1]))); // []
console.log(JSON.stringify(findOriginalArray([3, 1]))); // []
console.log(JSON.stringify(findOriginalArray([0, 0, 0, 0]))); // [0,0]
console.log(JSON.stringify(findOriginalArray2([2, 1, 2, 4, 2, 4]))); // [1,2,2]
console.log(JSON.stringify(findOriginalArray2([0, 0]))); // [0]
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Relationship                           |
| --------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [2007. Find Original Array From Doubled Array](https://leetcode.com/problems/find-original-array-from-doubled-array/) | This problem                           |
| [954. Array of Doubled Pairs](https://leetcode.com/problems/array-of-doubled-pairs/)                                  | Identical logic, verify existence only |
| [1. Two Sum](https://leetcode.com/problems/two-sum/)                                                                  | Hash map complement lookup pattern     |
| [169. Majority Element](https://leetcode.com/problems/majority-element/)                                              | Frequency counting approach            |
| [41. First Missing Positive](https://leetcode.com/problems/first-missing-positive/)                                   | Greedy with value-based constraints    |
