# Accessibility Interview Preparation

## Core Concepts

### Accessibility Fundamentals

- **WCAG 2.1 Guidelines**: Web Content Accessibility Guidelines
- **ARIA (Accessible Rich Internet Applications)**: Attributes for screen readers
- **Semantic HTML**: Meaningful HTML structure for assistive technologies
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader Support**: Text-to-speech compatibility

### WCAG Principles

- **Perceivable**: Information must be presentable to users in ways they can perceive
- **Operable**: User interface components and navigation must be operable
- **Understandable**: Information and operation of user interface must be understandable
- **Robust**: Content must be robust enough to be interpreted by assistive technologies

## Advanced Topics

### Modern Accessibility Features

- **Focus Management**: Programmatic focus control
- **Live Regions**: Dynamic content announcements
- **Skip Links**: Keyboard navigation shortcuts
- **High Contrast Mode**: Visual accessibility support
- **Reduced Motion**: Respect user motion preferences

### Accessibility Testing

- **Automated Testing**: Tools for accessibility validation
- **Manual Testing**: Human verification of accessibility
- **Screen Reader Testing**: Testing with assistive technologies
- **Keyboard Testing**: Full keyboard navigation verification
- **Color Contrast Testing**: Visual accessibility validation

## Common Interview Questions & Answers

### Accessibility Questions

**Q: What are the main WCAG 2.1 guidelines and how do you implement them?**
A: WCAG 2.1 has three levels: A, AA, and AAA. Key guidelines include:

**Level A (Basic):**

- Non-text content has text alternatives
- Keyboard accessible
- No keyboard traps
- Color is not the only way to convey information

**Level AA (Standard):**

- Sufficient color contrast (4.5:1 for normal text)
- Resizable text up to 200%
- Focus visible
- Multiple ways to navigate

**Implementation Examples:**

{% raw %}
```javascript
// 1. Semantic HTML structure
function AccessibleNavigation() {
  return (
    <nav aria-label="Main navigation">
      <ul role="menubar">
        <li role="none">
          <a href="/home" role="menuitem" aria-current="page">
            Home
          </a>
        </li>
        <li role="none">
          <a href="/about" role="menuitem">
            About
          </a>
        </li>
      </ul>
    </nav>
  );
}

// 2. Proper form labeling
function AccessibleForm() {
  return (
    <form>
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        aria-describedby="username-help"
        aria-required="true"
      />
      <div id="username-help">Enter your username</div>

      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        aria-describedby="password-requirements"
        aria-required="true"
      />
      <div id="password-requirements">
        Password must be at least 8 characters
      </div>
    </form>
  );
}

// 3. ARIA live regions for dynamic content
function LiveRegion() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button onClick={() => setMessage("Action completed!")}>
        Perform Action
      </button>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </div>
    </div>
  );
}
```
{% endraw %}

**Q: How do you implement keyboard navigation for custom components?**
A: Comprehensive keyboard navigation implementation:

