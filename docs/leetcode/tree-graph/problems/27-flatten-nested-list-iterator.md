---
layout: page
title: "Flatten Nested List Iterator"
difficulty: Medium
category: Tree-Graph
tags: [Stack, Tree, Depth-First Search, Design, Queue]
leetcode_url: "https://leetcode.com/problems/flatten-nested-list-iterator"
---

# Flatten Nested List Iterator / Duyệt Danh Sách Lồng Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack + DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator) | [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như mở hộp quà lồng nhau — mở từng hộp, nếu bên trong có hộp nhỏ hơn thì mở tiếp, nếu là số thì lấy ra. Dùng stack để nhớ những hộp chưa mở.

**Pattern Recognition:**

- Signal: "iterator" + "nested structure" → **Stack hoặc DFS tiền xử lý**
- Pre-flatten: đơn giản, duyệt hết ngay từ đầu, lưu mảng flat
- Lazy stack: mỗi lần gọi `next()` mới mở hộp tiếp — hiệu quả khi chỉ cần một phần

**Visual — Flatten `[[1,1],2,[1,1]]`:**

```
Stack (top → bottom): [ [1,1] | 2 | [1,1] ]

Step 1: top=[1,1] → unpack, push 1,1  → stack: [1, 1, 2, [1,1]]
Step 2: top=1     → integer → return 1  ✅
Step 3: top=1     → return 1            ✅
Step 4: top=2     → return 2            ✅
Step 5: top=[1,1] → unpack, push 1,1  → stack: [1, 1]
Step 6-7: return 1, 1                   ✅
```

---

## Problem Description

Implement an iterator to flatten a nested list. Each element is either an integer or a list whose elements may also be integers or lists. The iterator supports `next()` returning the next integer, and `hasNext()` returning true if more integers exist. ([LeetCode 341](https://leetcode.com/problems/flatten-nested-list-iterator))

**Example 1:** `nestedList = [[1,1],2,[1,1]]` → next sequence: `1,1,2,1,1`
**Example 2:** `nestedList = [1,[4,[6]]]` → next sequence: `1,4,6`

**Constraints:** `1 ≤ nestedList.length ≤ 500`, max depth 11, `-10⁶ ≤ integers ≤ 10⁶`

---

## 📝 Interview Tips

1. **Clarify**: "NestedInteger có những method nào?" / Ask which API methods NestedInteger exposes (`isInteger`, `getInteger`, `getList`)
2. **Brute force**: "Pre-flatten toàn bộ vào mảng trước — O(n) space, dễ implement" / Flatten everything upfront into a flat array
3. **Optimize**: "Lazy stack: chỉ mở hộp khi cần — tốt hơn nếu iterator dừng sớm" / Lazy evaluation saves work if stopped early
4. **Edge cases**: "Danh sách lồng rỗng `[[]]` — `hasNext()` phải trả false" / Empty nested lists must be skipped by `hasNext`
5. **Stack order**: "Push đảo ngược để phần tử đầu danh sách ở đỉnh stack" / Push in reverse so front element is on top
6. **Follow-up**: "Depth rất sâu → stack overflow với recursion, dùng stack tường minh" / Very deep nesting risks recursion stack overflow

---

## Solutions

```typescript
// NestedInteger interface (provided by LeetCode environment)
interface NestedInteger {
  isInteger(): boolean;
  getInteger(): number | null;
  getList(): NestedInteger[];
}

// Test helpers to build NestedInteger instances
function makeInt(n: number): NestedInteger {
  return { isInteger: () => true, getInteger: () => n, getList: () => [] };
}
function makeList(items: NestedInteger[]): NestedInteger {
  return { isInteger: () => false, getInteger: () => null, getList: () => items };
}

/**
 * Solution 1: Pre-flatten with DFS
 * Flatten entire structure upfront using recursion; store in array.
 * Time: O(n) constructor — visits every integer once
 * Space: O(n) — stores all n integers in flat array
 */
class NestedIteratorFlat {
  private flat: number[] = [];
  private idx = 0;

  constructor(nestedList: NestedInteger[]) {
    const dfs = (list: NestedInteger[]) => {
      for (const item of list) {
        if (item.isInteger()) this.flat.push(item.getInteger()!);
        else dfs(item.getList());
      }
    };
    dfs(nestedList);
  }

  next(): number {
    return this.flat[this.idx++];
  }
  hasNext(): boolean {
    return this.idx < this.flat.length;
  }
}

/**
 * Solution 2: Lazy Iterator with Stack (amortized O(1) per call)
 * Use a stack of remaining NestedIntegers. Before each hasNext/next,
 * pop and unpack lists until the top is an integer.
 * Time: O(1) amortized — each item pushed/popped once total
 * Space: O(d) active stack depth; O(n) worst case for wide flat list
 */
class NestedIterator {
  private stack: NestedInteger[];

  constructor(nestedList: NestedInteger[]) {
    this.stack = [...nestedList].reverse(); // front of list on top
  }

  private advance(): void {
    while (this.stack.length > 0 && !this.stack[this.stack.length - 1].isInteger()) {
      const subList = this.stack.pop()!.getList();
      for (let i = subList.length - 1; i >= 0; i--) {
        this.stack.push(subList[i]);
      }
    }
  }

  next(): number {
    this.advance();
    return this.stack.pop()!.getInteger()!;
  }

  hasNext(): boolean {
    this.advance();
    return this.stack.length > 0;
  }
}

// === Test Cases ===
// [[1,1],2,[1,1]] → [1,1,2,1,1]
const list1 = [makeList([makeInt(1), makeInt(1)]), makeInt(2), makeList([makeInt(1), makeInt(1)])];
const it1 = new NestedIterator(list1);
const out1: number[] = [];
while (it1.hasNext()) out1.push(it1.next());
console.log(out1); // [1, 1, 2, 1, 1]

// [1,[4,[6]]] → [1,4,6]
const list2 = [makeInt(1), makeList([makeInt(4), makeList([makeInt(6)])])];
const it2 = new NestedIteratorFlat(list2);
const out2: number[] = [];
while (it2.hasNext()) out2.push(it2.next());
console.log(out2); // [1, 4, 6]

// [[]] → empty
const it3 = new NestedIterator([makeList([])]);
console.log(it3.hasNext()); // false
```

---

## 🔗 Related Problems

| Problem                                                                                                | Pattern             | Difficulty |
| ------------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator)               | Stack + lazy        | 🟡 Medium  |
| [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list) | DFS reshape         | 🟡 Medium  |
| [Vector 2D](https://leetcode.com/problems/vector-2d)                                                   | 2D iterator         | 🟡 Medium  |
| [Zigzag Iterator](https://leetcode.com/problems/zigzag-iterator)                                       | Multi-list iterator | 🟡 Medium  |
