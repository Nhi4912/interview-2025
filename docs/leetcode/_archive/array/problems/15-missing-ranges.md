---
layout: page
title: "Missing Ranges"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/missing-ranges/"
---

# Missing Ranges / Tìm Các Khoảng Số Còn Thiếu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Linear Scan — Gap Detection
> **Frequency**: 📘 Tier 3 — Thỉnh thoảng xuất hiện ở Amazon/Google; từng là bài locked
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Summary Ranges #228](https://leetcode.com/problems/summary-ranges/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn có một dãy số từ `lower` đến `upper` và một danh sách các số đã "lấp đầy". Nhiệm vụ là tìm những "khoảng trống" còn lại. Chiến lược tốt nhất: thêm hai "lính canh" giả — `lower - 1` ở đầu và `upper + 1` ở cuối — rồi quét qua tìm mọi khoảng cách > 1 giữa hai phần tử liên tiếp.

- **Pattern Recognition:**
  - Mảng đã được sort → chỉ cần linear scan một lần để phát hiện gap
  - Thêm "sentinel" ở hai đầu để loại bỏ xử lý edge case cho lower/upper boundary
  - Gap: `next - curr > 1` → khoảng thiếu là `[curr+1, next-1]`; nếu bằng nhau thì chỉ là một số

- **Visual — Boundary Padding Trick:**

  ```
  nums=[0,1,3,50,75], lower=0, upper=99

  Thêm sentinels → extended = [-1, 0, 1, 3, 50, 75, 100]
                                ↑                        ↑
                              lower-1              upper+1

  Quét cặp liên tiếp:
  (-1, 0):  0-(-1) = 1 → không gap
  (0,  1):  1-0    = 1 → không gap
  (1,  3):  3-1    = 2 → gap: [2, 2]     → "2"
  (3, 50):  50-3   = 47 → gap: [4, 49]  → "4->49"
  (50, 75): 75-50  = 25 → gap: [51, 74] → "51->74"
  (75,100): 100-75 = 25 → gap: [76, 99] → "76->99"

  Result: ["2", "4->49", "51->74", "76->99"] ✅
  ```

## Problem Description

Cho mảng số nguyên `nums` đã sort, và khoảng `[lower, upper]`. Trả về danh sách các khoảng số còn thiếu dưới dạng chuỗi `"a"` (một số) hoặc `"a->b"` (nhiều số liên tiếp).

| Input                                   | Output                            | Ghi chú                      |
| --------------------------------------- | --------------------------------- | ---------------------------- |
| `nums=[0,1,3,50,75], lower=0, upper=99` | `["2","4->49","51->74","76->99"]` | Trường hợp cơ bản            |
| `nums=[-1], lower=-1, upper=-1`         | `[]`                              | Không thiếu số nào           |
| `nums=[], lower=1, upper=5`             | `["1->5"]`                        | Mảng rỗng → toàn bộ là thiếu |

## 📝 Interview Tips

- 🇻🇳 **Boundary padding trick** là cách clean nhất: tránh viết if/else riêng cho lower và upper / 🇬🇧 _Padding with lower-1 and upper+1 eliminates all boundary if-else cases_
- 🇻🇳 Lưu ý format: một số đơn → `"a"`, nhiều số → `"a->b"` (không phải `"a-b"`) / 🇬🇧 _Format detail: single number → "a", range → "a->b" with arrow, not dash_
- 🇻🇳 Mảng đã sorted → không cần Set/Map, chỉ cần O(1) space / 🇬🇧 _Input is sorted — no need for Set/Map, linear scan is optimal_
- 🇻🇳 Đặc biệt cẩn thận với số âm trong khoảng — formatRange phải handle được / 🇬🇧 _Watch out for negative numbers — "-3->-1" is valid output_
- 🇻🇳 Đây là bài LC #163 (locked) — thường được hỏi dưới dạng biến thể / 🇬🇧 _This is a locked problem — expect it in variant form ("find gaps in sorted array")_

## Solutions

```typescript
/**

- Solution 1: Boundary Padding — Clean, No Edge Cases
- Thêm (lower-1) và (upper+1) như sentinels, rồi quét tất cả cặp liên tiếp.
- Xử lý lower/upper boundary tự động — không cần if/else riêng.
-
- @time O(n) — linear scan qua extended array
- @space O(n) — extended array; output list không tính
  */
  function findMissingRanges(nums: number[], lower: number, upper: number): string[] {
  const fmt = (a: number, b: number): string => a === b ? `${a}` : `${a}->${b}`;
  const result: string[] = [];
  const ext = [lower - 1, ...nums, upper + 1]; // add sentinels at both ends

for (let i = 0; i < ext.length - 1; i++) {
if (ext[i + 1] - ext[i] > 1) {
result.push(fmt(ext[i] + 1, ext[i + 1] - 1));
}
}

return result;
}

// findMissingRanges([0,1,3,50,75], 0, 99) → ["2","4->49","51->74","76->99"]
// findMissingRanges([-1], -1, -1) → []
// findMissingRanges([], 1, 5) → ["1->5"]
// findMissingRanges([1,3,5,7], 0, 9) → ["0","2","4","6","8->9"]

/**

- Solution 2: Explicit Linear Scan (Không dùng spread, tường minh hơn)
- Kiểm tra từng khoảng: trước nums[0], giữa các phần tử liên tiếp, sau nums[last].
- Rõ ràng về ý định nhưng cần xử lý 3 edge case riêng biệt.
-
- @time O(n) — ba đoạn quét nhưng tổng vẫn O(n)
- @space O(1) — không dùng mảng phụ (ngoài output)
  */
  function findMissingRangesExplicit(nums: number[], lower: number, upper: number): string[] {
  const fmt = (a: number, b: number): string => a === b ? `${a}` : `${a}->${b}`;
  const result: string[] = [];

if (nums.length === 0) {
if (lower <= upper) result.push(fmt(lower, upper));
return result;
}

if (lower < nums[0]) result.push(fmt(lower, nums[0] - 1));
for (let i = 0; i < nums.length - 1; i++)
if (nums[i + 1] - nums[i] > 1) result.push(fmt(nums[i] + 1, nums[i + 1] - 1));
if (nums[nums.length - 1] < upper) result.push(fmt(nums[nums.length - 1] + 1, upper));

return result;
}

// findMissingRangesExplicit([0,1,3,50,75], 0, 99) → ["2","4->49","51->74","76->99"]
// findMissingRangesExplicit([], -3, -1) → ["-3->-1"]
```

## 🔗 Related Problems

- [228. Summary Ranges](https://leetcode.com/problems/summary-ranges/) — bài đối ngẫu: tóm tắt các dãy số **có** trong mảng
- [163. Missing Ranges](https://leetcode.com/problems/missing-ranges/) — bài này (bản locked)
- [57. Insert Interval](https://leetcode.com/problems/insert-interval/) — cùng kỹ thuật quét và merge khoảng
- [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/) — tổng quát hoá: hợp nhất các khoảng chồng nhau
