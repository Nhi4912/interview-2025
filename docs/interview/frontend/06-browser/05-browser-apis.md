# Browser APIs - Modern Web APIs

> Modern Browser APIs enable powerful functionality. Master these for senior-level development.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODERN BROWSER APIS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   OBSERVERS                         WORKERS                      │
│   ┌─────────────────────┐          ┌─────────────────────┐      │
│   │ IntersectionObserver│          │ Web Workers         │      │
│   │ MutationObserver    │          │ Service Workers     │      │
│   │ ResizeObserver      │          │ Shared Workers      │      │
│   │ PerformanceObserver │          │                     │      │
│   └─────────────────────┘          └─────────────────────┘      │
│                                                                   │
│   TIMING                            COMMUNICATION                │
│   ┌─────────────────────┐          ┌─────────────────────┐      │
│   │ requestAnimationFrame│         │ postMessage         │      │
│   │ requestIdleCallback │          │ BroadcastChannel    │      │
│   │ setTimeout/Interval │          │ WebSockets          │      │
│   └─────────────────────┘          └─────────────────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👁️ Intersection Observer

### Basic Usage

```javascript
// Observe when elements enter/exit viewport

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Element visible:', entry.target);
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, {
    root: null,          // Viewport (null = browser viewport)
    rootMargin: '0px',   // Margin around root
    threshold: 0.5       // 50% visible triggers callback
});

// Start observing
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Stop observing
observer.unobserve(element);
observer.disconnect(); // Stop all
```

### Lazy Loading Images

```javascript
// Lazy load images when they enter viewport

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Load 50px before visible
    });

    images.forEach(img => imageObserver.observe(img));
}

// HTML
// <img data-src="image.jpg" alt="Lazy loaded">
```

### Infinite Scroll

```javascript
function setupInfiniteScroll(loadMore) {
    const sentinel = document.querySelector('#scroll-sentinel');

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMore();
        }
    }, {
        rootMargin: '100px'
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
}

// Usage
setupInfiniteScroll(async () => {
    const newItems = await fetchMoreItems();
    appendToList(newItems);
});
```

---

## 🔄 Mutation Observer

### Observing DOM Changes

```javascript
// Watch for DOM mutations

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        console.log('Mutation type:', mutation.type);

        if (mutation.type === 'childList') {
            console.log('Added nodes:', mutation.addedNodes);
            console.log('Removed nodes:', mutation.removedNodes);
        }

        if (mutation.type === 'attributes') {
            console.log('Attribute changed:', mutation.attributeName);
            console.log('Old value:', mutation.oldValue);
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,      // Watch for added/removed children
    subtree: true,        // Watch all descendants
    attributes: true,     // Watch attribute changes
    attributeOldValue: true,
    characterData: true,  // Watch text content changes
    characterDataOldValue: true
});

// Stop
observer.disconnect();
```

### Practical Use Cases

```javascript
// 1. Watch for dynamically added elements
function watchForElements(selector, callback) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    if (node.matches(selector)) {
                        callback(node);
                    }
                    // Check children too
                    node.querySelectorAll?.(selector).forEach(callback);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    return () => observer.disconnect();
}

// Usage - handle dynamically added buttons
watchForElements('.dynamic-button', (button) => {
    button.addEventListener('click', handleClick);
});

// 2. Sync DOM to external state
function syncToExternalState(element, onSync) {
    const observer = new MutationObserver(() => {
        onSync(element.innerHTML);
    });

    observer.observe(element, {
        childList: true,
        subtree: true,
        characterData: true
    });
}
```

---

## 📐 Resize Observer

### Observing Element Size Changes

```javascript
const observer = new ResizeObserver((entries) => {
    entries.forEach(entry => {
        const { width, height } = entry.contentRect;
        console.log(`Size: ${width}x${height}`);

        // entry.borderBoxSize - includes padding + border
        // entry.contentBoxSize - content only
    });
});

observer.observe(document.querySelector('.resizable'));
```

### Responsive Components

