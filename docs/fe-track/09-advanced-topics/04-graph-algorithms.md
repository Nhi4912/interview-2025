# Graph Algorithms / Thuật Toán Đồ Thị
## Computer Science - Chapter 5 / Khoa Học Máy Tính - Chương 5

[Back to Table of Contents](../../00-table-of-contents.md)

---

## Tổng Quan / Overview
- **English:** Graph algorithms model relationships between entities and edges.
- **Tiếng Việt:** Thuật toán đồ thị giúp mô hình hóa mối quan hệ giữa các thực thể (đỉnh) và liên kết (cạnh).
- **English:** In frontend interviews, graph thinking appears in dependency resolution, routing, build systems, and layout engines.
- **Tiếng Việt:** Trong phỏng vấn frontend, tư duy đồ thị xuất hiện ở giải quyết dependency, định tuyến, build graph, và engine layout.

## Tài Liệu Liên Quan / Related References
- [Algorithms Theory](../../shared/01-cs-fundamentals/algorithms-theory.md)
- [Data Structures Theory](../../shared/01-cs-fundamentals/data-structures-theory.md)

---
## 1) Graph Representations: Adjacency List vs Matrix / Biểu Diễn Đồ Thị

### 🟢 [Junior] Tổng Quan
- **English:** Graph representation choices impact memory and traversal speed.
- **Tiếng Việt:** Cách biểu diễn đồ thị ảnh hưởng trực tiếp đến bộ nhớ và hiệu năng duyệt.

### Explanation / Giải thích
- Adjacency list phù hợp đồ thị thưa (sparse), phổ biến trong ứng dụng web có quan hệ linh hoạt.
- Adjacency matrix phù hợp đồ thị dày (dense), kiểm tra tồn tại cạnh O(1).
- Với đồ thị có trọng số, lưu object `{to, weight}` trong list để giữ dữ liệu rõ ràng.

### Example / Ví dụ
```ts
type NodeId = string;

type WeightedEdge = { to: NodeId; weight: number };

class GraphList {
  private adj = new Map<NodeId, WeightedEdge[]>();

  addNode(id: NodeId): void {
    if (!this.adj.has(id)) this.adj.set(id, []);
  }

  addEdge(from: NodeId, to: NodeId, weight = 1, undirected = false): void {
    this.addNode(from);
    this.addNode(to);
    this.adj.get(from)!.push({ to, weight });
    if (undirected) this.adj.get(to)!.push({ to: from, weight });
  }

  neighbors(id: NodeId): WeightedEdge[] {
    return this.adj.get(id) ?? [];
  }
}

class GraphMatrix {
  private idx = new Map<NodeId, number>();
  private nodes: NodeId[] = [];
  private matrix: number[][] = [];

  addNode(id: NodeId): void {
    if (this.idx.has(id)) return;
    const i = this.nodes.length;
    this.idx.set(id, i);
    this.nodes.push(id);
    for (const row of this.matrix) row.push(0);
    this.matrix.push(Array(this.nodes.length).fill(0));
  }

  addEdge(from: NodeId, to: NodeId, weight = 1): void {
    this.addNode(from);
    this.addNode(to);
    this.matrix[this.idx.get(from)!][this.idx.get(to)!] = weight;
  }

  hasEdge(from: NodeId, to: NodeId): boolean {
    if (!this.idx.has(from) || !this.idx.has(to)) return false;
    return this.matrix[this.idx.get(from)!][this.idx.get(to)!] !== 0;
  }
}
```

### Complexity Analysis
- Time tạo node/edge (list): O(1) amortized
- Time kiểm tra cạnh (matrix): O(1)
- Space adjacency list: O(V + E)
- Space adjacency matrix: O(V^2)

### Frontend Use Case
- Build tool dependency graph trong monorepo thường sparse => adjacency list tối ưu hơn.
- Mô phỏng route transition matrix cho analytics có thể dùng matrix để query nhanh.

## 2) BFS - Breadth-First Search / Duyệt Theo Chiều Rộng

### 🟢 [Junior] Tổng Quan
- **English:** BFS visits nodes layer by layer using a queue.
- **Tiếng Việt:** BFS duyệt theo từng lớp bằng hàng đợi (queue).

