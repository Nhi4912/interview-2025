# Tree Algorithms / Thuật Toán Cây
## Computer Science - Chapter 6 / Khoa Học Máy Tính - Chương 6

[Back to Table of Contents](../00-table-of-contents.md)

---

## Binary Tree

```typescript
class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class BinaryTree<T> {
  root: TreeNode<T> | null = null;

  // Inorder: Left -> Root -> Right / Trái -> Gốc -> Phải
  inorder(node: TreeNode<T> | null = this.root): T[] {
    if (!node) return [];
    return [
      ...this.inorder(node.left),
      node.value,
      ...this.inorder(node.right)
    ];
  }

  // Preorder: Root -> Left -> Right / Gốc -> Trái -> Phải
  preorder(node: TreeNode<T> | null = this.root): T[] {
    if (!node) return [];
    return [
      node.value,
      ...this.preorder(node.left),
      ...this.preorder(node.right)
    ];
  }

  // Postorder: Left -> Right -> Root / Trái -> Phải -> Gốc
  postorder(node: TreeNode<T> | null = this.root): T[] {
    if (!node) return [];
    return [
      ...this.postorder(node.left),
      ...this.postorder(node.right),
      node.value
    ];
  }

  // Level order (BFS) / Thứ tự cấp (BFS)
  levelOrder(): T[] {
    if (!this.root) return [];
    
    const result: T[] = [];
    const queue: TreeNode<T>[] = [this.root];

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return result;
  }

  height(node: TreeNode<T> | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }
}
```

## Binary Search Tree

```typescript
class BST {
  root: TreeNode<number> | null = null;

  insert(value: number): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(
    node: TreeNode<number> | null,
    value: number
  ): TreeNode<number> {
    if (!node) return new TreeNode(value);

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    }

    return node;
  }

  search(value: number): boolean {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode<number> | null, value: number): boolean {
    if (!node) return false;
    if (node.value === value) return true;
    
    if (value < node.value) {
      return this.searchNode(node.left, value);
    } else {
      return this.searchNode(node.right, value);
    }
  }

  findMin(node: TreeNode<number> | null = this.root): number | null {
    if (!node) return null;
    while (node.left) {
      node = node.left;
    }
    return node.value;
  }

  findMax(node: TreeNode<number> | null = this.root): number | null {
    if (!node) return null;
    while (node.right) {
      node = node.right;
    }
    return node.value;
  }
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
