# Company Dashboard / Bảng Điều Khiển Công Ty

> **Track**: Shared | **Last updated**: 2026-04-03
> **Goal**: Map company interview patterns to LeetCode preparation
> **See also**: [Master Tracker](./00-master-tracker.md) | [Company Guides](../shared/07-company-guides/) | [Company Problems](./company-wise/)

---

## 🎯 Target Companies Overview / Tổng Quan Công Ty Mục Tiêu

| Company             | DSA Difficulty | Top Patterns                           | Rounds | Prep Time | Guide                                                      |
| ------------------- | -------------- | -------------------------------------- | ------ | --------- | ---------------------------------------------------------- |
| **Google**          | 🔴 Hard        | Array, String, DP, Graph, Hash Table   | 5-6    | 8-10 wk   | [Guide](../shared/07-company-guides/01-google.md)          |
| **Microsoft**       | 🟡 Medium      | Binary Tree, Array, String, DP, Matrix | 5-6    | 6-8 wk    | [Guide](../shared/07-company-guides/02-microsoft.md)       |
| **Grab**            | 🟡 Med-Hard    | Array, String, DP, Hash Table, Stack   | 5-6    | 6-8 wk    | [Guide](../shared/07-company-guides/03-grab.md)            |
| **Axon**            | 🟢 Easy-Med    | Practical coding, System Design        | 4-5    | 4-6 wk    | [Guide](../shared/07-company-guides/04-axon.md)            |
| **Employment Hero** | 🟢 Easy        | Values-first, Practical take-home      | 4-5    | 3-5 wk    | [Guide](../shared/07-company-guides/05-employment-hero.md) |
| **Zalo/VNG**        | 🔴 Hard        | Go, React, WebSocket, Redis, Scale     | 4-5    | 6-8 wk    | [Guide](../shared/07-company-guides/06-zalo-vng.md)        |

---

## 📊 Pattern × Company Heatmap / Ma Trận Pattern Theo Công Ty

> 🔴 = Critical (top 3 pattern) | 🟡 = Important | ⬜ = Rare/Not tested

| Pattern        | Google | Microsoft | Grab | Axon | EH  | Zalo |
| -------------- | ------ | --------- | ---- | ---- | --- | ---- |
| Hash Map       | 🔴     | 🟡        | 🟡   | ⬜   | ⬜  | 🟡   |
| Two Pointers   | 🟡     | 🔴        | 🟡   | ⬜   | ⬜  | ⬜   |
| Sliding Window | 🟡     | 🟡        | 🟡   | ⬜   | ⬜  | ⬜   |
| Binary Search  | 🔴     | 🟡        | ⬜   | ⬜   | ⬜  | ⬜   |
| BFS/DFS Tree   | 🔴     | 🔴        | 🟡   | ⬜   | ⬜  | ⬜   |
| BFS/DFS Graph  | 🔴     | 🟡        | 🟡   | ⬜   | ⬜  | 🟡   |
| Dynamic Prog   | 🔴     | 🔴        | 🔴   | ⬜   | ⬜  | 🟡   |
| Backtracking   | 🟡     | 🟡        | ⬜   | ⬜   | ⬜  | ⬜   |
| Linked List    | 🟡     | 🟡        | ⬜   | ⬜   | ⬜  | ⬜   |
| Stack/Queue    | 🟡     | 🟡        | 🔴   | ⬜   | ⬜  | 🟡   |
| Interval/Sort  | 🟡     | 🟡        | 🟡   | ⬜   | ⬜  | ⬜   |
| Design (DS)    | 🟡     | 🟡        | 🟡   | 🔴   | ⬜  | 🔴   |
| System Design  | 🔴     | 🔴        | 🔴   | 🔴   | 🟡  | 🔴   |

---

## 🏢 Per-Company Analysis / Phân Tích Từng Công Ty

### Google — 100 problems in database

```
Difficulty: 🟢 24% | 🟡 55% | 🔴 21%
Top Topics: Array, String, Hash Table, DP, DFS
Study Priority: DSA Hard > System Design > Behavioral
```

**Must-Solve for Google** (from [problem list](./company-wise/problems/google.md)):

| #   | Problem                     | Pattern           | Difficulty | In Tier |
| --- | --------------------------- | ----------------- | ---------- | ------- |
| 1   | Two Sum                     | Hash Map          | 🟢 Easy    | Tier 1  |
| 2   | Trapping Rain Water         | Two Pointers / DP | 🔴 Hard    | Tier 1  |
| 3   | Longest Substr No Repeat    | Sliding Window    | 🟡 Med     | Tier 1  |
| 4   | Median of Two Sorted Arrays | Binary Search     | 🔴 Hard    | Tier 3  |
| 5   | Merge Intervals             | Sort + Merge      | 🟡 Med     | Tier 1  |

