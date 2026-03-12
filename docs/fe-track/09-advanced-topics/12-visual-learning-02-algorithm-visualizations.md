# Algorithm Visualizations / Trực Quan Hóa Thuật Toán
## Visual Learning - Chapter 2 / Học Trực Quan - Chương 2
[Back to Table of Contents](../../00-table-of-contents.md)

---

## Tổng Quan / Overview
- Mục tiêu chương: biến các thuật toán trừu tượng thành tiến trình nhìn được theo từng bước.
- Cách học này đặc biệt hữu ích cho whiteboard interviews và giải thích logic với đồng đội.
- Cross-reference nền tảng: [Algorithms Theory](../../shared/01-cs-fundamentals/algorithms-theory.md).
- Cross-reference đồ thị: [Graph Algorithms](./04-graph-algorithms.md).
- Cross-reference cây: [Tree Algorithms](./05-tree-algorithms.md).

## 1) Sorting Visualizations / Trực Quan Sắp Xếp
### Bubble Sort
**Giải thích:** So sánh cặp liền kề, swap nếu sai thứ tự.

```text
Input: [5, 1, 4, 2, 8]
Pass1: [1,5,4,2,8] -> [1,4,5,2,8] -> [1,4,2,5,8]
Pass2: [1,4,2,5,8] -> [1,2,4,5,8]
Pass3: không swap -> dừng
Sorted: [1,2,4,5,8]
```

### Merge Sort
**Giải thích:** Chia mảng thành nửa nhỏ, sort từng nửa, rồi merge đã sort.

```text
[38,27,43,3,9,82,10]
split -> [38,27,43] | [3,9,82,10]
split -> [38] [27,43] [3,9] [82,10]
merge -> [27,43] [3,9] [10,82]
merge -> [27,38,43] [3,9,10,82]
final -> [3,9,10,27,38,43,82]
```

### Quick Sort
**Giải thích:** Chọn pivot và partition các phần tử nhỏ/lớn quanh pivot.

```text
[9,3,7,1,6], pivot=7
=> [3,1,6] 7 [9]
left: [3,1,6], pivot=1 => [] 1 [3,6]
right: [3,6], pivot=6 => [3] 6 []
result: [1,3,6,7,9]
```

### Heap Sort
**Giải thích:** Dựng max-heap, lặp swap root với cuối mảng rồi heapify.

```text
Input: [4,10,3,5,1]
build max heap: [10,5,3,4,1]
swap root/end: [1,5,3,4,10] -> heapify [5,4,3,1,10]
swap root/end: [1,4,3,5,10] -> heapify [4,1,3,5,10]
... -> [1,3,4,5,10]
```

## 2) Searching Visualizations
### Binary Search
```text
Array: [2,5,8,12,16,23,38,56,72], target=23
L=0 R=8 M=4 -> 16 < 23 => L=5
L=5 R=8 M=6 -> 38 > 23 => R=5
L=5 R=5 M=5 -> found
```

### BFS/DFS
```text
A - B - D
|   |
C - E

BFS(A): A, B, C, D, E
DFS(A): A, B, D, E, C (một khả năng)
```

## 3) Tree Operations
### BST Insert
```text
Insert: 50, 30, 70, 20, 40, 60, 80
        50
       /  \
     30    70
    / \   / \
   20 40 60 80
```

### BST Delete
```text
Delete node 50 (2 con)
Successor = 60
Replace 50 -> 60, remove old 60
```

### AVL Rotations
```text
LL case:             RR case:
   30                  10
  /        ->            \
 20                        20
/                            \
10                            30

After rotate: both balanced around 20
```

## 4) Hash Table Collision Resolution
### Chaining
```text
0: []
1: [apple] -> [grape]
2: []
3: [orange]
```

### Open Addressing (Linear Probing)
```text
hash(key)=2, size=7
2 occupied -> 3 occupied -> 4 empty -> place
```

