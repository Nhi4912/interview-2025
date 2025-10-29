# Concurrency & Parallelism Theory
## Understanding Concurrent and Parallel Computing

**English:** Concurrency is about dealing with multiple tasks at once, while parallelism is about executing multiple tasks simultaneously. Both are essential for modern software performance.

**Tiếng Việt:** Đồng thời (concurrency) là về việc xử lý nhiều tác vụ cùng lúc, trong khi song song (parallelism) là về việc thực thi nhiều tác vụ đồng thời. Cả hai đều quan trọng cho hiệu suất phần mềm hiện đại.

## Table of Contents
1. [Concurrency vs Parallelism](#concurrency-vs-parallelism)
2. [Processes and Threads](#processes-and-threads)
3. [Synchronization Primitives](#synchronization-primitives)
4. [Race Conditions and Deadlocks](#race-conditions-and-deadlocks)
5. [Concurrency Models](#concurrency-models)
6. [JavaScript Concurrency](#javascript-concurrency)
7. [Web Workers](#web-workers)
8. [Async Patterns](#async-patterns)
9. [Performance Considerations](#performance-considerations)

## Concurrency vs Parallelism

### Definitions

**Concurrency:**
- Multiple tasks making progress
- May not execute simultaneously
- About structure and composition
- Single core can be concurrent

**Parallelism:**
- Multiple tasks executing simultaneously
- Requires multiple cores/processors
- About execution
- Subset of concurrency
