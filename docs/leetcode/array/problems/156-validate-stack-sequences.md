---
layout: page
title: "Validate Stack Sequences"
difficulty: Medium
category: Array
tags: [Array, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/validate-stack-sequences"
---

# Validate Stack Sequences / Kiểm Tra Chuỗi Thao Tác Stack

**Difficulty:** Medium | **Category:** Array, Stack, Simulation | **LeetCode:** [946](https://leetcode.com/problems/validate-stack-sequences)

## 🧠 Intuition

**Phép so sánh tiếng Việt:** Hãy tưởng tượng bạn đang xếp đĩa vào giá (push) và lấy đĩa ra (pop). Ai đó ghi lại thứ tự push và thứ tự pop — câu hỏi là: liệu hai danh sách đó có "khớp" với nhau không, tức là có thể thực hiện được trên một stack thực sự không?

```
pushed = [1, 2, 3, 4, 5], popped = [4, 5, 3, 2, 1]

Giả lập:
stack=[]
push 1 → [1]
push 2 → [1,2]
push 3 → [1,2,3]
push 4 → [1,2,3,4]  → top=4=popped[0] → pop → [1,2,3], j=1
push 5 → [1,2,3,5]  → top=5=popped[1] → pop → [1,2,3], j=2
                       top=3=popped[2] → pop → [1,2],   j=3
                       top=2=popped[3] → pop → [1],     j=4
                       top=1=popped[4] → pop → [],      j=5
j == n ✓ → VALID
```

## 📝 Tips

1. **Simulate — không cần suy nghĩ phức tạp**: Cứ push theo `pushed`, sau mỗi lần push kiểm tra top có bằng `popped[j]` không → nếu có thì pop liên tục.
2. **Con trỏ j cho popped**: Dùng một con trỏ `j` chỉ vào phần tử tiếp theo cần được pop khỏi `popped`. Khi pop thành công, tăng `j`.
3. **Stack rỗng sau cùng**: Nếu tất cả popped đều được matched (j == n) → hợp lệ.
4. **Không cần brute force**: Chỉ có đúng một cách simulate vì thứ tự push đã cố định.
5. **In-place variant**: Dùng chính `pushed` array làm stack (dùng con trỏ top) để tiết kiệm space.
6. **Edge cases**: pushed và popped có cùng độ dài, cùng tập phần tử (permutation của nhau). Nếu không → không valid.

## 💡 Solutions

```typescript
/**
 * Approach 1: Simulation với stack riêng
 * Time: O(n)  Space: O(n)
 *
 * Giả lập stack: push từng phần tử, sau đó pop khi top == popped[j]
 */
function validateStackSequences(pushed: number[], popped: number[]): boolean {
  const stack: number[] = [];
  let j = 0; // con trỏ trong popped

  for (const val of pushed) {
    stack.push(val);

    // Pop liên tục khi top của stack == phần tử cần pop tiếp theo
    while (stack.length > 0 && stack[stack.length - 1] === popped[j]) {
      stack.pop();
      j++;
    }
  }

  // Hợp lệ khi tất cả phần tử trong popped đã được matched
  return j === popped.length;
}

// Tests
console.log(validateStackSequences([1, 2, 3, 4, 5], [4, 5, 3, 2, 1])); // true
console.log(validateStackSequences([1, 2, 3, 4, 5], [4, 3, 5, 1, 2])); // false
console.log(validateStackSequences([1], [1])); // true
console.log(validateStackSequences([2, 1, 0], [1, 2, 0])); // true
```

```typescript
/**
 * Approach 2: In-place — dùng pushed array làm stack
 * Time: O(n)  Space: O(1) extra
 *
 * Dùng pushed như một stack (con trỏ top thay cho array mới)
 */
function validateStackSequencesInPlace(pushed: number[], popped: number[]): boolean {
  let top = 0; // "stack pointer" trỏ vào pushed
  let j = 0; // con trỏ popped

  for (let i = 0; i < pushed.length; i++) {
    pushed[top++] = pushed[i]; // "push" vào stack ảo

    // Pop liên tục
    while (top > 0 && pushed[top - 1] === popped[j]) {
      top--;
      j++;
    }
  }

  return top === 0; // stack phải rỗng
}

// Tests
console.log(validateStackSequencesInPlace([1, 2, 3, 4, 5], [4, 5, 3, 2, 1])); // true
console.log(validateStackSequencesInPlace([1, 2, 3, 4, 5], [4, 3, 5, 1, 2])); // false
console.log(validateStackSequencesInPlace([0, 1, 2], [2, 1, 0])); // true
```

```typescript
/**
 * Approach 3: Functional — kiểm tra bằng reduce
 * Time: O(n)  Space: O(n)
 *
 * Mô hình hoá state machine: state = { stack, j }
 */
function validateStackSequencesFunctional(pushed: number[], popped: number[]): boolean {
  type State = { stack: number[]; j: number };

  const finalState = pushed.reduce<State>(
    ({ stack, j }, val) => {
      stack.push(val);
      while (stack.length > 0 && stack[stack.length - 1] === popped[j]) {
        stack.pop();
        j++;
      }
      return { stack, j };
    },
    { stack: [], j: 0 },
  );

  return finalState.j === popped.length;
}

// Tests
console.log(validateStackSequencesFunctional([1, 2, 3, 4, 5], [4, 5, 3, 2, 1])); // true
console.log(validateStackSequencesFunctional([1, 2, 3, 4, 5], [4, 3, 5, 1, 2])); // false
console.log(validateStackSequencesFunctional([1, 0], [1, 0])); // true
```

## 🔗 Related

| Problem                                                                                                            | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Valid Parentheses](https://leetcode.com/problems/valid-parentheses)                                               | Easy       | Stack simulation |
| [Decode String](https://leetcode.com/problems/decode-string)                                                       | Medium     | Stack            |
| [Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) | Easy       | Stack            |
