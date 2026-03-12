---
layout: page
title: "Set Matrix Zeroe"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/set-matrix-zeroe/"
---

# Set Matrix Zeroe

**LeetCode Problem # * 73. Set Matrix Zeroes**

## Problem Description

 * Given an m x n integer matrix matrix, if an element is 0, set its entire row  * and column to 0's.  *  * You must do it in place.  * 

## Solutions

{% raw %}
/**
 * 73. Set Matrix Zeroes
 *
 * Problem:
 * Given an m x n integer matrix matrix, if an element is 0, set its entire row
 * and column to 0's.
 *
 * You must do it in place.
 *
 * Example:
 * Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
 * Output: [[1,0,1],[0,0,0],[1,0,1]]
 *
 * Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
 * Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
 *
 * LeetCode: https://leetcode.com/problems/set-matrix-zeroes/
 */

/**
 * Solution 1: Using First Row and Column as Markers (Optimal)
 *
 * Approach:
 * - Use first row and column to mark which rows/columns should be zeroed
 * - Use additional variable for first row
 *
 * Time Complexity: O(m * n)
 * Space Complexity: O(1)
 */
function setZeroes(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;
  let firstRowHasZero = false;
  let firstColHasZero = false;

  // Check if first row has zero
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowHasZero = true;
      break;
    }
  }

  // Check if first column has zero
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColHasZero = true;
      break;
    }
  }

  // Use first row and column as markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  // Set zeros based on markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // Set first row to zero if needed
  if (firstRowHasZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }

  // Set first column to zero if needed
  if (firstColHasZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }
}

/**
 * Solution 2: Using Extra Arrays
 *
 * Approach:
 * - Use separate arrays to track rows and columns to zero
 * - Simple but uses extra space
 *
 * Time Complexity: O(m * n)
 * Space Complexity: O(m + n)
 */
function setZeroesExtraSpace(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;
  const rowsToZero = new Array(m).fill(false);
  const colsToZero = new Array(n).fill(false);

  // Mark rows and columns to zero
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) {
        rowsToZero[i] = true;
        colsToZero[j] = true;
      }
    }
  }

  // Set zeros
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rowsToZero[i] || colsToZero[j]) {
        matrix[i][j] = 0;
      }
    }
  }
}

/**
 * Solution 3: Using Sets
 *
 * Approach:
 * - Use Sets to track rows and columns to zero
 * - More memory efficient than arrays for sparse matrices
 *
 * Time Complexity: O(m * n)
 * Space Complexity: O(m + n)
 */
function setZeroesSet(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;
  const rowsToZero = new Set<number>();
  const colsToZero = new Set<number>();

  // Mark rows and columns to zero
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) {
        rowsToZero.add(i);
        colsToZero.add(j);
      }
    }
  }

  // Set zeros
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rowsToZero.has(i) || colsToZero.has(j)) {
        matrix[i][j] = 0;
      }
    }
  }
}

/**
 * Solution 4: Using Map
 *
 * Approach:
 * - Use Map to track rows and columns to zero
 * - More flexible than arrays
 *
 * Time Complexity: O(m * n)
 * Space Complexity: O(m + n)
 */
function setZeroesMap(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;
  const rowsToZero = new Map<number, boolean>();
  const colsToZero = new Map<number, boolean>();

  // Mark rows and columns to zero
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) {
        rowsToZero.set(i, true);
        colsToZero.set(j, true);
      }
    }
  }

  // Set zeros
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rowsToZero.has(i) || colsToZero.has(j)) {
        matrix[i][j] = 0;
      }
    }
  }
}

/**
 * Solution 5: Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(m * n)
 * Space Complexity: O(m + n)
 */
function setZeroesFunctional(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;

  // Find zero positions
  const zeroPositions = matrix.flatMap((row, i) =>
    row.map((cell, j) => (cell === 0 ? [i, j] : null)).filter(Boolean)
  );

  // Get unique rows and columns to zero
  const rowsToZero = new Set(zeroPositions.map(([i, _]) => i));
  const colsToZero = new Set(zeroPositions.map(([_, j]) => j));

  // Set zeros
  matrix.forEach((row, i) => {
    row.forEach((_, j) => {
      if (rowsToZero.has(i) || colsToZero.has(j)) {
        matrix[i][j] = 0;
      }
    });
  });
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield zero positions
 * - Memory efficient for large matrices
 *
 * Time Complexity: O(m * n)
 * Space Complexity: O(m + n)
 */
function* zeroPositionGenerator(
  matrix: number[][]
): Generator<[number, number]> {
  const m = matrix.length;
  const n = matrix[0].length;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) {
        yield [i, j];
      }
    }
  }
}

