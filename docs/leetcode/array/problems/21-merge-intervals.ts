/**
 * 56. Merge Intervals
 * 
 * Given an array of intervals where intervals[i] = [starti, endi], 
 * merge all overlapping intervals, and return an array of the non-overlapping 
 * intervals that cover all the intervals in the input.
 * 
 * Example 1:
 * Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
 * Output: [[1,6],[8,10],[15,18]]
 * Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
 * 
 * Example 2:
 * Input: intervals = [[1,4],[4,5]]
 * Output: [[1,5]]
 * Explanation: Intervals [1,4] and [4,5] are considered overlapping.
 * 
 * Constraints:
 * - 1 <= intervals.length <= 10^4
 * - intervals[i].length == 2
 * - 0 <= starti <= endi <= 10^4
 */

// Solution 1: Sort and Merge
// Time: O(n log n), Space: O(1) or O(n) depending on sorting
export function merge1(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    // Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const merged: number[][] = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = merged[merged.length - 1];
        
        // Check if current interval overlaps with last merged interval
        if (current[0] <= lastMerged[1]) {
            // Merge intervals
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap, add current interval
            merged.push(current);
        }
    }
    
    return merged;
}

// Solution 2: Stack-based Approach
// Time: O(n log n), Space: O(n)
export function merge2(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const stack: number[][] = [];
    
    for (const interval of intervals) {
        if (stack.length === 0 || stack[stack.length - 1][1] < interval[0]) {
            // No overlap, push current interval
            stack.push(interval);
        } else {
            // Overlap, merge with top of stack
            stack[stack.length - 1][1] = Math.max(stack[stack.length - 1][1], interval[1]);
        }
    }
    
    return stack;
}

// Solution 3: In-place Merge
// Time: O(n log n), Space: O(1)
export function merge3(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    let writeIndex = 0;
    
    for (let readIndex = 1; readIndex < intervals.length; readIndex++) {
        const current = intervals[readIndex];
        const lastMerged = intervals[writeIndex];
        
        if (current[0] <= lastMerged[1]) {
            // Merge intervals
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap, move to next position
            writeIndex++;
            intervals[writeIndex] = current;
        }
    }
    
    return intervals.slice(0, writeIndex + 1);
}

// Solution 4: Sweep Line Algorithm
// Time: O(n log n), Space: O(n)
export function merge4(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    // Create events: start = +1, end = -1
    const events: [number, number][] = [];
    
    for (const [start, end] of intervals) {
        events.push([start, 1]);    // Start event
        events.push([end + 1, -1]); // End event (end + 1 for inclusive intervals)
    }
    
    // Sort events by time, with start events before end events at same time
    events.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    
    const merged: number[][] = [];
    let activeCount = 0;
    let start = 0;
    
    for (const [time, type] of events) {
        if (activeCount === 0 && type === 1) {
            // Start of new merged interval
            start = time;
        }
        
        activeCount += type;
        
        if (activeCount === 0 && type === -1) {
            // End of merged interval
            merged.push([start, time - 1]);
        }
    }
    
    return merged;
}

// Solution 5: Interval Tree Approach
// Time: O(n log n), Space: O(n)
export function merge5(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    // Group intervals by start time
    const startGroups = new Map<number, number[][]>();
    
    for (const interval of intervals) {
        const start = interval[0];
        if (!startGroups.has(start)) {
            startGroups.set(start, []);
        }
        startGroups.get(start)!.push(interval);
    }
    
    // Sort start times
    const sortedStarts = Array.from(startGroups.keys()).sort((a, b) => a - b);
    
    const merged: number[][] = [];
    
    for (const start of sortedStarts) {
        const intervalsAtStart = startGroups.get(start)!;
        
        for (const interval of intervalsAtStart) {
            if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
                merged.push([...interval]);
            } else {
                merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
            }
        }
    }
    
    return merged;
}

// Solution 6: Divide and Conquer
// Time: O(n log n), Space: O(log n)
export function merge6(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    function mergeIntervals(intervals: number[][]): number[][] {
        if (intervals.length <= 1) return intervals;
        
        const mid = Math.floor(intervals.length / 2);
        const left = mergeIntervals(intervals.slice(0, mid));
        const right = mergeIntervals(intervals.slice(mid));
        
        return mergeTwoSortedIntervals(left, right);
    }
    
    function mergeTwoSortedIntervals(left: number[][], right: number[][]): number[][] {
        const merged: number[][] = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            if (left[i][0] <= right[j][0]) {
                addInterval(merged, left[i]);
                i++;
            } else {
                addInterval(merged, right[j]);
                j++;
            }
        }
        
        while (i < left.length) {
            addInterval(merged, left[i]);
            i++;
        }
        
        while (j < right.length) {
            addInterval(merged, right[j]);
            j++;
        }
        
        return merged;
    }
    
    function addInterval(merged: number[][], interval: number[]): void {
        if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
            merged.push([...interval]);
        } else {
            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
        }
    }
    
    // Sort first, then apply divide and conquer
    intervals.sort((a, b) => a[0] - b[0]);
    return mergeIntervals(intervals);
}

