# AI-Augmented Frontend Workflow / Quy Trình Frontend Có AI Hỗ Trợ

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: Solid React + TypeScript fundamentals
> **See also**: [Web Components & Shadow DOM](./01-web-components-shadow-dom.md) | [Micro-Frontends at Scale](./03-micro-frontends-scale.md) | [Frontend Testing](../14-frontend-testing.md)

---

## 🌍 Real-World Scenario — The Interview Trap Everyone Falls Into

2026. Cuộc phỏng vấn Senior FE tại một công ty product. Interviewer đặt câu hỏi tưởng chừng đơn giản:

> _"How do you use AI tools in your daily development workflow?"_

Hai câu trả lời sai phổ biến nhất:

**❌ Sai lầm #1 — Defensive denial:**

> "Honestly, I prefer writing all my code by hand. I learn more that way and I don't trust AI."

Interviewer nghe thấy gì? _"Tôi sẽ chậm hơn 30-50% so với đồng đội, và tôi tự hào về điều đó."_ Năm 2026, không dùng AI tools trong lập trình cũng giống như không dùng IDE autocomplete năm 2010 — không phải sự thuần khiết, mà là cản trở.

**❌ Sai lầm #2 — Uncritical enthusiasm:**

> "AI writes about 80% of my code. I just review it and ship."

Interviewer nghe thấy gì? _"Tôi không thực sự hiểu codebase của mình. Security, correctness, architecture? Không phải vấn đề của tôi."_ Đây là candidate đáng sợ nhất ở production.

**✅ Câu trả lời đúng nằm ở chỗ khác:**

> "I use AI as a force multiplier, not a replacement. Boilerplate, test generation, refactoring — AI handles 60-70% of the mechanical work, which frees me for architecture, critical review, and the parts that actually require judgment. But I have hard rules about what I never let AI write without deep review: auth flows, payment logic, security-sensitive code, anything touching PII. And I always run typecheck + tests after an AI change. Let me walk you through my actual workflow…"

**Đây mới là tín hiệu Senior.** Câu hỏi này không hỏi về tools — nó hỏi về **judgment**.

> 🇻🇳 **Tóm tắt**: Câu hỏi "bạn dùng AI như thế nào?" là bẫy phỏng vấn. Không dùng = chậm chạp. Dùng quá = thiếu judgment. Câu trả lời chuẩn là: dùng AI có chủ đích, có guardrails, có lý do rõ ràng khi nào không dùng.

---

## A1. 🧠 Memory Hook — **"DIRECT"**

| Letter | Stands For                   | One-line                                       |
| ------ | ---------------------------- | ---------------------------------------------- |
| **D**  | **Direct** the AI            | You are the architect, AI is the contractor    |
| **I**  | **Inspect** every output     | Never accept "looks right"                     |
| **R**  | **Run** verification always  | typecheck + lint + tests after every AI change |
| **E**  | **Exclude** critical code    | Auth, crypto, payment — human eyes only        |
| **C**  | **Context** is everything    | Bad prompt = bad code = silent tech debt       |
| **T**  | **Track** AI-introduced debt | Tag it, own it, fix it forward                 |

> 🇻🇳 **Catchphrase**: _"DIRECT — bạn là kiến trúc sư, AI là thợ xây. Thợ xây giỏi vẫn cần bản vẽ của bạn."_

---

## A2. 🎯 What & Why — Cái Gì & Tại Sao

### The 2026 Reality

AI coding tools đã vượt qua giai đoạn "hype" và trở thành **table stakes** — cơ sở kỳ vọng tối thiểu cho một FE developer chuyên nghiệp. Không phải vì AI thay thế được tư duy, mà vì:

1. **Velocity gap**: Developer dùng AI tốt viết code nhanh hơn 40-70% trên các tác vụ cơ học. Gap này có nghĩa là team với AI adoption tốt ship 2x nhiều feature mà không hire thêm người.
2. **The skill shift**: Câu hỏi không còn là _"bạn có thể viết debounce function không?"_ mà là _"bạn có thể **direct AI** để ra production-grade debounce với proper TypeScript, edge cases, và test coverage không?"_ Đây là skill khác — cao cấp hơn, không phải thấp hơn.
3. **Three modes of AI use** (quan trọng để phân biệt):

```
┌────────────────────────────────────────────────────────────┐
│  MODE 1: AUTOCOMPLETE                                       │
│  GitHub Copilot inline → single-line to single-function     │
│  Latency: <200ms | Scope: current cursor context           │
│  Mental model: "super-powered Tab key"                      │
├────────────────────────────────────────────────────────────┤
│  MODE 2: CHAT / PAIR PROGRAMMING                            │
│  Cursor Compose, Claude Code chat → multi-file, directed    │
│  Latency: 2-30s | Scope: file + cross-file context         │
│  Mental model: "junior dev who never tires"                 │
├────────────────────────────────────────────────────────────┤
│  MODE 3: AUTONOMOUS AGENT                                   │
│  Claude Code background tasks, Cursor Agent → long tasks    │
│  Latency: minutes | Scope: entire repo + test runner       │
│  Mental model: "contractor: give spec, review PR"           │
└────────────────────────────────────────────────────────────┘
```

> 🇻🇳 **Tóm tắt**: AI tools 2026 là standard. Không có tool = competitive disadvantage. Nhưng dùng đúng cách mới là điều phân biệt Senior và "code monkey with AI subscription". Ba mode: autocomplete (tab thần thánh), chat (pair với AI), agent (giao việc và review).

---

## A3. Part 1 — The Tool Landscape / Bản Đồ Công Cụ

### So sánh các công cụ chính năm 2026

| Tool               | Mode                       | Strengths                                                                                | Weaknesses                                                                     | When to use                                                                             |
| ------------------ | -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| **GitHub Copilot** | Inline autocomplete + chat | Deep VS Code/JetBrains integration; enterprise SSO; trained on GitHub public code        | Weak cross-file context; chat less powerful than Cursor; requires subscription | Default for teams on GitHub Enterprise; best for inline autocomplete throughout the day |
| **Cursor**         | Chat + Compose + Agent     | Best cross-file context window; Composer for multi-file edits; agent mode runs tests     | Expensive ($20-40/mo); forks VS Code (version lag); vendor lock-in             | Primary daily driver for complex refactoring, multi-file features, debugging sessions   |
| **Claude Code**    | Terminal agent             | Deepest reasoning; runs real bash commands; excellent for migrations and large refactors | Requires CLI discipline; no GUI; slower than autocomplete                      | Long-running tasks: "migrate all components to new prop API", test generation at scale  |
| **Windsurf**       | Chat + Agent               | Cascade agent is smooth; good UX; competitive pricing                                    | Newer, smaller ecosystem; less community content                               | Teams wanting Cursor-like UX without Cursor pricing                                     |
| **Continue**       | Chat (open source)         | Free/self-hosted; works with any LLM backend (Ollama, Bedrock); privacy-first            | Setup overhead; no agent mode; less polished                                   | Privacy-conscious orgs, open-source projects, teams running local models                |
| **Cline**          | Agent (VS Code ext)        | Open source; very transparent about what it does; configurable                           | Slower iteration; requires manual approval of each action                      | High-trust-needed tasks where you want full transparency                                |
| **v0.dev**         | UI generation              | Excellent for Tailwind + shadcn/ui starters; design-to-code                              | React/Tailwind only; generic aesthetic; needs customisation                    | Starting point for new UI components, prototypes, design handoff acceleration           |
| **bolt.new**       | Full-stack generation      | Entire app scaffolding in browser; runs in StackBlitz                                    | Not for existing codebases; starting fresh only                                | Hackathons, demos, client proofs-of-concept                                             |

