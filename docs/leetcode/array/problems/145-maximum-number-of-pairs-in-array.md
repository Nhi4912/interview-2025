---
layout: page
title: "Maximum Number of Pairs in Array"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Counting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-pairs-in-array"
---

# Maximum Number of Pairs in Array / Số Cặp Tối Đa Trong Mảng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map / Counting

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Bài toán giống ghép đôi tất: đếm tần số từng số, số cặp = `tần_số // 2`, số còn dư = `tần_số % 2`. Tổng cặp = tổng tất cả `freq // 2`, tổng còn dư = tổng tất cả `freq % 2`.

**EN:** Like pairing socks: count frequencies, pairs = `freq // 2`, leftover = `freq % 2`. Total pairs = sum of all `freq // 2`, leftover count = sum of all `freq % 2`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Number of Pairs in Array example:**

```
nums = [1, 3, 2, 1, 3, 2, 2]
freq: {1:2, 3:2, 2:3}

1 → 2//2=1 pair, 2%2=0 leftover
3 → 2//2=1 pair, 2%2=0 leftover
2 → 3//2=1 pair, 3%2=1 leftover

Total: pairs=3, leftover=1 → [3, 1]
```

---

---

## Problem Description

| #    | Problem                          | Difficulty | Pattern  |
| ---- | -------------------------------- | ---------- | -------- |
| 1512 | Number of Good Pairs             | 🟢 Easy    | Hash Map |
| 2206 | Divide Array Into Equal Pairs    | 🟢 Easy    | Counting |
| 2341 | Maximum Number of Pairs in Array | 🟢 Easy    | Hash Map |

---

## 📝 Interview Tips

- 🟢 **EN:** Core formula: pairs = Math.floor(freq / 2), leftover = freq % 2.
  **VI:** Công thức cốt lõi: cặp = Math.floor(tần_số / 2), còn dư = tần_số % 2.
- 🟢 **EN:** Use a Map or plain object to count frequencies in one pass.
  **VI:** Dùng Map hoặc object để đếm tần số trong một lượt duyệt.
- 🟢 **EN:** XOR trick: maintain a "seen" set — if num in set, form a pair; else add to set.
  **VI:** Mẹo XOR: duy trì set "đã thấy" — nếu số có trong set thì tạo cặp; không thì thêm vào.
- 🟢 **EN:** Result[0] = total pairs, result[1] = remaining unpaired elements.
  **VI:** Kết quả[0] = tổng cặp, kết quả[1] = số phần tử chưa được ghép.
- 🟢 **EN:** Note: result[0] + result[1] doesn't necessarily equal n; leftover ≠ n - 2\*pairs in all framings.
  **VI:** Lưu ý: result[0] + result[1] không nhất thiết bằng n.
- 🟢 **EN:** Time O(n), Space O(n) for frequency map; O(1) with the XOR/toggle set approach.
  **VI:** Thời gian O(n), Không gian O(n) với map; O(1) với phương pháp toggle set.

---

---

## Solutions

```typescript
function numberOfPairs_freq(nums: number[]): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  let pairs = 0,
    leftover = 0;
  for (const cnt of freq.values()) {
    pairs += Math.floor(cnt / 2);
    leftover += cnt % 2;
  }
  return [pairs, leftover];
}

console.log(numberOfPairs_freq([1, 3, 2, 1, 3, 2, 2])); // [3, 1]
console.log(numberOfPairs_freq([1, 1])); // [1, 0]
console.log(numberOfPairs_freq([0])); // [0, 1]

function numberOfPairs(nums: number[]): number[] {
  const waiting = new Set<number>(); // elements waiting for a match
  let pairs = 0;

  for (const n of nums) {
    if (waiting.has(n)) {
      pairs++;
      waiting.delete(n); // pair formed, remove from waiting
    } else {
      waiting.add(n);
    }
  }
  return [pairs, waiting.size]; // waiting.size = leftover count
}

// Test cases
console.log(numberOfPairs([1, 3, 2, 1, 3, 2, 2])); // Expected: [3, 1]
console.log(numberOfPairs([1, 1])); // Expected: [1, 0]
console.log(numberOfPairs([0])); // Expected: [0, 1]
console.log(numberOfPairs([5, 5, 5, 5])); // Expected: [2, 0]
console.log(numberOfPairs([1, 2, 3, 4])); // Expected: [0, 4]

function numberOfPairs_sort(nums: number[]): number[] {
  nums.sort((a, b) => a - b);
  let pairs = 0,
    leftover = 0;
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      pairs++;
      i += 2;
    } else {
      leftover++;
      i++;
    }
  }
  return [pairs, leftover];
}

console.log(numberOfPairs_sort([1, 3, 2, 1, 3, 2, 2])); // [3, 1]
```

---

## 🔗 Related Problems

| #    | Problem                          | Difficulty | Pattern  |
| ---- | -------------------------------- | ---------- | -------- |
| 1512 | Number of Good Pairs             | 🟢 Easy    | Hash Map |
| 2206 | Divide Array Into Equal Pairs    | 🟢 Easy    | Counting |
| 2341 | Maximum Number of Pairs in Array | 🟢 Easy    | Hash Map |
