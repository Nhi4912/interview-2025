# Interactive MDX Components Guide

This guide provides comprehensive documentation for all interactive MDX components available in the bilingual content expansion system.

## Table of Contents

1. [Glossary Component](#glossary-component)
2. [Interactive Demo Component](#interactive-demo-component)
3. [Quiz Component](#quiz-component)
4. [Code Example Component](#code-example-component)
5. [Diagram Component](#diagram-component)
6. [Knowledge Graph Component](#knowledge-graph-component)

---

## Glossary Component

The Glossary component provides bilingual technical term definitions with interactive tooltips and expandable lists.

### Features

- **Bilingual Support**: Display terms in both English and Vietnamese
- **Inline Tooltips**: Hover over terms to see definitions
- **Expandable List**: Full glossary with search functionality
- **Responsive Design**: Works on all screen sizes
- **Keyboard Accessible**: Full keyboard navigation support

### Usage

#### Full Glossary

```tsx
import { Glossary } from "@/components/mdx";
import { GlossaryTerm } from "@/types/content";

const terms: GlossaryTerm[] = [
  {
    term: "Closure",
    definition: {
      en: "A function that has access to variables in its outer scope.",
      vi: "Một hàm có quyền truy cập vào các biến trong phạm vi bên ngoài.",
    },
  },
  // ... more terms
];

<Glossary terms={terms} locale="en" />;
```

#### Inline Glossary Terms

```tsx
import { GlossaryTermTooltip } from "@/components/mdx";

<p>
  Understanding{" "}
  <GlossaryTermTooltip
    term="Closure"
    definition={{
      en: "A function that has access to variables in its outer scope.",
      vi: "Một hàm có quyền truy cập vào các biến trong phạm vi bên ngoài.",
    }}
    locale="en"
    detailsUrl="/learn/javascript/closures"
  />{" "}
  is essential.
</p>;
```

### Props

#### Glossary Props

| Prop        | Type             | Default  | Description                            |
| ----------- | ---------------- | -------- | -------------------------------------- |
| `terms`     | `GlossaryTerm[]` | Required | Array of glossary terms                |
| `locale`    | `'en' \| 'vi'`   | `'en'`   | Display language                       |
| `inline`    | `boolean`        | `false`  | Display as inline comma-separated list |
| `className` | `string`         | `''`     | Additional CSS classes                 |

#### GlossaryTermTooltip Props

| Prop         | Type                         | Default  | Description                  |
| ------------ | ---------------------------- | -------- | ---------------------------- |
| `term`       | `string`                     | Required | Term to display              |
| `definition` | `{ en: string; vi: string }` | Required | Bilingual definitions        |
| `locale`     | `'en' \| 'vi'`               | `'en'`   | Display language             |
| `detailsUrl` | `string`                     | Optional | Link to detailed explanation |

---

## Interactive Demo Component

The Interactive Demo component provides step-by-step visualizations of algorithms and data structures.

### Features

- **Multiple Visualizations**: Sorting, Stack, Queue, Tree, Linked List
- **Step-by-Step Playback**: Play, pause, and navigate through steps
- **Adjustable Speed**: Control animation speed
- **Bilingual Descriptions**: Step descriptions in English and Vietnamese
- **Highlighting**: Visual highlighting of active elements

### Usage

```tsx
import { InteractiveDemo } from '@/components/mdx';

// Bubble Sort Visualization
<InteractiveDemo
  type="sorting"
  title="Bubble Sort Visualization"
  description="Watch how bubble sort compares and swaps elements"
  locale="en"
  initialData={[64, 34, 25, 12, 22, 11, 90]}
/>

// Stack Visualization
<InteractiveDemo
  type="stack"
  title="Stack Data Structure"
  description="Visualize push and pop operations (LIFO)"
  locale="en"
  initialData={[10, 20, 30, 40]}
/>

// Queue Visualization
<InteractiveDemo
  type="queue"
  title="Queue Data Structure"
  description="Visualize enqueue and dequeue operations (FIFO)"
  locale="en"
  initialData={[10, 20, 30, 40]}
/>

// Binary Search Tree
<InteractiveDemo
  type="tree"
  title="Binary Search Tree"
  description="Watch how elements are inserted into a BST"
  locale="en"
  initialData={[50, 30, 70, 20, 40, 60, 80]}
/>

// Linked List
<InteractiveDemo
  type="linked-list"
  title="Linked List"
  description="Visualize how nodes are added to a linked list"
  locale="en"
  initialData={[10, 20, 30, 40, 50]}
/>
```

### Props

| Prop          | Type           | Default  | Description                    |
| ------------- | -------------- | -------- | ------------------------------ |
| `type`        | `DemoType`     | Required | Type of visualization          |
| `title`       | `string`       | Optional | Demo title                     |
| `description` | `string`       | Optional | Demo description               |
| `locale`      | `'en' \| 'vi'` | `'en'`   | Display language               |
| `initialData` | `any`          | Optional | Initial data for visualization |
| `className`   | `string`       | `''`     | Additional CSS classes         |

### Demo Types

- `'sorting'`: Bubble sort algorithm visualization
- `'stack'`: Stack data structure (LIFO)
- `'queue'`: Queue data structure (FIFO)
- `'tree'`: Binary search tree
- `'linked-list'`: Singly linked list
- `'custom'`: Custom visualization (requires custom implementation)

---

## Quiz Component

The Quiz component provides interactive knowledge checks with multiple question types and bilingual support.

### Features

- **Multiple Question Types**: Multiple choice, true/false, code-based
- **Bilingual Questions**: Questions and answers in both languages
- **Progress Tracking**: Visual progress bar
- **Explanations**: Show/hide explanations for each question
- **Score Calculation**: Automatic scoring with pass/fail indication
- **Results Review**: Detailed review of all answers

### Usage

```tsx
import { Quiz } from "@/components/mdx";
import { QuizQuestion } from "@/components/mdx/Quiz";

const questions: QuizQuestion[] = [
  {
    id: "q1",
    type: "multiple-choice",
    question: {
      en: "What is a closure in JavaScript?",
      vi: "Closure trong JavaScript là gì?",
    },
    options: {
      en: [
        "A function that returns another function",
        "A function that has access to variables in its outer scope",
        "A function that is immediately invoked",
        "A function that uses the this keyword",
      ],
      vi: [
        "Một hàm trả về một hàm khác",
        "Một hàm có quyền truy cập vào các biến trong phạm vi bên ngoài",
        "Một hàm được gọi ngay lập tức",
        "Một hàm sử dụng từ khóa this",
      ],
    },
    correctAnswer: 1,
    explanation: {
      en: "A closure is a function that has access to variables in its outer scope.",
      vi: "Closure là một hàm có quyền truy cập vào các biến trong phạm vi bên ngoài.",
    },
  },
  {
    id: "q2",
    type: "true-false",
    question: {
      en: "JavaScript is a single-threaded language.",
      vi: "JavaScript là ngôn ngữ đơn luồng.",
    },
    correctAnswer: "true",
    explanation: {
      en: "JavaScript is single-threaded but can handle async operations.",
      vi: "JavaScript là đơn luồng nhưng có thể xử lý các hoạt động bất đồng bộ.",
    },
  },
  {
    id: "q3",
    type: "code",
    question: {
      en: "What will this code output?",
      vi: "Đoạn mã này sẽ xuất ra gì?",
    },
    code: `
console.log(typeof null);
console.log(typeof undefined);
    `,
    options: {
      en: [
        "object, undefined",
        "null, undefined",
        "object, object",
        "null, null",
      ],
      vi: [
        "object, undefined",
        "null, undefined",
        "object, object",
        "null, null",
      ],
    },
    correctAnswer: 0,
    explanation: {
      en: 'typeof null returns "object" (a known JavaScript quirk), and typeof undefined returns "undefined".',
      vi: 'typeof null trả về "object" (một quirk nổi tiếng của JavaScript), và typeof undefined trả về "undefined".',
    },
  },
];

<Quiz
  id="javascript-basics-quiz"
  questions={questions}
  locale="en"
  passingScore={70}
  onComplete={(score, passed) => {
    console.log(`Score: ${score}%, Passed: ${passed}`);
  }}
/>;
```

### Props

| Prop           | Type                                       | Default  | Description                     |
| -------------- | ------------------------------------------ | -------- | ------------------------------- |
| `id`           | `string`                                   | Required | Unique quiz identifier          |
| `questions`    | `QuizQuestion[]`                           | Required | Array of quiz questions         |
| `locale`       | `'en' \| 'vi'`                             | `'en'`   | Display language                |
| `passingScore` | `number`                                   | `70`     | Minimum score to pass (0-100)   |
| `onComplete`   | `(score: number, passed: boolean) => void` | Optional | Callback when quiz is completed |

### Question Types

#### Multiple Choice

```typescript
{
  id: 'q1',
  type: 'multiple-choice',
  question: { en: '...', vi: '...' },
  options: {
    en: ['Option A', 'Option B', 'Option C', 'Option D'],
    vi: ['Tùy chọn A', 'Tùy chọn B', 'Tùy chọn C', 'Tùy chọn D'],
  },
  correctAnswer: 1, // Index of correct option (0-based)
  explanation: { en: '...', vi: '...' },
}
```

#### True/False

```typescript
{
  id: 'q2',
  type: 'true-false',
  question: { en: '...', vi: '...' },
  correctAnswer: 'true', // or 'false'
  explanation: { en: '...', vi: '...' },
}
```

#### Code-Based

```typescript
{
  id: 'q3',
  type: 'code',
  question: { en: '...', vi: '...' },
  code: 'console.log("Hello");',
  options: {
    en: ['Option A', 'Option B'],
    vi: ['Tùy chọn A', 'Tùy chọn B'],
  },
  correctAnswer: 0,
  explanation: { en: '...', vi: '...' },
}
```

---

## Code Example Component

The Code Example component provides syntax-highlighted code with optional execution and editing capabilities.

### Features

- **Syntax Highlighting**: Support for multiple languages
- **Runnable Code**: Execute JavaScript/TypeScript code
- **Editable Code**: Allow users to modify and run code
- **Line Highlighting**: Highlight specific lines
- **Line Numbers**: Optional line numbering
- **Sandboxed Execution**: Safe code execution environment

### Usage

```tsx
import { CodeExample } from '@/components/mdx';

// Basic code example
<CodeExample
  code={`
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
  `}
  language="javascript"
  title="Basic Function Example"
  showLineNumbers={true}
/>

// Runnable code
<CodeExample
  code={`
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log('Sum:', sum);
  `}
  language="javascript"
  title="Array Reduce Example"
  runnable={true}
  showLineNumbers={true}
/>

// Editable and runnable
<CodeExample
  code={`
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
  `}
  language="javascript"
  title="Fibonacci Function"
  runnable={true}
  editable={true}
  showLineNumbers={true}
/>

// With line highlighting
<CodeExample
  code={`
function example() {
  const x = 10;
  const y = 20;
  return x + y;
}
  `}
  language="javascript"
  highlightLines={[3, 4]}
  showLineNumbers={true}
/>
```

### Props

| Prop              | Type       | Default  | Description                  |
| ----------------- | ---------- | -------- | ---------------------------- |
| `code`            | `string`   | Required | Code to display              |
| `language`        | `string`   | Required | Programming language         |
| `title`           | `string`   | Optional | Code example title           |
| `runnable`        | `boolean`  | `false`  | Enable code execution        |
| `editable`        | `boolean`  | `false`  | Allow code editing           |
| `highlightLines`  | `number[]` | `[]`     | Lines to highlight (1-based) |
| `showLineNumbers` | `boolean`  | `true`   | Show line numbers            |

---

## Diagram Component

The Diagram component renders Mermaid diagrams for flowcharts, sequence diagrams, and architecture visualizations.

### Usage

```tsx
import { Diagram } from "@/components/mdx";

<Diagram
  type="mermaid"
  title="Event Loop Diagram"
  caption="How JavaScript handles asynchronous operations"
>
  {`
graph TD
    A[Call Stack] --> B{Empty?}
    B -->|Yes| C[Check Callback Queue]
    B -->|No| D[Execute Function]
    C --> E[Move Callback to Stack]
    E --> A
    D --> A
`}
</Diagram>;
```

### Props

| Prop        | Type                                                       | Default     | Description            |
| ----------- | ---------------------------------------------------------- | ----------- | ---------------------- |
| `children`  | `string`                                                   | Required    | Mermaid diagram syntax |
| `type`      | `'mermaid' \| 'flowchart' \| 'sequence' \| 'architecture'` | `'mermaid'` | Diagram type           |
| `title`     | `string`                                                   | Optional    | Diagram title          |
| `caption`   | `string`                                                   | Optional    | Diagram caption        |
| `className` | `string`                                                   | `''`        | Additional CSS classes |

---

## Knowledge Graph Component

The Knowledge Graph component visualizes relationships between topics and learning paths.

### Usage

```tsx
import { KnowledgeGraph } from "@/components/mdx";

<KnowledgeGraph
  centerNodeId="javascript-closures"
  depth={2}
  locale="en"
  highlightPath={[
    "javascript-basics",
    "javascript-functions",
    "javascript-closures",
  ]}
/>;
```

### Props

| Prop            | Type           | Default  | Description                     |
| --------------- | -------------- | -------- | ------------------------------- |
| `centerNodeId`  | `string`       | Required | ID of the central topic         |
| `depth`         | `number`       | Required | Levels of relationships to show |
| `locale`        | `'en' \| 'vi'` | Required | Display language                |
| `highlightPath` | `string[]`     | Optional | Path to highlight               |

---

## Best Practices

### 1. Glossary Usage

- Use inline tooltips for first mentions of technical terms
- Include a full glossary at the end of comprehensive articles
- Keep definitions concise (1-2 sentences)
- Always provide both English and Vietnamese definitions

### 2. Interactive Demos

- Use demos to illustrate complex algorithms
- Keep initial data sets small for clarity
- Provide clear descriptions for each step
- Consider performance for large data sets

### 3. Quizzes

- Place quizzes after major sections
- Mix question types for variety
- Provide detailed explanations
- Set appropriate passing scores (70-80% recommended)

### 4. Code Examples

- Use runnable examples for simple demonstrations
- Enable editing for practice exercises
- Highlight important lines
- Keep examples focused and concise

### 5. Accessibility

- All components support keyboard navigation
- Provide ARIA labels for screen readers
- Ensure sufficient color contrast
- Test with screen readers

### 6. Performance

- Lazy load heavy components when possible
- Limit the number of interactive demos per page
- Optimize quiz data structures
- Use code splitting for large visualizations

---

## Testing

To test the interactive components, visit:

```
http://localhost:3000/test-interactive-components
```

This page demonstrates all components with various configurations and both English and Vietnamese locales.

---

## Contributing

When adding new interactive components:

1. Follow the existing component structure
2. Implement bilingual support
3. Ensure accessibility compliance
4. Add comprehensive documentation
5. Create test examples
6. Update this guide

---

## Support

For issues or questions about these components, please refer to:

- Design Document: `.kiro/specs/bilingual-content-expansion/design.md`
- Requirements: `.kiro/specs/bilingual-content-expansion/requirements.md`
- Implementation Tasks: `.kiro/specs/bilingual-content-expansion/tasks.md`
