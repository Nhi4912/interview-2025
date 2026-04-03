/**
 * First Bad Version
 *
 * Problem: https://leetcode.com/problems/first-bad-version/
 *
 * You are a product manager and currently leading a team to develop a new product.
 * Unfortunately, the latest version of your product fails the quality check. Since
 * each version is developed based on the previous version, all the versions after
 * a bad version are also bad.
 *
 * Suppose you have n versions [1, 2, ..., n] and you want to find out the first
 * bad one, which causes all the following ones to be bad.
 *
 * You are given an API bool isBadVersion(version) which returns whether version
 * is bad. Implement a function to find the first bad version. You should minimize
 * the number of calls to the API.
 *
 * Example 1:
 * Input: n = 5, bad = 4
 * Output: 4
 * Explanation:
 * call isBadVersion(3) -> false
 * call isBadVersion(5) -> true
 * call isBadVersion(4) -> true
 * Then 4 is the first bad version.
 *
 * Example 2:
 * Input: n = 1, bad = 1
 * Output: 1
 *
 * Constraints:
 * - 1 <= bad <= n <= 2^31 - 1
 *
 * Solution Approach:
 * 1. Binary search to minimize API calls
 * 2. If mid version is bad, search in left half
 * 3. If mid version is good, search in right half
 * 4. Return the first bad version found
 *
 * Time Complexity: O(log n) where n is the number of versions
 * Space Complexity: O(1) as we only use a constant amount of extra space
 */

/**
 * Mock API function for testing
 *
 * Hàm API giả lập để kiểm thử
 */
let badVersion: number = 0;

function isBadVersion(version: number): boolean {
  return version >= badVersion;
}

/**
 * First Bad Version - Binary Search Solution
 *
 * Giải pháp tìm kiếm nhị phân cho bài toán Phiên bản xấu đầu tiên
 *
 * @param n - Tổng số phiên bản
 * @returns Phiên bản xấu đầu tiên
 */
function firstBadVersion(n: number): number {
  let left = 1;
  let right = n;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (isBadVersion(mid)) {
      // Phiên bản mid xấu, tìm kiếm ở nửa trái
      right = mid;
    } else {
      // Phiên bản mid tốt, tìm kiếm ở nửa phải
      left = mid + 1;
    }
  }

  return left;
}

/**
 * Alternative Solution: Using Math.floor
 *
 * Giải pháp thay thế: Sử dụng Math.floor
 *
 * @param n - Tổng số phiên bản
 * @returns Phiên bản xấu đầu tiên
 */
