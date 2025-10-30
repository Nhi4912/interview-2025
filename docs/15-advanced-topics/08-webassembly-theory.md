# WebAssembly Theory
## Understanding Low-Level Web Performance

**English:** WebAssembly (Wasm) is a binary instruction format for a stack-based virtual machine, designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.

**Tiếng Việt:** WebAssembly (Wasm) là định dạng lệnh nhị phân cho máy ảo dựa trên ngăn xếp, được thiết kế như một mục tiêu biên dịch di động cho các ngôn ngữ lập trình, cho phép triển khai trên web cho ứng dụng client và server.

## Table of Contents
1. [WebAssembly Fundamentals](#webassembly-fundamentals)
2. [Architecture](#architecture)
3. [Compilation](#compilation)
4. [JavaScript Integration](#javascript-integration)
5. [Memory Management](#memory-management)
6. [Performance](#performance)
7. [Use Cases](#use-cases)
8. [Tools and Ecosystem](#tools-and-ecosystem)
9. [Security](#security)
10. [Future](#future)

## WebAssembly Fundamentals

### What is WebAssembly?

**Definition:** Binary instruction format for stack-based virtual machine

**Key Characteristics:**
```
✅ Fast - Near-native performance
✅ Safe - Sandboxed execution
✅ Portable - Platform-independent
✅ Compact - Binary format
✅ Open - W3C standard
```

**Not a Replacement for JavaScript:**
```
WebAssembly complements JavaScript
- Compute-intensive tasks
- Performance-critical code
- Port existing C/C++/Rust code
- Games, video editing, CAD

JavaScript remains for:
- DOM manipulation
- Web APIs
- Async operations
- Rapid development
```

### Why WebAssembly?

**JavaScript Limitations:**
```javascript
// JavaScript - interpreted, dynamic typing
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Slow for compute-intensive tasks
// JIT compilation helps but has limits
```

**WebAssembly Benefits:**
```
- Compiled ahead of time
- Static typing
- Predictable performance
- No garbage collection pauses
- Smaller file sizes (binary)
```

## Architecture

### Stack Machine

**Concept:** Operations use implicit stack

**Example:**
```wasm
;; Add two numbers
local.get 0    ;; Push first parameter
local.get 1    ;; Push second parameter
i32.add        ;; Pop two, add, push result
```

**Stack Operations:**
```
Initial: []
local.get 0: [5]
local.get 1: [5, 3]
i32.add: [8]
```

### Module Structure

**WebAssembly Module:**
```wasm
(module
  ;; Type section
  (type $add_type (func (param i32 i32) (result i32)))
  
  ;; Function section
  (func $add (type $add_type)
    local.get 0
    local.get 1
    i32.add
  )
  
  ;; Export section
  (export "add" (func $add))
)
```

**Sections:**
```
1. Type - Function signatures
2. Import - Imported functions
3. Function - Function declarations
4. Table - Indirect function calls
5. Memory - Linear memory
6. Global - Global variables
7. Export - Exported functions
8. Start - Start function
9. Element - Table initialization
10. Code - Function bodies
11. Data - Memory initialization
```

### Value Types

**Numeric Types:**
```wasm
i32  ;; 32-bit integer
i64  ;; 64-bit integer
f32  ;; 32-bit float
f64  ;; 64-bit float
```

**Reference Types:**
```wasm
funcref  ;; Function reference
externref ;; External reference (any JS value)
```

### Instructions

**Numeric:**
```wasm
i32.add      ;; Addition
i32.sub      ;; Subtraction
i32.mul      ;; Multiplication
i32.div_s    ;; Signed division
i32.div_u    ;; Unsigned division
i32.rem_s    ;; Signed remainder
i32.and      ;; Bitwise AND
i32.or       ;; Bitwise OR
i32.xor      ;; Bitwise XOR
i32.shl      ;; Shift left
i32.shr_s    ;; Shift right (signed)
i32.shr_u    ;; Shift right (unsigned)
```

**Comparison:**
```wasm
i32.eq       ;; Equal
i32.ne       ;; Not equal
i32.lt_s     ;; Less than (signed)
i32.lt_u     ;; Less than (unsigned)
i32.gt_s     ;; Greater than (signed)
i32.gt_u     ;; Greater than (unsigned)
i32.le_s     ;; Less or equal (signed)
i32.le_u     ;; Less or equal (unsigned)
i32.ge_s     ;; Greater or equal (signed)
i32.ge_u     ;; Greater or equal (unsigned)
```

**Control Flow:**
```wasm
block        ;; Block
loop         ;; Loop
if/else      ;; Conditional
br           ;; Branch
br_if        ;; Conditional branch
br_table     ;; Branch table
return       ;; Return
call         ;; Function call
call_indirect ;; Indirect call
```

**Memory:**
```wasm
i32.load     ;; Load from memory
i32.store    ;; Store to memory
memory.size  ;; Get memory size
memory.grow  ;; Grow memory
```

## Compilation

### From C to WebAssembly

**C Code:**
```c
// add.c
int add(int a, int b) {
  return a + b;
}
```

**Compile with Emscripten:**
```bash
emcc add.c -o add.js -s EXPORTED_FUNCTIONS='["_add"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]'
```

**Generated Files:**
```
add.wasm  - WebAssembly binary
add.js    - JavaScript glue code
```

### From Rust to WebAssembly

**Rust Code:**
```rust
// lib.rs
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

**Compile:**
```bash
rustc --target wasm32-unknown-unknown -O --crate-type=cdylib lib.rs -o add.wasm
```

**Or with wasm-pack:**
```bash
wasm-pack build --target web
```

### WAT (WebAssembly Text Format)

**Text Format:**
```wasm
(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )
  (export "add" (func $add))
)
```

**Compile to Binary:**
```bash
wat2wasm add.wat -o add.wasm
```

**Decompile Binary:**
```bash
wasm2wat add.wasm -o add.wat
```

## JavaScript Integration

### Loading WebAssembly

**Fetch and Instantiate:**
```javascript
// Modern approach
const response = await fetch('module.wasm');
const buffer = await response.arrayBuffer();
const module = await WebAssembly.instantiate(buffer);

const { add } = module.instance.exports;
console.log(add(5, 3)); // 8
```

**Streaming Compilation:**
```javascript
// More efficient
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('module.wasm')
);

const { add } = instance.exports;
console.log(add(5, 3)); // 8
```

**With Imports:**
```javascript
const importObject = {
  env: {
    consoleLog: (arg) => console.log(arg),
    memory: new WebAssembly.Memory({ initial: 1 })
  }
};

const { instance } = await WebAssembly.instantiateStreaming(
  fetch('module.wasm'),
  importObject
);
```

### Calling Wasm from JavaScript

**Simple Function:**
```javascript
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('math.wasm')
);

// Call exported function
const result = instance.exports.add(10, 20);
console.log(result); // 30
```

**With Memory:**
```javascript
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('string.wasm')
);

const memory = instance.exports.memory;
const buffer = new Uint8Array(memory.buffer);

// Write string to memory
const text = 'Hello, WebAssembly!';
const encoder = new TextEncoder();
const encoded = encoder.encode(text);
buffer.set(encoded, 0);

// Call function with pointer
const length = instance.exports.processString(0, encoded.length);
```

### Calling JavaScript from Wasm

**Import JavaScript Function:**
```javascript
const importObject = {
  env: {
    log: (value) => console.log('From Wasm:', value),
    random: () => Math.random()
  }
};

const { instance } = await WebAssembly.instantiateStreaming(
  fetch('module.wasm'),
  importObject
);
```

**Wasm Code:**
```wasm
(module
  (import "env" "log" (func $log (param i32)))
  (import "env" "random" (func $random (result f64)))
  
  (func $main
    ;; Call imported log function
    i32.const 42
    call $log
    
    ;; Call imported random function
    call $random
    drop
  )
  
  (export "main" (func $main))
)
```

## Memory Management

### Linear Memory

**Concept:** Contiguous array of bytes

**Create Memory:**
```javascript
// Create 1 page (64KB) of memory
const memory = new WebAssembly.Memory({
  initial: 1,  // Initial pages
  maximum: 10  // Maximum pages
});

// Access as typed array
const buffer = new Uint8Array(memory.buffer);
buffer[0] = 42;
console.log(buffer[0]); // 42
```

**Grow Memory:**
```javascript
const memory = new WebAssembly.Memory({ initial: 1 });
console.log(memory.buffer.byteLength); // 65536 (64KB)

memory.grow(1); // Grow by 1 page
console.log(memory.buffer.byteLength); // 131072 (128KB)
```

### Memory in Wasm

**Load and Store:**
```wasm
(module
  (memory 1)  ;; 1 page of memory
  
  (func $store (param $addr i32) (param $value i32)
    local.get $addr
    local.get $value
    i32.store  ;; Store value at address
  )
  
  (func $load (param $addr i32) (result i32)
    local.get $addr
    i32.load   ;; Load value from address
  )
  
  (export "memory" (memory 0))
  (export "store" (func $store))
  (export "load" (func $load))
)
```

**JavaScript Usage:**
```javascript
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('memory.wasm')
);

// Store value
instance.exports.store(0, 42);

// Load value
const value = instance.exports.load(0);
console.log(value); // 42

// Direct memory access
const memory = new Uint32Array(instance.exports.memory.buffer);
console.log(memory[0]); // 42
```

### Shared Memory

**Create Shared Memory:**
```javascript
const memory = new WebAssembly.Memory({
  initial: 1,
  maximum: 10,
  shared: true  // Shared between workers
});
```

**Use in Worker:**
```javascript
// Main thread
const worker = new Worker('worker.js');
worker.postMessage({ memory });

// Worker
self.onmessage = async ({ data: { memory } }) => {
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch('module.wasm'),
    { env: { memory } }
  );
  
  // Access shared memory
  const buffer = new Uint8Array(memory.buffer);
};
```

## Performance

### Benchmarks

**JavaScript vs WebAssembly:**
```javascript
// JavaScript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.time('JS');
fibonacci(40);
console.timeEnd('JS');
// JS: ~1000ms
```

```c
// C compiled to Wasm
int fibonacci(int n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

```javascript
// WebAssembly
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('fibonacci.wasm')
);

console.time('Wasm');
instance.exports.fibonacci(40);
console.timeEnd('Wasm');
// Wasm: ~200ms (5x faster)
```

### Optimization Tips

**Use Appropriate Types:**
```c
// Good: Use specific types
uint32_t count = 0;
float value = 3.14f;

// Bad: Generic types
int count = 0;
double value = 3.14;
```

**Minimize Memory Access:**
```c
// Bad: Multiple memory accesses
for (int i = 0; i < n; i++) {
  result += array[i] * array[i];
}

// Good: Cache in register
for (int i = 0; i < n; i++) {
  int val = array[i];
  result += val * val;
}
```

**Use SIMD:**
```c
#include <wasm_simd128.h>

void add_arrays(float* a, float* b, float* result, int n) {
  for (int i = 0; i < n; i += 4) {
    v128_t va = wasm_v128_load(&a[i]);
    v128_t vb = wasm_v128_load(&b[i]);
    v128_t vr = wasm_f32x4_add(va, vb);
    wasm_v128_store(&result[i], vr);
  }
}
```

## Use Cases

### Image Processing

```c
// Grayscale conversion
void grayscale(uint8_t* pixels, int width, int height) {
  for (int i = 0; i < width * height * 4; i += 4) {
    uint8_t r = pixels[i];
    uint8_t g = pixels[i + 1];
    uint8_t b = pixels[i + 2];
    
    uint8_t gray = (r + g + b) / 3;
    
    pixels[i] = gray;
    pixels[i + 1] = gray;
    pixels[i + 2] = gray;
  }
}
```

```javascript
// JavaScript usage
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const { instance } = await WebAssembly.instantiateStreaming(
  fetch('image.wasm')
);

// Copy image data to Wasm memory
const memory = new Uint8Array(instance.exports.memory.buffer);
memory.set(imageData.data);

// Process image
instance.exports.grayscale(0, canvas.width, canvas.height);

// Copy back to canvas
imageData.data.set(memory.subarray(0, imageData.data.length));
ctx.putImageData(imageData, 0, 0);
```

### Game Engine

```c
// Physics simulation
typedef struct {
  float x, y;
  float vx, vy;
  float mass;
} Particle;

void update_particles(Particle* particles, int count, float dt) {
  for (int i = 0; i < count; i++) {
    particles[i].x += particles[i].vx * dt;
    particles[i].y += particles[i].vy * dt;
    
    // Apply gravity
    particles[i].vy += 9.8 * dt;
    
    // Bounce off ground
    if (particles[i].y < 0) {
      particles[i].y = 0;
      particles[i].vy = -particles[i].vy * 0.8;
    }
  }
}
```

### Cryptography

```c
// SHA-256 (simplified)
void sha256(const uint8_t* data, size_t len, uint8_t* hash) {
  // Implementation...
}
```

```javascript
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('crypto.wasm')
);

const data = new TextEncoder().encode('Hello, World!');
const memory = new Uint8Array(instance.exports.memory.buffer);

// Copy data to Wasm memory
memory.set(data, 0);

// Compute hash
instance.exports.sha256(0, data.length, data.length);

// Read hash
const hash = memory.subarray(data.length, data.length + 32);
console.log(Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join(''));
```

## Tools and Ecosystem

### Emscripten

**Install:**
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

**Compile:**
```bash
emcc hello.c -o hello.html
emcc math.c -o math.js -s EXPORTED_FUNCTIONS='["_add"]'
```

### wasm-pack (Rust)

**Install:**
```bash
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

**Create Project:**
```bash
cargo new --lib my-wasm-project
cd my-wasm-project
```

**Cargo.toml:**
```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

**Build:**
```bash
wasm-pack build --target web
```

### AssemblyScript

**TypeScript-like language for WebAssembly**

**Install:**
```bash
npm install -g assemblyscript
```

**Code:**
```typescript
// assembly/index.ts
export function add(a: i32, b: i32): i32 {
  return a + b;
}
```

**Compile:**
```bash
asc assembly/index.ts -o build/optimized.wasm -O3
```

**Use:**
```javascript
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('optimized.wasm')
);

console.log(instance.exports.add(5, 3)); // 8
```

## Security

### Sandboxing

**Isolated Execution:**
```
✅ Cannot access host system
✅ Cannot make network requests
✅ Cannot access DOM
✅ Limited to linear memory
✅ No arbitrary code execution
```

**Memory Safety:**
```
✅ Bounds checking
✅ Type safety
✅ No buffer overflows
✅ No use-after-free
```

### Best Practices

**Validate Inputs:**
```c
int process_data(const uint8_t* data, size_t len) {
  if (len > MAX_SIZE) {
    return -1; // Error
  }
  
  // Process data
  return 0;
}
```

**Limit Memory:**
```javascript
const memory = new WebAssembly.Memory({
  initial: 1,
  maximum: 100  // Limit to 6.4MB
});
```

**Use Content Security Policy:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'wasm-unsafe-eval'">
```

## Future

### Upcoming Features

**Garbage Collection:**
```
- Automatic memory management
- Integration with JS GC
- Easier language support
```

**Exception Handling:**
```
- Try/catch in Wasm
- Better error handling
- Language interop
```

**Threads:**
```
- Shared memory
- Atomic operations
- Parallel execution
```

**SIMD:**
```
- Vector operations
- 128-bit operations
- Performance boost
```

**Interface Types:**
```
- High-level types
- Better JS interop
- String, arrays, objects
```

## Interview Questions

**Q: What is WebAssembly and why was it created?**

A: WebAssembly is a binary instruction format for a stack-based virtual machine, designed as a compilation target for languages like C, C++, and Rust. Created to enable near-native performance on the web, complement JavaScript for compute-intensive tasks, and provide a safe, portable execution environment.

**Q: How does WebAssembly achieve better performance than JavaScript?**

A: WebAssembly is compiled ahead of time to binary format (no parsing), uses static typing (no type checking at runtime), has predictable performance (no JIT compilation), and has more efficient memory representation. It's designed for performance-critical code while JavaScript remains better for DOM manipulation and async operations.

**Q: Explain WebAssembly's memory model.**

A: WebAssembly uses linear memory - a contiguous array of bytes that can grow. Memory is accessed via load/store instructions with byte offsets. Can be shared between JavaScript and Wasm. Memory is sandboxed and bounds-checked for safety. One page = 64KB, can grow dynamically.

**Q: What are the main use cases for WebAssembly?**

A: Compute-intensive tasks (image/video processing, games, simulations), porting existing C/C++/Rust code to web, cryptography, compression, scientific computing, CAD applications. Not for DOM manipulation or typical web app logic - JavaScript is better for those.

**Q: How do you integrate WebAssembly with JavaScript?**

A: Load Wasm module with `WebAssembly.instantiateStreaming()`, call exported functions from JavaScript, pass imports (functions, memory) to Wasm, share memory between JS and Wasm using typed arrays. Wasm can call imported JavaScript functions. Use for performance-critical parts while keeping JS for web APIs.

---

[← Back to State Machines](./07-state-machines-theory.md) | [Next: Serverless Architecture →](./09-serverless-architecture-theory.md)
