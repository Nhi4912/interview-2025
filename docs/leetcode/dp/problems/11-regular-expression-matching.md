---
layout: page
title: "Regular Expression Matching"
difficulty: Easy
category: Dynamic Programming
tags: [Dynamic Programming, Hash Table, Greedy]
leetcode_url: "https://leetcode.com/problems/regular-expression-matching/"
---

# Regular Expression Matching

**LeetCode Problem # * 10. Regular Expression Matching**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 10. Regular Expression Matching
 * 
 * Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:
 * - '.' Matches any single character.
 * - '*' Matches zero or more of the preceding element.
 * 
 * The matching should cover the entire input string (not partial).
 * 
 * Example 1:
 * Input: s = "aa", p = "a"
 * Output: false
 * Explanation: "a" does not match the entire string "aa".
 * 
 * Example 2:
 * Input: s = "aa", p = "a*"
 * Output: true
 * Explanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".
 * 
 * Example 3:
 * Input: s = "ab", p = ".*"
 * Output: true
 * Explanation: ".*" means "zero or more (*) of any character (.)".
 * 
 * Constraints:
 * - 1 <= s.length <= 20
 * - 1 <= p.length <= 20
 * - s contains only lowercase English letters.
 * - p contains only lowercase English letters, '.', and '*'.
 * - It is guaranteed that for each appearance of the character '*', there will be a previous valid character to match.
 */

// Solution 1: Recursive with Memoization
// Time: O(m×n), Space: O(m×n)
export function isMatch1(s: string, p: string): boolean {
    const memo = new Map<string, boolean>();
    
    function dp(i: number, j: number): boolean {
        // Base case: pattern exhausted
        if (j >= p.length) {
            return i >= s.length;
        }
        
        const key = `${i},${j}`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        // Check if current characters match
        const firstMatch = i < s.length && (p[j] === s[i] || p[j] === '.');
        
        let result;
        if (j + 1 < p.length && p[j + 1] === '*') {
            // Pattern has '*' as next character
            // Two choices: skip pattern (0 matches) or use pattern (1+ matches)
            result = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
        } else {
            // No '*', must match current character and continue
            result = firstMatch && dp(i + 1, j + 1);
        }
        
        memo.set(key, result);
        return result;
    }
    
    return dp(0, 0);
}

// Solution 2: Bottom-Up Dynamic Programming
// Time: O(m×n), Space: O(m×n)
export function isMatch2(s: string, p: string): boolean {
    const m = s.length;
    const n = p.length;
    
    // dp[i][j] = does s[0...i-1] match p[0...j-1]
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(false));
    
    // Base case: empty string matches empty pattern
    dp[m][n] = true;
    
    // Fill from bottom-right to top-left
    for (let i = m; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            const firstMatch = i < m && (p[j] === s[i] || p[j] === '.');
            
            if (j + 1 < n && p[j + 1] === '*') {
                // Pattern has '*' as next character
                dp[i][j] = dp[i][j + 2] || (firstMatch && dp[i + 1][j]);
            } else {
                // No '*', must match current character
                dp[i][j] = firstMatch && dp[i + 1][j + 1];
            }
        }
    }
    
    return dp[0][0];
}

// Solution 3: Space-Optimized DP
// Time: O(m×n), Space: O(n)
export function isMatch3(s: string, p: string): boolean {
    const m = s.length;
    const n = p.length;
    
    let prev = new Array(n + 1).fill(false);
    let curr = new Array(n + 1).fill(false);
    
    // Base case
    prev[n] = true;
    
    for (let i = m; i >= 0; i--) {
        curr[n] = (i === m);
        
        for (let j = n - 1; j >= 0; j--) {
            const firstMatch = i < m && (p[j] === s[i] || p[j] === '.');
            
            if (j + 1 < n && p[j + 1] === '*') {
                curr[j] = curr[j + 2] || (firstMatch && prev[j]);
            } else {
                curr[j] = firstMatch && prev[j + 1];
            }
        }
        
        [prev, curr] = [curr, prev];
    }
    
    return prev[0];
}

