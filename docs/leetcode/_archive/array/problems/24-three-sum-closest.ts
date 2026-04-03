/**
 * 16. 3Sum Closest
 * 
 * Given an integer array nums of length n and an integer target, find three integers 
 * in nums such that the sum is closest to target.
 * 
 * Return the sum of the three integers.
 * 
 * You may assume that each input would have exactly one solution.
 * 
 * Example 1:
 * Input: nums = [-1,2,1,-4], target = 1
 * Output: 2
 * Explanation: The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).
 * 
 * Example 2:
 * Input: nums = [0,0,0], target = 1
 * Output: 0
 * Explanation: The sum that is closest to the target is 0. (0 + 0 + 0 = 0).
 * 
 * Constraints:
 * - 3 <= nums.length <= 500
 * - -1000 <= nums[i] <= 1000
 * - -10^4 <= target <= 10^4
 */

// Solution 1: Two Pointers (Optimal)
// Time: O(n^2), Space: O(1)
export function threeSumClosest1(nums: number[], target: number): number {
    nums.sort((a, b) => a - b);
    let closestSum = nums[0] + nums[1] + nums[2];
    let minDiff = Math.abs(closestSum - target);
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for first element
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const currentSum = nums[i] + nums[left] + nums[right];
            const currentDiff = Math.abs(currentSum - target);
            
            if (currentDiff < minDiff) {
                minDiff = currentDiff;
                closestSum = currentSum;
            }
            
            if (currentSum === target) {
                return currentSum; // Exact match found
            } else if (currentSum < target) {
                left++;
                // Skip duplicates
                while (left < right && nums[left] === nums[left - 1]) left++;
            } else {
                right--;
                // Skip duplicates
                while (left < right && nums[right] === nums[right + 1]) right--;
            }
        }
    }
    
    return closestSum;
}

// Solution 2: Binary Search Enhancement
// Time: O(n^2 log n), Space: O(1)
export function threeSumClosest2(nums: number[], target: number): number {
    nums.sort((a, b) => a - b);
    let closestSum = nums[0] + nums[1] + nums[2];
    let minDiff = Math.abs(closestSum - target);
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        for (let j = i + 1; j < nums.length - 1; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            
            const twoSum = nums[i] + nums[j];
            const needed = target - twoSum;
            
            // Binary search for closest value to needed
            let left = j + 1, right = nums.length - 1;
            
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const currentSum = twoSum + nums[mid];
                const currentDiff = Math.abs(currentSum - target);
                
                if (currentDiff < minDiff) {
                    minDiff = currentDiff;
                    closestSum = currentSum;
                }
                
                if (nums[mid] === needed) {
                    return currentSum;
                } else if (nums[mid] < needed) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            
            // Check boundaries
            if (j + 1 < nums.length) {
                const sum1 = twoSum + nums[j + 1];
                if (Math.abs(sum1 - target) < minDiff) {
                    minDiff = Math.abs(sum1 - target);
                    closestSum = sum1;
                }
            }
            
            if (nums.length - 1 >= j + 1) {
                const sum2 = twoSum + nums[nums.length - 1];
                if (Math.abs(sum2 - target) < minDiff) {
                    minDiff = Math.abs(sum2 - target);
                    closestSum = sum2;
                }
            }
        }
    }
    
    return closestSum;
}

// Solution 3: Brute Force with Optimization
// Time: O(n^3), Space: O(1)
export function threeSumClosest3(nums: number[], target: number): number {
    let closestSum = nums[0] + nums[1] + nums[2];
    let minDiff = Math.abs(closestSum - target);
    
    for (let i = 0; i < nums.length - 2; i++) {
        for (let j = i + 1; j < nums.length - 1; j++) {
            for (let k = j + 1; k < nums.length; k++) {
                const currentSum = nums[i] + nums[j] + nums[k];
                const currentDiff = Math.abs(currentSum - target);
                
                if (currentDiff < minDiff) {
                    minDiff = currentDiff;
                    closestSum = currentSum;
                    
                    // Early termination if exact match
                    if (currentDiff === 0) return closestSum;
                }
            }
        }
    }
    
    return closestSum;
}

