/**
 * 78. Subsets
 *
 * Problem:
 * Given an integer array nums of unique elements, return all possible subsets
 * (the power set).
 *
 * The solution set must not contain duplicate subsets. Return the solution in any order.
 *
 * Example:
 * Input: nums = [1,2,3]
 * Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 *
 * Input: nums = [0]
 * Output: [[],[0]]
 *
 * LeetCode: https://leetcode.com/problems/subsets/
 */

/**
 * Solution 1: Backtracking (Optimal)
 *
 * Approach:
 * - Use recursive backtracking to generate all subsets
 * - For each element, choose to include or exclude it
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(n) - recursion stack
 */
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, current: number[]) {
    result.push([...current]);

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}

/**
 * Solution 2: Iterative with Bit Manipulation
 *
 * Approach:
 * - Use bit manipulation to generate all possible combinations
 * - Each bit represents whether to include an element
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(1) - excluding result space
 */
function subsetsBitwise(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;

  for (let i = 0; i < 1 << n; i++) {
    const subset: number[] = [];

    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        subset.push(nums[j]);
      }
    }

    result.push(subset);
  }

  return result;
}

/**
 * Solution 3: Iterative Approach
 *
 * Approach:
 * - Build subsets incrementally
 * - For each element, add it to all existing subsets
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(2^n)
 */
function subsetsIterative(nums: number[]): number[][] {
  const result: number[][] = [[]];

  for (const num of nums) {
    const size = result.length;
    for (let i = 0; i < size; i++) {
      result.push([...result[i], num]);
    }
  }

  return result;
}

/**
 * Solution 4: Recursive with Include/Exclude
 *
 * Approach:
 * - For each element, recursively generate subsets with and without it
 * - More explicit include/exclude logic
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(n) - recursion stack
 */
function subsetsRecursive(nums: number[]): number[][] {
  const result: number[][] = [];

  function generateSubsets(index: number, current: number[]) {
    if (index === nums.length) {
      result.push([...current]);
      return;
    }

    // Exclude current element
    generateSubsets(index + 1, current);

    // Include current element
    current.push(nums[index]);
    generateSubsets(index + 1, current);
    current.pop();
  }

  generateSubsets(0, []);
  return result;
}

/**
 * Solution 5: Using Array Methods
 *
 * Approach:
 * - Use array methods to generate subsets
 * - More functional programming style
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(2^n)
 */
function subsetsArray(nums: number[]): number[][] {
  if (nums.length === 0) return [[]];

  const [first, ...rest] = nums;
  const restSubsets = subsetsArray(rest);

  return [...restSubsets, ...restSubsets.map((subset) => [first, ...subset])];
}

/**
 * Solution 6: Using Map
 *
 * Approach:
 * - Use Map to track generated subsets
 * - Avoid duplicates automatically
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(2^n)
 */
function subsetsMap(nums: number[]): number[][] {
  const result = new Map<string, number[]>();
  result.set("", []);

  function generateSubsets(index: number, current: number[]) {
    if (index === nums.length) {
      const key = current.sort().join(",");
      result.set(key, [...current]);
      return;
    }

    // Exclude current element
    generateSubsets(index + 1, current);

    // Include current element
    current.push(nums[index]);
    generateSubsets(index + 1, current);
    current.pop();
  }

  generateSubsets(0, []);
  return Array.from(result.values());
}

/**
 * Solution 7: Using Set
 *
 * Approach:
 * - Use Set to track unique subsets
 * - Convert to string for comparison
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(2^n)
 */
function subsetsSet(nums: number[]): number[][] {
  const result = new Set<string>();
  result.add("");

  function generateSubsets(index: number, current: number[]) {
    if (index === nums.length) {
      result.add(current.sort().join(","));
      return;
    }

    // Exclude current element
    generateSubsets(index + 1, current);

    // Include current element
    current.push(nums[index]);
    generateSubsets(index + 1, current);
    current.pop();
  }

  generateSubsets(0, []);
  return Array.from(result).map((s) =>
    s === "" ? [] : s.split(",").map(Number)
  );
}

/**
 * Solution 8: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield subsets
 * - Memory efficient for large arrays
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(n)
 */
function* subsetsGenerator(nums: number[]): Generator<number[]> {
  function* generateSubsets(
    index: number,
    current: number[]
  ): Generator<number[]> {
    if (index === nums.length) {
      yield [...current];
      return;
    }

    // Exclude current element
    yield* generateSubsets(index + 1, current);

    // Include current element
    current.push(nums[index]);
    yield* generateSubsets(index + 1, current);
    current.pop();
  }

  yield* generateSubsets(0, []);
}

function subsetsWithGenerator(nums: number[]): number[][] {
  return Array.from(subsetsGenerator(nums));
}

/**
 * Solution 9: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a SubsetGenerator class
 * - Encapsulate the generation logic
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(2^n)
 */
class SubsetGenerator {
  private nums: number[];
  private result: number[][];

  constructor(nums: number[]) {
    this.nums = nums;
    this.result = [];
  }

  generateSubsets(): number[][] {
    this.result = [];
    this.backtrack(0, []);
    return this.result;
  }

  private backtrack(start: number, current: number[]): void {
    this.result.push([...current]);

    for (let i = start; i < this.nums.length; i++) {
      current.push(this.nums[i]);
      this.backtrack(i + 1, current);
      current.pop();
    }
  }

  getSubsets(): number[][] {
    return [...this.result];
  }
}

function subsetsClass(nums: number[]): number[][] {
  const generator = new SubsetGenerator(nums);
  return generator.generateSubsets();
}

/**
 * Solution 10: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(2^n)
 */
