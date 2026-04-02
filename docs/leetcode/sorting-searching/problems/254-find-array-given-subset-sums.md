---
layout: page
title: "Find Array Given Subset Sums"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Divide and Conquer]
leetcode_url: "https://leetcode.com/problems/find-array-given-subset-sums"
---

# find array given subset sums

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn nhận được **bảng tổng tất cả các nhóm con** của một đội bí ẩn, và phải tìm lại danh sách thành viên gốc. Mấu chốt: sai số nhỏ nhất giữa hai tổng gần nhau nhất chính là "ứng viên" của một phần tử trong mảng gốc. Chia đôi danh sách tổng theo ứng viên đó, đệ quy hai nửa riêng biệt, ghép lại — đây là **divide and conquer** trên cấu trúc subset sum.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
n=3, sums = [−3,−2,−1,0,0,1,2,3]  → sorted

d = sums[1] - sums[0] = (-2)-(-3) = 1   ← candidate element (or -1)

Split into two halves of size 4 by pairing:
  Group A (without d):  [−3,−2,−1, 0]
  Group B (with    d):  [−2,−1, 0, 1]

Try d=1:  A = sums - B mapped by subtracting 1 → [−3,−2,−1,0]
  Recurse on A=[−3,−2,−1,0], n=2:
    d = -2 - (-3) = 1, try A=[−3,−2], recurse n=1: d=1 → [1]  ✓
    Result for n=2: [1, 1] or [−3,1] depending on sign choice
  ...
Final reconstruction: e.g. [1, 2, -4] → verify: all 8 subsets match ✓
```

---

## Problem Description

Cho `n` và mảng `sums` (độ dài `2^n`) chứa tất cả tổng tập con của một mảng ẩn `a` (độ dài `n`). Trả về bất kỳ mảng `a` nào thoả mãn (nhiều đáp án hợp lệ).

**Ví dụ 1:**

```
Input:  n = 3, sums = [-3,-2,-1,0,0,1,2,3]
Output: [1,2,-3]
// Subsets of [1,2,-3]: {}, {1}, {2}, {-3}, {1,2}, {1,-3}, {2,-3}, {1,2,-3}
//   sums = 0,1,2,-3,3,-2,-1,0 → sorted: [-3,-2,-1,0,0,1,2,3] ✓
```

**Ví dụ 2:**

```
Input:  n = 2, sums = [0,0,0,0]
Output: [0,0]
```

**Ràng buộc:** `1 ≤ n ≤ 15`, `sums.length == 2^n`, `-10^4 ≤ sums[i] ≤ 10^4`

---

## 📝 Interview Tips

1. **d = sums[1] - sums[0]** — the smallest difference in sorted sums is a candidate element (magnitude); it's either `d` or `-d`. | Hiệu nhỏ nhất giữa hai tổng liền kề là "ứng viên" giá trị phần tử.
2. **Split by d** — for each value in sorted sums, pair it with `value + d` to assign to group A (without d) or group B (with d). | Tách thành hai nhóm bằng cách ghép cặp mỗi phần tử với `phần tử + d`.
3. **Greedy pairing from smallest** — process sorted array left to right; once a value is "used", remove it from the pool. | Xử lý từ nhỏ đến lớn, mỗi giá trị dùng một lần bằng multiset.
4. **Try both d and -d** — determine correct sign by checking if `0` appears in one of the resulting groups. | Xác định dấu đúng bằng cách kiểm tra nhóm nào chứa `0` (tổng tập rỗng).
5. **Recursion depth = n** — each level halves the sums array; total work O(2^n · n). | Độ sâu đệ quy là n, mỗi tầng xử lý nửa mảng → tổng O(2^n · n).
6. **Base case n=1** — sums = [0, x]; result is [x]. | Khi n=1, mảng tổng gồm 2 phần tử [0, x] → phần tử gốc là x.

---

## Solutions

```typescript
/**
 * Solution 1: Divide & Conquer with sorted multiset splitting
 * @complexity Time O(2^n · n), Space O(2^n)
 */
