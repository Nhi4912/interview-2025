# TypeScript - Complete Mastery Guide
## From Basics to Advanced Type System

[← Back to Generics](./03-generics-deep-dive.md) | [Next: React with TypeScript →](../03-react/01-fundamentals.md)

---

## 📋 Table of Contents

1. [TypeScript Fundamentals](#typescript-fundamentals)
2. [Type System Deep Dive](#type-system-deep-dive)
3. [Advanced Types](#advanced-types)
4. [Generics Mastery](#generics-mastery)
5. [Utility Types](#utility-types)
6. [Type Guards & Narrowing](#type-guards-narrowing)
7. [Conditional Types](#conditional-types)
8. [Mapped Types](#mapped-types)
9. [Template Literal Types](#template-literal-types)
10. [Real-World Patterns](#real-world-patterns)
11. [Interview Questions](#interview-questions)
12. [Practice Problems](#practice-problems)

---

## 🎯 Learning Objectives

Master TypeScript:
- Understand the type system deeply
- Use advanced type features effectively
- Create type-safe applications
- Implement complex type patterns
- Optimize type performance
- Avoid common pitfalls

---

## TypeScript Fundamentals

### What is TypeScript?

**English Definition:** TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript, adding static type checking and modern features.

**Định nghĩa (Tiếng Việt):** TypeScript là một superset có kiểu mạnh của JavaScript, biên dịch thành JavaScript thuần túy, thêm kiểm tra kiểu tĩnh và các tính năng hiện đại.


### TypeScript Mind Map

```
TypeScript Type System
│
├── Basic Types
│   ├── Primitive Types (string, number, boolean, etc.)
│   ├── Object Types
│   ├── Array Types
│   ├── Tuple Types
│   └── Enum Types
│
├── Advanced Types
│   ├── Union Types
│   ├── Intersection Types
│   ├── Literal Types
│   ├── Type Aliases
│   └── Interface Types
│
├── Type Operations
│   ├── Type Guards
│   ├── Type Assertions
│   ├── Type Narrowing
│   └── Type Predicates
│
├── Generic Types
│   ├── Generic Functions
│   ├── Generic Classes
│   ├── Generic Constraints
│   └── Generic Inference
│
├── Utility Types
│   ├── Partial, Required, Readonly
│   ├── Pick, Omit, Exclude
│   ├── Record, Extract
│   └── ReturnType, Parameters
│
└── Advanced Features
    ├── Conditional Types
    ├── Mapped Types
    ├── Template Literal Types
    └── Recursive Types
```

---

## Type System Deep Dive

### Understanding Type Systems

**Theory:** A type system is a logical system comprising a set of rules that assigns a property called "type" to various constructs in a program. TypeScript uses a structural type system (also called duck typing), where type compatibility is determined by the structure of types rather than their explicit declarations.

**Structural vs Nominal Typing:**

**Structural Typing (TypeScript):**
- Types are compatible if their structure matches
- Focus on "shape" of data
- More flexible but can lead to unexpected compatibility

**Nominal Typing (Java, C++):**
- Types are compatible only if explicitly declared
- Focus on type names and declarations
- More strict but requires explicit relationships

**Type Soundness:**

TypeScript's type system is intentionally unsound in certain areas for pragmatic reasons:
- Allows gradual adoption in JavaScript projects
- Balances type safety with developer productivity
- Provides escape hatches (any, type assertions) when needed

**Type Inference:**

TypeScript's type inference engine analyzes code to automatically determine types without explicit annotations. The inference algorithm:
1. Examines variable initialization
2. Analyzes function return statements
3. Considers control flow
4. Propagates types through expressions
5. Widens or narrows types based on context

### Variance in TypeScript

**Theory:** Variance describes how subtyping relationships between complex types relate to subtyping relationships between their components.

**Covariance:**
- Type relationship preserved in the same direction
- Arrays in TypeScript are covariant
- Return types are covariant

**Contravariance:**
- Type relationship reversed
- Function parameters are contravariant (in strict mode)

**Invariance:**
- No subtyping relationship
- Mutable structures should be invariant for safety

**Bivariance:**
- Accepts both covariant and contravariant relationships
- TypeScript's default for function parameters (non-strict)
- Can lead to unsoundness

**Example Theory:**

If `Dog` is a subtype of `Animal`:
- `Array<Dog>` is a subtype of `Array<Animal>` (covariance)
- `(animal: Animal) => void` is a subtype of `(dog: Dog) => void` (contravariance)

### Type Widening and Narrowing

**Type Widening:**

Theory: TypeScript automatically widens types from specific to more general when it determines the initial type is too narrow for practical use.

**Widening Scenarios:**
1. **Literal to Primitive:** `let x = "hello"` → type is `string`, not `"hello"`
2. **Null/Undefined:** `let x = null` → type is `any` (without strictNullChecks)
3. **Empty Arrays:** `let arr = []` → type is `any[]`
4. **Object Literals:** Properties widen to their general types

**Preventing Widening:**
- Use `const` instead of `let`
- Add explicit type annotations
- Use `as const` assertion
- Enable strict mode

**Type Narrowing:**

Theory: TypeScript narrows types from general to more specific based on control flow analysis and type guards.

**Narrowing Mechanisms:**
1. **Type Guards:** Runtime checks that refine types
2. **Control Flow Analysis:** Tracks type changes through code paths
3. **Discriminated Unions:** Uses common properties to distinguish types
4. **Truthiness Checks:** Narrows based on boolean context
5. **Equality Checks:** Narrows based on comparisons
6. **instanceof/typeof:** Built-in type guards

**Control Flow Analysis Theory:**

TypeScript's control flow analysis:
- Tracks all possible code paths
- Maintains type information for each path
- Merges types at join points
- Handles unreachable code
- Respects type guards and assertions

### Assignability and Compatibility

**Theory:** TypeScript determines if one type can be assigned to another based on structural compatibility rules.

**Assignability Rules:**

1. **Primitive Compatibility:**
   - Exact match required
   - Literal types assignable to their base type
   - `never` assignable to everything
   - Everything assignable to `any` and `unknown`

2. **Object Compatibility:**
   - Target must have all required properties of source
   - Extra properties allowed (structural typing)
   - Property types must be compatible
   - Methods follow function compatibility rules

3. **Function Compatibility:**
   - Parameter count: Target can have fewer parameters
   - Parameter types: Contravariant (in strict mode)
   - Return type: Covariant
   - `this` parameter: Must be compatible

4. **Union/Intersection Compatibility:**
   - Union: Assignable if assignable to any member
   - Intersection: Must be assignable to all members

**Excess Property Checking:**

Theory: TypeScript performs stricter checks on object literals to catch common errors.

**When Applied:**
- Object literals assigned to variables
- Object literals passed as arguments
- Object literals in return statements

**Why It Exists:**
- Catches typos in property names
- Prevents accidental extra properties
- Enforces stricter object shape matching

**Bypassing:**
- Assign to intermediate variable
- Use type assertion
- Add index signature to target type

---

## Advanced Types

### Union Types Theory

**Definition:** A union type represents a value that can be one of several types. It's the type-level equivalent of the logical OR operation.

**Theoretical Foundation:**

Union types form a **lattice structure** in type theory:
- **Join Operation:** Union creates the least upper bound
- **Subtyping:** Each member is a subtype of the union
- **Distributivity:** Operations distribute over unions

**Type Algebra:**
```
A | B | A = A | B (idempotent)
A | B = B | A (commutative)
(A | B) | C = A | (B | C) (associative)
A | never = A (identity)
A | unknown = unknown (absorption)
```

**Discriminated Unions:**

Theory: A discriminated union (also called tagged union or algebraic data type) uses a common property (discriminant) to distinguish between union members.

**Properties:**
- **Exhaustiveness:** Compiler ensures all cases handled
- **Type Safety:** Automatic narrowing based on discriminant
- **Pattern Matching:** Similar to functional programming languages

**Use Cases:**
- State machines
- Action types in Redux
- API response types
- Error handling

### Intersection Types Theory

**Definition:** An intersection type combines multiple types into one, requiring a value to satisfy all constituent types simultaneously.

**Theoretical Foundation:**

Intersection types represent the **meet operation** in type lattice:
- **Meet Operation:** Intersection creates the greatest lower bound
- **Subtyping:** Intersection is a subtype of each member
- **Contravariance:** Useful for combining constraints

**Type Algebra:**
```
A & B & A = A & B (idempotent)
A & B = B & A (commutative)
(A & B) & C = A & (B & C) (associative)
A & unknown = A (identity)
A & never = never (absorption)
```

**Intersection vs Union:**
- Union: "Either/Or" - value can be any member type
- Intersection: "Both/And" - value must satisfy all types

**Practical Implications:**
- Combining object types merges properties
- Conflicting primitive types result in `never`
- Useful for mixins and trait composition

### Literal Types Theory

**Definition:** Literal types represent exact values rather than general types. They're the most specific types possible.

**Type Hierarchy:**

```
unknown (top type)
  ↓
any
  ↓
string, number, boolean (general types)
  ↓
"hello", 42, true (literal types)
  ↓
never (bottom type)
```

**Theoretical Properties:**

1. **Singleton Types:** Each literal type has exactly one value
2. **Subtyping:** Literal types are subtypes of their base type
3. **Widening:** Literals widen to base types in mutable contexts
4. **Narrowing:** Base types narrow to literals through guards

**Template Literal Types:**

Theory: Template literal types apply string manipulation at the type level, enabling powerful string type transformations.

**Capabilities:**
- String concatenation at type level
- Pattern matching with unions
- Case transformations (Uppercase, Lowercase, etc.)
- String splitting and joining

**Use Cases:**
- API route typing
- CSS property names
- Event name generation
- Database column names

---

## Generics Mastery

### Generic Theory

**Definition:** Generics provide a way to create reusable components that work with multiple types while maintaining type safety. They're parametric polymorphism in type theory.

**Theoretical Foundation:**

**Parametric Polymorphism:**
- Functions/types parameterized by other types
- Same implementation works for all type arguments
- Type parameters act as variables in type expressions

**Type Parameters:**
- Abstract over types
- Bound at call site or instantiation
- Can have constraints (bounded quantification)
- Support variance annotations

**Generic Constraints Theory:**

Constraints limit type parameters to types satisfying certain conditions:

**Constraint Types:**
1. **Extends Constraint:** Type must be subtype of bound
2. **Keyof Constraint:** Type must be key of another type
3. **Conditional Constraint:** Type depends on condition
4. **Multiple Constraints:** Intersection of constraints

**Constraint Satisfaction:**
- Checked at instantiation time
- Enables safe operations on type parameters
- Provides IntelliSense and autocomplete
- Prevents invalid type arguments

### Generic Inference Theory

**Definition:** Type inference for generics automatically determines type arguments based on usage context.

**Inference Algorithm:**

1. **Candidate Collection:**
   - Gather type information from arguments
   - Consider return type context
   - Analyze constraint satisfaction

2. **Unification:**
   - Find common type satisfying all uses
   - Resolve conflicts through subtyping
   - Apply variance rules

3. **Widening/Narrowing:**
   - Widen literals if needed
   - Narrow unions when possible
   - Respect explicit annotations

**Inference Priority:**
1. Explicit type arguments (highest)
2. Argument types
3. Return type context
4. Default type parameters
5. Constraint bounds (lowest)

**Inference Limitations:**

Theory: Generic inference has fundamental limitations:
- **Undecidability:** Some type relationships undecidable
- **Ambiguity:** Multiple valid inferences possible
- **Complexity:** Inference can be computationally expensive
- **Heuristics:** TypeScript uses heuristics for practical cases

### Higher-Kinded Types Theory

**Definition:** Higher-kinded types are types that abstract over type constructors, not just types.

**Kind System:**

```
* = concrete type (string, number)
* → * = type constructor (Array, Promise)
* → * → * = binary type constructor (Map, Record)
(* → *) → * = higher-kinded type
```

**TypeScript Limitations:**

TypeScript doesn't directly support higher-kinded types, but workarounds exist:
- Type-level functions using conditional types
- Encoding with interfaces and type parameters
- Simulating with mapped types

**Use Cases:**
- Functor, Monad abstractions
- Generic container operations
- Type-level programming
- Advanced library design

---

## Utility Types Theory

### Built-in Utility Types

**Theoretical Classification:**

**1. Property Modifiers:**
- `Partial<T>`: Makes all properties optional
- `Required<T>`: Makes all properties required
- `Readonly<T>`: Makes all properties readonly

**Theory:** These use mapped types to transform property modifiers systematically.

**2. Property Selection:**
- `Pick<T, K>`: Selects subset of properties
- `Omit<T, K>`: Excludes subset of properties

**Theory:** These use key remapping and conditional types for property filtering.

**3. Type Transformations:**
- `Record<K, T>`: Creates object type with specific keys
- `Exclude<T, U>`: Removes types from union
- `Extract<T, U>`: Extracts types from union

**Theory:** These leverage conditional types and distributive properties.

**4. Function Utilities:**
- `Parameters<T>`: Extracts parameter types
- `ReturnType<T>`: Extracts return type
- `ConstructorParameters<T>`: Extracts constructor parameters
- `InstanceType<T>`: Extracts instance type

**Theory:** These use conditional types with `infer` keyword for type extraction.

### Utility Type Composition

**Theory:** Utility types can be composed to create complex transformations.

**Composition Patterns:**

1. **Sequential Composition:**
   - Apply utilities in sequence
   - Each transformation builds on previous
   - Order matters for non-commutative operations

2. **Parallel Composition:**
   - Apply multiple utilities to same type
   - Combine results with intersection
   - Useful for independent transformations

3. **Conditional Composition:**
   - Choose utility based on type properties
   - Use conditional types for selection
   - Enables context-dependent transformations

**Algebraic Properties:**

Some utilities have algebraic properties:
- `Partial<Required<T>>` ≈ `T` (if T has no optional properties)
- `Pick<T, K> & Omit<T, K>` = `never` (disjoint)
- `Readonly<Readonly<T>>` = `Readonly<T>` (idempotent)

---

## Type Guards & Narrowing

### Type Guard Theory

**Definition:** Type guards are expressions that perform runtime checks to narrow types within a conditional block.

**Theoretical Foundation:**

**Refinement Types:**
- Type guards implement refinement type system
- Narrow types based on runtime predicates
- Maintain soundness through control flow

**Type Predicate Logic:**

Type predicates use logical implications:
- If predicate true → type is narrowed type
- If predicate false → type is complement
- Predicates compose with logical operators

**Type Guard Categories:**

**1. Built-in Type Guards:**
- `typeof`: Checks primitive types
- `instanceof`: Checks class instances
- `in`: Checks property existence
- Equality checks: Narrows to literal types

**2. User-Defined Type Guards:**
- Functions returning type predicates
- Custom logic for complex types
- Reusable across codebase

**3. Assertion Functions:**
- Throw if condition false
- Narrow type in subsequent code
- Useful for validation

### Control Flow Analysis Theory

**Definition:** Control flow analysis tracks how types change through different code paths.

**Analysis Phases:**

**1. Graph Construction:**
- Build control flow graph (CFG)
- Nodes represent statements
- Edges represent possible execution paths

**2. Type Propagation:**
- Assign initial types to variables
- Propagate types along edges
- Apply narrowing at conditional branches

**3. Join Points:**
- Merge types from multiple paths
- Use union for divergent types
- Maintain precision where possible

**4. Unreachable Code Detection:**
- Identify impossible paths
- Mark code after `never` type
- Warn about dead code

**Theoretical Challenges:**

**Aliasing:**
- Multiple references to same value
- Type changes through one reference
- May not reflect in others

**Mutation:**
- Type narrowing invalidated by mutation
- Requires conservative analysis
- Trade-off between precision and soundness

**Closures:**
- Captured variables in closures
- Type at capture time vs call time
- Requires careful tracking

---

## Conditional Types Theory

### Conditional Type Fundamentals

**Definition:** Conditional types select one of two possible types based on a condition expressed as a type relationship test.

**Syntax:** `T extends U ? X : Y`

**Theoretical Model:**

Conditional types implement **type-level if-then-else**:
- Condition: Type relationship test
- Branches: Two possible result types
- Evaluation: At type checking time

**Distributive Property:**

Theory: Conditional types distribute over union types when the checked type is a naked type parameter.

**Distribution Rule:**
```
(A | B) extends U ? X : Y
=
(A extends U ? X : Y) | (B extends U ? X : Y)
```

**Why Distribution Matters:**
- Enables filtering union types
- Allows per-member transformations
- Foundation for many utility types

**Preventing Distribution:**
- Wrap type parameter in tuple: `[T]`
- Use intersection: `T & {}`
- Useful when treating union as single type

### Infer Keyword Theory

**Definition:** The `infer` keyword introduces a type variable within a conditional type's extends clause, allowing pattern matching and type extraction.

**Theoretical Foundation:**

**Pattern Matching:**
- Match type structure
- Extract components
- Bind to type variables

**Unification:**
- Find type satisfying pattern
- Resolve type variables
- Handle multiple infer sites

**Inference Context:**
- Covariant positions: Infer union
- Contravariant positions: Infer intersection
- Invariant positions: Infer exact type

**Advanced Infer Patterns:**

**1. Multiple Infer:**
- Multiple type variables in pattern
- Each infers independently
- Useful for complex extractions

**2. Nested Infer:**
- Infer within inferred types
- Recursive pattern matching
- Enables deep type inspection

**3. Conditional Infer:**
- Infer in both branches
- Different patterns per branch
- Maximum flexibility

---

## Mapped Types Theory

### Mapped Type Fundamentals

**Definition:** Mapped types transform properties of an existing type systematically, creating new types based on a pattern.

**Syntax:** `{ [P in K]: T }`

**Theoretical Model:**

Mapped types implement **type-level iteration**:
- Iterate over keys
- Transform each property
- Produce new object type

**Key Remapping:**

Theory: Key remapping allows transforming property keys during mapping.

**Syntax:** `{ [P in K as NewKey]: T }`

**Capabilities:**
- Rename properties
- Filter properties (map to `never`)
- Add prefixes/suffixes
- Transform key types

**Mapping Modifiers:**

**Modifier Types:**
- `+?`: Add optional modifier
- `-?`: Remove optional modifier
- `+readonly`: Add readonly modifier
- `-readonly`: Remove readonly modifier

**Theory:** Modifiers enable systematic property transformation while preserving or changing mutability and optionality.

### Recursive Mapped Types

**Theory:** Recursive mapped types apply transformations deeply through nested structures.

**Recursion Depth:**
- TypeScript limits recursion depth
- Prevents infinite loops
- Typically 50 levels deep

**Tail Recursion:**
- Optimize recursive types
- Accumulator pattern
- Reduce stack depth

**Mutual Recursion:**
- Types reference each other
- Enables complex structures
- Requires careful design

---

## Template Literal Types Theory

### String Manipulation Types

**Definition:** Template literal types enable string manipulation at the type level, creating new string literal types from existing ones.

**Theoretical Foundation:**

**String Type Algebra:**
- Concatenation: Combine string types
- Union distribution: Apply to each member
- Pattern matching: Extract substrings

**Intrinsic String Types:**

TypeScript provides built-in string transformations:
- `Uppercase<S>`: Convert to uppercase
- `Lowercase<S>`: Convert to lowercase
- `Capitalize<S>`: Capitalize first character
- `Uncapitalize<S>`: Lowercase first character

**Theory:** These are compiler intrinsics, not implementable in user code.

### Pattern Matching with Template Literals

**Theory:** Template literal types support pattern matching through conditional types and infer.

**Pattern Syntax:**
- Literal parts: Match exactly
- Type parameters: Match any string
- Infer: Extract matched portions

**Use Cases:**
- Parse structured strings
- Extract route parameters
- Validate string formats
- Generate type-safe APIs

---

## Interview Questions

### Q1: Explain TypeScript's structural type system

**Answer:**

TypeScript uses structural typing (duck typing) where type compatibility is determined by structure, not explicit declarations.

**Key Concepts:**
- Types compatible if shapes match
- Extra properties allowed in objects
- Focuses on "what" not "who"
- Enables gradual typing

**Contrast with Nominal:**
- Nominal: Types must be explicitly related
- Structural: Types related by shape
- TypeScript: Structural for flexibility

### Q2: What is type narrowing and how does it work?

**Answer:**

Type narrowing refines types from general to specific based on runtime checks and control flow analysis.

**Mechanisms:**
- Type guards (typeof, instanceof, in)
- Truthiness checks
- Equality comparisons
- Discriminated unions
- Control flow analysis

**Theory:**
- Compiler tracks type through code paths
- Narrows at conditional branches
- Merges at join points
- Maintains soundness

### Q3: Explain variance in TypeScript

**Answer:**

Variance describes how subtyping relationships between complex types relate to their components.

**Types:**
- **Covariance:** Preserves direction (arrays, return types)
- **Contravariance:** Reverses direction (function parameters in strict mode)
- **Invariance:** No relationship (mutable structures)
- **Bivariance:** Both directions (function parameters in non-strict)

**Implications:**
- Affects type safety
- Determines assignability
- Impacts generic constraints

### Q4: What are conditional types and when to use them?

**Answer:**

Conditional types select between two types based on a type relationship test.

**Syntax:** `T extends U ? X : Y`

**Key Features:**
- Distributive over unions
- Support infer keyword
- Enable type-level logic
- Foundation for utility types

**Use Cases:**
- Type filtering
- Type extraction
- Conditional transformations
- Generic constraints

### Q5: Explain mapped types

**Answer:**

Mapped types transform properties of existing types systematically.

**Capabilities:**
- Iterate over keys
- Transform property types
- Modify property modifiers
- Remap keys

**Theory:**
- Type-level iteration
- Systematic transformations
- Preserve structure
- Enable metaprogramming

---

## Summary

### Key Theoretical Concepts

1. **Structural Type System**
   - Shape-based compatibility
   - Flexible and pragmatic
   - Enables gradual typing

2. **Type Inference**
   - Automatic type determination
   - Context-sensitive
   - Reduces annotations

3. **Variance**
   - Covariance, contravariance
   - Affects type safety
   - Important for generics

4. **Control Flow Analysis**
   - Tracks types through code
   - Enables narrowing
   - Maintains soundness

5. **Advanced Type Features**
   - Conditional types
   - Mapped types
   - Template literals
   - Enable powerful abstractions

### Best Practices

✅ **DO:**
- Understand type system deeply
- Use strict mode
- Leverage type inference
- Create reusable generic types
- Use utility types appropriately

❌ **DON'T:**
- Overuse `any`
- Ignore type errors
- Create overly complex types
- Abuse type assertions
- Neglect variance considerations

---

[← Back to Generics](./03-generics-deep-dive.md) | [Next: React with TypeScript →](../03-react/01-fundamentals.md)
