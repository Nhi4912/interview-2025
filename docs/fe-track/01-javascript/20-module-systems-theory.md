# JavaScript Module Systems - Theory / Hệ Thống Module JavaScript - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**Tiki frontend bundle audit:** Bundle size is 1.8MB. Investigation reveals `import _ from 'lodash'` — 72KB of utility code, but only `_.debounce` is actually used. Switch to `import { debounce } from 'lodash-es'` — tree shaking eliminates 99% of lodash, bundle drops to 1.1MB. First Contentful Paint improves by 400ms. The root cause: lodash's default package uses CommonJS (`require`) which bundlers can't statically analyze. `lodash-es` uses ES Modules (`export`) — static structure enables dead code elimination.

**Bài học:** Module system choice isn't just syntax preference — it determines whether your bundler can tree-shake, how circular dependencies behave, and whether your library is optimized for browser delivery. ESM's static structure is the foundation of modern frontend performance tooling.

## What & Why / Cái Gì & Tại Sao

**Before ES Modules:** JavaScript had no built-in module system. Teams used IIFEs (`(function(){})()`) for encapsulation and `<script>` tags for dependencies — but load order was manual, globals leaked everywhere, and there was no standard. CommonJS (2009, Node.js) solved it for server: `require()` + `module.exports`, synchronous, file-based. Browsers needed async loading — AMD (RequireJS) emerged but was complex. ES6 (2015) standardized `import`/`export` natively in the spec.

**The key insight:** ESM's `import` statements are **static** — they appear only at the top level, with no conditionals. This allows bundlers to do **static analysis** at build time: trace the import graph, find unused exports, eliminate them. CommonJS `require()` is a function call — can be inside `if` blocks, dynamic values. Bundlers can't safely eliminate anything because they can't know what will be required at runtime.

## Concept Map / Bản Đồ Khái Niệm

```
[Module Systems]
        │
        ├── CommonJS (CJS) — Node.js, synchronous
        │       ├── require() = function call, runtime resolution
        │       ├── module.exports / exports — value COPY on require
        │       ├── Circular: partial export object returned (snapshot)
        │       └── Tree shaking: NOT possible (dynamic require)
        │
        ├── ES Modules (ESM) — browser + Node.js, standard
        │       ├── import/export — static, top-level only
        │       ├── Live bindings: imported name is READ-ONLY reference to export
        │       ├── Circular: live bindings resolve lazily (safe if initialized before use)
        │       └── Tree shaking: POSSIBLE (static analysis)
        │
        └── Tree Shaking
                ├── Requires ESM (static structure)
                ├── Requires sideEffects: false in package.json
                ├── Named exports > default exports (easier to shake)
                └── Bundler marks used → eliminates unmarked
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. CJS vs ESM — Static vs Dynamic

**🧠 Memory Hook:** "**CommonJS = require() is a function call at runtime. ESM = import is a declaration analyzed at build time. That difference is why ESM enables tree shaking.**"

**Why does this exist? / Tại sao tồn tại?**

- Why can't CommonJS be tree-shaken? Because `require('./utils')` is a regular function call — it can appear inside `if (process.env.NODE_ENV === 'production')`, inside loops, with dynamic string arguments. Bundlers can't safely determine which exports are used without executing the code
- Why are ESM imports static? The spec requires `import` to appear only at module top-level, with a literal string specifier. This constraint enables static analysis: the entire import/export graph is known at parse time, before any code runs
- Why do ESM imports use live bindings instead of value copies? To support circular dependencies: if module A imports `count` from module B, and B hasn't finished loading yet, A gets a live reference — when B's `count` is initialized, A automatically sees the updated value

**Visual — Live Bindings vs Value Copy:**

```javascript
// === CommonJS: value copy ===
// counter.js
let count = 0
module.exports = { count, increment: () => count++ }

// main.js
const { count } = require('./counter')
counter.increment()
console.log(count)           // ← 0! count was copied at require time
console.log(counter.count)   // ← 1 (reading from module.exports object)

// === ES Modules: live binding ===
// counter.mjs
export let count = 0
export function increment() { count++ }

