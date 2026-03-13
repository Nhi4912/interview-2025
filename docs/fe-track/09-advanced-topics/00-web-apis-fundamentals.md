# Web APIs Fundamentals / Nền Tảng Web APIs

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

[Back to Table of Contents](../../00-table-of-contents.md) | [JavaScript Challenges](./11-interview-practice-01-javascript-challenges.md) | [Concept Map](./12-visual-learning-01-javascript-concepts-map.md)

## Overview
Giáo trình này tổng hợp các Web APIs quan trọng cho phỏng vấn Frontend, tập trung vào cách hoạt động, trade-off, và các lỗi triển khai thường gặp trong production.

## Overview / Tổng Quan
- Mục tiêu: hiểu API theo **behavior thực tế** thay vì chỉ thuộc cú pháp.
- Trọng tâm interview: lifecycle, performance, memory, security, error handling.
- Tài liệu liên quan: [Coding Patterns](./11-interview-practice-04-coding-patterns.md), [Tools Practical Applications](./13-tools-ecosystem-08-tools-practical-applications.md).

## API Index
1. **DOM API** - Truy cập, thay đổi, và điều hướng cây DOM an toàn, hiệu năng tốt.
2. **Fetch API & XMLHttpRequest** - Networking bất đồng bộ, timeout, cancel, retry, streaming.
3. **Web Storage** - localStorage/sessionStorage, quota, đồng bộ hoá tab.
4. **IndexedDB** - Client DB dạng key-value/object store cho dữ liệu lớn.
5. **WebSocket** - Realtime full-duplex, reconnection, heartbeat, backpressure.
6. **Service Worker** - Offline-first, caching strategies, background sync.
7. **Web Worker** - Tách CPU-heavy khỏi main thread, tránh jank UI.
8. **Intersection Observer** - Theo dõi phần tử vào viewport, lazy load, analytics.
9. **ResizeObserver** - Theo dõi kích thước element để responsive logic.
10. **MutationObserver** - Theo dõi thay đổi DOM để instrumentation/reactive logic.

## 01. DOM API
### Overview / Tổng Quan
DOM API là nhóm API giúp frontend giải quyết bài toán thực tế: Truy cập, thay đổi, và điều hướng cây DOM an toàn, hiệu năng tốt.
### Explanation / Giải thích
- DOM API note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- DOM API note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- DOM API note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- DOM API note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- DOM API note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- DOM API note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- DOM API note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- DOM API note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
export function buildList(items: string[]): HTMLUListElement {
  const ul = document.createElement('ul');
  const frag = document.createDocumentFragment();

  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item;
    li.dataset.role = 'result-item';
    frag.appendChild(li);
  }

  ul.appendChild(frag);
  return ul;
}
```
### Interview Notes
- Khi phỏng vấn về DOM API, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về DOM API, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về DOM API, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về DOM API, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về DOM API, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về DOM API, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 02. Fetch API & XMLHttpRequest
### Overview / Tổng Quan
Fetch API & XMLHttpRequest là nhóm API giúp frontend giải quyết bài toán thực tế: Networking bất đồng bộ, timeout, cancel, retry, streaming.
### Explanation / Giải thích
- Fetch API & XMLHttpRequest note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Fetch API & XMLHttpRequest note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Fetch API & XMLHttpRequest note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Fetch API & XMLHttpRequest note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Fetch API & XMLHttpRequest note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Fetch API & XMLHttpRequest note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Fetch API & XMLHttpRequest note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Fetch API & XMLHttpRequest note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
export async function fetchWithTimeout(url: string, ms = 5000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export function getWithXHR(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve(xhr.responseText) : reject(new Error(String(xhr.status)));
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send();
  });
}
```
### Interview Notes
- Khi phỏng vấn về Fetch API & XMLHttpRequest, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về Fetch API & XMLHttpRequest, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về Fetch API & XMLHttpRequest, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về Fetch API & XMLHttpRequest, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về Fetch API & XMLHttpRequest, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về Fetch API & XMLHttpRequest, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 03. Web Storage
### Overview / Tổng Quan
Web Storage là nhóm API giúp frontend giải quyết bài toán thực tế: localStorage/sessionStorage, quota, đồng bộ hoá tab.
### Explanation / Giải thích
- Web Storage note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Storage note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Storage note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Storage note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Storage note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Storage note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Storage note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Storage note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem('theme', theme);
}

