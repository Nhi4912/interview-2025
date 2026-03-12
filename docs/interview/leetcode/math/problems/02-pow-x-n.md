---
layout: page
title: "Pow(x, n)"
difficulty: Hard
category: Math
tags: [Math, Hash Table]
leetcode_url: "https://leetcode.com/problems/pow-x-n-/"
---

# Pow(x, n)

**LeetCode Problem # * 50. Pow(x, n)**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 50. Pow(x, n)
 * 
 * Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).
 * 
 * Example 1:
 * Input: x = 2.00000, n = 10
 * Output: 1024.00000
 * 
 * Example 2:
 * Input: x = 2.10000, n = 3
 * Output: 9.26100
 * 
 * Example 3:
 * Input: x = 2.00000, n = -2
 * Output: 0.25000
 * Explanation: 2^-2 = 1/2^2 = 1/4 = 0.25
 * 
 * Constraints:
 * - -100.0 < x < 100.0
 * - -2^31 <= n <= 2^31-1
 * - n is an integer.
 * - Either x is not zero or n > 0.
 * - -10^4 <= x^n <= 10^4
 */

// Solution 1: Fast Exponentiation (Iterative)
// Time: O(log n), Space: O(1)
export function myPow1(x: number, n: number): number {
    if (n === 0) return 1;
    
    let absN = Math.abs(n);
    let result = 1;
    let base = x;
    
    while (absN > 0) {
        // If current bit is 1, multiply result by current base
        if (absN & 1) {
            result *= base;
        }
        
        // Square the base for next bit
        base *= base;
        
        // Right shift to check next bit
        absN >>= 1;
    }
    
    return n < 0 ? 1 / result : result;
}

// Solution 2: Fast Exponentiation (Recursive)
// Time: O(log n), Space: O(log n)
export function myPow2(x: number, n: number): number {
    if (n === 0) return 1;
    if (n === 1) return x;
    if (n === -1) return 1 / x;
    
    if (n % 2 === 0) {
        const half = myPow2(x, n / 2);
        return half * half;
    } else {
        if (n > 0) {
            return x * myPow2(x, n - 1);
        } else {
            return (1 / x) * myPow2(x, n + 1);
        }
    }
}

// Solution 3: Binary Exponentiation with Bit Manipulation
// Time: O(log n), Space: O(1)
export function myPow3(x: number, n: number): number {
    if (n === 0) return 1;
    if (x === 0) return 0;
    if (x === 1) return 1;
    if (x === -1) return n % 2 === 0 ? 1 : -1;
    
    const isNegative = n < 0;
    let exp = Math.abs(n);
    let result = 1;
    let base = x;
    
    // Process each bit of the exponent
    while (exp > 0) {
        // Check if least significant bit is 1
        if (exp & 1) {
            result *= base;
        }
        
        // Square the base
        base *= base;
        
        // Right shift exponent
        exp >>>= 1;
    }
    
    return isNegative ? 1 / result : result;
}

// Solution 4: Optimized Recursive with Memoization
// Time: O(log n), Space: O(log n)
export function myPow4(x: number, n: number): number {
    const memo = new Map<string, number>();
    
    function powerHelper(x: number, n: number): number {
        if (n === 0) return 1;
        if (n === 1) return x;
        
        const key = `${x},${n}`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        let result: number;
        if (n % 2 === 0) {
            const half = powerHelper(x, n / 2);
            result = half * half;
        } else {
            result = x * powerHelper(x, n - 1);
        }
        
        memo.set(key, result);
        return result;
    }
    
    if (n >= 0) {
        return powerHelper(x, n);
    } else {
        return 1 / powerHelper(x, -n);
    }
}

