---
layout: page
title: "Text Justification"
difficulty: Hard
category: String
tags: [Array, String, Simulation]
leetcode_url: "https://leetcode.com/problems/text-justification"
---

# Text Justification / Căn Lề Văn Bản

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy Line Packing + Space Distribution
> **Frequency**: ⭐ Tier 2 — Gặp ở 33+ companies
> **See also**: [Rearrange Spaces Between Words](https://leetcode.com/problems/rearrange-spaces-between-words) | [String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn đang in báo. Mỗi hàng phải đủ đúng `maxWidth` ký tự — không hơn không kém. Nhét càng nhiều từ vào một hàng càng tốt (greedy), rồi điền khoảng trắng cho vừa khung. Hàng cuối để lề trái (trái sang phải, 1 dấu cách giữa các từ).

- **Pattern Recognition:**
  - Signal: "format/justify text" + "distribute spaces" → **Greedy packing + space math**
  - Nhét từ vào line cho đến khi không còn chỗ (greedy)
  - Tính số gaps = words-1, phân bổ spaces đều, extra spaces phân từ trái sang phải
  - Dòng cuối: left-justified (khoảng cách 1, pad phải)

- **Visual — words = ["This","is","an","example"], maxWidth = 16:**

```
Greedy pack lines:
  Line 1: "This" + "is" + "an" = 10 chars + 2 spaces min = 12 ≤ 16
           add "example"? 10+7+3spaces = 20 > 16 → stop
           Words: ["This","is","an"], total_chars=10, spaces_needed=6
           gaps=2, each=3, extra=0 → "This   is   an"  (16 chars ✓)

  Line 2: ["example"] — single word, left-justify → "example         " (pad right)

Result: ["This   is   an", "example         "]
```

---

## Problem Description

Given an array of words and a `maxWidth`, format the text so each line has exactly `maxWidth` characters and is fully (left and right) justified.
Extra spaces between words are distributed as evenly as possible; if uneven, extra spaces go to the **left** gaps first. The **last line** is left-justified with single spaces.

```
Input: words=["This","is","an","example","of","text","justification"], maxWidth=16
Output: ["This    is    an","example  of text","justification   "]

Input: words=["What","must","be","acknowledgment","shall","be"], maxWidth=16
Output: ["What   must   be","acknowledgment  ","shall be        "]
```

Constraints: `1 ≤ words.length ≤ 300`, `1 ≤ words[i].length ≤ 20`, `maxWidth ≤ 100`.

---

## 📝 Interview Tips

1. **Chia 2 pha**: (1) greedy pack words per line, (2) format spaces for each line / **Two phases**: greedy grouping then formatting
2. **Last line khác**: Dùng 1 khoảng trắng giữa các từ, pad phải bằng space / **Last line**: single space between words, right-pad with spaces
3. **Single word per line**: Pad phải bằng space (treat như last line) / **Single word**: always left-justified + right-pad
4. **Space math**: `gaps = words.length - 1`, `each = Math.floor(totalSpaces/gaps)`, `extra = totalSpaces % gaps` / **Space distribution**: integer division + modulo
5. **Xây string hiệu quả**: Dùng array join, không concat trong vòng lặp / **Build strings**: use arrays and join, avoid `+=` in tight loops
6. **Edge**: Single word per line (gaps=0) — tránh chia cho 0 / **Guard divide-by-zero** when only one word

---

## Solutions

```typescript
/**
 * Solution: Greedy Line Packing + Space Distribution
 * Time: O(total_chars) | Space: O(output_size)
 */
function fullJustify(words: string[], maxWidth: number): string[] {
  const result: string[] = [];
  let i = 0;

  while (i < words.length) {
    // Phase 1: greedily pack words into current line
    let lineLen = words[i].length;
    let j = i + 1;
    while (j < words.length && lineLen + 1 + words[j].length <= maxWidth) {
      lineLen += 1 + words[j].length;
      j++;
    }
    const lineWords = words.slice(i, j);
    const totalChars = lineWords.reduce((s, w) => s + w.length, 0);
    const totalSpaces = maxWidth - totalChars;

    // Phase 2: distribute spaces
    let line: string;
    const isLastLine = j === words.length;

    if (isLastLine || lineWords.length === 1) {
      // Left-justify: 1 space between words, pad right
      line = lineWords.join(" ").padEnd(maxWidth, " ");
    } else {
      const gaps = lineWords.length - 1;
      const spaceEach = Math.floor(totalSpaces / gaps);
      const extraSpaces = totalSpaces % gaps;
      let built = lineWords[0];
      for (let g = 0; g < gaps; g++) {
        const spaces = spaceEach + (g < extraSpaces ? 1 : 0);
        built += " ".repeat(spaces) + lineWords[g + 1];
      }
      line = built;
    }

    result.push(line);
    i = j;
  }
  return result;
}

// === Test Cases ===
console.log(fullJustify(["This", "is", "an", "example", "of", "text", "justification"], 16));
// ["This    is    an", "example  of text", "justification   "]

console.log(fullJustify(["What", "must", "be", "acknowledgment", "shall", "be"], 16));
// ["What   must   be", "acknowledgment  ", "shall be        "]

console.log(fullJustify(["a"], 1)); // ["a"]
console.log(
  fullJustify(["Science", "is", "what", "we", "understand", "well", "enough", "to", "explain"], 20),
);
```

---

## 🔗 Related Problems

| Problem                                                                                        | Relationship                                       |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Rearrange Spaces Between Words](https://leetcode.com/problems/rearrange-spaces-between-words) | Same space redistribution concept, simpler version |
| [Word Wrap](https://leetcode.com/problems/word-wrap)                                           | DP version of greedy line packing                  |
| [Reformat Phone Number](https://leetcode.com/problems/reformat-phone-number)                   | String formatting with padding logic               |
| [Zigzag Conversion](https://leetcode.com/problems/zigzag-conversion)                           | String reconstruction with index math              |
