# Browser Internals & Web Platform Fundamentals

## Overview
Understanding how browsers work internally is crucial for frontend optimization and debugging. This guide covers browser architecture, rendering pipeline, and web platform APIs.

---

## Browser Architecture Deep Dive

### **Multi-Process Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                      BROWSER PROCESS ARCHITECTURE               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │  Browser Process │    │  Renderer Process │                  │
│  │                 │    │                  │                   │
│  │  • UI Thread    │◄──►│  • Main Thread   │                   │
│  │  • IO Thread    │    │  • Compositor    │                   │
│  │  • Storage      │    │  • Raster Thread │                   │
│  │  • Network      │    │  • Worker Threads│                   │
│  └─────────────────┘    └──────────────────┘                   │
│           ▲                        ▲                           │
│           │                        │                           │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │   GPU Process   │    │  Plugin Process  │                   │
│  │                 │    │                  │                   │
│  │  • Graphics     │    │  • Sandboxed     │                   │
│  │  • Hardware     │    │  • Isolated      │                   │
│  │  • Acceleration │    │  • Legacy        │                   │
│  └─────────────────┘    └──────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

```javascript
// Understanding browser processes and their communication
class BrowserArchitectureDemo {
  constructor() {
    this.processInfo = this.getProcessInformation();
    this.memoryUsage = this.getMemoryUsage();
  }

  // Detect current browser architecture
  getProcessInformation() {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : 'unknown'
    };

    // Detect if running in isolated context (like iframe)
    info.isIsolated = window.self !== window.top;
    
    // Check for service worker support (indicates multi-process architecture)
    info.supportsServiceWorker = 'serviceWorker' in navigator;
    
    // Check for shared worker support
    info.supportsSharedWorker = 'SharedWorker' in window;
    
    return info;
  }

  // Monitor memory usage across processes
  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        percentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  // Demonstrate cross-process communication
  demonstrateCrossProcessCommunication() {
    // Main thread to worker communication
    const worker = new Worker('/js/worker.js');
    
    worker.postMessage({
      type: 'HEAVY_COMPUTATION',
      data: Array.from({ length: 1000000 }, (_, i) => i)
    });

    worker.onmessage = (event) => {
      console.log('Received from worker process:', event.data);
    };

    // Service worker communication
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'CACHE_UPDATE',
          urls: ['/api/data', '/assets/images/hero.jpg']
        });
      });
    }

    // Shared worker communication
    if ('SharedWorker' in window) {
      const sharedWorker = new SharedWorker('/js/shared-worker.js');
      
      sharedWorker.port.postMessage({
        type: 'INIT',
        tabId: Math.random().toString(36).substr(2, 9)
      });

      sharedWorker.port.onmessage = (event) => {
        console.log('Shared worker message:', event.data);
      };
    }
  }

  // Monitor process isolation
  testProcessIsolation() {
    const tests = {
      // Test if different origins are isolated
      crossOriginIsolation: this.testCrossOriginIsolation(),
      
      // Test site isolation
      siteIsolation: this.testSiteIsolation(),
      
      // Test sandbox attributes
      sandboxSupport: this.testSandboxSupport()
    };

    return tests;
  }

  testCrossOriginIsolation() {
    try {
      // Try to access cross-origin iframe
      const iframe = document.createElement('iframe');
      iframe.src = 'https://example.com';
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        try {
          // This should fail due to same-origin policy
          const content = iframe.contentDocument;
          console.log('Cross-origin access succeeded (unexpected)');
          return false;
        } catch (error) {
          console.log('Cross-origin access blocked (expected)');
          return true;
        } finally {
          document.body.removeChild(iframe);
        }
      };
    } catch (error) {
      return true; // Properly isolated
    }
  }

  testSiteIsolation() {
    // Check if Spectre mitigations are active
    const start = performance.now();
    
    // Create array to test memory access patterns
    const buffer = new ArrayBuffer(1024 * 1024); // 1MB
    const view = new Uint8Array(buffer);
    
    // Fill with pattern
    for (let i = 0; i < view.length; i++) {
      view[i] = i % 256;
    }
    
    const end = performance.now();
    
    // If site isolation is active, certain memory access patterns
    // may be slower due to security mitigations
    return {
      duration: end - start,
      isolated: end - start > 10 // Simplified heuristic
    };
  }

  testSandboxSupport() {
    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    const sandboxFeatures = {
      allowScripts: iframe.sandbox.contains('allow-scripts'),
      allowSameOrigin: iframe.sandbox.contains('allow-same-origin'),
      allowForms: iframe.sandbox.contains('allow-forms'),
      allowPopups: iframe.sandbox.contains('allow-popups')
    };
    
    document.body.removeChild(iframe);
    
    return sandboxFeatures;
  }
}
```

