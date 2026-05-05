# Web Components & Shadow DOM Deep Dive — The Platform Beyond Frameworks

> **Track**: Frontend → Modern Platform | **Difficulty**: 🟢 → 🔴
> [⬅ Back to TOC](../../00-table-of-contents.md) | **Prev**: [Modern Platform Index](./README.md) | **Next**: [Real-time Collaboration](./02-realtime-collaboration-crdts.md)

---

## 🌍 Real-World Scenario — GitHub Ships 1,000+ Web Components

In 2024, **GitHub** revealed that nearly every interactive element on github.com — the file tree, code search modal, copilot chat panel, repo header tabs — is a **Custom Element**. They ship over **1,000 production Web Components** across the site. Why? GitHub's frontend started in 2008 (jQuery), survived a partial Rails view migration, then a React experiment, then Hotwire/Turbo. They needed UI primitives that **outlive any framework decade**. Web Components gave them that: a `<details-menu>` written in 2018 still works in 2026, no rewrite, no framework upgrade, no "deprecated since v18" headache.

Then **Adobe**, **Salesforce Lightning**, **YouTube**, **Apple Music web**, and **Photoshop on web** (via WASM + Custom Elements) followed. In 2025, **Shopify** rewrote its merchant admin design system **Polaris** as Web Components so the same primitives work in Liquid templates, Remix admin, and embedded iframe apps.

**Lesson**: Frameworks are **rental cars**. Web Components are **owned cars**. For a 10-year product, you eventually want to own.

> 🇻🇳 **Tóm tắt**: GitHub có >1000 Custom Elements production. Component viết năm 2018 vẫn chạy 2026, không cần migrate framework. Frameworks là xe thuê — Web Components là xe của bạn.

---

## A1. 🧠 Memory Hook — **"SCOPE"**

| Letter | Stands For                   | One-line                                          |
| ------ | ---------------------------- | ------------------------------------------------- |
| **S**  | **Shadow DOM**               | Style + DOM isolation by spec                     |
| **C**  | **Custom Elements**          | `class extends HTMLElement` lifecycle             |
| **O**  | **One-time registration**    | `customElements.define()` is global, irreversible |
| **P**  | **Properties vs Attributes** | Props = JS state, Attrs = string mirror           |
| **E**  | **ElementInternals**         | Form participation, ARIA, validation              |

> 🇻🇳 **Catchphrase**: _"SCOPE — đóng gói scope của style + DOM, framework đến rồi đi, component vẫn còn."_

---

## A2. 🎯 Why It Matters Now

1. **Framework fatigue is real (2026)**: React 19, Vue 3.5, Svelte 5, Solid 1.9 — every 18 months a "you must rewrite" cycle. Custom Elements are a **W3C standard**, not a vendor library.
2. **Design system distribution**: Shopify Polaris, Adobe Spectrum, IBM Carbon, SAP UI5 all now ship Web Components → consumable in **any** framework or no framework.
3. **Micro-frontend interop**: Module Federation needs a **neutral component contract**. Custom Elements ARE that contract — every framework can render `<my-button>`.

> 🇻🇳 **Tóm tắt**: Framework thay đổi 18 tháng/lần, Web Components là chuẩn W3C → design system viết 1 lần dùng mọi nơi, micro-frontend giao tiếp dễ dàng.

---

## A3. Layer 1 — Beginner: A Custom Element in 30 Lines

**Analogy**: A Custom Element is like a **LEGO brick with a serial number**. The browser registers the serial (`customElements.define`), and from then on, anywhere you drop `<my-brick>` in HTML, the browser knows exactly which class to instantiate.

```
┌──────────────────────────────────────────┐
│  HTML:  <hello-badge name="Nhi"></...>   │
│            │                              │
│            ▼                              │
│  Browser checks customElements registry  │
│            │                              │
│            ▼                              │
│  new HelloBadge()  ← your class           │
│            │                              │
│            ▼                              │
│  connectedCallback() fires                │
│            │                              │
│            ▼                              │
│  Renders into Shadow DOM (isolated)       │
└──────────────────────────────────────────┘
```

```js
class HelloBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const name = this.getAttribute("name") ?? "world";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; padding: 4px 8px;
                background: #0969da; color: white; border-radius: 4px; }
      </style>
      <span>Hello, ${name}!</span>
    `;
  }
}
customElements.define("hello-badge", HelloBadge);
```

Drop `<hello-badge name="Nhi"></hello-badge>` anywhere — Vanilla, React, Vue, Svelte, Astro, Markdown via MDX. It just works.

> 🇻🇳 **Ví dụ đời thường**: Giống cục LEGO có mã vạch. Browser scan mã, biết lắp class nào.

---

## A4. Layer 2 — Intermediate: 4 Core Concepts

### A4.1. Shadow DOM Isolation Modes

```
DOCUMENT
   │
   ├── <my-card>            ← host element (light DOM = children user wrote)
   │     │
   │     └── #shadow-root (open|closed)   ← encapsulated subtree
   │           │
   │           ├── <style>  ← scoped, no leak in/out
   │           ├── <slot>   ← projection point for light DOM
   │           └── <div>... ← internal markup
   │
   └── ::part(button)       ← exposed styling hook (CSS Shadow Parts)
