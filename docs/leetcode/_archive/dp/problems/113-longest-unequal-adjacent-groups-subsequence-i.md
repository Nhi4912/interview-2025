---
layout: page
title: "Longest Unequal Adjacent Groups Subsequence I"
difficulty: Easy
category: Dynamic Programming
tags: [Array, String, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-i"
---

# Longest Unequal Adjacent Groups Subsequence I / Dãy Con Dài Nhất Với Nhóm Kế Tiếp Khác Nhau

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chọn quần áo — bạn muốn chọn trang phục luân phiên (sáng-tối, sáng-tối), và chiến lược tốt nhất là cứ gặp màu khác với màu hiện tại thì chọn ngay, không bỏ qua.

**Pattern Recognition:**

- Signal: nhóm nhị phân `groups[i] ∈ {0,1}`, muốn dãy con dài nhất với `groups` xen kẽ → Greedy
- Key insight: với binary groups, dãy con xen kẽ dài nhất = chọn mỗi khi group thay đổi so với phần tử đã chọn trước
- Không cần DP vì greedy cục bộ = tối ưu toàn cục cho binary alternating

```
words  = ["e","a","b"]
groups = [0,  0,  1]

Greedy: chọn index 0 (group=0), bỏ index 1 (group=0, giống trước),
        chọn index 2 (group=1, khác trước)
→ ["e","b"]

words  = ["a","b","c","d"]
groups = [1,  0,  1,  1]

Chọn 0(1) → 1(0) → 2(1) → bỏ 3(1 giống 2)
→ ["a","b","c"]
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng `words` và mảng nhị phân `groups` (cùng độ dài `n`). Trả về mảng các từ tạo thành **dãy con dài nhất** từ `words` sao cho mọi cặp phần tử kề trong dãy con có `groups[i] ≠ groups[j]`.

**Example 1:** `words=["e","a","b"]`, `groups=[0,0,1]` → `["e","b"]`
**Example 2:** `words=["a","b","c","d"]`, `groups=[1,0,1,1]` → `["a","b","c"]`

**Constraints:** `1 ≤ n ≤ 100`, `1 ≤ words[i].length ≤ 10`, `groups[i] ∈ {0, 1}`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** The binary constraint (groups ∈ {0,1}) makes greedy optimal — any skipped element can't improve the sequence.
   **VI:** Ràng buộc nhị phân khiến greedy tối ưu — bỏ phần tử nào cũng không cải thiện được dãy.

2. **EN:** For non-binary groups (Part II of this problem), DP with O(n²) is needed.
   **VI:** Với groups không nhị phân (phần II), cần DP O(n²).

3. **EN:** The answer always has length ≥ 1 (at least the first element).
   **VI:** Kết quả luôn có độ dài ≥ 1 (ít nhất phần tử đầu tiên).

4. **EN:** The greedy approach: scan left-to-right, pick current element if its group differs from the last picked.
   **VI:** Greedy: quét trái-phải, chọn phần tử hiện tại nếu group khác với phần tử cuối đã chọn.

5. **EN:** Return the actual words, not just the count — keep track of indices.
   **VI:** Trả về mảng từ thực sự, không chỉ đếm — theo dõi chỉ số.

6. **EN:** O(n) time and space — single pass through the array.
   **VI:** O(n) thời gian và không gian — một lần duyệt mảng.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Greedy — O(n) ───────────────────────────────────────────────
// Greedily pick each word when its group differs from the last picked group.
// Optimal because binary groups means no future benefit to skipping.
function getLongestSubsequence(words: string[], groups: number[]): string[] {
  const result: string[] = [words[0]];
  let lastGroup = groups[0];

  for (let i = 1; i < words.length; i++) {
    if (groups[i] !== lastGroup) {
      result.push(words[i]);
      lastGroup = groups[i];
    }
  }
  return result;
}

// ─── Solution 2: DP — O(n²) (generalizable to non-binary groups) ─────────────
// dp[i] = length of longest valid subsequence ending at index i
// Reconstruct path by tracking parent pointers
function getLongestSubsequence_dp(words: string[], groups: number[]): string[] {
  const n = words.length;
  const dp = new Array(n).fill(1);
  const parent = new Array(n).fill(-1);

  for (let i = 1; i < n; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (groups[i] !== groups[j] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        parent[i] = j;
      }
    }
  }

  // Find end of longest subsequence
  let maxLen = 0,
    endIdx = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] > maxLen) {
      maxLen = dp[i];
      endIdx = i;
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let idx = endIdx;
  while (idx !== -1) {
    path.push(words[idx]);
    idx = parent[idx];
  }
  return path.reverse();
}

// ─── Solution 3: Functional one-liner style ───────────────────────────────────
function getLongestSubsequence_fn(words: string[], groups: number[]): string[] {
  return words.filter((_, i) => i === 0 || groups[i] !== groups[i - 1]);
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(getLongestSubsequence(["e", "a", "b"], [0, 0, 1])); // ["e","b"]
console.log(getLongestSubsequence(["a", "b", "c", "d"], [1, 0, 1, 1])); // ["a","b","c"]
console.log(getLongestSubsequence_dp(["e", "a", "b"], [0, 0, 1])); // ["e","b"]
console.log(getLongestSubsequence_fn(["a", "b", "c", "d"], [1, 0, 1, 1])); // ["a","b","c"]
console.log(getLongestSubsequence(["x"], [0])); // ["x"]
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                        | Difficulty | Pattern            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------ |
| 2901 | [Longest Unequal Adjacent Groups Subsequence II](https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-ii) | 🟡 Medium  | DP                 |
| 376  | [Wiggle Subsequence](https://leetcode.com/problems/wiggle-subsequence)                                                         | 🟡 Medium  | Greedy / DP        |
| 300  | [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                                 | 🟡 Medium  | DP / Binary Search |
