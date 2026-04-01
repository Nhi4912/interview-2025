---
layout: page
title: "Minimum Operations to Form Subsequence With Target Sum"
difficulty: Hard
category: Array
tags: [Array, Greedy, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-form-subsequence-with-target-sum"
---

# Minimum Operations to Form Subsequence With Target Sum / Số Thao Tác Tối Thiểu Để Tạo Dãy Con Có Tổng Bằng Target

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Cinema Seat Allocation](https://leetcode.com/problems/cinema-seat-allocation) | [Find the Maximum Sum of Node Values](https://leetcode.com/problems/find-the-maximum-sum-of-node-values)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy tưởng tượng bạn có một tập hợp các tờ tiền mệnh giá là lũy thừa của 2 (1đ, 2đ, 4đ, 8đ...). Muốn thanh toán đúng số tiền target, bạn có thể xé đôi tờ tiền bất kỳ (mỗi lần xé = 1 thao tác). Chiến lược tham lam từ bit thấp nhất: nếu thiếu tờ 2^i, hãy tìm tờ lớn nhất gần nhất và xé xuống.

**Pattern Recognition:**

- Signal: all elements are powers of 2, split operation, minimize ops → **Greedy + Bit Counting**
- Key insight: xử lý từng bit của target từ thấp lên cao; khi thiếu 2^i, tìm 2^j (j>i) và split xuống tốn (j-i) ops

**Visual — nums=[1,32,1,2], target=12 (bits: 8+4):**

```
freq[0]=2 freq[1]=1 freq[5]=1  (two 1s, one 2, one 32)

bit 2 (=4): freq[2]=0 → carry: freq[1]+=floor(2/2)=1, freq[2]+=floor(2/2)=1
            freq[2]=1 → use it. freq[2]=0
bit 3 (=8): freq[3]=0 → find j=5 (32), ops+=5-3=2
            split 32→16→8: freq[4]++ (intermediate 16 stays)
            use the 8 directly

Total ops = 2  ✓ (split 32→16+16, then 16→8+8)
```

---

## 📝 Problem Description

Given array `nums` (all powers of 2) and integer `target`. In one operation, choose any element `x > 1` and replace it with `x/2` twice. Return the minimum number of operations to form a subsequence summing to `target`, or `-1` if impossible.

**Example 1:** `nums=[1,32,1,2], target=12` → `2`
**Example 2:** `nums=[1,32,1,2], target=6` → `2`

**Constraints:** `1 ≤ nums.length ≤ 10^5`, `1 ≤ nums[i] ≤ 2^20`, `nums[i]` is a power of 2, `1 ≤ target < 2^31`

---

## 🎯 Interview Tips

1. **Check feasibility** / Kiểm tra tính khả thi: nếu `sum(nums) < target` → trả về -1
2. **Bit frequency** / Đếm tần suất bit: dùng `freq[i]` = số phần tử có giá trị `2^i`
3. **Process LSB first** / Xử lý từ bit thấp: greedy từ bit 0 đến bit 30
4. **Carry unused bits** / Gộp bit dư: `freq[i+1] += floor(freq[i] / 2)` sau mỗi bước
5. **Split cost** / Chi phí tách: tách `2^j` thành `2^i` tốn `j-i` thao tác, sinh thêm `{2^k | i<k<j}`
6. **Follow-up** / Mở rộng: nếu nums không phải power-of-2 thì cần normalize trước

---

## 💡 Solutions

### Approach 1: Brute Force — Check All Subsequences

/\*_ @complexity Time: O(2^n × n) | Space: O(1) _/

```typescript
function minOperationsBrute(nums: number[], target: number): number {
  // Only feasible for tiny inputs; enumerate all subsequences
  const n = nums.length;
  let ans = Infinity;

  function dfs(idx: number, remaining: number, ops: number): void {
    if (remaining === 0) {
      ans = Math.min(ans, ops);
      return;
    }
    if (idx === n || remaining < 0) return;
    // Use nums[idx] (possibly after splitting)
    let val = nums[idx];
    let splits = 0;
    while (val > remaining && val > 1) {
      val = Math.floor(val / 2);
      splits++;
    }
    if (val <= remaining) dfs(idx + 1, remaining - val, ops + splits);
    dfs(idx + 1, remaining, ops); // skip nums[idx]
  }

  if (nums.reduce((a, b) => a + b, 0) < target) return -1;
  dfs(0, target, 0);
  return ans === Infinity ? -1 : ans;
}
```

### Approach 2: Greedy + Bit Frequency — Optimal

/\*_ @complexity Time: O(n + log(target)) | Space: O(log(max)) _/

```typescript
function minOperations(nums: number[], target: number): number {
  // If total sum < target, impossible
  if (nums.reduce((a, b) => a + b, 0) < target) return -1;

  // freq[i] = count of elements equal to 2^i
  const freq = new Array(32).fill(0);
  for (const num of nums) {
    freq[Math.log2(num)]++;
  }

  let ops = 0;
  for (let i = 0; i < 32; i++) {
    if ((target >> i) & 1) {
      // Need one element of value 2^i
      if (freq[i] > 0) {
        freq[i]--; // use existing 2^i directly
      } else {
        // Find nearest larger element
        let j = i + 1;
        while (j < 32 && freq[j] === 0) j++;
        ops += j - i; // split 2^j → 2^i costs (j-i) ops
        freq[j]--;
        // Splitting 2^j → 2^(j-1) → ... → 2^i produces intermediate halves
        for (let k = j - 1; k > i; k--) freq[k]++;
        // The 2^i we produced is consumed immediately (don't add to freq[i])
      }
    }
    // Carry: pairs of 2^i become one 2^(i+1)
    if (i + 1 < 32) freq[i + 1] += Math.floor(freq[i] / 2);
  }
  return ops;
}
```

---

## 🧪 Test Cases

```typescript
console.log(minOperations([1, 32, 1, 2], 12)); // → 2
console.log(minOperations([1, 32, 1, 2], 6)); // → 2
console.log(minOperations([1, 2, 8], 4)); // → 1 (split 8→4+4)
console.log(minOperations([1], 4)); // → -1 (sum=1 < 4)
console.log(minOperations([4, 4], 7)); // → 2
```

---

## Related Problems

| Problem                                                                                                                                                | Difficulty | Pattern       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------- |
| [Maximum OR](https://leetcode.com/problems/maximum-or)                                                                                                 | Medium     | Greedy + Bits |
| [Minimize OR of Remaining Elements](https://leetcode.com/problems/minimize-or-of-remaining-elements-using-operations)                                  | Hard       | Greedy        |
| [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) | Hard       | Greedy        |
