---
layout: page
title: "Given an array nums of n integers, return an array of all the unique quadruplets "
difficulty: Hard
category: Array
tags: [Array, Two Pointers, Hash Table]
leetcode_url: "https://leetcode.com/problems/given-an-array-nums-of-n-integers-return-an-array-of-all-the-unique-quadruplets-/"
---

# Given an array nums of n integers, return an array of all the unique quadruplets 

**LeetCode Problem # * 18. 4Sum**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 18. 4Sum
 * 
 * Given an array nums of n integers, return an array of all the unique quadruplets 
 * [nums[a], nums[b], nums[c], nums[d]] such that:
 * - 0 <= a, b, c, d < n
 * - a, b, c, and d are distinct.
 * - nums[a] + nums[b] + nums[c] + nums[d] == target
 * 
 * You may return the answer in any order.
 * 
 * Example 1:
 * Input: nums = [1,0,-1,0,-2,2], target = 0
 * Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
 * 
 * Example 2:
 * Input: nums = [2,2,2,2,2], target = 8
 * Output: [[2,2,2,2]]
 * 
 * Constraints:
 * - 1 <= nums.length <= 200
 * - -10^9 <= nums[i] <= 10^9
 * - -10^9 <= target <= 10^9
 */

// Solution 1: Two Pointers (Optimal)
// Time: O(n^3), Space: O(1)
export function fourSum1(nums: number[], target: number): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    const n = nums.length;
    
    for (let i = 0; i < n - 3; i++) {
        // Skip duplicates for first element
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        // Early termination optimizations
        if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break;
        if (nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target) continue;
        
        for (let j = i + 1; j < n - 2; j++) {
            // Skip duplicates for second element
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            
            // Early termination for inner loop
            if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) break;
            if (nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target) continue;
            
            let left = j + 1;
            let right = n - 1;
            
            while (left < right) {
                const sum = nums[i] + nums[j] + nums[left] + nums[right];
                
                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);
                    
                    // Skip duplicates for third element
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    // Skip duplicates for fourth element
                    while (left < right && nums[right] === nums[right - 1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }
    
    return result;
}

// Solution 2: Hash Map Approach
// Time: O(n^3), Space: O(n^2)
export function fourSum2(nums: number[], target: number): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    const n = nums.length;
    
    // Create map of pair sums to indices
    const pairSums = new Map<number, [number, number][]>();
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            const sum = nums[i] + nums[j];
            if (!pairSums.has(sum)) {
                pairSums.set(sum, []);
            }
            pairSums.get(sum)!.push([i, j]);
        }
    }
    
    const seen = new Set<string>();
    
    for (let i = 0; i < n - 3; i++) {
        for (let j = i + 1; j < n - 2; j++) {
            const twoSum = nums[i] + nums[j];
            const needed = target - twoSum;
            
            if (pairSums.has(needed)) {
                for (const [k, l] of pairSums.get(needed)!) {
                    if (k > j && l > k) { // Ensure no index overlap
                        const quad = [nums[i], nums[j], nums[k], nums[l]];
                        const key = quad.join(',');
                        
                        if (!seen.has(key)) {
                            seen.add(key);
                            result.push(quad);
                        }
                    }
                }
            }
        }
    }
    
    return result;
}

