---
layout: page
title: "Advanced Web APIs Challenges"
difficulty: Hard
category: "Coding Problems"
tags: [web-apis, service-worker, webrtc, intersection-observer, performance]
---

# Advanced Web APIs Challenges

## Overview
Modern Web APIs provide powerful capabilities for building sophisticated frontend applications. These challenges focus on APIs commonly tested in Big Tech interviews.

---

## Challenge 1: Advanced Service Worker with Background Sync

### Problem Statement
Implement a robust offline-first application with background sync, push notifications, and intelligent caching strategies.

### Requirements
- Offline functionality with background sync
- Push notification handling
- Smart caching (cache-first, network-first, stale-while-revalidate)
- Periodic background sync
- Message passing between main thread and service worker

### Solution

{% raw %}
```typescript
// sw.ts - Service Worker
const CACHE_NAME = 'app-cache-v1';
const API_CACHE = 'api-cache-v1';
const BACKGROUND_SYNC_TAG = 'background-sync';

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
}

class AdvancedServiceWorker {
  private requestQueue: QueuedRequest[] = [];
  private retryAttempts = new Map<string, number>();

  async install(): Promise<void> {
    const urlsToCache = [
      '/',
      '/static/js/bundle.js',
      '/static/css/main.css',
      '/manifest.json'
    ];

    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urlsToCache);
    
    // Skip waiting to activate immediately
    await self.skipWaiting();
  }

  async activate(): Promise<void> {
    // Clean up old caches
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name !== CACHE_NAME && name !== API_CACHE)
        .map(name => caches.delete(name))
    );

    // Claim all clients immediately
    await self.clients.claim();
  }

  async handleFetch(event: FetchEvent): Promise<Response> {
    const { request } = event;
    const url = new URL(request.url);

    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
      return this.handleApiRequest(request);
    }

    // Handle static assets
    return this.handleStaticRequest(request);
  }

  private async handleApiRequest(request: Request): Promise<Response> {
    const cache = await caches.open(API_CACHE);
    
    try {
      // Try network first
      const networkResponse = await fetch(request.clone());
      
      if (networkResponse.ok) {
        // Cache successful responses
        await cache.put(request, networkResponse.clone());
        return networkResponse;
      }
      
      throw new Error('Network response not ok');
    } catch (error) {
      // Fall back to cache
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        // Queue request for background sync if it's a mutation
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
          await this.queueRequest(request);
        }
        
        return cachedResponse;
      }
      
      // If no cache, queue the request and return error response
      await this.queueRequest(request);
      return new Response(
        JSON.stringify({ error: 'Offline - request queued' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  private async handleStaticRequest(request: Request): Promise<Response> {
    const cache = await caches.open(CACHE_NAME);
    
    // Cache first strategy for static assets
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // Return offline page for navigation requests
      if (request.mode === 'navigate') {
        const offlinePage = await cache.match('/offline.html');
        return offlinePage || new Response('Offline', { status: 503 });
      }
      
      throw error;
    }
  }

  private async queueRequest(request: Request): Promise<void> {
    const queuedRequest: QueuedRequest = {
      id: crypto.randomUUID(),
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.method !== 'GET' ? await request.text() : undefined,
      timestamp: Date.now()
    };

    this.requestQueue.push(queuedRequest);
    await this.saveRequestQueue();
    
    // Register for background sync
    if ('serviceWorker' in self && 'sync' in self.registration) {
      await self.registration.sync.register(BACKGROUND_SYNC_TAG);
    }
  }

  async handleBackgroundSync(tag: string): Promise<void> {
    if (tag === BACKGROUND_SYNC_TAG) {
      await this.processRequestQueue();
    }
  }

  private async processRequestQueue(): Promise<void> {
    await this.loadRequestQueue();
    
    const failedRequests: QueuedRequest[] = [];
    
    for (const queuedRequest of this.requestQueue) {
      try {
        const request = new Request(queuedRequest.url, {
          method: queuedRequest.method,
          headers: queuedRequest.headers,
          body: queuedRequest.body
        });

        const response = await fetch(request);
        
        if (response.ok) {
          // Success - notify main thread
          await this.notifyClients('sync-success', { 
            requestId: queuedRequest.id,
            url: queuedRequest.url 
          });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        const attempts = this.retryAttempts.get(queuedRequest.id) || 0;
        
        if (attempts < 3) {
          this.retryAttempts.set(queuedRequest.id, attempts + 1);
          failedRequests.push(queuedRequest);
        } else {
          // Max retries reached - notify failure
          await this.notifyClients('sync-failed', {
            requestId: queuedRequest.id,
            url: queuedRequest.url,
            error: error.message
          });
        }
      }
    }
    
    this.requestQueue = failedRequests;
    await this.saveRequestQueue();
  }

  private async saveRequestQueue(): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(this.requestQueue));
    await cache.put('/sw-queue', response);
  }

  private async loadRequestQueue(): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('/sw-queue');
    
    if (response) {
      this.requestQueue = await response.json();
    }
  }

  async handlePush(event: PushEvent): Promise<void> {
    const data = event.data?.json() || {};
    
    const options: NotificationOptions = {
      title: data.title || 'New Notification',
      body: data.body || 'You have a new message',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: data.tag || 'default',
      data: data.data || {},
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      requireInteraction: true
    };

    await self.registration.showNotification(options.title!, options);
  }

  async handleNotificationClick(event: NotificationEvent): Promise<void> {
    event.notification.close();

    if (event.action === 'view') {
      const urlToOpen = event.notification.data?.url || '/';
      
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      // Check if app is already open
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    }
  }

  async handleMessage(event: ExtendableMessageEvent): Promise<void> {
    const { type, payload } = event.data;

    switch (type) {
      case 'SKIP_WAITING':
        await self.skipWaiting();
        break;
      
      case 'GET_QUEUE_STATUS':
        await this.loadRequestQueue();
        event.ports[0].postMessage({
          queueLength: this.requestQueue.length,
          requests: this.requestQueue
        });
        break;
      
      case 'CLEAR_CACHE':
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        event.ports[0].postMessage({ success: true });
        break;
    }
  }

  private async notifyClients(type: string, payload: any): Promise<void> {
    const clients = await self.clients.matchAll();
    
    for (const client of clients) {
      client.postMessage({ type, payload });
    }
  }
}

// Initialize service worker
const sw = new AdvancedServiceWorker();

self.addEventListener('install', (event) => {
  event.waitUntil(sw.install());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(sw.activate());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(sw.handleFetch(event));
});

self.addEventListener('sync', (event) => {
  event.waitUntil(sw.handleBackgroundSync(event.tag));
});

self.addEventListener('push', (event) => {
  event.waitUntil(sw.handlePush(event));
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(sw.handleNotificationClick(event));
});

self.addEventListener('message', (event) => {
  event.waitUntil(sw.handleMessage(event));
});
```
{% endraw %}

