---
layout: page
title: "Median of Two Sorted Array"
difficulty: Hard
category: Sorting/Searching
tags: [Sorting/Searching, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/median-of-two-sorted-array/"
---

# Median of Two Sorted Array

**LeetCode Problem # * 4. Median of Two Sorted Arrays**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 4. Median of Two Sorted Arrays
 * 
 * Given two sorted arrays nums1 and nums2 of size m and n respectively, 
 * return the median of the two sorted arrays.
 * 
 * The overall run time complexity should be O(log (m+n)).
 * 
 * Example 1:
 * Input: nums1 = [1,3], nums2 = [2]
 * Output: 2.00000
 * Explanation: merged array = [1,2,3] and median is 2.
 * 
 * Example 2:
 * Input: nums1 = [1,2], nums2 = [3,4]
 * Output: 2.50000
 * Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
 * 
 * Constraints:
 * - nums1.length == m
 * - nums2.length == n
 * - 0 <= m <= 1000
 * - 0 <= n <= 1000
 * - 1 <= m + n <= 2000
 * - -10^6 <= nums1[i], nums2[i] <= 10^6
 */

// Solution 1: Binary Search on Smaller Array
// Time: O(log(min(m,n))), Space: O(1)
export function findMedianSortedArrays1(nums1: number[], nums2: number[]): number {
    // Ensure nums1 is the smaller array
    if (nums1.length > nums2.length) {
        return findMedianSortedArrays1(nums2, nums1);
    }
    
    const m = nums1.length;
    const n = nums2.length;
    const total = m + n;
    const half = Math.floor(total / 2);
    
    let left = 0;
    let right = m;
    
    while (left <= right) {
        const partitionX = Math.floor((left + right) / 2);
        const partitionY = half - partitionX;
        
        // Get boundary elements
        const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];
        const minRightX = partitionX === m ? Infinity : nums1[partitionX];
        
        const maxLeftY = partitionY === 0 ? -Infinity : nums2[partitionY - 1];
        const minRightY = partitionY === n ? Infinity : nums2[partitionY];
        
        // Check if we found the correct partition
        if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
            // Found the median
            if (total % 2 === 0) {
                return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;
            } else {
                return Math.min(minRightX, minRightY);
            }
        } else if (maxLeftX > minRightY) {
            // Too many elements from nums1, move left
            right = partitionX - 1;
        } else {
            // Too few elements from nums1, move right
            left = partitionX + 1;
        }
    }
    
    throw new Error("Input arrays are not sorted");
}

// Solution 2: Merge and Find Median
// Time: O(m+n), Space: O(1)
export function findMedianSortedArrays2(nums1: number[], nums2: number[]): number {
    const total = nums1.length + nums2.length;
    const isEven = total % 2 === 0;
    const medianIndex = Math.floor(total / 2);
    
    let i = 0, j = 0;
    let current = 0, previous = 0;
    
    // Merge arrays until we reach median position
    for (let k = 0; k <= medianIndex; k++) {
        previous = current;
        
        if (i >= nums1.length) {
            current = nums2[j++];
        } else if (j >= nums2.length) {
            current = nums1[i++];
        } else if (nums1[i] <= nums2[j]) {
            current = nums1[i++];
        } else {
            current = nums2[j++];
        }
    }
    
    return isEven ? (previous + current) / 2 : current;
}

// Solution 3: Recursive Binary Search
// Time: O(log(m+n)), Space: O(log(m+n))
export function findMedianSortedArrays3(nums1: number[], nums2: number[]): number {
    const total = nums1.length + nums2.length;
    const isEven = total % 2 === 0;
    
    if (isEven) {
        const left = findKthElement(nums1, 0, nums2, 0, Math.floor(total / 2));
        const right = findKthElement(nums1, 0, nums2, 0, Math.floor(total / 2) + 1);
        return (left + right) / 2;
    } else {
        return findKthElement(nums1, 0, nums2, 0, Math.floor(total / 2) + 1);
    }
}

function findKthElement(nums1: number[], start1: number, nums2: number[], start2: number, k: number): number {
    // Ensure nums1 is the smaller remaining array
    if (nums1.length - start1 > nums2.length - start2) {
        return findKthElement(nums2, start2, nums1, start1, k);
    }
    
    // Base cases
    if (start1 >= nums1.length) {
        return nums2[start2 + k - 1];
    }
    
    if (k === 1) {
        return Math.min(nums1[start1], nums2[start2]);
    }
    
    // Binary search approach
    const midK = Math.floor(k / 2);
    const i = Math.min(start1 + midK - 1, nums1.length - 1);
    const j = start2 + midK - 1;
    
    if (nums1[i] <= nums2[j]) {
        return findKthElement(nums1, i + 1, nums2, start2, k - (i - start1 + 1));
    } else {
        return findKthElement(nums1, start1, nums2, j + 1, k - midK);
    }
}