// Solution 5: Iterative with Divide and Conquer
// Time: O(log n), Space: O(1)
export function myPow5(x: number, n: number): number {
    if (n === 0) return 1;
    
    let result = 1;
    let base = Math.abs(n) % 2 === 1 ? x : 1;
    let exp = Math.floor(Math.abs(n) / 2);
    x = x * x;
    
    while (exp > 0) {
        if (exp % 2 === 1) {
            base *= x;
        }
        x *= x;
        exp = Math.floor(exp / 2);
    }
    
    result = base;
    return n < 0 ? 1 / result : result;
}

// Solution 6: Mathematical Logarithm Approach
// Time: O(1), Space: O(1)
export function myPow6(x: number, n: number): number {
    if (n === 0) return 1;
    if (x === 0) return 0;
    if (x === 1) return 1;
    if (x === -1) return n % 2 === 0 ? 1 : -1;
    
    // Handle edge cases for precision
    if (Math.abs(x) < 1e-10) return 0;
    
    // Use logarithm: x^n = exp(n * ln(x))
    // But this only works for positive x
    if (x > 0) {
        return Math.exp(n * Math.log(x));
    } else {
        // For negative x, use x^n = (-1)^n * |x|^n
        const absResult = Math.exp(n * Math.log(Math.abs(x)));
        return n % 2 === 0 ? absResult : -absResult;
    }
}

// Solution 7: Tail Recursive Approach
// Time: O(log n), Space: O(log n)
export function myPow7(x: number, n: number): number {
    function tailPow(base: number, exp: number, acc: number): number {
        if (exp === 0) return acc;
        if (exp === 1) return acc * base;
        
        if (exp % 2 === 0) {
            return tailPow(base * base, exp / 2, acc);
        } else {
            return tailPow(base * base, Math.floor(exp / 2), acc * base);
        }
    }
    
    if (n === 0) return 1;
    if (n > 0) {
        return tailPow(x, n, 1);
    } else {
        return 1 / tailPow(x, -n, 1);
    }
}

