# Advanced Algorithms for Frontend

## Table of Contents
- [String Algorithms](#string-algorithms)
- [Search Algorithms](#search-algorithms)
- [Sorting Algorithms](#sorting-algorithms)
- [Graph Algorithms](#graph-algorithms)
- [Dynamic Programming](#dynamic-programming)
- [Geometric Algorithms](#geometric-algorithms)
- [Scheduling Algorithms](#scheduling-algorithms)
- [Compression Algorithms](#compression-algorithms)

## String Algorithms

### String Matching

**Naive Pattern Matching**:
```javascript
function naiveSearch(text, pattern) {
  const matches = [];
  const n = text.length;
  const m = pattern.length;
  
  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) {
      j++;
    }
    if (j === m) {
      matches.push(i);
    }
  }
  
  return matches;
}
// Time: O(n * m), Space: O(1)
```

**KMP Algorithm**:
```javascript
function kmpSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const lps = computeLPS(pattern);
  const matches = [];
  
  let i = 0; // text index
  let j = 0; // pattern index
  
  while (i < n) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    
    if (j === m) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < n && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  
  return matches;
}

function computeLPS(pattern) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;
  
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  
  return lps;
}
// Time: O(n + m), Space: O(m)
```

**Rabin-Karp Algorithm**:
```javascript
function rabinKarp(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const prime = 101;
  const base = 256;
  const matches = [];
  
  let patternHash = 0;
  let textHash = 0;
  let h = 1;
  
  // Calculate h = base^(m-1) % prime
  for (let i = 0; i < m - 1; i++) {
    h = (h * base) % prime;
  }
  
  // Calculate initial hashes
  for (let i = 0; i < m; i++) {
    patternHash = (base * patternHash + pattern.charCodeAt(i)) % prime;
    textHash = (base * textHash + text.charCodeAt(i)) % prime;
  }
  
  // Slide pattern over text
  for (let i = 0; i <= n - m; i++) {
    if (patternHash === textHash) {
      // Hash match, verify character by character
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        matches.push(i);
      }
    }
    
    // Calculate hash for next window
    if (i < n - m) {
      textHash = (base * (textHash - text.charCodeAt(i) * h) + 
                  text.charCodeAt(i + m)) % prime;
      
      if (textHash < 0) {
        textHash += prime;
      }
    }
  }
  
  return matches;
}
// Average Time: O(n + m), Worst: O(n * m), Space: O(1)
```

### Longest Common Subsequence

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Reconstruct LCS
  let i = m, j = n;
  const lcs = [];
  
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs.unshift(text1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return { length: dp[m][n], sequence: lcs.join('') };
}
// Time: O(m * n), Space: O(m * n)
```

### Edit Distance (Levenshtein)

```javascript
function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  // Initialize base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // Delete
          dp[i][j - 1],     // Insert
          dp[i - 1][j - 1]  // Replace
        );
      }
    }
  }
  
  return dp[m][n];
}
// Time: O(m * n), Space: O(m * n)

// Space-optimized version
function editDistanceOptimized(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  let prev = Array(n + 1).fill(0).map((_, i) => i);
  let curr = Array(n + 1).fill(0);
  
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
      }
    }
    
    [prev, curr] = [curr, prev];
  }
  
  return prev[n];
}
// Time: O(m * n), Space: O(n)
```

### Trie (Prefix Tree)

```javascript
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.value = null;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, value = null) {
    let node = this.root;
    
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    
    node.isEndOfWord = true;
    node.value = value;
  }

  search(word) {
    let node = this.root;
    
    for (const char of word) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char);
    }
    
    return node.isEndOfWord ? node.value : null;
  }

  startsWith(prefix) {
    let node = this.root;
    
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char);
    }
    
    return true;
  }

  autocomplete(prefix, limit = 10) {
    let node = this.root;
    
    // Navigate to prefix
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char);
    }
    
    // Collect all words with this prefix
    const results = [];
    this.collectWords(node, prefix, results, limit);
    return results;
  }

  collectWords(node, prefix, results, limit) {
    if (results.length >= limit) return;
    
    if (node.isEndOfWord) {
      results.push({ word: prefix, value: node.value });
    }
    
    for (const [char, childNode] of node.children) {
      this.collectWords(childNode, prefix + char, results, limit);
    }
  }

  delete(word) {
    return this.deleteHelper(this.root, word, 0);
  }

  deleteHelper(node, word, index) {
    if (index === word.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      return node.children.size === 0;
    }
    
    const char = word[index];
    const childNode = node.children.get(char);
    
    if (!childNode) return false;
    
    const shouldDeleteChild = this.deleteHelper(childNode, word, index + 1);
    
    if (shouldDeleteChild) {
      node.children.delete(char);
      return node.children.size === 0 && !node.isEndOfWord;
    }
    
    return false;
  }
}
```

## Search Algorithms

### Binary Search Variations

**Standard Binary Search**:
```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}
// Time: O(log n), Space: O(1)
```

**Find First Occurrence**:
```javascript
function findFirst(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}
```

**Find Last Occurrence**:
```javascript
function findLast(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      left = mid + 1; // Continue searching right
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}
```

**Search in Rotated Array**:
```javascript
function searchRotated(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    }
    
    // Determine which half is sorted
    if (arr[left] <= arr[mid]) {
      // Left half is sorted
      if (target >= arr[left] && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (target > arr[mid] && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  
  return -1;
}
```

### Ternary Search

```javascript
function ternarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);
    
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    
    if (target < arr[mid1]) {
      right = mid1 - 1;
    } else if (target > arr[mid2]) {
      left = mid2 + 1;
    } else {
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }
  
  return -1;
}
// Time: O(log₃ n), Space: O(1)
```

### Exponential Search

```javascript
function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  
  // Find range for binary search
  let i = 1;
  while (i < arr.length && arr[i] <= target) {
    i *= 2;
  }
  
  // Binary search in found range
  return binarySearchRange(arr, target, i / 2, Math.min(i, arr.length - 1));
}

