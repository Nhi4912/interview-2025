# Data Structures Theory — Lý thuyết Cấu trúc Dữ liệu

> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `fe-track/09-advanced-topics/01-data-structures-js.md`, `be-track/01-golang/06-data-structures-go.md`

---

## 0. Learning Goals

- Hiểu bản chất của từng cấu trúc dữ liệu thay vì học thuộc công thức.
- Biết chọn cấu trúc phù hợp theo pattern truy cập dữ liệu trong bài toán thực tế.
- Đọc và giải thích được độ phức tạp thời gian/không gian trong interview.
- Kết nối giữa lý thuyết và ứng dụng FE/BE: UI state, cache, indexing, scheduler, graph traversal.
- Có khả năng trade-off khi interviewer thay đổi ràng buộc (memory, latency, throughput, scale).

---

## 1. Arrays (Linear Structures)

### Definition
- Mảng là cấu trúc lưu phần tử liên tiếp trong bộ nhớ (contiguous memory), cho phép truy cập ngẫu nhiên theo chỉ số.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Access by index | O(1) | Dùng phép toán địa chỉ base + i * size. |
| Search (unsorted) | O(n) | Phải duyệt tuần tự. |
| Search (sorted + binary search) | O(log n) | Yêu cầu dữ liệu đã sắp xếp. |
| Insert at end (dynamic array) | Amortized O(1) | Thỉnh thoảng resize nên có lần O(n). |
| Insert/Delete at middle | O(n) | Cần dịch chuyển phần tử. |

### Use Cases
- Lưu danh sách cần truy cập ngẫu nhiên nhanh: bảng điểm, pixel buffer, vector dữ liệu.
- Dùng làm nền tảng cho heap, hash table (bucket array), dynamic programming table.
- Trong FE, mảng phổ biến để render list và thao tác immutable update.

### Pseudocode (Language-agnostic)
```text
function pushDynamicArray(arr, size, capacity, x):
    if size == capacity:
        newCapacity = capacity * 2
        newArr = allocate(newCapacity)
        copy(arr, newArr, size)
        arr = newArr
        capacity = newCapacity
    arr[size] = x
    size = size + 1
    return arr, size, capacity
```

### Interview Q&A

### 🟢 Q: Why is array random access O(1)? `[Junior]`
**A:** Vì địa chỉ của phần tử i được tính trực tiếp bằng công thức địa chỉ, không cần duyệt qua các phần tử trước đó.

### 🟡 Q: What does amortized O(1) append mean? `[Mid]`
**A:** Nghĩa là trung bình trên chuỗi dài thao tác thêm phần tử thì chi phí mỗi lần gần O(1), dù một số lần resize tốn O(n).

### 🔴 Q: When can array be worse than linked list? `[Senior]`
**A:** Khi phải chèn/xóa thường xuyên ở đầu hoặc giữa, mảng cần dịch chuyển nhiều phần tử nên tệ hơn linked list.

---

## 2. Linked Lists (Linear Structures)

### Definition
- Linked list gồm các node rời rạc trong bộ nhớ, mỗi node giữ dữ liệu và con trỏ tới node kế tiếp (và có thể node trước).

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Access by index | O(n) | Phải đi từ head qua từng node. |
| Insert/Delete at head | O(1) | Chỉ cập nhật con trỏ đầu. |
| Insert/Delete after known node | O(1) | Không cần dịch chuyển phần tử. |
| Search | O(n) | Không có random access. |
| Space overhead | O(n) + pointer cost | Mỗi node tốn thêm bộ nhớ cho pointer. |

### Use Cases
- Implement stack/queue đơn giản.
- Doubly linked list dùng cho LRU cache khi cần move-to-front O(1).
- Circular list cho round-robin scheduling hoặc playlist vòng lặp.

### Pseudocode (Language-agnostic)
```text
function deleteAfter(node):
    if node == null or node.next == null:
        return
    target = node.next
    node.next = target.next
    free(target)
```

### Interview Q&A

### 🟢 Q: What is the key advantage of linked list over array? `[Junior]`
**A:** Ưu điểm chính là chèn/xóa tại vị trí đã biết có thể O(1) vì chỉ đổi liên kết, không phải dồn phần tử.

### 🟡 Q: Singly vs doubly linked list trade-off? `[Mid]`
**A:** Doubly list xóa node thuận tiện hơn và duyệt hai chiều, nhưng tốn thêm bộ nhớ và cập nhật pointer phức tạp hơn.

### 🔴 Q: Why linked list is cache-unfriendly? `[Senior]`
**A:** Vì node nằm rải rác trong RAM, CPU khó prefetch liên tục như mảng nên cache miss nhiều hơn.

---

## 3. Stacks (Linear Structures)

### Definition
- Stack tuân theo nguyên tắc LIFO (Last In, First Out): phần tử vào sau ra trước.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Push | O(1) | Thêm phần tử lên đỉnh stack. |
| Pop | O(1) | Lấy phần tử ở đỉnh ra. |
| Top/Peek | O(1) | Xem phần tử đỉnh không xóa. |
| Search | O(n) | Không tối ưu cho tìm kiếm ngẫu nhiên. |
| Space | O(n) | Lưu tối đa n phần tử. |

### Use Cases
- Call stack của chương trình.
- Undo/redo trong editor.
- DFS iterative, kiểm tra ngoặc hợp lệ, expression evaluation.

### Pseudocode (Language-agnostic)
```text
function isBalancedParentheses(s):
    st = empty stack
    for ch in s:
        if ch in "([{": push(st, ch)
        else:
            if empty(st): return false
            open = pop(st)
            if not match(open, ch): return false
    return empty(st)
```

### Interview Q&A

### 🟢 Q: Why stack is suitable for DFS? `[Junior]`
**A:** DFS cần quay lui theo thứ tự ngược lại các bước đã đi, đúng với cơ chế LIFO của stack.

### 🟡 Q: How does undo system use stacks? `[Mid]`
**A:** Mỗi thao tác push vào undo stack; khi undo thì pop từ undo và push sang redo stack.

### 🔴 Q: Recursive call stack vs explicit stack? `[Senior]`
**A:** Call stack do runtime quản lý và có nguy cơ stack overflow; explicit stack chủ động hơn, dễ kiểm soát memory.

---

## 4. Queues (Linear Structures)

### Definition
- Queue tuân theo FIFO (First In, First Out): phần tử vào trước ra trước.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Enqueue | O(1) | Thêm phần tử vào cuối hàng đợi. |
| Dequeue | O(1) | Lấy phần tử ở đầu hàng đợi. |
| Front/Peek | O(1) | Xem phần tử đầu. |
| Circular queue | O(1) | Tận dụng mảng vòng để tránh dồn dữ liệu. |
| Deque operations | O(1) | Thêm/xóa ở cả hai đầu. |

### Use Cases
- BFS trên graph/tree.
- Job scheduling, message queue, rate limiting window.
- Priority queue mở rộng queue với ưu tiên thay vì FIFO thuần.

