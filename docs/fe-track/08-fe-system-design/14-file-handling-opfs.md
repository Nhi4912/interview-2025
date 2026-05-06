# File Handling & OPFS — Xử Lý File Quy Mô Lớn Trong Trình Duyệt

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [FE System Design Overview](./00-fe-system-design-overview.md), JavaScript Streams, Service Workers
> **See also**: [IndexedDB & Client Storage](./07-client-storage-indexeddb.md) | [Web Workers & Performance](../06-browser-performance/06-web-workers.md) | [Web Security](../07-web-security/01-xss-csrf-csp.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Design the file upload system for a Figma-like app where users drag-drop a 200MB `.fig` file, we parse it client-side, and they can continue editing after an internet outage."_

Hầu hết ứng viên Junior sẽ trả lời: _"Use `<input type=file>`, read với `FileReader`, POST lên server."_ Đây là câu trả lời bỏ qua gần như mọi vấn đề thực tế.

**Figma** đọc file `.fig` trực tiếp trong browser bằng OPFS + WebAssembly — không cần server round-trip. **Loom** upload video 5GB qua chunked/resumable upload với Service Worker giữ kết nối kể cả khi user đóng tab. **Notion** lưu file attachments vào IndexedDB trước khi upload để tránh mất dữ liệu khi offline. **Photopea** (browser Photoshop) đọc file `.psd` 100MB+ vào bộ nhớ WASM mà không crash tab. **Tiki** và **Shopee** xử lý hàng triệu ảnh sản phẩm — resize client-side trước khi upload, tiết kiệm 60–80% bandwidth. **Zalo** encode voice message thành `.ogg/opus` trong browser trước khi gửi. **Google Drive** trên web upload file 15GB với resume-after-disconnect, cross-tab progress tracking, và background sync qua Service Worker.

Biết **file handling at scale** là senior signal: nó đòi hỏi hiểu rõ browser storage model, Streams API, OPFS, chunked upload protocols, MIME security, và Service Worker lifecycle — tất cả cùng một lúc.

---

## ASCII Pipeline / Sơ Đồ Pipeline Xử Lý File

```
FILE SOURCE
    │
    ├── <input type="file">          ← User chọn file từ file dialog
    ├── Drag & Drop (dataTransfer)   ← Kéo thả vào vùng drop zone
    ├── Clipboard paste (File[])     ← Paste ảnh / file từ clipboard
    ├── Web Share Target API         ← Share từ app khác (mobile)
    └── File System Access API       ← showOpenFilePicker() → FileHandle
            │
            ▼
    CLIENT-SIDE PROCESSING
    │
    ├── FileReader (legacy, async callbacks)
    ├── Blob.arrayBuffer() / Blob.text() / Blob.stream()  ← modern
    ├── Streams API (ReadableStream, TransformStream)      ← large files
    ├── OffscreenCanvas / Canvas 2D                        ← image resize
    ├── Web Worker / SharedArrayBuffer                     ← CPU tasks off-thread
    └── WASM (Photopea, FFmpeg.wasm, SQLite)               ← heavy processing
            │
            ▼
    CLIENT STORAGE (temporary or persistent)
    │
    ├── IndexedDB       ← Blob/ArrayBuffer storage, queryable, async
    ├── OPFS            ← Origin Private File System, sync in Worker
    ├── Cache API       ← Service Worker cache (response objects)
    └── File System Access (user-visible files, needs re-permission)
            │
            ▼
    UPLOAD TO SERVER
    │
    ├── Simple POST (files < 5MB, one-shot)
    ├── XHR with upload progress (xhr.upload.onprogress)
    ├── fetch + ReadableStream (workaround for upload progress)
    ├── Chunked Upload — tus protocol (resumable.js)
    ├── S3 Multipart Upload (pre-signed URLs from backend)
    └── Service Worker keep-alive (upload survives tab close)
            │
            ▼
    SERVER / CDN
    │
    ├── MIME sniffing (magic bytes, never trust Content-Type)
    ├── Virus scan / content policy validation
    ├── CDN distribution (CloudFront, Cloudflare)
    └── Origin storage (S3, GCS, Azure Blob)
```

---

## Comparison Matrix / Bảng So Sánh API

| API                               | Max Size                       | Sync/Async                   | Persistence                       | Browser Support                             | Security Model        |
| --------------------------------- | ------------------------------ | ---------------------------- | --------------------------------- | ------------------------------------------- | --------------------- |
| **File API** (`<input>`)          | OS limit (~GB)                 | Async                        | Session only (no persist)         | All browsers ✅                             | User gesture required |
| **FileReader**                    | RAM-limited (~500MB practical) | Async (callback)             | None                              | All browsers ✅                             | Same-origin read      |
| **Blob.stream() / arrayBuffer()** | RAM-limited                    | Async (Promise)              | None                              | Chrome 76+, FF 69+, Safari 14+ ✅           | Same-origin read      |
| **Streams API**                   | Unlimited (streaming)          | Async (Promise)              | None                              | Chrome 71+, FF 65+, Safari 14.1+ ✅         | Same-origin           |
| **File System Access API**        | OS disk limit                  | Async (Promise)              | Persistent (user-granted)         | Chrome 86+, Edge 86+ ⚠️ No FF/Safari stable | Permission per origin |
| **OPFS**                          | Origin quota (~% of disk)      | Sync (Worker) / Async (main) | Persistent (clearable by browser) | Chrome 102+, FF 111+, Safari 15.2+ ✅       | Origin-isolated       |
| **IndexedDB Blob**                | Origin quota (~GB)             | Async (IDB)                  | Persistent (clearable)            | All browsers ✅                             | Same-origin           |

> 💡 **Key insight**: OPFS là **duy nhất** cung cấp synchronous file I/O trong Worker — đây là lý do SQLite WASM và video editors chạy được trong browser với hiệu năng gần native.

---

## Part 1: File Input — Getting Files Into the Browser / Lấy File Vào Browser

### Section 1.1: `<input type="file">` vs Drag-and-Drop

**Hai cách phổ biến nhất để user chọn file:**

```typescript
// ── Cách 1: <input type="file"> ──────────────────────────────────────────
// Đơn giản nhất, hỗ trợ tất cả browsers
const input = document.createElement("input");
input.type = "file";
input.multiple = true;
input.accept = "image/*,.pdf,.fig";

input.addEventListener("change", (e) => {
  const files = (e.target as HTMLInputElement).files; // FileList (not Array!)
  if (!files) return;
  const fileArray = Array.from(files); // convert để dùng map/filter
  processFiles(fileArray);
});

input.click(); // must be triggered by user gesture
```

```typescript
// ── Cách 2: Drag and Drop ────────────────────────────────────────────────
// Linh hoạt hơn, nhưng cần handle nhiều event

const dropZone = document.getElementById("drop-zone")!;

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault(); // REQUIRED — không có dòng này, drop sẽ không work
  e.dataTransfer!.dropEffect = "copy";
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");

  const dt = e.dataTransfer!;

  // Cách cũ: dt.files — chỉ lấy được File objects, không có directory
  const legacyFiles = Array.from(dt.files);

  // Cách mới: dt.items — có thể lấy directory entries, WebKitEntry
  const items = Array.from(dt.items);
  const fileItems = items
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile()!)
    .filter(Boolean);

  // Lấy directory entries (Chrome/Edge only via webkit prefix)
  const entries = items
    .filter((item) => item.kind === "file")
    .map((item) => item.webkitGetAsEntry())
    .filter(Boolean) as FileSystemEntry[];

  processFiles(fileItems);
});
```

**Điểm khác biệt quan trọng giữa hai cách:**

| Aspect           | `<input type="file">`                 | Drag & Drop                                |
| ---------------- | ------------------------------------- | ------------------------------------------ |
| User gesture     | Required (click)                      | Natural (drag)                             |
| Directory upload | `webkitdirectory` attr                | `dataTransfer.items[n].webkitGetAsEntry()` |
| File type filter | `accept` attribute (client hint only) | Phải filter thủ công                       |
| Mobile support   | ✅ Full (camera roll too)             | ⚠️ Limited on iOS                          |
| Paste support    | ❌                                    | ❌ (dùng clipboard API riêng)              |

---

### Section 1.2: Clipboard Paste với Files

**Zalo web** cho phép paste ảnh trực tiếp vào chat box — đây là clipboard API:

```typescript
// Lắng nghe paste event toàn trang
document.addEventListener("paste", (e: ClipboardEvent) => {
  const items = Array.from(e.clipboardData?.items ?? []);

  const imageItems = items.filter((item) => item.type.startsWith("image/"));

  if (imageItems.length === 0) return; // no image in clipboard

  e.preventDefault(); // ngăn paste text vào input

  const files = imageItems.map((item) => item.getAsFile()).filter((f): f is File => f !== null);

  // files[0] là File object bình thường
  uploadToChat(files[0]);
});

// Clipboard API (async, cần permission)
async function readFilesFromClipboard(): Promise<File[]> {
  try {
    const clipboardItems = await navigator.clipboard.read();
    const files: File[] = [];

    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith("image/")) {
          const blob = await item.getType(type);
          files.push(new File([blob], `paste-${Date.now()}.png`, { type }));
        }
      }
    }
    return files;
  } catch {
    return []; // permission denied hoặc không có file
  }
}
```

---

### Section 1.3: File System Access API — User-Visible Files

**Photopea** dùng File System Access API để mở `.psd` files từ disk và save changes trực tiếp — không cần re-download:

```typescript
// Mở file với picker dialog (Chrome 86+, không hỗ trợ Firefox/Safari stable)
async function openFileWithPicker(): Promise<File | null> {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Photoshop Files",
          accept: { "image/vnd.adobe.photoshop": [".psd", ".psb"] },
        },
        {
          description: "Figma Files",
          accept: { "application/octet-stream": [".fig"] },
        },
      ],
      multiple: false,
    });

    // FileSystemFileHandle — có thể lưu lại để access sau
    const file = await fileHandle.getFile();
    return file;
  } catch (e) {
    if ((e as DOMException).name === "AbortError") return null; // user cancelled
    throw e;
  }
}

// Save file trực tiếp (không cần download prompt)
async function saveFileDirectly(handle: FileSystemFileHandle, content: ArrayBuffer): Promise<void> {
  // Cần verifyPermission trước khi write
  const permission = await handle.queryPermission({ mode: "readwrite" });
  if (permission !== "granted") {
    await handle.requestPermission({ mode: "readwrite" });
  }

  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}

// Directory picker — Figma dùng để import folder của assets
async function openDirectory(): Promise<FileSystemDirectoryHandle> {
  return await window.showDirectoryPicker({ mode: "readwrite" });
}

// Iterate tất cả files trong directory
async function* walkDirectory(
  dirHandle: FileSystemDirectoryHandle,
  path = "",
): AsyncGenerator<{ path: string; file: File }> {
  for await (const [name, entry] of dirHandle.entries()) {
    const entryPath = path ? `${path}/${name}` : name;
    if (entry.kind === "file") {
      yield { path: entryPath, file: await (entry as FileSystemFileHandle).getFile() };
    } else {
      yield* walkDirectory(entry as FileSystemDirectoryHandle, entryPath);
    }
  }
}
```

---

## Part 2: Reading Files — FileReader vs Modern APIs / Đọc File

### Section 2.1: FileReader (Legacy) vs Blob Modern API

**FileReader** là API cũ từ thời HTML5 — callback-based, verbose, khó dùng với async/await:

```typescript
// ── FileReader (LEGACY — tránh dùng trừ khi cần hỗ trợ IE11) ────────────
function readFileAsText_legacy(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, "UTF-8");
  });
}

// Methods của FileReader:
// reader.readAsText(file)         → result: string
// reader.readAsArrayBuffer(file)  → result: ArrayBuffer (dùng cho binary)
// reader.readAsDataURL(file)      → result: "data:image/png;base64,..."
// reader.readAsBinaryString(file) → DEPRECATED, không dùng

// ── Modern Blob API (RECOMMENDED) ────────────────────────────────────────
async function readFileModern(file: File): Promise<void> {
  // Đọc toàn bộ file vào memory (chỉ dùng cho file nhỏ < 50MB)
  const text = await file.text(); // UTF-8 string
  const buffer = await file.arrayBuffer(); // ArrayBuffer

  // Streaming — CHO FILE LỚN (> 50MB)
  const stream: ReadableStream<Uint8Array> = file.stream();

  const reader = stream.getReader();
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      // process chunk theo từng đợt — không load toàn bộ vào RAM
    }
  } finally {
    reader.releaseLock();
  }
}
```

**Khi nào dùng gì:**

| Cần gì                     | Dùng gì                         | Lý do                       |
| -------------------------- | ------------------------------- | --------------------------- |
| Đọc text file nhỏ (< 10MB) | `file.text()`                   | Đơn giản nhất               |
| Đọc binary file nhỏ        | `file.arrayBuffer()`            | Direct, no callback hell    |
| Hiển thị preview ảnh       | `URL.createObjectURL(file)`     | Không đọc file, chỉ tạo URL |
| File lớn (> 50MB)          | `file.stream()`                 | Không load toàn bộ vào RAM  |
| Parse theo chunk           | `Streams API + TransformStream` | Pipeline processing         |
| Legacy browser support     | `FileReader`                    | Fallback                    |

---

### Section 2.2: Streams API cho File Lớn

**Loom** parse video metadata của file 5GB bằng Streams mà không crash browser:

```typescript
// Đọc file lớn và tính checksum theo chunk — không load toàn bộ vào RAM
async function computeFileChecksum(file: File): Promise<string> {
  const chunkSize = 2 * 1024 * 1024; // 2MB per chunk

  // Tạo TransformStream để hash từng chunk
  const hashStream = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      controller.enqueue(chunk); // pass-through, accumulate elsewhere
    },
  });

  let offset = 0;
  const chunks: Uint8Array[] = [];

  while (offset < file.size) {
    const slice = file.slice(offset, offset + chunkSize);
    const buffer = await slice.arrayBuffer();
    chunks.push(new Uint8Array(buffer));
    offset += chunkSize;

    // Update progress
    const progress = Math.round((offset / file.size) * 100);
    postMessage({ type: "progress", progress: Math.min(progress, 100) });
  }

  // Web Crypto API để hash
  const allBytes = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
  let pos = 0;
  for (const chunk of chunks) {
    allBytes.set(chunk, pos);
    pos += chunk.length;
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", allBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Pipe file stream qua TransformStream để decompress on-the-fly (ví dụ: .gz)
async function streamDecompress(file: File): Promise<ReadableStream<Uint8Array>> {
  const ds = new DecompressionStream("gzip");
  return file.stream().pipeThrough(ds);
}
```

---

## Part 3: Client-Side Storage / Lưu Trữ Phía Client

### Section 3.1: OPFS — Origin Private File System

OPFS là **game changer** cho browser apps phức tạp. Đây là lý do Figma, SQLite WASM, và video editors có thể chạy trong browser:

```typescript
// ── OPFS trên Main Thread (Async) ────────────────────────────────────────
async function opfsMainThread(): Promise<void> {
  // Lấy root của OPFS — hoàn toàn private, user không thể browse
  const root = await navigator.storage.getDirectory();

  // Tạo/mở file
  const fileHandle = await root.getFileHandle("cache.bin", { create: true });

  // Write
  const writable = await fileHandle.createWritable();
  await writable.write(new Uint8Array([1, 2, 3, 4, 5]));
  await writable.close();

  // Read
  const file = await fileHandle.getFile();
  const data = await file.arrayBuffer();

  // Tạo directory
  const dir = await root.getDirectoryHandle("chunks", { create: true });
  const chunkFile = await dir.getFileHandle("chunk-001.bin", { create: true });
}

// ── OPFS Synchronous trong Web Worker (THE REAL POWER) ───────────────────
// File này chạy trong Worker — không thể gọi từ main thread!

// worker.ts
async function opfsSyncInWorker(): Promise<void> {
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle("sqlite.db", { create: true });

  // createSyncAccessHandle() chỉ available trong Worker!
  // Đây là SYNCHRONOUS access — không cần await mỗi operation
  const syncHandle = await fileHandle.createSyncAccessHandle();

  try {
    // Ghi synchronous — SQLite WASM cần điều này
    const data = new Uint8Array([0x53, 0x51, 0x4c, 0x69, 0x74, 0x65]); // "SQLite"
    syncHandle.write(data, { at: 0 });
    syncHandle.flush(); // persist to disk

    // Đọc synchronous
    const buffer = new ArrayBuffer(6);
    const bytesRead = syncHandle.read(buffer, { at: 0 });

    // Lấy size
    const size = syncHandle.getSize();

    // Truncate
    syncHandle.truncate(0);
  } finally {
    syncHandle.close(); // QUAN TRỌNG: phải close để release lock
  }
}

// ── Main thread giao tiếp với OPFS Worker ────────────────────────────────
// main.ts
const worker = new Worker(new URL("./opfs-worker.ts", import.meta.url), {
  type: "module",
});

worker.postMessage({ type: "write", data: new Uint8Array(1024), offset: 0 });
worker.onmessage = (e) => {
  if (e.data.type === "done") console.log("Write complete");
};
```

**Tại sao OPFS Sync trong Worker quan trọng:**

```
SQLite WASM cần synchronous read/write để emulate disk I/O.
Trên main thread: mọi I/O phải async → không thể emulate SQLite page cache.
Trong Worker: syncHandle.read() là truly synchronous → SQLite hoạt động perfectly.

Đây là lý do:
- wa-sqlite (SQLite trong WASM) dùng OPFS Sync Worker
- Photopea lưu history/layers vào OPFS
- Video editors (Clipchamp, Kapwing) dùng OPFS cho frame cache
```

---

### Section 3.2: IndexedDB Blob Storage vs OPFS

**Notion** lưu file attachments vào IndexedDB khi offline:

```typescript
// ── IndexedDB với Blob ────────────────────────────────────────────────────
async function storeFileInIDB(file: File, id: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction("files", "readwrite");
  const store = tx.objectStore("files");

  // IDB có thể lưu Blob trực tiếp (không cần convert sang base64!)
  await store.put({
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    blob: file, // Blob native — hiệu quả hơn base64 string
    uploadedAt: null, // null = chưa upload
  });

  await tx.done;
}

async function getFileFromIDB(id: string): Promise<File | null> {
  const db = await openDatabase();
  const entry = await db.get("files", id);
  if (!entry) return null;

  // Reconstruct File từ stored Blob
  return new File([entry.blob], entry.name, { type: entry.type });
}

// Helper để open DB (dùng idb library trong thực tế)
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("file-cache", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("files", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
```

**IDB Blob vs OPFS — khi nào dùng gì:**

| Tiêu chí                     | IndexedDB Blob               | OPFS                           |
| ---------------------------- | ---------------------------- | ------------------------------ |
| Query (lọc theo metadata)    | ✅ Có index, query linh hoạt | ❌ Chỉ traverse tree           |
| Synchronous access           | ❌ Luôn async                | ✅ Sync trong Worker           |
| Random access (seek)         | ❌ Phải load toàn bộ Blob    | ✅ `read(buf, { at: offset })` |
| Browser support              | ✅ Universal                 | ✅ Tốt (Chrome 102+, FF 111+)  |
| SQLite / video editing       | ❌ Không phù hợp             | ✅ Perfect                     |
| File attachment với metadata | ✅ Natural fit               | 🟡 Cần layer thêm              |

> 💡 **Rule of thumb**: Dùng **IndexedDB** khi cần query/filter theo metadata. Dùng **OPFS** khi cần random access hoặc synchronous I/O trong Worker (SQLite, video frame cache).

---

### Section 3.3: Storage Quota & Eviction Model

**Google Drive web** kiểm tra quota trước khi cache file lớn:

```typescript
// Kiểm tra quota hiện tại
async function checkStorageQuota(): Promise<{
  used: number;
  quota: number;
  usagePercent: number;
}> {
  const estimate = await navigator.storage.estimate();
  const used = estimate.usage ?? 0;
  const quota = estimate.quota ?? 0;

  return {
    used,
    quota,
    usagePercent: quota > 0 ? (used / quota) * 100 : 0,
  };
}

// Request persistent storage (không bị evict khi ổ đĩa đầy)
async function requestPersistentStorage(): Promise<boolean> {
  // Nếu đã persistent → true ngay
  if (await navigator.storage.persisted()) return true;

  // Request permission — user cần grant (hoặc browser tự grant dựa trên heuristics)
  const granted = await navigator.storage.persist();
  return granted;
}

// Storage eviction model:
// - Không có persistent storage: browser có thể evict khi disk space thấp (LRU)
// - Có persistent storage: chỉ bị xóa khi user clear site data
// - OPFS và IDB đều nằm trong same origin quota
// - Typical quota: min(1GB, 60% available disk) — varies by browser
```

**Browser storage quota model:**

```
Origin quota = min(browserLimit, percentOfAvailableDisk)

Chrome:   60% of available disk, max ~2TB
Firefox:  50% of available disk
Safari:   1GB soft limit (can request more)

Eviction order (khi disk đầy, không có persistent storage):
1. Evict origins theo LRU (Least Recently Used)
2. OPFS + IndexedDB + Cache API cùng chia sẻ quota
3. localStorage (5MB) là separate quota, không evict tự động

navigator.storage.estimate() → { quota, usage, usageDetails }
usageDetails: {
  indexedDB: bytes,
  serviceWorkerRegistrations: bytes,
  // OPFS included in total but not broken out in usageDetails
}
```

---

## Part 4: Upload Architecture / Kiến Trúc Upload

### Section 4.1: XHR vs Fetch Upload Progress

**Vấn đề phổ biến nhất**: `fetch()` không hỗ trợ upload progress natively:

```typescript
// ── XHR — Upload với progress (legacy nhưng vẫn dùng cho progress) ────────
function uploadWithXHR(
  file: File,
  url: string,
  onProgress: (percent: number) => void,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    // Upload progress event — fired khi browser gửi data lên server
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(new Response(xhr.responseText, { status: xhr.status }));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

// ── Fetch — Workaround dùng ReadableStream để có upload progress ──────────
// Chú ý: duplex: 'half' cần thiết trong Chrome, fetch streaming vẫn experimental
async function uploadWithFetchProgress(
  file: File,
  url: string,
  onProgress: (loaded: number, total: number) => void,
): Promise<void> {
  let loaded = 0;
  const total = file.size;

  // Tạo ReadableStream từ file để track progress
  const stream = new ReadableStream({
    async start(controller) {
      const reader = file.stream().getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        }
        loaded += value.byteLength;
        onProgress(loaded, total);
        controller.enqueue(value);
      }
    },
  });

  await fetch(url, {
    method: "POST",
    body: stream,
    // @ts-ignore — duplex: 'half' là required cho streaming request body
    duplex: "half",
    headers: {
      "Content-Type": file.type,
      "Content-Length": String(file.size),
    },
  });
}
```

> ⚠️ **Limitation**: Fetch streaming upload (`duplex: 'half'`) chỉ work trong Chrome 105+. Cho cross-browser upload progress, XHR vẫn là lựa chọn đáng tin cậy hơn. Nhiều production apps (Tiki, Shopee) vẫn dùng XHR cho upload.

---

### Section 4.2: Chunked & Resumable Upload — tus Protocol

**tus** (tus.io) là open protocol cho resumable file uploads — Google Drive, Vimeo, Transloadit đều dùng:

```typescript
// ── tus Protocol Flow ─────────────────────────────────────────────────────
//
// 1. POST /uploads  (tạo upload resource)
//    Headers: Tus-Resumable: 1.0.0
//             Upload-Length: 5368709120  (5GB)
//             Upload-Metadata: filename aGVsbG8ud29ybGQ=,type aW1hZ2UvcG5n
//    Response: 201 Created
//              Location: https://api.example.com/uploads/abc123
//
// 2. PATCH /uploads/abc123  (gửi từng chunk)
//    Headers: Tus-Resumable: 1.0.0
//             Content-Type: application/offset+octet-stream
//             Upload-Offset: 0              (bắt đầu từ byte 0)
//             Content-Length: 10485760      (10MB chunk)
//    Body: [binary chunk data]
//    Response: 204 No Content
//              Upload-Offset: 10485760      (offset sau khi nhận chunk)
//
// 3. Tiếp tục PATCH với Upload-Offset tăng dần
//    Nếu disconnect: HEAD /uploads/abc123 để biết server đã nhận tới đâu
//    Sau đó PATCH từ offset đó — NO re-upload!

import * as tus from "tus-js-client";

async function uploadWithTus(
  file: File,
  endpoint: string,
  onProgress: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint, // "https://api.example.com/uploads/"
      retryDelays: [0, 3000, 5000, 10000, 20000], // retry sau disconnect
      chunkSize: 10 * 1024 * 1024, // 10MB chunks
      metadata: {
        filename: file.name,
        filetype: file.type,
        size: String(file.size),
      },

      onError(error) {
        reject(error);
      },

      onProgress(bytesUploaded, bytesTotal) {
        onProgress(Math.round((bytesUploaded / bytesTotal) * 100));
      },

      onSuccess() {
        resolve(upload.url!); // URL của uploaded file
      },
    });

    // Check nếu upload đang dở dang (từ session trước)
    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length > 0) {
        // Resume từ upload cuối cùng
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  });
}
```

---

### Section 4.3: S3 Multipart Upload

**Shopee** upload ảnh sản phẩm qua S3 Multipart — đây là pattern phổ biến nhất cho large file uploads:

```typescript
// S3 Multipart Upload Flow:
// 1. Backend tạo multipart upload → trả về uploadId
// 2. Frontend chia file thành parts (minimum 5MB mỗi part, trừ part cuối)
// 3. Frontend upload từng part song song với pre-signed URL
// 4. Frontend gửi CompleteMultipartUpload khi xong

interface MultipartUploadConfig {
  uploadId: string;
  key: string;
  bucket: string;
  presignedUrls: string[]; // backend generates, 1 per part
}

async function s3MultipartUpload(
  file: File,
  config: MultipartUploadConfig,
  onProgress: (percent: number) => void,
): Promise<void> {
  const PART_SIZE = 10 * 1024 * 1024; // 10MB (min 5MB for S3)
  const totalParts = Math.ceil(file.size / PART_SIZE);
  const uploadedParts: { ETag: string; PartNumber: number }[] = [];
  let uploadedBytes = 0;

  // Upload parts với concurrency control (max 3 concurrent)
  const CONCURRENCY = 3;
  const partNumbers = Array.from({ length: totalParts }, (_, i) => i);

  // Process in batches of CONCURRENCY
  for (let i = 0; i < partNumbers.length; i += CONCURRENCY) {
    const batch = partNumbers.slice(i, i + CONCURRENCY);

    await Promise.all(
      batch.map(async (partIndex) => {
        const start = partIndex * PART_SIZE;
        const end = Math.min(start + PART_SIZE, file.size);
        const chunk = file.slice(start, end);
        const partNumber = partIndex + 1;

        const response = await fetch(config.presignedUrls[partIndex], {
          method: "PUT",
          body: chunk,
          headers: { "Content-Type": file.type },
        });

        if (!response.ok) throw new Error(`Part ${partNumber} upload failed`);

        // S3 trả về ETag trong header — cần để complete upload
        const etag = response.headers.get("ETag")!;
        uploadedParts.push({ ETag: etag, PartNumber: partNumber });

        uploadedBytes += chunk.size;
        onProgress(Math.round((uploadedBytes / file.size) * 100));
      }),
    );
  }

  // Sort parts theo PartNumber (cần thiết cho S3 CompleteMultipartUpload)
  uploadedParts.sort((a, b) => a.PartNumber - b.PartNumber);

  // Gọi backend để complete (backend gọi S3 CompleteMultipartUpload)
  await fetch("/api/upload/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uploadId: config.uploadId,
      key: config.key,
      parts: uploadedParts,
    }),
  });
}

// Backend API flow:
// POST /api/upload/init → { uploadId, key, presignedUrls[] }
// PUT  <presignedUrl>   → S3 directly, returns ETag
// POST /api/upload/complete → backend calls s3.completeMultipartUpload()
// POST /api/upload/abort    → cleanup on error
```

---

### Section 4.4: Service Worker — Upload Survives Tab Close

**Loom** giữ upload chạy kể cả khi user đóng tab — đây là Service Worker pattern:

```typescript
// ── service-worker.ts ─────────────────────────────────────────────────────
// Service Worker intercept fetch và quản lý upload state

const UPLOAD_QUEUE_KEY = "upload-queue";

// Sync upload queue khi có network (Background Sync API)
self.addEventListener("sync", async (event: SyncEvent) => {
  if (event.tag === "upload-queue") {
    event.waitUntil(processUploadQueue());
  }
});

async function processUploadQueue(): Promise<void> {
  const cache = await caches.open(UPLOAD_QUEUE_KEY);
  const requests = await cache.keys();

  for (const request of requests) {
    const response = await cache.match(request);
    if (!response) continue;

    const uploadData = await response.json();

    try {
      await resumeUpload(uploadData);
      await cache.delete(request); // Xóa khỏi queue sau khi thành công
    } catch {
      // Giữ trong queue để retry sau
    }
  }
}

// ── main.ts ────────────────────────────────────────────────────────────────
async function startResilientUpload(file: File): Promise<void> {
  const registration = await navigator.serviceWorker.ready;

  // Lưu upload state vào IndexedDB để Service Worker có thể resume
  await saveUploadState({
    fileId: crypto.randomUUID(),
    fileName: file.name,
    fileSize: file.size,
    uploadedBytes: 0,
    tusUrl: "https://upload.example.com/files/",
  });

  // Register background sync
  await registration.sync.register("upload-queue");
  // Từ đây, Service Worker sẽ handle upload kể cả khi tab đóng
}

// Lưu file vào OPFS để Service Worker có thể đọc (file object không cross scope)
async function saveFileToOPFS(file: File, id: string): Promise<void> {
  const root = await navigator.storage.getDirectory();
  const dir = await root.getDirectoryHandle("uploads", { create: true });
  const fileHandle = await dir.getFileHandle(id, { create: true });
  const writable = await fileHandle.createWritable();
  await file.stream().pipeTo(writable);
}
```

---

## Part 5: Client-Side Image Processing / Xử Lý Ảnh Phía Client

### Section 5.1: Resize Ảnh Trước Khi Upload

**Tiki** resize ảnh sản phẩm client-side để giảm 70% upload size:

```typescript
// ── Canvas resize (main thread) ───────────────────────────────────────────
async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality = 0.85,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl); // QUAN TRỌNG: cleanup memory leak

      const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      // imageSmoothingQuality: "high" cho chất lượng tốt hơn khi resize
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/webp", // WebP nhỏ hơn JPEG 25-35%
        quality,
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = objectUrl;
  });
}

function calculateDimensions(
  w: number,
  h: number,
  maxW: number,
  maxH: number,
): { width: number; height: number } {
  if (w <= maxW && h <= maxH) return { width: w, height: h };
  const ratio = Math.min(maxW / w, maxH / h);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}

// ── OffscreenCanvas trong Worker (không block main thread) ────────────────
// worker.ts
self.onmessage = async (e: MessageEvent) => {
  const { imageData, maxWidth, maxHeight, quality } = e.data;

  // OffscreenCanvas — không cần DOM, chạy trong Worker
  const canvas = new OffscreenCanvas(maxWidth, maxHeight);
  const ctx = canvas.getContext("2d")!;

  // Decode image trong Worker
  const blob = new Blob([imageData]);
  const imageBitmap = await createImageBitmap(blob);

  const { width, height } = calculateDimensions(
    imageBitmap.width,
    imageBitmap.height,
    maxWidth,
    maxHeight,
  );

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  imageBitmap.close(); // cleanup

  const resultBlob = await canvas.convertToBlob({
    type: "image/webp",
    quality,
  });

  // Transfer ArrayBuffer back (zero-copy)
  const buffer = await resultBlob.arrayBuffer();
  self.postMessage({ buffer, width, height }, { transfer: [buffer] });
};
```

---

### Section 5.2: EXIF Orientation & HEIC/iPhone Uploads

**Vấn đề phổ biến nhất với ảnh iPhone**: HEIC format và EXIF orientation bị rotate sai:

```typescript
// ── EXIF Orientation Fix ──────────────────────────────────────────────────
// iPhone chụp ảnh luôn landscape, lưu EXIF orientation để chỉ rotation
// Browser có thể apply EXIF tự động (Chrome 81+) hoặc không (Safari quirks)

async function fixExifOrientation(file: File): Promise<File> {
  // Chrome 81+ auto-applies EXIF orientation trong <img> tags
  // Nhưng khi đọc vào Canvas, cần fix thủ công
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);

  // Đọc EXIF orientation (simplified — dùng exifr library trong production)
  const orientation = getExifOrientation(view);

  if (orientation === 1) return file; // No rotation needed

  const img = await createImageBitmap(file);
  const { canvas, ctx } = getRotatedCanvas(img, orientation);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
  return new File([blob], file.name, { type: "image/jpeg" });
}

function getExifOrientation(view: DataView): number {
  // JPEG marker check
  if (view.getUint16(0) !== 0xffd8) return 1;

  let offset = 2;
  while (offset < view.byteLength) {
    const marker = view.getUint16(offset);
    const length = view.getUint16(offset + 2);

    if (marker === 0xffe1) {
      // APP1 — EXIF data
      const exifOffset = offset + 10;
      const littleEndian = view.getUint16(exifOffset) === 0x4949;
      const ifdOffset = view.getUint32(exifOffset + 4, littleEndian) + exifOffset;
      const entries = view.getUint16(ifdOffset, littleEndian);

      for (let i = 0; i < entries; i++) {
        const entryOffset = ifdOffset + 2 + i * 12;
        if (view.getUint16(entryOffset, littleEndian) === 0x0112) {
          return view.getUint16(entryOffset + 8, littleEndian);
        }
      }
    }

    offset += length + 2;
    if (marker === 0xffda) break; // SOS marker
  }
  return 1;
}

// ── HEIC/HEIF Handling ────────────────────────────────────────────────────
// Safari trên iOS tự convert HEIC sang JPEG khi user chọn qua <input type=file>
// Nhưng khi drag-drop hoặc File System Access: HEIC raw được gửi

async function handlePotentialHEIC(file: File): Promise<File> {
  const isHEIC =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (!isHEIC) return file;

  // Option 1: Dùng heic2any library (phổ biến nhất)
  // npm install heic2any
  // const { default: heic2any } = await import('heic2any');
  // const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
  // return new File([blob as Blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });

  // Option 2: Server-side convert (an toàn hơn, không cần WASM)
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/convert-heic", { method: "POST", body: formData });
  const blob = await response.blob();
  return new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
    type: "image/jpeg",
  });
}

// ── Detect HEIC bằng magic bytes (đừng tin file.type) ─────────────────────
async function detectFileType(file: File): Promise<string> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  // HEIC/HEIF: ftyp box tại offset 4
  const ftypString = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
  if (ftypString === "ftyp") {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (["heic", "heix", "hevc", "hevx", "mif1"].includes(brand)) {
      return "image/heic";
    }
  }
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    return "image/webp";
  }

  return file.type || "application/octet-stream";
}
```

---

## Part 6: Security — MIME Sniffing & Attack Prevention / Bảo Mật

### Section 6.1: MIME Sniffing Security

**Không bao giờ tin `file.type` từ client** — đây là lỗ hổng bảo mật phổ biến:

```typescript
// ❌ ANTI-PATTERN — trusting client-provided type
async function unsafeUpload(file: File): Promise<void> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only images allowed"); // BẢO MẬT GIẢ
  }
  // Attacker đổi file .exe thành file.jpg → file.type = "image/jpeg" (fake)
  // Browser không verify — chỉ dùng extension/header user provide
  await upload(file);
}

// ✅ PATTERN — verify bằng magic bytes client-side + server-side
async function safeClientValidation(file: File): Promise<void> {
  // Magic byte check — khó fake hơn extension
  const detectedType = await detectFileType(file); // từ section trên

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!ALLOWED_TYPES.includes(detectedType)) {
    throw new Error(`File type ${detectedType} not allowed`);
  }

  // Chú ý: đây chỉ là client-side check để UX tốt hơn
  // SERVER phải verify lại bằng magic bytes — client không đáng tin

  // Double-extension attack: "malware.jpg.exe"
  if (file.name.split(".").length > 2) {
    const actualExtension = file.name.split(".").pop()?.toLowerCase();
    if (actualExtension !== "jpg" && actualExtension !== "jpeg") {
      throw new Error("Suspicious filename");
    }
  }
}

// Server-side validation (Node.js example — dùng file-type library)
// import { fileTypeFromBuffer } from 'file-type';
//
// const buffer = await readFileAsBuffer(uploadedFile);
// const type = await fileTypeFromBuffer(buffer);
//
// if (!type || !ALLOWED_MIME_TYPES.includes(type.mime)) {
//   throw new Error('Invalid file type');
// }
//
// // Check magic bytes:
// // JPEG: FF D8 FF
// // PNG: 89 50 4E 47 0D 0A 1A 0A
// // GIF: 47 49 46 38 (GIF8)
// // PDF: 25 50 44 46 (%PDF)
// // ZIP: 50 4B 03 04 (PK..)
// // Executable: 4D 5A (MZ) hoặc 7F 45 4C 46 (ELF)
```

**Attack vectors cần biết:**

```
1. Extension spoofing:
   malware.exe → rename → malware.jpg
   file.type sẽ là "" hoặc "application/octet-stream"
   Nhưng file.name.endsWith('.jpg') → pass naive check

2. Double extension:
   evil.jpg.exe → file.name = "evil.jpg.exe"
   Windows ẩn .exe extension theo default → user thấy "evil.jpg"
   Check: file.name.split('.').pop() phải là extension hợp lệ

3. Polyglot files:
   File vừa là valid JPEG vừa là valid JS/HTML
   Mở bằng browser → execute như HTML
   Fix: server set Content-Type strict + X-Content-Type-Options: nosniff

4. MIME confusion attack:
   Upload file.html → server lưu thành file.jpg → server serve với Content-Type: image/jpeg
   Old browsers có thể MIME-sniff và execute như HTML
   Fix: X-Content-Type-Options: nosniff header
```

---

## Part 7: Web Share API / Chia Sẻ File

**Zalo mobile web** dùng Web Share API để share file ra các app khác:

```typescript
// Share files từ browser sang native apps (mobile only thực tế)
async function shareFile(file: File, title: string, text: string): Promise<void> {
  // Check support
  if (!navigator.share || !navigator.canShare) {
    // Fallback: copy link
    await navigator.clipboard.writeText(window.location.href);
    return;
  }

  const shareData: ShareData = { files: [file], title, text };

  // Check nếu browser/OS hỗ trợ share files (không phải chỉ URL/text)
  if (!navigator.canShare(shareData)) {
    // Fallback: share URL only
    await navigator.share({ title, text, url: window.location.href });
    return;
  }

  try {
    await navigator.share(shareData);
  } catch (e) {
    if ((e as DOMException).name !== "AbortError") throw e;
    // User cancelled share — không phải error
  }
}

// Web Share Target (PWA nhận file từ các app khác):
// manifest.json:
// {
//   "share_target": {
//     "action": "/share-target",
//     "method": "POST",
//     "enctype": "multipart/form-data",
//     "params": {
//       "title": "title",
//       "text": "text",
//       "url": "url",
//       "files": [{ "name": "file", "accept": ["image/*", ".pdf"] }]
//     }
//   }
// }
```

---

## Part 8: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: `<input type="file">` vs Drag-and-Drop — Sự khác biệt và khi nào dùng gì?

**A:**

Both produce `File` objects but differ in UX, capabilities, and code complexity.

**`<input type="file">`:**

- Opens OS file dialog — familiar, accessible, works everywhere including mobile
- `accept` attribute provides a client-side hint (not enforced — user can still bypass)
- `multiple` attribute for multi-file select
- `webkitdirectory` for folder selection (Chrome/Edge only)
- Must be triggered by user gesture

**Drag and Drop (`dataTransfer` API):**

- `dragover` event: **must call `e.preventDefault()`** — without this, drop won't fire
- `e.dataTransfer.files` — FileList, same as `<input>`
- `e.dataTransfer.items` — DataTransferItemList, MORE powerful:
  - `item.kind === 'file'` — file entries
  - `item.webkitGetAsEntry()` — returns `FileSystemEntry` for directory traversal
  - `item.getAsFile()` — returns File object
- Cannot drop from clipboard or external app on mobile Safari

```typescript
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer!.items)
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile()!)
    .filter(Boolean);
});
```

**Khi nào dùng gì**: Input cho simplicity + accessibility + mobile. Drag-drop cho power users, directory upload, hoặc khi muốn UX "drop zone" trực quan. Production apps (Figma, Notion) thường hỗ trợ **cả hai** — input làm fallback, drag-drop làm power feature.

🇻🇳 **Tóm tắt**: Input mở dialog OS — simple, accessible, mobile-friendly. Drag-drop cần `e.preventDefault()` trong `dragover` để hoạt động, và `dataTransfer.items` cho phép traverse directory. Production apps luôn hỗ trợ cả hai.

**💡 Interview Signal:**

- ✅ Strong: Biết `dragover` cần `preventDefault()`, phân biệt `files` vs `items`, biết `webkitGetAsEntry()` cho directory
- ❌ Weak: "Chỉ khác về UX" — bỏ qua `dataTransfer.items` capabilities

---

### 🟢 Q2: FileReader vs `Blob.arrayBuffer()` vs `Blob.stream()` — Khi nào dùng cái nào?

**A:**

Three ways to read a File (which extends Blob), each for different use cases:

**`FileReader` (legacy):**

- Callback-based, verbose, no native Promise support
- Use when: supporting browsers that predate `Blob.arrayBuffer()` (IE11, Safari < 14)
- Methods: `readAsText()`, `readAsArrayBuffer()`, `readAsDataURL()`
- Problem: loads entire file into RAM — DO NOT use for files > 100MB

**`Blob.arrayBuffer()` (modern, recommended for small–medium files):**

- Returns Promise — works with async/await cleanly
- Loads entire file into RAM as ArrayBuffer
- Use for: binary parsing (magic bytes, image processing, PDF parsing) on files < 50MB
- `await file.arrayBuffer()` — simple, clean

**`Blob.stream()` (for large files):**

- Returns `ReadableStream<Uint8Array>` — true streaming, doesn't load entire file
- Use for: files > 50MB, streaming processing, piping through TransformStream
- Enables: chunked hashing, streaming compression, streaming upload
- Memory usage: O(chunk size), not O(file size)

```typescript
// Small file, need binary → arrayBuffer
const header = await file.slice(0, 16).arrayBuffer();

// Large file, streaming hash → stream
const stream = file.stream();
const reader = stream.getReader();
// process chunk by chunk

// Image preview → neither! Use URL.createObjectURL — zero-copy
const url = URL.createObjectURL(file);
img.src = url;
// when done:
URL.revokeObjectURL(url);
```

🇻🇳 **Tóm tắt**: FileReader là legacy callback API. `arrayBuffer()` là modern Promise API cho file nhỏ-vừa. `stream()` cho file lớn — không load toàn bộ vào RAM. Preview ảnh: dùng `URL.createObjectURL()` — nhanh nhất, không đọc file vào RAM.

**💡 Interview Signal:**

- ✅ Strong: Biết `URL.createObjectURL` cho preview (không cần đọc file), phân biệt streaming vs RAM-loading, biết FileReader là legacy
- ❌ Weak: "FileReader để đọc file" — đúng nhưng không biết khi nào streaming cần thiết

---

### 🟡 Q3: Làm sao show upload progress chính xác? XHR vs fetch?

**A:**

Upload progress requires knowing how many bytes the browser has sent. This is where XHR and fetch fundamentally differ.

**XHR — native upload progress:**

- `xhr.upload.addEventListener('progress', (e) => ...)` — fires as browser sends data
- `e.loaded` = bytes sent, `e.total` = total bytes
- Reliable, cross-browser, production-proven

**fetch — no native upload progress (yet):**

- `fetch()` doesn't expose upload progress in the standard API
- The request body is sent opaquely — no progress events
- **Workaround**: Wrap body in `ReadableStream`, track bytes manually as you enqueue:

```typescript
// fetch workaround — experimental, Chrome 105+ only
const stream = new ReadableStream({
  async start(controller) {
    const reader = file.stream().getReader();
    let loaded = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        break;
      }
      loaded += value.byteLength;
      onProgress(loaded, file.size); // track here
      controller.enqueue(value);
    }
  },
});
await fetch(url, { method: "POST", body: stream, duplex: "half" });
```

**Limitation of fetch workaround:**

- `duplex: 'half'` required but not typed in standard TS types
- Not supported in Firefox (still experimental, 2026)
- HTTP/1.1 buffering may report 100% before server receives all data

**Production recommendation**: For files > 1MB requiring progress UX, use XHR or a library like `tus-js-client` / `axios` (wraps XHR internally). For small files without progress UI: `fetch` is fine.

🇻🇳 **Tóm tắt**: XHR có `xhr.upload.onprogress` native và reliable. Fetch không có upload progress — workaround dùng ReadableStream + `duplex: 'half'` nhưng chỉ Chrome 105+. Production > 1MB: dùng XHR hoặc tus-js-client.

**💡 Interview Signal:**

- ✅ Strong: Biết fetch không có native upload progress, giải thích được ReadableStream workaround và limitations của nó
- ❌ Weak: "Dùng fetch onprogress" — sai, fetch không có upload onprogress

---

### 🟡 Q4: Resize ảnh client-side trước upload — Canvas, OffscreenCanvas, EXIF orientation, HEIC?

**A:**

Client-side image resize is standard practice at Tiki, Shopee, and similar platforms — reduces upload bandwidth 60–80%.

**Flow:**

1. User selects file
2. Detect actual MIME type via magic bytes (not `file.type`)
3. Handle HEIC: iOS `<input>` auto-converts to JPEG, but drag-drop may deliver raw HEIC
4. Fix EXIF orientation: iPhones store rotation in EXIF metadata, not in pixel data
5. Resize via Canvas/OffscreenCanvas
6. Upload resized Blob

**EXIF Orientation issue:**

- iPhone always captures landscape, stores rotation as EXIF tag 0x0112 (1–8)
- Chrome 81+ auto-applies EXIF in `<img>` tags, but Canvas `drawImage()` ignores EXIF
- Without fix: portrait photo drawn sideways in canvas
- Fix: read EXIF orientation, apply CSS transform or Canvas rotation before drawing

**OffscreenCanvas advantage:**

- Runs in Web Worker — doesn't block main thread during heavy image processing
- `createImageBitmap(blob)` + `canvas.convertToBlob()` in Worker
- Transfer ArrayBuffer back with `{ transfer: [buffer] }` — zero-copy

**HEIC handling:**

- Safari on iOS: `<input type="file">` → browser converts to JPEG automatically
- Safari on iOS: drag-drop or File System Access → raw HEIC
- Solution: detect via magic bytes (`ftyp` box), use `heic2any` library or server-side conversion
- Test with real iPhone devices — emulators don't replicate HEIC behavior

🇻🇳 **Tóm tắt**: Canvas resize là standard. OffscreenCanvas trong Worker để không block UI. EXIF orientation: iPhone lưu rotation metadata, Canvas `drawImage` bỏ qua → ảnh bị xoay — cần đọc và apply thủ công. HEIC: Safari input tự convert, nhưng drag-drop có thể gửi raw HEIC → cần detect bằng magic bytes và convert.

**💡 Interview Signal:**

- ✅ Strong: Biết EXIF orientation problem với Canvas, biết HEIC chỉ convert tự động qua input không phải drag-drop, đề xuất OffscreenCanvas cho Worker
- ❌ Weak: "Dùng canvas toBlob là xong" — bỏ qua EXIF và HEIC edge cases

---

### 🟡 Q5: File System Access API vs OPFS — User-visible vs Origin-private, persistence, browser support?

**A:**

Both APIs let you work with files persistently, but they serve completely different use cases.

**File System Access API:**

- Accesses **user's actual file system** — the files they can browse in Finder/Explorer
- User must grant permission each session (or persist via `StorageAccessHandle`)
- `showOpenFilePicker()`, `showSaveFilePicker()`, `showDirectoryPicker()`
- Save changes directly to disk without download prompt
- **Browser support**: Chrome 86+, Edge 86+. **No Firefox, no stable Safari**
- Use case: Figma saving `.fig` files, Photopea saving `.psd` to disk, VS Code Web

**Origin Private File System (OPFS):**

- Completely **sandboxed** — user cannot browse or access these files
- No permission prompt — always available to origin
- Persistent across sessions (until storage cleared)
- **Synchronous access in Worker** via `createSyncAccessHandle()` — unique capability
- **Browser support**: Chrome 102+, Firefox 111+, Safari 15.2+ ✅
- Use case: SQLite WASM database files, video editor frame cache, offline app state

```
File System Access API:
  Real user files ← → Your app
  Needs permission dialog each session
  "Save As" equivalent in native apps
  ❌ No Firefox/Safari stable

OPFS:
  Hidden sandboxed FS ← → Your app
  No permission needed
  User cannot access directly
  ✅ Good cross-browser support
  Sync access in Worker → SQLite works!
```

🇻🇳 **Tóm tắt**: File System Access = truy cập file thật của user, cần permission dialog, chỉ Chrome/Edge. OPFS = file system ẩn của origin, không cần permission, cross-browser tốt hơn, và có synchronous access trong Worker — đây là lý do SQLite WASM hoạt động được.

**💡 Interview Signal:**

- ✅ Strong: Biết File System Access chỉ Chrome/Edge, OPFS có sync access trong Worker, phân biệt user-visible vs origin-private
- ❌ Weak: "Cả hai đều lưu file trên máy user" — sai, OPFS hoàn toàn không accessible bởi user

---

### 🟡 Q6: Chunked/resumable uploads — tus protocol, S3 multipart, signed URLs?

**A:**

For files > 5MB, chunked uploads are essential for reliability. There are two main patterns:

**tus Protocol:**

- Open resumable upload protocol (tus.io) — used by Vimeo, Transloadit, Cloudflare Stream
- Three operations: CREATE (init), PATCH (upload chunk), HEAD (check offset for resume)
- Server stores offset, client resumes from exact byte on reconnect
- `tus-js-client` library handles retry, resume, chunk management automatically
- Best for: when you control the server, want open standard, need auto-retry

**S3 Multipart Upload:**

- AWS-native chunked upload — parts minimum 5MB (except last part)
- Flow: Init → Upload parts with pre-signed URLs → Complete (or Abort)
- Parts can upload in **parallel** → faster than sequential
- Pre-signed URLs: backend generates time-limited URLs, frontend uploads directly to S3 — no data proxied through your server
- ETag from each part response needed for `CompleteMultipartUpload`
- Best for: AWS ecosystem, large files, want to offload bandwidth from your servers

**Key differences:**

|                     | tus                    | S3 Multipart       |
| ------------------- | ---------------------- | ------------------ |
| Open standard       | ✅                     | ❌ AWS proprietary |
| Auto-retry          | ✅ Library handles     | ❌ Manual          |
| Parallel parts      | Via multiple uploads   | ✅ Native          |
| No server bandwidth | ❌ Goes through server | ✅ Direct to S3    |
| Min part size       | Configurable           | 5MB                |

🇻🇳 **Tóm tắt**: tus là open protocol resumable upload — PATCH từng chunk, HEAD để lấy offset khi reconnect. S3 Multipart: init → upload parts song song với pre-signed URL → complete. Pre-signed URLs quan trọng vì upload thẳng S3, không qua server của mình (tiết kiệm bandwidth). tus cho full control, S3 cho AWS ecosystem + parallel parts.

**💡 Interview Signal:**

- ✅ Strong: Giải thích được tus HEAD request để resume, biết S3 pre-signed URL pattern, biết parallel parts optimization
- ❌ Weak: "Chia file thành phần rồi upload từng phần" — đúng nhưng thiếu resume mechanism và pre-signed URL pattern

---

### 🔴 Q7: OPFS synchronous handle trong Worker — khi nào quan trọng?

**A:**

The synchronous OPFS access handle is the **only** truly synchronous file I/O available in browser. Understanding why this matters requires understanding WASM and SQLite's I/O model.

**Why synchronous I/O matters for WASM:**
SQLite was designed for synchronous disk I/O — its C code calls `read()` and `write()` and expects them to block until done. In the browser, ALL file I/O was async until OPFS sync access was introduced. This made SQLite WASM impossible to run correctly.

**The solution:**
OPFS `createSyncAccessHandle()` — only callable in a **dedicated Web Worker** (not main thread, not shared worker). Returns an object with synchronous methods: `read()`, `write()`, `flush()`, `truncate()`, `getSize()`, `close()`.

```typescript
// In a dedicated Worker:
const handle = await fileHandle.createSyncAccessHandle();
// These are truly synchronous — no await needed:
handle.write(buffer, { at: 0 }); // blocks until done
handle.flush();
const size = handle.getSize(); // returns number immediately
handle.close();
```

**Real-world usage:**

- **wa-sqlite**: Uses OPFS Sync Worker to store SQLite database files — full SQL in browser
- **Absurd-sql**: Same approach, SQLite over OPFS
- **Photopea**: Layer data / history stored in OPFS for fast read/write during editing
- **Video editors** (Clipchamp): Frame cache in OPFS — seeking requires random byte access, sync is critical for performance

**Main thread constraint:**
`createSyncAccessHandle()` is NOT available on main thread (would block UI). You must use a dedicated Worker. Communication: postMessage with Transferable ArrayBuffers for zero-copy data transfer.

🇻🇳 **Tóm tắt**: OPFS sync handle chỉ available trong Web Worker — không phải main thread. SQLite WASM cần synchronous I/O (C code không async) → OPFS sync là giải pháp duy nhất. wa-sqlite dùng cách này. Video editors dùng để random-access frame data. Main thread → Worker communication qua postMessage + Transferable ArrayBuffer (zero-copy).

**💡 Interview Signal:**

- ✅ Strong: Giải thích được tại sao SQLite cần sync I/O, biết chỉ work trong dedicated Worker, đề cập wa-sqlite, biết Transferable ArrayBuffer
- ❌ Weak: "OPFS sync nhanh hơn" — đúng nhưng không giải thích được WHY nó critical cho WASM use cases

---

### 🔴 Q8: Thiết kế UX cho upload file 5GB — chunking, resume, cross-tab progress, Service Worker?

**A:**

This is a system design question. A complete 5GB upload solution needs multiple layers:

**Layer 1 — Chunking (10MB parts):**

- File too large for single request (server timeouts, browser memory)
- Minimum chunk: 5MB (S3 requirement), practical: 5–20MB
- Store chunk metadata in IndexedDB: `{ fileId, chunkIndex, etag, uploaded: boolean }`

**Layer 2 — Resume after disconnect:**

- On start: generate stable fileId (`SHA-256 of first 64KB + size + name`)
- On reconnect: query IndexedDB for partial upload state
- With tus: HEAD request → server returns current offset → resume from there
- With S3: store `uploadId` + completed `ETags` in IndexedDB

**Layer 3 — Cross-tab progress:**

- `BroadcastChannel` API: emit progress events, other tabs listen
- `SharedWorker`: shared state across tabs, more complex but cleaner
- `localStorage` events: simple but polling-based

```typescript
// BroadcastChannel for cross-tab progress
const bc = new BroadcastChannel("upload-progress");
bc.postMessage({ fileId, percent: 67, speed: "12 MB/s", eta: "3 min" });

// Other tabs:
bc.onmessage = (e) => updateProgressUI(e.data);
```

**Layer 4 — Upload survives tab close:**

- Service Worker + Background Sync API
- Before closing: save upload state to OPFS/IndexedDB, register `sync` tag
- Service Worker `sync` event fires when: tab is closed BUT network is available
- Limitation: Background Sync isn't guaranteed on iOS Safari, limited lifetime
- Alternative: `navigator.sendBeacon()` for final state save on page unload

**Layer 5 — UX signals:**

- Show: percent, upload speed (MB/s), ETA
- Persist state: user can close and reopen browser — progress preserved
- Upload speed: rolling average of last 5 seconds of chunk speeds
- Error recovery: show "Upload paused" with manual resume button

**Loom's approach**: OPFS stores the video file → Service Worker manages tus upload → BroadcastChannel updates all open tabs → even after tab close, SW continues for ~30s (Chrome's limit)

