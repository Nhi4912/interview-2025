# Algorithm Visualizations / Trực Quan Hóa Thuật Toán
## Visual Learning - Chapter 2 / Học Trực Quan - Chương 2

[Back to Table of Contents](../00-table-of-contents.md)

---

## Sorting Visualizations

### Bubble Sort Animation
```
Initial: [5, 2, 8, 1, 9]

Pass 1:
[2, 5, 8, 1, 9] - Compare 5,2 → Swap
[2, 5, 8, 1, 9] - Compare 5,8 → No swap
[2, 5, 1, 8, 9] - Compare 8,1 → Swap
[2, 5, 1, 8, 9] - Compare 8,9 → No swap

Pass 2:
[2, 5, 1, 8, 9]
[2, 1, 5, 8, 9] - Compare 5,1 → Swap
...

Final: [1, 2, 5, 8, 9]
```

### Quick Sort Visualization
```
[5, 2, 8, 1, 9] - Pivot: 5

Partition:
[2, 1] 5 [8, 9]

Recursively sort left and right:
[1, 2] 5 [8, 9]

Final: [1, 2, 5, 8, 9]
```

---

## Tree Traversals

```
      1
     / \
    2   3
   / \
  4   5

Inorder (Left-Root-Right): 4, 2, 5, 1, 3
Preorder (Root-Left-Right): 1, 2, 4, 5, 3
Postorder (Left-Right-Root): 4, 5, 2, 3, 1
Level Order: 1, 2, 3, 4, 5
```

---

[Back to Table of Contents](../00-table-of-contents.md)
