# Data Structures

> Các cấu trúc dữ liệu cơ bản và cách áp dụng trong frontend development.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA STRUCTURES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   LINEAR:                          NON-LINEAR:                              │
│   ┌──────────────────┐            ┌──────────────────┐                      │
│   │     Array        │            │      Tree        │                      │
│   │  [0][1][2][3]    │            │       (A)        │                      │
│   └──────────────────┘            │      / \         │                      │
│                                    │    (B) (C)       │                      │
│   ┌──────────────────┐            └──────────────────┘                      │
│   │   Linked List    │                                                      │
│   │  [A]→[B]→[C]→∅   │            ┌──────────────────┐                      │
│   └──────────────────┘            │      Graph       │                      │
│                                    │   (A)──(B)       │                      │
│   ┌──────────────────┐            │    \ / \         │                      │
│   │   Stack (LIFO)   │            │    (C)──(D)      │                      │
│   │  [C][B][A]←top   │            └──────────────────┘                      │
│   └──────────────────┘                                                      │
│                                    ┌──────────────────┐                      │
│   ┌──────────────────┐            │   Hash Table     │                      │
│   │   Queue (FIFO)   │            │  key → value     │                      │
│   │  [A][B][C]→out   │            │  "a" → 1         │                      │
│   └──────────────────┘            └──────────────────┘                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📖 Array

### Concept

```
ARRAY:
──────
• Contiguous memory locations
• O(1) access by index
• Fixed size in most languages (dynamic in JS)

┌───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │  ← indices
├───┼───┼───┼───┼───┤
│ A │ B │ C │ D │ E │  ← elements
└───┴───┴───┴───┴───┘

OPERATIONS:
• Access: O(1)
• Search: O(n)
• Insert at end: O(1) amortized
• Insert at middle: O(n)
• Delete: O(n)
```

### JavaScript Arrays

```javascript
// JavaScript arrays are dynamic
const arr = [1, 2, 3];

// Access - O(1)
arr[0];        // 1

// Push/Pop - O(1) amortized
arr.push(4);   // [1, 2, 3, 4]
arr.pop();     // [1, 2, 3]

// Shift/Unshift - O(n)
arr.unshift(0); // [0, 1, 2, 3] - shifts all elements
arr.shift();    // [1, 2, 3]

// Splice - O(n)
arr.splice(1, 0, 'new'); // Insert at index 1

// TYPED ARRAYS for performance
const buffer = new ArrayBuffer(16);
const int32View = new Int32Array(buffer);
// Fixed size, better performance for numbers
```

### When to Use

```
USE ARRAY WHEN:
✓ Need fast access by index
✓ Data is ordered/sequential
✓ Mostly reading, less modifications
✓ Cache-friendly iteration

AVOID ARRAY WHEN:
✗ Frequent insertions/deletions at middle
✗ Need key-based access
✗ Unknown size with many modifications
```

---

## 📖 Linked List

### Concept

```
LINKED LIST:
────────────
• Nodes connected by pointers
• Dynamic size
• No contiguous memory needed

SINGLY LINKED:
┌───┬───┐   ┌───┬───┐   ┌───┬───┐
│ A │ ●─┼──→│ B │ ●─┼──→│ C │ ∅ │
└───┴───┘   └───┴───┘   └───┴───┘

DOUBLY LINKED:
┌───┬───┬───┐   ┌───┬───┬───┐   ┌───┬───┬───┐
│ ∅ │ A │ ●─┼──→│ ● │ B │ ●─┼──→│ ● │ C │ ∅ │
└───┴───┴───┘←──┼───┴───┴───┘←──┼───┴───┴───┘

OPERATIONS:
• Access: O(n)
• Search: O(n)
• Insert at head: O(1)
• Insert at tail: O(1) with tail pointer
• Insert at middle: O(n) to find + O(1) to insert
```

### JavaScript Implementation

