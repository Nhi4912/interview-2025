---
layout: page
title: "Count Substrings with Only One Distinct Letter"
difficulty: Easy
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/count-substrings-with-only-one-distinct-letter"
---

# count substrings with only one distinct letter

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang **xâu chuỗi hạt cườm** theo màu sắc. Mỗi khi màu thay đổi, bạn "cắt" thành một đoạn mới. Với mỗi đoạn có **k hạt cùng màu liên tiếp**, số cách chọn một đoạn con hợp lệ chính là `k*(k+1)/2` — đây là **số tam giác** (triangular number): tổng của 1 + 2 + … + k.

> **Chìa khóa**: Nhóm các ký tự liên tiếp giống nhau → áp dụng công thức `k*(k+1)/2` cho mỗi nhóm → cộng tất cả lại.

---

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
Input: s = "aaaba"

Bước 1 — Phân nhóm ký tự liên tiếp giống nhau:
  ┌───────────────────────────────────┐
  │  a  a  a  │  b  │  a             │
  │  └──────┘    └─┘   └─┘           │
  │  Group 1   Group 2  Group 3      │
  │   k = 3     k = 1   k = 1        │
  └───────────────────────────────────┘

Bước 2 — Áp dụng k*(k+1)/2 cho mỗi nhóm:
  Group 1 (aaa): 3 * 4 / 2 = 6
    Substrings: "a"[0]  "a"[1]  "a"[2]  "aa"[0-1]  "aa"[1-2]  "aaa"[0-2]

  Group 2 (b):   1 * 2 / 2 = 1
    Substrings: "b"[3]

  Group 3 (a):   1 * 2 / 2 = 1
    Substrings: "a"[4]

Bước 3 — Cộng tổng:
  6 + 1 + 1 = 8 ✓
```

---

---

## Problem Description

| #    | Tên bài                                                                                                         | Độ khó | Tags       |
| ---- | --------------------------------------------------------------------------------------------------------------- | ------ | ---------- |
| 413  | [Arithmetic Slices](https://leetcode.com/problems/arithmetic-slices/)                                           | Medium | Array, DP  |
| 467  | [Unique Substrings in Wraparound String](https://leetcode.com/problems/unique-substrings-in-wraparound-string/) | Medium | String, DP |
| 696  | [Count Binary Substrings](https://leetcode.com/problems/count-binary-substrings/)                               | Easy   | String     |
| 1446 | [Consecutive Characters](https://leetcode.com/problems/consecutive-characters/)                                 | Easy   | String     |
| 2262 | [Total Appeal of a String](https://leetcode.com/problems/total-appeal-of-a-string/)                             | Hard   | String, DP |

---

## 📝 Interview Tips

1. **Recognize the grouping pattern** — Consecutive identical chars form independent, non-overlapping groups.
   _Nhận ra mẫu nhóm — Các ký tự liên tiếp giống nhau tạo các nhóm độc lập, không chồng lấp._

2. **Apply the triangular number formula** — For a run of length k, count = k*(k+1)/2; this sums 1+2+…+k.
   \_Dùng công thức số tam giác — Nhóm k ký tự có đúng k*(k+1)/2 substring hợp lệ (tổng 1+2+…+k).\_

3. **Flush the last group after the loop** — The loop only counts when the character changes; the final run must be added separately.
   _Tính nhóm cuối sau vòng lặp — Vòng lặp chỉ tính khi đổi ký tự; nhóm cuối phải cộng riêng._

4. **O(1) space is achievable** — No auxiliary array needed; a single counter variable is sufficient.
   _Không cần mảng phụ — Chỉ một biến đếm đủ để đạt O(1) space._

5. **Brute force is safe for n ≤ 1000** — O(n²) passes the constraints, but lead with the O(n) approach.
   _Brute force an toàn với n ≤ 1000 — O(n²) vẫn pass, nhưng hãy trình bày O(n) trước._

6. **Edge case: single character** — Returns 1; formula k*(k+1)/2 = 1*2/2 = 1 handles it automatically.
   _Trường hợp đặc biệt: chuỗi một ký tự — Trả về 1; công thức tự xử lý đúng với k=1._

---

---

## Solutions

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * @description Duyệt chuỗi một lần, đếm độ dài nhóm ký tự liên tiếp giống nhau.
 * Khi ký tự thay đổi (hoặc kết thúc chuỗi), cộng k*(k+1)/2 vào kết quả.
 */
function countLetters(s: string): number {
  let result = 0;
  let count = 1;

  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      count++;
    } else {
      result += (count * (count + 1)) / 2;
      count = 1;
    }
  }

  // Xử lý nhóm cuối cùng (vòng lặp không kịp flush khi s[i] không đổi đến cuối)
  result += (count * (count + 1)) / 2;

  return result;
}

/**
 * @complexity Time: O(n²) | Space: O(1)
 * @description Với mỗi vị trí bắt đầu i, mở rộng j sang phải miễn là
 * s[j] === s[i]. Dừng ngay khi gặp ký tự khác — mọi extension tiếp theo
 * cũng sẽ không hợp lệ nên không cần duyệt tiếp.
 */
function countLettersBrute(s: string): number {
  let result = 0;
  const n = s.length;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (s[j] === s[i]) {
        result++;
      } else {
        break; // Ký tự khác → mọi j lớn hơn cũng không hợp lệ
      }
    }
  }

  return result;
}

// === Test Cases ===
// Solution 1 — Group Consecutive: O(n)
console.log(countLetters("aaaba")); // 8
console.log(countLetters("aaaaaaaaaa")); // 55
console.log(countLetters("a")); // 1
console.log(countLetters("abc")); // 3
console.log(countLetters("aabb")); // 6

// Solution 2 — Brute Force: O(n²)
console.log(countLettersBrute("aaaba")); // 8
console.log(countLettersBrute("aaaaaaaaaa")); // 55
console.log(countLettersBrute("a")); // 1
console.log(countLettersBrute("abc")); // 3
console.log(countLettersBrute("aabb")); // 6
```

---

## 🔗 Related Problems

| #    | Tên bài                                                                                                         | Độ khó | Tags       |
| ---- | --------------------------------------------------------------------------------------------------------------- | ------ | ---------- |
| 413  | [Arithmetic Slices](https://leetcode.com/problems/arithmetic-slices/)                                           | Medium | Array, DP  |
| 467  | [Unique Substrings in Wraparound String](https://leetcode.com/problems/unique-substrings-in-wraparound-string/) | Medium | String, DP |
| 696  | [Count Binary Substrings](https://leetcode.com/problems/count-binary-substrings/)                               | Easy   | String     |
| 1446 | [Consecutive Characters](https://leetcode.com/problems/consecutive-characters/)                                 | Easy   | String     |
| 2262 | [Total Appeal of a String](https://leetcode.com/problems/total-appeal-of-a-string/)                             | Hard   | String, DP |
