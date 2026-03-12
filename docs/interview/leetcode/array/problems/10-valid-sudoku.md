---
layout: page
title: "Valid Sudoku"
difficulty: Hard
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/valid-sudoku/"
---

# Valid Sudoku

**LeetCode Problem # * 36. Valid Sudoku**

## Problem Description

 * Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be  * validated according to the following rules:  *  * 1. Each row must contain the digits 1-9 without repetition.  * 2. Each column must contain the digits 1-9 without repetition. 

## Solutions

{% raw %}
/**
 * 36. Valid Sudoku
 *
 * Problem:
 * Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be
 * validated according to the following rules:
 *
 * 1. Each row must contain the digits 1-9 without repetition.
 * 2. Each column must contain the digits 1-9 without repetition.
 * 3. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.
 *
 * Note:
 * - A Sudoku board (partially filled) could be valid but is not necessarily solvable.
 * - Only the filled cells need to be validated according to the mentioned rules.
 *
 * Example:
 * Input: board = [
 *   ["5","3",".",".","7",".",".",".","."],
 *   ["6",".",".","1","9","5",".",".","."],
 *   [".","9","8",".",".",".",".","6","."],
 *   ["8",".",".",".","6",".",".",".","3"],
 *   ["4",".",".","8",".","3",".",".","1"],
 *   ["7",".",".",".","2",".",".",".","6"],
 *   [".","6",".",".",".",".","2","8","."],
 *   [".",".",".","4","1","9",".",".","5"],
 *   [".",".",".",".","8",".",".","7","9"]
 * ]
 * Output: true
 *
 * LeetCode: https://leetcode.com/problems/valid-sudoku/
 */

/**
 * Solution 1: Three Passes with Sets (Optimal)
 *
 * Approach:
 * - Check rows, columns, and boxes separately
 * - Use Set to detect duplicates
 *
 * Time Complexity: O(n²) where n = 9
 * Space Complexity: O(n)
 */
function isValidSudoku(board: string[][]): boolean {
  const n = 9;

  // Check rows
  for (let i = 0; i < n; i++) {
    const row = new Set<string>();
    for (let j = 0; j < n; j++) {
      if (board[i][j] !== ".") {
        if (row.has(board[i][j])) return false;
        row.add(board[i][j]);
      }
    }
  }

  // Check columns
  for (let j = 0; j < n; j++) {
    const col = new Set<string>();
    for (let i = 0; i < n; i++) {
      if (board[i][j] !== ".") {
        if (col.has(board[i][j])) return false;
        col.add(board[i][j]);
      }
    }
  }

  // Check 3x3 boxes
  for (let box = 0; box < n; box++) {
    const boxSet = new Set<string>();
    const rowStart = Math.floor(box / 3) * 3;
    const colStart = (box % 3) * 3;

    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        if (board[i][j] !== ".") {
          if (boxSet.has(board[i][j])) return false;
          boxSet.add(board[i][j]);
        }
      }
    }
  }

  return true;
}

