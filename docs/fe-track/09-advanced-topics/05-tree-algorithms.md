# Tree Algorithms / Thuật Toán Cây

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Computer Science - Chapter 6 / Khoa Học Máy Tính - Chương 6

[Back to Table of Contents](../../00-table-of-contents.md)

---

## Tổng Quan / Overview
- **English:** Trees are hierarchical structures used everywhere in frontend systems.
- **Tiếng Việt:** Cây là cấu trúc phân cấp xuất hiện khắp nơi trong hệ sinh thái frontend.
- **English:** You will see trees in DOM, AST, routing, menus, editor states, and React internals.
- **Tiếng Việt:** Bạn sẽ gặp cây trong DOM, AST, route tree, menu tree, editor state và cả nội bộ React.

## Tài Liệu Liên Quan / Related References
- [Algorithms Theory](../../shared/01-cs-fundamentals/algorithms-theory.md)
- [Data Structures Theory](../../shared/01-cs-fundamentals/data-structures-theory.md)

---

## 1) Tree Traversals / Các Cách Duyệt Cây
### 🟢 [Junior] Tổng Quan
- **English:** Traversal defines the order of visiting nodes.
- **Tiếng Việt:** Duyệt cây là quy tắc thứ tự thăm node.

### Explanation / Giải thích
- Inorder (LNR): phù hợp BST vì cho output đã sort tăng dần.
- Preorder (NLR): thuận tiện serialize cây theo dạng “node trước con”.
- Postorder (LRN): tốt cho các bài toán tính toán phụ thuộc con trước cha.
- Level-order (BFS): đi theo tầng, hữu ích cho UI render theo depth.

### Example / Ví dụ
```ts
type TNode = { val: number; left: TNode | null; right: TNode | null };

function inorder(root: TNode | null, out: number[] = []): number[] {
  if (!root) return out;
  inorder(root.left, out);
  out.push(root.val);
  inorder(root.right, out);
  return out;
}

function preorder(root: TNode | null, out: number[] = []): number[] {
  if (!root) return out;
  out.push(root.val);
  preorder(root.left, out);
  preorder(root.right, out);
  return out;
}

function postorder(root: TNode | null, out: number[] = []): number[] {
  if (!root) return out;
  postorder(root.left, out);
  postorder(root.right, out);
  out.push(root.val);
  return out;
}

function levelOrder(root: TNode | null): number[] {
  if (!root) return [];
  const q: TNode[] = [root];
  const out: number[] = [];
  while (q.length) {
    const n = q.shift()!;
    out.push(n.val);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return out;
}
```

### Complexity Analysis
- Time cho mọi traversal: O(n).
- Space: O(h) cho recursion stack; level-order thêm O(w) queue.

## 2) BST Operations / Thao Tác Với Binary Search Tree

### 🟢 [Junior] Tổng Quan
- **English:** BST maintains left < root < right invariant.
- **Tiếng Việt:** BST giữ bất biến: cây con trái < root < cây con phải.

### Explanation / Giải thích
- Các thao tác nền tảng: search, insert, delete, validate.
- Delete có 3 case: leaf, 1 child, 2 children (dùng inorder successor).
- Interview thường hỏi tính đúng đắn và complexity trung bình/tệ nhất.

### Example / Ví dụ
```ts
class BSTNode {
  constructor(
    public val: number,
    public left: BSTNode | null = null,
    public right: BSTNode | null = null
  ) {}
}

class BST {
  root: BSTNode | null = null;

  search(x: number): boolean {
    let cur = this.root;
    while (cur) {
      if (x === cur.val) return true;
      cur = x < cur.val ? cur.left : cur.right;
    }
    return false;
  }

  insert(x: number): void {
    const rec = (n: BSTNode | null): BSTNode => {
      if (!n) return new BSTNode(x);
      if (x < n.val) n.left = rec(n.left);
      else if (x > n.val) n.right = rec(n.right);
      return n;
    };
    this.root = rec(this.root);
  }

  delete(x: number): void {
    const minNode = (n: BSTNode): BSTNode => {
      let cur = n;
      while (cur.left) cur = cur.left;
      return cur;
    };

    const rec = (n: BSTNode | null, v: number): BSTNode | null => {
      if (!n) return null;
      if (v < n.val) n.left = rec(n.left, v);
      else if (v > n.val) n.right = rec(n.right, v);
      else {
        if (!n.left) return n.right;
        if (!n.right) return n.left;
        const succ = minNode(n.right);
        n.val = succ.val;
        n.right = rec(n.right, succ.val);
      }
      return n;
    };

    this.root = rec(this.root, x);
  }
}

function isValidBST(root: BSTNode | null): boolean {
  const check = (node: BSTNode | null, lo: number, hi: number): boolean => {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return check(node.left, lo, node.val) && check(node.right, node.val, hi);
  };
  return check(root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
}
```

