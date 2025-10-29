# JavaScript Coding Challenges
## Interview Practice - Chapter 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: React Challenges →](./02-react-challenges.md)

---

## Overview

This chapter contains JavaScript coding challenges commonly asked in Big Tech interviews. Each problem includes multiple solutions with time/space complexity analysis.

---

## Table of Contents
1. [Array Manipulation](#array-manipulation)
2. [String Problems](#string-problems)
3. [Object Operations](#object-operations)
4. [Function Implementation](#function-implementation)
5. [Async Programming](#async-programming)
6. [Data Structures](#data-structures)
7. [Algorithm Problems](#algorithm-problems)

---

## Array Manipulation

### Problem 1: Implement Array.prototype.flat()

**Difficulty:** Medium  
**Companies:** Google, Facebook, Amazon

```typescript
/**
 * Flatten a nested array to specified depth
 * @param arr - Array to flatten
 * @param depth - Depth to flatten (default: 1)
 * @returns Flattened array
 */

// Solution 1: Recursive
function flattenArray<T>(arr: T[], depth: number = 1): any[] {
  const result: any[] = [];
  
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenArray(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// Solution 2: Iterative with stack
function flattenIterative<T>(arr: T[], depth: number = 1): any[] {
  const stack: Array<[any, number]> = arr.map(item => [item, 0]);
  const result: any[] = [];
  
  while (stack.length > 0) {
    const [item, currentDepth] = stack.pop()!;
    
    if (Array.isArray(item) && currentDepth < depth) {
      for (let i = item.length - 1; i >= 0; i--) {
        stack.push([item[i], currentDepth + 1]);
      }
    } else {
      result.unshift(item);
    }
  }
  
  return result;
}

// Solution 3: Using reduce
function flattenReduce<T>(arr: T[], depth: number = 1): any[] {
  return depth > 0
    ? arr.reduce((acc: any[], val) => 
        acc.concat(Array.isArray(val) ? flattenReduce(val, depth - 1) : val),
      []
    )
    : arr.slice();
}

// Test cases
console.log(flattenArray([1, [2, 3], [4, [5, 6]]], 1));
// Output: [1, 2, 3, 4, [5, 6]]

console.log(flattenArray([1, [2, 3], [4, [5, 6]]], 2));
// Output: [1, 2, 3, 4, 5, 6]

console.log(flattenArray([1, [2, [3, [4, [5]]]]], Infinity));
// Output: [1, 2, 3, 4, 5]

// Time Complexity: O(n) where n is total number of elements
// Space Complexity: O(d) where d is depth (recursion stack)
```

### Problem 2: Array Chunk

**Difficulty:** Easy  
**Companies:** Amazon, Microsoft

```typescript
/**
 * Split array into chunks of specified size
 * @param arr - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 */

function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) throw new Error('Size must be positive');
  
  const result: T[][] = [];
  
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  
  return result;
}

// Alternative: Using reduce
function chunkReduce<T>(arr: T[], size: number): T[][] {
  return arr.reduce((chunks: T[][], item, index) => {
    const chunkIndex = Math.floor(index / size);
    
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = [];
    }
    
    chunks[chunkIndex].push(item);
    return chunks;
  }, []);
}

// Test cases
console.log(chunk([1, 2, 3, 4, 5, 6, 7, 8], 3));
// Output: [[1, 2, 3], [4, 5, 6], [7, 8]]

console.log(chunk(['a', 'b', 'c', 'd'], 2));
// Output: [['a', 'b'], ['c', 'd']]

// Time Complexity: O(n)
// Space Complexity: O(n)
```

### Problem 3: Remove Duplicates

**Difficulty:** Easy  
**Companies:** Google, Facebook

```typescript
/**
 * Remove duplicates from array
 */

// Solution 1: Using Set
function removeDuplicates<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// Solution 2: Using filter
function removeDuplicatesFilter<T>(arr: T[]): T[] {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

// Solution 3: Using reduce
function removeDuplicatesReduce<T>(arr: T[]): T[] {
  return arr.reduce((unique: T[], item) => {
    return unique.includes(item) ? unique : [...unique, item];
  }, []);
}

// Solution 4: For objects (by property)
interface Item {
  id: number;
  name: string;
}

function removeDuplicatesByKey<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

// Test cases
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5]));
// Output: [1, 2, 3, 4, 5]

const items: Item[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John Doe' }
];
console.log(removeDuplicatesByKey(items, 'id'));
// Output: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

// Time Complexity: O(n) for Set, O(n²) for filter
// Space Complexity: O(n)
```

---

## String Problems

### Problem 4: Reverse String

**Difficulty:** Easy  
**Companies:** All companies

```typescript
/**
 * Reverse a string
 */

// Solution 1: Built-in methods
function reverseString1(str: string): string {
  return str.split('').reverse().join('');
}

// Solution 2: Loop
function reverseString2(str: string): string {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Solution 3: Reduce
function reverseString3(str: string): string {
  return str.split('').reduce((reversed, char) => char + reversed, '');
}

// Solution 4: Recursion
function reverseString4(str: string): string {
  if (str === '') return '';
  return reverseString4(str.slice(1)) + str[0];
}

// Test cases
console.log(reverseString1('hello')); // 'olleh'
console.log(reverseString2('world')); // 'dlrow'

// Time Complexity: O(n)
// Space Complexity: O(n)
```

### Problem 5: Palindrome Check

**Difficulty:** Easy  
**Companies:** Amazon, Microsoft

```typescript
/**
 * Check if string is a palindrome
 */

// Solution 1: Two pointers
function isPalindrome1(str: string): boolean {
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

// Solution 2: Reverse comparison
function isPalindrome2(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// Solution 3: Recursive
function isPalindrome3(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  function check(s: string): boolean {
    if (s.length <= 1) return true;
    if (s[0] !== s[s.length - 1]) return false;
    return check(s.slice(1, -1));
  }
  
  return check(cleaned);
}

// Test cases
console.log(isPalindrome1('A man, a plan, a canal: Panama')); // true
console.log(isPalindrome1('race a car')); // false
console.log(isPalindrome1('Was it a car or a cat I saw?')); // true

// Time Complexity: O(n)
// Space Complexity: O(1) for two-pointer, O(n) for reverse
```

### Problem 6: Anagram Check

**Difficulty:** Easy  
**Companies:** Google, Facebook

```typescript
/**
 * Check if two strings are anagrams
 */

// Solution 1: Sort and compare
function isAnagram1(str1: string, str2: string): boolean {
  const clean1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (clean1.length !== clean2.length) return false;
  
  return clean1.split('').sort().join('') === clean2.split('').sort().join('');
}

// Solution 2: Character count
function isAnagram2(str1: string, str2: string): boolean {
  const clean1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (clean1.length !== clean2.length) return false;
  
  const charCount: Record<string, number> = {};
  
  for (const char of clean1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  for (const char of clean2) {
    if (!charCount[char]) return false;
    charCount[char]--;
  }
  
  return true;
}

// Solution 3: Using Map
function isAnagram3(str1: string, str2: string): boolean {
  const clean1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (clean1.length !== clean2.length) return false;
  
  const map = new Map<string, number>();
  
  for (const char of clean1) {
    map.set(char, (map.get(char) || 0) + 1);
  }
  
  for (const char of clean2) {
    const count = map.get(char);
    if (!count) return false;
    map.set(char, count - 1);
  }
  
  return true;
}

// Test cases
console.log(isAnagram1('listen', 'silent')); // true
console.log(isAnagram2('hello', 'world')); // false
console.log(isAnagram3('Astronomer', 'Moon starer')); // true

// Time Complexity: O(n log n) for sort, O(n) for count
// Space Complexity: O(n)
```

---

## Object Operations

### Problem 7: Deep Clone Object

**Difficulty:** Medium  
**Companies:** All companies

```typescript
/**
 * Deep clone an object
 */

// Solution 1: Recursive
function deepClone<T>(obj: T): T {
  // Handle null and primitives
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  // Handle Array
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as any;
  }
  
  // Handle Object
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  throw new Error('Unable to clone object');
}

// Solution 2: JSON (limited - no functions, dates, etc.)
function deepCloneJSON<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Solution 3: Using structuredClone (modern browsers)
function deepCloneStructured<T>(obj: T): T {
  return structuredClone(obj);
}

// Test cases
const original = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'gaming'],
  address: {
    city: 'New York',
    country: 'USA'
  },
  birthDate: new Date('1990-01-01')
};

const cloned = deepClone(original);
cloned.address.city = 'Los Angeles';

console.log(original.address.city); // 'New York' (unchanged)
console.log(cloned.address.city); // 'Los Angeles'

// Time Complexity: O(n) where n is number of properties
// Space Complexity: O(n)
```

### Problem 8: Deep Equal Comparison

**Difficulty:** Medium  
**Companies:** Google, Facebook

```typescript
/**
 * Deep equality check for objects
 */

function deepEqual(obj1: any, obj2: any): boolean {
  // Same reference
  if (obj1 === obj2) return true;
  
  // Null check
  if (obj1 == null || obj2 == null) return false;
  
  // Type check
  if (typeof obj1 !== typeof obj2) return false;
  
  // Primitive types
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  // Array check
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
  // Array comparison
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    
    return true;
  }
  
  // Object comparison
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

// Test cases
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, 2, [3, 4]], [1, 2, [3, 4]])); // true
console.log(deepEqual({ a: 1 }, { a: 1, b: undefined })); // false

// Time Complexity: O(n) where n is total properties
// Space Complexity: O(d) where d is depth (recursion)
```

### Problem 9: Flatten Object

**Difficulty:** Medium  
**Companies:** Amazon, Microsoft

```typescript
/**
 * Flatten nested object
 */

function flattenObject(
  obj: Record<string, any>,
  prefix: string = '',
  result: Record<string, any> = {}
): Record<string, any> {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

// Unflatten object
function unflattenObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = obj[key];
  }
  
  return result;
}

// Test cases
const nested = {
  name: 'John',
  address: {
    city: 'New York',
    country: 'USA',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  hobbies: ['reading', 'gaming']
};

const flattened = flattenObject(nested);
console.log(flattened);
// {
//   name: 'John',
//   'address.city': 'New York',
//   'address.country': 'USA',
//   'address.coordinates.lat': 40.7128,
//   'address.coordinates.lng': -74.0060,
//   hobbies: ['reading', 'gaming']
// }

const unflattened = unflattenObject(flattened);
console.log(unflattened); // Original structure

// Time Complexity: O(n)
// Space Complexity: O(n)
```

---

## Function Implementation

### Problem 10: Debounce

**Difficulty:** Medium  
**Companies:** All companies

```typescript
/**
 * Debounce function - delays execution until after wait time
 */

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// With immediate execution option
function debounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const callNow = immediate && timeoutId === null;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}

// Usage
const searchAPI = (query: string) => {
  console.log(`Searching for: ${query}`);
};

const debouncedSearch = debounce(searchAPI, 300);

// Only the last call within 300ms will execute
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // Only this executes after 300ms

// Time Complexity: O(1)
// Space Complexity: O(1)
```

### Problem 11: Throttle

**Difficulty:** Medium  
**Companies:** All companies

```typescript
/**
 * Throttle function - limits execution to once per wait time
 */

function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastArgs: Parameters<T> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func.apply(context, lastArgs);
          lastArgs = null;
        }
      }, wait);
    } else {
      lastArgs = args;
    }
  };
}

// Usage
const handleScroll = () => {
  console.log('Scroll event');
};

const throttledScroll = throttle(handleScroll, 100);

window.addEventListener('scroll', throttledScroll);

// Time Complexity: O(1)
// Space Complexity: O(1)
```

### Problem 12: Memoization

**Difficulty:** Medium  
**Companies:** Google, Facebook

```typescript
/**
 * Memoize function - cache results
 */

function memoize<T extends (...args: any[]) => any>(
  func: T
): T & { cache: Map<string, ReturnType<T>> } {
  const cache = new Map<string, ReturnType<T>>();
  
  const memoized = function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache hit');
      return cache.get(key)!;
    }
    
    console.log('Computing...');
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  } as T & { cache: Map<string, ReturnType<T>> };
  
  memoized.cache = cache;
  return memoized;
}

// Example: Fibonacci
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.log(memoizedFib(10)); // Computing... 55
console.log(memoizedFib(10)); // Cache hit 55
console.log(memoizedFib.cache.size); // 1

// Time Complexity: O(1) for cached, O(n) for uncached
// Space Complexity: O(n) for cache
```

---

## Summary

Key patterns for JavaScript interviews:
- Master array/string manipulation
- Understand recursion vs iteration trade-offs
- Know time/space complexity
- Practice with TypeScript types
- Implement common utilities (debounce, throttle, memoize)

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: React Challenges →](./02-react-challenges.md)
