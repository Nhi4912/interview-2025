# Algorithms & Data Structures for Frontend

## Overview
Frontend engineers need strong algorithmic thinking for optimization, data manipulation, and building efficient user interfaces. This guide covers essential algorithms and data structures with frontend-specific applications.

---

## Essential Data Structures for Frontend

### **Advanced Array Manipulation**

```javascript
// Frontend-specific array algorithms and optimizations
class FrontendArrayAlgorithms {
  
  // Virtual scrolling algorithm for large lists
  static virtualScrolling(items, containerHeight, itemHeight, scrollTop) {
    const totalItems = items.length;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const bufferSize = Math.min(5, Math.floor(visibleCount / 2));
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + bufferSize * 2);
    
    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * itemHeight;
    const totalHeight = totalItems * itemHeight;
    
    return {
      visibleItems,
      startIndex,
      endIndex,
      offsetY,
      totalHeight,
      spacerTop: offsetY,
      spacerBottom: totalHeight - (endIndex + 1) * itemHeight
    };
  }

  // Efficient filtering for real-time search
  static fuzzySearch(items, query, keys = ['name']) {
    if (!query.trim()) return items;
    
    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const results = items.map(item => {
      let score = 0;
      let matches = 0;
      
      for (const key of keys) {
        const value = String(item[key] || '').toLowerCase();
        
        for (const term of queryTerms) {
          // Exact match bonus
          if (value.includes(term)) {
            score += term.length * 10;
            matches++;
          }
          
          // Fuzzy match
          const fuzzyScore = this.fuzzyMatchScore(value, term);
          if (fuzzyScore > 0.5) {
            score += fuzzyScore * 5;
            matches++;
          }
        }
      }
      
      return {
        item,
        score: matches > 0 ? score / queryTerms.length : 0,
        matches
      };
    });
    
    return results
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.item);
  }

  static fuzzyMatchScore(text, pattern) {
    const textLen = text.length;
    const patternLen = pattern.length;
    
    if (patternLen === 0) return 1;
    if (patternLen > textLen) return 0;
    
    // Dynamic programming approach
    const dp = Array(patternLen + 1).fill().map(() => Array(textLen + 1).fill(0));
    
    // Initialize base cases
    for (let j = 0; j <= textLen; j++) {
      dp[0][j] = 1;
    }
    
    for (let i = 1; i <= patternLen; i++) {
      for (let j = i; j <= textLen; j++) {
        if (pattern[i - 1] === text[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = dp[i][j - 1] * 0.9; // Penalty for skipping characters
        }
      }
    }
    
    return dp[patternLen][textLen];
  }

  // Efficient grouping for data visualization
  static groupByWithAggregation(items, groupKey, aggregations = {}) {
    const groups = new Map();
    
    for (const item of items) {
      const key = typeof groupKey === 'function' ? groupKey(item) : item[groupKey];
      
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          items: [],
          count: 0,
          aggregates: {}
        });
      }
      
      const group = groups.get(key);
      group.items.push(item);
      group.count++;
      
      // Calculate aggregations
      for (const [aggKey, aggConfig] of Object.entries(aggregations)) {
        const { field, type } = aggConfig;
        const value = typeof field === 'function' ? field(item) : item[field];
        
        if (!group.aggregates[aggKey]) {
          group.aggregates[aggKey] = type === 'avg' ? { sum: 0, count: 0 } : 
                                     type === 'min' ? Infinity :
                                     type === 'max' ? -Infinity : 0;
        }
        
        switch (type) {
          case 'sum':
            group.aggregates[aggKey] += value || 0;
            break;
          case 'avg':
            group.aggregates[aggKey].sum += value || 0;
            group.aggregates[aggKey].count++;
            break;
          case 'min':
            group.aggregates[aggKey] = Math.min(group.aggregates[aggKey], value || 0);
            break;
          case 'max':
            group.aggregates[aggKey] = Math.max(group.aggregates[aggKey], value || 0);
            break;
          case 'count':
            group.aggregates[aggKey]++;
            break;
        }
      }
    }
    
    // Finalize average calculations
    for (const group of groups.values()) {
      for (const [aggKey, aggConfig] of Object.entries(aggregations)) {
        if (aggConfig.type === 'avg' && group.aggregates[aggKey]) {
          const { sum, count } = group.aggregates[aggKey];
          group.aggregates[aggKey] = count > 0 ? sum / count : 0;
        }
      }
    }
    
    return Array.from(groups.values());
  }

  // Optimized sorting for UI tables
  static multiColumnSort(items, sortConfigs) {
    return items.slice().sort((a, b) => {
      for (const config of sortConfigs) {
        const { key, direction = 'asc', type = 'string' } = config;
        
        let valueA = typeof key === 'function' ? key(a) : a[key];
        let valueB = typeof key === 'function' ? key(b) : b[key];
        
        // Handle null/undefined values
        if (valueA == null && valueB == null) continue;
        if (valueA == null) return direction === 'asc' ? 1 : -1;
        if (valueB == null) return direction === 'asc' ? -1 : 1;
        
        // Type-specific comparison
        let comparison = 0;
        switch (type) {
          case 'number':
            comparison = Number(valueA) - Number(valueB);
            break;
          case 'date':
            comparison = new Date(valueA) - new Date(valueB);
            break;
          case 'string':
          default:
            comparison = String(valueA).localeCompare(String(valueB));
            break;
        }
        
        if (comparison !== 0) {
          return direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }

  // Efficient pagination with cursor-based approach
  static paginateWithCursor(items, cursor = null, pageSize = 10, sortKey = 'id') {
    let startIndex = 0;
    
    if (cursor) {
      startIndex = items.findIndex(item => 
        (typeof sortKey === 'function' ? sortKey(item) : item[sortKey]) > cursor
      );
      if (startIndex === -1) startIndex = items.length;
    }
    
    const pageItems = items.slice(startIndex, startIndex + pageSize);
    const hasNext = startIndex + pageSize < items.length;
    const nextCursor = hasNext && pageItems.length > 0 ?
      (typeof sortKey === 'function' ? sortKey(pageItems[pageItems.length - 1]) : 
       pageItems[pageItems.length - 1][sortKey]) : null;
    
    return {
      items: pageItems,
      hasNext,
      nextCursor,
      totalCount: items.length,
      pageSize
    };
  }
}
```

