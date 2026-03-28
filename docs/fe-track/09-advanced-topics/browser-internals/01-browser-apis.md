# Browser APIs / API Trình Duyệt

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Web APIs - Chapter 1 / API Web - Chương 1

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Fetch & HTTP →](./02-fetch-http.md)

---

## Overview / Tổng Quan

**English:** Browser APIs provide powerful functionality for interacting with the browser and device. Understanding these APIs is crucial for building modern web applications and succeeding in frontend interviews.

**Tiếng Việt:** API trình duyệt cung cấp chức năng mạnh mẽ để tương tác với trình duyệt và thiết bị. Hiểu các API này rất quan trọng để xây dựng ứng dụng web hiện đại và thành công trong phỏng vấn frontend.

---

## Table of Contents / Mục Lục

1. [DOM API / API DOM](#dom-api--api-dom)
2. [Storage APIs / API Lưu Trữ](#storage-apis--api-lưu-trữ)
3. [Geolocation API / API Định Vị](#geolocation-api--api-định-vị)
4. [Intersection Observer / Observer Giao Điểm](#intersection-observer--observer-giao-điểm)
5. [Mutation Observer / Observer Thay Đổi](#mutation-observer--observer-thay-đổi)
6. [Web Workers / Worker Web](#web-workers--worker-web)
7. [Service Workers / Worker Dịch Vụ](#service-workers--worker-dịch-vụ)
8. [Notification API / API Thông Báo](#notification-api--api-thông-báo)
9. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## DOM API / API DOM

### Element Selection / Chọn Phần Tử

```javascript
// Modern selectors / Bộ chọn hiện đại
const element = document.querySelector('.my-class');
const elements = document.querySelectorAll('.my-class');

// Legacy selectors / Bộ chọn cũ
const byId = document.getElementById('my-id');
const byClass = document.getElementsByClassName('my-class');
const byTag = document.getElementsByTagName('div');

// Traversal / Duyệt
const parent = element.parentElement;
const children = element.children;
const firstChild = element.firstElementChild;
const lastChild = element.lastElementChild;
const nextSibling = element.nextElementSibling;
const prevSibling = element.previousElementSibling;

// Closest parent matching selector / Cha gần nhất khớp bộ chọn
const closestForm = element.closest('form');

// Check if element matches selector / Kiểm tra phần tử khớp bộ chọn
const matches = element.matches('.active');
```

### Element Manipulation / Thao Tác Phần Tử

```javascript
// Create elements / Tạo phần tử
const div = document.createElement('div');
const text = document.createTextNode('Hello');
const fragment = document.createDocumentFragment();

// Modify content / Thay đổi nội dung
element.textContent = 'New text'; // Safe, escapes HTML / An toàn, escape HTML
element.innerHTML = '<strong>Bold</strong>'; // Unsafe if user input / Không an toàn nếu đầu vào người dùng

// Attributes / Thuộc tính
element.setAttribute('data-id', '123');
const dataId = element.getAttribute('data-id');
element.removeAttribute('data-id');
const hasAttr = element.hasAttribute('data-id');

// Data attributes / Thuộc tính data
element.dataset.userId = '123'; // Sets data-user-id / Đặt data-user-id
const userId = element.dataset.userId; // Gets data-user-id / Lấy data-user-id

// Classes / Lớp
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('visible');
element.classList.contains('active'); // true/false
element.classList.replace('old', 'new');

// Styles / Kiểu
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.cssText = 'color: red; background: blue;';

// Get computed styles / Lấy kiểu được tính toán
const styles = window.getComputedStyle(element);
const color = styles.getPropertyValue('color');
```

### DOM Insertion / Chèn DOM

```javascript
// Append / Thêm vào cuối
parent.appendChild(child);
parent.append(child1, child2, 'text'); // Can append multiple / Có thể thêm nhiều

// Prepend / Thêm vào đầu
parent.prepend(child);

// Insert before/after / Chèn trước/sau
parent.insertBefore(newChild, referenceChild);
element.before(newElement);
element.after(newElement);

// Replace / Thay thế
parent.replaceChild(newChild, oldChild);
element.replaceWith(newElement);

// Remove / Xóa
parent.removeChild(child);
element.remove();

// Clone / Sao chép
const clone = element.cloneNode(true); // true = deep clone / sao chép sâu
```

---

## Storage APIs / API Lưu Trữ

### localStorage

**English:** Persistent storage that survives browser restarts.

**Tiếng Việt:** Lưu trữ bền vững tồn tại qua việc khởi động lại trình duyệt.

```javascript
// Store data / Lưu trữ dữ liệu
localStorage.setItem('username', 'john');
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'John' }));

// Retrieve data / Lấy dữ liệu
const username = localStorage.getItem('username');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Remove data / Xóa dữ liệu
localStorage.removeItem('username');

// Clear all / Xóa tất cả
localStorage.clear();

// Check existence / Kiểm tra tồn tại
const hasUsername = localStorage.getItem('username') !== null;

// Get all keys / Lấy tất cả khóa
const keys = Object.keys(localStorage);

// Iterate / Lặp
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(key, value);
}

// Type-safe wrapper / Wrapper an toàn kiểu
class TypedStorage {
  static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }
}

// Usage / Sử dụng
TypedStorage.set('user', { id: 1, name: 'John' });
const user = TypedStorage.get('user', { id: 0, name: '' });
```

### sessionStorage

**English:** Temporary storage cleared when tab closes.

**Tiếng Việt:** Lưu trữ tạm thời bị xóa khi đóng tab.

```javascript
// Same API as localStorage / API giống localStorage
sessionStorage.setItem('tempData', 'value');
const tempData = sessionStorage.getItem('tempData');
sessionStorage.removeItem('tempData');
sessionStorage.clear();

// Use case: Form data / Trường hợp sử dụng: Dữ liệu form
function saveFormData(formData) {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
}

function restoreFormData() {
  const draft = sessionStorage.getItem('formDraft');
  return draft ? JSON.parse(draft) : null;
}
```

### IndexedDB

**English:** Large-scale client-side database.

**Tiếng Việt:** Cơ sở dữ liệu phía client quy mô lớn.

```javascript
// Open database / Mở cơ sở dữ liệu
const request = indexedDB.open('MyDatabase', 1);

request.onerror = () => {
  console.error('Database failed to open / Không thể mở cơ sở dữ liệu');
};

request.onsuccess = () => {
  const db = request.result;
  console.log('Database opened / Đã mở cơ sở dữ liệu');
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  
  // Create object store / Tạo object store
  const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
  
  // Create indexes / Tạo index
  objectStore.createIndex('email', 'email', { unique: true });
  objectStore.createIndex('name', 'name', { unique: false });
};

// Add data / Thêm dữ liệu
function addUser(db, user) {
  const transaction = db.transaction(['users'], 'readwrite');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.add(user);
  
  request.onsuccess = () => {
    console.log('User added / Đã thêm người dùng');
  };
}

// Get data / Lấy dữ liệu
function getUser(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users']);
    const objectStore = transaction.objectStore('users');
    const request = objectStore.get(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Query by index / Truy vấn theo index
function getUserByEmail(db, email) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['users']);
    const objectStore = transaction.objectStore('users');
    const index = objectStore.index('email');
    const request = index.get(email);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

---

## Geolocation API / API Định Vị

```javascript
// Check if geolocation is available / Kiểm tra geolocation có sẵn
if ('geolocation' in navigator) {
  // Get current position / Lấy vị trí hiện tại
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Lat: ${latitude}, Lng: ${longitude}`);
      console.log(`Accuracy: ${accuracy} meters / mét`);
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error('User denied geolocation / Người dùng từ chối định vị');
          break;
        case error.POSITION_UNAVAILABLE:
          console.error('Position unavailable / Vị trí không khả dụng');
          break;
        case error.TIMEOUT:
          console.error('Request timeout / Hết thời gian yêu cầu');
          break;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );

  // Watch position / Theo dõi vị trí
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      console.log('Position updated / Vị trí đã cập nhật:', position.coords);
    },
    (error) => {
      console.error('Watch error / Lỗi theo dõi:', error);
    }
  );

  // Stop watching / Dừng theo dõi
  navigator.geolocation.clearWatch(watchId);
}

// Promise wrapper / Wrapper Promise
function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

// Usage / Sử dụng
async function showLocation() {
  try {
    const position = await getCurrentPosition();
    console.log(position.coords);
  } catch (error) {
    console.error(error);
  }
}
```

---

## Intersection Observer / Observer Giao Điểm

**English:** Efficiently detect when elements enter/exit viewport.

**Tiếng Việt:** Phát hiện hiệu quả khi phần tử vào/ra khỏi viewport.

```javascript
// Basic usage / Sử dụng cơ bản
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Element is visible / Phần tử hiển thị');
        entry.target.classList.add('visible');
      } else {
        console.log('Element is hidden / Phần tử ẩn');
        entry.target.classList.remove('visible');
      }
    });
  },
  {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.5 // 50% visible / 50% hiển thị
  }
);

// Observe elements / Quan sát phần tử
const elements = document.querySelectorAll('.lazy-load');
elements.forEach(el => observer.observe(el));

// Stop observing / Dừng quan sát
observer.unobserve(element);
observer.disconnect();

// Lazy loading images / Tải lười hình ảnh
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Infinite scroll / Cuộn vô hạn
const sentinel = document.querySelector('.sentinel');
const scrollObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreItems();
  }
});

scrollObserver.observe(sentinel);
```

---

## Mutation Observer / Observer Thay Đổi

**English:** Watch for DOM changes.

**Tiếng Việt:** Theo dõi thay đổi DOM.

```javascript
// Create observer / Tạo observer
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('Type:', mutation.type);
    
    if (mutation.type === 'childList') {
      console.log('Children changed / Con đã thay đổi');
      console.log('Added:', mutation.addedNodes);
      console.log('Removed:', mutation.removedNodes);
    }
    
    if (mutation.type === 'attributes') {
      console.log('Attribute changed / Thuộc tính đã thay đổi:', mutation.attributeName);
      console.log('Old value / Giá trị cũ:', mutation.oldValue);
    }
    
    if (mutation.type === 'characterData') {
      console.log('Text changed / Văn bản đã thay đổi');
    }
  });
});

// Start observing / Bắt đầu quan sát
const targetNode = document.getElementById('container');
observer.observe(targetNode, {
  childList: true, // Watch for child additions/removals / Theo dõi thêm/xóa con
  attributes: true, // Watch for attribute changes / Theo dõi thay đổi thuộc tính
  attributeOldValue: true, // Record old attribute values / Ghi lại giá trị thuộc tính cũ
  characterData: true, // Watch for text changes / Theo dõi thay đổi văn bản
  subtree: true // Watch all descendants / Theo dõi tất cả con cháu
});

// Stop observing / Dừng quan sát
observer.disconnect();

// Practical example: Auto-save / Ví dụ thực tế: Tự động lưu
const contentObserver = new MutationObserver(() => {
  const content = document.getElementById('editor').textContent;
  localStorage.setItem('draft', content);
  console.log('Content auto-saved / Nội dung đã tự động lưu');
});

contentObserver.observe(document.getElementById('editor'), {
  characterData: true,
  subtree: true
});
```

---

## Web Workers / Worker Web

**English:** Run JavaScript in background threads.

**Tiếng Việt:** Chạy JavaScript trong luồng nền.

```javascript
// Main thread / Luồng chính
// worker.js
const worker = new Worker('worker.js');

// Send message to worker / Gửi tin nhắn đến worker
worker.postMessage({ type: 'START', data: [1, 2, 3, 4, 5] });

// Receive message from worker / Nhận tin nhắn từ worker
worker.onmessage = (event) => {
  console.log('Result from worker / Kết quả từ worker:', event.data);
};

// Handle errors / Xử lý lỗi
worker.onerror = (error) => {
  console.error('Worker error / Lỗi worker:', error.message);
};

// Terminate worker / Kết thúc worker
worker.terminate();

// worker.js file / File worker.js
self.onmessage = (event) => {
  const { type, data } = event.data;
  
  if (type === 'START') {
    // Heavy computation / Tính toán nặng
    const result = data.reduce((sum, n) => sum + n, 0);
    
    // Send result back / Gửi kết quả trở lại
    self.postMessage({ type: 'RESULT', result });
  }
};

// Practical example: Image processing / Ví dụ thực tế: Xử lý hình ảnh
// main.js
const imageWorker = new Worker('image-worker.js');

function processImage(imageData) {
  return new Promise((resolve) => {
    imageWorker.onmessage = (event) => {
      resolve(event.data);
    };
    
    imageWorker.postMessage({ imageData });
  });
}

// image-worker.js
self.onmessage = async (event) => {
  const { imageData } = event.data;
  
  // Apply filter / Áp dụng bộ lọc
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    imageData.data[i] = avg; // Red
    imageData.data[i + 1] = avg; // Green
    imageData.data[i + 2] = avg; // Blue
  }
  
  self.postMessage(imageData);
};
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Question 1: localStorage vs sessionStorage vs cookies?

**English Answer:**
- **localStorage**: Persistent, 5-10MB, same origin only
- **sessionStorage**: Tab-scoped, cleared on close, 5-10MB
- **Cookies**: Sent with requests, 4KB, can set expiry

**Tiếng Việt:**
- **localStorage**: Bền vững, 5-10MB, chỉ cùng origin
- **sessionStorage**: Phạm vi tab, xóa khi đóng, 5-10MB
- **Cookies**: Gửi với yêu cầu, 4KB, có thể đặt hết hạn

### Question 2: When to use Intersection Observer?

**English Answer:**
Use for:
- Lazy loading images/content
- Infinite scroll
- Animation triggers
- Analytics (tracking visibility)

**Tiếng Việt:**
Sử dụng cho:
- Tải lười hình ảnh/nội dung
- Cuộn vô hạn
- Kích hoạt animation
- Phân tích (theo dõi khả năng hiển thị)

### Question 3: Benefits of Web Workers?

**English Answer:**
- Run heavy computations without blocking UI
- Parallel processing
- Better performance for CPU-intensive tasks
- Limitations: No DOM access, separate scope

**Tiếng Việt:**
- Chạy tính toán nặng mà không chặn UI
- Xử lý song song
- Hiệu suất tốt hơn cho tác vụ tốn CPU
- Hạn chế: Không truy cập DOM, phạm vi riêng

---

## Key Takeaways / Điểm Chính

**English:**
1. DOM API provides powerful element manipulation
2. Storage APIs offer different persistence levels
3. Intersection Observer enables efficient scroll detection
4. Mutation Observer watches DOM changes
5. Web Workers enable parallel processing
6. Choose the right API for your use case

**Tiếng Việt:**
1. API DOM cung cấp thao tác phần tử mạnh mẽ
2. API lưu trữ cung cấp các cấp độ bền vững khác nhau
3. Intersection Observer cho phép phát hiện cuộn hiệu quả
4. Mutation Observer theo dõi thay đổi DOM
5. Web Workers cho phép xử lý song song
6. Chọn API phù hợp cho trường hợp sử dụng của bạn

---

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Fetch & HTTP →](./02-fetch-http.md)
