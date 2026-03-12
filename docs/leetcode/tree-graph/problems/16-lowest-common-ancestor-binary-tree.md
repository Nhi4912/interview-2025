---
layout: page
title: "Lowest Common Ancestor of a Binary Tree"
difficulty: Hard
category: Tree/Graph
tags: [Tree/Graph, Hash Table]
leetcode_url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"
---

# Lowest Common Ancestor of a Binary Tree

**LeetCode Problem # * 236. Lowest Common Ancestor of a Binary Tree**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 236. Lowest Common Ancestor of a Binary Tree
 * 
 * Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.
 * 
 * According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined 
 * between two nodes p and q as the lowest node in T that has both p and q as descendants 
 * (where we allow a node to be a descendant of itself)."
 * 
 * Example 1:
 * Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 * Output: 3
 * Explanation: The LCA of nodes 5 and 1 is 3.
 * 
 * Example 2:
 * Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
 * Output: 5
 * Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.
 * 
 * Example 3:
 * Input: root = [1,2], p = 1, q = 2
 * Output: 1
 * 
 * Constraints:
 * - The number of nodes in the tree is in the range [2, 10^5].
 * - -10^9 <= Node.val <= 10^9
 * - All Node.val are unique.
 * - p != q
 * - p and q will exist in the tree.
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

// Solution 1: Recursive DFS (Most Common)
// Time: O(n), Space: O(h) where h is height
export function lowestCommonAncestor1(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (!root || !p || !q) return null;
    
    function dfs(node: TreeNode | null): TreeNode | null {
        if (!node) return null;
        
        // If current node is p or q, return it
        if (node === p || node === q) return node;
        
        // Search in left and right subtrees
        const left = dfs(node.left);
        const right = dfs(node.right);
        
        // If both left and right return non-null, current node is LCA
        if (left && right) return node;
        
        // Return the non-null child (or null if both are null)
        return left || right;
    }
    
    return dfs(root);
}

// Solution 2: Parent Tracking with HashMap
// Time: O(n), Space: O(n)
export function lowestCommonAncestor2(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (!root || !p || !q) return null;
    
    const parentMap = new Map<TreeNode, TreeNode | null>();
    const queue: TreeNode[] = [root];
    parentMap.set(root, null);
    
    // Build parent mapping using BFS
    while (queue.length > 0 && (!parentMap.has(p) || !parentMap.has(q))) {
        const node = queue.shift()!;
        
        if (node.left) {
            parentMap.set(node.left, node);
            queue.push(node.left);
        }
        
        if (node.right) {
            parentMap.set(node.right, node);
            queue.push(node.right);
        }
    }
    
    // Get all ancestors of p
    const ancestors = new Set<TreeNode>();
    let current: TreeNode | null = p;
    
    while (current) {
        ancestors.add(current);
        current = parentMap.get(current)!;
    }
    
    // Find first common ancestor starting from q
    current = q;
    while (current) {
        if (ancestors.has(current)) {
            return current;
        }
        current = parentMap.get(current)!;
    }
    
    return null;
}

// Solution 3: Path Tracking
// Time: O(n), Space: O(h)
export function lowestCommonAncestor3(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (!root || !p || !q) return null;
    
    function findPath(node: TreeNode | null, target: TreeNode, path: TreeNode[]): boolean {
        if (!node) return false;
        
        path.push(node);
        
        if (node === target) return true;
        
        if (findPath(node.left, target, path) || findPath(node.right, target, path)) {
            return true;
        }
        
        path.pop();
        return false;
    }
    
    const pathToP: TreeNode[] = [];
    const pathToQ: TreeNode[] = [];
    
    findPath(root, p, pathToP);
    findPath(root, q, pathToQ);
    
    // Find last common node in both paths
    let lca: TreeNode | null = null;
    const minLength = Math.min(pathToP.length, pathToQ.length);
    
    for (let i = 0; i < minLength; i++) {
        if (pathToP[i] === pathToQ[i]) {
            lca = pathToP[i];
        } else {
            break;
        }
    }
    
    return lca;
}

