# Distributed Frontend Systems

## Table of Contents
- [Micro-Frontends Architecture](#micro-frontends-architecture)
- [Module Federation](#module-federation)
- [Service Workers](#service-workers)
- [Edge Computing](#edge-computing)
- [CDN Strategies](#cdn-strategies)
- [State Synchronization](#state-synchronization)
- [Offline-First Architecture](#offline-first-architecture)
- [Real-Time Collaboration](#real-time-collaboration)

## Micro-Frontends Architecture

### Core Concepts

**Definition**: Architectural style where independently deliverable frontend applications compose into a greater whole.

**Benefits**:
```
1. Independent deployment
2. Team autonomy
3. Technology diversity
4. Incremental upgrades
5. Isolated failures
```

**Challenges**:
```
1. Increased complexity
2. Performance overhead
3. Shared dependencies
4. Consistent UX
5. Cross-app communication
```

### Integration Patterns

**Build-Time Integration**:
```javascript
// Package.json
{
  "dependencies": {
    "@company/header": "^1.0.0",
    "@company/footer": "^1.0.0",
    "@company/sidebar": "^1.0.0"
  }
}

// App.jsx
import Header from '@company/header';
import Footer from '@company/footer';
import Sidebar from '@company/sidebar';

function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <main>{/* Content */}</main>
      <Footer />
    </div>
  );
}
```

**Run-Time Integration via iframes**:
```javascript
class MicroFrontendLoader {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.iframes = new Map();
  }

  load(name, url, config = {}) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.border = 'none';
    iframe.style.width = config.width || '100%';
    iframe.style.height = config.height || '100%';
    
    // Security
    iframe.sandbox = 'allow-scripts allow-same-origin';
    
    // Communication
    window.addEventListener('message', (event) => {
      if (event.source === iframe.contentWindow) {
        this.handleMessage(name, event.data);
      }
    });
    
    this.container.appendChild(iframe);
    this.iframes.set(name, iframe);
    
    return iframe;
  }

  unload(name) {
    const iframe = this.iframes.get(name);
    if (iframe) {
      iframe.remove();
      this.iframes.delete(name);
    }
  }

  sendMessage(name, message) {
    const iframe = this.iframes.get(name);
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, '*');
    }
  }

  handleMessage(name, data) {
    console.log(`Message from ${name}:`, data);
    // Handle cross-app communication
  }
}

// Usage
const loader = new MicroFrontendLoader('app-container');
loader.load('header', 'https://header.example.com');
loader.load('content', 'https://content.example.com');
```

**Run-Time Integration via JavaScript**:
```javascript
class MicroFrontendRegistry {
  constructor() {
    this.apps = new Map();
    this.mountedApps = new Set();
  }

  register(name, loadApp) {
    this.apps.set(name, {
      name,
      loadApp,
      status: 'NOT_LOADED'
    });
  }

  async mount(name, container) {
    const app = this.apps.get(name);
    
    if (!app) {
      throw new Error(`App ${name} not registered`);
    }

    if (app.status === 'NOT_LOADED') {
      app.status = 'LOADING';
      app.instance = await app.loadApp();
      app.status = 'LOADED';
    }

    if (app.instance.mount) {
      await app.instance.mount(container);
      this.mountedApps.add(name);
    }
  }

  async unmount(name) {
    const app = this.apps.get(name);
    
    if (app && app.instance && app.instance.unmount) {
      await app.instance.unmount();
      this.mountedApps.delete(name);
    }
  }

  async update(name, props) {
    const app = this.apps.get(name);
    
    if (app && app.instance && app.instance.update) {
      await app.instance.update(props);
    }
  }
}

// App definition
const headerApp = {
  async mount(container) {
    const root = document.createElement('div');
    root.innerHTML = '<header>My Header</header>';
    container.appendChild(root);
    this.root = root;
  },
  
  async unmount() {
    if (this.root) {
      this.root.remove();
    }
  },
  
  async update(props) {
    // Update app with new props
  }
};

// Usage
const registry = new MicroFrontendRegistry();

registry.register('header', async () => {
  // Load app bundle
  await import('https://cdn.example.com/header.js');
  return headerApp;
});

await registry.mount('header', document.getElementById('header-container'));
```

### Shared State Management

**Event Bus Pattern**:
```javascript
class MicroFrontendEventBus {
  constructor() {
    this.events = new Map();
    this.history = [];
    this.maxHistory = 100;
  }

  subscribe(event, callback, options = {}) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const subscription = {
      callback,
      once: options.once || false,
      priority: options.priority || 0
    };

    this.events.get(event).add(subscription);

    // Replay history if requested
    if (options.replay) {
      const historicalEvents = this.history.filter(e => e.event === event);
      historicalEvents.forEach(e => callback(e.data));
    }

    return () => this.unsubscribe(event, subscription);
  }

  unsubscribe(event, subscription) {
    const subscriptions = this.events.get(event);
    if (subscriptions) {
      subscriptions.delete(subscription);
    }
  }

  publish(event, data) {
    // Store in history
    this.history.push({ event, data, timestamp: Date.now() });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const subscriptions = this.events.get(event);
    if (!subscriptions) return;

    // Sort by priority
    const sorted = Array.from(subscriptions).sort(
      (a, b) => b.priority - a.priority
    );

    sorted.forEach(subscription => {
      try {
        subscription.callback(data);
        
        if (subscription.once) {
          this.unsubscribe(event, subscription);
        }
      } catch (error) {
        console.error(`Error in ${event} handler:`, error);
      }
    });
  }

  clear(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

// Global event bus
window.microFrontendBus = new MicroFrontendEventBus();

// App 1
window.microFrontendBus.subscribe('user:login', (user) => {
  console.log('App 1: User logged in', user);
});

// App 2
window.microFrontendBus.publish('user:login', { id: 1, name: 'Alice' });
```

**Shared Store Pattern**:
```javascript
class SharedStore {
  constructor() {
    this.state = {};
    this.subscribers = new Map();
    this.middleware = [];
  }

  getState() {
    return { ...this.state };
  }

  setState(updates) {
    const prevState = this.getState();
    
    // Apply middleware
    let nextState = { ...this.state, ...updates };
    for (const mw of this.middleware) {
      nextState = mw(prevState, nextState);
    }

    this.state = nextState;
    this.notify(prevState, nextState);
  }

  subscribe(selector, callback) {
    const id = Symbol();
    this.subscribers.set(id, { selector, callback });
    
    // Call immediately with current state
    const selected = selector(this.state);
    callback(selected);
    
    return () => this.subscribers.delete(id);
  }

  notify(prevState, nextState) {
    this.subscribers.forEach(({ selector, callback }) => {
      const prevSelected = selector(prevState);
      const nextSelected = selector(nextState);
      
      if (prevSelected !== nextSelected) {
        callback(nextSelected);
      }
    });
  }

  use(middleware) {
    this.middleware.push(middleware);
  }
}

// Global store
window.sharedStore = new SharedStore();

// Middleware for logging
window.sharedStore.use((prevState, nextState) => {
  console.log('State change:', { prevState, nextState });
  return nextState;
});

// App 1: Subscribe to user
window.sharedStore.subscribe(
  state => state.user,
  user => console.log('App 1: User changed', user)
);

// App 2: Update user
window.sharedStore.setState({ user: { id: 1, name: 'Alice' } });
```

## Module Federation

### Webpack Module Federation

**Host Configuration**:
```javascript
// webpack.config.js (Host)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js',
        app2: 'app2@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
      }
    })
  ]
};

// Usage in host
import React from 'react';

const RemoteButton = React.lazy(() => import('app1/Button'));
const RemoteHeader = React.lazy(() => import('app2/Header'));

function App() {
  return (
    <div>
      <React.Suspense fallback="Loading Header...">
        <RemoteHeader />
      </React.Suspense>
      
      <React.Suspense fallback="Loading Button...">
        <RemoteButton />
      </React.Suspense>
    </div>
  );
}
```

**Remote Configuration**:
```javascript
// webpack.config.js (Remote)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
        './Header': './src/Header'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
      }
    })
  ]
};
```

### Dynamic Remote Loading

```javascript
class DynamicModuleFederation {
  constructor() {
    this.remotes = new Map();
    this.cache = new Map();
  }

  async loadRemote(url, scope, module) {
    // Check cache
    const cacheKey = `${url}:${scope}:${module}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Load remote container
    await this.loadScript(url);

    // Initialize sharing scope
    await __webpack_init_sharing__('default');
    const container = window[scope];
    await container.init(__webpack_share_scopes__.default);

    // Get module
    const factory = await container.get(module);
    const Module = factory();

    // Cache result
    this.cache.set(cacheKey, Module);
    
    return Module;
  }

  loadScript(url) {
    return new Promise((resolve, reject) => {
      if (this.remotes.has(url)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      script.async = true;

      script.onload = () => {
        this.remotes.set(url, true);
        resolve();
      };

      script.onerror = () => {
        reject(new Error(`Failed to load ${url}`));
      };

      document.head.appendChild(script);
    });
  }

  clearCache() {
    this.cache.clear();
  }
}

// Usage
const federation = new DynamicModuleFederation();

async function loadComponent() {
  const Component = await federation.loadRemote(
    'http://localhost:3001/remoteEntry.js',
    'app1',
    './Button'
  );

  return Component;
}
```

## Service Workers

### Service Worker Lifecycle

```javascript
// service-worker.js
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
```

### Caching Strategies

```javascript
// Cache First (good for static assets)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  
  return response;
}

// Network First (good for dynamic content)
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

// Stale While Revalidate (good for frequently updated content)
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    const cache = caches.open(CACHE_NAME);
    cache.then(c => c.put(request, response.clone()));
    return response;
  });

  return cached || fetchPromise;
}

// Network Only (good for real-time data)
async function networkOnly(request) {
  return fetch(request);
}

// Cache Only (good for offline-first apps)
async function cacheOnly(request) {
  return caches.match(request);
}

// Strategy router
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
  } else if (url.pathname.match(/\.(js|css|png|jpg)$/)) {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
```

### Background Sync

```javascript
// Register sync
async function registerBackgroundSync() {
  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register('sync-data');
}

// Service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Get pending requests from IndexedDB
  const db = await openDB();
  const pending = await db.getAll('pending-requests');
  
  for (const request of pending) {
    try {
      await fetch(request.url, request.options);
      await db.delete('pending-requests', request.id);
    } catch (error) {
      console.error('Sync failed:', error);
      // Will retry on next sync
    }
  }
}
```

I'll continue with more content:

<function_calls>
<invoke name="fsAppend">
<parameter name="path">docs/19-expert-topics/01-distributed-frontend-systems.md

#
# Edge Computing

### Edge Functions

**Concept**: Run code closer to users at CDN edge locations.

```javascript
// Cloudflare Workers example
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // A/B testing at edge
  const variant = Math.random() < 0.5 ? 'A' : 'B';
  
  // Modify request
  const modifiedRequest = new Request(request);
  modifiedRequest.headers.set('X-Variant', variant);
  
  // Fetch from origin
  const response = await fetch(modifiedRequest);
  
  // Modify response
  const modifiedResponse = new Response(response.body, response);
  modifiedResponse.headers.set('X-Variant', variant);
  modifiedResponse.headers.set('Cache-Control', 'public, max-age=3600');
  
  return modifiedResponse;
}
```

**Edge Caching**:
```javascript
// Advanced edge caching
async function handleWithCache(request) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  
  // Try cache first
  let response = await cache.match(cacheKey);
  
  if (!response) {
    // Fetch from origin
    response = await fetch(request);
    
    // Cache if successful
    if (response.status === 200) {
      // Clone response for caching
      const responseToCache = response.clone();
      
      // Add custom headers
      const headers = new Headers(responseToCache.headers);
      headers.set('X-Cache', 'MISS');
      headers.set('X-Cache-Date', new Date().toISOString());
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers
      });
      
      // Store in cache
      await cache.put(cacheKey, cachedResponse);
    }
  } else {
    // Add cache hit header
    response = new Response(response.body, response);
    response.headers.set('X-Cache', 'HIT');
  }
  
  return response;
}
```

### Edge State Management

```javascript
// Durable Objects (Cloudflare)
export class Counter {
  constructor(state, env) {
    this.state = state;
  }