function firstBadVersionAlternative(n: number): number {
  let left = 1;
  let right = n;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (isBadVersion(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

/**
 * Solution with API Call Counting
 *
 * Giải pháp với đếm số lần gọi API
 *
 * @param n - Tổng số phiên bản
 * @returns Object chứa phiên bản xấu đầu tiên và số lần gọi API
 */
function firstBadVersionWithCount(n: number): {
  firstBad: number;
  apiCalls: number;
} {
  let left = 1;
  let right = n;
  let apiCalls = 0;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    apiCalls++;
    if (isBadVersion(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return { firstBad: left, apiCalls };
}

/**
 * Linear Search Solution (for comparison)
 *
 * Giải pháp tìm kiếm tuyến tính (để so sánh)
 *
 * @param n - Tổng số phiên bản
 * @returns Phiên bản xấu đầu tiên
 */
function firstBadVersionLinear(n: number): number {
  for (let i = 1; i <= n; i++) {
    if (isBadVersion(i)) {
      return i;
    }
  }

  return n; // Tất cả phiên bản đều xấu
}

/**
 * Solution with Version History
 *
 * Giải pháp với lịch sử phiên bản
 *
 * @param n - Tổng số phiên bản
 * @returns Object chứa kết quả và lịch sử kiểm tra
 */
function firstBadVersionWithHistory(n: number): {
  firstBad: number;
  history: Array<{ version: number; isBad: boolean }>;
} {
  let left = 1;
  let right = n;
  const history: Array<{ version: number; isBad: boolean }> = [];

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    const isBad = isBadVersion(mid);
    history.push({ version: mid, isBad });

    if (isBad) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return { firstBad: left, history };
}

/**
 * Recursive Binary Search Solution
 *
 * Giải pháp tìm kiếm nhị phân đệ quy
 *
 * @param n - Tổng số phiên bản
 * @returns Phiên bản xấu đầu tiên
 */
function firstBadVersionRecursive(n: number): number {
  function binarySearch(left: number, right: number): number {
    if (left >= right) {
      return left;
    }

    const mid = Math.floor(left + (right - left) / 2);

    if (isBadVersion(mid)) {
      return binarySearch(left, mid);
    } else {
      return binarySearch(mid + 1, right);
    }
  }

  return binarySearch(1, n);
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== First Bad Version Tests ===");
  console.log("=== Kiểm thử bài toán Phiên bản xấu đầu tiên ===\n");

  const testCases = [
    {
      name: "Example 1: n=5, bad=4",
      n: 5,
      bad: 4,
      expected: 4,
      description: "First bad version is 4",
    },
    {
      name: "Example 2: n=1, bad=1",
      n: 1,
      bad: 1,
      expected: 1,
      description: "Only one version and it's bad",
    },
    {
      name: "n=10, bad=1",
      n: 10,
      bad: 1,
      expected: 1,
      description: "First version is bad",
    },
    {
      name: "n=10, bad=10",
      n: 10,
      bad: 10,
      expected: 10,
      description: "Last version is bad",
    },
    {
      name: "n=100, bad=50",
      n: 100,
      bad: 50,
      expected: 50,
      description: "Middle version is bad",
    },
    {
      name: "n=1000, bad=1",
      n: 1000,
      bad: 1,
      expected: 1,
      description: "Large n, first version bad",
    },
    {
      name: "n=1000, bad=1000",
      n: 1000,
      bad: 1000,
      expected: 1000,
      description: "Large n, last version bad",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: n=${testCase.n}, bad=${testCase.bad}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    // Set the bad version for this test
    badVersion = testCase.bad;

    const result = firstBadVersion(testCase.n);
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

  // Test with API call counting
  console.log("\n=== Testing with API Call Counting ===");
  console.log("=== Kiểm thử với đếm số lần gọi API ===\n");

  const testN = 100;
  const testBad = 50;
  badVersion = testBad;

  const resultWithCount = firstBadVersionWithCount(testN);
  console.log(`n=${testN}, bad=${testBad}`);
  console.log(`First bad version: ${resultWithCount.firstBad}`);
  console.log(`API calls: ${resultWithCount.apiCalls}`);
  console.log(`Expected API calls: ~${Math.ceil(Math.log2(testN))}`);

  // Test with history
  console.log("\n=== Testing with History ===");
  console.log("=== Kiểm thử với lịch sử ===\n");

  const resultWithHistory = firstBadVersionWithHistory(20);
  console.log(`n=20, bad=${badVersion}`);
  console.log(`First bad version: ${resultWithHistory.firstBad}`);
  console.log("API call history:");
  console.log("Lịch sử gọi API:");
  resultWithHistory.history.forEach((call, index) => {
    console.log(
      `  ${index + 1}. isBadVersion(${call.version}) -> ${call.isBad}`
    );
  });

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeN = 1000000;
  const largeBad = 500000;
  badVersion = largeBad;

  console.log(`Testing with large input: n=${largeN}, bad=${largeBad}`);
  console.log(`Kiểm thử với đầu vào lớn: n=${largeN}, bad=${largeBad}`);

  const start1 = performance.now();
  const result1 = firstBadVersion(largeN);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = firstBadVersionAlternative(largeN);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = firstBadVersionRecursive(largeN);
  const time3 = performance.now() - start3;

  console.log(`Binary Search: ${time1.toFixed(4)}ms, Result: ${result1}`);
  console.log(`Alternative: ${time2.toFixed(4)}ms, Result: ${result2}`);
  console.log(`Recursive: ${time3.toFixed(4)}ms, Result: ${result3}`);
  console.log(
    `Results match: ${
      result1 === result2 && result2 === result3 ? "✅ Yes" : "❌ No"
    }`
  );

  // Compare with linear search for small input
  console.log("\n=== Linear vs Binary Search (small input) ===");
  console.log("=== Tìm kiếm tuyến tính vs nhị phân (đầu vào nhỏ) ===\n");

  const smallN = 1000;
  const smallBad = 500;
  badVersion = smallBad;

  const startLinear = performance.now();
  const resultLinear = firstBadVersionLinear(smallN);
  const timeLinear = performance.now() - startLinear;

  const startBinary = performance.now();
  const resultBinary = firstBadVersion(smallN);
  const timeBinary = performance.now() - startBinary;

  console.log(
    `Linear Search: ${timeLinear.toFixed(4)}ms, Result: ${resultLinear}`
  );
  console.log(
    `Binary Search: ${timeBinary.toFixed(4)}ms, Result: ${resultBinary}`
  );
  console.log(`Speedup: ${(timeLinear / timeBinary).toFixed(2)}x faster`);
  console.log(
    `Results match: ${resultLinear === resultBinary ? "✅ Yes" : "❌ No"}`
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  firstBadVersion,
  firstBadVersionAlternative,
  firstBadVersionWithCount,
  firstBadVersionLinear,
  firstBadVersionWithHistory,
  firstBadVersionRecursive,
  isBadVersion,
};
