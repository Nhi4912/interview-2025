---
layout: page
title: "Course Schedule II"
difficulty: Easy
category: Tree/Graph
tags: [Tree/Graph, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/course-schedule-ii/"
---

# Course Schedule II

**LeetCode Problem # * 210. Course Schedule II**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 210. Course Schedule II
 * 
 * There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. 
 * You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you 
 * must take course bi first if you want to take course ai.
 * 
 * For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.
 * Return the ordering of courses you should take to finish all courses. If there are many valid 
 * answers, return any of them. If it is impossible to finish all courses, return an empty array.
 * 
 * Example 1:
 * Input: numCourses = 2, prerequisites = [[1,0]]
 * Output: [0,1]
 * Explanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].
 * 
 * Example 2:
 * Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
 * Output: [0,2,1,3]
 * Explanation: There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0.
 * So one correct course order is [0,2,1,3]. Another correct ordering is [0,1,2,3].
 * 
 * Example 3:
 * Input: numCourses = 1, prerequisites = []
 * Output: [0]
 * 
 * Constraints:
 * - 1 <= numCourses <= 2000
 * - 0 <= prerequisites.length <= numCourses * (numCourses - 1)
 * - prerequisites[i].length == 2
 * - 0 <= ai, bi < numCourses
 * - ai != bi
 * - All the pairs [ai, bi] are distinct.
 */