```typescript
// main.ts - Main Application
class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;

  async initialize(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        
        // Handle updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.notifyUpdateAvailable();
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));
        
        // Request notification permission
        await this.requestNotificationPermission();
        
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private handleMessage(event: MessageEvent): void {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'sync-success':
        console.log('Background sync successful:', payload);
        this.showNotification('Sync Complete', 'Your changes have been synced.');
        break;
      
      case 'sync-failed':
        console.error('Background sync failed:', payload);
        this.showNotification('Sync Failed', 'Some changes could not be synced.');
        break;
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration || !('pushManager' in this.registration)) {
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY!)
      });

      // Send subscription to server
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
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

  async getQueueStatus(): Promise<any> {
    if (!navigator.serviceWorker.controller) return null;

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_QUEUE_STATUS' },
        [channel.port2]
      );
    });
  }

  async clearCache(): Promise<boolean> {
    if (!navigator.serviceWorker.controller) return false;

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [channel.port2]
      );
    });
  }

  async updateServiceWorker(): Promise<void> {
    if (this.updateAvailable && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  private notifyUpdateAvailable(): void {
    // Show update notification to user
    this.showNotification('Update Available', 'A new version is available. Click to update.');
  }

  private showNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}

// Usage
const swManager = new ServiceWorkerManager();
swManager.initialize();
```

