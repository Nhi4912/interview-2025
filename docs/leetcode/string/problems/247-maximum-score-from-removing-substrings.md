---
layout: page
title: "Maximum Score From Removing Substrings"
difficulty: Medium
category: String
tags: [String, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-score-from-removing-substrings"
---

# Maximum Score From Removing Substrings / Điểm Tối Đa Khi Xóa Chuỗi Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Remove K Digits](https://leetcode.com/problems/remove-k-digits) | [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống trò chơi "xếp đôi" trong bộ bài Tam Cúc — khi lá trên tay khớp với lá trước đó, bạn ăn cặp để ghi điểm. Chiến lược tối ưu: luôn ưu tiên ăn cặp có giá trị cao nhất trước (greedy). Dùng stack như "tay bài hiện tại" — nhìn lá trên cùng, nếu tạo thành cặp thì ăn ngay và ghi điểm.

**Pattern Recognition:**

- Signal: "remove adjacent pair for points" + "order of removal matters for max score" → **Greedy + Stack**
- Key insight: Luôn loại bỏ cặp có điểm cao hơn trước. Dùng stack hai lần: lần 1 cho cặp cao, lần 2 cho cặp thấp trên phần còn lại.

**Visual — s="cdbcbbaaabab", x=4 (ab), y=5 (ba):**

```
y(ba)=5 > x(ab)=4 → remove "ba" first

Stack pass 1 (remove "ba", +5 each):
  c→[c] d→[c,d] b→[c,d,b] c→[c,d,b,c] b→[c,d,b,c,b]
  b→[c,d,b,c,b,b]
  a→top='b' + 'a'='ba'! pop, score+=5 → [c,d,b,c,b] s=5
  a→top='b' + 'a'='ba'! pop, score+=5 → [c,d,b,c]   s=10
  b→[c,d,b,c,b] a→pop,score=15 b→[c,d,b,c,b]
Remaining after pass1: "cdbcb" + leftover

Stack pass 2 (remove "ab" on remainder, +4 each):
  → finds "ab" pairs → total score = 19
```

---

## 📝 Problem Description

Given string `s` and integers `x` (score for removing "ab") and `y` (score for removing "ba"), repeatedly remove "ab" or "ba" to maximize total score. Return max score.

- **Example 1:** s="cdbcbbaaabab", x=4, y=5 → `19`
- **Example 2:** s="aabbaaxybbaabb", x=5, y=4 → `20`

Constraints: `1 ≤ n ≤ 10^5`, `1 ≤ x, y ≤ 10^4`.

---

## 🎯 Interview Tips

1. **Greedy order** / Thứ tự tham lam: Remove the higher-value pair first — this is provably optimal.
2. **Why greedy works** / Tại sao greedy đúng: Removing a lower-value pair may block a higher-value one; taking high first never blocks low pairs in aggregate.
3. **Stack for pair detection** / Stack để phát hiện cặp: O(n) scan with stack; peek last char to detect adjacent pair.
4. **Two-pass structure** / Hai lượt quét: First pass removes high pair, second removes low pair on remainder.
5. **Normalize direction** / Chuẩn hóa: Swap (pair, value) if y > x to reuse same helper function.
6. **No in-place removal** / Không xóa tại chỗ: Build new string via stack — avoid O(n²) substring removal.

---

## 💡 Solutions

### Approach 1: Simulation — Repeated String Replace

/\*_ @complexity Time: O(n²) | Space: O(n) _/

```typescript
function maximumGainBrute(s: string, x: number, y: number): number {
  let score = 0;
  const [high, hv, low, lv] = x >= y ? ["ab", x, "ba", y] : ["ba", y, "ab", x];
  let str = s;
  while (str.includes(high)) {
    score += hv;
    str = str.replace(high, "");
  }
  while (str.includes(low)) {
    score += lv;
    str = str.replace(low, "");
  }
  return score;
}
```

### Approach 2: Greedy Stack — Two-Pass O(n)

/\*_ @complexity Time: O(n) | Space: O(n) _/

```typescript
function maximumGain(s: string, x: number, y: number): number {
  // Ensure we process the higher-value pair first
  const [p1, p2, fv, sv] = x >= y ? ["a", "b", x, y] : ["b", "a", y, x];

  function stackRemove(str: string, first: string, second: string, pts: number): [string, number] {
    const stk: string[] = [];
    let gained = 0;
    for (const ch of str) {
      if (stk.length > 0 && stk[stk.length - 1] === first && ch === second) {
        stk.pop();
        gained += pts;
      } else {
        stk.push(ch);
      }
    }
    return [stk.join(""), gained];
  }

  const [rem, score1] = stackRemove(s, p1, p2, fv);
  const [, score2] = stackRemove(rem, p2, p1, sv);
  return score1 + score2;
}
```

---

## 🧪 Test Cases

```typescript
console.log(maximumGain("cdbcbbaaabab", 4, 5)); // → 19
console.log(maximumGain("aabbaaxybbaabb", 5, 4)); // → 20
console.log(maximumGain("ab", 3, 2)); // → 3
console.log(maximumGain("ba", 3, 2)); // → 2
console.log(maximumGain("aabb", 4, 5)); // → 9
```

---

## 🔗 Related Problems

| Problem                                                                            | Difficulty | Pattern         |
| ---------------------------------------------------------------------------------- | ---------- | --------------- |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits)                   | Medium     | Monotonic Stack |
| [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters) | Medium     | Monotonic Stack |
| [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string) | Medium     | Stack / Greedy  |
| [Score of Parentheses](https://leetcode.com/problems/score-of-parentheses)         | Medium     | Stack           |
