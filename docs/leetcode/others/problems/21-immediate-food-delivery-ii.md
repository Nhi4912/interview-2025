---
layout: page
title: "Immediate Food Delivery II"
difficulty: Medium
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/immediate-food-delivery-ii"
---

# Immediate Food Delivery II / Giao Hàng Tức Thì II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: CTE + MIN + Conditional Aggregation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Average Time of Process per Machine](https://leetcode.com/problems/average-time-of-process-per-machine) | [Students and Examinations](https://leetcode.com/problems/students-and-examinations)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn là quản lý một ứng dụng giao đồ ăn. Bạn muốn biết: trong số **đơn hàng đầu tiên** của mỗi khách, có bao nhiêu % là "giao tức thì" (ngày giao = ngày đặt). Chỉ tính đơn đầu tiên của mỗi khách, bỏ qua các đơn sau.

**Pattern Recognition:**

- Signal: "first order per customer" → **MIN(order_date) per customer_id**
- Signal: "percentage of immediate" → `AVG(order_date = customer_pref_delivery_date) * 100`
- Key insight: 2-step — first find each customer's earliest order, then check if it's immediate

**Visual:**

```
Delivery table:
delivery_id | customer_id | order_date | customer_pref_delivery_date
1           | 1           | 2019-08-01 | 2019-08-02   ← scheduled
2           | 2           | 2019-08-02 | 2019-08-02   ← immediate ✅ (first)
3           | 1           | 2019-08-11 | 2019-08-11   ← immediate, but NOT first order
4           | 3           | 2019-08-24 | 2019-08-26   ← scheduled (first)
5           | 3           | 2019-08-21 | 2019-08-22   ← first! (MIN date for cust 3)
6           | 2           | 2019-08-11 | 2019-08-13   ← not first order for cust 2

First orders: cust1→delivery1(scheduled), cust2→delivery2(immediate), cust3→delivery5(scheduled)
Immediate count: 1 out of 3 → 33.33%
```

---

## Problem Description

Given `Delivery(delivery_id, customer_id, order_date, customer_pref_delivery_date)`, compute the percentage of customers whose **first order** was "immediate" (order_date = customer_pref_delivery_date). Round to 2 decimal places.

**Example:** 3 customers, 1 has immediate first order → `33.33%`

**Constraints:** `1 <= n <= 500`, each customer has at least one order.

---

## 📝 Interview Tips

1. **First order = MIN(order_date)**: "Đơn đầu tiên là đơn có ngày order sớm nhất của mỗi khách" / First order per customer is the one with the earliest order_date
2. **Two-step approach**: "Bước 1: tìm first order. Bước 2: tính % immediate" / Don't try to do it in one step — CTE makes this clear
3. **Immediate definition**: "Immediate = order_date = customer_pref_delivery_date" / When preferred date equals order date
4. **ROUND to 2 decimals**: "ROUND(AVG(...) \* 100, 2) — MySQL AVG của boolean expression 0/1" / In MySQL, `col1 = col2` evaluates to 1 or 0
5. **Tie in order_date**: "Nếu khách có 2 đơn cùng ngày, cả hai đều là 'first' — dùng MIN rồi JOIN" / Use JOIN on MIN date, not just subquery ordering
6. **Column name**: "Output column phải tên là 'immediate_percentage'" / Check the exact expected output column name

---

## Solutions

### SQL Solution 1 — CTE + MIN + AVG (Clean)

```sql
-- Time: O(n) — two aggregation passes
-- Space: O(c) — c distinct customers
WITH FirstOrders AS (
    SELECT customer_id, MIN(order_date) AS first_order_date
    FROM Delivery
    GROUP BY customer_id
)
SELECT ROUND(
    100.0 * SUM(d.order_date = d.customer_pref_delivery_date) / COUNT(*),
    2
) AS immediate_percentage
FROM Delivery d
JOIN FirstOrders fo
  ON d.customer_id = fo.customer_id
 AND d.order_date  = fo.first_order_date;
```

