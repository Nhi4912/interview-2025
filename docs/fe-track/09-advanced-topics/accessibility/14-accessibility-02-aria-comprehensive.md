# ARIA - Comprehensive Guide

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Accessible Rich Internet Applications

**English:** ARIA (Accessible Rich Internet Applications) provides additional semantics to make web content and applications accessible to people with disabilities.

**Tiếng Việt:** ARIA (Accessible Rich Internet Applications) cung cấp ngữ nghĩa bổ sung để làm cho nội dung web và ứng dụng có thể truy cập được cho người khuyết tật.

## ARIA Fundamentals

### What is ARIA?

**Purpose:**
- Enhance accessibility of dynamic content
- Provide semantic information
- Communicate state and properties
- Define relationships between elements

**When to Use:**
- Custom widgets (tabs, accordions)
- Dynamic content updates
- Complex interactions
- When HTML semantics insufficient

**When NOT to Use:**
- Native HTML elements available
- Semantic HTML sufficient
- Can achieve with HTML alone

**First Rule of ARIA:**
"If you can use a native HTML element or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so."

## ARIA Roles

### Landmark Roles

**Purpose:** Define page regions for navigation.

**Common Landmarks:**
- `banner` - Site header
- `navigation` - Navigation menu
- `main` - Main content
- `complementary` - Sidebar
- `contentinfo` - Footer
- `search` - Search functionality
- `form` - Form region

**Example:**
```html
<header role="banner">
  <nav role="navigation">
    <ul>...</ul>
  </nav>
</header>

<main role="main">
  <article>...</article>
</main>

<aside role="complementary">
  <section>...</section>
</aside>

<footer role="contentinfo">
  <p>...</p>
</footer>
```

**Best Practices:**
- Use HTML5 semantic elements when possible
- One `main` landmark per page
- One `banner` and `contentinfo` per page
- Multiple `navigation` landmarks allowed
- Label landmarks with `aria-label` if multiple

### Widget Roles

**Interactive Components:**

**button:**
```html
<div role="button" tabindex="0" 
     onclick="handleClick()"
     onkeypress="handleKeyPress(event)">
  Click me
</div>

<!-- Better: Use native button -->
<button onclick="handleClick()">Click me</button>
```

**tab, tablist, tabpanel:**
```html
<div role="tablist" aria-label="Sample Tabs">
  <button role="tab" aria-selected="true" 
          aria-controls="panel-1" id="tab-1">
    Tab 1
  </button>
  <button role="tab" aria-selected="false" 
          aria-controls="panel-2" id="tab-2">
    Tab 2
  </button>
</div>

<div role="tabpanel" id="panel-1" 
     aria-labelledby="tab-1">
  Content 1
</div>

<div role="tabpanel" id="panel-2" 
     aria-labelledby="tab-2" hidden>
  Content 2
</div>
```

**dialog:**
```html
<div role="dialog" aria-labelledby="dialog-title" 
     aria-describedby="dialog-desc" aria-modal="true">
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">Are you sure?</p>
  <button>Confirm</button>
  <button>Cancel</button>
</div>
```

**menu, menuitem:**
```html
<div role="menu" aria-label="Actions">
  <div role="menuitem" tabindex="0">Edit</div>
  <div role="menuitem" tabindex="-1">Delete</div>
  <div role="menuitem" tabindex="-1">Share</div>
</div>
```

### Document Structure Roles

**article, region, section:**
```html
<div role="article">
  <h2>Article Title</h2>
  <p>Content...</p>
</div>

<div role="region" aria-labelledby="region-title">
  <h3 id="region-title">Region Title</h3>
  <p>Content...</p>
</div>
```

**list, listitem:**
```html
<div role="list">
  <div role="listitem">Item 1</div>
  <div role="listitem">Item 2</div>
  <div role="listitem">Item 3</div>
</div>

<!-- Better: Use native list -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

## ARIA States and Properties

### aria-label vs aria-labelledby

**aria-label:**
- Provides accessible name directly
- Overrides visible text
- Use when no visible label

```html
<button aria-label="Close dialog">
  <span aria-hidden="true">×</span>
</button>

<nav aria-label="Primary navigation">
  <ul>...</ul>
</nav>
```

**aria-labelledby:**
- References element(s) for label
- Can reference multiple elements
- Preserves visible text

```html
<h2 id="section-title">User Settings</h2>
<div role="region" aria-labelledby="section-title">
  <p>Settings content...</p>
</div>

<!-- Multiple references -->
<div aria-labelledby="title subtitle">
  <h2 id="title">Main Title</h2>
  <h3 id="subtitle">Subtitle</h3>
</div>
```

### aria-describedby

**Purpose:** Provides additional description.

```html
<input type="password" 
       aria-describedby="password-requirements">
<div id="password-requirements">
  Password must be at least 8 characters
</div>

