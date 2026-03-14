# Implement Queue using Stacks / Cài đặt Queue bằng Stacks

> **Track**: Shared | **Difficulty**: 🟢 Easy
> **LeetCode**: #232 | **Pattern**: Two Stacks (Amortized)
> **Category**: Design

## Problem / Đề bài

**English**: Implement a first-in-first-out (FIFO) queue using only two stacks. The queue must support `push(x)` (push element to back), `pop()` (remove and return front element), `peek()` (return front element without removing), and `empty()` (return whether queue is empty). You may only use standard stack operations: push to top, pop from top, peek at top, size, and isEmpty.

**Vietnamese**: Cài đặt hàng đợi FIFO chỉ sử dụng hai stack. Queue cần hỗ trợ 4 thao tác: `push` (thêm vào cuối), `pop` (xóa và trả về phần tử đầu), `peek` (xem phần tử đầu không xóa), `empty` (kiểm tra rỗng). Chỉ được dùng các thao tác chuẩn của stack: push top, pop top, peek top, size, isEmpty.

**Example**:
```
Input:
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]

Output: [null, null, null, 1, 1, false]

Explanation:
MyQueue queue = new MyQueue();
queue.push(1);   // queue: [1]
queue.push(2);   // queue: [1, 2]
queue.peek();    // return 1 (front element)
queue.pop();     // return 1, queue: [2]
queue.empty();   // return false
```

**Constraints**: `1 <= x <= 9`, at most 100 calls, calls to `pop` and `peek` are always valid (queue is non-empty).

---

## Approach / Hướng giải

### Pattern nhận dạng / Pattern recognition

Bài này kiểm tra hiểu biết về cách đảo ngược thứ tự bằng hai stack. Stack là LIFO (Last-In-First-Out), Queue là FIFO. Để mô phỏng FIFO bằng LIFO, ta dùng **hai stack**: một stack để nhận dữ liệu vào (`inbox`), một stack để lấy dữ liệu ra (`outbox`). Khi `outbox` rỗng, đổ toàn bộ `inbox` vào `outbox` — thứ tự bị đảo ngược hai lần, trở thành đúng thứ tự FIFO.

When you see "simulate one data structure with another", think about what transformation reverses the property — two reversals (stacks) create a queue.

### Key Insight / Ý tưởng chính

A stack reverses order. Two stacks reverse order twice = original order. The **lazy transfer** approach (only move from inbox to outbox when outbox is empty) gives **amortized O(1)** per operation — each element is pushed and popped exactly twice total.

---

## Solutions / Các cách giải

### Solution 1: Two Stacks (Lazy Transfer) — Amortized O(1) time, O(N) space ✅ Recommended

**Idea**: Use `inbox` stack for all pushes. Use `outbox` stack for all pops/peeks. When `outbox` is empty and we need to pop/peek, transfer all elements from `inbox` to `outbox` (reversing order to restore FIFO). This is "lazy" because we only transfer when needed.

**Ý tưởng**: Dùng stack `inbox` để nhận tất cả push. Dùng stack `outbox` để phục vụ pop/peek. Khi `outbox` rỗng mà cần pop/peek, chuyển toàn bộ `inbox` sang `outbox` (đảo ngược thứ tự, khôi phục FIFO). Vì mỗi phần tử chỉ được chuyển đúng một lần, độ phức tạp phân bổ là O(1).

**Algorithm**:
1. `push(x)`: push x onto `inbox`.
2. `pop()`: call `transfer()`, then pop from `outbox`.
3. `peek()`: call `transfer()`, then peek at top of `outbox`.
4. `empty()`: return `inbox` is empty AND `outbox` is empty.
5. `transfer()`: if `outbox` is empty, pop everything from `inbox` and push onto `outbox`.

**Pseudocode**:
```
class MyQueue:
    inbox  = Stack()   // receives new elements
    outbox = Stack()   // serves pop/peek requests

    function push(x):
        inbox.push(x)

    function transfer():
        if outbox.isEmpty():
            while not inbox.isEmpty():
                outbox.push(inbox.pop())

    function pop():
        transfer()
        return outbox.pop()

    function peek():
        transfer()
        return outbox.peek()

    function empty():
        return inbox.isEmpty() and outbox.isEmpty()
```

**Visual**:
```
push(1), push(2), push(3)
inbox  = [1, 2, 3]  (3 on top)
outbox = []

peek() called:
  outbox is empty → transfer!
  pop 3 from inbox → push to outbox
  pop 2 from inbox → push to outbox
  pop 1 from inbox → push to outbox

inbox  = []
outbox = [3, 2, 1]  (1 on top ← front of queue)

peek() → 1  ✓
pop()  → 1  (outbox = [3, 2])
pop()  → 2  (outbox = [3])

push(4):
inbox  = [4]
outbox = [3]

pop() called:
  outbox not empty → no transfer needed
  pop() → 3  ✓  (FIFO order maintained)
```

**Complexity**:
- Time: O(1) amortized — each element is pushed to inbox once and popped from outbox once; worst case O(N) for a single pop
- Space: O(N) — all elements stored across the two stacks

---

### Solution 2: Single Stack with Recursion — O(N) time, O(N) space

**Idea**: Use one stack. To simulate `pop`, recursively pop all elements, save the bottom element, then push everything back. Simpler conceptually but O(N) per pop.

**Algorithm**:
1. `push(x)`: push to stack.
2. `pop()`: if stack has 1 element, pop and return it. Otherwise pop top, recursively call `pop()`, then push the saved top back, return the recursively obtained bottom.

**Complexity**:
- Time: O(N) per pop/peek
- Space: O(N) call stack depth

---

## Comparison / So sánh

| Solution | push | pop/peek | Space | Notes |
|----------|------|----------|-------|-------|
| Two Stacks (Lazy) | O(1) | O(1) amortized | O(N) | Recommended — interview standard |
| Recursive | O(1) | O(N) | O(N) | Clever but slow |

---

## Interview Tips / Mẹo phỏng vấn

- **Key point**: The amortized analysis is the key talking point — each element is moved at most once from inbox to outbox, so total cost across all operations is O(N) → amortized O(1) each.
- **Edge cases**: `pop()` on empty queue (problem says input is always valid, but mention this); calling `peek()` then `pop()` back-to-back (outbox already filled from peek, so pop is O(1)).
- **Follow-up**: "What if we need worst-case O(1) for all operations?" — This is not achievable with simple stacks; lead-in to more complex designs.

---

## Related Problems / Bài liên quan

- LC 225 — Implement Stack using Queues (inverse problem)
- LC 155 — Min Stack (stack augmentation)
- LC 622 — Design Circular Queue