export function loadTheme(): 'light' | 'dark' {
  const value = localStorage.getItem('theme');
  return value === 'dark' ? 'dark' : 'light';
}
```
### Interview Notes
- Khi phỏng vấn về Web Storage, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về Web Storage, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về Web Storage, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về Web Storage, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về Web Storage, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về Web Storage, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 04. IndexedDB
### Overview / Tổng Quan
IndexedDB là nhóm API giúp frontend giải quyết bài toán thực tế: Client DB dạng key-value/object store cho dữ liệu lớn.
### Explanation / Giải thích
- IndexedDB note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- IndexedDB note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- IndexedDB note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- IndexedDB note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- IndexedDB note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- IndexedDB note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- IndexedDB note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- IndexedDB note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
export async function openDb(): Promise<IDBDatabase> {
  return await new Promise((resolve, reject) => {
    const req = indexedDB.open('interview-db', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
```
### Interview Notes
- Khi phỏng vấn về IndexedDB, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về IndexedDB, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về IndexedDB, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về IndexedDB, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về IndexedDB, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về IndexedDB, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 05. WebSocket
### Overview / Tổng Quan
WebSocket là nhóm API giúp frontend giải quyết bài toán thực tế: Realtime full-duplex, reconnection, heartbeat, backpressure.
### Explanation / Giải thích
- WebSocket note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- WebSocket note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- WebSocket note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- WebSocket note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- WebSocket note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- WebSocket note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- WebSocket note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- WebSocket note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
type MessageHandler = (payload: string) => void;

export function connectWS(url: string, onMessage: MessageHandler): WebSocket {
  const ws = new WebSocket(url);
  ws.addEventListener('open', () => ws.send(JSON.stringify({ type: 'hello' })));
  ws.addEventListener('message', (event) => onMessage(String(event.data)));
  ws.addEventListener('close', () => console.log('socket closed'));
  ws.addEventListener('error', () => console.error('socket error'));
  return ws;
}
```
### Interview Notes
- Khi phỏng vấn về WebSocket, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về WebSocket, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về WebSocket, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về WebSocket, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về WebSocket, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về WebSocket, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 06. Service Worker
### Overview / Tổng Quan
Service Worker là nhóm API giúp frontend giải quyết bài toán thực tế: Offline-first, caching strategies, background sync.
### Explanation / Giải thích
- Service Worker note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Service Worker note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Service Worker note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Service Worker note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Service Worker note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Service Worker note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Service Worker note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Service Worker note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
// register-sw.ts
export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  return navigator.serviceWorker.register('/sw.js');
}

// sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request))
  );
});
```
### Interview Notes
- Khi phỏng vấn về Service Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về Service Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về Service Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về Service Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về Service Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về Service Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 07. Web Worker
### Overview / Tổng Quan
Web Worker là nhóm API giúp frontend giải quyết bài toán thực tế: Tách CPU-heavy khỏi main thread, tránh jank UI.
### Explanation / Giải thích
- Web Worker note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Worker note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Worker note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Worker note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Worker note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Worker note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Worker note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Web Worker note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
// main.ts
const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.postMessage({ type: 'sum', payload: [1, 2, 3, 4] });
worker.onmessage = (e) => console.log('sum=', e.data);