<button aria-describedby="delete-warning">
  Delete Account
</button>
<div id="delete-warning">
  This action cannot be undone
</div>
```

### aria-hidden

**Purpose:** Hide content from assistive technology.

```html
<!-- Hide decorative icons -->
<button>
  <span aria-hidden="true">🔍</span>
  Search
</button>

<!-- Hide duplicate content -->
<div>
  <span aria-hidden="true">★★★★★</span>
  <span class="sr-only">5 out of 5 stars</span>
</div>
```

**Warning:** Don't hide focusable elements!

```html
<!-- Bad: Hidden but focusable -->
<button aria-hidden="true">Click me</button>

<!-- Good: Hidden and not focusable -->
<button aria-hidden="true" tabindex="-1">Click me</button>
```

### aria-live

**Purpose:** Announce dynamic content changes.

**Values:**
- `off` - No announcements (default)
- `polite` - Announce when idle
- `assertive` - Announce immediately

```html
<!-- Status messages -->
<div role="status" aria-live="polite">
  Item added to cart
</div>

<!-- Urgent alerts -->
<div role="alert" aria-live="assertive">
  Error: Form submission failed
</div>

<!-- Loading indicator -->
<div aria-live="polite" aria-busy="true">
  Loading...
</div>
```

**aria-atomic:**
- `true` - Announce entire region
- `false` - Announce only changes (default)

```html
<div aria-live="polite" aria-atomic="true">
  <span>Items in cart:</span>
  <span id="cart-count">3</span>
</div>
```

### aria-expanded

**Purpose:** Indicates expandable element state.

```html
<button aria-expanded="false" 
        aria-controls="menu">
  Menu
</button>

<ul id="menu" hidden>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- When expanded -->
<button aria-expanded="true" 
        aria-controls="menu">
  Menu
</button>

<ul id="menu">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### aria-selected

**Purpose:** Indicates selection state in tabs, options.

```html
<div role="tablist">
  <button role="tab" aria-selected="true">
    Tab 1
  </button>
  <button role="tab" aria-selected="false">
    Tab 2
  </button>
</div>

<select aria-label="Choose option">
  <option aria-selected="true">Option 1</option>
  <option aria-selected="false">Option 2</option>
</select>
```

### aria-checked

**Purpose:** Indicates checkbox/radio state.

```html
<div role="checkbox" 
     aria-checked="true" 
     tabindex="0">
  Accept terms
</div>

<!-- Tri-state checkbox -->
<div role="checkbox" 
     aria-checked="mixed" 
     tabindex="0">
  Select all
</div>
```

### aria-disabled

**Purpose:** Indicates disabled state.

```html
<button aria-disabled="true">
  Submit
</button>

<!-- Better: Use native disabled -->
<button disabled>Submit</button>
```

### aria-invalid

**Purpose:** Indicates validation error.

```html
<input type="email" 
       aria-invalid="true" 
       aria-describedby="email-error">
<div id="email-error" role="alert">
  Please enter a valid email
</div>
```

### aria-required

**Purpose:** Indicates required field.

```html
<input type="text" 
       aria-required="true" 
       aria-label="Username">

<!-- Better: Use native required -->
<input type="text" required aria-label="Username">
```

## Common Patterns

### Modal Dialog

```html
<div role="dialog" 
     aria-modal="true" 
     aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
  <p>Are you sure you want to delete this item?</p>
  <button>Delete</button>
  <button>Cancel</button>
</div>

<!-- JavaScript requirements -->
<script>
// 1. Trap focus within dialog
// 2. Close on Escape key
// 3. Return focus to trigger element
// 4. Prevent background scrolling
</script>
```

### Accordion

```html
<div class="accordion">
  <h3>
    <button aria-expanded="false" 
            aria-controls="section1">
      Section 1
    </button>
  </h3>
  <div id="section1" hidden>
    <p>Content 1</p>
  </div>
  
  <h3>
    <button aria-expanded="false" 
            aria-controls="section2">
      Section 2
    </button>
  </h3>
  <div id="section2" hidden>
    <p>Content 2</p>
  </div>
</div>
```

### Dropdown Menu

```html
<button aria-haspopup="true" 
        aria-expanded="false" 
        aria-controls="menu">
  Actions
</button>

<ul id="menu" role="menu" hidden>
  <li role="menuitem" tabindex="0">Edit</li>
  <li role="menuitem" tabindex="-1">Delete</li>
  <li role="menuitem" tabindex="-1">Share</li>
</ul>

<!-- Keyboard support -->
<script>
// Arrow keys: Navigate items
// Enter/Space: Activate item
// Escape: Close menu
// Tab: Close menu and move focus
</script>
```

### Combobox (Autocomplete)

