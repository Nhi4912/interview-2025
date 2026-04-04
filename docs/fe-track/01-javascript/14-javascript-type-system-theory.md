# JavaScript Type System - Advanced Theory / Hệ Thống Kiểu JavaScript - Lý Thuyết Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)
> **L5 Competencies**: Technical Mastery (20pts), Quality & Risk (10pts) — type coercion bugs cause production incidents

## Real-World Scenario / Tình Huống Thực Tế

**Bug in payment API validation:** `typeof amount === 'number'` passed for `NaN` — `typeof NaN === 'number'` returns `true`. Payment was processed with `NaN` amount. Fix: `typeof amount === 'number' && !Number.isNaN(amount) && isFinite(amount)`. Root cause: `typeof` tells you the spec type, not "is this a valid usable number" — those are different questions.

**Bài học:** `typeof` là spec-level type tag, không phải validation tool. `typeof null === 'object'`, `typeof NaN === 'number'`, `typeof function() {} === 'function'` (dù function là object). Biết chính xác `typeof` trả về gì — và khi nào dùng `instanceof`, `Array.isArray`, hoặc `Object.prototype.toString.call` thay thế.

## What & Why / Cái Gì & Tại Sao

**Scope:** File này focus vào type system internals — `typeof` oddities, runtime type checking tools, và memory representation. Coercion algorithms → xem [13-javascript-basics-theory.md](./13-javascript-basics-theory.md). Practical variable usage → xem [01-variables-data-types.md](./01-variables-data-types.md).

**Analogy:** JavaScript type system giống ID system ở airport: `typeof` là loại giấy tờ ("passport" vs "driver's license"), còn nội dung trong đó (tên, ngày sinh) là value. Tương tự: `typeof null === 'object'` nghĩa là "loại giấy tờ là object" nhưng `null` không phải real object — như "passport" expired, loại đúng nhưng không usable.

## Concept Map / Bản Đồ Khái Niệm

```
[JavaScript Type System]
        │
        ├── typeof operator
        │       ├── Returns: "undefined", "boolean", "number", "bigint", "string", "symbol", "object", "function"
        │       ├── typeof null === "object"   ← historical bug (null has object bit set in 32-bit era)
        │       ├── typeof NaN === "number"    ← NaN IS a Number type by spec
        │       └── typeof function === "function"  ← exception: callable objects get own tag
        │
        ├── Type checking tools (when typeof is insufficient)
        │       ├── Array.isArray(x)           ← never use typeof/instanceof for arrays
        │       ├── x instanceof Constructor   ← checks prototype chain, fails across iframes
        │       ├── Object.prototype.toString.call(x)  ← returns "[object Array]", "[object Date]", etc.
        │       └── Number.isNaN(x)            ← only NaN returns true (unlike global isNaN which coerces)
        │
        └── Memory representation (V8 conceptual model)
                ├── SMI (Small Integer): 31-bit integers stored inline, no heap allocation
                ├── HeapNumber: floating point numbers stored on heap
                ├── Pointer: reference to heap object (function, array, plain object)
                └── Tagged union: type tag bits distinguish SMI vs pointer
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. `typeof` — What It Checks and Why It Lies

**🧠 Memory Hook:** "**`typeof` returns the spec type tag, not your intuitive idea of the type. `null` has the Object tag. `NaN` has the Number tag.**"

**Why does this exist? / Tại sao tồn tại?**

- Why does `typeof null === 'object'`? In the original 1995 V8 implementation, values were stored as 32-bit words where the low 3 bits were a type tag. `null` was stored as 0x00000000 — the null pointer. The Object type tag was also `000`. So `typeof null` read the tag bits, saw `000`, and returned `'object'`. A 30-year-old bug kept for backward compatibility.
- Why does `typeof NaN === 'number'`? Because `NaN` (Not-a-Number) is defined in IEEE 754 as a special floating-point value. It's still in the Number space — it's a _failed_ number operation result, not a different type. The name is misleading.
- Why does `typeof function() {} === 'function'`? Functions are objects in JavaScript, but they're callable objects. ECMAScript spec added a special case for callable objects to return `'function'` — the only Object subtype that gets its own typeof tag.

**Visual — typeof return values:**

```javascript
typeof undefined; // "undefined"
typeof null; // "object"      ← BUG: null is NOT an object
typeof true; // "boolean"
typeof 42; // "number"
typeof NaN; // "number"      ← NaN IS a number type
typeof ""; // "string"
typeof Symbol(); // "symbol"
typeof 42n; // "bigint"
typeof {}; // "object"
typeof []; // "object"      ← array is an object
typeof function () {}; // "function"    ← exception: callable object gets own tag

// Safe null check (because typeof null is broken):
value !== null && typeof value === "object";

