---
layout: page
title: "Zuma Game"
difficulty: Hard
category: Tree-Graph
tags: [String, Dynamic Programming, Stack, Breadth-First Search, Memoization]
leetcode_url: "https://leetcode.com/problems/zuma-game"
---

# Zuma Game / Trò Chơi Zuma

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Trò Zuma: chèn bi vào bảng để tạo nhóm 3+ bi cùng màu liên tiếp, nhóm đó tự xóa (cascade). Tìm số bi tối thiểu cần dùng. Ý tưởng: DFS/BFS trên trạng thái bảng với memoization. Mỗi bước: chọn vị trí và màu bi chèn vào, collapse bảng, đệ quy.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Zuma Game example:**

```
board="RBYYBBRRB" hand="YRBGB"
Try insert Y at position 3 (before YY → YYY):
  board="RBYYYBBRRB" → collapse → "RBBBRRB" → collapse → "RRRB"→"B"
  Need 1 more R → insert R → "RRR"+"B" → collapse → "B" → need 2 more...
Key: merge adjacent same-color groups to reduce state space
```

---

---

## Problem Description

| Problem                                                              | Difficulty | Key Idea                       |
| -------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Remove Boxes 546](https://leetcode.com/problems/remove-boxes)       | Hard       | Interval DP with group merging |
| [Strange Printer 664](https://leetcode.com/problems/strange-printer) | Hard       | Interval DP                    |
| [Burst Balloons 312](https://leetcode.com/problems/burst-balloons)   | Hard       | Interval DP                    |
| [Word Ladder 127](https://leetcode.com/problems/word-ladder)         | Hard       | BFS on state space             |

---

## 📝 Interview Tips

- 🔑 **EN:** Collapse board after each insertion (remove 3+ consecutive same color) | **VI:** Sau mỗi lần chèn, xóa liên tiếp 3+ cùng màu
- 🔑 **EN:** Memoize on (board_state, hand_remaining) as string key | **VI:** Memo theo (trạng thái bảng, tay còn lại)
- 🔑 **EN:** Key optimization: only insert at start of each group of same color | **VI:** Chỉ chèn vào đầu mỗi nhóm màu giống nhau
- 🔑 **EN:** Count needed balls per group: group of 1 needs 2 more, group of 2 needs 1 more | **VI:** Nhóm 1 cần 2 bi, nhóm 2 cần 1 bi thêm
- 🔑 **EN:** Return -1 if impossible (hand insufficient) | **VI:** Trả -1 nếu không thể xóa hết
- 🔑 **EN:** Worst case board length ≤ 16, hand ≤ 5 → state space manageable | **VI:** Board ≤ 16, hand ≤ 5 → state space đủ nhỏ

---

---

## Solutions

```typescript
/**
 * DFS with Memoization — insert balls to clear board
 * Time: O(board_states * hand_size) — exponential but bounded by small input
 * Space: O(states) for memo cache
 */
function findMinStep(board: string, hand: string): number {
  // Count available balls in hand
  const handCount = new Array(26).fill(0);
  for (const ch of hand) handCount[ch.charCodeAt(0) - 65]++;

  // Collapse: remove 3+ consecutive same-color groups repeatedly
  const collapse = (s: string): string => {
    let changed = true;
    while (changed) {
      changed = false;
      let i = 0;
      while (i < s.length) {
        let j = i;
        while (j < s.length && s[j] === s[i]) j++;
        if (j - i >= 3) {
          s = s.slice(0, i) + s.slice(j);
          changed = true;
          break;
        }
        i = j;
      }
    }
    return s;
  };

  const memo = new Map<string, number>();

  const dfs = (b: string, h: number[]): number => {
    if (b.length === 0) return 0;
    const key = b + "|" + h.join(",");
    if (memo.has(key)) return memo.get(key)!;

    let ans = Infinity;
    let i = 0;
    while (i < b.length) {
      // Find end of current group
      let j = i;
      while (j < b.length && b[j] === b[i]) j++;

      const color = b.charCodeAt(i) - 65;
      const groupLen = j - i;
      const need = 3 - groupLen; // balls needed to complete this group

      if (h[color] >= need) {
        h[color] -= need;
        const newBoard = collapse(b.slice(0, i) + b.slice(j));
        const sub = dfs(newBoard, h);
        if (sub !== -1) ans = Math.min(ans, sub + need);
        h[color] += need;
      }

      i = j;
    }

    const result = ans === Infinity ? -1 : ans;
    memo.set(key, result);
    return result;
  };

  return dfs(board, handCount);
}

// Test cases
console.log(findMinStep("WRRBBW", "RB")); // -1
console.log(findMinStep("WWRRBBWW", "WRBRW")); // 2
console.log(findMinStep("G", "GGGGG")); // 2
console.log(findMinStep("RBYYBBRRB", "YRBGB")); // 3

/**
 * BFS approach — explore all possible insertion states level by level
 * Time: O(B! * H!) bounded — practical with deduplication
 * Space: O(states) for visited set
 */
function findMinStepBFS(board: string, hand: string): number {
  const collapse = (s: string): string => {
    let prev = "";
    while (prev !== s) {
      prev = s;
      s = s.replace(/(.)\1\1+/g, "");
    }
    return s;
  };

  const sortedHand = hand.split("").sort().join("");
  const queue: Array<[string, string, number]> = [[board, sortedHand, 0]];
  const visited = new Set<string>([board + "|" + sortedHand]);

  while (queue.length > 0) {
    const [b, h, steps] = queue.shift()!;
    if (b.length === 0) return steps;

    // Try inserting each unique hand ball at each group position
    const usedColors = new Set<string>();
    let i = 0;
    while (i < b.length) {
      let j = i;
      while (j < b.length && b[j] === b[i]) j++;

      for (let hi = 0; hi < h.length; hi++) {
        if (hi > 0 && h[hi] === h[hi - 1]) continue; // skip duplicate hand balls
        const hIdx = h.indexOf(b[i]); // only insert matching color
        if (hIdx === -1) {
          i = j;
          continue;
        }

        const newH = h.slice(0, hIdx) + h.slice(hIdx + 1);
        const newB = collapse(b.slice(0, i) + b[i] + b.slice(i));
        const key = newB + "|" + newH;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([newB, newH, steps + 1]);
        }
        break;
      }
      i = j;
    }
  }
  return -1;
}

console.log(findMinStepBFS("WWRRBBWW", "WRBRW")); // 2
```

---

## 🔗 Related Problems

| Problem                                                              | Difficulty | Key Idea                       |
| -------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Remove Boxes 546](https://leetcode.com/problems/remove-boxes)       | Hard       | Interval DP with group merging |
| [Strange Printer 664](https://leetcode.com/problems/strange-printer) | Hard       | Interval DP                    |
| [Burst Balloons 312](https://leetcode.com/problems/burst-balloons)   | Hard       | Interval DP                    |
| [Word Ladder 127](https://leetcode.com/problems/word-ladder)         | Hard       | BFS on state space             |
