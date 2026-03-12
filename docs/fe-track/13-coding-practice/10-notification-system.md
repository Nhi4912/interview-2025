---
layout: page
title: "Notification System"
difficulty: Medium
category: "Coding Problems"
tags: [react, context, accessibility, toast, state-management]
---

# Problem: Notification System

## Description

Implement a notification (toast) system for a web app.

## Requirements

- Show notifications with different types (info, success, error)
- Auto-dismiss after timeout
- Allow manual dismiss
- Announce to screen readers

## Solution Outline

- Use context or global state for notifications
- Use ARIA live region for accessibility

## Sample Implementation (React)

```jsx
// ...notification context/provider and toast component...
```

## Follow-up

- How would you queue notifications?
- How would you support custom actions in notifications?