function setZeroesGenerator(matrix: number[][]): void {
  const rowsToZero = new Set<number>();
  const colsToZero = new Set<number>();

  // Collect zero positions
  for (const [i, j] of zeroPositionGenerator(matrix)) {
    rowsToZero.add(i);
    colsToZero.add(j);
  }

  // Set zeros
  const m = matrix.length;
  const n = matrix[0].length;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rowsToZero.has(i) || colsToZero.has(j)) {
        matrix[i][j] = 0;
      }
    }
  }
}

/**
 * Solution 7: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a MatrixZeroSetter class
 * - Encapsulate zero-setting logic
 *
 * Time Complexity: O(m * n)
 * Space Complexity: O(1)
 */
class MatrixZeroSetter {
  private matrix: number[][];
  private m: number;
  private n: number;

  constructor(matrix: number[][]) {
    this.matrix = matrix;
    this.m = matrix.length;
    this.n = matrix[0].length;
  }

  setZeroes(): void {
    let firstRowHasZero = false;
    let firstColHasZero = false;

    // Check first row
    for (let j = 0; j < this.n; j++) {
      if (this.matrix[0][j] === 0) {
        firstRowHasZero = true;
        break;
      }
    }

    // Check first column
    for (let i = 0; i < this.m; i++) {
      if (this.matrix[i][0] === 0) {
        firstColHasZero = true;
        break;
      }
    }

    // Use first row and column as markers
    for (let i = 1; i < this.m; i++) {
      for (let j = 1; j < this.n; j++) {
        if (this.matrix[i][j] === 0) {
          this.matrix[i][0] = 0;
          this.matrix[0][j] = 0;
        }
      }
    }

    // Set zeros based on markers
    for (let i = 1; i < this.m; i++) {
      for (let j = 1; j < this.n; j++) {
        if (this.matrix[i][0] === 0 || this.matrix[0][j] === 0) {
          this.matrix[i][j] = 0;
        }
      }
    }

    // Set first row
    if (firstRowHasZero) {
      for (let j = 0; j < this.n; j++) {
        this.matrix[0][j] = 0;
      }
    }

    // Set first column
    if (firstColHasZero) {
      for (let i = 0; i < this.m; i++) {
        this.matrix[i][0] = 0;
      }
    }
  }

  getMatrix(): number[][] {
    return this.matrix.map((row) => [...row]);
  }
}

function setZeroesClass(matrix: number[][]): void {
  const setter = new MatrixZeroSetter(matrix);
  setter.setZeroes();
}

/**
 * Solution 8: Using Bit Manipulation (Limited use case)
 *
 * Approach:
 * - Use bit flags for small matrices
 * - Limited to small matrices due to integer size
 *
 * Time Complexity: O(m * n)
 * Space Complexity: O(1)
 */
function setZeroesBitwise(matrix: number[][]): void {
  const m = matrix.length;
  const n = matrix[0].length;

  if (m > 32 || n > 32) {
    // Fallback to standard approach for large matrices
    setZeroes(matrix);
    return;
  }

  let rowFlags = 0;
  let colFlags = 0;

  // Set flags for rows and columns with zeros
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) {
        rowFlags |= 1 << i;
        colFlags |= 1 << j;
      }
    }
  }

  // Set zeros based on flags
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rowFlags & (1 << i) || colFlags & (1 << j)) {
        matrix[i][j] = 0;
      }
    }
  }
}

// Helper functions
function printMatrix(matrix: number[][]): string {
  return matrix.map((row) => `[${row.join(", ")}]`).join("\n");
}

function createTestMatrix(m: number, n: number): number[][] {
  return Array.from({ length: m }, (_, i) =>
    Array.from({ length: n }, (_, j) => i * n + j + 1)
  );
}

