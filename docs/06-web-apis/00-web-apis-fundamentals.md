# Web APIs Fundamentals
## Web APIs - Chapter 0

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Browser APIs →](./01-browser-apis.md)

---

## Overview

Web APIs provide interfaces for interacting with the browser and web platform. This chapter covers essential Web APIs that every frontend developer must master for Big Tech interviews.

---

## Table of Contents

1. [DOM API](#dom-api)
2. [Fetch API](#fetch-api)
3. [Storage APIs](#storage-apis)
4. [Web Workers](#web-workers)
5. [Intersection Observer](#intersection-observer)
6. [Mutation Observer](#mutation-observer)
7. [Geolocation API](#geolocation-api)
8. [File API](#file-api)
9. [Canvas API](#canvas-api)
10. [Interview Questions](#interview-questions)

---

## DOM API

### Selecting Elements

```javascript
// Get element by ID
const header = document.getElementById('header');

// Get elements by class name (returns HTMLCollection)
const buttons = document.getElementsByClassName('button');

// Get elements by tag name
const paragraphs = document.getElementsByTagName('p');

// Query selector (returns first match)
const firstButton = document.querySelector('.button');
const header = document.querySelector('#header');
const input = document.querySelector('input[type="text"]');

// Query selector all (returns NodeList)
const allButtons = document.querySelectorAll('.button');
const allInputs = document.querySelectorAll('input');

// Convert to array
const buttonsArray = Array.from(buttons);
const buttonsArray2 = [...allButtons];
```

### Creating and Modifying Elements

```javascript
// Create element
const div = document.createElement('div');
const span = document.createElement('span');
const text = document.createTextNode('Hello');

// Set attributes
div.id = 'container';
div.className = 'wrapper';
div.setAttribute('data-id', '123');
div.setAttribute('aria-label', 'Container');

// Set content
div.textContent = 'Plain text';
div.innerHTML = '<strong>HTML content</strong>';

// Append children
div.appendChild(span);
div.append(text); // Can append multiple nodes
div.prepend(text); // Add at beginning

// Insert adjacent
div.insertAdjacentHTML('beforebegin', '<p>Before</p>');
div.insertAdjacentHTML('afterbegin', '<p>Start</p>');
div.insertAdjacentHTML('beforeend', '<p>End</p>');
div.insertAdjacentHTML('afterend', '<p>After</p>');

// Remove element
div.remove();
parent.removeChild(child);

// Replace element
parent.replaceChild(newChild, oldChild);
newChild.replaceWith(oldChild);

// Clone element
const clone = div.cloneNode(true); // true = deep clone
```

### Traversing DOM

```javascript
const element = document.querySelector('.item');

// Parent
element.parentElement;
element.parentNode;
element.closest('.container'); // Nearest ancestor matching selector

// Children
element.children; // HTMLCollection of child elements
element.childNodes; // NodeList including text nodes
element.firstElementChild;
element.lastElementChild;
element.childElementCount;

// Siblings
element.nextElementSibling;
element.previousElementSibling;

// Check if contains
parent.contains(child); // true/false
```

### Modifying Styles

```javascript
const element = document.querySelector('.box');

// Inline styles
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.fontSize = '16px';

// Multiple styles
Object.assign(element.style, {
  color: 'red',
  backgroundColor: 'blue',
  fontSize: '16px'
});

// CSS text
element.style.cssText = 'color: red; background: blue; font-size: 16px;';

// Get computed style
const styles = window.getComputedStyle(element);
const color = styles.color;
const fontSize = styles.fontSize;

// Classes
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('visible');
element.classList.contains('active'); // true/false
element.classList.replace('old', 'new');
```

### Event Handling

```javascript
const button = document.querySelector('button');

// Add event listener
button.addEventListener('click', (event) => {
  console.log('Clicked!', event);
});

// Event object properties
button.addEventListener('click', (event) => {
  event.target; // Element that triggered event
  event.currentTarget; // Element with listener
  event.type; // 'click'
  event.preventDefault(); // Prevent default action
  event.stopPropagation(); // Stop bubbling
  event.stopImmediatePropagation(); // Stop other listeners
});

// Remove event listener
const handler = (e) => console.log('Clicked');
button.addEventListener('click', handler);
button.removeEventListener('click', handler);

// Event delegation
document.addEventListener('click', (event) => {
  if (event.target.matches('.button')) {
    console.log('Button clicked');
  }
});

// Once option
button.addEventListener('click', handler, { once: true });

// Passive option (for scroll performance)
window.addEventListener('scroll', handler, { passive: true });

// Capture phase
element.addEventListener('click', handler, { capture: true });
```

---

## Fetch API

### Basic Fetch

```javascript
// GET request
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### POST Request

```javascript
// POST with JSON
async function createUser(userData) {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
}

// POST with FormData
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', 'My File');
  
  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    body: formData
    // Don't set Content-Type header, browser sets it automatically
  });
  
  return response.json();
}
```

### Request Options

```javascript
const options = {
  method: 'POST', // GET, POST, PUT, DELETE, PATCH
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token',
    'X-Custom-Header': 'value'
  },
  body: JSON.stringify(data),
  mode: 'cors', // cors, no-cors, same-origin
  credentials: 'include', // include, same-origin, omit
  cache: 'no-cache', // default, no-cache, reload, force-cache
  redirect: 'follow', // follow, error, manual
  referrerPolicy: 'no-referrer', // no-referrer, origin, etc.
  signal: abortController.signal // For cancellation
};

const response = await fetch(url, options);
```

### Response Methods

```javascript
const response = await fetch(url);

// Parse response
const json = await response.json();
const text = await response.text();
const blob = await response.blob();
const arrayBuffer = await response.arrayBuffer();
const formData = await response.formData();

// Response properties
response.ok; // true if status 200-299
response.status; // 200, 404, 500, etc.
response.statusText; // 'OK', 'Not Found', etc.
response.headers; // Headers object
response.url; // Final URL after redirects
response.redirected; // true if redirected

// Check content type
const contentType = response.headers.get('content-type');
if (contentType && contentType.includes('application/json')) {
  const data = await response.json();
}
```

### Abort Controller

```javascript
// Cancel fetch request
const controller = new AbortController();
const signal = controller.signal;

// Start fetch
fetch(url, { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Error:', error);
    }
  });

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

// Cancel on user action
button.addEventListener('click', () => controller.abort());
```

### Error Handling

```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Usage
try {
  const data = await fetchWithRetry('https://api.example.com/data');
  console.log(data);
} catch (error) {
  console.error('Failed after retries:', error);
}
```

---

## Storage APIs

### localStorage

```javascript
// Set item
localStorage.setItem('username', 'john');
localStorage.setItem('user', JSON.stringify({ name: 'John', age: 30 }));

// Get item
const username = localStorage.getItem('username');
const user = JSON.parse(localStorage.getItem('user'));

// Remove item
localStorage.removeItem('username');

// Clear all
localStorage.clear();

// Get number of items
const count = localStorage.length;

// Get key by index
const key = localStorage.key(0);

// Check if key exists
if (localStorage.getItem('username') !== null) {
  console.log('Username exists');
}

// Storage event (fires in other tabs)
window.addEventListener('storage', (event) => {
  console.log('Storage changed:', event.key, event.newValue);
});
```

### sessionStorage

```javascript
// Same API as localStorage, but data cleared when tab closes
sessionStorage.setItem('tempData', 'value');
const data = sessionStorage.getItem('tempData');
sessionStorage.removeItem('tempData');
sessionStorage.clear();
```

### IndexedDB

```javascript
// Open database
const request = indexedDB.open('MyDatabase', 1);

request.onerror = () => {
  console.error('Database error');
};

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('Database opened');
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  
  // Create object store
  const objectStore = db.createObjectStore('users', { keyPath: 'id' });
  
  // Create indexes
  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: true });
};

// Add data
function addUser(db, user) {
  const transaction = db.transaction(['users'], 'readwrite');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.add(user);
  
  request.onsuccess = () => {
    console.log('User added');
  };
  
  request.onerror = () => {
    console.error('Error adding user');
  };
}

// Get data
function getUser(db, id) {
  const transaction = db.transaction(['users'], 'readonly');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.get(id);
  
  request.onsuccess = (event) => {
    const user = event.target.result;
    console.log('User:', user);
  };
}

// Query by index
function getUserByEmail(db, email) {
  const transaction = db.transaction(['users'], 'readonly');
  const objectStore = transaction.objectStore('users');
  const index = objectStore.index('email');
  const request = index.get(email);
  
  request.onsuccess = (event) => {
    const user = event.target.result;
    console.log('User:', user);
  };
}
```

---

## Web Workers

### Creating Worker

```javascript
// main.js
const worker = new Worker('worker.js');

// Send message to worker
worker.postMessage({ type: 'start', data: [1, 2, 3, 4, 5] });

// Receive message from worker
worker.onmessage = (event) => {
  console.log('Result from worker:', event.data);
};

// Handle errors
worker.onerror = (error) => {
  console.error('Worker error:', error);
};

// Terminate worker
worker.terminate();
```

### Worker Script

```javascript
// worker.js
self.onmessage = (event) => {
  const { type, data } = event.data;
  
  if (type === 'start') {
    // Perform heavy computation
    const result = data.reduce((sum, num) => sum + num, 0);
    
    // Send result back
    self.postMessage({ type: 'result', value: result });
  }
};

// Import scripts in worker
importScripts('utils.js', 'helpers.js');
```

### Practical Example

```javascript
// Heavy computation without blocking UI
function calculatePrimes(max) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('prime-worker.js');
    
    worker.postMessage({ max });
    
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
    
    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };
  });
}

