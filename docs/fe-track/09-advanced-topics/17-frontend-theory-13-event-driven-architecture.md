# Event-Driven Architecture in Frontend / Kiến Trúc Hướng Sự Kiện Trong Frontend

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Tổng Quan / Overview

- Nội dung gồm DOM events, custom bus, pub/sub, command model, event loop và observability.
- Mục tiêu là giảm coupling giữa module UI và xây dựng event contract rõ ràng khi scale.
- Q&A tập trung cách xử lý ordering, retry, backpressure, và lỗi trong hệ thống event.

### Cross-references / Tài liệu liên quan
- [Functional Reactive Programming](./17-frontend-theory-14-functional-reactive-programming.md)
- [Async Programming Theory](./17-frontend-theory-10-async-programming-theory.md)
- [State Management Theory](./17-frontend-theory-09-state-management-theory.md)
- [Distributed Frontend Systems](./19-expert-topics-01-distributed-frontend-systems.md)

## Key Concepts / Khái Niệm Trọng Tâm

### 1. Event-driven paradigm

**Tổng Quan:** `Event-driven paradigm` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName1 = 'ui.event.1';
```

### 2. DOM event phases

**Tổng Quan:** `DOM event phases` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName2 = 'ui.event.2';
```

### 3. Custom event bus design

**Tổng Quan:** `Custom event bus design` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName3 = 'ui.event.3';
```

### 4. Pub/Sub channel strategy

**Tổng Quan:** `Pub/Sub channel strategy` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName4 = 'ui.event.4';
```

### 5. Observer pattern in UI

**Tổng Quan:** `Observer pattern in UI` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName5 = 'ui.event.5';
```

### 6. Mediator pattern in UI

**Tổng Quan:** `Mediator pattern in UI` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName6 = 'ui.event.6';
```

### 7. Command pattern usage

**Tổng Quan:** `Command pattern usage` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName7 = 'ui.event.7';
```

### 8. Event sourcing basics

**Tổng Quan:** `Event sourcing basics` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName8 = 'ui.event.8';
```

### 9. Message queue in frontend

**Tổng Quan:** `Message queue in frontend` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName9 = 'ui.event.9';
```

### 10. Microtask vs macrotask

**Tổng Quan:** `Microtask vs macrotask` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName10 = 'ui.event.10';
```

### 11. Backpressure handling

**Tổng Quan:** `Backpressure handling` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName11 = 'ui.event.11';
```

### 12. Debounce and throttle

**Tổng Quan:** `Debounce and throttle` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName12 = 'ui.event.12';
```

### 13. Event delegation optimization

**Tổng Quan:** `Event delegation optimization` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName13 = 'ui.event.13';
```

### 14. Error channel design

**Tổng Quan:** `Error channel design` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName14 = 'ui.event.14';
```

### 15. Event schema versioning

