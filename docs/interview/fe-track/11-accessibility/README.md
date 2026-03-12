# Accessibility (A11y) - Inclusive Web Development

> Accessibility không chỉ là compliance - nó là về building products everyone can use. WCAG guidelines và practical implementation.

---

## 🎯 Module Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      ACCESSIBILITY                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │    WCAG     │   │    ARIA     │   │  KEYBOARD   │           │
│   │             │   │             │   │             │           │
│   │ Guidelines  │   │ Roles       │   │ Focus       │           │
│   │ Principles  │   │ States      │   │ Navigation  │           │
│   │ Levels      │   │ Properties  │   │ Traps       │           │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                   │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │  SCREEN     │   │   VISUAL    │   │  TESTING    │           │
│   │  READERS    │   │             │   │             │           │
│   │             │   │ Color       │   │ Automated   │           │
│   │ VoiceOver   │   │ Contrast    │   │ Manual      │           │
│   │ NVDA, JAWS  │   │ Typography  │   │ User        │           │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                   │
│   Tại sao quan trọng:                                            │
│   • 15% dân số có disability                                     │
│   • Legal compliance (ADA, Section 508)                          │
│   • Better UX for everyone                                       │
│   • SEO benefits                                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Nội Dung Module

### 1. [WCAG Fundamentals](./01-wcag-fundamentals.md)
- WCAG 2.2 guidelines
- POUR principles
- Conformance levels (A, AA, AAA)
- Success criteria

### 2. [ARIA Attributes](./02-aria-attributes.md)
- ARIA roles
- States and properties
- Live regions
- When to use/avoid ARIA

### 3. [Keyboard Navigation](./03-keyboard-navigation.md)
- Focus management
- Tab order
- Focus trapping (modals)
- Skip links

### 4. [Screen Readers](./04-screen-readers.md)
- How screen readers work
- Testing with VoiceOver/NVDA
- Common issues
- Best practices

### 5. [Testing Accessibility](./05-testing-accessibility.md)
- Automated testing tools
- Manual testing checklist
- User testing
- CI/CD integration

---

## 🎯 Learning Objectives

Sau khi hoàn thành module này, bạn sẽ:

- [ ] Understand WCAG guidelines và levels
- [ ] Implement ARIA correctly
- [ ] Build keyboard-accessible interfaces
- [ ] Test with screen readers
- [ ] Set up automated a11y testing

---

## 📊 WCAG Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    WCAG 2.2 OVERVIEW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   POUR PRINCIPLES:                                               │
│   ─────────────────                                              │
│   P - Perceivable     Users must be able to perceive content    │
│   O - Operable        UI must be operable                        │
│   U - Understandable  Content must be understandable            │
│   R - Robust          Content must work with assistive tech     │
│                                                                   │
│   CONFORMANCE LEVELS:                                            │
│   ───────────────────                                            │
│   Level A     Minimum accessibility                              │
│   Level AA    Standard (most sites target this)                 │
│   Level AAA   Highest level (often not fully achievable)        │
│                                                                   │
│   KEY SUCCESS CRITERIA (AA):                                     │
│   ─────────────────────────                                      │
│   • Color contrast: 4.5:1 (normal text), 3:1 (large text)       │
│   • Keyboard accessible: All functionality via keyboard         │
│   • Focus visible: Clear focus indicator                        │
│   • Alt text: Meaningful alternatives for images                │
│   • Headings: Proper hierarchy (h1 → h2 → h3)                   │
│   • Forms: Labels and error messages                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 Recommended Path

```
Week 1: WCAG Fundamentals + ARIA
Week 2: Keyboard + Screen Readers
Week 3: Testing + Practice
```

---

> **Tiếp theo:** [01-wcag-fundamentals.md](./01-wcag-fundamentals.md) - WCAG Fundamentals
