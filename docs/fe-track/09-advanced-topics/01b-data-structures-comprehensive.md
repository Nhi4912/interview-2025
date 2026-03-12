# Data Structures - Comprehensive Guide / Cấu Trúc Dữ Liệu - Hướng Dẫn Toàn Diện
## Computer Science Fundamentals - Chapter 1 / Khoa Học Máy Tính Cơ Bản - Chương 1

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Algorithms →](./02-algorithms.md)

---

## 📋 Table of Contents / Mục Lục

### Part 1: Foundations / Phần 1: Nền Tảng
1. [Introduction to Data Structures](#introduction-to-data-structures)
2. [Why Data Structures Matter](#why-data-structures-matter)
3. [Complexity Analysis Overview](#complexity-analysis-overview)
4. [Memory Management Concepts](#memory-management-concepts)

### Part 2: Linear Data Structures / Phần 2: Cấu Trúc Dữ Liệu Tuyến Tính
5. [Arrays - Deep Dive](#arrays---deep-dive)
6. [Linked Lists - Complete Guide](#linked-lists---complete-guide)
7. [Stacks - Theory & Practice](#stacks---theory--practice)
8. [Queues - All Variations](#queues---all-variations)

### Part 3: Non-Linear Data Structures / Phần 3: Cấu Trúc Dữ Liệu Phi Tuyến Tính
9. [Hash Tables - Advanced](#hash-tables---advanced)
10. [Trees - Binary Trees & BST](#trees---binary-trees--bst)
11. [Heaps - Priority Queues](#heaps---priority-queues)
12. [Graphs - Representation & Traversal](#graphs---representation--traversal)
13. [Tries - Prefix Trees](#tries---prefix-trees)

### Part 4: Advanced Topics / Phần 4: Chủ Đề Nâng Cao
14. [Advanced Data Structures](#advanced-data-structures)
15. [Choosing the Right Data Structure](#choosing-the-right-data-structure)
16. [Real-World Applications](#real-world-applications)
17. [Interview Patterns](#interview-patterns)

---

## 🎯 Introduction to Data Structures

### What Are Data Structures? / Cấu Trúc Dữ Liệu Là Gì?

**English:** Data structures are specialized formats for organizing, processing, retrieving, and storing data. They define the relationship between data elements and the operations that can be performed on them.

**Tiếng Việt:** Cấu trúc dữ liệu là các định dạng chuyên biệt để tổ chức, xử lý, truy xuất và lưu trữ dữ liệu. Chúng định nghĩa mối quan hệ giữa các phần tử dữ liệu và các thao tác có thể thực hiện trên chúng.

### Mind Map: Data Structures Ecosystem

```
                    DATA STRUCTURES
                          |
        +-----------------+-----------------+
        |                                   |
    LINEAR                            NON-LINEAR
        |                                   |
   +----+----+                         +----+----+
   |    |    |                         |    |    |
Array List Stack Queue              Tree Graph Hash
   |    |    |    |                   |    |    |
Static Dynamic LIFO FIFO          Binary DAG Table
                                     |
                                  +--+--+
                                  |     |
                                BST   AVL
```

### Classification / Phân Loại

**1. By Structure / Theo Cấu Trúc:**
- **Linear**: Elements arranged sequentially / Phần tử sắp xếp tuần tự
  - Arrays, Linked Lists, Stacks, Queues
- **Non-Linear**: Hierarchical or networked / Phân cấp hoặc mạng
  - Trees, Graphs, Hash Tables

**2. By Mutability / Theo Tính Thay Đổi:**
- **Static**: Fixed size / Kích thước cố định (Arrays)
- **Dynamic**: Variable size / Kích thước biến đổi (Linked Lists)

**3. By Access Pattern / Theo Mẫu Truy Cập:**
- **Random Access**: O(1) access / Truy cập O(1) (Arrays)
- **Sequential Access**: O(n) access / Truy cập O(n) (Linked Lists)

---

## 💡 Why Data Structures Matter

### Performance Impact / Tác Động Hiệu Suất

```
Problem: Find element in collection of 1,000,000 items
Vấn đề: Tìm phần tử trong tập hợp 1,000,000 mục

Linear Search (Array):     1,000,000 operations / phép toán
Binary Search (Sorted):    20 operations / phép toán
Hash Table Lookup:         1 operation / phép toán

Time saved: 99.998% / Thời gian tiết kiệm: 99.998%
```

### Real-World Analogy / Tương Tự Thực Tế

**English:**
- **Array**: Numbered parking spaces / Chỗ đỗ xe được đánh số
- **Linked List**: Train cars connected / Toa tàu được kết nối
- **Stack**: Stack of plates / Chồng đĩa
- **Queue**: Line at store / Hàng ở cửa hàng
- **Hash Table**: Dictionary / Từ điển
- **Tree**: Family tree / Cây gia đình
- **Graph**: Social network / Mạng xã hội

---

## 📊 Complexity Analysis Overview

### Big O Notation Quick Reference

```
Notation    | Name          | Example Operations
------------|---------------|-------------------
O(1)        | Constant      | Array access, hash lookup
O(log n)    | Logarithmic   | Binary search
O(n)        | Linear        | Array traversal
O(n log n)  | Linearithmic  | Efficient sorting
O(n²)       | Quadratic     | Nested loops
O(2ⁿ)       | Exponential   | Recursive fibonacci
```

### Comparison Table / Bảng So Sánh

```
Data Structure | Access | Search | Insert | Delete | Space
---------------|--------|--------|--------|--------|-------
Array          | O(1)   | O(n)   | O(n)   | O(n)   | O(n)
Linked List    | O(n)   | O(n)   | O(1)*  | O(1)*  | O(n)
Stack          | O(n)   | O(n)   | O(1)   | O(1)   | O(n)
Queue          | O(n)   | O(n)   | O(1)   | O(1)   | O(n)
Hash Table     | N/A    | O(1)** | O(1)** | O(1)** | O(n)
Binary Tree    | O(n)   | O(n)   | O(n)   | O(n)   | O(n)
BST (balanced) | O(log n)| O(log n)| O(log n)| O(log n)| O(n)
Heap           | O(n)   | O(n)   | O(log n)| O(log n)| O(n)

* At head/tail
** Average case
```

---

## 🧠 Memory Management Concepts

### Stack vs Heap Memory

```
STACK MEMORY                    HEAP MEMORY
├── Fast access                 ├── Slower access
├── Limited size                ├── Larger size
├── Automatic management        ├── Manual management
├── LIFO structure              ├── No specific order
└── Stores:                     └── Stores:
    ├── Primitives                  ├── Objects
    ├── Function calls              ├── Arrays
    └── Local variables             └── Dynamic data
```

### Memory Layout Visualization

```
Memory Address    Stack              Heap
0x1000           +--------+
0x1004           | int a  |
0x1008           +--------+
0x100C           | ptr    |--------> +--------+ 0x2000
0x1010           +--------+          | Object |
0x1014           | int b  |          | data   |
0x1018           +--------+          +--------+
```

---

## 📚 ARRAYS - Deep Dive / Mảng - Tìm Hiểu Sâu

### Fundamental Concepts / Khái Niệm Cơ Bản

**English:** Arrays are the most fundamental data structure, providing contiguous memory allocation for elements of the same type. The key advantage is O(1) random access through index calculation.

**Tiếng Việt:** Mảng là cấu trúc dữ liệu cơ bản nhất, cung cấp phân bổ bộ nhớ liên tục cho các phần tử cùng kiểu. Ưu điểm chính là truy cập ngẫu nhiên O(1) thông qua tính toán chỉ số.

### Memory Layout / Bố Trí Bộ Nhớ

```
Array: [10, 20, 30, 40, 50]

Memory:
Address  | Value | Calculation
---------|-------|---------------------------
0x1000   | 10    | base_address + (0 * 4)
0x1004   | 20    | base_address + (1 * 4)
0x1008   | 30    | base_address + (2 * 4)
0x100C   | 40    | base_address + (3 * 4)
0x1010   | 50    | base_address + (4 * 4)

Formula: address = base + (index × element_size)
Công thức: địa_chỉ = cơ_sở + (chỉ_số × kích_thước_phần_tử)
```

