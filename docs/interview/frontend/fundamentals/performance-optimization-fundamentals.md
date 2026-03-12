# Performance Optimization Fundamentals

## Overview
Performance optimization is critical for frontend applications, especially at Big Tech companies where scale and user experience are paramount. This guide covers essential performance concepts, measurement techniques, and optimization strategies.

---

## Core Web Vitals & Performance Metrics

### **Comprehensive Performance Monitoring**

{% raw %}
```javascript
// Advanced performance monitoring system
class PerformanceMonitor {
  constructor(options = {}) {
    this.config = {
      enableCLS: true,
      enableFCP: true,
      enableFID: true,
      enableLCP: true,
      enableTTFB: true,
      enableINP: true,
      reportingEndpoint: '/api/performance',
      samplingRate: options.samplingRate || 0.1,
      ...options
    };
    
    this.metrics = new Map();
    this.observers = new Map();
    this.reportQueue = [];
    this.sessionId = this.generateSessionId();
    
    this.setupObservers();
    this.setupReporting();
  }

  setupObservers() {
    // Largest Contentful Paint
    if (this.config.enableLCP && 'PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.recordMetric('LCP', {
          value: lastEntry.startTime,
          element: this.getElementSelector(lastEntry.element),
          size: lastEntry.size,
          url: lastEntry.url || null,
          timestamp: Date.now()
        });
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.set('lcp', lcpObserver);
    }

    // First Input Delay
    if (this.config.enableFID && 'PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('FID', {
            value: entry.processingStart - entry.startTime,
            eventType: entry.name,
            target: this.getElementSelector(entry.target),
            timestamp: Date.now()
          });
        });
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.set('fid', fidObserver);
    }

    // Cumulative Layout Shift
    if (this.config.enableCLS && 'PerformanceObserver' in window) {
      let clsValue = 0;
      let clsEntries = [];
      
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push({
              value: entry.value,
              sources: entry.sources?.map(source => ({
                element: this.getElementSelector(source.node),
                previousRect: source.previousRect,
                currentRect: source.currentRect
              })) || [],
              timestamp: entry.startTime
            });
          }
        });
        
        this.recordMetric('CLS', {
          value: clsValue,
          entries: clsEntries,
          timestamp: Date.now()
        });
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.set('cls', clsObserver);
    }

    // First Contentful Paint
    if (this.config.enableFCP && 'PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', {
              value: entry.startTime,
              timestamp: Date.now()
            });
          }
        });
      });
      
      fcpObserver.observe({ type: 'paint', buffered: true });
      this.observers.set('fcp', fcpObserver);
    }

    // Time to First Byte
    if (this.config.enableTTFB && 'PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('TTFB', {
            value: entry.responseStart - entry.requestStart,
            dnsTime: entry.domainLookupEnd - entry.domainLookupStart,
            tcpTime: entry.connectEnd - entry.connectStart,
            tlsTime: entry.secureConnectionStart > 0 ? 
              entry.connectEnd - entry.secureConnectionStart : 0,
            timestamp: Date.now()
          });
        });
      });
      
      navigationObserver.observe({ type: 'navigation', buffered: true });
      this.observers.set('navigation', navigationObserver);
    }

    // Interaction to Next Paint (replacing FID)
    if (this.config.enableINP && 'PerformanceObserver' in window) {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('INP', {
            value: entry.processingEnd - entry.startTime,
            eventType: entry.name,
            target: this.getElementSelector(entry.target),
            interactionId: entry.interactionId,
            timestamp: Date.now()
          });
        });
      });
      
      try {
        inpObserver.observe({ type: 'event', buffered: true });
        this.observers.set('inp', inpObserver);
      } catch (e) {
        console.log('INP observer not supported');
      }
    }
  }

  // Custom performance measurements
  measureCustomMetric(name, startMark, endMark) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      
      this.recordMetric('CUSTOM', {
        name,
        value: measure.duration,
        startTime: measure.startTime,
        timestamp: Date.now()
      });
      
      return measure.duration;
    } catch (error) {
      console.error('Error measuring custom metric:', error);
      return null;
    }
  }

  // Resource performance analysis
  analyzeResourcePerformance() {
    const resources = performance.getEntriesByType('resource');
    const analysis = {
      totalResources: resources.length,
      totalSize: 0,
      totalTime: 0,
      byType: new Map(),
      slowest: [],
      largest: [],
      renderBlocking: []
    };

    resources.forEach(resource => {
      const type = this.getResourceType(resource);
      const size = resource.transferSize || 0;
      const duration = resource.responseEnd - resource.startTime;

      analysis.totalSize += size;
      analysis.totalTime += duration;

      if (!analysis.byType.has(type)) {
        analysis.byType.set(type, {
          count: 0,
          totalSize: 0,
          totalTime: 0,
          resources: []
        });
      }

      const typeData = analysis.byType.get(type);
      typeData.count++;
      typeData.totalSize += size;
      typeData.totalTime += duration;
      typeData.resources.push({
        name: resource.name,
        size,
        duration,
        renderBlockingStatus: resource.renderBlockingStatus
      });

      // Track render-blocking resources
      if (resource.renderBlockingStatus === 'blocking') {
        analysis.renderBlocking.push({
          name: resource.name,
          type,
          duration,
          size
        });
      }
    });

    // Find slowest and largest resources
    analysis.slowest = resources
      .map(r => ({
        name: r.name,
        duration: r.responseEnd - r.startTime,
        type: this.getResourceType(r)
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    analysis.largest = resources
      .filter(r => r.transferSize > 0)
      .map(r => ({
        name: r.name,
        size: r.transferSize,
        type: this.getResourceType(r)
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    return analysis;
  }

  // Memory performance monitoring
  monitorMemoryUsage() {
    if (!('memory' in performance)) {
      return null;
    }

    const memory = performance.memory;
    const memoryInfo = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      timestamp: Date.now()
    };

    this.recordMetric('MEMORY', memoryInfo);
    return memoryInfo;
  }

  // Long task monitoring
  monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('LONG_TASK', {
            duration: entry.duration,
            startTime: entry.startTime,
            attribution: entry.attribution?.map(attr => ({
              name: attr.name,
              containerType: attr.containerType,
              containerSrc: attr.containerSrc,
              containerId: attr.containerId,
              containerName: attr.containerName
            })) || [],
            timestamp: Date.now()
          });
        });
      });

      try {
        longTaskObserver.observe({ type: 'longtask', buffered: true });
        this.observers.set('longtask', longTaskObserver);
      } catch (e) {
        console.log('Long task observer not supported');
      }
    }
  }

  // User timing API integration
  startTiming(name) {
    performance.mark(`${name}-start`);
    return {
      end: () => {
        performance.mark(`${name}-end`);
        return this.measureCustomMetric(name, `${name}-start`, `${name}-end`);
      }
    };
  }

  recordMetric(type, data) {
    this.metrics.set(`${type}-${Date.now()}`, {
      type,
      data,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });

    this.queueForReporting(type, data);
  }

  queueForReporting(type, data) {
    // Sample based on configuration
    if (Math.random() > this.config.samplingRate) {
      return;
    }

    this.reportQueue.push({
      type,
      data,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });

    // Batch reporting to reduce network overhead
    if (this.reportQueue.length >= 10) {
      this.flushReports();
    }
  }

  setupReporting() {
    // Report on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushReports();
      }
    });

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.flushReports();
    });

    // Periodic reporting
    setInterval(() => {
      if (this.reportQueue.length > 0) {
        this.flushReports();
      }
    }, 30000); // Every 30 seconds
  }

  async flushReports() {
    if (this.reportQueue.length === 0) return;

    const reports = [...this.reportQueue];
    this.reportQueue = [];

    try {
      // Use sendBeacon for reliability
      if ('sendBeacon' in navigator) {
        const success = navigator.sendBeacon(
          this.config.reportingEndpoint,
          JSON.stringify({
            reports,
            metadata: {
              url: window.location.href,
              timestamp: Date.now(),
              sessionId: this.sessionId
            }
          })
        );

        if (!success) {
          // Fallback to fetch
          await this.sendViaFetch(reports);
        }
      } else {
        await this.sendViaFetch(reports);
      }
    } catch (error) {
      console.error('Failed to send performance reports:', error);
      // Re-queue failed reports
      this.reportQueue.unshift(...reports);
    }
  }

  async sendViaFetch(reports) {
    await fetch(this.config.reportingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reports,
        metadata: {
          url: window.location.href,
          timestamp: Date.now(),
          sessionId: this.sessionId
        }
      }),
      keepalive: true
    });
  }

  // Performance budget validation
  validatePerformanceBudget(budget) {
    const violations = [];
    const currentMetrics = this.getCurrentMetrics();

    for (const [metric, threshold] of Object.entries(budget)) {
      const current = currentMetrics[metric];
      if (current && current.value > threshold) {
        violations.push({
          metric,
          current: current.value,
          threshold,
          excess: current.value - threshold
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      score: this.calculatePerformanceScore(currentMetrics, budget)
    };
  }

  calculatePerformanceScore(metrics, budget) {
    let totalScore = 0;
    let metricCount = 0;

    for (const [metric, threshold] of Object.entries(budget)) {
      const current = metrics[metric];
      if (current) {
        const score = Math.max(0, Math.min(100, 
          100 - ((current.value / threshold) * 100)
        ));
        totalScore += score;
        metricCount++;
      }
    }

    return metricCount > 0 ? totalScore / metricCount : 0;
  }

  getCurrentMetrics() {
    const current = {};
    
    for (const [key, metric] of this.metrics) {
      if (!current[metric.type] || 
          metric.timestamp > current[metric.type].timestamp) {
        current[metric.type] = metric;
      }
    }
    
    return current;
  }

  getElementSelector(element) {
    if (!element) return null;
    
    // Build a CSS selector for the element
    const path = [];
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      }
      
      if (current.className) {
        const classes = current.className.trim().split(/\s+/).slice(0, 2);
        selector += `.${classes.join('.')}`;
      }
      
      path.unshift(selector);
      current = current.parentElement;
      
      if (path.length > 4) break; // Limit depth
    }
    
    return path.join(' > ');
  }

  getResourceType(resource) {
    const url = resource.name;
    const initiatorType = resource.initiatorType;
    
    if (initiatorType === 'img' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) {
      return 'image';
    }
    if (initiatorType === 'script' || /\.js$/i.test(url)) {
      return 'script';
    }
    if (initiatorType === 'css' || /\.css$/i.test(url)) {
      return 'stylesheet';
    }
    if (initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') {
      return 'xhr';
    }
    if (/\.(woff|woff2|ttf|otf|eot)$/i.test(url)) {
      return 'font';
    }
    if (/\.(mp4|webm|ogg|mp3|wav)$/i.test(url)) {
      return 'media';
    }
    
    return initiatorType || 'other';
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate performance report
  generateReport() {
    const metrics = this.getCurrentMetrics();
    const resourceAnalysis = this.analyzeResourcePerformance();
    const memoryInfo = this.monitorMemoryUsage();

    return {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      metrics,
      resources: resourceAnalysis,
      memory: memoryInfo,
      recommendations: this.generateRecommendations(metrics, resourceAnalysis)
    };
  }

  generateRecommendations(metrics, resourceAnalysis) {
    const recommendations = [];

    // LCP recommendations
    if (metrics.LCP && metrics.LCP.data.value > 2500) {
      recommendations.push({
        type: 'LCP',
        priority: 'high',
        message: 'Largest Contentful Paint is slow',
        suggestions: [
          'Optimize the LCP element (images, text)',
          'Reduce server response times',
          'Remove render-blocking resources',
          'Preload important resources'
        ]
      });
    }

    // FID/INP recommendations
    if ((metrics.FID && metrics.FID.data.value > 100) || 
        (metrics.INP && metrics.INP.data.value > 200)) {
      recommendations.push({
        type: 'Responsiveness',
        priority: 'high',
        message: 'Poor input responsiveness',
        suggestions: [
          'Break up long tasks',
          'Use web workers for heavy computation',
          'Optimize JavaScript execution',
          'Implement code splitting'
        ]
      });
    }

    // CLS recommendations
    if (metrics.CLS && metrics.CLS.data.value > 0.1) {
      recommendations.push({
        type: 'CLS',
        priority: 'high',
        message: 'Cumulative Layout Shift is poor',
        suggestions: [
          'Set explicit dimensions for images and videos',
          'Reserve space for ads',
          'Avoid inserting content above existing content',
          'Use CSS transform for animations'
        ]
      });
    }

    // Resource recommendations
    if (resourceAnalysis.renderBlocking.length > 0) {
      recommendations.push({
        type: 'Resources',
        priority: 'medium',
        message: 'Render-blocking resources detected',
        suggestions: [
          'Inline critical CSS',
          'Defer non-critical JavaScript',
          'Use resource hints',
          'Optimize CSS delivery'
        ]
      });
    }

    return recommendations;
  }

  destroy() {
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Flush any remaining reports
    this.flushReports();
  }
}
```
{% endraw %}

