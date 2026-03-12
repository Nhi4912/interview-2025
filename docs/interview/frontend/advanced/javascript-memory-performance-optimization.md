---
layout: page
title: "JavaScript Memory Management and Performance Optimization"
description: "Advanced techniques for JavaScript memory management, performance optimization, and debugging in modern web applications"
category: advanced
tags: [javascript, performance, memory-management, optimization, debugging, advanced, gc]
---

# Modern JavaScript Memory Management and Performance Optimization

## 🎯 Overview

Memory management and performance optimization are critical topics in frontend interviews at big tech companies. This guide covers advanced concepts from garbage collection to micro-optimizations, enabling you to demonstrate deep JavaScript knowledge.

## 🧠 JavaScript Memory Model

### 1. Memory Allocation and Management

{% raw %}
```javascript
// Memory allocation visualization
class MemoryAnalyzer {
  constructor() {
    this.allocations = new Map();
    this.totalAllocated = 0;
    this.gcCycles = 0;
  }
  
  // Simulate memory allocation tracking
  trackAllocation(type, size, reference = null) {
    const allocation = {
      id: Date.now() + Math.random(),
      type,
      size,
      timestamp: performance.now(),
      reference,
      alive: true
    };
    
    this.allocations.set(allocation.id, allocation);
    this.totalAllocated += size;
    
    console.log(`📦 Allocated ${size} bytes for ${type} (Total: ${this.totalAllocated} bytes)`);
    
    return allocation.id;
  }
  
  // Simulate garbage collection
  simulateGC() {
    console.log('🗑️  Starting garbage collection...');
    const beforeSize = this.totalAllocated;
    let collected = 0;
    
    // Mark and sweep simulation
    this.markPhase();
    collected = this.sweepPhase();
    
    this.gcCycles++;
    const afterSize = this.totalAllocated;
    
    console.log(`✅ GC completed: Collected ${collected} bytes (${beforeSize} → ${afterSize})`);
    
    return {
      beforeSize,
      afterSize,
      collected,
      gcCycles: this.gcCycles
    };
  }
  
  markPhase() {
    console.log('🔍 Mark phase: Identifying reachable objects...');
    
    // Simulate marking reachable objects
    this.allocations.forEach((allocation, id) => {
      // Check if object is still referenced
      const isReachable = this.isObjectReachable(allocation);
      allocation.marked = isReachable;
      
      if (!isReachable) {
        console.log(`  📍 Marked for collection: ${allocation.type} (${allocation.size} bytes)`);
      }
    });
  }
  
  sweepPhase() {
    console.log('🧹 Sweep phase: Deallocating unreachable objects...');
    let collected = 0;
    
    for (const [id, allocation] of this.allocations) {
      if (!allocation.marked) {
        collected += allocation.size;
        this.totalAllocated -= allocation.size;
        this.allocations.delete(id);
        console.log(`  🗑️  Collected: ${allocation.type} (${allocation.size} bytes)`);
      }
    }
    
    return collected;
  }
  
  isObjectReachable(allocation) {
    // Simplified reachability check
    if (!allocation.reference) return false;
    
    try {
      // Check if reference still exists
      return allocation.reference !== null && typeof allocation.reference === 'object';
    } catch (e) {
      return false;
    }
  }
  
  // Memory leak detection
  detectMemoryLeaks() {
    console.log('🔍 Scanning for potential memory leaks...');
    
    const leaks = [];
    const now = performance.now();
    
    this.allocations.forEach((allocation, id) => {
      const age = now - allocation.timestamp;
      
      // Objects alive for more than 30 seconds might be leaks
      if (age > 30000) {
        leaks.push({
          id,
          type: allocation.type,
          age: `${(age / 1000).toFixed(2)}s`,
          size: allocation.size
        });
      }
    });
    
    if (leaks.length > 0) {
      console.warn('⚠️  Potential memory leaks detected:');
      console.table(leaks);
    } else {
      console.log('✅ No memory leaks detected');
    }
    
    return leaks;
  }
  
  // Memory pressure simulation
  simulateMemoryPressure() {
    console.log('📊 Memory pressure analysis:');
    
    const pressure = {
      totalAllocated: this.totalAllocated,
      allocationCount: this.allocations.size,
      averageObjectSize: this.totalAllocated / this.allocations.size || 0,
      gcCycles: this.gcCycles,
      pressure: this.calculatePressure()
    };
    
    console.table(pressure);
    
    if (pressure.pressure > 0.8) {
      console.warn('⚠️  High memory pressure! Consider optimizing allocations.');
      this.suggestOptimizations();
    }
    
    return pressure;
  }
  
  calculatePressure() {
    // Simplified pressure calculation
    const maxMemory = 100 * 1024 * 1024; // 100MB limit
    return Math.min(this.totalAllocated / maxMemory, 1);
  }
  
  suggestOptimizations() {
    console.log('💡 Memory optimization suggestions:');
    console.log('  - Use object pooling for frequently created objects');
    console.log('  - Implement weak references for caches');
    console.log('  - Remove event listeners when no longer needed');
    console.log('  - Use streaming for large data processing');
    console.log('  - Consider lazy loading for non-critical resources');
  }
}

// Usage example
const memoryAnalyzer = new MemoryAnalyzer();

// Simulate different allocation patterns
const objRef = { data: new Array(1000).fill(0) };
memoryAnalyzer.trackAllocation('Array', 8000, objRef);

const funcRef = function() { return 'example'; };
memoryAnalyzer.trackAllocation('Function', 1000, funcRef);

// Simulate memory leak
memoryAnalyzer.trackAllocation('LeakyObject', 5000, { circular: objRef });

// Run analysis
memoryAnalyzer.simulateGC();
memoryAnalyzer.detectMemoryLeaks();
memoryAnalyzer.simulateMemoryPressure();
```
{% endraw %}

