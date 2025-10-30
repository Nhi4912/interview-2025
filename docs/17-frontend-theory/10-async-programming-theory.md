# Async Programming Theory - Complete Guide
# Lý Thuyết Lập Trình Bất Đồng Bộ - Hướng Dẫn Đầy Đủ

## Table of Contents / Mục Lục

### Part 1: Async Fundamentals
1. Synchronous vs Asynchronous
2. Blocking vs Non-Blocking
3. Concurrency vs Parallelism
4. Event Loop Theory
5. Call Stack and Task Queue

### Part 2: Async Patterns
6. Callbacks
7. Promises
8. Async/Await
9. Generators
10. Observables

### Part 3: Advanced Concepts
11. Promise Combinators
12. Error Handling Strategies
13. Cancellation Patterns
14. Retry Logic
15. Rate Limiting and Throttling

### Part 4: Real-World Applications
16. Data Fetching
17. File Operations
18. WebSockets
19. Server-Sent Events
20. Web Workers

---

## Part 1: Async Fundamentals

### 1. Synchronous vs Asynchronous
### 1. Đồng Bộ vs Bất Đồng Bộ

**English:**

Understanding the difference between synchronous and asynchronous code is fundamental to JavaScript programming.

**Synchronous Execution:**

Synchronous code executes line by line, in order, blocking until each operation completes.

**Characteristics:**
- Sequential execution
- Blocking operations
- Predictable order
- Simple to reason about
- Can freeze UI

**Example Flow:**
```
Line 1 executes → completes
    ↓
Line 2 executes → completes
    ↓
Line 3 executes → completes
```

**Theory: Synchronous Model**

In synchronous execution:
1. Each operation must complete before next starts
2. CPU waits for I/O operations
3. Simple mental model
4. Inefficient for I/O-bound tasks
5. Can't handle multiple operations simultaneously

**Advantages:**
- Easy to understand
- Predictable flow
- Simple debugging
- Clear error handling

**Disadvantages:**
- Blocks execution
- Wastes CPU time
- Poor user experience
- Can't handle concurrent operations

**Asynchronous Execution:**

Asynchronous code allows operations to run without blocking, enabling concurrent execution.

**Characteristics:**
- Non-blocking operations
- Concurrent execution
- Callbacks/Promises for results
- Complex to reason about
- Responsive UI

**Example Flow:**
```
Line 1 starts → continues immediately
Line 2 starts → continues immediately
Line 3 starts → continues immediately
    ↓
Results arrive in any order
```

**Theory: Asynchronous Model**

In asynchronous execution:
1. Operations start but don't wait for completion
2. CPU can do other work while waiting
3. Results handled via callbacks/promises
4. Efficient for I/O-bound tasks
5. Can handle multiple operations simultaneously

**Advantages:**
- Non-blocking
- Efficient CPU usage
- Better user experience
- Handles concurrency
- Scalable

**Disadvantages:**
- Complex to understand
- Callback hell
- Race conditions
- Error handling complexity
- Debugging challenges

**When to Use Each:**

**Use Synchronous:**
- CPU-bound operations
- Simple scripts
- Sequential dependencies
- When order matters critically

**Use Asynchronous:**
- I/O operations (network, file system)
- User interactions
- Timers
- Multiple independent operations
- Long-running tasks

**Theory: I/O vs CPU Bound**

**I/O Bound:**
- Waiting for external resources
- Network requests
- File operations
- Database queries
- Benefit from async

**CPU Bound:**
- Heavy computations
- Data processing
- Algorithms
- Don't benefit from async (use Web Workers instead)

**JavaScript's Async Nature:**

JavaScript is:
- Single-threaded
- Non-blocking
- Asynchronous by design
- Event-driven

**Theory: Why JavaScript is Async**

JavaScript runs in browsers where:
1. UI must remain responsive
2. Network operations are common
3. User interactions happen anytime
4. Multiple events occur simultaneously

Async model enables:
- Responsive UI
- Concurrent operations
- Efficient resource usage
- Better user experience

**Vietnamese:**

Hiểu sự khác biệt giữa synchronous và asynchronous code là nền tảng của JavaScript programming.

**Synchronous Execution:**

Code synchronous thực thi từng dòng, theo thứ tự, blocking cho đến khi mỗi operation hoàn thành.

**Đặc điểm:**
- Sequential execution
- Blocking operations
- Thứ tự predictable
- Đơn giản để reason
- Có thể freeze UI

**Lý Thuyết: Synchronous Model**

Trong synchronous execution:
1. Mỗi operation phải complete trước khi next starts
2. CPU chờ I/O operations
3. Mental model đơn giản
4. Không hiệu quả cho I/O-bound tasks
5. Không thể handle multiple operations simultaneously

**Asynchronous Execution:**

Code asynchronous cho phép operations chạy không blocking, enabling concurrent execution.

**Đặc điểm:**
- Non-blocking operations
- Concurrent execution
- Callbacks/Promises cho results
- Phức tạp để reason
- UI responsive

