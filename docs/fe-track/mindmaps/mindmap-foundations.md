# Foundations Mind Map - Quick Reference

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp kiến thức Foundations cho ôn tập nhanh.

---

## 🗺️ Complete Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FOUNDATIONS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│                        ┌─────────────────┐                                   │
│                        │   FOUNDATIONS   │                                   │
│                        └────────┬────────┘                                   │
│                                 │                                            │
│         ┌──────────┬────────────┼───────────┬──────────┐                    │
│         │          │            │           │          │                    │
│    ┌────▼────┐ ┌───▼────┐ ┌────▼────┐ ┌────▼────┐ ┌───▼────┐              │
│    │   CS    │ │  DATA  │ │ ALGOS   │ │BIG O   │ │PATTERNS│              │
│    │ BASICS  │ │ STRUCT │ │         │ │        │ │        │              │
│    │         │ │        │ │         │ │        │ │        │              │
│    │Binary   │ │Array   │ │Sorting  │ │O(1)    │ │TwoPtrs │              │
│    │Memory   │ │List    │ │Search   │ │O(log n)│ │Sliding │              │
│    │Stack    │ │Stack   │ │Recursion│ │O(n)    │ │HashMap │              │
│    │Heap     │ │Queue   │ │BFS/DFS  │ │O(n²)   │ │BFS/DFS │              │
│    │Process  │ │Tree    │ │DP       │ │O(2^n)  │ │D&C     │              │
│    │Thread   │ │Hash    │ │         │ │        │ │        │              │
│    └─────────┘ └────────┘ └─────────┘ └────────┘ └────────┘              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Structures Quick Reference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA STRUCTURES                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ARRAY                          LINKED LIST                                │
│   ┌───┬───┬───┬───┐              ┌───┐   ┌───┐   ┌───┐                     │
│   │ 0 │ 1 │ 2 │ 3 │              │ A │──▶│ B │──▶│ C │                     │
│   └───┴───┴───┴───┘              └───┘   └───┘   └───┘                     │
│   Access: O(1)                   Access: O(n)                               │
│   Insert: O(n)                   Insert: O(1)*                              │
│                                                                               │
│   STACK (LIFO)                   QUEUE (FIFO)                               │
│   ┌───┐                          ┌───────────────┐                          │
│   │ C │ ← top                    │ A → B → C → D │                          │
│   │ B │                          └───────────────┘                          │
│   │ A │                          front        rear                          │
│   └───┘                                                                      │
│   push/pop: O(1)                 enqueue/dequeue: O(1)                      │
│                                                                               │
│   HASH TABLE                     TREE                                       │
│   ┌─────┬───────┐                       (A)                                 │
│   │ key │ value │                      /   \                                │
│   ├─────┼───────┤                    (B)   (C)                              │
│   │ "a" │   1   │                   / \                                     │
│   │ "b" │   2   │                 (D) (E)                                   │
│   └─────┴───────┘                                                           │
│   lookup: O(1)*                  search: O(log n)*                          │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Big O Complexity Chart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TIME COMPLEXITY                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   EXCELLENT                                                                  │
│   ┌────────────────────────────────────────────────────────────────┐        │
│   │ O(1)        │ Constant    │ Array access, hash lookup          │        │
│   └────────────────────────────────────────────────────────────────┘        │
│                                                                               │
│   GOOD                                                                       │
│   ┌────────────────────────────────────────────────────────────────┐        │
│   │ O(log n)    │ Logarithmic │ Binary search                      │        │
│   └────────────────────────────────────────────────────────────────┘        │
│                                                                               │
│   FAIR                                                                       │
│   ┌────────────────────────────────────────────────────────────────┐        │
│   │ O(n)        │ Linear      │ Single loop, array traversal       │        │
│   └────────────────────────────────────────────────────────────────┘        │
│                                                                               │
│   ACCEPTABLE                                                                 │
│   ┌────────────────────────────────────────────────────────────────┐        │
│   │ O(n log n)  │ Linearithmic│ Merge sort, quick sort             │        │
│   └────────────────────────────────────────────────────────────────┘        │
│                                                                               │
│   POOR                                                                       │
│   ┌────────────────────────────────────────────────────────────────┐        │
│   │ O(n²)       │ Quadratic   │ Nested loops, bubble sort          │        │
│   └────────────────────────────────────────────────────────────────┘        │
│                                                                               │
│   BAD                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐        │
│   │ O(2^n)      │ Exponential │ Recursive fibonacci, subsets       │        │
│   │ O(n!)       │ Factorial   │ Permutations                       │        │
│   └────────────────────────────────────────────────────────────────┘        │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Algorithm Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMMON PATTERNS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   TWO POINTERS                   SLIDING WINDOW                             │
│   ┌───────────────────┐          ┌───────────────────┐                      │
│   │ L ──────────▶ R   │          │ [===window===]──▶ │                      │
│   │ ◀────────── ◀──── │          │  start     end    │                      │
│   └───────────────────┘          └───────────────────┘                      │
│   Use: sorted array,             Use: subarray/string                       │
│   pairs, palindrome              problems, max/min window                   │
│                                                                               │
│   HASH MAP                       BINARY SEARCH                              │
│   ┌───────────────────┐          ┌───────────────────┐                      │
│   │ key → value       │          │ [L...mid...R]     │                      │
│   │ lookup in O(1)    │          │   → mid → ?       │                      │
│   └───────────────────┘          └───────────────────┘                      │
│   Use: frequency count,          Use: sorted array,                         │
│   two sum, grouping              search problems                            │
│                                                                               │
│   BFS                            DFS                                        │
│   ┌───────────────────┐          ┌───────────────────┐                      │
│   │ Level by level    │          │ Deep first        │                      │
│   │ [queue] →         │          │ [stack/recursive] │                      │
│   └───────────────────┘          └───────────────────┘                      │
│   Use: shortest path,            Use: path finding,                         │
│   level order                    tree traversal                             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Memory Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MEMORY MODEL                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   HIGH ADDRESS                                                               │
│   ┌─────────────────────────────────────────┐                               │
│   │              STACK                       │                               │
│   │  • Function calls                       │                               │
│   │  • Local variables (primitives)         │                               │
│   │  • LIFO, fixed size                     │                               │
│   │                  ↓ grows down            │                               │
│   ├─────────────────────────────────────────┤                               │
│   │           (free space)                   │                               │
│   ├─────────────────────────────────────────┤                               │
│   │                  ↑ grows up              │                               │
│   │              HEAP                        │                               │
│   │  • Objects, arrays                      │                               │
│   │  • Dynamic allocation                   │                               │
│   │  • Garbage collected                    │                               │
│   └─────────────────────────────────────────┘                               │
│   LOW ADDRESS                                                                │
│                                                                               │
│   JAVASCRIPT:                                                                │
│   ───────────                                                                │
│   Primitives → Stack (by value)                                             │
│   Objects    → Heap (by reference)                                          │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Interview Cheatsheet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       INTERVIEW CHECKLIST                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   WHEN ANALYZING COMPLEXITY:                                                │
│   □ Count loops (nested = multiply)                                         │
│   □ Identify recursion depth                                                │
│   □ Check built-in methods (indexOf is O(n)!)                               │
│   □ Consider space from data structures                                     │
│   □ Mention best/average/worst if different                                 │
│                                                                               │
│   WHEN CHOOSING DATA STRUCTURE:                                             │
│   □ Need fast lookup? → Hash Map                                            │
│   □ Need ordering? → Array or Tree                                          │
│   □ Need LIFO? → Stack                                                      │
│   □ Need FIFO? → Queue                                                      │
│   □ Need unique values? → Set                                               │
│                                                                               │
│   OPTIMIZATION STRATEGIES:                                                  │
│   □ O(n²) → O(n log n): Sort first                                          │
│   □ O(n²) → O(n): Use hash map                                              │
│   □ O(n) → O(log n): Binary search                                          │
│   □ High space? → Two pointers instead of extra array                       │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Frontend Connections

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOW FOUNDATIONS APPLY TO FRONTEND                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   DATA STRUCTURES:                                                          │
│   • Arrays    → State arrays, lists, grids                                  │
│   • Trees     → DOM, Virtual DOM, Component tree                            │
│   • Hash Maps → Object lookup, caching, memoization                         │
│   • Stacks    → Undo/redo, browser history                                  │
│   • Queues    → Task queues, event loop                                     │
│                                                                               │
│   ALGORITHMS:                                                               │
│   • Sorting   → Table sorting, data display                                 │
│   • Searching → Autocomplete, filtering                                     │
│   • BFS       → DOM traversal, level order                                  │
│   • DFS       → Deep cloning, tree operations                               │
│   • Recursion → Recursive components, nested structures                     │
│                                                                               │
│   COMPLEXITY:                                                               │
│   • O(n) loops → Avoid in render methods                                    │
│   • Memoization → useMemo, useCallback, React.memo                          │
│   • Space → Memory leaks, large state                                       │
│                                                                               │
│   MEMORY:                                                                   │
│   • Stack/Heap → Understand closures, references                            │
│   • GC → Prevent memory leaks                                               │
│   • Event Loop → Async operations, microtasks                               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Self-Assessment Checklist

```
BEFORE INTERVIEW, CAN YOU:

□ Explain difference between Stack and Heap memory?
□ Analyze time/space complexity of any code?
□ Choose appropriate data structure for a problem?
□ Implement basic sorting algorithms?
□ Write BFS and DFS traversals?
□ Explain how JavaScript garbage collection works?
□ Convert between binary, decimal, and hex?
□ Describe how the event loop works?
□ Identify common algorithm patterns in problems?
□ Optimize O(n²) solutions to O(n) using hash maps?
```

---

> **Module hoàn thành!** Quay lại [README.md](./mindmap-foundations.md) để xem tổng quan module.
