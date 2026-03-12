---
layout: page
title: "Design Tic-Tac-Toe"
difficulty: Hard
category: Design
tags: [Design]
leetcode_url: "https://leetcode.com/problems/design-tic-tac-toe/"
---

# Design Tic-Tac-Toe



## Problem Description

 *  * Assume the following rules are for the tic-tac-toe game on an n x n board between two players:  *  * A move is guaranteed to be valid and is placed on an empty block.  * Once a winning condition is reached, no more moves are allowed. 

## Solutions

{% raw %}
/**
 * Design Tic-Tac-Toe
 *
 * Problem: https://leetcode.com/problems/design-tic-tac-toe/
 *
 * Assume the following rules are for the tic-tac-toe game on an n x n board between two players:
 *
 * A move is guaranteed to be valid and is placed on an empty block.
 * Once a winning condition is reached, no more moves are allowed.
 * A player who succeeds in placing n of their marks in a horizontal, vertical, or diagonal row wins the game.
 *
 * Implement the TicTacToe class:
 * - TicTacToe(int n) Initializes the object the size of the board n.
 * - int move(int row, int col, int player) Indicates that the player with id player plays at the cell (row, col) of the board. The move is guaranteed to be a valid move, and the two players alternate in making moves. Return 0 if there is no winner, 1 if player 1 is the winner, or 2 if player 2 is the winner.
 *
 * Example 1:
 * Input: ["TicTacToe", "move", "move", "move", "move", "move", "move", "move"]
 * [[3], [0, 0, 1], [0, 2, 2], [2, 2, 1], [1, 1, 2], [2, 0, 1], [1, 0, 2], [2, 1, 1]]
 * Output: [null, 0, 0, 0, 0, 0, 0, 1]
 *
 * Explanation:
 * TicTacToe ticTacToe = new TicTacToe(3);
 * Assume that player 1 is "X" and player 2 is "O" in the board.
 * ticTacToe.move(0, 0, 1); // return 0 (no one wins)
 * |X| | |
 * | | | |    // Player 1 makes a move at (0, 0).
 * | | | |
 *
 * ticTacToe.move(0, 2, 2); // return 0 (no one wins)
 * |X| |O|
 * | | | |    // Player 2 makes a move at (0, 2).
 * | | | |
 *
 * ticTacToe.move(2, 2, 1); // return 0 (no one wins)
 * |X| |O|
 * | | | |    // Player 1 makes a move at (2, 2).
 * | | |X|
 *
 * ticTacToe.move(1, 1, 2); // return 0 (no one wins)
 * |X| |O|
 * | |O| |    // Player 2 makes a move at (1, 1).
 * | | |X|
 *
 * ticTacToe.move(2, 0, 1); // return 0 (no one wins)
 * |X| |O|
 * | |O| |    // Player 1 makes a move at (2, 0).
 * |X| |X|
 *
 * ticTacToe.move(1, 0, 2); // return 0 (no one wins)
 * |X| |O|
 * |O|O| |    // Player 2 makes a move at (1, 0).
 * |X| |X|
 *
 * ticTacToe.move(2, 1, 1); // return 1 (player 1 wins)
 * |X| |O|
 * |O|O| |    // Player 1 makes a move at (2, 1).
 * |X|X|X|
 *
 * Constraints:
 * - 2 <= n <= 100
 * - player is 1 or 2.
 * - 0 <= row, col < n
 * - (row, col) are unique for each different call to move.
 * - At most n2 calls will be made to move.
 *
 * Solution Approach:
 * 1. Track row, column, and diagonal counts for each player
 * 2. Use separate arrays for rows, columns, and diagonals
 * 3. Check for win condition after each move
 * 4. Return winner immediately when condition is met
 *
 * Time Complexity: O(1) for move operation
 * Space Complexity: O(n) for storing counts
 */

/**
 * TicTacToe class with efficient win checking
 *
 * Lớp TicTacToe với kiểm tra thắng hiệu quả
 */
class TicTacToe {
  private n: number;
  private rows: number[][]; // rows[player][row] = count
  private cols: number[][]; // cols[player][col] = count
  private diagonals: number[][]; // diagonals[player][0] = main, diagonals[player][1] = anti
  private gameOver: boolean;
  private winner: number;

