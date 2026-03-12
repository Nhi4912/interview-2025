/**
 * 69. Sqrt(x)
 * 
 * Given a non-negative integer x, return the square root of x rounded down to the nearest integer. 
 * The returned integer should be non-negative as well.
 * 
 * You must not use any built-in exponent function or operator.
 * For example, do not use pow(x, 0.5) in c++ or x ** 0.5 in python.
 * 
 * Example 1:
 * Input: x = 4
 * Output: 2
 * Explanation: The square root of 4 is 2, so we return 2.
 * 
 * Example 2:
 * Input: x = 8
 * Output: 2
 * Explanation: The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned.
 * 
 * Constraints:
 * - 0 <= x <= 2^31 - 1
 */

// Solution 1: Binary Search (Optimal)
// Time: O(log x), Space: O(1)
export function mySqrt1(x: number): number {
    if (x < 2) return x;
    
    let left = 1;
    let right = Math.floor(x / 2) + 1; // sqrt(x) <= x/2 for x >= 4
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const square = mid * mid;
        
        if (square === x) {
            return mid;
        } else if (square < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return right; // right is the largest integer whose square <= x
}

// Solution 2: Newton's Method (Babylonian Method)
// Time: O(log x), Space: O(1)
export function mySqrt2(x: number): number {
    if (x < 2) return x;
    
    let guess = x;
    
    while (guess * guess > x) {
        guess = Math.floor((guess + Math.floor(x / guess)) / 2);
    }
    
    return guess;
}

// Solution 3: Bit Manipulation
// Time: O(log x), Space: O(1)
export function mySqrt3(x: number): number {
    if (x < 2) return x;
    
    // Find the highest bit position where result can have 1
    let bit = 1;
    while (bit * bit <= x) {
        bit <<= 1;
    }
    bit >>= 1; // Step back to valid position
    
    let result = 0;
    
    // Try setting each bit from highest to lowest
    while (bit > 0) {
        const candidate = result | bit;
        if (candidate * candidate <= x) {
            result = candidate;
        }
        bit >>= 1;
    }
    
    return result;
}

// Solution 4: Linear Search (Brute Force)
// Time: O(sqrt(x)), Space: O(1)
export function mySqrt4(x: number): number {
    if (x < 2) return x;
    
    let i = 1;
    while (i * i <= x) {
        i++;
    }
    
    return i - 1;
}

// Solution 5: Exponential Search + Binary Search
// Time: O(log x), Space: O(1)
export function mySqrt5(x: number): number {
    if (x < 2) return x;
    
    // Exponential search to find the range
    let bound = 1;
    while (bound * bound <= x) {
        bound <<= 1;
    }
    
    // Binary search in the range [bound/2, bound]
    let left = bound >> 1;
    let right = bound;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const square = mid * mid;
        
        if (square === x) {
            return mid;
        } else if (square < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return right;
}

// Solution 6: Mathematical Optimization
// Time: O(log x), Space: O(1)
export function mySqrt6(x: number): number {
    if (x < 2) return x;
    
    // Use the fact that sqrt(x) is approximately x/2 for small x
    // and use this as a better starting point
    let guess = x > 10000 ? Math.floor(x / 100) : Math.floor(x / 2);
    
    while (true) {
        const square = guess * guess;
        const nextGuess = guess + 1;
        const nextSquare = nextGuess * nextGuess;
        
        if (square <= x && nextSquare > x) {
            return guess;
        } else if (square > x) {
            guess = Math.floor((guess + Math.floor(x / guess)) / 2);
        } else {
            guess++;
        }
    }
}

// Solution 7: Digit by Digit Calculation
// Time: O(log x), Space: O(1)
export function mySqrt7(x: number): number {
    if (x < 2) return x;
    
    let result = 0;
    let remainder = 0;
    
    // Process digits from left to right
    let shift = 0;
    let temp = x;
    while (temp > 0) {
        temp = Math.floor(temp / 100);
        shift++;
    }
    
    for (let i = shift - 1; i >= 0; i--) {
        remainder = remainder * 100 + Math.floor(x / Math.pow(100, i)) % 100;
        result *= 10;
        
        let digit = 0;
        while ((2 * result + digit + 1) * (digit + 1) <= remainder) {
            digit++;
        }
        
        remainder -= (2 * result + digit) * digit;
        result += digit;
    }
    
    return result;
}

// Test cases
export function testMySqrt() {
    console.log("Testing Sqrt(x):");
    
    const testCases = [
        { x: 0, expected: 0 },
        { x: 1, expected: 1 },
        { x: 4, expected: 2 },
        { x: 8, expected: 2 },
        { x: 9, expected: 3 },
        { x: 15, expected: 3 },
        { x: 16, expected: 4 },
        { x: 25, expected: 5 },
        { x: 100, expected: 10 },
        { x: 121, expected: 11 },
        { x: 144, expected: 12 },
        { x: 2147395600, expected: 46340 }, // Large test case
        { x: 2147483647, expected: 46340 }  // Maximum int32
    ];
    
    const solutions = [
        { name: "Binary Search", fn: mySqrt1 },
        { name: "Newton's Method", fn: mySqrt2 },
        { name: "Bit Manipulation", fn: mySqrt3 },
        { name: "Linear Search", fn: mySqrt4 },
        { name: "Exponential + Binary Search", fn: mySqrt5 },
        { name: "Mathematical Optimization", fn: mySqrt6 },
        { name: "Digit by Digit", fn: mySqrt7 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.x);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: x=${test.x}`);
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
 *    - Find floor(sqrt(x)) without using built-in functions
 *    - Return largest integer n such that n² ≤ x
 *    - Handle edge cases: 0, 1, perfect squares
 * 
 * 2. **Binary Search Approach**:
 *    - Search space: [1, x/2] for x ≥ 4
 *    - Optimization: sqrt(x) ≤ x/2 for x ≥ 4
 *    - Find largest mid where mid² ≤ x
 * 
 * 3. **Newton's Method (Babylonian)**:
 *    - Iterative formula: x_{n+1} = (x_n + a/x_n) / 2
 *    - Converges quadratically to sqrt(a)
 *    - Very efficient in practice
 * 
 * 4. **Bit Manipulation Strategy**:
 *    - Build result bit by bit from most significant
 *    - Check if setting each bit keeps square ≤ x
 *    - Leverages binary representation properties
 * 
 * 5. **Time Complexity Analysis**:
 *    - Binary Search: O(log x)
 *    - Newton's Method: O(log x)
 *    - Bit Manipulation: O(log x)
 *    - Linear Search: O(sqrt(x))
 * 
 * 6. **Space Complexity**: O(1)
 *    - All approaches use constant extra space
 *    - No recursion or additional data structures
 *    - Optimal space usage
 * 
 * 7. **Newton's Method Derivation**:
 *    - Want to solve f(y) = y² - x = 0
 *    - Newton's formula: y_{n+1} = y_n - f(y_n)/f'(y_n)
 *    - f'(y) = 2y, so y_{n+1} = y_n - (y_n² - x)/(2y_n)
 *    - Simplifies to y_{n+1} = (y_n + x/y_n) / 2
 * 
 * 8. **Binary Search Optimization**:
 *    - Use x/2 as upper bound instead of x
 *    - For x ≥ 4: if sqrt(x) > x/2, then x > (x/2)² = x²/4, so x > x²/4
 *    - This implies 4 > x, contradiction for x ≥ 4
 * 
 * 9. **Edge Cases**:
 *    - x = 0: return 0
 *    - x = 1: return 1
 *    - Perfect squares: exact result
 *    - Large numbers: avoid overflow
 * 
 * 10. **Interview Strategy**:
 *     - Start with binary search approach
 *     - Explain the search space optimization
 *     - Mention Newton's method as advanced technique
 *     - Handle edge cases properly
 * 
 * 11. **Precision Considerations**:
 *     - Integer arithmetic only (no floating point)
 *     - Avoid overflow when computing mid² 
 *     - Use mid = left + (right - left) / 2 for large values
 * 
 * 12. **Common Mistakes**:
 *     - Not handling overflow in mid * mid
 *     - Wrong search space boundaries
 *     - Incorrect termination condition
 *     - Not considering edge cases
 * 
 * 13. **Optimization Techniques**:
 *     - Better initial guess for Newton's method
 *     - Early termination for perfect squares
 *     - Exponential search for very large numbers
 *     - Bit manipulation for constant factor improvement
 * 
 * 14. **Big Tech Variations**:
 *     - Google: Nth root calculation
 *     - Meta: Square root with specific precision
 *     - Amazon: Floating point square root
 *     - Microsoft: Fast inverse square root
 * 
 * 15. **Follow-up Questions**:
 *     - Implement floating point square root
 *     - Calculate nth root of a number
 *     - Find square root with specific precision
 *     - Implement fast inverse square root
 * 
 * 16. **Real-world Applications**:
 *     - Computer graphics (distance calculations)
 *     - Scientific computing (numerical methods)
 *     - Game development (physics engines)
 *     - Signal processing (magnitude calculations)
 *     - Machine learning (norm calculations)
 * 
 * 17. **Mathematical Properties**:
 *     - sqrt(a * b) = sqrt(a) * sqrt(b)
 *     - sqrt(a²) = |a|
 *     - Monotonic function: a < b ⟹ sqrt(a) < sqrt(b)
 * 
 * 18. **Pattern Recognition**:
 *     - Binary search on answer space
 *     - Newton's method for root finding
 *     - Bit manipulation for number construction
 *     - Iterative approximation methods
 * 
 * 19. **Performance Comparison**:
 *     - Newton's method: fastest convergence
 *     - Binary search: predictable performance
 *     - Bit manipulation: good for small numbers
 *     - Linear search: simplest but slowest
 * 
 * 20. **Implementation Tips**:
 *     - Use integer arithmetic only
 *     - Check for overflow carefully
 *     - Handle boundary conditions properly
 *     - Test with edge cases and large values
 */