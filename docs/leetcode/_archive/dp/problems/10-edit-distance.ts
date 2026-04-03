/**
 * 72. Edit Distance
 * 
 * Given two strings word1 and word2, return the minimum number of operations required 
 * to convert word1 to word2.
 * 
 * You have the following three operations permitted on a word:
 * - Insert a character
 * - Delete a character
 * - Replace a character
 * 
 * Example 1:
 * Input: word1 = "horse", word2 = "ros"
 * Output: 3
 * Explanation: 
 * horse -> rorse (replace 'h' with 'r')
 * rorse -> rose (remove 'r')
 * rose -> ros (remove 'e')
 * 
 * Example 2:
 * Input: word1 = "intention", word2 = "execution"
 * Output: 5
 * Explanation: 
 * intention -> inention (remove 't')
 * inention -> enention (replace 'i' with 'e')
 * enention -> exention (replace 'n' with 'x')
 * exention -> exection (replace 'n' with 'c')
 * exection -> execution (insert 'u')
 * 
 * Constraints:
 * - 0 <= word1.length, word2.length <= 500
 * - word1 and word2 consist of lowercase English letters.
 */

// Solution 1: 2D Dynamic Programming (Classic)
// Time: O(m×n), Space: O(m×n)
export function minDistance1(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    
    // dp[i][j] = min operations to convert word1[0...i-1] to word2[0...j-1]
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Base cases: converting empty string
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i; // Delete all characters from word1
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j; // Insert all characters to match word2
    }
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                // Characters match, no operation needed
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // Take minimum of three operations
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,     // Delete from word1
                    dp[i][j - 1] + 1,     // Insert into word1
                    dp[i - 1][j - 1] + 1  // Replace in word1
                );
            }
        }
    }
    
    return dp[m][n];
}

// Solution 2: Space Optimized DP (1D Array)
// Time: O(m×n), Space: O(min(m,n))
export function minDistance2(word1: string, word2: string): number {
    // Ensure word1 is the shorter string for space optimization
    if (word1.length > word2.length) {
        [word1, word2] = [word2, word1];
    }
    
    const m = word1.length;
    const n = word2.length;
    
    let prev = Array.from({ length: m + 1 }, (_, i) => i);
    let curr = new Array(m + 1);
    
    for (let j = 1; j <= n; j++) {
        curr[0] = j;
        
        for (let i = 1; i <= m; i++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[i] = prev[i - 1];
            } else {
                curr[i] = Math.min(
                    prev[i] + 1,      // Delete
                    curr[i - 1] + 1,  // Insert
                    prev[i - 1] + 1   // Replace
                );
            }
        }
        
        [prev, curr] = [curr, prev];
    }
    
    return prev[m];
}

// Solution 3: Memoization (Top-Down)
// Time: O(m×n), Space: O(m×n)
export function minDistance3(word1: string, word2: string): number {
    const memo = new Map<string, number>();
    
    function dp(i: number, j: number): number {
        // Base cases
        if (i === 0) return j; // Insert all remaining characters from word2
        if (j === 0) return i; // Delete all remaining characters from word1
        
        const key = `${i},${j}`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        let result;
        if (word1[i - 1] === word2[j - 1]) {
            // Characters match
            result = dp(i - 1, j - 1);
        } else {
            // Try all three operations
            result = 1 + Math.min(
                dp(i - 1, j),     // Delete
                dp(i, j - 1),     // Insert
                dp(i - 1, j - 1)  // Replace
            );
        }
        
        memo.set(key, result);
        return result;
    }
    
    return dp(word1.length, word2.length);
}

