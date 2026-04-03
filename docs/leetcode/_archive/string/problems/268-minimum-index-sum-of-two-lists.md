---
layout: page
title: "Minimum Index Sum of Two Lists"
difficulty: Easy
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/minimum-index-sum-of-two-lists"
---

# Minimum Index Sum of Two Lists / Tổng Chỉ Số Nhỏ Nhất Từ Hai Danh Sách

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Table / Two List Intersection
> **Frequency**: 📘 Tier 2 — Gặp ở 6 companies
> **See also**: [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) | [Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hai người bạn đến thành phố mới và mỗi người có danh sách nhà hàng yêu thích theo thứ tự ưu tiên. Họ muốn ăn tối cùng nhau tại nhà hàng mà cả hai đều thích và có **tổng thứ hạng nhỏ nhất** (ưu tiên cao nhất cộng lại). Nếu hai người đều xếp hạng 1 một nhà hàng, đó rõ ràng là lựa chọn tốt nhất! Giải pháp: lưu chỉ số của list1 vào Map, rồi duyệt list2 — nếu trùng, tính tổng chỉ số và cập nhật nhỏ nhất. Tất cả các kết quả có cùng tổng nhỏ nhất đều được trả về.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Index Sum of Two Lists example:**

```
list1 = ["Shogun","Tapioca Express","Burger King","KFC"]
list2 = ["Piatti","The Grill at Torrey Pines","Hungry Hunter Steakhouse","Shogun"]

Map from list1: { "Shogun":0, "Tapioca Express":1, "Burger King":2, "KFC":3 }

Scan list2:
  j=0: "Piatti"                      → not in map
  j=1: "The Grill..."                → not in map
  j=2: "Hungry Hunter Steakhouse"    → not in map
  j=3: "Shogun"                      → in map! sum = 0+3 = 3 ← new min

minSum = 3, result = ["Shogun"]   ✓

Tie-breaking example:
list1=["a","b"],  list2=["b","a"]
  "b": 1+0=1  "a": 0+1=1  → both tied → ["b","a"] or ["a","b"]
```

---

## Problem Description

Given two string arrays `list1` and `list2`, return all strings that appear in both lists with the **minimum index sum** `i + j` (where `i` is index in `list1`, `j` in `list2`). Order doesn't matter.

**Example 1:** `list1 = ["Shogun","Tapioca Express","Burger King","KFC"], list2 = ["Piatti","The Grill at Torrey Pines","Hungry Hunter Steakhouse","Shogun"]` → `["Shogun"]`
**Example 2:** `list1 = ["Shogun","Tapioca Express"], list2 = ["Tapioca Express","Shogun"]` → `["Shogun","Tapioca Express"]` (both tied at sum 1)
**Example 3:** `list1 = ["happy"], list2 = ["sad"]` → `[]`

**Constraints:** `1 ≤ list1.length, list2.length ≤ 1000`, strings are unique within each list

---

## 📝 Interview Tips

- **Index map first** / Map chỉ số trước: Dùng Map với list1 (thường ngắn hơn) để O(1) lookup khi duyệt list2
- **Track minSum** / Theo dõi tổng nhỏ nhất: Reset result khi tìm sum nhỏ hơn, append khi bằng nhau
- **Không cần sắp xếp** / No sort needed: Đã có thứ tự từ list1 và list2, chỉ cần chọn theo min sum
- **Brute O(mn)** / Brute force: Nested loop — O(mn) space và time, không cần thiết
- **Dừng sớm khi có thể** / Early exit: Nếu tìm được sum=0 (cả hai ở index 0), dừng ngay
- **Guaranteed answer** / Luôn có đáp án: Constraints đảm bảo "answer exists" (có ít nhất một chung)... actually đề có thể return empty nếu không chung

---

## Solutions

```typescript
/**
 * @complexity Time: O(m·n) | Space: O(1) extra
 * Nested loops checking every pair
 */
function findRestaurantBrute(list1: string[], list2: string[]): string[] {
  let minSum = Infinity;
  const result: string[] = [];
  for (let i = 0; i < list1.length; i++) {
    for (let j = 0; j < list2.length; j++) {
      if (list1[i] === list2[j]) {
        const sum = i + j;
        if (sum < minSum) {
          minSum = sum;
          result.length = 0;
          result.push(list1[i]);
        } else if (sum === minSum) result.push(list1[i]);
      }
    }
  }
  return result;
}

/**
 * @complexity Time: O(m+n) | Space: O(m)
 * Index list1 into Map, scan list2 for matches, track minimum sum
 */
function findRestaurant(list1: string[], list2: string[]): string[] {
  const indexMap = new Map<string, number>();
  for (let i = 0; i < list1.length; i++) indexMap.set(list1[i], i);

  let minSum = Infinity;
  let result: string[] = [];
  for (let j = 0; j < list2.length; j++) {
    const i = indexMap.get(list2[j]);
    if (i !== undefined) {
      const sum = i + j;
      if (sum < minSum) {
        minSum = sum;
        result = [list2[j]];
      } else if (sum === minSum) result.push(list2[j]);
    }
  }
  return result;
}

/**
 * @complexity Time: O(m+n) | Space: O(m+n)
 * Build both index maps, find intersection, sort by index sum
 */
function findRestaurantSorted(list1: string[], list2: string[]): string[] {
  const map1 = new Map(list1.map((s, i) => [s, i]));
  const map2 = new Map(list2.map((s, i) => [s, i]));

  let minSum = Infinity;
  const candidates: Array<[string, number]> = [];
  for (const [s, i] of map1) {
    const j = map2.get(s);
    if (j !== undefined) candidates.push([s, i + j]);
  }
  for (const [, sum] of candidates) minSum = Math.min(minSum, sum);
  return candidates.filter(([, sum]) => sum === minSum).map(([s]) => s);
}

// === Test Cases ===
console.log(
  findRestaurantBrute(
    ["Shogun", "Tapioca Express", "Burger King", "KFC"],
    ["Piatti", "The Grill at Torrey Pines", "Hungry Hunter Steakhouse", "Shogun"],
  ),
); // → ["Shogun"]

console.log(findRestaurant(["Shogun", "Tapioca Express"], ["Tapioca Express", "Shogun"])); // → ["Shogun","Tapioca Express"]  (both sum=1)

console.log(findRestaurant(["happy"], ["sad"])); // → []
console.log(findRestaurantSorted(["a", "b"], ["b", "a"])); // → ["a","b"] or ["b","a"]
```

---

## 🔗 Related Problems

| Problem                       | Difficulty | Link                                                                  |
| ----------------------------- | ---------- | --------------------------------------------------------------------- |
| Intersection of Two Arrays    | Easy       | [LC 349](https://leetcode.com/problems/intersection-of-two-arrays)    |
| Intersection of Two Arrays II | Easy       | [LC 350](https://leetcode.com/problems/intersection-of-two-arrays-ii) |
| Two Sum                       | Easy       | [LC 1](https://leetcode.com/problems/two-sum)                         |
