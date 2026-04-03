---
layout: page
title: "Pyramid Transition Matrix"
difficulty: Medium
category: Tree-Graph
tags: [Bit Manipulation, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/pyramid-transition-matrix"
---

# Pyramid Transition Matrix / Ma Trận Chuyển Tiếp Kim Tự Tháp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS + Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Word Ladder](https://leetcode.com/problems/word-ladder) | [Combination Sum](https://leetcode.com/problems/combination-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Mỗi cặp `(left, right)` trong hàng hiện tại sinh ra một tập ký tự có thể đặt lên trên. DFS thử từng tổ hợp cho hàng tiếp theo. Khi hàng còn 1 ký tự → thành công.

**Analogy (EN):** Build map `(left, right) → Set of possible tops` from `allowed`. DFS row by row: for each adjacent pair in current row, look up possible top chars. When row shrinks to 1 char → return true.

```
bottom="XYZ", allowed=["XYD","YZE","DEA","FFF"]

Map: (X,Y)→{D}, (Y,Z)→{E}, (D,E)→{A}

Row 1: "XYZ"
  pairs: (X,Y)→D, (Y,Z)→E
  → next row candidates: "DE"
Row 2: "DE"
  pairs: (D,E)→A
  → next row: "A"  ← single char → TRUE
```

---

## 📝 Interview Tips

1. **Precompute map / Tính trước map**: Group allowed strings bởi (left, right) pair → Map<string, string[]> / Build lookup map upfront from allowed list
2. **DFS row-by-row / DFS từng hàng**: Không phải DFS trên cell mà là DFS trên toàn bộ hàng — backtrack khi không có options / DFS over entire next rows, not individual cells
3. **Memoization / Ghi nhớ**: Memoize visited rows (string) để tránh lặp lại / Memoize (currentRow string → boolean) if rows repeat
4. **Base case / Trường hợp cơ sở**: Row length = 1 → pyramid complete, return true / Single char = apex = success
5. **Pruning / Cắt tỉa**: Nếu bất kỳ pair nào không có option → ngay lập tức backtrack / If any pair has no valid tops, prune immediately
6. **Complexity / Độ phức tạp**: Worst case exponential nhưng với ràng buộc nhỏ (A-G, 7 ký tự) thực tế rất nhanh / Input bounded to 7 letters, so branching is limited

---

## Solutions

```typescript
/**
 * Solution 1: DFS + Backtracking with Memoization
 * Time: O(7^N) worst case, but heavily pruned in practice
 * Space: O(N²) — recursion stack + memo map
 *
 * Build (left,right)→chars map. DFS build next row char by char.
 * Memo: current row string → boolean to avoid recomputation.
 */
function pyramidTransition(bottom: string, allowed: string[]): boolean {
  // Build lookup: "AB" → set of possible tops
  const map = new Map<string, string[]>();
  for (const s of allowed) {
    const key = s[0] + s[1];
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s[2]);
  }

  const memo = new Map<string, boolean>();

  // Build next row from current row using DFS + backtracking
  function dfs(cur: string, next: string, pos: number): boolean {
    // Base case: current row is single char → pyramid complete
    if (cur.length === 1) return true;

    // Next row fully built → recurse on next row
    if (pos === cur.length - 1) {
      if (memo.has(next)) return memo.get(next)!;
      const result = dfs(next, "", 0);
      memo.set(next, result);
      return result;
    }

    const key = cur[pos] + cur[pos + 1];
    const tops = map.get(key);
    if (!tops || tops.length === 0) return false; // no valid top → prune

    for (const top of tops) {
      if (dfs(cur, next + top, pos + 1)) return true;
    }
    return false;
  }

  return dfs(bottom, "", 0);
}

/**
 * Solution 2: BFS over rows (generate all valid next rows)
 * Time: O(7^N) worst case, manageable with pruning
 * Space: O(7^N) — set of valid rows at each level
 *
 * BFS level = row level. At each level, generate all valid next rows.
 * If next-row set is empty → false. If we reach single-char rows → true.
 */
function pyramidTransitionBFS(bottom: string, allowed: string[]): boolean {
  const map = new Map<string, string[]>();
  for (const s of allowed) {
    const key = s[0] + s[1];
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s[2]);
  }

  // Generate all valid next rows from current row
  function nextRows(row: string): Set<string> {
    const result = new Set<string>();

    function build(pos: number, cur: string): void {
      if (pos === row.length - 1) {
        result.add(cur);
        return;
      }
      const tops = map.get(row[pos] + row[pos + 1]);
      if (!tops) return;
      for (const top of tops) build(pos + 1, cur + top);
    }

    build(0, "");
    return result;
  }

  let current = new Set<string>([bottom]);

  while (true) {
    // Check if any current row is single character (pyramid apex)
    for (const row of current) {
      if (row.length === 1) return true;
    }

    const nextSet = new Set<string>();
    for (const row of current) {
      for (const nr of nextRows(row)) nextSet.add(nr);
    }

    if (nextSet.size === 0) return false;
    current = nextSet;
  }
}

// === Test Cases ===
console.log(pyramidTransition("BCD", ["BCC", "CDE", "CEA", "FFF"])); // true
console.log(pyramidTransition("AAAA", ["AAB", "AAC", "BCD", "BCC", "CDD", "CDe"])); // false
console.log(pyramidTransition("XYZ", ["XYD", "YZE", "DEA", "FFF"])); // true

console.log(pyramidTransitionBFS("BCD", ["BCC", "CDE", "CEA", "FFF"])); // true
console.log(pyramidTransitionBFS("AAAA", ["AAB", "AAC", "BCD", "BCC", "CDD", "CDe"])); // false
console.log(pyramidTransitionBFS("XYZ", ["XYD", "YZE", "DEA", "FFF"])); // true
```

---

## 🔗 Related Problems

| Problem                                                          | Pattern          | Difficulty |
| ---------------------------------------------------------------- | ---------------- | ---------- |
| [Word Ladder II](https://leetcode.com/problems/word-ladder-ii)   | BFS + Backtrack  | 🔴 Hard    |
| [Combination Sum](https://leetcode.com/problems/combination-sum) | DFS Backtracking | 🟡 Medium  |
| [Course Schedule](https://leetcode.com/problems/course-schedule) | Topological Sort | 🟡 Medium  |
| [N-Queens](https://leetcode.com/problems/n-queens)               | DFS Backtracking | 🔴 Hard    |