  async fetch(request) {
    const url = new URL(request.url);
    
    switch (url.pathname) {
      case '/increment':
        const count = (await this.state.storage.get('count')) || 0;
        await this.state.storage.put('count', count + 1);
        return new Response(count + 1);
      
      case '/get':
        const current = (await this.state.storage.get('count')) || 0;
        return new Response(current);
      
      default:
        return new Response('Not found', { status: 404 });
    }
  }
}

// Usage
export default {
  async fetch(request, env) {
    const id = env.COUNTER.idFromName('global-counter');
    const counter = env.COUNTER.get(id);
    return counter.fetch(request);
  }
};
```

## CDN Strategies

### Multi-CDN Architecture

```javascript
class MultiCDNManager {
  constructor(cdns) {
    this.cdns = cdns; // Array of CDN configurations
    this.healthChecks = new Map();
    this.startHealthChecks();
  }

  startHealthChecks() {
    setInterval(() => {
      this.cdns.forEach(cdn => {
        this.checkHealth(cdn);
      });
    }, 30000); // Check every 30 seconds
  }

  async checkHealth(cdn) {
    try {
      const start = Date.now();
      const response = await fetch(`${cdn.url}/health`, {
        method: 'HEAD',
        cache: 'no-store'
      });
      const latency = Date.now() - start;
      
      this.healthChecks.set(cdn.name, {
        healthy: response.ok,
        latency,
        timestamp: Date.now()
      });
    } catch (error) {
      this.healthChecks.set(cdn.name, {
        healthy: false,
        latency: Infinity,
        timestamp: Date.now()
      });
    }
  }

