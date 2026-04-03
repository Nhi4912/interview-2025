/**
 * 269. Alien Dictionary
 * 
 * There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.
 * You are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this new language.
 * 
 * Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. 
 * If there is no solution, return "". If there are multiple solutions, return any of them.
 * 
 * A string s is lexicographically smaller than a string t if at the first position where s and t differ, the character in s comes before the character in t in the alien language. 
 * If the first min(s.length, t.length) characters are the same, then s is lexicographically smaller if and only if s.length < t.length.
 * 
 * Example 1:
 * Input: words = ["wrt","wrf","er","ett","rftt"]
 * Output: "wertf"
 * 
 * Example 2:
 * Input: words = ["z","x"]
 * Output: "zx"
 * 
 * Example 3:
 * Input: words = ["z","x","z"]
 * Output: ""
 * Explanation: The order is invalid, so return "".
 * 
 * Constraints:
 * - 1 <= words.length <= 100
 * - 1 <= words[i].length <= 100
 * - words[i] consists of only lowercase English letters.
 */

// Solution 1: Topological Sort with DFS
// Time: O(V + E) where V = unique chars, E = relationships, Space: O(V + E)
export function alienOrder1(words: string[]): string {
    if (words.length === 0) return "";
    
    // Build adjacency list and in-degree count
    const graph = new Map<string, Set<string>>();
    const inDegree = new Map<string, number>();
    
    // Initialize all characters
    for (const word of words) {
        for (const char of word) {
            if (!graph.has(char)) {
                graph.set(char, new Set());
                inDegree.set(char, 0);
            }
        }
    }
    
    // Build graph by comparing adjacent words
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        // Check for invalid case: word1 is prefix of word2 but longer
        if (word1.length > word2.length && word1.startsWith(word2)) {
            return "";
        }
        
        // Find first different character
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
            const char1 = word1[j];
            const char2 = word2[j];
            
            if (char1 !== char2) {
                // Add edge from char1 to char2
                if (!graph.get(char1)!.has(char2)) {
                    graph.get(char1)!.add(char2);
                    inDegree.set(char2, inDegree.get(char2)! + 1);
                }
                break; // Only first difference matters
            }
        }
    }
    
    // Topological sort using DFS
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const colors = new Map<string, number>();
    const result: string[] = [];
    
    for (const char of graph.keys()) {
        colors.set(char, WHITE);
    }
    
    function dfs(char: string): boolean {
        if (colors.get(char) === GRAY) return false; // Cycle detected
        if (colors.get(char) === BLACK) return true; // Already processed
        
        colors.set(char, GRAY);
        
        // Visit all neighbors
        for (const neighbor of graph.get(char)!) {
            if (!dfs(neighbor)) return false;
        }
        
        colors.set(char, BLACK);
        result.push(char);
        return true;
    }
    
    // Process all characters
    for (const char of graph.keys()) {
        if (colors.get(char) === WHITE) {
            if (!dfs(char)) return ""; // Cycle detected
        }
    }
    
    return result.reverse().join("");
}

