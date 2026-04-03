/**
 * 239. Sliding Window Maximum
 * 
 * You are given an array of integers nums, there is a sliding window of size k which is moving 
 * from the very left of the array to the very right. You can only see the k numbers in the window. 
 * Each time the sliding window moves right by one position.
 * 
 * Return the max sliding window.
 * 
 * Example 1:
 * Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
 * Output: [3,3,5,5,6,7]
 * Explanation: 
 * Window position                Max
 * ---------------               -----
 * [1  3  -1] -3  5  3  6  7       3
 *  1 [3  -1  -3] 5  3  6  7       3
 *  1  3 [-1  -3  5] 3  6  7       5
 *  1  3  -1 [-3  5  3] 6  7       5
 *  1  3  -1  -3 [5  3  6] 7       6
 *  1  3  -1  -3  5 [3  6  7]      7
 * 
 * Example 2:
 * Input: nums = [1], k = 1
 * Output: [1]
 * 
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 * - 1 <= k <= nums.length
 */

// Solution 1: Brute Force (Check each window)
// Time: O(n*k), Space: O(1)
export function maxSlidingWindow1(nums: number[], k: number): number[] {
    const result: number[] = [];
    
    for (let i = 0; i <= nums.length - k; i++) {
        let maxVal = nums[i];
        for (let j = i + 1; j < i + k; j++) {
            maxVal = Math.max(maxVal, nums[j]);
        }
        result.push(maxVal);
    }
    
    return result;
}

// Solution 2: Deque (Double-ended queue) - Optimal
// Time: O(n), Space: O(k)
export function maxSlidingWindow2(nums: number[], k: number): number[] {
    const result: number[] = [];
    const deque: number[] = []; // Store indices
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices that are out of current window
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }
        
        // Remove indices of elements smaller than current element
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }
        
        // Add current index
        deque.push(i);
        
        // Add maximum to result when window is complete
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}

// Solution 3: Segment Tree
// Time: O(n log k), Space: O(k)
export function maxSlidingWindow3(nums: number[], k: number): number[] {
    class SegmentTree {
        tree: number[];
        n: number;
        
        constructor(size: number) {
            this.n = size;
            this.tree = new Array(4 * size).fill(-Infinity);
        }
        
        update(node: number, start: number, end: number, idx: number, val: number): void {
            if (start === end) {
                this.tree[node] = val;
            } else {
                const mid = Math.floor((start + end) / 2);
                if (idx <= mid) {
                    this.update(2 * node, start, mid, idx, val);
                } else {
                    this.update(2 * node + 1, mid + 1, end, idx, val);
                }
                this.tree[node] = Math.max(this.tree[2 * node], this.tree[2 * node + 1]);
            }
        }
        
        query(node: number, start: number, end: number, l: number, r: number): number {
            if (r < start || end < l) return -Infinity;
            if (l <= start && end <= r) return this.tree[node];
            
            const mid = Math.floor((start + end) / 2);
            const leftMax = this.query(2 * node, start, mid, l, r);
            const rightMax = this.query(2 * node + 1, mid + 1, end, l, r);
            return Math.max(leftMax, rightMax);
        }
        
        updateValue(idx: number, val: number): void {
            this.update(1, 0, this.n - 1, idx, val);
        }
        
        rangeMax(l: number, r: number): number {
            return this.query(1, 0, this.n - 1, l, r);
        }
    }
    
    const result: number[] = [];
    const segTree = new SegmentTree(k);
    
    // Initialize first window
    for (let i = 0; i < k; i++) {
        segTree.updateValue(i, nums[i]);
    }
    result.push(segTree.rangeMax(0, k - 1));
    
    // Slide the window
    for (let i = k; i < nums.length; i++) {
        const removeIdx = (i - k) % k;
        segTree.updateValue(removeIdx, nums[i]);
        result.push(segTree.rangeMax(0, k - 1));
    }
    
    return result;
}