**Lời khuyên thực tế:**

- Daily driver: **Cursor** (professional) hoặc **Copilot** (budget/enterprise)
- Long tasks: **Claude Code** từ terminal
- New UI: bắt đầu với **v0.dev**, rồi customise
- Privacy/self-hosted: **Continue** + Ollama hoặc AWS Bedrock

> 🇻🇳 **Tóm tắt**: Không có tool nào "tốt nhất" cho tất cả. Cursor + Claude Code = combo phổ biến cho senior dev. Copilot = tốt cho team lớn với GitHub Enterprise. v0 = khởi điểm UI nhanh. Biết khi nào dùng cái gì quan trọng hơn biết tất cả features của một cái.

---

## A4. Part 2 — Workflows That Work / Quy Trình Hiệu Quả

### A4.1. Boilerplate Scaffolding — ROI cao nhất

**EN**: The highest-leverage AI use. Forms, CRUD UIs, test file skeletons, API client boilerplate — anything with a repeatable shape but no unique logic.

**VI**: Đây là nơi AI tạo ra ROI cao nhất. Form components, CRUD interfaces, test scaffolding — những thứ có cấu trúc lặp đi lặp lại nhưng không có business logic đặc biệt.

```typescript
// Prompt gửi cho AI:
// "Create a TypeScript React component for a user profile form.
//  Fields: displayName (required), email (required, validated),
//  bio (optional, max 280 chars), avatarUrl (optional, URL validated).
//  Use react-hook-form + zod. Include loading state, error states,
//  onSubmit callback. Accessible: all inputs have associated labels,
//  error messages use aria-describedby. Export the schema separately."

// Kết quả AI tạo ra:
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const userProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(280, "Bio must be 280 characters or less").optional(),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UserProfileFormProps {
  defaultValues?: Partial<UserProfileFormData>;
  onSubmit: (data: UserProfileFormData) => Promise<void>;
}

export function UserProfileForm({ defaultValues, onSubmit }: UserProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues,
  });
  // ... AI generates full implementation
}
```

**When this fails**: Khi form có complex conditional logic phụ thuộc business rules ("field X chỉ hiện khi Y và Z đều true và user là admin"). AI sẽ đoán sai — cần bạn specify rõ từng case hoặc tự viết.

### A4.2. Refactoring with AI — Cẩn thận nhưng hiệu quả

**EN**: AI-driven refactors work best when the transformation is mechanical and describable. TypeScript strictness migrations, prop renames across many files, converting class components to hooks — these are high-value tasks.

**VI**: Refactoring bằng AI hiệu quả nhất khi transformation có thể mô tả được rõ ràng. Migration TypeScript strict, đổi tên prop trên nhiều file, chuyển class component sang hooks — đây là những tác vụ có giá trị cao.

```bash
# Prompt ví dụ cho Claude Code:
# "In src/components/, find all components that use the old Button API:
#  <Button type="primary"> → rename to <Button variant="primary">
#  <Button type="danger">  → rename to <Button variant="destructive">
#  After renaming, run `npm run typecheck` and fix any remaining errors.
#  Show me a diff before making changes."
```

**When this fails**: Semantic refactors — khi bạn đổi không chỉ syntax mà còn cả _ý nghĩa_. Ví dụ: "convert all useEffect data fetching to React Query" đòi hỏi hiểu từng side effect, caching strategy, error handling intent. AI thường làm cơ học mà bỏ sót intent — đây là nơi human review không thể bỏ qua.

### A4.3. Test Generation — Cẩn thận về thứ tự

**EN**: Generate tests _from existing implementation_ — not the reverse. AI-generated tests after-the-fact risk confirming buggy behavior, not specifying correct behavior. The safe pattern: implementation first (human), tests second (AI), review third (human verifies tests actually catch real bugs).

**VI**: Generate test từ implementation đã có — không phải ngược lại. AI viết test sau khi thấy code đã pass có nguy cơ confirm behavior sai thay vì verify behavior đúng.

```typescript
// Prompt gửi AI (an toàn):
// "Here is the implementation of `formatCurrency(amount: number, locale: string): string`.
//  [paste implementation]
//  Write vitest unit tests covering:
//  - Normal positive numbers
//  - Zero
//  - Negative numbers
//  - Very large numbers (>1B)
//  - Invalid locale (should fallback gracefully)
//  - Non-number input (TypeScript won't catch at runtime if called from JS)
//  Do NOT look at what the function currently returns for edge cases —
//  write tests based on what it SHOULD return."

// Tại sao instruction cuối quan trọng: nếu không có câu đó,
// AI sẽ run function mentally và write assertions matching
// current (potentially buggy) behavior.
```

**When this fails**: TDD — viết test trước implementation. AI rất tệ ở điều này vì nó muốn tạo ra code pass test ngay lập tức thay vì để test fail trước. TDD vẫn là kỹ năng phải làm tay.

### A4.4. Component Generation from Design — v0 và Mockup-to-Code

**EN**: AI UI generation has reached "good first draft" quality for standard UI patterns. v0.dev, Cursor with screenshot context, and Claude with image input can go from design to working JSX quickly.

**VI**: AI tạo UI đã đạt mức "bản nháp tốt" cho các pattern chuẩn. Thích hợp làm điểm khởi đầu, không phải sản phẩm cuối cùng.

```
Workflow hiệu quả:
1. Screenshot Figma frame → paste vào v0.dev hoặc Claude
2. Specify constraints: "use our design system components from @company/ui,
   not shadcn. TypeScript. All text must be extracted as props.
   Include empty state."
3. Review output: check a11y, check that component API makes sense,
   check that hard-coded values are extracted
4. Customise: style tokens, animation, complex interaction states
5. Add to codebase — never accept v0 output verbatim
```

