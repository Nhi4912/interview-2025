# JavaScript Design Patterns - Practical Guide

> Design patterns giúp giải quyết các vấn đề phổ biến một cách có hệ thống. Essential cho senior developers.

---

## Mục Lục

- [Overview](#-overview)
- [Creational Patterns](#-creational-patterns)
- [Structural Patterns](#-structural-patterns)
- [Behavioral Patterns](#-behavioral-patterns)
- [Modern JavaScript Patterns](#-modern-javascript-patterns)
- [React Patterns](#-react-patterns)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

Design Patterns chia thành 3 nhóm chính:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN PATTERNS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────┐                                            │
│   │   CREATIONAL    │  How objects are created                   │
│   │                 │                                            │
│   │  • Singleton    │                                            │
│   │  • Factory      │                                            │
│   │  • Builder      │                                            │
│   │  • Prototype    │                                            │
│   └─────────────────┘                                            │
│                                                                   │
│   ┌─────────────────┐                                            │
│   │   STRUCTURAL    │  How objects compose                       │
│   │                 │                                            │
│   │  • Adapter      │                                            │
│   │  • Decorator    │                                            │
│   │  • Facade       │                                            │
│   │  • Proxy        │                                            │
│   └─────────────────┘                                            │
│                                                                   │
│   ┌─────────────────┐                                            │
│   │   BEHAVIORAL    │  How objects communicate                   │
│   │                 │                                            │
│   │  • Observer     │                                            │
│   │  • Strategy     │                                            │
│   │  • Command      │                                            │
│   │  • Iterator     │                                            │
│   └─────────────────┘                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔨 Creational Patterns

### Singleton

Đảm bảo class chỉ có một instance.

```javascript
// ES6 Class-based Singleton
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connection = this.createConnection();
        Database.instance = this;
    }

    createConnection() {
        return { host: 'localhost', port: 5432 };
    }

    query(sql) {
        console.log('Executing:', sql);
    }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true

// Module-based Singleton (preferred in modern JS)
// database.js
let instance = null;

function createConnection() {
    return { host: 'localhost', port: 5432 };
}

export function getDatabase() {
    if (!instance) {
        instance = {
            connection: createConnection(),
            query(sql) {
                console.log('Executing:', sql);
            }
        };
    }
    return instance;
}
```

### Factory

Tạo objects mà không cần specify exact class.

```javascript
// Simple Factory
class UserFactory {
    static createUser(type, props) {
        switch (type) {
            case 'admin':
                return new Admin(props);
            case 'customer':
                return new Customer(props);
            case 'guest':
                return new Guest(props);
            default:
                throw new Error(`Unknown user type: ${type}`);
        }
    }
}

class Admin {
    constructor({ name }) {
        this.name = name;
        this.permissions = ['read', 'write', 'delete', 'admin'];
    }
}

class Customer {
    constructor({ name, email }) {
        this.name = name;
        this.email = email;
        this.permissions = ['read', 'write'];
    }
}

// Usage
const admin = UserFactory.createUser('admin', { name: 'John' });
const customer = UserFactory.createUser('customer', {
    name: 'Jane',
    email: 'jane@example.com'
});

// Abstract Factory
const UIFactory = {
    light: {
        createButton: () => new LightButton(),
        createInput: () => new LightInput(),
    },
    dark: {
        createButton: () => new DarkButton(),
        createInput: () => new DarkInput(),
    }
};

function createUI(theme) {
    const factory = UIFactory[theme];
    return {
        button: factory.createButton(),
        input: factory.createInput()
    };
}
```

### Builder

Construct complex objects step by step.

```javascript
class QueryBuilder {
    constructor() {
        this.query = {
            select: [],
            from: '',
            where: [],
            orderBy: [],
            limit: null
        };
    }

    select(...fields) {
        this.query.select.push(...fields);
        return this; // Enable chaining
    }

    from(table) {
        this.query.from = table;
        return this;
    }

    where(condition) {
        this.query.where.push(condition);
        return this;
    }

    orderBy(field, direction = 'ASC') {
        this.query.orderBy.push({ field, direction });
        return this;
    }

    limit(count) {
        this.query.limit = count;
        return this;
    }

    build() {
        let sql = `SELECT ${this.query.select.join(', ')}`;
        sql += ` FROM ${this.query.from}`;

        if (this.query.where.length) {
            sql += ` WHERE ${this.query.where.join(' AND ')}`;
        }

        if (this.query.orderBy.length) {
            const orders = this.query.orderBy
                .map(o => `${o.field} ${o.direction}`)
                .join(', ');
            sql += ` ORDER BY ${orders}`;
        }

        if (this.query.limit) {
            sql += ` LIMIT ${this.query.limit}`;
        }

        return sql;
    }
}

// Usage
const query = new QueryBuilder()
    .select('id', 'name', 'email')
    .from('users')
    .where('age > 18')
    .where('active = true')
    .orderBy('name', 'ASC')
    .limit(10)
    .build();

// SELECT id, name, email FROM users WHERE age > 18 AND active = true ORDER BY name ASC LIMIT 10
```

---

## 🏗️ Structural Patterns

### Adapter

Convert interface của một class sang interface khác mà clients expect.

```javascript
// Old API
class OldPaymentSystem {
    processPayment(amount) {
        console.log(`Processing $${amount} with old system`);
        return { status: 'OK', transactionId: '123' };
    }
}

// New API expected by our app
class NewPaymentInterface {
    pay(amount, currency, options) {
        throw new Error('Must be implemented');
    }
}

// Adapter
class PaymentAdapter extends NewPaymentInterface {
    constructor() {
        super();
        this.oldSystem = new OldPaymentSystem();
    }

    pay(amount, currency, options = {}) {
        // Convert new interface to old interface
        const convertedAmount = this.convertCurrency(amount, currency);
        const result = this.oldSystem.processPayment(convertedAmount);

        // Convert old response to new format
        return {
            success: result.status === 'OK',
            id: result.transactionId,
            amount,
            currency
        };
    }

    convertCurrency(amount, currency) {
        const rates = { USD: 1, EUR: 0.85, GBP: 0.73 };
        return amount * (rates[currency] || 1);
    }
}

// Usage
const payment = new PaymentAdapter();
payment.pay(100, 'USD', { method: 'card' });
```

### Decorator

Add behavior to objects dynamically.

```javascript
// Base class
class Coffee {
    cost() {
        return 5;
    }

    description() {
        return 'Coffee';
    }
}

// Decorators
class MilkDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }

    cost() {
        return this.coffee.cost() + 1;
    }

    description() {
        return this.coffee.description() + ', Milk';
    }
}

class SugarDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }

    cost() {
        return this.coffee.cost() + 0.5;
    }

    description() {
        return this.coffee.description() + ', Sugar';
    }
}

class WhipDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }

    cost() {
        return this.coffee.cost() + 2;
    }

    description() {
        return this.coffee.description() + ', Whip';
    }
}

// Usage
let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhipDecorator(coffee);

console.log(coffee.description()); // Coffee, Milk, Sugar, Whip
console.log(coffee.cost());        // 8.5

// Functional decorator pattern
function withLogging(fn) {
    return function(...args) {
        console.log(`Calling ${fn.name} with`, args);
        const result = fn.apply(this, args);
        console.log(`Result:`, result);
        return result;
    };
}

function add(a, b) {
    return a + b;
}

const loggedAdd = withLogging(add);
loggedAdd(2, 3); // Logs: Calling add with [2, 3], Result: 5
```

### Facade

Provide simplified interface to complex subsystem.

```javascript
// Complex subsystems
class VideoDecoder {
    decode(video) {
        return `Decoded ${video}`;
    }
}

class AudioDecoder {
    decode(audio) {
        return `Decoded ${audio}`;
    }
}

class VideoPlayer {
    play(stream) {
        console.log(`Playing: ${stream}`);
    }
}

class AudioPlayer {
    play(stream) {
        console.log(`Playing audio: ${stream}`);
    }
}

class SubtitleLoader {
    load(file) {
        return `Subtitles from ${file}`;
    }
}

// Facade
class MediaPlayerFacade {
    constructor() {
        this.videoDecoder = new VideoDecoder();
        this.audioDecoder = new AudioDecoder();
        this.videoPlayer = new VideoPlayer();
        this.audioPlayer = new AudioPlayer();
        this.subtitleLoader = new SubtitleLoader();
    }

    playMovie(videoFile, audioFile, subtitleFile) {
        // Hide complexity behind simple interface
        const video = this.videoDecoder.decode(videoFile);
        const audio = this.audioDecoder.decode(audioFile);
        const subtitles = this.subtitleLoader.load(subtitleFile);

        this.videoPlayer.play(video);
        this.audioPlayer.play(audio);
        console.log(subtitles);
    }
}

// Usage - simple!
const player = new MediaPlayerFacade();
player.playMovie('movie.mp4', 'movie.mp3', 'movie.srt');
```

### Proxy

Control access to an object.

```javascript
// Virtual Proxy (lazy loading)
class HeavyImage {
    constructor(url) {
        this.url = url;
        this.loadImage(); // Expensive operation
    }

    loadImage() {
        console.log(`Loading image from ${this.url}...`);
        // Simulate heavy operation
    }

    display() {
        console.log(`Displaying ${this.url}`);
    }
}

class ImageProxy {
    constructor(url) {
        this.url = url;
        this.image = null;
    }

    display() {
        if (!this.image) {
            this.image = new HeavyImage(this.url); // Load only when needed
        }
        this.image.display();
    }
}

// ES6 Proxy for data validation
const userValidator = {
    set(obj, prop, value) {
        if (prop === 'age') {
            if (typeof value !== 'number') {
                throw new TypeError('Age must be a number');
            }
            if (value < 0 || value > 150) {
                throw new RangeError('Age must be between 0 and 150');
            }
        }
        obj[prop] = value;
        return true;
    }
};

const user = new Proxy({}, userValidator);
user.age = 25;  // OK
// user.age = -5;  // RangeError
// user.age = 'old'; // TypeError

// Caching Proxy
function createCachingProxy(target) {
    const cache = new Map();

    return new Proxy(target, {
        apply(target, thisArg, args) {
            const key = JSON.stringify(args);

            if (cache.has(key)) {
                console.log('Cache hit!');
                return cache.get(key);
            }

            console.log('Cache miss, computing...');
            const result = target.apply(thisArg, args);
            cache.set(key, result);
            return result;
        }
    });
}

function expensiveCalculation(n) {
    // Simulate expensive operation
    let result = 0;
    for (let i = 0; i < n * 1000000; i++) {
        result += i;
    }
    return result;
}

const cachedCalc = createCachingProxy(expensiveCalculation);
cachedCalc(10); // Cache miss
cachedCalc(10); // Cache hit!
```

---

## 🔄 Behavioral Patterns

### Observer (Pub/Sub)

Define one-to-many dependency between objects.

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return () => this.off(event, listener); // Return unsubscribe function
    }

    off(event, listener) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listener);
    }

    emit(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(...args));
    }

    once(event, listener) {
        const wrapper = (...args) => {
            listener(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}

// Usage
const emitter = new EventEmitter();

const unsubscribe = emitter.on('userLogin', user => {
    console.log(`User logged in: ${user.name}`);
});

emitter.on('userLogin', user => {
    console.log(`Sending welcome email to ${user.email}`);
});

emitter.emit('userLogin', { name: 'John', email: 'john@example.com' });
// User logged in: John
// Sending welcome email to john@example.com

unsubscribe(); // Remove first listener
```

### Strategy

Define family of algorithms, make them interchangeable.

```javascript
// Strategies
const paymentStrategies = {
    creditCard: {
        pay(amount) {
            console.log(`Paid $${amount} using Credit Card`);
            return { method: 'creditCard', amount, fee: amount * 0.03 };
        }
    },
    paypal: {
        pay(amount) {
            console.log(`Paid $${amount} using PayPal`);
            return { method: 'paypal', amount, fee: amount * 0.04 };
        }
    },
    crypto: {
        pay(amount) {
            console.log(`Paid $${amount} using Crypto`);
            return { method: 'crypto', amount, fee: 0 };
        }
    }
};

// Context
class PaymentProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    processPayment(amount) {
        return this.strategy.pay(amount);
    }
}

// Usage
const processor = new PaymentProcessor(paymentStrategies.creditCard);
processor.processPayment(100);

processor.setStrategy(paymentStrategies.crypto);
processor.processPayment(100);

// Functional approach
function createPaymentProcessor(strategies) {
    return function(strategyName, amount) {
        const strategy = strategies[strategyName];
        if (!strategy) {
            throw new Error(`Unknown strategy: ${strategyName}`);
        }
        return strategy.pay(amount);
    };
}

const pay = createPaymentProcessor(paymentStrategies);
pay('paypal', 50);
```

### Command

Encapsulate request as an object.

```javascript
// Commands
class Command {
    execute() {
        throw new Error('Must implement execute');
    }
    undo() {
        throw new Error('Must implement undo');
    }
}

class AddTextCommand extends Command {
    constructor(editor, text) {
        super();
        this.editor = editor;
        this.text = text;
    }

    execute() {
        this.editor.content += this.text;
    }

    undo() {
        this.editor.content = this.editor.content.slice(0, -this.text.length);
    }
}

class DeleteTextCommand extends Command {
    constructor(editor, length) {
        super();
        this.editor = editor;
        this.length = length;
        this.deleted = '';
    }

    execute() {
        this.deleted = this.editor.content.slice(-this.length);
        this.editor.content = this.editor.content.slice(0, -this.length);
    }

    undo() {
        this.editor.content += this.deleted;
    }
}

// Invoker with history
class Editor {
    constructor() {
        this.content = '';
        this.history = [];
        this.redoStack = [];
    }

    executeCommand(command) {
        command.execute();
        this.history.push(command);
        this.redoStack = []; // Clear redo stack
    }

    undo() {
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.history.push(command);
        }
    }
}

// Usage
const editor = new Editor();

editor.executeCommand(new AddTextCommand(editor, 'Hello'));
console.log(editor.content); // 'Hello'

editor.executeCommand(new AddTextCommand(editor, ' World'));
console.log(editor.content); // 'Hello World'

editor.undo();
console.log(editor.content); // 'Hello'

editor.redo();
console.log(editor.content); // 'Hello World'
```

---

## 🆕 Modern JavaScript Patterns

### Module Pattern

```javascript
// IIFE Module (pre-ES6)
const Calculator = (function() {
    // Private
    let result = 0;

    function validate(n) {
        return typeof n === 'number';
    }

    // Public
    return {
        add(n) {
            if (validate(n)) result += n;
            return this;
        },
        subtract(n) {
            if (validate(n)) result -= n;
            return this;
        },
        getResult() {
            return result;
        },
        reset() {
            result = 0;
            return this;
        }
    };
})();

Calculator.add(5).add(3).subtract(2);
console.log(Calculator.getResult()); // 6

// ES6 Modules
// math.js
const PI = 3.14159;
const privateHelper = () => {}; // Not exported

export const square = x => x * x;
export const circle = r => PI * r * r;
export default { square, circle };
```

### Revealing Module Pattern

```javascript
const UserModule = (function() {
    // Private
    const users = [];

    function findIndex(id) {
        return users.findIndex(u => u.id === id);
    }

    // Public methods
    function addUser(user) {
        users.push(user);
    }

    function removeUser(id) {
        const index = findIndex(id);
        if (index > -1) {
            users.splice(index, 1);
        }
    }

    function getUser(id) {
        const index = findIndex(id);
        return index > -1 ? { ...users[index] } : null;
    }

    function getAllUsers() {
        return users.map(u => ({ ...u }));
    }

    // Reveal public API
    return {
        add: addUser,
        remove: removeUser,
        get: getUser,
        getAll: getAllUsers
    };
})();
```

### Composition over Inheritance

```javascript
// Instead of class hierarchy
const canEat = (state) => ({
    eat: () => {
        state.energy += 10;
        console.log('Eating... Energy:', state.energy);
    }
});

const canWalk = (state) => ({
    walk: () => {
        state.energy -= 1;
        state.position += 1;
        console.log('Walking... Position:', state.position);
    }
});

const canSwim = (state) => ({
    swim: () => {
        state.energy -= 2;
        state.position += 2;
        console.log('Swimming... Position:', state.position);
    }
});

const canFly = (state) => ({
    fly: () => {
        state.energy -= 3;
        state.position += 5;
        console.log('Flying... Position:', state.position);
    }
});

// Compose behaviors
function createDuck(name) {
    const state = { name, energy: 100, position: 0 };

    return {
        ...canEat(state),
        ...canWalk(state),
        ...canSwim(state),
        ...canFly(state),
        getState: () => ({ ...state })
    };
}

function createPenguin(name) {
    const state = { name, energy: 100, position: 0 };

    return {
        ...canEat(state),
        ...canWalk(state),
        ...canSwim(state),
        // No flying!
        getState: () => ({ ...state })
    };
}

const duck = createDuck('Donald');
duck.fly();
duck.swim();
duck.eat();
```

---

## ⚛️ React Patterns

### Higher-Order Component (HOC)

```javascript
function withLoading(WrappedComponent) {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) {
            return <Spinner />;
        }
        return <WrappedComponent {...props} />;
    };
}

