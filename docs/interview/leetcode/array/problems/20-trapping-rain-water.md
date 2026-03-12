---
layout: page
title: "Trapping Rain Water"
difficulty: Hard
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/trapping-rain-water/"
---

# Trapping Rain Water

**LeetCode Problem # * 42. Trapping Rain Water**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 42. Trapping Rain Water
 * 
 * Given n non-negative integers representing an elevation map where the width of each bar is 1, 
 * compute how much water it can trap after raining.
 * 
 * Example 1:
 * Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
 * Output: 6
 * Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. 
 * In this case, 6 units of rain water (blue section) are being trapped.
 * 
 * Example 2:
 * Input: height = [4,2,0,3,2,5]
 * Output: 9
 * 
 * Constraints:
 * - n == height.length
 * - 1 <= n <= 2 * 10^4
 * - 0 <= height[i] <= 3 * 10^4
 */

// Solution 1: Brute Force (For each position, find left and right max)
// Time: O(n²), Space: O(1)
export function trap1(height: number[]): number {
    if (height.length < 3) return 0;
    
    let totalWater = 0;
    
    for (let i = 1; i < height.length - 1; i++) {
        // Find max height to the left
        let leftMax = 0;
        for (let j = 0; j < i; j++) {
            leftMax = Math.max(leftMax, height[j]);
        }
        
        // Find max height to the right
        let rightMax = 0;
        for (let j = i + 1; j < height.length; j++) {
            rightMax = Math.max(rightMax, height[j]);
        }
        
        // Water level is minimum of left and right max
        const waterLevel = Math.min(leftMax, rightMax);
        
        // Add trapped water at current position
        if (waterLevel > height[i]) {
            totalWater += waterLevel - height[i];
        }
    }
    
    return totalWater;
}

// Solution 2: Dynamic Programming (Precompute left and right max arrays)
// Time: O(n), Space: O(n)
export function trap2(height: number[]): number {
    if (height.length < 3) return 0;
    
    const n = height.length;
    const leftMax = new Array(n);
    const rightMax = new Array(n);
    
    // Compute left max for each position
    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }
    
    // Compute right max for each position
    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }
    
    // Calculate trapped water
    let totalWater = 0;
    for (let i = 0; i < n; i++) {
        const waterLevel = Math.min(leftMax[i], rightMax[i]);
        totalWater += Math.max(0, waterLevel - height[i]);
    }
    
    return totalWater;
}

// Solution 3: Two Pointers (Optimal)
// Time: O(n), Space: O(1)
export function trap3(height: number[]): number {
    if (height.length < 3) return 0;
    
    let left = 0;
    let right = height.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    let totalWater = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }
    
    return totalWater;
}

// Solution 4: Stack-based Approach
// Time: O(n), Space: O(n)
export function trap4(height: number[]): number {
    if (height.length < 3) return 0;
    
    const stack: number[] = [];
    let totalWater = 0;
    
    for (let i = 0; i < height.length; i++) {
        while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
            const bottom = stack.pop()!;
            
            if (stack.length === 0) break;
            
            const left = stack[stack.length - 1];
            const width = i - left - 1;
            const waterHeight = Math.min(height[left], height[i]) - height[bottom];
            
            totalWater += width * waterHeight;
        }
        
        stack.push(i);
    }
    
    return totalWater;
}

// Solution 5: Divide and Conquer
// Time: O(n log n), Space: O(log n)
export function trap5(height: number[]): number {
    if (height.length < 3) return 0;
    
    function divideAndConquer(left: number, right: number, maxLeft: number, maxRight: number): number {
        if (left >= right) return 0;
        
        // Find the maximum height in current range
        let maxIdx = left;
        for (let i = left + 1; i <= right; i++) {
            if (height[i] > height[maxIdx]) {
                maxIdx = i;
            }
        }
        
        let water = 0;
        
        // Calculate water trapped to the left of max
        for (let i = left; i < maxIdx; i++) {
            water += Math.max(0, Math.min(maxLeft, height[maxIdx]) - height[i]);
        }
        
        // Calculate water trapped to the right of max
        for (let i = maxIdx + 1; i <= right; i++) {
            water += Math.max(0, Math.min(height[maxIdx], maxRight) - height[i]);
        }
        
        // Recursively solve left and right parts
        water += divideAndConquer(left, maxIdx - 1, maxLeft, height[maxIdx]);
        water += divideAndConquer(maxIdx + 1, right, height[maxIdx], maxRight);
        
        return water;
    }
    
    return divideAndConquer(0, height.length - 1, 0, 0);
}

