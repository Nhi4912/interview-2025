---
layout: page
title: "Earliest Second to Mark Indices I"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/earliest-second-to-mark-indices-i"
---

# earliest second to mark indices i

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn quản lý kho hàng với nhiều kiện (`nums`). Mỗi kiện cần "dỡ bỏ" (về 0) trước khi đóng dấu. Mỗi giây bạn chỉ làm **một việc**: giảm 1 đơn vị từ một kiện, **hoặc** đóng dấu kiện đã trống. Lịch đóng dấu (`changeIndices`) quy định giây nào bạn có cơ hội đóng dấu kiện nào. Câu hỏi: giây **sớm nhất** nào mà tất cả kiện đều được đóng dấu?

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums = [2,2,0]   changeIndices = [2,2,1,2,1,2,1,3]   → answer = 8

Binary search: check t=8 feasible?
  Last occurrence per index in [0..7]:
    idx 1 → s=6,  idx 2 → s=5,  idx 3 → s=7

  Greedy right-to-left (accumulate freeOps, spend at last occurrences):
  s=7: last[3], need nums[2]=0 ops → mark idx3 ✓  freeOps=0
  s=6: last[1], need nums[0]=2 ops, have 0 → can't mark, freeOps=1
  s=5: last[2], need nums[1]=2 ops, have 1 → can't mark, freeOps=2
  s=4: not last → freeOps=3
  s=3: not last → freeOps=4
  s=2: not last → freeOps=5
  s=1: not last → freeOps=6   ← now have 6 free ops
  s=0: not last → freeOps=7

  Second pass: idx1 needs 2 ops (have 6 ✓), idx2 needs 2 ops (have 4 ✓)
  All 3 marked → feasible ✓  →  answer = 8
```

---

## Problem Description

Cho mảng `nums` (n phần tử) và `changeIndices` (m phần tử, 1-indexed). Mỗi giây `s` (1..m) bạn chọn **một** hành động:

- Giảm `nums[i]` đi 1 (với bất kỳ `i` còn > 0)
- Đánh dấu `changeIndices[s-1]` nếu `nums[changeIndices[s-1]-1] === 0`

Trả về giây **sớm nhất** mà tất cả chỉ số đều được đánh dấu, hoặc `-1` nếu không thể.

**Ví dụ 1:**

```
Input:  nums = [2,2,0], changeIndices = [2,2,1,2,1,2,1,3]
Output: 8
```

**Ví dụ 2:**

```
Input:  nums = [0,0,0], changeIndices = [1,2,3]
Output: 3
```

**Ràng buộc:** `1 ≤ n ≤ 5000`, `1 ≤ m ≤ 5000`, `0 ≤ nums[i] ≤ 1000`, `1 ≤ changeIndices[i] ≤ n`

---

## 📝 Interview Tips

1. **Binary search on the answer** — if t seconds is feasible then t+1 also is; monotone property enables binary search. | Nếu t giây khả thi thì t+1 cũng vậy → dùng nhị phân trên đáp án.
2. **Greedy: only last occurrence matters** — earlier appearances of an index can be ignored when assigning the mark second. | Chỉ lần xuất hiện cuối cùng của mỗi chỉ số mới được dùng để đóng dấu.
3. **Count free ops right-to-left** — seconds not used for marking accumulate as decrement budget. | Quét từ phải sang trái để tích lũy lượt tự do trước khi gặp lần xuất hiện cuối.
4. **Spend decrements early, mark late** — all `nums[i]` decrements must happen _before_ the mark second. | Toàn bộ lượt giảm phải xảy ra _trước_ giây đóng dấu.
5. **Check total budget** — need Σnums[i] decrement ops + n mark ops ≤ t total seconds. | Điều kiện cần: tổng lượt giảm + n giây đóng dấu ≤ t.
6. **Edge: nums[i] === 0** — zero-value indices only need the mark second, no decrement budget needed. | Khi `nums[i]=0`, chỉ cần 1 giây đóng dấu, không cần lượt giảm.

---

## Solutions

```typescript
/**
 * Solution 1: Binary Search + Greedy Feasibility Check
 * @complexity Time O((n+m)·log m), Space O(n)
 */
function earliestSecondToMarkIndices(nums: number[], changeIndices: number[]): number {
  const n = nums.length;
  const m = changeIndices.length;

  function canFinish(t: number): boolean {
    // Find last occurrence of each 1-indexed element in [0..t-1]
    const lastOcc = new Array(n + 1).fill(-1);
    for (let s = 0; s < t; s++) lastOcc[changeIndices[s]] = s;
    for (let i = 1; i <= n; i++) if (lastOcc[i] === -1) return false;

    // Greedy right-to-left: accumulate free ops, spend at last occurrences
    let freeOps = 0;
    const marked = new Array(n + 1).fill(false);
    for (let s = t - 1; s >= 0; s--) {
      const idx = changeIndices[s];
      if (lastOcc[idx] === s) {
        if (freeOps >= nums[idx - 1]) {
          freeOps -= nums[idx - 1];
          marked[idx] = true;
        } else {
          freeOps++; // Can't afford to mark; treat second as free op
        }
      } else {
        freeOps++;
      }
    }
    for (let i = 1; i <= n; i++) if (!marked[i]) return false;
    return true;
  }

  let lo = n,
    hi = m,
    ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canFinish(mid)) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return ans;
}

/**
 * Solution 2: Linear-scan with precomputed last occurrences (single feasibility pass)
 * @complexity Time O(n + m), Space O(n)
 */
function earliestSecondLinear(nums: number[], changeIndices: number[]): number {
  const n = nums.length;
  const m = changeIndices.length;
  const lastOcc = new Array(n + 1).fill(-1);
  for (let s = 0; s < m; s++) lastOcc[changeIndices[s]] = s;
  for (let i = 1; i <= n; i++) if (lastOcc[i] === -1) return -1;

  // Map: which second is reserved for marking which index
  const markAt = new Map<number, number>(); // second → idx
  for (let i = 1; i <= n; i++) markAt.set(lastOcc[i], i);

  let decrementBudget = 0;
  const done = new Set<number>();
  for (let s = 0; s < m; s++) {
    const markIdx = markAt.get(s);
    if (markIdx !== undefined) {
      if (decrementBudget >= nums[markIdx - 1]) {
        decrementBudget -= nums[markIdx - 1];
        done.add(markIdx);
      } else {
        decrementBudget++;
      }
    } else {
      decrementBudget++;
    }
    if (done.size === n) return s + 1;
  }
  return -1;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(earliestSecondToMarkIndices([2, 2, 0], [2, 2, 1, 2, 1, 2, 1, 3])); // 8
console.log(earliestSecondToMarkIndices([0, 0, 0], [1, 2, 3])); // 3
console.log(earliestSecondToMarkIndices([1], [1, 1, 1])); // 2
console.log(earliestSecondLinear([2, 2, 0], [2, 2, 1, 2, 1, 2, 1, 3])); // 8
console.log(earliestSecondLinear([0, 0, 0], [1, 2, 3])); // 3
```

---

## 🔗 Related Problems

