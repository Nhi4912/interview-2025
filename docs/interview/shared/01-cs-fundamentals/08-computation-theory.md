# Computation Theory — Lý thuyết Tính toán

> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `docs/interview/shared/01-cs-fundamentals/complexity-analysis.md`, `docs/interview/shared/01-cs-fundamentals/algorithms-theory.md`, `docs/interview/shared/01-cs-fundamentals/information-theory.md`

---

## 0. Learning Goals

- Hiểu bản chất của tính toán: cái gì tính được, cái gì không, và tại sao.
- Nắm vững Chomsky hierarchy và mối liên hệ giữa automata, ngôn ngữ hình thức, và ứng dụng thực tế (regex, parser, compiler).
- Hiểu Turing Machine, Church-Turing thesis, và ý nghĩa của Turing completeness đối với ngôn ngữ lập trình.
- Biết phân biệt bài toán decidable vs undecidable, hiểu Halting Problem và Rice's theorem.
- Nắm chắc P, NP, NP-Complete, NP-Hard và biết nhận diện bài toán NP-hard trong interview/system design.
- Hiểu khi nào cần dùng approximation/heuristics thay vì tìm lời giải chính xác.
- Biết lambda calculus cơ bản và kết nối với functional programming.
- Có khả năng giải thích trade-off exact vs approximate cho interviewer ở mọi level.

---

## 1. What is Computation — Tính toán là gì

### Definition
- **Informal:** Tính toán là quá trình biến đổi input thành output theo một tập quy tắc xác định.
- **Formal:** Tính toán là chuỗi các bước thao tác trên ký hiệu (symbols) tuân theo một hệ thống quy tắc hình thức (formal rules), biến đổi từ trạng thái ban đầu sang trạng thái kết thúc.

### Algorithm vs Computation
- **Algorithm:** Một quy trình hữu hạn các bước rõ ràng để giải quyết một lớp bài toán. Luôn dừng (terminates).
- **Computation:** Quá trình thực thi của một mô hình tính toán. Có thể không dừng (non-terminating) — ví dụ: server loop chạy mãi mãi.
- Mối quan hệ: Mọi algorithm đều là computation, nhưng không phải mọi computation đều là algorithm (vì có thể không dừng).

### Core Concepts

| Term | Vietnamese explanation |
| --- | --- |
| Effective procedure | Quy trình có thể thực hiện máy móc, từng bước, không cần trực giác. |
| Decidability | Khả năng xác định "yes/no" cho mọi input trong thời gian hữu hạn. |
| Model of computation | Mô hình toán học mô tả khả năng tính toán: Turing Machine, Lambda Calculus, RAM model. |
| Equivalence of models | Các mô hình tính toán đủ mạnh đều tương đương nhau (Church-Turing thesis). |

### Why Study This in Interviews
- Giúp nhận diện bài toán nào không thể giải chính xác (undecidable) hoặc không thể giải hiệu quả (NP-hard).
- Hiểu tại sao không có tool nào phát hiện được mọi bug — Halting Problem.
- Biết khi nào cần trade-off: exact solution vs approximation vs heuristic.
- Senior/Staff interview thường hỏi về giới hạn lý thuyết khi thiết kế hệ thống.

### Interview Q&A

### 🟢 Q: What is the difference between an algorithm and a program? `[Junior]`
**A:** Algorithm là bước giải trừu tượng, luôn dừng, không phụ thuộc ngôn ngữ. Program là hiện thực cụ thể bằng ngôn ngữ lập trình, có thể không dừng (infinite loop), phụ thuộc platform.

### 🟡 Q: Why do we need formal models of computation? `[Mid]`
**A:** Vì mô hình hình thức cho phép chứng minh toán học về khả năng và giới hạn của tính toán. Không thể dùng trực giác để khẳng định "bài toán X không giải được" — cần chứng minh nghiêm ngặt thông qua Turing Machine hoặc mô hình tương đương.

### 🔴 Q: Name three equivalent models of computation and explain why equivalence matters. `[Senior]`
**A:** Turing Machine, Lambda Calculus, và Recursive Functions — ba mô hình khác nhau hoàn toàn về hình thức nhưng tính toán được cùng một lớp hàm (Turing-computable functions). Sự tương đương này củng cố Church-Turing thesis: khái niệm "tính toán được" là phổ quát, không phụ thuộc mô hình cụ thể. Điều này có nghĩa kết quả lý thuyết (ví dụ: undecidability) áp dụng cho mọi ngôn ngữ lập trình.

---

## 2. Automata Theory — Lý thuyết Otomat

### Definition
- Automata theory nghiên cứu các máy trừu tượng (abstract machines) và các lớp bài toán chúng có thể giải quyết.
- Mỗi loại automaton tương ứng với một lớp ngôn ngữ hình thức trong Chomsky hierarchy.

### Core Concepts

#### 2.1 Finite Automata — Otomat hữu hạn

**DFA (Deterministic Finite Automaton):**
- Gồm 5 thành phần: (Q, Σ, δ, q₀, F) — tập trạng thái, bảng chữ cái, hàm chuyển, trạng thái đầu, tập trạng thái chấp nhận.
- Tại mỗi trạng thái, với mỗi ký tự input, chỉ có đúng một trạng thái kế tiếp (deterministic).
- Không có bộ nhớ ngoài trạng thái hiện tại — không thể đếm hoặc so khớp cặp ngoặc lồng nhau.

```text
DFA for strings ending in "01" over {0, 1}:
States: {q0, q1, q2}
Start: q0, Accept: {q2}

Transitions:
  q0 --0--> q1    q0 --1--> q0
  q1 --0--> q1    q1 --1--> q2
  q2 --0--> q1    q2 --1--> q0
```

**NFA (Nondeterministic Finite Automaton):**
- Giống DFA nhưng cho phép nhiều trạng thái kế tiếp cho cùng một ký tự, và cho phép ε-transitions (chuyển trạng thái mà không đọc input).
- Sức mạnh tính toán bằng DFA (mọi NFA có thể chuyển thành DFA tương đương) nhưng NFA thường gọn hơn.
- Chuyển NFA → DFA bằng subset construction có thể làm tăng số trạng thái lên theo hàm mũ: n trạng thái NFA → tối đa 2ⁿ trạng thái DFA.

#### 2.2 Regular Expressions ↔ Finite Automata Equivalence

| Direction | Method | Vietnamese explanation |
| --- | --- | --- |
| Regex → NFA | Thompson's construction | Xây NFA từ regex bằng cách ghép nối, hợp, lặp thành các NFA con. |
| NFA → DFA | Subset construction | Mỗi trạng thái DFA = một tập trạng thái NFA. |
| DFA → Regex | State elimination | Loại bỏ từng trạng thái, ghi lại biểu thức chính quy trên cạnh. |

- Hệ quả: Regular expressions, DFA, và NFA đều mô tả cùng một lớp ngôn ngữ — Regular Languages.
- Giới hạn: Regex không thể match nested parentheses, palindromes, hoặc bất kỳ ngôn ngữ nào cần "đếm" (pumping lemma chứng minh).

#### 2.3 Pushdown Automata (PDA) — Otomat đẩy xuống
- PDA = Finite Automaton + một stack vô hạn.
- Stack cho phép "nhớ" thông tin lồng nhau → PDA nhận diện được Context-Free Languages (CFLs).
- Ví dụ: PDA nhận diện ngôn ngữ {aⁿbⁿ | n ≥ 0} bằng cách push 'a' vào stack rồi pop cho mỗi 'b'.
- Deterministic PDA (DPDA) yếu hơn nondeterministic PDA — không phải mọi CFL đều có DPDA.