// Solution 4: Iterative with Stack (Simulate Recursion)
// Time: O(m×n), Space: O(m×n)
export function isMatch4(s: string, p: string): boolean {
    const memo = new Map<string, boolean>();
    const stack: [number, number][] = [[0, 0]];
    
    while (stack.length > 0) {
        const [i, j] = stack.pop()!;
        const key = `${i},${j}`;
        
        if (memo.has(key)) continue;
        
        if (j >= p.length) {
            memo.set(key, i >= s.length);
            continue;
        }
        
        const firstMatch = i < s.length && (p[j] === s[i] || p[j] === '.');
        
        if (j + 1 < p.length && p[j + 1] === '*') {
            // Need to check both options
            const skipKey = `${i},${j + 2}`;
            const useKey = `${i + 1},${j}`;
            
            if (!memo.has(skipKey)) {
                stack.push([i, j]);
                stack.push([i, j + 2]);
                continue;
            }
            
            if (firstMatch && !memo.has(useKey)) {
                stack.push([i, j]);
                stack.push([i + 1, j]);
                continue;
            }
            
            const skipMatch = memo.get(skipKey)!;
            const useMatch = firstMatch && memo.get(useKey)!;
            memo.set(key, skipMatch || useMatch);
        } else {
            const nextKey = `${i + 1},${j + 1}`;
            if (firstMatch && !memo.has(nextKey)) {
                stack.push([i, j]);
                stack.push([i + 1, j + 1]);
                continue;
            }
            
            memo.set(key, firstMatch && memo.has(nextKey) && memo.get(nextKey)!);
        }
    }
    
    return memo.get('0,0') || false;
}

// Solution 5: Finite State Automaton
// Time: O(m×n), Space: O(n²)
export function isMatch5(s: string, p: string): boolean {
    // Build NFA (Non-deterministic Finite Automaton)
    class NFAState {
        isEnd: boolean = false;
        transitions: Map<string, NFAState[]> = new Map();
        epsilonTransitions: NFAState[] = [];
    }
    
    function buildNFA(pattern: string): { start: NFAState; end: NFAState } {
        const start = new NFAState();
        let current = start;
        
        for (let i = 0; i < pattern.length; i++) {
            const char = pattern[i];
            
            if (i + 1 < pattern.length && pattern[i + 1] === '*') {
                // Create star transition
                const starState = new NFAState();
                
                // Zero matches: epsilon transition
                current.epsilonTransitions.push(starState);
                
                // One or more matches: transition back to current
                if (!starState.transitions.has(char)) {
                    starState.transitions.set(char, []);
                }
                starState.transitions.get(char)!.push(starState);
                
                current = starState;
                i++; // Skip the '*'
            } else {
                // Regular character transition
                const nextState = new NFAState();
                
                if (!current.transitions.has(char)) {
                    current.transitions.set(char, []);
                }
                current.transitions.get(char)!.push(nextState);
                
                current = nextState;
            }
        }
        
        current.isEnd = true;
        return { start, end: current };
    }
    
    function getEpsilonClosure(states: Set<NFAState>): Set<NFAState> {
        const closure = new Set(states);
        const stack = Array.from(states);
        
        while (stack.length > 0) {
            const state = stack.pop()!;
            
            for (const epsilonState of state.epsilonTransitions) {
                if (!closure.has(epsilonState)) {
                    closure.add(epsilonState);
                    stack.push(epsilonState);
                }
            }
        }
        
        return closure;
    }
    
    const { start, end } = buildNFA(p);
    let currentStates = getEpsilonClosure(new Set([start]));
    
    for (const char of s) {
        const nextStates = new Set<NFAState>();
        
        for (const state of currentStates) {
            // Check direct character transitions
            if (state.transitions.has(char)) {
                for (const nextState of state.transitions.get(char)!) {
                    nextStates.add(nextState);
                }
            }
            
            // Check wildcard transitions
            if (state.transitions.has('.')) {
                for (const nextState of state.transitions.get('.')!) {
                    nextStates.add(nextState);
                }
            }
        }
        
        currentStates = getEpsilonClosure(nextStates);
    }
    
    return currentStates.has(end);
}

// Solution 6: Backtracking with Pruning
// Time: O(2^(m+n)) worst case, Space: O(m+n)
export function isMatch6(s: string, p: string): boolean {
    function backtrack(sIdx: number, pIdx: number): boolean {
        // Pattern exhausted
        if (pIdx >= p.length) {
            return sIdx >= s.length;
        }
        
        // String exhausted but pattern has non-star characters
        if (sIdx >= s.length) {
            // Pattern must only have "x*" patterns remaining
            for (let i = pIdx; i < p.length; i += 2) {
                if (i + 1 >= p.length || p[i + 1] !== '*') {
                    return false;
                }
            }
            return true;
        }
        
        const currentPatternChar = p[pIdx];
        const hasStarNext = pIdx + 1 < p.length && p[pIdx + 1] === '*';
        
        if (hasStarNext) {
            // Try zero matches
            if (backtrack(sIdx, pIdx + 2)) {
                return true;
            }
            
            // Try one or more matches
            let currentSIdx = sIdx;
            while (currentSIdx < s.length && 
                   (currentPatternChar === '.' || s[currentSIdx] === currentPatternChar)) {
                currentSIdx++;
                if (backtrack(currentSIdx, pIdx + 2)) {
                    return true;
                }
            }
            
            return false;
        } else {
            // Must match exactly one character
            if (currentPatternChar === '.' || s[sIdx] === currentPatternChar) {
                return backtrack(sIdx + 1, pIdx + 1);
            }
            return false;
        }
    }
    
    return backtrack(0, 0);
}

