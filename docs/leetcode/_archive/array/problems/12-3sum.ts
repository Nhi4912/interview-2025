/**
 * 15. 3Sum
 *
 * Problem:
 * Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]]
 * such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
 *
 * Notice that the solution set must not contain duplicate triplets.
 *
 * Example:
 * Input: nums = [-1,0,1,2,-1,-4]
 * Output: [[-1,-1,2],[-1,0,1]]
 *
 * Input: nums = []
 * Output: []
 *
 * Input: nums = [0]
 * Output: []
 *
 * LeetCode: https://leetcode.com/problems/3sum/
 */

/**
 * Solution 1: Two Pointers (Optimal)
 *
 * Approach:
 * - Sort the array
 * - Use three pointers: i, left, right
 * - Skip duplicates to avoid duplicate triplets
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1) - excluding result space
 */
function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;

  if (n < 3) return result;

  // Sort the array
  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 2; i++) {
    // Skip duplicates for i
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);

        // Skip duplicates for left
        while (left < right && nums[left] === nums[left + 1]) left++;
        // Skip duplicates for right
        while (left < right && nums[right] === nums[right - 1]) right--;

        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

/**
 * Solution 2: Using Set (Hash Table)
 *
 * Approach:
 * - Use Set to store complements
 * - Avoid sorting but need to handle duplicates differently
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function threeSumSet(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;

  if (n < 3) return result;

  // Sort to handle duplicates
  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    const seen = new Set<number>();

    for (let j = i + 1; j < n; j++) {
      const complement = -(nums[i] + nums[j]);

      if (seen.has(complement)) {
        result.push([nums[i], complement, nums[j]]);

        // Skip duplicates
        while (j + 1 < n && nums[j] === nums[j + 1]) j++;
      }

      seen.add(nums[j]);
    }
  }

  return result;
}

/**
 * Solution 3: Brute Force (Educational)
 *
 * Approach:
 * - Check all possible triplets
 * - Use Set to avoid duplicates
 *
 * Time Complexity: O(n³)
 * Space Complexity: O(n)
 */
function threeSumBruteForce(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;

  if (n < 3) return result;

  const seen = new Set<string>();

  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = triplet.join(",");

          if (!seen.has(key)) {
            seen.add(key);
            result.push(triplet);
          }
        }
      }
    }
  }

  return result;
}

/**
 * Solution 4: Using Map (Hash Table)
 *
 * Approach:
 * - Use Map to store frequency of numbers
 * - More memory efficient than Set approach
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function threeSumMap(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;

  if (n < 3) return result;

  // Sort to handle duplicates
  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    const frequency = new Map<number, number>();

    for (let j = i + 1; j < n; j++) {
      const complement = -(nums[i] + nums[j]);

      if (frequency.has(complement)) {
        result.push([nums[i], complement, nums[j]]);

        // Skip duplicates
        while (j + 1 < n && nums[j] === nums[j + 1]) j++;
      }

      frequency.set(nums[j], (frequency.get(nums[j]) || 0) + 1);
    }
  }

  return result;
}

/**
 * Solution 5: Recursive Approach
 *
 * Approach:
 * - Use recursion to find combinations
 * - Base case: when we have 3 numbers
 *
 * Time Complexity: O(n³)
 * Space Complexity: O(n) - recursion stack
 */