// Usage
button.addEventListener('click', async () => {
  button.disabled = true;
  
  try {
    const primes = await calculatePrimes(1000000);
    console.log('Primes:', primes);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    button.disabled = false;
  }
});
```

---

## Intersection Observer

### Basic Usage

```javascript
// Create observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible:', entry.target);
      
      // Load image
      const img = entry.target;
      img.src = img.dataset.src;
      
      // Stop observing
      observer.unobserve(img);
    }
  });
}, {
  root: null, // viewport
  rootMargin: '0px',
  threshold: 0.5 // 50% visible
});

// Observe elements
const images = document.querySelectorAll('img[data-src]');
images.forEach(img => observer.observe(img));
```

### Lazy Loading Images

```javascript
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px' // Load 50px before visible
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Usage
document.addEventListener('DOMContentLoaded', lazyLoadImages);
```

### Infinite Scroll

```javascript
function setupInfiniteScroll() {
  const sentinel = document.querySelector('.sentinel');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMoreContent();
      }
    });
  }, {
    rootMargin: '100px'
  });
  
  observer.observe(sentinel);
}

async function loadMoreContent() {
  const content = await fetchMoreContent();
  appendContent(content);
}
```

### Visibility Tracking

```javascript
function trackVisibility() {
  const elements = document.querySelectorAll('.track-visibility');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Track impression
        analytics.track('element_viewed', {
          element: entry.target.id,
          visibility: entry.intersectionRatio
        });
      }
    });
  }, {
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });
  
  elements.forEach(el => observer.observe(el));
}
```

---

## Mutation Observer

### Basic Usage

```javascript
// Create observer
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('Mutation type:', mutation.type);
    console.log('Target:', mutation.target);
    
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