### Complexity Analysis
- Trung bình (balanced): search/insert/delete O(log n).
- Tệ nhất (skewed): O(n).
- Validate BST: O(n) time, O(h) stack.

### Frontend Use Case
- Index nội bộ cho feature flags hoặc sorted config keys.
- Cấu trúc quyết định nhanh trong editor command palette.

## 3) Balanced Trees Concepts: AVL & Red-Black / Khái Niệm Cây Cân Bằng

### 🟡 [Mid] Tổng Quan
- **English:** Balanced trees keep height near log n for stable performance.
- **Tiếng Việt:** Cây cân bằng giữ chiều cao gần log n để ổn định hiệu năng.

### Explanation / Giải thích
- AVL: cân bằng nghiêm ngặt theo balance factor {-1,0,1}.
- Red-Black: quy tắc màu nới lỏng hơn, update thực tế thường nhanh.
- Frontend thường không tự implement full, nhưng cần hiểu để giải thích Map/Set internals.

### Example / Ví dụ
```ts
type AvlNode = {
  val: number;
  h: number;
  left: AvlNode | null;
  right: AvlNode | null;
};

const height = (n: AvlNode | null) => n?.h ?? 0;

function rotateRight(y: AvlNode): AvlNode {
  const x = y.left!;
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  y.h = 1 + Math.max(height(y.left), height(y.right));
  x.h = 1 + Math.max(height(x.left), height(x.right));
  return x;
}

function rotateLeft(x: AvlNode): AvlNode {
  const y = x.right!;
  const t2 = y.left;
  y.left = x;
  x.right = t2;
  x.h = 1 + Math.max(height(x.left), height(x.right));
  y.h = 1 + Math.max(height(y.left), height(y.right));
  return y;
}
```

### Complexity Analysis
- AVL search/insert/delete: O(log n).
- Rotation: O(1).
- Red-Black cũng bảo đảm O(log n) worst-case.

### Frontend Use Case
- Hiểu vì sao cấu trúc cân bằng giúp performance ổn định ở scale lớn.
- Giải thích được lý do library chọn Red-Black thay vì AVL trong nhiều runtime.

## 4) Trie Operations / Cấu Trúc Trie

### 🟡 [Mid] Tổng Quan
- **English:** Trie stores strings by characters, excellent for prefix queries.
- **Tiếng Việt:** Trie lưu chuỗi theo ký tự, rất mạnh cho truy vấn tiền tố.

### Explanation / Giải thích
- Các thao tác chuẩn: insert, search exact, startsWith.
- Chi phí phụ thuộc độ dài từ, không phụ thuộc tổng số phần tử trực tiếp.
- Ứng dụng rõ nhất: autocomplete, command palette, dictionary.

### Example / Ví dụ
```ts
class TrieNode {
  children = new Map<string, TrieNode>();
  end = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children.has(ch)) cur.children.set(ch, new TrieNode());
      cur = cur.children.get(ch)!;
    }
    cur.end = true;
  }

  search(word: string): boolean {
    let cur = this.root;
    for (const ch of word) {
      const nxt = cur.children.get(ch);
      if (!nxt) return false;
      cur = nxt;
    }
    return cur.end;
  }

  startsWith(prefix: string): boolean {
    let cur = this.root;
    for (const ch of prefix) {
      const nxt = cur.children.get(ch);
      if (!nxt) return false;
      cur = nxt;
    }
    return true;
  }
}
```

### Complexity Analysis
- Insert/Search/StartsWith: O(L) với L là độ dài chuỗi.
- Space: O(total characters được lưu)

### Frontend Use Case
- Autocomplete cho docs search box.
- Lookup command nhanh trong IDE-like web app.

## 5) Segment Tree Basics / Cơ Bản Về Segment Tree

