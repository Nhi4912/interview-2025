---
layout: page
title: "Number of Substrings Containing All Three Characters"
difficulty: Medium
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters"
---

# Number of Substrings Containing All Three Characters / Số Substring Chứa Cả Ba Ký Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đếm số khoảng thời gian mà bạn có đủ a, b, c trong tay. Mỗi khi bạn có đủ cả ba loại từ vị trí `left` đến `right`, thì tất cả các chuỗi mở rộng thêm về phía phải cũng hợp lệ.

**Pattern Recognition:**

- Signal: "substring containing ALL of {a,b,c}" → **Sliding Window + Last Position trick**
- Key insight: Với mỗi vị trí `r`, gọi `minLast = min(lastSeen[a], lastSeen[b], lastSeen[c])`. Tất cả substrings `[l..r]` với `l ≤ minLast` đều hợp lệ → cộng thêm `minLast + 1` vào kết quả.
- Vì sao?: Bất kỳ điểm bắt đầu `l ≤ minLast` sẽ bao gồm vị trí cuối của cả 3 ký tự.

**Visual:**

```
s = "abcabc"
     0 1 2 3 4 5

r=0: last = {a:0, b:-1, c:-1} → min=-1 → add 0
r=1: last = {a:0, b:1,  c:-1} → min=-1 → add 0
r=2: last = {a:0, b:1,  c:2}  → min=0  → add 1  (substr [0..2] = "abc")
r=3: last = {a:3, b:1,  c:2}  → min=1  → add 2  ([0..3],[1..3])
r=4: last = {a:3, b:4,  c:2}  → min=2  → add 3  ([0..4],[1..4],[2..4])
r=5: last = {a:3, b:4,  c:5}  → min=3  → add 4  ([0..5],[1..5],[2..5],[3..5])
Total = 0+0+1+2+3+4 = 10 ✓
```

---

## Problem Description

Given a string `s` consisting of only 'a', 'b', 'c', return the number of substrings that contain **at least one** of each character 'a', 'b', 'c'. ([LeetCode](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters))

Difficulty: Medium | Acceptance: ~68%

```
Example 1: s = "abcabc" → 10
Example 2: s = "aaacb"  → 3
  Substrings: "aaacb", "aacb", "acb"
Example 3: s = "abc"    → 1
```

Constraints:

- `3 <= s.length <= 5 * 10^4`
- `s` consists of only 'a', 'b', 'c'

---

## 📝 Interview Tips

1. **Clarify**: "Chỉ có a, b, c trong chuỗi — không có ký tự khác?" / Confirm only 'a','b','c' characters.
2. **Brute force**: "O(n²) với prefix sum cho từng ký tự — too slow cho n=5×10^4" / O(n²) is borderline, O(n) preferred.
3. **Key insight**: "Với mỗi right endpoint r, số substrings valid = minLastSeen + 1" / Last-seen minimum trick gives O(n).
4. **Alternative**: "Two pointers shrinking window — cũng O(n) nhưng lastSeen trick đơn giản hơn" / Last-seen is simpler than shrinking window.
5. **Edge cases**: "s = 'aaa' → 0; s = 'abc' → 1; s = 'abcabc' → 10" / No occurrences of any char → 0.
6. **Follow-up**: "Nếu cần ít nhất k lần mỗi ký tự? → sliding window với counter" / Generalize with frequency tracking.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — O(n²)
 * Count all substrings, check if contains all 3 chars
 */
function numberOfSubstringsBrute(s: string): number {
  const n = s.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    const freq = [0, 0, 0]; // a, b, c
    for (let j = i; j < n; j++) {
      freq[s.charCodeAt(j) - 97]++;
      if (freq[0] > 0 && freq[1] > 0 && freq[2] > 0) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Last-Seen Position Trick — O(n)
 * Time: O(n) — single pass
 * Space: O(1) — 3 variables
 *
 * For each right index r:
 *   minLast = min(lastSeen[a], lastSeen[b], lastSeen[c])
 *   Add (minLast + 1) to result — all starting points [0..minLast] are valid.
 */
function numberOfSubstrings(s: string): number {
  const lastSeen = [-1, -1, -1]; // last index of 'a', 'b', 'c'
  let count = 0;

  for (let r = 0; r < s.length; r++) {
    lastSeen[s.charCodeAt(r) - 97] = r;
    // Only count if all three have been seen
    const minLast = Math.min(lastSeen[0], lastSeen[1], lastSeen[2]);
    if (minLast >= 0) {
      count += minLast + 1;
    }
  }

  return count;
}

/**
 * Solution 3: Sliding Window (shrink from left)
 * Time: O(n), Space: O(1)
 * Maintain window [l..r] with counts. When all 3 present, add (n - r) to result.
 */
function numberOfSubstringsSlidingWindow(s: string): number {
  const n = s.length;
  const freq = [0, 0, 0];
  let count = 0;
  let l = 0;

  for (let r = 0; r < n; r++) {
    freq[s.charCodeAt(r) - 97]++;

    // Shrink window from left while all 3 chars present
    while (freq[0] > 0 && freq[1] > 0 && freq[2] > 0) {
      // All substrings starting at l and ending at r, r+1, ..., n-1 are valid
      count += n - r;
      freq[s.charCodeAt(l) - 97]--;
      l++;
    }
  }

  return count;
}

// === Test Cases ===
console.log(numberOfSubstrings("abcabc")); // 10
console.log(numberOfSubstrings("aaacb")); // 3
console.log(numberOfSubstrings("abc")); // 1
console.log(numberOfSubstrings("aaa")); // 0

console.log(numberOfSubstringsBrute("abcabc")); // 10
console.log(numberOfSubstringsSlidingWindow("abcabc")); // 10
console.log(numberOfSubstringsSlidingWindow("aaacb")); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                        | Pattern        | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------- |
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring)                                             | Sliding Window | Hard       |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | Sliding Window | Medium     |
| [Fruits Into Baskets](https://leetcode.com/problems/fruit-into-baskets)                                                        | Sliding Window | Medium     |
| [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays)                                 | Sliding Window | Medium     |