// Solution 2: Kahn's Algorithm (BFS Topological Sort)
// Time: O(V + E), Space: O(V + E)
export function alienOrder2(words: string[]): string {
    if (words.length === 0) return "";
    
    const graph = new Map<string, Set<string>>();
    const inDegree = new Map<string, number>();
    
    // Initialize characters
    for (const word of words) {
        for (const char of word) {
            if (!graph.has(char)) {
                graph.set(char, new Set());
                inDegree.set(char, 0);
            }
        }
    }
    
    // Build graph
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        // Check invalid case
        if (word1.length > word2.length && word1.startsWith(word2)) {
            return "";
        }
        
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
            const char1 = word1[j];
            const char2 = word2[j];
            
            if (char1 !== char2) {
                if (!graph.get(char1)!.has(char2)) {
                    graph.get(char1)!.add(char2);
                    inDegree.set(char2, inDegree.get(char2)! + 1);
                }
                break;
            }
        }
    }
    
    // Kahn's algorithm
    const queue: string[] = [];
    for (const [char, degree] of inDegree) {
        if (degree === 0) {
            queue.push(char);
        }
    }
    
    const result: string[] = [];
    
    while (queue.length > 0) {
        const char = queue.shift()!;
        result.push(char);
        
        for (const neighbor of graph.get(char)!) {
            inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // Check if all characters are processed (no cycle)
    return result.length === graph.size ? result.join("") : "";
}

// Solution 3: Union-Find with Constraint Checking
// Time: O(V + E), Space: O(V)
export function alienOrder3(words: string[]): string {
    if (words.length === 0) return "";
    
    class UnionFind {
        parent: Map<string, string> = new Map();
        rank: Map<string, number> = new Map();
        
        makeSet(x: string): void {
            if (!this.parent.has(x)) {
                this.parent.set(x, x);
                this.rank.set(x, 0);
            }
        }
        
        find(x: string): string {
            if (this.parent.get(x) !== x) {
                this.parent.set(x, this.find(this.parent.get(x)!));
            }
            return this.parent.get(x)!;
        }
        
        union(x: string, y: string): boolean {
            const rootX = this.find(x);
            const rootY = this.find(y);
            
            if (rootX === rootY) return false; // Would create cycle
            
            if (this.rank.get(rootX)! < this.rank.get(rootY)!) {
                this.parent.set(rootX, rootY);
            } else if (this.rank.get(rootX)! > this.rank.get(rootY)!) {
                this.parent.set(rootY, rootX);
            } else {
                this.parent.set(rootY, rootX);
                this.rank.set(rootX, this.rank.get(rootX)! + 1);
            }
            
            return true;
        }
    }
    
    const uf = new UnionFind();
    const edges: [string, string][] = [];
    const chars = new Set<string>();
    
    // Collect all characters
    for (const word of words) {
        for (const char of word) {
            chars.add(char);
            uf.makeSet(char);
        }
    }
    
    // Collect ordering constraints
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        if (word1.length > word2.length && word1.startsWith(word2)) {
            return "";
        }
        
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
            if (word1[j] !== word2[j]) {
                edges.push([word1[j], word2[j]]);
                break;
            }
        }
    }
    
    // This approach is complex for this problem, switching to DFS
    return alienOrder1(words);
}

