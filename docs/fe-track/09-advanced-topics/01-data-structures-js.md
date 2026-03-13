# Data Structures / Cấu Trúc Dữ Liệu

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Computer Science Fundamentals - Chapter 1 / Khoa Học Máy Tính Cơ Bản - Chương 1

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Algorithms →](./02-algorithms-js.md)

---

## Overview / Tổng Quan

**English:** Data structures are fundamental to computer science and software engineering. Understanding how to organize, store, and manipulate data efficiently is crucial for building scalable applications and succeeding in technical interviews at top companies.

**Tiếng Việt:** Cấu trúc dữ liệu là nền tảng của khoa học máy tính và kỹ thuật phần mềm. Hiểu cách tổ chức, lưu trữ và thao tác dữ liệu hiệu quả là rất quan trọng để xây dựng ứng dụng có thể mở rộng và thành công trong phỏng vấn kỹ thuật tại các công ty hàng đầu.

---

## Table of Contents / Mục Lục

1. [Arrays / Mảng](#arrays--mảng)
2. [Linked Lists / Danh Sách Liên Kết](#linked-lists--danh-sách-liên-kết)
3. [Stacks / Ngăn Xếp](#stacks--ngăn-xếp)
4. [Queues / Hàng Đợi](#queues--hàng-đợi)
5. [Hash Tables / Bảng Băm](#hash-tables--bảng-băm)
6. [Trees / Cây](#trees--cây)
7. [Graphs / Đồ Thị](#graphs--đồ-thị)
8. [Heaps / Đống](#heaps--đống)
9. [Tries / Cây Tiền Tố](#tries--cây-tiền-tố)
10. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Arrays / Mảng

### Theory / Lý Thuyết

**English:** An array is a contiguous block of memory that stores elements of the same type. Arrays provide O(1) random access but O(n) insertion/deletion in the middle.

**Tiếng Việt:** Mảng là một khối bộ nhớ liên tục lưu trữ các phần tử cùng kiểu. Mảng cung cấp truy cập ngẫu nhiên O(1) nhưng chèn/xóa O(n) ở giữa.

### Time Complexity / Độ Phức Tạp Thời Gian

```
Operation          | Time Complexity / Độ Phức Tạp
-------------------|--------------------------------
Access / Truy cập  | O(1)
Search / Tìm kiếm  | O(n)
Insert / Chèn      | O(n)
Delete / Xóa       | O(n)
```

### Implementation / Triển Khai

```typescript
class DynamicArray<T> {
  private items: T[];
  private capacity: number;
  private length: number;

  constructor(capacity: number = 10) {
    this.capacity = capacity;
    this.items = new Array(capacity);
    this.length = 0;
  }

  // Get element at index / Lấy phần tử tại index
  get(index: number): T {
    if (index < 0 || index >= this.length) {
      throw new Error('Index out of bounds / Index ngoài phạm vi');
    }
    return this.items[index];
  }

  // Add element to end / Thêm phần tử vào cuối
  push(item: T): void {
    if (this.length === this.capacity) {
      this.resize();
    }
    this.items[this.length++] = item;
  }

  // Remove and return last element / Xóa và trả về phần tử cuối
  pop(): T | undefined {
    if (this.length === 0) return undefined;
    const item = this.items[--this.length];
    return item;
  }

  // Insert at specific index / Chèn tại index cụ thể
  insert(index: number, item: T): void {
    if (index < 0 || index > this.length) {
      throw new Error('Index out of bounds / Index ngoài phạm vi');
    }
    if (this.length === this.capacity) {
      this.resize();
    }
    // Shift elements right / Dịch phần tử sang phải
    for (let i = this.length; i > index; i--) {
      this.items[i] = this.items[i - 1];
    }
    this.items[index] = item;
    this.length++;
  }

  // Remove element at index / Xóa phần tử tại index
  remove(index: number): T {
    if (index < 0 || index >= this.length) {
      throw new Error('Index out of bounds / Index ngoài phạm vi');
    }
    const item = this.items[index];
    // Shift elements left / Dịch phần tử sang trái
    for (let i = index; i < this.length - 1; i++) {
      this.items[i] = this.items[i + 1];
    }
    this.length--;
    return item;
  }

  // Double capacity when full / Nhân đôi dung lượng khi đầy
  private resize(): void {
    this.capacity *= 2;
    const newItems = new Array(this.capacity);
    for (let i = 0; i < this.length; i++) {
      newItems[i] = this.items[i];
    }
    this.items = newItems;
  }

  size(): number {
    return this.length;
  }
}
```

---

## Linked Lists / Danh Sách Liên Kết

### Theory / Lý Thuyết

**English:** A linked list is a linear data structure where elements are stored in nodes. Each node contains data and a reference to the next node. Unlike arrays, linked lists don't require contiguous memory.

**Tiếng Việt:** Danh sách liên kết là cấu trúc dữ liệu tuyến tính trong đó các phần tử được lưu trữ trong các nút. Mỗi nút chứa dữ liệu và tham chiếu đến nút tiếp theo. Không giống mảng, danh sách liên kết không yêu cầu bộ nhớ liên tục.

### Types / Các Loại

1. **Singly Linked List** / Danh Sách Liên Kết Đơn
2. **Doubly Linked List** / Danh Sách Liên Kết Đôi
3. **Circular Linked List** / Danh Sách Liên Kết Vòng

### Time Complexity / Độ Phức Tạp Thời Gian

```
Operation          | Time Complexity / Độ Phức Tạp
-------------------|--------------------------------
Access / Truy cập  | O(n)
Search / Tìm kiếm  | O(n)
Insert / Chèn      | O(1) at head/tail, O(n) middle
Delete / Xóa       | O(1) at head, O(n) elsewhere
```


### Implementation / Triển Khai

```typescript
// Node class / Lớp Node
class ListNode<T> {
  data: T;
  next: ListNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

// Singly Linked List / Danh Sách Liên Kết Đơn
class LinkedList<T> {
  private head: ListNode<T> | null;
  private tail: ListNode<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Add to beginning / Thêm vào đầu
  prepend(data: T): void {
    const newNode = new ListNode(data);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }

  // Add to end / Thêm vào cuối
  append(data: T): void {
    const newNode = new ListNode(data);
    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  // Insert at position / Chèn tại vị trí
  insertAt(index: number, data: T): void {
    if (index < 0 || index > this.length) {
      throw new Error('Index out of bounds / Index ngoài phạm vi');
    }
    if (index === 0) {
      this.prepend(data);
      return;
    }
    if (index === this.length) {
      this.append(data);
      return;
    }

    const newNode = new ListNode(data);
    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }
    newNode.next = current!.next;
    current!.next = newNode;
    this.length++;
  }

  // Remove from beginning / Xóa từ đầu
  removeFirst(): T | null {
    if (!this.head) return null;
    const data = this.head.data;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.length--;
    return data;
  }

  // Find node / Tìm nút
  find(data: T): ListNode<T> | null {
    let current = this.head;
    while (current) {
      if (current.data === data) return current;
      current = current.next;
    }
    return null;
  }

  // Reverse list / Đảo ngược danh sách
  reverse(): void {
    let prev: ListNode<T> | null = null;
    let current = this.head;
    this.tail = this.head;

    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }

  // Convert to array / Chuyển đổi thành mảng
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  size(): number {
    return this.length;
  }
}
```

### Doubly Linked List / Danh Sách Liên Kết Đôi

```typescript
class DoublyListNode<T> {
  data: T;
  next: DoublyListNode<T> | null;
  prev: DoublyListNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList<T> {
  private head: DoublyListNode<T> | null;
  private tail: DoublyListNode<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(data: T): void {
    const newNode = new DoublyListNode(data);
    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  prepend(data: T): void {
    const newNode = new DoublyListNode(data);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
  }

  // Remove node / Xóa nút
  remove(node: DoublyListNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    this.length--;
  }
}
```

---

## Stacks / Ngăn Xếp

### Theory / Lý Thuyết

**English:** A stack is a Last-In-First-Out (LIFO) data structure. Elements are added and removed from the same end (top). Think of a stack of plates.

**Tiếng Việt:** Ngăn xếp là cấu trúc dữ liệu Vào Sau Ra Trước (LIFO). Các phần tử được thêm và xóa từ cùng một đầu (đỉnh). Hãy nghĩ về một chồng đĩa.

### Applications / Ứng Dụng

- Function call stack / Ngăn xếp gọi hàm
- Undo/Redo operations / Thao tác hoàn tác/làm lại
- Expression evaluation / Đánh giá biểu thức
- Backtracking algorithms / Thuật toán quay lui

### Implementation / Triển Khai

```typescript
class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  // Add element to top / Thêm phần tử vào đỉnh
  push(item: T): void {
    this.items.push(item);
  }

  // Remove and return top element / Xóa và trả về phần tử đỉnh
  pop(): T | undefined {
    return this.items.pop();
  }

  // View top element without removing / Xem phần tử đỉnh mà không xóa
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

// Practical example: Balanced parentheses / Ví dụ thực tế: Dấu ngoặc cân bằng
function isBalanced(str: string): boolean {
  const stack = new Stack<string>();
  const pairs: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of str) {
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
    } else if ([')', '}', ']'].includes(char)) {
      if (stack.isEmpty() || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.isEmpty();
}

console.log(isBalanced('()')); // true
console.log(isBalanced('({[]})')); // true
console.log(isBalanced('({[})')); // false
```

---

## Queues / Hàng Đợi

### Theory / Lý Thuyết

**English:** A queue is a First-In-First-Out (FIFO) data structure. Elements are added at the rear and removed from the front. Think of a line of people waiting.

**Tiếng Việt:** Hàng đợi là cấu trúc dữ liệu Vào Trước Ra Trước (FIFO). Các phần tử được thêm vào phía sau và xóa từ phía trước. Hãy nghĩ về một hàng người đang chờ.

### Types / Các Loại

1. **Simple Queue** / Hàng Đợi Đơn Giản
2. **Circular Queue** / Hàng Đợi Vòng
3. **Priority Queue** / Hàng Đợi Ưu Tiên
4. **Deque** (Double-ended queue) / Hàng Đợi Hai Đầu

### Implementation / Triển Khai

```typescript
class Queue<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  // Add element to rear / Thêm phần tử vào phía sau
  enqueue(item: T): void {
    this.items.push(item);
  }

  // Remove and return front element / Xóa và trả về phần tử phía trước
  dequeue(): T | undefined {
    return this.items.shift();
  }

  // View front element / Xem phần tử phía trước
  front(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Circular Queue / Hàng Đợi Vòng
class CircularQueue<T> {
  private items: (T | null)[];
  private front: number;
  private rear: number;
  private size: number;
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.items = new Array(capacity).fill(null);
    this.front = 0;
    this.rear = -1;
    this.size = 0;
  }

  enqueue(item: T): boolean {
    if (this.isFull()) return false;
    this.rear = (this.rear + 1) % this.capacity;
    this.items[this.rear] = item;
    this.size++;
    return true;
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;
    const item = this.items[this.front];
    this.items[this.front] = null;
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return item;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}
```

---

## Hash Tables / Bảng Băm

### Theory / Lý Thuyết

**English:** A hash table uses a hash function to map keys to array indices, providing O(1) average-case lookup, insertion, and deletion. Collisions are handled through chaining or open addressing.

**Tiếng Việt:** Bảng băm sử dụng hàm băm để ánh xạ khóa đến chỉ số mảng, cung cấp tra cứu, chèn và xóa O(1) trung bình. Xung đột được xử lý thông qua chuỗi hoặc địa chỉ mở.

### Hash Function Properties / Thuộc Tính Hàm Băm

1. **Deterministic** / Xác định: Same input → same output
2. **Uniform distribution** / Phân phối đồng đều: Minimize collisions
3. **Fast computation** / Tính toán nhanh: O(1) time

### Implementation / Triển Khai

```typescript
class HashTable<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private size: number;
  private capacity: number;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.buckets = new Array(capacity).fill(null).map(() => []);
    this.size = 0;
  }

  // Hash function / Hàm băm
  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer / Chuyển đổi thành số nguyên 32-bit
    }
    return Math.abs(hash) % this.capacity;
  }

  // Insert or update / Chèn hoặc cập nhật
  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    // Check if key exists / Kiểm tra khóa tồn tại
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    // Add new entry / Thêm mục mới
    bucket.push([key, value]);
    this.size++;

    // Resize if load factor > 0.75 / Thay đổi kích thước nếu hệ số tải > 0.75
    if (this.size / this.capacity > 0.75) {
      this.resize();
    }
  }

  // Get value by key / Lấy giá trị theo khóa
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return undefined;
  }

  // Delete entry / Xóa mục
  delete(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }

  // Check if key exists / Kiểm tra khóa tồn tại
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  // Resize hash table / Thay đổi kích thước bảng băm
  private resize(): void {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0;

    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  // Get all keys / Lấy tất cả khóa
  keys(): K[] {
    const result: K[] = [];
    for (const bucket of this.buckets) {
      for (const [key] of bucket) {
        result.push(key);
      }
    }
    return result;
  }

  // Get all values / Lấy tất cả giá trị
  values(): V[] {
    const result: V[] = [];
    for (const bucket of this.buckets) {
      for (const [, value] of bucket) {
        result.push(value);
      }
    }
    return result;
  }
}
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Question 1: Array vs Linked List?

**English Answer:**
- **Array**: O(1) access, O(n) insert/delete, contiguous memory
- **Linked List**: O(n) access, O(1) insert/delete at head, non-contiguous
- **Use array** when: Random access needed, size known
- **Use linked list** when: Frequent insertions/deletions, size unknown

**Tiếng Việt:**
- **Mảng**: Truy cập O(1), chèn/xóa O(n), bộ nhớ liên tục
- **Danh sách liên kết**: Truy cập O(n), chèn/xóa O(1) ở đầu, không liên tục
- **Dùng mảng** khi: Cần truy cập ngẫu nhiên, biết kích thước
- **Dùng danh sách liên kết** khi: Chèn/xóa thường xuyên, không biết kích thước

### Question 2: Implement LRU Cache

**English Answer:**
```typescript
class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    
    // Move to end (most recently used) / Di chuyển đến cuối (gần đây nhất)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used / Xóa ít được sử dụng gần đây nhất
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### Question 3: Detect cycle in linked list

**English Answer:**
Use Floyd's Cycle Detection (Tortoise and Hare):
```typescript
function hasCycle<T>(head: ListNode<T> | null): boolean {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    
    if (slow === fast) return true;
  }
  
  return false;
}
```

---

## Key Takeaways / Điểm Chính

**English:**
1. Choose data structures based on access patterns
2. Arrays: Fast access, slow insertion/deletion
3. Linked lists: Fast insertion/deletion, slow access
4. Stacks: LIFO, function calls, undo operations
5. Queues: FIFO, task scheduling, BFS
6. Hash tables: O(1) average lookup, handle collisions

**Tiếng Việt:**
1. Chọn cấu trúc dữ liệu dựa trên mẫu truy cập
2. Mảng: Truy cập nhanh, chèn/xóa chậm
3. Danh sách liên kết: Chèn/xóa nhanh, truy cập chậm
4. Ngăn xếp: LIFO, gọi hàm, thao tác hoàn tác
5. Hàng đợi: FIFO, lập lịch tác vụ, BFS
6. Bảng băm: Tra cứu O(1) trung bình, xử lý xung đột

---

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Algorithms →](./02-algorithms-js.md)
