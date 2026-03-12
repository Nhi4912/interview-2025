# Big O Complexity Cheatsheet

> Quick reference cho time/space complexity analysis.

---

## Complexity Rankings (Tốt → Xấu)

```
O(1)        Constant      Excellent   ████████████
O(log n)    Logarithmic   Good        █████████
O(n)        Linear        Fair        ██████
O(n log n)  Linearithmic  Acceptable  ████
O(n²)       Quadratic     Poor        ██
O(2^n)      Exponential   Horrible    █
O(n!)       Factorial     Worst       ▌
```

---

## Visual Growth Comparison

```
n = 16:

O(1)        = 1
O(log n)    = 4
O(n)        = 16
O(n log n)  = 64
O(n²)       = 256
O(2^n)      = 65,536
O(n!)       = 20,922,789,888,000
```

---

## Data Structure Operations

```
┌────────────────────┬──────────────┬──────────────┬──────────────┐
│ Data Structure     │ Access       │ Search       │ Insert/Delete│
├────────────────────┼──────────────┼──────────────┼──────────────┤
│ Array              │ O(1)         │ O(n)         │ O(n)         │
│ Stack              │ O(n)         │ O(n)         │ O(1)         │
│ Queue              │ O(n)         │ O(n)         │ O(1)         │
│ Linked List        │ O(n)         │ O(n)         │ O(1)         │
│ Hash Table         │ N/A          │ O(1)*        │ O(1)*        │
│ BST (balanced)     │ O(log n)     │ O(log n)     │ O(log n)     │
│ BST (unbalanced)   │ O(n)         │ O(n)         │ O(n)         │
│ Heap               │ O(1) max/min │ O(n)         │ O(log n)     │
└────────────────────┴──────────────┴──────────────┴──────────────┘
* Average case, worst case O(n) for hash collisions
```

---

## Sorting Algorithms

```
┌────────────────────┬──────────────┬──────────────┬──────────────┐
│ Algorithm          │ Best         │ Average      │ Worst        │
├────────────────────┼──────────────┼──────────────┼──────────────┤
│ Bubble Sort        │ O(n)         │ O(n²)        │ O(n²)        │
│ Selection Sort     │ O(n²)        │ O(n²)        │ O(n²)        │
│ Insertion Sort     │ O(n)         │ O(n²)        │ O(n²)        │
│ Merge Sort         │ O(n log n)   │ O(n log n)   │ O(n log n)   │
│ Quick Sort         │ O(n log n)   │ O(n log n)   │ O(n²)        │
│ Heap Sort          │ O(n log n)   │ O(n log n)   │ O(n log n)   │
│ Counting Sort      │ O(n + k)     │ O(n + k)     │ O(n + k)     │
│ Radix Sort         │ O(nk)        │ O(nk)        │ O(nk)        │
└────────────────────┴──────────────┴──────────────┴──────────────┘

Space Complexity:
• Merge Sort: O(n)
• Quick Sort: O(log n) - O(n)
• Others: O(1)
```

---

## Common Algorithm Patterns

```
┌────────────────────────────┬──────────────┬──────────────┐
│ Pattern                    │ Time         │ Space        │
├────────────────────────────┼──────────────┼──────────────┤
│ Two Pointers               │ O(n)         │ O(1)         │
│ Sliding Window             │ O(n)         │ O(1)         │
│ Binary Search              │ O(log n)     │ O(1)         │
│ BFS/DFS                    │ O(V + E)     │ O(V)         │
│ Dynamic Programming        │ O(n²) typ.   │ O(n) - O(n²) │
│ Divide & Conquer           │ O(n log n)   │ O(log n)     │
│ Backtracking               │ O(n!)        │ O(n)         │
│ Greedy                     │ O(n log n)   │ O(1) - O(n)  │
└────────────────────────────┴──────────────┴──────────────┘
```

---

## JavaScript Built-in Methods

```
┌────────────────────────────┬──────────────┐
│ Method                     │ Complexity   │
├────────────────────────────┼──────────────┤
│ Array.push/pop             │ O(1)         │
│ Array.shift/unshift        │ O(n)         │
│ Array.slice                │ O(n)         │
│ Array.splice               │ O(n)         │
│ Array.sort                 │ O(n log n)   │
│ Array.map/filter/reduce    │ O(n)         │
│ Array.indexOf/includes     │ O(n)         │
│ Array.find/findIndex       │ O(n)         │
│                            │              │
│ Object.keys/values/entries │ O(n)         │
│ Object property access     │ O(1)*        │
│                            │              │
│ Map.get/set/has/delete     │ O(1)*        │
│ Set.add/has/delete         │ O(1)*        │
│                            │              │
│ String.indexOf             │ O(n*m)       │
│ String.slice               │ O(n)         │
│ String.split               │ O(n)         │
└────────────────────────────┴──────────────┘
* Amortized, worst case O(n)
```

---

## Tips for Interviews

```
HOW TO ANALYZE:

1. IDENTIFY loops:
   • Single loop → O(n)
   • Nested loops → O(n²)
   • Loop dividing by 2 → O(log n)

2. IDENTIFY recursion:
   • Branches × levels = complexity
   • Binary recursion → O(2^n)
   • Linear recursion → O(n)

3. WATCH FOR:
   • Hidden loops in built-in methods
   • String concatenation in loops → O(n²)
   • Copying arrays/objects → O(n)

COMMON OPTIMIZATIONS:
• O(n²) → O(n log n): Use sorting
• O(n²) → O(n): Use hash map
• O(n) → O(log n): Use binary search
• O(n) space → O(1): Use pointers
```

---

## Quick Reference Table

```
If n = 1,000,000:

O(1)        → ~1 operation
O(log n)    → ~20 operations
O(n)        → ~1,000,000 operations
O(n log n)  → ~20,000,000 operations
O(n²)       → ~1,000,000,000,000 operations (TOO SLOW!)

RULE OF THUMB:
• O(n²) acceptable for n < 1,000
• O(n log n) acceptable for n < 1,000,000
• O(n) acceptable for n < 100,000,000
```

---

> **Quay lại:** [Resources](../README.md)
