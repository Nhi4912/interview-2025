---
layout: page
title: "Destination City"
difficulty: Easy
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/destination-city"
---

# Destination City / Thành Phố Đích

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Set

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Trong mạng lưới đường một chiều, thành phố đích cuối cùng là thành phố không có chuyến đi nào khởi hành từ đó. Thu thập tất cả điểm xuất phát vào Set, rồi tìm điểm đến không nằm trong Set.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Destination City example:**

```
paths = [["London","New York"],["New York","Lima"],["Lima","Sao Paulo"]]

Sources = { "London", "New York", "Lima" }
Destinations = { "New York", "Lima", "Sao Paulo" }

"Sao Paulo" not in Sources → answer = "Sao Paulo"
```

**Key insight**: Collect all `cityA` (sources) into a Set. Find the one `cityB` (destination) not in that set.

---

## Problem Description

| #    | Problem                   | Difficulty | Pattern        |
| ---- | ------------------------- | ---------- | -------------- |
| 997  | Find the Town Judge       | 🟢 Easy    | Graph / Degree |
| 1791 | Find Center of Star Graph | 🟢 Easy    | Graph          |
| 277  | Find the Celebrity        | 🟡 Medium  | Graph          |
| 2360 | Longest Cycle in a Graph  | 🔴 Hard    | DFS            |

---

## 📝 Interview Tips

- 🔑 **EN**: Only source cities go into the Set — destinations are not added
  **VI**: Chỉ thêm thành phố xuất phát vào Set — thành phố đích không thêm vào
- 🔑 **EN**: There is exactly one valid answer guaranteed — stop at first match
  **VI**: Đề bảo đảm chính xác một đáp án — dừng ngay khi tìm thấy
- 🔑 **EN**: Two-pass: first build set of sources, then scan destinations
  **VI**: Hai lượt: lượt đầu xây Set nguồn, lượt hai duyệt đích
- 🔑 **EN**: One-pass alternative: add all sources, return destination with Set.has check
  **VI**: Cách một lượt: thêm mọi nguồn, trả về đích không có trong Set
- 🔑 **EN**: Time O(n), Space O(n) — optimal
  **VI**: Thời gian O(n), Không gian O(n) — tối ưu
- 🔑 **EN**: Edge: paths has only one entry → source of it is not the answer, its dest is
  **VI**: Trường hợp đặc biệt: paths chỉ có một phần tử → đích của nó là đáp án

---

```typescript
// ─── Solution 1: Hash Set — O(n) time, O(n) space ────────────────────────────
function destCity(paths: string[][]): string {
  const sources = new Set<string>();
  for (const [from] of paths) sources.add(from);

  for (const [, to] of paths) {
    if (!sources.has(to)) return to;
  }

  return ""; // guaranteed to find an answer
}

// Tests
console.log(
  destCity([
    ["London", "New York"],
    ["New York", "Lima"],
    ["Lima", "Sao Paulo"],
  ]),
);
// "Sao Paulo"
console.log(
  destCity([
    ["B", "C"],
    ["D", "B"],
    ["C", "A"],
  ]),
);
// "A"
console.log(destCity([["A", "Z"]]));
// "Z"
```

```typescript
// ─── Solution 2: One-Pass with Set — O(n) time ───────────────────────────────
function destCity2(paths: string[][]): string {
  const sources = new Set(paths.map(([from]) => from));
  // Find destination not in sources
  return paths.find(([, to]) => !sources.has(to))![1];
}

// Tests
console.log(
  destCity2([
    ["London", "New York"],
    ["New York", "Lima"],
    ["Lima", "Sao Paulo"],
  ]),
);
// "Sao Paulo"
console.log(
  destCity2([
    ["B", "C"],
    ["D", "B"],
    ["C", "A"],
  ]),
);
// "A"
```

```typescript
// ─── Solution 3: Map degree approach (in-degree / out-degree) ────────────────
function destCity3(paths: string[][]): string {
  // out-degree: cities that have outgoing paths
  // The destination city has out-degree = 0
  const outgoing = new Set(paths.map((p) => p[0]));
  const allDests = paths.map((p) => p[1]);
  return allDests.find((city) => !outgoing.has(city))!;
}

// Tests
console.log(
  destCity3([
    ["London", "New York"],
    ["New York", "Lima"],
    ["Lima", "Sao Paulo"],
  ]),
);
// "Sao Paulo"
```

---

---

## Solutions


---

## 🔗 Related Problems

| #    | Problem                   | Difficulty | Pattern        |
| ---- | ------------------------- | ---------- | -------------- |
| 997  | Find the Town Judge       | 🟢 Easy    | Graph / Degree |
| 1791 | Find Center of Star Graph | 🟢 Easy    | Graph          |
| 277  | Find the Celebrity        | 🟡 Medium  | Graph          |
| 2360 | Longest Cycle in a Graph  | 🔴 Hard    | DFS            |
