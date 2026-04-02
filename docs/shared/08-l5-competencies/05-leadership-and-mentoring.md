# Leadership & Mentoring — Growing Others While Delivering / Dan Dat & Huong Dan

> **Track**: Shared | **L5 Weight**: 10pts/100
> **L5 Competencies**: Leadership (10pts)
> **See also**: [L5 Self-Assessment](./00-l5-self-assessment.md) | [Leadership Principles](../09-behavioral/02-leadership-principles.md) | [Storytelling](../09-behavioral/04-storytelling.md)

---

## Real-World Scenario / Tinh Huong Thuc Te

Team frontend 5 nguoi tai mot cong ty fintech o TP.HCM. Hai senior cung level, cung ky nang code.

**Senior A — "Code machine"**: Ship feature nhanh nhat team. Khi junior hoi, tra loi "de anh lam cho nhanh." Sprint nao cung complete nhieu story nhat. Nhung sau 6 thang: 2 junior xin nghi vi khong hoc duoc gi, bus factor = 1 (chi minh anh hieu hệ thống), team velocity giam 30% khi anh nghi phep 2 tuan.

**Senior B — "Force multiplier"**: Ship cham hon Senior A 20% trong thang dau. Nhung anh dành 2-3 giờ/tuần pair programming voi junior, viet onboarding doc, tao code review checklist. Sau 6 thang: 2 junior co the handle feature doc lap, bus factor = 4, team velocity tang 50% so voi ban dau. Khi anh nghi phep, team van chay binh thuong.

**Bai hoc**: L5 khong duoc do bang individual output — ma bang **team output nho ban**. Interviewer hoi "How did you grow the people around you?" de phan biet Senior voi Staff-track engineer.

---

## Framework / Khung Nang Luc

### 1. SBI Feedback Model — Situation, Behavior, Impact

SBI la framework cho feedback cu the, khong phan xet ca nhan — dung trong code review, 1:1, va retrospective.

```
S — Situation: Mo ta boi canh cu the (thoi gian, noi, project)
B — Behavior:  Mo ta hanh vi QUAN SAT DUOC (khong phan xet y dinh)
I — Impact:    Giai thich tac dong cua hanh vi do (len team, product, user)
```

**Vi du tot (code review):**

- S: "Trong PR #342 hom qua cho checkout flow..."
- B: "Em dat ten bien `d` cho variable chua date range, va khong co comment giai thich business logic cua discount calculation..."
- I: "Khi nguoi khac doc code nay, ho se mat 15-20 phut de hieu. Neu co bug trong discount logic, nguoi fix se khong biet intent ban dau la gi."

**Vi du xau:**

- "Code em viet do qua." (phan xet ca nhan, khong actionable)
- "Em can viet code tot hon." (khong cu the)

**Ung dung trong 1:1:**

- **Positive SBI** (quan trong khong kem negative): "Trong sprint planning thu 3 (S), em chu dong de xuat chia epic thanh 3 story nho hon va identify dependency voi backend team (B). Nho vay team khong bi block va ship dung deadline (I)."
- **Corrective SBI**: "Trong standup 3 ngay lien (S), em chi noi 'dang lam' ma khong share blocker (B). Anh va team khong biet em stuck, nen khong ho tro duoc som (I). Em co the share chi tiet hon khong?"

### 2. Mentoring vs Coaching vs Sponsoring

Ba phuong phap khac nhau, dung cho cac tinh huong khac nhau:

| Aspect           | Mentoring                                           | Coaching                                                         | Sponsoring                                                         |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Dinh nghia**   | Chia se kinh nghiem va kien thuc                    | Dat cau hoi de nguoi khac tu tim cau tra loi                     | Dung influence cua ban de tao co hoi cho nguoi khac                |
| **Khi nao dung** | Junior chua co mental model, can direction          | Mid-level co kien thuc nhung chua tu tin hoac chua thay goc nhin | Nguoi co nang luc nhung thieu visibility hoac co hoi               |
| **Vi du**        | "Day la cach anh approach system design: buoc 1..." | "Em nghi approach nao tot nhat? Tai sao?"                        | "Anh de xuat em present technical decision nay cho VP Engineering" |
| **Ket qua**      | Nguoi hoc duoc kinh nghiem nhanh                    | Nguoi hoc phat trien tu duy doc lap                              | Nguoi hoc duoc recognized va co co hoi moi                         |
| **Rui ro**       | Tao dependency — luon can mentor                    | Mat thoi gian neu nguoi chua co base knowledge                   | Mat uy tin neu nguoi duoc sponsor chua san sang                    |

