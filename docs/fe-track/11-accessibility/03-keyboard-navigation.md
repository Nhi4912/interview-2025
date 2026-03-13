# Keyboard Navigation - Focus Management & Accessibility

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Keyboard accessibility ensures all users can navigate and interact with your application without a mouse.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    KEYBOARD NAVIGATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   WHY KEYBOARD MATTERS:                                         │
│   ─────────────────────                                         │
│   • Screen reader users navigate by keyboard                    │
│   • Motor impairment users can't use mouse                      │
│   • Power users prefer keyboard shortcuts                       │
│   • Required for WCAG 2.1 Level A compliance                    │
│                                                                   │
│   KEY CONCEPTS:                                                  │
│   ──────────────                                                 │
│   Tab Order     ──▶ Sequence of focusable elements              │
│   Focus Ring    ──▶ Visual indicator of current focus           │
│   Focus Trap    ──▶ Keep focus within modal/dialog              │
│   Skip Links    ──▶ Bypass navigation to main content           │
│   Roving Index  ──▶ Arrow key navigation in groups              │
│                                                                   │
│   FOCUSABLE ELEMENTS:                                           │
│   ───────────────────                                            │
│   Native: <a href>, <button>, <input>, <select>, <textarea>     │
│   Custom: [tabindex="0"] makes any element focusable            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 What - Tab Order & Focus

### Natural Tab Order

```
┌─────────────────────────────────────────────────────────────────┐
│                      TAB ORDER FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   DOM Order determines Tab Order (by default)                    │
│                                                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  1. [Skip to Main] ─────────────────────────────────────│  │
│   │                                                          │  │
│   │  2. [Logo/Home]  3. [Nav 1]  4. [Nav 2]  5. [Search]    │  │
│   │                                                          │  │
│   │  6. [Main Content Start]                                │  │
│   │      7. [Link]  8. [Button]  9. [Form Field]            │  │
│   │                                                          │  │
│   │  10. [Sidebar Link 1]  11. [Sidebar Link 2]             │  │
│   │                                                          │  │
│   │  12. [Footer Link 1]  13. [Footer Link 2]               │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│   Tab     = Move forward                                        │
│   Shift+Tab = Move backward                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### tabindex Values

```html
<!-- tabindex="0": Add to natural tab order -->
<div tabindex="0" role="button">Focusable div</div>

<!-- tabindex="-1": Programmatically focusable only -->
<div tabindex="-1" id="modal">
    <!-- Can focus with JavaScript, not Tab key -->
</div>

<!-- tabindex="1+": AVOID! Changes natural order -->
<!-- Creates confusing navigation -->
<input tabindex="3"> <!-- Don't do this -->
<input tabindex="1"> <!-- Creates chaos -->
<input tabindex="2"> <!-- Hard to maintain -->
```

```
┌─────────────────────────────────────────────────────────────────┐
│                    TABINDEX VALUES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Value      Behavior                     Use Case               │
│   ─────────────────────────────────────────────────────────────  │
│   tabindex="0"    In natural order       Custom interactive     │
│   tabindex="-1"   Only via JavaScript    Modal, skip target     │
│   tabindex="1+"   ⚠️ AVOID              Creates confusion      │
│                                                                   │
│   RULE: Never use positive tabindex values                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 How - Focus Management Patterns

### Skip Links

```html
<!-- Skip link - first element in body -->
<body>
    <a href="#main-content" class="skip-link">
        Skip to main content
    </a>

    <header>
        <nav><!-- 20+ navigation links --></nav>
    </header>

    <main id="main-content" tabindex="-1">
        <!-- Main content here -->
    </main>
</body>
```

```css
/* Skip link styling */
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: 8px 16px;
    background: #000;
    color: #fff;
    z-index: 100;
    transition: top 0.3s;
}

.skip-link:focus {
    top: 0;
}
```

### Focus Trap for Modals

