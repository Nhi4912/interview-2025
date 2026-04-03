---
layout: page
title: "Assign Cookies"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Two Pointers, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/assign-cookies"
---

# Assign Cookies / Phân Phát Bánh Quy

> **Difficulty**: 🟢 Easy | **Category**: Sorting-Searching | **Pattern**: Greedy Two Pointers

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như phân phát bánh cho trẻ em — mỗi đứa có mức tham lam khác nhau, mỗi chiếc bánh có kích thước khác nhau. Muốn làm thỏa mãn nhiều trẻ nhất, hãy dùng chiếc bánh nhỏ nhất đủ để thỏa mãn đứa ít tham nhất.

**Pattern Recognition:**

- Match smallest cookie to least greedy child → maximize satisfied count → **Greedy**
- Sort both arrays, use two pointers to greedily assign
- If cookie too small for child, try next bigger cookie (don't waste big cookies on small needs)

**Visual:**

```
g=[1,2,3], s=[1,1]
Sort: g=[1,2,3], s=[1,1]
i=0(need=1), j=0(size=1): 1>=1 → satisfy! count=1, i++, j++
i=1(need=2), j=1(size=1): 1<2 → skip, j++
j=2: out of cookies → stop
Result: 1

g=[1,2], s=[1,2,3]
i=0(1),j=0(1): match → count=1, i++,j++
i=1(2),j=1(2): match → count=2, i++,j++
Result: 2
```

## Problem Description

You are a parent giving cookies to children. Child `i` has greed factor `g[i]` (minimum cookie size to satisfy them). Cookie `j` has size `s[j]`. Each child gets at most one cookie. Maximize the number of satisfied children.

**Example:**

- g=[1,2,3], s=[1,1] → 1
- g=[1,2], s=[1,2,3] → 2

**Constraints:** 1 ≤ g.length ≤ 3×10⁴, 0 ≤ s.length ≤ 3×10⁴, 1 ≤ g[i], s[j] ≤ 2³¹-1

## 📝 Interview Tips

1. **Clarify**: Can one cookie satisfy multiple children? (No, each child gets at most one)
2. **Approach**: Sort both, use greedy: assign smallest sufficient cookie to least greedy child
3. **Edge cases**: No cookies, no children, all cookies too small, all cookies satisfy all
4. **Optimize**: This greedy is optimal — sorting is the bottleneck at O(n log n)
5. **Follow-up**: What if you can break a cookie into pieces?
6. **Complexity**: Time O(n log n + m log m), Space O(1)

## Solutions

```typescript
// Solution 1: Greedy Two Pointers — Time: O(n log n + m log m) | Space: O(1)
function findContentChildren(g: number[], s: number[]): number {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let child = 0;
  let cookie = 0;

  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      child++; // child satisfied
    }
    cookie++; // always move to next cookie
  }

  return child;
}

// Solution 2: Greedy from large end — Time: O(n log n + m log m) | Space: O(1)
function findContentChildren2(g: number[], s: number[]): number {
  g.sort((a, b) => b - a); // descending
  s.sort((a, b) => b - a); // descending

  let count = 0;
  let ci = 0; // cookie index

  for (const greed of g) {
    // Find largest available cookie that satisfies this greedy child
    while (ci < s.length && s[ci] < greed) ci++;
    if (ci < s.length) {
      count++;
      ci++;
    }
  }

  return count;
}

// Solution 3: Using binary search for each child — Time: O(n log m) | Space: O(n)
function findContentChildren3(g: number[], s: number[]): number {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let count = 0;
  const used = new Array(s.length).fill(false);

  for (const greed of g) {
    // Binary search for smallest cookie >= greed
    let lo = 0,
      hi = s.length - 1,
      found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (s[mid] >= greed && !used[mid]) {
        found = mid;
        hi = mid - 1;
      } else if (s[mid] < greed) {
        lo = mid + 1;
      } else {
        lo = mid + 1; // used
      }
    }
    if (found !== -1) {
      used[found] = true;
      count++;
    }
  }

  return count;
}

// Tests
console.log(findContentChildren([1, 2, 3], [1, 1])); // 1
console.log(findContentChildren([1, 2], [1, 2, 3])); // 2
console.log(findContentChildren([10, 9, 8, 7], [5, 6, 7, 8])); // 2
console.log(findContentChildren([1], [2])); // 1
console.log(findContentChildren([1, 2], [3])); // 1
```

## 🔗 Related Problems

| Problem                                                                                             | Relationship                         |
| --------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Candy](https://leetcode.com/problems/candy)                                                        | Greedy distribution with constraints |
| [Lemonade Change](https://leetcode.com/problems/lemonade-change)                                    | Greedy matching/assignment           |
| [Divide Players Into Teams](https://leetcode.com/problems/divide-players-into-teams-of-equal-skill) | Sort + pair matching greedily        |
