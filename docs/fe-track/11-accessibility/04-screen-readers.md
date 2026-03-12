# Screen Readers - Compatibility & Best Practices

> Screen readers convert visual content to speech/braille. Understanding how they work helps build truly accessible applications.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCREEN READERS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   WHAT SCREEN READERS DO:                                       │
│   ───────────────────────                                        │
│   • Read page content aloud                                     │
│   • Navigate by headings, landmarks, links                      │
│   • Interact with forms and controls                            │
│   • Announce dynamic content changes                            │
│                                                                   │
│   POPULAR SCREEN READERS:                                       │
│   ───────────────────────                                        │
│   NVDA        ──▶ Windows (Free, most common for testing)       │
│   JAWS        ──▶ Windows (Paid, enterprise)                    │
│   VoiceOver   ──▶ macOS/iOS (Built-in)                         │
│   TalkBack    ──▶ Android (Built-in)                           │
│   Narrator    ──▶ Windows (Built-in)                           │
│                                                                   │
│   HOW THEY READ:                                                │
│   ──────────────                                                 │
│   Accessibility Tree ──▶ Not visual DOM                         │
│   Role + Name + State ──▶ "Button, Submit, pressed"            │
│   Live Regions ──▶ Dynamic announcements                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 What - Accessibility Tree

### DOM vs Accessibility Tree

```
┌─────────────────────────────────────────────────────────────────┐
│               DOM vs ACCESSIBILITY TREE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   DOM Tree:                    Accessibility Tree:              │
│   ─────────                    ───────────────────              │
│                                                                   │
│   <div class="card">           group                            │
│     <img src="..." alt="">     (image hidden - empty alt)       │
│     <h2>Title</h2>      ──▶    heading level 2 "Title"         │
│     <p>Description</p>         text "Description"               │
│     <button>Click</button>     button "Click"                   │
│   </div>                                                         │
│                                                                   │
│   WHAT GETS EXPOSED:                                            │
│   ─────────────────────                                          │
│   • Role (button, link, heading)                                │
│   • Name (accessible name)                                      │
│   • State (expanded, checked, disabled)                         │
│   • Properties (required, readonly)                             │
│   • Value (input value, slider position)                        │
│   • Relationships (labelledby, describedby)                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Accessible Name Computation

```
┌─────────────────────────────────────────────────────────────────┐
│               ACCESSIBLE NAME PRIORITY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Priority order (highest to lowest):                           │
│                                                                   │
│   1. aria-labelledby                                            │
│      <button aria-labelledby="label1">                          │
│      <span id="label1">Submit Form</span>                       │
│      → Name: "Submit Form"                                      │
│                                                                   │
│   2. aria-label                                                 │
│      <button aria-label="Close dialog">×</button>               │
│      → Name: "Close dialog"                                     │
│                                                                   │
│   3. <label> element (for inputs)                               │
│      <label for="email">Email</label>                           │
│      <input id="email" type="email">                            │
│      → Name: "Email"                                            │
│                                                                   │
│   4. Text content                                               │
│      <button>Submit</button>                                    │
│      → Name: "Submit"                                           │
│                                                                   │
│   5. title attribute (last resort)                              │
│      <button title="Submit form">→</button>                     │
│      → Name: "Submit form"                                      │
│                                                                   │
│   6. placeholder (NOT recommended for name)                     │
│      <input placeholder="Enter email">                          │
│      → Poor accessibility                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 How - Screen Reader Announcements

### What Gets Announced

```html
<!-- Button -->
<button>Save</button>
<!-- Announced: "Save, button" -->

<!-- Link -->
<a href="/about">About Us</a>
<!-- Announced: "About Us, link" -->

<!-- Checkbox -->
<input type="checkbox" id="agree" checked>
<label for="agree">I agree to terms</label>
<!-- Announced: "I agree to terms, checkbox, checked" -->

<!-- Heading -->
<h2>Product Features</h2>
<!-- Announced: "Product Features, heading level 2" -->

<!-- Image -->
<img src="chart.png" alt="Sales increased 50% in Q4">
<!-- Announced: "Sales increased 50% in Q4, image" -->

<!-- Image (decorative) -->
<img src="decoration.png" alt="">
<!-- Not announced (hidden from AT) -->
```

### Common Announcement Issues

