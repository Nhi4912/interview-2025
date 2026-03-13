# JavaScript Module Systems - Theory / Hệ Thống Module JavaScript - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Table of Contents / Mục Lục

1. [Module System Evolution](#module-system-evolution)
2. [CommonJS Theory](#commonjs-theory)
3. [ES Modules Theory](#es-modules-theory)
4. [Module Resolution](#module-resolution)
5. [Circular Dependencies](#circular-dependencies)
6. [Tree Shaking](#tree-shaking)
7. [Interview Questions](#interview-questions)

---

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

### 🟡 [Mid] Q1: Compare CommonJS and ES Modules

**English Answer:**

**CommonJS:**
- Synchronous loading
- Runtime resolution
- `require()` and `module.exports`
- Values are copied
- Dynamic imports easy
- Node.js default
- Cannot tree-shake effectively

**ES Modules:**
- Asynchronous loading
- Compile-time resolution
- `import` and `export`
- Live bindings (references)
- Static structure
- Browser native
- Tree-shaking support
- Strict mode always

**Key Differences:**
1. **Loading**: Sync vs Async
2. **Binding**: Copy vs Reference
3. **Structure**: Dynamic vs Static
4. **Optimization**: Limited vs Extensive
5. **Scope**: Function wrapper vs Module scope

**Tiếng Việt:**

CommonJS: đồng bộ, runtime resolution, copy values. ES Modules: bất đồng bộ, compile-time resolution, live bindings, tree-shaking.

### 🔴 [Senior] Q2: Explain tree shaking and its requirements

**English Answer:**

**Tree Shaking** eliminates unused code from bundles.

**How It Works:**
1. Static analysis of imports/exports
2. Mark used code
3. Remove unused code
4. Optimize bundle size

**Requirements:**
1. **ES Modules**: Must use import/export
2. **Static Structure**: No dynamic requires
3. **Side-Effect Free**: Pure functions
4. **Package Config**: sideEffects field
5. **Named Exports**: Better than default

**Benefits:**
- Smaller bundle size
- Faster load times
- Better performance
- Reduced bandwidth

**Limitations:**
- Cannot shake CommonJS
- Side effects prevent elimination
- Dynamic imports included fully
- Conservative by default

**Tiếng Việt:**

Tree shaking loại bỏ code không dùng. Yêu cầu: ES Modules, static structure, side-effect free, package config, named exports.

### 🔴 [Senior] Q3: How do circular dependencies work?

**English Answer:**

**Circular Dependencies** occur when modules depend on each other.

**CommonJS Handling:**
- Returns partially loaded module
- Can cause undefined values
- Execution order matters
- Works but fragile

**ES Modules Handling:**
- Live bindings help
- Static analysis detects cycles
- Better error messages
- Still requires care

**Problems:**
1. Initialization order unclear
2. Partial state access
3. Hard to maintain
4. Testing difficult

**Solutions:**
1. **Refactor**: Extract shared code
2. **Dependency Injection**: Pass deps
3. **Event Emitters**: Decouple
4. **Lazy Loading**: Delay imports
5. **Interfaces**: Depend on abstractions

**Best Practice**: Avoid circular dependencies through better architecture.

**Tiếng Việt:**

Phụ thuộc vòng tròn xảy ra khi modules phụ thuộc lẫn nhau. CommonJS trả về module chưa load xong. ES Modules xử lý tốt hơn với live bindings. Giải pháp: refactor, DI, event emitters, lazy loading.

### 🔴 [Senior] Q4: What is the module resolution algorithm?

**English Answer:**

**Module Resolution** determines how module specifiers map to files.

**Node.js CommonJS Resolution:**
1. Core modules (fs, path)
2. Relative paths (./file)
3. node_modules search
4. Extension resolution (.js, .json, .node)
5. Directory resolution (index.js)
6. Global modules

**ES Modules Resolution:**
1. Explicit extensions required
2. No automatic resolution
3. Package.json exports field
4. Conditional exports
5. Stricter rules

**Factors Affecting Resolution:**
- File extensions
- package.json configuration
- Module type (ESM vs CJS)
- Environment (Node vs Browser)
- Bundler configuration

**Tiếng Việt:**

Module resolution xác định cách module specifiers ánh xạ tới files. Node.js: core modules → relative paths → node_modules → extensions → directories. ES Modules: extensions bắt buộc, package.json exports, conditional exports.

### 🔴 [Senior] Q5: Explain live bindings in ES Modules

**English Answer:**

**Live Bindings** mean imported values are references, not copies.

**Characteristics:**
1. **Reference**: Points to original value
2. **Read-Only**: Cannot reassign in importer
3. **Updates**: Changes reflect immediately
4. **Synchronization**: Always current value

**Difference from CommonJS:**
- CommonJS copies values
- Changes don't reflect
- Snapshot at import time

**Benefits:**
1. Always up-to-date
2. Circular dependencies work better
3. Memory efficient
4. Consistent state

**Implications:**
- Exported values can change
- Must handle mutable state
- Side effects visible
- Requires careful design

**Example:**
```
// counter.js
export let count = 0;
export function increment() { count++; }

// main.js
import { count } from './counter.js';
// count is live binding to counter.js count
```

**Tiếng Việt:**

Live bindings nghĩa là giá trị import là references, không phải copies. Khác với CommonJS (copy values). Lợi ích: luôn cập nhật, circular deps tốt hơn, hiệu quả bộ nhớ.

---

## Summary / Tóm Tắt

**Key Concepts:**

1. **Evolution**: Script tags → CommonJS → AMD → UMD → ES Modules
2. **CommonJS**: Synchronous, runtime, copies values, Node.js
3. **ES Modules**: Asynchronous, compile-time, live bindings, standard
4. **Resolution**: Different algorithms for different systems
5. **Circular Deps**: Problematic, requires careful design
6. **Tree Shaking**: Dead code elimination, requires ES Modules
7. **Best Practices**: Use ES Modules, avoid circular deps, configure properly

**Modern Approach:**
- Use ES Modules for new code
- Configure package.json properly
- Enable tree-shaking
- Avoid circular dependencies
- Use named exports
- Explicit file extensions

---

[← Previous: Concurrency Models](./19-concurrency-models-theory.md) | [Next: JavaScript Engine Internals →](./21-engine-internals-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
