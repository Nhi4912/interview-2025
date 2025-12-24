# 📋 MODULE 11: QUICK REFERENCE

> **Focus**: Cheat Sheet
>
> _Ôn tập nhanh trước phỏng vấn_

---

## 🟦 JavaScript

### Event Loop

```
Sync → Microtasks (ALL) → Macrotask (ONE) → Repeat
```

### Truthy/Falsy

```
Falsy: false, 0, "", null, undefined, NaN
Truthy: Everything else (including [], {}, "0")
```

### this Binding

| Context   | this =           |
| --------- | ---------------- |
| Global    | window           |
| Method    | Object           |
| Arrow     | Lexical (parent) |
| new       | Instance         |
| call/bind | Specified        |

### Array Methods

| Mutates        | Returns        |
| -------------- | -------------- |
| push, pop      | length, item   |
| shift, unshift | item, length   |
| splice, sort   | removed, array |
| map, filter    | NEW array      |
| reduce         | single value   |

---

## 🟩 React

### Hooks Rules

```
✅ Top level only (not in conditions/loops)
✅ React functions only
```

### useEffect Dependencies

| Deps    | Runs             |
| ------- | ---------------- |
| None    | Every render     |
| `[]`    | Once (mount)     |
| `[dep]` | When dep changes |

### Performance

```javascript
React.memo(Component); // Prevent re-render
useMemo(() => value, []); // Cache value
useCallback(() => fn, []); // Cache function
```

### State Decisions

| Need           | Use         |
| -------------- | ----------- |
| Local          | useState    |
| Complex local  | useReducer  |
| Avoid drilling | Context     |
| Server data    | React Query |
| Global         | Zustand     |

---

## 🟦 TypeScript

### Basic Types

```typescript
string, number, boolean, null, undefined
any, unknown, never, void
string[], Array<string>, [string, number] // tuple
Record<string, number>, { key: value }
```

### Utility Types

| Type            | Does            |
| --------------- | --------------- |
| `Partial<T>`    | All optional    |
| `Required<T>`   | All required    |
| `Pick<T, K>`    | Select keys     |
| `Omit<T, K>`    | Exclude keys    |
| `ReturnType<F>` | Function return |

---

## 🟧 CSS

### Flexbox vs Grid

| Flexbox          | Grid            |
| ---------------- | --------------- |
| 1D layout        | 2D layout       |
| Content-out      | Layout-in       |
| Simple alignment | Complex layouts |

### Specificity

```
Inline:     1,0,0,0
ID:         0,1,0,0
Class:      0,0,1,0
Element:    0,0,0,1
```

### Box Model

```
box-sizing: content-box (default) → width = content
box-sizing: border-box → width = content + padding + border
```

---

## 🟪 Performance

### Core Web Vitals

| Metric  | Good    | Measures             |
| ------- | ------- | -------------------- |
| **LCP** | < 2.5s  | Largest element load |
| **INP** | < 200ms | Interaction response |
| **CLS** | < 0.1   | Visual stability     |

### Optimization

```
LCP: SSR, preload, CDN, optimize images
INP: Break long tasks, Web Workers
CLS: Reserve space, size attributes
```

---

## 🟥 Security

### XSS Prevention

```
✅ textContent instead of innerHTML
✅ React escapes by default
✅ Sanitize user input
✅ Content-Security-Policy header
```

### CSRF Prevention

```
✅ CSRF tokens
✅ SameSite cookies
✅ Check Origin header
```

---

## 📊 HTTP

### Status Codes

| Range | Meaning                                       |
| ----- | --------------------------------------------- |
| 2xx   | Success (200 OK, 201 Created)                 |
| 3xx   | Redirect (301 Moved, 304 Not Modified)        |
| 4xx   | Client Error (400 Bad Request, 401, 403, 404) |
| 5xx   | Server Error (500 Internal, 502, 503)         |

### Methods

| Method | Safe | Idempotent |
| ------ | ---- | ---------- |
| GET    | ✅   | ✅         |
| POST   | ❌   | ❌         |
| PUT    | ❌   | ✅         |
| DELETE | ❌   | ✅         |

---

## 🎯 Interview Tips

### STAR Method

```
S - Situation
T - Task
A - Action (YOUR contribution)
R - Result (with metrics)
```

### System Design (RADIO)

```
R - Requirements
A - Architecture
D - Data model
I - Interface design
O - Optimizations
```

### Quick Tips

```
✅ Think out loud
✅ Ask clarifying questions
✅ Start simple, optimize later
✅ Admit what you don't know
✅ Show enthusiasm
```

---

## 📚 Module Navigation

| #   | Module                                          | Focus       |
| --- | ----------------------------------------------- | ----------- |
| 0   | [Knowledge Map](./00-knowledge-map.md)          | Overview    |
| 1   | [JavaScript Theory](./01-javascript-theory.md)  | 80% Theory  |
| 2   | [Browser Theory](./02-browser-theory.md)        | 75% Theory  |
| 3   | [React Philosophy](./03-react-philosophy.md)    | 70% Theory  |
| 4   | [Architecture](./04-architecture-theory.md)     | 70% Theory  |
| 5   | [TypeScript](./05-typescript-theory.md)         | 60% Theory  |
| 6   | [Patterns](./06-framework-patterns.md)          | 40% Theory  |
| 7   | [Perf & Security](./07-performance-security.md) | 60% Theory  |
| 8   | [Testing](./08-testing-devops.md)               | 50% Theory  |
| 9   | [Coding](./09-coding-practice.md)               | 30% Theory  |
| 10  | [Interview](./10-interview-prep.md)             | Q&A         |
| 11  | **Quick Reference**                             | Cheat Sheet |

---

> **Chúc bạn phỏng vấn thành công! 🎉**