```
┌─────────────────────────────────────────────────────────────────┐
│                    FOCUS TRAP PATTERN                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Without Focus Trap:           With Focus Trap:                │
│   ───────────────────           ──────────────────              │
│                                                                   │
│   [Page Button]                 [Page Button] (hidden)          │
│        │                                                         │
│        ▼                              ┌──────────────┐          │
│   ┌─────────┐                         │   Modal      │          │
│   │ Modal   │  ──Tab──▶ [Page]       │              │          │
│   │         │  (escapes!)            │  ┌──▶ [X]    │          │
│   └─────────┘                         │  │          │          │
│        │                              │  │  [Input] │          │
│        ▼                              │  │          │          │
│   [Footer Link]                       │  └── [Save] │          │
│   (user lost!)                        │      │      │          │
│                                        │      ▼      │          │
│                                        │   (loops)   │          │
│                                        └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```jsx
// React Focus Trap Hook
function useFocusTrap(isOpen) {
    const containerRef = useRef(null);
    const previousActiveElement = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Store current focus to restore later
        previousActiveElement.current = document.activeElement;

        const container = containerRef.current;
        if (!container) return;

        // Get all focusable elements
        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element
        firstElement?.focus();

        function handleKeyDown(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        }

        container.addEventListener('keydown', handleKeyDown);

        return () => {
            container.removeEventListener('keydown', handleKeyDown);
            // Restore focus when closing
            previousActiveElement.current?.focus();
        };
    }, [isOpen]);

    return containerRef;
}

