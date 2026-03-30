---
layout: page
title: "Alien Dictionary"
difficulty: Hard
category: Tree/Graph
tags: [Tree/Graph, Hash Table, Topological Sort, BFS, DFS]
leetcode_url: "https://leetcode.com/problems/alien-dictionary/"
---

# Alien Dictionary / Từ Điển Ngôn Ngữ Ngoài Hành Tinh

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort (DAG)
> **Frequency**: 📘 Tier 1 — Top FAANG Hard, xuất hiện thường xuyên tại Google/Meta/Amazon vòng senior
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule/) | [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như xếp lịch môn học có tiên quyết — từ danh sách từ đã sắp xếp ta suy ra quy tắc "chữ A phải đứng trước chữ B". Xây đồ thị có hướng từ các quy tắc đó, sau đó sắp xếp topo. Nếu có vòng tròn (A→B→A), thì không có thứ tự hợp lệ → trả về `""`.

**Pattern Recognition:**

- Signal: "dictionary sorted lexicographically in alien language" → **build DAG from adjacent word comparisons → topological sort**
- So sánh từng cặp từ liền kề: tìm ký tự đầu tiên khác nhau → đó là cạnh có hướng `char1 → char2`
- Invalid case: nếu `word1` là tiền tố của `word2` nhưng `word1.length > word2.length` → return `""`

**Visual — Xây đồ thị từ ["wrt","wrf","er","ett","rftt"]:**

```
Compare adjacent words → find first differing char:
  "wrt" vs "wrf" → t ≠ f  →  t → f
  "wrf" vs "er"  → w ≠ e  →  w → e
  "er"  vs "ett" → r ≠ t  →  r → t
  "ett" vs "rftt"→ e ≠ r  →  e → r

DAG:   t → f
       w → e → r → t → f
             ↑
       (e → r already in chain)

Topological order: w → e → r → t → f  →  "wertf" ✅
```

---

## Problem Description

Given a list of `words` sorted lexicographically by an unknown alien alphabet, return a string of unique letters in the alien alphabet in lexicographic order. Return `""` if no valid ordering exists (cycle), or if the input is invalid.

```
Example 1: words = ["wrt","wrf","er","ett","rftt"]  → "wertf"
Example 2: words = ["z","x"]                         → "zx"
Example 3: words = ["z","x","z"]                     → ""  (cycle: z→x→z)
Example 4: words = ["abc","ab"]                      → ""  (invalid: longer word is prefix)
```

---

## 📝 Interview Tips

1. **Break into steps**: (1) extract ordering constraints, (2) build graph, (3) topo sort, (4) validate — announce each step before coding.
2. **Invalid prefix check**: `if word1.startsWith(word2) && word1.length > word2.length → return ""` — easy miss under pressure.
3. **Only first difference matters**: So sánh từng cặp từ chỉ lấy ký tự đầu tiên khác nhau, bỏ qua các ký tự sau.
4. **Cycle detection**: DFS với 3 màu (WHITE/GRAY/BLACK) hoặc Kahn's: nếu kết quả chứa ít hơn `totalChars` ký tự → có cycle.
5. **Kahn's vs DFS**: Kahn's (BFS) dễ giải thích hơn trong interview. DFS + color cần thêm bookkeeping nhưng intuitive.
6. **Time/Space**: O(C) where C = total characters across all words — bounded by input size, not just unique chars.

---

## Solutions

{% raw %}
// Solution 1: Kahn's Algorithm — BFS Topological Sort (Interview preferred)
// Time: O(C) — C = total chars across all words (graph build + BFS)
// Space: O(U + E) — U = unique chars, E = ordering edges
function alienOrder(words: string[]): string {
const graph = new Map<string, Set<string>>();
const inDegree = new Map<string, number>();

// Initialize all characters with in-degree 0
for (const word of words) {
for (const ch of word) {
if (!graph.has(ch)) { graph.set(ch, new Set()); inDegree.set(ch, 0); }
}
}

// Build directed graph from adjacent word comparisons
for (let i = 0; i < words.length - 1; i++) {
const w1 = words[i], w2 = words[i + 1];
if (w1.length > w2.length && w1.startsWith(w2)) return ""; // invalid prefix
for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
if (w1[j] !== w2[j]) {
if (!graph.get(w1[j])!.has(w2[j])) {
graph.get(w1[j])!.add(w2[j]);
inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
}
break; // only first difference matters
}
}
}

// Kahn's BFS: start from nodes with in-degree 0
const queue: string[] = [];
for (const [ch, deg] of inDegree) if (deg === 0) queue.push(ch);
const result: string[] = [];
while (queue.length > 0) {
const ch = queue.shift()!;
result.push(ch);
for (const neighbor of graph.get(ch)!) {
inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
if (inDegree.get(neighbor) === 0) queue.push(neighbor);
}
}

return result.length === graph.size ? result.join("") : ""; // cycle if not all processed
}

// Solution 2: DFS Topological Sort with 3-Color Cycle Detection
// Time: O(C) — each node/edge visited once
// Space: O(U + E) — graph + color map + recursion stack
function alienOrderDFS(words: string[]): string {
const graph = new Map<string, string[]>();
const inDeg = new Map<string, number>();

for (const word of words)
for (const ch of word) if (!graph.has(ch)) { graph.set(ch, []); inDeg.set(ch, 0); }

for (let i = 0; i < words.length - 1; i++) {
const w1 = words[i], w2 = words[i + 1];
if (w1.length > w2.length && w1.startsWith(w2)) return "";
for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
if (w1[j] !== w2[j]) { graph.get(w1[j])!.push(w2[j]); break; }
}
}

const WHITE = 0, GRAY = 1, BLACK = 2;
const color = new Map<string, number>();
for (const ch of graph.keys()) color.set(ch, WHITE);
const result: string[] = [];

function dfs(ch: string): boolean {
if (color.get(ch) === GRAY) return false; // cycle!
if (color.get(ch) === BLACK) return true;
color.set(ch, GRAY);
for (const nb of graph.get(ch)!) if (!dfs(nb)) return false;
color.set(ch, BLACK);
result.push(ch);
return true;
}

for (const ch of graph.keys()) if (color.get(ch) === WHITE && !dfs(ch)) return "";
return result.reverse().join("");
}

// === Test Cases ===
console.log(alienOrder(["wrt","wrf","er","ett","rftt"])); // "wertf" ✅
console.log(alienOrder(["z","x"])); // "zx" ✅
console.log(alienOrder(["z","x","z"])); // "" ✅ (cycle)
console.log(alienOrder(["abc","ab"])); // "" ✅ (invalid prefix)
{% endraw %}

---

## 🔗 Related Problems

- [Course Schedule](https://leetcode.com/problems/course-schedule/) — same Kahn's / DFS topo sort pattern, cycle detection in DAG
- [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) — return topological order (same structure as alien dictionary)
- [Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction/) — verify unique topo order from sequences
- [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/) — graph + topological-style layer peeling from leaves
- [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/) — topological sort with multi-source dependencies
