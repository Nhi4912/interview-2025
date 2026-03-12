# Meta Frontend Interview Guide

> Meta (Facebook) expect deep React knowledge và product thinking. "Move Fast" là core value.

---

## 🎯 Interview Process Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    META INTERVIEW PROCESS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. RECRUITER SCREEN (30 min)                                  │
│      • Resume review                                            │
│      • Role fit discussion                                      │
│      • Process overview                                         │
│                                                                   │
│   2. TECHNICAL PHONE SCREEN (45 min)                            │
│      • 2 coding problems                                        │
│      • CoderPad (with syntax highlighting)                      │
│      • Usually 1 easy + 1 medium                                │
│                                                                   │
│   3. ONSITE VIRTUAL LOOP (4-5 rounds)                          │
│      • 2 Coding interviews (45 min each)                        │
│      • 1 Frontend/React specific (45 min)                       │
│      • 1 System Design (45 min)                                 │
│      • 1 Behavioral (45 min)                                    │
│                                                                   │
│   4. TEAM MATCHING (Required before offer!)                     │
│      • Must match with team before offer                        │
│      • Multiple team chats possible                             │
│                                                                   │
│   5. OFFER                                                      │
│      • Competitive, equity-heavy                                │
│                                                                   │
│   TIMELINE: 3-6 weeks                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Coding Rounds

### Format

```
PLATFORM: CoderPad (syntax highlighting, can run code)
PROBLEMS: 2 per round
TIME: 45 minutes
DIFFICULTY: LeetCode Medium (mostly)

EXPECTATIONS:
• Working solution for both problems
• Clean, readable code
• Discuss complexity
• Handle edge cases
```

### Common Problem Types

```
MOST COMMON:
□ Arrays/Strings manipulation
□ Hash maps and counting
□ Tree traversals
□ BFS/DFS
□ Dynamic Programming (less common)

FRONTEND-SPECIFIC (sometimes mixed in):
□ Implement utilities (debounce, throttle)
□ DOM manipulation
□ Event handling
□ Async patterns
```

---

## ⚛️ React/Frontend Round

### This Round is Critical for Frontend Roles

```
┌─────────────────────────────────────────────────────────────────┐
│                    META REACT EXPECTATIONS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   REACT DEEP KNOWLEDGE (Meta created it!):                      │
│   ─────────────────────────────────────────                      │
│   • Hooks (useState, useEffect, useCallback, useMemo, useRef)   │
│   • Custom hooks                                                │
│   • Component lifecycle                                         │
│   • Virtual DOM & reconciliation                                │
│   • React 18 features (Suspense, Concurrent)                    │
│                                                                   │
│   PRACTICAL CHALLENGES:                                         │
│   ──────────────────────                                         │
│   • Build a component from scratch                              │
│   • Debug a React issue                                         │
│   • Optimize a slow component                                   │
│   • Implement a custom hook                                     │
│                                                                   │
│   STATE MANAGEMENT:                                             │
│   ─────────────────                                              │
│   • Context API                                                 │
│   • When to lift state                                          │
│   • State normalization                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Sample Meta Frontend Questions

```jsx
// 1. Build a Like button with animation
function LikeButton() {
    // Handle click, animation, optimistic update
}

// 2. Implement infinite scroll feed
// - Virtualization
// - Pagination
// - Loading states

// 3. Build a type-ahead/autocomplete
// - Debounced search
// - Keyboard navigation
// - Accessibility

// 4. Create a Photo Gallery
// - Lazy loading
// - Modal preview
// - Touch gestures

// 5. Implement a Comment Thread
// - Nested comments
// - Real-time updates
// - Optimistic UI
```

---

## 🏗️ System Design

### Meta Focus Areas

```
┌─────────────────────────────────────────────────────────────────┐
│                    META SD FOCUS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   COMMON QUESTIONS:                                             │
│   ─────────────────                                              │
│   • Design Facebook News Feed                                   │
│   • Design Instagram Stories                                    │
│   • Design Facebook Messenger                                   │
│   • Design Facebook Marketplace                                 │
│   • Design Photo/Video Upload                                   │
│                                                                   │
│   WHAT THEY LOOK FOR:                                           │
│   ───────────────────                                            │
│   • Product thinking (user-first design)                        │
│   • Scale considerations (billions of users)                    │
│   • Real-time features                                          │
│   • Mobile-first thinking                                       │
│   • Trade-off discussions                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### News Feed Design Framework

```
REQUIREMENTS:
• Posts from friends in real-time
• Different content types (text, image, video)
• Infinite scroll
• Reactions, comments, shares

ARCHITECTURE:
• Virtual scrolling for performance
• Cursor-based pagination
• WebSocket for real-time
• Optimistic UI updates

OPTIMIZATIONS:
• Code splitting
• Image lazy loading
• Prefetching
• Service worker caching
```

---

## 🎭 Behavioral Round

### Meta Core Values

```
┌─────────────────────────────────────────────────────────────────┐
│                    META VALUES                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. MOVE FAST                                                  │
│      Story: Time when you shipped quickly                       │
│      Story: Iterating based on feedback                         │
│                                                                   │
│   2. FOCUS ON IMPACT                                            │
│      Story: Prioritizing what matters                           │
│      Story: Measuring outcomes                                  │
│                                                                   │
│   3. BE BOLD                                                    │
│      Story: Taking risks                                        │
│      Story: Challenging status quo                              │
│                                                                   │
│   4. BE OPEN                                                    │
│      Story: Receiving/giving feedback                           │
│      Story: Transparent communication                           │
│                                                                   │
│   5. BUILD SOCIAL VALUE                                         │
│      Story: Broader impact consideration                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Preparation Checklist

```
CODING (6 weeks before):
□ 80-100 LeetCode problems
□ Focus on Meta-tagged problems
□ Practice in CoderPad
□ Solve 2 problems in 40 minutes

REACT (4 weeks before):
□ Build projects without create-react-app
□ Deep dive into hooks
□ Understand React 18 features
□ Practice component challenges
□ Review React source code concepts

SYSTEM DESIGN (4 weeks before):
□ Study Meta products in detail
□ Practice News Feed design
□ Practice Chat design
□ Focus on mobile-first

BEHAVIORAL (2 weeks before):
□ Prepare stories for each value
□ Use STAR method
□ Practice with timer (2-3 min answers)
□ Prepare questions about Meta culture
```

---

## 💡 Meta-Specific Tips

```
DO:
✓ Show product intuition
✓ Discuss user impact
✓ Move fast in interviews (but not sloppy)
✓ Know React deeply
✓ Ask about team/product during matching

DON'T:
✗ Bad-mouth Facebook/Meta products
✗ Be slow or over-think
✗ Ignore mobile considerations
✗ Not know basic React concepts
✗ Skip team matching conversations
```

---

## 🔗 Resources

```
OFFICIAL:
• Meta Careers - Preparing for Interview
• Meta Engineering Blog

PRACTICE:
• LeetCode (Meta tag)
• Meta-specific frontend practice on GreatFrontend
• Pramp for mock interviews

PRODUCTS TO STUDY:
• Use Facebook, Instagram, WhatsApp
• Note UX patterns they use
• Think about how features work
```

---

> **Quay lại:** [README.md](./README.md) để xem tổng quan
