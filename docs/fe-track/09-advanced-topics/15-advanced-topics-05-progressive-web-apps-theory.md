# Progressive Web Apps (PWA) Theory
## Building Modern Web Applications

**English:** Progressive Web Apps are web applications that use modern web capabilities to deliver app-like experiences, combining the best of web and native apps with offline support, push notifications, and installability.

**Tiếng Việt:** Progressive Web Apps là ứng dụng web sử dụng khả năng web hiện đại để cung cấp trải nghiệm giống ứng dụng, kết hợp tốt nhất của web và ứng dụng gốc với hỗ trợ offline, thông báo đẩy và khả năng cài đặt.

## Table of Contents
1. [PWA Fundamentals](#pwa-fundamentals)
2. [Service Workers](#service-workers)
3. [Caching Strategies](#caching-strategies)
4. [Offline Support](#offline-support)
5. [Web App Manifest](#web-app-manifest)
6. [Push Notifications](#push-notifications)
7. [Background Sync](#background-sync)
8. [Installation](#installation)
9. [Performance](#performance)
10. [Best Practices](#best-practices)

## PWA Fundamentals

### Core Characteristics

**Progressive:**
```
Works for every user
Regardless of browser choice
Progressive enhancement
```

**Responsive:**
```
Fits any form factor
Desktop, mobile, tablet
Adaptive layouts
```

**Connectivity Independent:**
```
Works offline
Works on low-quality networks
Service workers enable offline
```

**App-like:**
```
Feels like native app
App-style interactions
Immersive experience
```

**Fresh:**
```
Always up-to-date
Service worker update process
No manual updates needed
```

**Safe:**
```
Served via HTTPS
Prevents snooping
Ensures content integrity
```

**Discoverable:**
```
Identifiable as "application"
Search engines can find
W3C manifests
```

**Re-engageable:**
```
Push notifications
Bring users back
Timely updates
```

**Installable:**
```
Add to home screen
No app store needed
Standalone window
```

**Linkable:**
```
Share via URL
No complex installation
Easy distribution
```

### Requirements

**Minimum Requirements:**
```
✅ HTTPS (required)
✅ Service Worker (required)
✅ Web App Manifest (required)
✅ Responsive design (recommended)
✅ Fast loading (recommended)
```

**HTTPS Requirement:**
```
Service workers require HTTPS
Prevents man-in-the-middle attacks
Ensures content integrity
Exception: localhost for development
```

## Service Workers

### Definition

**Service Worker:** JavaScript file that runs in background, separate from web page

**Capabilities:**
- Intercept network requests
- Cache resources
- Push notifications
- Background sync
- Offline functionality

**Lifecycle:**
```
Register → Install → Activate → Fetch/Message → Terminate
```

### Registration

**Basic Registration:**
```javascript
// Check if service workers are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  });
}
```

**With Update Check:**
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 3600000);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            if (confirm('New version available! Reload?')) {
              window.location.reload();
            }
          }
        });
      });
    });
}
```

### Service Worker Lifecycle

**Install Event:**
```javascript
// sw.js
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png'
];

self.addEventListener('install', event => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  
  // Force waiting service worker to become active
  self.skipWaiting();
});
```

**Activate Event:**
```javascript
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});
```

**Fetch Event:**
```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
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

## Caching Strategies

### Cache First (Cache Falling Back to Network)

**Best for:** Static assets that don't change often

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
```

**Flow:**
```
Request → Check Cache → Found? Return : Fetch from Network
```

### Network First (Network Falling Back to Cache)

**Best for:** Dynamic content, API calls

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

**Flow:**
```
Request → Fetch from Network → Success? Return : Check Cache
```

### Cache Only

**Best for:** App shell, critical resources

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
  );
});
```

### Network Only

**Best for:** Analytics, non-GET requests

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
  );
});
```

### Stale While Revalidate

**Best for:** Frequently updated content

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        
        return response || fetchPromise;
      });
    })
  );
});
```

**Flow:**
```
Request → Return Cached (if exists) → Fetch from Network → Update Cache
```

### Cache Then Network

**Best for:** Showing cached content immediately, then updating