**Lý Thuyết: Asynchronous Model**

Trong asynchronous execution:
1. Operations start nhưng không chờ completion
2. CPU có thể làm việc khác khi chờ
3. Results handled qua callbacks/promises
4. Hiệu quả cho I/O-bound tasks
5. Có thể handle multiple operations simultaneously

**Khi Nào Dùng:**

**Synchronous:**
- CPU-bound operations
- Scripts đơn giản
- Sequential dependencies
- Khi order quan trọng

**Asynchronous:**
- I/O operations
- User interactions
- Timers
- Multiple independent operations
- Long-running tasks

---

### 2. Blocking vs Non-Blocking
### 2. Blocking vs Non-Blocking

**English:**

Blocking and non-blocking refer to how operations handle waiting for results.

**Blocking Operations:**

Blocking operations halt execution until they complete.

**Characteristics:**
- Stops execution
- Waits for result
- Synchronous by nature
- Simple to use
- Can cause performance issues

**Examples:**
- Synchronous file reads
- Alert dialogs
- Synchronous AJAX (deprecated)
- Heavy computations

**Theory: Blocking Behavior**

When an operation blocks:
1. Current thread stops
2. No other code can run
3. UI freezes (in browser)
4. Resources wasted
5. Poor user experience

**Impact on Performance:**

Blocking operations:
- Reduce throughput
- Increase latency
- Waste CPU cycles
- Degrade user experience
- Limit scalability

**Non-Blocking Operations:**

Non-blocking operations return immediately, allowing execution to continue.

**Characteristics:**
- Returns immediately
- Result delivered later
- Asynchronous by nature
- Complex to use
- Better performance

**Examples:**
- Asynchronous file reads
- Fetch API
- setTimeout/setInterval
- Event listeners
- Promises

**Theory: Non-Blocking Behavior**

When an operation is non-blocking:
1. Operation starts
2. Control returns immediately
3. Other code can run
4. Result delivered via callback/promise
5. Efficient resource usage

**Impact on Performance:**

Non-blocking operations:
- Increase throughput
- Reduce latency
- Efficient CPU usage
- Better user experience
- Scalable

**Blocking vs Non-Blocking in JavaScript:**

JavaScript is designed to be non-blocking:
- Single-threaded event loop
- Async APIs (setTimeout, fetch, etc.)
- Event-driven architecture
- Callbacks and promises

**Theory: Why Non-Blocking Matters**

In browsers:
- UI runs on main thread
- Blocking freezes UI
- Users can't interact
- Poor experience

Non-blocking ensures:
- Responsive UI
- Smooth animations
- Immediate feedback
- Better UX

**Making Blocking Code Non-Blocking:**

**Technique 1: Web Workers**
```
Move heavy computation to worker thread
Main thread remains responsive
```

**Technique 2: Break into Chunks**
```
Split work into small pieces
Use setTimeout between chunks
Allows UI updates
```

**Technique 3: Use Async APIs**
```
Replace sync APIs with async versions
Use callbacks/promises for results
```

**Theory: Cooperative Multitasking**

JavaScript uses cooperative multitasking:
- Code must yield control
- Long-running tasks must be split
- Event loop schedules tasks
- Developers responsible for yielding

**Vietnamese:**

Blocking và non-blocking đề cập đến cách operations handle waiting cho results.

**Blocking Operations:**

Blocking operations dừng execution cho đến khi complete.

**Đặc điểm:**
- Stops execution
- Chờ result
- Synchronous by nature
- Đơn giản để dùng
- Có thể gây performance issues

**Lý Thuyết: Blocking Behavior**

Khi operation blocks:
1. Current thread stops
2. Không code nào khác chạy được
3. UI freezes (trong browser)
4. Resources wasted
5. Poor user experience

**Non-Blocking Operations:**

Non-blocking operations return immediately, cho phép execution continue.

**Đặc điểm:**
- Returns immediately
- Result delivered sau
- Asynchronous by nature
- Phức tạp để dùng
- Performance tốt hơn

**Lý Thuyết: Non-Blocking Behavior**

Khi operation non-blocking:
1. Operation starts
2. Control returns ngay
3. Code khác có thể chạy
4. Result delivered qua callback/promise
5. Efficient resource usage

**Tại Sao Non-Blocking Quan Trọng:**

Trong browsers:
- UI chạy trên main thread
- Blocking freezes UI
- Users không thể interact
- Poor experience

Non-blocking đảm bảo:
- UI responsive
- Animations smooth
- Immediate feedback
- Better UX

---

### 3. Concurrency vs Parallelism
### 3. Concurrency vs Parallelism

**English:**

Concurrency and parallelism are often confused but represent different concepts.

**Concurrency:**

Concurrency is about dealing with multiple things at once. It's about structure.

**Definition:**
Concurrency is the composition of independently executing processes. Multiple tasks make progress, but not necessarily simultaneously.

