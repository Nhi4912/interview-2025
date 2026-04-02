# Common Behavioral Questions / Câu Hỏi Hành Vi Thường Gặp - 50+ Questions with Frameworks

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Danh sách các câu hỏi behavioral thường gặp và cách tiếp cận từng loại.

---

## 🎯 Question Categories / Danh Mục Câu Hỏi

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUESTION CATEGORIES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. LEADERSHIP & INFLUENCE (25%)                               │
│   2. PROBLEM SOLVING (20%)                                      │
│   3. TEAMWORK & COLLABORATION (20%)                             │
│   4. FAILURE & LEARNING (15%)                                   │
│   5. ACHIEVEMENTS (10%)                                         │
│   6. CONFLICT RESOLUTION (10%)                                  │
│                                                                   │
│   PREP STRATEGY:                                                │
│   ───────────────                                                │
│   Prepare 3-5 strong stories that can cover multiple            │
│   categories. Each story should be adaptable.                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👑 Leadership & Influence / Lãnh Đạo & Ảnh Hưởng

### Questions / Câu Hỏi

```
1. Tell me about a time you led a project or initiative.

2. Describe a situation where you had to influence someone
   without having direct authority over them.

3. Tell me about a time you had to make a decision without
   all the information you needed.

4. How do you handle disagreements with your manager?

5. Describe a time you took initiative on something.

6. Tell me about a time you had to convince stakeholders
   to take a different approach.

7. How do you prioritize when everything seems urgent?

8. Describe a time you delegated a task. How did you ensure
   it was done correctly?

9. Tell me about a time you had to step up as a leader
   unexpectedly.

10. How do you handle situations where team members disagree
    with your decisions?
```

### Sample Answer Framework / Khung Câu Trả Lời Mẫu

```
QUESTION: "Tell me about a time you led a project."

FRAMEWORK:
─────────────────────────────────────────────────────────────────

SITUATION: Set the stage
• What was the project?
• Why did it need leadership?
• What were the stakes?

TASK: Your leadership role
• Why were you chosen/stepped up?
• What was your specific responsibility?
• What challenges did you anticipate?

ACTION: Leadership behaviors
1. How did you plan/organize?
2. How did you communicate vision?
3. How did you motivate the team?
4. How did you handle obstacles?
5. How did you make decisions?

RESULT: Leadership impact
• Project outcomes (quantified)
• Team outcomes (growth, morale)
• What you learned as a leader
```

### Sample Answer: "Tell me about a project you led" / Câu Trả Lời Mẫu

**Situation:** At Teko Vietnam — a 60-person e-commerce technology company — our internal admin dashboard ran on a 4-year-old jQuery codebase. Every new feature took 2–3× longer than estimated, and onboarding new frontend developers averaged 4 weeks. I was one of 5 frontend developers on the team.

**Task:** I proposed and led the full migration of the dashboard to React + TypeScript. Timeline: 12 weeks. Team: 3 FE developers including myself. No dedicated PM support.

**Action:**

1. I audited the 5 highest-traffic dashboard modules _before_ writing any new code — spending 3 days mapping dependencies surfaced 2 integration risks we hadn't anticipated and saved us from mid-migration surprises.
2. I drafted a technical RFC and presented it to the CTO, proactively addressing his concern about running two codebases in parallel. I proposed the strangler fig pattern to avoid a risky big-bang rewrite.
3. I broke the migration into 2-week sprints with demo-able milestones, so stakeholders could see progress rather than waiting for a final delivery.
4. In week 6, one developer was pulled onto another team. I immediately renegotiated scope with the CTO — cutting 2 low-usage modules to protect quality, rather than rushing and accumulating debt.
5. I documented each component as we built it, keeping the small team aligned without creating knowledge silos.