🇻🇳 **Tóm tắt**: 5 layer: (1) Chunking 10MB. (2) Resume: fileId từ hash, lưu state IndexedDB, tus HEAD để resume. (3) Cross-tab: BroadcastChannel. (4) Tab close: Service Worker + Background Sync — lưu state vào OPFS/IDB, SW tiếp tục upload ~30s. (5) UX: speed, ETA, manual resume button.

**💡 Interview Signal:**

- ✅ Strong: Đề cập cả 5 layers, biết Background Sync limitation trên iOS, biết BroadcastChannel cho cross-tab, fileId từ hash để idempotent
- ❌ Weak: "Chia file và upload từng phần" — chỉ layer 1, bỏ qua resume/cross-tab/Service Worker

---

### 🔴 Q9: MIME type security — tại sao không tin `file.type`, magic bytes, double-extension attacks?

**A:**

`file.type` is populated by the browser based on the file extension — not by reading the file content. This makes it trivially spoofable.

**Why `file.type` is unreliable:**

```
File: malware.exe → renamed to → malware.jpg
Browser: file.type = "image/jpeg" (based on .jpg extension)
Magic bytes: 4D 5A (MZ — Windows executable)
```

**Attack vectors:**

**1. Simple renaming**: `.exe` → `.jpg`. `file.type` says `image/jpeg`. File executes if served without Content-Type enforcement.

