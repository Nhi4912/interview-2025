# Design Patterns / Mẫu Thiết Kế
## Computer Science Fundamentals - Chapter 4 / Khoa Học Máy Tính Cơ Bản - Chương 4

[← Previous: Complexity Analysis](./03-complexity-analysis.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Overview / Tổng Quan

**English:** Design patterns are reusable solutions to common software design problems. Understanding these patterns is essential for writing maintainable, scalable code and succeeding in senior-level technical interviews.

**Tiếng Việt:** Mẫu thiết kế là các giải pháp có thể tái sử dụng cho các vấn đề thiết kế phần mềm phổ biến. Hiểu các mẫu này là cần thiết để viết code có thể bảo trì, mở rộng và thành công trong phỏng vấn kỹ thuật cấp cao.

---

## Table of Contents / Mục Lục

1. [Creational Patterns / Mẫu Khởi Tạo](#creational-patterns--mẫu-khởi-tạo)
2. [Structural Patterns / Mẫu Cấu Trúc](#structural-patterns--mẫu-cấu-trúc)
3. [Behavioral Patterns / Mẫu Hành Vi](#behavioral-patterns--mẫu-hành-vi)
4. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Creational Patterns / Mẫu Khởi Tạo

### Singleton Pattern / Mẫu Singleton

**Theory / Lý Thuyết:**
Ensures a class has only one instance and provides global access point.

**Tiếng Việt:** Đảm bảo một lớp chỉ có một instance và cung cấp điểm truy cập toàn cục.

```typescript
class Singleton {
  private static instance: Singleton;
  private constructor() {
    // Private constructor prevents instantiation
    // Constructor riêng ngăn khởi tạo
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public someMethod(): void {
    console.log('Singleton method called');
  }
}

// Usage / Sử dụng
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true

// Practical example: Database connection
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: any;

  private constructor() {
    this.connection = this.createConnection();
  }

  private createConnection(): any {
    console.log('Creating database connection...');
    return { connected: true };
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public query(sql: string): void {
    console.log(`Executing: ${sql}`);
  }
}
```

### Factory Pattern / Mẫu Factory

**Theory / Lý Thuyết:**
Creates objects without specifying exact class to create.

**Tiếng Việt:** Tạo đối tượng mà không chỉ định lớp chính xác để tạo.

```typescript
// Product interface / Giao diện sản phẩm
interface Vehicle {
  drive(): void;
  stop(): void;
}

// Concrete products / Sản phẩm cụ thể
class Car implements Vehicle {
  drive(): void {
    console.log('Driving a car / Lái xe ô tô');
  }
  stop(): void {
    console.log('Stopping car / Dừng xe ô tô');
  }
}

class Motorcycle implements Vehicle {
  drive(): void {
    console.log('Riding a motorcycle / Lái xe máy');
  }
  stop(): void {
    console.log('Stopping motorcycle / Dừng xe máy');
  }
}

class Truck implements Vehicle {
  drive(): void {
    console.log('Driving a truck / Lái xe tải');
  }
  stop(): void {
    console.log('Stopping truck / Dừng xe tải');
  }
}

// Factory / Nhà máy
class VehicleFactory {
  static createVehicle(type: string): Vehicle {
    switch (type.toLowerCase()) {
      case 'car':
        return new Car();
      case 'motorcycle':
        return new Motorcycle();
      case 'truck':
        return new Truck();
      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}

// Usage / Sử dụng
const car = VehicleFactory.createVehicle('car');
car.drive(); // "Driving a car"

const motorcycle = VehicleFactory.createVehicle('motorcycle');
motorcycle.drive(); // "Riding a motorcycle"
```

### Builder Pattern / Mẫu Builder

**Theory / Lý Thuyết:**
Constructs complex objects step by step.

**Tiếng Việt:** Xây dựng các đối tượng phức tạp từng bước.

```typescript
class User {
  constructor(
    public name: string,
    public email: string,
    public age?: number,
    public address?: string,
    public phone?: string
  ) {}
}

class UserBuilder {
  private name: string = '';
  private email: string = '';
  private age?: number;
  private address?: string;
  private phone?: string;

  setName(name: string): UserBuilder {
    this.name = name;
    return this;
  }

  setEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  setAge(age: number): UserBuilder {
    this.age = age;
    return this;
  }

  setAddress(address: string): UserBuilder {
    this.address = address;
    return this;
  }

  setPhone(phone: string): UserBuilder {
    this.phone = phone;
    return this;
  }

  build(): User {
    return new User(this.name, this.email, this.age, this.address, this.phone);
  }
}

// Usage / Sử dụng
const user = new UserBuilder()
  .setName('John Doe')
  .setEmail('john@example.com')
  .setAge(30)
  .setAddress('123 Main St')
  .build();

console.log(user);
```

---

## Structural Patterns / Mẫu Cấu Trúc

### Adapter Pattern / Mẫu Adapter

**Theory / Lý Thuyết:**
Allows incompatible interfaces to work together.

**Tiếng Việt:** Cho phép các giao diện không tương thích làm việc cùng nhau.

```typescript
// Old interface / Giao diện cũ
class OldPrinter {
  printOld(text: string): void {
    console.log(`Old printer: ${text}`);
  }
}

// New interface / Giao diện mới
interface ModernPrinter {
  print(text: string): void;
}

// Adapter / Bộ chuyển đổi
class PrinterAdapter implements ModernPrinter {
  constructor(private oldPrinter: OldPrinter) {}

  print(text: string): void {
    this.oldPrinter.printOld(text);
  }
}

// Usage / Sử dụng
const oldPrinter = new OldPrinter();
const adapter = new PrinterAdapter(oldPrinter);
adapter.print('Hello World'); // "Old printer: Hello World"
```

### Decorator Pattern / Mẫu Decorator

**Theory / Lý Thuyết:**
Adds new functionality to objects dynamically.

**Tiếng Việt:** Thêm chức năng mới vào đối tượng một cách động.

```typescript
// Component interface / Giao diện thành phần
interface Coffee {
  cost(): number;
  description(): string;
}

// Concrete component / Thành phần cụ thể
class SimpleCoffee implements Coffee {
  cost(): number {
    return 10;
  }

  description(): string {
    return 'Simple coffee / Cà phê đơn giản';
  }
}

// Decorator base / Cơ sở decorator
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  abstract cost(): number;
  abstract description(): string;
}

// Concrete decorators / Decorator cụ thể
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return `${this.coffee.description()} + milk / sữa`;
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 1;
  }

  description(): string {
    return `${this.coffee.description()} + sugar / đường`;
  }
}

class WhipDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 3;
  }

  description(): string {
    return `${this.coffee.description()} + whip / kem`;
  }
}

// Usage / Sử dụng
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()}: $${coffee.cost()}`);
// "Simple coffee: $10"

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// "Simple coffee + milk: $12"

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// "Simple coffee + milk + sugar: $13"

coffee = new WhipDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// "Simple coffee + milk + sugar + whip: $16"
```

### Proxy Pattern / Mẫu Proxy

**Theory / Lý Thuyết:**
Provides placeholder for another object to control access.

**Tiếng Việt:** Cung cấp trình giữ chỗ cho đối tượng khác để kiểm soát truy cập.

```typescript
interface Image {
  display(): void;
}

class RealImage implements Image {
  constructor(private filename: string) {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Loading image: ${this.filename}`);
  }

  display(): void {
    console.log(`Displaying image: ${this.filename}`);
  }
}

class ProxyImage implements Image {
  private realImage: RealImage | null = null;

  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// Usage / Sử dụng
const image = new ProxyImage('photo.jpg');
// Image not loaded yet / Hình ảnh chưa được tải

image.display();
// "Loading image: photo.jpg"
// "Displaying image: photo.jpg"

image.display();
// "Displaying image: photo.jpg" (no loading / không tải)
```

---

## Behavioral Patterns / Mẫu Hành Vi

### Observer Pattern / Mẫu Observer

**Theory / Lý Thuyết:**
Defines one-to-many dependency between objects.

**Tiếng Việt:** Định nghĩa phụ thuộc một-nhiều giữa các đối tượng.

```typescript
interface Observer {
  update(data: any): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class NewsAgency implements Subject {
  private observers: Observer[] = [];
  private news: string = '';

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.news);
    }
  }

  setNews(news: string): void {
    this.news = news;
    this.notify();
  }
}

class NewsChannel implements Observer {
  constructor(private name: string) {}

  update(news: string): void {
    console.log(`${this.name} received news: ${news}`);
  }
}

// Usage / Sử dụng
const agency = new NewsAgency();

const channel1 = new NewsChannel('CNN');
const channel2 = new NewsChannel('BBC');
const channel3 = new NewsChannel('FOX');

agency.attach(channel1);
agency.attach(channel2);
agency.attach(channel3);

agency.setNews('Breaking news! / Tin nóng!');
// "CNN received news: Breaking news!"
// "BBC received news: Breaking news!"
// "FOX received news: Breaking news!"

agency.detach(channel2);
agency.setNews('Another update / Cập nhật khác');
// "CNN received news: Another update"
// "FOX received news: Another update"
```

### Strategy Pattern / Mẫu Strategy

**Theory / Lý Thuyết:**
Defines family of algorithms, encapsulates each one, makes them interchangeable.

**Tiếng Việt:** Định nghĩa họ các thuật toán, đóng gói từng cái, làm cho chúng có thể thay thế lẫn nhau.

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string
  ) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using PayPal account ${this.email}`);
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): void {
    console.log(`Paid $${amount} using Crypto wallet ${this.walletAddress}`);
  }
}

class ShoppingCart {
  private items: Array<{ name: string; price: number }> = [];
  private paymentStrategy?: PaymentStrategy;

  addItem(name: string, price: number): void {
    this.items.push({ name, price });
  }

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(): void {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    
    if (!this.paymentStrategy) {
      throw new Error('Payment strategy not set');
    }

    this.paymentStrategy.pay(total);
  }
}

// Usage / Sử dụng
const cart = new ShoppingCart();
cart.addItem('Laptop', 999);
cart.addItem('Mouse', 29);

// Pay with credit card / Thanh toán bằng thẻ tín dụng
cart.setPaymentStrategy(new CreditCardPayment('1234567890123456', '123'));
cart.checkout(); // "Paid $1028 using Credit Card ending in 3456"

// Pay with PayPal / Thanh toán bằng PayPal
cart.setPaymentStrategy(new PayPalPayment('user@example.com'));
cart.checkout(); // "Paid $1028 using PayPal account user@example.com"
```

### Command Pattern / Mẫu Command

**Theory / Lý Thuyết:**
Encapsulates request as object, allowing parameterization and queuing.

**Tiếng Việt:** Đóng gói yêu cầu như đối tượng, cho phép tham số hóa và xếp hàng.

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  turnOn(): void {
    console.log('Light is ON / Đèn BẬT');
  }

  turnOff(): void {
    console.log('Light is OFF / Đèn TẮT');
  }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn();
  }

  undo(): void {
    this.light.turnOff();
  }
}

class LightOffCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOff();
  }

  undo(): void {
    this.light.turnOn();
  }
}