function subsetsFunctional(nums: number[]): number[][] {
  if (nums.length === 0) return [[]];

  const [first, ...rest] = nums;
  const restSubsets = subsetsFunctional(rest);

  return restSubsets.reduce((acc, subset) => {
    acc.push(subset);
    acc.push([first, ...subset]);
    return acc;
  }, [] as number[][]);
}

/**
 * Solution 11: Using Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Iterative approach with explicit stack
 *
 * Time Complexity: O(2^n)
 * Space Complexity: O(2^n)
 */
function subsetsStack(nums: number[]): number[][] {
  const result: number[][] = [];
  const stack: { index: number; current: number[] }[] = [
    { index: 0, current: [] },
  ];

  while (stack.length > 0) {
    const { index, current } = stack.pop()!;

    if (index === nums.length) {
      result.push([...current]);
      continue;
    }

    // Exclude current element
    stack.push({ index: index + 1, current: [...current] });

    // Include current element
    stack.push({ index: index + 1, current: [...current, nums[index]] });
  }

  return result;
}

// Test cases
function testSubsets() {
  console.log("=== Testing Subsets ===\n");

  const testCases = [
    {
      input: [1, 2, 3],
      expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]],
      description: "Three elements",
    },
    {
      input: [0],
      expected: [[], [0]],
      description: "Single element",
    },
    {
      input: [],
      expected: [[]],
      description: "Empty array",
    },
    {
      input: [1, 2],
      expected: [[], [1], [2], [1, 2]],
      description: "Two elements",
    },
    {
      input: [1, 2, 3, 4],
      expected: [
        [],
        [1],
        [2],
        [1, 2],
        [3],
        [1, 3],
        [2, 3],
        [1, 2, 3],
        [4],
        [1, 4],
        [2, 4],
        [1, 2, 4],
        [3, 4],
        [1, 3, 4],
        [2, 3, 4],
        [1, 2, 3, 4],
      ],
      description: "Four elements",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${JSON.stringify(testCase.expected)}\n`);

    // Test Solution 1 (Backtracking)
    const result1 = subsets([...testCase.input]);
    console.log(
      `Solution 1 (Backtracking): ${JSON.stringify(result1)} ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Bitwise)
    const result2 = subsetsBitwise([...testCase.input]);
    console.log(
      `Solution 2 (Bitwise): ${JSON.stringify(result2)} ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Iterative)
    const result3 = subsetsIterative([...testCase.input]);
    console.log(
      `Solution 3 (Iterative): ${JSON.stringify(result3)} ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Recursive)
    const result4 = subsetsRecursive([...testCase.input]);
    console.log(
      `Solution 4 (Recursive): ${JSON.stringify(result4)} ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Array Methods)
    const result5 = subsetsArray([...testCase.input]);
    console.log(
      `Solution 5 (Array Methods): ${JSON.stringify(result5)} ${
        JSON.stringify(result5.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Map)
    const result6 = subsetsMap([...testCase.input]);
    console.log(
      `Solution 6 (Map): ${JSON.stringify(result6)} ${
        JSON.stringify(result6.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Set)
    const result7 = subsetsSet([...testCase.input]);
    console.log(
      `Solution 7 (Set): ${JSON.stringify(result7)} ${
        JSON.stringify(result7.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Generator)
    const result8 = subsetsWithGenerator([...testCase.input]);
    console.log(
      `Solution 8 (Generator): ${JSON.stringify(result8)} ${
        JSON.stringify(result8.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Class)
    const result9 = subsetsClass([...testCase.input]);
    console.log(
      `Solution 9 (Class): ${JSON.stringify(result9)} ${
        JSON.stringify(result9.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Functional)
    const result10 = subsetsFunctional([...testCase.input]);
    console.log(
      `Solution 10 (Functional): ${JSON.stringify(result10)} ${
        JSON.stringify(result10.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 11 (Stack)
    const result11 = subsetsStack([...testCase.input]);
    console.log(
      `Solution 11 (Stack): ${JSON.stringify(result11)} ${
        JSON.stringify(result11.sort()) ===
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
    { name: "Backtracking", func: subsets },
    { name: "Bitwise", func: subsetsBitwise },
    { name: "Iterative", func: subsetsIterative },
    { name: "Recursive", func: subsetsRecursive },
    { name: "Array Methods", func: subsetsArray },
    { name: "Map", func: subsetsMap },
    { name: "Set", func: subsetsSet },
    { name: "Generator", func: subsetsWithGenerator },
    { name: "Class", func: subsetsClass },
    { name: "Functional", func: subsetsFunctional },
    { name: "Stack", func: subsetsStack },
  ];

  // Create test cases
  const smallCase = [1, 2, 3];
  const mediumCase = [1, 2, 3, 4, 5];
  const largeCase = [1, 2, 3, 4, 5, 6, 7, 8];

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...testCase]);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (${
          result.length
        } subsets)`
      );
    });

    console.log("");
  });
}

// Power set analysis
function powerSetAnalysis() {
  console.log("=== Power Set Analysis ===\n");

  const testArrays = [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]];

  testArrays.forEach((arr, index) => {
    console.log(`Array ${index + 1}: [${arr.join(", ")}]`);
    const result = subsets(arr);
    console.log(
      `Power set size: ${result.length} (2^${arr.length} = ${Math.pow(
        2,
        arr.length
      )})`
    );
    console.log(`Subsets: ${JSON.stringify(result)}`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testSubsets();
// performanceComparison();
// powerSetAnalysis();

export {
  subsets,
  subsetsBitwise,
  subsetsIterative,
  subsetsRecursive,
  subsetsArray,
  subsetsMap,
  subsetsSet,
  subsetsWithGenerator,
  subsetsClass,
  subsetsFunctional,
  subsetsStack,
  SubsetGenerator,
  subsetsGenerator,
  testSubsets,
  performanceComparison,
  powerSetAnalysis,
};