  selectCDN(criteria = 'latency') {
    const healthyCDNs = this.cdns.filter(cdn => {
      const health = this.healthChecks.get(cdn.name);
      return health && health.healthy;
    });

    if (healthyCDNs.length === 0) {
      return this.cdns[0]; // Fallback to first CDN
    }

    switch (criteria) {
      case 'latency':
        return healthyCDNs.reduce((best, cdn) => {
          const health = this.healthChecks.get(cdn.name);
          const bestHealth = this.healthChecks.get(best.name);
          return health.latency < bestHealth.latency ? cdn : best;
        });
      
      case 'random':
        return healthyCDNs[Math.floor(Math.random() * healthyCDNs.length)];
      
      case 'round-robin':
        this.roundRobinIndex = (this.roundRobinIndex || 0) + 1;
        return healthyCDNs[this.roundRobinIndex % healthyCDNs.length];
      
      default:
        return healthyCDNs[0];
    }
  }

  async fetchWithFallback(path, options = {}) {
    const maxRetries = 3;
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      const cdn = this.selectCDN();
      
      try {
        const response = await fetch(`${cdn.url}${path}`, {
          ...options,
          headers: {
            ...options.headers,
            'X-CDN-Provider': cdn.name
          }
        });

        if (response.ok) {
          return response;
        }
      } catch (error) {
        lastError = error;
        console.error(`CDN ${cdn.name} failed:`, error);
        
        // Mark as unhealthy
        this.healthChecks.set(cdn.name, {
          healthy: false,
          latency: Infinity,
          timestamp: Date.now()
        });
      }
    }

