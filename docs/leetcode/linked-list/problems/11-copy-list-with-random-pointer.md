---
layout: page
title: "Copy List with Random Pointer"
difficulty: Medium
category: Linked List
tags: [Linked List, Hash Table, Two Pointers]
leetcode_url: "https://leetcode.com/problems/copy-list-with-random-pointer/"
---

# Copy List with Random Pointer / Sao Chép Danh Sách Với Con Trỏ Ngẫu Nhiên

> **Track**: Blind 75 | **Difficulty**: 🟡 Medium
> **Pattern**: HashMap Node Mapping / Interweaving | **Frequency**: 📗 Tier 1
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Tiếng Việt):** Hãy tưởng tượng bạn phải photo một mạng lưới bạn bè, mỗi người (node) có một người bạn thân ngẫu nhiên (random pointer). Cách tiếp cận: lần 1 photo tất cả mọi người và lập danh sách "bản gốc → bản copy". Lần 2 dùng danh sách đó để gán đúng bạn thân cho bản copy.

**Pattern Recognition:**

- Random pointer có thể chỉ đến BẤT KỲ node nào → cần mapping trước khi gán
- **HashMap approach:** 2 lần duyệt — lần 1 tạo tất cả nodes, lần 2 gán pointers
- **Interweave approach:** Chèn copy node xen kẽ node gốc (1→1'→2→2'→3→3'), dùng vị trí để tìm copy, rồi tách ra — O(1) space

**ASCII Visual:**

```
Original:  7 → 13 → 11 → 10 → 1 → null
random:    7→null  13→7  11→1  10→11  1→7

HashMap (oldNode → newNode):
  {7→7', 13→13', 11→11', 10→10', 1→1'}

Interweave step 1: insert copies
  7 → 7' → 13 → 13' → 11 → 11' → ...

Step 2: set random:  7'.random = 7.random.next (= null)
                     13'.random = 13.random.next (= 7')

Step 3: separate back to two lists
```

## Problem Description

A linked list where each node has `val`, `next`, and `random` (points to any node or null).

Return a **deep copy** — all new nodes, no pointers into original list.

**Example:**

```
Input:  [[7,null],[13,0],[11,4],[10,2],[1,0]]
         val   random_index

Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
        (identical structure, completely new nodes)
```

**Constraints:** 0 ≤ n ≤ 1000. -10^4 ≤ val ≤ 10^4.

## 📝 Interview Tips

- 🇻🇳 **Tại sao cần 2 lần duyệt?** — Lần 1 tạo tất cả nodes trước; lần 2 mới có thể gán random vì node đích đã tồn tại
- 🇬🇧 **Two-pass is necessary** — random may point to a node not yet created in a single pass
- 🇻🇳 **Interweave là O(1) space** nhưng tạm thời mutate list gốc — hỏi interviewer có cho phép không
- 🇬🇧 **Interweave approach** achieves O(1) extra space by temporarily modifying the original list
- 🇻🇳 **Đây là bài deep copy graph** — random pointers biến list thành graph; DFS/BFS với memoization cũng hợp lệ
- 🇬🇧 **Frame it as graph cloning** — same as LC #133 Clone Graph; the HashMap approach is identical

## Solutions

{% raw %}

```typescript
class RandomListNode {
  val: number;
  next: RandomListNode | null;
  random: RandomListNode | null;
  constructor(val = 0, next: RandomListNode | null = null, random: RandomListNode | null = null) {
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

/**
 * Solution 1: HashMap Two-Pass (Standard, interview expected)
 * Pass 1: create copies. Pass 2: wire next + random pointers.
 * Time: O(n) | Space: O(n)
 */
function copyRandomList(head: RandomListNode | null): RandomListNode | null {
  if (!head) return null;

  const map = new Map<RandomListNode, RandomListNode>();

  // Pass 1: create all clones
  let cur: RandomListNode | null = head;
  while (cur) {
    map.set(cur, new RandomListNode(cur.val));
    cur = cur.next;
  }

  // Pass 2: wire pointers
  cur = head;
  while (cur) {
    const clone = map.get(cur)!;
    clone.next = cur.next ? map.get(cur.next)! : null;
    clone.random = cur.random ? map.get(cur.random)! : null;
    cur = cur.next;
  }

  return map.get(head)!;
}

/**
 * Solution 2: Interweaving — O(1) Space
 * Step 1: interleave copies (1→1'→2→2'→3→3')
 * Step 2: set random via adjacent positions
 * Step 3: separate original and copy lists
 * Time: O(n) | Space: O(1) extra
 */
function copyRandomListO1(head: RandomListNode | null): RandomListNode | null {
  if (!head) return null;

  // Step 1: interleave
  let cur: RandomListNode | null = head;
  while (cur) {
    const clone = new RandomListNode(cur.val, cur.next, null);
    cur.next = clone;
    cur = clone.next;
  }

  // Step 2: set random pointers (copy.random = original.random.next)
  cur = head;
  while (cur) {
    if (cur.random) cur.next!.random = cur.random.next;
    cur = cur.next!.next;
  }

  // Step 3: separate lists
  const dummy = new RandomListNode(0);
  let copyTail = dummy;
  cur = head;
  while (cur) {
    const clone = cur.next!;
    cur.next = clone.next; // restore original
    copyTail.next = clone;
    copyTail = clone;
    cur = cur.next;
  }

  return dummy.next;
}

// Inline tests
const n1 = new RandomListNode(7);
const n2 = new RandomListNode(13);
const n3 = new RandomListNode(11);
n1.next = n2;
n2.next = n3;
n2.random = n1;
n3.random = n1; // 13→7, 11→7

const copy1 = copyRandomList(n1);
console.assert(copy1 !== n1, "deep copy: different reference");
console.assert(copy1!.val === 7, "head val");
console.assert(copy1!.next!.random !== n1, "random points to copy, not original");
console.assert(copy1!.next!.random!.val === 7, "random val correct");

const copy2 = copyRandomListO1(new RandomListNode(7, new RandomListNode(13), null));
console.assert(copy2!.val === 7 && copy2!.next!.val === 13, "O1 copy");

// null case
console.assert(copyRandomList(null) === null, "null");
```

{% endraw %}

## 🔗 Related Problems

- [133. Clone Graph](https://leetcode.com/problems/clone-graph/) — identical HashMap pattern, different data structure
- [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) — this problem
- [1485. Clone Binary Tree With Random Pointer](https://leetcode.com/problems/clone-binary-tree-with-random-pointer/) — same idea on trees
- [1490. Clone N-ary Tree](https://leetcode.com/problems/clone-n-ary-tree/) — DFS clone pattern on N-ary tree
