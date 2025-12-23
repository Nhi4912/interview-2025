# 📚 Tài Liệu Phỏng Vấn Frontend 2025 - Phần 21

> **Chủ đề**: 🃏 QUICK REVIEW CARDS - Flashcards Ôn Tập Nhanh

_In ra hoặc dùng để ôn tập nhanh trước phỏng vấn_

---

## 🟦 JavaScript Cards

### Card 1: Event Loop

```
┌────────────────────────────────────┐
│  EVENT LOOP ORDER                  │
├────────────────────────────────────┤
│  1. Sync code (Call Stack)         │
│  2. Microtasks (Promise.then)      │
│  3. Macrotasks (setTimeout)        │
│  4. Render (if needed)             │
│  5. Repeat                         │
└────────────────────────────────────┘
```

### Card 2: Closure

```
┌────────────────────────────────────┐
│  CLOSURE                           │
├────────────────────────────────────┤
│  Function + Lexical Environment    │
│                                    │
│  function outer(x) {               │
│    return () => x; // x remembered │
│  }                                 │
└────────────────────────────────────┘
```

### Card 3: this Keyword

```
┌────────────────────────────────────┐
│  THIS KEYWORD                      │
├────────────────────────────────────┤
│  Global      → window/undefined    │
│  Method      → object              │
│  Arrow       → lexical (parent)    │
│  new         → new instance        │
│  call/bind   → first argument      │
└────────────────────────────────────┘
```

### Card 4: var vs let vs const

```
┌────────────────────────────────────┐
│  VAR vs LET vs CONST               │
├────────────────────────────────────┤
│        │ Scope   │ Hoist │ Redecl │
│  var   │ Func    │ Yes   │ Yes    │
│  let   │ Block   │ TDZ   │ No     │
│  const │ Block   │ TDZ   │ No     │
└────────────────────────────────────┘
```

### Card 5: Truthy/Falsy

```
┌────────────────────────────────────┐
│  FALSY VALUES (6)                  │
├────────────────────────────────────┤
│  false, 0, "", null,               │
│  undefined, NaN                    │
│                                    │
│  TRUTHY: Everything else           │
│  (including [], {}, "0")           │
└────────────────────────────────────┘
```

### Card 6: == vs ===

```
┌────────────────────────────────────┐
│  == vs ===                         │
├────────────────────────────────────┤
│  ==  : Type coercion               │
│        1 == "1" → true             │
│                                    │
│  === : Strict equality             │
│        1 === "1" → false           │
│                                    │
│  Best: Always use ===              │
└────────────────────────────────────┘
```

### Card 7: Promise States

```
┌────────────────────────────────────┐
│  PROMISE STATES                    │
├────────────────────────────────────┤
│  pending  → initial                │
│  fulfilled → resolved with value   │
│  rejected → rejected with error    │
│                                    │
│  Methods: .then(), .catch(),       │
│           .finally()               │
└────────────────────────────────────┘
```

### Card 8: Array Methods

```
┌────────────────────────────────────┐
│  COMMON ARRAY METHODS              │
├────────────────────────────────────┤
│  MUTATE:  push, pop, shift,        │
│           splice, sort, reverse    │
│                                    │
│  NEW ARR: map, filter, slice,      │
│           concat, flat             │
│                                    │
│  VALUE:   reduce, find, indexOf    │
└────────────────────────────────────┘
```

---

## 🟩 React Cards

### Card 9: Hooks Rules

```
┌────────────────────────────────────┐
│  HOOKS RULES                       │
├────────────────────────────────────┤
│  1. Only call at TOP LEVEL         │
│     (not in loops/conditions)      │
│                                    │
│  2. Only call in REACT FUNCTIONS   │
│                                    │
│  3. Same ORDER every render        │
└────────────────────────────────────┘
```

### Card 10: useEffect Dependencies

