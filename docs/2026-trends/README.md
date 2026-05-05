# 📡 2026 Interview Trends — Track Index

> **Purpose**: 12 high-signal topics that distinguish junior/mid from senior/staff candidates in 2026 interviews. Bilingual EN+VI, full Phase 2 pedagogical treatment (A1-A8 + B1-B10 + C1-C7).
> **Total**: ~9,800 lines, ~120 interview questions (3🟢 / 4🟡 / 3🔴 per file).
> **Audience**: Engineers preparing for senior+ roles at scale-ups & enterprise (FAANG, fintech, AI-native cos, Vietnam top techs).
> **Back to**: [📚 Master TOC](../00-table-of-contents.md)

---

## 🎯 Why this track exists

The 2024-2025 interview landscape was disrupted by 3 forces:

1. **AI-native engineering** — Copilot, Cursor, Claude Code reshaped what "writing code" means
2. **Edge + serverless maturity** — Workers/D1/DO went from experiments to production defaults
3. **Platform-as-product** — Backstage, golden paths, DevEx as C-suite KPI

This track captures the **knowledge that wasn't in interviews 2 years ago but is table-stakes in 2026**.

> 🇻🇳 **Mục đích**: 12 chủ đề "nóng" của interview 2026 — những thứ 2 năm trước chưa hỏi nhưng giờ là yêu cầu cơ bản cho senior+. Bilingual EN+VI, treatment đầy đủ Phase 2. Tổng ~9,800 dòng, ~120 câu hỏi phân loại độ khó.

---

## 📚 The 12 Topics

### Track A — AI / ML in Production (Files 01, 02, 03, 09, 10)

| #   | File                                                                        | Mnemonic              | Difficulty | Best for               |
| --- | --------------------------------------------------------------------------- | --------------------- | ---------- | ---------------------- |
| 01  | [AI-Augmented Engineering](./01-ai-augmented-engineering.md)                | TASC, GRRRC, SHIELD   | 🟢→🔴      | All engineers          |
| 02  | [LLM System Design](./02-llm-system-design.md)                              | RPMECG                | 🟡→🔴      | BE, full-stack, AI eng |
| 03  | [Vector DBs & Embeddings](./03-vector-databases-embeddings.md)              | HNSW recall, pgvector | 🟡→🔴      | BE, data, AI eng       |
| 09  | [AI Agent Evaluation in Production](./09-ai-agent-evaluation-production.md) | GETS-G                | 🔴         | Senior+, AI platform   |
| 10  | [Senior Engineer in AI Era](./10-senior-engineer-ai-era.md)                 | JATES                 | 🔴         | Senior/Staff/EM        |

### Track B — Modern Runtime & Distribution (Files 04, 05)

| #   | File                                                                       | Mnemonic | Difficulty | Best for              |
| --- | -------------------------------------------------------------------------- | -------- | ---------- | --------------------- |
| 04  | [Edge Computing & Serverless 2026](./04-edge-computing-serverless-2026.md) | PEACE    | 🟡→🔴      | BE, full-stack, infra |
| 05  | [Modern JS Runtimes (Bun/Deno/Node)](./05-modern-js-runtimes.md)           | BDN      | 🟡→🔴      | BE, full-stack        |

### Track C — Frontend Frontier (Files 06, 07)

| #   | File                                                                 | Mnemonic                  | Difficulty | Best for       |
| --- | -------------------------------------------------------------------- | ------------------------- | ---------- | -------------- |
| 06  | [React Server Components 2026](./06-react-server-components-2026.md) | RSC = Render-Stream-Cache | 🟡→🔴      | FE, full-stack |
| 07  | [WebAssembly FE + BE](./07-webassembly-fe-be.md)                     | WASM-FACE                 | 🟡→🔴      | FE, BE, infra  |

### Track D — Systems Programming Renaissance (File 08)

| #   | File                                                             | Mnemonic                        | Difficulty | Best for           |
| --- | ---------------------------------------------------------------- | ------------------------------- | ---------- | ------------------ |
| 08  | [Rust for Backend Engineers](./08-rust-for-backend-engineers.md) | OBE (Ownership, Borrow, Errors) | 🟡→🔴      | BE, infra, systems |

### Track E — Production Excellence (Files 11, 12)

