# Advanced Design Patterns

## Table of Contents
- [Creational Patterns](#creational-patterns)
- [Structural Patterns](#structural-patterns)
- [Behavioral Patterns](#behavioral-patterns)
- [Architectural Patterns](#architectural-patterns)
- [Functional Patterns](#functional-patterns)
- [Reactive Patterns](#reactive-patterns)
- [Concurrency Patterns](#concurrency-patterns)
- [Anti-Patterns](#anti-patterns)

## Creational Patterns

### Abstract Factory

**Intent**: Provide an interface for creating families of related objects without specifying concrete classes.

```javascript
// Abstract factory
class UIFactory {
  createButton() {
    throw new Error('Must implement createButton');
  }
  
  createCheckbox() {
    throw new Error('Must implement createCheckbox');
  }
}

// Concrete factories
class LightThemeFactory extends UIFactory {
  createButton() {
    return new LightButton();
  }
  
  createCheckbox() {
    return new LightCheckbox();
  }
}

class DarkThemeFactory extends UIFactory {
  createButton() {
    return new DarkButton();
  }
  
  createCheckbox() {
    return new DarkCheckbox();
  }
}

// Products
class LightButton {
  render() {
    return '<button class="light">Click</button>';
  }
}

class DarkButton {
  render() {
    return '<button class="dark">Click</button>';
  }
}

class LightCheckbox {
  render() {
    return '<input type="checkbox" class="light">';
  }
}

class DarkCheckbox {
  render() {
    return '<input type="checkbox" class="dark">';
  }
}

// Usage
function createUI(factory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  
  return {
    button: button.render(),
    checkbox: checkbox.render()
  };
}

const lightUI = createUI(new LightThemeFactory());
const darkUI = createUI(new DarkThemeFactory());
```

### Builder Pattern

**Intent**: Separate construction of complex object from its representation.

```javascript
class QueryBuilder {
  constructor() {
    this.query = {
      select: [],
      from: null,
      where: [],
      orderBy: [],
      limit: null,
      offset: null
    };
  }

  select(...fields) {
    this.query.select.push(...fields);
    return this;
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

  offset(count) {
    this.query.offset = count;
    return this;
  }

  build() {
    let sql = `SELECT ${this.query.select.join(', ')} FROM ${this.query.from}`;
    
    if (this.query.where.length > 0) {
      sql += ` WHERE ${this.query.where.join(' AND ')}`;
    }
    
    if (this.query.orderBy.length > 0) {
      const orderClauses = this.query.orderBy
        .map(o => `${o.field} ${o.direction}`)
        .join(', ');
      sql += ` ORDER BY ${orderClauses}`;
    }
    
    if (this.query.limit !== null) {
      sql += ` LIMIT ${this.query.limit}`;
    }
    
    if (this.query.offset !== null) {
      sql += ` OFFSET ${this.query.offset}`;
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
  .offset(20)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18 AND active = true ORDER BY name ASC LIMIT 10 OFFSET 20
```

### Prototype Pattern

**Intent**: Create new objects by cloning existing ones.

```javascript
class Prototype {
  clone() {
    throw new Error('Must implement clone');
  }
}

class Shape extends Prototype {
  constructor(x, y, color) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
  }

  clone() {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this)
    );
  }
}

class Circle extends Shape {
  constructor(x, y, color, radius) {
    super(x, y, color);
    this.radius = radius;
  }

  draw() {
    return `Circle at (${this.x}, ${this.y}) with radius ${this.radius} and color ${this.color}`;
  }
}

class Rectangle extends Shape {
  constructor(x, y, color, width, height) {
    super(x, y, color);
    this.width = width;
    this.height = height;
  }

  draw() {
    return `Rectangle at (${this.x}, ${this.y}) with size ${this.width}x${this.height} and color ${this.color}`;
  }
}

// Deep clone utility
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }

  if (obj instanceof Object) {
    const cloned = Object.create(Object.getPrototypeOf(obj));
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    
    return cloned;
  }
}

// Usage
const circle1 = new Circle(10, 20, 'red', 5);
const circle2 = circle1.clone();
circle2.x = 30;
circle2.color = 'blue';

console.log(circle1.draw()); // Circle at (10, 20) with radius 5 and color red
console.log(circle2.draw()); // Circle at (30, 20) with radius 5 and color blue
```

### Object Pool

**Intent**: Reuse expensive objects instead of creating new ones.

```javascript
class ObjectPool {
  constructor(factory, reset, initialSize = 10, maxSize = 100) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
    this.available = [];
    this.inUse = new Set();
    
    // Pre-allocate objects
    for (let i = 0; i < initialSize; i++) {
      this.available.push(this.factory());
    }
  }

  acquire() {
    let obj;
    
    if (this.available.length > 0) {
      obj = this.available.pop();
    } else if (this.inUse.size < this.maxSize) {
      obj = this.factory();
    } else {
      throw new Error('Pool exhausted');
    }
    
    this.inUse.add(obj);
    return obj;
  }

  release(obj) {
    if (!this.inUse.has(obj)) {
      throw new Error('Object not from this pool');
    }
    
    this.inUse.delete(obj);
    this.reset(obj);
    this.available.push(obj);
  }

  drain() {
    this.available = [];
    this.inUse.clear();
  }

  get size() {
    return this.available.length + this.inUse.size;
  }

  get availableCount() {
    return this.available.length;
  }

  get inUseCount() {
    return this.inUse.size;
  }
}

// Usage with database connections
class DatabaseConnection {
  constructor(id) {
    this.id = id;
    this.connected = false;
  }

  connect() {
    this.connected = true;
    console.log(`Connection ${this.id} established`);
  }

  disconnect() {
    this.connected = false;
    console.log(`Connection ${this.id} closed`);
  }

  query(sql) {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    return `Executing: ${sql}`;
  }
}

let connectionId = 0;

const connectionPool = new ObjectPool(
  () => {
    const conn = new DatabaseConnection(connectionId++);
    conn.connect();
    return conn;
  },
  (conn) => {
    // Reset connection state
    conn.disconnect();
    conn.connect();
  },
  5,
  20
);

// Acquire and use connection
const conn = connectionPool.acquire();
console.log(conn.query('SELECT * FROM users'));
connectionPool.release(conn);
```

## Structural Patterns

### Adapter Pattern

**Intent**: Convert interface of a class into another interface clients expect.

```javascript
// Old API
class OldLogger {
  logMessage(message) {
    console.log(`[OLD] ${message}`);
  }
}

// New API interface
class Logger {
  log(level, message) {
    throw new Error('Must implement log');
  }
}

// Adapter
class LoggerAdapter extends Logger {
  constructor(oldLogger) {
    super();
    this.oldLogger = oldLogger;
  }

  log(level, message) {
    const formattedMessage = `[${level.toUpperCase()}] ${message}`;
    this.oldLogger.logMessage(formattedMessage);
  }
}

// Usage
const oldLogger = new OldLogger();
const logger = new LoggerAdapter(oldLogger);

logger.log('info', 'Application started');
logger.log('error', 'Something went wrong');
```

### Bridge Pattern

**Intent**: Decouple abstraction from implementation.

```javascript
// Implementation interface
class Renderer {
  renderCircle(x, y, radius) {
    throw new Error('Must implement renderCircle');
  }
  
  renderRectangle(x, y, width, height) {
    throw new Error('Must implement renderRectangle');
  }
}

// Concrete implementations
class SVGRenderer extends Renderer {
  renderCircle(x, y, radius) {
    return `<circle cx="${x}" cy="${y}" r="${radius}"/>`;
  }
  
  renderRectangle(x, y, width, height) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}"/>`;
  }
}

class CanvasRenderer extends Renderer {
  constructor(ctx) {
    super();
    this.ctx = ctx;
  }
  
  renderCircle(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    return 'Canvas circle rendered';
  }
  
  renderRectangle(x, y, width, height) {
    this.ctx.strokeRect(x, y, width, height);
    return 'Canvas rectangle rendered';
  }
}

// Abstraction
class Shape {
  constructor(renderer) {
    this.renderer = renderer;
  }
  
  draw() {
    throw new Error('Must implement draw');
  }
}

// Refined abstractions
class Circle extends Shape {
  constructor(renderer, x, y, radius) {
    super(renderer);
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  
  draw() {
    return this.renderer.renderCircle(this.x, this.y, this.radius);
  }
}

class Rectangle extends Shape {
  constructor(renderer, x, y, width, height) {
    super(renderer);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  draw() {
    return this.renderer.renderRectangle(this.x, this.y, this.width, this.height);
  }
}

// Usage
const svgRenderer = new SVGRenderer();
const circle = new Circle(svgRenderer, 100, 100, 50);
console.log(circle.draw()); // <circle cx="100" cy="100" r="50"/>

const canvas = document.createElement('canvas');
const canvasRenderer = new CanvasRenderer(canvas.getContext('2d'));
const rectangle = new Rectangle(canvasRenderer, 10, 10, 200, 100);
console.log(rectangle.draw()); // Canvas rectangle rendered
```

### Composite Pattern

**Intent**: Compose objects into tree structures to represent part-whole hierarchies.

```javascript
// Component interface
class FileSystemNode {
  constructor(name) {
    this.name = name;
  }
  
  getSize() {
    throw new Error('Must implement getSize');
  }
  
  print(indent = '') {
    throw new Error('Must implement print');
  }
}

// Leaf
class File extends FileSystemNode {
  constructor(name, size) {
    super(name);
    this.size = size;
  }
  
  getSize() {
    return this.size;
  }
  
  print(indent = '') {
    console.log(`${indent}📄 ${this.name} (${this.size} bytes)`);
  }
}

// Composite
class Directory extends FileSystemNode {
  constructor(name) {
    super(name);
    this.children = [];
  }
  
  add(node) {
    this.children.push(node);
    return this;
  }
  
  remove(node) {
    const index = this.children.indexOf(node);
    if (index > -1) {
      this.children.splice(index, 1);
    }
    return this;
  }
  
  getSize() {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }
  
  print(indent = '') {
    console.log(`${indent}📁 ${this.name}/`);
    this.children.forEach(child => child.print(indent + '  '));
  }
  
  find(name) {
    if (this.name === name) return this;
    
    for (const child of this.children) {
      if (child.name === name) return child;
      if (child instanceof Directory) {
        const found = child.find(name);
        if (found) return found;
      }
    }
    
    return null;
  }
}

// Usage
const root = new Directory('root');
const home = new Directory('home');
const user = new Directory('user');

user.add(new File('document.txt', 1024));
user.add(new File('photo.jpg', 2048));

home.add(user);
home.add(new File('readme.md', 512));

root.add(home);
root.add(new File('config.json', 256));

root.print();
console.log(`Total size: ${root.getSize()} bytes`);
```

### Decorator Pattern

**Intent**: Attach additional responsibilities to an object dynamically.

```javascript
// Component interface
class Coffee {
  cost() {
    throw new Error('Must implement cost');
  }
  
  description() {
    throw new Error('Must implement description');
  }
}

// Concrete component
class SimpleCoffee extends Coffee {
  cost() {
    return 2;
  }
  
  description() {
    return 'Simple coffee';
  }
}

// Decorator base
class CoffeeDecorator extends Coffee {
  constructor(coffee) {
    super();
    this.coffee = coffee;
  }
  
  cost() {
    return this.coffee.cost();
  }
  
  description() {
    return this.coffee.description();
  }
}

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 0.5;
  }
  
  description() {
    return this.coffee.description() + ', milk';
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 0.2;
  }
  
  description() {
    return this.coffee.description() + ', sugar';
  }
}

class WhipDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 0.7;
  }
  
  description() {
    return this.coffee.description() + ', whip';
  }
}

// Usage
let coffee = new SimpleCoffee();
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new WhipDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// Simple coffee, milk, sugar, whip: $3.4
```

### Facade Pattern

**Intent**: Provide unified interface to a set of interfaces in a subsystem.

```javascript
// Complex subsystem
class CPU {
  freeze() {
    console.log('CPU: Freezing');
  }
  
  jump(position) {
    console.log(`CPU: Jumping to ${position}`);
  }
  
  execute() {
    console.log('CPU: Executing');
  }
}

class Memory {
  load(position, data) {
    console.log(`Memory: Loading ${data} at ${position}`);
  }
}

class HardDrive {
  read(lba, size) {
    console.log(`HardDrive: Reading ${size} bytes from ${lba}`);
    return 'boot data';
  }
}

// Facade
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }
  
  start() {
    console.log('Computer: Starting...');
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
    console.log('Computer: Started');
  }
}

// Usage
const computer = new ComputerFacade();
computer.start();
```

### Flyweight Pattern

**Intent**: Use sharing to support large numbers of fine-grained objects efficiently.

```javascript
class TreeType {
  constructor(name, color, texture) {
    this.name = name;
    this.color = color;
    this.texture = texture;
  }
  
  draw(canvas, x, y) {
    console.log(`Drawing ${this.name} tree at (${x}, ${y}) with color ${this.color}`);
    // Draw tree using shared texture
  }
}

class TreeFactory {
  constructor() {
    this.treeTypes = new Map();
  }
  
  getTreeType(name, color, texture) {
    const key = `${name}-${color}-${texture}`;
    
    if (!this.treeTypes.has(key)) {
      this.treeTypes.set(key, new TreeType(name, color, texture));
      console.log(`Creating new tree type: ${key}`);
    }
    
    return this.treeTypes.get(key);
  }
  
  getTreeTypeCount() {
    return this.treeTypes.size;
  }
}

class Tree {
  constructor(x, y, treeType) {
    this.x = x;
    this.y = y;
    this.treeType = treeType;
  }
  
  draw(canvas) {
    this.treeType.draw(canvas, this.x, this.y);
  }
}

class Forest {
  constructor() {
    this.trees = [];
    this.treeFactory = new TreeFactory();
  }
  
  plantTree(x, y, name, color, texture) {
    const treeType = this.treeFactory.getTreeType(name, color, texture);
    const tree = new Tree(x, y, treeType);
    this.trees.push(tree);
  }
  
  draw(canvas) {
    this.trees.forEach(tree => tree.draw(canvas));
  }
  
  getStats() {
    return {
      totalTrees: this.trees.length,
      uniqueTreeTypes: this.treeFactory.getTreeTypeCount()
    };
  }
}

// Usage
const forest = new Forest();

// Plant 1000 trees (but only 3 unique types)
for (let i = 0; i < 1000; i++) {
  const x = Math.random() * 1000;
  const y = Math.random() * 1000;
  const types = [
    ['Oak', 'green', 'oak.png'],
    ['Pine', 'dark-green', 'pine.png'],
    ['Birch', 'white', 'birch.png']
  ];
  const [name, color, texture] = types[i % 3];
  forest.plantTree(x, y, name, color, texture);
}

console.log(forest.getStats());
// { totalTrees: 1000, uniqueTreeTypes: 3 }
```

### Proxy Pattern

**Intent**: Provide surrogate or placeholder for another object to control access.

```javascript
// Subject interface
class Image {
  display() {
    throw new Error('Must implement display');
  }
}

// Real subject
class RealImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.loadFromDisk();
  }
  
  loadFromDisk() {
    console.log(`Loading ${this.filename} from disk...`);
    // Simulate expensive operation
  }
  
  display() {
    console.log(`Displaying ${this.filename}`);
  }
}