```javascript
// Make components respond to their container, not viewport

function createResponsiveComponent(element) {
    const breakpoints = {
        small: 300,
        medium: 600,
        large: 900
    };

    const observer = new ResizeObserver((entries) => {
        entries.forEach(entry => {
            const width = entry.contentRect.width;

            // Remove all size classes
            element.classList.remove('size-small', 'size-medium', 'size-large');

            // Add appropriate class
            if (width < breakpoints.small) {
                element.classList.add('size-small');
            } else if (width < breakpoints.medium) {
                element.classList.add('size-medium');
            } else {
                element.classList.add('size-large');
            }
        });
    });

    observer.observe(element);

    return () => observer.disconnect();
}

// Now component responds to container width, not viewport
// Works great for reusable components in different contexts
```

---

## 👷 Web Workers

### Basic Web Worker

```javascript
// main.js
const worker = new Worker('worker.js');

// Send message to worker
worker.postMessage({ type: 'COMPUTE', data: [1, 2, 3, 4, 5] });

// Receive result
worker.onmessage = (event) => {
    console.log('Result:', event.data);
};

worker.onerror = (error) => {
    console.error('Worker error:', error);
};

// Terminate when done
// worker.terminate();

// worker.js
self.onmessage = (event) => {
    const { type, data } = event.data;

    if (type === 'COMPUTE') {
        // Heavy computation off main thread
        const result = data.reduce((sum, n) => sum + n, 0);
        self.postMessage(result);
    }
};
```

### Inline Worker

```javascript
// Create worker from inline code
function createInlineWorker(fn) {
    const blob = new Blob([`(${fn.toString()})()`], {
        type: 'application/javascript'
    });
    return new Worker(URL.createObjectURL(blob));
}

const worker = createInlineWorker(() => {
    self.onmessage = (e) => {
        const result = e.data * 2;
        self.postMessage(result);
    };
});

worker.postMessage(21);
worker.onmessage = (e) => console.log(e.data); // 42
```

### Transferable Objects

```javascript
// Transfer ownership instead of copying (faster for large data)

// ArrayBuffer
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // Transfer, not copy
// buffer is now unusable in main thread

// OffscreenCanvas
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);
```

---

## ⏰ Timing APIs

### requestAnimationFrame

```javascript
// Sync with display refresh rate (usually 60fps)

function animate(timestamp) {
    // Update animation
    element.style.transform = `translateX(${position}px)`;

    // Continue animation
    requestAnimationFrame(animate);
}

const animationId = requestAnimationFrame(animate);

// Cancel
cancelAnimationFrame(animationId);

// Smooth animation with delta time
let lastTime = 0;
function smoothAnimate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Move at consistent speed regardless of frame rate
    const speed = 0.5; // pixels per millisecond
    position += speed * deltaTime;

    requestAnimationFrame(smoothAnimate);
}
```

### requestIdleCallback

```javascript
// Run non-critical work when browser is idle

function processQueue(deadline) {
    // deadline.timeRemaining() - time left in idle period
    // deadline.didTimeout - true if we should run anyway

    while (queue.length > 0 && deadline.timeRemaining() > 0) {
        const task = queue.shift();
        task();
    }

    if (queue.length > 0) {
        requestIdleCallback(processQueue);
    }
}

requestIdleCallback(processQueue, {
    timeout: 2000 // Max wait time
});

// Use for:
// • Analytics
// • Pre-fetching
// • Logging
// • Non-critical updates
```

### Scheduling Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIMING APIS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   setTimeout/setInterval                                         │
│   • Minimum delay ~4ms                                           │
│   • Not synced with display                                      │
│   • Can cause jank in animations                                 │
│                                                                   │
│   requestAnimationFrame                                          │
│   • Synced with display refresh (60fps = 16.67ms)               │
│   • Paused when tab inactive                                     │
│   • Best for animations                                          │
│                                                                   │
│   requestIdleCallback                                            │
│   • Runs when browser is idle                                    │
│   • Low priority                                                  │
│   • May be delayed indefinitely                                  │
│   • Best for non-critical work                                   │
│                                                                   │
│   queueMicrotask                                                 │
│   • Runs after current task, before rendering                    │
│   • Higher priority than setTimeout                              │
│   • Use for critical async work                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 Communication APIs