// Usage
function Modal({ isOpen, onClose, children }) {
    const modalRef = useFocusTrap(isOpen);

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <h2 id="modal-title">Modal Title</h2>
            {children}
            <button onClick={onClose}>Close</button>
        </div>
    );
}
```

### Roving tabindex Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROVING TABINDEX                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   For component groups (tabs, menus, toolbars):                 │
│                                                                   │
│   Only ONE item has tabindex="0" at a time                      │
│   Arrow keys move focus within group                            │
│   Tab key exits group entirely                                  │
│                                                                   │
│   EXAMPLE - Tabs:                                               │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  [Tab 1]        [Tab 2]        [Tab 3]                  │   │
│   │  tabindex="0"   tabindex="-1"  tabindex="-1"            │   │
│   │  aria-selected  ◄──── Arrow ────▶                       │   │
│   │  ="true"                                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   User presses Tab: enters Tab 1                                │
│   User presses →: moves to Tab 2 (Tab 2 gets tabindex="0")     │
│   User presses Tab: exits tabs, goes to next page element      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```jsx
// Roving tabindex implementation
function TabList({ tabs, activeIndex, onChange }) {
    const tabRefs = useRef([]);

    function handleKeyDown(e, index) {
        let newIndex = index;

        switch (e.key) {
            case 'ArrowRight':
                newIndex = (index + 1) % tabs.length;
                break;
            case 'ArrowLeft':
                newIndex = (index - 1 + tabs.length) % tabs.length;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = tabs.length - 1;
                break;
            default:
                return;
        }

        e.preventDefault();
        onChange(newIndex);
        tabRefs.current[newIndex]?.focus();
    }

    return (
        <div role="tablist">
            {tabs.map((tab, index) => (
                <button
                    key={tab.id}
                    ref={el => tabRefs.current[index] = el}
                    role="tab"
                    aria-selected={index === activeIndex}
                    tabIndex={index === activeIndex ? 0 : -1}
                    onClick={() => onChange(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
```

---

## 🎨 Focus Indicators

### Visible Focus Styles

```css
/* ❌ BAD: Removing focus outline */
*:focus {
    outline: none; /* Accessibility violation! */
}

/* ✅ GOOD: Custom focus styles */
:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
}

/* ✅ BETTER: Focus-visible for keyboard only */
:focus {
    outline: none;
}

:focus-visible {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
}

/* Interactive elements */
button:focus-visible,
a:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
    border-radius: 4px;
}

/* Form inputs */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
    outline: 2px solid #005fcc;
    border-color: #005fcc;
    box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.25);
}
```

```
┌─────────────────────────────────────────────────────────────────┐
│               :focus vs :focus-visible                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   :focus                    :focus-visible                      │
│   ──────                    ───────────────                     │
│   Triggers on ALL focus     Triggers on keyboard focus          │
│   Mouse click = focus ring  Mouse click = no ring               │
│   Can be annoying           Better UX for most users            │
│                                                                   │
│   RECOMMENDATION:                                               │
│   Use :focus-visible for mouse users                            │
│   Provide :focus fallback for older browsers                    │
│                                                                   │
│   @supports selector(:focus-visible) {                          │
│       button:focus { outline: none; }                           │
│       button:focus-visible { outline: 2px solid blue; }         │
│   }                                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### High Contrast Focus

```css
/* Support for high contrast mode */
@media (prefers-contrast: high) {
    :focus-visible {
        outline: 3px solid currentColor;
        outline-offset: 3px;
    }
}

/* Windows High Contrast Mode */
@media (forced-colors: active) {
    :focus-visible {
        outline: 3px solid CanvasText;
        outline-offset: 2px;
    }
}
```

---

## ⌨️ Keyboard Shortcuts

### Common Patterns

```
┌─────────────────────────────────────────────────────────────────┐
│                    KEYBOARD SHORTCUTS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   NAVIGATION:                                                   │
│   ───────────                                                    │
│   Tab           Move to next focusable element                  │
│   Shift+Tab     Move to previous focusable element              │
│   Enter/Space   Activate button, link, or checkbox              │
│   Escape        Close modal, dropdown, cancel action            │
│   Arrow keys    Navigate within component (tabs, menu)          │
│                                                                   │
│   FORM ELEMENTS:                                                │
│   ──────────────                                                 │
│   Space         Toggle checkbox, open select                    │
│   Arrow Up/Down Navigate select options                         │
│   Enter         Submit form (when on button)                    │
│                                                                   │
│   CUSTOM APP SHORTCUTS:                                         │
│   ─────────────────────                                          │
│   Ctrl+S        Save                                            │
│   Ctrl+Z        Undo                                            │
│   Ctrl+/        Help / shortcuts panel                          │
│   ?             Show keyboard shortcuts                         │
│                                                                   │
│   ⚠️  RULES:                                                    │
│   • Don't override browser defaults (Ctrl+C, Ctrl+V)           │
│   • Provide way to discover shortcuts                          │
│   • Allow users to customize or disable                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Implementing Keyboard Shortcuts

```jsx
// Custom keyboard shortcut hook
function useKeyboardShortcut(key, callback, modifiers = {}) {
    useEffect(() => {
        function handleKeyDown(e) {
            const { ctrl = false, shift = false, alt = false, meta = false } = modifiers;

            if (
                e.key.toLowerCase() === key.toLowerCase() &&
                e.ctrlKey === ctrl &&
                e.shiftKey === shift &&
                e.altKey === alt &&
                e.metaKey === meta
            ) {
                e.preventDefault();
                callback(e);
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [key, callback, modifiers]);
}

// Usage
function App() {
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Ctrl+S to save
    useKeyboardShortcut('s', () => {
        console.log('Save triggered');
    }, { ctrl: true });

    // ? to show shortcuts
    useKeyboardShortcut('?', () => {
        setShowShortcuts(true);
    }, { shift: true });

    // Escape to close
    useKeyboardShortcut('Escape', () => {
        setShowShortcuts(false);
    });

    return (
        <div>
            {showShortcuts && (
                <ShortcutsDialog onClose={() => setShowShortcuts(false)} />
            )}
        </div>
    );
}

// Keyboard shortcuts dialog
function ShortcutsDialog({ onClose }) {
    return (
        <div role="dialog" aria-label="Keyboard shortcuts">
            <h2>Keyboard Shortcuts</h2>
            <dl>
                <dt><kbd>Ctrl</kbd> + <kbd>S</kbd></dt>
                <dd>Save document</dd>

                <dt><kbd>Ctrl</kbd> + <kbd>Z</kbd></dt>
                <dd>Undo</dd>

                <dt><kbd>?</kbd></dt>
                <dd>Show this help</dd>

                <dt><kbd>Esc</kbd></dt>
                <dd>Close dialog</dd>
            </dl>
            <button onClick={onClose}>Close</button>
        </div>
    );
}
```

---

## 🧩 Component Patterns

### Accessible Dropdown Menu

```jsx
function DropdownMenu({ trigger, items }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const itemRefs = useRef([]);

    function handleButtonKeyDown(e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'Enter':
            case ' ':
                e.preventDefault();
                setIsOpen(true);
                setActiveIndex(0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setIsOpen(true);
                setActiveIndex(items.length - 1);
                break;
        }
    }

    function handleMenuKeyDown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(i => (i + 1) % items.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(i => (i - 1 + items.length) % items.length);
                break;
            case 'Home':
                e.preventDefault();
                setActiveIndex(0);
                break;
            case 'End':
                e.preventDefault();
                setActiveIndex(items.length - 1);
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                buttonRef.current?.focus();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                items[activeIndex]?.action();
                setIsOpen(false);
                buttonRef.current?.focus();
                break;
        }
    }

    useEffect(() => {
        if (isOpen && activeIndex >= 0) {
            itemRefs.current[activeIndex]?.focus();
        }
    }, [isOpen, activeIndex]);

    return (
        <div className="dropdown">
            <button
                ref={buttonRef}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleButtonKeyDown}
            >
                {trigger}
            </button>

            {isOpen && (
                <ul
                    ref={menuRef}
                    role="menu"
                    onKeyDown={handleMenuKeyDown}
                >
                    {items.map((item, index) => (
                        <li
                            key={item.id}
                            ref={el => itemRefs.current[index] = el}
                            role="menuitem"
                            tabIndex={index === activeIndex ? 0 : -1}
                            onClick={() => {
                                item.action();
                                setIsOpen(false);
                            }}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

### Focus Management on Route Change

```jsx
// Focus management for SPA navigation
function useRouteChangeFocus() {
    const location = useLocation();
    const mainRef = useRef(null);

    useEffect(() => {
        // Focus main content on route change
        mainRef.current?.focus();

        // Announce page change to screen readers
        const pageTitle = document.title;
        const announcement = `Navigated to ${pageTitle}`;

        // Use live region for announcement
        const liveRegion = document.getElementById('route-announcer');
        if (liveRegion) {
            liveRegion.textContent = announcement;
        }
    }, [location.pathname]);

    return mainRef;
}

// App layout
function Layout({ children }) {
    const mainRef = useRouteChangeFocus();

    return (
        <>
            <a href="#main" className="skip-link">
                Skip to main content
            </a>

            <header>
                <nav>{/* Navigation */}</nav>
            </header>

            <main
                id="main"
                ref={mainRef}
                tabIndex={-1}
            >
                {children}
            </main>

            {/* Route announcer for screen readers */}
            <div
                id="route-announcer"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />
        </>
    );
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is tabindex and what values can it have?**

A: tabindex controls keyboard focus order:
- `tabindex="0"`: Element is focusable in natural DOM order
- `tabindex="-1"`: Element can be focused programmatically but not via Tab key
- `tabindex="1+"`: Should be avoided as it overrides natural order and creates confusion

**Q: Why shouldn't you remove focus outlines?**

A: Focus outlines are essential for keyboard users to know where they are on the page. Removing them violates WCAG 2.4.7 (Focus Visible). Instead, customize the appearance while maintaining visibility.

### 🟡 Mid-level

**Q: What is focus trapping and when is it needed?**

A: Focus trapping keeps keyboard focus within a specific container (like a modal). It's needed when:
- Modal dialogs are open
- Dropdown menus are expanded
- Any overlay that should capture all interaction

Implementation: Intercept Tab key at first/last elements and loop back.

**Q: Explain roving tabindex pattern.**

A: Roving tabindex is used for composite widgets (tabs, menus):
1. Only one item in the group has `tabindex="0"`
2. Other items have `tabindex="-1"`
3. Arrow keys move focus and update which item has `tabindex="0"`
4. Tab exits the entire group

This provides single Tab stop for the group while allowing internal arrow navigation.

### 🔴 Senior

**Q: How do you handle focus management in a SPA?**

A: SPA focus management strategies:

1. **Route Change**: Move focus to main content or h1
2. **Announcements**: Use `aria-live` region to announce page changes
3. **Skip Links**: Ensure skip link targets are focusable (`tabindex="-1"`)
4. **State Changes**: Return focus after modal close, restore focus after deletions
5. **Loading States**: Announce loading/loaded states

```jsx
// Focus main content on route change
useEffect(() => {
    mainRef.current?.focus();
    announcer.textContent = `Page ${title} loaded`;
}, [pathname]);
```

**Q: Design keyboard navigation for a complex data grid**

A: Data grid keyboard pattern:
- Arrow keys: Cell-to-cell navigation
- Home/End: First/last cell in row
- Ctrl+Home/End: First/last cell in grid
- Enter: Edit cell / activate link
- Escape: Exit edit mode
- Tab: Move between actionable elements within cell, then next interactive section

Use `aria-activedescendant` for focus management without moving DOM focus, improving performance in large grids.

---

## 📚 Active Recall

1. [ ] What are the three values of tabindex and when to use each?
2. [ ] Implement a focus trap for a modal
3. [ ] Explain roving tabindex pattern
4. [ ] Why is :focus-visible preferred over :focus?
5. [ ] How do you manage focus in SPA route changes?

---

> **Tiếp theo:** [04-screen-readers.md](./04-screen-readers.md) - Screen Reader Compatibility
