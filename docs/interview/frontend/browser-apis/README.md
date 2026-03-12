# Browser APIs & Modern Web Platform

## Table of Contents

- [Web Workers](#web-workers)
- [Service Workers](#service-workers)
- [Progressive Web Apps (PWA)](#progressive-web-apps-pwa)
- [Web Storage APIs](#web-storage-apis)
- [Geolocation API](#geolocation-api)
- [Camera & Media APIs](#camera--media-apis)
- [Notification API](#notification-api)
- [WebSockets & Real-time Communication](#websockets--real-time-communication)
- [Intersection Observer](#intersection-observer)
- [Resize Observer](#resize-observer)
- [Mutation Observer](#mutation-observer)
- [WebAssembly (WASM)](#webassembly-wasm)
- [File System Access API](#file-system-access-api)
- [Web Authentication API](#web-authentication-api)
- [Performance APIs](#performance-apis)
- [Interview Questions](#interview-questions)

## Web Workers

Web Workers allow you to run JavaScript in the background, separate from the main UI thread.

### Basic Web Worker

```javascript
// main.js
const worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({ command: 'start', data: [1, 2, 3, 4, 5] });

// Receive data from worker
worker.onmessage = function(e) {
  console.log('Result from worker:', e.data);
};

// Handle errors
worker.onerror = function(error) {
  console.error('Worker error:', error);
};

// Terminate worker when done
worker.terminate();
```

```javascript
// worker.js
self.onmessage = function(e) {
  const { command, data } = e.data;
  
  if (command === 'start') {
    // Perform expensive computation
    const result = performHeavyCalculation(data);
    
    // Send result back to main thread
    self.postMessage(result);
  }
};

function performHeavyCalculation(data) {
  // Simulate expensive operation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += data.reduce((sum, num) => sum + num, 0);
  }
  return result;
}
```

### Advanced Web Worker with Shared Array Buffer

{% raw %}
```javascript
// main.js
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workers = [];
    this.taskQueue = [];
    this.activeTasks = new Map();
    
    for (let i = 0; i < poolSize; i++) {
      this.createWorker(workerScript, i);
    }
  }
  
  createWorker(script, id) {
    const worker = new Worker(script);
    worker.id = id;
    worker.busy = false;
    
    worker.onmessage = (e) => {
      const { taskId, result, error } = e.data;
      const task = this.activeTasks.get(taskId);
      
      if (task) {
        if (error) {
          task.reject(new Error(error));
        } else {
          task.resolve(result);
        }
        this.activeTasks.delete(taskId);
      }
      
      worker.busy = false;
      this.processQueue();
    };
    
    worker.onerror = (error) => {
      console.error(`Worker ${id} error:`, error);
    };
    
    this.workers.push(worker);
  }
  
  execute(data) {
    return new Promise((resolve, reject) => {
      const taskId = Date.now() + Math.random();
      const task = { taskId, data, resolve, reject };
      
      this.taskQueue.push(task);
      this.processQueue();
    });
  }
  
  processQueue() {
    if (this.taskQueue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;
    
    const task = this.taskQueue.shift();
    availableWorker.busy = true;
    this.activeTasks.set(task.taskId, task);
    
    availableWorker.postMessage({
      taskId: task.taskId,
      data: task.data
    });
  }
  
  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.activeTasks.clear();
    this.taskQueue = [];
  }
}

// Usage
const pool = new WorkerPool('calculation-worker.js', 4);

async function processLargeDataset(dataset) {
  const chunks = chunkArray(dataset, 1000);
  const promises = chunks.map(chunk => pool.execute(chunk));
  
  try {
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error('Processing failed:', error);
    throw error;
  }
}
```
{% endraw %}

## Service Workers

Service Workers act as a proxy between your web app and the network, enabling offline functionality and background sync.

### Basic Service Worker

```javascript
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration);
    })
    .catch(error => {
      console.log('SW registration failed:', error);
    });
}

// Listen for SW updates
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});
```

```javascript
// sw.js
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

### Advanced Service Worker with Strategies

```javascript
// sw.js
class CacheStrategy {
  static cacheFirst(request, cacheName) {
    return caches.open(cacheName).then(cache => {
      return cache.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      });
    });
  }
  
  static networkFirst(request, cacheName, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        // Fallback to cache if network is slow
        caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            resolve(cachedResponse);
          } else {
            reject(new Error('Network timeout and no cache'));
          }
        });
      }, timeout);
      
      fetch(request).then(networkResponse => {
        clearTimeout(timeoutId);
        
        if (networkResponse.ok) {
          caches.open(cacheName).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        
        resolve(networkResponse);
      }).catch(error => {
        clearTimeout(timeoutId);
        
        caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            resolve(cachedResponse);
          } else {
            reject(error);
          }
        });
      });
    });
  }
  
  static staleWhileRevalidate(request, cacheName) {
    return caches.open(cacheName).then(cache => {
      return cache.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request).then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
        
        return cachedResponse || fetchPromise;
      });
    });
  }
}

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    const pendingRequests = await getPendingRequests();
    
    for (const request of pendingRequests) {
      await fetch(request.url, request.options);
      await removePendingRequest(request.id);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
```

## Progressive Web Apps (PWA)

### Web App Manifest

```json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "A sample progressive web application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["productivity", "utilities"],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

### PWA Installation

```javascript
// PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault();
  
  // Store the event so it can be triggered later
  deferredPrompt = e;
  
  // Show custom install button
  showInstallButton();
});

function showInstallButton() {
  const installBtn = document.getElementById('install-btn');
  installBtn.style.display = 'block';
  
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      deferredPrompt = null;
      installBtn.style.display = 'none';
    }
  });
}

// Listen for app installation
window.addEventListener('appinstalled', (e) => {
  console.log('PWA was installed');
  hideInstallButton();
});

// Check if app is running in standalone mode
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}
```

## Web Storage APIs

### IndexedDB

```javascript
class IndexedDBManager {
  constructor(dbName, version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }
  
  async open(stores = []) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath || 'id',
              autoIncrement: store.autoIncrement || false
            });
            
            // Create indexes
            if (store.indexes) {
              store.indexes.forEach(index => {
                objectStore.createIndex(index.name, index.keyPath, {
                  unique: index.unique || false
                });
              });
            }
          }
        });
      };
    });
  }
  
  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async get(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async update(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async delete(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async query(storeName, indexName, keyRange) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(keyRange);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Usage
const dbManager = new IndexedDBManager('MyAppDB', 1);

const stores = [
  {
    name: 'users',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'email', keyPath: 'email', unique: true },
      { name: 'name', keyPath: 'name', unique: false }
    ]
  },
  {
    name: 'posts',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'userId', keyPath: 'userId', unique: false },
      { name: 'createdAt', keyPath: 'createdAt', unique: false }
    ]
  }
];

async function initDB() {
  await dbManager.open(stores);
  
  // Add user
  await dbManager.add('users', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });
  
  // Get user
  const user = await dbManager.get('users', 1);
  console.log('User:', user);
  
  // Query by email
  const usersByEmail = await dbManager.query(
    'users', 
    'email', 
    IDBKeyRange.only('john@example.com')
  );
  console.log('Users by email:', usersByEmail);
}
```

### Cache API

```javascript
class CacheManager {
  constructor(cacheName) {
    this.cacheName = cacheName;
  }
  
  async add(request, response) {
    const cache = await caches.open(this.cacheName);
    return cache.put(request, response);
  }
  
  async get(request) {
    const cache = await caches.open(this.cacheName);
    return cache.match(request);
  }
  
  async delete(request) {
    const cache = await caches.open(this.cacheName);
    return cache.delete(request);
  }
  
  async clear() {
    return caches.delete(this.cacheName);
  }
  
  async addAll(requests) {
    const cache = await caches.open(this.cacheName);
    return cache.addAll(requests);
  }
  
  async keys() {
    const cache = await caches.open(this.cacheName);
    return cache.keys();
  }
}

// Advanced caching with expiration
class ExpiringCache extends CacheManager {
  constructor(cacheName, defaultTTL = 3600000) { // 1 hour default
    super(cacheName);
    this.defaultTTL = defaultTTL;
  }
  
  async add(request, response, ttl = this.defaultTTL) {
    const cache = await caches.open(this.cacheName);
    const expirationTime = Date.now() + ttl;
    
    // Clone response to add expiration header
    const responseToCache = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'cache-expiration': expirationTime.toString()
      }
    });
    
    return cache.put(request, responseToCache);
  }
  
  async get(request) {
    const cache = await caches.open(this.cacheName);
    const response = await cache.match(request);
    
    if (!response) return null;
    
    const expirationTime = response.headers.get('cache-expiration');
    if (expirationTime && Date.now() > parseInt(expirationTime)) {
      // Cache expired, remove it
      await cache.delete(request);
      return null;
    }
    
    return response;
  }
  
  async cleanup() {
    const cache = await caches.open(this.cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const expirationTime = response.headers.get('cache-expiration');
      
      if (expirationTime && Date.now() > parseInt(expirationTime)) {
        await cache.delete(request);
      }
    }
  }
}
```

## Geolocation API

```javascript
class GeolocationManager {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
  }
  
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          resolve(position);
        },
        (error) => {
          reject(this.formatError(error));
        },
        finalOptions
      );
    });
  }
  
  startWatching(callback, errorCallback, options = {}) {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation is not supported'));
      return;
    }
    
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 60000 // 1 minute
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = position;
        callback(position);
      },
      (error) => {
        errorCallback(this.formatError(error));
      },
      finalOptions
    );
    
    return this.watchId;
  }
  
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
  
  formatError(error) {
    const errorMessages = {
      1: 'Permission denied by user',
      2: 'Position unavailable',
      3: 'Request timeout'
    };
    
    return new Error(errorMessages[error.code] || 'Unknown geolocation error');
  }
  
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }
  
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

// Usage
const geoManager = new GeolocationManager();

async function trackUserLocation() {
  try {
    // Get current position
    const position = await geoManager.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000
    });
    
    console.log('Current position:', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    });
    
    // Start watching for position changes
    geoManager.startWatching(
      (position) => {
        console.log('Position updated:', position.coords);
        updateMapLocation(position.coords);
      },
      (error) => {
        console.error('Geolocation error:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000
      }
    );
    
  } catch (error) {
    console.error('Failed to get location:', error.message);
  }
}
```

## Camera & Media APIs

### getUserMedia for Camera Access

```javascript
class CameraManager {
  constructor() {
    this.stream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }
  
  async getDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return {
        videoInputs: devices.filter(device => device.kind === 'videoinput'),
        audioInputs: devices.filter(device => device.kind === 'audioinput')
      };
    } catch (error) {
      throw new Error(`Failed to enumerate devices: ${error.message}`);
    }
  }
  
  async startCamera(constraints = {}) {
    const defaultConstraints = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      },
      audio: true
    };
    
    const finalConstraints = this.mergeConstraints(defaultConstraints, constraints);
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(finalConstraints);
      return this.stream;
    } catch (error) {
      throw new Error(`Failed to access camera: ${error.message}`);
    }
  }
  
  async startScreenCapture(constraints = {}) {
    const defaultConstraints = {
      video: {
        mediaSource: 'screen'
      },
      audio: true
    };
    
    const finalConstraints = this.mergeConstraints(defaultConstraints, constraints);
    
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia(finalConstraints);
      return this.stream;
    } catch (error) {
      throw new Error(`Failed to capture screen: ${error.message}`);
    }
  }
  
  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  
  async startRecording(options = {}) {
    if (!this.stream) {
      throw new Error('No active stream to record');
    }
    
    const defaultOptions = {
      mimeType: 'video/webm; codecs=vp9',
      videoBitsPerSecond: 2500000
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream, finalOptions);
    
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };
    
    this.mediaRecorder.start();
    
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        resolve(blob);
      };
    });
  }
  
  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
  
  capturePhoto(videoElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    context.drawImage(videoElement, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  }
  
  mergeConstraints(defaults, custom) {
    const result = { ...defaults };
    
    if (custom.video) {
      result.video = { ...defaults.video, ...custom.video };
    }
    
    if (custom.audio) {
      result.audio = typeof custom.audio === 'object' 
        ? { ...defaults.audio, ...custom.audio }
        : custom.audio;
    }
    
    return result;
  }
}

// Usage
const cameraManager = new CameraManager();

async function initCamera() {
  try {
    // Get available devices
    const devices = await cameraManager.getDevices();
    console.log('Available cameras:', devices.videoInputs);
    
    // Start camera
    const stream = await cameraManager.startCamera({
      video: {
        deviceId: devices.videoInputs[0]?.deviceId,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    
    // Display in video element
    const videoElement = document.getElementById('camera-preview');
    videoElement.srcObject = stream;
    
    // Start recording
    const recordingPromise = await cameraManager.startRecording();
    
    // Stop recording after 10 seconds
    setTimeout(async () => {
      cameraManager.stopRecording();
      const videoBlob = await recordingPromise;
      
      // Download the recorded video
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recorded-video.webm';
      a.click();
    }, 10000);
    
  } catch (error) {
    console.error('Camera initialization failed:', error);
  }
}
```

## Intersection Observer

```javascript
class IntersectionObserverManager {
  constructor(callback, options = {}) {
    const defaultOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1
    };
    
    this.options = { ...defaultOptions, ...options };
    this.observer = new IntersectionObserver(callback, this.options);
    this.observedElements = new Set();
  }
  
  observe(element) {
    this.observer.observe(element);
    this.observedElements.add(element);
  }
  
  unobserve(element) {
    this.observer.unobserve(element);
    this.observedElements.delete(element);
  }
  
  disconnect() {
    this.observer.disconnect();
    this.observedElements.clear();
  }
}

// Lazy loading images
class LazyImageLoader {
  constructor() {
    this.observer = new IntersectionObserverManager(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px 0px', // Load 50px before entering viewport
        threshold: 0
      }
    );
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.observer.unobserve(img);
      }
    });
  }
  
  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src) {
      img.src = src;
    }
    
    if (srcset) {
      img.srcset = srcset;
    }
    
    img.classList.remove('lazy');
    img.classList.add('loaded');
    
    img.onload = () => {
      img.classList.add('fade-in');
    };
  }
  
  observeImages(selector = 'img[data-src]') {
    const images = document.querySelectorAll(selector);
    images.forEach(img => this.observer.observe(img));
  }
}

// Infinite scroll
class InfiniteScroll {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.loading = false;
    this.hasMore = true;
    
    this.sentinel = document.createElement('div');
    this.sentinel.className = 'intersection-sentinel';
    
    this.observer = new IntersectionObserverManager(
      this.handleIntersection.bind(this),
      {
        rootMargin: '100px 0px',
        threshold: 0
      }
    );
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.loading && this.hasMore) {
        this.loading = true;
        this.callback().then((hasMore) => {
          this.loading = false;
          this.hasMore = hasMore;
          
          if (!hasMore) {
            this.destroy();
          }
        });
      }
    });
  }
  
  init(container) {
    container.appendChild(this.sentinel);
    this.observer.observe(this.sentinel);
  }
  
  destroy() {
    this.observer.disconnect();
    if (this.sentinel.parentNode) {
      this.sentinel.parentNode.removeChild(this.sentinel);
    }
  }
}

// Usage
const lazyLoader = new LazyImageLoader();
lazyLoader.observeImages();

const infiniteScroll = new InfiniteScroll(async () => {
  const response = await fetch(`/api/items?page=${currentPage++}`);
  const items = await response.json();
  
  appendItemsToDOM(items);
  
  return items.length > 0; // Has more items
});

infiniteScroll.init(document.getElementById('items-container'));
```

## Interview Questions

### 1. What are Web Workers and when would you use them?

**Answer:**
Web Workers are a way to run JavaScript in the background, separate from the main UI thread. They enable parallel processing without blocking the UI.

**Use cases:**
- Heavy computations (image processing, data analysis)
- Background data sync
- Real-time data processing
- Cryptographic operations

**Benefits:**
- Non-blocking UI operations
- True parallelism
- Isolated execution context
- Better performance for CPU-intensive tasks

### 2. Explain the difference between Service Workers and Web Workers.

**Answer:**
- **Web Workers**: General-purpose background scripts for computations
- **Service Workers**: Specialized workers that act as a proxy between your app and the network

**Service Worker features:**
- Intercept network requests
- Cache management
- Push notifications
- Background sync
- Offline functionality

### 3. How do you implement offline functionality in a web app?

**Answer:**
```javascript
// Service Worker for caching
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).catch(() => {
          // Return offline fallback
          return caches.match('/offline.html');
        });
      })
    );
  }
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncPendingRequests());
  }
});
```

### 4. What is the Intersection Observer API and its benefits?

**Answer:**
Intersection Observer provides an efficient way to observe changes in the intersection of a target element with an ancestor element or viewport.

**Benefits:**
- Better performance than scroll events
- Automatic cleanup
- Configurable thresholds and margins
- Passive observation

**Use cases:**
- Lazy loading
- Infinite scroll
- Analytics tracking
- Animation triggers

### 5. How do you handle camera and media access in web applications?

**Answer:**
```javascript
// Request camera access
const stream = await navigator.mediaDevices.getUserMedia({
  video: { width: 1280, height: 720 },
  audio: true
});

// Handle permissions
navigator.permissions.query({ name: 'camera' }).then(result => {
  if (result.state === 'granted') {
    // Access granted
  } else if (result.state === 'prompt') {
    // Will prompt user
  } else {
    // Access denied
  }
});
```

**Security considerations:**
- HTTPS required
- User permission required
- Clear user indication when recording
- Proper cleanup of resources

This comprehensive guide covers the essential browser APIs and modern web platform features needed for advanced frontend development and interviews.
