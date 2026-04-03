/**
 * 340. Longest Substring with At Most K Distinct Characters
 * 
 * Given a string s and an integer k, return the length of the longest substring 
 * of s that contains at most k distinct characters.
 * 
 * Example 1:
 * Input: s = "eceba", k = 2
 * Output: 3
 * Explanation: The substring is "ece" with length 3.
 * 
 * Example 2:
 * Input: s = "aa", k = 1
 * Output: 2
 * Explanation: The substring is "aa" with length 2.
 * 
 * Constraints:
 * - 1 <= s.length <= 5 * 10^4
 * - 0 <= k <= 50
 * - s consists of lowercase English letters.
 */

// Solution 1: Sliding Window with HashMap
// Time: O(n), Space: O(k)
export function lengthOfLongestSubstringKDistinct1(s: string, k: number): number {
    if (k === 0) return 0;
    
    const charCount = new Map<string, number>();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);
        
        // Shrink window if we have more than k distinct characters
        while (charCount.size > k) {
            const leftChar = s[left];
            charCount.set(leftChar, charCount.get(leftChar)! - 1);
            
            if (charCount.get(leftChar) === 0) {
                charCount.delete(leftChar);
            }
            
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Solution 2: Sliding Window with Last Occurrence Tracking
// Time: O(n), Space: O(k)
export function lengthOfLongestSubstringKDistinct2(s: string, k: number): number {
    if (k === 0) return 0;
    
    const lastOccurrence = new Map<string, number>();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        lastOccurrence.set(rightChar, right);
        
        // If we have more than k distinct characters
        if (lastOccurrence.size > k) {
            // Find the character with the smallest last occurrence
            let minIdx = right;
            let charToRemove = '';
            
            for (const [char, idx] of lastOccurrence) {
                if (idx < minIdx) {
                    minIdx = idx;
                    charToRemove = char;
                }
            }
            
            lastOccurrence.delete(charToRemove);
            left = minIdx + 1;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Solution 3: Optimized with Ordered Map Simulation
// Time: O(n), Space: O(k)
export function lengthOfLongestSubstringKDistinct3(s: string, k: number): number {
    if (k === 0) return 0;
    
    // Use array to simulate ordered map for better performance
    const chars: string[] = [];
    const charIndex = new Map<string, number>();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        
        // If character already exists, remove it from current position
        if (charIndex.has(rightChar)) {
            const idx = charIndex.get(rightChar)!;
            chars.splice(idx, 1);
            // Update indices for characters after the removed one
            for (let i = idx; i < chars.length; i++) {
                charIndex.set(chars[i], i);
            }
        }
        
        // Add character to the end
        chars.push(rightChar);
        charIndex.set(rightChar, chars.length - 1);
        
        // If we have more than k distinct characters, remove the first one
        if (chars.length > k) {
            const charToRemove = chars.shift()!;
            charIndex.delete(charToRemove);
            // Update indices
            for (let i = 0; i < chars.length; i++) {
                charIndex.set(chars[i], i);
            }
            // Move left pointer to exclude the removed character
            while (left <= right && s[left] !== charToRemove) {
                left++;
            }
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Solution 4: Two Pointers with Frequency Array
// Time: O(n), Space: O(1) - assuming lowercase letters only
export function lengthOfLongestSubstringKDistinct4(s: string, k: number): number {
    if (k === 0) return 0;
    
    const freq = new Array(26).fill(0);
    let distinctCount = 0;
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const rightCharCode = s.charCodeAt(right) - 97; // 'a' = 97
        
        if (freq[rightCharCode] === 0) {
            distinctCount++;
        }
        freq[rightCharCode]++;
        
        // Shrink window if necessary
        while (distinctCount > k) {
            const leftCharCode = s.charCodeAt(left) - 97;
            freq[leftCharCode]--;
            
            if (freq[leftCharCode] === 0) {
                distinctCount--;
            }
            
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Solution 5: Sliding Window with Deque for LRU
// Time: O(n), Space: O(k)
export function lengthOfLongestSubstringKDistinct5(s: string, k: number): number {
    if (k === 0) return 0;
    
    const charDeque: string[] = []; // LRU order
    const charSet = new Set<string>();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        
        // If character already exists, move it to the end
        if (charSet.has(rightChar)) {
            const idx = charDeque.indexOf(rightChar);
            charDeque.splice(idx, 1);
        } else {
            charSet.add(rightChar);
        }
        
        charDeque.push(rightChar);
        
        // If we exceed k distinct characters
        if (charSet.size > k) {
            const lruChar = charDeque.shift()!;
            charSet.delete(lruChar);
            
            // Move left pointer past all occurrences of removed character
            while (left <= right && s[left] !== lruChar) {
                left++;
            }
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Solution 6: Advanced with Character Position Tracking
// Time: O(n), Space: O(k)
export function lengthOfLongestSubstringKDistinct6(s: string, k: number): number {
    if (k === 0) return 0;
    
    class CharTracker {
        char: string;
        positions: number[] = [];
        
        constructor(char: string) {
            this.char = char;
        }
        
        addPosition(pos: number): void {
            this.positions.push(pos);
        }
        
        getEarliestPosition(): number {
            return this.positions.length > 0 ? this.positions[0] : -1;
        }
        
        removePositionsUpTo(pos: number): void {
            while (this.positions.length > 0 && this.positions[0] <= pos) {
                this.positions.shift();
            }
        }
        
        isEmpty(): boolean {
            return this.positions.length === 0;
        }
    }
    
    const charTrackers = new Map<string, CharTracker>();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        
        if (!charTrackers.has(rightChar)) {
            charTrackers.set(rightChar, new CharTracker(rightChar));
        }
        
        charTrackers.get(rightChar)!.addPosition(right);
        
        // If we have more than k distinct characters
        while (charTrackers.size > k) {
            // Find character with earliest position
            let earliestPos = right;
            let charToRemove = '';
            
            for (const [char, tracker] of charTrackers) {
                const earliestCharPos = tracker.getEarliestPosition();
                if (earliestCharPos < earliestPos) {
                    earliestPos = earliestCharPos;
                    charToRemove = char;
                }
            }
            
            // Remove this character and update left pointer
            if (charToRemove) {
                charTrackers.delete(charToRemove);
                left = earliestPos + 1;
                
                // Clean up positions for remaining characters
                for (const tracker of charTrackers.values()) {
                    tracker.removePositionsUpTo(earliestPos);
                }
            }
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Test cases
export function testLengthOfLongestSubstringKDistinct() {
    console.log("Testing Longest Substring with At Most K Distinct Characters:");
    
    const testCases = [
        {
            s: "eceba",
            k: 2,
            expected: 3
        },
        {
            s: "aa",
            k: 1,
            expected: 2
        },
        {
            s: "abaccc",
            k: 2,
            expected: 4
        },
        {
            s: "abcdef",
            k: 3,
            expected: 3
        },
        {
            s: "aaaaaaa",
            k: 1,
            expected: 7
        },
        {
            s: "abcadcacacaca",
            k: 3,
            expected: 11
        },
        {
            s: "a",
            k: 0,
            expected: 0
        },
        {
            s: "abc",
            k: 4,
            expected: 3
        }
    ];
    
    const solutions = [
        { name: "HashMap Sliding Window", fn: lengthOfLongestSubstringKDistinct1 },
        { name: "Last Occurrence Tracking", fn: lengthOfLongestSubstringKDistinct2 },
        { name: "Ordered Map Simulation", fn: lengthOfLongestSubstringKDistinct3 },
        { name: "Frequency Array", fn: lengthOfLongestSubstringKDistinct4 },
        { name: "Deque LRU", fn: lengthOfLongestSubstringKDistinct5 },
        { name: "Position Tracking", fn: lengthOfLongestSubstringKDistinct6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.s, test.k);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: s="${test.s}", k=${test.k}`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Sliding Window Pattern**:
 *    - Expand right pointer to include new characters
 *    - Contract left pointer when constraint violated
 *    - Track distinct character count efficiently
 * 
 * 2. **Character Tracking Strategies**:
 *    - HashMap with frequency counting
 *    - Last occurrence tracking for LRU eviction
 *    - Position arrays for advanced scenarios
 * 
 * 3. **Window Shrinking Logic**:
 *    - When distinct count > k, remove leftmost character
 *    - Different approaches to find "leftmost" character
 *    - Update left pointer to exclude removed character
 * 
 * 4. **Time Complexity**: O(n)
 *    - Each character processed at most twice
 *    - HashMap operations are O(1) on average
 *    - Linear scan with constant work per character
 * 
 * 5. **Space Complexity**: O(k)
 *    - HashMap stores at most k+1 characters
 *    - Additional data structures bounded by k
 *    - Can be O(1) with character array for limited alphabet
 * 
 * 6. **Optimization Techniques**:
 *    - Character arrays for limited alphabets
 *    - LRU tracking for efficient eviction
 *    - Position tracking for advanced use cases
 * 
 * 7. **Interview Strategy**:
 *    - Start with basic sliding window approach
 *    - Explain character counting mechanism
 *    - Handle window shrinking logic carefully
 *    - Optimize based on constraints
 * 
 * 8. **Edge Cases**:
 *    - k = 0 (no characters allowed)
 *    - k >= unique characters in string
 *    - Single character string
 *    - Empty string
 * 
 * 9. **Common Mistakes**:
 *    - Incorrect window shrinking logic
 *    - Not updating left pointer properly
 *    - Off-by-one errors in length calculation
 *    - Inefficient character removal
 * 
 * 10. **Pattern Recognition**:
 *     - Classic sliding window with constraint
 *     - Maintain invariant: at most k distinct
 *     - Expand when possible, contract when necessary
 * 
 * 11. **Big Tech Variations**:
 *     - Google: Exactly k distinct characters
 *     - Meta: Weighted characters
 *     - Amazon: Multiple strings processing
 *     - Microsoft: Stream processing version
 * 
 * 12. **Follow-up Questions**:
 *     - Return the actual substring
 *     - Handle Unicode characters
 *     - Process streaming data
 *     - Find all substrings of length exactly k distinct
 * 
 * 13. **Real-world Applications**:
 *     - Text analysis and pattern matching
 *     - Data compression algorithms
 *     - Network packet analysis
 *     - Bioinformatics sequence analysis
 *     - Language model training data preprocessing
 * 
 * 14. **Alternative Approaches**:
 *     - Two-pass algorithm (less efficient)
 *     - Recursive with memoization (overkill)
 *     - Trie-based solutions (complex)
 * 
 * 15. **Performance Considerations**:
 *     - Cache locality with character arrays
 *     - Memory allocation patterns
 *     - String operation efficiency
 *     - Early termination opportunities
 */