### 🔴 [Senior] Tổng Quan
- **English:** Segment tree supports range query + point update efficiently.
- **Tiếng Việt:** Segment tree hỗ trợ truy vấn đoạn + cập nhật điểm hiệu quả.

### Explanation / Giải thích
- Phù hợp khi có nhiều query trên mảng thay đổi liên tục.
- Interview frontend senior có thể hỏi trong context dashboard time-series.
- Có thể mở rộng với lazy propagation cho range update.

### Example / Ví dụ
```ts
class SegmentTree {
  private n: number;
  private tree: number[];

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = Array(this.n * 4).fill(0);
    this.build(1, 0, this.n - 1, arr);
  }

  private build(idx: number, l: number, r: number, arr: number[]): void {
    if (l === r) {
      this.tree[idx] = arr[l];
      return;
    }
    const m = (l + r) >> 1;
    this.build(idx * 2, l, m, arr);
    this.build(idx * 2 + 1, m + 1, r, arr);
    this.tree[idx] = this.tree[idx * 2] + this.tree[idx * 2 + 1];
  }

  query(qL: number, qR: number): number {
    const rec = (idx: number, l: number, r: number): number => {
      if (qR < l || r < qL) return 0;
      if (qL <= l && r <= qR) return this.tree[idx];
      const m = (l + r) >> 1;
      return rec(idx * 2, l, m) + rec(idx * 2 + 1, m + 1, r);
    };
    return rec(1, 0, this.n - 1);
  }

  update(pos: number, val: number): void {
    const rec = (idx: number, l: number, r: number): void => {
      if (l === r) {
        this.tree[idx] = val;
        return;
      }
      const m = (l + r) >> 1;
      if (pos <= m) rec(idx * 2, l, m);
      else rec(idx * 2 + 1, m + 1, r);
      this.tree[idx] = this.tree[idx * 2] + this.tree[idx * 2 + 1];
    };
    rec(1, 0, this.n - 1);
  }
}
```

### Complexity Analysis
- Build: O(n).
- Range query: O(log n).
- Point update: O(log n).
- Space: O(4n) thường dùng trong implement mảng.

### Frontend Use Case
- Biểu đồ thời gian thực cần query tổng theo khoảng thời gian.
- Heatmap cần cập nhật và truy vấn nhanh theo segments.

## 6) Tree Serialization/Deserialization / Chuỗi Hóa & Khôi Phục Cây

### 🟡 [Mid] Tổng Quan
- **English:** Serialization converts tree into transferable string format.
- **Tiếng Việt:** Serialization biến cây thành chuỗi để lưu/truyền.

### Explanation / Giải thích
- Preorder + null marker là cách phổ biến, dễ implement.
- Deserialization cần đọc token đúng thứ tự để tái tạo cấu trúc.
- Ứng dụng: persist UI layout tree hoặc undo/redo snapshots.

### Example / Ví dụ
```ts
type SNode = { val: string; left: SNode | null; right: SNode | null };

function serialize(root: SNode | null): string {
  const out: string[] = [];
  const dfs = (n: SNode | null) => {
    if (!n) {
      out.push('#');
      return;
    }
    out.push(n.val);
    dfs(n.left);
    dfs(n.right);
  };
  dfs(root);
  return out.join(',');
}

function deserialize(data: string): SNode | null {
  const arr = data.split(',');
  let i = 0;
  const build = (): SNode | null => {
    if (i >= arr.length) return null;
    const tok = arr[i++];
    if (tok === '#') return null;
    return { val: tok, left: build(), right: build() };
  };
  return build();
}
```

### Complexity Analysis
- Time serialize: O(n), deserialize: O(n).
- Space: O(n) cho output/token + stack.

### Frontend Use Case
- Lưu cấu trúc widget tree trong localStorage.
- Đồng bộ state tree giữa tab/session.

## 7) LCA - Lowest Common Ancestor / Tổ Tiên Chung Gần Nhất

### 🔴 [Senior] Tổng Quan
- **English:** LCA finds the deepest node that is ancestor of both targets.
- **Tiếng Việt:** LCA tìm node sâu nhất là tổ tiên của cả 2 node cần xét.

### Explanation / Giải thích
- Trong binary tree thường dùng DFS trả node gặp đầu tiên thỏa điều kiện.
- Trong BST có thể tận dụng ordering để đi xuống O(h).
- Ứng dụng UI: xác định common container của hai phần tử DOM logic.