// Test cases
export function testMerge() {
    console.log("Testing Merge Intervals:");
    
    const testCases = [
        {
            intervals: [[1, 3], [2, 6], [8, 10], [15, 18]],
            expected: [[1, 6], [8, 10], [15, 18]]
        },
        {
            intervals: [[1, 4], [4, 5]],
            expected: [[1, 5]]
        },
        {
            intervals: [[1, 4], [2, 3]],
            expected: [[1, 4]]
        },
        {
            intervals: [[1, 4], [0, 4]],
            expected: [[0, 4]]
        },
        {
            intervals: [[1, 4], [5, 6]],
            expected: [[1, 4], [5, 6]]
        },
        {
            intervals: [[1, 4], [0, 0]],
            expected: [[0, 0], [1, 4]]
        },
        {
            intervals: [[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]],
            expected: [[1, 10]]
        },
        {
            intervals: [[1, 3], [2, 6], [8, 10], [9, 12], [15, 18]],
            expected: [[1, 6], [8, 12], [15, 18]]
        }
    ];
    
    const solutions = [
        { name: "Sort and Merge", fn: merge1 },
        { name: "Stack-based", fn: merge2 },
        { name: "In-place Merge", fn: merge3 },
        { name: "Sweep Line", fn: merge4 },
        { name: "Interval Tree", fn: merge5 },
        { name: "Divide and Conquer", fn: merge6 }
    ];
    
    function arraysEqual(a: number[][], b: number[][]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i].length !== b[i].length) return false;
            for (let j = 0; j < a[i].length; j++) {
                if (a[i][j] !== b[i][j]) return false;
            }
        }
        return true;
    }
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const input = test.intervals.map(interval => [...interval]);
            const result = solution.fn(input);
            const passed = arraysEqual(result, test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: ${JSON.stringify(test.intervals)}`);
                console.log(`    Expected: ${JSON.stringify(test.expected)}`);
                console.log(`    Got: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Interval Merging Logic**:
 *    - Two intervals [a,b] and [c,d] overlap if b >= c (after sorting)
 *    - Merged interval: [min(a,c), max(b,d)]
 *    - Critical: sort by start time first
 * 
 * 2. **Sorting Strategy**:
 *    - Sort intervals by start time
 *    - Process in order, comparing with last merged interval
 *    - O(n log n) time complexity from sorting
 * 
 * 3. **Overlap Detection**:
 *    - current[0] <= lastMerged[1]: intervals overlap
 *    - Inclusive overlap: [1,4] and [4,5] should merge
 *    - Merge: extend end time to maximum of both
 * 
 * 4. **Space Optimization**:
 *    - In-place approach: overwrite original array
 *    - Stack approach: explicit data structure
 *    - Result array: collect non-overlapping intervals
 * 
 * 5. **Edge Cases**:
 *    - Empty array or single interval
 *    - All intervals overlap (merge to one)
 *    - No overlaps (return as-is)
 *    - Identical intervals
 * 
 * 6. **Time Complexity**: O(n log n)
 *    - Sorting dominates the complexity
 *    - Merging phase is O(n)
 *    - Cannot be improved without additional constraints
 * 
 * 7. **Space Complexity**: O(1) to O(n)
 *    - In-place: O(1) extra space
 *    - With result array: O(n) space
 *    - Depends on implementation choice
 * 
 * 8. **Alternative Approaches**:
 *    - Sweep line algorithm
 *    - Interval trees for multiple queries
 *    - Divide and conquer for educational purposes
 * 
 * 9. **Interview Strategy**:
 *    - Start with sorting approach
 *    - Explain overlap detection logic
 *    - Handle edge cases systematically
 *    - Discuss space optimization options
 * 
 * 10. **Implementation Details**:
 *     - Sort by start time (intervals[i][0])
 *     - Track last merged interval
 *     - Update end time when merging
 *     - Add new interval when no overlap
 * 
 * 11. **Common Mistakes**:
 *     - Forgetting to sort intervals
 *     - Incorrect overlap detection
 *     - Not handling edge cases
 *     - Mutating input when not intended
 * 
 * 12. **Optimization Techniques**:
 *     - In-place merging to save space
 *     - Early termination (not applicable here)
 *     - Efficient sorting algorithms
 * 
 * 13. **Big Tech Variations**:
 *     - Google: Insert new interval into sorted list
 *     - Meta: Merge intervals with weights
 *     - Amazon: Meeting room scheduling
 *     - Microsoft: Calendar conflict resolution
 * 
 * 14. **Follow-up Questions**:
 *     - Insert interval into sorted list
 *     - Find minimum meeting rooms needed
 *     - Merge k lists of intervals
 *     - Remove covered intervals
 * 
 * 15. **Real-world Applications**:
 *     - Calendar scheduling systems
 *     - Resource allocation problems
 *     - Time slot management
 *     - Network bandwidth allocation
 *     - Database query optimization
 * 
 * 16. **Pattern Recognition**:
 *     - Interval processing pattern
 *     - Greedy algorithm approach
 *     - Sort and sweep technique
 *     - Merge operation on sorted data
 * 
 * 17. **Testing Strategy**:
 *     - Test with overlapping intervals
 *     - Test with non-overlapping intervals
 *     - Test edge cases (empty, single)
 *     - Test boundary conditions
 */