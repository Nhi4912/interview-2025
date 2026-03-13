# Accessibility Mind Map - Quick Reference


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp kiến thức Accessibility cho ôn tập nhanh.

---

## 🗺️ Accessibility Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ACCESSIBILITY (A11Y)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│                           ┌─────────────────┐                                │
│                           │  ACCESSIBILITY  │                                │
│                           └────────┬────────┘                                │
│                                    │                                         │
│        ┌────────────┬──────────────┼──────────────┬────────────┐            │
│        │            │              │              │            │            │
│   ┌────▼────┐ ┌─────▼────┐ ┌──────▼─────┐ ┌─────▼─────┐ ┌────▼────┐       │
│   │  WCAG   │ │   ARIA   │ │  KEYBOARD  │ │  SCREEN   │ │ TESTING │       │
│   │         │ │          │ │            │ │  READERS  │ │         │       │
│   │Perceive │ │Roles     │ │Tab order   │ │VoiceOver  │ │Automated│       │
│   │Operate  │ │States    │ │Focus trap  │ │NVDA       │ │Manual   │       │
│   │Understand│ │Properties│ │Skip links │ │Live region│ │User test│       │
│   │Robust   │ │Live      │ │Roving      │ │A11y tree  │ │CI/CD    │       │
│   └─────────┘ └──────────┘ └────────────┘ └───────────┘ └─────────┘       │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 WCAG Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    WCAG 2.2 OVERVIEW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   POUR PRINCIPLES:                                              │
│   ─────────────────                                              │
│                                                                   │
│   P - Perceivable     Content can be perceived                  │
│       • Text alternatives for images                            │
│       • Captions for media                                      │
│       • Color contrast                                          │
│                                                                   │
│   O - Operable        UI can be operated                        │
│       • Keyboard accessible                                     │
│       • Enough time                                             │
│       • No seizure triggers                                     │
│       • Navigation aids                                         │
│                                                                   │
│   U - Understandable  Content is understandable                 │
│       • Readable text                                           │
│       • Predictable behavior                                    │
│       • Input assistance                                        │
│                                                                   │
│   R - Robust          Works with assistive tech                 │
│       • Valid markup                                            │
│       • Status messages                                         │
│                                                                   │
│   CONFORMANCE LEVELS:                                           │
│   ───────────────────                                            │
│   A   = Minimum (must have)                                     │
│   AA  = Standard (legal requirement)  ◄── Target this          │
│   AAA = Enhanced (ideal)                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎭 ARIA Cheatsheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARIA QUICK REFERENCE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   RULES OF ARIA:                                                │
│   ──────────────                                                 │
│   1. Don't use ARIA if native HTML works                        │
│   2. Don't change native semantics                              │
│   3. All ARIA controls must be keyboard accessible              │
│   4. Don't use role="presentation" on focusable elements        │
│   5. All interactive elements must have accessible name         │
│                                                                   │
│   LANDMARK ROLES:                                               │
│   ───────────────                                                │
│   banner       ──▶ <header> (top level)                        │
│   navigation   ──▶ <nav>                                        │
│   main         ──▶ <main>                                       │
│   complementary ──▶ <aside>                                     │
│   contentinfo  ──▶ <footer> (top level)                        │
│   search       ──▶ Search form                                  │
│                                                                   │
│   COMMON WIDGET ROLES:                                          │
│   ────────────────────                                           │
│   button, link, checkbox, radio                                 │
│   tab, tablist, tabpanel                                        │
│   menu, menuitem, menubar                                       │
│   dialog, alertdialog                                           │
│   combobox, listbox, option                                     │
│   slider, progressbar                                           │
│                                                                   │
│   STATES:                                                       │
│   ───────                                                        │
│   aria-expanded    (true/false)                                 │
│   aria-selected    (true/false)                                 │
│   aria-checked     (true/false/mixed)                           │
│   aria-pressed     (true/false)                                 │
│   aria-disabled    (true/false)                                 │
│   aria-hidden      (true/false)                                 │
│   aria-busy        (true/false)                                 │
│   aria-invalid     (true/false)                                 │
│                                                                   │
│   PROPERTIES:                                                   │
│   ───────────                                                    │
│   aria-label       Direct name                                  │
│   aria-labelledby  Reference to name                            │
│   aria-describedby Reference to description                     │
│   aria-controls    Element controlled                           │
│   aria-owns        Parent-child relationship                    │
│   aria-activedescendant  Current active item                    │
│                                                                   │
│   LIVE REGIONS:                                                 │
│   ─────────────                                                  │
│   aria-live="polite"   Wait for pause                          │
│   aria-live="assertive" Interrupt immediately                   │
│   role="status"        Polite status message                    │
│   role="alert"         Assertive alert                          │
│   aria-atomic="true"   Announce entire region                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⌨️ Keyboard Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                    KEYBOARD PATTERNS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   BASIC KEYS:                                                   │
│   ───────────                                                    │
│   Tab          Next focusable element                           │
│   Shift+Tab    Previous focusable element                       │
│   Enter        Activate link/button                             │
│   Space        Activate button, toggle checkbox                 │
│   Escape       Close modal/dropdown                             │
│   Arrow keys   Navigate within component                        │
│                                                                   │
│   TABINDEX:                                                     │
│   ─────────                                                      │
│   tabindex="0"   In natural tab order                          │
│   tabindex="-1"  Programmatic focus only                        │
│   tabindex="1+"  ⚠️ AVOID (breaks natural order)               │
│                                                                   │
│   FOCUS MANAGEMENT:                                             │
│   ─────────────────                                              │
│   Skip links     Jump to main content                           │
│   Focus trap     Keep focus in modal                            │
│   Roving index   Arrow nav in groups                            │
│   Focus restore  Return focus after close                       │
│                                                                   │
│   :focus vs :focus-visible                                      │
│   ────────────────────────                                       │
│   :focus         All focus (mouse + keyboard)                   │
│   :focus-visible Keyboard focus only                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔊 Screen Reader Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCREEN READERS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   POPULAR SCREEN READERS:                                       │
│   ───────────────────────                                        │
│   NVDA       Windows, free, most used for testing               │
│   JAWS       Windows, paid, enterprise                          │
│   VoiceOver  macOS/iOS, built-in                               │
│   TalkBack   Android, built-in                                  │
│                                                                   │
│   ACCESSIBLE NAME PRIORITY:                                     │
│   ──────────────────────────                                     │
│   1. aria-labelledby                                            │
│   2. aria-label                                                 │
│   3. <label> for inputs                                         │
│   4. Text content                                               │
│   5. title attribute                                            │
│                                                                   │
│   WHAT GETS ANNOUNCED:                                          │
│   ─────────────────────                                          │
│   <button>Save</button>    → "Save, button"                     │
│   <a href>About</a>        → "About, link"                      │
│   <h2>Title</h2>           → "Title, heading level 2"           │
│   <input> + <label>Email   → "Email, edit text"                │
│                                                                   │
│   NAVIGATION KEYS (NVDA):                                       │
│   ───────────────────────                                        │
│   H    Next heading                                             │
│   1-6  Heading by level                                         │
│   K    Next link                                                │
│   B    Next button                                              │
│   F    Next form field                                          │
│   D    Next landmark                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    A11Y TESTING CHECKLIST                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   AUTOMATED (catches ~30-40%):                                  │
│   □ eslint-plugin-jsx-a11y                                      │
│   □ jest-axe for components                                     │
│   □ cypress-axe / playwright-axe                                │
│   □ Lighthouse accessibility score ≥90                          │
│                                                                   │
│   KEYBOARD:                                                     │
│   □ All elements reachable via Tab                              │
│   □ Tab order follows visual order                              │
│   □ Focus visible at all times                                  │
│   □ No keyboard traps                                           │
│   □ Escape closes modals                                        │
│   □ Skip link works                                             │
│                                                                   │
│   SCREEN READER:                                                │
│   □ Page title announced                                        │
│   □ Headings hierarchy logical                                  │
│   □ Images have alt text                                        │
│   □ Form labels announced                                       │
│   □ Errors announced                                            │
│   □ Dynamic content announced                                   │
│                                                                   │
│   VISUAL:                                                       │
│   □ Color contrast ≥4.5:1 (normal text)                        │
│   □ Color contrast ≥3:1 (large text, UI)                       │
│   □ Not relying on color alone                                  │
│   □ Text resizes to 200% without loss                          │
│                                                                   │
│   FORMS:                                                        │
│   □ All inputs have labels                                      │
│   □ Required fields indicated                                   │
│   □ Errors linked to fields                                     │
│   □ Clear error messages                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Interview Quick Answers

