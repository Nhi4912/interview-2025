---
layout: page
title: "Word Search II"
difficulty: Hard
category: Backtracking
tags: [Backtracking, Hash Table]
leetcode_url: "https://leetcode.com/problems/word-search-ii/"
---

# Word Search II

**LeetCode Problem # * 212. Word Search II**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 212. Word Search II
 * 
 * Given an m x n board of characters and a list of strings words, return all words on the board.
 * 
 * Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells 
 * are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.
 * 
 * Example 1:
 * Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], 
 *        words = ["oath","pea","eat","rain"]
 * Output: ["eat","oath"]
 * 
 * Example 2:
 * Input: board = [["a","b"],["c","d"]], words = ["abcb"]
 * Output: []
 * 
 * Constraints:
 * - m == board.length
 * - n == board[i].length
 * - 1 <= m, n <= 12
 * - board[i][j] is a lowercase English letter.
 * - 1 <= words.length <= 3 * 10^4
 * - 1 <= words[i].length <= 10
 * - words[i] consists of lowercase English letters.
 * - All the values of words are unique.
 */

// Trie Node class for efficient prefix matching
class TrieNode {
    children: Map<string, TrieNode>;
    word: string | null;
    
    constructor() {
        this.children = new Map();
        this.word = null;
    }
}

// Solution 1: Backtracking with Trie (Optimal)
// Time: O(M×N×4^L), Space: O(W×L)
// M×N = board dimensions, L = max word length, W = number of words
export function findWords1(board: string[][], words: string[]): string[] {
    const root = buildTrie(words);
    const result: string[] = [];
    const m = board.length;
    const n = board[0].length;
    
    function buildTrie(words: string[]): TrieNode {
        const root = new TrieNode();
        
        for (const word of words) {
            let node = root;
            for (const char of word) {
                if (!node.children.has(char)) {
                    node.children.set(char, new TrieNode());
                }
                node = node.children.get(char)!;
            }
            node.word = word;
        }
        
        return root;
    }
    
    function dfs(i: number, j: number, node: TrieNode): void {
        if (i < 0 || i >= m || j < 0 || j >= n) return;
        
        const char = board[i][j];
        if (char === '#' || !node.children.has(char)) return;
        
        node = node.children.get(char)!;
        
        // Found a complete word
        if (node.word) {
            result.push(node.word);
            node.word = null; // Avoid duplicates
        }
        
        // Mark as visited
        board[i][j] = '#';
        
        // Explore all 4 directions
        dfs(i + 1, j, node);
        dfs(i - 1, j, node);
        dfs(i, j + 1, node);
        dfs(i, j - 1, node);
        
        // Backtrack
        board[i][j] = char;
    }
    
    // Start DFS from each cell
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            dfs(i, j, root);
        }
    }
    
    return result;
}

// Solution 2: Backtracking with Trie + Pruning
// Time: O(M×N×4^L), Space: O(W×L)
export function findWords2(board: string[][], words: string[]): string[] {
    const root = buildTrie(words);
    const result: string[] = [];
    const m = board.length;
    const n = board[0].length;
    
    function buildTrie(words: string[]): TrieNode {
        const root = new TrieNode();
        
        for (const word of words) {
            let node = root;
            for (const char of word) {
                if (!node.children.has(char)) {
                    node.children.set(char, new TrieNode());
                }
                node = node.children.get(char)!;
            }
            node.word = word;
        }
        
        return root;
    }
    
    function dfs(i: number, j: number, node: TrieNode): void {
        if (i < 0 || i >= m || j < 0 || j >= n) return;
        
        const char = board[i][j];
        if (char === '#' || !node.children.has(char)) return;
        
        node = node.children.get(char)!;
        
        // Found a complete word
        if (node.word) {
            result.push(node.word);
            node.word = null; // Avoid duplicates
        }
        
        // Mark as visited
        board[i][j] = '#';
        
        // Explore all 4 directions
        dfs(i + 1, j, node);
        dfs(i - 1, j, node);
        dfs(i, j + 1, node);
        dfs(i, j - 1, node);
        
        // Backtrack
        board[i][j] = char;
        
        // Pruning: remove leaf nodes to optimize future searches
        if (node.children.size === 0) {
            node.children.clear();
        }
    }
    
    // Start DFS from each cell
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            dfs(i, j, root);
        }
    }
    
    return result;
}