```javascript
class KeyboardNavigation {
  constructor(container) {
    this.container = container;
    this.focusableElements = [];
    this.currentIndex = 0;
    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    // Find all focusable elements
    this.focusableElements = Array.from(
      this.container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    // Add keyboard event listeners
    this.container.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Add focus management
    this.container.addEventListener("focusin", this.handleFocusIn.bind(this));
  }

  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        this.moveFocus(1);
        break;

      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        this.moveFocus(-1);
        break;

      case "Home":
        event.preventDefault();
        this.moveToFirst();
        break;

      case "End":
        event.preventDefault();
        this.moveToLast();
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        this.activateCurrent();
        break;

      case "Escape":
        this.handleEscape();
        break;
    }
  }

  moveFocus(direction) {
    const newIndex = this.currentIndex + direction;

    if (newIndex >= 0 && newIndex < this.focusableElements.length) {
      this.currentIndex = newIndex;
      this.focusableElements[this.currentIndex].focus();
    }
  }

  moveToFirst() {
    this.currentIndex = 0;
    this.focusableElements[0].focus();
  }

  moveToLast() {
    this.currentIndex = this.focusableElements.length - 1;
    this.focusableElements[this.currentIndex].focus();
  }

  activateCurrent() {
    const currentElement = this.focusableElements[this.currentIndex];

    if (currentElement.tagName === "BUTTON") {
      currentElement.click();
    } else if (currentElement.tagName === "A") {
      currentElement.click();
    }
  }

  handleFocusIn(event) {
    const index = this.focusableElements.indexOf(event.target);
    if (index !== -1) {
      this.currentIndex = index;
    }
  }

  handleEscape() {
    // Close modal, dropdown, etc.
    this.container.dispatchEvent(new CustomEvent("escape"));
  }
}

// Custom dropdown with keyboard navigation
class AccessibleDropdown {
  constructor(trigger, menu) {
    this.trigger = trigger;
    this.menu = menu;
    this.isOpen = false;
    this.menuItems = [];
    this.currentIndex = -1;

    this.setupDropdown();
  }

  setupDropdown() {
    // Set ARIA attributes
    this.trigger.setAttribute("aria-haspopup", "true");
    this.trigger.setAttribute("aria-expanded", "false");
    this.menu.setAttribute("role", "menu");
    this.menu.setAttribute("aria-hidden", "true");

    // Get menu items
    this.menuItems = Array.from(
      this.menu.querySelectorAll('[role="menuitem"]')
    );

    // Add event listeners
    this.trigger.addEventListener("click", this.toggle.bind(this));
    this.trigger.addEventListener(
      "keydown",
      this.handleTriggerKeyDown.bind(this)
    );
    this.menu.addEventListener("keydown", this.handleMenuKeyDown.bind(this));

    // Close on outside click
    document.addEventListener("click", this.handleOutsideClick.bind(this));
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.trigger.setAttribute("aria-expanded", "true");
    this.menu.setAttribute("aria-hidden", "false");
    this.menu.style.display = "block";

    // Focus first menu item
    if (this.menuItems.length > 0) {
      this.currentIndex = 0;
      this.menuItems[0].focus();
    }
  }

  close() {
    this.isOpen = false;
    this.trigger.setAttribute("aria-expanded", "false");
    this.menu.setAttribute("aria-hidden", "true");
    this.menu.style.display = "none";
    this.currentIndex = -1;

    // Return focus to trigger
    this.trigger.focus();
  }

  handleTriggerKeyDown(event) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        this.toggle();
        break;

      case "ArrowDown":
        event.preventDefault();
        this.open();
        break;
    }
  }

  handleMenuKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.moveFocus(1);
        break;

      case "ArrowUp":
        event.preventDefault();
        this.moveFocus(-1);
        break;

      case "Home":
        event.preventDefault();
        this.moveToFirst();
        break;

      case "End":
        event.preventDefault();
        this.moveToLast();
        break;

      case "Escape":
        event.preventDefault();
        this.close();
        break;

      case "Enter":
        event.preventDefault();
        this.activateCurrent();
        break;
    }
  }

  moveFocus(direction) {
    const newIndex = this.currentIndex + direction;

    if (newIndex >= 0 && newIndex < this.menuItems.length) {
      this.currentIndex = newIndex;
      this.menuItems[this.currentIndex].focus();
    }
  }

  moveToFirst() {
    this.currentIndex = 0;
    this.menuItems[0].focus();
  }

  moveToLast() {
    this.currentIndex = this.menuItems.length - 1;
    this.menuItems[this.currentIndex].focus();
  }

  activateCurrent() {
    if (this.currentIndex >= 0) {
      this.menuItems[this.currentIndex].click();
      this.close();
    }
  }

  handleOutsideClick(event) {
    if (
      !this.trigger.contains(event.target) &&
      !this.menu.contains(event.target)
    ) {
      this.close();
    }
  }
}
```

## Advanced Interview Questions

**Q: How would you implement a fully accessible modal dialog?**
A: Complete accessible modal implementation:

```javascript
class AccessibleModal {
  constructor(modal, trigger) {
    this.modal = modal;
    this.trigger = trigger;
    this.previousFocus = null;
    this.focusableElements = [];

    this.setupModal();
  }

  setupModal() {
    // Set ARIA attributes
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-modal", "true");
    this.modal.setAttribute("aria-hidden", "true");

    // Add close button if not present
    if (!this.modal.querySelector("[data-modal-close]")) {
      this.addCloseButton();
    }

    // Get focusable elements
    this.focusableElements = Array.from(
      this.modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    // Add event listeners
    this.trigger.addEventListener("click", this.open.bind(this));
    this.modal.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Close button events
    const closeButtons = this.modal.querySelectorAll("[data-modal-close]");
    closeButtons.forEach((button) => {
      button.addEventListener("click", this.close.bind(this));
    });

    // Backdrop click
    this.modal.addEventListener("click", this.handleBackdropClick.bind(this));
  }

  open() {
    // Store current focus
    this.previousFocus = document.activeElement;

    // Show modal
    this.modal.style.display = "block";
    this.modal.setAttribute("aria-hidden", "false");

    // Focus management
    this.trapFocus();

    // Announce to screen readers
    this.announce("Modal opened");

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  close() {
    // Hide modal
    this.modal.style.display = "none";
    this.modal.setAttribute("aria-hidden", "true");

    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }

    // Announce to screen readers
    this.announce("Modal closed");

    // Restore body scroll
    document.body.style.overflow = "";
  }

  trapFocus() {
    // Focus first focusable element
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  handleKeyDown(event) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        break;

      case "Tab":
        this.handleTabKey(event);
        break;
    }
  }

  handleTabKey(event) {
    const firstElement = this.focusableElements[0];
    const lastElement =
      this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  handleBackdropClick(event) {
    if (event.target === this.modal) {
      this.close();
    }
  }

  addCloseButton() {
    const closeButton = document.createElement("button");
    closeButton.setAttribute("data-modal-close", "");
    closeButton.setAttribute("aria-label", "Close modal");
    closeButton.innerHTML = "&times;";
    closeButton.className = "modal-close";

    this.modal.appendChild(closeButton);
  }

  announce(message) {
    // Create live region for announcements
    let liveRegion = document.getElementById("aria-live-region");
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "aria-live-region";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;
  }
}

// Usage
const modal = document.getElementById("my-modal");
const trigger = document.getElementById("modal-trigger");
const accessibleModal = new AccessibleModal(modal, trigger);
```

**Q: How do you implement accessible data tables?**
A: Accessible table implementation with sorting and filtering:

