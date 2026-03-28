# Development Tools - Interview Questions / Câu Hỏi Phỏng Vấn Công Cụ Phát Triển

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Advanced Interview Questions / Câu Hỏi Phỏng Vấn Nâng Cao

### Q1: Explain how dataflow programming differs from traditional control flow programming

**English Answer:**

Dataflow programming and control flow programming represent fundamentally different execution models:

**Control Flow (Traditional):**
- Execution order is explicitly defined by the programmer
- Uses sequential statements, loops, and conditionals
- Program counter determines what executes next
- Example: `step1() → step2() → step3()`

**Dataflow:**
- Execution is determined by data availability
- Nodes execute when all inputs are ready
- Implicit parallelism - independent nodes can run concurrently
- Visual representation as directed acyclic graphs (DAGs)
- Example: Node B executes when Node A produces output

**Key Advantages of Dataflow:**
1. **Automatic Parallelization**: Independent operations run concurrently
2. **Visual Clarity**: Data dependencies are explicit
3. **Easier Debugging**: Can trace data flow visually
4. **Composability**: Easy to add/remove nodes

**Use Cases:**
- Data processing pipelines
- AI workflow orchestration
- Stream processing
- Visual programming tools (Rivet, Node-RED)

**Tiếng Việt:**

Lập trình luồng dữ liệu và luồng điều khiển đại diện cho các mô hình thực thi khác nhau về cơ bản:

**Luồng Điều Khiển (Truyền Thống):**
- Thứ tự thực thi được định nghĩa rõ ràng bởi lập trình viên
- Sử dụng câu lệnh tuần tự, vòng lặp và điều kiện
- Program counter xác định cái gì thực thi tiếp theo

**Luồng Dữ Liệu:**
- Thực thi được xác định bởi tính khả dụng của dữ liệu
- Nodes thực thi khi tất cả inputs sẵn sàng
- Song song ngầm định - các nodes độc lập có thể chạy đồng thời
- Biểu diễn trực quan như đồ thị có hướng không chu trình (DAGs)

**Ưu Điểm Chính:**
1. **Song song hóa tự động**: Các thao tác độc lập chạy đồng thời
2. **Rõ ràng trực quan**: Phụ thuộc dữ liệu rõ ràng
3. **Debug dễ hơn**: Có thể theo dõi luồng dữ liệu trực quan
4. **Khả năng kết hợp**: Dễ thêm/xóa nodes

---

### Q2: How do transformer models work for code generation?

**English Answer:**

Transformer models for code generation use the following architecture:

**1. Tokenization:**
- Code is split into tokens (keywords, identifiers, operators)
- Each token is converted to a numerical ID
- Special tokens mark boundaries (start, end, padding)

**2. Embedding:**
- Token IDs are converted to dense vectors (embeddings)
- Positional encodings add sequence information
- Embeddings capture semantic meaning

**3. Attention Mechanism:**
- **Self-Attention**: Each token attends to all other tokens
- **Multi-Head Attention**: Multiple attention patterns learned simultaneously
- **Scaled Dot-Product**: `Attention(Q,K,V) = softmax(QK^T/√d)V`

**4. Context Understanding:**
- Encoder processes input context (existing code, comments)
- Decoder generates output tokens autoregressively
- Cross-attention links encoder and decoder

**5. Generation:**
- Model predicts next token probability distribution
- Sampling strategies: greedy, beam search, temperature sampling
- Continues until end token or max length

**Key Components:**
```
Input → Tokenize → Embed → Encode → Decode → Generate
```

**Training:**
- Trained on massive code repositories (GitHub, etc.)
- Learns patterns, idioms, and best practices
- Fine-tuned for specific languages/frameworks

**Tiếng Việt:**

Mô hình transformer cho tạo code sử dụng kiến trúc sau:

**1. Tokenization**: Code được chia thành tokens
**2. Embedding**: Tokens chuyển thành vectors
**3. Attention**: Mỗi token chú ý đến tất cả tokens khác
**4. Hiểu ngữ cảnh**: Encoder xử lý input, decoder tạo output
**5. Tạo**: Dự đoán token tiếp theo cho đến khi hoàn thành

---

### Q3: What are the key principles of effective prompt engineering?

**English Answer:**

Effective prompt engineering follows these principles:

**1. Specificity:**
- Be precise about requirements
- Include exact input/output specifications
- Specify edge cases to handle
- Bad: "Create a function"
- Good: "Create a TypeScript function that validates email addresses using regex, returns boolean, handles null/undefined"

**2. Context:**
- Provide relevant codebase context
- Mention framework and version
- Include coding standards
- Specify dependencies available

**3. Structure:**
- Use clear sections (Context, Task, Constraints, Examples)
- Number requirements for clarity
- Separate concerns logically