class RemoteControl {
  private history: Command[] = [];

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
}

// Usage / Sử dụng
const light = new Light();
const lightOn = new LightOnCommand(light);
const lightOff = new LightOffCommand(light);

const remote = new RemoteControl();

remote.executeCommand(lightOn);  // "Light is ON"
remote.executeCommand(lightOff); // "Light is OFF"
remote.undo();                   // "Light is ON"
remote.undo();                   // "Light is OFF"
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Question 1: When to use Singleton?

**English Answer:**
Use Singleton when:
- Need exactly one instance (database connection, logger)
- Global access point required
- Lazy initialization beneficial

Avoid when:
- Testing is difficult (global state)
- Violates Single Responsibility Principle
- Can use dependency injection instead

**Tiếng Việt:**
Sử dụng Singleton khi:
- Cần chính xác một instance (kết nối cơ sở dữ liệu, logger)
- Yêu cầu điểm truy cập toàn cục
- Khởi tạo lười có lợi

Tránh khi:
- Kiểm thử khó khăn (trạng thái toàn cục)
- Vi phạm Nguyên tắc Trách nhiệm Đơn
- Có thể sử dụng dependency injection thay thế

### Question 2: Factory vs Builder?

**English Answer:**
- **Factory**: Creates objects of different types, simple construction
- **Builder**: Constructs complex objects step-by-step, many optional parameters

