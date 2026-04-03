/**
 * 80. Remove Duplicates from Sorted Array II
 * 
 * Given an integer array nums sorted in non-decreasing order, remove some duplicates 
 * in-place such that each unique element appears at most twice. The relative order 
 * of the elements should be kept the same.
 * 
 * Since it is impossible to change the length of the array in some languages, you must 
 * instead have the result be placed in the first part of the array nums. More formally, 
 * if there are k elements after removing the duplicates, then the first k elements of 
 * nums should hold the final result. It does not matter what you leave beyond the first k elements.
 * 
 * Return k after placing the final result in the first k slots of nums.
 * 
 * Do not allocate extra space for another array. You must do this by modifying the 
 * input array in-place with O(1) extra memory.
 * 
 * Example 1:
 * Input: nums = [1,1,1,2,2,3]
 * Output: 5, nums = [1,1,2,2,3,_]
 * Explanation: Your function should return k = 5, with the first five elements of nums being 1, 1, 2, 2, and 3 respectively.
 * It does not matter what you leave beyond the returned k (hence they are underscores).
 * 
 * Example 2:
 * Input: nums = [0,0,1,1,1,1,2,3,3]
 * Output: 7, nums = [0,0,1,1,2,3,3,_,_]
 * 
 * Constraints:
 * - 1 <= nums.length <= 3 * 10^4
 * - -10^4 <= nums[i] <= 10^4
 * - nums is sorted in non-decreasing order.
 */

// Solution 1: Two Pointers (Optimal)
// Time: O(n), Space: O(1)
export function removeDuplicates1(nums: number[]): number {
    if (nums.length <= 2) return nums.length;
    
    let writeIndex = 2; // Start from index 2 since first two elements are always valid
    
    for (let readIndex = 2; readIndex < nums.length; readIndex++) {
        // Current element can be included if it's different from element two positions back
        if (nums[readIndex] !== nums[writeIndex - 2]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }
    
    return writeIndex;
}

// Solution 2: Count-based Approach
// Time: O(n), Space: O(1)
export function removeDuplicates2(nums: number[]): number {
    if (nums.length <= 2) return nums.length;
    
    let writeIndex = 0;
    let count = 1;
    
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) {
            count++;
        } else {
            count = 1;
        }
        
        if (count <= 2) {
            writeIndex++;
            nums[writeIndex] = nums[i];
        }
    }
    
    return writeIndex + 1;
}

// Solution 3: Three Pointers with Explicit Tracking
// Time: O(n), Space: O(1)
export function removeDuplicates3(nums: number[]): number {
    if (nums.length <= 2) return nums.length;
    
    let slow = 0; // Position to write next valid element
    let fast = 0; // Current reading position
    let count = 0; // Count of current element
    
    while (fast < nums.length) {
        if (fast === 0 || nums[fast] !== nums[fast - 1]) {
            count = 1;
        } else {
            count++;
        }
        
        if (count <= 2) {
            nums[slow] = nums[fast];
            slow++;
        }
        
        fast++;
    }
    
    return slow;
}

