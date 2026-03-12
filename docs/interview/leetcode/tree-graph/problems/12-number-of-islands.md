---
layout: page
title: "Number of Island"
difficulty: Hard
category: Tree/Graph
tags: [Tree/Graph, Hash Table]
leetcode_url: "https://leetcode.com/problems/number-of-islands/"
---

# Number of Island



## Problem Description

 *  * Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water),  * return the number of islands.  *  * An island is surrounded by water and is formed by connecting adjacent lands horizontally 

## Solutions

{% raw %}
/**
 * Number of Islands
 *
 * Problem: https://leetcode.com/problems/number-of-islands/
 *
 * Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water),
 * return the number of islands.
 *
 * An island is surrounded by water and is formed by connecting adjacent lands horizontally
 * or vertically. You may assume all four edges of the grid are all surrounded by water.
 *
 * Example 1:
 * Input: grid = [
 *   ["1","1","1","1","0"],
 *   ["1","1","0","1","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","0","0","0"]
 * ]
 * Output: 1
 *
 * Example 2:
 * Input: grid = [
 *   ["1","1","0","0","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","1","0","0"],
 *   ["0","0","0","1","1"]
 * ]
 * Output: 3
 *
 * Constraints:
 * - m == grid.length
 * - n == grid[i].length
 * - 1 <= m, n <= 300
 * - grid[i][j] is '0' or '1'.
 *
 * Solution Approach:
 * 1. DFS (Depth-First Search) with flood fill
 * 2. BFS (Breadth-First Search) with flood fill
 * 3. Union-Find (Disjoint Set) approach
 * 4. Mark visited cells to avoid revisiting
 *
 * Time Complexity: O(m * n) where m and n are grid dimensions
 * Space Complexity: O(m * n) for recursion stack or queue
 */

/**
 * Number of Islands - DFS Solution
 *
 * Giải pháp DFS cho bài toán Số lượng đảo
 *
 * @param grid - 2D binary grid representing land and water
 * @returns Number of islands
 */
function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;

  const m = grid.length;
  const n = grid[0].length;
  let count = 0;

  // DFS function to mark connected land cells
  function dfs(row: number, col: number): void {
    // Check boundaries and if cell is land
    if (row < 0 || row >= m || col < 0 || col >= n || grid[row][col] === "0") {
      return;
    }

    // Mark current cell as visited (water)
    grid[row][col] = "0";

    // Explore all four directions
    dfs(row - 1, col); // up
    dfs(row + 1, col); // down
    dfs(row, col - 1); // left
    dfs(row, col + 1); // right
  }

  // Iterate through all cells
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        count++;
        dfs(i, j);
      }
    }
  }

  return count;
}

/**
 * Alternative Solution: BFS Approach
 *
 * Giải pháp thay thế: Phương pháp BFS
 *
 * @param grid - 2D binary grid representing land and water
 * @returns Number of islands
 */
function numIslandsBFS(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;

  const m = grid.length;
  const n = grid[0].length;
  let count = 0;

  // BFS function to mark connected land cells
  function bfs(row: number, col: number): void {
    const queue: [number, number][] = [[row, col]];
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]; // up, down, left, right

    while (queue.length > 0) {
      const [currentRow, currentCol] = queue.shift()!;

      // Mark current cell as visited
      grid[currentRow][currentCol] = "0";

      // Check all four directions
      for (const [dr, dc] of directions) {
        const newRow = currentRow + dr;
        const newCol = currentCol + dc;

        if (
          newRow >= 0 &&
          newRow < m &&
          newCol >= 0 &&
          newCol < n &&
          grid[newRow][newCol] === "1"
        ) {
          queue.push([newRow, newCol]);
        }
      }
    }
  }

  // Iterate through all cells
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        count++;
        bfs(i, j);
      }
    }
  }

  return count;
}

/**
 * Union-Find Solution
 *
 * Giải pháp Union-Find
 *
 * @param grid - 2D binary grid representing land and water
 * @returns Number of islands
 */