// Proxy
class ImageProxy extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.realImage = null;
  }
  
  display() {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// Virtual proxy with caching
class CachedImageProxy extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.realImage = null;
    this.cache = new Map();
  }
  
  display() {
    if (this.cache.has(this.filename)) {
      console.log(`Using cached ${this.filename}`);
      return this.cache.get(this.filename);
    }
    
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    
    const result = this.realImage.display();
    this.cache.set(this.filename, result);
    return result;
  }
}

// Protection proxy
class ProtectedImageProxy extends Image {
  constructor(filename, user) {
    super();
    this.filename = filename;
    this.user = user;
    this.realImage = null;
  }
  
  display() {
    if (!this.hasAccess()) {
      console.log('Access denied');
      return;
    }
    
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    
    this.realImage.display();
  }
  
  hasAccess() {
    return this.user.role === 'admin' || this.user.permissions.includes('view_images');
  }
}

// Usage
const image1 = new ImageProxy('photo1.jpg');
image1.display(); // Loads and displays
image1.display(); // Just displays (already loaded)

const user = { role: 'guest', permissions: [] };
const image2 = new ProtectedImageProxy('secret.jpg', user);
image2.display(); // Access denied
```

I'll continue with more patterns:

<function_calls>
<invoke name="fsAppend">
<parameter name="path">docs/18-advanced-theory/06-design-patterns-advanced.md

## B
ehavioral Patterns

### Chain of Responsibility

**Intent**: Pass request along chain of handlers until one handles it.

```javascript
class Handler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  handle(request) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