// Solution 4: Generalized k-Duplicates Solution
// Time: O(n), Space: O(1)
export function removeDuplicates4(nums: number[], k: number = 2): number {
    if (nums.length <= k) return nums.length;
    
    let writeIndex = k;
    
    for (let readIndex = k; readIndex < nums.length; readIndex++) {
        if (nums[readIndex] !== nums[writeIndex - k]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }
    
    return writeIndex;
}

// Solution 5: State Machine Approach
// Time: O(n), Space: O(1)
export function removeDuplicates5(nums: number[]): number {
    if (nums.length <= 2) return nums.length;
    
    let writeIndex = 0;
    let state = 0; // 0: first occurrence, 1: second occurrence, 2: third+ occurrence
    
    for (let i = 0; i < nums.length; i++) {
        if (i === 0 || nums[i] !== nums[i - 1]) {
            // New element, reset state
            state = 0;
            nums[writeIndex++] = nums[i];
        } else if (state === 0) {
            // Second occurrence of current element
            state = 1;
            nums[writeIndex++] = nums[i];
        } else {
            // Third+ occurrence, skip
            state = 2;
        }
    }
    
    return writeIndex;
}

// Solution 6: Sliding Window Approach
// Time: O(n), Space: O(1)
export function removeDuplicates6(nums: number[]): number {
    if (nums.length <= 2) return nums.length;
    
    let writeIndex = 0;
    
    for (let i = 0; i < nums.length; i++) {
        // Always include first element
        if (writeIndex < 2 || nums[i] !== nums[writeIndex - 2]) {
            nums[writeIndex] = nums[i];
            writeIndex++;
        }
    }
    
    return writeIndex;
}

// Solution 7: Reverse Iteration Approach
// Time: O(n), Space: O(1)
export function removeDuplicates7(nums: number[]): number {
    if (nums.length <= 2) return nums.length;
    
    let removeCount = 0;
    let consecutiveCount = 1;
    
    // Iterate from right to left to avoid shifting issues
    for (let i = nums.length - 2; i >= 0; i--) {
        if (nums[i] === nums[i + 1]) {
            consecutiveCount++;
            if (consecutiveCount > 2) {
                // Remove this element by shifting left
                for (let j = i; j < nums.length - 1 - removeCount; j++) {
                    nums[j] = nums[j + 1];
                }
                removeCount++;
            }
        } else {
            consecutiveCount = 1;
        }
    }
    
    return nums.length - removeCount;
}

// Test cases
export function testRemoveDuplicatesII() {
    console.log("Testing Remove Duplicates from Sorted Array II:");
    
    const testCases = [
        {
            nums: [1, 1, 1, 2, 2, 3],
            expected: 5,
            expectedArray: [1, 1, 2, 2, 3]
        },
        {
            nums: [0, 0, 1, 1, 1, 1, 2, 3, 3],
            expected: 7,
            expectedArray: [0, 0, 1, 1, 2, 3, 3]
        },
        {
            nums: [1, 2, 3],
            expected: 3,
            expectedArray: [1, 2, 3]
        },
        {
            nums: [1, 1],
            expected: 2,
            expectedArray: [1, 1]
        },
        {
            nums: [1, 1, 1],
            expected: 2,
            expectedArray: [1, 1]
        },
        {
            nums: [1, 1, 1, 1, 1, 1],
            expected: 2,
            expectedArray: [1, 1]
        },
        {
            nums: [1, 2, 2, 2, 3, 3, 3, 3, 4],
            expected: 6,
            expectedArray: [1, 2, 2, 3, 3, 4]
        }
    ];
    
    const solutions = [
        { name: "Two Pointers (Optimal)", fn: removeDuplicates1 },
        { name: "Count-based Approach", fn: removeDuplicates2 },
        { name: "Three Pointers", fn: removeDuplicates3 },
        { name: "Generalized k-Duplicates", fn: (nums: number[]) => removeDuplicates4(nums, 2) },
        { name: "State Machine", fn: removeDuplicates5 },
        { name: "Sliding Window", fn: removeDuplicates6 },
        { name: "Reverse Iteration", fn: removeDuplicates7 }
    ];
    
    function arraysEqual(a: number[], b: number[], length: number): boolean {
        for (let i = 0; i < length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const nums = [...test.nums];
            const result = solution.fn(nums);
            const arrayPassed = arraysEqual(nums, test.expectedArray, test.expected);
            const lengthPassed = result === test.expected;
            const passed = arrayPassed && lengthPassed;
            
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: ${JSON.stringify(test.nums)}`);
                console.log(`    Expected length: ${test.expected}`);
                console.log(`    Got length: ${result}`);
                console.log(`    Expected array: ${JSON.stringify(test.expectedArray)}`);
                console.log(`    Got array: ${JSON.stringify(nums.slice(0, result))}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Understanding**:
 *    - Allow at most 2 occurrences of each element
 *    - Modify array in-place with O(1) space
 *    - Return length of modified array
 *    - Order must be preserved
 * 
 * 2. **Two Pointers Strategy**:
 *    - Read pointer: iterates through array
 *    - Write pointer: position for next valid element
 *    - Key insight: element valid if different from writeIndex-2
 * 
 * 3. **Core Logic**:
 *    - First two elements always valid (at most 2 duplicates)
 *    - For position i ≥ 2: include if nums[i] ≠ nums[writeIndex-2]
 *    - This ensures at most 2 consecutive duplicates
 * 
 * 4. **Generalization**:
 *    - For at most k duplicates: check nums[i] ≠ nums[writeIndex-k]
 *    - Same pattern works for any k value
 *    - Elegant mathematical property
 * 
 * 5. **Time Complexity**: O(n)
 *    - Single pass through array
 *    - Constant work per element
 *    - Optimal for this problem
 * 
 * 6. **Space Complexity**: O(1)
 *    - Only uses constant extra variables
 *    - In-place modification requirement
 *    - No additional data structures
 * 
 * 7. **Edge Cases**:
 *    - Array length ≤ 2 (return as-is)
 *    - All elements same
 *    - No duplicates
 *    - Already valid array
 * 
 * 8. **Interview Strategy**:
 *    - Start with count-based approach
 *    - Optimize to two-pointers method
 *    - Explain the key insight about writeIndex-2
 *    - Discuss generalization to k duplicates
 * 
 * 9. **Key Insight Explanation**:
 *    - If nums[i] ≠ nums[writeIndex-2], then:
 *      - Either nums[i] is different element (always valid)
 *      - Or nums[i] is same but appears ≤ 2 times in valid portion
 *    - This maintains the "at most 2" invariant
 * 
 * 10. **Alternative Approaches**:
 *     - Count occurrences explicitly
 *     - State machine for tracking duplicates
 *     - Reverse iteration (more complex)
 * 
 * 11. **Optimization Techniques**:
 *     - Start writeIndex at 2 (first two always valid)
 *     - Avoid unnecessary comparisons
 *     - Early termination for short arrays
 * 
 * 12. **Common Mistakes**:
 *     - Not handling first two elements correctly
 *     - Wrong index calculations
 *     - Forgetting to increment writeIndex
 *     - Incorrect boundary conditions
 * 
 * 13. **Pattern Recognition**:
 *     - Two pointers for in-place modification
 *     - Sliding window for duplicate checking
 *     - Invariant maintenance in array processing
 * 
 * 14. **Big Tech Variations**:
 *     - Google: Remove duplicates with k occurrences
 *     - Meta: Remove duplicates in unsorted array
 *     - Amazon: Remove specific patterns
 *     - Microsoft: Keep exactly k duplicates
 * 
 * 15. **Follow-up Questions**:
 *     - Generalize to k duplicates allowed
 *     - Handle unsorted arrays
 *     - Remove all duplicates (keep none)
 *     - Count removed elements
 * 
 * 16. **Real-world Applications**:
 *     - Data deduplication systems
 *     - Log file processing
 *     - Database query optimization
 *     - Memory management
 *     - Stream processing
 * 
 * 17. **Implementation Tips**:
 *     - Handle edge cases first
 *     - Use meaningful variable names
 *     - Test with boundary conditions
 *     - Consider generalization
 * 
 * 18. **Mathematical Property**:
 *     - Invariant: nums[0..writeIndex-1] has at most 2 duplicates
 *     - nums[writeIndex-2] is key comparison point
 *     - Maintains sorted order naturally
 * 
 * 19. **Performance Considerations**:
 *     - Cache-friendly sequential access
 *     - Minimal conditional branches
 *     - No additional memory allocation
 *     - Optimal algorithmic complexity
 * 
 * 20. **Testing Strategy**:
 *     - Test with all same elements
 *     - Test with no duplicates
 *     - Test with mixed patterns
 *     - Test edge cases (small arrays)
 */