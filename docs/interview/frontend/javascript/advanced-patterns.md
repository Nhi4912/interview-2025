---
layout: page
title: "Advanced JavaScript Patterns - Design Patterns and Architecture"
description: "Master advanced JavaScript patterns, design principles, and architectural concepts for scalable applications"
category: "JavaScript"
tags: [javascript, design-patterns, architecture, advanced, scalability]
companies: [Google, Microsoft, Amazon, Netflix, Uber]
---

# Advanced JavaScript Patterns - Design Patterns and Architecture

## 🏗️ Creational Patterns

### **Singleton Pattern**
**Definition:** Ensures a class has only one instance and provides global access to it.

**Why Use Singleton:**
- **Global State Management**: Centralized configuration or state
- **Resource Management**: Database connections, logging services
- **Caching**: Single cache instance across application
- **Coordination**: Event managers, service registries

**How Singleton Works:**

```mermaid
graph TB
    subgraph "Singleton Pattern"
        A[Client Request] --> B{Instance Exists?}
        B -->|No| C[Create Instance]
        B -->|Yes| D[Return Existing]
        C --> E[Store Instance]
        E --> F[Return Instance]
        D --> F
    end

    subgraph "Implementation Variants"
        G[Eager Initialization] --> H[Instance Created at Load]
        I[Lazy Initialization] --> J[Instance Created on Demand]
        K[Thread-Safe] --> L[Synchronized Creation]
    end

    subgraph "Modern Approaches"
        M[Module Singleton] --> N[ES6 Modules]
        O[Class Singleton] --> P[Static Methods]
        Q[Functional Singleton] --> R[Closures]
    end
```

