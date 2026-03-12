---
layout: page
title: "Autocomplete Component"
difficulty: Medium
category: "Coding Problems"
tags: [react, accessibility, api-integration, keyboard-navigation, aria]
---

# Problem: Autocomplete Component

## Description

Build an accessible autocomplete input that fetches suggestions from an API as the user types.

## Requirements

- Debounce API calls
- Keyboard navigation (up/down/enter/escape)
- Highlight active suggestion
- ARIA roles and live region for accessibility

## Solution Outline

- Use debounce for API requests
- Manage focus and active index in state
- Use `role="listbox"` and `role="option"`

## Sample Implementation (React)

```jsx
// ...component skeleton with hooks, debounce, and ARIA roles...
```

## Follow-up

- How would you handle slow or failed API responses?
- How would you support mobile accessibility?