### Pseudocode (Language-agnostic)
```text
function enqueueCircular(q, x):
    if q.size == q.capacity: error("full")
    q.arr[q.tail] = x
    q.tail = (q.tail + 1) mod q.capacity
    q.size = q.size + 1

function dequeueCircular(q):
    if q.size == 0: error("empty")
    x = q.arr[q.head]
    q.head = (q.head + 1) mod q.capacity
    q.size = q.size - 1
    return x
```

### Interview Q&A

### 🟢 Q: When to use queue instead of stack? `[Junior]`
**A:** Khi bài toán cần xử lý theo thứ tự đến trước làm trước như BFS hoặc xử lý request tuần tự.

### 🟡 Q: Why circular queue is better than shifting array queue? `[Mid]`
**A:** Vì không cần dồn phần tử sau mỗi dequeue, tránh chi phí O(n) và giảm lãng phí CPU.

### 🔴 Q: Deque vs two stacks queue implementation? `[Senior]`
**A:** Deque hỗ trợ hai đầu trực tiếp; queue bằng hai stack tối ưu amortized O(1) nhưng có đợt chuyển phần tử O(n).

---

## 5. Hash Tables (Hash-Based Structures)

### Definition
- Hash table ánh xạ key thành chỉ số mảng thông qua hash function để tìm kiếm/chèn/xóa trung bình O(1).

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Insert/Search/Delete (average) | O(1) | Phụ thuộc hash function và load factor tốt. |
| Insert/Search/Delete (worst) | O(n) | Xảy ra khi collision nặng. |
| Resize/Rehash | O(n) | Khi vượt ngưỡng load factor. |
| Space | O(n) | Cần bucket array + phần tử. |
| Collision handling | Chaining/Open addressing | Hai nhóm kỹ thuật chính. |

### Use Cases
- Caching, counting frequency, deduplication, symbol table.
- Backend lookup nhanh theo key: sessionId, userId, feature flags.
- Frontend memoization map cho tính toán lặp lại.

### Pseudocode (Language-agnostic)
```text
function put(table, key, value):
    idx = hash(key) mod table.capacity
    bucket = table.buckets[idx]
    for pair in bucket:
        if pair.key == key:
            pair.value = value
            return
    append(bucket, (key, value))
    table.size += 1
    if table.size / table.capacity > 0.75:
        resizeAndRehash(table)
```

### Interview Q&A

### 🟢 Q: Explain how hash table handles collisions `[Junior]`
**A:** Collision xảy ra khi nhiều key rơi vào cùng bucket. Có thể dùng chaining (danh sách tại bucket) hoặc open addressing (tìm ô trống khác).

### 🟡 Q: Chaining vs open addressing? `[Mid]`
**A:** Chaining đơn giản và xóa dễ, nhưng tốn pointer; open addressing tiết kiệm bộ nhớ hơn nhưng nhạy với load factor và clustering.

### 🔴 Q: How to choose load factor threshold? `[Senior]`
**A:** Thường 0.6-0.8 tùy chiến lược. Ngưỡng thấp giảm collision nhưng tăng memory; ngưỡng cao tiết kiệm memory nhưng tăng latency lookup.

---

## 6. Hash Sets (Hash-Based Structures)

### Definition
- Hash set là tập hợp phần tử duy nhất, thường cài đặt bằng hash table chỉ lưu key (không cần value riêng).

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Add | Average O(1) | Thêm nếu chưa tồn tại. |
| Contains | Average O(1) | Kiểm tra membership. |
| Remove | Average O(1) | Xóa phần tử. |
| Worst case operations | O(n) | Khi collision nặng. |
| Space | O(n) | Lưu n key và bucket. |

### Use Cases
- Loại trùng dữ liệu.
- Kiểm tra phần tử đã thấy trong graph traversal.
- Set operations: union/intersection/difference.

### Pseudocode (Language-agnostic)
```text
function hasDuplicate(arr):
    seen = empty hashset
    for x in arr:
        if contains(seen, x):
            return true
        add(seen, x)
    return false
```

### Interview Q&A

### 🟢 Q: Why hash set ensures uniqueness? `[Junior]`
**A:** Vì key là định danh duy nhất trong hash table; thêm lại key cũ chỉ cập nhật trạng thái tồn tại chứ không tạo bản sao.

### 🟡 Q: Set vs list for membership check? `[Mid]`
**A:** List cần O(n), hash set trung bình O(1), phù hợp khi kiểm tra tồn tại lặp đi lặp lại.

### 🔴 Q: When hash set may underperform? `[Senior]`
**A:** Khi hash function kém, dữ liệu quá skew hoặc cần thứ tự ổn định; khi đó có thể chọn tree set hoặc sorted array.

---

## 7. Hash Maps (Hash-Based Structures)

### Definition
- Hash map lưu cặp key-value để ánh xạ nhanh từ khóa sang dữ liệu liên quan.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Put/Get/Delete (average) | O(1) | Độ trễ thấp khi hash phân bố tốt. |
| Iterate all pairs | O(n) | Duyệt toàn bộ bản đồ. |
| Resize | O(n) | Rehash toàn bộ key. |
| Ordered iteration | Depends | Hash map thường không đảm bảo thứ tự. |
| Space | O(n) | Bao gồm overhead bucket. |

### Use Cases
- Index user by ID.
- Tần suất từ vựng trong NLP/search.
- Caching object theo key composite.

### Pseudocode (Language-agnostic)
```text
function frequencyMap(tokens):
    freq = empty hashmap
    for t in tokens:
        freq[t] = getOrDefault(freq, t, 0) + 1
    return freq
```

### Interview Q&A

### 🟢 Q: When would you use a hash map vs a BST? `[Junior]`
**A:** Hash map ưu tiên lookup trung bình O(1). BST phù hợp khi cần dữ liệu có thứ tự và truy vấn range.

### 🟡 Q: Why hash map iteration order is unstable? `[Mid]`
**A:** Vì phần tử phân bố theo bucket/hash seed, không theo thứ tự key chèn hoặc key sort mặc định.

### 🔴 Q: How to design composite key safely? `[Senior]`
**A:** Chuẩn hóa field, định nghĩa hash/equality nhất quán, tránh mutable key để không mất khả năng truy xuất.

---

## 8. Binary Tree (Tree Structures)

### Definition
- Binary tree là cây mà mỗi node có tối đa 2 con: left và right.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Traversal (DFS/BFS) | O(n) | Phải thăm mỗi node ít nhất một lần. |
| Height computation | O(n) | Duyệt để tìm đường dài nhất. |
| Search (generic tree) | O(n) | Không có thuộc tính sắp xếp như BST. |
| Insert (generic) | Depends | Không có quy tắc duy nhất nếu không phải BST/heap. |
| Space | O(n) | Lưu toàn bộ node + pointer. |

### Use Cases
- Biểu diễn cấu trúc phân cấp (AST, DOM abstract, decision tree).
- Nền tảng cho BST, AVL, Red-Black, heap (dạng gần hoàn chỉnh).
- Bài toán đệ quy chia để trị tự nhiên trên cây.

### Pseudocode (Language-agnostic)
```text
function inorder(node):
    if node == null: return
    inorder(node.left)
    visit(node.value)
    inorder(node.right)
```

