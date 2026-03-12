---
layout: page
title: "Browser Architecture and Rendering Pipeline Deep Dive"
description: "Comprehensive guide to browser internals, rendering pipeline, performance optimization, and debugging techniques for frontend interviews"
category: "Theory"
tags: [browser-architecture, rendering-pipeline, performance, optimization, dom, cssom, layout, paint, composite, web-vitals]
---

# Browser Architecture and Rendering Pipeline Deep Dive

## 🎯 Overview

Understanding browser internals is crucial for frontend interviews at big tech companies. This guide provides deep insights into how browsers work, enabling you to answer performance, debugging, and optimization questions with confidence.

## 🏗️ Browser Architecture Overview

### Multi-Process Architecture

Modern browsers use a multi-process architecture for security, stability, and performance:

```mermaid
graph TB
    subgraph "Browser Process"
        A[UI Thread] --> B[Network Thread]
        B --> C[Storage Thread]
        C --> D[Device Thread]
    end
    
    subgraph "Renderer Process"
        E[Main Thread] --> F[Compositor Thread]
        F --> G[Web Workers]
    end
    
    subgraph "GPU Process"
        H[Graphics Operations]
        I[Hardware Acceleration]
    end
    
    subgraph "Plugin Process"
        J[Flash/Extensions]
    end
    
    A -.-> E
    F -.-> H
```

### Process Responsibilities

#### 1. Browser Process
- **UI Thread**: Handles browser UI, tabs, address bar
- **Network Thread**: Manages HTTP requests, downloads
- **Storage Thread**: File system access, databases
- **Device Thread**: Camera, microphone access

#### 2. Renderer Process (Site Isolation)
- **Main Thread**: JavaScript execution, DOM manipulation, layout
- **Compositor Thread**: Handles scrolling, animations
- **Web Workers**: Background JavaScript execution

#### 3. GPU Process
- Hardware-accelerated graphics
- Video decoding
- Canvas and WebGL operations

## 🔄 Critical Rendering Path

### 1. Navigation and Resource Loading

{% raw %}
```javascript
// Performance timing visualization
class NavigationTiming {
  static measureNavigation() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    const timing = {
      // DNS resolution
      dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
      
      // TCP connection
      tcpTime: navigation.connectEnd - navigation.connectStart,
      
      // SSL handshake
      sslTime: navigation.secureConnectionStart > 0 
        ? navigation.connectEnd - navigation.secureConnectionStart 
        : 0,
        
      // Request/Response
      requestTime: navigation.responseStart - navigation.requestStart,
      responseTime: navigation.responseEnd - navigation.responseStart,
      
      // DOM processing
      domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,
      
      // Resource loading
      resourceLoadTime: navigation.loadEventStart - navigation.domContentLoadedEventEnd
    };
    
    console.table(timing);
    return timing;
  }
  
  static visualizeWaterfall() {
    const resources = performance.getEntriesByType('resource');
    
    resources.forEach(resource => {
      const waterfall = {
        name: resource.name.split('/').pop(),
        startTime: Math.round(resource.startTime),
        duration: Math.round(resource.duration),
        size: resource.transferSize || 'cached',
        type: resource.initiatorType
      };
      
      console.log(
        `${waterfall.name.padEnd(30)} | ` +
        `${waterfall.startTime}ms`.padEnd(10) +
        `${waterfall.duration}ms`.padEnd(10) +
        `${waterfall.size}`.padEnd(15) +
        `${waterfall.type}`
      );
    });
  }
}

// Usage
NavigationTiming.measureNavigation();
NavigationTiming.visualizeWaterfall();
```
{% endraw %}

### 2. HTML Parsing and DOM Construction