    throw lastError || new Error('All CDNs failed');
  }
}

// Usage
const cdnManager = new MultiCDNManager([
  { name: 'cloudflare', url: 'https://cdn1.example.com' },
  { name: 'fastly', url: 'https://cdn2.example.com' },
  { name: 'akamai', url: 'https://cdn3.example.com' }
]);

const response = await cdnManager.fetchWithFallback('/assets/app.js');
```

### Smart Asset Loading

```javascript
class SmartAssetLoader {
  constructor() {
    this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    this.loadedAssets = new Set();
  }

  getConnectionQuality() {
    if (!this.connection) return 'unknown';
    
    const effectiveType = this.connection.effectiveType;
    const saveData = this.connection.saveData;
    
    if (saveData) return 'save-data';
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'low';
      case '3g':
        return 'medium';
      case '4g':
        return 'high';
      default:
        return 'unknown';
    }
  }

  async loadAsset(url, options = {}) {
    if (this.loadedAssets.has(url)) {
      return; // Already loaded
    }

    const quality = this.getConnectionQuality();
    const priority = options.priority || 'normal';
    
    // Adjust loading strategy based on connection
    switch (quality) {
      case 'save-data':
      case 'low':
        if (priority !== 'critical') {
          console.log(`Skipping ${url} due to poor connection`);
          return;
        }
        break;
      
      case 'medium':
        if (priority === 'low') {
          // Defer loading
          await this.deferLoad(url, 5000);
          return;
        }
        break;
    }

    // Load asset
    await this.performLoad(url, options);
    this.loadedAssets.add(url);
  }

  async performLoad(url, options) {
    const ext = url.split('.').pop();
    
    switch (ext) {
      case 'js':
        return this.loadScript(url, options);
      case 'css':
        return this.loadStylesheet(url, options);
      case 'jpg':
      case 'png':
      case 'webp':
        return this.loadImage(url, options);
      default:
        return fetch(url);
    }
  }

  loadScript(url, options) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = options.async !== false;
      script.defer = options.defer || false;
      
      if (options.module) {
        script.type = 'module';
      }
      
      script.onload = resolve;
      script.onerror = reject;
      
      document.head.appendChild(script);
    });
  }

  loadStylesheet(url, options) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      
      if (options.media) {
        link.media = options.media;
      }
      
      link.onload = resolve;
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }

  loadImage(url, options) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      if (options.srcset) {
        img.srcset = options.srcset;
      }
      
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  async deferLoad(url, delay) {
    await new Promise(resolve => setTimeout(resolve, delay));
    return this.performLoad(url, {});
  }

  preload(urls, options = {}) {
    return Promise.all(
      urls.map(url => this.loadAsset(url, { ...options, priority: 'high' }))
    );
  }

  prefetch(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

// Usage
const loader = new SmartAssetLoader();

// Load critical assets
await loader.preload([
  '/assets/critical.css',
  '/assets/critical.js'
], { priority: 'critical' });

// Prefetch next page assets
loader.prefetch([
  '/assets/next-page.js',
  '/assets/next-page.css'
]);
```

## State Synchronization

### Operational Transformation

```javascript
class OperationalTransform {
  constructor() {
    this.operations = [];
    this.version = 0;
  }

  // Insert operation
  insert(position, text) {
    return {
      type: 'insert',
      position,
      text,
      version: this.version
    };
  }

  // Delete operation
  delete(position, length) {
    return {
      type: 'delete',
      position,
      length,
      version: this.version
    };
  }

  // Transform operation against another
  transform(op1, op2) {
    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position < op2.position) {
        return op2; // No change needed
      } else if (op1.position > op2.position) {
        return {
          ...op2,
          position: op2.position + op1.text.length
        };
      } else {
        // Same position, use version to break tie
        return op1.version < op2.version ? op2 : {
          ...op2,
          position: op2.position + op1.text.length
        };
      }
    }

    if (op1.type === 'insert' && op2.type === 'delete') {
      if (op1.position <= op2.position) {
        return {
          ...op2,
          position: op2.position + op1.text.length
        };
      } else if (op1.position >= op2.position + op2.length) {
        return op2;
      } else {
        // Insert is within delete range
        return {
          ...op2,
          length: op2.length + op1.text.length
        };
      }
    }

    if (op1.type === 'delete' && op2.type === 'insert') {
      if (op2.position <= op1.position) {
        return {
          ...op1,
          position: op1.position + op2.text.length
        };
      } else if (op2.position >= op1.position + op1.length) {
        return {
          ...op1,
          position: op1.position
        };
      } else {
        return {
          ...op1,
          length: op1.length + op2.text.length
        };
      }
    }

    if (op1.type === 'delete' && op2.type === 'delete') {
      if (op1.position + op1.length <= op2.position) {
        return {
          ...op2,
          position: op2.position - op1.length
        };
      } else if (op1.position >= op2.position + op2.length) {
        return op2;
      } else {
        // Overlapping deletes
        const start = Math.min(op1.position, op2.position);
        const end = Math.max(
          op1.position + op1.length,
          op2.position + op2.length
        );
        return {
          type: 'delete',
          position: start,
          length: end - start - op1.length,
          version: Math.max(op1.version, op2.version)
        };
      }
    }

    return op2;
  }

  // Apply operation to text
  apply(text, operation) {
    switch (operation.type) {
      case 'insert':
        return text.slice(0, operation.position) +
               operation.text +
               text.slice(operation.position);
      
      case 'delete':
        return text.slice(0, operation.position) +
               text.slice(operation.position + operation.length);
      
      default:
        return text;
    }
  }

  // Transform operation against history
  transformAgainstHistory(operation, history) {
    let transformed = operation;
    
    for (const historicalOp of history) {
      if (historicalOp.version > operation.version) {
        transformed = this.transform(historicalOp, transformed);
      }
    }
    
    return transformed;
  }
}

