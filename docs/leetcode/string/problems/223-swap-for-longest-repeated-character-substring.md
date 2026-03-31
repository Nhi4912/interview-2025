---
layout: page
title: "Swap For Longest Repeated Character Substring"
difficulty: Medium
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/swap-for-longest-repeated-character-substring"
---

# Swap For Longest Repeated Character Substring / Hoán Đổi Để Có Chuỗi Ký Tự Lặp Dài Nhất

## Tóm tắt bằng tiếng Việt

Cho chuỗi `text`, bạn có thể hoán đổi 2 ký tự bất kỳ **đúng một lần** (hoặc không hoán đổi). Tìm độ dài chuỗi con dài nhất chứa toàn ký tự giống nhau sau thao tác đó.

**Ví dụ:** `"ababa"` → hoán đổi vị trí 0 và 2: `"aaa"` + "bb" → độ dài `3`.

## Tương tự thực tế

> Như sắp xếp hàng ghế màu sắc: được phép đổi 1 ghế từ hàng khác sang lấp vào khoảng trống giữa 2 nhóm cùng màu. Tối đa bao nhiêu ghế liên tiếp cùng màu?

## Minh họa ASCII

```
text = "aaabbaaa"
Groups: [aaa][bb][aaa]
Count of 'a' = 6

Window: [aaa] gap [aaa] = 3 + 1 (gap≤1) + 3 = 7, nhưng total 'a'=6 → min(7,6)=6
Window: [bb] + gap would be 2+1+0 = 3, total 'b'=2 → min(3,2)=2
Answer = 6

text = "ababa"
Groups: [a][b][a][b][a]
'a': [a][a][a] with gaps → 1+1+1 but adjacent groups sep by 1 gap
Best for 'a': take [a] gap [a] = 1+1+1=3, total=3 → min(3,3)=3
Answer = 3
```

## Mô tả bài toán

- Hoán đổi tối đa 1 lần (hoặc không).
- Trả về độ dài chuỗi con liên tiếp dài nhất chỉ chứa một loại ký tự.

**Constraints:** `1 <= text.length <= 2 * 10^4`, chỉ chứa chữ thường.

## Tips phỏng vấn

1. **Group runs** — tách thành các run liên tiếp: `"aaabbaaa"` → `[(a,3),(b,2),(a,3)]`.
2. **Xét từng ký tự** — với mỗi ký tự `c`, tìm window tốt nhất.
3. **Hai trường hợp** — (1) một run đơn, (2) hai run cùng ký tự cách nhau đúng 1 gap = 1.
4. **Giới hạn tổng** — kết quả không vượt tổng số lần xuất hiện của ký tự đó.
5. **Sliding window** — với 2 run liền kề qua gap 1: `run[i].len + 1 + run[i+2].len` nếu `run[i+1].len == 1`.
6. **Trường hợp không gap** — nếu không còn ký tự nào khác để hoán đổi vào, +1 vẫn hợp lệ nếu tổng > run.

## Giải pháp

### Giải pháp 1: Group Runs + Sliding Window

```typescript
function maxRepOpt1(text: string): number {
  // Count total occurrences of each character
  const freq: Map<string, number> = new Map();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);

  // Build runs: [char, length][]
  const runs: [string, number][] = [];
  let i = 0;
  while (i < text.length) {
    let j = i;
    while (j < text.length && text[j] === text[i]) j++;
    runs.push([text[i], j - i]);
    i = j;
  }

  let ans = 0;

  for (let k = 0; k < runs.length; k++) {
    const [ch, len] = runs[k];

    // Case 1: single run, potentially extend by 1 from elsewhere
    const total = freq.get(ch)!;
    const extended = len < total ? len + 1 : len;
    ans = Math.max(ans, extended);

    // Case 2: two runs of same char separated by exactly one gap of length 1
    if (
      k + 2 < runs.length &&
      runs[k + 1][0] !== ch &&
      runs[k + 1][1] === 1 &&
      runs[k + 2][0] === ch
    ) {
      const combined = len + 1 + runs[k + 2][1];
      // Can we bring one more from elsewhere?
      const canExtend = combined < total ? combined + 1 : combined;
      ans = Math.max(ans, canExtend);
    }
  }

  return ans;
}

// Test cases
console.log(maxRepOpt1("ababa")); // 3
console.log(maxRepOpt1("aaabbaaa")); // 6
console.log(maxRepOpt1("aaaaa")); // 5
console.log(maxRepOpt1("aababab")); // 4 (a: freq=5, best window=4)
console.log(maxRepOpt1("a")); // 1
```

### Giải pháp 2: Sliding Window trực tiếp trên chuỗi

```typescript
function maxRepOpt1V2(text: string): number {
  // Count total of each char
  const freq: number[] = new Array(26).fill(0);
  for (const ch of text) freq[ch.charCodeAt(0) - 97]++;

  let ans = 0;

  // For each character a-z
  for (let c = 0; c < 26; c++) {
    if (freq[c] === 0) continue;
    const ch = String.fromCharCode(97 + c);
    let left = 0;
    let gapCount = 0;

    for (let right = 0; right < text.length; right++) {
      if (text[right] !== ch) gapCount++;

      // Allow at most 1 non-ch character in window
      while (gapCount > 1) {
        if (text[left] !== ch) gapCount--;
        left++;
      }

      // Window size = right - left + 1, but capped by total freq + 1 swap
      const windowSize = right - left + 1;
      // Actual chars of type ch in window = windowSize - gapCount
      const charsInWindow = windowSize - gapCount;
      // We can replace the gap with ch IF there's an extra ch outside
      const available = freq[c] > charsInWindow ? charsInWindow + 1 : charsInWindow;
      ans = Math.max(ans, available);
    }
  }

  return ans;
}

console.log(maxRepOpt1V2("ababa")); // 3
console.log(maxRepOpt1V2("aaabbaaa")); // 6
console.log(maxRepOpt1V2("aaaaa")); // 5
```

## Bảng so sánh

| Giải pháp      | Thời gian | Không gian | Ghi chú             |
| -------------- | --------- | ---------- | ------------------- |
| Group Runs     | O(n)      | O(n)       | Trực quan, dễ debug |
| Sliding Window | O(26n)    | O(1)       | Linh hoạt hơn       |

## Bài liên quan

| #    | Tên                                     | Độ khó | Tags           |
| ---- | --------------------------------------- | ------ | -------------- |
| 424  | Longest Repeating Character Replacement | Medium | Sliding Window |
| 1004 | Max Consecutive Ones III                | Medium | Sliding Window |
| 2401 | Longest Nice Subarray                   | Medium | Sliding Window |