{% raw %}
```javascript
// DOM construction simulation
class DOMParser {
  constructor() {
    this.tokens = [];
    this.domTree = null;
    this.parseStartTime = 0;
  }
  
  // Tokenization phase
  tokenize(html) {
    this.parseStartTime = performance.now();
    console.log('🔍 Starting HTML tokenization...');
    
    // Simplified tokenization
    const tokenRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*)>/g;
    let match;
    
    while ((match = tokenRegex.exec(html)) !== null) {
      const [fullMatch, tagName, attributes] = match;
      const isClosing = fullMatch.startsWith('</');
      
      this.tokens.push({
        type: isClosing ? 'endTag' : 'startTag',
        tagName: tagName.toLowerCase(),
        attributes: this.parseAttributes(attributes),
        position: match.index
      });
    }
    
    console.log(`📝 Tokenized ${this.tokens.length} tokens`);
    return this.tokens;
  }
  
  parseAttributes(attrString) {
    const attributes = {};
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let match;
    
    while ((match = attrRegex.exec(attrString)) !== null) {
      attributes[match[1]] = match[2];
    }
    
    return attributes;
  }
  
  // Tree construction phase
  buildDOM(tokens) {
    console.log('🌳 Building DOM tree...');
    
    const stack = [];
    const root = { tagName: 'document', children: [] };
    let current = root;
    
    tokens.forEach(token => {
      if (token.type === 'startTag') {
        const element = {
          tagName: token.tagName,
          attributes: token.attributes,
          children: [],
          parent: current
        };
        
        current.children.push(element);
        
        // Self-closing tags don't need to be pushed to stack
        if (!this.isSelfClosing(token.tagName)) {
          stack.push(current);
          current = element;
        }
        
        // Simulate parser blocking for synchronous scripts
        if (token.tagName === 'script' && !token.attributes.async && !token.attributes.defer) {
          console.log('⏸️  Parser blocked by synchronous script');
          // In real browser, parser would wait for script execution
        }
        
      } else if (token.type === 'endTag') {
        if (stack.length > 0) {
          current = stack.pop();
        }
      }
    });
    
    this.domTree = root;
    const parseTime = performance.now() - this.parseStartTime;
    console.log(`✅ DOM construction completed in ${parseTime.toFixed(2)}ms`);
    
    return root;
  }
  
  isSelfClosing(tagName) {
    return ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName);
  }
  
  // DOM tree visualization
  visualizeDOM(node = this.domTree, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.tagName}`);
    
    if (node.children) {
      node.children.forEach(child => this.visualizeDOM(child, depth + 1));
    }
  }
}
```
{% endraw %}

### 3. CSS Parsing and CSSOM Construction

{% raw %}
```javascript
// CSSOM construction simulation
class CSSOMBuilder {
  constructor() {
    this.stylesheets = [];
    this.cssom = null;
  }
  
  parseCSS(cssText, source = 'inline') {
    console.log(`🎨 Parsing CSS from ${source}...`);
    
    const rules = [];
    const ruleRegex = /([^{]+)\s*\{([^}]+)\}/g;
    let match;
    
    while ((match = ruleRegex.exec(cssText)) !== null) {
      const [, selector, declarations] = match;
      
      const rule = {
        selector: selector.trim(),
        declarations: this.parseDeclarations(declarations),
        specificity: this.calculateSpecificity(selector.trim()),
        source
      };
      
      rules.push(rule);
    }
    
    this.stylesheets.push({ source, rules });
    console.log(`📄 Parsed ${rules.length} CSS rules`);
    
    return rules;
  }
  
  parseDeclarations(declarationsText) {
    const declarations = {};
    const declRegex = /([^:]+):\s*([^;]+)/g;
    let match;
    
    while ((match = declRegex.exec(declarationsText)) !== null) {
      const property = match[1].trim();
      const value = match[2].trim();
      declarations[property] = value;
    }
    
    return declarations;
  }
  
