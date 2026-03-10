# Interview 2025 — Product Requirements Document
**Status:** In Progress
**Version:** 1.0
**Last Updated:** 2025-03-11

---

## 1. Overview
Interview 2025 is a bilingual (English + Vietnamese) interview preparation platform for developers targeting Frontend (JS/TS/React) and Backend (Go) roles at top tech companies in Vietnam and globally.

## 2. Goals
### Primary Goals
- Provide comprehensive, structured interview content for FE and BE tracks
- Bilingual format: English technical terms + Vietnamese explanations
- Progressive difficulty: Junior → Middle → Senior
- Company-specific guidance for: Zalo (VNG), Grab, Axon, Employment Hero, Microsoft, Google

### Non-Goals (v1.0)
- Online code execution / judge system
- User authentication / accounts
- Spaced repetition / flashcard backend
- Video or audio content
- Community features (comments, forums)

## 3. Content Structure

### 3.1 Shared Fundamentals (docs/interview/shared/)
Language-agnostic CS and engineering knowledge needed by BOTH tracks:
- CS Fundamentals: Data structures, algorithms, complexity, OS, networking
- System Design Theory: CAP, consistency, replication, partitioning, consensus
- Database Fundamentals: Relational model, normalization, ACID, SQL vs NoSQL
- Security Basics: CIA triad, cryptography, auth concepts (JWT, OAuth)
- Software Engineering: SOLID, design principles, SDLC

### 3.2 Frontend Track (docs/interview/fe-track/)
JavaScript/TypeScript/React-specific content:
- JavaScript deep dive (closures, prototypes, event loop, ES6+)
- TypeScript (type system, generics, utility types)
- React (hooks, state management, patterns, performance)
- Browser & Performance (DOM, rendering pipeline, Core Web Vitals)
- Web Security (XSS, CSRF, CSP, CORS from browser perspective)
- FE System Design (component architecture, micro-frontends)
- Company-specific FE interview guide

### 3.3 Backend Track (docs/interview/be-track/)
Go/Backend-specific content:
- Golang deep dive (goroutines, channels, interfaces, GC, testing)
- Backend Knowledge (API design, microservices, distributed systems)
- Database Advanced (indexing internals, Redis, MongoDB, caching patterns)
- BE System Design (classic problems: URL shortener, chat, rate limiter)
- Company-specific BE interview guide

## 4. Content Format
- **Q&A style**: Each topic as interview questions with detailed answers
- **Bilingual**: English headings/terms + Vietnamese explanations
- **Difficulty tags**: 🟢 Junior | 🟡 Middle | 🔴 Senior
- **Cross-references**: shared/ content referenced from track-specific files
- **Code examples**: Minimal in theory files, language-specific in track files

## 5. Interactive Features (via MDX in content/)
- Quiz component with multiple choice / true-false
- Interactive demos (data structure visualization)
- Code examples with syntax highlighting
- Mermaid diagrams for architecture
- D3 knowledge graph visualization
- Glossary with bilingual terms

## 6. User Journeys

### Journey 1: New User — "Which track?"
1. Land on home page
2. See overview of FE vs BE tracks
3. Take a self-assessment quiz
4. Get recommended study roadmap
5. Start with shared fundamentals

### Journey 2: Focused Prep — "I have an interview in 2 weeks"
1. Select company (e.g., Grab)
2. Select role (FE or BE)
3. Get company-specific prep guide
4. Study recommended topics in order
5. Practice with Q&A and quizzes

### Journey 3: Deep Study — "I want to master CS"
1. Browse shared fundamentals
2. Work through progressive difficulty
3. Use interactive demos and diagrams
4. Cross-reference with track-specific implementations

## 7. Information Architecture
```
Home
├── Choose Track
│   ├── Frontend Track → /learn/fe
│   └── Backend Track → /learn/be
├── Shared Fundamentals → /learn/shared
├── Company Guides → /companies
├── Search → /search
└── About → /about
```

## 8. Technical Requirements
- Static site (no backend API needed for v1)
- MDX rendering with interactive components
- Bilingual support with locale switching
- Search across all content
- Learning path progress (client-side storage)
- Dark/light mode support
- Mobile-responsive
