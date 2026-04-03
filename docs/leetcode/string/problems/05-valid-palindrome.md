---
layout: page
title: "Valid Palindrome"
difficulty: Easy
category: String
tags: [String, Two Pointers]
leetcode_url: "https://leetcode.com/problems/valid-palindrome/"
leetcode_number: 125
pattern: "Two Pointers"
frequency_tier: 1
companies: [Meta, Microsoft, Amazon, Google, Apple]
target_time_minutes: 10
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Valid Palindrome / Kiểm Tra Chuỗi Đối Xứng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 🔥 Tier 1 — Gặp >90% interviews | **Target**: ⏱️ 10 min
> **Companies**: Meta, Microsoft, Amazon, Google, Apple
> **See also**: [Valid Palindrome II](./16-valid-palindrome-ii.md) | [Two Sum](../../array/problems/04-two-sum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đọc một câu khắc trên đá — bỏ qua dấu câu và khoảng trắng, chỉ giữ lại chữ cái và số. Một người đứng ở đầu câu và một người đứng ở cuối cùng bước lại gặp nhau ở giữa, so sánh từng cặp ký tự. Nếu mọi cặp đều khớp nhau thì câu đó là palindrome.

**Pattern Recognition:**

- Signal: "reads the same forward and backward" → **Two Pointers from both ends**
- Bỏ qua ký tự không phải alphanumeric bằng cách tiến con trỏ vào trong
- So sánh case-insensitive: `s[left].toLowerCase() === s[right].toLowerCase()`

**Visual — "A man, a plan, a canal: Panama":**

```
After filtering: a m a n a p l a n a c a n a l p a n a m a
                 L                                       R

Round 1: s[L]='a' vs s[R]='a' ✓ → L++, R--
Round 2: s[L]='m' vs s[R]='m' ✓ → L++, R--
...
L meets R → return true ✅
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| **When you see** | "palindrome", "reads same forward and backward", "symmetric string"              |
| **Think**        | Two Pointers — compare from both ends, skip non-alphanumeric                     |
| **Template**     | `while (L < R) { skip non-alnum; if (s[L].lower !== s[R].lower) return false; }` |
| **Time target**  | ⏱️ 10 min (Easy)                                                                 |

> 💡 **Memory hook / Móc nhớ:** "Hai người đi từ hai đầu — gặp nhau ở giữa là palindrome!"

---

## Problem Description

A phrase is a palindrome if, after converting to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

```
Example 1: "A man, a plan, a canal: Panama" → true
Example 2: "race a car"                     → false
Example 3: " "                              → true
```

Constraints:

- `1 <= s.length <= 2 * 10^5`
- `s` consists of printable ASCII characters

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1 min)

> "We need to check if a string is a palindrome after removing non-alphanumeric
> characters and ignoring case.
> Clarification: Are digits considered alphanumeric? → Yes. Empty after filtering → true?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2 min)

> "Brute force: filter the string, reverse it, compare — O(n) time but O(n) space.
> I can optimize space by using two pointers from both ends, skipping non-alphanumeric.
> O(n) time, O(1) space. Should I proceed?"

### Step 3 — Implement / Viết Code (3-5 min)

> "I'll use left and right pointers starting at both ends.
> Skip non-alphanumeric characters by advancing pointers inward.
> Compare lowercase versions — if mismatch, return false."

### Step 4 — Review / Kiểm Tra (1 min)

> "Trace 'race a car': after skipping, compare r vs r ✓, a vs a ✓, c vs c ✓,
> then e vs a ✗ → return false. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — each character visited at most once. Space: O(1) — two pointers only.
> Edge cases: all spaces/symbols → empty → true, single char → true.
> Follow-up: delete at most 1 char → LC 680 (try skipping left or right)."

---

## 📝 Interview Tips

1. **Clarify**: Are digits alphanumeric? → Yes / Số có tính là alphanumeric không? → Có
2. **Brute force**: Filter + reverse + compare — O(n) time, O(n) space / Lọc rồi đảo ngược
3. **Optimize**: Two pointers in-place — O(n) time, O(1) space / Hai con trỏ, không tốn thêm bộ nhớ
4. **Edge cases**: All symbols → true; single char → true / Chuỗi toàn dấu câu → true
5. **Follow-up**: Delete at most 1 char? → LC 680 (try skip left or right) / Xóa tối đa 1 ký tự

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                     | Why Wrong / Tại sao sai                                      | Fix / Cách sửa                                           |
| --- | ------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| 1   | Forget to skip non-alphanumeric chars | `"A man..."` has spaces and punctuation that must be ignored | Add inner while loops to skip non-alnum before comparing |
| 2   | Case-sensitive comparison             | `'A' !== 'a'` but they should match for palindrome check     | Always compare `.toLowerCase()`                          |
| 3   | Create filtered string unnecessarily  | Wastes O(n) space when two-pointer approach uses O(1)        | Use in-place two pointers with skip logic                |

---

## Solutions

```typescript
/**
 * Solution 1: Filter + Reverse (Brute Force)
 * Time: O(n) — one filter pass + one reverse pass
 * Space: O(n) — allocates a new cleaned string
 */
function isPalindromeBrute(s: string): boolean {
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return cleaned === cleaned.split("").reverse().join("");
}

/**
 * Solution 2: Two Pointers (Optimal)
 * Time: O(n) — single pass, each character visited at most once
 * Space: O(1) — only two pointer indices
 */
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  const isAlnum = (c: string): boolean => /[a-zA-Z0-9]/.test(c);

  while (left < right) {
    while (left < right && !isAlnum(s[left])) left++;
    while (left < right && !isAlnum(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;

    left++;
    right--;
  }

  return true;
}

// === Test Cases ===
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome(" ")); // true
console.log(isPalindrome("0P")); // false
```

---

## 🔗 Related Problems

- [Valid Palindrome II](./16-valid-palindrome-ii.md) — can delete at most 1 character
- [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/) — same concept on linked list
- [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) — expand-from-center technique
- [Two Sum](../../array/problems/04-two-sum.md) — another two-pointer pattern on arrays

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 10 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