// Solution 4: Weighted Binary Search
// Time: O(log(m+n)), Space: O(1)
export function findMedianSortedArrays4(nums1: number[], nums2: number[]): number {
    const m = nums1.length;
    const n = nums2.length;
    
    // Ensure nums1 is smaller
    if (m > n) {
        return findMedianSortedArrays4(nums2, nums1);
    }
    
    const total = m + n;
    const half = Math.floor((total + 1) / 2);
    
    let left = 0;
    let right = m;
    
    while (left <= right) {
        const cut1 = Math.floor((left + right) / 2);
        const cut2 = half - cut1;
        
        const left1 = cut1 === 0 ? Number.NEGATIVE_INFINITY : nums1[cut1 - 1];
        const left2 = cut2 === 0 ? Number.NEGATIVE_INFINITY : nums2[cut2 - 1];
        
        const right1 = cut1 === m ? Number.POSITIVE_INFINITY : nums1[cut1];
        const right2 = cut2 === n ? Number.POSITIVE_INFINITY : nums2[cut2];
        
        if (left1 <= right2 && left2 <= right1) {
            if (total % 2 === 0) {
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
            } else {
                return Math.max(left1, left2);
            }
        } else if (left1 > right2) {
            right = cut1 - 1;
        } else {
            left = cut1 + 1;
        }
    }
    
    return -1;
}

// Solution 5: Ternary Search Approach
// Time: O(log(m+n)), Space: O(1)
export function findMedianSortedArrays5(nums1: number[], nums2: number[]): number {
    const m = nums1.length;
    const n = nums2.length;
    const total = m + n;
    
    function getKthElement(k: number): number {
        let start1 = 0, start2 = 0;
        
        while (k > 1) {
            if (start1 >= m) {
                return nums2[start2 + k - 1];
            }
            if (start2 >= n) {
                return nums1[start1 + k - 1];
            }
            
            const mid = Math.floor(k / 2);
            const idx1 = Math.min(start1 + mid - 1, m - 1);
            const idx2 = Math.min(start2 + mid - 1, n - 1);
            
            if (nums1[idx1] <= nums2[idx2]) {
                k -= (idx1 - start1 + 1);
                start1 = idx1 + 1;
            } else {
                k -= (idx2 - start2 + 1);
                start2 = idx2 + 1;
            }
        }
        
        if (start1 >= m) return nums2[start2];
        if (start2 >= n) return nums1[start1];
        return Math.min(nums1[start1], nums2[start2]);
    }
    
    if (total % 2 === 1) {
        return getKthElement(Math.floor(total / 2) + 1);
    } else {
        const left = getKthElement(Math.floor(total / 2));
        const right = getKthElement(Math.floor(total / 2) + 1);
        return (left + right) / 2;
    }
}

// Solution 6: Complete Merge for Comparison
// Time: O(m+n), Space: O(m+n)
export function findMedianSortedArrays6(nums1: number[], nums2: number[]): number {
    const merged: number[] = [];
    let i = 0, j = 0;
    
    // Merge the two arrays
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] <= nums2[j]) {
            merged.push(nums1[i++]);
        } else {
            merged.push(nums2[j++]);
        }
    }
    
    // Add remaining elements
    while (i < nums1.length) {
        merged.push(nums1[i++]);
    }
    
    while (j < nums2.length) {
        merged.push(nums2[j++]);
    }
    
    // Find median
    const n = merged.length;
    if (n % 2 === 0) {
        return (merged[n / 2 - 1] + merged[n / 2]) / 2;
    } else {
        return merged[Math.floor(n / 2)];
    }
}

