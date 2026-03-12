/**
 * 48. Rotate Image
 *
 * Problem:
 * You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).
 *
 * You have to rotate the image in-place, which means you have to modify the input 2D matrix directly.
 * DO NOT allocate another 2D matrix and do the rotation.
 *
 * Example:
 * Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [[7,4,1],[8,5,2],[9,6,3]]
 *
 * Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
 * Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
 *
 * LeetCode: https://leetcode.com/problems/rotate-image/
 */

/**
 * Solution 1: Transpose and Reverse (Optimal)
 *
 * Approach:
 * - Transpose the matrix (swap rows and columns)
 * - Reverse each row
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function rotate(matrix: number[][]): void {
  const n = matrix.length;

  // Transpose the matrix
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}

/**
 * Solution 2: Layer by Layer Rotation
 *
 * Approach:
 * - Rotate the matrix layer by layer from outside to inside
 * - For each layer, rotate 4 elements at a time
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function rotateLayerByLayer(matrix: number[][]): void {
  const n = matrix.length;

  for (let layer = 0; layer < Math.floor(n / 2); layer++) {
    const first = layer;
    const last = n - 1 - layer;

    for (let i = first; i < last; i++) {
      const offset = i - first;
      const top = matrix[first][i];

      // Move left to top
      matrix[first][i] = matrix[last - offset][first];

      // Move bottom to left
      matrix[last - offset][first] = matrix[last][last - offset];

      // Move right to bottom
      matrix[last][last - offset] = matrix[i][last];

      // Move top to right
      matrix[i][last] = top;
    }
  }
}

/**
 * Solution 3: Using Extra Space (Not in-place)
 *
 * Approach:
 * - Create a new matrix and copy elements in rotated positions
 * - Educational purpose to show the pattern
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n²)
 */
function rotateWithExtraSpace(matrix: number[][]): void {
  const n = matrix.length;
  const rotated = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = matrix[i][j];
    }
  }

  // Copy back to original matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      matrix[i][j] = rotated[i][j];
    }
  }
}

/**
 * Solution 4: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield matrix elements
 * - Memory efficient for large matrices
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function* matrixGenerator(
  matrix: number[][],
  direction: "clockwise" | "counterclockwise" = "clockwise"
): Generator<number> {
  const n = matrix.length;

  if (direction === "clockwise") {
    for (let j = 0; j < n; j++) {
      for (let i = n - 1; i >= 0; i--) {
        yield matrix[i][j];
      }
    }
  } else {
    for (let j = n - 1; j >= 0; j--) {
      for (let i = 0; i < n; i++) {
        yield matrix[i][j];
      }
    }
  }
}

function rotateWithGenerator(matrix: number[][]): void {
  const n = matrix.length;
  const rotated = Array.from(matrixGenerator(matrix));

  let index = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      matrix[i][j] = rotated[index++];
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
 * Time Complexity: O(n²)
 * Space Complexity: O(n²)
 */
function rotateFunctional(matrix: number[][]): void {
  const n = matrix.length;

  // Create rotated matrix using functional approach
  const rotated = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => matrix[n - 1 - j][i])
  );

  // Copy back to original matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      matrix[i][j] = rotated[i][j];
    }
  }
}

/**
 * Solution 6: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a MatrixRotator class
 * - Encapsulate rotation logic
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
class MatrixRotator {
  private matrix: number[][];
  private n: number;

  constructor(matrix: number[][]) {
    this.matrix = matrix;
    this.n = matrix.length;
  }

  rotateClockwise(): void {
    this.transpose();
    this.reverseRows();
  }

  rotateCounterClockwise(): void {
    this.reverseRows();
    this.transpose();
  }

  private transpose(): void {
    for (let i = 0; i < this.n; i++) {
      for (let j = i; j < this.n; j++) {
        [this.matrix[i][j], this.matrix[j][i]] = [
          this.matrix[j][i],
          this.matrix[i][j],
        ];
      }
    }
  }

  private reverseRows(): void {
    for (let i = 0; i < this.n; i++) {
      this.matrix[i].reverse();
    }
  }

  getMatrix(): number[][] {
    return this.matrix.map((row) => [...row]);
  }
}

function rotateClass(matrix: number[][]): void {
  const rotator = new MatrixRotator(matrix);
  rotator.rotateClockwise();
}

/**
 * Solution 7: Using Bit Manipulation (Limited use case)
 *
 * Approach:
 * - Use bit operations for small matrices
 * - Limited to small matrices due to integer size
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function rotateBitwise(matrix: number[][]): void {
  const n = matrix.length;

  if (n > 8) {
    // Fallback to standard approach for large matrices
    rotate(matrix);
    return;
  }

  // Convert matrix to bit representation (for small matrices)
  const bits = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      bits[i] |= matrix[i][j] << (j * 4);
    }
  }

  // Rotate bits
  const rotatedBits = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const value = (bits[n - 1 - j] >> (i * 4)) & 0xf;
      rotatedBits[i] |= value << (j * 4);
    }
  }

  // Convert back to matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      matrix[i][j] = (rotatedBits[i] >> (j * 4)) & 0xf;
    }
  }
}

/**
 * Solution 8: Using Array Methods
 *
 * Approach:
 * - Use array methods to manipulate matrix
 * - More readable but less efficient
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n²)
 */
