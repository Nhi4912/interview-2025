#!/usr/bin/env python3
"""
Convert 2-column Common Mistakes tables to 3-column format.
Usage: python3 scripts/convert_common_mistakes.py
"""
import re, os

BASE = os.path.join(os.path.dirname(__file__), "../docs/fe-track/01-javascript/")

# ─────────────────────────────────────────────────────────────────────────────
# Helper: build a 3-col table string from list of (mistake, why, correct) tuples
# ─────────────────────────────────────────────────────────────────────────────
def make_table(rows):
    lines = ["| Sai lầm | Tại sao sai | Đúng là |", "|---------|------------|---------|"]
    for (m, w, c) in rows:
        lines.append(f"| {m} | {w} | {c} |")
    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# Each entry: (filename, list_of_sections)
# Each section: (old_table_block_str, new_rows_list)
# old_table_block_str must match the EXACT characters in the file
# ─────────────────────────────────────────────────────────────────────────────

SECTIONS = []

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 11: 11-es6-features-deep.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F11 = "11-es6-features-deep.md"

SECTIONS.append((F11,
    "| ❌ Wrong | ✅ Correct |\n|---|---|\n"
    "| `const { address: { city } } = user` crashes if `user.address` is undefined | `const { address: { city } = {} } = user` — provide default for intermediate |\n"
    "| Deeply nested destructuring (3+ levels) | Use optional chaining instead: `user?.address?.city ?? ''` |\n"
    "| Forgetting that rename and default can combine | `const { name: firstName = 'Anonymous' } = user` is valid |\n"
    "| `const [a, b] = obj` (destructuring object as array) | Array destructuring on objects only works if object is iterable (`Symbol.iterator`) |",
    [
        ("`const { address: { city } } = user` crashes if `user.address` is undefined",
         "No default for intermediate object — throws `TypeError` when intermediate is `undefined`",
         "`const { address: { city } = {} } = user` — provide default for intermediate"),
        ("Deeply nested destructuring (3+ levels)",
         "Requires chaining defaults at every level; hard to read and maintain",
         "Use optional chaining instead: `user?.address?.city ?? ''`"),
        ("Forgetting that rename and default can combine",
         "Leads to verbose workarounds — renaming then assigning fallback separately",
         "`const { name: firstName = 'Anonymous' } = user` is valid"),
        ("`const [a, b] = obj` (destructuring plain object as array)",
         "Plain objects are not iterable — throws `TypeError: obj is not iterable`",
         "Array destructuring only works if object implements `Symbol.iterator`"),
    ]
))

SECTIONS.append((F11,
    "| ❌ Wrong | ✅ Correct |\n|---|---|\n"
    "| Using `{}` with numeric keys | Use `Map` — object coerces numeric keys to strings (`obj[1]` → `obj['1']`) |\n"
    "| `Array.from(new Set(arr))` is all you know about Set | Set is O(1) for `has()` — use it for fast membership tests, not just dedup |\n"
    "| Using WeakMap when you need to iterate | WeakMap has no `.keys()`, `.values()`, `.forEach()` — use Map if you need iteration |\n"
    "| Creating Symbol without using it as a key | Symbol as string description is useless — its value is being a unique key `obj[mySymbol] = value` |\n"
    "| `Symbol.for('id') === Symbol.for('id')` is false | `Symbol.for()` returns the SAME symbol from global registry — it IS true ✓ |",
    [
        ("Using `{}` with numeric keys",
         "Object coerces numeric keys to strings — `obj[1]` becomes `obj['1']`; silent key collision",
         "Use `Map` — preserves key type and insertion order"),
        ("`Array.from(new Set(arr))` is all you know about Set",
         "Misses the main benefit: `Set.has()` is O(1) vs `Array.includes()` O(n)",
         "Use `Set` for fast O(1) membership tests, not just deduplication"),
        ("Using WeakMap when you need to iterate",
         "WeakMap has no `.keys()`, `.values()`, or `.forEach()` — not iterable by design (GC safety)",
         "Use `Map` when iteration is needed; `WeakMap` only for GC-safe metadata"),
        ("Creating Symbol without using it as a key",
         "The description string is just for debugging — not a unique identifier on its own",
         "Use Symbol as property key: `obj[mySymbol] = value`"),
        ("`Symbol.for('id') === Symbol.for('id')` is false",
         "Confusing `Symbol()` (unique each call) with `Symbol.for()` (global registry lookup)",
         "`Symbol.for()` returns the SAME symbol from global registry — it IS `true` ✓"),
    ]
))

