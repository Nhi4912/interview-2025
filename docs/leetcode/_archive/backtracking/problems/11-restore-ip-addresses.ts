/**
 * 93. Restore IP Addresses
 * 
 * A valid IP address consists of exactly four integers separated by single dots. 
 * Each integer is between 0 and 255 (inclusive) and cannot have leading zeros.
 * 
 * For example, "0.1.2.201" and "192.168.1.1" are valid IP addresses, but "0.011.255.245", 
 * "192.168.1.312" and "192.168@1.1" are invalid IP addresses.
 * 
 * Given a string s containing only digits, return all possible valid IP addresses 
 * that can be formed by inserting dots into s. You are not allowed to reorder or remove any digits in s. 
 * You may return the valid IP addresses in any order.
 * 
 * Example 1:
 * Input: s = "25525511135"
 * Output: ["255.255.11.135","255.255.111.35"]
 * 
 * Example 2:
 * Input: s = "0000"
 * Output: ["0.0.0.0"]
 * 
 * Example 3:
 * Input: s = "101023"
 * Output: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
 * 
 * Constraints:
 * - 1 <= s.length <= 20
 * - s consists of digits only.
 */

// Solution 1: Backtracking with Validation
// Time: O(3^4), Space: O(1)
export function restoreIpAddresses1(s: string): string[] {
    const result: string[] = [];
    
    function isValidSegment(segment: string): boolean {
        // Check length
        if (segment.length === 0 || segment.length > 3) return false;
        
        // Check leading zeros
        if (segment.length > 1 && segment[0] === '0') return false;
        
        // Check range
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }
    
    function backtrack(index: number, parts: string[], currentParts: number): void {
        // Base case: we have 4 parts and used all characters
        if (currentParts === 4 && index === s.length) {
            result.push(parts.join('.'));
            return;
        }
        
        // Pruning: too many parts or not enough characters left
        if (currentParts === 4 || index === s.length) return;
        
        // Try different segment lengths (1, 2, 3)
        for (let len = 1; len <= 3; len++) {
            if (index + len > s.length) break;
            
            const segment = s.substring(index, index + len);
            
            if (isValidSegment(segment)) {
                parts.push(segment);
                backtrack(index + len, parts, currentParts + 1);
                parts.pop();
            }
        }
    }
    
    backtrack(0, [], 0);
    return result;
}

// Solution 2: Iterative with Three Nested Loops
// Time: O(1), Space: O(1)
export function restoreIpAddresses2(s: string): string[] {
    const result: string[] = [];
    const n = s.length;
    
    // Check if length is valid for IP address
    if (n < 4 || n > 12) return result;
    
    function isValidSegment(segment: string): boolean {
        if (segment.length === 0 || segment.length > 3) return false;
        if (segment.length > 1 && segment[0] === '0') return false;
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }
    
    // Try all possible positions for the three dots
    for (let i = 1; i <= 3 && i < n; i++) {
        for (let j = i + 1; j <= i + 3 && j < n; j++) {
            for (let k = j + 1; k <= j + 3 && k < n; k++) {
                const part1 = s.substring(0, i);
                const part2 = s.substring(i, j);
                const part3 = s.substring(j, k);
                const part4 = s.substring(k);
                
                if (isValidSegment(part1) && isValidSegment(part2) && 
                    isValidSegment(part3) && isValidSegment(part4)) {
                    result.push(`${part1}.${part2}.${part3}.${part4}`);
                }
            }
        }
    }
    
    return result;
}

// Solution 3: DFS with Early Termination
// Time: O(3^4), Space: O(1)
export function restoreIpAddresses3(s: string): string[] {
    const result: string[] = [];
    const n = s.length;
    
    // Early termination for invalid lengths
    if (n < 4 || n > 12) return result;
    
    function dfs(index: number, path: string[], remaining: number): void {
        // Pruning: not enough digits left or too many digits left
        const digitsLeft = n - index;
        if (digitsLeft < remaining || digitsLeft > remaining * 3) {
            return;
        }
        
        if (remaining === 0) {
            if (index === n) {
                result.push(path.join('.'));
            }
            return;
        }
        
        // Try segments of length 1, 2, 3
        for (let len = 1; len <= Math.min(3, digitsLeft); len++) {
            const segment = s.substring(index, index + len);
            
            // Validate segment
            if (isValid(segment)) {
                path.push(segment);
                dfs(index + len, path, remaining - 1);
                path.pop();
            }
        }
    }
    
    function isValid(segment: string): boolean {
        if (segment.length > 1 && segment[0] === '0') return false;
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }
    
    dfs(0, [], 4);
    return result;
}