## 5) Dynamic Programming Visualization
### Fibonacci Memoization
```text
fib(6)=fib(5)+fib(4)
memo: f2=1 f3=2 f4=3 f5=5 f6=8
```

### 0/1 Knapsack Table
```text
Capacity=5, items:(2,6),(2,10),(3,12)
      0 1 2 3 4 5
i=0:  0 0 0 0 0 0
i=1:  0 0 6 6 6 6
i=2:  0 0 10 10 16 16
i=3:  0 0 10 12 16 22
```

## 6) Graph Algorithm Visualizations
### Dijkstra
```text
Edges: A-B(4), A-C(1), C-B(2), B-D(1), C-D(5)
dist[A]=0
Pick A -> B=4 C=1
Pick C -> B=3 D=6
Pick B -> D=4
Pick D done
```

### Topological Sort (Kahn)
```text
A->C, B->C, C->D, C->E
In-degree: A0 B0 C2 D1 E1
Queue [A,B] -> pop A -> pop B -> push C -> push D,E
Order: A,B,C,D,E
```

## 7) Complexity Comparison Tables
### Sorting
| Algorithm | Best | Avg | Worst | Stable | In-place |
|---|---:|---:|---:|---|---|
| Bubble | O(n) | O(n^2) | O(n^2) | Yes | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | Yes | No |
| Quick | O(n log n) | O(n log n) | O(n^2) | No | Yes |
| Heap | O(n log n) | O(n log n) | O(n log n) | No | Yes |

### Search/Graph
| Algorithm | Time | Space | Note |
|---|---:|---:|---|
| Binary Search | O(log n) | O(1) | Cần mảng đã sort |
| BFS | O(V+E) | O(V) | Unweighted shortest path |
| DFS | O(V+E) | O(V) | Traversal/cycle detection |
| Dijkstra | O((V+E)logV) | O(V) | Trọng số không âm |

## 8) Whiteboard Explanation Tips
- Nêu input/output/constraints trước khi chọn thuật toán.
- Vẽ 2-3 bước đầu để xác nhận hiểu đúng tiến trình.
- Nêu invariant trong loop hoặc recursion.
- Phân tích time/space sau khi có lời giải đúng.
- Nêu edge cases (empty, duplicate, negative weights, disconnected graph).
- Nếu tối ưu, trình bày baseline rồi mới chuyển sang bản tối ưu.

## 9) Practice Boards / Bảng Luyện Mô Phỏng
### Board 1
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 2
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 3
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 4
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 5
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 6
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 7
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 8
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 9
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 10
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 11
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 12
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 13
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 14
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 15
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 16
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 17
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 18
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 19
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 20
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 21
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 22
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 23
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 24
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

### Board 25
- **English prompt:** Explain algorithm state transitions clearly.
- **Giải thích:** Mục tiêu là thể hiện cách dữ liệu biến đổi qua từng bước, tránh nói chung chung.
- **Ví dụ:** Khi mô tả quicksort, luôn chỉ rõ pivot, vùng trái/phải, và thứ tự recursive calls.

## 10) Mini Code Snippets (20%)
```ts
export function binarySearch(arr: number[], target: number): number {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    const m = l + Math.floor((r - l) / 2);
    if (arr[m] === target) return m;
    if (arr[m] < target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}
```

```ts
export function bubbleSort(nums: number[]): number[] {
  const arr = [...nums];
  for (let i = 0; i < arr.length; i += 1) {
    let swapped = false;
    for (let j = 0; j < arr.length - 1 - i; j += 1) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}
```

## 11) Interview Checklist
- [ ] Mô tả được step-by-step của bubble/merge/quick/heap sort.
- [ ] Phân biệt binary search, BFS, DFS và use cases.
- [ ] Giải thích BST insert/delete và AVL rotation.
- [ ] Vẽ collision handling cho hash table (chaining/probing).
- [ ] Mô tả DP table filling bằng ví dụ cụ thể.
- [ ] Minh họa Dijkstra và topological sort bằng ASCII.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Vì sao học thuật toán bằng visualization hiệu quả?

