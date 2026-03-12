# DevTools Mastery - Debugging & Profiling

> Chrome DevTools là essential tool cho frontend development. Master các tabs để debug efficiently.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHROME DEVTOOLS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│   │Elements │ │ Console │ │ Sources │ │ Network │ │Performan│  │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│                                                                   │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│   │ Memory  │ │ Applic  │ │Security │ │Lighthse │ │Recorder │  │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│                                                                   │
│   Key Use Cases:                                                 │
│   • Debug JavaScript and DOM                                     │
│   • Profile performance bottlenecks                              │
│   • Analyze memory leaks                                         │
│   • Inspect network requests                                     │
│   • Audit web vitals                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Elements Panel

### Inspecting & Editing

```
Keyboard Shortcuts:
• Cmd/Ctrl + Shift + C: Inspect element mode
• Up/Down: Navigate DOM tree
• Left/Right: Collapse/expand node
• F2: Edit as HTML
• Delete: Delete node
• Cmd/Ctrl + Z: Undo

Useful Features:
• Right-click → "Break on..." (subtree, attribute, removal)
• $0 in console = currently selected element
• Force element state (:hover, :active, :focus)
• Copy → Copy selector / Copy JS path
• Scroll into view
```

### Computed Styles

```css
/* Elements → Computed tab shows: */
• Final computed value of each property
• Which rules applied (click to expand)
• Box model visualization
• Filter by property name

/* Debugging specificity: */
• Check which rule won
• See overridden rules (strikethrough)
• Understand cascade order
```

---

## 💻 Console Panel

### Advanced Console Methods

```javascript
// Logging levels
console.log('Info');
console.warn('Warning');
console.error('Error');
console.debug('Debug'); // Hidden by default

// Styled output
console.log('%cStyled Text', 'color: blue; font-size: 20px');

// Tables
console.table([
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
]);

// Groups
console.group('User Data');
console.log('Name: John');
console.log('Age: 30');
console.groupEnd();

console.groupCollapsed('Collapsed Group');
console.log('Hidden by default');
console.groupEnd();

// Timing
console.time('operation');
// ... operation ...
console.timeEnd('operation'); // "operation: 123.45ms"

// Count
console.count('clicked'); // "clicked: 1"
console.count('clicked'); // "clicked: 2"
console.countReset('clicked');

// Assert
console.assert(1 === 2, 'Math is broken!');

// Stack trace
console.trace('Trace label');

// Clear
console.clear();
```

### Console Utilities

```javascript
// $ and $$ (like querySelector/All)
$('header')           // First match
$$('.item')           // All matches (array)

// $0 - $4: Recent selected elements
$0                    // Currently selected in Elements

// $_ : Last evaluated expression
2 + 2;                // 4
$_ * 2;               // 8

// copy(): Copy to clipboard
copy(someObject);

// monitor/unmonitor: Log function calls
monitor(myFunction);
myFunction('arg');    // Logs: "myFunction called with arguments: arg"
unmonitor(myFunction);

// debug/undebug: Break on function call
debug(myFunction);    // Sets breakpoint
undebug(myFunction);

// keys/values: Object keys/values
keys({a: 1, b: 2});   // ["a", "b"]
values({a: 1, b: 2}); // [1, 2]

// getEventListeners
getEventListeners($0); // All listeners on element

// queryObjects: Find all instances
queryObjects(Promise); // All Promise instances
```

---

## 🐛 Sources Panel

### Breakpoints

```javascript
// Types of breakpoints:
// 1. Line breakpoint: Click line number
// 2. Conditional: Right-click → "Add conditional breakpoint"
//    Expression: i === 5
// 3. Logpoint: Right-click → "Add logpoint"
//    Logs without pausing

// Code breakpoints:
debugger; // Pauses if DevTools open

// DOM breakpoints (Elements panel):
// Right-click → Break on:
// • Subtree modifications
// • Attribute modifications
// • Node removal

// XHR/fetch breakpoints:
// Sources → XHR/fetch Breakpoints
// Add URL contains: "api/users"

// Event listener breakpoints:
// Sources → Event Listener Breakpoints
// Check events like "click", "submit"
```