**When this fails**: Novel interaction patterns, highly animated UIs, complex state machines. AI defaults to the most generic shadcn/Radix pattern it knows. Nếu design của bạn khác với convention — AI sẽ cải thiện design về phía convention thay vì giữ intent gốc.

### A4.5. Code Review with AI — Người review không mệt

**EN**: Use AI as a first-pass code reviewer before human review. It catches XSS patterns, accessibility issues, obvious performance regressions, and TypeScript anti-patterns consistently and quickly.

**VI**: Dùng AI như reviewer không mệt — check nhanh trước khi đẩy lên cho người review. Bắt được nhiều lỗi cơ học.

```bash
# Prompt cho AI review:
# "Review this PR diff. Focus on:
#  1. Security: XSS via dangerouslySetInnerHTML, unvalidated props rendered as HTML,
#     missing input sanitisation
#  2. Accessibility: missing ARIA attributes, keyboard traps, focusable elements
#     without keyboard handler, color-only information
#  3. Performance: unnecessary re-renders, missing memoisation on expensive computations,
#     large bundle imports (moment.js, lodash full import)
#  4. React patterns: missing dependency arrays, stale closures, prop drilling
#     that should be context
#  Output: numbered list of issues, severity (critical/warning/suggestion), and fix."
```

**When this fails**: Kiến trúc-level review — "is this the right abstraction?" AI không có context về codebase history, team conventions, hoặc future roadmap. Đó là việc của senior engineer review.

### A4.6. Documentation Generation — Thực sự tiết kiệm thời gian

**EN**: AI is excellent at generating JSDoc from implementation, README sections from code structure, and ADR (Architecture Decision Record) drafts from conversation context.

**VI**: AI xuất sắc trong việc viết JSDoc từ implementation, README từ cấu trúc code.

```typescript
// Prompt: "Write JSDoc for this function. Include @param, @returns,
// @throws, @example with realistic input/output. Be precise about
// edge cases (null inputs, empty arrays, boundary values)."

/**
 * Formats a monetary amount for display, respecting locale conventions.
 *
 * @param amount - The numeric amount to format (can be negative for debits)
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'VND', 'EUR')
 * @param locale - BCP 47 locale string (e.g., 'en-US', 'vi-VN'). Defaults to browser locale.
 * @returns Formatted currency string with symbol and proper decimal/grouping separators
 * @throws {RangeError} If currencyCode is not a valid ISO 4217 code
 *
 * @example
 * formatCurrency(1234567.89, 'VND', 'vi-VN') // → '1.234.568 ₫'
 * formatCurrency(-50.5, 'USD', 'en-US')       // → '-$50.50'
 * formatCurrency(0, 'EUR', 'de-DE')           // → '0,00 €'
 */
export function formatCurrency(amount: number, currencyCode: string, locale?: string): string {
  // ...
}
```

**When this fails**: High-level architectural documentation — AI không biết _tại sao_ bạn chọn giải pháp này thay vì giải pháp khác. ADR phần "context" và "decision rationale" phải là human-written. AI chỉ làm được phần structure.

### A4.7. Debugging with AI — Hypothesis Generator

**EN**: Paste error + minimal repro context → get ranked list of hypotheses. AI doesn't debug for you — it surfaces theories you test.

**VI**: Dán error + context tối thiểu → nhận danh sách giả thuyết có thứ tự ưu tiên. AI không debug thay bạn — nó gợi ý hướng bạn kiểm tra.

```
Prompt tốt:
"I'm getting this error in production but not locally:
[paste exact error + stack trace]

Context:
- React 18.3, Next.js 14.2, deployed on Vercel Edge
- Error only happens for users in SEA region
- Started after we deployed [specific change]
- Relevant code: [paste 20-30 lines around the error]

Give me 3-5 ranked hypotheses, most likely first. For each:
what evidence would confirm it, and what's the minimal test."

Prompt tệ:
"Why is my code broken?" [no context]
```

**When this fails**: Intermittent race conditions, flaky network issues, environment-specific bugs. AI không thể run code, không thể observe state over time. Những bug này cần profiler, production logs, và patience — không phải AI chat.

> 🇻🇳 **Tóm tắt 7 workflows**: (1) Boilerplate = ROI cao nhất. (2) Refactor = hiệu quả nếu mô tả được. (3) Test = viết sau implementation, verify intent. (4) UI gen = bản nháp tốt, không phải sản phẩm cuối. (5) Code review = first-pass không mệt. (6) Docs = JSDoc tốt, architecture phải tự viết. (7) Debug = AI cho hypothesis, bạn test.

---

## A5. Part 3 — Workflows That Fail / Khi AI Phản Tác Dụng

Biết khi nào KHÔNG dùng AI quan trọng không kém biết khi nào dùng.

### ❌ Architecture Decisions

AI được train trên average của internet. Khi bạn hỏi "should I use Redux or Zustand?", AI cho bạn câu trả lời trung bình của hàng triệu developer — không phải câu trả lời đúng cho team/codebase/constraint cụ thể của bạn. **Architecture kills distinctiveness.** Công ty nào cũng có những tradeoffs riêng; AI không biết chúng.

### ❌ Novel UI Patterns

Yêu cầu AI tạo một interaction pattern không có trong training data của nó — kết quả là AI sẽ "normalize" về pattern gần nhất nó biết. Muốn một custom virtualized masonry grid với drag-to-reorder? AI sẽ cho bạn một generic list với standard drag-and-drop. **Sáng tạo giao diện vẫn là human domain.**

### ❌ Security-Critical Code Without Deep Review

Danh sách tuyệt đối không trust AI một mình:

```
- Authentication flows (OAuth, session management, JWT validation)
- Authorization logic (who can access what)
- Cryptography (key generation, signing, encryption)
- Payment processing (amount calculation, idempotency keys)
- Input sanitization for HTML injection
- CSP configuration
- Rate limiting logic with security implications
- PII handling and GDPR compliance code
```

AI tạo ra code "trông đúng" nhưng có subtle bugs trong security context thường không bị catch bởi TypeScript hay unit tests — chỉ bị catch bởi security audit hoặc, tệ hơn, bởi attacker.

### ❌ Database Schema Design

Schema là commitment dài hạn. AI không biết access patterns của bạn, data volume, query frequency, hoặc future requirements. Schema design cần domain knowledge + experience với production pain — đây là nơi senior judgment không thể replace.

### ❌ "Vibe Coding" Without Verification

Nguy hiểm nhất: accept AI code → merge → ship → không test vì "AI wrote it, it should be fine." Vibe coding tạo ra tech debt nhanh nhất trong lịch sử phần mềm. **Mỗi dòng AI viết là dòng code bạn phải chịu trách nhiệm, không phải AI.**

