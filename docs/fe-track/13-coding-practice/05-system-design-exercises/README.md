# System Design Coding Exercises

> Bài tập coding cho các tình huống system design phổ biến. Focus vào implementation thực tế.

---

## 📋 Exercise List

| # | Problem | Difficulty | Time | Focus |
|---|---------|------------|------|-------|
| 1 | [News Feed](./news-feed.md) | 🔴 Hard | 60 min | Infinite Scroll, Virtualization |
| 2 | [Chat Application](./chat-app.md) | 🔴 Hard | 60 min | WebSocket, Real-time |
| 3 | [File Uploader](./file-uploader.md) | 🟡 Medium | 45 min | Chunking, Progress |
| 4 | [Image Gallery](./image-gallery.md) | 🟡 Medium | 40 min | Lazy Loading, Lightbox |
| 5 | [Todo App](./todo-app.md) | 🟢 Easy | 30 min | CRUD, State Management |

---

## 🎯 News Feed Implementation

```javascript
// Virtualized infinite scroll news feed
class NewsFeed {
  constructor(container, options = {}) {
    this.container = container;
    this.itemHeight = options.itemHeight || 100;
    this.buffer = options.buffer || 5;
    this.posts = [];
    this.page = 1;
    this.loading = false;
    this.hasMore = true;

    this.viewport = document.createElement('div');
    this.viewport.className = 'feed-viewport';
    this.viewport.style.cssText = 'overflow-y: auto; height: 100%;';

    this.content = document.createElement('div');
    this.content.className = 'feed-content';
    this.content.style.position = 'relative';

    this.viewport.appendChild(this.content);
    this.container.appendChild(this.viewport);

    this.viewport.addEventListener('scroll', this.handleScroll.bind(this));
    this.loadMore();
  }

  handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = this.viewport;

    // Check if need to load more
    if (scrollHeight - scrollTop - clientHeight < 200 && !this.loading && this.hasMore) {
      this.loadMore();
    }

    this.renderVisibleItems();
  }

  async loadMore() {
    if (this.loading) return;
    this.loading = true;

    try {
      const newPosts = await this.fetchPosts(this.page);
      this.posts.push(...newPosts);
      this.page++;
      this.hasMore = newPosts.length > 0;
      this.updateContentHeight();
      this.renderVisibleItems();
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      this.loading = false;
    }
  }

  async fetchPosts(page) {
    // Simulated API call
    return new Promise(resolve => {
      setTimeout(() => {
        const posts = [];
        for (let i = 0; i < 20; i++) {
          posts.push({
            id: `post-${page}-${i}`,
            content: `Post ${page * 20 + i}`,
            timestamp: Date.now() - Math.random() * 86400000,
          });
        }
        resolve(posts);
      }, 500);
    });
  }

  updateContentHeight() {
    this.content.style.height = `${this.posts.length * this.itemHeight}px`;
  }

  renderVisibleItems() {
    const scrollTop = this.viewport.scrollTop;
    const viewportHeight = this.viewport.clientHeight;

    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    const endIndex = Math.min(
      this.posts.length,
      Math.ceil((scrollTop + viewportHeight) / this.itemHeight) + this.buffer
    );

    // Clear existing items
    this.content.innerHTML = '';

    // Render visible items
    for (let i = startIndex; i < endIndex; i++) {
      const post = this.posts[i];
      const item = this.renderPost(post, i);
      this.content.appendChild(item);
    }
  }

  renderPost(post, index) {
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.style.cssText = `
      position: absolute;
      top: ${index * this.itemHeight}px;
      left: 0;
      right: 0;
      height: ${this.itemHeight}px;
      padding: 16px;
      border-bottom: 1px solid #eee;
    `;
    item.innerHTML = `
      <div class="post-content">${post.content}</div>
      <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
    `;
    return item;
  }
}

// Usage
const feed = new NewsFeed(document.getElementById('app'), {
  itemHeight: 120,
  buffer: 3,
});
```

---

## 💬 Chat Application Implementation