**Characteristics:**
- Multiple tasks in progress
- Tasks interleaved
- Single or multiple cores
- About structure
- Logical concept

**Example:**
```
Task A: ████░░░░████░░░░████
Task B: ░░░░████░░░░████░░░░
Time:   →→→→→→→→→→→→→→→→→→→→

Tasks alternate, making progress
```

**Theory: Concurrency Model**

Concurrency enables:
1. Multiple tasks in progress
2. Context switching between tasks
3. Efficient resource usage
4. Responsive systems
5. Better organization

**Concurrency in JavaScript:**

JavaScript achieves concurrency through:
- Event loop
- Callbacks
- Promises
- Async/await
- Task queue

**Theory: JavaScript Concurrency**

JavaScript is:
- Single-threaded
- Concurrent (not parallel)
- Event-driven
- Non-blocking

Concurrency achieved via:
1. Event loop schedules tasks
2. Async operations don't block
3. Multiple operations in progress
4. Results handled asynchronously

**Parallelism:**

Parallelism is about doing multiple things at once. It's about execution.

**Definition:**
Parallelism is the simultaneous execution of multiple tasks. Multiple tasks execute at the exact same time.

**Characteristics:**
- Multiple tasks executing simultaneously
- Requires multiple cores
- About execution
- Physical concept
- True simultaneous execution

**Example:**
```
Task A: ████████████████████
Task B: ████████████████████
Time:   →→→→→→→→→→→→→→→→→→→→

Tasks execute simultaneously
```

**Theory: Parallelism Model**

Parallelism requires:
1. Multiple CPU cores
2. Tasks that can run independently
3. No shared state (or proper synchronization)
4. Parallel execution environment

**Parallelism in JavaScript:**

JavaScript achieves parallelism through:
- Web Workers
- Worker threads (Node.js)
- SharedArrayBuffer
- Atomics

**Theory: JavaScript Parallelism**

JavaScript main thread is single-threaded, but:
- Web Workers run in separate threads
- True parallel execution
- No shared memory (message passing)
- Isolated contexts

**Concurrency vs Parallelism:**

| Aspect | Concurrency | Parallelism |
|--------|-------------|-------------|
| Definition | Multiple tasks in progress | Multiple tasks executing simultaneously |
| Execution | Interleaved | Simultaneous |
| Cores | Single or multiple | Multiple required |
| JavaScript | Event loop | Web Workers |
| Focus | Structure | Execution |
| Goal | Responsiveness | Performance |

**Theory: Relationship**

Concurrency and parallelism are related but different:
- Concurrency is about structure (how to organize)
- Parallelism is about execution (how to run)
- Can have concurrency without parallelism
- Parallelism requires concurrency
- Concurrency enables parallelism

**When to Use Each:**

**Use Concurrency:**
- I/O-bound tasks
- Event handling
- User interactions
- Network requests
- Responsive UI

**Use Parallelism:**
- CPU-bound tasks
- Heavy computations
- Data processing
- Image/video processing
- Scientific calculations

**Theory: Amdahl's Law**

Amdahl's Law limits parallel speedup:
```
Speedup = 1 / ((1 - P) + P/N)

P = Portion that can be parallelized
N = Number of processors
```

Key insight:
- Serial portions limit speedup
- Not all code can be parallelized
- Diminishing returns with more cores

**Vietnamese:**

Concurrency và parallelism thường bị nhầm lẫn nhưng đại diện cho concepts khác nhau.

**Concurrency:**

Concurrency là về dealing với multiple things cùng lúc. Đó là về structure.

**Định nghĩa:**
Concurrency là composition của independently executing processes. Multiple tasks make progress, nhưng không nhất thiết simultaneously.

**Đặc điểm:**
- Multiple tasks in progress
- Tasks interleaved
- Single hoặc multiple cores
- Về structure
- Logical concept

**Lý Thuyết: Concurrency Model**

Concurrency enables:
1. Multiple tasks in progress
2. Context switching giữa tasks
3. Efficient resource usage
4. Responsive systems
5. Better organization

**Parallelism:**

Parallelism là về doing multiple things cùng lúc. Đó là về execution.

**Định nghĩa:**
Parallelism là simultaneous execution của multiple tasks. Multiple tasks execute cùng exact same time.

**Đặc điểm:**
- Multiple tasks executing simultaneously
- Requires multiple cores
- Về execution
- Physical concept
- True simultaneous execution

**So Sánh:**

| Khía cạnh | Concurrency | Parallelism |
|-----------|-------------|-------------|
| Định nghĩa | Multiple tasks in progress | Multiple tasks simultaneously |
| Execution | Interleaved | Simultaneous |
| Cores | Single hoặc multiple | Multiple required |
| JavaScript | Event loop | Web Workers |

**Khi Nào Dùng:**

**Concurrency:**
- I/O-bound tasks
- Event handling
- User interactions
- Network requests

**Parallelism:**
- CPU-bound tasks
- Heavy computations
- Data processing
- Image/video processing