**Quy tac ngon tay cai:**

- Junior (0-2 nam): 70% mentoring, 20% coaching, 10% sponsoring
- Mid (2-4 nam): 20% mentoring, 60% coaching, 20% sponsoring
- Senior (4+ nam): 10% mentoring, 30% coaching, 60% sponsoring

### 3. Psychological Safety Framework

Amy Edmondson (Harvard) dinh nghia psychological safety: "Moi truong ma thanh vien team cam thay an toan de len tieng, hoi cau hoi, nhan loi, va de xuat y tuong ma khong so bi phat hay bi danh gia."

**4 Stages of Psychological Safety (Timothy Clark):**

```
Stage 4: Challenger Safety    ← Moi nguoi dam phan bac y tuong (ke ca lead)
Stage 3: Contributor Safety   ← Moi nguoi dam dong gop y kien va lam viec doc lap
Stage 2: Learner Safety       ← Moi nguoi dam hoi cau hoi va nhan loi sai
Stage 1: Inclusion Safety     ← Moi nguoi cam thay duoc chap nhan trong team
```

**Cach L5 tao psychological safety:**

1. **Model vulnerability**: Khi ban sai, noi truoc team: "Hom qua anh deploy bug vi khong viet test cho edge case nay. Day la postmortem." Team thay leader nhan loi → ho cung dam nhan loi.

2. **Respond to mistakes with curiosity, not blame**: Khi junior deploy bug: "Bug xay ra nhu the nao? Process nao thieu de catch no?" thay vi "Tai sao em khong test?"

3. **Invite dissent explicitly**: Trong tech discussion, hoi: "Ai co y kien khac? Approach nay co diem yeu gi?" Khi khong ai noi, goi ten: "Minh, em lam feature tuong tu — em thay approach nay co van de gi khong?"

4. **Separate idea from person**: "Y tuong dung database X co trade-off la..." thay vi "Y tuong cua em khong tot."

### 4. Tech Lead Patterns — Leading Without Authority

L5 thuong khong co formal authority (khong phai manager), nhung can influence team. Cac pattern hieu qua:

**Pattern 1 — "First Follower"**: Thay vi push y tuong cua ban, tim nguoi khac co y tuong tot va support ho. Khi ban ung ho y tuong cua junior trong meeting, ban vua validate ho vua build trust.

**Pattern 2 — "Show, Don't Tell"**: Viet RFC/design doc chat luong cao → nguoi khac thay standard va follow. Tot hon la noi "moi nguoi can viet RFC tot hon."

**Pattern 3 — "Lighthouse"**: Khi team confusion ve direction, ban la nguoi viet ra clearly: "Day la north star, day la 3 priorities tuan nay, day la ra ngoai scope." Team can clarity, khong can authority.

**Pattern 4 — "Bridge Builder"**: L5 connect cross-team. Khi BE team va FE team disagree ve API contract, ban la nguoi goi meeting, document both sides, va propose compromise. Influence through facilitation.

**Pattern 5 — "Documentation as Leadership"**: Viet ADR (Architecture Decision Records), runbooks, onboarding guides. Nguoi viet documentation co influence vi ho define how things work.

### 5. Onboarding Playbook — Ramping Up New Members

Framework 30-60-90 days cho onboarding hieu qua:

```
Day 1-30: ABSORB
├── Setup dev environment (co doc, khong phai hoi)
├── Read 3-5 ADRs/design docs quan trong nhat
├── Pair voi 2-3 team members tren different areas
├── Ship 3-5 small PRs (bug fix, minor feature)
├── Co buddy (nguoi hoi bat ky luc nao, khong phai lead)
└── Outcome: Hieu codebase structure, deploy process, team norms

Day 31-60: CONTRIBUTE
├── Own 1 medium feature (co mentor shadow)
├── Do 5-10 code reviews (hoc codebase qua review)
├── Attend 1 on-call rotation (shadow)
├── Write 1 doc cai thien (nhìn thay gap tu goc newcomer)
└── Outcome: Ship feature doc lap, hieu production system

Day 61-90: OWN
├── Own 1 feature end-to-end (tu requirement → deploy)
├── Lead 1 small technical decision
├── Mentor nguoi moi hon (neu co)
├── Give feedback ve onboarding process
└── Outcome: Fully productive, co the on-call doc lap
```

