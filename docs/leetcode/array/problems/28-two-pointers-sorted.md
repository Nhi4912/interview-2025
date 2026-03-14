# Two Pointers on Sorted Array / Hai con trỏ trên mảng đã sắp xếp

> **Track**: Shared | **Difficulty**: 🟢 Easy
> **LeetCode**: Template | **Pattern**: Two Pointers
> **Category**: Array

## Problem / Đề bài

**English**: Given a **sorted** array of integers and a target value, determine whether any two distinct elements in the array sum to the target. Return the 1-indexed positions of the two numbers. This is the canonical Two Sum II template problem that demonstrates the two-pointer technique on sorted arrays.

**Vietnamese**: Cho một mảng số nguyên **đã sắp xếp tăng dần** và một giá trị mục tiêu, xác định xem có hai phần tử phân biệt nào trong mảng có tổng bằng giá trị mục tiêu không. Trả về vị trí (đánh số từ 1) của hai số đó. Đây là bài toán mẫu kinh điển minh họa kỹ thuật hai con trỏ trên mảng đã sắp xếp.

**Example**:
```
Input: numbers = [2, 7, 11, 15], target = 9
Output: [1, 2]
Explanation: numbers[1] + numbers[2] = 2 + 7 = 9.
             Return [1, 2] (1-indexed).
```

**Constraints**:
- `2 <= numbers.length <= 3 * 10^4`
- `-1000 <= numbers[i] <= 1000`
- `numbers` is sorted in non-decreasing order
- Exactly one valid answer exists
- Must use O(1) extra space

---

## Approach / Hướng giải

### Pattern nhận dạng / Pattern recognition

Hai tín hiệu để nhận ra Two Pointers: (1) mảng **đã sắp xếp**, (2) tìm **cặp/bộ phần tử** thỏa điều kiện liên quan đến tổng/hiệu. Khi mảng đã sắp xếp, ta có thể điều hướng thông minh: tổng quá lớn → thu nhỏ bên phải, tổng quá nhỏ → mở rộng bên trái.

The key signal is a **sorted array** combined with a **pair-finding** objective. The sorted property lets you make a binary decision at each step: move left pointer right (increase sum) or move right pointer left (decrease sum).

### Key Insight / Ý tưởng chính

Vì mảng đã sắp xếp, đặt hai con trỏ ở hai đầu. Nếu tổng hiện tại quá nhỏ, di chuyển con trỏ trái sang phải (tăng tổng). Nếu tổng quá lớn, di chuyển con trỏ phải sang trái (giảm tổng). Đảm bảo tìm được đáp án trong O(n) thay vì O(n²) brute force.

---

## Solutions / Các cách giải

### Solution 1: Two Pointers — O(n) time, O(1) space ✅ Recommended

**Idea**: Place one pointer at the start (`left`) and one at the end (`right`). Compute their sum. If too small, advance `left`; if too large, retreat `right`; if equal, return the pair.

**Ý tưởng**: Đặt một con trỏ ở đầu mảng (`left`) và một con trỏ ở cuối (`right`). Tính tổng. Nếu tổng nhỏ hơn target, tiến `left` lên phải; nếu lớn hơn, lùi `right` về trái; nếu bằng, trả về cặp này.

**Algorithm**:
1. Initialize `left = 0`, `right = n - 1`.
2. While `left < right`:
   - Compute `sum = numbers[left] + numbers[right]`
   - If `sum == target`: return `[left + 1, right + 1]` (1-indexed)
   - If `sum < target`: `left++` (need a larger left value)
   - If `sum > target`: `right--` (need a smaller right value)
3. (Guaranteed to find answer per constraints)

**Pseudocode**:
```
function twoSumSorted(numbers, target):
    left = 0
    right = length(numbers) - 1

    while left < right:
        sum = numbers[left] + numbers[right]

        if sum == target:
            return [left + 1, right + 1]   // 1-indexed
        else if sum < target:
            left = left + 1
        else:
            right = right - 1

    // guaranteed to find answer
```

**Visual**:
```
numbers = [2, 7, 11, 15],  target = 9

Initial:
  L                  R
  2    7    11   15

  sum = 2 + 15 = 17 > 9  →  move R left

  L         R
  2    7    11   15

  sum = 2 + 11 = 13 > 9  →  move R left

  L    R
  2    7    11   15

  sum = 2 + 7 = 9 == 9  ✓  →  return [1, 2]
```

**Complexity**:
- Time: O(n) — each pointer moves at most n steps total
- Space: O(1) — only two pointer variables

---

### Solution 2: Binary Search — O(n log n) time, O(1) space

**Idea**: For each element `numbers[i]`, binary search for `target - numbers[i]` in the remainder of the array.

**Algorithm**:
1. For each `i` from `0` to `n - 1`:
   - Binary search for `target - numbers[i]` in `numbers[i+1..n-1]`
   - If found at index `j`, return `[i + 1, j + 1]`

**Complexity**:
- Time: O(n log n) — n iterations, each with O(log n) binary search
- Space: O(1)

---

### Solution 3: Hash Map — O(n) time, O(n) space

**Idea**: Store each visited element in a hash map. For each new element, check if its complement (`target - element`) was seen before.

**Complexity**:
- Time: O(n)
- Space: O(n) — violates the O(1) space constraint of this problem

---

## Comparison / So sánh

| Solution | Time | Space | Notes |
|----------|------|-------|-------|
| Two Pointers | O(n) | O(1) | Recommended — optimal for sorted arrays |
| Binary Search | O(n log n) | O(1) | Good fallback, still O(1) space |
| Hash Map | O(n) | O(n) | Optimal time but uses extra space |

---

## The Universal Two-Pointer Template / Mẫu tổng quát

```
function twoPointerTemplate(sortedArr, condition):
    left = 0
    right = length(sortedArr) - 1

    while left < right:
        current = evaluate(sortedArr[left], sortedArr[right])

        if current == target:
            record answer
            left++  (or right--, or both, depending on problem)
        else if current < target:
            left++      // need to increase value
        else:
            right--     // need to decrease value

    return answer
```

Áp dụng cho: Two Sum II, Three Sum, Container with Most Water, Valid Palindrome.

---

## Interview Tips / Mẹo phỏng vấn

- **Key point**: Two pointers only works correctly on a **sorted** (or otherwise structured) array. Always confirm the array is sorted before applying this technique.
- **Edge cases**: Two identical elements summing to target (e.g., `[3, 3]`, target `6`), negative numbers in array, minimum array size (`n = 2`).
- **Follow-up**: "What if the array is not sorted?" → Either sort first O(n log n) + O(1), or use a hash map O(n) + O(n).

---

## Related Problems / Bài liên quan

- Two Sum II - Input Array Is Sorted (LC 167) — direct application
- Three Sum (LC 15) — extend to triplets; fix one element, two-pointer the rest
- Container With Most Water (LC 11) — two pointers maximizing area
- Valid Palindrome (LC 125) — two pointers checking characters from both ends
- 27-sliding-window-fixed.md — complementary sliding window technique
