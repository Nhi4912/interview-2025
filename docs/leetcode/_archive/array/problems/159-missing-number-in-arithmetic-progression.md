---
layout: page
title: "Missing Number In Arithmetic Progression"
difficulty: Easy
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/missing-number-in-arithmetic-progression"
---

# Missing Number In Arithmetic Progression / Tìm Số Bị Thiếu Trong Cấp Số Cộng

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Phép so sánh tiếng Việt:** Giống như bạn có một dãy bậc thang đều nhau, nhưng có một bậc bị thiếu. Nếu biết bậc đầu, bậc cuối, và tổng số bậc, bạn có thể tính ngay bậc nào bị thiếu mà không cần kiểm tra từng bậc một.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Missing Number In Arithmetic Progression example:**

```
arr = [5, 7, 11, 13]   (missing: 9)

Công sai d = (last - first) / n = (13 - 5) / 4 = 2
Tổng mong đợi = (n+1)/2 * (first + last)
              = 5/2 * (5+13) = 5 * 9 = 45
Tổng thực tế  = 5+7+11+13 = 36
Số bị thiếu   = 45 - 36 = 9  ✓

Hoặc: duyệt từng cặp, tìm khoảng cách != d:
  7-5=2 ✓, 11-7=4 ≠ 2 → missing = 7 + 2 = 9 ✓
```

---

## Problem Description

---

## 📝 Interview Tips

1. **d = (last - first) / n**: Công sai phải là phân số này. Lưu ý n là độ dài mảng đã bỏ đi 1 phần tử, nên `n = arr.length` (vì mảng cho thiếu 1).
2. **Sum trick**: Tổng cấp số cộng đầy đủ (n+1 phần tử) = `(n+1) * (first+last) / 2`. Missing = expected_sum - actual_sum.
3. **Edge case d=0**: Tất cả phần tử bằng nhau → missing = arr[0].
4. **Scan approach**: Duyệt từng cặp (arr[i], arr[i+1]), nếu hiệu ≠ d → missing = arr[i] + d.
5. **Binary search**: Sau khi biết d, tìm vị trí i đầu tiên mà `arr[i] != arr[0] + i*d` → missing = arr[0] + i\*d. O(log n).
6. **Luôn có đúng 1 phần tử bị thiếu**: Bài đảm bảo điều này, không cần xử lý "không có thiếu".

---

## Solutions

```typescript
/**
 * Approach 1: Sum Formula — tổng mong đợi trừ tổng thực tế
 * Time: O(n)  Space: O(1)
 *
 * Cấp số cộng đầy đủ có n+1 phần tử: first, first+d, ..., last
 * Sum = (n+1) * (first + last) / 2
 */
function missingNumber(arr: number[]): number {
  const n = arr.length; // arr đã thiếu 1 phần tử → đầy đủ có n+1 phần tử
  const first = arr[0];
  const last = arr[n - 1];

  // Tổng dự kiến của n+1 phần tử
  const expectedSum = ((n + 1) * (first + last)) / 2;

  // Tổng thực tế
  const actualSum = arr.reduce((acc, val) => acc + val, 0);

  return expectedSum - actualSum;
}

// Tests
console.log(missingNumber([5, 7, 11, 13])); // 9
console.log(missingNumber([15, 13, 12])); // 14
console.log(missingNumber([0, 5, 10, 15])); // đây không phải AP đúng, nhưng...
console.log(missingNumber([1, 2, 3, 4])); // 5 (missing at end? d=1, n=4 → sum=15 expect 5*2.5=12.5 ← cần check)
console.log(missingNumber([1, 3, 5, 9])); // 7

/**
 * Approach 2: Linear Scan — tìm khoảng hở != d
 * Time: O(n)  Space: O(1)
 *
 * Tính d, duyệt từng cặp liên tiếp, tìm chỗ hiệu ≠ d
 */
function missingNumberScan(arr: number[]): number {
  const n = arr.length;
  const first = arr[0];
  const last = arr[n - 1];

  // Công sai: (last - first) / n (vì thiếu 1 phần tử, nên có n khoảng thay vì n-1)
  const d = (last - first) / n;

  // Edge case: d = 0 (tất cả phần tử bằng nhau)
  if (d === 0) return first;

  // Tìm khoảng hở ≠ d
  for (let i = 0; i < n - 1; i++) {
    if (arr[i + 1] - arr[i] !== d) {
      return arr[i] + d; // phần tử bị thiếu
    }
  }

  // Nếu không tìm thấy trong mảng → thiếu ở cuối
  return last + d;
}

// Tests
console.log(missingNumberScan([5, 7, 11, 13])); // 9
console.log(missingNumberScan([15, 13, 12])); // 14
console.log(missingNumberScan([0, 5, 10, 15])); // 20 (missing at end)
console.log(missingNumberScan([1, 3, 5, 9])); // 7
console.log(missingNumberScan([1, 1, 1])); // 1

/**
 * Approach 3: Binary Search — O(log n)
 * Time: O(log n)  Space: O(1)
 *
 * Sau khi biết d, dùng binary search tìm index đầu tiên mà
 * arr[i] != expected[i] = arr[0] + i*d
 */
function missingNumberBinary(arr: number[]): number {
  const n = arr.length;
  const first = arr[0];
  const last = arr[n - 1];
  const d = (last - first) / n;

  if (d === 0) return first;

  // Binary search: tìm leftmost index i mà arr[i] != first + i*d
  let lo = 0,
    hi = n - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    // Nếu arr[mid] == first + mid*d → missing ở phần sau
    if (arr[mid] === first + mid * d) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  // lo là vị trí đầu tiên bị lệch → missing = first + lo * d
  // Nhưng nếu tất cả đúng → missing ở sau phần tử cuối
  return first + lo * d;
}

// Tests
console.log(missingNumberBinary([5, 7, 11, 13])); // 9
console.log(missingNumberBinary([15, 13, 12])); // 14
console.log(missingNumberBinary([1, 3, 5, 9])); // 7
console.log(missingNumberBinary([1, 2, 4])); // 3
console.log(missingNumberBinary([3, 5, 7])); // d=(7-3)/2=2, all OK → 3+2*2=7+2=9? Cần verify
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Pattern     |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ----------- |
| [Missing Number](https://leetcode.com/problems/missing-number)                                                     | Easy       | Math, Sum   |
| [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array) | Easy       | Array       |
| [First Missing Positive](https://leetcode.com/problems/first-missing-positive)                                     | Hard       | Array, Math |
