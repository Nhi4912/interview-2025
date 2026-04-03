---
layout: page
title: "Check if Number Has Equal Digit Count and Digit Value"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/check-if-number-has-equal-digit-count-and-digit-value"
---

# Check if Number Has Equal Digit Count and Digit Value / Kiểm Tra Số Có Digit Count Khớp Digit Value

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Frequency Count
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Giống như đọc một bảng tự mô tả — "Tôi có 1 chữ số 2, 2 chữ số 3" — rồi kiểm tra xem bảng đó có nói đúng sự thật về chính nó không. Ta đếm tần suất rồi so sánh với giá trị từng chỉ số.

**Pattern Recognition:**

- `num[i]` phải bằng số lần chữ số `i` xuất hiện trong `num` → frequency count
- Đếm tần suất tất cả chữ số → so sánh với giá trị tại từng vị trí
- Length n → chỉ check digits 0..n-1

**Visual:**

```
num = "1210"   (length = 4)
freq: '0'=1, '1'=2, '2'=1, '3'=0 ... (other digits = 0)

Check each index:
  i=0: num[0]='1' → freq['0'] should be 1 → freq['0']=1 ✓
  i=1: num[1]='2' → freq['1'] should be 2 → freq['1']=2 ✓
  i=2: num[2]='1' → freq['2'] should be 1 → freq['2']=1 ✓
  i=3: num[3]='0' → freq['3'] should be 0 → freq['3']=0 ✓
→ true

num = "030"  (length = 3)
  i=0: num[0]='0' → freq['0'] should be 0 → freq['0']=2 ✗ → false
```

## Problem Description

Given a 0-indexed string `num` of length `n`, return `true` if for every index `i`, digit `num[i]` equals the number of times digit `i` occurs in `num`.

Examples: `"1210"` → `true` | `"030"` → `false` | `"2020"` → `true`.

## 📝 Interview Tips

1. **Clarify**: `num` chỉ chứa digits 0-9? Length ≤ 10? / Yes, digits only, length up to 10
2. **Approach**: Count frequency array of size 10, then compare / Simple array count
3. **Edge cases**: `"0"` → digit 0 must appear 0 times, but it appears once → false / Test single digit
4. **Optimize**: Already O(n), nothing to optimize / Already optimal
5. **Follow-up**: Nếu input là số thực? → Convert to string first / parseInt → toString
6. **Complexity**: O(n) time, O(1) space (fixed 10 digits) / Constant space

## Solutions

```typescript
/** Solution 1: Frequency Array (Optimal)
 * Time: O(n) | Space: O(1) — array of size 10
 */
function digitCount(num: string): boolean {
  const freq = new Array(10).fill(0);
  for (const ch of num) freq[parseInt(ch)]++;

  for (let i = 0; i < num.length; i++) {
    if (parseInt(num[i]) !== freq[i]) return false;
  }
  return true;
}

/** Solution 2: HashMap approach (more explicit)
 * Time: O(n) | Space: O(1) — at most 10 entries
 */
function digitCountMap(num: string): boolean {
  const map = new Map<number, number>();
  for (const ch of num) {
    const d = parseInt(ch);
    map.set(d, (map.get(d) ?? 0) + 1);
  }

  for (let i = 0; i < num.length; i++) {
    const expected = parseInt(num[i]);
    const actual = map.get(i) ?? 0;
    if (expected !== actual) return false;
  }
  return true;
}

/** Solution 3: Functional one-liner style
 * Time: O(n) | Space: O(1)
 */
function digitCountFunctional(num: string): boolean {
  const freq = [...num].reduce((acc, ch) => {
    acc[parseInt(ch)]++;
    return acc;
  }, new Array(10).fill(0));

  return [...num].every((ch, i) => parseInt(ch) === freq[i]);
}

// Tests
console.log(digitCount("1210")); // true
console.log(digitCount("030")); // false
console.log(digitCount("2020")); // true
console.log(digitCount("0")); // false (num[0]=0 means digit 0 appears 0x, but '0' itself appears 1x)
console.log(digitCountMap("1210")); // true
console.log(digitCountFunctional("2020")); // true
```

## 🔗 Related Problems

| Problem                                                                  | Relationship                   |
| ------------------------------------------------------------------------ | ------------------------------ |
| [Ransom Note](https://leetcode.com/problems/ransom-note)                 | Character frequency comparison |
| [Valid Anagram](https://leetcode.com/problems/valid-anagram)             | Frequency count and match      |
| [Find the Difference](https://leetcode.com/problems/find-the-difference) | Character frequency difference |
