# Google Frontend Interview Guide

> Google có interview process structured và data-driven nhất. Expect kỹ thuật sâu + Googleyness assessment.

---

## 🎯 Interview Process Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE INTERVIEW PROCESS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. RECRUITER SCREEN (30 min)                                  │
│      • Resume review                                            │
│      • Basic qualification check                                │
│      • Explain process, answer questions                        │
│                                                                   │
│   2. TECHNICAL PHONE SCREEN (45-60 min)                         │
│      • 1-2 coding problems in Google Docs                       │
│      • Usually LeetCode Medium difficulty                       │
│      • May include frontend-specific questions                  │
│                                                                   │
│   3. ONSITE VIRTUAL LOOP (4-5 rounds, 45 min each)             │
│      • 2 Coding interviews                                      │
│      • 1 Frontend-specific interview                            │
│      • 1 System Design (L5+)                                    │
│      • 1 Googleyness & Leadership                               │
│                                                                   │
│   4. HIRING COMMITTEE                                           │
│      • Reviews all interview feedback                           │
│      • May request additional interviews                        │
│                                                                   │
│   5. TEAM MATCHING                                              │
│      • Happens AFTER HC approval                                │
│      • You can decline team matches                             │
│                                                                   │
│   6. OFFER                                                      │
│      • Compensation negotiation                                 │
│                                                                   │
│   TIMELINE: 4-8 weeks total                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Technical Coding Rounds

### What to Expect

```
FORMAT:
• Google Docs (no syntax highlighting/autocomplete)
• 1-2 problems per round
• 45 minutes total
• Interviewer may have follow-up questions

DIFFICULTY:
• Phone screen: LeetCode Medium
• Onsite: LeetCode Medium-Hard
• Frontend role: May include DOM/JS specific

EVALUATION:
• Correctness
• Code quality
• Time/space complexity analysis
• Communication
```

### Common Problem Types

```
ALGORITHMS:
□ Arrays & Strings (Two pointers, sliding window)
□ Trees & Graphs (DFS, BFS, traversals)
□ Dynamic Programming
□ Hash maps & Sets
□ Binary Search

FRONTEND-SPECIFIC:
□ Implement DOM utilities
□ Event handling/delegation
□ Async patterns (Promise, debounce/throttle)
□ Data structure for UI components
□ Parse/transform data
```

### Example Google Frontend Questions

```javascript
// 1. Implement debounce
function debounce(fn, delay) {
    // Your implementation
}

// 2. Flatten nested object
// { a: { b: { c: 1 } } } → { 'a.b.c': 1 }

// 3. Implement a simple Virtual DOM diff
// Given two trees, find what changed

// 4. Build an autocomplete with async search

// 5. Implement throttled scroll handler

// 6. Parse HTML string to object tree
```

---

## 🎨 Frontend-Specific Round

### Focus Areas

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND ROUND FOCUS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. DOM MANIPULATION (High priority)                           │
│      • Create components without framework                      │
│      • Event handling and delegation                            │
│      • DOM traversal and modification                           │
│                                                                   │
│   2. JAVASCRIPT FUNDAMENTALS                                    │
│      • Closures, this, prototypes                               │
│      • Event loop, async/await                                  │
│      • ES6+ features                                            │
│                                                                   │
│   3. CSS LAYOUT                                                 │
│      • Flexbox and Grid                                         │
│      • Positioning                                              │
│      • Responsive design                                        │
│                                                                   │
│   4. PERFORMANCE                                                │
│      • Reflow/repaint                                           │
│      • Virtual scrolling                                        │
│      • Lazy loading                                             │
│      • Bundle optimization                                      │
│                                                                   │
│   5. ACCESSIBILITY                                              │
│      • Semantic HTML                                            │
│      • ARIA attributes                                          │
│      • Keyboard navigation                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Sample Questions

```javascript
// "Build a carousel component from scratch"
// Requirements:
// - Previous/Next buttons
// - Auto-advance
// - Touch swipe support
// - Accessible

// "Implement infinite scroll"
// - Virtualized rendering
// - API pagination
// - Loading states

// "Build a modal component"
// - Focus trap
// - Escape to close
// - Click outside to close
// - ARIA attributes
```

---

## 🏗️ System Design (L5+)

### What Google Looks For

```
• Clarifying requirements
• High-level architecture
• API design
• Data modeling
• Performance considerations
• Trade-off discussions
```

### Common Frontend SD Questions

```
• Design Google Search autocomplete
• Design Google Docs (collaborative editing)
• Design Google Photos gallery
• Design YouTube video player
• Design Gmail inbox
```

---

## 🎭 Googleyness & Leadership

### What is "Googleyness"?

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLEYNESS TRAITS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Enjoying fun                                               │
│   2. Intellectual humility                                      │
│   3. Conscientiousness                                          │
│   4. Comfort with ambiguity                                     │
│   5. Evidence you've taken courageous paths                     │
│                                                                   │
│   ALSO EVALUATED:                                               │
│   • Leadership ability (any level)                              │
│   • Role-related knowledge                                      │
│   • General cognitive ability                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Sample Questions

```
• Tell me about a time you failed
• Describe a situation where you had to convince others
• How do you handle ambiguous situations?
• Tell me about navigating a difficult team dynamic
• What's something you learned recently?
```

---

## 📚 Preparation Checklist

```
CODING (8 weeks before):
□ Solve 100+ LeetCode problems (focus on Medium)
□ Practice in Google Docs (no IDE!)
□ Time yourself (45 min for 2 problems)
□ Practice explaining while coding

FRONTEND (4 weeks before):
□ Build components from scratch (no framework)
□ Master DOM manipulation
□ Understand event loop deeply
□ Practice CSS layout challenges
□ Review browser internals

SYSTEM DESIGN (4 weeks before):
□ Study frontend architecture patterns
□ Practice RADIO framework
□ Do mock system design interviews
□ Review Google's published architectures

BEHAVIORAL (2 weeks before):
□ Prepare 5 STAR stories
□ Research Googleyness traits
□ Practice mock behavioral rounds
□ Prepare questions for interviewer
```

---

## 💡 Google-Specific Tips

```
DO:
✓ Think out loud - communication is evaluated
✓ Ask clarifying questions before coding
✓ Write clean, readable code
✓ Discuss time/space complexity
✓ Test your code with examples
✓ Be genuine in behavioral answers

DON'T:
✗ Stay silent while thinking
✗ Jump to code immediately
✗ Ignore edge cases
✗ Write messy code (it matters!)
✗ Give vague behavioral answers
✗ Pretend to know something you don't
```

---

## 🔗 Resources

```
OFFICIAL:
• Google Careers - Technical Interview Prep
• re:Work (Google's people practices)

PRACTICE:
• LeetCode Premium (Google tag)
• Pramp for mock interviews
• Interviewing.io

READING:
• Google Engineering Practices
• Cracking the Coding Interview
```

---

> **Quay lại:** [README.md](./README.md) để xem tổng quan