**Key insight**: Nguoi moi thay GAP trong documentation ma team cu khong thay. Leverage dieu nay — yeu cau ho viet lai bat ky doc nao confusing.

---

## Examples / Vi Du Thuc Te (STAR Format)

### Example 1: Strong — "Force Multiplier Senior" (Mentor grew 2 juniors to mid-level)

**Situation**: Team e-commerce, 2 junior join cung luc. Sprint velocity giam 25% vi senior phai review code va tra loi cau hoi lien tuc. Manager lo ngai timeline.

**Task**: Giup 2 junior productive trong 3 thang ma khong sacrifice sprint commitments.

**Action**:

1. Tao structured onboarding: 30-60-90 day plan voi milestones ro rang
2. Pair programming 2 gio/tuan voi moi junior — khong lam ho, ma hoi "em tiep can bai nay the nao?" (coaching, khong chi mentoring)
3. Code review framework: viet checklist 15 items cho PR, junior tu check truoc khi request review
4. "Teaching tax" — explain cho manager: "Thang nay velocity giam 15%, nhung thang thu 3 se tang 40% vi co 2 nguoi nua contribute"

**Result**: Sau 3 thang, ca 2 junior ship feature doc lap. Team velocity tang 45% so voi truoc khi ho join. Mot junior duoc promote len mid sau 8 thang. Manager dung model nay cho onboarding team khac.

**Memory Hook**: "Day cau ca, khong cho ca" — teach to fish, don't give fish.

### Example 2: Weak — "Hero Coder" (Did everything himself)

**Situation**: Cung tinh huong — 2 junior join team. Senior nay co ky nang code rat tot.

**Task**: Giup team ship nhanh hon.

**Action**:

1. Khi junior hoi, tra loi: "De anh fix cho, nhanh hon"
2. Lam them gio de compensate cho junior velocity thap
3. Khong co onboarding plan — "doc code se hieu"
4. Code review: fix luon code thay vi explain tai sao sai

**Result**: Senior burn out sau 4 thang. Junior khong hoc duoc gi — 1 nguoi xin nghi. Team phu thuoc hoan toan vao senior. Khi senior nghi phep 2 tuan, team khong ship duoc gi. Manager phai hire lai tu dau.

**Anti-pattern nhan dien**: "I'll just do it myself" — signal cua individual contributor, khong phai leader.

### Example 3: Strong — "Psychological Safety Builder"

**Situation**: Team co van hoa "blame" — khi bug xay ra, standup tro thanh "ai lam do". Junior so push code, review mat 3-4 ngay vi so bi criticize.

**Task**: Thay doi van hoa team de moi nguoi dam len tieng va ship nhanh hon.

**Action**:

1. Bat dau tu ban than: Khi deploy bug, viet postmortem cong khai. "Anh miss edge case nay vi khong co integration test. Day la action item."
2. Doi code review culture: Chuyen tu "Tai sao em lam the nay?" sang "Anh tu hoi lieu approach nay co handle case X khong?"
3. Tao "Blameless Postmortem" template: Focus vao process failure, khong phai people failure
4. Trong retro, hoi: "Team minh co diem nao chua tot ma chua ai dam noi?"

**Result**: Sau 2 thang, review turnaround giam tu 3 ngay xuong 4 gio. Junior bat dau propose technical solutions trong planning. So luong bugs giam 30% vi nguoi ta dam hoi khi chua hieu, thay vi code theo phan doan.

---

## Anti-patterns / Sai Lam Thuong Gap

| Anti-pattern                      | Tai sao that bai                                      | Cach lam tot hon                                                           |
| --------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| "De anh lam cho nhanh"            | Junior khong hoc, bus factor = 1, senior burn out     | Pair programming: lam cung, khong lam thay                                 |
| Feedback sandwich (khen-che-khen) | Nguoi nhan confuse, khong biet dau la feedback that   | Dung SBI — feedback truc tiep, cu the, khong phan xet                      |
| Chi mentor nguoi giong minh       | Tao homogeneous team, miss diverse perspectives       | Y thuc mentor nguoi co background khac ban                                 |
| Skip 1:1 khi ban                  | 1:1 la co hoi duy nhat de hieu blocker va career goal | 1:1 la sacred — khong cancel, chi reschedule                               |
| Micromanage thay vi trust         | Team mat motivation, khong phat trien autonomy        | Define outcome, khong define cach lam. Review result, khong review process |
| Chi cho negative feedback         | Team so sai, khong dam thu cai moi                    | Positive SBI it nhat gap doi negative SBI                                  |
| "Open door policy" ma khong hoi   | Nguoi noi xin khong bao gio tu den                    | Chu dong hoi trong 1:1: "Em dang stuck cho nao?"                           |

