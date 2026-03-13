# Compiler Theory & Abstract Syntax Trees

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Understanding Code Compilation and Transformation

**English:** Compiler theory studies the design and implementation of compilers, which translate source code from one language to another, typically from high-level to low-level languages.

**Tiếng Việt:** Lý thuyết trình biên dịch nghiên cứu thiết kế và triển khai các trình biên dịch, chuyển đổi mã nguồn từ ngôn ngữ này sang ngôn ngữ khác, thường từ ngôn ngữ cấp cao sang ngôn ngữ cấp thấp.

## Table of Contents
1. [Compiler Architecture](#compiler-architecture)
2. [Lexical Analysis](#lexical-analysis)
3. [Syntax Analysis](#syntax-analysis)
4. [Abstract Syntax Trees](#abstract-syntax-trees)
5. [Semantic Analysis](#semantic-analysis)
6. [Code Generation](#code-generation)
7. [Optimization](#optimization)
8. [JavaScript Engines](#javascript-engines)
9. [Babel and Transpilation](#babel-and-transpilation)
10. [AST Manipulation](#ast-manipulation)

## Compiler Architecture

### Compilation Phases

```
Source Code
    ↓
┌─────────────────────┐
│  Lexical Analysis   │ → Tokens
│  (Scanner/Lexer)    │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Syntax Analysis    │ → Parse Tree
│  (Parser)           │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Semantic Analysis  │ → Annotated AST
│  (Type Checking)    │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Intermediate Code  │ → IR
│  Generation         │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Optimization       │ → Optimized IR
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Code Generation    │ → Target Code
└─────────────────────┘
    ↓
Target Code
```

### Frontend vs Backend

**Frontend (Language-Specific):**
- Lexical Analysis
- Syntax Analysis
- Semantic Analysis
- Generates IR

**Backend (Machine-Specific):**
- Optimization
- Code Generation
- Generates machine code

**Benefits:**
- Multiple frontends → One backend
- One frontend → Multiple backends
- Reusable components

## Lexical Analysis

### Tokens

**Definition:** Smallest meaningful units in source code

**Token Types:**
```javascript
// Keywords
if, else, while, for, function, const, let

// Identifiers
userName, calculateTotal, _private

// Literals
123, "hello", true, null

// Operators
+, -, *, /, =, ==, ===

// Punctuation
(, ), {, }, [, ], ;, ,
```

### Lexer Example

**Input:**
```javascript
const x = 10 + 20;
```

**Tokens:**
```javascript
[
  { type: 'KEYWORD', value: 'const' },
  { type: 'IDENTIFIER', value: 'x' },
  { type: 'OPERATOR', value: '=' },
  { type: 'NUMBER', value: '10' },
  { type: 'OPERATOR', value: '+' },
  { type: 'NUMBER', value: '20' },
  { type: 'PUNCTUATION', value: ';' }
]
```

### Regular Expressions

**Token Patterns:**
```javascript
const tokenPatterns = {
  // Keywords
  KEYWORD: /\b(const|let|var|if|else|while|for|function)\b/,
  
  // Identifiers
  IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/,
  
  // Numbers
  NUMBER: /\d+(\.\d+)?/,
  
  // Strings
  STRING: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/,
  
  // Operators
  OPERATOR: /[+\-*/%=<>!&|]+/,
  
  // Punctuation
  PUNCTUATION: /[(){}\[\];,.:]/,
  
  // Whitespace (skip)
  WHITESPACE: /\s+/
};
```

### Simple Lexer Implementation

```javascript
class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.tokens = [];
  }
  
  tokenize() {
    while (this.position < this.input.length) {
      let matched = false;
      
      for (const [type, pattern] of Object.entries(tokenPatterns)) {
        const regex = new RegExp('^' + pattern.source);
        const match = this.input.slice(this.position).match(regex);
        
        if (match) {
          if (type !== 'WHITESPACE') {
            this.tokens.push({
              type,
              value: match[0],
              position: this.position
            });
          }
          this.position += match[0].length;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        throw new Error(`Unexpected character at position ${this.position}`);
      }
    }
    
    return this.tokens;
  }
}

// Usage
const lexer = new Lexer('const x = 10 + 20;');
const tokens = lexer.tokenize();
console.log(tokens);
```

## Syntax Analysis

### Context-Free Grammars

**BNF (Backus-Naur Form):**
```
<expression> ::= <term> | <expression> "+" <term> | <expression> "-" <term>
<term>       ::= <factor> | <term> "*" <factor> | <term> "/" <factor>
<factor>     ::= <number> | "(" <expression> ")"
<number>     ::= <digit> | <number> <digit>
<digit>      ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

**Example:**
```
Expression: 2 + 3 * 4

Parse:
<expression>
  → <term>
  → <term> "+" <term>
  → <factor> "+" <term>
  → <number> "+" <term>
  → 2 "+" <term>
  → 2 "+" <term> "*" <factor>
  → 2 "+" <factor> "*" <factor>
  → 2 "+" <number> "*" <number>
  → 2 "+" 3 "*" 4
```

### Parsing Techniques

**Top-Down Parsing (Recursive Descent):**
```javascript
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }
  
  // expression → term (('+' | '-') term)*
  parseExpression() {
    let left = this.parseTerm();
    
    while (this.match('+', '-')) {
      const operator = this.previous();
      const right = this.parseTerm();
      left = {
        type: 'BinaryExpression',
        operator: operator.value,
        left,
        right
      };
    }
    
    return left;
  }
  
  // term → factor (('*' | '/') factor)*
  parseTerm() {
    let left = this.parseFactor();
    
    while (this.match('*', '/')) {
      const operator = this.previous();
      const right = this.parseFactor();
      left = {
        type: 'BinaryExpression',
        operator: operator.value,
        left,
        right
      };
    }
    
    return left;
  }
  
  // factor → number | '(' expression ')'
  parseFactor() {
    if (this.match('NUMBER')) {
      return {
        type: 'Literal',
        value: parseFloat(this.previous().value)
      };
    }
    
    if (this.match('(')) {
      const expr = this.parseExpression();
      this.consume(')', "Expected ')' after expression");
      return expr;
    }
    
    throw new Error('Expected expression');
  }
  
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  
  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().value === type || this.peek().type === type;
  }
  
  advance() {
    if (!this.isAtEnd()) this.position++;
    return this.previous();
  }
  
  peek() {
    return this.tokens[this.position];
  }
  
  previous() {
    return this.tokens[this.position - 1];
  }
  
  isAtEnd() {
    return this.position >= this.tokens.length;
  }
  
  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }
}
```

**Bottom-Up Parsing (Shift-Reduce):**
```
Input: 2 + 3 * 4

Stack          Input          Action
------         ------         ------
$              2 + 3 * 4 $    Shift
$ 2            + 3 * 4 $      Reduce (2 → factor → term → expr)
$ expr         + 3 * 4 $      Shift
$ expr +       3 * 4 $        Shift
$ expr + 3     * 4 $          Reduce (3 → factor → term)
$ expr + term  * 4 $          Shift
$ expr + term *  4 $          Shift
$ expr + term * 4  $          Reduce (4 → factor)
$ expr + term * factor $      Reduce (term * factor → term)
$ expr + term  $              Reduce (expr + term → expr)
$ expr         $              Accept
```

## Abstract Syntax Trees

### AST Structure

**Source Code:**
```javascript
const x = 10 + 20;
```

**AST:**
```javascript
{
  type: 'Program',
  body: [
    {
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: {
            type: 'Identifier',
            name: 'x'
          },
          init: {
            type: 'BinaryExpression',
            operator: '+',
            left: {
              type: 'Literal',
              value: 10
            },
            right: {
              type: 'Literal',
              value: 20
            }
          }
        }
      ]
    }
  ]
}
```

**Visual Representation:**
```
Program
  └── VariableDeclaration (const)
        └── VariableDeclarator
              ├── Identifier (x)
              └── BinaryExpression (+)
                    ├── Literal (10)
                    └── Literal (20)
```

### Complex AST Example

**Source Code:**
```javascript
function add(a, b) {
  return a + b;
}
```

**AST:**
```javascript
{
  type: 'Program',
  body: [
    {
      type: 'FunctionDeclaration',
      id: {
        type: 'Identifier',
        name: 'add'
      },
      params: [
        {
          type: 'Identifier',
          name: 'a'
        },
        {
          type: 'Identifier',
          name: 'b'
        }
      ],
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ReturnStatement',
            argument: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    }
  ]
}
```

### AST Node Types

**Statements:**
```javascript
// ExpressionStatement
x + 1;

// VariableDeclaration
const x = 10;

// FunctionDeclaration
function foo() {}

// IfStatement
if (condition) { }

// WhileStatement
while (condition) { }

// ReturnStatement
return value;
```

**Expressions:**
```javascript
// BinaryExpression
a + b

// UnaryExpression
!value

// CallExpression
foo(arg)

// MemberExpression
obj.property

// ArrowFunctionExpression
(x) => x * 2

// ConditionalExpression
condition ? true : false
```

## Semantic Analysis

### Type Checking

**Static Type Checking:**
```typescript
// TypeScript example
function add(a: number, b: number): number {
  return a + b;
}

add(1, 2);      // ✓ Valid
add("1", "2");  // ✗ Type error
```

**Type Inference:**
```typescript
// Type inferred as number
let x = 10;

// Type inferred as (a: number, b: number) => number
const add = (a: number, b: number) => a + b;

// Type inferred as string
let result = add(1, 2).toString();
```

### Symbol Tables

**Purpose:** Track variable declarations and scopes

**Example:**
```javascript
// Source code
function outer() {
  const x = 10;
  
  function inner() {
    const y = 20;
    console.log(x + y);
  }
  
  inner();
}
```

**Symbol Table:**
```javascript
{
  global: {
    outer: { type: 'function', scope: 'global' }
  },
  'outer': {
    x: { type: 'const', value: 10, scope: 'outer' },
    inner: { type: 'function', scope: 'outer' }
  },
  'outer.inner': {
    y: { type: 'const', value: 20, scope: 'outer.inner' }
  }
}
```

### Scope Analysis

**Lexical Scoping:**
```javascript
const x = 'global';

function outer() {
  const x = 'outer';
  
  function inner() {
    const x = 'inner';
    console.log(x);  // 'inner'
  }
  
  inner();
  console.log(x);    // 'outer'
}

outer();
console.log(x);      // 'global'
```

**Scope Chain:**
```
inner scope: { x: 'inner' }
  ↓
outer scope: { x: 'outer', inner: function }
  ↓
global scope: { x: 'global', outer: function }
```

## Code Generation

### Intermediate Representation

**Three-Address Code:**
```
Source: x = a + b * c

IR:
t1 = b * c
t2 = a + t1
x = t2
```

**Static Single Assignment (SSA):**
```
Source:
x = 1
x = x + 2
x = x * 3

SSA:
x₁ = 1
x₂ = x₁ + 2
x₃ = x₂ * 3
```

### Code Generation Example

**AST to JavaScript:**
```javascript
class CodeGenerator {
  generate(node) {
    switch (node.type) {
      case 'Program':
        return node.body.map(stmt => this.generate(stmt)).join('\n');
      
      case 'VariableDeclaration':
        return node.declarations
          .map(decl => `${node.kind} ${this.generate(decl)}`)
          .join(', ') + ';';
      
      case 'VariableDeclarator':
        return `${this.generate(node.id)} = ${this.generate(node.init)}`;
      
      case 'BinaryExpression':
        return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;
      
      case 'Identifier':
        return node.name;
      
      case 'Literal':
        return JSON.stringify(node.value);
      
      case 'FunctionDeclaration':
        const params = node.params.map(p => this.generate(p)).join(', ');
        const body = this.generate(node.body);
        return `function ${this.generate(node.id)}(${params}) ${body}`;
      
      case 'BlockStatement':
        const statements = node.body.map(stmt => this.generate(stmt)).join('\n  ');
        return `{\n  ${statements}\n}`;
      
      case 'ReturnStatement':
        return `return ${this.generate(node.argument)};`;
      
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}
```

## Optimization

### Optimization Levels

**Constant Folding:**
```javascript
// Before
const x = 2 + 3 * 4;

// After
const x = 14;
```

**Dead Code Elimination:**
```javascript
// Before
function foo() {
  const x = 10;
  const y = 20;  // Never used
  return x;
}

// After
function foo() {
  const x = 10;
  return x;
}
```

**Common Subexpression Elimination:**
```javascript
// Before
const a = b * c + g;
const d = b * c * e;

// After
const temp = b * c;
const a = temp + g;
const d = temp * e;
```

**Loop Optimization:**

**Loop Invariant Code Motion:**
```javascript
// Before
for (let i = 0; i < n; i++) {
  const limit = array.length * 2;  // Invariant
  if (i < limit) {
    process(i);
  }
}

// After
const limit = array.length * 2;
for (let i = 0; i < n; i++) {
  if (i < limit) {
    process(i);
  }
}
```

**Loop Unrolling:**
```javascript
// Before
for (let i = 0; i < 4; i++) {
  sum += array[i];
}

// After
sum += array[0];
sum += array[1];
sum += array[2];
sum += array[3];
```

### Inlining

**Function Inlining:**
```javascript
// Before
function add(a, b) {
  return a + b;
}

const result = add(10, 20);

// After (inlined)
const result = 10 + 20;
```

**Benefits:**
- Eliminates function call overhead
- Enables further optimizations
- Reduces code size (sometimes)

**Drawbacks:**
- Increases code size (sometimes)
- May hurt cache performance
- Harder to debug

## JavaScript Engines

### V8 Architecture

**Pipeline:**
```
JavaScript Source
    ↓
Parser → AST
    ↓
Ignition (Interpreter) → Bytecode
    ↓
TurboFan (Optimizing Compiler) → Machine Code
```

**Ignition (Interpreter):**
- Generates bytecode from AST
- Fast startup
- Lower memory usage
- Collects profiling data

**TurboFan (JIT Compiler):**
- Compiles hot functions to machine code
- Uses profiling data for optimization
- Speculative optimization
- Deoptimization when assumptions fail

### Hidden Classes

**Concept:** V8 creates hidden classes for objects with same structure

**Example:**
```javascript
// Same hidden class
const obj1 = { x: 1, y: 2 };
const obj2 = { x: 3, y: 4 };

// Different hidden classes
const obj3 = { x: 1, y: 2 };
const obj4 = { y: 2, x: 1 };  // Different property order

// Transition
const obj5 = { x: 1 };
obj5.y = 2;  // Transitions to new hidden class
```

**Optimization:**
```javascript
// Good: Same hidden class
function Point(x, y) {
  this.x = x;
  this.y = y;
}

const p1 = new Point(1, 2);
const p2 = new Point(3, 4);

// Bad: Different hidden classes
const p3 = { x: 1, y: 2 };
const p4 = { y: 4, x: 3 };
```

### Inline Caching

**Concept:** Cache property access locations

**Example:**
```javascript
function getX(obj) {
  return obj.x;  // Cached after first call
}

const obj = { x: 1, y: 2 };
getX(obj);  // Cache: obj.x at offset 0
getX(obj);  // Use cached offset
```

**Monomorphic (Fast):**
```javascript
// Always same type
getX({ x: 1, y: 2 });
getX({ x: 3, y: 4 });
```

**Polymorphic (Slower):**
```javascript
// Multiple types
getX({ x: 1, y: 2 });
getX({ x: 3, z: 4 });  // Different structure
```

**Megamorphic (Slowest):**
```javascript
// Too many types
getX({ x: 1 });
getX({ x: 2, y: 3 });
getX({ x: 4, y: 5, z: 6 });
getX({ x: 7, y: 8, z: 9, w: 10 });
// ... many more
```

## Babel and Transpilation

### Babel Pipeline

```
ES6+ Code
    ↓
Parse → AST
    ↓
Transform → Modified AST
    ↓
Generate → ES5 Code
```

### Babel Plugins

**Plugin Example:**
```javascript
// Plugin: Transform arrow functions
module.exports = function({ types: t }) {
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        // Convert arrow function to regular function
        const func = t.functionExpression(
          null,
          path.node.params,
          t.blockStatement([
            t.returnStatement(path.node.body)
          ])
        );
        
        path.replaceWith(func);
      }
    }
  };
};
```

**Input:**
```javascript
const add = (a, b) => a + b;
```

**Output:**
```javascript
const add = function(a, b) {
  return a + b;
};
```

### Common Transformations

**Template Literals:**
```javascript
// Input
const greeting = `Hello, ${name}!`;

// Output
const greeting = "Hello, " + name + "!";
```

**Destructuring:**
```javascript
// Input
const { x, y } = obj;

// Output
const x = obj.x;
const y = obj.y;
```

**Spread Operator:**
```javascript
// Input
const arr = [...arr1, ...arr2];

// Output
const arr = [].concat(arr1, arr2);
```

**Async/Await:**
```javascript
// Input
async function fetchData() {
  const response = await fetch(url);
  return response.json();
}

// Output (simplified)
function fetchData() {
  return regeneratorRuntime.async(function(context) {
    while (1) {
      switch (context.prev = context.next) {
        case 0:
          context.next = 2;
          return regeneratorRuntime.awrap(fetch(url));
        case 2:
          response = context.sent;
          return context.abrupt("return", response.json());
      }
    }
  });
}
```

## AST Manipulation

### Traversing AST

**Visitor Pattern:**
```javascript
const traverse = require('@babel/traverse').default;

traverse(ast, {
  // Visit all identifiers
  Identifier(path) {
    console.log('Identifier:', path.node.name);
  },
  
  // Visit all function declarations
  FunctionDeclaration(path) {
    console.log('Function:', path.node.id.name);
  },
  
  // Visit binary expressions
  BinaryExpression(path) {
    console.log('Operator:', path.node.operator);
  }
});
```

### Modifying AST

**Replacing Nodes:**
```javascript
traverse(ast, {
  BinaryExpression(path) {
    // Replace a + b with b + a
    if (path.node.operator === '+') {
      const { left, right } = path.node;
      path.node.left = right;
      path.node.right = left;
    }
  }
});
```

**Adding Nodes:**
```javascript
traverse(ast, {
  FunctionDeclaration(path) {
    // Add console.log at start of function
    const logStatement = t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.identifier('console'),
          t.identifier('log')
        ),
        [t.stringLiteral('Function called')]
      )
    );
    
    path.node.body.body.unshift(logStatement);
  }
});
```

**Removing Nodes:**
```javascript
traverse(ast, {
  DebuggerStatement(path) {
    // Remove all debugger statements
    path.remove();
  }
});
```

### Practical Applications

**Code Minification:**
```javascript
// Rename variables to shorter names
traverse(ast, {
  Scope(path) {
    const bindings = path.scope.bindings;
    let counter = 0;
    
    for (const name in bindings) {
      const newName = `_${counter++}`;
      path.scope.rename(name, newName);
    }
  }
});
```

**Code Coverage:**
```javascript
// Instrument code for coverage
traverse(ast, {
  Statement(path) {
    // Add coverage tracking before each statement
    const coverageCall = t.expressionStatement(
      t.callExpression(
        t.identifier('__coverage__'),
        [t.numericLiteral(path.node.loc.start.line)]
      )
    );
    
    path.insertBefore(coverageCall);
  }
});
```

**Dead Code Elimination:**
```javascript
traverse(ast, {
  IfStatement(path) {
    // Remove if (false) branches
    if (t.isBooleanLiteral(path.node.test, { value: false })) {
      if (path.node.alternate) {
        path.replaceWith(path.node.alternate);
      } else {
        path.remove();
      }
    }
  }
});
```

## Interview Questions

**Q: Explain the difference between a compiler and an interpreter.**

A: A compiler translates entire source code to machine code before execution (C, C++). An interpreter executes code line-by-line without prior translation (Python, JavaScript). Modern JavaScript engines use JIT compilation, combining both approaches for performance.

**Q: What is an Abstract Syntax Tree?**

A: An AST is a tree representation of source code structure, where each node represents a construct in the code. It's created during parsing and used for analysis, transformation, and code generation. Unlike parse trees, ASTs omit syntactic details like parentheses.

**Q: How does V8 optimize JavaScript?**

A: V8 uses Ignition (interpreter) for fast startup and TurboFan (JIT compiler) for optimization. It creates hidden classes for objects, uses inline caching for property access, performs speculative optimization based on profiling, and deoptimizes when assumptions fail.

**Q: What is the purpose of Babel?**

A: Babel transpiles modern JavaScript (ES6+) to older versions (ES5) for browser compatibility. It parses code to AST, transforms it using plugins, and generates compatible code. It also supports JSX, TypeScript, and custom transformations.

**Q: Explain constant folding and dead code elimination.**

A: Constant folding evaluates constant expressions at compile time (2 + 3 becomes 5). Dead code elimination removes code that never executes or whose results are never used. Both reduce code size and improve performance.

---

[← Back to Memory Management](./06-memory-management-js.md) | [Next: Concurrency Theory →](./08-concurrency-js.md)