### 2. Memory Leak Prevention Patterns

```javascript
// Common memory leak patterns and solutions
class MemoryLeakPrevention {
  
  // 1. Event Listener Cleanup
  static createSafeEventHandler() {
    class SafeEventHandler {
      constructor(element) {
        this.element = element;
        this.handlers = new Map();
        this.abortController = new AbortController();
      }
      
      addEventListener(event, handler, options = {}) {
        // Use AbortController for automatic cleanup
        const safeOptions = {
          ...options,
          signal: this.abortController.signal
        };
        
        this.element.addEventListener(event, handler, safeOptions);
        this.handlers.set(event, handler);
        
        console.log(`✅ Added event listener: ${event}`);
      }
      
      removeEventListener(event) {
        const handler = this.handlers.get(event);
        if (handler) {
          this.element.removeEventListener(event, handler);
          this.handlers.delete(event);
          console.log(`🗑️  Removed event listener: ${event}`);
        }
      }
      
      destroy() {
        // Clean up all event listeners at once
        this.abortController.abort();
        this.handlers.clear();
        console.log('🧹 All event listeners cleaned up');
      }
    }
    
    return SafeEventHandler;
  }
  
  // 2. WeakMap/WeakSet for Caching
  static createWeakCache() {
    return class WeakCache {
      constructor() {
        this.cache = new WeakMap();
        this.metadata = new Map(); // For debugging only
      }
      
      set(key, value) {
        if (typeof key !== 'object' || key === null) {
          throw new Error('WeakMap keys must be objects');
        }
        
        this.cache.set(key, value);
        this.metadata.set(key, {
          timestamp: Date.now(),
          accessed: 0
        });
        
        console.log('📝 Cached value with weak reference');
      }
      
      get(key) {
        if (this.cache.has(key)) {
          const meta = this.metadata.get(key);
          if (meta) {
            meta.accessed++;
            meta.lastAccessed = Date.now();
          }
          return this.cache.get(key);
        }
        return undefined;
      }
      
      // Note: WeakMap doesn't have size/forEach, so this is for demonstration
      getStats() {
        return {
          metadataEntries: this.metadata.size,
          message: 'Actual cache size unknown (WeakMap limitation)'
        };
      }
    };
  }
  
  // 3. Closure Memory Management
  static createSafeClosures() {
    // Bad: Creates memory leak
    function createLeakyClosures() {
      const hugeData = new Array(1000000).fill('data');
      
      return {
        // This closure holds reference to entire hugeData
        getFirst: () => hugeData[0],
        // This too
        getLast: () => hugeData[hugeData.length - 1]
      };
    }
    
    // Good: Extracts needed data
    function createSafeClosures() {
      const hugeData = new Array(1000000).fill('data');
      
      // Extract only what's needed
      const firstItem = hugeData[0];
      const lastItem = hugeData[hugeData.length - 1];
      
      // hugeData can now be garbage collected
      return {
        getFirst: () => firstItem,
        getLast: () => lastItem
      };
    }
    
    return { createLeakyClosures, createSafeClosures };
  }
  
  // 4. Timer Cleanup
  static createSafeTimer() {
    return class SafeTimer {
      constructor() {
        this.timers = new Set();
        this.intervals = new Set();
      }
      
      setTimeout(callback, delay) {
        const timerId = setTimeout(() => {
          callback();
          this.timers.delete(timerId);
        }, delay);
        
        this.timers.add(timerId);
        return timerId;
      }
      
      setInterval(callback, interval) {
        const intervalId = setInterval(callback, interval);
        this.intervals.add(intervalId);
        return intervalId;
      }
      
      clearTimeout(timerId) {
        clearTimeout(timerId);
        this.timers.delete(timerId);
      }
      
      clearInterval(intervalId) {
        clearInterval(intervalId);
        this.intervals.delete(intervalId);
      }
      
      clearAll() {
        // Clean up all timers and intervals
        this.timers.forEach(id => clearTimeout(id));
        this.intervals.forEach(id => clearInterval(id));
        
        this.timers.clear();
        this.intervals.clear();
        
        console.log('🧹 All timers and intervals cleared');
      }
    };
  }
  
  // 5. DOM Reference Management
  static createSafeDOMManager() {
    return class SafeDOMManager {
      constructor() {
        this.elements = new WeakSet();
        this.observers = new Set();
      }
      
      createElement(tag, parent = document.body) {
        const element = document.createElement(tag);
        parent.appendChild(element);
        
        this.elements.add(element);
        
        // Add cleanup on removal
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
              if (node === element) {
                this.cleanup(element);
              }
            });
          });
        });
        
        observer.observe(parent, { childList: true });
        this.observers.add(observer);
        
        return element;
      }
      
      cleanup(element) {
        // Remove all event listeners
        element.replaceWith(element.cloneNode(true));
        console.log('🧹 Element cleaned up');
      }
      
      destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        console.log('🧹 DOM manager destroyed');
      }
    };
  }
}
```