---

## Rendering Pipeline Deep Dive

### **Critical Rendering Path**

```javascript
// Understanding and optimizing the critical rendering path
class CriticalRenderingPath {
  constructor() {
    this.metrics = new Map();
    this.observer = new PerformanceObserver(this.handlePerformanceEntries.bind(this));
    this.setupObservers();
  }

  setupObservers() {
    // Observe navigation timing
    this.observer.observe({ entryTypes: ['navigation'] });
    
    // Observe paint timing
    this.observer.observe({ entryTypes: ['paint'] });
    
    // Observe layout shifts
    this.observer.observe({ entryTypes: ['layout-shift'] });
    
    // Observe largest contentful paint
    this.observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  handlePerformanceEntries(list) {
    const entries = list.getEntries();
    
    entries.forEach(entry => {
      switch (entry.entryType) {
        case 'navigation':
          this.analyzeNavigationTiming(entry);
          break;
        case 'paint':
          this.analyzePaintTiming(entry);
          break;
        case 'layout-shift':
          this.analyzeLayoutShift(entry);
          break;
        case 'largest-contentful-paint':
          this.analyzeLCP(entry);
          break;
      }
    });
  }

  analyzeNavigationTiming(entry) {
    const timing = {
      // DNS Resolution
      dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
      
      // TCP Connection
      tcpConnection: entry.connectEnd - entry.connectStart,
      
      // SSL Negotiation
      sslNegotiation: entry.secureConnectionStart > 0 ? 
        entry.connectEnd - entry.secureConnectionStart : 0,
      
      // Request/Response
      requestTime: entry.responseStart - entry.requestStart,
      responseTime: entry.responseEnd - entry.responseStart,
      
      // DOM Processing
      domProcessing: entry.domContentLoadedEventEnd - entry.responseEnd,
      
      // Resource Loading
      resourceLoading: entry.loadEventStart - entry.domContentLoadedEventEnd,
      
      // Total Time
      totalTime: entry.loadEventEnd - entry.navigationStart
    };

    this.metrics.set('navigation', timing);
    this.identifyBottlenecks(timing);
  }

  analyzePaintTiming(entry) {
    const paintMetrics = this.metrics.get('paint') || {};
    paintMetrics[entry.name] = entry.startTime;
    this.metrics.set('paint', paintMetrics);

    if (entry.name === 'first-contentful-paint') {
      this.analyzeFCP(entry.startTime);
    }
  }

  analyzeFCP(fcpTime) {
    const analysis = {
      time: fcpTime,
      rating: this.getFCPRating(fcpTime),
      recommendations: this.getFCPRecommendations(fcpTime)
    };

    this.metrics.set('fcp-analysis', analysis);
  }

  getFCPRating(fcpTime) {
    if (fcpTime <= 1800) return 'good';
    if (fcpTime <= 3000) return 'needs-improvement';
    return 'poor';
  }

  getFCPRecommendations(fcpTime) {
    const recommendations = [];

    if (fcpTime > 1800) {
      recommendations.push('Optimize critical resources');
      recommendations.push('Reduce server response times');
      recommendations.push('Eliminate render-blocking resources');
    }

    if (fcpTime > 3000) {
      recommendations.push('Consider server-side rendering');
      recommendations.push('Implement resource hints (preload, prefetch)');
      recommendations.push('Optimize images and fonts');
    }

    return recommendations;
  }

  analyzeLayoutShift(entry) {
    const layoutShifts = this.metrics.get('layout-shifts') || [];
    
    layoutShifts.push({
      value: entry.value,
      sources: entry.sources?.map(source => ({
        node: source.node?.tagName || 'unknown',
        previousRect: source.previousRect,
        currentRect: source.currentRect
      })) || [],
      hadRecentInput: entry.hadRecentInput,
      timestamp: entry.startTime
    });

    this.metrics.set('layout-shifts', layoutShifts);
    
    // Calculate Cumulative Layout Shift
    this.calculateCLS();
  }

  calculateCLS() {
    const layoutShifts = this.metrics.get('layout-shifts') || [];
    
    // Group shifts into sessions
    const sessions = this.groupShiftsIntoSessions(layoutShifts);
    
    // Find the session with the maximum CLS
    const maxSessionCLS = Math.max(...sessions.map(session => 
      session.reduce((sum, shift) => sum + shift.value, 0)
    ));

    this.metrics.set('cls', {
      value: maxSessionCLS,
      rating: this.getCLSRating(maxSessionCLS),
      sessions: sessions.length,
      totalShifts: layoutShifts.length
    });
  }

  groupShiftsIntoSessions(shifts) {
    const sessions = [];
    let currentSession = [];
    
    shifts.forEach((shift, index) => {
      if (shift.hadRecentInput) return; // Ignore shifts after user input
      
      if (currentSession.length === 0) {
        currentSession.push(shift);
      } else {
        const timeDiff = shift.timestamp - currentSession[currentSession.length - 1].timestamp;
        
        if (timeDiff < 1000 && currentSession.length < 5) {
          // Same session: within 1 second and max 5 shifts
          currentSession.push(shift);
        } else {
          // New session
          sessions.push([...currentSession]);
          currentSession = [shift];
        }
      }
    });
    
    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }
    
    return sessions;
  }

  getCLSRating(clsValue) {
    if (clsValue <= 0.1) return 'good';
    if (clsValue <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  analyzeLCP(entry) {
    const lcpAnalysis = {
      time: entry.startTime,
      size: entry.size,
      element: {
        tagName: entry.element?.tagName || 'unknown',
        id: entry.element?.id || '',
        className: entry.element?.className || '',
        url: entry.url || ''
      },
      rating: this.getLCPRating(entry.startTime),
      loadTime: entry.loadTime,
      renderTime: entry.renderTime
    };

    this.metrics.set('lcp', lcpAnalysis);
  }

  getLCPRating(lcpTime) {
    if (lcpTime <= 2500) return 'good';
    if (lcpTime <= 4000) return 'needs-improvement';
    return 'poor';
  }

  identifyBottlenecks(timing) {
    const bottlenecks = [];

    if (timing.dnsLookup > 100) {
      bottlenecks.push({
        type: 'dns',
        severity: 'high',
        message: 'DNS lookup is slow',
        recommendation: 'Use DNS prefetching or consider CDN'
      });
    }

    if (timing.tcpConnection > 200) {
      bottlenecks.push({
        type: 'connection',
        severity: 'high',
        message: 'TCP connection is slow',
        recommendation: 'Optimize server location or use connection prewarming'
      });
    }

    if (timing.sslNegotiation > 200) {
      bottlenecks.push({
        type: 'ssl',
        severity: 'medium',
        message: 'SSL negotiation is slow',
        recommendation: 'Optimize SSL configuration or use session resumption'
      });
    }

    if (timing.requestTime > 500) {
      bottlenecks.push({
        type: 'server',
        severity: 'high',
        message: 'Server response time is slow',
        recommendation: 'Optimize server-side processing and database queries'
      });
    }

    if (timing.domProcessing > 1000) {
      bottlenecks.push({
        type: 'dom',
        severity: 'high',
        message: 'DOM processing is slow',
        recommendation: 'Reduce DOM complexity and optimize JavaScript execution'
      });
    }

    this.metrics.set('bottlenecks', bottlenecks);
  }

  // Generate performance report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: Object.fromEntries(this.metrics),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const navigation = this.metrics.get('navigation');
    const paint = this.metrics.get('paint');
    const cls = this.metrics.get('cls');
    const lcp = this.metrics.get('lcp');

    // Navigation recommendations
    if (navigation?.totalTime > 3000) {
      recommendations.push({
        category: 'loading',
        priority: 'high',
        message: 'Page load time is slow',
        actions: [
          'Implement code splitting',
          'Optimize images and assets',
          'Use a Content Delivery Network',
          'Enable browser caching'
        ]
      });
    }

    // Paint recommendations
    if (paint?.['first-contentful-paint'] > 2000) {
      recommendations.push({
        category: 'rendering',
        priority: 'high',
        message: 'First Contentful Paint is slow',
        actions: [
          'Eliminate render-blocking resources',
          'Optimize critical CSS delivery',
          'Reduce server response times',
          'Use resource hints (preload, prefetch)'
        ]
      });
    }

    // CLS recommendations
    if (cls?.rating === 'poor') {
      recommendations.push({
        category: 'stability',
        priority: 'high',
        message: 'Cumulative Layout Shift is poor',
        actions: [
          'Set explicit dimensions for images and videos',
          'Reserve space for ad slots',
          'Avoid inserting content above existing content',
          'Use CSS transforms for animations'
        ]
      });
    }

    // LCP recommendations
    if (lcp?.rating === 'poor') {
      recommendations.push({
        category: 'loading',
        priority: 'high',
        message: 'Largest Contentful Paint is slow',
        actions: [
          'Optimize the LCP element',
          'Preload important resources',
          'Reduce server response times',
          'Remove unused JavaScript'
        ]
      });
    }

    return recommendations;
  }
}
```

