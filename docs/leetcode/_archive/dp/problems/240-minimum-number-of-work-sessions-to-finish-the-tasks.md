---
layout: page
title: "Minimum Number of Work Sessions to Finish the Tasks"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks"
---

# Minimum Number of Work Sessions to Finish the Tasks / Số Phiên Làm Việc Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bitmask DP
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) | [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Như chia việc nhà cho các ngày trong tuần — mỗi ngày chỉ được làm tối đa `sessionTime` phút, muốn chia hết tất cả công việc trong ít ngày nhất. Dùng bitmask để biểu diễn tập công việc đã làm xong. `dp[mask]` = số ngày ít nhất để hoàn thành tập task trong mask.

**Pattern Recognition:**

- Signal: assign tasks to sessions, minimize sessions, n ≤ 14 → **Bitmask DP with subset iteration**
- Key insight: `dp[mask]` = min sessions to complete all tasks in `mask`. For each mask, try all non-empty subsets as the "last session" — if that subset's total fits within sessionTime, transition is valid.

**Visual — tasks=[1,2,3], sessionTime=3 example:**

```
Subsets and their sums:
  {001}=tasks[0]=1  {010}=tasks[1]=2  {011}=1+2=3  {100}=tasks[2]=3
  {101}=1+3=4>3 ✗  {110}=2+3=5>3 ✗  {111}=6>3 ✗

dp[000]=0 (empty)
dp[001]=1 ({0} fits ≤3)
dp[010]=1 ({1} fits)
dp[011]=1 ({0,1} fits: 1+2=3)
dp[100]=1 ({2} fits)
dp[101]=dp[000]+1=1? No: dp[101]=min(dp[100]+dp[001])=2
         but {0,2}: 1+3=4>3 ✗ so can't do in 1 session
         dp[101]=dp[100]+1=2 or dp[001]+1=2 → 2
dp[110]=2  dp[111]=2 (session1:[0,1], session2:[2] OR session1:[2],session2:[0,1])

Answer: dp[111] = 2  ✓
```

---

## 📝 Problem Description

Given `tasks[]` and `sessionTime`, assign all tasks to sessions. Each session can hold tasks if their total duration ≤ `sessionTime`. Return the minimum number of sessions needed.

- **Example 1:** `tasks=[1,2,3], sessionTime=3` → `2`
- **Example 2:** `tasks=[3,1,3,1,1], sessionTime=8` → `2`
- **Constraints:** `1 ≤ tasks.length ≤ 14`, `1 ≤ tasks[i] ≤ sessionTime ≤ 15`

---

## 🎯 Interview Tips

1. **Bitmask states** / Trạng thái bitmask: 2^14 = 16384 trạng thái — hoàn toàn khả thi
2. **Subset iteration** / Duyệt subset: `for (let sub = mask; sub > 0; sub = (sub-1) & mask)` — iterate all subsets of mask
3. **Precompute sums** / Tính trước tổng: subsetSum[mask] = tổng task trong mask — tính O(2^n) một lần
4. **O(3^n) complexity** / Độ phức tạp 3^n: tổng số (mask, subset) pairs = 3^n ≈ 4M với n=14
5. **Alternative: greedy backtracking** / Thay thế: backtracking với pruning sắp xếp task từ lớn đến nhỏ cũng hoạt động
6. **Why bitmask?** / Tại sao bitmask?: cần biết chính xác task nào đã làm, không chỉ đếm tổng

---

## 💡 Solutions

### Approach 1: Backtracking with Pruning

/\*_ @complexity Time: O(n × 2^n) | Space: O(n × 2^n) for memoization _/

```typescript
function minSessionsBacktrack(tasks: number[], sessionTime: number): number {
  const n = tasks.length;
  tasks.sort((a, b) => b - a); // larger tasks first for better pruning
  let ans = n; // worst case: each task in its own session

  function backtrack(idx: number, sessions: number[], count: number): void {
    if (count >= ans) return; // prune
    if (idx === n) {
      ans = Math.min(ans, count);
      return;
    }
    const seen = new Set<number>();
    for (let s = 0; s < count; s++) {
      if (seen.has(sessions[s])) continue; // skip duplicate session states
      if (sessions[s] + tasks[idx] <= sessionTime) {
        seen.add(sessions[s]);
        sessions[s] += tasks[idx];
        backtrack(idx + 1, sessions, count);
        sessions[s] -= tasks[idx];
      }
    }
    // Start new session
    sessions[count] = tasks[idx];
    backtrack(idx + 1, sessions, count + 1);
    sessions[count] = 0;
  }

  backtrack(0, new Array(n).fill(0), 0);
  return ans;
}
```

### Approach 2: Bitmask DP — Optimal

/\*_ @complexity Time: O(3^n) | Space: O(2^n) _/

```typescript
function minSessions(tasks: number[], sessionTime: number): number {
  const n = tasks.length;
  const full = (1 << n) - 1;

  // Precompute subset sums
  const subsetSum = new Array(1 << n).fill(0);
  for (let mask = 1; mask <= full; mask++) {
    const lsb = mask & -mask;
    const bit = Math.log2(lsb) | 0;
    subsetSum[mask] = subsetSum[mask ^ lsb] + tasks[bit];
  }

  // dp[mask] = min sessions to complete exactly the tasks in mask
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0;

  for (let mask = 1; mask <= full; mask++) {
    // Try all non-empty subsets of mask as the "last session"
    for (let sub = mask; sub > 0; sub = (sub - 1) & mask) {
      if (subsetSum[sub] <= sessionTime) {
        // sub is a valid session (fits within sessionTime)
        const prev = mask ^ sub; // tasks handled before this session
        if (dp[prev] + 1 < dp[mask]) {
          dp[mask] = dp[prev] + 1;
        }
      }
    }
  }

  return dp[full];
}
```

---

## 🧪 Test Cases

```typescript
console.log(minSessions([1, 2, 3], 3)); // → 2
console.log(minSessions([3, 1, 3, 1, 1], 8)); // → 2
console.log(minSessions([1, 2, 3, 4, 5], 15)); // → 1 (all fit: 1+2+3+4+5=15)
console.log(minSessions([2, 3, 3, 4, 4, 5], 7)); // → 3
console.log(minSessions([5, 5, 5, 5], 5)); // → 4 (each task needs its own session)
```

---

## Related Problems

| Problem                                                                                                    | Difficulty | Pattern                   |
| ---------------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets)         | Medium     | Bitmask DP / Backtracking |
| [Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) | Hard       | Bitmask DP                |
| [Maximize Score After N Operations](https://leetcode.com/problems/maximize-score-after-n-operations)       | Hard       | Bitmask DP                |
| [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)                               | Medium     | Bitmask DP                |
