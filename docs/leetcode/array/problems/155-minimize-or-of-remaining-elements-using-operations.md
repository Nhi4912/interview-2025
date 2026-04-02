---
layout: page
title: "Minimize OR of Remaining Elements Using Operations"
difficulty: Hard
category: Array
tags: [Array, Greedy, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/minimize-or-of-remaining-elements-using-operations"
---

# Minimize OR of Remaining Elements Using Operations / Tối Thiểu OR Của Các Phần Tử Còn Lại

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Phép so sánh tiếng Việt:** Giống như bạn muốn "tắt đèn" trên bảng điện — mỗi ô đèn là một bit. Mỗi lần AND hai phần tử kề nhau chỉ có thể tắt đèn (không bật thêm). Bạn được k lần AND liên tiếp. Muốn kết quả OR nhỏ nhất → tắt được nhiều bit nhất.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimize OR of Remaining Elements Using Operations example:**

```
Greedy từ bit cao nhất xuống thấp nhất:
bit 29 → ... → bit 1 → bit 0

Với mỗi bit b: thử đưa bit b về 0 trong kết quả.
Cách: AND liên tiếp các phần tử để "triệt tiêu" bit b.
Nếu cần <= k+1 phân đoạn AND → có thể loại bỏ bit b.

[3, 5, 3, 2, 7], k=2
bit 2 (=4): thử loại bỏ
  AND từng đoạn: 3(011), 5(101)→AND=001, 3(011)→001, 2(010)→000, 7(111)→000
  Cần 1 đoạn → segments=1 <= k+1=3 ✓ → loại bit 2 khỏi kết quả
```

---

## Problem Description

---

## 📝 Interview Tips

1. **Greedy từ bit cao xuống thấp**: Bit cao có trọng số lớn hơn, ưu tiên loại nó trước.
2. **AND chỉ tắt bit**: Phép AND không bao giờ bật bit mới → chỉ có lợi khi dùng AND liên tiếp.
3. **Đếm segment**: Khi AND liên tục và gặp bit b bật lên ở giá trị tạm, ta phải "reset" → tăng segment count.
4. **k lần AND = k+1 phần tử thành 1**: k lần AND trên k+1 phần tử liên tiếp → cần <= k+1 segments để cover toàn mảng.
5. **Accumulate target**: Giữ `target` là mask các bit đã quyết định loại bỏ, dùng để check segment.
6. **Không phải DP**: Greedy bit-by-bit từ MSB đảm bảo optimal vì mỗi bit độc lập với bit thấp hơn.

---

## Solutions

```typescript
/**
 * Approach 1: Greedy Bit-by-Bit từ MSB xuống LSB
 * Time: O(30 * n)  Space: O(1)
 *
 * Với mỗi bit b từ 29 xuống 0:
 *   Thử thêm bit b vào "target loại bỏ"
 *   Đếm số segments cần để AND tất cả phần tử "có bit target" về 0
 *   Nếu segments <= k+1 → giữ target (loại được bit b)
 */
function minimizeOrGreedy(nums: number[], k: number): number {
  const n = nums.length;
  let target = 0; // mask các bit đã chọn loại bỏ

  for (let bit = 29; bit >= 0; bit--) {
    const newTarget = target | (1 << bit);

    // Đếm số phân đoạn AND cần thiết để triệt tiêu tất cả bit trong newTarget
    let segments = 1;
    let andVal = (1 << 30) - 1; // bắt đầu với tất cả bit bật

    for (let i = 0; i < n; i++) {
      andVal &= nums[i];
      // Nếu AND hiện tại đã loại hết bit trong newTarget → segment hoàn tất
      if ((andVal & newTarget) === 0) {
        // Segment này đã "vô hiệu hoá" newTarget → reset cho segment kế
        andVal = (1 << 30) - 1;
        if (i < n - 1) segments++;
        // Không cần reset nếu là phần tử cuối
      }
    }

    // Nếu dùng <= k lần AND (= k+1 phân đoạn) thì bit b có thể bị loại
    if (segments <= k + 1) {
      target = newTarget;
    }
  }

  // Kết quả: OR của mảng với các bit đã loại bỏ = 0
  // Thực ra kết quả là OR của mảng trừ target
  let result = 0;
  for (const num of nums) {
    result |= num;
  }
  return result & ~target;
}

// Tests
console.log(minimizeOrGreedy([3, 5, 3, 2, 7], 2)); // 3
console.log(minimizeOrGreedy([7, 3, 15, 14, 2, 8], 4)); // 2
console.log(minimizeOrGreedy([10, 7, 10, 3, 9, 14, 9, 4], 1)); // 15

/**
 * Approach 2: Greedy với segment counting chuẩn
 * Time: O(30 * n)  Space: O(1)
 *
 * Cải tiến: đếm segment chính xác hơn, tránh off-by-one
 */
function minimizeOr(nums: number[], k: number): number {
  const n = nums.length;
  let eliminatedMask = 0;

  for (let bit = 29; bit >= 0; bit--) {
    const tryMask = eliminatedMask | (1 << bit);

    // Đếm số lần AND liên tiếp cần dùng để cover toàn mảng
    // sao cho mỗi "nhóm" AND lại = 0 với tryMask
    let opsNeeded = 0;
    let cur = ~0; // all bits set

    for (const num of nums) {
      cur &= num;
      if ((cur & tryMask) === 0) {
        // Nhóm này đủ để triệt tiêu tryMask → dùng (size-1) AND ops
        opsNeeded += 0; // reset, sẽ tính qua vòng lặp
        cur = ~0;
      }
    }

    // Cách đếm ops: mỗi nhóm có size s cần s-1 AND ops
    // Số nhóm = segments, tổng ops = n - segments
    // Cần n - segments <= k → segments >= n - k
    // Vì segments cũng = số lần (cur & tryMask)==0 trong vòng lặp

    // Đếm lại cho rõ:
    let segments = 0;
    cur = ~0;
    for (const num of nums) {
      cur &= num;
      if ((cur & tryMask) === 0) {
        segments++;
        cur = ~0;
      }
    }

    // Tổng AND operations = n - segments (mỗi segment s dùng s-1 phép AND)
    if (n - segments <= k) {
      eliminatedMask = tryMask;
    }
  }

  let result = 0;
  for (const num of nums) result |= num;
  return result & ~eliminatedMask;
}

// Tests
console.log(minimizeOr([3, 5, 3, 2, 7], 2)); // 3
console.log(minimizeOr([7, 3, 15, 14, 2, 8], 4)); // 2
console.log(minimizeOr([1], 0)); // 1

/**
 * Approach 3: Tương đương — tính trực tiếp result bit-by-bit
 * Time: O(30 * n)  Space: O(1)
 */
function minimizeOrDirect(nums: number[], k: number): number {
  let result = 0;

  for (let bit = 29; bit >= 0; bit--) {
    // Thử loại bit này: result hiện tại không có bit này
    // Kiểm tra: có thể dùng <= k phép AND để AND(segment) & (result | bit) = 0?
    const checkMask = result | (1 << bit);
    let segments = 0;
    let cur = -1; // 0xFFFFFFFF

    for (const num of nums) {
      cur &= num;
      if ((cur & checkMask) === 0) {
        segments++;
        cur = -1;
      }
    }

    // Nếu không đủ segment để cover với k ops → phải giữ bit này trong result
    if (n - segments > k) {
      result |= 1 << bit;
    }
  }

  // Hàm nội bộ cần n
  function solve(nums: number[], k: number): number {
    const n = nums.length;
    let res = 0;
    for (let bit = 29; bit >= 0; bit--) {
      const mask = res | (1 << bit);
      let segs = 0,
        cur = -1;
      for (const num of nums) {
        cur &= num;
        if ((cur & mask) === 0) {
          segs++;
          cur = -1;
        }
      }
      if (n - segs > k) res |= 1 << bit;
    }
    return res;
  }

  return solve(nums, k);
}

// Tests
console.log(minimizeOrDirect([3, 5, 3, 2, 7], 2)); // 3
console.log(minimizeOrDirect([7, 3, 15, 14, 2, 8], 4)); // 2
console.log(minimizeOrDirect([10, 7, 10, 3, 9, 14, 9, 4], 1)); // 15
```

---

## 🔗 Related Problems

| Problem                                                                                                                                | Difficulty | Pattern          |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Minimize the Maximum of Two Arrays](https://leetcode.com/problems/minimize-the-maximum-of-two-arrays)                                 | Medium     | Greedy           |
| [Find the Minimum Possible Sum of a Beautiful Array](https://leetcode.com/problems/find-the-minimum-possible-sum-of-a-beautiful-array) | Medium     | Greedy           |
| [Minimum Array End](https://leetcode.com/problems/minimum-array-end)                                                                   | Medium     | Bit Manipulation |