**2. Double extension attack**: `evil.jpg.exe` — Windows hides known extensions by default, user sees `evil.jpg`, browser may report `image/jpeg`, but it's an executable.

**3. Polyglot files**: Valid JPEG + valid HTML in same binary. Server stores, browser fetches — if Content-Type is wrong, browser executes as HTML → XSS.

**4. Content-Type mismatch**: Client sends `Content-Type: image/jpeg` for a PHP file. Server trusts it, stores as `.jpg`, later serves it — if PHP-capable server executes it.

**Defense layers:**

```
Client: magic byte check (UX only, not security)
     ↓
Server: re-check magic bytes server-side (file-type library)
     ↓
Server: store with content-addressed name (UUID, not original filename)
     ↓
Server: serve with strict Content-Type header
     ↓
Server: add X-Content-Type-Options: nosniff (prevent browser sniffing)
     ↓
CDN: serve from different origin (files.example.com, not example.com)
     → XSS from uploaded HTML can't access cookies of main domain
```

🇻🇳 **Tóm tắt**: `file.type` chỉ dựa vào extension — trivially fake. Magic bytes là 4–8 byte đầu tiên xác định file thật sự là gì. Double-extension: `evil.jpg.exe`. Polyglot: file vừa valid JPEG vừa valid HTML. Defense: server verify magic bytes, lưu với UUID name, serve với strict Content-Type + X-Content-Type-Options: nosniff, phục vụ file từ subdomain khác để isolate XSS.