// Test cases
export function testIsMatch() {
    console.log("Testing Regular Expression Matching:");
    
    const testCases = [
        { s: "aa", p: "a", expected: false },
        { s: "aa", p: "a*", expected: true },
        { s: "ab", p: ".*", expected: true },
        { s: "aab", p: "c*a*b", expected: true },
        { s: "mississippi", p: "mis*is*p*.", expected: false },
        { s: "", p: ".*", expected: true },
        { s: "a", p: "ab*", expected: true },
        { s: "bbbba", p: ".*a*a", expected: true },
        { s: "a", p: ".*..a*", expected: false },
        { s: "ab", p: ".*c", expected: false }
    ];
    
    const solutions = [
        { name: "Memoization", fn: isMatch1 },
        { name: "Bottom-Up DP", fn: isMatch2 },
        { name: "Space Optimized", fn: isMatch3 },
        { name: "Iterative Stack", fn: isMatch4 },
        { name: "Finite Automaton", fn: isMatch5 },
        { name: "Backtracking", fn: isMatch6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            try {
                const result = solution.fn(test.s, test.p);
                const passed = result === test.expected;
                console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
                if (!passed) {
                    console.log(`    Input: s="${test.s}", p="${test.p}"`);
                    console.log(`    Expected: ${test.expected}`);
                    console.log(`    Got: ${result}`);
                }
            } catch (error) {
                console.log(`  Test ${i + 1}: ERROR - ${error}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Pattern Analysis**:
 *    - '.' matches any single character
 *    - '*' matches zero or more of preceding element
 *    - Pattern "a*" can match "", "a", "aa", "aaa", etc.
 * 
 * 2. **Core Decision Points**:
 *    - When seeing '*': try 0 matches or 1+ matches
 *    - For character match: advance both pointers
 *    - For '.' wildcard: advance both pointers
 * 
 * 3. **Recursive Structure**:
 *    - dp(i, j) = can s[i:] match p[j:]
 *    - Handle '*' separately from regular characters
 *    - Base case: pattern exhausted
 * 
 * 4. **Star Pattern Handling**:
 *    - Skip entirely: dp(i, j+2)
 *    - Use once and stay: firstMatch && dp(i+1, j)
 *    - Greedy matching can fail, need to try both
 * 
 * 5. **Time Complexity**: O(m×n)
 *    - With memoization: each subproblem solved once
 *    - Without memoization: exponential worst case
 *    - DP ensures polynomial time
 * 
 * 6. **Space Complexity**:
 *    - Memoization: O(m×n) for cache
 *    - Bottom-up DP: O(m×n) for table
 *    - Space optimized: O(n) with rolling arrays
 * 
 * 7. **Interview Strategy**:
 *    - Start with recursive approach
 *    - Handle '*' cases carefully
 *    - Add memoization for efficiency
 *    - Consider edge cases
 * 
 * 8. **Edge Cases**:
 *    - Empty string and/or pattern
 *    - Pattern with only '*' patterns
 *    - String longer than pattern
 *    - Consecutive '*' in pattern
 * 
 * 9. **Common Mistakes**:
 *    - Wrong '*' handling logic
 *    - Not considering zero matches for '*'
 *    - Incorrect base case handling
 *    - Off-by-one errors in indices
 * 
 * 10. **Optimization Techniques**:
 *     - Bottom-up DP avoids recursion overhead
 *     - Space optimization with rolling arrays
 *     - Early termination in some cases
 * 
 * 11. **Alternative Approaches**:
 *     - Finite State Automaton (theoretical)
 *     - Backtracking with pruning
 *     - Converting to standard regex engine
 * 
 * 12. **Big Tech Variations**:
 *     - Google: Extended regex features
 *     - Meta: Pattern matching with costs
 *     - Amazon: Multiple pattern matching
 *     - Microsoft: Case-insensitive matching
 * 
 * 13. **Follow-up Questions**:
 *     - Add '+' (one or more matches)
 *     - Add '?' (zero or one match)
 *     - Handle character classes [a-z]
 *     - Return all matching substrings
 * 
 * 14. **Real-world Applications**:
 *     - Text editors (find/replace)
 *     - Input validation systems
 *     - Log parsing and analysis
 *     - Bioinformatics pattern matching
 *     - Command-line tools (grep, sed)
 * 
 * 15. **Pattern Complexity**:
 *     - Simple patterns: O(1) per character
 *     - Complex patterns: may require backtracking
 *     - Pathological cases: exponential without DP
 * 
 * 16. **Implementation Tips**:
 *     - Handle '*' before regular characters
 *     - Use clear variable names for indices
 *     - Test with empty inputs thoroughly
 *     - Consider string lengths for optimization
 */
{% endraw %}
