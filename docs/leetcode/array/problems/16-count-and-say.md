---
layout: page
title: "Count and Say"
difficulty: Medium
category: Array
tags: [String, Two Pointers]
leetcode_url: "https://leetcode.com/problems/count-and-say/"
---

# Count and Say / Đọc Và Nói Chuỗi Số

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Simulation — Run-Length Encoding
> **Frequency**: 📘 Tier 3 — Thỉnh thoảng xuất hiện; kiểm tra khả năng simulate theo spec
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Encode and Decode Strings #271](https://leetcode.com/problems/encode-and-decode-strings/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Đây là trò chơi "telephone với số": người đầu tiên nói "1". Người kế tiếp nhìn vào chuỗi, đếm từng nhóm chữ số giống nhau liên tiếp rồi "đọc to" — "có 1 chữ số 1" → "11". Người kế nhìn vào "11" → "có 2 chữ số 1" → "21". Cứ thế tiếp tục n lần. Đây chính là **Run-Length Encoding** (RLE) áp dụng đệ quy.

- **Pattern Recognition:**
  - Mỗi bước: nhóm các ký tự giống nhau liên tiếp (RLE) → tạo chuỗi mới
  - Iterative tốt hơn recursive để tránh stack overflow với n lớn
  - Regex `(.)\1*` khớp mỗi nhóm ký tự liên tiếp giống nhau — đây là cách viết ngắn gọn nhất

- **Visual — Từng bước xây dựng chuỗi:**

  ```
  n=1: "1"
       └→ đọc: "một chữ số 1"           → n=2: "11"
              └→ đọc: "hai chữ số 1"    → n=3: "21"
                      └→ đọc: "một 2, một 1" → n=4: "1211"
                              └→ đọc: "một 1, một 2, hai 1" → n=5: "111221"

  Quét "1211" để tạo bước tiếp:
  j=1: s[1]='2' ≠ s[0]='1' → emit "1"+"1"="11", count=1, digit='2'
  j=2: s[2]='1' ≠ s[1]='2' → emit "1"+"2"="12", count=1, digit='1'
  j=3: s[3]='1' = s[2]='1' → count=2
  end:                       → emit "2"+"1"="21"
  Kết quả: "11" + "12" + "21" = "111221" ✅
  ```

## Problem Description

Chuỗi count-and-say được định nghĩa đệ quy: `countAndSay(1) = "1"`, `countAndSay(n)` là cách "đọc to" `countAndSay(n-1)`. Cho `n` (1 ≤ n ≤ 30), trả về chuỗi thứ n.

| n   | Output     | Giải thích                   |
| --- | ---------- | ---------------------------- |
| 1   | `"1"`      | Base case                    |
| 4   | `"1211"`   | "21" → một 1, một 2, một 1   |
| 5   | `"111221"` | "1211" → một 1, một 2, hai 1 |

## 📝 Interview Tips

- 🇻🇳 Clarify ngay: `countAndSay(n)` build dựa trên `n-1`, không phải dựa trên số n / 🇬🇧 _Clarify: each term describes the PREVIOUS term, not the number n itself_
- 🇻🇳 Iterative tốt hơn recursive vì n có thể đến 30, chuỗi tăng theo hàm mũ / 🇬🇧 _Prefer iterative — at n=30, string length explodes; recursion risks stack overflow_
- 🇻🇳 Chuỗi count-and-say chỉ chứa chữ số 1, 2, 3 — không bao giờ có 4 hay hơn / 🇬🇧 _Fun fact: the sequence only ever contains digits 1, 2, 3_
- 🇻🇳 Regex solution cực ngắn nhưng kém hiệu năng hơn do regex overhead / 🇬🇧 _Regex is concise for interviews but has overhead vs manual scan_
- 🇻🇳 Nếu bị hỏi "viết test": nhớ n=1 → "1", n=4 → "1211", n=5 → "111221" / 🇬🇧 _Key test cases to memorize: n=1→"1", n=4→"1211", n=5→"111221"_

## Solutions

{% raw %}
/\*\*

- Solution 1: Iterative Scan — Optimal
- Xây dựng từng bước từ n=1 đến n. Trong mỗi bước, quét chuỗi hiện tại
- để đếm nhóm ký tự liên tiếp và emit "count + digit".
-
- @time O(n · L) where L = độ dài chuỗi ở bước n (tăng theo hàm mũ, max ~2^n)
- @space O(L) — lưu chuỗi hiện tại và chuỗi tiếp theo
  \*/
  function countAndSay(n: number): string {
  let s = "1";

for (let step = 1; step < n; step++) {
let next = "";
let count = 1;

    for (let j = 1; j <= s.length; j++) {
      if (j < s.length && s[j] === s[j - 1]) {
        count++;                          // ký tự giống nhau → tiếp tục đếm
      } else {
        next += count + s[j - 1];        // emit: số lần + ký tự
        count = 1;                        // reset cho nhóm tiếp theo
      }
    }

    s = next;

}

return s;
}

// countAndSay(1) → "1"
// countAndSay(2) → "11"
// countAndSay(4) → "1211"
// countAndSay(5) → "111221"

/\*\*

- Solution 2: Regex Replace — Concise (tốt cho whiteboard)
- Regex `(.)\1*` khớp mỗi nhóm ký tự giống nhau liên tiếp.
- Thay bằng: độ dài nhóm + ký tự đầu nhóm.
-
- @time O(n · L) — n bước, mỗi bước regex scan O(L)
- @space O(L) — tạo chuỗi mới mỗi bước
  _/
  function countAndSayRegex(n: number): string {
  let s = "1";
  for (let i = 1; i < n; i++) {
  s = s.replace(/(.)\1_/g, (match) => match.length + match[0]);
  }
  return s;
  }

// countAndSayRegex(1) → "1"
// countAndSayRegex(3) → "21"
// countAndSayRegex(6) → "312211"
// countAndSayRegex(7) → "13112221"
{% endraw %}

## 🔗 Related Problems

- [443. String Compression](https://leetcode.com/problems/string-compression/) — cùng kỹ thuật RLE nhưng in-place
- [481. Magical String](https://leetcode.com/problems/magical-string/) — chuỗi tự tham chiếu tương tự
- [271. Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) — cùng nhóm string encoding
- [14. Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/) — cùng kỹ năng scan chuỗi ký tự