---

## JavaScript Engine Internals

### **V8 Engine Deep Dive**

{% raw %}
```javascript
// Understanding V8 optimization patterns
class V8OptimizationDemo {
  constructor() {
    this.optimizationLevel = this.detectOptimizationLevel();
    this.hiddenClasses = new Map();
    this.inlineCache = new Map();
  }

  // Detect V8 optimization level
  detectOptimizationLevel() {
    // V8 specific function to check optimization status
    // Note: These functions are only available in debug builds or with specific flags
    if (typeof %GetOptimizationStatus === 'function') {
      return 'debug-build';
    }
    
    // Fallback to indirect detection methods
    return this.indirectOptimizationDetection();
  }

  indirectOptimizationDetection() {
    const start = performance.now();
    
    // Run a function multiple times to trigger optimization
    function testFunction(x) {
      return x * x + x - 1;
    }
    
    // Cold run
    const coldResults = [];
    for (let i = 0; i < 1000; i++) {
      const start = performance.now();
      testFunction(i);
      coldResults.push(performance.now() - start);
    }
    
    // Warm run (should be optimized)
    const warmResults = [];
    for (let i = 0; i < 1000; i++) {
      const start = performance.now();
      testFunction(i);
      warmResults.push(performance.now() - start);
    }
    
    const coldAvg = coldResults.reduce((a, b) => a + b) / coldResults.length;
    const warmAvg = warmResults.reduce((a, b) => a + b) / warmResults.length;
    
    return {
      coldAverage: coldAvg,
      warmAverage: warmAvg,
      optimizationRatio: coldAvg / warmAvg,
      likelyOptimized: (coldAvg / warmAvg) > 1.5
    };
  }

  // Demonstrate hidden class optimization
  demonstrateHiddenClasses() {
    // ✅ Good: Consistent property order creates stable hidden classes
    function createPersonGood(name, age, city) {
      return {
        name: name,    // Property 1
        age: age,      // Property 2
        city: city     // Property 3
      };
    }
    
    // ❌ Bad: Inconsistent property order creates multiple hidden classes
    function createPersonBad(name, age, city, includeAge = true) {
      const person = { name: name };
      
      if (includeAge) {
        person.age = age;
      }
      
      person.city = city;
      
      if (!includeAge) {
        person.age = age; // Different hidden class!
      }
      
      return person;
    }
    
    // Benchmark the difference
    const goodTiming = this.benchmarkFunction(() => {
      for (let i = 0; i < 100000; i++) {
        createPersonGood(`Name${i}`, i, `City${i}`);
      }
    });
    
    const badTiming = this.benchmarkFunction(() => {
      for (let i = 0; i < 100000; i++) {
        createPersonBad(`Name${i}`, i, `City${i}`, i % 2 === 0);
      }
    });
    
    return {
      goodTiming,
      badTiming,
      performance: goodTiming / badTiming
    };
  }

  // Demonstrate inline caching
  demonstrateInlineCache() {
    // Monomorphic inline cache (best performance)
    function processMonomorphic(obj) {
      return obj.value * 2;
    }
    
    // Polymorphic inline cache (decent performance)
    function processPolymorphic(obj) {
      return obj.getValue ? obj.getValue() : obj.value;
    }
    
    // Megamorphic inline cache (poor performance)
    function processMegamorphic(obj) {
      return obj.calculate();
    }
    
    // Test objects with same hidden class (monomorphic)
    const monoObjects = Array.from({ length: 10000 }, (_, i) => ({ value: i }));
    
    // Test objects with different hidden classes (polymorphic)
    const polyObjects = Array.from({ length: 10000 }, (_, i) => {
      if (i % 2 === 0) {
        return { value: i };
      } else {
        return { getValue: () => i };
      }
    });
    
    // Test objects with many different shapes (megamorphic)
    const megaObjects = Array.from({ length: 10000 }, (_, i) => {
      const shapes = [
        { calculate: () => i * 1 },
        { calculate: () => i * 2 },
        { calculate: () => i * 3 },
        { calculate: () => i * 4 },
        { calculate: () => i * 5 }
      ];
      return shapes[i % 5];
    });
    
    const monoTiming = this.benchmarkFunction(() => {
      monoObjects.forEach(processMonomorphic);
    });
    
    const polyTiming = this.benchmarkFunction(() => {
      polyObjects.forEach(processPolymorphic);
    });
    
    const megaTiming = this.benchmarkFunction(() => {
      megaObjects.forEach(processMegamorphic);
    });
    
    return {
      monomorphic: monoTiming,
      polymorphic: polyTiming,
      megamorphic: megaTiming,
      ratios: {
        polyToMono: polyTiming / monoTiming,
        megaToMono: megaTiming / monoTiming
      }
    };
  }

  // Demonstrate optimizable vs non-optimizable patterns
  demonstrateOptimizationKillers() {
    // ✅ Optimizable: Simple, predictable function
    function optimizable(x, y) {
      return x + y;
    }
    
    // ❌ Non-optimizable: Uses try/catch
    function nonOptimizableTryCatch(x, y) {
      try {
        return x + y;
      } catch (e) {
        return 0;
      }
    }
    
    // ❌ Non-optimizable: Uses eval
    function nonOptimizableEval(x, y) {
      return eval(`${x} + ${y}`);
    }
    
    // ❌ Non-optimizable: Uses arguments object
    function nonOptimizableArguments() {
      let sum = 0;
      for (let i = 0; i < arguments.length; i++) {
        sum += arguments[i];
      }
      return sum;
    }
    
    // ✅ Optimizable: Uses rest parameters instead
    function optimizableRest(...args) {
      let sum = 0;
      for (let i = 0; i < args.length; i++) {
        sum += args[i];
      }
      return sum;
    }
    
    const results = {};
    
    // Benchmark each function
    results.optimizable = this.benchmarkFunction(() => {
      for (let i = 0; i < 100000; i++) {
        optimizable(i, i + 1);
      }
    });
    
    results.nonOptimizableTryCatch = this.benchmarkFunction(() => {
      for (let i = 0; i < 100000; i++) {
        nonOptimizableTryCatch(i, i + 1);
      }
    });
    
    results.nonOptimizableEval = this.benchmarkFunction(() => {
      for (let i = 0; i < 1000; i++) { // Fewer iterations due to eval overhead
        nonOptimizableEval(i, i + 1);
      }
    });
    
    results.nonOptimizableArguments = this.benchmarkFunction(() => {
      for (let i = 0; i < 100000; i++) {
        nonOptimizableArguments(i, i + 1, i + 2);
      }
    });
    
    results.optimizableRest = this.benchmarkFunction(() => {
      for (let i = 0; i < 100000; i++) {
        optimizableRest(i, i + 1, i + 2);
      }
    });
    
    return results;
  }

  // Demonstrate number representation optimization
  demonstrateNumberOptimization() {
    // V8 uses different representations for numbers:
    // - Small integers (Smis): 31-bit signed integers on 32-bit, 32-bit on 64-bit
    // - Heap numbers: Double precision floating point
    
    // ✅ Smi range operations (fast)
    function smiOperations() {
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i; // All operations within Smi range
      }
      return sum;
    }
    
    // ❌ Heap number operations (slower)
    function heapNumberOperations() {
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i + 0.5; // Forces heap number representation
      }
      return sum;
    }
    
    // Test array access patterns
    // ✅ Packed array (fast)
    const packedArray = Array.from({ length: 100000 }, (_, i) => i);
    
    // ❌ Holey array (slower)
    const holeyArray = Array.from({ length: 100000 }, (_, i) => i);
    delete holeyArray[50000]; // Creates a hole
    
    const smiTiming = this.benchmarkFunction(smiOperations);
    const heapTiming = this.benchmarkFunction(heapNumberOperations);
    
    const packedTiming = this.benchmarkFunction(() => {
      let sum = 0;
      for (let i = 0; i < packedArray.length; i++) {
        sum += packedArray[i];
      }
      return sum;
    });
    
    const holeyTiming = this.benchmarkFunction(() => {
      let sum = 0;
      for (let i = 0; i < holeyArray.length; i++) {
        sum += holeyArray[i] || 0;
      }
      return sum;
    });
    
    return {
      smi: smiTiming,
      heapNumber: heapTiming,
      packed: packedTiming,
      holey: holeyTiming,
      ratios: {
        numberTypes: heapTiming / smiTiming,
        arrayTypes: holeyTiming / packedTiming
      }
    };
  }

  benchmarkFunction(fn) {
    const iterations = 10;
    const times = [];
    
    // Warm up
    for (let i = 0; i < 3; i++) {
      fn();
    }
    
    // Measure
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      times.push(performance.now() - start);
    }
    
    // Return median time
    times.sort((a, b) => a - b);
    return times[Math.floor(times.length / 2)];
  }

  // Monitor V8 heap and optimization status
  monitorV8Performance() {
    const monitor = {
      heapUsage: this.getHeapUsage(),
      optimizationHints: this.getOptimizationHints(),
      performanceMarks: this.collectPerformanceMarks()
    };

    return monitor;
  }

  getHeapUsage() {
    if ('memory' in performance) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        efficiency: performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize
      };
    }
    return null;
  }

  getOptimizationHints() {
    return {
      // Common optimization hints
      avoidOptimizationKillers: [
        'Avoid try/catch in hot functions',
        'Use consistent object shapes',
        'Prefer monomorphic call sites',
        'Avoid eval and with statements',
        'Use typed arrays for numeric data'
      ],
      
      // V8 specific optimizations
      v8Optimizations: [
        'Keep functions small and focused',
        'Avoid mixing number types',
        'Use packed arrays when possible',
        'Initialize objects with all properties',
        'Prefer rest parameters over arguments'
      ]
    };
  }

  collectPerformanceMarks() {
    const marks = performance.getEntriesByType('mark');
    const measures = performance.getEntriesByType('measure');
    
    return {
      marks: marks.map(mark => ({
        name: mark.name,
        startTime: mark.startTime,
        detail: mark.detail
      })),
      measures: measures.map(measure => ({
        name: measure.name,
        duration: measure.duration,
        startTime: measure.startTime
      }))
    };
  }
}
```
{% endraw %}

