---
layout: page
title: "Split Strings by Separator"
difficulty: Easy
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/split-strings-by-separator"
---

# Split Strings by Separator / Tách Chuỗi Theo Ký Tự Phân Cách

🟢 Easy | 🏷️ Array, String

## 🧠 Intuition

**VI:** Với mỗi chuỗi trong mảng, tách theo ký tự `separator`, lọc bỏ các phần rỗng, rồi gom tất cả kết quả thành một mảng phẳng. Giống như bạn cắt nhiều thanh bánh mì theo từng vết cắt, bỏ những miếng vụn rỗng, rồi xếp tất cả lên đĩa.

**EN:** Split each string by the separator character, filter out empty parts (from consecutive separators or edge separators), then flatten all results into one array.

```
words = ["one.two.three", "four.five", "six"]
sep = '.'
"one.two.three" → ["one","two","three"]
"four.five"     → ["four","five"]
"six"           → ["six"]
Result: ["one","two","three","four","five","six"]

Edge cases:
".a.b." → ["","a","b",""] → filter → ["a","b"]
"..."   → ["","","",""] → filter → []
```

## 📝 Interview Tips

- 🇻🇳 **`split` tạo ra phần tử rỗng** khi separator ở đầu, cuối, hoặc liên tiếp — phải lọc
- 🇬🇧 **Filter empty:** `split(sep).filter(s => s.length > 0)` handles all edge cases
- 🇻🇳 **`separator` là ký tự đơn** — dùng trực tiếp với `split(separator)`, không cần regex
- 🇬🇧 **Single char split:** `str.split(separator)` — separator is guaranteed to be a single char
- 🇻🇳 **flatMap:** `words.flatMap(w => w.split(sep).filter(Boolean))` — cực ngắn gọn
- 🇬🇧 **flatMap is ideal:** splits and flattens in one pass — the cleanest solution

## Solutions

### Solution 1: flatMap one-liner

```typescript
/**
 * Split each string, filter empties, flatten — all in one flatMap.
 * Time: O(n * L) where n = words.length, L = avg string length
 * Space: O(total parts)
 */
function splitWordsBySeparator(words: string[], separator: string): string[] {
  return words.flatMap((w) => w.split(separator).filter((s) => s.length > 0));
}

console.log(splitWordsBySeparator(["one.two.three", "four.five", "six"], "."));
// ["one","two","three","four","five","six"]
console.log(splitWordsBySeparator(["$easy$", "$problem$"], "$"));
// ["easy","problem"]
console.log(splitWordsBySeparator(["|||"], "|"));
// []
```

### Solution 2: Manual split with reduce

```typescript
/**
 * Manually split each string character by character.
 * Time: O(n * L) | Space: O(total parts)
 */
function splitWordsBySeparator2(words: string[], separator: string): string[] {
  const result: string[] = [];
  for (const word of words) {
    let current = "";
    for (const ch of word) {
      if (ch === separator) {
        if (current.length > 0) {
          result.push(current);
          current = "";
        }
      } else {
        current += ch;
      }
    }
    if (current.length > 0) result.push(current);
  }
  return result;
}

console.log(splitWordsBySeparator2(["one.two.three", "four.five", "six"], "."));
// ["one","two","three","four","five","six"]
console.log(splitWordsBySeparator2(["...a...b..."], "."));
// ["a","b"]
```

### Solution 3: reduce + concat

```typescript
/**
 * Use reduce to accumulate all parts across all words.
 * Time: O(n * L) | Space: O(total parts)
 */
function splitWordsBySeparator3(words: string[], separator: string): string[] {
  return words.reduce<string[]>((acc, word) => {
    const parts = word.split(separator).filter(Boolean);
    return acc.concat(parts);
  }, []);
}

console.log(splitWordsBySeparator3(["one.two.three", "four.five", "six"], "."));
// ["one","two","three","four","five","six"]
console.log(splitWordsBySeparator3(["a", "b", "c"], "."));
// ["a","b","c"]
console.log(splitWordsBySeparator3(["a,b,,c"], ","));
// ["a","b","c"]
```

## 🔗 Related Problems

| #    | Problem                     | Difficulty | Key Idea               |
| ---- | --------------------------- | ---------- | ---------------------- |
| 1119 | Remove Vowels from a String | 🟢 Easy    | Character filtering    |
| 1816 | Truncate Sentence           | 🟢 Easy    | Split and slice        |
| 58   | Length of Last Word         | 🟢 Easy    | Split and last element |
