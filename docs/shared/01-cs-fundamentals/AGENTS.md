# AGENTS.md — 01-cs-fundamentals

## OVERVIEW

Theory-only CS foundations, language-agnostic. No code implementations — concepts and mental models only. Consumed by both FE and BE tracks.

---

## WHERE TO LOOK

| Interview Topic                                                             | File                                |
| --------------------------------------------------------------------------- | ----------------------------------- |
| Big-O, amortized analysis, Θ / Ω / O notation                               | `complexity-analysis.md`            |
| Arrays, linked lists, hash maps, trees, graphs — theory                     | `data-structures-theory.md`         |
| Sorting, searching, DP, graph algorithms, 15 core patterns                  | `algorithms-theory.md`              |
| Processes, threads, scheduling, virtual memory, file descriptors            | `os-theory.md`                      |
| OSI layers, TCP/UDP, HTTP/2, TLS, DNS, latency sources                      | `networking-theory.md`              |
| Concurrency vs parallelism, mutex, deadlock, race conditions, memory models | `07-concurrency-and-parallelism.md` |
| Turing machines, Halting Problem, P vs NP, decidability                     | `08-computation-theory.md`          |
| Entropy, cross-entropy, compression theory, coding bounds                   | `information-theory.md`             |

---

## CROSS-REFERENCES

| Applied topic                              | Location                                            |
| ------------------------------------------ | --------------------------------------------------- |
| Go goroutines, channels, `sync` primitives | `../../be-track/01-golang/03-concurrency.md`        |
| JS event loop, async/await, microtasks     | `../../fe-track/01-javascript/`                     |
| Go-specific data structure implementations | `../../be-track/01-golang/06-data-structures-go.md` |
| LeetCode problem practice by pattern       | `../../leetcode/`                                   |

---

## FILE NAMING NOTE

6 unnumbered (`*-theory.md`) + 2 numbered (`07-*`, `08-*`) — **intentional, do not renumber**. Unnumbered = standalone reference; numbered = late additions inserted at curriculum position.

---

## ANTI-PATTERNS

- ❌ Don't add language-specific implementations (Go, JS, Python) — theory only; implementations belong in track-specific dirs.
- ❌ Don't write algorithm walkthroughs or worked examples here — step-by-step practice belongs in `../../leetcode/`.
- ❌ Don't conflate concurrency theory (`07-concurrency-and-parallelism.md`) with Go concurrency primitives (`be-track/01-golang/03-concurrency.md`) — theory ≠ implementation.
- ❌ Don't renumber files — `07-` and `08-` prefixes are stable anchors; cross-links depend on exact filenames.
- ❌ Don't expand `08-computation-theory.md` or `information-theory.md` beyond senior-interview scope — reference-only; additions require clear interview justification.
