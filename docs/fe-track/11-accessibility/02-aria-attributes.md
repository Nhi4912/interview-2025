# ARIA Attributes - Accessible Rich Internet Applications


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> ARIA provides semantics for custom components. First rule: Don't use ARIA if native HTML works.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARIA FUNDAMENTALS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   RULES OF ARIA:                                                 │
│   ─────────────                                                  │
│   1. Don't use ARIA if native HTML works                        │
│   2. Don't change native semantics                               │
│   3. All ARIA controls must be keyboard accessible              │
│   4. Don't use role="presentation" on focusable elements        │
│   5. All interactive elements must have accessible name         │
│                                                                   │
│   ARIA CATEGORIES:                                               │
│   ────────────────                                               │
│   Roles      ──▶ What element IS (button, dialog, tab)          │
│   States     ──▶ Current condition (expanded, checked)          │
│   Properties ──▶ Characteristics (label, describedby)           │
│                                                                   │
│   PREFER NATIVE:                                                 │
│   ❌ <div role="button">              ✅ <button>               │
│   ❌ <span role="link">               ✅ <a href>               │
│   ❌ <div role="checkbox">            ✅ <input type="checkbox">│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 ARIA Roles

### Landmark Roles

```html
<!-- Landmarks help screen reader users navigate -->

<header role="banner">
    <nav role="navigation">...</nav>
</header>

<main role="main">
    <section role="region" aria-label="Featured Products">...</section>
</main>

<aside role="complementary">...</aside>

<footer role="contentinfo">...</footer>

<!-- Note: HTML5 elements have implicit roles -->
<!-- <header> = role="banner" (when not nested) -->
<!-- <nav> = role="navigation" -->
<!-- <main> = role="main" -->
<!-- <aside> = role="complementary" -->
<!-- <footer> = role="contentinfo" (when not nested) -->

<!-- Use role explicitly when semantic element not appropriate -->
<div role="search">
    <input type="search" aria-label="Search site">
</div>
```

### Widget Roles

```html
<!-- Buttons -->
<div role="button" tabindex="0">Custom Button</div>

<!-- Tabs -->
<div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
    <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>
<div role="tabpanel" id="panel1">Content 1</div>
<div role="tabpanel" id="panel2" hidden>Content 2</div>

<!-- Menu -->
<button aria-haspopup="menu" aria-expanded="false">
    Options
</button>
<ul role="menu">
    <li role="menuitem">Edit</li>
    <li role="menuitem">Delete</li>
    <li role="separator"></li>
    <li role="menuitem">Settings</li>
</ul>

<!-- Dialog -->
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
    <h2 id="dialog-title">Confirm Action</h2>
    <p>Are you sure?</p>
    <button>Yes</button>
    <button>No</button>
</div>

<!-- Slider -->
<div role="slider"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Volume"
     tabindex="0">
</div>
```

---

## 🔄 ARIA States

### Common States

```html
<!-- Expanded/Collapsed -->
<button aria-expanded="false" aria-controls="menu">
    Toggle Menu
</button>
<ul id="menu" hidden>...</ul>

<!-- Selected -->
<li role="option" aria-selected="true">Selected Item</li>
<li role="option" aria-selected="false">Other Item</li>

<!-- Checked -->
<div role="checkbox" aria-checked="true" tabindex="0">
    Accept terms
</div>
<!-- Tri-state: "true", "false", "mixed" -->

<!-- Pressed (toggle buttons) -->
<button aria-pressed="true">Bold</button>
<button aria-pressed="false">Italic</button>

<!-- Disabled -->
<button aria-disabled="true">Submit</button>
<!-- Note: aria-disabled keeps element focusable, disabled attr doesn't -->

<!-- Hidden -->
<div aria-hidden="true">Decorative content</div>
<!-- Removes from accessibility tree but still visible -->

<!-- Busy -->
<div role="status" aria-busy="true">Loading...</div>

<!-- Invalid -->
<input aria-invalid="true" aria-errormessage="error1">
<span id="error1">This field is required</span>
```

---

## 📝 ARIA Properties

### Labeling

```html
<!-- aria-label: Invisible label -->
<button aria-label="Close dialog">
    <svg>...</svg>  <!-- Icon only button -->
</button>

<!-- aria-labelledby: Reference visible element -->
<h2 id="section-title">User Settings</h2>
<form aria-labelledby="section-title">...</form>

<!-- aria-describedby: Additional description -->
<input type="password"
       aria-describedby="password-hint password-error">
<span id="password-hint">Must be 8+ characters</span>
<span id="password-error">Password is too weak</span>

<!-- Multiple references (space-separated) -->
<button aria-describedby="hint1 hint2">Submit</button>
```

### Relationships

