---
layout: page
title: "String Without AAA or BBB"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/string-without-aaa-or-bbb"
---

# String Without AAA or BBB / Chuỗi Không Có AAA Hoặc BBB

> **Track**: String | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: Medium — bài luyện tư duy tham lam và chứng minh tính đúng đắn
> **See also**: [Reorganize String](https://leetcode.com/problems/reorganize-string) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang xếp chỗ ngồi trong lớp học — có `a` học sinh tên An và `b` học sinh tên Bình. Quy định là không được để quá 2 người cùng tên ngồi liên tiếp nhau. Chiến lược tham lam: luôn cho 2 người của nhóm đông hơn ngồi trước (nếu nhóm còn ≥ 2 chỗ), rồi xen 1 người của nhóm ít hơn vào. Nếu bằng nhau thì xếp luân phiên 1-1. Điều này đảm bảo không bao giờ có 3 người cùng nhóm liên tiếp.

**Pattern Recognition:**

- Signal: "avoid 3 consecutive same chars" + "use all a and b" → **Greedy: always place majority first**
- Bài này thuộc dạng xây dựng chuỗi tham lam — luôn chọn ký tự nhiều hơn (tối đa 2 liên tiếp)
- Key insight: nếu last-2 chars giống nhau thì buộc phải dùng ký tự kia; nếu không thì dùng ký tự có count cao hơn

**Visual — a=4, b=1 example:**

```
ra=4, rb=1, res=[]

Step 1: ra>rb, last-2 not same → append 'a', ra=3  res="a"
Step 2: ra>rb, last-2 not same → append 'a', ra=2  res="aa"
Step 3: last-2="aa" (forced!) → append 'b', rb=0   res="aab"
Step 4: ra>rb=0, last-2="ab" → append 'a', ra=1    res="aaba"
Step 5: ra>rb=0, last-2="ba" → append 'a', ra=0    res="aabaa"

Result: "aabaa" ✅  (no "aaa", no "bbb")
```

---

## Problem Description

Given integers `a` and `b`, return **any** string `s` such that: `s` has length `a+b`, contains exactly `a` 'a's and `b` 'b's, and neither `"aaa"` nor `"bbb"` appears as a substring. It is guaranteed that a valid answer exists. ([LeetCode](https://leetcode.com/problems/string-without-aaa-or-bbb))

```
Example 1: a=1, b=2 → "abb"  (or "bab", "bba")
Example 2: a=4, b=1 → "aabaa"
Example 3: a=3, b=3 → "ababab"
```

Constraints: `0 <= a, b <= 100`, it is guaranteed a valid string exists.

---

## 📝 Interview Tips

1. **"Greedy: always use the character with higher remaining count"** — _Luôn dùng ký tự còn nhiều hơn — điều này tối ưu vì ngăn ký tự đó tích lũy quá nhiều._
2. **"Hard constraint: if last-2 are same, must use the other"** — _Nếu đã có "aa", bắt buộc phải dùng 'b' tiếp theo — đây là điều kiện ưu tiên cao nhất._
3. **"No need to backtrack — greedy always works"** — _Với điều kiện |a-b| không quá lớn, greedy không bao giờ dẫn vào ngõ cụt._
4. **"Multiple valid answers — any valid result is accepted"** — _Đề bài chấp nhận bất kỳ chuỗi hợp lệ nào — không cần unique answer._
5. **"Variant: at most 2 consecutive same chars"** — _Đây là pattern chung cho bài "reorganize string" và "task scheduler"._
6. **"Edge: a=0 or b=0"** — _Nếu một bên =0, chỉ có thể dùng ký tự kia — tối đa 2 liên tiếp là ổn._

---

## Solutions

```typescript
/** Solution 1: Greedy — always pick majority, force switch at 2-in-a-row  @complexity Time: O(a+b) | Space: O(a+b) */
function strWithout3a3b(a: number, b: number): string {
  const res: string[] = [];
  let ra = a,
    rb = b;
  while (ra > 0 || rb > 0) {
    const n = res.length;
    const lastTwo = n >= 2 ? res[n - 2] + res[n - 1] : "";
    if (lastTwo === "aa") {
      // forced: must use 'b'
      res.push("b");
      rb--;
    } else if (lastTwo === "bb") {
      // forced: must use 'a'
      res.push("a");
      ra--;
    } else if (ra >= rb) {
      res.push("a");
      ra--;
    } else {
      res.push("b");
      rb--;
    }
  }
  return res.join("");
}

/** Solution 2: Place 2-of-majority then 1-of-minority  @complexity Time: O(a+b) | Space: O(a+b) */
function strWithout3a3b2(a: number, b: number): string {
  let ra = a,
    rb = b;
  const parts: string[] = [];
  while (ra > 0 || rb > 0) {
    if (ra > rb) {
      // place up to 2 'a's then 1 'b'
      const take = Math.min(2, ra);
      parts.push("a".repeat(take));
      ra -= take;
      if (rb > 0) {
        parts.push("b");
        rb--;
      }
    } else if (rb > ra) {
      const take = Math.min(2, rb);
      parts.push("b".repeat(take));
      rb -= take;
      if (ra > 0) {
        parts.push("a");
        ra--;
      }
    } else {
      // equal: alternate 1-1
      if (ra > 0) {
        parts.push("a");
        ra--;
      }
      if (rb > 0) {
        parts.push("b");
        rb--;
      }
    }
  }
  return parts.join("");
}

// === Test Cases ===
console.log(strWithout3a3b(1, 2)); // "abb" or similar
console.log(strWithout3a3b(4, 1)); // "aabaa"
console.log(strWithout3a3b(3, 3)); // "ababab" or similar
console.log(strWithout3a3b2(1, 2)); // valid result
console.log(strWithout3a3b2(0, 3)); // "bb" + "b" = "bbb"? No: take=2 "bb", rb=1; then no 'a', "bb"+"b"="bbb" issue?
// Actually a=0,b=3: rb>ra → take=2 "bb", rb=1; rb>ra=0 → take=1 "b", rb=0 → "bbb" INVALID!
// Edge: guarantee says valid answer exists; a=0,b=3 is invalid input → not given by constraints
```

---

## 🔗 Related Problems

| #    | Problem                           | Difficulty | Pattern       |
| ---- | --------------------------------- | ---------- | ------------- |
| 767  | Reorganize String                 | Medium     | Greedy / Heap |
| 621  | Task Scheduler                    | Medium     | Greedy        |
| 1405 | Longest Happy String              | Medium     | Greedy / Heap |
| 358  | Rearrange String k Distance Apart | Hard       | Greedy / Heap |
