# Interview 2025 — Project Constitution
> Agent: Read this file before doing ANY task.

## App Vision (1 sentence)
Interview 2025 is a bilingual (EN/VI) interview preparation platform helping developers prepare for Frontend (JS/TS/React) and Backend (Go) roles at top tech companies (Zalo/VNG, Grab, Axon, Employment Hero, Microsoft, Google).

## Docs Structure
- Steering: @docs/steering/ (product vision, tech stack, folder structure)
- Product: @docs/product/prd.md
- Interview Content:
  - Shared fundamentals: @docs/interview/shared/ (CS, system design theory — language-agnostic)
  - Frontend track: @docs/interview/fe-track/ (JS, TS, React, browser, performance)
  - Backend track: @docs/interview/be-track/ (Go, databases, distributed systems, DevOps)
- Design: @docs/design/tokens.md
- Feature Specs: @docs/specs/[feature]/

## Tech Stack
- Next.js 14 (App Router)
- React 18 + TypeScript strict
- MDX for interactive content (remark-gfm, rehype-pretty-code, shiki)
- CSS Modules for component styling
- D3 for visualizations, Mermaid for diagrams
- gray-matter for frontmatter parsing
- Bilingual: English + Vietnamese (LocaleContext + fallback)

## Folder Conventions
```
src/app/           → screens (Next.js App Router)
src/components/ui/ → atomic UI components  
src/components/    → feature components
src/components/mdx/ → MDX interactive components (Quiz, InteractiveDemo, CodeExample, Diagram)
src/hooks/         → custom hooks (useXxx)
src/lib/           → services (ContentService, SearchService, i18n)
src/types/         → TypeScript interfaces
content/{locale}/{category}/ → MDX content files with frontmatter
docs/interview/    → Interview prep content (shared + fe-track + be-track)
docs/steering/     → Project steering documents
docs/product/      → PRD, user personas, journeys
docs/specs/        → Feature specifications
docs/design/       → Design tokens, screenshots
```

## Content Architecture
- `content/` = MDX files rendered by Next.js app (interactive, has frontmatter)
- `docs/interview/` = Reference markdown (study material, Q&A format)
- Both systems are bilingual: English headings + Vietnamese explanations
- Content difficulty tagged: Junior | Middle | Senior
- Interview content organized as: shared fundamentals > track-specific > company guide

## Content Rules
1. Shared fundamentals (CS, system design theory) live in docs/interview/shared/ — ONE source of truth
2. Track-specific content references shared/ for theory, adds language-specific implementations
3. No duplicate theory between fe-track/ and be-track/ — use cross-references
4. BE content: ~80-90% theory, 10-20% code (Go examples only when essential)
5. FE content: Can include more code examples (JS/TS/React)

## Agent Rules
1. Always read the relevant spec before implementing
2. Use /plan mode before coding any feature
3. Each task = 1 atomic commit
4. TypeScript strict — no 'any'
5. CSS Modules for styling — no inline styles in components
6. Interactive MDX components must support bilingual (locale prop)
7. Content files must have proper frontmatter (id, title, category, difficulty)

## Do NOT
- Duplicate theory content between fe-track/ and be-track/ (use shared/)
- Use Redux, MobX (no global state library needed yet)
- Use StyleSheet or styled-components (use CSS Modules)
- Class components
- Hardcode strings that should be bilingual
- Create files outside folder conventions
