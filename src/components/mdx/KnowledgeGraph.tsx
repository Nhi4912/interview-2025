"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./KnowledgeGraph.module.css";

export interface GraphNode {
  id: string;
  label: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  completed?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: "prerequisite" | "related" | "next-in-path";
}

export interface KnowledgeGraphProps {
  centerNodeId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  depth?: number;
  locale?: "en" | "vi";
  highlightPath?: string[];
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
  difficulty: string;
  completed?: boolean;
  isCenter?: boolean;
  isHighlighted?: boolean;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  type: string;
}

export function KnowledgeGraph({
  centerNodeId,
  nodes,
  edges,
  depth = 2,
  locale = "en",
  highlightPath = [],
  onNodeClick,
  className = "",
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width || 800, height: height || 600 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Filter nodes and edges based on depth from center node
    const filteredData = filterByDepth(centerNodeId, nodes, edges, depth);
    const d3Nodes: D3Node[] = filteredData.nodes.map((node) => ({
      ...node,
      isCenter: node.id === centerNodeId,
      isHighlighted: highlightPath.includes(node.id),
    }));

    const d3Links: D3Link[] = filteredData.edges.map((edge) => ({
      source: edge.from,
      target: edge.to,
      type: edge.type,
    }));

    // Create arrow markers for different edge types
    const defs = svg.append("defs");

    const arrowTypes = [
      { id: "prerequisite", color: "#ef4444" },
      { id: "related", color: "#8b5cf6" },
      { id: "next-in-path", color: "#10b981" },
    ];

    arrowTypes.forEach(({ id, color }) => {
      defs
        .append("marker")
        .attr("id", `arrow-${id}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", color);
    });

    // Create force simulation
    const simulation = d3
      .forceSimulation<D3Node>(d3Nodes)
      .force(
        "link",
        d3
          .forceLink<D3Node, D3Link>(d3Links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create links
    const link = g
      .append("g")
      .selectAll("line")
      .data(d3Links)
      .join("line")
      .attr("class", styles.link)
      .attr("stroke", (d) => getEdgeColor(d.type))
      .attr("stroke-width", (d) => (d.type === "next-in-path" ? 3 : 2))
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`);

    // Create node groups
    const node = g
      .append("g")
      .selectAll<SVGGElement, D3Node>("g")
      .data(d3Nodes)
      .join("g")
      .attr("class", styles.node)
      .call(
        d3
          .drag<SVGGElement, D3Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.id);
        if (onNodeClick) {
          onNodeClick(d.id);
        }
      });

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d) => (d.isCenter ? 25 : d.isHighlighted ? 20 : 15))
      .attr("fill", (d) => getNodeColor(d))
      .attr("stroke", (d) => {
        if (d.isCenter) return "#1e40af";
        if (d.isHighlighted) return "#10b981";
        if (d.completed) return "#059669";
        return "#6b7280";
      })
      .attr("stroke-width", (d) => (d.isCenter || d.isHighlighted ? 3 : 2))
      .attr("class", styles.nodeCircle);

    // Add completion checkmark
    node
      .filter((d): d is D3Node & { completed: true } => d.completed === true)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text("✓");

    // Add labels
    node
      .append("text")
      .attr("dy", (d) => (d.isCenter ? 35 : 25))
      .attr("text-anchor", "middle")
      .attr("class", styles.nodeLabel)
      .text((d) => truncateLabel(d.label, 20))
      .attr("fill", "#1f2937")
      .attr("font-size", (d) => (d.isCenter ? "14px" : "12px"))
      .attr("font-weight", (d) => (d.isCenter ? "bold" : "normal"));

    // Add difficulty badge
    node
      .append("text")
      .attr("dy", (d) => (d.isCenter ? 48 : 38))
      .attr("text-anchor", "middle")
      .attr("class", styles.difficultyBadge)
      .text((d) => getDifficultyLabel(d.difficulty))
      .attr("fill", "#6b7280")
      .attr("font-size", "10px");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as D3Node).x || 0)
        .attr("y1", (d) => (d.source as D3Node).y || 0)
        .attr("x2", (d) => (d.target as D3Node).x || 0)
        .attr("y2", (d) => (d.target as D3Node).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [
    centerNodeId,
    nodes,
    edges,
    depth,
    highlightPath,
    dimensions,
    onNodeClick,
  ]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.controls}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: "#ef4444" }}
            />
            <span>Prerequisite</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: "#8b5cf6" }}
            />
            <span>Related</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: "#10b981" }}
            />
            <span>Learning Path</span>
          </div>
        </div>
        <div className={styles.info}>
          <span>Drag to pan • Scroll to zoom • Click nodes to navigate</span>
        </div>
      </div>
      <div ref={containerRef} className={styles.graphContainer}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className={styles.svg}
        />
      </div>
      {selectedNode && (
        <div className={styles.selectedInfo}>
          <strong>Selected:</strong>{" "}
          {nodes.find((n) => n.id === selectedNode)?.label}
        </div>
      )}
    </div>
  );
}

// Helper functions
function filterByDepth(
  centerNodeId: string,
  nodes: GraphNode[],
  edges: GraphEdge[],
  maxDepth: number
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const visited = new Set<string>();
  const nodeDepths = new Map<string, number>();
  const queue: Array<{ id: string; depth: number }> = [
    { id: centerNodeId, depth: 0 },
  ];

  visited.add(centerNodeId);
  nodeDepths.set(centerNodeId, 0);

  // BFS to find nodes within depth
  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;

    if (depth >= maxDepth) continue;

    // Find connected nodes
    edges.forEach((edge) => {
      let nextId: string | null = null;

      if (edge.from === id && !visited.has(edge.to)) {
        nextId = edge.to;
      } else if (edge.to === id && !visited.has(edge.from)) {
        nextId = edge.from;
      }

      if (nextId) {
        visited.add(nextId);
        nodeDepths.set(nextId, depth + 1);
        queue.push({ id: nextId, depth: depth + 1 });
      }
    });
  }

  // Filter nodes and edges
  const filteredNodes = nodes.filter((node) => visited.has(node.id));
  const filteredEdges = edges.filter(
    (edge) => visited.has(edge.from) && visited.has(edge.to)
  );

  return { nodes: filteredNodes, edges: filteredEdges };
}

function getNodeColor(node: D3Node): string {
  if (node.isCenter) return "#3b82f6";
  if (node.isHighlighted) return "#10b981";
  if (node.completed) return "#059669";

  // Color by difficulty
  const difficultyColors: Record<string, string> = {
    beginner: "#22c55e",
    intermediate: "#eab308",
    advanced: "#f97316",
    expert: "#ef4444",
  };

  return difficultyColors[node.difficulty] || "#6b7280";
}

function getEdgeColor(type: string): string {
  const edgeColors: Record<string, string> = {
    prerequisite: "#ef4444",
    related: "#8b5cf6",
    "next-in-path": "#10b981",
  };

  return edgeColors[type] || "#6b7280";
}

function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 3) + "...";
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
  };

  return labels[difficulty] || difficulty;
}
