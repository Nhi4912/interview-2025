/**
 * 33. Search in Rotated Sorted Array
 * 
 * There is an integer array nums sorted in ascending order (with distinct values).
 * Prior to being passed to your function, nums is possibly rotated at some pivot index k 
 * (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). 
 * For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].
 * 
 * Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.
 * You must write an algorithm with O(log n) runtime complexity.
 * 
 * Example 1:
 * Input: nums = [4,5,6,7,0,1,2], target = 0
 * Output: 4
 * 
 * Example 2:
 * Input: nums = [4,5,6,7,0,1,2], target = 3
 * Output: -1
 * 
 * Example 3:
 * Input: nums = [1], target = 0
 * Output: -1
 * 
 * Constraints:
 * - 1 <= nums.length <= 5000
 * - -10^4 <= nums[i] <= 10^4
 * - All values of nums are unique.
 * - nums is an ascending array that is possibly rotated.
 * - -10^4 <= target <= 10^4
 */

// Solution 1: Single Binary Search
// Time: O(log n), Space: O(1)
export function search1(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}

// Solution 2: Find Pivot + Binary Search
// Time: O(log n), Space: O(1)
export function search2(nums: number[], target: number): number {
    const n = nums.length;
    
    // Find the pivot point (minimum element index)
    function findPivot(): number {
        let left = 0;
        let right = n - 1;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        return left;
    }
    
    // Standard binary search
    function binarySearch(left: number, right: number): number {
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (nums[mid] === target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
    
    const pivot = findPivot();
    
    // Search in the appropriate half
    if (target >= nums[pivot] && target <= nums[n - 1]) {
        return binarySearch(pivot, n - 1);
    } else {
        return binarySearch(0, pivot - 1);
    }
}

// Solution 3: Modified Binary Search with Detailed Logic
// Time: O(log n), Space: O(1)
export function search3(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Check if left half is sorted
        if (nums[left] < nums[mid]) {
            // Left half is definitely sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else if (nums[left] > nums[mid]) {
            // Right half is definitely sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        } else {
            // nums[left] == nums[mid], move left pointer
            // This handles edge case where left == mid
            left++;
        }
    }
    
    return -1;
}

// Solution 4: Recursive Binary Search
// Time: O(log n), Space: O(log n)
export function search4(nums: number[], target: number): number {
    function searchHelper(left: number, right: number): number {
        if (left > right) return -1;
        
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                return searchHelper(left, mid - 1);
            } else {
                return searchHelper(mid + 1, right);
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                return searchHelper(mid + 1, right);
            } else {
                return searchHelper(left, mid - 1);
            }
        }
    }
    
    return searchHelper(0, nums.length - 1);
}

// Solution 5: Linear Scan (for comparison)
// Time: O(n), Space: O(1)
export function search5(nums: number[], target: number): number {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i;
        }
    }
    return -1;
}

