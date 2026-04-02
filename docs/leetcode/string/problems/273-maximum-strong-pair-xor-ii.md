---
layout: page
title: "Maximum Strong Pair XOR II"
difficulty: Hard
category: String
tags: [Array, Hash Table, Bit Manipulation, Trie, Sliding Window]
leetcode_url: "https://leetcode.com/problems/maximum-strong-pair-xor-ii"
---

# Maximum Strong Pair XOR II / XOR Cặp Mạnh Tối Đa II

> **Track**: String | **Difficulty**: 🔴 Hard | **Pattern**: Trie + Sliding Window
> **Frequency**: Low — bài nâng cao về XOR trie kết hợp cửa sổ trượt
> **See also**: [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) | [Maximum Strong Pair XOR I](https://leetcode.com/problems/maximum-strong-pair-xor-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn là DJ điều chỉnh âm thanh. Mỗi bản nhạc (số) có một tần số nhị phân. Bạn muốn ghép đôi hai bản nhạc để tạo ra sự đối lập tần số lớn nhất (XOR tối đa). Điều kiện "cặp mạnh" là hai bản nhạc không cách nhau quá xa về tần số. Thay vì thử mọi cặp (O(n²)), bạn sort bản nhạc theo tần số, rồi dùng cửa sổ trượt để chỉ giữ những bản có thể ghép cặp — dùng XOR-trie để tra nhanh bản nhạc đối lập nhất trong cửa sổ.

**Pattern Recognition:**

- Signal: "strong pair condition y ≤ 2x" + "large n (5×10^4)" → **Sort + Sliding Window + XOR Trie**
- Bài này thuộc dạng tối ưu hóa XOR trên cửa sổ trượt — brute force O(n²) quá chậm
- Key insight: sau khi sort, điều kiện y ≤ 2x cho phép dùng sliding window; trie với `count` ở mỗi nút hỗ trợ thêm/xoá phần tử

**Visual — nums = [1, 2, 3, 4, 5] after sorting:**

```
sorted: [1, 2, 3, 4, 5]   condition: nums[r] <= 2 * nums[l]

r=0(1): window=[1],     query(1)→0
r=1(2): 2<=2×1 ✓        window=[1,2],   query(2)→3    (2 XOR 1=3)
r=2(3): 3<=2×1? NO → remove 1, l=1
        3<=2×2=4 ✓       window=[2,3],   query(3)→1
r=3(4): 4<=2×2=4 ✓       window=[2,3,4], query(4)→7   (4 XOR 3=7) ← max
r=4(5): 5<=2×2=4? NO → remove 2, l=2
        5<=2×3=6 ✓       window=[3,4,5], query(5)→6

Maximum XOR = 7
```

---

## Problem Description

Same as Problem I but with `1 <= nums.length <= 5×10^4` and `1 <= nums[i] <= 2^20`. A **strong pair** satisfies `|x-y| <= min(x,y)`. Return the maximum XOR of any strong pair. ([LeetCode](https://leetcode.com/problems/maximum-strong-pair-xor-ii))

```
Example 1: nums = [1, 2, 3, 4, 5]         → 7
Example 2: nums = [10, 100]               → 0   (no valid pair)
Example 3: nums = [500, 520, 2500, 3000]  → 1020
```

Constraints: `1 <= nums.length <= 5×10^4`, `1 <= nums[i] <= 2^20`.

---

## 📝 Interview Tips

1. **"Sort first, then sliding window"** — _Sau khi sort, điều kiện trở thành nums[r] ≤ 2×nums[l]; l chỉ tăng — cửa sổ hợp lệ._
2. **"Trie nodes need count — support deletion"** — _Mỗi nút trie lưu `count` để biết bao nhiêu số đang đi qua nhánh đó; xóa bằng cách giảm count._
3. **"Query: greedily choose opposite bit from MSB"** — _Tại mỗi bit từ cao xuống thấp, chọn nhánh ngược bit của target nếu count>0 để maximize XOR._
4. **"BITS = 20 sufficient (nums[i] <= 2^20)"** — _Đủ 20 bit nhị phân là bao phủ toàn bộ giá trị đầu vào._
5. **"Add nums[r] before querying it"** — _Thêm nums[r] vào trie trước khi query — vì (x,x) là cặp hợp lệ._
6. **"Time: O(n × BITS) — much better than O(n²)"** — _n=50000, BITS=20 → 10^6 operations vs brute force 25×10^8._

---

## Solutions

```typescript
/** Solution 1: Brute Force O(n²) — works for small input  @complexity Time: O(n²) | Space: O(1) */
function maximumStrongPairXorBrute(nums: number[]): number {
  let max = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      if (Math.abs(nums[i] - nums[j]) <= Math.min(nums[i], nums[j])) {
        max = Math.max(max, nums[i] ^ nums[j]);
      }
    }
  }
  return max;
}

/** Solution 2: Sort + Sliding Window + XOR Trie  @complexity Time: O(n×BITS) | Space: O(n×BITS) */
function maximumStrongPairXorII(nums: number[]): number {
  const BITS = 20;

  // Trie node: children[0|1] and count of numbers passing through
  type Node = { ch: [Node | null, Node | null]; cnt: number };
  const newNode = (): Node => ({ ch: [null, null], cnt: 0 });

  const root = newNode();

  const update = (num: number, delta: number): void => {
    let node = root;
    for (let i = BITS - 1; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!node.ch[bit]) node.ch[bit] = newNode();
      node = node.ch[bit]!;
      node.cnt += delta;
    }
  };

  const query = (num: number): number => {
    let node = root;
    let xor = 0;
    for (let i = BITS - 1; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const want = 1 - bit; // prefer opposite bit for maximum XOR
      if (node.ch[want] && node.ch[want]!.cnt > 0) {
        xor |= 1 << i;
        node = node.ch[want]!;
      } else if (node.ch[bit] && node.ch[bit]!.cnt > 0) {
        node = node.ch[bit]!;
      } else {
        break;
      }
    }
    return xor;
  };

  nums.sort((a, b) => a - b);
  let left = 0;
  let ans = 0;

  for (let right = 0; right < nums.length; right++) {
    update(nums[right], 1); // add nums[right] to window
    // Remove elements from left that violate y <= 2x
    while (nums[right] > 2 * nums[left]) {
      update(nums[left], -1);
      left++;
    }
    ans = Math.max(ans, query(nums[right]));
  }

  return ans;
}

// === Test Cases ===
console.log(maximumStrongPairXorII([1, 2, 3, 4, 5])); // 7
console.log(maximumStrongPairXorII([10, 100])); // 0
console.log(maximumStrongPairXorBrute([1, 2, 3, 4, 5])); // 7
console.log(maximumStrongPairXorII([500, 520, 2500, 3000])); // 1020
console.log(maximumStrongPairXorII([1])); // 0
```

---

## 🔗 Related Problems

| #    | Problem                                                | Difficulty | Pattern        |
| ---- | ------------------------------------------------------ | ---------- | -------------- |
| 421  | Maximum XOR of Two Numbers in an Array                 | Medium     | Trie           |
| 2932 | Maximum Strong Pair XOR I                              | Easy       | Brute Force    |
| 1438 | Longest Continuous Subarray With Absolute Diff ≤ Limit | Medium     | Sliding Window |
| 1707 | Maximum XOR With an Element From Array                 | Hard       | Offline + Trie |