| #   | File                                                         | Mnemonic   | Difficulty | Best for             |
| --- | ------------------------------------------------------------ | ---------- | ---------- | -------------------- |
| 11  | [Modern Observability](./11-modern-observability.md)         | MeLT-SCAN  | 🟡→🔴      | All engineers, SRE   |
| 12  | [Platform Engineering & DX](./12-platform-engineering-dx.md) | PAVED-RoaD | 🟡→🔴      | Staff+, EM, Platform |

---

## 🛤️ Recommended Learning Paths

### Path 1: "Generalist Senior" (3 weeks, ~2h/day)

> _Goal: Pass senior-level interviews at modern AI-aware companies._

```
Week 1 — Foundation
  Day 1-2: 01 AI-Augmented Engineering (TASC, GRRRC, SHIELD)
  Day 3-4: 10 Senior Engineer in AI Era (JATES)
  Day 5-7: 11 Modern Observability + 12 Platform Engineering

Week 2 — Build skills
  Day 8-10: 02 LLM System Design + 03 Vector DBs
  Day 11-12: 04 Edge Computing
  Day 13-14: 05 Modern JS Runtimes

Week 3 — Specialization
  Day 15-17: 06 RSC OR 08 Rust (pick one based on role)
  Day 18-19: 07 WebAssembly
  Day 20-21: 09 AI Agent Evaluation + Mock interviews (B8/B9/B10 from 3 random files)
```

### Path 2: "AI Platform Engineer" (2 weeks intensive)

> _Goal: AI-native company senior role (Anthropic, OpenAI, Hugging Face, AI startups)._

```
Day 1-2:  01 AI-Augmented Engineering
Day 3-4:  02 LLM System Design
Day 5-6:  03 Vector DBs & Embeddings
Day 7-8:  09 AI Agent Evaluation in Production (CRITICAL)
Day 9-10: 10 Senior Engineer in AI Era + 12 Platform Engineering
Day 11-12: 11 Observability (focus: AI agent observability section)
Day 13-14: Mock interviews focusing on B8-B10 of files 02, 09, 10
```

### Path 3: "Frontend Staff" (2 weeks)

> _Goal: Staff/Principal FE role at React-first companies (Vercel, Shopify, Notion)._

```
Day 1-3:  06 React Server Components 2026
Day 4-5:  07 WebAssembly FE+BE
Day 6-7:  04 Edge Computing & Serverless
Day 8-9:  05 Modern JS Runtimes
Day 10-11: 01 AI-Augmented + 10 Senior in AI Era
Day 12-13: 11 Observability + 12 Platform (frontend perspective)
Day 14: Mock + portfolio review
```

### Path 4: "Backend/Infra Staff" (2-3 weeks)

> _Goal: Staff BE role at scale (fintech, infra cos, FAANG)._

```
Week 1: 04 Edge + 05 JS Runtimes + 08 Rust
Week 2: 02 LLM SD + 03 Vector DBs + 11 Observability
Week 3: 09 AI Eval + 10 Senior + 12 Platform + Mock
```

### Path 5: "Quick Refresh" (Weekend before interview)

> _Goal: Already senior, brushing up on latest._

```
Saturday morning:  Read all 12 C1 (Topic Overview) + C3 (Cold Call) cards
Saturday afternoon: Pick 4 most-relevant files, do C4 (Self-Check) for each
Sunday:            Time-box B8 + B10 of those 4 files (10 min each, recorded)
```

---

## 📊 Difficulty & Bloom Distribution

Across all 12 files (~120 questions total):

| Difficulty               | Count | %   | Bloom                        |
| ------------------------ | ----- | --- | ---------------------------- |
| 🟢 Green (Foundation)    | ~36   | 30% | L1-L2 (Remember, Understand) |
| 🟡 Yellow (Application)  | ~48   | 40% | L3-L4 (Apply, Analyze)       |
| 🔴 Red (Senior judgment) | ~36   | 30% | L5-L6 (Evaluate, Create)     |

**🔴 Red questions (B8-B10)** are designed to be **interview-realistic Staff/Principal questions** — they require:

- Multi-step structured thinking (5+ phases)
- Quantified business impact ($, %, time)
- Trade-off analysis with named alternatives
- Honest exit/failure criteria
- Counterintuitive insights

If you can confidently answer all 36 🔴 questions in under 6 minutes each with concrete metrics, you are interview-ready for Staff+ at top-tier companies.