// Usage
const ot = new OperationalTransform();

let text = 'Hello World';

// User 1 inserts at position 6
const op1 = ot.insert(6, 'Beautiful ');
text = ot.apply(text, op1);
console.log(text); // Hello Beautiful World

// User 2 deletes at position 0 (concurrent)
const op2 = ot.delete(0, 6);

// Transform op2 against op1
const transformedOp2 = ot.transform(op1, op2);
text = ot.apply(text, transformedOp2);
console.log(text); // Beautiful World
```

### CRDT (Conflict-free Replicated Data Types)

```javascript
class LWWRegister {
  constructor(value, timestamp = Date.now(), clientId = Math.random()) {
    this.value = value;
    this.timestamp = timestamp;
    this.clientId = clientId;
  }

  set(value) {
    this.value = value;
    this.timestamp = Date.now();
  }

  merge(other) {
    if (other.timestamp > this.timestamp ||
        (other.timestamp === this.timestamp && other.clientId > this.clientId)) {
      this.value = other.value;
      this.timestamp = other.timestamp;
      this.clientId = other.clientId;
    }
  }

  getValue() {
    return this.value;
  }
}

class GCounter {
  constructor(clientId) {
    this.clientId = clientId;
    this.counts = new Map();
    this.counts.set(clientId, 0);
  }

