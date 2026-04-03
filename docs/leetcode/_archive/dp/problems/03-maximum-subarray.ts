/**
 * Maximum Subarray
 *
 * Problem: https://leetcode.com/problems/maximum-subarray/
 *
 * Given an integer array nums, find the subarray with the largest sum, and return its sum.
 *
 * Example 1:
 * Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
 * Output: 6
 * Explanation: The subarray [4,-1,2,1] has the largest sum 6.
 *
 * Example 2:
 * Input: nums = [1]
 * Output: 1
 *
 * Example 3:
 * Input: nums = [5,4,-1,7,8]
 * Output: 23
 *
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 *
 * Solution Approach:
 * 1. Kadane's Algorithm - One pass solution
 * 2. Keep track of current sum and maximum sum
 * 3. Reset current sum to 0 if it becomes negative
 * 4. Update maximum sum at each step
 *
 * Time Complexity: O(n) where n is the length of nums array
 * Space Complexity: O(1) as we only use a constant amount of extra space
 */

/**
 * Maximum Subarray - Kadane's Algorithm
 *
 * Thuật toán Kadane - Giải pháp một lần duyệt
 *
 * @param nums - Mảng số nguyên
 * @returns Tổng lớn nhất của subarray
 */
function maxSubArray(nums: number[]): number {
  if (nums.length === 0) return 0;

  let currentSum = nums[0]; // Tổng hiện tại
  let maxSum = nums[0]; // Tổng lớn nhất

  for (let i = 1; i < nums.length; i++) {
    // Cập nhật tổng hiện tại: lấy max giữa số hiện tại và tổng hiện tại + số hiện tại
    currentSum = Math.max(nums[i], currentSum + nums[i]);

    // Cập nhật tổng lớn nhất
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

/**
 * Alternative Solution: Divide and Conquer Approach
 *
 * Giải pháp thay thế: Chia để trị
 *
 * @param nums - Mảng số nguyên
 * @returns Tổng lớn nhất của subarray
 */
function maxSubArrayDivideAndConquer(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  return divideAndConquer(nums, 0, nums.length - 1);
}

function divideAndConquer(nums: number[], left: number, right: number): number {
  if (left === right) return nums[left];

  const mid = Math.floor((left + right) / 2);

  // Tìm tổng lớn nhất ở nửa trái
  const leftMax = divideAndConquer(nums, left, mid);

  // Tìm tổng lớn nhất ở nửa phải
  const rightMax = divideAndConquer(nums, mid + 1, right);

  // Tìm tổng lớn nhất đi qua giữa
  const crossMax = maxCrossingSubarray(nums, left, mid, right);

  return Math.max(leftMax, rightMax, crossMax);
}

function maxCrossingSubarray(
  nums: number[],
  left: number,
  mid: number,
  right: number
): number {
  // Tìm tổng lớn nhất từ mid về trái
  let leftSum = -Infinity;
  let sum = 0;
  for (let i = mid; i >= left; i--) {
    sum += nums[i];
    leftSum = Math.max(leftSum, sum);
  }

  // Tìm tổng lớn nhất từ mid + 1 về phải
  let rightSum = -Infinity;
  sum = 0;
  for (let i = mid + 1; i <= right; i++) {
    sum += nums[i];
    rightSum = Math.max(rightSum, sum);
  }

  return leftSum + rightSum;
}

/**
 * Brute Force Solution (for comparison)
 *
 * Giải pháp vét cạn (để so sánh)
 *
 * @param nums - Mảng số nguyên
 * @returns Tổng lớn nhất của subarray
 */
function maxSubArrayBruteForce(nums: number[]): number {
  let maxSum = -Infinity;

  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j];
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}

/**
 * Solution with Subarray Indices (for debugging)
 *
 * Giải pháp trả về cả chỉ số của subarray (để debug)
 *
 * @param nums - Mảng số nguyên
 * @returns Object chứa tổng lớn nhất và chỉ số của subarray
 */
function maxSubArrayWithIndices(nums: number[]): {
  maxSum: number;
  start: number;
  end: number;
} {
  if (nums.length === 0) return { maxSum: 0, start: -1, end: -1 };

  let currentSum = nums[0];
  let maxSum = nums[0];
  let start = 0;
  let end = 0;
  let tempStart = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > currentSum + nums[i]) {
      // Bắt đầu subarray mới
      currentSum = nums[i];
      tempStart = i;
    } else {
      // Tiếp tục subarray hiện tại
      currentSum += nums[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  return { maxSum, start, end };
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Maximum Subarray Tests ===");
  console.log("=== Kiểm thử bài toán Tổng lớn nhất của Subarray ===\n");

  const testCases = [
    {
      name: "Example 1: Mixed positive and negative",
      input: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      expected: 6,
      description: "Subarray [4,-1,2,1] has sum 6",
    },
    {
      name: "Example 2: Single element",
      input: [1],
      expected: 1,
      description: "Single element array",
    },
    {
      name: "Example 3: All positive",
      input: [5, 4, -1, 7, 8],
      expected: 23,
      description: "Subarray [5,4,-1,7,8] has sum 23",
    },
    {
      name: "All negative",
      input: [-1, -2, -3, -4],
      expected: -1,
      description: "Single element -1 is the maximum",
    },
    {
      name: "All positive",
      input: [1, 2, 3, 4, 5],
      expected: 15,
      description: "Entire array has sum 15",
    },
    {
      name: "Alternating positive negative",
      input: [1, -1, 1, -1, 1],
      expected: 1,
      description: "Single element 1 is the maximum",
    },
    {
      name: "Large negative followed by positive",
      input: [-1000, 1, 2, 3],
      expected: 6,
      description: "Subarray [1,2,3] has sum 6",
    },
    {
      name: "Large positive followed by negative",
      input: [1, 2, 3, -1000],
      expected: 6,
      description: "Subarray [1,2,3] has sum 6",
    },
    {
      name: "Zero in array",
      input: [1, 0, -1, 2],
      expected: 2,
      description: "Subarray [2] has sum 2",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = maxSubArray(testCase.input);
    const passed = result === testCase.expected;

    console.log(`Result: ${result}`);
    console.log(`Status: ${passed ? "✅ PASSED" : "❌ FAILED"}`);

    if (passed) {
      passedTests++;
    } else {
      console.log(`Expected: ${testCase.expected}, Got: ${result}`);
    }

    console.log("---");
  }

  console.log(`\nTest Summary: ${passedTests}/${totalTests} tests passed`);
  console.log(
    `Tóm tắt kiểm thử: ${passedTests}/${totalTests} bài kiểm thử đã qua`
  );

  // Test with indices
  console.log("\n=== Testing with Indices ===");
  console.log("=== Kiểm thử với chỉ số ===\n");

  const testArray = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const resultWithIndices = maxSubArrayWithIndices(testArray);

  console.log(`Array: [${testArray.join(", ")}]`);
  console.log(`Max Sum: ${resultWithIndices.maxSum}`);
  console.log(
    `Subarray: [${testArray
      .slice(resultWithIndices.start, resultWithIndices.end + 1)
      .join(", ")}]`
  );
  console.log(
    `Indices: ${resultWithIndices.start} to ${resultWithIndices.end}`
  );

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeInput = Array.from(
    { length: 10000 },
    () => Math.floor(Math.random() * 2000) - 1000
  );

  console.log("Testing with large input (10,000 elements)...");
  console.log("Kiểm thử với dữ liệu lớn (10,000 phần tử)...");

  const start1 = performance.now();
  const result1 = maxSubArray(largeInput);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = maxSubArrayDivideAndConquer(largeInput);
  const time2 = performance.now() - start2;

  console.log(`Kadane's Algorithm: ${time1.toFixed(4)}ms`);
  console.log(`Divide and Conquer: ${time2.toFixed(4)}ms`);
  console.log(`Results match: ${result1 === result2 ? "✅ Yes" : "❌ No"}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  maxSubArray,
  maxSubArrayDivideAndConquer,
  maxSubArrayBruteForce,
  maxSubArrayWithIndices,
};
