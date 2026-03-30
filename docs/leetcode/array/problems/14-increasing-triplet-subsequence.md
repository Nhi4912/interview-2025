---
layout: page
title: "Increasing Triplet Subsequence"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/increasing-triplet-subsequence/"
---

# Increasing Triplet Subsequence / Tìm Bộ Ba Tăng Dần

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy — Two Sentinels
> **Frequency**: 📘 Tier 2 — Câu hỏi trick phổ biến ở Google/Meta; O(n) space thực sự thách thức
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Longest Increasing Subsequence #300](https://leetcode.com/problems/longest-increasing-subsequence/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn đang canh giữ hai "ngưỡng cửa": cửa thứ nhất (`first`) giữ số nhỏ nhất từng thấy, cửa thứ hai (`second`) giữ số nhỏ nhất mà lớn hơn `first`. Mỗi khi gặp một số vượt qua cả hai cửa — bạn đã tìm được bộ ba tăng dần. Điều kỳ diệu là `first` và `second` có thể không thực sự ở vị trí đúng, nhưng **sự tồn tại** của chúng đảm bảo bộ ba hợp lệ tồn tại.

- **Pattern Recognition:**
  - Cần tìm `i < j < k` với `nums[i] < nums[j] < nums[k]` → có thể dùng greedy thay vì O(n³) brute force
  - Duy trì 2 giá trị minimum (`first`, `second`) → mỗi lần gặp số lớn hơn cả hai → return `true`
  - **Trick quan trọng**: khi `first` được cập nhật sau `second`, `second` vẫn hợp lệ vì một `first` nhỏ hơn đã tồn tại trước đó

- **Visual — Two Sentinels trên `[2, 1, 5, 0, 4, 6]`:**
  ```
  first=∞  second=∞
  n=2: 2 ≤ ∞    → first=2        [first=2,  second=∞]
  n=1: 1 ≤ 2    → first=1        [first=1,  second=∞]  ← first giảm xuống 1
  n=5: 5 > 2    → second=5       [first=1,  second=5]   ← nhưng second=5 vẫn hợp lệ (có first=2 trước đó!)
  n=0: 0 ≤ 1    → first=0        [first=0,  second=5]
  n=4: 0<4≤5    → second=4       [first=0,  second=4]
  n=6: 6 > 4    → return true ✅  (chuỗi thực: 1 < 5 < 6, hoặc 2 < 5 < 6)
  ```

## Problem Description

Cho mảng `nums`, trả về `true` nếu tồn tại chỉ số `i < j < k` sao cho `nums[i] < nums[j] < nums[k]`.

| Input           | Output  | Lý do                         |
| --------------- | ------- | ----------------------------- |
| `[1,2,3,4,5]`   | `true`  | Bộ ba rõ ràng: 1<2<3          |
| `[5,4,3,2,1]`   | `false` | Mảng giảm dần, không có bộ ba |
| `[2,1,5,0,4,6]` | `true`  | Bộ ba ẩn: 1<5<6 (hoặc 2<4<6)  |

## 📝 Interview Tips

- 🇻🇳 Brute force O(n³) là acceptable starting point để giải thích; sau đó optimize / 🇬🇧 _Mention O(n³) brute force first to show understanding, then optimise_
- 🇻🇳 Điểm dễ nhầm: `first` có thể được cập nhật sau `second` nhưng logic vẫn đúng / 🇬🇧 _The non-obvious part: first can be updated AFTER second — the invariant still holds_
- 🇻🇳 Khi được hỏi "giải thích tại sao đúng": `second` tồn tại nghĩa là có một `first` trước đó nhỏ hơn nó / 🇬🇧 _"Why correct?" — second's existence guarantees an earlier first that was smaller_
- 🇻🇳 Bài này không thể dùng sort (phá vỡ thứ tự index) / 🇬🇧 _Cannot sort — relative index order (i < j < k) must be preserved_
- 🇻🇳 Nếu cần tìm bộ ba thực sự (không chỉ boolean): dùng prefix/suffix min array → O(n) space / 🇬🇧 _If you need to return the triplet: use prefix-min + suffix-max arrays_

## Solutions

{% raw %}
/\*\*

- Solution 1: Two Sentinels — Optimal (Greedy)
- Duy trì `first` = số nhỏ nhất và `second` = số nhỏ nhất mà > first.
- Nếu gặp số > second → tồn tại bộ ba tăng dần.
-
- @time O(n) — một lần duyệt duy nhất
- @space O(1) — chỉ hai biến phụ
  \*/
  function increasingTriplet(nums: number[]): boolean {
  let first = Infinity;
  let second = Infinity;

for (const n of nums) {
if (n <= first) {
first = n; // cập nhật số nhỏ nhất đã thấy
} else if (n <= second) {
second = n; // cập nhật số nhỏ thứ hai (phải > first tại thời điểm gán)
} else {
return true; // n > second > first (tại thời điểm second được gán) → bộ ba hợp lệ
}
}

return false;
}

// increasingTriplet([1,2,3,4,5]) → true (1<2<3)
// increasingTriplet([5,4,3,2,1]) → false (giảm dần)
// increasingTriplet([2,1,5,0,4,6]) → true (1<5<6)
// increasingTriplet([1,1,1,1,1]) → false (bằng nhau, cần strictly increasing)

/\*\*

- Solution 2: Brute Force — O(n³) (chỉ dùng để giải thích ý tưởng ban đầu)
- Kiểm tra mọi bộ ba (i, j, k) với i < j < k.
- Rõ ràng nhất về logic nhưng không scalable.
-
- @time O(n³) — ba vòng lặp lồng nhau
- @space O(1)
  \*/
  function increasingTripletBrute(nums: number[]): boolean {
  const n = nums.length;
  for (let i = 0; i < n - 2; i++)
  for (let j = i + 1; j < n - 1; j++)
  for (let k = j + 1; k < n; k++)
  if (nums[i] < nums[j] && nums[j] < nums[k]) return true;
  return false;
  }

// increasingTripletBrute([1,2,3]) → true
// increasingTripletBrute([3,2,1]) → false
// increasingTripletBrute([1,1,2]) → false (không strictly increasing)
{% endraw %}

## 🔗 Related Problems

- [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) — tổng quát hoá: tìm dãy con tăng dài nhất
- [128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) — cùng kỹ thuật greedy/greedy tracking
- [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) — cùng kỹ thuật duy trì 2 giá trị cực trị
- [2552. Count Increasing Quadruplets](https://leetcode.com/problems/count-increasing-quadruplets/) — mở rộng: bộ bốn tăng dần
