---
layout: page
title: "Find All Anagrams in a String"
difficulty: Easy
category: String
tags: [String, Hash Table, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/"
---

# Find All Anagrams in a String

**LeetCode Problem # * 438. Find All Anagrams in a String**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 438. Find All Anagrams in a String
 * 
 * Given two strings s and p, return an array of all the start indices of p's anagrams in s.
 * You may return the answer in any order.
 * 
 * An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase,
 * typically using all the original letters exactly once.
 * 
 * Example 1:
 * Input: s = "abab", p = "ab"
 * Output: [0,2]
 * Explanation:
 * The substring with start index = 0 is "ab", which is an anagram of "ab".
 * The substring with start index = 2 is "ab", which is an anagram of "ab".
 * 
 * Example 2:
 * Input: s = "abab", p = "ab"
 * Output: [0,2]
 * 
 * Example 3:
 * Input: s = "baa", p = "aa"
 * Output: [1]
 * 
 * Constraints:
 * - 1 <= s.length, p.length <= 3 * 10^4
 * - s and p consist of lowercase English letters only.
 */

// Solution 1: Sliding Window with HashMap
// Time: O(s + p), Space: O(p)
export function findAnagrams1(s: string, p: string): number[] {
    if (s.length < p.length) return [];
    
    const result: number[] = [];
    const pCount = new Map<string, number>();
    const windowCount = new Map<string, number>();
    
    // Count characters in p
    for (const char of p) {
        pCount.set(char, (pCount.get(char) || 0) + 1);
    }
    
    const windowSize = p.length;
    
    // Initialize first window
    for (let i = 0; i < windowSize; i++) {
        const char = s[i];
        windowCount.set(char, (windowCount.get(char) || 0) + 1);
    }
    
    // Check if first window is anagram
    if (mapsEqual(pCount, windowCount)) {
        result.push(0);
    }
    
    // Slide the window
    for (let i = windowSize; i < s.length; i++) {
        // Add new character
        const newChar = s[i];
        windowCount.set(newChar, (windowCount.get(newChar) || 0) + 1);
        
        // Remove old character
        const oldChar = s[i - windowSize];
        windowCount.set(oldChar, windowCount.get(oldChar)! - 1);
        if (windowCount.get(oldChar) === 0) {
            windowCount.delete(oldChar);
        }
        
        // Check if current window is anagram
        if (mapsEqual(pCount, windowCount)) {
            result.push(i - windowSize + 1);
        }
    }
    
    return result;
    
    function mapsEqual(map1: Map<string, number>, map2: Map<string, number>): boolean {
        if (map1.size !== map2.size) return false;
        
        for (const [key, value] of map1) {
            if (map2.get(key) !== value) return false;
        }
        
        return true;
    }
}

// Solution 2: Sliding Window with Array (Optimized)
// Time: O(s + p), Space: O(1)
export function findAnagrams2(s: string, p: string): number[] {
    if (s.length < p.length) return [];
    
    const result: number[] = [];
    const pCount = new Array(26).fill(0);
    const windowCount = new Array(26).fill(0);
    
    // Count characters in p
    for (const char of p) {
        pCount[char.charCodeAt(0) - 97]++;
    }
    
    const windowSize = p.length;
    
    // Process first window
    for (let i = 0; i < windowSize; i++) {
        windowCount[s.charCodeAt(i) - 97]++;
    }
    
    // Check first window
    if (arraysEqual(pCount, windowCount)) {
        result.push(0);
    }
    
    // Slide the window
    for (let i = windowSize; i < s.length; i++) {
        // Add new character
        windowCount[s.charCodeAt(i) - 97]++;
        
        // Remove old character
        windowCount[s.charCodeAt(i - windowSize) - 97]--;
        
        // Check current window
        if (arraysEqual(pCount, windowCount)) {
            result.push(i - windowSize + 1);
        }
    }
    
    return result;
    
    function arraysEqual(arr1: number[], arr2: number[]): boolean {
        for (let i = 0; i < 26; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
}

// Solution 3: Sliding Window with Match Counter
// Time: O(s + p), Space: O(1)
export function findAnagrams3(s: string, p: string): number[] {
    if (s.length < p.length) return [];
    
    const result: number[] = [];
    const count = new Array(26).fill(0);
    
    // Count characters in p (positive) and first window of s (negative)
    for (let i = 0; i < p.length; i++) {
        count[p.charCodeAt(i) - 97]++;
        count[s.charCodeAt(i) - 97]--;
    }
    
    let matches = 0;
    for (let i = 0; i < 26; i++) {
        if (count[i] === 0) matches++;
    }
    
    // Check first window
    if (matches === 26) {
        result.push(0);
    }
    
    // Slide the window
    for (let i = p.length; i < s.length; i++) {
        // Add new character
        const newCharIdx = s.charCodeAt(i) - 97;
        if (count[newCharIdx] === 0) matches--;
        count[newCharIdx]--;
        if (count[newCharIdx] === 0) matches++;
        
        // Remove old character
        const oldCharIdx = s.charCodeAt(i - p.length) - 97;
        if (count[oldCharIdx] === 0) matches--;
        count[oldCharIdx]++;
        if (count[oldCharIdx] === 0) matches++;
        
        // Check if anagram
        if (matches === 26) {
            result.push(i - p.length + 1);
        }
    }
    
    return result;
}

// Solution 4: Rolling Hash with Collision Check
// Time: O(s + p), Space: O(1)
export function findAnagrams4(s: string, p: string): number[] {
    if (s.length < p.length) return [];
    
    const result: number[] = [];
    
    // Calculate hash for pattern
    let pHash = 0;
    for (const char of p) {
        pHash += char.charCodeAt(0);
    }
    
    // Calculate hash for first window
    let windowHash = 0;
    for (let i = 0; i < p.length; i++) {
        windowHash += s.charCodeAt(i);
    }
    
    // Check first window with collision verification
    if (windowHash === pHash && isAnagram(s.substring(0, p.length), p)) {
        result.push(0);
    }
    
    // Slide the window
    for (let i = p.length; i < s.length; i++) {
        // Update rolling hash
        windowHash += s.charCodeAt(i) - s.charCodeAt(i - p.length);
        
        // Check if hash matches and verify anagram
        if (windowHash === pHash) {
            const substring = s.substring(i - p.length + 1, i + 1);
            if (isAnagram(substring, p)) {
                result.push(i - p.length + 1);
            }
        }
    }
    
    return result;
    
    function isAnagram(str1: string, str2: string): boolean {
        if (str1.length !== str2.length) return false;
        
        const count = new Array(26).fill(0);
        for (let i = 0; i < str1.length; i++) {
            count[str1.charCodeAt(i) - 97]++;
            count[str2.charCodeAt(i) - 97]--;
        }
        
        return count.every(c => c === 0);
    }
}

// Solution 5: Bit Manipulation with XOR
// Time: O(s + p), Space: O(1)
export function findAnagrams5(s: string, p: string): number[] {
    if (s.length < p.length) return [];
    
    const result: number[] = [];
    
    // Create bit pattern for p
    let pPattern = 0;
    const pCount = new Array(26).fill(0);
    for (const char of p) {
        const idx = char.charCodeAt(0) - 97;
        pCount[idx]++;
        pPattern ^= (1 << idx);
    }
    
    // Create bit pattern for first window
    let windowPattern = 0;
    const windowCount = new Array(26).fill(0);
    for (let i = 0; i < p.length; i++) {
        const idx = s.charCodeAt(i) - 97;
        windowCount[idx]++;
        windowPattern ^= (1 << idx);
    }
    
    // Check first window (bit pattern match + count verification)
    if (windowPattern === pPattern && arraysEqual(pCount, windowCount)) {
        result.push(0);
    }
    
    // Slide the window
    for (let i = p.length; i < s.length; i++) {
        // Add new character
        const newIdx = s.charCodeAt(i) - 97;
        if (windowCount[newIdx] === 0) windowPattern ^= (1 << newIdx);
        windowCount[newIdx]++;
        if (windowCount[newIdx] % 2 === 0) windowPattern ^= (1 << newIdx);
        
        // Remove old character
        const oldIdx = s.charCodeAt(i - p.length) - 97;
        if (windowCount[oldIdx] % 2 === 1) windowPattern ^= (1 << oldIdx);
        windowCount[oldIdx]--;
        if (windowCount[oldIdx] === 0) windowPattern ^= (1 << oldIdx);
        
        // Check if anagram (requires both bit pattern and count match)
        if (windowPattern === pPattern && arraysEqual(pCount, windowCount)) {
            result.push(i - p.length + 1);
        }
    }
    
    return result;
    
    function arraysEqual(arr1: number[], arr2: number[]): boolean {
        for (let i = 0; i < 26; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
}

// Solution 6: Prime Hash with Modular Arithmetic
// Time: O(s + p), Space: O(1)
export function findAnagrams6(s: string, p: string): number[] {
    if (s.length < p.length) return [];
    
    const result: number[] = [];
    
    // Prime numbers for each character (a-z)
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
    const MOD = 1e9 + 7;
    
    // Calculate hash for pattern
    let pHash = 1;
    for (const char of p) {
        pHash = (pHash * primes[char.charCodeAt(0) - 97]) % MOD;
    }
    
    // Calculate hash for first window
    let windowHash = 1;
    for (let i = 0; i < p.length; i++) {
        windowHash = (windowHash * primes[s.charCodeAt(i) - 97]) % MOD;
    }
    
    // Check first window
    if (windowHash === pHash) {
        result.push(0);
    }
    
    // Precompute modular multiplicative inverse
    function modInverse(a: number, m: number): number {
        return modPow(a, m - 2, m);
    }
    
    function modPow(base: number, exp: number, mod: number): number {
        let result = 1;
        while (exp > 0) {
            if (exp % 2 === 1) {
                result = (result * base) % mod;
            }
            base = (base * base) % mod;
            exp = Math.floor(exp / 2);
        }
        return result;
    }
    
    // Slide the window
    for (let i = p.length; i < s.length; i++) {
        // Add new character
        const newPrime = primes[s.charCodeAt(i) - 97];
        windowHash = (windowHash * newPrime) % MOD;
        
        // Remove old character
        const oldPrime = primes[s.charCodeAt(i - p.length) - 97];
        const oldInverse = modInverse(oldPrime, MOD);
        windowHash = (windowHash * oldInverse) % MOD;
        
        // Check if hash matches
        if (windowHash === pHash) {
            result.push(i - p.length + 1);
        }
    }
    
    return result;
}

// Test cases
export function testFindAnagrams() {
    console.log("Testing Find All Anagrams in a String:");
    
    const testCases = [
        {
            s: "abab",
            p: "ab",
            expected: [0, 2]
        },
        {
            s: "abab",
            p: "ab",
            expected: [0, 2]
        },
        {
            s: "baa",
            p: "aa",
            expected: [1]
        },
        {
            s: "cbaebabacd",
            p: "abc",
            expected: [1, 6]
        },
        {
            s: "aaaaaaaaaa",
            p: "aaaaaaaaaa",
            expected: [0]
        },
        {
            s: "aab",
            p: "ab",
            expected: [1]
        },
        {
            s: "a",
            p: "ab",
            expected: []
        }
    ];
    
    const solutions = [
        { name: "HashMap Sliding Window", fn: findAnagrams1 },
        { name: "Array Optimization", fn: findAnagrams2 },
        { name: "Match Counter", fn: findAnagrams3 },
        { name: "Rolling Hash", fn: findAnagrams4 },
        { name: "Bit Manipulation", fn: findAnagrams5 },
        { name: "Prime Hash", fn: findAnagrams6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.s, test.p);
            result.sort((a, b) => a - b); // Sort for comparison
            const passed = JSON.stringify(result) === JSON.stringify(test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: s="${test.s}", p="${test.p}"`);
                console.log(`    Expected: ${JSON.stringify(test.expected)}`);
                console.log(`    Got: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Anagram Detection**:
 *    - Same characters with same frequencies
 *    - Order doesn't matter, only character counts
 *    - Fixed window size equals pattern length
 * 
 * 2. **Sliding Window Strategy**:
 *    - Maintain window of size |p|
 *    - Add new character, remove old character
 *    - Compare character frequencies efficiently
 * 
 * 3. **Frequency Comparison Methods**:
 *    - Direct array/map comparison
 *    - Match counter (track when frequencies align)
 *    - Hash-based approaches with collision detection
 * 
 * 4. **Time Complexity**: O(s + p)
 *    - Linear scan of string s
 *    - Constant time window updates
 *    - Frequency comparison optimizations
 * 
 * 5. **Space Complexity**: O(1)
 *    - Fixed-size arrays for character counts
 *    - Independent of input string lengths
 *    - Only 26 lowercase English letters
 * 
 * 6. **Optimization Techniques**:
 *    - Array instead of HashMap for limited alphabet
 *    - Match counter to avoid full array comparison
 *    - Hash functions for quick similarity checks
 * 
 * 7. **Interview Strategy**:
 *    - Start with basic sliding window + HashMap
 *    - Optimize to array for character counting
 *    - Add match counter for efficiency
 *    - Discuss hash-based approaches as advanced
 * 
 * 8. **Edge Cases**:
 *    - Pattern longer than string
 *    - Single character pattern/string
 *    - Pattern with all same characters
 *    - No anagrams found
 * 
 * 9. **Common Mistakes**:
 *    - Forgetting to remove old character from window
 *    - Incorrect frequency comparison logic
 *    - Off-by-one errors in indexing
 *    - Not handling empty results
 * 
 * 10. **Hash Function Considerations**:
 *     - Rolling hash for quick updates
 *     - Prime multiplication for uniqueness
 *     - Collision detection still necessary
 *     - Modular arithmetic for overflow prevention
 * 
 * 11. **Big Tech Variations**:
 *     - Google: Unicode character support
 *     - Meta: Case-insensitive anagrams
 *     - Amazon: Multiple pattern matching
 *     - Microsoft: Streaming data processing
 * 
 * 12. **Follow-up Questions**:
 *     - Return actual anagram substrings
 *     - Handle case sensitivity
 *     - Support Unicode characters
 *     - Find longest anagram substring
 * 
 * 13. **Real-world Applications**:
 *     - Plagiarism detection systems
 *     - DNA sequence analysis
 *     - Text similarity algorithms
 *     - Search engine query processing
 *     - Spell checker implementations
 * 
 * 14. **Alternative Approaches**:
 *     - Sorting-based comparison (O(n log n))
 *     - Trie-based pattern matching
 *     - Suffix array algorithms
 * 
 * 15. **Performance Considerations**:
 *     - Cache-friendly array access patterns
 *     - Minimal allocations in tight loops
 *     - Branch prediction optimization
 *     - Early termination strategies
 */
{% endraw %}