function binarySearchRange(arr, target, left, right) {
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}
// Time: O(log n), Space: O(1)
```

## Sorting Algorithms

### Quick Sort

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
// Average Time: O(n log n), Worst: O(n²), Space: O(log n)

// Optimized with random pivot
function quickSortRandom(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partitionRandom(arr, low, high);
    quickSortRandom(arr, low, pi - 1);
    quickSortRandom(arr, pi + 1, high);
  }
  return arr;
}

function partitionRandom(arr, low, high) {
  const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
  [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];
  return partition(arr, low, high);
}
```

### Merge Sort

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
// Time: O(n log n), Space: O(n)

// In-place merge sort
function mergeSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSortInPlace(arr, left, mid);
    mergeSortInPlace(arr, mid + 1, right);
    mergeInPlace(arr, left, mid, right);
  }
  return arr;
}

function mergeInPlace(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  
  let i = 0, j = 0, k = left;
  
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k++] = leftArr[i++];
    } else {
      arr[k++] = rightArr[j++];
    }
  }
  
  while (i < leftArr.length) arr[k++] = leftArr[i++];
  while (j < rightArr.length) arr[k++] = rightArr[j++];
}
```

### Heap Sort

```javascript
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
// Time: O(n log n), Space: O(1)
```

### Counting Sort

```javascript
function countingSort(arr) {
  if (arr.length === 0) return arr;
  
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);
  
  // Count occurrences
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }
  
  // Cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }
  
  // Build output array
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }
  
  return output;
}
// Time: O(n + k), Space: O(n + k), where k is range
```

### Radix Sort

```javascript
function radixSort(arr) {
  const max = Math.max(...arr);
  const maxDigits = Math.floor(Math.log10(max)) + 1;
  
  for (let digit = 0; digit < maxDigits; digit++) {
    arr = countingSortByDigit(arr, digit);
  }
  
  return arr;
}

