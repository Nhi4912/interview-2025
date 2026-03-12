/**
 * 39. Combination Sum
 *
 * Problem:
 * Given an array of distinct integers candidates and a target integer target,
 * return a list of all unique combinations of candidates where the chosen numbers
 * sum to target. You may return the combinations in any order.
 *
 * The same number may be chosen from candidates an unlimited number of times.
 * Two combinations are unique if the frequency of at least one of the chosen
 * numbers is different.
 *
 * Example:
 * Input: candidates = [2,3,6,7], target = 7
 * Output: [[2,2,3],[7]]
 *
 * Input: candidates = [2,3,5], target = 8
 * Output: [[2,2,2,2],[2,3,3],[3,5]]
 *
 * Input: candidates = [2], target = 1
 * Output: []
 *
 * LeetCode: https://leetcode.com/problems/combination-sum/
 */

/**
 * Solution 1: Backtracking (Optimal)
 *
 * Approach:
 * - Use recursive backtracking to find all combinations
 * - Sort candidates first to avoid duplicates
 * - Use start index to avoid generating duplicate combinations
 *
 * Time Complexity: O(2^target) - exponential
 * Space Complexity: O(target) - recursion stack
 */
function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];

  // Sort candidates to avoid duplicates
  candidates.sort((a, b) => a - b);

  function backtrack(start: number, current: number[], sum: number) {
    if (sum === target) {
      result.push([...current]);
      return;
    }

    if (sum > target) {
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, current, sum + candidates[i]);
      current.pop();
    }
  }

  backtrack(0, [], 0);
  return result;
}

/**
 * Solution 2: Recursive with Early Pruning
 *
 * Approach:
 * - Add early pruning when sum exceeds target
 * - More efficient pruning strategy
 *
 * Time Complexity: O(2^target)
 * Space Complexity: O(target)
 */
function combinationSumPruning(
  candidates: number[],
  target: number
): number[][] {
  const result: number[][] = [];
  candidates.sort((a, b) => a - b);

  function backtrack(start: number, current: number[], sum: number) {
    if (sum === target) {
      result.push([...current]);
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      // Early pruning
      if (sum + candidates[i] > target) {
        break;
      }

      current.push(candidates[i]);
      backtrack(i, current, sum + candidates[i]);
      current.pop();
    }
  }

  backtrack(0, [], 0);
  return result;
}

/**
 * Solution 3: Using Set for Uniqueness
 *
 * Approach:
 * - Use Set to ensure uniqueness
 * - Convert combinations to strings for comparison
 *
 * Time Complexity: O(2^target)
 * Space Complexity: O(2^target)
 */
function combinationSumSet(candidates: number[], target: number): number[][] {
  const result = new Set<string>();
  candidates.sort((a, b) => a - b);

  function backtrack(start: number, current: number[], sum: number) {
    if (sum === target) {
      result.add(current.join(","));
      return;
    }

    if (sum > target) {
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, current, sum + candidates[i]);
      current.pop();
    }
  }

  backtrack(0, [], 0);
  return Array.from(result).map((s) => s.split(",").map(Number));
}

/**
 * Solution 4: Using Map for Frequency Tracking
 *
 * Approach:
 * - Use Map to track element frequencies
 * - More explicit frequency management
 *
 * Time Complexity: O(2^target)
 * Space Complexity: O(2^target)
 */
function combinationSumMap(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const freqMap = new Map<number, number>();
  candidates.sort((a, b) => a - b);

  function backtrack(start: number, current: number[], sum: number) {
    if (sum === target) {
      result.push([...current]);
      return;
    }

    if (sum > target) {
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      const num = candidates[i];
      freqMap.set(num, (freqMap.get(num) || 0) + 1);
      current.push(num);
      backtrack(i, current, sum + num);
      current.pop();
      freqMap.set(num, freqMap.get(num)! - 1);
    }
  }

  backtrack(0, [], 0);
  return result;
}

/**
 * Solution 5: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield combinations
 * - Memory efficient for large targets
 *
 * Time Complexity: O(2^target)
 * Space Complexity: O(target)
 */
function* combinationSumGenerator(
  candidates: number[],
  target: number
): Generator<number[]> {
  candidates.sort((a, b) => a - b);

  function* generate(
    start: number,
    current: number[],
    sum: number
  ): Generator<number[]> {
    if (sum === target) {
      yield [...current];
      return;
    }

    if (sum > target) {
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      yield* generate(i, current, sum + candidates[i]);
      current.pop();
    }
  }

  yield* generate(0, [], 0);
}

function combinationSumWithGenerator(
  candidates: number[],
  target: number
): number[][] {
  return Array.from(combinationSumGenerator(candidates, target));
}

/**
 * Solution 6: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a CombinationSumGenerator class
 * - Encapsulate the generation logic
 *
 * Time Complexity: O(2^target)
 * Space Complexity: O(2^target)
 */
class CombinationSumGenerator {
  private candidates: number[];
  private target: number;
  private result: number[][];