**💡 Interview Signal:**

- ✅ Strong: Biết `file.type` dựa vào extension, giải thích được polyglot attack, đề xuất serve từ subdomain riêng, X-Content-Type-Options: nosniff
- ❌ Weak: "Kiểm tra extension là đủ" — hoàn toàn không đủ, extension là client-controlled

---

### 🔴 Q10: Browser storage quota model — origin quota, LRU eviction, persistent storage permission?

**A:**

Browser storage is NOT unlimited. Understanding the quota model prevents "storage full" crashes in production.

**Quota per origin:**

- Chrome: up to 60% of available disk space for all origins combined; each origin can use a significant portion
- Firefox: 50% of available disk space
- Safari: 1GB soft limit, can be increased with `navigator.storage.persist()`

**What shares quota:**

- IndexedDB
- Cache API (Service Worker caches)
- OPFS
- (NOT localStorage — separate 5MB per-origin limit)

**Eviction policy (without persistent storage):**

- Browser evicts origins using **LRU (Least Recently Used)** when disk space runs low
- Your origin's data can be deleted without user consent
- This is called "best-effort" storage

**Persistent storage:**

- `navigator.storage.persist()` → requests persistent storage
- If granted: data only deleted when user explicitly clears site data
- Chrome grants automatically for: installed PWAs, sites user has bookmarked, sites with high engagement
- Safari: granted if user adds to Home Screen