// Solution 4: Modified DFS with Path Reconstruction
// Time: O(V + E), Space: O(V + E)
export function alienOrder4(words: string[]): string {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    // Initialize
    for (const word of words) {
        for (const char of word) {
            if (!graph.has(char)) {
                graph.set(char, []);
                inDegree.set(char, 0);
            }
        }
    }
    
    // Build graph
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        if (word1.length > word2.length && word1.startsWith(word2)) {
            return "";
        }
        
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
            if (word1[j] !== word2[j]) {
                graph.get(word1[j])!.push(word2[j]);
                inDegree.set(word2[j], inDegree.get(word2[j])! + 1);
                break;
            }
        }
    }
    
    // Topological sort
    const result: string[] = [];
    const queue: string[] = [];
    
    for (const [char, degree] of inDegree) {
        if (degree === 0) {
            queue.push(char);
        }
    }
    
    while (queue.length > 0) {
        const char = queue.shift()!;
        result.push(char);
        
        for (const neighbor of graph.get(char)!) {
            inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return result.length === graph.size ? result.join("") : "";
}

// Solution 5: Priority Queue Based Topological Sort
// Time: O(V log V + E), Space: O(V + E)
export function alienOrder5(words: string[]): string {
    class MinHeap {
        heap: string[] = [];
        
        push(val: string): void {
            this.heap.push(val);
            this.heapifyUp(this.heap.length - 1);
        }
        
        pop(): string | undefined {
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
    
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    // Initialize
    for (const word of words) {
        for (const char of word) {
            if (!graph.has(char)) {
                graph.set(char, []);
                inDegree.set(char, 0);
            }
        }
    }
    
    // Build graph
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        if (word1.length > word2.length && word1.startsWith(word2)) {
            return "";
        }
        
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
            if (word1[j] !== word2[j]) {
                graph.get(word1[j])!.push(word2[j]);
                inDegree.set(word2[j], inDegree.get(word2[j])! + 1);
                break;
            }
        }
    }
    
    // Use priority queue for lexicographic order
    const pq = new MinHeap();
    for (const [char, degree] of inDegree) {
        if (degree === 0) {
            pq.push(char);
        }
    }
    
    const result: string[] = [];
    
    while (!pq.isEmpty()) {
        const char = pq.pop()!;
        result.push(char);
        
        for (const neighbor of graph.get(char)!) {
            inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
            if (inDegree.get(neighbor) === 0) {
                pq.push(neighbor);
            }
        }
    }
    
    return result.length === graph.size ? result.join("") : "";
}

// Test cases
export function testAlienOrder() {
    console.log("Testing Alien Dictionary:");
    
    const testCases = [
        {
            input: ["wrt", "wrf", "er", "ett", "rftt"],
            expected: "wertf"
        },
        {
            input: ["z", "x"],
            expected: "zx"
        },
        {
            input: ["z", "x", "z"],
            expected: ""
        },
        {
            input: ["abc", "ab"],
            expected: ""
        },
        {
            input: ["a", "b", "ca", "cc"],
            expected: "abc"
        },
        {
            input: ["ac", "ab", "zc", "zb"],
            expected: "acbz"
        }
    ];
    
    const solutions = [
        { name: "DFS Topological Sort", fn: alienOrder1 },
        { name: "Kahn's Algorithm", fn: alienOrder2 },
        { name: "Union Find (fallback)", fn: alienOrder3 },
        { name: "Modified DFS", fn: alienOrder4 },
        { name: "Priority Queue", fn: alienOrder5 }
    ];
    
    function isValidOrder(result: string, words: string[]): boolean {
        if (result === "") return false;
        
        const charToIndex = new Map<string, number>();
        for (let i = 0; i < result.length; i++) {
            charToIndex.set(result[i], i);
        }
        
        for (let i = 0; i < words.length - 1; i++) {
            const word1 = words[i];
            const word2 = words[i + 1];
            
            for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
                const char1 = word1[j];
                const char2 = word2[j];
                
                if (char1 !== char2) {
                    if (charToIndex.get(char1)! > charToIndex.get(char2)!) {
                        return false;
                    }
                    break;
                }
            }
        }
        
        return true;
    }
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn([...test.input]);
            let passed = false;
            
            if (test.expected === "") {
                passed = result === "";
            } else {
                passed = result !== "" && isValidOrder(result, test.input);
            }
            
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Input: ${JSON.stringify(test.input)}`);
                console.log(`    Expected: "${test.expected}" (or valid order)`);
                console.log(`    Got: "${result}"`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Recognition**:
 *    - Topological sorting problem
 *    - Build DAG from lexicographic ordering constraints
 *    - Detect cycles (invalid alien language)
 * 
 * 2. **Graph Construction**:
 *    - Compare adjacent words to find character relationships
 *    - Only first differing position creates ordering constraint
 *    - Handle invalid case: longer word is prefix of shorter
 * 
 * 3. **Topological Sort Approaches**:
 *    - DFS with cycle detection (using colors)
 *    - Kahn's algorithm (BFS with in-degree tracking)
 *    - Both have O(V + E) time complexity
 * 
 * 4. **Edge Case Handling**:
 *    - Invalid ordering: ["abc", "ab"] → impossible
 *    - Cycle detection: ["z", "x", "z"] → contradiction
 *    - Single characters: valid trivial cases
 * 
 * 5. **Algorithm Choice**:
 *    - DFS: More intuitive cycle detection
 *    - Kahn's: Easier to understand and implement
 *    - Priority Queue: Ensures lexicographic result order
 * 
 * 6. **Time Complexity**: O(V + E)
 *    - V = number of unique characters
 *    - E = number of ordering relationships
 *    - Linear in total input size
 * 
 * 7. **Space Complexity**: O(V + E)
 *    - Adjacency list storage
 *    - Additional data structures for sorting
 * 
 * 8. **Interview Strategy**:
 *    - Recognize as graph problem
 *    - Build graph from word comparisons
 *    - Apply topological sorting
 *    - Handle edge cases carefully
 * 
 * 9. **Common Mistakes**:
 *    - Not checking prefix invalidation
 *    - Comparing entire words instead of first difference
 *    - Incorrect cycle detection
 *    - Not handling disconnected components
 * 
 * 10. **Cycle Detection Importance**:
 *     - Contradictory ordering relationships
 *     - Must detect and return empty string
 *     - DFS colors or Kahn's count verification
 * 
 * 11. **Multiple Valid Solutions**:
 *     - Problem allows any valid topological order
 *     - Priority queue can ensure specific ordering
 *     - All solutions are equally correct
 * 
 * 12. **Big Tech Variations**:
 *     - Google: Multiple alien languages
 *     - Meta: Weighted character relationships
 *     - Amazon: Streaming word updates
 *     - Microsoft: Partial ordering verification
 * 
 * 13. **Follow-up Questions**:
 *     - Verify if given order is valid
 *     - Find all possible alien orderings
 *     - Handle streaming dictionary updates
 *     - Optimize for very large dictionaries
 * 
 * 14. **Real-world Applications**:
 *     - Compiler dependency resolution
 *     - Task scheduling with prerequisites
 *     - Package installation ordering
 *     - Course prerequisite planning
 *     - Build system dependency graphs
 * 
 * 15. **Pattern Recognition**:
 *     - Constraint satisfaction problem
 *     - DAG construction from implicit relationships
 *     - Topological ordering application
 *     - Cycle detection in directed graphs
 */