**Result:** We shipped in 14 weeks — 2 over plan due to the resource change, which I communicated proactively. The first new feature built on the React stack took 3 days vs. the previous 9-day average — a 66% improvement. New hire onboarding dropped from 4 weeks to 10 days. The RFC format I introduced became the standard for all subsequent technical proposals at the company.

> 🎯 **Maps to:** Amazon LP: Ownership, Deliver Results | Google: Leadership under ambiguity
> 💡 **Follow-up they might ask:**
>
> - "How did you handle developers who were comfortable with the old jQuery stack?"
> - "What would you have done if the CTO rejected your RFC?"
> - "How did you maintain code quality when you lost a developer mid-project?"

---

### Sample Answer: "Tell me about a time you had to make a decision with incomplete information" / Câu Trả Lời Mẫu

**Situation:** At a Series B SaaS startup in Ho Chi Minh City, I was mid-sprint on a new client onboarding flow when our product manager resigned unexpectedly. I had partial wireframes, a rough user story, and a client demo scheduled in 3 weeks. No replacement PM had been assigned.

**Task:** I had to decide: pause development until a new PM confirmed requirements — risking missing the demo — or proceed on my best understanding, risking building the wrong thing for an important client.

**Action:**

1. I identified what I _did_ know: the core user journey, the client's stated pain points from a sales call transcript I tracked down, and our engineering constraints.
2. I created an "assumption log" — a one-page doc listing 7 key decisions I was making without confirmed PM input — and shared it immediately with the CTO and the client's account manager for visibility and early correction.
3. I chose to proceed, but constrained myself to building only the "happy path" first, leaving edge cases and config screens for after a new PM joined.
4. I scheduled a 30-minute stakeholder check-in every 3 days to surface any assumption violations early rather than discovering them the day of the demo.
5. When a new PM joined in week 2, I gave her the assumption log and a recorded Loom walkthrough of what had been built — she could validate or redirect without needing to read the code.

**Result:** The demo happened on schedule. 5 of 7 assumptions were confirmed correct; 2 required minor UI adjustments completed in 2 days because I had deliberately isolated those flows. The client signed the contract. The assumption log approach was adopted by the wider engineering team as a "decision journal" for high-ambiguity sprints.

> 🎯 **Maps to:** Amazon LP: Bias for Action, Are Right A Lot | Meta: Move fast with clarity
> 💡 **Follow-up they might ask:**
>
> - "What happened with the 2 wrong assumptions — how significant were the changes?"
> - "In hindsight, would you have paused development instead?"
> - "How do you decide when you have 'enough' information to proceed vs. when to wait?"

---

## 🔧 Problem Solving / Giải Quyết Vấn Đề

### Questions / Câu Hỏi

```
1. Tell me about a difficult bug or technical problem you solved.

2. Describe a time you had to solve a problem with limited
   resources.

3. How do you approach a problem you've never seen before?

4. Tell me about a time you had to make a decision with
   incomplete information.

5. Describe a time you identified a problem before anyone
   else noticed it.

6. Tell me about a time you had to debug a complex issue
   in production.

7. How do you prioritize multiple competing problems?

8. Describe a time you simplified a complex system or process.

9. Tell me about a time you had to learn something quickly
   to solve a problem.

10. How do you validate that your solution actually works?
```

### Sample Answer Framework / Khung Câu Trả Lời Mẫu

```
QUESTION: "Tell me about a difficult bug you solved."

FRAMEWORK:
─────────────────────────────────────────────────────────────────

SITUATION: The problem context
• What was the bug/issue?
• What was the impact?
• Why was it difficult?

TASK: Your responsibility
• Why was this your problem?
• What was expected of you?
• What were the constraints?

ACTION: Problem-solving process
1. How did you investigate?
   - Tools used
   - Hypotheses formed
2. What dead ends did you hit?
3. What was the breakthrough?
4. How did you implement the fix?
5. How did you verify it worked?

RESULT: Resolution and learning
• How was the issue resolved?
• What was the impact of the fix?
• What did you learn?
• What would you do differently?
```

