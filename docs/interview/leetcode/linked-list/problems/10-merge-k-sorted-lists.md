---
layout: page
title: "Merge k Sorted List"
difficulty: Hard
category: Linked List
tags: [Linked List, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/merge-k-sorted-list/"
---

# Merge k Sorted List

**LeetCode Problem # * 23. Merge k Sorted Lists**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 23. Merge k Sorted Lists
 * 
 * You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.
 * Merge all the linked-lists into one sorted linked-list and return it.
 * 
 * Example 1:
 * Input: lists = [[1,4,5],[1,3,4],[2,6]]
 * Output: [1,1,2,3,4,4,5,6]
 * Explanation: The linked-lists are:
 * [
 *   1->4->5,
 *   1->3->4,
 *   2->6
 * ]
 * merging them into one sorted list:
 * 1->1->2->3->4->4->5->6
 * 
 * Example 2:
 * Input: lists = []
 * Output: []
 * 
 * Example 3:
 * Input: lists = [[]]
 * Output: []
 * 
 * Constraints:
 * - k == lists.length
 * - 0 <= k <= 10^4
 * - 0 <= lists[i].length <= 500
 * - -10^4 <= lists[i][j] <= 10^4
 * - lists[i] is sorted in ascending order.
 * - The sum of lists[i].length will not exceed 10^4.
 */

// Definition for singly-linked list
class ListNode {
    val: number;
    next: ListNode | null;
    
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

// Solution 1: Brute Force (Collect all values and sort)
// Time: O(N log N), Space: O(N)
export function mergeKLists1(lists: Array<ListNode | null>): ListNode | null {
    const values: number[] = [];
    
    // Collect all values
    for (const head of lists) {
        let current = head;
        while (current) {
            values.push(current.val);
            current = current.next;
        }
    }
    
    // Sort values
    values.sort((a, b) => a - b);
    
    // Build result list
    const dummy = new ListNode(0);
    let current = dummy;
    
    for (const val of values) {
        current.next = new ListNode(val);
        current = current.next;
    }
    
    return dummy.next;
}

// Solution 2: Compare One by One
// Time: O(k×N), Space: O(1)
export function mergeKLists2(lists: Array<ListNode | null>): ListNode | null {
    if (lists.length === 0) return null;
    
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (true) {
        let minIndex = -1;
        let minValue = Infinity;
        
        // Find the list with minimum head value
        for (let i = 0; i < lists.length; i++) {
            if (lists[i] && lists[i]!.val < minValue) {
                minValue = lists[i]!.val;
                minIndex = i;
            }
        }
        
        // No more nodes to process
        if (minIndex === -1) break;
        
        // Add the minimum node to result
        current.next = lists[minIndex];
        current = current.next!;
        lists[minIndex] = lists[minIndex]!.next;
    }
    
    return dummy.next;
}

// Solution 3: Divide and Conquer
// Time: O(N log k), Space: O(log k)
export function mergeKLists3(lists: Array<ListNode | null>): ListNode | null {
    if (lists.length === 0) return null;
    
    while (lists.length > 1) {
        const mergedLists: Array<ListNode | null> = [];
        
        // Merge pairs of lists
        for (let i = 0; i < lists.length; i += 2) {
            const list1 = lists[i];
            const list2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(list1, list2));
        }
        
        lists = mergedLists;
    }
    
    return lists[0];
    
    function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
        const dummy = new ListNode(0);
        let current = dummy;
        
        while (l1 && l2) {
            if (l1.val <= l2.val) {
                current.next = l1;
                l1 = l1.next;
            } else {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }
        
        // Attach remaining nodes
        current.next = l1 || l2;
        
        return dummy.next;
    }
}

// Solution 4: Priority Queue (Min Heap)
// Time: O(N log k), Space: O(k)
export function mergeKLists4(lists: Array<ListNode | null>): ListNode | null {
    class MinHeap {
        heap: ListNode[] = [];
        
        push(node: ListNode): void {
            this.heap.push(node);
            this.heapifyUp(this.heap.length - 1);
        }
        
        pop(): ListNode | undefined {
            if (this.heap.length === 0) return undefined;
            
            const min = this.heap[0];
            const last = this.heap.pop()!;
            
            if (this.heap.length > 0) {
                this.heap[0] = last;
                this.heapifyDown(0);
            }
            
            return min;
        }
        
        isEmpty(): boolean {
            return this.heap.length === 0;
        }
        
        private heapifyUp(idx: number): void {
            while (idx > 0) {
                const parentIdx = Math.floor((idx - 1) / 2);
                if (this.heap[parentIdx].val <= this.heap[idx].val) break;
                
                [this.heap[parentIdx], this.heap[idx]] = [this.heap[idx], this.heap[parentIdx]];
                idx = parentIdx;
            }
        }
        
        private heapifyDown(idx: number): void {
            while (true) {
                let minIdx = idx;
                const leftChild = 2 * idx + 1;
                const rightChild = 2 * idx + 2;
                
                if (leftChild < this.heap.length && this.heap[leftChild].val < this.heap[minIdx].val) {
                    minIdx = leftChild;
                }
                
                if (rightChild < this.heap.length && this.heap[rightChild].val < this.heap[minIdx].val) {
                    minIdx = rightChild;
                }
                
                if (minIdx === idx) break;
                
                [this.heap[idx], this.heap[minIdx]] = [this.heap[minIdx], this.heap[idx]];
                idx = minIdx;
            }
        }
    }
    
    const heap = new MinHeap();
    
    // Add first node of each list to heap
    for (const head of lists) {
        if (head) {
            heap.push(head);
        }
    }
    
    const dummy = new ListNode(0);
    let current = dummy;
    
    // Process nodes from heap
    while (!heap.isEmpty()) {
        const node = heap.pop()!;
        current.next = node;
        current = current.next;
        
        // Add next node from same list
        if (node.next) {
            heap.push(node.next);
        }
    }
    
    return dummy.next;
}

// Solution 5: Iterative Pairwise Merging
// Time: O(N log k), Space: O(1)
export function mergeKLists5(lists: Array<ListNode | null>): ListNode | null {
    if (lists.length === 0) return null;
    
    let interval = 1;
    
    while (interval < lists.length) {
        for (let i = 0; i < lists.length - interval; i += interval * 2) {
            lists[i] = mergeTwoLists(lists[i], lists[i + interval]);
        }
        interval *= 2;
    }
    
    return lists[0];
    
    function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
        const dummy = new ListNode(0);
        let current = dummy;
        
        while (l1 && l2) {
            if (l1.val <= l2.val) {
                current.next = l1;
                l1 = l1.next;
            } else {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }
        
        current.next = l1 || l2;
        return dummy.next;
    }
}

// Solution 6: Recursive Divide and Conquer
// Time: O(N log k), Space: O(log k)
export function mergeKLists6(lists: Array<ListNode | null>): ListNode | null {
    if (lists.length === 0) return null;
    
    return mergeHelper(lists, 0, lists.length - 1);
    
    function mergeHelper(lists: Array<ListNode | null>, start: number, end: number): ListNode | null {
        if (start === end) return lists[start];
        if (start > end) return null;
        
        const mid = Math.floor((start + end) / 2);
        const left = mergeHelper(lists, start, mid);
        const right = mergeHelper(lists, mid + 1, end);
        
        return mergeTwoLists(left, right);
    }
    
    function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
        if (!l1) return l2;
        if (!l2) return l1;
        
        if (l1.val <= l2.val) {
            l1.next = mergeTwoLists(l1.next, l2);
            return l1;
        } else {
            l2.next = mergeTwoLists(l1, l2.next);
            return l2;
        }
    }
}

