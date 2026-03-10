# Project Structure

## Folder Map
```
interview-2025/
├── CLAUDE.md                    ← Agent reads EVERY session
├── docs/                        ← SDD Brain
│   ├── steering/                ← [00] Project Constitution
│   │   ├── product.md           ← vision, problem, target users
│   │   ├── tech.md              ← stack, conventions, constraints
│   │   └── structure.md         ← THIS FILE — folder map
│   │
│   ├── product/                 ← [01] Product Definition
│   │   └── prd.md
│   │
│   ├── interview/               ← [02] Interview Content (main content)
│   │   ├── shared/              ← Language-agnostic fundamentals
│   │   │   ├── 01-cs-fundamentals/
│   │   │   │   ├── data-structures-theory.md
│   │   │   │   ├── algorithms-theory.md
│   │   │   │   ├── complexity-analysis.md
│   │   │   │   ├── os-theory.md
│   │   │   │   ├── networking-theory.md
│   │   │   │   └── concurrency-theory.md
│   │   │   ├── 02-system-design/
│   │   │   │   ├── system-design-theory.md
│   │   │   │   ├── consensus-algorithms.md
│   │   │   │   ├── microservices-theory.md
│   │   │   │   └── caching-theory.md
│   │   │   ├── 03-database/
│   │   │   │   ├── sql-nosql-fundamentals.md
│   │   │   │   └── database-theory.md
│   │   │   ├── 04-security/
│   │   │   │   ├── security-fundamentals.md
│   │   │   │   └── auth-concepts.md
│   │   │   └── 05-software-engineering/
│   │   │       └── software-engineering-theory.md
│   │   │
│   │   ├── fe-track/            ← Frontend-specific content
│   │   │   ├── 00-study-roadmap.md
│   │   │   ├── 01-javascript/
│   │   │   ├── 02-typescript/
│   │   │   ├── 03-react/
│   │   │   ├── 04-nextjs/
│   │   │   ├── 05-html-css/
│   │   │   ├── 06-browser-performance/
│   │   │   ├── 07-web-security/
│   │   │   ├── 08-fe-system-design/
│   │   │   ├── 09-advanced-topics/
│   │   │   └── 10-company-guide.md
│   │   │
│   │   └── be-track/            ← Backend (Go) specific content
│   │       ├── 00-study-roadmap.md
│   │       ├── 01-golang/
│   │       ├── 02-backend-knowledge/
│   │       ├── 03-database-advanced/
│   │       ├── 04-be-system-design/
│   │       └── 05-company-guide.md
│   │
│   ├── specs/                   ← [03] Feature Specs
│   │   └── [feature]/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   │
│   └── design/                  ← [04] Design Assets
│       └── tokens.md
│
├── content/                     ← MDX content (app-rendered, with frontmatter)
│   ├── en/
│   ├── vi/
│   └── shared/
│
├── src/                         ← Application code
│   ├── app/                     ← Next.js App Router
│   ├── components/
│   │   ├── mdx/                 ← Interactive MDX components
│   │   ├── content/             ← Translation components
│   │   ├── search/              ← Search UI
│   │   ├── layout/              ← Navigation, language selector
│   │   └── learning-paths/      ← Roadmap visualization
│   ├── lib/
│   │   ├── content/             ← ContentService, parser, validator
│   │   ├── i18n/                ← LocaleContext, TranslationService
│   │   ├── learning-paths/      ← LearningPathService, paths JSON
│   │   └── search/              ← SearchService, index builder
│   └── types/                   ← TypeScript interfaces
│
├── scripts/                     ← Build/migration scripts
└── public/                      ← Static assets
```

## Naming Rules
- Interview content files: `XX-topic-name.md` (numbered for order)
- Feature spec dirs: `kebab-case` matching feature name
- Components: `PascalCase.tsx`
- CSS Modules: `ComponentName.module.css`
- Types: `feature-name.ts` in src/types/
- Hooks: `useFeatureName.ts` in src/hooks/

## Key Principle: No Duplication
- CS fundamentals, system design theory, security basics → `shared/`
- FE track references shared/ for theory, adds JS/TS/React implementations
- BE track references shared/ for theory, adds Go implementations
- `content/` MDX files are the app-rendered version of `docs/interview/` content