  calculateSpecificity(selector) {
    // Simplified specificity calculation
    const ids = (selector.match(/#/g) || []).length;
    const classes = (selector.match(/\./g) || []).length;
    const elements = (selector.match(/\b[a-z]+\b/g) || []).length;
    
    return ids * 100 + classes * 10 + elements;
  }
  
  buildCSSOМ() {
    console.log('🏗️  Building CSSOM...');
    
    // Combine all stylesheets and sort by specificity
    const allRules = [];
    
    this.stylesheets.forEach(stylesheet => {
      allRules.push(...stylesheet.rules);
    });
    
    // Sort by specificity (higher specificity first)
    allRules.sort((a, b) => b.specificity - a.specificity);
    
    this.cssom = {
      rules: allRules,
      computedStyles: new Map() // Will store computed styles for elements
    };
    
    console.log(`✅ CSSOM built with ${allRules.length} rules`);
    return this.cssom;
  }
  
  // Simulate style computation
  computeStyles(element, domTree) {
    const computedStyle = {};
    
    // Apply matching rules
    this.cssom.rules.forEach(rule => {
      if (this.matchesSelector(element, rule.selector, domTree)) {
        Object.assign(computedStyle, rule.declarations);
      }
    });
    
    // Apply inheritance
    if (element.parent && element.parent !== domTree) {
      const parentStyle = this.cssom.computedStyles.get(element.parent) || {};
      const inheritableProperties = ['color', 'font-family', 'font-size', 'line-height'];
      
      inheritableProperties.forEach(prop => {
        if (parentStyle[prop] && !computedStyle[prop]) {
          computedStyle[prop] = parentStyle[prop];
        }
      });
    }
    
    this.cssom.computedStyles.set(element, computedStyle);
    return computedStyle;
  }
  
  matchesSelector(element, selector, domTree) {
    // Simplified selector matching
    if (selector.startsWith('#')) {
      return element.attributes.id === selector.slice(1);
    }
    
    if (selector.startsWith('.')) {
      const classes = element.attributes.class || '';
      return classes.split(' ').includes(selector.slice(1));
    }
    
    return element.tagName === selector;
  }
}
```
{% endraw %}

### 4. Layout (Reflow) Engine

{% raw %}
```javascript
// Layout engine simulation
class LayoutEngine {
  constructor() {
    this.layoutTree = null;
    this.viewport = { width: 1024, height: 768 };
  }
  
  createLayoutTree(domTree, cssom) {
    console.log('📐 Starting layout phase...');
    
    this.layoutTree = this.buildLayoutTree(domTree, cssom);
    this.calculateLayout(this.layoutTree);
    
    console.log('✅ Layout phase completed');
    return this.layoutTree;
  }
  
  buildLayoutTree(domNode, cssom, parentLayoutNode = null) {
    // Skip text nodes and elements with display: none
    const computedStyle = cssom.computedStyles.get(domNode) || {};
    
    if (computedStyle.display === 'none') {
      return null;
    }
    
    const layoutNode = {
      domNode,
      computedStyle,
      children: [],
      parent: parentLayoutNode,
      box: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0
      }
    };
    
    // Process children
    if (domNode.children) {
      domNode.children.forEach(child => {
        const childLayoutNode = this.buildLayoutTree(child, cssom, layoutNode);
        if (childLayoutNode) {
          layoutNode.children.push(childLayoutNode);
        }
      });
    }
    
    return layoutNode;
  }
  
  calculateLayout(layoutNode, containerWidth = this.viewport.width) {
    if (!layoutNode) return;
    
    const style = layoutNode.computedStyle;
    
    // Calculate box model
    this.calculateBoxModel(layoutNode, style);
    
    // Calculate position and size based on display type
    switch (style.display) {
      case 'block':
        this.layoutBlock(layoutNode, containerWidth);
        break;
      case 'inline':
        this.layoutInline(layoutNode, containerWidth);
        break;
      case 'flex':
        this.layoutFlex(layoutNode, containerWidth);
        break;
      case 'grid':
        this.layoutGrid(layoutNode, containerWidth);
        break;
      default:
        this.layoutBlock(layoutNode, containerWidth);
    }
    
    // Layout children
    layoutNode.children.forEach(child => {
      this.calculateLayout(child, layoutNode.box.width);
    });
  }
  
  calculateBoxModel(layoutNode, style) {
    const box = layoutNode.box;
    
    // Parse CSS values (simplified)
    box.marginTop = this.parseValue(style.marginTop || '0');
    box.marginRight = this.parseValue(style.marginRight || '0');
    box.marginBottom = this.parseValue(style.marginBottom || '0');
    box.marginLeft = this.parseValue(style.marginLeft || '0');
    
    box.paddingTop = this.parseValue(style.paddingTop || '0');
    box.paddingRight = this.parseValue(style.paddingRight || '0');
    box.paddingBottom = this.parseValue(style.paddingBottom || '0');
    box.paddingLeft = this.parseValue(style.paddingLeft || '0');
  }
  
  parseValue(value) {
    // Simplified CSS value parsing
    if (value.endsWith('px')) {
      return parseInt(value);
    }
    if (value.endsWith('%')) {
      return { type: 'percentage', value: parseInt(value) };
    }
    return parseInt(value) || 0;
  }
  
  layoutBlock(layoutNode, containerWidth) {
    const box = layoutNode.box;
    const style = layoutNode.computedStyle;
    
    // Block elements take full width by default
    box.width = containerWidth - box.marginLeft - box.marginRight;
    
    // Calculate height based on content
    let contentHeight = 0;
    let currentY = box.paddingTop;
    
    layoutNode.children.forEach(child => {
      child.box.x = box.paddingLeft;
      child.box.y = currentY;
      
      this.calculateLayout(child, box.width - box.paddingLeft - box.paddingRight);
      
      currentY += child.box.height + child.box.marginTop + child.box.marginBottom;
      contentHeight = Math.max(contentHeight, currentY);
    });
    
    box.height = contentHeight + box.paddingBottom;
    
    console.log(`📦 Block layout: ${layoutNode.domNode.tagName} (${box.width}x${box.height})`);
  }
  
  layoutFlex(layoutNode, containerWidth) {
    const box = layoutNode.box;
    const style = layoutNode.computedStyle;
    
    box.width = containerWidth - box.marginLeft - box.marginRight;
    
    const flexDirection = style.flexDirection || 'row';
    const justifyContent = style.justifyContent || 'flex-start';
    const alignItems = style.alignItems || 'stretch';
    
    if (flexDirection === 'row') {
      this.layoutFlexRow(layoutNode, justifyContent, alignItems);
    } else {
      this.layoutFlexColumn(layoutNode, justifyContent, alignItems);
    }
    
    console.log(`🔧 Flex layout: ${layoutNode.domNode.tagName} (${box.width}x${box.height})`);
  }
  
  layoutFlexRow(layoutNode, justifyContent, alignItems) {
    const availableWidth = layoutNode.box.width - layoutNode.box.paddingLeft - layoutNode.box.paddingRight;
    const children = layoutNode.children;
    
    // Calculate flex basis and grow
    let totalFlexBasis = 0;
    let totalFlexGrow = 0;
    
    children.forEach(child => {
      const flexBasis = this.parseValue(child.computedStyle.flexBasis || 'auto');
      const flexGrow = parseInt(child.computedStyle.flexGrow || '0');
      
      child.flexBasis = flexBasis === 'auto' ? 0 : flexBasis;
      child.flexGrow = flexGrow;
      
      totalFlexBasis += child.flexBasis;
      totalFlexGrow += flexGrow;
    });
    
    // Distribute remaining space
    const remainingSpace = availableWidth - totalFlexBasis;
    const spacePerGrow = totalFlexGrow > 0 ? remainingSpace / totalFlexGrow : 0;
    
    let currentX = layoutNode.box.paddingLeft;
    let maxHeight = 0;
    
    children.forEach(child => {
      child.box.x = currentX;
      child.box.y = layoutNode.box.paddingTop;
      child.box.width = child.flexBasis + (child.flexGrow * spacePerGrow);
      
      this.calculateLayout(child, child.box.width);
      
      currentX += child.box.width;
      maxHeight = Math.max(maxHeight, child.box.height);
    });
    
    layoutNode.box.height = maxHeight + layoutNode.box.paddingTop + layoutNode.box.paddingBottom;
  }
  
  layoutGrid(layoutNode, containerWidth) {
    // Simplified CSS Grid implementation
    const box = layoutNode.box;
    const style = layoutNode.computedStyle;
    
    box.width = containerWidth - box.marginLeft - box.marginRight;
    
    const gridTemplateColumns = style.gridTemplateColumns || '1fr';
    const gridTemplateRows = style.gridTemplateRows || 'auto';
    const gap = this.parseValue(style.gap || '0');
    
    // Parse grid template
    const columns = this.parseGridTemplate(gridTemplateColumns, box.width);
    const rows = this.parseGridTemplate(gridTemplateRows, 0); // Will be calculated
    
    console.log(`📊 Grid layout: ${columns.length} columns, ${rows.length} rows`);
    
    // Position grid items
    let currentRow = 0;
    let currentCol = 0;
    let maxRowHeight = 0;
    
    layoutNode.children.forEach((child, index) => {
      if (currentCol >= columns.length) {
        currentCol = 0;
        currentRow++;
        if (currentRow >= rows.length) {
          rows.push({ size: 0, type: 'auto' });
        }
      }
      
      child.box.x = columns.slice(0, currentCol).reduce((sum, col) => sum + col.size, 0) + (currentCol * gap);
      child.box.y = rows.slice(0, currentRow).reduce((sum, row) => sum + row.size, 0) + (currentRow * gap);
      child.box.width = columns[currentCol].size;
      
      this.calculateLayout(child, child.box.width);
      
      maxRowHeight = Math.max(maxRowHeight, child.box.height);
      
      currentCol++;
      
      // Update row height for auto rows
      if (rows[currentRow] && rows[currentRow].type === 'auto') {
        rows[currentRow].size = Math.max(rows[currentRow].size, child.box.height);
      }
    });
    
    const totalHeight = rows.reduce((sum, row) => sum + row.size, 0) + ((rows.length - 1) * gap);
    box.height = totalHeight + box.paddingTop + box.paddingBottom;
  }
  
  parseGridTemplate(template, containerSize) {
    const tracks = template.split(' ');
    const result = [];
    
    tracks.forEach(track => {
      if (track.endsWith('fr')) {
        const fraction = parseFloat(track);
        result.push({ size: (containerSize / tracks.length) * fraction, type: 'fr', fraction });
      } else if (track.endsWith('px')) {
        result.push({ size: parseInt(track), type: 'px' });
      } else if (track === 'auto') {
        result.push({ size: 0, type: 'auto' });
      } else {
        result.push({ size: containerSize / tracks.length, type: 'default' });
      }
    });
    
    return result;
  }
  
  // Performance monitoring
  measureLayoutPerformance(domTree, cssom) {
    const startTime = performance.now();
    
    console.log('⏱️  Starting layout performance measurement...');
    
    // Simulate forced layout
    const layoutTree = this.createLayoutTree(domTree, cssom);
    
    const endTime = performance.now();
    const layoutTime = endTime - startTime;
    
    const stats = {
      layoutTime: `${layoutTime.toFixed(2)}ms`,
      nodesProcessed: this.countNodes(layoutTree),
      averageTimePerNode: `${(layoutTime / this.countNodes(layoutTree)).toFixed(4)}ms`
    };
    
    console.table(stats);
    
    // Detect layout thrashing
    if (layoutTime > 16) { // More than one frame
      console.warn(`⚠️  Layout took ${layoutTime.toFixed(2)}ms, may cause jank!`);
    }
    
    return stats;
  }
  
  countNodes(node) {
    if (!node) return 0;
    return 1 + node.children.reduce((count, child) => count + this.countNodes(child), 0);
  }
}
```
{% endraw %}

### 5. Paint and Composite

{% raw %}
```javascript
// Paint and composite simulation
class PaintCompositeEngine {
  constructor() {
    this.paintTree = null;
    this.layers = [];
    this.paintTime = 0;
    this.compositeTime = 0;
  }
  
