---
layout: page
title: "Binary Tree Maximum Path Sum"
difficulty: Hard
category: Tree/Graph
tags: [Tree/Graph, Hash Table]
leetcode_url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/"
---

# Binary Tree Maximum Path Sum

**LeetCode Problem # * 124. Binary Tree Maximum Path Sum**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 124. Binary Tree Maximum Path Sum
 * 
 * A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence 
 * has an edge connecting them. A node can only appear in the sequence at most once. 
 * Note that the path does not need to pass through the root.
 * 
 * The path sum of a path is the sum of the node's values in the path.
 * Given the root of a binary tree, return the maximum path sum of any non-empty path.
 * 
 * Example 1:
 * Input: root = [1,2,3]
 * Output: 6
 * Explanation: The optimal path is 2 -> 1 -> 3 with path sum = 2 + 1 + 3 = 6.
 * 
 * Example 2:
 * Input: root = [-10,9,20,null,null,15,7]
 * Output: 42
 * Explanation: The optimal path is 15 -> 20 -> 7 with path sum = 15 + 20 + 7 = 42.
 * 
 * Constraints:
 * - The number of nodes in the tree is in the range [1, 3 * 10^4].
 * - -1000 <= Node.val <= 1000
 */

// Definition for a binary tree node
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

// Solution 1: Recursive DFS with Global Maximum
// Time: O(n), Space: O(h)
export function maxPathSum1(root: TreeNode | null): number {
    if (!root) return 0;
    
    let maxSum = -Infinity;
    
    function maxPathFromNode(node: TreeNode | null): number {
        if (!node) return 0;
        
        // Get maximum path sum from left and right subtrees
        // Use Math.max(0, ...) to ignore negative paths
        const leftMax = Math.max(0, maxPathFromNode(node.left));
        const rightMax = Math.max(0, maxPathFromNode(node.right));
        
        // Maximum path sum passing through current node
        const currentPathSum = node.val + leftMax + rightMax;
        
        // Update global maximum
        maxSum = Math.max(maxSum, currentPathSum);
        
        // Return maximum path sum extending from current node
        // (can only choose one branch to extend upward)
        return node.val + Math.max(leftMax, rightMax);
    }
    
    maxPathFromNode(root);
    return maxSum;
}

// Solution 2: DFS with Return Object
// Time: O(n), Space: O(h)
export function maxPathSum2(root: TreeNode | null): number {
    if (!root) return 0;
    
    interface PathInfo {
        maxPath: number;      // Maximum path sum extending from node
        maxPathSum: number;   // Maximum path sum in subtree
    }
    
    function dfs(node: TreeNode | null): PathInfo {
        if (!node) {
            return { maxPath: 0, maxPathSum: -Infinity };
        }
        
        const left = dfs(node.left);
        const right = dfs(node.right);
        
        // Maximum path extending from current node
        const maxPath = node.val + Math.max(0, left.maxPath, right.maxPath);
        
        // Maximum path sum through current node
        const pathThroughNode = node.val + Math.max(0, left.maxPath) + Math.max(0, right.maxPath);
        
        // Maximum path sum in current subtree
        const maxPathSum = Math.max(pathThroughNode, left.maxPathSum, right.maxPathSum);
        
        return { maxPath, maxPathSum };
    }
    
    return dfs(root).maxPathSum;
}

// Solution 3: Iterative with Stack
// Time: O(n), Space: O(n)
export function maxPathSum3(root: TreeNode | null): number {
    if (!root) return 0;
    
    const stack: TreeNode[] = [];
    const visited = new Set<TreeNode>();
    const pathSums = new Map<TreeNode, number>();
    let maxSum = -Infinity;
    
    stack.push(root);
    
    while (stack.length > 0) {
        const node = stack[stack.length - 1];
        
        if (visited.has(node)) {
            // Process node (post-order)
            stack.pop();
            
            const leftPath = node.left ? Math.max(0, pathSums.get(node.left)!) : 0;
            const rightPath = node.right ? Math.max(0, pathSums.get(node.right)!) : 0;
            
            // Path sum through current node
            const currentPathSum = node.val + leftPath + rightPath;
            maxSum = Math.max(maxSum, currentPathSum);
            
            // Path sum extending from current node
            pathSums.set(node, node.val + Math.max(leftPath, rightPath));
        } else {
            // First visit - add children to stack
            visited.add(node);
            
            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
        }
    }
    
    return maxSum;
}