### Interview Q&A

### 🟢 Q: Define depth and height in a binary tree `[Junior]`
**A:** Depth của node là số cạnh từ root đến node. Height của node là số cạnh dài nhất từ node xuống leaf.

### 🟡 Q: What is a balanced tree conceptually? `[Mid]`
**A:** Là cây có chiều cao không lệch quá nhiều giữa các nhánh, giúp các thao tác gần O(log n).

### 🔴 Q: Why skewed binary tree is problematic? `[Senior]`
**A:** Vì chiều cao tăng tới O(n), khiến tìm kiếm/chèn/xóa suy giảm giống linked list.

---

## 9. Binary Search Tree (BST) (Tree Structures)

### Definition
- BST duy trì bất biến: mọi key ở left subtree < node.key < mọi key ở right subtree.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Search/Insert/Delete (average) | O(log n) | Khi cây tương đối cân bằng. |
| Search/Insert/Delete (worst) | O(n) | Khi cây lệch hoàn toàn. |
| Inorder traversal | O(n) | Cho kết quả key tăng dần. |
| Min/Max | O(h) | Đi hết trái/phải. |
| Space | O(n) | Node + pointer. |

### Use Cases
- Dữ liệu cần giữ thứ tự và hỗ trợ range query.
- Giải bài toán predecessor/successor.
- Làm nền để hiểu balanced BST (AVL/RB tree).

### Pseudocode (Language-agnostic)
```text
function searchBST(root, key):
    cur = root
    while cur != null:
        if key == cur.key: return cur
        if key < cur.key: cur = cur.left
        else: cur = cur.right
    return null
```

### Interview Q&A

### 🟢 Q: Why inorder traversal of BST is sorted? `[Junior]`
**A:** Do bất biến BST: trái nhỏ hơn node, phải lớn hơn node; duyệt Left-Node-Right sẽ ra thứ tự tăng.

### 🟡 Q: How to delete a node with two children in BST? `[Mid]`
**A:** Thường thay bằng inorder successor (nhỏ nhất bên phải) hoặc predecessor rồi xóa node thay thế.

### 🔴 Q: BST vs hash map in production systems? `[Senior]`
**A:** BST hữu ích cho range query và thứ tự; hash map vượt trội cho point lookup nhưng không hỗ trợ range tốt.

---

## 10. AVL Tree (Tree Structures)

### Definition
- AVL là BST tự cân bằng, giữ |height(left)-height(right)| <= 1 tại mọi node.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Search/Insert/Delete | O(log n) | Đảm bảo chiều cao logarit. |
| Rotations | O(1) | LL, RR, LR, RL để cân bằng lại cục bộ. |
| Rebalancing path | O(log n) | Cập nhật balance factor từ node mới lên root. |
| Space | O(n) | Mỗi node lưu thêm height/balance factor. |
| Worst-case height | O(log n) | Chặt hơn so với Red-Black tree. |

### Use Cases
- Hệ thống cần truy vấn rất nhanh và ổn định độ sâu.
- Read-heavy workload nơi lookup quan trọng hơn insert burst.
- Bài toán in-memory index có yêu cầu deterministic latency.

### Pseudocode (Language-agnostic)
```text
function rebalance(node):
    updateHeight(node)
    bf = height(node.left) - height(node.right)
    if bf > 1:
        if height(node.left.left) >= height(node.left.right):
            return rotateRight(node)    // LL
        else:
            node.left = rotateLeft(node.left) // LR
            return rotateRight(node)
    if bf < -1:
        if height(node.right.right) >= height(node.right.left):
            return rotateLeft(node)     // RR
        else:
            node.right = rotateRight(node.right) // RL
            return rotateLeft(node)
    return node
```

### Interview Q&A

### 🟢 Q: What does AVL balance factor represent? `[Junior]`
**A:** Là chênh lệch chiều cao giữa cây con trái và phải của một node, dùng để phát hiện mất cân bằng.

### 🟡 Q: Explain LL, RR, LR, RL rotations `[Mid]`
**A:** Đó là 4 pattern mất cân bằng và cách xoay đơn/kép để đưa cây về trạng thái cân bằng.

### 🔴 Q: When would AVL outperform Red-Black tree? `[Senior]`
**A:** Khi workload thiên về đọc nhiều, AVL giữ cây cân bằng chặt hơn nên lookup có thể nhanh hơn một chút.

---

## 11. Red-Black Tree (Tree Structures)

### Definition
- Red-Black tree là BST tự cân bằng với node màu đỏ/đen và tập quy tắc giúp chiều cao gần logarit.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Search/Insert/Delete | O(log n) | Chiều cao được khống chế bởi invariants màu. |
| Rotations + recoloring | O(1) mỗi bước | Fix-up sau insert/delete. |
| Worst-case height | <= 2*log2(n+1) | Ít chặt hơn AVL nhưng cập nhật thường nhẹ hơn. |
| Space | O(n) | Mỗi node thêm 1 bit màu. |
| Ordered operations | O(log n) | Giữ thứ tự key như BST. |

### Use Cases
- TreeMap/TreeSet trong nhiều ngôn ngữ.
- std::map / std::set trong C++ (implementation phổ biến).
- Kernel scheduler structures và ordered dictionary.

### Pseudocode (Language-agnostic)
```text
Red-Black Properties:
1) Mỗi node là đỏ hoặc đen
2) Root luôn đen
3) Node đỏ không có con đỏ (không có hai đỏ liên tiếp)
4) Mọi đường từ node đến NIL leaf có cùng số node đen (black-height)
5) NIL leaf là đen

Insert fix-up (high-level):
while parent(node) is RED:
    if uncle(node) is RED: recolor and move up
    else: rotate (LL/LR/RR/RL equivalent) and recolor
root.color = BLACK
```

### Interview Q&A

### 🟢 Q: Why Red-Black tree remains balanced enough? `[Junior]`
**A:** Vì các quy tắc màu giới hạn đường đi dài nhất không vượt quá khoảng 2 lần đường ngắn nhất.

### 🟡 Q: Explain Red-Black tree balancing `[Mid]`
**A:** Sau insert/delete, cây dùng recolor và rotation để khôi phục các invariant màu mà không cần cân bằng tuyệt đối như AVL.

### 🔴 Q: Why many libraries choose Red-Black over AVL? `[Senior]`
**A:** Do trade-off cập nhật tốt và cài đặt thực dụng: số lần xoay thường ít hơn AVL trong workload ghi nhiều.

---

## 12. B-Tree / B+Tree (Tree Structures)

### Definition
- B-Tree và B+Tree là cây nhiều nhánh (high fanout) tối ưu cho lưu trữ đĩa, giảm số lần I/O bằng chiều cao rất thấp.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Search | O(log_f n) | f là fanout lớn nên số tầng nhỏ. |
| Insert/Delete | O(log_f n) | Có split/merge node theo block. |
| Range scan (B+Tree) | O(log_f n + k) | Lá liên kết giúp duyệt tuần tự tốt. |
| Disk I/O | Rất ít | Mỗi node thường khớp page size (4KB/8KB...). |
| Space | Hiệu quả theo page | Tối ưu block utilization. |