// Observe element
const target = document.querySelector('#container');
observer.observe(target, {
  childList: true, // Watch for child additions/removals
  attributes: true, // Watch for attribute changes
  characterData: true, // Watch for text changes
  subtree: true, // Watch descendants
  attributeOldValue: true, // Record old attribute values
  characterDataOldValue: true // Record old text values
});

// Stop observing
observer.disconnect();
```

### Practical Examples

```javascript
// Watch for DOM changes
function watchDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            console.log('Element added:', node);
            initializeNewElement(node);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Watch for class changes
function watchClassChanges(element, callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        callback(element.className);
      }
    });
  });
  
  observer.observe(element, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  return observer;
}

// Usage
const element = document.querySelector('.watched');
const observer = watchClassChanges(element, (className) => {
  console.log('Class changed to:', className);
});
```

---

## Geolocation API

### Get Current Position

```javascript
// Get current position
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    console.log(`Lat: ${latitude}, Lng: ${longitude}`);
    console.log(`Accuracy: ${accuracy} meters`);
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
```

### Watch Position

```javascript
// Watch position changes
const watchId = navigator.geolocation.watchPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    updateMap(latitude, longitude);
  },
  (error) => {
    console.error('Error:', error.message);
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
);

// Stop watching
navigator.geolocation.clearWatch(watchId);
```

---

## File API

### Reading Files

```javascript
// File input
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  if (file) {
    console.log('File name:', file.name);
    console.log('File size:', file.size);
    console.log('File type:', file.type);
    console.log('Last modified:', new Date(file.lastModified));
    
    readFile(file);
  }
});