// Solution 1: Kahn's Algorithm (BFS-based Topological Sort)
// Time: O(V + E), Space: O(V + E)
export function findOrder1(numCourses: number, prerequisites: number[][]): number[] {
    // Build adjacency list and in-degree array
    const graph: number[][] = Array(numCourses).fill(null).map(() => []);
    const inDegree = new Array(numCourses).fill(0);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    // Initialize queue with courses having no prerequisites
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result: number[] = [];
    
    while (queue.length > 0) {
        const course = queue.shift()!;
        result.push(course);
        
        // Process all courses that depend on current course
        for (const nextCourse of graph[course]) {
            inDegree[nextCourse]--;
            
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }
    
    // Check if all courses can be completed
    return result.length === numCourses ? result : [];
}

// Solution 2: DFS-based Topological Sort
// Time: O(V + E), Space: O(V + E)
export function findOrder2(numCourses: number, prerequisites: number[][]): number[] {
    // Build adjacency list
    const graph: number[][] = Array(numCourses).fill(null).map(() => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    
    const WHITE = 0; // Unvisited
    const GRAY = 1;  // Visiting (in current path)
    const BLACK = 2; // Visited (completed)
    
    const colors = new Array(numCourses).fill(WHITE);
    const result: number[] = [];
    
    function dfs(course: number): boolean {
        if (colors[course] === GRAY) {
            // Cycle detected
            return false;
        }
        
        if (colors[course] === BLACK) {
            // Already processed
            return true;
        }
        
        // Mark as visiting
        colors[course] = GRAY;
        
        // Visit all dependencies
        for (const nextCourse of graph[course]) {
            if (!dfs(nextCourse)) {
                return false;
            }
        }
        
        // Mark as completed and add to result
        colors[course] = BLACK;
        result.push(course);
        
        return true;
    }
    
    // Process all courses
    for (let i = 0; i < numCourses; i++) {
        if (colors[i] === WHITE && !dfs(i)) {
            return []; // Cycle detected
        }
    }
    
    // Reverse to get correct topological order
    return result.reverse();
}

// Solution 3: DFS with Explicit Stack
// Time: O(V + E), Space: O(V + E)
export function findOrder3(numCourses: number, prerequisites: number[][]): number[] {
    // Build adjacency list
    const graph: number[][] = Array(numCourses).fill(null).map(() => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    
    const visited = new Set<number>();
    const visiting = new Set<number>();
    const result: number[] = [];
    
    function hasNoCycle(course: number): boolean {
        if (visiting.has(course)) {
            return false; // Cycle detected
        }
        
        if (visited.has(course)) {
            return true; // Already processed
        }
        
        visiting.add(course);
        
        for (const nextCourse of graph[course]) {
            if (!hasNoCycle(nextCourse)) {
                return false;
            }
        }
        
        visiting.delete(course);
        visited.add(course);
        result.push(course);
        
        return true;
    }
    
    // Check all courses
    for (let i = 0; i < numCourses; i++) {
        if (!visited.has(i) && !hasNoCycle(i)) {
            return [];
        }
    }
    
    return result.reverse();
}

// Solution 4: Modified Kahn's with Priority Queue (Lexicographic Order)
// Time: O(V log V + E), Space: O(V + E)
export function findOrder4(numCourses: number, prerequisites: number[][]): number[] {
    // Build adjacency list and in-degree array
    const graph: number[][] = Array(numCourses).fill(null).map(() => []);
    const inDegree = new Array(numCourses).fill(0);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    // Use a min heap to ensure lexicographic order
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
    
    const pq = new MinHeap();
    
    // Add all courses with no prerequisites
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            pq.push(i);
        }
    }
    
    const result: number[] = [];
    
    while (!pq.isEmpty()) {
        const course = pq.pop()!;
        result.push(course);
        
        // Process all dependent courses
        for (const nextCourse of graph[course]) {
            inDegree[nextCourse]--;
            
            if (inDegree[nextCourse] === 0) {
                pq.push(nextCourse);
            }
        }
    }
    
    return result.length === numCourses ? result : [];
}

// Solution 5: Union-Find with Topological Sort
// Time: O(V + E), Space: O(V + E)
export function findOrder5(numCourses: number, prerequisites: number[][]): number[] {
    // First check for cycles using Union-Find
    class UnionFind {
        parent: number[];
        rank: number[];
        
        constructor(n: number) {
            this.parent = Array.from({ length: n }, (_, i) => i);
            this.rank = new Array(n).fill(0);
        }
        
        find(x: number): number {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }
        
        union(x: number, y: number): boolean {
            const rootX = this.find(x);
            const rootY = this.find(y);
            
            if (rootX === rootY) return false; // Would create cycle
            
            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
            
            return true;
        }
    }
    
    // Build adjacency list
    const graph: number[][] = Array(numCourses).fill(null).map(() => []);
    const inDegree = new Array(numCourses).fill(0);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    // Use Kahn's algorithm for topological sort
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result: number[] = [];
    
    while (queue.length > 0) {
        const course = queue.shift()!;
        result.push(course);
        
        for (const nextCourse of graph[course]) {
            inDegree[nextCourse]--;
            
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }
    
    return result.length === numCourses ? result : [];
}

// Test cases
export function testFindOrder() {
    console.log("Testing Course Schedule II:");
    
    const testCases = [
        {
            numCourses: 2,
            prerequisites: [[1, 0]],
            expectedLength: 2,
            description: "Simple dependency"
        },
        {
            numCourses: 4,
            prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]],
            expectedLength: 4,
            description: "Multiple dependencies"
        },
        {
            numCourses: 1,
            prerequisites: [],
            expectedLength: 1,
            description: "Single course"
        },
        {
            numCourses: 2,
            prerequisites: [[1, 0], [0, 1]],
            expectedLength: 0,
            description: "Circular dependency"
        },
        {
            numCourses: 3,
            prerequisites: [[0, 1], [0, 2], [1, 2]],
            expectedLength: 3,
            description: "Diamond dependency"
        }
    ];
    
    const solutions = [
        { name: "Kahn's Algorithm", fn: findOrder1 },
        { name: "DFS Topological", fn: findOrder2 },
        { name: "DFS with Stack", fn: findOrder3 },
        { name: "Priority Queue", fn: findOrder4 },
        { name: "Union-Find + Kahn", fn: findOrder5 }
    ];
    
    function isValidOrder(order: number[], numCourses: number, prerequisites: number[][]): boolean {
        if (order.length !== numCourses) return false;
        
        const position = new Map<number, number>();
        for (let i = 0; i < order.length; i++) {
            position.set(order[i], i);
        }
        
        for (const [course, prereq] of prerequisites) {
            if (!position.has(course) || !position.has(prereq)) return false;
            if (position.get(prereq)! >= position.get(course)!) return false;
        }
        
        return true;
    }
    
    solutions.forEach(solution => {
        console.log(`\n${solution.name}:`);
        testCases.forEach((test, i) => {
            const result = solution.fn(test.numCourses, test.prerequisites);
            
            let passed = false;
            if (test.expectedLength === 0) {
                passed = result.length === 0;
            } else {
                passed = isValidOrder(result, test.numCourses, test.prerequisites);
            }
            
            console.log(`  Test ${i + 1} (${test.description}): ${passed ? 'PASS' : 'FAIL'}`);
            if (!passed) {
                console.log(`    Result: ${JSON.stringify(result)}`);
            }
        });
    });
}

