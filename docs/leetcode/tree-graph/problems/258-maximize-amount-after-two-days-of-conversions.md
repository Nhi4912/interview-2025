---
layout: page
title: "Maximize Amount After Two Days of Conversions"
difficulty: Medium
category: Tree-Graph
tags: [Array, String, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/maximize-amount-after-two-days-of-conversions"
---

# Maximize Amount After Two Days of Conversions / Tối Đa Hóa Số Tiền Sau Hai Ngày Đổi Tiền

> **Track**: Tree-Graph | **Difficulty**: 🟡 Medium | **Pattern**: Graph BFS — Max-Rate Propagation
> **Frequency**: 📘 Tier 3 — Contest / OA, tests multiplicative graph path
> **See also**: [399 Evaluate Division](https://leetcode.com/problems/evaluate-division) | [787 Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn là thương nhân đổi tiền ở chợ ngoại tệ Hà Nội. Ngày 1, bạn có thể đổi USD sang EUR rồi sang GBP qua nhiều quầy trung gian để đạt tỉ giá gộp tốt nhất. Ngày 2, tỉ giá thay đổi, bạn đổi tiếp từ đồng đang giữ về đích cuối. Bí quyết là sau ngày 1, bạn chọn "dừng ở đồng trung gian X nào" để tích tỉ giá cả hai ngày là lớn nhất — giống tìm đường đi "béo nhất" trên bản đồ đổi tiền hai tầng.

**Pattern Recognition:**

- Signal: "chain of currency rates, maximize product" → **Graph BFS — Max-Rate Propagation**
- Bài này thuộc dạng tìm đường đi có tích trọng số lớn nhất trên đồ thị có hướng
- Key insight: BFS từ `initialCurrency` trên đồ thị ngày 1 → lưu max rate tới mọi đồng X; BFS từ `targetCurrency` ngược trên đồ thị ngày 2 → lưu max rate từ X về đích; đáp án = max(rate1[X] × rate2[X])

**Visual — BFS rate propagation day 1:**

```
Graph day1 (bidirectional with inverse):
  USD→EUR 0.9, EUR→GBP 0.8, USD→GBP 0.7

BFS from USD:
  rate[USD] = 1.0  (start)
  rate[EUR] = 1.0 × 0.9 = 0.9
  rate[GBP] = max(1.0×0.7, 0.9×0.8) = max(0.7, 0.72) = 0.72

Graph day2 reversed from target USD:
  rate2[USD] = 1.0
  rate2[EUR] = 1.0 × 1.1 = 1.1  (EUR→USD 1.1)
  rate2[GBP] = 1.0 × 1.3 = 1.3  (GBP→USD 1.3)

Answer = max over X of rate1[X] × rate2[X]:
  X=USD: 1.0 × 1.0 = 1.0
  X=EUR: 0.9 × 1.1 = 0.99  ← best
  X=GBP: 0.72 × 1.3 = 0.936
```

---

## Problem Description

You start with 1.0 unit of `initialCurrency`. Over two days, each day you're given exchange pairs `(from, to, rate)` and can chain multiple conversions. Find the maximum amount in `targetCurrency` you can hold after both days. You may hold any currency between days. ([LeetCode](https://leetcode.com/problems/maximize-amount-after-two-days-of-conversions))

```
Example 1:
  initialCurrency="USD", targetCurrency="USD"
  pairs1=[["USD","EUR"]], rates1=[1.0]
  pairs2=[["EUR","USD"]], rates2=[1.0]
  Output: 1.0

Example 2:
  initialCurrency="USD", targetCurrency="USD"
  pairs1=[["USD","EUR"]], rates1=[0.9]
  pairs2=[["EUR","USD"]], rates2=[1.1]
  Output: 0.99  (USD→EUR on day1 at 0.9, EUR→USD on day2 at 1.1)
```

Constraints: 1 ≤ pairs1.length, pairs2.length ≤ 10; rates > 0; valid exchange graph.

---

## 📝 Interview Tips

1. **Build bidirectional edges: A→B rate r AND B→A rate 1/r** — _Đổi ngược lại với tỉ giá nghịch đảo, nên cần thêm cả chiều ngược_
2. **Day 1: BFS max-rate from initialCurrency; Day 2: BFS max-rate from targetCurrency** — _Ngày 1 lan ra từ đầu, ngày 2 lan ra từ đích — rồi nhân lại_
3. **Answer = max over all currencies X: rate1[X] × rate2[X]** — _Chọn đồng trung gian X tốt nhất, không cần biết đó là đồng gì_
4. **Use BFS with relaxation (update if new rate is better)** — _Không phải BFS thông thường — cập nhật khi tìm được đường tốt hơn như Dijkstra_
5. **Visited map stores best rate, not just "seen"** — _Map lưu giá trị tốt nhất, không chỉ "đã thăm" — nếu không cập nhật sẽ bỏ lỡ đường tốt hơn_
6. **If initialCurrency == targetCurrency, path staying put on day1 gives rate1[target]=1.0** — _Trường hợp đặc biệt khi start = end: đường không đổi vẫn hợp lệ_

---

## Solutions

```typescript
/** Solution 1: BFS max-rate propagation (relaxation-based)
 * @complexity Time: O((V+E) × 2) | Space: O(V+E) */
function buildGraph(pairs: string[][], rates: number[]): Map<string, [string, number][]> {
  const g = new Map<string, [string, number][]>();
  for (let i = 0; i < pairs.length; i++) {
    const [a, b] = pairs[i],
      r = rates[i];
    if (!g.has(a)) g.set(a, []);
    if (!g.has(b)) g.set(b, []);
    g.get(a)!.push([b, r]);
    g.get(b)!.push([a, 1 / r]);
  }
  return g;
}

function bfsMaxRate(graph: Map<string, [string, number][]>, start: string): Map<string, number> {
  const dist = new Map<string, number>([[start, 1.0]]);
  const queue: string[] = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const [next, rate] of graph.get(cur) ?? []) {
      const newRate = dist.get(cur)! * rate;
      if (!dist.has(next) || dist.get(next)! < newRate) {
        dist.set(next, newRate);
        queue.push(next);
      }
    }
  }
  return dist;
}

/** Solution 2: Same logic, cleaner structure
 * @complexity Time: O((V+E) × 2) | Space: O(V+E) */
function maximizeAmount(
  initialCurrency: string,
  pairs1: string[][],
  rates1: number[],
  pairs2: string[][],
  rates2: number[],
  targetCurrency: string,
): number {
  const g1 = buildGraph(pairs1, rates1);
  const g2 = buildGraph(pairs2, rates2);
  const rate1 = bfsMaxRate(g1, initialCurrency); // max rate to reach X after day1
  const rate2 = bfsMaxRate(g2, targetCurrency); // max rate to reach target from X after day2
  let ans = 0;
  for (const [currency, r1] of rate1) {
    const r2 = rate2.get(currency) ?? 0;
    ans = Math.max(ans, r1 * r2);
  }
  return ans;
}

// === Test Cases ===
console.log(maximizeAmount("USD", [["USD", "EUR"]], [0.9], [["EUR", "USD"]], [1.1], "USD")); // 0.99

console.log(maximizeAmount("USD", [["USD", "EUR"]], [1.0], [["EUR", "USD"]], [1.0], "USD")); // 1.0

console.log(
  maximizeAmount(
    "USD",
    [
      ["USD", "EUR"],
      ["USD", "GBP"],
      ["EUR", "GBP"],
    ],
    [0.9, 0.7, 0.8],
    [
      ["GBP", "USD"],
      ["EUR", "USD"],
    ],
    [1.3, 1.1],
    "USD",
  ),
); // max(1.0, 0.9*1.1, 0.72*1.3) = max(1.0, 0.99, 0.936) = 1.0
```

---

## 🔗 Related Problems

| #    | Problem                               | Difficulty | Pattern                |
| ---- | ------------------------------------- | ---------- | ---------------------- |
| 399  | Evaluate Division                     | Medium     | Graph BFS / Union Find |
| 743  | Network Delay Time                    | Medium     | Dijkstra               |
| 787  | Cheapest Flights Within K Stops       | Medium     | Bellman-Ford / BFS     |
| 1334 | Find the City With Smallest Neighbors | Medium     | Floyd-Warshall         |
