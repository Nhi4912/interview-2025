---
layout: page
title: "Web Fundamentals Theory - Core Concepts & Interconnections"
description: "Deep theoretical understanding of web technologies, protocols, and browser behavior"
category: "Theory"
tags: [web-fundamentals, http, dom, css, html, browser-theory]
companies: [Google, Meta, Amazon, Microsoft, Apple]
---

# Web Fundamentals Theory - Core Concepts & Interconnections / Lý thuyết nền tảng Web - Khái niệm cốt lõi & Mối liên kết

*Tài liệu này cung cấp hiểu biết lý thuyết sâu về công nghệ web, giao thức và hành vi trình duyệt để chuẩn bị cho phỏng vấn kỹ thuật.*

## 🌐 HTTP Protocol Deep Theory / Lý thuyết sâu về giao thức HTTP

### **What is HTTP? / HTTP là gì?**

**English Definition:** HTTP (HyperText Transfer Protocol) is a stateless, application-layer protocol that defines how messages are formatted and transmitted between web clients and servers.

**Định nghĩa (Tiếng Việt):** HTTP (HyperText Transfer Protocol) là một giao thức không trạng thái ở tầng ứng dụng, định nghĩa cách thức định dạng và truyền tải thông điệp giữa web client và server.

**Why HTTP Exists / Tại sao có HTTP:**
- **Standardization / Chuẩn hóa**: Universal communication protocol for the web / Giao thức giao tiếp phổ quát cho web
- **Simplicity / Đơn giản**: Text-based, human-readable protocol / Giao thức dựa trên văn bản, con người có thể đọc được
- **Statelessness / Không trạng thái**: Each request is independent, enabling scalability / Mỗi request độc lập, cho phép mở rộng
- **Extensibility / Khả năng mở rộng**: Headers allow for protocol evolution / Headers cho phép giao thức phát triển

**How HTTP Works Fundamentally:**

```mermaid
graph TB
    subgraph "HTTP Request/Response Cycle"
        A[Client] --> B[DNS Resolution]
        B --> C[TCP Connection]
        C --> D[TLS Handshake]
        D --> E[HTTP Request]
        E --> F[Server Processing]
        F --> G[HTTP Response]
        G --> H[Connection Management]
    end

    subgraph "HTTP Message Structure"
        I[Start Line] --> J[Headers]
        J --> K[Empty Line]
        K --> L[Body]
    end

    subgraph "Protocol Evolution"
        M[HTTP/1.0] --> N[HTTP/1.1]
        N --> O[HTTP/2]
        O --> P[HTTP/3]
    end
```

**Deep Theory with Examples:**
```javascript
// WHAT: HTTP request anatomy
const httpRequest = {
    method: 'POST',
    url: 'https://api.example.com/users',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0...',
        'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com'
    })
};

// WHY: Statelessness implications
// Each request must contain all necessary information
fetch('/api/user/profile', {
    headers: {
        'Authorization': 'Bearer ' + token, // Must include auth every time
        'Content-Type': 'application/json'
    }
});

// HOW: HTTP methods semantic meaning
const httpMethods = {
    GET: {
        purpose: 'Retrieve data',
        idempotent: true,
        safe: true,
        cacheable: true,
        example: 'GET /api/users/123'
    },
    POST: {
        purpose: 'Create new resource',
        idempotent: false,
        safe: false,
        cacheable: false,
        example: 'POST /api/users'
    },
    PUT: {
        purpose: 'Update/replace entire resource',
        idempotent: true,
        safe: false,
        cacheable: false,
        example: 'PUT /api/users/123'
    },
    PATCH: {
        purpose: 'Partial update',
        idempotent: false,
        safe: false,
        cacheable: false,
        example: 'PATCH /api/users/123'
    },
    DELETE: {
        purpose: 'Remove resource',
        idempotent: true,
        safe: false,
        cacheable: false,
        example: 'DELETE /api/users/123'
    }
};

// Status code categories and their meanings
const statusCodes = {
    '1xx': 'Informational - Request received, continuing process',
    '2xx': 'Success - Request successfully received, understood, accepted',
    '3xx': 'Redirection - Further action needed to complete request',
    '4xx': 'Client Error - Request contains bad syntax or cannot be fulfilled',
    '5xx': 'Server Error - Server failed to fulfill valid request'
};
```

**Interconnected Concepts:**
- **TCP/IP Stack**: Underlying transport mechanism
- **DNS Resolution**: Domain name to IP address mapping
- **TLS/SSL**: Security layer for HTTPS
- **Caching**: HTTP cache headers and strategies