**Checking quota:**

```typescript
const { usage, quota } = await navigator.storage.estimate();
// usage: bytes currently used by this origin
// quota: total bytes available to this origin
// usageDetails: { indexedDB, cacheStorage, ... } (not all browsers)

// Check if persistent
const isPersistent = await navigator.storage.persisted();
```

**Production patterns:**

- Check quota before storing large files in OPFS/IDB
- Request `navigator.storage.persist()` for critical offline apps
- Implement "storage low" warnings when usage > 80% of quota
- Google Drive web requests persistent storage on first use

🇻🇳 **Tóm tắt**: Origin quota: Chrome 60% available disk, Safari 1GB soft limit. IDB + Cache API + OPFS chia sẻ quota (localStorage riêng 5MB). Không có persistent storage: browser evict theo LRU khi ổ đĩa đầy. `navigator.storage.persist()` để request persistent storage — quan trọng cho offline apps. `navigator.storage.estimate()` để check usage. Google Drive request persistent storage ngay khi vào app.

**💡 Interview Signal:**

- ✅ Strong: Biết LRU eviction, phân biệt best-effort vs persistent storage, biết localStorage không nằm trong same quota, đề xuất estimate() trước khi store lớn
- ❌ Weak: "Browser có nhiều storage" — không biết eviction model là major gap