### Explanation / Giải thích
- BFS cho shortest path trên đồ thị không trọng số.
- Luôn đánh dấu visited ngay khi enqueue để tránh enqueue trùng lặp.
- Có thể mở rộng để trả về parent map và reconstruct đường đi.

### Example / Ví dụ
```ts
function bfsShortestPath(
  graph: Map<string, string[]>,
  start: string,
  target: string
): string[] {
  if (start === target) return [start];

  const queue: string[] = [start];
  const visited = new Set([start]);
  const parent = new Map<string, string | null>([[start, null]]);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const nxt of graph.get(cur) ?? []) {
      if (visited.has(nxt)) continue;
      visited.add(nxt);
      parent.set(nxt, cur);
      if (nxt === target) {
        const path: string[] = [];
        let p: string | null = nxt;
        while (p) {
          path.push(p);
          p = parent.get(p) ?? null;
        }
        return path.reverse();
      }
      queue.push(nxt);
    }
  }

  return [];
}
```

### Complexity Analysis
- Time: O(V + E)
- Space: O(V) cho queue + visited + parent

### Frontend Use Case
- Gợi ý đường đi ngắn nhất giữa các trang trong knowledge graph của docs.
- Xác định số bước phụ thuộc tối thiểu để build một module frontend.

## 3) DFS - Depth-First Search / Duyệt Theo Chiều Sâu

### 🟢 [Junior] Tổng Quan
- **English:** DFS explores as deep as possible before backtracking.
- **Tiếng Việt:** DFS đi sâu nhất có thể trước khi quay lui (backtrack).

### Explanation / Giải thích
- DFS hữu ích cho cycle detection, topological sort, connected components.
- Có 2 cách viết: recursion hoặc iterative stack.
- Recursion dễ đọc nhưng cần chú ý call stack nếu đồ thị sâu.

### Example / Ví dụ
```ts
function dfsIterative(graph: Map<string, string[]>, start: string): string[] {
  const stack = [start];
  const visited = new Set<string>();
  const order: string[] = [];

  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    order.push(cur);

    const neighbors = graph.get(cur) ?? [];
    for (let i = neighbors.length - 1; i >= 0; i -= 1) {
      const nxt = neighbors[i];
      if (!visited.has(nxt)) stack.push(nxt);
    }
  }

  return order;
}
```

### Complexity Analysis
- Time: O(V + E)
- Space: O(V) cho visited + stack (hoặc recursion stack)

### Frontend Use Case
- Duyệt dependency tree để tìm module ảnh hưởng khi một file thay đổi.
- Phân tích luồng route nested trong ứng dụng SPA.

## 4) Topological Sort / Sắp Xếp Tô-pô

### 🟡 [Mid] Tổng Quan
- **English:** Topological sort orders nodes in a DAG so every edge u→v keeps u before v.
- **Tiếng Việt:** Sắp xếp tô-pô cho DAG sao cho mọi cạnh u→v đều đặt u trước v.

### Explanation / Giải thích
- Dùng khi có dependency: build order, task scheduling, module init order.
- Kahn (BFS indegree) phát hiện chu kỳ nếu không lấy đủ V node.
- DFS post-order cũng tạo topo order nhưng khó debug cycle hơn cho người mới.

### Example / Ví dụ
```ts
function topologicalSortKahn(graph: Map<string, string[]>): string[] {
  const indegree = new Map<string, number>();

  for (const node of graph.keys()) indegree.set(node, 0);
  for (const [u, arr] of graph) {
    if (!indegree.has(u)) indegree.set(u, 0);
    for (const v of arr) indegree.set(v, (indegree.get(v) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [node, deg] of indegree) if (deg === 0) queue.push(node);

  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of graph.get(u) ?? []) {
      indegree.set(v, indegree.get(v)! - 1);
      if (indegree.get(v) === 0) queue.push(v);
    }
  }

  if (order.length !== indegree.size) {
    throw new Error('Cycle detected: graph is not a DAG');
  }

  return order;
}
```

### Complexity Analysis
- Time: O(V + E)
- Space: O(V)

