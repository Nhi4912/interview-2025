---
layout: page
title: "Design a Text Editor"
difficulty: Hard
category: Linked-List
tags: [Linked List, String, Stack, Design, Simulation]
leetcode_url: "https://leetcode.com/problems/design-a-text-editor"
---

# Design a Text Editor / Thiết Kế Trình Soạn Thảo Văn Bản

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Stacks (Gap Buffer)
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Max Stack](https://leetcode.com/problems/max-stack) | [LFU Cache](https://leetcode.com/problems/lfu-cache)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống máy chữ có hai ngăn giấy — ngăn trái chứa chữ trước con trỏ (top = sát cursor), ngăn phải chứa chữ sau con trỏ (top = sát cursor). Gõ chữ = push vào stack trái. Xoá = pop từ stack trái. Di chuyển cursor = chuyển phần tử giữa hai stack.

**Pattern Recognition:**

- Signal: "cursor operations" + "insert/delete at cursor" → **Two Stacks (Gap Buffer)**
- Key insight: `leftStack` top = ký tự ngay bên trái cursor; `rightStack` top = ký tự ngay bên phải cursor
- `cursorLeft(k)`: pop k từ left → push vào right; `cursorRight(k)`: ngược lại

**Visual — addText("leet"), cursorLeft(2), addText("r"):**

```
Initial:  left=[]       right=[]
addText("leet"):
          left=[l,e,e,t]  right=[]

cursorLeft(2):  move t,e from left to right
          left=[l,e]      right=[t,e]   ← right top is 'e', next to cursor

addText("r"):   push to left
          left=[l,e,r]    right=[t,e]

deleteText(1):  pop 1 from left
          left=[l,e]      right=[t,e]

cursorLeft(10): k=10 but only 2 chars left → move both
          left=[]         right=[l,e,t,e]  (was: e→top, then l)

cursorRight(5): move 4 (min(5,4)) from right to left
          left=[l,e,t,e]  right=[]

Return last 10 of left: "leet"
```

---

## Problem Description

Implement a text editor with a movable cursor. ([LeetCode #2296](https://leetcode.com/problems/design-a-text-editor))

Difficulty: Hard | Acceptance: 47.1%

- `addText(text)` — insert `text` at cursor position
- `deleteText(k)` → delete up to `k` chars to the left of cursor; return actual count deleted
- `cursorLeft(k)` → move cursor left up to `k` steps; return last min(10, chars_left) chars
- `cursorRight(k)` → move cursor right up to `k` steps; return last min(10, chars_left) chars

**Example:**

```
addText("leetcode")
deleteText(4)           → 4     text = "leet|"
addText("practice")         text = "leetpractice|"
cursorLeft(3)           → "leetprac"   cursor: "leetprac|tice"
deleteText(4)           → 4     text = "leet|tice"
cursorLeft(2)           → "le"
cursorRight(6)          → "leetprac"
```

Constraints: `1 ≤ text.length, k ≤ 40`, up to `2*10^4` calls

---

## 📝 Interview Tips

1. **Clarify**: "Cursor ở đâu ban đầu? Có multi-line không?" / Cursor starts at end; single-line only
2. **Two stacks**: "Left stack = chars trước cursor, right stack = chars sau — O(k) mỗi move" / Gap buffer pattern
3. **cursorLeft return**: "Trả về TỐI ĐA 10 ký tự ngay trước cursor (top of left stack)" / Return last 10 of left
4. **deleteText**: "Chỉ xoá ký tự BÊN TRÁI cursor (from left stack) — return actual count" / Pop from left, count pops
5. **addText**: "Push từng ký tự vào left stack — O(len(text)) per call" / Push chars one by one to left
6. **Follow-up**: "Doubly linked list thay vì array stack → O(1) insert/delete mọi vị trí" / DLL is alternative for complex editors

---

## Solutions

```typescript
/**
 * Solution 1: Two Stacks (Gap Buffer pattern)
 * Time: O(k) for cursorLeft/cursorRight; O(|text|) for addText; O(k) deleteText
 * Space: O(total chars) — both stacks together hold all text
 */
class TextEditor {
  private left: string[] = []; // chars before cursor, top = adjacent to cursor
  private right: string[] = []; // chars after cursor,  top = adjacent to cursor

  addText(text: string): void {
    for (const ch of text) this.left.push(ch);
  }

  deleteText(k: number): number {
    let deleted = 0;
    while (k > 0 && this.left.length > 0) {
      this.left.pop();
      k--;
      deleted++;
    }
    return deleted;
  }

  cursorLeft(k: number): string {
    while (k > 0 && this.left.length > 0) {
      this.right.push(this.left.pop()!);
      k--;
    }
    return this._leftTail();
  }

  cursorRight(k: number): string {
    while (k > 0 && this.right.length > 0) {
      this.left.push(this.right.pop()!);
      k--;
    }
    return this._leftTail();
  }

  /** Return last min(10, left.length) chars before cursor */
  private _leftTail(): string {
    const start = Math.max(0, this.left.length - 10);
    return this.left.slice(start).join("");
  }
}

// === Test Cases ===
const te = new TextEditor();
te.addText("leetcode");
console.log(te.deleteText(4)); // 4    → left="leet"
te.addText("practice");
console.log(te.cursorLeft(3)); // "leetprac"   cursor after "leetprac"
console.log(te.deleteText(4)); // 4    → left="leet"
console.log(te.cursorLeft(2)); // "le"
console.log(te.cursorRight(6)); // "leetprac"

// Edge: cursorLeft more than available
const te2 = new TextEditor();
te2.addText("abc");
console.log(te2.cursorLeft(10)); // "abc"   (only 3 chars left, move all)
console.log(te2.cursorRight(1)); // "a"     moved 1 right

/**
 * Solution 2: Single string with cursor index (simpler, O(n) ops due to string splice)
 * Time: O(n) for most operations (string reallocation)
 * Space: O(n)
 * Note: Easier to reason about, but slower for large inputs
 */
class TextEditor2 {
  private text = "";
  private cursor = 0; // index: cursor is between text[cursor-1] and text[cursor]

  addText(t: string): void {
    this.text = this.text.slice(0, this.cursor) + t + this.text.slice(this.cursor);
    this.cursor += t.length;
  }

  deleteText(k: number): number {
    const actual = Math.min(k, this.cursor);
    this.text = this.text.slice(0, this.cursor - actual) + this.text.slice(this.cursor);
    this.cursor -= actual;
    return actual;
  }

  cursorLeft(k: number): string {
    this.cursor = Math.max(0, this.cursor - k);
    return this._tail();
  }

  cursorRight(k: number): string {
    this.cursor = Math.min(this.text.length, this.cursor + k);
    return this._tail();
  }

  private _tail(): string {
    return this.text.slice(Math.max(0, this.cursor - 10), this.cursor);
  }
}

const te3 = new TextEditor2();
te3.addText("leetcode");
console.log(te3.deleteText(4)); // 4
te3.addText("practice");
console.log(te3.cursorLeft(3)); // "leetprac"
```

---

## 🔗 Related Problems

- [Max Stack](https://leetcode.com/problems/max-stack) — auxiliary stack tracking extra state
- [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) — stack-based deletion simulation
- [LFU Cache](https://leetcode.com/problems/lfu-cache) — complex stateful Design problem
- [All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure) — linked list Design
- [Design a Text Editor — LeetCode](https://leetcode.com/problems/design-a-text-editor) — problem page