---

## Challenge 2: Advanced Intersection Observer with Virtualization

### Problem Statement
Create a virtualized list component that efficiently handles millions of items using Intersection Observer for performance optimization.

### Requirements
- Handle 1M+ list items efficiently
- Dynamic item heights
- Smooth scrolling performance
- Intersection-based lazy loading
- Memory optimization

### Solution

```typescript
interface VirtualItem {
  id: string;
  height?: number;
  data: any;
}

interface ViewportItem extends VirtualItem {
  index: number;
  top: number;
  bottom: number;
  isVisible: boolean;
}

class VirtualizedList {
  private container: HTMLElement;
  private scrollContainer: HTMLElement;
  private itemContainer: HTMLElement;
  private items: VirtualItem[] = [];
  private viewportItems: Map<number, ViewportItem> = new Map();
  private intersectionObserver: IntersectionObserver;
  private resizeObserver: ResizeObserver;
  private estimatedItemHeight = 50;
  private viewportHeight = 0;
  private scrollTop = 0;
  private totalHeight = 0;
  private visibleRange = { start: 0, end: 0 };
  private renderBuffer = 5;

  constructor(container: HTMLElement, items: VirtualItem[]) {
    this.container = container;
    this.items = items;
    this.setupDOM();
    this.setupObservers();
    this.calculateLayout();
    this.render();
  }

  private setupDOM(): void {
    this.container.innerHTML = `
      <div class="virtual-scroll-container" style="height: 100%; overflow-y: auto;">
        <div class="virtual-spacer-top"></div>
        <div class="virtual-item-container"></div>
        <div class="virtual-spacer-bottom"></div>
      </div>
    `;

    this.scrollContainer = this.container.querySelector('.virtual-scroll-container')!;
    this.itemContainer = this.container.querySelector('.virtual-item-container')!;
    
    this.scrollContainer.addEventListener('scroll', this.handleScroll.bind(this));
    this.viewportHeight = this.scrollContainer.clientHeight;
  }

  private setupObservers(): void {
    // Intersection Observer for visibility tracking
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = parseInt(entry.target.getAttribute('data-index')!, 10);
          const item = this.viewportItems.get(index);
          
          if (item) {
            item.isVisible = entry.isIntersecting;
            
            if (entry.isIntersecting) {
              this.loadItemData(item);
            }
          }
        }
      },
      {
        root: this.scrollContainer,
        rootMargin: '100px 0px',
        threshold: 0
      }
    );

    // Resize Observer for dynamic heights
    this.resizeObserver = new ResizeObserver((entries) => {
      let needsRecalculation = false;
      
      for (const entry of entries) {
        const index = parseInt(entry.target.getAttribute('data-index')!, 10);
        const item = this.viewportItems.get(index);
        const newHeight = entry.contentRect.height;
        
        if (item && item.height !== newHeight) {
          item.height = newHeight;
          this.items[index].height = newHeight;
          needsRecalculation = true;
        }
      }
      
      if (needsRecalculation) {
        this.calculateLayout();
        this.updateSpacers();
      }
    });
  }

  private calculateLayout(): void {
    let currentTop = 0;
    
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const height = item.height || this.estimatedItemHeight;
      
      if (this.viewportItems.has(i)) {
        const viewportItem = this.viewportItems.get(i)!;
        viewportItem.top = currentTop;
        viewportItem.bottom = currentTop + height;
      }
      
      currentTop += height;
    }
    
    this.totalHeight = currentTop;
  }

  private handleScroll(): void {
    this.scrollTop = this.scrollContainer.scrollTop;
    this.updateVisibleRange();
    this.render();
  }

  private updateVisibleRange(): void {
    const viewportTop = this.scrollTop;
    const viewportBottom = this.scrollTop + this.viewportHeight;
    
    let start = 0;
    let end = this.items.length - 1;
    
    // Binary search for start
    let left = 0;
    let right = this.items.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const itemTop = this.getItemTop(mid);
      const itemBottom = itemTop + this.getItemHeight(mid);
      
      if (itemBottom < viewportTop) {
        left = mid + 1;
      } else if (itemTop > viewportBottom) {
        right = mid - 1;
      } else {
        start = mid;
        break;
      }
    }
    
    // Binary search for end
    left = start;
    right = this.items.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const itemTop = this.getItemTop(mid);
      const itemBottom = itemTop + this.getItemHeight(mid);
      
      if (itemTop > viewportBottom) {
        right = mid - 1;
      } else {
        end = mid;
        left = mid + 1;
      }
    }
    
    // Add buffer
    start = Math.max(0, start - this.renderBuffer);
    end = Math.min(this.items.length - 1, end + this.renderBuffer);
    
    this.visibleRange = { start, end };
  }

  private getItemTop(index: number): number {
    let top = 0;
    for (let i = 0; i < index; i++) {
      top += this.getItemHeight(i);
    }
    return top;
  }

  private getItemHeight(index: number): number {
    return this.items[index].height || this.estimatedItemHeight;
  }

  private render(): void {
    // Remove items outside visible range
    for (const [index, item] of this.viewportItems) {
      if (index < this.visibleRange.start || index > this.visibleRange.end) {
        this.removeItem(index);
      }
    }
    
    // Add items in visible range
    for (let i = this.visibleRange.start; i <= this.visibleRange.end; i++) {
      if (!this.viewportItems.has(i)) {
        this.addItem(i);
      }
    }
    
    this.updateSpacers();
  }

  private addItem(index: number): void {
    const item = this.items[index];
    const element = this.createItemElement(item, index);
    
    const viewportItem: ViewportItem = {
      ...item,
      index,
      top: this.getItemTop(index),
      bottom: this.getItemTop(index) + this.getItemHeight(index),
      isVisible: false
    };
    
    this.viewportItems.set(index, viewportItem);
    this.itemContainer.appendChild(element);
    
    // Observe for intersection and resize
    this.intersectionObserver.observe(element);
    this.resizeObserver.observe(element);
  }

  private removeItem(index: number): void {
    const element = this.itemContainer.querySelector(`[data-index="${index}"]`);
    if (element) {
      this.intersectionObserver.unobserve(element);
      this.resizeObserver.unobserve(element);
      element.remove();
    }
    
    this.viewportItems.delete(index);
  }

  private createItemElement(item: VirtualItem, index: number): HTMLElement {
    const element = document.createElement('div');
    element.className = 'virtual-item';
    element.setAttribute('data-index', index.toString());
    element.style.minHeight = `${this.getItemHeight(index)}px`;
    
    // Initially show loading state
    element.innerHTML = `
      <div class="item-loading">
        <div class="skeleton"></div>
      </div>
    `;
    
    return element;
  }

  private async loadItemData(item: ViewportItem): Promise<void> {
    // Simulate async data loading
    if (!item.data.loaded) {
      const element = this.itemContainer.querySelector(`[data-index="${item.index}"]`);
      if (element) {
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        
        item.data.loaded = true;
        element.innerHTML = this.renderItemContent(item.data);
      }
    }
  }

  private renderItemContent(data: any): string {
    return `
      <div class="item-content">
        <h3>${data.title || `Item ${data.id}`}</h3>
        <p>${data.description || 'Lorem ipsum dolor sit amet...'}</p>
        <div class="item-meta">
          <span>ID: ${data.id}</span>
          <span>Type: ${data.type || 'default'}</span>
        </div>
      </div>
    `;
  }

  private updateSpacers(): void {
    const topSpacer = this.container.querySelector('.virtual-spacer-top') as HTMLElement;
    const bottomSpacer = this.container.querySelector('.virtual-spacer-bottom') as HTMLElement;
    
    const topHeight = this.getItemTop(this.visibleRange.start);
    const bottomHeight = this.totalHeight - this.getItemTop(this.visibleRange.end + 1);
    
    topSpacer.style.height = `${topHeight}px`;
    bottomSpacer.style.height = `${bottomHeight}px`;
  }

  public scrollToIndex(index: number): void {
    const itemTop = this.getItemTop(index);
    this.scrollContainer.scrollTop = itemTop;
  }

  public getVisibleItems(): ViewportItem[] {
    return Array.from(this.viewportItems.values()).filter(item => item.isVisible);
  }

  public updateItems(newItems: VirtualItem[]): void {
    this.items = newItems;
    this.viewportItems.clear();
    this.itemContainer.innerHTML = '';
    this.calculateLayout();
    this.updateVisibleRange();
    this.render();
  }

  public destroy(): void {
    this.intersectionObserver.disconnect();
    this.resizeObserver.disconnect();
    this.scrollContainer.removeEventListener('scroll', this.handleScroll);
  }
}

// Usage
const generateItems = (count: number): VirtualItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    height: undefined, // Dynamic height
    data: {
      id: index,
      title: `Item ${index}`,
      description: `Description for item ${index}`,
      type: ['text', 'image', 'video'][index % 3],
      loaded: false
    }
  }));
};

const container = document.getElementById('virtual-list-container')!;
const items = generateItems(1000000); // 1 million items
const virtualList = new VirtualizedList(container, items);
```