### Sample Answer: "Tell me about your biggest technical challenge" / Câu Trả Lời Mẫu

**Situation:** At a Southeast Asian super-app with 3 million monthly active users in Vietnam, I was the frontend lead for the mobile web checkout experience. Performance monitoring showed our checkout page took 11–14 seconds to become interactive on budget Android devices (Redmi, Vsmart) over 3G — the network profile of roughly 40% of our users in Tier 2–3 cities. Mobile web cart abandonment was 52%.

**Task:** I was tasked with reducing Time to Interactive (TTI) to under 4 seconds on a Moto G4 equivalent device with 3G throttling, within one 6-week sprint, without restructuring any backend APIs.

**Action:**

1. I started with measurement, not assumptions. I set up WebPageTest with a Moto G4 + 3G throttle profile and ran Lighthouse audits. I found 3 primary offenders: a 1.8MB eagerly-loaded JavaScript bundle, 14 render-blocking third-party scripts (analytics, chat widget, A/B test SDK), and uncompressed product images totalling 2.3MB per page.
2. I implemented route-based code splitting with `React.lazy` + `Suspense`, cutting the initial JS bundle from 1.8MB to 310KB. This single change had the highest leverage.
3. For third-party scripts, I built a loading manager that deferred all non-critical scripts until after the first user interaction using a `requestIdleCallback` queue. This required negotiating with the Growth team who worried about analytics gaps — I showed them data loss was under 2% at our traffic volume, and they agreed.
4. I converted all product images to WebP with `<picture>` element fallbacks, added responsive `srcset`, and lazy-loaded images below the fold.
5. I added Lighthouse CI to our GitHub Actions pipeline — any PR increasing the initial bundle over 350KB would fail the build, making the performance gains self-defending against regressions.

**Result:** TTI dropped from 11.3 seconds to 3.1 seconds (p75 on real user monitoring). Mobile web cart abandonment fell from 52% to 38% over the following 4 weeks — approximately $180,000 in additional monthly GMV. The performance budget guardrails caught 9 bundle-size regressions in the next quarter before they reached production.

> 🎯 **Maps to:** Amazon LP: Dive Deep, Deliver Results | Google: Technical excellence & data-driven decisions
> 💡 **Follow-up they might ask:**
>
> - "How did you convince the Growth team to accept deferring their analytics scripts?"
> - "What was the hardest trade-off you had to make during this project?"
> - "How did you validate the improvements on real devices rather than just Lighthouse emulation?"

---

## 🤝 Teamwork & Collaboration / Làm Việc Nhóm & Cộng Tác

### Questions / Câu Hỏi

```
1. Tell me about a successful team collaboration.

2. How do you handle a teammate who isn't pulling their weight?

3. Describe a time you helped someone on your team grow.

4. Tell me about a time you received feedback from a peer.

5. How do you build relationships with colleagues in
   different time zones?

6. Describe a time you had to work with someone difficult.

7. Tell me about a time you disagreed with a teammate.
   How did you resolve it?

8. How do you share knowledge with your team?

9. Describe a time when your team failed. What was your role?

10. Tell me about a time you had to collaborate with another
    team to achieve a goal.
```

### Sample Answer Framework / Khung Câu Trả Lời Mẫu

```
QUESTION: "Tell me about a time you worked with someone difficult."

FRAMEWORK:
─────────────────────────────────────────────────────────────────

SITUATION: The collaboration context
• What was the project/goal?
• What made this person difficult?
• Be objective, don't badmouth

TASK: Your responsibility
• What was your role?
• What was at stake?
• Why couldn't you avoid this person?

ACTION: Collaboration strategies
1. How did you try to understand them?
2. What adjustments did you make?
3. How did you communicate?
4. Did you seek help/escalate?
5. What compromises did you make?

RESULT: Relationship outcome
• Did the project succeed?
• How did the relationship evolve?
• What did you learn about working with different personalities?

IMPORTANT: Never blame, always show empathy and growth
```

