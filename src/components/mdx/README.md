# MDX Components

This directory contains interactive components for use in MDX content files.

## Diagram Component

The `Diagram` component renders Mermaid diagrams with support for various diagram types including flowcharts, sequence diagrams, architecture diagrams, and more.

### Features

- ✅ Supports all Mermaid diagram types (flowchart, sequence, class, state, ER, git, etc.)
- ✅ Responsive sizing for mobile, tablet, and desktop
- ✅ Error handling with detailed error messages
- ✅ Loading states
- ✅ Optional title and caption
- ✅ Accessible and keyboard-friendly

### Usage

```tsx
import { Diagram } from '@/components/mdx/Diagram';

// Basic usage
<Diagram>
  {`graph TD
    A[Start] --> B[End]`}
</Diagram>

// With title and caption
<Diagram
  title="System Architecture"
  caption="Figure 1: High-level system design"
>
  {`graph LR
    A[Frontend] --> B[Backend]
    B --> C[Database]`}
</Diagram>
```

### Props

| Prop        | Type                                                       | Default     | Description                         |
| ----------- | ---------------------------------------------------------- | ----------- | ----------------------------------- |
| `children`  | `string`                                                   | required    | Mermaid diagram syntax              |
| `type`      | `'mermaid' \| 'flowchart' \| 'sequence' \| 'architecture'` | `'mermaid'` | Diagram type (for future use)       |
| `title`     | `string`                                                   | optional    | Title displayed above the diagram   |
| `caption`   | `string`                                                   | optional    | Caption displayed below the diagram |
| `className` | `string`                                                   | `''`        | Additional CSS classes              |

### Supported Diagram Types

1. **Flowchart** - `graph TD`, `graph LR`
2. **Sequence Diagram** - `sequenceDiagram`
3. **Class Diagram** - `classDiagram`
4. **State Diagram** - `stateDiagram-v2`
5. **Entity Relationship** - `erDiagram`
6. **Git Graph** - `gitGraph`
7. **Gantt Chart** - `gantt`
8. **Pie Chart** - `pie`
9. **User Journey** - `journey`

### Error Handling

If the diagram syntax is invalid, the component will display:

- An error icon and message
- A collapsible section showing the source code
- Helpful error details from Mermaid

### Responsive Behavior

The component automatically adjusts for different screen sizes:

- **Desktop** (>768px): Full padding and standard font size
- **Tablet** (480-768px): Reduced padding, smaller font
- **Mobile** (<480px): Minimal padding, smallest font

### Testing

Visit `/test-diagram` to see examples of all diagram types and error handling.

## CodeExample Component

See `CodeExample.tsx` for interactive code examples with syntax highlighting and execution.

## Quiz Component

See `Quiz.tsx` for interactive quiz components (to be implemented).

## KnowledgeGraph Component

The `KnowledgeGraph` component renders an interactive D3.js force-directed graph visualization showing relationships between learning topics, including prerequisites, related content, and learning path progression.

### Features

- ✅ Interactive D3.js force-directed graph layout
- ✅ Zoom and pan functionality
- ✅ Drag nodes to reposition
- ✅ Color-coded nodes by difficulty level
- ✅ Different edge types (prerequisite, related, learning path)
- ✅ Highlight learning path progression
- ✅ Show completed topics with checkmarks
- ✅ Click nodes to navigate
- ✅ Adjustable depth filtering
- ✅ Responsive design for all screen sizes
- ✅ Dark mode support

### Usage

```tsx
import { KnowledgeGraph } from '@/components/mdx/KnowledgeGraph';

// Basic usage
<KnowledgeGraph
  centerNodeId="js-closures"
  nodes={[
    {
      id: "js-closures",
      label: "Closures",
      category: "javascript",
      difficulty: "intermediate",
      completed: false
    },
    {
      id: "js-scope",
      label: "Scope & Hoisting",
      category: "javascript",
      difficulty: "intermediate",
      completed: true
    }
  ]}
  edges={[
    {
      from: "js-scope",
      to: "js-closures",
      type: "prerequisite"
    }
  ]}
/>

// With learning path highlighting
<KnowledgeGraph
  centerNodeId="js-closures"
  nodes={nodes}
  edges={edges}
  depth={2}
  locale="en"
  highlightPath={["js-basics", "js-functions", "js-scope", "js-closures"]}
  onNodeClick={(nodeId) => router.push(`/learn/${nodeId}`)}
/>
```

### Props

| Prop            | Type                       | Default  | Description                                     |
| --------------- | -------------------------- | -------- | ----------------------------------------------- |
| `centerNodeId`  | `string`                   | required | ID of the central node to focus on              |
| `nodes`         | `GraphNode[]`              | required | Array of graph nodes                            |
| `edges`         | `GraphEdge[]`              | required | Array of graph edges                            |
| `depth`         | `number`                   | `2`      | Maximum depth of relationships to display       |
| `locale`        | `'en' \| 'vi'`             | `'en'`   | Language for node labels                        |
| `highlightPath` | `string[]`                 | `[]`     | Array of node IDs to highlight as learning path |
| `onNodeClick`   | `(nodeId: string) => void` | optional | Callback when a node is clicked                 |
| `className`     | `string`                   | `''`     | Additional CSS classes                          |

### Data Types

```typescript
interface GraphNode {
  id: string;
  label: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  completed?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  type: "prerequisite" | "related" | "next-in-path";
}
```

### Edge Types

1. **Prerequisite** (red arrows): Shows required prior knowledge
2. **Related** (purple arrows): Shows related topics worth exploring
3. **Next-in-path** (green arrows): Shows sequential learning path progression

### Node Colors

- **Blue**: Center node (current topic)
- **Green**: Completed topics or highlighted learning path nodes
- **Beginner**: Light green
- **Intermediate**: Yellow
- **Advanced**: Orange
- **Expert**: Red

### Interactive Features

- **Zoom**: Scroll to zoom in/out (0.1x to 4x)
- **Pan**: Click and drag background to pan
- **Drag Nodes**: Click and drag individual nodes to reposition
- **Click Nodes**: Click nodes to trigger navigation callback

### Building Graph Data

Use the helper functions in `src/lib/content/graph-builder.ts`:

```typescript
import {
  buildGraphFromContent,
  buildGraphWithDepth,
} from "@/lib/content/graph-builder";

// Build graph from content relationships
const { nodes, edges } = buildGraphFromContent(
  "js-closures",
  contentIndex,
  learningPath
);

// Build graph with specific depth
const { nodes, edges } = buildGraphWithDepth(
  "js-closures",
  contentIndex,
  2 // depth
);
```

### Testing

Visit `/test-knowledge-graph` to see an interactive demo with sample JavaScript learning topics.

### Responsive Behavior

The component automatically adjusts for different screen sizes:

- **Desktop** (>768px): 600px height, full controls
- **Tablet** (480-768px): 400px height, stacked controls
- **Mobile** (<480px): 300px height, vertical legend
