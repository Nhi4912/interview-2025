#!/usr/bin/env node
/**
 * Generate individual problem .md files from company CSV data.
 * Follows docs/leetcode/RULES.md format specification.
 *
 * Usage: node scripts/generate-problem-files.mjs [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CSV_ROOT = path.join(ROOT, 'docs/interview-company-wise-problems');
const LEETCODE_ROOT = path.join(ROOT, 'docs/leetcode');
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

// When --force, only protect manually-written files (those with real solution code)
const PROTECTED_SLUGS = new Set();

// ─── CSV Parser ───────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { fields.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    fields.push(current.trim());
    if (fields.length >= 6) {
      rows.push({
        difficulty: fields[0],
        title: fields[1],
        frequency: parseFloat(fields[2]) || 0,
        acceptanceRate: parseFloat(fields[3]) || 0,
        link: fields[4],
        topics: fields[5].split(',').map(t => t.trim()).filter(Boolean),
      });
    }
  }
  return rows;
}

// ─── Topic → Category Mapping ────────────────────────────────────────────
const CATEGORY_MAP = {
  // array
  'Array': 'array', 'Two Pointers': 'array', 'Sliding Window': 'array',
  'Prefix Sum': 'array', 'Matrix': 'array', 'Simulation': 'array',
  // string
  'String': 'string', 'Trie': 'string', 'String Matching': 'string',
  'Rolling Hash': 'string', 'Hash Function': 'string',
  // dp
  'Dynamic Programming': 'dp', 'Memoization': 'dp',
  // tree-graph
  'Tree': 'tree-graph', 'Binary Tree': 'tree-graph', 'Binary Search Tree': 'tree-graph',
  'Graph': 'tree-graph', 'Breadth-First Search': 'tree-graph',
  'Depth-First Search': 'tree-graph', 'Topological Sort': 'tree-graph',
  'Shortest Path': 'tree-graph', 'Minimum Spanning Tree': 'tree-graph',
  'Eulerian Circuit': 'tree-graph', 'Biconnected Component': 'tree-graph',
  'Strongly Connected Component': 'tree-graph',
  // backtracking
  'Backtracking': 'backtracking',
  // linked-list
  'Linked List': 'linked-list', 'Doubly-Linked List': 'linked-list',
  // design
  'Design': 'design', 'Data Stream': 'design', 'Iterator': 'design',
  // sorting-searching
  'Sorting': 'sorting-searching', 'Binary Search': 'sorting-searching',
  'Heap (Priority Queue)': 'sorting-searching', 'Divide and Conquer': 'sorting-searching',
  'Quickselect': 'sorting-searching', 'Merge Sort': 'sorting-searching',
  'Bucket Sort': 'sorting-searching', 'Counting Sort': 'sorting-searching',
  'Radix Sort': 'sorting-searching',
  // math
  'Math': 'math', 'Bit Manipulation': 'math', 'Number Theory': 'math',
  'Geometry': 'math', 'Combinatorics': 'math', 'Randomized': 'math',
  'Probability and Statistics': 'math', 'Game Theory': 'math',
  // others
  'Stack': 'others', 'Queue': 'others', 'Monotonic Stack': 'others',
  'Monotonic Queue': 'others', 'Greedy': 'others', 'Union Find': 'others',
  'Hash Table': 'others', 'Ordered Set': 'others', 'Ordered Map': 'others',
  'Line Sweep': 'others', 'Segment Tree': 'others',
  'Binary Indexed Tree': 'others', 'Enumeration': 'others',
  'Bitmask': 'others', 'Concurrency': 'others', 'Shell': 'others',
  'Database': 'others', 'Interactive': 'others', 'Brainteaser': 'others',
  'Rejection Sampling': 'others', 'Reservoir Sampling': 'others',
  'Suffix Array': 'others',
};

// Priority order for category assignment (when problem has multiple topics)
const CATEGORY_PRIORITY = [
  'tree-graph', 'linked-list', 'dp', 'backtracking', 'design',
  'sorting-searching', 'string', 'array', 'math', 'others'
];

function assignCategory(topics) {
  // Check each topic against the map, return highest-priority category
  const cats = new Set();
  for (const t of topics) {
    const cat = CATEGORY_MAP[t];
    if (cat) cats.add(cat);
  }
  for (const prio of CATEGORY_PRIORITY) {
    if (cats.has(prio)) return prio;
  }
  return 'others';
}

// ─── Topic → Pattern Detection ──────────────────────────────────────────
function detectPattern(topics, title) {
  const t = topics.join(' ').toLowerCase();
  const tl = title.toLowerCase();

  if (t.includes('topological sort')) return 'Topological Sort';
  if (t.includes('shortest path')) return 'Shortest Path (BFS/Dijkstra)';
  if (t.includes('minimum spanning tree')) return 'Minimum Spanning Tree';
  if (t.includes('union find')) return 'Union Find';
  if (t.includes('trie')) return 'Trie';
  if (t.includes('segment tree')) return 'Segment Tree';
  if (t.includes('binary indexed tree')) return 'Binary Indexed Tree';
  if (t.includes('monotonic stack')) return 'Monotonic Stack';
  if (t.includes('monotonic queue')) return 'Monotonic Queue';
  if (t.includes('sliding window')) return 'Sliding Window';
  if (t.includes('two pointers')) return 'Two Pointers';
  if (t.includes('prefix sum')) return 'Prefix Sum';
  if (t.includes('backtracking')) return 'Backtracking';
  if (t.includes('dynamic programming') || t.includes('memoization')) return 'Dynamic Programming';
  if (t.includes('binary search')) return 'Binary Search';
  if (t.includes('heap') || t.includes('quickselect')) return 'Heap / Priority Queue';
  if (t.includes('breadth-first search')) return 'BFS';
  if (t.includes('depth-first search')) return 'DFS';
  if (t.includes('binary tree') || t.includes('binary search tree')) return 'Tree Traversal';
  if (t.includes('graph')) return 'Graph';
  if (t.includes('linked list') || t.includes('doubly-linked')) return 'Linked List';
  if (t.includes('stack')) return 'Stack';
  if (t.includes('queue')) return 'Queue';
  if (t.includes('greedy')) return 'Greedy';
  if (t.includes('divide and conquer')) return 'Divide and Conquer';
  if (t.includes('sorting') || t.includes('merge sort') || t.includes('bucket sort')) return 'Sorting';
  if (t.includes('bit manipulation') || t.includes('bitmask')) return 'Bit Manipulation';
  if (t.includes('math') || t.includes('number theory') || t.includes('combinatorics')) return 'Math';
  if (t.includes('design') || t.includes('data stream')) return 'Design';
  if (t.includes('string matching') || t.includes('rolling hash')) return 'String Matching';
  if (t.includes('hash table')) return 'Hash Map';
  if (t.includes('matrix') || t.includes('simulation')) return 'Matrix / Simulation';
  if (t.includes('string')) return 'String Processing';
  if (t.includes('array')) return 'Array';
  return 'Ad-hoc';
}

// ─── Vietnamese Title Translation ──────────────────────────────────────
const VI_WORDS = {
  'two sum': 'Tổng Hai Số', 'three sum': 'Tổng Ba Số', 'four sum': 'Tổng Bốn Số',
  'longest': 'Dài Nhất', 'shortest': 'Ngắn Nhất', 'maximum': 'Lớn Nhất',
  'minimum': 'Nhỏ Nhất', 'median': 'Trung Vị', 'valid': 'Hợp Lệ',
  'binary search': 'Tìm Kiếm Nhị Phân', 'binary tree': 'Cây Nhị Phân',
  'linked list': 'Danh Sách Liên Kết', 'sorted array': 'Mảng Đã Sắp Xếp',
  'reverse': 'Đảo Ngược', 'palindrome': 'Chuỗi Đối Xứng',
  'substring': 'Chuỗi Con', 'subarray': 'Mảng Con', 'subsequence': 'Dãy Con',
  'permutation': 'Hoán Vị', 'combination': 'Tổ Hợp', 'subset': 'Tập Con',
  'search': 'Tìm Kiếm', 'sort': 'Sắp Xếp', 'merge': 'Ghép',
  'remove': 'Xoá', 'insert': 'Chèn', 'delete': 'Xoá',
  'duplicate': 'Trùng Lặp', 'unique': 'Duy Nhất',
  'matrix': 'Ma Trận', 'graph': 'Đồ Thị', 'tree': 'Cây',
  'stack': 'Ngăn Xếp', 'queue': 'Hàng Đợi', 'heap': 'Heap',
  'path': 'Đường Đi', 'depth': 'Độ Sâu', 'level': 'Cấp Độ',
  'number': 'Số', 'string': 'Chuỗi', 'array': 'Mảng',
  'count': 'Đếm', 'find': 'Tìm', 'first': 'Đầu Tiên', 'last': 'Cuối Cùng',
  'next': 'Tiếp Theo', 'k-th': 'Thứ K', 'kth': 'Thứ K',
  'largest': 'Lớn Nhất', 'smallest': 'Nhỏ Nhất',
  'sum': 'Tổng', 'product': 'Tích', 'difference': 'Hiệu',
  'interval': 'Khoảng', 'range': 'Phạm Vi', 'window': 'Cửa Sổ',
  'rotate': 'Xoay', 'spiral': 'Xoắn Ốc', 'zigzag': 'Zigzag',
  'island': 'Đảo', 'water': 'Nước', 'rain': 'Mưa',
  'container': 'Bình Chứa', 'stock': 'Cổ Phiếu', 'house': 'Nhà',
  'robber': 'Kẻ Trộm', 'stair': 'Bậc Thang', 'climb': 'Leo',
  'coin': 'Đồng Xu', 'jump': 'Nhảy', 'game': 'Trò Chơi',
  'word': 'Từ', 'letter': 'Chữ Cái', 'character': 'Ký Tự',
  'anagram': 'Hoán Chữ', 'parenthes': 'Ngoặc',
  'implement': 'Triển Khai', 'design': 'Thiết Kế',
  'cache': 'Bộ Nhớ Đệm', 'schedule': 'Lịch Trình',
  'meeting': 'Cuộc Họp', 'task': 'Nhiệm Vụ',
  'profit': 'Lợi Nhuận', 'cost': 'Chi Phí', 'price': 'Giá',
  'target': 'Mục Tiêu', 'peak': 'Đỉnh',
  'clone': 'Nhân Bản', 'copy': 'Sao Chép', 'flatten': 'Làm Phẳng',
  'cycle': 'Chu Trình', 'loop': 'Vòng Lặp',
  'power': 'Luỹ Thừa', 'square': 'Bình Phương', 'root': 'Căn',
  'add': 'Cộng', 'multiply': 'Nhân',
  'decode': 'Giải Mã', 'encode': 'Mã Hoá',
  'serialize': 'Tuần Tự Hoá', 'deserialize': 'Giải Tuần Tự',
};

function translateTitle(title) {
  // Try exact match first
  const lc = title.toLowerCase();
  if (VI_WORDS[lc]) return VI_WORDS[lc];

  // Otherwise keep English title (better than a bad translation)
  return title;
}

// ─── Difficulty Emoji ───────────────────────────────────────────────────
function normalizeDifficulty(d) {
  const dl = d.toLowerCase();
  if (dl === 'easy') return 'Easy';
  if (dl === 'medium') return 'Medium';
  return 'Hard';
}

function diffEmoji(d) {
  d = normalizeDifficulty(d);
  if (d === 'Easy') return '🟢 Easy';
  if (d === 'Medium') return '🟡 Medium';
  return '🔴 Hard';
}

// ─── Frequency Tier ─────────────────────────────────────────────────────
function freqTier(companyCount) {
  if (companyCount >= 50) return { emoji: '🔥', tier: 'Tier 1', note: 'Gặp >70% interviews, must-know' };
  if (companyCount >= 20) return { emoji: '⭐', tier: 'Tier 2', note: `Gặp ở ${companyCount}+ companies` };
  return { emoji: '📘', tier: 'Tier 3', note: `Gặp ở ${companyCount} companies` };
}

// ─── Slug Generation ────────────────────────────────────────────────────
function toSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Category Display Name ─────────────────────────────────────────────
const CATEGORY_DISPLAY = {
  'array': 'Array', 'string': 'String', 'dp': 'Dynamic Programming',
  'tree-graph': 'Tree-Graph', 'backtracking': 'Backtracking',
  'linked-list': 'Linked-List', 'design': 'Design',
  'sorting-searching': 'Sorting-Searching', 'math': 'Math', 'others': 'Others',
};

// ─── Pattern-Specific Content Templates ─────────────────────────────────
function getAnalogy(pattern, title) {
  const analogies = {
    'Two Pointers': 'Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.',
    'Sliding Window': 'Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.',
    'Binary Search': 'Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.',
    'Dynamic Programming': 'Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.',
    'DFS': 'Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.',
    'BFS': 'Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.',
    'Backtracking': 'Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).',
    'Tree Traversal': 'Tưởng tượng khám phá cây gia phả — bạn có thể đi từ gốc xuống lá (top-down) hoặc từ lá lên gốc (bottom-up), tuỳ câu hỏi cần trả lời.',
    'Graph': 'Giống mạng lưới đường phố — mỗi ngã tư là một node, mỗi con đường là edge. Bài toán đặt ra: tìm đường ngắn nhất, kiểm tra có chu trình, hoặc đếm thành phần liên thông.',
    'Linked List': 'Giống đoàn tàu — mỗi toa nối với toa sau. Muốn thay đổi thứ tự, bạn chỉ cần nối lại các khớp nối, không cần di chuyển cả toa.',
    'Stack': 'Giống chồng đĩa — đĩa nào đặt cuối cùng sẽ được lấy ra đầu tiên (LIFO). Nhiều bài toán về matching và nesting dùng stack.',
    'Queue': 'Giống hàng xếp mua vé — ai đến trước được phục vụ trước (FIFO). Thường dùng trong BFS và scheduling.',
    'Monotonic Stack': 'Giống dãy núi — giữ stack luôn đơn điệu (tăng hoặc giảm). Khi gặp phần tử phá vỡ tính đơn điệu, ta biết ngay đáp án cho các phần tử trước đó.',
    'Heap / Priority Queue': 'Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.',
    'Greedy': 'Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.',
    'Hash Map': 'Giống từ điển — tra cứu tức thì O(1). Đổi space lấy time, lưu thông tin đã thấy để tránh tìm lại.',
    'Sorting': 'Sau khi sắp xếp, nhiều bài toán trở nên đơn giản hơn — phần tử giống nhau nằm cạnh nhau, có thể dùng binary search, two pointers.',
    'Divide and Conquer': 'Giống chia đội để thi đấu — chia bài toán thành các phần nhỏ, giải riêng từng phần rồi ghép kết quả lại.',
    'Bit Manipulation': 'Làm việc trực tiếp với bit (0/1) — nhanh hơn phép toán thông thường. XOR, AND, OR, shift là các công cụ chính.',
    'Math': 'Bài toán cần công thức hoặc tính chất toán học — không cần brute force nếu nhận ra pattern.',
    'Union Find': 'Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.',
    'Trie': 'Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.',
    'Design': 'Bài Design yêu cầu xây dựng cấu trúc dữ liệu — quan trọng là chọn đúng cấu trúc nền và đảm bảo các operations đạt complexity yêu cầu.',
    'Topological Sort': 'Giống sắp xếp thứ tự học môn — môn A prerequisite của B thì A phải học trước. Topological sort xếp thứ tự sao cho mọi dependency được thoả mãn.',
    'Shortest Path (BFS/Dijkstra)': 'Giống tìm đường đi ngắn nhất trên Google Maps — BFS cho đồ thị không trọng số, Dijkstra cho có trọng số dương.',
    'Prefix Sum': 'Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).',
    'String Processing': 'Xử lý chuỗi ký tự — thường dùng hash table, two pointers, hoặc sliding window tuỳ bài toán.',
    'String Matching': 'Tìm pattern trong text — KMP, Rabin-Karp, hoặc Z-algorithm cho O(n+m) thay vì O(n*m) brute force.',
    'Segment Tree': 'Cấu trúc dữ liệu cho range queries — cập nhật và truy vấn đoạn trong O(log n).',
    'Binary Indexed Tree': 'Giống Segment Tree nhưng đơn giản hơn — dùng cho prefix sum queries và point updates.',
    'Minimum Spanning Tree': 'Tìm tập edges có tổng trọng số nhỏ nhất nối tất cả nodes — dùng Kruskal (sort + union find) hoặc Prim (heap).',
  };
  return analogies[pattern] || `Phân tích bài "${title}" — xác định pattern phù hợp dựa trên constraints và input/output.`;
}

function getVisualTemplate(pattern) {
  const templates = {
    'Two Pointers': `\`\`\`
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
\`\`\``,
    'Sliding Window': `\`\`\`
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
\`\`\``,
    'Binary Search': `\`\`\`
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
\`\`\``,
    'Dynamic Programming': `\`\`\`
dp table:
i:     0    1    2    3    4    ...
dp[i]: base  ?    ?    ?    ?

Transition: dp[i] = f(dp[i-1], dp[i-2], ...)
Base case:  dp[0] = ...
Answer:     dp[n] or max(dp)
\`\`\``,
    'DFS': `\`\`\`
       root
      /    \\
     A      B
    / \\      \\
   C   D      E

DFS: root → A → C → D → B → E
Use: recursion or explicit stack
\`\`\``,
    'BFS': `\`\`\`
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
\`\`\``,
    'Backtracking': `\`\`\`
                    []
            /       |       \\
          [a]      [b]      [c]
         / \\        |
      [a,b] [a,c]  [b,c]
       |
    [a,b,c]

Choose → Explore → Un-choose (backtrack)
Prune branches that violate constraints
\`\`\``,
    'Tree Traversal': `\`\`\`
        1
       / \\
      2   3
     / \\
    4   5

Inorder:   4, 2, 5, 1, 3
Preorder:  1, 2, 4, 5, 3
Postorder: 4, 5, 2, 3, 1
\`\`\``,
    'Linked List': `\`\`\`
Before: 1 → 2 → 3 → 4 → null
After:  ... (depends on operation)

Use: slow/fast pointers, dummy head, prev tracking
\`\`\``,
    'Stack': `\`\`\`
stack = []

push/pop from right →
Process: scan left to right, stack maintains invariant
\`\`\``,
    'Monotonic Stack': `\`\`\`
arr = [2, 1, 5, 6, 2, 3]
stack (indices): []

i=0: push 0         stack=[0]          (vals: [2])
i=1: 1<2 → push     stack=[0,1]        (vals: [2,1])
i=2: 5>1 → pop, process; 5>2 → pop, process
     push           stack=[2]          (vals: [5])
...
\`\`\``,
    'Heap / Priority Queue': `\`\`\`
Min Heap:
        1
       / \\
      3   2
     / \\
    7   4

Insert: add to end, bubble up
Extract: remove root, bubble down
\`\`\``,
    'Hash Map': `\`\`\`
Scan array:
i=0: num=2, need=target-2=7 → not in map → map={2:0}
i=1: num=7, need=target-7=2 → found in map! → return [map[2], 1] ✅

Key insight: store complement for O(1) lookup
\`\`\``,
  };
  return templates[pattern] || `\`\`\`
// TODO: Add step-by-step visual for ${pattern}
// Show one complete example with state at each step
\`\`\``;
}

function getPatternSignal(pattern) {
  const signals = {
    'Two Pointers': '"sorted array" + "find pair/triplet" → **Two Pointers**',
    'Sliding Window': '"contiguous subarray/substring" + "max/min length" → **Sliding Window**',
    'Binary Search': '"sorted" + "find target/position" → **Binary Search**',
    'Dynamic Programming': '"min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**',
    'DFS': '"traverse tree/graph" + "all paths" → **DFS**',
    'BFS': '"shortest path (unweighted)" + "level-order" → **BFS**',
    'Backtracking': '"generate all valid combinations/permutations" → **Backtracking**',
    'Tree Traversal': '"binary tree" + "traverse/collect values" → **Tree Traversal**',
    'Graph': '"nodes and edges" + "connectivity/reachability" → **Graph**',
    'Linked List': '"ListNode" + "in-place modification" → **Linked List**',
    'Stack': '"matching/nesting" + "most recent element" → **Stack**',
    'Monotonic Stack': '"next greater/smaller element" → **Monotonic Stack**',
    'Heap / Priority Queue': '"k-th largest/smallest" + "top-k elements" → **Heap**',
    'Greedy': '"locally optimal → globally optimal" + "sorting + selection" → **Greedy**',
    'Hash Map': '"find complement/match in O(1)" → **Hash Map**',
    'Sorting': '"order matters" + "grouping/dedup" → **Sorting**',
    'Divide and Conquer': '"split problem in half" + "merge results" → **Divide and Conquer**',
    'Bit Manipulation': '"binary representation" + "XOR/AND/OR properties" → **Bit Manipulation**',
    'Math': '"pattern/formula" + "number properties" → **Math**',
    'Union Find': '"group elements" + "connectivity queries" → **Union Find**',
    'Trie': '"prefix search" + "dictionary of words" → **Trie**',
    'Design': '"implement class with specific API" → **Design**',
    'Prefix Sum': '"range sum queries" + "subarray sum" → **Prefix Sum**',
    'Topological Sort': '"dependency ordering" + "DAG" → **Topological Sort**',
    'Shortest Path (BFS/Dijkstra)': '"shortest/minimum path with weights" → **Dijkstra/BFS**',
    'String Processing': '"string transformation/validation" → **String Processing**',
    'String Matching': '"find pattern in text" → **String Matching (KMP/Rabin-Karp)**',
  };
  return signals[pattern] || `"problem-specific signals" → **${pattern}**`;
}

function getInterviewTips(pattern, difficulty) {
  const tips = {
    'Two Pointers': [
      '**Clarify**: "Mảng đã sorted chưa? Có duplicate không?" / Ask if array is sorted and if duplicates exist',
      '**Brute force**: "Dùng 2 vòng for O(n²)" → optimize with two pointers O(n) / Start with nested loops, then optimize',
      '**Optimize**: "Vì mảng sorted, dùng 2 con trỏ L/R tiến vào giữa" / Since sorted, use L/R pointers moving inward',
      '**Edge cases**: "Mảng rỗng, một phần tử, tất cả giống nhau" / Empty array, single element, all same values',
    ],
    'Sliding Window': [
      '**Clarify**: "Cần contiguous subarray hay subsequence?" / Subarray (contiguous) vs subsequence (non-contiguous)',
      '**Brute force**: "Thử mọi subarray O(n²)" → optimize with sliding window O(n) / Try all subarrays then optimize',
      '**Optimize**: "Dùng window expand/shrink, track state bằng map/counter" / Use expand right, shrink left pattern',
      '**Edge cases**: "Chuỗi rỗng, k > array length, tất cả unique/duplicate" / Empty input, k exceeds length',
    ],
    'Binary Search': [
      '**Clarify**: "Input đã sorted? Cần tìm vị trí chính xác hay boundary?" / Is input sorted? Exact match or boundary?',
      '**Brute force**: "Linear scan O(n)" → optimize with binary search O(log n) / Start linear, suggest binary',
      '**Optimize**: "Chú ý lo/hi boundary: lo <= hi hay lo < hi? mid±1 hay mid?" / Watch boundary conditions carefully',
      '**Edge cases**: "Mảng rỗng, một phần tử, target không tồn tại, overflow mid" / Empty, single, not found, overflow',
    ],
    'Dynamic Programming': [
      '**Clarify**: "Cần giá trị tối ưu hay cần reconstruct solution?" / Need optimal value or actual solution path?',
      '**Brute force**: "Recursion O(2^n)" → add memoization → bottom-up DP / Start recursive, add memo, convert to iterative',
      '**State definition**: "Xác định dp[i] nghĩa là gì, transition từ đâu" / Define state clearly before coding',
      '**Edge cases**: "Base cases, n=0/1, negative values, overflow" / Check base cases and boundary values',
      '**Space optimize**: "Nếu dp[i] chỉ phụ thuộc dp[i-1] → dùng 2 biến thay vì mảng" / Roll variables if possible',
    ],
    'Backtracking': [
      '**Clarify**: "Cần all solutions hay count? Có duplicate input không?" / All results or count? Duplicate elements?',
      '**Template**: "Choose → Explore → Un-choose" / Follow the standard backtracking template',
      '**Pruning**: "Skip nếu biết sớm branch này invalid" / Prune early to avoid TLE',
      '**Edge cases**: "Input rỗng, n=0, kết quả có thể rỗng" / Empty input, n=0, possibly empty result set',
    ],
  };

  const generic = [
    '**Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer',
    '**Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize',
    '**Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it',
    '**Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values',
    '**Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?',
  ];

  return tips[pattern] || generic;
}

// ─── Extract LeetCode Slug from URL ─────────────────────────────────────
function extractSlugFromUrl(url) {
  const m = url.match(/\/problems\/([^/]+)/);
  return m ? m[1] : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

console.log('=== LeetCode Problem File Generator ===');
console.log(DRY_RUN ? '  MODE: DRY RUN (no files written)\n' : '');

// Step 1: Read all CSVs and collect unique problems
console.log('Step 1: Reading company CSVs...');
const companies = fs.readdirSync(CSV_ROOT).filter(d =>
  fs.statSync(path.join(CSV_ROOT, d)).isDirectory()
);

const problemMap = new Map(); // title → problem data

for (const company of companies) {
  const csvPath = path.join(CSV_ROOT, company, '5. All.csv');
  if (!fs.existsSync(csvPath)) continue;
  const rows = parseCSV(fs.readFileSync(csvPath, 'utf-8'));
  for (const row of rows) {
    const key = row.title;
    if (!problemMap.has(key)) {
      problemMap.set(key, {
        ...row,
        companies: [company],
      });
    } else {
      problemMap.get(key).companies.push(company);
    }
  }
}

console.log(`  Found ${problemMap.size} unique problems from ${companies.length} companies`);

// Step 2: Scan existing problem files to avoid overwriting
console.log('\nStep 2: Scanning existing problem files...');
const existingSlugs = new Set();
const existingCounts = {}; // category → max number

const categories = ['array', 'string', 'dp', 'tree-graph', 'backtracking',
  'linked-list', 'design', 'sorting-searching', 'math', 'others'];

for (const cat of categories) {
  existingCounts[cat] = 0;
  const dir = path.join(LEETCODE_ROOT, cat, 'problems');
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const m = f.match(/^(\d+)-(.+)\.md$/);
    if (m) {
      existingCounts[cat] = Math.max(existingCounts[cat], parseInt(m[1]));
      existingSlugs.add(m[2]); // e.g., "two-sum"

      // Detect hand-crafted files (they have real solution code, not TODO skeletons)
      if (!FORCE) continue;
      const content = fs.readFileSync(path.join(dir, f), 'utf-8');
      if (!content.includes("throw new Error('Not implemented')") && !content.includes('// TODO: Implement')) {
        // This is a hand-crafted file with real solutions - protect it
        PROTECTED_SLUGS.add(m[2]);
      }
    }
  }
}

console.log('  Existing file counts by category:');
for (const [cat, count] of Object.entries(existingCounts)) {
  if (count > 0) console.log(`    ${cat}: ${count} files (next: ${count + 1})`);
}
// Build slug→number map for --force mode (reuse existing numbers)
const slugToNum = {};
if (FORCE) {
  for (const cat of categories) {
    slugToNum[cat] = {};
    const dir = path.join(LEETCODE_ROOT, cat, 'problems');
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const f of files) {
      const m = f.match(/^(\d+)-(.+)\.md$/);
      if (m) slugToNum[cat][m[2]] = parseInt(m[1]);
    }
  }
}

console.log(`  Total existing slugs: ${existingSlugs.size}`);

// Step 3: Assign categories and prepare problem list
console.log('\nStep 3: Categorizing problems...');
const categoryBuckets = {};
for (const cat of categories) categoryBuckets[cat] = [];

let skippedExisting = 0;
let skippedNoSlug = 0;

for (const [title, prob] of problemMap) {
  const slug = extractSlugFromUrl(prob.link) || toSlug(title);
  if (!slug) { skippedNoSlug++; continue; }

  // Check if already exists
  if (FORCE) {
    // Only skip hand-crafted files
    if (PROTECTED_SLUGS.has(slug)) {
      skippedExisting++;
      continue;
    }
  } else {
    if (existingSlugs.has(slug)) {
      skippedExisting++;
      continue;
    }
  }

  const category = assignCategory(prob.topics);
  const pattern = detectPattern(prob.topics, title);

  categoryBuckets[category].push({
    title,
    slug,
    difficulty: prob.difficulty,
    topics: prob.topics,
    frequency: prob.frequency,
    acceptanceRate: prob.acceptanceRate,
    link: prob.link,
    companyCount: prob.companies.length,
    category,
    pattern,
  });
}

console.log(`  Skipped (already exists): ${skippedExisting}`);
console.log(`  Skipped (no slug): ${skippedNoSlug}`);
console.log('  New problems by category:');
let totalNew = 0;
for (const cat of categories) {
  // Sort by company count (frequency) descending within each category
  categoryBuckets[cat].sort((a, b) => b.companyCount - a.companyCount);
  console.log(`    ${cat}: ${categoryBuckets[cat].length}`);
  totalNew += categoryBuckets[cat].length;
}
console.log(`  Total new problems to generate: ${totalNew}`);

// Step 4: Build related problems map (by shared topics)
console.log('\nStep 4: Building related problems map...');
const topicToProblems = new Map();
for (const cat of categories) {
  for (const prob of categoryBuckets[cat]) {
    for (const topic of prob.topics) {
      if (!topicToProblems.has(topic)) topicToProblems.set(topic, []);
      topicToProblems.get(topic).push(prob);
    }
  }
}

function getRelatedProblems(prob, limit = 4) {
  const scores = new Map(); // slug → { prob, score }
  for (const topic of prob.topics) {
    const related = topicToProblems.get(topic) || [];
    for (const r of related) {
      if (r.slug === prob.slug) continue;
      if (!scores.has(r.slug)) scores.set(r.slug, { prob: r, score: 0 });
      scores.get(r.slug).score++;
    }
  }
  return [...scores.values()]
    .sort((a, b) => b.score - a.score || b.prob.companyCount - a.prob.companyCount)
    .slice(0, limit)
    .map(s => s.prob);
}

// Step 5: Generate .md files
console.log('\nStep 5: Generating problem files...');
let filesWritten = 0;

for (const cat of categories) {
  let nextNum = existingCounts[cat] + 1;
  const dir = path.join(LEETCODE_ROOT, cat, 'problems');

  // Ensure directory exists
  if (!DRY_RUN) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const prob of categoryBuckets[cat]) {
    // Reuse existing number if file already exists in --force mode
    let num;
    if (FORCE && slugToNum[cat] && slugToNum[cat][prob.slug] !== undefined) {
      num = String(slugToNum[cat][prob.slug]).padStart(2, '0');
    } else {
      num = String(nextNum).padStart(2, '0');
      nextNum++;
    }
    const filename = `${num}-${prob.slug}.md`;
    const filepath = path.join(dir, filename);

    const viTitle = translateTitle(prob.title);
    const freq = freqTier(prob.companyCount);
    const related = getRelatedProblems(prob);
    const tips = getInterviewTips(prob.pattern, prob.difficulty);

    // Build related problems section
    const relatedLines = related.length > 0
      ? related.map(r => {
          const rCat = r.category;
          const rDir = rCat === cat ? './' : `../../${rCat}/problems/`;
          // We don't know the exact number, so use LeetCode URL
          return `- [${r.title}](${r.link}) — same pattern: ${r.pattern}`;
        }).join('\n')
      : `- [See LeetCode Similar Problems](${prob.link}) — check "Similar Questions" section`;

    // Build see-also from related (first 2)
    const seeAlso = related.slice(0, 2).map(r =>
      `[${r.title}](${r.link})`
    ).join(' | ') || `[LeetCode](${prob.link})`;

    // LeetCode slug for URL
    const lcSlug = extractSlugFromUrl(prob.link) || prob.slug;

    const normDiff = normalizeDifficulty(prob.difficulty);
    const content = `---
layout: page
title: "${prob.title}"
difficulty: ${normDiff}
category: ${CATEGORY_DISPLAY[cat]}
tags: [${prob.topics.slice(0, 5).join(', ')}]
leetcode_url: "${prob.link}"
---

# ${prob.title} / ${viTitle}

> **Track**: Shared | **Difficulty**: ${diffEmoji(prob.difficulty)} | **Pattern**: ${prob.pattern}
> **Frequency**: ${freq.emoji} ${freq.tier} — ${freq.note}
> **See also**: ${seeAlso}

---

## 🧠 Intuition / Tư Duy

**Analogy:** ${getAnalogy(prob.pattern, prob.title)}

**Pattern Recognition:**

- Signal: ${getPatternSignal(prob.pattern)}
- Bài này thuộc dạng ${prob.pattern} — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — ${prob.title} example:**

${getVisualTemplate(prob.pattern)}

---

## Problem Description

${prob.title}. ([LeetCode](${prob.link}))

Difficulty: ${normDiff} | Acceptance: ${(prob.acceptanceRate * 100).toFixed(1)}%

\`\`\`
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
\`\`\`

Constraints:
- See [LeetCode problem page](${prob.link}) for full constraints

---

## 📝 Interview Tips

${tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}

---

## Solutions

\`\`\`typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function ${toCamelCase(prob.slug)}BruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — ${prob.pattern}
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function ${toCamelCase(prob.slug)}(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using ${prob.pattern}
  // Hint: ${getOptimizationHint(prob.pattern)}
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(${toCamelCase(prob.slug)}(/* example 1 */)); // expected
// console.log(${toCamelCase(prob.slug)}(/* example 2 */)); // expected
// console.log(${toCamelCase(prob.slug)}(/* edge case */)); // expected
\`\`\`

---

## 🔗 Related Problems

${relatedLines}
- [${prob.title} — LeetCode](${prob.link}) — problem page
`;

    if (!DRY_RUN) {
      fs.writeFileSync(filepath, content);
    }
    filesWritten++;
    nextNum++;
  }
}

