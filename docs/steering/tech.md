# Tech Stack & Conventions

## Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.x |
| UI | React | 18.x |
| Language | TypeScript (strict) | 5.x |
| Content | MDX (@next/mdx) | 14.x / 3.x |
| Markdown | remark-gfm, remark-math | 4.x / 6.x |
| Syntax | rehype-pretty-code + shiki | 0.13.x / 1.x |
| Diagrams | Mermaid | 11.x |
| Visualization | D3 | 7.x |
| Styling | CSS Modules | built-in |
| i18n | Custom (LocaleContext) | - |

## Conventions
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Files**: kebab-case for filenames, PascalCase for component files
- **Content files**: numbered prefix (01-, 02-) for ordering
- **Imports**: absolute from src/ (configured in tsconfig)
- **Styling**: CSS Modules (.module.css) — no Tailwind, no inline styles
- **Components**: Function components only, "use client" only when needed
- **Types**: Defined in src/types/, imported by components/services

## Constraints
- No backend/API — static content served via Next.js
- Content must work offline (all data in markdown files)
- Bilingual support required for all user-facing text
- Must support both light and dark mode (prefers-color-scheme)