// main.mjs
import { count, increment } from './counter.mjs'
increment()
console.log(count)  // ← 1! count is a live reference to counter.mjs's count
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `const { count } = require('./counter')` then expect live updates | CJS destructure is a value copy — use `const m = require('./counter')`, read `m.count` |
| Dynamic `import(path)` where `path` is a variable, expecting tree-shaking | Dynamic import is not tree-shakeable — only static `import { fn } from './module'` can be shaken |
| Mixing CJS `require` in `.mjs` files | ESM files can't use `require` — use `import`, or use `createRequire` interop shim |
| `export default` for utility libraries | Default exports are harder to tree-shake; prefer named exports |

**🎯 Interview Pattern:**
- **Trigger**: "tree shaking" / "bundle size" / "ESM vs CommonJS" / "lodash optimization"
- **Concept**: Static ESM imports enable build-time analysis; CJS dynamic require prevents it
- **Opening**: "The fundamental difference is static vs dynamic. ESM's `import` is a declaration the bundler can analyze at parse time — it knows exactly which names are imported and can eliminate unused exports. CommonJS `require()` is a runtime function call that can be dynamic — bundlers can't safely shake it..."

**🔑 Knowledge Chain:**
- **Prereq**: How bundlers work (Webpack/Rollup/Vite), `package.json` `"type"` field
- **Enables**: Tree shaking, code splitting, Module Federation (runtime ESM composition)

---

### 2. Tree Shaking — Dead Code Elimination

**🧠 Memory Hook:** "**Tree shaking = mark used exports, shake off the rest. Requires 3 conditions: ESM imports, sideEffects: false, no dynamic access.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do bundles include unused code? Because bundlers are conservative: if they can't prove code is unused, they include it. A single `import utils from 'utils'` includes the entire file
- Why is `sideEffects: false` necessary? A module has "side effects" if simply importing it causes observable behavior (modifies globals, adds CSS, polyfills). If a bundler tree-shakes such a module, it breaks the app. `sideEffects: false` in `package.json` signals "importing this module with no used exports is safe to remove completely"
- Why are named exports easier to shake than default exports? Named exports have explicit names — bundler tracks `import { debounce }` and knows only `debounce` is used. Default exports export one value — bundler must include the whole default export because it doesn't know which properties will be accessed

**Visual — Tree Shaking in Practice:**

```javascript
// math.js (ESM library with named exports)
export function add(a, b) { return a + b }
export function subtract(a, b) { return a - b }
export function multiply(a, b) { return a * b }  // huge 100-line implementation

// main.js
import { add } from './math.js'  // only add is used

// After tree shaking — bundle only contains:
// function add(a, b) { return a + b }
// subtract and multiply are eliminated ✅

// package.json (library authors must set this):
{
  "name": "my-lib",
  "sideEffects": false,   // ← signals: safe to tree-shake entire modules
  // Or: "sideEffects": ["*.css"]  ← CSS imports have side effects, rest don't
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Library uses `module.exports = { add, subtract }` (CJS) | Use ESM `export function add()` for tree-shakeable libraries |
| Missing `sideEffects: false` in library's `package.json` | Add `"sideEffects": false` so consumers can shake the entire unused module |
| `import * as utils from './utils'` then access `utils.fn()` | Use named imports `import { fn }` — object spread defeats static analysis |
| Using `babel` to compile ESM → CJS before bundling | Configure Babel to preserve ESM syntax (`modules: false`) so bundler can tree-shake |

**🎯 Interview Pattern:**
- **Trigger**: "optimize bundle size" / "large dependency" / "unused code"
- **Concept**: Static ESM + `sideEffects: false` + named exports = full tree shaking
- **Opening**: "Tree shaking requires three things: the library must use ESM `export` syntax (not CommonJS), the library's `package.json` must have `sideEffects: false`, and you should use named imports not namespace imports. Then the bundler marks the import graph and eliminates everything not reachable from the entry point..."

**🔑 Knowledge Chain:**
- **Prereq**: ESM static imports, bundler concepts (Webpack/Rollup/Vite)
- **Enables**: Sub-100KB JavaScript bundles, fast FCP, Core Web Vitals improvements

---

### 3. Circular Dependencies — ESM vs CJS Behavior

**🧠 Memory Hook:** "**CJS circular: you get a partial snapshot — whatever was exported before the cycle. ESM circular: you get a live binding that resolves when initialization completes — safe if you don't access at top-level.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do circular dependencies happen? In large codebases, domain logic often has mutual references: `UserService` needs `AuthService`, `AuthService` needs `UserService` for permission checks. Refactoring to avoid all cycles is possible but sometimes creates artificial abstractions
- Why does CJS give you a partial object? When module A requires B, and B requires A, B gets A's `module.exports` as it was at the start of A's execution — not the final version. If A hadn't set `module.exports` yet, B gets `{}`
- Why does ESM handle it better? ESM uses live bindings. When A imports `fn` from B and B imports `fn` from A, neither binding is resolved immediately. The JS engine evaluates all modules in instantiation order, creating live binding slots. If `fn` is initialized before it's called (even in another module), the binding resolves correctly

**Visual — CJS vs ESM Circular:**

```javascript
// === CJS circular: gets partial object ===
// a.js
const { fnB } = require('./b')  // b.js starts loading...
exports.fnA = () => 'A'         // ...b.js requires a.js → gets {} (empty at this point)