  constructor(candidates: number[], target: number) {
    this.candidates = [...candidates].sort((a, b) => a - b);
    this.target = target;
    this.result = [];
  }

  generate(): number[][] {
    this.result = [];
    this.backtrack(0, [], 0);
    return this.result;
  }

  private backtrack(start: number, current: number[], sum: number): void {
    if (sum === this.target) {
      this.result.push([...current]);
      return;
    }

    if (sum > this.target) {
      return;
    }

    for (let i = start; i < this.candidates.length; i++) {
      current.push(this.candidates[i]);
      this.backtrack(i, current, sum + this.candidates[i]);
      current.pop();
    }
  }

  getResult(): number[][] {
    return [...this.result];
  }
}

function combinationSumClass(candidates: number[], target: number): number[][] {
  const generator = new CombinationSumGenerator(candidates, target);
  return generator.generate();
}

/**
 * Solution 7: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(2^target)
 * Space Complexity: O(2^target)
 */
function combinationSumFunctional(
  candidates: number[],
  target: number
): number[][] {
  candidates.sort((a, b) => a - b);

  function generate(start: number, current: number[], sum: number): number[][] {
    if (sum === target) {
      return [current];
    }

    if (sum > target) {
      return [];
    }

    return candidates.slice(start).flatMap((candidate, index) => {
      return generate(start + index, [...current, candidate], sum + candidate);
    });
  }

  return generate(0, [], 0);
}

/**
 * Solution 8: Using Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Iterative approach with explicit stack
 *
 * Time Complexity: O(2^target)
 * Space Complexity: O(2^target)
 */
function combinationSumStack(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const stack: { start: number; current: number[]; sum: number }[] = [
    { start: 0, current: [], sum: 0 },
  ];

  candidates.sort((a, b) => a - b);

  while (stack.length > 0) {
    const { start, current, sum } = stack.pop()!;

    if (sum === target) {
      result.push([...current]);
      continue;
    }

    if (sum > target) {
      continue;
    }

    for (let i = candidates.length - 1; i >= start; i--) {
      stack.push({
        start: i,
        current: [...current, candidates[i]],
        sum: sum + candidates[i],
      });
    }
  }

  return result;
}

/**
 * Solution 9: Using Dynamic Programming
 *
 * Approach:
 * - Use DP to build solutions incrementally
 * - Cache intermediate results
 *
 * Time Complexity: O(target * candidates.length)
 * Space Complexity: O(target * candidates.length)
 */
function combinationSumDP(candidates: number[], target: number): number[][] {
  const dp: number[][][] = Array(target + 1)
    .fill(null)
    .map(() => []);
  dp[0] = [[]];

  candidates.sort((a, b) => a - b);

  for (let i = 1; i <= target; i++) {
    for (const candidate of candidates) {
      if (candidate <= i) {
        for (const combination of dp[i - candidate]) {
          dp[i].push([...combination, candidate]);
        }
      }
    }
  }

  return dp[target];
}

/**
 * Solution 10: Using Memoization
 *
 * Approach:
 * - Use memoization to cache results
 * - Avoid recalculating same subproblems
 *
 * Time Complexity: O(target * candidates.length)
 * Space Complexity: O(target * candidates.length)
 */
function combinationSumMemo(candidates: number[], target: number): number[][] {
  const memo = new Map<string, number[][]>();
  candidates.sort((a, b) => a - b);

  function backtrack(
    start: number,
    current: number[],
    sum: number
  ): number[][] {
    const key = `${start},${sum}`;

    if (memo.has(key)) {
      return memo.get(key)!.map((comb) => [...current, ...comb]);
    }

    if (sum === target) {
      return [current];
    }

    if (sum > target) {
      return [];
    }

    const result: number[][] = [];

    for (let i = start; i < candidates.length; i++) {
      const combinations = backtrack(
        i,
        [...current, candidates[i]],
        sum + candidates[i]
      );
      result.push(...combinations);
    }

    memo.set(
      key,
      result.map((comb) => comb.slice(current.length))
    );
    return result;
  }

  return backtrack(0, [], 0);
}

/**
 * Solution 11: Using Binary Search Optimization
 *
 * Approach:
 * - Use binary search to find valid candidates
 * - Optimize candidate selection
 *
 * Time Complexity: O(2^target * log(candidates.length))
 * Space Complexity: O(target)
 */
function combinationSumBinarySearch(
  candidates: number[],
  target: number
): number[][] {
  const result: number[][] = [];
  candidates.sort((a, b) => a - b);

  function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === target) return mid;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }

    return -1;
  }

  function backtrack(start: number, current: number[], sum: number) {
    if (sum === target) {
      result.push([...current]);
      return;
    }

    if (sum > target) {
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      if (sum + candidates[i] > target) {
        break;
      }

      current.push(candidates[i]);
      backtrack(i, current, sum + candidates[i]);
      current.pop();
    }
  }

  backtrack(0, [], 0);
  return result;
}