```html
<!-- ❌ BAD: No accessible name -->
<button><svg>...</svg></button>
<!-- Announced: "button" (no name!) -->

<!-- ✅ GOOD: Has accessible name -->
<button aria-label="Close"><svg>...</svg></button>
<!-- Announced: "Close, button" -->

<!-- ❌ BAD: Redundant image text -->
<img src="logo.png" alt="Logo image">
<!-- Don't say "image" - SR already says it -->

<!-- ✅ GOOD: Descriptive alt -->
<img src="logo.png" alt="Acme Corporation">
<!-- Announced: "Acme Corporation, image" -->

<!-- ❌ BAD: Link text doesn't describe destination -->
<a href="/pricing">Click here</a>
<!-- Where does "Click here" go? -->

<!-- ✅ GOOD: Descriptive link text -->
<a href="/pricing">View pricing plans</a>
<!-- Announced: "View pricing plans, link" -->
```

---

## 📋 Navigation Modes

### How Users Navigate

```
┌─────────────────────────────────────────────────────────────────┐
│               SCREEN READER NAVIGATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   BROWSE MODE (Reading mode):                                   │
│   ────────────────────────────                                   │
│   Arrow keys read content line by line                          │
│   Quick navigation keys:                                        │
│   • H - Next heading                                            │
│   • 1-6 - Heading levels                                        │
│   • K - Next link                                               │
│   • B - Next button                                             │
│   • F - Next form field                                         │
│   • T - Next table                                              │
│   • L - Next list                                               │
│   • D - Next landmark                                           │
│                                                                   │
│   FOCUS MODE (Forms mode):                                      │
│   ─────────────────────────                                      │
│   Keyboard works normally for form interaction                  │
│   Arrow keys type/select (not navigate)                         │
│   Tab moves between form fields                                 │
│                                                                   │
│   LANDMARK NAVIGATION:                                          │
│   ────────────────────                                           │
│   D key cycles through:                                         │
│   • banner (header)                                             │
│   • navigation                                                  │
│   • main                                                        │
│   • complementary (aside)                                       │
│   • contentinfo (footer)                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Heading Structure Importance

```
┌─────────────────────────────────────────────────────────────────┐
│               HEADING STRUCTURE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ❌ BAD Structure:           ✅ GOOD Structure:                │
│   ─────────────────           ──────────────────                │
│                                                                   │
│   <h1>Welcome</h1>            <h1>Company Name</h1>             │
│   <h3>About</h3>              <h2>About Us</h2>                 │
│   <h2>Products</h2>           <h2>Products</h2>                 │
│   <h5>Product A</h5>            <h3>Product A</h3>              │
│   <h1>Contact</h1>              <h3>Product B</h3>              │
│                                <h2>Contact</h2>                 │
│                                                                   │
│   Issues:                     Benefits:                         │
│   • Multiple h1               • Single h1 (page title)         │
│   • Skipped levels            • No skipped levels              │
│   • No logical order          • Logical hierarchy              │
│                                                                   │
│   SR users press H to jump through headings                     │
│   Press 2 to jump to all h2s                                    │
│   Structure = navigation!                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚛️ React Patterns for Screen Readers

### Accessible Component Patterns

```jsx
// Loading state announcement
function LoadingButton({ isLoading, children, ...props }) {
    return (
        <button
            {...props}
            aria-busy={isLoading}
            aria-disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <span aria-hidden="true">Loading...</span>
                    <span className="sr-only">
                        Loading, please wait
                    </span>
                </>
            ) : children}
        </button>
    );
}

// Status messages
function FormWithFeedback() {
    const [status, setStatus] = useState({ type: null, message: '' });

    return (
        <form>
            {/* Form fields */}

            {/* Status announcement - always in DOM */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {status.type === 'success' && (
                    <p className="success">{status.message}</p>
                )}
            </div>

            {/* Error announcement - assertive for errors */}
            <div
                role="alert"
                aria-live="assertive"
            >
                {status.type === 'error' && (
                    <p className="error">{status.message}</p>
                )}
            </div>
        </form>
    );
}

// Sortable table header
function SortableHeader({ column, sortConfig, onSort }) {
    const isSorted = sortConfig.key === column.key;
    const direction = isSorted ? sortConfig.direction : null;

    return (
        <th>
            <button
                onClick={() => onSort(column.key)}
                aria-sort={
                    isSorted
                        ? direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                        : 'none'
                }
            >
                {column.label}
                <span aria-hidden="true">
                    {isSorted && (direction === 'asc' ? '▲' : '▼')}
                </span>
            </button>
        </th>
    );
}
```