**Deep Theory with Advanced Examples:**
```javascript
// WHAT: Modern Singleton implementations
class ConfigManager {
    constructor() {
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }
        
        this.config = new Map();
        this.subscribers = new Set();
        this.initialized = false;
        
        ConfigManager.instance = this;
        return this;
    }
    
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    
    async initialize(configSource) {
        if (this.initialized) return;
        
        try {
            const configData = await this.loadConfig(configSource);
            
            Object.entries(configData).forEach(([key, value]) => {
                this.config.set(key, value);
            });
            
            this.initialized = true;
            this.notifySubscribers('initialized', configData);
        } catch (error) {
            console.error('Failed to initialize config:', error);
            throw error;
        }
    }
    
    get(key, defaultValue = null) {
        return this.config.get(key) ?? defaultValue;
    }
    
    set(key, value) {
        const oldValue = this.config.get(key);
        this.config.set(key, value);
        
        this.notifySubscribers('changed', { key, value, oldValue });
    }
    
    subscribe(callback) {
        this.subscribers.add(callback);
        
        return () => {
            this.subscribers.delete(callback);
        };
    }
    
    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Subscriber error:', error);
            }
        });
    }
    
    async loadConfig(source) {
        if (typeof source === 'string') {
            const response = await fetch(source);
            return response.json();
        }
        
        if (typeof source === 'object') {
            return source;
        }
        
        throw new Error('Invalid config source');
    }
    
    // Prevent cloning
    clone() {
        throw new Error('Cannot clone singleton instance');
    }
    
    // Prevent serialization issues
    toJSON() {
        return { type: 'ConfigManager', initialized: this.initialized };
    }
}

// WHY: Advanced Singleton with Proxy
function createAdvancedSingleton(className, factory) {
    let instance = null;
    let isCreating = false;
    
    return new Proxy(factory, {
        construct(target, args) {
            if (instance) {
                return instance;
            }
            
            if (isCreating) {
                throw new Error(`Circular dependency detected in ${className}`);
            }
            
            isCreating = true;
            instance = Reflect.construct(target, args);
            isCreating = false;
            
            return instance;
        },
        
        apply(target, thisArg, args) {
            if (!instance) {
                instance = Reflect.apply(target, thisArg, args);
            }
            return instance;
        }
    });
}

// HOW: Functional Singleton with Module Pattern
const DatabaseManager = (() => {
    let instance = null;
    let connections = new Map();
    let connectionPool = [];
    
    class Database {
        constructor(config) {
            this.config = config;
            this.isConnected = false;
            this.queryCount = 0;
            this.lastActivity = Date.now();
        }
        
        async connect() {
            if (this.isConnected) return;
            
            try {
                // Simulate database connection
                await this.simulateConnection();
                this.isConnected = true;
                this.lastActivity = Date.now();
                
                console.log('Database connected successfully');
            } catch (error) {
                console.error('Database connection failed:', error);
                throw error;
            }
        }
        
        async query(sql, params = []) {
            if (!this.isConnected) {
                await this.connect();
            }
            
            this.queryCount++;
            this.lastActivity = Date.now();
            
            // Simulate query execution
            return this.simulateQuery(sql, params);
        }
        
        async simulateConnection() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) { // 90% success rate
                        resolve();
                    } else {
                        reject(new Error('Connection failed'));
                    }
                }, 100);
            });
        }
        
        async simulateQuery(sql, params) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        rows: [{ id: 1, data: 'sample' }],
                        rowCount: 1,
                        query: sql,
                        params
                    });
                }, 50);
            });
        }
        
        getStats() {
            return {
                isConnected: this.isConnected,
                queryCount: this.queryCount,
                lastActivity: this.lastActivity,
                uptime: Date.now() - this.lastActivity
            };
        }
        
        async disconnect() {
            this.isConnected = false;
            console.log('Database disconnected');
        }
    }
    
    return {
        getInstance(config = {}) {
            if (!instance) {
                instance = new Database(config);
            }
            return instance;
        },
        
        getConnection(name = 'default') {
            if (!connections.has(name)) {
                connections.set(name, new Database({ name }));
            }
            return connections.get(name);
        },
        
        createPool(size = 5, config = {}) {
            connectionPool = Array.from({ length: size }, () => 
                new Database({ ...config, pooled: true })
            );
            return connectionPool;
        },
        
        getPooledConnection() {
            const available = connectionPool.find(conn => !conn.inUse);
            
            if (available) {
                available.inUse = true;
                return available;
            }
            
            throw new Error('No available connections in pool');
        },
        
        releaseConnection(connection) {
            connection.inUse = false;
        },
        
        getStats() {
            return {
                instance: instance?.getStats(),
                connections: Array.from(connections.entries()).map(([name, conn]) => ({
                    name,
                    stats: conn.getStats()
                })),
                pool: connectionPool.map((conn, index) => ({
                    index,
                    inUse: conn.inUse,
                    stats: conn.getStats()
                }))
            };
        }
    };
})();

// Advanced Factory Pattern
class ComponentFactory {
    constructor() {
        this.components = new Map();
        this.middleware = [];
        this.cache = new Map();
    }
    
    register(type, factory, options = {}) {
        this.components.set(type, {
            factory,
            singleton: options.singleton || false,
            dependencies: options.dependencies || [],
            middleware: options.middleware || []
        });
    }
    
    create(type, props = {}, context = {}) {
        const component = this.components.get(type);
        
        if (!component) {
            throw new Error(`Component type '${type}' not registered`);
        }
        
        // Check cache for singletons
        if (component.singleton && this.cache.has(type)) {
            return this.cache.get(type);
        }
        
        // Resolve dependencies
        const dependencies = this.resolveDependencies(component.dependencies, context);
        
        // Apply middleware
        const enhancedProps = this.applyMiddleware(
            [...this.middleware, ...component.middleware],
            props,
            context
        );
        
        // Create instance
        const instance = component.factory(enhancedProps, dependencies, context);
        
        // Cache if singleton
        if (component.singleton) {
            this.cache.set(type, instance);
        }
        
        return instance;
    }
    
    resolveDependencies(dependencies, context) {
        return dependencies.reduce((resolved, dep) => {
            if (typeof dep === 'string') {
                resolved[dep] = this.create(dep, {}, context);
            } else if (typeof dep === 'object') {
                resolved[dep.name] = this.create(dep.type, dep.props || {}, context);
            }
            return resolved;
        }, {});
    }
    
    applyMiddleware(middleware, props, context) {
        return middleware.reduce((enhancedProps, mw) => {
            return mw(enhancedProps, context);
        }, props);
    }
    
    addMiddleware(middleware) {
        this.middleware.push(middleware);
    }
    
    // Batch creation
    createBatch(requests) {
        return requests.map(request => {
            const { type, props, context } = request;
            return this.create(type, props, context);
        });
    }
    
    // Async factory support
    async createAsync(type, props = {}, context = {}) {
        const component = this.components.get(type);
        
        if (!component) {
            throw new Error(`Component type '${type}' not registered`);
        }
        
        if (component.singleton && this.cache.has(type)) {
            return this.cache.get(type);
        }
        
        const dependencies = await this.resolveDependenciesAsync(component.dependencies, context);
        const enhancedProps = this.applyMiddleware(
            [...this.middleware, ...component.middleware],
            props,
            context
        );
        
        const instance = await component.factory(enhancedProps, dependencies, context);
        
        if (component.singleton) {
            this.cache.set(type, instance);
        }
        
        return instance;
    }
    
    async resolveDependenciesAsync(dependencies, context) {
        const resolved = {};
        
        for (const dep of dependencies) {
            if (typeof dep === 'string') {
                resolved[dep] = await this.createAsync(dep, {}, context);
            } else if (typeof dep === 'object') {
                resolved[dep.name] = await this.createAsync(dep.type, dep.props || {}, context);
            }
        }
        
        return resolved;
    }
}

// Usage examples
const factory = new ComponentFactory();

// Register components
factory.register('logger', (props) => {
    return {
        log: (message) => console.log(`[${props.level}] ${message}`),
        level: props.level || 'info'
    };
}, { singleton: true });

factory.register('api', (props, deps) => {
    return {
        get: async (url) => {
            deps.logger.log(`GET ${url}`);
            return fetch(url);
        },
        post: async (url, data) => {
            deps.logger.log(`POST ${url}`);
            return fetch(url, { method: 'POST', body: JSON.stringify(data) });
        }
    };
}, { dependencies: ['logger'] });

// Add middleware
factory.addMiddleware((props, context) => ({
    ...props,
    timestamp: Date.now(),
    userId: context.user?.id
}));

// Create instances
const logger = factory.create('logger', { level: 'debug' });
const api = factory.create('api', {}, { user: { id: 123 } });
```