### SQL Solution 2 — Subquery with IN

```sql
SELECT ROUND(
    AVG(order_date = customer_pref_delivery_date) * 100,
    2
) AS immediate_percentage
FROM Delivery
WHERE (customer_id, order_date) IN (
    SELECT customer_id, MIN(order_date)
    FROM Delivery
    GROUP BY customer_id
);
```

### SQL Solution 3 — Window Function MIN

```sql
WITH ranked AS (
    SELECT *,
           MIN(order_date) OVER (PARTITION BY customer_id) AS first_date
    FROM Delivery
)
SELECT ROUND(
    100.0 * SUM(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END)
    / COUNT(*),
    2
) AS immediate_percentage
FROM ranked
WHERE order_date = first_date;
```

### TypeScript Simulation

```typescript
/**
 * Simulate: Immediate Food Delivery II
 * Time: O(n) — two passes (find firsts, then aggregate)
 * Space: O(c) — c customers
 */
interface Delivery {
  delivery_id: number;
  customer_id: number;
  order_date: string;
  customer_pref_delivery_date: string;
}

function immediateFoodDeliveryII(deliveries: Delivery[]): number {
  // Step 1: Find first order date per customer
  const firstOrderDate = new Map<number, string>();
  for (const d of deliveries) {
    const current = firstOrderDate.get(d.customer_id);
    if (!current || d.order_date < current) {
      firstOrderDate.set(d.customer_id, d.order_date);
    }
  }

  // Step 2: Filter to first orders only, count immediate
  const firstOrders = deliveries.filter((d) => d.order_date === firstOrderDate.get(d.customer_id));

  const immediateCount = firstOrders.filter(
    (d) => d.order_date === d.customer_pref_delivery_date,
  ).length;

  const percentage = (immediateCount / firstOrders.length) * 100;
  return Math.round(percentage * 100) / 100; // round to 2 decimal places
}

// === Test Cases ===
const deliveries = [
  {
    delivery_id: 1,
    customer_id: 1,
    order_date: "2019-08-01",
    customer_pref_delivery_date: "2019-08-02",
  },
  {
    delivery_id: 2,
    customer_id: 2,
    order_date: "2019-08-02",
    customer_pref_delivery_date: "2019-08-02",
  },
  {
    delivery_id: 3,
    customer_id: 1,
    order_date: "2019-08-11",
    customer_pref_delivery_date: "2019-08-11",
  },
  {
    delivery_id: 4,
    customer_id: 3,
    order_date: "2019-08-24",
    customer_pref_delivery_date: "2019-08-26",
  },
  {
    delivery_id: 5,
    customer_id: 3,
    order_date: "2019-08-21",
    customer_pref_delivery_date: "2019-08-22",
  },
  {
    delivery_id: 6,
    customer_id: 2,
    order_date: "2019-08-11",
    customer_pref_delivery_date: "2019-08-13",
  },
];
console.log(immediateFoodDeliveryII(deliveries)); // 33.33

// All immediate first orders
const allImmediate = [
  {
    delivery_id: 1,
    customer_id: 1,
    order_date: "2020-01-01",
    customer_pref_delivery_date: "2020-01-01",
  },
  {
    delivery_id: 2,
    customer_id: 2,
    order_date: "2020-01-02",
    customer_pref_delivery_date: "2020-01-02",
  },
];
console.log(immediateFoodDeliveryII(allImmediate)); // 100.00
```

---

## 🔗 Related Problems

- [Average Time of Process per Machine](https://leetcode.com/problems/average-time-of-process-per-machine) — conditional aggregation per group
- [Game Play Analysis II](https://leetcode.com/problems/game-play-analysis-ii) — first login per player
- [Percentage of Users Attended a Contest](https://leetcode.com/problems/percentage-of-users-attended-a-contest) — percentage calculation
- [Fraction of Players That Logged in Again](https://leetcode.com/problems/game-play-analysis-iv) — first event + follow-up pattern
