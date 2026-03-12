/**
 * 51. N-Queens
 *
 * Problem:
 * The n-queens puzzle is the problem of placing n queens on an n x n chessboard
 * such that no two queens attack each other.
 *
 * Given an integer n, return all distinct solutions to the n-queens puzzle.
 * You may return the answer in any order.
 *
 * Each solution contains a distinct board configuration of the n-queens' placement,
 * where 'Q' and '.' both indicate a queen and an empty space, respectively.
 *
 * Example:
 * Input: n = 4
 * Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
 *
 * Input: n = 1
 * Output: [["Q"]]
 *
 * LeetCode: https://leetcode.com/problems/n-queens/
 */

/**
 * Solution 1: Backtracking (Optimal)
 *
 * Approach:
 * - Use recursive backtracking to place queens
 * - Check row, column, and diagonal constraints
 * - Build solution incrementally
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n^2)
 */
function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const board = Array(n)
    .fill(null)
    .map(() => Array(n).fill("."));

  function isValid(row: number, col: number): boolean {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === "Q") return false;
    }

    // Check diagonal (top-left to bottom-right)
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === "Q") return false;
    }

    // Check diagonal (top-right to bottom-left)
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === "Q") return false;
    }

    return true;
  }

  function backtrack(row: number) {
    if (row === n) {
      result.push(board.map((row) => row.join("")));
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = "Q";
        backtrack(row + 1);
        board[row][col] = ".";
      }
    }
  }

  backtrack(0);
  return result;
}

/**
 * Solution 2: Using Sets for Constraint Tracking
 *
 * Approach:
 * - Use sets to track occupied columns and diagonals
 * - More efficient constraint checking
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n)
 */
function solveNQueensSets(n: number): string[][] {
  const result: string[][] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>(); // row + col
  const diag2 = new Set<number>(); // row - col

  function backtrack(row: number, board: string[]) {
    if (row === n) {
      result.push([...board]);
      return;
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) {
        continue;
      }

      cols.add(col);
      diag1.add(row + col);
      diag2.add(row - col);

      const newRow = ".".repeat(col) + "Q" + ".".repeat(n - col - 1);
      board.push(newRow);

      backtrack(row + 1, board);

      board.pop();
      cols.delete(col);
      diag1.delete(row + col);
      diag2.delete(row - col);
    }
  }

  backtrack(0, []);
  return result;
}

/**
 * Solution 3: Using Arrays for Constraint Tracking
 *
 * Approach:
 * - Use arrays to track occupied positions
 * - More explicit state management
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n)
 */
function solveNQueensArrays(n: number): string[][] {
  const result: string[][] = [];
  const cols = new Array(n).fill(false);
  const diag1 = new Array(2 * n - 1).fill(false);
  const diag2 = new Array(2 * n - 1).fill(false);

  function backtrack(row: number, board: string[]) {
    if (row === n) {
      result.push([...board]);
      return;
    }

    for (let col = 0; col < n; col++) {
      const d1 = row + col;
      const d2 = row - col + n - 1;

      if (cols[col] || diag1[d1] || diag2[d2]) {
        continue;
      }

      cols[col] = true;
      diag1[d1] = true;
      diag2[d2] = true;

      const newRow = ".".repeat(col) + "Q" + ".".repeat(n - col - 1);
      board.push(newRow);

      backtrack(row + 1, board);

      board.pop();
      cols[col] = false;
      diag1[d1] = false;
      diag2[d2] = false;
    }
  }

  backtrack(0, []);
  return result;
}

/**
 * Solution 4: Using Bit Manipulation
 *
 * Approach:
 * - Use bit manipulation for constraint tracking
 * - Most efficient for small n
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n)
 */
