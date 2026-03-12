---
layout: page
title: "Valid Palindrome II"
difficulty: Easy
category: String
tags: [String, Two Pointers, Hash Table, Greedy]
leetcode_url: "https://leetcode.com/problems/valid-palindrome-ii/"
---

# Valid Palindrome II

**LeetCode Problem # * 680. Valid Palindrome II**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 680. Valid Palindrome II
 * 
 * Given a string s, return true if the s can be palindrome after deleting at most one character from it.
 * 
 * Example 1:
 * Input: s = "aba"
 * Output: true
 * 
 * Example 2:
 * Input: s = "abca"
 * Output: true
 * Explanation: You could delete the character 'c'.
 * 
 * Example 3:
 * Input: s = "abc"
 * Output: false
 * 
 * Constraints:
 * - 1 <= s.length <= 10^5
 * - s consists of lowercase English letters.
 */

// Solution 1: Two Pointers with Helper Function
// Time: O(n), Space: O(1)
export function validPalindrome1(s: string): boolean {
    function isPalindrome(str: string, left: number, right: number): boolean {
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            // Try deleting left character or right character
            return isPalindrome(s, left + 1, right) || isPalindrome(s, left, right - 1);
        }
        left++;
        right--;
    }
    
    return true;
}

// Solution 2: Recursive Approach with Memoization
// Time: O(n), Space: O(n)
export function validPalindrome2(s: string): boolean {
    const memo = new Map<string, boolean>();
    
    function canBeValidPalindrome(left: number, right: number, deletions: number): boolean {
        if (deletions > 1) return false;
        if (left >= right) return true;
        
        const key = `${left},${right},${deletions}`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        let result = false;
        
        if (s[left] === s[right]) {
            result = canBeValidPalindrome(left + 1, right - 1, deletions);
        } else {
            // Try deleting left character
            result = canBeValidPalindrome(left + 1, right, deletions + 1) ||
                    // Try deleting right character
                    canBeValidPalindrome(left, right - 1, deletions + 1);
        }
        
        memo.set(key, result);
        return result;
    }
    
    return canBeValidPalindrome(0, s.length - 1, 0);
}

// Solution 3: Iterative with Early Termination
// Time: O(n), Space: O(1)
export function validPalindrome3(s: string): boolean {
    function checkPalindrome(left: number, right: number, allowDelete: boolean): boolean {
        while (left < right) {
            if (s[left] !== s[right]) {
                if (!allowDelete) return false;
                
                // Try both options and return true if either works
                return checkPalindrome(left + 1, right, false) || 
                       checkPalindrome(left, right - 1, false);
            }
            left++;
            right--;
        }
        return true;
    }
    
    return checkPalindrome(0, s.length - 1, true);
}

// Solution 4: Greedy Approach
// Time: O(n), Space: O(1)
export function validPalindrome4(s: string): boolean {
    let left = 0;
    let right = s.length - 1;
    
    // Find first mismatch
    while (left < right && s[left] === s[right]) {
        left++;
        right--;
    }
    
    // If no mismatch found, it's already a palindrome
    if (left >= right) return true;
    
    // Helper function to check if substring is palindrome
    function isPalindrome(l: number, r: number): boolean {
        while (l < r) {
            if (s[l] !== s[r]) return false;
            l++;
            r--;
        }
        return true;
    }
    
    // Try removing either the left or right character
    return isPalindrome(left + 1, right) || isPalindrome(left, right - 1);
}

// Solution 5: Dynamic Programming
// Time: O(n²), Space: O(n²)
export function validPalindrome5(s: string): boolean {
    const n = s.length;
    // dp[i][j][k] = can substring s[i..j] be palindrome with at most k deletions
    const dp = Array(n).fill(null).map(() => 
        Array(n).fill(null).map(() => Array(2).fill(false))
    );
    
    // Base cases: single characters are palindromes
    for (let i = 0; i < n; i++) {
        dp[i][i][0] = true;
        dp[i][i][1] = true;
    }
    
    // Fill for all lengths
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j]) {
                // Characters match
                if (len === 2) {
                    dp[i][j][0] = true;
                    dp[i][j][1] = true;
                } else {
                    dp[i][j][0] = dp[i + 1][j - 1][0];
                    dp[i][j][1] = dp[i + 1][j - 1][1];
                }
            } else {
                // Characters don't match
                dp[i][j][0] = false;
                if (len > 2) {
                    dp[i][j][1] = dp[i + 1][j][0] || dp[i][j - 1][0];
                } else {
                    dp[i][j][1] = true; // Can delete one character
                }
            }
        }
    }
    
    return dp[0][n - 1][1];
}

