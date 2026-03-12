---
layout: page
title: "Flatten 2D Vector"
difficulty: Easy
category: Design
tags: [Design, Two Pointers]
leetcode_url: "https://leetcode.com/problems/flatten-2d-vector/"
---

# Flatten 2D Vector



## Problem Description

 *  * Design an iterator to flatten a 2D vector. It should support the following operations:  * - next and hasNext.  *  * Implement the Vector2D class: 

## Solutions

{% raw %}
/**
 * Flatten 2D Vector
 *
 * Problem: https://leetcode.com/problems/flatten-2d-vector/
 *
 * Design an iterator to flatten a 2D vector. It should support the following operations:
 * - next and hasNext.
 *
 * Implement the Vector2D class:
 * - Vector2D(int[][] vec) initializes the object with the 2D vector vec.
 * - int next() returns the next element from the 2D vector and moves the pointer one step forward.
 * - boolean hasNext() returns true if there are still some elements in the vector, and false otherwise.
 *
 * Example 1:
 * Input: ["Vector2D", "next", "next", "next", "hasNext", "hasNext", "next", "hasNext"]
 * [[[[1, 2], [3], [4]]], [], [], [], [], [], [], []]
 * Output: [null, 1, 2, 3, true, true, 4, false]
 *
 * Explanation:
 * Vector2D vector2D = new Vector2D([[1, 2], [3], [4]]);
 * vector2D.next();    // return 1
 * vector2D.next();    // return 2
 * vector2D.next();    // return 3
 * vector2D.hasNext(); // return True
 * vector2D.hasNext(); // return True
 * vector2D.next();    // return 4
 * vector2D.hasNext(); // return False
 *
 * Constraints:
 * - 0 <= vec.length <= 200
 * - 0 <= vec[i].length <= 500
 * - -1000 <= vec[i][j] <= 1000
 * - At most 10^5 calls will be made to next and hasNext in total.
 *
 * Solution Approach:
 * 1. Store the 2D vector and current position
 * 2. Use two pointers: outer index for rows, inner index for columns
 * 3. Skip empty rows when moving to next element
 * 4. Update pointers after each next() call
 *
 * Time Complexity: O(1) average for next() and hasNext()
 * Space Complexity: O(1) extra space
 */

/**
 * Vector2D class for flattening 2D vector
 *
 * Lớp Vector2D để làm phẳng vector 2D
 */
class Vector2D {
  private vec: number[][];
  private outerIndex: number;
  private innerIndex: number;

  constructor(vec: number[][]) {
    this.vec = vec;
    this.outerIndex = 0;
    this.innerIndex = 0;

    // Move to first non-empty row
    this.moveToNext();
  }

  /**
   * Move to the next valid position
   *
   * Di chuyển đến vị trí hợp lệ tiếp theo
   */
  private moveToNext(): void {
    // Skip empty rows
    while (
      this.outerIndex < this.vec.length &&
      this.innerIndex >= this.vec[this.outerIndex].length
    ) {
      this.outerIndex++;
      this.innerIndex = 0;
    }
  }

  /**
   * Get the next element from the 2D vector
   *
   * Lấy phần tử tiếp theo từ vector 2D
   *
   * @returns Phần tử tiếp theo
   */
  next(): number {
    if (!this.hasNext()) {
      throw new Error("No more elements");
    }

    const result = this.vec[this.outerIndex][this.innerIndex];
    this.innerIndex++;

    // Move to next valid position
    this.moveToNext();

    return result;
  }

  /**
   * Check if there are more elements
   *
   * Kiểm tra xem còn phần tử nào không
   *
   * @returns true nếu còn phần tử, false nếu không
   */
  hasNext(): boolean {
    return (
      this.outerIndex < this.vec.length &&
      this.innerIndex < this.vec[this.outerIndex].length
    );
  }
}

/**
 * Alternative Implementation: Using Queue
 *
 * Giải pháp thay thế: Sử dụng Queue
 */
class Vector2DQueue {
  private queue: number[];

  constructor(vec: number[][]) {
    this.queue = [];

    // Flatten the 2D vector into a queue
    for (const row of vec) {
      for (const element of row) {
        this.queue.push(element);
      }
    }
  }

  next(): number {
    if (!this.hasNext()) {
      throw new Error("No more elements");
    }

    return this.queue.shift()!;
  }

  hasNext(): boolean {
    return this.queue.length > 0;
  }
}

/**
 * Implementation with Reset Functionality
 *
 * Giải pháp với chức năng đặt lại
 */
class Vector2DWithReset {
  private vec: number[][];
  private outerIndex: number;
  private innerIndex: number;
  private originalOuterIndex: number;
  private originalInnerIndex: number;

  constructor(vec: number[][]) {
    this.vec = vec;
    this.outerIndex = 0;
    this.innerIndex = 0;
    this.originalOuterIndex = 0;
    this.originalInnerIndex = 0;

    this.moveToNext();
  }

  private moveToNext(): void {
    while (
      this.outerIndex < this.vec.length &&
      this.innerIndex >= this.vec[this.outerIndex].length
    ) {
      this.outerIndex++;
      this.innerIndex = 0;
    }
  }

  next(): number {
    if (!this.hasNext()) {
      throw new Error("No more elements");
    }

    const result = this.vec[this.outerIndex][this.innerIndex];
    this.innerIndex++;

    this.moveToNext();

    return result;
  }

  hasNext(): boolean {
    return (
      this.outerIndex < this.vec.length &&
      this.innerIndex < this.vec[this.outerIndex].length
    );
  }