// Solution 4: Two Pointers with Early Termination
// Time: O(n^2), Space: O(1)
export function threeSumClosest4(nums: number[], target: number): number {
    nums.sort((a, b) => a - b);
    let closestSum = nums[0] + nums[1] + nums[2];
    let minDiff = Math.abs(closestSum - target);
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Early termination checks
        const minPossible = nums[i] + nums[i + 1] + nums[i + 2];
        if (minPossible > target && Math.abs(minPossible - target) >= minDiff) {
            break;
        }
        
        const maxPossible = nums[i] + nums[nums.length - 2] + nums[nums.length - 1];
        if (maxPossible < target && Math.abs(maxPossible - target) >= minDiff) {
            continue;
        }
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const currentSum = nums[i] + nums[left] + nums[right];
            
            if (currentSum === target) {
                return currentSum;
            }
            
            const currentDiff = Math.abs(currentSum - target);
            if (currentDiff < minDiff) {
                minDiff = currentDiff;
                closestSum = currentSum;
            }
            
            if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return closestSum;
}

// Solution 5: Divide and Conquer
// Time: O(n^2 log n), Space: O(log n)
export function threeSumClosest5(nums: number[], target: number): number {
    nums.sort((a, b) => a - b);
    
    function findClosestInRange(start: number, end: number, currentSum: number, remaining: number): number {
        if (remaining === 0) {
            return currentSum;
        }
        
        if (remaining === 1) {
            let closest = nums[start];
            let minDiff = Math.abs(closest + currentSum - target);
            
            for (let i = start; i <= end; i++) {
                const diff = Math.abs(nums[i] + currentSum - target);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = nums[i];
                }
            }
            
            return currentSum + closest;
        }
        
        let bestSum = currentSum;
        let minDiff = Infinity;
        
        for (let i = start; i <= end - remaining + 1; i++) {
            const newSum = findClosestInRange(i + 1, end, currentSum + nums[i], remaining - 1);
            const diff = Math.abs(newSum - target);
            
            if (diff < minDiff) {
                minDiff = diff;
                bestSum = newSum;
            }
            
            if (diff === 0) break;
        }
        
        return bestSum;
    }
    
    return findClosestInRange(0, nums.length - 1, 0, 3);
}

// Solution 6: Hash Map with Complement Search
// Time: O(n^2), Space: O(n)
export function threeSumClosest6(nums: number[], target: number): number {
    let closestSum = nums[0] + nums[1] + nums[2];
    let minDiff = Math.abs(closestSum - target);
    
    // Create frequency map
    const freq = new Map<number, number>();
    for (const num of nums) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    const uniqueNums = Array.from(freq.keys()).sort((a, b) => a - b);
    
    for (let i = 0; i < uniqueNums.length; i++) {
        for (let j = i; j < uniqueNums.length; j++) {
            const num1 = uniqueNums[i];
            const num2 = uniqueNums[j];
            
            // Check if we can use these numbers
            let availableCount1 = freq.get(num1)!;
            let availableCount2 = freq.get(num2)!;
            
            if (i === j && availableCount1 < 2) continue;
            
            const twoSum = num1 + num2;
            const needed = target - twoSum;
            
            // Find closest available third number
            for (const num3 of uniqueNums) {
                let availableCount3 = freq.get(num3)!;
                
                // Check availability constraints
                if (num3 === num1) availableCount3--;
                if (num3 === num2) availableCount3--;
                if (availableCount3 <= 0) continue;
                
                const currentSum = twoSum + num3;
                const currentDiff = Math.abs(currentSum - target);
                
                if (currentDiff < minDiff) {
                    minDiff = currentDiff;
                    closestSum = currentSum;
                }
            }
        }
    }
    
    return closestSum;
}