```
┌────────────────────────────────────┐
│  useEffect DEPENDENCIES            │
├────────────────────────────────────┤
│  useEffect(() => {})               │
│    → Run EVERY render              │
│                                    │
│  useEffect(() => {}, [])           │
│    → Run ONCE on mount             │
│                                    │
│  useEffect(() => {}, [dep])        │
│    → Run when dep CHANGES          │
└────────────────────────────────────┘
```

### Card 11: useState vs useReducer

```
┌────────────────────────────────────┐
│  useState vs useReducer            │
├────────────────────────────────────┤
│  useState:                         │
│    Simple state, few transitions   │
│                                    │
│  useReducer:                       │
│    Complex state, many transitions │
│    Next state depends on previous  │
│    Redux-like pattern              │
└────────────────────────────────────┘
```

### Card 12: Performance

```
┌────────────────────────────────────┐
│  REACT PERFORMANCE                 │
├────────────────────────────────────┤
│  React.memo  → Memoize component   │
│  useMemo     → Memoize value       │
│  useCallback → Memoize function    │
│                                    │
│  React.lazy  → Code splitting      │
│  Virtualize  → Long lists          │
└────────────────────────────────────┘
```

### Card 13: Component Lifecycle

```
┌────────────────────────────────────┐
│  LIFECYCLE (Hooks Way)             │
├────────────────────────────────────┤
│  Mount:                            │
│    useEffect(() => {}, [])         │
│                                    │
│  Update:                           │
│    useEffect(() => {}, [dep])      │
│                                    │
│  Unmount:                          │
│    useEffect(() => {               │
│      return () => cleanup();       │
│    }, [])                          │
└────────────────────────────────────┘
```

---

## 🟨 CSS Cards

### Card 14: Box Model

```
┌────────────────────────────────────┐
│  BOX MODEL                         │
├────────────────────────────────────┤
│  ┌─────── margin ───────┐          │
│  │ ┌──── border ────┐   │          │
│  │ │ ┌─ padding ─┐  │   │          │
│  │ │ │  content  │  │   │          │
│  │ │ └───────────┘  │   │          │
│  │ └────────────────┘   │          │
│  └──────────────────────┘          │
│                                    │
│  box-sizing: border-box ← USE THIS │
└────────────────────────────────────┘
```

### Card 15: Flexbox

```
┌────────────────────────────────────┐
│  FLEXBOX (1D)                      │
├────────────────────────────────────┤
│  display: flex                     │
│  flex-direction: row | column      │
│                                    │
│  justify-content: (main axis)      │
│    flex-start, center, flex-end    │
│    space-between, space-around     │
│                                    │
│  align-items: (cross axis)         │
│    flex-start, center, flex-end    │
└────────────────────────────────────┘
```

### Card 16: Grid

```
┌────────────────────────────────────┐
│  CSS GRID (2D)                     │
├────────────────────────────────────┤
│  display: grid                     │
│  grid-template-columns: 1fr 1fr    │
│  grid-template-rows: auto          │
│  gap: 1rem                         │
│                                    │
│  Responsive:                       │
│  repeat(auto-fit, minmax(200px,1fr))│
└────────────────────────────────────┘
```

### Card 17: Specificity

```
┌────────────────────────────────────┐
│  CSS SPECIFICITY                   │
├────────────────────────────────────┤
│  Inline style    1,0,0,0 (highest) │
│  #id             0,1,0,0           │
│  .class          0,0,1,0           │
│  element         0,0,0,1 (lowest)  │
│                                    │
│  !important → Override all         │
│  (avoid if possible)               │
└────────────────────────────────────┘
```

### Card 18: Position

```
┌────────────────────────────────────┐
│  CSS POSITION                      │
├────────────────────────────────────┤
│  static   → Default, normal flow   │
│  relative → Offset from normal     │
│  absolute → Relative to positioned │
│             ancestor               │
│  fixed    → Relative to viewport   │
│  sticky   → Hybrid relative/fixed  │
└────────────────────────────────────┘
```

---

## 🟧 Web & HTTP Cards