#### 2.4 Context-Free Grammars (CFG)
- CFG gồm 4 thành phần: (V, Σ, R, S) — biến, terminal, production rules, start symbol.
- CFG tương đương PDA về sức mạnh nhận diện ngôn ngữ.
- Ứng dụng cốt lõi: syntax của mọi ngôn ngữ lập trình đều được định nghĩa bằng CFG (dạng BNF/EBNF).

```text
CFG for balanced parentheses:
S → (S) | SS | ε

Derivation of "(()())":
S → (S) → (SS) → ((S)S) → (()S) → (()(S)) → (()())
```

#### 2.5 Chomsky Hierarchy

| Type | Grammar | Automaton | Language Class | Ví dụ |
| --- | --- | --- | --- | --- |
| Type 3 | Regular grammar | Finite Automaton (DFA/NFA) | Regular | `a*b+`, email pattern |
| Type 2 | Context-free grammar | Pushdown Automaton | Context-free | Balanced parentheses, JSON, XML |
| Type 1 | Context-sensitive grammar | Linear Bounded Automaton | Context-sensitive | {aⁿbⁿcⁿ} |
| Type 0 | Unrestricted grammar | Turing Machine | Recursively enumerable | Halting problem's language |

- Mỗi type chứa chặt type trên: Type 3 ⊂ Type 2 ⊂ Type 1 ⊂ Type 0.
- Thực tế: Hầu hết parser trong compiler hoạt động ở Type 2 (CFG), regex engine ở Type 3.

### Practical Relevance
- **Regex engines** trong JavaScript, Go, Python: dựa trên NFA hoặc DFA. Go dùng NFA-based Thompson algorithm (đảm bảo O(n) worst-case), một số engine khác dùng backtracking (có thể exponential).
- **Parsers:** JSON parser là CFG parser. JavaScript/Go compiler frontend dùng LL hoặc LR parser (CFG-based).
- **Compiler pipeline:** Lexer (DFA cho tokens) → Parser (PDA/CFG cho syntax tree) → Semantic analysis → Code gen.
- **Input validation:** Biết regex chỉ nhận regular language giúp tránh viết regex cho bài toán cần CFG (ví dụ: validate nested JSON bằng regex là sai).

### Interview Q&A

### 🟢 Q: What is a finite automaton and what can it recognize? `[Junior]`
**A:** Finite automaton là máy trừu tượng có số trạng thái hữu hạn, đọc input từ trái sang phải. Nó nhận diện được Regular Languages — lớp ngôn ngữ mô tả bởi regex. Ví dụ: kiểm tra email format, tìm pattern trong chuỗi.

### 🟢 Q: Can regex match nested parentheses? Why or why not? `[Junior]`
**A:** Không thể. Regex chỉ nhận Regular Languages, mà balanced/nested parentheses là Context-Free Language (cần stack để đếm). Pumping lemma chứng minh {aⁿbⁿ} không phải regular — tương tự cho ngoặc lồng.

### 🟡 Q: Explain the relationship between NFA and DFA. `[Mid]`
**A:** NFA và DFA có cùng sức mạnh nhận diện (cùng nhận Regular Languages). Mọi NFA có thể chuyển sang DFA tương đương bằng subset construction. Tuy nhiên, DFA tương đương có thể có đến 2ⁿ trạng thái — trade-off giữa kích thước mô hình (NFA gọn) và hiệu quả thực thi (DFA nhanh hơn, O(n) cho mọi input).

### 🟡 Q: What is the Chomsky hierarchy and why does it matter? `[Mid]`
**A:** Chomsky hierarchy phân loại ngôn ngữ hình thức thành 4 cấp (Type 0-3), mỗi cấp ứng với một loại automaton. Nó quan trọng vì giúp xác định công cụ phù hợp cho bài toán: dùng regex cho Type 3, parser cho Type 2. Dùng sai cấp (ví dụ regex cho Type 2) sẽ thất bại hoặc tạo ra giải pháp sai.

### 🔴 Q: Why does Go's regex engine guarantee linear time but some other engines don't? `[Senior]`
**A:** Go dùng Thompson's NFA construction → chạy NFA trực tiếp bằng cách simulate tất cả trạng thái song song, đảm bảo O(n·m) với n = input length, m = pattern size. Nhiều engine khác (PCRE, JavaScript trước đây) dùng backtracking NFA có hỗ trợ backreferences (vượt ngoài regular language) → worst-case exponential. Đây là trade-off giữa tính năng (backreferences) và đảm bảo hiệu suất.

---

## 3. Turing Machines — Máy Turing

### Definition
- Turing Machine (TM) là mô hình tính toán do Alan Turing đề xuất năm 1936.
- TM mạnh hơn tất cả automata khác — nó mô tả chính xác giới hạn của "cái gì tính được bằng máy".

### Components — Thành phần

