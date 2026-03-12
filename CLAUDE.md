# Interview Knowledge Base — Project Constitution

> This repo is a **pure documentation collection** for bilingual (EN/VI) interview preparation.
> No application code. No build system. Just markdown files.

## Purpose

A bilingual (English + Vietnamese) interview preparation knowledge base for developers targeting Frontend (JS/TS/React) and Backend (Go) roles at top tech companies.

## Structure

```
docs/
├── shared/           CS fundamentals, system design, DB, security, SE, AI
├── fe-track/         Frontend: JS, TS, React, Next.js, browser, performance
├── be-track/         Backend: Go, APIs, distributed systems, databases
└── leetcode/         Algorithm problems by category
```

See [README.md](README.md) for full structure and [docs/00-table-of-contents.md](docs/00-table-of-contents.md) for content index.

## Content Rules

1. **Single source of truth**: shared theory lives in `docs/shared/` — never duplicate between fe-track/ and be-track/
2. **Cross-reference**: track files reference shared/ for theory, add language-specific implementation
3. **Bilingual**: English headings + Vietnamese explanations. Technical terms stay in English
4. **Difficulty tags**: 🟢 Junior | 🟡 Mid | 🔴 Senior on every Q&A
5. **BE theory ratio**: ~80% theory, ~20% Go code (only when essential)
6. **FE can have more code**: JS/TS/React examples encouraged

## File Header Standard

Every content file must have:
```markdown
# Title in English / Tiêu đề tiếng Việt

> **Track**: Shared | FE | BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Related doc](./relative-path.md)
```

## Q&A Format Standard

```markdown
### Q: English question? / Câu hỏi tiếng Việt? 🟡 Mid

**A:** English answer with technical terms.

Vietnamese explanation: giải thích bằng tiếng Việt, tập trung vào điểm quan trọng và trade-off thực tế.
```

## Do NOT

- Add application code (no Next.js, no React components, no package.json)
- Duplicate theory between fe-track/ and be-track/ (use shared/)
- Create stubs or placeholder content ("Tactic 1...", "TODO: fill in")
- Break bilingual format (every section needs both EN and VI)
- Add files outside the docs/ directory structure
