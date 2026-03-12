/**
 * Sort Colors
 *
 * Problem: https://leetcode.com/problems/sort-colors/
 *
 * Given an array nums with n objects colored red, white, or blue, sort them in-place
 * so that objects of the same color are adjacent, with the colors in the order red,
 * white, and blue.
 *
 * We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.
 *
 * You must solve this problem without using the library's sort function.
 *
 * Example 1:
 * Input: nums = [2,0,2,1,1,0]
 * Output: [0,0,1,1,2,2]
 *
 * Example 2:
 * Input: nums = [2,2,2,2]
 * Output: [2,2,2,2]
 *
 * Constraints:
 * - n == nums.length
 * - 1 <= n <= 300
 * - nums[i] is 0, 1, or 2.
 *
 * Solution Approach:
 * 1. Dutch National Flag Algorithm (Three-way partitioning)
 * 2. Use three pointers: low, mid, high
 * 3. Maintain invariant: elements before low are 0, after high are 2
 * 4. Process elements at mid pointer
 *
 * Time Complexity: O(n) where n is the length of nums array
 * Space Complexity: O(1) as we sort in-place
 */

/**
 * Sort Colors - Dutch National Flag Algorithm
 *
 * Sắp xếp màu sắc - Thuật toán cờ quốc gia Hà Lan
 *
 * @param nums - Mảng các số đại diện cho màu sắc (0=đỏ, 1=trắng, 2=xanh)
 */