// Solution 6: Segment Tree Approach (Advanced)
// Time: O(n log n), Space: O(n)
export function trap6(height: number[]): number {
    if (height.length < 3) return 0;
    
    class SegmentTree {
        tree: number[];
        n: number;
        
        constructor(arr: number[]) {
            this.n = arr.length;
            this.tree = new Array(4 * this.n);
            this.build(arr, 1, 0, this.n - 1);
        }
        
        build(arr: number[], node: number, start: number, end: number): void {
            if (start === end) {
                this.tree[node] = arr[start];
            } else {
                const mid = Math.floor((start + end) / 2);
                this.build(arr, 2 * node, start, mid);
                this.build(arr, 2 * node + 1, mid + 1, end);
                this.tree[node] = Math.max(this.tree[2 * node], this.tree[2 * node + 1]);
            }
        }
        
        query(node: number, start: number, end: number, l: number, r: number): number {
            if (r < start || end < l) return 0;
            if (l <= start && end <= r) return this.tree[node];
            
            const mid = Math.floor((start + end) / 2);
            const leftMax = this.query(2 * node, start, mid, l, r);
            const rightMax = this.query(2 * node + 1, mid + 1, end, l, r);
            return Math.max(leftMax, rightMax);
        }
        
        rangeMax(l: number, r: number): number {
            return this.query(1, 0, this.n - 1, l, r);
        }
    }
    
    const segTree = new SegmentTree(height);
    let totalWater = 0;
    
    for (let i = 1; i < height.length - 1; i++) {
        const leftMax = segTree.rangeMax(0, i - 1);
        const rightMax = segTree.rangeMax(i + 1, height.length - 1);
        const waterLevel = Math.min(leftMax, rightMax);
        totalWater += Math.max(0, waterLevel - height[i]);
    }
    
    return totalWater;
}

// Test cases
export function testTrap() {
    console.log("Testing Trapping Rain Water:");
    
    const testCases = [
        {
            input: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            expected: 6
        },
        {
            input: [4, 2, 0, 3, 2, 5],
            expected: 9
        },
        {
            input: [3, 0, 2, 0, 4],
            expected: 7
        },
        {
            input: [0, 1, 0],
            expected: 0
        },
        {
            input: [1, 0, 1],
            expected: 1
        },
        {
            input: [5, 4, 1, 2],
            expected: 1
        },
        {
            input: [2, 1, 2],
            expected: 1
        }
    ];
    
    const solutions = [
        { name: "Brute Force", fn: trap1 },
        { name: "Dynamic Programming", fn: trap2 },
        { name: "Two Pointers", fn: trap3 },
        { name: "Stack-based", fn: trap4 },
        { name: "Divide and Conquer", fn: trap5 },
        { name: "Segment Tree", fn: trap6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn([...test.input]);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: ${JSON.stringify(test.input)}`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Core Concept**:
 *    - Water at position i = min(leftMax, rightMax) - height[i]
 *    - Can only trap water if surrounded by higher walls
 *    - Water level determined by the shorter of the two sides
 * 
 * 2. **Two Pointers Intuition**:
 *    - Move pointer with smaller height
 *    - If left < right, process left (we know leftMax <= rightMax)
 *    - Safe to calculate water at left position
 * 
 * 3. **Stack Approach**:
 *    - Process horizontal layers of water
 *    - When height increases, calculate trapped water
 *    - Stack maintains decreasing heights
 * 
 * 4. **Time Complexity Analysis**:
 *    - Brute Force: O(n²) - for each position, scan left and right
 *    - DP: O(n) - precompute max arrays
 *    - Two Pointers: O(n) - single pass
 *    - Stack: O(n) - each element pushed/popped once
 * 
 * 5. **Space Complexity**:
 *    - Two Pointers: O(1) - optimal space
 *    - DP: O(n) - two arrays for left/right max
 *    - Stack: O(n) - worst case all elements in stack
 * 
 * 6. **Interview Strategy**:
 *    - Start with brute force explanation
 *    - Optimize with DP (precomputation)
 *    - Further optimize with two pointers
 *    - Discuss stack approach for variety
 * 
 * 7. **Edge Cases**:
 *    - Array length < 3 (no water possible)
 *    - All heights increasing/decreasing
 *    - All heights equal
 *    - Heights with value 0
 * 
 * 8. **Why Two Pointers Work**:
 *    - We don't need exact leftMax/rightMax values
 *    - Only need to know which side limits water level
 *    - Process the side that's guaranteed to be limiting
 * 
 * 9. **Common Mistakes**:
 *    - Not handling edge positions properly
 *    - Incorrect water level calculation
 *    - Off-by-one errors in array access
 *    - Not considering negative water amounts
 * 
 * 10. **Big Tech Variations**:
 *     - Google: 2D rain water trapping
 *     - Meta: Container with most water (different problem)
 *     - Amazon: Rain water with obstacles
 *     - Microsoft: Circular array trapping
 * 
 * 11. **Follow-up Questions**:
 *     - 2D version of the problem
 *     - Find positions where water is trapped
 *     - Handle negative heights
 *     - Optimize for very large arrays
 * 
 * 12. **Real-world Applications**:
 *     - Urban planning and drainage
 *     - Terrain analysis for water retention
 *     - Architecture and roof design
 *     - Environmental engineering
 *     - Game development (water physics)
 * 
 * 13. **Visualization Tips**:
 *     - Draw the elevation map
 *     - Mark left and right boundaries
 *     - Fill water level by level
 *     - Understand why certain positions can't hold water
 */
{% endraw %}