### Use Cases
- Index trong RDBMS (MySQL/InnoDB, PostgreSQL variants).
- File systems metadata indexing.
- B+Tree rất mạnh cho truy vấn phạm vi và ORDER BY.

### Pseudocode (Language-agnostic)
```text
function bPlusTreeSearch(root, key):
    node = root
    while node is internal:
        i = findChildIndex(node.keys, key)
        node = node.children[i]
    return binarySearch(node.keys, key)
```

### Interview Q&A

### 🟢 Q: Why B+Tree is common in databases? `[Junior]`
**A:** Vì fanout lớn làm cây thấp, giảm I/O; đồng thời leaf linked list giúp range scan rất hiệu quả.

### 🟡 Q: B-Tree vs B+Tree difference? `[Mid]`
**A:** B-Tree có thể lưu data ở node trong; B+Tree thường lưu data ở lá, node trong chỉ giữ key/index.

### 🔴 Q: How does B+Tree optimize for disk I/O? `[Senior]`
**A:** Node kích thước theo page, truy cập theo block liên tục, chiều cao thấp và scan lá tuần tự giảm random read.

---

## 13. Trie (Prefix Tree) (Tree Structures)

### Definition
- Trie là cây tiền tố cho chuỗi, mỗi cạnh đại diện một ký tự/bit giúp thao tác theo prefix nhanh.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Insert word | O(L) | L là độ dài chuỗi. |
| Search exact word | O(L) | Duyệt theo ký tự. |
| StartsWith prefix | O(P) | P là độ dài prefix. |
| Delete word | O(L) | Có thể cần dọn node rác. |
| Space | Lớn hơn hash map đơn | Đánh đổi memory để lấy prefix query nhanh. |

### Use Cases
- Autocomplete/search suggestion.
- Dictionary, spell-check, route matching.
- IP routing (bitwise trie) cho longest prefix match.

### Pseudocode (Language-agnostic)
```text
function startsWith(trie, prefix):
    node = trie.root
    for ch in prefix:
        if ch not in node.children:
            return false
        node = node.children[ch]
    return true
```

### Interview Q&A

### 🟢 Q: How does a trie optimize prefix search? `[Junior]`
**A:** Trie đi theo từng ký tự của prefix nên chỉ tốn O(P), không cần duyệt toàn bộ từ điển.

### 🟡 Q: Trie vs hash map for dictionary lookup? `[Mid]`
**A:** Hash map tốt cho exact match, trie vượt trội khi cần prefix, autocomplete, và gợi ý theo tiền tố.

### 🔴 Q: How to reduce trie memory usage? `[Senior]`
**A:** Dùng compressed trie/radix tree, lưu edge string thay vì từng ký tự, hoặc dùng bitmap/array compact.

---

## 14. Min-Heap / Max-Heap (Heap Structures)

### Definition
- Heap là cây nhị phân gần hoàn chỉnh, biểu diễn bằng mảng, thỏa heap property (min hoặc max ở root).

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Peek min/max | O(1) | Root luôn là phần tử ưu tiên nhất. |
| Insert | O(log n) | Thêm cuối rồi sift-up. |
| Extract min/max | O(log n) | Đổi root với cuối rồi sift-down. |
| Build heap (heapify) | O(n) | Từ mảng chưa sắp xếp. |
| Search arbitrary value | O(n) | Heap không hỗ trợ search tổng quát tốt. |

### Use Cases
- Priority queue cho scheduler/task processing.
- K-smallest/k-largest, median stream (hai heap).
- Heap sort (in-place, O(n log n)).

### Pseudocode (Language-agnostic)
```text
function siftDown(arr, i, n):
    while true:
        left = 2*i + 1
        right = 2*i + 2
        smallest = i
        if left < n and arr[left] < arr[smallest]: smallest = left
        if right < n and arr[right] < arr[smallest]: smallest = right
        if smallest == i: break
        swap(arr[i], arr[smallest])
        i = smallest
```

### Interview Q&A

### 🟢 Q: Why heap uses array representation? `[Junior]`
**A:** Vì cây gần hoàn chỉnh nên quan hệ cha-con tính được qua chỉ số mảng, không cần pointer node.

### 🟡 Q: Why build-heap is O(n) not O(n log n)? `[Mid]`
**A:** Do tổng chi phí sift-down theo mức cây hội tụ về O(n), không phải mọi phần tử đều đi log n bước.

### 🔴 Q: Heap vs BST for priority operations? `[Senior]`
**A:** Heap tốt hơn cho extract-min/max liên tục; BST tốt hơn khi cần ordered traversal hoặc search key bất kỳ.

---

## 15. Priority Queue (Heap Structures)

### Definition
- Priority queue là ADT lấy phần tử theo độ ưu tiên cao nhất/thấp nhất, thường cài đặt bằng heap.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Push | O(log n) | Chèn phần tử với priority. |
| Pop highest/lowest priority | O(log n) | Lấy phần tử ưu tiên nhất. |
| Peek | O(1) | Xem phần tử ưu tiên nhất. |
| Update priority | O(log n) or more | Cần biết vị trí để decrease/increase key hiệu quả. |
| Space | O(n) | Lưu n phần tử. |

### Use Cases
- Dijkstra/A* shortest path.
- CPU/task scheduling.
- Rate limiter theo thời điểm hết hạn (min-heap timestamp).

### Pseudocode (Language-agnostic)
```text
function processJobs(jobs):
    pq = empty minHeap by jobs.priority
    for job in jobs: push(pq, job)
    while not empty(pq):
        job = pop(pq)
        execute(job)
```

### Interview Q&A

### 🟢 Q: Is priority queue same as normal queue? `[Junior]`
**A:** Không. Queue thường FIFO, còn priority queue lấy theo độ ưu tiên, có thể bỏ qua thứ tự đến.

### 🟡 Q: Why Dijkstra needs priority queue? `[Mid]`
**A:** Để luôn chọn node có khoảng cách tạm thời nhỏ nhất tiếp theo một cách hiệu quả.

### 🔴 Q: How to support decrease-key efficiently? `[Senior]`
**A:** Cần index map từ item -> heap index hoặc dùng cấu trúc khác như Fibonacci heap trong lý thuyết.

---

## 16. Fibonacci Heap (Mention) (Heap Structures)

### Definition
- Fibonacci heap là cấu trúc heap nâng cao với một số thao tác amortized rất tốt (đặc biệt decrease-key).

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Insert | Amortized O(1) | Nối root list. |
| Find-min | O(1) | Giữ con trỏ min. |
| Decrease-key | Amortized O(1) | Cắt node và cascading cut. |
| Extract-min | Amortized O(log n) | Consolidate cây theo degree. |
| Implementation complexity | High | Khó code và constant factor cao. |

### Use Cases
- Lý thuyết tối ưu thuật toán đồ thị như Dijkstra với nhiều decrease-key.
- Hiếm dùng trực tiếp trong production do độ phức tạp cài đặt.
- Dùng để phân tích upper-bound trong môn giải thuật nâng cao.

