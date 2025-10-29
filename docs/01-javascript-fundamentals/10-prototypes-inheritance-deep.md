# Prototypes & Inheritance - Deep Dive
## Understanding JavaScript's Prototype Chain

**English:** Prototypes are the mechanism by which JavaScript objects inherit features from one another. Every object has a private property linking to another object called its prototype.

**Tiếng Việt:** Prototype là cơ chế mà các đối tượng JavaScript kế thừa tính năng từ nhau. Mọi đối tượng đều có thuộc tính riêng liên kết đến đối tượng khác gọi là prototype của nó.

## Prototype Chain Theory

### Understanding [[Prototype]]

Every JavaScript object has an internal property `[[Prototype]]` (accessed via `__proto__` or `Object.getPrototypeOf()`).

**Chain Structure:**
```
object → Object.prototype → null
```

**Lookup Process:**
1. Check object's own properties
2. Check prototype's properties
3. Check prototype's prototype
4. Continue until null

### Constructor Functions

**Theory:** Constructor functions create objects with shared prototype.

**Pattern:**
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};
```

**Memory Efficiency:**
- Methods on prototype shared by all instances
- Properties on instance unique per object
- Reduces memory footprint

### Prototype vs __proto__

**Function.prototype:**
- Property of constructor function
- Object that becomes prototype of instances
- Where shared methods defined

**instance.__proto__:**
- Property of object instances
- References the prototype object
- Links to constructor's prototype

### Class Syntax (ES6)

**Theory:** Classes are syntactic sugar over prototypes.

**Under the Hood:**
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

// Equivalent to:
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};
```

## Inheritance Patterns

### Prototypal Inheritance

**Theory:** Objects inherit directly from other objects.

**Object.create() Pattern:**
```javascript
const animal = {
  speak() {
    return 'Animal sound';
  }
};

const dog = Object.create(animal);
dog.bark = function() {
  return 'Woof!';
};
```

**Benefits:**
- Simple and direct
- No constructor needed
- Flexible inheritance

### Classical Inheritance (Constructor)

**Theory:** Use constructor functions with prototype chain.

**Pattern:**
```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  return `${this.name} is eating`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return 'Woof!';
};
```

**Steps:**
1. Call parent constructor with `call()`
2. Set child prototype to parent prototype
3. Fix constructor reference
4. Add child methods

### ES6 Class Inheritance

**Theory:** Extends keyword creates prototype chain.

**Syntax:**
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    return `${this.name} is eating`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    return 'Woof!';
  }
}
```

**Super Keyword:**
- Calls parent constructor
- Accesses parent methods
- Must call before using `this`

## Property Lookup

### Own vs Inherited Properties

**hasOwnProperty():**
- Checks if property exists on object itself
- Doesn't check prototype chain
- Returns boolean

**in Operator:**
- Checks object and prototype chain
- Returns true if found anywhere
- Includes inherited properties

**Object.keys() vs Object.getOwnPropertyNames():**
- keys(): Enumerable own properties
- getOwnPropertyNames(): All own properties

### Property Shadowing

**Theory:** Own property hides prototype property with same name.

**Behavior:**
```javascript
const parent = { x: 1 };
const child = Object.create(parent);
child.x = 2;

console.log(child.x); // 2 (own property)
console.log(parent.x); // 1 (unchanged)
delete child.x;
console.log(child.x); // 1 (now sees parent)
```

## Performance Considerations

### Prototype Lookup Cost

**Theory:** Prototype chain traversal has performance cost.

**Optimization:**
- Keep chains shallow
- Cache frequently accessed properties
- Use own properties for hot paths

### Memory vs Speed Trade-off

**Shared Methods (Prototype):**
- Lower memory usage
- Lookup overhead
- Good for many instances

**Own Methods:**
- Higher memory usage
- Faster access
- Good for few instances

## Common Patterns

### Mixin Pattern

**Theory:** Combine properties from multiple sources.

**Implementation:**
```javascript
function mixin(target, ...sources) {
  Object.assign(target, ...sources);
  return target;
}

const canEat = {
  eat() { return 'eating'; }
};

const canWalk = {
  walk() { return 'walking'; }
};

class Person {}
mixin(Person.prototype, canEat, canWalk);
```

### Factory Pattern

**Theory:** Function returns new objects without `new`.

**Pattern:**
```javascript
function createPerson(name) {
  return {
    name,
    greet() {
      return `Hello, ${this.name}`;
    }
  };
}
```

**Benefits:**
- No `new` keyword needed
- Flexible object creation
- Can return different types

## Interview Questions

**Q: What is the prototype chain?**

A: The prototype chain is the mechanism for inheritance in JavaScript. When accessing a property, JavaScript first checks the object itself, then its prototype, then the prototype's prototype, continuing until reaching null.

**Q: Difference between __proto__ and prototype?**

A: `prototype` is a property of constructor functions that becomes the `__proto__` of instances created by that constructor. `__proto__` is the actual object used in the lookup chain.

**Q: How does class inheritance work?**

A: Classes use prototypal inheritance under the hood. The `extends` keyword sets up the prototype chain, and `super()` calls the parent constructor.

**Q: What is Object.create()?**

A: Object.create() creates a new object with the specified prototype object. It's the most direct way to implement prototypal inheritance.

**Q: How to check if property is own vs inherited?**

A: Use `hasOwnProperty()` to check if property exists on object itself, or `in` operator to check including prototype chain.

---

[← Back to Advanced Concepts](./08-advanced-concepts.md) | [Next: ES6+ Features →](./07-es6-features.md)
