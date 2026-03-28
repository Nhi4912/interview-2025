# Problem-Solving Meta Guide — How to Approach Any Coding Problem / Hướng Dẫn Tư Duy Giải Bài

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **L5 Competencies**: Problem-Solving (15pts)
> **See also**: [Problem-Solving Frameworks](../../shared/08-l5-competencies/02-problem-solving-frameworks.md) | [LeetCode Patterns](../../leetcode/00-patterns-index.md) | [Algorithms Theory](../../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Hai ứng viên cùng level technical. Interviewer cho bài Medium chưa từng thấy.

**Ứng viên A:** Đọc đề → im lặng 2 phút → bắt đầu code → 15 phút viết được nửa bài → phát hiện approach sai → xóa hết → hoảng → hết giờ.

**Ứng viên B:** Đọc đề → "Let me make sure I understand: we need X given Y" → hỏi 3 constraints → "This looks like a sliding window problem because of contiguous subarray" → sketch approach → code 12 phút → test 3 edge cases → optimize → pass.

Cả hai kiến thức ngang nhau. Khác biệt: **meta-skill** — cách tiếp cận, không phải kiến thức.

---

## The UNPACK Method — Your Interview Protocol

```
U — UNDERSTAND (2 min)
    Read the problem TWICE.
    Paraphrase: "So we need to find X given Y, where..."
    Draw 1-2 examples by hand.

N — NARROW (2 min)
    Ask constraints BEFORE thinking about solution:
    • Input size? (determines acceptable complexity)
    • Sorted? Unique? Negative numbers?
    • Can I modify input? Extra space OK?
    • What to return if no answer? (empty array, -1, null?)

P — PATTERN (2 min)
    Match signals to patterns:
    ┌────────────────────────────────────┬─────────────────────┐
    │ Signal in Problem                  │ Pattern             │
    ├────────────────────────────────────┼─────────────────────┤
    │ "sorted array"                     │ Binary Search       │
    │ "contiguous subarray/substring"    │ Sliding Window      │
    │ "pair/triplet that satisfies X"    │ Two Pointers        │
    │ "shortest path" / "level by level" │ BFS                 │
    │ "all combinations/permutations"    │ Backtracking        │
    │ "minimum cost" / "number of ways"  │ Dynamic Programming │
    │ "connected components"             │ DFS/Union-Find      │
    │ "frequency" / "duplicates"         │ Hash Map            │
    │ "top K" / "Kth largest"            │ Heap                │
    │ "intervals" / "scheduling"         │ Sort + Merge/Greedy │
    └────────────────────────────────────┴─────────────────────┘

A — APPROACH (2 min)
    State approach OUT LOUD before coding:
    "I'll use a sliding window with a hash map to track frequencies.
     I'll expand right until condition breaks, then shrink left."

    If unsure, state brute force FIRST:
    "Brute force is O(n²) checking all pairs. But since the array
     is sorted, I can use two pointers for O(n)."

C — CODE (15-20 min)
    Now code. Write clean, not clever.
    Name variables descriptively: windowStart, maxLength, charCount
    Comment only non-obvious parts.

K — KNOW YOUR LIMITS (5 min)
    • Time complexity: "This is O(n) because we visit each element at most twice."
    • Space complexity: "O(min(n, k)) for the hash map."
    • Test edge cases: empty input, single element, all same, very large.
    • Mention optimization if time: "Could optimize space to O(1) by..."
```

---

## When You're Stuck — 3 Escape Techniques

### Technique 1: Constraint Relaxation

```
"What if the array were sorted?" → Binary Search becomes possible
"What if I had unlimited memory?" → Hash Map stores everything
"What if the tree were balanced?" → Guarantees O(log n) height

Steps:
1. Remove one constraint → solve easier problem
2. Add constraint back → modify your solution
3. Often the relaxed solution IS the optimal one
```

### Technique 2: Work Backwards

```
"What does the output look like?"
→ "I need to return the maximum sum"
→ "So at the last step, I compare candidates"
→ "I need to efficiently track running sums"
→ "Prefix sum array or sliding window!"

Start from the answer format → work backwards to the data structure.
```

### Technique 3: Reduce to Known Problem

```
"This reminds me of..."
→ Two Sum (hash map lookup)
→ Merge Intervals (sort by start)
→ BFS Level Order (queue processing)

Transform the unknown problem into a known one:
"If I model cities as nodes and roads as edges,
 this becomes a shortest path problem → BFS"
```

### When to Ask for a Hint

After 5 minutes stuck and you've tried at least one technique above:

> "I'm considering [approach X] but I'm not sure how to handle [specific blocker]. Could you give me a hint on whether I'm heading in the right direction?"

This shows: (1) you have a structured approach, (2) you can identify exactly where you're stuck, (3) you communicate proactively.

---

## Time Management — The 45-Minute Round

```
0:00 ─── 0:05    UNDERSTAND + NARROW
                  Read, paraphrase, ask constraints
                  ⚠️ If you start coding here → STOP

0:05 ─── 0:10    PATTERN + APPROACH
                  Identify pattern, state approach verbally
                  ⚠️ If no approach by 0:10 → use escape technique

0:10 ─── 0:30    CODE
                  Write clean solution
                  Talk while coding: "Now I'm handling the edge case where..."
                  ⚠️ If stuck on implementation detail → simplify, move on

0:30 ─── 0:40    TEST + DEBUG
                  Walk through example by hand
                  Test: empty, single, all same, maximum
                  Fix bugs found

0:40 ─── 0:45    COMPLEXITY + DISCUSSION
                  State time/space complexity
                  Mention alternative approaches
                  Answer follow-ups
```

**Budget rules:**
- Never spend >10 min without code on screen
- Never spend >5 min on a single bug — simplify
- Always leave 5 min for testing

---

## Pattern Recognition Practice

### Practice Exercise: Match the Pattern

Read each problem description → identify the pattern before looking at the answer.

```
1. "Find two numbers in a sorted array that sum to target"
   Signal: ___________  Pattern: ___________

2. "Find the longest substring with at most K distinct characters"
   Signal: ___________  Pattern: ___________

3. "Given a binary tree, return values level by level"
   Signal: ___________  Pattern: ___________

4. "Find all possible combinations of K numbers from 1-9 that sum to N"
   Signal: ___________  Pattern: ___________

5. "Find the minimum number of coins to make amount N"
   Signal: ___________  Pattern: ___________
```

<details>
<summary>Answers</summary>

1. Signal: "sorted array" + "two numbers sum" → **Two Pointers** (O(n))
2. Signal: "longest substring" + "at most K" → **Sliding Window** (O(n))
3. Signal: "level by level" → **BFS** with queue (O(n))
4. Signal: "all possible combinations" → **Backtracking** (O(2^n))
5. Signal: "minimum" + "ways to make amount" → **DP** (O(n×amount))

</details>

---

## Communication During Interview

### What to Say at Each Stage

```
UNDERSTAND:
  "Let me make sure I understand the problem correctly.
   We're given [input] and need to find [output]. Is that right?"

NARROW:
  "A few clarifying questions:
   Can the input be empty? Are there duplicates?
   What should I return if there's no valid answer?"

PATTERN:
  "This looks like a [pattern] problem because [reason].
   My initial thought is [approach]."

APPROACH:
  "Here's my plan: I'll [step 1], then [step 2], then [step 3].
   This should be O([time]) time and O([space]) space.
   Does this approach sound reasonable before I start coding?"

CODE:
  "I'm starting with [function/class].
   This variable tracks [what]. This loop [does what]."

DEBUG:
  "Let me trace through with this example...
   At step 3, [variable] should be [value]... yes, that's correct."

OPTIMIZE:
  "The current solution is O([current]). We could optimize to O([better])
   by using [technique], but the trade-off is [space/complexity]."
```

---

## FE-Specific Problem-Solving Patterns

### Frontend Coding Round Patterns

```
┌────────────────────────────────────┬──────────────────────────────┐
│ Problem Type                       │ Approach                     │
├────────────────────────────────────┼──────────────────────────────┤
│ "Implement debounce/throttle"      │ Closure + setTimeout/Date    │
│ "Build autocomplete"               │ Debounce + fetch + cache     │
│ "Virtual scroll / infinite scroll" │ Intersection Observer + pool │
│ "Implement Promise.all"            │ Counter + array + resolve    │
│ "DOM event delegation"             │ Bubbling + target vs current │
│ "State management from scratch"    │ Pub-sub + immutable update   │
│ "Build a form validator"           │ Strategy pattern + reduce    │
│ "Implement React hook (useX)"      │ useState + useEffect + ref   │
│ "CSS layout challenge"             │ Grid > Flexbox > position    │
│ "Drag and drop"                    │ Mouse events + transform     │
└────────────────────────────────────┴──────────────────────────────┘
```

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Viết 6 bước UNPACK + ý nghĩa từ trí nhớ. So sánh.
- [ ] **Visual**: Vẽ Pattern Recognition table từ trí nhớ (≥8 signal→pattern pairs).
- [ ] **Application**: Mở 1 bài LeetCode Medium mới. Áp dụng UNPACK — viết process ra giấy trước khi code. Mất bao lâu từ đọc đề đến có approach?
- [ ] **Debug**: Nhớ lại lần cuối stuck trong coding interview. Nếu dùng 1 trong 3 escape techniques, approach sẽ khác thế nào?
- [ ] **Teach**: Giải thích cho bạn (non-coder) tại sao "cách tiếp cận" quan trọng hơn "biết đáp án" — dùng analogy nấu ăn hoặc sửa xe.

💬 **Feynman Prompt:** Giải thích Constraint Relaxation cho em học sinh cấp 3 đang làm bài toán khó — dùng ví dụ không liên quan đến coding.

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Theory**: [Problem-Solving Frameworks](../../shared/08-l5-competencies/02-problem-solving-frameworks.md) — deeper framework theory
- ⬅️ **Patterns**: [LeetCode Patterns Index](../../leetcode/00-patterns-index.md) — all patterns with practice problems
- ➡️ **Practice**: [JavaScript Challenges](./01-javascript-challenges/) | [React Components](./03-react-components/) | [Algorithm Problems](./04-algorithm-problems/)
- 🔗 **Interview Skills**: [STAR Method](../../shared/09-behavioral/01-star-method.md) — behavioral communication parallels
