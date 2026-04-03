/**
 * 215. Kth Largest Element in an Array
 * 
 * Given an integer array nums and an integer k, return the kth largest element in the array.
 * Note that it is the kth largest element in the sorted order, not the kth distinct element.
 * Can you solve it without sorting?
 * 
 * Example 1:
 * Input: nums = [3,2,1,5,6,4], k = 2
 * Output: 5
 * 
 * Example 2:
 * Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
 * Output: 4
 * 
 * Constraints:
 * - 1 <= k <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 * 
 * Follow up: Can you solve it in O(n) time complexity?
 */

// Solution 1: Min Heap (Priority Queue)
// Time: O(n log k), Space: O(k)
export function findKthLargest1(nums: number[], k: number): number {
    class MinHeap {
        heap: number[] = [];
        
        push(val: number): void {
            this.heap.push(val);
            this.heapifyUp(this.heap.length - 1);
        }
        
        pop(): number | undefined {
            if (this.heap.length === 0) return undefined;
            
            const min = this.heap[0];
            const last = this.heap.pop()!;
            
            if (this.heap.length > 0) {
                this.heap[0] = last;
                this.heapifyDown(0);
            }
            
            return min;
        }
        
        peek(): number | undefined {
            return this.heap.length > 0 ? this.heap[0] : undefined;
        }
        
        size(): number {
            return this.heap.length;
        }
        
        private heapifyUp(idx: number): void {
            while (idx > 0) {
                const parentIdx = Math.floor((idx - 1) / 2);
                if (this.heap[parentIdx] <= this.heap[idx]) break;
                
                [this.heap[parentIdx], this.heap[idx]] = [this.heap[idx], this.heap[parentIdx]];
                idx = parentIdx;
            }
        }
        
        private heapifyDown(idx: number): void {
            while (true) {
                let minIdx = idx;
                const leftChild = 2 * idx + 1;
                const rightChild = 2 * idx + 2;
                
                if (leftChild < this.heap.length && this.heap[leftChild] < this.heap[minIdx]) {
                    minIdx = leftChild;
                }
                
                if (rightChild < this.heap.length && this.heap[rightChild] < this.heap[minIdx]) {
                    minIdx = rightChild;
                }
                
                if (minIdx === idx) break;
                
                [this.heap[idx], this.heap[minIdx]] = [this.heap[minIdx], this.heap[idx]];
                idx = minIdx;
            }
        }
    }
    
    const minHeap = new MinHeap();
    
    for (const num of nums) {
        minHeap.push(num);
        
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    return minHeap.peek()!;
}

// Solution 2: Quick Select (Optimal)
// Time: O(n) average, O(n²) worst, Space: O(1)
export function findKthLargest2(nums: number[], k: number): number {
    const targetIndex = nums.length - k; // Convert to kth smallest
    
    function quickSelect(left: number, right: number): number {
        const pivotIndex = partition(left, right);
        
        if (pivotIndex === targetIndex) {
            return nums[pivotIndex];
        } else if (pivotIndex < targetIndex) {
            return quickSelect(pivotIndex + 1, right);
        } else {
            return quickSelect(left, pivotIndex - 1);
        }
    }
    
    function partition(left: number, right: number): number {
        // Choose random pivot to avoid worst case
        const randomIndex = left + Math.floor(Math.random() * (right - left + 1));
        [nums[randomIndex], nums[right]] = [nums[right], nums[randomIndex]];
        
        const pivot = nums[right];
        let i = left;
        
        for (let j = left; j < right; j++) {
            if (nums[j] <= pivot) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
                i++;
            }
        }
        
        [nums[i], nums[right]] = [nums[right], nums[i]];
        return i;
    }
    
    return quickSelect(0, nums.length - 1);
}

// Solution 3: Counting Sort (when range is limited)
// Time: O(n + range), Space: O(range)
export function findKthLargest3(nums: number[], k: number): number {
    // Find min and max values
    let min = Math.min(...nums);
    let max = Math.max(...nums);
    
    // Create count array
    const count = new Array(max - min + 1).fill(0);
    
    // Count frequencies
    for (const num of nums) {
        count[num - min]++;
    }
    
    // Find kth largest by counting from the end
    let remaining = k;
    for (let i = count.length - 1; i >= 0; i--) {
        remaining -= count[i];
        if (remaining <= 0) {
            return i + min;
        }
    }
    
    return -1; // Should never reach here
}