### Example / Ví dụ
```ts
type N = { val: number; left: N | null; right: N | null };

function lcaBinaryTree(root: N | null, p: number, q: number): N | null {
  if (!root) return null;
  if (root.val === p || root.val === q) return root;

  const left = lcaBinaryTree(root.left, p, q);
  const right = lcaBinaryTree(root.right, p, q);

  if (left && right) return root;
  return left ?? right;
}

function lcaBST(root: N | null, p: number, q: number): N | null {
  let cur = root;
  const lo = Math.min(p, q);
  const hi = Math.max(p, q);
  while (cur) {
    if (hi < cur.val) cur = cur.left;
    else if (lo > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}
```

### Complexity Analysis
- Binary tree LCA: O(n).
- BST LCA: O(h), balanced thì O(log n).

### Frontend Use Case
- Determining nearest shared section in document outline tree.
- Event delegation optimization trong complex component trees.

## 8) Tree Diameter / Đường Kính Cây

### 🟡 [Mid] Tổng Quan
- **English:** Tree diameter is the longest path between any two nodes.
- **Tiếng Việt:** Đường kính cây là độ dài đường đi dài nhất giữa hai node bất kỳ.

### Explanation / Giải thích
- Kỹ thuật phổ biến: DFS tính height và cập nhật max(left+right).
- Có thể dùng 2 BFS/DFS nếu cây xem như graph vô hướng.
- Ứng dụng: ước lượng chiều sâu tương tác tệ nhất trong tree-based flow.

### Example / Ví dụ
```ts
type DNode = { left: DNode | null; right: DNode | null };

function diameter(root: DNode | null): number {
  let ans = 0;
  const depth = (n: DNode | null): number => {
    if (!n) return 0;
    const l = depth(n.left);
    const r = depth(n.right);
    ans = Math.max(ans, l + r);
    return 1 + Math.max(l, r);
  };
  depth(root);
  return ans;
}
```

### Complexity Analysis
- Time: O(n).
- Space: O(h) recursion stack.

### Frontend Use Case
- Đánh giá đường đi dài nhất trong menu nested.
- Estimate complexity của user journey tree.

## 9) Build Tree from Traversals / Dựng Cây Từ Traversal

### 🔴 [Senior] Tổng Quan
- **English:** Common interview: build binary tree from preorder + inorder.
- **Tiếng Việt:** Bài phỏng vấn phổ biến: dựng cây từ preorder + inorder.

### Explanation / Giải thích
- Dùng hashmap vị trí inorder để chia trái/phải nhanh O(1).
- Nếu không map, complexity có thể tăng O(n^2).
- Bài này kiểm tra hiểu recursion boundaries và indexing.

### Example / Ví dụ
```ts
type BNode = { val: number; left: BNode | null; right: BNode | null };

function buildTree(preorder: number[], inorder: number[]): BNode | null {
  const idx = new Map<number, number>();
  inorder.forEach((v, i) => idx.set(v, i));

  let p = 0;
  const rec = (l: number, r: number): BNode | null => {
    if (l > r) return null;
    const rootVal = preorder[p++];
    const m = idx.get(rootVal)!;
    return {
      val: rootVal,
      left: rec(l, m - 1),
      right: rec(m + 1, r),
    };
  };

  return rec(0, inorder.length - 1);
}
```

### Complexity Analysis
- Time: O(n).
- Space: O(n) map + recursion.

### Frontend Use Case
- Khôi phục cấu trúc component tree từ snapshot order metadata.
- Parse AST-like data trong tooling.

## 10) DOM as a Tree / DOM Là Một Cây

### 🟢 [Junior] Tổng Quan
- **English:** Browser DOM is a rooted ordered tree of nodes.
- **Tiếng Việt:** DOM trong trình duyệt là cây có gốc và có thứ tự con.

### Explanation / Giải thích
- Mọi thao tác query/select/traverse đều map sang tree operations.
- Event bubbling/capturing cũng phản ánh di chuyển dọc cây tổ tiên.
- Hiểu điều này giúp tối ưu thao tác DOM và delegation.

### Example / Ví dụ
```ts
function collectTagNames(root: Element): string[] {
  const out: string[] = [];
  const stack: Element[] = [root];

  while (stack.length) {
    const el = stack.pop()!;
    out.push(el.tagName.toLowerCase());
    const children = Array.from(el.children) as Element[];
    for (let i = children.length - 1; i >= 0; i -= 1) {
      stack.push(children[i]);
    }
  }

  return out;
}
```