// Test cases
export function testMyPow() {
    console.log("Testing Pow(x, n):");
    
    const testCases = [
        {
            x: 2.0,
            n: 10,
            expected: 1024.0
        },
        {
            x: 2.1,
            n: 3,
            expected: 9.261
        },
        {
            x: 2.0,
            n: -2,
            expected: 0.25
        },
        {
            x: 1.0,
            n: 2147483647,
            expected: 1.0
        },
        {
            x: -1.0,
            n: 2147483647,
            expected: -1.0
        },
        {
            x: 0.44528,
            n: 0,
            expected: 1.0
        },
        {
            x: 34.00515,
            n: -3,
            expected: 0.00003
        },
        {
            x: -2.0,
            n: 3,
            expected: -8.0
        },
        {
            x: -2.0,
            n: 4,
            expected: 16.0
        }
    ];
    
    const solutions = [
        { name: "Fast Exponentiation (Iterative)", fn: myPow1 },
        { name: "Fast Exponentiation (Recursive)", fn: myPow2 },
        { name: "Binary Exponentiation", fn: myPow3 },
        { name: "Recursive with Memoization", fn: myPow4 },
        { name: "Iterative Divide and Conquer", fn: myPow5 },
        { name: "Mathematical Logarithm", fn: myPow6 },
        { name: "Tail Recursive", fn: myPow7 }
    ];
    
    function isClose(a: number, b: number, tolerance = 1e-5): boolean {
        return Math.abs(a - b) < tolerance;
    }
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.x, test.n);
            const passed = isClose(result, test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: x=${test.x}, n=${test.n}`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Naive vs Optimal**:
 *    - Naive: O(n) multiplication loop
 *    - Optimal: O(log n) using fast exponentiation
 *    - Massive improvement for large exponents
 * 
 * 2. **Fast Exponentiation Principle**:
 *    - x^n = (x^(n/2))^2 if n is even
 *    - x^n = x * x^(n-1) if n is odd
 *    - Reduces problem size by half each step
 * 
 * 3. **Binary Representation**:
 *    - View exponent in binary: n = b_k*2^k + ... + b_1*2^1 + b_0*2^0
 *    - x^n = x^(b_k*2^k) * ... * x^(b_1*2^1) * x^(b_0*2^0)
 *    - Process each bit to build result
 * 
 * 4. **Negative Exponent Handling**:
 *    - x^(-n) = 1 / x^n
 *    - Compute positive exponent then invert
 *    - Avoid precision issues with direct computation
 * 
 * 5. **Time Complexity**: O(log n)
 *    - Each iteration reduces exponent by half
 *    - Number of iterations = log₂(n)
 *    - Optimal for exponentiation
 * 
 * 6. **Space Complexity**:
 *    - Iterative: O(1) constant space
 *    - Recursive: O(log n) call stack
 *    - Memoization: O(log n) cache space
 * 
 * 7. **Edge Cases**:
 *    - x = 0, n = 0 (undefined mathematically, return 1)
 *    - x = 1, any n (always 1)
 *    - x = -1, even/odd n (1 or -1)
 *    - Large negative exponents
 * 
 * 8. **Interview Strategy**:
 *    - Start with naive O(n) approach
 *    - Explain fast exponentiation concept
 *    - Implement iterative binary method
 *    - Handle negative exponents properly
 * 
 * 9. **Bit Manipulation Insights**:
 *    - Check least significant bit: n & 1
 *    - Right shift: n >>= 1 or n >>>= 1
 *    - Process exponent bit by bit
 * 
 * 10. **Precision Considerations**:
 *     - Floating point arithmetic limitations
 *     - Large exponents may cause overflow
 *     - Small results may underflow to zero
 * 
 * 11. **Mathematical Properties**:
 *     - Associativity: (x^a)^b = x^(a*b)
 *     - Multiplication: x^a * x^b = x^(a+b)
 *     - Division: x^a / x^b = x^(a-b)
 * 
 * 12. **Common Mistakes**:
 *     - Not handling negative exponents
 *     - Integer overflow with large exponents
 *     - Incorrect base case handling
 *     - Precision errors with floating point
 * 
 * 13. **Optimization Techniques**:
 *     - Early termination for special values
 *     - Bit manipulation for efficiency
 *     - Avoiding unnecessary recursive calls
 *     - Memoization for repeated subproblems
 * 
 * 14. **Big Tech Variations**:
 *     - Google: Matrix exponentiation
 *     - Meta: Modular exponentiation
 *     - Amazon: Fast Fibonacci using matrix power
 *     - Microsoft: Large number exponentiation
 * 
 * 15. **Follow-up Questions**:
 *     - Implement modular exponentiation
 *     - Matrix exponentiation for Fibonacci
 *     - Handle arbitrary precision numbers
 *     - Optimize for specific exponent patterns
 * 
 * 16. **Real-world Applications**:
 *     - Cryptography (RSA, modular exponentiation)
 *     - Computer graphics (transformations)
 *     - Signal processing (Fourier transforms)
 *     - Financial calculations (compound interest)
 *     - Scientific computing (numerical methods)
 * 
 * 17. **Pattern Recognition**:
 *     - Divide and conquer strategy
 *     - Binary representation utilization
 *     - Recursive problem decomposition
 *     - Optimization through mathematical properties
 * 
 * 18. **Alternative Approaches**:
 *     - Logarithm method: exp(n * log(x))
 *     - Addition chains for specific exponents
 *     - Sliding window methods
 *     - Precomputed power tables
 * 
 * 19. **Implementation Tips**:
 *     - Handle integer overflow carefully
 *     - Use unsigned right shift (>>>) for safety
 *     - Consider floating point precision
 *     - Test edge cases thoroughly
 * 
 * 20. **Complexity Analysis**:
 *     - Best case: O(1) for special values
 *     - Average case: O(log n) for general case
 *     - Worst case: O(log n) always
 *     - Space varies by implementation approach
 */
{% endraw %}