  createPaintTree(layoutTree) {
    console.log('🎨 Starting paint phase...');
    const startTime = performance.now();
    
    this.paintTree = this.buildPaintTree(layoutTree);
    this.createCompositingLayers(this.paintTree);
    
    this.paintTime = performance.now() - startTime;
    console.log(`✅ Paint phase completed in ${this.paintTime.toFixed(2)}ms`);
    
    return this.paintTree;
  }
  
  buildPaintTree(layoutNode, parentPaintNode = null) {
    if (!layoutNode) return null;
    
    const paintNode = {
      layoutNode,
      paintProperties: this.extractPaintProperties(layoutNode.computedStyle),
      children: [],
      parent: parentPaintNode,
      needsNewLayer: this.shouldCreateNewLayer(layoutNode),
      layerId: null
    };
    
    // Process children
    layoutNode.children.forEach(child => {
      const childPaintNode = this.buildPaintTree(child, paintNode);
      if (childPaintNode) {
        paintNode.children.push(childPaintNode);
      }
    });
    
    return paintNode;
  }
  
  extractPaintProperties(style) {
    return {
      backgroundColor: style.backgroundColor || 'transparent',
      color: style.color || 'black',
      border: {
        width: this.parseValue(style.borderWidth || '0'),
        color: style.borderColor || 'black',
        style: style.borderStyle || 'solid'
      },
      borderRadius: this.parseValue(style.borderRadius || '0'),
      boxShadow: style.boxShadow || 'none',
      opacity: parseFloat(style.opacity || '1'),
      transform: style.transform || 'none',
      filter: style.filter || 'none'
    };
  }
  