class AuthenticationHandler extends Handler {
  handle(request) {
    if (!request.isAuthenticated) {
      console.log('Authentication failed');
      return { status: 401, message: 'Unauthorized' };
    }
    console.log('Authentication passed');
    return super.handle(request);
  }
}

class AuthorizationHandler extends Handler {
  handle(request) {
    if (!request.hasPermission) {
      console.log('Authorization failed');
      return { status: 403, message: 'Forbidden' };
    }
    console.log('Authorization passed');
    return super.handle(request);
  }
}

class ValidationHandler extends Handler {
  handle(request) {
    if (!request.isValid) {
      console.log('Validation failed');
      return { status: 400, message: 'Bad Request' };
    }
    console.log('Validation passed');
    return super.handle(request);
  }
}

class ProcessHandler extends Handler {
  handle(request) {
    console.log('Processing request');
    return { status: 200, message: 'Success', data: request.data };
  }
}

// Usage
const auth = new AuthenticationHandler();
const authz = new AuthorizationHandler();
const validation = new ValidationHandler();
const process = new ProcessHandler();

auth.setNext(authz).setNext(validation).setNext(process);

const request1 = {
  isAuthenticated: true,
  hasPermission: true,
  isValid: true,
  data: { id: 1 }
};

const result = auth.handle(request1);
console.log(result);
```

### Command Pattern

**Intent**: Encapsulate request as object to parameterize clients with different requests.

```javascript
class Command {
  execute() {
    throw new Error('Must implement execute');
  }

