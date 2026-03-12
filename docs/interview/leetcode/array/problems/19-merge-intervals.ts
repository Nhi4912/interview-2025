/**
 * 56. Merge Intervals
 * 
 * Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, 
 * and return an array of the non-overlapping intervals that cover all the intervals in the input.
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
 * - 0 <= start_i <= end_i <= 10^4
 */

// Solution 1: Sort and Merge
// Time: O(n log n), Space: O(1) excluding output
export function merge1(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result: number[][] = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = result[result.length - 1];
        
        if (current[0] <= last[1]) {
            // Overlapping intervals, merge them
            last[1] = Math.max(last[1], current[1]);
        } else {
            // Non-overlapping, add to result
            result.push(current);
        }
    }
    
    return result;
}

// Solution 2: Two Pointers Approach
// Time: O(n log n), Space: O(n)
export function merge2(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result: number[][] = [];
    let start = intervals[0][0];
    let end = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        const [currentStart, currentEnd] = intervals[i];
        
        if (currentStart <= end) {
            // Overlapping, extend the end
            end = Math.max(end, currentEnd);
        } else {
            // Non-overlapping, add previous interval and start new one
            result.push([start, end]);
            start = currentStart;
            end = currentEnd;
        }
    }
    
    // Add the last interval
    result.push([start, end]);
    
    return result;
}

// Solution 3: Stack-based Approach
// Time: O(n log n), Space: O(n)
export function merge3(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const stack: number[][] = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const top = stack[stack.length - 1];
        
        if (current[0] <= top[1]) {
            // Overlapping, merge with top of stack
            top[1] = Math.max(top[1], current[1]);
        } else {
            // Non-overlapping, push to stack
            stack.push(current);
        }
    }
    
    return stack;
}

// Solution 4: Sweep Line Algorithm
// Time: O(n log n), Space: O(n)
export function merge4(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    // Create events: start = +1, end = -1
    const events: [number, number][] = [];
    
    for (const [start, end] of intervals) {
        events.push([start, 1]);    // Start event
        events.push([end + 1, -1]); // End event (end + 1 to handle touching intervals)
    }
    
    // Sort events by position, then by type (start before end)
    events.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    
    const result: number[][] = [];
    let count = 0;
    let start = -1;
    
    for (const [pos, type] of events) {
        if (count === 0 && type === 1) {
            // Start of a new merged interval
            start = pos;
        }
        
        count += type;
        
        if (count === 0 && type === -1) {
            // End of a merged interval
            result.push([start, pos - 1]);
        }
    }
    
    return result;
}

// Solution 5: Interval Tree Approach (Advanced)
// Time: O(n log n), Space: O(n)
export function merge5(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    // Build a sorted list of unique time points
    const timePoints = new Set<number>();
    for (const [start, end] of intervals) {
        timePoints.add(start);
        timePoints.add(end);
    }
    
    const sortedTimes = Array.from(timePoints).sort((a, b) => a - b);
    
    // Mark which time segments are covered
    const covered = new Array(sortedTimes.length - 1).fill(false);
    
    for (const [start, end] of intervals) {
        const startIdx = sortedTimes.indexOf(start);
        const endIdx = sortedTimes.indexOf(end);
        
        for (let i = startIdx; i < endIdx; i++) {
            covered[i] = true;
        }
    }
    
    // Merge consecutive covered segments
    const result: number[][] = [];
    let i = 0;
    
    while (i < covered.length) {
        if (covered[i]) {
            const mergedStart = sortedTimes[i];
            while (i < covered.length && covered[i]) {
                i++;
            }
            const mergedEnd = sortedTimes[i];
            result.push([mergedStart, mergedEnd]);
        } else {
            i++;
        }
    }
    
    return result;
}

