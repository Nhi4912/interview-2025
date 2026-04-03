---
layout: page
title: "Invalid Tweets"
difficulty: Easy
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/invalid-tweets"
---

# Invalid Tweets / Tweet Không Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: SQL — Simple Filter
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Big Countries](https://leetcode.com/problems/big-countries) | [Recyclable and Low Fat Products](https://leetcode.com/problems/recyclable-and-low-fat-products)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bộ lọc spam — chỉ cần đo độ dài nội dung tweet và lọc ra những cái quá dài (> 15 ký tự).

**Pattern Recognition:**

- Signal: "filter rows by string length condition" → **WHERE + LENGTH()**
- Bài dễ nhất trong SQL category — chỉ cần biết `LENGTH()` hoặc `CHAR_LENGTH()`
- Key insight: dùng `CHAR_LENGTH()` thay `LENGTH()` để xử lý multi-byte chars đúng

**Visual — Filter pipeline:**

```
Tweets table:
tweet_id | content
1        | "Let us Code"          → length=12 ✗
2        | "More than fifteen.."  → length=17 ✓ INVALID

SELECT tweet_id WHERE LENGTH(content) > 15
Result: [2]
```

---

## Problem Description

Write SQL to find `tweet_id` of **invalid tweets** — tweets where the number of characters in `content` **strictly exceeds** 15. ([LeetCode 1683](https://leetcode.com/problems/invalid-tweets))

**Schema:** `Tweets(tweet_id INT, content VARCHAR)`

**Example:** `content = "Let us Code"` (12 chars) → valid; `content = "More than fifteen.."` (17 chars) → invalid → return `tweet_id`.

Constraints: `tweet_id` is primary key; content is non-null.

---

## 📝 Interview Tips

1. **CHAR_LENGTH vs LENGTH**: "`LENGTH()` = bytes, `CHAR_LENGTH()` = characters — dùng CHAR_LENGTH cho Unicode" / Use CHAR_LENGTH for multi-byte safety
2. **Strict inequality**: "Strictly greater than 15, NOT ≥ 15" / The threshold is exclusive: > 15
3. **Indexing**: "In production, full-text filtering needs computed column or full scan" / No index on length
4. **Follow-up**: "Nếu content có emoji/multi-byte? CHAR_LENGTH vẫn đếm đúng" / CHAR_LENGTH counts code points
5. **Simplicity**: "Bài này chỉ cần một WHERE clause" / Single-condition filter

---

## Solutions

```sql
-- Solution 1: CHAR_LENGTH (recommended — correct for multi-byte)
SELECT tweet_id
FROM Tweets
WHERE CHAR_LENGTH(content) > 15;

-- Solution 2: LENGTH (works for ASCII-only content)
SELECT tweet_id
FROM Tweets
WHERE LENGTH(content) > 15;

-- Solution 3: Using LEN (SQL Server syntax)
-- SELECT tweet_id FROM Tweets WHERE LEN(content) > 15;
```

```typescript
// TypeScript simulation for logic verification
interface Tweet {
  tweet_id: number;
  content: string;
}

/**
 * Find invalid tweets (content length > 15)
 * Time: O(n) — single scan
 * Space: O(k) — k = number of invalid tweets
 */
function invalidTweets(tweets: Tweet[]): number[] {
  return tweets.filter((t) => t.content.length > 15).map((t) => t.tweet_id);
}

// Edge case: emoji counts as 2 chars in JS (surrogate pairs)
// For true Unicode code points: [...content].length
function invalidTweetsUnicode(tweets: Tweet[]): number[] {
  return tweets.filter((t) => [...t.content].length > 15).map((t) => t.tweet_id);
}

// === Test Cases ===
const tweets: Tweet[] = [
  { tweet_id: 1, content: "Let us Code" }, // 11 chars → valid
  { tweet_id: 2, content: "More than fifteen.." }, // 19 chars → invalid
  { tweet_id: 3, content: "Exactly fifteen!!" }, // 17 chars → invalid
];
console.log(invalidTweets(tweets)); // [2, 3]
console.log(invalidTweets([{ tweet_id: 1, content: "Short" }])); // []
```

---

## 🔗 Related Problems

- [Big Countries](https://leetcode.com/problems/big-countries) — simple WHERE filter (area/population)
- [Recyclable and Low Fat Products](https://leetcode.com/problems/recyclable-and-low-fat-products) — multi-condition filter
- [Find Users With Valid E-Mails](https://leetcode.com/problems/find-users-with-valid-e-mails) — REGEXP filter
- [Patients With a Condition](https://leetcode.com/problems/patients-with-a-condition) — string pattern matching
- [Invalid Tweets — LeetCode](https://leetcode.com/problems/invalid-tweets) — problem page