| Component | Vietnamese explanation |
| --- | --- |
| Tape (băng) | Dãy ô nhớ vô hạn, mỗi ô chứa một ký hiệu. Là bộ nhớ của máy. |
| Head (đầu đọc-ghi) | Đọc ký hiệu tại ô hiện tại, ghi ký hiệu mới, di chuyển trái/phải. |
| State register | Lưu trạng thái hiện tại. Có trạng thái bắt đầu và các trạng thái dừng (accept/reject). |
| Transition function δ | δ(q, a) = (q', b, D): ở trạng thái q đọc ký hiệu a → chuyển sang q', ghi b, di chuyển theo hướng D (L/R). |
| Alphabet Σ, Γ | Σ: bảng chữ cái input. Γ ⊇ Σ: bảng chữ cái tape (thêm blank symbol). |

```text
Turing Machine for {aⁿbⁿcⁿ | n ≥ 1} (sketch):
1. Mark leftmost unmarked 'a' → move right to find unmarked 'b' → mark it
2. Continue right to find unmarked 'c' → mark it
3. Return to leftmost unmarked 'a' → repeat
4. When no unmarked 'a' left → verify no unmarked 'b' or 'c' left → accept
```

### Core Concepts

#### Universal Turing Machine (UTM)
- UTM là Turing Machine có thể simulate bất kỳ Turing Machine nào khác.
- Input của UTM: mã hóa (encoding) của TM M + input w → UTM chạy M trên w.
- Ý nghĩa: UTM là nền tảng lý thuyết của máy tính lập trình được (stored-program computer). Máy tính của bạn chính là hiện thực vật lý của UTM.

#### Church-Turing Thesis
- **Phát biểu:** Mọi hàm "tính toán được" theo nghĩa trực giác đều có thể tính bằng Turing Machine.
- **Lưu ý:** Đây là thesis (giả thuyết), không phải theorem (định lý). Không thể chứng minh vì "tính toán được theo trực giác" không có định nghĩa hình thức.
- **Bằng chứng ủng hộ:** Mọi mô hình tính toán hợp lý (lambda calculus, recursive functions, RAM, register machines, cellular automata) đều đã được chứng minh tương đương TM.
- **Ý nghĩa thực tế:** Nếu không giải được bằng TM → không giải được bằng bất kỳ máy tính nào (cổ điển hay lượng tử — quantum chỉ nhanh hơn, không tính được nhiều hơn).

#### Turing Completeness
- Một hệ thống là Turing complete nếu nó có thể simulate bất kỳ Turing Machine nào.
- Yêu cầu tối thiểu: conditional branching + khả năng đọc/ghi bộ nhớ không giới hạn.

| Turing Complete | Not Turing Complete |
| --- | --- |
| JavaScript, Go, Python, C, SQL (with recursive CTEs) | Regular expressions, finite automata, HTML, CSS (mostly), JSON |
| Conway's Game of Life, Excel (proven 2021) | Simple calculators, DFA |

- Hệ quả: Mọi ngôn ngữ lập trình general-purpose đều tương đương nhau về khả năng tính toán. Sự khác biệt chỉ nằm ở hiệu quả, ergonomics, và ecosystem — không phải "cái gì tính được".

### Interview Q&A

### 🟢 Q: What is a Turing Machine in simple terms? `[Junior]`
**A:** Turing Machine là mô hình máy tính đơn giản nhất nhưng mạnh nhất: gồm một băng vô hạn, đầu đọc-ghi, và bảng quy tắc chuyển trạng thái. Mọi thứ máy tính hiện đại tính được, TM đều tính được (và ngược lại).

### 🟡 Q: What does "Turing complete" mean and why does it matter? `[Mid]`
**A:** Một ngôn ngữ/hệ thống Turing complete nghĩa là nó có thể simulate Turing Machine — tức là tính toán được bất kỳ hàm tính toán được nào. Điều này quan trọng vì: (1) mọi ngôn ngữ Turing complete đều tương đương nhau về khả năng, (2) các kết quả undecidability áp dụng cho tất cả — ví dụ, không ngôn ngữ nào có thể detect mọi infinite loop.

### 🔴 Q: Explain the Church-Turing thesis and its practical implications. `[Senior]`
**A:** Church-Turing thesis nói rằng khái niệm "tính toán được" trực giác hoàn toàn trùng khớp với "Turing-computable". Đây là thesis vì không thể chứng minh hình thức, nhưng mọi mô hình tính toán hợp lý đều xác nhận nó. Ý nghĩa thực tế: (1) khi chứng minh bài toán undecidable cho TM, nó undecidable cho mọi máy tính, (2) không có ngôn ngữ lập trình nào "mạnh hơn" ngôn ngữ khác về mặt computability — chỉ khác về expressiveness và hiệu năng, (3) quantum computing không phá vỡ thesis — quantum nhanh hơn nhưng không tính được thêm.

---

## 4. Computability — Khả năng tính toán

### Definition
- Computability theory nghiên cứu bài toán nào có thể giải được bằng thuật toán (decidable) và bài toán nào không thể (undecidable).
- Đây là ranh giới cứng, cơ bản của Computer Science — không phải vấn đề "chưa tìm ra cách", mà là "không bao giờ có cách".

### Core Concepts

#### Decidable vs Undecidable Problems

| Category | Definition | Vietnamese explanation | Ví dụ |
| --- | --- | --- | --- |
| Decidable | Có algorithm luôn dừng và trả lời đúng yes/no cho mọi input. | Bài toán "giải được hoàn toàn" — luôn có câu trả lời. | Primality testing, sorting, shortest path |
| Semi-decidable (recognizable) | Có algorithm trả lời "yes" nếu đúng, nhưng có thể chạy mãi nếu sai. | Chỉ xác nhận được một chiều. | Halting problem (nếu dừng → nói "yes", nếu không → chạy mãi) |
| Undecidable | Không có algorithm nào luôn dừng và đúng cho mọi input. | Không bao giờ có thuật toán hoàn chỉnh. | Halting problem (quyết định yes/no), Post correspondence |

#### The Halting Problem — Bài toán Dừng

**Phát biểu:** Cho chương trình P và input I, liệu P có dừng khi chạy trên I không?

**Chứng minh bằng phản chứng (Proof by contradiction):**

```text
Giả sử tồn tại hàm halts(P, I) trả lời đúng cho mọi P, I.

Xây dựng chương trình paradox:
  function diagonal(P):
    if halts(P, P):     // Nếu P dừng khi chạy trên chính nó
      loop forever       // thì ta chạy vô hạn
    else:
      halt               // ngược lại, ta dừng

Bây giờ chạy diagonal(diagonal):
  - Nếu halts(diagonal, diagonal) = true  → diagonal chạy vô hạn → mâu thuẫn
  - Nếu halts(diagonal, diagonal) = false → diagonal dừng → mâu thuẫn

Cả hai trường hợp đều mâu thuẫn → giả sử sai → halts() không tồn tại. ∎
```

- Kỹ thuật chứng minh: diagonalization — tương tự chứng minh tập số thực không đếm được của Cantor.

#### Rice's Theorem — Định lý Rice

**Phát biểu:** Mọi thuộc tính không tầm thường (non-trivial) của ngôn ngữ mà Turing Machine nhận diện đều undecidable.

- **Non-trivial:** Có ít nhất một TM có thuộc tính đó và ít nhất một TM không có.
- **Ví dụ thuộc tính non-trivial:** "Chương trình này có in ra 'hello' không?", "Hàm này có trả về giá trị đúng không?", "Chương trình này có terminate cho mọi input không?"
- **Hệ quả:** Không thể viết tool phân tích tĩnh hoàn hảo — mọi static analyzer đều phải hoặc false positive hoặc false negative (hoặc không dừng).

#### Reductions — Phép quy giảm

- Nếu bài toán A có thể "chuyển thành" bài toán B (A ≤ B), thì B ít nhất khó bằng A.
- Dùng để chứng minh undecidability: quy giảm bài toán đã biết undecidable (Halting Problem) sang bài toán mới.

```text
Chứng minh "Chương trình P có in 'hello' không?" là undecidable:

Reduction từ Halting Problem:
  Cho input (M, w) của Halting Problem, xây P':
    function P'():
      simulate M on w
      print "hello"

  P' in "hello" ⟺ M dừng trên w.
  Nếu có thể quyết định P' in "hello" → quyết định được Halting Problem → mâu thuẫn. ∎
```

### Practical Implications

| Impossibility | Vietnamese explanation | Hệ quả thực tế |
| --- | --- | --- |
| Perfect bug detection | Không thể phát hiện mọi bug bằng static analysis. | Linter/analyzer chỉ bắt được một số lỗi, không phải tất cả. |
| Perfect optimization | Không thể viết compiler tối ưu hóa hoàn hảo mọi chương trình. | Compiler heuristics, profile-guided optimization. |
| Perfect virus detection | Không thể phát hiện mọi malware. | Antivirus dùng heuristics + signatures, không bao giờ 100%. |
| Perfect deadlock detection | Không thể xác định mọi deadlock trong runtime. | Dùng timeout, ordering conventions, static analysis cục bộ. |

### Interview Q&A

### 🟢 Q: What is the Halting Problem and why is it important? `[Junior]`
**A:** Halting Problem hỏi: "Cho chương trình P và input I, P có dừng không?" Đã chứng minh không có thuật toán nào trả lời đúng cho mọi P, I. Quan trọng vì nó đặt ra giới hạn cơ bản: có những bài toán mà máy tính không bao giờ giải được, bất kể phần cứng mạnh đến đâu.

### 🟡 Q: Why can't we build a perfect static analyzer that catches all bugs? `[Mid]`
**A:** Theo Rice's theorem, mọi thuộc tính non-trivial của chương trình đều undecidable. "Chương trình này có bug không?" là thuộc tính non-trivial → undecidable. Mọi static analyzer phải chọn: hoặc bỏ sót bug (false negative) hoặc báo sai (false positive) hoặc chạy mãi. Thực tế, các tool như ESLint, golangci-lint chọn cách kiểm tra tập con các pattern — hữu ích nhưng không hoàn hảo.

### 🟡 Q: Explain reduction in the context of undecidability. `[Mid]`
**A:** Reduction là kỹ thuật chứng minh: nếu muốn chứng minh bài toán B undecidable, ta chỉ cần cho thấy rằng nếu giải được B thì sẽ giải được bài toán A (đã biết undecidable) — tức A ≤ B. Ví dụ: quy giảm Halting Problem sang "chương trình có in output X không?" để chứng minh bài sau cũng undecidable.

### 🔴 Q: What is Rice's theorem and what are its implications for software engineering? `[Senior]`
**A:** Rice's theorem: mọi thuộc tính non-trivial về semantic (hành vi) của chương trình đều undecidable. Implications: (1) Perfect type inference cho mọi chương trình là bất khả — TypeScript phải dùng `any` escape hatch, (2) Perfect dead code elimination bất khả — compiler dùng conservative approximation, (3) Perfect security analysis bất khả — penetration testing + formal verification cho critical paths + defense in depth. Lưu ý: Rice's theorem áp dụng cho semantic properties, không phải syntactic — ta hoàn toàn kiểm tra được syntax (decidable).

---

## 5. Complexity Theory — Lý thuyết Độ phức tạp

### Definition
- Nếu Computability hỏi "tính được hay không?", Complexity Theory hỏi "tính được nhanh cỡ nào?"
- Phân loại bài toán decidable theo tài nguyên cần thiết (thời gian, bộ nhớ) trên mô hình tính toán chuẩn.

### Core Concepts

#### P — Polynomial Time
- Lớp bài toán quyết định (yes/no) giải được bởi Deterministic TM trong thời gian O(nᵏ) với k hằng số.
- "Giải được hiệu quả" — trong thực tế, hầu hết bài toán P có thuật toán chạy tốt.

| Ví dụ bài toán trong P | Algorithm | Complexity |
| --- | --- | --- |
| Sorting | Merge sort | O(n log n) |
| Shortest path | Dijkstra | O((V+E) log V) |
| Maximum matching | Hopcroft-Karp | O(E√V) |
| Linear programming | Ellipsoid / Interior point | Polynomial |
| Primality testing | AKS | O(n⁶) — polynomial nhưng thực tế dùng Miller-Rabin |
| 2-SAT | Implication graph | O(n + m) |

#### NP — Nondeterministic Polynomial Time
- Lớp bài toán quyết định mà nếu ai đó cho ta "bằng chứng" (certificate/witness), ta verify được trong polynomial time.
- **Equivalent definition:** Giải được bởi Nondeterministic TM trong polynomial time.
- P ⊆ NP (mọi bài toán trong P cũng thuộc NP — certificate là bản thân lời giải).
- Câu hỏi mở: P = NP hay P ≠ NP?

```text
Ví dụ: Subset Sum ∈ NP
  Input: tập số S = {3, 7, 1, 8, -2}, target T = 9
  Question: Có tập con nào tổng bằng T?
  Certificate: {1, 8} → verify: 1 + 8 = 9 ✓ → polynomial time verification
  Tìm certificate có thể khó (exhaustive search: 2ⁿ subsets), nhưng verify thì nhanh.
```

#### NP-Complete
- Bài toán NP-Complete là bài toán vừa thuộc NP vừa NP-Hard.
- **NP-Hard:** Mọi bài toán trong NP đều polynomial-time reducible về nó.
- Nếu giải được 1 bài NP-Complete trong polynomial time → P = NP (giải được tất cả NP).

**Cook-Levin Theorem (1971):**
- SAT (Boolean Satisfiability) là bài toán NP-Complete đầu tiên được chứng minh.
- Chứng minh: mọi NP computation có thể encode thành Boolean formula.

#### NP-Hard
- Bài toán ít nhất khó bằng mọi bài toán NP, nhưng không nhất thiết thuộc NP.
- NP-Hard có thể là decision problem, optimization problem, hoặc thậm chí undecidable.
- Ví dụ: Halting Problem là NP-Hard (và undecidable) — mọi bài NP reducible về nó.

#### Mối quan hệ (giả sử P ≠ NP)

```text
┌─────────────────────────────────┐
│           NP-Hard               │
│  ┌───────────────────────────┐  │
│  │       NP-Complete         │  │
│  │  ┌─────────┐             │  │
│  │  │    P    │  NP          │  │
│  │  │         │             │  │
│  │  └─────────┘             │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

#### P vs NP — The Million-Dollar Question
- Clay Mathematics Institute treo giải $1,000,000 cho ai chứng minh P = NP hoặc P ≠ NP.
- Hầu hết chuyên gia tin rằng P ≠ NP, nhưng chưa ai chứng minh được.
- **Nếu P = NP:** Mọi bài toán verify nhanh cũng giải nhanh → phá mọi hệ mã hóa hiện tại (RSA, AES dựa trên giả thiết P ≠ NP), tối ưu hóa logistics hoàn hảo, drug discovery tự động.
- **Nếu P ≠ NP (likely):** Một số bài toán bản chất là khó, chỉ giải gần đúng hoặc cho input nhỏ.

### Famous NP-Complete Problems

| Problem | Phát biểu ngắn | Relevance |
| --- | --- | --- |
| SAT | Có assignment cho Boolean formula thỏa mãn? | Nền tảng NP-Completeness. SAT solvers dùng trong formal verification. |
| 3-SAT | SAT với mỗi clause đúng 3 literals. | Dễ reduce hơn SAT gốc, thường dùng làm source reduction. |
| Clique | Đồ thị có clique (nhóm đỉnh kết nối đầy đủ) kích thước k? | Social network analysis, community detection. |
| Vertex Cover | Chọn ≤ k đỉnh phủ tất cả cạnh? | Network security (chọn vị trí giám sát tối ưu). |
| Hamiltonian Path/Cycle | Có đường đi qua mọi đỉnh đúng một lần? | Route planning, circuit board design. |
| TSP (decision) | Có tour qua mọi thành phố với tổng chi phí ≤ k? | Logistics, delivery routing. |
| Subset Sum | Có tập con tổng bằng T? | Cryptography (knapsack-based), resource allocation. |
| Graph Coloring (k ≥ 3) | Tô đồ thị bằng k màu sao cho đỉnh kề khác màu? | Register allocation trong compiler, scheduling. |
| Knapsack (0/1) | Chọn items tối đa giá trị với ràng buộc trọng lượng? | Resource allocation, investment portfolio. |
| Set Cover | Chọn ít nhất tập con phủ toàn bộ universe? | Feature selection, sensor placement. |

### Polynomial Reductions

- Reduction A ≤ₚ B: chuyển mọi instance của A thành instance của B trong polynomial time.
- Nếu B ∈ P và A ≤ₚ B → A ∈ P.
- Nếu A là NP-Complete và A ≤ₚ B và B ∈ NP → B là NP-Complete.

```text
Ví dụ reduction: 3-SAT ≤ₚ Clique

Cho 3-SAT formula với k clauses:
  (x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂ ∨ x₄) ∧ ...

Xây đồ thị:
  - Mỗi literal trong mỗi clause → 1 đỉnh (3k đỉnh)
  - Nối cạnh giữa hai đỉnh nếu: (1) ở khác clause VÀ (2) không mâu thuẫn (xᵢ và ¬xᵢ)
  - 3-SAT satisfiable ⟺ đồ thị có clique kích thước k
```

### Practical Relevance — Nhận diện NP-hard trong thực tế

| Real-world problem | NP-hard? | Vietnamese explanation |
| --- | --- | --- |
| Optimal task scheduling | Yes | Tìm lịch tối ưu cho n tasks trên m machines — NP-hard khi m ≥ 2. |
| Database query optimization | Yes (general) | Tìm join order tối ưu cho n bảng là NP-hard → optimizer dùng heuristics. |
| Container bin packing (Kubernetes) | Yes | Đặt pods vào nodes tối ưu — variant của bin packing. |
| Network routing (optimal) | Yes | Tìm đường tối ưu global — dùng approximation (OSPF, BGP heuristics). |
| Feature flag combination testing | Yes | Test tất cả combinations: 2ⁿ → dùng combinatorial testing (pairwise). |

### Interview Q&A

### 🟢 Q: What is the difference between P and NP? `[Junior]`
**A:** P là lớp bài toán giải được nhanh (polynomial time). NP là lớp bài toán mà lời giải có thể kiểm tra nhanh (polynomial time). Mọi bài P cũng thuộc NP. Câu hỏi mở lớn nhất CS: liệu P = NP?

### 🟢 Q: What does NP-Complete mean in simple terms? `[Junior]`
**A:** NP-Complete là bài toán "khó nhất trong NP": nếu giải được 1 bài NP-Complete nhanh → giải được tất cả bài NP nhanh. Khi gặp bài NP-Complete, biết rằng (rất có thể) không có thuật toán nhanh → cần dùng approximation.

### 🟡 Q: How do you prove a problem is NP-Complete? `[Mid]`
**A:** Hai bước: (1) Chứng minh bài toán ∈ NP — đưa ra certificate và thuật toán verify polynomial time. (2) Chứng minh NP-Hard — lấy một bài NP-Complete đã biết (ví dụ 3-SAT) và polynomial-time reduce nó sang bài toán mới. Bước 2 thường khó nhất.

### 🟡 Q: Name a real-world problem that is NP-hard and how would you handle it. `[Mid]`
**A:** Database query optimization (tìm join order tối ưu cho n bảng). Với n nhỏ (< 10), dùng dynamic programming (exact). Với n lớn, dùng greedy heuristic hoặc genetic algorithm. PostgreSQL dùng DP cho < 12 bảng, genetic algorithm cho ≥ 12.

### 🔴 Q: Explain the P vs NP problem and its implications for cryptography. `[Senior]`
**A:** P vs NP hỏi: liệu mọi bài toán verify nhanh cũng giải nhanh? Nếu P = NP: RSA bị phá vì integer factorization (likely trong NP \ P) sẽ thuộc P → tìm private key dễ dàng. AES cũng bị phá vì finding key from plaintext-ciphertext pair thuộc NP. Nếu P ≠ NP (likely): one-way functions tồn tại → nền tảng cho cryptography an toàn. Thực tế, mọi hệ mã hóa hiện đại giả thiết P ≠ NP, dù chưa chứng minh.

### 🔴 Q: What is the practical significance of polynomial-time reductions? `[Senior]`
**A:** (1) Chứng minh NP-hardness: nếu bài toán đã biết NP-hard reduce được về bài mới → bài mới ít nhất cũng NP-hard. (2) Thiết kế giải pháp: nếu biết A ≤ₚ B và có solver tốt cho B → dùng reduction để giải A bằng solver B (ví dụ: encode scheduling problem thành SAT → dùng SAT solver). (3) Nhận diện khó: khi thiết kế hệ thống, nhận ra bài toán NP-hard sớm giúp chọn heuristic/approximation thay vì tìm exact solution vô vọng.

---

## 6. Approximation & Heuristics — Xấp xỉ và Heuristic

### Definition
- Khi bài toán NP-hard, exact solution quá chậm cho input lớn → dùng approximation (có đảm bảo lý thuyết) hoặc heuristic (không đảm bảo nhưng thường tốt thực tế).

### Core Concepts

#### Approximation Algorithms — Thuật toán xấp xỉ
- Giải bài toán tối ưu hóa NP-hard với guarantee: lời giải không tệ hơn c lần optimal (c = approximation ratio).
- Ví dụ: thuật toán xấp xỉ 2 cho Vertex Cover → lời giải tối đa gấp 2 lần optimal.

| Problem | Best known ratio | Vietnamese explanation |
| --- | --- | --- |
| Vertex Cover | 2 | Chọn cả 2 đỉnh mỗi cạnh → tối đa gấp đôi optimal. |
| Metric TSP | 1.5 (Christofides) | Dựa trên MST + minimum weight matching → tối đa 1.5x optimal. |
| Set Cover | O(ln n) | Greedy chọn tập phủ nhiều nhất → logarithmic ratio. |
| Bin Packing | 1.5 (First Fit Decreasing) | Sắp giảm dần, đặt vào bin fit đầu tiên. |
| MAX-SAT | 0.75 (randomized) | Random assignment đạt 0.5, semi-definite programming đạt ~0.878 cho MAX-2SAT. |

```text
Approximation Algorithm cho Vertex Cover (ratio 2):
  Input: Graph G = (V, E)
  C = {}
  while E is not empty:
    pick any edge (u, v)
    C = C ∪ {u, v}
    remove all edges incident to u or v
  return C

  Correctness: Mỗi lần chọn cạnh, ít nhất 1 trong 2 đỉnh thuộc optimal → |C| ≤ 2 * |OPT|
```

#### Greedy Heuristics
- Tại mỗi bước, chọn option tốt nhất hiện tại (locally optimal).
- Không đảm bảo globally optimal cho NP-hard, nhưng thường cho kết quả tốt và chạy nhanh.
- Ví dụ: Greedy Set Cover, Greedy graph coloring, Nearest Neighbor TSP.

#### Metaheuristics — Siêu heuristic

| Metaheuristic | Cách hoạt động | Ưu điểm | Nhược điểm |
| --- | --- | --- | --- |
| Simulated Annealing | Chấp nhận lời giải xấu hơn với xác suất giảm dần (giống kim loại nguội dần). | Thoát được local optima. | Cần tune nhiều parameter (temperature, cooling rate). |
| Genetic Algorithm | Tạo "quần thể" lời giải, chọn lọc, lai ghép, đột biến qua nhiều thế hệ. | Tốt cho search space phức tạp, parallelizable. | Chậm converge, nhiều hyperparameters. |
| Tabu Search | Local search + nhớ các move gần đây để tránh lặp lại (tabu list). | Đơn giản, hiệu quả cho scheduling. | Kích thước tabu list ảnh hưởng lớn. |
| Ant Colony Optimization | Mô phỏng kiến tìm đường: pheromone trail tăng trên path tốt. | Rất tốt cho routing problems. | Chậm, cần nhiều iteration. |

### Practical Examples

**TSP Approximation:**
- Exact: O(n! ) brute force, O(2ⁿ · n) DP → chỉ khả thi cho n < 25.
- Christofides (metric): 1.5-approximation, O(n³).
- Nearest Neighbor heuristic: Nhanh O(n²), thường tốt thực tế nhưng worst case kém.
- Lin-Kernighan heuristic: Tốt nhất thực tế, dùng bởi Google OR-Tools.
- Ant Colony / Genetic: Tốt cho bài toán variant (TSP with time windows).

**Bin Packing (Kubernetes pod scheduling):**
- First Fit Decreasing: ratio 1.5, O(n log n).
- Best Fit Decreasing: tương tự, đặt vào bin vừa nhất.
- Thực tế: Kubernetes scheduler dùng scoring + filtering heuristic cho multi-dimensional packing (CPU, memory, GPU).

### Interview Q&A

### 🟢 Q: What is an approximation algorithm? `[Junior]`
**A:** Thuật toán xấp xỉ giải bài toán NP-hard với đảm bảo: kết quả không tệ hơn c lần so với lời giải tối ưu (c là approximation ratio). Ví dụ: ratio 2 cho Vertex Cover nghĩa là lời giải tối đa gấp đôi optimal.

### 🟡 Q: When should you use heuristics vs exact algorithms? `[Mid]`
**A:** Dùng exact khi: input nhỏ (n < ~20-25 cho NP-hard), hoặc bài toán thuộc P. Dùng heuristic/approximation khi: input lớn + bài toán NP-hard, cần kết quả nhanh (real-time), hoặc "good enough" là chấp nhận được (ví dụ: routing, scheduling). Trade-off: exact cho correctness, heuristic cho scalability.

### 🔴 Q: Explain Christofides' algorithm for TSP and why it achieves a 1.5 ratio. `[Senior]`
**A:** Christofides (metric TSP): (1) Tìm MST (cost ≤ OPT vì OPT - 1 cạnh là spanning tree), (2) Tìm minimum weight perfect matching trên các đỉnh bậc lẻ (cost ≤ OPT/2 vì optimal tour chứa perfect matching trên đỉnh lẻ), (3) Kết hợp MST + matching thành Eulerian multigraph, (4) Tìm Euler tour → shortcut thành Hamiltonian tour. Tổng cost ≤ OPT + OPT/2 = 1.5 · OPT. Yêu cầu: metric (tam giác bất đẳng thức).

---

## 7. Information-Theoretic Limits — Giới hạn Lý thuyết Thông tin

### Definition
- Ngoài complexity theory (upper/lower bounds cho thuật toán cụ thể), lý thuyết thông tin cho biết giới hạn tuyệt đối — không thuật toán nào có thể vượt qua, bất kể thiết kế.

> Xem thêm chi tiết tại `information-theory.md`.

### Core Concepts

#### Lower Bound on Comparison-Based Sorting: Ω(n log n)

**Chứng minh bằng decision tree:**
- n phần tử có n! hoán vị (permutations).
- Mỗi comparison (a < b?) chia cây quyết định thành 2 nhánh.
- Cây nhị phân cao h có tối đa 2ʰ lá.
- Cần 2ʰ ≥ n! → h ≥ log₂(n!) = Ω(n log n) (Stirling's approximation).
- Hệ quả: Merge sort, heap sort đều optimal cho comparison-based sorting.
- **Lưu ý:** Counting sort O(n+k), radix sort O(d·(n+k)) vượt qua giới hạn này vì không dựa trên comparison.

#### Lower Bound on Searching in Sorted Array: Ω(log n)
- Tương tự: n phần tử, mỗi comparison loại tối đa nửa → cần ≥ log₂ n comparisons.
- Binary search là optimal.

#### Communication Complexity Basics
- Nghiên cứu: hai bên (Alice, Bob) mỗi bên giữ phần dữ liệu, cần bao nhiêu bit trao đổi để tính hàm f(x, y)?
- **Ứng dụng thực tế:** Lower bounds cho distributed algorithms, streaming algorithms, data structure space.
- Ví dụ: Equality check (x = y?) cần Ω(n) bits communication (deterministic), nhưng O(log n) bits (randomized — fingerprinting).

#### Connection to Practical Engineering

| Limit | Hệ quả thực tế |
| --- | --- |
| Ω(n log n) sorting | Đừng cố tối ưu comparison sort dưới n log n — chuyển sang non-comparison (radix) nếu cần nhanh hơn. |
| Ω(log n) search | Binary search/BST đã optimal — cải thiện thêm chỉ bằng cách giảm constant factor (B-tree cho cache). |
| Communication complexity | Giải thích tại sao consensus trong distributed systems tốn ít nhất O(n) messages cho n nodes. |

### Interview Q&A

### 🟢 Q: Why is O(n log n) the best we can do for comparison-based sorting? `[Junior]`
**A:** Vì có n! hoán vị cần phân biệt, mỗi comparison chỉ loại được nửa khả năng, nên cần ít nhất log₂(n!) ≈ n log n comparisons. Đây là giới hạn toán học, không phải hạn chế kỹ thuật.

### 🟡 Q: How can counting sort beat O(n log n) if it's the lower bound? `[Mid]`
**A:** Lower bound Ω(n log n) chỉ áp dụng cho comparison-based model (so sánh a < b). Counting sort không compare — nó đếm frequency và đặt trực tiếp → O(n + k) với k = range of values. Non-comparison sorts "cheat" bằng cách khai thác thêm thông tin về data (giá trị là integer bounded).

### 🔴 Q: Explain how communication complexity relates to distributed systems design. `[Senior]`
**A:** Communication complexity cho lower bounds trên lượng data cần trao đổi giữa các nodes. Ví dụ: (1) Consensus cần Ω(n) messages (mỗi node phải "nghe" ít nhất 1 message), giải thích tại sao Paxos/Raft cần O(n) messages per decision. (2) Distributed sorting cần Ω(n log n) communication. (3) Set intersection giữa 2 nodes cần Ω(min(|A|, |B|)) bits. Giúp architect xác định bottleneck lý thuyết và tránh thiết kế protocol cố gắng vượt qua lower bound.

---

## 8. Lambda Calculus & Functional Foundations — Lambda và Nền tảng Hàm

### Definition
- Lambda calculus là mô hình tính toán do Alonzo Church phát triển (1930s), dựa hoàn toàn trên hàm.
- Tương đương Turing Machine về sức mạnh tính toán nhưng tiếp cận từ góc độ toán học thuần túy.
- Nền tảng lý thuyết cho functional programming (Haskell, OCaml, phần functional của JS/TS/Go).

### Core Concepts

#### Syntax — Ba thành phần duy nhất

| Term | Ký hiệu | Vietnamese explanation |
| --- | --- | --- |
| Variable | x | Tên biến, đại diện giá trị. |
| Abstraction | λx.M | Tạo hàm: tham số x, thân M. Tương đương `(x) => M` trong JS. |
| Application | M N | Áp dụng hàm M lên đối số N. Tương đương `M(N)` trong JS. |

```text
Lambda calculus ↔ JavaScript tương đương:

λx.x          ↔  (x) => x              // identity function
λx.λy.x       ↔  (x) => (y) => x      // constant (first)
λf.λx.f(f x)  ↔  (f) => (x) => f(f(x))  // apply f twice
```

#### Reductions — Các phép biến đổi

| Reduction | Ký hiệu | Vietnamese explanation | Ví dụ |
| --- | --- | --- | --- |
| Alpha (α) | Đổi tên biến bound | Đổi tên tham số không thay đổi ý nghĩa hàm. | λx.x → λy.y |
| Beta (β) | (λx.M) N → M[x:=N] | Thay thế tham số bằng đối số — "gọi hàm". | (λx.x+1) 3 → 3+1 → 4 |
| Eta (η) | λx.f x → f (nếu x ∉ free(f)) | Hàm wrapper không cần thiết có thể loại bỏ. | λx.add x → add |

```text
Beta reduction example:
  (λx.λy.x y) (λz.z) w
  → (λy.(λz.z) y) w        -- beta: x := λz.z
  → (λz.z) w               -- beta: y := w
  → w                       -- beta: z := w
```

#### Church Encoding — Mã hóa dữ liệu bằng hàm

**Church Numerals (Số Church):**
```text
0 = λf.λx.x              // apply f zero times
1 = λf.λx.f x            // apply f once
2 = λf.λx.f (f x)        // apply f twice
3 = λf.λx.f (f (f x))    // apply f three times
n = λf.λx.fⁿ x           // apply f n times

SUCC = λn.λf.λx.f (n f x)        // successor: n → n+1
ADD  = λm.λn.λf.λx.m f (n f x)   // addition
MULT = λm.λn.λf.m (n f)           // multiplication
```

**Church Booleans:**
```text
TRUE  = λx.λy.x      // chọn đối số thứ nhất
FALSE = λx.λy.y      // chọn đối số thứ hai
AND   = λp.λq.p q p
OR    = λp.λq.p p q
NOT   = λp.p FALSE TRUE
IF    = λp.λa.λb.p a b   // IF TRUE a b → a, IF FALSE a b → b
```

- Ý nghĩa: chứng minh rằng chỉ cần hàm là đủ biểu diễn mọi cấu trúc dữ liệu — không cần số, boolean, if/else, loop built-in.

#### Y Combinator — Fixed-point Combinator

- Vấn đề: Lambda calculus không có tên hàm → làm sao đệ quy?
- Y combinator tạo ra fixed point: Y f = f (Y f) → cho phép đệ quy không cần tên.

```text
Y = λf.(λx.f (x x)) (λx.f (x x))

Ví dụ factorial:
  FACT = Y (λf.λn.IF (ISZERO n) 1 (MULT n (f (PRED n))))

  Y g = g (Y g) = g (g (Y g)) = ... → hàm tự gọi chính nó.
```

- JavaScript tương đương (strict evaluation cần Z combinator thay vì Y):
```text
// Z combinator (for strict/eager evaluation languages)
Z = λf.(λx.f(λv.x x v))(λx.f(λv.x x v))

// JS equivalent:
const Z = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)))
const factorial = Z(f => n => n === 0 ? 1 : n * f(n - 1))
```

### Connection to Functional Programming

| Lambda Calculus Concept | Hiện thực trong FP | Vietnamese explanation |
| --- | --- | --- |
| Abstraction (λx.M) | Arrow functions, closures | Mọi function là anonymous first-class value. |
| Application (M N) | Function calls | Gọi hàm, partial application. |
| Beta reduction | Evaluation / execution | Thực thi = thay thế tham số bằng đối số. |
| Currying (λx.λy.M) | `f(x)(y)`, curry utilities | Hàm nhiều tham số = chuỗi hàm 1 tham số. |
| Church encoding | Algebraic data types (ADTs) | Data = patterns of function application. |
| Y combinator | Recursive definitions | Đệ quy = fixed point của hàm bậc cao. |

### Interview Q&A

### 🟢 Q: What is lambda calculus and why is it relevant to programming? `[Junior]`
**A:** Lambda calculus là hệ thống toán học mô tả tính toán chỉ bằng hàm — không cần biến, vòng lặp, hay kiểu dữ liệu. Nó là nền tảng lý thuyết cho functional programming: closures, higher-order functions, currying trong JS/TS/Go đều bắt nguồn từ lambda calculus.

### 🟡 Q: Explain beta reduction with a practical example. `[Mid]`
**A:** Beta reduction là "gọi hàm" trong lambda calculus: (λx.body) arg → thay x trong body bằng arg. Ví dụ: `(λx.x + 1) 5 → 5 + 1 → 6`. Trong JS: `((x) => x + 1)(5) → 6`. Mọi execution trong functional programming thực chất là chuỗi beta reductions.

### 🟡 Q: What is currying and how does it relate to lambda calculus? `[Mid]`
**A:** Currying biến hàm nhiều tham số thành chuỗi hàm 1 tham số: `f(a, b)` → `f(a)(b)`. Trong lambda calculus, tất cả hàm chỉ có 1 tham số: `λx.λy.x + y` thay vì `λ(x,y).x + y`. JS: `const add = x => y => x + y; add(2)(3) // 5`. Currying cho phép partial application — tạo hàm mới từ hàm cũ bằng cách fix một số tham số.

