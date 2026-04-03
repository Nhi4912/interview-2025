/**
 * 253. Meeting Rooms II
 * 
 * Given an array of meeting time intervals consisting of start and end times 
 * [[s1,e1],[s2,e2],...] (si < ei), find the minimum number of conference rooms required.
 * 
 * Example 1:
 * Input: [[0,30],[5,10],[15,20]]
 * Output: 2
 * 
 * Example 2:
 * Input: [[7,10],[2,4]]
 * Output: 1
 * 
 * Example 3:
 * Input: [[9,10],[4,9],[4,17]]
 * Output: 2
 * 
 * Constraints:
 * - 1 <= intervals.length <= 10^4
 * - 0 <= starti < endi <= 10^6
 */

// Solution 1: Min Heap (Priority Queue)
// Time: O(n log n), Space: O(n)
export function minMeetingRooms1(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Min heap to store end times of ongoing meetings
    const endTimes: number[] = [];
    
    function push(val: number): void {
        endTimes.push(val);
        // Heapify up
        let idx = endTimes.length - 1;
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            if (endTimes[parentIdx] <= endTimes[idx]) break;
            [endTimes[parentIdx], endTimes[idx]] = [endTimes[idx], endTimes[parentIdx]];
            idx = parentIdx;
        }
    }
    
    function pop(): number {
        if (endTimes.length === 0) return -1;
        
        const min = endTimes[0];
        const last = endTimes.pop()!;
        
        if (endTimes.length > 0) {
            endTimes[0] = last;
            // Heapify down
            let idx = 0;
            while (true) {
                let minIdx = idx;
                const left = 2 * idx + 1;
                const right = 2 * idx + 2;
                
                if (left < endTimes.length && endTimes[left] < endTimes[minIdx]) {
                    minIdx = left;
                }
                if (right < endTimes.length && endTimes[right] < endTimes[minIdx]) {
                    minIdx = right;
                }
                
                if (minIdx === idx) break;
                [endTimes[idx], endTimes[minIdx]] = [endTimes[minIdx], endTimes[idx]];
                idx = minIdx;
            }
        }
        
        return min;
    }
    
    function peek(): number {
        return endTimes.length > 0 ? endTimes[0] : -1;
    }
    
    // Process meetings
    for (const [start, end] of intervals) {
        // Check if any meeting has ended
        while (endTimes.length > 0 && peek() <= start) {
            pop();
        }
        
        // Add current meeting's end time
        push(end);
    }
    
    return endTimes.length;
}

// Solution 2: Sweep Line Algorithm
// Time: O(n log n), Space: O(n)
export function minMeetingRooms2(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    // Create events: start = +1, end = -1
    const events: [number, number][] = [];
    
    for (const [start, end] of intervals) {
        events.push([start, 1]);   // Meeting starts
        events.push([end, -1]);    // Meeting ends
    }
    
    // Sort events by time, with end events before start events at same time
    events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    
    let activeRooms = 0;
    let maxRooms = 0;
    
    for (const [time, type] of events) {
        activeRooms += type;
        maxRooms = Math.max(maxRooms, activeRooms);
    }
    
    return maxRooms;
}

// Solution 3: Two Pointers
// Time: O(n log n), Space: O(n)
export function minMeetingRooms3(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    const starts = intervals.map(interval => interval[0]).sort((a, b) => a - b);
    const ends = intervals.map(interval => interval[1]).sort((a, b) => a - b);
    
    let roomsNeeded = 0;
    let maxRooms = 0;
    let startPtr = 0;
    let endPtr = 0;
    
    while (startPtr < starts.length) {
        if (starts[startPtr] < ends[endPtr]) {
            // Meeting starts, need a room
            roomsNeeded++;
            startPtr++;
        } else {
            // Meeting ends, free a room
            roomsNeeded--;
            endPtr++;
        }
        
        maxRooms = Math.max(maxRooms, roomsNeeded);
    }
    
    return maxRooms;
}

// Solution 4: Chronological Ordering
// Time: O(n log n), Space: O(n)
export function minMeetingRooms4(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const rooms: number[] = []; // Array of end times
    
    for (const [start, end] of intervals) {
        // Find the earliest available room
        let earliestRoom = -1;
        let earliestTime = Infinity;
        
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i] <= start && rooms[i] < earliestTime) {
                earliestTime = rooms[i];
                earliestRoom = i;
            }
        }
        
        if (earliestRoom === -1) {
            // No available room, need a new one
            rooms.push(end);
        } else {
            // Use existing room
            rooms[earliestRoom] = end;
        }
    }
    
    return rooms.length;
}

// Solution 5: Interval Merging Approach
// Time: O(n log n), Space: O(n)
export function minMeetingRooms5(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const roomSchedules: number[][] = [];
    
    for (const [start, end] of intervals) {
        let assigned = false;
        
        // Try to assign to existing room
        for (let i = 0; i < roomSchedules.length; i++) {
            const lastMeeting = roomSchedules[i][roomSchedules[i].length - 1];
            if (lastMeeting <= start) {
                roomSchedules[i].push(end);
                assigned = true;
                break;
            }
        }
        
        // If no room available, create new room
        if (!assigned) {
            roomSchedules.push([end]);
        }
    }
    
    return roomSchedules.length;
}

