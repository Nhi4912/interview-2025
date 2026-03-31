---
layout: page
title: "Number of Orders in the Backlog"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Heap (Priority Queue), Simulation]
leetcode_url: "https://leetcode.com/problems/number-of-orders-in-the-backlog"
---

# Number of Orders in the Backlog / Số Lệnh Trong Hàng Chờ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Total Cost to Hire K Workers](https://leetcode.com/problems/total-cost-to-hire-k-workers) | [Car Pooling](https://leetcode.com/problems/car-pooling)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Mô phỏng sàn giao dịch chứng khoán — **buy orders** muốn mua giá cao nhất có thể (max-heap), **sell orders** muốn bán giá thấp nhất có thể (min-heap). Khi giá buy >= giá sell, hai lệnh khớp nhau và số lượng bị trừ đi.

```
orders = [[10,5,0],[15,2,1],[25,1,1],[30,4,0]]
Buy heap (max): []   Sell heap (min): []

[10,5,0] BUY  → no sell match → buy heap: [(10,5)]
[15,2,1] SELL → buy top=10 < 15 → no match → sell heap: [(15,2)]
[25,1,1] SELL → buy top=10 < 25 → no match → sell heap: [(15,2),(25,1)]
[30,4,0] BUY  → sell min=15 <= 30 → match 2 orders, buy_qty=2 left
              → sell min=25 <= 30 → match 1 order, buy_qty=1 left
              → sell empty, buy 1 remains → buy heap: [(30,1)]

Total: buy heap (30,1) + sell heap () = 1 → answer = 1 mod 10^9+7
```

---

## Problem Description

Given a list of `orders[i] = [price, amount, orderType]` (0=buy, 1=sell), simulate a stock exchange backlog. Return the total number of orders remaining after all are processed, modulo `10^9 + 7`.

- **Example 1:** `orders = [[10,5,0],[15,2,1],[25,1,1],[30,4,0]]` → `6`
- **Example 2:** `orders = [[7,1000000000,1],[15,3,0],[5,999999995,0],[5,1,1]]` → `999999984`

---

## 📝 Interview Tips

- 📦 **Two heaps:** buy orders → max-heap (highest price first); sell orders → min-heap (lowest price first)
- 🔄 **Match condition:** `buyHeap.max() >= sellHeap.min()` → khớp lệnh, trừ số lượng nhỏ hơn
- 🔢 **JS heap:** JS không có built-in heap — implement với array + sift operations, hoặc dùng sorted array
- 📊 **Complexity:** O(n log n) với heap operations
- ⚠️ **Modulo:** Tính tổng cuối cùng rồi mới mod `10^9 + 7` — không phải từng bước
- 💡 **Optimization:** Dùng `[price, qty]` pairs trong heap; xóa entry khi `qty = 0`

---

## Solutions

### Solution 1: Simulate with sorted arrays (simple, O(n²) worst case)

