---
layout: page
title: "Degree of an Array"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/degree-of-an-array"
---

# Degree of an Array / Bậc Của Mảng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map — Three Trackers
> **Frequency**: 📘 Tier 3 — Gặp ở Google, Amazon; test khả năng kết hợp nhiều hash map song song
> **See also**: [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn đang theo dõi cuộc bỏ phiếu — bạn muốn biết ứng viên nào được bầu nhiều nhất, và tìm khoảng thời gian ngắn nhất mà ứng viên đó nhận đủ phiếu. Ba cuốn sổ tay song song: một ghi số lần xuất hiện, một ghi lần đầu xuất hiện, một ghi lần cuối xuất hiện.

- **Pattern Recognition:**
  - Bậc = tần suất xuất hiện cao nhất của một phần tử bất kỳ
  - Subarray nhỏ nhất cùng bậc = từ `first[x]` đến `last[x]` của phần tử có count cao nhất
  - Dùng 3 map song song: `count`, `first`, `last` → O(n) một lần duyệt, không cần sort

- **Visual — `[1, 2, 2, 3, 1, 4, 2]`:**

  ```
  idx:   0  1  2  3  4  5  6
  val:   1  2  2  3  1  4  2

  count: {1:2, 2:3, 3:1, 4:1}   ← degree = 3 (phần tử 2)
  first: {1:0, 2:1, 3:3, 4:5}
  last:  {1:4, 2:6, 3:3, 4:5}

  Với degree=3 (num=2): length = last[2]-first[2]+1 = 6-1+1 = 6 ✅
  Với degree=2 (num=1): length = last[1]-first[1]+1 = 4-0+1 = 5 (không cùng bậc)
  ```

## Problem Description

Cho mảng số nguyên không âm `nums`, **bậc** của mảng là tần suất xuất hiện cao nhất của bất kỳ phần tử nào. Trả về độ dài nhỏ nhất của subarray liên tục có cùng bậc với `nums`.

| Input             | Output | Giải thích                                                   |
| ----------------- | ------ | ------------------------------------------------------------ |
| `[1,2,2,3,1]`     | `2`    | Bậc=2, cả 1 và 2 đều xuất hiện 2 lần; subarray `[2,2]` dài 2 |
| `[1,2,2,3,1,4,2]` | `6`    | Bậc=3 (số 2 xuất hiện 3 lần); subarray `[2,2,3,1,4,2]` dài 6 |

## 📝 Interview Tips

- 🇻🇳 Subarray nhỏ nhất cùng bậc luôn bắt đầu và kết thúc tại vị trí đầu/cuối của phần tử đó / 🇬🇧 _Optimal subarray always starts at first and ends at last occurrence of the dominant element_
- 🇻🇳 Khi nhiều phần tử cùng bậc, phải kiểm tra tất cả và lấy min window / 🇬🇧 _When multiple elements tie for max frequency, check all and take the minimum window_
- 🇻🇳 Đừng nhầm "subarray ngắn nhất" với "phần tử có tần suất thấp nhất" / 🇬🇧 _Don't confuse "shortest subarray" with "lowest frequency element"_
- 🇻🇳 Có thể merge vòng lặp tìm degree vào vòng lặp chính, cập nhật result ngay inline / 🇬🇧 _Can merge degree-finding into main loop — update result inline for single-pass elegance_
- 🇻🇳 Edge case: mảng có 1 phần tử → degree=1, subarray=1 → trả về 1 / 🇬🇧 _Single element array: degree=1, answer=1_

## Solutions

```typescript
/**
 * Solution 1: Three Hash Maps — Two Pass
 * Lần 1: xây dựng count, first, last cho từng phần tử.
 * Lần 2: tìm degree, rồi duyệt các phần tử cùng bậc để lấy window ngắn nhất.
 *
 * @time O(n) — hai lần duyệt tuyến tính
 * @space O(n) — tối đa n phần tử khác nhau trong các map
 */
function findShortestSubArray(nums: number[]): number {
  const count = new Map<number, number>();
  const first = new Map<number, number>();
  const last = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    count.set(n, (count.get(n) ?? 0) + 1);
    if (!first.has(n)) first.set(n, i);
    last.set(n, i);
  }

  let degree = 0;
  for (const c of count.values()) degree = Math.max(degree, c);

  let result = nums.length;
  for (const [num, c] of count) {
    if (c === degree) {
      result = Math.min(result, last.get(num)! - first.get(num)! + 1);
    }
  }
  return result;
}

console.log(findShortestSubArray([1, 2, 2, 3, 1])); // 2
console.log(findShortestSubArray([1, 2, 2, 3, 1, 4, 2])); // 6
console.log(findShortestSubArray([1])); // 1

/**
 * Solution 2: Single Pass — Inline Degree Tracking
 * Cập nhật degree và result ngay trong vòng lặp duy nhất.
 * Không cần vòng lặp thứ hai để tìm max.
 *
 * @time O(n) — một lần duyệt duy nhất
 * @space O(n) — ba map
 */
function findShortestSubArrayV2(nums: number[]): number {
  const count = new Map<number, number>();
  const first = new Map<number, number>();
  const last = new Map<number, number>();

  let degree = 0;
  let result = 0;

  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if (!first.has(n)) first.set(n, i);
    last.set(n, i);
    count.set(n, (count.get(n) ?? 0) + 1);

    const c = count.get(n)!;
    const len = last.get(n)! - first.get(n)! + 1;

    if (c > degree) {
      degree = c;
      result = len; // phần tử này chiếm bậc mới → reset result
    } else if (c === degree) {
      result = Math.min(result, len); // cùng bậc → giữ window ngắn hơn
    }
  }
  return result;
}

console.log(findShortestSubArrayV2([1, 2, 2, 3, 1])); // 2
console.log(findShortestSubArrayV2([1, 2, 2, 3, 1, 4, 2])); // 6
console.log(findShortestSubArrayV2([2, 1])); // 1
```

## 🔗 Related Problems

| Problem                                                                                                                           | Pattern               | Difficulty |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------- |
| [128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence)                                   | Hash Set              | 🟡 Medium  |
| [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                                                 | Prefix Sum + Hash Map | 🟡 Medium  |
| [169. Majority Element](https://leetcode.com/problems/majority-element)                                                           | Frequency Count       | 🟢 Easy    |
| [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | Sliding Window        | 🟡 Medium  |