## 🔄 Behavioral Patterns

### **Observer Pattern**
**Definition:** Defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified automatically.

**Why Use Observer:**
- **Loose Coupling**: Publishers don't need to know about subscribers
- **Dynamic Relationships**: Subscribers can be added/removed at runtime
- **Event-Driven Architecture**: Perfect for UI updates and state changes
- **Separation of Concerns**: Business logic separated from presentation

**How Observer Works:**

```mermaid
graph TB
    subgraph "Observer Pattern"
        A[Subject/Observable] --> B[Notify All Observers]
        B --> C[Observer 1]
        B --> D[Observer 2]
        B --> E[Observer N]
        
        F[State Change] --> A
        C --> G[Update UI]
        D --> H[Log Event]
        E --> I[Send Analytics]
    end

    subgraph "Event System"
        J[Event Emitter] --> K[Event Listeners]
        K --> L[Handler Functions]
        
        M[Custom Events] --> N[DOM Events]
        N --> O[Application Events]
    end

    subgraph "Modern Implementations"
        P[RxJS Observables] --> Q[Reactive Streams]
        R[Vue Reactivity] --> S[Proxy-based]
        T[React State] --> U[Hook-based]
    end
```

**Deep Theory with Advanced Examples:**
```javascript
// WHAT: Advanced Observable implementation
class AdvancedObservable {
    constructor(initialValue) {
        this.value = initialValue;
        this.observers = new Map();
        this.middleware = [];
        this.history = [];
        this.maxHistory = 100;
        this.isDisposed = false;
    }
    
    subscribe(observer, options = {}) {
        if (this.isDisposed) {
            throw new Error('Observable has been disposed');
        }
        
        const {
            immediate = false,
            filter = null,
            transform = null,
            debounce = 0,
            throttle = 0
        } = options;
        
        const observerId = Symbol('observer');
        const subscription = {
            observer,
            filter,
            transform,
            debounce,
            throttle,
            lastExecution: 0,
            timeoutId: null,
            active: true
        };
        
        this.observers.set(observerId, subscription);
        
        // Immediate notification
        if (immediate) {
            this.notifyObserver(subscription, this.value, undefined);
        }
        
        // Return unsubscribe function
        return () => {
            const sub = this.observers.get(observerId);
            if (sub) {
                sub.active = false;
                if (sub.timeoutId) {
                    clearTimeout(sub.timeoutId);
                }
                this.observers.delete(observerId);
            }
        };
    }
    
    next(newValue) {
        if (this.isDisposed) return;
        
        const oldValue = this.value;
        
        // Apply middleware
        const processedValue = this.applyMiddleware(newValue, oldValue);
        
        // Update value
        this.value = processedValue;
        
        // Add to history
        this.addToHistory(oldValue, processedValue);
        
        // Notify observers
        this.notifyObservers(processedValue, oldValue);
    }
    
    applyMiddleware(newValue, oldValue) {
        return this.middleware.reduce((value, middleware) => {
            return middleware(value, oldValue, this);
        }, newValue);
    }
    
    addToHistory(oldValue, newValue) {
        this.history.push({
            timestamp: Date.now(),
            oldValue,
            newValue
        });
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
    
    notifyObservers(newValue, oldValue) {
        this.observers.forEach(subscription => {
            if (subscription.active) {
                this.notifyObserver(subscription, newValue, oldValue);
            }
        });
    }
    
    notifyObserver(subscription, newValue, oldValue) {
        const { observer, filter, transform, debounce, throttle } = subscription;
        
        // Apply filter
        if (filter && !filter(newValue, oldValue)) {
            return;
        }
        
        // Apply transform
        const transformedValue = transform ? transform(newValue, oldValue) : newValue;
        
        // Handle debounce/throttle
        if (debounce > 0) {
            if (subscription.timeoutId) {
                clearTimeout(subscription.timeoutId);
            }
            
            subscription.timeoutId = setTimeout(() => {
                observer(transformedValue, oldValue);
            }, debounce);
        } else if (throttle > 0) {
            const now = Date.now();
            if (now - subscription.lastExecution >= throttle) {
                subscription.lastExecution = now;
                observer(transformedValue, oldValue);
            }
        } else {
            observer(transformedValue, oldValue);
        }
    }
    
    addMiddleware(middleware) {
        this.middleware.push(middleware);
    }
    
    // Operators
    map(transform) {
        const mapped = new AdvancedObservable();
        
        this.subscribe((value) => {
            mapped.next(transform(value));
        });
        
        return mapped;
    }
    
    filter(predicate) {
        const filtered = new AdvancedObservable();
        
        this.subscribe((value) => {
            if (predicate(value)) {
                filtered.next(value);
            }
        });
        
        return filtered;
    }
    
    debounce(delay) {
        const debounced = new AdvancedObservable();
        let timeoutId;
        
        this.subscribe((value) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            timeoutId = setTimeout(() => {
                debounced.next(value);
            }, delay);
        });
        
        return debounced;
    }
    
    throttle(delay) {
        const throttled = new AdvancedObservable();
        let lastExecution = 0;
        
        this.subscribe((value) => {
            const now = Date.now();
            if (now - lastExecution >= delay) {
                lastExecution = now;
                throttled.next(value);
            }
        });
        
        return throttled;
    }
    
    combine(other) {
        const combined = new AdvancedObservable([this.value, other.value]);
        
        this.subscribe((value) => {
            combined.next([value, other.value]);
        });
        
        other.subscribe((value) => {
            combined.next([this.value, value]);
        });
        
        return combined;
    }
    
    // Utility methods
    getValue() {
        return this.value;
    }
    
    getHistory() {
        return [...this.history];
    }
    
    getObserverCount() {
        return this.observers.size;
    }
    
    dispose() {
        this.observers.forEach(subscription => {
            if (subscription.timeoutId) {
                clearTimeout(subscription.timeoutId);
            }
        });
        
        this.observers.clear();
        this.middleware = [];
        this.history = [];
        this.isDisposed = true;
    }
}

// WHY: Event-driven architecture with advanced patterns
class EventBus {
    constructor() {
        this.events = new Map();
        this.middleware = [];
        this.interceptors = new Map();
        this.metrics = {
            totalEvents: 0,
            eventCounts: new Map(),
            errors: []
        };
    }
    
    on(event, handler, options = {}) {
        const {
            once = false,
            priority = 0,
            namespace = null,
            condition = null
        } = options;
        
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        
        const handlerInfo = {
            handler,
            once,
            priority,
            namespace,
            condition,
            id: Symbol('handler')
        };
        
        const handlers = this.events.get(event);
        handlers.push(handlerInfo);
        
        // Sort by priority (higher priority first)
        handlers.sort((a, b) => b.priority - a.priority);
        
        // Return unsubscribe function
        return () => {
            const index = handlers.findIndex(h => h.id === handlerInfo.id);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        };
    }
    
    once(event, handler, options = {}) {
        return this.on(event, handler, { ...options, once: true });
    }
    
    off(event, handler = null, namespace = null) {
        if (!this.events.has(event)) return;
        
        const handlers = this.events.get(event);
        
        if (!handler && !namespace) {
            // Remove all handlers for event
            handlers.length = 0;
        } else if (namespace) {
            // Remove handlers by namespace
            for (let i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i].namespace === namespace) {
                    handlers.splice(i, 1);
                }
            }
        } else {
            // Remove specific handler
            const index = handlers.findIndex(h => h.handler === handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    async emit(event, data = null, options = {}) {
        const {
            async = false,
            timeout = 5000,
            stopOnError = false
        } = options;
        
        this.metrics.totalEvents++;
        this.metrics.eventCounts.set(event, (this.metrics.eventCounts.get(event) || 0) + 1);
        
        // Apply interceptors
        const interceptedData = await this.applyInterceptors(event, data);
        
        // Apply middleware
        const processedData = await this.applyMiddleware(event, interceptedData);
        
        if (!this.events.has(event)) return [];
        
        const handlers = this.events.get(event).slice(); // Copy to avoid modification during iteration
        const results = [];
        
        for (const handlerInfo of handlers) {
            try {
                // Check condition
                if (handlerInfo.condition && !handlerInfo.condition(processedData, event)) {
                    continue;
                }
                
                const eventObject = {
                    type: event,
                    data: processedData,
                    timestamp: Date.now(),
                    preventDefault: false,
                    stopPropagation: false
                };
                
                let result;
                
                if (async) {
                    result = await Promise.race([
                        Promise.resolve(handlerInfo.handler(eventObject)),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Handler timeout')), timeout)
                        )
                    ]);
                } else {
                    result = handlerInfo.handler(eventObject);
                }
                
                results.push(result);
                
                // Remove once handlers
                if (handlerInfo.once) {
                    this.off(event, handlerInfo.handler);
                }
                
                // Stop propagation if requested
                if (eventObject.stopPropagation) {
                    break;
                }
                
            } catch (error) {
                this.metrics.errors.push({
                    event,
                    error: error.message,
                    timestamp: Date.now(),
                    handler: handlerInfo.handler.name
                });
                
                if (stopOnError) {
                    throw error;
                }
                
                console.error(`Error in event handler for '${event}':`, error);
            }
        }
        
        return results;
    }
    
    async applyInterceptors(event, data) {
        if (!this.interceptors.has(event)) return data;
        
        const interceptors = this.interceptors.get(event);
        let processedData = data;
        
        for (const interceptor of interceptors) {
            processedData = await interceptor(processedData, event);
        }
        
        return processedData;
    }
    
    async applyMiddleware(event, data) {
        let processedData = data;
        
        for (const middleware of this.middleware) {
            processedData = await middleware(event, processedData);
        }
        
        return processedData;
    }
    
    addInterceptor(event, interceptor) {
        if (!this.interceptors.has(event)) {
            this.interceptors.set(event, []);
        }
        
        this.interceptors.get(event).push(interceptor);
    }
    
    addMiddleware(middleware) {
        this.middleware.push(middleware);
    }
    
    // Utility methods
    getEventNames() {
        return Array.from(this.events.keys());
    }
    
    getHandlerCount(event) {
        return this.events.has(event) ? this.events.get(event).length : 0;
    }
    
    getMetrics() {
        return {
            ...this.metrics,
            eventCounts: Object.fromEntries(this.metrics.eventCounts)
        };
    }
    
    clear() {
        this.events.clear();
        this.interceptors.clear();
        this.middleware = [];
    }
}

// HOW: Reactive state management
class ReactiveStore {
    constructor(initialState = {}) {
        this.state = this.createReactiveState(initialState);
        this.mutations = new Map();
        this.actions = new Map();
        this.getters = new Map();
        this.subscribers = new Set();
        this.middleware = [];
        this.devtools = null;
    }
    
    createReactiveState(obj, path = []) {
        const self = this;
        
        return new Proxy(obj, {
            get(target, prop) {
                const value = target[prop];
                
                if (typeof value === 'object' && value !== null) {
                    return self.createReactiveState(value, [...path, prop]);
                }
                
                return value;
            },
            
            set(target, prop, value) {
                const oldValue = target[prop];
                const fullPath = [...path, prop];
                
                // Apply middleware
                const processedValue = self.applySetterMiddleware(fullPath, value, oldValue);
                
                target[prop] = processedValue;
                
                // Notify subscribers
                self.notifySubscribers({
                    type: 'mutation',
                    path: fullPath,
                    value: processedValue,
                    oldValue
                });
                
                return true;
            }
        });
    }
    
    registerMutation(name, mutator) {
        this.mutations.set(name, mutator);
    }
    
    registerAction(name, action) {
        this.actions.set(name, action);
    }
    
    registerGetter(name, getter) {
        this.getters.set(name, getter);
    }
    
    commit(mutation, payload) {
        if (!this.mutations.has(mutation)) {
            throw new Error(`Unknown mutation: ${mutation}`);
        }
        
        const mutator = this.mutations.get(mutation);
        const oldState = JSON.parse(JSON.stringify(this.state));
        
        mutator(this.state, payload);
        
        this.notifySubscribers({
            type: 'commit',
            mutation,
            payload,
            state: this.state,
            oldState
        });
        
        if (this.devtools) {
            this.devtools.commit(mutation, payload, this.state);
        }
    }
    
    async dispatch(action, payload) {
        if (!this.actions.has(action)) {
            throw new Error(`Unknown action: ${action}`);
        }
        
        const actionHandler = this.actions.get(action);
        
        const context = {
            state: this.state,
            commit: this.commit.bind(this),
            dispatch: this.dispatch.bind(this),
            getters: this.createGetterProxy()
        };
        
        try {
            const result = await actionHandler(context, payload);
            
            this.notifySubscribers({
                type: 'action',
                action,
                payload,
                result
            });
            
            return result;
        } catch (error) {
            this.notifySubscribers({
                type: 'error',
                action,
                payload,
                error
            });
            
            throw error;
        }
    }
    
    createGetterProxy() {
        const self = this;
        
        return new Proxy({}, {
            get(target, prop) {
                if (self.getters.has(prop)) {
                    return self.getters.get(prop)(self.state);
                }
                
                throw new Error(`Unknown getter: ${prop}`);
            }
        });
    }
    
    subscribe(callback) {
        this.subscribers.add(callback);
        
        return () => {
            this.subscribers.delete(callback);
        };
    }
    
    notifySubscribers(event) {
        this.subscribers.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Subscriber error:', error);
            }
        });
    }
    
    applySetterMiddleware(path, value, oldValue) {
        return this.middleware.reduce((processedValue, middleware) => {
            return middleware(path, processedValue, oldValue, this.state);
        }, value);
    }
    
    addMiddleware(middleware) {
        this.middleware.push(middleware);
    }
    
    // Time travel debugging
    enableTimeTravel() {
        this.history = [];
        this.currentIndex = -1;
        
        this.subscribe((event) => {
            if (event.type === 'commit') {
                this.history = this.history.slice(0, this.currentIndex + 1);
                this.history.push({
                    mutation: event.mutation,
                    payload: event.payload,
                    state: JSON.parse(JSON.stringify(event.state)),
                    timestamp: Date.now()
                });
                this.currentIndex = this.history.length - 1;
            }
        });
    }
    
    travelTo(index) {
        if (!this.history || index < 0 || index >= this.history.length) {
            throw new Error('Invalid history index');
        }
        
        this.currentIndex = index;
        const snapshot = this.history[index];
        
        // Restore state
        Object.assign(this.state, snapshot.state);
        
        this.notifySubscribers({
            type: 'timeTravel',
            index,
            snapshot
        });
    }
    
    getHistory() {
        return this.history ? [...this.history] : [];
    }
}

// Usage examples
const store = new ReactiveStore({
    user: { name: '', email: '' },
    posts: [],
    loading: false
});

// Register mutations
store.registerMutation('SET_USER', (state, user) => {
    state.user = user;
});

store.registerMutation('ADD_POST', (state, post) => {
    state.posts.push(post);
});

store.registerMutation('SET_LOADING', (state, loading) => {
    state.loading = loading;
});

// Register actions
store.registerAction('fetchUser', async ({ commit }, userId) => {
    commit('SET_LOADING', true);
    
    try {
        const user = await api.getUser(userId);
        commit('SET_USER', user);
        return user;
    } finally {
        commit('SET_LOADING', false);
    }
});

// Register getters
store.registerGetter('userPosts', (state) => {
    return state.posts.filter(post => post.userId === state.user.id);
});

// Subscribe to changes
store.subscribe((event) => {
    console.log('Store event:', event);
});

// Enable time travel
store.enableTimeTravel();

// Usage
store.dispatch('fetchUser', 123);
store.commit('ADD_POST', { id: 1, title: 'Hello World', userId: 123 });
```

This comprehensive guide covers advanced JavaScript patterns with deep theoretical understanding and practical implementations for scalable applications.