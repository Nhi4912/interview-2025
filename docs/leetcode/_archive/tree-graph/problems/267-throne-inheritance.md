---
layout: page
title: "Throne Inheritance"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Design]
leetcode_url: "https://leetcode.com/problems/throne-inheritance"
---

# Throne Inheritance / Kế Vị Ngai Vàng

> **Track**: Tree-Graph | **Difficulty**: 🟡 Medium | **Pattern**: N-ary Tree DFS Design — HashMap + Dead Set
> **Frequency**: 📘 Tier 3 — Gặp ở Amazon, Facebook (OOP design + DFS)
> **See also**: [1490 Clone N-ary Tree](https://leetcode.com/problems/clone-n-ary-tree) | [428 Serialize and Deserialize N-ary Tree](https://leetcode.com/problems/serialize-and-deserialize-n-ary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng cung điện hoàng gia: nhà vua có con cái, mỗi đứa con cũng có con của mình — tạo thành cây phả hệ (N-ary tree). Thứ tự kế vị = duyệt tiền thứ tự (preorder): vua trước, rồi con trưởng và tất cả dòng dõi của con trưởng, rồi con thứ... Khi ai đó qua đời, không xóa khỏi cây (vì sẽ ảnh hưởng cấu trúc) mà chỉ đánh dấu "đã mất" rồi bỏ qua khi liệt kê thứ tự kế vị — như tên trong danh sách vẫn còn nhưng bị gạch chân.

**Pattern Recognition:**

- Signal: "dynamic tree, birth/death events, preorder traversal skipping dead" → **N-ary Tree DFS + HashSet dead**
- Bài này thuộc dạng OOP design kết hợp DFS trên cây N-nhánh
- Key insight: `children = HashMap<name, List<name>>` cho cây; `dead = Set<name>` cho người đã mất; `getInheritanceOrder()` = DFS preorder, bỏ qua dead

**Visual — N-ary tree DFS preorder:**

```
Kingdom: king "king", children: [A, B]
A has children: [C, D]
B has children: [E]
Dead: {C}

Tree:
    king
   /    \
  A      B
 / \      \
C   D      E

getInheritanceOrder():
  DFS preorder from king:
  king (alive) → add "king"
  → child A (alive) → add "A"
    → child C (dead) → skip
    → child D (alive) → add "D"
  → child B (alive) → add "B"
    → child E (alive) → add "E"

Result: ["king", "A", "D", "B", "E"]
```

---

## Problem Description

Implement the `ThroneInheritance` class for a kingdom with one king. Support `birth(parent, child)` — add child to parent, `death(name)` — mark as dead, and `getInheritanceOrder()` — return preorder traversal of the family tree skipping dead members. ([LeetCode](https://leetcode.com/problems/throne-inheritance))

```
Example:
  new ThroneInheritance("king")
  birth("king","andy"); birth("king","bob"); birth("king","catherine")
  birth("andy","matthew"); birth("bob","alex"); birth("bob","asha")
  getInheritanceOrder() → ["king","andy","matthew","bob","alex","asha","catherine"]
  death("bob")
  getInheritanceOrder() → ["king","andy","matthew","alex","asha","catherine"]
```

Constraints: 1 ≤ calls ≤ 10⁵; names are unique strings.

---

## 📝 Interview Tips

1. **Use HashMap<string, string[]> for children — insertion order matters** — _Dùng Map lưu danh sách con — thứ tự thêm vào = thứ tự kế vị_
2. **Use Set<string> for dead — O(1) lookup** — _Set cho người đã chết — tra cứu O(1), không xóa khỏi cây_
3. **getInheritanceOrder: DFS preorder, push to result only if not in dead set** — _getInheritanceOrder: DFS tiền thứ tự, chỉ thêm vào kết quả nếu còn sống_
4. **Don't delete from tree on death — just mark dead** — _Không xóa khỏi cây khi chết — chỉ đánh dấu — giúp cấu trúc cây bất biến_
5. **birth() is O(1); death() is O(1); getInheritanceOrder() is O(n)** — _birth/death O(1), getOrder O(n) — phân tích độ phức tạp cho interviewer_
6. **Iterative DFS to avoid stack overflow on deep recursion** — _Dùng DFS lặp (stack) nếu cây có thể sâu — tránh stack overflow đệ quy_

---

## Solutions

```typescript
/** Solution 1: HashMap children + Set dead + recursive DFS
 * @complexity birth: O(1) | death: O(1) | getOrder: O(n) */
class ThroneInheritance {
  private king: string;
  private children: Map<string, string[]>;
  private dead: Set<string>;

  constructor(kingName: string) {
    this.king = kingName;
    this.children = new Map([[kingName, []]]);
    this.dead = new Set();
  }

  birth(parentName: string, childName: string): void {
    if (!this.children.has(parentName)) this.children.set(parentName, []);
    this.children.get(parentName)!.push(childName);
    this.children.set(childName, []);
  }

  death(name: string): void {
    this.dead.add(name);
  }

  getInheritanceOrder(): string[] {
    const result: string[] = [];
    const dfs = (name: string): void => {
      if (!this.dead.has(name)) result.push(name);
      for (const child of this.children.get(name) ?? []) {
        dfs(child);
      }
    };
    dfs(this.king);
    return result;
  }
}

/** Solution 2: Same but iterative DFS to avoid deep recursion
 * @complexity birth: O(1) | death: O(1) | getOrder: O(n) */
class ThroneInheritance2 {
  private king: string;
  private children: Map<string, string[]> = new Map();
  private dead: Set<string> = new Set();

  constructor(kingName: string) {
    this.king = kingName;
    this.children.set(kingName, []);
  }

  birth(parentName: string, childName: string): void {
    if (!this.children.has(parentName)) this.children.set(parentName, []);
    this.children.get(parentName)!.push(childName);
    this.children.set(childName, []);
  }

  death(name: string): void {
    this.dead.add(name);
  }

  getInheritanceOrder(): string[] {
    const result: string[] = [];
    // Iterative preorder DFS
    const stack: string[] = [this.king];
    while (stack.length) {
      const name = stack.pop()!;
      if (!this.dead.has(name)) result.push(name);
      const kids = this.children.get(name) ?? [];
      // Push in reverse so first child is processed first
      for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
    }
    return result;
  }
}

// === Test Cases ===
const t = new ThroneInheritance("king");
t.birth("king", "andy");
t.birth("king", "bob");
t.birth("king", "catherine");
t.birth("andy", "matthew");
t.birth("bob", "alex");
t.birth("bob", "asha");
console.log(t.getInheritanceOrder()); // ["king","andy","matthew","bob","alex","asha","catherine"]
t.death("bob");
console.log(t.getInheritanceOrder()); // ["king","andy","matthew","alex","asha","catherine"]

const t2 = new ThroneInheritance2("king");
t2.birth("king", "andy");
t2.birth("king", "bob");
t2.death("andy");
console.log(t2.getInheritanceOrder()); // ["king","bob"]
```

---

## 🔗 Related Problems

| #    | Problem                          | Difficulty | Pattern                |
| ---- | -------------------------------- | ---------- | ---------------------- |
| 1490 | Clone N-ary Tree                 | Medium     | DFS on N-ary           |
| 1506 | Find Root of N-Ary Tree          | Medium     | Bit manipulation / DFS |
| 559  | Maximum Depth of N-ary Tree      | Easy       | DFS                    |
| 429  | N-ary Tree Level Order Traversal | Medium     | BFS                    |