// Solution 4: Bit Manipulation Approach
// Time: O(1), Space: O(1)
export function restoreIpAddresses4(s: string): string[] {
    const result: string[] = [];
    const n = s.length;
    
    if (n < 4 || n > 12) return result;
    
    function isValidSegment(segment: string): boolean {
        if (segment.length === 0 || segment.length > 3) return false;
        if (segment.length > 1 && segment[0] === '0') return false;
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }
    
    // Use bit manipulation to represent all possible combinations
    // Each bit represents whether to place a dot at that position
    for (let mask = 0; mask < (1 << (n - 1)); mask++) {
        const dots: number[] = [];
        
        // Extract dot positions from bitmask
        for (let i = 0; i < n - 1; i++) {
            if (mask & (1 << i)) {
                dots.push(i + 1); // Position after character i
            }
        }
        
        // We need exactly 3 dots for 4 segments
        if (dots.length !== 3) continue;
        
        // Extract segments
        const segments: string[] = [];
        let start = 0;
        
        for (const dotPos of dots) {
            segments.push(s.substring(start, dotPos));
            start = dotPos;
        }
        segments.push(s.substring(start)); // Last segment
        
        // Validate all segments
        if (segments.every(isValidSegment)) {
            result.push(segments.join('.'));
        }
    }
    
    return result;
}

// Solution 5: Dynamic Programming Approach
// Time: O(n^3), Space: O(n^2)
export function restoreIpAddresses5(s: string): string[] {
    const n = s.length;
    if (n < 4 || n > 12) return [];
    
    // dp[i][j] = true if s[0...i-1] can form j valid IP segments
    const dp: boolean[][] = Array(n + 1).fill(null).map(() => Array(5).fill(false));
    const parent: number[][][] = Array(n + 1).fill(null).map(() => 
        Array(5).fill(null).map(() => [])
    );
    
    dp[0][0] = true;
    
    function isValidSegment(start: number, end: number): boolean {
        if (start > end || end - start + 1 > 3) return false;
        if (start < end && s[start] === '0') return false;
        
        let num = 0;
        for (let i = start; i <= end; i++) {
            num = num * 10 + (s.charCodeAt(i) - 48);
            if (num > 255) return false;
        }
        return true;
    }
    
    // Fill DP table
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= Math.min(i, 4); j++) {
            for (let k = Math.max(0, i - 3); k < i; k++) {
                if (dp[k][j - 1] && isValidSegment(k, i - 1)) {
                    dp[i][j] = true;
                    parent[i][j].push(k);
                }
            }
        }
    }
    
    const result: string[] = [];
    
    // Reconstruct all valid IP addresses
    function reconstruct(pos: number, segments: number, path: string[]): void {
        if (segments === 0 && pos === 0) {
            result.push(path.reverse().join('.'));
            path.reverse(); // Restore original order
            return;
        }
        
        if (segments === 0 || pos === 0) return;
        
        for (const prevPos of parent[pos][segments]) {
            const segment = s.substring(prevPos, pos);
            path.push(segment);
            reconstruct(prevPos, segments - 1, path);
            path.pop();
        }
    }
    
    if (dp[n][4]) {
        reconstruct(n, 4, []);
    }
    
    return result;
}

// Solution 6: Recursive with Memoization
// Time: O(3^4), Space: O(3^4)
export function restoreIpAddresses6(s: string): string[] {
    const memo = new Map<string, string[]>();
    
    function solve(index: number, remaining: number): string[] {
        const key = `${index},${remaining}`;
        if (memo.has(key)) {
            return memo.get(key)!;
        }
        
        const result: string[] = [];
        
        // Base case
        if (remaining === 0) {
            if (index === s.length) {
                result.push('');
            }
            memo.set(key, result);
            return result;
        }
        
        // Early termination
        const digitsLeft = s.length - index;
        if (digitsLeft < remaining || digitsLeft > remaining * 3) {
            memo.set(key, result);
            return result;
        }
        
        // Try all possible segment lengths
        for (let len = 1; len <= Math.min(3, digitsLeft); len++) {
            const segment = s.substring(index, index + len);
            
            if (isValidSegment(segment)) {
                const subResults = solve(index + len, remaining - 1);
                
                for (const subResult of subResults) {
                    if (subResult === '') {
                        result.push(segment);
                    } else {
                        result.push(segment + '.' + subResult);
                    }
                }
            }
        }
        
        memo.set(key, result);
        return result;
    }
    
    function isValidSegment(segment: string): boolean {
        if (segment.length > 1 && segment[0] === '0') return false;
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }
    
    return solve(0, 4);
}

