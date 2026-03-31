---
layout: page
title: "Read N Characters Given Read4"
difficulty: Easy
category: Array
tags: [Array, Simulation, Interactive]
leetcode_url: "https://leetcode.com/problems/read-n-characters-given-read4"
---

# Read N Characters Given Read4 / Đọc N Ký Tự Với API Read4

> **Difficulty**: 🟢 Easy | **Category**: Array | **Pattern**: API Simulation / Buffer Management

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như múc nước từ giếng bằng gàu 4 lít — bạn cần lấy đúng N lít, nên mỗi lần múc 4 lít rồi đổ vào bình, dừng khi bình đủ hoặc giếng cạn.

**Pattern Recognition:**

- Read in chunks of 4; accumulate until n characters collected or source exhausted
- Total chars copied = min(n, fileLength)
- Handle partial last bucket (read4 may return < 4 at EOF)

**Visual:**

```
file = "abcdefgh" (8 chars), n = 5
buf4 = []

Call read4 → buf4="abcd" (4), copy min(4, 5-0)=4 to buf → buf="abcd", total=4
Call read4 → buf4="efgh" (4), copy min(4, 5-4)=1 to buf → buf="abcde", total=5
total == n → STOP, return 5
```

## Problem Description

Given a `read4` API that reads 4 characters at a time from a file into a buffer, implement `read(buf, n)` that reads exactly `n` characters from the file into `buf`. `read4` returns the actual number of characters read (≤ 4); it returns 0 at EOF.

**Example 1:** File `"abcde"`, n=5 → `buf="abcde"`, return 5
**Example 2:** File `"abcde"`, n=3 → `buf="abc"`, return 3

**Constraints:** `1 ≤ n ≤ 500`, file has at most 500 characters, called only once

## 📝 Interview Tips

1. **Clarify**: Is `read` called once or multiple times? (This version: once — the II version is multiple calls)
2. **Approach**: Loop: call read4, copy min(read4result, remaining) chars into buf
3. **Edge cases**: n > file length, n < 4, empty file
4. **Optimize**: Already optimal O(n/4) calls to read4
5. **Follow-up**: What if read() can be called multiple times? (need internal buffer state)
6. **Complexity**: Time O(n), Space O(1) extra

## Solutions

```typescript
// Simulated read4 for testing
function makeRead4(file: string) {
  let pos = 0;
  return function read4(buf4: string[]): number {
    let count = 0;
    while (count < 4 && pos < file.length) {
      buf4[count++] = file[pos++];
    }
    return count;
  };
}

// Solution 1: Chunked copy — Time: O(n) | Space: O(1)
function buildRead(file: string) {
  const read4 = makeRead4(file);

  return function read(buf: string[], n: number): number {
    let total = 0;
    const buf4: string[] = new Array(4);

    while (total < n) {
      const count = read4(buf4);
      if (count === 0) break; // EOF

      const toCopy = Math.min(count, n - total);
      for (let i = 0; i < toCopy; i++) {
        buf[total + i] = buf4[i];
      }
      total += toCopy;

      if (count < 4) break; // last chunk
    }

    return total;
  };
}

// Solution 2: While-loop with explicit EOF check — Time: O(n) | Space: O(1)
function buildRead2(file: string) {
  const read4 = makeRead4(file);

  return function read(buf: string[], n: number): number {
    let copied = 0;
    const tmp: string[] = [];

    while (copied < n) {
      const got = read4(tmp);
      const take = Math.min(got, n - copied);
      for (let i = 0; i < take; i++) buf[copied++] = tmp[i];
      if (got < 4) break;
    }

    return copied;
  };
}

// Tests
const buf1: string[] = [];
const r1 = buildRead("abcde");
console.log(r1(buf1, 5), buf1.join("")); // 5 "abcde"

const buf2: string[] = [];
const r2 = buildRead("abcde");
console.log(r2(buf2, 3), buf2.slice(0, 3).join("")); // 3 "abc"

const buf3: string[] = [];
const r3 = buildRead("abcde");
console.log(r3(buf3, 7), buf3.join("")); // 5 "abcde" (n > file)

const buf4: string[] = [];
const r4 = buildRead2("leetcode");
console.log(r4(buf4, 4), buf4.slice(0, 4).join("")); // 4 "leet"

const buf5: string[] = [];
const r5 = buildRead("");
console.log(r5(buf5, 5)); // 0
```

## 🔗 Related Problems

| Problem                                                                                                                                | Relationship                          |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Read N Characters Given Read4 II (LeetCode 158)](https://leetcode.com/problems/read-n-characters-given-read4-ii-call-multiple-times/) | Same but read() called multiple times |
| [Iterator for Combination (LeetCode 1286)](https://leetcode.com/problems/iterator-for-combination/)                                    | Iterator/buffer pattern               |
| [Moving Average from Data Stream (LeetCode 346)](https://leetcode.com/problems/moving-average-from-data-stream/)                       | Fixed-size buffer management          |
