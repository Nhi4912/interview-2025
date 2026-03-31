---
layout: page
title: "Flatten Deeply Nested Array"
difficulty: Medium
category: Others
tags: []
leetcode_url: "https://leetcode.com/problems/flatten-deeply-nested-array"
---

# Flatten Deeply Nested Array / Làm Phẳng Mảng Lồng Nhau Nhiều Cấp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Recursion / DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator) | [JSON Deep Equal](https://leetcode.com/problems/json-deep-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Hình dung bạn có một hộp quà bên trong có nhiều hộp nhỏ hơn, và bên trong hộp nhỏ lại có hộp nhỏ hơn nữa. Nhiệm vụ của bạn là lấy tất cả quà ra ngoài. Nhưng nếu `n=1`, chỉ mở hộp ngoài cùng; nếu `n=Infinity`, mở tất cả hộp đến tận cùng.

**Pattern Recognition:**

- Signal: "flatten to depth n" → **Recursive DFS** with depth counter
- Base cases: `depth === 0` (stop flattening) OR element is not array (emit as-is)
- Key insight: `flat(n)` = bỏ một lớp ngoặc mỗi lần đệ quy, giảm `n` đi 1

**Visual:**

```
Input: [1, [2, [3, [4]]], 5]  depth=1
       |   |              |
       1   [2,[3,[4]]]   5      ← only open outer brackets

depth=1: [1, 2, [3,[4]], 5]
depth=2: [1, 2, 3, [4], 5]
depth=Inf:[1, 2, 3, 4, 5]

Recursive tree for depth=2:
flat([1,[2,[3]]], 2)
 ├─ 1              → push 1
 └─ [2,[3]]        → recurse flat([2,[3]], 1)
      ├─ 2         → push 2
      └─ [3]       → recurse flat([3], 0)
           └─ [3]  → depth=0, push [3] as-is
```

---

## Problem Description

Given a multi-dimensional array `arr` and depth `n`, return a **flattened** version where nested arrays are opened up to `n` levels deep — without using `Array.prototype.flat`. Elements that aren't arrays pass through unchanged.

**Example 1:** `flat([1,[2,[3]]], 1)` → `[1,2,[3]]`
**Example 2:** `flat([1,[2,[3,[4]]]], Infinity)` → `[1,2,3,4]`

**Constraints:** `0 <= n <= 1000`, array may contain numbers, strings, or nested arrays.

---

## 📝 Interview Tips

1. **Depth=0 means no flattening**: "n=0 trả về array gốc, không mở gì cả" / When n=0, return a shallow copy — don't flatten anything
2. **Infinity edge case**: "Infinity vẫn xử lý được vì mỗi lần đệ quy trừ 1, bao giờ cũng dừng khi hết phần tử" / Infinity - 1 = Infinity, recursion stops at leaves not at depth
3. **Iterative alternative**: "Dùng stack và lưu độ sâu cùng với phần tử" / Stack stores `[element, remainingDepth]` pairs
4. **Don't mutate input**: "Tạo result array mới, không sửa arr gốc" / Always create a fresh result array
5. **Type check**: "`Array.isArray(x)` là cách chuẩn nhất để kiểm tra mảng" / Use `Array.isArray` not `instanceof Array` (works across frames)
6. **Follow-up**: "Nếu cần lazy iterator thay vì eager array?" / Yield elements one by one with generator

---

## Solutions

```typescript
type MultiDimArray = (number | MultiDimArray)[];

/**
 * Solution 1: Recursive DFS
 * Time: O(n) — visit each element once
 * Space: O(d) — call stack depth d = min(array depth, n)
 */
function flat(arr: MultiDimArray, n: number): MultiDimArray {
  const result: MultiDimArray = [];

  function dfs(current: MultiDimArray, depth: number): void {
    for (const item of current) {
      if (Array.isArray(item) && depth > 0) {
        dfs(item, depth - 1); // open one level, reduce depth
      } else {
        result.push(item); // leaf or depth exhausted
      }
    }
  }

  dfs(arr, n);
  return result;
}

/**
 * Solution 2: Iterative with Stack (avoid call stack overflow)
 * Time: O(n) — each element processed once
 * Space: O(n) — stack size proportional to elements
 */
function flatIterative(arr: MultiDimArray, n: number): MultiDimArray {
  const result: MultiDimArray = [];
  // Stack stores [element, remainingDepth]
  const stack: Array<[MultiDimArray[number], number]> = [];

  // Push in reverse so we process left-to-right
  for (let i = arr.length - 1; i >= 0; i--) {
    stack.push([arr[i], n]);
  }

  while (stack.length > 0) {
    const [item, depth] = stack.pop()!;
    if (Array.isArray(item) && depth > 0) {
      for (let i = item.length - 1; i >= 0; i--) {
        stack.push([item[i], depth - 1]);
      }
    } else {
      result.push(item);
    }
  }

  return result;
}

/**
 * Solution 3: Reduce (functional style)
 * Time: O(n) — single reduce pass
 * Space: O(n) — accumulated result
 */
function flatReduce(arr: MultiDimArray, n: number): MultiDimArray {
  if (n === 0) return arr.slice();
  return arr.reduce<MultiDimArray>((acc, item) => {
    if (Array.isArray(item) && n > 0) {
      acc.push(...flatReduce(item, n - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

// === Test Cases ===
console.log(flat([1, [2, [3]]], 1)); // [1, 2, [3]]
console.log(flat([1, [2, [3, [4]]]], 2)); // [1, 2, 3, [4]]
console.log(flat([1, [2, [3]]], Infinity)); // [1, 2, 3]
console.log(flat([1, 2, 3], 0)); // [1, 2, 3] — no change
console.log(flat([], 5)); // []
console.log(flatIterative([1, [2, [3]]], 1)); // [1, 2, [3]]
console.log(flatReduce([1, [2, [3]]], 2)); // [1, 2, 3]
```

---

## 🔗 Related Problems

- [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator) — lazy iterator version
- [JSON Deep Equal](https://leetcode.com/problems/json-deep-equal) — deep traversal pattern
- [Compact Object](https://leetcode.com/problems/compact-object) — recursive object traversal
- [Chunk Array](https://leetcode.com/problems/chunk-array) — array manipulation pattern
