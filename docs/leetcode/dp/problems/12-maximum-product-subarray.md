# Maximum Product Subarray / Tích lớn nhất của mảng con

> **Track**: Shared | **Difficulty**: 🟡 Medium
> **LeetCode**: #152 | **Pattern**: Dynamic Programming (Kadane's variant)
> **Category**: Array, DP

## Problem / Đề bài

**English**: Given an integer array `nums`, find the contiguous subarray (containing at least one element) that has the largest product, and return that product.

**Vietnamese**: Cho mảng số nguyên `nums`, tìm mảng con liên tiếp (ít nhất 1 phần tử) có tích lớn nhất và trả về tích đó.

**Example**:
```
Input: nums = [2, 3, -2, 4]
Output: 6
Explanation: Subarray [2, 3] has the largest product = 6

Input: nums = [-2, 0, -1]
Output: 0
Explanation: The result cannot be 2 because [-2,-1] is not contiguous with subarray skipping 0.
Actually: subarrays are [-2], [0], [-1], [-2,0], [0,-1], [-2,0,-1] → max = 0

Input: nums = [-2, 3, -4]
Output: 24
Explanation: [-2, 3, -4] = 24 (two negatives make positive)
```

**Constraints**:
- 1 <= nums.length <= 2 × 10⁴
- -10 <= nums[i] <= 10
- The product of any subarray fits in a 32-bit integer

---

## Approach / Hướng giải

### Pattern nhận dạng / Pattern recognition