### Debugging Workflow

```
1. Pause on Exception
   • Click "Pause on exceptions" icon
   • Check "Pause on caught exceptions" if needed

2. Step through code
   • F8 / Resume: Continue execution
   • F10 / Step Over: Next line, skip function internals
   • F11 / Step Into: Enter function
   • Shift+F11 / Step Out: Exit current function
   • Cmd+\: Pause on next statement

3. Watch expressions
   • Add variables to watch
   • Evaluate on each pause

4. Call Stack
   • See function call hierarchy
   • Click to jump to caller

5. Scope
   • Local, Closure, Global variables
   • Edit values during pause
```

### Source Maps

```javascript
// Enable in browser and build tool

// webpack.config.js
module.exports = {
    devtool: 'source-map', // or 'eval-source-map' for dev
};

// Check Sources → Page shows original files
// Set breakpoints in original source
// Stack traces show original line numbers
```

---

## 🌐 Network Panel

### Analyzing Requests

```
Key Information:
• Status code (green=success, red=error)
• Type (XHR, Fetch, Document, Script, etc.)
• Size (transferred vs actual)
• Time (DNS, Connection, Waiting, Content Download)
• Waterfall visualization

Filters:
• By type: XHR, JS, CSS, Img, etc.
• By text: Filter by URL
• Invert: Show everything except filter
• Has blocked cookies
• Blocked requests
```

### Request Details

```
Headers Tab:
• Request/Response headers
• Query string parameters
• Form data

Preview/Response Tab:
• Parsed response (JSON formatted)
• Raw response

Timing Tab:
• Queueing: Request waiting
• Stalled: Before connection
• DNS Lookup
• Initial Connection / SSL
• Request Sent
• Waiting (TTFB)
• Content Download

Initiator Tab:
• What triggered the request
• Call stack to source
```

### Throttling & Offline

```
Network conditions:
• Throttle: Slow 3G, Fast 3G, Offline
• Custom profiles

Testing offline:
• Check "Offline" checkbox
• Test service worker behavior
• Verify cached resources work

Preserve log:
• Keep requests across navigations
• Debug redirect chains
```

---

## ⚡ Performance Panel

### Recording Performance

```
1. Click Record (Cmd+E)
2. Perform the action to profile
3. Click Stop
4. Analyze the timeline

Key Metrics:
• FPS: Frames per second (green = good)
• CPU: Main thread activity
• NET: Network requests
• Heap: Memory usage

Main Thread Analysis:
• Yellow: JavaScript execution
• Purple: Layout/Rendering
• Green: Painting
• Gray: System/Idle
```

### Identifying Issues

```
Long Tasks (>50ms):
• Red triangle indicator
• Blocks main thread
• Causes janky UI

Layout Thrashing:
• Purple "Layout" bars
• Forced synchronous layouts
• Look for read→write→read patterns

JavaScript Bottlenecks:
• Yellow "Script" bars
• Expand to see function names
• Find slow functions

Paint Issues:
• Enable "Paint flashing"
• Green flashes show repainted areas
• Too much flashing = performance issue
```

### Flame Chart Reading

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLAME CHART                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Width = Time spent                                             │
│   Depth = Call stack                                             │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ onClick (50ms)                                           │   │
│   │ ┌──────────────────────────────────────────────────┐    │   │
│   │ │ handleSubmit (45ms)                               │    │   │
│   │ │ ┌─────────────────────┐ ┌────────────────────┐   │    │   │
│   │ │ │ validateForm (20ms) │ │ submitData (20ms)  │   │    │   │
│   │ │ │ ┌──────┐ ┌───────┐ │ │ ┌────────────────┐ │   │    │   │
│   │ │ │ │check │ │format │ │ │ │  fetch (15ms)  │ │   │    │   │
│   │ │ └─┴──────┴─┴───────┴─┘ └─┴────────────────┴─┘   │    │   │
│   │ └──────────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   Look for: Wide bars at bottom (slow leaf functions)            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Memory Panel