function solveNQueensBitwise(n: number): string[][] {
  const result: string[][] = [];

  function backtrack(
    row: number,
    cols: number,
    diag1: number,
    diag2: number,
    board: string[]
  ) {
    if (row === n) {
      result.push([...board]);
      return;
    }

    for (let col = 0; col < n; col++) {
      const colBit = 1 << col;
      const diag1Bit = 1 << (row + col);
      const diag2Bit = 1 << (row - col + n - 1);

      if (cols & colBit || diag1 & diag1Bit || diag2 & diag2Bit) {
        continue;
      }

      const newRow = ".".repeat(col) + "Q" + ".".repeat(n - col - 1);
      board.push(newRow);

      backtrack(
        row + 1,
        cols | colBit,
        diag1 | diag1Bit,
        diag2 | diag2Bit,
        board
      );

      board.pop();
    }
  }

  backtrack(0, 0, 0, 0, []);
  return result;
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create an NQueensSolver class
 * - Encapsulate the solving logic
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n^2)
 */
class NQueensSolver {
  private n: number;
  private result: string[][];
  private board: string[][];
  private cols: Set<number>;
  private diag1: Set<number>;
  private diag2: Set<number>;

  constructor(n: number) {
    this.n = n;
    this.result = [];
    this.board = Array(n)
      .fill(null)
      .map(() => Array(n).fill("."));
    this.cols = new Set();
    this.diag1 = new Set();
    this.diag2 = new Set();
  }

  solve(): string[][] {
    this.result = [];
    this.backtrack(0);
    return this.result;
  }

  private backtrack(row: number): void {
    if (row === this.n) {
      this.result.push(this.board.map((row) => row.join("")));
      return;
    }

    for (let col = 0; col < this.n; col++) {
      if (this.isValid(row, col)) {
        this.placeQueen(row, col);
        this.backtrack(row + 1);
        this.removeQueen(row, col);
      }
    }
  }

  private isValid(row: number, col: number): boolean {
    return (
      !this.cols.has(col) &&
      !this.diag1.has(row + col) &&
      !this.diag2.has(row - col)
    );
  }

  private placeQueen(row: number, col: number): void {
    this.board[row][col] = "Q";
    this.cols.add(col);
    this.diag1.add(row + col);
    this.diag2.add(row - col);
  }

  private removeQueen(row: number, col: number): void {
    this.board[row][col] = ".";
    this.cols.delete(col);
    this.diag1.delete(row + col);
    this.diag2.delete(row - col);
  }
}

function solveNQueensClass(n: number): string[][] {
  const solver = new NQueensSolver(n);
  return solver.solve();
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield solutions
 * - Memory efficient for large n
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n)
 */
function* solveNQueensGenerator(n: number): Generator<string[]> {
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();

  function* generate(row: number, board: string[]): Generator<string[]> {
    if (row === n) {
      yield [...board];
      return;
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) {
        continue;
      }

      cols.add(col);
      diag1.add(row + col);
      diag2.add(row - col);

      const newRow = ".".repeat(col) + "Q" + ".".repeat(n - col - 1);
      board.push(newRow);

      yield* generate(row + 1, board);

      board.pop();
      cols.delete(col);
      diag1.delete(row + col);
      diag2.delete(row - col);
    }
  }

  yield* generate(0, []);
}

function solveNQueensWithGenerator(n: number): string[][] {
  return Array.from(solveNQueensGenerator(n));
}

/**
 * Solution 7: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n^2)
 */
function solveNQueensFunctional(n: number): string[][] {
  function isValid(board: string[][], row: number, col: number): boolean {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === "Q") return false;
    }

    // Check diagonals
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === "Q") return false;
    }

    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === "Q") return false;
    }

    return true;
  }

  function backtrack(row: number, board: string[][]): string[][] {
    if (row === n) {
      return [board.map((row) => row.join(""))];
    }

    const results: string[][] = [];

    for (let col = 0; col < n; col++) {
      if (isValid(board, row, col)) {
        const newBoard = board.map((row) => [...row]);
        newBoard[row][col] = "Q";
        results.push(...backtrack(row + 1, newBoard));
      }
    }

    return results;
  }

  const initialBoard = Array(n)
    .fill(null)
    .map(() => Array(n).fill("."));
  return backtrack(0, initialBoard);
}

/**
 * Solution 8: Using Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Iterative approach with explicit stack
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n^2)
 */