---

## Q&A Section — Interview Questions

### Q: What does leadership mean for a senior engineer who is not a manager? / Leadership co nghia gi voi senior engineer khong phai manager? 🟢 Junior

**A:** Leadership at the senior IC level means three things: (1) **Growing others** — making the people around you more effective through mentoring, code reviews, and knowledge sharing. (2) **Technical influence** — setting standards, writing design docs, and making architectural decisions that guide the team's direction. (3) **Unblocking** — proactively identifying when teammates are stuck and helping them move forward.

"Leadership khong phai la co title hay direct report. La khi ban roi khoi team, team co tot hon truoc khong? Neu ban code gioi nhung khong ai hoc duoc gi tu ban, ban la strong IC nhung chua phai leader. L5 can ca hai."

**Interview Signal:**

- ✅ Strong: Gives specific examples of growing others, distinguishes IC leadership from management
- ❌ Weak: "Leadership means telling people what to do" or confuses leadership with seniority

---

### Q: Tell me about a time you gave difficult feedback to a teammate. How did you approach it? / Ke ve lan ban phai cho feedback kho cho dong nghiep. 🟡 Mid

**A:** Use the SBI model. First, choose the right setting — difficult feedback should be private, in a 1:1, not in a group. Then structure it as Situation-Behavior-Impact to keep it objective and actionable.

Example: "In a recent project (S), I noticed a teammate was consistently submitting PRs without tests and with minimal documentation (B). This caused our review cycle to double because reviewers had to manually verify behavior and ask for context (I). In our 1:1, I shared this observation using SBI, then asked open-ended questions: 'What's making it hard to add tests?' Turned out they were unfamiliar with our testing framework. We paired for 2 hours, and their next 5 PRs all had tests."

Key principles:

1. **Private, not public** — Never give corrective feedback in a group setting
2. **Timely** — Within 48 hours of the behavior, not 2 months later in performance review
3. **Actionable** — End with a clear ask or collaborative plan
4. **Follow up** — Check in the next week to see if the change stuck

"Feedback kho nhat khong phai negative feedback — ma la feedback cho nguoi ban than thiet. SBI giup ban tach cam xuc ra khoi observation. Ban khong phan xet con nguoi — ban mo ta hanh vi va tac dong."

**Interview Signal:**

- ✅ Strong: Has a framework, gives specific example, shows empathy and follow-through
- ❌ Weak: "I just tell them directly" (no structure), or "I avoid conflict" (no leadership)

---

### Q: How do you build a culture of psychological safety in an engineering team? What's your approach when you inherit a team with a blame culture? / Lam sao xay dung psychological safety? Khi tiep quan team co van hoa do loi thi sao? 🔴 Senior