// b.js
const { fnA } = require('./a')  // fnA is undefined! ← CJS partial snapshot
exports.fnB = () => fnA()       // ← ReferenceError at runtime

// Fix: use function scope to delay access
exports.fnB = () => {
  const { fnA } = require('./a')  // lazy require inside function — always fresh
  return fnA()
}

// === ESM circular: live bindings resolve lazily ===
// a.mjs
import { fnB } from './b.mjs'
export function fnA() { return 'A' }  // binding slot created

// b.mjs
import { fnA } from './a.mjs'
export function fnB() { return fnA() }  // fnA binding resolves when called (not at import)
// ✅ safe as long as fnB is not called before a.mjs finishes initializing
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Circular CJS with top-level destructure: `const { fn } = require('./a')` in circular graph | Lazy require inside function body: `const { fn } = require('./a')` inside the function |
| Circular ESM where exported value is accessed at top-level initialization time | Access circular imports only inside function bodies — defer until runtime |
| Assuming ESM circular "just works" without understanding timing | Understand that ESM live bindings resolve lazily — safe for functions, dangerous for values accessed at init time |
| "Circular dependencies are always bad" — avoiding all cycles with complex workarounds | Sometimes cycles are natural; ES Modules handle them well if you access via functions, not top-level values |

**🎯 Interview Pattern:**
- **Trigger**: "circular dependency error" / "undefined import" / "module initialization"
- **Concept**: CJS returns partial snapshot at cycle time; ESM live bindings resolve lazily
- **Opening**: "In CommonJS, a circular dependency gives you a partial snapshot — you get whatever was exported before the circular require resolved. Classic symptom: a destructured import is `undefined` at module top level. In ESM, imports are live bindings that resolve lazily — they're only evaluated when accessed. If you access a circular import inside a function body rather than at the top level, it works correctly in ESM..."

**🔑 Knowledge Chain:**
- **Prereq**: Module loading phases, `module.exports` object reference
- **Enables**: Understanding "Cannot access X before initialization" errors; debugging circular import crashes

---

## Reference Theory / Tài Liệu Tham Khảo

## Module System Evolution / Sự Phát Triển Hệ Thống Module

### Historical Context / Bối Cảnh Lịch Sử

**English:** JavaScript originally lacked a native module system, leading to various community solutions before ES6 modules became standard.

**Tiếng Việt:** JavaScript ban đầu thiếu hệ thống module gốc, dẫn đến nhiều giải pháp cộng đồng trước khi ES6 modules trở thành chuẩn.

#### Timeline of Module Systems / Dòng Thời Gian Hệ Thống Module

**1. Script Tags Era (Pre-2009)**
- Global namespace pollution
- Manual dependency management
- Load order matters
- No encapsulation
- IIFE pattern for isolation

**2. CommonJS (2009)**
- Synchronous loading
- Server-side focus (Node.js)
- `require()` and `module.exports`
- File-based modules
- Runtime resolution

**3. AMD - Asynchronous Module Definition (2010)**
- Browser-focused
- Asynchronous loading
- `define()` and `require()`
- RequireJS implementation
- Complex syntax

