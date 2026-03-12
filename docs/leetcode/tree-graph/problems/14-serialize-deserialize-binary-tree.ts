/**
 * 297. Serialize and Deserialize Binary Tree
 * 
 * Serialization is the process of converting a data structure or object into a sequence of bits 
 * so that it can be stored in a file or memory buffer, or transmitted across a network connection 
 * link to be reconstructed later in the same or another computer environment.
 * 
 * Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how 
 * your serialization/deserialization algorithm should work. You just need to ensure that a binary 
 * tree can be serialized to a string and this string can be deserialized to the original tree structure.
 * 
 * Clarification: The input/output format is the same as how LeetCode serializes a binary tree. 
 * You do not necessarily need to follow this format, so please be creative and come up with 
 * different approaches yourself.
 * 
 * Example 1:
 * Input: root = [1,2,3,null,null,4,5]
 * Output: [1,2,3,null,null,4,5]
 * 
 * Example 2:
 * Input: root = []
 * Output: []
 * 
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 10^4].
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

// Solution 1: Preorder Traversal (DFS)
// Time: O(n), Space: O(n)
export class Codec1 {
    serialize(root: TreeNode | null): string {
        const result: string[] = [];
        
        function preorder(node: TreeNode | null): void {
            if (!node) {
                result.push("null");
                return;
            }
            
            result.push(node.val.toString());
            preorder(node.left);
            preorder(node.right);
        }
        
        preorder(root);
        return result.join(",");
    }
    
    deserialize(data: string): TreeNode | null {
        const values = data.split(",");
        let index = 0;
        
        function buildTree(): TreeNode | null {
            if (index >= values.length || values[index] === "null") {
                index++;
                return null;
            }
            
            const node = new TreeNode(parseInt(values[index]));
            index++;
            
            node.left = buildTree();
            node.right = buildTree();
            
            return node;
        }
        
        return buildTree();
    }
}

// Solution 2: Level Order Traversal (BFS)
// Time: O(n), Space: O(n)
export class Codec2 {
    serialize(root: TreeNode | null): string {
        if (!root) return "";
        
        const result: string[] = [];
        const queue: (TreeNode | null)[] = [root];
        
        while (queue.length > 0) {
            const node = queue.shift()!;
            
            if (node) {
                result.push(node.val.toString());
                queue.push(node.left);
                queue.push(node.right);
            } else {
                result.push("null");
            }
        }
        
        // Remove trailing nulls
        while (result.length > 0 && result[result.length - 1] === "null") {
            result.pop();
        }
        
        return result.join(",");
    }
    
    deserialize(data: string): TreeNode | null {
        if (!data) return null;
        
        const values = data.split(",");
        const root = new TreeNode(parseInt(values[0]));
        const queue: TreeNode[] = [root];
        let i = 1;
        
        while (queue.length > 0 && i < values.length) {
            const node = queue.shift()!;
            
            // Process left child
            if (i < values.length && values[i] !== "null") {
                node.left = new TreeNode(parseInt(values[i]));
                queue.push(node.left);
            }
            i++;
            
            // Process right child
            if (i < values.length && values[i] !== "null") {
                node.right = new TreeNode(parseInt(values[i]));
                queue.push(node.right);
            }
            i++;
        }
        
        return root;
    }
}

// Solution 3: Postorder Traversal
// Time: O(n), Space: O(n)
export class Codec3 {
    serialize(root: TreeNode | null): string {
        const result: string[] = [];
        
        function postorder(node: TreeNode | null): void {
            if (!node) {
                result.push("null");
                return;
            }
            
            postorder(node.left);
            postorder(node.right);
            result.push(node.val.toString());
        }
        
        postorder(root);
        return result.join(",");
    }
    
    deserialize(data: string): TreeNode | null {
        const values = data.split(",");
        let index = values.length - 1;
        
        function buildTree(): TreeNode | null {
            if (index < 0 || values[index] === "null") {
                index--;
                return null;
            }
            
            const node = new TreeNode(parseInt(values[index]));
            index--;
            
            // Note: in postorder, we build right first, then left
            node.right = buildTree();
            node.left = buildTree();
            
            return node;
        }
        
        return buildTree();
    }
}

// Solution 4: Parentheses Representation
// Time: O(n), Space: O(n)
export class Codec4 {
    serialize(root: TreeNode | null): string {
        if (!root) return "";
        
        function helper(node: TreeNode | null): string {
            if (!node) return "()";
            
            const left = helper(node.left);
            const right = helper(node.right);
            
            return `(${node.val}${left}${right})`;
        }
        
        return helper(root);
    }
    
    deserialize(data: string): TreeNode | null {
        if (!data) return null;
        
        let index = 0;
        
        function helper(): TreeNode | null {
            if (index >= data.length || data[index] !== '(') {
                return null;
            }
            
            index++; // Skip '('
            
            if (data[index] === ')') {
                index++; // Skip ')'
                return null;
            }
            
            // Parse value
            let val = "";
            while (index < data.length && data[index] !== '(' && data[index] !== ')') {
                val += data[index];
                index++;
            }
            
            const node = new TreeNode(parseInt(val));
            node.left = helper();
            node.right = helper();
            
            index++; // Skip ')'
            return node;
        }
        
        return helper();
    }
}

// Solution 5: Compact Binary Representation
// Time: O(n), Space: O(n)
export class Codec5 {
    serialize(root: TreeNode | null): string {
        const result: number[] = [];
        
        function encode(node: TreeNode | null): void {
            if (!node) {
                result.push(0); // Use 0 to represent null
                return;
            }
            
            // Encode non-null with value + offset to handle negative numbers
            result.push(node.val + 1001); // Offset by 1001 (since -1000 <= val <= 1000)
            encode(node.left);
            encode(node.right);
        }
        
        encode(root);
        return result.join(",");
    }
    
    deserialize(data: string): TreeNode | null {
        if (!data) return null;
        
        const values = data.split(",").map(Number);
        let index = 0;
        
        function decode(): TreeNode | null {
            if (index >= values.length || values[index] === 0) {
                index++;
                return null;
            }
            
            const node = new TreeNode(values[index] - 1001); // Restore original value
            index++;
            
            node.left = decode();
            node.right = decode();
            
            return node;
        }
        
        return decode();
    }
}

// Solution 6: Morris-like Encoding (Advanced)
// Time: O(n), Space: O(1) for serialization, O(n) for deserialization
export class Codec6 {
    serialize(root: TreeNode | null): string {
        if (!root) return "";
        
        const result: string[] = [];
        const stack: [TreeNode | null, number][] = [[root, 0]]; // [node, state]
        
        while (stack.length > 0) {
            const [node, state] = stack.pop()!;
            
            if (!node) {
                result.push("null");
                continue;
            }
            
            if (state === 0) {
                // First visit: process value and push children
                result.push(node.val.toString());
                stack.push([node, 1]); // Mark as processed
                stack.push([node.right, 0]);
                stack.push([node.left, 0]);
            }
        }
        
        return result.join(",");
    }
    
    deserialize(data: string): TreeNode | null {
        if (!data) return null;
        
        const values = data.split(",");
        let index = 0;
        
        function buildTree(): TreeNode | null {
            if (index >= values.length || values[index] === "null") {
                index++;
                return null;
            }
            
            const node = new TreeNode(parseInt(values[index]));
            index++;
            
            node.left = buildTree();
            node.right = buildTree();
            
            return node;
        }
        
        return buildTree();
    }
}

// Test cases
export function testSerializeDeserialize() {
    console.log("Testing Serialize and Deserialize Binary Tree:");
    
    // Helper function to create test tree
    function createTree(): TreeNode {
        const root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.right.left = new TreeNode(4);
        root.right.right = new TreeNode(5);
        return root;
    }
    
    // Helper function to compare trees
    function treesEqual(t1: TreeNode | null, t2: TreeNode | null): boolean {
        if (!t1 && !t2) return true;
        if (!t1 || !t2) return false;
        return t1.val === t2.val && 
               treesEqual(t1.left, t2.left) && 
               treesEqual(t1.right, t2.right);
    }
    
    const codecs = [
        { name: "Preorder DFS", codec: new Codec1() },
        { name: "Level Order BFS", codec: new Codec2() },
        { name: "Postorder", codec: new Codec3() },
        { name: "Parentheses", codec: new Codec4() },
        { name: "Compact Binary", codec: new Codec5() },
        { name: "Morris-like", codec: new Codec6() }
    ];
    
    const testCases = [
        { name: "Normal Tree", tree: createTree() },
        { name: "Empty Tree", tree: null },
        { name: "Single Node", tree: new TreeNode(1) },
        { 
            name: "Left Skewed", 
            tree: (() => {
                const root = new TreeNode(1);
                root.left = new TreeNode(2);
                root.left.left = new TreeNode(3);
                return root;
            })()
        }
    ];
    
    codecs.forEach(codecInfo => {
        console.log(`\n${codecInfo.name}:`);
        
        testCases.forEach(test => {
            try {
                const serialized = codecInfo.codec.serialize(test.tree);
                const deserialized = codecInfo.codec.deserialize(serialized);
                const passed = treesEqual(test.tree, deserialized);
                
                console.log(`  ${test.name}: ${passed ? 'PASS' : 'FAIL'}`);
                if (passed) {
                    console.log(`    Serialized: ${serialized.length > 50 ? serialized.substring(0, 50) + '...' : serialized}`);
                }
            } catch (error) {
                console.log(`  ${test.name}: FAIL (Error: ${error})`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Serialization Strategies**:
 *    - Preorder: Root -> Left -> Right (most common)
 *    - Level order: BFS traversal (LeetCode format)
 *    - Postorder: Left -> Right -> Root
 *    - Custom formats: Parentheses, binary encoding
 * 
 * 2. **Preorder Advantage**:
 *    - Natural recursive structure
 *    - Easy to implement both directions
 *    - Matches tree construction pattern
 * 
 * 3. **Level Order Advantage**:
 *    - Matches standard tree representations
 *    - Good for visualization
 *    - Can optimize trailing nulls
 * 
 * 4. **Null Handling**:
 *    - Must represent null nodes for structure preservation
 *    - Different approaches: "null", "0", special markers
 *    - Trade-off between size and simplicity
 * 
 * 5. **Time Complexity**: O(n)
 *    - Must visit each node exactly once
 *    - Both serialization and deserialization
 *    - Cannot be optimized further
 * 
 * 6. **Space Complexity**: O(n)
 *    - Serialized string size: O(n)
 *    - Recursion stack: O(h) where h is height
 *    - Additional data structures: O(n)
 * 
 * 7. **Interview Strategy**:
 *    - Start with preorder approach
 *    - Explain null handling clearly
 *    - Code both serialize and deserialize
 *    - Test with edge cases
 * 
 * 8. **Edge Cases**:
 *    - Empty tree (null root)
 *    - Single node tree
 *    - Skewed trees (all left or all right)
 *    - Negative values
 * 
 * 9. **Optimization Considerations**:
 *    - String vs binary format
 *    - Compression techniques
 *    - Memory usage minimization
 *    - Parse efficiency
 * 
 * 10. **Common Mistakes**:
 *     - Forgetting to handle null nodes
 *     - Incorrect parsing of negative numbers
 *     - Wrong order in postorder reconstruction
 *     - Not maintaining global index properly
 * 
 * 11. **Big Tech Variations**:
 *     - Google: N-ary tree serialization
 *     - Meta: Serialize with metadata
 *     - Amazon: Space-optimized formats
 *     - Microsoft: Streaming serialization
 * 
 * 12. **Follow-up Questions**:
 *     - Serialize N-ary trees
 *     - Handle very large trees (streaming)
 *     - Compress the serialized format
 *     - Serialize with additional node properties
 * 
 * 13. **Real-world Applications**:
 *     - Database index serialization
 *     - Network data transmission
 *     - File format design
 *     - Caching and persistence
 *     - Distributed systems communication
 * 
 * 14. **Format Trade-offs**:
 *     - Human readable vs compact
 *     - Parse speed vs size
 *     - Error detection capabilities
 *     - Version compatibility
 * 
 * 15. **Advanced Techniques**:
 *     - Huffman coding for compression
 *     - Delta encoding for similar values
 *     - Schema evolution support
 *     - Checksums for integrity
 */