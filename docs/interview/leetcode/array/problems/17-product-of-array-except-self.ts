/**
 * 238. Product of Array Except Self
 * 
 * Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].
 * 
 * The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.
 * 
 * You must write an algorithm that runs in O(n) time and without using the division operation.
 * 
 * Example 1:
 * Input: nums = [1,2,3,4]
 * Output: [24,12,8,6]
 * 
 * Example 2:
 * Input: nums = [-1,1,0,-3,3]
 * Output: [0,0,9,0,0]
 * 
 * Constraints:
 * - 2 <= nums.length <= 10^5
 * - -30 <= nums[i] <= 30
 * - The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.
 * 
 * Follow up: Can you solve the problem in O(1) extra space complexity? 
 * (The output array does not count as extra space for space complexity analysis.)
 */

// Solution 1: Left and Right Product Arrays
// Time: O(n), Space: O(n)
export function productExceptSelf1(nums: number[]): number[] {
    const n = nums.length;
    const left = new Array(n).fill(1);
    const right = new Array(n).fill(1);
    const result = new Array(n);
    
    // Calculate left products
    for (let i = 1; i < n; i++) {
        left[i] = left[i - 1] * nums[i - 1];
    }
    
    // Calculate right products
    for (let i = n - 2; i >= 0; i--) {
        right[i] = right[i + 1] * nums[i + 1];
    }
    
    // Combine left and right products
    for (let i = 0; i < n; i++) {
        result[i] = left[i] * right[i];
    }
    
    return result;
}

// Solution 2: Single Pass with Two Pointers
// Time: O(n), Space: O(1) - excluding output array
export function productExceptSelf2(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n).fill(1);
    
    // First pass: calculate left products and store in result
    for (let i = 1; i < n; i++) {
        result[i] = result[i - 1] * nums[i - 1];
    }
    
    // Second pass: calculate right products on the fly
    let rightProduct = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    
    return result;
}

// Solution 3: Division Approach (handles edge cases)
// Time: O(n), Space: O(1)
// Note: This approach uses division, which the problem asks to avoid
export function productExceptSelf3(nums: number[]): number[] {
    const n = nums.length;
    let totalProduct = 1;
    let zeroCount = 0;
    let zeroIndex = -1;
    
    // Calculate total product and count zeros
    for (let i = 0; i < n; i++) {
        if (nums[i] === 0) {
            zeroCount++;
            zeroIndex = i;
        } else {
            totalProduct *= nums[i];
        }
    }
    
    const result = new Array(n).fill(0);
    
    if (zeroCount > 1) {
        // More than one zero, all results are 0
        return result;
    } else if (zeroCount === 1) {
        // Exactly one zero, only that position gets the product
        result[zeroIndex] = totalProduct;
    } else {
        // No zeros, divide total by each element
        for (let i = 0; i < n; i++) {
            result[i] = totalProduct / nums[i];
        }
    }
    
    return result;
}

// Solution 4: Prefix and Suffix in one pass
// Time: O(n), Space: O(1)
export function productExceptSelf4(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n);
    
    // Calculate prefix products
    result[0] = 1;
    for (let i = 1; i < n; i++) {
        result[i] = result[i - 1] * nums[i - 1];
    }
    
    // Calculate suffix products and combine
    let suffixProduct = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= suffixProduct;
        suffixProduct *= nums[i];
    }
    
    return result;
}

// Test cases
export function testProductExceptSelf() {
    console.log("Testing Product of Array Except Self:");
    
    const testCases = [
        {
            input: [1, 2, 3, 4],
            expected: [24, 12, 8, 6]
        },
        {
            input: [-1, 1, 0, -3, 3],
            expected: [0, 0, 9, 0, 0]
        },
        {
            input: [2, 3, 4, 5],
            expected: [60, 40, 30, 24]
        },
        {
            input: [1, 0, 0, 1],
            expected: [0, 0, 0, 0]
        }
    ];
    
    const solutions = [
        { name: "Left-Right Arrays", fn: productExceptSelf1 },
        { name: "Optimized Space", fn: productExceptSelf2 },
        { name: "Division Approach", fn: productExceptSelf3 },
        { name: "Prefix-Suffix", fn: productExceptSelf4 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.input);
            const passed = JSON.stringify(result) === JSON.stringify(test.expected);
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
 * 1. **Two-Pass Approach**: Calculate left and right products separately
 * 2. **Space Optimization**: Use output array to store intermediate results
 * 3. **Edge Cases**: Handle zeros carefully in division approach
 * 4. **Big-O Analysis**: 
 *    - Time: O(n) for all solutions
 *    - Space: O(1) for optimized versions (excluding output)
 * 
 * 5. **Interview Tips**:
 *    - Start with brute force O(n²) approach
 *    - Optimize to O(n) with extra space
 *    - Further optimize to O(1) space
 *    - Discuss division approach but explain why it's not preferred
 * 
 * 6. **Follow-up Questions**:
 *    - How to handle integer overflow?
 *    - Can we solve it in a single pass?
 *    - What if we're allowed to use division?
 */