**4. UMD - Universal Module Definition (2011)**
- Compatibility layer
- Works with CommonJS, AMD, and globals
- Boilerplate-heavy
- Bridge solution

**5. ES6 Modules (2015)**
- Native JavaScript modules
- Static structure
- Import/export syntax
- Compile-time resolution
- Tree-shaking support

---

## CommonJS Theory / Lý Thuyết CommonJS

### Design Philosophy / Triết Lý Thiết Kế

**English:** CommonJS was designed for server-side JavaScript with synchronous, file-based module loading.

**Tiếng Việt:** CommonJS được thiết kế cho JavaScript phía server với tải module đồng bộ, dựa trên file.

#### Core Concepts / Khái Niệm Cốt Lõi

**1. Module Wrapper Function**

Every CommonJS module is wrapped in a function:
```
(function(exports, require, module, __filename, __dirname) {
  // Module code here
});
```

This provides:
- **Scope isolation**: Variables don't leak to global
- **Module metadata**: Access to module object
- **File information**: __filename and __dirname
- **Dependency injection**: require function

**2. Module Object Structure**

Each module has a module object:
- `module.id`: Unique identifier (usually file path)
- `module.exports`: What the module exports
- `module.parent`: Module that required this one
- `module.children`: Modules required by this one
- `module.filename`: Absolute path to module file
- `module.loaded`: Boolean indicating if module finished loading
- `module.paths`: Array of paths to search for modules

**3. Exports vs Module.Exports**

Two ways to export:
- `exports.foo = bar` - Adds property to exports object
- `module.exports = foo` - Replaces entire exports object

**Key Rule**: `exports` is a reference to `module.exports`. Reassigning `exports` breaks the reference.

**4. Caching Mechanism**

CommonJS caches modules:
- First `require()` loads and executes module
- Subsequent `require()` returns cached result
- Cache key is resolved absolute path
- `require.cache` object stores all cached modules
- Can delete from cache to force reload

**5. Synchronous Loading**

CommonJS loads synchronously:
- Blocks execution until module loaded
- Suitable for server (fast file system)
- Problematic for browsers (network latency)
- Enables simple, straightforward code

#### Module Resolution Algorithm / Thuật Toán Giải Quyết Module

**Node.js Module Resolution Steps:**

1. **Core Modules**: Check if built-in (fs, path, http)
2. **Relative Paths**: Start with ./ or ../
   - Resolve relative to current file
   - Try exact path
   - Try with .js, .json, .node extensions
   - Try as directory with index.js
3. **Node Modules**: No prefix
   - Search in node_modules in current directory
   - Search in parent directories recursively
   - Continue up to root
4. **Global Modules**: Check global installation paths

**Resolution Priority:**
1. File with exact name
2. File with .js extension
3. File with .json extension
4. File with .node extension
5. Directory with package.json (main field)
6. Directory with index.js
7. Directory with index.json
8. Directory with index.node

---

## ES Modules Theory / Lý Thuyết ES Modules

### Design Philosophy / Triết Lý Thiết Kế

**English:** ES Modules were designed as a static, declarative module system with compile-time optimization capabilities.

**Tiếng Việt:** ES Modules được thiết kế như một hệ thống module tĩnh, khai báo với khả năng tối ưu hóa compile-time.

#### Core Principles / Nguyên Tắc Cốt Lõi

**1. Static Structure**

ES Modules have static structure:
- Import/export statements must be at top level
- Cannot be conditional or dynamic (without dynamic import)
- Module dependencies known before execution
- Enables static analysis and optimization
- Supports tree-shaking

**Benefits:**
- Dead code elimination
- Faster module loading
- Better tooling support
- Compile-time errors
- Circular dependency detection

**2. Live Bindings**

ES Modules use live bindings:
- Imported values are references, not copies
- Changes in exporting module reflect in importing module
- Read-only in importing module
- Different from CommonJS (which copies values)

**Example Behavior:**
```
// counter.js
export let count = 0;
export function increment() { count++; }

// main.js
import { count, increment } from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1 (live binding!)
```

**3. Asynchronous Loading**

ES Modules load asynchronously:
- Non-blocking by default
- Suitable for browsers
- Parallel loading of dependencies
- Execution order preserved
- Top-level await support (ES2022)

