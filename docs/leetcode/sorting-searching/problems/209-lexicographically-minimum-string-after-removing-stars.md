---
layout: page
title: "Lexicographically Minimum String After Removing Stars"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Stack, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/lexicographically-minimum-string-after-removing-stars"
---

# Lexicographically Minimum String After Removing Stars / Chuỗi Nhỏ Nhất Sau Khi Xóa Dấu Sao

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) | [Smallest String After Remove Stars](https://leetcode.com/problems/lexicographically-minimum-string-after-removing-stars)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng xếp hàng chữ cái — khi gặp `*`, bạn phải "bắn" chữ cái nhỏ nhất đứng trước nó ra ngoài hàng (để chuỗi kết quả nhỏ nhất). Nếu có nhiều chữ giống nhau, xóa cái xuất hiện muộn nhất (rightmost) để giữ các cái trước còn đóng góp. Dùng 26 stacks (bucket per char) để tìm char nhỏ nhất + index của nó trong O(26) = O(1).

**Pattern Recognition:**

- Signal: `*` xóa char nhỏ nhất trước nó → **26 stacks + greedy delete rightmost smallest**
- Không dùng heap: 26 buckets cho 26 chữ cái là đủ (alphabet fixed size)
- Đánh dấu "removed" thay vì thực sự xóa → build result cuối một lần

**Visual — s = "aab*c*d":**

```
buckets: a=[], b=[], ...

i=0 'a': buckets[0].push(0)       → a:[0]
i=1 'a': buckets[0].push(1)       → a:[0,1]
i=2 'b': buckets[1].push(2)       → b:[2]
i=3 '*': smallest='a', pop idx=1  → removed[1]=1, removed[3]=1
i=4 'c': buckets[2].push(4)       → c:[4]
i=5 '*': smallest='a', pop idx=0  → removed[0]=1, removed[5]=1
i=6 'd': buckets[3].push(6)       → d:[6]

Result: skip removed={0,1,3,5} → "bcd" ✅
```

---

## Problem Description

Given string `s` with lowercase letters and `*`. Each `*` operation removes the **leftmost** (smallest, rightmost among ties) non-star character to its left. Return the final string after all `*`s are processed (no `*` in result).

```
Example 1: s = "aab*c*d"  → "bcd"
Example 2: s = "abc"      → "abc"
Example 3: s = "d*"       → ""
Example 4: s = "ba*"      → "b"
```

---

## 📝 Interview Tips

1. **Tại sao 26 stacks?** Fixed alphabet → O(26) = O(1) per star, better than heap O(log n)
2. **Rightmost trước**: Trong nhiều char giống nhau, xóa index muộn nhất → giữ thứ tự ổn định
3. **removed array**: Dùng boolean array mark thay vì splice → tránh O(n) per operation
4. **Hỏi ngay**: "Có đảm bảo `*` luôn có char trước không?" → Problem guarantees yes
5. **Hỏi follow-up**: "Nếu `**` xóa 2 chars?" → Mở rộng logic tương tự
6. **Complexity**: Time O(n), Space O(n) — một lượt duyệt + 26 stacks

---

## Solutions

```typescript
/**
 * Solution 1: Min-Heap approach
 * Time O(n log n), Space O(n)
 *
 * Heap stores [char, index]. For each *, pop smallest (rightmost on tie).
 */
function clearStarsHeap(s: string): string {
  // Min-heap: [charCode, index] — sort by char asc, then index desc
  type Item = [number, number];
  const heap: Item[] = [];
  const sift = (i: number) => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] < heap[i][0] || (heap[p][0] === heap[i][0] && heap[p][1] > heap[i][1])) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = (): Item => {
    const top = heap[0];
    heap[0] = heap.pop()!;
    let i = 0;
    while (true) {
      let s = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      const better = (a: number, b: number) =>
        heap[a][0] < heap[b][0] || (heap[a][0] === heap[b][0] && heap[a][1] > heap[b][1]);
      if (l < heap.length && better(l, s)) s = l;
      if (r < heap.length && better(r, s)) s = r;
      if (s === i) break;
      [heap[i], heap[s]] = [heap[s], heap[i]];
      i = s;
    }
    return top;
  };

  const removed = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "*") {
      heap.push([s.charCodeAt(i), i]);
      sift(heap.length - 1);
    } else {
      removed[i] = 1;
      if (heap.length) removed[pop()[1]] = 1;
    }
  }
  let result = "";
  for (let i = 0; i < s.length; i++) if (!removed[i]) result += s[i];
  return result;
}

/**
 * Solution 2: 26 Buckets / Stacks (Optimal)
 * Time O(n), Space O(n)
 *
 * One stack per letter. Each * finds the smallest non-empty bucket
 * and pops its last index (rightmost occurrence = lexicographically best).
 */
function clearStars(s: string): string {
  const buckets: number[][] = Array.from({ length: 26 }, () => []);
  const removed = new Uint8Array(s.length);

  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "*") {
      buckets[s.charCodeAt(i) - 97].push(i);
    } else {
      removed[i] = 1;
      // find smallest non-empty bucket
      for (let c = 0; c < 26; c++) {
        if (buckets[c].length > 0) {
          removed[buckets[c].pop()!] = 1;
          break;
        }
      }
    }
  }

  let result = "";
  for (let i = 0; i < s.length; i++) if (!removed[i]) result += s[i];
  return result;
}

// --- Quick inline tests ---
console.log(clearStars("aab*c*d")); // "bcd"
console.log(clearStars("abc")); // "abc"
console.log(clearStars("d*")); // ""
console.log(clearStars("ba*")); // "b"
console.log(clearStarsHeap("aab*c*d")); // "bcd"
```

---

## 🔗 Related Problems

| Problem                                                                                                                                             | Relationship                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [3170. Lexicographically Minimum String After Removing Stars](https://leetcode.com/problems/lexicographically-minimum-string-after-removing-stars/) | This problem                            |
| [1047. Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/)                           | Stack-based string removal              |
| [316. Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/)                                                            | Greedy lexicographic minimization       |
| [402. Remove K Digits](https://leetcode.com/problems/remove-k-digits/)                                                                              | Remove chars to get lex smallest result |
| [1209. Remove All Adjacent Duplicates in String II](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/)                     | Stack counting for removal              |