// Safe array check:
Array.isArray(value); // NOT typeof value === 'object'
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `typeof value === 'object'` to check for objects | `typeof null === 'object'` — a 30-year-old historical bug; null passes this check | Use `value !== null && typeof value === 'object'` |
| `typeof value === 'number'` to validate numbers | `typeof NaN === 'number'` — NaN passes this check; it's not a usable number | Add `&& !Number.isNaN(value) && isFinite(value)` for a valid numeric check |
| `typeof [] === 'array'` | `typeof` only returns 8 type strings and never `'array'` — arrays return `'object'` | `typeof []` returns `'object'` — use `Array.isArray()` instead |
| Using `typeof` for class instances | `typeof new Date()` → `'object'` — no class information; all instances look the same | Use `instanceof` or `Object.prototype.toString.call` for class instances |

**🎯 Interview Pattern:**

- **Trigger**: "type checking" / "validate this value" / "why typeof null is object"
- **Concept**: typeof type tags, the null historical bug, NaN as valid Number type
- **Opening**: "typeof checks the spec-level type tag, not your intuitive type. The infamous `typeof null === 'object'` is a 30-year bug from 32-bit tag bits — null's 0x000 collided with the Object tag. For reliable type checks I use `Array.isArray`, `Number.isNaN`, and `Object.prototype.toString.call` depending on what I need..."

**🔑 Knowledge Chain:**

- **Prereq**: JavaScript primitive vs object types
- **Enables**: Type guards in TypeScript, runtime validation, debugging `null` reference errors

---

### 2. Type Checking Beyond `typeof`

**🧠 Memory Hook:** "**`typeof` → type family. `instanceof` → prototype chain. `Object.prototype.toString.call` → exact built-in tag. Use the right tool for each job.**"

**Why does this exist? / Tại sao tồn tại?**

- Why isn't `typeof` enough? It only distinguishes 8 type families. You can't distinguish `null` from `{}`, `Date` from `RegExp`, or `Array` from a plain `{}`
- Why does `instanceof` sometimes fail? Because `instanceof` traverses the prototype chain of the value and checks against the constructor's `.prototype`. Across iframes or workers, `Array` from frame A has a different prototype than `Array` from frame B — `frameB_array instanceof frameA_Array` → `false` even though both are arrays
- Why does `Object.prototype.toString.call` work reliably? Because it reads the `Symbol.toStringTag` slot or the internal `[[Class]]` slot — a built-in tag that doesn't depend on the prototype chain

**Visual — Type Checking Decision Tree:**

```
What do you need to check?
        │
        ├── Is it a specific primitive type? → typeof
        │       e.g. typeof x === 'string'
        │
        ├── Is it an array? → Array.isArray(x)
        │       (never instanceof Array — breaks across iframes)
        │
        ├── Is it a class instance? → x instanceof ClassName
        │       e.g. x instanceof Date, x instanceof MyClass
        │       ⚠️ Fails across iframes/workers
        │
        ├── Is it a specific built-in type? → Object.prototype.toString.call(x)
        │       '[object Array]', '[object Date]', '[object RegExp]',
        │       '[object Null]', '[object Undefined]', '[object Function]'
        │
        └── Is it a valid number (not NaN, not Infinity)?
                → typeof x === 'number' && Number.isNaN(x) === false && isFinite(x)
                Note: Number.isNaN(x) ≠ isNaN(x)
                  isNaN("hello") → true (coerces "hello" to NaN first)
                  Number.isNaN("hello") → false (no coercion — only true for actual NaN)
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `isNaN(value)` for NaN check | Global `isNaN` coerces the argument first — `isNaN("hello") === true` (coerced to NaN) | Use `Number.isNaN(value)` — no coercion, only true for actual NaN |
| `value instanceof Array` cross-frame | `instanceof` checks the prototype chain against the current frame's `Array` — fails across iframes | `Array.isArray(value)` — checks internal `[[IsArray]]` slot, reliable across realms |
| `typeof value === 'null'` | `typeof null === 'object'` — `'null'` is never a `typeof` result | Use `value === null` to check for null |
| `value.constructor === Object` | Constructor can be reassigned or absent (null-prototype objects) — unreliable | Use `Object.prototype.toString.call(value)` for reliable built-in type tag |

**🎯 Interview Pattern:**

- **Trigger**: "how to check if value is an array" / "type checking in production" / "Number.isNaN vs isNaN"
- **Concept**: Each type checking method has a different mechanism and appropriate use case
- **Opening**: "I use different tools for different type checks: `typeof` for primitive families, `Array.isArray` for arrays (reliable across iframes), `instanceof` for class instances within same realm, and `Number.isNaN` not global `isNaN` to avoid the coercion trap..."

**🔑 Knowledge Chain:**

- **Prereq**: Prototype chain, `typeof` behavior
- **Enables**: TypeScript type guards, runtime validation libraries (Zod/Yup), defensive programming patterns

---

### 3. Memory Representation — How V8 Stores Types

**🧠 Memory Hook:** "**SMI = small integer inline (free). HeapNumber = float on heap (cost). Pointer = heap reference (all objects). Changing `let x = 42` to `x = 42.5` allocates a HeapNumber.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do we care about V8 internals for interview prep? Because understanding that integers are stored differently from floats explains _why_ `42 | 0` (bitwise OR for floor) is faster than `Math.floor` for small numbers — SMI avoids heap allocation
- Why does V8 store integers specially (SMI)? Because integer arithmetic is extremely common. Allocating a heap object for every `i++` in a loop would be prohibitively slow. V8 stores integers ≤ 2^30-1 inline in the pointer itself using tag bits — zero allocation cost
- Why do objects that _start_ as integer arrays become slower? V8 tracks "element kinds" — if you add a float to an `[1, 2, 3]` array, V8 must transition from `PACKED_SMI_ELEMENTS` to `PACKED_DOUBLE_ELEMENTS`, reallocating the backing store. One `arr.push(3.14)` degrades the whole array.

**Definition:** V8 uses a **tagged pointer** representation: the lowest bit of each value indicates whether it's an SMI (31-bit integer, stored inline) or a pointer to a heap object. HeapNumbers are allocated for non-integer Number values. This means `42` and `42.0` have different internal representations.

**Visual — V8 Value Representation:**

```
Tagged pointer (64-bit):
  bit 0 = 0 → SMI (Small Integer): value in upper 32 bits, no heap alloc
  bit 0 = 1 → Pointer: points to heap object