// Solution 6: Optimized Two-Pass
// Time: O(n), Space: O(1)
export function validPalindrome6(s: string): boolean {
    function findMismatch(left: number, right: number): [number, number] | null {
        while (left < right) {
            if (s[left] !== s[right]) {
                return [left, right];
            }
            left++;
            right--;
        }
        return null;
    }
    
    function isPalindromeRange(left: number, right: number): boolean {
        while (left < right) {
            if (s[left] !== s[right]) return false;
            left++;
            right--;
        }
        return true;
    }
    
    const mismatch = findMismatch(0, s.length - 1);
    
    if (!mismatch) return true; // Already a palindrome
    
    const [left, right] = mismatch;
    
    // Try deleting left character
    if (isPalindromeRange(left + 1, right)) return true;
    
    // Try deleting right character
    if (isPalindromeRange(left, right - 1)) return true;
    
    return false;
}

// Test cases
export function testValidPalindrome() {
    console.log("Testing Valid Palindrome II:");
    
    const testCases = [
        {
            input: "aba",
            expected: true
        },
        {
            input: "abca",
            expected: true
        },
        {
            input: "abc",
            expected: false
        },
        {
            input: "raceacar",
            expected: true
        },
        {
            input: "race",
            expected: false
        },
        {
            input: "abcddcba",
            expected: true
        },
        {
            input: "abcdef",
            expected: false
        },
        {
            input: "a",
            expected: true
        },
        {
            input: "ab",
            expected: true
        },
        {
            input: "deeee",
            expected: true
        }
    ];
    
    const solutions = [
        { name: "Two Pointers", fn: validPalindrome1 },
        { name: "Recursive + Memo", fn: validPalindrome2 },
        { name: "Iterative Early Term", fn: validPalindrome3 },
        { name: "Greedy", fn: validPalindrome4 },
        { name: "Dynamic Programming", fn: validPalindrome5 },
        { name: "Two-Pass Optimized", fn: validPalindrome6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.input);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: "${test.input}"`);
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
 *    - Can delete AT MOST one character
 *    - Must check if resulting string is palindrome
 *    - Original string might already be palindrome
 * 
 * 2. **Two Pointers Strategy**:
 *    - Start from both ends
 *    - When mismatch found, try deleting either character
 *    - Continue palindrome check from remaining substring
 * 
 * 3. **Key Optimization**:
 *    - Only need to check deletion when first mismatch occurs
 *    - Don't need to generate actual substrings
 *    - Can check validity with indices only
 * 
 * 4. **Time Complexity**: O(n)
 *    - Single pass to find mismatch: O(n)
 *    - At most two palindrome checks: O(n)
 *    - Total: O(n)
 * 
 * 5. **Space Complexity**: O(1)
 *    - Only using pointers and variables
 *    - No additional data structures needed
 * 
 * 6. **Edge Cases**:
 *    - Single character (always valid)
 *    - Two characters (always valid)
 *    - Already palindrome (no deletion needed)
 *    - No valid deletion possible
 * 
 * 7. **Interview Strategy**:
 *    - Start with basic palindrome check
 *    - Extend to handle one deletion
 *    - Optimize to avoid unnecessary work
 *    - Handle edge cases carefully
 * 
 * 8. **Common Mistakes**:
 *    - Checking all possible deletions (O(n²))
 *    - Not handling edge cases properly
 *    - Creating unnecessary substrings
 *    - Incorrect index management
 * 
 * 9. **Why Greedy Works**:
 *    - First mismatch determines deletion candidates
 *    - Only two choices: delete left or right character
 *    - If neither works, no solution exists
 * 
 * 10. **Alternative Approaches**:
 *     - DP: O(n²) time and space (overkill)
 *     - Recursion: Cleaner code but may have stack overhead
 *     - Brute force: Check all n possible deletions (inefficient)
 * 
 * 11. **Big Tech Variations**:
 *     - Google: Valid palindrome with k deletions
 *     - Meta: Minimum deletions to make palindrome
 *     - Amazon: Palindrome with character substitutions
 *     - Microsoft: Case-insensitive palindrome validation
 * 
 * 12. **Follow-up Questions**:
 *     - Extend to k deletions
 *     - Return the actual palindrome string
 *     - Handle Unicode/special characters
 *     - Find minimum deletions needed
 * 
 * 13. **Real-world Applications**:
 *     - Text processing and validation
 *     - DNA sequence analysis
 *     - Data deduplication
 *     - String similarity measures
 *     - Auto-correction systems
 * 
 * 14. **Pattern Recognition**:
 *     - Two pointers for palindrome problems
 *     - Greedy choice when limited operations allowed
 *     - Early termination for optimization
 *     - Index-based processing to avoid string creation
 */
{% endraw %}
