# Coding Practice - Bài Tập Thực Hành

> Bài tập coding thực tế cho phỏng vấn frontend Big Tech. Được tổ chức theo topic và độ khó.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CODING PRACTICE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     5 CATEGORIES                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐      │
│   │  01-JAVASCRIPT    │  │ 02-DOM            │  │ 03-REACT          │      │
│   │    CHALLENGES     │  │   MANIPULATION    │  │   COMPONENTS      │      │
│   │                   │  │                   │  │                   │      │
│   │ • Implement APIs  │  │ • Event handling  │  │ • Hooks patterns  │      │
│   │ • Async patterns  │  │ • DOM traversal   │  │ • State mgmt      │      │
│   │ • Utility funcs   │  │ • Virtual DOM     │  │ • Component arch  │      │
│   └───────────────────┘  └───────────────────┘  └───────────────────┘      │
│                                                                               │
│   ┌───────────────────┐  ┌───────────────────┐                              │
│   │  04-ALGORITHM     │  │ 05-SYSTEM DESIGN  │                              │
│   │    PROBLEMS       │  │   EXERCISES       │                              │
│   │                   │  │                   │                              │
│   │ • Array/String    │  │ • Mini projects   │                              │
│   │ • Tree/Graph      │  │ • Architecture    │                              │
│   │ • DP patterns     │  │ • Scale thinking  │                              │
│   └───────────────────┘  └───────────────────┘                              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Folder Structure

```
12-coding-practice/
├── README.md                          # File này
├── 01-javascript-challenges/          # Bài tập JavaScript core
│   ├── README.md                      # Danh sách challenges
│   ├── implement-promise.md           # Promise implementation
│   ├── implement-array-methods.md     # map, filter, reduce
│   ├── debounce-throttle.md          # Timing functions
│   ├── deep-clone.md                  # Object cloning
│   ├── event-emitter.md              # Pub/sub pattern
│   └── curry-compose.md              # Functional patterns
│
├── 02-dom-manipulation/               # Bài tập DOM
│   ├── README.md
│   ├── infinite-scroll.md            # Lazy loading
│   ├── drag-and-drop.md              # Native drag API
│   ├── modal-dialog.md               # Accessible modal
│   ├── form-validation.md            # Custom validation
│   └── virtual-list.md               # Windowing
│
├── 03-react-components/               # Bài tập React
│   ├── README.md
│   ├── autocomplete.md               # Search with suggestions
│   ├── data-table.md                 # Sortable, filterable
│   ├── useLocalStorage.md            # Custom hook
│   ├── infinite-query.md             # Data fetching
│   └── accordion.md                  # Compound component
│
├── 04-algorithm-problems/             # Thuật toán
│   ├── README.md
│   ├── array-problems.md             # Two pointers, sliding window
│   ├── string-problems.md            # Pattern matching
│   ├── tree-problems.md              # BFS, DFS
│   └── common-patterns.md            # Interview patterns
│
└── 05-system-design-exercises/        # System design coding
    ├── README.md
    ├── news-feed.md                   # Facebook-style feed
    ├── chat-app.md                    # Real-time messaging
    └── file-uploader.md              # Chunked uploads
```

---

## 🎯 How to Practice

### Approach for Each Problem

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRACTICE APPROACH                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   STEP 1: UNDERSTAND (5 min)                                    │
│   ─────────────────────────                                      │
│   • Read requirements carefully                                 │
│   • Identify edge cases                                         │
│   • Ask clarifying questions                                    │
│                                                                   │
│   STEP 2: PLAN (5-10 min)                                       │
│   ───────────────────────                                        │
│   • Sketch solution on paper                                    │
│   • Consider multiple approaches                                │
│   • Choose optimal approach                                     │
│                                                                   │
│   STEP 3: CODE (20-30 min)                                      │
│   ────────────────────────                                       │
│   • Write clean, readable code                                  │
│   • Don't look at solution yet!                                 │
│   • Handle edge cases                                           │
│                                                                   │
│   STEP 4: TEST (5 min)                                          │
│   ─────────────────────                                          │
│   • Run through test cases manually                             │
│   • Check edge cases                                            │
│   • Verify complexity                                           │
│                                                                   │
│   STEP 5: COMPARE (5 min)                                       │
│   ──────────────────────                                         │
│   • Compare with provided solution                              │
│   • Understand differences                                      │
│   • Note improvements                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Difficulty Levels

```
🟢 EASY (Warmup)
────────────────
• Time: 15-20 minutes
• Basic concepts
• Good for daily practice
• Examples: debounce, throttle

🟡 MEDIUM (Core)
────────────────
• Time: 30-45 minutes
• Interview-level problems
• Combine multiple concepts
• Examples: Promise.all, virtual list

🔴 HARD (Challenge)
────────────────────
• Time: 45-60 minutes
• Complex implementations
• Performance critical
• Examples: Promise, React reconciler
```

---

## 🗓️ Practice Schedule

### Daily Practice (1-2 hours)

```
WEEK 1-2: JavaScript Fundamentals
─────────────────────────────────
Mon: Implement Array methods
Tue: Debounce & Throttle
Wed: Deep clone & compare
Thu: Event Emitter
Fri: Promise basics
Sat: Curry & Compose
Sun: Review & redo hard ones

WEEK 3-4: DOM & Browser
───────────────────────
Mon: Modal dialog
Tue: Form validation
Wed: Infinite scroll
Thu: Drag and drop
Fri: Virtual list
Sat: Custom dropdown
Sun: Review

WEEK 5-6: React Components
──────────────────────────
Mon: useLocalStorage
Tue: Autocomplete
Wed: Data table
Thu: Accordion (compound)
Fri: Infinite query
Sat: Build mini app
Sun: Review

WEEK 7-8: Algorithms & System Design
─────────────────────────────────────
Mon-Wed: Algorithm problems
Thu-Fri: System design coding
Sat-Sun: Full mock interviews
```

---

## 💡 Tips for Success

```
DURING PRACTICE:
────────────────
✓ Set a timer - practice under pressure
✓ Write tests first when possible
✓ Talk out loud (practice explaining)
✓ Don't peek at solutions too early
✓ Review your mistakes

COMMON MISTAKES:
────────────────
✗ Jumping straight to code
✗ Ignoring edge cases
✗ Not considering performance
✗ Overcomplicating solutions
✗ Not practicing regularly

INTERVIEW SIMULATION:
─────────────────────
• Practice with someone watching
• Use only basic text editor
• Explain every step
• Ask clarifying questions
• Test your solution manually
```

---

## 📚 Quick Links

| Category | Count | Difficulty Range |
|----------|-------|------------------|
| [JavaScript Challenges](./01-javascript-challenges/) | 10+ | 🟢-🔴 |
| [DOM Manipulation](./02-dom-manipulation/) | 8+ | 🟢-🟡 |
| [React Components](./03-react-components/) | 8+ | 🟡-🔴 |
| [Algorithm Problems](./04-algorithm-problems/) | 20+ | 🟢-🔴 |
| [System Design](./05-system-design-exercises/) | 5+ | 🔴 |

---

> **Quay lại:** [Frontend Index](../README.md)
