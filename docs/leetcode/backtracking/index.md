---
layout: page
title: "Backtracking Problems"
category: Backtracking
description: "LeetCode Backtracking problems with TypeScript solutions"
total_problems: 11
tags: [Backtracking, LeetCode, Interview Preparation]
---

# Backtracking Problems

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**LeetCode Backtracking problem collection for technical interviews**

## 🎯 Why This Category Matters / Tại Sao Quan Trọng

Backtracking = "thử và sai một cách có hệ thống". Khi brute force quá chậm nhưng không có optimal substructure cho DP, backtracking là câu trả lời.

**Template tư duy:**
```
backtrack(state):
  if isGoal(state): record solution; return
  for each choice:
    if isValid(choice):
      make choice
      backtrack(state + choice)
      undo choice  ← KEY: revert state
```

**Real-world backtracking:**
- Sudoku solver (constraint satisfaction)
- Regex matching engine
- Chess engine (game tree search)
- Network routing (find all paths)

**Interview signal:** Khi đề bài hỏi "tìm TẤT CẢ combinations/permutations/subsets" → Backtracking.

## 📊 Overview

- **Total Problems**: 11
- **Difficulty Range**: Easy to Hard
- **Language**: TypeScript
- **Focus**: Technical interview preparation

## 📋 Problem List

- [Letter Combinations of a Phone Number](problems/01-letter-combinations-of-a-phone-number.md) - **Hard** - [LeetCode](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)\n- [Subset](problems/02-subsets.md) - **Hard** - [LeetCode](https://leetcode.com/problems/subset/)\n- [Permutation](problems/03-permutations.md) - **Hard** - [LeetCode](https://leetcode.com/problems/permutation/)\n- [Generate Parenthese](problems/04-generate-parentheses.md) - **Hard** - [LeetCode](https://leetcode.com/problems/generate-parenthese/)\n- [Combination Sum](problems/05-combination-sum.md) - **Easy** - [LeetCode](https://leetcode.com/problems/combination-sum/)\n- [Word Search](problems/06-word-search.md) - **Hard** - [LeetCode](https://leetcode.com/problems/word-search/)\n- [N-Queen](problems/07-n-queens.md) - **Hard** - [LeetCode](https://leetcode.com/problems/n-queen/)\n- [Sudoku Solver](problems/08-sudoku-solver.md) - **Hard** - [LeetCode](https://leetcode.com/problems/sudoku-solver/)\n- [Word Search II](problems/09-word-search-ii.md) - **Hard** - [LeetCode](https://leetcode.com/problems/word-search-ii/)\n- [Palindrome Partitioning](problems/10-palindrome-partitioning.md) - **Easy** - [LeetCode](https://leetcode.com/problems/palindrome-partitioning/)\n- [Restore IP Addresse](problems/11-restore-ip-addresses.md) - **Easy** - [LeetCode](https://leetcode.com/problems/restore-ip-addresse/)\n

## 🎯 Key Concepts

- Recursive exploration
- Constraint satisfaction
- Pruning strategies
- State space tree
- Combinatorial problems

## 📚 Study Strategy

### Beginner Level
1. Start with Easy problems
2. Understand basic patterns
3. Focus on time complexity
4. Practice implementation

### Intermediate Level
1. Tackle Medium problems
2. Learn optimization techniques
3. Handle edge cases
4. Practice multiple approaches

### Advanced Level
1. Solve Hard problems
2. Optimize space complexity
3. Interview simulation
4. Explain solutions clearly

## 🔗 Navigation

- [Back to LeetCode Index](../index.md)
- [All Categories](../index.md)
 other_name="Tree/Graph" ;;
            "linked-list") other_name="Linked List" ;;
            "dp") other_name="Dynamic Programming" ;;
            "sorting-searching") other_name="Sorting/Searching" ;;
            *) other_name="" ;;
        esac
        echo "- [](../index.md)"
    fi
done)

---

**Total Problems: 11** | **Last Updated: 2025-07-13**