## 🏗️ DOM (Document Object Model) Theory / Lý thuyết DOM (Document Object Model)

### **What is the DOM? / DOM là gì?**

**English Definition:** The DOM is a programming interface that represents HTML/XML documents as a tree structure of objects that can be manipulated with JavaScript.

**Định nghĩa (Tiếng Việt):** DOM là một giao diện lập trình đại diện cho tài liệu HTML/XML dưới dạng cấu trúc cây các đối tượng có thể được thao tác bằng JavaScript.

**Why DOM Exists / Tại sao có DOM:**
- **Dynamic Content / Nội dung động**: Enable runtime modification of web pages / Cho phép thay đổi trang web trong thời gian chạy
- **Event Handling / Xử lý sự kiện**: Respond to user interactions / Phản hồi tương tác của người dùng
- **API Standardization / Chuẩn hóa API**: Consistent interface across browsers / Giao diện nhất quán trên các trình duyệt
- **Separation of Concerns / Tách rời mối quan tâm**: Structure (HTML) separate from behavior (JS) / Cấu trúc (HTML) tách biệt khỏi hành vi (JS)

**How DOM Works Internally:**

```mermaid
graph TB
    subgraph "DOM Tree Structure"
        A[Document] --> B[HTML Element]
        B --> C[Head Element]
        B --> D[Body Element]
        C --> E[Title Element]
        C --> F[Meta Elements]
        D --> G[Div Elements]
        D --> H[Script Elements]
        G --> I[Text Nodes]
        G --> J[Attribute Nodes]
    end

    subgraph "DOM API Categories"
        K[Node Interface] --> L[Element Interface]
        L --> M[HTMLElement Interface]
        M --> N[Specific Element Interfaces]
        
        O[Event Interface] --> P[Event Listeners]
        P --> Q[Event Propagation]
        Q --> R[Event Delegation]
    end
```

**Deep Theory with Examples:**
```javascript
// WHAT: DOM node types and hierarchy
const nodeTypes = {
    ELEMENT_NODE: 1,        // <div>, <p>, etc.
    TEXT_NODE: 3,           // Text content
    COMMENT_NODE: 8,        // <!-- comments -->
    DOCUMENT_NODE: 9,       // document object
    DOCUMENT_FRAGMENT_NODE: 11  // DocumentFragment
};

// WHY: Different node types serve different purposes
function analyzeNode(node) {
    switch(node.nodeType) {
        case Node.ELEMENT_NODE:
            console.log(`Element: ${node.tagName}`);
            console.log(`Attributes: ${node.attributes.length}`);
            break;
        case Node.TEXT_NODE:
            console.log(`Text: "${node.textContent.trim()}"`);
            break;
        case Node.COMMENT_NODE:
            console.log(`Comment: ${node.textContent}`);
            break;
    }
}

// HOW: DOM manipulation performance considerations
// INEFFICIENT: Multiple DOM queries and modifications
function inefficientDOMUpdate(items) {
    const container = document.getElementById('container');
    
    for (let item of items) {
        const div = document.createElement('div');
        div.textContent = item.name;
        div.className = 'item';
        container.appendChild(div); // Triggers reflow each time
    }
}

// EFFICIENT: Batch DOM operations
function efficientDOMUpdate(items) {
    const container = document.getElementById('container');
    const fragment = document.createDocumentFragment();
    
    for (let item of items) {
        const div = document.createElement('div');
        div.textContent = item.name;
        div.className = 'item';
        fragment.appendChild(div); // No reflow yet
    }
    
    container.appendChild(fragment); // Single reflow
}

// Event delegation for performance
function setupEventDelegation() {
    // Instead of adding listeners to each item
    document.getElementById('container').addEventListener('click', (event) => {
        if (event.target.classList.contains('item')) {
            handleItemClick(event.target);
        }
    });
}

// Virtual DOM concept (simplified)
class VirtualNode {
    constructor(tag, props = {}, children = []) {
        this.tag = tag;
        this.props = props;
        this.children = children;
    }
    
    render() {
        const element = document.createElement(this.tag);
        
        // Set properties
        Object.keys(this.props).forEach(key => {
            if (key === 'className') {
                element.className = this.props[key];
            } else if (key.startsWith('on')) {
                element.addEventListener(key.slice(2).toLowerCase(), this.props[key]);
            } else {
                element.setAttribute(key, this.props[key]);
            }
        });
        
        // Render children
        this.children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child.render());
            }
        });
        
        return element;
    }
}
```