function solveNQueensStack(n: number): string[][] {
  const result: string[][] = [];
  const stack: {
    row: number;
    board: string[][];
    cols: Set<number>;
    diag1: Set<number>;
    diag2: Set<number>;
  }[] = [];

  stack.push({
    row: 0,
    board: Array(n)
      .fill(null)
      .map(() => Array(n).fill(".")),
    cols: new Set(),
    diag1: new Set(),
    diag2: new Set(),
  });

  while (stack.length > 0) {
    const { row, board, cols, diag1, diag2 } = stack.pop()!;

    if (row === n) {
      result.push(board.map((row) => row.join("")));
      continue;
    }

    for (let col = n - 1; col >= 0; col--) {
      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) {
        continue;
      }

      const newBoard = board.map((row) => [...row]);
      newBoard[row][col] = "Q";

      const newCols = new Set(cols);
      const newDiag1 = new Set(diag1);
      const newDiag2 = new Set(diag2);

      newCols.add(col);
      newDiag1.add(row + col);
      newDiag2.add(row - col);

      stack.push({
        row: row + 1,
        board: newBoard,
        cols: newCols,
        diag1: newDiag1,
        diag2: newDiag2,
      });
    }
  }

  return result;
}

/**
 * Solution 9: Using Memoization
 *
 * Approach:
 * - Use memoization to cache partial solutions
 * - Avoid recalculating same subproblems
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n^2)
 */
function solveNQueensMemo(n: number): string[][] {
  const memo = new Map<string, string[][]>();

  function backtrack(
    row: number,
    cols: number,
    diag1: number,
    diag2: number
  ): string[][] {
    const key = `${row},${cols},${diag1},${diag2}`;

    if (memo.has(key)) {
      return memo.get(key)!.map((solution) => [...solution]);
    }

    if (row === n) {
      return [[""]];
    }

    const results: string[][] = [];

    for (let col = 0; col < n; col++) {
      const colBit = 1 << col;
      const diag1Bit = 1 << (row + col);
      const diag2Bit = 1 << (row - col + n - 1);

      if (cols & colBit || diag1 & diag1Bit || diag2 & diag2Bit) {
        continue;
      }

      const subResults = backtrack(
        row + 1,
        cols | colBit,
        diag1 | diag1Bit,
        diag2 | diag2Bit
      );
      const newRow = ".".repeat(col) + "Q" + ".".repeat(n - col - 1);

      for (const subResult of subResults) {
        results.push([newRow, ...subResult]);
      }
    }

    memo.set(
      key,
      results.map((solution) => [...solution])
    );
    return results;
  }

  return backtrack(0, 0, 0, 0);
}

/**
 * Solution 10: Using Symmetry Optimization
 *
 * Approach:
 * - Use symmetry to reduce search space
 * - Only search first half of first row
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n^2)
 */
function solveNQueensSymmetry(n: number): string[][] {
  const result: string[][] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();

  function backtrack(row: number, board: string[]) {
    if (row === n) {
      result.push([...board]);
      return;
    }

    const startCol = row === 0 ? 0 : 0;
    const endCol = row === 0 ? Math.ceil(n / 2) : n;

    for (let col = startCol; col < endCol; col++) {
      if (cols.has(col) || diag1.has(row + col) || diag2.has(row - col)) {
        continue;
      }

      cols.add(col);
      diag1.add(row + col);
      diag2.add(row - col);

      const newRow = ".".repeat(col) + "Q" + ".".repeat(n - col - 1);
      board.push(newRow);

      backtrack(row + 1, board);

      board.pop();
      cols.delete(col);
      diag1.delete(row + col);
      diag2.delete(row - col);
    }
  }

  backtrack(0, []);
  return result;
}

