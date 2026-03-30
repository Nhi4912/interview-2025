---
layout: page
title: "Longest Substring with At Most K Distinct Characters"
difficulty: Medium
category: String
tags: [String, Hash Table, Sliding Window, Two Pointers]
leetcode_url: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/"
---

# Longest Substring with At Most K Distinct Characters / Chuỗi Con Dài Nhất Với Tối Đa K Ký Tự Phân Biệt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Variable-size Sliding Window
> **Frequency**: 📘 Tier 3 — Classic sliding window drill, hay xuất hiện trong phone screen
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn mang chiếc ví chỉ chứa được `k` loại thẻ ngân hàng khác nhau. Bạn đi dọc hàng cửa hàng — mỗi cửa hàng cần một loại thẻ. Khi gặp loại thẻ mới mà ví đã đầy, bạn phải bỏ đi loại thẻ "cũ nhất" (lùi con trỏ trái) cho đến khi ví còn chỗ. Mục tiêu là đi được đoạn dài nhất liên tục mà không vi phạm giới hạn ví.

- **Pattern Recognition:**
  - "Longest substring satisfying constraint on distinct chars" → **Variable-size Sliding Window**
  - Expand right freely; shrink from left **while** constraint is violated (`map.size > k`)
  - HashMap tracks count of each char in window; `map.size` = number of distinct chars

- **Visual — s="eceba", k=2:**

```
r=0: add 'e' → {e:1}         size=1≤2  window="e"    len=1
r=1: add 'c' → {e:1,c:1}    size=2≤2  window="ec"   len=2
r=2: add 'e' → {e:2,c:1}    size=2≤2  window="ece"  len=3  ← max
r=3: add 'b' → {e:2,c:1,b:1} size=3>2  shrink:
       remove s[0]='e' → {e:1,c:1,b:1} size=3>2  left=1
       remove s[1]='c' → {e:1,b:1}     size=2≤2  left=2
     window="eb"  len=2
r=4: add 'a' → {e:1,b:1,a:1} size=3>2  shrink:
       remove s[2]='e' → {b:1,a:1}     size=2≤2  left=3
     window="ba"  len=2

maxLength = 3  ("ece") ✓
```

## Problem Description

Given string `s` and integer `k`, return the length of the longest substring containing at most `k` distinct characters.

```
Input: s="eceba",  k=2 → Output: 3  ("ece")
Input: s="aa",     k=1 → Output: 2  ("aa")
Input: s="abaccc", k=2 → Output: 4  ("accc")
```

## 📝 Interview Tips

1. **Shrink while** / **Thu nhỏ với while**: dùng `while (map.size > k)` không phải `if` — có thể cần shrink nhiều bước liên tiếp.
2. **Delete when 0** / **Xóa khi count về 0**: `map.delete(char)` để `map.size` phản ánh đúng số ký tự phân biệt.
3. **k=0 edge** / **Trường hợp k=0**: không có chuỗi nào hợp lệ → trả về 0 ngay.
4. **k ≥ distinct** / **k lớn hơn số unique**: window không bao giờ cần shrink → trả về `s.length`.
5. **Generalizes LC 3 and LC 159** / **Tổng quát hóa**: LC 3 (không lặp = k=1 distinct per char), LC 159 (k=2 "fruit basket") đều là trường hợp đặc biệt.
6. **Unicode** / **Ký tự Unicode**: dùng `Map<string, number>` thay vì `int[26]` khi alphabet không giới hạn.

## Solutions

{% raw %}
/\*\*

- 340.  Longest Substring with At Most K Distinct Characters
- Brute: try every substring and track distinct count.
- Time O(n²), Space O(k)
  \*/
  function lengthOfLongestSubstringKDistinctBrute(s: string, k: number): number {
  if (k === 0) return 0;
  let max = 0;
  for (let i = 0; i < s.length; i++) {
  const seen = new Map<string, number>();
  for (let j = i; j < s.length; j++) {
  seen.set(s[j], (seen.get(s[j]) ?? 0) + 1);
  if (seen.size > k) break;
  max = Math.max(max, j - i + 1);
  }
  }
  return max;
  }

/\*\*

- Variable-size Sliding Window with HashMap — optimal.
- Expand right freely; shrink left until at most k distinct chars remain.
- Time O(n), Space O(k)
  \*/
  function lengthOfLongestSubstringKDistinct(s: string, k: number): number {
  if (k === 0) return 0;
  const count = new Map<string, number>();
  let left = 0;
  let max = 0;

      for (let right = 0; right < s.length; right++) {
          // Expand: include s[right]
          const rc = s[right];
          count.set(rc, (count.get(rc) ?? 0) + 1);

          // Shrink: move left until constraint is satisfied
          while (count.size > k) {
              const lc = s[left++];
              count.set(lc, count.get(lc)! - 1);
              if (count.get(lc) === 0) count.delete(lc);
          }

          max = Math.max(max, right - left + 1);
      }

      return max;

  }

// Inline checks
console.log(lengthOfLongestSubstringKDistinct("eceba", 2)); // 3
console.log(lengthOfLongestSubstringKDistinct("aa", 1)); // 2
console.log(lengthOfLongestSubstringKDistinct("abaccc", 2)); // 4
console.log(lengthOfLongestSubstringKDistinctBrute("abcdef", 3)); // 3
{% endraw %}

## 🔗 Related Problems

- [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) — special case: no char may repeat (k-distinct per char)
- [159. Longest Substring with At Most Two Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/) — identical problem with k=2
- [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) — harder variant: variable window with superset constraint
- [438. Find All Anagrams in a String](./19-find-all-anagrams-in-string.md) — fixed-size window with exact character matching
- [395. Longest Substring with At Least K Repeating Characters](https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/) — complementary constraint (at-least instead of at-most)
