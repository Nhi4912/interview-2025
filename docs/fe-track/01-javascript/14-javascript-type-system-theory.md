# JavaScript Type System - Advanced Theory / Hệ Thống Kiểu JavaScript - Lý Thuyết Nâng Cao


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Table of Contents / Mục Lục

1. [Type System Fundamentals](#type-system-fundamentals)
2. [Dynamic Typing Theory](#dynamic-typing-theory)
3. [Type Coercion Deep Dive](#type-coercion-deep-dive)
4. [Abstract Operations](#abstract-operations)
5. [Type Checking Algorithms](#type-checking-algorithms)
6. [Memory Representation](#memory-representation)
7. [Interview Questions](#interview-questions)

---

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
  Object = 7
}

enum TypeFlags {
  None = 0,
  Primitive = 1 << 0,
  Object = 1 << 1,
  Callable = 1 << 2,
  Constructable = 1 << 3,
  Iterable = 1 << 4,
  AsyncIterable = 1 << 5
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
      case 'boolean': return JSType.Boolean;
      case 'number': return JSType.Number;
      case 'bigint': return JSType.BigInt;
      case 'string': return JSType.String;
      case 'symbol': return JSType.Symbol;
      case 'object': return JSType.Object;
      case 'function': return JSType.Object; // Functions are objects
      default: return JSType.Undefined;
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
    return value !== null && (typeof value === 'object' || typeof value === 'function');
  }
  
  // Check if value is callable
  // Kiểm tra nếu giá trị có thể gọi
  static isCallable(value: any): boolean {
    return typeof value === 'function';
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
    return typeof value === 'string';
  }
  
  static isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
  }
  
  static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
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
    return typeof value === 'symbol';
  }
  
  static isBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint';
  }
  
  static isArray(value: unknown): value is any[] {
    return Array.isArray(value);
  }
  
  static isFunction(value: unknown): value is Function {
    return typeof value === 'function';
  }
  
  static isObject(value: unknown): value is object {
    return value !== null && typeof value === 'object';
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
    return value instanceof Promise || 
           (this.isObject(value) && 'then' in value && this.isFunction((value as any).then));
  }
  
  static isIterable(value: unknown): value is Iterable<any> {
    return value != null && typeof (value as any)[Symbol.iterator] === 'function';
  }
  
  static isAsyncIterable(value: unknown): value is AsyncIterable<any> {
    return value != null && typeof (value as any)[Symbol.asyncIterator] === 'function';
  }
  
  // Advanced type checking
  // Kiểm tra kiểu nâng cao
  
  static getDetailedType(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    const type = typeof value;
    
    if (type === 'object') {
      if (Array.isArray(value)) return 'array';
      if (value instanceof Date) return 'date';
      if (value instanceof RegExp) return 'regexp';
      if (value instanceof Map) return 'map';
      if (value instanceof Set) return 'set';
      if (value instanceof WeakMap) return 'weakmap';
      if (value instanceof WeakSet) return 'weakset';
      if (value instanceof Promise) return 'promise';
      if (value instanceof Error) return 'error';
      
      // Check for typed arrays
      if (ArrayBuffer.isView(value)) {
        return value.constructor.name.toLowerCase();
      }
      
      return 'object';
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
      'number': ['number', 'bigint'],
      'string': ['string'],
      'boolean': ['boolean'],
      'array': ['array', 'object'],
      'function': ['function', 'object'],
      'object': ['object', 'array', 'date', 'regexp', 'map', 'set']
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
  static toPrimitive(input: any, preferredType?: 'string' | 'number'): any {
    // If already primitive, return as-is
    if (TypeSystem.isPrimitive(input)) {
      return input;
    }
    
    // Determine hint
    const hint = preferredType || 'default';
    
    // Try Symbol.toPrimitive first
    if (Symbol.toPrimitive in input) {
      const result = input[Symbol.toPrimitive](hint);
      if (TypeSystem.isPrimitive(result)) {
        return result;
      }
      throw new TypeError('Cannot convert object to primitive value');
    }
    
    // Use OrdinaryToPrimitive
    return this.ordinaryToPrimitive(input, hint === 'string' ? 'string' : 'number');
  }
  
  private static ordinaryToPrimitive(input: any, hint: 'string' | 'number'): any {
    const methodNames = hint === 'string' 
      ? ['toString', 'valueOf']
      : ['valueOf', 'toString'];
    
    for (const name of methodNames) {
      const method = input[name];
      if (typeof method === 'function') {
        const result = method.call(input);
        if (TypeSystem.isPrimitive(result)) {
          return result;
        }
      }
    }
    
    throw new TypeError('Cannot convert object to primitive value');
  }
  
  // ToBoolean(argument)
  // Chuyển đổi sang boolean
  static toBoolean(argument: any): boolean {
    // Falsy values
    if (argument === false ||
        argument === 0 ||
        argument === -0 ||
        argument === 0n ||
        argument === '' ||
        argument === null ||
        argument === undefined ||
        Number.isNaN(argument)) {
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
    if (typeof argument === 'boolean') return argument ? 1 : 0;
    if (typeof argument === 'number') return argument;
    if (typeof argument === 'bigint') throw new TypeError('Cannot convert BigInt to number');
    if (typeof argument === 'symbol') throw new TypeError('Cannot convert Symbol to number');
    
    if (typeof argument === 'string') {
      return this.stringToNumber(argument);
    }
    
    // Object types
    const primValue = this.toPrimitive(argument, 'number');
    return this.toNumber(primValue);
  }
  
  private static stringToNumber(str: string): number {
    // Trim whitespace
    str = str.trim();
    
    // Empty string
    if (str === '') return 0;
    
    // Infinity
    if (str === 'Infinity' || str === '+Infinity') return Infinity;
    if (str === '-Infinity') return -Infinity;
    
    // Hex, octal, binary
    if (str.startsWith('0x') || str.startsWith('0X')) {
      return parseInt(str, 16);
    }
    if (str.startsWith('0o') || str.startsWith('0O')) {
      return parseInt(str, 8);
    }
    if (str.startsWith('0b') || str.startsWith('0B')) {
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
    if (argument === undefined) return 'undefined';
    if (argument === null) return 'null';
    if (typeof argument === 'boolean') return argument ? 'true' : 'false';
    if (typeof argument === 'string') return argument;
    if (typeof argument === 'symbol') throw new TypeError('Cannot convert Symbol to string');
    
    if (typeof argument === 'number') {
      return this.numberToString(argument);
    }
    
    if (typeof argument === 'bigint') {
      return argument.toString();
    }
    
    // Object types
    const primValue = this.toPrimitive(argument, 'string');
    return this.toString(primValue);
  }
  
  private static numberToString(num: number): string {
    if (Number.isNaN(num)) return 'NaN';
    if (num === 0) return '0';
    if (num === Infinity) return 'Infinity';
    if (num === -Infinity) return '-Infinity';
    
    return String(num);
  }
  
  // ToObject(argument)
  // Chuyển đổi sang object
  static toObject(argument: any): object {
    if (argument === null || argument === undefined) {
      throw new TypeError('Cannot convert null or undefined to object');
    }
    
    // Already an object
    if (typeof argument === 'object') {
      return argument;
    }
    
    // Wrap primitives
    if (typeof argument === 'boolean') return new Boolean(argument);
    if (typeof argument === 'number') return new Number(argument);
    if (typeof argument === 'string') return new String(argument);
    if (typeof argument === 'bigint') return Object(argument);
    if (typeof argument === 'symbol') return Object(argument);
    
    return argument;
  }
  
  // ToPropertyKey(argument)
  // Chuyển đổi sang property key
  static toPropertyKey(argument: any): string | symbol {
    const key = this.toPrimitive(argument, 'string');
    
    if (typeof key === 'symbol') {
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
    const int32bit = int % (2 ** 32);
    
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
    return int % (2 ** 32);
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
    if (typeof x === 'number' && typeof y === 'string') {
      return this.abstractEquals(x, AbstractOperations.toNumber(y));
    }
    if (typeof x === 'string' && typeof y === 'number') {
      return this.abstractEquals(AbstractOperations.toNumber(x), y);
    }
    
    // 4. BigInt == String
    if (typeof x === 'bigint' && typeof y === 'string') {
      try {
        return x === BigInt(y);
      } catch {
        return false;
      }
    }
    if (typeof x === 'string' && typeof y === 'bigint') {
      try {
        return BigInt(x) === y;
      } catch {
        return false;
      }
    }
    
    // 5. Boolean == any
    if (typeof x === 'boolean') {
      return this.abstractEquals(AbstractOperations.toNumber(x), y);
    }
    if (typeof y === 'boolean') {
      return this.abstractEquals(x, AbstractOperations.toNumber(y));
    }
    
    // 6. (String | Number | BigInt | Symbol) == Object
    if ((typeof x === 'string' || typeof x === 'number' || 
         typeof x === 'bigint' || typeof x === 'symbol') &&
        typeof y === 'object' && y !== null) {
      return this.abstractEquals(x, AbstractOperations.toPrimitive(y));
    }
    if (typeof x === 'object' && x !== null &&
        (typeof y === 'string' || typeof y === 'number' || 
         typeof y === 'bigint' || typeof y === 'symbol')) {
      return this.abstractEquals(AbstractOperations.toPrimitive(x), y);
    }
    
    // 7. BigInt == Number
    if ((typeof x === 'bigint' && typeof y === 'number') ||
        (typeof x === 'number' && typeof y === 'bigint')) {
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
    if (typeof x === 'number') {
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
    if (typeof x === 'number') {
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
    if (typeof x === 'number' && typeof y === 'number') {
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

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Q1: Explain the difference between == and ===

**English Answer:**

`==` (Abstract Equality) performs type coercion before comparison:
- Converts operands to the same type
- Follows complex coercion rules
- `null == undefined` is `true`
- `0 == '0'` is `true`

`===` (Strict Equality) does NOT perform type coercion:
- Requires same type and value
- More predictable behavior
- Recommended for most cases

**Special Cases:**
```javascript
// NaN
NaN === NaN // false
Object.is(NaN, NaN) // true

// +0 and -0
+0 === -0 // true
Object.is(+0, -0) // false
```

**Tiếng Việt:**

`==` thực hiện chuyển đổi kiểu trước khi so sánh, trong khi `===` không chuyển đổi kiểu.

### 🔴 [Senior] Q2: How does type coercion work in JavaScript?

**English Answer:**

Type coercion uses abstract operations:

1. **ToPrimitive**: Converts objects to primitives
   - Calls `Symbol.toPrimitive` if exists
   - Otherwise calls `valueOf()` then `toString()`

2. **ToNumber**: Converts to number
   - `undefined` → `NaN`
   - `null` → `0`
   - `true` → `1`, `false` → `0`
   - Strings parsed as numbers

3. **ToString**: Converts to string
   - Primitives converted directly
   - Objects call `toString()` method

4. **ToBoolean**: Converts to boolean
   - Falsy: `false`, `0`, `''`, `null`, `undefined`, `NaN`
   - Everything else is truthy

**Tiếng Việt:**

Chuyển đổi kiểu sử dụng các thao tác trừu tượng như ToPrimitive, ToNumber, ToString, ToBoolean.

---

## Summary / Tóm Tắt

**Key Concepts:**
1. JavaScript uses dynamic, weak typing
2. Type coercion follows ECMAScript abstract operations
3. Multiple equality algorithms (==, ===, Object.is)
4. Understanding type system crucial for avoiding bugs
5. Prefer strict equality (===) for predictable behavior

---

[← Previous: JavaScript Basics Theory](./13-javascript-basics-theory.md) | [Next: Memory Management →](./15-memory-management-advanced.md) | [Back to Table of Contents](../../00-table-of-contents.md)