// Solution 4: Quick Select with 3-Way Partitioning
// Time: O(n) average, Space: O(1)
export function findKthLargest4(nums: number[], k: number): number {
    const targetIndex = nums.length - k;
    
    function quickSelect(left: number, right: number): number {
        if (left === right) return nums[left];
        
        const [lt, gt] = threeWayPartition(left, right);
        
        if (targetIndex >= left && targetIndex <= lt) {
            return nums[lt];
        } else if (targetIndex < lt) {
            return quickSelect(left, lt - 1);
        } else {
            return quickSelect(gt + 1, right);
        }
    }
    
    function threeWayPartition(left: number, right: number): [number, number] {
        // Choose random pivot
        const randomIndex = left + Math.floor(Math.random() * (right - left + 1));
        [nums[randomIndex], nums[left]] = [nums[left], nums[randomIndex]];
        
        const pivot = nums[left];
        let lt = left; // nums[left...lt-1] < pivot
        let i = left + 1; // nums[lt...i-1] = pivot
        let gt = right; // nums[gt+1...right] > pivot
        
        while (i <= gt) {
            if (nums[i] < pivot) {
                [nums[lt], nums[i]] = [nums[i], nums[lt]];
                lt++;
                i++;
            } else if (nums[i] > pivot) {
                [nums[i], nums[gt]] = [nums[gt], nums[i]];
                gt--;
            } else {
                i++;
            }
        }
        
        return [lt, gt];
    }
    
    return quickSelect(0, nums.length - 1);
}

// Solution 5: Sorting Approach
// Time: O(n log n), Space: O(1)
export function findKthLargest5(nums: number[], k: number): number {
    nums.sort((a, b) => b - a); // Sort in descending order
    return nums[k - 1];
}

// Solution 6: Median of Medians (Guaranteed O(n))
// Time: O(n), Space: O(log n)
export function findKthLargest6(nums: number[], k: number): number {
    const targetIndex = nums.length - k;
    
    function medianOfMedians(arr: number[], left: number, right: number): number {
        const n = right - left + 1;
        if (n <= 5) {
            // Sort small array and return median
            const subarray = arr.slice(left, right + 1).sort((a, b) => a - b);
            return subarray[Math.floor(subarray.length / 2)];
        }
        
        const medians: number[] = [];
        for (let i = left; i <= right; i += 5) {
            const subRight = Math.min(i + 4, right);
            const subarray = arr.slice(i, subRight + 1).sort((a, b) => a - b);
            medians.push(subarray[Math.floor(subarray.length / 2)]);
        }
        
        return medianOfMedians(medians, 0, medians.length - 1);
    }
    
    function quickSelect(left: number, right: number): number {
        if (left === right) return nums[left];
        
        // Find median of medians as pivot
        const pivotValue = medianOfMedians(nums, left, right);
        
        // Find pivot index
        let pivotIndex = left;
        for (let i = left; i <= right; i++) {
            if (nums[i] === pivotValue) {
                pivotIndex = i;
                break;
            }
        }
        
        // Partition around pivot
        const partitionIndex = partition(left, right, pivotIndex);
        
        if (partitionIndex === targetIndex) {
            return nums[partitionIndex];
        } else if (partitionIndex < targetIndex) {
            return quickSelect(partitionIndex + 1, right);
        } else {
            return quickSelect(left, partitionIndex - 1);
        }
    }
    
    function partition(left: number, right: number, pivotIndex: number): number {
        const pivotValue = nums[pivotIndex];
        [nums[pivotIndex], nums[right]] = [nums[right], nums[pivotIndex]];
        
        let storeIndex = left;
        for (let i = left; i < right; i++) {
            if (nums[i] <= pivotValue) {
                [nums[storeIndex], nums[i]] = [nums[i], nums[storeIndex]];
                storeIndex++;
            }
        }
        
        [nums[right], nums[storeIndex]] = [nums[storeIndex], nums[right]];
        return storeIndex;
    }
    
    return quickSelect(0, nums.length - 1);
}