### Card 19: HTTP Methods

```
┌────────────────────────────────────┐
│  HTTP METHODS                      │
├────────────────────────────────────┤
│  GET    → Read (no body)           │
│  POST   → Create                   │
│  PUT    → Replace                  │
│  PATCH  → Update partial           │
│  DELETE → Delete                   │
│                                    │
│  Idempotent: GET, PUT, DELETE      │
└────────────────────────────────────┘
```

### Card 20: Status Codes

```
┌────────────────────────────────────┐
│  HTTP STATUS CODES                 │
├────────────────────────────────────┤
│  2xx SUCCESS                       │
│    200 OK, 201 Created             │
│                                    │
│  3xx REDIRECT                      │
│    301 Moved, 304 Not Modified     │
│                                    │
│  4xx CLIENT ERROR                  │
│    400 Bad, 401 Unauth, 404 Not    │
│                                    │
│  5xx SERVER ERROR                  │
│    500 Internal, 503 Unavailable   │
└────────────────────────────────────┘
```

### Card 21: Storage

```
┌────────────────────────────────────┐
│  WEB STORAGE                       │
├────────────────────────────────────┤
│           │Size │ Life  │ Server  │
│  Cookie   │ 4KB │Config │  Auto   │
│  Local    │ 5MB │Perm   │  No     │
│  Session  │ 5MB │Tab    │  No     │
│  IndexedDB│ ∞   │Perm   │  No     │
└────────────────────────────────────┘
```

### Card 22: CORS

```
┌────────────────────────────────────┐
│  CORS                              │
├────────────────────────────────────┤
│  Cross-Origin Resource Sharing     │
│  Browser security mechanism        │
│                                    │
│  Server must send headers:         │
│  Access-Control-Allow-Origin       │
│  Access-Control-Allow-Methods      │
│  Access-Control-Allow-Headers      │
│                                    │
│  Preflight: OPTIONS request        │
└────────────────────────────────────┘
```

---

## 🟥 Performance Cards

### Card 23: Core Web Vitals

```
┌────────────────────────────────────┐
│  CORE WEB VITALS                   │
├────────────────────────────────────┤
│  LCP < 2.5s                        │
│    Largest Contentful Paint        │
│                                    │
│  FID < 100ms                       │
│    First Input Delay               │
│                                    │
│  CLS < 0.1                         │
│    Cumulative Layout Shift         │
└────────────────────────────────────┘
```

### Card 24: Optimization

```
┌────────────────────────────────────┐
│  PERFORMANCE OPTIMIZATION          │
├────────────────────────────────────┤
│  Images:  WebP, lazy load, srcset  │
│  JS:      Code split, tree shake   │
│  CSS:     Critical CSS, minify     │
│  Cache:   CDN, Service Worker      │
│  Render:  transform/opacity (GPU)  │
└────────────────────────────────────┘
```

---

## 🟪 Security Cards

### Card 25: XSS & CSRF

```
┌────────────────────────────────────┐
│  XSS (Cross-Site Scripting)        │
├────────────────────────────────────┤
│  Inject malicious scripts          │
│                                    │
│  Prevent:                          │
│  • Escape user input               │
│  • Content Security Policy         │
│  • React auto-escapes              │
├────────────────────────────────────┤
│  CSRF (Cross-Site Request Forgery) │
├────────────────────────────────────┤
│  Trick user to make requests       │
│                                    │
│  Prevent:                          │
│  • CSRF tokens                     │
│  • SameSite cookies                │
└────────────────────────────────────┘
```

---

## 🟫 TypeScript Cards

### Card 26: Basic Types

```
┌────────────────────────────────────┐
│  TYPESCRIPT TYPES                  │
├────────────────────────────────────┤
│  Primitives:                       │
│    string, number, boolean         │
│    null, undefined, symbol         │
│                                    │
│  Special:                          │
│    any, unknown, never, void       │
│                                    │
│  Objects:                          │
│    interface, type, class          │
└────────────────────────────────────┘
```

