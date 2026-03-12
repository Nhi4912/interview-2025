# Modern Development Tools / Công Cụ Phát Triển Hiện Đại
## Tools & Ecosystem - Chapter 5 / Công Cụ & Hệ Sinh Thái - Chương 5

[← Previous: Testing Tools](./04-testing-tools.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Overview / Tổng Quan

**English:** Modern development tools are revolutionizing how we build, test, and deploy applications. This chapter covers cutting-edge tools that enhance developer productivity and code quality, including AI-powered assistants and visual programming environments.

**Tiếng Việt:** Các công cụ phát triển hiện đại đang cách mạng hóa cách chúng ta xây dựng, kiểm thử và triển khai ứng dụng. Chương này bao gồm các công cụ tiên tiến giúp tăng năng suất lập trình viên và chất lượng code, bao gồm trợ lý AI và môi trường lập trình trực quan.

---

## Table of Contents / Mục Lục

1. [Workflow - AI-Powered Development](#workflow---ai-powered-development)
2. [Rivet - Visual Programming](#rivet---visual-programming)
3. [AI-Assisted Development Theory](#ai-assisted-development-theory)
4. [Visual Development Tools Theory](#visual-development-tools-theory)
5. [Integration Patterns](#integration-patterns)
6. [Best Practices](#best-practices)
7. [Interview Questions](#interview-questions)

---

## Workflow - AI-Powered Development / Phát Triển Hỗ Trợ AI


## Câu Hỏi Phỏng Vấn / Interview Q&A
### What is Workflow? / Workflow là gì? 🟢 [Junior]

**Website**: https://useworkflow.dev/

**English Definition:** Workflow is an AI-powered development tool that helps developers build applications faster by providing intelligent code suggestions, automated refactoring, and context-aware assistance. It acts as an intelligent pair programmer that understands your codebase and suggests optimal solutions.

**Định nghĩa (Tiếng Việt):** Workflow là công cụ phát triển hỗ trợ AI giúp lập trình viên xây dựng ứng dụng nhanh hơn bằng cách cung cấp gợi ý code thông minh, tự động refactor và hỗ trợ nhận biết ngữ cảnh. Nó hoạt động như một lập trình viên cặp thông minh hiểu codebase của bạn và đề xuất giải pháp tối ưu.

### Core Concepts / Khái Niệm Cốt Lõi

**1. Context-Aware Intelligence / Trí Tuệ Nhận Biết Ngữ Cảnh**

**English:** Workflow analyzes your entire codebase to understand patterns, conventions, and architecture, providing suggestions that fit your project's style.

**Tiếng Việt:** Workflow phân tích toàn bộ codebase để hiểu patterns, quy ước và kiến trúc, cung cấp gợi ý phù hợp với phong cách dự án của bạn.

```typescript
// Workflow learns your project patterns
// Example: Your project uses this pattern for API calls

// Pattern detected in your codebase:
async function fetchUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    logger.error('fetchUser failed', error);
    throw error;
  }
}

// When you start typing a new API function, Workflow suggests:
async function fetchProduct(id: string) {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    logger.error('fetchProduct failed', error);
    throw error;
  }
}
// ✅ Follows your project's error handling pattern
// ✅ Uses your logging utility
// ✅ Maintains consistent structure
```

**2. Intelligent Code Completion / Hoàn Thành Code Thông Minh**

**English:** Goes beyond simple autocomplete by understanding intent and suggesting entire code blocks.

**Tiếng Việt:** Vượt xa autocomplete đơn giản bằng cách hiểu ý định và đề xuất toàn bộ khối code.

```typescript
// You type: "create a custom hook for form validation"
// Workflow generates:

function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const validate = useCallback((fieldName?: keyof T) => {
    const fieldsToValidate = fieldName ? [fieldName] : Object.keys(values);
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    fieldsToValidate.forEach((field) => {
      const rule = validationRules[field as keyof T];
      if (rule) {
        const error = rule(values[field as keyof T], values);
        if (error) {
          newErrors[field as keyof T] = error;
        }
      }
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);
  
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validate(field);
    }
  }, [touched, validate]);
  
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate(field);
  }, [validate]);
  
  const handleSubmit = useCallback((onSubmit: (values: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      
      const isValid = validate();
      if (isValid) {
        onSubmit(values);
      }
    };
  }, [values, validate]);
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate
  };
}

// ✅ Complete, production-ready implementation
// ✅ TypeScript generics for type safety
// ✅ Proper React hooks usage
// ✅ Memoization for performance
```

**3. Automated Refactoring / Tự Động Refactor**

**English:** Workflow identifies code smells and suggests improvements while maintaining functionality.

**Tiếng Việt:** Workflow nhận diện code smells và đề xuất cải tiến trong khi duy trì chức năng.

### Key Features

```typescript
// Workflow provides intelligent code completion
// and context-aware suggestions

// Example: Building a React component with Workflow assistance
import { useState, useEffect } from 'react';

// Workflow can suggest complete component structures
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Workflow suggests error handling and loading states
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Workflow Capabilities

**1. Intelligent Code Generation**
```typescript
// Workflow can generate complete functions from comments

// Generate a function to validate email
// Workflow generates:
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate a debounce function
// Workflow generates:
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```

**2. Automated Refactoring**
```typescript
// Before: Repetitive code
function getUserName(user) {
  if (user && user.profile && user.profile.name) {
    return user.profile.name;
  }
  return 'Anonymous';
}

function getUserEmail(user) {
  if (user && user.profile && user.profile.email) {
    return user.profile.email;
  }
  return 'No email';
}

// Workflow suggests refactoring to:
function getNestedProperty<T>(
  obj: any,
  path: string,
  defaultValue: T
): T {
  return path.split('.').reduce(
    (current, key) => current?.[key],
    obj
  ) ?? defaultValue;
}

const userName = getNestedProperty(user, 'profile.name', 'Anonymous');
const userEmail = getNestedProperty(user, 'profile.email', 'No email');
```

**3. Context-Aware Suggestions**
```typescript
// Workflow understands your codebase context
// and suggests relevant patterns

// In a Next.js project, Workflow suggests:
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Workflow Integration

**Setup in VS Code**:
```json
// .vscode/settings.json
{
  "workflow.enabled": true,
  "workflow.autoComplete": true,
  "workflow.suggestions": {
    "react": true,
    "typescript": true,
    "nextjs": true
  },
  "workflow.refactoring": {
    "autoSuggest": true,
    "showInlineHints": true
  }
}
```

**Usage Patterns**:
```typescript
// 1. Comment-driven development
// Workflow generates code from comments

// TODO: Create a custom hook for fetching data with caching
// Workflow generates:
function useFetchWithCache<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const cache = useRef<Map<string, T>>(new Map());
  
  useEffect(() => {
    if (cache.current.has(url)) {
      setData(cache.current.get(url)!);
      setLoading(false);
      return;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        cache.current.set(url, data);
        setData(data);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading };
}

// 2. Pattern recognition
// Workflow recognizes common patterns and suggests improvements

// You write:
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(!isOpen);

// Workflow suggests extracting to custom hook:
const { value: isOpen, toggle } = useToggle(false);
```

---

## Rivet - Visual Programming / Lập Trình Trực Quan

### What is Rivet? / Rivet là gì? 🟢 [Junior]

**Website**: https://www.rivet.dev/

**English Definition:** Rivet is a visual programming tool for building AI applications and workflows. It provides a node-based interface for creating complex logic flows, AI chains, and data transformations. Think of it as a visual IDE for AI workflows where you connect nodes instead of writing code.

**Định nghĩa (Tiếng Việt):** Rivet là công cụ lập trình trực quan để xây dựng ứng dụng AI và workflows. Nó cung cấp giao diện dựa trên node để tạo luồng logic phức tạp, chuỗi AI và chuyển đổi dữ liệu. Hãy nghĩ về nó như một IDE trực quan cho AI workflows nơi bạn kết nối các nodes thay vì viết code.

### Theoretical Foundation / Nền Tảng Lý Thuyết

**1. Node-Based Programming Paradigm / Mô Hình Lập Trình Dựa Trên Node**

**English:** Node-based programming represents computation as a directed graph where:
- **Nodes** = Operations/Functions
- **Edges** = Data flow between operations
- **Graph** = Complete program/workflow

**Tiếng Việt:** Lập trình dựa trên node biểu diễn tính toán như một đồ thị có hướng trong đó:
- **Nodes** = Các thao tác/hàm
- **Edges** = Luồng dữ liệu giữa các thao tác
- **Graph** = Chương trình/workflow hoàn chỉnh

```typescript
// Mathematical representation
// Định nghĩa toán học

interface Node<I, O> {
  id: string;
  execute: (input: I) => Promise<O> | O;
}

interface Edge {
  from: { nodeId: string; outputPort: string };
  to: { nodeId: string; inputPort: string };
}

interface Graph {
  nodes: Node<any, any>[];
  edges: Edge[];
}

// Execution model: Topological sort + Data flow
// Mô hình thực thi: Sắp xếp topo + Luồng dữ liệu

class GraphExecutor {
  async execute(graph: Graph, initialData: any) {
    // 1. Topological sort for execution order
    // 1. Sắp xếp topo để xác định thứ tự thực thi
    const sortedNodes = this.topologicalSort(graph);
    
    // 2. Execute nodes in order
    // 2. Thực thi nodes theo thứ tự
    const results = new Map<string, any>();
    
    for (const node of sortedNodes) {
      const inputs = this.gatherInputs(node, graph, results);
      const output = await node.execute(inputs);
      results.set(node.id, output);
    }
    
    return results;
  }
  
  private topologicalSort(graph: Graph): Node<any, any>[] {
    // Kahn's algorithm for topological sorting
    // Thuật toán Kahn cho sắp xếp topo
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();
    
    // Initialize
    graph.nodes.forEach(node => {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    });
    
    // Build graph
    graph.edges.forEach(edge => {
      adjList.get(edge.from.nodeId)!.push(edge.to.nodeId);
      inDegree.set(edge.to.nodeId, inDegree.get(edge.to.nodeId)! + 1);
    });
    
    // Find nodes with no dependencies
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });
    
    // Process queue
    const sorted: Node<any, any>[] = [];
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = graph.nodes.find(n => n.id === nodeId)!;
      sorted.push(node);
      
      adjList.get(nodeId)!.forEach(neighborId => {
        inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
        if (inDegree.get(neighborId) === 0) {
          queue.push(neighborId);
        }
      });
    }
    
    if (sorted.length !== graph.nodes.length) {
      throw new Error('Cycle detected in graph');
    }
    
    return sorted;
  }
  
  private gatherInputs(
    node: Node<any, any>,
    graph: Graph,
    results: Map<string, any>
  ): any {
    const inputs: Record<string, any> = {};
    
    graph.edges
      .filter(edge => edge.to.nodeId === node.id)
      .forEach(edge => {
        const sourceResult = results.get(edge.from.nodeId);
        inputs[edge.to.inputPort] = sourceResult?.[edge.from.outputPort];
      });
    
    return inputs;
  }
}
```

**2. Dataflow Programming / Lập Trình Luồng Dữ Liệu**

**English:** Rivet implements dataflow programming where computation is triggered by data availability rather than explicit control flow.

**Tiếng Việt:** Rivet triển khai lập trình luồng dữ liệu nơi tính toán được kích hoạt bởi sự sẵn có của dữ liệu thay vì luồng điều khiển tường minh.

```typescript
// Dataflow model
// Mô hình luồng dữ liệu

interface DataflowNode {
  id: string;
  type: string;
  inputs: Map<string, any>;
  outputs: Map<string, any>;
  execute: () => Promise<void>;
  ready: () => boolean; // All inputs available?
}

class DataflowEngine {
  private nodes: Map<string, DataflowNode> = new Map();
  private pendingNodes: Set<string> = new Set();
  
  async run() {
    // Initialize all nodes as pending
    this.nodes.forEach((_, id) => this.pendingNodes.add(id));
    
    // Execute nodes as data becomes available
    while (this.pendingNodes.size > 0) {
      const readyNodes = Array.from(this.pendingNodes)
        .filter(id => this.nodes.get(id)!.ready());
      
      if (readyNodes.length === 0) {
        throw new Error('Deadlock: No nodes ready to execute');
      }
      
      // Execute ready nodes in parallel
      await Promise.all(
        readyNodes.map(async (id) => {
          const node = this.nodes.get(id)!;
          await node.execute();
          this.pendingNodes.delete(id);
          this.propagateData(node);
        })
      );
    }
  }
  
  private propagateData(node: DataflowNode) {
    // Send outputs to connected nodes
    // Gửi outputs đến các nodes được kết nối
    const connections = this.getConnections(node.id);
    
    connections.forEach(conn => {
      const targetNode = this.nodes.get(conn.targetNodeId)!;
      targetNode.inputs.set(
        conn.targetPort,
        node.outputs.get(conn.sourcePort)
      );
    });
  }
  
  private getConnections(nodeId: string) {
    // Return all outgoing connections
    return []; // Implementation details
  }
}
```

**3. Reactive Execution / Thực Thi Phản Ứng**

**English:** Rivet uses reactive programming principles where changes automatically propagate through the graph.

**Tiếng Việt:** Rivet sử dụng nguyên tắc lập trình phản ứng nơi thay đổi tự động lan truyền qua đồ thị.

```typescript
// Reactive graph execution
// Thực thi đồ thị phản ứng

class ReactiveGraph {
  private nodes: Map<string, ReactiveNode> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map();
  
  // When a node's output changes, notify subscribers
  // Khi output của node thay đổi, thông báo cho subscribers
  private notifySubscribers(nodeId: string, output: any) {
    const subscribers = this.subscriptions.get(nodeId) || new Set();
    
    subscribers.forEach(subscriberId => {
      const subscriber = this.nodes.get(subscriberId);
      if (subscriber) {
        subscriber.onInputChange(nodeId, output);
      }
    });
  }
  
  // Subscribe to node outputs
  // Đăng ký nhận outputs của node
  subscribe(sourceId: string, targetId: string) {
    if (!this.subscriptions.has(sourceId)) {
      this.subscriptions.set(sourceId, new Set());
    }
    this.subscriptions.get(sourceId)!.add(targetId);
  }
}

interface ReactiveNode {
  id: string;
  onInputChange: (sourceId: string, value: any) => void;
  execute: () => Promise<void>;
}

// Example: Reactive data transformation
// Ví dụ: Chuyển đổi dữ liệu phản ứng
class TransformNode implements ReactiveNode {
  id: string;
  private input: any = null;
  private output: any = null;
  private subscribers: Set<(value: any) => void> = new Set();
  
  constructor(id: string) {
    this.id = id;
  }
  
  onInputChange(sourceId: string, value: any) {
    this.input = value;
    this.execute();
  }
  
  async execute() {
    // Transform data
    this.output = this.transform(this.input);
    
    // Notify subscribers
    this.subscribers.forEach(callback => callback(this.output));
  }
  
  private transform(input: any): any {
    // Transformation logic
    return input?.toUpperCase();
  }
  
  subscribe(callback: (value: any) => void) {
    this.subscribers.add(callback);
  }
}
```

### Key Features

**1. Visual Node Editor**
```
┌─────────────┐
│   Input     │
│   Node      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Transform  │
│   Node      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  AI Model   │
│   Node      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Output    │
│   Node      │
└─────────────┘
```

**2. AI Chain Building**
```typescript
// Rivet allows building AI chains visually
// This is the equivalent code representation

interface RivetNode {
  id: string;
  type: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}

interface RivetGraph {
  nodes: RivetNode[];
  connections: Array<{
    from: { nodeId: string; output: string };
    to: { nodeId: string; input: string };
  }>;
}

// Example: Text processing chain
const textProcessingChain: RivetGraph = {
  nodes: [
    {
      id: 'input-1',
      type: 'text-input',
      inputs: {},
      outputs: { text: 'User input text' }
    },
    {
      id: 'transform-1',
      type: 'text-transform',
      inputs: { text: '' },
      outputs: { transformed: '' }
    },
    {
      id: 'ai-1',
      type: 'openai-completion',
      inputs: { prompt: '' },
      outputs: { completion: '' }
    },
    {
      id: 'output-1',
      type: 'text-output',
      inputs: { text: '' },
      outputs: {}
    }
  ],
  connections: [
    {
      from: { nodeId: 'input-1', output: 'text' },
      to: { nodeId: 'transform-1', input: 'text' }
    },
    {
      from: { nodeId: 'transform-1', output: 'transformed' },
      to: { nodeId: 'ai-1', input: 'prompt' }
    },
    {
      from: { nodeId: 'ai-1', output: 'completion' },
      to: { nodeId: 'output-1', input: 'text' }
    }
  ]
};
```

**3. Data Flow Visualization**
```typescript
// Rivet visualizes data flow between nodes
// Making it easy to debug and understand complex workflows

class RivetExecutor {
  async executeGraph(graph: RivetGraph, initialData: any) {
    const nodeResults = new Map<string, any>();
    
    // Execute nodes in topological order
    for (const node of this.topologicalSort(graph)) {
      const inputs = this.gatherInputs(node, graph, nodeResults);
      const outputs = await this.executeNode(node, inputs);
      nodeResults.set(node.id, outputs);
    }
    
    return nodeResults;
  }
  
  private async executeNode(node: RivetNode, inputs: any) {
    switch (node.type) {
      case 'text-transform':
        return { transformed: inputs.text.toUpperCase() };
      
      case 'openai-completion':
        const response = await fetch('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            prompt: inputs.prompt,
            max_tokens: 100
          })
        });
        const data = await response.json();
        return { completion: data.choices[0].text };
      
      default:
        return inputs;
    }
  }
  
  private topologicalSort(graph: RivetGraph): RivetNode[] {
    // Implement topological sort for node execution order
    const sorted: RivetNode[] = [];
    const visited = new Set<string>();
    
    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const node = graph.nodes.find(n => n.id === nodeId)!;
      const dependencies = graph.connections
        .filter(c => c.to.nodeId === nodeId)
        .map(c => c.from.nodeId);
      
      dependencies.forEach(visit);
      sorted.push(node);
    };
    
    graph.nodes.forEach(node => visit(node.id));
    return sorted;
  }
  
  private gatherInputs(
    node: RivetNode,
    graph: RivetGraph,
    results: Map<string, any>
  ) {
    const inputs: Record<string, any> = {};
    
    graph.connections
      .filter(c => c.to.nodeId === node.id)
      .forEach(connection => {
        const sourceResult = results.get(connection.from.nodeId);
        inputs[connection.to.input] = sourceResult[connection.from.output];
      });
    
    return inputs;
  }
}
```

### Rivet Use Cases

**1. AI Workflow Automation**
```typescript
// Building a content generation pipeline in Rivet

interface ContentPipeline {
  // Input: Topic
  topic: string;
  
  // Step 1: Generate outline
  outline: string;
  
  // Step 2: Generate content for each section
  sections: Array<{
    title: string;
    content: string;
  }>;
  
  // Step 3: Review and refine
  refinedContent: string;
  
  // Output: Final article
  article: string;
}

// Rivet visualizes this as connected nodes
// Making it easy to modify and debug the pipeline
```

**2. Data Processing Workflows**
```typescript
// Rivet excels at visual data transformations

interface DataPipeline {
  // Input: Raw data
  rawData: any[];
  
  // Transform 1: Filter
  filtered: any[];
  
  // Transform 2: Map
  mapped: any[];
  
  // Transform 3: Aggregate
  aggregated: any;
  
  // Output: Processed data
  result: any;
}

// Visual representation makes complex transformations clear
```

**3. API Integration Chains**
```typescript
// Building API integration workflows visually

class RivetAPIChain {
  async executeAPIChain() {
    // Node 1: Fetch user data
    const user = await this.fetchUser();
    
    // Node 2: Fetch user posts
    const posts = await this.fetchUserPosts(user.id);
    
    // Node 3: Enrich posts with comments
    const enrichedPosts = await Promise.all(
      posts.map(post => this.enrichPost(post))
    );
    
    // Node 4: Generate summary
    const summary = await this.generateSummary(enrichedPosts);
    
    return summary;
  }
  
  private async fetchUser() {
    const response = await fetch('/api/user');
    return response.json();
  }
  
  private async fetchUserPosts(userId: string) {
    const response = await fetch(`/api/users/${userId}/posts`);
    return response.json();
  }
  
  private async enrichPost(post: any) {
    const comments = await fetch(`/api/posts/${post.id}/comments`);
    return {
      ...post,
      comments: await comments.json()
    };
  }
  
  private async generateSummary(posts: any[]) {
    // Use AI to generate summary
    return {
      totalPosts: posts.length,
      totalComments: posts.reduce((sum, p) => sum + p.comments.length, 0),
      summary: 'Generated summary...'
    };
  }
}
```

### Rivet Integration with Code

```typescript
// Exporting Rivet graphs to code

// 1. Export as JSON
const rivetGraph = {
  nodes: [...],
  connections: [...]
};

// 2. Import in your application
import rivetGraph from './workflows/content-generation.json';

// 3. Execute the graph
const executor = new RivetExecutor();
const result = await executor.executeGraph(rivetGraph, {
  topic: 'AI in Web Development'
});

// 4. Use the results
console.log(result);
```

---

## AI-Assisted Development

### Best Practices

**1. Prompt Engineering for Code Generation**
```typescript
// Good prompts for AI tools like Workflow

// ✅ Specific and clear
// "Create a React hook that fetches data with caching and error handling"

// ✅ Include context
// "In a Next.js 14 app, create a server action for form submission with validation"

// ✅ Specify requirements
// "Generate a TypeScript function that validates email with regex, returns boolean"

// ❌ Too vague
// "Make a function"

// ❌ No context
// "Create a component"
```

**2. Code Review with AI**
```typescript
// Using AI tools to review code

// Original code
function processData(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].active) {
      result.push(data[i].value * 2);
    }
  }
  return result;
}

// AI suggests improvements:
function processData(data: DataItem[]): number[] {
  return data
    .filter(item => item.active)
    .map(item => item.value * 2);
}

// AI explains:
// - Added TypeScript types
// - Used functional approach
// - More readable and maintainable
// - Better performance with built-in methods
```

**3. Test Generation**
```typescript
// AI can generate comprehensive tests

// Your function
function calculateDiscount(price: number, percentage: number): number {
  if (price < 0 || percentage < 0 || percentage > 100) {
    throw new Error('Invalid input');
  }
  return price * (1 - percentage / 100);
}

// AI generates tests
describe('calculateDiscount', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
    expect(calculateDiscount(50, 20)).toBe(40);
  });
  
  it('should handle edge cases', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
    expect(calculateDiscount(100, 100)).toBe(0);
  });
  
  it('should throw error for invalid inputs', () => {
    expect(() => calculateDiscount(-100, 10)).toThrow('Invalid input');
    expect(() => calculateDiscount(100, -10)).toThrow('Invalid input');
    expect(() => calculateDiscount(100, 101)).toThrow('Invalid input');
  });
});
```

---

## Visual Development Tools

### Benefits of Visual Programming

**1. Faster Prototyping**
- Visual tools like Rivet enable rapid prototyping
- No need to write boilerplate code
- Immediate visual feedback

**2. Better Understanding**
- Complex workflows are easier to understand visually
- Data flow is explicit
- Debugging is more intuitive

**3. Team Collaboration**
- Non-technical team members can understand workflows
- Easier to discuss and modify logic
- Visual documentation

### Combining Visual and Code

```typescript
// Best practice: Use visual tools for workflows,
// code for implementation details

// Rivet graph defines the workflow
const workflow = {
  name: 'User Onboarding',
  nodes: [
    { type: 'trigger', event: 'user_signup' },
    { type: 'send_email', template: 'welcome' },
    { type: 'create_profile', handler: 'createUserProfile' },
    { type: 'assign_tasks', handler: 'assignOnboardingTasks' }
  ]
};

// Code implements the handlers
async function createUserProfile(user: User) {
  return await db.profile.create({
    data: {
      userId: user.id,
      displayName: user.name,
      avatar: generateAvatar(user.name)
    }
  });
}

async function assignOnboardingTasks(user: User) {
  const tasks = [
    'Complete profile',
    'Add profile picture',
    'Connect social accounts'
  ];
  
  return await db.task.createMany({
    data: tasks.map(task => ({
      userId: user.id,
      title: task,
      completed: false
    }))
  });
}
```

---

## Integration Patterns

### Workflow + Rivet Integration

```typescript
// Combining AI-assisted coding with visual workflows

// 1. Use Workflow to generate code
// 2. Use Rivet to orchestrate the workflow
// 3. Export and integrate

class IntegratedDevelopment {
  // Workflow generates this function
  async processUserData(userId: string) {
    const user = await this.fetchUser(userId);
    const enriched = await this.enrichUserData(user);
    return this.formatOutput(enriched);
  }
  
  // Rivet orchestrates the workflow
  async executeWorkflow(workflowId: string, input: any) {
    const graph = await this.loadRivetGraph(workflowId);
    const executor = new RivetExecutor();
    return await executor.executeGraph(graph, input);
  }
  
  // Integration point
  async runIntegratedProcess(userId: string) {
    // Use Workflow-generated code
    const userData = await this.processUserData(userId);
    
    // Use Rivet workflow
    const result = await this.executeWorkflow('user-processing', userData);
    
    return result;
  }
  
  private async loadRivetGraph(workflowId: string) {
    // Load Rivet graph from file or database
    return require(`./workflows/${workflowId}.json`);
  }
}
```

---

## Best Practices

### 1. When to Use Visual Tools 🟡 [Mid]

**Use Rivet for:**
- Complex workflows with multiple steps
- AI chain orchestration
- Data transformation pipelines
- Non-technical team collaboration

**Use Code for:**
- Performance-critical operations
- Complex business logic
- Fine-grained control
- Version control and testing

### 2. When to Use AI Assistance 🟡 [Mid]

**Use Workflow for:**
- Boilerplate code generation
- Refactoring suggestions
- Test generation
- Documentation

**Write manually for:**
- Critical business logic
- Security-sensitive code
- Performance-optimized code
- Complex algorithms

### 3. Hybrid Approach 🟡 [Mid]

```typescript
// Best practice: Combine visual and code

// Visual workflow (Rivet)
const contentWorkflow = {
  steps: [
    'generate_outline',
    'write_sections',
    'review_content',
    'publish'
  ]
};

// AI-generated code (Workflow)
async function generateOutline(topic: string) {
  // Workflow generates this implementation
  const prompt = `Create an outline for: ${topic}`;
  return await aiService.complete(prompt);
}

// Manual code (critical logic)
async function publishContent(content: Content) {
  // Manually written for control
  await validateContent(content);
  await saveToDatabase(content);
  await notifySubscribers(content);
  await updateSearchIndex(content);
}
```

---

## Key Takeaways

1. **Workflow**: AI-powered code generation and refactoring
2. **Rivet**: Visual programming for workflows and AI chains
3. **Hybrid Approach**: Combine visual tools with traditional coding
4. **AI Assistance**: Use for boilerplate, not critical logic
5. **Visual Workflows**: Better for complex orchestration
6. **Code**: Better for performance and fine control
7. **Integration**: Tools work together for maximum productivity

---

## Resources

- **Workflow**: https://useworkflow.dev/
- **Rivet**: https://www.rivet.dev/
- **Documentation**: Check official docs for latest features
- **Community**: Join Discord/Slack for support

---

[← Previous: Testing Tools](./04-testing-tools.md) | [Back to Table of Contents](../../00-table-of-contents.md)
