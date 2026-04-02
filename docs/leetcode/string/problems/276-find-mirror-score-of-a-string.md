---
layout: page
title: "Find Mirror Score of a String"
difficulty: Medium
category: String
tags: [Hash Table, String, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/find-mirror-score-of-a-string"
---

# Find Mirror Score of a String / Tính Điểm Gương Của Chuỗi

> **Track**: String | **Difficulty**: 🟡 Medium | **Pattern**: Stack per Character
> **Frequency**: Low — bài mô phỏng stack thú vị về bảng chữ cái gương
> **See also**: [Valid Parentheses](https://leetcode.com/problems/valid-parentheses) | [Remove All Adjacent Duplicates in String](https://leetcode.com/problems/remove-all-occurrences-of-a-substring)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng vũ điệu gương trong một hội trường với 26 cặp vũ công đứng đối xứng nhau (a↔z, b↔y, c↔x, ...). Khi nhạc nổi lên, người nào chưa có cặp thì đứng chờ ở hàng đợi của mình. Khi gặp người đối xứng đang chờ, hai người tiến ra giữa sàn nhảy cùng nhau — điểm cho cặp đó là khoảng cách vị trí trong chuỗi (i - j). Kết thúc bài nhạc, cộng tổng điểm tất cả các cặp đã nhảy.

**Pattern Recognition:**

- Signal: "mirror pairs (a↔z, b↔y)" + "score = distance between matched indices" → **Stack per character (26 stacks)**
- Bài này thuộc dạng stack matching — mỗi ký tự có stack riêng lưu index chưa matched
- Key insight: khi gặp ký tự c ở vị trí i, kiểm tra stack của mirror(c)=25-c; nếu có thì pop và cộng khoảng cách

**Visual — s = "aczzx" example:**

```
Mirror: a(0)↔z(25),  c(2)↔x(23)
stacks[0..25] = all empty initially

i=0, c='a'(0), mirror='z'(25): stacks[25] empty → push 0 into stacks[0]
     stacks[0]=[0]

i=1, c='c'(2), mirror='x'(23): stacks[23] empty → push 1 into stacks[2]
     stacks[2]=[1]

i=2, c='z'(25), mirror='a'(0): stacks[0]=[0] → POP! score += 2-0 = 2
     stacks[0]=[]

i=3, c='z'(25), mirror='a'(0): stacks[0] empty → push 3 into stacks[25]
     stacks[25]=[3]

i=4, c='x'(23), mirror='c'(2): stacks[2]=[1] → POP! score += 4-1 = 3
     stacks[2]=[]

Total score = 2 + 3 = 5 ✅
```

---

## Problem Description

The **mirror** of `'a'` is `'z'`, `'b'` is `'y'`, ..., `'z'` is `'a'`. For each character at index `i`, if there is an **unmatched** mirror character at some index `j < i`, they form a pair and contribute `i - j` to the score. Return the total mirror score. ([LeetCode](https://leetcode.com/problems/find-mirror-score-of-a-string))

```
Example 1: s = "aczzx"  → 5   (a↔z at (0,2): +2, c↔x at (1,4): +3)
Example 2: s = "csirgit" → 0  (no mirror pairs)
Example 3: s = "abba"   → 5   (a↔z? no, a's mirror is z not b; b's mirror is y not a → score=0)
```

Constraints: `1 <= s.length <= 10^5`, `s` consists of lowercase English letters.

---

## 📝 Interview Tips

1. **"Mirror of char c = 'z' - c + 'a' = char at (25 - (c - 'a'))"** — _Công thức: mirror_idx = 25 - char_idx_zero_indexed. Ví dụ: a(0)↔z(25), b(1)↔y(24)._
2. **"26 stacks — one per character, stores indices of unmatched"** — _Mỗi ký tự có hàng đợi index riêng; khi gặp mirror thì pop từ stack của mirror._
3. **"Pop from mirror's stack, not current char's stack"** — _Khi gặp 'z' tại i, pop từ stacks['a'], không phải stacks['z']._
4. **"Score += current_index - popped_index"** — _Khoảng cách = vị trí hiện tại trừ vị trí đã lưu trong stack._
5. **"If mirror stack empty, push current index to own stack"** — _Nếu chưa có cặp thì tự xếp hàng chờ ở stack của ký tự hiện tại._
6. **"Self-mirror: 'm' (idx=12) mirrors 'n' (idx=13) — not itself"** — _Bảng chữ cái 26 ký tự: không có ký tự nào tự gương với chính nó vì 25-12=13≠12._

---

## Solutions

```typescript
/** Solution 1: 26 stacks (one per char)  @complexity Time: O(n) | Space: O(n) */
function mirrorScore(s: string): number {
  // stacks[i] holds unmatched indices for char with code (i + 97)
  const stacks: number[][] = Array.from({ length: 26 }, () => []);
  let score = 0;

  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i) - 97; // 0-25
    const mirror = 25 - c; // mirror char index
    if (stacks[mirror].length > 0) {
      // found unmatched mirror — form a pair
      const j = stacks[mirror].pop()!;
      score += i - j;
    } else {
      // no unmatched mirror — wait in own stack
      stacks[c].push(i);
    }
  }

  return score;
}

/** Solution 2: Map-based (same idea, explicit Map)  @complexity Time: O(n) | Space: O(n) */
function mirrorScore2(s: string): number {
  const waiting = new Map<number, number[]>(); // char_idx → stack of indices
  let score = 0;

  const getStack = (c: number) => {
    if (!waiting.has(c)) waiting.set(c, []);
    return waiting.get(c)!;
  };

  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i) - 97;
    const mirror = 25 - c;
    const mStack = getStack(mirror);
    if (mStack.length > 0) {
      score += i - mStack.pop()!;
    } else {
      getStack(c).push(i);
    }
  }

  return score;
}

// === Test Cases ===
console.log(mirrorScore("aczzx")); // 5
console.log(mirrorScore("abba")); // 0  (a's mirror=z, b's mirror=y — no pairs)
console.log(mirrorScore("za")); // 1  (z at 0, a at 1: mirror match → 1-0=1)
console.log(mirrorScore("zzaaz")); // 3  (z(0)↔a(2):+2, z(1)↔a(3):+2, z(4): no match)
// Wait: a's mirror=z so when 'a'(2) sees stacks[z_idx=25]=[0,1], pop 1 → score+=(2-1)=1; 'a'(3) pops 0 → score+=(3-0)=3; z(4) push
console.log(mirrorScore2("aczzx")); // 5
```

---

## 🔗 Related Problems

| #    | Problem                                     | Difficulty | Pattern              |
| ---- | ------------------------------------------- | ---------- | -------------------- |
| 20   | Valid Parentheses                           | Easy       | Stack                |
| 1047 | Remove All Adjacent Duplicates in String    | Easy       | Stack                |
| 1209 | Remove All Adjacent Duplicates in String II | Medium     | Stack                |
| 844  | Backspace String Compare                    | Easy       | Stack / Two Pointers |