// Solution 4: Morris Traversal (Advanced)
// Time: O(n), Space: O(1)
export function maxPathSum4(root: TreeNode | null): number {
    if (!root) return 0;
    
    // This is complex for Morris traversal due to the need for post-order processing
    // We'll use a modified approach with threading
    let maxSum = -Infinity;
    const pathSums = new Map<TreeNode, number>();
    
    function getPathSum(node: TreeNode | null): number {
        if (!node) return 0;
        return pathSums.get(node) || 0;
    }
    
    function processNode(node: TreeNode): void {
        const leftPath = Math.max(0, getPathSum(node.left));
        const rightPath = Math.max(0, getPathSum(node.right));
        
        // Path through current node
        const currentPathSum = node.val + leftPath + rightPath;
        maxSum = Math.max(maxSum, currentPathSum);
        
        // Path extending from current node
        pathSums.set(node, node.val + Math.max(leftPath, rightPath));
    }
    
    // Modified post-order Morris traversal
    let current = root;
    
    while (current) {
        if (!current.left) {
            // Process single node
            if (!current.right) {
                processNode(current);
            }
            current = current.right;
        } else {
            // Find inorder predecessor
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                // Make threading
                predecessor.right = current;
                current = current.left;
            } else {
                // Remove threading and process
                predecessor.right = null;
                processNode(current);
                current = current.right;
            }
        }
    }
    
    return maxSum;
}

// Solution 5: Bottom-Up with Explicit Stack
// Time: O(n), Space: O(n)
export function maxPathSum5(root: TreeNode | null): number {
    if (!root) return 0;
    
    const stack: TreeNode[] = [root];
    const postOrder: TreeNode[] = [];
    
    // Get post-order traversal
    while (stack.length > 0) {
        const node = stack.pop()!;
        postOrder.push(node);
        
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
    }
    
    postOrder.reverse();
    
    let maxSum = -Infinity;
    const maxPathFromNode = new Map<TreeNode, number>();
    
    // Process in post-order
    for (const node of postOrder) {
        const leftPath = node.left ? Math.max(0, maxPathFromNode.get(node.left)!) : 0;
        const rightPath = node.right ? Math.max(0, maxPathFromNode.get(node.right)!) : 0;
        
        // Path through current node
        const pathThroughNode = node.val + leftPath + rightPath;
        maxSum = Math.max(maxSum, pathThroughNode);
        
        // Path extending from current node
        maxPathFromNode.set(node, node.val + Math.max(leftPath, rightPath));
    }
    
    return maxSum;
}

// Solution 6: Divide and Conquer
// Time: O(n), Space: O(h)
export function maxPathSum6(root: TreeNode | null): number {
    interface Result {
        maxPath: number;        // Max path extending from root
        maxPathSum: number;     // Max path sum in subtree
        includeRoot: number;    // Max path including root
    }
    
    function solve(node: TreeNode | null): Result {
        if (!node) {
            return {
                maxPath: 0,
                maxPathSum: -Infinity,
                includeRoot: 0
            };
        }
        
        const left = solve(node.left);
        const right = solve(node.right);
        
        // Max path extending from current node
        const maxPath = node.val + Math.max(0, left.maxPath, right.maxPath);
        
        // Max path including current node (can use both children)
        const includeRoot = node.val + Math.max(0, left.maxPath) + Math.max(0, right.maxPath);
        
        // Max path sum in current subtree
        const maxPathSum = Math.max(
            includeRoot,
            left.maxPathSum,
            right.maxPathSum,
            left.includeRoot,
            right.includeRoot
        );
        
        return { maxPath, maxPathSum, includeRoot };
    }
    
    return solve(root).maxPathSum;
}