### **Tree Structures for UI Components**

```javascript
// Tree data structures for hierarchical UI components
class UITreeStructures {
  
  // Tree structure for nested menus/navigation
  static buildNavigationTree(flatItems, parentKey = 'parentId', idKey = 'id') {
    const itemMap = new Map();
    const rootItems = [];
    
    // First pass: create lookup map
    for (const item of flatItems) {
      itemMap.set(item[idKey], { ...item, children: [] });
    }
    
    // Second pass: build tree structure
    for (const item of flatItems) {
      const treeItem = itemMap.get(item[idKey]);
      const parentId = item[parentKey];
      
      if (parentId && itemMap.has(parentId)) {
        itemMap.get(parentId).children.push(treeItem);
      } else {
        rootItems.push(treeItem);
      }
    }
    
    return rootItems;
  }

  // Tree traversal for component hierarchy
  static traverseComponentTree(rootComponent, callback, traversalType = 'preorder') {
    const results = [];
    
    const preorderTraversal = (component, depth = 0, path = []) => {
      const currentPath = [...path, component.id || component.name];
      const result = callback(component, depth, currentPath);
      if (result !== undefined) results.push(result);
      
      if (component.children) {
        for (const child of component.children) {
          preorderTraversal(child, depth + 1, currentPath);
        }
      }
    };
    
    const postorderTraversal = (component, depth = 0, path = []) => {
      const currentPath = [...path, component.id || component.name];
      
      if (component.children) {
        for (const child of component.children) {
          postorderTraversal(child, depth + 1, currentPath);
        }
      }
      
      const result = callback(component, depth, currentPath);
      if (result !== undefined) results.push(result);
    };
    
    const levelOrderTraversal = (rootComponent) => {
      const queue = [{ component: rootComponent, depth: 0, path: [] }];
      
      while (queue.length > 0) {
        const { component, depth, path } = queue.shift();
        const currentPath = [...path, component.id || component.name];
        
        const result = callback(component, depth, currentPath);
        if (result !== undefined) results.push(result);
        
        if (component.children) {
          for (const child of component.children) {
            queue.push({ component: child, depth: depth + 1, path: currentPath });
          }
        }
      }
    };
    
    switch (traversalType) {
      case 'preorder':
        preorderTraversal(rootComponent);
        break;
      case 'postorder':
        postorderTraversal(rootComponent);
        break;
      case 'levelorder':
        levelOrderTraversal(rootComponent);
        break;
    }
    
    return results;
  }

  // Find node in tree with path tracking
  static findNodeWithPath(tree, predicate, path = []) {
    if (predicate(tree)) {
      return { node: tree, path: [...path, tree] };
    }
    
    if (tree.children) {
      for (const child of tree.children) {
        const result = this.findNodeWithPath(child, predicate, [...path, tree]);
        if (result) return result;
      }
    }
    
    return null;
  }

  // Tree diffing algorithm for efficient updates
  static diffTrees(oldTree, newTree, options = {}) {
    const { 
      keyProperty = 'id',
      compareProperties = ['name', 'value', 'type']
    } = options;
    
    const changes = [];
    
    const diff = (oldNode, newNode, path = []) => {
      const currentPath = [...path];
      
      if (!oldNode && newNode) {
        // Node added
        changes.push({
          type: 'ADD',
          path: currentPath,
          node: newNode
        });
        return;
      }
      
      if (oldNode && !newNode) {
        // Node removed
        changes.push({
          type: 'REMOVE',
          path: currentPath,
          node: oldNode
        });
        return;
      }
      
      if (!oldNode && !newNode) return;
      
      // Check for property changes
      const propertyChanges = {};
      for (const prop of compareProperties) {
        if (oldNode[prop] !== newNode[prop]) {
          propertyChanges[prop] = {
            old: oldNode[prop],
            new: newNode[prop]
          };
        }
      }
      
      if (Object.keys(propertyChanges).length > 0) {
        changes.push({
          type: 'UPDATE',
          path: currentPath,
          changes: propertyChanges
        });
      }
      
      // Diff children
      this.diffChildren(
        oldNode.children || [],
        newNode.children || [],
        [...currentPath, newNode[keyProperty]],
        keyProperty,
        changes
      );
    };
    
    diff(oldTree, newTree);
    return changes;
  }

  static diffChildren(oldChildren, newChildren, path, keyProperty, changes) {
    const oldMap = new Map();
    const newMap = new Map();
    
    // Create lookup maps
    for (const child of oldChildren) {
      oldMap.set(child[keyProperty], child);
    }
    
    for (const child of newChildren) {
      newMap.set(child[keyProperty], child);
    }
    
    // Find added, removed, and updated children
    for (const [key, newChild] of newMap) {
      const oldChild = oldMap.get(key);
      this.diffTrees(oldChild, newChild, [...path, key]);
    }
    
    // Find removed children
    for (const [key, oldChild] of oldMap) {
      if (!newMap.has(key)) {
        changes.push({
          type: 'REMOVE',
          path: [...path, key],
          node: oldChild
        });
      }
    }
  }

  // Virtualized tree rendering for large hierarchies
  static virtualizeTree(tree, visibleRange, itemHeight) {
    const flattenedNodes = [];
    const expandedNodes = new Set();
    
    const flatten = (node, depth = 0, parentExpanded = true) => {
      if (!parentExpanded) return;
      
      flattenedNodes.push({
        ...node,
        depth,
        index: flattenedNodes.length,
        hasChildren: node.children && node.children.length > 0,
        isExpanded: expandedNodes.has(node.id)
      });
      
      if (node.children && expandedNodes.has(node.id)) {
        for (const child of node.children) {
          flatten(child, depth + 1, true);
        }
      }
    };
    
    flatten(tree);
    
    const { startIndex, endIndex } = visibleRange;
    const visibleNodes = flattenedNodes.slice(startIndex, endIndex + 1);
    
    return {
      totalHeight: flattenedNodes.length * itemHeight,
      visibleNodes,
      totalCount: flattenedNodes.length,
      toggleExpanded: (nodeId) => {
        if (expandedNodes.has(nodeId)) {
          expandedNodes.delete(nodeId);
        } else {
          expandedNodes.add(nodeId);
        }
        return this.virtualizeTree(tree, visibleRange, itemHeight);
      }
    };
  }
}
```