function sortColors(nums: number[]): void {
  let low = 0; // Con trỏ cho vùng màu đỏ (0)
  let mid = 0; // Con trỏ hiện tại
  let high = nums.length - 1; // Con trỏ cho vùng màu xanh (2)

  while (mid <= high) {
    if (nums[mid] === 0) {
      // Hoán đổi với phần tử ở vị trí low
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      // Giữ nguyên, di chuyển mid
      mid++;
    } else if (nums[mid] === 2) {
      // Hoán đổi với phần tử ở vị trí high
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}

/**
 * Alternative Solution: Counting Sort
 *
 * Giải pháp thay thế: Sắp xếp đếm
 *
 * @param nums - Mảng các số đại diện cho màu sắc
 */
function sortColorsCounting(nums: number[]): void {
  const counts = [0, 0, 0]; // Đếm số lượng 0, 1, 2

  // Đếm số lượng mỗi màu
  for (const num of nums) {
    counts[num]++;
  }

  // Điền lại mảng theo thứ tự
  let index = 0;
  for (let color = 0; color <= 2; color++) {
    for (let i = 0; i < counts[color]; i++) {
      nums[index++] = color;
    }
  }
}

/**
 * Solution with Two Passes
 *
 * Giải pháp với hai lần duyệt
 *
 * @param nums - Mảng các số đại diện cho màu sắc
 */
function sortColorsTwoPass(nums: number[]): void {
  // Lần đầu: đưa tất cả số 0 về đầu
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
      insertPos++;
    }
  }

  // Lần hai: đưa tất cả số 1 về sau số 0
  for (let i = insertPos; i < nums.length; i++) {
    if (nums[i] === 1) {
      [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
      insertPos++;
    }
  }
  // Số 2 sẽ tự động ở cuối
}

/**
 * Solution with Visualization
 *
 * Giải pháp với hiển thị quá trình
 *
 * @param nums - Mảng các số đại diện cho màu sắc
 * @returns Mảng các bước thực hiện
 */
function sortColorsWithSteps(
  nums: number[]
): Array<{ step: number; array: number[]; description: string }> {
  const steps: Array<{ step: number; array: number[]; description: string }> =
    [];
  const workingArray = [...nums];

  let low = 0;
  let mid = 0;
  let high = workingArray.length - 1;
  let step = 0;

  steps.push({
    step: step++,
    array: [...workingArray],
    description: "Initial state",
  });

  while (mid <= high) {
    if (workingArray[mid] === 0) {
      [workingArray[low], workingArray[mid]] = [
        workingArray[mid],
        workingArray[low],
      ];
      steps.push({
        step: step++,
        array: [...workingArray],
        description: `Swapped 0 at position ${mid} with position ${low}`,
      });
      low++;
      mid++;
    } else if (workingArray[mid] === 1) {
      steps.push({
        step: step++,
        array: [...workingArray],
        description: `Kept 1 at position ${mid}`,
      });
      mid++;
    } else if (workingArray[mid] === 2) {
      [workingArray[mid], workingArray[high]] = [
        workingArray[high],
        workingArray[mid],
      ];
      steps.push({
        step: step++,
        array: [...workingArray],
        description: `Swapped 2 at position ${mid} with position ${high}`,
      });
      high--;
    }
  }

  return steps;
}

/**
 * Solution with Color Names
 *
 * Giải pháp với tên màu
 *
 * @param nums - Mảng các số đại diện cho màu sắc
 * @returns Mảng tên màu đã sắp xếp
 */
function sortColorsWithNames(nums: number[]): string[] {
  const colorMap = { 0: "Red", 1: "White", 2: "Blue" };
  const sortedNums = [...nums];

  sortColors(sortedNums);

  return sortedNums.map((num) => colorMap[num as keyof typeof colorMap]);
}

/**
 * Validation function
 *
 * Hàm kiểm tra tính hợp lệ
 *
 * @param nums - Mảng cần kiểm tra
 * @returns true nếu mảng đã được sắp xếp đúng
 */
function isSorted(nums: number[]): boolean {
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Count colors function
 *
 * Hàm đếm số lượng màu
 *
 * @param nums - Mảng các số đại diện cho màu sắc
 * @returns Object chứa số lượng mỗi màu
 */
function countColors(nums: number[]): {
  red: number;
  white: number;
  blue: number;
} {
  const counts = { red: 0, white: 0, blue: 0 };

  for (const num of nums) {
    if (num === 0) counts.red++;
    else if (num === 1) counts.white++;
    else if (num === 2) counts.blue++;
  }

  return counts;
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Sort Colors Tests ===");
  console.log("=== Kiểm thử bài toán Sắp xếp màu sắc ===\n");

  const testCases = [
    {
      name: "Example 1: Mixed colors",
      input: [2, 0, 2, 1, 1, 0],
      expected: [0, 0, 1, 1, 2, 2],
      description: "Mixed colors with all three types",
    },
    {
      name: "Example 2: All same color",
      input: [2, 2, 2, 2],
      expected: [2, 2, 2, 2],
      description: "All elements are blue",
    },
    {
      name: "Single element",
      input: [1],
      expected: [1],
      description: "Single white element",
    },
    {
      name: "Two elements",
      input: [2, 0],
      expected: [0, 2],
      description: "Blue and red elements",
    },
    {
      name: "Already sorted",
      input: [0, 0, 1, 1, 2, 2],
      expected: [0, 0, 1, 1, 2, 2],
      description: "Array already in correct order",
    },
    {
      name: "Reverse sorted",
      input: [2, 2, 1, 1, 0, 0],
      expected: [0, 0, 1, 1, 2, 2],
      description: "Array in reverse order",
    },
    {
      name: "Only red and white",
      input: [1, 0, 1, 0, 1],
      expected: [0, 0, 1, 1, 1],
      description: "Only red and white colors",
    },
    {
      name: "Only white and blue",
      input: [2, 1, 2, 1, 2],
      expected: [1, 1, 2, 2, 2],
      description: "Only white and blue colors",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: [${testCase.expected.join(", ")}]`);
    console.log(`Description: ${testCase.description}`);

    const nums = [...testCase.input];
    sortColors(nums);

    const passed = JSON.stringify(nums) === JSON.stringify(testCase.expected);

    console.log(`Result: [${nums.join(", ")}]`);
    console.log(`Status: ${passed ? "✅ PASSED" : "❌ FAILED"}`);

    if (passed) {
      passedTests++;
    } else {
      console.log(
        `Expected: [${testCase.expected.join(", ")}], Got: [${nums.join(", ")}]`
      );
    }

    console.log("---");
  }

  console.log(`\nTest Summary: ${passedTests}/${totalTests} tests passed`);
  console.log(
    `Tóm tắt kiểm thử: ${passedTests}/${totalTests} bài kiểm thử đã qua`
  );

  // Test with visualization
  console.log("\n=== Testing with Visualization ===");
  console.log("=== Kiểm thử với hiển thị quá trình ===\n");

  const testArray = [2, 0, 2, 1, 1, 0];
  const steps = sortColorsWithSteps(testArray);

  console.log("Sorting steps:");
  console.log("Các bước sắp xếp:");
  for (const step of steps) {
    console.log(
      `Step ${step.step}: [${step.array.join(", ")}] - ${step.description}`
    );
  }

  // Test with color names
  console.log("\n=== Testing with Color Names ===");
  console.log("=== Kiểm thử với tên màu ===\n");

  const colorArray = [2, 0, 2, 1, 1, 0];
  const sortedColors = sortColorsWithNames(colorArray);

  console.log(`Original: [${colorArray.join(", ")}]`);
  console.log(`Sorted: [${sortedColors.join(", ")}]`);

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeArray = Array.from({ length: 10000 }, () =>
    Math.floor(Math.random() * 3)
  );

  console.log("Testing with large array (10,000 elements)...");
  console.log("Kiểm thử với mảng lớn (10,000 phần tử)...");

  const start1 = performance.now();
  const array1 = [...largeArray];
  sortColors(array1);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const array2 = [...largeArray];
  sortColorsCounting(array2);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const array3 = [...largeArray];
  sortColorsTwoPass(array3);
  const time3 = performance.now() - start3;

  console.log(`Dutch National Flag: ${time1.toFixed(4)}ms`);
  console.log(`Counting Sort: ${time2.toFixed(4)}ms`);
  console.log(`Two Pass: ${time3.toFixed(4)}ms`);

  const resultsMatch =
    JSON.stringify(array1) === JSON.stringify(array2) &&
    JSON.stringify(array2) === JSON.stringify(array3);
  console.log(`Results match: ${resultsMatch ? "✅ Yes" : "❌ No"}`);

  // Verify sorting
  console.log(
    `All arrays are sorted: ${
      isSorted(array1) && isSorted(array2) && isSorted(array3)
        ? "✅ Yes"
        : "❌ No"
    }`
  );

  // Show color distribution
  const originalCounts = countColors(largeArray);
  const sortedCounts = countColors(array1);

  console.log("\nColor distribution:");
  console.log("Phân bố màu sắc:");
  console.log(
    `Original - Red: ${originalCounts.red}, White: ${originalCounts.white}, Blue: ${originalCounts.blue}`
  );
  console.log(
    `Sorted - Red: ${sortedCounts.red}, White: ${sortedCounts.white}, Blue: ${sortedCounts.blue}`
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  sortColors,
  sortColorsCounting,
  sortColorsTwoPass,
  sortColorsWithSteps,
  sortColorsWithNames,
  isSorted,
  countColors,
};
