/**
 * 57. Insert Interval
 * 
 * You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] 
 * represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. 
 * You are also given an interval newInterval = [start, end] that represents the start and end of another interval.
 * 
 * Insert newInterval into intervals such that intervals is still sorted in ascending order by starti 
 * and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).
 * 
 * Return intervals after the insertion.
 * 
 * Example 1:
 * Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
 * Output: [[1,5],[6,9]]
 * 
 * Example 2:
 * Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
 * Output: [[1,2],[3,10],[12,16]]
 * 
 * Constraints:
 * - 0 <= intervals.length <= 10^4
 * - intervals[i].length == 2
 * - 0 <= starti <= endi <= 10^5
 * - intervals is sorted by starti.
 * - newInterval.length == 2
 * - 0 <= start <= end <= 10^5
 */

// Solution 1: Linear Scan and Merge
// Time: O(n), Space: O(n)
export function insert1(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let i = 0;
    const n = intervals.length;
    
    // Add all intervals that end before newInterval starts
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }
    
    // Merge overlapping intervals with newInterval
    while (i < n && intervals[i][0] <= newInterval[1]) {
        // Merge intervals
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    
    // Add the merged interval
    result.push(newInterval);
    
    // Add remaining intervals
    while (i < n) {
        result.push(intervals[i]);
        i++;
    }
    
    return result;
}