  undo() {
    throw new Error('Must implement undo');
  }
}

class TextEditor {
  constructor() {
    this.text = '';
  }

  getText() {
    return this.text;
  }

  setText(text) {
    this.text = text;
  }

  insertText(position, text) {
    this.text = this.text.slice(0, position) + text + this.text.slice(position);
  }

  deleteText(position, length) {
    return this.text.slice(position, position + length);
  }
}

class InsertCommand extends Command {
  constructor(editor, position, text) {
    super();
    this.editor = editor;
    this.position = position;
    this.text = text;
  }

  execute() {
    this.editor.insertText(this.position, this.text);
  }

  undo() {
    const currentText = this.editor.getText();
    this.editor.setText(
      currentText.slice(0, this.position) +
      currentText.slice(this.position + this.text.length)
    );
  }
}

class DeleteCommand extends Command {
  constructor(editor, position, length) {
    super();
    this.editor = editor;
    this.position = position;
    this.length = length;
    this.deletedText = '';
  }

  execute() {
    this.deletedText = this.editor.getText().slice(
      this.position,
      this.position + this.length
    );
    this.editor.setText(
      this.editor.getText().slice(0, this.position) +
      this.editor.getText().slice(this.position + this.length)
    );
  }

  undo() {
    this.editor.insertText(this.position, this.deletedText);
  }
}

class CommandManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  execute(command) {
    this.history = this.history.slice(0, this.currentIndex + 1);
    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    }
  }
}

// Usage
const editor = new TextEditor();
const manager = new CommandManager();

manager.execute(new InsertCommand(editor, 0, 'Hello'));
manager.execute(new InsertCommand(editor, 5, ' World'));
console.log(editor.getText()); // Hello World

manager.undo();
console.log(editor.getText()); // Hello

manager.redo();
console.log(editor.getText()); // Hello World
```

### Iterator Pattern

**Intent**: Provide way to access elements sequentially without exposing underlying representation.

```javascript
class Iterator {
  constructor(collection) {
    this.collection = collection;
    this.index = 0;
  }

  hasNext() {
    return this.index < this.collection.length;
  }

  next() {
    return this.hasNext() ? this.collection[this.index++] : null;
  }

  reset() {
    this.index = 0;
  }
}

class ReverseIterator {
  constructor(collection) {
    this.collection = collection;
    this.index = collection.length - 1;
  }

  hasNext() {
    return this.index >= 0;
  }

  next() {
    return this.hasNext() ? this.collection[this.index--] : null;
  }

  reset() {
    this.index = this.collection.length - 1;
  }
}

class FilterIterator {
  constructor(collection, predicate) {
    this.collection = collection;
    this.predicate = predicate;
    this.index = 0;
  }

  hasNext() {
    while (this.index < this.collection.length) {
      if (this.predicate(this.collection[this.index])) {
        return true;
      }
      this.index++;
    }
    return false;
  }

  next() {
    if (this.hasNext()) {
      return this.collection[this.index++];
    }
    return null;
  }

  reset() {
    this.index = 0;
  }
}

// Tree iterator
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }
}

class TreeIterator {
  constructor(root, traversal = 'dfs') {
    this.root = root;
    this.traversal = traversal;
    this.stack = traversal === 'dfs' ? [root] : [];
    this.queue = traversal === 'bfs' ? [root] : [];
  }