### Screen Reader Only Content

```jsx
// Visually hidden but accessible
function ScreenReaderOnly({ children }) {
    return (
        <span
            style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: 0,
            }}
        >
            {children}
        </span>
    );
}

// Usage examples
function ProductCard({ product }) {
    return (
        <article>
            <img src={product.image} alt="" /> {/* Decorative */}
            <h3>{product.name}</h3>
            <p className="price">
                ${product.price}
                <ScreenReaderOnly>dollars</ScreenReaderOnly>
            </p>
            <button>
                Add to cart
                <ScreenReaderOnly>
                    {product.name}
                </ScreenReaderOnly>
            </button>
        </article>
    );
}

// Icon button with context
function IconButton({ icon, label, context }) {
    return (
        <button aria-label={`${label}${context ? ` ${context}` : ''}`}>
            {icon}
        </button>
    );
}

// Usage
<IconButton
    icon={<DeleteIcon />}
    label="Delete"
    context="user John Doe"
/>
// Announced: "Delete user John Doe, button"
```

### Dynamic Content Updates

```jsx
// Pagination with announcements
function Pagination({ currentPage, totalPages, onPageChange }) {
    const [announcement, setAnnouncement] = useState('');

    function handlePageChange(newPage) {
        onPageChange(newPage);
        setAnnouncement(`Page ${newPage} of ${totalPages}`);

        // Clear after announcement
        setTimeout(() => setAnnouncement(''), 1000);
    }

    return (
        <nav aria-label="Pagination">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                Previous
            </button>

            <span aria-current="page">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                Next
            </button>

            {/* Live region for page change announcement */}
            <div
                role="status"
                aria-live="polite"
                className="sr-only"
            >
                {announcement}
            </div>
        </nav>
    );
}

// Toast notifications
function ToastContainer({ toasts }) {
    return (
        <div
            role="region"
            aria-label="Notifications"
            aria-live="polite"
        >
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    role={toast.type === 'error' ? 'alert' : 'status'}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
```

---

## 🧪 Testing with Screen Readers

### VoiceOver (macOS) Basics

```
┌─────────────────────────────────────────────────────────────────┐
│               VOICEOVER TESTING                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ENABLE/DISABLE:                                               │
│   Cmd + F5 (or Touch ID 3x)                                     │
│                                                                   │
│   BASIC NAVIGATION:                                             │
│   ─────────────────                                              │
│   VO = Ctrl + Option (VoiceOver modifier)                       │
│                                                                   │
│   VO + →     Next item                                          │
│   VO + ←     Previous item                                      │
│   VO + Space Activate/click                                     │
│   VO + U     Open rotor (quick navigation)                      │
│   VO + Cmd + H  Next heading                                    │
│   VO + Cmd + L  Next link                                       │
│   Ctrl        Pause speech                                      │
│                                                                   │
│   ROTOR (VO + U):                                               │
│   ───────────────                                                │
│   Navigate by: Headings, Links, Form Controls, Landmarks        │
│   Arrow Left/Right to switch categories                         │
│   Arrow Up/Down to navigate items                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### NVDA (Windows) Basics

```
┌─────────────────────────────────────────────────────────────────┐
│               NVDA TESTING                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ENABLE/DISABLE:                                               │
│   Ctrl + Alt + N (or desktop shortcut)                          │
│                                                                   │
│   NVDA = Insert key (modifier)                                  │
│                                                                   │
│   BROWSE MODE:                                                  │
│   ────────────                                                   │
│   H           Next heading                                      │
│   1-6         Heading level 1-6                                 │
│   K           Next link                                         │
│   B           Next button                                       │
│   F           Next form field                                   │
│   T           Next table                                        │
│   D           Next landmark                                     │
│   Tab         Next focusable                                    │
│                                                                   │
│   FORMS MODE:                                                   │
│   ───────────                                                    │
│   NVDA + Space   Toggle browse/forms mode                       │
│   Enter          Auto-switch for inputs                         │
│                                                                   │
│   UTILITIES:                                                    │
│   ──────────                                                     │
│   NVDA + F7      Elements list (headings, links)               │
│   NVDA + N       NVDA menu                                      │
│   NVDA + Q       Quit NVDA                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Testing Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│               SCREEN READER TESTING CHECKLIST                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   PAGE STRUCTURE:                                               │
│   □ Page has meaningful title                                   │
│   □ Single h1 describing page purpose                          │
│   □ Heading hierarchy is logical (no skipped levels)           │
│   □ Landmarks present (main, nav, header, footer)              │
│                                                                   │
│   NAVIGATION:                                                   │
│   □ Skip link works and targets correct content                │
│   □ Links have descriptive text (not "click here")             │
│   □ Current page indicated in navigation                       │
│                                                                   │
│   IMAGES:                                                       │
│   □ Meaningful images have descriptive alt text                │
│   □ Decorative images have empty alt=""                        │
│   □ Complex images have extended description                   │
│                                                                   │
│   FORMS:                                                        │
│   □ All inputs have associated labels                          │
│   □ Required fields announced                                   │
│   □ Error messages associated with fields                      │
│   □ Form submission feedback announced                         │
│                                                                   │
│   INTERACTIVE ELEMENTS:                                         │
│   □ Buttons announce their purpose                             │
│   □ State changes announced (expanded, selected)               │
│   □ Modal focus is trapped and managed                         │
│   □ Dynamic content updates announced                          │
│                                                                   │
│   TABLES:                                                       │
│   □ Data tables have headers (th)                              │
│   □ Complex tables have scope attributes                       │
│   □ Tables have captions when needed                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is an accessibility tree?**

