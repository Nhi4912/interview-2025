# 🎯 MODULE 10: INTERVIEW PREPARATION

> **Focus**: Q&A Format
>
> _Câu hỏi thực tế và câu trả lời mẫu_

---

## 📋 Trong Module Này

1. [Technical Questions](#1-technical-questions)
2. [Behavioral Questions](#2-behavioral-questions)
3. [System Design Questions](#3-system-design-questions)
4. [Questions to Ask Interviewer](#4-questions-to-ask-interviewer)

---

## 1. Technical Questions

### JavaScript

<details>
<summary><strong>Q: Explain Event Loop</strong></summary>

**Answer:**
Event Loop là cơ chế cho phép JS single-threaded xử lý async operations.

**Thứ tự**: Sync code → All Microtasks → One Macrotask → Repeat

**Key insight**: Microtasks (Promise.then) chạy trước Macrotasks (setTimeout) vì liên quan đến data consistency.

</details>

<details>
<summary><strong>Q: What is closure?</strong></summary>

**Answer:**
Closure = Function + its lexical environment

Function "nhớ" variables từ scope bên ngoài kể cả khi outer function đã return.

**Use cases**: Private variables, function factories, React hooks

</details>

<details>
<summary><strong>Q: == vs ===</strong></summary>

**Answer:**

- `==` : Type coercion (có thể convert types)
- `===` : Strict equality (so sánh cả type)

**Best practice**: Luôn dùng `===` để tránh unexpected behavior

</details>

### React

<details>
<summary><strong>Q: Why use keys in lists?</strong></summary>

**Answer:**
Keys giúp React identify items khi diffing. Without keys:

- Performance kém (re-render all)
- State bugs (incorrect association)

**Rule**: Use stable unique IDs, NOT array index (trừ khi list không reorder)

</details>

<details>
<summary><strong>Q: useEffect vs useLayoutEffect</strong></summary>

**Answer:**
| | useEffect | useLayoutEffect |
|---|---|---|
| **When** | After paint | Before paint |
| **Use case** | Data fetching, subscriptions | DOM measurements, scroll position |
| **Blocking** | No | Yes |

**Default**: useEffect. Only useLayoutEffect when you see flicker.

</details>

<details>
<summary><strong>Q: How to optimize React performance?</strong></summary>

**Answer:**

1. **React.memo** - Prevent re-render if props unchanged
2. **useMemo** - Cache expensive calculations
3. **useCallback** - Stable function references
4. **Code splitting** - React.lazy
5. **Virtualization** - Long lists

**Key**: Measure first, don't optimize prematurely.

</details>

### TypeScript

<details>
<summary><strong>Q: interface vs type</strong></summary>

**Answer:**
| interface | type |
|---|---|
| Extendable, mergeable | Unions, tuples |
| Objects, classes | Any type |

**Rule of thumb**: interface for objects, type for everything else.

</details>

---

## 2. Behavioral Questions

### STAR Method

```
S - Situation: Context and background
T - Task: Your responsibility
A - Action: What you did specifically
R - Result: Outcome with metrics if possible
```

### Common Questions

<details>
<summary><strong>Q: Tell me about a challenging project</strong></summary>

**Framework Answer:**

- **S**: Describe the project and constraints
- **T**: Your specific role and goals
- **A**: Technical decisions you made, challenges you solved
- **R**: Impact (faster load time, reduced bugs, team velocity)

**Tip**: Focus on YOUR contributions, not team's.

</details>

<details>
<summary><strong>Q: How do you handle disagreements?</strong></summary>

**Framework Answer:**

1. Listen to understand, not to respond
2. Ask clarifying questions
3. Present data/evidence for your view
4. Propose experiments if uncertain
5. Commit to decision once made

**Key**: Show you're collaborative, not combative.

</details>

<details>
<summary><strong>Q: How do you stay updated?</strong></summary>

**Sample Answer:**

- Follow specific newsletters (React Status, JavaScript Weekly)
- Selected Twitter/X accounts
- Conference talks (React Conf, Next.js Conf)
- Side projects to try new things
- Reading source code of libraries

</details>

---

## 3. System Design Questions

### Framework: RADIO

```
R - Requirements: Clarify functional & non-functional
A - Architecture: High-level component diagram
D - Data: State management, API design
I - Interface: Component breakdown
O - Optimizations: Performance, edge cases
```

### Example: Design Autocomplete

<details>
<summary><strong>Full walkthrough</strong></summary>

**Requirements:**

- Search input with dropdown suggestions
- Debounced API calls
- Keyboard navigation
- Loading/error states

**Architecture:**

```
┌─────────────────────────────────────┐
│ SearchInput                         │
│  ├── Input field                    │
│  ├── Suggestions dropdown           │
│  └── Loading/Error states           │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ API Layer                           │
│  └── GET /search?q={query}          │
└─────────────────────────────────────┘
```

**Key Considerations:**

- Debounce (300ms typical)
- Cancel previous requests
- Keyboard a11y (arrow keys, enter, escape)
- Caching previous results
- Highlight matching text

</details>

---

## 4. Questions to Ask Interviewer

### About Team

- How is the team structured?
- What does a typical sprint look like?
- How do you handle technical debt?

### About Technology

- What's the biggest technical challenge right now?
- How do you make architectural decisions?
- What's on your tech radar?

### About Growth

- How does performance review work?
- What does career progression look like?
- What learning opportunities are there?

---

## 📊 Interview Checklist

```
Before Interview:
□ Research company's products
□ Review job description
□ Prepare 3-5 STAR stories
□ Prepare questions to ask
□ Test audio/video (remote)

During Interview:
□ Ask clarifying questions
□ Think out loud
□ Admit when you don't know
□ Show problem-solving process

After Interview:
□ Send thank you email (24h)
□ Note down questions asked
□ Reflect on what went well/poorly
```

---

## 🔗 Navigation

| Prev                                       | Module                 | Next                                       |
| ------------------------------------------ | ---------------------- | ------------------------------------------ |
| [Coding Practice](./09-coding-practice.md) | **10. Interview Prep** | [Quick Reference](./11-quick-reference.md) |

---

> _Tiếp theo: [Module 11: Quick Reference](./11-quick-reference.md)_