// Solution 4: Iterative with Stack
// Time: O(n), Space: O(n)
export function lowestCommonAncestor4(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (!root || !p || !q) return null;
    
    const stack: TreeNode[] = [root];
    const parentMap = new Map<TreeNode, TreeNode | null>();
    parentMap.set(root, null);
    
    // Build parent mapping using DFS
    while (!parentMap.has(p) || !parentMap.has(q)) {
        const node = stack.pop()!;
        
        if (node.left) {
            parentMap.set(node.left, node);
            stack.push(node.left);
        }
        
        if (node.right) {
            parentMap.set(node.right, node);
            stack.push(node.right);
        }
    }
    
    // Get ancestors of p
    const ancestors = new Set<TreeNode>();
    let current: TreeNode | null = p;
    
    while (current) {
        ancestors.add(current);
        current = parentMap.get(current)!;
    }
    
    // Find LCA by traversing ancestors of q
    current = q;
    while (current && !ancestors.has(current)) {
        current = parentMap.get(current)!;
    }
    
    return current;
}

// Solution 5: Optimized Single Pass
// Time: O(n), Space: O(h)
export function lowestCommonAncestor5(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    let result: TreeNode | null = null;
    
    function dfs(node: TreeNode | null): boolean {
        if (!node) return false;
        
        // Check if current node is p or q
        const mid = (node === p || node === q) ? 1 : 0;
        
        // Check left and right subtrees
        const left = dfs(node.left) ? 1 : 0;
        const right = dfs(node.right) ? 1 : 0;
        
        // If any two of the flags are set, we found LCA
        if (mid + left + right >= 2) {
            result = node;
        }
        
        // Return true if any of the flags is set
        return (mid + left + right) > 0;
    }
    
    dfs(root);
    return result;
}