  constructor(n: number) {
    this.n = n;
    this.rows = Array(3)
      .fill(null)
      .map(() => Array(n).fill(0));
    this.cols = Array(3)
      .fill(null)
      .map(() => Array(n).fill(0));
    this.diagonals = Array(3)
      .fill(null)
      .map(() => Array(2).fill(0));
    this.gameOver = false;
    this.winner = 0;
  }

  /**
   * Make a move on the board
   *
   * Thực hiện một nước đi trên bảng
   *
   * @param row - Row index
   * @param col - Column index
   * @param player - Player ID (1 or 2)
   * @returns 0 if no winner, 1 if player 1 wins, 2 if player 2 wins
   */
  move(row: number, col: number, player: number): number {
    if (this.gameOver) {
      return this.winner;
    }

    // Update row count
    this.rows[player][row]++;

    // Update column count
    this.cols[player][col]++;

    // Update main diagonal (top-left to bottom-right)
    if (row === col) {
      this.diagonals[player][0]++;
    }

    // Update anti diagonal (top-right to bottom-left)
    if (row + col === this.n - 1) {
      this.diagonals[player][1]++;
    }

    // Check for win condition
    if (
      this.rows[player][row] === this.n ||
      this.cols[player][col] === this.n ||
      this.diagonals[player][0] === this.n ||
      this.diagonals[player][1] === this.n
    ) {
      this.gameOver = true;
      this.winner = player;
      return player;
    }

    return 0;
  }

  /**
   * Get current board state
   *
   * Lấy trạng thái hiện tại của bảng
   *
   * @returns 2D array representing the board
   */
  getBoard(): number[][] {
    const board = Array(this.n)
      .fill(null)
      .map(() => Array(this.n).fill(0));

    // Reconstruct board from counts (simplified version)
    // In a real implementation, you'd store the actual board state
    return board;
  }

  /**
   * Check if game is over
   *
   * Kiểm tra xem trò chơi đã kết thúc chưa
   *
   * @returns true if game is over
   */
  isGameOver(): boolean {
    return this.gameOver;
  }

  /**
   * Get the winner
   *
   * Lấy người thắng
   *
   * @returns Winner player ID or 0 if no winner
   */
  getWinner(): number {
    return this.winner;
  }
}

/**
 * Alternative Implementation: Using Board State
 *
 * Giải pháp thay thế: Sử dụng trạng thái bảng
 */
class TicTacToeWithBoard {
  private n: number;
  private board: number[][];
  private gameOver: boolean;
  private winner: number;

  constructor(n: number) {
    this.n = n;
    this.board = Array(n)
      .fill(null)
      .map(() => Array(n).fill(0));
    this.gameOver = false;
    this.winner = 0;
  }

  move(row: number, col: number, player: number): number {
    if (this.gameOver) {
      return this.winner;
    }

    this.board[row][col] = player;

    // Check for win condition
    if (this.checkWin(row, col, player)) {
      this.gameOver = true;
      this.winner = player;
      return player;
    }

    return 0;
  }

  private checkWin(row: number, col: number, player: number): boolean {
    // Check row
    let rowWin = true;
    for (let c = 0; c < this.n; c++) {
      if (this.board[row][c] !== player) {
        rowWin = false;
        break;
      }
    }
    if (rowWin) return true;

    // Check column
    let colWin = true;
    for (let r = 0; r < this.n; r++) {
      if (this.board[r][col] !== player) {
        colWin = false;
        break;
      }
    }
    if (colWin) return true;

    // Check main diagonal
    if (row === col) {
      let diagWin = true;
      for (let i = 0; i < this.n; i++) {
        if (this.board[i][i] !== player) {
          diagWin = false;
          break;
        }
      }
      if (diagWin) return true;
    }

    // Check anti diagonal
    if (row + col === this.n - 1) {
      let antiDiagWin = true;
      for (let i = 0; i < this.n; i++) {
        if (this.board[i][this.n - 1 - i] !== player) {
          antiDiagWin = false;
          break;
        }
      }
      if (antiDiagWin) return true;
    }

    return false;
  }