// worker.ts
self.onmessage = (e: MessageEvent<{ type: string; payload: number[] }>) => {
  if (e.data.type === 'sum') {
    const total = e.data.payload.reduce((a, b) => a + b, 0);
    postMessage(total);
  }
};
```
### Interview Notes
- Khi phỏng vấn về Web Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về Web Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về Web Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về Web Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về Web Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về Web Worker, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 08. Intersection Observer
### Overview / Tổng Quan
Intersection Observer là nhóm API giúp frontend giải quyết bài toán thực tế: Theo dõi phần tử vào viewport, lazy load, analytics.
### Explanation / Giải thích
- Intersection Observer note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Intersection Observer note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Intersection Observer note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Intersection Observer note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Intersection Observer note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Intersection Observer note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Intersection Observer note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- Intersection Observer note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
export function observeCards(selector = '.card'): IntersectionObserver {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    }
  }, { rootMargin: '200px 0px' });

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
  return observer;
}
```
### Interview Notes
- Khi phỏng vấn về Intersection Observer, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về Intersection Observer, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về Intersection Observer, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về Intersection Observer, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về Intersection Observer, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về Intersection Observer, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 09. ResizeObserver
### Overview / Tổng Quan
ResizeObserver là nhóm API giúp frontend giải quyết bài toán thực tế: Theo dõi kích thước element để responsive logic.
### Explanation / Giải thích
- ResizeObserver note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- ResizeObserver note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- ResizeObserver note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- ResizeObserver note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- ResizeObserver note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- ResizeObserver note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- ResizeObserver note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- ResizeObserver note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
export function watchContainer(el: Element): ResizeObserver {
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = entry.contentRect.width;
      if (width < 480) entry.target.classList.add('compact');
      else entry.target.classList.remove('compact');
    }
  });
  ro.observe(el);
  return ro;
}
```
### Interview Notes
- Khi phỏng vấn về ResizeObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về ResizeObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về ResizeObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về ResizeObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về ResizeObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về ResizeObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## 10. MutationObserver
### Overview / Tổng Quan
MutationObserver là nhóm API giúp frontend giải quyết bài toán thực tế: Theo dõi thay đổi DOM để instrumentation/reactive logic.
### Explanation / Giải thích
- MutationObserver note 1: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- MutationObserver note 2: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- MutationObserver note 3: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- MutationObserver note 4: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- MutationObserver note 5: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- MutationObserver note 6: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- MutationObserver note 7: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
- MutationObserver note 8: Phân tích behavior, edge case, và cách trả lời interview theo mindset production.
### Example / Ví dụ
```ts
export function trackDomMutations(node: Node): MutationObserver {
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        console.log('added=', m.addedNodes.length, 'removed=', m.removedNodes.length);
      }
    }
  });
  mo.observe(node, { childList: true, subtree: true, attributes: true });
  return mo;
}
```
### Interview Notes
- Khi phỏng vấn về MutationObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #1.
- Khi phỏng vấn về MutationObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #2.
- Khi phỏng vấn về MutationObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #3.
- Khi phỏng vấn về MutationObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #4.
- Khi phỏng vấn về MutationObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #5.
- Khi phỏng vấn về MutationObserver, hãy nêu rõ: khi nào dùng, khi nào không dùng, và cách đo hiệu năng #6.

## Cross References
- [JavaScript Practice 01](./11-interview-practice-01-javascript-challenges.md)
- [JavaScript Practice 02](./11-interview-practice-01-javascript-coding-challenges.md)
- [React Challenges](./11-interview-practice-02-react-coding-challenges.md)
- [Coding Patterns](./11-interview-practice-04-coding-patterns.md)
- [Concept Map](./12-visual-learning-01-javascript-concepts-map.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A
### 🟢 [Junior] Q1: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q2: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q3: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q4: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q5: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q6: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q7: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q8: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q9: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q10: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q11: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q12: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q13: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q14: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q15: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q16: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q17: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q18: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q19: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q20: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q21: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q22: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q23: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q24: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q25: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q26: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q27: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q28: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q29: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q30: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q31: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q32: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q33: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q34: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q35: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q36: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q37: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q38: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q39: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q40: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q41: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q42: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q43: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q44: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q45: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q46: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q47: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q48: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q49: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q50: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q51: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q52: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q53: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q54: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q55: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q56: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q57: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q58: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q59: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q60: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q61: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q62: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q63: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q64: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q65: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q66: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q67: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q68: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q69: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q70: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q71: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q72: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q73: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q74: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q75: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q76: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q77: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q78: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q79: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q80: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q81: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q82: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q83: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q84: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q85: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q86: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q87: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q88: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q89: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q90: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q91: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q92: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q93: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q94: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q95: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q96: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q97: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟡 [Mid] Q98: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🔴 [Senior] Q99: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
### 🟢 [Junior] Q100: Bạn xử lý tình huống Web API timeout/memory leak như thế nào?
- **Answer (EN):** Explain detection, mitigation, observability, and fallback path.
- **Trả lời (VI):** Bắt đầu bằng cách đo vấn đề, thêm guard logic, cleanup lifecycle, và cơ chế retry phù hợp.
- **Follow-up:** So sánh trade-off giữa đơn giản triển khai và độ tin cậy lâu dài.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
- Bổ sung ghi chú: Luôn verify cleanup listener/observer khi component unmount để tránh memory leak.