// Solution 3: Recursive k-Sum Generalization
// Time: O(n^3), Space: O(n)
export function fourSum3(nums: number[], target: number): number[][] {
    nums.sort((a, b) => a - b);
    
    function kSum(nums: number[], target: number, k: number, start: number): number[][] {
        const result: number[][] = [];
        
        if (start >= nums.length) return result;
        
        // Base case: 2Sum
        if (k === 2) {
            let left = start;
            let right = nums.length - 1;
            
            while (left < right) {
                const sum = nums[left] + nums[right];
                
                if (sum === target) {
                    result.push([nums[left], nums[right]]);
                    
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
            
            return result;
        }
        
        // Recursive case: k > 2
        for (let i = start; i <= nums.length - k; i++) {
            if (i > start && nums[i] === nums[i - 1]) continue;
            
            const subResults = kSum(nums, target - nums[i], k - 1, i + 1);
            
            for (const subResult of subResults) {
                result.push([nums[i], ...subResult]);
            }
        }
        
        return result;
    }
    
    return kSum(nums, target, 4, 0);
}

// Solution 4: Brute Force with Pruning
// Time: O(n^4), Space: O(1)
export function fourSum4(nums: number[], target: number): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    const n = nums.length;
    
    for (let i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        for (let j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            
            for (let k = j + 1; k < n - 1; k++) {
                if (k > j + 1 && nums[k] === nums[k - 1]) continue;
                
                for (let l = k + 1; l < n; l++) {
                    if (l > k + 1 && nums[l] === nums[l - 1]) continue;
                    
                    if (nums[i] + nums[j] + nums[k] + nums[l] === target) {
                        result.push([nums[i], nums[j], nums[k], nums[l]]);
                    }
                }
            }
        }
    }
    
    return result;
}

// Solution 5: Hash Set for Unique Quadruplets
// Time: O(n^3), Space: O(n)
export function fourSum5(nums: number[], target: number): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    const n = nums.length;
    const seen = new Set<string>();
    
    for (let i = 0; i < n - 3; i++) {
        for (let j = i + 1; j < n - 2; j++) {
            const complement = new Set<number>();
            
            for (let k = j + 1; k < n; k++) {
                const needed = target - nums[i] - nums[j] - nums[k];
                
                if (complement.has(needed)) {
                    const quad = [nums[i], nums[j], needed, nums[k]].sort((a, b) => a - b);
                    const key = quad.join(',');
                    
                    if (!seen.has(key)) {
                        seen.add(key);
                        result.push(quad);
                    }
                }
                
                complement.add(nums[k]);
            }
        }
    }
    
    return result;
}

// Solution 6: Divide and Conquer
// Time: O(n^3), Space: O(n)
export function fourSum6(nums: number[], target: number): number[][] {
    nums.sort((a, b) => a - b);
    
    function findQuadruplets(start: number, end: number, currentQuad: number[], targetSum: number, k: number): number[][] {
        const result: number[][] = [];
        
        if (k === 0) {
            if (targetSum === 0) {
                result.push([...currentQuad]);
            }
            return result;
        }
        
        if (end - start + 1 < k) return result;
        
        for (let i = start; i <= end - k + 1; i++) {
            if (i > start && nums[i] === nums[i - 1]) continue;
            
            currentQuad.push(nums[i]);
            const subResults = findQuadruplets(i + 1, end, currentQuad, targetSum - nums[i], k - 1);
            result.push(...subResults);
            currentQuad.pop();
        }
        
        return result;
    }
    
    return findQuadruplets(0, nums.length - 1, [], target, 4);
}