// Solution 4: Heap (Priority Queue)
// Time: O(n log k), Space: O(k)
export function maxSlidingWindow4(nums: number[], k: number): number[] {
    class MaxHeap {
        heap: [number, number][]; // [value, index]
        
        constructor() {
            this.heap = [];
        }
        
        push(val: number, idx: number): void {
            this.heap.push([val, idx]);
            this.heapifyUp(this.heap.length - 1);
        }
        
        pop(): [number, number] | undefined {
            if (this.heap.length === 0) return undefined;
            
            const max = this.heap[0];
            const last = this.heap.pop()!;
            
            if (this.heap.length > 0) {
                this.heap[0] = last;
                this.heapifyDown(0);
            }
            
            return max;
        }
        
        peek(): [number, number] | undefined {
            return this.heap.length > 0 ? this.heap[0] : undefined;
        }
        
        private heapifyUp(idx: number): void {
            while (idx > 0) {
                const parentIdx = Math.floor((idx - 1) / 2);
                if (this.heap[parentIdx][0] >= this.heap[idx][0]) break;
                
                [this.heap[parentIdx], this.heap[idx]] = [this.heap[idx], this.heap[parentIdx]];
                idx = parentIdx;
            }
        }
        
        private heapifyDown(idx: number): void {
            while (true) {
                let maxIdx = idx;
                const leftChild = 2 * idx + 1;
                const rightChild = 2 * idx + 2;
                
                if (leftChild < this.heap.length && this.heap[leftChild][0] > this.heap[maxIdx][0]) {
                    maxIdx = leftChild;
                }
                
                if (rightChild < this.heap.length && this.heap[rightChild][0] > this.heap[maxIdx][0]) {
                    maxIdx = rightChild;
                }
                
                if (maxIdx === idx) break;
                
                [this.heap[idx], this.heap[maxIdx]] = [this.heap[maxIdx], this.heap[idx]];
                idx = maxIdx;
            }
        }
    }
    
    const result: number[] = [];
    const heap = new MaxHeap();
    
    for (let i = 0; i < nums.length; i++) {
        heap.push(nums[i], i);
        
        // Remove elements outside current window
        while (heap.peek() && heap.peek()![1] <= i - k) {
            heap.pop();
        }
        
        // Add maximum to result when window is complete
        if (i >= k - 1) {
            result.push(heap.peek()![0]);
        }
    }
    
    return result;
}