// Solution 4: Optimized with Two Variables
// Time: O(m×n), Space: O(min(m,n))
export function minDistance4(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    
    if (m === 0) return n;
    if (n === 0) return m;
    
    // Use the shorter string for the array dimension
    if (m > n) {
        return minDistance4(word2, word1);
    }
    
    let dp = Array.from({ length: m + 1 }, (_, i) => i);
    
    for (let j = 1; j <= n; j++) {
        let prev = dp[0];
        dp[0] = j;
        
        for (let i = 1; i <= m; i++) {
            const temp = dp[i];
            
            if (word1[i - 1] === word2[j - 1]) {
                dp[i] = prev;
            } else {
                dp[i] = 1 + Math.min(dp[i], dp[i - 1], prev);
            }
            
            prev = temp;
        }
    }
    
    return dp[m];
}

// Solution 5: Recursive with Path Tracking
// Time: O(m×n), Space: O(m×n)
export function minDistance5(word1: string, word2: string): number {
    const memo = new Map<string, { cost: number; path: string[] }>();
    
    function dp(i: number, j: number): { cost: number; path: string[] } {
        if (i === 0) {
            return {
                cost: j,
                path: Array.from({ length: j }, (_, k) => `Insert '${word2[k]}'`)
            };
        }
        
        if (j === 0) {
            return {
                cost: i,
                path: Array.from({ length: i }, (_, k) => `Delete '${word1[i - 1 - k]}'`)
            };
        }
        
        const key = `${i},${j}`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        let result;
        if (word1[i - 1] === word2[j - 1]) {
            result = dp(i - 1, j - 1);
        } else {
            const deleteOp = dp(i - 1, j);
            const insertOp = dp(i, j - 1);
            const replaceOp = dp(i - 1, j - 1);
            
            const operations = [
                {
                    cost: deleteOp.cost + 1,
                    path: [...deleteOp.path, `Delete '${word1[i - 1]}'`]
                },
                {
                    cost: insertOp.cost + 1,
                    path: [...insertOp.path, `Insert '${word2[j - 1]}'`]
                },
                {
                    cost: replaceOp.cost + 1,
                    path: [...replaceOp.path, `Replace '${word1[i - 1]}' with '${word2[j - 1]}'`]
                }
            ];
            
            result = operations.reduce((min, op) => op.cost < min.cost ? op : min);
        }
        
        memo.set(key, result);
        return result;
    }
    
    const result = dp(word1.length, word2.length);
    // Uncomment to see the operations:
    // console.log("Operations:", result.path);
    return result.cost;
}

// Solution 6: Iterative with Diagonal Optimization
// Time: O(m×n), Space: O(min(m,n))
export function minDistance6(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    
    if (m === 0) return n;
    if (n === 0) return m;
    
    // Process diagonally to optimize cache usage
    const maxLen = Math.max(m, n);
    const minLen = Math.min(m, n);
    
    // Use rolling array
    let prev = new Array(minLen + 1);
    let curr = new Array(minLen + 1);
    
    // Initialize
    for (let i = 0; i <= minLen; i++) {
        prev[i] = i;
    }
    
    const longer = m > n ? word1 : word2;
    const shorter = m > n ? word2 : word1;
    
    for (let i = 1; i <= maxLen; i++) {
        curr[0] = i;
        
        for (let j = 1; j <= Math.min(i, minLen); j++) {
            const longIdx = m > n ? i - 1 : j - 1;
            const shortIdx = m > n ? j - 1 : i - 1;
            
            if (longer[longIdx] === shorter[shortIdx]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + Math.min(
                    prev[j],      // Delete
                    curr[j - 1],  // Insert
                    prev[j - 1]   // Replace
                );
            }
        }
        
        [prev, curr] = [curr, prev];
    }
    
    return prev[minLen];
}