> 🇻🇳 **Tóm tắt**: Năm trường hợp không dùng AI: (1) Architecture decisions — AI cho kết quả trung bình. (2) Novel UI — AI normalize về generic. (3) Security code — AI tạo "trông đúng" nhưng có thể sai subtle. (4) Schema design — cần domain knowledge. (5) Vibe coding — accept mà không verify là recipe cho disaster.

---

## A6. Part 4 — Prompt Patterns for Frontend / Mẫu Prompt Cho Frontend

Những prompt template này được test thực tế. Copy và điều chỉnh.

### P1. Component Generation Prompt

```
Create a [ComponentName] React component in TypeScript.

REQUIREMENTS:
- Props: [list each prop with type and description]
- Behaviour: [describe what it does, interactions, states]
- Accessibility: WCAG 2.2 AA compliant. All interactive elements keyboard accessible.
  Proper ARIA roles/labels/descriptions. Focus management for [modal/dropdown/etc].
- Performance: Memoize with React.memo if it renders frequently.
  No unnecessary re-renders. Image lazy loading if applicable.
- Testing: Export a [ComponentName].test.tsx alongside. Tests must cover:
  rendering, user interactions, accessibility with @testing-library/react,
  and edge cases (empty state, error state, loading state).
- Styling: Use [Tailwind/CSS modules/styled-components/our design system].
  No inline styles. Responsive: mobile-first.
- TypeScript: Strict. No `any`. Export prop interface as [ComponentName]Props.

CONSTRAINTS:
- Do NOT use [list of things to avoid: specific libraries, patterns]
- Component must work with [specific React version / framework version]
- [Any domain-specific constraints]

OUTPUT FORMAT:
1. Component file
2. Test file
3. Brief note on any assumptions made
```

### P2. Bug-Fix Prompt

````
I have a failing test. Fix the implementation, not the test.

FAILING TEST:
```[paste test code]```

CURRENT IMPLEMENTATION:
```[paste implementation]```

ERROR MESSAGE:
```[paste exact error]```

CONSTRAINTS:
- Do not change the test
- Fix must be minimal — change only what's needed to make this test pass
- If you think the test is testing wrong behaviour, say so but still provide the fix
- After the fix, tell me: could this fix break any related functionality?
````

### P3. Refactor Prompt

````
Refactor the following code.

CURRENT CODE:
```[paste code]```

TARGET STATE:
- [Describe what you want: "use React Query instead of useEffect+fetch",
  "extract to custom hook", "add TypeScript generics", etc.]
- Preserve all existing behaviour (edge cases, error handling)
- Do not change public API (component props / function signatures)
  UNLESS required by the refactor — if required, list the changes

SHOW ME:
1. The refactored code
2. A diff-style summary of changes
3. Any behaviour that might change subtly
4. Migration notes if any consumer code needs updating
````

### P4. Code Review Prompt

````
Review this code change as a senior engineer. Be critical.

DIFF:
```[paste git diff or changed file]```

CONTEXT: This is a [feature/bugfix/refactor] for [brief description].
Stack: React [version], TypeScript strict, [other relevant context].

CHECK FOR:
1. SECURITY: XSS, injection, unvalidated user input rendered to DOM,
   missing auth checks, exposed secrets/keys in code
2. CORRECTNESS: Logic bugs, off-by-one errors, wrong async handling,
   race conditions, stale closures
3. ACCESSIBILITY: Missing ARIA, keyboard navigation broken, focus issues,
   color-only information
4. PERFORMANCE: Unnecessary renders, missing memoisation, N+1 renders,
   large synchronous operations on main thread
5. TYPESCRIPT: Use of `any`, type assertions without justification,
   incorrect generic constraints
6. MAINTAINABILITY: Complex logic without comments, magic numbers,
   test coverage gaps

OUTPUT: Numbered list. Format: [CRITICAL/WARNING/SUGGESTION] - file:line - description - fix
````

### P5. Debugging Hypothesis Prompt

````
Help me debug this error. Generate hypotheses only — I'll investigate.

ERROR:
```[exact error message + stack trace]```

ENVIRONMENT:
- Framework/Runtime: [Next.js 14, Node 20, etc.]
- When it happens: [always / only in production / only for certain users]
- When it started: [after specific deploy / always existed / intermittent]
- What changed recently: [relevant context]

RELEVANT CODE (minimal):
```[paste 20-50 lines most relevant to error]```

GIVE ME:
- 3-5 hypotheses ranked by likelihood
- For each: what evidence would confirm it?
- For each: what is the minimal test to verify?
- What additional information would most help narrow this down?
````

> 🇻🇳 **Tóm tắt**: Năm prompt templates thực chiến. P1 = tạo component với constraints đầy đủ. P2 = fix bug từ failing test. P3 = refactor có kiểm soát. P4 = code review có cấu trúc. P5 = debug bằng hypothesis. Context trong prompt quyết định 80% chất lượng output.

---

## A7. Part 5 — Guardrails / Lan Can An Toàn

Những quy tắc này không phải suggestion — đây là **quy trình bắt buộc** sau mỗi AI interaction.

### Must-Run After Every AI Change

```bash
# 1. TypeScript — catch type errors AI introduced
npm run typecheck   # hoặc tsc --noEmit

# 2. Lint — catch hallucinated APIs, wrong patterns
npm run lint        # oxlint / eslint
npm run lint:fix    # auto-fix safe rules

# 3. Tests — verify behaviour didn't change
npm run test -- --run  # full run, no watch

# 4. Build — ensure it compiles for production
npm run build
```

**Không có exception.** Kể cả khi "chỉ đổi comment." AI tìm cơ hội kỳ lạ để sửa thêm code xung quanh.

### Specific Things to Never Trust Blindly

**❌ AI-generated regex:**

```typescript
// AI tạo ra — "validate Vietnamese phone number"
const vnPhone = /^(0|84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
// Trông đúng. Test với edge cases thực tế trước khi ship.
// Regex AI thường: cover happy path, miss edge cases, miss Unicode issues.
```

**❌ AI-generated security code:**

```typescript
// AI có thể tạo ra sanitiser trông đúng nhưng miss edge cases:
function sanitizeHtml(input: string): string {
  return input.replace(/<script>/gi, "").replace(/<\/script>/gi, "");
  // Bỏ sót: <SCRIPT>, <scr<script>ipt>, event handlers, SVG injection, etc.
  // NEVER roll your own sanitizer. Use DOMPurify.
}
```

**❌ Hallucinated npm packages:**

```typescript
// AI đôi khi invent packages:
import { formatDate } from "@date-fns/locale-vi"; // này có tồn tại không?
import { useVirtualScroll } from "react-virtual-v3"; // version này đúng không?

// Luôn verify: npm info [package-name] trước khi install
```