## ⚡ Performance Optimization Techniques

### 1. Object Pooling

```javascript
// Object pooling for performance optimization
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.activeObjects = new Set();
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
    
    console.log(`🏊‍♂️ Object pool initialized with ${initialSize} objects`);
  }
  
  acquire() {
    let obj;
    
    if (this.pool.length > 0) {
      obj = this.pool.pop();
      console.log(`♻️  Reused object from pool (${this.pool.length} remaining)`);
    } else {
      obj = this.createFn();
      console.log('🆕 Created new object (pool exhausted)');
    }
    
    this.activeObjects.add(obj);
    return obj;
  }
  
  release(obj) {
    if (!this.activeObjects.has(obj)) {
      console.warn('⚠️  Attempted to release object not from this pool');
      return;
    }
    
    this.activeObjects.delete(obj);
    this.resetFn(obj);
    this.pool.push(obj);
    
    console.log(`🔄 Object returned to pool (${this.pool.length} available)`);
  }
  
  getStats() {
    return {
      poolSize: this.pool.length,
      activeObjects: this.activeObjects.size,
      totalCreated: this.pool.length + this.activeObjects.size
    };
  }
}

// Example: Vector3 object pool for 3D graphics
class Vector3Pool {
  static instance = null;
  
  static getInstance() {
    if (!Vector3Pool.instance) {
      Vector3Pool.instance = new ObjectPool(
        () => new Vector3(0, 0, 0),
        (vector) => vector.set(0, 0, 0),
        50 // Initial pool size
      );
    }
    return Vector3Pool.instance;
  }
}

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  
  add(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }
  
  static create(x, y, z) {
    return Vector3Pool.getInstance().acquire().set(x, y, z);
  }
  
  destroy() {
    Vector3Pool.getInstance().release(this);
  }
}

// Usage example
console.log('🎮 Vector3 pooling demonstration:');

const vectors = [];
for (let i = 0; i < 5; i++) {
  const vector = Vector3.create(i, i * 2, i * 3);
  vectors.push(vector);
}

console.log('Pool stats after creation:', Vector3Pool.getInstance().getStats());

// Release vectors back to pool
vectors.forEach(vector => vector.destroy());

console.log('Pool stats after release:', Vector3Pool.getInstance().getStats());
```

