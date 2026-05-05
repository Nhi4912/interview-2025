# AGENTS.md — 06-ai-and-agents

## OVERVIEW

AI/ML fundamentals → production engineering pipeline, written for non-ML software engineers.
Bilingual (EN/VI); targets 2025–2026 roles at Grab, VinAI, Shopee where daily collaboration with ML teams is the norm.

---

## STUDY ORDER

1. **01** — ML basics first; builds vocabulary for everything downstream.
2. **02** — Transformer architecture / LLM internals; required before reading agent patterns.
3. **03 → 04** — Applied patterns: agents (03) then retrieval (04); can be read in parallel once 02 is solid.
4. **05** — Prompt engineering & fine-tuning practice; bridges theory → daily engineering work.
5. **06 → 07** — System design (06) then production challenges (07); intentionally ordered — design before failure modes.
6. **08** — Evaluation & testing; reads best after seeing what can go wrong in 07.
7. **09** _(optional)_ — Claude/Anthropic deep-dive; vendor-specific, skip if interviewing at non-Anthropic shops.
8. **10** — AI-era IC skills; largest file (1622 lines), treat as a survival guide — skim first, re-read after finishing 01–09.

---

## WHERE TO LOOK

| Topic                                                                     | File   |
| ------------------------------------------------------------------------- | ------ |
| Training / inference / evaluation metrics / data drift                    | **01** |
| Transformer architecture / attention / tokenization / positional encoding | **02** |
| ReAct / multi-agent orchestration / tool-use / planning loops             | **03** |
| Vector DB / chunking strategies / hybrid search / embedding models        | **04** |
| Prompt engineering / few-shot / fine-tuning / context window management   | **05** |
| AI-app system design / model serving / latency budgets / caching          | **06** |
| Hallucinations / cost control / safety guardrails / abuse patterns        | **07** |
| Offline eval / online eval / A/B for models / red-teaming                 | **08** |
| Claude internals / Anthropic API / Constitutional AI / RLHF specifics     | **09** |
| AI-era IC competencies / staying relevant / new engineering contracts     | **10** |

> Workflow: open the file, read first ~30 lines for section headers, then jump to the relevant heading.

---

## LOCAL CONVENTIONS

- **Vietnamese company anecdotes** — real examples embedded (VinAI churn prediction, Grab surge pricing ML, Shopee recommendation cold-start); use them as anchor stories in interviews.
- **Multi-level Why blocks** — each concept has Why-1 (what it solves) → Why-2 (why that matters at scale) → Why-3 (business impact); read all three before skipping ahead.
- **Feynman analogies** — every major concept gets a plain-language restatement; if the analogy feels too simple, that's intentional — use it verbatim when explaining to non-ML interviewers.
- **🧠 Memory Hooks** — one-liner mnemonics per concept (e.g., "RAG = retrieval gives LLM a cheat sheet"); treat these as flashcard seeds, not definitions.

---

## CROSS-REFERENCES

- **AI-related coding interviews / repo `.opencode/` agent setup** → root `AGENTS.md`
- **System-design primitives applied to AI services** (queues, caches, sharding) → `../02-system-design/`
- **LLM security — prompt injection, jailbreaks, data exfiltration via models** → `../04-security/03-web-security-owasp.md`

---

## ANTI-PATTERNS

- **Do NOT promote `09` content into general AI files.** Claude-specific APIs, Constitutional AI mechanics, and Anthropic-internal details are intentionally siloed — vendor lock-in by design; leaking them into 01–08 reduces portability.
- **Do NOT add framework-specific code (LangChain chains, LlamaIndex node parsers) unless purely illustrative.** Keep concepts portable; frameworks change faster than concepts.
- **Do NOT duplicate vector-DB internals here.** HNSW indexing, ANN algorithms, and storage layouts already live in `../03-database/03-nosql-and-newsql.md` — cross-reference instead.
- **Do NOT merge `07-production-challenges` with `08-evaluation`.** They cover different lifecycle phases: 07 = runtime failures in production; 08 = systematic quality measurement before and after deployment.
- **Do NOT renumber files.** Filenames are stable references used in cross-links, study schedules, and spaced-repetition decks — renaming breaks all of them silently.