**4. Strict Mode**

ES Modules always run in strict mode:
- No need for 'use strict'
- Prevents common mistakes
- Better performance
- Safer code

**5. Module Scope**

Each module has its own scope:
- Top-level variables are module-scoped
- Not added to global object
- `this` is undefined at top level
- No global pollution

#### Import/Export Variations / Biến Thể Import/Export

**Named Exports:**
- Export multiple values
- Import by name
- Can rename with `as`
- Explicit and clear

**Default Exports:**
- One default per module
- Import with any name
- Convenient for single export
- Can combine with named exports

**Re-exports:**
- Export from another module
- Aggregation pattern
- Barrel exports
- Namespace management

**Dynamic Imports:**
- `import()` function
- Returns Promise
- Code splitting
- Lazy loading
- Conditional loading

---

## Module Resolution / Giải Quyết Module

### ES Module Resolution / Giải Quyết ES Module

**English:** ES Module resolution differs from CommonJS, with stricter rules and explicit file extensions.

**Tiếng Việt:** Giải quyết ES Module khác với CommonJS, với quy tắc nghiêm ngặt hơn và phần mở rộng file rõ ràng.

#### Resolution Rules / Quy Tắc Giải Quyết

**1. Specifier Types**

Three types of module specifiers:
- **Relative**: `./module.js`, `../utils.js`
- **Absolute**: `/root/module.js` (rare)
- **Bare**: `lodash`, `react` (package names)

**2. File Extension Requirements**

Browsers require explicit extensions:
- Must include .js, .mjs
- No automatic extension resolution
- Node.js can be configured for this

**3. Package.json Fields**

Modern package.json supports:
- `"type": "module"` - Treat .js as ES modules
- `"type": "commonjs"` - Treat .js as CommonJS (default)
- `"exports"` - Define package entry points
- `"main"` - Legacy entry point
- `"module"` - ES module entry point (bundlers)

**4. Conditional Exports**

Package.json exports can be conditional:
```json
{
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "require": "./cjs/index.js",
      "types": "./types/index.d.ts"
    }
  }
}
```

Conditions:
- `import` - ES module import
- `require` - CommonJS require
- `node` - Node.js environment
- `browser` - Browser environment
- `development` - Development mode
- `production` - Production mode
- `types` - TypeScript types

---

## Circular Dependencies / Phụ Thuộc Vòng Tròn

### Theory of Circular Dependencies / Lý Thuyết Phụ Thuộc Vòng Tròn

**English:** Circular dependencies occur when modules depend on each other directly or indirectly, creating a cycle.

**Tiếng Việt:** Phụ thuộc vòng tròn xảy ra khi các modules phụ thuộc lẫn nhau trực tiếp hoặc gián tiếp, tạo ra một chu trình.

#### How Systems Handle Cycles / Cách Hệ Thống Xử Lý Chu Trình

**CommonJS Approach:**
1. Starts loading Module A
2. A requires Module B
3. Starts loading Module B
4. B requires Module A
5. Returns partially loaded A to B
6. B finishes loading
7. A finishes loading

**Result**: Works but can cause issues with undefined values if not careful.

**ES Modules Approach:**
1. Parse all modules first (static analysis)
2. Detect circular dependencies
3. Create module instances
4. Link imports/exports
5. Execute modules in order

**Result**: Better handling due to live bindings, but still requires careful design.

#### Problems with Circular Dependencies / Vấn Đề với Phụ Thuộc Vòng Tròn

**1. Initialization Order Issues**
- Unclear which module initializes first
- Partial initialization can cause bugs
- Temporal dead zones

**2. Maintenance Complexity**
- Hard to understand code flow
- Difficult to refactor
- Testing becomes complex

**3. Performance Impact**
- Module loading overhead
- Potential memory leaks
- Harder to optimize

#### Solutions / Giải Pháp

**1. Dependency Injection**
- Pass dependencies as parameters
- Inversion of control
- Breaks circular dependency

**2. Event Emitters**
- Decouple modules
- Publish-subscribe pattern
- Loose coupling

**3. Lazy Loading**
- Delay import until needed
- Dynamic imports
- Break initialization cycle

**4. Refactoring**
- Extract shared code to third module
- Reorganize module structure
- Better separation of concerns

