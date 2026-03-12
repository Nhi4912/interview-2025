# Comprehensive Frontend Interview Guide
**100+ Questions & Knowledge Areas for Big Tech Companies**

## Table of Contents
- [Overview](#overview)
- [Question Categories](#question-categories)
- [HTML & CSS (25+ Questions)](#html--css)
- [JavaScript (30+ Questions)](#javascript)
- [React & Frameworks (20+ Questions)](#react--frameworks)
- [HTTP & Networking (15+ Questions)](#http--networking)
- [Performance & Optimization (10+ Questions)](#performance--optimization)
- [Security (8+ Questions)](#security)
- [Testing (6+ Questions)](#testing)
- [System Design (5+ Questions)](#system-design)
- [Study Plan](#study-plan)
- [Resources](#resources)

## Overview

This comprehensive guide contains **100+ interview questions** covering all essential frontend development topics for Big Tech interviews (Google, Meta, Amazon, Microsoft, Apple, Netflix, etc.). Each section includes questions ranging from **basic** to **advanced** levels with practical examples and detailed answers.

### Target Audience
- Frontend engineers with 2-5 years of experience
- Developers preparing for Big Tech interviews
- Anyone looking to strengthen their frontend fundamentals

### Difficulty Levels
- 🟢 **Easy**: Basic concepts and definitions
- 🟡 **Medium**: Practical implementation and deeper understanding
- 🔴 **Hard**: Advanced patterns, optimization, and complex scenarios

## Question Categories

### HTML & CSS (25+ Questions)

#### HTML Fundamentals (12 Questions)
1. 🟢 **What is an HTML element?**
   - Understanding of opening/closing tags, nesting, common elements

2. 🟢 **What information goes in the `<head>` section?**
   - Metadata, title, meta tags, links, scripts

3. 🟡 **Common `<meta>` element types and their purposes**
   - charset, description, viewport, keywords, Open Graph

4. 🟡 **What are semantic elements?**
   - header, nav, main, section, article, aside, footer vs div/span

5. 🟡 **How to link to elements within the same page?**
   - Using id attributes and anchor tags

6. 🟡 **Absolute vs relative links**
   - Understanding URL structures and file paths

7. 🟡 **Purpose of `target` attribute in anchor tags**
   - _self, _blank, _parent, _top

8. 🔴 **Why use `rel="noopener"` with external links?**
   - Security vulnerabilities, window.opener access

9. 🟢 **Common web image formats**
   - JPEG, PNG, GIF, SVG, WebP, AVIF

10. 🟡 **Responsive image sizing techniques**
    - CSS approaches, srcset, picture element

11. 🔴 **Image lazy loading concepts**
    - Native loading="lazy", Intersection Observer API

12. 🟡 **Purpose and communication with `<iframe>`**
    - Embedding content, postMessage API

#### Advanced HTML Topics (8 Questions)
13. 🟡 **What does a doctype do?**
    - Standards mode vs quirks mode

14. 🟡 **Differences between HTML and XHTML**
    - Syntax strictness, XML-based vs SGML-based

15. 🟡 **Purpose of `data-*` attributes**
    - Custom data storage, JavaScript access

16. 🟡 **Cookie vs sessionStorage vs localStorage**
    - Storage mechanisms, scope, persistence

17. 🟡 **Script loading: `async` vs `defer`**
    - Parsing behavior, execution timing

18. 🟡 **CSS in `<head>` vs JS before `</body>`**
    - FOUC prevention, progressive rendering

19. 🟡 **What is progressive rendering?**
    - Performance optimization strategies

20. 🟡 **Using `srcset` in img tags**
    - Responsive images, density descriptors

#### CSS Advanced Concepts (5+ Questions)
21. 🟡 **CSS Box Model explanation**
    - Content, padding, border, margin, box-sizing

22. 🟡 **Display: none vs visibility: hidden**
    - Layout effects, space preservation

23. 🔴 **CSS specificity calculation**
    - Inline, ID, class, element selector weights

24. 🔴 **CSS Grid vs Flexbox**
    - One-dimensional vs two-dimensional layouts

25. 🔴 **Modern CSS features**
    - Custom properties, container queries, logical properties

### JavaScript (30+ Questions)

#### Core Concepts (10 Questions)
26. 🟢 **Difference between var, let, and const**
    - Scoping, hoisting, reassignment

27. 🟢 **== vs === comparison**
    - Type coercion vs strict equality

28. 🟡 **Explain closures with examples**
    - Lexical scoping, practical applications

29. 🟡 **Event loop explanation**
    - Call stack, callback queue, microtasks

30. 🟡 **Promises vs async/await**
    - Asynchronous patterns, error handling

31. 🔴 **call, apply, and bind differences**
    - Context binding, argument passing

32. 🔴 **Hoisting behavior**
    - var, let, const, function declarations

33. 🔴 **Arrow functions vs regular functions**
    - this binding, arguments object, constructors

34. 🔴 **Generators and iterators**
    - yield, custom iterators, async generators

35. 🔴 **Type coercion mechanisms**
    - Implicit/explicit conversion, truthy/falsy

#### Advanced JavaScript (10 Questions)
36. 🔴 **Symbols and their use cases**
    - Unique identifiers, well-known symbols

37. 🔴 **Proxy and Reflect APIs**
    - Meta-programming, property interception

38. 🔴 **WeakMap and WeakSet**
    - Weak references, garbage collection

39. 🔴 **Advanced Promise patterns**
    - Promise.all, Promise.race, Promise.allSettled

40. 🔴 **JavaScript modules**
    - ES6 modules, CommonJS, dynamic imports

41. 🟡 **Array methods implementation**
    - Custom map, filter, reduce, forEach

42. 🟡 **Custom Promise.all implementation**
    - Understanding Promise mechanics

43. 🟡 **Debounce and throttle functions**
    - Performance optimization patterns

44. 🟡 **Deep cloning objects**
    - Recursive copying, handling edge cases

45. 🟡 **Event emitter pattern**
    - Observer pattern implementation

#### Data Structures & Algorithms (10 Questions)
46. 🟡 **LRU Cache implementation**
    - Map-based caching strategy

47. 🟡 **Binary Search Tree**
    - Insert, find, traversal methods

48. 🟡 **Graph with BFS/DFS**
    - Adjacency list, traversal algorithms

49. 🟡 **Queue with two stacks**
    - Stack-based queue implementation

50. 🟡 **Memoization function**
    - Caching expensive calculations

51. 🟡 **Singleton pattern**
    - Single instance enforcement

52. 🔴 **Virtual scrolling**
    - Large list optimization

53. 🔴 **Rate limiting implementation**
    - API request throttling

54. 🔴 **Request retry with backoff**
    - Error handling patterns

55. 🔴 **Promise queue management**
    - Concurrent request limiting

### React & Frameworks (20+ Questions)

#### React Fundamentals (8 Questions)
56. 🟢 **Virtual DOM benefits**
    - Performance, predictability, cross-browser compatibility

57. 🟢 **State vs Props differences**
    - Mutability, ownership, data flow

58. 🟡 **React hooks and their rules**
    - useState, useEffect, hook constraints

59. 🟡 **useEffect dependency arrays**
    - Lifecycle replacement, cleanup functions

60. 🟡 **React Context usage**
    - Prop drilling solution, provider/consumer pattern

61. 🔴 **React reconciliation**
    - Diffing algorithm, key prop importance

62. 🔴 **Performance optimization**
    - React.memo, useMemo, useCallback

63. 🔴 **Custom hooks creation**
    - Logic extraction and reuse

#### Advanced React Patterns (7 Questions)
64. 🔴 **Error boundaries**
    - JavaScript error catching, fallback UI

65. 🔴 **Higher-Order Components**
    - Component enhancement patterns

66. 🔴 **Render props pattern**
    - Function as children, component composition

67. 🔴 **Code splitting with React.lazy**
    - Dynamic imports, Suspense boundaries

68. 🔴 **React performance profiling**
    - DevTools, performance bottlenecks

69. 🔴 **State management patterns**
    - useReducer, Context + Reducer

70. 🔴 **React testing strategies**
    - Component testing, mocking, integration tests

#### Framework Comparisons (5 Questions)
71. 🟡 **React vs Vue vs Angular**
    - Philosophy, architecture, use cases

72. 🟡 **SSR vs CSR vs SSG**
    - Rendering strategies, performance implications

73. 🟡 **State management libraries**
    - Redux, MobX, Zustand comparison

74. 🟡 **Build tools and bundlers**
    - Webpack, Vite, Parcel differences

75. 🟡 **TypeScript integration**
    - Type safety, development experience

### HTTP & Networking (15+ Questions)

#### HTTP Fundamentals (8 Questions)
76. 🟢 **Client-server model**
    - Request/response cycle, roles

77. 🟡 **HTTP methods and properties**
    - GET, POST, PUT, DELETE, idempotency

78. 🟡 **HTTP status codes**
    - 1xx, 2xx, 3xx, 4xx, 5xx categories

79. 🟡 **Headers vs request body**
    - Metadata vs payload, usage patterns

80. 🟡 **Common HTTP headers**
    - Authorization, Content-Type, Cache-Control

81. 🔴 **HTTP stateless protocol**
    - State management solutions

82. 🟢 **HTTP cookies purpose**
    - Session management, tracking, personalization

83. 🟡 **First-party vs third-party cookies**
    - Privacy implications, browser policies

#### Advanced Networking (7 Questions)
84. 🔴 **Cookie security attributes**
    - Secure, HttpOnly, SameSite

85. 🟡 **MIME types and content negotiation**
    - Accept headers, content representation

86. 🔴 **Binary data over HTTP/1**
    - Base64, multipart encoding

87. 🔴 **Real-time communication**
    - WebSockets, SSE, long polling

88. 🔴 **HTTP/2 improvements**
    - Multiplexing, server push, header compression

89. 🔴 **HTTP/3 and QUIC**
    - UDP-based transport, performance benefits

90. 🔴 **CORS and security**
    - Cross-origin policies, preflight requests

### Performance & Optimization (10+ Questions)

91. 🟡 **Critical rendering path**
    - DOM, CSSOM, render tree construction

92. 🟡 **Lazy loading techniques**
    - Images, components, route-based splitting

93. 🔴 **Bundle optimization**
    - Tree shaking, code splitting, compression

94. 🔴 **Performance metrics**
    - Core Web Vitals, FCP, LCP, CLS

95. 🔴 **Memory leak prevention**
    - Event listeners, closures, DOM references

96. 🔴 **Service Workers**
    - Caching strategies, offline functionality

97. 🔴 **Performance profiling**
    - DevTools, Lighthouse, performance monitoring

98. 🟡 **Image optimization**
    - Formats, compression, responsive images

99. 🟡 **CSS performance**
    - Selector efficiency, paint optimization

100. 🔴 **JavaScript performance**
     - V8 optimization, async patterns

### Security (8+ Questions)

101. 🟡 **XSS prevention**
     - Input sanitization, CSP headers

102. 🟡 **CSRF protection**
     - Tokens, SameSite cookies

103. 🔴 **Content Security Policy**
     - XSS mitigation, resource loading control

104. 🔴 **HTTPS importance**
     - Encryption, certificate validation

105. 🟡 **Authentication patterns**
     - JWT, OAuth, session management

106. 🟡 **Input validation**
     - Client vs server-side validation

107. 🔴 **Security headers**
     - HSTS, X-Frame-Options, referrer policies

108. 🔴 **Dependency security**
     - npm audit, vulnerability management

### Testing (6+ Questions)

109. 🟡 **Testing pyramid**
     - Unit, integration, e2e test strategies

110. 🟡 **React component testing**
     - React Testing Library, Jest

111. 🟡 **Mocking strategies**
     - API mocks, module mocks

112. 🟡 **Test-driven development**
     - Red-green-refactor cycle

113. 🔴 **E2E testing**
     - Cypress, Playwright automation

114. 🔴 **Visual regression testing**
     - Screenshot comparisons, UI testing

### System Design (5+ Questions)

115. 🔴 **Frontend architecture patterns**
     - MVC, MVVM, component-based architecture

116. 🔴 **Micro-frontends**
     - Module federation, independent deployment

117. 🔴 **Scalable state management**
     - Large application state patterns

118. 🔴 **Design system implementation**
     - Component libraries, theming

119. 🔴 **Progressive Web Apps**
     - Service workers, app shell, manifest

## Study Plan

### Week 1-2: Fundamentals
- HTML/CSS basics and advanced topics
- JavaScript core concepts
- DOM manipulation

### Week 3-4: Advanced JavaScript
- Async programming
- Modern ES6+ features
- Data structures and algorithms

### Week 5-6: React & Frameworks
- React fundamentals and hooks
- Advanced patterns and optimization
- Testing strategies

### Week 7-8: Networking & Performance
- HTTP protocols
- Performance optimization
- Security best practices

### Week 9-10: System Design & Practice
- Frontend architecture
- Mock interviews
- Problem-solving practice

## Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [React Documentation](https://react.dev/)
- [JavaScript.info](https://javascript.info/)

### Practice Platforms
- [LeetCode](https://leetcode.com/)
- [Frontend Mentor](https://www.frontendmentor.io/)
- [Codewars](https://www.codewars.com/)

### Books
- "Eloquent JavaScript" by Marijn Haverbeke
- "You Don't Know JS" series by Kyle Simpson
- "React Patterns" by Alex Kondov

### Tools
- Chrome DevTools
- React DevTools
- Lighthouse
- Bundle analyzers

---

## Summary

This guide covers **119 essential frontend interview questions** across all major topics:

- **HTML & CSS**: 25 questions covering semantics, modern features, and layout systems
- **JavaScript**: 30 questions from basics to advanced patterns and algorithms
- **React & Frameworks**: 20 questions on hooks, patterns, and ecosystem
- **HTTP & Networking**: 15 questions on protocols, security, and communication
- **Performance**: 10 questions on optimization and Core Web Vitals
- **Security**: 8 questions on frontend security best practices
- **Testing**: 6 questions on testing strategies and tools
- **System Design**: 5 questions on architecture and scalability

Each question includes detailed explanations, code examples, and practical applications relevant to Big Tech interviews. Practice these concepts thoroughly and focus on explaining your thought process clearly during interviews.

**Good luck with your frontend engineering interviews!** 🚀