### Pseudocode (Language-agnostic)
```text
Note: thường chỉ cần nắm ý tưởng amortized, không yêu cầu code đầy đủ trong interview phổ thông.
```

### Interview Q&A

### 🟢 Q: Do we commonly implement Fibonacci heap in interviews? `[Junior]`
**A:** Thường không; đa số interview chỉ cần biết khi nào cấu trúc này cải thiện độ phức tạp lý thuyết.

### 🟡 Q: Why can Fibonacci heap speed up Dijkstra theoretically? `[Mid]`
**A:** Vì decrease-key amortized O(1), giúp giảm tổng chi phí khi relax cạnh rất nhiều.

### 🔴 Q: Why still rarely used in production? `[Senior]`
**A:** Constant factor cao, code phức tạp, khó debug; binary heap thường nhanh hơn trong thực tế dữ liệu vừa và lớn.

---

## 17. Graph Representations (Graph Structures)

### Definition
- Graph gồm tập đỉnh (vertices) và cạnh (edges), có thể có hướng/vô hướng, trọng số/không trọng số.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Adjacency matrix space | O(V^2) | Truy cập cạnh O(1), tốn bộ nhớ khi graph thưa. |
| Adjacency list space | O(V + E) | Tiết kiệm cho graph thưa. |
| Iterate neighbors (matrix) | O(V) | Duyệt cả hàng. |
| Iterate neighbors (list) | O(deg(v)) | Theo số cạnh kề thực tế. |
| Edge existence check | Matrix O(1), List O(deg(v)) | Tùy biểu diễn. |

### Use Cases
- Social network, routing, dependency graph, build system DAG.
- Road map, recommendation graph, fraud detection network.
- Model workflow/state machine có hướng.

### Pseudocode (Language-agnostic)
```text
function bfs(start, graph):
    visited = hashset()
    q = queue()
    add(visited, start)
    enqueue(q, start)
    while not empty(q):
        u = dequeue(q)
        visit(u)
        for v in graph.neighbors(u):
            if v not in visited:
                add(visited, v)
                enqueue(q, v)
```

### Interview Q&A

### 🟢 Q: Adjacency matrix vs adjacency list trade-off? `[Junior]`
**A:** Matrix truy cập cạnh O(1) nhưng tốn O(V^2) bộ nhớ; list tiết kiệm cho graph thưa và duyệt hàng xóm hiệu quả hơn.

### 🟡 Q: Directed vs undirected graph meaning? `[Mid]`
**A:** Directed edge có chiều u->v; undirected edge biểu diễn quan hệ hai chiều u-v.

### 🔴 Q: What are connected, cyclic, bipartite, DAG? `[Senior]`
**A:** Connected: liên thông; cyclic: có chu trình; bipartite: tô 2 màu không kề cùng màu; DAG: graph có hướng không chu trình.

---

## 18. Skip List (Advanced Structures)

### Definition
- Skip list là danh sách nhiều tầng với liên kết "nhảy" được tạo ngẫu nhiên, đạt kỳ vọng O(log n) cho search/insert/delete.

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Search (expected) | O(log n) | Nhảy qua nhiều node ở tầng cao. |
| Insert/Delete (expected) | O(log n) | Cập nhật nhiều level theo random height. |
| Worst-case | O(n) | Xác suất thấp khi phân tầng xấu. |
| Space | O(n) | Overhead con trỏ nhiều tầng. |
| Implementation | Moderate | Đơn giản hơn balanced tree ở một số ngữ cảnh. |

### Use Cases
- Redis sorted sets (một implementation cốt lõi).
- Ordered set/map với code đơn giản hơn tree rotations.
- Concurrent-friendly trong một số hệ thống lock-free.

### Pseudocode (Language-agnostic)
```text
function randomLevel(p=0.5, maxLevel):
    lvl = 1
    while random() < p and lvl < maxLevel:
        lvl += 1
    return lvl
```

### Interview Q&A

### 🟢 Q: Why skip list can be O(log n) on average? `[Junior]`
**A:** Vì tầng cao chứa ít node hơn theo xác suất, giúp bỏ qua nhiều phần tử mỗi bước.

### 🟡 Q: Skip list vs balanced BST? `[Mid]`
**A:** Skip list dễ cài đặt và mở rộng concurrent hơn, BST có worst-case guarantee chặt hơn khi tự cân bằng.

### 🔴 Q: When skip list is preferable in systems design? `[Senior]`
**A:** Khi cần ordered structure với code đơn giản, cập nhật thường xuyên, và chấp nhận kỳ vọng xác suất thay vì ràng buộc cứng.

---

## 19. Bloom Filter (Advanced Structures)

### Definition
- Bloom filter là cấu trúc xác suất để kiểm tra membership với false positive có thể xảy ra nhưng không có false negative (nếu không xóa).

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Add | O(k) | Set k bit theo k hash function. |
| Query | O(k) | Kiểm tra k bit đều là 1 hay không. |
| False negatives | No | Phần tử đã thêm sẽ không bị báo vắng. |
| False positives | Yes | Có thể báo có dù chưa thêm. |
| Space | Rất tiết kiệm | Đổi lại mất tính chính xác tuyệt đối. |

### Use Cases
- Cache penetration protection (kiểm tra nhanh key chắc chắn không tồn tại).
- Web crawler URL seen-check.
- Distributed systems pre-check trước khi query storage đắt đỏ.

### Pseudocode (Language-agnostic)
```text
function bloomQuery(filter, key):
    for h in filter.hashFunctions:
        idx = h(key) mod filter.m
        if filter.bits[idx] == 0:
            return "definitely not present"
    return "possibly present"
```

### Interview Q&A

### 🟢 Q: When would you use a Bloom filter? `[Junior]`
**A:** Khi cần kiểm tra tồn tại nhanh với memory nhỏ và chấp nhận một tỷ lệ false positive.

### 🟡 Q: How to control false positive rate? `[Mid]`
**A:** Điều chỉnh kích thước bit array m, số hash k, và số phần tử dự kiến n; có công thức tối ưu k ~ (m/n)ln2.

### 🔴 Q: Why Bloom filter is useful in high-scale systems? `[Senior]`
**A:** Nó giảm truy vấn vô ích đến DB/remote service, tiết kiệm I/O và độ trễ ở lưu lượng lớn.

---

## 20. Union-Find (Disjoint Set) (Advanced Structures)

### Definition
- Union-Find quản lý các tập rời nhau với hai thao tác chính: find(x) và union(x, y).

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Find with path compression | Amortized near O(1) | Thường ký hiệu O(α(n)). |
| Union by rank/size | Amortized near O(1) | Giữ cây đại diện thấp. |
| Connectivity query | Amortized near O(1) | So sánh root đại diện. |
| Initialization | O(n) | Mỗi phần tử là cha của chính nó. |
| Space | O(n) | Mảng parent + rank/size. |

### Use Cases
- Kruskal MST.
- Dynamic connectivity trong mạng xã hội/cluster.
- Grouping, account merge, island counting offline.