SMI: let x = 42
  [0x0000002A << 1 | 0] ← no heap allocation, lives on stack

HeapNumber: let x = 42.5
  [pointer → HeapNumber { value: 42.5 }] ← heap allocation

V8 Array element kinds (transitions are one-way ← SLOW):
  PACKED_SMI_ELEMENTS    [1, 2, 3]              ← fastest
        ↓ add float
  PACKED_DOUBLE_ELEMENTS [1, 2, 3.14]           ← backing store reallocated
        ↓ add undefined/delete
  PACKED_ELEMENTS        [1, 2, undefined, 4]   ← boxing overhead
        ↓ create holes
  HOLEY_ELEMENTS         [1, , , 4]             ← slowest, prototype chain checks
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Mixing integers and floats in performance-critical arrays | Forces V8 to change element kind from `PACKED_SMI` → `PACKED_DOUBLE` — backing store reallocated | Keep array types homogeneous; initialize with consistent types |
| `arr.length = 0` to clear a large array | Array retains old backing store with its element kind transitions | `arr = []` creates a fresh array with a clean element kind |
| Adding `undefined` to array holes | Creates `HOLEY_ELEMENTS` — V8 must check the prototype chain on every element access | Avoid holes; fill with `null` instead of leaving gaps or setting `undefined` |
| Premature optimization without profiling | These micro-optimizations only matter in hot loops (>10k iterations) — profile first | Profile first; 90% of perf gains come from algorithmic improvements, not element kind tricks |

**🎯 Interview Pattern:**

- **Trigger**: "JavaScript performance" / "V8 internals" / "why is this loop slow"
- **Concept**: SMI/HeapNumber representation, array element kind transitions
- **Opening**: "V8 stores integers ≤ 2^30 as SMIs — inline in the pointer itself, zero allocation. Floats go to the heap as HeapNumbers. For arrays, V8 tracks element kinds and optimizes accordingly — mixing floats into an integer array forces a backing store reallocation. In hot loops, keeping array types homogeneous is a meaningful optimization..."

**🔑 Knowledge Chain:**

- **Prereq**: Heap/stack memory model, Number type
- **Enables**: V8 performance optimization, understanding why profilers show memory allocations in loops, hidden class theory

---

## Reference: Type System Internals / Tài Liệu Tham Khảo

## Type System Fundamentals / Cơ Bản Hệ Thống Kiểu

### JavaScript's Type System / Hệ Thống Kiểu của JavaScript

**English:** JavaScript uses a dynamic, weak type system with both primitive and object types.

**Tiếng Việt:** JavaScript sử dụng hệ thống kiểu động, yếu với cả kiểu nguyên thủy và kiểu đối tượng.

