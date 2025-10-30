# Computer Science Fundamentals Theory
## Mathematical and Theoretical Foundations

**English:** Computer Science fundamentals encompass the mathematical, logical, and theoretical principles that underpin all computing systems, from basic computational theory to advanced algorithmic analysis.

**Tiếng Việt:** Các nguyên lý cơ bản của Khoa học Máy tính bao gồm các nguyên tắc toán học, logic và lý thuyết làm nền tảng cho tất cả các hệ thống tính toán, từ lý thuyết tính toán cơ bản đến phân tích thuật toán nâng cao.

## Table of Contents
1. [Mathematical Foundations](#mathematical-foundations)
2. [Logic and Proof Theory](#logic-and-proof-theory)
3. [Set Theory](#set-theory)
4. [Graph Theory](#graph-theory)
5. [Number Theory](#number-theory)
6. [Combinatorics](#combinatorics)
7. [Probability Theory](#probability-theory)
8. [Information Theory](#information-theory)
9. [Computational Complexity](#computational-complexity)
10. [Formal Methods](#formal-methods)

## Mathematical Foundations

### Discrete Mathematics

**Definition:** Branch of mathematics dealing with discrete objects and structures, fundamental to computer science.

**Key Areas:**
- Logic and Boolean algebra
- Set theory and relations
- Functions and sequences
- Graph theory
- Combinatorics
- Number theory
- Discrete probability

**Boolean Algebra:**
Fundamental to digital logic and computer operations.

**Basic Operations:**
- AND (∧): True only when both operands are true
- OR (∨): True when at least one operand is true  
- NOT (¬): Inverts the truth value

**Laws of Boolean Algebra:**
- Commutative: A ∧ B = B ∧ A, A ∨ B = B ∨ A
- Associative: (A ∧ B) ∧ C = A ∧ (B ∧ C)
- Distributive: A ∧ (B ∨ C) = (A ∧ B) ∨ (A ∧ C)
- Identity: A ∧ 1 = A, A ∨ 0 = A
- Complement: A ∧ ¬A = 0, A ∨ ¬A = 1
- De Morgan's: ¬(A ∧ B) = ¬A ∨ ¬B, ¬(A ∨ B) = ¬A ∧ ¬B

**Applications:**
- Digital circuit design
- Database query optimization
- Search algorithms
- Compiler optimization

### Functions and Relations

**Function Definition:**
A function f: A → B is a relation where each element in domain A maps to exactly one element in codomain B.

**Types of Functions:**
- **Injective (One-to-one):** Different inputs produce different outputs
- **Surjective (Onto):** Every element in codomain has a preimage
- **Bijective:** Both injective and surjective

**Relations:**
A relation R on set A is a subset of A × A.

**Properties of Relations:**
- **Reflexive:** aRa for all a ∈ A
- **Symmetric:** aRb implies bRa
- **Transitive:** aRb and bRc implies aRc
- **Antisymmetric:** aRb and bRa implies a = b

**Equivalence Relations:**
Reflexive, symmetric, and transitive relations that partition sets into equivalence classes.

**Partial Orders:**
Reflexive, antisymmetric, and transitive relations used in sorting algorithms and dependency analysis.

## Logic and Proof Theory

### Propositional Logic

**Propositions:** Statements that are either true or false.

**Logical Connectives:**
- Conjunction (∧): P ∧ Q
- Disjunction (∨): P ∨ Q
- Implication (→): P → Q
- Biconditional (↔): P ↔ Q
- Negation (¬): ¬P

**Truth Tables:**
Systematic way to determine truth values of compound propositions.

**Tautologies:** Always true regardless of truth values of components.
**Contradictions:** Always false.
**Contingencies:** Truth value depends on components.

### Predicate Logic

**Predicates:** Functions that return true or false based on input values.

**Quantifiers:**
- **Universal (∀):** "For all" - ∀x P(x)
- **Existential (∃):** "There exists" - ∃x P(x)

**Applications in Computer Science:**
- Program verification
- Database query languages
- Artificial intelligence
- Formal specification

### Proof Techniques

**Direct Proof:**
Assume premises are true and derive conclusion through logical steps.

**Proof by Contradiction:**
Assume negation of what you want to prove and derive a contradiction.

**Proof by Induction:**
1. **Base Case:** Prove P(1) is true
2. **Inductive Step:** Prove P(k) → P(k+1)
3. **Conclusion:** P(n) is true for all n ≥ 1

**Strong Induction:**
Assume P(1), P(2), ..., P(k) are all true to prove P(k+1).

**Structural Induction:**
Used for recursively defined structures like trees and lists.

## Set Theory

### Basic Set Operations

**Union:** A ∪ B = {x | x ∈ A or x ∈ B}
**Intersection:** A ∩ B = {x | x ∈ A and x ∈ B}
**Difference:** A - B = {x | x ∈ A and x ∉ B}
**Complement:** A' = {x | x ∉ A}
**Cartesian Product:** A × B = {(a,b) | a ∈ A and b ∈ B}

**Set Laws:**
- Commutative: A ∪ B = B ∪ A
- Associative: (A ∪ B) ∪ C = A ∪ (B ∪ C)
- Distributive: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)
- De Morgan's: (A ∪ B)' = A' ∩ B'

### Cardinality

**Finite Sets:** |A| = number of elements in A
**Infinite Sets:** Countable vs. uncountable infinity

**Cantor's Theorem:** For any set A, |A| < |P(A)| where P(A) is the power set.

**Applications:**
- Database design (entity relationships)
- Algorithm analysis (input/output sets)
- Data structure design
- Complexity theory

## Graph Theory

### Graph Fundamentals

**Graph Definition:** G = (V, E) where V is set of vertices and E is set of edges.

**Types of Graphs:**
- **Directed vs. Undirected**
- **Weighted vs. Unweighted**
- **Simple vs. Multigraph**
- **Connected vs. Disconnected**
- **Cyclic vs. Acyclic**

**Graph Properties:**
- **Degree:** Number of edges incident to a vertex
- **Path:** Sequence of vertices connected by edges
- **Cycle:** Path that starts and ends at same vertex
- **Connected Component:** Maximal connected subgraph

### Special Graphs

**Trees:** Connected acyclic graphs
- n vertices, n-1 edges
- Unique path between any two vertices
- Removing any edge disconnects the graph

**Bipartite Graphs:** Vertices can be divided into two disjoint sets with edges only between sets.

**Complete Graphs:** Every pair of vertices is connected.
- Kₙ has n(n-1)/2 edges

**Planar Graphs:** Can be drawn without edge crossings.
- Euler's formula: v - e + f = 2

### Graph Algorithms Theory

**Traversal Algorithms:**
- **Depth-First Search (DFS):** Explores as far as possible before backtracking
- **Breadth-First Search (BFS):** Explores all neighbors before going deeper

**Shortest Path Algorithms:**
- **Dijkstra's Algorithm:** Single-source shortest paths with non-negative weights
- **Bellman-Ford Algorithm:** Handles negative weights, detects negative cycles
- **Floyd-Warshall Algorithm:** All-pairs shortest paths

**Minimum Spanning Tree:**
- **Kruskal's Algorithm:** Sort edges, add if no cycle
- **Prim's Algorithm:** Grow tree from arbitrary vertex

**Applications:**
- Social networks
- Transportation systems
- Computer networks
- Dependency analysis
- Circuit design

## Number Theory

### Divisibility and Primes

**Divisibility:** a divides b (a|b) if b = ka for some integer k.

**Greatest Common Divisor (GCD):**
Largest positive integer that divides both numbers.

**Euclidean Algorithm:**
Efficient method to compute GCD using repeated division.

**Prime Numbers:** Natural numbers greater than 1 with exactly two divisors.

**Fundamental Theorem of Arithmetic:**
Every integer greater than 1 has unique prime factorization.

**Prime Distribution:**
- Infinitely many primes (Euclid's proof)
- Prime Number Theorem: π(n) ≈ n/ln(n)
- Gaps between primes can be arbitrarily large

### Modular Arithmetic

**Congruence:** a ≡ b (mod m) if m divides (a - b)

**Properties:**
- Reflexive: a ≡ a (mod m)
- Symmetric: a ≡ b (mod m) implies b ≡ a (mod m)
- Transitive: a ≡ b (mod m) and b ≡ c (mod m) implies a ≡ c (mod m)

**Arithmetic Operations:**
- (a + b) mod m = ((a mod m) + (b mod m)) mod m
- (a × b) mod m = ((a mod m) × (b mod m)) mod m

**Applications:**
- Cryptography (RSA, elliptic curves)
- Hash functions
- Random number generation
- Computer graphics (periodic functions)

### Chinese Remainder Theorem

**Statement:** System of congruences with pairwise coprime moduli has unique solution modulo their product.

**Applications:**
- Parallel computation
- Error correction codes
- Fast arithmetic algorithms

## Combinatorics

### Counting Principles

**Addition Principle:** If events are mutually exclusive, total ways = sum of individual ways.

**Multiplication Principle:** If events are independent, total ways = product of individual ways.

**Inclusion-Exclusion Principle:**
|A ∪ B| = |A| + |B| - |A ∩ B|

Generalizes to multiple sets.

### Permutations and Combinations

**Permutations:** Arrangements where order matters
- P(n,r) = n!/(n-r)!
- Circular permutations: (n-1)!

**Combinations:** Selections where order doesn't matter
- C(n,r) = n!/(r!(n-r)!)
- Pascal's identity: C(n,r) = C(n-1,r-1) + C(n-1,r)

**Binomial Theorem:**
(x + y)ⁿ = Σ C(n,k) × xᵏ × yⁿ⁻ᵏ

### Generating Functions

**Ordinary Generating Functions:**
G(x) = Σ aₙxⁿ where aₙ is the coefficient of xⁿ

**Applications:**
- Solving recurrence relations
- Counting problems
- Probability distributions

**Exponential Generating Functions:**
Used when order matters in combinatorial structures.

### Pigeonhole Principle

**Statement:** If n pigeons are placed in m pigeonholes with n > m, then at least one pigeonhole contains more than one pigeon.

**Generalized Form:** If n objects are placed in m boxes, then at least one box contains at least ⌈n/m⌉ objects.

**Applications:**
- Proving existence of duplicates
- Hash table analysis
- Algorithm design

## Probability Theory

### Basic Probability

**Sample Space (Ω):** Set of all possible outcomes
**Event:** Subset of sample space
**Probability Function:** P: Events → [0,1]

**Axioms of Probability:**
1. P(A) ≥ 0 for all events A
2. P(Ω) = 1
3. P(A ∪ B) = P(A) + P(B) if A ∩ B = ∅

**Conditional Probability:**
P(A|B) = P(A ∩ B) / P(B)

**Independence:**
Events A and B are independent if P(A ∩ B) = P(A) × P(B)

### Random Variables

**Discrete Random Variables:**
- Probability mass function (PMF)
- Expected value: E[X] = Σ x × P(X = x)
- Variance: Var(X) = E[X²] - (E[X])²

**Continuous Random Variables:**
- Probability density function (PDF)
- Cumulative distribution function (CDF)

**Common Distributions:**
- **Bernoulli:** Single trial with success probability p
- **Binomial:** n independent Bernoulli trials
- **Geometric:** Number of trials until first success
- **Poisson:** Number of events in fixed interval
- **Uniform:** All outcomes equally likely
- **Normal:** Bell curve distribution

### Applications in Computer Science

**Algorithm Analysis:**
- Average-case complexity
- Randomized algorithms
- Probabilistic data structures

**Machine Learning:**
- Bayesian inference
- Statistical learning theory
- Probabilistic models

**Computer Systems:**
- Reliability analysis
- Performance modeling
- Queue theory

## Information Theory

### Entropy and Information

**Information Content:**
I(x) = -log₂(P(x)) bits

Rare events carry more information.

**Entropy:**
H(X) = -Σ P(x) × log₂(P(x))

Measures average information content or uncertainty.

**Properties:**
- H(X) ≥ 0
- H(X) is maximized when all outcomes are equally likely
- H(X) = 0 when outcome is certain

**Joint and Conditional Entropy:**
- H(X,Y): Entropy of joint distribution
- H(X|Y): Conditional entropy
- H(X,Y) = H(X) + H(Y|X)

### Mutual Information

**Definition:**
I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)

Measures information shared between variables.

**Properties:**
- I(X;Y) ≥ 0
- I(X;Y) = 0 if X and Y are independent
- I(X;Y) = H(X) if Y completely determines X

### Coding Theory

**Source Coding:**
Compressing information to reduce storage/transmission requirements.

**Shannon's Source Coding Theorem:**
Optimal code length approaches entropy H(X).

**Huffman Coding:**
Optimal prefix-free code for given symbol probabilities.

**Channel Coding:**
Adding redundancy to detect/correct errors.

**Shannon's Channel Coding Theorem:**
Reliable communication possible at rates up to channel capacity.

**Applications:**
- Data compression
- Error correction
- Cryptography
- Machine learning

## Computational Complexity

### Complexity Classes

**Time Complexity Classes:**
- **P:** Problems solvable in polynomial time
- **NP:** Problems verifiable in polynomial time
- **NP-Complete:** Hardest problems in NP
- **NP-Hard:** At least as hard as NP-Complete
- **PSPACE:** Problems solvable in polynomial space
- **EXPTIME:** Problems solvable in exponential time

**Space Complexity Classes:**
- **L:** Logarithmic space
- **NL:** Nondeterministic logarithmic space
- **PSPACE:** Polynomial space

### Reductions

**Polynomial-Time Reduction:**
Problem A reduces to B if A can be solved using polynomial-time algorithm for B.

**Cook-Levin Theorem:**
SAT (Boolean satisfiability) is NP-Complete.

**Reduction Techniques:**
- Many-one reductions
- Turing reductions
- Karp reductions

### P vs NP Problem

**Central Question:** Does P = NP?

**Implications:**
- If P = NP: Efficient algorithms exist for all NP problems
- If P ≠ NP: Some problems are inherently difficult

**Related Problems:**
- NP vs co-NP
- P vs PSPACE
- Polynomial hierarchy

### Approximation Algorithms

**Approximation Ratio:**
For minimization: ALG(I) / OPT(I) ≤ α
For maximization: OPT(I) / ALG(I) ≤ α

**PTAS:** Polynomial-Time Approximation Scheme
**FPTAS:** Fully Polynomial-Time Approximation Scheme

**Inapproximability Results:**
Some problems cannot be approximated within certain ratios unless P = NP.

## Formal Methods

### Formal Specification

**Purpose:**
Precise, unambiguous description of system behavior using mathematical notation.

**Benefits:**
- Early error detection
- Clear requirements
- Verification and validation
- Documentation

**Specification Languages:**
- Z notation
- VDM (Vienna Development Method)
- Alloy
- TLA+ (Temporal Logic of Actions)

### Model Checking

**Concept:**
Automatically verify that system model satisfies specified properties.

**Temporal Logic:**
- **LTL:** Linear Temporal Logic
- **CTL:** Computation Tree Logic
- **CTL*:** Combines LTL and CTL

**Model Checking Process:**
1. Create system model
2. Specify properties in temporal logic
3. Run model checker
4. Analyze counterexamples if properties fail

**State Space Explosion:**
Number of states grows exponentially with system size.

**Mitigation Techniques:**
- Abstraction
- Symmetry reduction
- Partial order reduction
- Symbolic model checking

### Program Verification

**Hoare Logic:**
{P} S {Q}
If precondition P holds and statement S executes, then postcondition Q holds.

**Verification Conditions:**
Logical formulas that must be proven for program correctness.

**Loop Invariants:**
Properties that remain true throughout loop execution.

**Weakest Precondition:**
Weakest condition that ensures postcondition after statement execution.

**Applications:**
- Safety-critical systems
- Security protocols
- Compiler optimization
- Software testing

## Interview Questions

**Q: Explain the difference between P and NP complexity classes.**

A: P contains problems solvable in polynomial time by deterministic algorithms. NP contains problems where solutions can be verified in polynomial time. P ⊆ NP, but whether P = NP is unknown. If P ≠ NP, some problems are inherently difficult to solve but easy to verify.

**Q: What is the significance of NP-Completeness?**

A: NP-Complete problems are the hardest in NP - if any NP-Complete problem has polynomial solution, then P = NP. They're equivalent under polynomial reductions. Examples include SAT, Traveling Salesman, and Graph Coloring. Understanding NP-Completeness helps identify when to use approximation algorithms.

**Q: Explain the Pigeonhole Principle and its applications.**

A: If n items are placed in m containers with n > m, at least one container has multiple items. Applications: proving hash collisions exist, birthday paradox, proving duplicate elements in arrays, load balancing analysis. Fundamental for existence proofs in computer science.

**Q: What is entropy in information theory?**

A: Entropy H(X) = -Σ P(x)log₂P(x) measures average information content or uncertainty in random variable. Maximum when outcomes equally likely, zero when certain. Applications: data compression (optimal code length approaches entropy), machine learning (decision trees), cryptography (measuring randomness).

**Q: Explain mathematical induction and its variants.**

A: Induction proves statements for all natural numbers: prove base case P(1), then P(k) → P(k+1). Strong induction assumes P(1)...P(k) to prove P(k+1). Structural induction works on recursive structures. Essential for algorithm correctness proofs, recurrence relations, and data structure properties.

---

[← Back to Operating Systems](../10-computer-science/12-operating-systems-theory.md) | [Next: Computational Theory →](./02-computational-theory.md)
