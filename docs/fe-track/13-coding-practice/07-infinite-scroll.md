---
layout: page
title: "Infinite Scroll List"
difficulty: Medium
category: "Coding Problems"
tags: [react, performance, api-integration, virtualization, intersection-observer]
---

# Problem: Infinite Scroll List

## Description

Implement a list that loads more items as the user scrolls to the bottom.

## Requirements

- Fetch data in pages from an API
- Show loading indicator
- Handle errors and retries
- Optimize for performance (windowing/virtualization)

## Solution Outline

- Use Intersection Observer or scroll events
- Maintain loaded items in state
- Use `react-window` for large lists

## Sample Implementation (React)

```jsx
// ...component skeleton with fetch, observer, and virtualization...
```

## Follow-up

- How would you handle duplicate or missing items?
- How would you make it accessible for screen readers?