// Test cases
export function testMinDistance() {
    console.log("Testing Edit Distance:");
    
    const testCases = [
        {
            word1: "horse",
            word2: "ros",
            expected: 3
        },
        {
            word1: "intention",
            word2: "execution",
            expected: 5
        },
        {
            word1: "",
            word2: "abc",
            expected: 3
        },
        {
            word1: "abc",
            word2: "",
            expected: 3
        },
        {
            word1: "abc",
            word2: "abc",
            expected: 0
        },
        {
            word1: "a",
            word2: "b",
            expected: 1
        },
        {
            word1: "kitten",
            word2: "sitting",
            expected: 3
        }
    ];
    
    const solutions = [
        { name: "2D DP", fn: minDistance1 },
        { name: "Space Optimized", fn: minDistance2 },
        { name: "Memoization", fn: minDistance3 },
        { name: "Two Variables", fn: minDistance4 },
        { name: "Path Tracking", fn: minDistance5 },
        { name: "Diagonal Optimization", fn: minDistance6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.word1, test.word2);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: "${test.word1}" -> "${test.word2}"`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Definition**:
 *    - Levenshtein Distance: minimum edit operations
 *    - Three operations: insert, delete, replace
 *    - Transform word1 to word2 with minimum cost
 * 
 * 2. **DP State Definition**:
 *    - dp[i][j] = min operations to convert word1[0...i-1] to word2[0...j-1]
 *    - Base cases: dp[i][0] = i, dp[0][j] = j
 * 
 * 3. **Recurrence Relation**:
 *    - If chars match: dp[i][j] = dp[i-1][j-1]
 *    - Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
 *    - Three choices correspond to delete, insert, replace
 * 
 * 4. **Space Optimization**:
 *    - 2D → 1D: Only need previous row
 *    - Two variables: Track diagonal value separately
 *    - Choose shorter string for space dimension
 * 
 * 5. **Time Complexity**: O(m×n)
 *    - Must fill m×n table entries
 *    - Each entry computed in O(1)
 *    - Cannot be improved asymptotically
 * 
 * 6. **Space Complexity**:
 *    - Naive: O(m×n) for 2D table
 *    - Optimized: O(min(m,n)) using rolling arrays
 *    - Extreme: O(1) with careful variable management
 * 
 * 7. **Operation Interpretation**:
 *    - dp[i-1][j] + 1: Delete char from word1
 *    - dp[i][j-1] + 1: Insert char into word1
 *    - dp[i-1][j-1] + 1: Replace char in word1
 * 
 * 8. **Interview Strategy**:
 *    - Start with recursive solution
 *    - Identify overlapping subproblems
 *    - Apply memoization
 *    - Convert to bottom-up DP
 *    - Optimize space if needed
 * 
 * 9. **Edge Cases**:
 *    - Empty strings (one or both)
 *    - Identical strings
 *    - Single character strings
 *    - No common characters
 * 
 * 10. **Path Reconstruction**:
 *     - Track which operation led to optimal solution
 *     - Backtrack from dp[m][n] to dp[0][0]
 *     - Build sequence of operations
 * 
 * 11. **Variants and Extensions**:
 *     - Weighted operations (different costs)
 *     - Allow transposition (Damerau-Levenshtein)
 *     - Multiple string alignment
 *     - Approximate string matching
 * 
 * 12. **Big Tech Applications**:
 *     - Google: Spell checkers, search suggestions
 *     - Meta: Content similarity, deduplication
 *     - Amazon: Product matching, recommendations
 *     - Microsoft: Auto-correction, text comparison
 * 
 * 13. **Follow-up Questions**:
 *     - Return the actual edit sequence
 *     - Handle different operation costs
 *     - Optimize for very long strings
 *     - Handle Unicode/multibyte characters
 * 
 * 14. **Real-world Applications**:
 *     - DNA sequence alignment
 *     - Plagiarism detection
 *     - Version control (diff algorithms)
 *     - Natural language processing
 *     - Database record matching
 * 
 * 15. **Optimization Techniques**:
 *     - Early termination with distance bounds
 *     - Diagonal processing for cache efficiency
 *     - Bit-parallel algorithms for small alphabets
 *     - Suffix tree/array optimizations
 * 
 * 16. **Common Mistakes**:
 *     - Wrong base case initialization
 *     - Incorrect operation cost accounting
 *     - Off-by-one errors in indexing
 *     - Not handling empty string cases
 */