// Test cases
function testCombinationSum() {
  console.log("=== Testing Combination Sum ===\n");

  const testCases = [
    {
      candidates: [2, 3, 6, 7],
      target: 7,
      expected: [[2, 2, 3], [7]],
      description: "Basic case",
    },
    {
      candidates: [2, 3, 5],
      target: 8,
      expected: [
        [2, 2, 2, 2],
        [2, 3, 3],
        [3, 5],
      ],
      description: "Multiple combinations",
    },
    {
      candidates: [2],
      target: 1,
      expected: [],
      description: "No solution",
    },
    {
      candidates: [1],
      target: 1,
      expected: [[1]],
      description: "Single element",
    },
    {
      candidates: [1],
      target: 2,
      expected: [[1, 1]],
      description: "Repeated element",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: candidates = [${testCase.candidates.join(", ")}], target = ${
        testCase.target
      }`
    );
    console.log(`Expected: ${JSON.stringify(testCase.expected)}\n`);

    // Test Solution 1 (Backtracking)
    const result1 = combinationSum([...testCase.candidates], testCase.target);
    console.log(
      `Solution 1 (Backtracking): ${JSON.stringify(result1)} ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Pruning)
    const result2 = combinationSumPruning(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 2 (Pruning): ${JSON.stringify(result2)} ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Set)
    const result3 = combinationSumSet(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 3 (Set): ${JSON.stringify(result3)} ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Map)
    const result4 = combinationSumMap(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 4 (Map): ${JSON.stringify(result4)} ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Generator)
    const result5 = combinationSumWithGenerator(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 5 (Generator): ${JSON.stringify(result5)} ${
        JSON.stringify(result5.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Class)
    const result6 = combinationSumClass(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 6 (Class): ${JSON.stringify(result6)} ${
        JSON.stringify(result6.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Functional)
    const result7 = combinationSumFunctional(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 7 (Functional): ${JSON.stringify(result7)} ${
        JSON.stringify(result7.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Stack)
    const result8 = combinationSumStack(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 8 (Stack): ${JSON.stringify(result8)} ${
        JSON.stringify(result8.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Dynamic Programming)
    const result9 = combinationSumDP([...testCase.candidates], testCase.target);
    console.log(
      `Solution 9 (Dynamic Programming): ${JSON.stringify(result9)} ${
        JSON.stringify(result9.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Memoization)
    const result10 = combinationSumMemo(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 10 (Memoization): ${JSON.stringify(result10)} ${
        JSON.stringify(result10.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 11 (Binary Search)
    const result11 = combinationSumBinarySearch(
      [...testCase.candidates],
      testCase.target
    );
    console.log(
      `Solution 11 (Binary Search): ${JSON.stringify(result11)} ${
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
    { name: "Backtracking", func: combinationSum },
    { name: "Pruning", func: combinationSumPruning },
    { name: "Set", func: combinationSumSet },
    { name: "Map", func: combinationSumMap },
    { name: "Generator", func: combinationSumWithGenerator },
    { name: "Class", func: combinationSumClass },
    { name: "Functional", func: combinationSumFunctional },
    { name: "Stack", func: combinationSumStack },
    { name: "Dynamic Programming", func: combinationSumDP },
    { name: "Memoization", func: combinationSumMemo },
    { name: "Binary Search", func: combinationSumBinarySearch },
  ];

  // Create test cases
  const smallCase = { candidates: [2, 3, 6, 7], target: 7 };
  const mediumCase = { candidates: [2, 3, 5], target: 8 };
  const largeCase = { candidates: [2, 3, 5, 7], target: 10 };

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...testCase.candidates], testCase.target);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (${
          result.length
        } combinations)`
      );
    });

    console.log("");
  });
}

// Combination analysis
function combinationAnalysis() {
  console.log("=== Combination Analysis ===\n");

  const testCases = [
    { candidates: [2, 3, 6, 7], target: 7 },
    { candidates: [2, 3, 5], target: 8 },
    { candidates: [1, 2, 3], target: 4 },
    { candidates: [2, 4, 6], target: 6 },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}:`);
    console.log(
      `Candidates: [${testCase.candidates.join(", ")}], Target: ${
        testCase.target
      }`
    );
    const result = combinationSum([...testCase.candidates], testCase.target);
    console.log(`Combinations: ${result.length}`);
    console.log(`Result: ${JSON.stringify(result)}`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testCombinationSum();
// performanceComparison();
// combinationAnalysis();

export {
  combinationSum,
  combinationSumPruning,
  combinationSumSet,
  combinationSumMap,
  combinationSumWithGenerator,
  combinationSumClass,
  combinationSumFunctional,
  combinationSumStack,
  combinationSumDP,
  combinationSumMemo,
  combinationSumBinarySearch,
  CombinationSumGenerator,
  combinationSumGenerator,
  testCombinationSum,
  performanceComparison,
  combinationAnalysis,
};
