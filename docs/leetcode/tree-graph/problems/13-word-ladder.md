---
layout: page
title: "Word Ladder"
difficulty: Hard
category: Tree/Graph
tags: [Tree/Graph, Hash Table]
leetcode_url: "https://leetcode.com/problems/word-ladder/"
---

# Word Ladder

**LeetCode Problem # * 127. Word Ladder**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 127. Word Ladder
 * 
 * A transformation sequence from word beginWord to word endWord using a dictionary wordList 
 * is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
 * 
 * - Every adjacent pair of words differs by exactly one letter.
 * - Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
 * - sk == endWord
 * 
 * Given two words, beginWord and endWord, and a dictionary wordList, return the length of the 
 * shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.
 * 
 * Example 1:
 * Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
 * Output: 5
 * Explanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.
 * 
 * Example 2:
 * Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
 * Output: 0
 * Explanation: The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.
 * 
 * Constraints:
 * - 1 <= beginWord.length <= 10
 * - endWord.length == beginWord.length
 * - 1 <= wordList.length <= 5000
 * - wordList[i].length == beginWord.length
 * - beginWord, endWord, and wordList[i] consist of lowercase English letters.
 * - beginWord != endWord
 * - All the words in wordList are unique.
 */

// Solution 1: BFS (Breadth-First Search)
// Time: O(M²×N), Space: O(M²×N)
// M = length of each word, N = total number of words
export function ladderLength1(beginWord: string, endWord: string, wordList: string[]): number {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    const queue: [string, number][] = [[beginWord, 1]];
    const visited = new Set<string>();
    visited.add(beginWord);
    
    while (queue.length > 0) {
        const [currentWord, level] = queue.shift()!;
        
        if (currentWord === endWord) {
            return level;
        }
        
        // Try changing each character
        for (let i = 0; i < currentWord.length; i++) {
            for (let charCode = 97; charCode <= 122; charCode++) { // 'a' to 'z'
                const newChar = String.fromCharCode(charCode);
                if (newChar === currentWord[i]) continue;
                
                const newWord = currentWord.slice(0, i) + newChar + currentWord.slice(i + 1);
                
                if (wordSet.has(newWord) && !visited.has(newWord)) {
                    visited.add(newWord);
                    queue.push([newWord, level + 1]);
                }
            }
        }
    }
    
    return 0;
}

// Solution 2: Bidirectional BFS
// Time: O(M²×N), Space: O(M²×N)
export function ladderLength2(beginWord: string, endWord: string, wordList: string[]): number {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    let beginSet = new Set([beginWord]);
    let endSet = new Set([endWord]);
    const visited = new Set<string>();
    let level = 1;
    
    while (beginSet.size > 0 && endSet.size > 0) {
        // Always expand the smaller set for optimization
        if (beginSet.size > endSet.size) {
            [beginSet, endSet] = [endSet, beginSet];
        }
        
        const nextSet = new Set<string>();
        
        for (const word of beginSet) {
            for (let i = 0; i < word.length; i++) {
                for (let charCode = 97; charCode <= 122; charCode++) {
                    const newChar = String.fromCharCode(charCode);
                    if (newChar === word[i]) continue;
                    
                    const newWord = word.slice(0, i) + newChar + word.slice(i + 1);
                    
                    if (endSet.has(newWord)) {
                        return level + 1;
                    }
                    
                    if (wordSet.has(newWord) && !visited.has(newWord)) {
                        visited.add(newWord);
                        nextSet.add(newWord);
                    }
                }
            }
        }
        
        beginSet = nextSet;
        level++;
    }
    
    return 0;
}

// Solution 3: BFS with Pattern Matching
// Time: O(M²×N), Space: O(M²×N)
export function ladderLength3(beginWord: string, endWord: string, wordList: string[]): number {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    // Build adjacency list using pattern matching
    const patternMap = new Map<string, string[]>();
    const allWords = [beginWord, ...wordList];
    
    for (const word of allWords) {
        for (let i = 0; i < word.length; i++) {
            const pattern = word.slice(0, i) + '*' + word.slice(i + 1);
            if (!patternMap.has(pattern)) {
                patternMap.set(pattern, []);
            }
            patternMap.get(pattern)!.push(word);
        }
    }
    
    const queue: [string, number][] = [[beginWord, 1]];
    const visited = new Set<string>();
    visited.add(beginWord);
    
    while (queue.length > 0) {
        const [currentWord, level] = queue.shift()!;
        
        if (currentWord === endWord) {
            return level;
        }
        
        // Check all patterns for current word
        for (let i = 0; i < currentWord.length; i++) {
            const pattern = currentWord.slice(0, i) + '*' + currentWord.slice(i + 1);
            const neighbors = patternMap.get(pattern) || [];
            
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([neighbor, level + 1]);
                }
            }
        }
    }
    
    return 0;
}

// Solution 4: DFS with Memoization
// Time: O(M²×N), Space: O(M²×N)
export function ladderLength4(beginWord: string, endWord: string, wordList: string[]): number {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    const memo = new Map<string, number>();
    
    function canTransform(word1: string, word2: string): boolean {
        let diff = 0;
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] !== word2[i]) {
                diff++;
                if (diff > 1) return false;
            }
        }
        return diff === 1;
    }
    
    function dfs(currentWord: string, visited: Set<string>): number {
        if (currentWord === endWord) return 1;
        
        const key = currentWord + '|' + Array.from(visited).sort().join(',');
        if (memo.has(key)) return memo.get(key)!;
        
        let minLength = Infinity;
        
        for (const word of wordSet) {
            if (!visited.has(word) && canTransform(currentWord, word)) {
                visited.add(word);
                const length = dfs(word, visited);
                if (length !== Infinity) {
                    minLength = Math.min(minLength, length + 1);
                }
                visited.delete(word);
            }
        }
        
        memo.set(key, minLength);
        return minLength;
    }
    
    const result = dfs(beginWord, new Set([beginWord]));
    return result === Infinity ? 0 : result;
}

