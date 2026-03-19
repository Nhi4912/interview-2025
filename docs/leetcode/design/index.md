---
layout: page
title: "Design Problems"
category: Design
description: "LeetCode Design problems with TypeScript solutions"
total_problems: 9
tags: [Design, LeetCode, Interview Preparation]
---

# Design Problems

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**LeetCode Design problem collection for technical interviews**

## 🎯 Why This Category Matters / Tại Sao Quan Trọng

Design problems kiểm tra khả năng chọn đúng data structure cho một API specification. Đây là bridge giữa coding interviews và system design interviews.

**Real-world Design Problems:**
- **LRU Cache** → Browser cache, CDN cache, database query cache (Redis eviction)
- **Min Stack** → Undo/redo systems, expression evaluation
- **LFU Cache** → CDN với frequency-based eviction
- **Design Twitter** → Mini system design with data structures

**Pattern:** Mọi design problem đều có format:
1. Identify operations cần O(1) hoặc O(log n)
2. Chọn data structure cho mỗi operation
3. Combine structures (thường HashMap + Doubly LinkedList cho LRU)

**Interview tip:** Khi gặp design problem, hỏi về expected time complexity TRƯỚC KHI code.

## 📊 Overview

- **Total Problems**: 9
- **Difficulty Range**: Easy to Hard
- **Language**: TypeScript
- **Focus**: Technical interview preparation

## 📋 Problem List

- [Min Stack](problems/01-min-stack.md) - **Easy** - [LeetCode](https://leetcode.com/problems/min-stack/)\n- [Shuffle an Array](problems/02-shuffle-an-array.md) - **Easy** - [LeetCode](https://leetcode.com/problems/shuffle-an-array/)\n- [Flatten 2D Vector](problems/03-flatten-2d-vector.md) - **Easy** - [LeetCode](https://leetcode.com/problems/flatten-2d-vector/)\n- [Serialize and Deserialize Binary Tree](problems/04-serialize-and-deserialize-binary-tree.md) - **Hard** - [LeetCode](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)\n- [Insert Delete GetRandom O(1)](problems/05-insert-delete-getrandom-o1.md) - **Hard** - [LeetCode](https://leetcode.com/problems/insert-delete-getrandom-o1/)\n- [Design Tic-Tac-Toe](problems/06-design-tic-tac-toe.md) - **Hard** - [LeetCode](https://leetcode.com/problems/design-tic-tac-toe/)\n- [Design Hit Counter](problems/07-design-hit-counter.md) - **Hard** - [LeetCode](https://leetcode.com/problems/design-hit-counter/)\n- [Design Phone Directory](problems/08-design-phone-directory.md) - **Hard** - [LeetCode](https://leetcode.com/problems/design-phone-directory/)\n- [LRU Cache](problems/09-lru-cache.md) - **Easy** - [LeetCode](https://leetcode.com/problems/lru-cache/)\n

## 🎯 Key Concepts

- Data structure design
- API design
- System design fundamentals
- Time and space trade-offs
- Object-oriented design

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

**Total Problems: 9** | **Last Updated: 2025-07-13**
