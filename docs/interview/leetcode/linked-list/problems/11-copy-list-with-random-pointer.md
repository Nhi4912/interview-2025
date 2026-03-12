---
layout: page
title: "Copy List with Random Pointer"
difficulty: Easy
category: Linked List
tags: [Linked List, Hash Table]
leetcode_url: "https://leetcode.com/problems/copy-list-with-random-pointer/"
---

# Copy List with Random Pointer

**LeetCode Problem # * 138. Copy List with Random Pointer**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 138. Copy List with Random Pointer
 * 
 * A linked list of length n is given such that each node contains an additional random pointer, 
 * which could point to any node in the list, or null.
 * 
 * Construct a deep copy of the list. The deep copy should consist of exactly n new nodes, 
 * where each new node has its value set to the value of its corresponding original node. 
 * Both the next and random pointers of the new nodes should point to new nodes in the copied list 
 * such that the pointers in the original list and copied list represent the same list state. 
 * None of the pointers in the new list should point to nodes in the original list.
 * 
 * For example, if there are two nodes X and Y in the original list, where X.random --> Y, 
 * then for the corresponding two nodes x and y in the copied list, x.random --> y.
 * 
 * Return the head of the copied list.
 * 
 * The linked list is represented in the input/output as a list of n nodes. Each node is 
 * represented as a pair of [val, random_index] where:
 * - val: an integer representing Node.val
 * - random_index: the index of the node (range from 0 to n-1) that the random pointer points to, 
 *   or null if it does not point to any node.
 * 
 * Your code will only be given the head of the original linked list.
 * 
 * Example 1:
 * Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
 * Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
 * 
 * Example 2:
 * Input: head = [[1,1],[2,1]]
 * Output: [[1,1],[2,1]]
 * 
 * Example 3:
 * Input: head = [[3,null],[3,0],[3,null]]
 * Output: [[3,null],[3,0],[3,null]]
 * 
 * Constraints:
 * - 0 <= n <= 1000
 * - -10^4 <= Node.val <= 10^4
 * - Node.random is null or is pointing to some node in the linked list.
 */

// Definition for a Node with random pointer
class RandomListNode {
    val: number;
    next: RandomListNode | null;
    random: RandomListNode | null;
    
    constructor(val?: number, next?: RandomListNode | null, random?: RandomListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
        this.random = (random === undefined ? null : random);
    }
}

// Solution 1: HashMap Two-Pass
// Time: O(n), Space: O(n)
export function copyRandomList1(head: RandomListNode | null): RandomListNode | null {
    if (!head) return null;
    
    const nodeMap = new Map<RandomListNode, RandomListNode>();
    
    // First pass: create all nodes and store mapping
    let current = head;
    while (current) {
        nodeMap.set(current, new RandomListNode(current.val));
        current = current.next;
    }
    
    // Second pass: connect next and random pointers
    current = head;
    while (current) {
        const copiedNode = nodeMap.get(current)!;
        copiedNode.next = current.next ? nodeMap.get(current.next)! : null;
        copiedNode.random = current.random ? nodeMap.get(current.random)! : null;
        current = current.next;
    }
    
    return nodeMap.get(head)!;
}

// Solution 2: Recursive with Memoization
// Time: O(n), Space: O(n)
export function copyRandomList2(head: RandomListNode | null): RandomListNode | null {
    const nodeMap = new Map<RandomListNode, RandomListNode>();
    
    function copyNode(node: RandomListNode | null): RandomListNode | null {
        if (!node) return null;
        
        // If already copied, return the copy
        if (nodeMap.has(node)) {
            return nodeMap.get(node)!;
        }
        
        // Create new node
        const newNode = new RandomListNode(node.val);
        nodeMap.set(node, newNode);
        
        // Recursively copy next and random
        newNode.next = copyNode(node.next);
        newNode.random = copyNode(node.random);
        
        return newNode;
    }
    
    return copyNode(head);
}

// Solution 3: Interweaving Approach (O(1) Space)
// Time: O(n), Space: O(1)
export function copyRandomList3(head: RandomListNode | null): RandomListNode | null {
    if (!head) return null;
    
    // Step 1: Create copied nodes and interweave them
    let current = head;
    while (current) {
        const copiedNode = new RandomListNode(current.val);
        copiedNode.next = current.next;
        current.next = copiedNode;
        current = copiedNode.next;
    }
    
    // Step 2: Set random pointers for copied nodes
    current = head;
    while (current) {
        if (current.random) {
            current.next!.random = current.random.next;
        }
        current = current.next!.next;
    }
    
    // Step 3: Separate the two lists
    const dummy = new RandomListNode(0);
    let copiedCurrent = dummy;
    current = head;
    
    while (current) {
        const copiedNode = current.next!;
        current.next = copiedNode.next;
        copiedCurrent.next = copiedNode;
        copiedCurrent = copiedNode;
        current = current.next;
    }
    
    return dummy.next;
}