### Frontend Use Case
- Tính thứ tự load script/plugin không vi phạm phụ thuộc.
- Sắp thứ tự chạy codemod pipeline trong tooling frontend.

## 5) Shortest Path I - Dijkstra / Đường Đi Ngắn Nhất Với Trọng Số Dương

### 🟡 [Mid] Tổng Quan
- **English:** Dijkstra solves single-source shortest path with non-negative weights.
- **Tiếng Việt:** Dijkstra giải bài toán đường đi ngắn nhất từ 1 nguồn khi trọng số không âm.

### Explanation / Giải thích
- Priority queue giúp luôn mở rộng node có khoảng cách tạm thời nhỏ nhất.
- Không dùng Dijkstra cho cạnh âm vì greedy assumption bị phá vỡ.
- Trong frontend route planner, trọng số có thể là latency estimate hoặc transition cost.

### Example / Ví dụ
```ts
type Edge = { to: string; w: number };

function dijkstra(graph: Map<string, Edge[]>, source: string): Map<string, number> {
  const dist = new Map<string, number>();
  const visited = new Set<string>();
  const pq: Array<[number, string]> = [[0, source]];

  for (const k of graph.keys()) dist.set(k, Number.POSITIVE_INFINITY);
  dist.set(source, 0);

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (visited.has(u)) continue;
    visited.add(u);

    for (const { to: v, w } of graph.get(u) ?? []) {
      const nd = d + w;
      if (nd < (dist.get(v) ?? Number.POSITIVE_INFINITY)) {
        dist.set(v, nd);
        pq.push([nd, v]);
      }
    }
  }

  return dist;
}
```

### Complexity Analysis
- Time: O((V + E) log V) với binary heap; ví dụ trên dùng sort đơn giản gần O(E·V log V).
- Space: O(V)

### Frontend Use Case
- Tìm chain API call có tổng latency nhỏ nhất trong visual debugger.
- Ước lượng path chuyển trang với trọng số UX cost.

## 6) Shortest Path II - Bellman-Ford / Hỗ Trợ Cạnh Âm

### 🔴 [Senior] Tổng Quan
- **English:** Bellman-Ford handles negative edges and detects negative cycles.
- **Tiếng Việt:** Bellman-Ford xử lý cạnh âm và phát hiện chu trình âm.

### Explanation / Giải thích
- Lặp relax cạnh V-1 lần vì shortest path đơn giản có tối đa V-1 cạnh.
- Vòng lặp thứ V nếu còn relax được => tồn tại negative cycle reachable từ source.
- Độ phức tạp cao hơn Dijkstra nên chỉ dùng khi thực sự cần cạnh âm.

### Example / Ví dụ
```ts
type WEdge = { from: string; to: string; w: number };

function bellmanFord(nodes: string[], edges: WEdge[], src: string) {
  const dist = new Map<string, number>();
  for (const n of nodes) dist.set(n, Number.POSITIVE_INFINITY);
  dist.set(src, 0);

  for (let i = 1; i < nodes.length; i += 1) {
    let changed = false;
    for (const { from, to, w } of edges) {
      const d = dist.get(from)!;
      if (d !== Number.POSITIVE_INFINITY && d + w < dist.get(to)!) {
        dist.set(to, d + w);
        changed = true;
      }
    }
    if (!changed) break;
  }

  for (const { from, to, w } of edges) {
    const d = dist.get(from)!;
    if (d !== Number.POSITIVE_INFINITY && d + w < dist.get(to)!) {
      return { dist, hasNegativeCycle: true };
    }
  }

  return { dist, hasNegativeCycle: false };
}
```

### Complexity Analysis
- Time: O(V·E)
- Space: O(V)

### Frontend Use Case
- Phân tích scoring graph khi có edge bonus/penalty (có thể âm).
- Validating data pipeline weights trong BI dashboard graph.

## 7) Minimum Spanning Tree I - Prim / Cây Khung Nhỏ Nhất Dạng Grow

### 🟡 [Mid] Tổng Quan
- **English:** Prim grows MST from a start node by always adding minimum crossing edge.
- **Tiếng Việt:** Prim mở rộng MST từ 1 đỉnh khởi đầu bằng cách chọn cạnh nhẹ nhất cắt qua biên.

