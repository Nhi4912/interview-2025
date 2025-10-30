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