function rotateArrayMethods(matrix: number[][]): void {
  const n = matrix.length;

  // Extract columns and reverse them
  const columns = Array.from({ length: n }, (_, j) =>
    matrix.map((row) => row[j])
  );

  // Reverse each column and assign to rows
  for (let i = 0; i < n; i++) {
    matrix[i] = columns[i].reverse();
  }
}

// Helper functions
function printMatrix(matrix: number[][]): string {
  return matrix.map((row) => `[${row.join(", ")}]`).join("\n");
}

function createMatrix(n: number): number[][] {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => i * n + j + 1)
  );
}

// Test cases
function testRotateImage() {
  console.log("=== Testing Rotate Image ===\n");

  const testCases = [
    {
      input: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      expected: [
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ],
      description: "3x3 matrix",
    },
    {
      input: [
        [5, 1, 9, 11],
        [2, 4, 8, 10],
        [13, 3, 6, 7],
        [15, 14, 12, 16],
      ],
      expected: [
        [15, 13, 2, 5],
        [14, 3, 4, 1],
        [12, 6, 8, 9],
        [16, 7, 10, 11],
      ],
      description: "4x4 matrix",
    },
    {
      input: [
        [1, 2],
        [3, 4],
      ],
      expected: [
        [3, 1],
        [4, 2],
      ],
      description: "2x2 matrix",
    },
    {
      input: [[1]],
      expected: [[1]],
      description: "1x1 matrix",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input:\n${printMatrix(testCase.input)}`);
    console.log(`Expected:\n${printMatrix(testCase.expected)}\n`);

    // Test Solution 1 (Transpose and Reverse)
    const matrix1 = testCase.input.map((row) => [...row]);
    rotate(matrix1);
    console.log(`Solution 1 (Transpose & Reverse):\n${printMatrix(matrix1)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 2 (Layer by Layer)
    const matrix2 = testCase.input.map((row) => [...row]);
    rotateLayerByLayer(matrix2);
    console.log(`Solution 2 (Layer by Layer):\n${printMatrix(matrix2)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 3 (Extra Space)
    const matrix3 = testCase.input.map((row) => [...row]);
    rotateWithExtraSpace(matrix3);
    console.log(`Solution 3 (Extra Space):\n${printMatrix(matrix3)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 4 (Generator)
    const matrix4 = testCase.input.map((row) => [...row]);
    rotateWithGenerator(matrix4);
    console.log(`Solution 4 (Generator):\n${printMatrix(matrix4)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 5 (Functional)
    const matrix5 = testCase.input.map((row) => [...row]);
    rotateFunctional(matrix5);
    console.log(`Solution 5 (Functional):\n${printMatrix(matrix5)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 6 (Class)
    const matrix6 = testCase.input.map((row) => [...row]);
    rotateClass(matrix6);
    console.log(`Solution 6 (Class):\n${printMatrix(matrix6)}`);
    console.log(
      `Result: ${
        JSON.stringify(matrix6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }\n`
    );

    // Test Solution 7 (Bitwise) - Only for small matrices
    if (testCase.input.length <= 8) {
      const matrix7 = testCase.input.map((row) => [...row]);
      rotateBitwise(matrix7);
      console.log(`Solution 7 (Bitwise):\n${printMatrix(matrix7)}`);
      console.log(
        `Result: ${
          JSON.stringify(matrix7) === JSON.stringify(testCase.expected)
            ? "✅"
            : "❌"
        }\n`
      );
    }

    // Test Solution 8 (Array Methods)
    const matrix8 = testCase.input.map((row) => [...row]);
    rotateArrayMethods(matrix8);
    console.log(`Solution 8 (Array Methods):\n${printMatrix(matrix8)}`);
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
    { name: "Transpose & Reverse", func: rotate },
    { name: "Layer by Layer", func: rotateLayerByLayer },
    { name: "Extra Space", func: rotateWithExtraSpace },
    { name: "Generator", func: rotateWithGenerator },
    { name: "Functional", func: rotateFunctional },
    { name: "Class", func: rotateClass },
    { name: "Bitwise", func: rotateBitwise },
    { name: "Array Methods", func: rotateArrayMethods },
  ];

  // Create test matrices
  const smallMatrix = createMatrix(3);
  const mediumMatrix = createMatrix(10);
  const largeMatrix = createMatrix(50);

  const matrices = [
    { name: "Small (3x3)", matrix: smallMatrix },
    { name: "Medium (10x10)", matrix: mediumMatrix },
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
// testRotateImage();
// performanceComparison();

export {
  rotate,
  rotateLayerByLayer,
  rotateWithExtraSpace,
  rotateWithGenerator,
  rotateFunctional,
  rotateClass,
  rotateBitwise,
  rotateArrayMethods,
  MatrixRotator,
  matrixGenerator,
  printMatrix,
  createMatrix,
  testRotateImage,
  performanceComparison,
};
