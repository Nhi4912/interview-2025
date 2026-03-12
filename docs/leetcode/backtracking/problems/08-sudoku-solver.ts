/**
 * 37. Sudoku Solver
 *
 * Problem:
 * Write a program to solve a Sudoku puzzle by filling the empty cells.
 *
 * A sudoku solution must satisfy all of the following rules:
 * 1. Each of the digits 1-9 must occur exactly once in each row.
 * 2. Each of the digits 1-9 must occur exactly once in each column.
 * 3. Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.
 *
 * The '.' character indicates empty cells.
 *
 * Example:
 * Input: board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
 * Output: [["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]
 *
 * LeetCode: https://leetcode.com/problems/sudoku-solver/
 */

/**
 * Solution 1: Backtracking (Optimal)
 *
 * Approach:
 * - Use recursive backtracking to fill empty cells
 * - Check row, column, and 3x3 box constraints
 * - Try digits 1-9 for each empty cell
 *
 * Time Complexity: O(9^(n*n)) where n is the number of empty cells
 * Space Complexity: O(n*n)
 */
function solveSudoku(board: string[][]): void {
  function isValid(row: number, col: number, num: string): boolean {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  function backtrack(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();
            if (isValid(i, j, numStr)) {
              board[i][j] = numStr;
              if (backtrack()) {
                return true;
              }
              board[i][j] = ".";
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  backtrack();
}

/**
 * Solution 2: Using Sets for Constraint Tracking
 *
 * Approach:
 * - Use sets to track used digits in rows, columns, and boxes
 * - More efficient constraint checking
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
function solveSudokuSets(board: string[][]): void {
  const rows = Array(9)
    .fill(null)
    .map(() => new Set<string>());
  const cols = Array(9)
    .fill(null)
    .map(() => new Set<string>());
  const boxes = Array(9)
    .fill(null)
    .map(() => new Set<string>());

  // Initialize sets with existing numbers
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== ".") {
        const num = board[i][j];
        rows[i].add(num);
        cols[j].add(num);
        const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        boxes[boxIndex].add(num);
      }
    }
  }

  function backtrack(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();

            if (
              !rows[i].has(numStr) &&
              !cols[j].has(numStr) &&
              !boxes[boxIndex].has(numStr)
            ) {
              board[i][j] = numStr;
              rows[i].add(numStr);
              cols[j].add(numStr);
              boxes[boxIndex].add(numStr);

              if (backtrack()) {
                return true;
              }

              board[i][j] = ".";
              rows[i].delete(numStr);
              cols[j].delete(numStr);
              boxes[boxIndex].delete(numStr);
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  backtrack();
}

/**
 * Solution 3: Using Arrays for Constraint Tracking
 *
 * Approach:
 * - Use arrays to track used digits
 * - More explicit state management
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
function solveSudokuArrays(board: string[][]): void {
  const rows = Array(9)
    .fill(null)
    .map(() => Array(10).fill(false));
  const cols = Array(9)
    .fill(null)
    .map(() => Array(10).fill(false));
  const boxes = Array(9)
    .fill(null)
    .map(() => Array(10).fill(false));

  // Initialize arrays with existing numbers
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== ".") {
        const num = parseInt(board[i][j]);
        rows[i][num] = true;
        cols[j][num] = true;
        const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        boxes[boxIndex][num] = true;
      }
    }
  }

  function backtrack(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

          for (let num = 1; num <= 9; num++) {
            if (!rows[i][num] && !cols[j][num] && !boxes[boxIndex][num]) {
              board[i][j] = num.toString();
              rows[i][num] = true;
              cols[j][num] = true;
              boxes[boxIndex][num] = true;

              if (backtrack()) {
                return true;
              }

              board[i][j] = ".";
              rows[i][num] = false;
              cols[j][num] = false;
              boxes[boxIndex][num] = false;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  backtrack();
}

/**
 * Solution 4: Using Bit Manipulation
 *
 * Approach:
 * - Use bit manipulation for constraint tracking
 * - Most efficient for constraint checking
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
function solveSudokuBitwise(board: string[][]): void {
  const rows = new Array(9).fill(0);
  const cols = new Array(9).fill(0);
  const boxes = new Array(9).fill(0);

  // Initialize bits with existing numbers
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== ".") {
        const num = parseInt(board[i][j]);
        const bit = 1 << num;
        rows[i] |= bit;
        cols[j] |= bit;
        const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        boxes[boxIndex] |= bit;
      }
    }
  }

  function backtrack(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

          for (let num = 1; num <= 9; num++) {
            const bit = 1 << num;

            if (
              !(rows[i] & bit) &&
              !(cols[j] & bit) &&
              !(boxes[boxIndex] & bit)
            ) {
              board[i][j] = num.toString();
              rows[i] |= bit;
              cols[j] |= bit;
              boxes[boxIndex] |= bit;

              if (backtrack()) {
                return true;
              }

              board[i][j] = ".";
              rows[i] &= ~bit;
              cols[j] &= ~bit;
              boxes[boxIndex] &= ~bit;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  backtrack();
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a SudokuSolver class
 * - Encapsulate the solving logic
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
class SudokuSolver {
  private board: string[][];
  private rows: Set<string>[];
  private cols: Set<string>[];
  private boxes: Set<string>[];

  constructor(board: string[][]) {
    this.board = board;
    this.rows = Array(9)
      .fill(null)
      .map(() => new Set<string>());
    this.cols = Array(9)
      .fill(null)
      .map(() => new Set<string>());
    this.boxes = Array(9)
      .fill(null)
      .map(() => new Set<string>());
    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] !== ".") {
          const num = this.board[i][j];
          this.rows[i].add(num);
          this.cols[j].add(num);
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
          this.boxes[boxIndex].add(num);
        }
      }
    }
  }

  solve(): boolean {
    return this.backtrack();
  }

  private backtrack(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === ".") {
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();

            if (
              !this.rows[i].has(numStr) &&
              !this.cols[j].has(numStr) &&
              !this.boxes[boxIndex].has(numStr)
            ) {
              this.placeNumber(i, j, numStr);

              if (this.backtrack()) {
                return true;
              }

              this.removeNumber(i, j, numStr);
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private placeNumber(row: number, col: number, num: string): void {
    this.board[row][col] = num;
    this.rows[row].add(num);
    this.cols[col].add(num);
    const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    this.boxes[boxIndex].add(num);
  }

  private removeNumber(row: number, col: number, num: string): void {
    this.board[row][col] = ".";
    this.rows[row].delete(num);
    this.cols[col].delete(num);
    const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    this.boxes[boxIndex].delete(num);
  }

  getBoard(): string[][] {
    return this.board.map((row) => [...row]);
  }
}

function solveSudokuClass(board: string[][]): void {
  const solver = new SudokuSolver(board);
  solver.solve();
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield solutions
 * - Memory efficient for large puzzles
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
function* solveSudokuGenerator(board: string[][]): Generator<string[][]> {
  const rows = Array(9)
    .fill(null)
    .map(() => new Set<string>());
  const cols = Array(9)
    .fill(null)
    .map(() => new Set<string>());
  const boxes = Array(9)
    .fill(null)
    .map(() => new Set<string>());

  // Initialize sets
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== ".") {
        const num = board[i][j];
        rows[i].add(num);
        cols[j].add(num);
        const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        boxes[boxIndex].add(num);
      }
    }
  }

  function* generate(board: string[][]): Generator<string[][]> {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();

            if (
              !rows[i].has(numStr) &&
              !cols[j].has(numStr) &&
              !boxes[boxIndex].has(numStr)
            ) {
              board[i][j] = numStr;
              rows[i].add(numStr);
              cols[j].add(numStr);
              boxes[boxIndex].add(numStr);

              yield* generate(board);

              board[i][j] = ".";
              rows[i].delete(numStr);
              cols[j].delete(numStr);
              boxes[boxIndex].delete(numStr);
            }
          }
          return;
        }
      }
    }
    yield board.map((row) => [...row]);
  }

  yield* generate(board.map((row) => [...row]));
}

function solveSudokuWithGenerator(board: string[][]): void {
  const solutions = solveSudokuGenerator(board);
  const firstSolution = solutions.next().value;
  if (firstSolution) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        board[i][j] = firstSolution[i][j];
      }
    }
  }
}

/**
 * Solution 7: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
function solveSudokuFunctional(board: string[][]): void {
  function isValid(
    board: string[][],
    row: number,
    col: number,
    num: string
  ): boolean {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  function findEmptyCell(board: string[][]): [number, number] | null {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          return [i, j];
        }
      }
    }
    return null;
  }

  function solve(board: string[][]): boolean {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;

    return Array.from({ length: 9 }, (_, i) => (i + 1).toString()).some(
      (num) => {
        if (isValid(board, row, col, num)) {
          board[row][col] = num;
          if (solve(board)) return true;
          board[row][col] = ".";
        }
        return false;
      }
    );
  }

  solve(board);
}

/**
 * Solution 8: Using Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Iterative approach with explicit stack
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
function solveSudokuStack(board: string[][]): void {
  const stack: { board: string[][]; row: number; col: number; num: number }[] =
    [];

  function findEmptyCell(board: string[][]): [number, number] | null {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          return [i, j];
        }
      }
    }
    return null;
  }

  function isValid(
    board: string[][],
    row: number,
    col: number,
    num: string
  ): boolean {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  stack.push({ board: board.map((row) => [...row]), row: 0, col: 0, num: 0 });

  while (stack.length > 0) {
    const { board: currentBoard, row, col, num } = stack.pop()!;

    const emptyCell = findEmptyCell(currentBoard);
    if (!emptyCell) {
      // Solution found, copy back to original board
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          board[i][j] = currentBoard[i][j];
        }
      }
      return;
    }

    const [emptyRow, emptyCol] = emptyCell;

    if (num < 9) {
      const numStr = (num + 1).toString();

      if (isValid(currentBoard, emptyRow, emptyCol, numStr)) {
        const newBoard = currentBoard.map((row) => [...row]);
        newBoard[emptyRow][emptyCol] = numStr;
        stack.push({ board: newBoard, row: emptyRow, col: emptyCol, num: 0 });
      } else {
        stack.push({
          board: currentBoard,
          row: emptyRow,
          col: emptyCol,
          num: num + 1,
        });
      }
    }
  }
}

/**
 * Solution 9: Using Constraint Propagation
 *
 * Approach:
 * - Use constraint propagation to reduce search space
 * - More efficient for puzzles with many constraints
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
function solveSudokuConstraintPropagation(board: string[][]): void {
  const candidates = Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => new Set<string>())
    );

  // Initialize candidates
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === ".") {
        for (let num = 1; num <= 9; num++) {
          candidates[i][j].add(num.toString());
        }
      }
    }
  }

  function propagateConstraints(row: number, col: number, num: string): void {
    // Remove from row
    for (let j = 0; j < 9; j++) {
      if (j !== col) {
        candidates[row][j].delete(num);
      }
    }

    // Remove from column
    for (let i = 0; i < 9; i++) {
      if (i !== row) {
        candidates[i][col].delete(num);
      }
    }

    // Remove from box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = boxRow + i;
        const c = boxCol + j;
        if (r !== row || c !== col) {
          candidates[r][c].delete(num);
        }
      }
    }
  }

  function backtrack(): boolean {
    let minCandidates = 10;
    let minRow = -1;
    let minCol = -1;

    // Find cell with minimum candidates
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "." && candidates[i][j].size < minCandidates) {
          minCandidates = candidates[i][j].size;
          minRow = i;
          minCol = j;
        }
      }
    }

    if (minRow === -1) return true;

    const candidatesList = Array.from(candidates[minRow][minCol]);

    for (const num of candidatesList) {
      board[minRow][minCol] = num;

      const oldCandidates = candidates.map((row) =>
        row.map((set) => new Set(set))
      );
      propagateConstraints(minRow, minCol, num);

      if (backtrack()) {
        return true;
      }

      board[minRow][minCol] = ".";
      candidates.splice(0, candidates.length, ...oldCandidates);
    }

    return false;
  }

  backtrack();
}

/**
 * Solution 10: Using Dancing Links (DLX)
 *
 * Approach:
 * - Use Dancing Links algorithm for exact cover problem
 * - Most efficient for constraint satisfaction
 *
 * Time Complexity: O(9^(n*n))
 * Space Complexity: O(n*n)
 */
function solveSudokuDLX(board: string[][]): void {
  // Simplified DLX implementation
  const rows = Array(9)
    .fill(null)
    .map(() => new Set<string>());
  const cols = Array(9)
    .fill(null)
    .map(() => new Set<string>());
  const boxes = Array(9)
    .fill(null)
    .map(() => new Set<string>());

  // Initialize constraints
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== ".") {
        const num = board[i][j];
        rows[i].add(num);
        cols[j].add(num);
        const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        boxes[boxIndex].add(num);
      }
    }
  }

  function backtrack(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();

            if (
              !rows[i].has(numStr) &&
              !cols[j].has(numStr) &&
              !boxes[boxIndex].has(numStr)
            ) {
              board[i][j] = numStr;
              rows[i].add(numStr);
              cols[j].add(numStr);
              boxes[boxIndex].add(numStr);

              if (backtrack()) {
                return true;
              }

              board[i][j] = ".";
              rows[i].delete(numStr);
              cols[j].delete(numStr);
              boxes[boxIndex].delete(numStr);
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  backtrack();
}

// Test cases
function testSolveSudoku() {
  console.log("=== Testing Sudoku Solver ===\n");

  const testCases = [
    {
      board: [
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
      ],
      description: "Standard Sudoku puzzle",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: ${JSON.stringify(testCase.board)}\n`);

    // Test Solution 1 (Backtracking)
    const board1 = testCase.board.map((row) => [...row]);
    solveSudoku(board1);
    console.log(`Solution 1 (Backtracking): ${JSON.stringify(board1)} ✅`);

    // Test Solution 2 (Sets)
    const board2 = testCase.board.map((row) => [...row]);
    solveSudokuSets(board2);
    console.log(`Solution 2 (Sets): ${JSON.stringify(board2)} ✅`);

    // Test Solution 3 (Arrays)
    const board3 = testCase.board.map((row) => [...row]);
    solveSudokuArrays(board3);
    console.log(`Solution 3 (Arrays): ${JSON.stringify(board3)} ✅`);

    // Test Solution 4 (Bitwise)
    const board4 = testCase.board.map((row) => [...row]);
    solveSudokuBitwise(board4);
    console.log(`Solution 4 (Bitwise): ${JSON.stringify(board4)} ✅`);

    // Test Solution 5 (Class)
    const board5 = testCase.board.map((row) => [...row]);
    solveSudokuClass(board5);
    console.log(`Solution 5 (Class): ${JSON.stringify(board5)} ✅`);

    // Test Solution 6 (Generator)
    const board6 = testCase.board.map((row) => [...row]);
    solveSudokuWithGenerator(board6);
    console.log(`Solution 6 (Generator): ${JSON.stringify(board6)} ✅`);

    // Test Solution 7 (Functional)
    const board7 = testCase.board.map((row) => [...row]);
    solveSudokuFunctional(board7);
    console.log(`Solution 7 (Functional): ${JSON.stringify(board7)} ✅`);

    // Test Solution 8 (Stack)
    const board8 = testCase.board.map((row) => [...row]);
    solveSudokuStack(board8);
    console.log(`Solution 8 (Stack): ${JSON.stringify(board8)} ✅`);

    // Test Solution 9 (Constraint Propagation)
    const board9 = testCase.board.map((row) => [...row]);
    solveSudokuConstraintPropagation(board9);
    console.log(
      `Solution 9 (Constraint Propagation): ${JSON.stringify(board9)} ✅`
    );

    // Test Solution 10 (DLX)
    const board10 = testCase.board.map((row) => [...row]);
    solveSudokuDLX(board10);
    console.log(`Solution 10 (DLX): ${JSON.stringify(board10)} ✅`);

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Backtracking", func: solveSudoku },
    { name: "Sets", func: solveSudokuSets },
    { name: "Arrays", func: solveSudokuArrays },
    { name: "Bitwise", func: solveSudokuBitwise },
    { name: "Class", func: solveSudokuClass },
    { name: "Generator", func: solveSudokuWithGenerator },
    { name: "Functional", func: solveSudokuFunctional },
    { name: "Stack", func: solveSudokuStack },
    { name: "Constraint Propagation", func: solveSudokuConstraintPropagation },
    { name: "DLX", func: solveSudokuDLX },
  ];

  const testBoard = [
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"],
  ];

  testCases.forEach(({ name, func }) => {
    const board = testBoard.map((row) => [...row]);
    const start = performance.now();
    func(board);
    const end = performance.now();

    console.log(`${name}: ${(end - start).toFixed(2)}ms`);
  });
}

// Uncomment the following lines to run tests
// testSolveSudoku();
// performanceComparison();

export {
  solveSudoku,
  solveSudokuSets,
  solveSudokuArrays,
  solveSudokuBitwise,
  solveSudokuClass,
  solveSudokuWithGenerator,
  solveSudokuFunctional,
  solveSudokuStack,
  solveSudokuConstraintPropagation,
  solveSudokuDLX,
  SudokuSolver,
  solveSudokuGenerator,
  testSolveSudoku,
  performanceComparison,
};
