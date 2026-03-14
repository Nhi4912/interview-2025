# Sliding Window Fixed Size / Cửa sổ trượt kích thước cố định

> **Track**: Shared | **Difficulty**: 🟢 Easy
> **LeetCode**: Template | **Pattern**: Sliding Window (Fixed)
> **Category**: Array / String

## Problem / Đề bài

**English**: Given an array of integers and a window size `k`, find the maximum sum of any contiguous subarray of size exactly `k`. This is the foundational fixed-size sliding window template problem.

**Vietnamese**: Cho một mảng số nguyên và kích thước cửa sổ `k`, tìm tổng lớn nhất của bất kỳ mảng con liên tiếp nào có đúng `k` phần tử. Đây là bài toán mẫu nền tảng cho kỹ thuật cửa sổ trượt kích thước cố định.

**Example**:
```
Input: nums = [2, 1, 5, 1, 3, 2], k = 3
Output: 9
Explanation: Subarray [5, 1, 3] has the maximum sum of 9.
```

**Constraints**:
- `1 <= k <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## Approach / Hướng giải

### Pattern nhận dạng / Pattern recognition

Khi bài toán yêu cầu xử lý **mảng con liên tiếp có kích thước cố định** (`k`), đây là dấu hiệu rõ ràng để dùng Sliding Window. Thay vì tính lại tổng toàn bộ mỗi lần (O(k) mỗi bước), ta trừ phần tử rời khỏi cửa sổ và cộng phần tử mới vào — chỉ O(1) mỗi bước.

Look for keywords: "subarray of size k", "window of k elements", "every k consecutive elements". If the window size is fixed and you're computing some aggregate (sum, max, average), use this pattern immediately.

### Key Insight / Ý tưởng chính

Khi cửa sổ trượt sang phải 1 vị trí, chỉ có 2 thứ thay đổi: phần tử bên trái rời khỏi cửa sổ và phần tử bên phải gia nhập. Ta tận dụng kết quả của cửa sổ trước để tính cửa sổ sau trong O(1), thay vì tính lại từ đầu trong O(k).

---

## Solutions / Các cách giải

### Solution 1: Sliding Window — O(n) time, O(1) space ✅ Recommended

**Idea**: Build the first window of size `k`, record its sum. Then slide one step at a time: subtract the element leaving the left, add the element entering the right. Track the maximum sum seen.

**Ý tưởng**: Xây dựng cửa sổ đầu tiên gồm `k` phần tử, ghi nhận tổng. Sau đó trượt từng bước: trừ phần tử rời (bên trái), cộng phần tử vào (bên phải). Theo dõi tổng lớn nhất đã thấy.

**Algorithm**:
1. Compute `windowSum` = sum of first `k` elements. Set `maxSum = windowSum`.
2. Loop `i` from `k` to `n - 1`:
   - Add `nums[i]` (new right element) to `windowSum`
   - Subtract `nums[i - k]` (departing left element) from `windowSum`
   - Update `maxSum = max(maxSum, windowSum)`
3. Return `maxSum`.

**Pseudocode**:
```
function maxSumFixedWindow(nums, k):
    n = length of nums
    windowSum = sum(nums[0..k-1])
    maxSum = windowSum

    for i from k to n - 1:
        windowSum = windowSum + nums[i] - nums[i - k]
        maxSum = max(maxSum, windowSum)

    return maxSum
```

**Visual**:
```
nums = [2, 1, 5, 1, 3, 2],  k = 3

Step 0: Build first window
        [2, 1, 5], 1, 3, 2
         ^--------^
         windowSum = 8,  maxSum = 8

Step 1: Slide right by 1
         2, [1, 5, 1], 3, 2
             ^--------^
         + nums[3]=1,  - nums[0]=2
         windowSum = 8 + 1 - 2 = 7,  maxSum = 8

Step 2: Slide right by 1
         2, 1, [5, 1, 3], 2
                ^--------^
         + nums[4]=3,  - nums[1]=1
         windowSum = 7 + 3 - 1 = 9,  maxSum = 9  ✓

Step 3: Slide right by 1
         2, 1, 5, [1, 3, 2]
                   ^-------^
         + nums[5]=2,  - nums[2]=5
         windowSum = 9 + 2 - 5 = 6,  maxSum = 9

Result: 9
```

**Complexity**:
- Time: O(n) — single pass through array
- Space: O(1) — only scalar variables

---

### Solution 2: Brute Force — O(n·k) time, O(1) space

**Idea**: For each starting position, compute the sum of the next `k` elements explicitly. Track the maximum.

**Algorithm**:
1. For each `i` from `0` to `n - k`:
   - Compute sum of `nums[i..i+k-1]`
   - Update `maxSum`
2. Return `maxSum`.

**Complexity**:
- Time: O(n·k) — recomputes overlapping elements
- Space: O(1)

---

## Comparison / So sánh

| Solution | Time | Space | Notes |
|----------|------|-------|-------|
| Sliding Window | O(n) | O(1) | Recommended — optimal |
| Brute Force | O(n·k) | O(1) | Acceptable only for tiny inputs |

---

## Interview Tips / Mẹo phỏng vấn

- **Key point**: The sliding window pattern transforms O(n·k) brute force into O(n) by reusing previous computation. Always ask yourself: "what changes when the window slides one step?"
- **Edge cases**: `k == n` (entire array is the window), `k == 1` (answer is max element), array with all negatives.
- **Follow-up**: "What if k is variable / you need the max sum of ANY subarray?" → switch to Kadane's Algorithm (dynamic window).

---

## The Universal Fixed-Window Template / Mẫu tổng quát

```
function fixedWindowTemplate(arr, k):
    // Phase 1: Build initial window
    initialize window state from arr[0..k-1]
    record best = initial window state

    // Phase 2: Slide window
    for i from k to n - 1:
        add arr[i] to window       // right element enters
        remove arr[i - k] from window  // left element leaves
        update best from window state

    return best
```

Dùng mẫu này cho: maximum/minimum/average/count trong cửa sổ kích thước `k` cố định.

---

## Related Problems / Bài liên quan

- Maximum Average Subarray I (LC 643) — direct application of this template
- Sliding Window Maximum (LC 239) — fixed window but need max element (use deque)
- Subarray Product Less Than K (LC 713) — variable window variant
- 28-two-pointers-sorted.md — complementary two-pointer technique