function threeSumRecursive(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;

  if (n < 3) return result;

  nums.sort((a, b) => a - b);

  function findTriplets(
    start: number,
    target: number,
    current: number[],
    count: number
  ): void {
    if (count === 3) {
      if (target === 0) {
        result.push([...current]);
      }
      return;
    }

    for (let i = start; i < n; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;

      current.push(nums[i]);
      findTriplets(i + 1, target - nums[i], current, count + 1);
      current.pop();
    }
  }

  findTriplets(0, 0, [], 0);
  return result;
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield triplets
 * - Memory efficient for large arrays
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function* threeSumGenerator(nums: number[]): Generator<number[]> {
  const n = nums.length;

  if (n < 3) return;

  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        yield [nums[i], nums[left], nums[right]];

        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;

        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
}

function threeSumWithGenerator(nums: number[]): number[][] {
  return Array.from(threeSumGenerator(nums));
}

/**
 * Solution 7: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a ThreeSumSolver class
 * - Encapsulate solving logic
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
class ThreeSumSolver {
  private nums: number[];

  constructor(nums: number[]) {
    this.nums = [...nums];
  }

  solve(): number[][] {
    const result: number[][] = [];
    const n = this.nums.length;

    if (n < 3) return result;

    this.nums.sort((a, b) => a - b);

    for (let i = 0; i < n - 2; i++) {
      if (i > 0 && this.nums[i] === this.nums[i - 1]) continue;

      let left = i + 1;
      let right = n - 1;

      while (left < right) {
        const sum = this.nums[i] + this.nums[left] + this.nums[right];

        if (sum === 0) {
          result.push([this.nums[i], this.nums[left], this.nums[right]]);

          while (left < right && this.nums[left] === this.nums[left + 1])
            left++;
          while (left < right && this.nums[right] === this.nums[right - 1])
            right--;

          left++;
          right--;
        } else if (sum < 0) {
          left++;
        } else {
          right--;
        }
      }
    }

    return result;
  }
}

function threeSumClass(nums: number[]): number[][] {
  const solver = new ThreeSumSolver(nums);
  return solver.solve();
}

/**
 * Solution 8: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function threeSumFunctional(nums: number[]): number[][] {
  if (nums.length < 3) return [];

  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];

  // Create all possible pairs and find their complement
  const pairs = sorted.flatMap((num, i) =>
    sorted.slice(i + 1).map((other) => [num, other])
  );

  const seen = new Set<string>();

  pairs.forEach(([a, b]) => {
    const complement = -(a + b);
    const triplet = [a, complement, b].sort((x, y) => x - y);
    const key = triplet.join(",");

    if (sorted.includes(complement) && !seen.has(key)) {
      seen.add(key);
      result.push(triplet);
    }
  });

  return result;
}

// Test cases
function testThreeSum() {
  console.log("=== Testing 3Sum ===\n");

  const testCases = [
    {
      input: [-1, 0, 1, 2, -1, -4],
      expected: [
        [-1, -1, 2],
        [-1, 0, 1],
      ],
      description: "Standard case with multiple solutions",
    },
    {
      input: [],
      expected: [],
      description: "Empty array",
    },
    {
      input: [0],
      expected: [],
      description: "Single element",
    },
    {
      input: [0, 0, 0],
      expected: [[0, 0, 0]],
      description: "All zeros",
    },
    {
      input: [1, 2, 3, 4, 5],
      expected: [],
      description: "No solution",
    },
    {
      input: [-2, 0, 1, 1, 2],
      expected: [
        [-2, 0, 2],
        [-2, 1, 1],
      ],
      description: "With duplicates",
    },
    {
      input: [-1, 0, 1, 2, -1, -4, -2, -3, 3, 0, 4],
      expected: [
        [-4, 0, 4],
        [-4, 1, 3],
        [-3, -1, 4],
        [-3, 0, 3],
        [-3, 1, 2],
        [-2, -1, 3],
        [-2, 0, 2],
        [-1, -1, 2],
        [-1, 0, 1],
      ],
      description: "Large array with many solutions",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${JSON.stringify(testCase.expected)}\n`);

    // Test Solution 1 (Two Pointers)
    const result1 = threeSum([...testCase.input]);
    console.log(
      `Solution 1 (Two Pointers): ${JSON.stringify(result1)} ${
        JSON.stringify(result1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Set)
    const result2 = threeSumSet([...testCase.input]);
    console.log(
      `Solution 2 (Set): ${JSON.stringify(result2)} ${
        JSON.stringify(result2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Brute Force)
    const result3 = threeSumBruteForce([...testCase.input]);
    console.log(
      `Solution 3 (Brute Force): ${JSON.stringify(result3)} ${
        JSON.stringify(result3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Map)
    const result4 = threeSumMap([...testCase.input]);
    console.log(
      `Solution 4 (Map): ${JSON.stringify(result4)} ${
        JSON.stringify(result4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Recursive)
    const result5 = threeSumRecursive([...testCase.input]);
    console.log(
      `Solution 5 (Recursive): ${JSON.stringify(result5)} ${
        JSON.stringify(result5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = threeSumWithGenerator([...testCase.input]);
    console.log(
      `Solution 6 (Generator): ${JSON.stringify(result6)} ${
        JSON.stringify(result6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Class)
    const result7 = threeSumClass([...testCase.input]);
    console.log(
      `Solution 7 (Class): ${JSON.stringify(result7)} ${
        JSON.stringify(result7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Functional)
    const result8 = threeSumFunctional([...testCase.input]);
    console.log(
      `Solution 8 (Functional): ${JSON.stringify(result8)} ${
        JSON.stringify(result8) === JSON.stringify(testCase.expected)
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
    { name: "Two Pointers", func: threeSum },
    { name: "Set", func: threeSumSet },
    { name: "Brute Force", func: threeSumBruteForce },
    { name: "Map", func: threeSumMap },
    { name: "Recursive", func: threeSumRecursive },
    { name: "Generator", func: threeSumWithGenerator },
    { name: "Class", func: threeSumClass },
    { name: "Functional", func: threeSumFunctional },
  ];

  // Create test arrays
  const smallArray = [-1, 0, 1, 2, -1, -4];
  const mediumArray = Array.from({ length: 50 }, (_, i) => i - 25);
  const largeArray = Array.from({ length: 100 }, (_, i) => i - 50);

  const arrays = [
    { name: "Small", array: smallArray },
    { name: "Medium", array: mediumArray },
    { name: "Large", array: largeArray },
  ];

  arrays.forEach(({ name, array }) => {
    console.log(`${name} Array:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...array]);
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

// Uncomment the following lines to run tests
// testThreeSum();
// performanceComparison();

export {
  threeSum,
  threeSumSet,
  threeSumBruteForce,
  threeSumMap,
  threeSumRecursive,
  threeSumWithGenerator,
  threeSumClass,
  threeSumFunctional,
  ThreeSumSolver,
  threeSumGenerator,
  testThreeSum,
  performanceComparison,
};
