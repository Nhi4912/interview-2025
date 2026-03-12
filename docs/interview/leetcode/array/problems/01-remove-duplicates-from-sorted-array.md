---
layout: page
title: "Remove Duplicates from Sorted Array"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/"
---

# Remove Duplicates from Sorted Array

**LeetCode Problem # * 26. Remove Duplicates from Sorted Array**

## Problem Description

 * Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place  * such that each unique element appears only once. The relative order of the elements should  * be kept the same. Then return the number of unique elements in nums.  *  * Consider the number of unique elements of nums to be k, to get accepted, you need to do 

## Solutions

{% raw %}
/**
 * 26. Remove Duplicates from Sorted Array
 *
 * Problem:
 * Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place
 * such that each unique element appears only once. The relative order of the elements should
 * be kept the same. Then return the number of unique elements in nums.
 *
 * Consider the number of unique elements of nums to be k, to get accepted, you need to do
 * the following things:
 * 1. Change the array nums such that the first k elements of nums contain the unique elements
 *    in the order they were present in nums initially.
 * 2. The remaining elements of nums are not important as well as the size of nums.
 * 3. Return k.
 *
 * Example:
 * Input: nums = [1,1,2]
 * Output: 2, nums = [1,2,_]
 * Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
 *
 * Input: nums = [0,0,1,1,1,2,2,3,3,4]
 * Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
 *
 * LeetCode: https://leetcode.com/problems/remove-duplicates-from-sorted-array/
 */

/**
 * Solution 1: Two Pointers Approach (Optimal)
 *
 * Approach:
 * - Use two pointers: i (slow) and j (fast)
 * - i points to the last unique element
 * - j scans through the array
 * - When nums[j] != nums[i], increment i and copy nums[j] to nums[i]
 *
 * Time Complexity: O(n) - we traverse the array once
 * Space Complexity: O(1) - we modify the array in-place
 */
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let i = 0; // slow pointer - last unique element position

  for (let j = 1; j < nums.length; j++) {
    // If current element is different from last unique element
    if (nums[j] !== nums[i]) {
      i++; // Move to next position
      nums[i] = nums[j]; // Copy the unique element
    }
  }

  return i + 1; // Return number of unique elements
}

/**
 * Solution 2: Using Set (Not in-place, but shows alternative approach)
 *
 * Approach:
 * - Convert array to Set to remove duplicates
 * - Convert back to array
 * - Copy elements back to original array
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - requires extra space for Set
 */
function removeDuplicatesWithSet(nums: number[]): number {
  const uniqueSet = new Set(nums);
  const uniqueArray = Array.from(uniqueSet);

  // Copy unique elements back to original array
  for (let i = 0; i < uniqueArray.length; i++) {
    nums[i] = uniqueArray[i];
  }

  return uniqueArray.length;
}

/**
 * Solution 3: Using Filter (Functional approach)
 *
 * Approach:
 * - Use filter to create new array with unique elements
 * - Copy back to original array
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - requires extra space for filtered array
 */
function removeDuplicatesWithFilter(nums: number[]): number {
  const uniqueArray = nums.filter((num, index) => nums.indexOf(num) === index);

  // Copy unique elements back to original array
  for (let i = 0; i < uniqueArray.length; i++) {
    nums[i] = uniqueArray[i];
  }

  return uniqueArray.length;
}

/**
 * Solution 4: Manual approach with explicit duplicate checking
 *
 * Approach:
 * - Compare each element with all previous elements
 * - Only keep elements that haven't appeared before
 *
 * Time Complexity: O(n²) - for each element, check all previous elements
 * Space Complexity: O(1) - in-place modification
 */
function removeDuplicatesManual(nums: number[]): number {
  if (nums.length === 0) return 0;

  let writeIndex = 1; // Position to write next unique element

  for (let i = 1; i < nums.length; i++) {
    let isDuplicate = false;

    // Check if current element is duplicate of any previous element
    for (let j = 0; j < writeIndex; j++) {
      if (nums[i] === nums[j]) {
        isDuplicate = true;
        break;
      }
    }

    // If not duplicate, add to result
    if (!isDuplicate) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }

  return writeIndex;
}

// Test cases
function testRemoveDuplicates() {
  console.log("=== Testing Remove Duplicates from Sorted Array ===\n");

  const testCases = [
    {
      input: [1, 1, 2],
      expected: 2,
      description: "Basic case with one duplicate",
    },
    {
      input: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
      expected: 5,
      description: "Multiple duplicates",
    },
    {
      input: [1, 2, 3, 4, 5],
      expected: 5,
      description: "No duplicates",
    },
    {
      input: [1, 1, 1, 1, 1],
      expected: 1,
      description: "All same elements",
    },
    {
      input: [],
      expected: 0,
      description: "Empty array",
    },
    {
      input: [1],
      expected: 1,
      description: "Single element",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input}]`);

    // Test Solution 1 (Optimal)
    const nums1 = [...testCase.input];
    const result1 = removeDuplicates(nums1);
    console.log(
      `Solution 1 (Two Pointers): k = ${result1}, nums = [${nums1.slice(
        0,
        result1
      )}]`
    );
    console.log(`Expected: k = ${testCase.expected}`);
    console.log(`Correct: ${result1 === testCase.expected ? "✅" : "❌"}\n`);

    // Test Solution 2 (Set)
    const nums2 = [...testCase.input];
    const result2 = removeDuplicatesWithSet(nums2);
    console.log(
      `Solution 2 (Set): k = ${result2}, nums = [${nums2.slice(0, result2)}]`
    );
    console.log(`Correct: ${result2 === testCase.expected ? "✅" : "❌"}\n`);

    // Test Solution 3 (Filter)
    const nums3 = [...testCase.input];
    const result3 = removeDuplicatesWithFilter(nums3);
    console.log(
      `Solution 3 (Filter): k = ${result3}, nums = [${nums3.slice(0, result3)}]`
    );
    console.log(`Correct: ${result3 === testCase.expected ? "✅" : "❌"}\n`);

    // Test Solution 4 (Manual)
    const nums4 = [...testCase.input];
    const result4 = removeDuplicatesManual(nums4);
    console.log(
      `Solution 4 (Manual): k = ${result4}, nums = [${nums4.slice(0, result4)}]`
    );
    console.log(`Correct: ${result4 === testCase.expected ? "✅" : "❌"}\n`);

    console.log("---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  // Create large sorted array with duplicates
  const largeArray = [];
  for (let i = 0; i < 100000; i++) {
    largeArray.push(Math.floor(i / 100)); // Creates many duplicates
  }

  const testCases = [
    { name: "Two Pointers", func: removeDuplicates },
    { name: "Set", func: removeDuplicatesWithSet },
    { name: "Filter", func: removeDuplicatesWithFilter },
    { name: "Manual", func: removeDuplicatesManual },
  ];

  testCases.forEach(({ name, func }) => {
    const testArray = [...largeArray];
    const start = performance.now();
    const result = func(testArray);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: ${result} unique elements`);
    console.log(
      `  Memory: ${
        name === "Two Pointers" || name === "Manual" ? "O(1)" : "O(n)"
      }\n`
    );
  });
}

// Run tests
if (require.main === module) {
  testRemoveDuplicates();
  performanceComparison();
}

export {
  removeDuplicates,
  removeDuplicatesWithSet,
  removeDuplicatesWithFilter,
  removeDuplicatesManual,
};
{% endraw %}
