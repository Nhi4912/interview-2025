---
layout: page
title: "Palindrome Partitioning"
difficulty: Medium
category: Backtracking
tags: [String, Backtracking, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/palindrome-partitioning/"
---

# Palindrome Partitioning / Phân Hoạch Chuỗi Palindrome

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking + DP Precomputation
> **Frequency**: 📘 Tier 2 — Classic backtracking + DP combo; asked at Google, Amazon
> **See also**: [Restore IP Addresses](./11-restore-ip-addresses.md) | [Word Search II](./09-word-search-ii.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như cắt một cuộn băng keo thành các đoạn — mỗi đoạn phải đọc xuôi ngược như nhau (palindrome). Bạn đứng ở đầu, thử cắt ở mọi vị trí có thể tạo palindrome, rồi tiếp tục với phần còn lại. Khi hết băng, ghi lại cách cắt đó. Tối ưu: tính trước bảng palindrome để không phải kiểm tra lại từng lần.

- **Pattern Recognition:**
  - Signal: partition string such that every part satisfies a property → backtracking with constraint
  - Chia nhánh tại mỗi index `end`: nếu `s[start..end]` là palindrome thì đệ quy sang `start=end+1`
  - DP opt: `dp[i][j] = true` nếu `s[i..j]` là palindrome, check O(1) thay vì O(n)

- **Visual — s = "aab":**

```
backtrack(start=0):
  end=0: "a" palindrome? Yes → push "a"
    backtrack(start=1):
      end=1: "a" → push "a"
        backtrack(start=2):
          end=2: "b" → push "b"
            backtrack(start=3): start==len → result.push(["a","a","b"]) ✓
          pop "b"
      end=2: "ab" palindrome? No → skip
    pop "a"
  end=1: "aa" palindrome? Yes → push "aa"
    backtrack(start=2):
      end=2: "b" → push "b"
        backtrack(start=3): → result.push(["aa","b"]) ✓
      pop "b"
    pop "aa"
  end=2: "aab" palindrome? No → skip

Result: [["a","a","b"], ["aa","b"]]
```

## Problem Description

Partition string `s` so every substring is a palindrome. Return all possible partitions.

```
s = "aab"      → [["a","a","b"], ["aa","b"]]
s = "a"        → [["a"]]
s = "aba"      → [["a","b","a"], ["aba"]]
```

## 📝 Interview Tips

1. **Mọi ký tự đơn đều là palindrome → luôn có ít nhất một phân hoạch hợp lệ / Every single char is a palindrome — at least one valid partition always exists**
2. **DP precompute tiết kiệm O(n) check mỗi lần thành O(1): `dp[i][j] = (s[i]==s[j]) && dp[i+1][j-1]` / DP precompute turns O(n) palindrome check into O(1)**
3. **Phải clone path khi push vào result: `result.push([...current])` / Must clone path on push: result.push([...current])**
4. **Độ phức tạp: O(n × 2^n) — có thể 2^n partitions, mỗi partition cần O(n) để copy / O(n×2^n) total: up to 2^n partitions, O(n) each to copy**
5. **Follow-up LC #132: minimum cuts — DP only, no backtracking needed / LC#132 asks for minimum cuts — pure DP, no enumeration**

## Solutions

```typescript
/**

- Solution 1 — Backtracking with inline palindrome check
- Check palindrome on-the-fly using two pointers
- Time: O(n × 2^n) | Space: O(n) recursion + O(n) current path
  */
  function partition(s: string): string[][] {
  const result: string[][] = [];
  const current: string[] = [];

function isPalin(l: number, r: number): boolean {
while (l < r) {
if (s[l++] !== s[r--]) return false;
}
return true;
}

function backtrack(start: number): void {
if (start === s.length) { result.push([...current]); return; }
for (let end = start; end < s.length; end++) {
if (isPalin(start, end)) {
current.push(s.slice(start, end + 1));
backtrack(end + 1);
current.pop();
}
}
}

backtrack(0);
return result;
}

/**

- Solution 2 — DP Precompute + Backtracking ✅ Recommended
- Build palindrome table first; then O(1) lookup during backtracking
- Time: O(n² + n×2^n) | Space: O(n²) for dp table
  */
  function partitionDP(s: string): string[][] {
  const n = s.length;
  // dp[i][j] = true iff s[i..j] is a palindrome
  const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = 0; i < n; i++) dp[i][i] = true;
  for (let i = 0; i < n - 1; i++) dp[i][i + 1] = s[i] === s[i + 1];
  for (let len = 3; len <= n; len++) {
  for (let i = 0; i <= n - len; i++) {
  const j = i + len - 1;
  dp[i][j] = s[i] === s[j] && dp[i + 1][j - 1];
  }
  }

const result: string[][] = [];
const current: string[] = [];

function backtrack(start: number): void {
if (start === s.length) { result.push([...current]); return; }
for (let end = start; end < s.length; end++) {
if (dp[start][end]) {
current.push(s.slice(start, end + 1));
backtrack(end + 1);
current.pop();
}
}
}

backtrack(0);
return result;
}

// ── inline tests ──
// partition("aab") → [["a","a","b"],["aa","b"]]
// partition("a") → [["a"]]
// partition("aba") → [["a","b","a"],["aba"]]
// partition("abba") → [["a","b","b","a"],["a","bb","a"],["abba"]]
```

## 🔗 Related Problems

- [LC #132 Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/) — minimum cuts (DP only)
- [LC #93 Restore IP Addresses](./11-restore-ip-addresses.md) — fixed-segment backtracking
- [LC #131 Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) — this problem
- [LC #647 Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) — count all palindromic substrings
