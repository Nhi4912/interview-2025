/**
 * 1143. Longest Common Subsequence
 * 
 * Given two strings text1 and text2, return the length of their longest common subsequence. 
 * If there is no common subsequence, return 0.
 * 
 * A subsequence of a string is a new string generated from the original string with some characters 
 * (can be none) deleted without changing the relative order of the remaining characters.
 * 
 * For example, "ace" is a subsequence of "abcde".
 * A common subsequence of two strings is a subsequence that is common to both strings.
 * 
 * Example 1:
 * Input: text1 = "abcde", text2 = "ace" 
 * Output: 3  
 * Explanation: The longest common subsequence is "ace" and its length is 3.
 * 
 * Example 2:
 * Input: text1 = "abc", text2 = "abc"
 * Output: 3
 * Explanation: The longest common subsequence is "abc" and its length is 3.
 * 
 * Example 3:
 * Input: text1 = "abc", text2 = "def"
 * Output: 0
 * Explanation: There is no such common subsequence, so the result is 0.
 * 
 * Constraints:
 * - 1 <= text1.length, text2.length <= 1000
 * - text1 and text2 consist of only lowercase English characters.
 */

// Solution 1: Dynamic Programming (2D Array)
// Time: O(m×n), Space: O(m×n)
export function longestCommonSubsequence1(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    
    // dp[i][j] = LCS length of text1[0...i-1] and text2[0...j-1]
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                // Characters match, extend LCS
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // Characters don't match, take maximum
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

// Solution 2: Space-Optimized DP (1D Array)
// Time: O(m×n), Space: O(min(m,n))
export function longestCommonSubsequence2(text1: string, text2: string): number {
    // Ensure text1 is the shorter string for space optimization
    if (text1.length > text2.length) {
        [text1, text2] = [text2, text1];
    }
    
    const m = text1.length;
    const n = text2.length;
    
    let prev = new Array(m + 1).fill(0);
    let curr = new Array(m + 1).fill(0);
    
    for (let j = 1; j <= n; j++) {
        for (let i = 1; i <= m; i++) {
            if (text1[i - 1] === text2[j - 1]) {
                curr[i] = prev[i - 1] + 1;
            } else {
                curr[i] = Math.max(prev[i], curr[i - 1]);
            }
        }
        [prev, curr] = [curr, prev];
    }
    
    return prev[m];
}

// Solution 3: Memoization (Top-Down)
// Time: O(m×n), Space: O(m×n)
export function longestCommonSubsequence3(text1: string, text2: string): number {
    const memo = new Map<string, number>();
    
    function dfs(i: number, j: number): number {
        if (i >= text1.length || j >= text2.length) {
            return 0;
        }
        
        const key = `${i},${j}`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        let result;
        if (text1[i] === text2[j]) {
            result = 1 + dfs(i + 1, j + 1);
        } else {
            result = Math.max(dfs(i + 1, j), dfs(i, j + 1));
        }
        
        memo.set(key, result);
        return result;
    }
    
    return dfs(0, 0);
}

// Solution 4: Recursive (Brute Force)
// Time: O(2^(m+n)), Space: O(m+n)
export function longestCommonSubsequence4(text1: string, text2: string): number {
    function helper(i: number, j: number): number {
        if (i >= text1.length || j >= text2.length) {
            return 0;
        }
        
        if (text1[i] === text2[j]) {
            return 1 + helper(i + 1, j + 1);
        } else {
            return Math.max(helper(i + 1, j), helper(i, j + 1));
        }
    }
    
    return helper(0, 0);
}

// Solution 5: DP with Path Reconstruction
// Time: O(m×n), Space: O(m×n)
export function longestCommonSubsequence5(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Reconstruct LCS (optional for length-only problem)
    function reconstructLCS(): string {
        let lcs = "";
        let i = m, j = n;
        
        while (i > 0 && j > 0) {
            if (text1[i - 1] === text2[j - 1]) {
                lcs = text1[i - 1] + lcs;
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    }
    
    // For debugging - uncomment to see actual LCS
    // console.log("LCS:", reconstructLCS());
    
    return dp[m][n];
}

// Solution 6: Iterative with Two Variables
// Time: O(m×n), Space: O(n)
export function longestCommonSubsequence6(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    
    let dp = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= m; i++) {
        let prev = 0;
        for (let j = 1; j <= n; j++) {
            let temp = dp[j];
            if (text1[i - 1] === text2[j - 1]) {
                dp[j] = prev + 1;
            } else {
                dp[j] = Math.max(dp[j], dp[j - 1]);
            }
            prev = temp;
        }
    }
    
    return dp[n];
}

// Test cases
export function testLongestCommonSubsequence() {
    console.log("Testing Longest Common Subsequence:");
    
    const testCases = [
        {
            text1: "abcde",
            text2: "ace",
            expected: 3
        },
        {
            text1: "abc",
            text2: "abc",
            expected: 3
        },
        {
            text1: "abc",
            text2: "def",
            expected: 0
        },
        {
            text1: "bl",
            text2: "yby",
            expected: 1
        },
        {
            text1: "bsbininm",
            text2: "jmjkbkjkv",
            expected: 1
        },
        {
            text1: "ezupkr",
            text2: "ubmrapg",
            expected: 2
        }
    ];
    
    const solutions = [
        { name: "2D DP", fn: longestCommonSubsequence1 },
        { name: "Space Optimized", fn: longestCommonSubsequence2 },
        { name: "Memoization", fn: longestCommonSubsequence3 },
        { name: "Recursive", fn: longestCommonSubsequence4 },
        { name: "DP with Reconstruction", fn: longestCommonSubsequence5 },
        { name: "Iterative Optimized", fn: longestCommonSubsequence6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.text1, test.text2);
            const passed = result === test.expected;
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
 * 1. **DP State Definition**:
 *    - dp[i][j] = LCS length of text1[0...i-1] and text2[0...j-1]
 *    - Base case: dp[0][j] = dp[i][0] = 0 (empty string)
 * 
 * 2. **Recurrence Relation**:
 *    - If text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
 *    - Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 * 
 * 3. **Space Optimization**:
 *    - 2D → 1D: Only need previous row
 *    - Further optimize to O(min(m,n)) by choosing shorter string
 * 
 * 4. **Time Complexity**: O(m×n)
 *    - Must check all character pairs
 *    - Cannot optimize further for worst case
 * 
 * 5. **Space Complexity**:
 *    - Basic DP: O(m×n)
 *    - Optimized: O(min(m,n))
 *    - Memoization: O(m×n) for recursion stack + cache
 * 
 * 6. **Algorithm Intuition**:
 *    - Build solution incrementally
 *    - Character match: extend current LCS
 *    - No match: take best from excluding either character
 * 
 * 7. **Interview Strategy**:
 *    - Start with recursive solution
 *    - Identify overlapping subproblems
 *    - Apply memoization
 *    - Convert to bottom-up DP
 *    - Optimize space if needed
 * 
 * 8. **Path Reconstruction**:
 *    - Trace back through DP table
 *    - Follow decisions that led to optimal solution
 *    - Build LCS string character by character
 * 
 * 9. **Edge Cases**:
 *    - Empty strings
 *    - No common characters
 *    - Identical strings
 *    - Single character strings
 * 
 * 10. **Related Problems**:
 *     - Edit Distance (Levenshtein)
 *     - Longest Common Substring
 *     - Longest Palindromic Subsequence
 *     - Shortest Common Supersequence
 * 
 * 11. **Big Tech Variations**:
 *     - Google: Multiple strings LCS
 *     - Meta: LCS with wildcards
 *     - Amazon: LCS with costs
 *     - Microsoft: LCS counting all possible
 * 
 * 12. **Follow-up Questions**:
 *     - Return actual LCS string
 *     - Count number of LCS
 *     - Find all possible LCS
 *     - Handle case-insensitive comparison
 *     - Optimize for very long strings
 */