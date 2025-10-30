# Type Theory
## Foundations of Type Systems and Formal Verification

**English:** Type theory provides a formal framework for classifying values and expressions, ensuring program correctness through static analysis, and serving as a foundation for programming language design and formal verification.

**Tiếng Việt:** Lý thuyết kiểu cung cấp một khung hình thức để phân loại các giá trị và biểu thức, đảm bảo tính đúng đắn của chương trình thông qua phân tích tĩnh, và phục vụ như nền tảng cho thiết kế ngôn ngữ lập trình và xác minh hình thức.

## Table of Contents
1. [Foundations of Type Theory](#foundations-of-type-theory)
2. [Simply Typed Lambda Calculus](#simply-typed-lambda-calculus)
3. [Polymorphism](#polymorphism)
4. [Dependent Types](#dependent-types)
5. [Subtyping and Inheritance](#subtyping-and-inheritance)
6. [Type Inference](#type-inference)
7. [Linear Types](#linear-types)
8. [Effect Systems](#effect-systems)
9. [Curry-Howard Correspondence](#curry-howard-correspondence)
10. [Advanced Type Systems](#advanced-type-systems)

## Foundations of Type Theory

### Historical Context

**Origins:**
- Bertrand Russell's type theory (1903) to avoid paradoxes
- Alonzo Church's simply typed lambda calculus (1940)
- Per Martin-Löf's intuitionistic type theory (1972)
- Modern programming language type systems

**Motivations:**
- Prevent runtime errors
- Enable compiler optimizations
- Document program behavior
- Support formal verification
- Guide program design

### Basic Concepts

**Types as Sets:**
A type can be viewed as a set of values.
- Int: {..., -1, 0, 1, 2, ...}
- Bool: {true, false}
- String: All possible strings

**Types as Propositions:**
Curry-Howard correspondence: types are logical propositions, programs are proofs.

**Type Judgments:**
Γ ⊢ e : τ

Reads: "In context Γ, expression e has type τ"

**Context:**
Γ = x₁:τ₁, x₂:τ₂, ..., xₙ:τₙ

Maps variables to their types.

### Type Safety

**Progress:**
Well-typed expressions either are values or can take a step.

**Preservation:**
If e : τ and e → e', then e' : τ

**Type Soundness:**
Progress + Preservation = "Well-typed programs don't go wrong"

**Static vs. Dynamic Typing:**
- **Static:** Types checked at compile time
- **Dynamic:** Types checked at runtime
- **Gradual:** Mix of both

**Strong vs. Weak Typing:**
- **Strong:** Type errors always detected
- **Weak:** Some type errors may go undetected

## Simply Typed Lambda Calculus

### Syntax and Typing Rules

**Types:**
τ ::= B | τ₁ → τ₂

Where B is a base type (Int, Bool, etc.)

**Terms:**
e ::= x | λx:τ.e | e₁ e₂

**Typing Rules:**

**Variable:**
```
x:τ ∈ Γ
─────────
Γ ⊢ x : τ
```

**Abstraction:**
```
Γ, x:τ₁ ⊢ e : τ₂
──────────────────────
Γ ⊢ λx:τ₁.e : τ₁ → τ₂
```

**Application:**
```
Γ ⊢ e₁ : τ₁ → τ₂    Γ ⊢ e₂ : τ₁
────────────────────────────────
Γ ⊢ e₁ e₂ : τ₂
```

### Properties

**Strong Normalization:**
Every well-typed term has a normal form (terminates).

**Proof:**
By induction on typing derivation.

**Decidability:**
Type checking is decidable for STLC.

**Expressiveness:**
STLC is not Turing-complete (all programs terminate).

### Extensions

**Products (Pairs):**
- Type: τ₁ × τ₂
- Introduction: (e₁, e₂)
- Elimination: fst e, snd e

**Sums (Tagged Unions):**
- Type: τ₁ + τ₂
- Introduction: inl e, inr e
- Elimination: case e of inl x → e₁ | inr y → e₂

**Unit Type:**
- Type: Unit
- Value: ()
- Represents "no information"

**Empty Type:**
- Type: Void
- No values
- Represents impossibility

## Polymorphism

### Parametric Polymorphism

**System F (Polymorphic Lambda Calculus):**

**Types:**
τ ::= α | τ₁ → τ₂ | ∀α.τ

**Terms:**
e ::= x | λx:τ.e | e₁ e₂ | Λα.e | e [τ]

**Type Abstraction:**
```
Γ ⊢ e : τ    α not free in Γ
─────────────────────────────
Γ ⊢ Λα.e : ∀α.τ
```

**Type Application:**
```
Γ ⊢ e : ∀α.τ₁
──────────────────────
Γ ⊢ e [τ₂] : τ₁[α:=τ₂]
```

**Examples:**
- Identity: Λα.λx:α.x : ∀α.α → α
- Composition: Λα.Λβ.Λγ.λf:β→γ.λg:α→β.λx:α.f (g x)

**Properties:**
- Type inference is undecidable
- Strong normalization holds
- More expressive than STLC

### Ad-hoc Polymorphism

**Overloading:**
Same name, different implementations based on types.

**Type Classes (Haskell):**
```
class Eq a where
  (==) :: a -> a -> Bool
  
instance Eq Int where
  x == y = primEqInt x y
```

**Traits (Rust):**
```
trait Eq {
  fn eq(&self, other: &Self) -> bool;
}

impl Eq for i32 {
  fn eq(&self, other: &Self) -> bool {
    *self == *other
  }
}
```

**Resolution:**
Compiler selects appropriate implementation based on types.

### Bounded Quantification

**F-bounded Polymorphism:**
∀α <: τ.τ'

Type variable α bounded by type τ.

**Example:**
```
∀α <: Comparable<α>. α → α → Bool
```

**Applications:**
- Generic programming with constraints
- Object-oriented type systems
- Trait bounds in Rust

## Dependent Types

### Introduction

**Definition:**
Types that depend on values.

**Examples:**
- Vector n α: Vector of length n with elements of type α
- Matrix m n α: m×n matrix
- Fin n: Natural numbers less than n

**Motivation:**
- Express precise specifications
- Prove program properties
- Eliminate runtime checks

### Pi Types

**Dependent Function Types:**
Π(x:A).B(x)

Function from x:A to B(x), where B may depend on x.

**Non-dependent case:**
When B doesn't depend on x, reduces to A → B.

**Examples:**
- replicate : Π(n:Nat).α → Vector n α
- take : Π(n:Nat).Π(m:Nat).Vector (n+m) α → Vector n α

### Sigma Types

**Dependent Pair Types:**
Σ(x:A).B(x)

Pair where second component's type depends on first.

**Non-dependent case:**
When B doesn't depend on x, reduces to A × B.

**Examples:**
- Σ(n:Nat).Vector n α: Vector with its length
- Σ(n:Nat).Fin n → α: Finite function

### Equality Types

**Propositional Equality:**
a =_A b

Type of proofs that a equals b.

**Reflexivity:**
refl : Π(x:A). x =_A x

**Substitution:**
subst : Π(P:A→Type).Π(x y:A). x =_A y → P x → P y

**Applications:**
- Prove program correctness
- Type-safe casts
- Verified refactoring

### Proof-Relevant Mathematics

**Constructive Proofs:**
Proofs are programs that compute witnesses.

**Example - Even Numbers:**
```
data Even : Nat → Type where
  even_zero : Even 0
  even_succ_succ : Even n → Even (succ (succ n))
```

**Proof that 4 is even:**
```
even_four : Even 4
even_four = even_succ_succ (even_succ_succ even_zero)
```

## Subtyping and Inheritance

### Subtyping Relation

**Definition:**
S <: T means S is a subtype of T.

**Subsumption:**
```
Γ ⊢ e : S    S <: T
────────────────────
Γ ⊢ e : T
```

**Properties:**
- Reflexive: T <: T
- Transitive: S <: T and T <: U implies S <: U

### Structural Subtyping

**Width Subtyping (Records):**
{x:S, y:T, z:U} <: {x:S, y:T}

More fields is a subtype.

**Depth Subtyping:**
{x:S} <: {x:T} if S <: T

**Function Subtyping:**
S₁ → S₂ <: T₁ → T₂ if T₁ <: S₁ and S₂ <: T₂

Contravariant in argument, covariant in result.

### Nominal Subtyping

**Class Hierarchies:**
Subtyping based on explicit declarations.

**Example:**
```
class Animal { ... }
class Dog extends Animal { ... }
```

Dog <: Animal by declaration.

**Variance Annotations:**
- Covariant: List<Dog> <: List<Animal>
- Contravariant: Function<Animal> <: Function<Dog>
- Invariant: Array<Dog> ≮: Array<Animal>

### Intersection and Union Types

**Intersection:**
S ∧ T contains values that are both S and T.

**Properties:**
- S ∧ T <: S
- S ∧ T <: T
- Greatest lower bound

**Union:**
S ∨ T contains values that are either S or T.

**Properties:**
- S <: S ∨ T
- T <: S ∨ T
- Least upper bound

**Applications:**
- TypeScript union types
- Flow type system
- Refinement types

## Type Inference

### Hindley-Milner Type System

**Algorithm W:**
Most general unifier for type inference.

**Steps:**
1. Generate fresh type variables
2. Collect constraints from expressions
3. Solve constraints via unification
4. Generalize to polymorphic types

**Let-Polymorphism:**
```
let id = λx.x in (id 5, id true)
```

id inferred as ∀α.α → α

**Restrictions:**
- No higher-rank polymorphism
- No polymorphic recursion
- Decidable and efficient

### Constraint-Based Type Inference

**Constraint Generation:**
Generate constraints from program structure.

**Constraint Solving:**
Find substitution satisfying all constraints.

**Example:**
```
f x = x + 1
```

Constraints:
- x : α
- (+) : Int → Int → Int
- 1 : Int
- α = Int

Solution: f : Int → Int

### Bidirectional Type Checking

**Checking Mode:**
Given expression and expected type, verify compatibility.

**Inference Mode:**
Given expression, infer its type.

**Switching:**
- Annotations switch from inference to checking
- Applications switch from checking to inference

**Benefits:**
- Supports higher-rank polymorphism
- Better error messages
- More predictable

### Local Type Inference

**Type Annotations:**
Require annotations at certain positions.

**Inference:**
Infer types locally within annotated boundaries.

**Trade-offs:**
- More annotations required
- More expressive type systems supported
- Predictable inference

## Linear Types

### Resource Management

**Linear Types:**
Values must be used exactly once.

**Motivation:**
- Memory safety without garbage collection
- Safe concurrency
- Resource management (files, sockets)

**Affine Types:**
Values used at most once (may be discarded).

**Relevant Types:**
Values used at least once (may be duplicated).

### Linear Logic

**Connectives:**
- A ⊗ B: Multiplicative conjunction (tensor)
- A ⊕ B: Additive disjunction
- A ⊸ B: Linear implication
- !A: Exponential (allows duplication)

**Structural Rules:**
- Weakening: Discard unused assumptions
- Contraction: Duplicate assumptions
- Exchange: Reorder assumptions

Linear logic restricts weakening and contraction.

### Applications

**Rust Ownership:**
- Move semantics: Linear by default
- Borrowing: Temporary access
- Lifetimes: Ensure references valid

**Session Types:**
- Protocol specification
- Communication safety
- Deadlock freedom

**Quantum Computing:**
- No-cloning theorem
- Quantum state management
- Linear types natural fit

## Effect Systems

### Tracking Side Effects

**Pure vs. Impure:**
- Pure: No side effects
- Impure: May have side effects

**Effect Annotations:**
```
read : String → IO String
write : String → String → IO ()
pure : Int → Int → Int
```

**Effect Polymorphism:**
```
map : ∀α β ε. (α →^ε β) → List α →^ε List β
```

### Effect Handlers

**Algebraic Effects:**
Define effects as operations with handlers.

**Operations:**
```
effect State s where
  get : () → s
  put : s → ()
```

**Handlers:**
```
handle e with
  get () k → k state
  put s k → k () s
  return x → x
```

**Benefits:**
- Modular effect composition
- Custom control flow
- Separation of concerns

### Monads and Effect Systems

**Monad Type Class:**
```
class Monad m where
  return : α → m α
  (>>=) : m α → (α → m β) → m β
```

**Effect Encapsulation:**
- IO monad: Side effects
- State monad: Mutable state
- Maybe monad: Partiality
- List monad: Nondeterminism

**Monad Transformers:**
Stack multiple effects.

## Curry-Howard Correspondence

### Propositions as Types

**Correspondence:**
- Propositions ↔ Types
- Proofs ↔ Programs
- Proof checking ↔ Type checking

**Logical Connectives:**
- A ∧ B ↔ A × B (product)
- A ∨ B ↔ A + B (sum)
- A → B ↔ A → B (function)
- ⊤ ↔ Unit
- ⊥ ↔ Void
- ∀x.P(x) ↔ Π(x:A).B(x)
- ∃x.P(x) ↔ Σ(x:A).B(x)

### Constructive Logic

**Intuitionistic Logic:**
- Proofs are constructions
- No law of excluded middle
- No double negation elimination

**BHK Interpretation:**
Brouwer-Heyting-Kolmogorov interpretation of logical connectives.

**Proof Terms:**
Explicit representation of proofs as programs.

### Proof Assistants

**Coq:**
- Based on Calculus of Inductive Constructions
- Tactics for proof construction
- Extraction to OCaml/Haskell

**Agda:**
- Dependently typed programming language
- Interactive proof development
- Unicode syntax

**Lean:**
- Modern proof assistant
- Mathlib: Extensive mathematics library
- Metaprogramming support

**Idris:**
- General-purpose programming with dependent types
- Totality checking
- Elaborator reflection

## Advanced Type Systems

### Refinement Types

**Definition:**
{x:B | P(x)}

Base type B refined by predicate P.

**Examples:**
- {x:Int | x > 0}: Positive integers
- {x:Int | x % 2 = 0}: Even integers
- {xs:List α | length xs > 0}: Non-empty lists

**Verification:**
- SMT solvers check predicates
- Liquid types: Inference for refinements
- Applications: Security, correctness

### Gradual Typing

**Dynamic Type:**
Dyn represents dynamically typed values.

**Consistency:**
S ~ T if S and T are consistent (may be equal at runtime).

**Casts:**
Runtime checks when crossing static/dynamic boundary.

**Blame Tracking:**
Identify source of type errors.

**Languages:**
- TypeScript
- Typed Racket
- Reticulated Python

### Row Polymorphism

**Extensible Records:**
{x:Int | r}

Record with field x and additional fields r.

**Type Inference:**
Infer minimal record types.

**Applications:**
- Flexible record types
- Structural typing
- Effect systems

### Higher-Kinded Types

**Kinds:**
Types of types.

**Examples:**
- * : Kind of ordinary types
- * → * : Kind of type constructors (List, Maybe)
- (* → *) → * : Kind of higher-order type constructors

**Type Constructor Polymorphism:**
```
class Functor (f : * → *) where
  map : ∀α β. (α → β) → f α → f β
```

**Applications:**
- Generic programming
- Category theory abstractions
- Monad transformers

### Homotopy Type Theory

**Univalence Axiom:**
Equivalent types are equal.

**Higher Inductive Types:**
Types with path constructors.

**Applications:**
- Formalization of mathematics
- Synthetic homotopy theory
- Proof-relevant foundations

## Interview Questions

**Q: Explain the Curry-Howard correspondence and its significance.**

A: The Curry-Howard correspondence establishes a deep connection between logic and computation: propositions correspond to types, proofs to programs, and proof checking to type checking. This means programming and proving are the same activity. It's significant because it unifies logic and computation, enables proof assistants, and shows that type systems can express logical properties.

**Q: What are dependent types and why are they useful?**

A: Dependent types are types that depend on values, like Vector n α (vector of length n). They're useful because they allow expressing precise specifications in types (length-indexed vectors prevent out-of-bounds errors), enable compile-time verification of properties, and eliminate many runtime checks. Languages like Agda, Idris, and Coq use dependent types for verified programming.

**Q: Explain parametric polymorphism vs. ad-hoc polymorphism.**

A: Parametric polymorphism (generics) works uniformly for all types - same implementation regardless of type (e.g., List<T>). Ad-hoc polymorphism (overloading) has different implementations for different types (e.g., + for integers vs. strings). Parametric polymorphism provides stronger guarantees (free theorems) while ad-hoc polymorphism provides more flexibility.

**Q: What is the difference between structural and nominal subtyping?**

A: Structural subtyping is based on structure - if type S has all members of type T with compatible types, then S <: T (TypeScript, Go interfaces). Nominal subtyping is based on explicit declarations - subtyping must be declared (Java, C#). Structural is more flexible but can lead to accidental compatibility; nominal is more explicit but less flexible.

**Q: Explain linear types and their applications.**

A: Linear types ensure values are used exactly once, preventing duplication or discarding. They're useful for resource management (files, memory), safe concurrency (no data races), and modeling physical resources. Rust's ownership system is based on affine types (use at most once). Linear types also naturally model quantum computing where states cannot be cloned.

---

[← Back to Computational Theory](./02-computational-theory.md) | [Next: Category Theory →](./04-category-theory.md)