### Card 27: Utility Types

```
┌────────────────────────────────────┐
│  TYPESCRIPT UTILITY TYPES          │
├────────────────────────────────────┤
│  Partial<T>   → All optional       │
│  Required<T>  → All required       │
│  Readonly<T>  → All readonly       │
│  Pick<T,K>    → Select keys        │
│  Omit<T,K>    → Exclude keys       │
│  Record<K,V>  → Key-value map      │
└────────────────────────────────────┘
```

---

## 🃏 Interview Tips Cards

### Card 28: STAR Method

```
┌────────────────────────────────────┐
│  STAR METHOD                       │
├────────────────────────────────────┤
│  S - Situation: Context            │
│  T - Task: Your responsibility     │
│  A - Action: What you did          │
│  R - Result: Outcome + metrics     │
│                                    │
│  TIP: Prepare 3-5 STAR stories     │
└────────────────────────────────────┘
```

### Card 29: Coding Interview

```
┌────────────────────────────────────┐
│  LIVE CODING STEPS                 │
├────────────────────────────────────┤
│  1. Clarify requirements           │
│  2. Think out loud                 │
│  3. Start with brute force         │
│  4. Write clean code               │
│  5. Test with examples             │
│  6. Analyze complexity             │
│  7. Discuss optimizations          │
└────────────────────────────────────┘
```

### Card 30: Questions to Ask

```
┌────────────────────────────────────┐
│  QUESTIONS TO ASK INTERVIEWER      │
├────────────────────────────────────┤
│  1. What does typical day look?    │
│  2. What are current challenges?   │
│  3. How is team structured?        │
│  4. What's the tech stack?         │
│  5. How is success measured?       │
│  6. What growth opportunities?     │
└────────────────────────────────────┘
```

---

## 📊 Quick Reference Summary

```
╔══════════════════════════════════════╗
║      FRONTEND INTERVIEW 2025         ║
║         30 ESSENTIAL CARDS           ║
╠══════════════════════════════════════╣
║  JS:      Event Loop, Closure, this  ║
║           Promises, Array methods    ║
║                                      ║
║  React:   Hooks, useEffect, memo     ║
║           Lifecycle, Performance     ║
║                                      ║
║  CSS:     Box Model, Flex, Grid      ║
║           Specificity, Position      ║
║                                      ║
║  Web:     HTTP, CORS, Storage        ║
║           Status codes               ║
║                                      ║
║  Perf:    Core Web Vitals            ║
║           Optimization techniques    ║
║                                      ║
║  Security: XSS, CSRF prevention      ║
║                                      ║
║  TS:      Types, Utility types       ║
║                                      ║
║  Interview: STAR, Live coding tips   ║
╚══════════════════════════════════════╝
```

---

## 📱 One-Liner Flashcards

```
Event Loop:     Sync → Microtask → Macrotask
Closure:        Function + Environment
Hoisting:       Declarations lifted, not initializations
this:           Depends on call context
Promise:        Object representing future value

Virtual DOM:    In-memory representation for diffing
useEffect:      Side effects based on dependencies
useMemo:        Memoize expensive calculations
useCallback:    Memoize function references
Context:        Share state without prop drilling

Box Model:      Margin > Border > Padding > Content
Flexbox:        1D layout (row or column)
Grid:           2D layout (rows and columns)
Specificity:    Inline > ID > Class > Element

LCP:            < 2.5s (Largest Contentful Paint)
FID:            < 100ms (First Input Delay)
CLS:            < 0.1 (Cumulative Layout Shift)

XSS:            Escape input, use CSP
CSRF:           CSRF tokens, SameSite cookies
CORS:           Server allows cross-origin requests
```

---

> **🎯 Tip: In ra và ôn tập mỗi ngày 10 cards!**
>
> **Chúc bạn phỏng vấn thành công! 🎉**
>
> _Tài liệu được tạo: 24/12/2025_