### 2. Lazy Loading and Code Splitting

```javascript
// Advanced lazy loading implementation
class LazyLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
    this.observers = new Set();
  }
  
  // Lazy load modules with caching
  async loadModule(modulePath, options = {}) {
    const {
      timeout = 10000,
      retries = 3,
      preload = false
    } = options;
    
    // Check cache first
    if (this.cache.has(modulePath)) {
      console.log(`📋 Module loaded from cache: ${modulePath}`);
      return this.cache.get(modulePath);
    }
    
    // Check if already loading
    if (this.loading.has(modulePath)) {
      console.log(`⏳ Module already loading: ${modulePath}`);
      return this.loading.get(modulePath);
    }
    
    console.log(`📦 Loading module: ${modulePath}`);
    
    const loadPromise = this.loadWithRetry(modulePath, retries, timeout);
    this.loading.set(modulePath, loadPromise);
    
    try {
      const module = await loadPromise;
      this.cache.set(modulePath, module);
      this.loading.delete(modulePath);
      
      console.log(`✅ Module loaded successfully: ${modulePath}`);
      return module;
    } catch (error) {
      this.loading.delete(modulePath);
      console.error(`❌ Failed to load module: ${modulePath}`, error);
      throw error;
    }
  }
  
  async loadWithRetry(modulePath, retries, timeout) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        // Dynamic import with timeout
        const module = await Promise.race([
          import(modulePath),
          new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => {
              reject(new Error(`Module load timeout: ${modulePath}`));
            });
          })
        ]);
        
        clearTimeout(timeoutId);
        return module;
        
      } catch (error) {
        console.warn(`⚠️  Attempt ${attempt}/${retries} failed for ${modulePath}:`, error.message);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  // Preload modules based on user interaction
  setupPreloading() {
    // Preload on hover
    document.addEventListener('mouseover', (event) => {
      const preloadPath = event.target.dataset.preload;
      if (preloadPath && !this.cache.has(preloadPath)) {
        console.log(`🚀 Preloading on hover: ${preloadPath}`);
        this.loadModule(preloadPath).catch(() => {}); // Silent fail for preloads
      }
    });
    
    // Preload on intersection (for viewport visibility)
    this.setupIntersectionPreloading();
  }
  
  setupIntersectionPreloading() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const preloadPath = entry.target.dataset.preloadOnVisible;
          if (preloadPath && !this.cache.has(preloadPath)) {
            console.log(`👁️  Preloading on visibility: ${preloadPath}`);
            this.loadModule(preloadPath).catch(() => {});
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.1 });
    
    // Observe elements with preload attributes
    document.querySelectorAll('[data-preload-on-visible]').forEach((el) => {
      observer.observe(el);
    });
    
    this.observers.add(observer);
  }
  
  // Intelligent prefetching based on user behavior
  setupIntelligentPrefetching() {
    const userBehavior = {
      clickPatterns: new Map(),
      navigationHistory: [],
      preferences: new Set()
    };
    
    // Track user navigation patterns
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (link) {
        const href = link.getAttribute('href');
        const count = userBehavior.clickPatterns.get(href) || 0;
        userBehavior.clickPatterns.set(href, count + 1);
        
        // Prefetch frequently visited pages
        if (count >= 2) {
          const modulePath = this.getModuleForRoute(href);
          if (modulePath) {
            console.log(`🧠 Intelligent prefetch: ${modulePath}`);
            this.loadModule(modulePath).catch(() => {});
          }
        }
      }
    });
    
    return userBehavior;
  }
  
  getModuleForRoute(route) {
    // Map routes to modules (simplified)
    const routeMap = {
      '/dashboard': './modules/dashboard.js',
      '/profile': './modules/profile.js',
      '/settings': './modules/settings.js'
    };
    
    return routeMap[route];
  }
  
  // Memory management for cache
  limitCacheSize(maxSize = 50) {
    if (this.cache.size > maxSize) {
      const entries = Array.from(this.cache.entries());
      const toRemove = entries.slice(0, this.cache.size - maxSize);
      
      toRemove.forEach(([key]) => {
        this.cache.delete(key);
        console.log(`🗑️  Removed from cache: ${key}`);
      });
    }
  }
  
  getStats() {
    return {
      cacheSize: this.cache.size,
      currentlyLoading: this.loading.size,
      cachedModules: Array.from(this.cache.keys())
    };
  }
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.cache.clear();
    this.loading.clear();
    this.observers.clear();
  }
}

// Usage example
const lazyLoader = new LazyLoader();
lazyLoader.setupPreloading();
lazyLoader.setupIntelligentPrefetching();

// Example of lazy loading a component
async function loadDashboard() {
  try {
    const dashboardModule = await lazyLoader.loadModule('./dashboard.js');
    const Dashboard = dashboardModule.default;
    
    // Render dashboard
    const dashboardInstance = new Dashboard();
    dashboardInstance.render();
    
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}
```