function countingSortByDigit(arr, digit) {
  const output = new Array(arr.length);
  const count = new Array(10).fill(0);
  const divisor = Math.pow(10, digit);
  
  // Count occurrences
  for (let i = 0; i < arr.length; i++) {
    const digitValue = Math.floor(arr[i] / divisor) % 10;
    count[digitValue]++;
  }
  
  // Cumulative count
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  // Build output
  for (let i = arr.length - 1; i >= 0; i--) {
    const digitValue = Math.floor(arr[i] / divisor) % 10;
    output[count[digitValue] - 1] = arr[i];
    count[digitValue]--;
  }
  
  return output;
}
// Time: O(d * (n + k)), Space: O(n + k)
// where d is number of digits, k is range of digits (10)
```

## Graph Algorithms

### Depth-First Search

```javascript
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(v1, v2) {
    this.adjacencyList.get(v1).push(v2);
    this.adjacencyList.get(v2).push(v1);
  }

  dfs(start) {
    const visited = new Set();
    const result = [];
    
    const dfsHelper = (vertex) => {
      visited.add(vertex);
      result.push(vertex);
      
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    };
    
    dfsHelper(start);
    return result;
  }

  dfsIterative(start) {
    const visited = new Set();
    const result = [];
    const stack = [start];
    
    while (stack.length > 0) {
      const vertex = stack.pop();
      
      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);
        
        const neighbors = this.adjacencyList.get(vertex);
        for (let i = neighbors.length - 1; i >= 0; i--) {
          if (!visited.has(neighbors[i])) {
            stack.push(neighbors[i]);
          }
        }
      }
    }
    
    return result;
  }
}
// Time: O(V + E), Space: O(V)
```

### Breadth-First Search

```javascript
Graph.prototype.bfs = function(start) {
  const visited = new Set();
  const result = [];
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    
    const neighbors = this.adjacencyList.get(vertex);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
};

// Find shortest path
Graph.prototype.shortestPath = function(start, end) {
  const visited = new Set();
  const queue = [[start, [start]]];
  visited.add(start);
  
  while (queue.length > 0) {
    const [vertex, path] = queue.shift();
    
    if (vertex === end) {
      return path;
    }
    
    const neighbors = this.adjacencyList.get(vertex);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  
  return null;
};
// Time: O(V + E), Space: O(V)
```

### Dijkstra's Algorithm

```javascript
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}

class WeightedGraph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(v1, v2, weight) {
    this.adjacencyList.get(v1).push({ node: v2, weight });
    this.adjacencyList.get(v2).push({ node: v1, weight });
  }

  dijkstra(start, end) {
    const distances = new Map();
    const previous = new Map();
    const pq = new PriorityQueue();
    
    // Initialize
    for (const vertex of this.adjacencyList.keys()) {
      if (vertex === start) {
        distances.set(vertex, 0);
        pq.enqueue(vertex, 0);
      } else {
        distances.set(vertex, Infinity);
      }
      previous.set(vertex, null);
    }
    
    while (pq.values.length > 0) {
      const { val: current } = pq.dequeue();
      
      if (current === end) {
        // Build path
        const path = [];
        let temp = end;
        while (temp) {
          path.unshift(temp);
          temp = previous.get(temp);
        }
        return { path, distance: distances.get(end) };
      }
      
      const neighbors = this.adjacencyList.get(current);
      for (const neighbor of neighbors) {
        const distance = distances.get(current) + neighbor.weight;
        
        if (distance < distances.get(neighbor.node)) {
          distances.set(neighbor.node, distance);
          previous.set(neighbor.node, current);
          pq.enqueue(neighbor.node, distance);
        }
      }
    }
    
    return null;
  }
}
// Time: O((V + E) log V), Space: O(V)
```

I'll continue with more content by appending to this file:

<function_calls>
<invoke name="fsAppend">
<parameter name="path">docs/18-advanced-theory/03-advanced-algorithms-frontend.md

###
 Bellman-Ford Algorithm

```javascript
WeightedGraph.prototype.bellmanFord = function(start) {
  const distances = new Map();
  const previous = new Map();
  
  // Initialize
  for (const vertex of this.adjacencyList.keys()) {
    distances.set(vertex, vertex === start ? 0 : Infinity);
    previous.set(vertex, null);
  }
  
  // Relax edges V-1 times
  const vertices = Array.from(this.adjacencyList.keys());
  for (let i = 0; i < vertices.length - 1; i++) {
    for (const vertex of vertices) {
      const neighbors = this.adjacencyList.get(vertex);
      
      for (const neighbor of neighbors) {
        const distance = distances.get(vertex) + neighbor.weight;
        
        if (distance < distances.get(neighbor.node)) {
          distances.set(neighbor.node, distance);
          previous.set(neighbor.node, vertex);
        }
      }
    }
  }
  
  // Check for negative cycles
  for (const vertex of vertices) {
    const neighbors = this.adjacencyList.get(vertex);
    
    for (const neighbor of neighbors) {
      const distance = distances.get(vertex) + neighbor.weight;
      
      if (distance < distances.get(neighbor.node)) {
        throw new Error('Graph contains negative cycle');
      }
    }
  }
  
  return { distances, previous };
};
// Time: O(V * E), Space: O(V)
```

### Topological Sort

```javascript
class DirectedGraph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(from, to) {
    this.adjacencyList.get(from).push(to);
  }

  topologicalSort() {
    const visited = new Set();
    const stack = [];
    
    const dfs = (vertex) => {
      visited.add(vertex);
      
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
      
      stack.push(vertex);
    };
    
    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        dfs(vertex);
      }
    }
    
    return stack.reverse();
  }

  // Kahn's algorithm (BFS-based)
  topologicalSortKahn() {
    const inDegree = new Map();
    const queue = [];
    const result = [];
    
    // Calculate in-degrees
    for (const vertex of this.adjacencyList.keys()) {
      inDegree.set(vertex, 0);
    }
    
    for (const vertex of this.adjacencyList.keys()) {
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, inDegree.get(neighbor) + 1);
      }
    }
    
    // Add vertices with in-degree 0 to queue
    for (const [vertex, degree] of inDegree) {
      if (degree === 0) {
        queue.push(vertex);
      }
    }
    
    // Process queue
    while (queue.length > 0) {
      const vertex = queue.shift();
      result.push(vertex);
      
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    // Check for cycle
    if (result.length !== this.adjacencyList.size) {
      throw new Error('Graph contains cycle');
    }
    
    return result;
  }
}
// Time: O(V + E), Space: O(V)
```

## Dynamic Programming

### Knapsack Problem

**0/1 Knapsack**:
```javascript
function knapsack01(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  // Reconstruct solution
  const items = [];
  let w = capacity;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      items.push(i - 1);
      w -= weights[i - 1];
    }
  }
  
  return { maxValue: dp[n][capacity], items: items.reverse() };
}
// Time: O(n * W), Space: O(n * W)

