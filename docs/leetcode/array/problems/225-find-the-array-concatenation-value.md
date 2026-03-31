---
layout: page
title: "Find the Array Concatenation Value"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Simulation]
leetcode_url: "https://leetcode.com/problems/find-the-array-concatenation-value"
---

# Find the Array Concatenation Value / Tìm Giá Trị Ghép Nối Mảng

> **Difficulty**: 🟢 Easy | **Category**: Array | **Pattern**: Two Pointers / Simulation

## 🧠 Intuition / Tư Duy

**Giống như đọc sách từ hai đầu**: cầm hai đầu của mảng, ghép số đầu với số cuối thành một số, cộng vào tổng, rồi di chuyển vào trong cho đến khi gặp nhau.

**Pattern Recognition:**

- Two pointers (left, right) hội tụ vào giữa
- Khi left < right: ghép str(nums[left]) + str(nums[right]) → số → cộng vào ans
- Khi left == right (lẻ phần tử): cộng phần tử giữa trực tiếp

**Visual:**

```
nums = [7, 52, 2, 4]
l=0,r=3: "7"+"4"="74" → 74
l=1,r=2: "52"+"2"="522" → 522
ans = 74 + 522 = 596
```

## Problem Description

Cho mảng `nums`. Lặp: lấy phần tử đầu và cuối, ghép chúng (số đầu là tiền tố), cộng kết quả vào `ans`. Nếu chỉ còn một phần tử, cộng nó vào `ans`. Trả về `ans`.

**Example 1:** `nums = [7,52,2,4]` → `596` (74 + 522)
**Example 2:** `nums = [5,14,13,8,12]` → `673` (512 + 148 + 13)

**Constraints:** `1 ≤ nums.length ≤ 1000`, `1 ≤ nums[i] ≤ 10^4`

## 📝 Interview Tips

1. **String concatenation vs arithmetic**: dùng string để ghép số, sau đó parseInt
2. **Two pointers pattern**: xử lý từ hai đầu vào giữa
3. **Odd length check**: khi left === right, chỉ cộng một phần tử
4. **BigInt không cần**: giá trị max = 10^4 + 10^4 = 8 chữ số → safe với number
5. **Loop condition**: while (left <= right) bao phủ cả trường hợp lẻ
6. **Viết rõ hơn**: tách trường hợp left < right và left === right trong loop

## Solutions

```typescript
// Solution 1: Two pointers with string concatenation — O(n log n) time
function findTheArrayConcVal(nums: number[]): number {
  let left = 0,
    right = nums.length - 1;
  let ans = 0;
  while (left < right) {
    ans += parseInt(`${nums[left]}${nums[right]}`);
    left++;
    right--;
  }
  if (left === right) ans += nums[left]; // middle element (odd length)
  return ans;
}

// Solution 2: Using Number() and template literals
function findTheArrayConcValV2(nums: number[]): number {
  let ans = 0;
  let l = 0,
    r = nums.length - 1;
  while (l <= r) {
    if (l === r) {
      ans += nums[l];
    } else {
      ans += Number(`${nums[l]}${nums[r]}`);
    }
    l++;
    r--;
  }
  return ans;
}

// Solution 3: Mathematical concatenation (no string)
function findTheArrayConcValV3(nums: number[]): number {
  // concat(a, b) = a * 10^(digits of b) + b
  function concatNums(a: number, b: number): number {
    let digits = b === 0 ? 1 : Math.floor(Math.log10(b)) + 1;
    return a * Math.pow(10, digits) + b;
  }
  let ans = 0;
  let l = 0,
    r = nums.length - 1;
  while (l < r) {
    ans += concatNums(nums[l], nums[r]);
    l++;
    r--;
  }
  if (l === r) ans += nums[l];
  return ans;
}

// Tests
console.log(findTheArrayConcVal([7, 52, 2, 4])); // 596
console.log(findTheArrayConcVal([5, 14, 13, 8, 12])); // 673
console.log(findTheArrayConcValV2([7, 52, 2, 4])); // 596
console.log(findTheArrayConcValV3([7, 52, 2, 4])); // 596
```

## 🔗 Related Problems

| Problem                             | Relationship                |
| ----------------------------------- | --------------------------- |
| 344 - Reverse String                | Two pointers from both ends |
| 2000 - Reverse Prefix of Word       | String manipulation         |
| 1768 - Merge Strings Alternately    | String interleaving         |
| 557 - Reverse Words in a String III | Two pointers on strings     |