### 🔴 Q: Explain the Y combinator and why it matters for recursion. `[Senior]`
**A:** Y combinator giải bài toán đệ quy trong hệ thống không có tên hàm: `Y = λf.(λx.f(x x))(λx.f(x x))` với tính chất `Y g = g (Y g)`. Nó chứng minh rằng recursion không phải primitive — nó có thể derived từ lambda calculus thuần túy. Thực tế, strict languages (JS, Go) cần Z combinator (lazy variant) vì Y diverges dưới eager evaluation. Y combinator xuất hiện trong: (1) foundations of recursion theory, (2) fixed-point semantics của programming languages, (3) type theory — trong typed lambda calculus, Y không type-safe → cần recursive types.

---

## 9. Practical Interview Relevance — Ứng dụng trong Phỏng vấn

### Definition
- Section này tổng hợp cách áp dụng computation theory vào interview và system design thực tế.
- Focus: nhận diện pattern, trade-off decisions, và giải thích cho interviewer.

### Core Patterns

#### Pattern 1: Recognizing NP-hard Problems in System Design

```text
Red flags → problem might be NP-hard:
  - "Find the OPTIMAL assignment/schedule/route"
  - "Minimize cost subject to multiple constraints"
  - "Partition into groups optimizing some metric"
  - "Find the best combination from n items"

Khi nhận ra NP-hard:
  1. Nói rõ với interviewer: "This is a variant of [known NP-hard problem]"
  2. Đề xuất approximation/heuristic phù hợp
  3. Thảo luận trade-off: quality vs speed vs simplicity
```

