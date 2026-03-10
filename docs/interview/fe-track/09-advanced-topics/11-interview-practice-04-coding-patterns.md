# Common Coding Patterns / Mẫu Lập Trình Phổ Biến
## Interview Practice - Chapter 4 / Thực Hành Phỏng Vấn - Chương 4

[Back to Table of Contents](../00-table-of-contents.md)

---

## Two Pointers Pattern

```typescript
// Two Sum - Sorted Array / Hai Tổng - Mảng Đã Sắp Xếp
function twoSum(arr: number[], target: number): [number, number] | null {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return null;
}

// Remove Duplicates / Xóa Trùng Lặp
function removeDuplicates(arr: number[]): number {
  if (arr.length === 0) return 0;
  
  let i = 0;
  for (let j = 1; j < arr.length; j++) {
    if (arr[j] !== arr[i]) {
      i++;
      arr[i] = arr[j];
    }
  }
  
  return i + 1;
}
```

## Sliding Window Pattern

```typescript
// Maximum Sum Subarray / Tổng Tối Đa Mảng Con
function maxSubarraySum(arr: number[], k: number): number {
  let maxSum = 0;
  let windowSum = 0;

  // Calculate first window / Tính cửa sổ đầu tiên
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide window / Trượt cửa sổ
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Longest Substring Without Repeating / Chuỗi Con Dài Nhất Không Lặp
function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

## Fast & Slow Pointers

```typescript
// Detect Cycle in Linked List / Phát Hiện Chu Trình Trong Danh Sách Liên Kết
function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    
    if (slow === fast) return true;
  }

  return false;
}

// Find Middle of Linked List / Tìm Giữa Danh Sách Liên Kết
function findMiddle(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}
```

## Merge Intervals

```typescript
interface Interval {
  start: number;
  end: number;
}

function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) return [];

  // Sort by start time / Sắp xếp theo thời gian bắt đầu
  intervals.sort((a, b) => a.start - b.start);

  const merged: Interval[] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      // Merge overlapping / Trộn chồng chéo
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}
```

## Backtracking

```typescript
// Generate Permutations / Tạo Hoán Vị
function permute(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(current: number[], remaining: number[]): void {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(
        current,
        [...remaining.slice(0, i), ...remaining.slice(i + 1)]
      );
      current.pop();
    }
  }

  backtrack([], nums);
  return result;
}

// Generate Subsets / Tạo Tập Con
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, current: number[]): void {
    result.push([...current]);

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
