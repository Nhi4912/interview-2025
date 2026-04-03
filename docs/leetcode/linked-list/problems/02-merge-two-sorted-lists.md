---
layout: page
title: "Merge Two Sorted Lists"
difficulty: Easy
category: Linked List
tags: [Linked List, Two Pointers, Merge]
leetcode_url: "https://leetcode.com/problems/merge-two-sorted-lists/"
leetcode_number: 21
pattern: "Dummy Node + Merge"
frequency_tier: 1
companies: [Amazon, Microsoft, Google, Apple, Meta]
target_time_minutes: 10
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Merge Two Sorted Lists / Gộp Hai Danh Sách Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Dummy Node + Merge
> **Frequency**: 🔥 Tier 1 — Gặp >90% interviews | **Target**: ⏱️ 10 min
> **Companies**: Amazon, Microsoft, Google, Apple, Meta
> **See also**: [Reverse Linked List](./01-reverse-linked-list.md) | [Merge K Sorted Lists](./12-merge-k-sorted-lists.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến hai hàng người xếp hàng vào rạp chiếu phim, mỗi hàng đã được sắp theo chiều cao. Bảo vệ đứng ở đầu chọn người thấp hơn ở đầu mỗi hàng cho vào trước. Khi một hàng hết người, cả phần còn lại của hàng kia vào thẳng — không cần kiểm tra thêm.

**Pattern Recognition:**

- Signal: "merge two sorted / gộp hai danh sách đã sắp" → **Dummy Node + Two Pointer Walk**
- Dummy node loại bỏ xử lý đặc biệt cho node đầu tiên của kết quả
- Khi một list hết, nối thẳng list còn lại — không cần duyệt từng node

**Visual — Merge [1→2→4] and [1→3→4]:**

```
dummy→?   p1=1→2→4   p2=1→3→4

Step 1: p1(1) <= p2(1) → pick p1  →  dummy→1       p1=2→4
Step 2: p1(2) >  p2(1) → pick p2  →  dummy→1→1     p2=3→4
Step 3: p1(2) <= p2(3) → pick p1  →  dummy→1→1→2   p1=4
Step 4: p1(4) >  p2(3) → pick p2  →  dummy→1→1→2→3 p2=4
Step 5: p1(4) <= p2(4) → pick p1  →  p1=null → attach p2=4
Result: dummy.next = 1→1→2→3→4→4 ✅
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| **When you see** | "merge sorted lists", "combine two ordered sequences"                       |
| **Think**        | Dummy node + compare heads, pick smaller, advance pointer                   |
| **Template**     | `dummy = new Node(0); while (l1 && l2) pick smaller; tail.next = l1 ?? l2;` |
| **Time target**  | ⏱️ 10 min (Easy)                                                            |

> 💡 **Memory hook / Móc nhớ:** "Dummy node = người giữ chỗ — không cần lo ai đứng đầu!"

---

## Problem Description

Given heads of two sorted linked lists, merge them into one sorted list by splicing nodes from both lists. Return the head of the merged list.

```
Example 1: [1,2,4] + [1,3,4] → [1,1,2,3,4,4]
Example 2: [] + []           → []
Example 3: [] + [0]          → [0]
```

Constraints:

- Nodes in each list: `[0, 50]`
- `-100 <= Node.val <= 100`
- Both lists sorted in non-decreasing order

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1 min)

> "We have two sorted linked lists. We need to merge them into one sorted list
> by reusing existing nodes, not creating new ones.
> Clarification: Can values be equal? Can either list be empty?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2 min)

> "Brute force: collect all values, sort, rebuild — O((n+m) log(n+m)).
> But since both are already sorted, I can merge in one pass like merge sort.
> I'll use a dummy node to avoid special-casing the head, then walk both lists.
> O(n+m) time, O(1) space. Shall I code this?"

### Step 3 — Implement / Viết Code (3-5 min)

> "I'll create a dummy node and a tail pointer.
> While both lists have nodes, compare heads and attach the smaller one.
> When one list is exhausted, attach the remainder of the other."

### Step 4 — Review / Kiểm Tra (1 min)

> "Trace [1,2,4] + [1,3,4]: pick 1(l1), pick 1(l2), pick 2(l1),
> pick 3(l2), pick 4(l1), l1 null → attach 4(l2). Result: [1,1,2,3,4,4]. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n+m) — visit each node once. Space: O(1) — only dummy and tail pointer.
> Edge cases: one or both empty, all elements in one list smaller.
> Follow-up: Merge K lists → use min-heap or divide & conquer."

---

## 📝 Interview Tips

1. **Clarify**: Can lists be empty? Can values be equal? / Danh sách có thể rỗng? Giá trị trùng?
2. **Dummy node**: Eliminates head special-case — mention this insight / Dummy node bỏ xử lý đặc biệt
3. **Optimize**: Iterative O(1) space vs recursive O(n+m) stack / Iterative tối ưu hơn về bộ nhớ
4. **Edge cases**: One or both empty; all same values / Một hoặc cả hai rỗng; tất cả giá trị bằng nhau
5. **Follow-up**: Merge K sorted lists? → min-heap O(n log k) / Gộp K danh sách dùng heap

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                       | Why Wrong / Tại sao sai                      | Fix / Cách sửa                                       |
| --- | --------------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| 1   | No dummy node — special-case first node | Messy code with extra if-statements for head | Use dummy node, return `dummy.next`                  |
| 2   | Forget to attach remaining list         | When one list ends, remaining nodes are lost | `tail.next = l1 ?? l2` after the loop                |
| 3   | Create new nodes instead of splicing    | Wastes O(n+m) space and misses the point     | Reuse existing nodes by reassigning `.next` pointers |

---

## Solutions

```typescript
interface ListNode {
  val: number;
  next: ListNode | null;
}

/**
 * Solution 1: Recursive
 * Time: O(n + m) — visit each node once
 * Space: O(n + m) — recursion call stack
 */
function mergeTwoListsRecursive(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  if (!list1) return list2;
  if (!list2) return list1;

  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  }
  list2.next = mergeTwoListsRecursive(list1, list2.next);
  return list2;
}

/**
 * Solution 2: Iterative with Dummy Node (Optimal)
 * Time: O(n + m) — single pass through both lists
 * Space: O(1) — only dummy node + tail pointer
 */
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy: ListNode = { val: 0, next: null };
  let tail = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  tail.next = list1 ?? list2;
  return dummy.next;
}

// === Test Cases ===
const l1: ListNode = { val: 1, next: { val: 2, next: { val: 4, next: null } } };
const l2: ListNode = { val: 1, next: { val: 3, next: { val: 4, next: null } } };
console.log(mergeTwoLists(l1, l2)); // 1→1→2→3→4→4
console.log(mergeTwoLists(null, null)); // null
```

---

## 🔗 Related Problems

- [Reverse Linked List](./01-reverse-linked-list.md) — fundamental linked list pointer manipulation
- [Merge K Sorted Lists](./12-merge-k-sorted-lists.md) — extension using heap or divide & conquer
- [Sort List](https://leetcode.com/problems/sort-list/) — merge sort on linked list uses this as subroutine
- [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) — same concept on arrays

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 10 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