// Test cases
function testSolveNQueens() {
  console.log("=== Testing N-Queens ===\n");

  const testCases = [
    {
      input: 1,
      expected: [["Q"]],
      description: "Single queen",
    },
    {
      input: 2,
      expected: [],
      description: "No solution for 2x2",
    },
    {
      input: 3,
      expected: [],
      description: "No solution for 3x3",
    },
    {
      input: 4,
      expected: [
        [".Q..", "...Q", "Q...", "..Q."],
        ["..Q.", "Q...", "...Q", ".Q.."],
      ],
      description: "Two solutions for 4x4",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: n = ${testCase.input}`);
    console.log(`Expected: ${JSON.stringify(testCase.expected)}\n`);

    // Test Solution 1 (Backtracking)
    const result1 = solveNQueens(testCase.input);
    console.log(
      `Solution 1 (Backtracking): ${JSON.stringify(result1)} ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Sets)
    const result2 = solveNQueensSets(testCase.input);
    console.log(
      `Solution 2 (Sets): ${JSON.stringify(result2)} ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Arrays)
    const result3 = solveNQueensArrays(testCase.input);
    console.log(
      `Solution 3 (Arrays): ${JSON.stringify(result3)} ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Bitwise)
    const result4 = solveNQueensBitwise(testCase.input);
    console.log(
      `Solution 4 (Bitwise): ${JSON.stringify(result4)} ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Class)
    const result5 = solveNQueensClass(testCase.input);
    console.log(
      `Solution 5 (Class): ${JSON.stringify(result5)} ${
        JSON.stringify(result5.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = solveNQueensWithGenerator(testCase.input);
    console.log(
      `Solution 6 (Generator): ${JSON.stringify(result6)} ${
        JSON.stringify(result6.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Functional)
    const result7 = solveNQueensFunctional(testCase.input);
    console.log(
      `Solution 7 (Functional): ${JSON.stringify(result7)} ${
        JSON.stringify(result7.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Stack)
    const result8 = solveNQueensStack(testCase.input);
    console.log(
      `Solution 8 (Stack): ${JSON.stringify(result8)} ${
        JSON.stringify(result8.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Memoization)
    const result9 = solveNQueensMemo(testCase.input);
    console.log(
      `Solution 9 (Memoization): ${JSON.stringify(result9)} ${
        JSON.stringify(result9.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Symmetry)
    const result10 = solveNQueensSymmetry(testCase.input);
    console.log(
      `Solution 10 (Symmetry): ${JSON.stringify(result10)} ${
        JSON.stringify(result10.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Backtracking", func: solveNQueens },
    { name: "Sets", func: solveNQueensSets },
    { name: "Arrays", func: solveNQueensArrays },
    { name: "Bitwise", func: solveNQueensBitwise },
    { name: "Class", func: solveNQueensClass },
    { name: "Generator", func: solveNQueensWithGenerator },
    { name: "Functional", func: solveNQueensFunctional },
    { name: "Stack", func: solveNQueensStack },
    { name: "Memoization", func: solveNQueensMemo },
    { name: "Symmetry", func: solveNQueensSymmetry },
  ];

  // Create test cases
  const smallCase = 4;
  const mediumCase = 5;
  const largeCase = 6;

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case (n = ${testCase}):`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(testCase);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (${
          result.length
        } solutions)`
      );
    });

    console.log("");
  });
}

// N-Queens analysis
function nQueensAnalysis() {
  console.log("=== N-Queens Analysis ===\n");

  const testValues = [1, 2, 3, 4, 5, 6, 7, 8];

  testValues.forEach((n) => {
    console.log(`n = ${n}:`);
    const result = solveNQueens(n);
    console.log(`Solutions: ${result.length}`);
    if (result.length > 0) {
      console.log(`First solution: ${JSON.stringify(result[0])}`);
    }
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testSolveNQueens();
// performanceComparison();
// nQueensAnalysis();

export {
  solveNQueens,
  solveNQueensSets,
  solveNQueensArrays,
  solveNQueensBitwise,
  solveNQueensClass,
  solveNQueensWithGenerator,
  solveNQueensFunctional,
  solveNQueensStack,
  solveNQueensMemo,
  solveNQueensSymmetry,
  NQueensSolver,
  solveNQueensGenerator,
  testSolveNQueens,
  performanceComparison,
  nQueensAnalysis,
};