---

## 💥 Failure & Learning / Thất Bại & Học Hỏi

### Questions / Câu Hỏi

```
1. Tell me about a time you failed.

2. Describe a mistake you made and what you learned from it.

3. How do you handle negative feedback?

4. Tell me about a project that didn't go as planned.

5. Describe a time you received criticism you disagreed with.

6. How do you recover from setbacks?

7. Tell me about a time you had to admit you were wrong.

8. Describe a time your work was rejected. What did you do?

9. Tell me about a goal you didn't achieve.

10. How do you handle imposter syndrome or self-doubt?
```

### Sample Answer Framework / Khung Câu Trả Lời Mẫu

```
QUESTION: "Tell me about a time you failed."

FRAMEWORK (Critical for this category):
─────────────────────────────────────────────────────────────────

SITUATION: Set up the failure
• What was the context?
• What were you trying to achieve?
• What were the stakes?

TASK: Your responsibility
• What was YOUR role?
• Be honest about accountability

ACTION: What went wrong
1. What did you do (or not do)?
2. What was your thinking at the time?
3. When did you realize it was failing?
4. What did you try to salvage it?

RESULT: The failure AND learning (MOST IMPORTANT)
• What was the outcome?
• What did you learn?
• How have you applied that learning since?
• Give example of applying the lesson

KEY POINTS:
• Own the failure - don't blame others
• Show genuine self-reflection
• Demonstrate growth
• Show you've applied the learning
```

### Sample Answer: "Tell me about a time you failed" / Câu Trả Lời Mẫu

**Situation:** At a Vietnamese e-commerce platform, I was the sole frontend developer responsible for a new promotional banner carousel for our annual 11/11 sale — the biggest revenue day of the year. I had 2 weeks to build, test, and coordinate the production deployment. The stakes were high: banners drove the highest traffic-to-purchase conversion of the year.

**Task:** I was fully accountable for this feature's readiness. Any breakage at peak traffic would directly cost real revenue.

**Action (and where I failed):**
I built and thoroughly tested the carousel on Chrome desktop and Android Chrome — our two highest-traffic browsers by analytics data. Satisfied with the results and under time pressure, I shipped to production at 9 PM the night before 11/11.

What I did not do: test on Safari or iOS. I told myself, "We'll add iOS to the regression checklist next sprint."

**Result:** At 6 AM on 11/11, Slack lit up. The carousel was invisible on iPhone — a CSS `gap` property inside flexbox had no support on Safari below version 14.1, affecting roughly 28% of our users on older iOS devices. I pushed a hotfix within 90 minutes, but we had already lost 3–4 hours of peak morning iOS traffic. Post-mortem analysis estimated $40,000–60,000 in lost GMV.

I owned this fully in the post-mortem. Three concrete changes I made immediately: (1) iOS Safari became mandatory on my personal pre-release checklist — I now test every UI feature on a physical iPhone before any production deployment. (2) I integrated Browserslist-based autoprefixer into our build pipeline, which would have caught this specific issue automatically. (3) I created a shared "browser compatibility checklist" for the whole FE team that has been referenced in every sprint since. In the next major campaign (Tết), there were zero browser compatibility issues.

> 🎯 **Maps to:** Amazon LP: Earn Trust, Learn and Be Curious | Google: Self-awareness and growth mindset
> 💡 **Follow-up they might ask:**
>
> - "How did your manager and team react when this happened?"
> - "What would you do differently if you faced the same 2-week deadline again?"
> - "Was there any temptation to attribute this to the timeline pressure rather than your own testing process?"

---

## 🏆 Achievements / Thành Tích

### Questions / Câu Hỏi