/**
 * Solution 2: Single Pass with Arrays
 *
 * Approach:
 * - Use arrays to track seen digits for rows, columns, and boxes
 * - Check all conditions in a single pass
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function isValidSudokuArray(board: string[][]): boolean {
  const n = 9;
  const rows = Array.from({ length: n }, () => new Array(n).fill(false));
  const cols = Array.from({ length: n }, () => new Array(n).fill(false));
  const boxes = Array.from({ length: n }, () => new Array(n).fill(false));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === ".") continue;

      const num = parseInt(board[i][j]) - 1;
      const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

      if (rows[i][num] || cols[j][num] || boxes[boxIndex][num]) {
        return false;
      }

      rows[i][num] = true;
      cols[j][num] = true;
      boxes[boxIndex][num] = true;
    }
  }

  return true;
}

/**
 * Solution 3: Bit Manipulation
 *
 * Approach:
 * - Use bit flags to track seen digits
 * - More memory efficient
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function isValidSudokuBitwise(board: string[][]): boolean {
  const n = 9;
  const rows = new Array(n).fill(0);
  const cols = new Array(n).fill(0);
  const boxes = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === ".") continue;

      const num = parseInt(board[i][j]);
      const bit = 1 << (num - 1);
      const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

      if (rows[i] & bit || cols[j] & bit || boxes[boxIndex] & bit) {
        return false;
      }

      rows[i] |= bit;
      cols[j] |= bit;
      boxes[boxIndex] |= bit;
    }
  }

  return true;
}

/**
 * Solution 4: Using Map (Hash Table)
 *
 * Approach:
 * - Use Map to track frequency of digits
 * - More flexible for different board sizes
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function isValidSudokuMap(board: string[][]): boolean {
  const n = 9;

  // Check rows
  for (let i = 0; i < n; i++) {
    const rowMap = new Map<string, number>();
    for (let j = 0; j < n; j++) {
      if (board[i][j] !== ".") {
        if (rowMap.has(board[i][j])) return false;
        rowMap.set(board[i][j], 1);
      }
    }
  }

  // Check columns
  for (let j = 0; j < n; j++) {
    const colMap = new Map<string, number>();
    for (let i = 0; i < n; i++) {
      if (board[i][j] !== ".") {
        if (colMap.has(board[i][j])) return false;
        colMap.set(board[i][j], 1);
      }
    }
  }

  // Check boxes
  for (let box = 0; box < n; box++) {
    const boxMap = new Map<string, number>();
    const rowStart = Math.floor(box / 3) * 3;
    const colStart = (box % 3) * 3;

    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        if (board[i][j] !== ".") {
          if (boxMap.has(board[i][j])) return false;
          boxMap.set(board[i][j], 1);
        }
      }
    }
  }

  return true;
}

/**
 * Solution 5: Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function isValidSudokuFunctional(board: string[][]): boolean {
  const n = 9;

  // Helper function to check if array has duplicates
  const hasDuplicates = (arr: string[]): boolean => {
    const filtered = arr.filter((x) => x !== ".");
    return new Set(filtered).size !== filtered.length;
  };

  // Check rows
  const rowsValid = board.every((row) => !hasDuplicates(row));
  if (!rowsValid) return false;

  // Check columns
  const colsValid = Array.from({ length: n }, (_, j) =>
    board.map((row) => row[j])
  ).every((col) => !hasDuplicates(col));
  if (!colsValid) return false;

  // Check boxes
  const boxesValid = Array.from({ length: n }, (_, box) => {
    const rowStart = Math.floor(box / 3) * 3;
    const colStart = (box % 3) * 3;
    const boxElements: string[] = [];

    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        boxElements.push(board[i][j]);
      }
    }

    return !hasDuplicates(boxElements);
  }).every((valid) => valid);

  return boxesValid;
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generators to iterate through board elements
 * - Memory efficient for large boards
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function* rowGenerator(board: string[][], rowIndex: number): Generator<string> {
  for (let j = 0; j < board[rowIndex].length; j++) {
    yield board[rowIndex][j];
  }
}

function* colGenerator(board: string[][], colIndex: number): Generator<string> {
  for (let i = 0; i < board.length; i++) {
    yield board[i][colIndex];
  }
}

function* boxGenerator(board: string[][], boxIndex: number): Generator<string> {
  const rowStart = Math.floor(boxIndex / 3) * 3;
  const colStart = (boxIndex % 3) * 3;

  for (let i = rowStart; i < rowStart + 3; i++) {
    for (let j = colStart; j < colStart + 3; j++) {
      yield board[i][j];
    }
  }
}

function isValidSudokuGenerator(board: string[][]): boolean {
  const n = 9;

  // Check rows
  for (let i = 0; i < n; i++) {
    const rowSet = new Set<string>();
    for (const cell of rowGenerator(board, i)) {
      if (cell !== ".") {
        if (rowSet.has(cell)) return false;
        rowSet.add(cell);
      }
    }
  }

  // Check columns
  for (let j = 0; j < n; j++) {
    const colSet = new Set<string>();
    for (const cell of colGenerator(board, j)) {
      if (cell !== ".") {
        if (colSet.has(cell)) return false;
        colSet.add(cell);
      }
    }
  }

  // Check boxes
  for (let box = 0; box < n; box++) {
    const boxSet = new Set<string>();
    for (const cell of boxGenerator(board, box)) {
      if (cell !== ".") {
        if (boxSet.has(cell)) return false;
        boxSet.add(cell);
      }
    }
  }

  return true;
}

/**
 * Solution 7: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a SudokuValidator class
 * - Encapsulate validation logic
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
class SudokuValidator {
  private board: string[][];
  private n: number;

  constructor(board: string[][]) {
    this.board = board;
    this.n = board.length;
  }

  isValid(): boolean {
    return (
      this.areRowsValid() && this.areColumnsValid() && this.areBoxesValid()
    );
  }

  private areRowsValid(): boolean {
    for (let i = 0; i < this.n; i++) {
      const row = new Set<string>();
      for (let j = 0; j < this.n; j++) {
        if (this.board[i][j] !== ".") {
          if (row.has(this.board[i][j])) return false;
          row.add(this.board[i][j]);
        }
      }
    }
    return true;
  }

  private areColumnsValid(): boolean {
    for (let j = 0; j < this.n; j++) {
      const col = new Set<string>();
      for (let i = 0; i < this.n; i++) {
        if (this.board[i][j] !== ".") {
          if (col.has(this.board[i][j])) return false;
          col.add(this.board[i][j]);
        }
      }
    }
    return true;
  }

  private areBoxesValid(): boolean {
    for (let box = 0; box < this.n; box++) {
      const boxSet = new Set<string>();
      const rowStart = Math.floor(box / 3) * 3;
      const colStart = (box % 3) * 3;

      for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
          if (this.board[i][j] !== ".") {
            if (boxSet.has(this.board[i][j])) return false;
            boxSet.add(this.board[i][j]);
          }
        }
      }
    }
    return true;
  }
}

function isValidSudokuClass(board: string[][]): boolean {
  const validator = new SudokuValidator(board);
  return validator.isValid();
}

/**
 * Solution 8: Using Regular Expressions
 *
 * Approach:
 * - Convert board to string representation
 * - Use regex to check for duplicates
 * - Educational but not practical
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function isValidSudokuRegex(board: string[][]): boolean {
  const n = 9;

  // Convert board to string for regex processing
  const boardStr = board.map((row) => row.join("")).join("");

  // Check rows
  for (let i = 0; i < n; i++) {
    const row = boardStr.slice(i * n, (i + 1) * n);
    const digits = row.replace(/\./g, "");
    if (new Set(digits).size !== digits.length) return false;
  }

  // Check columns
  for (let j = 0; j < n; j++) {
    let col = "";
    for (let i = 0; i < n; i++) {
      col += boardStr[i * n + j];
    }
    const digits = col.replace(/\./g, "");
    if (new Set(digits).size !== digits.length) return false;
  }

  // Check boxes
  for (let box = 0; box < n; box++) {
    let boxStr = "";
    const rowStart = Math.floor(box / 3) * 3;
    const colStart = (box % 3) * 3;

    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        boxStr += boardStr[i * n + j];
      }
    }

    const digits = boxStr.replace(/\./g, "");
    if (new Set(digits).size !== digits.length) return false;
  }

  return true;
}

// Test cases
function testValidSudoku() {
  console.log("=== Testing Valid Sudoku ===\n");

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
      expected: true,
      description: "Valid Sudoku board",
    },
    {
      board: [
        ["8", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
      ],
      expected: false,
      description: "Invalid Sudoku board (duplicate 8 in first column)",
    },
    {
      board: [
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
      ],
      expected: true,
      description: "Empty Sudoku board",
    },
    {
      board: [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        ["2", "3", "4", "5", "6", "7", "8", "9", "1"],
        ["3", "4", "5", "6", "7", "8", "9", "1", "2"],
        ["4", "5", "6", "7", "8", "9", "1", "2", "3"],
        ["5", "6", "7", "8", "9", "1", "2", "3", "4"],
        ["6", "7", "8", "9", "1", "2", "3", "4", "5"],
        ["7", "8", "9", "1", "2", "3", "4", "5", "6"],
        ["8", "9", "1", "2", "3", "4", "5", "6", "7"],
        ["9", "1", "2", "3", "4", "5", "6", "7", "8"],
      ],
      expected: false,
      description: "Invalid Sudoku board (duplicate digits in rows)",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Three Passes with Sets)
    const result1 = isValidSudoku(testCase.board.map((row) => [...row]));
    console.log(
      `Solution 1 (Three Passes): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Single Pass with Arrays)
    const result2 = isValidSudokuArray(testCase.board.map((row) => [...row]));
    console.log(
      `Solution 2 (Single Pass): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Bit Manipulation)
    const result3 = isValidSudokuBitwise(testCase.board.map((row) => [...row]));
    console.log(
      `Solution 3 (Bitwise): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Map)
    const result4 = isValidSudokuMap(testCase.board.map((row) => [...row]));
    console.log(
      `Solution 4 (Map): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Functional)
    const result5 = isValidSudokuFunctional(
      testCase.board.map((row) => [...row])
    );
    console.log(
      `Solution 5 (Functional): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = isValidSudokuGenerator(
      testCase.board.map((row) => [...row])
    );
    console.log(
      `Solution 6 (Generator): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Class)
    const result7 = isValidSudokuClass(testCase.board.map((row) => [...row]));
    console.log(
      `Solution 7 (Class): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Regex)
    const result8 = isValidSudokuRegex(testCase.board.map((row) => [...row]));
    console.log(
      `Solution 8 (Regex): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Three Passes", func: isValidSudoku },
    { name: "Single Pass", func: isValidSudokuArray },
    { name: "Bitwise", func: isValidSudokuBitwise },
    { name: "Map", func: isValidSudokuMap },
    { name: "Functional", func: isValidSudokuFunctional },
    { name: "Generator", func: isValidSudokuGenerator },
    { name: "Class", func: isValidSudokuClass },
    { name: "Regex", func: isValidSudokuRegex },
  ];

  // Create test board
  const board = [
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
    const testBoard = board.map((row) => [...row]);
    const start = performance.now();
    const result = func(testBoard);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: ${result}`);
    console.log(`  Memory: ${name === "Bitwise" ? "O(1)" : "O(n)"}\n`);
  });
}

// Uncomment the following lines to run tests
// testValidSudoku();
// performanceComparison();

export {
  isValidSudoku,
  isValidSudokuArray,
  isValidSudokuBitwise,
  isValidSudokuMap,
  isValidSudokuFunctional,
  isValidSudokuGenerator,
  isValidSudokuClass,
  isValidSudokuRegex,
  SudokuValidator,
  rowGenerator,
  colGenerator,
  boxGenerator,
  testValidSudoku,
  performanceComparison,
};
{% endraw %}