### BroadcastChannel

```javascript
// Communicate between tabs/windows of same origin

// Tab 1
const channel = new BroadcastChannel('my-channel');

channel.postMessage({ type: 'USER_LOGGED_IN', user: { id: 1 } });

// Tab 2
const channel = new BroadcastChannel('my-channel');

channel.onmessage = (event) => {
    if (event.data.type === 'USER_LOGGED_IN') {
        updateUI(event.data.user);
    }
};

// Close when done
channel.close();
```

### postMessage (Cross-Origin)

```javascript
// Parent window → iframe
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage(
    { type: 'INIT', data: 'hello' },
    'https://trusted-origin.com' // Target origin
);

// Iframe → parent
window.parent.postMessage(
    { type: 'READY' },
    'https://parent-origin.com'
);

// Receive messages
window.addEventListener('message', (event) => {
    // ALWAYS verify origin!
    if (event.origin !== 'https://trusted-origin.com') {
        return;
    }

    console.log('Message:', event.data);
});
```

---

## 🔧 Other Useful APIs

### Performance Observer

```javascript
// Observe performance entries

const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
        console.log(entry.name, entry.duration);
    });
});

observer.observe({
    entryTypes: ['measure', 'mark', 'longtask', 'paint']
});

// Create marks and measures
performance.mark('start-task');
// ... do work ...
performance.mark('end-task');
performance.measure('task-duration', 'start-task', 'end-task');
```

### Clipboard API

```javascript
// Modern clipboard API

// Write text
await navigator.clipboard.writeText('Hello, World!');

// Read text
const text = await navigator.clipboard.readText();

// Write complex data
const blob = new Blob(['<p>Hello</p>'], { type: 'text/html' });
await navigator.clipboard.write([
    new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob(['Hello'], { type: 'text/plain' })
    })
]);
```

### Geolocation API

```javascript
// Get current position
navigator.geolocation.getCurrentPosition(
    (position) => {
        console.log('Lat:', position.coords.latitude);
        console.log('Lng:', position.coords.longitude);
        console.log('Accuracy:', position.coords.accuracy);
    },
    (error) => {
        console.error('Error:', error.message);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
);

// Watch position
const watchId = navigator.geolocation.watchPosition(callback);
navigator.geolocation.clearWatch(watchId);
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: IntersectionObserver dùng để làm gì?**

A: Observe khi elements enter/exit viewport. Use cases: lazy loading images, infinite scroll, animate on scroll, track visibility for analytics.

**Q: Web Worker là gì?**

A: Run JavaScript trong background thread, không block main thread. Good for heavy computations, data processing, keeping UI responsive.

### 🟡 Mid-level

**Q: requestAnimationFrame vs setTimeout?**

A:
- rAF: Synced with display refresh, paused when tab inactive, optimal for animations
- setTimeout: Not synced, can cause jank, minimum ~4ms delay

**Q: MutationObserver use cases?**

A: Watch for DOM changes - added/removed elements, attribute changes. Use for: handling dynamic content, syncing state, third-party script integration.

### 🔴 Senior

**Q: Design efficient observer pattern for large lists**

A:
1. Single IntersectionObserver for all items (not one per item)
2. Unobserve items after they've loaded
3. Use rootMargin for prefetching
4. Batch DOM updates with requestAnimationFrame
5. Consider virtual scrolling for very large lists

---

## 📚 Active Recall

1. [ ] IntersectionObserver options
2. [ ] MutationObserver config options
3. [ ] Web Worker communication
4. [ ] rAF vs rIC vs setTimeout
5. [ ] BroadcastChannel purpose

---

> **Tiếp theo:** [06-devtools-mastery.md](./06-devtools-mastery.md) - DevTools Mastery