// Test cases
function testSetMatrixZeroes() {
  console.log("=== Testing Set Matrix Zeroes ===\n");

  const testCases = [
    {
      input: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
      expected: [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
      ],
      description: "3x3 matrix with center zero",
    },
    {
      input: [
        [0, 1, 2, 0],
        [3, 4, 5, 2],
        [1, 3, 1, 5],
      ],
      expected: [
        [0, 0, 0, 0],
        [0, 4, 5, 0],
        [0, 3, 1, 0],
      ],
      description: "3x4 matrix with edge zeros",
    },
    {
      input: [[1, 0]],
      expected: [[0, 0]],
      description: "1x2 matrix",
    },
    {
      input: [[1], [0]],
      expected: [[0], [0]],
      description: "2x1 matrix",
    },
    {
      input: [[0]],
      expected: [[0]],
      description: "1x1 matrix with zero",
    },
    {
      input: [[1]],
      expected: [[1]],
      description: "1x1 matrix without zero",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input:\n${printMatrix(testCase.input)}`);
    console.log(`Expected:\n${printMatrix(testCase.expected)}\n`);

    // Test Solution 1 (First Row/Column Markers)
    const matrix1 = testCase.input.map((row) => [...row]);
    setZeroes(matrix1);
    console.log(`Solution 1 (Markers):\n${printMatrix(matrix1)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 2 (Extra Space)
    const matrix2 = testCase.input.map((row) => [...row]);
    setZeroesExtraSpace(matrix2);
    console.log(`Solution 2 (Extra Space):\n${printMatrix(matrix2)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 3 (Set)
    const matrix3 = testCase.input.map((row) => [...row]);
    setZeroesSet(matrix3);
    console.log(`Solution 3 (Set):\n${printMatrix(matrix3)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 4 (Map)
    const matrix4 = testCase.input.map((row) => [...row]);
    setZeroesMap(matrix4);
    console.log(`Solution 4 (Map):\n${printMatrix(matrix4)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 5 (Functional)
    const matrix5 = testCase.input.map((row) => [...row]);
    setZeroesFunctional(matrix5);
    console.log(`Solution 5 (Functional):\n${printMatrix(matrix5)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 6 (Generator)
    const matrix6 = testCase.input.map((row) => [...row]);
    setZeroesGenerator(matrix6);
    console.log(`Solution 6 (Generator):\n${printMatrix(matrix6)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 7 (Class)
    const matrix7 = testCase.input.map((row) => [...row]);
    setZeroesClass(matrix7);
    console.log(`Solution 7 (Class):\n${printMatrix(matrix7)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 8 (Bitwise)
    const matrix8 = testCase.input.map((row) => [...row]);
    setZeroesBitwise(matrix8);
    console.log(`Solution 8 (Bitwise):\n${printMatrix(matrix8)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    console.log("---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Markers", func: setZeroes },
    { name: "Extra Space", func: setZeroesExtraSpace },
    { name: "Set", func: setZeroesSet },
    { name: "Map", func: setZeroesMap },
    { name: "Functional", func: setZeroesFunctional },
    { name: "Generator", func: setZeroesGenerator },
    { name: "Class", func: setZeroesClass },
    { name: "Bitwise", func: setZeroesBitwise },
  ];

  // Create test matrices
  const smallMatrix = createTestMatrix(5, 5);
  const mediumMatrix = createTestMatrix(20, 20);
  const largeMatrix = createTestMatrix(50, 50);

  // Add some zeros
  smallMatrix[2][2] = 0;
  mediumMatrix[5][5] = 0;
  mediumMatrix[10][10] = 0;
  largeMatrix[10][10] = 0;
  largeMatrix[20][20] = 0;
  largeMatrix[30][30] = 0;

  const matrices = [
    { name: "Small (5x5)", matrix: smallMatrix },
    { name: "Medium (20x20)", matrix: mediumMatrix },
    { name: "Large (50x50)", matrix: largeMatrix },
  ];

  matrices.forEach(({ name, matrix }) => {
    console.log(`${name} Matrix:`);

    testCases.forEach(({ name: funcName, func }) => {
      const testMatrix = matrix.map((row) => [...row]);
      const start = performance.now();
      func(testMatrix);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testSetMatrixZeroes();
// performanceComparison();

export {
  setZeroes,
  setZeroesExtraSpace,
  setZeroesSet,
  setZeroesMap,
  setZeroesFunctional,
  setZeroesGenerator,
  setZeroesClass,
  setZeroesBitwise,
  MatrixZeroSetter,
  zeroPositionGenerator,
  printMatrix,
  createTestMatrix,
  testSetMatrixZeroes,
  performanceComparison,
};
{% endraw %}