```

- `mode: 'open'` → `el.shadowRoot` accessible from outside (90% of cases)
- `mode: 'closed'` → `el.shadowRoot === null` from outside (rarely needed; doesn't add real security, fights devtools)

### A4.2. Properties vs Attributes (the #1 source of bugs)

| Aspect     | Attribute                                         | Property                                |
| ---------- | ------------------------------------------------- | --------------------------------------- |
| Type       | Always string                                     | Any JS value (object, array, function)  |
| Where      | HTML markup                                       | JS instance                             |
| Reactivity | `attributeChangedCallback` + `observedAttributes` | Manual setter                           |
| Use for    | Static config (`role`, `data-id`)                 | Complex state (rich objects, callbacks) |

```js
class UserCard extends HTMLElement {
  static observedAttributes = ["theme"]; // attribute reactivity opt-in
  set user(obj) {
    this._user = obj;
    this._render();
  } // property — for objects
  get user() {
    return this._user;
  }
  attributeChangedCallback(name, old, val) {
    if (name === "theme") this._render(); // attribute — for strings
  }
}
```

**Rule of thumb**: Strings & flags → attributes. Objects, arrays, functions → properties.

### A4.3. Slots — Composition Without React Children

```html
<modal-dialog>
  <h2 slot="title">Delete repo?</h2>
  <p slot="body">This cannot be undone.</p>
  <button slot="footer">Confirm</button>