**4. Examples:**
- Include both good and bad examples
- Show expected patterns
- Demonstrate edge case handling
- Explain why examples are good/bad

**5. Constraints:**
- List explicit constraints
- Specify what NOT to do
- Include performance requirements
- Mention security considerations

**6. Output Format:**
- Specify desired output structure
- Request tests, types, comments as needed
- Define code style preferences

**7. Iteration:**
- Refine prompts based on results
- Add specificity if output too generic
- Include counter-examples if constraints violated

**Example Structure:**
```
# Context
[Project details, framework, language]

# Task
[Clear description of what to build]

# Requirements
1. [Specific requirement]
2. [Another requirement]

# Constraints
- Must use TypeScript
- Must include error handling
- Performance: O(n) time complexity

# Examples
[Good and bad examples with explanations]

# Output Format
- Include types
- Include tests
- Include documentation
```

**Tiếng Việt:**

Kỹ thuật prompt hiệu quả tuân theo các nguyên tắc:

**1. Tính cụ thể**: Chính xác về yêu cầu
**2. Ngữ cảnh**: Cung cấp ngữ cảnh codebase liên quan
**3. Cấu trúc**: Sử dụng các phần rõ ràng
**4. Ví dụ**: Bao gồm ví dụ tốt và xấu
**5. Ràng buộc**: Liệt kê ràng buộc rõ ràng
**6. Định dạng đầu ra**: Chỉ định cấu trúc output mong muốn
**7. Lặp lại**: Tinh chỉnh prompts dựa trên kết quả

---

### Q4: How does AI-powered code refactoring work?

**English Answer:**

AI-powered refactoring uses multiple techniques:

**1. Static Analysis:**
- Parse code into Abstract Syntax Tree (AST)
- Calculate complexity metrics (cyclomatic, cognitive)
- Detect code smells (long functions, duplication, etc.)

**2. Pattern Recognition:**
- Identify common anti-patterns
- Match against known refactoring patterns
- Use machine learning to detect subtle issues

**3. Impact Analysis:**
- Determine affected files and functions
- Check for breaking changes
- Estimate test coverage impact
- Calculate maintainability improvement

**4. Suggestion Generation:**
- Generate refactored code
- Provide before/after comparison
- Explain reasoning
- Estimate confidence level

**5. Prioritization:**
- Score refactorings by impact
- Consider effort required
- Account for breaking changes
- Rank by confidence

**Common Refactorings Detected:**

**Extract Function:**
- Long functions (>50 lines)
- High complexity (>10 cyclomatic)
- Logical blocks that can be separated

**Remove Duplication:**
- Similar code blocks (>80% similarity)
- Repeated patterns across files
- Copy-paste code

**Simplify Conditionals:**
- Deep nesting (>4 levels)
- Complex boolean expressions
- Multiple return paths

**Improve Naming:**
- Single-letter variables
- Unclear abbreviations
- Inconsistent naming conventions

**Add Error Handling:**
- Unhandled promises
- Missing try-catch blocks
- No error boundaries

**Optimize Performance:**
- Inefficient loops
- Unnecessary re-renders (React)
- Memory leaks

**Improve Types:**
- 'any' types in TypeScript
- Missing type annotations
- Opportunities for generics

**Scoring Formula:**
```
Priority = (
  confidence * 0.3 +
  maintainabilityImprovement * 0.25 +
  readabilityImprovement * 0.2 +
  (noBreakingChanges ? 0.15 : 0) +
  (lowEffort ? 0.1 : 0)
)
```

**Tiếng Việt:**

Refactor hỗ trợ AI sử dụng nhiều kỹ thuật:

**1. Phân tích tĩnh**: Phân tích code thành AST, tính metrics
**2. Nhận dạng pattern**: Xác định anti-patterns
**3. Phân tích tác động**: Xác định files bị ảnh hưởng
**4. Tạo đề xuất**: Tạo code đã refactor
**5. Ưu tiên**: Xếp hạng refactorings theo tác động

---

### Q5: What are the trade-offs between visual programming and traditional coding?

**English Answer:**

**Visual Programming Advantages:**

1. **Intuitive Understanding**
   - Visual representation easier to grasp
   - Data flow is explicit
   - Non-technical stakeholders can participate

2. **Rapid Prototyping**
   - Faster to build workflows
   - Drag-and-drop interface
   - Immediate visual feedback

3. **Reduced Boilerplate**
   - No need to write connection code
   - Built-in error handling
   - Automatic type checking

4. **Better Debugging**
   - Can visualize data flow
   - Inspect intermediate values
   - Step through execution visually

**Visual Programming Disadvantages:**

1. **Performance Overhead**
   - Interpretation layer adds latency
   - Less control over optimization
   - May not be suitable for high-performance needs

