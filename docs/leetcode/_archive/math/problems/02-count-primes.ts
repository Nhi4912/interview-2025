/**
 * Count Primes
 *
 * Problem: https://leetcode.com/problems/count-primes/
 *
 * Given an integer n, return the number of prime numbers that are strictly less than n.
 *
 * Example 1:
 * Input: n = 10
 * Output: 4
 * Explanation: There are 4 prime numbers less than 10, they are 2, 3, 5, 7.
 *
 * Example 2:
 * Input: n = 0
 * Output: 0
 *
 * Example 3:
 * Input: n = 1
 * Output: 0
 *
 * Constraints:
 * - 0 <= n <= 5 * 10^6
 *
 * Solution Approach:
 * 1. Use Sieve of Eratosthenes algorithm
 * 2. Create a boolean array to mark non-prime numbers
 * 3. Start from 2 and mark all multiples as non-prime
 * 4. Count the remaining unmarked numbers
 *
 * Time Complexity: O(n log log n) for Sieve of Eratosthenes
 * Space Complexity: O(n) for the boolean array
 */

/**
 * Count Primes - Sieve of Eratosthenes
 *
 * Đếm số nguyên tố - Sàng Eratosthenes
 *
 * @param n - Số nguyên dương
 * @returns Số lượng số nguyên tố nhỏ hơn n
 */