// Solution 4: DFS with Stack
// Time: O(n), Space: O(n)
export function copyRandomList4(head: RandomListNode | null): RandomListNode | null {
    if (!head) return null;
    
    const nodeMap = new Map<RandomListNode, RandomListNode>();
    const stack: RandomListNode[] = [head];
    const visited = new Set<RandomListNode>();
    
    // Create all nodes using DFS
    while (stack.length > 0) {
        const node = stack.pop()!;
        
        if (visited.has(node)) continue;
        visited.add(node);
        
        // Create copied node if not exists
        if (!nodeMap.has(node)) {
            nodeMap.set(node, new RandomListNode(node.val));
        }
        
        // Add next and random to stack for processing
        if (node.next && !visited.has(node.next)) {
            stack.push(node.next);
        }
        if (node.random && !visited.has(node.random)) {
            stack.push(node.random);
        }
    }
    
    // Connect pointers
    for (const [original, copied] of nodeMap) {
        copied.next = original.next ? nodeMap.get(original.next)! : null;
        copied.random = original.random ? nodeMap.get(original.random)! : null;
    }
    
    return nodeMap.get(head)!;
}

// Solution 5: BFS with Queue
// Time: O(n), Space: O(n)
export function copyRandomList5(head: RandomListNode | null): RandomListNode | null {
    if (!head) return null;
    
    const nodeMap = new Map<RandomListNode, RandomListNode>();
    const queue: RandomListNode[] = [head];
    const visited = new Set<RandomListNode>();
    
    // BFS to create all nodes
    while (queue.length > 0) {
        const node = queue.shift()!;
        
        if (visited.has(node)) continue;
        visited.add(node);
        
        // Create copied node
        if (!nodeMap.has(node)) {
            nodeMap.set(node, new RandomListNode(node.val));
        }
        
        // Add neighbors to queue
        if (node.next && !visited.has(node.next)) {
            queue.push(node.next);
        }
        if (node.random && !visited.has(node.random)) {
            queue.push(node.random);
        }
    }
    
    // Connect all pointers
    for (const [original, copied] of nodeMap) {
        copied.next = original.next ? nodeMap.get(original.next)! : null;
        copied.random = original.random ? nodeMap.get(original.random)! : null;
    }
    
    return nodeMap.get(head)!;
}

// Solution 6: Index-Based Approach
// Time: O(n), Space: O(n)
export function copyRandomList6(head: RandomListNode | null): RandomListNode | null {
    if (!head) return null;
    
    // Step 1: Create array of original nodes and index mapping
    const nodes: RandomListNode[] = [];
    const indexMap = new Map<RandomListNode, number>();
    
    let current = head;
    let index = 0;
    
    while (current) {
        nodes.push(current);
        indexMap.set(current, index);
        current = current.next;
        index++;
    }
    
    // Step 2: Create copied nodes
    const copiedNodes: RandomListNode[] = nodes.map(node => new RandomListNode(node.val));
    
    // Step 3: Connect pointers using indices
    for (let i = 0; i < nodes.length; i++) {
        const originalNode = nodes[i];
        const copiedNode = copiedNodes[i];
        
        // Connect next pointer
        if (originalNode.next) {
            const nextIndex = indexMap.get(originalNode.next)!;
            copiedNode.next = copiedNodes[nextIndex];
        }
        
        // Connect random pointer
        if (originalNode.random) {
            const randomIndex = indexMap.get(originalNode.random)!;
            copiedNode.random = copiedNodes[randomIndex];
        }
    }
    
    return copiedNodes[0];
}

// Helper functions for testing
function createRandomList(values: Array<[number, number | null]>): RandomListNode | null {
    if (values.length === 0) return null;
    
    const nodes: RandomListNode[] = [];
    
    // Create all nodes
    for (const [val] of values) {
        nodes.push(new RandomListNode(val));
    }
    
    // Connect next pointers
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }
    
    // Connect random pointers
    for (let i = 0; i < values.length; i++) {
        const [, randomIndex] = values[i];
        if (randomIndex !== null) {
            nodes[i].random = nodes[randomIndex];
        }
    }
    
    return nodes[0];
}

function listToArray(head: RandomListNode | null): Array<[number, number | null]> {
    if (!head) return [];
    
    const result: Array<[number, number | null]> = [];
    const nodeToIndex = new Map<RandomListNode, number>();
    
    // First pass: create index mapping
    let current = head;
    let index = 0;
    while (current) {
        nodeToIndex.set(current, index);
        current = current.next;
        index++;
    }
    
    // Second pass: build result array
    current = head;
    while (current) {
        const randomIndex = current.random ? nodeToIndex.get(current.random)! : null;
        result.push([current.val, randomIndex]);
        current = current.next;
    }
    
    return result;
}

