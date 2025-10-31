# JavaScript Coding Challenges
## Interview Practice - Chapter 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: React Challenges →](./02-react-coding-challenges.md)

---

## Overview

This chapter contains 50+ JavaScript coding challenges commonly asked in Big Tech interviews, organized by difficulty and topic.

---

## Table of Contents

1. [Array Challenges](#array-challenges)
2. [String Challenges](#string-challenges)
3. [Object Challenges](#object-challenges)
4. [Algorithm Challenges](#algorithm-challenges)
5. [Async Challenges](#async-challenges)
6. [DOM Challenges](#dom-challenges)

---

## Array Challenges

### Easy: Remove Duplicates

**Problem:** Remove duplicates from an array.

```javascript
// Solution 1: Using Set
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

// Solution 2: Using filter
function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

// Solution 3: Using reduce
function removeDuplicates(arr) {
  return arr.reduce((acc, item) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);
}

// Test
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
```

**Time Complexity:** O(n)
**Space Complexity:** O(n)

---

### Easy: Find Maximum

**Problem:** Find the maximum number in an array.

```javascript
// Solution 1: Using Math.max
function findMax(arr) {
  return Math.max(...arr);
}

// Solution 2: Using reduce
function findMax(arr) {
  return arr.reduce((max, num) => num > max ? num : max, arr[0]);
}

// Solution 3: Using loop
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Test
console.log(findMax([1, 5, 3, 9, 2])); // 9
```

---

### Medium: Flatten Array

**Problem:** Flatten a nested array.

```javascript
// Solution 1: Using flat()
function flatten(arr) {
  return arr.flat(Infinity);
}

// Solution 2: Recursive
function flatten(arr) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return acc.concat(flatten(item));
    }
    return acc.concat(item);
  }, []);
}

// Solution 3: Using stack
function flatten(arr) {
  const stack = [...arr];
  const result = [];
  
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.unshift(item);
    }
  }
  
  return result;
}

// Test
console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
```

---

### Medium: Chunk Array

**Problem:** Split array into chunks of specified size.

```javascript
function chunk(arr, size) {
  const result = [];
  
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  
  return result;
}

// Alternative: Using reduce
function chunk(arr, size) {
  return arr.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / size);
    
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    
    acc[chunkIndex].push(item);
    return acc;
  }, []);
}

// Test
console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3)); // [[1, 2, 3], [4, 5, 6], [7]]
```

---

### Hard: Two Sum

**Problem:** Find two numbers that add up to target.

```javascript
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

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
```

**Time Complexity:** O(n)
**Space Complexity:** O(n)

---

## String Challenges

### Easy: Reverse String

**Problem:** Reverse a string.

```javascript
// Solution 1: Using built-in methods
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Solution 2: Using loop
function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Solution 3: Using reduce
function reverseString(str) {
  return str.split('').reduce((acc, char) => char + acc, '');
}

// Test
console.log(reverseString('hello')); // 'olleh'
```

---

### Easy: Palindrome

**Problem:** Check if string is a palindrome.

```javascript
function isPalindrome(str) {
  // Remove non-alphanumeric and convert to lowercase
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}

// Alternative: Two pointers
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}

// Test
console.log(isPalindrome('A man, a plan, a canal: Panama')); // true
console.log(isPalindrome('race a car')); // false
```

---

### Medium: Anagram

**Problem:** Check if two strings are anagrams.

```javascript
function isAnagram(str1, str2) {
  // Remove spaces and convert to lowercase
  const clean1 = str1.toLowerCase().replace(/\s/g, '');
  const clean2 = str2.toLowerCase().replace(/\s/g, '');
  
  if (clean1.length !== clean2.length) {
    return false;
  }
  
  // Sort and compare
  return clean1.split('').sort().join('') === 
         clean2.split('').sort().join('');
}

// Alternative: Using character count
function isAnagram(str1, str2) {
  const clean1 = str1.toLowerCase().replace(/\s/g, '');
  const clean2 = str2.toLowerCase().replace(/\s/g, '');
  
  if (clean1.length !== clean2.length) {
    return false;
  }
  
  const charCount = {};
  
  for (const char of clean1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  for (const char of clean2) {
    if (!charCount[char]) {
      return false;
    }
    charCount[char]--;
  }
  
  return true;
}

// Test
console.log(isAnagram('listen', 'silent')); // true
console.log(isAnagram('hello', 'world')); // false
```

---

### Medium: Longest Substring Without Repeating

**Problem:** Find length of longest substring without repeating characters.

```javascript
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let maxLength = 0;
  let start = 0;
  
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    
    if (seen.has(char) && seen.get(char) >= start) {
      start = seen.get(char) + 1;
    }
    
    seen.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  
  return maxLength;
}

// Test
console.log(lengthOfLongestSubstring('abcabcbb')); // 3 ('abc')
console.log(lengthOfLongestSubstring('bbbbb')); // 1 ('b')
console.log(lengthOfLongestSubstring('pwwkew')); // 3 ('wke')
```

**Time Complexity:** O(n)
**Space Complexity:** O(min(n, m)) where m is charset size

---

## Object Challenges

### Easy: Deep Clone

**Problem:** Create a deep clone of an object.

```javascript
// Solution 1: Using JSON (limitations: no functions, dates, etc.)
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Solution 2: Recursive
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

// Test
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
cloned.b.c = 3;
console.log(original.b.c); // 2 (unchanged)
```

---

### Medium: Merge Objects

**Problem:** Deep merge two objects.

```javascript
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === 'object' && 
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// Test
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
console.log(deepMerge(obj1, obj2)); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

---

### Medium: Get Nested Property

**Problem:** Get nested property value using dot notation.

```javascript
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, obj);
}

// Alternative: Handle array indices
function getNestedProperty(obj, path) {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  
  return keys.reduce((current, key) => {
    return current?.[key];
  }, obj);
}

// Test
const obj = { a: { b: { c: 42 } }, arr: [1, 2, 3] };
console.log(getNestedProperty(obj, 'a.b.c')); // 42
console.log(getNestedProperty(obj, 'arr[1]')); // 2
```

---

## Algorithm Challenges

### Easy: Fibonacci

**Problem:** Generate Fibonacci sequence.

```javascript
// Solution 1: Recursive (inefficient)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Solution 2: Iterative
function fibonacci(n) {
  if (n <= 1) return n;
  
  let prev = 0;
  let curr = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}

// Solution 3: Memoization
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// Test
console.log(fibonacci(10)); // 55
```

---

### Medium: Debounce

**Problem:** Implement debounce function.

```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Test
const log = debounce((msg) => console.log(msg), 1000);
log('Hello'); // Only this will execute after 1 second
log('World');
log('!');
```

---

### Medium: Throttle

**Problem:** Implement throttle function.

```javascript
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Test
const log = throttle((msg) => console.log(msg), 1000);
log('Hello'); // Executes immediately
log('World'); // Ignored
setTimeout(() => log('!'), 1100); // Executes after 1 second
```

---

### Hard: LRU Cache

**Problem:** Implement Least Recently Used cache.

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  put(key, value) {
    // Delete if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Add to end
    this.cache.set(key, value);
    
    // Remove oldest if over capacity
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// Test
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 1
cache.put(3, 3); // Evicts key 2
console.log(cache.get(2)); // -1 (not found)
```

---

## Async Challenges

### Medium: Promise.all Implementation

**Problem:** Implement Promise.all.

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      return resolve(results);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Test
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

promiseAll([p1, p2, p3]).then(console.log); // [1, 2, 3]
```

---

### Medium: Retry with Exponential Backoff

**Problem:** Retry failed async operations.

```javascript
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      
      const waitTime = delay * Math.pow(2, i);
      console.log(`Retry ${i + 1} after ${waitTime}ms`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Test
const unreliableAPI = () => {
  return Math.random() > 0.7 
    ? Promise.resolve('Success')
    : Promise.reject('Failed');
};

retryWithBackoff(unreliableAPI)
  .then(console.log)
  .catch(console.error);
```

---

## DOM Challenges

### Medium: Event Delegation

**Problem:** Implement event delegation.

```javascript
function delegate(parent, eventType, selector, handler) {
  parent.addEventListener(eventType, (event) => {
    const target = event.target.closest(selector);
    
    if (target && parent.contains(target)) {
      handler.call(target, event);
    }
  });
}

// Usage
delegate(document.body, 'click', '.button', function(event) {
  console.log('Button clicked:', this.textContent);
});
```

---

### Medium: Virtual Scroll

**Problem:** Implement virtual scrolling for large lists.

```javascript
class VirtualScroll {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    this.startIndex = 0;
    
    this.render();
    this.container.addEventListener('scroll', () => this.onScroll());
  }
  
  onScroll() {
    const scrollTop = this.container.scrollTop;
    this.startIndex = Math.floor(scrollTop / this.itemHeight);
    this.render();
  }
  
  render() {
    const endIndex = Math.min(
      this.startIndex + this.visibleCount + 1,
      this.items.length
    );
    
    const visibleItems = this.items.slice(this.startIndex, endIndex);
    
    this.container.innerHTML = `
      <div style="height: ${this.items.length * this.itemHeight}px; position: relative;">
        ${visibleItems.map((item, index) => `
          <div style="
            position: absolute;
            top: ${(this.startIndex + index) * this.itemHeight}px;
            height: ${this.itemHeight}px;
          ">
            ${item}
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Usage
const container = document.getElementById('list');
const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);
new VirtualScroll(container, items, 50);
```

---

## Key Takeaways

1. **Practice regularly**: Solve problems daily
2. **Understand patterns**: Recognize common problem types
3. **Optimize**: Consider time and space complexity
4. **Test edge cases**: Empty arrays, null values, etc.
5. **Explain your thinking**: Communicate your approach
6. **Multiple solutions**: Show different approaches
7. **Clean code**: Write readable, maintainable code

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: React Challenges →](./02-react-coding-challenges.md)