```javascript
class AccessibleDataTable {
  constructor(table) {
    this.table = table;
    this.data = [];
    this.currentSort = { column: null, direction: "asc" };
    this.currentFilter = "";

    this.setupTable();
  }

  setupTable() {
    // Set table attributes
    this.table.setAttribute("role", "table");
    this.table.setAttribute("aria-label", "Data table");

    // Add sorting and filtering controls
    this.addControls();

    // Setup headers
    this.setupHeaders();

    // Add keyboard navigation
    this.setupKeyboardNavigation();
  }

  addControls() {
    const controls = document.createElement("div");
    controls.className = "table-controls";
    controls.setAttribute("role", "toolbar");
    controls.setAttribute("aria-label", "Table controls");

    // Search input
    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.setAttribute("aria-label", "Filter table data");
    searchInput.placeholder = "Search...";
    searchInput.addEventListener("input", (e) => {
      this.filterData(e.target.value);
    });

    controls.appendChild(searchInput);
    this.table.parentNode.insertBefore(controls, this.table);
  }

  setupHeaders() {
    const headers = this.table.querySelectorAll("th");

    headers.forEach((header, index) => {
      // Set header attributes
      header.setAttribute("scope", "col");
      header.setAttribute("role", "columnheader");

      // Add sorting functionality
      if (header.dataset.sortable !== "false") {
        header.setAttribute("tabindex", "0");
        header.setAttribute("aria-sort", "none");

        header.addEventListener("click", () => {
          this.sortByColumn(index);
        });

        header.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.sortByColumn(index);
          }
        });
      }
    });
  }

  setupKeyboardNavigation() {
    const rows = this.table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      row.setAttribute("role", "row");
      row.setAttribute("tabindex", "0");

      const cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        cell.setAttribute("role", "cell");
      });

      // Add keyboard navigation
      row.addEventListener("keydown", (e) => {
        this.handleRowKeyDown(e, row);
      });
    });
  }

  handleRowKeyDown(event, row) {
    const rows = Array.from(this.table.querySelectorAll("tbody tr"));
    const currentIndex = rows.indexOf(row);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (currentIndex < rows.length - 1) {
          rows[currentIndex + 1].focus();
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        if (currentIndex > 0) {
          rows[currentIndex - 1].focus();
        }
        break;

      case "Enter":
        event.preventDefault();
        this.handleRowActivation(row);
        break;
    }
  }

  sortByColumn(columnIndex) {
    const headers = this.table.querySelectorAll("th");
    const header = headers[columnIndex];

    // Update sort direction
    if (this.currentSort.column === columnIndex) {
      this.currentSort.direction =
        this.currentSort.direction === "asc" ? "desc" : "asc";
    } else {
      this.currentSort.column = columnIndex;
      this.currentSort.direction = "asc";
    }

    // Update header attributes
    headers.forEach((h, i) => {
      if (i === columnIndex) {
        h.setAttribute("aria-sort", this.currentSort.direction);
      } else {
        h.setAttribute("aria-sort", "none");
      }
    });

    // Sort data
    this.sortData();

    // Announce sort change
    const columnName = header.textContent;
    this.announce(
      `Table sorted by ${columnName}, ${this.currentSort.direction}ending`
    );
  }

  sortData() {
    const tbody = this.table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
      const aValue = a.cells[this.currentSort.column].textContent;
      const bValue = b.cells[this.currentSort.column].textContent;

      if (this.currentSort.direction === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    // Reorder DOM
    rows.forEach((row) => tbody.appendChild(row));
  }

  filterData(query) {
    this.currentFilter = query.toLowerCase();
    const rows = this.table.querySelectorAll("tbody tr");
    let visibleCount = 0;

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const isVisible = text.includes(this.currentFilter);

      row.style.display = isVisible ? "" : "none";
      row.setAttribute("aria-hidden", !isVisible);

      if (isVisible) visibleCount++;
    });

    // Update table summary
    this.updateTableSummary(visibleCount, rows.length);
  }

  updateTableSummary(visible, total) {
    let summary = this.table.querySelector("[data-table-summary]");
    if (!summary) {
      summary = document.createElement("div");
      summary.setAttribute("data-table-summary", "");
      summary.setAttribute("aria-live", "polite");
      this.table.parentNode.insertBefore(summary, this.table);
    }

    summary.textContent = `Showing ${visible} of ${total} rows`;
  }

  handleRowActivation(row) {
    // Handle row click/activation
    const event = new CustomEvent("rowActivate", {
      detail: { row, data: this.getRowData(row) },
    });
    this.table.dispatchEvent(event);
  }

  getRowData(row) {
    const cells = row.querySelectorAll("td");
    return Array.from(cells).map((cell) => cell.textContent);
  }

  announce(message) {
    // Create or use existing live region
    let liveRegion = document.getElementById("table-live-region");
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "table-live-region";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;
  }
}
```

---

# Deep Dive: Accessibility in React, JS, HTML, and Networking

## React Accessibility Fundamentals

- **Accessible Components**: Use semantic elements (`<button>`, `<nav>`, `<form>`) and ARIA roles only when necessary.
- **Focus Management**: Use `useRef` and `useEffect` to manage focus for modals, dialogs, and dynamic content.
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible (tab, arrow keys, Enter, Space).
- **Error Announcements**: Use ARIA live regions for form validation and dynamic updates.

**Example: Accessible Modal in React**