### Heap Snapshot

```
Take Snapshot:
1. Click "Take heap snapshot"
2. Compare multiple snapshots to find leaks

Views:
• Summary: Objects grouped by constructor
• Containment: Object hierarchy
• Statistics: Memory distribution

Key Columns:
• Shallow Size: Object's own memory
• Retained Size: Memory freed if object is GC'd

Finding Leaks:
1. Take snapshot before action
2. Perform action multiple times
3. Take snapshot after
4. Compare: Objects between 1 and 2
5. Look for unexpected retained objects
```

### Allocation Timeline

```
1. Start "Allocation instrumentation on timeline"
2. Perform actions
3. Stop recording
4. Blue bars = allocations
5. Click to see retained objects
6. Gray bars = freed memory

Pattern for finding leaks:
• Repeatedly do action
• If blue bars grow without gray bars
• Memory is being retained
```

### Common Memory Leaks

```javascript
// 1. Forgotten timers
setInterval(() => {
    hugeObject.doSomething(); // hugeObject never freed
}, 1000);
// Solution: Clear interval when done

// 2. Closures holding references
function outer() {
    const hugeData = new Array(1000000);
    return function inner() {
        // hugeData is retained
        console.log('inner');
    };
}
// Solution: nullify when not needed

// 3. Detached DOM nodes
const element = document.createElement('div');
element.innerHTML = '<img src="...">';
// Element removed from DOM but still in memory
// Solution: Remove references

// 4. Event listeners not removed
element.addEventListener('click', handler);
element.remove();
// Handler still holds reference
// Solution: removeEventListener

// 5. Global variables
window.cache = { hugeData: [...] };
// Never garbage collected
// Solution: Use WeakMap or clean up
```

---

## 🎯 Lighthouse Panel

### Running Audits

```
Categories:
• Performance: Core Web Vitals, speed metrics
• Accessibility: a11y issues
• Best Practices: Security, modern standards
• SEO: Search optimization
• PWA: Progressive Web App checklist

Key Metrics:
• First Contentful Paint (FCP)
• Largest Contentful Paint (LCP)
• Total Blocking Time (TBT)
• Cumulative Layout Shift (CLS)
• Speed Index

Tips:
• Use Incognito mode (no extensions)
• Choose device emulation
• Run multiple times for consistency
• Focus on opportunities and diagnostics
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Làm sao debug JavaScript trong DevTools?**

A: Sources panel → Set breakpoints → Step through code. Use console.log, debugger statement, or click line numbers. Watch expressions và check scope for variables.

**Q: Network panel dùng để làm gì?**

A: Analyze HTTP requests - status codes, timing, headers, response. Throttle network for testing, check waterfall for bottlenecks.

### 🟡 Mid-level

**Q: Làm sao tìm memory leak?**

A:
1. Memory panel → Take heap snapshot before
2. Perform suspected action multiple times
3. Take snapshot after
4. Compare snapshots
5. Look for objects that should be freed but aren't

**Q: Performance panel flame chart?**

A: Width = time spent, depth = call stack. Look for wide bars at bottom (slow functions), long tasks (>50ms), layout thrashing (purple bars).

### 🔴 Senior

**Q: Debug production performance issue**

A:
1. Lighthouse for overview
2. Performance panel for detailed trace
3. Identify long tasks and main thread blocks
4. Check for layout thrashing
5. Memory panel for leaks
6. Network panel for slow requests
7. Coverage for unused code
8. Layers panel for compositing issues

---

## 📚 Active Recall

1. [ ] 5 Console utility functions
2. [ ] 3 types of breakpoints
3. [ ] Performance flame chart interpretation
4. [ ] Memory leak detection steps
5. [ ] Core Web Vitals in Lighthouse

---

> **Tiếp theo:** [mindmap-browser.md](./mindmap-browser.md) - Browser Mind Map
