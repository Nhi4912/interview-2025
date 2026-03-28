# Mock Interview — Behavioral Round / Vòng Behavioral Mô Phỏng

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **L5 Competencies**: Scope & Impact (15pts), Communication (10pts), Leadership (10pts), Ownership (10pts)
> **See also**: [STAR Method](../../shared/09-behavioral/01-star-method.md) | [Scope & Impact](../../shared/08-l5-competencies/01-scope-and-impact.md) | [Common Questions](../../shared/09-behavioral/03-common-questions.md)

---

## How to Use / Cách Dùng

1. Set timer: **5 minutes** per question (real interviews give 5-7 min each)
2. **Record yourself** answering — listen back for filler words, structure
3. Use STAR format for EVERY answer (Situation → Task → Action → Result)
4. Practice with a friend who gives follow-ups
5. Self-evaluate using the rubric at the bottom

---

## Pre-Interview Preparation: Build Your Story Bank

Chuẩn bị **5-7 stories** cover tất cả competencies. Mỗi story có thể reframe cho nhiều câu hỏi khác nhau.

```
Story Bank Template:
┌─────────────────────────────────────────────────────┐
│ Story: [Short title]                                 │
│ Project: [Where/when]                                │
│ Competencies: [Which L5 competencies it demonstrates]│
│                                                      │
│ S: [1-2 sentences — context, stakes]                 │
│ T: [What was YOUR specific responsibility]            │
│ A: [3-5 specific actions YOU took]                   │
│ R: [Quantified outcome + lessons learned]            │
│                                                      │
│ Can reuse for: [list question types]                 │
└─────────────────────────────────────────────────────┘
```

**Example story bank entry:**

```
Story: "Checkout Flow Redesign"
Project: E-commerce app, 2024
Competencies: Scope & Impact, Ownership, Problem-Solving

S: Checkout had 30% abandonment. PM said "improve checkout" — no specs.
T: Own the entire checkout improvement as senior FE engineer.
A: (1) Analyzed funnel data → 3 drop-off points
   (2) Proposed 3 options to PM with cost/impact
   (3) Recommended option 2 (address form redesign — 60% of drops)
   (4) Coordinated with BE team on address API
   (5) A/B tested with 10% traffic first
R: Abandonment 30% → 18%. Pattern adopted by mobile team.

Can reuse for: "Tell me about ownership", "Ambiguous requirements",
               "Data-driven decisions", "Cross-team collaboration"
```

---

## Round 1: Scope & Impact Questions

### Q1: "Tell me about a time you owned a significant project end-to-end." 🟡 Mid

**What interviewer evaluates:**
- Did you own it or just implement someone else's plan?
- Was the scope L5-worthy (flow/surface level, not just a ticket)?
- Did you handle ambiguity, or were requirements clear?

<details>
<summary>🔑 Strong Answer Structure</summary>

```
SITUATION (15 sec): Set the context — what was the business problem?
  "Our checkout flow had 30% abandonment rate, costing ~$2M/quarter."

TASK (10 sec): YOUR specific role (not "the team")
  "I was tasked with owning the checkout improvement as the senior FE engineer."

ACTION (2 min): 3-5 specific things YOU did
  "First, I analyzed the funnel data and identified three drop-off points..."
  "I proposed three approaches to PM with trade-off analysis..."
  "I coordinated with the backend team on API changes..."
  Use "I" not "we". Be specific.

RESULT (15 sec): Quantified outcome + broader impact
  "Abandonment dropped from 30% to 18%. The pattern was adopted by the mobile team."
```

**Red flags interviewers catch:**
- ❌ "The team decided..." → Where is YOUR ownership?
- ❌ "PM told me to build X" → You're describing L3 scope
- ❌ No metrics → "It was better" is not a signal
- ❌ Only code → Interviewer wants scope + impact, not implementation

</details>

**Follow-ups to prepare for:**
1. "What was the hardest decision you made in this project?"
2. "If you could do it again, what would you change?"
3. "How did you get buy-in from stakeholders for your approach?"

---

### Q2: "Describe a time you had to make a difficult scope decision under time pressure." 🔴 Senior

<details>
<summary>🔑 Strong Answer Structure</summary>

Show the framework: **Constraint → Options → Data → Decision → Communication**

"We had 4 weeks before launch. I identified 3 features at risk. I proposed cutting feature X (affected 5% of users) to ensure feature Y (affected 80%) shipped solid. I presented the data to PM, got alignment, documented the decision in an ADR, and we shipped feature X in v2 three weeks later."

**Key elements:**
- Quantified the trade-off (5% vs 80%)
- YOU proposed the cut (not PM or manager)
- Used data, not gut feeling
- Documented the decision
- Had a plan for what was cut (v2)

</details>

---

## Round 2: Problem-Solving & Technical

### Q3: "Tell me about a complex technical problem you debugged." 🟡 Mid

<details>
<summary>🔑 Strong Answer Structure</summary>

Show structured debugging process:

"Our React app had a memory leak in production — heap growing 50MB/hour. I used Chrome DevTools Performance/Memory tab to take heap snapshots. Found that a useEffect in our WebSocket component wasn't cleaning up event listeners on unmount. Each navigation re-mounted the component → accumulated listeners → retained DOM nodes. Fix: added cleanup function in useEffect return. Wrote a ESLint rule to catch missing cleanups team-wide."

**Key elements:**
- Specific symptoms with metrics (50MB/hour)
- Systematic approach (not "I tried random things")
- Root cause identified clearly
- Fix + prevention (ESLint rule = team-level improvement)

</details>