// Test cases
export function testRestoreIpAddresses() {
    console.log("Testing Restore IP Addresses:");
    
    const testCases = [
        {
            input: "25525511135",
            expected: ["255.255.11.135", "255.255.111.35"]
        },
        {
            input: "0000",
            expected: ["0.0.0.0"]
        },
        {
            input: "101023",
            expected: ["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"]
        },
        {
            input: "1111",
            expected: ["1.1.1.1"]
        },
        {
            input: "010010",
            expected: ["0.10.0.10", "0.100.1.0"]
        },
        {
            input: "1023",
            expected: ["1.0.2.3"]
        },
        {
            input: "123",
            expected: []
        }
    ];
    
    const solutions = [
        { name: "Backtracking", fn: restoreIpAddresses1 },
        { name: "Three Nested Loops", fn: restoreIpAddresses2 },
        { name: "DFS Early Termination", fn: restoreIpAddresses3 },
        { name: "Bit Manipulation", fn: restoreIpAddresses4 },
        { name: "Dynamic Programming", fn: restoreIpAddresses5 },
        { name: "Memoization", fn: restoreIpAddresses6 }
    ];
    
    function normalizeResult(result: string[]): string[] {
        return result.sort();
    }
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = normalizeResult(solution.fn(test.input));
            const expected = normalizeResult([...test.expected]);
            
            const passed = JSON.stringify(result) === JSON.stringify(expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: "${test.input}"`);
                console.log(`    Expected: ${JSON.stringify(expected)}`);
                console.log(`    Got: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **IP Address Structure**:
 *    - Exactly 4 segments separated by dots
 *    - Each segment: 0-255, no leading zeros (except "0")
 *    - Need to place exactly 3 dots in string
 * 
 * 2. **Constraint Analysis**:
 *    - String length: 4-12 characters for valid IP
 *    - Each segment: 1-3 characters
 *    - No leading zeros except single "0"
 * 
 * 3. **Backtracking Strategy**:
 *    - Try all possible segment lengths (1, 2, 3)
 *    - Validate each segment before continuing
 *    - Need exactly 4 segments to form valid IP
 * 
 * 4. **Validation Rules**:
 *    - Segment length: 1-3 digits
 *    - No leading zeros (except "0")
 *    - Numeric value: 0-255
 * 
 * 5. **Time Complexity**: O(3^4) = O(81)
 *    - At most 3 choices for each of 4 segments
 *    - Constant time complexity due to fixed constraints
 *    - Very efficient for this specific problem
 * 
 * 6. **Space Complexity**: O(1)
 *    - Recursion depth limited to 4
 *    - No additional data structures needed
 *    - Result space depends on number of valid IPs
 * 
 * 7. **Early Termination Optimizations**:
 *    - Check remaining digits vs remaining segments
 *    - Invalid string length check upfront
 *    - Prune impossible branches early
 * 
 * 8. **Interview Strategy**:
 *    - Start with backtracking approach
 *    - Explain IP address validation rules
 *    - Add early termination optimizations
 *    - Discuss iterative alternative
 * 
 * 9. **Edge Cases**:
 *    - All zeros: "0000" → ["0.0.0.0"]
 *    - Leading zeros: "010010" special handling
 *    - Too short: "123" → []
 *    - Too long: exceeds 12 characters
 * 
 * 10. **Common Mistakes**:
 *     - Forgetting leading zero constraint
 *     - Not validating segment range (0-255)
 *     - Incorrect string length validation
 *     - Off-by-one errors in segment extraction
 * 
 * 11. **Alternative Approaches**:
 *     - Three nested loops (simpler but less elegant)
 *     - Bit manipulation for dot placement
 *     - Dynamic programming (overkill for this problem)
 * 
 * 12. **Optimization Techniques**:
 *     - Early length validation
 *     - Pruning with remaining digit analysis
 *     - Avoiding unnecessary string operations
 * 
 * 13. **Big Tech Variations**:
 *     - Google: IPv6 address restoration
 *     - Meta: Custom IP format validation
 *     - Amazon: Network address parsing
 *     - Microsoft: URL validation extensions
 * 
 * 14. **Follow-up Questions**:
 *     - Handle IPv6 addresses
 *     - Count total valid IP addresses
 *     - Find lexicographically smallest IP
 *     - Validate existing IP addresses
 * 
 * 15. **Real-world Applications**:
 *     - Network configuration tools
 *     - IP address parsing in routers
 *     - Network security validation
 *     - Log file analysis tools
 *     - Network monitoring systems
 * 
 * 16. **Pattern Recognition**:
 *     - Constrained backtracking problem
 *     - String segmentation with validation
 *     - Fixed number of segments pattern
 *     - Early termination optimization
 */