---

## Graph Algorithms for Frontend

### **Component Dependency Resolution**

{% raw %}
```javascript
// Graph algorithms for managing component dependencies and relationships
class FrontendGraphAlgorithms {
  
  // Topological sort for component loading order
  static topologicalSort(dependencies) {
    const graph = new Map();
    const inDegree = new Map();
    const result = [];
    
    // Build graph and calculate in-degrees
    for (const [component, deps] of Object.entries(dependencies)) {
      if (!graph.has(component)) {
        graph.set(component, []);
        inDegree.set(component, 0);
      }
      
      for (const dep of deps) {
        if (!graph.has(dep)) {
          graph.set(dep, []);
          inDegree.set(dep, 0);
        }
        
        graph.get(dep).push(component);
        inDegree.set(component, inDegree.get(component) + 1);
      }
    }
    
    // Kahn's algorithm
    const queue = [];
    for (const [component, degree] of inDegree) {
      if (degree === 0) {
        queue.push(component);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current);
      
      for (const neighbor of graph.get(current) || []) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    // Check for circular dependencies
    if (result.length !== inDegree.size) {
      const remaining = Array.from(inDegree.keys()).filter(k => !result.includes(k));
      throw new Error(`Circular dependency detected: ${remaining.join(', ')}`);
    }
    
    return result;
  }

  // Find strongly connected components for circular dependency detection
  static findStronglyConnectedComponents(graph) {
    const visited = new Set();
    const stack = [];
    const components = [];
    
    // First DFS to fill stack
    const dfs1 = (node) => {
      visited.add(node);
      for (const neighbor of graph.get(node) || []) {
        if (!visited.has(neighbor)) {
          dfs1(neighbor);
        }
      }
      stack.push(node);
    };
    
    // Build reverse graph
    const reverseGraph = new Map();
    for (const [node, neighbors] of graph) {
      if (!reverseGraph.has(node)) {
        reverseGraph.set(node, []);
      }
      for (const neighbor of neighbors) {
        if (!reverseGraph.has(neighbor)) {
          reverseGraph.set(neighbor, []);
        }
        reverseGraph.get(neighbor).push(node);
      }
    }
    
    // Second DFS on reverse graph
    const dfs2 = (node, component) => {
      visited.add(node);
      component.push(node);
      for (const neighbor of reverseGraph.get(node) || []) {
        if (!visited.has(neighbor)) {
          dfs2(neighbor, component);
        }
      }
    };
    
    // Process all nodes
    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        dfs1(node);
      }
    }
    
    visited.clear();
    
    while (stack.length > 0) {
      const node = stack.pop();
      if (!visited.has(node)) {
        const component = [];
        dfs2(node, component);
        components.push(component);
      }
    }
    
    return components;
  }

  // Shortest path for component communication
  static findShortestPath(graph, start, end) {
    if (start === end) return [start];
    
    const queue = [[start]];
    const visited = new Set([start]);
    
    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];
      
      for (const neighbor of graph.get(current) || []) {
        if (neighbor === end) {
          return [...path, neighbor];
        }
        
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }
    
    return null; // No path found
  }

  // Component hierarchy analysis using graph traversal
  static analyzeComponentHierarchy(componentTree) {
    const analysis = {
      depth: 0,
      breadth: 0,
      totalComponents: 0,
      leafComponents: 0,
      componentsByLevel: new Map(),
      cyclomaticComplexity: 0
    };
    
    const queue = [{ component: componentTree, level: 0 }];
    const visited = new Set();
    
    while (queue.length > 0) {
      const { component, level } = queue.shift();
      
      if (visited.has(component.id)) {
        analysis.cyclomaticComplexity++; // Potential cycle
        continue;
      }
      
      visited.add(component.id);
      analysis.totalComponents++;
      analysis.depth = Math.max(analysis.depth, level);
      
      if (!analysis.componentsByLevel.has(level)) {
        analysis.componentsByLevel.set(level, 0);
      }
      analysis.componentsByLevel.set(level, analysis.componentsByLevel.get(level) + 1);
      
      if (!component.children || component.children.length === 0) {
        analysis.leafComponents++;
      } else {
        analysis.breadth = Math.max(analysis.breadth, component.children.length);
        for (const child of component.children) {
          queue.push({ component: child, level: level + 1 });
        }
      }
    }
    
    return analysis;
  }

  // Graph coloring for conflict resolution
  static graphColoring(conflictGraph, colors = ['red', 'blue', 'green', 'yellow']) {
    const coloring = new Map();
    const nodes = Array.from(conflictGraph.keys());
    
    // Sort nodes by degree (most connected first)
    nodes.sort((a, b) => {
      const degreeA = conflictGraph.get(a)?.length || 0;
      const degreeB = conflictGraph.get(b)?.length || 0;
      return degreeB - degreeA;
    });
    
    for (const node of nodes) {
      const usedColors = new Set();
      
      // Check colors used by neighbors
      for (const neighbor of conflictGraph.get(node) || []) {
        if (coloring.has(neighbor)) {
          usedColors.add(coloring.get(neighbor));
        }
      }
      
      // Find first available color
      for (const color of colors) {
        if (!usedColors.has(color)) {
          coloring.set(node, color);
          break;
        }
      }
      
      // If no color available, add a new one
      if (!coloring.has(node)) {
        const newColor = `color_${colors.length}`;
        colors.push(newColor);
        coloring.set(node, newColor);
      }
    }
    
    return {
      coloring: Object.fromEntries(coloring),
      colorCount: new Set(coloring.values()).size,
      isValidColoring: this.validateColoring(conflictGraph, coloring)
    };
  }

  static validateColoring(graph, coloring) {
    for (const [node, neighbors] of graph) {
      const nodeColor = coloring.get(node);
      for (const neighbor of neighbors) {
        if (coloring.get(neighbor) === nodeColor) {
          return false;
        }
      }
    }
    return true;
  }

  // Minimum spanning tree for optimal component connections
  static minimumSpanningTree(graph, weights) {
    const mst = [];
    const visited = new Set();
    const edges = [];
    
    // Convert graph to edge list
    for (const [from, neighbors] of graph) {
      for (const to of neighbors) {
        const weight = weights.get(`${from}-${to}`) || weights.get(`${to}-${from}`) || 1;
        edges.push({ from, to, weight });
      }
    }
    
    // Sort edges by weight
    edges.sort((a, b) => a.weight - b.weight);
    
    // Union-Find data structure
    const parent = new Map();
    const rank = new Map();
    
    const find = (x) => {
      if (!parent.has(x)) {
        parent.set(x, x);
        rank.set(x, 0);
      }
      if (parent.get(x) !== x) {
        parent.set(x, find(parent.get(x)));
      }
      return parent.get(x);
    };
    
    const union = (x, y) => {
      const rootX = find(x);
      const rootY = find(y);
      
      if (rootX !== rootY) {
        if (rank.get(rootX) < rank.get(rootY)) {
          parent.set(rootX, rootY);
        } else if (rank.get(rootX) > rank.get(rootY)) {
          parent.set(rootY, rootX);
        } else {
          parent.set(rootY, rootX);
          rank.set(rootX, rank.get(rootX) + 1);
        }
        return true;
      }
      return false;
    };
    
    // Kruskal's algorithm
    for (const edge of edges) {
      if (union(edge.from, edge.to)) {
        mst.push(edge);
      }
    }
    
    return mst;
  }
}
```
{% endraw %}