// Solution 2: Binary Search + Merge
// Time: O(n), Space: O(n)
export function insert2(intervals: number[][], newInterval: number[]): number[][] {
    if (intervals.length === 0) return [newInterval];
    
    // Binary search for insertion position
    function binarySearchLeft(target: number): number {
        let left = 0, right = intervals.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (intervals[mid][0] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
    
    function binarySearchRight(target: number): number {
        let left = 0, right = intervals.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (intervals[mid][1] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
    
    const result: number[][] = [];
    
    // Find range of intervals that overlap with newInterval
    let start = 0, end = intervals.length;
    
    // Find first interval that might overlap
    for (let i = 0; i < intervals.length; i++) {
        if (intervals[i][1] >= newInterval[0]) {
            start = i;
            break;
        }
    }
    
    // Find last interval that might overlap
    for (let i = intervals.length - 1; i >= 0; i--) {
        if (intervals[i][0] <= newInterval[1]) {
            end = i + 1;
            break;
        }
    }
    
    // Add intervals before overlap
    for (let i = 0; i < start; i++) {
        result.push(intervals[i]);
    }
    
    // Merge overlapping intervals
    let mergedStart = newInterval[0];
    let mergedEnd = newInterval[1];
    
    for (let i = start; i < end; i++) {
        if (intervals[i][0] <= newInterval[1] && intervals[i][1] >= newInterval[0]) {
            mergedStart = Math.min(mergedStart, intervals[i][0]);
            mergedEnd = Math.max(mergedEnd, intervals[i][1]);
        }
    }
    
    result.push([mergedStart, mergedEnd]);
    
    // Add intervals after overlap
    for (let i = end; i < intervals.length; i++) {
        result.push(intervals[i]);
    }
    
    return result;
}

// Solution 3: Three-Phase Approach
// Time: O(n), Space: O(n)
export function insert3(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let inserted = false;
    
    for (const interval of intervals) {
        if (interval[1] < newInterval[0]) {
            // No overlap, interval ends before newInterval starts
            result.push(interval);
        } else if (interval[0] > newInterval[1]) {
            // No overlap, interval starts after newInterval ends
            if (!inserted) {
                result.push(newInterval);
                inserted = true;
            }
            result.push(interval);
        } else {
            // Overlap, merge intervals
            newInterval[0] = Math.min(newInterval[0], interval[0]);
            newInterval[1] = Math.max(newInterval[1], interval[1]);
        }
    }
    
    // Add newInterval if not inserted yet
    if (!inserted) {
        result.push(newInterval);
    }
    
    return result;
}

// Solution 4: Stack-based Approach
// Time: O(n), Space: O(n)
export function insert4(intervals: number[][], newInterval: number[]): number[][] {
    const stack: number[][] = [];
    let inserted = false;
    
    for (let i = 0; i <= intervals.length; i++) {
        let current: number[];
        
        if (i === intervals.length) {
            if (!inserted) {
                current = newInterval;
            } else {
                break;
            }
        } else if (!inserted && intervals[i][0] >= newInterval[0]) {
            current = newInterval;
            inserted = true;
            i--; // Process current interval in next iteration
            continue;
        } else {
            current = intervals[i];
        }
        
        if (stack.length === 0 || stack[stack.length - 1][1] < current[0]) {
            // No overlap
            stack.push(current);
        } else {
            // Overlap, merge
            stack[stack.length - 1][1] = Math.max(stack[stack.length - 1][1], current[1]);
        }
    }
    
    return stack;
}

// Solution 5: Recursive Approach
// Time: O(n), Space: O(n)
export function insert5(intervals: number[][], newInterval: number[]): number[][] {
    function insertHelper(intervals: number[][], newInterval: number[], index: number): number[][] {
        if (index >= intervals.length) {
            return [newInterval];
        }
        
        const current = intervals[index];
        
        if (newInterval[1] < current[0]) {
            // Insert before current
            return [newInterval, ...intervals.slice(index)];
        } else if (newInterval[0] > current[1]) {
            // Insert after current
            return [current, ...insertHelper(intervals, newInterval, index + 1)];
        } else {
            // Merge with current
            const merged = [
                Math.min(newInterval[0], current[0]),
                Math.max(newInterval[1], current[1])
            ];
            return insertHelper(intervals, merged, index + 1);
        }
    }
    
    return insertHelper(intervals, newInterval, 0);
}

// Solution 6: Two-Pass Approach
// Time: O(n), Space: O(n)
export function insert6(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    
    // First pass: find merge range
    let mergeStart = -1;
    let mergeEnd = -1;
    
    for (let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        
        if (interval[0] <= newInterval[1] && interval[1] >= newInterval[0]) {
            // Overlapping interval
            if (mergeStart === -1) {
                mergeStart = i;
            }
            mergeEnd = i;
        }
    }
    
    // Second pass: build result
    let i = 0;
    
    // Add intervals before merge range
    while (i < mergeStart) {
        result.push(intervals[i]);
        i++;
    }
    
    // Add merged interval
    if (mergeStart === -1) {
        // No overlaps, find insertion position
        let insertPos = 0;
        while (insertPos < intervals.length && intervals[insertPos][0] < newInterval[0]) {
            insertPos++;
        }
        
        // Build result with insertion
        for (let j = 0; j < insertPos; j++) {
            result.push(intervals[j]);
        }
        result.push(newInterval);
        for (let j = insertPos; j < intervals.length; j++) {
            result.push(intervals[j]);
        }
    } else {
        // Merge overlapping intervals
        let mergedStart = newInterval[0];
        let mergedEnd = newInterval[1];
        
        for (let j = mergeStart; j <= mergeEnd; j++) {
            mergedStart = Math.min(mergedStart, intervals[j][0]);
            mergedEnd = Math.max(mergedEnd, intervals[j][1]);
        }
        
        result.push([mergedStart, mergedEnd]);
        
        // Add intervals after merge range
        for (let j = mergeEnd + 1; j < intervals.length; j++) {
            result.push(intervals[j]);
        }
    }
    
    return result;
}

// Test cases
export function testInsert() {
    console.log("Testing Insert Interval:");
    
    const testCases = [
        {
            intervals: [[1, 3], [6, 9]],
            newInterval: [2, 5],
            expected: [[1, 5], [6, 9]]
        },
        {
            intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]],
            newInterval: [4, 8],
            expected: [[1, 2], [3, 10], [12, 16]]
        },
        {
            intervals: [],
            newInterval: [5, 7],
            expected: [[5, 7]]
        },
        {
            intervals: [[1, 5]],
            newInterval: [2, 3],
            expected: [[1, 5]]
        },
        {
            intervals: [[1, 5]],
            newInterval: [6, 8],
            expected: [[1, 5], [6, 8]]
        },
        {
            intervals: [[1, 5]],
            newInterval: [0, 0],
            expected: [[0, 0], [1, 5]]
        },
        {
            intervals: [[1, 3], [6, 9]],
            newInterval: [2, 5],
            expected: [[1, 5], [6, 9]]
        },
        {
            intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]],
            newInterval: [4, 8],
            expected: [[1, 2], [3, 10], [12, 16]]
        }
    ];
    
    const solutions = [
        { name: "Linear Scan and Merge", fn: insert1 },
        { name: "Binary Search + Merge", fn: insert2 },
        { name: "Three-Phase Approach", fn: insert3 },
        { name: "Stack-based", fn: insert4 },
        { name: "Recursive", fn: insert5 },
        { name: "Two-Pass", fn: insert6 }
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
            const intervals = test.intervals.map(interval => [...interval]);
            const newInterval = [...test.newInterval];
            const result = solution.fn(intervals, newInterval);
            const passed = arraysEqual(result, test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Intervals: ${JSON.stringify(test.intervals)}`);
                console.log(`    New Interval: ${JSON.stringify(test.newInterval)}`);
                console.log(`    Expected: ${JSON.stringify(test.expected)}`);
                console.log(`    Got: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Structure**:
 *    - Intervals are already sorted and non-overlapping
 *    - Need to insert and merge new interval
 *    - Maintain sorted order and no overlaps
 * 
 * 2. **Three Phases Strategy**:
 *    - Phase 1: Add intervals that end before newInterval starts
 *    - Phase 2: Merge overlapping intervals with newInterval
 *    - Phase 3: Add intervals that start after newInterval ends
 * 
 * 3. **Overlap Detection**:
 *    - Two intervals [a,b] and [c,d] overlap if: max(a,c) <= min(b,d)
 *    - Or equivalently: a <= d && c <= b
 *    - No overlap if: b < c or d < a
 * 
 * 4. **Merging Logic**:
 *    - Merged interval: [min(start1, start2), max(end1, end2)]
 *    - Keep expanding newInterval as we find overlaps
 *    - Add final merged interval to result
 * 
 * 5. **Time Complexity**: O(n)
 *    - Single pass through intervals
 *    - Constant work per interval
 *    - Cannot be improved (must examine all intervals)
 * 
 * 6. **Space Complexity**: O(n)
 *    - Result array stores all intervals
 *    - Input modification could reduce to O(1)
 *    - Depends on whether input can be modified
 * 
 * 7. **Edge Cases**:
 *    - Empty intervals array
 *    - NewInterval doesn't overlap with any
 *    - NewInterval overlaps with all
 *    - NewInterval is subset of existing interval
 * 
 * 8. **Interview Strategy**:
 *    - Start with three-phase approach
 *    - Explain overlap detection clearly
 *    - Handle edge cases systematically
 *    - Discuss optimization opportunities
 * 
 * 9. **Key Observations**:
 *    - Input is already sorted (don't need to sort)
 *    - Can process in single left-to-right pass
 *    - Merge operations extend newInterval boundaries
 * 
 * 10. **Implementation Patterns**:
 *     - Linear scan: most straightforward
 *     - Binary search: helpful for very large inputs
 *     - Stack-based: natural for interval problems
 * 
 * 11. **Optimization Considerations**:
 *     - Early termination after processing overlaps
 *     - Binary search for insertion point (large inputs)
 *     - In-place modification if allowed
 * 
 * 12. **Common Mistakes**:
 *     - Incorrect overlap detection logic
 *     - Not handling boundary cases (touching intervals)
 *     - Forgetting to add newInterval when no overlaps
 *     - Wrong order in final result
 * 
 * 13. **Big Tech Variations**:
 *     - Google: Insert multiple intervals at once
 *     - Meta: Insert with priority/weight considerations
 *     - Amazon: Calendar scheduling with conflicts
 *     - Microsoft: Meeting room booking systems
 * 
 * 14. **Follow-up Questions**:
 *     - What if intervals weren't sorted?
 *     - Insert multiple new intervals efficiently
 *     - Remove intervals that overlap with new one
 *     - Find gaps in interval coverage
 * 
 * 15. **Real-world Applications**:
 *     - Calendar management systems
 *     - Resource booking platforms
 *     - Network bandwidth allocation
 *     - Memory management (free/allocated blocks)
 *     - Timeline visualization tools
 * 
 * 16. **Pattern Recognition**:
 *     - Interval merging pattern
 *     - Linear scan with state tracking
 *     - Greedy algorithm approach
 *     - Boundary condition handling
 * 
 * 17. **Testing Strategy**:
 *     - Test with no overlaps
 *     - Test with complete overlap
 *     - Test with partial overlaps
 *     - Test edge cases (empty, single interval)
 * 
 * 18. **Alternative Approaches**:
 *     - Recursive divide and conquer
 *     - Event-based processing
 *     - Interval tree data structure
 *     - Segment tree for range queries
 */