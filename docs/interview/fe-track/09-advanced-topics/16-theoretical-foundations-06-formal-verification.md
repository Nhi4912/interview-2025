# Formal Verification
## Mathematical Proof of Program Correctness

**English:** Formal verification uses mathematical techniques to prove that software and hardware systems satisfy their specifications, providing the highest level of assurance for safety-critical and security-critical systems.

**Tiếng Việt:** Xác minh hình thức sử dụng các kỹ thuật toán học để chứng minh rằng các hệ thống phần mềm và phần cứng đáp ứng các đặc tả của chúng, cung cấp mức độ đảm bảo cao nhất cho các hệ thống quan trọng về an toàn và bảo mật.

## Table of Contents
1. [Foundations of Verification](#foundations-of-verification)
2. [Hoare Logic](#hoare-logic)
3. [Separation Logic](#separation-logic)
4. [Model Checking](#model-checking)
5. [Abstract Interpretation](#abstract-interpretation)
6. [Symbolic Execution](#symbolic-execution)
7. [Refinement Types](#refinement-types)
8. [Concurrency Verification](#concurrency-verification)
9. [Verified Compilation](#verified-compilation)
10. [Case Studies](#case-studies)

## Foundations of Verification

### Specification

**What to Verify:**
- Functional correctness
- Safety properties
- Liveness properties
- Security properties
- Performance bounds

**Specification Languages:**
- Temporal logic (LTL, CTL)
- Pre/postconditions
- Invariants
- Contracts
- Type systems

**Levels of Specification:**
- **Abstract:** High-level requirements
- **Concrete:** Implementation details
- **Refinement:** Relationship between levels

### Verification Approaches

**Deductive Verification:**
Prove correctness using logical reasoning.
- Theorem proving
- Proof assistants
- Manual effort required

**Model Checking:**
Exhaustively explore state space.
- Automatic
- Limited to finite systems
- State explosion problem

**Static Analysis:**
Approximate program behavior.
- Sound over-approximation
- May report false positives
- Scalable

**Runtime Verification:**
Monitor execution traces.
- Detects actual violations
- Cannot prove absence of bugs
- Low overhead

### Soundness and Completeness

**Soundness:**
If verification succeeds, property holds.
- No false negatives
- Essential for safety

**Completeness:**
If property holds, verification succeeds.
- No false positives
- Desirable but often sacrificed

**Trade-offs:**
- Sound but incomplete: Conservative, may reject correct programs
- Complete but unsound: Dangerous, may accept incorrect programs
- Neither: Heuristic approaches

## Hoare Logic

### Hoare Triples

**Notation:**
{P} C {Q}

- P: Precondition
- C: Command/program
- Q: Postcondition

**Meaning:**
If P holds before executing C, and C terminates, then Q holds after.

**Partial Correctness:**
{P} C {Q} means if P holds and C terminates, then Q holds.

**Total Correctness:**
[P] C [Q] means if P holds, then C terminates and Q holds.

### Inference Rules

**Assignment:**
```
{Q[x ← E]} x := E {Q}
```

Backward reasoning: substitute E for x in Q.

**Sequence:**
```
{P} C₁ {R}    {R} C₂ {Q}
──────────────────────────
{P} C₁; C₂ {Q}
```

**Conditional:**
```
{P ∧ B} C₁ {Q}    {P ∧ ¬B} C₂ {Q}
────────────────────────────────────
{P} if B then C₁ else C₂ {Q}
```

**While Loop:**
```
{I ∧ B} C {I}
──────────────────────────
{I} while B do C {I ∧ ¬B}
```

I is loop invariant.

**Consequence:**
```
P' ⇒ P    {P} C {Q}    Q ⇒ Q'
──────────────────────────────
{P'} C {Q'}
```

Strengthen precondition, weaken postcondition.

### Loop Invariants

**Definition:**
Property that holds:
- Before loop entry
- After each iteration
- After loop exit

**Finding Invariants:**
- Generalize postcondition
- Consider loop variables
- Use domain knowledge
- Automated inference

**Example - Array Sum:**
```
{n ≥ 0}
sum := 0; i := 0;
{sum = Σ(a[0..i-1]) ∧ 0 ≤ i ≤ n}  // Invariant
while i < n do
  sum := sum + a[i];
  i := i + 1
{sum = Σ(a[0..n-1])}
```

### Weakest Precondition

**Definition:**
wp(C, Q) is weakest precondition such that {wp(C, Q)} C {Q}.

**Properties:**
- Law of excluded miracle: wp(C, false) = false
- Monotonicity: Q₁ ⇒ Q₂ implies wp(C, Q₁) ⇒ wp(C, Q₂)
- Distributivity: wp(C, Q₁ ∧ Q₂) = wp(C, Q₁) ∧ wp(C, Q₂)

**Calculation:**
- wp(x := E, Q) = Q[x ← E]
- wp(C₁; C₂, Q) = wp(C₁, wp(C₂, Q))
- wp(if B then C₁ else C₂, Q) = (B ⇒ wp(C₁, Q)) ∧ (¬B ⇒ wp(C₂, Q))

**Applications:**
- Verification condition generation
- Program derivation
- Compiler optimization

## Separation Logic

### Heap Reasoning

**Motivation:**
Hoare logic struggles with pointers and aliasing.

**Heap:**
Partial function from locations to values.

**Points-To:**
x ↦ v means location x contains value v.

**Separating Conjunction:**
P * Q means heap can be split into disjoint parts satisfying P and Q.

**Properties:**
- Commutative: P * Q ≡ Q * P
- Associative: (P * Q) * R ≡ P * (Q * R)
- Unit: emp (empty heap)

### Frame Rule

**Rule:**
```
{P} C {Q}
─────────────────────  (mod(C) ∩ free(R) = ∅)
{P * R} C {Q * R}
```

If C doesn't modify R, R is preserved.

**Local Reasoning:**
Reason about code using only relevant heap portion.

**Modularity:**
Verify components independently.

### Inference Rules

**Allocation:**
```
{emp} x := alloc(E) {x ↦ E}
```

**Deallocation:**
```
{x ↦ -} free(x) {emp}
```

**Load:**
```
{x ↦ v} y := [x] {x ↦ v ∧ y = v}
```

**Store:**
```
{x ↦ -} [x] := E {x ↦ E}
```

### Inductive Predicates

**Linked List:**
```
list(x, α) ≡ (x = null ∧ α = []) ∨
             ∃y, v, β. (x ↦ (v, y) * list(y, β) ∧ α = v::β)
```

**Binary Tree:**
```
tree(x) ≡ (x = null ∧ emp) ∨
          ∃l, r, v. (x ↦ (v, l, r) * tree(l) * tree(r))
```

**Verification:**
Use induction on structure.

### Applications

**Memory Safety:**
- No null pointer dereferences
- No use-after-free
- No double-free
- No memory leaks

**Concurrent Programs:**
- Concurrent separation logic
- Resource invariants
- Ownership transfer

**Tools:**
- VeriFast
- Viper
- Iris
- VST (Verified Software Toolchain)

## Model Checking

### State Space Exploration

**System Model:**
- States: S
- Initial states: I ⊆ S
- Transitions: R ⊆ S × S

**Reachability:**
Compute all states reachable from initial states.

**Fixed Point:**
Reach = μX. I ∪ {s' | ∃s ∈ X. (s, s') ∈ R}

**Algorithms:**
- Breadth-first search
- Depth-first search
- Symbolic methods

### Temporal Logic Model Checking

**LTL Model Checking:**
1. Negate property φ
2. Convert ¬φ to Büchi automaton
3. Compute product with system
4. Check for accepting cycle

**Complexity:**
PSPACE-complete in size of formula, polynomial in size of system.

**CTL Model Checking:**
1. Label states with atomic propositions
2. Recursively label with subformulas
3. Check if initial states satisfy formula

**Complexity:**
Linear in size of formula and system.

### Symbolic Model Checking

**Binary Decision Diagrams (BDDs):**
Canonical representation of Boolean functions.

**Operations:**
- Efficient Boolean operations
- Quantification
- Relational product

**Advantages:**
- Compact representation
- Handle large state spaces
- Automatic abstraction

**Limitations:**
- Variable ordering crucial
- Some functions have exponential BDDs

### Bounded Model Checking

**Idea:**
Check property up to depth k.

**SAT-Based:**
1. Encode system and property as SAT formula
2. Check satisfiability
3. Counterexample if satisfiable

**Advantages:**
- Leverage SAT solver efficiency
- Find bugs quickly
- No BDD variable ordering

**Completeness:**
Incomplete unless completeness threshold known.

### Abstraction

**Abstract Interpretation:**
Over-approximate system behavior.

**Predicate Abstraction:**
Abstract states using predicates.

**Counterexample-Guided Abstraction Refinement (CEGAR):**
1. Start with coarse abstraction
2. Model check abstraction
3. If counterexample, check if spurious
4. If spurious, refine abstraction
5. Repeat until property verified or real counterexample found

**Advantages:**
- Automatic refinement
- Scales to large systems
- Widely used in practice

## Abstract Interpretation

### Lattice Theory

**Partial Order:**
(L, ⊑) where ⊑ is reflexive, transitive, antisymmetric.

**Lattice:**
Every pair has least upper bound (⊔) and greatest lower bound (⊓).

**Complete Lattice:**
Every subset has ⊔ and ⊓.

**Examples:**
- Powerset with ⊆
- Intervals with ⊆
- Signs: {-, 0, +, ⊤, ⊥}

### Galois Connections

**Abstraction Function:**
α: C → A (concrete to abstract)

**Concretization Function:**
γ: A → C (abstract to concrete)

**Galois Connection:**
α(c) ⊑_A a ⟺ c ⊑_C γ(a)

**Properties:**
- α and γ monotone
- c ⊑ γ(α(c)) (soundness)
- α(γ(a)) ⊑ a (precision)

### Abstract Semantics

**Concrete Semantics:**
⟦C⟧: States → States

**Abstract Semantics:**
⟦C⟧^#: AbstractStates → AbstractStates

**Soundness:**
α(⟦C⟧(γ(a))) ⊑ ⟦C⟧^#(a)

**Fixed Point:**
Compute least fixed point in abstract domain.

### Widening and Narrowing

**Widening (∇):**
Ensure termination by over-approximating.

**Properties:**
- x ⊑ x ∇ y and y ⊑ x ∇ y
- Ascending chain stabilizes

**Narrowing (△):**
Improve precision after widening.

**Properties:**
- x △ y ⊑ x
- Descending chain stabilizes

**Example - Intervals:**
```
[a, b] ∇ [c, d] = [if c < a then -∞ else a, if d > b then +∞ else b]
```

### Abstract Domains

**Sign Domain:**
{-, 0, +, ⊤, ⊥}

**Interval Domain:**
[a, b] where a, b ∈ ℤ ∪ {-∞, +∞}

**Octagon Domain:**
Constraints of form ±x ± y ≤ c

**Polyhedra Domain:**
Linear inequalities

**Trade-offs:**
- Precision vs. efficiency
- Expressiveness vs. decidability

## Symbolic Execution

### Path Exploration

**Symbolic State:**
- Symbolic values for variables
- Path condition (constraints)

**Execution:**
1. Start with symbolic inputs
2. Execute instructions symbolically
3. Fork on branches
4. Accumulate path conditions

**Example:**
```
int f(int x, int y) {
  if (x > y) {
    if (x < y + 10) {
      return 1;  // Path: x > y ∧ x < y + 10
    }
  }
  return 0;
}
```

### Constraint Solving

**SMT Solver:**
Check satisfiability of path conditions.

**Test Generation:**
- Solve path condition for concrete inputs
- Achieve high code coverage

**Bug Finding:**
- Add assertion as constraint
- Check if satisfiable
- Counterexample if satisfiable

### Challenges

**Path Explosion:**
Exponential number of paths.

**Mitigation:**
- Heuristics for path selection
- Compositional analysis
- State merging

**Loops:**
Unbounded number of iterations.

**Solutions:**
- Loop bounds
- Loop summarization
- Symbolic execution with abstraction

**External Code:**
Libraries, system calls.

**Approaches:**
- Modeling
- Concolic execution
- Selective symbolic execution

### Concolic Execution

**Combination:**
Concrete + Symbolic execution.

**Process:**
1. Execute concretely with random inputs
2. Collect symbolic constraints
3. Negate branch conditions
4. Solve for new inputs
5. Repeat

**Advantages:**
- Handles external code
- Reduces path explosion
- Practical tool implementation

**Tools:**
- KLEE
- SAGE
- S2E

## Refinement Types

### Type-Based Verification

**Refinement Type:**
{x:B | P(x)}

Base type B refined by predicate P.

**Examples:**
- {x:Int | x > 0}: Positive integers
- {x:Int | x % 2 = 0}: Even integers
- {xs:List α | length xs > 0}: Non-empty lists

**Subtyping:**
{x:B | P(x)} <: {x:B | Q(x)} if P ⇒ Q

### Liquid Types

**Inference:**
Automatically infer refinement predicates.

**Liquid Types:**
Refinements from fixed set of qualifiers.

**Algorithm:**
1. Generate constraints from program
2. Solve constraints using SMT
3. Infer most precise types

**Advantages:**
- Automatic inference
- Modular checking
- Practical tool

### Dependent Refinement Types

**Dependent Types:**
Types depending on values.

**Combination:**
Refinement types + dependent types.

**Example:**
```
replicate : n:Nat → α → {xs:List α | length xs = n}
```

**Verification:**
- Array bounds checking
- Resource usage
- Protocol compliance

### Applications

**Memory Safety:**
```
{p:Ptr α | valid p} → α
```

**Information Flow:**
```
{x:Int | label x = Public} → {y:Int | label y = Public}
```

**Correctness:**
```
sort : xs:List Int → {ys:List Int | sorted ys ∧ permutation xs ys}
```

**Tools:**
- Liquid Haskell
- F*
- Dafny

## Concurrency Verification

### Challenges

**Interleaving:**
Exponential number of interleavings.

**Atomicity:**
Which operations are atomic?

**Synchronization:**
Locks, barriers, message passing.

**Liveness:**
Deadlock, livelock, starvation.

### Rely-Guarantee Reasoning

**Rely Condition:**
Assumptions about environment.

**Guarantee Condition:**
Promises about thread behavior.

**Judgment:**
(P, R, G, Q)

- P: Precondition
- R: Rely (environment transitions)
- G: Guarantee (thread transitions)
- Q: Postcondition

**Composition:**
If G₁ ⊆ R₂ and G₂ ⊆ R₁, threads can be composed.

### Concurrent Separation Logic

**Resource Invariants:**
Shared resources protected by invariants.

**Ownership Transfer:**
Transfer heap ownership between threads.

**Inference Rules:**
```
{P₁} C₁ {Q₁}    {P₂} C₂ {Q₂}
────────────────────────────────
{P₁ * P₂} C₁ ∥ C₂ {Q₁ * Q₂}
```

**Locks:**
```
{I} acquire(l) {I * locked(l)}
{I * locked(l)} release(l) {I}
```

### Model Checking for Concurrency

**Partial Order Reduction:**
Explore representative interleavings.

**Dynamic Partial Order Reduction:**
Compute dependencies dynamically.

**Stateless Model Checking:**
Don't store states, re-execute.

**Tools:**
- SPIN
- Java PathFinder
- CHESS

## Verified Compilation

### Compiler Correctness

**Specification:**
Compiled code preserves source semantics.

**Challenges:**
- Optimizations
- Different abstractions
- Undefined behavior

**Approaches:**
- Translation validation
- Verified compiler
- Proof-carrying code

### CompCert

**Verified C Compiler:**
Formally verified in Coq.

**Guarantees:**
- Semantic preservation
- No miscompilation bugs
- Deterministic compilation

**Architecture:**
- Multiple intermediate languages
- Verified transformations
- Extraction to OCaml

**Impact:**
- Used in safety-critical systems
- Demonstrates feasibility
- Influenced compiler design

### Verified Optimizations

**Common Subexpression Elimination:**
Prove expressions have same value.

**Dead Code Elimination:**
Prove code has no observable effect.

**Loop Optimizations:**
Prove transformations preserve semantics.

**Challenges:**
- Aliasing
- Side effects
- Undefined behavior

## Case Studies

### seL4 Microkernel

**Verification:**
- Functional correctness
- Security properties
- Performance bounds

**Effort:**
- 200,000 lines of proof
- 9,000 lines of C code
- 20 person-years

**Impact:**
- First verified OS kernel
- Used in critical systems
- Demonstrates scalability

### Verified Cryptography

**Cryptographic Implementations:**
- Constant-time execution
- Memory safety
- Functional correctness

**Tools:**
- EasyCrypt
- F*
- Jasmin

**Examples:**
- Verified TLS implementation
- Verified crypto libraries
- Side-channel resistance

### Verified Machine Learning

**Neural Network Verification:**
- Robustness properties
- Adversarial examples
- Safety guarantees

**Challenges:**
- Non-linearity
- High dimensionality
- Scalability

**Approaches:**
- Abstract interpretation
- SMT-based verification
- Interval analysis

## Interview Questions

**Q: Explain the difference between partial and total correctness in Hoare logic.**

A: Partial correctness {P} C {Q} means if P holds before C and C terminates, then Q holds after. Total correctness [P] C [Q] additionally guarantees C terminates. Partial correctness is easier to prove (no termination proof needed) but weaker. Total correctness requires proving loop termination using variant functions that decrease on each iteration.

**Q: What is separation logic and why is it useful?**

A: Separation logic extends Hoare logic for reasoning about heap-manipulating programs. The separating conjunction (P * Q) means heap can be split into disjoint parts satisfying P and Q. This enables local reasoning - verify code using only relevant heap portion. The frame rule allows preserving unmodified heap portions. Essential for verifying pointer programs, memory safety, and concurrent programs.

**Q: Explain the state explosion problem in model checking and mitigation strategies.**

A: State explosion occurs when system state space grows exponentially with components. Mitigations: (1) Symbolic model checking using BDDs for compact representation, (2) Abstraction to reduce state space, (3) Partial order reduction to explore representative interleavings, (4) Bounded model checking to check finite depths, (5) Compositional verification to verify components separately. CEGAR combines abstraction with automatic refinement.

**Q: What is abstract interpretation and how does it differ from model checking?**

A: Abstract interpretation computes sound over-approximation of program behavior using abstract domains (intervals, signs, polyhedra). It's sound but incomplete - may report false positives. Model checking exhaustively explores concrete states - complete for finite systems but suffers state explosion. Abstract interpretation scales better but less precise. Widening ensures termination by over-approximating fixed points.

**Q: Explain symbolic execution and its applications.**

A: Symbolic execution runs programs with symbolic inputs instead of concrete values, accumulating path conditions (constraints on inputs). At branches, execution forks exploring both paths. SMT solvers check path condition satisfiability. Applications: (1) Test generation - solve path conditions for concrete inputs achieving high coverage, (2) Bug finding - add assertions as constraints and check satisfiability, (3) Equivalence checking. Challenges: path explosion, loops, external code. Concolic execution combines concrete and symbolic execution.

---

[← Back to Logic and Proof Theory](./05-logic-proof-theory.md) | [Next: Distributed Systems Theory →](./07-distributed-systems-theory.md)
