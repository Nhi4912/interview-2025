---
layout: page
title: "Brick Wall"
difficulty: Medium
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/brick-wall"
---

# Brick Wall / Tường Gạch

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) | [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cắt tường gạch bằng dao thẳng đứng — muốn cắt ít gạch nhất thì cần cắt qua nhiều khe hở nhất. Đếm tần số của các vị trí khe hở (prefix sum của mỗi hàng).

```
wall = [[1,2,2,1],[3,1,2],[1,3,2]]
Row 0 edges: 1, 3, 5   (không tính biên phải = 6)
Row 1 edges: 3, 4
Row 2 edges: 1, 4

edgeCount: {1:2, 3:2, 5:1, 4:2}
Max edge count = 2 (at positions 1, 3, or 4)
Answer = total_rows - max_edges = 3 - 2 = 1 brick crossed
```

---

## Problem Description

Given a rectangular brick wall represented as `wall[i]` (list of brick widths in row `i`), draw a vertical line from top to bottom cutting through **fewest bricks** (cutting through an edge counts as 0). Return the minimum number of bricks the line must cross.

- Example 1: `wall=[[1,2,2,1],[3,1,2],[1,3,2]]` → `2`
- Example 2: `wall=[[1],[1],[1]]` → `3`

Constraints: `1 <= wall.length <= 10^4`, `1 <= wall[i].length <= 3*10^4`, total bricks ≤ `2*10^4`

---

## 📝 Interview Tips

1. **Reframe / Đổi góc nhìn**: "Thay vì đếm gạch bị cắt, tìm đường đi qua nhiều khe nhất" / Flip the problem: maximize edges crossed, then subtract from row count.
2. **Key insight / Chìa khóa**: "Vị trí khe = prefix sum của độ rộng gạch (không tính cạnh phải)" / Edge positions are cumulative widths, excluding the rightmost edge.
3. **Data structure / Cấu trúc dữ liệu**: "HashMap đếm tần số vị trí khe — O(1) per insertion" / Count edge position frequency with a Map.
4. **Edge case / Trường hợp đặc biệt**: "Gạch nguyên hàng (không có khe trong) → cắt hết mọi hàng" / A wall with all single bricks per row: answer = wall.length.
5. **Complexity / Độ phức tạp**: "O(n) total bricks — mỗi viên gạch duyệt đúng một lần" / Total iterations = total number of bricks across all rows.
6. **Communicate / Giao tiếp**: "Tôi bỏ qua edge cuối cùng vì cắt ở biên không tính là cắt gạch" / Explain why rightmost edge is excluded from counting.

---

## Solutions

```typescript
/**
 * Solution 1: Hash Map edge-position counting
 * Time: O(n) — n = total number of bricks
 * Space: O(w) — w = wall width (unique edge positions)
 */
function leastBricks(wall: number[][]): number {
  const edgeCount = new Map<number, number>();
  let maxEdges = 0;

  for (const row of wall) {
    let pos = 0;
    // Sum up brick widths — skip the last one (wall edge)
    for (let i = 0; i < row.length - 1; i++) {
      pos += row[i];
      const count = (edgeCount.get(pos) ?? 0) + 1;
      edgeCount.set(pos, count);
      maxEdges = Math.max(maxEdges, count);
    }
  }

  return wall.length - maxEdges;
}

/**
 * Solution 2: Using reduce for prefix sum (functional style)
 * Time: O(n) — same complexity
 * Space: O(w) — same space
 */
function leastBricksAlt(wall: number[][]): number {
  const freq = new Map<number, number>();

  for (const row of wall) {
    row.slice(0, -1).reduce((prefix, width) => {
      const pos = prefix + width;
      freq.set(pos, (freq.get(pos) ?? 0) + 1);
      return pos;
    }, 0);
  }

  const maxEdges = freq.size > 0 ? Math.max(...freq.values()) : 0;
  return wall.length - maxEdges;
}

// === Test Cases ===
console.log(
  leastBricks([
    [1, 2, 2, 1],
    [3, 1, 2],
    [1, 3, 2],
  ]),
); // 2
console.log(leastBricks([[1], [1], [1]])); // 3
console.log(
  leastBricksAlt([
    [1, 2, 2, 1],
    [3, 1, 2],
    [1, 3, 2],
  ]),
); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                    | Pattern              | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                                                                               | Prefix sum + HashMap | 🟡 Medium  |
| [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence)                                                                 | HashSet frequency    | 🟡 Medium  |
| [Maximum Frequency of an Element After Performing Operations](https://leetcode.com/problems/maximum-frequency-of-an-element-after-performing-operations-i) | Frequency counting   | 🟡 Medium  |
| [Most Common Word](https://leetcode.com/problems/most-common-word)                                                                                         | Frequency map        | 🟢 Easy    |
