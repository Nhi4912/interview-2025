---
layout: page
title: "Maximum Sum of Subsequence With Non-adjacent Elements"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Divide and Conquer, Dynamic Programming, Segment Tree]
leetcode_url: "https://leetcode.com/problems/maximum-sum-of-subsequence-with-non-adjacent-elements"
---

# Maximum Sum of Subsequence With Non-adjacent Elements / Tổng Lớn Nhất Dãy Con Không Kề Nhau

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** Each segment tree node stores 4 states `(f00, f01, f10, f11)` where bit X = first element selected, bit Y = last element selected. Merging two nodes: the right child's first must not conflict with the left child's last (no two adjacent selected). After each point update, query root.

**VI:** Mỗi node cây đoạn lưu 4 trạng thái (f00,f01,f10,f11): X=phần tử đầu chọn hay không, Y=phần tử cuối chọn hay không. Merge hai node: cuối trái và đầu phải không được cùng chọn. Sau mỗi cập nhật, truy vấn root.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Sum of Subsequence With Non-adjacent Elements example:**

```
Node states as 2x2 matrix M[first_sel][last_sel]:
  M[0][0] = max sum, first NOT sel, last NOT sel
  M[0][1] = max sum, first NOT sel, last sel
  M[1][0] = max sum, first sel,     last NOT sel
  M[1][1] = max sum, first sel,     last sel

Merge(L, R)[a][b] = max over c,d where c+d<=1 of L[a][c] + R[d][b]
  (c = L's last, d = R's first — cannot both be 1)

Leaf node (val): M[0][0]=0, M[0][1]=M[1][0]=M[1][1]=val
```

---

---

## Problem Description

| Problem                                                                             | Difficulty | Pattern         |
| ----------------------------------------------------------------------------------- | ---------- | --------------- |
| [House Robber](https://leetcode.com/problems/house-robber/)                         | 🟡 Medium  | DP Non-adjacent |
| [Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) | 🟡 Medium  | Segment Tree    |
| [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)           | 🔴 Hard    | Segment Tree    |

---

## 📝 Interview Tips

- 🔑 **EN:** State `M[a][b]`: a=first selected, b=last selected. 4 states per node. **VI:** Trạng thái M[a][b]: a=đầu chọn, b=cuối chọn. 4 trạng thái mỗi node.
- 🔑 **EN:** Merge rule: `L[a][c] + R[d][b]` where `c + d <= 1` (no adjacent boundary). **VI:** Quy tắc merge: L[a][c] + R[d][b] khi c+d ≤ 1 (không kề nhau tại biên).
- 🔑 **EN:** Leaf: `M[0][0]=0, M[0][1]=M[1][0]=M[1][1]=val`. For val<0, not selecting is valid so f00=0. **VI:** Leaf: f00=0 (không chọn), f01=f10=f11=val (chọn phần tử đó).
- 🔑 **EN:** Root's maximum is `max(M[0][0], M[0][1], M[1][0], M[1][1])`. **VI:** Kết quả = max của 4 giá trị ở root.
- 🔑 **EN:** After each query `[pos, val]`: update `nums[pos]=val`, update leaf, propagate up. **VI:** Mỗi truy vấn: cập nhật lá, lan truyền lên gốc.
- 🔑 **EN:** Total O((n+q) log n). Use -Infinity for impossible states. **VI:** Tổng O((n+q) log n). Dùng -Infinity cho trạng thái không hợp lệ.

---

---

## Solutions

```typescript
/**
 * Segment Tree with 4-state House Robber nodes
 * Time: O((n + q) log n)  Space: O(n)
 */
function maximumSumQueries(nums: number[], queries: number[][]): number[] {
  const n = nums.length;
  const NEG = -Infinity;
  // Each node stores [f00, f01, f10, f11]
  type Node = [number, number, number, number];

  const tree: Node[] = new Array(4 * n).fill(null).map(() => [0, NEG, NEG, NEG]);

  function makeLeaf(val: number): Node {
    return [0, val, val, val];
  }

  function merge(L: Node, R: Node): Node {
    // L[a*2+c] = L.M[a][c], R[d*2+b] = R.M[d][b]
    // Result[a*2+b] = max over c,d with c+d<=1 of L[a*2+c]+R[d*2+b]
    const res: Node = [NEG, NEG, NEG, NEG];
    for (let a = 0; a < 2; a++) {
      for (let b = 0; b < 2; b++) {
        for (let c = 0; c < 2; c++) {
          for (let d = 0; d < 2; d++) {
            if (c + d <= 1) {
              const lv = L[a * 2 + c];
              const rv = R[d * 2 + b];
              if (lv !== NEG && rv !== NEG) {
                const idx = a * 2 + b;
                if (lv + rv > res[idx]) res[idx] = lv + rv;
              }
            }
          }
        }
      }
    }
    return res;
  }

  function build(node: number, l: number, r: number): void {
    if (l === r) {
      tree[node] = makeLeaf(nums[l]);
      return;
    }
    const m = (l + r) >> 1;
    build(2 * node, l, m);
    build(2 * node + 1, m + 1, r);
    tree[node] = merge(tree[2 * node], tree[2 * node + 1]);
  }

  function update(node: number, l: number, r: number, pos: number, val: number): void {
    if (l === r) {
      tree[node] = makeLeaf(val);
      return;
    }
    const m = (l + r) >> 1;
    if (pos <= m) update(2 * node, l, m, pos, val);
    else update(2 * node + 1, m + 1, r, pos, val);
    tree[node] = merge(tree[2 * node], tree[2 * node + 1]);
  }

  build(1, 0, n - 1);
  const ans: number[] = [];

  for (const [pos, val] of queries) {
    nums[pos] = val;
    update(1, 0, n - 1, pos, val);
    const root = tree[1];
    ans.push(Math.max(root[0], root[1], root[2], root[3]));
  }
  return ans;
}

// Tests
console.log(
  maximumSumQueries(
    [3, 5, 9],
    [
      [1, -2],
      [0, -3],
    ],
  ),
); // [21, 10]
console.log(maximumSumQueries([0, -1], [[0, -5]])); // [-5]
console.log(maximumSumQueries([1, 2, 3], [[0, 10]])); // [13]
```

---

## 🔗 Related Problems

| Problem                                                                             | Difficulty | Pattern         |
| ----------------------------------------------------------------------------------- | ---------- | --------------- |
| [House Robber](https://leetcode.com/problems/house-robber/)                         | 🟡 Medium  | DP Non-adjacent |
| [Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) | 🟡 Medium  | Segment Tree    |
| [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)           | 🔴 Hard    | Segment Tree    |
