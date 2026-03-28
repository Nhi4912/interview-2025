# Problem-Solving Frameworks — Structured Thinking for Interviews / Tư Duy Có Cấu Trúc

> **Track**: Shared | **L5 Weight**: 15pts/100
> **L5 Competencies**: Problem-Solving (15pts)
> **See also**: [L5 Self-Assessment](./00-l5-self-assessment.md) | [LeetCode Patterns](../../leetcode/00-patterns-index.md) | [Algorithms Theory](../01-cs-fundamentals/algorithms-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Coding interview. Interviewer đưa bài bạn chưa từng thấy. Bạn đọc đề 30 giây rồi bắt đầu code ngay — 20 phút sau stuck, code rối, không biết hướng nào. Ứng viên khác dành 5 phút phân tích, hỏi 3 câu clarification, nhận ra pattern, rồi code clean trong 15 phút.

Khác biệt: **meta-skill — cách tiếp cận bài toán**, không phải kiến thức thuật toán.

---

## Framework / Khung Năng Lực

### 1. UNPACK Method — 5 Steps Before Coding

```
U — Understand: Đọc đề 2 lần. Paraphrase lại bằng lời mình.
N — Narrow: Hỏi constraints. Input size? Sorted? Duplicates? Negative?
P — Pattern: Nhận dạng pattern. (Two Pointers? DP? BFS? Sliding Window?)
A — Approach: Sketch approach bằng lời. "I'll use a hash map to..."
C — Code: Code SAU KHI có approach rõ ràng.
K — Know-your-limits: Analyze time/space complexity. Test edge cases.
```

**Tại sao quan trọng?** Interviewer đánh giá PROCESS không chỉ RESULT. Ứng viên code đúng nhưng không explain process → lower score than ứng viên code gần đúng nhưng structured thinking.

### 2. Pattern Recognition Flow

```
Đọc đề → Identify signals:
│
├── "sorted array" hoặc "find boundary"
│   → Binary Search hoặc Two Pointers
│
├── "contiguous subarray/substring"
│   → Sliding Window
│
├── "shortest path" hoặc "level by level"
│   → BFS
│
├── "all combinations" hoặc "generate all"
│   → Backtracking
│
├── "minimum/maximum" hoặc "how many ways"
│   → Dynamic Programming
│   → Hỏi: Optimal substructure? Overlapping subproblems?
│
├── "connected components" hoặc "traverse"
│   → DFS/BFS on Graph
│
├── "frequency" hoặc "duplicates"
│   → Hash Map
│
├── "intervals" hoặc "scheduling"
│   → Sort + Greedy/Merge
│
└── "design a system/data structure"
    → OOP Design + appropriate DS combination
```

### 3. Constraint Relaxation — When You're Stuck

Khi stuck ≥ 3 phút, dùng technique này:

```
Step 1: Relax a constraint
  "What if the array was sorted?" → enables Binary Search
  "What if I had unlimited memory?" → enables Hash Map
  "What if the tree was balanced?" → enables O(log n) approach

Step 2: Solve the relaxed problem
  → Get a working approach for the easier version

Step 3: Add constraints back
  → Modify your approach to handle the real constraints
  → Often the relaxed solution IS the optimal approach
```

### 4. Work Backwards — From Output to Input

```
Step 1: "What does the output look like?"
  → Array of indices? Single number? Boolean?

Step 2: "What's the LAST step to produce this output?"
  → "I need to compare two values" → "I need to access them efficiently"

Step 3: "What data structure supports that last step?"
  → "Quick lookup" → Hash Map
  → "Sorted access" → Heap or Sorted structure
  → "First-in-first-out" → Queue

Step 4: Build forward from the data structure choice
```

### 5. Risk-First Analysis — For System Design & Production Problems

```
Step 1: "What can go wrong?" (list 3-5 failure modes)
Step 2: "What's the blast radius?" (1 user? all users? data loss?)
Step 3: "What's the likelihood?" (rare edge case? happens daily?)
Step 4: Priority = Blast Radius × Likelihood
Step 5: Address highest-priority risks first in your design
```

---

## Examples / Ví Dụ Thực Tế

### Example 1: UNPACK in Action — "Find All Anagrams in a String"

**U — Understand**: Given string `s` and pattern `p`, find all start indices of `p`'s anagrams in `s`.

**N — Narrow**:
- "Can s or p be empty?" → Yes, return empty array
- "Only lowercase letters?" → Yes
- "What's the max length?" → 10^4

**P — Pattern**: "Contiguous substring" + "anagram (same frequency)" → **Sliding Window + Hash Map**

**A — Approach**: "I'll maintain a window of size p.length, track character frequencies, slide right and compare with p's frequency map."

**C — Code**: (implement the approach)

**K — Know limits**: O(n) time, O(1) space (fixed 26 letters). Edge: p longer than s.

### Example 2: Constraint Relaxation — "Meeting Rooms II"

**Stuck**: How to find minimum meeting rooms needed for overlapping intervals?

**Relax**: "What if no meetings overlap?" → 1 room. Not helpful.

**Relax differently**: "What if I only care about one point in time?" → Count overlapping meetings at that point.

**Insight**: The maximum number of overlapping meetings at ANY point = minimum rooms needed.

**Technique**: Use a min-heap of end times. For each meeting, if it starts after the earliest ending meeting, reuse that room. Otherwise, add a new room.

### Example 3: Risk-First — "Design a Real-Time Notification System"

**Risks identified**:
1. Message loss (blast radius: all users, likelihood: medium) → **Priority 1**
2. Duplicate notifications (blast radius: individual users, likelihood: high) → **Priority 2**
3. Delivery delay >5s (blast radius: UX degradation, likelihood: medium) → **Priority 3**
4. WebSocket connection drops (blast radius: individual, likelihood: high) → **Priority 4**

**Design order**: Address message durability FIRST (queue with at-least-once delivery), then deduplication (idempotency keys), then latency (connection pooling), then reconnection (exponential backoff).

---

## Anti-patterns / Sai Lầm Thường Gặp

| Anti-pattern | Why it fails | Better approach |
|-------------|-------------|----------------|
| Code immediately | Misses constraints, picks wrong approach, has to restart | Spend 3-5 min on U-N-P-A before any code |
| Silent thinking | Interviewer can't evaluate your process | Think out loud: "I'm considering two approaches..." |
| Stuck = panic | Freezing signals poor problem-solving | Say "I'm stuck on X, let me try constraint relaxation" |
| Only brute force | Shows you can code but not optimize | State brute force, THEN say "Let me optimize using [pattern]" |
| Skip edge cases | Most bugs are at boundaries | Always test: empty input, single element, all same, very large |
| Time blindness | Spending 30 min on approach, 5 min on code | Budget: 5 min understand, 5 min approach, 20 min code, 5 min test |

---

## Q&A Section — Interview Questions

### Q: Walk me through how you approach a coding problem you've never seen. / Khi gặp bài code chưa từng thấy, bạn tiếp cận thế nào? 🟢 Junior

**A:** Use UNPACK: Understand the problem by paraphrasing it, Narrow constraints by asking questions, identify the Pattern, sketch an Approach verbally, then Code, and finally check complexity and edge cases.

"Tôi không bao giờ code ngay. Tôi dành 3-5 phút đầu để hiểu đề, hỏi constraints, và nhận dạng pattern. Sau đó tôi nói approach cho interviewer trước khi viết code."

**💡 Interview Signal:**
- ✅ Strong: Has structured approach, asks clarifying questions, identifies pattern before coding
- ❌ Weak: "I just start coding and figure it out as I go"

---

### Q: You're stuck on a problem for 5 minutes. What do you do? / Bạn stuck 5 phút rồi, bạn làm gì? 🟡 Mid

**A:** Three techniques in order: (1) Constraint relaxation — simplify the problem and solve the easier version first. (2) Work backwards — start from the desired output and figure out what data structure supports the last step. (3) Reduce to known problem — "This reminds me of [known pattern], can I transform this into that?"

If still stuck: communicate to interviewer. "I'm considering X approach but I'm blocked on Y. Can I get a hint on whether I'm heading in the right direction?"

**💡 Interview Signal:**
- ✅ Strong: Has multiple de-sticking strategies, communicates struggle transparently
- ❌ Weak: Sits silently, panics, or immediately asks for the answer

---

### Q: How do you balance finding the optimal solution vs shipping something that works? When do you stop optimizing? / Khi nào bạn dừng tối ưu? 🔴 Senior

**A:** In interviews: start with brute force to show correctness, then optimize. State the time/space tradeoff explicitly. In production: optimize when you have data showing a bottleneck, not preemptively. The decision framework is:

1. Is the current solution correct? (If not, fix correctness first)
2. Does it meet the performance requirement? (SLA, user experience threshold)
3. Is the optimization worth the complexity cost? (Maintenance burden vs performance gain)

"In my last project, I initially used O(n²) nested loops for matching. When profiling showed it was a bottleneck at 10K items, I switched to a hash-based approach — O(n) time but O(n) space. I chose NOT to optimize further to O(1) space because the data size was bounded and the code complexity wasn't worth it."

**💡 Interview Signal:**
- ✅ Strong: Considers correctness → performance → complexity tradeoff, uses data to drive decisions
- ❌ Weak: "I always go for the optimal solution" or "I just make it work"

🔗 **Follow-up Chain:**
1. → "What metrics would tell you this optimization was worth it in production?"
2. → "If this ran on a device with 512MB RAM, how would your tradeoff analysis change?"
3. → "Design a system to automatically detect and alert when this algorithm's performance degrades beyond threshold."

---

## Time Management in Coding Interviews / Quản Lý Thời Gian

```
45-minute coding round:
├── 0-5 min:   Read, paraphrase, ask questions (UNPACK: U + N)
├── 5-10 min:  Identify pattern, state approach verbally (P + A)
├── 10-30 min: Code the solution (C)
├── 30-40 min: Test with examples + edge cases (K)
└── 40-45 min: Discuss complexity, alternative approaches, follow-ups
```

**Rule of thumb**: Nếu sau 10 phút chưa có approach → dùng Constraint Relaxation hoặc xin hint. Đừng code mà chưa có plan.

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Viết 6 bước UNPACK từ trí nhớ. So sánh.
- [ ] **Visual**: Vẽ Pattern Recognition Flow từ trí nhớ (≥6 patterns + triggers).
- [ ] **Application**: Mở 1 bài LeetCode Medium chưa làm. Áp dụng UNPACK — ghi lại process trước khi code. Bạn nhận dạng đúng pattern không?
- [ ] **Debug**: Lần cuối bạn stuck trong coding interview — nếu dùng Constraint Relaxation, approach sẽ khác thế nào?
- [ ] **Teach**: Giải thích Constraint Relaxation cho junior bằng 1 ví dụ cụ thể (không dùng thuật ngữ thuật toán).

💬 **Feynman Prompt:** Giải thích "problem-solving meta-skill" cho người không biết code. Tại sao cách tiếp cận quan trọng hơn kiến thức?

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Practice Problems / Bài Tập Thực Hành

| Pattern to Practice | Problem | Difficulty |
|-------------------|---------|-----------|
| UNPACK full flow | [Two Sum](../../leetcode/array/problems/04-two-sum.md) | 🟢 Easy |
| Constraint Relaxation | [3Sum](../../leetcode/array/problems/12-3sum.md) | 🟡 Medium |
| Work Backwards | [LRU Cache](../../leetcode/design/problems/09-lru-cache.md) | 🟡 Medium |
| Pattern Recognition | [Longest Substring Without Repeating](../../leetcode/string/problems/10-longest-substring-without-repeating-characters.md) | 🟡 Medium |
| Risk-First (Design) | [Design Hit Counter](../../leetcode/design/problems/07-design-hit-counter.md) | 🟡 Medium |
| Full process under pressure | [Trapping Rain Water](../../leetcode/array/problems/20-trapping-rain-water.md) | 🔴 Hard |

---

## Connections / Liên Kết

- ⬅️ **Built on**: [Algorithms Theory](../01-cs-fundamentals/algorithms-theory.md) — need algorithmic knowledge to apply these frameworks
- ➡️ **Enables**: [Scope & Impact](./01-scope-and-impact.md) — problem-solving at L5 includes scoping the problem correctly
- 🔗 **Applied in**: Every coding interview, system design (risk-first), debugging production issues