  shouldCreateNewLayer(layoutNode) {
    const style = layoutNode.computedStyle;
    
    // Conditions that create new compositing layers
    return (
      style.position === 'fixed' ||
      style.position === 'sticky' ||
      parseFloat(style.opacity || '1') < 1 ||
      style.transform !== 'none' ||
      style.filter !== 'none' ||
      style.zIndex !== 'auto' ||
      style.willChange === 'transform' ||
      style.willChange === 'opacity' ||
      layoutNode.domNode.tagName === 'video' ||
      layoutNode.domNode.tagName === 'canvas'
    );
  }
  
  createCompositingLayers(paintTree) {
    console.log('🔗 Creating compositing layers...');
    
    this.layers = [];
    let layerId = 0;
    
    this.traversePaintTree(paintTree, (paintNode) => {
      if (paintNode.needsNewLayer || !paintNode.parent) {
        const layer = {
          id: layerId++,
          paintNode,
          elements: [],
          bounds: this.calculateLayerBounds(paintNode),
          needsRepaint: true,
          isGPULayer: this.shouldUseGPU(paintNode)
        };
        
        paintNode.layerId = layer.id;
        this.layers.push(layer);
        
        console.log(`📋 Created layer ${layer.id} for ${paintNode.layoutNode.domNode.tagName}${layer.isGPULayer ? ' (GPU)' : ''}`);
      } else {
        // Inherit parent's layer
        paintNode.layerId = paintNode.parent.layerId;
      }
    });
    
    console.log(`✅ Created ${this.layers.length} compositing layers`);
  }
  
  shouldUseGPU(paintNode) {
    const style = paintNode.layoutNode.computedStyle;
    
    return (
      style.transform !== 'none' ||
      style.opacity !== '1' ||
      style.filter !== 'none' ||
      paintNode.layoutNode.domNode.tagName === 'video' ||
      paintNode.layoutNode.domNode.tagName === 'canvas' ||
      style.willChange === 'transform' ||
      style.willChange === 'opacity'
    );
  }
  
  calculateLayerBounds(paintNode) {
    const box = paintNode.layoutNode.box;
    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height
    };
  }
  
  traversePaintTree(paintNode, callback) {
    if (!paintNode) return;
    
    callback(paintNode);
    paintNode.children.forEach(child => {
      this.traversePaintTree(child, callback);
    });
  }
  
  // Simulate painting process
  paintLayers() {
    console.log('🖌️  Starting paint process...');
    const startTime = performance.now();
    
    this.layers.forEach(layer => {
      if (layer.needsRepaint) {
        this.paintLayer(layer);
        layer.needsRepaint = false;
      }
    });
    
    this.paintTime = performance.now() - startTime;
    console.log(`🎨 Painted ${this.layers.length} layers in ${this.paintTime.toFixed(2)}ms`);
  }
  
