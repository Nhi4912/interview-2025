# File Uploader / Component Upload File

> **Track**: FE | **Difficulty**: 🟡 Medium
> **Topics**: React, File API, Drag & Drop, Progress tracking, Validation

---

## Problem / Bài Toán

Build a file uploader with drag-and-drop support, file validation, upload progress, and cancel support.

**Requirements:**
- Drag-and-drop + click to browse
- Validate: file type, max size
- Show upload progress per file
- Allow cancellation
- Accessible

---

## Solution / Giải Pháp

```tsx
import { useState, useRef, DragEvent, ChangeEvent } from 'react'

interface UploadFile {
  id: string
  file: File
  progress: number   // 0–100
  status: 'pending' | 'uploading' | 'done' | 'error' | 'cancelled'
  error?: string
  controller?: AbortController
}

const MAX_SIZE_MB = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return `Type ${file.type} not allowed`
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File exceeds ${MAX_SIZE_MB}MB limit`
  return null
}

async function uploadFile(
  file: File,
  signal: AbortSignal,
  onProgress: (pct: number) => void
): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)

  // XMLHttpRequest allows progress tracking (fetch doesn't natively)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload')

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => xhr.status < 400 ? resolve() : reject(new Error(`HTTP ${xhr.status}`))
    xhr.onerror = () => reject(new Error('Network error'))

    signal.addEventListener('abort', () => { xhr.abort(); reject(new DOMException('Aborted')) })
    xhr.send(formData)
  })
}

export function FileUploader() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (rawFiles: File[]) => {
    const newFiles: UploadFile[] = rawFiles.map(file => {
      const error = validateFile(file) ?? undefined
      return {
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: error ? 'error' : 'pending',
        error,
      }
    })
    setFiles(prev => [...prev, ...newFiles])
    // Auto-start valid files
    newFiles.filter(f => !f.error).forEach(f => startUpload(f.id, f.file))
  }

  const startUpload = async (id: string, file: File) => {
    const controller = new AbortController()
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', controller } : f))

    try {
      await uploadFile(file, controller.signal, (progress) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress } : f))
      })
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done', progress: 100 } : f))
    } catch (e) {
      const cancelled = (e as Error).name === 'AbortError'
      setFiles(prev => prev.map(f => f.id === id
        ? { ...f, status: cancelled ? 'cancelled' : 'error', error: cancelled ? undefined : (e as Error).message }
        : f
      ))
    }
  }

  const cancel = (id: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) { f.controller?.abort(); return { ...f, status: 'cancelled' } }
      return f
    }))
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#0070f3' : '#ccc'}`,
          padding: 32, textAlign: 'center', cursor: 'pointer',
          background: isDragging ? '#f0f7ff' : '#fff',
        }}
        role="button"
        aria-label="Drop files or click to upload"
      >
        Drop files here or click to browse
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          style={{ display: 'none' }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) addFiles(Array.from(e.target.files))
          }}
        />
      </div>

      {files.map(f => (
        <div key={f.id} style={{ marginTop: 8 }}>
          <span>{f.file.name}</span>
          {f.status === 'uploading' && (
            <>
              <progress value={f.progress} max={100} />
              <span>{f.progress}%</span>
              <button onClick={() => cancel(f.id)}>Cancel</button>
            </>
          )}
          {f.status === 'done' && <span style={{ color: 'green' }}> Done</span>}
          {f.status === 'error' && <span style={{ color: 'red' }}> Error: {f.error}</span>}
          {f.status === 'cancelled' && <span style={{ color: 'gray' }}> Cancelled</span>}
        </div>
      ))}
    </div>
  )
}
```

## Key Points / Điểm Quan Trọng

**XHR over fetch for progress**: `fetch` doesn't expose upload progress natively. XHR's `xhr.upload.onprogress` is the standard way.

**AbortController**: Works with both fetch and XHR. Cancel both network request AND update UI state atomically.

**Validate before upload**: Don't send invalid files to server — validate type and size client-side first.

## Follow-up / Câu Hỏi Tiếp Theo

- **Chunked upload**: Split large files, upload in 5MB chunks, reassemble server-side (for >100MB files)
- **Retry on error**: Exponential backoff, max 3 retries
- **Image preview**: `URL.createObjectURL(file)` before upload completes