---

## Optimization Algorithms

### **Frontend-Specific Optimizations**

```javascript
// Optimization algorithms for frontend performance
class FrontendOptimizationAlgorithms {
  
  // Bundle splitting optimization using dynamic programming
  static optimizeBundleSplitting(modules, maxBundleSize = 250000) {
    const n = modules.length;
    const dp = Array(n + 1).fill().map(() => Array(maxBundleSize + 1).fill(0));
    const bundles = [];
    
    // Sort modules by importance/usage frequency
    modules.sort((a, b) => (b.importance || 0) - (a.importance || 0));
    
    // Dynamic programming to find optimal bundles
    for (let i = 1; i <= n; i++) {
      const module = modules[i - 1];
      const size = module.size;
      const value = module.importance || 1;
      
      for (let w = 0; w <= maxBundleSize; w++) {
        dp[i][w] = dp[i - 1][w]; // Don't include current module
        
        if (size <= w) {
          dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - size] + value);
        }
      }
    }
    
    // Backtrack to find which modules to include
    let w = maxBundleSize;
    const currentBundle = [];
    let currentSize = 0;
    
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        const module = modules[i - 1];
        currentBundle.push(module);
        currentSize += module.size;
        w -= module.size;
      }
    }
    
    bundles.push({
      modules: currentBundle,
      size: currentSize,
      value: dp[n][maxBundleSize]
    });
    
    // Recursively create remaining bundles
    const remainingModules = modules.filter(m => !currentBundle.includes(m));
    if (remainingModules.length > 0) {
      const remainingBundles = this.optimizeBundleSplitting(remainingModules, maxBundleSize);
      bundles.push(...remainingBundles);
    }
    
    return bundles;
  }

  // Resource loading optimization using greedy algorithm
  static optimizeResourceLoading(resources, bandwidth = 1000000) { // 1MB/s default
    const critical = resources.filter(r => r.critical);
    const nonCritical = resources.filter(r => !r.critical);
    
    // Sort critical resources by priority, non-critical by size/importance ratio
    critical.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    nonCritical.sort((a, b) => {
      const ratioA = (a.importance || 1) / a.size;
      const ratioB = (b.importance || 1) / b.size;
      return ratioB - ratioA;
    });
    
    const loadingSchedule = [];
    let currentTime = 0;
    let currentBandwidth = bandwidth;
    
    // Schedule critical resources first
    for (const resource of critical) {
      const loadTime = resource.size / currentBandwidth;
      loadingSchedule.push({
        resource,
        startTime: currentTime,
        endTime: currentTime + loadTime,
        priority: 'critical'
      });
      currentTime += loadTime;
    }
    
    // Schedule non-critical resources
    const nonCriticalBatches = this.createLoadingBatches(nonCritical, bandwidth);
    
    for (const batch of nonCriticalBatches) {
      const batchStartTime = currentTime;
      let maxBatchTime = 0;
      
      for (const resource of batch) {
        const loadTime = resource.size / (bandwidth / batch.length); // Parallel loading
        loadingSchedule.push({
          resource,
          startTime: batchStartTime,
          endTime: batchStartTime + loadTime,
          priority: 'normal'
        });
        maxBatchTime = Math.max(maxBatchTime, loadTime);
      }
      
      currentTime += maxBatchTime;
    }
    
    return {
      schedule: loadingSchedule,
      totalTime: currentTime,
      criticalTime: critical.reduce((sum, r) => sum + (r.size / bandwidth), 0)
    };
  }

  static createLoadingBatches(resources, bandwidth) {
    const batches = [];
    let currentBatch = [];
    let currentBatchSize = 0;
    const maxBatchSize = bandwidth * 0.5; // Don't exceed 50% bandwidth per batch
    
    for (const resource of resources) {
      if (currentBatchSize + resource.size > maxBatchSize && currentBatch.length > 0) {
        batches.push([...currentBatch]);
        currentBatch = [resource];
        currentBatchSize = resource.size;
      } else {
        currentBatch.push(resource);
        currentBatchSize += resource.size;
      }
    }
    
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }
    
    return batches;
  }

  // Cache optimization using LRU and frequency-based algorithms
  static optimizeCache(accessPattern, cacheSize = 100) {
    const lruCache = new Map();
    const frequencyCache = new Map();
    const accessCount = new Map();
    
    let lruHits = 0;
    let frequencyHits = 0;
    
    // Simulate LRU cache
    for (const item of accessPattern) {
      if (lruCache.has(item)) {
        lruHits++;
        // Move to end (most recently used)
        lruCache.delete(item);
        lruCache.set(item, true);
      } else {
        if (lruCache.size >= cacheSize) {
          // Remove least recently used (first item)
          const lru = lruCache.keys().next().value;
          lruCache.delete(lru);
        }
        lruCache.set(item, true);
      }
    }
    
    // Reset for frequency-based cache
    for (const item of accessPattern) {
      accessCount.set(item, (accessCount.get(item) || 0) + 1);
      
      if (frequencyCache.has(item)) {
        frequencyHits++;
      } else {
        if (frequencyCache.size >= cacheSize) {
          // Remove least frequently used
          let lfu = null;
          let minCount = Infinity;
          
          for (const cachedItem of frequencyCache.keys()) {
            const count = accessCount.get(cachedItem) || 0;
            if (count < minCount) {
              minCount = count;
              lfu = cachedItem;
            }
          }
          
          if (lfu) {
            frequencyCache.delete(lfu);
          }
        }
        frequencyCache.set(item, true);
      }
    }
    
    return {
      lru: {
        hits: lruHits,
        hitRate: lruHits / accessPattern.length
      },
      frequency: {
        hits: frequencyHits,
        hitRate: frequencyHits / accessPattern.length
      },
      recommendation: frequencyHits > lruHits ? 'frequency-based' : 'lru'
    };
  }

  // Image optimization algorithm
  static optimizeImageLoading(images, viewportSize = { width: 1920, height: 1080 }) {
    const optimizedImages = [];
    
    for (const image of images) {
      const optimization = {
        original: image,
        recommendations: []
      };
      
      // Resize recommendation
      if (image.width > viewportSize.width || image.height > viewportSize.height) {
        const scale = Math.min(
          viewportSize.width / image.width,
          viewportSize.height / image.height
        );
        
        optimization.recommendations.push({
          type: 'resize',
          newWidth: Math.floor(image.width * scale),
          newHeight: Math.floor(image.height * scale),
          savings: `${(100 - scale * 100).toFixed(1)}% size reduction`
        });
      }
      
      // Format recommendation
      const formatRecommendation = this.getOptimalImageFormat(image);
      if (formatRecommendation) {
        optimization.recommendations.push(formatRecommendation);
      }
      
      // Lazy loading recommendation
      if (!image.critical) {
        optimization.recommendations.push({
          type: 'lazy-loading',
          description: 'Load image when it enters viewport'
        });
      }
      
      // Progressive loading recommendation
      if (image.size > 100000) { // 100KB
        optimization.recommendations.push({
          type: 'progressive',
          description: 'Use progressive JPEG or WebP'
        });
      }
      
      optimizedImages.push(optimization);
    }
    
    return optimizedImages;
  }

  static getOptimalImageFormat(image) {
    if (image.hasTransparency) {
      return {
        type: 'format',
        recommendation: 'WebP or PNG',
        reason: 'Image has transparency'
      };
    }
    
    if (image.isPhoto) {
      return {
        type: 'format',
        recommendation: 'WebP or JPEG',
        reason: 'Photographic content compresses well with lossy formats'
      };
    }
    
    if (image.hasText || image.isIcon) {
      return {
        type: 'format',
        recommendation: 'SVG or WebP',
        reason: 'Vector format better for text and icons'
      };
    }
    
    return null;
  }

  // Code splitting optimization
  static optimizeCodeSplitting(componentUsage, bundleTargetSize = 250000) {
    const components = Object.entries(componentUsage).map(([name, data]) => ({
      name,
      ...data
    }));
    
    // Group components by usage patterns
    const highFrequency = components.filter(c => c.frequency > 0.7);
    const mediumFrequency = components.filter(c => c.frequency > 0.3 && c.frequency <= 0.7);
    const lowFrequency = components.filter(c => c.frequency <= 0.3);
    
    const splitStrategy = {
      core: {
        components: highFrequency,
        priority: 'critical',
        loadStrategy: 'eager'
      },
      features: this.groupComponentsByFeature(mediumFrequency, bundleTargetSize),
      lazy: {
        components: lowFrequency,
        priority: 'low',
        loadStrategy: 'lazy'
      }
    };
    
    return splitStrategy;
  }

  static groupComponentsByFeature(components, targetSize) {
    const features = new Map();
    
    // Group by feature/route
    for (const component of components) {
      const feature = component.feature || component.route || 'common';
      if (!features.has(feature)) {
        features.set(feature, []);
      }
      features.get(feature).push(component);
    }
    
    // Optimize bundle sizes within features
    const optimizedFeatures = [];
    
    for (const [featureName, featureComponents] of features) {
      const totalSize = featureComponents.reduce((sum, c) => sum + c.size, 0);
      
      if (totalSize <= targetSize) {
        optimizedFeatures.push({
          name: featureName,
          components: featureComponents,
          size: totalSize,
          loadStrategy: 'route-based'
        });
      } else {
        // Split large features into smaller bundles
        const subBundles = this.splitLargeFeature(featureComponents, targetSize);
        optimizedFeatures.push(...subBundles.map(bundle => ({
          name: `${featureName}-${bundle.index}`,
          components: bundle.components,
          size: bundle.size,
          loadStrategy: 'progressive'
        })));
      }
    }
    
    return optimizedFeatures;
  }

  static splitLargeFeature(components, targetSize) {
    const bundles = [];
    let currentBundle = [];
    let currentSize = 0;
    let bundleIndex = 0;
    
    // Sort by dependency order and importance
    components.sort((a, b) => (b.importance || 0) - (a.importance || 0));
    
    for (const component of components) {
      if (currentSize + component.size > targetSize && currentBundle.length > 0) {
        bundles.push({
          index: bundleIndex++,
          components: [...currentBundle],
          size: currentSize
        });
        currentBundle = [component];
        currentSize = component.size;
      } else {
        currentBundle.push(component);
        currentSize += component.size;
      }
    }
    
    if (currentBundle.length > 0) {
      bundles.push({
        index: bundleIndex,
        components: currentBundle,
        size: currentSize
      });
    }
    
    return bundles;
  }
}
```

This comprehensive guide provides essential algorithms and data structures specifically tailored for frontend development challenges, optimization problems, and user interface requirements commonly encountered in Big Tech interviews.