// Space-optimized version
function knapsack01Optimized(weights, values, capacity) {
  const n = weights.length;
  let dp = Array(capacity + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }
  
  return dp[capacity];
}
// Time: O(n * W), Space: O(W)
```

**Unbounded Knapsack**:
```javascript
function knapsackUnbounded(weights, values, capacity) {
  const dp = Array(capacity + 1).fill(0);
  
  for (let w = 1; w <= capacity; w++) {
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= w) {
        dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
      }
    }
  }
  
  return dp[capacity];
}
// Time: O(n * W), Space: O(W)
```

### Longest Increasing Subsequence

```javascript
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  
  const dp = Array(nums.length).fill(1);
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}
// Time: O(n²), Space: O(n)

// Optimized with binary search
function lengthOfLISOptimized(nums) {
  const tails = [];
  
  for (const num of nums) {
    let left = 0;
    let right = tails.length;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }
  
  return tails.length;
}
// Time: O(n log n), Space: O(n)
```

### Matrix Chain Multiplication

```javascript
function matrixChainOrder(dimensions) {
  const n = dimensions.length - 1;
  const dp = Array(n).fill(null).map(() => Array(n).fill(0));
  const split = Array(n).fill(null).map(() => Array(n).fill(0));
  
  // l is chain length
  for (let l = 2; l <= n; l++) {
    for (let i = 0; i < n - l + 1; i++) {
      const j = i + l - 1;
      dp[i][j] = Infinity;
      
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + 
                     dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
        
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
        }
      }
    }
  }
  
  return { minCost: dp[0][n - 1], split };
}
// Time: O(n³), Space: O(n²)
```

### Coin Change

```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}
// Time: O(amount * coins), Space: O(amount)