  hasNext() {
    return this.traversal === 'dfs' 
      ? this.stack.length > 0 
      : this.queue.length > 0;
  }

  next() {
    if (!this.hasNext()) return null;

    if (this.traversal === 'dfs') {
      const node = this.stack.pop();
      this.stack.push(...node.children.reverse());
      return node.value;
    } else {
      const node = this.queue.shift();
      this.queue.push(...node.children);
      return node.value;
    }
  }
}

// Usage
const numbers = [1, 2, 3, 4, 5];
const iterator = new Iterator(numbers);

while (iterator.hasNext()) {
  console.log(iterator.next());
}

const evenIterator = new FilterIterator(numbers, n => n % 2 === 0);
while (evenIterator.hasNext()) {
  console.log(evenIterator.next()); // 2, 4
}
```

### Mediator Pattern

**Intent**: Define object that encapsulates how set of objects interact.

```javascript
class Mediator {
  constructor() {
    this.colleagues = new Map();
  }

  register(name, colleague) {
    this.colleagues.set(name, colleague);
    colleague.setMediator(this);
  }

  send(message, from, to) {
    if (to) {
      const colleague = this.colleagues.get(to);
      if (colleague) {
        colleague.receive(message, from);
      }
    } else {
      // Broadcast to all except sender
      for (const [name, colleague] of this.colleagues) {
        if (name !== from) {
          colleague.receive(message, from);
        }
      }
    }
  }
}

class Colleague {
  constructor(name) {
    this.name = name;
    this.mediator = null;
  }

  setMediator(mediator) {
    this.mediator = mediator;
  }

  send(message, to) {
    console.log(`${this.name} sends: ${message}`);
    this.mediator.send(message, this.name, to);
  }

  receive(message, from) {
    console.log(`${this.name} received from ${from}: ${message}`);
  }
}

// Chat room example
class ChatRoom extends Mediator {
  constructor() {
    super();
    this.messageHistory = [];
  }

  send(message, from, to) {
    this.messageHistory.push({ from, to, message, timestamp: Date.now() });
    super.send(message, from, to);
  }

  getHistory() {
    return this.messageHistory;
  }
}

// Usage
const chatRoom = new ChatRoom();

const user1 = new Colleague('Alice');
const user2 = new Colleague('Bob');
const user3 = new Colleague('Charlie');

chatRoom.register('Alice', user1);
chatRoom.register('Bob', user2);
chatRoom.register('Charlie', user3);

user1.send('Hello everyone!'); // Broadcast
user2.send('Hi Alice!', 'Alice'); // Direct message
```

### Memento Pattern

**Intent**: Capture and externalize object's internal state for later restoration.

```javascript
class Memento {
  constructor(state) {
    this.state = state;
    this.timestamp = Date.now();
  }

  getState() {
    return this.state;
  }

  getTimestamp() {
    return this.timestamp;
  }
}

class TextEditor {
  constructor() {
    this.content = '';
    this.cursorPosition = 0;
  }

  type(text) {
    this.content = this.content.slice(0, this.cursorPosition) +
                   text +
                   this.content.slice(this.cursorPosition);
    this.cursorPosition += text.length;
  }

  delete(length) {
    this.content = this.content.slice(0, this.cursorPosition - length) +
                   this.content.slice(this.cursorPosition);
    this.cursorPosition -= length;
  }

  moveCursor(position) {
    this.cursorPosition = Math.max(0, Math.min(position, this.content.length));
  }

  save() {
    return new Memento({
      content: this.content,
      cursorPosition: this.cursorPosition
    });
  }

  restore(memento) {
    const state = memento.getState();
    this.content = state.content;
    this.cursorPosition = state.cursorPosition;
  }

  getContent() {
    return this.content;
  }
}

class History {
  constructor() {
    this.mementos = [];
    this.currentIndex = -1;
  }

  push(memento) {
    this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    this.mementos.push(memento);
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.mementos[this.currentIndex];
    }
    return null;
  }

  redo() {
    if (this.currentIndex < this.mementos.length - 1) {
      this.currentIndex++;
      return this.mementos[this.currentIndex];
    }
    return null;
  }

  getHistory() {
    return this.mementos.map((m, i) => ({
      index: i,
      timestamp: m.getTimestamp(),
      isCurrent: i === this.currentIndex
    }));
  }
}

