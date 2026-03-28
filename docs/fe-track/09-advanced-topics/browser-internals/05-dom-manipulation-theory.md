# DOM Manipulation Theory

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Understanding the Document Object Model

**English:** The Document Object Model (DOM) is a programming interface for web documents that represents the page structure as a tree of objects, enabling dynamic manipulation of content, structure, and styling.

**Tiếng Việt:** Document Object Model (DOM) là giao diện lập trình cho tài liệu web đại diện cho cấu trúc trang như một cây các đối tượng, cho phép thao tác động với nội dung, cấu trúc và kiểu dáng.

## Table of Contents
1. [DOM Fundamentals](#dom-fundamentals)
2. [DOM Tree Structure](#dom-tree-structure)
3. [Selecting Elements](#selecting-elements)
4. [Creating and Modifying Elements](#creating-and-modifying-elements)
5. [Event Handling](#event-handling)
6. [DOM Traversal](#dom-traversal)
7. [Performance Optimization](#performance-optimization)
8. [Virtual DOM](#virtual-dom)
9. [Shadow DOM](#shadow-dom)
10. [Best Practices](#best-practices)

## DOM Fundamentals

### What is the DOM?

**Definition:** Tree-like representation of HTML document

**HTML:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
```

**DOM Tree:**
```
Document
└── html
    ├── head
    │   └── title
    │       └── "My Page"
    └── body
        ├── h1
        │   └── "Hello World"
        └── p
            └── "This is a paragraph."
```

### Node Types

**Element Nodes:**
```javascript
const div = document.createElement('div');
console.log(div.nodeType); // 1 (ELEMENT_NODE)
console.log(div.nodeName); // "DIV"
```

**Text Nodes:**
```javascript
const text = document.createTextNode('Hello');
console.log(text.nodeType); // 3 (TEXT_NODE)
console.log(text.nodeValue); // "Hello"
```

**Comment Nodes:**
```javascript
const comment = document.createComment('This is a comment');
console.log(comment.nodeType); // 8 (COMMENT_NODE)
```

**Document Node:**
```javascript
console.log(document.nodeType); // 9 (DOCUMENT_NODE)
```

**Node Type Constants:**
```javascript
Node.ELEMENT_NODE                // 1
Node.ATTRIBUTE_NODE              // 2 (deprecated)
Node.TEXT_NODE                   // 3
Node.CDATA_SECTION_NODE          // 4
Node.ENTITY_REFERENCE_NODE       // 5 (deprecated)
Node.ENTITY_NODE                 // 6 (deprecated)
Node.PROCESSING_INSTRUCTION_NODE // 7
Node.COMMENT_NODE                // 8
Node.DOCUMENT_NODE               // 9
Node.DOCUMENT_TYPE_NODE          // 10
Node.DOCUMENT_FRAGMENT_NODE      // 11
Node.NOTATION_NODE               // 12 (deprecated)
```

## DOM Tree Structure

### Document Object

**Properties:**
```javascript
document.documentElement  // <html> element
document.head            // <head> element
document.body            // <body> element
document.title           // Document title
document.URL             // Current URL
document.domain          // Domain name
document.referrer        // Referring URL
document.cookie          // Cookies
```

**Methods:**
```javascript
document.getElementById('id')
document.getElementsByClassName('class')
document.getElementsByTagName('tag')
document.querySelector('selector')
document.querySelectorAll('selector')
document.createElement('tag')
document.createTextNode('text')
document.createDocumentFragment()
```

### Element Properties

**Content:**
```javascript
element.innerHTML        // HTML content
element.textContent      // Text content
element.innerText        // Visible text
element.outerHTML        // Element + HTML content
```

**Attributes:**
```javascript
element.id               // ID attribute
element.className        // Class attribute
element.classList        // DOMTokenList of classes
element.attributes       // NamedNodeMap of attributes
element.dataset          // Data attributes
```

**Style:**
```javascript
element.style            // Inline styles
element.style.color = 'red'
element.style.backgroundColor = 'blue'
```

**Dimensions:**
```javascript
element.offsetWidth      // Width including border
element.offsetHeight     // Height including border
element.clientWidth      // Width excluding border
element.clientHeight     // Height excluding border
element.scrollWidth      // Total scrollable width
element.scrollHeight     // Total scrollable height
element.offsetLeft       // Left position
element.offsetTop        // Top position
element.scrollLeft       // Horizontal scroll position
element.scrollTop        // Vertical scroll position
```

## Selecting Elements

### getElementById

```javascript
const element = document.getElementById('myId');

// Fast, returns single element or null
// Only works on document
```

### getElementsByClassName

```javascript
const elements = document.getElementsByClassName('myClass');

// Returns live HTMLCollection
// Works on document and elements
// Updates automatically

// Convert to array
const array = Array.from(elements);
const array2 = [...elements];
```

### getElementsByTagName

```javascript
const elements = document.getElementsByTagName('div');
const allElements = document.getElementsByTagName('*');

// Returns live HTMLCollection
// Updates automatically
```

### querySelector

```javascript
const element = document.querySelector('.myClass');
const element2 = document.querySelector('#myId');
const element3 = document.querySelector('div.myClass');
const element4 = document.querySelector('[data-id="123"]');

// Returns first matching element or null
// Uses CSS selectors
// Static snapshot
```

### querySelectorAll

```javascript
const elements = document.querySelectorAll('.myClass');
const elements2 = document.querySelectorAll('div, p, span');

// Returns static NodeList
// Doesn't update automatically
// Array-like but not array

// Iterate
elements.forEach(el => console.log(el));

// Convert to array
const array = Array.from(elements);
```

### Comparison

```javascript
// Live vs Static
const liveList = document.getElementsByClassName('item');
const staticList = document.querySelectorAll('.item');

console.log(liveList.length);  // 3
console.log(staticList.length); // 3

// Add new element
const newItem = document.createElement('div');
newItem.className = 'item';
document.body.appendChild(newItem);

console.log(liveList.length);  // 4 (updated)
console.log(staticList.length); // 3 (not updated)
```

## Creating and Modifying Elements

### Creating Elements

**createElement:**
```javascript
const div = document.createElement('div');
div.id = 'myDiv';
div.className = 'container';
div.textContent = 'Hello World';

document.body.appendChild(div);
```

**createTextNode:**
```javascript
const text = document.createTextNode('Hello');
const p = document.createElement('p');
p.appendChild(text);
```

**createDocumentFragment:**
```javascript
// Efficient for multiple elements
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}

// Single reflow
document.body.appendChild(fragment);
```

### Modifying Content

**innerHTML:**
```javascript
element.innerHTML = '<p>New content</p>';

// Pros: Simple, parses HTML
// Cons: Security risk (XSS), destroys event listeners
```

**textContent:**
```javascript
element.textContent = 'Plain text';

// Pros: Safe, fast
// Cons: No HTML parsing
```

**innerText:**
```javascript
element.innerText = 'Visible text';

// Pros: Respects CSS visibility
// Cons: Slower, triggers reflow
```

**insertAdjacentHTML:**
```javascript
element.insertAdjacentHTML('beforebegin', '<p>Before</p>');
element.insertAdjacentHTML('afterbegin', '<p>First child</p>');
element.insertAdjacentHTML('beforeend', '<p>Last child</p>');
element.insertAdjacentHTML('afterend', '<p>After</p>');
```

### Modifying Attributes

**setAttribute / getAttribute:**
```javascript
element.setAttribute('data-id', '123');
const value = element.getAttribute('data-id');
element.removeAttribute('data-id');
element.hasAttribute('data-id');
```

**Direct Property Access:**
```javascript
element.id = 'myId';
element.className = 'myClass';
element.href = 'https://example.com';
```

**classList:**
```javascript
element.classList.add('class1', 'class2');
element.classList.remove('class1');
element.classList.toggle('active');
element.classList.contains('active');
element.classList.replace('old', 'new');
```

**dataset:**
```javascript
// HTML: <div data-user-id="123" data-user-name="John"></div>

element.dataset.userId;      // "123"
element.dataset.userName;    // "John"
element.dataset.newProp = 'value';
delete element.dataset.userId;
```

### Modifying Styles

**Inline Styles:**
```javascript
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.fontSize = '16px';

// CSS property names use camelCase
element.style.borderRadius = '5px';

// Get computed style
const styles = window.getComputedStyle(element);
console.log(styles.color);
console.log(styles.fontSize);
```

**cssText:**
```javascript
element.style.cssText = 'color: red; background: blue; font-size: 16px;';

// Or
element.style.cssText += 'border: 1px solid black;';
```

### Inserting Elements

**appendChild:**
```javascript
parent.appendChild(child);

// Moves element if already in DOM
```

**insertBefore:**
```javascript
parent.insertBefore(newChild, referenceChild);

// Insert at beginning
parent.insertBefore(newChild, parent.firstChild);
```

**append / prepend:**
```javascript
parent.append(child1, child2, 'text');
parent.prepend(child1, child2, 'text');

// Can insert multiple nodes and strings
```

**before / after:**
```javascript
element.before(newElement);
element.after(newElement);
```

**replaceChild:**
```javascript
parent.replaceChild(newChild, oldChild);
```

**replaceWith:**
```javascript
oldElement.replaceWith(newElement);
```

### Removing Elements

**removeChild:**
```javascript
parent.removeChild(child);
```

**remove:**
```javascript
element.remove();

// Simpler than removeChild
```

**Clearing Content:**
```javascript
// Method 1: innerHTML
element.innerHTML = '';

// Method 2: Remove children
while (element.firstChild) {
  element.removeChild(element.firstChild);
}

// Method 3: replaceChildren
element.replaceChildren();
```

## Event Handling

### addEventListener

**Basic Usage:**
```javascript
element.addEventListener('click', function(event) {
  console.log('Clicked!', event);
});

// Arrow function
element.addEventListener('click', (event) => {
  console.log('Clicked!', event);
});

// Named function
function handleClick(event) {
  console.log('Clicked!', event);
}
element.addEventListener('click', handleClick);
```

**Options:**
```javascript
element.addEventListener('click', handler, {
  capture: false,    // Use capture phase
  once: true,        // Remove after first call
  passive: true,     // Won't call preventDefault()
  signal: abortController.signal  // AbortSignal for removal
});
```

**Event Object:**
```javascript
element.addEventListener('click', (event) => {
  event.type;              // 'click'
  event.target;            // Element that triggered event
  event.currentTarget;     // Element with listener
  event.preventDefault();  // Prevent default action
  event.stopPropagation(); // Stop bubbling
  event.stopImmediatePropagation(); // Stop other listeners
});
```

### Event Phases

**Capture → Target → Bubble:**
```html
<div id="outer">
  <div id="inner">
    <button id="button">Click</button>
  </div>
</div>
```

```javascript
// Capture phase (top to bottom)
outer.addEventListener('click', () => console.log('Outer capture'), true);
inner.addEventListener('click', () => console.log('Inner capture'), true);
button.addEventListener('click', () => console.log('Button capture'), true);

// Bubble phase (bottom to top)
button.addEventListener('click', () => console.log('Button bubble'));
inner.addEventListener('click', () => console.log('Inner bubble'));
outer.addEventListener('click', () => console.log('Outer bubble'));

// Output when clicking button:
// Outer capture
// Inner capture
// Button capture
// Button bubble
// Inner bubble
// Outer bubble
```

### Event Delegation

**Concept:** Attach listener to parent, handle events from children

```javascript
// Bad: Multiple listeners
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// Good: Single listener
document.getElementById('list').addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleClick(event);
  }
});
```

**Benefits:**
```
✅ Better performance
✅ Works with dynamic elements
✅ Less memory usage
✅ Simpler code
```

### Common Events

**Mouse Events:**
```javascript
element.addEventListener('click', handler);
element.addEventListener('dblclick', handler);
element.addEventListener('mousedown', handler);
element.addEventListener('mouseup', handler);
element.addEventListener('mousemove', handler);
element.addEventListener('mouseenter', handler);
element.addEventListener('mouseleave', handler);
element.addEventListener('mouseover', handler);
element.addEventListener('mouseout', handler);
```

**Keyboard Events:**
```javascript
element.addEventListener('keydown', handler);
element.addEventListener('keyup', handler);
element.addEventListener('keypress', handler); // Deprecated
```

**Form Events:**
```javascript
element.addEventListener('submit', handler);
element.addEventListener('input', handler);
element.addEventListener('change', handler);
element.addEventListener('focus', handler);
element.addEventListener('blur', handler);
```

**Document Events:**
```javascript
document.addEventListener('DOMContentLoaded', handler);
window.addEventListener('load', handler);
window.addEventListener('beforeunload', handler);
window.addEventListener('unload', handler);
```

## DOM Traversal

### Parent Navigation

```javascript
element.parentNode           // Parent node
element.parentElement        // Parent element
element.closest('selector')  // Nearest ancestor matching selector
```

**Example:**
```javascript
const button = document.querySelector('button');
const form = button.closest('form');
const container = button.closest('.container');
```

### Child Navigation

```javascript
element.childNodes           // All child nodes (including text)
element.children             // Only element children
element.firstChild           // First child node
element.lastChild            // Last child node
element.firstElementChild    // First element child
element.lastElementChild     // Last element child
element.childElementCount    // Number of element children
```

### Sibling Navigation

```javascript
element.nextSibling          // Next node
element.previousSibling      // Previous node
element.nextElementSibling   // Next element
element.previousElementSibling // Previous element
```

**Example:**
```javascript
const current = document.querySelector('.current');
const next = current.nextElementSibling;
const prev = current.previousElementSibling;
```

## Performance Optimization

### Minimize Reflows

**Bad:**
```javascript
// Multiple reflows
element.style.width = '100px';
element.style.height = '100px';
element.style.border = '1px solid black';
```

**Good:**
```javascript
// Single reflow
element.style.cssText = 'width: 100px; height: 100px; border: 1px solid black;';

// Or use class
element.classList.add('styled');
```

### Batch DOM Changes

**Bad:**
```javascript
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  container.appendChild(div); // 1000 reflows
}
```

**Good:**
```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}
container.appendChild(fragment); // 1 reflow
```

### Read Then Write

**Bad:**
```javascript
// Causes layout thrashing
elements.forEach(el => {
  el.style.width = el.offsetWidth + 10 + 'px'; // Read, write, read, write...
});
```

**Good:**
```javascript
// Batch reads, then writes
const widths = elements.map(el => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});
```

### Debounce and Throttle

**Debounce:**
```javascript
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Usage
window.addEventListener('resize', debounce(() => {
  console.log('Resized');
}, 250));
```

**Throttle:**
```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
window.addEventListener('scroll', throttle(() => {
  console.log('Scrolled');
}, 100));
```

## Virtual DOM

### Concept

**Problem with Real DOM:**
```
- Expensive operations
- Frequent reflows/repaints
- Slow for complex UIs
```

**Virtual DOM Solution:**
```
1. Create virtual representation
2. Compare with previous version (diffing)
3. Calculate minimal changes
4. Apply changes to real DOM (reconciliation)
```

**Example (React-like):**
```javascript
// Virtual DOM representation
const vdom = {
  type: 'div',
  props: {
    className: 'container'
  },
  children: [
    {
      type: 'h1',
      props: {},
      children: ['Hello World']
    },
    {
      type: 'p',
      props: {},
      children: ['This is a paragraph']
    }
  ]
};

// Render to real DOM
function render(vnode) {
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }
  
  const element = document.createElement(vnode.type);
  
  Object.entries(vnode.props || {}).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  (vnode.children || []).forEach(child => {
    element.appendChild(render(child));
  });
  
  return element;
}
```

### Diffing Algorithm

**Simple Diff:**
```javascript
function diff(oldVNode, newVNode) {
  // Different type: replace
  if (oldVNode.type !== newVNode.type) {
    return { type: 'REPLACE', newVNode };
  }
  
  // Text node: update if different
  if (typeof newVNode === 'string') {
    if (oldVNode !== newVNode) {
      return { type: 'TEXT', text: newVNode };
    }
    return null;
  }
  
  // Props changed
  const propsPatches = diffProps(oldVNode.props, newVNode.props);
  
  // Children changed
  const childrenPatches = diffChildren(oldVNode.children, newVNode.children);
  
  return {
    type: 'UPDATE',
    props: propsPatches,
    children: childrenPatches
  };
}
```

## Shadow DOM

### Definition

**Shadow DOM:** Encapsulated DOM tree attached to element

**Benefits:**
```
✅ Style encapsulation
✅ DOM encapsulation
✅ Composition
✅ Reusability
```

### Creating Shadow DOM

```javascript
const host = document.querySelector('#host');
const shadowRoot = host.attachShadow({ mode: 'open' });

shadowRoot.innerHTML = `
  <style>
    p { color: red; }
  </style>
  <p>Shadow DOM content</p>
`;
```

**Modes:**
```javascript
// Open: Accessible via element.shadowRoot
const shadowRoot = element.attachShadow({ mode: 'open' });

// Closed: Not accessible
const shadowRoot = element.attachShadow({ mode: 'closed' });
```

### Web Components

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    
    const shadow = this.attachShadow({ mode: 'open' });
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid black;
        }
        
        p {
          color: blue;
        }
      </style>
      <p>Component content</p>
      <slot></slot>
    `;
  }
}

