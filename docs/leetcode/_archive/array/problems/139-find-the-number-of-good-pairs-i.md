---
layout: page
title: "Find the Number of Good Pairs I"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/find-the-number-of-good-pairs-i"
---

# Find the Number of Good Pairs I / Tìm Số Cặp Tốt I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map / Brute Force

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Phiên bản đơn giản hơn của Good Pairs II: constraints nhỏ hơn cho phép dùng brute force O(n\*m). Vẫn có thể tối ưu bằng divisor enumeration như bài II, nhưng brute force là đủ vì n, m ≤ 50.

**EN:** Simpler version of Good Pairs II: smaller constraints (n, m ≤ 50, values ≤ 50) allow brute force O(n\*m). The divisor approach also works and is good practice for the interview follow-up.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Find the Number of Good Pairs I example:**

```
nums1=[1,3,4], nums2=[1,3,4], k=1
Check all pairs (i,j):
  (1,1): 1%(1*1)=0 ✓
  (3,1): 3%(1*1)=0 ✓
  (3,3): 3%(3*1)=0 ✓
  (4,1): 4%(1*1)=0 ✓
  (4,4): 4%(4*1)=0 ✓
Total = 5
```

---

---

## Problem Description

| #    | Problem                          | Difficulty | Pattern                 |
| ---- | -------------------------------- | ---------- | ----------------------- |
| 3163 | Find the Number of Good Pairs II | 🟡 Medium  | Divisor Enum + Hash Map |
| 1512 | Number of Good Pairs             | 🟢 Easy    | Hash Map                |
| 2176 | Count Equal and Divisible Pairs  | 🟢 Easy    | Brute Force             |

---

## 📝 Interview Tips

- 🟢 **EN:** With n, m ≤ 50 and values ≤ 50, brute force O(n*m) = 2500 ops — perfectly fine.
  **VI:** Với n, m ≤ 50, brute force O(n*m) = 2500 phép tính — hoàn toàn ổn.
- 🟢 **EN:** Always mention the O(n*sqrt(max)) divisor approach as a follow-up for larger inputs.
  **VI:** Luôn đề cập phương pháp chia ước O(n*sqrt(max)) như follow-up cho input lớn hơn.
- 🟢 **EN:** The condition `a % (b*k) === 0` means b*k must divide a.
  **VI:** Điều kiện `a % (b*k) === 0` nghĩa là b\*k phải là ước của a.
- 🟢 **EN:** Build freq map of nums2 for O(1) lookup — same pattern as two-sum.
  **VI:** Xây map tần số của nums2 để tra cứu O(1) — cùng mẫu với two-sum.
- 🟢 **EN:** Watch out for integer overflow: b*k can exceed safe int if not checked.
  **VI:** Cẩn thận tràn số: b*k có thể vượt giới hạn nếu không kiểm tra.
- 🟢 **EN:** Constraints here are tiny; state brute force confidence clearly.
  **VI:** Constraints nhỏ; hãy nói rõ tại sao brute force đủ.

---

---

## Solutions

```typescript
function numberOfPairsI(nums1: number[], nums2: number[], k: number): number {
  let count = 0;
  for (const a of nums1) {
    for (const b of nums2) {
      if (a % (b * k) === 0) count++;
    }
  }
  return count;
}

// Test cases
console.log(numberOfPairsI([1, 3, 4], [1, 3, 4], 1)); // Expected: 5
console.log(numberOfPairsI([1, 2, 4, 12], [2, 4], 3)); // Expected: 2
console.log(numberOfPairsI([1], [1], 1)); // Expected: 1

function numberOfPairsI_opt(nums1: number[], nums2: number[], k: number): number {
  // Frequency map of nums2
  const freq = new Map<number, number>();
  for (const b of nums2) {
    freq.set(b, (freq.get(b) ?? 0) + 1);
  }

  let count = 0;
  for (const a of nums1) {
    if (a % k !== 0) continue;
    const reduced = a / k;
    // Enumerate all divisors of reduced
    for (let d = 1; d * d <= reduced; d++) {
      if (reduced % d === 0) {
        count += freq.get(d) ?? 0;
        if (d !== reduced / d) {
          count += freq.get(reduced / d) ?? 0;
        }
      }
    }
  }
  return count;
}

// Same test cases — both solutions agree
console.log(numberOfPairsI_opt([1, 3, 4], [1, 3, 4], 1)); // Expected: 5
console.log(numberOfPairsI_opt([1, 2, 4, 12], [2, 4], 3)); // Expected: 2
console.log(numberOfPairsI_opt([10, 20, 30], [2, 5], 2)); // Expected: 3
```

---

## 🔗 Related Problems

| #    | Problem                          | Difficulty | Pattern                 |
| ---- | -------------------------------- | ---------- | ----------------------- |
| 3163 | Find the Number of Good Pairs II | 🟡 Medium  | Divisor Enum + Hash Map |
| 1512 | Number of Good Pairs             | 🟢 Easy    | Hash Map                |
| 2176 | Count Equal and Divisible Pairs  | 🟢 Easy    | Brute Force             |
