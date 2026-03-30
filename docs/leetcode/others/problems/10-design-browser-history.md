---
layout: page
title: "Design Browser History"
difficulty: Medium
category: Others
tags: [Array, Design, Stack]
leetcode_url: "https://leetcode.com/problems/design-browser-history/"
---

# Design Browser History / Thiết Kế Lịch Sử Trình Duyệt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Array + Index Pointer
> **Frequency**: 📘 Tier 2 — Real-world design problem; straightforward but teaches pointer management
> **See also**: [Design Circular Deque](./08-design-circular-deque.md) | [Design Circular Queue](./07-design-circular-queue.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng đọc một cuốn sách có thể ghi thêm trang. Bạn đánh dấu trang hiện tại. Khi lật về trước hoặc tiến tới, chỉ cần di chuyển dấu trang. Khi mở trang mới (visit), tất cả trang phía sau bị xé đi — không quay lại tương lai được nữa.

- **Pattern Recognition:**
  - Signal: lịch sử duyệt web với back/forward → array + current index pointer
  - `visit`: truncate array về `[0..current]`, append URL, advance index
  - `back(n)`: `currentIndex = max(0, currentIndex - n)` — clamp at 0
  - `forward(n)`: `currentIndex = min(len-1, currentIndex + n)` — clamp at end

- **Visual — leetcode→google→facebook→youtube, back(1), back(1), visit(linkedin):**

```
history: ["leetcode","google","facebook","youtube"]
                                          idx=3

back(1):  idx = max(0, 3-1) = 2 → "facebook"
back(1):  idx = max(0, 2-1) = 1 → "google"
forward(1): idx = 2 → "facebook"

visit("linkedin"):
  truncate: history=["leetcode","google","facebook"] (trim after idx=2)
  append:   history=["leetcode","google","facebook","linkedin"]
                                                     idx=3
forward(2): idx=min(3,3+2)=3 → "linkedin" (no future pages!)
```

## Problem Description

Implement a browser with one tab starting at `homepage`. Support: `visit(url)`, `back(steps)`, `forward(steps)`.

```
Input:  ["BrowserHistory","visit","visit","visit","back","back","forward","visit","forward","back","back"]
        [["leetcode.com"],["google.com"],["facebook.com"],["youtube.com"],[1],[1],[1],["linkedin.com"],[2],[2],[7]]
Output: [null,null,null,null,"facebook.com","google.com","facebook.com",null,"linkedin.com","google.com","leetcode.com"]
```

## 📝 Interview Tips

1. **visit() cắt bỏ lịch sử tương lai: `history = history.slice(0, idx+1)` rồi push / visit() truncates forward history before appending**
2. **back/forward chỉ cần clamp index — không xóa hay di chuyển phần tử / back/forward just clamp the index, no array modification**
3. **Two-stack approach: back=O(steps) vì phải di chuyển từng URL; array=O(1) back/forward / Array is O(1) back/forward vs O(steps) for two stacks**
4. **Phân biệt: `back(100)` trả về homepage chứ không lỗi / back(100) returns homepage (clamps), never throws**
5. **Doubly linked list: O(1) visit (no truncation copy) nhưng phức tạp hơn / Linked list avoids copy on visit but more code**

## Solutions

{% raw %}
/\*\*

- Solution 1 — Two Stacks (intuitive approach)
- visit O(1), back/forward O(steps) | Space: O(n)
  \*/
  class BrowserHistoryStacks {
  private back: string[] = [];
  private forward: string[] = [];
  private current: string;

constructor(homepage: string) { this.current = homepage; }

visit(url: string): void {
this.back.push(this.current);
this.forward = []; // clear forward history
this.current = url;
}

back_nav(steps: number): string {
const actual = Math.min(steps, this.back.length);
for (let i = 0; i < actual; i++) {
this.forward.push(this.current);
this.current = this.back.pop()!;
}
return this.current;
}

forward_nav(steps: number): string {
const actual = Math.min(steps, this.forward.length);
for (let i = 0; i < actual; i++) {
this.back.push(this.current);
this.current = this.forward.pop()!;
}
return this.current;
}
}

/\*\*

- Solution 2 — Array + Index Pointer ✅ Recommended
- All ops O(1) (back/forward is pointer move, not loop)
- Time: visit O(n) amortized (slice), back/forward O(1) | Space: O(n)
  \*/
  class BrowserHistory {
  private history: string[];
  private idx: number;

constructor(homepage: string) {
this.history = [homepage];
this.idx = 0;
}

visit(url: string): void {
this.history = this.history.slice(0, this.idx + 1);
this.history.push(url);
this.idx++;
}

back(steps: number): string {
this.idx = Math.max(0, this.idx - steps);
return this.history[this.idx];
}

forward(steps: number): string {
this.idx = Math.min(this.history.length - 1, this.idx + steps);
return this.history[this.idx];
}
}

// ── inline tests ──
// const bh = new BrowserHistory("leetcode.com");
// bh.visit("google.com"); bh.visit("facebook.com"); bh.visit("youtube.com");
// bh.back(1) // → "facebook.com"
// bh.back(1) // → "google.com"
// bh.forward(1) // → "facebook.com"
// bh.visit("linkedin.com"); bh.forward(2) // → "linkedin.com" (clamped)
// bh.back(7) // → "leetcode.com" (clamped at 0)
{% endraw %}

## 🔗 Related Problems

- [LC #622 Design Circular Queue](./07-design-circular-queue.md) — another fixed-state design problem
- [LC #1472 Design Browser History](https://leetcode.com/problems/design-browser-history/) — this problem
- [LC #155 Min Stack](https://leetcode.com/problems/min-stack/) — design with history/state tracking
- [LC #716 Max Stack](https://leetcode.com/problems/max-stack/) — bidirectional state tracking
