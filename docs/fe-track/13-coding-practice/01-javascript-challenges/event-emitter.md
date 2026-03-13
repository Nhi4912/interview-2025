# Event Emitter


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

> Implement Event Emitter (Pub/Sub pattern) - câu hỏi phổ biến về design patterns.

**Difficulty**: 🟡 Medium
**Time**: 25 minutes
**Companies**: All Big Tech

---

## 📋 Problem Statement

Implement an EventEmitter class with:
1. `on(event, listener)` - Subscribe to event
2. `off(event, listener)` - Unsubscribe
3. `emit(event, ...args)` - Trigger event
4. `once(event, listener)` - Subscribe for single use

---

## 💡 Solution

### Basic Implementation

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return this; // Enable chaining
  }

  off(event, listener) {
    if (!this.events.has(event)) return this;

    const listeners = this.events.get(event);
    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    // Clean up empty arrays
    if (listeners.length === 0) {
      this.events.delete(event);
    }

    return this;
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return false;

    const listeners = this.events.get(event).slice(); // Copy to avoid mutation issues

    listeners.forEach(listener => {
      listener.apply(this, args);
    });

    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };

    // Store reference to original for off()
    wrapper.original = listener;

    return this.on(event, wrapper);
  }

  // Additional methods
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }

  eventNames() {
    return Array.from(this.events.keys());
  }
}
```

### Enhanced Implementation (Node.js style)

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
    this.maxListeners = 10; // Default limit
  }

  on(event, listener) {
    this.addListener(event, listener, false);
    return this;
  }

  addListener(event, listener, prepend = false) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const listeners = this.events.get(event);

    // Check listener limit
    if (listeners.length >= this.maxListeners && this.maxListeners !== 0) {
      console.warn(`MaxListenersExceededWarning: ${event}`);
    }

    if (prepend) {
      listeners.unshift(listener);
    } else {
      listeners.push(listener);
    }

    // Emit 'newListener' event
    if (event !== 'newListener') {
      this.emit('newListener', event, listener);
    }

    return this;
  }

  prependListener(event, listener) {
    return this.addListener(event, listener, true);
  }

  off(event, listener) {
    return this.removeListener(event, listener);
  }

  removeListener(event, listener) {
    if (!this.events.has(event)) return this;

    const listeners = this.events.get(event);

    for (let i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i] === listener || listeners[i].original === listener) {
        listeners.splice(i, 1);
        this.emit('removeListener', event, listener);
        break; // Only remove first occurrence
      }
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }

    return this;
  }

  emit(event, ...args) {
    if (event === 'error' && !this.events.has('error')) {
      const error = args[0];
      throw error instanceof Error ? error : new Error('Uncaught error');
    }

    if (!this.events.has(event)) return false;

    const listeners = this.events.get(event).slice();

    for (const listener of listeners) {
      try {
        listener.apply(this, args);
      } catch (error) {
        this.emit('error', error);
      }
    }

    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.removeListener(event, wrapper);
      listener.apply(this, args);
    };
    wrapper.original = listener;
    return this.on(event, wrapper);
  }

  prependOnceListener(event, listener) {
    const wrapper = (...args) => {
      this.removeListener(event, wrapper);
      listener.apply(this, args);
    };
    wrapper.original = listener;
    return this.prependListener(event, wrapper);
  }

  setMaxListeners(n) {
    this.maxListeners = n;
    return this;
  }

  getMaxListeners() {
    return this.maxListeners;
  }

  listeners(event) {
    if (!this.events.has(event)) return [];
    return this.events.get(event).map(l => l.original || l);
  }

  rawListeners(event) {
    if (!this.events.has(event)) return [];
    return this.events.get(event).slice();
  }

  removeAllListeners(event) {
    if (event) {
      if (this.events.has(event)) {
        this.events.get(event).forEach(listener => {
          this.emit('removeListener', event, listener);
        });
        this.events.delete(event);
      }
    } else {
      for (const [eventName, listeners] of this.events) {
        listeners.forEach(listener => {
          this.emit('removeListener', eventName, listener);
        });
      }
      this.events.clear();
    }
    return this;
  }

  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }

  eventNames() {
    return Array.from(this.events.keys());
  }
}

// Static method
EventEmitter.listenerCount = function(emitter, event) {
  return emitter.listenerCount(event);
};
```

---

