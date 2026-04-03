# Daily Study Calendar / Lịch Học Hàng Ngày

> **Track**: Shared | **Last updated**: 2026-04-03
> **Goal**: Master 200 problems in 9 months using Pomodoro + SRS
> **See also**: [Master Tracker](./00-master-tracker.md) | [Study Guide](./00-study-guide.md) | [Motivation](./00-motivation.md)

---

## Daily Routine (2-3 hours, Pomodoro-based) / Thói Quen Hàng Ngày

```
┌─────────────────────────────────────────────────────────────┐
│  🌅 MORNING BLOCK (60 min)                                  │
│  🍅 Pomodoro 1: Solve NEW problem without hints    (25 min) │
│  ☕ Break                                           (5 min)  │
│  🍅 Pomodoro 2: Study solution + write interview   (25 min) │
│     script + fill self-assessment                            │
│  ☕ Break                                           (5 min)  │
├─────────────────────────────────────────────────────────────┤
│  🌙 EVENING BLOCK (60 min)                                  │
│  🍅 Pomodoro 3: SRS review queue (due problems)   (25 min)  │
│  ☕ Break                                           (5 min)  │
│  🍅 Pomodoro 4: 2nd new problem OR hard review    (25 min)  │
│  ☕ Break                                           (5 min)  │
└─────────────────────────────────────────────────────────────┘
```

### Per-Problem Workflow / Quy Trình Mỗi Bài

1. **Read** problem (2 min) — understand constraints, examples
2. **Attempt** without hints (15-25 min) — use UMPIRE script
3. **If stuck >10 min** — read Pattern Trigger section, try again
4. **After solving** — fill Self-Assessment, update YAML `status` + `confidence`
5. **If failed** — read full solution, redo from scratch next day (SRS +1 day)

---

## Weekly Pattern Interleaving / Xen Kẽ Pattern Theo Tuần

> 2 mixed patterns per day prevents pattern overfitting / Trộn 2 pattern mỗi ngày tránh thuộc bài

| Day | Pattern A         | Pattern B        | Example Problems              |
| --- | ----------------- | ---------------- | ----------------------------- |
| Mon | Hash Map          | DP               | Two Sum + Climbing Stairs     |
| Tue | Two Pointers      | Tree DFS         | 3Sum + Validate BST           |
| Wed | Sliding Window    | Graph BFS/DFS    | Longest Substr + Num Islands  |
| Thu | Stack             | Backtracking     | Valid Parens + Subsets        |
| Fri | Binary Search     | Design           | Search Rotated + LRU Cache    |
| Sat | 🎤 Mock Interview | Weak areas focus | 45 min mock + review mistakes |
| Sun | 🌴 REST           | Light SRS review | Only overdue SRS reviews      |

---

## 9-Month Milestone Plan / Kế Hoạch 9 Tháng

```
Month 1 ████░░░░░░ Tier 1 Foundation
Month 2 ████████░░ Tier 2 Core
Month 3 ██████████ Deep Patterns
Month 4 ██████░░░░ Company Prep
Month 5 ████████░░ Hard Problems
Month 6 ██████████ Speed + Review
Month 7 ████████░░ Mock Interviews
Month 8 ██████████ Target Company
Month 9 ████████░░ Peak + Maintain
```

| Month | Focus              | New Problems  | Cumulative | Goal                                  |
| ----- | ------------------ | ------------- | ---------- | ------------------------------------- |
| **1** | Tier 1 Foundation  | 25            | 25         | All Easy <15min, Medium <25min        |
| **2** | Tier 2 Core        | 25            | 50         | 70% Medium <25min                     |
| **3** | Deep patterns      | 30            | 80         | Pattern recognition automatic         |
| **4** | Company prep       | 20            | 100        | Company-specific problems ready       |
| **5** | Hard problems      | 15            | 115        | Can attempt Hard within 35min         |
| **6** | Speed + SRS review | 10            | 125        | Medium <20min, SRS backlog cleared    |
| **7** | Mock interviews    | 5 + mocks     | 130        | Pass 3/4 mock interviews consistently |
| **8** | Target company     | Company focus | 140        | Ready for interview loops             |
| **9** | Peak + maintain    | SRS only      | 140+       | Interview ready, confidence ≥4 all    |

---

## Month 1 — Tier 1 Daily Schedule / Lịch Chi Tiết Tháng 1

### Week 1: Easy Foundation (5 problems)

| Day | Morning (New)                 | Evening (Review)       |
| --- | ----------------------------- | ---------------------- |
| Mon | #1 Two Sum (Hash Map)         | —                      |
| Tue | #2 Valid Parentheses (Stack)  | —                      |
| Wed | #3 Merge Two Lists (LL)       | —                      |
| Thu | #4 Buy Sell Stock (DP/Greedy) | Review #1 (SRS)        |
| Fri | #5 Valid Palindrome (2 Ptr)   | Review #2 (SRS)        |
| Sat | 🎤 Mock: pick 2 random Easy   | Review #3-4 (SRS)      |
| Sun | REST                          | Light review if needed |

