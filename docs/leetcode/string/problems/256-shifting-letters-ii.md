---
layout: page
title: "Shifting Letters II"
difficulty: Medium
category: String
tags: [Array, String, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/shifting-letters-ii"
---

# Shifting Letters II / Dịch Chuyển Chữ Cái II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count Vowel Strings in Ranges](https://leetcode.com/problems/count-vowel-strings-in-ranges) | [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ đến hệ thống điều hòa nhiệt độ trong một tòa nhà — mỗi lệnh tăng/giảm nhiệt độ áp dụng cho một dải phòng từ tầng L đến tầng R. Thay vì chỉnh từng phòng một (O(n) mỗi lệnh), ta dùng "mảng hiệu" (difference array): đánh dấu +1 hoặc -1 tại điểm bắt đầu và kết thúc, rồi quét tổng tích lũy để tính nhiệt độ từng phòng chỉ trong O(n).

**Pattern Recognition:**

- Signal: "range updates" + "apply multiple intervals" + "build final string" → **Difference Array / Prefix Sum**
- Key insight: Với mỗi shift [l, r, direction]: diff[l] += (+1 or -1), diff[r+1] -= (+1 or -1). Tính prefix sum của diff → tổng shift tại mỗi vị trí. Áp dụng shift modulo 26.

**Visual — s="abc", shifts=[[0,1,0],[1,2,1]]:**

```
diff array (size n+1): [0, 0, 0, 0]

shift [0,1,0] (backward=-1): diff[0]+=-1, diff[2]-= -1
  diff: [-1, 0, 1, 0]

shift [1,2,1] (forward=+1): diff[1]+=1, diff[3]-=1
  diff: [-1, 1, 1, -1]

Prefix sum:
  pos 0: running = -1  → shift 'a' by -1 = 'z'
  pos 1: running = -1+1=0  → shift 'b' by 0 = 'b'
  pos 2: running = 0+1=1  → shift 'c' by 1 = 'd'

Result: "zbd"
```

---

## 📝 Problem Description

Given string `s` and array of `shifts` where `shifts[i]=[start, end, direction]`, for direction=1 shift chars forward (a→b→...→z→a), direction=0 shift backward. Apply all shifts simultaneously. Return the resulting string.

- **Example 1:** s="abc", shifts=[[0,1,0],[1,2,1]] → `"zbd"`
- **Example 2:** s="dztz", shifts=[[0,0,0],[1,1,1]] → `"catz"`

Constraints: `1 ≤ n ≤ 5×10^4`, `1 ≤ shifts.length ≤ 5×10^4`.

---

## 🎯 Interview Tips

1. **Difference array pattern** / Mảng hiệu: For range [l,r] update: mark start and past-end → sweep once for totals.
2. **Direction encoding** / Mã hóa chiều: direction=1 means +1, direction=0 means -1.
3. **Modulo 26** / Modulo 26: Total shift at each position modulo 26. Handle negative: `((shift % 26) + 26) % 26`.
4. **Don't apply shifts one by one** / Không áp dụng từng cái một: That's O(n × shifts) = O(n²). Use diff array for O(n + shifts).
5. **Build result char by char** / Xây dựng kết quả: Compute new char = `(s[i].charCodeAt - 'a' + totalShift) % 26 + 'a'`.
6. **Off-by-one** / Lỗi lệch 1: diff[r+1] -= delta. Size of diff array = n+1.

---

## 💡 Solutions

### Approach 1: Brute Force — Apply Each Shift Range

/\*_ @complexity Time: O(n × shifts.length) | Space: O(1) _/

```typescript
function shiftingLettersBrute(s: string, shifts: number[][]): string {
  const arr = s.split("").map((c) => c.charCodeAt(0) - 97);
  for (const [l, r, dir] of shifts) {
    const delta = dir === 1 ? 1 : -1;
    for (let i = l; i <= r; i++) {
      arr[i] = (((arr[i] + delta) % 26) + 26) % 26;
    }
  }
  return arr.map((c) => String.fromCharCode(c + 97)).join("");
}
```

### Approach 2: Difference Array — O(n + m)

/\*_ @complexity Time: O(n + m) | Space: O(n) _/

```typescript
function shiftingLetters(s: string, shifts: number[][]): string {
  const n = s.length;
  const diff = new Array(n + 1).fill(0);

  // Mark range updates in difference array
  for (const [l, r, dir] of shifts) {
    const delta = dir === 1 ? 1 : -1;
    diff[l] += delta;
    if (r + 1 <= n) diff[r + 1] -= delta;
  }

  // Compute prefix sum → total shift at each position
  const result: string[] = [];
  let runningShift = 0;
  for (let i = 0; i < n; i++) {
    runningShift += diff[i];
    const base = s.charCodeAt(i) - 97;
    const shifted = (((base + runningShift) % 26) + 26) % 26;
    result.push(String.fromCharCode(shifted + 97));
  }
  return result.join("");
}
```

---

## 🧪 Test Cases

```typescript
console.log(
  shiftingLetters("abc", [
    [0, 1, 0],
    [1, 2, 1],
  ]),
); // → "zbd"
console.log(
  shiftingLetters("dztz", [
    [0, 0, 0],
    [1, 1, 1],
  ]),
); // → "catz"
console.log(shiftingLetters("a", [[0, 0, 1]])); // → "b"
console.log(shiftingLetters("z", [[0, 0, 1]])); // → "a"
console.log(
  shiftingLetters("abcde", [
    [1, 3, 0],
    [0, 4, 1],
  ]),
); // → "bcbcd"
```

---

## 🔗 Related Problems

| Problem                                                                                      | Difficulty | Pattern          |
| -------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Count Vowel Strings in Ranges](https://leetcode.com/problems/count-vowel-strings-in-ranges) | Medium     | Prefix Sum       |
| [Range Addition](https://leetcode.com/problems/range-addition)                               | Medium     | Difference Array |
| [Car Pooling](https://leetcode.com/problems/car-pooling)                                     | Medium     | Difference Array |
| [Shifting Letters](https://leetcode.com/problems/shifting-letters)                           | Medium     | Prefix Sum       |