```
1. What's your proudest professional accomplishment?

2. Tell me about a time you exceeded expectations.

3. Describe your biggest impact at your previous company.

4. What's the most innovative thing you've done?

5. Tell me about a time you went above and beyond.

6. What's the most challenging thing you've accomplished?

7. Describe a time you delivered something that others
   thought was impossible.

8. What achievement are you most proud of outside of work?

9. Tell me about a time you turned around a struggling project.

10. What's the biggest risk you took that paid off?
```

### Sample Answer Framework / Khung Câu Trả Lời Mẫu

```
QUESTION: "What's your proudest accomplishment?"

FRAMEWORK:
─────────────────────────────────────────────────────────────────

CHOOSE wisely - this reflects your values

SITUATION: Context that shows difficulty
• What made this challenging?
• Why was it significant?

TASK: Your specific role
• What were you responsible for?
• What constraints existed?

ACTION: What YOU did (detailed)
1. Your unique contributions
2. Obstacles you overcame
3. Skills you demonstrated
4. How you went above and beyond

RESULT: Impact (quantify!)
• Business impact
• Team/organizational impact
• Personal growth
• Recognition received

END WITH: Why this matters to you
• What does this say about your values?
• How does it connect to this role?
```

---

## ⚔️ Conflict Resolution / Giải Quyết Xung Đột

### Questions / Câu Hỏi

```
1. Tell me about a time you had a conflict with a colleague.

2. How do you handle disagreements about technical decisions?

3. Describe a time you had to give difficult feedback.

4. Tell me about a time you mediated a conflict between others.

5. How do you handle a manager who you disagree with?

6. Describe a time you had to push back on a decision.

7. Tell me about a time you had to say no to a stakeholder.

8. How do you handle conflicting priorities from different
   stakeholders?

9. Describe a time you de-escalated a tense situation.

10. Tell me about a time you changed someone's mind.
```

### Sample Answer Framework / Khung Câu Trả Lời Mẫu

```
QUESTION: "Tell me about a conflict with a colleague."

FRAMEWORK:
─────────────────────────────────────────────────────────────────

SITUATION: The conflict (objectively)
• What was the disagreement about?
• Why did it matter?
• Present both sides fairly

TASK: Your responsibility
• What needed to be resolved?
• Why was resolution important?

ACTION: Resolution process
1. How did you approach the person?
2. How did you listen to understand?
3. What was your perspective?
4. How did you find common ground?
5. What compromises were made?

RESULT: Resolution and relationship
• Was the issue resolved?
• What was the outcome?
• How is the relationship now?
• What did you learn about conflict resolution?

KEY: Show you can disagree without being disagreeable
```

### Sample Answer: "Tell me about a time you disagreed with your team" / Câu Trả Lời Mẫu

**Situation:** At a B2B SaaS company in Hanoi, our team of 6 (2 frontend, 2 backend, 1 designer, 1 PM) was planning a major analytics dashboard redesign. The backend team lead — a well-respected senior engineer — strongly advocated for server-side rendering with minimal JavaScript, citing simpler deployment and easier production debugging. I believed the product required a React SPA with a REST API to support the real-time filtering features our 3 largest enterprise clients had explicitly requested for 6 months.

**Task:** I needed to advocate for the approach I believed was technically correct for our users, without damaging my relationship with a senior colleague whose technical judgment I genuinely respected.

**Action:**

1. Before pushing back in a group meeting, I asked the backend lead for a 1:1 to truly understand his reasoning. His core concern was that our team had limited SPA production debugging experience — a legitimate technical risk, not just resistance to change.
2. I prepared a 2-page written trade-off analysis covering: real-time capability, development velocity, production debugging complexity, and team learning curve. I shared it 2 days before the decision meeting so everyone could review without being put on the spot.
3. In the document, I directly addressed his concern: "The SSR approach reduces production debugging complexity. To mitigate the SPA risk, I propose we add Sentry error monitoring and structured logging as part of the initial setup — not as optional follow-ups."
4. I suggested a bounded pilot: build the most complex filtering module as a React SPA proof-of-concept in one sprint, measure it objectively, then decide together. This reframed the decision from "who's right" to "let's find out."
5. After reviewing the POC together, he agreed the SPA was the right call — and suggested a state management improvement I hadn't considered.