```typescript
/**
 * Simulate buy/sell matching with sorted arrays
 * Time: O(n² log n) worst case  Space: O(n)
 */
function getNumberOfBacklogOrders(orders: number[][]): number {
  const MOD = 1_000_000_007n;
  // Buy orders: want highest price → sort desc by price
  // Sell orders: want lowest price → sort asc by price
  const buyBacklog: number[][] = []; // [price, qty] max by price
  const sellBacklog: number[][] = []; // [price, qty] min by price

  for (const [price, amount, type] of orders) {
    let qty = amount;
    if (type === 0) {
      // BUY: match with cheapest sell
      while (qty > 0 && sellBacklog.length > 0 && sellBacklog[0][0] <= price) {
        const matched = Math.min(qty, sellBacklog[0][1]);
        qty -= matched;
        sellBacklog[0][1] -= matched;
        if (sellBacklog[0][1] === 0) sellBacklog.shift();
      }
      if (qty > 0) {
        // Insert into buy backlog, maintaining desc order
        const pos = buyBacklog.findIndex((o) => o[0] < price);
        if (pos === -1) buyBacklog.push([price, qty]);
        else buyBacklog.splice(pos, 0, [price, qty]);
      }
    } else {
      // SELL: match with highest buy
      while (qty > 0 && buyBacklog.length > 0 && buyBacklog[0][0] >= price) {
        const matched = Math.min(qty, buyBacklog[0][1]);
        qty -= matched;
        buyBacklog[0][1] -= matched;
        if (buyBacklog[0][1] === 0) buyBacklog.shift();
      }
      if (qty > 0) {
        const pos = sellBacklog.findIndex((o) => o[0] > price);
        if (pos === -1) sellBacklog.push([price, qty]);
        else sellBacklog.splice(pos, 0, [price, qty]);
      }
    }
  }

  let total = 0n;
  for (const [, qty] of [...buyBacklog, ...sellBacklog]) total += BigInt(qty);
  return Number(total % MOD);
}

console.log(
  getNumberOfBacklogOrders([
    [10, 5, 0],
    [15, 2, 1],
    [25, 1, 1],
    [30, 4, 0],
  ]),
);
// 6
console.log(
  getNumberOfBacklogOrders([
    [7, 1000000000, 1],
    [15, 3, 0],
    [5, 999999995, 0],
    [5, 1, 1],
  ]),
);
// 999999984
```

### Solution 2: Map-based price grouping (efficient for dense prices)

```typescript
/**
 * Group orders by price in maps — O(n log n) with sorted key access
 * Time: O(n log n)  Space: O(n)
 */
function getNumberOfBacklogOrders2(orders: number[][]): number {
  const MOD = 1_000_000_007;
  const buyMap = new Map<number, number>(); // price → qty
  const sellMap = new Map<number, number>(); // price → qty

  for (const [price, amount, type] of orders) {
    let qty = amount;
    if (type === 0) {
      // BUY: match sells with price <= this buy price
      const sellPrices = [...sellMap.keys()].sort((a, b) => a - b);
      for (const sp of sellPrices) {
        if (sp > price || qty === 0) break;
        const available = sellMap.get(sp)!;
        const matched = Math.min(qty, available);
        qty -= matched;
        if (available === matched) sellMap.delete(sp);
        else sellMap.set(sp, available - matched);
      }
      if (qty > 0) buyMap.set(price, (buyMap.get(price) ?? 0) + qty);
    } else {
      // SELL: match buys with price >= this sell price
      const buyPrices = [...buyMap.keys()].sort((a, b) => b - a);
      for (const bp of buyPrices) {
        if (bp < price || qty === 0) break;
        const available = buyMap.get(bp)!;
        const matched = Math.min(qty, available);
        qty -= matched;
        if (available === matched) buyMap.delete(bp);
        else buyMap.set(bp, available - matched);
      }
      if (qty > 0) sellMap.set(price, (sellMap.get(price) ?? 0) + qty);
    }
  }

  let total = 0;
  for (const qty of [...buyMap.values(), ...sellMap.values()]) {
    total = (total + qty) % MOD;
  }
  return total;
}

console.log(
  getNumberOfBacklogOrders2([
    [10, 5, 0],
    [15, 2, 1],
    [25, 1, 1],
    [30, 4, 0],
  ]),
); // 6
```

---

## 🔗 Related Problems

| Problem                                                                                       | Difficulty | Connection                 |
| --------------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| [Design a Stock Trading System](https://leetcode.com/problems/design-a-stock-trading-system/) | 🟡 Medium  | Full order book simulation |
| [Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii/)                         | 🔴 Hard    | Two-heap simulation        |
| [Total Cost to Hire K Workers](https://leetcode.com/problems/total-cost-to-hire-k-workers/)   | 🟡 Medium  | Two-heap greedy selection  |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                               | 🟡 Medium  | Priority queue simulation  |
| [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation/)             | 🟡 Medium  | Order book with sorted set |