> 🇻🇳 **120 câu hỏi total**: 36 xanh (foundation) + 48 vàng (apply) + 36 đỏ (senior judgment). Câu đỏ B8-B10 cấu trúc giống interview thật của Staff/Principal — multi-step + có $ + có trade-off + có exit criteria + có insight phản trực giác.

---

## 🧠 All 12 Mnemonics (Quick Reference Card)

| File | Mnemonic   | Expansion                                                                      |
| ---- | ---------- | ------------------------------------------------------------------------------ |
| 01   | TASC       | Tools, Augment-not-replace, Skill-shift, Code-as-conversation                  |
| 01   | GRRRC      | Generate-Review-Refactor-Run-Capture (workflow)                                |
| 01   | SHIELD     | Six-AI-risks (Security, Hallucination, IP, Eval, Lock-in, Drift)               |
| 02   | RPMECG     | Retrieval, Prompt, Model, Eval, Cost, Guardrails (LLM SD layers)               |
| 03   | HNSW       | Hierarchical Navigable Small World (vector index)                              |
| 04   | PEACE      | Push-to-edge, Eventual, Adapter, Cost, Egress                                  |
| 05   | BDN        | Bun-Deno-Node (decision matrix)                                                |
| 06   | RSC        | Render-Stream-Cache (mental model)                                             |
| 07   | WASM-FACE  | FFI, Async, Components, Edge                                                   |
| 08   | OBE        | Ownership-Borrow-Errors (Rust core triad)                                      |
| 09   | GETS-G     | Goldens, Evals, Traces, Scorecards, Guardrails                                 |
| 10   | JATES      | Judgment, Architecture, Taste, Ethics, Scope                                   |
| 11   | MeLT-SCAN  | Metrics-Logs-Traces + Sampling-Correlation-Auto-Noise                          |
| 12   | PAVED-RoaD | Portal, Abstractions, Versioned, Experience, Developer-as-customer, Road, Docs |

---

## 🎓 Pedagogical Structure (Same in every file)

Every file follows the **Phase 2 checklist** from `specs/knowledge-generation-process.md`:

```
🌍 Real-World Scenario opener
   ↓
A. FOUNDATION (A1-A8)
   A1 Memory Hook (mnemonic)
   A2 Why It Matters Now (3 reasons + VI)
   A3 Layer 1 Beginner mental model (analogy + ASCII)
   A4 Layer 2 Intermediate (4 core concepts + diagrams)
   A5 Layer 3 Senior/Staff (5 hard problems)
   A6 Common Mistakes (10-row table: Sai lầm | Tại sao | Đúng là)
   A7 Interview Pattern (when/who asks)
   A8 Knowledge Chain (prereqs + unlocks + cross-track)
   ↓
B. INTERVIEW Q&A (B1-B10)
   3 🟢 Green (L1-L2)
   3-4 🟡 Yellow (L3-L4)
   3 🔴 Red (L5-L6) — including B8 design, B9 diagnose, B10 leadership pitch
   Each with 💡 Interview Signal (✅ Strong / ❌ Weak)
   ↓
C. MASTERY (C1-C7)
   C1 Topic Overview Card (boxed summary)
   C2 Q&A Summary Table (all 10 questions ranked)
   C3 Cold Call (30-second pitch using mnemonic)
   C4 Self-Check (5-item quiz with answers)
   C5 Feynman Test (explain to non-technical, ~250 words)
   C6 Spaced Repetition Schedule (1→3→7→14→30→quarterly)
   C7 Connections Map (same-track + cross-track + further reading)
```

---

## 🇻🇳 Vietnamese Reinforcement

Mỗi file đều có **bilingual EN + VI**:

- Mnemonic VI catchphrase (vd "Mê Lạnh Trời Sáng Cần Áo Nóng" cho MeLT-SCAN)
- Tóm tắt VI sau mỗi phần A2, A3
- Common Mistakes table 100% bằng tiếng Việt với 3 cột
- Câu trả lời B-section: ngôn ngữ trực tiếp tiếng Việt cho phỏng vấn ở VN
- Feynman test: hoàn toàn bằng tiếng Việt, dùng ẩn dụ đời sống VN (bếp ăn, tiệm phở, biker, etc.)

> Mục tiêu: Đọc xong 1 file = (1) hiểu khái niệm bằng tiếng Anh để nói interview với Western company, (2) giải thích được bằng tiếng Việt cho đồng nghiệp/junior, (3) nhớ lâu nhờ mnemonic + spaced repetition.

---

## 🏢 Real Companies Referenced