**5. Interface Segregation**
- Define interfaces
- Depend on abstractions
- Reduce coupling

---

## Tree Shaking / Tree Shaking

### Dead Code Elimination Theory / Lý Thuyết Loại Bỏ Code Chết

**English:** Tree shaking is the process of eliminating unused code from the final bundle, enabled by ES Modules' static structure.

**Tiếng Việt:** Tree shaking là quá trình loại bỏ code không sử dụng khỏi bundle cuối cùng, được kích hoạt bởi cấu trúc tĩnh của ES Modules.

#### How Tree Shaking Works / Cách Tree Shaking Hoạt Động

**1. Static Analysis Phase**
- Parse all modules
- Build dependency graph
- Identify all imports and exports
- Mark used exports

**2. Marking Phase**
- Start from entry points
- Mark all reachable code
- Follow import chains
- Mark transitively used code

**3. Sweeping Phase**
- Remove unmarked code
- Eliminate unused exports
- Remove unused imports
- Clean up dead code

#### Requirements for Effective Tree Shaking / Yêu Cầu cho Tree Shaking Hiệu Quả

**1. ES Module Syntax**
- Must use import/export
- No CommonJS require
- Static structure required

**2. Side-Effect Free Code**
- Pure functions preferred
- No global state mutations
- Predictable behavior

**3. Package Configuration**
- `"sideEffects": false` in package.json
- Or array of files with side effects
- Helps bundlers optimize

**4. Named Exports**
- Better than default exports
- More granular elimination
- Clearer dependencies

#### Limitations / Giới Hạn

**1. Dynamic Imports**
- Cannot analyze statically
- Entire module included
- Runtime dependencies

**2. Side Effects**
- Must be conservative
- May include unnecessary code
- Requires manual configuration

**3. CommonJS Interop**
- Cannot tree-shake CommonJS
- Entire module included
- Conversion needed

**4. Property Access**
- `import * as utils` harder to shake
- Object property access dynamic
- Named imports better

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1: What is the difference between `import` / `export` (ESM) and `require` / `module.exports` (CJS)? / Sự khác nhau giữa ESM và CommonJS?

**A:** Both are module systems, but with fundamentally different models:

| | CommonJS (CJS) | ES Modules (ESM) |
|---|---|---|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous (file-by-file) | Asynchronous (parallel) |
| Analysis | Runtime — can't know until code runs | Static — analyzed at parse time |
| Bindings | Value copy on require | Live bindings (read-only references) |
| Tree shaking | ❌ Not possible | ✅ Possible |
| Default in Node | Yes (`.js` files) | `.mjs` or `"type": "module"` |

```javascript
// CJS — value copy
const { count } = require('./counter')  // count is a copy
counter.increment()
console.log(count)   // ← 0 (stale copy)

// ESM — live binding
import { count, increment } from './counter.js'
increment()
console.log(count)   // ← 1 (live reference)
```

**Tiếng Việt:** CJS dùng `require()` — đồng bộ, runtime, giá trị được copy khi require. ESM dùng `import` — bất đồng bộ, static analysis, live binding (reference read-only). ESM cho phép tree shaking, CJS thì không.

💡 **Interview Signal:**
- ✅ Strong: Explains the static/dynamic distinction; mentions live bindings vs value copy with a concrete example; says tree shaking requires ESM
- ❌ Weak: "ESM uses import/export syntax, CJS uses require" — syntax only, misses the architectural difference

---

### 🟡 [Mid] Q2: Why does tree shaking require ES Modules? What other conditions does it need? / Tại sao tree shaking cần ES Modules?

**A:** Tree shaking = bundler eliminates exports that are never imported anywhere. It requires **static analysis** — the bundler must trace the full import graph at build time, before running any code.

**ESM enables this because:**
- `import` must be at the top level (not inside `if`/loops)
- The module specifier must be a string literal (not a variable)
- All exports are declared statically

**CommonJS breaks this because `require()` is a runtime function** that can be dynamic:
```javascript
const utils = require(process.env.LIB)  // bundler can't know which file
if (debug) require('./devtools')        // bundler can't statically determine
```