**Gap**: Median of Two Sorted Arrays (Tier 3) — add to study plan Month 5

---

### Microsoft — 100 problems in database

```
Difficulty: 🟢 21% | 🟡 63% | 🔴 16%
Top Topics: Array, String, DP, Two Pointers, Math
Study Priority: Domain Knowledge > Medium DSA > System Design
```

**Must-Solve for Microsoft** (from [problem list](./company-wise/problems/microsoft.md)):

| #   | Problem                       | Pattern        | Difficulty | In Tier |
| --- | ----------------------------- | -------------- | ---------- | ------- |
| 1   | Two Sum                       | Hash Map       | 🟢 Easy    | Tier 1  |
| 2   | Longest Substr No Repeat      | Sliding Window | 🟡 Med     | Tier 1  |
| 3   | Longest Palindromic Substring | DP / Expand    | 🟡 Med     | —       |
| 4   | 3Sum                          | Sort + Two Ptr | 🟡 Med     | Tier 1  |
| 5   | Valid Parentheses             | Stack          | 🟢 Easy    | Tier 1  |

**Gap**: Longest Palindromic Substring — consider adding to Tier 3

---

### Grab — 13 problems in database

```
Difficulty: 🟢 15% | 🟡 85% | 🔴 0%
Top Topics: Array, String, DP, Hash Table, Stack
Study Priority: System Design > Go Depth > Medium-Hard DSA
```

**Must-Solve for Grab** (from [problem list](./company-wise/problems/grab.md)):

| #   | Problem                  | Pattern         | Difficulty | In Tier |
| --- | ------------------------ | --------------- | ---------- | ------- |
| 1   | Minimum Cost For Tickets | DP              | 🟡 Med     | Tier 3  |
| 2   | Two Sum                  | Hash Map        | 🟢 Easy    | Tier 1  |
| 3   | Daily Temperatures       | Monotonic Stack | 🟡 Med     | Tier 3  |

**Note**: Grab's DSA pool is small. Focus more on System Design (ride-matching, payments).

---

### Axon — Take-home focused

```
Study Priority: Practical Coding > System Design (Reliability) > Mission Fit
```

**Strategy**: Focus on clean code, testing, real-world problem-solving rather than LeetCode grinding. Take-home assessment is 2-5 days. Master Tier 1 for baseline, invest more time in system design (safety-critical, audit trails).

---

### Employment Hero — Values-first

```
Study Priority: Values > Product Domain > Practical Coding
```

**Strategy**: AI tools allowed in take-home. Focus on HR/payroll domain understanding, async communication skills. Tier 1 LeetCode sufficient for coding bar. Invest in values interview prep.

---

### Zalo/VNG — Scale-focused

```
Study Priority: Go + React Depth > System Design > CS Fundamentals
```

**Strategy**: Heavy on language-specific knowledge (Go concurrency, React internals). System design focuses on Zalo-scale (70M+ users, WebSocket, Redis pub/sub). CS fundamentals tested in written exam. Master Tier 1-2 LeetCode + add graph/DP problems.

---

## 📋 Company Prep Timeline / Lịch Chuẩn Bị Theo Công Ty

```
If targeting Google (hardest):
  Month 1-3: Tier 1 + Tier 2 foundation
  Month 4-5: Google-specific Hard problems
  Month 6-7: System Design + Mock interviews
  Month 8-9: Final prep + interviews

If targeting Grab/Zalo:
  Month 1-2: Tier 1 foundation
  Month 3-4: System Design (distributed systems)
  Month 5-6: Go/React deep dive + company problems
  Month 7: Mock interviews + apply

If targeting Axon/EH (fastest):
  Month 1: Tier 1 foundation
  Month 2: Practice take-home projects
  Month 3: System Design basics + apply
```

---

## 🔗 Resources / Tài Nguyên

- **Company Problem Lists**: [company-wise/](./company-wise/) — 463 companies, 1820 unique problems
- **Interview Guides**: [shared/07-company-guides/](../shared/07-company-guides/) — 6 target companies
- **Pattern Index**: [Study Guide](./00-study-guide.md) — patterns sorted by frequency
- **SRS Tracking**: [Master Tracker](./00-master-tracker.md) — progress per problem