function numIslandsUnionFind(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;

  const m = grid.length;
  const n = grid[0].length;

  // Union-Find class
  class UnionFind {
    private parent: number[];
    private rank: number[];
    private count: number;

    constructor(size: number) {
      this.parent = Array.from({ length: size }, (_, i) => i);
      this.rank = new Array(size).fill(0);
      this.count = size;
    }

    find(x: number): number {
      if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);
      }
      return this.parent[x];
    }

    union(x: number, y: number): void {
      const rootX = this.find(x);
      const rootY = this.find(y);

      if (rootX !== rootY) {
        if (this.rank[rootX] < this.rank[rootY]) {
          this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
          this.parent[rootY] = rootX;
        } else {
          this.parent[rootY] = rootX;
          this.rank[rootX]++;
        }
        this.count--;
      }
    }

    getCount(): number {
      return this.count;
    }
  }

  // Count land cells and create Union-Find
  let landCount = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        landCount++;
      }
    }
  }

  const uf = new UnionFind(landCount);
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Convert 2D coordinates to 1D indices
  const getIndex = (row: number, col: number): number => {
    return row * n + col;
  };

  // Union adjacent land cells
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        const currentIndex = getIndex(i, j);

        for (const [dr, dc] of directions) {
          const newRow = i + dr;
          const newCol = j + dc;

          if (
            newRow >= 0 &&
            newRow < m &&
            newCol >= 0 &&
            newCol < n &&
            grid[newRow][newCol] === "1"
          ) {
            const neighborIndex = getIndex(newRow, newCol);
            uf.union(currentIndex, neighborIndex);
          }
        }
      }
    }
  }

  return uf.getCount();
}

/**
 * Solution with Island Tracking
 *
 * Giải pháp với theo dõi đảo
 *
 * @param grid - 2D binary grid representing land and water
 * @returns Object containing island count and island information
 */
function numIslandsWithTracking(grid: string[][]): {
  count: number;
  islands: Array<{ id: number; cells: [number, number][]; size: number }>;
} {
  if (!grid || grid.length === 0) return { count: 0, islands: [] };

  const m = grid.length;
  const n = grid[0].length;
  let islandId = 0;
  const islands: Array<{
    id: number;
    cells: [number, number][];
    size: number;
  }> = [];

  function dfs(
    row: number,
    col: number,
    currentIsland: [number, number][]
  ): void {
    if (row < 0 || row >= m || col < 0 || col >= n || grid[row][col] === "0") {
      return;
    }

    grid[row][col] = "0";
    currentIsland.push([row, col]);

    dfs(row - 1, col, currentIsland);
    dfs(row + 1, col, currentIsland);
    dfs(row, col - 1, currentIsland);
    dfs(row, col + 1, currentIsland);
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        const currentIsland: [number, number][] = [];
        dfs(i, j, currentIsland);

        islands.push({
          id: islandId++,
          cells: currentIsland,
          size: currentIsland.length,
        });
      }
    }
  }

  return { count: islands.length, islands };
}

/**
 * Solution with Grid Visualization
 *
 * Giải pháp với hiển thị lưới
 *
 * @param grid - 2D binary grid representing land and water
 * @returns Object containing count and visualization
 */