### Explanation / Giải thích
- Hiệu quả trên đồ thị dense khi dùng adjacency matrix + O(V^2).
- Với heap + adjacency list có thể đạt O(E log V).
- MST chỉ áp dụng cho đồ thị vô hướng, liên thông, trọng số.

### Example / Ví dụ
```ts
type PrimEdge = { to: string; w: number };

function primMST(graph: Map<string, PrimEdge[]>, start: string) {
  const visited = new Set<string>();
  const pq: Array<[number, string, string]> = []; // [w, from, to]
  const mst: Array<[string, string, number]> = [];
  let total = 0;

  visited.add(start);
  for (const e of graph.get(start) ?? []) pq.push([e.w, start, e.to]);

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [w, from, to] = pq.shift()!;
    if (visited.has(to)) continue;
    visited.add(to);
    mst.push([from, to, w]);
    total += w;

    for (const e of graph.get(to) ?? []) {
      if (!visited.has(e.to)) pq.push([e.w, to, e.to]);
    }
  }

  return { mst, total };
}
```

### Complexity Analysis
- Time: O(E log E) với pq array-sort; với binary heap: O(E log V)
- Space: O(V + E)

### Frontend Use Case
- Tối ưu kết nối visual nodes trong editor sao cho tổng “chi phí dây nối” thấp.
- Dùng trong auto-layout simplification để giữ backbone tối thiểu.

## 8) Minimum Spanning Tree II - Kruskal / Cây Khung Nhỏ Nhất Dạng Sort Edge

### 🟡 [Mid] Tổng Quan
- **English:** Kruskal sorts edges by weight and adds them if they do not form cycles.
- **Tiếng Việt:** Kruskal sắp cạnh theo trọng số tăng dần, thêm cạnh nếu không tạo chu kỳ.

### Explanation / Giải thích
- Disjoint Set Union (Union-Find) là cấu trúc lõi để kiểm tra chu kỳ hiệu quả.
- Ưu điểm: dễ implement, phù hợp khi input ở dạng edge list.
- Nhược điểm: cần sort toàn bộ cạnh trước.

### Example / Ví dụ
```ts
class DSU {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  union(a: number, b: number): boolean {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra] += 1;
    return true;
  }
}

function kruskalMST(n: number, edges: Array<[number, number, number]>) {
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const dsu = new DSU(n);
  const mst: Array<[number, number, number]> = [];

  for (const [u, v, w] of sorted) {
    if (dsu.union(u, v)) mst.push([u, v, w]);
    if (mst.length === n - 1) break;
  }

  return mst;
}
```

### Complexity Analysis
- Time: O(E log E) dominated by sorting
- Space: O(V)

### Frontend Use Case
- Chọn tập kết nối tối ưu cho graph-based UI (mind map, workflow builder).
- Giảm số liên kết khi generate “minimum dependency skeleton”.

## 9) Cycle Detection / Phát Hiện Chu Kỳ

### 🟡 [Mid] Tổng Quan
- **English:** Cycle detection strategy depends on graph type: directed vs undirected.
- **Tiếng Việt:** Chiến lược phát hiện chu kỳ phụ thuộc loại đồ thị: có hướng hay vô hướng.

### Explanation / Giải thích
- Đồ thị có hướng: dùng trạng thái 3 màu hoặc recursion stack.
- Đồ thị vô hướng: DFS với parent hoặc DSU.
- Trong dependency graph, cycle detection là bắt buộc để chặn build loop.

### Example / Ví dụ
```ts
function hasCycleDirected(graph: Map<string, string[]>): boolean {
  const color = new Map<string, 0 | 1 | 2>(); // 0=white,1=gray,2=black

  const visit = (u: string): boolean => {
    color.set(u, 1);
    for (const v of graph.get(u) ?? []) {
      const c = color.get(v) ?? 0;
      if (c === 1) return true;
      if (c === 0 && visit(v)) return true;
    }
    color.set(u, 2);
    return false;
  };

  for (const u of graph.keys()) {
    if ((color.get(u) ?? 0) === 0 && visit(u)) return true;
  }

  return false;
}
```

