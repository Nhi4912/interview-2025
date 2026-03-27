# Complexity Analysis / Phân Tích Độ Phức Tạp

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Data Structures](./data-structures-theory.md)
> **See also**: [Algorithms Theory](./algorithms-theory.md) | [Data Structures](./data-structures-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn build tính năng "tìm kiếm sản phẩm" cho e-commerce. Với 100 sản phẩm: hoạt động tốt. Với 1 triệu sản phẩm: **browser đơ 30 giây** mỗi lần gõ ký tự.

**Nguyên nhân**: Code dùng nested loop O(n²) — 1 triệu × 1 triệu = 1 nghìn tỷ phép tính.
**Giải pháp**: Thay bằng hash map lookup O(1) — 1 triệu phép tính thay vì 1 nghìn tỷ.

Đây là lý do tại sao mọi cuộc phỏng vấn kỹ thuật đều hỏi về **Big O** — nó là ngôn ngữ chung để đánh giá code có "scale" được không.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Tìm số điện thoại:**

Bạn cần tìm số điện thoại của "Nguyễn Văn A":

- **Danh bạ không sắp xếp** (O(n)): lật từng trang một → 500 trang = 500 lần lật
- **Danh bạ sắp xếp theo tên** (O(log n)): mở giữa → đi đúng nửa → tiếp tục → 10 lần lật cho 500 trang
- **Danh bạ có index theo chữ cái** (O(1)): mở thẳng tab "N" → 1 giây

Big O = "nếu dữ liệu tăng 10x, thời gian tăng bao nhiêu?"

| Kịch bản        | Big O    | 1,000 items   | 1,000,000 items |
| --------------- | -------- | ------------- | --------------- |
| Hash map lookup | O(1)     | 1 op          | 1 op            |
| Binary search   | O(log n) | 10 ops        | 20 ops          |
| Linear scan     | O(n)     | 1,000 ops     | 1,000,000 ops   |
| Nested loop     | O(n²)    | 1,000,000 ops | 10¹² ops (đơ!)  |

**Tại sao phải biết Complexity Analysis?**

- Viết code chạy được ≠ viết code chạy nhanh. Phỏng vấn luôn hỏi: "Time complexity là gì?"
- Giúp chọn đúng data structure: cần tìm nhanh → HashMap, cần sort → TreeSet
- Phát hiện bottleneck trước khi production bị sập

---

## Concept Map / Bản Đồ Khái Niệm

```
       [DATA STRUCTURES]
       (Array, HashMap, Tree...)
              │
              ▼
    [COMPLEXITY ANALYSIS]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[Time]   [Space]   [Amortized]
 O(1)     O(1)      ArrayList
 O(logn)  O(n)      append()
 O(n)     O(n²)
 O(n²)
    │
    ▼
[Asymptotic Notations]
 Big O (worst) | Theta (average) | Omega (best)
    │
    ▼
[Master Theorem]
 Analyze recursive algorithms: T(n) = aT(n/b) + f(n)
    │
    ▼
[ALGORITHMS THEORY]
 Choose right algorithm for the complexity you need
```

---

---

## Overview / Tổng Quan (Structured)

| #   | Concept                        | Role                                                    | Interview Weight        |
| --- | ------------------------------ | ------------------------------------------------------- | ----------------------- |
| 1   | Big O Notation                 | Ngôn ngữ chung đo scalability — worst-case upper bound  | ⭐⭐⭐⭐⭐ Mọi câu hỏi  |
| 2   | Time Complexity Classes        | O(1)→O(n!)— biết class = chọn đúng algorithm            | ⭐⭐⭐⭐⭐              |
| 3   | Space Complexity               | Bộ nhớ algorithm dùng — call stack + auxiliary          | ⭐⭐⭐⭐ Thường bị quên |
| 4   | Asymptotic Notations (Ω, Θ, O) | Big O (worst), Omega (best), Theta (tight) — toàn cảnh  | ⭐⭐⭐ Theory           |
| 5   | Amortized Analysis             | Avg cost per op over sequence — ArrayList resize = O(1) | ⭐⭐⭐⭐ Senior         |
| 6   | Master Theorem                 | Phân tích recurrence T(n) = aT(n/b)+f(n) cho D&C        | ⭐⭐⭐ Theory           |
| 7   | Practical Analysis             | Phân tích code thực: nested loop, memo, trade-off       | ⭐⭐⭐⭐⭐ Live coding  |

**Quan hệ:** Big O (1) → Time Classes (2) → Space (3) tạo "vocabulary". Asymptotic (4) mở rộng vocabulary. Amortized (5) + Master (6) là công cụ nâng cao. Practical Analysis (7) kết nối tất cả vào live coding.

---

## Core Concepts — Phase 2 Deep Dive

### Concept 1: Big O Notation

🪝 **Memory Hook:** Big O = "nếu data × 10, thời gian × bao nhiêu?" — nghĩ đến **cái phễu lọc**: Big O giữ lại chỉ worst-case growth rate, bỏ hết constants.

**Why exists / Tại sao tồn tại:**

- Level 1: Để so sánh 2 algorithm mà không cần benchmark trên hardware cụ thể
- Level 2: Vì constants phụ thuộc machine (CPU cache, RAM speed) → Big O loại bỏ hardware dependency, chỉ giữ mathematical growth pattern
- Level 3: Vì khi n đủ lớn, growth rate luôn dominate constants — O(n²) với constant 0.001 vẫn thua O(n log n) với constant 1000 khi n > 10⁶

**Layer 1 — Simple Analogy / Lớp 1:**
Big O giống **tốc độ tối đa trên biển báo giao thông**: nó cho biết worst case bạn có thể đi bao nhanh, không phải speed trung bình. O(n²) = "đường này ít nhất sẽ mất n² bước khi input lớn".

**Layer 2 — Mechanics / Lớp 2:**

```
Formal: f(n) = O(g(n)) ⟺ ∃ c > 0, n₀ > 0: f(n) ≤ c·g(n) ∀ n ≥ n₀

Rules for calculating:
┌─────────────────────────────────────┐
│ 1. Drop constants: 5n → O(n)       │
│ 2. Keep dominant:  n²+n → O(n²)    │
│ 3. Multiply nested: O(n)×O(m)      │
│ 4. Add sequential: O(n)+O(m)       │
│ 5. Different inputs ≠ same variable │
└─────────────────────────────────────┘

Ví dụ:
  3n² + 5n + 100 = O(n²)   ← drop 5n, 100, constant 3
  log₂(n) = O(log n)        ← base doesn't matter (constant factor)
```

**Layer 3 — Edge Cases / Lớp 3:**

- `O(n + m)` ≠ `O(n)` khi m không phụ thuộc n — common interview trap
- `O(n log n)` ở sorting: worst-case chỉ đúng cho comparison-based sort (Radix = O(nk))
- Big O hides constant: `O(n)` với 10⁹ constant operations vẫn là O(n) nhưng thực tế rất chậm
- Log base: O(log₂ n) = O(log₁₀ n) vì chỉ khác constant factor

| Sai lầm                  | Tại sao sai                | Đúng là                                                                      |
| ------------------------ | -------------------------- | ---------------------------------------------------------------------------- |
| O(2n) = O(2n)            | Constants bị drop          | O(2n) = O(n)                                                                 |
| Nested loop = luôn O(n²) | Inner loop có thể giảm dần | Phải cộng: i=0..n, j=0..i → n(n-1)/2 = O(n²) nhưng j=1..n,j\*=2 → O(n log n) |
| O(n+m) = O(n)            | m independent              | O(n+m) giữ nguyên nếu m ≠ O(n)                                               |

🎯 **Interview Pattern:** "Analyze this code's time complexity" — đếm iterations từ trong ra ngoài, xác định loop variable relationship.

🔗 **Knowledge Chain:** Big O → Time Classes → Algorithm Selection → Live Coding Optimization

---

### Concept 2: Time Complexity Classes

🪝 **Memory Hook:** "1, log, n, nlog, n², 2ⁿ, n!" — nghĩ **tầng thang bộ**: mỗi bước lên = slow down dramatically. O(n²) = tầng 5, O(2ⁿ) = tầng 50 — bạn KHÔNG muốn lên đó.

**Why exists / Tại sao tồn tại:**

- Level 1: Để biết algorithm nào acceptable cho input size cụ thể
- Level 2: Vì competitive programming / interview có time limit (~10⁸ operations/second). n=10⁵ → O(n²) = 10¹⁰ = TLE, O(n log n) = 1.7×10⁶ = OK
- Level 3: Input size hints algorithm class: n≤20 → O(2ⁿ/n!), n≤5000 → O(n²), n≤10⁶ → O(n log n), n≤10⁸ → O(n)

**Layer 1 — Simple Analogy / Lớp 1:**
Tìm tên trong sổ 1000 người: O(1) = biết chính xác trang → 1 lần lật. O(log n) = mở giữa rồi chia đôi → 10 lần. O(n) = lật từng trang → 1000 lần. O(n²) = so sánh mỗi người với mỗi người → 1 triệu lần. O(2ⁿ) = kiểm tra mọi subset → vũ trụ hết tuổi thọ.

**Layer 2 — Mechanics / Lớp 2:**

```
n = input size → Maximum acceptable complexity:

┌─────────┬─────────────┬──────────────────────┐
│ n       │ Max Big O   │ Typical Algorithm    │
├─────────┼─────────────┼──────────────────────┤
│ ≤ 10    │ O(n!)       │ Permutation brute    │
│ ≤ 20    │ O(2ⁿ)       │ Bitmask DP           │
│ ≤ 500   │ O(n³)       │ Floyd-Warshall       │
│ ≤ 5000  │ O(n²)       │ DP 2D, nested loop   │
│ ≤ 10⁶   │ O(n log n)  │ Sorting, segment tree│
│ ≤ 10⁸   │ O(n)        │ Linear scan          │
│ ≤ 10¹⁸  │ O(log n)    │ Binary search, math  │
└─────────┴─────────────┴──────────────────────┘
```

**Layer 3 — Edge Cases / Lớp 3:**

- Quick Sort: average O(n log n), worst O(n²) — pivot = min/max every time. Production: randomized pivot hoặc intro sort
- Hash Map: average O(1), worst O(n) khi all keys collide → linked list degeneration
- O(n log n) là lower bound cho comparison-based sorting (proven by decision tree)

| Sai lầm                      | Tại sao sai          | Đúng là                                                 |
| ---------------------------- | -------------------- | ------------------------------------------------------- |
| "O(n log n) sort mọi thứ"    | Chỉ comparison-based | Counting/Radix sort = O(nk) khi range biết trước        |
| "Quick Sort luôn O(n log n)" | Worst case O(n²)     | Average O(n log n), worst O(n²) — dùng randomized pivot |
| "Hash map O(1) guaranteed"   | Collision = O(n)     | Average O(1), worst O(n) — resize + good hash function  |

🎯 **Interview Pattern:** "Can you optimize this?" — nhận diện n size → target complexity class → chọn algorithm phù hợp.

🔗 **Knowledge Chain:** Time Classes → Algorithm Choice → Data Structure Selection → Live Optimization

---

### Concept 3: Space Complexity

🪝 **Memory Hook:** "Time = tiền, Space = nhà" — bạn có thể tiêu tiền nhiều hơn (chờ lâu hơn) nhưng nhà chỉ có bao nhiêu phòng (RAM limited). Space complexity = đếm số phòng algorithm cần thuê.

**Why exists / Tại sao tồn tại:**

- Level 1: Server có RAM hữu hạn — algorithm dùng O(n²) space với n=10⁶ = 10¹² bytes = 1TB → crash
- Level 2: Call stack mặc định ~1MB (8000 frames) → recursive depth > 10⁴ = stack overflow. Space analysis phát hiện trước khi production crash
- Level 3: Cache locality matters — O(n) space nhưng sequential access >> O(n) space random access vì CPU cache line

**Layer 1 — Simple Analogy / Lớp 1:**
Space complexity giống **số bàn cần cho tiệc**: 10 khách cần 2 bàn (O(1) extra). 100 khách cần 20 bàn (O(n)). Nếu mỗi khách cần bàn riêng với mỗi khách khác = O(n²) bàn — hết chỗ.

**Layer 2 — Mechanics / Lớp 2:**

```
Space = Auxiliary space + Input space (thường chỉ count auxiliary)

Common patterns:
┌──────────────────────────────────────────────────┐
│ Pattern                  │ Space    │ Example    │
├──────────────────────────┼──────────┼────────────┤
│ In-place swap            │ O(1)     │ Bubble sort│
│ Two pointers             │ O(1)     │ Palindrome │
│ Binary search recursive  │ O(log n) │ Call stack │
│ Hash set/map             │ O(n)     │ Two Sum    │
│ DP table 1D              │ O(n)     │ Fibonacci  │
│ Merge sort               │ O(n)     │ Temp array │
│ DP table 2D              │ O(n²)   │ LCS, Edit  │
│ Adjacency matrix         │ O(V²)   │ Dense graph│
└──────────────────────────┴──────────┴────────────┘

Recursive space = max call stack depth:
  fibonacci(n) → O(n) depth
  merge sort(n) → O(log n) depth, O(n) auxiliary = O(n) total
```

**Layer 3 — Edge Cases / Lớp 3:**

- Tail recursion optimization: compiler convert recursion → loop → O(1) space. Nhưng JS/Python không hỗ trợ TCO → vẫn O(n)
- DP space optimization: rolling array giảm O(n²) → O(n) khi chỉ cần 2 rows trước
- String immutability: `str1 + str2` trong Java/Python tạo new string → O(n) mỗi concatenation. n lần = O(n²)

| Sai lầm                 | Tại sao sai                   | Đúng là                                                                  |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------ |
| Quên đếm call stack     | Recursion dùng O(depth) stack | Luôn add stack depth vào space analysis                                  |
| "In-place = O(0) space" | Vẫn dùng O(1) variables       | In-place = O(1) auxiliary, không phải zero                               |
| "Merge sort O(1) space" | Cần O(n) temp array           | Merge sort = O(n) space. In-place merge = O(n log n) space nhưng complex |

🎯 **Interview Pattern:** "Can you solve this with O(1) extra space?" — Two pointers, in-place swap, bit manipulation.

🔗 **Knowledge Chain:** Space Complexity → Memory Management → Cache Optimization → Production Performance

---

### Concept 4: Asymptotic Notations (Ω, Θ, O)

🪝 **Memory Hook:** "O = ceiling, Ω = floor, Θ = exact fit" — 3 cách đo chiều cao cửa: O = không cao hơn 2m (upper bound), Ω = không thấp hơn 1.8m (lower bound), Θ = chính xác 1.9m (tight).

**Why exists / Tại sao tồn tại:**

- Level 1: Big O chỉ cho worst case — đôi khi cần biết best case (Ω) hoặc average (Θ) để đánh giá toàn diện
- Level 2: Quicksort: O(n²) nghe tệ, nhưng Θ(n log n) average + Ω(n log n) best → thực tế rất tốt. Chỉ dùng Big O bỏ lỡ insight này

**Layer 1 — Simple Analogy / Lớp 1:**
Dự đoán thời gian đi làm: O = "tối đa 45 phút" (tắc đường max). Ω = "ít nhất 15 phút" (đường trống). Θ = "thường 25-30 phút" (trung bình).

**Layer 2 — Mechanics / Lớp 2:**

```
Big O:     f(n) ≤ c·g(n)     ← Upper bound (worst case)
Big Omega: f(n) ≥ c·g(n)     ← Lower bound (best case)
Big Theta: c₁·g(n) ≤ f(n) ≤ c₂·g(n) ← Tight bound (exact)

Algorithm  │ Ω (Best)  │ Θ (Average) │ O (Worst)
───────────┼───────────┼─────────────┼──────────
Quicksort  │ Ω(n logn) │ Θ(n log n)  │ O(n²)
Mergesort  │ Ω(n logn) │ Θ(n log n)  │ O(n logn)
Linear Srch│ Ω(1)      │ Θ(n)        │ O(n)
Hash lookup│ Ω(1)      │ Θ(1)        │ O(n)
```

**Layer 3 — Edge Cases / Lớp 3:**

- Interview thường chỉ hỏi Big O (worst case) — nhưng mention average case khi relevant (QuickSort)
- Comparison-based sorting: Ω(n log n) lower bound proven → không thể sort nhanh hơn O(n log n) bằng comparison
- Big O ≠ worst case: technically Big O just means upper bound. Nói "O(n) best case" technically đúng nhưng confusing

| Sai lầm                  | Tại sao sai                                   | Đúng là                                                          |
| ------------------------ | --------------------------------------------- | ---------------------------------------------------------------- |
| "Big O = worst case"     | Big O = upper bound, có thể dùng cho mọi case | Big O commonly used cho worst case nhưng formally là upper bound |
| "Quicksort O(n²) nên dở" | Average Θ(n log n) + constants nhỏ            | Quicksort Θ(n log n) average, practical fast nhờ cache-friendly  |

🎯 **Interview Pattern:** "What's the best/worst/average case?" — phân biệt 3 notations cho cùng algorithm.

🔗 **Knowledge Chain:** Asymptotic Notations → Sorting Complexity → Algorithm Comparison → Selection Strategy

---

### Concept 5: Amortized Analysis

🪝 **Memory Hook:** "Trả góp nhà" — mỗi tháng trả ít (O(1)), nhưng đôi khi trả lớn (resize = O(n)). Tính trung bình mỗi tháng = vẫn affordable. Amortized = average over sequence, NOT per operation.

**Why exists / Tại sao tồn tại:**

- Level 1: ArrayList.append() đôi khi O(n) khi resize — nếu chỉ nhìn worst case thì "append = O(n)" → misleading. Amortized chứng minh average = O(1)
- Level 2: Nhiều data structures dùng lazy operations (splay tree, Fibonacci heap, union-find) — worst single operation tệ nhưng amortized tốt
- Level 3: Accounting method / Banker's method / Potential method — 3 formal proofs cho amortized bounds

**Layer 1 — Simple Analogy / Lớp 1:**
Bạn tiết kiệm mỗi ngày 10k. Đến ngày thứ 30, bạn mua giày 200k. Average cost per day = (29×10k + 200k)/30 ≈ 16k/day — vẫn affordable. Amortized analysis cho ArrayList: 99 lần append O(1), 1 lần resize O(n), average = O(1).

**Layer 2 — Mechanics / Lớp 2:**

```
Dynamic Array resize analysis:
Capacity: 1 → 2 → 4 → 8 → 16 → ... → n
Copies at resize: 1 + 2 + 4 + 8 + ... + n = 2n - 1

Total cost for n appends = n (regular) + 2n-1 (copies) = 3n-1
Amortized per append = (3n-1)/n ≈ 3 = O(1) ✓

Accounting method ("charge" each append $3):
├── $1 for current append
├── $1 to pre-pay for copying THIS element later
└── $1 to pre-pay for copying an OLD element
→ Bank balance always ≥ 0 → O(1) amortized proven

Other examples:
├── Union-Find (path compression): O(α(n)) ≈ O(1) amortized
├── HashMap rehash: occasional O(n) → O(1) amortized
└── Fibonacci Heap decrease-key: O(1) amortized
```

**Layer 3 — Edge Cases / Lớp 3:**

- Amortized ≠ average case (probabilistic). Amortized là deterministic guarantee over sequence
- Resize factor matters: 2× → O(1) amortized, 1.01× → O(1) amortized nhưng constant lớn, +1 → O(n) amortized (geometric vs arithmetic growth)
- Go slice growth factor: <256 → 2×, ≥256 → 1.25× + 192 → amortized O(1) nhưng less memory waste

| Sai lầm                    | Tại sao sai                                        | Đúng là                                                 |
| -------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| "Amortized = average case" | Average = probabilistic, amortized = deterministic | Amortized guarantee trên sequence, không phải single op |
| "Resize by +1 also O(1)"   | Arithmetic growth = O(n) total copies              | Phải geometric growth (×2) để amortized O(1)            |

🎯 **Interview Pattern:** "Is this operation O(1) or O(n)?" — nhận diện amortized pattern: append, rehash, splay.

🔗 **Knowledge Chain:** Amortized → Dynamic Array Internals → HashMap Rehash → Production Memory Planning

---

### Concept 6: Master Theorem

🪝 **Memory Hook:** "T(n) = a con × T(n/b) + f(n) merge" — **chia pizza**: chia thành a phần, mỗi phần nhỏ đi b lần, tốn f(n) công chia. So sánh f(n) vs n^(log_b(a)) → ai thắng quyết định complexity.

**Why exists / Tại sao tồn tại:**

- Level 1: Để phân tích divide-and-conquer algorithms (merge sort, binary search, Strassen) mà không phải "unroll" recursion thủ công
- Level 2: Recursion tree analysis tốn công → Master Theorem cho instant answer bằng so sánh f(n) với n^(log_b(a))

**Layer 1 — Simple Analogy / Lớp 1:**
**Cuộc chiến giữa "chia" và "gộp"**: Nếu chia (a subproblems) tốn kém hơn gộp (f(n)) → complexity do chia quyết định (Case 1). Nếu gộp tốn kém hơn → complexity do gộp quyết định (Case 3). Nếu bằng nhau → nhân thêm log n (Case 2).

**Layer 2 — Mechanics / Lớp 2:**

```
T(n) = aT(n/b) + f(n)
Compare f(n) with n^(log_b(a)):

Case 1: f(n) = O(n^(log_b(a) - ε))  → T(n) = Θ(n^(log_b(a)))     [Chia thắng]
Case 2: f(n) = Θ(n^(log_b(a)))      → T(n) = Θ(n^(log_b(a)) logn) [Hòa → ×log]
Case 3: f(n) = Ω(n^(log_b(a) + ε))  → T(n) = Θ(f(n))             [Gộp thắng]

Quick reference:
┌──────────────┬─────┬─────┬──────────────┬──────────┐
│ Algorithm    │  a  │  b  │ log_b(a)     │ Result   │
├──────────────┼─────┼─────┼──────────────┼──────────┤
│ Binary Search│  1  │  2  │ 0            │ O(log n) │
│ Merge Sort   │  2  │  2  │ 1            │ O(n logn)│
│ Karatsuba    │  3  │  2  │ 1.58         │ O(n^1.58)│
│ Strassen     │  7  │  2  │ 2.81         │ O(n^2.81)│
└──────────────┴─────┴─────┴──────────────┴──────────┘
```

**Layer 3 — Edge Cases / Lớp 3:**

- Master Theorem không áp dụng khi f(n) không polynomial (e.g., f(n) = n log n cho T(n) = 2T(n/2) + n log n → cần Akra-Bazzi)
- Subproblems phải equal size: T(n) = T(n/3) + T(2n/3) + n → không dùng Master Theorem được

| Sai lầm                     | Tại sao sai                          | Đúng là                                               |
| --------------------------- | ------------------------------------ | ----------------------------------------------------- |
| "Mọi recursion dùng Master" | Chỉ áp dụng T(n) = aT(n/b)+f(n) form | Unequal splits, non-polynomial f(n) cần other methods |
| "Case 2 luôn = O(n log n)"  | Case 2 = Θ(n^(log_b(a)) × log n)     | Nếu log_b(a) ≠ 1 thì kết quả khác                     |

🎯 **Interview Pattern:** "What's the complexity of this recursive function?" — identify a, b, f(n) → apply Master Theorem.

🔗 **Knowledge Chain:** Master Theorem → D&C Algorithms → Merge/Quick Sort Analysis → Recursive Problem Solving

---

### Concept 7: Practical Analysis (Analyzing Real Code)

🪝 **Memory Hook:** "Đọc code = đếm lặp từ trong ra ngoài" — như đếm **búp bê Matryoshka**: mở búp bê ngoài (outer loop n), bên trong búp bê giữa (inner loop m), bên trong nữa (innermost k) → n × m × k.

**Why exists / Tại sao tồn tại:**

- Level 1: Phỏng vấn live coding luôn hỏi "time/space complexity?" sau khi bạn code xong
- Level 2: Real code phức tạp hơn textbook: loop variable phụ thuộc outer loop, early return, memoization, multiple data structures
- Level 3: Constant factor matters in production: O(n) với cache-friendly access >> O(n) với random access. Big O không capture constant nhưng bạn phải biết

**Layer 1 — Simple Analogy / Lớp 1:**
Phân tích code giống **đọc hóa đơn tiệc**: mỗi loop = 1 dòng hóa đơn. Nested loops = nhân dòng. Sequence = cộng dòng. Dominant term = dòng đắt nhất quyết định tổng.

**Layer 2 — Mechanics / Lớp 2:**

```
Analysis patterns:
┌────────────────────────────────────────────────┐
│ Pattern           │ Analysis                   │
├────────────────────┼────────────────────────────┤
│ Sequential loops   │ O(n) + O(m) = O(n+m)      │
│ Nested same var    │ O(n) × O(n) = O(n²)       │
│ Nested diff var    │ O(n) × O(m) = O(n×m)      │
│ Halving inner loop │ O(n) × O(log n)           │
│ Early return       │ O(best) → O(worst)        │
│ Memo + recursion   │ O(subproblems × work each)│
│ BFS/DFS on graph   │ O(V + E)                  │
└────────────────────┴────────────────────────────┘

Trade-off decision framework:
  Memory available? → Yes → HashMap cache → O(n) time, O(n) space
  Memory tight?     → Yes → In-place algo  → O(n²) time, O(1) space
  Real-time system? → Yes → Predictable O(n logn) > avg O(n logn) with O(n²) worst
```

**Layer 3 — Edge Cases / Lớp 3:**

- String concatenation trap: `s += char` in loop = O(n²) total vì immutable string copy mỗi lần
- Hidden O(n) in "O(1)" operations: `array.splice(0,1)` in JS = O(n) shift, không phải O(1)
- Recursive calls with overlapping subproblems WITHOUT memo = exponential. WITH memo = polynomial

| Sai lầm                      | Tại sao sai                      | Đúng là                                            |
| ---------------------------- | -------------------------------- | -------------------------------------------------- |
| "2 sequential loops = O(n²)" | Sequential = cộng, nested = nhân | O(n) + O(n) = O(n), O(n) × O(n) = O(n²)            |
| "s += char in loop is O(n)"  | Mỗi concat tạo new string O(k)   | Total = 1+2+...+n = O(n²). Dùng StringBuilder/join |
| "array.shift() is O(1)"      | Shift mọi element sang trái      | O(n) per shift. Dùng deque nếu cần O(1) pop front  |

🎯 **Interview Pattern:** "What's wrong with this code? How to optimize?" — identify hidden O(n) operations, string concat, unnecessary copies.

🔗 **Knowledge Chain:** Practical Analysis → Live Coding → Code Review → Production Optimization

---

## Table of Contents / Mục Lục

1. [Big O Notation / Ký Hiệu Big O](#big-o-notation--ký-hiệu-big-o)
2. [Time Complexity / Độ Phức Tạp Thời Gian](#time-complexity--độ-phức-tạp-thời-gian)
3. [Space Complexity / Độ Phức Tạp Không Gian](#space-complexity--độ-phức-tạp-không-gian)
4. [Asymptotic Notations / Ký Hiệu Tiệm Cận](#asymptotic-notations--ký-hiệu-tiệm-cận)
5. [Amortized Analysis / Phân Tích Khấu Hao](#amortized-analysis--phân-tích-khấu-hao)
6. [Master Theorem / Định Lý Master](#master-theorem--định-lý-master)
7. [Practical Examples / Ví Dụ Thực Tế](#practical-examples--ví-dụ-thực-tế)
8. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Big O Notation / Ký Hiệu Big O

### Definition / Định Nghĩa

**English:** Big O describes the upper bound of algorithm growth rate, representing worst-case scenario.

**Tiếng Việt:** Big O mô tả giới hạn trên của tốc độ tăng trưởng thuật toán, đại diện cho trường hợp xấu nhất.

### Mathematical Definition / Định Nghĩa Toán Học

```
f(n) = O(g(n)) if there exist positive constants c and n₀ such that:
f(n) ≤ c · g(n) for all n ≥ n₀

f(n) = O(g(n)) nếu tồn tại các hằng số dương c và n₀ sao cho:
f(n) ≤ c · g(n) với mọi n ≥ n₀
```

### Common Complexities / Độ Phức Tạp Phổ Biến

```
Notation    | Name              | Example
------------|-------------------|---------------------------
O(1)        | Constant          | Array access, hash lookup
O(log n)    | Logarithmic       | Binary search
O(n)        | Linear            | Array traversal
O(n log n)  | Linearithmic      | Merge sort, quick sort
O(n²)       | Quadratic         | Nested loops, bubble sort
O(n³)       | Cubic             | Triple nested loops
O(2ⁿ)       | Exponential       | Recursive fibonacci
O(n!)       | Factorial         | Permutations
```

### Growth Rate Comparison / So Sánh Tốc Độ Tăng Trưởng

```
For n = 100:
O(1)      = 1
O(log n)  = 7
O(n)      = 100
O(n log n)= 700
O(n²)     = 10,000
O(2ⁿ)     = 1.27 × 10³⁰
O(n!)     = 9.33 × 10¹⁵⁷
```

---

## Time Complexity / Độ Phức Tạp Thời Gian

### O(1) - Constant Time / Thời Gian Hằng Số

**English:** Operations that take same time regardless of input size.

**Tiếng Việt:** Các thao tác mất cùng thời gian bất kể kích thước đầu vào.

```typescript
// O(1) examples / Ví dụ O(1)
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0]; // Single operation / Thao tác đơn
}

function hashLookup<K, V>(map: Map<K, V>, key: K): V | undefined {
  return map.get(key); // Hash table lookup / Tra cứu bảng băm
}

function swap(arr: number[], i: number, j: number): void {
  [arr[i], arr[j]] = [arr[j], arr[i]]; // Fixed operations / Thao tác cố định
}
```

### O(log n) - Logarithmic Time / Thời Gian Logarit

**English:** Divides problem size by constant factor each iteration.

**Tiếng Việt:** Chia kích thước vấn đề theo hệ số hằng số mỗi lần lặp.

```typescript
// Binary search - O(log n)
function binarySearch(arr: number[], target: number): number {
  let left = 0,
    right = arr.length - 1;

  while (left <= right) {
    // log₂(n) iterations / lần lặp
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Binary tree height / Chiều cao cây nhị phân
function treeHeight(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}
// For balanced tree: O(log n) / Với cây cân bằng: O(log n)
```

### O(n) - Linear Time / Thời Gian Tuyến Tính

**English:** Time grows linearly with input size.

**Tiếng Việt:** Thời gian tăng tuyến tính với kích thước đầu vào.

```typescript
// Array traversal - O(n)
function findMax(arr: number[]): number {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    // n iterations / lần lặp
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// Linear search - O(n)
function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Sum array - O(n)
function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}
```

### O(n log n) - Linearithmic Time / Thời Gian Tuyến Tính Logarit

**English:** Efficient sorting algorithms complexity.

**Tiếng Việt:** Độ phức tạp của thuật toán sắp xếp hiệu quả.

```typescript
// Merge sort - O(n log n)
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid)); // log n levels / cấp
  const right = mergeSort(arr.slice(mid));

  return merge(left, right); // O(n) merge / trộn
}

// Quick sort average case - O(n log n)
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((x) => x < pivot);
  const middle = arr.filter((x) => x === pivot);
  const right = arr.filter((x) => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

### O(n²) - Quadratic Time / Thời Gian Bậc Hai

**English:** Nested iterations over input.

**Tiếng Việt:** Các vòng lặp lồng nhau trên đầu vào.

```typescript
// Bubble sort - O(n²)
function bubbleSort(arr: number[]): number[] {
  for (let i = 0; i < arr.length; i++) {
    // n iterations
    for (let j = 0; j < arr.length - i - 1; j++) {
      // n iterations
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Find all pairs - O(n²)
function findPairs(arr: number[]): number[][] {
  const pairs: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

// Matrix multiplication - O(n³)
function matrixMultiply(a: number[][], b: number[][]): number[][] {
  const n = a.length;
  const result = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}
```

### O(2ⁿ) - Exponential Time / Thời Gian Mũ

**English:** Doubles with each additional input element.

**Tiếng Việt:** Tăng gấp đôi với mỗi phần tử đầu vào bổ sung.

```typescript
// Naive fibonacci - O(2ⁿ)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// Each call spawns 2 more calls / Mỗi lời gọi tạo ra 2 lời gọi khác

// Power set - O(2ⁿ)
function powerSet<T>(arr: T[]): T[][] {
  if (arr.length === 0) return [[]];

  const [first, ...rest] = arr;
  const subsetsWithoutFirst = powerSet(rest);
  const subsetsWithFirst = subsetsWithoutFirst.map((subset) => [first, ...subset]);

  return [...subsetsWithoutFirst, ...subsetsWithFirst];
}
```

---

## Space Complexity / Độ Phức Tạp Không Gian

### Definition / Định Nghĩa

**English:** Amount of memory used by algorithm relative to input size.

**Tiếng Việt:** Lượng bộ nhớ được sử dụng bởi thuật toán so với kích thước đầu vào.

### Examples / Ví Dụ

```typescript
// O(1) space - Constant / Hằng số
function sumArray(arr: number[]): number {
  let sum = 0; // Single variable / Biến đơn
  for (const num of arr) {
    sum += num;
  }
  return sum;
}

// O(n) space - Linear / Tuyến tính
function reverseArray<T>(arr: T[]): T[] {
  const reversed: T[] = []; // New array of size n / Mảng mới kích thước n
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}

// O(n) space - Recursive call stack / Ngăn xếp gọi đệ quy
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // n recursive calls / lời gọi đệ quy
}

// O(n²) space - 2D array / Mảng 2D
function createMatrix(n: number): number[][] {
  return Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));
}

// O(log n) space - Binary search recursive / Tìm kiếm nhị phân đệ quy
function binarySearchRecursive(
  arr: number[],
  target: number,
  left = 0,
  right = arr.length - 1,
): number {
  if (left > right) return -1;
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}
// Call stack depth: log n / Độ sâu ngăn xếp gọi: log n
```

---

## Asymptotic Notations / Ký Hiệu Tiệm Cận

### Big O (O) - Upper Bound / Giới Hạn Trên

**English:** Worst-case complexity, upper bound on growth rate.

**Tiếng Việt:** Độ phức tạp trường hợp xấu nhất, giới hạn trên của tốc độ tăng trưởng.

```
f(n) = O(g(n)) means f(n) ≤ c · g(n) for large n
```

### Big Omega (Ω) - Lower Bound / Giới Hạn Dưới

**English:** Best-case complexity, lower bound on growth rate.

**Tiếng Việt:** Độ phức tạp trường hợp tốt nhất, giới hạn dưới của tốc độ tăng trưởng.

```
f(n) = Ω(g(n)) means f(n) ≥ c · g(n) for large n
```

### Big Theta (Θ) - Tight Bound / Giới Hạn Chặt

**English:** Average-case complexity, both upper and lower bound.

**Tiếng Việt:** Độ phức tạp trường hợp trung bình, cả giới hạn trên và dưới.

```
f(n) = Θ(g(n)) means c₁ · g(n) ≤ f(n) ≤ c₂ · g(n) for large n
```

### Example Analysis / Phân Tích Ví Dụ

```typescript
// Linear search / Tìm kiếm tuyến tính
function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Best case: Ω(1) - target at first position / mục tiêu ở vị trí đầu
// Worst case: O(n) - target at last or not found / mục tiêu ở cuối hoặc không tìm thấy
// Average case: Θ(n) - on average check n/2 elements / trung bình kiểm tra n/2 phần tử
```

---

## Amortized Analysis / Phân Tích Khấu Hao

### Definition / Định Nghĩa

**English:** Average time per operation over a sequence of operations, accounting for expensive operations that occur rarely.

**Tiếng Việt:** Thời gian trung bình mỗi thao tác trên một chuỗi thao tác, tính đến các thao tác tốn kém xảy ra hiếm khi.

### Dynamic Array Example / Ví Dụ Mảng Động

```typescript
class DynamicArray<T> {
  private items: T[];
  private capacity: number;
  private size: number;

  constructor() {
    this.capacity = 1;
    this.items = new Array(this.capacity);
    this.size = 0;
  }

  push(item: T): void {
    if (this.size === this.capacity) {
      this.resize(); // O(n) but rare / nhưng hiếm
    }
    this.items[this.size++] = item; // O(1) most of time / hầu hết thời gian
  }

  private resize(): void {
    this.capacity *= 2;
    const newItems = new Array(this.capacity);
    for (let i = 0; i < this.size; i++) {
      newItems[i] = this.items[i];
    }
    this.items = newItems;
  }
}

/*
Analysis / Phân tích:
- Individual push: O(1) or O(n)
- Resize happens at: 1, 2, 4, 8, 16, ..., n
- Total cost for n pushes: n + (1 + 2 + 4 + ... + n) < 3n
- Amortized cost per push: O(1)
*/
```

---

## Master Theorem / Định Lý Master

### Definition / Định Nghĩa

**English:** Provides asymptotic analysis for divide-and-conquer recurrences.

**Tiếng Việt:** Cung cấp phân tích tiệm cận cho các quan hệ đệ quy chia để trị.

### Formula / Công Thức

```
T(n) = aT(n/b) + f(n)

where:
a = number of subproblems / số vấn đề con
b = factor by which problem size is reduced / hệ số giảm kích thước vấn đề
f(n) = cost of work outside recursive calls / chi phí công việc ngoài lời gọi đệ quy
```

### Cases / Các Trường Hợp

```
Case 1: If f(n) = O(n^(log_b(a) - ε)) for some ε > 0
        Then T(n) = Θ(n^(log_b(a)))

Case 2: If f(n) = Θ(n^(log_b(a)))
        Then T(n) = Θ(n^(log_b(a)) · log n)

Case 3: If f(n) = Ω(n^(log_b(a) + ε)) for some ε > 0
        and af(n/b) ≤ cf(n) for some c < 1
        Then T(n) = Θ(f(n))
```

### Examples / Ví Dụ

```typescript
// Binary search: T(n) = T(n/2) + O(1)
// a=1, b=2, f(n)=O(1)
// log_b(a) = log_2(1) = 0
// f(n) = O(1) = O(n^0) = Θ(n^(log_b(a)))
// Case 2: T(n) = Θ(log n)

// Merge sort: T(n) = 2T(n/2) + O(n)
// a=2, b=2, f(n)=O(n)
// log_b(a) = log_2(2) = 1
// f(n) = O(n) = Θ(n^(log_b(a)))
// Case 2: T(n) = Θ(n log n)

// Karatsuba multiplication: T(n) = 3T(n/2) + O(n)
// a=3, b=2, f(n)=O(n)
// log_b(a) = log_2(3) ≈ 1.585
// f(n) = O(n) = O(n^1) < O(n^1.585)
// Case 1: T(n) = Θ(n^1.585)
```

---

## Practical Examples / Ví Dụ Thực Tế

### Analyzing Real Code / Phân Tích Code Thực Tế

```typescript
// Example 1: Nested loops with different ranges
function example1(n: number): void {
  for (let i = 0; i < n; i++) {
    // n iterations
    for (let j = 0; j < i; j++) {
      // 0, 1, 2, ..., n-1 iterations
      console.log(i, j);
    }
  }
}
// Total iterations: 0 + 1 + 2 + ... + (n-1) = n(n-1)/2
// Time complexity: O(n²)

// Example 2: Logarithmic inner loop
function example2(n: number): void {
  for (let i = 0; i < n; i++) {
    // n iterations
    for (let j = 1; j < n; j *= 2) {
      // log n iterations
      console.log(i, j);
    }
  }
}
// Time complexity: O(n log n)

// Example 3: Multiple independent loops
function example3(n: number): void {
  for (let i = 0; i < n; i++) {
    // O(n)
    console.log(i);
  }

  for (let i = 0; i < n; i++) {
    // O(n)
    for (let j = 0; j < n; j++) {
      // O(n)
      console.log(i, j);
    }
  }
}
// Time complexity: O(n) + O(n²) = O(n²)

// Example 4: Recursive with memoization
function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);
  return result;
}
// Without memo: O(2ⁿ) time, O(n) space
// With memo: O(n) time, O(n) space
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### 🟡 [Mid] Question 1: Analyze this code complexity

```typescript
function mystery(n: number): number {
  let count = 0;
  for (let i = n; i > 0; i = Math.floor(i / 2)) {
    for (let j = 0; j < i; j++) {
      count++;
    }
  }
  return count;
}
```

**English Answer:**

- Outer loop: i = n, n/2, n/4, ..., 1 → log n iterations
- Inner loop: n + n/2 + n/4 + ... + 1 ≈ 2n iterations total
- Time complexity: O(n)

**Tiếng Việt:**

- Vòng ngoài: i = n, n/2, n/4, ..., 1 → log n lần lặp
- Vòng trong: n + n/2 + n/4 + ... + 1 ≈ 2n lần lặp tổng
- Độ phức tạp thời gian: O(n)

### 🟡 [Mid] Question 2: Space vs Time trade-off

**English Answer:**
Often can trade space for time:

- **Memoization**: Store results, O(n) space for O(n) time
- **Hash tables**: O(n) space for O(1) lookup
- **Precomputation**: Store results, instant lookup

**Tiếng Việt:**
Thường có thể đánh đổi không gian cho thời gian:

- **Ghi nhớ**: Lưu kết quả, O(n) không gian cho O(n) thời gian
- **Bảng băm**: O(n) không gian cho O(1) tra cứu
- **Tính toán trước**: Lưu kết quả, tra cứu tức thì

---

## Key Takeaways / Điểm Chính

**English:**

1. Big O describes worst-case upper bound
2. Focus on dominant term, drop constants
3. Analyze both time and space complexity
4. Amortized analysis for sequences of operations
5. Master theorem for divide-and-conquer
6. Trade-offs between time and space

**Tiếng Việt:**

1. Big O mô tả giới hạn trên trường hợp xấu nhất
2. Tập trung vào số hạng chi phối, bỏ hằng số
3. Phân tích cả độ phức tạp thời gian và không gian
4. Phân tích khấu hao cho chuỗi thao tác
5. Định lý Master cho chia để trị
6. Đánh đổi giữa thời gian và không gian

---

[← Previous: Algorithms](./algorithms-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Design Patterns →](./data-structures-theory.md)

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: What is Big O notation and why does it matter? / Big O là gì và tại sao quan trọng? 🟢 Junior

**A:** Big O describes algorithm performance as input size n grows — ignoring constants and lower-order terms.

```
Common complexities (best → worst):
O(1)       Constant    Array index access, hash lookup
O(log n)   Logarithmic Binary search, balanced BST operations
O(n)       Linear      Linear scan, single loop
O(n log n) Linearithmic Merge sort, heap sort (optimal comparison sort)
O(n²)      Quadratic   Bubble/insertion sort, nested loops
O(2ⁿ)      Exponential Fibonacci naive recursion, subset enumeration
O(n!)      Factorial   Permutations, brute-force TSP

Visual growth comparison (n=1000):
O(1)       → 1 operation
O(log n)   → 10 operations
O(n)       → 1,000 operations
O(n log n) → 10,000 operations
O(n²)      → 1,000,000 operations  ← often unacceptable at scale
O(2ⁿ)      → 10^301 operations     ← computationally infeasible
```

**Rules for calculating Big O:**

```
1. Drop constants:   O(3n) → O(n)
2. Drop lower terms: O(n² + n) → O(n²)
3. Different inputs: O(n) for array A + O(m) for array B = O(n + m), NOT O(n²)
4. Nested loops:     O(n) × O(n) = O(n²) — only if both depend on same n
```

**Best/Average/Worst case:**

```
Algorithm    Best      Average   Worst
Quicksort    O(n logn) O(n logn) O(n²)  ← pivot always min/max
Mergesort    O(n logn) O(n logn) O(n logn) — always predictable
Binary search O(1)     O(log n)  O(log n)
Hash lookup  O(1)      O(1)      O(n)   ← all keys collide
```

**Điểm quan trọng:** Big O đo lường scalability, không phải absolute speed. O(log n) đánh bại O(n) khi n lớn dù constant factor của O(log n) lớn hơn. Trong interview, luôn phân tích cả time và space complexity.

### Q: How do you analyze space complexity? / Phân tích space complexity như thế nào? 🟡 Mid

**A:**

```
Space complexity = extra memory your algorithm uses (beyond input)

Common patterns:
O(1)    Constant space: use fixed variables, in-place operations
        Example: two-pointer, sliding window, bubble sort

O(log n) Recursive call stack in balanced tree/binary search
        Example: binary search recursion → log n stack frames

O(n)    Store copy of input, or output proportional to n
        Example: creating new array, hash map of all elements

O(n²)   2D matrix proportional to input
        Example: DP table for sequence alignment

Recursive algorithms — count call stack depth:
  fibonacci(n) → depth n → O(n) space
  binary search(n) → depth log n → O(log n) space
  merge sort → depth log n levels → O(n) total (merge step)

Space vs Time tradeoff:
  Naive:     O(n²) time, O(1) space
  Optimized: O(n) time, O(n) space  ← hash map as cache
  Example: Two Sum
    Brute force: nested loop O(n²) time, O(1) space
    Hash map: O(n) time, O(n) space (store seen values)
```

**Điểm interview:** Space complexity thường bị quên. Luôn mention cả time và space. Nếu dùng recursion, mention call stack space. Trade-off thường là O(n) space đổi lấy O(n) time improvement.

### Q: What is amortized analysis? Give an example / Phân tích amortized là gì? 🔴 Senior

**A:** Amortized analysis = average cost per operation over a sequence of N operations, even if some operations are expensive.

```
Classic example: Dynamic Array (ArrayList/Go slice)

When append() causes resize:
├── Allocate 2× current capacity
├── Copy all elements to new array
└── This resize is O(n) — expensive!

But how often does resize happen?
  capacity: 1 → 2 → 4 → 8 → 16 → 32 → ...
  copies:   1 + 2 + 4 + 8 + 16 = 31 total copies for 16 elements
  Average copies per append = 31/16 ≈ 2 → O(1) amortized!

Formal accounting method:
  "Charge" each append $3:
  ├── $1 for the current append
  ├── $1 to pay for future copy of this element
  └── $1 to pay for copying an old element when resize happens
  → Bank account always positive → O(1) amortized

Other amortized examples:
  Stack with push/pop + getMin: O(1) amortized with auxiliary stack
  Fibonacci heap: decrease-key O(1) amortized
  Union-Find (path compression): O(α(n)) ≈ O(1) amortized
  HashMap: occasional O(n) rehash → O(1) amortized insert
```

**Điểm senior:** Amortized khác với average-case (probabilistic). Amortized là guarantee về sequence of operations, không phải single operation. Thường xuất hiện trong data structures với lazy operations (resize, consolidation, path compression).

---

## Interview Q&A Summary / Tổng Hợp Q&A Phỏng Vấn

| #   | Question                          | Difficulty | Core Concept       | Key Signal                                                      |
| --- | --------------------------------- | ---------- | ------------------ | --------------------------------------------------------------- |
| 1   | Analyze mystery() loop complexity | 🟡 Mid     | Practical Analysis | Inner loop geometric sum = O(n), not O(n log n)                 |
| 2   | Space vs Time trade-off           | 🟡 Mid     | Space Complexity   | HashMap O(n) space → O(1) lookup. Mention trade-off proactively |
| 3   | What is Big O and why?            | 🟢 Junior  | Big O Notation     | Growth rate comparison, drop constants, dominant term           |
| 4   | How to analyze space complexity?  | 🟡 Mid     | Space Complexity   | Count auxiliary + call stack. Mention recursive depth           |
| 5   | What is amortized analysis?       | 🔴 Senior  | Amortized          | Dynamic array resize proof. Deterministic ≠ probabilistic avg   |

**Distribution:** 🟢 1 | 🟡 3 | 🔴 1

---

## Cold Call Simulation / Mô Phỏng Cold Call

> **⚡ "Bạn có hàm dùng 2 nested loops, mỗi loop chạy n lần. Complexity là gì? Optimize được không?"**

**30-second answer:**
"Two nested loops each running n times = O(n²). To optimize, I'd look at what the inner loop does — if it's searching, replace with a hash map for O(1) lookup, reducing total to O(n). If it's comparing pairs, consider sorting first O(n log n) then two pointers O(n) = O(n log n) total."

**Follow-up: "Nếu inner loop chạy j = 1 → n, j \*= 2 thay vì j = 0 → n, thì sao?"**
"Inner loop halves = O(log n) iterations. Total = outer O(n) × inner O(log n) = O(n log n). This pattern appears in algorithms like heap operations and certain divide-and-conquer approaches."

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời 5 câu sau:

| #   | Type           | Question                                                                                                      |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | 🔄 Retrieval   | Liệt kê 7 complexity classes từ nhanh nhất đến chậm nhất. Với n=10⁶, class nào acceptable?                    |
| 2   | 🎨 Visual      | Vẽ growth curve cho O(1), O(log n), O(n), O(n²) trên cùng 1 trục — đánh dấu điểm n mà O(n²) bắt đầu "bùng nổ" |
| 3   | 🛠️ Application | Code Two Sum: brute force O(n²) → hash map O(n). Phân tích cả time và space cho cả 2 approach                 |
| 4   | 🐛 Debug       | Code: `for i in range(n): s += str(i)` — tại sao time complexity KHÔNG phải O(n)?                             |
| 5   | 🎓 Teach       | Giải thích amortized O(1) của ArrayList.append() cho junior developer — dùng analogy "trả góp"                |

| #   | Key Points                                                                    |
| --- | ----------------------------------------------------------------------------- |
| 1   | O(1)<O(logn)<O(n)<O(nlogn)<O(n²)<O(2ⁿ)<O(n!). n=10⁶→O(n logn) max             |
| 2   | O(n²) "bùng nổ" around n=10³-10⁴ so với O(n logn)                             |
| 3   | Brute: O(n²)/O(1). HashMap: O(n)/O(n). Trade space for time                   |
| 4   | str(i) creates new string, s+= copies → total = 1+2+...+n = O(n²)             |
| 5   | 99 lần trả 10k (O(1)), 1 lần trả 200k (O(n)) → avg 16k/month = O(1) amortized |

💬 **Feynman Prompt:** Giải thích Big O Notation cho người không biết lập trình. Dùng ví dụ tìm kiếm trong danh bạ điện thoại hoặc tìm sách trong thư viện.

📅 **Spaced Repetition / Lịch Ôn Tập:**

- Day 1: Đọc toàn bộ, làm Self-Check
- Day 3: Cold Call + Interview Q&A Summary (che answer)
- Day 7: Core Concepts Memory Hooks + Common Mistakes
- Day 14: Full Self-Check + giải thích Feynman cho bạn
- Day 30: Mock interview — phân tích complexity 3 bài LeetCode random

---

## Connections / Liên Kết

**Same track:**

- ⬅️ [Data Structures](./data-structures-theory.md) — cần hiểu DS để phân tích complexity
- ➡️ [Algorithms Theory](./algorithms-theory.md) — complexity = ngôn ngữ so sánh algorithms
- 🔗 [Concurrency](./07-concurrency-and-parallelism.md) — parallel complexity: work & span model
- 🔗 [Computation Theory](./08-computation-theory.md) — P vs NP, complexity classes
- 🔗 [Information Theory](./information-theory.md) — entropy lower bounds

**Cross track:**

- 🔗 [Go Data Structures](../../be-track/01-golang/06-data-structures-go.md) — Go-specific complexity (slice, map internals)
- 🔗 [SQL Optimization](../../be-track/03-database-advanced/02-indexing-optimization.md) — EXPLAIN ANALYZE = complexity analysis cho DB
- 🔗 [System Design](../../shared/02-system-design/system-design-theory.md) — back-of-envelope estimation dùng complexity
