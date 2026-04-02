---
layout: page
title: "People Whose List of Favorite Companies Is Not a Subset of Another List"
difficulty: Medium
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/people-whose-list-of-favorite-companies-is-not-a-subset-of-another-list"
---

# People Whose List of Favorite Companies Is Not a Subset of Another List / Người Có Danh Sách Không Phải Tập Con

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài toán giống như **kiểm tra thành viên CLB**: nếu CLB A có mọi thành viên của CLB B thì B không cần tồn tại riêng.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — People Whose List of Favorite Companies Is Not a Subset of Another List example:**

```
i=0: {leetcode, google, facebook}
i=1: {google, microsoft}
i=2: {google, facebook}        ← subset of i=0  → excluded
i=3: {google}                  ← subset of i=0 and i=1 → excluded
i=4: {amazon}                  ← not a subset of any other → included

Output: [0, 1, 4]
```

**Algorithm:**

1. Convert each list to a `Set<string>` for O(1) lookups
2. For each person `i`, check all `j ≠ i`: is every company of `i` contained in `j`?
3. If no `j` is a superset of `i` → include `i` in result
4. Subset check: `setI.size ≤ setJ.size` AND every element of `i` is in `j`

---

---

## Problem Description

| Problem                                                                                                     | Difficulty | Pattern          |
| ----------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Sentence Similarity II](https://leetcode.com/problems/sentence-similarity-ii/)                             | 🟡 Medium  | Set / Union-Find |
| [Find Common Characters](https://leetcode.com/problems/find-common-characters/)                             | 🟢 Easy    | Set intersection |
| [Check if Array Is Sorted and Rotated](https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/) | 🟢 Easy    | Linear scan      |

---

## 📝 Interview Tips

- 🇻🇳 **Subset vs superset**: bạn cần loại i nếu _tồn tại_ j sao cho i ⊆ j, không phải j ⊆ i
- 🇺🇸 **Direction**: exclude i if ANY j is a superset of i (not the other way around)
- 🇻🇳 **Tối ưu bằng kích thước**: nếu |setI| > |setJ| thì i không thể là tập con của j
- 🇺🇸 **Size pruning**: skip j if setJ.size < setI.size — i can't be a subset
- 🇻🇳 **Chuyển list → Set sớm**: tránh chuyển đổi lặp lại O(n) trong vòng lặp lồng nhau
- 🇺🇸 **Pre-convert to Sets**: avoids repeated O(k) conversions inside nested loop
- 🇻🇳 **Complexity**: O(n² × k) với n = số người, k = kích thước list trung bình
- 🇺🇸 **Complexity**: O(n² × k) where n = people count, k = avg list size
- 🇻🇳 **Index trả về**: đề bài yêu cầu **index**, không phải tên người
- 🇺🇸 **Return indices**: the problem asks for indices, not company names
- 🇻🇳 **Tối ưu hơn**: dùng bitmask hoặc sort+hash để giảm còn O(n² × k/64)
- 🇺🇸 **Further opt**: bitmask encoding reduces inner check to single bitwise AND

---

---

## Solutions

```typescript
/**
 * Pre-convert lists to Sets, then for each i check all j for superset.
 * Time: O(n² × k)  Space: O(n × k)
 */
function peopleIndexes(favoriteCompanies: string[][]): number[] {
  const sets = favoriteCompanies.map((list) => new Set(list));
  const result: number[] = [];

  for (let i = 0; i < sets.length; i++) {
    const setI = sets[i];
    let isSubset = false;

    for (let j = 0; j < sets.length; j++) {
      if (i === j) continue;
      const setJ = sets[j];
      if (setJ.size < setI.size) continue; // pruning

      let allIn = true;
      for (const company of setI) {
        if (!setJ.has(company)) {
          allIn = false;
          break;
        }
      }
      if (allIn) {
        isSubset = true;
        break;
      }
    }

    if (!isSubset) result.push(i);
  }

  return result;
}

const companies = [
  ["leetcode", "google", "facebook"],
  ["google", "microsoft"],
  ["google", "facebook"],
  ["google"],
  ["amazon"],
];
console.log(peopleIndexes(companies)); // [0, 1, 4]
console.log(
  peopleIndexes([["leetcode"], ["google"], ["facebook"], ["leetcode", "google", "facebook"]]),
); // [3]

/**
 * Functional style using Array.every and Array.some.
 * Time: O(n² × k)  Space: O(n × k)
 */
function peopleIndexes2(favoriteCompanies: string[][]): number[] {
  const sets = favoriteCompanies.map((l) => new Set(l));

  return favoriteCompanies
    .map((_, i) => i)
    .filter(
      (i) =>
        !sets.some(
          (setJ, j) =>
            j !== i && setJ.size >= sets[i].size && [...sets[i]].every((c) => setJ.has(c)),
        ),
    );
}

console.log(peopleIndexes2(companies)); // [0, 1, 4]

/**
 * Encode each list as a sorted string; use indexOf to check containment.
 * Works when company names are distinct tokens.
 * Time: O(n² × k log k)  Space: O(n × k)
 */
function peopleIndexes3(favoriteCompanies: string[][]): number[] {
  const sorted = favoriteCompanies.map((l) => [...l].sort());
  const sets = sorted.map((l) => new Set(l));
  const result: number[] = [];

  for (let i = 0; i < sorted.length; i++) {
    let dominated = false;
    for (let j = 0; j < sorted.length && !dominated; j++) {
      if (i === j || sets[j].size < sets[i].size) continue;
      if (sorted[i].every((c) => sets[j].has(c))) dominated = true;
    }
    if (!dominated) result.push(i);
  }
  return result;
}

console.log(peopleIndexes3(companies)); // [0, 1, 4]
```

---

## 🔗 Related Problems

| Problem                                                                                                     | Difficulty | Pattern          |
| ----------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Sentence Similarity II](https://leetcode.com/problems/sentence-similarity-ii/)                             | 🟡 Medium  | Set / Union-Find |
| [Find Common Characters](https://leetcode.com/problems/find-common-characters/)                             | 🟢 Easy    | Set intersection |
| [Check if Array Is Sorted and Rotated](https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/) | 🟢 Easy    | Linear scan      |
