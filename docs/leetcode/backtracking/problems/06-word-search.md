---
layout: page
title: "Word Search"
difficulty: Hard
category: Backtracking
tags: [Backtracking, Hash Table]
leetcode_url: "https://leetcode.com/problems/word-search/"
---

# Word Search

**LeetCode Problem # * 79. Word Search**

## Problem Description

 * Given an m x n grid of characters board and a string word, return true if word  * exists in the grid.  *  * The word can be constructed from letters of sequentially adjacent cells, where  * adjacent cells are horizontally or vertically neighboring. The same letter cell 

## Solutions

{% raw %}
/**
 * 79. Word Search
 *
 * Problem:
 * Given an m x n grid of characters board and a string word, return true if word
 * exists in the grid.
 *
 * The word can be constructed from letters of sequentially adjacent cells, where
 * adjacent cells are horizontally or vertically neighboring. The same letter cell
 * may not be used more than once.
 *
 * Example:
 * Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
 * Output: true
 *
 * Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
 * Output: true
 *
 * Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
 * Output: false
 *
 * LeetCode: https://leetcode.com/problems/word-search/
 */

/**
 * Solution 1: Backtracking (Optimal)
 *
 * Approach:
 * - Use DFS with backtracking to search for the word
 * - Mark visited cells to avoid cycles
 * - Check all four directions (up, down, left, right)
 *
 * Time Complexity: O(m * n * 4^L) where L is the length of the word
 * Space Complexity: O(L) - recursion stack
 */