---

## Anti-Patterns / Các Lỗi Phổ Biến

### ❌ Anti-Pattern 1: Load file 1GB vào `FileReader.readAsArrayBuffer()`

```typescript
// ❌ SAI — OOM crash với file > 200MB trên nhiều thiết bị
const reader = new FileReader();
reader.readAsArrayBuffer(hugeFile); // 1GB file → 1GB RAM allocation → tab crashes

// ✅ ĐÚNG — Stream theo chunk
const stream = hugeFile.stream();
const reader = stream.getReader();
// process 2MB at a time — constant memory usage
```

Tab sẽ crash hoặc bị killed trên mobile devices (thường < 512MB RAM). Loom, Google Drive đều dùng streaming hoặc chunk-based reading.

---

### ❌ Anti-Pattern 2: Tin `file.type` cho security validation

```typescript
// ❌ SAI — trivially bypassable
if (!file.type.startsWith("image/")) throw new Error("Not an image");
// Attacker renames malware.exe → malware.jpg → file.type = "image/jpeg"

// ✅ ĐÚNG — magic bytes check + server-side validation
const realType = await detectFileType(file); // reads first 12 bytes
if (!ALLOWED_TYPES.includes(realType)) throw new Error("Invalid type");
// Và LUÔN validate lại server-side — client không đáng tin
```

