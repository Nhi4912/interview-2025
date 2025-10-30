# Logic and Proof Theory
## Foundations of Formal Reasoning

**English:** Logic and proof theory provide the mathematical foundations for reasoning about truth, validity, and formal systems, essential for program verification, automated theorem proving, and understanding computational limits.

**Tiếng Việt:** Logic và lý thuyết chứng minh cung cấp nền tảng toán học cho việc suy luận về chân lý, tính hợp lệ và các hệ thống hình thức, thiết yếu cho xác minh chương trình, chứng minh định lý tự động và hiểu các giới hạn tính toán.

## Table of Contents
1. [Propositional Logic](#propositional-logic)
2. [First-Order Logic](#first-order-logic)
3. [Higher-Order Logic](#higher-order-logic)
4. [Modal Logic](#modal-logic)
5. [Temporal Logic](#temporal-logic)
6. [Intuitionistic Logic](#intuitionistic-logic)
7. [Linear Logic](#linear-logic)
8. [Proof Systems](#proof-systems)
9. [Model Theory](#model-theory)
10. [Automated Theorem Proving](#automated-theorem-proving)

## Propositional Logic

### Syntax

**Propositional Variables:**
p, q, r, ...

**Logical Connectives:**
- ¬ (negation)
- ∧ (conjunction)
- ∨ (disjunction)
- → (implication)
- ↔ (biconditional)

**Well-Formed Formulas:**
- Atomic: p, q, r
- Compound: ¬φ, (φ ∧ ψ), (φ ∨ ψ), (φ → ψ), (φ ↔ ψ)

**Precedence:**
¬ > ∧ > ∨ > → > ↔

### Semantics

**Truth Values:**
True (⊤, 1) and False (⊥, 0)

**Truth Tables:**

**Negation:**
| p | ¬p |
|---|-----|
| T | F   |
| F | T   |

**Conjunction:**
| p | q | p∧q |
|---|---|-----|
| T | T | T   |
| T | F | F   |
| F | T | F   |
| F | F | F   |

**Disjunction:**
| p | q | p∨q |
|---|---|-----|
| T | T | T   |
| T | F | T   |
| F | T | T   |
| F | F | F   |

**Implication:**
| p | q | p→q |
|---|---|-----|
| T | T | T   |
| T | F | F   |
| F | T | T   |
| F | F | T   |

**Biconditional:**
| p | q | p↔q |
|---|---|-----|
| T | T | T   |
| T | F | F   |
| F | T | F   |
| F | F | T   |

### Logical Equivalences

**De Morgan's Laws:**
- ¬(p ∧ q) ≡ ¬p ∨ ¬q
- ¬(p ∨ q) ≡ ¬p ∧ ¬q

**Distributive Laws:**
- p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)
- p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)

**Implication:**
- p → q ≡ ¬p ∨ q
- p → q ≡ ¬q → ¬p (contrapositive)

**Absorption:**
- p ∧ (p ∨ q) ≡ p
- p ∨ (p ∧ q) ≡ p

**Idempotence:**
- p ∧ p ≡ p
- p ∨ p ≡ p

### Normal Forms

**Literal:**
Propositional variable or its negation.

**Conjunctive Normal Form (CNF):**
Conjunction of disjunctions of literals.
(p ∨ ¬q ∨ r) ∧ (¬p ∨ q) ∧ (q ∨ ¬r)

**Disjunctive Normal Form (DNF):**
Disjunction of conjunctions of literals.
(p ∧ q ∧ ¬r) ∨ (¬p ∧ q) ∨ (p ∧ ¬q ∧ r)

**Conversion Algorithm:**
1. Eliminate biconditionals and implications
2. Move negations inward (De Morgan's)
3. Distribute ∧ over ∨ (for CNF) or ∨ over ∧ (for DNF)

### Satisfiability

**Satisfiable:**
Formula has at least one satisfying assignment.

**Unsatisfiable:**
Formula has no satisfying assignment (contradiction).

**Valid (Tautology):**
Formula is true under all assignments.

**SAT Problem:**
Given formula in CNF, determine if satisfiable.
- NP-complete
- Foundation of many verification tools

**3-SAT:**
SAT restricted to clauses with at most 3 literals.
- NP-complete
- Used in complexity theory reductions

## First-Order Logic

### Syntax

**Terms:**
- Variables: x, y, z
- Constants: a, b, c
- Functions: f(t₁, ..., tₙ)

**Formulas:**
- Atomic: P(t₁, ..., tₙ), t₁ = t₂
- Compound: ¬φ, (φ ∧ ψ), (φ ∨ ψ), (φ → ψ)
- Quantified: ∀x.φ, ∃x.φ

**Free and Bound Variables:**
- Bound: Variable in scope of quantifier
- Free: Not bound by any quantifier

**Sentence:**
Formula with no free variables.

### Semantics

**Structure (Model):**
M = (D, I) where:
- D: Non-empty domain
- I: Interpretation function
  - Maps constants to elements of D
  - Maps n-ary functions to functions Dⁿ → D
  - Maps n-ary predicates to relations on Dⁿ

**Variable Assignment:**
σ: Variables → D

**Satisfaction:**
M, σ ⊨ φ (M satisfies φ under σ)

**Quantifier Semantics:**
- M, σ ⊨ ∀x.φ iff M, σ[x↦d] ⊨ φ for all d ∈ D
- M, σ ⊨ ∃x.φ iff M, σ[x↦d] ⊨ φ for some d ∈ D

### Logical Consequence

**Entailment:**
Γ ⊨ φ if every model satisfying all formulas in Γ also satisfies φ.

**Validity:**
⊨ φ if φ is true in all models.

**Consistency:**
Γ is consistent if it has a model.

**Completeness:**
Γ ⊨ φ iff Γ ⊢ φ (semantic entailment equals syntactic derivability)

### Theories

**Theory:**
Set of sentences closed under logical consequence.

**Examples:**
- **Peano Arithmetic:** Theory of natural numbers
- **ZFC:** Zermelo-Fraenkel set theory with Choice
- **Group Theory:** Axioms of groups
- **Linear Order:** Axioms of total orders

**Decidability:**
Theory is decidable if there's algorithm to determine validity of sentences.

**Examples:**
- Presburger arithmetic (addition): Decidable
- Peano arithmetic (addition, multiplication): Undecidable
- Real closed fields: Decidable

## Higher-Order Logic

### Second-Order Logic

**Syntax:**
Quantification over predicates and functions.
∀P.φ, ∃P.φ

**Example:**
Induction axiom:
∀P.(P(0) ∧ ∀n.(P(n) → P(n+1))) → ∀n.P(n)

**Expressiveness:**
- Can define finiteness
- Can characterize natural numbers up to isomorphism
- More expressive than first-order logic

**Completeness:**
No complete proof system for second-order logic (unlike first-order).

### Higher-Order Logic

**Type Theory:**
Types for individuals, predicates, functions, etc.

**Simple Type Theory:**
- Base types: ι (individuals), o (propositions)
- Function types: σ → τ

**Church's Type Theory:**
Foundation for HOL theorem provers.

**Applications:**
- Formal verification
- Mathematics formalization
- Program specification

## Modal Logic

### Basic Modal Logic

**Operators:**
- □φ: "necessarily φ" (box)
- ◇φ: "possibly φ" (diamond)

**Duality:**
◇φ ≡ ¬□¬φ

**Axioms:**
- **K:** □(φ → ψ) → (□φ → □ψ)
- **T:** □φ → φ
- **4:** □φ → □□φ
- **5:** ◇φ → □◇φ

**Modal Systems:**
- **K:** Just axiom K
- **T:** K + T (reflexive)
- **S4:** K + T + 4 (reflexive, transitive)
- **S5:** K + T + 4 + 5 (equivalence relation)

### Kripke Semantics

**Kripke Frame:**
F = (W, R) where:
- W: Set of possible worlds
- R: Accessibility relation on W

**Kripke Model:**
M = (W, R, V) where:
- V: Valuation function (world → propositions → truth values)

**Satisfaction:**
- M, w ⊨ □φ iff M, w' ⊨ φ for all w' with wRw'
- M, w ⊨ ◇φ iff M, w' ⊨ φ for some w' with wRw'

**Frame Conditions:**
- T: R reflexive
- 4: R transitive
- 5: R euclidean

### Applications

**Epistemic Logic:**
- □φ: "agent knows φ"
- Multi-agent systems
- Knowledge representation

**Deontic Logic:**
- □φ: "φ is obligatory"
- Ethical reasoning
- Legal systems

**Provability Logic:**
- □φ: "φ is provable"
- Gödel's incompleteness theorems
- Self-reference

## Temporal Logic

### Linear Temporal Logic (LTL)

**Operators:**
- ○φ: "next φ" (next state)
- □φ: "always φ" (globally)
- ◇φ: "eventually φ" (finally)
- φ U ψ: "φ until ψ"

**Semantics:**
Infinite sequences of states (traces).

**Examples:**
- □(request → ◇grant): Every request eventually granted
- □◇φ: φ holds infinitely often
- ◇□φ: φ eventually holds forever

**Model Checking:**
Verify system satisfies LTL specification.

### Computation Tree Logic (CTL)

**Path Quantifiers:**
- A: "for all paths"
- E: "there exists a path"

**Combined Operators:**
- AX φ: φ holds in all next states
- EX φ: φ holds in some next state
- AF φ: φ eventually holds on all paths
- EF φ: φ eventually holds on some path
- AG φ: φ always holds on all paths
- EG φ: φ always holds on some path

**Branching Time:**
Models all possible futures (tree structure).

**Expressiveness:**
LTL and CTL incomparable - each can express properties the other cannot.

### CTL*

**Combination:**
Combines LTL and CTL expressiveness.

**Syntax:**
Arbitrary nesting of path quantifiers and temporal operators.

**Model Checking:**
More complex than LTL or CTL alone.

## Intuitionistic Logic

### Constructive Mathematics

**Rejection of Law of Excluded Middle:**
¬(φ ∨ ¬φ) not valid in general.

**Rejection of Double Negation:**
¬¬φ → φ not valid in general.

**Constructive Proofs:**
Existence proofs must provide witness.

**BHK Interpretation:**
- φ ∧ ψ: Proof of φ and proof of ψ
- φ ∨ ψ: Proof of φ or proof of ψ, with indication which
- φ → ψ: Construction transforming proof of φ to proof of ψ
- ¬φ: Construction transforming proof of φ to contradiction
- ∀x.φ: Construction giving proof of φ(t) for any term t
- ∃x.φ: Pair (t, p) where t is term and p is proof of φ(t)

### Kripke Semantics for Intuitionistic Logic

**Intuitionistic Kripke Frame:**
(W, ≤) where ≤ is partial order (reflexive, transitive, antisymmetric).

**Monotonicity:**
If w ≤ w' and w ⊨ φ, then w' ⊨ φ.

**Forcing:**
- w ⊩ p iff p ∈ V(w) for atomic p
- w ⊩ φ ∧ ψ iff w ⊩ φ and w ⊩ ψ
- w ⊩ φ ∨ ψ iff w ⊩ φ or w ⊩ ψ
- w ⊩ φ → ψ iff for all w' ≥ w, if w' ⊩ φ then w' ⊩ ψ
- w ⊩ ¬φ iff for all w' ≥ w, w' ⊮ φ

### Applications

**Type Theory:**
Intuitionistic logic corresponds to type theory via Curry-Howard.

**Constructive Mathematics:**
Mathematics where all proofs are constructive.

**Program Extraction:**
Extract programs from constructive proofs.

## Linear Logic

### Resource Interpretation

**Classical Logic:**
Propositions can be reused or discarded freely.

**Linear Logic:**
Propositions are resources consumed exactly once.

**Structural Rules:**
- **Weakening:** Discard unused assumptions
- **Contraction:** Duplicate assumptions
- **Exchange:** Reorder assumptions

Linear logic restricts weakening and contraction.

### Connectives

**Multiplicative:**
- A ⊗ B: Tensor (simultaneous resources)
- A ⊸ B: Linear implication (consume A to produce B)
- 1: Multiplicative unit
- ⊥: Multiplicative zero

**Additive:**
- A & B: With (choice of resources)
- A ⊕ B: Plus (external choice)
- ⊤: Additive unit
- 0: Additive zero

**Exponentials:**
- !A: "Of course A" (unlimited copies)
- ?A: "Why not A" (may discard)

**Duality:**
A⊥ is linear negation of A.

### Sequent Calculus

**Sequents:**
Γ ⊢ Δ

Where Γ and Δ are multisets (order doesn't matter, but multiplicity does).

**Cut Elimination:**
Every proof can be transformed to cut-free proof.

**Applications:**
- Session types
- Resource management
- Quantum computing
- Concurrent programming

## Proof Systems

### Natural Deduction

**Introduction and Elimination Rules:**

**Conjunction:**
```
φ  ψ           φ ∧ ψ         φ ∧ ψ
────── ∧I      ────── ∧E₁    ────── ∧E₂
φ ∧ ψ            φ             ψ
```

**Implication:**
```
[φ]
 ⋮
 ψ              φ → ψ    φ
────── →I       ──────────── →E
φ → ψ                ψ
```

**Universal Quantifier:**
```
φ[x]           ∀x.φ
────── ∀I      ────── ∀E
∀x.φ           φ[t]
```

Where x not free in assumptions for ∀I.

### Sequent Calculus

**Sequents:**
Γ ⊢ Δ

Γ: Antecedent (assumptions)
Δ: Succedent (conclusions)

**Structural Rules:**
- Identity: φ ⊢ φ
- Cut: If Γ ⊢ Δ, φ and φ, Γ' ⊢ Δ', then Γ, Γ' ⊢ Δ, Δ'

**Logical Rules:**
Left and right rules for each connective.

**Cut Elimination:**
Fundamental theorem: cuts can be eliminated.

### Resolution

**Clause:**
Disjunction of literals.

**Resolution Rule:**
```
C ∨ p    D ∨ ¬p
─────────────────
     C ∨ D
```

**Refutation:**
To prove φ, show ¬φ leads to contradiction.

**Unification:**
Find substitution making terms equal.

**Applications:**
- Automated theorem proving
- Logic programming (Prolog)
- SAT solvers

### Tableaux Method

**Semantic Trees:**
Systematic search for countermodel.

**Rules:**
- α-rules: Conjunctive (both branches must close)
- β-rules: Disjunctive (one branch must close)

**Closure:**
Branch closes if contains φ and ¬φ.

**Completeness:**
If formula valid, tableau closes.

## Model Theory

### Structures and Homomorphisms

**Homomorphism:**
f: M → N preserving operations and relations.

**Isomorphism:**
Bijective homomorphism with inverse also homomorphism.

**Embedding:**
Injective homomorphism preserving and reflecting formulas.

**Elementary Embedding:**
Embedding preserving all first-order formulas.

### Compactness Theorem

**Statement:**
If every finite subset of Γ has a model, then Γ has a model.

**Proof:**
Via completeness theorem and König's lemma.

**Applications:**
- Non-standard analysis
- Ultraproducts
- Existence proofs

### Löwenheim-Skolem Theorems

**Downward:**
If theory has infinite model, it has countable model.

**Upward:**
If theory has infinite model, it has models of all infinite cardinalities.

**Skolem Paradox:**
ZFC has countable model, yet proves existence of uncountable sets.

**Resolution:**
"Countable" is relative to model.

### Completeness and Categoricity

**Complete Theory:**
For every sentence φ, either T ⊢ φ or T ⊢ ¬φ.

**Categorical:**
All models of theory are isomorphic.

**κ-Categorical:**
All models of cardinality κ are isomorphic.

**Morley's Theorem:**
If theory is κ-categorical for some uncountable κ, it's categorical for all uncountable κ.

## Automated Theorem Proving

### SAT Solvers

**DPLL Algorithm:**
1. Unit propagation
2. Pure literal elimination
3. Branching on variables

**CDCL (Conflict-Driven Clause Learning):**
- Learn from conflicts
- Non-chronological backtracking
- Modern SAT solvers

**Applications:**
- Hardware verification
- Software verification
- Planning
- Scheduling

### SMT Solvers

**Satisfiability Modulo Theories:**
SAT extended with background theories.

**Theories:**
- Linear arithmetic
- Arrays
- Bit-vectors
- Uninterpreted functions

**Architecture:**
- SAT solver (Boolean reasoning)
- Theory solvers (domain-specific)
- Cooperation via DPLL(T)

**Applications:**
- Program verification
- Symbolic execution
- Test generation

### Resolution Theorem Provers

**Superposition Calculus:**
Efficient for first-order logic with equality.

**Ordering Constraints:**
Restrict inferences to reduce search space.

**Redundancy Elimination:**
Remove subsumed clauses.

**Provers:**
- E
- Vampire
- SPASS

### Interactive Theorem Provers

**Proof Assistants:**
- Coq
- Isabelle
- Lean
- Agda

**Tactics:**
High-level proof strategies.

**Automation:**
Combine interactive and automatic proving.

**Applications:**
- Mathematics formalization
- Software verification
- Compiler correctness

## Interview Questions

**Q: Explain the difference between classical and intuitionistic logic.**

A: Classical logic accepts law of excluded middle (φ ∨ ¬φ) and double negation elimination (¬¬φ → φ). Intuitionistic logic rejects these, requiring constructive proofs. In intuitionistic logic, proving ∃x.P(x) requires providing witness x, not just showing ¬∀x.¬P(x). This corresponds to computation via Curry-Howard: intuitionistic proofs are programs.

**Q: What is the SAT problem and why is it important?**

A: SAT asks whether a Boolean formula in CNF is satisfiable. It's the first problem proven NP-complete (Cook-Levin theorem), making it fundamental to complexity theory. Modern SAT solvers are surprisingly efficient despite NP-completeness, enabling practical applications in verification, planning, and constraint solving. Many problems reduce to SAT.

**Q: Explain temporal logic and its use in verification.**

A: Temporal logic extends propositional logic with operators for reasoning about time: ○ (next), □ (always), ◇ (eventually), U (until). LTL reasons about linear time (single execution), CTL about branching time (all possible executions). Model checking verifies systems satisfy temporal specifications, catching bugs like deadlocks, livelocks, and safety violations.

**Q: What is the Curry-Howard correspondence in logic?**

A: Curry-Howard establishes correspondence between logic and computation: propositions are types, proofs are programs, proof checking is type checking. Conjunction corresponds to product types, disjunction to sum types, implication to function types. This unifies logic and programming, enabling proof assistants and verified software.

**Q: Explain linear logic and its applications.**

A: Linear logic treats propositions as resources consumed exactly once, unlike classical logic where propositions can be reused freely. It restricts structural rules (weakening, contraction). Applications include session types (protocol verification), resource management (memory, files), quantum computing (no-cloning), and concurrent programming (process calculi). The tensor (⊗) represents simultaneous resources, linear implication (⊸) resource transformation.

---

[← Back to Category Theory](./04-category-theory.md) | [Next: Formal Verification →](./06-formal-verification.md)