```javascript
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // O(1)
  addFirst(value) {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.size++;
  }

  // O(1)
  addLast(value) {
    const node = new ListNode(value);
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this.size++;
  }

  // O(n)
  removeByValue(value) {
    if (!this.head) return false;

    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }
    return false;
  }
}
```

### Frontend Applications

```
USE CASES IN FRONTEND:
• Undo/Redo history (doubly linked)
• Browser history navigation
• LRU Cache implementation
• DOM element siblings (conceptually)
```

---

## 📖 Stack

### Concept

```
STACK (LIFO - Last In, First Out):
──────────────────────────────────

    ┌───┐ ← top
    │ C │
    ├───┤
    │ B │
    ├───┤
    │ A │
    └───┘ ← bottom

OPERATIONS:
• push(item)  - O(1) - Add to top
• pop()       - O(1) - Remove from top
• peek()      - O(1) - View top without removing
• isEmpty()   - O(1)
```

### JavaScript Implementation

```javascript
// Using Array
class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// Usage
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
stack.pop();   // 3
stack.peek();  // 2
```

### Frontend Applications

```javascript
// 1. Call Stack (JS Engine)
function a() { b(); }
function b() { c(); }
function c() { /* stack: c, b, a, main */ }

// 2. Undo/Redo
class UndoRedo {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  execute(action) {
    action.do();
    this.undoStack.push(action);
    this.redoStack = []; // Clear redo on new action
  }

  undo() {
    const action = this.undoStack.pop();
    if (action) {
      action.undo();
      this.redoStack.push(action);
    }
  }

  redo() {
    const action = this.redoStack.pop();
    if (action) {
      action.do();
      this.undoStack.push(action);
    }
  }
}

// 3. Bracket matching
function isValidParentheses(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if ('([{'.includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) return false;
    }
  }

  return stack.length === 0;
}
```

---

## 📖 Queue

### Concept

```
QUEUE (FIFO - First In, First Out):
───────────────────────────────────

    front                    rear
      ↓                       ↓
    ┌───┬───┬───┬───┬───┐
    │ A │ B │ C │ D │ E │
    └───┴───┴───┴───┴───┘
      ↑                   ↑
   dequeue              enqueue

OPERATIONS:
• enqueue(item) - O(1) - Add to rear
• dequeue()     - O(1) - Remove from front
• peek()        - O(1) - View front
```

### JavaScript Implementation

```javascript
// Using Array (not optimal for dequeue)
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift(); // O(n) - not optimal
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Optimal: Using object with pointers
class OptimalQueue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(item) {
    this.items[this.tail] = item;
    this.tail++;
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.head];
    delete this.items[this.head];
    this.head++;
    return item;
  }

  isEmpty() {
    return this.tail === this.head;
  }

  size() {
    return this.tail - this.head;
  }
}
```

### Frontend Applications

```javascript
// 1. Task Queue / Job Queue
class TaskQueue {
  constructor(concurrency = 1) {
    this.queue = [];
    this.running = 0;
    this.concurrency = concurrency;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  async run() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;

      try {
        const result = await task();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.running--;
        this.run();
      }
    }
  }
}

// 2. BFS traversal
function bfs(root) {
  const queue = [root];
  const result = [];

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.value);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}
```

---

## 📖 Hash Table (Map/Set)

### Concept

```
HASH TABLE:
───────────
• Key-value storage
• O(1) average access, insert, delete
• Uses hash function to compute index

Hash Function:
key → hash(key) → index

┌───┬────────────┐
│ 0 │    ∅       │
├───┼────────────┤
│ 1 │ "a" → 1    │  ← hash("a") = 1
├───┼────────────┤
│ 2 │ "b" → 2    │  ← hash("b") = 2
├───┼────────────┤
│ 3 │    ∅       │
├───┼────────────┤
│ 4 │ "c" → 3    │  ← hash("c") = 4
└───┴────────────┘

COLLISION HANDLING:
• Chaining: Store list at each index
• Open addressing: Probe for next empty slot
```

### JavaScript Map & Set