</modal-dialog>
```

```html
<!-- inside #shadow-root -->
<header><slot name="title"></slot></header>
<main><slot name="body"></slot></main>
<footer><slot name="footer"></slot><slot name="cancel"></slot></footer>
```

Default slot (`<slot></slot>`) catches unnamed children. `::slotted(p)` styles projected nodes (with limitations — only direct children selectors work).

### A4.4. Lifecycle Callbacks (the spec-defined hooks)

```
constructor()              → Element instance created (NEVER touch attrs/children here)
connectedCallback()        → Inserted into DOM (do work, fetch, render)
disconnectedCallback()     → Removed from DOM (cleanup listeners, abort fetches)
attributeChangedCallback() → observed attr changed (string → string)
adoptedCallback()          → Moved to a new document (rare; iframe scenarios)
formAssociatedCallback()   → Attached to a <form>  (ElementInternals)
formResetCallback()        → Form reset event
formStateRestoreCallback() → Browser autofill / back-forward cache
```

> 🇻🇳 **Bẫy phổ biến**: Đụng vào `this.children` trong constructor → crash. Children chưa parse xong. Dùng `connectedCallback()`.

---

## A5. Layer 3 — Senior/Staff: 5 Hard Problems

### A5.1. CSS Boundary Penetration — Theming Isolated Components

Shadow DOM blocks external stylesheets by design. But you NEED themes. Three levels of permeability:

| Mechanism                                        | Penetrates Shadow?    | Use Case                    |
| ------------------------------------------------ | --------------------- | --------------------------- |
| Regular CSS rule (`.button`)                     | ❌ Blocked            | —                           |
| **CSS Custom Properties** (`--brand-color`)      | ✅ Inherits through   | Theme tokens                |
| **`::part()` selector**                          | ✅ Explicitly exposed | Granular structural styling |
| `::slotted()`                                    | ✅ But only top-level | Style projected children    |
| Constructable Stylesheets (`adoptedStyleSheets`) | ✅ Programmatic       | Shared design system styles |

```js
// Inside component
:host { color: var(--brand-color, #333); }
<button part="primary-btn">

// Outside (consumer)
my-card { --brand-color: #0969da; }
my-card::part(primary-btn) { border-radius: 999px; }
```

### A5.2. Form-Associated Custom Elements (FACE) — The 2022+ Game Changer

Pre-2022, custom elements couldn't participate in forms. Today, with `ElementInternals`, you build native-feeling form controls.

```js
class StarRating extends HTMLElement {
  static formAssociated = true; // OPT IN
  constructor() {
    super();
    this._internals = this.attachInternals();
    this.attachShadow({ mode: "open" });
  }
  set value(v) {
    this._internals.setFormValue(v); // submitted with form
    if (!v) this._internals.setValidity({ valueMissing: true }, "Required");
    else this._internals.setValidity({});
  }
  get form() {
    return this._internals.form;
  }
  get validity() {
    return this._internals.validity;
  }
  get validationMessage() {
    return this._internals.validationMessage;
  }
  // browser sets disabled, readonly, name automatically
}
customElements.define("star-rating", StarRating);
```

Now `<form><star-rating name="quality" required></star-rating></form>` submits and validates natively.

### A5.3. Hydration & SSR — The Declarative Shadow DOM (DSD) Solution

Problem: SSR can't render Shadow DOM with old API (it's runtime-only). Solution: **Declarative Shadow DOM** (Chrome 90+, Safari 16.4+, FF 123+).

```html
<my-card>
  <template shadowrootmode="open">
    <style>
      :host {
        padding: 16px;
      }
    </style>
    <h3><slot name="title"></slot></h3>
    <slot></slot>
  </template>
  <span slot="title">SSR'd</span>
  <p>Body content here</p>
</my-card>
```

Server emits this HTML directly. Browser parses `<template shadowrootmode="open">` → attaches as shadow root **before JS loads**. Zero hydration flash. Works with Astro, Eleventy, Lit-SSR, Enhance.dev.

### A5.4. Memory Leaks at Scale

Custom Elements that add listeners to `window`, `document`, or shared services WILL leak if `disconnectedCallback` doesn't clean up. At GitHub-scale (1000s of element instances per page-life), this is fatal.

```js
class LiveTimer extends HTMLElement {
  connectedCallback() {
    this._tick = () => this._update();
    document.addEventListener("visibilitychange", this._tick);
    this._interval = setInterval(this._tick, 1000);
  }
  disconnectedCallback() {
    document.removeEventListener("visibilitychange", this._tick);
    clearInterval(this._interval);
    // CRITICAL — null out closures that hold refs back to `this`
    this._tick = null;
  }
}
```

Use `AbortController` for terser cleanup:

```js
connectedCallback() {
  this._abort = new AbortController();
  document.addEventListener('click', this.onClick, { signal: this._abort.signal });
}
disconnectedCallback() { this._abort.abort(); }
```

### A5.5. Framework Interop Gotchas

| Framework     | Property Binding                    | Event Binding                         | Pain Point                                    |
| ------------- | ----------------------------------- | ------------------------------------- | --------------------------------------------- |
| **React ≤18** | Coerces all to attrs (string only!) | `on*` synthetic, custom events broken | Use refs + `useEffect` to set props/listeners |
| **React 19**  | ✅ Native CE props + events         | ✅ Camel-case events                  | Finally first-class (2024)                    |
| **Vue 3**     | `:my-prop` works                    | `@my-event` works                     | Configure `compilerOptions.isCustomElement`   |
| **Svelte**    | `bind:` works                       | Native                                | Native interop, almost zero friction          |
| **Angular**   | Property binding ok                 | Native events                         | Add `CUSTOM_ELEMENTS_SCHEMA`                  |
| **Lit**       | Native                              | Native                                | Lit IS Web Components — no friction           |

---

## A6. ⚠️ Common Mistakes (Top 10 Pitfalls)

| ❌ Sai lầm                                       | 🤔 Tại sao sai                                             | ✅ Đúng là                                       |
| ------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------ |
| Touch `this.children` in `constructor()`         | Children chưa parse xong → undefined                       | Move to `connectedCallback()`                    |
| Set complex objects via `setAttribute`           | Object bị stringify thành `[object Object]`                | Dùng property setter, không phải attribute       |
| Forget `customElements.define` is **one-time**   | Define lần 2 cùng tag → throws                             | Wrap với `if (!customElements.get('x'))`         |
| Closed Shadow DOM "for security"                 | Devtools vẫn thấy, Reflection vẫn lấy được                 | Default `open`; closed chỉ là discipline marker  |
| Style với `:root { --x: red }` mong xuyên Shadow | `:root` không xuyên Shadow boundary                        | Style trên `:host` hoặc inherit through CSS vars |
| Quên `disconnectedCallback` cleanup              | Listener trên `window`/`document` giữ `this` → memory leak | `AbortController` + null out refs                |
| React `<my-el data={obj}>` (≤18)                 | Object stringified → broken                                | `useEffect` + `ref.current.data = obj`           |
| Slot styling: `slot p { color: red }`            | Slot không thấy projected content's CSS                    | `::slotted(p)` (top-level only)                  |
| `shadowRoot.innerHTML += '<x>'` mỗi update       | Re-parse toàn bộ → mất state, slow                         | Diff/template literal qua Lit hoặc lit-html      |
| SSR Web Component không dùng DSD                 | Hydration flash + a11y issue                               | `<template shadowrootmode="open">`               |

---

## A7. 🎤 Interview Pattern

**Strong signals interviewers listen for**:

- Bạn phân biệt rõ **property vs attribute** (90% candidates lẫn lộn)
- Biết khi nào dùng Web Components vs framework component (long-lived design system, cross-framework, micro-frontend interop)
- Trade-offs Shadow DOM (a11y nuances, focus management across boundary, slow `attachShadow` ở lượng lớn)
- Đề cập **Declarative Shadow DOM** + **ElementInternals** = đang theo dõi spec 2022-2024

**Role types asking this**: Senior FE, Staff FE, Design System Engineer, Platform/Infra FE, anyone touching micro-frontends.

**Industries**: Big tech with old codebases (GitHub, Adobe, Salesforce, Microsoft), e-commerce platforms (Shopify, BigCommerce), enterprise SaaS, gov tech, embeddable widgets (Stripe Elements, Intercom Messenger, Twilio Flex).

---

## A8. 🔗 Knowledge Chain

**Prerequisites**: HTML semantics, CSS specificity, JS classes & prototypes, DOM APIs, ES modules.

**Unlocks**: Micro-frontends architecture (file 03), Design system engineering, Lit framework, Stencil, FAST, embedded widget engineering, Astro Islands.

**Cross-track links**:

- → [React 19](../03-react/02-react-19-features-theory.md) — native CE support
- → [Micro-frontends @ Scale](./03-micro-frontends-scale.md)
- → [Accessibility](../11-accessibility/02-aria.md) — focus management across Shadow boundary
- → [SSR/RSC](../../2026-trends/06-react-server-components-2026.md) — DSD comparison

---

# B. Interview Questions — 10 Graded

---

## B1. 🟢 What is a Custom Element vs a Web Component? (L1)

**Answer (90 sec)**: "Web Components" is an **umbrella term** for 3 specs: (1) **Custom Elements** — JS API to define new HTML tags via `customElements.define('my-tag', class extends HTMLElement)`; (2) **Shadow DOM** — encapsulated subtree with style + DOM isolation; (3) **HTML Templates** (`<template>`, `<slot>`) — declarative inert markup. You can use Custom Elements _without_ Shadow DOM (called "light DOM CE", common when you need global CSS), and you can use Shadow DOM on built-in elements via `attachShadow` (well, not really — only certain elements). The "Web Component" label means using all three together.

> 💡 **Interview Signal**: ✅ Strong = enumerates 3 specs and notes they're independent. ❌ Weak = "It's a custom HTML tag like React component."

---

## B2. 🟢 Property vs Attribute — give an example where it matters. (L1)

**Answer**: Attributes are always strings; properties are any JS value.

```html
<user-card user='{"name":"Nhi"}'></user-card> ❌ string, must JSON.parse
```

```js
document.querySelector('user-card').user = { name: 'Nhi' };   ✅ real object
```

If you do `card.setAttribute('user', userObj)`, it stringifies to `[object Object]`. The component must define a `user` property setter that handles objects, and reflect to attribute _only if_ the value is serializable.

> 💡 **Interview Signal**: ✅ Strong = mentions `[object Object]` foot-gun + reflection rule. ❌ Weak = "they're the same thing."

---

## B3. 🟢 What does Shadow DOM `mode: 'closed'` actually protect against? (L2)

**Answer**: Almost nothing. `closed` makes `el.shadowRoot` return `null` to outside callers, but: (1) DevTools still inspects it; (2) `el.attachShadow({mode:'closed'})` **returns** the root to whoever called it, so any leaked closure exposes it; (3) extensions and Puppeteer have full access. It's a **discipline marker** ("don't poke inside this"), not a security boundary. Default to `open` so library consumers can extend behavior. Use `closed` only when you genuinely want to discourage tampering in a framework you author.

> 💡 **Interview Signal**: ✅ Strong = "not a security feature, devtools still see it." ❌ Weak = "closed is for security."

---

## B4. 🟡 How do you style a Web Component from outside? Cover the 4 mechanisms. (L3)

**Answer**:

1. **CSS Custom Properties** — inherit through Shadow DOM. Component author does `color: var(--brand, #333)`; consumer sets `--brand: red` on host. Best for design tokens.
2. **`::part()`** — author opts in with `<button part="cta">`; consumer does `my-el::part(cta) { ... }`. Best for granular structural styling without exposing internals.
3. **`::slotted(selector)`** — styles light-DOM children projected via `<slot>`, but only top-level (`::slotted(p)` ✅, `::slotted(div p)` ❌).
4. **Constructable Stylesheets / `adoptedStyleSheets`** — programmatically share `CSSStyleSheet` instances across many shadow roots. Best for design-system-wide styles (saves memory, one parse).

The hidden 5th: **inheritable CSS properties** (color, font, line-height, direction) cross the boundary by default.

> 💡 **Interview Signal**: ✅ Strong = lists all 4 + mentions inheritable properties + tradeoffs. ❌ Weak = "you can't, that's the point."

---

## B5. 🟡 Walk through how you'd build a `<rich-select>` form-associated component. (L3)

**Answer**: Use `ElementInternals`:

```js
class RichSelect extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ["name", "required", "disabled"];
  constructor() {
    super();
    this._internals = this.attachInternals();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this._render();
    this._wireEvents();
  }
  set value(v) {
    this._value = v;
    this._internals.setFormValue(v ?? "");
    this._validate();
  }
  get value() {
    return this._value;
  }
  get form() {
    return this._internals.form;
  }
  get validity() {
    return this._internals.validity;
  }
  get validationMessage() {
    return this._internals.validationMessage;
  }
  checkValidity() {
    return this._internals.checkValidity();
  }
  reportValidity() {
    return this._internals.reportValidity();
  }
  _validate() {
    if (this.hasAttribute("required") && !this._value) {
      this._internals.setValidity({ valueMissing: true }, "Please choose an option");
    } else {
      this._internals.setValidity({});
    }
  }
  formResetCallback() {
    this.value = null;
  }
  formStateRestoreCallback(state) {
    this.value = state;
  } // browser back/forward
}
```

Now it submits with the form, participates in `<label>`, focuses on validation error, and announces to screen readers via `_internals.role` + `_internals.ariaSelected`.

> 💡 **Interview Signal**: ✅ Strong = covers `formAssociated`, `setFormValue`, `setValidity`, `formResetCallback`, ARIA via internals. ❌ Weak = uses hidden `<input>` hack.

---

## B6. 🟡 Why does your Custom Element leak memory in a SPA? (L4)

**Answer**: Three classic causes:

1. **Global listeners not cleaned**: `connectedCallback` adds `window.addEventListener('resize', this.onResize)`; `disconnectedCallback` doesn't remove. The listener closure holds `this`, GC can't collect.
2. **Timers/intervals**: `setInterval` references `this`, never cleared.
3. **External pub/sub**: Subscribed to a Redux store / event bus / WebSocket; no `unsubscribe()` on disconnect.

Fix pattern:

```js
connectedCallback() {
  this._ac = new AbortController();
  const { signal } = this._ac;
  window.addEventListener('resize', this.onResize, { signal });
  this._sub = store.subscribe(this.onState);
}
disconnectedCallback() {
  this._ac.abort();
  this._sub();   // unsubscribe
  this._ac = this._sub = null;
}
```

Bonus: If element is moved between documents (`adoptedCallback`), you re-fire connect/disconnect — handle reconnection idempotently.

> 💡 **Interview Signal**: ✅ Strong = lists all 3 sources + AbortController pattern + adopted edge case. ❌ Weak = "use weak refs."

---

## B7. 🟡 Compare Web Components vs React components for a 5-team design system. (L4)

**Answer**:

| Dimension           | Web Components                              | React Components                                    |
| ------------------- | ------------------------------------------- | --------------------------------------------------- |
| **Cross-framework** | ✅ Works in any/no framework                | ❌ React-only (or wrap with WC)                     |
| **Lifespan**        | W3C spec, no breaking changes               | React migrates every major (refs, suspense, server) |
| **DX**              | Verbose without Lit/Stencil; manual diff    | JSX, hooks, ecosystem                               |
| **SSR**             | DSD (newer, less mature)                    | Battle-tested SSR + RSC                             |
| **Bundle size**     | ~0 (native) or 5KB Lit                      | React ~45KB + ReactDOM                              |
| **Type safety**     | Manual; tooling weaker                      | First-class TS, generics, JSX                       |
| **Theming**         | CSS vars + `::part`                         | Context, CSS-in-JS                                  |
| **A11y**            | Need to manage focus across Shadow boundary | Same DOM tree, simpler                              |

**Recommendation for 5-team DS**: **Lit-based Web Components**. Give every team — React, Vue, vanilla, embedded iframe — the _same_ `<ds-button>`. Wrap in React/Vue adapters if teams want JSX ergonomics. This is exactly what **Adobe Spectrum** and **Shopify Polaris** chose post-2023.

> 💡 **Interview Signal**: ✅ Strong = comparative table + recommends WC for cross-framework + names real DS examples. ❌ Weak = "React is better because hooks."

---

## B8. 🔴 Design: A `<spreadsheet-grid>` Web Component handling 100k rows. (L5)

**Answer (5 min structured)**:

**Constraints**: 100k rows × 50 cols = 5M cells. Naïve render = 30s + 2GB RAM. Target: <100ms first paint, smooth 60fps scroll, framework-agnostic.

**Architecture**:

```
<spreadsheet-grid data-source-url="/api/cells">
  ├── #shadow-root (open)
  │   ├── <div class="viewport"> ← 600px tall, scrollable
  │   │   └── <div class="canvas"> ← height = 100000 * 24px (virtual)
  │   │       └── <div class="window" style="transform: translateY(...)">
  │   │           └── 30 visible rows only ← virtualized
  │   ├── <slot name="toolbar"></slot>
  │   └── <style>...</style>
  └── ElementInternals → role=grid, aria-rowcount=100000
```

**Key decisions**:

1. **Virtualization**: Only render 30 visible rows. Use `IntersectionObserver` on sentinel rows for prefetch.
2. **Off-main-thread**: Heavy data parsing in `Worker`; transfer via `Comlink` or `MessageChannel`. Cells = `SharedArrayBuffer` (`Int32Array` for numeric).
3. **Property API**, not attribute: `grid.dataSource = asyncIterable` — attributes can't carry 5M values.
4. **Custom events**: `<spreadsheet-grid>` emits `cell-edit`, `selection-change`, `scroll-end` (composed: true, bubbles: true to cross Shadow).
5. **Theming via CSS vars**: `--cell-padding`, `--header-bg`, `--selected-color`. Expose `::part(cell)`, `::part(header-row)` for granular override.
6. **A11y**: `_internals.role = 'grid'`, `_internals.ariaRowCount = 100000`. Manage focus with `tabindex=-1` on cells + roving tabindex pattern. Screen readers announce row/col on focus.
7. **Form participation**: `formAssociated = true` so `<form>` submits selected range as JSON.
8. **SSR**: Render first 30 rows via DSD so non-JS users + crawlers see content. Hydrate from there.

**Trade-offs**:

- ❌ No framework reactivity → must hand-write reconciliation. Mitigate: use Lit + `lit-html` for templating (5KB).
- ❌ Shadow DOM blocks user's stylesheets → exposed `::part` for every customizable surface; documented contract.
- ❌ Scroll perf in Safari < Chrome → use `transform: translate3d` to force GPU layer.

**Counterintuitive insight**: For 100k rows, **don't use Shadow DOM for cells** — use Shadow only for the chrome (header, scrollbar, toolbar) and render cells in **light DOM**. Why? `attachShadow` per cell is ~100µs; 5M cells × 100µs = 500 seconds. Shadow encapsulation must be coarse-grained at this scale.

**Exit criteria**: Lighthouse perf ≥ 90, scroll ≥ 55fps p95 on M1, axe-core 0 violations, works in React/Vue/vanilla demo apps.

> 💡 **Interview Signal**: ✅ Strong = virtualization + Worker + property API + DSD + counterintuitive Shadow scope decision. ❌ Weak = "use react-window."

---

## B9. 🔴 Diagnose: A consumer reports `my-modal` doesn't trap focus and breaks Tab order. (L5)

**Answer**: Three likely causes, investigate in order:

1. **Focus traversal across Shadow boundary**: Browser Tab moves through tabbable elements per _flat tree_ (light + shadow combined). If your modal's first tabbable lives inside Shadow, fine — but if you have `tabindex="-1"` host with no `delegatesFocus: true`, focus enters Shadow and gets stuck.
   - **Fix**: `attachShadow({ mode: 'open', delegatesFocus: true })`. Now focusing the host auto-focuses first focusable inside.

2. **Manual focus trap broken by Shadow query**: Common code does `modal.querySelectorAll('button, [href], input, ...')` to find tabbables. But `querySelectorAll` doesn't pierce Shadow. Inside-shadow tabbables are missed → Tab escapes the modal.
   - **Fix**: Recursive query: walk `node.shadowRoot ?? node` for each child. Or use `inert` attribute on everything outside the modal — browser handles trap natively (Chrome 102+).

3. **Inert + Dialog element**: As of 2024, the right answer is **don't roll your own**. Use `<dialog>` element via `_internals.role = 'dialog'` _or_ host a real `<dialog>` inside Shadow and call `.showModal()`. Browser handles focus trap, ESC dismiss, scroll lock, top layer.

Recommended path: Refactor to use `<dialog>` natively or polyfill. Ship a fix in 1 day, not a 200-line focus-trap library.

> 💡 **Interview Signal**: ✅ Strong = mentions `delegatesFocus`, flat tree, `inert`, native `<dialog>` recommendation. ❌ Weak = adds more JS to the trap loop.

---

## B10. 🔴 Pitch to leadership: Migrate our React design system to Web Components. (L6)

**Answer (4 min structured)**:

> "I'm proposing we evolve our React-only `@company/ui` package into framework-agnostic Web Components, distributed as `<ds-*>` elements with thin React/Vue/Svelte wrappers."

**Why now ($ + metrics)**:

- We have **3 frameworks in production**: React (web app), Vue (admin), Astro (marketing). Today we maintain 3 separate Button components — **$420K/year in eng cost**, drift between platforms, inconsistent a11y audits.
- Marketing site uses **stale React 17** because upgrading breaks 4 internal apps. WC freezes the contract → marketing upgrades runtime independently.
- Acquisition target (Acme Corp) ships Angular. Without WC, integration estimate = **6 engineer-months** to reskin. With WC = 2 weeks (just consume our `<ds-*>` tags).

**How (technical plan)**:

1. Adopt **Lit** (5KB, TS-first, reactive props) as authoring layer. Not raw `HTMLElement`.
2. Lift logic from React components to Lit; React components become **30-line wrappers** calling the WC. Zero breaking change for current consumers.
3. Use `::part` + CSS custom properties for theming. Document the surface contract.
4. Form controls use `ElementInternals`. Test in React Hook Form, Formik, native forms.
5. SSR via Lit-SSR + Declarative Shadow DOM. Lighthouse parity required.
6. Accessibility: axe-core zero violations gate. Manual NVDA/VoiceOver pass on top 10 components.

**Risks + mitigations**:

- ❌ React 18 has flaky CE prop interop → use ref-based prop bridge in wrapper. React 19 is native.
- ❌ Team unfamiliar with WC → 2-week training, pair programming, internal docs. Lit's hooks-like decorators feel close to React.
- ❌ Bundle increases 5KB (Lit) → offset by removing duplicate component code across 3 frameworks; net **−40KB** average.

**Phased rollout (6 months)**:

- M1-2: Migrate 5 atomic components (Button, Input, Badge, Avatar, Icon). Behind feature flag.
- M3-4: Migrate molecules (Dialog, Menu, Combobox, DatePicker). Form-associated for inputs.
- M5: Marketing site fully migrated; sunset duplicated code.
- M6: Open-source + use as Acme integration vehicle.

**Counterintuitive insight**: This isn't "rewrite our DS in 2026's hot tech." It's **building an asset that survives the next React/Vue/Svelte cycle**. In 2030 we'll be glad. In 2026 we save $300K/year and unlock acquisitions.

**Exit criteria**: All 3 frameworks consume same WC. Lighthouse ≥ existing. axe = 0. Bundle ≤ existing − 30KB. Eng cost ≤ existing − 40%.

> 💡 **Interview Signal**: ✅ Strong = $ numbers + acquisition angle + risk mitigation + phased plan + counterintuitive framing. ❌ Weak = "Web Components are the future."

---

# C. Memorization Pack

## C1. 📇 Topic Card

```
┌────────────────────────────────────────────────────┐
│  WEB COMPONENTS & SHADOW DOM                       │
│                                                     │
│  Mnemonic:  S-C-O-P-E                               │
│  • Shadow DOM     — isolation by spec               │
│  • Custom Elements — class extends HTMLElement      │
│  • One-time define — global, irreversible           │
│  • Property/Attr   — JS state vs string mirror      │
│  • ElementInternals — forms, ARIA, validation       │
│                                                     │
│  Big idea: Own the contract. Frameworks rent.       │
│  Owner-uses: GitHub, Adobe, Shopify, Salesforce.    │
└────────────────────────────────────────────────────┘
```

## C2. 📊 Q&A Summary Table

| #   | Question                              | Difficulty | Bloom      | Key Phrase                            |
| --- | ------------------------------------- | ---------- | ---------- | ------------------------------------- |
| B1  | Custom Element vs Web Component       | 🟢 L1      | Remember   | 3 specs umbrella                      |
| B2  | Property vs Attribute                 | 🟢 L1      | Understand | `[object Object]` foot-gun            |
| B3  | What does `closed` Shadow protect?    | 🟢 L2      | Understand | Discipline, not security              |
| B4  | Style WC from outside (4 ways)        | 🟡 L3      | Apply      | vars, parts, slotted, sheets          |
| B5  | Build form-associated component       | 🟡 L3      | Apply      | `formAssociated = true`               |
| B6  | Memory leak diagnosis                 | 🟡 L4      | Analyze    | AbortController + null refs           |
| B7  | WC vs React for 5-team DS             | 🟡 L4      | Evaluate   | Lit + framework wrappers              |
| B8  | Design `<spreadsheet-grid>` 100k rows | 🔴 L5      | Create     | Coarse-grain Shadow scope             |
| B9  | Diagnose modal focus trap broken      | 🔴 L5      | Analyze    | `delegatesFocus`, `inert`, `<dialog>` |
| B10 | Pitch DS migration to WC              | 🔴 L6      | Evaluate   | $420K save + acquisition              |

## C3. 🎙 Cold-Call (30-second pitch)

> "Web Components are W3C-standard custom HTML tags with three pieces — **S**hadow DOM for isolation, **C**ustom Elements for the class API, **O**ne-time global registration, **P**roperty vs attribute distinction, and **E**lementInternals for form participation. SCOPE. Companies like GitHub and Shopify use them because a `<my-button>` you write today still works in 2030 — frameworks come and go, the platform doesn't. The killer use cases are design systems shared across multiple frameworks, micro-frontends needing a neutral contract, and embedded widgets like Stripe Elements. Trade-off: more verbose without Lit, weaker SSR story until Declarative Shadow DOM (now landed in all browsers), and React ≤18 has prop coercion bugs — fixed in React 19."

## C4. ✅ Self-Check Quiz (5 items)

1. Why can't you set `<user-card user={obj}>` directly via attribute? → _Attribute coerces to string `"[object Object]"`._
2. Which Shadow DOM mode lets DevTools inspect the tree? → _Both. `closed` only blocks `el.shadowRoot`, not DevTools._
3. How does a CSS variable like `--brand` reach inside a Shadow root? → _CSS custom properties inherit through the Shadow boundary._
4. What spec lets a `<rich-select>` participate in form submission? → _`ElementInternals` + `static formAssociated = true` + `setFormValue()`._
5. What's the SSR solution for Shadow DOM? → _Declarative Shadow DOM — `<template shadowrootmode="open">`._

## C5. 🧒 Feynman Test (~250 words, VI)

Hãy tưởng tượng bạn đang xây nhà bằng LEGO. Mỗi cục LEGO có một mã số riêng (ví dụ "cục cửa sổ xanh 2x4"). Khi bạn cần xây cửa sổ, bạn không cần biết bên trong cục đó được làm thế nào — chỉ cần lắp vào là xong. Web Components hoạt động đúng như vậy: bạn định nghĩa một cục LEGO mới (ví dụ `<my-button>`), đăng ký mã số với trình duyệt một lần (`customElements.define`), từ đó về sau bất cứ trang HTML nào dùng `<my-button>` thì trình duyệt biết phải tạo ra cái gì.

Phần "bên trong cục LEGO" được gọi là **Shadow DOM**. Đây là một thế giới riêng, CSS bên ngoài không vào được, CSS bên trong không thoát ra. Giống như cục LEGO làm bằng nhựa cứng — ai sơn bên ngoài cũng không thấm vào trong. Chỉ những "cửa sổ" mà bạn cố ý chừa ra (gọi là `::part` và CSS variables) mới cho phép người dùng đổi màu, đổi kích thước.

Tại sao quan trọng? Vì framework như React, Vue thay đổi mỗi 2 năm. Nhưng Web Components là **chuẩn của trình duyệt**, viết một lần xài 10 năm. GitHub có hơn 1000 component như vậy — code viết năm 2018 vẫn chạy ngon năm 2026, không cần migrate. Khi công ty bạn có nhiều team dùng nhiều framework khác nhau, Web Components là **ngôn ngữ chung** mà ai cũng nói được. Đó là lý do Shopify, Adobe, Salesforce đều chọn hướng này cho design system của họ.

## C6. 📅 Spaced Repetition Schedule

| Day           | Action                                                                            |
| ------------- | --------------------------------------------------------------------------------- |
| **Day 1**     | Read full file. Write a `<hello-badge>` from scratch in CodePen.                  |
| **Day 3**     | Recall SCOPE mnemonic without looking. Write Q&A for B1-B5.                       |
| **Day 7**     | Build form-associated `<rating-stars>`. Test in real `<form>`.                    |
| **Day 14**    | Whiteboard B8 spreadsheet design. Time-box 25 min.                                |
| **Day 30**    | Teach B7 (WC vs React) to a peer. Refine pitch.                                   |
| **Quarterly** | Re-read; check for new specs (CSS Anchor Positioning, View Transitions API + WC). |

## C7. 🗺 Connections Map

**Same track (FE)**:

- [Modern Platform Index](./README.md)
- [Real-time Collaboration](./02-realtime-collaboration-crdts.md) — CRDTs in WC contexts
- [Micro-frontends @ Scale](./03-micro-frontends-scale.md) — WC as MFE contract
- [React 19 Features](../03-react/02-react-19-features-theory.md) — native CE support
- [Accessibility ARIA](../11-accessibility/02-aria.md) — focus across Shadow boundary
- [CSS Modern Features](../05-html-css/06-modern-css-features.md) — `::part`, `:host`, `::slotted`

**Cross-track**:

- [2026: React Server Components](../../2026-trends/06-react-server-components-2026.md) — DSD parallel
- [2026: WebAssembly FE+BE](../../2026-trends/07-webassembly-fe-be.md) — Photoshop-on-web pattern
- [BE: API Design](../../be-track/02-backend-knowledge/01-api-design.md) — embeddable widget contracts

**Further reading**:

- [Custom Elements Everywhere](https://custom-elements-everywhere.com/) — framework interop scoreboard
- [Lit](https://lit.dev/) — minimal authoring layer
- [Open WC](https://open-wc.org/) — testing & best practices
- [WHATWG HTML spec — Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- GitHub's [Catalyst](https://github.github.io/catalyst/) — their internal WC library
- Shopify [Polaris Web Components](https://shopify.dev/docs/api/app-home)

---

[⬅ Back to TOC](../../00-table-of-contents.md) | **Next**: [Real-time Collaboration with CRDTs →](./02-realtime-collaboration-crdts.md)