**Interconnected Concepts:**
- **Event Loop**: How DOM events are processed
- **Rendering Pipeline**: How DOM changes trigger reflows/repaints
- **Memory Management**: DOM node lifecycle and garbage collection
- **Performance**: Virtual DOM and reconciliation algorithms

## 🎨 CSS Theory & Cascade

### **What is CSS?**
**Definition:** CSS (Cascading Style Sheets) is a declarative language that describes the presentation and layout of HTML documents through a system of selectors, properties, and values.

**Why CSS Exists:**
- **Separation of Concerns**: Separate content from presentation
- **Reusability**: Style rules can be applied to multiple elements
- **Maintainability**: Centralized styling makes updates easier
- **Responsive Design**: Adapt layouts to different screen sizes

**How CSS Cascade Works:**

```mermaid
graph TB
    subgraph "CSS Cascade Order"
        A[User Agent Styles] --> B[User Styles]
        B --> C[Author Styles]
        C --> D[Inline Styles]
        D --> E[!important]
    end

    subgraph "Specificity Calculation"
        F[Inline Styles] --> G[1000 points]
        H[IDs] --> I[100 points]
        J[Classes/Attributes/Pseudo] --> K[10 points]
        L[Elements/Pseudo-elements] --> M[1 point]
    end

    subgraph "Box Model"
        N[Content] --> O[Padding]
        O --> P[Border]
        P --> Q[Margin]
    end
```

**Deep Theory with Examples:**
```css
/* WHAT: Specificity calculation examples */
/* Specificity: 0,0,0,1 (1 point) */
p { color: blue; }

/* Specificity: 0,0,1,1 (11 points) */
p.highlight { color: red; }

/* Specificity: 0,1,0,1 (101 points) */
#main p { color: green; }

/* Specificity: 1,0,0,0 (1000 points) */
p { color: purple !important; }

/* WHY: Cascade resolves conflicts predictably */
.button {
    background: blue;     /* Base style */
    padding: 10px;
    border: none;
}

.button.primary {        /* More specific */
    background: green;    /* Overrides blue */
}

.button.primary.large {  /* Most specific */
    padding: 20px;       /* Overrides 10px */
}

/* HOW: CSS layout algorithms work */
.container {
    display: flex;           /* Establishes flex formatting context */
    flex-direction: row;     /* Main axis direction */
    justify-content: center; /* Main axis alignment */
    align-items: center;     /* Cross axis alignment */
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

/* CSS Custom Properties (Variables) */
:root {
    --primary-color: #007bff;
    --spacing-unit: 8px;
    --border-radius: 4px;
}

.component {
    color: var(--primary-color);
    padding: calc(var(--spacing-unit) * 2);
    border-radius: var(--border-radius);
}
```

```javascript
// HOW: CSS-in-JS and dynamic styling
function createStyledComponent(styles) {
    return function StyledComponent({ children, ...props }) {
        const element = document.createElement('div');
        
        // Apply base styles
        Object.assign(element.style, styles);
        
        // Apply dynamic styles based on props
        if (props.primary) {
            element.style.backgroundColor = 'var(--primary-color)';
        }
        
        if (props.size === 'large') {
            element.style.padding = 'calc(var(--spacing-unit) * 3)';
        }
        
        element.appendChild(children);
        return element;
    };
}

// CSS performance optimization
function optimizeCSS() {
    // Minimize reflows and repaints
    const element = document.getElementById('animated-element');
    
    // BAD: Causes multiple reflows
    element.style.left = '100px';
    element.style.top = '100px';
    element.style.width = '200px';
    element.style.height = '200px';
    
    // GOOD: Batch style changes
    element.style.cssText = 'left: 100px; top: 100px; width: 200px; height: 200px;';
    
    // BETTER: Use CSS classes for complex changes
    element.className = 'optimized-position';
}
```

**Interconnected Concepts:**
- **Rendering Pipeline**: How CSS affects layout and paint
- **Performance**: Reflow/repaint optimization
- **Responsive Design**: Media queries and flexible layouts
- **Accessibility**: CSS impact on screen readers and navigation

## 🔒 Web Security Fundamentals

### **What is Web Security?**
**Definition:** Web security encompasses the practices, technologies, and policies designed to protect web applications, users, and data from various threats and vulnerabilities.

**Why Web Security is Critical:**
- **Data Protection**: Safeguard sensitive user information
- **Trust**: Maintain user confidence in web applications
- **Compliance**: Meet regulatory requirements (GDPR, CCPA)
- **Business Continuity**: Prevent attacks that could disrupt operations

**How Security Models Work:**

