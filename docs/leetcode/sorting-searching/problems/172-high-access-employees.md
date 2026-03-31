---
layout: page
title: "High-Access Employees"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Sorting]
leetcode_url: "https://leetcode.com/problems/high-access-employees"
---

# High-Access Employees / Nhân Viên Truy Cập Nhiều Lần

🟡 Medium | Hash Table, Sorting | [LeetCode 2933](https://leetcode.com/problems/high-access-employees)

---

## 🧠 Intuition / Trực Giác

**EN:** Group access times by employee name. Sort each employee's times, then use a sliding window of size 3: if the 3rd access is within 60 minutes of the 1st, that employee is "high-access."

**VI:** Gom thời gian truy cập theo tên nhân viên, sắp xếp lại. Dùng cửa sổ trượt 3 phần tử: nếu lần truy cập thứ 3 cách lần đầu < 60 phút → nhân viên "truy cập nhiều".

```
access_times: [["alice","0000"],["alice","0100"],["alice","0055"],["bob","0800"]]

alice sorted: [0, 55, 60]  (minutes)
  window [0,55,60]: 60 - 0 = 60  → NOT < 60

alice sorted: [0, 55, 59]
  window [0,55,59]: 59 - 0 = 59  → < 60 ✓ HIGH ACCESS

Sliding window of 3:
  times[i] - times[i-2] < 60  →  high access
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🕐 **EN:** Convert "HHMM" to minutes: `hh*60 + mm` — avoids string comparison edge cases. **VI:** Đổi "HHMM" sang phút để so sánh số học.
- 🔑 **EN:** Use a Map to group times by name in one pass. **VI:** Dùng Map để gom dữ liệu một lần duyệt.
- 📏 **EN:** Sort per employee, not globally — O(k log k) per employee where k is their access count. **VI:** Sắp xếp theo từng nhân viên, không sắp xếp toàn bộ.
- 🪟 **EN:** Sliding window size 3: check `times[i] - times[i-2] < 60`. **VI:** Cửa sổ 3: kiểm tra `times[i] - times[i-2] < 60`.
- ⚠️ **EN:** The condition is strictly less than 60 (not ≤). Three accesses at :00, :30, :60 is NOT high-access. **VI:** Điều kiện là `< 60`, không phải `<= 60`.
- 🚫 **EN:** Break early after finding one valid window for an employee (no need to check more). **VI:** Dừng sớm sau khi tìm thấy cửa sổ hợp lệ đầu tiên.

---

## 💡 Solutions / Giải Pháp

### Solution 1 — Group + Sort + Sliding Window (Optimal)

```typescript
/**
 * Group by name, sort times, sliding window of 3
 * Time: O(n log n)  Space: O(n)
 */
function findHighAccessEmployees(access_times: string[][]): string[] {
  const map = new Map<string, number[]>();

  for (const [name, time] of access_times) {
    const mins = parseInt(time.slice(0, 2)) * 60 + parseInt(time.slice(2));
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push(mins);
  }

  const result: string[] = [];
  for (const [name, times] of map) {
    times.sort((a, b) => a - b);
    for (let i = 2; i < times.length; i++) {
      if (times[i] - times[i - 2] < 60) {
        result.push(name);
        break; // found one window, no need to continue
      }
    }
  }
  return result;
}

// Tests
console.log(
  findHighAccessEmployees([
    ["a", "0549"],
    ["b", "0457"],
    ["a", "0532"],
    ["a", "0621"],
    ["b", "0540"],
  ]),
); // ["a"]

console.log(
  findHighAccessEmployees([
    ["d", "0002"],
    ["c", "0808"],
    ["c", "0829"],
    ["e", "0215"],
    ["d", "1508"],
    ["d", "1444"],
    ["d", "1410"],
    ["c", "0809"],
  ]),
); // ["c","d"]
```

### Solution 2 — Frequency Map with Time Bucket

```typescript
/**
 * Count per (name, hour-window) bucket using sorted times per person
 * Time: O(n log n)  Space: O(n)
 */
function findHighAccessEmployees2(access_times: string[][]): string[] {
  const byName = new Map<string, number[]>();

  for (const [name, t] of access_times) {
    const mins = +t.slice(0, 2) * 60 + +t.slice(2);
    byName.set(name, [...(byName.get(name) ?? []), mins]);
  }

  const high: string[] = [];
  for (const [name, times] of byName) {
    times.sort((a, b) => a - b);
    let lo = 0;
    for (let hi = 0; hi < times.length; hi++) {
      // shrink window: ensure times[hi] - times[lo] < 60
      while (times[hi] - times[lo] >= 60) lo++;
      if (hi - lo + 1 >= 3) {
        high.push(name);
        break;
      }
    }
  }
  return high;
}

console.log(
  findHighAccessEmployees2([
    ["a", "0549"],
    ["b", "0457"],
    ["a", "0532"],
    ["a", "0621"],
    ["b", "0540"],
  ]),
);
// ["a"]
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                   | Difficulty | Pattern           |
| --- | ------------------------- | ---------- | ----------------- |
| 1   | Contains Duplicate II     | 🟢 Easy    | sliding window    |
| 2   | Employee Free Time        | 🔴 Hard    | interval grouping |
| 3   | Count Pairs in Two Arrays | 🟡 Medium  | two-pointer       |
