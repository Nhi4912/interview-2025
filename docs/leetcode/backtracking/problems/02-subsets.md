---
layout: page
title: "Subsets"
difficulty: Medium
category: Backtracking
tags: [Backtracking, Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/subsets/"
---

# Subsets / Tập Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 🔥 Tier 1 — Xuất hiện thường xuyên ở vòng phone screen và onsite
> **See also**: [Permutations](./03-permutations.md) | [Combination Sum](./05-combination-sum.md) | [Subsets II](https://leetcode.com/problems/subsets-ii/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn đang chọn đồ để đóng hành lý — mỗi món đồ bạn có thể mang hoặc không. Mọi cách chọn đều hợp lệ, không cần đủ n món. Kết quả là toàn bộ các cách chọn có thể có (power set).

**Pattern Recognition:**

- Signal: "all possible subsets / power set" → **Backtracking với `start` index**
- Khác tổ hợp thông thường: **mỗi node trong cây đều là đáp án** — push trước khi đệ quy
- Dùng `start` để chỉ nhìn về phía sau, tránh subset trùng lặp

**Visual — Backtracking Tree for nums = [1, 2, 3]:**

```
backtrack(start=0, path=[])       → push []
├─ pick 1 → backtrack(1, [1])     → push [1]
│   ├─ pick 2 → backtrack(2,[1,2])  → push [1,2]
│   │   └─ pick 3 → ([1,2,3])       → push [1,2,3]
│   └─ pick 3 → backtrack(3,[1,3])  → push [1,3]
├─ pick 2 → backtrack(2, [2])     → push [2]
│   └─ pick 3 → backtrack(3,[2,3])  → push [2,3]
└─ pick 3 → backtrack(3, [3])     → push [3]

Result: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]  (2^3 = 8)
```

---

## Problem Description

Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets, returned in any order.

```
Example 1: nums = [1,2,3] → [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
Example 2: nums = [0]     → [[], [0]]
```

Constraints:

- `1 <= nums.length <= 10`, elements are unique, `-10 <= nums[i] <= 10`

---

## 📝 Interview Tips

1. **Clarify**: "Phần tử có bị trùng không?" — Are elements unique? (#78 yes, #90 Subsets II no)
2. **Brute force**: Với mỗi phần tử: chọn hoặc không chọn — For each element decide include/exclude → O(2^n)
3. **Optimize**: Backtracking push ngay tại mỗi node, không cần chờ leaf — push at every node, not just leaves
4. **Edge cases**: Mảng rỗng → `[[]]`; single element → `[[], [x]]`
5. **Follow-up**: "Nếu có phần tử trùng?" → Sort + skip `nums[i] === nums[i-1]` (Subsets II #90)

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Backtracking (Recommended for interviews)
- Time: O(2^n × n) — 2^n subsets, each copy costs O(n)
- Space: O(n) — recursion stack depth at most n
  \*/
  function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

function backtrack(start: number, path: number[]): void {
result.push([...path]); // every node (not just leaf) is a valid subset

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop(); // undo choice (backtrack)
    }

}

backtrack(0, []);
return result;
}

/\*\*

- Solution 2: Iterative — cascade / BFS style
- Time: O(2^n × n) — same asymptotically
- Space: O(1) extra — no recursion stack overhead
-
- Key idea: for each new number, clone every existing subset and append it.
- start: [[]]
- add 1: [[], [1]]
- add 2: [[], [1], [2], [1,2]]
- add 3: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
  \*/
  function subsetsIterative(nums: number[]): number[][] {
  const result: number[][] = [[]];

for (const num of nums) {
const size = result.length;
for (let i = 0; i < size; i++) {
result.push([...result[i], num]);
}
}

return result;
}

// === Test Cases ===
console.log(JSON.stringify(subsets([1, 2, 3])));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
console.log(JSON.stringify(subsets([0])));
// [[], [0]]
console.log(JSON.stringify(subsetsIterative([1, 2, 3])));
// same 8 subsets (different order)

{% endraw %}

---

## 🔗 Related Problems

- [Permutations](./03-permutations.md) — cùng skeleton backtracking, nhưng không dùng `start` (mọi thứ tự)
- [Combination Sum](./05-combination-sum.md) — backtracking với ràng buộc tổng mục tiêu
- [Subsets II](https://leetcode.com/problems/subsets-ii/) — bài này nhưng có phần tử trùng lặp
