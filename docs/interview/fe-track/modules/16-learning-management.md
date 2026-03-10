# 📅 MODULE 12: LEARNING MANAGEMENT SYSTEM

> **Focus**: 90% Methodology & Strategy
>
> _"Không phải học nhiều hơn, mà là học THÔNG MINH hơn"_
>
> **Core Principle**: Evidence-based learning + Sustainable practice

---

## 📋 Trong Module Này

1. [Khoa Học Học Tập](#1-khoa-học-học-tập)
2. [Lộ Trình 6 Tháng - Chi Tiết](#2-lộ-trình-6-tháng---chi-tiết)
3. [Quản Lý Năng Lượng & Thời Gian](#3-quản-lý-năng-lượng--thời-gian)
4. [Hệ Thống Tracking & Đánh Giá](#4-hệ-thống-tracking--đánh-giá)
5. [Động Lực & Phục Hồi](#5-động-lực--phục-hồi)
6. [Big Tech Company Strategies](#6-big-tech-company-strategies)

> 📋 **Xem thêm:** [Module 12B: Detailed Process](./12b-detailed-process.md) - Quy trình chi tiết từng ngày/tuần

---

## 1. Khoa Học Học Tập

### 🧠 Evidence-Based Learning Strategies

```mermaid
flowchart TB
    subgraph Science["🔬 Cognitive Science Foundation"]
        Ebbinghaus["📉 Ebbinghaus Forgetting Curve<br/>Mất 70% sau 24h không ôn"]
        Spacing["📊 Spacing Effect<br/>Ôn cách quãng > Ôn liền"]
        Testing["✅ Testing Effect<br/>Tự test > Đọc lại"]
        Interleaving["🔄 Interleaving<br/>Xen kẽ topics > Học 1 topic dài"]
    end

    subgraph Application["💡 Áp Dụng"]
        A1["Spaced Repetition Schedule"]
        A2["Active Recall Sessions"]
        A3["Mixed Practice"]
    end

    Ebbinghaus --> A1
    Spacing --> A1
    Testing --> A2
    Interleaving --> A3
```

### Phương Pháp Học Từ Top Universities

| University         | Phương Pháp            | Áp Dụng Cho Interview Prep                 |
| ------------------ | ---------------------- | ------------------------------------------ |
| **Harvard**        | Active Recall          | Sau mỗi section, đóng tài liệu và viết lại |
| **Cambridge**      | Deep Understanding     | WHAT-WHY-HOW-WHEN cho mỗi concept          |
| **Oxford**         | Tutorial System        | Mock interview với peer/mentor             |
| **Japan (Kaizen)** | Continuous Improvement | Daily 1% improvement tracking              |

### Feynman Technique - Học Sâu

```
┌────────────────────────────────────────────────────────────────┐
│  FEYNMAN TECHNIQUE - 4 STEPS                                   │
├────────────────────────────────────────────────────────────────┤
│  1. STUDY concept (Event Loop, Closure, etc.)                  │
│                                                                │
│  2. TEACH to imaginary beginner                                │
│     - Dùng ngôn ngữ đơn giản                                  │
│     - Không dùng jargon                                       │
│                                                                │
│  3. IDENTIFY gaps                                              │
│     - Chỗ nào bạn khựng lại?                                  │
│     - Chỗ nào giải thích không rõ?                            │
│                                                                │
│  4. SIMPLIFY và lặp lại                                        │
│     - Quay lại học phần đó                                    │
│     - Tạo analogy mới                                         │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Lộ Trình 6 Tháng - Chi Tiết

### 📊 Overview - 24 Weeks Plan

```mermaid
gantt
    title 6-Month Frontend Interview Preparation
    dateFormat YYYY-MM-DD

    section Phase 1: Foundation
    JavaScript Core Theory    :p1, 2025-01-01, 4w
    Browser & Runtime        :p2, after p1, 2w

    section Phase 2: Framework
    React Philosophy         :p3, after p2, 3w
    TypeScript Deep Dive     :p4, after p3, 2w
    State Management         :p5, after p4, 1w

    section Phase 3: Applied
    Performance & Security   :p6, after p5, 2w
    Testing & Quality        :p7, after p6, 2w
    Architecture Patterns    :p8, after p7, 2w

    section Phase 4: Interview
    Coding Practice          :p9, after p8, 3w
    System Design            :p10, after p9, 2w
    Mock Interviews          :p11, after p10, 2w
    Final Review             :p12, after p11, 1w
```

---

### 📅 Phase 1: Foundation (Tuần 1-6)

#### Tuần 1-4: JavaScript Core Theory

```mermaid
flowchart LR
    W1["Week 1<br/>Event Loop<br/>Call Stack"]
    W2["Week 2<br/>Closure<br/>Scope Chain"]
    W3["Week 3<br/>Prototype<br/>this Binding"]
    W4["Week 4<br/>Memory<br/>Async/Await"]

    W1 --> W2 --> W3 --> W4
```

| Tuần | Focus Topics            | Theory Hours | Practice Hours | Deliverables                              |
| ---- | ----------------------- | ------------ | -------------- | ----------------------------------------- |
| 1    | Event Loop, Call Stack  | 8h           | 2h             | Vẽ được Event Loop diagram từ trí nhớ     |
| 2    | Closure, Scope Chain    | 8h           | 2h             | Giải thích được stale closure trong React |
| 3    | Prototype, this Binding | 8h           | 2h             | Viết được class từ prototype              |
| 4    | Memory, GC, Async       | 8h           | 2h             | Nhận diện memory leak patterns            |

**Weekly Review Template:**

```markdown
## Week X Review

### Concepts Mastered

- [ ] Có thể giải thích cho người mới mà không cần notes
- [ ] Có thể vẽ diagram từ trí nhớ
- [ ] Có thể answer interview questions tự tin

### Gaps Identified

- [ ] Concept nào cần ôn lại?
- [ ] Question nào trả lời chưa tốt?

### Next Week Adjustment

- Focus thêm vào: \_\_\_
- Giảm bớt thời gian cho: \_\_\_
```

#### Tuần 5-6: Browser & Runtime

| Tuần | Focus Topics                         | Theory Hours | Practice Hours |
| ---- | ------------------------------------ | ------------ | -------------- |
| 5    | DOM, CSSOM, Rendering Pipeline       | 8h           | 2h             |
| 6    | Critical Rendering Path, Performance | 8h           | 2h             |

---

### 📅 Phase 2: Framework Mastery (Tuần 7-12)

#### Tuần 7-9: React Philosophy

```mermaid
flowchart TB
    subgraph Week7["Week 7: Core Concepts"]
        R1["Virtual DOM Theory"]
        R2["Reconciliation"]
        R3["Fiber Architecture"]
    end

    subgraph Week8["Week 8: Hooks Deep Dive"]
        H1["useState/useEffect internals"]
        H2["Custom Hooks patterns"]
        H3["Rules of Hooks WHY"]
    end

    subgraph Week9["Week 9: Advanced Patterns"]
        A1["Composition patterns"]
        A2["Performance optimization"]
        A3["State architecture"]
    end

    Week7 --> Week8 --> Week9
```

#### Tuần 10-11: TypeScript Deep Dive

| Tuần | Focus Topics                 | Goals                                          |
| ---- | ---------------------------- | ---------------------------------------------- |
| 10   | Type System Theory, Generics | Hiểu structural typing, write complex generics |
| 11   | Advanced Types, React + TS   | Type inference, discriminated unions           |

#### Tuần 12: State Management

- Redux Toolkit internals
- Zustand/Jotai comparison
- Server State (TanStack Query)

---

### 📅 Phase 3: Applied Knowledge (Tuần 13-18)

#### Tuần 13-14: Performance & Security

```mermaid
flowchart LR
    subgraph Perf["Performance"]
        CWV["Core Web Vitals"]
        Render["Rendering Optimization"]
        Bundle["Bundle Analysis"]
    end

    subgraph Sec["Security"]
        XSS["XSS Prevention"]
        CSRF["CSRF Protection"]
        CSP["Content Security Policy"]
    end

    Perf --> Sec
```

#### Tuần 15-16: Testing & Quality

- Testing Philosophy (TDD, BDD)
- Jest/RTL deep patterns
- E2E với Playwright

#### Tuần 17-18: Architecture Patterns

- Design Patterns trong Frontend
- Micro-frontends theory
- System design fundamentals

---

### 📅 Phase 4: Interview Prep (Tuần 19-24)

#### Tuần 19-21: Coding Practice

```
┌────────────────────────────────────────────────────────────────┐
│  DELIBERATE PRACTICE SCHEDULE                                  │
├────────────────────────────────────────────────────────────────┤
│  Week 19: JavaScript Challenges                                │
│    - Polyfills (map, reduce, Promise.all)                     │
│    - Debounce, throttle, deep clone                           │
│    - 2-3 problems/day                                         │
│                                                                │
│  Week 20: React Challenges                                     │
│    - Custom hooks implementation                               │
│    - Component from scratch (autocomplete, modal)             │
│    - 1-2 components/day                                       │
│                                                                │
│  Week 21: Algorithm Patterns                                   │
│    - Two pointers, sliding window                             │
│    - Hash map, binary search                                  │
│    - 2-3 problems/day                                         │
└────────────────────────────────────────────────────────────────┘
```

#### Tuần 22-23: System Design & Mock Interviews

| Tuần | Activities                                               |
| ---- | -------------------------------------------------------- |
| 22   | System Design practice (2 designs/week), RADIO framework |
| 23   | Mock interviews với peers, behavioral prep               |

#### Tuần 24: Final Sprint

- Review weak areas
- Company-specific prep
- Rest before interviews

---

## 3. Quản Lý Năng Lượng & Thời Gian

### 🌅 Daily Schedule Templates

#### Working Professional (2-3h/day)

```mermaid
flowchart LR
    subgraph Morning["🌅 Morning (Optional)"]
        M1["6:00-6:30<br/>Review flashcards<br/>Spaced repetition"]
    end

    subgraph Evening["🌙 Evening (Main)"]
        E1["19:00-20:00<br/>Theory Deep Dive<br/>Fresh mind"]
        E2["20:00-21:00<br/>Practice/Coding<br/>Apply knowledge"]
        E3["21:00-21:30<br/>Review & Notes<br/>Consolidate"]
    end

    Morning --> Evening
```

#### Full-Time Prep (6-8h/day)

| Time        | Activity                     | Brain State  |
| ----------- | ---------------------------- | ------------ |
| 08:00-10:00 | Deep Theory (hardest topics) | Peak focus   |
| 10:00-10:30 | Break + Walk                 | Recovery     |
| 10:30-12:00 | Coding Practice              | High focus   |
| 12:00-13:00 | Lunch + Nap                  | Recovery     |
| 13:00-15:00 | Review + Notes               | Medium focus |
| 15:00-15:30 | Break                        | Recovery     |
| 15:30-17:00 | Mock interview / Project     | Active       |
| 17:00-18:00 | Spaced repetition            | Low focus OK |

### ⚡ Energy Management

```mermaid
flowchart TB
    subgraph Peak["🔥 Peak Energy (Morning)"]
        P1["New concepts<br/>Hard problems<br/>System design"]
    end

    subgraph Medium["💡 Medium Energy (Afternoon)"]
        M1["Review existing knowledge<br/>Practice familiar patterns<br/>Note-taking"]
    end

    subgraph Low["🌙 Low Energy (Evening)"]
        L1["Flashcard review<br/>Video watching<br/>Light reading"]
    end
```

### 🍅 Pomodoro Adaptation for Coding

```
CODING POMODORO (không standard 25min)

Deep Theory:    45 min work → 10 min break
Coding:         50 min work → 10 min break
Review:         25 min work → 5 min break

WHY longer for coding?
- Context switching expensive
- Need time to get into "flow"
- Stopping mid-problem is frustrating
```

---

## 4. Hệ Thống Tracking & Đánh Giá

### 📊 Weekly Progress Tracker

```markdown
## Week X/24 Progress

### Knowledge Completion

| Module           | Progress  | Confidence |
| ---------------- | --------- | ---------- |
| JavaScript Core  | ▓▓▓▓░ 80% | ⭐⭐⭐⭐   |
| React Philosophy | ▓▓▓░░ 60% | ⭐⭐⭐     |
| TypeScript       | ▓▓░░░ 40% | ⭐⭐       |

### Practice Stats

- Problems solved: X/week target
- Mock interviews: X completed
- Concepts taught to others: X

### Confidence Levels

- 🔴 Cannot explain without notes
- 🟡 Can explain with some hesitation
- 🟢 Can explain confidently + answer follow-ups
```

### Self-Assessment Rubric

| Level              | Description                             | Interview Ready? |
| ------------------ | --------------------------------------- | ---------------- |
| **1 - Aware**      | Heard of concept, can't explain         | ❌ No            |
| **2 - Familiar**   | Can explain basic idea with notes       | ❌ No            |
| **3 - Competent**  | Can explain WHY and HOW                 | 🟡 Maybe         |
| **4 - Proficient** | Can teach to others, handle follow-ups  | ✅ Yes           |
| **5 - Expert**     | Can debate trade-offs, create analogies | ✅ Strong        |

### Spaced Repetition Schedule

```mermaid
flowchart LR
    Day1["Day 1<br/>Learn"]
    Day2["Day 2<br/>Review 1"]
    Day4["Day 4<br/>Review 2"]
    Day7["Day 7<br/>Review 3"]
    Day14["Day 14<br/>Review 4"]
    Day30["Day 30<br/>Review 5"]

    Day1 --> Day2 --> Day4 --> Day7 --> Day14 --> Day30
```

---

## 5. Động Lực & Phục Hồi

### 🎯 Ikigai Framework cho Interview Prep

```mermaid
flowchart TB
    subgraph Ikigai["🇯🇵 Ikigai - Purpose Finding"]
        Love["❤️ What you LOVE<br/>Building UIs? Solving problems?"]
        Good["⭐ What you're GOOD at<br/>Your strongest skills"]
        Need["🌍 What the world NEEDS<br/>Market demand"]
        Paid["💰 What you can be PAID for<br/>Career growth"]
    end

    Center["🎯 Your WHY<br/>for interview prep"]

    Love --> Center
    Good --> Center
    Need --> Center
    Paid --> Center
```

### Burnout Prevention Strategies

```
┌────────────────────────────────────────────────────────────────┐
│  🛑 BURNOUT WARNING SIGNS                                      │
├────────────────────────────────────────────────────────────────┤
│  • Dreading study sessions                                     │
│  • Feeling like you're not making progress                     │
│  • Physical exhaustion                                         │
│  • Irritability                                                │
│  • Loss of motivation                                          │
├────────────────────────────────────────────────────────────────┤
│  ✅ PREVENTION ACTIONS                                         │
├────────────────────────────────────────────────────────────────┤
│  1. Mandatory rest days (1-2/week)                            │
│  2. Exercise (releases BDNF - brain growth factor)            │
│  3. Sleep 7-8h (memory consolidation happens)                 │
│  4. Social activities (dopamine reset)                        │
│  5. Celebrate small wins                                       │
└────────────────────────────────────────────────────────────────┘
```

### Celebration Milestones

| Milestone                     | Celebration                     |
| ----------------------------- | ------------------------------- |
| Complete Phase 1 (Foundation) | Day off + something enjoyable   |
| First mock interview          | Treat yourself                  |
| Reach 10 problems solved      | Share progress with friend      |
| Complete Phase 3              | Weekend break                   |
| First real interview          | Celebrate regardless of outcome |
| Get offer                     | You deserve it! 🎉              |

---

## 6. Big Tech Company Strategies

### Company-Specific Focus

```mermaid
flowchart TB
    subgraph Meta["🔵 Meta/Facebook"]
        M1["React internals (họ tạo ra)"]
        M2["Performance at scale"]
        M3["Product sense"]
    end

    subgraph Google["🔴 Google"]
        G1["Algorithms (quan trọng nhất)"]
        G2["Web fundamentals"]
        G3["System design"]
    end

    subgraph Microsoft["🟢 Microsoft"]
        M1b["TypeScript (họ tạo ra)"]
        M2b["Accessibility"]
        M3b["Enterprise patterns"]
    end

    subgraph Amazon["🟠 Amazon"]
        A1["Leadership Principles"]
        A2["System design"]
        A3["Behavioral questions"]
    end
```

### Interview Format Comparison

| Company       | Rounds | Focus Areas                       | Uniqueness                     |
| ------------- | ------ | --------------------------------- | ------------------------------ |
| **Meta**      | 5-6    | React, Performance, System Design | Product Architecture round     |
| **Google**    | 4-5    | Algorithms, Web, Googleyness      | Strong emphasis on algorithms  |
| **Microsoft** | 4-5    | TypeScript, Design, Behavioral    | As Appropriate (AA) bar raiser |
| **Amazon**    | 5-6    | LP, System Design, Coding         | Leadership Principles (14)     |
| **Grab**      | 3-4    | React, System Design, Culture     | Real-time features focus       |

### Last Week Before Interview Checklist

```markdown
## 📋 Final Week Checklist

### Knowledge Review

- [ ] Review all mental models (1 page each concept)
- [ ] Practice top 10 interview questions aloud
- [ ] Review company's tech blog posts

### Practice

- [ ] 2-3 mock interviews
- [ ] Review past mistakes
- [ ] Practice thinking out loud

### Logistics

- [ ] Research interviewers on LinkedIn
- [ ] Prepare questions to ask
- [ ] Test equipment (remote) or plan route (onsite)

### Mental Prep

- [ ] Good sleep schedule
- [ ] Light exercise
- [ ] Visualization of success
- [ ] Prepare "tell me about yourself" (2 min version)
```

---

## 🔗 Navigation

| Prev                                       | Module                      | Next                                   |
| ------------------------------------------ | --------------------------- | -------------------------------------- |
| [Quick Reference](./11-quick-reference.md) | **12. Learning Management** | [Knowledge Map](./00-knowledge-map.md) |

---

## 📚 Summary - Key Takeaways

> [!TIP] > **6-Month Success Formula:**
>
> 1. **WHAT-WHY-HOW-WHEN** cho mỗi concept
> 2. **Spaced Repetition** - Ôn đúng thời điểm
> 3. **Active Recall** - Test yourself, không passive reading
> 4. **Energy Management** - Hard tasks khi peak energy
> 5. **Deliberate Practice** - Focus vào weak areas
> 6. **Recovery** - Rest là phần của training

---

> _Quay lại: [Module 00: Knowledge Map](./00-knowledge-map.md) để bắt đầu_