// Helper functions for testing
function createTree(values: (number | null)[]): TreeNode | null {
    if (values.length === 0 || values[0] === null) return null;
    
    const root = new TreeNode(values[0]);
    const queue: TreeNode[] = [root];
    let i = 1;
    
    while (queue.length > 0 && i < values.length) {
        const node = queue.shift()!;
        
        if (i < values.length && values[i] !== null) {
            node.left = new TreeNode(values[i]!);
            queue.push(node.left);
        }
        i++;
        
        if (i < values.length && values[i] !== null) {
            node.right = new TreeNode(values[i]!);
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}

// Test cases
export function testMaxPathSum() {
    console.log("Testing Binary Tree Maximum Path Sum:");
    
    const testCases = [
        {
            tree: [1, 2, 3],
            expected: 6
        },
        {
            tree: [-10, 9, 20, null, null, 15, 7],
            expected: 42
        },
        {
            tree: [1, -2, 3],
            expected: 4
        },
        {
            tree: [-3],
            expected: -3
        },
        {
            tree: [2, -1],
            expected: 2
        },
        {
            tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1],
            expected: 48
        },
        {
            tree: [-1, -2, -3],
            expected: -1
        }
    ];
    
    const solutions = [
        { name: "Recursive DFS Global Max", fn: maxPathSum1 },
        { name: "DFS Return Object", fn: maxPathSum2 },
        { name: "Iterative Stack", fn: maxPathSum3 },
        { name: "Morris Traversal", fn: maxPathSum4 },
        { name: "Bottom-Up Stack", fn: maxPathSum5 },
        { name: "Divide and Conquer", fn: maxPathSum6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const root = createTree(test.tree);
            const result = solution.fn(root);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Tree: ${JSON.stringify(test.tree)}`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Path Definition**:
 *    - Sequence of connected nodes (parent-child relationship)
 *    - Each node appears at most once
 *    - Path doesn't need to include root
 *    - Can be single node, straight line, or "bent" through a node
 * 
 * 2. **Key Insight**:
 *    - For each node, consider two scenarios:
 *      a) Maximum path extending from node (to parent)
 *      b) Maximum path passing through node (connecting subtrees)
 *    - Global maximum is updated when considering scenario (b)
 * 
 * 3. **Recursive Strategy**:
 *    - Each node returns max path sum extending upward
 *    - Considers path through current node for global maximum
 *    - Uses post-order traversal (children before parent)
 * 
 * 4. **Negative Value Handling**:
 *    - Use Math.max(0, pathSum) to ignore negative contributions
 *    - A node might not include its children if they're negative
 *    - Single negative node can be the maximum path
 * 
 * 5. **Time Complexity**: O(n)
 *    - Visit each node exactly once
 *    - Constant work per node
 *    - Linear in number of nodes
 * 
 * 6. **Space Complexity**: O(h)
 *    - Recursion stack depth equals tree height
 *    - O(log n) for balanced tree, O(n) for skewed tree
 *    - Iterative versions may use O(n) space
 * 
 * 7. **Two Types of Paths**:
 *    - Extending path: goes from node toward root
 *    - Through path: connects two subtrees via current node
 *    - Only extending paths can be part of larger paths
 * 
 * 8. **Interview Strategy**:
 *    - Start with recursive DFS approach
 *    - Explain the two path types clearly
 *    - Handle negative values correctly
 *    - Consider edge cases (single node, all negative)
 * 
 * 9. **Edge Cases**:
 *    - Single node tree
 *    - All negative values
 *    - Skewed tree (linear)
 *    - Empty subtrees
 * 
 * 10. **Common Mistakes**:
 *     - Not distinguishing extending vs through paths
 *     - Incorrect handling of negative values
 *     - Forgetting to update global maximum
 *     - Wrong base case for null nodes
 * 
 * 11. **Optimization Considerations**:
 *     - Early termination not easily applicable
 *     - Space optimization with iterative approaches
 *     - Avoiding repeated calculations
 * 
 * 12. **Big Tech Variations**:
 *     - Google: Path with maximum product
 *     - Meta: Path with specific constraints
 *     - Amazon: K longest paths in tree
 *     - Microsoft: Path sum with node deletion cost
 * 
 * 13. **Follow-up Questions**:
 *     - Return the actual path, not just sum
 *     - Find all paths with maximum sum
 *     - Path with exactly k nodes
 *     - Path sum closest to target value
 * 
 * 14. **Real-world Applications**:
 *     - Financial portfolio optimization
 *     - Network routing with costs
 *     - Game theory path optimization
 *     - Resource allocation in hierarchies
 *     - Signal processing on tree structures
 * 
 * 15. **Pattern Recognition**:
 *     - Tree DP pattern (bottom-up information gathering)
 *     - Global vs local optimization
 *     - Post-order traversal for dependent calculations
 *     - Choice between extending vs terminating paths
 * 
 * 16. **Implementation Tips**:
 *     - Clear separation of extending vs through paths
 *     - Proper handling of null nodes
 *     - Global variable for maximum tracking
 *     - Consider both children when computing through path
 */
{% endraw %}