// Test cases
export function testCopyRandomList() {
    console.log("Testing Copy List with Random Pointer:");
    
    const testCases = [
        {
            input: [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]] as Array<[number, number | null]>,
            description: "Complex random pointers"
        },
        {
            input: [[1, 1], [2, 1]] as Array<[number, number | null]>,
            description: "Simple random pointers"
        },
        {
            input: [[3, null], [3, 0], [3, null]] as Array<[number, number | null]>,
            description: "Mixed random pointers"
        },
        {
            input: [] as Array<[number, number | null]>,
            description: "Empty list"
        },
        {
            input: [[1, null]] as Array<[number, number | null]>,
            description: "Single node"
        }
    ];
    
    const solutions = [
        { name: "HashMap Two-Pass", fn: copyRandomList1 },
        { name: "Recursive Memoization", fn: copyRandomList2 },
        { name: "Interweaving O(1)", fn: copyRandomList3 },
        { name: "DFS with Stack", fn: copyRandomList4 },
        { name: "BFS with Queue", fn: copyRandomList5 },
        { name: "Index-Based", fn: copyRandomList6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const originalList = createRandomList(test.input);
            const copiedList = solution.fn(originalList);
            const result = listToArray(copiedList);
            
            const passed = JSON.stringify(result) === JSON.stringify(test.input);
            console.log(`  Test ${i + 1} (${test.description}): ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Expected: ${JSON.stringify(test.input)}`);
                console.log(`    Got: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Deep Copy Challenge**:
 *    - Must create entirely new nodes
 *    - Original and copied lists should be independent
 *    - Both next and random pointers need correct mapping
 * 
 * 2. **Random Pointer Complexity**:
 *    - Random pointers can create cycles
 *    - May point to nodes not yet processed
 *    - Requires mapping between original and copied nodes
 * 
 * 3. **Two-Phase Approach**:
 *    - Phase 1: Create all nodes and establish mapping
 *    - Phase 2: Connect next and random pointers
 *    - Ensures all target nodes exist before linking
 * 
 * 4. **HashMap Solution**:
 *    - Maps original nodes to copied nodes
 *    - Enables O(1) lookup for pointer assignment
 *    - Most intuitive and commonly used approach
 * 
 * 5. **Interweaving Optimization**:
 *    - Achieves O(1) space complexity
 *    - Temporarily modifies original list structure
 *    - Clever technique but more complex implementation
 * 
 * 6. **Time Complexity**: O(n)
 *    - Must visit each node at least once
 *    - HashMap operations are O(1) on average
 *    - Cannot be optimized further
 * 
 * 7. **Space Complexity**:
 *    - HashMap approach: O(n) for node mapping
 *    - Interweaving approach: O(1) extra space
 *    - Recursive: O(n) for call stack
 * 
 * 8. **Interview Strategy**:
 *    - Start with HashMap two-pass approach
 *    - Explain the need for node mapping
 *    - Consider space optimization with interweaving
 *    - Discuss recursive alternative
 * 
 * 9. **Edge Cases**:
 *    - Empty list (null head)
 *    - Single node with self-reference
 *    - Cycles in random pointers
 *    - All random pointers null
 * 
 * 10. **Common Mistakes**:
 *     - Creating nodes multiple times
 *     - Not handling null random pointers
 *     - Circular references in random pointers
 *     - Forgetting to restore original list in interweaving
 * 
 * 11. **Graph Perspective**:
 *     - Can view as graph copying problem
 *     - Nodes are vertices, pointers are edges
 *     - DFS/BFS traversal strategies applicable
 * 
 * 12. **Memory Management**:
 *     - Deep copy ensures independence
 *     - Original list remains unchanged
 *     - Proper cleanup in interweaving approach
 * 
 * 13. **Big Tech Variations**:
 *     - Google: Multi-threaded deep copy
 *     - Meta: Copy with additional pointer types
 *     - Amazon: Memory-constrained copying
 *     - Microsoft: Streaming copy for large lists
 * 
 * 14. **Follow-up Questions**:
 *     - Copy list with multiple random pointers
 *     - Handle very large lists (external memory)
 *     - Thread-safe copying
 *     - Copy with lazy evaluation
 * 
 * 15. **Real-world Applications**:
 *     - Object serialization/deserialization
 *     - Memory management in VMs
 *     - Data structure persistence
 *     - Undo/redo functionality
 *     - Database replication
 * 
 * 16. **Pattern Recognition**:
 *     - Classic graph traversal problem
 *     - Node mapping for pointer redirection
 *     - Two-phase construction pattern
 *     - Space-time trade-off considerations
 */
{% endraw %}
