# Virtual DOM and Reconciliation

## Table of Contents
- [Introduction](#introduction)
- [Virtual DOM Concepts](#virtual-dom-concepts)
- [Diffing Algorithms](#diffing-algorithms)
- [Reconciliation Process](#reconciliation-process)
- [Fiber Architecture](#fiber-architecture)
- [Keys and Lists](#keys-and-lists)
- [Performance Optimization](#performance-optimization)
- [Implementation](#implementation)

## Introduction

### What is Virtual DOM?

**Definition**: A lightweight JavaScript representation of the actual DOM that enables efficient updates through diffing and batching.

**Benefits**:
```
1. Performance: Batch DOM updates
2. Abstraction: Platform-independent rendering
3. Declarative: Describe UI state, not mutations
4. Predictable: Pure functions for rendering
```

**Virtual DOM vs Real DOM**:
```javascript
// Real DOM (expensive)
const div = document.createElement('div');
div.className = 'container';
div.textContent = 'Hello';
document.body.appendChild(div);

// Virtual DOM (cheap)
const vnode = {
  type: 'div',
  props: { className: 'container' },
  children: ['Hello']
};
```

## Virtual DOM Concepts

### VNode Structure

**Basic VNode**:
```javascript
class VNode {
  constructor(type, props, children) {
    this.type = type;        // 'div', 'span', Component, etc.
    this.props = props || {}; // { className: 'foo', onClick: fn }
    this.children = children || []; // Array of VNodes or strings
    this.key = props?.key;   // Unique identifier
    this.ref = props?.ref;   // Reference to DOM node
  }
}

// Element VNode
const elementVNode = new VNode('div', { className: 'container' }, [
  new VNode('h1', {}, ['Title']),
  new VNode('p', {}, ['Content'])
]);

// Component VNode
const componentVNode = new VNode(MyComponent, { name: 'John' }, []);

// Text VNode
const textVNode = 'Hello World';
```

### JSX to VNode

**Transformation**:
```javascript
// JSX
const element = (
  <div className="container">
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// Compiled to
const element = createElement('div', { className: 'container' },
  createElement('h1', null, 'Title'),
  createElement('p', null, 'Content')
);

// createElement function
function createElement(type, props, ...children) {
  return new VNode(
    type,
    props,
    children.flat().map(child =>
      typeof child === 'object' ? child : createTextVNode(child)
    )
  );
}

function createTextVNode(text) {
  return new VNode('TEXT', { nodeValue: text }, []);
}
```

### VNode Types

**Classification**:
```javascript
const VNodeType = {
  ELEMENT: 'element',      // HTML elements
  TEXT: 'text',            // Text nodes
  COMPONENT: 'component',  // React components
  FRAGMENT: 'fragment',    // React.Fragment
  PORTAL: 'portal'         // ReactDOM.createPortal
};

function getVNodeType(vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return VNodeType.TEXT;
  }
  
  if (typeof vnode.type === 'string') {
    return VNodeType.ELEMENT;
  }
  
  if (typeof vnode.type === 'function') {
    return VNodeType.COMPONENT;
  }
  
  if (vnode.type === Fragment) {
    return VNodeType.FRAGMENT;
  }
  
  if (vnode.type === Portal) {
    return VNodeType.PORTAL;
  }
}
```

## Diffing Algorithms

### Naive Diff (O(n³))

**Concept**:
```
Compare every node in old tree with every node in new tree
- Time Complexity: O(n³)
- Space Complexity: O(n²)
- Too slow for practical use
```

### React's Heuristic Diff (O(n))

**Assumptions**:
```
1. Different types produce different trees
2. Keys identify stable elements across renders
3. Siblings are compared in order
```

**Algorithm**:
```javascript
function diff(oldVNode, newVNode) {
  // Rule 1: Different types -> replace
  if (oldVNode.type !== newVNode.type) {
    return { type: 'REPLACE', newVNode };
  }
  
  // Rule 2: Text nodes -> update if different
  if (typeof newVNode === 'string') {
    if (oldVNode !== newVNode) {
      return { type: 'TEXT', content: newVNode };
    }
    return null;
  }
  
  // Rule 3: Same type -> update props and diff children
  const propPatches = diffProps(oldVNode.props, newVNode.props);
  const childPatches = diffChildren(oldVNode.children, newVNode.children);
  
  if (propPatches || childPatches) {
    return {
      type: 'UPDATE',
      propPatches,
      childPatches
    };
  }
  
  return null;
}
```

### Props Diffing

**Implementation**:
```javascript
function diffProps(oldProps, newProps) {
  const patches = [];
  
  // Find changed and removed props
  for (const key in oldProps) {
    if (key === 'key' || key === 'ref') continue;
    
    if (!(key in newProps)) {
      patches.push({ type: 'REMOVE_PROP', key });
    } else if (oldProps[key] !== newProps[key]) {
      patches.push({
        type: 'UPDATE_PROP',
        key,
        value: newProps[key]
      });
    }
  }
  
  // Find added props
  for (const key in newProps) {
    if (key === 'key' || key === 'ref') continue;
    
    if (!(key in oldProps)) {
      patches.push({
        type: 'ADD_PROP',
        key,
        value: newProps[key]
      });
    }
  }
  
  return patches.length > 0 ? patches : null;
}
```

### Children Diffing

**Without Keys (Simple)**:
```javascript
function diffChildren(oldChildren, newChildren) {
  const patches = [];
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  
  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    
    if (!oldChild) {
      // New child added
      patches.push({
        type: 'INSERT',
        index: i,
        vnode: newChild
      });
    } else if (!newChild) {
      // Old child removed
      patches.push({
        type: 'REMOVE',
        index: i
      });
    } else {
      // Diff existing children
      const patch = diff(oldChild, newChild);
      if (patch) {
        patches.push({
          type: 'PATCH',
          index: i,
          patch
        });
      }
    }
  }
  
  return patches.length > 0 ? patches : null;
}
```

**With Keys (Optimized)**:
```javascript
function diffChildrenWithKeys(oldChildren, newChildren) {
  const patches = [];
  const oldKeyMap = new Map();
  const newKeyMap = new Map();
  
  // Build key maps
  oldChildren.forEach((child, index) => {
    if (child.key != null) {
      oldKeyMap.set(child.key, { child, index });
    }
  });
  
  newChildren.forEach((child, index) => {
    if (child.key != null) {
      newKeyMap.set(child.key, { child, index });
    }
  });
  
  // Track moved, added, removed nodes
  const moves = [];
  let lastIndex = 0;
  
  newChildren.forEach((newChild, newIndex) => {
    const key = newChild.key;
    
    if (key != null && oldKeyMap.has(key)) {
      const { child: oldChild, index: oldIndex } = oldKeyMap.get(key);
      
      // Diff the nodes
      const patch = diff(oldChild, newChild);
      if (patch) {
        patches.push({
          type: 'PATCH',
          key,
          patch
        });
      }
      
      // Check if node moved
      if (oldIndex < lastIndex) {
        moves.push({
          type: 'MOVE',
          key,
          from: oldIndex,
          to: newIndex
        });
      } else {
        lastIndex = oldIndex;
      }
    } else {
      // New node
      patches.push({
        type: 'INSERT',
        index: newIndex,
        vnode: newChild
      });
    }
  });
  
  // Find removed nodes
  oldChildren.forEach((oldChild) => {
    const key = oldChild.key;
    if (key != null && !newKeyMap.has(key)) {
      patches.push({
        type: 'REMOVE',
        key
      });
    }
  });
  
  return { patches, moves };
}
```

## Reconciliation Process

### Mounting Phase

**Initial Render**:
```javascript
function mount(vnode, container) {
  const node = createDOMNode(vnode);
  container.appendChild(node);
  return node;
}

function createDOMNode(vnode) {
  // Text node
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode);
  }
  
  // Element node
  const { type, props, children } = vnode;
  const element = document.createElement(type);
  
  // Set props
  updateProps(element, {}, props);
  
  // Mount children
  children.forEach(child => {
    const childNode = createDOMNode(child);
    element.appendChild(childNode);
  });
  
  // Store reference
  vnode._dom = element;
  
  return element;
}

function updateProps(dom, oldProps, newProps) {
  // Remove old props
  for (const key in oldProps) {
    if (!(key in newProps)) {
      removeProp(dom, key, oldProps[key]);
    }
  }
  
  // Add/update new props
  for (const key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      setProp(dom, key, newProps[key]);
    }
  }
}

function setProp(dom, key, value) {
  if (key === 'className') {
    dom.className = value;
  } else if (key === 'style') {
    if (typeof value === 'string') {
      dom.style.cssText = value;
    } else {
      Object.assign(dom.style, value);
    }
  } else if (key.startsWith('on')) {
    const eventType = key.slice(2).toLowerCase();
    dom.addEventListener(eventType, value);
  } else if (key in dom) {
    dom[key] = value;
  } else {
    dom.setAttribute(key, value);
  }
}

function removeProp(dom, key, value) {
  if (key === 'className') {
    dom.className = '';
  } else if (key === 'style') {
    dom.style.cssText = '';
  } else if (key.startsWith('on')) {
    const eventType = key.slice(2).toLowerCase();
    dom.removeEventListener(eventType, value);
  } else if (key in dom) {
    dom[key] = '';
  } else {
    dom.removeAttribute(key);
  }
}
```

### Update Phase

**Patching**:
```javascript
function patch(dom, oldVNode, newVNode) {
  // Get patch
  const patches = diff(oldVNode, newVNode);
  
  if (!patches) return dom;
  
  // Apply patch
  return applyPatch(dom, patches);
}

function applyPatch(dom, patch) {
  switch (patch.type) {
    case 'REPLACE':
      const newDom = createDOMNode(patch.newVNode);
      dom.parentNode.replaceChild(newDom, dom);
      return newDom;
    
    case 'TEXT':
      dom.textContent = patch.content;
      return dom;
    
    case 'UPDATE':
      if (patch.propPatches) {
        applyPropPatches(dom, patch.propPatches);
      }
      
      if (patch.childPatches) {
        applyChildPatches(dom, patch.childPatches);
      }
      
      return dom;
    
    default:
      return dom;
  }
}

function applyPropPatches(dom, propPatches) {
  propPatches.forEach(patch => {
    switch (patch.type) {
      case 'ADD_PROP':
      case 'UPDATE_PROP':
        setProp(dom, patch.key, patch.value);
        break;
      
      case 'REMOVE_PROP':
        removeProp(dom, patch.key);
        break;
    }
  });
}

function applyChildPatches(dom, childPatches) {
  childPatches.forEach(patch => {
    switch (patch.type) {
      case 'INSERT':
        const newChild = createDOMNode(patch.vnode);
        if (patch.index >= dom.childNodes.length) {
          dom.appendChild(newChild);
        } else {
          dom.insertBefore(newChild, dom.childNodes[patch.index]);
        }
        break;
      
      case 'REMOVE':
        dom.removeChild(dom.childNodes[patch.index]);
        break;
      
      case 'PATCH':
        const child = dom.childNodes[patch.index];
        applyPatch(child, patch.patch);
        break;
      
      case 'MOVE':
        const nodeToMove = dom.childNodes[patch.from];
        dom.insertBefore(nodeToMove, dom.childNodes[patch.to]);
        break;
    }
  });
}
```

### Unmounting Phase

**Cleanup**:
```javascript
function unmount(vnode) {
  const dom = vnode._dom;
  
  if (!dom) return;
  
  // Call cleanup for components
  if (typeof vnode.type === 'function') {
    if (vnode._instance && vnode._instance.componentWillUnmount) {
      vnode._instance.componentWillUnmount();
    }
  }
  
  // Recursively unmount children
  if (vnode.children) {
    vnode.children.forEach(child => {
      if (typeof child === 'object') {
        unmount(child);
      }
    });
  }
  
  // Remove event listeners
  if (vnode.props) {
    for (const key in vnode.props) {
      if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase();
        dom.removeEventListener(eventType, vnode.props[key]);
      }
    }
  }
  
  // Remove from DOM
  if (dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }
  
  // Clear reference
  vnode._dom = null;
}
```

## Fiber Architecture

### Fiber Node Structure

**Fiber**:
```javascript
class Fiber {
  constructor(vnode) {
    // Instance
    this.type = vnode.type;
    this.props = vnode.props;
    this.key = vnode.key;
    
    // Relationships
    this.parent = null;
    this.child = null;
    this.sibling = null;
    
    // State
    this.alternate = null;  // Previous fiber
    this.effectTag = null;  // What to do with this fiber
    this.effects = [];      // Side effects to commit
    
    // DOM
    this.dom = null;
    
    // Hooks
    this.hooks = [];
    this.hookIndex = 0;
  }
}

const EffectTag = {
  PLACEMENT: 'PLACEMENT',  // Insert new node
  UPDATE: 'UPDATE',        // Update existing node
  DELETION: 'DELETION'     // Remove node
};
```

### Work Loop

**Concurrent Rendering**:
```javascript
class FiberScheduler {
  constructor() {
    this.nextUnitOfWork = null;
    this.wipRoot = null;          // Work in progress root
    this.currentRoot = null;      // Last committed root
    this.deletions = [];
  }

  scheduleWork(fiber) {
    this.wipRoot = {
      dom: this.currentRoot?.dom,
      props: this.currentRoot?.props,
      alternate: this.currentRoot
    };
    
    this.nextUnitOfWork = this.wipRoot;
    this.deletions = [];
    
    requestIdleCallback(this.workLoop.bind(this));
  }

  workLoop(deadline) {
    let shouldYield = false;
    
    while (this.nextUnitOfWork && !shouldYield) {
      this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }
    
    // Commit phase
    if (!this.nextUnitOfWork && this.wipRoot) {
      this.commitRoot();
    }
    
    requestIdleCallback(this.workLoop.bind(this));
  }

  performUnitOfWork(fiber) {
    // 1. Create DOM node if needed
    if (!fiber.dom) {
      fiber.dom = createDOMNode(fiber);
    }
    
    // 2. Create fibers for children
    this.reconcileChildren(fiber, fiber.props.children);
    
    // 3. Return next unit of work
    if (fiber.child) {
      return fiber.child;
    }
    
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
    
    return null;
  }

  reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate?.child;
    let prevSibling = null;
    
    while (index < elements.length || oldFiber) {
      const element = elements[index];
      let newFiber = null;
      
      const sameType = oldFiber && element && element.type === oldFiber.type;
      
      if (sameType) {
        // Update
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: EffectTag.UPDATE
        };
      }
      
      if (element && !sameType) {
        // Add
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: EffectTag.PLACEMENT
        };
      }
      
      if (oldFiber && !sameType) {
        // Delete
        oldFiber.effectTag = EffectTag.DELETION;
        this.deletions.push(oldFiber);
      }
      
      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }
      
      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (element) {
        prevSibling.sibling = newFiber;
      }
      
      prevSibling = newFiber;
      index++;
    }
  }

  commitRoot() {
    this.deletions.forEach(this.commitWork.bind(this));
    this.commitWork(this.wipRoot.child);
    this.currentRoot = this.wipRoot;
    this.wipRoot = null;
  }

  commitWork(fiber) {
    if (!fiber) return;
    
    const domParent = fiber.parent.dom;
    
    if (fiber.effectTag === EffectTag.PLACEMENT && fiber.dom) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === EffectTag.UPDATE && fiber.dom) {
      updateProps(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === EffectTag.DELETION) {
      domParent.removeChild(fiber.dom);
    }
    
    this.commitWork(fiber.child);
    this.commitWork(fiber.sibling);
  }
}
```

### Time Slicing

**Concept**:
```javascript
// Break work into chunks
function timeSlicedRender(work, deadline) {
  while (work.length > 0 && deadline.timeRemaining() > 0) {
    const unit = work.shift();
    processUnit(unit);
  }
  
  if (work.length > 0) {
    // More work to do
    requestIdleCallback((deadline) => {
      timeSlicedRender(work, deadline);
    });
  } else {
    // Work complete, commit
    commitChanges();
  }
}
```

## Keys and Lists

### Why Keys Matter

**Without Keys**:
```javascript
// Initial render
<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>

// After inserting at beginning
<ul>
  <li>X</li>  // React thinks: A -> X (update)
  <li>A</li>  // React thinks: B -> A (update)
  <li>B</li>  // React thinks: C -> B (update)
  <li>C</li>  // React thinks: new (insert)
</ul>
// Result: 3 updates + 1 insert
```

**With Keys**:
```javascript
// Initial render
<ul>
  <li key="a">A</li>
  <li key="b">B</li>
  <li key="c">C</li>
</ul>

// After inserting at beginning
<ul>
  <li key="x">X</li>  // React thinks: new (insert)
  <li key="a">A</li>  // React thinks: same (no change)
  <li key="b">B</li>  // React thinks: same (no change)
  <li key="c">C</li>  // React thinks: same (no change)
</ul>
// Result: 1 insert
```

### Key Selection

**Good Keys**:
```javascript
// Stable IDs from data
items.map(item => (
  <Item key={item.id} {...item} />
))

// Composite keys
items.map(item => (
  <Item key={`${item.category}-${item.id}`} {...item} />
))
```

**Bad Keys**:
```javascript
// Index as key (unstable on reorder)
items.map((item, index) => (
  <Item key={index} {...item} />
))

// Random keys (breaks reconciliation)
items.map(item => (
  <Item key={Math.random()} {...item} />
))
```

## Performance Optimization

### Memoization

**React.memo**:
```javascript
function memo(Component, arePropsEqual) {
  return class MemoizedComponent extends React.Component {
    shouldComponentUpdate(nextProps) {
      if (arePropsEqual) {
        return !arePropsEqual(this.props, nextProps);
      }
      
      // Shallow comparison
      return !shallowEqual(this.props, nextProps);
    }
    
    render() {
      return <Component {...this.props} />;
    }
  };
}

function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => obj1[key] === obj2[key]);
}
```

### Batching Updates

**Implementation**:
```javascript
class UpdateQueue {
  constructor() {
    this.queue = [];
    this.isBatching = false;
  }

  enqueueUpdate(component, partialState) {
    this.queue.push({ component, partialState });
    
    if (!this.isBatching) {
      this.flush();
    }
  }

  batchUpdates(fn) {
    this.isBatching = true;
    try {
      fn();
    } finally {
      this.isBatching = false;
      this.flush();
    }
  }

  flush() {
    const updates = this.queue.slice();
    this.queue = [];
    
    // Group updates by component
    const componentUpdates = new Map();
    
    updates.forEach(({ component, partialState }) => {
      if (!componentUpdates.has(component)) {
        componentUpdates.set(component, []);
      }
      componentUpdates.get(component).push(partialState);
    });
    
    // Apply batched updates
    componentUpdates.forEach((states, component) => {
      const newState = states.reduce(
        (acc, state) => ({ ...acc, ...state }),
        component.state
      );
      component.state = newState;
      component.forceUpdate();
    });
  }
}
```

## Summary

Virtual DOM and reconciliation enable efficient UI updates through intelligent diffing algorithms, fiber architecture for concurrent rendering, and optimization techniques like memoization and batching. Understanding these concepts is crucial for building performant React applications.
