# Implement Array Methods

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

> Implement các array methods như map, filter, reduce từ scratch.

**Difficulty**: 🟢 Easy
**Time**: 20 minutes
**Companies**: All Big Tech

---

## 📋 Problem Statement

Implement the following Array prototype methods:
1. `map` - Transform each element
2. `filter` - Select elements based on condition
3. `reduce` - Aggregate values
4. `forEach` - Iterate without return
5. `find` - Find first matching element
6. `some` / `every` - Check conditions

---

## 💡 Solutions

### Array.prototype.map

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const result = [];
  const length = this.length;

  for (let i = 0; i < length; i++) {
    // Check for sparse arrays
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }

  return result;
};

// Test
const arr = [1, 2, 3];
console.log(arr.myMap(x => x * 2)); // [2, 4, 6]

// With thisArg
const obj = { multiplier: 3 };
console.log(arr.myMap(function(x) {
  return x * this.multiplier;
}, obj)); // [3, 6, 9]
```

### Array.prototype.filter

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const result = [];
  const length = this.length;

  for (let i = 0; i < length; i++) {
    if (i in this) {
      const value = this[i];
      if (callback.call(thisArg, value, i, this)) {
        result.push(value);
      }
    }
  }

  return result;
};

// Test
const arr = [1, 2, 3, 4, 5];
console.log(arr.myFilter(x => x % 2 === 0)); // [2, 4]
```

### Array.prototype.reduce

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const length = this.length;
  let accumulator;
  let startIndex;

  // Handle initial value
  if (arguments.length >= 2) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // Find first non-empty element
    let found = false;
    for (let i = 0; i < length; i++) {
      if (i in this) {
        accumulator = this[i];
        startIndex = i + 1;
        found = true;
        break;
      }
    }

    if (!found) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
  }

  for (let i = startIndex; i < length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};

// Tests
console.log([1, 2, 3].myReduce((a, b) => a + b)); // 6
console.log([1, 2, 3].myReduce((a, b) => a + b, 10)); // 16
console.log([[1, 2], [3, 4]].myReduce((a, b) => a.concat(b), [])); // [1, 2, 3, 4]
```

### Array.prototype.forEach

```javascript
Array.prototype.myForEach = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const length = this.length;

  for (let i = 0; i < length; i++) {
    if (i in this) {
      callback.call(thisArg, this[i], i, this);
    }
  }
};

// Test
[1, 2, 3].myForEach((val, i) => console.log(i, val));
// 0 1
// 1 2
// 2 3
```

### Array.prototype.find / findIndex

```javascript
Array.prototype.myFind = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const length = this.length;

  for (let i = 0; i < length; i++) {
    if (i in this) {
      const value = this[i];
      if (callback.call(thisArg, value, i, this)) {
        return value;
      }
    }
  }

  return undefined;
};

Array.prototype.myFindIndex = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const length = this.length;

  for (let i = 0; i < length; i++) {
    if (i in this) {
      if (callback.call(thisArg, this[i], i, this)) {
        return i;
      }
    }
  }

  return -1;
};

// Test
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
];

console.log(users.myFind(u => u.id === 2)); // { id: 2, name: 'Jane' }
console.log(users.myFindIndex(u => u.id === 2)); // 1
```

### Array.prototype.some / every

```javascript
Array.prototype.mySome = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const length = this.length;

  for (let i = 0; i < length; i++) {
    if (i in this) {
      if (callback.call(thisArg, this[i], i, this)) {
        return true;
      }
    }
  }

  return false;
};

Array.prototype.myEvery = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const length = this.length;

  for (let i = 0; i < length; i++) {
    if (i in this) {
      if (!callback.call(thisArg, this[i], i, this)) {
        return false;
      }
    }
  }

  return true;
};

// Tests
console.log([1, 2, 3].mySome(x => x > 2)); // true
console.log([1, 2, 3].mySome(x => x > 5)); // false
console.log([1, 2, 3].myEvery(x => x > 0)); // true
console.log([1, 2, 3].myEvery(x => x > 1)); // false
```

### Array.prototype.flat

```javascript
Array.prototype.myFlat = function(depth = 1) {
  const result = [];

  const flatten = (arr, d) => {
    for (let i = 0; i < arr.length; i++) {
      if (i in arr) {
        const val = arr[i];
        if (Array.isArray(val) && d > 0) {
          flatten(val, d - 1);
        } else {
          result.push(val);
        }
      }
    }
  };

  flatten(this, depth);
  return result;
};

// Tests
console.log([1, [2, [3, [4]]]].myFlat()); // [1, 2, [3, [4]]]
console.log([1, [2, [3, [4]]]].myFlat(2)); // [1, 2, 3, [4]]
console.log([1, [2, [3, [4]]]].myFlat(Infinity)); // [1, 2, 3, 4]
```

### Array.prototype.flatMap

```javascript
Array.prototype.myFlatMap = function(callback, thisArg) {
  return this.myMap(callback, thisArg).myFlat(1);
};

// Test
const arr = [1, 2, 3];
console.log(arr.myFlatMap(x => [x, x * 2])); // [1, 2, 2, 4, 3, 6]
```

---

## 📊 Comparison Table

```
┌────────────┬───────────┬───────────────┬─────────────────────────┐
│ Method     │ Returns   │ Mutates Orig  │ Purpose                 │
├────────────┼───────────┼───────────────┼─────────────────────────┤
│ map        │ New array │ No            │ Transform elements      │
│ filter     │ New array │ No            │ Select elements         │
│ reduce     │ Any value │ No            │ Aggregate to single val │
│ forEach    │ undefined │ No            │ Side effects            │
│ find       │ Element   │ No            │ Find first match        │
│ findIndex  │ Number    │ No            │ Find index of match     │
│ some       │ Boolean   │ No            │ Test if any matches     │
│ every      │ Boolean   │ No            │ Test if all match       │
│ flat       │ New array │ No            │ Flatten nested arrays   │
│ flatMap    │ New array │ No            │ Map then flatten        │
└────────────┴───────────┴───────────────┴─────────────────────────┘
```

---

## 🧪 Edge Cases

```javascript
// Sparse arrays
const sparse = [1, , , 4]; // indices 1 and 2 are empty
sparse.myMap(x => x * 2); // [2, empty × 2, 8]

// Empty arrays
[].myReduce((a, b) => a + b); // TypeError
[].myReduce((a, b) => a + b, 0); // 0 (with initial value)

// Modified during iteration
const arr = [1, 2, 3];
arr.myForEach((_, i) => {
  if (i === 0) arr.push(4); // Won't iterate over 4
});

// Non-array objects with length
const arrayLike = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.myMap.call(arrayLike, x => x.toUpperCase());
// ['A', 'B']
```

---

## ❓ Follow-up Questions

1. **Why check `i in this`?**
   - Handles sparse arrays correctly
   - Doesn't iterate over empty slots

2. **What's the difference between `for` and `for...of`?**
   - `for` gives index, can skip
   - `for...of` gives values, simpler but less control

3. **How does `reduce` find initial value without explicit one?**
   - Uses first non-empty element
   - Throws error if array is empty

4. **What about performance?**
   - Native implementations are optimized in C++
   - Our implementations are O(n) but slower

---

> **Tiếp theo:** Deep Clone | **Quay lại:** [JavaScript Challenges](./README.md)