**Result:** The SPA approach was approved. The dashboard shipped in 10 weeks, including the real-time filtering feature that was the original business driver. In the following quarter, 3 enterprise clients specifically cited the filtering capability as a factor in their contract renewals. More importantly, the backend lead became one of my most trusted technical reviewers — he now asks for my architecture input early, and I seek his production debugging perspective on my designs.

> 🎯 **Maps to:** Amazon LP: Have Backbone; Disagree and Commit, Earn Trust | Google: Collaborative technical decision-making
> 💡 **Follow-up they might ask:**
>
> - "What would you have done if the POC results didn't support your approach?"
> - "Was there any point where you considered simply deferring to the senior engineer to avoid conflict?"
> - "How did you make sure others didn't feel you were going around the group process with the written document?"

---

## 🎤 Self-Awareness & Motivation / Tự Nhận Thức & Động Lực

### Questions / Câu Hỏi

```
1. Why do you want to work here?

2. What are your strengths and weaknesses?

3. Where do you see yourself in 5 years?

4. Why are you leaving your current role?

5. What motivates you?

6. How do you handle stress?

7. What would your colleagues say about you?

8. What type of work environment do you thrive in?

9. How do you stay current with technology?

10. What are you looking for in your next role?
```

### Sample Answers / Câu Trả Lời Mẫu

```
WEAKNESS:
─────────────────────────────────────────────────────────────────
"I tend to be overly detail-oriented, which sometimes means
I spend more time than necessary on tasks. I've learned to
address this by setting time limits for myself and asking
'is this good enough?' rather than 'is this perfect?'
For example, in code reviews, I now focus on the most
impactful feedback rather than commenting on every style issue."

KEY: Real weakness + Active improvement + Example

WHY THIS COMPANY:
─────────────────────────────────────────────────────────────────
Structure your answer:
1. What excites you about the company's mission/product
2. Why the role is a good fit for your skills
3. How you can contribute and grow

"I'm excited about [Company] because [specific product/mission].
I've been using [product] and particularly appreciate [feature].
This role aligns with my experience in [relevant skill] and
my interest in [growth area]. I'm eager to contribute to
[specific project/initiative] while learning more about [area]."

AVOID: Generic answers that could apply anywhere
```

---

## ✅ Question Preparation Checklist / Danh Sách Chuẩn Bị Câu Hỏi

```
For each question category, ensure you have:

□ LEADERSHIP
  □ Story about leading a project
  □ Story about influencing without authority
  □ Story about making tough decisions

□ PROBLEM SOLVING
  □ Technical debugging story
  □ Story about learning something new quickly
  □ Story about dealing with ambiguity

□ TEAMWORK
  □ Successful collaboration story
  □ Story about helping someone grow
  □ Story about working with difficult people

□ FAILURE & LEARNING
  □ Clear failure story with learnings
  □ Story about receiving negative feedback
  □ Story about admitting you were wrong

□ ACHIEVEMENT
  □ Your proudest accomplishment
  □ Story about exceeding expectations
  □ Story about taking initiative

□ CONFLICT
  □ Story about resolving a disagreement
  □ Story about pushing back respectfully
  □ Story about giving difficult feedback
```

---

## 📚 Active Recall / Nhớ Lại Chủ Động

1. [ ] List 3 questions from each category
2. [ ] What's the key point for failure story answers?
3. [ ] How should you structure a conflict resolution story?
4. [ ] What makes a good "weakness" answer?
5. [ ] How many stories should you prepare in total?

---

> **Tiếp theo:** [04-storytelling.md](./04-storytelling.md) - How to Tell Stories