// Test cases
export function testThreeSumClosest() {
    console.log("Testing 3Sum Closest:");
    
    const testCases = [
        {
            nums: [-1, 2, 1, -4],
            target: 1,
            expected: 2
        },
        {
            nums: [0, 0, 0],
            target: 1,
            expected: 0
        },
        {
            nums: [1, 1, 1, 0],
            target: -100,
            expected: 2
        },
        {
            nums: [1, 2, 3],
            target: 6,
            expected: 6
        },
        {
            nums: [1, 1, -1, -1, 3],
            target: 3,
            expected: 3
        },
        {
            nums: [-1, 0, 1, 1, 55],
            target: 3,
            expected: 2
        },
        {
            nums: [1, 6, 9, 14, 16, 70],
            target: 81,
            expected: 80
        }
    ];
    
    const solutions = [
        { name: "Two Pointers (Optimal)", fn: threeSumClosest1 },
        { name: "Binary Search Enhancement", fn: threeSumClosest2 },
        { name: "Brute Force", fn: threeSumClosest3 },
        { name: "Two Pointers + Early Termination", fn: threeSumClosest4 },
        { name: "Divide and Conquer", fn: threeSumClosest5 },
        { name: "Hash Map + Complement", fn: threeSumClosest6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn([...test.nums], test.target);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: nums=${JSON.stringify(test.nums)}, target=${test.target}`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Core**:
 *    - Find three numbers with sum closest to target
 *    - Unlike 3Sum, we want closest sum, not exact sum
 *    - Always has exactly one solution (guaranteed)
 * 
 * 2. **Two Pointers Strategy**:
 *    - Sort array first for two-pointer technique
 *    - Fix first element, use two pointers for remaining
 *    - Track closest sum and minimum difference
 * 
 * 3. **Optimization Techniques**:
 *    - Skip duplicate elements to avoid redundant calculations
 *    - Early termination when exact target found
 *    - Boundary checks for impossible ranges
 * 
 * 4. **Distance Tracking**:
 *    - Use Math.abs(currentSum - target) for distance
 *    - Update closest sum when smaller distance found
 *    - Return immediately if distance is 0 (exact match)
 * 
 * 5. **Time Complexity**: O(n^2)
 *    - O(n log n) for sorting
 *    - O(n^2) for nested loops with two pointers
 *    - Optimal for comparison-based approach
 * 
 * 6. **Space Complexity**: O(1)
 *    - Only uses constant extra space
 *    - Sorting can be in-place
 *    - No additional data structures needed
 * 
 * 7. **Edge Cases**:
 *    - Minimum array size (3 elements)
 *    - All same elements
 *    - Target much larger/smaller than possible sums
 *    - Exact match exists
 * 
 * 8. **Interview Strategy**:
 *    - Start with brute force explanation
 *    - Optimize to two pointers approach
 *    - Discuss duplicate handling
 *    - Add early termination optimizations
 * 
 * 9. **Key Observations**:
 *    - Sorting enables two-pointer technique
 *    - Only need to track one closest sum
 *    - Can terminate early on exact match
 * 
 * 10. **Implementation Details**:
 *     - Careful with duplicate skipping logic
 *     - Proper initialization of closest sum
 *     - Correct boundary handling in loops
 * 
 * 11. **Optimization Opportunities**:
 *     - Early termination based on impossible ranges
 *     - Binary search for third element (though not always better)
 *     - Skip redundant combinations
 * 
 * 12. **Common Mistakes**:
 *     - Not handling duplicates properly
 *     - Incorrect distance calculation
 *     - Wrong initialization of closest sum
 *     - Off-by-one errors in pointer movement
 * 
 * 13. **Big Tech Variations**:
 *     - Google: k-Sum closest problems
 *     - Meta: Closest sum with constraints
 *     - Amazon: Multiple closest sums
 *     - Microsoft: Weighted closest sum
 * 
 * 14. **Follow-up Questions**:
 *     - Find all triplets with sum closest to target
 *     - k-Sum closest generalization
 *     - Closest sum with distinct elements
 *     - Multiple targets simultaneously
 * 
 * 15. **Real-world Applications**:
 *     - Resource allocation optimization
 *     - Portfolio optimization in finance
 *     - Approximation algorithms
 *     - Machine learning feature selection
 *     - Chemical compound analysis
 * 
 * 16. **Pattern Recognition**:
 *     - Two pointers on sorted array
 *     - Optimization problem (minimize difference)
 *     - Greedy approach with local decisions
 *     - Search space reduction techniques
 * 
 * 17. **Alternative Approaches**:
 *     - Binary search for third element
 *     - Hash map for complement lookup
 *     - Divide and conquer strategies
 *     - Dynamic programming (overkill for this)
 * 
 * 18. **Performance Considerations**:
 *     - Input size affects algorithm choice
 *     - Memory constraints may limit approaches
 *     - Early termination can significantly improve average case
 *     - Duplicate handling affects practical performance
 */