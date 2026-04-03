---
layout: page
title: "Maximum Number of Alloys"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-alloys"
---

# maximum number of alloys

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn là chủ xưởng đúc kim loại với k máy móc khác nhau, mỗi máy cần công thức khác nhau
(composition). Câu hỏi: "Tôi có thể đúc tối đa bao nhiêu thanh hợp kim?" Đây là dạng
**binary search on answer**: nếu đúc được `mid` thanh thì chắc chắn đúc được `mid-1` thanh
(tính đơn điệu). Với mỗi máy, kiểm tra: chi phí để đúc `mid` thanh có ≤ ngân sách không?
Lấy max trên tất cả k máy.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
n=3 metals, k=2 machines, budget=15
composition=[[1,1,1],[1,1,10]], stock=[0,0,0], cost=[1,2,3]

Binary search: lo=0, hi=2e8
─────────────────────────────
mid = 1e8:  machine0 cost = 1*1e8*1 + 1*1e8*2 + 1*1e8*3 = 6e8 > 15 → too many
mid = 5:    machine0 cost = (5-0)*1 + (5-0)*2 + (5-0)*3 = 5+10+15=30 > 15 → hi=4
mid = 2:    machine0 cost = 2+4+6=12 ≤ 15 ✓  ans=2, lo=3
mid = 3:    machine0 cost = 3+6+9=18 > 15 → hi=2
lo=3 > hi=2 → stop, ans=2

machine1 mid=2: cost = 2*1+(2*1)+(2*10) = 2+2+60=64 > 15 → ans stays 0 for machine1

Final answer: max(2, 0) = 2
```

---

## Problem Description

| Problem                                                                                                                                               | Difficulty | Tags          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)                                                                        | Medium     | Binary Search |
| [1011. Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)                               | Medium     | Binary Search |
| [2064. Minimized Maximum of Products Distributed to Any Store](https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/) | Medium     | Binary Search |
| [1283. Find the Smallest Divisor Given a Threshold](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/)                       | Medium     | Binary Search |

---

## 📝 Interview Tips

1. **Binary search on answer** — "Can we make `mid` alloys?" is monotone: if yes for `mid`, then yes for all `< mid`.
   _Binary search trên đáp án — "Có thể đúc `mid` thanh không?" có tính đơn điệu: nếu được với `mid` thì được với mọi `< mid`._

2. **Check per machine independently** — Each machine is independent; take the max over all k machines.
   _Kiểm tra từng máy độc lập — Mỗi máy độc lập nhau; lấy max trên tất cả k máy._

3. **Cost formula** — For machine `i`, making `mid` alloys costs `sum(max(0, comp[i][j]*mid - stock[j]) * cost[j])`.
   *Công thức chi phí — Với máy `i`, đúc `mid` thanh tốn `sum(max(0, comp[i][j]*mid - stock[j]) _ cost[j])`._

4. **Early termination in cost check** — If partial cost already exceeds budget, break immediately; avoids overflow.
   _Dừng sớm khi kiểm tra chi phí — Nếu chi phí riêng phần đã vượt ngân sách, dừng ngay; tránh overflow._

5. **Upper bound for binary search** — Max alloys ≈ `budget / min_cost + max_stock / min_composition`. Safe bound: `2e8`.
   _Cận trên cho binary search — Max alloys ≈ `budget / min_cost + max_stock / min_comp`. Cận an toàn: `2e8`._

6. **No stock needed = use budget entirely** — If stock is 0 for all metals, answer = `floor(budget / sum(comp[i]*cost))`.
   *Không có kho thì dùng hết ngân sách — Nếu stock = 0 cho mọi kim loại, đáp án = `floor(budget / sum(comp[i]*cost))`.\*

---

## Solutions


---

## 🔗 Related Problems

| Problem                                                                                                                                               | Difficulty | Tags          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)                                                                        | Medium     | Binary Search |
| [1011. Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)                               | Medium     | Binary Search |
| [2064. Minimized Maximum of Products Distributed to Any Store](https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/) | Medium     | Binary Search |
| [1283. Find the Smallest Divisor Given a Threshold](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/)                       | Medium     | Binary Search |
