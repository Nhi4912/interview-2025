---
layout: page
title: "Component Design for Frontend Interviews"
description: "Component design principles covering reusability, composition, state management, and common patterns for scalable frontend architecture"
category: "System Design"
tags: [component-design, reusability, composition, props, state, context, patterns, frontend-architecture]
---

# Component Design for Frontend Interviews

**Thiết kế Component cho phỏng vấn Frontend**

## 1. Principles

- **Reusability:** Write generic, configurable components.
- **Composition:** Use children, slots, render props, HOC.
- **Isolation:** Encapsulate state, styles, logic.
- **Single Responsibility:** One job per component.

## 2. Props & State

- **Props:** Data passed from parent, read-only.
- **State:** Internal, mutable, useState/useReducer.
- **Derived state:** Compute from props, avoid duplication.

## 3. Context

- **Purpose:** Share data (theme, user, locale) without prop drilling.
- **Usage:** React.createContext, Provider, useContext.
- **Pitfalls:** Overuse can cause unnecessary re-renders.

## 4. Patterns

- **Container/Presentational:** Separate logic/UI.
- **Compound Components:** Parent manages state, children communicate via context.
- **Render Props:** Pass a function as a child.
- **Higher-Order Components (HOC):** Function that returns a component.

## 5. Best Practices

- **PropTypes/TypeScript:** Type safety.
- **Testing:** Unit, integration, snapshot.
- **Accessibility:** ARIA, keyboard support.
- **Performance:** Memoization, avoid unnecessary renders.

## 6. Interview Questions

- How to design a reusable button?
- How to share state between deeply nested components?
- When to use context vs props?
- How to test a component?

## 7. Resources

- [React Patterns](https://reactpatterns.com/)
- [Component Design Patterns](https://kentcdodds.com/blog/react-component-patterns)