**All 3 conditions needed for tree shaking:**
1. **ESM `import`/`export`** — static structure
2. **`"sideEffects": false`** in library's `package.json` — signals "safe to remove unused modules entirely"
3. **Named exports** > default exports — `import { debounce }` is more traceable than `import lib` then `lib.debounce`

**Tiếng Việt:** Tree shaking cần static analysis tại build time. ESM cho phép vì `import` ở top-level với string literal. CommonJS `require()` là runtime function call — không thể phân tích tĩnh. Ngoài ra cần: `"sideEffects": false` trong package.json của library và dùng named exports.

💡 **Interview Signal:**
- ✅ Strong: Explains why static structure is required (ESM constraints); mentions `sideEffects: false` purpose; mentions default vs named exports trade-off
- ❌ Weak: "Tree shaking removes unused code" — correct but doesn't explain *why* ESM is required or the `sideEffects` mechanism

---

### 🔴 [Senior] Q3: A junior dev reports `import { fnA } from './a.js'` returns `undefined` in a circular import. How do you debug this? / Xử lý lỗi circular import trả về undefined?

**A:** This is a **circular dependency initialization timing problem** — classic in ESM too.

**Diagnosis steps:**
1. Check if the circular: does `a.js` import from `b.js` and vice versa?
2. Check if the `undefined` occurs at **module top level** vs inside a function body

**Root cause (ESM):** Even though ESM uses live bindings, if module A's top-level code accesses a binding from B while B is still initializing (because B imported A first), the binding slot exists but holds `undefined` at that moment.

```javascript
// a.js
import { fnB } from './b.js'
export const fnA = () => 'A'
console.log(fnB())  // ← PROBLEM: top-level access of fnB during init cycle
                    // b.js is still loading → fnB binding is undefined

// b.js
import { fnA } from './a.js'
export const fnB = () => fnA()  // fnA is a live binding — will resolve when a.js finishes
```

**Fix:** Move cross-circular-import access inside function bodies — not at top level:
```javascript
// a.js
import { fnB } from './b.js'
export function fnA() { return 'A' }
// ✅ No top-level call — fnB is accessed only when fnA is invoked, after both modules initialize
```

**For CommonJS circular:** The fix is lazy require inside functions:
```javascript
exports.fnA = function() {
  const { fnB } = require('./b')  // lazy — runs after full initialization
  return fnB()
}
```

**Tiếng Việt:** Circular import trả về `undefined` do initialization timing. ESM live bindings tồn tại nhưng chưa được resolve khi top-level code chạy trong cycle. Fix: chỉ access circular import bên trong function body — không phải top-level. CJS fix: lazy `require()` bên trong function.

💡 **Interview Signal:**
- ✅ Strong: Identifies the initialization timing issue (not just "circular deps are bad"); distinguishes top-level access vs function body access; gives concrete fix for both ESM and CJS
- ❌ Weak: "Refactor to remove the circular dependency" — valid advice but misses the diagnostic and immediate fix that doesn't require full refactoring

---

### 🔴 [Senior] Q4: Your app uses lodash and the bundle is 500KB. How do you reduce it? Walk through the diagnosis and fix. / Bundle 500KB vì lodash — cách xử lý?

**A:** Classic lodash bundle bloat. Full diagnosis + fix:

**Step 1 — Identify the problem:**
```bash
# Bundle analyzer
npx webpack-bundle-analyzer dist/stats.json
# or vite: vite-bundle-visualizer
# → lodash takes 72KB (minified+gzip) in the bundle
```

**Step 2 — Check the import:**
```javascript
import _ from 'lodash'        // ❌ imports entire lodash (72KB)
import { debounce } from 'lodash'  // ❌ STILL 72KB — lodash is CJS, can't tree-shake
```

**Step 3 — Fix options (in order of preference):**

```javascript
// Option A: Use lodash-es (ESM version) — enables full tree shaking
import { debounce } from 'lodash-es'  // ✅ ~1KB — only debounce included

// Option B: Import specific method directly
import debounce from 'lodash/debounce'  // ✅ only one file loaded

// Option C: Use native Web APIs (best for simple cases)
// lodash.debounce → just write it (10 lines)
// lodash.pick → Object.fromEntries(Object.entries(obj).filter(...))
// lodash.cloneDeep → structuredClone(obj)  (native ES2022)
```