// Solution 6: Binary Search with Rotation Offset
// Time: O(log n), Space: O(1)
export function search6(nums: number[], target: number): number {
    const n = nums.length;
    let left = 0;
    let right = n - 1;
    
    // Find rotation offset
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    const offset = left;
    left = 0;
    right = n - 1;
    
    // Binary search with offset
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const realMid = (mid + offset) % n;
        
        if (nums[realMid] === target) {
            return realMid;
        } else if (nums[realMid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Test cases
export function testSearch() {
    console.log("Testing Search in Rotated Sorted Array:");
    
    const testCases = [
        {
            nums: [4, 5, 6, 7, 0, 1, 2],
            target: 0,
            expected: 4
        },
        {
            nums: [4, 5, 6, 7, 0, 1, 2],
            target: 3,
            expected: -1
        },
        {
            nums: [1],
            target: 0,
            expected: -1
        },
        {
            nums: [1],
            target: 1,
            expected: 0
        },
        {
            nums: [1, 3],
            target: 3,
            expected: 1
        },
        {
            nums: [3, 1],
            target: 1,
            expected: 1
        },
        {
            nums: [5, 1, 3],
            target: 3,
            expected: 2
        },
        {
            nums: [4, 5, 6, 7, 8, 1, 2, 3],
            target: 8,
            expected: 4
        },
        {
            nums: [1, 2, 3, 4, 5],
            target: 3,
            expected: 2
        }
    ];
    
    const solutions = [
        { name: "Single Binary Search", fn: search1 },
        { name: "Find Pivot + Binary Search", fn: search2 },
        { name: "Modified Binary Search", fn: search3 },
        { name: "Recursive Binary Search", fn: search4 },
        { name: "Linear Scan", fn: search5 },
        { name: "Rotation Offset", fn: search6 }
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
 * 1. **Rotated Array Properties**:
 *    - Originally sorted, then rotated at some pivot
 *    - At most one "break point" where order changes
 *    - At least one half is always properly sorted
 * 
 * 2. **Binary Search Adaptation**:
 *    - Determine which half is sorted
 *    - Check if target lies in sorted half
 *    - Search appropriate half based on target location
 * 
 * 3. **Key Decision Logic**:
 *    - If nums[left] <= nums[mid]: left half is sorted
 *    - If nums[mid] <= nums[right]: right half is sorted
 *    - Use target range to decide which half to search
 * 
 * 4. **Time Complexity**: O(log n)
 *    - Each iteration eliminates half the search space
 *    - Same as standard binary search
 *    - Maintains logarithmic efficiency
 * 
 * 5. **Space Complexity**: O(1)
 *    - Iterative approach uses constant space
 *    - Recursive approach uses O(log n) stack space
 * 
 * 6. **Edge Cases Handling**:
 *    - Single element array
 *    - No rotation (already sorted)
 *    - Target at rotation point
 *    - Target not in array
 * 
 * 7. **Alternative Approaches**:
 *    - Find pivot first, then binary search
 *    - Use rotation offset for virtual indexing
 *    - Linear scan (O(n) but simpler)
 * 
 * 8. **Interview Strategy**:
 *    - Start with understanding rotation properties
 *    - Adapt standard binary search logic
 *    - Handle edge cases carefully
 *    - Test with various rotation scenarios
 * 
 * 9. **Common Mistakes**:
 *    - Incorrect condition for determining sorted half
 *    - Wrong target range checking
 *    - Not handling equal elements properly
 *    - Off-by-one errors in boundaries
 * 
 * 10. **Comparison Logic**:
 *     - nums[left] <= nums[mid]: left sorted (including equal case)
 *     - Use strict inequalities for target range
 *     - Handle boundary conditions carefully
 * 
 * 11. **Optimization Techniques**:
 *     - Early termination when target found
 *     - Minimize comparisons in each iteration
 *     - Handle special cases upfront
 * 
 * 12. **Big Tech Variations**:
 *     - Google: Search with duplicates allowed
 *     - Meta: Find minimum in rotated array
 *     - Amazon: Search in 2D rotated matrix
 *     - Microsoft: Multiple rotation points
 * 
 * 13. **Follow-up Questions**:
 *     - Handle duplicate elements
 *     - Find all occurrences of target
 *     - Search in rotated sorted array II
 *     - Find rotation point index
 * 
 * 14. **Real-world Applications**:
 *     - Circular buffer searches
 *     - Time-based data analysis
 *     - Log file searching
 *     - Cyclic data structures
 *     - Cache management systems
 * 
 * 15. **Pattern Recognition**:
 *     - Modified binary search pattern
 *     - Divide and conquer approach
 *     - Conditional search space reduction
 *     - Sorted array with single discontinuity
 * 
 * 16. **Testing Strategy**:
 *     - Test with different rotation points
 *     - Verify with no rotation case
 *     - Check boundary elements
 *     - Validate with target not found
 */