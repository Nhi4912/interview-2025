---
layout: page
title: "Sum of Even Numbers After Queries"
difficulty: Medium
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/sum-of-even-numbers-after-queries"
---

# Sum of Even Numbers After Queries / Tổng Số Chẵn Sau Mỗi Truy Vấn

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Running Sum / Incremental Update

## 🧠 Intuition / Tư Duy

**Như theo dõi ngân sách chẵn**: thay vì tính lại tổng số chẵn từ đầu sau mỗi lần cập nhật, chỉ cần điều chỉnh tổng hiện tại dựa trên ảnh hưởng của phép cộng lên một phần tử.

**Pattern Recognition:**

- Duy trì `evenSum` running = tổng tất cả số chẵn hiện tại
- Khi cập nhật nums[index] += val: xử lý 4 trường hợp parity
- Sau mỗi query: ghi lại evenSum vào kết quả

**Visual:**

```
nums=[0,1,2,3,4], queries=[[1,0],[-3,1],[-4,0],[2,3]]
evenSum = 0+2+4 = 6
q=[1,0]: nums[0]=0+1=1. Was 0(even)→subtract 0. Now 1(odd)→don't add. evenSum=6-0=6
q=[-3,1]: nums[1]=1-3=-2. Was 1(odd)→ok. Now -2(even)→add -2. evenSum=6+(-2)=4
q=[-4,0]: nums[0]=1-4=-3. Was 1(odd)→ok. Now -3(odd)→ok. evenSum=4
q=[2,3]: nums[3]=3+2=5. Was 3(odd)→ok. Now 5(odd)→ok. evenSum=4
Answers: [6,4,4,4] ✓
```

## Problem Description

Mảng `nums`, mảng `queries[i]=[val, index]`. Sau mỗi query: `nums[index] += val`. Trả về mảng `answer` với `answer[i]` = tổng tất cả số chẵn trong `nums` sau query i.

**Example:** `nums=[0,1,2,3,4], queries=[[1,0],[-3,1],[-4,0],[2,3]]` → `[8,6,2,4]`

**Constraints:** `1 ≤ nums.length ≤ 10^4`, `1 ≤ queries.length ≤ 10^4`, `-10^4 ≤ val ≤ 10^4`, `0 ≤ index < nums.length`

## 📝 Interview Tips

1. **Brute force**: O(n\*q) — tính lại tổng sau mỗi query; có thể chậm với n=q=10^4
2. **Optimized**: O(n+q) — maintain running evenSum, chỉ adjust khi needed
3. **4 cases**: (even+val)→even, (even+val)→odd, (odd+val)→even, (odd+val)→odd
4. **Simplified 2 steps**: (1) nếu cũ là chẵn → trừ khỏi sum, (2) cộng val, (3) nếu mới là chẵn → cộng vào sum
5. **Even check**: n % 2 === 0, nhớ rằng âm chẵn cũng là chẵn (-4 % 2 === 0)
6. **Không cần mảng prefix**: chỉ cần một biến evenSum duy nhất

## Solutions

```typescript
// Solution 1: Incremental update — O(n + q) time, O(q) for answer
function sumEvenAfterQueries(nums: number[], queries: number[][]): number[] {
  // Initial even sum
  let evenSum = 0;
  for (const x of nums) {
    if (x % 2 === 0) evenSum += x;
  }

  const answer: number[] = [];
  for (const [val, idx] of queries) {
    // Step 1: if current is even, remove from sum
    if (nums[idx] % 2 === 0) evenSum -= nums[idx];
    // Step 2: apply update
    nums[idx] += val;
    // Step 3: if new value is even, add to sum
    if (nums[idx] % 2 === 0) evenSum += nums[idx];
    answer.push(evenSum);
  }
  return answer;
}

// Solution 2: Brute force — O(n*q) — for clarity / baseline
function sumEvenAfterQueriesBrute(nums: number[], queries: number[][]): number[] {
  const answer: number[] = [];
  for (const [val, idx] of queries) {
    nums[idx] += val;
    let s = 0;
    for (const x of nums) if (x % 2 === 0) s += x;
    answer.push(s);
  }
  return answer;
}

// Solution 3: Same as v1 but with explicit parity checks
function sumEvenAfterQueriesV3(nums: number[], queries: number[][]): number[] {
  const isEven = (x: number) => x % 2 === 0;
  let evenSum = nums.reduce((s, x) => s + (isEven(x) ? x : 0), 0);

  return queries.map(([val, idx]) => {
    if (isEven(nums[idx])) evenSum -= nums[idx];
    nums[idx] += val;
    if (isEven(nums[idx])) evenSum += nums[idx];
    return evenSum;
  });
}

// Tests
console.log(
  sumEvenAfterQueries(
    [0, 1, 2, 3, 4],
    [
      [1, 0],
      [-3, 1],
      [-4, 0],
      [2, 3],
    ],
  ),
); // [8,6,2,4]
console.log(
  sumEvenAfterQueriesBrute(
    [0, 1, 2, 3, 4],
    [
      [1, 0],
      [-3, 1],
      [-4, 0],
      [2, 3],
    ],
  ),
); // [8,6,2,4]
console.log(
  sumEvenAfterQueriesV3(
    [0, 1, 2, 3, 4],
    [
      [1, 0],
      [-3, 1],
      [-4, 0],
      [2, 3],
    ],
  ),
); // [8,6,2,4]
```

## 🔗 Related Problems

| Problem                                 | Relationship                 |
| --------------------------------------- | ---------------------------- |
| 1314 - Matrix Block Sum                 | Running sum with queries     |
| 985 - Sum of Even Numbers After Queries | This problem                 |
| 1395 - Count Number of Teams            | Incremental counting         |
| 303 - Range Sum Query - Immutable       | Prefix sum for range queries |