```html
<label for="search">Search</label>
<input type="text" 
       id="search" 
       role="combobox" 
       aria-autocomplete="list" 
       aria-expanded="false" 
       aria-controls="suggestions">

<ul id="suggestions" role="listbox" hidden>
  <li role="option" aria-selected="false">Result 1</li>
  <li role="option" aria-selected="false">Result 2</li>
  <li role="option" aria-selected="false">Result 3</li>
</ul>
```

### Breadcrumb Navigation

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Product Name</li>
  </ol>
</nav>
```

### Pagination

```html
<nav aria-label="Pagination">
  <ul>
    <li>
      <a href="?page=1" aria-label="Go to page 1">1</a>
    </li>
    <li>
      <a href="?page=2" aria-current="page" aria-label="Page 2, current page">2</a>
    </li>
    <li>
      <a href="?page=3" aria-label="Go to page 3">3</a>
    </li>
  </ul>
</nav>
```

## Testing ARIA

### Screen Reader Testing

**Popular Screen Readers:**
- NVDA (Windows, free)
- JAWS (Windows, paid)
- VoiceOver (macOS/iOS, built-in)
- TalkBack (Android, built-in)

**Testing Checklist:**
- All interactive elements focusable
- Focus order logical
- Labels announced correctly
- States communicated
- Live regions work
- Keyboard navigation functional

### Automated Testing

**Tools:**
- axe DevTools
- WAVE
- Lighthouse
- Pa11y

**Example with jest-axe:**
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Common Mistakes

### Mistake 1: Redundant ARIA

```html
<!-- Bad: Redundant role -->
<button role="button">Click me</button>

<!-- Good: Native semantics -->
<button>Click me</button>
```

### Mistake 2: Incorrect Role

```html
<!-- Bad: Wrong role -->
<div role="button" onclick="...">Click</div>

<!-- Good: Correct element -->
<button onclick="...">Click</button>
```

### Mistake 3: Missing Keyboard Support

```html
<!-- Bad: No keyboard support -->
<div role="button" onclick="...">Click</div>

<!-- Good: Full keyboard support -->
<div role="button" tabindex="0" 
     onclick="..." 
     onkeypress="handleKeyPress(event)">
  Click
</div>
```

### Mistake 4: Hiding Focusable Content

```html
<!-- Bad: Hidden but focusable -->
<div aria-hidden="true">
  <button>Click me</button>
</div>

<!-- Good: Properly hidden -->
<div aria-hidden="true">
  <button tabindex="-1">Click me</button>
</div>
```

### Mistake 5: Empty Labels

```html
<!-- Bad: Empty label -->
<button aria-label="">
  <span aria-hidden="true">×</span>
</button>

<!-- Good: Descriptive label -->
<button aria-label="Close dialog">
  <span aria-hidden="true">×</span>
</button>
```

## Best Practices

### 1. Use Semantic HTML First

```html
<!-- Prefer native elements -->
<button>Click</button>
<input type="checkbox">
<select>...</select>

<!-- Over ARIA roles -->
<div role="button">Click</div>
<div role="checkbox">...</div>
<div role="listbox">...</div>
```

### 2. Provide Text Alternatives

```html
<!-- Images -->
<img src="logo.png" alt="Company Logo">

<!-- Icons -->
<button>
  <span aria-hidden="true">🔍</span>
  <span class="sr-only">Search</span>
</button>

<!-- Form inputs -->
<label for="email">Email</label>
<input type="email" id="email">
```

### 3. Manage Focus

```javascript
// Trap focus in modal
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}
```

### 4. Announce Dynamic Changes

```javascript
// Create live region
function announce(message, priority = 'polite') {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = message;
  
  document.body.appendChild(liveRegion);
  
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
}

// Usage
announce('Item added to cart');
announce('Error occurred', 'assertive');
```

## Interview Questions

**Q: What is ARIA and when should you use it?**

A: ARIA provides additional semantics for accessibility. Use it when native HTML is insufficient, for custom widgets, dynamic content, and complex interactions. Always prefer semantic HTML first.

**Q: Difference between aria-label and aria-labelledby?**

A: aria-label provides text directly, overriding visible text. aria-labelledby references element(s) for label, preserving visible text and allowing multiple references.

**Q: What is aria-live and when to use it?**

A: aria-live announces dynamic content changes. Use "polite" for status messages (announces when idle), "assertive" for urgent alerts (announces immediately).

**Q: How to make custom button accessible?**

A: Add role="button", tabindex="0", onclick handler, keyboard support (Enter/Space), focus styles, and aria-label if no visible text.

**Q: What is aria-hidden used for?**

A: Hides content from assistive technology while keeping it visible. Use for decorative elements, icons with text alternatives, or duplicate content. Don't hide focusable elements.

---

[← Back to WCAG Guidelines](./14-accessibility-01-wcag-guidelines.md) | [Next: Visual Learning →](./12-visual-learning-02-algorithm-visualizations.md)