{% raw %}
```jsx
import { useRef, useEffect } from "react";

function AccessibleModal({ isOpen, onClose, children }) {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <button onClick={onClose} aria-label="Close modal">
        &times;
      </button>
      {children}
    </div>
  );
}
```
{% endraw %}

---

## JavaScript Accessibility Patterns

- **Event Delegation**: Use event delegation for dynamic lists and menus to ensure keyboard and screen reader support.
- **ARIA Attributes**: Dynamically update ARIA attributes for stateful components (e.g., `aria-expanded`, `aria-selected`).
- **Live Regions**: Use ARIA live regions for notifications and status updates.

**Example: Announcing Dynamic Updates**

```js
function announce(message) {
  let liveRegion = document.getElementById("live-region");
  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "live-region";
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.className = "sr-only";
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = message;
}
```

---

## HTML Accessibility Best Practices

- **Landmarks**: Use `<header>`, `<nav>`, `<main>`, `<footer>` for page structure.
- **Form Labels**: Always associate `<label>` with `<input>` using `for` and `id`.
- **Table Accessibility**: Use `<th scope="col">` and `<caption>` for data tables.

**Diagram: Semantic HTML Structure**

```mermaid
graph TD;
  A[<header>] --> B[<nav>];
  A --> C[<main>];
  C --> D[<section>];
  C --> E[<article>];
  C --> F[<aside>];
  A --> G[<footer>];
```

---

## Networking & Accessibility

- **Error Handling**: Show accessible error messages for failed network requests.
- **Loading States**: Use ARIA live regions to announce loading and completion.
- **Progress Indicators**: Use `role="progressbar"` and update `aria-valuenow`.

**Example: Accessible Fetch with Error Announcement**

```js
async function fetchData(url) {
  try {
    announce("Loading data...");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");
    announce("Data loaded successfully");
    return await response.json();
  } catch (error) {
    announce("Error loading data: " + error.message);
    throw error;
  }
}
```

---

# Practice Problems & Deep Dive Answers

## Problem 1: Accessible Custom Dropdown (React)

**Challenge:** Build a dropdown that is fully accessible (keyboard, ARIA, focus management).

**Solution Outline:**

- Use `role="button"` for the trigger, `aria-haspopup`, `aria-expanded`.
- Use `role="menu"` and `role="menuitem"` for the dropdown and items.
- Manage focus with refs and keyboard events.

**Sample Implementation:**

{% raw %}
```jsx
function AccessibleDropdown({ options, onSelect }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const triggerRef = useRef();
  const menuRef = useRef();

  useEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.children[focused]?.focus();
    }
  }, [open, focused]);

  return (
    <div>
      <button
        ref={triggerRef}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            setOpen(true);
            setFocused(0);
          }
        }}
      >
        Select option
      </button>
      {open && (
        <ul
          ref={menuRef}
          role="menu"
          tabIndex="-1"
          style={{ border: "1px solid #ccc", padding: 0 }}
        >
          {options.map((opt, i) => (
            <li
              key={opt}
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown")
                  setFocused((f) => (f + 1) % options.length);
                if (e.key === "ArrowUp")
                  setFocused((f) => (f - 1 + options.length) % options.length);
                if (e.key === "Enter") {
                  onSelect(opt);
                  setOpen(false);
                }
                if (e.key === "Escape") setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```
{% endraw %}

## Problem 2: Accessible Error Handling in Forms

**Challenge:** Announce errors and focus the first invalid field.

**Solution:**

- Use ARIA live regions for error messages.
- Use `aria-invalid` and `aria-describedby` on invalid fields.
- Focus the first invalid field on submit.

**Sample Implementation:**

