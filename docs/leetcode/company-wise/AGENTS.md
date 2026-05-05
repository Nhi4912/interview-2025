# COMPANY-WISE LEETCODE LISTS

**Generated:** 2026-05-05 | 463 companies, 2-tier structure

## OVERVIEW

Per-company problem lists scraped + curated. Sharply split into **target** (deeply enriched, 6 companies) vs **other** (auto-generated lists, 459 companies). Use `index.md` as the directory.

## STRUCTURE

```
company-wise/
├── README.md                    # Human-facing index
├── index.md                     # ⭐ Full 463-company directory (Jekyll page)
├── target-companies/            # 6 ENRICHED — full prep guides
│   ├── google.md
│   ├── microsoft.md
│   ├── grab.md
│   ├── axon.md
│   ├── employment-hero.md
│   └── zalo-vng.md
└── other-companies/             # 459 auto-generated — problem lists only
    └── *.md                     # one file per company
```

## WHERE TO LOOK

| You're targeting                       | Path                                            |
| -------------------------------------- | ----------------------------------------------- |
| Google, MSFT, Grab, Axon, EH, Zalo/VNG | `target-companies/<name>.md` (FULL prep guide)  |
| Any other company                      | `other-companies/<name>.md` (problem list only) |
| Don't know company name spelling       | `index.md` (search-friendly directory)          |
| Mapping problems back to category      | `../00-patterns-index.md`                       |

## CONVENTIONS

- **Two distinct content tiers** — never confuse:
  - `target-companies/*.md` — full sections: company overview, interview process, top patterns, frequency-ranked problems with prep notes, behavioral tips.
  - `other-companies/*.md` — bare problem list with frequency tags. NO behavioral/process content.
- **Filenames** — kebab-case company name (e.g., `employment-hero.md`, `zalo-vng.md`). Match `index.md` slugs.
- **Frequency labels** in lists: 🔥 (top 10), ⭐ (top 50), then plain.
- **Cross-link problems** to `../<category>/problems/NN-name.md`, NOT raw LeetCode URLs.

## ANTI-PATTERNS

- ❌ Don't add a company to `target-companies/` without writing the FULL prep-guide structure (overview + process + patterns + behavioral). Half-done = belongs in `other-companies/`.
- ❌ Don't auto-regenerate `other-companies/` lists from scratch — preserves manual frequency curation.
- ❌ Don't merge the two tiers into one folder — the split signals content quality at a glance.
- ❌ Don't add behavioral/process content to `other-companies/*.md` — promote the file to `target-companies/` first.
- ❌ Don't update `index.md` by hand for `other-companies/` — it's generated.

## UNIQUE STYLES

- **Jekyll frontmatter** (`layout: page`, `title: ...`) at top of `README.md` and `index.md` — folder may render as static site.
- **Target-company prep guides** include VN-specific cultural notes (Grab, Zalo/VNG) — hiring loop differences from US tech.
- **Frequency tags** are based on 2024-2026 interview reports (Glassdoor, Blind, internal anecdotes), not LeetCode's official "frequency".

## NOTES

- "Target" = the 6 companies the repo owner is actively interviewing at. Adjust scope (and AGENTS.md) if priority companies change.
- See parent `../AGENTS.md` for leetcode-folder conventions.