### Pseudocode (Language-agnostic)
```text
function find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])   // path compression
    return parent[x]

function union(a, b):
    ra = find(a); rb = find(b)
    if ra == rb: return
    if rank[ra] < rank[rb]: parent[ra] = rb
    else if rank[ra] > rank[rb]: parent[rb] = ra
    else: parent[rb] = ra; rank[ra] += 1
```

### Interview Q&A

### 🟢 Q: What problem does Union-Find solve best? `[Junior]`
**A:** Nó rất mạnh cho bài toán kiểm tra hai phần tử có cùng nhóm/liên thông hay không trong quá trình gộp dần.

### 🟡 Q: Why path compression works? `[Mid]`
**A:** Mỗi lần find làm phẳng đường đi về root, nên các lần find sau nhanh hơn đáng kể.

### 🔴 Q: How is Union-Find used in Kruskal MST? `[Senior]`
**A:** Sắp cạnh tăng dần, thêm cạnh nếu hai đầu thuộc tập khác nhau rồi union; tránh tạo chu trình.

---

## 21. LRU Cache (Advanced Structures)

### Definition
- LRU cache loại bỏ phần tử ít được dùng gần đây nhất khi đầy, thường cài bằng HashMap + Doubly Linked List để đạt O(1).

### Core Operations & Complexity

| Operation | Complexity | Vietnamese explanation |
| --- | --- | --- |
| Get(key) | O(1) | Tra hash map và move node lên đầu list. |
| Put(key, value) | O(1) | Thêm/cập nhật và đẩy lên đầu. |
| Evict least recently used | O(1) | Lấy node ở đuôi list. |
| Space | O(capacity) | Lưu map + nodes. |
| Thread safety | Depends | Cần lock hoặc sharding trong môi trường concurrent. |

### Use Cases
- Cache API response, query result, computed object.
- Browser resource cache và in-memory service cache.
- Giảm truy vấn DB cho key truy cập lặp lại.

### Pseudocode (Language-agnostic)
```text
class LRUCache(capacity):
    map = hashmap<key, node>
    list = doubly-linked-list with head/tail sentinels

function get(key):
    if key not in map: return -1
    node = map[key]
    list.remove(node)
    list.addFront(node)
    return node.value

function put(key, value):
    if key in map:
        node = map[key]
        node.value = value
        list.remove(node)
        list.addFront(node)
        return
    if size(map) == capacity:
        old = list.removeBack()
        delete map[old.key]
    node = new Node(key, value)
    list.addFront(node)
    map[key] = node
```

### Interview Q&A

### 🟢 Q: Why combine HashMap and Doubly Linked List for LRU? `[Junior]`
**A:** HashMap cho truy cập key O(1), doubly list cho remove/move node O(1) khi cập nhật độ mới truy cập.

### 🟡 Q: What happens when cache is full and new key arrives? `[Mid]`
**A:** Cache evict node ít dùng gần nhất ở đuôi list rồi chèn key mới vào đầu list.

### 🔴 Q: Design an LRU cache with O(1) operations `[Senior]`
**A:** Thiết kế chuẩn là map key->node và doubly linked list theo thứ tự recent; mọi get/put đều chỉ thao tác pointer và hash lookup O(1).

---

## 22. Static Array vs Dynamic Array (Deep Dive)

### Definition
- Static array có kích thước cố định tại thời điểm cấp phát; dynamic array tự mở rộng khi đầy.
- Dynamic array thường dùng chiến lược nhân đôi capacity để cân bằng giữa số lần resize và memory overhead.

### Operations & Complexity

| Operation | Static Array | Dynamic Array | Vietnamese explanation |
| --- | --- | --- | --- |
| Index access | O(1) | O(1) | Cả hai đều contiguous memory. |
| Append | O(1) nếu còn chỗ, không thì không thể | Amortized O(1) | Dynamic array resize khi đầy. |
| Resize | Không hỗ trợ nội tại | O(n) mỗi lần resize | Cần copy toàn bộ phần tử sang vùng mới. |
| Memory overhead | Thấp nhưng có thể thiếu chỗ | Có thể dư chỗ sau resize | Đổi không gian lấy thời gian append. |

### Amortized Analysis Sketch
- Giả sử capacity tăng gấp đôi: 1, 2, 4, 8, ...
- Tổng số phần tử copy sau n lần append xấp xỉ 1 + 2 + 4 + ... + n/2 < n.
- Vì tổng chi phí copy là O(n) cho n thao tác append, chi phí trung bình mỗi append là O(1).

### 🟢 Q: Compare ArrayList vs LinkedList time complexity `[Junior]`
**A:** ArrayList (dynamic array) truy cập theo index O(1), append amortized O(1), nhưng chèn/xóa giữa O(n). LinkedList truy cập index O(n), nhưng chèn/xóa gần head/tail hoặc tại node đã biết là O(1).

### 🔴 Q: Explain amortized analysis for dynamic arrays `[Senior]`
**A:** Amortized analysis không xem từng thao tác đơn lẻ mà xem chi phí trung bình của chuỗi thao tác. Với growth factor 2, tổng chi phí resize/copy trong n lần append là tuyến tính O(n), nên mỗi append có amortized O(1), dù có một số lần đơn lẻ O(n).

---

## 23. Collision Resolution Deep Dive

### Chaining
- Mỗi bucket chứa danh sách (hoặc tree) các phần tử có cùng hash index.
- Ưu điểm: xóa phần tử đơn giản, load factor có thể > 1.
- Nhược điểm: pointer overhead, locality kém hơn open addressing.

### Open Addressing
- Mọi phần tử nằm trực tiếp trong mảng bucket, collision giải quyết bằng probing.
- Linear probing: dễ cài, nhưng dễ primary clustering.
- Quadratic probing: giảm clustering hơn linear, nhưng cần chọn tham số phù hợp.
- Double hashing: dùng hash thứ hai để nhảy bước, phân bố tốt hơn.

### Tombstone
- Trong open addressing, xóa phần tử thường đánh dấu tombstone thay vì set empty ngay.
- Nếu set empty ngay có thể làm hỏng chuỗi probe của key phía sau.

### 🟢 Q: Explain how a hash table handles collisions `[Junior]`
**A:** Có hai nhóm chính: chaining (bucket giữ nhiều phần tử) và open addressing (tìm ô trống khác bằng probing). Mục tiêu là vẫn tìm đúng key dù hash index ban đầu bị trùng.

### 🟡 Q: When open addressing degrades badly? `[Mid]`
**A:** Khi load factor cao, số bước probe tăng mạnh, đặc biệt linear probing dễ clustering khiến cả lookup và insert chậm rõ rệt.

---

## 24. Tree Balancing Summary

| Tree | Balance strictness | Search | Insert/Delete | Typical use |
| --- | --- | --- | --- | --- |
| BST (plain) | Không tự cân bằng | O(log n) avg / O(n) worst | O(log n) avg / O(n) worst | Dạy nền tảng, simple cases |
| AVL | Rất chặt | O(log n) | O(log n) với nhiều xoay hơn | Read-heavy in-memory index |
| Red-Black | Vừa phải | O(log n) | O(log n), update practical | Ordered map/set in libraries |
| B+Tree | Fanout lớn, disk-oriented | O(log_f n) | O(log_f n) | DB index, filesystem |