### CSS Styling

```css
.virtual-scroll-container {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.virtual-item {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.virtual-item:hover {
  background-color: #f5f5f5;
}

.item-loading {
  padding: 20px;
  display: flex;
  align-items: center;
}

.skeleton {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  flex: 1;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.item-content {
  padding: 20px;
}

.item-content h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.item-content p {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.5;
}

.item-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}

.item-meta span {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 12px;
}
```

---

## Challenge 3: Real-time Communication with WebRTC

### Problem Statement
Build a peer-to-peer video chat application with screen sharing, file transfer, and real-time messaging.

### Requirements
- Peer-to-peer video/audio calling
- Screen sharing functionality
- Real-time text messaging
- File transfer over data channels
- Connection quality monitoring

### Solution

```typescript
interface PeerConnectionConfig {
  iceServers: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
}

interface MediaConstraints {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}

class WebRTCManager {
  private localConnection: RTCPeerConnection;
  private remoteConnection: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private signalingChannel: WebSocket;
  private localVideo: HTMLVideoElement;
  private remoteVideo: HTMLVideoElement;
  private connectionStats: Map<string, RTCStatsReport> = new Map();
  private isScreenSharing = false;
  private originalVideoTrack: MediaStreamTrack | null = null;

  private config: PeerConnectionConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  constructor(
    localVideo: HTMLVideoElement,
    remoteVideo: HTMLVideoElement,
    signalingServerUrl: string
  ) {
    this.localVideo = localVideo;
    this.remoteVideo = remoteVideo;
    this.signalingChannel = new WebSocket(signalingServerUrl);
    
    this.setupSignaling();
    this.initializePeerConnections();
  }

  private setupSignaling(): void {
    this.signalingChannel.onopen = () => {
      console.log('Signaling channel connected');
    };

    this.signalingChannel.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      await this.handleSignalingMessage(message);
    };

    this.signalingChannel.onerror = (error) => {
      console.error('Signaling channel error:', error);
    };

    this.signalingChannel.onclose = () => {
      console.log('Signaling channel closed');
    };
  }

  private initializePeerConnections(): void {
    this.localConnection = new RTCPeerConnection(this.config);
    this.remoteConnection = new RTCPeerConnection(this.config);

    // Set up event handlers
    this.localConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          target: 'remote'
        });
      }
    };

    this.remoteConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          target: 'local'
        });
      }
    };

    this.localConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this.remoteVideo.srcObject = this.remoteStream;
    };

    this.remoteConnection.ontrack = (event) => {
      // Handle remote track
    };

    // Data channel setup
    this.setupDataChannel();
    
    // Connection state monitoring
    this.setupConnectionMonitoring();
  }

  private setupDataChannel(): void {
    this.dataChannel = this.localConnection.createDataChannel('messages', {
      ordered: true
    });

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      this.handleDataChannelMessage(event.data);
    };

    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
    };

    this.localConnection.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = (event) => {
        this.handleDataChannelMessage(event.data);
      };
    };
  }

  private setupConnectionMonitoring(): void {
    this.localConnection.onconnectionstatechange = () => {
      console.log('Local connection state:', this.localConnection.connectionState);
      this.updateConnectionUI();
    };

    this.remoteConnection.onconnectionstatechange = () => {
      console.log('Remote connection state:', this.remoteConnection.connectionState);
      this.updateConnectionUI();
    };

    // Start stats monitoring
    setInterval(() => {
      this.collectConnectionStats();
    }, 1000);
  }

  async startCall(constraints: MediaConstraints = { video: true, audio: true }): Promise<void> {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localVideo.srcObject = this.localStream;

      // Add tracks to peer connection
      for (const track of this.localStream.getTracks()) {
        this.localConnection.addTrack(track, this.localStream);
      }

      // Create offer
      const offer = await this.localConnection.createOffer();
      await this.localConnection.setLocalDescription(offer);

      // Send offer through signaling
      this.sendSignalingMessage({
        type: 'offer',
        offer: offer
      });

    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async answerCall(offer: RTCSessionDescriptionInit): Promise<void> {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      this.localVideo.srcObject = this.localStream;

      // Add tracks to peer connection
      for (const track of this.localStream.getTracks()) {
        this.remoteConnection.addTrack(track, this.localStream);
      }

      // Set remote description
      await this.remoteConnection.setRemoteDescription(offer);

      // Create answer
      const answer = await this.remoteConnection.createAnswer();
      await this.remoteConnection.setLocalDescription(answer);

      // Send answer through signaling
      this.sendSignalingMessage({
        type: 'answer',
        answer: answer
      });

    } catch (error) {
      console.error('Error answering call:', error);
      throw error;
    }
  }

  async startScreenShare(): Promise<void> {
    try {
      if (this.isScreenSharing) {
        await this.stopScreenShare();
        return;
      }

      // Get screen capture
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      
      // Store original video track
      const sender = this.localConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );

      if (sender && this.localStream) {
        this.originalVideoTrack = this.localStream.getVideoTracks()[0];
        await sender.replaceTrack(videoTrack);
      }

      // Update local video
      this.localVideo.srcObject = screenStream;
      this.isScreenSharing = true;

      // Handle screen share end
      videoTrack.onended = async () => {
        await this.stopScreenShare();
      };

    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  async stopScreenShare(): Promise<void> {
    if (!this.isScreenSharing || !this.originalVideoTrack) return;

    try {
      const sender = this.localConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(this.originalVideoTrack);
      }

      // Restore original video stream
      this.localVideo.srcObject = this.localStream;
      this.isScreenSharing = false;
      this.originalVideoTrack = null;

    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  }

  sendMessage(message: string): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      const messageData = {
        type: 'text',
        content: message,
        timestamp: Date.now()
      };
      
      this.dataChannel.send(JSON.stringify(messageData));
    }
  }

  async sendFile(file: File): Promise<void> {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const chunkSize = 16384; // 16KB chunks
    const fileReader = new FileReader();
    let offset = 0;

    // Send file metadata
    const metadata = {
      type: 'file-start',
      filename: file.name,
      filesize: file.size,
      filetype: file.type
    };
    
    this.dataChannel.send(JSON.stringify(metadata));

    return new Promise((resolve, reject) => {
      fileReader.onload = (event) => {
        const chunk = event.target!.result as ArrayBuffer;
        
        // Send chunk
        this.dataChannel!.send(JSON.stringify({
          type: 'file-chunk',
          data: Array.from(new Uint8Array(chunk))
        }));

        offset += chunk.byteLength;

        if (offset < file.size) {
          // Read next chunk
          const blob = file.slice(offset, offset + chunkSize);
          fileReader.readAsArrayBuffer(blob);
        } else {
          // File transfer complete
          this.dataChannel!.send(JSON.stringify({
            type: 'file-end'
          }));
          resolve();
        }
      };

      fileReader.onerror = reject;

      // Start reading first chunk
      const blob = file.slice(0, chunkSize);
      fileReader.readAsArrayBuffer(blob);
    });
  }

  private handleDataChannelMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'text':
          this.onTextMessage?.(message.content, message.timestamp);
          break;
        
        case 'file-start':
          this.onFileTransferStart?.(message.filename, message.filesize, message.filetype);
          break;
        
        case 'file-chunk':
          this.onFileChunk?.(message.data);
          break;
        
        case 'file-end':
          this.onFileTransferComplete?.();
          break;
      }
    } catch (error) {
      console.error('Error handling data channel message:', error);
    }
  }

  private async handleSignalingMessage(message: any): Promise<void> {
    switch (message.type) {
      case 'offer':
        await this.answerCall(message.offer);
        break;
      
      case 'answer':
        await this.localConnection.setRemoteDescription(message.answer);
        break;
      
      case 'ice-candidate':
        const connection = message.target === 'local' ? this.localConnection : this.remoteConnection;
        await connection.addIceCandidate(message.candidate);
        break;
    }
  }

  private sendSignalingMessage(message: any): void {
    if (this.signalingChannel.readyState === WebSocket.OPEN) {
      this.signalingChannel.send(JSON.stringify(message));
    }
  }

  private async collectConnectionStats(): Promise<void> {
    try {
      const stats = await this.localConnection.getStats();
      this.connectionStats.set('local', stats);
      
      // Analyze stats for quality metrics
      this.analyzeConnectionQuality(stats);
    } catch (error) {
      console.error('Error collecting stats:', error);
    }
  }

  private analyzeConnectionQuality(stats: RTCStatsReport): void {
    let inboundVideo: RTCInboundRtpStreamStats | undefined;
    let outboundVideo: RTCOutboundRtpStreamStats | undefined;

    stats.forEach((report) => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        inboundVideo = report as RTCInboundRtpStreamStats;
      } else if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
        outboundVideo = report as RTCOutboundRtpStreamStats;
      }
    });

    if (inboundVideo) {
      const quality = {
        packetsLost: inboundVideo.packetsLost || 0,
        packetsReceived: inboundVideo.packetsReceived || 0,
        bytesReceived: inboundVideo.bytesReceived || 0,
        frameWidth: inboundVideo.frameWidth || 0,
        frameHeight: inboundVideo.frameHeight || 0,
        framesPerSecond: inboundVideo.framesPerSecond || 0
      };

      this.onConnectionQualityUpdate?.(quality);
    }
  }

  private updateConnectionUI(): void {
    const state = this.localConnection.connectionState;
    this.onConnectionStateChange?.(state);
  }

  // Event handlers (to be set by consumers)
  onTextMessage?: (message: string, timestamp: number) => void;
  onFileTransferStart?: (filename: string, filesize: number, filetype: string) => void;
  onFileChunk?: (chunk: number[]) => void;
  onFileTransferComplete?: () => void;
  onConnectionQualityUpdate?: (quality: any) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;

  async disconnect(): Promise<void> {
    // Stop all tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connections
    this.localConnection.close();
    this.remoteConnection.close();

    // Close signaling channel
    this.signalingChannel.close();

    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close();
    }
  }
}

// Usage
const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;

const webrtc = new WebRTCManager(
  localVideo,
  remoteVideo,
  'wss://your-signaling-server.com'
);

// Set up event handlers
webrtc.onTextMessage = (message, timestamp) => {
  console.log('Received message:', message);
};

webrtc.onConnectionQualityUpdate = (quality) => {
  console.log('Connection quality:', quality);
};

// Start a call
document.getElementById('startCall')?.addEventListener('click', () => {
  webrtc.startCall();
});

// Start screen share
document.getElementById('shareScreen')?.addEventListener('click', () => {
  webrtc.startScreenShare();
});
```

These advanced Web API challenges demonstrate mastery of modern browser capabilities essential for senior frontend roles at major tech companies. Each solution includes performance optimization, error handling, and real-world complexity.