// Helper functions for testing
function createList(values: number[]): ListNode | null {
    if (values.length === 0) return null;
    
    const dummy = new ListNode(0);
    let current = dummy;
    
    for (const val of values) {
        current.next = new ListNode(val);
        current = current.next;
    }
    
    return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    let current = head;
    
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    
    return result;
}

// Test cases
export function testMergeKLists() {
    console.log("Testing Merge k Sorted Lists:");
    
    const testCases = [
        {
            input: [[1, 4, 5], [1, 3, 4], [2, 6]],
            expected: [1, 1, 2, 3, 4, 4, 5, 6]
        },
        {
            input: [],
            expected: []
        },
        {
            input: [[]],
            expected: []
        },
        {
            input: [[1], [2], [3]],
            expected: [1, 2, 3]
        },
        {
            input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            expected: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        },
        {
            input: [[-1, 1], [-2, 2], [-3, 3]],
            expected: [-3, -2, -1, 1, 2, 3]
        }
    ];
    
    const solutions = [
        { name: "Brute Force", fn: mergeKLists1 },
        { name: "Compare One by One", fn: mergeKLists2 },
        { name: "Divide and Conquer", fn: mergeKLists3 },
        { name: "Priority Queue", fn: mergeKLists4 },
        { name: "Iterative Pairwise", fn: mergeKLists5 },
        { name: "Recursive D&C", fn: mergeKLists6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            // Convert input arrays to linked lists
            const lists = test.input.map(arr => createList(arr));
            const result = solution.fn(lists);
            const resultArray = listToArray(result);
            
            const passed = JSON.stringify(resultArray) === JSON.stringify(test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: ${JSON.stringify(test.input)}`);
                console.log(`    Expected: ${JSON.stringify(test.expected)}`);
                console.log(`    Got: ${JSON.stringify(resultArray)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Analysis**:
 *    - Merge k sorted linked lists into one sorted list
 *    - Each individual list is already sorted
 *    - Need to maintain overall sorted order
 * 
 * 2. **Approach Comparison**:
 *    - Brute Force: Collect all, sort, rebuild - O(N log N)
 *    - One by One: Compare heads repeatedly - O(k×N)
 *    - Divide & Conquer: Binary merge approach - O(N log k)
 *    - Priority Queue: Always pick minimum - O(N log k)
 * 
 * 3. **Optimal Complexity**: O(N log k)
 *    - N = total number of nodes across all lists
 *    - k = number of lists
 *    - Achieved by divide & conquer or priority queue
 * 
 * 4. **Divide and Conquer Strategy**:
 *    - Pair up lists and merge them
 *    - Reduce k lists to k/2, then k/4, etc.
 *    - Log k levels of merging
 * 
 * 5. **Priority Queue Benefits**:
 *    - Always process minimum element next
 *    - Maintains O(log k) insertion/deletion
 *    - Natural fit for the problem structure
 * 
 * 6. **Space Complexity Considerations**:
 *    - Brute Force: O(N) for collecting values
 *    - Priority Queue: O(k) for heap storage
 *    - Divide & Conquer: O(log k) for recursion stack
 *    - Iterative: O(1) space complexity
 * 
 * 7. **Interview Strategy**:
 *    - Start with brute force explanation
 *    - Progress to one-by-one comparison
 *    - Introduce divide and conquer optimization
 *    - Discuss priority queue as alternative
 * 
 * 8. **Edge Cases**:
 *    - Empty input array
 *    - Array with empty lists
 *    - Single list
 *    - Lists of different lengths
 * 
 * 9. **Implementation Details**:
 *    - Dummy node for easier list building
 *    - Proper handling of remaining nodes
 *    - Careful index management in divide & conquer
 * 
 * 10. **Common Mistakes**:
 *     - Not handling null lists properly
 *     - Incorrect merge logic for two lists
 *     - Off-by-one errors in divide & conquer
 *     - Memory leaks in recursive solutions
 * 
 * 11. **Optimization Techniques**:
 *     - In-place merging to save space
 *     - Iterative vs recursive implementations
 *     - Priority queue vs manual comparison
 * 
 * 12. **Big Tech Variations**:
 *     - Google: Merge with custom comparators
 *     - Meta: External sorting for large datasets
 *     - Amazon: Distributed merge scenarios
 *     - Microsoft: Memory-constrained merging
 * 
 * 13. **Follow-up Questions**:
 *     - Handle very large k (external memory)
 *     - Merge in reverse order
 *     - Find kth smallest across all lists
 *     - Streaming merge with unknown list lengths
 * 
 * 14. **Real-world Applications**:
 *     - Database query result merging
 *     - Log file aggregation
 *     - Distributed system data consolidation
 *     - External sorting algorithms
 *     - Multi-way merge in MapReduce
 * 
 * 15. **Pattern Recognition**:
 *     - Classic divide and conquer problem
 *     - Priority queue for multiple streams
 *     - Two-pointer technique for merging
 *     - Reduction problem (k → 1)
 * 
 * 16. **Performance Considerations**:
 *     - Cache locality in array access
 *     - Memory allocation patterns
 *     - Function call overhead
 *     - Early termination opportunities
 */
{% endraw %}