  paintLayer(layer) {
    const paintOps = [];
    
    // Collect paint operations for this layer
    this.collectPaintOperations(layer.paintNode, paintOps);
    
    console.log(`🖼️  Layer ${layer.id}: ${paintOps.length} paint operations`);
    
    // Simulate paint operations
    paintOps.forEach(op => {
      this.executePaintOperation(op);
    });
    
    layer.paintOperations = paintOps;
  }
  
  collectPaintOperations(paintNode, operations) {
    if (!paintNode) return;
    
    const box = paintNode.layoutNode.box;
    const props = paintNode.paintProperties;
    
    // Background
    if (props.backgroundColor !== 'transparent') {
      operations.push({
        type: 'fillRect',
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        color: props.backgroundColor
      });
    }
    
    // Border
    if (props.border.width > 0) {
      operations.push({
        type: 'strokeRect',
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        borderWidth: props.border.width,
        borderColor: props.border.color
      });
    }
    
    // Text content (simplified)
    if (paintNode.layoutNode.domNode.textContent) {
      operations.push({
        type: 'fillText',
        text: paintNode.layoutNode.domNode.textContent,
        x: box.x + box.paddingLeft,
        y: box.y + box.paddingTop,
        color: props.color
      });
    }
    
    // Process children that belong to the same layer
    paintNode.children.forEach(child => {
      if (child.layerId === paintNode.layerId) {
        this.collectPaintOperations(child, operations);
      }
    });
  }
  
  executePaintOperation(operation) {
    // Simulate paint operation execution time
    const complexity = this.calculatePaintComplexity(operation);
    const executionTime = complexity * 0.1; // Simulate time based on complexity
    
    // In a real browser, this would involve actual graphics APIs
    console.log(`  🎯 ${operation.type} (${executionTime.toFixed(2)}ms)`);
  }
  
  calculatePaintComplexity(operation) {
    switch (operation.type) {
      case 'fillRect':
        return operation.width * operation.height / 1000;
      case 'strokeRect':
        return (operation.width + operation.height) * operation.borderWidth / 100;
      case 'fillText':
        return operation.text.length * 2;
      default:
        return 1;
    }
  }
  
  // Composite layers
  composite() {
    console.log('🔧 Starting composite phase...');
    const startTime = performance.now();
    
    // Sort layers by z-index and document order
    const sortedLayers = this.sortLayersForComposite();
    
    // Composite layers
    sortedLayers.forEach((layer, index) => {
      this.compositeLayer(layer, index);
    });
    
    this.compositeTime = performance.now() - startTime;
    console.log(`✅ Composite completed in ${this.compositeTime.toFixed(2)}ms`);
  }
  
  sortLayersForComposite() {
    return this.layers.slice().sort((a, b) => {
      const aZIndex = parseInt(a.paintNode.layoutNode.computedStyle.zIndex || '0');
      const bZIndex = parseInt(b.paintNode.layoutNode.computedStyle.zIndex || '0');
      
      if (aZIndex !== bZIndex) {
        return aZIndex - bZIndex;
      }
      
      // Fall back to document order
      return a.id - b.id;
    });
  }
  
  compositeLayer(layer, index) {
    const isGPULayer = layer.isGPULayer;
    const processingType = isGPULayer ? 'GPU' : 'CPU';
    
    console.log(`🔄 Compositing layer ${layer.id} (${processingType})`);
    
    if (isGPULayer) {
      this.compositeOnGPU(layer);
    } else {
      this.compositeOnCPU(layer);
    }
  }
  
  compositeOnGPU(layer) {
    // Simulate GPU compositing
    const operations = layer.paintOperations || [];
    console.log(`  ⚡ GPU compositing ${operations.length} operations`);
  }
  
  compositeOnCPU(layer) {
    // Simulate CPU compositing
    const operations = layer.paintOperations || [];
    console.log(`  🖥️  CPU compositing ${operations.length} operations`);
  }
  