**Step 4 — Verify:** Re-run bundle analyzer. `lodash-es` + tree shaking should reduce lodash contribution to <2KB if only 1-2 utilities used.

**Tiếng Việt:** Nguyên nhân: `lodash` dùng CJS — không tree-shakeable. Chuyển sang `lodash-es` (ESM version) cho phép tree shaking — bundle giảm từ 72KB xuống ~1KB chỉ với debounce. Thay thế bằng native APIs (`structuredClone`, `Array.prototype.flat`, optional chaining) khi có thể.

💡 **Interview Signal:**
- ✅ Strong: Explains WHY default lodash can't be shaken (CJS); knows lodash-es exists as ESM alternative; mentions native API replacements (structuredClone, etc.); mentions bundle analyzer tooling
- ❌ Weak: "Import only what you need with `import { debounce } from 'lodash'`" — this still bundles all of lodash because lodash is CJS; interviewer will push back

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Key Insight |
|---|-------|-------------|
| Q1 | CJS vs ESM | Static analysis (ESM) vs runtime function call (CJS); live bindings vs value copy |
| Q2 | Tree shaking | Requires: ESM static imports + `sideEffects: false` + named exports |
| Q3 | Circular imports undefined | Initialization timing — access circular imports inside function bodies, not top-level |
| Q4 | Lodash bundle bloat | `lodash` is CJS → can't shake; switch to `lodash-es` or native APIs |

---

## ⚡ Cold Call Simulation

**Q: "Why does `import { debounce } from 'lodash'` not reduce bundle size even though you're only importing one function?"**

**30-second answer:**
"Because lodash uses CommonJS internally — `require()` function calls at runtime. Tree shaking requires static analysis, which only works with ES Module `export` syntax. When a bundler sees a CommonJS module, it can't safely eliminate any part of it without running the code. The solution is `lodash-es`, which is the same library rewritten with ES Module `export` declarations. With lodash-es and a modern bundler, `import { debounce } from 'lodash-es'` only includes debounce and its actual dependencies — the rest is eliminated by tree shaking."

---

## Retrieval Self-Check / Tự Kiểm Tra

**Close this document. Answer from memory:**

**Retrieval:**
1. What is a "live binding" in ESM? How is it different from CJS value copy?
2. What 3 conditions are required for tree shaking to work?
3. What does `"sideEffects": false` in `package.json` tell the bundler?
4. Why does CJS circular dependency give you `undefined` for a destructured import?
5. What is the difference between `import { debounce } from 'lodash'` vs `import { debounce } from 'lodash-es'`?

**Visual:**
- Draw CJS module loading: when A requires B which requires A → what does B get?
- Draw ESM live binding: when A imports `count` from B and B increments it → what does A see?

**Application:**
- A library you wrote is being tree-shaken poorly. What changes do you make to `package.json` and your source code?
- How would you debug a "X is undefined" error in a circular ESM import?

**Debug:**
- `import { theme } from './config'` returns `undefined` at the top of a module. The file clearly exports `theme`. What's happening?

**Teach:**
- Explain tree shaking to a junior: "The bundler is like a librarian. ESM = every book has a precise title (export name). CJS = books are bundled in unlabeled boxes. The librarian can find and remove specific ESM books; the CJS boxes must be kept whole."

---

🔁 **Spaced Repetition:** Review in 3 days → 7 days → 14 days. Focus: ESM live bindings vs CJS copy, tree shaking 3 conditions, circular initialization timing fix.

---

## Connections / Liên Kết

- **Prereqs**: [07-es6-features.md](./07-es6-features.md) (ES6 syntax), [08-advanced-concepts.md](./08-advanced-concepts.md)
- **See also**: [11-es6-features-deep.md](./11-es6-features-deep.md) (Proxy/Symbol), [19-concurrency-models-theory.md](./19-concurrency-models-theory.md) (Module Federation is ESM-based)
- **Performance**: Tree shaking → [06-browser-performance/03-bundle-optimization.md](../06-browser-performance/03-bundle-optimization.md)

---

[← Previous: Concurrency Models](./19-concurrency-models-theory.md) | [Next: JavaScript Engine Internals →](./21-engine-internals-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