## 📊 Visual Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      EVENT EMITTER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                     EVENTS MAP                           │   │
│   ├──────────┬──────────────────────────────────────────────┤   │
│   │  "click" │  [listener1, listener2, listener3]           │   │
│   │  "hover" │  [listener4]                                 │   │
│   │  "data"  │  [listener5, listener6]                      │   │
│   └──────────┴──────────────────────────────────────────────┘   │
│                                                                   │
│   OPERATIONS:                                                   │
│   ───────────                                                   │
│   on("click", fn)    →  Add fn to "click" listeners            │
│   off("click", fn)   →  Remove fn from "click" listeners       │
│   emit("click", arg) →  Call all "click" listeners with arg    │
│   once("click", fn)  →  Add fn, auto-remove after first call   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Test Cases

```javascript
// Basic usage
const emitter = new EventEmitter();

const greet = (name) => console.log(`Hello, ${name}!`);
emitter.on('greet', greet);
emitter.emit('greet', 'World'); // 'Hello, World!'

// Multiple listeners
emitter.on('greet', (name) => console.log(`Hi, ${name}!`));
emitter.emit('greet', 'User');
// 'Hello, User!'
// 'Hi, User!'

// Remove listener
emitter.off('greet', greet);
emitter.emit('greet', 'Test');
// Only 'Hi, Test!' (greet was removed)

// Once
const onceHandler = () => console.log('Only once!');
emitter.once('special', onceHandler);
emitter.emit('special'); // 'Only once!'
emitter.emit('special'); // (nothing - handler removed)

// Chaining
new EventEmitter()
  .on('a', () => console.log('a'))
  .on('b', () => console.log('b'))
  .emit('a')
  .emit('b');

// Event names
console.log(emitter.eventNames()); // ['greet', 'special']

// Listener count
console.log(emitter.listenerCount('greet')); // 1

// Remove all
emitter.removeAllListeners('greet');
console.log(emitter.listenerCount('greet')); // 0
```

---

## ⚠️ Edge Cases

```javascript
// 1. Removing listener during emit
const emitter = new EventEmitter();
const listener1 = () => {
  console.log('1');
  emitter.off('test', listener2);
};
const listener2 = () => console.log('2');

emitter.on('test', listener1);
emitter.on('test', listener2);
emitter.emit('test');
// Should still log '2' because we copy listeners array

// 2. Adding listener during emit
const listener3 = () => {
  console.log('3');
  emitter.on('test', () => console.log('4'));
};
emitter.on('test', listener3);
emitter.emit('test');
// Should log '3' but NOT '4' (added after copy)

// 3. Error handling
const errorEmitter = new EventEmitter();
errorEmitter.emit('error', new Error('oops'));
// Throws because no error listener

errorEmitter.on('error', (err) => console.log('Caught:', err.message));
errorEmitter.emit('error', new Error('handled'));
// 'Caught: handled'
```

---

## 💼 Real-World Use Cases

```javascript
// 1. DOM-like event handling
class Button extends EventEmitter {
  click() {
    this.emit('click', { target: this });
  }
}

const btn = new Button();
btn.on('click', (e) => console.log('Clicked!', e.target));
btn.click();

// 2. Async operations
class DataFetcher extends EventEmitter {
  async fetch(url) {
    this.emit('loading');
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.emit('success', data);
    } catch (error) {
      this.emit('error', error);
    } finally {
      this.emit('done');
    }
  }
}

const fetcher = new DataFetcher();
fetcher.on('loading', () => showSpinner());
fetcher.on('success', (data) => renderData(data));
fetcher.on('error', (err) => showError(err));
fetcher.on('done', () => hideSpinner());

// 3. State management
class Store extends EventEmitter {
  constructor(initialState) {
    super();
    this.state = initialState;
  }

  setState(newState) {
    const oldState = this.state;
    this.state = { ...this.state, ...newState };
    this.emit('change', this.state, oldState);
  }

  getState() {
    return this.state;
  }
}
```

---

## ❓ Follow-up Questions

1. **Why copy listeners array before emit?**
   - Prevents issues if listeners modify the array
   - Ensures all registered listeners are called

2. **How to handle async listeners?**
   - Could return Promise.all of async listeners
   - Or provide emitAsync method

3. **What about memory leaks?**
   - Set maxListeners warning
   - Always removeListener when done
   - Use WeakMap for object keys if needed

4. **How does Node.js EventEmitter differ?**
   - Has 'error' special handling
   - newListener/removeListener events
   - prependListener option

---

> **Tiếp theo:** Curry & Compose | **Quay lại:** [JavaScript Challenges](./README.md)
