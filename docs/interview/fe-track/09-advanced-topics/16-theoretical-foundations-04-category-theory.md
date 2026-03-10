# Category Theory
## Abstract Mathematics for Computer Science

**English:** Category theory provides a unified framework for understanding mathematical structures and their relationships, offering powerful abstractions for functional programming, type systems, and software design patterns.

**Tiếng Việt:** Lý thuyết phạm trù cung cấp một khung thống nhất để hiểu các cấu trúc toán học và mối quan hệ của chúng, cung cấp các trừu tượng mạnh mẽ cho lập trình hàm, hệ thống kiểu và các mẫu thiết kế phần mềm.

## Table of Contents
1. [Basic Concepts](#basic-concepts)
2. [Universal Constructions](#universal-constructions)
3. [Functors](#functors)
4. [Natural Transformations](#natural-transformations)
5. [Monads](#monads)
6. [Adjunctions](#adjunctions)
7. [Limits and Colimits](#limits-and-colimits)
8. [Monoidal Categories](#monoidal-categories)
9. [Enriched Categories](#enriched-categories)
10. [Applications in Programming](#applications-in-programming)

## Basic Concepts

### Categories

**Definition:**
A category C consists of:
- Objects: Ob(C)
- Morphisms: For each pair of objects A, B, a set Hom(A,B) of morphisms f: A → B
- Composition: For f: A → B and g: B → C, composition g ∘ f: A → C
- Identity: For each object A, identity morphism id_A: A → A

**Axioms:**
1. **Associativity:** h ∘ (g ∘ f) = (h ∘ g) ∘ f
2. **Identity:** f ∘ id_A = f = id_B ∘ f for f: A → B

**Examples:**
- **Set:** Objects are sets, morphisms are functions
- **Grp:** Objects are groups, morphisms are group homomorphisms
- **Top:** Objects are topological spaces, morphisms are continuous functions
- **Hask:** Objects are Haskell types, morphisms are functions

### Morphisms

**Isomorphism:**
f: A → B is an isomorphism if there exists g: B → A such that:
- g ∘ f = id_A
- f ∘ g = id_B

**Monomorphism (Monic):**
f: A → B is monic if for all g, h: C → A:
f ∘ g = f ∘ h implies g = h

Left-cancellable. Generalizes injective functions.

**Epimorphism (Epic):**
f: A → B is epic if for all g, h: B → C:
g ∘ f = h ∘ f implies g = h

Right-cancellable. Generalizes surjective functions.

**Endomorphism:**
f: A → A (same source and target)

**Automorphism:**
Isomorphism f: A → A

### Special Objects

**Initial Object:**
Object 0 such that for every object A, there exists unique morphism 0 → A.

**Examples:**
- Empty set in Set
- Void type in programming
- False in logic

**Terminal Object:**
Object 1 such that for every object A, there exists unique morphism A → 1.

**Examples:**
- Singleton set in Set
- Unit type in programming
- True in logic

**Zero Object:**
Object that is both initial and terminal.

## Universal Constructions

### Products

**Definition:**
Product of A and B is an object A × B with projections:
- π₁: A × B → A
- π₂: A × B → B

Such that for any object C with morphisms f: C → A and g: C → B, there exists unique h: C → A × B making the diagram commute.

**Universal Property:**
```
    C
   /|\\
  / | \\
 f  h  g
 /  |  \\
A ← A×B → B
   π₁  π₂
```

**Examples:**
- Cartesian product in Set
- Product types in programming (tuples)
- Logical AND

### Coproducts

**Definition:**
Coproduct of A and B is an object A + B with injections:
- ι₁: A → A + B
- ι₂: B → A + B

Such that for any object C with morphisms f: A → C and g: B → C, there exists unique h: A + B → C making the diagram commute.

**Universal Property:**
```
A → A+B ← B
ι₁  |  ι₂
 \\  h  /
  \\ | /
    C
```

**Examples:**
- Disjoint union in Set
- Sum types in programming (Either)
- Logical OR

### Exponentials

**Definition:**
Exponential B^A is an object with evaluation morphism:
eval: B^A × A → B

Such that for any f: C × A → B, there exists unique curry(f): C → B^A making the diagram commute.

**Curry-Uncurry Isomorphism:**
Hom(C × A, B) ≅ Hom(C, B^A)

**Examples:**
- Function spaces in Set
- Function types in programming
- Implication in logic

## Functors

### Definition

**Functor F: C → D:**
- Maps objects: F(A) for each object A in C
- Maps morphisms: F(f): F(A) → F(B) for each f: A → B
- Preserves composition: F(g ∘ f) = F(g) ∘ F(f)
- Preserves identity: F(id_A) = id_{F(A)}

**Covariant vs. Contravariant:**
- **Covariant:** Preserves direction of morphisms
- **Contravariant:** Reverses direction: F(f): F(B) → F(A)

### Examples

**List Functor:**
- Objects: Types
- Morphisms: Functions
- F(A) = List A
- F(f) = map f

**Maybe Functor:**
- F(A) = Maybe A = Just A | Nothing
- F(f) Nothing = Nothing
- F(f) (Just x) = Just (f x)

**Reader Functor:**
- F(A) = R → A for fixed R
- F(f) = (∘ f) (post-composition)

**Contravariant Functor Example:**
- Predicate functor: F(A) = A → Bool
- F(f) = (∘ f) (pre-composition)

### Functor Laws

**Identity:**
fmap id = id

**Composition:**
fmap (g ∘ f) = fmap g ∘ fmap f

**Verification:**
Must prove these laws for each functor instance.

### Bifunctors

**Definition:**
Functor of two arguments: F: C × D → E

**Examples:**
- Product: (×): Set × Set → Set
- Sum: (+): Set × Set → Set
- Function: (→): Set^op × Set → Set

**Bimap:**
bimap: (a → b) → (c → d) → F a c → F b d

## Natural Transformations

### Definition

**Natural Transformation η: F ⇒ G:**
For functors F, G: C → D, a family of morphisms:
η_A: F(A) → G(A) for each object A

Such that for every f: A → B, the following diagram commutes:
```
F(A) → F(B)
 |      |
η_A    η_B
 |      |
G(A) → G(B)
```

**Naturality Condition:**
G(f) ∘ η_A = η_B ∘ F(f)

### Examples

**List to Maybe:**
```
safeHead: List A → Maybe A
safeHead [] = Nothing
safeHead (x:xs) = Just x
```

Natural transformation from List to Maybe.

**Reverse:**
```
reverse: List A → List A
```

Natural transformation from List to itself.

**Flatten:**
```
flatten: List (List A) → List A
```

Natural transformation from List ∘ List to List.

### Functor Category

**Objects:** Functors F: C → D
**Morphisms:** Natural transformations

**Composition:**
Vertical composition of natural transformations.

**Identity:**
Identity natural transformation: id_F: F ⇒ F

## Monads

### Definition

**Monad:**
A monad on category C is:
- Endofunctor M: C → C
- Natural transformation η: Id ⇒ M (unit/return)
- Natural transformation μ: M ∘ M ⇒ M (join/flatten)

**Monad Laws:**
1. **Left identity:** μ ∘ η_M = id_M
2. **Right identity:** μ ∘ M(η) = id_M
3. **Associativity:** μ ∘ μ_M = μ ∘ M(μ)

### Kleisli Category

**Objects:** Objects of C
**Morphisms:** Kleisli arrows f: A → M(B)
**Composition:** f >=> g = μ ∘ M(g) ∘ f
**Identity:** η

**Bind Operation:**
(>>=): M A → (A → M B) → M B
m >>= f = μ(M(f)(m))

### Common Monads

**Maybe Monad:**
- Represents optional values
- Short-circuits on Nothing
- Models partial functions

**List Monad:**
- Represents nondeterminism
- Bind is concatMap
- Models multiple results

**State Monad:**
- Encapsulates stateful computation
- S → (A, S)
- Models mutable state

**IO Monad:**
- Encapsulates side effects
- Separates pure and impure code
- Models real-world interactions

**Reader Monad:**
- Encapsulates environment
- R → A
- Models dependency injection

**Writer Monad:**
- Accumulates output
- (A, W) with monoid W
- Models logging

### Monad Transformers

**Definition:**
Monad transformer t takes monad m and produces monad t m.

**Examples:**
- MaybeT: Adds Maybe to any monad
- StateT: Adds State to any monad
- ReaderT: Adds Reader to any monad

**Lifting:**
lift: m a → t m a

Lifts computation from inner monad.

## Adjunctions

### Definition

**Adjunction F ⊣ G:**
Functors F: C → D and G: D → C are adjoint if:
Hom_D(F(A), B) ≅ Hom_C(A, G(B))

Naturally in A and B.

**Unit and Counit:**
- Unit: η: Id_C ⇒ G ∘ F
- Counit: ε: F ∘ G ⇒ Id_D

**Triangle Identities:**
- ε_F ∘ F(η) = id_F
- G(ε) ∘ η_G = id_G

### Examples

**Free-Forgetful:**
- Free functor F: Set → Grp
- Forgetful functor U: Grp → Set
- F ⊣ U

**Curry-Uncurry:**
- (× A) ⊣ (^A)
- Currying is natural isomorphism

**Product-Diagonal:**
- Diagonal Δ: C → C × C
- Product ×: C × C → C
- × ⊣ Δ

### Monads from Adjunctions

**Theorem:**
Every adjunction F ⊣ G gives rise to monad G ∘ F.

**Unit:** η: Id ⇒ G ∘ F
**Multiplication:** μ = G(ε)F: G ∘ F ∘ G ∘ F ⇒ G ∘ F

**Significance:**
Many monads arise from adjunctions, providing deeper understanding.

## Limits and Colimits

### Limits

**Definition:**
Limit of diagram D: J → C is object lim D with morphisms π_j: lim D → D(j) such that for any cone with apex C, there exists unique morphism C → lim D.

**Examples:**
- **Terminal object:** Limit of empty diagram
- **Product:** Limit of discrete diagram
- **Equalizer:** Limit of parallel pair
- **Pullback:** Limit of cospan

**Equalizer:**
Given f, g: A → B, equalizer is:
```
E → A ⇉ B
    f
    g
```

Where E → A is universal among morphisms making f and g equal.

### Colimits

**Definition:**
Colimit of diagram D: J → C is object colim D with morphisms ι_j: D(j) → colim D such that for any cocone with apex C, there exists unique morphism colim D → C.

**Examples:**
- **Initial object:** Colimit of empty diagram
- **Coproduct:** Colimit of discrete diagram
- **Coequalizer:** Colimit of parallel pair
- **Pushout:** Colimit of span

**Coequalizer:**
Given f, g: A → B, coequalizer is:
```
A ⇉ B → Q
f
g
```

Where B → Q is universal among morphisms identifying f and g.

### Completeness

**Complete Category:**
Has all small limits.

**Cocomplete Category:**
Has all small colimits.

**Examples:**
- Set is complete and cocomplete
- Hask is complete and cocomplete (ignoring ⊥)

## Monoidal Categories

### Definition

**Monoidal Category:**
Category C with:
- Bifunctor ⊗: C × C → C (tensor product)
- Object I (unit object)
- Natural isomorphisms:
  - α: (A ⊗ B) ⊗ C ≅ A ⊗ (B ⊗ C) (associator)
  - λ: I ⊗ A ≅ A (left unitor)
  - ρ: A ⊗ I ≅ A (right unitor)

**Coherence Conditions:**
Pentagon and triangle diagrams commute.

### Examples

**Cartesian Monoidal:**
- ⊗ = × (product)
- I = 1 (terminal object)

**Cocartesian Monoidal:**
- ⊗ = + (coproduct)
- I = 0 (initial object)

**Endofunctor Category:**
- ⊗ = ∘ (composition)
- I = Id (identity functor)

### Monoids in Monoidal Categories

**Monoid Object:**
Object M with:
- μ: M ⊗ M → M (multiplication)
- η: I → M (unit)

Satisfying associativity and unit laws.

**Examples:**
- Monoid in (Set, ×, 1) is ordinary monoid
- Monoid in (End(C), ∘, Id) is monad
- Monoid in (Type, ×, Unit) is monoid type

**Burrito Analogy:**
"A monad is just a monoid in the category of endofunctors, what's the problem?"

## Enriched Categories

### V-Enriched Categories

**Definition:**
For monoidal category V, a V-enriched category C has:
- Objects
- Hom-objects: Hom(A,B) ∈ Ob(V)
- Composition: Hom(B,C) ⊗ Hom(A,B) → Hom(A,C)
- Identity: I → Hom(A,A)

**Examples:**
- Set-enriched: Ordinary categories
- Poset-enriched: Preorders
- Ab-enriched: Additive categories
- Cat-enriched: 2-categories

### Metric Spaces as Enriched Categories

**[0,∞]-Enriched:**
- Objects: Points
- Hom(x,y): Distance from x to y
- Composition: Triangle inequality
- Identity: Zero distance

**Lawvere Metric Spaces:**
Generalization of metric spaces using enriched categories.

### 2-Categories

**Definition:**
Category enriched over Cat:
- Objects
- 1-morphisms (functors)
- 2-morphisms (natural transformations)

**Examples:**
- Cat: Categories, functors, natural transformations
- Spans: Objects, spans, span morphisms

## Applications in Programming

### Functional Programming

**Functor:**
```haskell
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

**Applicative:**
```haskell
class Functor f => Applicative f where
  pure :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b
```

**Monad:**
```haskell
class Applicative m => Monad m where
  return :: a -> m a
  (>>=) :: m a -> (a -> m b) -> m b
```

### Lens and Optics

**Lens:**
Composable getters and setters.

**Category-Theoretic View:**
- Lens as functor
- Prism as partial isomorphism
- Traversal as applicative functor

**Profunctor Optics:**
Unified framework using profunctors.

### Free Constructions

**Free Monad:**
```haskell
data Free f a
  = Pure a
  | Free (f (Free f a))
```

Monad generated by functor f.

**Applications:**
- DSL interpretation
- Effect systems
- Program transformation

### Recursion Schemes

**Catamorphism (Fold):**
```haskell
cata :: Functor f => (f a -> a) -> Fix f -> a
```

**Anamorphism (Unfold):**
```haskell
ana :: Functor f => (a -> f a) -> a -> Fix f
```

**Hylomorphism:**
```haskell
hylo :: Functor f => (f b -> b) -> (a -> f a) -> a -> b
```

**Category Theory:**
Initial algebras and final coalgebras.

## Interview Questions

**Q: What is a functor and why is it useful in programming?**

A: A functor is a structure-preserving map between categories. In programming, it's a type constructor with a map operation that preserves composition and identity. Functors are useful because they allow applying functions inside contexts (Maybe, List, etc.) while preserving structure, enabling generic programming and composition.

**Q: Explain the relationship between monads and adjunctions.**

A: Every adjunction F ⊣ G gives rise to a monad G ∘ F. The unit of the adjunction becomes the monad's return, and the counit provides the join operation. This shows monads aren't arbitrary - they arise naturally from adjunctions, which are fundamental categorical structures. Many common monads (State, Reader, Free) come from adjunctions.

**Q: What is the Curry-Howard-Lambek correspondence?**

A: It's a three-way correspondence between logic, type theory, and category theory:
- Propositions ↔ Types ↔ Objects
- Proofs ↔ Programs ↔ Morphisms
- Logical connectives ↔ Type constructors ↔ Categorical constructions
This unifies three fields and shows deep connections between computation, logic, and mathematics.

**Q: Explain natural transformations and give a programming example.**

A: A natural transformation is a structure-preserving map between functors. In programming, it's a polymorphic function that works uniformly across all types. Example: `safeHead :: [a] -> Maybe a` is natural because it doesn't inspect or manipulate the elements - it works the same way regardless of type. Naturality ensures predictable behavior.

**Q: What are monad transformers and why are they needed?**

A: Monad transformers combine multiple monadic effects. Since monads don't compose automatically, transformers provide a way to stack effects (e.g., MaybeT (State s) a combines optionality with state). They're needed because real programs often require multiple effects simultaneously, and transformers provide a systematic way to combine them while maintaining monad laws.

---

[← Back to Type Theory](./03-type-theory.md) | [Next: Logic and Proof Theory →](./05-logic-proof-theory.md)