### 🟡 Q: Explain Red-Black tree balancing `[Mid]`
**A:** Cây duy trì quy tắc màu (đặc biệt không có hai node đỏ liên tiếp và black-height đồng nhất). Sau insert/delete sẽ recolor và rotate cục bộ để khôi phục invariant, từ đó giữ chiều cao O(log n).

### 🔴 Q: How does B+Tree optimize for disk I/O? `[Senior]`
**A:** B+Tree dùng node kích thước phù hợp page đĩa để mỗi lần đọc lấy được nhiều key/con trỏ. Fanout lớn làm cây thấp, giảm số page read ngẫu nhiên. Lá liên kết tuần tự giúp range scan hiệu quả.

---

## 25. Graph Property Checklist

- **Connected (liên thông):** giữa mọi cặp đỉnh tồn tại đường đi (đối với graph vô hướng).
- **Strongly connected:** với graph có hướng, mọi cặp u, v đều đi được hai chiều.
- **Cyclic:** tồn tại chu trình.
- **Acyclic:** không có chu trình.
- **DAG:** Directed Acyclic Graph, cực kỳ quan trọng cho dependency scheduling.
- **Bipartite:** đỉnh chia thành 2 tập sao cho mọi cạnh nối giữa 2 tập.
- **Weighted/Unweighted:** cạnh có trọng số hoặc không.

### Pseudocode: Bipartite Check (BFS coloring)
```text
function isBipartite(graph):
    color = map default UNCOLORED
    for each vertex s in graph:
        if color[s] != UNCOLORED: continue
        color[s] = 0
        q = queue([s])
        while not empty(q):
            u = dequeue(q)
            for v in neighbors(u):
                if color[v] == UNCOLORED:
                    color[v] = 1 - color[u]
                    enqueue(q, v)
                else if color[v] == color[u]:
                    return false
    return true
```

---

## 26. Complexity Comparison Table (Comprehensive)

| Structure | Access | Search | Insert | Delete | Space | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) (middle), amortized O(1) append | O(n) (middle) | O(n) | Contiguous memory, cache-friendly |
| Dynamic Array | O(1) | O(n) | Amortized O(1) append | O(n) (middle) | O(n) | Resize by doubling |
| Singly Linked List | O(n) | O(n) | O(1) at head/after node | O(1) at head/after node | O(n) | Pointer-based, poor locality |
| Doubly Linked List | O(n) | O(n) | O(1) at known node | O(1) at known node | O(n) | Bi-directional traversal |
| Stack | O(n) | O(n) | O(1) push | O(1) pop | O(n) | LIFO |
| Queue | O(n) | O(n) | O(1) enqueue | O(1) dequeue | O(n) | FIFO |
| Deque | O(n) | O(n) | O(1) both ends | O(1) both ends | O(n) | Double-ended queue |
| Hash Table | N/A | Avg O(1), worst O(n) | Avg O(1), worst O(n) | Avg O(1), worst O(n) | O(n) | Collision resolution needed |
| Hash Set | N/A | Avg O(1) | Avg O(1) | Avg O(1) | O(n) | Unique keys only |
| Hash Map | N/A | Avg O(1) by key | Avg O(1) | Avg O(1) | O(n) | Key-value association |
| Binary Tree (generic) | N/A | O(n) | Depends | Depends | O(n) | No ordering guarantee |
| BST (unbalanced) | N/A | Avg O(log n), worst O(n) | Avg O(log n), worst O(n) | Avg O(log n), worst O(n) | O(n) | Ordered keys |
| AVL Tree | N/A | O(log n) | O(log n) | O(log n) | O(n) | Strictly balanced BST |
| Red-Black Tree | N/A | O(log n) | O(log n) | O(log n) | O(n) | Balanced with color rules |
| B-Tree | N/A | O(log_f n) | O(log_f n) | O(log_f n) | O(n) | Disk/block optimized |
| B+Tree | N/A | O(log_f n) | O(log_f n) | O(log_f n) | O(n) | Excellent range scans |
| Trie | N/A | O(L) | O(L) | O(L) | O(total chars) | Prefix operations |
| Min/Max Heap | O(1) root | O(n) | O(log n) | O(log n) extract | O(n) | Priority operations |
| Priority Queue (heap) | O(1) peek | O(n) | O(log n) | O(log n) | O(n) | By priority not by arrival |
| Fibonacci Heap | O(1) min | O(n) | Amortized O(1) | Amortized O(log n) | O(n) | Good decrease-key amortized |
| Adjacency Matrix Graph | O(1) edge check | O(V) neighbors | O(1) edge add | O(1) edge remove | O(V^2) | Dense graph |
| Adjacency List Graph | O(deg(v)) | O(deg(v)) neighbors | O(1) amortized edge add | O(deg(v)) | O(V+E) | Sparse graph |
| Skip List | N/A | Expected O(log n) | Expected O(log n) | Expected O(log n) | O(n) | Probabilistic balancing |
| Bloom Filter | N/A | O(k) membership | O(k) | N/A (classic) | O(m bits) | False positives possible |
| Union-Find | N/A | Find ~ O(α(n)) | Union ~ O(α(n)) | N/A | O(n) | Connectivity tracking |
| LRU Cache | O(1) by key | O(1) | O(1) put | O(1) eviction | O(capacity) | HashMap + Doubly List |

---

## 27. Interview Questions Bank (10+ Mixed Levels)

### 🟢 Q: When would you use a hash map vs a BST? `[Junior]`
**A:** Hash map khi cần point lookup nhanh trung bình O(1). BST khi cần thứ tự key, predecessor/successor hoặc range query.

### 🟢 Q: Explain how a hash table handles collisions `[Junior]`
**A:** Dùng chaining hoặc open addressing để xử lý nhiều key trùng bucket, đảm bảo vẫn truy xuất đúng key.

### 🟢 Q: Compare ArrayList vs LinkedList time complexity `[Junior]`
**A:** ArrayList truy cập index O(1) nhưng chèn giữa O(n). LinkedList truy cập index O(n) nhưng chèn/xóa tại node đã biết O(1).

### 🟡 Q: How does a trie optimize prefix search? `[Mid]`
**A:** Trie duyệt từng ký tự prefix nên complexity theo độ dài prefix, không phụ thuộc số lượng từ trực tiếp.

### 🟡 Q: Explain Red-Black tree balancing `[Mid]`
**A:** Dùng recolor + rotation để duy trì invariant màu và giữ chiều cao O(log n).

### 🟡 Q: When would you use a Bloom filter? `[Mid]`
**A:** Khi cần pre-check membership cực nhanh và tiết kiệm RAM, chấp nhận false positive nhỏ.

### 🔴 Q: Design an LRU cache with O(1) operations `[Senior]`
**A:** Dùng hash map key->node và doubly linked list để move-to-front/get/evict-tail đều O(1).