### Core Concepts

```
Q: What is WCAG?
A: Web Content Accessibility Guidelines. Current version 2.2.
   4 principles: Perceivable, Operable, Understandable, Robust.
   3 levels: A, AA (target), AAA.

Q: When to use ARIA?
A: Only when native HTML can't provide needed semantics.
   First rule: Don't use ARIA if native HTML works.

Q: What is the accessibility tree?
A: Simplified DOM for assistive tech. Contains role, name,
   state, value - not visual styling.

Q: aria-label vs aria-labelledby?
A: aria-label: string value for name
   aria-labelledby: references ID of visible element
```

### Keyboard & Focus

```
Q: tabindex values?
A: 0 = in natural order
   -1 = programmatic only
   1+ = avoid (breaks order)

Q: What is focus trap?
A: Keeping focus within modal/dialog.
   Tab at last element loops to first.

Q: What is roving tabindex?
A: Only one item in group has tabindex="0".
   Arrow keys move focus within group.
   Tab exits entire group.
```

### Testing

```
Q: What can't automated testing catch?
A: • Keyboard navigation UX
   • Screen reader experience
   • Meaningful content
   • Logical order
   • Complex interactions

Q: Contrast requirements (AA)?
A: Normal text: 4.5:1
   Large text (18pt+): 3:1
   UI components: 3:1
```

---

## ✅ Accessibility Quick Wins

```
STRUCTURE:
□ Single h1 per page
□ Logical heading hierarchy
□ Landmark regions (main, nav, header, footer)
□ Skip link to main content

IMAGES:
□ Alt text for meaningful images
□ Empty alt="" for decorative
□ Don't say "image of..."

FORMS:
□ Label every input
□ Use <label for="id">
□ Group related inputs with <fieldset>
□ Announce errors with aria-describedby

INTERACTIVE:
□ Use <button> not <div onClick>
□ Use <a href> for navigation
□ Visible focus indicators
□ Announce state changes

DYNAMIC:
□ aria-live for updates
□ Focus management for modals
□ Return focus after close
```

---

> **Module hoàn thành!** Quay lại [README.md](./mindmap-foundations.md) để xem tổng quan module.
