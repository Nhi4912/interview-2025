# Computational Theory
## Foundations of Computation and Formal Languages

**English:** Computational theory studies the fundamental capabilities and limitations of computation, exploring what can be computed, how efficiently, and the mathematical models that describe computational processes.

**Tiếng Việt:** Lý thuyết tính toán nghiên cứu các khả năng và giới hạn cơ bản của tính toán, khám phá những gì có thể được tính toán, hiệu quả như thế nào, và các mô hình toán học mô tả các quá trình tính toán.

## Table of Contents
1. [Models of Computation](#models-of-computation)
2. [Formal Languages](#formal-languages)
3. [Regular Languages](#regular-languages)
4. [Context-Free Languages](#context-free-languages)
5. [Turing Machines](#turing-machines)
6. [Computability Theory](#computability-theory)
7. [Decidability](#decidability)
8. [Recursive Function Theory](#recursive-function-theory)
9. [Lambda Calculus](#lambda-calculus)
10. [Complexity Hierarchies](#complexity-hierarchies)

## Models of Computation

### Abstract Machines

**Definition:** Mathematical models that capture the essential features of computation while abstracting away implementation details.

**Hierarchy of Computational Models:**
1. **Finite Automata:** Limited memory, recognize regular languages
2. **Pushdown Automata:** Stack memory, recognize context-free languages
3. **Linear Bounded Automata:** Tape bounded by input length
4. **Turing Machines:** Unlimited memory, most powerful model

**Church-Turing Thesis:**
Any effectively calculable function can be computed by a Turing machine. This thesis establishes Turing machines as the standard model for computability.

**Equivalence of Models:**
Many different models of computation are equivalent in power:
- Turing machines
- Lambda calculus
- Recursive functions
- Random access machines
- Post systems

### Computational Paradigms

**Imperative Computation:**
Sequence of commands that change program state.
- Based on von Neumann architecture
- Variables represent memory locations
- Assignment changes state

**Functional Computation:**
Computation as evaluation of mathematical functions.
- No side effects
- Referential transparency
- Based on lambda calculus

**Logic Programming:**
Computation as logical inference.
- Facts and rules
- Query resolution
- Prolog as example

**Parallel Computation:**
Multiple processes executing simultaneously.
- Shared memory vs. message passing
- Synchronization challenges
- Scalability issues

**Quantum Computation:**
Exploits quantum mechanical phenomena.
- Superposition and entanglement
- Quantum algorithms (Shor's, Grover's)
- Potential exponential speedups

## Formal Languages

### Language Hierarchy

**Chomsky Hierarchy:**
Classification of formal languages by generative power.

**Type 0 - Unrestricted Grammars:**
- Most general form
- Recognized by Turing machines
- Include all recursively enumerable languages

**Type 1 - Context-Sensitive Grammars:**
- Productions: αAβ → αγβ where |γ| ≥ 1
- Recognized by linear bounded automata
- Polynomial space complexity

**Type 2 - Context-Free Grammars:**
- Productions: A → γ
- Recognized by pushdown automata
- Foundation for programming language syntax

**Type 3 - Regular Grammars:**
- Productions: A → aB or A → a
- Recognized by finite automata
- Simplest and most restricted

### Grammar Formalism

**Grammar Definition:**
G = (V, Σ, R, S) where:
- V: Set of variables (non-terminals)
- Σ: Set of terminals
- R: Set of production rules
- S: Start symbol

**Derivation:**
Sequence of rule applications to generate strings.
- **Leftmost derivation:** Always replace leftmost non-terminal
- **Rightmost derivation:** Always replace rightmost non-terminal
- **Parse tree:** Graphical representation of derivation

**Ambiguity:**
Grammar is ambiguous if some string has multiple parse trees.
- Inherent ambiguity: Cannot be made unambiguous
- Operator precedence resolves arithmetic ambiguity
- Associativity rules resolve grouping ambiguity

### Language Operations

**Closure Properties:**
Operations that preserve language classes.

**Regular Languages closed under:**
- Union: L₁ ∪ L₂
- Concatenation: L₁L₂
- Kleene star: L*
- Intersection: L₁ ∩ L₂
- Complement: Σ* - L
- Difference: L₁ - L₂

**Context-Free Languages closed under:**
- Union
- Concatenation
- Kleene star
- NOT closed under intersection or complement

**Pumping Lemmas:**
Tools to prove languages are NOT in certain classes.

**Regular Pumping Lemma:**
For regular language L, there exists p such that any string s ∈ L with |s| ≥ p can be written as s = xyz where:
- |xy| ≤ p
- |y| > 0
- xy^i z ∈ L for all i ≥ 0

**Context-Free Pumping Lemma:**
For context-free language L, there exists p such that any string s ∈ L with |s| ≥ p can be written as s = uvwxy where:
- |vwx| ≤ p
- |vx| > 0
- uv^i wx^i y ∈ L for all i ≥ 0

## Regular Languages

### Finite Automata

**Deterministic Finite Automaton (DFA):**
M = (Q, Σ, δ, q₀, F) where:
- Q: Finite set of states
- Σ: Input alphabet
- δ: Q × Σ → Q (transition function)
- q₀: Start state
- F ⊆ Q: Accept states

**Properties:**
- Exactly one transition per state-symbol pair
- Deterministic computation
- Efficient recognition (linear time)

**Nondeterministic Finite Automaton (NFA):**
- δ: Q × Σ → P(Q) (power set)
- Multiple possible transitions
- ε-transitions allowed
- Equivalent in power to DFA

**NFA to DFA Conversion:**
Subset construction algorithm:
1. Each DFA state represents set of NFA states
2. Start with ε-closure of NFA start state
3. For each symbol, compute reachable states
4. Continue until no new states generated

**Minimization:**
Reduce DFA to minimum number of states.
1. Remove unreachable states
2. Merge equivalent states using table-filling algorithm
3. Resulting DFA is unique (up to state renaming)

### Regular Expressions

**Definition:**
Concise notation for describing regular languages.

**Basic Operations:**
- Union: r₁ + r₂
- Concatenation: r₁r₂
- Kleene star: r*
- Parentheses for grouping

**Extended Operations:**
- One or more: r⁺ = rr*
- Optional: r? = ε + r
- Character classes: [a-z], [0-9]
- Complement: ~r

**Equivalence:**
Regular expressions and finite automata are equivalent:
- Every regular expression can be converted to NFA
- Every DFA can be converted to regular expression

**Applications:**
- Text processing and pattern matching
- Lexical analysis in compilers
- Input validation
- Search engines
- Bioinformatics (DNA sequence analysis)

### Decision Problems

**Membership Problem:**
Given string w and language L, is w ∈ L?
- Decidable for regular languages
- Linear time algorithm using DFA

**Emptiness Problem:**
Is L = ∅?
- Decidable: Check if any accept state is reachable

**Equivalence Problem:**
Are L₁ = L₂?
- Decidable: Check if (L₁ - L₂) ∪ (L₂ - L₁) = ∅

**Universality Problem:**
Is L = Σ*?
- Decidable: Check if complement is empty

## Context-Free Languages

### Context-Free Grammars

**Normal Forms:**

**Chomsky Normal Form (CNF):**
All productions have form:
- A → BC (two non-terminals)
- A → a (single terminal)

**Benefits:**
- Simplifies parsing algorithms
- CYK algorithm requires CNF
- Theoretical analysis easier

**Greibach Normal Form (GNF):**
All productions have form:
- A → aα where a is terminal, α is string of non-terminals

**Benefits:**
- Left-recursive elimination
- Predictive parsing
- Linear time parsing possible

### Pushdown Automata

**Definition:**
PDA = (Q, Σ, Γ, δ, q₀, Z₀, F) where:
- Q: States
- Σ: Input alphabet
- Γ: Stack alphabet
- δ: Q × (Σ ∪ {ε}) × Γ → P(Q × Γ*)
- q₀: Start state
- Z₀: Initial stack symbol
- F: Accept states

**Acceptance:**
- **Final state:** Input consumed and in accept state
- **Empty stack:** Input consumed and stack empty
- Both methods equivalent in power

**Deterministic vs. Nondeterministic:**
- DPDA: At most one transition per configuration
- NPDA: Multiple transitions possible
- NPDA more powerful than DPDA
- DPDA recognizes deterministic context-free languages

### Parsing Algorithms

**Top-Down Parsing:**
Start from start symbol, derive input string.

**Recursive Descent:**
- Each non-terminal becomes a function
- Backtracking may be needed
- LL(k) grammars avoid backtracking

**LL Parsing:**
- Left-to-right scan, leftmost derivation
- Predictive parsing table
- No left recursion allowed

**Bottom-Up Parsing:**
Start from input, reduce to start symbol.

**LR Parsing:**
- Left-to-right scan, rightmost derivation
- Shift-reduce parsing
- More powerful than LL

**LR Variants:**
- **SLR:** Simple LR
- **LALR:** Look-ahead LR
- **CLR:** Canonical LR

**CYK Algorithm:**
Dynamic programming approach for CNF grammars.
- Time complexity: O(n³|G|)
- Space complexity: O(n²|V|)
- Works for any context-free grammar in CNF

### Applications

**Programming Languages:**
- Syntax specification
- Parser generation
- Compiler construction
- IDE syntax highlighting

**Natural Language Processing:**
- Grammar checking
- Syntactic analysis
- Machine translation
- Speech recognition

**Markup Languages:**
- XML parsing
- HTML validation
- Configuration files
- Data serialization

## Turing Machines

### Turing Machine Model

**Definition:**
TM = (Q, Σ, Γ, δ, q₀, qaccept, qreject) where:
- Q: Finite set of states
- Σ: Input alphabet
- Γ: Tape alphabet (Σ ⊂ Γ)
- δ: Q × Γ → Q × Γ × {L, R}
- q₀: Start state
- qaccept: Accept state
- qreject: Reject state

**Tape:**
- Infinite in both directions
- Initially contains input
- Blank symbol for empty cells
- Read/write head can move left or right

**Computation:**
- Start in q₀ with head at leftmost input symbol
- Follow transition function
- Accept if reach qaccept
- Reject if reach qreject or loop forever

### Variants of Turing Machines

**Multi-Tape Turing Machine:**
- Multiple tapes with independent heads
- More convenient for algorithm design
- Equivalent to single-tape TM

**Nondeterministic Turing Machine:**
- Multiple possible transitions
- Accepts if any computation path accepts
- Equivalent to deterministic TM (Church-Turing thesis)

**Universal Turing Machine:**
- Takes description of TM M and input w
- Simulates M on w
- Foundation of stored-program computers

**Linear Bounded Automaton:**
- Tape limited to input length
- Recognizes context-sensitive languages
- Less powerful than general TM

### Turing Machine Programming

**Basic Operations:**
- Copy data
- Shift data left/right
- Compare values
- Arithmetic operations
- Subroutines

**Encoding:**
- Represent complex data structures
- Multiple tracks on tape
- State encoding schemes

**Complexity:**
- Time: Number of steps
- Space: Number of tape cells used
- Relationship between time and space

## Computability Theory

### Computable Functions

**Definition:**
Function f is computable if there exists a Turing machine that computes f(x) for all x in domain.

**Total vs. Partial Functions:**
- **Total:** Defined for all inputs
- **Partial:** May be undefined for some inputs

**Primitive Recursive Functions:**
- Built from basic functions using composition and recursion
- Always total
- Examples: addition, multiplication, exponentiation

**General Recursive Functions:**
- Add minimization operator
- May be partial
- Equivalent to Turing-computable functions

### Recursively Enumerable Languages

**Definition:**
Language L is recursively enumerable (RE) if there exists a TM that accepts all strings in L.

**Properties:**
- TM may loop on strings not in L
- Semi-decidable
- Closure under union, intersection, concatenation

**Recursive Languages:**
- Decidable: TM halts on all inputs
- Closure under complement
- Proper subset of RE languages

**Relationship:**
- Recursive ⊂ RE
- co-RE: Complements of RE languages
- Recursive = RE ∩ co-RE

## Decidability

### Decidable Problems

**Definition:**
Problem is decidable if there exists an algorithm that always terminates with correct answer.

**Examples:**
- DFA acceptance
- Regular expression equivalence
- Context-free grammar membership
- Arithmetic expressions

**Church-Turing Thesis:**
Intuitive notion of "algorithm" corresponds to Turing machine.

### Undecidable Problems

**Halting Problem:**
Given TM M and input w, does M halt on w?

**Proof of Undecidability:**
Diagonalization argument:
1. Assume halting problem is decidable
2. Construct TM that contradicts assumption
3. Conclude halting problem is undecidable

**Other Undecidable Problems:**
- TM acceptance problem
- TM equivalence problem
- Post Correspondence Problem
- Hilbert's 10th problem (Diophantine equations)

### Reduction Techniques

**Mapping Reduction:**
Problem A reduces to B if:
- Function f computes from instance of A to instance of B
- x ∈ A iff f(x) ∈ B

**Turing Reduction:**
- Use oracle for B to solve A
- More general than mapping reduction

**Applications:**
- Prove undecidability
- Compare problem difficulty
- Classify problems

## Recursive Function Theory

### Primitive Recursive Functions

**Base Functions:**
- Zero function: Z(x) = 0
- Successor: S(x) = x + 1
- Projection: P^n_i(x₁,...,xₙ) = xᵢ

**Composition:**
If g, h₁,...,hₘ are primitive recursive, then:
f(x) = g(h₁(x),...,hₘ(x)) is primitive recursive

**Primitive Recursion:**
If g and h are primitive recursive, then:
- f(0,x) = g(x)
- f(n+1,x) = h(n,f(n,x),x)

**Examples:**
- Addition: add(0,y) = y, add(x+1,y) = S(add(x,y))
- Multiplication: mult(0,y) = 0, mult(x+1,y) = add(mult(x,y),y)
- Exponentiation: exp(0,y) = 1, exp(x+1,y) = mult(exp(x,y),y)

### General Recursive Functions

**Minimization Operator:**
μy[f(x,y) = 0] = smallest y such that f(x,y) = 0

**Properties:**
- May not terminate
- Allows partial functions
- Equivalent to Turing-computable

**Ackermann Function:**
- Not primitive recursive
- Total and computable
- Grows faster than any primitive recursive function

### Kleene Normal Form

**Theorem:**
Every partial recursive function can be written as:
f(x) = U(μy[T(e,x,y)])

Where:
- e: Index of function
- T: Predicate testing computation
- U: Extracts result

**Applications:**
- Enumeration of computable functions
- Recursion theorem
- Fixed-point theorems

## Lambda Calculus

### Syntax and Semantics

**Terms:**
- Variables: x, y, z
- Abstraction: λx.M
- Application: M N

**Free and Bound Variables:**
- Bound: Variable bound by λ
- Free: Not bound by any λ

**α-Conversion:**
Rename bound variables:
λx.M ≡ λy.M[x:=y] if y not free in M

**β-Reduction:**
Function application:
(λx.M) N → M[x:=N]

**η-Conversion:**
Extensionality:
λx.(M x) ≡ M if x not free in M

### Church Encodings

**Booleans:**
- TRUE = λx.λy.x
- FALSE = λx.λy.y
- IF = λp.λa.λb.p a b

**Natural Numbers (Church Numerals):**
- 0 = λf.λx.x
- 1 = λf.λx.f x
- 2 = λf.λx.f (f x)
- SUCC = λn.λf.λx.f (n f x)

**Arithmetic:**
- ADD = λm.λn.λf.λx.m f (n f x)
- MULT = λm.λn.λf.m (n f)
- EXP = λm.λn.n m

**Pairs:**
- PAIR = λx.λy.λf.f x y
- FIRST = λp.p TRUE
- SECOND = λp.p FALSE

### Recursion and Fixed Points

**Y Combinator:**
Y = λf.(λx.f (x x)) (λx.f (x x))

**Property:**
Y f = f (Y f)

**Recursive Functions:**
Define factorial using Y:
FACT = Y (λf.λn.IF (ISZERO n) 1 (MULT n (f (PRED n))))

**Turing Combinator:**
Alternative fixed-point combinator:
Θ = (λx.λy.y (x x y)) (λx.λy.y (x x y))

### Typed Lambda Calculus

**Simply Typed Lambda Calculus:**
- Types: Base types and function types
- Type checking prevents some errors
- Strongly normalizing

**Polymorphic Lambda Calculus (System F):**
- Type variables and quantification
- More expressive
- Foundation for ML, Haskell

**Dependent Types:**
- Types depend on values
- Very expressive
- Used in proof assistants

## Complexity Hierarchies

### Time Hierarchy Theorem

**Statement:**
For time-constructible functions f and g with f(n) log f(n) = o(g(n)):
DTIME(f(n)) ⊊ DTIME(g(n))

**Implications:**
- More time allows solving more problems
- Strict hierarchy of complexity classes
- P ⊊ EXPTIME

**Proof Technique:**
Diagonalization over all TMs running in time f(n).

### Space Hierarchy Theorem

**Statement:**
For space-constructible functions f and g with f(n) = o(g(n)):
DSPACE(f(n)) ⊊ DSPACE(g(n))

**Implications:**
- More space allows solving more problems
- L ⊊ PSPACE
- PSPACE ⊊ EXPSPACE

**Savitch's Theorem:**
NSPACE(f(n)) ⊆ DSPACE(f(n)²)

### Polynomial Hierarchy

**Definition:**
- Σ₀ᴾ = Π₀ᴾ = P
- Σₖ₊₁ᴾ = NPᐩᵏᴾ
- Πₖ₊₁ᴾ = co-Σₖ₊₁ᴾ

**Properties:**
- P ⊆ NP ⊆ Σ₂ᴾ ⊆ ... ⊆ PSPACE
- If Σₖᴾ = Πₖᴾ, hierarchy collapses to level k
- If P = NP, hierarchy collapses to P

**Complete Problems:**
Each level has complete problems characterizing its difficulty.

### Oracle Machines

**Definition:**
Turing machine with access to oracle for some language.

**Relativization:**
- Pᴬ: P with oracle for A
- NPᴬ: NP with oracle for A

**Baker-Gill-Solovay Theorem:**
There exist oracles A and B such that:
- Pᴬ = NPᴬ
- Pᴮ ≠ NPᴮ

**Implications:**
Techniques that relativize cannot solve P vs NP.

## Interview Questions

**Q: Explain the Church-Turing thesis and its significance.**

A: The Church-Turing thesis states that any effectively calculable function can be computed by a Turing machine. It's significant because it establishes TMs as the standard model for computability, connects intuitive notion of "algorithm" with formal definition, and implies equivalence of various computational models (TMs, lambda calculus, recursive functions).

**Q: What is the halting problem and why is it undecidable?**

A: The halting problem asks whether a given TM halts on a given input. It's undecidable by diagonalization: assume a TM H decides halting, construct TM D that does opposite of what H predicts for D itself, leading to contradiction. This proves fundamental limits of computation - some problems have no algorithmic solution.

**Q: Explain the difference between recursive and recursively enumerable languages.**

A: Recursive languages are decidable - a TM always halts with correct answer. Recursively enumerable (RE) languages are semi-decidable - a TM accepts strings in the language but may loop on strings not in it. Recursive languages are closed under complement; RE languages are not. Recursive = RE ∩ co-RE.

**Q: What is the pumping lemma and how is it used?**

A: The pumping lemma is a property that all regular (or context-free) languages must satisfy. It's used to prove languages are NOT regular/context-free by contradiction: assume language is regular, apply pumping lemma to get contradiction. Example: {0ⁿ1ⁿ | n ≥ 0} is not regular because pumping would create unequal 0s and 1s.

**Q: Explain the Y combinator and its purpose.**

A: The Y combinator is a fixed-point combinator in lambda calculus: Y f = f (Y f). It enables recursion in lambda calculus without explicit self-reference. Given a function that takes itself as argument, Y produces the recursive version. Essential for showing lambda calculus is Turing-complete despite having no built-in recursion mechanism.

---

[← Back to CS Fundamentals](./01-computer-science-fundamentals.md) | [Next: Type Theory →](./03-type-theory.md)
