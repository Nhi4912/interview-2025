---
layout: page
title: "Minimum Window Substring"
difficulty: Easy
category: String
tags: [String, Two Pointers, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/minimum-window-substring/"
---

# Minimum Window Substring

**LeetCode Problem # * 76. Minimum Window Substring**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 76. Minimum Window Substring
 * 
 * Given two strings s and t of lengths m and n respectively, return the minimum window 
 * substring of s such that every character in t (including duplicates) is included in the window. 
 * If there is no such window, return the empty string "".
 * 
 * The testcases will be generated such that the answer is unique.
 * 
 * Example 1:
 * Input: s = "ADOBECODEBANC", t = "ABC"
 * Output: "BANC"
 * Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
 * 
 * Example 2:
 * Input: s = "a", t = "a"
 * Output: "a"
 * 
 * Example 3:
 * Input: s = "a", t = "aa"
 * Output: ""
 * Explanation: Both 'a's from t must be included in the window.
 * Since the largest window of s only has one 'a', return empty string.
 * 
 * Constraints:
 * - m == s.length
 * - n == t.length
 * - 1 <= m, n <= 10^5
 * - s and t consist of uppercase and lowercase English letters.
 * 
 * Follow up: Could you find an algorithm that runs in O(m + n) time?
 */

// Solution 1: Sliding Window with HashMap
// Time: O(m + n), Space: O(m + n)
export function minWindow1(s: string, t: string): string {
    if (s.length < t.length) return "";
    
    // Count characters in t
    const tCount = new Map<string, number>();
    for (const char of t) {
        tCount.set(char, (tCount.get(char) || 0) + 1);
    }
    
    const required = tCount.size;
    let formed = 0;
    
    // Sliding window
    const windowCounts = new Map<string, number>();
    let left = 0;
    let minLength = Infinity;
    let minStart = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        windowCounts.set(char, (windowCounts.get(char) || 0) + 1);
        
        // Check if current character's frequency matches required frequency
        if (tCount.has(char) && windowCounts.get(char) === tCount.get(char)) {
            formed++;
        }
        
        // Try to shrink window from left
        while (formed === required && left <= right) {
            const windowLength = right - left + 1;
            if (windowLength < minLength) {
                minLength = windowLength;
                minStart = left;
            }
            
            const leftChar = s[left];
            windowCounts.set(leftChar, windowCounts.get(leftChar)! - 1);
            
            if (tCount.has(leftChar) && windowCounts.get(leftChar)! < tCount.get(leftChar)!) {
                formed--;
            }
            
            left++;
        }
    }
    
    return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
}

// Solution 2: Optimized Sliding Window (Filter approach)
// Time: O(m + n), Space: O(m + n)
export function minWindow2(s: string, t: string): string {
    if (s.length < t.length) return "";
    
    // Count characters in t
    const tCount = new Map<string, number>();
    for (const char of t) {
        tCount.set(char, (tCount.get(char) || 0) + 1);
    }
    
    // Filter s to only include characters that are in t
    const filteredS: [string, number][] = [];
    for (let i = 0; i < s.length; i++) {
        if (tCount.has(s[i])) {
            filteredS.push([s[i], i]);
        }
    }
    
    const required = tCount.size;
    let formed = 0;
    const windowCounts = new Map<string, number>();
    
    let left = 0;
    let minLength = Infinity;
    let minStart = 0;
    
    for (let right = 0; right < filteredS.length; right++) {
        const [char, originalIndex] = filteredS[right];
        windowCounts.set(char, (windowCounts.get(char) || 0) + 1);
        
        if (windowCounts.get(char) === tCount.get(char)) {
            formed++;
        }
        
        while (formed === required && left <= right) {
            const windowLength = filteredS[right][1] - filteredS[left][1] + 1;
            if (windowLength < minLength) {
                minLength = windowLength;
                minStart = filteredS[left][1];
            }
            
            const leftChar = filteredS[left][0];
            windowCounts.set(leftChar, windowCounts.get(leftChar)! - 1);
            
            if (windowCounts.get(leftChar)! < tCount.get(leftChar)!) {
                formed--;
            }
            
            left++;
        }
    }
    
    return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
}