---

## Web Platform APIs Deep Dive

### **Storage and Persistence APIs**

```javascript
// Comprehensive storage API demonstration
class WebStorageManager {
  constructor() {
    this.storageQuota = null;
    this.persistentStorage = null;
    this.indexedDB = null;
    this.initializeStorage();
  }

  async initializeStorage() {
    // Check storage quota
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      this.storageQuota = await navigator.storage.estimate();
    }

    // Request persistent storage
    if ('storage' in navigator && 'persist' in navigator.storage) {
      this.persistentStorage = await navigator.storage.persist();
    }

    // Initialize IndexedDB
    await this.initializeIndexedDB();
  }

  // IndexedDB implementation
  async initializeIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppDatabase', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.indexedDB = request.result;
        resolve(this.indexedDB);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('name', 'name', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { 
            keyPath: 'url' 
          });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
          cacheStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  // Advanced IndexedDB operations
  async performComplexQuery() {
    if (!this.indexedDB) await this.initializeIndexedDB();
    
    const transaction = this.indexedDB.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('name');
    
    // Range query
    const range = IDBKeyRange.bound('A', 'M');
    const results = [];
    
    return new Promise((resolve, reject) => {
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Cache API implementation
  async initializeCacheAPI() {
    if ('caches' in window) {
      const cache = await caches.open('app-cache-v1');
      
      // Advanced caching strategies
      await this.implementCachingStrategies(cache);
      
      return cache;
    }
    throw new Error('Cache API not supported');
  }

  async implementCachingStrategies(cache) {
    // Strategy 1: Cache First
    const cacheFirstHandler = async (request) => {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    };

    // Strategy 2: Network First
    const networkFirstHandler = async (request) => {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      }
    };

    // Strategy 3: Stale While Revalidate
    const staleWhileRevalidateHandler = async (request) => {
      const cachedResponse = await cache.match(request);
      
      const networkPromise = fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      });

      return cachedResponse || networkPromise;
    };

    return {
      cacheFirst: cacheFirstHandler,
      networkFirst: networkFirstHandler,
      staleWhileRevalidate: staleWhileRevalidateHandler
    };
  }

  // Web Locks API for resource coordination
  async demonstrateWebLocks() {
    if ('locks' in navigator) {
      // Exclusive lock
      await navigator.locks.request('resource-1', async (lock) => {
        console.log('Acquired exclusive lock');
        await this.performCriticalOperation();
        console.log('Released exclusive lock');
      });

      // Shared lock
      await navigator.locks.request('resource-2', { mode: 'shared' }, async (lock) => {
        console.log('Acquired shared lock');
        await this.performReadOperation();
        console.log('Released shared lock');
      });

      // Query locks
      const lockState = await navigator.locks.query();
      return lockState;
    }
    throw new Error('Web Locks API not supported');
  }

  async performCriticalOperation() {
    // Simulate critical operation
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  async performReadOperation() {
    // Simulate read operation
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  // Broadcast Channel API for cross-tab communication
  setupBroadcastChannel() {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('app-updates');
      
      channel.addEventListener('message', (event) => {
        console.log('Received broadcast:', event.data);
        this.handleBroadcastMessage(event.data);
      });

      // Send periodic updates
      setInterval(() => {
        channel.postMessage({
          type: 'heartbeat',
          timestamp: Date.now(),
          tabId: this.getTabId()
        });
      }, 30000);

      return channel;
    }
    throw new Error('BroadcastChannel not supported');
  }

  handleBroadcastMessage(data) {
    switch (data.type) {
      case 'cache-invalidation':
        this.invalidateCache(data.keys);
        break;
      case 'user-logout':
        this.handleUserLogout();
        break;
      case 'theme-change':
        this.updateTheme(data.theme);
        break;
    }
  }

  getTabId() {
    if (!sessionStorage.getItem('tabId')) {
      sessionStorage.setItem('tabId', Math.random().toString(36).substr(2, 9));
    }
    return sessionStorage.getItem('tabId');
  }

  // Background Sync for offline operations
  async setupBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      
      // Register for background sync
      await registration.sync.register('background-sync');
      
      // Queue operations for sync
      await this.queueOperation({
        type: 'upload-data',
        data: { id: 1, content: 'offline data' },
        timestamp: Date.now()
      });
      
      return true;
    }
    return false;
  }

  async queueOperation(operation) {
    // Store operation in IndexedDB for background sync
    if (!this.indexedDB) await this.initializeIndexedDB();
    
    const transaction = this.indexedDB.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    
    await store.add({
      url: `sync-operation-${Date.now()}`,
      operation: operation,
      timestamp: Date.now(),
      type: 'background-sync'
    });
  }

  // Storage cleanup and optimization
  async optimizeStorage() {
    const optimizations = [];

    // Clean old cache entries
    if (this.indexedDB) {
      const transaction = this.indexedDB.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const index = store.index('timestamp');
      
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const range = IDBKeyRange.upperBound(oneWeekAgo);
      
      const request = index.openCursor(range);
      let deletedCount = 0;
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          deletedCount++;
          cursor.continue();
        }
      };
      
      optimizations.push(`Deleted ${deletedCount} old cache entries`);
    }

    // Clean localStorage
    const localStorageSize = this.calculateLocalStorageSize();
    if (localStorageSize > 5 * 1024 * 1024) { // 5MB
      this.cleanupLocalStorage();
      optimizations.push('Cleaned up localStorage');
    }

    // Optimize Cache API
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => !name.includes('v1'));
      
      for (const cacheName of oldCaches) {
        await caches.delete(cacheName);
        optimizations.push(`Deleted old cache: ${cacheName}`);
      }
    }

    return optimizations;
  }

  calculateLocalStorageSize() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return totalSize;
  }

  cleanupLocalStorage() {
    const keysToRemove = [];
    const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          const data = JSON.parse(localStorage[key]);
          if (data.timestamp && data.timestamp < oneMonthAgo) {
            keysToRemove.push(key);
          }
        } catch (e) {
          // Non-JSON data, check if it's old temporary data
          if (key.startsWith('temp_')) {
            keysToRemove.push(key);
          }
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Generate storage report
  async generateStorageReport() {
    const report = {
      quota: this.storageQuota,
      persistent: this.persistentStorage,
      usage: {
        localStorage: this.calculateLocalStorageSize(),
        sessionStorage: this.calculateSessionStorageSize(),
        indexedDB: await this.calculateIndexedDBSize(),
        cacheAPI: await this.calculateCacheAPISize()
      },
      recommendations: this.generateStorageRecommendations()
    };

    return report;
  }

  calculateSessionStorageSize() {
    let totalSize = 0;
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        totalSize += sessionStorage[key].length + key.length;
      }
    }
    return totalSize;
  }

  async calculateIndexedDBSize() {
    // This is an approximation since there's no direct API
    if (!this.indexedDB) return 0;
    
    let totalSize = 0;
    const storeNames = ['users', 'cache'];
    
    for (const storeName of storeNames) {
      const transaction = this.indexedDB.transaction([storeName], 'readonly');
      const store = transaction.objectStore('users');
      const countRequest = store.count();
      
      await new Promise(resolve => {
        countRequest.onsuccess = () => {
          totalSize += countRequest.result * 1000; // Rough estimate
          resolve();
        };
      });
    }
    
    return totalSize;
  }

  async calculateCacheAPISize() {
    if (!('caches' in window)) return 0;
    
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      totalSize += requests.length * 50000; // Rough estimate
    }
    
    return totalSize;
  }

  generateStorageRecommendations() {
    const recommendations = [];
    
    if (this.storageQuota && this.storageQuota.usage / this.storageQuota.quota > 0.8) {
      recommendations.push('Storage usage is high, consider cleanup');
    }
    
    if (!this.persistentStorage) {
      recommendations.push('Request persistent storage for critical data');
    }
    
    recommendations.push('Implement regular storage cleanup');
    recommendations.push('Use appropriate storage for data lifecycle');
    
    return recommendations;
  }
}
```

This comprehensive guide covers the essential browser internals and web platform fundamentals necessary for understanding modern web development and optimizing frontend applications at the browser level.