console.log(`\n✅ Done! Generated ${filesWritten} problem files.`);
if (DRY_RUN) console.log('   (DRY RUN — no files actually written)');

// Summary
console.log('\n=== Summary ===');
for (const cat of categories) {
  const count = categoryBuckets[cat].length;
  if (count > 0) {
    console.log(`  ${cat}: ${count} new files (${existingCounts[cat]} existed → ${existingCounts[cat] + count} total)`);
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────
function toCamelCase(slug) {
  return slug.split('-').map((w, i) =>
    i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
  ).join('');
}

function getOptimizationHint(pattern) {
  const hints = {
    'Two Pointers': 'Use L/R pointers on sorted input, move based on comparison',
    'Sliding Window': 'Expand right pointer, shrink left when constraint violated',
    'Binary Search': 'Define search space, determine which half to discard',
    'Dynamic Programming': 'Define dp state, find transition, optimize space if possible',
    'DFS': 'Use recursion or stack, track visited nodes',
    'BFS': 'Use queue, process level by level',
    'Backtracking': 'Choose → Explore → Unchoose, prune invalid branches early',
    'Tree Traversal': 'Choose traversal order based on what info you need',
    'Graph': 'Build adjacency list, choose BFS/DFS based on requirement',
    'Linked List': 'Use dummy head, slow/fast pointers, or prev tracking',
    'Stack': 'Push/pop to maintain invariant, process when stack condition changes',
    'Monotonic Stack': 'Maintain monotonic property, pop when new element breaks it',
    'Heap / Priority Queue': 'Use min/max heap to efficiently track k-th element',
    'Greedy': 'Sort by key metric, make locally optimal choice at each step',
    'Hash Map': 'Store seen values for O(1) lookup of complement/match',
    'Sorting': 'Sort first, then use property of sorted order',
    'Divide and Conquer': 'Split in half, solve recursively, merge results',
    'Bit Manipulation': 'Use XOR, AND, OR, shift operations on bits',
    'Math': 'Find mathematical pattern or formula',
    'Union Find': 'Use union-find with path compression and union by rank',
    'Trie': 'Build trie from dictionary, search by prefix',
    'Design': 'Choose right data structure combination for required operations',
    'Prefix Sum': 'Build prefix sum array, query range sum in O(1)',
    'Topological Sort': 'Use in-degree counting or DFS post-order',
  };
  return hints[pattern] || 'Identify the key insight that reduces complexity';
}