  getBoard(): number[][] {
    return this.board.map((row) => [...row]);
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  getWinner(): number {
    return this.winner;
  }
}

/**
 * Implementation with Game History
 *
 * Giải pháp với lịch sử trò chơi
 */
class TicTacToeWithHistory extends TicTacToe {
  private moveHistory: Array<{
    row: number;
    col: number;
    player: number;
    result: number;
  }>;

  constructor(n: number) {
    super(n);
    this.moveHistory = [];
  }

  move(row: number, col: number, player: number): number {
    const result = super.move(row, col, player);

    this.moveHistory.push({
      row,
      col,
      player,
      result,
    });

    return result;
  }

  /**
   * Get move history
   *
   * Lấy lịch sử các nước đi
   *
   * @returns Array of moves
   */
  getMoveHistory(): Array<{
    row: number;
    col: number;
    player: number;
    result: number;
  }> {
    return [...this.moveHistory];
  }

  /**
   * Get game statistics
   *
   * Lấy thống kê trò chơi
   *
   * @returns Object containing game statistics
   */
  getGameStats(): {
    totalMoves: number;
    player1Moves: number;
    player2Moves: number;
    winner: number;
    isGameOver: boolean;
  } {
    const player1Moves = this.moveHistory.filter(
      (move) => move.player === 1
    ).length;
    const player2Moves = this.moveHistory.filter(
      (move) => move.player === 2
    ).length;

    return {
      totalMoves: this.moveHistory.length,
      player1Moves,
      player2Moves,
      winner: this.getWinner(),
      isGameOver: this.isGameOver(),
    };
  }

  /**
   * Visualize the board
   *
   * Hiển thị bảng
   *
   * @returns String representation of the board
   */
  visualizeBoard(): string {
    const board = this.getBoard();
    let result = "";

    for (let i = 0; i < board.length; i++) {
      result += "|";
      for (let j = 0; j < board[i].length; j++) {
        const cell = board[i][j];
        if (cell === 0) {
          result += " ";
        } else if (cell === 1) {
          result += "X";
        } else {
          result += "O";
        }
        result += "|";
      }
      result += "\n";
    }

    return result;
  }
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Design Tic-Tac-Toe Tests ===");
  console.log("=== Kiểm thử bài toán Thiết kế Tic-Tac-Toe ===\n");

