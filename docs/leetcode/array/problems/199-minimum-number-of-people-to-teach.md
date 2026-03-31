---
layout: page
title: "Minimum Number of People to Teach"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-people-to-teach"
---

# Minimum Number of People to Teach / Dạy Ngôn Ngữ Cho Ít Người Nhất

🟡 Medium | Array · Hash Table · Greedy | LeetCode #1733

## 🧠 Intuition / Tư Duy

**Vietnamese:** Như mạng lưới bạn bè quốc tế — hai người bạn cần ít nhất một ngôn ngữ chung. Ta chỉ cần tập trung vào những cặp bạn bè chưa hiểu nhau, rồi tìm ngôn ngữ nào cần dạy ít người nhất.

```
Languages: [[1,2],[3],[2],[1,3]], Friendships: [[1,2],[1,3],[2,3]]

Step 1 - Find bad pairs (no common language):
  Pair(1,2): {1,2} ∩ {3} = ∅  → bad! candidates: {1,2}
  Pair(1,3): {1,2} ∩ {2} = {2} → ok
  Pair(2,3): {3}   ∩ {2} = ∅  → bad! candidates: {1,2,3}

Step 2 - For each language, count how many candidates need it:
  lang=1: person2 needs it, person3 needs it → 2
  lang=2: person2 needs it → 1
  lang=3: person1 needs it → 1  ← minimum = 1
```

## Problem Description

Given `n` languages (1-indexed), each person's languages, and friendships, find the **minimum number of people** to teach **one language** so all friend pairs can communicate (share at least one language).

You pick exactly one language to teach any subset of people. People who already know the language don't need teaching.

**Example 1:**

```
n=2, languages=[[1],[2],[1,2]], friendships=[[1,2],[1,3],[2,3]]
Output: 1  // Teach person 1 language 2, or person 2 language 1
```

**Example 2:**

```
n=3, languages=[[1,2],[3],[1,3],[4,5],[1]], friendships=[[1,2],[2,3],[3,4],[4,5]]
Output: 2
```

## 📝 Interview Tips

- **🔍 Filter pairs first / Lọc cặp trước:** Only friend pairs with NO common language matter — skip already-communicating pairs to reduce work
- **🎯 Greedy choice / Chọn tham lam:** For each candidate language, count distinct people who need to learn it — the minimum is the answer
- **🗂️ Set intersection / Giao tập hợp:** Convert each person's languages to a Set; finding common language = `some(l => setB.has(l))`
- **⚠️ No double-count / Không đếm trùng:** Collect candidates into a Set — same person in multiple bad pairs counted once
- **💡 Key insight / Ý tưởng chính:** `answer = candidates.size - max(freq[lang])` where freq counts how many candidates already know each language
- **📊 Complexity / Độ phức tạp:** O(F·L + P·L) where F = friendships, P = people, L = max languages per person

## Solutions

```typescript
/**
 * Approach 1: Greedy with candidate set
 * Time: O(F·L + P·L) — F=friendships, L=max langs/person
 * Space: O(P·L) for language sets
 */
function minimumTeachings(n: number, languages: number[][], friendships: number[][]): number {
  const langSets = languages.map((langs) => new Set(langs));

  // Find people in pairs that cannot communicate
  const candidates = new Set<number>();
  for (const [u, v] of friendships) {
    const a = langSets[u - 1];
    const b = langSets[v - 1];
    const canTalk = [...a].some((l) => b.has(l));
    if (!canTalk) {
      candidates.add(u - 1);
      candidates.add(v - 1);
    }
  }

  if (candidates.size === 0) return 0;

  // For each language, count how many candidates already know it
  const freq = new Array(n + 1).fill(0);
  for (const p of candidates) {
    for (const l of langSets[p]) freq[l]++;
  }

  // Teach the language most candidates already know → fewest need to learn
  const maxAlreadyKnow = Math.max(...freq.slice(1));
  return candidates.size - maxAlreadyKnow;
}

console.log(
  minimumTeachings(
    2,
    [[1], [2], [1, 2]],
    [
      [1, 2],
      [1, 3],
      [2, 3],
    ],
  ),
); // 1
console.log(
  minimumTeachings(
    3,
    [[1, 2], [3], [1, 3], [4, 5], [1]],
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  ),
); // 2
console.log(
  minimumTeachings(
    3,
    [
      [1, 2],
      [1, 2],
    ],
    [[1, 2]],
  ),
); // 0
```

```typescript
/**
 * Approach 2: Explicit per-language counting
 * Time: O(F·L + n·C) — C=candidates count
 * Space: O(n + P·L)
 */
function minimumTeachingsV2(n: number, languages: number[][], friendships: number[][]): number {
  const langSets = languages.map((l) => new Set(l));
  const needHelp = new Set<number>();

  for (const [u, v] of friendships) {
    const a = langSets[u - 1],
      b = langSets[v - 1];
    if (![...a].some((l) => b.has(l))) {
      needHelp.add(u - 1);
      needHelp.add(v - 1);
    }
  }

  if (needHelp.size === 0) return 0;

  let minTeach = Infinity;
  for (let lang = 1; lang <= n; lang++) {
    let count = 0;
    for (const p of needHelp) {
      if (!langSets[p].has(lang)) count++;
    }
    minTeach = Math.min(minTeach, count);
  }
  return minTeach;
}

console.log(
  minimumTeachingsV2(
    2,
    [[1], [2], [1, 2]],
    [
      [1, 2],
      [1, 3],
      [2, 3],
    ],
  ),
); // 1
console.log(
  minimumTeachingsV2(
    3,
    [[1, 2], [3], [1, 3], [4, 5], [1]],
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  ),
); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                                             | Difficulty | Pattern    |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces/)                                                                           | 🟡 Medium  | Union Find |
| [Maximum Network Rank](https://leetcode.com/problems/maximum-network-rank/)                                                                         | 🟡 Medium  | Graph      |
| [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest/)                                                                               | 🟡 Medium  | Greedy     |
| [Find the City With Smallest Neighbors](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/) | 🟡 Medium  | Graph      |