### Complexity Analysis
- Time: O(V + E)
- Space: O(V)

### Frontend Use Case
- Phát hiện vòng lặp import module trong bundler plugin.
- Kiểm tra rule dependency giữa feature packages.

## 10) Connected Components / Thành Phần Liên Thông

### 🟢 [Junior] Tổng Quan
- **English:** Connected components partition an undirected graph into independent groups.
- **Tiếng Việt:** Thành phần liên thông chia đồ thị vô hướng thành các nhóm độc lập.

### Explanation / Giải thích
- Mỗi lần BFS/DFS từ node chưa visited sẽ tạo ra một component mới.
- Có thể dùng để nhóm cluster user flow hoặc module graph.
- Kết quả thường dùng cho visualization và incremental processing.

### Example / Ví dụ
```ts
function connectedComponents(graph: Map<string, string[]>): string[][] {
  const seen = new Set<string>();
  const comps: string[][] = [];

  for (const start of graph.keys()) {
    if (seen.has(start)) continue;
    const queue = [start];
    const comp: string[] = [];
    seen.add(start);

    while (queue.length) {
      const u = queue.shift()!;
      comp.push(u);
      for (const v of graph.get(u) ?? []) {
        if (seen.has(v)) continue;
        seen.add(v);
        queue.push(v);
      }
    }

    comps.push(comp);
  }

  return comps;
}
```

### Complexity Analysis
- Time: O(V + E)
- Space: O(V)

### Frontend Use Case
- Nhóm widgets có phụ thuộc nội bộ để optimize lazy loading theo cụm.
- Xác định vùng route tách biệt trong ứng dụng enterprise lớn.

## 11) Strongly Connected Components (SCC) / Thành Phần Liên Thông Mạnh

### 🔴 [Senior] Tổng Quan
- **English:** SCC exists in directed graphs where every pair is mutually reachable.
- **Tiếng Việt:** SCC trong đồ thị có hướng là nhóm đỉnh mà mọi cặp đều đi tới nhau được.

### Explanation / Giải thích
- Kosaraju: 2 lần DFS (original + transpose) theo thứ tự finish time.
- Tarjan: 1 DFS với low-link values, thường được đánh giá cao trong interview senior.
- SCC giúp gom cụm circular dependency và đề xuất refactor boundary.

### Example / Ví dụ
```ts
function kosarajuSCC(graph: Map<string, string[]>): string[][] {
  const seen = new Set<string>();
  const order: string[] = [];

  const dfs1 = (u: string) => {
    seen.add(u);
    for (const v of graph.get(u) ?? []) if (!seen.has(v)) dfs1(v);
    order.push(u);
  };

  for (const u of graph.keys()) if (!seen.has(u)) dfs1(u);

  const rev = new Map<string, string[]>();
  for (const u of graph.keys()) rev.set(u, []);
  for (const [u, arr] of graph) for (const v of arr) (rev.get(v) ?? rev.set(v, []).get(v)!).push(u);

  seen.clear();
  const result: string[][] = [];

  const dfs2 = (u: string, comp: string[]) => {
    seen.add(u);
    comp.push(u);
    for (const v of rev.get(u) ?? []) if (!seen.has(v)) dfs2(v, comp);
  };

  while (order.length) {
    const u = order.pop()!;
    if (seen.has(u)) continue;
    const comp: string[] = [];
    dfs2(u, comp);
    result.push(comp);
  }

  return result;
}
```

### Complexity Analysis
- Time: O(V + E)
- Space: O(V + E) do cần reverse graph

### Frontend Use Case
- Phát hiện cụm module import lẫn nhau để tách package boundary.
- Phân tích vòng lặp state update trong workflow engine phía frontend.

## 12) Graph Coloring / Tô Màu Đồ Thị

### 🔴 [Senior] Tổng Quan
- **English:** Graph coloring assigns colors to vertices so adjacent vertices differ.
- **Tiếng Việt:** Tô màu đồ thị gán màu cho đỉnh sao cho đỉnh kề nhau không trùng màu.

