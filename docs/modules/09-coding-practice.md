# 💻 MODULE 9: CODING PRACTICE

> **Focus**: 30% Theory - 70% Code
>
> _Bài tập thực hành với giải thích pattern_

---

## 📋 Trong Module Này

1. [Common Interview Challenges](#1-common-interview-challenges)
2. [JavaScript Polyfills](#2-javascript-polyfills)
3. [React Implementations](#3-react-implementations)
4. [Algorithm Patterns](#4-algorithm-patterns)

---

## 1. Common Interview Challenges

### Debounce

**What**: Delay execution until user stops triggering

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: Search input
const search = debounce((query) => fetchResults(query), 300);
```

### Throttle

**What**: Execute at most once per interval

```javascript
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage: Scroll handler
window.addEventListener("scroll", throttle(handleScroll, 100));
```

### Deep Clone

**What**: Copy nested objects without references

```javascript
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (seen.has(obj)) return seen.get(obj); // Handle circular

  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) {
    const clone = [];
    seen.set(obj, clone);
    return obj.map((item) => deepClone(item, seen));
  }

  const clone = {};
  seen.set(obj, clone);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], seen);
    }
  }
  return clone;
}
```

---

## 2. JavaScript Polyfills

### Array.prototype.map

```javascript
Array.prototype.myMap = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      // Handle sparse arrays
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};
```

### Array.prototype.reduce

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (initialValue === undefined) {
    accumulator = this[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }
  return accumulator;
};
```

### Function.prototype.bind

```javascript
Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  return function (...args) {
    return fn.apply(context, [...boundArgs, ...args]);
  };
};
```

### Promise.all

```javascript
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve([]);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
};
```

---

## 3. React Implementations

### useDebounce Hook

```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);
}
```

### usePrevious Hook

```javascript
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

### useLocalStorage Hook

```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}
```

---

## 4. Algorithm Patterns

### Two Pointers

```javascript
// Palindrome check
function isPalindrome(s) {
  let left = 0,
    right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

// Two sum (sorted array)
function twoSum(arr, target) {
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}
```

### Sliding Window

```javascript
// Max sum of k consecutive elements
function maxSumSubarray(arr, k) {
  let maxSum = 0,
    windowSum = 0;

  // First window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}
```

### Hash Map

```javascript
// Two sum (unsorted)
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

// Group anagrams
function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return Array.from(map.values());
}
```

---

## 📊 Complexity Reference

| Algorithm       | Time       | Space |
| --------------- | ---------- | ----- |
| Two Pointers    | O(n)       | O(1)  |
| Sliding Window  | O(n)       | O(1)  |
| Hash Map Lookup | O(1)       | O(n)  |
| Binary Search   | O(log n)   | O(1)  |
| Merge Sort      | O(n log n) | O(n)  |

---

## 🔗 Navigation

| Prev                                       | Module                 | Next                                     |
| ------------------------------------------ | ---------------------- | ---------------------------------------- |
| [Testing & DevOps](./08-testing-devops.md) | **9. Coding Practice** | [Interview Prep](./10-interview-prep.md) |

---

> _Tiếp theo: [Module 10: Interview Preparation](./10-interview-prep.md)_