```mermaid
graph TB
    subgraph "Browser Security Model"
        A[Same-Origin Policy] --> B[Origin Definition]
        B --> C[Protocol + Host + Port]
        
        D[Content Security Policy] --> E[Resource Loading Control]
        E --> F[Script Execution Control]
        
        G[CORS] --> H[Cross-Origin Requests]
        H --> I[Preflight Requests]
    end

    subgraph "Common Attack Vectors"
        J[XSS] --> K[Script Injection]
        L[CSRF] --> M[Unauthorized Actions]
        N[Clickjacking] --> O[UI Redressing]
        P[SQL Injection] --> Q[Database Attacks]
    end
```

**Deep Theory with Examples:**
```javascript
// WHAT: Same-Origin Policy enforcement
const origins = {
    'https://example.com:443': {
        protocol: 'https:',
        hostname: 'example.com',
        port: '443'
    },
    'https://api.example.com:443': {
        protocol: 'https:',
        hostname: 'api.example.com', // Different hostname
        port: '443'
    },
    'http://example.com:80': {
        protocol: 'http:', // Different protocol
        hostname: 'example.com',
        port: '80'
    }
};

function isSameOrigin(url1, url2) {
    const origin1 = new URL(url1);
    const origin2 = new URL(url2);
    
    return origin1.protocol === origin2.protocol &&
           origin1.hostname === origin2.hostname &&
           origin1.port === origin2.port;
}

// WHY: XSS prevention strategies
function sanitizeInput(userInput) {
    // HTML entity encoding
    return userInput
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// Content Security Policy implementation
const cspHeader = {
    "Content-Security-Policy": `
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://cdn.trusted.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https:;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://api.example.com;
        frame-src 'none';
        object-src 'none';
    `.replace(/\s+/g, ' ').trim()
};

// HOW: CSRF protection implementation
function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function validateCSRFToken(token, sessionToken) {
    // Constant-time comparison to prevent timing attacks
    if (token.length !== sessionToken.length) {
        return false;
    }
    
    let result = 0;
    for (let i = 0; i < token.length; i++) {
        result |= token.charCodeAt(i) ^ sessionToken.charCodeAt(i);
    }
    
    return result === 0;
}

// Secure cookie configuration
function setSecureCookie(name, value, options = {}) {
    const cookieOptions = {
        httpOnly: true,     // Prevent XSS access
        secure: true,       // HTTPS only
        sameSite: 'Strict', // CSRF protection
        maxAge: 3600,       // 1 hour expiration
        ...options
    };
    
    let cookieString = `${name}=${value}`;
    
    if (cookieOptions.httpOnly) cookieString += '; HttpOnly';
    if (cookieOptions.secure) cookieString += '; Secure';
    if (cookieOptions.sameSite) cookieString += `; SameSite=${cookieOptions.sameSite}`;
    if (cookieOptions.maxAge) cookieString += `; Max-Age=${cookieOptions.maxAge}`;
    
    document.cookie = cookieString;
}
```

**Interconnected Concepts:**
- **HTTP Headers**: Security-related headers and their purposes
- **Authentication**: Token-based and session-based authentication
- **Encryption**: TLS/SSL and data protection in transit
- **Browser APIs**: Secure contexts and permission models

## 🔄 Knowledge Integration Framework

### **How Web Fundamentals Connect:**

```mermaid
graph TB
    subgraph "Request/Response Cycle"
        A[HTTP Request] --> B[DNS Resolution]
        B --> C[TCP Connection]
        C --> D[Server Processing]
        D --> E[HTTP Response]
        E --> F[Browser Parsing]
    end

    subgraph "Browser Processing"
        F --> G[HTML Parsing]
        G --> H[DOM Construction]
        H --> I[CSS Parsing]
        I --> J[CSSOM Construction]
        J --> K[Render Tree]
        K --> L[Layout/Paint]
    end

    subgraph "Security Layer"
        M[Same-Origin Policy] --> N[CORS Checks]
        N --> O[CSP Validation]
        O --> P[Secure Context]
    end

    subgraph "Performance Optimization"
        Q[Caching] --> R[Compression]
        R --> S[Minification]
        S --> T[Critical Path]
    end

    L --> M
    P --> Q
```

### **Interview Success Strategies:**

1. **Start with Fundamentals**: Always explain the basic concepts first
2. **Show Interconnections**: Demonstrate how concepts relate to each other
3. **Provide Examples**: Use concrete code examples to illustrate points
4. **Discuss Trade-offs**: Analyze pros and cons of different approaches
5. **Connect to Performance**: Explain how concepts impact application performance
6. **Address Security**: Consider security implications of design decisions

This comprehensive understanding of web fundamentals provides the foundation for advanced frontend development and successful technical interviews.