### Complexity Analysis
- Traverse toàn DOM subtree: O(n).
- Space: O(h) hoặc O(n) tùy cấu trúc và cách duyệt.

### Frontend Use Case
- Tối ưu thao tác trên subtree thay vì query toàn document.
- Áp dụng event delegation dựa trên ancestor path.

## 11) Virtual DOM Diffing Concepts / Khái Niệm Diffing Cây Ảo

### 🟡 [Mid] Tổng Quan
- **English:** Virtual DOM diff compares previous and next trees to compute minimal updates.
- **Tiếng Việt:** Diff Virtual DOM so sánh cây cũ/mới để tính patch tối thiểu.

### Explanation / Giải thích
- React heuristic chính: cùng type thì reuse node, khác type thì replace subtree.
- Key giúp xác định identity trong list children.
- Mất key ổn định dẫn tới re-mount và mất state.

### Example / Ví dụ
```ts
type VNode = { type: string; key?: string; children?: VNode[] };

function shallowDiff(a: VNode, b: VNode): 'REPLACE' | 'UPDATE' {
  if (a.type !== b.type) return 'REPLACE';
  if (a.key !== b.key) return 'REPLACE';
  return 'UPDATE';
}
```

### Complexity Analysis
- Worst-case tree diff tổng quát là đắt; framework dùng heuristic để gần O(n).
- Cost thực tế phụ thuộc số node thay đổi và key quality.

### Frontend Use Case
- Tối ưu render list lớn bằng key ổn định.
- Giảm unnecessary re-render trong component tree.

## 12) React Fiber Tree / Cây Fiber của React

### 🔴 [Senior] Tổng Quan
- **English:** React Fiber is an incremental tree structure enabling cooperative scheduling.
- **Tiếng Việt:** React Fiber là cấu trúc cây cho phép render tăng dần và scheduling hợp tác.

### Explanation / Giải thích
- Mỗi fiber node chứa thông tin component, pending props, lanes, effect flags.
- Double buffering: current tree và work-in-progress tree.
- Commit phase áp dụng side effects lên host environment (DOM).

### Example / Ví dụ
```ts
// Pseudo-structure for interview explanation
interface FiberLike {
  type: string;
  key: null | string;
  child: FiberLike | null;
  sibling: FiberLike | null;
  return: FiberLike | null;
  pendingProps: unknown;
  memoizedProps: unknown;
  flags: number;
}

function explainFiberFlow(): string[] {
  return [
    'render phase: build work-in-progress fibers',
    'reconcile children: compare current vs next',
    'commit phase: apply DOM mutations/effects',
  ];
}
```

### Complexity Analysis
- Conceptual complexity không chỉ Big-O; trọng tâm là interruptible rendering.
- Fiber giúp chia nhỏ công việc để tránh block main thread dài.

### Frontend Use Case
- Giải thích Concurrent Rendering behavior trong React 18 interview.
- Hiểu source of “why component renders twice in StrictMode dev”.

## Interview Strategy / Chiến Lược Trả Lời Phỏng Vấn
### Overview / Tổng Quan
- **English:** Show conceptual clarity first, then code precisely, then discuss trade-offs.
- **Tiếng Việt:** Hãy trả lời theo thứ tự: hiểu bản chất -> code chuẩn -> phân tích trade-off.

### Explanation / Giải thích
- Bắt đầu từ invariant của cấu trúc cây (BST invariant, height property, etc.).
- Với bài recursion, luôn nêu base case trước để tránh lan man.
- Nhắc tới độ phức tạp theo n (số node) và h (chiều cao).
- Chủ động nói edge case: cây rỗng, node trùng giá trị, cây lệch hẳn về một phía.