**Tiếng Việt:**
- **Factory**: Tạo đối tượng các loại khác nhau, xây dựng đơn giản
- **Builder**: Xây dựng đối tượng phức tạp từng bước, nhiều tham số tùy chọn

### Question 3: Observer vs Pub/Sub?

**English Answer:**
- **Observer**: Direct coupling, subject knows observers
- **Pub/Sub**: Loose coupling, event bus mediates, publishers don't know subscribers

**Tiếng Việt:**
- **Observer**: Kết nối trực tiếp, chủ thể biết người quan sát
- **Pub/Sub**: Kết nối lỏng lẻo, bus sự kiện trung gian, nhà xuất bản không biết người đăng ký

---

## Key Takeaways / Điểm Chính

**English:**
1. Design patterns solve recurring design problems
2. Creational patterns handle object creation
3. Structural patterns organize object relationships
4. Behavioral patterns manage object communication
5. Choose patterns based on problem context
6. Don't overuse patterns - keep it simple

**Tiếng Việt:**
1. Mẫu thiết kế giải quyết các vấn đề thiết kế lặp lại
2. Mẫu khởi tạo xử lý tạo đối tượng
3. Mẫu cấu trúc tổ chức mối quan hệ đối tượng
4. Mẫu hành vi quản lý giao tiếp đối tượng
5. Chọn mẫu dựa trên ngữ cảnh vấn đề
6. Đừng lạm dụng mẫu - giữ đơn giản

---

[← Previous: Complexity Analysis](./03-complexity-analysis.md) | [Back to Table of Contents](../../00-table-of-contents.md)