const UserListWithLoading = withLoading(UserList);

// Usage
<UserListWithLoading isLoading={loading} users={users} />
```

### Render Props

```javascript
class MouseTracker extends React.Component {
    state = { x: 0, y: 0 };

    handleMouseMove = (event) => {
        this.setState({ x: event.clientX, y: event.clientY });
    };

    render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                {this.props.render(this.state)}
            </div>
        );
    }
}

// Usage
<MouseTracker
    render={({ x, y }) => (
        <p>Mouse position: {x}, {y}</p>
    )}
/>
```

### Custom Hooks

```javascript
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function
                ? value(storedValue)
                : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

// Usage
const [name, setName] = useLocalStorage('name', 'Guest');
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Singleton pattern là gì? Khi nào dùng?**

A: Singleton đảm bảo class chỉ có một instance. Dùng cho: database connections, configuration, logging, caching.

### 🟡 Mid-level

**Q: So sánh Observer và Pub/Sub patterns**

A:
- Observer: Components biết về nhau, direct relationship
- Pub/Sub: Decoupled qua event channel, không biết về nhau

**Q: Implement memoization decorator**

```javascript
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}
```

### 🔴 Senior

**Q: Khi nào nên dùng Composition over Inheritance?**

A:
- Cần flexibility, combine behaviors
- "Has-a" relationship thay vì "is-a"
- Avoid deep inheritance hierarchies
- Easier testing và maintenance

---

## 📚 Active Recall

1. [ ] Implement Singleton pattern 2 cách
2. [ ] Khi nào dùng Factory vs Builder?
3. [ ] Giải thích Proxy pattern với use cases
4. [ ] Implement EventEmitter từ scratch
5. [ ] So sánh HOC, Render Props, Custom Hooks

---

> **Quay lại:** [README.md](./README.md) - JavaScript Overview
