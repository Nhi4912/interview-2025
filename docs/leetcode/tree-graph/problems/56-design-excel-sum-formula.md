---
layout: page
title: "Design Excel Sum Formula"
difficulty: Hard
category: Tree-Graph
tags: [Array, Hash Table, String, Graph, Design]
leetcode_url: "https://leetcode.com/problems/design-excel-sum-formula"
---

# Design Excel Sum Formula / Thiết Kế Công Thức Tổng Excel

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) | [Design Spreadsheet](https://leetcode.com/problems/design-spreadsheet)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống Excel thật — ô A1 có thể phụ thuộc B1, B1 phụ thuộc C1. Khi C1 thay đổi, A1 và B1 cần cập nhật theo thứ tự dependency. DFS đệ quy ngược qua dependency graph để tính giá trị đúng tại thời điểm `get`.

**Pattern Recognition:**

- Signal: "cell formula depends on other cells" + "recalculate on change" → **DFS on dependency graph**
- Each cell stores: literal value OR formula (list of source cell keys)
- Key insight: `get()` triggers DFS through all formula dependencies recursively; no caching needed

**Visual — Dependency chain:**

```
set(1,'C', 0)                 → C1 = 0 (literal)
sum(1,'B', ["C1"])            → B1 = formula[C1]
sum(1,'A', ["B1"])            → A1 = formula[B1]

Dependency graph: A1 → B1 → C1(=0)

get(A1): dfs(A1) → dfs(B1) → dfs(C1) = 0
                          ↑ B1 = 0
               ↑ A1 = 0

set(C1, 5):
get(A1): dfs(A1) → dfs(B1) → dfs(C1) = 5
                          ↑ B1 = 5
               ↑ A1 = 5
```

---

## Problem Description

Design the `Excel` class for a spreadsheet with rows `1..H` and columns `'A'..'W'`. Implement `set(row, col, val)` to set a literal value, `get(row, col)` to return current value, and `sum(row, col, numbers)` to set a cell to the sum of specified cells/ranges (e.g. `"A1"`, `"A1:C3"`) and return that value. A `set` on a formula cell clears the formula.

- Example: `set(1,'A',1); set(1,'B',2); sum(3,'C',["A1","B1"]) → 3`
- Example: After `set(1,'A',10)`, `get(1,'A') → 10`

Constraints: `1 <= H <= 26`, columns `'A'–'Z'`, values `0–200`, no circular dependencies.

---

## 📝 Interview Tips

1. **Clarify**: "Range 'A1:C3' gồm ô nào? Có cycle dependency không?" / Confirm range parsing; problem guarantees no cycles
2. **Design**: "Mỗi cell lưu: giá trị số HOẶC danh sách cells nguồn" / Cell stores literal int OR formula (array of source keys)
3. **Key**: "set() xóa formula; sum() ghi formula mới rồi tính ngay bằng DFS" / set clears formula, sum stores and evaluates
4. **Recalc**: "get() dùng DFS đệ quy — không cache (tránh stale data)" / Recursive DFS on every get; safe without cycles
5. **Range parsing**: "Tách col (A-Z) và row (int) từ cell string, expand range start:end" / Parse col char + row number; nested loop for ranges
6. **Follow-up**: "Millions of cells? Dùng lazy eval + change propagation (observer pattern)" / Scale needs dirty-flag and push-based recalculation

---

## Solutions

```typescript
/**
 * Excel spreadsheet with DFS formula recalculation
 * set: O(1) | get: O(D) where D = total dependency cells | sum: O(R) R = range size
 * Space: O(H * 26) — grid + formula map
 */
class Excel {
  private values: number[][];
  private formulas: Map<string, string[]>; // cellKey → expanded list of source keys

  constructor(height: number, width: string) {
    const cols = width.charCodeAt(0) - "A".charCodeAt(0) + 1;
    this.values = Array.from({ length: height + 1 }, () => new Array(cols + 1).fill(0));
    this.formulas = new Map();
  }

  private key(row: number, col: string): string {
    return `${col}${row}`;
  }

  private expand(range: string): string[] {
    if (!range.includes(":")) return [range];
    const [a, b] = range.split(":");
    const c1 = a.charCodeAt(0),
      r1 = parseInt(a.slice(1));
    const c2 = b.charCodeAt(0),
      r2 = parseInt(b.slice(1));
    const cells: string[] = [];
    for (let c = c1; c <= c2; c++) {
      for (let r = r1; r <= r2; r++) {
        cells.push(`${String.fromCharCode(c)}${r}`);
      }
    }
    return cells;
  }

  private dfs(cellKey: string): number {
    if (!this.formulas.has(cellKey)) {
      const col = cellKey.charCodeAt(0) - "A".charCodeAt(0);
      const row = parseInt(cellKey.slice(1));
      return this.values[row][col];
    }
    let total = 0;
    for (const src of this.formulas.get(cellKey)!) {
      total += this.dfs(src);
    }
    return total;
  }

  set(row: number, column: string, val: number): void {
    const k = this.key(row, column);
    this.formulas.delete(k);
    const col = column.charCodeAt(0) - "A".charCodeAt(0);
    this.values[row][col] = val;
  }

  get(row: number, column: string): number {
    return this.dfs(this.key(row, column));
  }

  sum(row: number, column: string, numbers: string[]): number {
    const k = this.key(row, column);
    const sources: string[] = [];
    for (const n of numbers) sources.push(...this.expand(n));
    this.formulas.set(k, sources);
    const col = column.charCodeAt(0) - "A".charCodeAt(0);
    this.values[row][col] = 0;
    return this.dfs(k);
  }
}

// === Test Cases ===
const e1 = new Excel(3, "C");
e1.set(1, "A", 2);
e1.set(2, "B", 2);
console.log(e1.sum(3, "C", ["A1", "A1:B2"])); // A1 + (A1+A2+B1+B2) = 2+(2+0+0+2) = 6
console.log(e1.get(3, "C")); // 6 (formula still active)

const e2 = new Excel(3, "C");
e2.set(1, "C", 10);
console.log(e2.sum(2, "C", ["A1:C1"])); // 0+0+10 = 10
e2.set(1, "A", 5);
console.log(e2.get(2, "C")); // 15 (formula recalculates: 5+0+10)

const e3 = new Excel(3, "C");
e3.set(1, "A", 3);
console.log(e3.get(1, "A")); // 3
```

---

## 🔗 Related Problems

- [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) — topological sort on dependency DAG
- [Design Spreadsheet](https://leetcode.com/problems/design-spreadsheet) — simpler variant without formula chains
- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — DFS memoization on dependency chains
- [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) — topological sort for longest path