Bài này trông giống **Maximum Subarray** (Kadane's Algorithm) nhưng có một điểm khác biệt quan trọng: **tích của số âm**. Số âm × số âm = số dương lớn. Vì vậy, ta phải theo dõi **cả max lẫn min** tại mỗi vị trí — vì min hiện tại (số âm lớn nhất về giá trị tuyệt đối) có thể trở thành max khi nhân với số âm tiếp theo.

Khi thấy bài về subarray + product → nghĩ ngay đến việc maintain cả max và min running product.

### Key Insight / Ý tưởng chính

Tại mỗi vị trí `i`, giá trị max product kết thúc tại `i` có thể là:
1. `nums[i]` itself (bắt đầu subarray mới)
2. `maxProd * nums[i]` (extend subarray có max product)
3. `minProd * nums[i]` (min âm × nums[i] âm = max dương)

→ Track both `maxEndingHere` và `minEndingHere` at every step.

---

## Solutions / Các cách giải

### Solution 1: DP with Min/Max Tracking — O(n) time, O(1) space ✅ Recommended

**Idea**: Extend Kadane's algorithm by tracking both the maximum and minimum product ending at each position. At each step, the new max could come from multiplying the previous max, the previous min (if current is negative), or starting fresh.

**Ý tưởng**: Mở rộng Kadane's bằng cách theo dõi cả max và min product kết thúc tại mỗi vị trí. Max mới có thể đến từ: max cũ × hiện tại, min cũ × hiện tại (đảo dấu), hoặc bắt đầu lại từ phần tử hiện tại.

**Algorithm**:
1. Initialize `maxProd = nums[0]`, `minProd = nums[0]`, `result = nums[0]`
2. For each `num` from `nums[1]` to `nums[n-1]`:
   a. `candidates = [num, maxProd * num, minProd * num]`
   b. `maxProd = max(candidates)`
   c. `minProd = min(candidates)`
   d. `result = max(result, maxProd)`
3. Return `result`

**Pseudocode**:
```
function maxProduct(nums):
    maxProd = nums[0]
    minProd = nums[0]
    result  = nums[0]

    for i from 1 to length(nums) - 1:
        num = nums[i]

        // Must save maxProd before overwriting
        tempMax = maxProd

        maxProd = max(num, maxProd * num, minProd * num)
        minProd = min(num, tempMax * num, minProd * num)

        result = max(result, maxProd)

    return result
```

**Visual**:
```
nums = [2, 3, -2, 4]

       num  maxProd  minProd  result
Start:  -      2        2      2
i=1:    3      6        3      6    max(3, 2*3, 2*3)=6, min(3, 2*3, 2*3)=3
i=2:   -2     -3      -12      6    max(-2, 6*-2, 3*-2)=-2 → wait:
                                    max(-2, -12, -6) = -2
                                    min(-2, -12, -6) = -12
                                    result = max(6, -2) = 6
i=3:    4      -8      -48     6    max(4, -2*4, -12*4)=max(4,-8,-48)=4
                                    min(4, -8, -48) = -48
                                    result = max(6, 4) = 6

Final: 6 ✓

---
nums = [-2, 3, -4]

       num  maxProd  minProd  result
Start:  -     -2       -2      -2
i=1:    3      3       -6      3    max(3, -6, -6)=3, min(3,-6,-6)=-6
i=2:   -4     24       -12    24    max(-4, 3*-4, -6*-4)=max(-4,-12,24)=24
                                    min(-4, -12, 24) = -12
                                    result = max(3, 24) = 24

Final: 24 ✓  (subarray [-2,3,-4])
```

**Complexity**:
- Time: O(n) — single pass through the array
- Space: O(1) — only three variables

---

### Solution 2: Prefix/Suffix Products — O(n) time, O(1) space

**Idea**: Key observation — if there is an even number of negative numbers, the entire array product is the answer. A zero resets the product. Scan left-to-right (prefix) and right-to-left (suffix), tracking the running product and max seen. Reset to 1 when hitting zero. The maximum of all prefix and suffix products is the answer.

**Algorithm**:
1. Initialize `maxProd = max(nums)`, `prefixProd = 1`, `suffixProd = 1`
2. For `i` from 0 to n-1:
   - `prefixProd *= nums[i]`
   - `suffixProd *= nums[n-1-i]`
   - `maxProd = max(maxProd, prefixProd, suffixProd)`
   - If `prefixProd == 0`: reset `prefixProd = 1`
   - If `suffixProd == 0`: reset `suffixProd = 1`
3. Return `maxProd`

**Pseudocode**:
```
function maxProduct(nums):
    n = length(nums)
    maxProd = max(nums)
    prefix = 1
    suffix = 1

    for i from 0 to n-1:
        prefix *= nums[i]
        suffix *= nums[n-1-i]
        maxProd = max(maxProd, prefix, suffix)
        if prefix == 0: prefix = 1
        if suffix == 0: suffix = 1

    return maxProd
```

**Complexity**:
- Time: O(n)
- Space: O(1)

---

## Comparison / So sánh

| Solution | Time | Space | Notes |
|----------|------|-------|-------|
| DP Min/Max | O(n) | O(1) | Recommended — intuitive extension of Kadane's |
| Prefix/Suffix | O(n) | O(1) | Elegant but less intuitive to derive |

---

## Interview Tips / Mẹo phỏng vấn

- **Key point**: This is Kadane's Algorithm with a twist — because of negative numbers, track BOTH max and min. A negative min becomes a positive max when multiplied by another negative. Always compute `tempMax` before overwriting `maxProd`.
- **Edge cases**:
  - Single element: `[-5]` → -5 (must return it, even if negative)
  - Contains zero: `[0, 2]` → 2 (zero resets the product)
  - All negatives even count: `[-2, -3]` → 6 (both negatives cancel)
  - All negatives odd count: `[-2, -3, -4]` → 12 (best is [-3,-4] or [-2,-3])
- **Follow-up**: What if the array has very large numbers and you need to avoid overflow? Use logarithms (sum of logs instead of product).
- **Common mistake**: Forgetting to save `tempMax = maxProd` before computing the new `maxProd` and `minProd` — both use the OLD `maxProd`.

---

## Related Problems / Bài liên quan

- LC 53 — Maximum Subarray (Kadane's without the min tracking)
- LC 628 — Maximum Product of Three Numbers
- LC 713 — Subarray Product Less Than K
- LC 238 — Product of Array Except Self