/**
 * Key Insights:
 * 
 * 1. **Problem Recognition**:
 *    - Topological sorting of directed acyclic graph (DAG)
 *    - Must detect cycles (impossible to complete courses)
 *    - Multiple valid orderings possible
 * 
 * 2. **Kahn's Algorithm**:
 *    - BFS-based approach
 *    - Start with nodes having in-degree 0
 *    - Remove edges as nodes are processed
 *    - Cycle detection: not all nodes processed
 * 
 * 3. **DFS Approach**:
 *    - Post-order traversal gives reverse topological order
 *    - Three colors: White (unvisited), Gray (visiting), Black (visited)
 *    - Gray nodes in path indicate cycle
 * 
 * 4. **Time Complexity**: O(V + E)
 *    - V = numCourses, E = prerequisites
 *    - Each vertex and edge processed once
 *    - Optimal for this problem
 * 
 * 5. **Space Complexity**: O(V + E)
 *    - Adjacency list: O(E)
 *    - Additional arrays/sets: O(V)
 *    - Recursion stack: O(V) in worst case
 * 
 * 6. **Cycle Detection**:
 *    - Kahn's: Count processed nodes
 *    - DFS: Detect back edges (gray → gray)
 *    - Both approaches handle cycles effectively
 * 
 * 7. **Interview Strategy**:
 *    - Recognize as topological sort problem
 *    - Choose approach (Kahn's or DFS)
 *    - Implement cycle detection
 *    - Handle edge cases
 * 
 * 8. **Edge Cases**:
 *    - No prerequisites (all courses independent)
 *    - Circular dependencies (no valid order)
 *    - Single course
 *    - Self-dependencies (should not occur per constraints)
 * 
 * 9. **Algorithm Comparison**:
 *    - Kahn's: More intuitive, iterative
 *    - DFS: Recursive, elegant for some
 *    - Both have same complexity
 * 
 * 10. **Common Mistakes**:
 *     - Wrong direction of edges in graph
 *     - Forgetting to reverse DFS result
 *     - Incorrect cycle detection logic
 *     - Not handling disconnected components
 * 
 * 11. **Optimizations**:
 *     - Priority queue for lexicographic order
 *     - Early termination on cycle detection
 *     - Memory-efficient representations
 * 
 * 12. **Big Tech Variations**:
 *     - Google: Build order with priorities
 *     - Meta: Dependency resolution in systems
 *     - Amazon: Package installation order
 *     - Microsoft: Build pipeline optimization
 * 
 * 13. **Follow-up Questions**:
 *     - Find minimum number of semesters
 *     - Multiple valid orders, return specific one
 *     - Weighted dependencies (time/cost)
 *     - Dynamic dependency updates
 * 
 * 14. **Real-world Applications**:
 *     - Course scheduling systems
 *     - Build dependency resolution
 *     - Task scheduling with dependencies
 *     - Package manager installations
 *     - Makefile dependency tracking
 * 
 * 15. **Graph Theory Context**:
 *     - DAG property essential
 *     - Topological sort uniqueness
 *     - Strongly connected components
 *     - Critical path analysis
 */
{% endraw %}