function countPrimes(n: number): number {
  if (n <= 2) return 0;

  // Tạo mảng boolean để đánh dấu số không nguyên tố
  const isPrime = new Array(n).fill(true);
  isPrime[0] = false; // 0 không phải số nguyên tố
  isPrime[1] = false; // 1 không phải số nguyên tố

  // Sàng Eratosthenes
  for (let i = 2; i * i < n; i++) {
    if (isPrime[i]) {
      // Đánh dấu tất cả bội số của i là không nguyên tố
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  // Đếm số nguyên tố
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (isPrime[i]) {
      count++;
    }
  }

  return count;
}

/**
 * Alternative Solution: Optimized Sieve
 *
 * Giải pháp thay thế: Sàng tối ưu
 *
 * @param n - Số nguyên dương
 * @returns Số lượng số nguyên tố nhỏ hơn n
 */
function countPrimesOptimized(n: number): number {
  if (n <= 2) return 0;

  const isPrime = new Array(n).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  let count = 0;

  for (let i = 2; i < n; i++) {
    if (isPrime[i]) {
      count++;

      // Chỉ đánh dấu bội số từ i*i trở đi
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  return count;
}

/**
 * Brute Force Solution (for comparison)
 *
 * Giải pháp vét cạn (để so sánh)
 *
 * @param n - Số nguyên dương
 * @returns Số lượng số nguyên tố nhỏ hơn n
 */
function countPrimesBruteForce(n: number): number {
  if (n <= 2) return 0;

  let count = 0;

  for (let i = 2; i < n; i++) {
    if (isPrimeNumber(i)) {
      count++;
    }
  }

  return count;
}

/**
 * Check if a number is prime
 *
 * Kiểm tra xem một số có phải là số nguyên tố không
 *
 * @param num - Số cần kiểm tra
 * @returns true nếu là số nguyên tố, false nếu không
 */
function isPrimeNumber(num: number): boolean {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  // Chỉ kiểm tra các số lẻ từ 3 đến căn bậc hai của num
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

/**
 * Solution with Prime List Generation
 *
 * Giải pháp với tạo danh sách số nguyên tố
 *
 * @param n - Số nguyên dương
 * @returns Object chứa số lượng và danh sách số nguyên tố
 */
function countPrimesWithList(n: number): { count: number; primes: number[] } {
  if (n <= 2) return { count: 0, primes: [] };

  const isPrime = new Array(n).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  const primes: number[] = [];

  for (let i = 2; i < n; i++) {
    if (isPrime[i]) {
      primes.push(i);

      for (let j = i * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  return { count: primes.length, primes };
}

/**
 * Segmented Sieve (for very large numbers)
 *
 * Sàng phân đoạn (cho số rất lớn)
 *
 * @param n - Số nguyên dương
 * @returns Số lượng số nguyên tố nhỏ hơn n
 */
function countPrimesSegmented(n: number): number {
  if (n <= 2) return 0;

  const segmentSize = Math.floor(Math.sqrt(n)) + 1;
  const isPrime = new Array(segmentSize).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  // Tìm các số nguyên tố nhỏ hơn căn bậc hai của n
  const smallPrimes: number[] = [];
  for (let i = 2; i < segmentSize; i++) {
    if (isPrime[i]) {
      smallPrimes.push(i);
      for (let j = i * i; j < segmentSize; j += i) {
        isPrime[j] = false;
      }
    }
  }

  let count = smallPrimes.length;

  // Xử lý từng đoạn
  for (let low = segmentSize; low < n; low += segmentSize) {
    const high = Math.min(low + segmentSize, n);
    const segment = new Array(high - low).fill(true);

    for (const prime of smallPrimes) {
      const start = Math.max(prime * prime, Math.ceil(low / prime) * prime);
      for (let j = start; j < high; j += prime) {
        segment[j - low] = false;
      }
    }

    for (let i = 0; i < segment.length; i++) {
      if (segment[i]) {
        count++;
      }
    }
  }

  return count;
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Count Primes Tests ===");
  console.log("=== Kiểm thử bài toán Đếm số nguyên tố ===\n");

  const testCases = [
    {
      name: "Example 1: n = 10",
      input: 10,
      expected: 4,
      description: "Primes less than 10: 2, 3, 5, 7",
    },
    {
      name: "Example 2: n = 0",
      input: 0,
      expected: 0,
      description: "No primes less than 0",
    },
    {
      name: "Example 3: n = 1",
      input: 1,
      expected: 0,
      description: "No primes less than 1",
    },
    {
      name: "n = 2",
      input: 2,
      expected: 0,
      description: "No primes less than 2",
    },
    {
      name: "n = 3",
      input: 3,
      expected: 1,
      description: "Only 2 is prime less than 3",
    },
    {
      name: "n = 5",
      input: 5,
      expected: 2,
      description: "Primes less than 5: 2, 3",
    },
    {
      name: "n = 20",
      input: 20,
      expected: 8,
      description: "Primes less than 20: 2, 3, 5, 7, 11, 13, 17, 19",
    },
    {
      name: "n = 100",
      input: 100,
      expected: 25,
      description: "25 primes less than 100",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: n = ${testCase.input}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = countPrimes(testCase.input);
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

  // Test with prime list generation
  console.log("\n=== Testing with Prime List Generation ===");
  console.log("=== Kiểm thử với tạo danh sách số nguyên tố ===\n");

  const testN = 50;
  const resultWithList = countPrimesWithList(testN);

  console.log(`Primes less than ${testN}:`);
  console.log(`Số nguyên tố nhỏ hơn ${testN}:`);
  console.log(`Count: ${resultWithList.count}`);
  console.log(`List: [${resultWithList.primes.join(", ")}]`);

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const testNumbers = [100, 1000, 10000];

  for (const n of testNumbers) {
    console.log(`Testing with n = ${n}:`);
    console.log(`Kiểm thử với n = ${n}:`);

    const start1 = performance.now();
    const result1 = countPrimes(n);
    const time1 = performance.now() - start1;

    const start2 = performance.now();
    const result2 = countPrimesOptimized(n);
    const time2 = performance.now() - start2;

    const start3 = performance.now();
    const result3 = countPrimesSegmented(n);
    const time3 = performance.now() - start3;

    console.log(`  Sieve: ${time1.toFixed(4)}ms, Result: ${result1}`);
    console.log(`  Optimized: ${time2.toFixed(4)}ms, Result: ${result2}`);
    console.log(`  Segmented: ${time3.toFixed(4)}ms, Result: ${result3}`);
    console.log(
      `  Results match: ${
        result1 === result2 && result2 === result3 ? "✅ Yes" : "❌ No"
      }`
    );
    console.log("");
  }

  // Test brute force for small numbers
  console.log("=== Brute Force Comparison (small numbers) ===");
  console.log("=== So sánh với vét cạn (số nhỏ) ===\n");

  const smallN = 100;
  console.log(`Testing with n = ${smallN}:`);

  const startBF = performance.now();
  const resultBF = countPrimesBruteForce(smallN);
  const timeBF = performance.now() - startBF;

  const startSieve = performance.now();
  const resultSieve = countPrimes(smallN);
  const timeSieve = performance.now() - startSieve;

  console.log(`Brute Force: ${timeBF.toFixed(4)}ms, Result: ${resultBF}`);
  console.log(`Sieve: ${timeSieve.toFixed(4)}ms, Result: ${resultSieve}`);
  console.log(`Speedup: ${(timeBF / timeSieve).toFixed(2)}x faster`);
  console.log(
    `Results match: ${resultBF === resultSieve ? "✅ Yes" : "❌ No"}`
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  countPrimes,
  countPrimesOptimized,
  countPrimesBruteForce,
  countPrimesWithList,
  countPrimesSegmented,
  isPrimeNumber,
};