```typescript
// Type system architecture
// Kiến trúc hệ thống kiểu

/**
 * JavaScript Type Hierarchy
 *
 * Type
 * ├── Primitive Types
 * │   ├── Undefined
 * │   ├── Null
 * │   ├── Boolean
 * │   ├── Number
 * │   ├── BigInt
 * │   ├── String
 * │   └── Symbol
 * └── Object Types
 *     ├── Ordinary Objects
 *     ├── Exotic Objects
 *     │   ├── Array
 *     │   ├── Function
 *     │   ├── Date
 *     │   ├── RegExp
 *     │   └── ...
 *     └── Host Objects (DOM, etc.)
 */

// Type representation in memory
// Biểu diễn kiểu trong bộ nhớ

interface JSValue {
  type: JSType;
  value: any;
  flags: TypeFlags;
}

enum JSType {
  Undefined = 0,
  Null = 1,
  Boolean = 2,
  Number = 3,
  BigInt = 4,
  String = 5,
  Symbol = 6,
  Object = 7,
}

enum TypeFlags {
  None = 0,
  Primitive = 1 << 0,
  Object = 1 << 1,
  Callable = 1 << 2,
  Constructable = 1 << 3,
  Iterable = 1 << 4,
  AsyncIterable = 1 << 5,
}

class TypeSystem {
  // Get the type of a value
  // Lấy kiểu của một giá trị
  static typeOf(value: any): JSType {
    // Special cases
    if (value === null) return JSType.Null;
    if (value === undefined) return JSType.Undefined;

    // Primitive types
    switch (typeof value) {
      case "boolean":
        return JSType.Boolean;
      case "number":
        return JSType.Number;
      case "bigint":
        return JSType.BigInt;
      case "string":
        return JSType.String;
      case "symbol":
        return JSType.Symbol;
      case "object":
        return JSType.Object;
      case "function":
        return JSType.Object; // Functions are objects
      default:
        return JSType.Undefined;
    }
  }

  // Check if value is primitive
  // Kiểm tra nếu giá trị là nguyên thủy
  static isPrimitive(value: any): boolean {
    const type = this.typeOf(value);
    return type !== JSType.Object;
  }

  // Check if value is object
  // Kiểm tra nếu giá trị là object
  static isObject(value: any): boolean {
    return value !== null && (typeof value === "object" || typeof value === "function");
  }

  // Check if value is callable
  // Kiểm tra nếu giá trị có thể gọi
  static isCallable(value: any): boolean {
    return typeof value === "function";
  }

  // Check if value is constructable
  // Kiểm tra nếu giá trị có thể khởi tạo
  static isConstructable(value: any): boolean {
    if (!this.isCallable(value)) return false;

    try {
      // Arrow functions and built-ins like Math.max are not constructable
      return value.prototype !== undefined;
    } catch {
      return false;
    }
  }
}
```

---

## Dynamic Typing Theory / Lý Thuyết Kiểu Động

### Runtime Type Checking / Kiểm Tra Kiểu Lúc Runtime

**English:** JavaScript performs type checking at runtime, allowing variables to change types.

**Tiếng Việt:** JavaScript thực hiện kiểm tra kiểu lúc runtime, cho phép biến thay đổi kiểu.

```typescript
// Dynamic type system implementation
// Triển khai hệ thống kiểu động

class DynamicTypeChecker {
  // Type guards for runtime checking
  // Type guards cho kiểm tra runtime

  static isString(value: unknown): value is string {
    return typeof value === "string";
  }

  static isNumber(value: unknown): value is number {
    return typeof value === "number" && !isNaN(value);
  }

  static isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
  }

  static isNull(value: unknown): value is null {
    return value === null;
  }

  static isUndefined(value: unknown): value is undefined {
    return value === undefined;
  }

  static isNullish(value: unknown): value is null | undefined {
    return value == null; // Intentional == for null/undefined
  }

  static isSymbol(value: unknown): value is symbol {
    return typeof value === "symbol";
  }

  static isBigInt(value: unknown): value is bigint {
    return typeof value === "bigint";
  }

  static isArray(value: unknown): value is any[] {
    return Array.isArray(value);
  }

  static isFunction(value: unknown): value is Function {
    return typeof value === "function";
  }

  static isObject(value: unknown): value is object {
    return value !== null && typeof value === "object";
  }

  static isPlainObject(value: unknown): value is Record<string, any> {
    if (!this.isObject(value)) return false;

    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
  }

  static isDate(value: unknown): value is Date {
    return value instanceof Date && !isNaN(value.getTime());
  }

  static isRegExp(value: unknown): value is RegExp {
    return value instanceof RegExp;
  }

  static isPromise(value: unknown): value is Promise<any> {
    return (
      value instanceof Promise ||
      (this.isObject(value) && "then" in value && this.isFunction((value as any).then))
    );
  }

  static isIterable(value: unknown): value is Iterable<any> {
    return value != null && typeof (value as any)[Symbol.iterator] === "function";
  }

  static isAsyncIterable(value: unknown): value is AsyncIterable<any> {
    return value != null && typeof (value as any)[Symbol.asyncIterator] === "function";
  }

  // Advanced type checking
  // Kiểm tra kiểu nâng cao

  static getDetailedType(value: unknown): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    const type = typeof value;

    if (type === "object") {
      if (Array.isArray(value)) return "array";
      if (value instanceof Date) return "date";
      if (value instanceof RegExp) return "regexp";
      if (value instanceof Map) return "map";
      if (value instanceof Set) return "set";
      if (value instanceof WeakMap) return "weakmap";
      if (value instanceof WeakSet) return "weakset";
      if (value instanceof Promise) return "promise";
      if (value instanceof Error) return "error";

      // Check for typed arrays
      if (ArrayBuffer.isView(value)) {
        return value.constructor.name.toLowerCase();
      }

      return "object";
    }

    return type;
  }

  // Type compatibility checking
  // Kiểm tra tương thích kiểu

  static isCompatible(value: unknown, expectedType: string): boolean {
    const actualType = this.getDetailedType(value);

    // Exact match
    if (actualType === expectedType) return true;

    // Compatible types
    const compatibilityMap: Record<string, string[]> = {
      number: ["number", "bigint"],
      string: ["string"],
      boolean: ["boolean"],
      array: ["array", "object"],
      function: ["function", "object"],
      object: ["object", "array", "date", "regexp", "map", "set"],
    };

    return compatibilityMap[expectedType]?.includes(actualType) || false;
  }
}
```