### Explanation / Giải thích
- Bài toán tổng quát NP-hard; interview thường hỏi greedy heuristic.
- Greedy coloring không luôn tối ưu nhưng nhanh và practical.
- Ứng dụng: conflict scheduling, map rendering layers, CSS token partition.

### Example / Ví dụ
```ts
function greedyColoring(graph: Map<string, string[]>): Map<string, number> {
  const color = new Map<string, number>();

  for (const u of graph.keys()) {
    const used = new Set<number>();
    for (const v of graph.get(u) ?? []) {
      if (color.has(v)) used.add(color.get(v)!);
    }

    let c = 0;
    while (used.has(c)) c += 1;
    color.set(u, c);
  }

  return color;
}
```

### Complexity Analysis
- Time: O(V + E) với adjacency list nếu quản lý used tốt
- Space: O(V)

### Frontend Use Case
- Phân lớp tasks để chạy song song mà không conflict resource UI.
- Gán color channel cho overlapping annotations trong editor.

## 13) Bipartite Check / Kiểm Tra Đồ Thị Hai Phía

### 🟡 [Mid] Tổng Quan
- **English:** A graph is bipartite if vertices can be colored with 2 colors.
- **Tiếng Việt:** Đồ thị bipartite là đồ thị tô được bằng đúng 2 màu.

### Explanation / Giải thích
- BFS coloring là cách phổ biến và dễ chứng minh.
- Đồ thị có chu kỳ lẻ thì không bipartite.
- Use case: matching problems (user-task, feature-owner).

### Example / Ví dụ
```ts
function isBipartite(graph: Map<string, string[]>): boolean {
  const color = new Map<string, 0 | 1>();

  for (const start of graph.keys()) {
    if (color.has(start)) continue;
    const q = [start];
    color.set(start, 0);

    while (q.length) {
      const u = q.shift()!;
      for (const v of graph.get(u) ?? []) {
        if (!color.has(v)) {
          color.set(v, (1 - color.get(u)!) as 0 | 1);
          q.push(v);
        } else if (color.get(v) === color.get(u)) {
          return false;
        }
      }
    }
  }

  return true;
}
```

### Complexity Analysis
- Time: O(V + E)
- Space: O(V)

### Frontend Use Case
- Kiểm tra model phân quyền 2 phía (role-resource) có vi phạm odd cycle logic.
- Phân tách dependencies thành producer/consumer sets.

## 14) A* Search Basics / Cơ Bản Về A*

### 🔴 [Senior] Tổng Quan
- **English:** A* combines path cost g(n) and heuristic h(n) to guide search.
- **Tiếng Việt:** A* kết hợp chi phí đã đi g(n) và heuristic h(n) để dẫn hướng tìm kiếm.

### Explanation / Giải thích
- Khi h(n) admissible (không overestimate), A* tìm đường tối ưu.
- Khi h(n)=0 thì A* trở thành Dijkstra.
- Trong frontend map/game UI, heuristic thường là Manhattan hoặc Euclidean distance.

### Example / Ví dụ
```ts
type GridNode = { x: number; y: number };

function aStarGrid(
  rows: number,
  cols: number,
  blocked: Set<string>,
  start: GridNode,
  goal: GridNode
): GridNode[] {
  const key = (n: GridNode) => `${n.x},${n.y}`;
  const h = (a: GridNode, b: GridNode) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  const open: Array<[number, number, GridNode]> = [[h(start, goal), 0, start]]; // [f, g, node]
  const gScore = new Map<string, number>([[key(start), 0]]);
  const parent = new Map<string, string | null>([[key(start), null]]);

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while (open.length) {
    open.sort((a,b) => a[0]-b[0]);
    const [, gCur, cur] = open.shift()!;
    if (cur.x === goal.x && cur.y === goal.y) {
      const path: GridNode[] = [];
      let p: string | null = key(goal);
      while (p) {
        const [x, y] = p.split(',').map(Number);
        path.push({ x, y });
        p = parent.get(p) ?? null;
      }
      return path.reverse();
    }

    for (const [dx, dy] of dirs) {
      const nxt = { x: cur.x + dx, y: cur.y + dy };
      if (nxt.x < 0 || nxt.y < 0 || nxt.x >= rows || nxt.y >= cols) continue;
      if (blocked.has(key(nxt))) continue;

      const nk = key(nxt);
      const ng = gCur + 1;
      if (ng < (gScore.get(nk) ?? Number.POSITIVE_INFINITY)) {
        gScore.set(nk, ng);
        parent.set(nk, key(cur));
        open.push([ng + h(nxt, goal), ng, nxt]);
      }
    }
  }

  return [];
}
```

