import { ContentIndex, ContentMetadata, Locale } from "@/types/content";
import { GraphNode, GraphEdge } from "@/components/mdx/KnowledgeGraph";
import { LearningPath } from "@/types/learning-path";

/**
 * Build graph data structure from content relationships
 */
export function buildGraphFromContent(
  centerNodeId: string,
  contentIndex: ContentIndex,
  learningPath?: LearningPath
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  // Helper to add a node
  const addNode = (contentId: string, completed: boolean = false) => {
    if (nodeIds.has(contentId)) return;

    const contentData = contentIndex.contents[contentId];
    if (!contentData) return;

    const metadata = contentData.metadata;
    const locale = contentIndex.locale;

    nodes.push({
      id: contentId,
      label:
        typeof metadata.title === "string"
          ? metadata.title
          : metadata.title[locale] || metadata.title.en,
      category: metadata.category,
      difficulty: metadata.difficulty,
      completed,
    });

    nodeIds.add(contentId);
  };

  // Start with center node
  addNode(centerNodeId);

  // Add prerequisite relationships
  const centerContent = contentIndex.contents[centerNodeId];
  if (centerContent) {
    const prerequisites = centerContent.relationships.prerequisites;
    prerequisites.forEach((prereqId) => {
      addNode(prereqId);
      edges.push({
        from: prereqId,
        to: centerNodeId,
        type: "prerequisite",
      });
    });

    // Add dependent relationships (reverse prerequisites)
    const dependents = centerContent.relationships.dependents;
    dependents.forEach((depId) => {
      addNode(depId);
      edges.push({
        from: centerNodeId,
        to: depId,
        type: "prerequisite",
      });
    });

    // Add related topics
    const related = centerContent.relationships.related;
    related.forEach((relatedId) => {
      addNode(relatedId);
      edges.push({
        from: centerNodeId,
        to: relatedId,
        type: "related",
      });
    });
  }

  // Add learning path connections if provided
  if (learningPath) {
    const pathTopics = extractPathTopics(learningPath);
    const centerIndex = pathTopics.indexOf(centerNodeId);

    if (centerIndex !== -1) {
      // Add previous topic in path
      if (centerIndex > 0) {
        const prevId = pathTopics[centerIndex - 1];
        addNode(prevId);
        edges.push({
          from: prevId,
          to: centerNodeId,
          type: "next-in-path",
        });
      }

      // Add next topic in path
      if (centerIndex < pathTopics.length - 1) {
        const nextId = pathTopics[centerIndex + 1];
        addNode(nextId);
        edges.push({
          from: centerNodeId,
          to: nextId,
          type: "next-in-path",
        });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Build graph for an entire learning path
 */
export function buildGraphFromLearningPath(
  learningPath: LearningPath,
  contentIndex: ContentIndex,
  completedTopics: string[] = []
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  const locale = contentIndex.locale;

  // Helper to add a node
  const addNode = (contentId: string) => {
    if (nodeIds.has(contentId)) return;

    const contentData = contentIndex.contents[contentId];
    if (!contentData) return;

    const metadata = contentData.metadata;
    const completed = completedTopics.includes(contentId);

    nodes.push({
      id: contentId,
      label:
        typeof metadata.title === "string"
          ? metadata.title
          : metadata.title[locale] || metadata.title.en,
      category: metadata.category,
      difficulty: metadata.difficulty,
      completed,
    });

    nodeIds.add(contentId);
  };

  // Process all modules and topics
  const sortedModules = [...learningPath.modules].sort(
    (a, b) => a.order - b.order
  );

  let previousTopicId: string | null = null;

  sortedModules.forEach((module) => {
    const sortedTopics = [...module.topics].sort((a, b) => a.order - b.order);

    sortedTopics.forEach((topic) => {
      addNode(topic.contentId);

      // Add sequential path edges
      if (previousTopicId) {
        edges.push({
          from: previousTopicId,
          to: topic.contentId,
          type: "next-in-path",
        });
      }

      // Add prerequisite edges from content metadata
      const contentData = contentIndex.contents[topic.contentId];
      if (contentData) {
        contentData.relationships.prerequisites.forEach((prereqId) => {
          // Only add if prerequisite is in the learning path
          if (
            nodeIds.has(prereqId) ||
            addNodeIfInPath(
              prereqId,
              learningPath,
              contentIndex,
              completedTopics
            )
          ) {
            edges.push({
              from: prereqId,
              to: topic.contentId,
              type: "prerequisite",
            });
          }
        });
      }

      previousTopicId = topic.contentId;
    });
  });

  return { nodes, edges };

  function addNodeIfInPath(
    contentId: string,
    path: LearningPath,
    index: ContentIndex,
    completed: string[]
  ): boolean {
    if (nodeIds.has(contentId)) return true;

    // Check if content is in the learning path
    const isInPath = path.modules.some((module) =>
      module.topics.some((topic) => topic.contentId === contentId)
    );

    if (isInPath) {
      const contentData = index.contents[contentId];
      if (contentData) {
        const metadata = contentData.metadata;
        const isCompleted = completed.includes(contentId);

        nodes.push({
          id: contentId,
          label:
            typeof metadata.title === "string"
              ? metadata.title
              : metadata.title[locale] || metadata.title.en,
          category: metadata.category,
          difficulty: metadata.difficulty,
          completed: isCompleted,
        });

        nodeIds.add(contentId);
        return true;
      }
    }

    return false;
  }
}

/**
 * Extract all topic IDs from a learning path in order
 */
function extractPathTopics(learningPath: LearningPath): string[] {
  const topics: string[] = [];

  const sortedModules = [...learningPath.modules].sort(
    (a, b) => a.order - b.order
  );

  sortedModules.forEach((module) => {
    const sortedTopics = [...module.topics].sort((a, b) => a.order - b.order);
    sortedTopics.forEach((topic) => {
      topics.push(topic.contentId);
    });
  });

  return topics;
}

/**
 * Build graph with multiple depth levels from center node
 */
export function buildGraphWithDepth(
  centerNodeId: string,
  contentIndex: ContentIndex,
  maxDepth: number = 2
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();
  const visited = new Set<string>();

  const locale = contentIndex.locale;

  // Helper to add a node
  const addNode = (contentId: string, completed: boolean = false) => {
    if (nodeIds.has(contentId)) return;

    const contentData = contentIndex.contents[contentId];
    if (!contentData) return;

    const metadata = contentData.metadata;

    nodes.push({
      id: contentId,
      label:
        typeof metadata.title === "string"
          ? metadata.title
          : metadata.title[locale] || metadata.title.en,
      category: metadata.category,
      difficulty: metadata.difficulty,
      completed,
    });

    nodeIds.add(contentId);
  };

  // BFS to explore nodes up to maxDepth
  const queue: Array<{ id: string; depth: number }> = [
    { id: centerNodeId, depth: 0 },
  ];
  visited.add(centerNodeId);
  addNode(centerNodeId);

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;

    if (depth >= maxDepth) continue;

    const contentData = contentIndex.contents[id];
    if (!contentData) continue;

    const relationships = contentData.relationships;

    // Add prerequisites
    relationships.prerequisites.forEach((prereqId) => {
      addNode(prereqId);
      edges.push({
        from: prereqId,
        to: id,
        type: "prerequisite",
      });

      if (!visited.has(prereqId)) {
        visited.add(prereqId);
        queue.push({ id: prereqId, depth: depth + 1 });
      }
    });

    // Add dependents
    relationships.dependents.forEach((depId) => {
      addNode(depId);
      edges.push({
        from: id,
        to: depId,
        type: "prerequisite",
      });

      if (!visited.has(depId)) {
        visited.add(depId);
        queue.push({ id: depId, depth: depth + 1 });
      }
    });

    // Add related (only at depth 0 and 1 to avoid clutter)
    if (depth < 2) {
      relationships.related.forEach((relatedId) => {
        addNode(relatedId);
        edges.push({
          from: id,
          to: relatedId,
          type: "related",
        });

        if (!visited.has(relatedId)) {
          visited.add(relatedId);
          queue.push({ id: relatedId, depth: depth + 1 });
        }
      });
    }
  }

  return { nodes, edges };
}