```javascript
// In page
const networkDataReceived = false;

// Fetch from cache
caches.match('/api/data').then(response => {
  if (!networkDataReceived) {
    return response.json();
  }
}).then(data => {
  updateUI(data);
});

// Fetch from network
fetch('/api/data').then(response => {
  return response.json();
}).then(data => {
  networkDataReceived = true;
  updateUI(data);
});
```

## Offline Support

### Offline Page

**Cache Offline Page:**
```javascript
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add(OFFLINE_URL))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
  }
});
```

### Offline Detection

**In Application:**
```javascript
// Check online status
if (navigator.onLine) {
  console.log('Online');
} else {
  console.log('Offline');
}

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('Back online');
  syncData();
});

window.addEventListener('offline', () => {
  console.log('Gone offline');
  showOfflineMessage();
});
```

### Offline Data Storage

**IndexedDB:**
```javascript
// Open database
const request = indexedDB.open('MyDatabase', 1);

request.onupgradeneeded = event => {
  const db = event.target.result;
  const objectStore = db.createObjectStore('posts', { keyPath: 'id' });
  objectStore.createIndex('timestamp', 'timestamp', { unique: false });
};

request.onsuccess = event => {
  const db = event.target.result;
  
  // Add data
  const transaction = db.transaction(['posts'], 'readwrite');
  const objectStore = transaction.objectStore('posts');
  objectStore.add({ id: 1, title: 'Post 1', timestamp: Date.now() });
  
  // Read data
  const getRequest = objectStore.get(1);
  getRequest.onsuccess = () => {
    console.log(getRequest.result);
  };
};
```

## Web App Manifest

### Manifest File

**manifest.json:**
```json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "A progressive web application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196F3",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/images/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/images/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/images/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/images/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/images/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/images/screenshot1.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ],
  "categories": ["productivity", "utilities"],
  "shortcuts": [
    {
      "name": "New Document",
      "short_name": "New",
      "description": "Create a new document",
      "url": "/new",
      "icons": [{ "src": "/images/new-icon.png", "sizes": "192x192" }]
    }
  ]
}
```

### Link Manifest

**In HTML:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My PWA</title>
  
  <!-- Web App Manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <!-- Theme color -->
  <meta name="theme-color" content="#2196F3">
  
  <!-- iOS specific -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="MyPWA">
  <link rel="apple-touch-icon" href="/images/icon-152x152.png">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/images/icon-32x32.png">
</head>
<body>
  <!-- App content -->
</body>
</html>
```

### Display Modes

**standalone:**
```
Opens in separate window
No browser UI
Looks like native app
```

**fullscreen:**
```
Uses entire screen
No browser or system UI
Immersive experience
```

**minimal-ui:**
```
Minimal browser UI
Back button, reload
Some navigation controls
```

**browser:**
```
Normal browser tab
Full browser UI
Default behavior
```

## Push Notifications

### Requesting Permission

```javascript
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('Notification permission granted');
    await subscribeUserToPush();
  } else if (permission === 'denied') {
    console.log('Notification permission denied');
  }
}
```

### Subscribe to Push

```javascript
async function subscribeUserToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
  });
  
  // Send subscription to server
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

### Handle Push Events

**In Service Worker:**
```javascript
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url
    },
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: '/images/open-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

## Background Sync

### Register Sync

```javascript
// Register background sync
async function registerBackgroundSync() {
  const registration = await navigator.serviceWorker.ready;
  
  try {
    await registration.sync.register('sync-posts');
    console.log('Background sync registered');
  } catch (error) {
    console.error('Background sync registration failed:', error);
  }
}

// Save data for later sync
async function savePostForLater(postData) {
  // Save to IndexedDB
  await saveToIndexedDB('pending-posts', postData);
  
  // Register sync
  await registerBackgroundSync();
}
```

### Handle Sync Event

**In Service Worker:**
```javascript
self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