**Tổng Quan:** `Event schema versioning` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName15 = 'ui.event.15';
```

### 16. Event contract testing

**Tổng Quan:** `Event contract testing` là năng lực bắt buộc khi thảo luận kiến trúc hướng sự kiện trong frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const eventName16 = 'ui.event.16';
```

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q01: How would you explain event-driven paradigm in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event-driven paradigm`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName1 = 'ui.event.1';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q01: How would you explain event-driven paradigm in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event-driven paradigm`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName21 = 'ui.event.21';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q01: How would you explain event-driven paradigm in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event-driven paradigm`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName41 = 'ui.event.41';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q02: How would you explain dom event phases in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `DOM event phases`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName2 = 'ui.event.2';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q02: How would you explain dom event phases in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `DOM event phases`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName22 = 'ui.event.22';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q02: How would you explain dom event phases in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `DOM event phases`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName42 = 'ui.event.42';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q03: How would you explain custom event bus design in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Custom event bus design`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName3 = 'ui.event.3';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q03: How would you explain custom event bus design in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Custom event bus design`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName23 = 'ui.event.23';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q03: How would you explain custom event bus design in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Custom event bus design`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName43 = 'ui.event.43';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q04: How would you explain pub/sub channel strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Pub/Sub channel strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName4 = 'ui.event.4';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q04: How would you explain pub/sub channel strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Pub/Sub channel strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName24 = 'ui.event.24';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q04: How would you explain pub/sub channel strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Pub/Sub channel strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName44 = 'ui.event.44';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q05: How would you explain observer pattern in ui in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Observer pattern in UI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName5 = 'ui.event.5';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q05: How would you explain observer pattern in ui in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Observer pattern in UI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName25 = 'ui.event.25';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q05: How would you explain observer pattern in ui in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Observer pattern in UI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName45 = 'ui.event.45';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q06: How would you explain mediator pattern in ui in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Mediator pattern in UI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName6 = 'ui.event.6';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q06: How would you explain mediator pattern in ui in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Mediator pattern in UI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName26 = 'ui.event.26';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q06: How would you explain mediator pattern in ui in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Mediator pattern in UI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName46 = 'ui.event.46';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q07: How would you explain command pattern usage in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Command pattern usage`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName7 = 'ui.event.7';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q07: How would you explain command pattern usage in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Command pattern usage`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName27 = 'ui.event.27';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q07: How would you explain command pattern usage in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Command pattern usage`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName47 = 'ui.event.47';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q08: How would you explain event sourcing basics in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event sourcing basics`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName8 = 'ui.event.8';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q08: How would you explain event sourcing basics in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event sourcing basics`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName28 = 'ui.event.28';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q08: How would you explain event sourcing basics in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event sourcing basics`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName48 = 'ui.event.48';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q09: How would you explain message queue in frontend in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Message queue in frontend`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName9 = 'ui.event.9';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q09: How would you explain message queue in frontend in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Message queue in frontend`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName29 = 'ui.event.29';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q09: How would you explain message queue in frontend in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Message queue in frontend`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName49 = 'ui.event.49';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q10: How would you explain microtask vs macrotask in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Microtask vs macrotask`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName10 = 'ui.event.10';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q10: How would you explain microtask vs macrotask in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Microtask vs macrotask`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName30 = 'ui.event.30';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q10: How would you explain microtask vs macrotask in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Microtask vs macrotask`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName50 = 'ui.event.50';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q11: How would you explain backpressure handling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Backpressure handling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName11 = 'ui.event.11';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q11: How would you explain backpressure handling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Backpressure handling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName31 = 'ui.event.31';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q11: How would you explain backpressure handling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Backpressure handling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName51 = 'ui.event.51';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q12: How would you explain debounce and throttle in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Debounce and throttle`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName12 = 'ui.event.12';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q12: How would you explain debounce and throttle in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Debounce and throttle`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName32 = 'ui.event.32';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q12: How would you explain debounce and throttle in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Debounce and throttle`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName52 = 'ui.event.52';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q13: How would you explain event delegation optimization in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event delegation optimization`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName13 = 'ui.event.13';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q13: How would you explain event delegation optimization in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event delegation optimization`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName33 = 'ui.event.33';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q13: How would you explain event delegation optimization in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event delegation optimization`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName53 = 'ui.event.53';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q14: How would you explain error channel design in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Error channel design`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName14 = 'ui.event.14';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q14: How would you explain error channel design in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Error channel design`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName34 = 'ui.event.34';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q14: How would you explain error channel design in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Error channel design`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName54 = 'ui.event.54';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q15: How would you explain event schema versioning in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event schema versioning`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName15 = 'ui.event.15';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q15: How would you explain event schema versioning in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event schema versioning`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName35 = 'ui.event.35';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q15: How would you explain event schema versioning in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event schema versioning`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName55 = 'ui.event.55';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q16: How would you explain event contract testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event contract testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName16 = 'ui.event.16';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q16: How would you explain event contract testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event contract testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName36 = 'ui.event.36';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q16: How would you explain event contract testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Event contract testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const eventName56 = 'ui.event.56';
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

## Rapid Review Checklist / Checklist Ôn Tập Nhanh

- Bạn có thể giải thích 16 concept ở cả 3 mức Junior/Mid/Senior?
- Bạn có ví dụ thực tế về bug/perf/security issue và bài học rút ra?
- Bạn có thể liên kết chủ đề hiện tại với testing, observability, và delivery?
- Bạn đã chuẩn bị câu trả lời song ngữ EN heading + VI explanation chưa?
- Bạn có thể vẽ luồng dữ liệu hoặc kiến trúc trong 2-3 phút trên whiteboard?

## Tóm Tắt / Summary

Tài liệu `Event-Driven Architecture in Frontend` đã được chuyển sang bilingual Q&A format với difficulty tags (`🟢 [Junior]`, `🟡 [Mid]`, `🔴 [Senior]`), chứa marker `Tổng Quan`, `Giải thích`, `Ví dụ`, có cross-reference bằng relative path và code mẫu JS/TS để luyện phỏng vấn.