### Example / Ví dụ
```ts
function interviewTemplate(problem: string): string {
  return `Problem=${problem}; invariant->approach->complexity->edge cases`;
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A
### 🟢 [Junior] Inorder traversal có ý nghĩa gì trong BST?
- **Giải thích:** Inorder trả về dãy tăng dần nếu cây đúng BST.
- **Giải thích (bổ sung):** Đây là cách validate trực quan rất phổ biến.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] Khác biệt giữa preorder và postorder?
- **Giải thích:** Preorder xử lý node trước con; postorder xử lý con trước node.
- **Giải thích (bổ sung):** Postorder phù hợp delete/free tree hoặc tính toán bottom-up.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Tại sao BST có thể chậm O(n)?
- **Giải thích:** Khi cây bị skewed thành dạng linked list.
- **Giải thích (bổ sung):** Vì chiều cao h ≈ n, nên mọi thao tác phụ thuộc h đều thành O(n).
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Delete node có 2 con trong BST làm sao?
- **Giải thích:** Tìm inorder successor (nhỏ nhất của cây con phải).
- **Giải thích (bổ sung):** Copy giá trị successor vào node cần xóa rồi xóa successor.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] Level-order traversal dùng cấu trúc nào?
- **Giải thích:** Dùng queue để duyệt theo tầng.
- **Giải thích (bổ sung):** Đây là BFS trên cây.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] AVL khác Red-Black ra sao?
- **Giải thích:** AVL cân bằng nghiêm hơn nên lookup tốt, update có thể rotate nhiều hơn.
- **Giải thích (bổ sung):** Red-Black nới lỏng hơn, thường practical cho thư viện chuẩn.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Trie mạnh hơn hash map ở điểm nào?
- **Giải thích:** Truy vấn prefix hiệu quả trực tiếp.
- **Giải thích (bổ sung):** Hash map cần scan hoặc cấu trúc phụ để hỗ trợ prefix.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] Khi nào dùng segment tree thay Fenwick tree?
- **Giải thích:** Khi cần nhiều loại range query/operation phức tạp.
- **Giải thích (bổ sung):** Fenwick đơn giản hơn cho prefix sums nhưng ít linh hoạt hơn.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Serialization cần null marker vì sao?
- **Giải thích:** Để bảo toàn cấu trúc cây, không chỉ giá trị node.
- **Giải thích (bổ sung):** Nếu thiếu marker sẽ không khôi phục được topology chính xác.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] LCA trong BST tối ưu thế nào?
- **Giải thích:** Dựa vào ordering để đi xuống 1 nhánh duy nhất.
- **Giải thích (bổ sung):** O(h) thay vì O(n) của binary tree tổng quát.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Tree diameter liên hệ gì với height?
- **Giải thích:** Không phải lúc nào diameter = 2*height.
- **Giải thích (bổ sung):** Diameter có thể đi qua hoặc không qua root.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] Build tree từ preorder+inorder vì sao cần hash map?
- **Giải thích:** Để tìm root index trong inorder O(1).
- **Giải thích (bổ sung):** Nếu linear scan mỗi lần sẽ thành O(n^2).
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] DOM được xem là cây kiểu gì?
- **Giải thích:** Cây có thứ tự (ordered rooted tree).
- **Giải thích (bổ sung):** Mỗi element có parent/children rõ ràng.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Key trong React list quan trọng thế nào?
- **Giải thích:** Giúp React xác định identity node qua các lần render.
- **Giải thích (bổ sung):** Key kém ổn định làm mất state và tăng re-render.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] Fiber giải quyết vấn đề gì?
- **Giải thích:** Chia nhỏ render work để tránh block main thread.
- **Giải thích (bổ sung):** Hỗ trợ scheduling theo priority/lane.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Validate BST bằng inorder có được không?
- **Giải thích:** Có, kiểm tra dãy inorder strictly increasing.
- **Giải thích (bổ sung):** Tuy nhiên cần cẩn thận duplicate policy (cho phép hay không).
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] Độ phức tạp traversal là bao nhiêu?
- **Giải thích:** O(n) vì thăm mỗi node đúng 1 lần.
- **Giải thích (bổ sung):** Space phụ thuộc stack/queue theo cấu trúc cây.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Khi nào recursion gây vấn đề?
- **Giải thích:** Khi cây rất sâu có thể tràn stack.
- **Giải thích (bổ sung):** Có thể chuyển qua iterative stack.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] Segment tree lazy propagation dùng khi nào?
- **Giải thích:** Khi có range update thường xuyên.
- **Giải thích (bổ sung):** Giúp tránh cập nhật từng phần tử O(k).
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] BST search hoạt động như thế nào?
- **Giải thích:** So sánh với root rồi rẽ trái/phải theo invariant.
- **Giải thích (bổ sung):** Trung bình O(log n) nếu cây cân bằng.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Vì sao tree từ traversals cần unique values?
- **Giải thích:** Để map giá trị -> vị trí inorder không mơ hồ.
- **Giải thích (bổ sung):** Có duplicate thì cần metadata bổ sung.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] VDOM diff có luôn tối ưu tuyệt đối không?
- **Giải thích:** Không, framework dùng heuristic để đạt hiệu năng thực tế.
- **Giải thích (bổ sung):** Tối ưu tuyệt đối tổng quát quá đắt.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Ứng dụng trie trong frontend product?
- **Giải thích:** Autocomplete search docs/commands.
- **Giải thích (bổ sung):** Prefix filtering realtime với latency thấp.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] Postorder dùng cho bài toán nào?
- **Giải thích:** Tính tổng subtree, xóa tree, evaluate expression tree.
- **Giải thích (bổ sung):** Vì cần xử lý con trước cha.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] Tại sao React dùng tree chứ không graph tổng quát?
- **Giải thích:** UI component hierarchy có parent-child rõ ràng, thuận lợi diff/update.
- **Giải thích (bổ sung):** Graph tổng quát phức tạp hơn nhiều cho reconcile.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Cách nhớ thứ tự traversal nhanh?
- **Giải thích:** N-L-R = preorder, L-N-R = inorder, L-R-N = postorder.
- **Giải thích (bổ sung):** Học bằng sơ đồ nhỏ 3 node để phản xạ nhanh.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] Làm sao giải thích Fiber cho interviewer không đào source?
- **Giải thích:** Dùng 3 ý: unit-of-work nhỏ, interruptible render, commit atomic.
- **Giải thích (bổ sung):** Trình bày practical impact: UI mượt hơn khi workload lớn.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] Cây rỗng thì traversal trả gì?
- **Giải thích:** Trả mảng rỗng.
- **Giải thích (bổ sung):** Đây là base case chuẩn.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] LCA có thể precompute không?
- **Giải thích:** Có, dùng binary lifting/Euler tour cho nhiều query.
- **Giải thích (bổ sung):** Nhưng tăng memory và preprocessing.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] Khi nào tự implement tree structure trong app?
- **Giải thích:** Khi bài toán domain yêu cầu index/truy vấn đặc thù.
- **Giải thích (bổ sung):** Không nên tự viết nếu chỉ cần behavior có sẵn từ platform/library.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] DFS tree khác DFS graph ở đâu?
- **Giải thích:** Tree không cần visited nếu chắc chắn không cycle.
- **Giải thích (bổ sung):** Graph cần visited để tránh lặp vô hạn.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Có thể serialize bằng level-order không?
- **Giải thích:** Có, nếu kèm null markers.
- **Giải thích (bổ sung):** Preorder thường gọn và recursion-friendly hơn.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🔴 [Senior] Tree diameter với weighted edges làm sao?
- **Giải thích:** Dùng DFS cộng weight hoặc Dijkstra/2-pass trên tree weighted.
- **Giải thích (bổ sung):** Khái niệm vẫn là longest shortest path trên tree.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟡 [Mid] Tại sao balanced tree quan trọng ở scale?
- **Giải thích:** Giữ độ trễ worst-case ổn định.
- **Giải thích (bổ sung):** Tránh regression khó đoán khi dữ liệu lệch.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

### 🟢 [Junior] DOM querySelectorAll có liên quan traversal?
- **Giải thích:** Có, browser engine duyệt cây theo chiến lược tối ưu selector.
- **Giải thích (bổ sung):** Hiểu tree giúp viết selector hiệu quả hơn.
- **Ví dụ:** Trình bày trên bảng với cây 7 node để interviewer dễ theo dõi.

---

## Checklist Ôn Tập Nhanh / Quick Review Checklist
- [ ] 1. Viết được 4 traversal không nhìn tài liệu.
- [ ] 2. Giải thích được BST delete 3 trường hợp.
- [ ] 3. Hiểu sự khác biệt AVL và Red-Black ở mức concept.
- [ ] 4. Code trie insert/search/startsWith chuẩn.
- [ ] 5. Nắm segment tree query + update cơ bản.
- [ ] 6. Serialize/deserialize không mất cấu trúc.
- [ ] 7. Giải được LCA và diameter.
- [ ] 8. Hiểu VDOM diff + key + React Fiber ở mức senior interview.

[Back to Table of Contents](../../00-table-of-contents.md)