// Solution 6: Level Order with Parent Tracking
// Time: O(n), Space: O(n)
export function lowestCommonAncestor6(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if (!root || !p || !q) return null;
    
    const queue: [TreeNode, TreeNode | null][] = [[root, null]];
    const parentMap = new Map<TreeNode, TreeNode | null>();
    
    // Level-order traversal with parent tracking
    while (queue.length > 0) {
        const [node, parent] = queue.shift()!;
        parentMap.set(node, parent);
        
        if (node.left) {
            queue.push([node.left, node]);
        }
        
        if (node.right) {
            queue.push([node.right, node]);
        }
        
        // Early termination when both nodes are found
        if (parentMap.has(p) && parentMap.has(q)) {
            break;
        }
    }
    
    // Build path from p to root
    const pathFromP = new Set<TreeNode>();
    let current: TreeNode | null = p;
    
    while (current) {
        pathFromP.add(current);
        current = parentMap.get(current)!;
    }
    
    // Find first intersection from q to root
    current = q;
    while (current && !pathFromP.has(current)) {
        current = parentMap.get(current)!;
    }
    
    return current;
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

function findNode(root: TreeNode | null, val: number): TreeNode | null {
    if (!root) return null;
    if (root.val === val) return root;
    
    return findNode(root.left, val) || findNode(root.right, val);
}

// Test cases
export function testLowestCommonAncestor() {
    console.log("Testing Lowest Common Ancestor of Binary Tree:");
    
    const testCases = [
        {
            tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
            p: 5,
            q: 1,
            expected: 3
        },
        {
            tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
            p: 5,
            q: 4,
            expected: 5
        },
        {
            tree: [1, 2],
            p: 1,
            q: 2,
            expected: 1
        },
        {
            tree: [1, 2, 3],
            p: 2,
            q: 3,
            expected: 1
        },
        {
            tree: [1, 2, 3, 4, 5],
            p: 4,
            q: 5,
            expected: 2
        }
    ];
    
    const solutions = [
        { name: "Recursive DFS", fn: lowestCommonAncestor1 },
        { name: "Parent Tracking HashMap", fn: lowestCommonAncestor2 },
        { name: "Path Tracking", fn: lowestCommonAncestor3 },
        { name: "Iterative Stack", fn: lowestCommonAncestor4 },
        { name: "Optimized Single Pass", fn: lowestCommonAncestor5 },
        { name: "Level Order Parent Track", fn: lowestCommonAncestor6 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const root = createTree(test.tree);
            const p = findNode(root, test.p);
            const q = findNode(root, test.q);
            const result = solution.fn(root, p, q);
            
            const passed = result?.val === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Tree: ${JSON.stringify(test.tree)}`);
                console.log(`    p: ${test.p}, q: ${test.q}`);
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result?.val || 'null'}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **LCA Definition**:
 *    - Lowest node that has both p and q as descendants
 *    - A node can be a descendant of itself
 *    - Unique solution guaranteed for any two nodes
 * 
 * 2. **Recursive Approach**:
 *    - Base case: null node or found target node
 *    - If both subtrees return non-null, current node is LCA
 *    - Otherwise, return the non-null subtree result
 * 
 * 3. **Key Insight**:
 *    - LCA is the first node where paths to p and q diverge
 *    - Or one of p/q if one is ancestor of the other
 *    - Can be found in single tree traversal
 * 
 * 4. **Time Complexity**: O(n)
 *    - Must potentially visit all nodes
 *    - Each node visited at most once
 *    - Cannot be optimized further in general case
 * 
 * 5. **Space Complexity**:
 *    - Recursive: O(h) for recursion stack
 *    - Parent tracking: O(n) for parent map
 *    - Path tracking: O(h) for path storage
 * 
 * 6. **Algorithm Variations**:
 *    - Recursive DFS: Most elegant and common
 *    - Parent tracking: Good for multiple LCA queries
 *    - Path tracking: Intuitive but less efficient
 * 
 * 7. **Interview Strategy**:
 *    - Start with recursive DFS approach
 *    - Explain the logic clearly
 *    - Handle edge cases
 *    - Discuss alternative approaches
 * 
 * 8. **Edge Cases**:
 *    - One node is ancestor of another
 *    - Root is one of the target nodes
 *    - Nodes at different depths
 *    - Minimal tree (just two nodes)
 * 
 * 9. **Common Mistakes**:
 *    - Not handling case where node is ancestor of itself
 *    - Incorrect base case handling
 *    - Wrong interpretation of return values
 *    - Not considering null nodes properly
 * 
 * 10. **Optimization Considerations**:
 *     - Single pass vs multiple passes
 *     - Early termination strategies
 *     - Memory usage vs computation time
 * 
 * 11. **Follow-up Variations**:
 *     - LCA in BST (can use ordering property)
 *     - LCA of multiple nodes
 *     - LCA with parent pointers
 *     - Range LCA queries
 * 
 * 12. **Big Tech Variations**:
 *     - Google: LCA in graph with cycles
 *     - Meta: LCA with weighted edges
 *     - Amazon: LCA in forest of trees
 *     - Microsoft: LCA with node deletion
 * 
 * 13. **Real-world Applications**:
 *     - File system hierarchy navigation
 *     - Organizational structure queries
 *     - Taxonomy and classification systems
 *     - Network routing algorithms
 *     - Version control systems (git merge base)
 * 
 * 14. **Pattern Recognition**:
 *     - Tree traversal with information bubbling up
 *     - Divide and conquer on tree structure
 *     - Path tracking and intersection finding
 * 
 * 15. **Implementation Tips**:
 *     - Clear base cases for recursion
 *     - Proper handling of null returns
 *     - Efficient parent tracking if needed
 *     - Consider iterative approaches for large trees
 */
{% endraw %}