// Test cases
export function testFindKthLargest() {
    console.log("Testing Kth Largest Element in Array:");
    
    const testCases = [
        {
            nums: [3, 2, 1, 5, 6, 4],
            k: 2,
            expected: 5
        },
        {
            nums: [3, 2, 3, 1, 2, 4, 5, 5, 6],
            k: 4,
            expected: 4
        },
        {
            nums: [1],
            k: 1,
            expected: 1
        },
        {
            nums: [1, 2],
            k: 1,
            expected: 2
        },
        {
            nums: [2, 1],
            k: 2,
            expected: 1
        },
        {
            nums: [7, 10, 4, 3, 20, 15],
            k: 3,
            expected: 10
        }
    ];
    
    const solutions = [
        { name: "Min Heap", fn: findKthLargest1 },
        { name: "Quick Select", fn: findKthLargest2 },
        { name: "Counting Sort", fn: findKthLargest3 },
        { name: "3-Way Partition", fn: findKthLargest4 },
        { name: "Sorting", fn: findKthLargest5 },
        { name: "Median of Medians", fn: findKthLargest6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            // Create copy since some algorithms modify the array
            const numsCopy = [...test.nums];
            const result = solution.fn(numsCopy, test.k);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: nums=${JSON.stringify(test.nums)}, k=${test.k}`);
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
 *    - Find kth largest element (not kth distinct)
 *    - Can solve without sorting in O(n) average time
 *    - Multiple approaches with different trade-offs
 * 
 * 2. **Heap Approach**:
 *    - Maintain min heap of size k
 *    - Root always contains kth largest element
 *    - Efficient when k << n
 * 
 * 3. **Quick Select Algorithm**:
 *    - Based on quicksort partitioning
 *    - Average O(n), worst case O(n²)
 *    - In-place algorithm with O(1) space
 * 
 * 4. **Index Transformation**:
 *    - Kth largest = (n-k)th smallest
 *    - Allows using ascending order algorithms
 *    - Critical for quickselect implementation
 * 
 * 5. **Time Complexity Comparison**:
 *    - Sorting: O(n log n) - straightforward
 *    - Min Heap: O(n log k) - good when k is small
 *    - Quick Select: O(n) average - optimal for general case
 *    - Counting Sort: O(n + range) - best for limited range
 * 
 * 6. **Space Complexity**:
 *    - Heap: O(k) - proportional to k
 *    - Quick Select: O(1) - in-place
 *    - Counting Sort: O(range) - depends on value range
 * 
 * 7. **Quick Select Optimizations**:
 *    - Random pivot selection to avoid worst case
 *    - 3-way partitioning for duplicate elements
 *    - Median-of-medians for guaranteed O(n)
 * 
 * 8. **Interview Strategy**:
 *    - Start with sorting approach (simple)
 *    - Progress to heap solution (when k << n)
 *    - Implement quickselect for optimal solution
 *    - Discuss trade-offs between approaches
 * 
 * 9. **Edge Cases**:
 *    - k = 1 (largest element)
 *    - k = n (smallest element)
 *    - Array with duplicates
 *    - Single element array
 * 
 * 10. **Common Mistakes**:
 *     - Confusing kth largest vs kth smallest
 *     - Wrong index calculation in quickselect
 *     - Not handling duplicates properly
 *     - Modifying input array when not allowed
 * 
 * 11. **Pivot Selection Strategies**:
 *     - Random pivot: Simple, good average case
 *     - Median-of-three: Better than first/last
 *     - Median-of-medians: Guaranteed O(n)
 * 
 * 12. **When to Use Each Approach**:
 *     - k << n: Min heap
 *     - General case: Quick select
 *     - Limited range: Counting sort
 *     - Need stable/simple: Sorting
 * 
 * 13. **Big Tech Variations**:
 *     - Google: Kth largest in stream
 *     - Meta: Kth largest in multiple arrays
 *     - Amazon: Top k frequent elements
 *     - Microsoft: Kth smallest in matrix
 * 
 * 14. **Follow-up Questions**:
 *     - Find k largest elements (not just kth)
 *     - Handle stream of numbers
 *     - Memory-constrained environments
 *     - Parallel/distributed scenarios
 * 
 * 15. **Real-world Applications**:
 *     - Database query optimization
 *     - Statistics and data analysis
 *     - Gaming leaderboards
 *     - Resource allocation systems
 *     - Performance monitoring
 * 
 * 16. **Pattern Recognition**:
 *     - Selection problem pattern
 *     - Divide and conquer optimization
 *     - Heap for top-k problems
 *     - Partitioning for order statistics
 */