### 3. Virtual Scrolling Implementation

```javascript
// High-performance virtual scrolling
class VirtualScrollList {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      itemHeight: 50,
      bufferSize: 5,
      itemRenderer: null,
      estimateHeight: false,
      ...options
    };
    
    this.data = [];
    this.scrollTop = 0;
    this.containerHeight = 0;
    this.visibleItems = [];
    this.renderedElements = new Map();
    this.elementPool = [];
    
    this.init();
  }
  
  init() {
    this.setupContainer();
    this.setupScrollHandler();
    this.measureContainer();
    
    console.log('📜 Virtual scroll list initialized');
  }
  
  setupContainer() {
    this.container.style.overflow = 'auto';
    this.container.style.position = 'relative';
    
    // Create scrollable content
    this.scrollContent = document.createElement('div');
    this.scrollContent.style.position = 'relative';
    this.container.appendChild(this.scrollContent);
    
    // Create viewport for visible items
    this.viewport = document.createElement('div');
    this.viewport.style.position = 'absolute';
    this.viewport.style.top = '0';
    this.viewport.style.left = '0';
    this.viewport.style.width = '100%';
    this.scrollContent.appendChild(this.viewport);
  }
  
  setupScrollHandler() {
    let ticking = false;
    
    this.container.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  measureContainer() {
    this.containerHeight = this.container.clientHeight;
  }
  
  setData(data) {
    this.data = data;
    this.updateScrollHeight();
    this.updateVisibleItems();
    
    console.log(`📊 Virtual scroll data set: ${data.length} items`);
  }
  
  updateScrollHeight() {
    const totalHeight = this.data.length * this.options.itemHeight;
    this.scrollContent.style.height = `${totalHeight}px`;
  }
  
  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.updateVisibleItems();
  }
  
  updateVisibleItems() {
    const startIndex = Math.floor(this.scrollTop / this.options.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.options.itemHeight),
      this.data.length - 1
    );
    
    // Add buffer
    const bufferedStart = Math.max(0, startIndex - this.options.bufferSize);
    const bufferedEnd = Math.min(this.data.length - 1, endIndex + this.options.bufferSize);
    
    this.renderVisibleItems(bufferedStart, bufferedEnd);
  }
  
  renderVisibleItems(startIndex, endIndex) {
    // Performance measurement
    const startTime = performance.now();
    
    // Clear existing items
    this.clearViewport();
    
    // Render visible items
    for (let i = startIndex; i <= endIndex; i++) {
      this.renderItem(i);
    }
    
    const renderTime = performance.now() - startTime;
    
    if (renderTime > 16) { // More than one frame
      console.warn(`⚠️  Slow render: ${renderTime.toFixed(2)}ms for ${endIndex - startIndex + 1} items`);
    }
  }
  
  renderItem(index) {
    const item = this.data[index];
    if (!item) return;
    
    // Get element from pool or create new
    let element = this.getElementFromPool();
    if (!element) {
      element = this.createElement();
    }
    
    // Position element
    const top = index * this.options.itemHeight;
    element.style.position = 'absolute';
    element.style.top = `${top}px`;
    element.style.left = '0';
    element.style.right = '0';
    element.style.height = `${this.options.itemHeight}px`;
    
    // Render content
    if (this.options.itemRenderer) {
      this.options.itemRenderer(element, item, index);
    } else {
      element.textContent = String(item);
    }
    
    this.viewport.appendChild(element);
    this.renderedElements.set(index, element);
  }
  
  createElement() {
    const element = document.createElement('div');
    element.style.boxSizing = 'border-box';
    element.style.padding = '8px 16px';
    element.style.borderBottom = '1px solid #eee';
    element.style.background = 'white';
    
    return element;
  }
  
  getElementFromPool() {
    return this.elementPool.pop();
  }
  
  returnElementToPool(element) {
    // Clean element
    element.textContent = '';
    element.className = '';
    element.style.transform = '';
    
    this.elementPool.push(element);
  }
  
  clearViewport() {
    // Return elements to pool
    this.renderedElements.forEach((element, index) => {
      this.viewport.removeChild(element);
      this.returnElementToPool(element);
    });
    
    this.renderedElements.clear();
  }
  
  // Performance monitoring
  getPerformanceStats() {
    return {
      dataSize: this.data.length,
      renderedElements: this.renderedElements.size,
      poolSize: this.elementPool.length,
      containerHeight: this.containerHeight,
      scrollTop: this.scrollTop,
      itemHeight: this.options.itemHeight
    };
  }
  
  // Scroll to specific item
  scrollToItem(index) {
    const targetScrollTop = index * this.options.itemHeight;
    this.container.scrollTop = targetScrollTop;
    
    console.log(`📍 Scrolled to item ${index}`);
  }
  
  // Dynamic height estimation (for variable height items)
  estimateItemHeight(index) {
    if (!this.options.estimateHeight) {
      return this.options.itemHeight;
    }
    
    // Create temporary element to measure
    const tempElement = this.createElement();
    tempElement.style.visibility = 'hidden';
    tempElement.style.position = 'absolute';
    tempElement.style.top = '-9999px';
    
    if (this.options.itemRenderer) {
      this.options.itemRenderer(tempElement, this.data[index], index);
    }
    
    document.body.appendChild(tempElement);
    const height = tempElement.offsetHeight;
    document.body.removeChild(tempElement);
    
    return height;
  }
  
  destroy() {
    this.clearViewport();
    this.elementPool = [];
    this.data = [];
    this.renderedElements.clear();
    
    console.log('🧹 Virtual scroll list destroyed');
  }
}

// Usage example with performance monitoring
function createVirtualScrollDemo() {
  const container = document.getElementById('virtual-scroll-container');
  
  const virtualList = new VirtualScrollList(container, {
    itemHeight: 60,
    bufferSize: 10,
    itemRenderer: (element, item, index) => {
      element.innerHTML = `
        <div style="display: flex; align-items: center; height: 100%;">
          <div style="width: 40px; height: 40px; background: #007bff; border-radius: 50%; margin-right: 12px;"></div>
          <div>
            <div style="font-weight: bold;">${item.name}</div>
            <div style="color: #666; font-size: 14px;">${item.email}</div>
          </div>
        </div>
      `;
    }
  });
  
  // Generate large dataset
  const data = Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`
  }));
  
  virtualList.setData(data);
  
  // Performance monitoring
  setInterval(() => {
    const stats = virtualList.getPerformanceStats();
    console.log('📊 Virtual scroll stats:', stats);
  }, 5000);
  
  return virtualList;
}
```

## 🔍 Performance Monitoring and Debugging

### 1. Advanced Performance Profiling

```javascript
// Comprehensive performance profiler
class PerformanceProfiler {
  constructor() {
    this.measurements = new Map();
    this.markers = [];
    this.observers = new Set();
    this.isRecording = false;
  }
  