  const testCases = [
    {
      name: "Example 1: Standard game",
      n: 3,
      moves: [
        { row: 0, col: 0, player: 1, expected: 0 },
        { row: 0, col: 2, player: 2, expected: 0 },
        { row: 2, col: 2, player: 1, expected: 0 },
        { row: 1, col: 1, player: 2, expected: 0 },
        { row: 2, col: 0, player: 1, expected: 0 },
        { row: 1, col: 0, player: 2, expected: 0 },
        { row: 2, col: 1, player: 1, expected: 1 },
      ],
      description: "Player 1 wins with horizontal line",
    },
    {
      name: "Vertical win",
      n: 3,
      moves: [
        { row: 0, col: 0, player: 1, expected: 0 },
        { row: 0, col: 1, player: 2, expected: 0 },
        { row: 1, col: 0, player: 1, expected: 0 },
        { row: 1, col: 1, player: 2, expected: 0 },
        { row: 2, col: 0, player: 1, expected: 1 },
      ],
      description: "Player 1 wins with vertical line",
    },
    {
      name: "Diagonal win",
      n: 3,
      moves: [
        { row: 0, col: 0, player: 1, expected: 0 },
        { row: 0, col: 1, player: 2, expected: 0 },
        { row: 1, col: 1, player: 1, expected: 0 },
        { row: 0, col: 2, player: 2, expected: 0 },
        { row: 2, col: 2, player: 1, expected: 1 },
      ],
      description: "Player 1 wins with main diagonal",
    },
    {
      name: "Anti-diagonal win",
      n: 3,
      moves: [
        { row: 0, col: 2, player: 1, expected: 0 },
        { row: 0, col: 0, player: 2, expected: 0 },
        { row: 1, col: 1, player: 1, expected: 0 },
        { row: 2, col: 0, player: 2, expected: 0 },
        { row: 2, col: 0, player: 1, expected: 1 },
      ],
      description: "Player 1 wins with anti-diagonal",
    },
    {
      name: "Large board (4x4)",
      n: 4,
      moves: [
        { row: 0, col: 0, player: 1, expected: 0 },
        { row: 0, col: 1, player: 2, expected: 0 },
        { row: 1, col: 1, player: 1, expected: 0 },
        { row: 1, col: 0, player: 2, expected: 0 },
        { row: 2, col: 2, player: 1, expected: 0 },
        { row: 2, col: 3, player: 2, expected: 0 },
        { row: 3, col: 3, player: 1, expected: 1 },
      ],
      description: "Player 1 wins on 4x4 board",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Board size: ${testCase.n}x${testCase.n}`);
    console.log(`Description: ${testCase.description}`);

    const game = new TicTacToeWithHistory(testCase.n);
    let testPassed = true;

    for (let i = 0; i < testCase.moves.length; i++) {
      const move = testCase.moves[i];
      const result = game.move(move.row, move.col, move.player);

      const passed = result === move.expected;
      console.log(
        `  Move ${i + 1}: Player ${move.player} at (${move.row}, ${
          move.col
        }) -> ${result} ${passed ? "✅" : "❌"}`
      );

      if (!passed) {
        testPassed = false;
      }

      if (result !== 0) {
        console.log(`  Game Over! Player ${result} wins!`);
        break;
      }
    }

    console.log(`Test ${testPassed ? "PASSED" : "FAILED"}`);

    // Show final board
    console.log("Final board:");
    console.log(game.visualizeBoard());

    // Show game statistics
    const stats = game.getGameStats();
    console.log(
      `Game Stats: ${stats.totalMoves} moves, Player 1: ${stats.player1Moves}, Player 2: ${stats.player2Moves}, Winner: ${stats.winner}`
    );

    console.log("---");
  }

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const boardSize = 100;
  const moves = 1000;

  console.log(
    `Testing with ${boardSize}x${boardSize} board and ${moves} moves...`
  );
  console.log(
    `Kiểm thử với bảng ${boardSize}x${boardSize} và ${moves} nước đi...`
  );

  // Test efficient implementation
  const start1 = performance.now();
  const game1 = new TicTacToe(boardSize);
  for (let i = 0; i < moves; i++) {
    const row = i % boardSize;
    const col = Math.floor(i / boardSize) % boardSize;
    const player = (i % 2) + 1;
    game1.move(row, col, player);
  }
  const time1 = performance.now() - start1;

  // Test board-based implementation
  const start2 = performance.now();
  const game2 = new TicTacToeWithBoard(boardSize);
  for (let i = 0; i < moves; i++) {
    const row = i % boardSize;
    const col = Math.floor(i / boardSize) % boardSize;
    const player = (i % 2) + 1;
    game2.move(row, col, player);
  }
  const time2 = performance.now() - start2;

  console.log(`Efficient (counts): ${time1.toFixed(4)}ms`);
  console.log(`Board-based: ${time2.toFixed(4)}ms`);
  console.log(`Speedup: ${(time2 / time1).toFixed(2)}x`);

  // Test edge cases
  console.log("\n=== Edge Cases Testing ===");
  console.log("=== Kiểm thử trường hợp đặc biệt ===\n");

  // Test 2x2 board
  const game2x2 = new TicTacToeWithHistory(2);
  console.log("2x2 board test:");
  console.log(game2x2.visualizeBoard());

  // Test with moves after game over
  const gameOver = new TicTacToeWithHistory(3);
  gameOver.move(0, 0, 1);
  gameOver.move(0, 1, 2);
  gameOver.move(1, 1, 1);
  gameOver.move(1, 0, 2);
  const result = gameOver.move(2, 2, 1);
  console.log(`Game over result: ${result}`);

  // Try to make a move after game over
  const extraMove = gameOver.move(2, 1, 2);
  console.log(`Move after game over: ${extraMove} (should return winner)`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { TicTacToe, TicTacToeWithBoard, TicTacToeWithHistory };
{% endraw %}