```jsx
function AccessibleForm() {
  const [errors, setErrors] = useState({});
  const liveRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const newErrors = {};
    if (!username) newErrors.username = "Username required";
    if (!password) newErrors.password = "Password required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      liveRef.current.textContent = Object.values(newErrors).join(". ");
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
    } else {
      liveRef.current.textContent = "Form submitted successfully!";
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        name="username"
        aria-invalid={!!errors.username}
        aria-describedby={errors.username ? "username-error" : undefined}
      />
      {errors.username && (
        <div id="username-error" role="alert">
          {errors.username}
        </div>
      )}
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        name="password"
        type="password"
        aria-invalid={!!errors.password}
        aria-describedby={errors.password ? "password-error" : undefined}
      />
      {errors.password && (
        <div id="password-error" role="alert">
          {errors.password}
        </div>
      )}
      <button type="submit">Submit</button>
      <div ref={liveRef} aria-live="polite" className="sr-only" />
    </form>
  );
}
```

---

# Deep Dive: JavaScript, React, HTML, and Networking Interview Problems

---

## JavaScript: Core Interview Problems & Diagrams

### Problem: Debounce vs Throttle

**Question:** Explain debounce and throttle. Implement both in JavaScript. When would you use each?

**Answer:**

- **Debounce:** Ensures a function is only called after a certain period of inactivity. Useful for search input, window resize.
- **Throttle:** Ensures a function is called at most once every X ms. Useful for scroll, mousemove events.

```js
// Debounce
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

**Diagram:**

```mermaid
gantt
title Debounce vs Throttle Timeline
section Debounce
User Input :a1, 2025-07-05, 1d
Wait :a2, after a1, 1d
Function Fires :a3, after a2, 1d
section Throttle
User Input :b1, 2025-07-05, 1d
Function Fires :b2, after b1, 1d
Wait :b3, after b2, 1d
Function Fires :b4, after b3, 1d
```

---

## React: Key Interview Problem

### Problem: Controlled vs Uncontrolled Components

**Question:** What is the difference between controlled and uncontrolled components in React? Give examples.

**Answer:**

- **Controlled:** Form data is handled by React state. Example: `<input value={value} onChange={setValue} />`
- **Uncontrolled:** Form data is handled by the DOM. Example: `<input ref={inputRef} />`

**Diagram:**

```mermaid
flowchart TD
  A[User Input] -->|onChange| B[React State]
  B -->|value| C[Input Value]
  D[Uncontrolled: Input Value] --> E[DOM]
```

---

## HTML: Semantic Structure & Accessibility

### Problem: Accessible Navigation

**Question:** How do you create a navigation bar that is accessible to screen readers and keyboard users?

**Answer:**

- Use `<nav aria-label="Main navigation">`.
- Use `<ul role="menubar">` and `<li role="none">`.
- Each link: `role="menuitem"`, `aria-current` for active.

**Example:**

```jsx
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a href="/home" role="menuitem" aria-current="page">
        Home
      </a>
    </li>
    <li role="none">
      <a href="/about" role="menuitem">
        About
      </a>
    </li>
  </ul>
</nav>
```

---

## Networking: CORS, Preflight, and Security

### Problem: Explain CORS and Preflight

**Question:** What is CORS? What is a preflight request? How do you handle CORS in frontend apps?

**Answer:**

- **CORS (Cross-Origin Resource Sharing):** A browser security feature that restricts cross-origin HTTP requests.
- **Preflight:** An OPTIONS request sent before certain requests (e.g., with custom headers or methods) to check if the server allows it.
- **Handling:** Set appropriate headers on the server (`Access-Control-Allow-Origin`, etc.). On frontend, handle errors and show user-friendly messages.

**Diagram:**

```mermaid
sequenceDiagram
  participant Browser
  participant Server
  Browser->>Server: OPTIONS /api/data (preflight)
  Server-->>Browser: 200 OK + CORS headers
  Browser->>Server: GET /api/data
  Server-->>Browser: 200 OK + data
```

---

# More Practice & Resources

- [Frontend Interview Handbook](https://frontendinterviewhandbook.com/)
- [React Docs: Accessibility](https://react.dev/learn/accessibility)
- [MDN: JavaScript Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [What is CORS? (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

_Use these deep dives, diagrams, and problems to master core frontend interview topics. Practice explaining and drawing diagrams in interviews!_