---

## Type Coercion Deep Dive / Tìm Hiểu Sâu Type Coercion

### Abstract Operations / Các Thao Tác Trừu Tượng

**English:** JavaScript uses abstract operations defined in the ECMAScript specification for type conversion.

**Tiếng Việt:** JavaScript sử dụng các thao tác trừu tượng được định nghĩa trong đặc tả ECMAScript cho chuyển đổi kiểu.

```typescript
// Implementation of ECMAScript abstract operations
// Triển khai các thao tác trừu tượng ECMAScript

class AbstractOperations {
  // ToPrimitive(input, preferredType)
  // Chuyển đổi sang kiểu nguyên thủy
  static toPrimitive(input: any, preferredType?: "string" | "number"): any {
    // If already primitive, return as-is
    if (TypeSystem.isPrimitive(input)) {
      return input;
    }

    // Determine hint
    const hint = preferredType || "default";

    // Try Symbol.toPrimitive first
    if (Symbol.toPrimitive in input) {
      const result = input[Symbol.toPrimitive](hint);
      if (TypeSystem.isPrimitive(result)) {
        return result;
      }
      throw new TypeError("Cannot convert object to primitive value");
    }

    // Use OrdinaryToPrimitive
    return this.ordinaryToPrimitive(input, hint === "string" ? "string" : "number");
  }

  private static ordinaryToPrimitive(input: any, hint: "string" | "number"): any {
    const methodNames = hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];

    for (const name of methodNames) {
      const method = input[name];
      if (typeof method === "function") {
        const result = method.call(input);
        if (TypeSystem.isPrimitive(result)) {
          return result;
        }
      }
    }

    throw new TypeError("Cannot convert object to primitive value");
  }

  // ToBoolean(argument)
  // Chuyển đổi sang boolean
  static toBoolean(argument: any): boolean {
    // Falsy values
    if (
      argument === false ||
      argument === 0 ||
      argument === -0 ||
      argument === 0n ||
      argument === "" ||
      argument === null ||
      argument === undefined ||
      Number.isNaN(argument)
    ) {
      return false;
    }

    // Everything else is truthy
    return true;
  }

  // ToNumber(argument)
  // Chuyển đổi sang number
  static toNumber(argument: any): number {
    // Primitive types
    if (argument === undefined) return NaN;
    if (argument === null) return 0;
    if (typeof argument === "boolean") return argument ? 1 : 0;
    if (typeof argument === "number") return argument;
    if (typeof argument === "bigint") throw new TypeError("Cannot convert BigInt to number");
    if (typeof argument === "symbol") throw new TypeError("Cannot convert Symbol to number");

    if (typeof argument === "string") {
      return this.stringToNumber(argument);
    }

    // Object types
    const primValue = this.toPrimitive(argument, "number");
    return this.toNumber(primValue);
  }

  private static stringToNumber(str: string): number {
    // Trim whitespace
    str = str.trim();

    // Empty string
    if (str === "") return 0;

    // Infinity
    if (str === "Infinity" || str === "+Infinity") return Infinity;
    if (str === "-Infinity") return -Infinity;

    // Hex, octal, binary
    if (str.startsWith("0x") || str.startsWith("0X")) {
      return parseInt(str, 16);
    }
    if (str.startsWith("0o") || str.startsWith("0O")) {
      return parseInt(str, 8);
    }
    if (str.startsWith("0b") || str.startsWith("0B")) {
      return parseInt(str, 2);
    }

    // Parse as decimal
    const num = parseFloat(str);
    return num;
  }

  // ToString(argument)
  // Chuyển đổi sang string
  static toString(argument: any): string {
    // Primitive types
    if (argument === undefined) return "undefined";
    if (argument === null) return "null";
    if (typeof argument === "boolean") return argument ? "true" : "false";
    if (typeof argument === "string") return argument;
    if (typeof argument === "symbol") throw new TypeError("Cannot convert Symbol to string");

    if (typeof argument === "number") {
      return this.numberToString(argument);
    }

    if (typeof argument === "bigint") {
      return argument.toString();
    }

    // Object types
    const primValue = this.toPrimitive(argument, "string");
    return this.toString(primValue);
  }

  private static numberToString(num: number): string {
    if (Number.isNaN(num)) return "NaN";
    if (num === 0) return "0";
    if (num === Infinity) return "Infinity";
    if (num === -Infinity) return "-Infinity";

    return String(num);
  }

  // ToObject(argument)
  // Chuyển đổi sang object
  static toObject(argument: any): object {
    if (argument === null || argument === undefined) {
      throw new TypeError("Cannot convert null or undefined to object");
    }

    // Already an object
    if (typeof argument === "object") {
      return argument;
    }

    // Wrap primitives
    if (typeof argument === "boolean") return new Boolean(argument);
    if (typeof argument === "number") return new Number(argument);
    if (typeof argument === "string") return new String(argument);
    if (typeof argument === "bigint") return Object(argument);
    if (typeof argument === "symbol") return Object(argument);

    return argument;
  }

  // ToPropertyKey(argument)
  // Chuyển đổi sang property key
  static toPropertyKey(argument: any): string | symbol {
    const key = this.toPrimitive(argument, "string");

    if (typeof key === "symbol") {
      return key;
    }

    return this.toString(key);
  }

  // ToLength(argument)
  // Chuyển đổi sang length (for arrays)
  static toLength(argument: any): number {
    const len = this.toInteger(argument);

    if (len <= 0) return 0;

    // Maximum array length
    return Math.min(len, Number.MAX_SAFE_INTEGER);
  }

  // ToInteger(argument)
  // Chuyển đổi sang integer
  static toInteger(argument: any): number {
    const number = this.toNumber(argument);

    if (Number.isNaN(number)) return 0;
    if (number === 0 || !Number.isFinite(number)) return number;

    return Math.trunc(number);
  }

  // ToInt32(argument)
  // Chuyển đổi sang 32-bit signed integer
  static toInt32(argument: any): number {
    const number = this.toNumber(argument);

    if (!Number.isFinite(number) || number === 0) return 0;

    const int = Math.trunc(number);
    const int32bit = int % 2 ** 32;

    if (int32bit >= 2 ** 31) {
      return int32bit - 2 ** 32;
    }

    return int32bit;
  }

  // ToUint32(argument)
  // Chuyển đổi sang 32-bit unsigned integer
  static toUint32(argument: any): number {
    const number = this.toNumber(argument);

    if (!Number.isFinite(number) || number === 0) return 0;

    const int = Math.trunc(number);
    return int % 2 ** 32;
  }
}
```