async function syncPosts() {
  // Get pending posts from IndexedDB
  const posts = await getFromIndexedDB('pending-posts');
  
  // Send each post
  for (const post of posts) {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });
      
      if (response.ok) {
        // Remove from IndexedDB
        await removeFromIndexedDB('pending-posts', post.id);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      throw error; // Retry later
    }
  }
}
```

## Installation

### Install Prompt

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', event => {
  // Prevent default install prompt
  event.preventDefault();
  
  // Store event for later
  deferredPrompt = event;
  
  // Show custom install button
  showInstallButton();
});

async function showInstallPrompt() {
  if (!deferredPrompt) {
    return;
  }
  
  // Show install prompt
  deferredPrompt.prompt();
  
  // Wait for user choice
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('User accepted install');
  } else {
    console.log('User dismissed install');
  }
  
  // Clear prompt
  deferredPrompt = null;
}

// Detect if installed
window.addEventListener('appinstalled', event => {
  console.log('PWA installed');
  hideInstallButton();
});

// Check if running as installed app
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('Running as installed PWA');
}
```

## Performance

### App Shell Architecture

**Concept:**
```
App Shell: Minimal HTML, CSS, JS for UI
Content: Dynamic data loaded separately

Benefits:
- Fast initial load
- Offline capability
- Native-like performance
```

**Implementation:**
```javascript
// Cache app shell during install
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles/app.css',
  '/scripts/app.js',
  '/images/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('app-shell-v1')
      .then(cache => cache.addAll(APP_SHELL))
  );
});

// Serve app shell, fetch content
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then(response => response || fetch(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

### Lazy Loading

```javascript
// Lazy load images
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

### Code Splitting

```javascript
// Dynamic import
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});

// Route-based splitting
const routes = {
  '/home': () => import('./pages/home.js'),
  '/about': () => import('./pages/about.js'),
  '/contact': () => import('./pages/contact.js')
};

async function loadRoute(path) {
  const loadPage = routes[path];
  if (loadPage) {
    const page = await loadPage();
    page.render();
  }
}
```

## Best Practices

### Performance

**Optimize Assets:**
```
- Minify CSS, JS
- Compress images
- Use WebP format
- Lazy load resources
- Code splitting
```

**Measure Performance:**
```javascript
// Performance API
const perfData = performance.getEntriesByType('navigation')[0];
console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd);
console.log('Load Complete:', perfData.loadEventEnd);

// Lighthouse CI
// Run in CI/CD pipeline
// Monitor performance metrics
```

### Security

**HTTPS Only:**
```
Service workers require HTTPS
Prevents man-in-the-middle attacks
Use Let's Encrypt for free certificates
```

**Content Security Policy:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

### Accessibility

**Semantic HTML:**
```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>
```

**ARIA Labels:**
```html
<button aria-label="Close dialog" onclick="closeDialog()">
  <span aria-hidden="true">×</span>
</button>
```

### Testing

**Service Worker Testing:**
```javascript
// Test service worker registration
describe('Service Worker', () => {
  it('should register', async () => {
    const registration = await navigator.serviceWorker.register('/sw.js');
    expect(registration).toBeDefined();
  });
  
  it('should cache resources', async () => {
    const cache = await caches.open('test-cache');
    await cache.add('/index.html');
    const response = await cache.match('/index.html');
    expect(response).toBeDefined();
  });
});
```

## Interview Questions

**Q: What are the core requirements for a PWA?**

A: HTTPS (security), Service Worker (offline/caching), Web App Manifest (installability). Additionally: responsive design, fast loading, works offline, re-engageable (push notifications), and provides app-like experience.

**Q: Explain service worker lifecycle.**

A: Register → Install (cache resources) → Activate (clean old caches) → Fetch (intercept requests) → Terminate (when idle). Use skipWaiting() to activate immediately, clients.claim() to control pages immediately.

**Q: What's the difference between Cache First and Network First strategies?**

A: Cache First checks cache before network (fast, good for static assets). Network First tries network before cache (fresh data, good for dynamic content). Choose based on whether freshness or speed is priority.

**Q: How do push notifications work in PWAs?**

A: Request permission, subscribe to push service (get subscription object), send subscription to server, server sends push message, service worker receives push event, shows notification. Requires HTTPS and user permission.

**Q: What is the app shell architecture?**

A: Minimal HTML/CSS/JS for UI cached during install, content loaded dynamically. Benefits: fast initial load, offline capability, native-like performance. Shell loads instantly, content fills in progressively.

---

[← Back to Reactive Programming](./04-reactive-programming-theory.md) | [Next: Web Standards →](./06-web-standards-theory.md)