---

## Rendering Optimization

### **Advanced Rendering Techniques**

```javascript
// Rendering optimization utilities
class RenderingOptimizer {
  
  // Virtual DOM-like optimization for vanilla JS
  static createVirtualDOM() {
    return {
      createElement(type, props = {}, ...children) {
        return {
          type,
          props: { ...props, children: children.flat() },
          key: props.key || null
        };
      },

      render(vnode, container) {
        if (typeof vnode === 'string' || typeof vnode === 'number') {
          return document.createTextNode(vnode);
        }

        const element = document.createElement(vnode.type);
        
        // Set properties
        for (const [key, value] of Object.entries(vnode.props)) {
          if (key === 'children') continue;
          
          if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
          } else if (key === 'className') {
            element.className = value;
          } else {
            element.setAttribute(key, value);
          }
        }

        // Render children
        if (vnode.props.children) {
          vnode.props.children.forEach(child => {
            const childElement = this.render(child, element);
            if (childElement) {
              element.appendChild(childElement);
            }
          });
        }

        if (container) {
          container.appendChild(element);
        }

        return element;
      },

      diff(oldVNode, newVNode, container, index = 0) {
        // Handle removal
        if (!newVNode) {
          container.removeChild(container.childNodes[index]);
          return;
        }

        // Handle addition
        if (!oldVNode) {
          const newElement = this.render(newVNode);
          container.appendChild(newElement);
          return;
        }

        // Handle text nodes
        if (typeof oldVNode === 'string' || typeof newVNode === 'string') {
          if (oldVNode !== newVNode) {
            container.replaceChild(
              this.render(newVNode),
              container.childNodes[index]
            );
          }
          return;
        }

        // Handle different types
        if (oldVNode.type !== newVNode.type) {
          container.replaceChild(
            this.render(newVNode),
            container.childNodes[index]
          );
          return;
        }

        // Update properties
        this.updateElement(
          container.childNodes[index],
          oldVNode.props,
          newVNode.props
        );

        // Diff children
        const oldChildren = oldVNode.props.children || [];
        const newChildren = newVNode.props.children || [];
        const maxLength = Math.max(oldChildren.length, newChildren.length);

        for (let i = 0; i < maxLength; i++) {
          this.diff(
            oldChildren[i],
            newChildren[i],
            container.childNodes[index],
            i
          );
        }
      },

      updateElement(element, oldProps, newProps) {
        // Remove old properties
        for (const key in oldProps) {
          if (!(key in newProps)) {
            if (key.startsWith('on')) {
              element.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
            } else if (key === 'className') {
              element.className = '';
            } else {
              element.removeAttribute(key);
            }
          }
        }

        // Add/update new properties
        for (const key in newProps) {
          if (oldProps[key] !== newProps[key]) {
            if (key.startsWith('on')) {
              if (oldProps[key]) {
                element.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
              }
              element.addEventListener(key.slice(2).toLowerCase(), newProps[key]);
            } else if (key === 'className') {
              element.className = newProps[key];
            } else {
              element.setAttribute(key, newProps[key]);
            }
          }
        }
      }
    };
  }

  // Optimized list rendering with recycling
  static createListRenderer(container, itemRenderer) {
    let items = [];
    let renderedElements = new Map();
    let recycledElements = [];
    let scrollPosition = 0;
    let containerHeight = container.clientHeight;
    let itemHeight = 50; // Default, will be measured

    const recycler = {
      setData(newItems) {
        items = newItems;
        this.render();
      },

      render() {
        const viewportStart = Math.floor(scrollPosition / itemHeight);
        const viewportEnd = Math.min(
          items.length,
          viewportStart + Math.ceil(containerHeight / itemHeight) + 5 // Buffer
        );

        // Hide elements outside viewport
        for (const [index, element] of renderedElements) {
          if (index < viewportStart || index >= viewportEnd) {
            element.style.display = 'none';
            recycledElements.push({ element, index });
            renderedElements.delete(index);
          }
        }

        // Render visible items
        for (let i = viewportStart; i < viewportEnd; i++) {
          if (!renderedElements.has(i)) {
            const element = this.getOrCreateElement(i);
            itemRenderer(element, items[i], i);
            element.style.transform = `translateY(${i * itemHeight}px)`;
            element.style.display = 'block';
            renderedElements.set(i, element);
          }
        }
      },

      getOrCreateElement(index) {
        // Try to recycle an element
        if (recycledElements.length > 0) {
          const recycled = recycledElements.pop();
          return recycled.element;
        }

        // Create new element
        const element = document.createElement('div');
        element.className = 'list-item';
        element.style.position = 'absolute';
        element.style.width = '100%';
        element.style.height = `${itemHeight}px`;
        container.appendChild(element);

        return element;
      },

      handleScroll(newScrollPosition) {
        scrollPosition = newScrollPosition;
        this.render();
      },

      updateItemHeight(height) {
        itemHeight = height;
        container.style.height = `${items.length * itemHeight}px`;
        this.render();
      },

      destroy() {
        renderedElements.clear();
        recycledElements = [];
        container.innerHTML = '';
      }
    };

    return recycler;
  }

  // Frame-based animation optimization
  static createAnimationScheduler() {
    let tasks = [];
    let isRunning = false;
    let frameId = null;

    const scheduler = {
      schedule(task, priority = 'normal') {
        tasks.push({ task, priority, timestamp: Date.now() });
        tasks.sort((a, b) => {
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        if (!isRunning) {
          this.start();
        }
      },

      start() {
        if (isRunning) return;
        isRunning = true;
        this.tick();
      },

      tick() {
        const frameStart = performance.now();
        const frameTimeLimit = 16.67; // ~60fps

        while (tasks.length > 0 && (performance.now() - frameStart) < frameTimeLimit) {
          const { task } = tasks.shift();
          try {
            task();
          } catch (error) {
            console.error('Animation task error:', error);
          }
        }

        if (tasks.length > 0) {
          frameId = requestAnimationFrame(() => this.tick());
        } else {
          isRunning = false;
        }
      },

      cancel() {
        if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
        isRunning = false;
        tasks = [];
      },

      getCurrentLoad() {
        return tasks.length;
      }
    };

    return scheduler;
  }

  // Layout thrashing prevention
  static createLayoutBatcher() {
    let readOperations = [];
    let writeOperations = [];
    let scheduled = false;

    return {
      read(fn) {
        readOperations.push(fn);
        this.schedule();
      },

      write(fn) {
        writeOperations.push(fn);
        this.schedule();
      },

      schedule() {
        if (scheduled) return;
        scheduled = true;

        requestAnimationFrame(() => {
          // Batch all reads first
          const readResults = readOperations.map(fn => {
            try {
              return fn();
            } catch (error) {
              console.error('Read operation error:', error);
              return null;
            }
          });

          // Then batch all writes
          writeOperations.forEach((fn, index) => {
            try {
              fn(readResults[index]);
            } catch (error) {
              console.error('Write operation error:', error);
            }
          });

          // Reset for next batch
          readOperations = [];
          writeOperations = [];
          scheduled = false;
        });
      },

      measureElement(element, callback) {
        this.read(() => {
          const rect = element.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(element);
          return { rect, computedStyle };
        });

        this.write((measurements) => {
          if (measurements && callback) {
            callback(measurements);
          }
        });
      }
    };
  }

  // Image loading optimization
  static createImageLoader() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px' // Start loading 100px before entering viewport
    });

    return {
      observeImage(img) {
        observer.observe(img);
      },

      loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Create a new image to preload
        const newImg = new Image();
        
        newImg.onload = () => {
          // Smooth transition
          img.style.opacity = '0';
          img.src = src;
          img.onload = () => {
            img.style.transition = 'opacity 0.3s';
            img.style.opacity = '1';
          };
        };

        newImg.onerror = () => {
          img.src = img.dataset.fallback || '/images/placeholder.jpg';
        };

        newImg.src = src;
      },

      preloadImages(urls) {
        return Promise.all(urls.map(url => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });
        }));
      },

      createResponsiveImage(src, sizes = []) {
        const img = document.createElement('img');
        
        if (sizes.length > 0) {
          img.srcset = sizes.map(size => 
            `${src}?w=${size.width} ${size.width}w`
          ).join(', ');
          
          img.sizes = sizes.map(size => 
            `(max-width: ${size.breakpoint}px) ${size.width}px`
          ).join(', ');
        }
        
        img.src = src;
        img.loading = 'lazy';
        img.decoding = 'async';
        
        return img;
      }
    };
  }

  // Font loading optimization
  static optimizeFontLoading() {
    return {
      preloadFonts(fonts) {
        fonts.forEach(font => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'font';
          link.href = font.url;
          link.type = font.type || 'font/woff2';
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        });
      },

      loadFontFace(fontFamily, url, options = {}) {
        const fontFace = new FontFace(fontFamily, `url(${url})`, {
          weight: options.weight || 'normal',
          style: options.style || 'normal',
          display: options.display || 'swap'
        });

        return fontFace.load().then(loadedFace => {
          document.fonts.add(loadedFace);
          return loadedFace;
        });
      },

      optimizeWebFonts() {
        // Add font-display: swap to all @font-face rules
        const styleSheets = Array.from(document.styleSheets);
        
        styleSheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules);
            rules.forEach(rule => {
              if (rule.type === CSSRule.FONT_FACE_RULE) {
                if (!rule.style.fontDisplay) {
                  rule.style.fontDisplay = 'swap';
                }
              }
            });
          } catch (e) {
            // Can't access cross-origin stylesheets
          }
        });
      },

      createFontLoadingStrategy(fonts) {
        const criticalFonts = fonts.filter(f => f.critical);
        const nonCriticalFonts = fonts.filter(f => !f.critical);

        // Load critical fonts immediately
        const criticalPromises = criticalFonts.map(font => 
          this.loadFontFace(font.family, font.url, font.options)
        );

        // Load non-critical fonts after page load
        if (document.readyState === 'complete') {
          this.loadNonCriticalFonts(nonCriticalFonts);
        } else {
          window.addEventListener('load', () => {
            this.loadNonCriticalFonts(nonCriticalFonts);
          });
        }

        return Promise.all(criticalPromises);
      },

      loadNonCriticalFonts(fonts) {
        // Use requestIdleCallback if available
        const loadFonts = () => {
          fonts.forEach(font => {
            this.loadFontFace(font.family, font.url, font.options);
          });
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadFonts);
        } else {
          setTimeout(loadFonts, 0);
        }
      }
    };
  }

  // Critical rendering path optimization
  static optimizeCriticalRenderingPath() {
    return {
      inlineCriticalCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        style.setAttribute('data-critical', 'true');
        document.head.appendChild(style);
      },

      loadNonCriticalCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
        document.head.appendChild(link);
      },

      deferNonCriticalJS(scripts) {
        if (document.readyState === 'complete') {
          this.loadScripts(scripts);
        } else {
          window.addEventListener('load', () => {
            this.loadScripts(scripts);
          });
        }
      },

      loadScripts(scripts) {
        scripts.forEach((src, index) => {
          setTimeout(() => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
          }, index * 100); // Stagger loading
        });
      },

      optimizeResourceHints(resources) {
        resources.forEach(resource => {
          const link = document.createElement('link');
          
          switch (resource.hint) {
            case 'preload':
              link.rel = 'preload';
              link.as = resource.as;
              break;
            case 'prefetch':
              link.rel = 'prefetch';
              break;
            case 'preconnect':
              link.rel = 'preconnect';
              break;
            case 'dns-prefetch':
              link.rel = 'dns-prefetch';
              break;
          }
          
          link.href = resource.href;
          if (resource.crossOrigin) {
            link.crossOrigin = resource.crossOrigin;
          }
          
          document.head.appendChild(link);
        });
      }
    };
  }
}
```

This comprehensive performance optimization guide provides the essential tools and techniques for building high-performance frontend applications that meet the demanding standards of Big Tech companies, covering everything from measurement and monitoring to advanced rendering optimizations.