  startProfiling() {
    this.isRecording = true;
    this.setupObservers();
    this.markStart('total-profiling');
    
    console.log('🎯 Performance profiling started');
  }
  
  stopProfiling() {
    this.isRecording = false;
    this.markEnd('total-profiling');
    this.disconnectObservers();
    
    const report = this.generateReport();
    console.log('📊 Performance profiling completed');
    
    return report;
  }
  
  setupObservers() {
    // Long task observer
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordLongTask(entry);
      }
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
    this.observers.add(longTaskObserver);
    
    // Layout shift observer
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          this.recordLayoutShift(entry);
        }
      }
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.add(layoutShiftObserver);
    
    // Paint observer
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordPaintTiming(entry);
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });
    this.observers.add(paintObserver);
    
    // Navigation observer
    const navigationObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordNavigationTiming(entry);
      }
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });
    this.observers.add(navigationObserver);
  }
  
  disconnectObservers() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
  
  // Mark and measure API
  markStart(name) {
    performance.mark(`${name}-start`);
    this.markers.push({ name, start: performance.now() });
  }
  
  markEnd(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const marker = this.markers.find(m => m.name === name);
    if (marker) {
      marker.end = performance.now();
      marker.duration = marker.end - marker.start;
    }
  }
  
  // Time function execution
  timeFunction(fn, name = 'anonymous') {
    return (...args) => {
      this.markStart(name);
      
      try {
        const result = fn.apply(this, args);
        
        if (result instanceof Promise) {
          return result.finally(() => this.markEnd(name));
        } else {
          this.markEnd(name);
          return result;
        }
      } catch (error) {
        this.markEnd(name);
        throw error;
      }
    };
  }
  
  // Record different types of performance events
  recordLongTask(entry) {
    const longTask = {
      type: 'longtask',
      startTime: entry.startTime,
      duration: entry.duration,
      attribution: entry.attribution ? entry.attribution[0] : null
    };
    
    this.addMeasurement('longTasks', longTask);
    
    if (entry.duration > 50) {
      console.warn(`⚠️  Very long task detected: ${entry.duration.toFixed(2)}ms`);
    }
  }
  
  recordLayoutShift(entry) {
    const layoutShift = {
      type: 'layout-shift',
      value: entry.value,
      startTime: entry.startTime,
      sources: entry.sources?.map(source => ({
        node: source.node,
        previousRect: source.previousRect,
        currentRect: source.currentRect
      })) || []
    };
    
    this.addMeasurement('layoutShifts', layoutShift);
  }
  
  recordPaintTiming(entry) {
    const paintTiming = {
      type: 'paint',
      name: entry.name,
      startTime: entry.startTime
    };
    
    this.addMeasurement('paintTimings', paintTiming);
  }
  
  recordNavigationTiming(entry) {
    const navigation = {
      type: 'navigation',
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      domInteractive: entry.domInteractive - entry.fetchStart,
      firstByte: entry.responseStart - entry.requestStart
    };
    
    this.addMeasurement('navigation', navigation);
  }
  
  addMeasurement(category, measurement) {
    if (!this.measurements.has(category)) {
      this.measurements.set(category, []);
    }
    this.measurements.get(category).push(measurement);
  }
  
  // Memory profiling
  profileMemory() {
    if (!performance.memory) {
      console.warn('⚠️  Performance.memory not available');
      return null;
    }
    
    const memory = {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      timestamp: performance.now()
    };
    
    this.addMeasurement('memory', memory);
    return memory;
  }
  
  // Frame rate monitoring
  startFrameRateMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFrame = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        this.addMeasurement('frameRate', {
          fps,
          timestamp: currentTime
        });
        
        if (fps < 30) {
          console.warn(`⚠️  Low frame rate detected: ${fps} FPS`);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (this.isRecording) {
        requestAnimationFrame(measureFrame);
      }
    };
    
    requestAnimationFrame(measureFrame);
  }
  
  // Generate comprehensive report
  generateReport() {
    const report = {
      summary: this.generateSummary(),
      markers: this.markers,
      longTasks: this.measurements.get('longTasks') || [],
      layoutShifts: this.measurements.get('layoutShifts') || [],
      paintTimings: this.measurements.get('paintTimings') || [],
      memory: this.measurements.get('memory') || [],
      frameRate: this.measurements.get('frameRate') || [],
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }
  
  generateSummary() {
    const longTasks = this.measurements.get('longTasks') || [];
    const layoutShifts = this.measurements.get('layoutShifts') || [];
    const memory = this.measurements.get('memory') || [];
    const frameRate = this.measurements.get('frameRate') || [];
    
    return {
      totalLongTasks: longTasks.length,
      maxTaskDuration: Math.max(...longTasks.map(t => t.duration), 0),
      totalLayoutShiftScore: layoutShifts.reduce((sum, shift) => sum + shift.value, 0),
      averageMemoryUsage: memory.length > 0 
        ? memory.reduce((sum, m) => sum + m.used, 0) / memory.length 
        : 0,
      averageFPS: frameRate.length > 0 
        ? frameRate.reduce((sum, f) => sum + f.fps, 0) / frameRate.length 
        : 0
    };
  }
  
  generateRecommendations() {
    const recommendations = [];
    const summary = this.generateSummary();
    
    if (summary.totalLongTasks > 5) {
      recommendations.push({
        type: 'performance',
        severity: 'high',
        message: 'High number of long tasks detected. Consider code splitting or optimizing heavy operations.',
        metric: `${summary.totalLongTasks} long tasks`
      });
    }
    
    if (summary.totalLayoutShiftScore > 0.1) {
      recommendations.push({
        type: 'layout',
        severity: 'medium',
        message: 'Cumulative Layout Shift score is high. Reserve space for dynamic content.',
        metric: `CLS: ${summary.totalLayoutShiftScore.toFixed(3)}`
      });
    }
    
    if (summary.averageFPS < 45) {
      recommendations.push({
        type: 'rendering',
        severity: 'high',
        message: 'Low frame rate detected. Optimize animations and reduce main thread work.',
        metric: `Average FPS: ${summary.averageFPS.toFixed(1)}`
      });
    }
    
    return recommendations;
  }
  
  exportReport(format = 'json') {
    const report = this.generateReport();
    
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'csv':
        return this.convertToCSV(report);
      default:
        return report;
    }
  }
  
  convertToCSV(report) {
    // Simplified CSV conversion
    const lines = ['Category,Value,Timestamp'];
    
    report.longTasks.forEach(task => {
      lines.push(`Long Task,${task.duration},${task.startTime}`);
    });
    
    report.layoutShifts.forEach(shift => {
      lines.push(`Layout Shift,${shift.value},${shift.startTime}`);
    });
    
    return lines.join('\n');
  }
}

// Usage example
const profiler = new PerformanceProfiler();

// Start profiling
profiler.startProfiling();
profiler.startFrameRateMonitoring();

// Profile specific functions
const optimizedFunction = profiler.timeFunction(function expensiveOperation() {
  // Simulate expensive work
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.random();
  }
  return result;
}, 'expensive-operation');

// Run profiled function
optimizedFunction();

// Take memory snapshots
setInterval(() => {
  profiler.profileMemory();
}, 1000);

// Stop profiling after 10 seconds
setTimeout(() => {
  const report = profiler.stopProfiling();
  console.log('📊 Performance Report:', report);
  
  // Export report
  const jsonReport = profiler.exportReport('json');
  console.log('📄 JSON Report generated');
  
}, 10000);
```

This comprehensive guide covers advanced JavaScript memory management and performance optimization techniques essential for frontend interviews at big tech companies. The practical examples demonstrate real-world application of these concepts and provide tools for performance debugging and optimization.