```javascript
class ChatApp {
  constructor(container) {
    this.container = container;
    this.ws = null;
    this.messages = [];
    this.userId = `user-${Math.random().toString(36).substr(2, 9)}`;

    this.render();
    this.connect();
  }

  connect() {
    this.ws = new WebSocket('wss://chat-server.example.com');

    this.ws.onopen = () => {
      this.showStatus('Connected');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.receiveMessage(message);
    };

    this.ws.onclose = () => {
      this.showStatus('Disconnected');
      // Reconnect after 3 seconds
      setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(content) {
    const message = {
      id: `msg-${Date.now()}`,
      userId: this.userId,
      content,
      timestamp: Date.now(),
      status: 'sending',
    };

    // Optimistic update
    this.messages.push(message);
    this.renderMessages();

    // Send to server
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'message',
        payload: message,
      }));

      // Update status after send
      message.status = 'sent';
      this.renderMessages();
    }
  }

  receiveMessage(data) {
    if (data.type === 'message') {
      // Check if it's our own message (confirmation)
      const existingIndex = this.messages.findIndex(m => m.id === data.payload.id);

      if (existingIndex >= 0) {
        this.messages[existingIndex].status = 'delivered';
      } else {
        this.messages.push({ ...data.payload, status: 'received' });
      }

      this.renderMessages();
      this.scrollToBottom();
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="chat-container">
        <div class="chat-status"></div>
        <div class="chat-messages"></div>
        <form class="chat-input">
          <input type="text" placeholder="Type a message..." />
          <button type="submit">Send</button>
        </form>
      </div>
    `;

    this.statusEl = this.container.querySelector('.chat-status');
    this.messagesEl = this.container.querySelector('.chat-messages');
    this.form = this.container.querySelector('.chat-input');
    this.input = this.form.querySelector('input');

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const content = this.input.value.trim();
      if (content) {
        this.sendMessage(content);
        this.input.value = '';
      }
    });
  }

  renderMessages() {
    this.messagesEl.innerHTML = this.messages
      .map(msg => `
        <div class="message ${msg.userId === this.userId ? 'own' : 'other'}">
          <div class="message-content">${this.escapeHtml(msg.content)}</div>
          <div class="message-meta">
            <span class="time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            ${msg.userId === this.userId ? `<span class="status">${msg.status}</span>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  showStatus(text) {
    this.statusEl.textContent = text;
  }

  scrollToBottom() {
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
```

---

## 📤 File Uploader Implementation

```javascript
class FileUploader {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 1024 * 1024; // 1MB
    this.maxConcurrent = options.maxConcurrent || 3;
    this.uploadUrl = options.uploadUrl || '/api/upload';
    this.uploads = new Map();
  }

  async upload(file) {
    const uploadId = `upload-${Date.now()}`;
    const totalChunks = Math.ceil(file.size / this.chunkSize);

    const upload = {
      id: uploadId,
      file,
      totalChunks,
      uploadedChunks: 0,
      progress: 0,
      status: 'pending',
      abortController: new AbortController(),
    };

    this.uploads.set(uploadId, upload);
    this.onUploadStart?.(upload);

    try {
      // Initialize upload on server
      const { sessionId } = await this.initUpload(file, uploadId);
      upload.sessionId = sessionId;
      upload.status = 'uploading';

      // Upload chunks with concurrency control
      await this.uploadChunks(upload);

      // Complete upload
      await this.completeUpload(upload);

      upload.status = 'completed';
      upload.progress = 100;
      this.onUploadComplete?.(upload);
    } catch (error) {
      if (error.name === 'AbortError') {
        upload.status = 'cancelled';
        this.onUploadCancelled?.(upload);
      } else {
        upload.status = 'failed';
        upload.error = error;
        this.onUploadError?.(upload, error);
      }
    }

    return upload;
  }

  async initUpload(file, uploadId) {
    const response = await fetch(`${this.uploadUrl}/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploadId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        totalChunks: Math.ceil(file.size / this.chunkSize),
      }),
    });

    return response.json();
  }

  async uploadChunks(upload) {
    const { file, totalChunks, abortController } = upload;
    const chunks = [];

    for (let i = 0; i < totalChunks; i++) {
      chunks.push(i);
    }

    // Process chunks with concurrency limit
    const results = [];
    const executing = new Set();

    for (const chunkIndex of chunks) {
      if (abortController.signal.aborted) break;

      const promise = this.uploadChunk(upload, chunkIndex).then(result => {
        executing.delete(promise);
        upload.uploadedChunks++;
        upload.progress = Math.round((upload.uploadedChunks / totalChunks) * 100);
        this.onUploadProgress?.(upload);
        return result;
      });

      results.push(promise);
      executing.add(promise);

      if (executing.size >= this.maxConcurrent) {
        await Promise.race(executing);
      }
    }

    return Promise.all(results);
  }

  async uploadChunk(upload, chunkIndex) {
    const { file, sessionId, abortController } = upload;
    const start = chunkIndex * this.chunkSize;
    const end = Math.min(start + this.chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex);
    formData.append('sessionId', sessionId);

    const response = await fetch(`${this.uploadUrl}/chunk`, {
      method: 'POST',
      body: formData,
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`Chunk ${chunkIndex} upload failed`);
    }

    return response.json();
  }

  async completeUpload(upload) {
    const response = await fetch(`${this.uploadUrl}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: upload.sessionId }),
    });

    return response.json();
  }

  cancel(uploadId) {
    const upload = this.uploads.get(uploadId);
    if (upload && upload.status === 'uploading') {
      upload.abortController.abort();
    }
  }

  pause(uploadId) {
    // Store current state for resume
    const upload = this.uploads.get(uploadId);
    if (upload) {
      upload.status = 'paused';
      upload.abortController.abort();
    }
  }

  async resume(uploadId) {
    const upload = this.uploads.get(uploadId);
    if (upload && upload.status === 'paused') {
      upload.abortController = new AbortController();
      upload.status = 'uploading';
      // Resume from where we left off
      await this.uploadChunks(upload);
      await this.completeUpload(upload);
    }
  }
}

// Usage
const uploader = new FileUploader({
  uploadUrl: '/api/upload',
  chunkSize: 2 * 1024 * 1024, // 2MB chunks
  maxConcurrent: 3,
});

uploader.onUploadProgress = (upload) => {
  console.log(`Progress: ${upload.progress}%`);
};

uploader.onUploadComplete = (upload) => {
  console.log('Upload complete:', upload.file.name);
};

// Start upload
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  uploader.upload(file);
});
```

---

## 📊 Architecture Patterns

```
┌─────────────────────────────────────────────────────────────────┐
│                 COMMON PATTERNS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   OPTIMISTIC UPDATES:                                           │
│   1. Update UI immediately                                      │
│   2. Send request to server                                     │
│   3. Rollback on failure                                        │
│                                                                   │
│   VIRTUALIZATION:                                               │
│   1. Calculate visible range                                    │
│   2. Render only visible items                                  │
│   3. Position with absolute/transform                           │
│                                                                   │
│   CHUNKED OPERATIONS:                                           │
│   1. Split large data into chunks                               │
│   2. Process with concurrency limit                             │
│   3. Track progress per chunk                                   │
│                                                                   │
│   REAL-TIME SYNC:                                               │
│   1. WebSocket for live updates                                 │
│   2. Reconnection logic                                         │
│   3. Message queue for offline                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

> **Quay lại:** [Coding Practice](../README.md)