**❌ Wrong framework version patterns:**

```typescript
// AI train trên old code — có thể generate:
// React class components năm 2026
class MyComponent extends React.Component { ... }  // ❌

// Pages Router khi project dùng App Router
export async function getServerSideProps() { ... }  // ❌ trong app/

// Old Next.js Image với layout prop
<Image src={src} layout="fill" />  // ❌ removed since Next.js 13

// Luôn check: code này đúng với [exact version] trong package.json không?
```

**❌ Deprecated APIs:**

```typescript
// AI có thể generate deprecated React patterns:
import React from 'react'
const App = () => <div>{React.createFactory('div')()}</div>  // deprecated

// Hoặc deprecated Node.js APIs, outdated browser APIs
// Verify against current MDN / React docs
```

### The "Verify Against Actual Data" Rule

AI generate code dựa trên structure nó đoán từ type. Luôn verify với actual data:

```typescript
// AI nhìn type và generate:
interface ApiResponse {
  user: { id: string; name: string; email: string };
}

// AI assume response.user luôn có. Nhưng production API có thể return:
// { user: null } hoặc {} hoặc { user: { id: "123" } /* no name/email */ }

// Sau AI generate: test với actual API response, không phải mocked data
```

> 🇻🇳 **Tóm tắt**: Guardrails bắt buộc: typecheck + lint + test sau MỌI AI change. Không tin regex AI, không trust security code AI, verify npm packages tồn tại, check version patterns. Verify với actual data thực tế, không phải type definition.

---

## A8. Part 6 — Team Adoption Patterns / Cách Đội Áp Dụng

### Transparency về AI trong PR

**Đừng giấu.** Tạo PR culture lành mạnh:

```markdown
<!-- PR description example -->

## Changes

[describe what changed]

## AI Assistance Note

- Boilerplate for UserProfileForm generated with Cursor Compose
- Test cases generated from implementation using Claude Code
- All generated code manually reviewed, modified, and verified with typecheck + tests
- Auth logic and validation written by hand — no AI
```

Lý do không giấu: (1) Trust — nếu reviewer biết AI tham gia, họ review kỹ hơn, tốt hơn. (2) Learning — team học được khi nào AI useful. (3) Accountability — bạn vẫn own code đó, declare it explicitly.

### The AI Rubber Duck

Dùng AI chat để **get unstuck mà không pollute codebase:**

```
"I'm thinking through how to implement [X]. Here's my current thinking: [Y].
What am I missing? What edge cases should I consider?
Don't write code yet — just reason with me."
```

Đây là "rubber duck debugging 2.0": AI không chỉ listen, nó push back. Giải tỏa mental block mà không để lại AI-generated code trong codebase.

### Onboarding Juniors — Cân bằng tốt và nguy hiểm

**Nguy hiểm #1: Copy-paste without understanding.** Junior dùng AI như Google nâng cao — hỏi, nhận code, paste, move on. Không build mental model. Sau 6 tháng: viết code nhanh hơn nhưng không debug được, không architecture được.

**Nguy hiểm #2: Skip fundamentals.** "AI viết debounce cho tôi nên tôi không cần học closure." Nhưng khi debounce bị wrong behavior trong production, junior không có foundation để hiểu tại sao.

**Framework tốt cho junior:**

```
Week 1-4: No AI. Viết tay. Build fundamentals.
Week 5-8: AI cho boilerplate only. Junior phải explain mỗi line AI wrote.
Week 9+:  Full AI usage, nhưng rule: "if you can't explain it, you can't ship it"
```

### Tracking AI-Introduced Bugs

Một số team tag AI-related bugs để học pattern:

```typescript
// git blame sẽ show author, nhưng không show "AI wrote this"
// Convention: trong commit message hoặc comment

// Option 1: Commit message convention
// "feat(form): add UserProfileForm [ai-assisted: boilerplate+tests]"

// Option 2: Issue tracker tag
// "Label: ai-regression" trên bug được phát hiện từ AI code

// Value: sau 3 tháng, bạn biết: AI thường sai ở đâu trong codebase của mình
```

> 🇻🇳 **Tóm tắt**: Ba team patterns: (1) Declare AI trong PR — tạo trust, review chất lượng hơn. (2) AI rubber duck — unstuck mà không để lại rác trong code. (3) Juniors: học fundamentals trước, AI sau — không skip. Track AI bugs để học pattern team mình.

---

## A9. Part 7 — ⚠️ Anti-Patterns / Sai Lầm Phổ Biến

| ❌ Anti-pattern                                     | 🤔 Tại sao nguy hiểm                                                                                          | ✅ Thay thế                                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Accept first AI suggestion without reading          | AI optimize for "looks correct at first glance"                                                               | Đọc toàn bộ output trước khi accept bất kỳ dòng nào                                         |
| Hide AI usage in PRs                                | Reviewer không aware → review superficially → miss AI bugs                                                    | Declare AI assistance trong PR description, đặc biệt phần nào AI viết                       |
| Use AI to skip understanding                        | Career-limiting: fast short-term, fragile long-term. Không debug được, không architect được                   | Dùng AI sau khi understand problem, không thay cho understanding                            |
| Let AI write commit messages without review         | AI commit messages thường generic, misleading: "update component" thay vì "fix race condition in form submit" | Write commit messages yourself — đây là documentation quan trọng                            |
| Generate tests AFTER seeing code pass then accept   | Tests confirm existing (possibly wrong) behavior thay vì specify correct behavior                             | Write test intent trước: "test SHOULD do X" rồi let AI implement, verify manually           |
| Ask AI to "clean up" without specifying constraints | AI sẽ refactor code theo opinionated style riêng của nó, introduce unnecessary changes, break things          | Luôn specify: "refactor for readability only, do not change logic, do not add dependencies" |
| Trust AI for version-specific patterns              | AI training data mixes React 16/17/18/19 patterns — wrong version patterns cause subtle bugs                  | Always specify exact version in prompt, always cross-check with official docs               |
| "One big prompt" instead of iterative               | 500-line output ít reliable hơn 5 × 100-line outputs với review giữa các bước                                 | Break complex tasks thành steps, review mỗi step                                            |

---

## B. Interview Questions — 10 Graded / Câu Hỏi Phỏng Vấn

---

## B1. 🟡 "How do you use AI tools in your daily work?"

**EN Answer** (this is the setup question — your answer signals your whole engineering philosophy):