**A:** Psychological safety is the foundation of high-performing teams (Google's Project Aristotle confirmed this as the #1 factor). Building it requires intentional, consistent action:

**Phase 1 — Model vulnerability (Week 1-4):**
Start with yourself. Publicly acknowledge your own mistakes in standups and retros. Write blameless postmortems for your own bugs. When you don't know something, say "I don't know, let me find out." This signals to the team that imperfection is safe.

**Phase 2 — Change response patterns (Week 2-8):**
When someone makes a mistake, respond with curiosity: "What happened?" instead of "Why did you do that?" Replace "Who caused this?" with "What process failed?" In code reviews, use language like "I wonder if..." and "Have you considered..." instead of "This is wrong."

**Phase 3 — Create explicit rituals (Week 4-12):**

- Blameless postmortem template that focuses on systems, not individuals
- "New hire review" — ask new members to document confusing processes (they see gaps veterans don't)
- Retro prompt: "What's one thing we're not talking about that we should?"
- Celebrate learning from failure, not just success

**Phase 4 — Sustain and measure (Ongoing):**

- Track proxy metrics: time to first PR comment, retro participation rate, number of questions in planning
- If someone shares a mistake and gets supported, highlight it: "Cam on em da share early — nho vay minh catch bug truoc khi len production"
- If you see blame behavior, address it privately with SBI

"Psychological safety khong phai 'moi nguoi nice voi nhau.' La moi nguoi dam noi that — dam noi 'approach nay co van de', dam noi 'em khong hieu', dam noi 'em sai roi.' Team co psychological safety ship nhanh hon vi khong ai giau bug, khong ai so hoi cau hoi."

**Interview Signal:**

- ✅ Strong: Has phased approach, mentions specific rituals, connects to team performance, shares concrete example
- ❌ Weak: "I just tell everyone to be nice" or has no framework

🔗 **Follow-up Chain:**

1. → "How do you measure whether psychological safety is improving? What leading indicators would you track?"
2. → "What do you do when a senior engineer on the team actively undermines psychological safety — for example, dismissing junior ideas in meetings?"
3. → "How do you balance psychological safety with accountability? How do you ensure 'safe to fail' doesn't become 'no consequences'?"

---

## Memory Hooks / Meo Ghi Nho

- **"Bus Factor Test"**: Doi bus factor cua team ban la bao nhieu? Neu ban bi xe bus (hoac nghi phep 2 tuan), team co chay duoc khong? Leadership = tang bus factor.
- **"SBI = Screenshot"**: SBI giong nhu chup screenshot cua tinh huong — Situation la context, Behavior la gi xay ra trong hinh, Impact la caption.
- **"Teach to Fish"**: Mentoring = cho ca. Coaching = day cau ca. Sponsoring = gioi thieu cho ca ho. L5 biet khi nao dung cai nao.
- **"Oxygen Mask Rule"**: Tren may bay, deo mask cho minh truoc khi giup nguoi khac. L5 van phai deliver, nhung invest 20% effort vao growing others.

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "How do you mentor junior engineers while maintaining your own delivery? — explain it in 30 seconds."

**Ideal 30-second answer / Câu trả lời 30 giây:**

1. Mentoring means intentionally investing a portion of your capacity to grow others' skills while protecting your core delivery commitments.
2. At L5, you apply the 80/20 rule — 80% delivery, 20% growing others — switching between mentoring, coaching, and sponsoring based on the engineer's need.
3. For example: I hold 30-min weekly 1:1s, use the SBI model for feedback, and pair-program only on the highest-leverage learning areas.
4. In the interview, name a junior you've grown, the specific technique used (SBI/coaching/sponsoring), and how you measured their progress.

---

## Self-Check / Tu Kiem Tra

> **Dong file nay lai truoc khi lam.**

- [ ] **Retrieval**: Viet 3 thanh phan cua SBI model tu tri nho. Cho 1 vi du code review dung SBI.
- [ ] **Compare**: Viet bang so sanh Mentoring vs Coaching vs Sponsoring (3 cot: khi nao dung, vi du, rui ro). So voi file nay.
- [ ] **Application**: Nghi ve 1 nguoi ban da mentor/coach trong 6 thang qua. Ban dung Mentoring hay Coaching nhieu hon? Co dung phuong phap cho level cua ho khong?
- [ ] **Scenario**: Team ban co 1 junior deploy bug va bi blame trong standup. Viet ra chinh xac ban se noi gi va lam gi trong 24 gio toi (dung Psychological Safety framework).
- [ ] **Teach**: Giai thich cho nguoi khong lam tech tai sao "senior gioi nhat" khong phai nguoi code nhieu nhat, ma la nguoi giup ca team code tot hon.

💬 **Feynman Prompt:** Giai thich "psychological safety" cho quan ly cua hang ca phe. Tai sao nhan vien dam noi "minh het nguyen lieu" thay vi giau di lai quan trong cho business?

🔁 **Spaced Repetition:** On lai sau **3 ngay → 7 ngay → 14 ngay**.

---

## Connections / Lien Ket

- ⬅️ **Built on**: [STAR Method](../09-behavioral/01-star-method.md) — Leadership stories need STAR structure to be compelling in interviews
- ⬅️ **Built on**: [Scope & Impact](./01-scope-and-impact.md) — Leadership impact must be scoped and articulated clearly
- ➡️ **Enables**: [Storytelling](../09-behavioral/04-storytelling.md) — Leadership examples are the strongest behavioral interview stories
- ➡️ **Enables**: [L5 Self-Assessment](./00-l5-self-assessment.md) — Leadership is 10pts of the L5 competency model
- 🔗 **Related**: [Leadership Principles](../09-behavioral/02-leadership-principles.md) — Amazon/Google leadership principles overlap with these frameworks
- 🔗 **Applied in**: Code reviews (SBI), 1:1s (coaching vs mentoring), team retros (psychological safety), onboarding (30-60-90 plan)
