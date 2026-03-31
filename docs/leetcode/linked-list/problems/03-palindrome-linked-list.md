---
layout: page
title: "Palindrome Linked List"
difficulty: Easy
category: Linked List
tags: [Linked List, Two Pointers, Fast/Slow Pointer]
leetcode_url: "https://leetcode.com/problems/palindrome-linked-list/"
---

# Palindrome Linked List / Danh Sách Liên Kết Đối Xứng

> **Track**: Blind 75 | **Difficulty**: 🟢 Easy
> **Pattern**: Fast/Slow Pointer + Reverse | **Frequency**: 📘 Tier 2
> **See also**: [Table of Contents](../../../00-table-of-contents.md)

## 🧠 Intuition / Tư Duy

**Analogy (Tiếng Việt):** Hãy tưởng tượng bạn gấp đôi một tờ giấy — nếu nó là đối xứng, hai nửa sẽ khớp hoàn toàn. Với linked list, ta "gấp" tại điểm giữa: đảo ngược nửa sau rồi so sánh từng ký tự với nửa đầu.

**Pattern Recognition:**

- Cần tìm giữa list → Fast/Slow pointer
- So sánh hai nửa mà không dùng thêm bộ nhớ → Đảo ngược nửa sau tại chỗ
- O(1) space yêu cầu bắt buộc phải mutate list (có thể restore sau)

**ASCII Visual:**

```
Input:  1 → 2 → 2 → 1 → null
              ↑ slow stops here (middle)

Reverse 2nd half:
        1 → 2    1 → 2 → null  (reversed)

Compare:
        1 == 1 ✓
        2 == 2 ✓  → palindrome!
```

## Problem Description

Given the `head` of a singly linked list, return `true` if it is a **palindrome**, `false` otherwise.

**Example 1:**

```
Input:  1 → 2 → 2 → 1
Output: true
```

**Example 2:**

```
Input:  1 → 2
Output: false
```

**Constraints:** `1 <= n <= 10^5`, `0 <= Node.val <= 9`

## 📝 Interview Tips

- 🇻🇳 **Hỏi ngay:** "Có được phép thay đổi list không?" — nếu không, phải restore sau khi check hoặc dùng mảng
- 🇬🇧 **Clarify:** "Can I modify the list?" — O(1) space requires in-place reversal (then restore)
- 🇻🇳 **Slow pointer dừng đâu?** — Với `while(fast.next && fast.next.next)`: list chẵn thì slow ở node n/2-1, list lẻ thì ở node giữa
- 🇬🇧 **Edge cases:** single node and two-node list always trivial — return early
- 🇻🇳 **Lý do đảo nửa sau, không phải nửa trước:** head vẫn trỏ đến đầu, dễ so sánh hơn
- 🇬🇧 **Follow-up:** O(n) space solution (array) is easier to code — mention both, implement optimal

## Solutions

```typescript

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
 * Solution 1: Reverse Second Half (Optimal)
 * Find middle via fast/slow, reverse 2nd half, compare.
 * Time: O(n) | Space: O(1)
 */
function isPalindrome(head: ListNode | null): boolean {
  if (!head || !head.next) return true;

  // Step 1: Find middle
  let slow = head,
    fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // Step 2: Reverse second half
  let prev: ListNode | null = null;
  let curr = slow.next;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  // Step 3: Compare halves
  let left = head,
    right = prev;
  while (right) {
    if (left!.val !== right.val) return false;
    left = left!.next;
    right = right.next;
  }
  return true;
}

/**
 * Solution 2: Array Conversion (Simple, interview-friendly start)
 * Dump values to array, use two pointers to check.
 * Time: O(n) | Space: O(n)
 */
function isPalindromeArray(head: ListNode | null): boolean {
  const vals: number[] = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }

  let l = 0,
    r = vals.length - 1;
  while (l < r) {
    if (vals[l++] !== vals[r--]) return false;
  }
  return true;
}

// Inline tests
const make = (a: number[]) =>
  a.reduceRight<ListNode | null>((next, val) => new ListNode(val, next), null);

console.assert(isPalindrome(make([1, 2, 2, 1])) === true, "even palindrome");
console.assert(isPalindrome(make([1, 2, 3, 2, 1])) === true, "odd palindrome");
console.assert(isPalindrome(make([1, 2])) === false, "not palindrome");
console.assert(isPalindrome(make([1])) === true, "single node");

console.assert(isPalindromeArray(make([1, 2, 2, 1])) === true);
console.assert(isPalindromeArray(make([1, 2])) === false);
```

```

## 🔗 Related Problems

- [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) — core sub-routine used here
- [876. Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) — step 1 of this solution
- [143. Reorder List](https://leetcode.com/problems/reorder-list/) — same find-middle + reverse pattern
- [234. Palindrome Number](https://leetcode.com/problems/palindrome-number/) — simpler numeric variant