### 🔴 Q: How does B+Tree optimize for disk I/O? `[Senior]`
**A:** Fanout lớn giảm chiều cao, node theo page và lá liên kết giúp scan tuần tự ít random I/O.

### 🔴 Q: Explain amortized analysis for dynamic arrays `[Senior]`
**A:** Phân tích trung bình trên chuỗi thao tác; dù resize O(n), append trung bình vẫn O(1).

### 🔴 Q: Compare skip list vs balanced BST `[Senior]`
**A:** Skip list đơn giản/probabilistic expected O(log n); balanced BST có guarantee cứng O(log n) nhưng code phức tạp hơn.

### 🟡 Q: Why heap is good for top-k problems? `[Mid]`
**A:** Duy trì heap kích thước k giúp loại phần tử không cần thiết, đạt O(n log k).

### 🟢 Q: What is the difference between stack and queue? `[Junior]`
**A:** Stack LIFO, queue FIFO; chọn theo thứ tự xử lý yêu cầu của bài toán.

### 🔴 Q: How would you choose between AVL and Red-Black tree? `[Senior]`
**A:** AVL cho lookup chặt hơn read-heavy, Red-Black cho update practical hơn trong write-heavy mixed workloads.

### 🟡 Q: Why Union-Find is near O(1)? `[Mid]`
**A:** Nhờ path compression + union by rank, complexity amortized là O(α(n)) rất chậm tăng.

---

## 28. Practical Decision Guide

### If your requirement is... choose...
- **Random access nhanh theo index:** Array / Dynamic Array.
- **Chèn/xóa nhiều ở đầu/cuối và đã có node tham chiếu:** Linked List hoặc Deque.
- **Lấy phần tử ưu tiên cao nhất liên tục:** Heap / Priority Queue.
- **Lookup key-value thật nhanh:** Hash Map.
- **Giữ thứ tự key + range query:** BST tự cân bằng / B+Tree (nếu disk).
- **Autocomplete/prefix matching:** Trie.
- **Membership nhanh và tiết kiệm RAM, chấp nhận xác suất:** Bloom Filter.
- **Quản lý nhóm liên thông động:** Union-Find.
- **Cache có giới hạn và cần loại theo độ mới truy cập:** LRU Cache.

### Common Interview Mistakes
- Chỉ nêu complexity trung bình mà quên worst-case.
- Trả lời "hash map luôn O(1)" mà không nói về collision/load factor.
- Nhầm lẫn giữa "balanced" theo lý thuyết và "practical" theo workload thực tế.
- Chọn linked list vì O(1) insert nhưng bỏ qua chi phí tìm vị trí O(n).
- Quên trade-off bộ nhớ của trie, bloom filter, skip list.
- Không nói rõ giả định dữ liệu: sorted/unsorted, dense/sparse, read-heavy/write-heavy.

### Answer Framework in Interview
1. Xác định pattern truy cập: read/write ratio, point lookup hay range query.
2. Nêu 2-3 lựa chọn hợp lý và complexity chính.
3. So sánh trade-off memory, implementation complexity, worst-case latency.
4. Chốt lựa chọn + nói khi nào sẽ đổi sang cấu trúc khác nếu scale/ràng buộc thay đổi.

---

## 29. Mini Cheat Sheet

- Array: nhanh khi đọc index, chậm khi chèn giữa.
- Linked List: nhanh khi đổi liên kết, chậm khi truy cập theo vị trí.
- Stack/Queue: tối ưu cho xử lý theo thứ tự LIFO/FIFO.
- Hash Map/Set: trung bình O(1), phụ thuộc hash quality.
- BST/AVL/RB: giữ thứ tự, thao tác O(log n) khi cân bằng.
- B+Tree: vua của index trên đĩa.
- Trie: vua của prefix.
- Heap/Priority Queue: vua của "lấy phần tử quan trọng nhất".
- Skip List: ordered set ngẫu nhiên, expected O(log n).
- Bloom Filter: membership xác suất, tiết kiệm RAM.
- Union-Find: connectivity gần O(1) amortized.
- LRU: cache O(1) get/put/evict bằng Map + Doubly List.

---

## 30. Extended Q&A Drill (Rapid Fire)

### 🟢 Q: Why contiguous memory matters for performance? `[Junior]`
**A:** Do tận dụng cache line tốt hơn, giảm cache miss, nên duyệt mảng thường nhanh hơn cấu trúc pointer-based.

### 🟢 Q: Is queue always implemented by linked list? `[Junior]`
**A:** Không. Queue có thể dùng mảng vòng, linked list, hoặc hai stack tùy nhu cầu.

### 🟢 Q: Can hash set store duplicate values? `[Junior]`
**A:** Không. Nếu thêm cùng một key nhiều lần thì set vẫn chỉ chứa một bản ghi logic.

### 🟡 Q: Why does high load factor hurt hash table performance? `[Mid]`
**A:** Vì collision tăng, làm lookup/insert phải duyệt thêm phần tử hoặc probe nhiều bước hơn.

### 🟡 Q: When does adjacency matrix make sense? `[Mid]`
**A:** Khi graph dày (dense) hoặc cần kiểm tra tồn tại cạnh rất thường xuyên với O(1).

### 🟡 Q: Why is trie good for autocomplete latency? `[Mid]`
**A:** Độ phức tạp phụ thuộc độ dài tiền tố người dùng gõ, không phụ thuộc trực tiếp số từ toàn bộ.

### 🔴 Q: How would you handle LRU cache concurrency? `[Senior]`
**A:** Dùng lock toàn cục cho đơn giản hoặc sharded cache + lock từng shard để tăng throughput.

### 🔴 Q: How to reason about false positive in Bloom filter? `[Senior]`
**A:** Tính xác suất theo m, k, n; thiết kế theo budget sai số chấp nhận được của hệ thống.

### 🔴 Q: If your BST becomes skewed in production, what to do? `[Senior]`
**A:** Chuyển sang self-balancing tree hoặc randomize insert pattern/đổi cấu trúc qua hash + sort khi cần.

### 🟡 Q: Why heaps are not ideal for full sorting queries repeatedly? `[Mid]`
**A:** Heap tốt cho top priority, nhưng inorder toàn bộ không thuận tiện như cấu trúc giữ thứ tự trực tiếp.

### 🟢 Q: What data structure underlies recursion execution? `[Junior]`
**A:** Call stack của runtime/VM theo cơ chế LIFO.

### 🔴 Q: How to choose data structure under memory pressure? `[Senior]`
**A:** Ưu tiên cấu trúc overhead thấp (array) hoặc probabilistic compact (Bloom), cân bằng với yêu cầu chính xác/latency.

---

## 31. Closing Notes

- Đây là tài liệu shared cho cả FE/BE nên tập trung vào nguyên lý chung, không phụ thuộc ngôn ngữ.
- Khi học, nên tự code lại từng cấu trúc ở mức tối thiểu để hiểu invariants và edge cases.
- Trong interview, điểm quan trọng là giải thích trade-off theo bối cảnh bài toán, không chỉ đọc thuộc Big-O.
- Hãy luyện nói rõ assumptions, worst-case, và vì sao lựa chọn của bạn thực dụng trong production.