  increment(amount = 1) {
    const current = this.counts.get(this.clientId) || 0;
    this.counts.set(this.clientId, current + amount);
  }

  merge(other) {
    for (const [clientId, count] of other.counts) {
      const current = this.counts.get(clientId) || 0;
      this.counts.set(clientId, Math.max(current, count));
    }
  }

  getValue() {
    let sum = 0;
    for (const count of this.counts.values()) {
      sum += count;
    }
    return sum;
  }
}

class PNCounter {
  constructor(clientId) {
    this.clientId = clientId;
    this.increments = new GCounter(clientId);
    this.decrements = new GCounter(clientId);
  }

  increment(amount = 1) {
    this.increments.increment(amount);
  }

  decrement(amount = 1) {
    this.decrements.increment(amount);
  }

  merge(other) {
    this.increments.merge(other.increments);
    this.decrements.merge(other.decrements);
  }

  getValue() {
    return this.increments.getValue() - this.decrements.getValue();
  }
}

class ORSet {
  constructor(clientId) {
    this.clientId = clientId;
    this.elements = new Map(); // element -> Set of unique tags
    this.tombstones = new Map(); // element -> Set of removed tags
  }

  add(element) {
    const tag = `${this.clientId}-${Date.now()}-${Math.random()}`;
    
    if (!this.elements.has(element)) {
      this.elements.set(element, new Set());
    }
    
    this.elements.get(element).add(tag);
  }

  remove(element) {
    if (!this.elements.has(element)) return;
    
    const tags = this.elements.get(element);
    
    if (!this.tombstones.has(element)) {
      this.tombstones.set(element, new Set());
    }
    
    tags.forEach(tag => this.tombstones.get(element).add(tag));
  }

  has(element) {
    if (!this.elements.has(element)) return false;
    
    const tags = this.elements.get(element);
    const removed = this.tombstones.get(element) || new Set();
    
    for (const tag of tags) {
      if (!removed.has(tag)) {
        return true;
      }
    }
    
    return false;
  }

  merge(other) {
    // Merge elements
    for (const [element, tags] of other.elements) {
      if (!this.elements.has(element)) {
        this.elements.set(element, new Set());
      }
      
      tags.forEach(tag => this.elements.get(element).add(tag));
    }
    
    // Merge tombstones
    for (const [element, tags] of other.tombstones) {
      if (!this.tombstones.has(element)) {
        this.tombstones.set(element, new Set());
      }
      
      tags.forEach(tag => this.tombstones.get(element).add(tag));
    }
  }

  values() {
    const result = [];
    
    for (const [element, tags] of this.elements) {
      const removed = this.tombstones.get(element) || new Set();
      
      for (const tag of tags) {
        if (!removed.has(tag)) {
          result.push(element);
          break;
        }
      }
    }
    
    return result;
  }
}

// Usage
const counter1 = new PNCounter('client1');
const counter2 = new PNCounter('client2');

counter1.increment(5);
counter2.increment(3);
counter2.decrement(2);

counter1.merge(counter2);
console.log(counter1.getValue()); // 6

const set1 = new ORSet('client1');
const set2 = new ORSet('client2');

set1.add('apple');
set1.add('banana');
set2.add('cherry');
set2.remove('apple');

set1.merge(set2);
console.log(set1.values()); // ['banana', 'cherry']
```

## Summary

Distributed frontend systems enable:
- **Micro-frontends**: Independent deployment and team autonomy
- **Module Federation**: Runtime code sharing across applications
- **Service Workers**: Offline capabilities and performance optimization
- **Edge Computing**: Reduced latency with edge functions
- **CDN Strategies**: Multi-CDN failover and smart asset loading
- **State Synchronization**: OT and CRDTs for real-time collaboration
- **Offline-First**: Progressive enhancement for unreliable networks

These patterns are essential for building scalable, resilient, globally distributed frontend applications.