### Q4: "How do you approach making technical decisions when there's no clear right answer?" 🔴 Senior

<details>
<summary>🔑 Strong Answer Structure</summary>

Show decision framework:

"When choosing between SSR and SPA for our new product, I:
1. Listed requirements: SEO needed? Real-time? Content-heavy?
2. Evaluated 3 options with a comparison matrix (SSR, SPA, Hybrid)
3. Built a proof-of-concept for the top 2 candidates (2 days each)
4. Measured: SSR scored better on LCP (-1.2s) but worse on interactivity
5. Wrote an ADR documenting the decision, trade-offs, and reversal criteria
6. Presented to team for feedback before committing

The key is making the decision reversible when possible and documenting WHY, so future engineers understand the context."

</details>

---

## Round 3: Leadership & Collaboration

### Q5: "Tell me about a time you mentored someone." 🟡 Mid

<details>
<summary>🔑 Strong Answer Structure</summary>

"A new junior engineer joined our team and struggled with React state management. Instead of fixing her PRs, I:
1. Paired with her on a feature — let her drive, I asked guiding questions
2. Created a 'State Management Decision Tree' document for the team
3. Set up weekly 1:1s focused on specific growth areas
4. Gave feedback using SBI (Situation-Behavior-Impact): 'In yesterday's PR, when you added state to the parent component, it caused unnecessary re-renders in 5 children. Using context or moving state down would fix this.'

After 3 months: she was independently designing component state architecture and mentoring newer joiners."

**Key:** Show structured mentoring, not just "I helped when asked."

</details>

### Q6: "Describe a time you disagreed with a technical decision. How did you handle it?" 🔴 Senior

<details>
<summary>🔑 Strong Answer Structure</summary>

Show disagree-and-commit pattern:

"Tech lead proposed using Redux for a new project. I disagreed because:
1. Our data was mostly server-state (better fit for React Query)
2. Redux boilerplate would slow development velocity
3. Team had no Redux experience

My approach:
- I didn't argue in the meeting (avoid public confrontation)
- Scheduled a 1:1 with the tech lead
- Prepared a comparison: Redux vs React Query for our specific use case
- Showed a 30-min prototype with React Query solving our top 3 data needs
- Acknowledged Redux's strengths for cases we didn't have

Outcome: Tech lead agreed. We used React Query — reduced data-fetching code by 60%. I wrote migration guide for team.

Key principle: Disagree with DATA, not opinions. And always provide an alternative, not just criticism."

</details>

---

## Common Follow-Up Patterns

Interviewers use these follow-up patterns to probe depth:

```
Pattern 1: "Go deeper"
  "What specifically did YOU do vs what the team did?"
  "Walk me through the technical details of that decision."
  → Preparation: Know the technical details of every story

Pattern 2: "Challenge the decision"
  "What would you do differently now?"
  "What if you had half the time?"
  → Preparation: Have honest retrospectives for each story

Pattern 3: "Expand scope"
  "How would this work with 10x more users?"
  "What if you had 3 more engineers?"
  → Preparation: Think about scaling each story

Pattern 4: "Test values"
  "What if your manager disagreed with your approach?"
  "How do you handle underperforming team members?"
  → Preparation: Have principled answers, not "it depends"
```

---

## Vietnamese Developer-Specific Tips

```
Common pitfalls for Vietnamese devs in behavioral rounds:

❌ Being too humble: "I just helped the team"
✅ Be specific: "I proposed the architecture and led the implementation"

❌ Avoiding conflict stories: "We never had disagreements"
✅ Show constructive disagreement: "I disagreed but with data and alternatives"

❌ Only talking about code: "I wrote a custom hook that..."
✅ Talk about impact: "The custom hook reduced development time by 30% for 5 devs"

❌ Short answers (< 1 min): "I fixed the bug and it worked"
✅ STAR structure: full story with context, YOUR actions, and measured results

❌ No questions at the end: passive
✅ Ask 2-3 questions about team culture, tech stack decisions, growth path
```

---

## Evaluation Rubric / Bảng Đánh Giá

| Criterion | 1 (Weak) | 2 (Developing) | 3 (Strong) | 4 (Excellent) |
|-----------|----------|----------------|------------|----------------|
| **Structure** | Rambling, no STAR | Attempted STAR but unfocused | Clear STAR with good pacing | Perfect STAR + proactive follow-up anticipation |
| **Ownership** | "The team did..." | "I helped with..." | "I led/proposed/decided..." | Clear individual impact with team context |
| **Specificity** | Vague, generic | Some details | Specific actions + metrics | Precise metrics + lessons learned |
| **Scope** | Task-level stories | Feature-level | Flow/surface-level (L5 scope) | Initiative-level with cross-team impact |
| **Self-awareness** | "Everything went well" | Some reflection | Honest about trade-offs/mistakes | Deep reflection + how it changed approach |
| **Communication** | Hard to follow, monotone | Clear but flat | Engaging, well-paced | Storytelling: hooks listener, builds tension |

**Target:** 🟡 Mid = average 2.5+, 🔴 Senior = average 3.5+

---

## Connections / Liên Kết

- ⬅️ **Frameworks**: [STAR Method](../../shared/09-behavioral/01-star-method.md) | [Scope & Impact](../../shared/08-l5-competencies/01-scope-and-impact.md)
- 🔗 **Leadership**: [Leadership Principles](../../shared/09-behavioral/02-leadership-principles.md) | [Leadership & Mentoring](../../shared/08-l5-competencies/05-leadership-and-mentoring.md)
- ➡️ **Other rounds**: [Coding Mock](./01-coding-round.md) | [System Design Mock](./02-system-design-round.md)