```html
<!-- aria-controls: Element controls another -->
<button aria-controls="panel" aria-expanded="false">
    Toggle Panel
</button>
<div id="panel">Panel content</div>

<!-- aria-owns: Establishes parent-child when DOM doesn't -->
<div role="listbox" aria-owns="option1 option2">
    <!-- Options might be portaled elsewhere -->
</div>
<div id="option1" role="option">Option 1</div>
<div id="option2" role="option">Option 2</div>

<!-- aria-activedescendant: Currently active child -->
<ul role="listbox"
    tabindex="0"
    aria-activedescendant="option2">
    <li id="option1" role="option">Option 1</li>
    <li id="option2" role="option">Option 2 (active)</li>
</ul>

<!-- aria-flowto: Reading order override -->
<div aria-flowto="next-section">Read this first</div>
<div id="next-section">Then this</div>
```

---

## 📢 Live Regions

### Announcements

```html
<!-- role="status": Polite announcements (waits for pause) -->
<div role="status" aria-live="polite">
    3 items added to cart
</div>

<!-- role="alert": Assertive (interrupts immediately) -->
<div role="alert">
    Session will expire in 1 minute!
</div>

<!-- aria-live values -->
<div aria-live="off">No announcements</div>
<div aria-live="polite">Wait for pause</div>
<div aria-live="assertive">Interrupt immediately</div>

<!-- aria-atomic: Announce entire region or just changes -->
<div aria-live="polite" aria-atomic="true">
    Cart total: $50.00  <!-- Announces full text -->
</div>

<!-- aria-relevant: What changes to announce -->
<div aria-live="polite" aria-relevant="additions removals">
    <!-- Announces when items added/removed -->
</div>
```

### React Implementation

```jsx
function LiveRegion() {
    const [message, setMessage] = useState('');

    const addToCart = () => {
        // Add to cart logic
        setMessage('Item added to cart');

        // Clear message after announcement
        setTimeout(() => setMessage(''), 1000);
    };

    return (
        <>
            <button onClick={addToCart}>Add to Cart</button>

            {/* Live region - always in DOM */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {message}
            </div>
        </>
    );
}

// CSS for screen reader only
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}
```

---

## ⚛️ React ARIA Patterns

### Custom Components

```jsx
// Accessible Toggle Button
function ToggleButton({ pressed, onToggle, children }) {
    return (
        <button
            type="button"
            aria-pressed={pressed}
            onClick={onToggle}
        >
            {children}
        </button>
    );
}

// Accessible Disclosure
function Disclosure({ title, children }) {
    const [expanded, setExpanded] = useState(false);
    const contentId = useId();

    return (
        <div>
            <button
                aria-expanded={expanded}
                aria-controls={contentId}
                onClick={() => setExpanded(!expanded)}
            >
                {title}
            </button>
            <div
                id={contentId}
                hidden={!expanded}
            >
                {children}
            </div>
        </div>
    );
}

// Accessible Tabs
function Tabs({ tabs }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <div role="tablist">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-controls={`panel-${tab.id}`}
                        tabIndex={index === activeIndex ? 0 : -1}
                        onClick={() => setActiveIndex(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {tabs.map((tab, index) => (
                <div
                    key={tab.id}
                    role="tabpanel"
                    id={`panel-${tab.id}`}
                    hidden={index !== activeIndex}
                    tabIndex={0}
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is ARIA?**

A: Accessible Rich Internet Applications - set of attributes that define ways to make web content more accessible. Provides semantics for custom components that HTML alone can't express.

**Q: When should you use ARIA?**

A: Only when native HTML can't provide the needed semantics. First rule of ARIA: "Don't use ARIA if you can use native HTML."

### 🟡 Mid-level

**Q: aria-label vs aria-labelledby?**

A:
- **aria-label**: Invisible label text defined in attribute
- **aria-labelledby**: References ID of visible element

Use aria-labelledby when visible label exists, aria-label when no visible label.

**Q: What are live regions?**

A: Regions that announce dynamic content changes to screen readers. Use `aria-live="polite"` for non-urgent updates, `role="alert"` for urgent messages.

### 🔴 Senior

**Q: Build accessible autocomplete component**

A:
```jsx
function Autocomplete({ options, onSelect }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const listboxId = useId();

    return (
        <div role="combobox"
             aria-expanded={isOpen}
             aria-haspopup="listbox"
             aria-owns={listboxId}>

            <input
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-activedescendant={
                    activeIndex >= 0 ? `option-${activeIndex}` : undefined
                }
                // Keyboard handling for arrow keys, Enter, Escape
            />

            <ul id={listboxId} role="listbox">
                {options.map((option, index) => (
                    <li
                        key={option.id}
                        id={`option-${index}`}
                        role="option"
                        aria-selected={index === activeIndex}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>

            <div role="status" aria-live="polite">
                {options.length} results available
            </div>
        </div>
    );
}
```

---

## 📚 Active Recall

1. [ ] First rule of ARIA
2. [ ] Roles vs States vs Properties
3. [ ] aria-live values (3)
4. [ ] Landmark roles (6)
5. [ ] aria-label vs aria-labelledby

---

> **Tiếp theo:** [03-keyboard-navigation.md](./03-keyboard-navigation.md) - Keyboard Navigation