// Usage
const editor = new TextEditor();
const history = new History();

history.push(editor.save());

editor.type('Hello');
history.push(editor.save());

editor.type(' World');
history.push(editor.save());

console.log(editor.getContent()); // Hello World

const memento = history.undo();
if (memento) editor.restore(memento);
console.log(editor.getContent()); // Hello
```

### Observer Pattern

**Intent**: Define one-to-many dependency so when one object changes state, dependents are notified.

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
    throw new Error('Must implement update');
  }
}

// Concrete implementation
class NewsAgency extends Subject {
  constructor() {
    super();
    this.news = null;
  }

  setNews(news) {
    this.news = news;
    this.notify(news);
  }

  getNews() {
    return this.news;
  }
}

class NewsChannel extends Observer {
  constructor(name) {
    super();
    this.name = name;
    this.news = null;
  }

  update(news) {
    this.news = news;
    console.log(`${this.name} received news: ${news}`);
  }

  getNews() {
    return this.news;
  }
}

// Advanced: Observable with filtering
class FilteredSubject extends Subject {
  constructor() {
    super();
    this.observerFilters = new Map();
  }

  attach(observer, filter) {
    super.attach(observer);
    if (filter) {
      this.observerFilters.set(observer, filter);
    }
  }

  detach(observer) {
    super.detach(observer);
    this.observerFilters.delete(observer);
  }

  notify(data) {
    this.observers.forEach(observer => {
      const filter = this.observerFilters.get(observer);
      if (!filter || filter(data)) {
        observer.update(data);
      }
    });
  }
}

// Usage
const agency = new NewsAgency();
const channel1 = new NewsChannel('CNN');
const channel2 = new NewsChannel('BBC');

agency.attach(channel1);
agency.attach(channel2);

agency.setNews('Breaking: Major event occurred');
```

### State Pattern

**Intent**: Allow object to alter behavior when internal state changes.

```javascript
class State {
  handle(context) {
    throw new Error('Must implement handle');
  }
}

class IdleState extends State {
  handle(context) {
    console.log('Player is idle');
    return this;
  }

  play(context) {
    console.log('Starting playback');
    context.setState(new PlayingState());
  }
}

class PlayingState extends State {
  handle(context) {
    console.log('Player is playing');
    return this;
  }

  pause(context) {
    console.log('Pausing playback');
    context.setState(new PausedState());
  }

  stop(context) {
    console.log('Stopping playback');
    context.setState(new IdleState());
  }
}

class PausedState extends State {
  handle(context) {
    console.log('Player is paused');
    return this;
  }

  play(context) {
    console.log('Resuming playback');
    context.setState(new PlayingState());
  }

  stop(context) {
    console.log('Stopping playback');
    context.setState(new IdleState());
  }
}

class MediaPlayer {
  constructor() {
    this.state = new IdleState();
  }

  setState(state) {
    this.state = state;
  }

  play() {
    if (this.state.play) {
      this.state.play(this);
    }
  }

  pause() {
    if (this.state.pause) {
      this.state.pause(this);
    }
  }

  stop() {
    if (this.state.stop) {
      this.state.stop(this);
    }
  }

  getState() {
    return this.state.constructor.name;
  }
}

// Usage
const player = new MediaPlayer();
console.log(player.getState()); // IdleState

player.play();
console.log(player.getState()); // PlayingState

player.pause();
console.log(player.getState()); // PausedState

player.play();
console.log(player.getState()); // PlayingState

player.stop();
console.log(player.getState()); // IdleState
```

### Strategy Pattern

**Intent**: Define family of algorithms, encapsulate each one, make them interchangeable.

```javascript
class Strategy {
  execute(data) {
    throw new Error('Must implement execute');
  }
}

class BubbleSortStrategy extends Strategy {
  execute(data) {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSortStrategy extends Strategy {
  execute(data) {
    if (data.length <= 1) return data;
    
    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter(x => x < pivot);
    const middle = data.filter(x => x === pivot);
    const right = data.filter(x => x > pivot);
    
    return [...this.execute(left), ...middle, ...this.execute(right)];
  }
}

class MergeSortStrategy extends Strategy {
  execute(data) {
    if (data.length <= 1) return data;
    
    const mid = Math.floor(data.length / 2);
    const left = this.execute(data.slice(0, mid));
    const right = this.execute(data.slice(mid));
    
    return this.merge(left, right);
  }

  merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(data) {
    return this.strategy.execute(data);
  }
}

// Usage
const data = [5, 2, 8, 1, 9, 3];

const sorter = new Sorter(new QuickSortStrategy());
console.log(sorter.sort(data)); // [1, 2, 3, 5, 8, 9]

sorter.setStrategy(new MergeSortStrategy());
console.log(sorter.sort(data)); // [1, 2, 3, 5, 8, 9]
```