**Tổng Quan**
Vì nhìn thấy trạng thái thay đổi giúp giảm mơ hồ.

**Giải thích**
Khi dữ liệu biến đổi từng bước, bạn nhớ bản chất nhanh hơn học thuộc code.

**Ví dụ**
Vẽ pass của Bubble Sort giúp nhớ vì sao phần tử lớn “nổi” về cuối.

### 🟢 [Junior] Binary Search cần điều kiện gì?

**Tổng Quan**
Dữ liệu phải được sắp xếp trước.

**Giải thích**
Nếu mảng chưa sort, việc chia đôi không còn ý nghĩa đúng đắn.

**Ví dụ**
Sort mảng tăng dần rồi mới binary search.

### 🟢 [Junior] BFS khác DFS cơ bản ra sao?

**Tổng Quan**
BFS dùng queue, DFS dùng stack/recursion.

**Giải thích**
BFS đi theo tầng, DFS đi sâu theo nhánh trước.

**Ví dụ**
BFS phù hợp tìm đường ngắn nhất trong unweighted graph.

### 🟢 [Junior] Bubble Sort độ phức tạp bao nhiêu?

**Tổng Quan**
Trung bình và tệ nhất là O(n^2).

**Giải thích**
Nó đơn giản để học nhưng kém hiệu quả với dữ liệu lớn.

**Ví dụ**
Mảng 10k phần tử dùng bubble sort sẽ rất chậm.

### 🟢 [Junior] Merge Sort có stable không?

**Tổng Quan**
Có, nếu merge implementation giữ thứ tự phần tử bằng nhau.

**Giải thích**
Stability quan trọng khi sort records theo nhiều khóa.

**Ví dụ**
Sort theo name rồi theo age cần stable sort để giữ thứ tự cũ.

### 🟡 [Mid] Quick Sort vì sao có worst-case O(n^2)?

**Tổng Quan**
Do partition lệch mạnh liên tục khi chọn pivot tệ.

**Giải thích**
Ví dụ chọn pivot đầu/cuối trên mảng đã sort gây chia rất lệch.

**Ví dụ**
Dùng random pivot hoặc median-of-three để giảm rủi ro.

### 🟡 [Mid] Heap Sort có ưu/nhược điểm gì?

**Tổng Quan**
Ưu: O(n log n) worst-case ổn định; nhược: không stable, cache locality kém hơn quicksort.

**Giải thích**
Dùng heap sort khi cần in-place và tránh worst-case O(n^2).

**Ví dụ**
Hệ thống yêu cầu giới hạn memory có thể chọn heap sort.

### 🟡 [Mid] BST delete node có 2 con làm sao?

**Tổng Quan**
Thay node bằng inorder successor hoặc predecessor rồi xóa node thay thế.

**Giải thích**
Đảm bảo tính chất BST vẫn đúng sau xóa.

**Ví dụ**
Xóa 50 trong cây, lấy successor 60 thay thế.

### 🟡 [Mid] AVL rotation mục tiêu gì?

**Tổng Quan**
Giữ chiều cao cây cân bằng để thao tác O(log n).

**Giải thích**
Nếu mất cân bằng dài hạn, BST có thể thoái hóa O(n).

**Ví dụ**
Insert tăng dần liên tục sẽ trigger rotations.

### 🟡 [Mid] DP visualization giúp gì?

**Tổng Quan**
Giúp thấy phụ thuộc giữa subproblems và thứ tự điền bảng.

**Giải thích**
Interviewer đánh giá cao khả năng giải thích trạng thái hơn code thuộc lòng.

**Ví dụ**
Knapsack table cho thấy khi nào nên chọn item.

### 🟡 [Mid] Hash collision xử lý ra sao?

**Tổng Quan**
Chaining hoặc open addressing (linear/quadratic/double hashing).

**Giải thích**
Mỗi chiến lược có trade-off về memory, cache, và clustering.

**Ví dụ**
Linear probing đơn giản nhưng dễ primary clustering.