// Solution 6: Map-based Counting
// Time: O(n log n), Space: O(n)
export function minMeetingRooms6(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    const timeMap = new Map<number, number>();
    
    // Count start and end events
    for (const [start, end] of intervals) {
        timeMap.set(start, (timeMap.get(start) || 0) + 1);
        timeMap.set(end, (timeMap.get(end) || 0) - 1);
    }
    
    // Sort times and process events
    const sortedTimes = Array.from(timeMap.keys()).sort((a, b) => a - b);
    
    let activeRooms = 0;
    let maxRooms = 0;
    
    for (const time of sortedTimes) {
        activeRooms += timeMap.get(time)!;
        maxRooms = Math.max(maxRooms, activeRooms);
    }
    
    return maxRooms;
}

// Test cases
export function testMinMeetingRooms() {
    console.log("Testing Meeting Rooms II:");
    
    const testCases = [
        {
            intervals: [[0, 30], [5, 10], [15, 20]],
            expected: 2
        },
        {
            intervals: [[7, 10], [2, 4]],
            expected: 1
        },
        {
            intervals: [[9, 10], [4, 9], [4, 17]],
            expected: 2
        },
        {
            intervals: [[1, 4], [2, 3], [3, 6]],
            expected: 2
        },
        {
            intervals: [[1, 4], [4, 5]],
            expected: 1
        },
        {
            intervals: [[1, 2], [2, 3], [3, 4], [4, 5]],
            expected: 1
        },
        {
            intervals: [[1, 3], [1, 3], [1, 3]],
            expected: 3
        },
        {
            intervals: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
            expected: 1
        },
        {
            intervals: [[1, 10], [2, 9], [3, 8], [4, 7], [5, 6]],
            expected: 5
        }
    ];
    
    const solutions = [
        { name: "Min Heap", fn: minMeetingRooms1 },
        { name: "Sweep Line", fn: minMeetingRooms2 },
        { name: "Two Pointers", fn: minMeetingRooms3 },
        { name: "Chronological Ordering", fn: minMeetingRooms4 },
        { name: "Interval Merging", fn: minMeetingRooms5 },
        { name: "Map-based Counting", fn: minMeetingRooms6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const input = test.intervals.map(interval => [...interval]);
            const result = solution.fn(input);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: ${JSON.stringify(test.intervals)}`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Understanding**:
 *    - Find minimum conference rooms needed for all meetings
 *    - Meetings with same start/end time don't overlap
 *    - Need to track maximum concurrent meetings
 * 
 * 2. **Core Strategy**:
 *    - Track when meetings start and end
 *    - Count maximum simultaneous meetings
 *    - Use efficient data structures for tracking
 * 
 * 3. **Min Heap Approach**:
 *    - Sort meetings by start time
 *    - Use heap to track end times of active meetings
 *    - Remove finished meetings before starting new ones
 * 
 * 4. **Sweep Line Algorithm**:
 *    - Create events for meeting starts (+1) and ends (-1)
 *    - Sort events by time (end before start at same time)
 *    - Track running count of active meetings
 * 
 * 5. **Two Pointers Technique**:
 *    - Separate and sort start times and end times
 *    - Use two pointers to track meetings starting vs ending
 *    - Maintain count of active meetings
 * 
 * 6. **Time Complexity**: O(n log n)
 *    - Sorting dominates the complexity
 *    - Heap operations: O(log n) per meeting
 *    - Cannot be improved without additional constraints
 * 
 * 7. **Space Complexity**: O(n)
 *    - Heap/priority queue: O(n) in worst case
 *    - Sweep line: O(n) for events
 *    - Two pointers: O(n) for sorted arrays
 * 
 * 8. **Edge Cases**:
 *    - Empty intervals array
 *    - Single meeting
 *    - All meetings at same time
 *    - Non-overlapping meetings
 * 
 * 9. **Interview Strategy**:
 *    - Start with sweep line (most intuitive)
 *    - Explain min heap approach
 *    - Discuss two pointers optimization
 *    - Handle edge cases systematically
 * 
 * 10. **Key Insight - Event Processing**:
 *     - Meeting end at time T means room available at T
 *     - Meeting start at time T needs room at T
 *     - Critical: process ends before starts at same time
 * 
 * 11. **Optimization Considerations**:
 *     - Min heap: efficient for finding earliest end time
 *     - Two pointers: simpler implementation
 *     - Sweep line: easy to understand and debug
 * 
 * 12. **Common Mistakes**:
 *     - Not handling meeting boundaries correctly
 *     - Incorrect event ordering at same time
 *     - Not removing finished meetings from heap
 *     - Wrong initialization of room count
 * 
 * 13. **Big Tech Variations**:
 *     - Google: Weighted meetings (priority-based)
 *     - Meta: Maximum profit meeting scheduling
 *     - Amazon: Multi-resource scheduling
 *     - Microsoft: Recurring meeting patterns
 * 
 * 14. **Follow-up Questions**:
 *     - Schedule meetings optimally
 *     - Find actual room assignments
 *     - Handle meeting priorities
 *     - Minimize room changes
 * 
 * 15. **Real-world Applications**:
 *     - Conference room booking systems
 *     - Resource allocation algorithms
 *     - CPU scheduling problems
 *     - Network bandwidth allocation
 *     - Parking space management
 * 
 * 16. **Pattern Recognition**:
 *     - Interval scheduling pattern
 *     - Event-based processing
 *     - Greedy algorithm application
 *     - Priority queue utilization
 * 
 * 17. **Implementation Tips**:
 *     - Sort meetings by start time first
 *     - Use appropriate data structure for tracking
 *     - Handle boundary conditions carefully
 *     - Test with overlapping and non-overlapping cases
 * 
 * 18. **Complexity Analysis**:
 *     - Best case: O(n log n) - cannot avoid sorting
 *     - Worst case: O(n log n) - same as best case
 *     - Space: O(n) - for storing intervals/events
 *     - Optimal for comparison-based approaches
 */