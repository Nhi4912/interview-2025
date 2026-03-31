---
layout: page
title: "Path Sum IV"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/path-sum-iv"
---

# Path Sum IV / Tổng đường dẫn IV

🟡 Medium | Binary Tree | Hash Map | DFS

---

## 🧠 Intuition

**Vietnamese:** Mỗi số trong mảng mã hóa `(depth, position, value)` theo format `DPV` (2 chữ số đầu là D và P, chữ số cuối là V). Dựng cây vào HashMap với key = `depth * 10 + pos`, sau đó DFS từ gốc — cộng giá trị vào path sum khi đến lá.

**English:** Each 3-digit integer encodes `(level, pos, val)`. Decode with `level = num/100`, `pos = (num/10)%10`, `val = num%10`. Store in a map `level*10+pos → val`, then DFS summing all root-to-leaf path values.

```
nums = [113, 215, 221]
  113 → level=1, pos=1, val=3  (root)
  215 → level=2, pos=1, val=5  (root's left child)
  221 → level=2, pos=2, val=1  (root's right child)

      3
     / \
    5   1
Path sums: 3+5=8, 3+1=4 → total = 12
```

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Encode each node as `level*10 + pos`; left child of `(d,p)` is `(d+1, 2*p-1)`, right is `(d+1, 2*p)`.
- 📊 **HashMap lookup / Tra cứu HashMap:** O(1) per node — check if left/right child keys exist in the map.
- ⚡ **Leaf detection / Phát hiện lá:** A node is a leaf if neither child key exists in the map.
- 🎯 **DFS with running sum / DFS với tổng tích lũy:** Pass `pathSum + val` down; add to global total at leaves.
- 🧩 **Edge case / Trường hợp đặc biệt:** Single node array → only one path, sum = that node's value.
- 📏 **Complexity / Độ phức tạp:** O(n) time and space — each node visited once.

---

## Solutions

### Solution 1 — HashMap + DFS

```typescript
/**
 * Decode nums into a map (level*10+pos) → val.
 * DFS from root, accumulating path sum; add to total at leaves.
 *
 * Time:  O(n)
 * Space: O(n)
 */
function pathSum(nums: number[]): number {
  const map = new Map<number, number>();
  for (const num of nums) {
    const level = Math.floor(num / 100);
    const pos = Math.floor((num % 100) / 10);
    const val = num % 10;
    map.set(level * 10 + pos, val);
  }

  let total = 0;

  function dfs(level: number, pos: number, pathAcc: number): void {
    const key = level * 10 + pos;
    if (!map.has(key)) return;
    const cur = pathAcc + map.get(key)!;
    const leftKey = (level + 1) * 10 + (2 * pos - 1);
    const rightKey = (level + 1) * 10 + 2 * pos;
    if (!map.has(leftKey) && !map.has(rightKey)) {
      total += cur; // leaf
    } else {
      dfs(level + 1, 2 * pos - 1, cur);
      dfs(level + 1, 2 * pos, cur);
    }
  }

  dfs(1, 1, 0);
  return total;
}

console.log(pathSum([113, 215, 221])); // 12  (8 + 4)
console.log(pathSum([113, 221, 341, 350, 367]));
// Paths: 1→2→4=7, 1→2→5=8... depends on tree shape
console.log(pathSum([111])); // 1
```

### Solution 2 — Iterative DFS with Stack

```typescript
/**
 * Same approach, but iterative to avoid recursion limits.
 *
 * Time:  O(n)
 * Space: O(n)
 */
function pathSum2(nums: number[]): number {
  const map = new Map<number, number>();
  for (const num of nums) {
    map.set(Math.floor(num / 10), num % 10);
  }

  let total = 0;
  // stack: [level*10+pos, accumulated_sum]
  const stack: [number, number][] = [[11, 0]];

  while (stack.length) {
    const [key, acc] = stack.pop()!;
    if (!map.has(key)) continue;
    const cur = acc + map.get(key)!;
    const level = Math.floor(key / 10);
    const pos = key % 10;
    const lk = (level + 1) * 10 + (2 * pos - 1);
    const rk = (level + 1) * 10 + 2 * pos;
    if (!map.has(lk) && !map.has(rk)) {
      total += cur;
    } else {
      stack.push([lk, cur]);
      stack.push([rk, cur]);
    }
  }
  return total;
}

console.log(pathSum2([113, 215, 221])); // 12
console.log(pathSum2([111])); // 1
```

---

## 🔗 Related Problems

| #   | Problem            | Difficulty | Pattern         |
| --- | ------------------ | ---------- | --------------- |
| 112 | Path Sum           | Easy       | DFS             |
| 113 | Path Sum II        | Medium     | DFS + Backtrack |
| 666 | Path Sum IV (this) | Medium     | HashMap + DFS   |
