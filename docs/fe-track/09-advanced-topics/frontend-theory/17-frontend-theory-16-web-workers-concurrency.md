# Frontend Theory 16: Web Workers & Concurrency

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Overview / Tổng Quan

Tài liệu này tập trung cách xử lý concurrency trên web: Dedicated Worker, Shared Worker, Service Worker,
message passing, structured cloning, transferable objects, SharedArrayBuffer + Atomics, Comlink, OffscreenCanvas, WorkerDOM,
thread pool pattern, và quyết định khi nào nên đưa tác vụ ra worker.

Cross-reference:
- `./08-concurrency-js.md`
- `../../06-browser-performance/04-web-performance-comprehensive.md`

## 1) Worker Types

### Dedicated Worker
Giải thích: worker gắn với một context (tab/page) cụ thể.
Ví dụ: parse CSV lớn tại trang import dữ liệu.

### Shared Worker
Giải thích: nhiều tab có thể dùng chung một worker instance.
Ví dụ: một kết nối socket dùng chung cho 3 tab dashboard.

### Service Worker
Giải thích: proxy mạng/background sync/cache chiến lược, không phải compute worker thuần túy.
Ví dụ: cache-first cho static assets khi offline.

## 2) Worker API Basics

Giải thích: giao tiếp qua `postMessage` + event listener, không share DOM trực tiếp.
Ví dụ: main thread gửi payload ảnh, worker trả lại kết quả resize.

## 3) Message Passing & Structured Cloning

Giải thích: structured clone copy object graph an toàn nhưng có overhead copy memory.
Ví dụ: gửi mảng 100MB theo clone sẽ chậm hơn chuyển ownership bằng transferable.

## 4) Transferable Objects

Giải thích: chuyển ownership `ArrayBuffer/MessagePort/OffscreenCanvas` để tránh copy.
Ví dụ: `worker.postMessage({ buffer }, [buffer])` làm buffer ở main không dùng được nữa.

## 5) SharedArrayBuffer + Atomics

Giải thích: cho phép chia sẻ bộ nhớ thật giữa threads; cần COOP/COEP và dùng Atomics để tránh race.
Ví dụ: ring buffer producer/consumer cho stream audio processing.

## 6) Comlink

Giải thích: abstraction RPC trên `postMessage`, giúp gọi hàm worker như local async function.
Ví dụ: `const api = Comlink.wrap(worker); await api.hashFile(file)`.

## 7) OffscreenCanvas

Giải thích: render canvas trong worker để giảm jank khi vẽ nặng.
Ví dụ: chart 60fps với hàng chục ngàn điểm.

## 8) WorkerDOM

Giải thích: chạy logic thao tác DOM trong worker bằng layer đồng bộ hóa; hữu ích ở một số kiến trúc đặc thù.
Ví dụ: app micro-frontend cần isolate script bên thứ ba.

## 9) Thread Pool Pattern

Giải thích: tái sử dụng pool workers thay vì tạo/hủy liên tục.
Ví dụ: pool 4 worker xử lý batch image 200 files.

## 10) Use Worker vs Main Thread

Giải thích:
- Dùng worker khi CPU-bound > 8-16ms gây drop frame.
- Không cần worker cho network I/O đơn giản.
- Cân nhắc overhead khởi tạo worker + serializing message.

Ví dụ: sorting 1M rows nên đưa worker; fetch JSON nhỏ thì không cần.

## 11) Real-world Use Cases

- Image processing (thumbnail, filters)
- Data parsing (CSV/Parquet/GeoJSON)
- Crypto hashing/signing
- Compression/decompression
- AI inference (WebAssembly/WebGPU pipelines)

### Performance Note 1
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 1
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 2
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 2
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 3
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 3
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 4
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 4
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 5
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 5
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 6
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 6
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 7
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 7
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 8
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 8
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 9
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 9
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 10
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 10
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 11
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 11
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 12
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 12
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 13
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 13
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 14
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 14
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 15
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 15
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 16
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 16
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 17
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 17
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 18
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 18
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 19
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 19
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 20
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 20
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 21
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 21
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 22
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 22
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 23
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 23
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 24
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 24
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 25
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 25
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 26
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 26
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 27
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 27
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 28
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 28
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 29
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 29
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 30
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 30
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 31
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 31
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 32
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 32
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 33
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 33
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 34
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 34
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 35
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 35
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 36
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 36
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 37
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 37
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 38
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 38
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 39
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 39
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 40
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 40
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 41
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 41
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 42
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 42
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 43
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 43
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 44
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 44
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 45
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 45
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 46
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 46
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 47
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 47
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 48
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 48
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 49
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 49
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 50
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 50
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 51
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 51
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 52
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 52
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 53
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 53
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 54
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 54
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