  // Performance analysis
  analyzeRenderingPerformance() {
    const totalRenderTime = this.paintTime + this.compositeTime;
    
    const analysis = {
      paintTime: `${this.paintTime.toFixed(2)}ms`,
      compositeTime: `${this.compositeTime.toFixed(2)}ms`,
      totalRenderTime: `${totalRenderTime.toFixed(2)}ms`,
      layerCount: this.layers.length,
      gpuLayers: this.layers.filter(l => l.isGPULayer).length,
      cpuLayers: this.layers.filter(l => !l.isGPULayer).length,
      performance: totalRenderTime < 16 ? 'Good' : totalRenderTime < 32 ? 'Warning' : 'Poor'
    };
    
    console.log('📊 Rendering Performance Analysis:');
    console.table(analysis);
    
    // Recommendations
    if (analysis.layerCount > 20) {
      console.warn('⚠️  High layer count detected. Consider reducing compositing layers.');
    }
    
    if (this.paintTime > 10) {
      console.warn('⚠️  Paint time is high. Consider optimizing paint operations.');
    }
    
    if (totalRenderTime > 16) {
      console.warn('⚠️  Total render time exceeds 16ms. May cause frame drops.');
    }
    
    return analysis;
  }
}
```
{% endraw %}

## 🚀 Performance Optimization Techniques

### 1. Critical Resource Prioritization

```javascript
// Resource priority optimization
class ResourcePriority {
  static optimizeResourceLoading() {
    // Critical CSS inlining
    const criticalCSS = this.extractCriticalCSS();
    this.inlineCriticalCSS(criticalCSS);
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Defer non-critical resources
    this.deferNonCriticalResources();
  }
  
  static extractCriticalCSS() {
    const aboveFoldElements = document.querySelectorAll('*');
    const criticalRules = [];
    
    Array.from(document.styleSheets).forEach(stylesheet => {
      try {
        Array.from(stylesheet.cssRules).forEach(rule => {
          if (this.isRuleCritical(rule, aboveFoldElements)) {
            criticalRules.push(rule.cssText);
          }
        });
      } catch (e) {
        console.warn('Cannot access stylesheet:', e);
      }
    });
    
    return criticalRules.join('\n');
  }
  
  static isRuleCritical(rule, elements) {
    if (rule.type !== CSSRule.STYLE_RULE) return false;
    
    try {
      return Array.from(elements).some(el => el.matches(rule.selectorText));
    } catch (e) {
      return false;
    }
  }
  
  static preloadCriticalResources() {
    const criticalResources = [
      { href: '/critical-font.woff2', as: 'font', type: 'font/woff2' },
      { href: '/hero-image.jpg', as: 'image' },
      { href: '/critical-script.js', as: 'script' }
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.as === 'font') link.crossOrigin = 'anonymous';
      
      document.head.appendChild(link);
    });
  }
  
  static deferNonCriticalResources() {
    // Defer non-critical CSS
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    nonCriticalCSS.forEach(link => {
      link.media = 'print';
      link.onload = () => { link.media = 'all'; };
    });
    
    // Lazy load non-critical scripts
    const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
    nonCriticalScripts.forEach(script => {
      script.defer = true;
    });
  }
}
```

### 2. Layout Optimization

{% raw %}
```javascript
// Layout optimization utilities
class LayoutOptimizer {
  static measureLayoutShift() {
    let clsValue = 0;
    let clsEntries = [];
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    setTimeout(() => {
      observer.disconnect();
      console.log('Cumulative Layout Shift:', clsValue);
      console.log('CLS Entries:', clsEntries);
      
      if (clsValue > 0.1) {
        console.warn('⚠️  High CLS detected! Consider fixing layout shifts.');
        this.analyzeLayoutShifts(clsEntries);
      }
    }, 5000);
  }
  
  static analyzeLayoutShifts(entries) {
    entries.forEach((entry, index) => {
      console.log(`Layout Shift ${index + 1}:`);
      console.log(`  Value: ${entry.value}`);
      console.log(`  Time: ${entry.startTime}ms`);
      
      entry.sources.forEach(source => {
        console.log(`  Affected element:`, source.node);
        console.log(`  Previous rect:`, source.previousRect);
        console.log(`  Current rect:`, source.currentRect);
      });
    });
  }
  
  static preventLayoutShifts() {
    // Reserve space for images
    this.reserveImageSpace();
    
    // Set font display swap
    this.optimizeFontLoading();
    
    // Prevent ad-related shifts
    this.reserveAdSpace();
  }
  
  static reserveImageSpace() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (!img.style.aspectRatio) {
        const width = img.getAttribute('width');
        const height = img.getAttribute('height');
        
        if (width && height) {
          img.style.aspectRatio = `${width} / ${height}`;
        }
      }
    });
  }
  
  static optimizeFontLoading() {
    const fontFaces = document.fonts;
    
    fontFaces.forEach(font => {
      if (font.display !== 'swap') {
        console.warn(`Font ${font.family} should use font-display: swap`);
      }
    });
  }
}
```
{% endraw %}

## 🧠 Interview Questions and Scenarios

### 1. Performance Debugging

**Question**: "The page is slow to load. How would you debug it?"

**Answer Framework**:

{% raw %}
```javascript
class PerformanceDebugger {
  static debugSlowPage() {
    console.log('🔍 Starting performance debugging...');
    
    // 1. Check Core Web Vitals
    this.measureCoreWebVitals();
    
    // 2. Analyze network waterfall
    this.analyzeNetworkWaterfall();
    
    // 3. Check rendering performance
    this.analyzeRenderingPerformance();
    
    // 4. Identify JavaScript bottlenecks
    this.analyzeJavaScriptPerformance();
    
    // 5. Check memory usage
    this.analyzeMemoryUsage();
  }
  