  /**
   * Reset the iterator to the beginning
   *
   * Đặt lại iterator về đầu
   */
  reset(): void {
    this.outerIndex = this.originalOuterIndex;
    this.innerIndex = this.originalInnerIndex;
    this.moveToNext();
  }

  /**
   * Get current position
   *
   * Lấy vị trí hiện tại
   */
  getCurrentPosition(): { outer: number; inner: number } {
    return { outer: this.outerIndex, inner: this.innerIndex };
  }
}

/**
 * Implementation with Peek Functionality
 *
 * Giải pháp với chức năng xem trước
 */
class Vector2DWithPeek {
  private vec: number[][];
  private outerIndex: number;
  private innerIndex: number;

  constructor(vec: number[][]) {
    this.vec = vec;
    this.outerIndex = 0;
    this.innerIndex = 0;

    this.moveToNext();
  }

  private moveToNext(): void {
    while (
      this.outerIndex < this.vec.length &&
      this.innerIndex >= this.vec[this.outerIndex].length
    ) {
      this.outerIndex++;
      this.innerIndex = 0;
    }
  }

  next(): number {
    if (!this.hasNext()) {
      throw new Error("No more elements");
    }

    const result = this.vec[this.outerIndex][this.innerIndex];
    this.innerIndex++;

    this.moveToNext();

    return result;
  }

  hasNext(): boolean {
    return (
      this.outerIndex < this.vec.length &&
      this.innerIndex < this.vec[this.outerIndex].length
    );
  }

  /**
   * Peek at the next element without moving the pointer
   *
   * Xem phần tử tiếp theo mà không di chuyển con trỏ
   *
   * @returns Phần tử tiếp theo hoặc null nếu không có
   */
  peek(): number | null {
    if (!this.hasNext()) {
      return null;
    }

    return this.vec[this.outerIndex][this.innerIndex];
  }
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Flatten 2D Vector Tests ===");
  console.log("=== Kiểm thử bài toán Làm phẳng Vector 2D ===\n");

  const testCases = [
    {
      name: "Example 1: Basic case",
      input: [[1, 2], [3], [4]],
      description: "Standard 2D vector with mixed row lengths",
    },
    {
      name: "Empty vector",
      input: [],
      description: "Empty 2D vector",
    },
    {
      name: "Single element",
      input: [[5]],
      description: "Vector with single element",
    },
    {
      name: "Empty rows",
      input: [[], [1, 2], [], [3], []],
      description: "Vector with empty rows",
    },
    {
      name: "All empty rows",
      input: [[], [], []],
      description: "Vector with all empty rows",
    },
    {
      name: "Large vector",
      input: [[1, 2, 3], [4, 5], [6], [7, 8, 9, 10]],
      description: "Vector with multiple rows of different lengths",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: ${JSON.stringify(testCase.input)}`);
    console.log(`Description: ${testCase.description}`);

    const vector2D = new Vector2D(testCase.input);

    console.log("Iteration results:");
    console.log("Kết quả lặp:");
    let count = 0;
    while (vector2D.hasNext() && count < 20) {
      // Limit to prevent infinite loop
      const element = vector2D.next();
      console.log(`  ${count + 1}. ${element}`);
      count++;
    }

    if (!vector2D.hasNext()) {
      console.log("  No more elements");
    }

    console.log("---");
  }

  // Test with reset functionality
  console.log("\n=== Testing with Reset Functionality ===");
  console.log("=== Kiểm thử với chức năng đặt lại ===\n");

  const testVector = [[1, 2], [3], [4]];
  const vectorWithReset = new Vector2DWithReset(testVector);

  console.log("First iteration:");
  console.log("Lần lặp đầu tiên:");
  while (vectorWithReset.hasNext()) {
    console.log(`  ${vectorWithReset.next()}`);
  }

  console.log("\nResetting...");
  console.log("Đang đặt lại...");
  vectorWithReset.reset();

  console.log("Second iteration after reset:");
  console.log("Lần lặp thứ hai sau khi đặt lại:");
  while (vectorWithReset.hasNext()) {
    console.log(`  ${vectorWithReset.next()}`);
  }

  // Test with peek functionality
  console.log("\n=== Testing with Peek Functionality ===");
  console.log("=== Kiểm thử với chức năng xem trước ===\n");

  const vectorWithPeek = new Vector2DWithPeek([[1, 2], [3], [4]]);

  console.log("Peeking without consuming:");
  console.log("Xem trước mà không tiêu thụ:");
  while (vectorWithPeek.hasNext()) {
    const peeked = vectorWithPeek.peek();
    const next = vectorWithPeek.next();
    console.log(`  Peeked: ${peeked}, Next: ${next}`);
  }

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeVector = Array.from({ length: 1000 }, (_, i) =>
    Array.from(
      { length: Math.floor(Math.random() * 10) + 1 },
      (_, j) => i * 1000 + j
    )
  );

  console.log("Testing with large vector (1000 rows)...");
  console.log("Kiểm thử với vector lớn (1000 hàng)...");

  const start1 = performance.now();
  const vector1 = new Vector2D(largeVector);
  let count1 = 0;
  while (vector1.hasNext()) {
    vector1.next();
    count1++;
  }
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const vector2 = new Vector2DQueue(largeVector);
  let count2 = 0;
  while (vector2.hasNext()) {
    vector2.next();
    count2++;
  }
  const time2 = performance.now() - start2;

  console.log(`Two Pointers: ${time1.toFixed(4)}ms, ${count1} elements`);
  console.log(`Queue: ${time2.toFixed(4)}ms, ${count2} elements`);
  console.log(`Results match: ${count1 === count2 ? "✅ Yes" : "❌ No"}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { Vector2D, Vector2DQueue, Vector2DWithReset, Vector2DWithPeek };
{% endraw %}