function exist(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;

  function backtrack(row: number, col: number, index: number): boolean {
    if (index === word.length) {
      return true;
    }

    if (
      row < 0 ||
      row >= m ||
      col < 0 ||
      col >= n ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    // Mark as visited
    const temp = board[row][col];
    board[row][col] = "#";

    // Check all four directions
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let found = false;

    for (const [dr, dc] of directions) {
      if (backtrack(row + dr, col + dc, index + 1)) {
        found = true;
        break;
      }
    }

    // Restore the cell
    board[row][col] = temp;

    return found;
  }

  // Try starting from each cell
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (backtrack(i, j, 0)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Solution 2: Using Visited Array
 *
 * Approach:
 * - Use separate visited array instead of modifying board
 * - More explicit state management
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(m * n + L)
 */
function existVisited(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const visited = Array(m)
    .fill(null)
    .map(() => Array(n).fill(false));

  function backtrack(row: number, col: number, index: number): boolean {
    if (index === word.length) {
      return true;
    }

    if (
      row < 0 ||
      row >= m ||
      col < 0 ||
      col >= n ||
      visited[row][col] ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    visited[row][col] = true;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let found = false;

    for (const [dr, dc] of directions) {
      if (backtrack(row + dr, col + dc, index + 1)) {
        found = true;
        break;
      }
    }

    visited[row][col] = false;
    return found;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (backtrack(i, j, 0)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Solution 3: Using Set for Visited
 *
 * Approach:
 * - Use Set to track visited coordinates
 * - More efficient for sparse boards
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(L)
 */
function existSet(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const visited = new Set<string>();

  function backtrack(row: number, col: number, index: number): boolean {
    if (index === word.length) {
      return true;
    }

    const key = `${row},${col}`;
    if (
      row < 0 ||
      row >= m ||
      col < 0 ||
      col >= n ||
      visited.has(key) ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    visited.add(key);

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let found = false;

    for (const [dr, dc] of directions) {
      if (backtrack(row + dr, col + dc, index + 1)) {
        found = true;
        break;
      }
    }

    visited.delete(key);
    return found;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (backtrack(i, j, 0)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Solution 4: Using Map for Visited
 *
 * Approach:
 * - Use Map to track visited coordinates
 * - More explicit coordinate tracking
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(L)
 */
function existMap(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const visited = new Map<string, boolean>();

  function backtrack(row: number, col: number, index: number): boolean {
    if (index === word.length) {
      return true;
    }

    const key = `${row},${col}`;
    if (
      row < 0 ||
      row >= m ||
      col < 0 ||
      col >= n ||
      visited.get(key) ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    visited.set(key, true);

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let found = false;

    for (const [dr, dc] of directions) {
      if (backtrack(row + dr, col + dc, index + 1)) {
        found = true;
        break;
      }
    }

    visited.set(key, false);
    return found;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (backtrack(i, j, 0)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a WordSearch class
 * - Encapsulate the search logic
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(m * n + L)
 */
class WordSearch {
  private board: string[][];
  private word: string;
  private m: number;
  private n: number;
  private visited: boolean[][];

  constructor(board: string[][], word: string) {
    this.board = board;
    this.word = word;
    this.m = board.length;
    this.n = board[0].length;
    this.visited = Array(this.m)
      .fill(null)
      .map(() => Array(this.n).fill(false));
  }

  search(): boolean {
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.backtrack(i, j, 0)) {
          return true;
        }
      }
    }
    return false;
  }

  private backtrack(row: number, col: number, index: number): boolean {
    if (index === this.word.length) {
      return true;
    }

    if (
      row < 0 ||
      row >= this.m ||
      col < 0 ||
      col >= this.n ||
      this.visited[row][col] ||
      this.board[row][col] !== this.word[index]
    ) {
      return false;
    }

    this.visited[row][col] = true;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let found = false;

    for (const [dr, dc] of directions) {
      if (this.backtrack(row + dr, col + dc, index + 1)) {
        found = true;
        break;
      }
    }

    this.visited[row][col] = false;
    return found;
  }
}

function existClass(board: string[][], word: string): boolean {
  const wordSearch = new WordSearch(board, word);
  return wordSearch.search();
}

/**
 * Solution 6: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(m * n + L)
 */
function existFunctional(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const visited = Array(m)
    .fill(null)
    .map(() => Array(n).fill(false));

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  function isValid(row: number, col: number): boolean {
    return row >= 0 && row < m && col >= 0 && col < n;
  }

  function backtrack(row: number, col: number, index: number): boolean {
    if (index === word.length) return true;
    if (
      !isValid(row, col) ||
      visited[row][col] ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    visited[row][col] = true;

    const found = directions.some(([dr, dc]) =>
      backtrack(row + dr, col + dc, index + 1)
    );

    visited[row][col] = false;
    return found;
  }

  return board.some((_, i) => board[i].some((_, j) => backtrack(i, j, 0)));
}

/**
 * Solution 7: Using Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Iterative approach with explicit stack
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(m * n * L)
 */
function existStack(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const visited = Array(m)
    .fill(null)
    .map(() => Array(n).fill(false));

  const stack: {
    row: number;
    col: number;
    index: number;
    visited: boolean[][];
  }[] = [];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      stack.push({
        row: i,
        col: j,
        index: 0,
        visited: visited.map((row) => [...row]),
      });

      while (stack.length > 0) {
        const { row, col, index, visited: currentVisited } = stack.pop()!;

        if (index === word.length) {
          return true;
        }

        if (
          row < 0 ||
          row >= m ||
          col < 0 ||
          col >= n ||
          currentVisited[row][col] ||
          board[row][col] !== word[index]
        ) {
          continue;
        }

        currentVisited[row][col] = true;

        const directions = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];
        for (const [dr, dc] of directions) {
          stack.push({
            row: row + dr,
            col: col + dc,
            index: index + 1,
            visited: currentVisited.map((row) => [...row]),
          });
        }
      }
    }
  }

  return false;
}

/**
 * Solution 8: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield search paths
 * - Memory efficient for large boards
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(L)
 */
function* existGenerator(board: string[][], word: string): Generator<boolean> {
  const m = board.length;
  const n = board[0].length;
  const visited = new Set<string>();

  function* search(
    row: number,
    col: number,
    index: number
  ): Generator<boolean> {
    if (index === word.length) {
      yield true;
      return;
    }

    const key = `${row},${col}`;
    if (
      row < 0 ||
      row >= m ||
      col < 0 ||
      col >= n ||
      visited.has(key) ||
      board[row][col] !== word[index]
    ) {
      return;
    }

    visited.add(key);

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of directions) {
      yield* search(row + dr, col + dc, index + 1);
    }

    visited.delete(key);
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      yield* search(i, j, 0);
    }
  }
}

function existWithGenerator(board: string[][], word: string): boolean {
  for (const result of existGenerator(board, word)) {
    if (result) return true;
  }
  return false;
}

/**
 * Solution 9: Using Early Termination
 *
 * Approach:
 * - Add early termination conditions
 * - More efficient pruning
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(L)
 */
function existEarlyTermination(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;

  // Early termination: check if all characters exist
  const charCount = new Map<string, number>();
  for (const row of board) {
    for (const char of row) {
      charCount.set(char, (charCount.get(char) || 0) + 1);
    }
  }

  for (const char of word) {
    const count = charCount.get(char) || 0;
    if (count === 0) return false;
    charCount.set(char, count - 1);
  }

  function backtrack(row: number, col: number, index: number): boolean {
    if (index === word.length) {
      return true;
    }

    if (
      row < 0 ||
      row >= m ||
      col < 0 ||
      col >= n ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    const temp = board[row][col];
    board[row][col] = "#";

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let found = false;

    for (const [dr, dc] of directions) {
      if (backtrack(row + dr, col + dc, index + 1)) {
        found = true;
        break;
      }
    }

    board[row][col] = temp;
    return found;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (backtrack(i, j, 0)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Solution 10: Using BFS (Breadth-First Search)
 *
 * Approach:
 * - Use BFS instead of DFS
 * - Level-by-level search
 *
 * Time Complexity: O(m * n * 4^L)
 * Space Complexity: O(m * n * L)
 */
function existBFS(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;

  const queue: {
    row: number;
    col: number;
    index: number;
    visited: Set<string>;
  }[] = [];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === word[0]) {
        queue.push({
          row: i,
          col: j,
          index: 0,
          visited: new Set([`${i},${j}`]),
        });
      }
    }
  }

  while (queue.length > 0) {
    const { row, col, index, visited } = queue.shift()!;

    if (index === word.length - 1) {
      return true;
    }

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const key = `${newRow},${newCol}`;

      if (
        newRow >= 0 &&
        newRow < m &&
        newCol >= 0 &&
        newCol < n &&
        !visited.has(key) &&
        board[newRow][newCol] === word[index + 1]
      ) {
        const newVisited = new Set(visited);
        newVisited.add(key);
        queue.push({
          row: newRow,
          col: newCol,
          index: index + 1,
          visited: newVisited,
        });
      }
    }
  }

  return false;
}

// Test cases
function testExist() {
  console.log("=== Testing Word Search ===\n");

  const testCases = [
    {
      board: [
        ["A", "B", "C", "E"],
        ["S", "F", "C", "S"],
        ["A", "D", "E", "E"],
      ],
      word: "ABCCED",
      expected: true,
      description: "Word exists",
    },
    {
      board: [
        ["A", "B", "C", "E"],
        ["S", "F", "C", "S"],
        ["A", "D", "E", "E"],
      ],
      word: "SEE",
      expected: true,
      description: "Word exists",
    },
    {
      board: [
        ["A", "B", "C", "E"],
        ["S", "F", "C", "S"],
        ["A", "D", "E", "E"],
      ],
      word: "ABCB",
      expected: false,
      description: "Word doesn't exist",
    },
    {
      board: [
        ["A", "B", "C", "E"],
        ["S", "F", "C", "S"],
        ["A", "D", "E", "E"],
      ],
      word: "A",
      expected: true,
      description: "Single character",
    },
    {
      board: [["A"]],
      word: "A",
      expected: true,
      description: "Single cell",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Board: ${JSON.stringify(testCase.board)}`);
    console.log(`Word: "${testCase.word}"`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Backtracking)
    const result1 = exist(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 1 (Backtracking): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Visited Array)
    const result2 = existVisited(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 2 (Visited Array): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Set)
    const result3 = existSet(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 3 (Set): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Map)
    const result4 = existMap(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 4 (Map): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Class)
    const result5 = existClass(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 5 (Class): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Functional)
    const result6 = existFunctional(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 6 (Functional): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Stack)
    const result7 = existStack(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 7 (Stack): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Generator)
    const result8 = existWithGenerator(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 8 (Generator): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Early Termination)
    const result9 = existEarlyTermination(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 9 (Early Termination): ${result9} ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (BFS)
    const result10 = existBFS(
      [...testCase.board.map((row) => [...row])],
      testCase.word
    );
    console.log(
      `Solution 10 (BFS): ${result10} ${
        result10 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Backtracking", func: exist },
    { name: "Visited Array", func: existVisited },
    { name: "Set", func: existSet },
    { name: "Map", func: existMap },
    { name: "Class", func: existClass },
    { name: "Functional", func: existFunctional },
    { name: "Stack", func: existStack },
    { name: "Generator", func: existWithGenerator },
    { name: "Early Termination", func: existEarlyTermination },
    { name: "BFS", func: existBFS },
  ];

  // Create test cases
  const smallCase = {
    board: [
      ["A", "B", "C"],
      ["D", "E", "F"],
      ["G", "H", "I"],
    ],
    word: "ABC",
  };
  const mediumCase = {
    board: [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ],
    word: "ABCCED",
  };
  const largeCase = {
    board: [
      ["A", "B", "C", "D"],
      ["E", "F", "G", "H"],
      ["I", "J", "K", "L"],
      ["M", "N", "O", "P"],
    ],
    word: "ABCDEFGHIJKLMNOP",
  };

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(
        [...testCase.board.map((row) => [...row])],
        testCase.word
      );
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testExist();
// performanceComparison();

export {
  exist,
  existVisited,
  existSet,
  existMap,
  existClass,
  existFunctional,
  existStack,
  existWithGenerator,
  existEarlyTermination,
  existBFS,
  WordSearch,
  existGenerator,
  testExist,
  performanceComparison,
};
{% endraw %}