To ensure interview signal, every file uses **real companies + real incidents** as anchors. Aggregate list across the track:

**AI / ML**: Anthropic, OpenAI, Intercom (Fin), Klarna, Notion AI, Shopify Sidekick, Hugging Face, Cursor, GitHub Copilot, Air Canada (chatbot incident), DPD, NYC MyCity, Cohere, Pinecone, Weaviate, Chroma

**Edge / Runtime**: Cloudflare (Workers, D1, R2, Durable Objects, Pingora), Vercel, Deno Deploy, Bun, Fly.io, Netlify, AWS Lambda

**Frontend**: Sonos (RSC migration), Vercel, Shopify, Notion, Discord, Figma, Linear

**Systems / Rust**: Discord (read states), Cloudflare (Pingora 2022), 1Password (typhon), Dropbox (Magic Pocket), Mozilla (servo), Microsoft (Azure Rust adoption)

**Observability**: Datadog (March 2023 outage), Honeycomb, Grafana Labs, Adevinta, Booking.com, New Relic/Pixie, Isovalent, VNG ZaloPay (Tết 2025)

**Platform / DX**: Spotify (Backstage), Mercedes-Benz, American Airlines, Expedia, HBO Max, LinkedIn, Netflix (Spinnaker/Titus), Humanitec, Roadie

**Senior / Org**: Stripe (Q2 2025 activity allocation), Shopify (CEO memo April 2025), GitHub (Copilot data), Anthropic (Mike Krieger hiring rubric June 2025)

---

## ✅ Completion Checklist

Use this when you finish a file:

- [ ] Read 🌍 Scenario, can recall the company name + lesson
- [ ] Recite mnemonic without looking
- [ ] Drew the 3 main ASCII diagrams from memory
- [ ] Answered C4 Self-Check with 5/5
- [ ] Wrote Feynman explanation (~250 words VI)
- [ ] Time-boxed B8/B9/B10 answers, recorded voice, played back
- [ ] Added file to spaced repetition tracker (D+1, D+3, D+7, D+14, D+30)
- [ ] Cross-linked into 2 other files via Connections Map (C7)

---

## 🔗 Cross-Track Integration

These 2026 trend files **interlock with each other** and with the existing 4 tracks (`shared/`, `fe-track/`, `be-track/`, `system-design/`):

```
                    ┌───────────────────────────────┐
                    │   2026 TRENDS (this track)     │
                    │   12 files, ~9,800 lines       │
                    └────────────┬──────────────────┘
                                 │
        ┌────────────┬───────────┼────────────┬────────────┐
        ▼            ▼           ▼            ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐
   │ shared/ │ │fe-track/│ │be-track/ │ │ system- │ │ behavioral│
   │ funds   │ │  React  │ │microsvc  │ │  design │ │   / soft  │
   └─────────┘ └─────────┘ └──────────┘ └─────────┘ └──────────┘
```

**Key interlocks within 2026-trends**:

- 01 (AI-augmented) ↔ 09 (AI eval) ↔ 10 (Senior) ↔ 12 (Platform) form the **AI-era senior cluster**
- 02 (LLM SD) ↔ 03 (Vector DBs) ↔ 09 (AI eval) form the **AI production cluster**
- 04 (Edge) ↔ 05 (Runtimes) ↔ 06 (RSC) ↔ 07 (Wasm) form the **modern web cluster**
- 11 (Observability) ↔ 12 (Platform) form the **production excellence cluster**

---

## 🚀 Next Steps After Mastering This Track

1. **Mock interviews** — Pair with someone, time-box B8-B10, swap files weekly
2. **Build a "trend portfolio"** — pick 2 trends, build small demos, write blog posts
3. **Stay current** — these trends evolve fast. Re-read C7 (Further Reading) quarterly
4. **Teach back** — Use C5 (Feynman) to teach a junior; gaps in their understanding = gaps in yours
5. **Contribute** — Found a 2026 trend not covered? Open a doc PR following the same Phase 2 structure

---

> **🎯 Total study investment**: ~40 hours focused = full mastery.
> **📈 Expected interview lift**: From mid-senior → staff/principal-ready in AI-aware orgs.
> **🇻🇳 Vietnamese-speaking advantage**: This is one of the few resources covering 2026 trends bilingually with VI mnemonics + Feynman in VI — strong differentiator for VN engineers targeting Western remote roles.

> **Back to**: [📚 Master TOC](../00-table-of-contents.md)
