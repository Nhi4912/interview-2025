---
layout: page
title: "Add Two Numbers"
difficulty: Medium
category: Linked List
tags: [Linked List, Math, Recursion, Dummy Node]
leetcode_url: "https://leetcode.com/problems/add-two-numbers/"
---

# Add Two Numbers / Cộng Hai Số Dưới Dạng Danh Sách Liên Kết

> **Track**: Blind 75 | **Difficulty**: 🟡 Medium
> **Pattern**: Simulation with Dummy Head + Carry | **Frequency**: 📗 Tier 1
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Tiếng Việt):** Giống như bạn cộng tay hai số nguyên từ hàng đơn vị đến hàng chục — cộng từng chữ số, ghi nhớ số nhớ (carry), rồi chuyển sang vị trí tiếp theo. Linked list đã lưu sẵn theo thứ tự ngược (hàng đơn vị trước), nên ta chỉ cần duyệt thẳng từ đầu.

**Pattern Recognition:**

- Hai list không cùng độ dài → dùng `? :` để xử lý khi một list hết trước
- Carry có thể tạo ra node mới sau khi cả hai list hết (ví dụ: 9+9+9 → carry=1 còn lại)
- Dummy head → tránh điều kiện đặc biệt cho node đầu tiên

**ASCII Visual:**

```
l1:  2 → 4 → 3  (342)
l2:  5 → 6 → 4  (465)
              ↓ add digit by digit
     7 → 0 → 8  (807)

carry trace:
  2+5=7 carry=0  → node(7)
  4+6=10 carry=1 → node(0)
  3+4+1=8 carry=0 → node(8)
```

## Problem Description

Two non-empty linked lists represent non-negative integers stored in **reverse order** (least significant digit first). Add the two numbers and return the sum as a linked list.

**Example 1:**

```
Input:  l1 = [2,4,3]  (= 342)
        l2 = [5,6,4]  (= 465)
Output: [7,0,8]       (= 807)
```

**Example 2:**

```
Input:  l1 = [9,9,9,9,9,9,9]
        l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

**Constraints:** 1 ≤ list lengths ≤ 100. No leading zeros except `[0]`.

## 📝 Interview Tips

- 🇻🇳 **Dummy node là must-have** — giúp tránh xử lý đặc biệt cho head của kết quả, code gọn hơn nhiều
- 🇬🇧 **Always use a dummy head** — avoids special-casing the result list's first node
- 🇻🇳 **Điều kiện vòng lặp:** `while (l1 || l2 || carry)` — nhớ xử lý carry thừa sau khi cả hai list hết
- 🇬🇧 **Loop condition** `while(l1 || l2 || carry)` handles unequal lengths AND leftover carry in one clean expression
- 🇻🇳 **Ví dụ carry thừa:** `[9] + [1]` → `[0,1]` — phải tạo thêm node cho carry
- 🇬🇧 **Recursive approach** is elegant for interviews but risks stack overflow for 100-node lists — mention the tradeoff

## Solutions

{% raw %}

```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Solution 1: Iterative with Dummy Head (Optimal, interview standard)
 * Simulate grade-school addition digit by digit.
 * Time: O(max(m, n)) | Space: O(max(m, n)) for result list
 */
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    carry = Math.floor(sum / 10);
    cur.next = new ListNode(sum % 10);
    cur = cur.next;
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }

  return dummy.next;
}

/**
 * Solution 2: Recursive (elegant, same complexity)
 * Each recursive call handles one digit position.
 * Time: O(max(m, n)) | Space: O(max(m, n)) call stack
 */
function addTwoNumbersRec(l1: ListNode | null, l2: ListNode | null, carry = 0): ListNode | null {
  if (!l1 && !l2 && carry === 0) return null;

  const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
  const node = new ListNode(sum % 10);
  node.next = addTwoNumbersRec(l1?.next ?? null, l2?.next ?? null, Math.floor(sum / 10));
  return node;
}

// Inline tests
const mk = (a: number[]) =>
  a.reduceRight<ListNode | null>((next, val) => new ListNode(val, next), null);
const toArr = (h: ListNode | null) => {
  const r: number[] = [];
  while (h) {
    r.push(h.val);
    h = h.next;
  }
  return r;
};

// 342 + 465 = 807
console.assert(
  JSON.stringify(toArr(addTwoNumbers(mk([2, 4, 3]), mk([5, 6, 4])))) === "[7,0,8]",
  "342+465=807",
);
// 0 + 0 = 0
console.assert(JSON.stringify(toArr(addTwoNumbers(mk([0]), mk([0])))) === "[0]", "0+0=0");
// carry overflow: 9999999 + 9999
console.assert(
  JSON.stringify(toArr(addTwoNumbers(mk([9, 9, 9, 9, 9, 9, 9]), mk([9, 9, 9, 9])))) ===
    "[8,9,9,9,0,0,0,1]",
  "carry overflow",
);

console.assert(JSON.stringify(toArr(addTwoNumbersRec(mk([2, 4, 3]), mk([5, 6, 4])))) === "[7,0,8]");
```

{% endraw %}

## 🔗 Related Problems

- [445. Add Two Numbers II](https://leetcode.com/problems/add-two-numbers-ii/) — digits in forward order (needs stack or reversal)
- [415. Add Strings](https://leetcode.com/problems/add-strings/) — same logic but with string inputs
- [43. Multiply Strings](https://leetcode.com/problems/multiply-strings/) — harder variant with multiplication
- [67. Add Binary](https://leetcode.com/problems/add-binary/) — same carry pattern for binary
