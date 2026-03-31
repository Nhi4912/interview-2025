---
layout: page
title: "XOR Queries of a Subarray"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/xor-queries-of-a-subarray"
---

# XOR Queries of a Subarray / Truy Vấn XOR Của Mảng Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix XOR

---

## 🧠 Intuition / Trực Giác

**VI:** Giống prefix sum nhưng dùng XOR thay vì cộng. XOR có tính chất tự nghịch đảo: `a ^ a = 0`. Vì vậy `prefix[r+1] ^ prefix[l]` cho XOR của đoạn `[l, r]` — cùng lý do như `sum[r+1] - sum[l]` cho tổng đoạn.

**EN:** Just like prefix sums but with XOR. XOR is self-inverse: `a ^ a = 0`. So `prefix[r+1] ^ prefix[l]` gives XOR of range `[l, r]` — same reasoning as range sum with prefix array.

```
arr = [1, 3, 4, 8]
prefix[0] = 0
prefix[1] = 0^1 = 1
prefix[2] = 1^3 = 2
prefix[3] = 2^4 = 6
prefix[4] = 6^8 = 14

Query [0,1]: prefix[2] ^ prefix[0] = 2^0 = 2  ✓ (1^3=2)
Query [1,2]: prefix[3] ^ prefix[1] = 6^1 = 7  ✓ (3^4=7)
Query [0,3]: prefix[4] ^ prefix[0] = 14^0 = 14 ✓ (1^3^4^8=14)
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🟡 **EN:** XOR range query: `prefix[r+1] ^ prefix[l]` — memorize this formula.
  **VI:** Truy vấn XOR đoạn: `prefix[r+1] ^ prefix[l]` — ghi nhớ công thức này.
- 🟡 **EN:** XOR key properties: commutative, associative, self-inverse (a^a=0), identity (a^0=a).
  **VI:** Tính chất XOR: giao hoán, kết hợp, tự nghịch đảo (a^a=0), đơn vị (a^0=a).
- 🟡 **EN:** Build prefix array of size n+1 with prefix[0]=0 to avoid edge case at l=0.
  **VI:** Xây mảng prefix kích thước n+1 với prefix[0]=0 để tránh edge case tại l=0.
- 🟡 **EN:** Preprocessing O(n), each query O(1) — total O(n + q).
  **VI:** Tiền xử lý O(n), mỗi truy vấn O(1) — tổng O(n + q).
- 🟡 **EN:** Same pattern applies to range AND/OR queries.
  **VI:** Cùng mẫu áp dụng cho truy vấn AND/OR theo đoạn.
- 🟡 **EN:** Brute force is O(n*q) — mention it, then improve to O(n+q).
  **VI:** Brute force O(n*q) — đề cập rồi cải thiện lên O(n+q).

---

## Solutions / Giải Pháp

### Solution 1: Brute Force — O(n \* q) Time, O(1) Extra Space

```typescript
function xorQueries_brute(arr: number[], queries: number[][]): number[] {
  return queries.map(([l, r]) => {
    let xor = 0;
    for (let i = l; i <= r; i++) xor ^= arr[i];
    return xor;
  });
}

console.log(
  xorQueries_brute(
    [1, 3, 4, 8],
    [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 3],
    ],
  ),
);
// Expected: [2, 7, 14, 8]
```

### Solution 2: Prefix XOR — O(n + q) Time, O(n) Space ✅ Optimal

```typescript
function xorQueries(arr: number[], queries: number[][]): number[] {
  const n = arr.length;
  // Build prefix XOR array; prefix[i] = XOR of arr[0..i-1]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] ^ arr[i];
  }
  // Answer each query in O(1)
  return queries.map(([l, r]) => prefix[r + 1] ^ prefix[l]);
}

// Test cases
console.log(
  xorQueries(
    [1, 3, 4, 8],
    [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 3],
    ],
  ),
);
// Expected: [2, 7, 14, 8]
console.log(
  xorQueries(
    [4, 8, 2, 10],
    [
      [2, 3],
      [1, 3],
      [0, 0],
      [0, 3],
    ],
  ),
);
// Expected: [8, 0, 4, 4]
console.log(xorQueries([1], [[0, 0]]));
// Expected: [1]
```

### Solution 3: In-Place Prefix XOR (Space O(1) Extra) ✅

```typescript
function xorQueriesInPlace(arr: number[], queries: number[][]): number[] {
  // Modify arr to be prefix XOR in-place
  for (let i = 1; i < arr.length; i++) arr[i] ^= arr[i - 1];
  return queries.map(([l, r]) => (l === 0 ? arr[r] : arr[r] ^ arr[l - 1]));
}

console.log(
  xorQueriesInPlace(
    [1, 3, 4, 8],
    [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 3],
    ],
  ),
);
// Expected: [2, 7, 14, 8]
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                              | Difficulty | Pattern    |
| ---- | ---------------------------------------------------- | ---------- | ---------- |
| 303  | Range Sum Query - Immutable                          | 🟢 Easy    | Prefix Sum |
| 1442 | Count Triplets That Can Form Two Arrays of Equal XOR | 🟡 Medium  | Prefix XOR |
| 1310 | XOR Queries of a Subarray                            | 🟡 Medium  | Prefix XOR |