// Solution 5: Divide and Conquer with Sparse Table
// Time: O(n log n), Space: O(n log n)
export function maxSlidingWindow5(nums: number[], k: number): number[] {
    const n = nums.length;
    const logN = Math.floor(Math.log2(n)) + 1;
    
    // Build sparse table
    const st = Array(n).fill(null).map(() => Array(logN).fill(0));
    
    // Initialize for length 1
    for (let i = 0; i < n; i++) {
        st[i][0] = nums[i];
    }
    
    // Build sparse table
    for (let j = 1; j < logN; j++) {
        for (let i = 0; i + (1 << j) <= n; i++) {
            st[i][j] = Math.max(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
        }
    }
    
    function rangeMax(l: number, r: number): number {
        const length = r - l + 1;
        const k = Math.floor(Math.log2(length));
        return Math.max(st[l][k], st[r - (1 << k) + 1][k]);
    }
    
    const result: number[] = [];
    for (let i = 0; i <= n - k; i++) {
        result.push(rangeMax(i, i + k - 1));
    }
    
    return result;
}

// Solution 6: Two Stacks Approach
// Time: O(n), Space: O(k)
export function maxSlidingWindow6(nums: number[], k: number): number[] {
    const result: number[] = [];
    const maxStack: number[] = [];
    const minStack: number[] = [];
    
    let left = 0;
    let right = 0;
    
    function pushRight(): void {
        const val = nums[right];
        while (maxStack.length > 0 && maxStack[maxStack.length - 1] < val) {
            maxStack.pop();
        }
        maxStack.push(val);
        right++;
    }
    
    function popLeft(): void {
        const val = nums[left];
        if (maxStack.length > 0 && maxStack[0] === val) {
            maxStack.shift();
        }
        left++;
    }
    
    function getMax(): number {
        return maxStack.length > 0 ? maxStack[0] : -Infinity;
    }
    
    // Initialize first window
    while (right < k) {
        pushRight();
    }
    result.push(getMax());
    
    // Slide window
    while (right < nums.length) {
        pushRight();
        popLeft();
        result.push(getMax());
    }
    
    return result;
}

// Test cases
export function testMaxSlidingWindow() {
    console.log("Testing Sliding Window Maximum:");
    
    const testCases = [
        {
            nums: [1, 3, -1, -3, 5, 3, 6, 7],
            k: 3,
            expected: [3, 3, 5, 5, 6, 7]
        },
        {
            nums: [1],
            k: 1,
            expected: [1]
        },
        {
            nums: [1, -1],
            k: 1,
            expected: [1, -1]
        },
        {
            nums: [9, 11],
            k: 2,
            expected: [11]
        },
        {
            nums: [4, -2, -1, 3, 1, 2],
            k: 2,
            expected: [4, -1, 3, 3, 2]
        }
    ];
    
    const solutions = [
        { name: "Brute Force", fn: maxSlidingWindow1 },
        { name: "Deque (Optimal)", fn: maxSlidingWindow2 },
        { name: "Segment Tree", fn: maxSlidingWindow3 },
        { name: "Heap", fn: maxSlidingWindow4 },
        { name: "Sparse Table", fn: maxSlidingWindow5 },
        { name: "Two Stacks", fn: maxSlidingWindow6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn([...test.nums], test.k);
            const passed = JSON.stringify(result) === JSON.stringify(test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: nums=${JSON.stringify(test.nums)}, k=${test.k}`);
                console.log(`    Expected: ${JSON.stringify(test.expected)}`);
                console.log(`    Got: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Pattern**:
 *    - Classic sliding window with range maximum query
 *    - Need to efficiently track maximum in moving window
 *    - Window size is fixed, slides one position at a time
 * 
 * 2. **Deque Solution (Optimal)**:
 *    - Maintain decreasing order of elements in deque
 *    - Store indices, not values (for window boundary checking)
 *    - Front of deque always contains maximum of current window
 * 
 * 3. **Deque Invariants**:
 *    - Indices are in increasing order
 *    - Values are in decreasing order
 *    - Remove indices outside current window from front
 *    - Remove smaller elements from back before adding new element
 * 
 * 4. **Time Complexity Analysis**:
 *    - Brute Force: O(n*k) - check each window
 *    - Deque: O(n) - each element added/removed once
 *    - Heap: O(n log k) - heap operations
 *    - Segment Tree: O(n log k) - range queries
 * 
 * 5. **Space Complexity**:
 *    - Deque: O(k) - at most k elements
 *    - Heap: O(k) - window size elements
 *    - Segment Tree: O(k) - tree structure
 * 
 * 6. **Why Deque Works**:
 *    - Smaller elements can never be maximum while larger element exists
 *    - Remove obsolete elements to maintain useful candidates
 *    - Amortized O(1) per element due to single add/remove
 * 
 * 7. **Interview Strategy**:
 *    - Start with brute force explanation
 *    - Identify inefficiency (recalculating max)
 *    - Introduce deque for efficient tracking
 *    - Explain deque invariants clearly
 * 
 * 8. **Edge Cases**:
 *    - k = 1 (each element is its own window)
 *    - k = n (entire array is one window)
 *    - All elements equal
 *    - Strictly increasing/decreasing arrays
 * 
 * 9. **Common Mistakes**:
 *    - Storing values instead of indices in deque
 *    - Not removing out-of-window elements
 *    - Incorrect deque maintenance order
 *    - Off-by-one errors in window boundaries
 * 
 * 10. **Alternative Data Structures**:
 *     - Heap: Good but O(log k) operations
 *     - Segment Tree: Overkill for this problem
 *     - Sparse Table: Precomputation heavy
 *     - Balanced BST: Complex implementation
 * 
 * 11. **Big Tech Variations**:
 *     - Google: Sliding window minimum
 *     - Meta: Moving average/median
 *     - Amazon: K-th largest in sliding window
 *     - Microsoft: Sliding window with different metrics
 * 
 * 12. **Follow-up Questions**:
 *     - Find minimum in sliding window
 *     - K largest elements in sliding window
 *     - Sliding window median
 *     - Variable window size problems
 * 
 * 13. **Real-world Applications**:
 *     - Stock price analysis (moving maximum)
 *     - Network monitoring (peak traffic)
 *     - Signal processing (peak detection)
 *     - Game development (high score tracking)
 *     - System monitoring (resource usage peaks)
 * 
 * 14. **Optimization Tips**:
 *     - Use deque instead of custom queue
 *     - Store indices for boundary checking
 *     - Maintain invariants consistently
 *     - Consider amortized analysis for complexity
 */