### Complexity Analysis
- Time: phụ thuộc heuristic; tệ nhất gần Dijkstra
- Space: O(V) cho open set + parent + gScore

### Frontend Use Case
- Tìm đường highlight focus trong grid-based UI editor.
- Tối ưu route animation cho onboarding tour qua nhiều step nodes.

## Interview Patterns / Mẫu Tư Duy Khi Trả Lời
### Overview / Tổng Quan
- **English:** Interviewers expect clear trade-off reasoning, not just code memorization.
- **Tiếng Việt:** Nhà tuyển dụng muốn thấy khả năng phân tích trade-off, không chỉ thuộc code mẫu.

### Explanation / Giải thích
- Luôn xác định đồ thị có hướng/vô hướng, có trọng số/không trọng số trước khi chọn thuật toán.
- Nêu rõ complexity Big-O cho time và space.
- Giải thích edge case: disconnected graph, negative weights, self-loop, duplicate edges.
- Nếu giải pháp dùng recursion, nói thêm rủi ro stack overflow và cách iterative thay thế.

### Example / Ví dụ
```ts
// Interview template: choose algorithm by constraints
function chooseAlgorithm(hasWeight: boolean, hasNegative: boolean, needOrder: boolean) {
  if (needOrder) return "Topological Sort (DAG only)";
  if (!hasWeight) return "BFS";
  if (hasNegative) return "Bellman-Ford";
  return "Dijkstra";
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A
### 🟢 [Junior] Khi nào dùng adjacency list thay vì adjacency matrix?
- **Giải thích:** Adjacency list phù hợp đồ thị thưa vì tiết kiệm bộ nhớ O(V+E).
- **Giải thích (bổ sung):** Adjacency matrix hữu ích khi cần truy vấn hasEdge liên tục O(1).
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟢 [Junior] BFS khác DFS ở điểm cốt lõi nào?
- **Giải thích:** BFS đi theo lớp bằng queue; DFS đi sâu bằng stack/recursion.
- **Giải thích (bổ sung):** BFS cho shortest path unweighted; DFS mạnh ở phân tích cấu trúc như cycle/SCC.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟢 [Junior] Vì sao BFS cho shortest path trong đồ thị không trọng số?
- **Giải thích:** Vì node được thăm theo số cạnh tăng dần từ source.
- **Giải thích (bổ sung):** Lần đầu gặp target là số bước ít nhất.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Làm sao phát hiện cycle trong đồ thị có hướng?
- **Giải thích:** Dùng DFS 3 màu hoặc recursion stack.
- **Giải thích (bổ sung):** Gặp cạnh tới node đang “gray” => back edge => có cycle.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Topological sort thất bại trong trường hợp nào?
- **Giải thích:** Khi đồ thị có chu kỳ.
- **Giải thích (bổ sung):** Kahn algorithm trả về ít hơn V đỉnh => không phải DAG.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Dijkstra có dùng được với cạnh âm không?
- **Giải thích:** Không an toàn vì greedy choice không còn đúng.
- **Giải thích (bổ sung):** Chọn Bellman-Ford nếu có cạnh âm.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🔴 [Senior] Bellman-Ford phát hiện negative cycle bằng cách nào?
- **Giải thích:** Sau V-1 lần relax, chạy thêm 1 vòng.
- **Giải thích (bổ sung):** Nếu còn cập nhật được khoảng cách thì có chu trình âm reachable.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Prim và Kruskal khác nhau thế nào?
- **Giải thích:** Prim “grow” từ node, Kruskal “pick edge” toàn cục.
- **Giải thích (bổ sung):** Kruskal dùng DSU; Prim thường dùng priority queue.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟢 [Junior] Connected components áp dụng thực tế frontend ra sao?
- **Giải thích:** Dùng để nhóm modules/components không liên thông.
- **Giải thích (bổ sung):** Giúp lazy-load hoặc visualize cluster tốt hơn.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🔴 [Senior] SCC hữu ích gì trong dependency analysis?
- **Giải thích:** Cho biết cụm module import lẫn nhau.
- **Giải thích (bổ sung):** Dựa vào SCC để đề xuất tách boundary hoặc inversion dependency.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Bipartite check có insight gì về chu kỳ?
- **Giải thích:** Bipartite <=> không có odd cycle (đồ thị vô hướng).
- **Giải thích (bổ sung):** Nếu BFS coloring bị xung đột màu => tồn tại odd cycle.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🔴 [Senior] A* khác Dijkstra ở điểm nào?
- **Giải thích:** A* thêm heuristic h(n) để ưu tiên hướng đến đích.
- **Giải thích (bổ sung):** Heuristic admissible giúp vẫn tối ưu nhưng nhanh hơn trung bình.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Làm sao reconstruct path sau BFS/Dijkstra?
- **Giải thích:** Lưu parent map: parent[child] = node trước đó.
- **Giải thích (bổ sung):** Từ target lần ngược về source rồi reverse.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Vì sao DSU hiệu quả cho cycle detection?
- **Giải thích:** Find/Union với path compression và union by rank gần O(α(n)).
- **Giải thích (bổ sung):** Rất nhanh cho processing edge stream.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🔴 [Senior] Khi nào complexity O(V^2) vẫn chấp nhận?
- **Giải thích:** Khi V nhỏ hoặc đồ thị rất dense.
- **Giải thích (bổ sung):** Ví dụ matrix-based algorithm trong bài toán domain nhỏ cố định.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟢 [Junior] Edge case quan trọng của BFS?
- **Giải thích:** Node start không tồn tại; graph rỗng; disconnected target.
- **Giải thích (bổ sung):** Cần trả [] hoặc throw rõ ràng theo contract.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟢 [Junior] DFS recursion có rủi ro gì?
- **Giải thích:** Stack overflow khi đồ thị sâu.
- **Giải thích (bổ sung):** Có thể chuyển sang iterative stack để an toàn.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Làm sao tối ưu Dijkstra trong JS?
- **Giải thích:** Dùng binary heap thay vì sort mảng mỗi vòng.
- **Giải thích (bổ sung):** Giảm từ O(E·V log V) mô phỏng xuống O((V+E) log V).
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🔴 [Senior] Topological sort dùng trong frontend build thế nào?
- **Giải thích:** Sắp thứ tự compile/transpile packages theo dependency DAG.
- **Giải thích (bổ sung):** Nếu cycle thì fail early với message gợi ý refactor.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

### 🟡 [Mid] Tại sao graph algorithms xuất hiện trong routing?
- **Giải thích:** Route transitions có thể mô hình bằng state graph.
- **Giải thích (bổ sung):** Tìm path/cost tốt nhất cho prefetch hoặc animation flow.
- **Ví dụ:** Hãy tự mô phỏng 1 graph nhỏ 5 đỉnh để trình bày trực quan trong buổi phỏng vấn.

---

## Checklist Ôn Tập Nhanh / Quick Review Checklist
- [ ] 1. Phân biệt được adjacency list vs matrix và trade-off bộ nhớ.
- [ ] 2. Code BFS/DFS không lỗi visited và xử lý graph disconnected.
- [ ] 3. Giải thích được điều kiện áp dụng Dijkstra vs Bellman-Ford.
- [ ] 4. Implement được Kahn topological sort + phát hiện cycle.
- [ ] 5. Nắm Prim/Kruskal và biết khi nào dùng DSU.
- [ ] 6. Hiểu SCC ở mức refactor dependency thực tế.
- [ ] 7. Biết bipartite check bằng BFS coloring.
- [ ] 8. Giải thích A* bằng g(n)+h(n) và admissible heuristic.
- [ ] 9. Nêu được ít nhất 3 use cases frontend thực chiến.

[Back to Table of Contents](../../00-table-of-contents.md)
