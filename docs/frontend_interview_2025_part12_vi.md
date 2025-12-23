# 📚 Tài Liệu Phỏng Vấn Frontend 2025 - Phần 12

> **Chủ đề**: 📋 CHEAT SHEET TỔNG HỢP - Quick Reference

---

## 🎯 Mục Đích

Tài liệu này tóm tắt **TẤT CẢ** kiến thức từ 11 phần trước thành các bảng tra cứu nhanh. Dùng để:

- Ôn tập nhanh trước phỏng vấn
- Tra cứu khi cần
- In ra làm flash cards

---

## 📋 Mục Lục Nhanh

1. [JavaScript Core](#1-javascript-core)
2. [React Essentials](#2-react-essentials)
3. [TypeScript Quick Ref](#3-typescript-quick-ref)
4. [CSS/HTML](#4-csshtml)
5. [Web APIs](#5-web-apis)
6. [Performance](#6-performance)
7. [Security](#7-security)
8. [Testing](#8-testing)
9. [Git Commands](#9-git-commands)
10. [Interview Formulas](#10-interview-formulas)

---

## 1. JavaScript Core

### 1.1 var vs let vs const

| Feature    | var             | let       | const     |
| ---------- | --------------- | --------- | --------- |
| Scope      | Function        | Block     | Block     |
| Hoisting   | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Re-declare | ✅              | ❌        | ❌        |
| Re-assign  | ✅              | ✅        | ❌        |

### 1.2 Data Types

```
Primitive: string, number, boolean, null, undefined, symbol, bigint
Reference: object, array, function
```

### 1.3 Truthy/Falsy

```
Falsy: false, 0, "", null, undefined, NaN
Truthy: Everything else (including [], {}, "0")
```

### 1.4 == vs ===

```javascript
== : Type coercion (1 == "1" → true)
===: Strict equality (1 === "1" → false)
```

### 1.5 Event Loop Order

```
1. Sync code (Call Stack)
2. Microtasks (Promise.then, queueMicrotask)
3. Macrotasks (setTimeout, setInterval)
4. Render (if needed)
```

### 1.6 this Keyword

| Context         | this =                      |
| --------------- | --------------------------- |
| Global          | window / undefined (strict) |
| Object method   | Object                      |
| Arrow function  | Lexical (parent)            |
| new             | New instance                |
| call/apply/bind | First argument              |
| Event handler   | Event target                |

### 1.7 Closure

```javascript
// Function + Lexical Environment
function outer(x) {
  return function inner(y) {
    return x + y; // x is remembered
  };
}
const add5 = outer(5);
add5(3); // 8
```

### 1.8 Prototype Chain

```
obj → Object.prototype → null
arr → Array.prototype → Object.prototype → null
fn → Function.prototype → Object.prototype → null
```

### 1.9 Array Methods

| Method        | Changes Original? | Returns       |
| ------------- | ----------------- | ------------- |
| push/pop      | ✅                | length/item   |
| shift/unshift | ✅                | item/length   |
| splice        | ✅                | removed items |
| slice         | ❌                | new array     |
| map           | ❌                | new array     |
| filter        | ❌                | new array     |
| reduce        | ❌                | single value  |
| sort          | ✅                | sorted array  |

### 1.10 Spread/Rest

```javascript
// Spread: Expand
const arr2 = [...arr1, 4];
const obj2 = { ...obj1, b: 2 };

// Rest: Collect
function sum(...nums) {}
const { a, ...rest } = obj;
```

---

## 2. React Essentials

### 2.1 Hooks Rules

```
1. Only call at top level (not in loops/conditions)
2. Only call in React functions
3. Same order every render
```

### 2.2 Common Hooks

| Hook        | Purpose                 |
| ----------- | ----------------------- |
| useState    | Local state             |
| useEffect   | Side effects, lifecycle |
| useContext  | Consume context         |
| useRef      | Mutable ref, DOM access |
| useMemo     | Memoize value           |
| useCallback | Memoize function        |
| useReducer  | Complex state logic     |

### 2.3 useEffect Deps

```javascript
useEffect(() => {}, []); // Mount only
useEffect(() => {}, [dep]); // When dep changes
useEffect(() => {}); // Every render ⚠️
useEffect(() => {
  return () => {}; // Cleanup
}, []);
```

### 2.4 Performance

```javascript
// Prevent re-render
React.memo(Component); // Props unchanged
useMemo(() => value, [deps]); // Expensive calculation
useCallback(() => fn, [deps]); // Stable function reference
```

### 2.5 State Management

| Use Case       | Solution         |
| -------------- | ---------------- |
| Local          | useState         |
| Complex local  | useReducer       |
| Prop drilling  | Context          |
| Global simple  | Zustand, Jotai   |
| Global complex | Redux Toolkit    |
| Server state   | React Query, SWR |

### 2.6 Component Patterns

```javascript
// Controlled
<input value={state} onChange={setState} />

// Uncontrolled
<input ref={inputRef} defaultValue="init" />

// Render Props
<DataProvider render={data => <View data={data} />} />

// Compound Components
<Tabs>
  <Tab>...</Tab>
  <Tab>...</Tab>
</Tabs>
```

---

## 3. TypeScript Quick Ref

### 3.1 Basic Types

```typescript
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let arr: number[] = [1, 2, 3];
let tuple: [string, number] = ["a", 1];
let obj: { name: string } = { name: "John" };
```

### 3.2 Interface vs Type

```typescript
// Interface - Extendable
interface User {
  name: string;
  age?: number; // Optional
}
interface Admin extends User {
  role: string;
}

// Type - More flexible
type Status = "active" | "inactive"; // Union
type Point = { x: number; y: number };
type Combined = User & { id: number }; // Intersection
```

### 3.3 Generics

```typescript
function identity<T>(arg: T): T {
  return arg;
}
interface Response<T> {
  data: T;
  status: number;
}
```

### 3.4 Utility Types

| Type           | Usage            |
| -------------- | ---------------- |
| `Partial<T>`   | All optional     |
| `Required<T>`  | All required     |
| `Pick<T, K>`   | Select keys      |
| `Omit<T, K>`   | Exclude keys     |
| `Record<K, V>` | Key-value object |
| `Readonly<T>`  | All readonly     |

---

## 4. CSS/HTML

### 4.1 Box Model

```
┌─────── margin ───────┐
│ ┌──── border ────┐   │
│ │ ┌─ padding ─┐  │   │
│ │ │  content  │  │   │
│ │ └───────────┘  │   │
│ └────────────────┘   │
└──────────────────────┘
```

### 4.2 Flexbox

```css
.container {
  display: flex;
  flex-direction: row | column;
  justify-content: center; /* main axis */
  align-items: center; /* cross axis */
  gap: 1rem;
}
.item {
  flex: 1; /* grow shrink basis */
}
```

### 4.3 Grid

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

### 4.4 Specificity

```
Inline:     1,0,0,0
ID:         0,1,0,0
Class:      0,0,1,0
Element:    0,0,0,1
```

### 4.5 Semantic HTML

```html
<header>
  <!-- Page/section header -->
  <nav>
    <!-- Navigation -->
    <main>
      <!-- Main content (once) -->
      <article>
        <!-- Self-contained content -->
        <section>
          <!-- Thematic grouping -->
          <aside>
            <!-- Sidebar -->
            <footer><!-- Page/section footer --></footer>
          </aside>
        </section>
      </article>
    </main>
  </nav>
</header>
```

---

## 5. Web APIs

### 5.1 Storage Comparison

| Feature    | localStorage | sessionStorage | IndexedDB | Cookies |
| ---------- | ------------ | -------------- | --------- | ------- |
| Size       | 5-10MB       | 5-10MB         | Unlimited | 4KB     |
| Lifetime   | Permanent    | Tab            | Permanent | Config  |
| Sync/Async | Sync         | Sync           | Async     | Sync    |
| Server     | No           | No             | No        | Auto    |

### 5.2 Fetch API

```javascript
// GET
const res = await fetch(url);
const data = await res.json();

// POST
await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

### 5.3 Common APIs

| API                   | Purpose                    |
| --------------------- | -------------------------- |
| Intersection Observer | Lazy load, infinite scroll |
| ResizeObserver        | Element size changes       |
| MutationObserver      | DOM changes                |
| Web Workers           | Background threads         |
| Service Workers       | Offline, caching           |
| WebSocket             | Real-time bidirectional    |

---

## 6. Performance

### 6.1 Core Web Vitals

| Metric | Target  | Measure                  |
| ------ | ------- | ------------------------ |
| LCP    | < 2.5s  | Largest Contentful Paint |
| FID    | < 100ms | First Input Delay        |
| CLS    | < 0.1   | Cumulative Layout Shift  |

### 6.2 Optimization Techniques

```
Images:    WebP, lazy loading, srcset
JS:        Code splitting, tree shaking
CSS:       Critical CSS, minify
Caching:   CDN, Service Worker
React:     memo, lazy, virtualization
Network:   HTTP/2, compression
```

### 6.3 Render Performance

```
Expensive: Layout (reflow) > Paint > Composite
Cheap:     transform, opacity (GPU)
```

---

## 7. Security

### 7.1 Common Threats

| Threat        | Prevention                    |
| ------------- | ----------------------------- |
| XSS           | Escape output, CSP            |
| CSRF          | CSRF tokens, SameSite cookies |
| SQL Injection | Parameterized queries         |
| Clickjacking  | X-Frame-Options               |

### 7.2 Secure Headers

```
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security
```

### 7.3 Cookie Security

```
Secure      → HTTPS only
HttpOnly    → No JS access
SameSite    → CSRF protection
```

---

## 8. Testing

### 8.1 Testing Pyramid

```
      E2E (5-10%)      ← Slow, expensive
   Integration (20%)   ← Medium
  Unit Tests (70%)     ← Fast, cheap
```

### 8.2 Testing Library

```javascript
// Render
render(<Component />);

// Query
screen.getByRole("button", { name: /submit/i });
screen.getByText("Hello");
screen.getByTestId("my-element");

// Events
await userEvent.click(button);
await userEvent.type(input, "text");

// Assert
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent("text");
```

### 8.3 Common Matchers

```javascript
expect(x).toBe(y); // ===
expect(x).toEqual(y); // Deep equal
expect(x).toBeTruthy();
expect(x).toBeNull();
expect(arr).toContain(item);
expect(fn).toHaveBeenCalled();
```

---

## 9. Git Commands

### 9.1 Daily Commands

```bash
git status                  # Check status
git add .                   # Stage all
git commit -m "message"     # Commit
git push origin main        # Push
git pull                    # Update
git checkout -b feature     # New branch
git merge feature           # Merge
```

### 9.2 Undo

```bash
git checkout -- file        # Discard changes
git reset HEAD file         # Unstage
git reset --soft HEAD~1     # Undo commit (keep)
git reset --hard HEAD~1     # Undo commit (discard)
git revert <commit>         # Reverse commit
```

### 9.3 Conventional Commits

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code change
test:     Tests
chore:    Maintenance
```

---

## 10. Interview Formulas

### 10.1 STAR Method

```
S - Situation: Context
T - Task: Your goal
A - Action: What you did
R - Result: Outcome + metrics
```

### 10.2 System Design Steps

```
1. Clarify requirements (2-3 min)
2. High-level design (5 min)
3. Component architecture (10 min)
4. Data flow & state (5 min)
5. Edge cases & optimization (5 min)
```

### 10.3 Coding Interview Steps

```
1. Clarify problem
2. Think of examples
3. Explain approach
4. Write code
5. Test with examples
6. Analyze complexity
```

### 10.4 Complexity Cheat Sheet

| O          | Name         | Example       |
| ---------- | ------------ | ------------- |
| O(1)       | Constant     | Array access  |
| O(log n)   | Logarithmic  | Binary search |
| O(n)       | Linear       | Loop          |
| O(n log n) | Linearithmic | Merge sort    |
| O(n²)      | Quadratic    | Nested loops  |

### 10.5 Questions to Ask Interviewer

```
1. What does a typical day look like?
2. What are the current challenges?
3. How is the team structured?
4. What's the tech stack?
5. How do you measure success?
```

---

## 📊 Master Checklist

```
✅ JavaScript
  □ Event Loop, Async
  □ Closures, Scope
  □ Prototypes, this
  □ ES6+ features

✅ React
  □ Hooks
  □ State management
  □ Performance
  □ Patterns

✅ TypeScript
  □ Types, Interfaces
  □ Generics
  □ Utility types

✅ CSS
  □ Flexbox, Grid
  □ Responsive
  □ Animations

✅ Web APIs
  □ Fetch, Storage
  □ Workers
  □ WebSocket

✅ Performance
  □ Core Web Vitals
  □ Optimization
  □ Rendering

✅ Security
  □ XSS, CSRF
  □ Headers
  □ HTTPS

✅ Testing
  □ Unit, Integration, E2E
  □ React Testing Library

✅ Tools
  □ Git
  □ Build tools
  □ DevTools

✅ Soft Skills
  □ STAR method
  □ Communication
  □ Problem solving
```

---

## 📱 One-Page Summary

```
┌─────────────────────────────────────────────┐
│           FRONTEND INTERVIEW 2025           │
├─────────────────────────────────────────────┤
│                                             │
│  JS: Event Loop → Microtask → Macrotask     │
│      Closure = Function + Environment       │
│      this: context-dependent                │
│                                             │
│  React: useState → useEffect → useRef       │
│         memo/useMemo/useCallback            │
│         React Query for server state        │
│                                             │
│  TS: interface (extend) vs type (union)     │
│      Generics: function<T>(arg: T): T       │
│                                             │
│  CSS: flex (1D) vs grid (2D)                │
│       Specificity: inline > id > class      │
│                                             │
│  Perf: LCP<2.5s, FID<100ms, CLS<0.1        │
│        transform/opacity = GPU optimized    │
│                                             │
│  Security: XSS→escape, CSRF→token           │
│            CSP, HttpOnly, SameSite          │
│                                             │
│  Test: 70% unit, 20% integration, 10% E2E  │
│                                             │
│  Interview: STAR + Think Aloud + Ask Qs    │
│                                             │
└─────────────────────────────────────────────┘
```

---

> **🎯 Tip cuối cùng**:
>
> - Học kiến thức qua 11 phần
> - Ôn tập nhanh qua cheat sheet này
> - Thực hành nhiều qua coding challenges
>
> **Chúc bạn phỏng vấn thành công! 🎉**
>
> _Tài liệu hoàn thành: 23/12/2025_
