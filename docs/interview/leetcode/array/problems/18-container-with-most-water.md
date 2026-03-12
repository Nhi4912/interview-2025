---
layout: page
title: "Container With Most Water"
difficulty: Hard
category: Array
tags: [Array, Two Pointers, Hash Table]
leetcode_url: "https://leetcode.com/problems/container-with-most-water/"
---

# Container With Most Water

**LeetCode Problem # * 11. Container With Most Water**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 11. Container With Most Water
 * 
 * You are given an integer array height of length n. There are n vertical lines drawn such that 
 * the two endpoints of the ith line are (i, 0) and (i, height[i]).
 * 
 * Find two lines that together with the x-axis form a container that can hold the most water.
 * 
 * Return the maximum amount of water a container can store.
 * 
 * Notice that you may not slant the container.
 * 
 * Example 1:
 * Input: height = [1,8,6,2,5,4,8,3,7]
 * Output: 49
 * Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. 
 * In this case, the max area of water (blue section) the container can contain is 49.
 * 
 * Example 2:
 * Input: height = [1,1]
 * Output: 1
 * 
 * Constraints:
 * - n == height.length
 * - 2 <= n <= 10^5
 * - 0 <= height[i] <= 10^4
 */

// Solution 1: Brute Force (Check all pairs)
// Time: O(n²), Space: O(1)
export function maxArea1(height: number[]): number {
    let maxArea = 0;
    
    for (let i = 0; i < height.length; i++) {
        for (let j = i + 1; j < height.length; j++) {
            const width = j - i;
            const minHeight = Math.min(height[i], height[j]);
            const area = width * minHeight;
            maxArea = Math.max(maxArea, area);
        }
    }
    
    return maxArea;
}

// Solution 2: Two Pointers (Optimal)
// Time: O(n), Space: O(1)
export function maxArea2(height: number[]): number {
    let left = 0;
    let right = height.length - 1;
    let maxArea = 0;
    
    while (left < right) {
        // Calculate current area
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const area = width * currentHeight;
        maxArea = Math.max(maxArea, area);
        
        // Move the pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}

// Solution 3: Two Pointers with Optimization (Skip smaller heights)
// Time: O(n), Space: O(1)
export function maxArea3(height: number[]): number {
    let left = 0;
    let right = height.length - 1;
    let maxArea = 0;
    
    while (left < right) {
        const width = right - left;
        const leftHeight = height[left];
        const rightHeight = height[right];
        const currentHeight = Math.min(leftHeight, rightHeight);
        const area = width * currentHeight;
        
        maxArea = Math.max(maxArea, area);
        
        // Skip all smaller or equal heights on the side we're moving
        if (leftHeight < rightHeight) {
            const currentLeftHeight = leftHeight;
            while (left < right && height[left] <= currentLeftHeight) {
                left++;
            }
        } else {
            const currentRightHeight = rightHeight;
            while (left < right && height[right] <= currentRightHeight) {
                right--;
            }
        }
    }
    
    return maxArea;
}

// Solution 4: Divide and Conquer
// Time: O(n log n), Space: O(log n)
export function maxArea4(height: number[]): number {
    function divideAndConquer(heights: number[], start: number, end: number): number {
        if (start >= end) return 0;
        
        // Base case: only two elements
        if (end - start === 1) {
            return Math.min(heights[start], heights[end]) * (end - start);
        }
        
        const mid = Math.floor((start + end) / 2);
        
        // Max area in left half
        const leftMax = divideAndConquer(heights, start, mid);
        
        // Max area in right half
        const rightMax = divideAndConquer(heights, mid + 1, end);
        
        // Max area crossing the middle
        let crossMax = 0;
        for (let i = start; i <= mid; i++) {
            for (let j = mid + 1; j <= end; j++) {
                const area = Math.min(heights[i], heights[j]) * (j - i);
                crossMax = Math.max(crossMax, area);
            }
        }
        
        return Math.max(leftMax, rightMax, crossMax);
    }
    
    return divideAndConquer(height, 0, height.length - 1);
}

// Solution 5: Dynamic Programming with Memoization
// Time: O(n²), Space: O(n²)
export function maxArea5(height: number[]): number {
    const memo = new Map<string, number>();
    
    function dp(left: number, right: number): number {
        if (left >= right) return 0;
        
        const key = `${left},${right}`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentArea = width * currentHeight;
        
        // Try moving left pointer
        const leftMove = dp(left + 1, right);
        
        // Try moving right pointer
        const rightMove = dp(left, right - 1);
        
        const result = Math.max(currentArea, leftMove, rightMove);
        memo.set(key, result);
        return result;
    }
    
    return dp(0, height.length - 1);
}

// Test cases
export function testMaxArea() {
    console.log("Testing Container With Most Water:");
    
    const testCases = [
        {
            input: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            expected: 49
        },
        {
            input: [1, 1],
            expected: 1
        },
        {
            input: [1, 2, 1],
            expected: 2
        },
        {
            input: [1, 3, 2, 5, 25, 24, 5],
            expected: 24
        },
        {
            input: [2, 3, 4, 5, 18, 17, 6],
            expected: 17
        }
    ];
    
    const solutions = [
        { name: "Brute Force", fn: maxArea1 },
        { name: "Two Pointers", fn: maxArea2 },
        { name: "Two Pointers Optimized", fn: maxArea3 },
        { name: "Divide and Conquer", fn: maxArea4 },
        { name: "Dynamic Programming", fn: maxArea5 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.input);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Two Pointers Intuition**: 
 *    - Start with maximum width (leftmost and rightmost)
 *    - Move the pointer with smaller height (bottleneck)
 *    - Moving the taller pointer cannot increase area
 * 
 * 2. **Why Two Pointers Work**:
 *    - Width decreases as we move inward
 *    - Only way to increase area is by increasing height
 *    - Moving shorter pointer gives chance for taller container
 * 
 * 3. **Time Complexity Analysis**:
 *    - Brute Force: O(n²) - check all pairs
 *    - Two Pointers: O(n) - single pass
 *    - Divide & Conquer: O(n log n) - not optimal for this problem
 *    - DP: O(n²) - overkill with memoization
 * 
 * 4. **Space Complexity**:
 *    - Two Pointers: O(1) - most efficient
 *    - Others: O(n) to O(n²) due to recursion/memoization
 * 
 * 5. **Interview Strategy**:
 *    - Start with brute force explanation
 *    - Identify the key insight about moving pointers
 *    - Implement two pointers solution
 *    - Discuss why it works mathematically
 * 
 * 6. **Common Mistakes**:
 *    - Moving both pointers simultaneously
 *    - Moving the taller pointer instead of shorter
 *    - Not understanding why two pointers guarantee optimal solution
 * 
 * 7. **Follow-up Questions**:
 *    - What if we need to find the actual indices?
 *    - How to handle negative heights?
 *    - Can we solve with different constraints?
 */
{% endraw %}
