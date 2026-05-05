# AGENTS.md — 15-modern-platform

## OVERVIEW

2026 cutting-edge FE platform topics (Web Components, CRDTs, micro-frontends) — framework-independent, browser-spec-level.

---

## WHERE TO LOOK

| Topic cluster                                                                   | File                                   |
| ------------------------------------------------------------------------------- | -------------------------------------- |
| Web Components · Shadow DOM · Custom Elements · ElementInternals                | `01-web-components-shadow-dom.md`      |
| CRDTs · Yjs · OT · real-time collab · local-first sync                          | `02-realtime-collaboration-crdts.md`   |
| Micro-frontends · Module Federation · import maps · shell/remote split          | `03-micro-frontends-scale.md`          |
| AI-augmented FE workflow · Cursor/Copilot/Claude · prompt patterns · guardrails | `04-ai-augmented-frontend-workflow.md` |

---

## LOCAL CONVENTIONS

- **Company stories are case-law, not flavor.** GitHub 1 000+ Web Components, Figma 10B edits/day, Notion Yjs rewrite, Shopify Polaris migration — treat these as the primary evidence base, not anecdotes.
- Each file opens with a named production story before any theory. Read it first.
- Vietnamese `> 🇻🇳 Tóm tắt` blocks are in-file summaries; skip or keep as-is, do not translate out.
- Memory mnemonics (SCOPE, etc.) are retention anchors — preserve them verbatim if editing.
- Content is intentionally **framework-agnostic**: all APIs are browser-native or spec-level (e.g., `customElements.define`, Yjs, native ESM). Do not add React/Vue framing.

---

## CROSS-REFERENCES

- Real-time transport (WebSocket, WebRTC, SSE) → `../10-networking/`
- Perf implications of Shadow DOM & large CRDT payloads → `../06-browser-performance/`
- MFE deployment, CDN hosting of remotes, CI/CD per-team → `../../be-track/06-devops-infrastructure.md`

---

## ANTI-PATTERNS

- ❌ Adding framework-specific code (React hooks, Vue composables) — this is the platform layer beneath frameworks.
- ❌ Dropping or summarising company anecdotes — they are the proof-of-concept for every claim.
- ❌ Conflating micro-frontends with monorepo strategy — MFE is a **runtime composition** pattern; monorepos are a source-organisation pattern. They are orthogonal.
- ❌ Treating CRDTs and OT as interchangeable without noting trade-offs — the files distinguish them deliberately.