// Solution 3: Individual Word Search (Brute Force)
// Time: O(W×M×N×4^L), Space: O(L)
export function findWords3(board: string[][], words: string[]): string[] {
    const result: string[] = [];
    
    function exist(word: string): boolean {
        const m = board.length;
        const n = board[0].length;
        
        function dfs(i: number, j: number, index: number): boolean {
            if (index === word.length) return true;
            if (i < 0 || i >= m || j < 0 || j >= n) return false;
            if (board[i][j] !== word[index]) return false;
            
            // Mark as visited
            const temp = board[i][j];
            board[i][j] = '#';
            
            // Search in 4 directions
            const found = dfs(i + 1, j, index + 1) ||
                         dfs(i - 1, j, index + 1) ||
                         dfs(i, j + 1, index + 1) ||
                         dfs(i, j - 1, index + 1);
            
            // Backtrack
            board[i][j] = temp;
            
            return found;
        }
        
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (board[i][j] === word[0] && dfs(i, j, 0)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    for (const word of words) {
        if (exist(word)) {
            result.push(word);
        }
    }
    
    return result;
}

// Solution 4: Trie with Iterative DFS
// Time: O(M×N×4^L), Space: O(W×L)
export function findWords4(board: string[][], words: string[]): string[] {
    const root = buildTrie(words);
    const result: string[] = [];
    const m = board.length;
    const n = board[0].length;
    
    function buildTrie(words: string[]): TrieNode {
        const root = new TrieNode();
        
        for (const word of words) {
            let node = root;
            for (const char of word) {
                if (!node.children.has(char)) {
                    node.children.set(char, new TrieNode());
                }
                node = node.children.get(char)!;
            }
            node.word = word;
        }
        
        return root;
    }
    
    function dfsIterative(startI: number, startJ: number): void {
        const stack: [number, number, TrieNode, string[][]][] = [];
        const initialBoard = board.map(row => [...row]);
        stack.push([startI, startJ, root, initialBoard]);
        
        while (stack.length > 0) {
            const [i, j, node, currentBoard] = stack.pop()!;
            
            if (i < 0 || i >= m || j < 0 || j >= n) continue;
            
            const char = currentBoard[i][j];
            if (char === '#' || !node.children.has(char)) continue;
            
            const nextNode = node.children.get(char)!;
            
            // Found a complete word
            if (nextNode.word) {
                result.push(nextNode.word);
                nextNode.word = null; // Avoid duplicates
            }
            
            // Create new board state with current cell marked
            const newBoard = currentBoard.map(row => [...row]);
            newBoard[i][j] = '#';
            
            // Add all 4 directions to stack
            stack.push([i + 1, j, nextNode, newBoard]);
            stack.push([i - 1, j, nextNode, newBoard]);
            stack.push([i, j + 1, nextNode, newBoard]);
            stack.push([i, j - 1, nextNode, newBoard]);
        }
    }
    
    // Start DFS from each cell
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            dfsIterative(i, j);
        }
    }
    
    return result;
}

// Solution 5: Optimized Trie with Early Termination
// Time: O(M×N×4^L), Space: O(W×L)
export function findWords5(board: string[][], words: string[]): string[] {
    // Filter words that can't possibly exist on the board
    const boardChars = new Set<string>();
    for (const row of board) {
        for (const char of row) {
            boardChars.add(char);
        }
    }
    
    const filteredWords = words.filter(word => 
        word.split('').every(char => boardChars.has(char))
    );
    
    if (filteredWords.length === 0) return [];
    
    const root = buildTrie(filteredWords);
    const result: string[] = [];
    const m = board.length;
    const n = board[0].length;
    
    function buildTrie(words: string[]): TrieNode {
        const root = new TrieNode();
        
        for (const word of words) {
            let node = root;
            for (const char of word) {
                if (!node.children.has(char)) {
                    node.children.set(char, new TrieNode());
                }
                node = node.children.get(char)!;
            }
            node.word = word;
        }
        
        return root;
    }
    
    function dfs(i: number, j: number, node: TrieNode): void {
        if (i < 0 || i >= m || j < 0 || j >= n) return;
        
        const char = board[i][j];
        if (char === '#' || !node.children.has(char)) return;
        
        node = node.children.get(char)!;
        
        // Found a complete word
        if (node.word) {
            result.push(node.word);
            node.word = null; // Avoid duplicates
        }
        
        // Early termination if no more children
        if (node.children.size === 0) return;
        
        // Mark as visited
        board[i][j] = '#';
        
        // Explore all 4 directions
        dfs(i + 1, j, node);
        dfs(i - 1, j, node);
        dfs(i, j + 1, node);
        dfs(i, j - 1, node);
        
        // Backtrack
        board[i][j] = char;
    }
    
    // Start DFS from each cell
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            dfs(i, j, root);
        }
    }
    
    return result;
}