### Performance Note 55
Giải thích: đo trước bằng Performance panel để xác nhận bottleneck nằm ở scripting/long task trước khi thêm worker.
Ví dụ: nếu long tasks > 50ms xuất hiện liên tục khi user scroll, tách phần compute sang worker có thể cải thiện INP.

#### Trade-off 55
Giải thích: worker tăng complexity trong debug, error boundary, source map, và dữ liệu truyền giữa thread.
Ví dụ: payload object lớn cần schema version để tránh mismatch giữa main thread và worker code.

## Code Snippets / Mẫu Code

```ts
// main.ts
const worker = new Worker(new URL('./parser.worker.ts', import.meta.url), { type: 'module' });

worker.onmessage = (event: MessageEvent<{ rows: number }>) => {
  console.log('rows parsed', event.data.rows);
};

worker.postMessage({ kind: 'parse-csv', text: 'a,b\n1,2' });
```

```ts
// parser.worker.ts
self.onmessage = (event: MessageEvent<{ kind: string; text: string }>) => {
  if (event.data.kind !== 'parse-csv') return;
  const lines = event.data.text.split('\n').filter(Boolean);
  (self as DedicatedWorkerGlobalScope).postMessage({ rows: lines.length - 1 });
};
```

Giải thích: giao tiếp thuần message-based giúp isolate CPU work khỏi UI thread.
Ví dụ: parser nặng xử lý trong worker, main thread chỉ render progress bar.

```ts
// Transferable example
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage({ kind: 'process-buffer', buffer }, [buffer]);
```

Giải thích: transferable tránh copy memory lớn.
Ví dụ: encode ảnh raw bytes nhanh hơn clone sâu.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Web Worker là gì?
Giải thích: Luồng JavaScript riêng để chạy tác vụ nặng mà không block UI thread.
Ví dụ: Resize ảnh hoặc parse JSON lớn trong worker.

### 🟢 [Junior] Worker có truy cập DOM trực tiếp không?
Giải thích: Không. Worker không có quyền truy cập DOM trực tiếp.
Ví dụ: Worker gửi message về main để cập nhật UI.

### 🟡 [Mid] Structured clone và Transferable khác nhau ra sao?
Giải thích: Structured clone copy dữ liệu; Transferable chuyển ownership nên nhanh hơn cho buffer lớn.
Ví dụ: Gửi ArrayBuffer 200MB nên dùng transferable.

### 🟡 [Mid] Khi nào dùng Shared Worker?
Giải thích: Khi cần chia sẻ trạng thái/kết nối giữa nhiều tab cùng origin.
Ví dụ: Một websocket manager dùng chung cho nhiều tab monitoring.

### 🔴 [Senior] SharedArrayBuffer cần điều kiện gì?
Giải thích: Cần môi trường cross-origin isolated (COOP/COEP) và đồng bộ bằng Atomics.
Ví dụ: Thiết lập header đúng rồi dùng Atomics.wait/notify cho queue.

### 🔴 [Senior] Vì sao worker không phải luôn luôn tốt?
Giải thích: Có overhead startup, serialization, memory; nếu task nhỏ thì lợi ích không bù chi phí.
Ví dụ: Filter danh sách 200 items trên main có thể nhanh hơn gửi worker.

### 🟡 [Mid] Web worker question 7
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 8
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 9
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 10
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 11
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 12
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 13
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 14
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 15
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 16
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 17
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 18
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 19
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 20
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 21
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 22
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 23
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 24
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 25
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 26
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 27
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 28
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 29
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 30
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 31
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 32
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 33
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 34
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 35
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 36
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 37
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 38
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 39
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 40
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 41
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 42
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 43
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 44
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 45
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 46
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 47
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 48
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 49
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 50
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 51
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 52
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 53
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 54
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 55
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 56
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 57
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 58
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 59
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 60
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 61
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 62
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟢 [Junior] Web worker question 63
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🟡 [Mid] Web worker question 64
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

### 🔴 [Senior] Web worker question 65
Giải thích: trình bày theo baseline performance, cost mô hình thread, rồi kết luận có/không dùng worker.
Ví dụ: benchmark 3 chiến lược (main, single worker, pool 4 workers) và chọn phương án có p95 latency tốt nhất.

## Practical Checklist

- Đo long tasks trước khi tách worker.
- Định nghĩa message contract có version.
- Ưu tiên transferable cho payload lớn.
- Dùng pool để giảm startup overhead.
- Thiết lập fallback nếu worker fail.

## Related Files

- `./08-concurrency-js.md`
- `../../06-browser-performance/04-web-performance-comprehensive.md`
- `../../08-fe-system-design/02-scalability.md`