"I use AI as a force multiplier for mechanical work, not as a replacement for judgment. Specifically: Cursor for inline refactoring and multi-file edits throughout the day; Claude Code for longer autonomous tasks like migration scripts or batch test generation; v0.dev as a starting point when I need a new UI component. The three categories where AI saves me most time: boilerplate scaffolding (forms, CRUD, test files), refactoring with clear mechanical rules (prop renames, API migration), and first-pass code review before I submit a PR. The three categories where I don't let AI have the final word: anything security-sensitive (auth, payment, input sanitization), architecture decisions, and novel interaction patterns where generic output would actually be worse than nothing."

**VI Translation**: Dùng AI như force multiplier cho công việc cơ học, không phải thay thế cho judgment. Cursor hàng ngày, Claude Code cho task dài, v0 cho UI mới. Save time nhất: boilerplate, refactoring cơ học, pre-review. Không trust AI một mình: security code, architecture, novel patterns.

> 💡 **Interview Signal**: ✅ Strong = specific tools, specific categories, clear "where I don't use it". ❌ Weak = "I use Copilot sometimes" or "I don't use it."

---

## B2. 🟡 "Walk me through a time AI gave you wrong code — how did you catch it?"

**EN Answer**:

"There was a time I used AI to generate a sanitization function for user bio text before storing it — the function needed to strip HTML and limit to 280 chars. The AI gave me a regex-based approach that looked correct in testing. It stripped `<script>` tags but I caught that it missed encoded variants — `&#60;script&#62;` and SVG-based injection patterns. I caught it because my verification step includes running the output through our security test suite which we maintain specifically for user-generated content. Replaced it with DOMPurify which is battle-tested for exactly this. The learning: AI can generate 'plausible' security code that passes surface-level inspection. Now I have a hard rule: never let AI write sanitization, CSP, or auth code without a dedicated security review pass."

**VI**: Kể câu chuyện cụ thể: AI viết function lọc HTML, thoáng nhìn đúng, nhưng test suite bắt được nó miss encoded variants. Bài học: AI tạo ra "plausible" security code, không phải "correct" security code.

> 💡 **Interview Signal**: ✅ Strong = specific technical failure, specific detection method, systemic learning (not just "I'll be more careful"). ❌ Weak = "it was wrong once but I caught it" (no specifics).

---

## B3. 🟡 "Show me your prompt for generating a new React component."

**EN Answer**: Pull up P1 from Part 4 or live-demo with a real example. The key is demonstrating you have a structured approach, not just free-form chatting.

Key elements to highlight:

1. Explicit accessibility requirements in the prompt
2. TypeScript strictness instructions
3. "Do not use X" constraints
4. Request for test file alongside component
5. "Note any assumptions" instruction — prevents silent guesses

**VI**: Hiển thị prompt thực tế. Điểm quan trọng: accessibility requirement, TypeScript strict, constraint "đừng dùng X", yêu cầu test file đi kèm.

> 💡 **Interview Signal**: ✅ Strong = structured prompt with constraints, shows systematic thinking. ❌ Weak = "I just ask it to make a button component."

---

## B4. 🟡 "How does AI change how you write tests?"

**EN Answer**:

"Two ways. First: AI accelerates test scaffolding for happy paths and edge cases I specify. Once I have an implementation, I can get 80% of unit test coverage generated in minutes — but I always review the assertions carefully to make sure they test intended behavior, not just observed behavior. Second — and this is the important one — AI changes TDD. I still write test intent first: 'this function should X given Y', but I'm more careful about the order because AI wants to see the implementation and will unconsciously write tests that confirm it. My rule: write the test description and the empty `it('should...')` blocks first, then let AI fill them in against a spec, not against the implementation."

**VI**: AI accelerate test scaffolding sau khi có implementation — nhưng review assertion carefully. TDD vẫn phải human-first: viết test descriptions trước, để AI fill in, nhưng không cho AI thấy implementation trước khi viết tests.

> 💡 **Interview Signal**: ✅ Strong = distinguishes "scaffolding" from TDD, mentions assertion quality risk. ❌ Weak = "AI writes all my tests now."

---

## B5. 🟡 "How do you verify AI-generated code is actually correct?"

**EN Answer**:

"Three-layer verification. Layer 1 — static: TypeScript compiler and oxlint catch type errors, deprecated APIs, and common pattern violations right away. If it doesn't pass typecheck, it doesn't merge. Layer 2 — behavioral: run existing tests. If any regression, dig in. For new AI-generated features, I add tests that specifically target the edge cases the AI might have handled incorrectly — because AI tests tend to cover happy path thoroughly and edge cases poorly. Layer 3 — manual: for anything involving data transformation, I run it against actual production data shapes, not just mocked types. Types lie; actual API responses tell the truth. For security-adjacent code, I go further: manual review against OWASP checklists, or request a dedicated security review."

**VI**: Ba lớp verification: (1) Static — typecheck + lint, mandatory. (2) Behavioral — test suite + add edge case tests AI likely missed. (3) Manual — run against actual data, not just type definitions. Security code: additional OWASP checklist review.

> 💡 **Interview Signal**: ✅ Strong = layered approach, specific mention of "actual data vs types", edge case awareness. ❌ Weak = "I read through it."

---

## B6. 🟡 "Have AI tools made code review easier or harder for you?"

**EN Answer**:

"Both, in different dimensions. Easier: AI as first-pass reviewer before I submit catches obvious issues — unused variables, missing ARIA attributes, console.logs I forgot to remove. That means by the time a human reviews it, the low-hanging fruit is gone and they can focus on architecture and business logic. Harder: in two ways. First, AI-generated code can be 'plausible but subtly wrong' — it compiles, tests pass, but the abstraction is slightly off or an edge case is silently ignored. This is harder to catch than obvious bugs because it looks correct. Second, when a reviewer asks 'why did you do X this way?', if the honest answer is 'the AI did it and I accepted it', that's a problem. I need to be able to defend every architectural decision in my code."

**VI**: Dễ hơn: AI pre-review dọn sạch obvious issues, reviewer human tập trung vào architecture. Khó hơn: AI code "plausible nhưng subtle sai" khó catch hơn obvious bug; và bạn phải có thể defend mọi decision trong code của mình.

> 💡 **Interview Signal**: ✅ Strong = nuanced both/and answer, specific "plausible but subtly wrong" pattern, accountability ownership. ❌ Weak = "much easier, saves time."

---

## B7. 🔴 "What kinds of tasks do you NOT use AI for?"

**EN Answer**:

"Hard rules: (1) Security-critical paths — authentication logic, session management, JWT validation, any cryptographic operation, payment flows, input sanitizers that touch user-generated HTML. AI produces plausible but exploitable code here. (2) Architecture decisions — which state manager to pick, how to split modules, when to use context vs props drilling, service boundaries. AI gives you averaged community wisdom, which is mediocre for your specific constraints. (3) Database schema design for new features — schema is a long-term commitment; AI doesn't know your access patterns, query frequency, or future evolution. (4) Novel interaction patterns where generic output is worse than nothing — if our design team spent weeks crafting a unique UX, accepting an AI-normalized version defeats the purpose. (5) Commit messages and PR descriptions when they document important decisions — these are permanent record; generic AI summaries lose context."