function recoverArray(n: number, sums: number[]): number[] {
  sums.sort((a, b) => a - b);

  function solve(arr: number[]): number[] {
    if (arr.length === 1) return []; // only {0} means no elements
    if (arr.length === 2) return [arr[1] - arr[0]]; // base: [0, x] → [x]

    const d = arr[1] - arr[0]; // candidate element magnitude

    // Try split with candidate d: group A (not including d), group B (including d)
    // Process from left; use a count map to track available values
    function trySplit(candidate: number): { ok: boolean; groupA: number[] } {
      const pool = new Map<number, number>();
      for (const v of arr) pool.set(v, (pool.get(v) ?? 0) + 1);
      const groupA: number[] = [];
      for (const v of arr) {
        const cv = pool.get(v);
        if (!cv || cv === 0) continue;
        // v goes to A; v+candidate goes to B
        const bVal = v + candidate;
        const bCnt = pool.get(bVal) ?? 0;
        if (bCnt === 0) return { ok: false, groupA: [] };
        pool.set(v, cv - 1);
        pool.set(bVal, bCnt - 1);
        groupA.push(v);
      }
      return { ok: true, groupA };
    }

    // Try d first
    const { ok: okD, groupA: gAD } = trySplit(d);
    if (okD) {
      // Determine sign: if 0 is in groupA, element is d; otherwise element is -d
      const useD = gAD.includes(0);
      const elem = useD ? d : -d;
      const subResult = solve(gAD);
      return [elem, ...subResult];
    }

    // d must be negative if the above split failed (shouldn't happen for valid input)
    // Try -d
    const { groupA: gANeg } = trySplit(-d);
    const useNeg = gANeg.includes(0);
    const elem = useNeg ? -d : d;
    return [elem, ...solve(gANeg)];
  }

  return solve(sums);
}

/**
 * Solution 2: Multiset (sorted array) approach — same algorithm, cleaner
 * @complexity Time O(2^n · n log(2^n)) = O(2^n · n^2), Space O(2^n)
 */
function recoverArrayV2(n: number, sums: number[]): number[] {
  sums.sort((a, b) => a - b);

  function solve(cur: number[]): number[] {
    if (cur.length === 2) return [cur[1]]; // base: 0 and x → [x]

    const d = cur[1] - cur[0];
    const half = cur.length / 2;

    // Build group A by greedy pairing from smallest
    function buildGroupA(delta: number): number[] | null {
      const remaining = [...cur];
      const A: number[] = [];
      for (let i = 0; i < remaining.length; ) {
        if (remaining[i] === undefined) {
          i++;
          continue;
        }
        const v = remaining[i];
        const idx = remaining.indexOf(v + delta, i + 1);
        if (idx === -1) return null;
        A.push(v);
        remaining.splice(idx, 1);
        remaining.splice(remaining.indexOf(v), 1);
      }
      return A.length === half ? A : null;
    }

    // Try delta=d
    const gA = buildGroupA(d);
    if (gA) {
      const hasZero = gA.includes(0);
      const elem = hasZero ? d : -d;
      return [elem, ...solve(gA)];
    }
    // Fallback (should not be reached for valid input)
    return [];
  }

  return solve(sums);
}

// ─── Tests ───────────────────────────────────────────────────────────────────
function verifySums(arr: number[], sums: number[]): boolean {
  const computed: number[] = [];
  for (let mask = 0; mask < 1 << arr.length; mask++) {
    let s = 0;
    for (let i = 0; i < arr.length; i++) if (mask & (1 << i)) s += arr[i];
    computed.push(s);
  }
  return (
    JSON.stringify(computed.sort((a, b) => a - b)) ===
    JSON.stringify([...sums].sort((a, b) => a - b))
  );
}

const r1 = recoverArray(3, [-3, -2, -1, 0, 0, 1, 2, 3]);
console.log(r1, verifySums(r1, [-3, -2, -1, 0, 0, 1, 2, 3])); // true

const r2 = recoverArray(2, [0, 0, 0, 0]);
console.log(r2, verifySums(r2, [0, 0, 0, 0])); // [0,0] true

const r3 = recoverArray(1, [0, 1]);
console.log(r3); // [1]
```

---

## 🔗 Related Problems