A: The accessibility tree is a simplified version of the DOM that assistive technologies use. It contains only accessibility-relevant information: roles, names, states, and properties. Screen readers read from this tree, not the visual DOM.

**Q: What makes good alt text?**

A: Good alt text:
- Describes the image's purpose, not just appearance
- Is concise (under 125 characters typically)
- Doesn't start with "image of" (SR announces "image" already)
- Is empty (`alt=""`) for decorative images
- Provides equivalent information to what sighted users get

### 🟡 Mid-level

**Q: How do you make dynamic content accessible to screen readers?**

A: Use ARIA live regions:
- `role="status"` or `aria-live="polite"` for non-urgent updates
- `role="alert"` or `aria-live="assertive"` for urgent messages
- `aria-atomic="true"` to announce entire region content
- Keep live region in DOM, update its content

```jsx
<div role="status" aria-live="polite">
    {message}
</div>
```

**Q: Explain the difference between aria-label, aria-labelledby, and aria-describedby.**

A:
- **aria-label**: Provides accessible name as a string
- **aria-labelledby**: Points to ID(s) of elements providing the name
- **aria-describedby**: Points to ID(s) providing additional description

```html
<button aria-label="Close">×</button>

<h2 id="title">Settings</h2>
<form aria-labelledby="title">...</form>

<input aria-describedby="hint error">
<span id="hint">Must be 8+ chars</span>
<span id="error">Password too weak</span>
```

### 🔴 Senior

**Q: How would you make a complex data table accessible?**

A:
```html
<table>
    <caption>
        Quarterly Sales Report 2024
        <span class="sr-only">
            Table has 4 columns and 5 rows
        </span>
    </caption>
    <thead>
        <tr>
            <th scope="col">Product</th>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Widget A</th>
            <td>$10,000</td>
            <td>$12,000</td>
            <td>$15,000</td>
        </tr>
    </tbody>
</table>
```

Key techniques:
- Use `<caption>` for table title
- `scope="col"` and `scope="row"` for headers
- For complex tables with spanning cells, use `headers` attribute
- Announce table dimensions for context

**Q: Design an accessible autocomplete/combobox**

A:
```jsx
<div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
    <input
        aria-autocomplete="list"
        aria-controls="suggestions"
        aria-activedescendant={activeId}
    />
    <ul id="suggestions" role="listbox">
        {suggestions.map(item => (
            <li
                id={item.id}
                role="option"
                aria-selected={item.id === activeId}
            >
                {item.text}
            </li>
        ))}
    </ul>
    <div role="status" aria-live="polite">
        {suggestions.length} results available
    </div>
</div>
```

Critical aspects:
- Proper combobox/listbox ARIA pattern
- `aria-activedescendant` for virtual focus
- Live region announcing result count
- Keyboard navigation (arrows, enter, escape)

---

## 📚 Active Recall

1. [ ] What information does the accessibility tree contain?
2. [ ] List the priority order for accessible name computation
3. [ ] How do screen reader users navigate pages? (list 5 methods)
4. [ ] When should you use aria-live="assertive" vs "polite"?
5. [ ] What VoiceOver/NVDA commands would you use to test a form?

---

> **Tiếp theo:** [05-testing-accessibility.md](./05-testing-accessibility.md) - Accessibility Testing Tools