**VI**: Năm loại không dùng AI: (1) Security — auth, crypto, payment, sanitization. (2) Architecture decisions — AI cho kết quả trung bình. (3) Schema design — commitment dài hạn, AI không biết access patterns. (4) Novel UI — AI normalize về generic, giết distinctiveness. (5) Commit messages/PR descriptions về decisions quan trọng — permanent record.

> 💡 **Interview Signal**: ✅ Strong = specific categories with reasoning, not just "I don't trust it." ❌ Weak = "complex tasks" (too vague).

---

## B8. 🔴 "What's the security risk of AI-generated frontend code?"

**EN Answer**:

"Five categories I think about. First: XSS via dangerouslySetInnerHTML — AI frequently generates `dangerouslySetInnerHTML={{ __html: userContent }}` without sanitization when it sees user content needs rendering. Second: regex sanitizers — AI generates sanitizers that miss encoded/obfuscated variants (e.g., strips `<script>` but misses `<scr\x00ipt>` or SVG/MathML injection). Third: client-side auth logic — AI might generate `if (user.role === 'admin') show(adminPanel)` purely on frontend, missing that this needs server-side enforcement too. Fourth: package hallucination — if AI imports a package that doesn't exist and you install the closest name, you might install a malicious package (typosquatting risk). Fifth: secrets in code — AI code sometimes includes `API_KEY=example_key_123` in comments or hardcodes example credentials that a junior might forget to replace. The mitigation: all AI code passes through our ESLint security rules, dangerouslySetInnerHTML is flagged by our linter, and security-adjacent PRs require explicit security review sign-off."

**VI**: Năm rủi ro: (1) XSS qua dangerouslySetInnerHTML không sanitize. (2) Regex sanitizer miss encoded variants. (3) Client-side auth logic không có server enforcement. (4) Package hallucination dẫn đến typosquatting. (5) Hardcoded example credentials trong code. Mitigation: ESLint security rules, lint flag dangerouslySetInnerHTML, security review sign-off cho AI code trong security-adjacent areas.

> 💡 **Interview Signal**: ✅ Strong = specific attack vectors, specific mitigations. ❌ Weak = "AI might write insecure code" (too generic).

---

## B9. 🔴 "How do you onboard a junior who relies too heavily on AI?"

**EN Answer**:

"It's a real problem I've seen. The symptom: they can produce code quickly but can't explain it, can't debug it when it breaks, and can't adapt it when requirements change. My approach is a four-phase ramp. Phase 1 — first month: no AI on assigned tasks. They write everything by hand, with me as pair partner. The goal is building the mental model, not speed. Phase 2 — month 2-3: AI for boilerplate only (scaffolding, repetitive patterns), but with a hard rule: they must be able to explain every line to me in code review. If they can't explain it, it doesn't merge. Phase 3 — month 3-6: full AI usage, but I monitor their questions. If they're asking me 'why isn't this working?' about AI-generated code they don't understand, we pause and trace through it together — building understanding, not fixing the bug. Phase 4 — ongoing: I explicitly teach them my prompt engineering patterns. Better prompts = better code = less debug time = deeper understanding. The goal is AI amplification of a solid foundation, not AI as a substitute for it."

**VI**: Bốn phase: (1) Tháng 1 — không AI, viết tay, build mental model. (2) Tháng 2-3 — AI cho boilerplate, phải explain mỗi line khi review. (3) Tháng 3-6 — full AI, nhưng khi không explain được thì trace through together. (4) Ongoing — dạy prompt engineering tốt. Mục tiêu: AI amplifies foundation, không phải replace foundation.

> 💡 **Interview Signal**: ✅ Strong = phased approach, "explain every line" rule, build understanding not just speed. ❌ Weak = "I tell them to be careful" or "AI is fine for juniors."

---

## B10. 🔴 "Should juniors learn fundamentals if AI can write code for them?"

**EN Answer**:

"Absolutely yes, and I'd argue fundamentals matter _more_ now, not less. Here's why: AI is a powerful amplifier. Amplifiers make everything louder — if you have signal (solid fundamentals), they amplify signal. If you have noise (misunderstood concepts, wrong mental models), they amplify noise. A junior without fundamentals using AI produces plausible-looking tech debt at 3× the speed. I've seen this. A junior with strong JS fundamentals, TypeScript understanding, and React mental models using AI produces production-quality code faster than seniors could five years ago. The skill shift is real — you no longer need to memorize Array.prototype.reduce syntax. But you need to understand when to use reduce versus a for loop, what the performance characteristics are, how it behaves with sparse arrays. That reasoning ability is what separates an effective AI director from an AI cargo-culter. The metaphor I use: knowing how to read a schematic doesn't become less important when you can use CAD software. It becomes more important, because CAD lets you create complex circuits — and you need to understand them."

**VI**: Fundamentals quan trọng hơn, không phải ít hơn, khi có AI. AI amplify — signal tốt thì amplify signal tốt, noise thì amplify noise. Junior không có foundation dùng AI = tech debt đẹp mặt với tốc độ 3x. Junior có foundation dùng AI = senior velocity của 5 năm trước. Metaphor: biết đọc schematic không bớt quan trọng khi có CAD — nó còn quan trọng hơn vì CAD cho phép tạo mạch phức tạp hơn.

> 💡 **Interview Signal**: ✅ Strong = "amplifier" metaphor, specific examples of good vs bad outcomes, reframes the question. ❌ Weak = "yes, they still need to learn basics" (too shallow).

---

# C. Memorization Pack

## C1. 📇 Topic Card

```
┌────────────────────────────────────────────────────────┐
│  AI-AUGMENTED FRONTEND WORKFLOW                        │
│                                                        │
│  Mnemonic:  D-I-R-E-C-T                                │
│  • Direct the AI     — you're architect, it's worker   │
│  • Inspect output    — "looks right" is not enough     │
│  • Run verification  — typecheck + lint + tests always  │
│  • Exclude critical  — auth/crypto/payment = human     │
│  • Context in prompt — bad prompt = bad code           │
│  • Track AI debt     — own what you ship               │
│                                                        │
│  Where AI excels: boilerplate, refactor, test scaffold  │
│  Where AI fails: architecture, security, novel UX       │
│  Core law: AI amplifies. Make sure you have signal.    │
└────────────────────────────────────────────────────────┘
```

## C2. 📊 Q&A Summary Table