---

### ❌ Anti-Pattern 3: Lưu Blob lớn vào `localStorage`

```typescript
// ❌ SAI — localStorage giới hạn 5MB, sync, blocking main thread
const reader = new FileReader();
reader.readAsDataURL(file); // base64 inflate thêm 33%
reader.onload = () => {
  localStorage.setItem("file", reader.result as string); // crash nếu > 3MB
};

// ✅ ĐÚNG — IndexedDB cho Blob storage
const tx = db.transaction("files", "readwrite");
await tx.objectStore("files").put({ id, blob: file }); // native Blob, no base64
```

localStorage là synchronous, blocking, và chỉ 5MB. IDB hỗ trợ native Blob storage, async, quota hàng GB.

---

### ❌ Anti-Pattern 4: Không có upload progress UI cho file > 10MB

```typescript
// ❌ SAI — user không biết có gì đang xảy ra
await fetch("/upload", { method: "POST", body: file });
// User thấy page "frozen" 30 giây → hit refresh → upload restart

// ✅ ĐÚNG — progress indicator bắt buộc cho file lớn
const xhr = new XMLHttpRequest();
xhr.upload.onprogress = (e) => {
  updateProgressBar(Math.round((e.loaded / e.total) * 100));
  updateETA(calculateETA(e.loaded, e.total, startTime));
};
```