### 🟡 [Mid] Dijkstra dùng được với cạnh âm không?

**Tổng Quan**
Không an toàn với trọng số âm.

**Giải thích**
Invariant “node pop ra là tối ưu cuối cùng” bị phá bởi cạnh âm.

**Ví dụ**
Có cạnh âm nên dùng Bellman-Ford.

### 🟡 [Mid] Topological sort áp dụng khi nào?

**Tổng Quan**
Khi đồ thị có hướng không chu trình (DAG).

**Giải thích**
Dùng cho dependency scheduling/build order/course prerequisites.

**Ví dụ**
Build system tính thứ tự compile modules theo DAG.

### 🟡 [Mid] Whiteboard nên bắt đầu thế nào?

**Tổng Quan**
Bắt đầu bằng constraints và ví dụ nhỏ.

**Giải thích**
Làm rõ yêu cầu sớm giúp tránh đi sai hướng thuật toán.

**Ví dụ**
Hỏi interviewer về giới hạn n trước khi chọn giải pháp.

### 🟡 [Mid] Làm sao trình bày complexity thuyết phục?

**Tổng Quan**
Nêu cost dominant operation và số lần lặp/chia nhánh.

**Giải thích**
Đừng chỉ đọc công thức; hãy liên hệ với tiến trình thuật toán.

**Ví dụ**
Merge sort có log tầng, mỗi tầng xử lý n phần tử -> O(n log n).

### 🔴 [Senior] Bạn dạy junior giải thích DFS cycle detection thế nào?

**Tổng Quan**
Dùng 3-state coloring: unvisited/visiting/visited.

**Giải thích**
Cycle xuất hiện khi gặp back-edge tới node đang visiting.

**Ví dụ**
Vẽ recursion stack và state transition từng cạnh.

### 🔴 [Senior] Khi nào visualization có thể gây hiểu sai?

**Tổng Quan**
Khi minh họa quá đơn giản và bỏ qua invariant chính.

**Giải thích**
Cần luôn gắn hình vẽ với điều kiện đúng/sai của thuật toán.

**Ví dụ**
Dijkstra demo không nhắc “non-negative weights” là sai ngữ cảnh.

### 🔴 [Senior] Trình bày trade-off quicksort vs mergesort trong interview?

**Tổng Quan**
Quicksort thường nhanh thực tế và in-place; mergesort stable, predictable O(n log n).

**Giải thích**
Chọn theo yêu cầu stability, memory, và worst-case guarantee.

**Ví dụ**
Sort records cần stable -> merge/timsort; memory chặt -> quick/heap.

### 🔴 [Senior] Cách xử lý áp lực thời gian whiteboard?

**Tổng Quan**
Đưa baseline đúng trước, sau đó tối ưu có kiểm chứng.

**Giải thích**
Câu trả lời có cấu trúc thường ghi điểm hơn code tối ưu nhưng thiếu giải thích.

**Ví dụ**
Nói rõ: "Em bắt đầu O(n^2) để verify, sau đó chuyển O(n log n)".

### 🔴 [Senior] Bạn đánh giá lời giải thuật toán của ứng viên dựa trên gì?

**Tổng Quan**
Correctness, clarity, complexity reasoning, edge-case handling, communication.

**Giải thích**
Senior không chỉ code đúng mà còn biết giải thích và validate assumptions.

**Ví dụ**
Ứng viên tốt tự nêu test cases phản ví dụ trước khi interviewer hỏi.

## Kết Luận / Summary
- Visualization là kỹ thuật truyền đạt mạnh cho cả học tập lẫn phỏng vấn thuật toán.
- Khi giải thích tốt, bạn nên kết hợp: tiến trình trạng thái + invariant + complexity + edge cases.
- Tập thói quen vẽ ASCII ngắn gọn sẽ tăng tốc tư duy và độ thuyết phục trên whiteboard.

---

[Back to Table of Contents](../../00-table-of-contents.md)
