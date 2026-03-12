# JavaScript Cheatsheet

> Quick reference cho JavaScript methods và syntax.

---

## Array Methods

```javascript
// MUTATING (thay đổi original array)
arr.push(item)      // Add to end, return new length
arr.pop()           // Remove from end, return removed
arr.shift()         // Remove from start, return removed
arr.unshift(item)   // Add to start, return new length
arr.splice(i, n)    // Remove n items at index i
arr.sort((a,b)=>a-b)// Sort in place
arr.reverse()       // Reverse in place
arr.fill(value)     // Fill all elements

// NON-MUTATING (return new array)
arr.map(fn)         // Transform each element
arr.filter(fn)      // Select elements
arr.reduce(fn, init)// Aggregate to single value
arr.slice(start,end)// Extract portion
arr.concat(arr2)    // Merge arrays
arr.flat(depth)     // Flatten nested
arr.flatMap(fn)     // map + flat(1)

// SEARCH
arr.find(fn)        // First match (element)
arr.findIndex(fn)   // First match (index)
arr.indexOf(item)   // First index of item
arr.lastIndexOf(item)
arr.includes(item)  // Boolean
arr.some(fn)        // Any match?
arr.every(fn)       // All match?

// ITERATE
arr.forEach(fn)     // No return value
arr.entries()       // [index, value] iterator
arr.keys()          // index iterator
arr.values()        // value iterator
```

---

## String Methods

```javascript
// GET INFO
str.length          // Property, not method
str.charAt(i)       // Character at index
str.charCodeAt(i)   // Unicode code
str.indexOf(sub)    // First occurrence index
str.lastIndexOf(sub)
str.includes(sub)   // Boolean
str.startsWith(sub) // Boolean
str.endsWith(sub)   // Boolean

// EXTRACT
str.slice(start,end)// Extract portion
str.substring(start,end)
str.substr(start,len) // Deprecated

// TRANSFORM
str.toLowerCase()
str.toUpperCase()
str.trim()          // Remove whitespace both ends
str.trimStart()     // Remove from start
str.trimEnd()       // Remove from end
str.repeat(n)       // Repeat n times
str.replace(a, b)   // Replace first occurrence
str.replaceAll(a,b) // Replace all

// SPLIT/JOIN
str.split(sep)      // String → Array
arr.join(sep)       // Array → String

// PADDING
str.padStart(len,ch)// Pad from start
str.padEnd(len, ch) // Pad from end
```

---

## Object Methods

```javascript
// STATIC METHODS
Object.keys(obj)       // Array of keys
Object.values(obj)     // Array of values
Object.entries(obj)    // Array of [key, value]
Object.fromEntries(arr)// Entries → Object
Object.assign(t, s)    // Copy properties
Object.freeze(obj)     // Make immutable
Object.seal(obj)       // Prevent add/remove
Object.is(a, b)        // Strict equality (+NaN)

// INSTANCE METHODS
obj.hasOwnProperty(key)// Own property?
obj.toString()         // String representation
obj.valueOf()          // Primitive value

// PROPERTY DESCRIPTORS
Object.defineProperty(obj, key, descriptor)
Object.getOwnPropertyDescriptor(obj, key)
Object.getOwnPropertyNames(obj)
Object.getPrototypeOf(obj)
```

---

## Promise Methods

```javascript
// CREATION
new Promise((resolve, reject) => {})
Promise.resolve(value)
Promise.reject(reason)

// INSTANCE
promise.then(onFulfilled, onRejected)
promise.catch(onRejected)
promise.finally(callback)

// STATIC COMBINATORS
Promise.all([p1, p2])     // All must resolve
Promise.race([p1, p2])    // First to settle
Promise.allSettled([...]) // All results, no reject
Promise.any([p1, p2])     // First to resolve
```

---

## Map & Set

```javascript
// MAP
const map = new Map()
map.set(key, value)    // Add/update
map.get(key)           // Get value
map.has(key)           // Check existence
map.delete(key)        // Remove
map.clear()            // Remove all
map.size               // Property
map.forEach(fn)        // Iterate
map.keys()             // Key iterator
map.values()           // Value iterator
map.entries()          // [key, value] iterator

// SET
const set = new Set()
set.add(value)         // Add
set.has(value)         // Check existence
set.delete(value)      // Remove
set.clear()            // Remove all
set.size               // Property
set.forEach(fn)        // Iterate

// WEAKMAP / WEAKSET
// Keys must be objects
// No size, no iteration
// Garbage collected when key is unreachable
```

---

## Type Checking

```javascript
// TYPEOF
typeof undefined     // "undefined"
typeof null          // "object" (bug)
typeof true          // "boolean"
typeof 42            // "number"
typeof "str"         // "string"
typeof Symbol()      // "symbol"
typeof 10n           // "bigint"
typeof {}            // "object"
typeof []            // "object"
typeof function(){}  // "function"

// BETTER CHECKS
Array.isArray(arr)              // Array check
Number.isNaN(val)               // NaN check
Number.isFinite(val)            // Finite number
Number.isInteger(val)           // Integer
Object.prototype.toString.call(val) // "[object Type]"

// INSTANCEOF
arr instanceof Array            // true
obj instanceof Object           // true
```

---

## Spread & Destructuring

```javascript
// SPREAD
const arr2 = [...arr1]              // Copy array
const obj2 = {...obj1}              // Shallow copy
const merged = [...arr1, ...arr2]   // Merge arrays
const combined = {...obj1, ...obj2} // Merge objects
fn(...args)                         // Function call

// ARRAY DESTRUCTURING
const [a, b, ...rest] = [1, 2, 3, 4]
const [first, , third] = [1, 2, 3]  // Skip elements
const [x = 0] = []                  // Default value

// OBJECT DESTRUCTURING
const {name, age} = person
const {name: n, age: a} = person    // Rename
const {x = 10} = {}                 // Default
const {a: {b}} = {a: {b: 1}}        // Nested
```

---

## Async Patterns

```javascript
// CALLBACKS
function fetchData(callback) {
  setTimeout(() => callback(data), 1000)
}

// PROMISES
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))

// ASYNC/AWAIT
async function getData() {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// PARALLEL
const [a, b] = await Promise.all([
  fetchA(),
  fetchB()
])
```

---

## Common Patterns

```javascript
// DEBOUNCE
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// THROTTLE
function throttle(fn, delay) {
  let lastTime = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn(...args)
    }
  }
}

// MEMOIZE
function memoize(fn) {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }
    return cache.get(key)
  }
}

// DEEP CLONE
const clone = JSON.parse(JSON.stringify(obj))
// Or use structuredClone(obj) in modern browsers
```

---

> **Quay lại:** [Resources](../README.md)
