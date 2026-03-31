---
layout: page
title: "Permutations"
difficulty: Medium
category: Backtracking
tags: [Backtracking, Array]
leetcode_url: "https://leetcode.com/problems/permutations/"
---

# Permutations / Hoán Vị

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 🔥 Tier 1 — Câu hỏi kinh điển ở mọi vòng phỏng vấn kỹ thuật
> **See also**: [Subsets](./02-subsets.md) | [Permutations II](https://leetcode.com/problems/permutations-ii/) | [Next Permutation](https://leetcode.com/problems/next-permutation/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như xếp n học sinh đứng thành một hàng để chụp ảnh kỷ yếu — mỗi lần xếp theo thứ tự khác nhau là một hoán vị. n học sinh có thể xếp theo n! cách.

**Pattern Recognition:**

- Signal: "all possible orderings / arrangements" → **Backtracking không có `start` index**
- Khác Subsets: cần dùng **toàn bộ** n phần tử, quan tâm đến thứ tự
- Cần `visited` array để biết phần tử nào đã dùng trong lượt đệ quy hiện tại

**Visual — Backtracking Tree for nums = [1, 2, 3]:**

```
                    []
          /          |          \
        [1]         [2]         [3]
       /   \       /   \       /   \
   [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
     |     |     |     |     |     |
 [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
   ✓     ✓     ✓     ✓     ✓     ✓

→ 3! = 6 permutations
```

---

## Problem Description

Given an array `nums` of distinct integers, return all possible permutations in any order.

```
Example 1: nums = [1,2,3] → [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
Example 2: nums = [0,1]   → [[0,1],[1,0]]
Example 3: nums = [1]     → [[1]]
```

Constraints:

- `1 <= nums.length <= 6`, elements are distinct, `-10 <= nums[i] <= 10`

---

## 📝 Interview Tips

1. **Clarify**: "Có phần tử trùng không?" — Are there duplicates? (#46 no, #47 Permutations II yes)
2. **Brute force**: Dùng visited array, thử từng phần tử chưa dùng — try each unused element → O(n × n!)
3. **Optimize**: Swap-based approach — hoán đổi tại chỗ, tiết kiệm bộ nhớ hơn O(1) extra space
4. **Edge cases**: `n=1` → `[[nums[0]]]`; kết quả luôn có đúng `n!` phần tử
5. **Follow-up**: "Nếu có duplicate?" → Sort + `if (i > 0 && nums[i] === nums[i-1] && !visited[i-1]) continue`

---

## Solutions

```typescript

/**

- Solution 1: Backtracking with visited array (Clearest for interviews)
- Time: O(n × n!) — n! permutations, each costs O(n) to copy
- Space: O(n) — recursion stack + visited array
  */
  function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const visited = new Array(nums.length).fill(false);

function backtrack(path: number[]): void {
if (path.length === nums.length) {
result.push([...path]);
return;
}

    for (let i = 0; i < nums.length; i++) {
      if (visited[i]) continue;

      visited[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      visited[i] = false; // backtrack
    }

}

backtrack([]);
return result;
}

/**

- Solution 2: Swap-based backtracking (Space optimal)
- Time: O(n × n!) — same
- Space: O(n) — recursion stack only, no visited array, modifies nums in-place
-
- Key idea: at position `start`, swap each nums[i] (i >= start) into that slot,
- recurse on the rest, then swap back.
  */
  function permuteSwap(nums: number[]): number[][] {
  const result: number[][] = [];

function backtrack(start: number): void {
if (start === nums.length) {
result.push([...nums]);
return;
}

    for (let i = start; i < nums.length; i++) {
      [nums[start], nums[i]] = [nums[i], nums[start]]; // swap in
      backtrack(start + 1);
      [nums[start], nums[i]] = [nums[i], nums[start]]; // swap back
    }

}

backtrack(0);
return result;
}

// === Test Cases ===
console.log(JSON.stringify(permute([1, 2, 3])));
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
console.log(JSON.stringify(permute([0, 1])));
// [[0,1],[1,0]]
console.log(JSON.stringify(permuteSwap([1, 2, 3])));
// same 6 permutations (different order)

```

---

## 🔗 Related Problems

- [Subsets](./02-subsets.md) — cùng backtracking nhưng dùng `start` index, không cần visited
- [Permutations II](https://leetcode.com/problems/permutations-ii/) — bài này nhưng có phần tử trùng lặp
- [Next Permutation](https://leetcode.com/problems/next-permutation/) — tìm hoán vị kế tiếp theo thứ tự lexicographic