function numIslandsWithVisualization(grid: string[][]): {
  count: number;
  visualization: string;
} {
  const { count, islands } = numIslandsWithTracking(grid);

  let visualization = "Grid Visualization:\n";
  visualization += "Hiển thị lưới:\n\n";

  // Create a copy of the grid for visualization
  const visGrid = grid.map((row) => [...row]);

  // Mark islands with different characters
  for (let i = 0; i < islands.length; i++) {
    const islandChar = String.fromCharCode(65 + i); // A, B, C, ...
    for (const [row, col] of islands[i].cells) {
      visGrid[row][col] = islandChar;
    }
  }

  // Display the grid
  for (let i = 0; i < visGrid.length; i++) {
    visualization += `Row ${i}: [${visGrid[i].join(", ")}]\n`;
  }

  visualization += `\nTotal Islands: ${count}\n`;
  visualization += `Tổng số đảo: ${count}\n\n`;

  for (const island of islands) {
    visualization += `Island ${island.id} (${String.fromCharCode(
      65 + island.id
    )}): ${island.size} cells\n`;
    visualization += `Đảo ${island.id} (${String.fromCharCode(
      65 + island.id
    )}): ${island.size} ô\n`;
  }

  return { count, visualization };
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Number of Islands Tests ===");
  console.log("=== Kiểm thử bài toán Số lượng đảo ===\n");

  const testCases = [
    {
      name: "Example 1: Single island",
      input: [
        ["1", "1", "1", "1", "0"],
        ["1", "1", "0", "1", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "0", "0", "0"],
      ],
      expected: 1,
      description: "One large island",
    },
    {
      name: "Example 2: Three islands",
      input: [
        ["1", "1", "0", "0", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "1", "0", "0"],
        ["0", "0", "0", "1", "1"],
      ],
      expected: 3,
      description: "Three separate islands",
    },
    {
      name: "Empty grid",
      input: [],
      expected: 0,
      description: "Empty grid",
    },
    {
      name: "All water",
      input: [
        ["0", "0", "0"],
        ["0", "0", "0"],
        ["0", "0", "0"],
      ],
      expected: 0,
      description: "Grid with only water",
    },
    {
      name: "All land",
      input: [
        ["1", "1", "1"],
        ["1", "1", "1"],
        ["1", "1", "1"],
      ],
      expected: 1,
      description: "Grid with only land",
    },
    {
      name: "Diagonal islands",
      input: [
        ["1", "0", "1"],
        ["0", "1", "0"],
        ["1", "0", "1"],
      ],
      expected: 5,
      description: "Five separate single-cell islands",
    },
    {
      name: "Large single island",
      input: [
        ["1", "1", "1", "1", "1"],
        ["1", "0", "0", "0", "1"],
        ["1", "0", "1", "0", "1"],
        ["1", "0", "0", "0", "1"],
        ["1", "1", "1", "1", "1"],
      ],
      expected: 2,
      description: "One large island with one small island inside",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);

    // Create a copy of the input grid for each test
    const grid1 = testCase.input.map((row) => [...row]);
    const grid2 = testCase.input.map((row) => [...row]);
    const grid3 = testCase.input.map((row) => [...row]);

    // Test DFS solution
    const result1 = numIslands(grid1);
    const passed1 = result1 === testCase.expected;

    console.log(`DFS Result: ${result1}`);
    console.log(`DFS Status: ${passed1 ? "✅ PASSED" : "❌ FAILED"}`);

    // Test BFS solution
    const result2 = numIslandsBFS(grid2);
    const passed2 = result2 === testCase.expected;

    console.log(`BFS Result: ${result2}`);
    console.log(`BFS Status: ${passed2 ? "✅ PASSED" : "❌ FAILED"}`);

    // Test Union-Find solution
    const result3 = numIslandsUnionFind(grid3);
    const passed3 = result3 === testCase.expected;

    console.log(`Union-Find Result: ${result3}`);
    console.log(`Union-Find Status: ${passed3 ? "✅ PASSED" : "❌ FAILED"}`);

    const allPassed = passed1 && passed2 && passed3;
    console.log(`All implementations match: ${allPassed ? "✅ Yes" : "❌ No"}`);

    console.log("---");
  }

  // Test with visualization
  console.log("\n=== Testing with Visualization ===");
  console.log("=== Kiểm thử với hiển thị ===\n");

  const testGrid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ];

  const { count, visualization } = numIslandsWithVisualization(testGrid);
  console.log(visualization);

  // Test with island tracking
  console.log("\n=== Testing with Island Tracking ===");
  console.log("=== Kiểm thử với theo dõi đảo ===\n");

  const testGrid2 = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ];

  const { count: count2, islands } = numIslandsWithTracking(testGrid2);

  console.log(`Total islands: ${count2}`);
  console.log(`Tổng số đảo: ${count2}`);

  for (const island of islands) {
    console.log(
      `Island ${island.id}: ${island.size} cells at positions: ${JSON.stringify(
        island.cells
      )}`
    );
  }

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  // Create a large grid
  const largeGrid: string[][] = [];
  for (let i = 0; i < 100; i++) {
    const row: string[] = [];
    for (let j = 0; j < 100; j++) {
      row.push(Math.random() > 0.7 ? "1" : "0");
    }
    largeGrid.push(row);
  }

  console.log("Testing with large grid (100x100)...");
  console.log("Kiểm thử với lưới lớn (100x100)...");

  const start1 = performance.now();
  const result1 = numIslands(largeGrid.map((row) => [...row]));
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = numIslandsBFS(largeGrid.map((row) => [...row]));
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = numIslandsUnionFind(largeGrid.map((row) => [...row]));
  const time3 = performance.now() - start3;

  console.log(`DFS: ${time1.toFixed(4)}ms, Islands: ${result1}`);
  console.log(`BFS: ${time2.toFixed(4)}ms, Islands: ${result2}`);
  console.log(`Union-Find: ${time3.toFixed(4)}ms, Islands: ${result3}`);

  const resultsMatch = result1 === result2 && result2 === result3;
  console.log(`Results match: ${resultsMatch ? "✅ Yes" : "❌ No"}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  numIslands,
  numIslandsBFS,
  numIslandsUnionFind,
  numIslandsWithTracking,
  numIslandsWithVisualization,
};
{% endraw %}