UX research: users abort uploads after 8 giây không có feedback. Tiki/Shopee luôn show progress bar cho ảnh > 2MB.

---

### ❌ Anti-Pattern 5: Test HEIC upload chỉ trên Android/Simulator

```
// ❌ BUG không tìm thấy nếu chỉ test trên simulator
// iPhone drag-drop vào web app gửi raw HEIC
// Android không dùng HEIC → test pass
// Production: iPhone users thấy broken image

// ✅ Test matrix cho image upload:
// - iPhone via <input type="file"> → Safari auto-converts to JPEG ✅
// - iPhone via drag-drop (iPad Safari) → raw HEIC ❌ cần handle
// - iPhone via File System Access API → raw HEIC ❌ cần handle
// → Luôn detect bằng magic bytes, không bao giờ trust extension/type
```

---

### ❌ Anti-Pattern 6: Dùng `fetch` cho upload progress mà không test cross-browser

```typescript
// ❌ SAI trong Firefox (2026) — duplex: 'half' không supported
await fetch(url, {
  method: "POST",
  body: stream,
  // @ts-ignore
  duplex: "half", // SyntaxError or silently ignored in Firefox
});

// ✅ ĐÚNG — kiểm tra support trước, fallback về XHR
const supportsFetchStreaming = "duplex" in new Request("", { method: "POST" });
if (supportsFetchStreaming) {
  await uploadWithFetchStream(file, url, onProgress);
} else {
  await uploadWithXHR(file, url, onProgress); // XHR fallback
}
```

---

## 🧠 Memory Hook

> **"Figma OPENS, Loom STREAMS, Shopee CHUNKS, Zalo SHARES"**

- **Figma OPENS** → File System Access API + OPFS (open and save user files, sync access for WASM)
- **Loom STREAMS** → Streams API + Service Worker (5GB streaming upload survives tab close)
- **Shopee CHUNKS** → S3 Multipart + XHR progress (chunk ảnh, pre-signed URL, parallel parts)
- **Zalo SHARES** → Web Share API + Clipboard API (share files to native apps, paste images)

**Security hook**: _"NEVER trust the label, read the bytes"_ → `file.type` = extension label. Magic bytes = truth.

**Storage hook**: _"IDB = queryable, OPFS = seekable, localStorage = neither"_

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Difficulty | Question                            | Key Answer                                                                                          |
| --- | ---------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Q1  | 🟢         | `<input>` vs drag-drop              | Both → File; drag-drop: `preventDefault()` in dragover, `items` for directories                     |
| Q2  | 🟢         | FileReader vs arrayBuffer vs stream | Legacy / small-med RAM / large streaming; preview → `createObjectURL`                               |
| Q3  | 🟡         | Upload progress XHR vs fetch        | XHR: native `upload.onprogress`; fetch: no native progress, ReadableStream workaround (Chrome only) |
| Q4  | 🟡         | Client-side image resize            | Canvas/OffscreenCanvas; EXIF orientation; HEIC via magic bytes + heic2any                           |
| Q5  | 🟡         | File System Access vs OPFS          | FSA: user-visible files, Chrome/Edge only; OPFS: origin-private, cross-browser, sync in Worker      |
| Q6  | 🟡         | Chunked/resumable uploads           | tus: open protocol, HEAD to resume; S3 Multipart: parallel parts, pre-signed URLs                   |
| Q7  | 🔴         | OPFS sync in Worker                 | Only Worker has sync access → SQLite WASM needs it; main→worker via postMessage+Transferable        |
| Q8  | 🔴         | 5GB upload UX design                | Chunk+IDB state+tus resume+BroadcastChannel cross-tab+SW Background Sync tab close                  |
| Q9  | 🔴         | MIME security                       | `file.type` = extension, spoofable; magic bytes server-side; serve from subdomain; nosniff header   |
| Q10 | 🔴         | Storage quota model                 | ~60% disk, IDB+Cache+OPFS share quota, LRU eviction, `persist()` for permanent storage              |

---

## Cold Call / Câu Hỏi Bất Ngờ

Interviewer (Grab VN, 30 giây để trả lời):

> _"User drag-drops a file, and `file.type` is empty string. Why, and what do you do?"_

**Answer**: Empty `file.type` happens when the browser can't determine MIME type from extension (unknown extension, no extension, or OS doesn't have the mapping). Solution: read first 12 bytes as ArrayBuffer → check magic bytes to determine actual file type. Never reject based on empty `file.type` alone — always verify content.

---

> _"Why can't you call `createSyncAccessHandle()` from the main thread?"_

**Answer**: The main thread runs the JavaScript event loop and renders the UI. Synchronous I/O would block the event loop, freezing the entire page — the same reason `alert()` blocks rendering. Web Workers have their own threads and can block without affecting UI. OPFS sync access is intentionally restricted to Workers to prevent accidental UI freezes.

---

> _"Shopee wants to upload 10,000 product images in one session. What's your architecture?"_

**Answer**: Queue-based with concurrency control (max 3–5 concurrent uploads). Each image: detect type via magic bytes → HEIC convert if needed → OffscreenCanvas resize in Worker → XHR upload with progress. Persist queue state in IndexedDB (resume on page reload). BroadcastChannel for tab sync. Show: total progress, per-image status, failed images with retry. Service Worker for background continuation if tab becomes background.

---

## Self-Check / Tự Kiểm Tra

Trả lời được các câu này → bạn đã master topic:

- [ ] Tại sao `dragover` phải `preventDefault()` mới có thể `drop`?
- [ ] Phân biệt `dataTransfer.files` vs `dataTransfer.items` — khi nào dùng items?
- [ ] File nào phù hợp `Blob.arrayBuffer()`, file nào phải dùng `Blob.stream()`?
- [ ] Tại sao `fetch` không có upload progress? Workaround là gì và limitations?
- [ ] OPFS sync handle chỉ work ở đâu? Tại sao không cho phép ở main thread?
- [ ] tus protocol dùng HTTP method gì để resume? Server biết resume từ đâu?
- [ ] S3 Multipart: minimum part size? Tại sao cần pre-signed URL?
- [ ] `file.type = "image/jpeg"` — khi nào điều này là false/misleading?
- [ ] Double-extension attack là gì? Defend thế nào?
- [ ] `navigator.storage.persist()` làm gì? Khi nào browser tự grant?
- [ ] HEIC từ iPhone: khi nào Safari tự convert, khi nào không?
- [ ] BroadcastChannel vs SharedWorker cho cross-tab progress — trade-offs?
- [ ] Service Worker Background Sync có đảm bảo chạy không? iOS thì sao?
- [ ] IndexedDB vs OPFS: khi nào chọn cái nào?
- [ ] Magic bytes của JPEG, PNG, WebP, HEIC là gì?