SECTIONS.append((F11,
    "| ❌ Wrong | ✅ Correct |\n|---|---|\n"
    "| Calling `target[key]` inside a `get` trap instead of `Reflect.get(target, key, receiver)` | `Reflect.get` preserves the correct `receiver` for prototype chain lookups |\n"
    "| Forgetting that Proxy intercepts prototype chain operations too | `'key' in proxied` calls `has` trap — if no `has` trap, falls through to target |\n"
    "| Using Proxy for simple validation on one property | `Object.defineProperty` with a setter is simpler for one property; Proxy is for cross-cutting |\n"
    "| Thinking Proxy can wrap primitive values | Proxy only works with objects and functions — primitives are values, not references |",
    [
        ("Calling `target[key]` inside a `get` trap instead of `Reflect.get(target, key, receiver)`",
         "`target[key]` bypasses `receiver` — breaks prototype chain accessor properties",
         "`Reflect.get` preserves the correct `receiver` for prototype chain lookups"),
        ("Forgetting that Proxy intercepts prototype chain operations too",
         "`'key' in proxied` calls the `has` trap — unexpected if only `get`/`set` traps are implemented",
         "`'key' in proxied` calls `has` trap — if no `has` trap, falls through to target"),
        ("Using Proxy for simple validation on one property",
         "Proxy adds overhead; designed for cross-cutting concerns across all properties",
         "`Object.defineProperty` with a setter is simpler for one property; Proxy is for cross-cutting"),
        ("Thinking Proxy can wrap primitive values",
         "Primitives are immutable values with no object identity — nothing to intercept",
         "Proxy only works with objects and functions — primitives are values, not references"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 13: 13-javascript-basics-theory.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F13 = "13-javascript-basics-theory.md"

SECTIONS.append((F13,
    "| ❌ Wrong                                             | ✅ Correct                                                                                  |\n"
    "| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |\n"
    '| "Hoisting moves code to the top"                     | Hoisting = Creation Phase processes declarations before execution — code doesn\'t move       |\n'
    '| "`let` is not hoisted"                               | `let` IS bound during Creation (hoisted) — just not initialized (TDZ)                       |\n'
    '| "`var` in a block leaks to function scope"           | `var` has function scope, not block scope — this IS the behavior, not a bug                 |\n'
    '| "Function expressions are hoisted like declarations" | `const fn = () => {}` — the `const` binding is TDZ; only `function fn()` gets fully hoisted |',
    [
        ('"Hoisting moves code to the top"',
         "Code position is unchanged — the Creation Phase processes declarations before line-by-line execution",
         "Hoisting = Creation Phase processes declarations before execution — code doesn't move"),
        ('"`let` is not hoisted"',
         "`let` bindings ARE created during Creation Phase — they're just not initialized (Temporal Dead Zone)",
         "`let` IS bound during Creation (hoisted) — just not initialized (TDZ)"),
        ('"`var` in a block leaks to function scope"',
         "This is the intended behavior by spec, not a bug — `var` has always been function-scoped",
         "`var` has function scope, not block scope — this IS the behavior, not a bug"),
        ('"Function expressions are hoisted like declarations"',
         "`const fn = () => {}` — the `const` binding is in TDZ; only `function fn(){}` gets fully hoisted with its value",
         "`const fn = () => {}` — the `const` binding is TDZ; only `function fn()` gets fully hoisted"),
    ]
))

SECTIONS.append((F13,
    "| ❌ Wrong                     | ✅ Correct                                                                                                         |\n"
    "| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |\n"
    '| "`+` always does math"       | `+` does concatenation if either side is a string or object coercing to string                                     |\n'
    '| "ToBoolean follows ToNumber" | ToBoolean is independent — `""` is falsy but `ToNumber("") = 0`, not NaN                                           |\n'
    '| "`[]` is falsy"              | `[]` is TRUTHY (ToBoolean of object = true) — but `[] == false` is true via different coercion path                |\n'
    '| "null == 0 is true"          | `null == undefined` is true (spec special case) but `null == 0` is false (null only equals null/undefined in `==`) |',
    [
        ('"`+` always does math"',
         "`+` is overloaded — if either operand is a string or coerces to string, it concatenates instead",
         "`+` does concatenation if either side is a string or object coercing to string"),
        ('"ToBoolean follows ToNumber"',
         'They are independent operations — `""` is falsy (ToBoolean) but `ToNumber("") = 0`, not NaN',
         'ToBoolean is independent — `""` is falsy but `ToNumber("") = 0`, not NaN'),
        ('"`[]` is falsy"',
         "`[]` is an object — all objects are truthy in ToBoolean; `[] == false` uses a different coercion path",
         "`[]` is TRUTHY (ToBoolean of object = true) — but `[] == false` is true via different coercion path"),
        ('"null == 0 is true"',
         "`null` has a special-case rule in the spec: it only equals `undefined` via `==` — nothing else",
         "`null == undefined` is true (spec special case) but `null == 0` is false"),
    ]
))

SECTIONS.append((F13,
    "| ❌ Wrong                                | ✅ Correct                                                                                                                        |\n"
    "| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |\n"
    '| "Use `==` with explicit conversion"     | Just use `===` everywhere; add explicit cast if needed                                                                            |\n'
    '| "NaN == NaN is true"                    | `NaN !== NaN` by spec — use `Number.isNaN()` or `Object.is(x, NaN)`                                                               |\n'
    '| "`null == 0` is true"                   | `null` only `== undefined` in the spec — `null == 0` is `false`                                                                   |\n'
    '| "React uses `===` for state comparison" | React (and Zustand/Jotai) use `Object.is` — that\'s why setting state to `NaN` twice still triggers re-render on first, not second |',
    [
        ('"Use `==` with explicit conversion"',
         "Still confusing and bug-prone — implicit coercion behavior is hard to predict",
         "Just use `===` everywhere; add explicit cast if needed"),
        ('"NaN == NaN is true"',
         "`NaN !== NaN` by spec — NaN is the only value not equal to itself",
         "Use `Number.isNaN()` or `Object.is(x, NaN)` to check for NaN"),
        ('"`null == 0` is true"',
         "`null` has a spec special case: only equals `undefined` in `==`; all other comparisons return false",
         "`null` only `== undefined` in the spec — `null == 0` is `false`"),
        ('"React uses `===` for state comparison"',
         "React uses `Object.is` which differs from `===` on `NaN` (equal) and `+0`/`-0` (not equal)",
         "React (and Zustand/Jotai) use `Object.is` — that's why setting state to `NaN` twice still triggers re-render on first, not second"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 14: 14-javascript-type-system-theory.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F14 = "14-javascript-type-system-theory.md"

SECTIONS.append((F14,
    "| ❌ Wrong                                         | ✅ Correct                                                                                        |\n"
    "| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |\n"
    "| `typeof value === 'object'` to check for objects | Includes null — use `value !== null && typeof value === 'object'`                                 |\n"
    "| `typeof value === 'number'` to validate numbers  | Also passes for `NaN` — add `&& !Number.isNaN(value) && isFinite(value)`                          |\n"
    "| `typeof [] === 'array'`                          | `typeof` never returns `'array'` — use `Array.isArray()`                                          |\n"
    "| Using `typeof` for class instances               | `typeof new Date()` → `'object'` (not `'date'`) — use `instanceof` or `Object.prototype.toString` |",
    [
        ("`typeof value === 'object'` to check for objects",
         "`typeof null === 'object'` — a 30-year-old historical bug; null passes this check",
         "Use `value !== null && typeof value === 'object'`"),
        ("`typeof value === 'number'` to validate numbers",
         "`typeof NaN === 'number'` — NaN passes this check; it's not a usable number",
         "Add `&& !Number.isNaN(value) && isFinite(value)` for a valid numeric check"),
        ("`typeof [] === 'array'`",
         "`typeof` only returns 8 type strings and never `'array'` — arrays return `'object'`",
         "`typeof []` returns `'object'` — use `Array.isArray()` instead"),
        ("Using `typeof` for class instances",
         "`typeof new Date()` → `'object'` — no class information; all instances look the same",
         "Use `instanceof` or `Object.prototype.toString.call` for class instances"),
    ]
))

SECTIONS.append((F14,
    "| ❌ Wrong                             | ✅ Correct                                                                |\n"
    "| ------------------------------------ | ------------------------------------------------------------------------- |\n"
    "| `isNaN(value)` for NaN check         | `Number.isNaN(value)` — global `isNaN` coerces: `isNaN(\"hello\") === true` |\n"
    "| `value instanceof Array` cross-frame | `Array.isArray(value)` — checks the internal `[[IsArray]]` slot           |\n"
    "| `typeof value === 'null'`            | `typeof null === 'object'` — use `value === null`                         |\n"
    "| `value.constructor === Object`       | Fails if constructor was reassigned; use `Object.prototype.toString.call` |",
    [
        ("`isNaN(value)` for NaN check",
         "Global `isNaN` coerces the argument first — `isNaN(\"hello\") === true` (coerced to NaN)",
         "Use `Number.isNaN(value)` — no coercion, only true for actual NaN"),
        ("`value instanceof Array` cross-frame",
         "`instanceof` checks the prototype chain against the current frame's `Array` — fails across iframes",
         "`Array.isArray(value)` — checks internal `[[IsArray]]` slot, reliable across realms"),
        ("`typeof value === 'null'`",
         "`typeof null === 'object'` — `'null'` is never a `typeof` result",
         "Use `value === null` to check for null"),
        ("`value.constructor === Object`",
         "Constructor can be reassigned or absent (null-prototype objects) — unreliable",
         "Use `Object.prototype.toString.call(value)` for reliable built-in type tag"),
    ]
))

SECTIONS.append((F14,
    "| ❌ Wrong                                                  | ✅ Correct                                                                           |\n"
    "| --------------------------------------------------------- | ------------------------------------------------------------------------------------ |\n"
    "| Mixing integers and floats in performance-critical arrays | Initialize arrays with consistent types; avoid degrading element kinds               |\n"
    "| `arr.length = 0` to clear a large array                   | `arr = []` is sometimes faster — creates a fresh array with fresh element kind       |\n"
    "| Adding `undefined` to array holes                         | Creates `HOLEY_ELEMENTS` — V8 must check prototype chain for each access             |\n"
    "| Premature optimization without profiling                  | These micro-optimizations matter only in hot loops (>10k iterations) — profile first |",
    [
        ("Mixing integers and floats in performance-critical arrays",
         "Forces V8 to change element kind from `PACKED_SMI` → `PACKED_DOUBLE` — backing store reallocated",
         "Keep array types homogeneous; initialize with consistent types"),
        ("`arr.length = 0` to clear a large array",
         "Array retains old backing store with its element kind transitions",
         "`arr = []` creates a fresh array with a clean element kind"),
        ("Adding `undefined` to array holes",
         "Creates `HOLEY_ELEMENTS` — V8 must check the prototype chain on every element access",
         "Avoid holes; fill with `null` instead of leaving gaps or setting `undefined`"),
        ("Premature optimization without profiling",
         "These micro-optimizations only matter in hot loops (>10k iterations) — profile first",
         "Profile first; 90% of perf gains come from algorithmic improvements, not element kind tricks"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 15: 15-memory-management-advanced.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F15 = "15-memory-management-advanced.md"

SECTIONS.append((F15,
    '| ❌ Wrong                                              | ✅ Correct                                                                        |\n'
    '| ----------------------------------------------------- | --------------------------------------------------------------------------------- |\n'
    '| "Setting variable to null frees memory immediately"   | Marks the object unreachable from that reference — GC runs at its own schedule    |\n'
    '| "Circular references always cause memory leaks in JS" | Mark-and-sweep handles cycles — only old IE using ref counting had this problem   |\n'
    '| "More GC = good, memory is always being freed"        | Frequent GC = frequent pauses (STW) — excessive allocation is the real problem    |\n'
    '| "V8 GC runs on the main thread"                       | Modern V8 (Orinoco): concurrent + incremental — most GC work runs off main thread |',
    [
        ('"Setting variable to null frees memory immediately"',
         "Null removes one reference — GC runs on its own schedule, not synchronously",
         "Marks the object unreachable from that reference — GC sweeps on its own schedule"),
        ('"Circular references always cause memory leaks in JS"',
         "True for old reference-counting GCs (IE); mark-and-sweep correctly handles cycles",
         "Mark-and-sweep handles cycles — only old IE using ref counting had this problem"),
        ('"More GC = good, memory is always being freed"',
         "Frequent GC triggers frequent Stop-the-World pauses — excessive allocation rate is the real problem",
         "Frequent GC = frequent STW pauses — reduce allocation rate in hot paths"),
        ('"V8 GC runs on the main thread"',
         "Modern V8's Orinoco GC is concurrent and incremental — most work happens off main thread",
         "Modern V8 (Orinoco): concurrent + incremental — most GC work runs off main thread"),
    ]
))

SECTIONS.append((F15,
    "| ❌ Wrong                                                           | ✅ Correct                                                                     |\n"
    "| ------------------------------------------------------------------ | ------------------------------------------------------------------------------ |\n"
    "| Adding event listeners in loop/component re-render without cleanup | Use `useEffect` return cleanup or `AbortController`                            |\n"
    "| `const cache = new Map(); cache.set(obj, data)` growing unbounded  | WeakMap for object-keyed caches (auto GC) or LRU eviction for size-bounded Map |\n"
    "| Closure capturing `this` in React class component timer            | `clearInterval` in `componentWillUnmount` or use hooks with cleanup            |\n"
    "| Holding reference to `detachedNode` for reuse                      | Truly detach by setting variable to `null` or rebuilding from fresh DOM        |",
    [
        ("Adding event listeners in loop/component re-render without cleanup",
         "Each listener is a reference from DOM to handler — accumulated listeners = memory leak",
         "Use `useEffect` return cleanup or `AbortController` to remove all listeners"),
        ("`const cache = new Map(); cache.set(obj, data)` growing unbounded",
         "`Map` holds strong references — old entries are never freed; memory grows indefinitely",
         "Use `WeakMap` for object-keyed caches (auto GC) or LRU eviction for size-bounded `Map`"),
        ("Closure capturing `this` in React class component timer",
         "Timer callback closes over `this` — component is kept alive until timer is cleared",
         "`clearInterval` in `componentWillUnmount` or use hooks with cleanup function"),
        ("Holding reference to `detachedNode` for reuse",
         "GC can't collect the node or its entire subtree while any JS reference exists",
         "Set variable to `null` or rebuild from fresh DOM to allow GC"),
    ]
))

SECTIONS.append((F15,
    '| ❌ Wrong                                         | ✅ Correct                                                                                  |\n'
    '| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |\n'
    '| "GC pauses are always short"                     | Major GC (Old Space) can be 50-100ms without incremental — V8\'s concurrent GC reduces this  |\n'
    '| Allocating large objects frequently in hot paths | Large objects go to LOB and are never moved — fragmentation and less efficient GC           |\n'
    '| "`delete obj.prop` frees memory"                 | `delete` removes the property but doesn\'t trigger GC — the object is still reachable        |\n'
    '| Worrying about GC without profiling              | 90% of memory issues are leaks (objects not freed), not GC algorithm choice — profile first |',
    [
        ('"GC pauses are always short"',
         "Major GC on Old Space can be 50-100ms without incremental marking — problematic for large heaps",
         "V8's concurrent incremental GC reduces pauses — but major GC still exists for large heaps"),
        ("Allocating large objects frequently in hot paths",
         "Large objects go to Large Object Space and are never moved — causes fragmentation",
         "Pool or reuse large objects; avoid allocating in tight loops"),
        ('"`delete obj.prop` frees memory"',
         "`delete` removes the property but the object is still reachable — GC is not triggered",
         "Set property to `null`; GC only frees when entire object becomes unreachable"),
        ("Worrying about GC without profiling",
         "90% of memory issues are leaks (objects not freed), not GC algorithm inefficiency",
         "Profile first in Chrome DevTools Memory tab — identify leak source before tuning GC"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 16: 16-execution-context-theory.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F16 = "16-execution-context-theory.md"

SECTIONS.append((F16,
    "| ❌ Wrong                                                                 | ✅ Correct                                                                     |\n"
    "| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |\n"
    "| `const fn = obj.method; fn()` expecting `this === obj`                   | Detaching loses binding — use `const fn = obj.method.bind(obj)`                |\n"
    "| Using `function` in `forEach`/`map` callback and expecting outer `this`  | Use arrow function: `array.forEach(item => this.process(item))`                |\n"
    "| `fn.bind(ctx)` in render method creates new function every render        | Bind in constructor or use arrow function property                             |\n"
    "| Arrow function as object method: `const obj = { fn: () => { this... } }` | Arrow captures `this` from module scope (globalThis/undefined), not from `obj` |",
    [
        ("`const fn = obj.method; fn()` expecting `this === obj`",
         "Detaching a method drops the implicit binding — called without an object context, `this` is `undefined`/global",
         "Use `const fn = obj.method.bind(obj)` to preserve binding"),
        ("Using `function` in `forEach`/`map` callback and expecting outer `this`",
         "Regular function creates its own `this` binding at call time — loses outer context",
         "Use arrow function: `array.forEach(item => this.process(item))`"),
        ("`fn.bind(ctx)` in render method creates new function every render",
         "New function reference each render breaks `React.memo` and `shouldComponentUpdate` equality checks",
         "Bind in constructor or use arrow function property"),
        ("Arrow function as object method: `const obj = { fn: () => { this... } }`",
         "Arrow captures `this` from the scope where it's defined — module scope (globalThis/undefined), not from `obj`",
         "Use regular `function` for methods that need `this` to refer to the object"),
    ]
))

SECTIONS.append((F16,
    '| ❌ Wrong                                                  | ✅ Correct                                                                                  |\n'
    '| --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |\n'
    '| "Closure captures `this`"                                 | Closure captures scope variables, NOT `this` — use arrow function to capture `this`         |\n'
    '| Arrow function as a class method to capture `this`        | Arrow property methods work but can\'t be overridden via prototype                           |\n'
    '| `const { method } = obj; method()` expecting obj\'s `this` | Destructuring detaches from object — use `obj.method()` or bind                             |\n'
    '| "Scope and context are the same thing"                    | Scope = variable resolution (lexical). Context = `this` resolution (dynamic, except arrows) |',
    [
        ('"Closure captures `this`"',
         "`this` is not a variable in scope — closures capture scope variables, not `this`",
         "Use arrow function to capture `this` lexically (arrows close over `this` as a value)"),
        ("Arrow function as a class method to capture `this`",
         "Arrow property methods exist on each instance, not on the prototype — can't be overridden",
         "Works for React event handlers; be aware it's not on the prototype"),
        ("`const { method } = obj; method()` expecting obj's `this`",
         "Destructuring detaches from object — implicit binding is lost at call time",
         "Call as `obj.method()` or bind: `const method = obj.method.bind(obj)`"),
        ('"Scope and context are the same thing"',
         "Scope = variable resolution (lexical, write-time); context = `this` (dynamic, call-time) — completely different mechanisms",
         "Scope is lexical. Context is `this`. Arrow functions unify both by capturing `this` lexically."),
    ]
))

SECTIONS.append((F16,
    '| ❌ Wrong                                                          | ✅ Correct                                                                                             |\n'
    '| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |\n'
    '| "Local variables are destroyed immediately when function returns" | The EC is popped, but closures that captured the env can keep it alive                                 |\n'
    '| "Stack overflow only happens with infinite recursion"             | Large but finite recursion can also overflow — ~10,000 frames in V8                                    |\n'
    '| "`async` functions use a different stack"                         | `async` functions are still on the call stack; `await` pauses and resumes the same context             |\n'
    '| "Eval context is the same as function context"                    | Eval EC can introduce variables into the enclosing scope in sloppy mode — that\'s why eval is dangerous |',
    [
        ('"Local variables are destroyed immediately when function returns"',
         "The EC is popped, but closures that hold references to its Lexical Environment keep it alive",
         "EC is popped; closures that captured the environment can keep it alive"),
        ('"Stack overflow only happens with infinite recursion"',
         "V8's stack limit is ~10,000 frames — deep but finite recursion can also overflow",
         "Large but finite recursion can also overflow — ~10,000 frames in V8"),
        ('"`async` functions use a different stack"',
         "`async` functions use the same call stack — `await` suspends execution and resumes at the same frame",
         "`async` functions are still on the call stack; `await` pauses and resumes the same context"),
        ('"Eval context is the same as function context"',
         "`eval` in sloppy mode can inject variables into the enclosing scope — dangerous and prevents optimization",
         "Eval EC can leak variables into enclosing scope in sloppy mode — use strict mode or avoid eval"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 17: 17-advanced-patterns-theory.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F17 = "17-advanced-patterns-theory.md"

SECTIONS.append((F17,
    "| ❌ Wrong                                               | ✅ Correct                                                                                          |\n"
    "| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |\n"
    "| `@memoize` on async functions without cache key design | Async return is a Promise — serialize args to cache key; handle concurrent same-key calls           |\n"
    "| Decorators mutating the original class/method          | Decorators should return new wrapped version — preserve original via `Reflect.apply`                |\n"
    "| Forgetting `this` context in decorator implementation  | Use `fn.apply(this, args)` or arrow wrapper to preserve receiver                                    |\n"
    "| TypeScript decorators = TC39 decorators                | TypeScript had legacy decorator syntax (experimentalDecorators) before TC39 Stage 3 — different API |",
    [
        ("`@memoize` on async functions without cache key design",
         "Async return is a Promise — concurrent same-key calls may each trigger execution instead of sharing",
         "Serialize args to cache key; return the same in-flight Promise for concurrent same-key calls"),
        ("Decorators mutating the original class/method",
         "Mutating the descriptor changes behavior for all consumers and breaks composability",
         "Return a new wrapped version — preserve original via `Reflect.apply`"),
        ("Forgetting `this` context in decorator implementation",
         "`this` is lost when the wrapped function is detached from its original call site",
         "Use `fn.apply(this, args)` or arrow wrapper to preserve receiver"),
        ("TypeScript decorators = TC39 decorators",
         "TypeScript had a legacy `experimentalDecorators` syntax before TC39 Stage 3 — incompatible APIs",
         "They are different APIs — TC39 Stage 3 uses `accessor` keyword and a different descriptor shape"),
    ]
))

SECTIONS.append((F17,
    "| ❌ Wrong                                                            | ✅ Correct                                                                    |\n"
    "| ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |\n"
    "| Method name collision between mixins (silent overwrite)             | Check for conflicts; document which mixin owns which methods                  |\n"
    "| Using `Object.assign` for class-based mixins (copies, not inherits) | Functional mixins (`(Base) => class extends Base`) for proper prototype chain |\n"
    "| Deep class hierarchies trying to avoid mixins                       | Prefer composition (mixins) over deep hierarchies; 3+ levels is a code smell  |\n"
    "| Mixing concerns (one mixin does logging + auth + caching)           | One mixin, one concern — same SRP as modules/classes                          |",
    [
        ("Method name collision between mixins (silent overwrite)",
         "Later mixin silently overwrites earlier mixin's method — no runtime error; hidden bug",
         "Check for conflicts before applying; document which mixin owns which methods"),
        ("Using `Object.assign` for class-based mixins (copies, not inherits)",
         "`Object.assign` copies methods as own properties — no prototype chain, no proper `instanceof`",
         "Use functional mixins: `(Base) => class extends Base` for proper prototype chain"),
        ("Deep class hierarchies trying to avoid mixins",
         "Tight coupling, fragile base class problem — changing root breaks everything downstream",
         "Prefer composition (mixins) over deep hierarchies; 3+ levels is a code smell"),
        ("Mixing concerns (one mixin does logging + auth + caching)",
         "Violates Single Responsibility — hard to test, impossible to apply concerns selectively",
         "One mixin, one concern — same SRP as modules and classes"),
    ]
))

SECTIONS.append((F17,
    "| ❌ Wrong                                                                          | ✅ Correct                                                                                    |\n"
    "| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |\n"
    "| `Object.freeze` thinking it deeply freezes nested objects                         | Freeze is shallow — need recursive deep freeze for nested immutability                        |\n"
    "| Forgetting `enumerable: true` when using `defineProperty`                         | Default is `false` — property won't appear in `Object.keys` or `JSON.stringify`               |\n"
    "| `configurable: false` with `writable: true` — can you later make it non-writable? | Yes: `writable` can go `true → false` even when `configurable: false`, but not `false → true` |\n"
    "| Using `delete obj.prop` on a `configurable: false` property                       | Silently fails in sloppy mode, throws `TypeError` in strict mode                              |",
    [
        ("`Object.freeze` thinking it deeply freezes nested objects",
         "`freeze` only locks own properties — nested objects remain fully mutable",
         "Freeze is shallow — need recursive deep freeze for nested immutability"),
        ("Forgetting `enumerable: true` when using `defineProperty`",
         "Default `enumerable` for `defineProperty` is `false` — property won't appear in `Object.keys` or `JSON.stringify`",
         "Explicitly set `enumerable: true` if the property should be visible in iteration/serialization"),
        ("`configurable: false` with `writable: true` — can you later make it non-writable?",
         "Counter-intuitive: `configurable: false` blocks most changes, but `writable` can still be tightened",
         "Yes: `writable` can go `true → false` even with `configurable: false`, but not `false → true`"),
        ("Using `delete obj.prop` on a `configurable: false` property",
         "Silently fails in sloppy mode — the bug is invisible without strict mode",
         "Silently fails in sloppy mode, throws `TypeError` in strict mode — always use strict mode"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 18: 18-metaprogramming-theory.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F18 = "18-metaprogramming-theory.md"

SECTIONS.append((F18,
    "| ❌ Wrong                                                               | ✅ Correct                                                                              |\n"
    "| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |\n"
    "| `return true` inside Proxy `set` trap without setting value            | Use `Reflect.set(target, key, value, receiver)` to actually set AND return true         |\n"
    "| Forgetting `receiver` in `Reflect.get/set` in Proxy                    | `receiver` is needed for proper prototype chain `get`/`set` — omitting breaks accessors |\n"
    "| Using `Reflect.metadata` without `reflect-metadata` polyfill           | TC39 spec doesn't include metadata — need `import 'reflect-metadata'` first             |\n"
    "| Calling `Reflect.apply(fn, null, args)` on arrow functions with `this` | Arrow functions don't have own `this` — `receiver` is ignored but no error              |",
    [
        ("`return true` inside Proxy `set` trap without setting value",
         "Returns success to the caller but never actually writes the value — silent data loss",
         "Use `Reflect.set(target, key, value, receiver)` to actually set AND return true"),
        ("Forgetting `receiver` in `Reflect.get/set` in Proxy",
         "Omitting `receiver` breaks getter/setter accessors that rely on the prototype chain",
         "`receiver` is needed for proper prototype chain `get`/`set` — omitting breaks accessors"),
        ("Using `Reflect.metadata` without `reflect-metadata` polyfill",
         "TC39 Reflect spec does not include metadata — it's a separate proposal not in browsers natively",
         "Import `'reflect-metadata'` polyfill first"),
        ("Calling `Reflect.apply(fn, null, args)` on arrow functions expecting `this` to work",
         "Arrow functions ignore `this` binding — `Reflect.apply` won't error but `this` is silently ignored",
         "Arrow functions don't have own `this` — use regular `function` if `this` binding matters"),
    ]
))

SECTIONS.append((F18,
    "| ❌ Wrong                                                      | ✅ Correct                                                                         |\n"
    "| ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |\n"
    "| Using template literals for SQL instead of tagged templates   | `` `SELECT ... WHERE id = ${userId}` `` — SQL injection risk; use tagged `sql\\`\\`` |\n"
    "| Forgetting `strings` array has one more element than `values` | `strings.length === values.length + 1` — always                                    |\n"
    "| Returning non-string from tagged template                     | Tag can return anything: DOM element, styled component, Query object               |\n"
    "| Using `eval()` for \"template-like\" dynamic code generation    | Tagged templates are safe (no code execution) vs `eval` (executes arbitrary code)  |",
    [
        ("Using template literals for SQL instead of tagged templates",
         r"Plain `\`SELECT ... WHERE id = ${userId}\`` interpolates directly — SQL injection risk",
         r"Use tagged `sql\`...\`` template to put expressions in parameterized position"),
        ("Forgetting `strings` array has one more element than `values`",
         "Off-by-one error when zipping strings and values in the tag function",
         "`strings.length === values.length + 1` — always"),
        ("Assuming tagged templates must return a string",
         "This misconception limits the power of tags — they can return any type",
         "Tag can return anything: DOM element, styled component, Query object"),
        ('Using `eval()` for "template-like" dynamic code generation',
         "`eval` executes arbitrary code — security vulnerability and prevents engine optimization",
         "Tagged templates are safe (no code execution) vs `eval` (executes arbitrary code)"),
    ]
))

SECTIONS.append((F18,
    "| ❌ Wrong                                    | ✅ Correct                                                                         |\n"
    "| ------------------------------------------- | ---------------------------------------------------------------------------------- |\n"
    "| Terminal method returns `this`              | Terminal method (`.build()`, `.execute()`) returns the result, not `this`          |\n"
    "| Mutating original object on each chain call | For immutable API: return `new QueryBuilder({...state, newProp: value})`           |\n"
    "| No validation in terminal method            | Validate completeness (e.g., `this.#table === null → throw Error`) at execute time |\n"
    "| Deeply nested chain with 20+ calls          | Break into named intermediate variables for readability                            |",
    [
        ("Terminal method returns `this`",
         "Returning `this` from the terminal method prevents the caller from getting the final result",
         "Terminal methods (`.build()`, `.execute()`) must return the result, not `this`"),
        ("Mutating original object on each chain call",
         "Mutation makes the builder stateful and non-reusable; breaks composability",
         "For immutable API: return `new QueryBuilder({...state, newProp: value})`"),
        ("No validation in terminal method",
         "Incomplete config is only discovered at runtime when the query/operation fails",
         "Validate required fields (e.g., `this.#table === null → throw Error`) at terminal/execute time"),
        ("Deeply nested chain with 20+ calls",
         "Long chains are hard to debug, read, and set breakpoints on",
         "Break into named intermediate variables for readability"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 19: 19-concurrency-models-theory.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F19 = "19-concurrency-models-theory.md"

SECTIONS.append((F19,
    "| ❌ Wrong                                | ✅ Correct                                                                           |\n"
    "| --------------------------------------- | ------------------------------------------------------------------------------------ |\n"
    "| Accessing DOM from worker               | Workers have no DOM access — return computed data, update DOM in main thread         |\n"
    "| Sending large objects via postMessage   | Use Transferable Objects (ArrayBuffer, MessagePort) for zero-copy transfer           |\n"
    "| Creating worker inline for simple tasks | Workers have startup cost (~5ms) — only worth it for tasks >10ms computation         |\n"
    "| Forgetting error handling               | `worker.onerror = (e) => { }` — uncaught worker errors don't propagate automatically |",
    [
        ("Accessing DOM from worker",
         "Workers run in a separate global scope with no DOM API — throws `ReferenceError`",
         "Workers have no DOM access — return computed data, update DOM in main thread"),
        ("Sending large objects via `postMessage`",
         "Structured clone serializes and copies the entire object — expensive for large data",
         "Use Transferable Objects (`ArrayBuffer`, `MessagePort`) for zero-copy transfer"),
        ("Creating a worker for simple/fast tasks",
         "Workers have ~5ms startup overhead — overhead exceeds benefit for fast tasks",
         "Workers have startup cost (~5ms) — only worth it for tasks >10ms of computation"),
        ("Forgetting error handling on worker",
         "Uncaught worker errors don't propagate to the main thread automatically",
         "Set `worker.onerror = (e) => { }` — errors won't propagate without a handler"),
    ]
))

SECTIONS.append((F19,
    "| ❌ Wrong                                              | ✅ Correct                                                                                         |\n"
    "| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |\n"
    "| Non-atomic read-modify-write: `shared[0]++` in worker | Use `Atomics.add(shared, 0, 1)` for thread-safe increment                                          |\n"
    "| Forgetting COOP/COEP headers                          | SharedArrayBuffer returns `undefined` without cross-origin isolation                               |\n"
    "| Using SharedArrayBuffer for general JS object sharing | Only raw binary data — use shared array of typed integers/floats, not objects                      |\n"
    "| `Atomics.wait` on main browser thread                 | `Atomics.wait` is blocking — not allowed on main thread (would freeze UI). Use `Atomics.waitAsync` |",
    [
        ("Non-atomic `shared[0]++` in worker",
         "`++` is a read-modify-write — another thread can interleave between read and write (race condition)",
         "Use `Atomics.add(shared, 0, 1)` for thread-safe increment"),
        ("Forgetting COOP/COEP headers",
         "Browser disables `SharedArrayBuffer` without cross-origin isolation — silently returns `undefined`",
         "Set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`"),
        ("Using `SharedArrayBuffer` for general JS object sharing",
         "Only raw binary data can be shared — JS objects, functions, and references cannot cross thread boundaries",
         "Only share raw typed integer/float data; pass complex structures via `postMessage`"),
        ("`Atomics.wait` on main browser thread",
         "`Atomics.wait` blocks the calling thread — forbidden on main thread (would freeze UI)",
         "Use `Atomics.waitAsync` on main thread; `Atomics.wait` only in workers"),
    ]
))

SECTIONS.append((F19,
    "| ❌ Wrong                                     | ✅ Correct                                                                                           |\n"
    "| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |\n"
    "| `for...of` on async iterable (not for await) | `for await...of` — without `await`, you get Promise objects, not resolved values                     |\n"
    "| Forgetting to handle early termination       | `for await` calls `.return()` on iterator when broken — clean up resources in `finally` in generator |\n"
    "| `await` inside `for...of` (not `for await`)  | `await` in `for...of` runs sequentially but doesn't use iterator protocol — use `for await`          |\n"
    "| Creating async iterables manually (verbose)  | Use `async function*` generator — cleanest syntax                                                    |",
    [
        ("`for...of` on async iterable (not `for await`)",
         "Without `await`, each iteration yields a `Promise` object — not the resolved value",
         "Use `for await...of` — awaits each `.next()` call before proceeding"),
        ("Forgetting to handle early termination in `for await`",
         "Breaking from `for await` calls `.return()` on the iterator — resources may not be cleaned up",
         "Handle cleanup in `finally` block inside the async generator"),
        ("`await` inside regular `for...of` (not `for await...of`)",
         "Awaits each iteration sequentially but doesn't properly use the async iterator protocol",
         "Use `for await...of` to correctly consume async iterables"),
        ("Creating async iterables manually (verbose)",
         "Manual `[Symbol.asyncIterator]` implementation is error-prone and verbose",
         "Use `async function*` generator — cleanest syntax"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 20: 20-module-systems-theory.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F20 = "20-module-systems-theory.md"

SECTIONS.append((F20,
    "| ❌ Wrong                                                                  | ✅ Correct                                                                                       |\n"
    "| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |\n"
    "| `const { count } = require('./counter')` then expect live updates         | CJS destructure is a value copy — use `const m = require('./counter')`, read `m.count`           |\n"
    "| Dynamic `import(path)` where `path` is a variable, expecting tree-shaking | Dynamic import is not tree-shakeable — only static `import { fn } from './module'` can be shaken |\n"
    "| Mixing CJS `require` in `.mjs` files                                      | ESM files can't use `require` — use `import`, or use `createRequire` interop shim                |\n"
    "| `export default` for utility libraries                                    | Default exports are harder to tree-shake; prefer named exports                                   |",
    [
        ("`const { count } = require('./counter')` then expect live updates",
         "CJS `require` destructure creates a value copy at require-time — not a live binding",
         "Use `const m = require('./counter')` and read `m.count` to get current value"),
        ("Dynamic `import(path)` where `path` is a variable, expecting tree-shaking",
         "Dynamic import is a runtime call — bundler can't statically analyze the import graph",
         "Tree-shaking only works with static `import { fn } from './module'` declarations"),
        ("Mixing CJS `require` in `.mjs` files",
         "`.mjs` files are strictly ESM — `require` is not defined in the module scope",
         "Use `import`, or use `createRequire` interop shim"),
        ("`export default` for utility libraries",
         "Default exports are harder to tree-shake and cause renaming inconsistency across consumers",
         "Prefer named exports for utility libraries"),
    ]
))

SECTIONS.append((F20,
    "| ❌ Wrong                                                    | ✅ Correct                                                                          |\n"
    "| ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |\n"
    "| Library uses `module.exports = { add, subtract }` (CJS)     | Use ESM `export function add()` for tree-shakeable libraries                        |\n"
    "| Missing `sideEffects: false` in library's `package.json`    | Add `\"sideEffects\": false` so consumers can shake the entire unused module          |\n"
    "| `import * as utils from './utils'` then access `utils.fn()` | Use named imports `import { fn }` — object spread defeats static analysis           |\n"
    "| Using `babel` to compile ESM → CJS before bundling          | Configure Babel to preserve ESM syntax (`modules: false`) so bundler can tree-shake |",
    [
        ("Library uses `module.exports = { add, subtract }` (CJS)",
         "CJS is dynamic — bundlers can't safely eliminate unused exports from CJS modules",
         "Use ESM `export function add()` for tree-shakeable libraries"),
        ('Missing `sideEffects: false` in library\'s `package.json`',
         "Bundler assumes every module may have side effects — won't eliminate entire unused modules",
         'Add `"sideEffects": false` so consumers can shake entire unused modules'),
        ("`import * as utils from './utils'` then access `utils.fn()`",
         "Namespace import forces bundler to include the entire module; defeats static analysis",
         "Use named imports `import { fn }` — enables per-export elimination"),
        ("Using Babel to compile ESM → CJS before bundling",
         "CJS output loses the static structure that tree-shaking requires",
         "Configure Babel with `modules: false` to preserve ESM syntax for the bundler"),
    ]
))

SECTIONS.append((F20,
    "| ❌ Wrong                                                                                   | ✅ Correct                                                                                                        |\n"
    "| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |\n"
    "| Circular CJS with top-level destructure: `const { fn } = require('./a')` in circular graph | Lazy require inside function body: `const { fn } = require('./a')` inside the function                            |\n"
    "| Circular ESM where exported value is accessed at top-level initialization time             | Access circular imports only inside function bodies — defer until runtime                                         |\n"
    "| Assuming ESM circular \"just works\" without understanding timing                            | Understand that ESM live bindings resolve lazily — safe for functions, dangerous for values accessed at init time |\n"
    '| "Circular dependencies are always bad" — avoiding all cycles with complex workarounds      | Sometimes cycles are natural; ES Modules handle them well if you access via functions, not top-level values       |',
    [
        ("Circular CJS with top-level destructure: `const { fn } = require('./a')` at module level",
         "At cycle resolution time the module may be partially initialized — `fn` is `undefined`",
         "Lazy require inside function body: `const { fn } = require('./a')` inside the function call"),
        ("Circular ESM where exported value is accessed at top-level initialization time",
         "ESM live bindings are resolved lazily — value may still be uninitialized when first accessed",
         "Access circular imports only inside function bodies — defer until runtime"),
        ('Assuming ESM circular "just works" without understanding timing',
         "ESM handles cycles but order matters — a value exported before it's assigned is `undefined`",
         "ESM live bindings resolve lazily — safe for functions, dangerous for top-level values"),
        ('"Circular dependencies are always bad" — adding complex workarounds to avoid all cycles',
         "Forced restructuring to eliminate cycles can make code more complex than the cycle itself",
         "Sometimes cycles are natural; handle them by accessing via functions, not top-level values"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 21: 21-engine-internals-theory.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F21 = "21-engine-internals-theory.md"

SECTIONS.append((F21,
    "| ❌ Wrong                                                       | ✅ Correct                                                                                            |\n"
    "| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |\n"
    "| Function called with both integers and strings interchangeably | Keep function call sites monomorphic — same argument types every call                                 |\n"
    "| `try/catch` inside tight loops                                 | `try/catch` prevents TurboFan optimization of the enclosed code — extract hot code outside try blocks |\n"
    "| Using `arguments` object in inner loops                        | `arguments` is a legacy object that deoptimizes — use rest parameters `...args`                       |\n"
    "| `eval()` or `with` in performance-critical code                | Both prevent static analysis — V8 can't optimize scopes containing these                              |",
    [
        ("Function called with both integers and strings interchangeably",
         "TurboFan compiles with type assumptions — type change triggers deoptimization back to interpreter",
         "Keep function call sites monomorphic — same argument types every call"),
        ("`try/catch` inside tight loops",
         "`try/catch` blocks prevent TurboFan from optimizing the enclosed function",
         "Extract hot code outside `try` blocks — only wrap the unpredictable parts"),
        ("Using `arguments` object in inner loops",
         "`arguments` is a legacy object that triggers deoptimization in TurboFan",
         "Use rest parameters `...args` instead"),
        ("`eval()` or `with` in performance-critical code",
         "Both prevent static scope analysis — V8 can't optimize any function containing them",
         "Avoid `eval`/`with` in hot paths entirely"),
    ]
))

SECTIONS.append((F21,
    "| ❌ Wrong                                                           | ✅ Correct                                                                              |\n"
    "| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |\n"
    "| `delete obj.property`                                              | Set to `null`/`undefined` — `delete` changes the hidden class and can push to slow mode |\n"
    "| Adding properties outside constructor: `obj.newProp = x`           | Define all properties in constructor/creation function                                  |\n"
    "| Different creation order in different code paths                   | Single factory function with fixed property order                                       |\n"
    "| `Object.assign({}, base, overrides)` with varying `overrides` keys | Ensure all possible properties are in the base, use `null` for absent values            |",
    [
        ("`delete obj.property`",
         "`delete` changes the hidden class and can push the object to slow dictionary mode",
         "Set to `null`/`undefined` — same semantic effect, preserves hidden class"),
        ("Adding properties outside constructor: `obj.newProp = x`",
         "Each addition after construction creates a new hidden class transition — splits fast paths",
         "Define all properties in constructor/creation function — same shape from birth"),
        ("Different property creation order in different code paths",
         "Different order = different hidden class — two logically identical objects in different fast classes",
         "Use a single factory function with fixed property order"),
        ("`Object.assign({}, base, overrides)` with varying `overrides` keys",
         "Objects with different property sets get different hidden classes — IC misses on each new shape",
         "Ensure all possible properties are in the base shape; use `null` for absent values"),
    ]
))

SECTIONS.append((F21,
    "| ❌ Wrong                                                               | ✅ Correct                                                                |\n"
    "| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |\n"
    "| Single utility function handling multiple unrelated object types       | Separate specialized functions per type — keep each call site monomorphic |\n"
    "| Array of mixed object shapes passed to same processing function        | Normalize objects to same shape before processing                         |\n"
    "| TypeScript `any` — disables type checking and shape consistency hints  | Use specific types/interfaces — encourages consistent shape               |\n"
    '| "These shapes are conceptually compatible, performance doesn\'t matter" | IC state is the most impactful micro-optimization for hot loops           |',
    [
        ("Single utility function handling multiple unrelated object types",
         "Polymorphic (2-4 shapes) is OK; megamorphic (5+ shapes) degrades to hash lookup — no fast path",
         "Separate specialized functions per type — keep each call site monomorphic"),
        ("Array of mixed object shapes passed to same processing function",
         "Mixed shapes at one call site push IC to megamorphic state — all lookups become hash-based",
         "Normalize objects to same shape before processing"),
        ("TypeScript `any` — disables type checking and shape consistency hints",
         "`any` hides shape inconsistencies that become IC megamorphism at runtime",
         "Use specific types/interfaces — encourages consistent shape"),
        ('"These shapes are conceptually compatible, performance doesn\'t matter"',
         "IC megamorphism in a hot loop is the single most impactful micro-optimization target",
         "IC state is the most impactful micro-optimization for hot loops — measure before dismissing"),
    ]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILE 22: 22-modern-javascript-features.md  (3 sections)
# ═══════════════════════════════════════════════════════════════════════════════
F22 = "22-modern-javascript-features.md"

# Section 1: Has malformed table with || operator split across columns — match carefully
# Original lines 95-100 from the file
F22_S1_OLD = (
    "| ❌ Wrong                                                                  | ✅ Correct                                                              |\n"
    "| ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------- |\n"
    "| `value                                                                    |                                                                         | defaultVal`when`0`or`''` are valid | `value ?? defaultVal` — only replaces null/undefined |\n"
    "| `obj && obj.prop && obj.prop.child`                                       | `obj?.prop?.child` — cleaner, same semantics                            |\n"
    "| `?.` on non-nullable known values: `user?.id` when user is always defined | Only use `?.` at genuinely nullable points — overuse obscures bugs      |\n"
    "| `user?.name ?? ''` when you want error on missing user                    | `user.name ?? ''` — let null user throw, don't silently swallow the bug |"
)

SECTIONS.append((F22, F22_S1_OLD,
    [
        (r"`value \|\| defaultVal` when `0` or `''` are valid values",
         "`||` triggers on any falsy value — `0`, `''`, `false` also get replaced by the default",
         r"`value ?? defaultVal` — only replaces `null`/`undefined`"),
        ("`obj && obj.prop && obj.prop.child`",
         "Verbose manual null-guarding — error-prone and hard to read",
         "`obj?.prop?.child` — cleaner, same semantics"),
        ("`?.` on non-nullable known values: `user?.id` when user is always defined",
         "Overuse obscures bugs — silent `undefined` instead of a helpful TypeError",
         "Only use `?.` at genuinely nullable points"),
        ("`user?.name ?? ''` when you want error on missing user",
         "Silent `undefined` propagation hides the real bug — missing user should throw",
         "`user.name ?? ''` — let null user throw, don't silently swallow the bug"),
    ]
))

SECTIONS.append((F22,
    "| ❌ Wrong                                                                              | ✅ Correct                                                                              |\n"
    "| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |\n"
    "| `Promise.all` for dashboard with partial data tolerance                               | `Promise.allSettled` — shows available data even if some requests fail                  |\n"
    "| `Promise.race` for \"first successful CDN\" (picks first to settle, including failures) | `Promise.any` — ignores rejections, returns first fulfillment                           |\n"
    "| Checking `allSettled` results without checking `status` field                         | Always check `r.status === 'fulfilled'` before accessing `r.value`                      |\n"
    "| Using `Promise.any` when ALL failures should be an error                              | `Promise.any` throws `AggregateError` only if ALL reject — that's the intended behavior |",
    [
        ("`Promise.all` for dashboard with partial data tolerance",
         "`Promise.all` rejects immediately on the first failure — entire dashboard fails for one bad request",
         "`Promise.allSettled` — shows available data even if some requests fail"),
        ('`Promise.race` for "first successful CDN" (picks first to settle, including failures)',
         "`Promise.race` picks the first to SETTLE — including rejections; a failed CDN wins the race",
         "`Promise.any` — ignores rejections, returns first fulfillment"),
        ("Checking `allSettled` results without checking `status` field",
         "`allSettled` returns `{status, value/reason}` objects — accessing `.value` without checking status throws",
         "Always check `r.status === 'fulfilled'` before accessing `r.value`"),
        ("Using `Promise.any` when ALL failures should be an error",
         "`Promise.any` throws `AggregateError` only when ALL promises reject — that's by design",
         "Use `Promise.all` when any single failure should reject the whole group"),
    ]
))

SECTIONS.append((F22,
    "| ❌ Wrong                                         | ✅ Correct                                                                                  |\n"
    "| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |\n"
    "| `[...arr].sort(fn)` (copy before sort)           | `arr.toSorted(fn)` — same result, cleaner intent                                            |\n"
    "| `arr[index] = newValue; setItems(arr)` in React  | `setItems(arr.with(index, newValue))` — immutable update                                    |\n"
    "| Confusing `at(-1)` with `with()`                 | `at(-1)` reads the last element; `with(-1, v)` returns new array with last element replaced |\n"
    "| Using `toSpliced` expecting same API as `splice` | `splice` returns removed elements; `toSpliced` returns the new array (not removed elements) |",
    [
        ("`[...arr].sort(fn)` (copy before sort)",
         "Verbose — spread then sort is idiomatic but `toSorted` communicates immutability more clearly",
         "`arr.toSorted(fn)` — same result, cleaner intent"),
        ("`arr[index] = newValue; setItems(arr)` in React",
         "Mutates the state array reference — React doesn't detect the change and skips re-render",
         "`setItems(arr.with(index, newValue))` — immutable update, returns new reference"),
        ("Confusing `at(-1)` with `with()`",
         "Different operations: `at` reads, `with` replaces — easy to confuse negative-index semantics",
         "`at(-1)` reads the last element; `with(-1, v)` returns new array with last element replaced"),
        ("Using `toSpliced` expecting same API as `splice`",
         "`splice` returns the removed elements; `toSpliced` returns the new modified array",
         "`splice` returns removed elements; `toSpliced` returns the new array (not removed elements)"),
    ]
))

# ─────────────────────────────────────────────────────────────────────────────
# Apply all replacements
# ─────────────────────────────────────────────────────────────────────────────

stats = {}  # filename -> count

for (fname, old_block, rows) in SECTIONS:
    path = os.path.join(BASE, fname)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_block = make_table(rows)

    if old_block not in content:
        print(f"❌  NOT FOUND in {fname}:")
        print(repr(old_block[:120]))
        print()
        continue

    content = content.replace(old_block, new_block, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    stats[fname] = stats.get(fname, 0) + 1
    print(f"✅  {fname}: section replaced ({stats[fname]} so far)")

print("\n" + "="*60)
print("SUMMARY")
print("="*60)
total = 0
for fname, count in sorted(stats.items()):
    print(f"  {fname}: {count} section(s) converted")
    total += count
print(f"\nTotal sections converted: {total}/33")