| #   | Question                              | Difficulty | Key Phrase                                    |
| --- | ------------------------------------- | ---------- | --------------------------------------------- |
| B1  | How do you use AI daily?              | 🟡 Mid     | Force multiplier, not replacement             |
| B2  | Time AI gave wrong code?              | 🟡 Mid     | Sanitizer miss encoded XSS variants           |
| B3  | Show your component prompt            | 🟡 Mid     | Structured constraints, not free-form         |
| B4  | How does AI change testing?           | 🟡 Mid     | Test intent first, then AI fills in           |
| B5  | How do you verify AI code?            | 🟡 Mid     | 3 layers: types, behavior, actual data        |
| B6  | AI made review easier or harder?      | 🟡 Mid     | Both — plausible-but-wrong is harder          |
| B7  | What do you NOT use AI for?           | 🔴 Senior  | Security, architecture, schema, novel UX      |
| B8  | Security risks of AI frontend code?   | 🔴 Senior  | XSS, regex bypass, client-auth, hallucination |
| B9  | Onboard junior who over-relies on AI? | 🔴 Senior  | 4-phase: no AI → explain-every-line → full    |
| B10 | Should juniors learn fundamentals?    | 🔴 Senior  | AI amplifies — need signal not noise          |

## C3. 🎙 Cold-Call (30-second pitch)

> "In 2026, AI coding tools are table stakes — not using them is a 30-50% productivity disadvantage. The real skill is **directing AI correctly**: using it for boilerplate, mechanical refactoring, and test scaffolding while maintaining hard rules about what requires human judgment — security code, architecture decisions, novel UI patterns. The mnemonic is DIRECT: Direct the AI, Inspect every output, Run verification always, Exclude critical code, Context determines output quality, Track AI-introduced debt. The biggest mistake I see is 'vibe coding' — accepting AI output without understanding it. That's not productivity, that's debt at 3× speed."

## C4. ✅ Self-Check Quiz (5 items)

1. Name 3 task types where AI provides high ROI and 3 where it fails. → _High: boilerplate, refactoring, test scaffolding. Fail: architecture, security-critical code, novel UI patterns._
2. What must you always run after an AI code change, no exceptions? → _TypeScript typecheck + lint + tests._
3. What's the "vibe coding" anti-pattern? → _Accepting AI output without reading/understanding it — creates plausible tech debt at speed._
4. Why should juniors learn fundamentals even though AI writes code? → _AI amplifies. Strong fundamentals + AI = high signal amplified. Weak fundamentals + AI = noise amplified = plausible bugs at speed._
5. What's the safe order for AI test generation? → _Write test intent/descriptions first (based on spec, not implementation), then let AI generate assertions — don't let AI see implementation before writing tests._

## C5. 🧒 Feynman Test (~250 words, VI)

Hãy nghĩ về AI coding tools như một người thợ xây rất giỏi nhưng không biết nhà của bạn trông như thế nào trong 10 năm nữa. Bạn đưa cho họ bản vẽ (prompt) — họ xây rất nhanh. Đưa bản vẽ rõ ràng → họ xây đúng. Đưa bản vẽ mơ hồ → họ đoán và xây theo kiểu "hầu hết nhà người ta thường thế này", có thể đúng, có thể sai.

Phần nguy hiểm: người thợ này trông rất chuyên nghiệp. Móng nhà trông chắc. Nhưng họ không biết đất của bạn có đặc điểm gì, không biết khu vực có động đất không, không biết sau này bạn muốn thêm tầng. Nếu bạn để họ tự quyết định thiết kế móng (architecture decision), bạn có thể phát hiện vấn đề chỉ khi xây đến tầng 3.

Với code: AI xây boilerplate rất tốt — cái "phòng tiêu chuẩn". Nhưng phần quyết định kiến trúc tổng thể, phần bảo mật (ổ khóa chống trộm), và phần thiết kế độc đáo phân biệt nhà bạn với tất cả nhà khác — đó là việc của bạn.

Và luôn luôn: trước khi dọn vào ở (trước khi deploy), phải kiểm tra lại — điện có đúng không (typecheck), nước có chảy không (tests), có vi phạm quy định xây dựng không (lint). Không thể bỏ qua bước này dù người thợ trông có vẻ giỏi đến mấy. Đó là trách nhiệm của chủ nhà — của bạn.

## C6. 📅 Spaced Repetition Schedule

| Day           | Action                                                                                |
| ------------- | ------------------------------------------------------------------------------------- |
| **Day 1**     | Read full file. Try P1 component prompt on a real component in your project.          |
| **Day 3**     | Recall DIRECT mnemonic. List 5 things you should NOT use AI for without looking.      |
| **Day 7**     | Practice B7 and B10 answers out loud. These are the hardest ones for most candidates. |
| **Day 14**    | Use P4 (code review prompt) on an actual PR you're about to submit. Note gaps.        |
| **Day 30**    | Teach the 5 "when AI fails" categories to a peer or junior. Refine your explanations. |
| **Quarterly** | Re-assess: what new AI tools have shipped? Update tool comparison table.              |

## C7. 🗺 Connections Map

**Same track (FE)**:

- [Modern Platform Index](./README.md)
- [Web Components & Shadow DOM](./01-web-components-shadow-dom.md) — AI UI generation targets WC + framework-agnostic output
- [Micro-frontends @ Scale](./03-micro-frontends-scale.md) — AI scaffolding of MFE shells/remotes
- [Frontend Testing](../14-frontend-testing.md) — AI test generation patterns + pitfalls
- [Web Security](../07-web-security/) — AI-generated code security risks in detail
- [React Patterns](../03-react/) — AI often generates wrong React version patterns

**Cross-track**:

- [2026: React Server Components](../../2026-trends/06-react-server-components-2026.md) — AI often confuses RSC/RCC patterns
- [Behavioral Interviews](../12-behavioral/) — AI tool usage stories as STAR examples
- [FE System Design](../08-fe-system-design/) — AI for architecture exploration (carefully)

**Further reading**:

- [Cursor Documentation](https://cursor.sh/docs) — Composer + agent mode patterns
- [GitHub Copilot Best Practices](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot) — official guidance
- [OWASP AI Security & Privacy Guide](https://owasp.org/www-project-ai-security-and-privacy-guide/) — security risks of AI-generated code
- [DOMPurify](https://github.com/cure53/DOMPurify) — correct HTML sanitization (never roll your own)
- [v0.dev](https://v0.dev) — UI generation starting point

---

## 🧠 Memory Hook — Core Lesson

> **AI amplifies what you bring to the table. Bring signal, not noise: use AI for mechanical work, own every architectural and security decision yourself, and run verification after every AI change without exception.**

---

[⬅ Back to Modern Platform Index](./README.md) | [⬅ Back to TOC](../../00-table-of-contents.md)