2. **Complexity Limits**
   - Very complex logic hard to visualize
   - Can become cluttered with many nodes
   - Difficult to represent recursive algorithms

3. **Version Control**
   - Visual formats harder to diff
   - Merge conflicts more difficult
   - Less tooling support

4. **Vendor Lock-in**
   - Tied to specific platform
   - Migration can be difficult
   - Limited portability

5. **Limited Expressiveness**
   - Some patterns hard to express visually
   - May need to drop to code anyway
   - Less flexibility than code

**Traditional Coding Advantages:**

1. **Full Control**
   - Fine-grained optimization
   - Access to all language features
   - No performance overhead

2. **Better Tooling**
   - Mature IDEs and editors
   - Excellent version control
   - Comprehensive testing frameworks

3. **Unlimited Complexity**
   - Can express any algorithm
   - No visual clutter
   - Scales to large codebases

4. **Portability**
   - Standard languages
   - No vendor lock-in
   - Easy to migrate

**Traditional Coding Disadvantages:**

1. **Steeper Learning Curve**
   - Requires programming knowledge
   - Syntax can be intimidating
   - More boilerplate code

2. **Less Intuitive**
   - Data flow not immediately obvious
   - Harder for non-technical users
   - Requires mental model

**Best Practice: Hybrid Approach**

Use visual tools for:
- Workflow orchestration
- Data pipelines
- AI chains
- Business logic visualization

Use code for:
- Performance-critical operations
- Complex algorithms
- Fine-grained control
- Reusable libraries

**Tiếng Việt:**

**Ưu điểm Lập trình Trực quan:**
1. Hiểu trực quan
2. Tạo mẫu nhanh
3. Giảm boilerplate
4. Debug tốt hơn

**Nhược điểm:**
1. Overhead hiệu suất
2. Giới hạn độ phức tạp
3. Kiểm soát phiên bản khó
4. Vendor lock-in

**Cách tiếp cận tốt nhất**: Kết hợp cả hai - visual cho workflows, code cho logic phức tạp.

---

### Q6: How do you evaluate the quality of AI-generated code?

**English Answer:**

Evaluate AI-generated code using multiple criteria:

**1. Correctness:**
- Does it solve the problem?
- Handles edge cases?
- Passes all test cases?
- No logical errors?

**2. Code Quality:**
- Follows best practices?
- Proper error handling?
- Good naming conventions?
- Appropriate comments?

**3. Performance:**
- Efficient algorithms?
- Appropriate data structures?
- No unnecessary operations?
- Scales well?

**4. Security:**
- No vulnerabilities?
- Input validation?
- No hardcoded secrets?
- Follows security best practices?

**5. Maintainability:**
- Easy to understand?
- Well-structured?
- Modular design?
- Low coupling?

**6. Type Safety (TypeScript):**
- Proper type annotations?
- No 'any' types?
- Leverages type system?

**7. Testability:**
- Easy to test?
- No hard dependencies?
- Pure functions where appropriate?

**Evaluation Checklist:**

```typescript
interface CodeQualityMetrics {
  correctness: {
    passesTests: boolean;
    handlesEdgeCases: boolean;
    logicallySound: boolean;
  };
  
  quality: {
    followsBestPractices: boolean;
    hasErrorHandling: boolean;
    goodNaming: boolean;
    appropriateComments: boolean;
  };
  
  performance: {
    efficientAlgorithm: boolean;
    appropriateDataStructures: boolean;
    scalable: boolean;
  };
  
  security: {
    noVulnerabilities: boolean;
    inputValidation: boolean;
    noHardcodedSecrets: boolean;
  };
  
  maintainability: {
    easyToUnderstand: boolean;
    wellStructured: boolean;
    modular: boolean;
    lowCoupling: boolean;
  };
  
  typeSafety: {
    properTypes: boolean;
    noAnyTypes: boolean;
    leveragesTypeSystem: boolean;
  };
  
  testability: {
    easyToTest: boolean;
    noDependencies: boolean;
    pureFunctions: boolean;
  };
}
```

**Red Flags:**
- Uses 'any' type extensively
- No error handling
- Hardcoded values
- Complex nested logic
- Poor naming
- No comments for complex logic
- Security vulnerabilities
- Performance issues

**Best Practices:**
1. Always review AI-generated code
2. Run comprehensive tests
3. Check for security issues
4. Verify performance
5. Ensure maintainability
6. Refactor if needed

**Tiếng Việt:**

Đánh giá code AI tạo sử dụng nhiều tiêu chí:

**1. Tính đúng đắn**: Giải quyết vấn đề? Xử lý edge cases?
**2. Chất lượng code**: Tuân theo best practices?
**3. Hiệu suất**: Thuật toán hiệu quả?
**4. Bảo mật**: Không có lỗ hổng?
**5. Khả năng bảo trì**: Dễ hiểu? Cấu trúc tốt?
**6. Type safety**: Types đúng?
**7. Khả năng kiểm thử**: Dễ test?

---

### Q7: Explain the concept of critical path in dataflow execution

**English Answer:**

The critical path in dataflow execution is the longest sequence of dependent operations that determines the minimum execution time.

**Definition:**
- The path from start to end with the longest cumulative execution time
- Determines overall workflow completion time
- Cannot be parallelized (operations are dependent)

**Importance:**
1. **Performance Optimization**: Focus optimization efforts on critical path
2. **Resource Allocation**: Prioritize critical path nodes
3. **Scheduling**: Execute critical path nodes first
4. **Bottleneck Identification**: Find slowest operations

**Calculation:**
```typescript
function calculateCriticalPath(graph: DataflowGraph): Path {
  // 1. Calculate earliest start time for each node
  const earliestStart = new Map<string, number>();
  
  // Topological sort
  const sorted = topologicalSort(graph);
  
  for (const nodeId of sorted) {
    const node = graph.nodes.get(nodeId);
    const dependencies = graph.getIncomingEdges(nodeId);
    
    if (dependencies.length === 0) {
      earliestStart.set(nodeId, 0);
    } else {
      const maxDependencyTime = Math.max(
        ...dependencies.map(dep => 
          earliestStart.get(dep.source)! + 
          graph.nodes.get(dep.source)!.executionTime
        )
      );
      earliestStart.set(nodeId, maxDependencyTime);
    }
  }
  
  // 2. Find path with maximum time
  return findLongestPath(graph, earliestStart);
}
```

**Example:**
```
A (2s) → B (3s) → D (2s) = 7s (Critical Path)
A (2s) → C (1s) → D (2s) = 5s
```

**Optimization Strategies:**
1. **Parallelize Non-Critical Paths**: Run independent operations concurrently
2. **Optimize Critical Nodes**: Focus on reducing execution time of critical path nodes
3. **Reorder Operations**: Move operations off critical path if possible
4. **Cache Results**: Cache expensive operations on critical path

**Tiếng Việt:**

Critical path trong thực thi luồng dữ liệu là chuỗi dài nhất của các thao tác phụ thuộc xác định thời gian thực thi tối thiểu.

**Tầm quan trọng:**
1. Tối ưu hiệu suất
2. Phân bổ tài nguyên
3. Lập lịch
4. Xác định bottleneck

---

## Practical Scenarios / Tình Huống Thực Tế

### Scenario 1: Choosing Between Visual and Code

**Question:** When would you choose visual programming over traditional coding?

**Answer:**

Choose **Visual Programming** when:
- Building data processing pipelines
- Orchestrating AI workflows
- Need non-technical stakeholder involvement
- Rapid prototyping required
- Workflow logic is primary concern
- Clear data flow visualization needed

Choose **Traditional Coding** when:
- Performance is critical
- Complex algorithms required
- Need fine-grained control
- Building reusable libraries
- Version control is important
- Large team collaboration

**Hybrid Approach:**
- Use visual tools for high-level orchestration
- Use code for implementation details
- Export visual workflows to code
- Integrate both seamlessly

---

### Scenario 2: Improving AI Code Generation

**Question:** AI keeps generating code with 'any' types. How do you fix this?

**Answer:**

**1. Improve Prompt:**
```
Bad: "Create a function to process data"

Good: "Create a TypeScript function that processes user data.
- Input: User object with id (string), name (string), age (number)
- Output: ProcessedUser with all fields plus isAdult (boolean)
- Use strict TypeScript types, no 'any'
- Include proper type definitions"
```

**2. Provide Context:**
- Include existing type definitions
- Show examples of proper typing
- Specify type constraints

**3. Add Constraints:**
- "Must use strict TypeScript"
- "No 'any' types allowed"
- "Include interface definitions"

**4. Iterate:**
- Review generated code
- Provide feedback
- Refine prompt based on results

---

## Summary / Tóm Tắt

**Key Concepts:**
1. Dataflow programming enables automatic parallelization
2. Transformer models use attention mechanisms for code generation
3. Effective prompts require specificity, context, and examples
4. AI refactoring detects patterns and suggests improvements
5. Visual programming trades control for intuitive understanding
6. Critical path determines minimum execution time
7. Always evaluate AI-generated code thoroughly

**Best Practices:**
- Use hybrid approach (visual + code)
- Review all AI-generated code
- Optimize critical paths
- Iterate on prompts
- Focus on maintainability

---

[← Back to Modern Development Tools](./13-tools-ecosystem-05-modern-development-tools.md) | [Back to Table of Contents](../../00-table-of-contents.md)