| System Design Scenario | NP-hard Problem | Recommended Approach |
| --- | --- | --- |
| Delivery route optimization | TSP variant | Google OR-Tools, local search heuristics |
| Task scheduling across servers | Job shop scheduling | Greedy (shortest job first), priority queues |
| Ad placement optimization | Knapsack / Weighted matching | Greedy + LP relaxation |
| Database query plan optimization | Join ordering | DP for small n, genetic algorithm for large n |
| Container packing (K8s) | Bin packing | First Fit Decreasing, scoring heuristic |
| Feature flag testing | Combinatorial covering | Pairwise testing (cover 2-way interactions) |
| Social network community detection | Graph clustering / Clique | Louvain algorithm, spectral clustering |

#### Pattern 2: Understanding Impossibility Results

| Claim | Based on | Correct response in interview |
| --- | --- | --- |
| "We can detect all deadlocks at compile time" | Undecidable (Rice's theorem) | "Undecidable in general, but static analysis catches common patterns. Use runtime detection + timeouts as fallback." |
| "Our type system prevents all runtime errors" | Undecidable | "Sound type systems prevent specific classes of errors. TypeScript is unsound by design for pragmatism. Total correctness is undecidable." |
| "AI can find all security vulnerabilities" | Undecidable | "Security analysis is undecidable in general. AI/ML augments manual review + known pattern matching. Defense in depth." |

#### Pattern 3: Trade-offs — Exact vs Approximate

```text
Decision framework:
  1. Input size small (n < 20)?     → Exact (brute force / DP)
  2. Need provable guarantee?       → Approximation algorithm
  3. Need fast, good-enough?        → Greedy heuristic
  4. Complex constraints, large n?  → Metaheuristic (SA, GA)
  5. Can precompute offline?        → Exact offline + cache results
  6. Real-time requirement?         → Greedy / precomputed lookup
```

#### Pattern 4: When to Use Heuristics in Production

| Scenario | Heuristic Choice | Vietnamese explanation |
| --- | --- | --- |
| Load balancer | Round-robin, least connections | Đơn giản, O(1), good enough cho hầu hết cases. |
| Cache eviction | LRU, LFU | Heuristic cho optimal page replacement (Belady — requires future knowledge). |
| Garbage collector | Generational, concurrent mark-sweep | Heuristic cho optimal memory management. |
| Search ranking | Scoring function + top-K | Heuristic cho optimal ranking (NP-hard với nhiều factors). |
| Compiler optimization | Greedy register allocation, peephole | Heuristic cho optimal code generation (NP-hard). |

### Interview Q&A

### 🟢 Q: When would you choose a heuristic over an exact algorithm? `[Junior]`
**A:** Khi bài toán NP-hard và input lớn, exact algorithm quá chậm (exponential). Heuristic cho kết quả "đủ tốt" trong thời gian chấp nhận được. Ví dụ: routing cho 10,000 điểm giao hàng — exact TSP bất khả, nearest neighbor heuristic chạy trong seconds.

### 🟡 Q: You're designing a system that needs to optimally schedule tasks on machines. How do you approach it? `[Mid]`
**A:** (1) Nhận diện: đây là variant của Job Shop Scheduling — NP-hard. (2) Hỏi constraints: bao nhiêu tasks, machines, real-time requirement? (3) Nếu n nhỏ (< 20): exact DP hoặc ILP. (4) Nếu n lớn + cần real-time: greedy (shortest job first, load balancing). (5) Nếu n lớn + cần quality: offline solve bằng metaheuristic (SA/GA), cache schedule. (6) Monitoring: track schedule quality, fallback to simpler heuristic nếu metaheuristic quá chậm.

### 🟡 Q: A colleague claims they've written a program that detects all infinite loops. What do you say? `[Mid]`
**A:** Halting Problem chứng minh điều này bất khả cho mọi chương trình tùy ý. Tool của họ chắc chắn hoặc: (1) chỉ detect một số pattern cụ thể (hữu ích nhưng không complete), hoặc (2) có false positives (báo loop khi thực ra không phải), hoặc (3) chính tool đó có thể không dừng trên một số input. Giải thích lịch sự, gợi ý tool là valuable cho common patterns nhưng không thể claim "all".

### 🔴 Q: How does computation theory influence your approach to system design at scale? `[Senior]`
**A:** Ba cách chính: (1) **Complexity awareness:** Nhận diện component nào solve NP-hard problem (query optimizer, scheduler, load balancer) → chấp nhận heuristic, monitor quality, tune parameters. (2) **Impossibility awareness:** Biết giới hạn — không hứa "zero bugs" hay "perfect security" → design for defense in depth, graceful degradation. (3) **Approximation-first mindset:** Cho large-scale systems, "good enough fast" thường đánh bại "perfect slow" → start simple (greedy), measure, upgrade to better heuristic only when data shows need. CAP theorem, FLP impossibility, Byzantine fault tolerance — đều là manifestations of computation theory limits trong distributed systems.

### 🔴 Q: Compare the computational power of regex, context-free grammars, and Turing machines with real-world examples. `[Senior]`
**A:** (1) **Regex (Type 3):** Nhận regular languages — dùng cho input validation (email, phone), log parsing, search patterns. Không thể match nested structures. Ví dụ: `[a-z]+@[a-z]+\.[a-z]+` cho email. (2) **CFG (Type 2):** Nhận context-free languages — dùng cho programming language syntax, JSON/XML parsing, expression evaluation. Ví dụ: JSON parser, SQL parser. Không thể type-check (cần context). (3) **Turing Machine (Type 0):** Mọi thứ computable — general programming, type inference, optimization. Ví dụ: compiler (lexer = regex, parser = CFG, semantic analysis + optimization = Turing-complete). Biết cấp độ giúp chọn tool đúng: đừng dùng regex parse HTML (famous SO answer), dùng proper parser.

---

---

## Key Relationships Between Sections — Mối liên hệ giữa các phần

```text
Automata Theory (Section 2)
  │
  ├── Chomsky Hierarchy classifies languages by automaton power
  │     Type 3 (FA) ⊂ Type 2 (PDA) ⊂ Type 1 (LBA) ⊂ Type 0 (TM)
  │
  └── Turing Machine (Section 3) = most powerful automaton
        │
        ├── Church-Turing Thesis → defines "computable"
        │
        ├── Computability (Section 4)
        │     ├── Decidable vs Undecidable
        │     ├── Halting Problem → fundamental limit
        │     └── Rice's Theorem → semantic analysis impossible
        │
        ├── Complexity Theory (Section 5)
        │     ├── P ⊆ NP ⊆ PSPACE ⊆ EXPTIME
        │     ├── NP-Complete → hardest in NP
        │     └── Reductions → proving hardness
        │
        └── Lambda Calculus (Section 8) = equivalent model
              └── Foundation of functional programming

Approximation (Section 6) → practical response to NP-hardness
Information-Theoretic Limits (Section 7) → absolute lower bounds
Practical Relevance (Section 9) → applying all of the above in interviews
```

### Recommended Study Order
1. **Junior level:** Sections 1, 2 (basics), 3 (TM definition), 5 (P vs NP basics), 7 (sorting lower bound)
2. **Mid level:** Full Sections 2-5, Section 6 (approximation), Section 8 (lambda basics)
3. **Senior level:** All sections in depth, especially Rice's theorem, reductions, Y combinator, and Section 9 patterns

---

## Summary Table — Tóm tắt

| Topic | Key Takeaway | Interview Level |
| --- | --- | --- |
| Automata & Chomsky | Regex → DFA (Type 3), Parser → CFG/PDA (Type 2), General → TM (Type 0) | 🟢-🟡 |
| Turing Machine | Mô hình tính toán phổ quát, Church-Turing thesis, Turing completeness | 🟢-🟡 |
| Halting Problem | Tồn tại bài toán undecidable → perfect analysis impossible | 🟢-🔴 |
| Rice's Theorem | Mọi non-trivial semantic property undecidable | 🟡-🔴 |
| P vs NP | P ⊆ NP, NP-Complete = hardest in NP, likely P ≠ NP | 🟢-🔴 |
| NP-Complete problems | SAT, TSP, Knapsack, Graph Coloring... → recognize & approximate | 🟡-🔴 |
| Approximation | Ratio bounds, greedy, metaheuristics for NP-hard | 🟡-🔴 |
| Lower bounds | Ω(n log n) sorting, Ω(log n) search → information-theoretic limits | 🟢-🟡 |
| Lambda Calculus | Abstraction, application, reduction → foundation of FP | 🟡-🔴 |
| Practical patterns | Recognize NP-hard, accept impossibility, use heuristics in production | 🟡-🔴 |