// Solution 3: Sliding Window with Array (ASCII optimization)
// Time: O(m + n), Space: O(1) - fixed size array
export function minWindow3(s: string, t: string): string {
    if (s.length < t.length) return "";
    
    // Use arrays for ASCII characters (assuming extended ASCII)
    const tCount = new Array(128).fill(0);
    const windowCount = new Array(128).fill(0);
    
    let required = 0;
    for (const char of t) {
        if (tCount[char.charCodeAt(0)] === 0) {
            required++;
        }
        tCount[char.charCodeAt(0)]++;
    }
    
    let formed = 0;
    let left = 0;
    let minLength = Infinity;
    let minStart = 0;
    
    for (let right = 0; right < s.length; right++) {
        const charCode = s.charCodeAt(right);
        windowCount[charCode]++;
        
        if (tCount[charCode] > 0 && windowCount[charCode] === tCount[charCode]) {
            formed++;
        }
        
        while (formed === required) {
            const windowLength = right - left + 1;
            if (windowLength < minLength) {
                minLength = windowLength;
                minStart = left;
            }
            
            const leftCharCode = s.charCodeAt(left);
            windowCount[leftCharCode]--;
            
            if (tCount[leftCharCode] > 0 && windowCount[leftCharCode] < tCount[leftCharCode]) {
                formed--;
            }
            
            left++;
        }
    }
    
    return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
}

// Solution 4: Two Pointers with Character Matching
// Time: O(m + n), Space: O(n)
export function minWindow4(s: string, t: string): string {
    if (s.length < t.length) return "";
    
    const need = new Map<string, number>();
    const window = new Map<string, number>();
    
    // Initialize need map
    for (const char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    let left = 0;
    let right = 0;
    let valid = 0;
    let start = 0;
    let len = Infinity;
    
    while (right < s.length) {
        const char = s[right];
        right++;
        
        // Update window
        if (need.has(char)) {
            window.set(char, (window.get(char) || 0) + 1);
            if (window.get(char) === need.get(char)) {
                valid++;
            }
        }
        
        // Try to shrink window
        while (valid === need.size) {
            // Update result
            if (right - left < len) {
                start = left;
                len = right - left;
            }
            
            const leftChar = s[left];
            left++;
            
            // Update window
            if (need.has(leftChar)) {
                if (window.get(leftChar) === need.get(leftChar)) {
                    valid--;
                }
                window.set(leftChar, window.get(leftChar)! - 1);
            }
        }
    }
    
    return len === Infinity ? "" : s.substring(start, start + len);
}

// Test cases
export function testMinWindow() {
    console.log("Testing Minimum Window Substring:");
    
    const testCases = [
        {
            s: "ADOBECODEBANC",
            t: "ABC",
            expected: "BANC"
        },
        {
            s: "a",
            t: "a",
            expected: "a"
        },
        {
            s: "a",
            t: "aa",
            expected: ""
        },
        {
            s: "ab",
            t: "b",
            expected: "b"
        },
        {
            s: "bba",
            t: "ab",
            expected: "ba"
        },
        {
            s: "abc",
            t: "cba",
            expected: "abc"
        }
    ];
    
    const solutions = [
        { name: "Sliding Window HashMap", fn: minWindow1 },
        { name: "Optimized Filter", fn: minWindow2 },
        { name: "Array Optimization", fn: minWindow3 },
        { name: "Two Pointers", fn: minWindow4 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.s, test.t);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: s="${test.s}", t="${test.t}"`);
                console.log(`    Expected: "${test.expected}"`);
                console.log(`    Got: "${result}"`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Sliding Window Pattern**:
 *    - Expand window by moving right pointer
 *    - Contract window by moving left pointer when valid
 *    - Keep track of valid characters count
 * 
 * 2. **Window Validity**:
 *    - Window is valid when it contains all characters from t
 *    - Use counter to track required vs available characters
 *    - formed === required means window is valid
 * 
 * 3. **Optimization Techniques**:
 *    - Filter approach: only process relevant characters
 *    - Array vs HashMap: ASCII optimization for character counting
 *    - Early termination when impossible
 * 
 * 4. **Time Complexity**: O(m + n) where m = s.length, n = t.length
 *    - Each character in s is visited at most twice
 *    - Each character in t is processed once for counting
 * 
 * 5. **Space Complexity**: O(n) for character counting
 *    - HashMap: O(unique characters in t)
 *    - Array: O(1) for ASCII (128 characters)
 * 
 * 6. **Interview Strategy**:
 *    - Start with brute force (check all substrings)
 *    - Identify sliding window pattern
 *    - Implement basic sliding window
 *    - Optimize with filtering or array indexing
 * 
 * 7. **Edge Cases**:
 *    - s shorter than t
 *    - t has duplicate characters
 *    - No valid window exists
 *    - Single character strings
 * 
 * 8. **Common Mistakes**:
 *    - Not handling duplicate characters in t
 *    - Incorrect window validity check
 *    - Off-by-one errors in substring extraction
 *    - Not updating counters correctly when shrinking
 * 
 * 9. **Follow-up Variations**:
 *    - Find all minimum windows
 *    - Return indices instead of substring
 *    - Handle Unicode characters
 *    - Minimize/maximize other criteria
 */
{% endraw %}
