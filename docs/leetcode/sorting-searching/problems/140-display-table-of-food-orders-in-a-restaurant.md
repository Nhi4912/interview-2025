---
layout: page
title: "Display Table of Food Orders in a Restaurant"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Sorting, Ordered Set]
leetcode_url: "https://leetcode.com/problems/display-table-of-food-orders-in-a-restaurant"
---

# Display Table of Food Orders in a Restaurant / Bảng Hiển Thị Đơn Đặt Món Ở Nhà Hàng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map + Sort

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Bạn là quản lý nhà hàng và cần lập bảng thống kê: hàng là số bàn (tăng dần), cột là tên món ăn (alphabet), ô là số lần bàn đó gọi món đó. Dùng Map lồng Map: `table → (food → count)`, sau đó thu thập tất cả tên món và bàn, sắp xếp, build bảng.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Display Table of Food Orders in a Restaurant example:**

```
orders = [["David","3","Ceviche"],["Corina","10","Beef Burrito"],
          ["David","3","Fried Chicken"],["Carla","5","Water"],
          ["Carla","5","Ceviche"],["Rous","3","Ceviche"]]

foods (sorted): [Beef Burrito, Ceviche, Fried Chicken, Water]
tables (sorted): [3, 5, 10]

Result:
  header: ["Table","Beef Burrito","Ceviche","Fried Chicken","Water"]
  row 3:  ["3","0","3","1","0"]
  row 5:  ["5","0","1","0","1"]
  row 10: ["10","1","0","0","0"]
```

---

## Problem Description

| #    | Problem                                      | Pattern         |
| ---- | -------------------------------------------- | --------------- |
| 1418 | Display Table of Food Orders in a Restaurant | This problem    |
| 350  | Intersection of Two Arrays II                | Hash Map        |
| 692  | Top K Frequent Words                         | Hash Map + Sort |
| 49   | Group Anagrams                               | Hash Map + Sort |

---

## 📝 Interview Tips

- 🔑 **Two sets** / Thu thập tập hợp tên món và số bàn riêng để sort chúng
- 🔑 **Nested Map** / `tableMap: Map<number, Map<string, number>>` — bàn → món → số lượng
- 🔑 **Sort foods alphabetically** / Tên món sắp xếp lexicographic
- 🔑 **Sort tables numerically** / Số bàn sắp xếp theo số (không phải string)
- 🔑 **Header row** / Hàng đầu = `["Table", ...sortedFoods]`
- 🔑 **Default 0** / Nếu bàn chưa gọi món đó, điền "0"

---

## Solutions

```typescript
// ─── Solution 1: Hash Map — O(n log n) ───
function displayTable(orders: string[][]): string[][] {
  const tableMap = new Map<number, Map<string, number>>();
  const foodSet = new Set<string>();
  const tableSet = new Set<number>();

  for (const [, tableStr, food] of orders) {
    const table = parseInt(tableStr);
    tableSet.add(table);
    foodSet.add(food);
    if (!tableMap.has(table)) tableMap.set(table, new Map());
    const foodMap = tableMap.get(table)!;
    foodMap.set(food, (foodMap.get(food) ?? 0) + 1);
  }

  const foods = [...foodSet].sort();
  const tables = [...tableSet].sort((a, b) => a - b);

  // Build result: header + one row per table
  const result: string[][] = [["Table", ...foods]];

  for (const table of tables) {
    const foodMap = tableMap.get(table)!;
    const row: string[] = [String(table)];
    for (const food of foods) {
      row.push(String(foodMap.get(food) ?? 0));
    }
    result.push(row);
  }

  return result;
}

const orders1 = [
  ["David", "3", "Ceviche"],
  ["Corina", "10", "Beef Burrito"],
  ["David", "3", "Fried Chicken"],
  ["Carla", "5", "Water"],
  ["Carla", "5", "Ceviche"],
  ["Rous", "3", "Ceviche"],
];
console.log(displayTable(orders1));
// [["Table","Beef Burrito","Ceviche","Fried Chicken","Water"],
//  ["3","0","3","1","0"],["5","0","1","0","1"],["10","1","0","0","0"]]

const orders2 = [
  ["James", "12", "Fried Chicken"],
  ["Ratesh", "12", "Fried Chicken"],
  ["Amadeus", "12", "Fried Chicken"],
  ["Adam", "1", "Canadian Waffles"],
  ["Brianna", "1", "Canadian Waffles"],
];
console.log(displayTable(orders2));
// [["Table","Canadian Waffles","Fried Chicken"],["1","2","0"],["12","0","3"]]

// ─── Solution 2: Using object instead of Map (slightly simpler) ───
function displayTableV2(orders: string[][]): string[][] {
  const grid: Record<number, Record<string, number>> = {};
  const foods = new Set<string>();
  const tables = new Set<number>();

  for (const [, t, food] of orders) {
    const table = +t;
    tables.add(table);
    foods.add(food);
    grid[table] ??= {};
    grid[table][food] = (grid[table][food] ?? 0) + 1;
  }

  const sortedFoods = [...foods].sort();
  const sortedTables = [...tables].sort((a, b) => a - b);
  const result: string[][] = [["Table", ...sortedFoods]];

  for (const table of sortedTables) {
    result.push([String(table), ...sortedFoods.map((f) => String(grid[table][f] ?? 0))]);
  }
  return result;
}

console.log(displayTableV2(orders2));
```

---

## 🔗 Related Problems

| #    | Problem                                      | Pattern         |
| ---- | -------------------------------------------- | --------------- |
| 1418 | Display Table of Food Orders in a Restaurant | This problem    |
| 350  | Intersection of Two Arrays II                | Hash Map        |
| 692  | Top K Frequent Words                         | Hash Map + Sort |
| 49   | Group Anagrams                               | Hash Map + Sort |
