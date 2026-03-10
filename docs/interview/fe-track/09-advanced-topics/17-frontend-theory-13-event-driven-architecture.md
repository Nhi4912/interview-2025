# Event-Driven Architecture in Frontend

## Table of Contents
- [Core Concepts](#core-concepts)
- [Event Systems](#event-systems)
- [Event Patterns](#event-patterns)
- [Event Sourcing](#event-sourcing)
- [Message Queues](#message-queues)
- [Pub/Sub Systems](#pubsub-systems)
- [Event Loop Deep Dive](#event-loop-deep-dive)
- [Custom Events](#custom-events)
- [Event Delegation](#event-delegation)
- [Performance Considerations](#performance-considerations)

## Core Concepts

### Event-Driven Programming Paradigm

**Definition**: A programming paradigm where the flow of execution is determined by events - occurrences that happen asynchronously.

**Key Principles**:
```
1. Loose Coupling: Components communicate through events
2. Asynchronous: Events are handled asynchronously
3. Reactive: System reacts to events as they occur
4. Scalable: Easy to add new event handlers
```

**Event Anatomy**:
```javascript
// Event structure
{
  type: 'EVENT_TYPE',        // Event identifier
  target: element,           // Event source
  currentTarget: element,    // Current handler element
  timestamp: 1234567890,     // When event occurred
  payload: { /* data */ },   // Event data
  bubbles: true,             // Propagation flag
  cancelable: true,          // Can be prevented
  defaultPrevented: false    // Prevention status
}
```

### Event Flow Models

**1. Capture Phase**:
```
Window → Document → HTML → Body → ... → Target
```

**2. Target Phase**:
```
Event reaches the target element
```

**3. Bubble Phase**:
```
Target → ... → Body → HTML → Document → Window
```

**Complete Flow**:
```javascript
// Demonstrating event phases
element.addEventListener('click', handler, true);  // Capture
element.addEventListener('click', handler, false); // Bubble

function handler(event) {
  console.log('Phase:', event.eventPhase);
  // 1 = CAPTURING_PHASE
  // 2 = AT_TARGET
  // 3 = BUBBLING_PHASE
}
```

## Event Systems

### DOM Event System

**Event Registration**:
```javascript
// Method 1: addEventListener (preferred)
element.addEventListener('click', handler, options);

// Method 2: Property assignment
element.onclick = handler;

// Method 3: HTML attribute (avoid)
<button onclick="handler()">Click</button>
```

**Event Options**:
```javascript
const options = {
  capture: false,      // Use capture phase
  once: true,          // Remove after first invocation
  passive: true,       // Never call preventDefault()
  signal: abortSignal  // AbortController for removal
};

element.addEventListener('scroll', handler, options);
```

**Event Removal**:
```javascript
// Using AbortController (modern approach)
const controller = new AbortController();

element.addEventListener('click', handler, {
  signal: controller.signal
});

// Remove all listeners with this signal
controller.abort();

// Traditional removal
element.removeEventListener('click', handler);
```

### Custom Event System

**Implementation**:
```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(handler);
    
    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    }
  }

  emit(event, ...args) {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
```

**Advanced Features**:
```javascript
class AdvancedEventEmitter extends EventEmitter {
  // Wildcard events
  onAny(handler) {
    this.on('*', handler);
  }

  emit(event, ...args) {
    // Emit to specific handlers
    super.emit(event, ...args);
    // Emit to wildcard handlers
    super.emit('*', event, ...args);
  }

  // Event namespacing
  on(event, handler, namespace) {
    const key = namespace ? `${event}.${namespace}` : event;
    return super.on(key, handler);
  }

  offNamespace(namespace) {
    for (const [event] of this.events) {
      if (event.endsWith(`.${namespace}`)) {
        this.events.delete(event);
      }
    }
  }

  // Async events
  async emitAsync(event, ...args) {
    const handlers = this.events.get(event);
    if (handlers) {
      await Promise.all(
        Array.from(handlers).map(handler => handler(...args))
      );
    }
  }

  // Event piping
  pipe(targetEmitter, events) {
    events.forEach(event => {
      this.on(event, (...args) => {
        targetEmitter.emit(event, ...args);
      });
    });
  }
}
```

## Event Patterns

### Observer Pattern

**Implementation**:
```javascript
class Subject {
  constructor() {
    this.observers = new Set();
  }

  attach(observer) {
    this.observers.add(observer);
  }

  detach(observer) {
    this.observers.delete(observer);
  }

  notify(data) {
    this.observers.forEach(observer => {
      observer.update(data);
    });
  }
}

class Observer {
  update(data) {
    // React to changes
    console.log('Received:', data);
  }
}

// Usage
const subject = new Subject();
const observer1 = new Observer();
const observer2 = new Observer();

subject.attach(observer1);
subject.attach(observer2);
subject.notify({ message: 'Hello' });
```

### Mediator Pattern

**Implementation**:
```javascript
class Mediator {
  constructor() {
    this.channels = new Map();
  }

  subscribe(channel, subscriber, callback) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Map());
    }
    this.channels.get(channel).set(subscriber, callback);
  }

  unsubscribe(channel, subscriber) {
    const subscribers = this.channels.get(channel);
    if (subscribers) {
      subscribers.delete(subscriber);
    }
  }

  publish(channel, data, sender) {
    const subscribers = this.channels.get(channel);
    if (subscribers) {
      subscribers.forEach((callback, subscriber) => {
        if (subscriber !== sender) {
          callback(data);
        }
      });
    }
  }
}

// Usage
const mediator = new Mediator();

class Component {
  constructor(name, mediator) {
    this.name = name;
    this.mediator = mediator;
  }

  send(channel, data) {
    this.mediator.publish(channel, data, this);
  }

  receive(channel, callback) {
    this.mediator.subscribe(channel, this, callback);
  }
}
```

### Command Pattern

**Implementation**:
```javascript
class Command {
  constructor(execute, undo) {
    this.execute = execute;
    this.undo = undo;
  }
}

class CommandManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  execute(command) {
    // Remove any commands after current index
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
    }
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
    }
  }
}

// Usage
const manager = new CommandManager();

const addTextCommand = new Command(
  () => editor.addText('Hello'),
  () => editor.removeText('Hello')
);

manager.execute(addTextCommand);
manager.undo();
manager.redo();
```

## Event Sourcing

### Concept

**Definition**: Storing state changes as a sequence of events rather than storing current state.

**Benefits**:
```
1. Complete audit trail
2. Time travel debugging
3. Event replay
4. Temporal queries
5. Easy to add new projections
```

### Implementation

**Event Store**:
```javascript
class EventStore {
  constructor() {
    this.events = [];
    this.snapshots = new Map();
    this.projections = new Map();
  }

  append(event) {
    event.id = this.events.length;
    event.timestamp = Date.now();
    this.events.push(event);
    
    // Update projections
    this.updateProjections(event);
    
    // Create snapshot if needed
    if (this.events.length % 100 === 0) {
      this.createSnapshot();
    }
  }

  getEvents(fromId = 0) {
    return this.events.slice(fromId);
  }

  replay(fromId = 0) {
    const events = this.getEvents(fromId);
    return events.reduce((state, event) => {
      return this.applyEvent(state, event);
    }, this.getInitialState());
  }

  createSnapshot() {
    const state = this.replay();
    this.snapshots.set(this.events.length, state);
  }

  getState() {
    // Find latest snapshot
    const snapshotIds = Array.from(this.snapshots.keys()).sort((a, b) => b - a);
    const latestSnapshotId = snapshotIds[0] || 0;
    
    // Start from snapshot and replay remaining events
    const baseState = this.snapshots.get(latestSnapshotId) || this.getInitialState();
    const remainingEvents = this.getEvents(latestSnapshotId);
    
    return remainingEvents.reduce((state, event) => {
      return this.applyEvent(state, event);
    }, baseState);
  }

  applyEvent(state, event) {
    switch (event.type) {
      case 'USER_CREATED':
        return { ...state, users: [...state.users, event.payload] };
      case 'USER_UPDATED':
        return {
          ...state,
          users: state.users.map(u =>
            u.id === event.payload.id ? { ...u, ...event.payload } : u
          )
        };
      case 'USER_DELETED':
        return {
          ...state,
          users: state.users.filter(u => u.id !== event.payload.id)
        };
      default:
        return state;
    }
  }

  getInitialState() {
    return { users: [] };
  }

  // Projections for different views
  addProjection(name, reducer) {
    this.projections.set(name, { reducer, state: null });
  }

  updateProjections(event) {
    this.projections.forEach((projection, name) => {
      projection.state = projection.reducer(projection.state, event);
    });
  }

  getProjection(name) {
    return this.projections.get(name)?.state;
  }
}
```

**Usage Example**:
```javascript
const store = new EventStore();

// Add projection for user count
store.addProjection('userCount', (state = 0, event) => {
  switch (event.type) {
    case 'USER_CREATED':
      return state + 1;
    case 'USER_DELETED':
      return state - 1;
    default:
      return state;
  }
});

// Append events
store.append({
  type: 'USER_CREATED',
  payload: { id: 1, name: 'Alice' }
});

store.append({
  type: 'USER_CREATED',
  payload: { id: 2, name: 'Bob' }
});

// Get current state
const state = store.getState();
console.log(state); // { users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }

// Get projection
console.log(store.getProjection('userCount')); // 2

// Time travel
const pastState = store.replay(0);
```

## Message Queues

### Queue Implementation

**Basic Queue**:
```javascript
class MessageQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.handlers = new Map();
  }

  enqueue(message) {
    this.queue.push({
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0
    });
    
    this.process();
  }

  async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const message = this.queue.shift();
      
      try {
        await this.handleMessage(message);
      } catch (error) {
        await this.handleError(message, error);
      }
    }

    this.processing = false;
  }

  async handleMessage(message) {
    const handler = this.handlers.get(message.type);
    
    if (!handler) {
      throw new Error(`No handler for message type: ${message.type}`);
    }

    await handler(message.payload);
  }

  async handleError(message, error) {
    console.error(`Error processing message ${message.id}:`, error);

    if (message.retries < 3) {
      // Retry with exponential backoff
      const delay = Math.pow(2, message.retries) * 1000;
      
      setTimeout(() => {
        message.retries++;
        this.queue.unshift(message);
        this.process();
      }, delay);
    } else {
      // Move to dead letter queue
      this.deadLetterQueue.push({ message, error });
    }
  }

  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }
}
```

**Priority Queue**:
```javascript
class PriorityQueue extends MessageQueue {
  constructor() {
    super();
    this.queue = [];
  }

  enqueue(message, priority = 0) {
    const item = {
      ...message,
      priority,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    // Insert based on priority
    let inserted = false;
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i].priority < priority) {
        this.queue.splice(i, 0, item);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      this.queue.push(item);
    }

    this.process();
  }
}
```

## Pub/Sub Systems

### Implementation

**Basic Pub/Sub**:
```javascript
class PubSub {
  constructor() {
    this.subscribers = new Map();
    this.messageId = 0;
  }

  subscribe(topic, callback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Map());
    }

    const id = ++this.messageId;
    this.subscribers.get(topic).set(id, callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(topic);
      if (subscribers) {
        subscribers.delete(id);
        if (subscribers.size === 0) {
          this.subscribers.delete(topic);
        }
      }
    };
  }

  publish(topic, data) {
    const subscribers = this.subscribers.get(topic);
    
    if (subscribers) {
      subscribers.forEach(callback => {
        // Use setTimeout to make async
        setTimeout(() => callback(data), 0);
      });
    }

    // Support wildcard subscriptions
    this.publishWildcard(topic, data);
  }

  publishWildcard(topic, data) {
    const parts = topic.split('.');
    
    // Check for wildcard subscriptions
    for (let i = 0; i < parts.length; i++) {
      const pattern = [
        ...parts.slice(0, i),
        '*',
        ...parts.slice(i + 1)
      ].join('.');
      
      const subscribers = this.subscribers.get(pattern);
      if (subscribers) {
        subscribers.forEach(callback => {
          setTimeout(() => callback(data), 0);
        });
      }
    }

    // Check for multi-level wildcard
    const subscribers = this.subscribers.get('#');
    if (subscribers) {
      subscribers.forEach(callback => {
        setTimeout(() => callback(data), 0);
      });
    }
  }

  subscribeOnce(topic, callback) {
    const unsubscribe = this.subscribe(topic, (data) => {
      callback(data);
      unsubscribe();
    });
    return unsubscribe;
  }
}
```

**Advanced Features**:
```javascript
class AdvancedPubSub extends PubSub {
  constructor() {
    super();
    this.middleware = [];
    this.history = [];
    this.maxHistory = 100;
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  async publish(topic, data) {
    let message = { topic, data, timestamp: Date.now() };

    // Apply middleware
    for (const mw of this.middleware) {
      message = await mw(message);
      if (!message) return; // Middleware cancelled publication
    }

    // Store in history
    this.history.push(message);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Publish
    super.publish(message.topic, message.data);
  }

  replay(topic, fromTimestamp) {
    const messages = this.history.filter(
      m => m.topic === topic && m.timestamp >= fromTimestamp
    );

    messages.forEach(message => {
      super.publish(message.topic, message.data);
    });
  }

  getHistory(topic) {
    return this.history.filter(m => m.topic === topic);
  }
}

// Middleware examples
const loggingMiddleware = async (message) => {
  console.log(`Publishing to ${message.topic}:`, message.data);
  return message;
};

const validationMiddleware = async (message) => {
  if (!message.data) {
    console.error('Invalid message: no data');
    return null; // Cancel publication
  }
  return message;
};

const transformMiddleware = async (message) => {
  return {
    ...message,
    data: {
      ...message.data,
      transformed: true
    }
  };
};
```

## Event Loop Deep Dive

### Microtasks vs Macrotasks

**Task Queues**:
```
Macrotask Queue (Task Queue):
- setTimeout
- setInterval
- setImmediate (Node.js)
- I/O operations
- UI rendering

Microtask Queue (Job Queue):
- Promise callbacks
- queueMicrotask
- MutationObserver
- process.nextTick (Node.js)
```

**Execution Order**:
```javascript
console.log('1: Synchronous');

setTimeout(() => console.log('2: Macrotask'), 0);

Promise.resolve().then(() => console.log('3: Microtask'));

queueMicrotask(() => console.log('4: Microtask'));

console.log('5: Synchronous');

// Output:
// 1: Synchronous
// 5: Synchronous
// 3: Microtask
// 4: Microtask
// 2: Macrotask
```

**Event Loop Algorithm**:
```
1. Execute all synchronous code
2. Execute all microtasks
   - While microtask queue is not empty:
     - Dequeue and execute microtask
     - If new microtasks added, execute them too
3. Render (if needed)
4. Execute one macrotask
5. Go to step 2
```

### Custom Event Loop

**Implementation**:
```javascript
class EventLoop {
  constructor() {
    this.macrotasks = [];
    this.microtasks = [];
    this.running = false;
  }

  queueMacrotask(task) {
    this.macrotasks.push(task);
    this.run();
  }

  queueMicrotask(task) {
    this.microtasks.push(task);
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.macrotasks.length > 0 || this.microtasks.length > 0) {
      // Execute all microtasks
      while (this.microtasks.length > 0) {
        const task = this.microtasks.shift();
        try {
          await task();
        } catch (error) {
          console.error('Microtask error:', error);
        }
      }

      // Execute one macrotask
      if (this.macrotasks.length > 0) {
        const task = this.macrotasks.shift();
        try {
          await task();
        } catch (error) {
          console.error('Macrotask error:', error);
        }
      }
    }

    this.running = false;
  }
}
```

## Performance Considerations

### Event Throttling

**Implementation**:
```javascript
function throttle(func, limit) {
  let inThrottle;
  let lastResult;

  return function(...args) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    
    return lastResult;
  };
}

// Usage
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### Event Debouncing

**Implementation**:
```javascript
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// With immediate execution option
function debounceImmediate(func, delay, immediate = false) {
  let timeoutId;

  return function(...args) {
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, delay);
    
    if (callNow) {
      func.apply(this, args);
    }
  };
}
```

### Event Delegation

**Pattern**:
```javascript
class EventDelegator {
  constructor(root) {
    this.root = root;
    this.handlers = new Map();
  }

  on(selector, eventType, handler) {
    const key = `${eventType}:${selector}`;
    
    if (!this.handlers.has(key)) {
      const delegatedHandler = (event) => {
        const target = event.target.closest(selector);
        if (target && this.root.contains(target)) {
          handler.call(target, event);
        }
      };
      
      this.root.addEventListener(eventType, delegatedHandler);
      this.handlers.set(key, delegatedHandler);
    }
  }

  off(selector, eventType) {
    const key = `${eventType}:${selector}`;
    const handler = this.handlers.get(key);
    
    if (handler) {
      this.root.removeEventListener(eventType, handler);
      this.handlers.delete(key);
    }
  }
}

// Usage
const delegator = new EventDelegator(document.body);

delegator.on('.button', 'click', function(event) {
  console.log('Button clicked:', this);
});
```

### Memory Management

**Preventing Memory Leaks**:
```javascript
class EventManager {
  constructor() {
    this.listeners = new WeakMap();
  }

  addEventListener(element, type, handler, options) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }

    const elementListeners = this.listeners.get(element);
    
    if (!elementListeners.has(type)) {
      elementListeners.set(type, new Set());
    }

    elementListeners.get(type).add(handler);
    element.addEventListener(type, handler, options);
  }

  removeEventListener(element, type, handler) {
    const elementListeners = this.listeners.get(element);
    
    if (elementListeners) {
      const typeListeners = elementListeners.get(type);
      
      if (typeListeners) {
        typeListeners.delete(handler);
        element.removeEventListener(type, handler);
      }
    }
  }

  removeAllListeners(element) {
    const elementListeners = this.listeners.get(element);
    
    if (elementListeners) {
      elementListeners.forEach((handlers, type) => {
        handlers.forEach(handler => {
          element.removeEventListener(type, handler);
        });
      });
      
      this.listeners.delete(element);
    }
  }

  cleanup() {
    // WeakMap automatically cleans up when elements are garbage collected
    // But we can manually clean up all listeners
    this.listeners = new WeakMap();
  }
}
```

## Best Practices

### Event Naming Conventions

```javascript
// Use past tense for events that happened
'userLoggedIn'
'dataFetched'
'formSubmitted'

// Use present tense for events about to happen
'beforeSubmit'
'willNavigate'

// Use namespacing
'user:login'
'data:fetch:success'
'form:submit:error'
```

### Error Handling

```javascript
class SafeEventEmitter extends EventEmitter {
  emit(event, ...args) {
    const handlers = this.events.get(event);
    
    if (handlers) {
      const errors = [];
      
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          errors.push({ handler, error });
        }
      });
      
      if (errors.length > 0) {
        this.emit('error', { event, errors });
      }
    }
  }
}
```

### Testing Events

```javascript
class TestableEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.emittedEvents = [];
  }

  emit(event, ...args) {
    if (process.env.NODE_ENV === 'test') {
      this.emittedEvents.push({ event, args, timestamp: Date.now() });
    }
    super.emit(event, ...args);
  }

  getEmittedEvents(event) {
    return this.emittedEvents.filter(e => e.event === event);
  }

  clearEmittedEvents() {
    this.emittedEvents = [];
  }
}

// Test
const emitter = new TestableEventEmitter();
emitter.emit('test', 'data');
expect(emitter.getEmittedEvents('test')).toHaveLength(1);
```

## Summary

Event-driven architecture is fundamental to frontend development, enabling:
- Loose coupling between components
- Asynchronous communication
- Reactive user interfaces
- Scalable application design

Key takeaways:
- Understand event flow and propagation
- Use appropriate event patterns for different scenarios
- Implement proper error handling and memory management
- Optimize performance with throttling and debouncing
- Follow naming conventions and best practices