// Test cases
export function testFindWords() {
    console.log("Testing Word Search II:");
    
    const testCases = [
        {
            board: [
                ["o", "a", "a", "n"],
                ["e", "t", "a", "e"],
                ["i", "h", "k", "r"],
                ["i", "f", "l", "v"]
            ],
            words: ["oath", "pea", "eat", "rain"],
            expected: ["eat", "oath"]
        },
        {
            board: [["a", "b"], ["c", "d"]],
            words: ["abcb"],
            expected: []
        },
        {
            board: [["a", "a"]],
            words: ["a"],
            expected: ["a"]
        },
        {
            board: [["a", "b"], ["a", "a"]],
            words: ["aba", "baa", "bab", "aaab", "aaa", "aaaa", "aaba"],
            expected: ["aba", "baa", "aaa", "aaab", "aaba"]
        }
    ];
    
    const solutions = [
        { name: "Trie + Backtracking", fn: findWords1 },
        { name: "Trie + Pruning", fn: findWords2 },
        { name: "Individual Word Search", fn: findWords3 },
        { name: "Iterative DFS", fn: findWords4 },
        { name: "Optimized Trie", fn: findWords5 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            // Create deep copy of board for each test
            const boardCopy = test.board.map(row => [...row]);
            const result = solution.fn(boardCopy, test.words);
            result.sort();
            test.expected.sort();
            
            const passed = JSON.stringify(result) === JSON.stringify(test.expected);
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Expected: ${JSON.stringify(test.expected)}`);
                console.log(`    Got: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Recognition**:
 *    - Multiple word search in 2D grid
 *    - Optimization needed for large word lists
 *    - Trie data structure is key for efficiency
 * 
 * 2. **Trie Advantages**:
 *    - Prefix matching in O(1) per character
 *    - Eliminates redundant searches
 *    - Prunes search space early
 * 
 * 3. **Backtracking Pattern**:
 *    - Mark current cell as visited
 *    - Explore 4 directions recursively
 *    - Restore cell state when backtracking
 * 
 * 4. **Time Complexity**: O(M×N×4^L)
 *    - M×N: starting positions
 *    - 4^L: worst case branching factor
 *    - L: maximum word length
 * 
 * 5. **Space Complexity**: O(W×L)
 *    - W: number of words
 *    - L: average word length
 *    - Trie storage + recursion stack
 * 
 * 6. **Optimization Techniques**:
 *    - Remove found words from Trie
 *    - Prune empty branches
 *    - Filter impossible words early
 *    - Use character frequency analysis
 * 
 * 7. **Interview Strategy**:
 *    - Start with single word search
 *    - Identify inefficiency with multiple words
 *    - Introduce Trie for optimization
 *    - Implement backtracking with Trie
 * 
 * 8. **Edge Cases**:
 *    - Empty board or word list
 *    - Single character words
 *    - Words longer than board allows
 *    - Duplicate words (handle in Trie)
 * 
 * 9. **Common Mistakes**:
 *    - Not restoring board state during backtracking
 *    - Forgetting to mark cells as visited
 *    - Incorrect Trie construction
 *    - Not handling duplicate results
 * 
 * 10. **Big Tech Variations**:
 *     - Google: 3D word search
 *     - Meta: Word search with wildcards
 *     - Amazon: Case-insensitive search
 *     - Microsoft: Circular board (wrap-around)
 * 
 * 11. **Follow-up Questions**:
 *     - Return word positions/paths
 *     - Count occurrences of each word
 *     - Handle dictionary updates dynamically
 *     - Optimize for repeated queries
 * 
 * 12. **Performance Considerations**:
 *     - Memory usage of Trie vs hash set
 *     - Recursive vs iterative implementation
 *     - Pruning strategies effectiveness
 *     - Early termination conditions
 * 
 * 13. **Real-world Applications**:
 *     - Crossword puzzle solvers
 *     - Word game implementations
 *     - Text mining and search
 *     - Pattern recognition in grids
 *     - Bioinformatics sequence analysis
 */
{% endraw %}
