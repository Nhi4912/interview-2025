# JavaScript Concepts Map / Bản Đồ Khái Niệm JavaScript

[Back to Table of Contents](../00-table-of-contents.md) | [Web APIs](./00-web-apis-fundamentals.md) | [Coding Patterns](./11-interview-practice-04-coding-patterns.md)

## Overview
Tài liệu trực quan bằng ASCII để ghi nhớ nhanh các khái niệm JS quan trọng trước phỏng vấn.

## Map 1: event loop visualization
### Tổng Quan
Sơ đồ event loop visualization giúp bạn nhìn nhanh mối quan hệ giữa runtime behavior và code execution.
### Giải thích
- Điểm nhớ 1: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 2: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 3: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 4: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 5: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 6: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 7: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 8: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 9: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 10: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 11: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 12: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
### Ví dụ
```text
┌──────────── Call Stack ────────────┐
│ main()                             │
│ handleClick()                      │
└────────────────────────────────────┘
              │
              ▼
┌──────────── Web APIs ──────────────┐
│ setTimeout, fetch, DOM events      │
└────────────────────────────────────┘
              │ callback ready
              ▼
┌──────────── Task Queues ───────────┐
│ Microtask: Promise.then, queueMicrotask
│ Macrotask: setTimeout, message, IO
└────────────────────────────────────┘
              │
              ▼
      Event Loop picks next task
```
```ts
// mini code example linked to concept
const tasks: string[] = [];
Promise.resolve().then(() => tasks.push("microtask"));
setTimeout(() => tasks.push("macrotask"), 0);
tasks.push("sync");
```
- Interview articulation 1: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 2: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 3: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 4: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 5: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 6: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 7: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 8: trả lời theo cấu trúc "what -> why -> edge case -> fix".

## Map 2: prototype chain diagram
### Tổng Quan
Sơ đồ prototype chain diagram giúp bạn nhìn nhanh mối quan hệ giữa runtime behavior và code execution.
### Giải thích
- Điểm nhớ 1: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 2: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 3: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 4: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 5: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 6: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 7: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 8: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 9: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 10: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 11: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 12: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
### Ví dụ
```text
instance (obj)
   │ [[Prototype]]
   ▼
Constructor.prototype
   │ [[Prototype]]
   ▼
Object.prototype
   │ [[Prototype]]
   ▼
null
```
```ts
// mini code example linked to concept
const tasks: string[] = [];
Promise.resolve().then(() => tasks.push("microtask"));
setTimeout(() => tasks.push("macrotask"), 0);
tasks.push("sync");
```
- Interview articulation 1: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 2: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 3: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 4: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 5: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 6: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 7: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 8: trả lời theo cấu trúc "what -> why -> edge case -> fix".

## Map 3: scope chain visualization
### Tổng Quan
Sơ đồ scope chain visualization giúp bạn nhìn nhanh mối quan hệ giữa runtime behavior và code execution.
### Giải thích
- Điểm nhớ 1: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 2: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 3: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 4: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 5: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 6: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 7: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 8: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 9: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 10: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 11: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 12: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
### Ví dụ
```text
Global Scope
 ├─ const appName
 └─ function outer()
      ├─ const a
      └─ function inner()
           ├─ const b
           └─ lookup order: inner -> outer -> global
```
```ts
// mini code example linked to concept
const tasks: string[] = [];
Promise.resolve().then(() => tasks.push("microtask"));
setTimeout(() => tasks.push("macrotask"), 0);
tasks.push("sync");
```
- Interview articulation 1: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 2: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 3: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 4: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 5: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 6: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 7: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 8: trả lời theo cấu trúc "what -> why -> edge case -> fix".

## Map 4: closure mental model
### Tổng Quan
Sơ đồ closure mental model giúp bạn nhìn nhanh mối quan hệ giữa runtime behavior và code execution.
### Giải thích
- Điểm nhớ 1: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 2: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 3: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 4: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 5: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 6: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 7: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 8: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 9: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 10: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 11: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 12: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
### Ví dụ
```text
outer() executes
  creates variable: secret = 42
  returns function reveal()

outer frame is gone from stack
BUT closure keeps [[Environment]] reference
reveal() can still read secret
```
```ts
// mini code example linked to concept
const tasks: string[] = [];
Promise.resolve().then(() => tasks.push("microtask"));
setTimeout(() => tasks.push("macrotask"), 0);
tasks.push("sync");
```
- Interview articulation 1: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 2: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 3: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 4: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 5: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 6: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 7: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 8: trả lời theo cấu trúc "what -> why -> edge case -> fix".

## Map 5: promise states diagram
### Tổng Quan
Sơ đồ promise states diagram giúp bạn nhìn nhanh mối quan hệ giữa runtime behavior và code execution.
### Giải thích
- Điểm nhớ 1: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 2: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 3: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 4: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 5: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 6: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 7: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 8: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 9: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 10: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 11: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
- Điểm nhớ 12: diễn giải từng node/edge trong sơ đồ để trả lời câu hỏi follow-up.
### Ví dụ
```text
           ┌──────────┐
           │ pending  │
           └────┬─────┘
        resolve │ reject
               ▼ ▼
      ┌──────────┐  ┌──────────┐
      │ fulfilled│  │ rejected │
      └──────────┘  └──────────┘
(one-way transition, no rollback)
```
```ts
// mini code example linked to concept
const tasks: string[] = [];
Promise.resolve().then(() => tasks.push("microtask"));
setTimeout(() => tasks.push("macrotask"), 0);
tasks.push("sync");
```
- Interview articulation 1: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 2: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 3: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 4: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 5: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 6: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 7: trả lời theo cấu trúc "what -> why -> edge case -> fix".
- Interview articulation 8: trả lời theo cấu trúc "what -> why -> edge case -> fix".

## Câu Hỏi Phỏng Vấn / Interview Q&A
### 🟢 [Junior] Q1: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q2: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q3: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q4: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q5: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q6: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q7: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q8: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q9: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q10: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q11: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q12: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q13: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q14: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q15: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q16: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q17: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q18: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q19: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q20: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q21: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q22: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q23: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q24: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q25: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q26: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q27: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q28: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q29: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q30: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q31: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q32: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q33: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q34: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q35: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q36: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q37: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q38: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q39: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q40: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q41: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q42: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q43: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q44: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q45: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q46: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q47: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q48: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q49: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q50: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q51: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q52: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q53: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q54: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q55: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q56: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q57: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q58: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q59: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q60: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q61: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q62: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q63: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q64: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q65: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q66: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q67: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q68: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q69: Explain closure mental model to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q70: Explain promise states diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟡 [Mid] Q71: Explain event loop visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🔴 [Senior] Q72: Explain prototype chain diagram to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
### 🟢 [Junior] Q73: Explain scope chain visualization to a teammate in 2 minutes.
- **Answer (EN):** Start with model, then walk one real execution trace.
- **Trả lời (VI):** Bắt đầu bằng mô hình, sau đó chạy một luồng thực thi cụ thể và nêu bẫy thường gặp.
- **Ví dụ:** So sánh microtask queue và macrotask queue khi có Promise + setTimeout.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
- Memory cue: dùng sơ đồ ASCII để ôn tập nhanh 10 phút trước vòng phỏng vấn.