customElements.define('my-component', MyComponent);
```

## Best Practices

### Use Modern APIs

```javascript
// Old
element.setAttribute('class', 'active');

// New
element.classList.add('active');

// Old
element.innerHTML = '';

// New
element.replaceChildren();
```

### Avoid innerHTML for User Input

```javascript
// Bad: XSS vulnerability
element.innerHTML = userInput;

// Good: Safe
element.textContent = userInput;

// Or sanitize
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Cache DOM References

```javascript
// Bad
for (let i = 0; i < 100; i++) {
  document.getElementById('container').appendChild(element);
}

// Good
const container = document.getElementById('container');
for (let i = 0; i < 100; i++) {
  container.appendChild(element);
}
```

### Use Event Delegation

```javascript
// Bad: Many listeners
items.forEach(item => {
  item.addEventListener('click', handler);
});

// Good: One listener
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handler(e);
  }
});
```

## Interview Questions

**Q: What's the difference between innerHTML and textContent?**

A: innerHTML parses and renders HTML (security risk with user input, destroys event listeners). textContent sets/gets plain text (safe, faster, preserves whitespace). Use textContent for plain text, innerHTML only for trusted HTML.

**Q: Explain event bubbling and capturing.**

A: Events propagate in three phases: capture (top to bottom), target (element itself), bubble (bottom to top). By default, listeners use bubble phase. Use `addEventListener(event, handler, true)` for capture. stopPropagation() prevents further propagation.

**Q: What's the difference between childNodes and children?**

A: childNodes returns all nodes including text and comments (NodeList). children returns only element nodes (HTMLCollection). children is usually what you want for DOM manipulation.

**Q: How does Virtual DOM improve performance?**

A: Virtual DOM minimizes expensive real DOM operations by: 1) Creating lightweight JS representation, 2) Diffing old and new versions, 3) Calculating minimal changes, 4) Batching updates to real DOM. Reduces reflows/repaints significantly.

**Q: What's the difference between querySelector and getElementById?**

A: getElementById is faster (hash lookup), returns single element, only works on document. querySelector is more flexible (CSS selectors), slower, returns first match, works on any element. Use getElementById for simple ID lookups, querySelector for complex selectors.

---

[← Back to CSS Grid/Flexbox](../05-html-css/05-css-grid-flexbox-theory.md) | [Next: State Machines →](./15-advanced-topics-07-state-machines-theory.md)