---

## Type Coercion Rules / Quy Tắc Chuyển Đổi Kiểu

### Equality Comparison / So Sánh Bằng

**English:** JavaScript has complex rules for equality comparison with type coercion.

**Tiếng Việt:** JavaScript có quy tắc phức tạp cho so sánh bằng với chuyển đổi kiểu.

```typescript
// Equality comparison algorithms
// Thuật toán so sánh bằng

class EqualityComparison {
  // Abstract Equality Comparison (==)
  // So sánh bằng trừu tượng (==)
  static abstractEquals(x: any, y: any): boolean {
    // 1. If Type(x) is the same as Type(y)
    if (typeof x === typeof y) {
      return this.strictEquals(x, y);
    }

    // 2. null == undefined
    if ((x === null && y === undefined) || (x === undefined && y === null)) {
      return true;
    }

    // 3. Number == String
    if (typeof x === "number" && typeof y === "string") {
      return this.abstractEquals(x, AbstractOperations.toNumber(y));
    }
    if (typeof x === "string" && typeof y === "number") {
      return this.abstractEquals(AbstractOperations.toNumber(x), y);
    }

    // 4. BigInt == String
    if (typeof x === "bigint" && typeof y === "string") {
      try {
        return x === BigInt(y);
      } catch {
        return false;
      }
    }
    if (typeof x === "string" && typeof y === "bigint") {
      try {
        return BigInt(x) === y;
      } catch {
        return false;
      }
    }

    // 5. Boolean == any
    if (typeof x === "boolean") {
      return this.abstractEquals(AbstractOperations.toNumber(x), y);
    }
    if (typeof y === "boolean") {
      return this.abstractEquals(x, AbstractOperations.toNumber(y));
    }

    // 6. (String | Number | BigInt | Symbol) == Object
    if (
      (typeof x === "string" ||
        typeof x === "number" ||
        typeof x === "bigint" ||
        typeof x === "symbol") &&
      typeof y === "object" &&
      y !== null
    ) {
      return this.abstractEquals(x, AbstractOperations.toPrimitive(y));
    }
    if (
      typeof x === "object" &&
      x !== null &&
      (typeof y === "string" ||
        typeof y === "number" ||
        typeof y === "bigint" ||
        typeof y === "symbol")
    ) {
      return this.abstractEquals(AbstractOperations.toPrimitive(x), y);
    }

    // 7. BigInt == Number
    if (
      (typeof x === "bigint" && typeof y === "number") ||
      (typeof x === "number" && typeof y === "bigint")
    ) {
      if (Number.isNaN(x) || Number.isNaN(y)) return false;
      if (!Number.isFinite(x as number)) return false;

      // Compare mathematically
      return Number(x) === Number(y);
    }

    return false;
  }

  // Strict Equality Comparison (===)
  // So sánh bằng nghiêm ngặt (===)
  static strictEquals(x: any, y: any): boolean {
    // 1. Different types
    if (typeof x !== typeof y) {
      return false;
    }

    // 2. Number type
    if (typeof x === "number") {
      // NaN !== NaN
      if (Number.isNaN(x) || Number.isNaN(y)) {
        return false;
      }

      // +0 === -0
      if (x === 0 && y === 0) {
        return true;
      }

      return x === y;
    }

    // 3. Other types use SameValueNonNumber
    return x === y;
  }

  // SameValue(x, y) - Used by Object.is()
  // SameValue(x, y) - Được sử dụng bởi Object.is()
  static sameValue(x: any, y: any): boolean {
    // 1. Different types
    if (typeof x !== typeof y) {
      return false;
    }

    // 2. Number type
    if (typeof x === "number") {
      // NaN === NaN
      if (Number.isNaN(x) && Number.isNaN(y)) {
        return true;
      }

      // +0 !== -0
      if (x === 0 && y === 0) {
        return 1 / x === 1 / y;
      }

      return x === y;
    }

    // 3. Other types
    return x === y;
  }

  // SameValueZero(x, y) - Used by Map, Set
  // SameValueZero(x, y) - Được sử dụng bởi Map, Set
  static sameValueZero(x: any, y: any): boolean {
    // Same as SameValue except +0 === -0
    if (typeof x === "number" && typeof y === "number") {
      if (Number.isNaN(x) && Number.isNaN(y)) {
        return true;
      }
      return x === y;
    }

    return this.sameValue(x, y);
  }
}
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: Why does `typeof null === 'object'` and why hasn't it been fixed? 🟢 Junior

**A:** Historical bug from 1995. The original JavaScript engine stored values as 32-bit words where the low 3 bits were a type tag. `null` was the null pointer (all zeros). The Object type tag was `000`. `typeof null` read those 3 bits, saw `000`, and returned `'object'`. By the time this was recognized as a bug, breaking the web to fix it was deemed worse than the bug itself — billions of `if (typeof x === 'object' && x !== null)` patterns would break. Now it's forever in the spec as "historical bug retained for compatibility."

Đây là lỗi lịch sử từ 1995 khi `null` (con trỏ null, all bits zero) trùng với Object type tag (`000`). Không thể fix vì sẽ phá vỡ hàng tỷ trang web đã check `typeof x === 'object'`.

**💡 Interview Signal:**

- ✅ Strong: Explains the 32-bit tag bits mechanism, the null pointer collision, why backward compat prevents fixing
- ❌ Weak: "It's a bug in JavaScript" — without the 'why' mechanism, shows no spec depth

---

### Q: What's the difference between `isNaN()` and `Number.isNaN()`? 🟢 Junior

**A:** Global `isNaN(value)` first converts `value` to a number via `ToNumber`, THEN checks if it's NaN. So `isNaN("hello") === true` because `ToNumber("hello") === NaN`. `Number.isNaN(value)` does NOT coerce — it only returns `true` if `value` is already of type Number and is the NaN value. `Number.isNaN("hello") === false`. Use `Number.isNaN` for reliable NaN detection; only use global `isNaN` if you specifically want coercion.

`isNaN()` coerce trước rồi mới check — `isNaN("hello") === true`. `Number.isNaN()` không coerce — chỉ `true` cho actual NaN value. Dùng `Number.isNaN` trong production.

**💡 Interview Signal:**

- ✅ Strong: Explains the ToNumber coercion in global isNaN, gives string example, recommends Number.isNaN
- ❌ Weak: "Number.isNaN is newer and safer" — correct but no explanation of the coercion difference

---

### Q: How would you reliably check if something is an array across different execution contexts (iframes)? 🟡 Mid

**A:** `Array.isArray(value)`. Not `value instanceof Array` — `instanceof` checks the prototype chain, and `Array` from iframe A has a different `Array.prototype` than `Array` from the main frame. `frameArray instanceof Array` → `false` even though it clearly is an array. `Array.isArray` reads the internal `[[IsArray]]` slot which is set by the spec during array construction — it works across realms. For general type introspection: `Object.prototype.toString.call(value)` returns `'[object Array]'`, `'[object Date]'`, etc. — reliable across all contexts.

`instanceof Array` fails cross-frame vì mỗi frame có `Array.prototype` khác nhau. `Array.isArray` đọc internal `[[IsArray]]` slot — reliable across realms. `Object.prototype.toString.call` cho introspection chi tiết.

**💡 Interview Signal:**

- ✅ Strong: Names the cross-realm failure mode of `instanceof`, explains `[[IsArray]]` internal slot, mentions `Object.prototype.toString` for general introspection
- ❌ Weak: "Use Array.isArray" without explaining why instanceof is insufficient

---

### Q: V8 stores small integers differently from floats — why does this matter for performance? 🔴 Senior

**A:** V8 uses a tagged pointer system. Small integers (≤ 2^30-1, called SMIs) are stored inline in the pointer word itself — zero heap allocation. Floating-point numbers require a HeapNumber object on the heap. This means: (1) `i++` in an integer loop has no heap cost; (2) mixing floats into an integer array forces V8 to transition from `PACKED_SMI_ELEMENTS` to `PACKED_DOUBLE_ELEMENTS` — a backing store reallocation that can't be reversed. For hot loops processing numeric data, keeping arrays homogeneous (all integers or all floats) avoids these transitions. The same mechanism explains why V8's hidden classes deoptimize when you add properties in non-uniform order.

V8 SMI (small integer) được lưu inline trong pointer — zero heap allocation. Float → HeapNumber trên heap. Trong hot loops: array `[1,2,3]` với một `push(3.14)` trigger backing store reallocation (`PACKED_SMI_ELEMENTS` → `PACKED_DOUBLE_ELEMENTS`). Giữ array types homogeneous trong performance-critical code.

**💡 Interview Signal:**

- ✅ Strong: Explains SMI/HeapNumber distinction, element kind transitions, connects to practical loop optimization
- ❌ Weak: "Use typed arrays for performance" — correct optimization but doesn't explain the V8 type representation reason

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                      | Level | One-liner                                                                       |
| --- | -------------------------- | ----- | ------------------------------------------------------------------------------- |
| 1   | `typeof null === 'object'` | 🟢    | 32-bit tag bits: null pointer (0x000) collided with Object tag — historical bug |
| 2   | `isNaN` vs `Number.isNaN`  | 🟢    | Global `isNaN` coerces first; `Number.isNaN` doesn't — always use Number.isNaN  |
| 3   | Cross-realm array check    | 🟡    | `instanceof` breaks across iframes; `Array.isArray` uses `[[IsArray]]` slot     |
| 4   | SMI vs HeapNumber          | 🔴    | SMI = inline integer (free); HeapNumber = heap float (allocation cost)          |

---

## ⚡ Cold Call Simulation

**Q: "Why should you use `Number.isNaN` instead of the global `isNaN`?"**

**30-second answer:**

"The global `isNaN` function first converts the argument to a number using the ToNumber abstract operation, then checks if the result is NaN. So `isNaN('hello')` returns `true` — not because `'hello'` is NaN, but because `ToNumber('hello')` is NaN. This gives false positives for any non-numeric string. `Number.isNaN` is a strict check: it returns `true` only if the value is already of Number type and is specifically the NaN value. `Number.isNaN('hello')` returns `false`. The same distinction applies to `isFinite` vs `Number.isFinite`. When validating numbers in production code, always use the Number-namespaced versions to avoid the coercion trap."

---

## Self-Check / Tự Kiểm Tra

> **Close this doc. Then answer from memory.**

- **Retrieval**: Why does `typeof null === 'object'`? Name the original cause and why it hasn't been fixed.
- **Visual**: Draw the V8 type representation — what's an SMI? What's a HeapNumber? When does V8 allocate on the heap?
- **Application**: You need to check if a value is a valid finite number (not NaN, not Infinity). Write the check.
- **Debug**: `isNaN(userInput)` returns `true` even though `userInput = "123abc"`. Is that correct? How do you fix the validation?
- **Teach**: Explain to a junior dev why `typeof value === 'object' && value !== null` is the correct "is this an object?" check — 2 sentences.

> 🎯 **Feynman Prompt:** Giải thích cho designer: tại sao `typeof null === "object"` là một bug 30 năm tuổi chưa được sửa — và Symbol cùng BigInt ra đời để giải quyết vấn đề gì mà các kiểu dữ liệu cũ không làm được?

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

## Connections / Liên Kết

- ⬅️ **Built on**: [JavaScript Basics Theory](./13-javascript-basics-theory.md) — Abstract Operations (ToPrimitive, ToNumber, Abstract Equality)
- ⬅️ **Built on**: [Variables & Data Types](./01-variables-data-types.md) — practical type usage
- 🔗 **Applied in**: [TypeScript Type System](../02-typescript/01-type-system-basics.md) — TypeScript's type narrowing builds on typeof/instanceof/Array.isArray
- 🔗 **Applied in**: [Memory Management](./15-memory-management-advanced.md) — SMI/HeapNumber connects to GC and memory optimization

[← Previous: JavaScript Basics Theory](./13-javascript-basics-theory.md) | [Next: Memory Management →](./15-memory-management-advanced.md) | [Back to Table of Contents](../../00-table-of-contents.md)
