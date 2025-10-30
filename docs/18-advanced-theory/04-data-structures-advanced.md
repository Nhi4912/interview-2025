# Advanced Data Structures

## Table of Contents
- [Advanced Trees](#advanced-trees)
- [Skip Lists](#skip-lists)
- [Bloom Filters](#bloom-filters)
- [Disjoint Set Union](#disjoint-set-union)
- [Segment Trees](#segment-trees)
- [Fenwick Trees](#fenwick-trees)
- [Suffix Arrays](#suffix-arrays)
- [Persistent Data Structures](#persistent-data-structures)

## Advanced Trees

### AVL Tree

**Self-Balancing Binary Search Tree**:
```javascript
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  height(node) {
    return node ? node.height : 0;
  }

  balanceFactor(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  updateHeight(node) {
    if (node) {
      node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    }
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  insertNode(node, value) {
    if (!node) {
      return new AVLNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    } else {
      return node; // Duplicate values not allowed
    }

    this.updateHeight(node);

    const balance = this.balanceFactor(node);

    // Left Left Case
    if (balance > 1 && value < node.left.value) {
      return this.rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right.value) {
      return this.rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // Node to be deleted found
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        // Node with two children
        const minRight = this.findMin(node.right);
        node.value = minRight.value;
        node.right = this.deleteNode(node.right, minRight.value);
      }
    }

    if (!node) return null;

    this.updateHeight(node);

    const balance = this.balanceFactor(node);

    // Left Left Case
    if (balance > 1 && this.balanceFactor(node.left) >= 0) {
      return this.rotateRight(node);
    }

    // Left Right Case
    if (balance > 1 && this.balanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && this.balanceFactor(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    // Right Left Case
    if (balance < -1 && this.balanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  search(value) {
    return this.searchNode(this.root, value);
  }

  searchNode(node, value) {
    if (!node) return false;
    if (value === node.value) return true;
    if (value < node.value) return this.searchNode(node.left, value);
    return this.searchNode(node.right, value);
  }
}
// Time: O(log n) for all operations, Space: O(n)
```

### Red-Black Tree

```javascript
const Color = {
  RED: 'RED',
  BLACK: 'BLACK'
};

class RBNode {
  constructor(value, color = Color.RED) {
    this.value = value;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.nil = new RBNode(null, Color.BLACK);
    this.root = this.nil;
  }

  insert(value) {
    const node = new RBNode(value);
    node.left = this.nil;
    node.right = this.nil;

    let parent = null;
    let current = this.root;

    while (current !== this.nil) {
      parent = current;
      if (node.value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    node.parent = parent;

    if (parent === null) {
      this.root = node;
    } else if (node.value < parent.value) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    if (node.parent === null) {
      node.color = Color.BLACK;
      return;
    }

    if (node.parent.parent === null) {
      return;
    }

    this.fixInsert(node);
  }

  fixInsert(node) {
    while (node.parent.color === Color.RED) {
      if (node.parent === node.parent.parent.left) {
        const uncle = node.parent.parent.right;

        if (uncle.color === Color.RED) {
          node.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.rotateLeft(node);
          }
          node.parent.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          this.rotateRight(node.parent.parent);
        }
      } else {
        const uncle = node.parent.parent.left;

        if (uncle.color === Color.RED) {
          node.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rotateRight(node);
          }
          node.parent.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          this.rotateLeft(node.parent.parent);
        }
      }

      if (node === this.root) break;
    }

    this.root.color = Color.BLACK;
  }

  rotateLeft(node) {
    const right = node.right;
    node.right = right.left;

    if (right.left !== this.nil) {
      right.left.parent = node;
    }

    right.parent = node.parent;

    if (node.parent === null) {
      this.root = right;
    } else if (node === node.parent.left) {
      node.parent.left = right;
    } else {
      node.parent.right = right;
    }

    right.left = node;
    node.parent = right;
  }

  rotateRight(node) {
    const left = node.left;
    node.left = left.right;

    if (left.right !== this.nil) {
      left.right.parent = node;
    }

    left.parent = node.parent;

    if (node.parent === null) {
      this.root = left;
    } else if (node === node.parent.right) {
      node.parent.right = left;
    } else {
      node.parent.left = left;
    }

    left.right = node;
    node.parent = left;
  }

  search(value) {
    return this.searchNode(this.root, value);
  }

  searchNode(node, value) {
    if (node === this.nil || value === node.value) {
      return node !== this.nil;
    }

    if (value < node.value) {
      return this.searchNode(node.left, value);
    }

    return this.searchNode(node.right, value);
  }
}
// Time: O(log n) for all operations, Space: O(n)
```

### B-Tree

```javascript
class BTreeNode {
  constructor(t, leaf = true) {
    this.t = t; // Minimum degree
    this.keys = [];
    this.children = [];
    this.leaf = leaf;
  }

  search(key) {
    let i = 0;
    while (i < this.keys.length && key > this.keys[i]) {
      i++;
    }

    if (i < this.keys.length && key === this.keys[i]) {
      return this;
    }

    if (this.leaf) {
      return null;
    }

    return this.children[i].search(key);
  }

  insertNonFull(key) {
    let i = this.keys.length - 1;

    if (this.leaf) {
      this.keys.push(null);
      while (i >= 0 && key < this.keys[i]) {
        this.keys[i + 1] = this.keys[i];
        i--;
      }
      this.keys[i + 1] = key;
    } else {
      while (i >= 0 && key < this.keys[i]) {
        i--;
      }
      i++;

      if (this.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(i);
        if (key > this.keys[i]) {
          i++;
        }
      }
      this.children[i].insertNonFull(key);
    }
  }

  splitChild(i) {
    const t = this.t;
    const fullChild = this.children[i];
    const newChild = new BTreeNode(t, fullChild.leaf);

    newChild.keys = fullChild.keys.splice(t);
    this.keys.splice(i, 0, fullChild.keys.pop());

    if (!fullChild.leaf) {
      newChild.children = fullChild.children.splice(t);
    }

    this.children.splice(i + 1, 0, newChild);
  }
}

class BTree {
  constructor(t) {
    this.root = new BTreeNode(t);
    this.t = t;
  }

  search(key) {
    return this.root.search(key);
  }

  insert(key) {
    const root = this.root;

    if (root.keys.length === 2 * this.t - 1) {
      const newRoot = new BTreeNode(this.t, false);
      newRoot.children.push(this.root);
      newRoot.splitChild(0);
      this.root = newRoot;
    }

    this.root.insertNonFull(key);
  }
}
// Time: O(log n) for search and insert, Space: O(n)
```

## Skip Lists

**Probabilistic Data Structure**:
```javascript
class SkipListNode {
  constructor(value, level) {
    this.value = value;
    this.forward = new Array(level + 1).fill(null);
  }
}

class SkipList {
  constructor(maxLevel = 16, p = 0.5) {
    this.maxLevel = maxLevel;
    this.p = p;
    this.level = 0;
    this.header = new SkipListNode(-Infinity, maxLevel);
  }

  randomLevel() {
    let level = 0;
    while (Math.random() < this.p && level < this.maxLevel) {
      level++;
    }
    return level;
  }

  search(value) {
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].value < value) {
        current = current.forward[i];
      }
    }

    current = current.forward[0];
    return current && current.value === value;
  }

  insert(value) {
    const update = new Array(this.maxLevel + 1).fill(null);
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].value < value) {
        current = current.forward[i];
      }
      update[i] = current;
    }

    current = current.forward[0];

    if (!current || current.value !== value) {
      const newLevel = this.randomLevel();

      if (newLevel > this.level) {
        for (let i = this.level + 1; i <= newLevel; i++) {
          update[i] = this.header;
        }
        this.level = newLevel;
      }

      const newNode = new SkipListNode(value, newLevel);

      for (let i = 0; i <= newLevel; i++) {
        newNode.forward[i] = update[i].forward[i];
        update[i].forward[i] = newNode;
      }
    }
  }

  delete(value) {
    const update = new Array(this.maxLevel + 1).fill(null);
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].value < value) {
        current = current.forward[i];
      }
      update[i] = current;
    }

    current = current.forward[0];

    if (current && current.value === value) {
      for (let i = 0; i <= this.level; i++) {
        if (update[i].forward[i] !== current) break;
        update[i].forward[i] = current.forward[i];
      }

      while (this.level > 0 && !this.header.forward[this.level]) {
        this.level--;
      }
    }
  }

  display() {
    for (let i = this.level; i >= 0; i--) {
      let current = this.header.forward[i];
      const values = [];
      while (current) {
        values.push(current.value);
        current = current.forward[i];
      }
      console.log(`Level ${i}: ${values.join(' -> ')}`);
    }
  }
}
// Average Time: O(log n), Worst: O(n), Space: O(n log n)
```

## Bloom Filters

**Space-Efficient Probabilistic Set**:
```javascript
class BloomFilter {
  constructor(size, numHashes) {
    this.size = size;
    this.numHashes = numHashes;
    this.bits = new Array(size).fill(false);
  }

  hash(value, seed) {
    let hash = 0;
    const str = value.toString() + seed;

    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash) % this.size;
  }

  add(value) {
    for (let i = 0; i < this.numHashes; i++) {
      const index = this.hash(value, i);
      this.bits[index] = true;
    }
  }

  contains(value) {
    for (let i = 0; i < this.numHashes; i++) {
      const index = this.hash(value, i);
      if (!this.bits[index]) {
        return false; // Definitely not in set
      }
    }
    return true; // Probably in set
  }

  // Calculate optimal size and number of hashes
  static optimal(expectedElements, falsePositiveRate) {
    const size = Math.ceil(
      -(expectedElements * Math.log(falsePositiveRate)) / (Math.log(2) ** 2)
    );
    const numHashes = Math.ceil((size / expectedElements) * Math.log(2));

    return new BloomFilter(size, numHashes);
  }

  getFalsePositiveRate(numElements) {
    return Math.pow(
      1 - Math.exp(-this.numHashes * numElements / this.size),
      this.numHashes
    );
  }
}
// Time: O(k) where k is number of hashes, Space: O(m) where m is size
```

## Disjoint Set Union

**Union-Find Data Structure**:
```javascript
class DisjointSet {
  constructor(size) {
    this.parent = Array(size).fill(0).map((_, i) => i);
    this.rank = Array(size).fill(0);
    this.size = Array(size).fill(1);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }

    return true;
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }

  getSize(x) {
    return this.size[this.find(x)];
  }

  getComponents() {
    const components = new Map();

    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      if (!components.has(root)) {
        components.set(root, []);
      }
      components.get(root).push(i);
    }

    return Array.from(components.values());
  }
}
// Time: O(α(n)) amortized, where α is inverse Ackermann function
// Practically O(1), Space: O(n)
```

## Segment Trees

**Range Query Data Structure**:
```javascript
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n);
    this.build(arr, 0, 0, this.n - 1);
  }

  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    this.build(arr, leftChild, start, mid);
    this.build(arr, rightChild, mid + 1, end);

    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  query(left, right) {
    return this.queryHelper(0, 0, this.n - 1, left, right);
  }

  queryHelper(node, start, end, left, right) {
    if (right < start || left > end) {
      return 0; // Out of range
    }

    if (left <= start && end <= right) {
      return this.tree[node]; // Completely in range
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    const leftSum = this.queryHelper(leftChild, start, mid, left, right);
    const rightSum = this.queryHelper(rightChild, mid + 1, end, left, right);

    return leftSum + rightSum;
  }

  update(index, value) {
    this.updateHelper(0, 0, this.n - 1, index, value);
  }

  updateHelper(node, start, end, index, value) {
    if (start === end) {
      this.tree[node] = value;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    if (index <= mid) {
      this.updateHelper(leftChild, start, mid, index, value);
    } else {
      this.updateHelper(rightChild, mid + 1, end, index, value);
    }

    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  // Range update with lazy propagation
  rangeUpdate(left, right, value) {
    this.lazy = this.lazy || new Array(4 * this.n).fill(0);
    this.rangeUpdateHelper(0, 0, this.n - 1, left, right, value);
  }

  rangeUpdateHelper(node, start, end, left, right, value) {
    if (this.lazy[node] !== 0) {
      this.tree[node] += (end - start + 1) * this.lazy[node];

      if (start !== end) {
        this.lazy[2 * node + 1] += this.lazy[node];
        this.lazy[2 * node + 2] += this.lazy[node];
      }

      this.lazy[node] = 0;
    }

    if (start > end || start > right || end < left) {
      return;
    }

    if (start >= left && end <= right) {
      this.tree[node] += (end - start + 1) * value;

      if (start !== end) {
        this.lazy[2 * node + 1] += value;
        this.lazy[2 * node + 2] += value;
      }

      return;
    }

    const mid = Math.floor((start + end) / 2);
    this.rangeUpdateHelper(2 * node + 1, start, mid, left, right, value);
    this.rangeUpdateHelper(2 * node + 2, mid + 1, end, left, right, value);

    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }
}
// Time: O(log n) for query and update, O(n) for build, Space: O(n)
```

I'll continue with more content:

<function_calls>
<invoke name="fsAppend">
<parameter name="path">docs/18-advanced-theory/04-data-structures-advanced.md

## F
enwick Trees

**Binary Indexed Tree**:
```javascript
class FenwickTree {
  constructor(size) {
    this.size = size;
    this.tree = new Array(size + 1).fill(0);
  }

  // Update value at index
  update(index, delta) {
    index++; // 1-indexed
    while (index <= this.size) {
      this.tree[index] += delta;
      index += index & (-index); // Add last set bit
    }
  }

  // Query prefix sum [0, index]
  query(index) {
    index++; // 1-indexed
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & (-index); // Remove last set bit
    }
    return sum;
  }

  // Query range sum [left, right]
  rangeQuery(left, right) {
    return this.query(right) - (left > 0 ? this.query(left - 1) : 0);
  }

  // Build from array
  static fromArray(arr) {
    const tree = new FenwickTree(arr.length);
    for (let i = 0; i < arr.length; i++) {
      tree.update(i, arr[i]);
    }
    return tree;
  }

  // Find index with given prefix sum
  findIndex(sum) {
    let index = 0;
    let bitMask = 1;

    // Find highest power of 2 <= size
    while (bitMask <= this.size) {
      bitMask <<= 1;
    }
    bitMask >>= 1;

    while (bitMask > 0) {
      const nextIndex = index + bitMask;
      if (nextIndex <= this.size && this.tree[nextIndex] < sum) {
        index = nextIndex;
        sum -= this.tree[nextIndex];
      }
      bitMask >>= 1;
    }

    return index;
  }
}
// Time: O(log n) for update and query, Space: O(n)

// 2D Fenwick Tree
class FenwickTree2D {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.tree = Array(rows + 1).fill(null)
      .map(() => Array(cols + 1).fill(0));
  }

  update(row, col, delta) {
    row++; col++;
    for (let i = row; i <= this.rows; i += i & (-i)) {
      for (let j = col; j <= this.cols; j += j & (-j)) {
        this.tree[i][j] += delta;
      }
    }
  }

  query(row, col) {
    row++; col++;
    let sum = 0;
    for (let i = row; i > 0; i -= i & (-i)) {
      for (let j = col; j > 0; j -= j & (-j)) {
        sum += this.tree[i][j];
      }
    }
    return sum;
  }

  rangeQuery(row1, col1, row2, col2) {
    return this.query(row2, col2) 
         - (row1 > 0 ? this.query(row1 - 1, col2) : 0)
         - (col1 > 0 ? this.query(row2, col1 - 1) : 0)
         + (row1 > 0 && col1 > 0 ? this.query(row1 - 1, col1 - 1) : 0);
  }
}
```

## Suffix Arrays

**String Processing Data Structure**:
```javascript
class SuffixArray {
  constructor(text) {
    this.text = text;
    this.n = text.length;
    this.suffixArray = this.buildSuffixArray();
    this.lcp = this.buildLCP();
  }

  buildSuffixArray() {
    const suffixes = [];
    
    for (let i = 0; i < this.n; i++) {
      suffixes.push({ index: i, suffix: this.text.substring(i) });
    }
    
    suffixes.sort((a, b) => a.suffix.localeCompare(b.suffix));
    
    return suffixes.map(s => s.index);
  }

  // Build LCP (Longest Common Prefix) array
  buildLCP() {
    const lcp = new Array(this.n).fill(0);
    const rank = new Array(this.n);
    
    for (let i = 0; i < this.n; i++) {
      rank[this.suffixArray[i]] = i;
    }
    
    let h = 0;
    for (let i = 0; i < this.n; i++) {
      if (rank[i] > 0) {
        const j = this.suffixArray[rank[i] - 1];
        
        while (i + h < this.n && j + h < this.n && 
               this.text[i + h] === this.text[j + h]) {
          h++;
        }
        
        lcp[rank[i]] = h;
        
        if (h > 0) h--;
      }
    }
    
    return lcp;
  }

  // Search pattern in text
  search(pattern) {
    let left = 0;
    let right = this.n - 1;
    const m = pattern.length;
    
    // Find leftmost occurrence
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const suffix = this.text.substring(this.suffixArray[mid], 
                                         this.suffixArray[mid] + m);
      
      if (suffix < pattern) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    if (this.text.substring(this.suffixArray[left], 
                            this.suffixArray[left] + m) !== pattern) {
      return [];
    }
    
    const start = left;
    right = this.n - 1;
    
    // Find rightmost occurrence
    while (left < right) {
      const mid = Math.ceil((left + right) / 2);
      const suffix = this.text.substring(this.suffixArray[mid], 
                                         this.suffixArray[mid] + m);
      
      if (suffix > pattern) {
        right = mid - 1;
      } else {
        left = mid;
      }
    }
    
    const end = right;
    
    return this.suffixArray.slice(start, end + 1);
  }

  // Find longest repeated substring
  longestRepeatedSubstring() {
    let maxLen = 0;
    let index = -1;
    
    for (let i = 1; i < this.n; i++) {
      if (this.lcp[i] > maxLen) {
        maxLen = this.lcp[i];
        index = this.suffixArray[i];
      }
    }
    
    return index >= 0 ? this.text.substring(index, index + maxLen) : '';
  }

  // Count distinct substrings
  countDistinctSubstrings() {
    let count = this.n * (this.n + 1) / 2; // Total substrings
    
    for (let i = 0; i < this.n; i++) {
      count -= this.lcp[i]; // Subtract repeated substrings
    }
    
    return count;
  }
}
// Time: O(n log n) for construction, O(m log n) for search
// Space: O(n)
```

## Persistent Data Structures

### Persistent Stack

```javascript
class PersistentStack {
  constructor(value = null, next = null) {
    this.value = value;
    this.next = next;
    this.size = next ? next.size + 1 : (value !== null ? 1 : 0);
  }

  push(value) {
    return new PersistentStack(value, this);
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }
    return this.next;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }
    return this.value;
  }

  isEmpty() {
    return this.size === 0;
  }

  toArray() {
    const result = [];
    let current = this;
    
    while (!current.isEmpty()) {
      result.push(current.value);
      current = current.next;
    }
    
    return result;
  }
}
// Time: O(1) for all operations, Space: O(n) total across all versions
```

### Persistent Array

```javascript
class PersistentArray {
  constructor(size = 0, defaultValue = null) {
    this.size = size;
    this.root = this.buildTree(size, defaultValue);
    this.bits = 5; // Branching factor = 2^5 = 32
    this.width = 1 << this.bits;
  }

  buildTree(size, value) {
    if (size === 0) return null;
    
    const node = {
      children: new Array(this.width).fill(null),
      value: null
    };
    
    if (size <= this.width) {
      for (let i = 0; i < size; i++) {
        node.children[i] = { value, children: null };
      }
    } else {
      const childSize = Math.ceil(size / this.width);
      for (let i = 0; i < this.width && i * childSize < size; i++) {
        node.children[i] = this.buildTree(
          Math.min(childSize, size - i * childSize),
          value
        );
      }
    }
    
    return node;
  }

  get(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('Index out of bounds');
    }
    
    return this.getHelper(this.root, index, this.getDepth());
  }

  getHelper(node, index, depth) {
    if (depth === 0) {
      return node.value;
    }
    
    const childIndex = (index >> (depth * this.bits)) & (this.width - 1);
    return this.getHelper(node.children[childIndex], index, depth - 1);
  }

  set(index, value) {
    if (index < 0 || index >= this.size) {
      throw new Error('Index out of bounds');
    }
    
    const newArray = new PersistentArray(this.size);
    newArray.root = this.setHelper(this.root, index, value, this.getDepth());
    return newArray;
  }

  setHelper(node, index, value, depth) {
    if (depth === 0) {
      return { value, children: null };
    }
    
    const newNode = {
      children: [...node.children],
      value: node.value
    };
    
    const childIndex = (index >> (depth * this.bits)) & (this.width - 1);
    newNode.children[childIndex] = this.setHelper(
      node.children[childIndex],
      index,
      value,
      depth - 1
    );
    
    return newNode;
  }

  getDepth() {
    let depth = 0;
    let size = this.size;
    
    while (size > this.width) {
      size = Math.ceil(size / this.width);
      depth++;
    }
    
    return depth;
  }

  push(value) {
    const newArray = new PersistentArray(this.size + 1);
    newArray.root = this.pushHelper(this.root, value, this.size, this.getDepth());
    return newArray;
  }

  pushHelper(node, value, index, depth) {
    if (depth === 0) {
      return { value, children: null };
    }
    
    const childIndex = (index >> (depth * this.bits)) & (this.width - 1);
    const newNode = {
      children: node ? [...node.children] : new Array(this.width).fill(null),
      value: node ? node.value : null
    };
    
    newNode.children[childIndex] = this.pushHelper(
      node?.children[childIndex],
      value,
      index,
      depth - 1
    );
    
    return newNode;
  }
}
// Time: O(log n) for get and set, Space: O(log n) per operation
```

### Persistent Binary Search Tree

```javascript
class PersistentBSTNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class PersistentBST {
  constructor(root = null) {
    this.root = root;
  }

  insert(value) {
    return new PersistentBST(this.insertHelper(this.root, value));
  }

  insertHelper(node, value) {
    if (!node) {
      return new PersistentBSTNode(value);
    }
    
    if (value < node.value) {
      return new PersistentBSTNode(
        node.value,
        this.insertHelper(node.left, value),
        node.right
      );
    } else if (value > node.value) {
      return new PersistentBSTNode(
        node.value,
        node.left,
        this.insertHelper(node.right, value)
      );
    }
    
    return node;
  }

  delete(value) {
    return new PersistentBST(this.deleteHelper(this.root, value));
  }

  deleteHelper(node, value) {
    if (!node) return null;
    
    if (value < node.value) {
      return new PersistentBSTNode(
        node.value,
        this.deleteHelper(node.left, value),
        node.right
      );
    } else if (value > node.value) {
      return new PersistentBSTNode(
        node.value,
        node.left,
        this.deleteHelper(node.right, value)
      );
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      
      const minRight = this.findMin(node.right);
      return new PersistentBSTNode(
        minRight.value,
        node.left,
        this.deleteHelper(node.right, minRight.value)
      );
    }
  }

  search(value) {
    return this.searchHelper(this.root, value);
  }

  searchHelper(node, value) {
    if (!node) return false;
    if (value === node.value) return true;
    if (value < node.value) return this.searchHelper(node.left, value);
    return this.searchHelper(node.right, value);
  }

  findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  inorder() {
    const result = [];
    this.inorderHelper(this.root, result);
    return result;
  }

  inorderHelper(node, result) {
    if (!node) return;
    this.inorderHelper(node.left, result);
    result.push(node.value);
    this.inorderHelper(node.right, result);
  }
}
// Time: O(log n) for operations, Space: O(log n) per operation
```

### Persistent Hash Map

```javascript
class PersistentHashMap {
  constructor(bits = 5) {
    this.bits = bits;
    this.width = 1 << bits;
    this.root = null;
    this.size = 0;
  }

  hash(key) {
    let hash = 0;
    const str = String(key);
    
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    
    return hash >>> 0;
  }

  get(key) {
    if (!this.root) return undefined;
    
    const hash = this.hash(key);
    return this.getHelper(this.root, key, hash, 0);
  }

  getHelper(node, key, hash, shift) {
    if (!node) return undefined;
    
    if (node.type === 'leaf') {
      return node.key === key ? node.value : undefined;
    }
    
    const index = (hash >>> shift) & (this.width - 1);
    return this.getHelper(node.children[index], key, hash, shift + this.bits);
  }

  set(key, value) {
    const newMap = new PersistentHashMap(this.bits);
    const hash = this.hash(key);
    newMap.root = this.setHelper(this.root, key, value, hash, 0);
    newMap.size = this.size + (this.get(key) === undefined ? 1 : 0);
    return newMap;
  }

  setHelper(node, key, value, hash, shift) {
    if (!node) {
      return { type: 'leaf', key, value };
    }
    
    if (node.type === 'leaf') {
      if (node.key === key) {
        return { type: 'leaf', key, value };
      }
      
      // Create branch node
      const newNode = {
        type: 'branch',
        children: new Array(this.width).fill(null)
      };
      
      const existingIndex = (this.hash(node.key) >>> shift) & (this.width - 1);
      const newIndex = (hash >>> shift) & (this.width - 1);
      
      if (existingIndex === newIndex) {
        newNode.children[existingIndex] = this.setHelper(
          node,
          key,
          value,
          hash,
          shift + this.bits
        );
      } else {
        newNode.children[existingIndex] = node;
        newNode.children[newIndex] = { type: 'leaf', key, value };
      }
      
      return newNode;
    }
    
    const index = (hash >>> shift) & (this.width - 1);
    const newNode = {
      type: 'branch',
      children: [...node.children]
    };
    
    newNode.children[index] = this.setHelper(
      node.children[index],
      key,
      value,
      hash,
      shift + this.bits
    );
    
    return newNode;
  }

  delete(key) {
    const newMap = new PersistentHashMap(this.bits);
    const hash = this.hash(key);
    newMap.root = this.deleteHelper(this.root, key, hash, 0);
    newMap.size = this.size - (this.get(key) !== undefined ? 1 : 0);
    return newMap;
  }

  deleteHelper(node, key, hash, shift) {
    if (!node) return null;
    
    if (node.type === 'leaf') {
      return node.key === key ? null : node;
    }
    
    const index = (hash >>> shift) & (this.width - 1);
    const newNode = {
      type: 'branch',
      children: [...node.children]
    };
    
    newNode.children[index] = this.deleteHelper(
      node.children[index],
      key,
      hash,
      shift + this.bits
    );
    
    // Check if we can collapse to leaf
    const nonNull = newNode.children.filter(c => c !== null);
    if (nonNull.length === 1 && nonNull[0].type === 'leaf') {
      return nonNull[0];
    }
    
    return newNode;
  }

  entries() {
    const result = [];
    this.entriesHelper(this.root, result);
    return result;
  }

  entriesHelper(node, result) {
    if (!node) return;
    
    if (node.type === 'leaf') {
      result.push([node.key, node.value]);
      return;
    }
    
    for (const child of node.children) {
      this.entriesHelper(child, result);
    }
  }
}
// Time: O(log n) for operations, Space: O(log n) per operation
```

## Advanced Applications

### LRU Cache with Persistent History

```javascript
class HistoricalLRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.versions = [new Map()];
    this.order = [[]];
  }

  get(key, version = this.versions.length - 1) {
    const cache = this.versions[version];
    
    if (!cache.has(key)) {
      return -1;
    }
    
    // For current version, update order
    if (version === this.versions.length - 1) {
      const currentOrder = this.order[version];
      const index = currentOrder.indexOf(key);
      if (index > -1) {
        currentOrder.splice(index, 1);
        currentOrder.push(key);
      }
    }
    
    return cache.get(key);
  }

  put(key, value) {
    const currentCache = new Map(this.versions[this.versions.length - 1]);
    const currentOrder = [...this.order[this.order.length - 1]];
    
    if (currentCache.has(key)) {
      const index = currentOrder.indexOf(key);
      currentOrder.splice(index, 1);
    } else if (currentCache.size >= this.capacity) {
      const lru = currentOrder.shift();
      currentCache.delete(lru);
    }
    
    currentCache.set(key, value);
    currentOrder.push(key);
    
    this.versions.push(currentCache);
    this.order.push(currentOrder);
  }

  getVersion(version) {
    return {
      cache: this.versions[version],
      order: this.order[version]
    };
  }

  rollback(version) {
    if (version < 0 || version >= this.versions.length) {
      throw new Error('Invalid version');
    }
    
    this.versions = this.versions.slice(0, version + 1);
    this.order = this.order.slice(0, version + 1);
  }
}
```

## Summary

Advanced data structures provide efficient solutions for complex problems:
- **AVL/Red-Black Trees**: Self-balancing BSTs for guaranteed O(log n) operations
- **Skip Lists**: Probabilistic alternative to balanced trees
- **Bloom Filters**: Space-efficient probabilistic membership testing
- **Disjoint Sets**: Efficient union-find operations
- **Segment/Fenwick Trees**: Fast range queries and updates
- **Suffix Arrays**: Efficient string processing
- **Persistent Structures**: Immutable data structures with version history

These structures are fundamental for building high-performance applications requiring efficient data access, modification, and querying capabilities.