// Test cases
export function testFourSum() {
    console.log("Testing 4Sum:");
    
    const testCases = [
        {
            nums: [1, 0, -1, 0, -2, 2],
            target: 0,
            expected: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]
        },
        {
            nums: [2, 2, 2, 2, 2],
            target: 8,
            expected: [[2, 2, 2, 2]]
        },
        {
            nums: [1, -2, -5, -4, -3, 3, 3, 5],
            target: -11,
            expected: [[-5, -4, -3, 1]]
        },
        {
            nums: [],
            target: 0,
            expected: []
        },
        {
            nums: [1, 2, 3],
            target: 6,
            expected: []
        },
        {
            nums: [-3, -2, -1, 0, 0, 1, 2, 3],
            target: 0,
            expected: [[-3, -2, 2, 3], [-3, -1, 1, 3], [-3, 0, 0, 3], [-3, 0, 1, 2], [-2, -1, 0, 3], [-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]
        }
    ];
    
    const solutions = [
        { name: "Two Pointers (Optimal)", fn: fourSum1 },
        { name: "Hash Map Approach", fn: fourSum2 },
        { name: "Recursive k-Sum", fn: fourSum3 },
        { name: "Brute Force", fn: fourSum4 },
        { name: "Hash Set Unique", fn: fourSum5 },
        { name: "Divide and Conquer", fn: fourSum6 }
    ];
    
    function normalizeResult(result: number[][]): number[][] {
        return result.map(quad => [...quad].sort((a, b) => a - b)).sort();
    }
    
    function arraysEqual(a: number[][], b: number[][]): boolean {
        const normalA = normalizeResult(a);
        const normalB = normalizeResult(b);
        
        if (normalA.length !== normalB.length) return false;
        
        for (let i = 0; i < normalA.length; i++) {
            if (normalA[i].length !== normalB[i].length) return false;
            for (let j = 0; j < normalA[i].length; j++) {
                if (normalA[i][j] !== normalB[i][j]) return false;
            }
        }
        
        return true;
    }
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn([...test.nums], test.target);
            const passed = arraysEqual(result, test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: nums=${JSON.stringify(test.nums)}, target=${test.target}`);
                console.log(`    Expected: ${JSON.stringify(normalizeResult(test.expected))}`);
                console.log(`    Got: ${JSON.stringify(normalizeResult(result))}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Complexity**:
 *    - Extension of 3Sum to four elements
 *    - Need to find all unique quadruplets summing to target
 *    - Avoid duplicate quadruplets in result
 * 
 * 2. **Two Pointers Strategy**:
 *    - Fix first two elements with nested loops
 *    - Use two pointers for remaining two elements
 *    - Reduces complexity from O(n^4) to O(n^3)
 * 
 * 3. **Duplicate Handling**:
 *    - Skip duplicate values at each level
 *    - Essential for avoiding duplicate quadruplets
 *    - Must be careful with indexing when skipping
 * 
 * 4. **Early Termination Optimizations**:
 *    - Check minimum/maximum possible sums
 *    - Break early when target impossible to reach
 *    - Significant performance improvement in practice
 * 
 * 5. **Time Complexity**: O(n^3)
 *    - O(n log n) for sorting
 *    - O(n^3) for triple nested approach
 *    - Best possible for general case
 * 
 * 6. **Space Complexity**: O(1)
 *    - Two pointers approach uses constant space
 *    - Hash map approaches use O(n^2) space
 *    - Result space not counted in complexity
 * 
 * 7. **k-Sum Generalization**:
 *    - Can be extended to any k-sum problem
 *    - Recursive approach works for arbitrary k
 *    - Base case is 2Sum with two pointers
 * 
 * 8. **Interview Strategy**:
 *    - Start with brute force O(n^4) approach
 *    - Optimize to O(n^3) with two pointers
 *    - Add duplicate handling and optimizations
 *    - Discuss k-sum generalization
 * 
 * 9. **Alternative Approaches**:
 *    - Hash map for faster lookup
 *    - Recursive k-sum implementation
 *    - Divide and conquer strategies
 * 
 * 10. **Edge Cases**:
 *     - Empty array or insufficient elements
 *     - All elements the same
 *     - No valid quadruplets exist
 *     - Multiple solutions with same elements
 * 
 * 11. **Optimization Techniques**:
 *     - Early termination based on bounds
 *     - Efficient duplicate skipping
 *     - Pruning impossible branches
 *     - Minimizing redundant calculations
 * 
 * 12. **Common Mistakes**:
 *     - Not handling duplicates properly
 *     - Index management errors
 *     - Wrong termination conditions
 *     - Inefficient duplicate detection
 * 
 * 13. **Big Tech Variations**:
 *     - Google: k-Sum with k as parameter
 *     - Meta: 4Sum with specific constraints
 *     - Amazon: Closest 4Sum to target
 *     - Microsoft: 4Sum with repeated elements
 * 
 * 14. **Follow-up Questions**:
 *     - Generalize to k-Sum problem
 *     - Find 4Sum closest to target
 *     - Count number of valid quadruplets
 *     - 4Sum with distinct elements only
 * 
 * 15. **Real-world Applications**:
 *     - Portfolio optimization (4 assets)
 *     - Resource allocation problems
 *     - Chemical equation balancing
 *     - Game theory combinations
 *     - Statistical correlation analysis
 * 
 * 16. **Pattern Recognition**:
 *     - Multi-pointer technique extension
 *     - Nested loop optimization patterns
 *     - Duplicate elimination strategies
 *     - Search space pruning techniques
 * 
 * 17. **Implementation Tips**:
 *     - Careful index management in loops
 *     - Proper duplicate skipping logic
 *     - Efficient early termination checks
 *     - Clean quadruplet construction
 * 
 * 18. **Performance Considerations**:
 *     - Early termination crucial for large inputs
 *     - Duplicate handling affects average case
 *     - Memory usage varies by approach
 *     - Cache-friendly access patterns
 */
{% endraw %}