// Solution 5: A* Search Algorithm
// Time: O(M²×N log N), Space: O(M²×N)
export function ladderLength5(beginWord: string, endWord: string, wordList: string[]): number {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    function heuristic(word1: string, word2: string): number {
        let diff = 0;
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] !== word2[i]) diff++;
        }
        return diff;
    }
    
    function getNeighbors(word: string): string[] {
        const neighbors: string[] = [];
        for (let i = 0; i < word.length; i++) {
            for (let charCode = 97; charCode <= 122; charCode++) {
                const newChar = String.fromCharCode(charCode);
                if (newChar === word[i]) continue;
                
                const newWord = word.slice(0, i) + newChar + word.slice(i + 1);
                if (wordSet.has(newWord)) {
                    neighbors.push(newWord);
                }
            }
        }
        return neighbors;
    }
    
    // Priority queue: [fScore, gScore, word]
    const openSet: [number, number, string][] = [[heuristic(beginWord, endWord), 0, beginWord]];
    const gScore = new Map<string, number>();
    gScore.set(beginWord, 0);
    
    while (openSet.length > 0) {
        // Find node with lowest fScore
        openSet.sort((a, b) => a[0] - b[0]);
        const [, g, current] = openSet.shift()!;
        
        if (current === endWord) {
            return g + 1;
        }
        
        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
            const tentativeG = g + 1;
            
            if (!gScore.has(neighbor) || tentativeG < gScore.get(neighbor)!) {
                gScore.set(neighbor, tentativeG);
                const fScore = tentativeG + heuristic(neighbor, endWord);
                openSet.push([fScore, tentativeG, neighbor]);
            }
        }
    }
    
    return 0;
}

// Test cases
export function testLadderLength() {
    console.log("Testing Word Ladder:");
    
    const testCases = [
        {
            beginWord: "hit",
            endWord: "cog",
            wordList: ["hot", "dot", "dog", "lot", "log", "cog"],
            expected: 5
        },
        {
            beginWord: "hit",
            endWord: "cog",
            wordList: ["hot", "dot", "dog", "lot", "log"],
            expected: 0
        },
        {
            beginWord: "a",
            endWord: "c",
            wordList: ["a", "b", "c"],
            expected: 2
        },
        {
            beginWord: "hot",
            endWord: "dog",
            wordList: ["hot", "dog"],
            expected: 0
        },
        {
            beginWord: "hot",
            endWord: "dog",
            wordList: ["hot", "hog", "dog"],
            expected: 3
        }
    ];
    
    const solutions = [
        { name: "BFS", fn: ladderLength1 },
        { name: "Bidirectional BFS", fn: ladderLength2 },
        { name: "BFS with Patterns", fn: ladderLength3 },
        { name: "DFS with Memoization", fn: ladderLength4 },
        { name: "A* Search", fn: ladderLength5 }
    ];
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.beginWord, test.endWord, test.wordList);
            const passed = result === test.expected;
            console.log(`  Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Expected: ${test.expected}`);
                console.log(`    Got: ${result}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Graph Problem Recognition**:
 *    - Each word is a node
 *    - Edge exists between words differing by exactly one character
 *    - Find shortest path from beginWord to endWord
 * 
 * 2. **BFS vs DFS**:
 *    - BFS finds shortest path naturally (level-order traversal)
 *    - DFS needs memoization to avoid exponential time
 *    - BFS preferred for shortest path problems
 * 
 * 3. **Optimization Techniques**:
 *    - Bidirectional BFS: Search from both ends
 *    - Pattern matching: Pre-compute adjacency relationships
 *    - A* search: Use heuristic to guide search
 * 
 * 4. **Time Complexity**: O(M²×N)
 *    - M = length of each word
 *    - N = number of words in wordList
 *    - For each word, try M×26 transformations
 * 
 * 5. **Space Complexity**: O(M²×N)
 *    - Storing visited words and queue
 *    - Pattern map in solution 3
 * 
 * 6. **Interview Strategy**:
 *    - Recognize as shortest path problem
 *    - Start with BFS approach
 *    - Optimize with bidirectional search
 *    - Discuss pattern matching optimization
 * 
 * 7. **Edge Cases**:
 *    - endWord not in wordList
 *    - beginWord equals endWord
 *    - No transformation possible
 *    - Single character words
 * 
 * 8. **Big Tech Focus**:
 *    - Google: Often asks about optimization techniques
 *    - Facebook: Focuses on bidirectional BFS
 *    - Amazon: Tests edge case handling
 *    - Microsoft: Emphasizes clean code structure
 * 
 * 9. **Follow-up Questions**:
 *    - Return the actual transformation sequence
 *    - Find all shortest transformation sequences
 *    - Handle case-insensitive transformations
 *    - Optimize for multiple queries
 * 
 * 10. **Common Mistakes**:
 *     - Using DFS without memoization
 *     - Not checking if endWord exists in wordList
 *     - Incorrect neighbor generation
 *     - Off-by-one errors in path length
 */
{% endraw %}