// Count number of ways
function coinChangeWays(coins, amount) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }
  
  return dp[amount];
}
```

## Geometric Algorithms

### Convex Hull (Graham Scan)

```javascript
function convexHull(points) {
  if (points.length < 3) return points;
  
  // Find bottom-most point (or left-most if tie)
  let bottom = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].y < points[bottom].y ||
        (points[i].y === points[bottom].y && points[i].x < points[bottom].x)) {
      bottom = i;
    }
  }
  
  [points[0], points[bottom]] = [points[bottom], points[0]];
  const p0 = points[0];
  
  // Sort by polar angle
  points.slice(1).sort((a, b) => {
    const angle = orientation(p0, a, b);
    if (angle === 0) {
      return distance(p0, a) - distance(p0, b);
    }
    return angle < 0 ? -1 : 1;
  });
  
  // Build hull
  const hull = [points[0], points[1]];
  
  for (let i = 2; i < points.length; i++) {
    while (hull.length > 1 && 
           orientation(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) {
      hull.pop();
    }
    hull.push(points[i]);
  }
  
  return hull;
}

function orientation(p, q, r) {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
// Time: O(n log n), Space: O(n)
```

### Line Intersection

```javascript
function lineIntersection(p1, p2, p3, p4) {
  const x1 = p1.x, y1 = p1.y;
  const x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y;
  const x4 = p4.x, y4 = p4.y;
  
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  
  if (denom === 0) {
    return null; // Parallel or coincident
  }
  
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    };
  }
  
  return null;
}
```

### Point in Polygon

```javascript
function pointInPolygon(point, polygon) {
  let inside = false;
  const x = point.x, y = point.y;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) &&
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}
// Time: O(n), Space: O(1)
```

### Closest Pair of Points

```javascript
function closestPair(points) {
  points.sort((a, b) => a.x - b.x);
  return closestPairRec(points);
}

function closestPairRec(points) {
  const n = points.length;
  
  if (n <= 3) {
    return bruteForce(points);
  }
  
  const mid = Math.floor(n / 2);
  const midPoint = points[mid];
  
  const leftMin = closestPairRec(points.slice(0, mid));
  const rightMin = closestPairRec(points.slice(mid));
  
  const minDist = Math.min(leftMin, rightMin);
  
  // Find points in strip
  const strip = points.filter(p => Math.abs(p.x - midPoint.x) < minDist);
  
  return Math.min(minDist, stripClosest(strip, minDist));
}

function bruteForce(points) {
  let minDist = Infinity;
  
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      minDist = Math.min(minDist, distance(points[i], points[j]));
    }
  }
  
  return minDist;
}

function stripClosest(strip, d) {
  let minDist = d;
  strip.sort((a, b) => a.y - b.y);
  
  for (let i = 0; i < strip.length; i++) {
    for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < minDist; j++) {
      minDist = Math.min(minDist, distance(strip[i], strip[j]));
    }
  }
  
  return minDist;
}
// Time: O(n log n), Space: O(n)
```

## Scheduling Algorithms

### Task Scheduler

```javascript
function taskScheduler(tasks, n) {
  const freq = new Map();
  
  for (const task of tasks) {
    freq.set(task, (freq.get(task) || 0) + 1);
  }
  
  const maxFreq = Math.max(...freq.values());
  const maxCount = Array.from(freq.values()).filter(f => f === maxFreq).length;
  
  const partCount = maxFreq - 1;
  const partLength = n - (maxCount - 1);
  const emptySlots = partCount * partLength;
  const availableTasks = tasks.length - maxFreq * maxCount;
  const idles = Math.max(0, emptySlots - availableTasks);
  
  return tasks.length + idles;
}
// Time: O(n), Space: O(1)
```

### Meeting Rooms

```javascript
function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;
  
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  
  let rooms = 0;
  let endPtr = 0;
  
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[endPtr]) {
      rooms++;
    } else {
      endPtr++;
    }
  }
  
  return rooms;
}
// Time: O(n log n), Space: O(n)
```

### Job Sequencing

```javascript
function jobSequencing(jobs) {
  // Sort by profit (descending)
  jobs.sort((a, b) => b.profit - a.profit);
  
  const maxDeadline = Math.max(...jobs.map(j => j.deadline));
  const slots = Array(maxDeadline).fill(null);
  let totalProfit = 0;
  
  for (const job of jobs) {
    // Find slot for this job
    for (let i = Math.min(maxDeadline, job.deadline) - 1; i >= 0; i--) {
      if (slots[i] === null) {
        slots[i] = job;
        totalProfit += job.profit;
        break;
      }
    }
  }
  
  return {
    jobs: slots.filter(j => j !== null),
    profit: totalProfit
  };
}
// Time: O(n²), Space: O(n)
```

## Compression Algorithms

### Run-Length Encoding

```javascript
function runLengthEncode(str) {
  if (str.length === 0) return '';
  
  let encoded = '';
  let count = 1;
  
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      encoded += str[i - 1] + count;
      count = 1;
    }
  }
  
  encoded += str[str.length - 1] + count;
  return encoded.length < str.length ? encoded : str;
}

