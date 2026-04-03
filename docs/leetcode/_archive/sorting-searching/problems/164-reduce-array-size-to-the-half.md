---
layout: page
title: "Reduce Array Size to The Half"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/reduce-array-size-to-the-half"
---

# Reduce Array Size to The Half / Giảm Kích Thước Mảng Xuống Một Nửa

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Mục tiêu xóa ít nhất ⌈n/2⌉ phần tử. Greedy: luôn xóa những giá trị xuất hiện nhiều nhất trước — mỗi giá trị duy nhất xóa được càng nhiều phần tử cùng lúc, số loại giá trị cần xóa càng ít.

**Analogy:** Dọn kho lạc hậu — thùng hàng nào nhiều nhất thì vứt trước, ít lần vứt nhất mà giải phóng được nhiều chỗ nhất.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Reduce Array Size to The Half example:**

```
arr = [3,3,3,3,5,5,5,2,2,7]  n=10, target=5
freq: {3:4, 5:3, 2:2, 7:1}
sort desc: [4, 3, 2, 1]

Pick 3 (count=4): removed=4 ≥ 5? No
Pick 5 (count=3): removed=7 ≥ 5? Yes → answer = 2 sets
```

---

---

## Problem Description

| Problem                                                                          | Difficulty | Connection             |
| -------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) | 🟡 Medium  | Frequency sort greedy  |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                   | 🟡 Medium  | Frequency-based greedy |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)             | 🟡 Medium  | Most frequent first    |

---

## 📝 Interview Tips

- **EN:** Count frequency of each value with a HashMap / **VI:** Đếm tần suất mỗi giá trị bằng HashMap
- **EN:** Sort frequencies descending; greedily pick highest frequency first / **VI:** Sắp xếp tần suất giảm dần, tham lam chọn cao nhất trước
- **EN:** Stop when removed elements ≥ n/2; return number of distinct values chosen / **VI:** Dừng khi đã xóa ≥ n/2 phần tử, trả về số loại đã chọn
- **EN:** Target = Math.ceil(n/2) = Math.floor((n+1)/2) / **VI:** Mục tiêu xóa = ⌈n/2⌉
- **EN:** Time dominated by sort O(k log k) where k = unique values ≤ n / **VI:** Độ phức tạp dominated bởi sort O(k log k)
- **EN:** Edge: if one value covers entire array, answer = 1 / **VI:** Nếu một giá trị chiếm cả mảng, đáp án = 1

---

---

## Solutions

```typescript
/**
 * Count frequencies, sort descending, greedily remove most frequent.
 * Time: O(n log n)  Space: O(n)
 */
function minSetSize(arr: number[]): number {
  const freq = new Map<number, number>();
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);

  const counts = Array.from(freq.values()).sort((a, b) => b - a);

  const target = Math.ceil(arr.length / 2);
  let removed = 0;
  let sets = 0;

  for (const cnt of counts) {
    removed += cnt;
    sets++;
    if (removed >= target) break;
  }
  return sets;
}

// Tests
console.log(minSetSize([3, 3, 3, 3, 5, 5, 5, 2, 2, 7])); // 2
console.log(minSetSize([7, 7, 7, 7, 7, 7])); // 1
console.log(minSetSize([1, 9])); // 1
console.log(minSetSize([1000, 1000, 3, 7])); // 1

/**
 * Use bucket sort on frequencies (max freq ≤ n) → O(n) time.
 * Time: O(n)  Space: O(n)
 */
function minSetSize2(arr: number[]): number {
  const n = arr.length;
  const freq = new Map<number, number>();
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);

  // Bucket: buckets[f] = count of distinct values with frequency f
  const buckets = new Array(n + 1).fill(0);
  for (const f of freq.values()) buckets[f]++;

  const target = Math.ceil(n / 2);
  let removed = 0;
  let sets = 0;

  for (let f = n; f >= 1 && removed < target; f--) {
    const available = buckets[f];
    if (available === 0) continue;
    // Use as many of this frequency bucket as needed
    const take = Math.min(available, Math.ceil((target - removed) / f));
    sets += take;
    removed += take * f;
  }
  return sets;
}

// Tests
console.log(minSetSize2([3, 3, 3, 3, 5, 5, 5, 2, 2, 7])); // 2
console.log(minSetSize2([7, 7, 7, 7, 7, 7])); // 1
console.log(minSetSize2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); // 5
```

---

## 🔗 Related Problems

| Problem                                                                          | Difficulty | Connection             |
| -------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) | 🟡 Medium  | Frequency sort greedy  |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                   | 🟡 Medium  | Frequency-based greedy |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)             | 🟡 Medium  | Most frequent first    |
