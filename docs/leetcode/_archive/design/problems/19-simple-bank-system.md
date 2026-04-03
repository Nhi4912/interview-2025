---
layout: page
title: "Simple Bank System"
difficulty: Medium
category: Design
tags: [Array, Hash Table, Design, Simulation]
leetcode_url: "https://leetcode.com/problems/simple-bank-system"
---

# Simple Bank System / Hệ Thống Ngân Hàng Đơn Giản

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Design / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Design Memory Allocator](https://leetcode.com/problems/design-memory-allocator) | [Design Snake Game](https://leetcode.com/problems/design-snake-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhân viên ngân hàng — mỗi thao tác (rút, gửi, chuyển khoản) phải kiểm tra số dư và số tài khoản hợp lệ trước. Nếu không đủ điều kiện, từ chối và giữ nguyên trạng thái.

**Pattern Recognition:**

- Signal: "implement class with API" + "validate then mutate" → **Design / Simulation**
- Key insight: lưu balance trong array 1-indexed; kiểm tra account validity và sufficient funds trước mỗi operation
- Transfer = withdraw + deposit atomically — chỉ thực hiện nếu CẢ HAI điều kiện thoả

**Visual — transfer(1, 2, 300) on [500, 200, 300]:**

```
accounts: [null, 500, 200, 300]   (1-indexed, slot 0 unused)
           idx     1    2    3

transfer(1→2, 300):
  valid?    acc1=1∈[1,3]✅  acc2=2∈[1,3]✅  balance[1]=500≥300✅
  execute:  balance[1] = 500-300 = 200
            balance[2] = 200+300 = 500
  result:   [null, 200, 500, 300] → true

withdraw(4, 100):
  valid?    acc=4 > n=3  ❌
  result:   false (no state change)
```

---

## Problem Description

Implement a bank system with `n` accounts. ([LeetCode #2043](https://leetcode.com/problems/simple-bank-system))

Difficulty: Medium | Acceptance: 61.4%

Given `balance[i]` (1-indexed initial balances), implement:

- `transfer(account1, account2, money)` → transfer `money` from account1 to account2; `false` if invalid account or insufficient funds
- `deposit(account, money)` → add `money` to account; `false` if invalid account
- `withdraw(account, money)` → deduct `money`; `false` if invalid account or insufficient funds

**Example:**

```
Bank([10, 100, 20, 50, 30])
deposit(5, 20)     → true   balance[5]=50
withdraw(4, 25)    → true   balance[4]=25
transfer(3, 4, 15) → true   balance[3]=5, balance[4]=40
transfer(3, 4, 15) → false  balance[3]=5 < 15
```

Constraints: `1 ≤ n ≤ 10^5`, `0 ≤ money ≤ 10^12`, up to `10^4` calls

---

## 📝 Interview Tips

1. **Clarify**: "Accounts 1-indexed hay 0-indexed?" / Confirm accounts are 1-based (they are here)
2. **Atomic transfer**: "Transfer = withdraw + deposit; check balance TRƯỚC khi thực hiện" / Both ops must succeed or neither executes
3. **Validate first**: "Kiểm tra account trong range [1,n] trước, sau đó mới check balance" / Range check before balance check
4. **Same-account**: "account1 == account2 vẫn hợp lệ nếu đủ balance — net result is zero" / Transfer to self is valid
5. **No partial update**: "Nếu operation fail, state không được thay đổi" / Atomic: all-or-nothing
6. **Follow-up**: "Concurrent access? → atomic compare-and-swap hoặc locks" / Concurrency requires synchronization

---

## Solutions

```typescript
/**
 * Solution 1: Array with 1-indexed accounts (Optimal)
 * Time: O(1) per operation — direct index access
 * Space: O(n) — store n balances
 */
class Bank {
  private balance: number[];
  private n: number;

  constructor(balance: number[]) {
    this.balance = balance;
    this.n = balance.length;
  }

  private isValid(account: number): boolean {
    return account >= 1 && account <= this.n;
  }

  transfer(account1: number, account2: number, money: number): boolean {
    if (!this.isValid(account1) || !this.isValid(account2)) return false;
    if (this.balance[account1 - 1] < money) return false;
    this.balance[account1 - 1] -= money;
    this.balance[account2 - 1] += money;
    return true;
  }

  deposit(account: number, money: number): boolean {
    if (!this.isValid(account)) return false;
    this.balance[account - 1] += money;
    return true;
  }

  withdraw(account: number, money: number): boolean {
    if (!this.isValid(account)) return false;
    if (this.balance[account - 1] < money) return false;
    this.balance[account - 1] -= money;
    return true;
  }
}

// === Test Cases ===
const bank = new Bank([10, 100, 20, 50, 30]);
console.log(bank.deposit(5, 20)); // true  → balance[5]=50
console.log(bank.withdraw(4, 25)); // true  → balance[4]=25
console.log(bank.transfer(3, 4, 15)); // true  → balance[3]=5, balance[4]=40
console.log(bank.transfer(3, 4, 15)); // false → balance[3]=5 < 15
console.log(bank.withdraw(10, 1)); // false → account 10 out of range

/**
 * Solution 2: Functional helper to show validate-then-execute pattern
 * Time: O(1) per operation
 * Space: O(n)
 */
class Bank2 {
  private bal: number[];

  constructor(balance: number[]) {
    this.bal = [...balance];
  }

  private ok(acc: number): boolean {
    return acc >= 1 && acc <= this.bal.length;
  }

  transfer(a1: number, a2: number, money: number): boolean {
    if (!this.ok(a1) || !this.ok(a2) || this.bal[a1 - 1] < money) return false;
    this.bal[a1 - 1] -= money;
    this.bal[a2 - 1] += money;
    return true;
  }
  deposit(acc: number, money: number): boolean {
    if (!this.ok(acc)) return false;
    this.bal[acc - 1] += money;
    return true;
  }
  withdraw(acc: number, money: number): boolean {
    if (!this.ok(acc) || this.bal[acc - 1] < money) return false;
    this.bal[acc - 1] -= money;
    return true;
  }
}

const b2 = new Bank2([500, 200, 300]);
console.log(b2.transfer(1, 2, 300)); // true
console.log(b2.transfer(1, 2, 300)); // false (balance[1]=200 < 300)
```

---

## 🔗 Related Problems

- [Design Memory Allocator](https://leetcode.com/problems/design-memory-allocator) — similar simulation with validity checks
- [Design Snake Game](https://leetcode.com/problems/design-snake-game) — Design with stateful mutation
- [Design HashMap](https://leetcode.com/problems/design-hashmap) — array-backed Design class
- [Snapshot Array](https://leetcode.com/problems/snapshot-array) — array-based design with versioning
- [Simple Bank System — LeetCode](https://leetcode.com/problems/simple-bank-system) — problem page