function runLengthDecode(str) {
  let decoded = '';
  
  for (let i = 0; i < str.length; i += 2) {
    const char = str[i];
    const count = parseInt(str[i + 1]);
    decoded += char.repeat(count);
  }
  
  return decoded;
}
// Time: O(n), Space: O(n)
```

### Huffman Coding

```javascript
class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

function huffmanCoding(text) {
  // Calculate frequencies
  const freq = new Map();
  for (const char of text) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  
  // Build priority queue
  const pq = Array.from(freq.entries())
    .map(([char, freq]) => new HuffmanNode(char, freq))
    .sort((a, b) => a.freq - b.freq);
  
  // Build Huffman tree
  while (pq.length > 1) {
    const left = pq.shift();
    const right = pq.shift();
    
    const parent = new HuffmanNode(
      null,
      left.freq + right.freq,
      left,
      right
    );
    
    pq.push(parent);
    pq.sort((a, b) => a.freq - b.freq);
  }
  
  const root = pq[0];
  
  // Generate codes
  const codes = new Map();
  generateCodes(root, '', codes);
  
  // Encode text
  let encoded = '';
  for (const char of text) {
    encoded += codes.get(char);
  }
  
  return { encoded, codes, tree: root };
}

function generateCodes(node, code, codes) {
  if (!node) return;
  
  if (node.char !== null) {
    codes.set(node.char, code);
    return;
  }
  
  generateCodes(node.left, code + '0', codes);
  generateCodes(node.right, code + '1', codes);
}

function huffmanDecode(encoded, tree) {
  let decoded = '';
  let current = tree;
  
  for (const bit of encoded) {
    current = bit === '0' ? current.left : current.right;
    
    if (current.char !== null) {
      decoded += current.char;
      current = tree;
    }
  }
  
  return decoded;
}
// Time: O(n log n), Space: O(n)
```

### LZW Compression

```javascript
function lzwCompress(text) {
  const dictionary = new Map();
  let dictSize = 256;
  
  // Initialize dictionary with single characters
  for (let i = 0; i < 256; i++) {
    dictionary.set(String.fromCharCode(i), i);
  }
  
  let current = '';
  const result = [];
  
  for (const char of text) {
    const combined = current + char;
    
    if (dictionary.has(combined)) {
      current = combined;
    } else {
      result.push(dictionary.get(current));
      dictionary.set(combined, dictSize++);
      current = char;
    }
  }
  
  if (current) {
    result.push(dictionary.get(current));
  }
  
  return result;
}

function lzwDecompress(compressed) {
  const dictionary = new Map();
  let dictSize = 256;
  
  // Initialize dictionary
  for (let i = 0; i < 256; i++) {
    dictionary.set(i, String.fromCharCode(i));
  }
  
  let current = String.fromCharCode(compressed[0]);
  let result = current;
  
  for (let i = 1; i < compressed.length; i++) {
    const code = compressed[i];
    let entry;
    
    if (dictionary.has(code)) {
      entry = dictionary.get(code);
    } else if (code === dictSize) {
      entry = current + current[0];
    } else {
      throw new Error('Invalid compressed data');
    }
    
    result += entry;
    dictionary.set(dictSize++, current + entry[0]);
    current = entry;
  }
  
  return result;
}
// Time: O(n), Space: O(n)
```

## Summary

Advanced algorithms are essential for solving complex problems in frontend development. Understanding string matching, graph traversal, dynamic programming, geometric computations, scheduling, and compression enables building efficient, scalable applications. These algorithms form the foundation for features like search, routing, optimization, and data processing.
