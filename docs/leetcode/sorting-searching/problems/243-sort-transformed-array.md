---
layout: page
title: "Sort Transformed Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/sort-transformed-array"
---

# Sort Transformed Array / Biến Đổi Mảng Bậc Hai Rồi Sắp Xếp

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Premium problem, gặp ở Google
> **See also**: [Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array)

## 🧠 Intuition / Tư Duy

**Analogy:** Parabol là cái bát — nếu a>0 bát ngửa (giá trị lớn ở hai đầu), a<0 bát úp (giá trị nhỏ ở hai đầu). Hai con trỏ ở hai đầu mảng sorted, mỗi bước chọn giá trị "cực hơn" để điền vào kết quả.

**Visual — nums=[-4,-2,2,4], a=1, b=3, c=5:**

```
f(x) = x² + 3x + 5
f(-4)=9  f(-2)=3  f(2)=15  f(4)=33
  L                          R        a>0 → fill from end

Step 1: f(R)=33 > f(L)=9 → res[3]=33, R--
Step 2: f(L)=9 < f(R)=15 → pick R? No f(R=2)=15>9 → res[2]=15, R--
Step 3: f(L=-4)=9 > f(R=-2)=3 → res[1]=9, L++
Step 4: f(L=-2)=3 → res[0]=3
Result: [3, 9, 15, 33] ✓
```

## Problem Description

Given sorted integer array `nums` and integers `a`, `b`, `c`, apply `f(x) = ax² + bx + c` to each element, return result in sorted order.

**Example 1:** `nums=[-4,-2,2,4], a=1, b=3, c=5` → `[3,9,15,33]`
**Example 2:** `nums=[-4,-2,2,4], a=-1, b=3, c=5` → `[-23,-5,1,7]`

**Constraints:** `1 ≤ nums.length ≤ 200`, `-100 ≤ nums[i],a,b,c ≤ 100`, nums sorted ascending.

---

## 📝 Interview Tips

1. **Nhận dạng parabol** — a>0 mở lên (extremes lớn), a<0 mở xuống (extremes nhỏ), a=0 tuyến tính. / Parabola direction determines which extreme has larger values.
2. **Two-pointer key** — Mảng sorted + parabol = giá trị cực đại/cực tiểu ở hai đầu. / Sorted input + parabola means extreme values are at the two ends.
3. **Fill direction** — a>0 điền từ cuối (lớn→nhỏ), a≤0 điền từ đầu (nhỏ→lớn). / a>0 fill end-to-start, a≤0 fill start-to-end.
4. **Edge case a=0** — Khi a=0, f(x)=bx+c là tuyến tính, b<0 thì đảo ngược. / When a=0, linear function; if b<0 the order reverses.
5. **Apply+sort vẫn chấp nhận** — O(n log n) brute force đủ cho n≤200. / Apply+sort is fine for small n.
6. **Đừng quên c** — Nhiều người quên cộng c trong f(x). / Don't forget the constant term c.

---

## Solutions

```typescript
/**
 * Approach 1: Apply + Sort (Brute Force)
 * Time: O(n log n)  Space: O(n)
 */
function sortTransformedBrute(nums: number[], a: number, b: number, c: number): number[] {
  const f = (x: number) => a * x * x + b * x + c;
  return nums.map(f).sort((p, q) => p - q);
}

/**
 * Approach 2: Two Pointers (Optimal)
 * Time: O(n)  Space: O(n)
 *
 * a > 0 → parabola opens up → extremes have max → fill from end
 * a < 0 → parabola opens down → extremes have min → fill from start
 * a = 0 → linear → treat like a < 0 if b ≥ 0, else reverse
 */
function sortTransformed(nums: number[], a: number, b: number, c: number): number[] {
  const n = nums.length;
  const f = (x: number) => a * x * x + b * x + c;
  const res = new Array<number>(n);
  let lo = 0,
    hi = n - 1;
  let idx = a >= 0 ? n - 1 : 0;

  while (lo <= hi) {
    const fLo = f(nums[lo]),
      fHi = f(nums[hi]);
    if (a >= 0) {
      // Fill largest first
      if (fLo >= fHi) {
        res[idx--] = fLo;
        lo++;
      } else {
        res[idx--] = fHi;
        hi--;
      }
    } else {
      // Fill smallest first
      if (fLo <= fHi) {
        res[idx++] = fLo;
        lo++;
      } else {
        res[idx++] = fHi;
        hi--;
      }
    }
  }
  return res;
}

// Tests
console.log(sortTransformed([-4, -2, 2, 4], 1, 3, 5)); // [3,9,15,33]
console.log(sortTransformed([-4, -2, 2, 4], -1, 3, 5)); // [-23,-5,1,7]
console.log(sortTransformedBrute([-4, -2, 2, 4], 1, 3, 5)); // [3,9,15,33]
console.log(sortTransformed([1, 2, 3], 0, 0, 5)); // [5,5,5]
```

---

## 🔗 Related Problems

- [977. Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array) — Same two-pointer on sorted (a=1,b=0,c=0)
- [167. Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted) — Two pointers on sorted array
- [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array) — Fill from end pattern
