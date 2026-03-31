---
layout: page
title: "Lexicographical Numbers"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Trie]
leetcode_url: "https://leetcode.com/problems/lexicographical-numbers"
---

# Lexicographical Numbers / Số Theo Thứ Tự Từ Điển

🟡 Medium | DFS on Virtual Trie | [LeetCode 386](https://leetcode.com/problems/lexicographical-numbers)

---

## 🧠 Intuition / Trực giác

**Vietnamese:** Các số 1..n theo thứ tự từ điển giống như duyệt cây 10-phân (10-ary trie) theo thứ tự trước (pre-order). Gốc là 1..9, mỗi nút x có con x*10, x*10+1, ..., x\*10+9 (nếu ≤ n). Duyệt DFS là đúng thứ tự lexicographic.

```
n=13: trie dfs order:
1 → 10 → 11 → 12 → 13 → (back) 2 → 3 → ... → 9
Result: [1,10,11,12,13,2,3,4,5,6,7,8,9]

Iterative: start=1, go deeper (*10) when ≤n,
           else go to next sibling (+1), skip trailing 0s
```

---

## 📝 Interview Tips / Gợi ý phỏng vấn

- 🔑 **EN:** Think of it as DFS pre-order traversal of a virtual 10-ary trie | **VI:** DFS tiền thứ tự trên cây 10-phân ảo
- 🔑 **EN:** From current number cur: go deeper (cur*10) if ≤ n | **VI:** Đi sâu hơn nếu cur*10 ≤ n
- 🔑 **EN:** Otherwise go to next sibling (cur+1), but skip if ends in 0 (go up) | **VI:** Sang anh em kế nếu không đi sâu được
- 🔑 **EN:** O(n) time, O(1) extra space (iterative) — O(log n) stack for recursive | **VI:** O(n) thời gian, O(1) không gian phụ khi dùng vòng lặp
- 🔑 **EN:** Never sort — that would be O(n log n) | **VI:** Không sort — sẽ mất O(n log n)
- 🔑 **EN:** Brute force: generate array 1..n, sort as strings → O(n log n) — mention but don't implement as final | **VI:** Brute force sort chuỗi → O(n log n), chỉ đề xuất ban đầu

---

## 💡 Solutions / Giải pháp

```typescript
/**
 * Iterative DFS on Virtual Trie — O(1) extra space
 * Time: O(n)  Space: O(1) extra (output array O(n))
 */
function lexicalOrder(n: number): number[] {
  const result: number[] = [];
  let cur = 1;

  while (result.length < n) {
    result.push(cur);

    if (cur * 10 <= n) {
      // Go deeper: 1 → 10 → 100 → ...
      cur *= 10;
    } else {
      // Go to next sibling, possibly going up
      if (cur >= n) cur = Math.floor(cur / 10);
      cur++;
      // Remove trailing zeros (already at correct level)
      while (cur % 10 === 0) cur = Math.floor(cur / 10);
    }
  }

  return result;
}

// Test cases
console.log(lexicalOrder(13)); // [1,10,11,12,13,2,3,4,5,6,7,8,9]
console.log(lexicalOrder(2)); // [1,2]
console.log(lexicalOrder(100).slice(0, 5)); // [1,10,100,11,12]
```

```typescript
/**
 * Recursive DFS — cleaner but O(log n) stack depth
 * Time: O(n)  Space: O(log n) call stack
 */
function lexicalOrderRecursive(n: number): number[] {
  const result: number[] = [];

  const dfs = (cur: number): void => {
    if (cur > n) return;
    result.push(cur);
    for (let d = 0; d <= 9; d++) {
      const next = cur * 10 + d;
      if (next > n) break;
      dfs(next);
    }
  };

  for (let i = 1; i <= 9; i++) dfs(i);
  return result;
}

console.log(lexicalOrderRecursive(13)); // [1,10,11,12,13,2,3,4,5,6,7,8,9]
console.log(lexicalOrderRecursive(2)); // [1,2]
```

```typescript
/**
 * Brute Force — sort as strings (simpler to explain, worse complexity)
 * Time: O(n log n)  Space: O(n)
 */
function lexicalOrderBrute(n: number): number[] {
  const arr: number[] = [];
  for (let i = 1; i <= n; i++) arr.push(i);
  arr.sort((a, b) => String(a).localeCompare(String(b)));
  return arr;
}

console.log(lexicalOrderBrute(13)); // [1,10,11,12,13,2,3,4,5,6,7,8,9]
```

---

## 🔗 Related Problems / Bài liên quan

| Problem                                                                                                        | Difficulty | Key Idea                    |
| -------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------- |
| [K-th Smallest in Lexicographic Order 440](https://leetcode.com/problems/k-th-smallest-in-lexicographic-order) | Hard       | Count subtree nodes in trie |
| [Implement Trie 208](https://leetcode.com/problems/implement-trie-prefix-tree)                                 | Medium     | Build trie structure        |
| [Search Autocomplete System 642](https://leetcode.com/problems/design-search-autocomplete-system)              | Hard       | Trie with frequency         |
| [Concatenated Words 472](https://leetcode.com/problems/concatenated-words)                                     | Hard       | DFS + trie on words         |
