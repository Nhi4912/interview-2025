---
layout: page
title: "First Bad Version"
difficulty: Easy
category: Sorting-Searching
tags: [Binary Search, Interactive]
leetcode_url: "https://leetcode.com/problems/first-bad-version/"
---

# First Bad Version / Phiên Bản Lỗi Đầu Tiên

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search (left boundary)
> **Frequency**: ⭐ Tier 2 — Pattern chuẩn cho "tìm điểm chuyển trạng thái" (false→true)
> **See also**: [Sort Colors](./03-sort-colors.md) | [Search in Rotated Array](./03-search-in-rotated-sorted-array.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Một lô hàng 1000 sản phẩm trên dây chuyền — từ một thời điểm nào đó trở đi tất cả đều lỗi. Thay vì kiểm tra từng sản phẩm (O(n)), bạn lấy sản phẩm ở giữa kiểm tra: lỗi thì hỏng xảy ra trước hoặc đúng đây; tốt thì hỏng xảy ra sau. Cứ thu hẹp nửa cho đến khi tìm được điểm đầu tiên.

**Pattern Recognition:**

- Signal: array là `[good, good, ..., bad, bad, bad]` → tìm **left boundary** của bad
- Không dùng `mid = (left + right) / 2` (overflow) → dùng `left + (right - left) / 2`
- Khi `isBadVersion(mid)` true: `right = mid` (không phải `mid-1`) để giữ candidate
- Loop kết thúc khi `left === right` → đó chính là đáp án

**Visual — n=10, bad=4:**

```
Versions:  1   2   3   4   5   6   7   8   9  10
Status:    G   G   G   B   B   B   B   B   B   B

left=1, right=10
  mid=5 → isBad(5)=true  → right=5
  mid=3 → isBad(3)=false → left=4
  mid=4 → isBad(4)=true  → right=4
  left===right===4  ✅
```

---

## Problem Description

You have `n` versions `[1..n]`. Once a version is bad, all subsequent versions are bad too. Given API `isBadVersion(v): boolean`, find the **first** bad version with minimal API calls.

```
Example 1: n=5, bad=4  → 4   (calls: isBad(3)=F, isBad(5)=T, isBad(4)=T → answer 4)
Example 2: n=1, bad=1  → 1
Example 3: n=10, bad=1 → 1   (all bad from start)
```

Constraints: `1 <= bad <= n <= 2^31 - 1`

---

## 📝 Interview Tips

1. **Overflow**: `(left + right) / 2` overflows khi n gần 2^31 → luôn dùng `left + Math.floor((right - left) / 2)`
2. **Tại sao `right = mid`?** Vì mid có thể _là_ đáp án — không được bỏ qua nó
3. **Tại sao `left = mid + 1`?** Vì isBad(mid)=false → mid chắc chắn không phải đáp án
4. **Template**: bài này là template **"tìm left boundary"** — áp dụng cho mọi bài tìm điểm chuyển trạng thái
5. **Minimize API calls**: Binary search cho O(log n) calls — nhấn mạnh điều này với interviewer
6. **Edge case**: n=1 → left=right=1 ngay từ đầu, loop không chạy, trả về 1 đúng

---

## Solutions

{% raw %}
// Mock API (provided by LeetCode)
let \_bad = 0;
function isBadVersion(v: number): boolean { return v >= \_bad; }

/\*\*

- Solution 1: Linear Search (Brute Force)
- Time O(n), Space O(1) — tệ khi n ~ 2^31
  \*/
  function firstBadVersionLinear(n: number): number {
  for (let i = 1; i <= n; i++) {
  if (isBadVersion(i)) return i;
  }
  return n;
  }

/\*\*

- Solution 2: Binary Search — Left Boundary (Optimal)
- Time O(log n), Space O(1)
-
- Loop invariant:
- - answer is always in [left, right]
- - when left === right, we found the answer
    \*/
    function firstBadVersion(n: number): number {
    let left = 1;
    let right = n;

while (left < right) {
const mid = left + Math.floor((right - left) / 2);

    if (isBadVersion(mid)) {
      right = mid;      // mid could be the answer, keep it
    } else {
      left = mid + 1;   // mid is definitely good, discard it
    }

}

return left; // left === right === first bad version
}

// --- Quick inline tests ---
\_bad = 4; console.log(firstBadVersion(5) === 4); // true
\_bad = 1; console.log(firstBadVersion(1) === 1); // true
\_bad = 1; console.log(firstBadVersion(10) === 1); // true
\_bad = 10;console.log(firstBadVersion(10) === 10); // true
{% endraw %}

---

## 🔗 Related Problems

| Problem                                                                                          | Relationship                              |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [278. First Bad Version](https://leetcode.com/problems/first-bad-version/)                       | This problem                              |
| [35. Search Insert Position](https://leetcode.com/problems/search-insert-position/)              | Same left-boundary binary search template |
| [374. Guess Number Higher or Lower](https://leetcode.com/problems/guess-number-higher-or-lower/) | Interactive binary search, same structure |
| [704. Binary Search](https://leetcode.com/problems/binary-search/)                               | Classic binary search foundation          |
| [162. Find Peak Element](https://leetcode.com/problems/find-peak-element/)                       | Boundary search variant                   |
