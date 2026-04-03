---
layout: page
title: "Find All Possible Recipes from Given Supplies"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, String, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies"
---

# Find All Possible Recipes from Given Supplies / Tìm Tất Cả Công Thức Có Thể Nấu Được

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Topological Sort
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống sắp xếp thứ tự học môn — môn Giải Tích phải học trước Vật Lý. Khi bạn đã "có" một nguyên liệu (từ supplies hoặc từ công thức đã nấu được), thì nó mở ra các công thức khác cần nó. Topological Sort (BFS/Kahn) xử lý đúng thứ tự phụ thuộc này.

**Pattern Recognition:**

- Ingredient → Recipe dependencies = directed graph (ingredient → recipe)
- Recipes can also be ingredients → DAG with layers
- BFS Kahn's algorithm: process nodes with in-degree 0 first

**Visual:**

```
supplies = ["yeast","flour","sugar"]
recipes  = ["bread","sandwich","burger"]
ingredients = [["yeast","flour"],["bread","sugar"],["sandwich","yeast"]]

Graph (ingredient → recipe):
yeast   → bread, burger
flour   → bread
sugar   → sandwich
bread   → sandwich
sandwich → burger

in-degree: bread=2, sandwich=2, burger=2
Queue: [yeast, flour, sugar] (from supplies, in-degree implicitly 0)
Process yeast  → bread(-1), burger(-1) → bread=1, burger=1
Process flour  → bread(-1) → bread=0 → add bread ✓
Process sugar  → sandwich(-1) → sandwich=1
Process bread  → sandwich(-1) → sandwich=0 → add sandwich ✓
Process sandwich → burger(-1) → burger=0 → add burger ✓
Result: ["bread","sandwich","burger"]
```

## Problem Description

You have `n` recipes, each requiring a list of ingredients. Some ingredients come from `supplies` (always available), others must be recipes you can make. Return all recipes you can actually make. A recipe can be used as an ingredient for another recipe.

**Example 1:** `recipes=["bread"]`, `ingredients=[["yeast","flour"]]`, `supplies=["yeast","flour","corn"]` → `["bread"]`
**Example 2:** `recipes=["bread","sandwich"]`, `ingredients=[["yeast","flour"],["bread","butter"]]`, `supplies=["yeast","flour","butter"]` → `["bread","sandwich"]`

**Constraints:** `n == recipes.length == ingredients.length`, `1 <= n <= 100`, `1 <= ingredients[i].length, supplies.length <= 100`

## 📝 Interview Tips

1. **Clarify**: Công thức có thể vừa là nguyên liệu vừa là output không? (Có!) / Can recipes be used as ingredients? Yes, that's the key twist.
2. **Approach**: Dùng Kahn's BFS — thêm supplies vào queue đầu tiên, giảm in-degree khi "có" ingredient / Use BFS Kahn's starting from supplies.
3. **Edge cases**: Circular dependency (recipe A cần recipe B cần A) → sẽ không bao giờ có in-degree=0, nên không thêm vào result / Circular deps never get added.
4. **Optimize**: Dùng Map để in-degree và adjacency nhanh O(1) / Use Map for O(1) lookups.
5. **Test**: Thử recipe dùng recipe khác làm nguyên liệu / Test recipe-as-ingredient chain.
6. **Follow-up**: Nếu muốn tìm thứ tự nấu? (topo sort order) / What if we need the cooking order?

## Solutions

```typescript
/** Solution 1: BFS Topological Sort (Kahn's Algorithm) — Optimal
 * Time: O(V + E) | Space: O(V + E)
 */
function findAllRecipes(recipes: string[], ingredients: string[][], supplies: string[]): string[] {
  const inDegree = new Map<string, number>();
  const graph = new Map<string, string[]>(); // ingredient → recipes that need it

  const recipeSet = new Set(recipes);

  // Build graph
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    inDegree.set(recipe, ingredients[i].length);
    for (const ing of ingredients[i]) {
      if (!graph.has(ing)) graph.set(ing, []);
      graph.get(ing)!.push(recipe);
    }
  }

  // Start BFS with available supplies
  const queue: string[] = [...supplies];
  const result: string[] = [];

  while (queue.length > 0) {
    const item = queue.shift()!;
    // If this item is a recipe, we can make it
    if (recipeSet.has(item)) result.push(item);
    // Unlock recipes that depend on this item
    for (const dependent of graph.get(item) ?? []) {
      const deg = (inDegree.get(dependent) ?? 0) - 1;
      inDegree.set(dependent, deg);
      if (deg === 0) queue.push(dependent);
    }
  }

  return result;
}

/** Solution 2: DFS with memoization
 * Time: O(V + E) | Space: O(V)
 */
function findAllRecipesDFS(
  recipes: string[],
  ingredients: string[][],
  supplies: string[],
): string[] {
  const supplySet = new Set(supplies);
  const recipeMap = new Map<string, string[]>();
  for (let i = 0; i < recipes.length; i++) {
    recipeMap.set(recipes[i], ingredients[i]);
  }
  // 0=unknown, 1=making(cycle), 2=can make, 3=cannot
  const state = new Map<string, number>();

  function canMake(item: string): boolean {
    if (supplySet.has(item)) return true;
    if (!recipeMap.has(item)) return false;
    if (state.get(item) === 2) return true;
    if (state.get(item) === 1 || state.get(item) === 3) return false;
    state.set(item, 1); // visiting
    for (const ing of recipeMap.get(item)!) {
      if (!canMake(ing)) {
        state.set(item, 3);
        return false;
      }
    }
    state.set(item, 2);
    return true;
  }

  return recipes.filter((r) => canMake(r));
}

// Test cases
console.log(findAllRecipes(["bread"], [["yeast", "flour"]], ["yeast", "flour", "corn"])); // ["bread"]

console.log(
  findAllRecipes(
    ["bread", "sandwich", "burger"],
    [
      ["yeast", "flour"],
      ["bread", "sugar"],
      ["sandwich", "yeast", "flour"],
    ],
    ["yeast", "flour", "sugar"],
  ),
); // ["bread","sandwich","burger"]

console.log(findAllRecipesDFS(["bread"], [["yeast", "flour"]], ["yeast", "flour", "corn"])); // ["bread"]
```

## 🔗 Related Problems

| Problem                                                                                                                          | Relationship                                 |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [Course Schedule II](https://leetcode.com/problems/course-schedule-ii)                                                           | Topological sort, cùng cấu trúc dependencies |
| [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) | Topo sort trên cây                           |
| [Parallel Courses](https://leetcode.com/problems/parallel-courses)                                                               | Kahn's BFS để xử lý prerequisites            |