// Solution 6: Optimized In-Place Merge
// Time: O(n log n), Space: O(1)
export function merge6(intervals: number[][]): number[][] {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    let writeIndex = 0;
    
    for (let readIndex = 1; readIndex < intervals.length; readIndex++) {
        const current = intervals[readIndex];
        const previous = intervals[writeIndex];
        
        if (current[0] <= previous[1]) {
            // Overlapping, merge in-place
            previous[1] = Math.max(previous[1], current[1]);
        } else {
            // Non-overlapping, move to next position
            writeIndex++;
            intervals[writeIndex] = current;
        }
    }
    
    // Return only the merged intervals
    return intervals.slice(0, writeIndex + 1);
}

// Test cases
export function testMerge() {
    console.log("Testing Merge Intervals:");
    
    const testCases = [
        {
            input: [[1, 3], [2, 6], [8, 10], [15, 18]],
            expected: [[1, 6], [8, 10], [15, 18]]
        },
        {
            input: [[1, 4], [4, 5]],
            expected: [[1, 5]]
        },
        {
            input: [[1, 4], [2, 3]],
            expected: [[1, 4]]
        },
        {
            input: [[1, 4], [0, 4]],
            expected: [[0, 4]]
        },
        {
            input: [[1, 4], [0, 0]],
            expected: [[0, 0], [1, 4]]
        },
        {
            input: [[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]],
            expected: [[1, 10]]
        }
    ];
    
    const solutions = [
        { name: "Sort and Merge", fn: merge1 },
        { name: "Two Pointers", fn: merge2 },
        { name: "Stack-based", fn: merge3 },
        { name: "Sweep Line", fn: merge4 },
        { name: "Interval Tree", fn: merge5 },
        { name: "In-Place Merge", fn: merge6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            // Deep copy input for each test
            const inputCopy = test.input.map(interval => [...interval]);
            const result = solution.fn(inputCopy);
            const passed = JSON.stringify(result) === JSON.stringify(test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: ${JSON.stringify(test.input)}`);
                console.log(`    Expected: ${JSON.stringify(test.expected)}`);
                console.log(`    Got: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Sorting is Essential**:
 *    - Sort intervals by start time
 *    - Enables linear scan for overlaps
 *    - Time complexity dominated by sorting: O(n log n)
 * 
 * 2. **Overlap Detection**:
 *    - Two intervals [a,b] and [c,d] overlap if: a <= d and c <= b
 *    - After sorting: only need to check if start <= previous_end
 * 
 * 3. **Merging Strategy**:
 *    - Keep track of current merged interval
 *    - Extend end time when overlapping
 *    - Start new interval when non-overlapping
 * 
 * 4. **Edge Cases**:
 *    - Empty or single interval
 *    - Touching intervals ([1,4] and [4,5])
 *    - Nested intervals ([1,4] and [2,3])
 *    - Multiple overlapping intervals
 * 
 * 5. **Space Optimization**:
 *    - In-place modification possible
 *    - Use write pointer to compact result
 *    - Avoid creating new arrays when possible
 * 
 * 6. **Interview Strategy**:
 *    - Start with sorting approach
 *    - Explain overlap detection logic
 *    - Handle edge cases carefully
 *    - Consider space optimization
 * 
 * 7. **Time Complexity**: O(n log n)
 *    - Sorting: O(n log n)
 *    - Merging: O(n)
 *    - Cannot be optimized further without constraints
 * 
 * 8. **Space Complexity**: O(1) to O(n)
 *    - In-place: O(1) excluding output
 *    - Stack/events: O(n) for intermediate storage
 * 
 * 9. **Advanced Techniques**:
 *    - Sweep line for complex scenarios
 *    - Interval trees for range queries
 *    - Event-based processing
 * 
 * 10. **Big Tech Variations**:
 *     - Google: Meeting rooms scheduling
 *     - Meta: Timeline merging
 *     - Amazon: Delivery time windows
 *     - Microsoft: Calendar conflicts
 * 
 * 11. **Follow-up Questions**:
 *     - Insert new interval into sorted list
 *     - Find minimum number of rooms needed
 *     - Merge intervals with priorities
 *     - Handle infinite intervals
 * 
 * 12. **Real-world Applications**:
 *     - Calendar scheduling
 *     - Resource allocation
 *     - Time series data processing
 *     - Network bandwidth management
 *     - Database query optimization
 */