// Test cases
export function testFindMedianSortedArrays() {
    console.log("Testing Median of Two Sorted Arrays:");
    
    const testCases = [
        {
            nums1: [1, 3],
            nums2: [2],
            expected: 2.0
        },
        {
            nums1: [1, 2],
            nums2: [3, 4],
            expected: 2.5
        },
        {
            nums1: [0, 0],
            nums2: [0, 0],
            expected: 0.0
        },
        {
            nums1: [],
            nums2: [1],
            expected: 1.0
        },
        {
            nums1: [2],
            nums2: [],
            expected: 2.0
        },
        {
            nums1: [1, 3, 5],
            nums2: [2, 4, 6],
            expected: 3.5
        },
        {
            nums1: [1, 2, 3, 4, 5],
            nums2: [6, 7, 8, 9, 10],
            expected: 5.5
        },
        {
            nums1: [1, 2, 3],
            nums2: [4, 5, 6, 7],
            expected: 4.0
        }
    ];
    
    const solutions = [
        { name: "Binary Search on Smaller Array", fn: findMedianSortedArrays1 },
        { name: "Merge and Find Median", fn: findMedianSortedArrays2 },
        { name: "Recursive Binary Search", fn: findMedianSortedArrays3 },
        { name: "Weighted Binary Search", fn: findMedianSortedArrays4 },
        { name: "Ternary Search", fn: findMedianSortedArrays5 },
        { name: "Complete Merge", fn: findMedianSortedArrays6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn([...test.nums1], [...test.nums2]);
            const passed = Math.abs(result - test.expected) < 1e-5;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    nums1: ${JSON.stringify(test.nums1)}`);
                console.log(`    nums2: ${JSON.stringify(test.nums2)}`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Understanding**:
 *    - Find median of two sorted arrays in O(log(min(m,n))) time
 *    - Median divides sorted data into two equal halves
 *    - For even length: average of two middle elements
 *    - For odd length: middle element
 * 
 * 2. **Binary Search Strategy**:
 *    - Search for correct partition point
 *    - Left partition has (m+n+1)/2 elements
 *    - Right partition has remaining elements
 *    - Valid partition: all left <= all right
 * 
 * 3. **Partition Conditions**:
 *    - maxLeftX <= minRightY (X's left <= Y's right)
 *    - maxLeftY <= minRightX (Y's left <= X's right)
 *    - If valid: median found
 *    - If not: adjust partition boundaries
 * 
 * 4. **Key Optimization**:
 *    - Always search on smaller array
 *    - Reduces time complexity to O(log(min(m,n)))
 *    - Partition on smaller array, derive other partition
 * 
 * 5. **Edge Cases**:
 *    - Empty arrays (one or both)
 *    - Single element arrays
 *    - Arrays of very different sizes
 *    - All elements in one array smaller than other
 * 
 * 6. **Time Complexity**: O(log(min(m,n)))
 *    - Binary search on smaller array
 *    - Each iteration halves search space
 *    - Much better than O(m+n) merge approach
 * 
 * 7. **Space Complexity**: O(1)
 *    - Only uses constant extra space
 *    - No need to merge arrays
 *    - Optimal space usage
 * 
 * 8. **Alternative Approaches**:
 *    - Merge arrays: O(m+n) time, O(m+n) space
 *    - Kth element search: O(log(m+n)) time
 *    - Weighted binary search variants
 * 
 * 9. **Interview Strategy**:
 *    - Start with understanding median concept
 *    - Explain partition-based approach
 *    - Handle edge cases systematically
 *    - Optimize for smaller array search
 * 
 * 10. **Implementation Details**:
 *     - Use infinity for boundary conditions
 *     - Careful with integer overflow
 *     - Handle odd/even length properly
 *     - Validate partition correctness
 * 
 * 11. **Common Mistakes**:
 *     - Incorrect partition size calculation
 *     - Wrong boundary condition handling
 *     - Not optimizing for smaller array
 *     - Integer overflow in median calculation
 * 
 * 12. **Big Tech Variations**:
 *     - Google: k-way merge for median
 *     - Meta: Streaming median updates
 *     - Amazon: Median in circular arrays
 *     - Microsoft: Weighted median calculation
 * 
 * 13. **Follow-up Questions**:
 *     - What if arrays are not sorted?
 *     - Find median of k sorted arrays
 *     - Streaming median with updates
 *     - Median in 2D matrix
 * 
 * 14. **Real-world Applications**:
 *     - Database query optimization
 *     - Statistical analysis systems
 *     - Data preprocessing pipelines
 *     - Performance monitoring tools
 *     - Quality control systems
 * 
 * 15. **Pattern Recognition**:
 *     - Binary search on solution space
 *     - Partition-based problem solving
 *     - Optimal substructure utilization
 *     - Cross-array boundary management
 * 
 * 16. **Optimization Techniques**:
 *     - Always search smaller array
 *     - Early termination conditions
 *     - Efficient boundary management
 *     - Minimize comparison operations
 */
{% endraw %}