### Template Method Pattern

**Intent**: Define skeleton of algorithm, let subclasses override specific steps.

```javascript
class DataProcessor {
  process(data) {
    const loaded = this.loadData(data);
    const validated = this.validateData(loaded);
    const transformed = this.transformData(validated);
    const saved = this.saveData(transformed);
    return saved;
  }

  loadData(data) {
    console.log('Loading data...');
    return data;
  }

  validateData(data) {
    throw new Error('Must implement validateData');
  }

  transformData(data) {
    throw new Error('Must implement transformData');
  }

  saveData(data) {
    console.log('Saving data...');
    return data;
  }
}

class CSVProcessor extends DataProcessor {
  validateData(data) {
    console.log('Validating CSV data');
    if (!data || data.length === 0) {
      throw new Error('Invalid CSV data');
    }
    return data;
  }

  transformData(data) {
    console.log('Transforming CSV to JSON');
    return data.split('\n').map(row => {
      const [id, name, value] = row.split(',');
      return { id, name, value };
    });
  }
}

class JSONProcessor extends DataProcessor {
  validateData(data) {
    console.log('Validating JSON data');
    try {
      JSON.parse(data);
      return data;
    } catch (e) {
      throw new Error('Invalid JSON data');
    }
  }

  transformData(data) {
    console.log('Transforming JSON');
    const parsed = JSON.parse(data);
    return parsed.map(item => ({
      ...item,
      processed: true
    }));
  }
}

// Usage
const csvProcessor = new CSVProcessor();
const result1 = csvProcessor.process('1,Alice,100\n2,Bob,200');

const jsonProcessor = new JSONProcessor();
const result2 = jsonProcessor.process('[{"id":1,"name":"Alice"}]');
```

### Visitor Pattern

**Intent**: Separate algorithm from object structure it operates on.

```javascript
class Visitor {
  visitCircle(circle) {
    throw new Error('Must implement visitCircle');
  }

  visitRectangle(rectangle) {
    throw new Error('Must implement visitRectangle');
  }

  visitTriangle(triangle) {
    throw new Error('Must implement visitTriangle');
  }
}

class Shape {
  accept(visitor) {
    throw new Error('Must implement accept');
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  accept(visitor) {
    return visitor.visitCircle(this);
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  accept(visitor) {
    return visitor.visitRectangle(this);
  }
}

class Triangle extends Shape {
  constructor(base, height) {
    super();
    this.base = base;
    this.height = height;
  }

  accept(visitor) {
    return visitor.visitTriangle(this);
  }
}

class AreaCalculator extends Visitor {
  visitCircle(circle) {
    return Math.PI * circle.radius ** 2;
  }

  visitRectangle(rectangle) {
    return rectangle.width * rectangle.height;
  }

  visitTriangle(triangle) {
    return (triangle.base * triangle.height) / 2;
  }
}

class PerimeterCalculator extends Visitor {
  visitCircle(circle) {
    return 2 * Math.PI * circle.radius;
  }

  visitRectangle(rectangle) {
    return 2 * (rectangle.width + rectangle.height);
  }

  visitTriangle(triangle) {
    // Assuming equilateral for simplicity
    return 3 * triangle.base;
  }
}

// Usage
const shapes = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4)
];

const areaCalc = new AreaCalculator();
const perimeterCalc = new PerimeterCalculator();

shapes.forEach(shape => {
  console.log(`Area: ${shape.accept(areaCalc)}`);
  console.log(`Perimeter: ${shape.accept(perimeterCalc)}`);
});
```

## Summary

Advanced design patterns provide proven solutions to common software design problems:

**Creational**: Abstract Factory, Builder, Prototype, Object Pool
**Structural**: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
**Behavioral**: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor

These patterns enable:
- Code reusability and maintainability
- Loose coupling and high cohesion
- Flexibility and extensibility
- Clear separation of concerns
- Testable and scalable architectures

Understanding and applying these patterns is essential for building robust, maintainable frontend applications.
