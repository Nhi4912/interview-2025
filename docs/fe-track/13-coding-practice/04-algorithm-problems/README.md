# Algorithm Problems for Frontend

> Các bài toán thuật toán thường gặp trong phỏng vấn frontend. Focus vào patterns thay vì memorize solutions.

---

## 📋 Problem Categories

| Category | Count | Difficulty | Frequency |
|----------|-------|------------|-----------|
| [Array Problems](./array-problems.md) | 15+ | 🟢-🔴 | Very High |
| [String Problems](./string-problems.md) | 10+ | 🟢-🟡 | High |
| [Tree Problems](./tree-problems.md) | 8+ | 🟡-🔴 | Medium |
| [Common Patterns](./common-patterns.md) | - | All | Reference |

---

## 🎯 Key Patterns for Frontend

### 1. Two Pointers

```javascript
// Example: Two Sum (sorted array)
function twoSum(nums, target) {
  let left = 0, right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}

// Example: Remove duplicates in place
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let writePointer = 0;

  for (let readPointer = 1; readPointer < nums.length; readPointer++) {
    if (nums[readPointer] !== nums[writePointer]) {
      writePointer++;
      nums[writePointer] = nums[readPointer];
    }
  }

  return writePointer + 1;
}
```

### 2. Sliding Window

```javascript
// Example: Max sum subarray of size k
function maxSumSubarray(arr, k) {
  if (arr.length < k) return null;

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Example: Longest substring without repeating chars
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let maxLen = 0;
  let start = 0;

  for (let end = 0; end < s.length; end++) {
    const char = s[end];

    if (seen.has(char) && seen.get(char) >= start) {
      start = seen.get(char) + 1;
    }

    seen.set(char, end);
    maxLen = Math.max(maxLen, end - start + 1);
  }

  return maxLen;
}
```

### 3. Hash Map / Set

```javascript
// Example: Two Sum (unsorted)
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

// Example: Group anagrams
function groupAnagrams(strs) {
  const map = new Map();

  for (const str of strs) {
    const sorted = str.split('').sort().join('');
    if (!map.has(sorted)) {
      map.set(sorted, []);
    }
    map.get(sorted).push(str);
  }

  return Array.from(map.values());
}
```

### 4. BFS / DFS

```javascript
// BFS: Level order traversal
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}

// DFS: Inorder traversal
function inorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }

  dfs(root);
  return result;
}
```

### 5. Dynamic Programming

```javascript
// Example: Climbing stairs
function climbStairs(n) {
  if (n <= 2) return n;

  let prev2 = 1, prev1 = 2;

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Example: Coin change
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
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
```

---

## 📊 Pattern Recognition Guide

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHEN TO USE EACH PATTERN                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   TWO POINTERS:                                                 │
│   • Sorted array                                                │
│   • Find pair with sum                                          │
│   • Remove/rearrange in place                                   │
│   • Palindrome check                                            │
│                                                                   │
│   SLIDING WINDOW:                                               │
│   • Subarray/substring problems                                 │
│   • Max/min of fixed or variable size window                    │
│   • Contains/anagram problems                                   │
│                                                                   │
│   HASH MAP:                                                     │
│   • Count frequencies                                           │
│   • Find complement/pair                                        │
│   • Group by property                                           │
│   • O(1) lookup needed                                          │
│                                                                   │
│   BFS:                                                          │
│   • Level by level traversal                                    │
│   • Shortest path (unweighted)                                  │
│   • Find connected components                                   │
│                                                                   │
│   DFS:                                                          │
│   • Path finding                                                │
│   • Tree traversals                                             │
│   • Backtracking problems                                       │
│                                                                   │
│   DYNAMIC PROGRAMMING:                                          │
│   • Overlapping subproblems                                     │
│   • Optimal substructure                                        │
│   • Count ways / min-max problems                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Frontend-Specific Algorithms

```javascript
// 1. Debounce (common interview question)
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 2. Deep comparison
function isEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false;
  }

  return true;
}

// 3. Flatten nested object
function flatten(obj, prefix = '', result = {}) {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flatten(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

// 4. JSON stringify (simplified)
function stringify(value) {
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') return `"${value}"`;
  if (Array.isArray(value)) return `[${value.map(stringify).join(',')}]`;
  if (typeof value === 'object') {
    const pairs = Object.entries(value)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => `"${k}":${stringify(v)}`);
    return `{${pairs.join(',')}}`;
  }
  return undefined;
}
```

---

## 📈 Complexity Cheatsheet

```
┌──────────────────┬────────────────┬────────────────┐
│ Pattern          │ Time           │ Space          │
├──────────────────┼────────────────┼────────────────┤
│ Two Pointers     │ O(n)           │ O(1)           │
│ Sliding Window   │ O(n)           │ O(1) or O(k)   │
│ Hash Map         │ O(n)           │ O(n)           │
│ BFS              │ O(V + E)       │ O(V)           │
│ DFS              │ O(V + E)       │ O(h) - height  │
│ Binary Search    │ O(log n)       │ O(1)           │
│ Sorting          │ O(n log n)     │ O(n) or O(1)   │
│ DP               │ O(n²) typical  │ O(n) or O(n²)  │
└──────────────────┴────────────────┴────────────────┘
```

---

## 🗓️ Practice Schedule

```
WEEK 1: Easy problems (2-3 per day)
• Array basics, string manipulation
• Build confidence with patterns

WEEK 2: Medium problems (1-2 per day)
• Two pointers, sliding window
• Focus on explaining approach

WEEK 3: Mixed difficulty
• Review weak areas
• Practice under time pressure

WEEK 4: Mock interviews
• Simulate real conditions
• Practice communication
```

---

> **Quay lại:** [Coding Practice](../README.md)