```javascript
// MAP (key-value)
const map = new Map();
map.set('name', 'John');
map.set('age', 30);
map.get('name');      // 'John'
map.has('age');       // true
map.delete('age');
map.size;             // 1

// Map vs Object
// Map: any key type, maintains insertion order, size property
// Object: string/symbol keys only, prototype chain

// SET (unique values)
const set = new Set();
set.add(1);
set.add(2);
set.add(1);  // ignored, already exists
set.size;    // 2
set.has(1);  // true
set.delete(1);

// Common patterns
const unique = [...new Set(array)];  // Remove duplicates
```

### Frontend Applications

```javascript
// 1. Caching/Memoization
const cache = new Map();

function memoize(fn) {
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 2. Two Sum problem
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}

// 3. Frequency counter
function getFrequency(arr) {
  const freq = new Map();
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return freq;
}

// 4. LRU Cache
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // Move to end (most recent)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Delete oldest (first key)
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}
```

---

## 📖 Tree

### Concept

```
TREE:
─────
• Hierarchical structure
• One root, zero or more children
• No cycles

BINARY TREE:
         (A)        ← root
        /   \
      (B)   (C)     ← children
      / \     \
    (D) (E)   (F)   ← leaves

BINARY SEARCH TREE (BST):
• Left child < Parent < Right child

         (8)
        /   \
      (3)   (10)
      / \      \
    (1) (6)   (14)

OPERATIONS (BST balanced):
• Search: O(log n)
• Insert: O(log n)
• Delete: O(log n)
```

### JavaScript Implementation

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// DFS Traversals
function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.value);    // Left → Root → Right
  inorder(node.right, result);
  return result;
}

function preorder(node, result = []) {
  if (!node) return result;
  result.push(node.value);    // Root → Left → Right
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}

function postorder(node, result = []) {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.value);    // Left → Right → Root
  return result;
}

// BFS (Level order)
function levelOrder(root) {
  if (!root) return [];
  const queue = [root];
  const result = [];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}
```

### Frontend Applications

```
TREES IN FRONTEND:
──────────────────
• DOM Tree - HTML document structure
• Virtual DOM - React's tree diffing
• Component Tree - React/Vue component hierarchy
• AST - Babel, ESLint parsing
• File System - VS Code explorer
• Decision Trees - ML in browser
```

---

## 📊 Comparison Table

```
┌────────────────┬─────────┬─────────┬──────────┬──────────┐
│ Structure      │ Access  │ Search  │ Insert   │ Delete   │
├────────────────┼─────────┼─────────┼──────────┼──────────┤
│ Array          │ O(1)    │ O(n)    │ O(n)     │ O(n)     │
│ Linked List    │ O(n)    │ O(n)    │ O(1)*    │ O(1)*    │
│ Stack          │ O(n)    │ O(n)    │ O(1)     │ O(1)     │
│ Queue          │ O(n)    │ O(n)    │ O(1)     │ O(1)     │
│ Hash Table     │ N/A     │ O(1)**  │ O(1)**   │ O(1)**   │
│ BST (balanced) │ O(log n)│ O(log n)│ O(log n) │ O(log n) │
└────────────────┴─────────┴─────────┴──────────┴──────────┘
* O(1) after finding position
** Average case, O(n) worst case
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

1. **Q: Khi nào dùng Array vs Map?**

   A: Array khi cần access by index, ordered data, iteration. Map khi cần key-value lookup, any type of keys, frequent add/delete.

### 🟡 Mid-Level

2. **Q: Implement a queue using two stacks**

   A: Push to stack1. For dequeue, if stack2 empty, pop all from stack1 to stack2, then pop from stack2.

### 🔴 Senior

3. **Q: Design an LRU Cache**

   A: Use Map (ordered in JS) for O(1) access. On get/put, delete and re-add to move to end. When capacity exceeded, delete first key (oldest).

---

> **Tiếp theo:** [Algorithms](./algorithms.md) | **Quay lại:** [Foundations](./README.md)