// Read as text
function readAsText(file) {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const text = event.target.result;
    console.log('File content:', text);
  };
  
  reader.onerror = () => {
    console.error('Error reading file');
  };
  
  reader.readAsText(file);
}

// Read as data URL (for images)
function readAsDataURL(file) {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const dataURL = event.target.result;
    const img = document.createElement('img');
    img.src = dataURL;
    document.body.appendChild(img);
  };
  
  reader.readAsDataURL(file);
}

// Read as array buffer
function readAsArrayBuffer(file) {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const arrayBuffer = event.target.result;
    console.log('Array buffer:', arrayBuffer);
  };
  
  reader.readAsArrayBuffer(file);
}
```

### Drag and Drop

```javascript
const dropZone = document.querySelector('.drop-zone');

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('drag-over');
  
  const files = event.dataTransfer.files;
  handleFiles(files);
});

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      displayImage(file);
    }
  });
}
```

---

## Canvas API

### Basic Drawing

```javascript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Draw rectangle
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 50);

// Draw circle
ctx.beginPath();
ctx.arc(200, 100, 50, 0, Math.PI * 2);
ctx.fillStyle = 'red';
ctx.fill();

// Draw line
ctx.beginPath();
ctx.moveTo(300, 50);
ctx.lineTo(400, 150);
ctx.strokeStyle = 'green';
ctx.lineWidth = 3;
ctx.stroke();

// Draw text
ctx.font = '30px Arial';
ctx.fillStyle = 'black';
ctx.fillText('Hello Canvas', 50, 200);
```

### Image Manipulation

```javascript
const img = new Image();
img.onload = () => {
  // Draw image
  ctx.drawImage(img, 0, 0);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Manipulate pixels (grayscale)
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
    // data[i + 3] is alpha
  }
  
  // Put modified image back
  ctx.putImageData(imageData, 0, 0);
};
img.src = 'image.jpg';
```

---

## Interview Questions

### Q1: What's the difference between localStorage and sessionStorage?

**Answer:**
- **localStorage**: Persists until explicitly cleared, shared across tabs
- **sessionStorage**: Cleared when tab closes, separate per tab

Both have same API and 5-10MB storage limit.

### Q2: How do you cancel a fetch request?

**Answer:**
Use AbortController:

```javascript
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort(); // Cancel request
```

### Q3: What is event delegation and why use it?

**Answer:**
Event delegation attaches a single event listener to a parent instead of multiple listeners to children. Benefits:
- Better performance
- Works with dynamically added elements
- Less memory usage

```javascript
document.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    // Handle button click
  }
});
```

### Q4: How does Intersection Observer improve performance?

**Answer:**
Intersection Observer:
- Runs asynchronously (doesn't block main thread)
- More efficient than scroll listeners
- Built-in throttling
- Better for lazy loading and infinite scroll

### Q5: What are Web Workers and when to use them?

**Answer:**
Web Workers run JavaScript in background threads. Use for:
- Heavy computations
- Data processing
- Image manipulation
- Preventing UI blocking

Cannot access DOM directly.

---

## Key Takeaways

1. **DOM API**: Essential for element manipulation
2. **Fetch API**: Modern way to make HTTP requests
3. **Storage APIs**: localStorage, sessionStorage, IndexedDB
4. **Web Workers**: Background processing
5. **Intersection Observer**: Efficient visibility detection
6. **Mutation Observer**: Watch DOM changes
7. **Geolocation**: Access user location
8. **File API**: Handle file uploads
9. **Canvas API**: Graphics and image manipulation
10. **Event Delegation**: Efficient event handling

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Browser APIs →](./01-browser-apis.md)