  static measureCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    }).observe({ type: 'first-input', buffered: true });
    
    // CLS (Cumulative Layout Shift)
    LayoutOptimizer.measureLayoutShift();
  }
  
  static analyzeNetworkWaterfall() {
    const resources = performance.getEntriesByType('resource');
    
    // Find slow resources
    const slowResources = resources.filter(r => r.duration > 1000);
    if (slowResources.length > 0) {
      console.warn('Slow resources detected:', slowResources);
    }
    
    // Check for render-blocking resources
    const renderBlocking = resources.filter(r => 
      r.name.includes('.css') && r.startTime < 1000
    );
    
    if (renderBlocking.length > 3) {
      console.warn('Too many render-blocking CSS files:', renderBlocking);
    }
  }
  
  static analyzeRenderingPerformance() {
    // Check for expensive layout operations
    const measureEntries = performance.getEntriesByType('measure');
    const layoutMeasures = measureEntries.filter(m => m.name.includes('layout'));
    
    layoutMeasures.forEach(measure => {
      if (measure.duration > 16) {
        console.warn(`Expensive layout operation: ${measure.name} (${measure.duration}ms)`);
      }
    });
  }
  
  static analyzeJavaScriptPerformance() {
    // Check for long tasks
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.warn(`Long task detected: ${entry.duration}ms`);
        
        if (entry.attribution) {
          console.log('Attribution:', entry.attribution);
        }
      }
    }).observe({ type: 'longtask', buffered: true });
  }
  
  static analyzeMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      const memoryUsage = {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
      };
      
      console.table(memoryUsage);
      
      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
        console.warn('⚠️  High memory usage detected!');
      }
    }
  }
}
```
{% endraw %}

### 2. Rendering Pipeline Questions

**Question**: "What happens when you change a CSS property?"

**Answer**: Different CSS properties trigger different stages of the rendering pipeline:

{% raw %}
```javascript
class RenderingPipelineAnalyzer {
  static analyzeCSSPropertyImpact(property, value) {
    const propertyImpacts = {
      // Layout-triggering properties
      'width': ['layout', 'paint', 'composite'],
      'height': ['layout', 'paint', 'composite'],
      'padding': ['layout', 'paint', 'composite'],
      'margin': ['layout', 'paint', 'composite'],
      'display': ['layout', 'paint', 'composite'],
      'position': ['layout', 'paint', 'composite'],
      'float': ['layout', 'paint', 'composite'],
      'clear': ['layout', 'paint', 'composite'],
      
      // Paint-triggering properties
      'color': ['paint', 'composite'],
      'background': ['paint', 'composite'],
      'border': ['paint', 'composite'],
      'box-shadow': ['paint', 'composite'],
      'border-radius': ['paint', 'composite'],
      'visibility': ['paint', 'composite'],
      
      // Composite-only properties
      'transform': ['composite'],
      'opacity': ['composite'],
      'filter': ['composite'],
      'will-change': ['composite']
    };
    
    const impact = propertyImpacts[property] || ['unknown'];
    
    console.log(`🎯 Changing ${property} will trigger:`, impact);
    
    const performance = this.getPerformanceRating(impact);
    console.log(`📊 Performance impact: ${performance}`);
    
    return { property, value, impact, performance };
  }
  
  static getPerformanceRating(impact) {
    if (impact.includes('layout')) return 'High (Avoid in animations)';
    if (impact.includes('paint')) return 'Medium (Use sparingly)';
    if (impact.includes('composite')) return 'Low (Good for animations)';
    return 'Unknown';
  }
  
  static demonstrateOptimalAnimations() {
    console.log('✅ Optimal CSS properties for animations:');
    
    const optimalProperties = [
      'transform: translateX(100px)',
      'transform: scale(1.2)',
      'transform: rotate(45deg)',
      'opacity: 0.5',
      'filter: blur(5px)'
    ];
    
    optimalProperties.forEach(prop => {
      console.log(`  ${prop} - Composite only`);
    });
    
    console.log('\n❌ Avoid these properties in animations:');
    
    const avoidProperties = [
      'width/height - Triggers layout',
      'padding/margin - Triggers layout',
      'top/left - Triggers layout',
      'background-color - Triggers paint',
      'border-width - Triggers layout'
    ];
    
    avoidProperties.forEach(prop => {
      console.log(`  ${prop}`);
    });
  }
}
```
{% endraw %}

This comprehensive guide provides deep insights into browser architecture and rendering pipeline, essential knowledge for frontend interviews at big tech companies. The practical examples and performance debugging techniques demonstrate real-world application of these concepts.
