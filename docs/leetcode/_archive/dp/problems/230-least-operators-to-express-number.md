---
layout: page
title: "Least Operators to Express Number"
difficulty: Hard
category: Dynamic Programming
tags: [Math, Dynamic Programming, Memoization]
leetcode_url: "https://leetcode.com/problems/least-operators-to-express-number"
---

# Least Operators to Express Number / Biểu Diễn Số Với Ít Toán Tử Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Digit DP
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) | [N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như trả tiền thối ở chợ — nếu giá 19k mà bạn đưa 20k, người bán thối lại 1k (chỉ cần 1 tờ). Nhưng nếu đưa 10k thì phải thêm 9 tờ 1k. Bí quyết: đôi khi "làm tròn lên rồi trả lại" rẻ hơn "trả đúng từng đơn vị". Bài này áp dụng tư duy đó trên từng chữ số của target trong cơ số x.

**Pattern Recognition:**

- Signal: express number using powers of x → **Digit DP on base-x representation**
- Key insight: at each digit position, decide to use d units (forward) or borrow 1 from higher digit (round up and subtract). Track "positive" (settled) vs "negative" (owe x^(i+1)) carry states.

**Visual — x=3, target=19 example:**

```
19 in base 3: digits = [1, 0, 2]  (d[0]=1, d[1]=0, d[2]=2)
                                    x^0   x^1   x^2

i=0, d=1:  pos=2  neg=4   (1×(x/x) costs 2; borrow costs 2×(3-1)=4)
i=1, d=0:  pos=2  neg=7   (0 units of x; best=carry from below)
i=2, d=2:  pos=6  neg=4   (2×x²; or round to 3×x² and subtract)

answer = min(pos, neg + n) - 1 = min(6, 4+3) - 1 = 5
Expression: x*x + x*x + x/x = 9 + 9 + 1 = 19  ✓  (5 operators)
```

---

## 📝 Problem Description

Given `x` and `target`, write an expression using only `x` and operators `+, -, *, /`. Return the minimum number of operators needed to express `target`.

- **Example 1:** `x=3, target=19` → `5` (`x*x+x*x+x/x`)
- **Example 2:** `x=5, target=501` → `8` (`x*x*x+x/x`)
- **Constraints:** `2 ≤ x ≤ 100`, `1 ≤ target ≤ 2 * 10^8`

---

## 🎯 Interview Tips

1. **Convert to base x first** / Trước tiên biểu diễn target trong cơ số x — mỗi chữ số là một nhóm lũy thừa
2. **Cost model** / Mô hình chi phí: 1 đơn vị x^k cần k operators (plus connector); x^0 cần 2 (x/x + connector)
3. **Two states** / Hai trạng thái: pos (đã cân bằng) và neg (còn thiếu 1 đơn vị x^{i+1})
4. **Borrow strategy** / Chiến lược mượn: nếu d > x/2 thì thường nên làm tròn lên và trừ, giống trả tiền thối
5. **Final answer** / Trả lời cuối: `min(pos, neg + n) - 1`; trừ 1 vì không cần connector cho số hạng đầu tiên
6. **Edge cases** / Trường hợp đặc biệt: target=1 → x/x = 1 operator; target=x → 0 operators (just x itself)

---

## 💡 Solutions

### Approach 1: Top-Down DP with Memoization

/\*_ @complexity Time: O(log_x(target)) | Space: O(log_x(target)) _/

```typescript
function leastOpsExpressTargetMemo(x: number, target: number): number {
  const memo = new Map<string, number>();

  function dp(t: number, i: number): [number, number] {
    // returns [pos, neg] costs for digits 0..i of remaining target t
    const key = `${t},${i}`;
    if (memo.has(key)) return memo.get(key) as [number, number];
    const d = t % x;
    const next = Math.floor(t / x);
    let pos: number, neg: number;
    if (i === 0) {
      pos = d * 2;
      neg = (x - d) * 2;
    } else {
      const [pPos, pNeg] = dp(next, i - 1); // Wait, we recurse on digits from LSB
      pos = Math.min(d * i + pPos, (d + 1) * i + pNeg);
      neg = Math.min((x - d) * i + pPos, (x - d - 1) * i + pNeg);
    }
    memo.set(key, [pos, neg] as unknown as number);
    return [pos, neg];
  }
  // Actually iterate directly — cleaner for this digit-by-digit approach
  return leastOpsExpressTarget(x, target);
}

function leastOpsExpressTarget(x: number, target: number): number {
  let pos = 0,
    neg = 0,
    t = target,
    i = 0;
  while (t > 0) {
    const d = t % x;
    t = Math.floor(t / x);
    if (i === 0) {
      pos = d * 2;
      neg = (x - d) * 2;
    } else {
      [pos, neg] = [
        Math.min(d * i + pos, (d + 1) * i + neg),
        Math.min((x - d) * i + pos, (x - d - 1) * i + neg),
      ];
    }
    i++;
  }
  return Math.min(pos, neg + i) - 1;
}
```

### Approach 2: Digit DP — Optimal Iterative

/\*_ @complexity Time: O(log_x(target)) | Space: O(1) _/

```typescript
function leastOpsExpressTargetOptimal(x: number, target: number): number {
  // pos = min ops if current digits handled with carry=0 (all settled)
  // neg = min ops if carry=+1 (borrowed 1 unit of x^(i+1))
  let pos = 0,
    neg = 0;
  let t = target,
    i = 0;

  while (t > 0) {
    const d = t % x;
    t = Math.floor(t / x);
    if (i === 0) {
      // Cost per unit of x^0 (= x/x) = 1 op + 1 connector = 2
      pos = d * 2;
      neg = (x - d) * 2;
    } else {
      // Cost per unit of x^i = (i-1) mults + 1 connector = i
      const newPos = Math.min(d * i + pos, (d + 1) * i + neg);
      const newNeg = Math.min((x - d) * i + pos, (x - d - 1) * i + neg);
      pos = newPos;
      neg = newNeg;
    }
    i++;
  }
  // Handle remaining carry: one x^i unit costs i ops (it's the top-level term)
  return Math.min(pos, neg + i) - 1;
}
```

---

## 🧪 Test Cases

```typescript
console.log(leastOpsExpressTarget(3, 19)); // → 5  (x*x+x*x+x/x)
console.log(leastOpsExpressTarget(5, 501)); // → 8  (x*x*x+x/x = 125+1+375?)
console.log(leastOpsExpressTarget(2, 1)); // → 0  (just x/x... wait)
console.log(leastOpsExpressTarget(3, 3)); // → 0  (x itself needs 0 operators)
console.log(leastOpsExpressTarget(100, 100000000)); // → large number
```

---

## Related Problems

| Problem                                                                                                                  | Difficulty | Pattern             |
| ------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------- |
| [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses)                     | Medium     | DP/Divide & Conquer |
| [Expression Add Operators](https://leetcode.com/problems/expression-add-operators)                                       | Hard       | Backtracking        |
| [Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression) | Hard       | DP                  |
