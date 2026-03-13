# Browser Architecture - Advanced Theory / Kiến Trúc Trình Duyệt - Lý Thuyết Nâng Cao


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Table of Contents / Mục Lục

1. [Browser Architecture Overview](#browser-architecture-overview)
2. [Multi-Process Architecture](#multi-process-architecture)
3. [Rendering Engine](#rendering-engine)
4. [Browser Security Model](#browser-security-model)
5. [Navigation and Page Load](#navigation-and-page-load)
6. [Browser Storage](#browser-storage)
7. [Interview Questions](#interview-questions)

---

## Browser Architecture Overview / Tổng Quan Kiến Trúc Trình Duyệt

### Modern Browser Components / Các Thành Phần Trình Duyệt Hiện Đại

**English:** Modern browsers are complex applications with multiple components working together to render web pages and execute JavaScript.

**Tiếng Việt:** Trình duyệt hiện đại là ứng dụng phức tạp với nhiều thành phần làm việc cùng nhau để render trang web và thực thi JavaScript.

#### Core Components / Thành Phần Cốt Lõi

**1. User Interface (UI)**

**Purpose**: Everything user sees except the webpage content

**Components**:
- Address bar (URL bar)
- Back/forward buttons
- Bookmarks bar
- Refresh button
- Home button
- Settings menu
- Extensions toolbar

**Responsibilities**:
- Handle user input
- Display browser chrome
- Manage tabs
- Show notifications
- Handle downloads

**2. Browser Engine**

**Purpose**: Marshals actions between UI and rendering engine

**Responsibilities**:
- Coordinate between UI and rendering engine
- Query and manipulate rendering engine
- Handle browser-level operations
- Manage browser state

**Examples**:
- Gecko (Firefox)
- Blink (Chrome, Edge)
- WebKit (Safari)

**3. Rendering Engine**

**Purpose**: Display requested content

**Responsibilities**:
- Parse HTML and CSS
- Construct DOM and CSSOM
- Build render tree
- Layout calculation
- Paint pixels to screen

**Major Engines**:
- **Blink**: Chrome, Edge, Opera
- **Gecko**: Firefox
- **WebKit**: Safari

**4. Networking**

**Purpose**: Handle network calls

**Responsibilities**:
- HTTP/HTTPS requests
- DNS resolution
- Connection management
- Cookie handling
- Cache management
- Protocol implementation

**Features**:
- Connection pooling
- HTTP/2 and HTTP/3 support
- TLS/SSL encryption
- Proxy support
- CORS enforcement

**5. JavaScript Engine**

**Purpose**: Parse and execute JavaScript

**Major Engines**:
- **V8**: Chrome, Edge, Node.js
- **SpiderMonkey**: Firefox
- **JavaScriptCore**: Safari

**Responsibilities**:
- Parse JavaScript
- Compile to bytecode/machine code
- Execute code
- Garbage collection
- Memory management

**6. UI Backend**

**Purpose**: Draw basic widgets

**Responsibilities**:
- Platform-specific drawing
- Window management
- Widget rendering
- Graphics acceleration

**Technologies**:
- Skia (Chrome)
- Cairo (Firefox)
- Core Graphics (Safari)

**7. Data Persistence**

**Purpose**: Store data locally

**Storage Types**:
- Cookies
- LocalStorage
- SessionStorage
- IndexedDB
- Cache API
- File System Access API

**Responsibilities**:
- Persist user data
- Manage storage quotas
- Handle storage events
- Enforce security policies

---

## Multi-Process Architecture / Kiến Trúc Đa Tiến Trình

### Process Isolation / Cô Lập Tiến Trình

**English:** Modern browsers use multi-process architecture for security, stability, and performance.

**Tiếng Việt:** Trình duyệt hiện đại sử dụng kiến trúc đa tiến trình cho bảo mật, ổn định và hiệu suất.

#### Chrome's Multi-Process Model / Mô Hình Đa Tiến Trình của Chrome

**1. Browser Process (Main Process)**

**Purpose**: Manages the browser application

**Responsibilities**:
- UI rendering (tabs, address bar, bookmarks)
- Network requests coordination
- File system access
- Storage management
- Process management
- Security enforcement

**Characteristics**:
- Single process
- Privileged access
- Coordinates other processes
- Handles IPC (Inter-Process Communication)

**2. Renderer Process**

**Purpose**: Render web pages

**Responsibilities**:
- Parse HTML/CSS
- Execute JavaScript
- Build DOM/CSSOM
- Layout and paint
- Handle user interactions

**Characteristics**:
- One per tab (or site)
- Sandboxed (restricted access)
- Isolated from other tabs
- Can crash without affecting browser

**Process Allocation Strategies**:
- **Process-per-tab**: One process per tab
- **Process-per-site**: One process per site (same origin)
- **Process-per-site-instance**: One process per site instance

**3. GPU Process**

**Purpose**: Handle graphics operations

**Responsibilities**:
- Hardware acceleration
- Canvas rendering
- WebGL operations
- Video decoding
- CSS animations
- Compositing

**Characteristics**:
- Single process
- Direct GPU access
- Shared by all tabs
- Improves performance

**4. Plugin Process**

**Purpose**: Run browser plugins

**Responsibilities**:
- Execute plugin code (Flash, PDF viewer)
- Isolate plugin crashes
- Sandbox plugin execution

**Characteristics**:
- One per plugin type
- Sandboxed
- Deprecated (most plugins obsolete)

**5. Extension Process**

**Purpose**: Run browser extensions

**Responsibilities**:
- Execute extension code
- Isolate extensions
- Manage extension permissions

**Characteristics**:
- One per extension
- Limited privileges
- Separate from web content

**6. Utility Process**

**Purpose**: Handle various utility tasks

**Responsibilities**:
- Audio processing
- Network service
- Storage service
- Device service

**Characteristics**:
- Multiple utility processes
- Specialized functions
- Sandboxed

#### Benefits of Multi-Process Architecture / Lợi Ích Kiến Trúc Đa Tiến Trình

**1. Security**

**Sandboxing**:
- Renderer processes run in sandbox
- Limited system access
- Cannot access file system directly
- Cannot make network requests directly
- Prevents malicious code from harming system

**Privilege Separation**:
- Browser process has privileges
- Renderer processes don't
- Reduces attack surface
- Limits damage from exploits

**2. Stability**

**Fault Isolation**:
- Tab crash doesn't crash browser
- Plugin crash isolated
- Extension crash isolated
- Other tabs continue working

**Recovery**:
- Can reload crashed tab
- Browser remains functional
- Better user experience

**3. Performance**

**Parallelism**:
- Multiple tabs render simultaneously
- Better CPU utilization
- Responsive UI
- Smooth scrolling

**Resource Management**:
- Can kill unresponsive tabs
- Memory per process
- Better resource allocation

**4. Responsiveness**

**Non-Blocking**:
- UI remains responsive
- Long-running scripts don't freeze browser
- Background tabs don't block foreground

#### Drawbacks / Nhược Điểm

**1. Memory Overhead**

**Process Cost**:
- Each process has overhead
- Duplicate code in memory
- More memory usage overall
- Can be significant with many tabs

**2. Complexity**

**IPC Overhead**:
- Inter-process communication needed
- Message passing overhead
- Synchronization complexity

**3. Resource Usage**

**CPU Usage**:
- More processes to schedule
- Context switching overhead
- Battery impact on mobile

---

## Rendering Engine / Engine Render

### Critical Rendering Path / Đường Dẫn Render Quan Trọng

**English:** The critical rendering path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on screen.

**Tiếng Việt:** Đường dẫn render quan trọng là chuỗi các bước trình duyệt thực hiện để chuyển đổi HTML, CSS và JavaScript thành pixels trên màn hình.

#### Rendering Pipeline Stages / Các Giai Đoạn Pipeline Render

**Stage 1: Parsing**

**HTML Parsing**:
- Tokenization: Break HTML into tokens
- Tree construction: Build DOM tree
- Incremental: Can start before full download
- Blocking: JavaScript blocks parsing

**CSS Parsing**:
- Tokenization: Break CSS into tokens
- Parse rules: Create CSSOM tree
- Cascade: Apply specificity rules
- Inheritance: Propagate inherited properties

**JavaScript Execution**:
- Parse: Create AST
- Compile: Generate bytecode
- Execute: Run code
- Can modify DOM/CSSOM

**Stage 2: Style Calculation**

**Purpose**: Determine computed styles for each element

**Process**:
1. Match CSS rules to DOM elements
2. Apply cascade (specificity, importance, order)
3. Handle inheritance
4. Compute final values
5. Create computed style for each element

**Complexity**: O(n × m) where n = elements, m = rules

**Optimizations**:
- Style sharing
- Rule indexing
- Bloom filters

**Stage 3: Layout (Reflow)**

**Purpose**: Calculate position and size of elements

**Process**:
1. Build layout tree (render tree)
2. Calculate dimensions
3. Determine positions
4. Handle flow (normal, flex, grid)
5. Create layout boxes

**Layout Types**:
- **Normal flow**: Block and inline
- **Flexbox**: Flexible box layout
- **Grid**: Two-dimensional grid
- **Positioned**: Absolute, fixed, sticky
- **Float**: Floating elements

**Expensive Operation**:
- Recursive algorithm
- Can affect entire tree
- Triggers on geometry changes
- Should be minimized

**Stage 4: Paint**

**Purpose**: Fill in pixels

**Process**:
1. Create paint records
2. Determine paint order (z-index, stacking context)
3. Paint backgrounds
4. Paint borders
5. Paint content
6. Paint decorations

**Paint Layers**:
- Background layer
- Border layer
- Content layer
- Overlay layer

**Optimization**:
- Layer promotion
- Paint invalidation
- Dirty rectangles

**Stage 5: Composite**

**Purpose**: Combine layers into final image

**Process**:
1. Create compositor layers
2. Rasterize layers (convert to bitmaps)
3. Apply transforms
4. Composite layers
5. Send to GPU

**Compositor Layers**:
- Created for certain properties
- Hardware accelerated
- Can be transformed without repaint
- Improves performance

**Layer Promotion Triggers**:
- 3D transforms
- `will-change` property
- Video/Canvas elements
- Animations
- Opacity changes

#### Rendering Optimization / Tối Ưu Hóa Render

**1. Minimize Reflows**

**Causes of Reflow**:
- DOM manipulation
- Style changes affecting geometry
- Window resize
- Font loading
- Reading layout properties

**Optimization**:
- Batch DOM changes
- Use `documentFragment`
- Avoid layout thrashing
- Use CSS transforms instead of position changes

**2. Minimize Repaints**

**Causes of Repaint**:
- Color changes
- Visibility changes
- Background changes
- Text changes

**Optimization**:
- Use CSS animations
- Promote to compositor layer
- Avoid paint-heavy properties

**3. Use Compositor Layers**

**Benefits**:
- GPU accelerated
- No repaint needed
- Smooth animations
- Better performance

**Properties That Use Compositor**:
- `transform`
- `opacity`
- `filter`
- `will-change`

**4. Optimize JavaScript**

**Best Practices**:
- Avoid forced synchronous layout
- Use `requestAnimationFrame`
- Debounce/throttle events
- Minimize DOM access

---

## Browser Security Model / Mô Hình Bảo Mật Trình Duyệt

### Same-Origin Policy / Chính Sách Cùng Nguồn Gốc

**English:** The Same-Origin Policy is the cornerstone of browser security, restricting how documents from different origins can interact.

**Tiếng Việt:** Chính sách Cùng Nguồn Gốc là nền tảng của bảo mật trình duyệt, hạn chế cách các tài liệu từ các nguồn gốc khác nhau có thể tương tác.

#### Origin Definition / Định Nghĩa Nguồn Gốc

**Origin Components**:
- **Scheme** (protocol): http, https
- **Host** (domain): example.com
- **Port**: 80, 443, 8080

**Same Origin Examples**:
```
https://example.com:443/page1
https://example.com:443/page2
→ Same origin (same scheme, host, port)
```

**Different Origin Examples**:
```
https://example.com
http://example.com
→ Different origin (different scheme)

https://example.com
https://api.example.com
→ Different origin (different host)

https://example.com:443
https://example.com:8080
→ Different origin (different port)
```

#### SOP Restrictions / Hạn Chế SOP

**1. DOM Access**

**Restriction**: Cannot access DOM of different origin

**Blocked**:
- Reading iframe content
- Accessing window properties
- Manipulating cross-origin DOM

**Allowed**:
- Same-origin access
- postMessage API
- CORS-enabled resources

**2. Cookie Access**

**Restriction**: Cookies scoped to origin

**Rules**:
- Cannot read cookies from different origin
- Cannot set cookies for different origin
- Domain and path restrictions

**3. Network Requests**

**Restriction**: AJAX requests follow SOP

**Blocked**:
- Cross-origin AJAX without CORS
- Reading response from different origin

**Allowed**:
- CORS-enabled requests
- Simple requests (GET, POST with simple headers)
- Credentialed requests with proper headers

**4. Storage Access**

**Restriction**: Storage isolated by origin

**Isolated**:
- LocalStorage
- SessionStorage
- IndexedDB
- Cache API

#### CORS (Cross-Origin Resource Sharing) / Chia Sẻ Tài Nguyên Nguồn Gốc Chéo

**Purpose**: Allow controlled cross-origin access

**Mechanism**:
1. Browser sends preflight request (OPTIONS)
2. Server responds with CORS headers
3. Browser allows/blocks based on headers

**Key Headers**:
- `Access-Control-Allow-Origin`: Allowed origins
- `Access-Control-Allow-Methods`: Allowed methods
- `Access-Control-Allow-Headers`: Allowed headers
- `Access-Control-Allow-Credentials`: Allow cookies
- `Access-Control-Max-Age`: Preflight cache duration

**Request Types**:

**Simple Requests**:
- GET, HEAD, POST
- Simple headers only
- No preflight needed

**Preflighted Requests**:
- Other methods (PUT, DELETE)
- Custom headers
- Requires preflight OPTIONS request

#### Content Security Policy (CSP) / Chính Sách Bảo Mật Nội Dung

**Purpose**: Prevent XSS and injection attacks

**Mechanism**: Whitelist allowed content sources

**Directives**:
- `default-src`: Default policy
- `script-src`: JavaScript sources
- `style-src`: CSS sources
- `img-src`: Image sources
- `connect-src`: AJAX/WebSocket sources
- `font-src`: Font sources
- `frame-src`: Frame sources

**Example Policy**:
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' https://trusted.com; 
  style-src 'self' 'unsafe-inline';
```

**Benefits**:
- Prevents inline script execution
- Blocks unauthorized resources
- Mitigates XSS attacks
- Reports violations

#### Sandboxing / Hộp Cát

**Purpose**: Isolate untrusted content

**Mechanisms**:

**1. Process Sandboxing**:
- Renderer processes run in sandbox
- Limited system access
- Cannot access file system
- Cannot make network requests directly

**2. iframe Sandbox**:
- `sandbox` attribute
- Restricts iframe capabilities
- Prevents scripts, forms, popups
- Can selectively allow features

**Sandbox Flags**:
- `allow-scripts`: Allow JavaScript
- `allow-forms`: Allow form submission
- `allow-popups`: Allow popups
- `allow-same-origin`: Treat as same origin
- `allow-top-navigation`: Allow navigation

**3. Web Workers**:
- Separate execution context
- No DOM access
- Limited APIs
- Message-based communication

---

## Navigation and Page Load / Điều Hướng và Tải Trang

### Navigation Process / Quá Trình Điều Hướng

**English:** Browser navigation involves multiple steps from URL entry to page display.

**Tiếng Việt:** Điều hướng trình duyệt bao gồm nhiều bước từ nhập URL đến hiển thị trang.

#### Navigation Steps / Các Bước Điều Hướng

**Step 1: URL Input**

**Process**:
- User enters URL or clicks link
- Browser validates URL
- Checks if URL is search query
- Autocomplete suggestions

**Step 2: DNS Resolution**

**Process**:
1. Check browser DNS cache
2. Check OS DNS cache
3. Query DNS server
4. Resolve domain to IP address

**Optimization**:
- DNS prefetching
- DNS caching
- Connection reuse

**Step 3: TCP Connection**

**Process**:
1. Three-way handshake (SYN, SYN-ACK, ACK)
2. Establish connection
3. Connection pooling

**For HTTPS**:
4. TLS handshake
5. Certificate validation
6. Encryption negotiation

**Step 4: HTTP Request**

**Process**:
1. Send HTTP request
2. Include headers (cookies, user-agent)
3. Wait for response

**Request Components**:
- Method (GET, POST)
- Headers
- Body (for POST)

**Step 5: Server Response**

**Process**:
1. Server processes request
2. Generates response
3. Sends response

**Response Components**:
- Status code
- Headers
- Body (HTML)

**Step 6: Response Processing**

**Process**:
1. Browser receives response
2. Checks status code
3. Handles redirects
4. Processes headers
5. Begins parsing HTML

**Step 7: Rendering**

**Process**:
1. Parse HTML → DOM
2. Parse CSS → CSSOM
3. Execute JavaScript
4. Build render tree
5. Layout
6. Paint
7. Composite

#### Page Load Performance / Hiệu Suất Tải Trang

**Metrics**:

**1. First Contentful Paint (FCP)**:
- Time to first content rendered
- Target: < 1.8s

**2. Largest Contentful Paint (LCP)**:
- Time to largest content rendered
- Target: < 2.5s

**3. Time to Interactive (TTI)**:
- Time until page fully interactive
- Target: < 3.8s

**4. First Input Delay (FID)**:
- Time from first interaction to response
- Target: < 100ms

**5. Cumulative Layout Shift (CLS)**:
- Visual stability metric
- Target: < 0.1

**Optimization Strategies**:

**1. Reduce Request Count**:
- Bundle resources
- Inline critical CSS
- Remove unused code

**2. Reduce Request Size**:
- Minification
- Compression (gzip, brotli)
- Image optimization

**3. Optimize Critical Path**:
- Defer non-critical resources
- Async/defer scripts
- Preload critical resources

**4. Use Caching**:
- Browser cache
- CDN
- Service Workers

**5. Optimize Images**:
- Responsive images
- Lazy loading
- Modern formats (WebP, AVIF)

---

## Browser Storage / Lưu Trữ Trình Duyệt

### Storage Mechanisms / Cơ Chế Lưu Trữ

**English:** Browsers provide multiple storage mechanisms with different characteristics and use cases.

**Tiếng Việt:** Trình duyệt cung cấp nhiều cơ chế lưu trữ với các đặc điểm và trường hợp sử dụng khác nhau.

#### Storage Comparison / So Sánh Lưu Trữ

**1. Cookies**

**Characteristics**:
- Size: 4KB per cookie
- Sent with every request
- Expiration: Can be set
- Scope: Domain and path
- Access: JavaScript and server

**Use Cases**:
- Session management
- Authentication tokens
- Tracking
- Preferences

**Limitations**:
- Small size
- Performance impact (sent with requests)
- Security concerns

**2. LocalStorage**

**Characteristics**:
- Size: 5-10MB
- Persistent (no expiration)
- Synchronous API
- Scope: Origin
- Access: JavaScript only

**Use Cases**:
- User preferences
- Application state
- Cached data
- Offline data

**Limitations**:
- Synchronous (blocks main thread)
- String-only storage
- No expiration

**3. SessionStorage**

**Characteristics**:
- Size: 5-10MB
- Session-scoped (tab lifetime)
- Synchronous API
- Scope: Origin + tab
- Access: JavaScript only

**Use Cases**:
- Form data
- Temporary state
- Tab-specific data

**Limitations**:
- Same as LocalStorage
- Lost on tab close

**4. IndexedDB**

**Characteristics**:
- Size: Large (50MB+, can request more)
- Persistent
- Asynchronous API
- Scope: Origin
- Access: JavaScript only

**Use Cases**:
- Large datasets
- Structured data
- Offline applications
- Complex queries

**Advantages**:
- Asynchronous (non-blocking)
- Transactions
- Indexes
- Large storage

**5. Cache API**

**Characteristics**:
- Size: Large
- Persistent
- Asynchronous API
- Scope: Origin
- Access: Service Workers

**Use Cases**:
- Offline caching
- Performance optimization
- PWA support

**Advantages**:
- Request/response caching
- Programmatic control
- Service Worker integration

#### Storage Best Practices / Thực Hành Tốt Nhất Lưu Trữ

**1. Choose Appropriate Storage**:
- Cookies: Small, server-needed data
- LocalStorage: Simple, persistent data
- SessionStorage: Temporary, tab-specific data
- IndexedDB: Large, structured data
- Cache API: Network responses

**2. Handle Storage Limits**:
- Check available space
- Handle quota exceeded errors
- Clean up old data
- Request persistent storage

**3. Security Considerations**:
- Don't store sensitive data
- Encrypt if necessary
- Use HttpOnly cookies for tokens
- Validate stored data

**4. Performance**:
- Use async storage (IndexedDB, Cache API)
- Minimize LocalStorage access
- Batch operations
- Use Web Workers for heavy operations

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: Explain browser multi-process architecture

**English Answer:**

**Modern browsers use multi-process architecture** for security, stability, and performance.

**Key Processes:**

**1. Browser Process**:
- Main process
- Manages UI, network, storage
- Coordinates other processes
- Privileged access

**2. Renderer Process**:
- One per tab/site
- Renders web pages
- Executes JavaScript
- Sandboxed (restricted access)

**3. GPU Process**:
- Handles graphics
- Hardware acceleration
- Shared by all tabs

**4. Plugin/Extension Processes**:
- Isolated plugin/extension execution

**Benefits:**
- **Security**: Sandboxing prevents malicious code
- **Stability**: Tab crash doesn't crash browser
- **Performance**: Parallel rendering
- **Responsiveness**: UI remains responsive

**Drawbacks:**
- Memory overhead
- IPC complexity
- More CPU usage

**Tiếng Việt:**

Trình duyệt hiện đại dùng kiến trúc đa tiến trình. Processes chính: Browser (main), Renderer (per tab), GPU (graphics). Lợi ích: bảo mật (sandboxing), ổn định (fault isolation), hiệu suất (parallelism).

### Q2: Describe the critical rendering path

**English Answer:**

**Critical Rendering Path** is the sequence of steps to render a page.

**Steps:**

**1. Parse HTML → DOM**:
- Tokenize HTML
- Build DOM tree
- Incremental parsing

**2. Parse CSS → CSSOM**:
- Tokenize CSS
- Build CSSOM tree
- Apply cascade

**3. Execute JavaScript**:
- Can modify DOM/CSSOM
- Blocks parsing

**4. Style Calculation**:
- Match CSS rules
- Compute styles
- Handle inheritance

**5. Layout (Reflow)**:
- Calculate positions
- Determine sizes
- Build layout tree

**6. Paint**:
- Fill in pixels
- Create paint records
- Determine paint order

**7. Composite**:
- Create layers
- Rasterize
- Composite to screen

**Optimization:**
- Minimize render-blocking resources
- Defer non-critical CSS/JS
- Use compositor layers
- Avoid layout thrashing

**Tiếng Việt:**

Critical rendering path: Parse HTML → DOM, Parse CSS → CSSOM, Execute JS, Style calculation, Layout, Paint, Composite. Tối ưu: minimize blocking resources, defer non-critical, use compositor layers.

### Q3: Explain Same-Origin Policy and CORS

**English Answer:**

**Same-Origin Policy (SOP)** restricts cross-origin interactions.

**Origin = Scheme + Host + Port**

**Restrictions:**
- Cannot access cross-origin DOM
- Cannot read cross-origin AJAX responses
- Storage isolated by origin
- Cookies scoped to origin

**CORS (Cross-Origin Resource Sharing)** allows controlled cross-origin access.

**Mechanism:**
1. Browser sends preflight (OPTIONS)
2. Server responds with CORS headers
3. Browser allows/blocks based on headers

**Key Headers:**
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`

**Request Types:**
- **Simple**: GET, POST with simple headers
- **Preflighted**: Other methods, custom headers

**Benefits:**
- Security by default
- Controlled sharing
- Prevents CSRF

**Tiếng Việt:**

SOP hạn chế tương tác cross-origin. Origin = Scheme + Host + Port. CORS cho phép truy cập có kiểm soát qua headers. Request types: Simple (no preflight), Preflighted (OPTIONS first).

---

## Summary / Tóm Tắt

**Key Concepts:**

1. **Architecture**: Multi-process for security, stability, performance
2. **Rendering**: Critical rendering path (Parse → Style → Layout → Paint → Composite)
3. **Security**: SOP, CORS, CSP, Sandboxing
4. **Navigation**: DNS → TCP → HTTP → Response → Rendering
5. **Storage**: Cookies, LocalStorage, SessionStorage, IndexedDB, Cache API
6. **Optimization**: Minimize reflows, use compositor, optimize critical path

**Best Practices:**
- Understand browser architecture
- Optimize rendering performance
- Follow security best practices
- Choose appropriate storage
- Monitor performance metrics

---

[← Previous: DOM Manipulation Theory](./05-dom-manipulation-theory.md) | [Next: Browser APIs →](./01-browser-apis.md) | [Back to Table of Contents](../../00-table-of-contents.md)