### Week 2: Easy + First Medium (5 problems)

| Day | Morning (New)                | Evening (Review)        |
| --- | ---------------------------- | ----------------------- |
| Mon | #6 Reverse LL (In-place)     | Review #1,5 (SRS +3d)   |
| Tue | #7 Max Depth Tree (DFS)      | Review #2,3 (SRS +3d)   |
| Wed | #8 Climbing Stairs (DP)      | Review #4 (SRS +3d)     |
| Thu | #9 3Sum (Sort+2Ptr) ⚡Medium | Review #6,7 (SRS +1d)   |
| Fri | #10 Longest Substr (Window)  | Review #5,8 (SRS +3d)   |
| Sat | 🎤 Mock: 1 Easy + 1 Medium   | Review #9,10 (SRS +1d)  |
| Sun | REST                         | Catch up any failed SRS |

### Week 3: Medium Core (5 problems)

| Day | Morning (New)                  | Evening (Review)             |
| --- | ------------------------------ | ---------------------------- |
| Mon | #11 Product Array (Prefix)     | SRS queue (check YAML dates) |
| Tue | #12 Level Order (BFS)          | SRS queue                    |
| Wed | #13 Validate BST (DFS)         | SRS queue                    |
| Thu | #14 Coin Change (DP)           | SRS queue                    |
| Fri | #15 Num Islands (Grid BFS)     | SRS queue                    |
| Sat | 🎤 Mock: 2 Medium (25min each) | Review weak problems         |
| Sun | REST                           | SRS catch-up                 |

### Week 4: Medium Advanced (5 problems)

| Day | Morning (New)                  | Evening (Review)         |
| --- | ------------------------------ | ------------------------ |
| Mon | #16 Merge Intervals (Sort)     | SRS queue                |
| Tue | #17 LRU Cache (Design)         | SRS queue                |
| Wed | #18 Search Rotated (B.Search)  | SRS queue                |
| Thu | #19 Subsets (Backtrack)        | SRS queue                |
| Fri | #20 Permutations (Backtrack)   | SRS queue                |
| Sat | 🎤 Mock: 2 Medium (20min each) | Review all confidence <4 |
| Sun | REST                           | Week 4 retrospective     |

### Week 5: Final Tier 1 + Review (5 problems)

| Day | Morning (New)                  | Evening (Review)        |
| --- | ------------------------------ | ----------------------- |
| Mon | #21 House Robber (Linear DP)   | SRS queue               |
| Tue | #22 Max Subarray (Kadane)      | SRS queue               |
| Wed | #23 Word Search (Grid+BT)      | SRS queue               |
| Thu | #24 Container Water (2 Ptr)    | SRS queue               |
| Fri | #25 Trapping Rain ⚡Hard       | SRS queue               |
| Sat | 🎤 Full mock: 3 problems/45min | Review all Tier 1       |
| Sun | REST + Tier 1 retrospective    | Plan Month 2 weak areas |

---

## SRS Review Rules / Quy Tắc Ôn Tập SRS

| Confidence | Next Review | Action                                    |
| ---------- | ----------- | ----------------------------------------- |
| 1 (Forgot) | +1 day      | Re-study full solution, redo from scratch |
| 2 (Vague)  | +1 day      | Review Pattern Trigger, redo approach     |
| 3 (Hints)  | +3 days     | Practice without hints, focus on speed    |
| 4 (Clean)  | +7 days     | Quick review, focus on interview speech   |
| 5 (Master) | +14 days    | Light review, can skip if queue is long   |

### How to Run SRS Review / Cách Chạy Ôn Tập SRS

1. Check `srs_dates.next_review` in each problem's YAML frontmatter
2. Collect all problems where `next_review ≤ today`
3. Re-solve each (target: half the original target time)
4. Update `confidence`, `last_reviewed`, `solve_count`, `srs_dates`

---

## Tips for Consistency / Mẹo Duy Trì Đều Đặn

1. **Same time daily** — Brain learns better with routine / Giờ cố định mỗi ngày
2. **Never skip SRS** — Skip new problems if needed, never SRS / Bỏ bài mới được, không bỏ ôn tập
3. **Saturday mocks are sacred** — Simulates real pressure / Mock thứ 7 là bắt buộc
4. **Track streaks** — See [Motivation](./00-motivation.md) / Theo dõi streak
5. **If behind schedule** — Cut new problems, focus SRS catch-up / Tụt lịch thì ưu tiên SRS
6. **Celebrate small wins** — Each Tier 1 problem mastered = progress / Mỗi bài master = tiến bộ
