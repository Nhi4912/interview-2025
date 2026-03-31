---
layout: page
title: "Read N Characters Given read4 II - Call Multiple Times"
difficulty: Hard
category: Array
tags: [Array, Simulation, Interactive]
leetcode_url: "https://leetcode.com/problems/read-n-characters-given-read4-ii-call-multiple-times"
---

# Read N Characters Given read4 II - Call Multiple Times / Đọc N Ký Tự Dùng read4 II - Gọi Nhiều Lần

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Buffer / Stateful Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng bạn đọc sách qua cửa sổ nhỏ 4 chữ một lần. Khi bạn đọc xong và trả lại, có thể vẫn còn chữ thừa trong cửa sổ mà bạn chưa dùng. Lần đọc sau, bạn phải dùng hết phần thừa đó trước khi mở cửa sổ mới. Đây là bài **stateful buffer** — phải lưu trạng thái giữa các lần gọi.

**Pattern Recognition:**

- Khác với "read once": phải duy trì internal buffer giữa các lần gọi
- 3 thành phần cần track: `buf4` (internal buffer), `buf4Size` (chars in buf4), `buf4Idx` (current read pos)
- Mỗi lần `read(buf, n)`: drain buffer trước, rồi gọi `read4()` thêm nếu cần

**Visual:**

```
File: "abcdefgh" (8 chars)
Call 1: read(buf, 1) → n=1
  buf4 = read4() = "abcd", buf4Size=4, buf4Idx=0
  copy buf4[0]='a' → buf[0], buf4Idx=1
  return 1  (buf4 still has "bcd" buffered)

Call 2: read(buf, 2) → n=2
  Drain buffer: buf4[1]='b' → buf[0], buf4[2]='c' → buf[1], buf4Idx=3
  return 2  (buf4 still has "d" at idx=3)

Call 3: read(buf, 5) → n=5
  Drain buffer: buf4[3]='d' → buf[0]
  Need 4 more: read4()="efgh", buf4Size=4, buf4Idx=0
  copy all 4: buf=[d,e,f,g,h?]  → 4 more chars, total=5
  return 5
```

## Problem Description

The API `read4(buf4)` reads 4 consecutive characters from a file into `buf4` and returns the number of characters read. Implement `read(buf, n)` that reads **n** characters from the file, where `read` may be called **multiple times**. Return the number of characters actually read.

**Example 1:** File="abc", calls: `read(buf,1)→1`, `read(buf,2)→2`, `read(buf,1)→0`

**Example 2:** File="abc", calls: `read(buf,4)→3`, `read(buf,1)→0`

**Constraints:** `1 <= file.length <= 500`, file has English letters & digits, `1 <= queries.length <= 10`, `1 <= queries[i] <= 500`.

## 📝 Interview Tips

1. **Clarify**: Gọi nhiều lần — phải persist state giữa các calls, khác với "gọi 1 lần".
2. **Approach**: Instance-level buffer: `buf4[4]`, `buf4Size`, `buf4Idx` — không dùng biến local.
3. **Edge cases**: File ngắn hơn n → return actual chars; buffer có sẵn từ lần trước → dùng hết trước.
4. **Optimize**: O(n) per call, cannot do better since must copy n chars; state kept in class fields.
5. **Test**: Gọi nhiều lần với tổng > file.length → cuối cùng return 0 (EOF).
6. **Follow-up**: Thread-safe version? → Need mutex around buffer access between threads.

## Solutions

```typescript
// read4 API signature (provided by the system)
declare function read4(buf4: string[]): number;

/** Solution 1: Class-based stateful buffer — canonical solution
 * Time: O(n) per call | Space: O(1) — fixed 4-char internal buffer
 */
class Solution {
  private buf4: string[] = new Array(4).fill("");
  private buf4Size = 0; // total chars in buf4 from last read4()
  private buf4Idx = 0; // next char to read from buf4

  read(buf: string[], n: number): number {
    let bytesRead = 0;

    while (bytesRead < n) {
      // If internal buffer is exhausted, refill from read4
      if (this.buf4Idx === this.buf4Size) {
        this.buf4Size = read4(this.buf4);
        this.buf4Idx = 0;
        if (this.buf4Size === 0) break; // EOF reached
      }

      // Copy from internal buffer to output buf
      buf[bytesRead++] = this.buf4[this.buf4Idx++];
    }

    return bytesRead;
  }
}

/** Solution 2: Functional closure version — same logic without class
 * Time: O(n) per call | Space: O(1)
 */
function createReader() {
  const buf4: string[] = new Array(4).fill("");
  let size = 0;
  let idx = 0;

  return function read(buf: string[], n: number): number {
    let count = 0;
    while (count < n) {
      if (idx === size) {
        size = read4(buf4);
        idx = 0;
        if (size === 0) break;
      }
      buf[count++] = buf4[idx++];
    }
    return count;
  };
}

/** Solution 3: Queue-based — for interview clarity
 * Time: O(n) per call | Space: O(1)
 */
class SolutionQueue {
  private queue: string[] = [];

  read(buf: string[], n: number): number {
    let i = 0;
    while (i < n) {
      if (this.queue.length === 0) {
        // Refill from read4
        const tmp: string[] = new Array(4).fill("");
        const cnt = read4(tmp);
        if (cnt === 0) break;
        for (let j = 0; j < cnt; j++) this.queue.push(tmp[j]);
      }
      buf[i++] = this.queue.shift()!;
    }
    return i;
  }
}

// === Simulation for testing (read4 mock) ===
function simulateReads(fileContent: string, queries: number[]): number[] {
  let filePos = 0;

  // Mock read4
  const mockRead4 = (buf4: string[]): number => {
    let count = 0;
    while (count < 4 && filePos < fileContent.length) {
      buf4[count++] = fileContent[filePos++];
    }
    return count;
  };

  // Override read4 for test (in real LeetCode, read4 is injected)
  const buf4: string[] = new Array(4).fill("");
  let buf4Size = 0,
    buf4Idx = 0;

  const results: number[] = [];
  for (const n of queries) {
    const buf: string[] = new Array(n).fill("");
    let bytesRead = 0;
    while (bytesRead < n) {
      if (buf4Idx === buf4Size) {
        buf4Size = mockRead4(buf4);
        buf4Idx = 0;
        if (buf4Size === 0) break;
      }
      buf[bytesRead++] = buf4[buf4Idx++];
    }
    results.push(bytesRead);
  }
  return results;
}

// Test cases
console.log(simulateReads("abc", [1, 2, 1])); // [1, 2, 0]
console.log(simulateReads("abc", [4, 1])); // [3, 0]
console.log(simulateReads("abcdef", [1, 1, 1, 1, 1, 1, 1])); // [1,1,1,1,1,1,0]
```

## 🔗 Related Problems

| Problem                                                                                          | Relationship                                        |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| [Read N Characters Given Read4](https://leetcode.com/problems/read-n-characters-given-read4)     | Simpler single-call version; no buffer state needed |
| [Design Hit Counter](https://leetcode.com/problems/design-hit-counter)                           | Stateful class with persistent data between calls   |
| [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream) | Stateful design with fixed-size internal buffer     |
