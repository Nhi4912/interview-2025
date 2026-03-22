# CSS Grid & Flexbox Theory / Lý thuyết sâu về Grid & Flexbox

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Grid & Flexbox Practice](./01-grid-flexbox.md) | [CSS Fundamentals](./00-css-fundamentals.md) | [Modern CSS Features](./06-modern-css-features.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn đang xây dashboard với sidebar, main content, và footer. Designer yêu cầu:
- Sidebar: luôn bằng chiều rộng của nội dung dài nhất bên trong
- Main content: chiếm hết phần còn lại
- Cards trong main: 3 cột trên desktop, 2 trên tablet, 1 trên mobile — **không dùng media query**
- Footer: luôn dính đáy dù content ít

Không biết `max-content`, `minmax(0, 1fr)`, `auto-fit`, hay `grid-template-rows: auto 1fr auto`, mỗi yêu cầu trên là một bài toán JavaScript + hackery. Hiểu Flexbox + Grid đúng nghĩa, cả dashboard xong bằng ~20 dòng CSS thuần.

---

## What & Why / Cái Gì & Tại Sao

**Flexbox là gì?** Hãy tưởng tượng bạn có một hàng sách trên kệ. Một số quyển co lại để vừa, một số phồng ra lấp đầy khoảng trống, và cả hàng chỉ di chuyển theo **một chiều** (ngang hoặc dọc). Đó là Flexbox: **thuật toán phân phối space dọc theo một trục**.

**Grid là gì?** Tưởng tượng bảng tính Excel — có hàng, có cột, ô nào cũng căn thẳng nhau cả chiều ngang lẫn dọc. Grid quản lý layout **theo hai chiều đồng thời**.

**Tại sao cần cả hai?** Trước Flexbox/Grid, căn giữa dọc cần `position: absolute + negative margin`. Equal-height columns cần JS. Flexbox giải quyết 1D (navbar, card row). Grid giải quyết 2D (toàn bộ page layout, gallery căn thẳng hàng). Chúng **bổ sung** cho nhau, không thay thế.

---

## Concept Map / Bản Đồ Khái Niệm

```
CSS Layout Algorithms
├── Normal Flow (default)
│   ├── Block: xếp dọc, full width, margin collapse
│   └── Inline: chảy ngang theo text
│
├── Flexbox (1D)
│   ├── Main axis: flex-direction (row/column)
│   ├── Cross axis: vuông góc main axis
│   ├── Space algo: flex-grow / flex-shrink / flex-basis
│   └── Gotcha: min-width: auto (items không shrink past min-content)
│
└── Grid (2D)
    ├── Tracks: rows + columns (fr, px, auto, minmax, repeat)
    ├── Track sizing algorithm: fixed → intrinsic → fr → stretch
    ├── Auto-placement: row / column / dense
    └── Gotcha: 1fr = minmax(auto, 1fr) — dùng minmax(0, 1fr) để fix overflow
```

```
Intrinsic Sizing (dùng trong cả Flexbox & Grid)
├── min-content: kích thước tối thiểu không overflow (từ/ảnh dài nhất)
├── max-content: kích thước lý tưởng nếu space vô hạn
├── fit-content(limit): max-content nhưng giới hạn tối đa
└── auto: tùy context — shrink/stretch/min-content
```

---

## Core Concepts / Khái Niệm Cốt Lõi

### Core Concept 1: Flexbox — One-Axis Space Distribution

> **Memory Hook**: "Một hàng sách — co giãn theo chiều dài kệ, không quan tâm hàng khác."

**Tại sao tồn tại:**
Flow layout không có khái niệm "chia space thừa". Trước Flexbox, sidebar 200px + main "chiếm phần còn lại" phải dùng `calc(100% - 200px)` — dòn, cứng nhắc. `flex-grow: 1` cho phép main tự điền phần còn lại mà không cần biết sidebar rộng bao nhiêu.

**Layer 1 — Cơ bản:**
```css
.nav {
  display: flex;           /* tạo flex container */
  flex-direction: row;     /* main axis: ngang (default) */
  align-items: center;     /* cross axis: căn giữa dọc */
  gap: 1rem;               /* khoảng cách giữa items */
}
```

**Layer 2 — Thuật toán phân phối space:**

Ba thuộc tính kiểm soát kích thước item:
- `flex-basis`: kích thước "lý tưởng" (như width nhưng theo main axis)
- `flex-grow`: tỷ lệ lấy **space thừa** nếu container lớn hơn tổng items
- `flex-shrink`: tỷ lệ **nhường space** nếu container nhỏ hơn tổng items

```
Container: 1000px
Items: A (flex: 2 1 200px), B (flex: 1 1 200px)

Nếu container = 1000px:
  tổng basis = 400px, space thừa = 600px
  A nhận: 600 * (2/3) = 400px → final: 600px
  B nhận: 600 * (1/3) = 200px → final: 400px

Nếu container = 300px:
  tổng basis = 400px, thâm hụt = 100px
  A nhường: 100 * (2/3) ≈ 67px → final: 133px
  B nhường: 100 * (1/3) ≈ 33px → final: 167px
```

**Layer 3 — Edge case nguy hiểm:**
```css
/* Vấn đề: flex items có min-width: auto (= min-content) */
/* Item sẽ không shrink nhỏ hơn content của nó */
.flex-item {
  flex: 1;          /* muốn chia đều */
  /* nhưng nếu có text dài, item không co lại đúng */
}

/* Fix: */
.flex-item {
  flex: 1;
  min-width: 0;     /* cho phép shrink past min-content */
  overflow: hidden; /* ẩn overflow nếu cần */
}
```

**Common Mistakes:**
- Dùng `width` thay `flex-basis` — `width` bị override bởi flex algorithm
- Quên `min-width: 0` khi item cần shrink nhỏ hơn content
- Dùng `flex-direction: column` nhưng quên set explicit height trên container

**Interview Pattern:** Interviewer sẽ hỏi "tại sao item không shrink?" → chỉ thẳng `min-width: auto` và cách fix. Đây là câu 🔴 Senior hay gặp nhất.

**Knowledge Chain:** `flex-basis` → `intrinsic sizing` (Core Concept 3) → `min-content` gotcha → `minmax(0, 1fr)` (Core Concept 2)

---

### Core Concept 2: Grid — Two-Dimensional Track System

> **Memory Hook**: "Spreadsheet CSS — hàng và cột đều có thật, ô căn thẳng hai chiều."

**Tại sao tồn tại:**
Flexbox tốt cho 1D, nhưng không thể căn items theo cả rows VÀ columns đồng thời. Gallery muốn item hàng 2 thẳng cột với hàng 1? Flexbox không làm được — phải biết trước chiều rộng chính xác. Grid có track system rõ ràng.

**Layer 1 — Cơ bản:**
```css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;          /* sidebar + main */
  grid-template-rows: auto 1fr auto;         /* header + content + footer */
  min-height: 100vh;
}

/* Sticky footer pattern — Grid solution */
.footer { grid-row: 3; }
```

**Layer 2 — Track sizing algorithm (quan trọng nhất):**

Grid resolve track sizes theo 5 bước tuần tự:

```
Pass 1: Fixed tracks (px, rem, %) → set ngay
Pass 2: Intrinsic tracks (auto, min-content, max-content)
        → examine items → tính base size + growth limit
Pass 3: Spanning items → phân bổ requirements across tracks
Pass 4: fr tracks → chia remaining space theo tỷ lệ
Pass 5: Stretch auto tracks nếu align/justify-content = stretch
```

**`fr` unit — hiểu đúng:**
```css
/* 1fr = minmax(auto, 1fr) = minmax(min-content, 1fr) */
/* → item KHÔNG nhỏ hơn min-content của content */

/* Vấn đề thực tế: */
.grid { grid-template-columns: 1fr 1fr; }
/* Nếu cột 1 có URL dài → cột 1 overflow, không shrink */

/* Fix: */
.grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
/* Bây giờ cột có thể shrink về 0, dùng overflow:hidden để ẩn */
```

**Layer 3 — Responsive không cần media query:**
```css
/* Magic line: tự động 1→N cột dựa trên min-width */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* auto-fit: tạo đúng số cột vừa container */
  /* minmax(250px, 1fr): cột tối thiểu 250px, lớn nhất 1fr */
  gap: 1rem;
}
```

**Common Mistakes:**
- Dùng `1fr` khi muốn item có thể overflow-hidden — cần `minmax(0, 1fr)`
- Nhầm `auto-fit` (collapse empty tracks) vs `auto-fill` (giữ empty tracks)
- `grid-template-areas` không match số cột trong `grid-template-columns`

**Interview Pattern:** "Tại sao grid overflow dù đã dùng 1fr?" → ngay vào `1fr = minmax(min-content, 1fr)`, fix bằng `minmax(0, 1fr)`.

**Knowledge Chain:** `fr unit` → `track sizing algorithm` → `intrinsic sizing` → `min-content` gotcha trong Flexbox (tương tự pattern)

---

### Core Concept 3: Intrinsic Sizing — Content-Aware Dimensions

> **Memory Hook**: "min-content = thắt chặt nhất, max-content = muốn bao nhiêu lấy bấy nhiêu."

**Tại sao tồn tại:**
`width: 200px` là magic number — sai nếu content thay đổi. Intrinsic sizing keywords cho phép element **tự tính kích thước dựa trên content**, robust hơn nhiều.

**Layer 1 — Cơ bản:**

| Keyword | Nghĩa | Ví dụ |
|---|---|---|
| `min-content` | Nhỏ nhất không overflow. Với text = chiều rộng từ dài nhất | Sidebar hugging content |
| `max-content` | Lớn nhất nếu space vô hạn. Với text = tất cả trên 1 dòng | Tooltip, badge |
| `fit-content(N)` | `min(max-content, max(min-content, N))` | Button giới hạn max |
| `auto` | Depends on context — có thể = min-content, stretch, hoặc max-content | Default cho nhiều element |

**Layer 2 — Trong Grid tracks:**
```css
/* Sidebar bằng chiều rộng nội dung dài nhất */
.layout {
  display: grid;
  grid-template-columns: max-content 1fr;
  /* col 1: sidebar rộng bằng content dài nhất */
  /* col 2: main chiếm phần còn lại */
}
```

**Layer 3 — Tại sao `auto` phức tạp:**
- Trong `flex-basis: auto`: dùng element's `width` → fallback `max-content`
- Trong Grid min position (`minmax(auto, 1fr)`): = `min-content`
- Trong Grid `align/justify-content: stretch`: = fill remaining space
- `auto` có nghĩa khác nhau tùy context → hiểu explicit keywords tốt hơn

**Common Mistakes:**
- Dùng `min-content` cho container chứa text dài → text sẽ wrap mạnh, chỉ dùng cho labels/icons
- Nhầm `auto` sẽ luôn = `max-content` — context quyết định

**Interview Pattern:** "Tại sao `1fr` gây overflow?" → explain `auto` trong `minmax(auto, 1fr)` = `min-content`. Cho thấy bạn hiểu sâu hơn chỉ "dùng fr".

**Knowledge Chain:** `intrinsic sizing` → `1fr gotcha` (Grid) → `min-width: auto gotcha` (Flexbox) → cả hai cùng root cause: content không bị ép shrink past natural size.

---

## Q&A / Câu Hỏi Phỏng Vấn

### Q: What is Flexbox and when should you use it? / Flexbox là gì, dùng khi nào? 🟢 Junior

**A:** Flexbox is a one-dimensional layout system that distributes space along a single axis (row or column). Use it when you need to arrange items in a line, control space between them, vertically center items, or have items grow/shrink to fill available space.

Use Flexbox for: navbars, button groups, centering, card content alignment, and any layout that is fundamentally one-dimensional.

Vietnamese: Flexbox là layout 1 chiều: sắp xếp items dọc theo 1 trục (ngang hoặc dọc) và phân phối space thừa/thiếu giữa chúng. Dùng cho: navbar, button group, căn giữa, horizontal/vertical lists. Khi layout cần quan tâm cả **hàng lẫn cột** → chuyển sang Grid.

> 💡 **Interview Signal**: Câu này kiểm tra bạn có hiểu "1D vs 2D" không. Luôn nêu use case cụ thể, không chỉ định nghĩa.

---

### Q: What is CSS Grid and when should you use it instead of Flexbox? / Grid là gì, dùng khi nào thay Flexbox? 🟢 Junior

**A:** CSS Grid is a two-dimensional layout system that defines rows and columns simultaneously. Items can be positioned and sized by their row and column tracks. Use Grid when you need items to align across both axes, you're building a page-level layout, or you want a responsive card grid without media queries (`repeat(auto-fit, minmax(...))`).

Key rule: thinking about rows AND columns at the same time → Grid. Arranging items along one axis → Flexbox.

Vietnamese: Grid là layout 2 chiều: định nghĩa cả hàng lẫn cột, items căn thẳng theo cả hai chiều. Dùng cho: page layout (header/sidebar/main/footer), card galleries, bất kỳ layout nào cần căn thẳng giữa các hàng. Rule đơn giản: nghĩ đến **2 chiều** → Grid, **1 chiều** → Flexbox. Hay dùng cả hai lồng nhau: Grid cho page, Flex cho components bên trong.

> 💡 **Interview Signal**: Điểm khác biệt quan trọng nhất: Grid = 2D alignment. Cho ví dụ cụ thể (card gallery auto-fit).

---

### Q: How do CSS layout algorithms differ? (Flow, Flex, Grid) / So sánh các thuật toán layout CSS 🟡 Mid

**A:** CSS has multiple layout algorithms (called "formatting contexts"), each with different rules:

**Normal Flow** (Block + Inline): Block elements stack vertically, taking full parent width. Inline elements flow horizontally within text. Margins collapse vertically in block flow. This is the default for most elements.

**Flexbox**: Items are sized based on `flex-grow`, `flex-shrink`, `flex-basis` along one axis. The algorithm distributes remaining/deficit space proportionally. No margin collapsing. Items stretch on the cross axis by default.

**Grid**: Items are placed into a 2D grid of tracks (rows + columns). The track sizing algorithm resolves sizes in multiple passes — first fixed tracks, then content-based, then fractional (`fr`). Items can span multiple tracks and align on both axes simultaneously.

Vietnamese: CSS có nhiều layout algorithm: **Normal Flow** (block xếp dọc, inline chảy ngang, margin collapse); **Flexbox** (1 chiều, phân phối space thừa/thiếu tỉ lệ theo grow/shrink, không margin collapse); **Grid** (2 chiều, track sizing algorithm resolve qua nhiều pass — fixed → content-based → fr). Mỗi algorithm có mental model khác nhau, hiểu đúng sẽ debug layout nhanh hơn nhiều.

> 💡 **Interview Signal**: Nêu được "margin collapse chỉ ở Flow, không ở Flex/Grid" là điểm cộng lớn. Interviewer hay hỏi "tại sao margin không hoạt động như expect" → nguyên nhân thường là lầm Flow vs Flex context.

---

### Q: What is intrinsic sizing in CSS? / Intrinsic sizing là gì? 🟡 Mid

**A:** Intrinsic sizing means the element's size is determined by its content rather than explicit dimensions. CSS provides several intrinsic sizing keywords:

- **`min-content`**: the smallest size without overflow. For text, this is the width of the longest unbreakable word. For images, their natural width.
- **`max-content`**: the ideal size if given infinite space. For text, the entire content on one line with no wrapping.
- **`fit-content(limit)`**: behaves like `max-content` but caps at the limit. Equivalent to `min(max-content, max(min-content, limit))`.
- **`auto`**: in different contexts, resolves to min-content, max-content, or stretch.

These keywords work in `width`, `height`, `grid-template-columns/rows`, `flex-basis`, and `inline-size`/`block-size`.

Vietnamese: Intrinsic sizing = kích thước do nội dung quyết định. `min-content`: nhỏ nhất không overflow (= chiều rộng từ dài nhất). `max-content`: lý tưởng nếu space vô hạn. `fit-content(limit)`: như max-content nhưng giới hạn tối đa. Hiểu intrinsic sizing rất quan trọng khi debug Grid/Flexbox vì track sizing algorithm dùng chúng internally.

```css
/* Sidebar shrinks to its content width */
.sidebar { width: min-content; }

/* Grid with content-aware columns */
.layout {
  display: grid;
  grid-template-columns: max-content 1fr;
  /* sidebar: exactly content width | main: remaining space */
}
```

> 💡 **Interview Signal**: Khi interviewer hỏi "`1fr` khác `auto` thế nào?" → đây là câu trả lời. `auto` trong min position của `minmax` = `min-content`.

---

### Q: How does the CSS alignment system work? / Alignment system hoạt động ra sao? 🟡 Mid

**A:** CSS alignment distributes remaining space within a container. The math for `justify-content` / `align-content` (container 1000px, 3 items × 200px, remaining 400px):

- **`center`**: remaining space / 2 on each side
- **`space-between`**: 200px between items, 0 at edges
- **`space-around`**: 100px at edges, 200px between items (each item has 100px on each side)
- **`space-evenly`**: 100px everywhere including edges

Key distinction: `justify/align-content` positions tracks/items within the container. `justify/align-items` positions content within each item's own area. `*-self` overrides per item.

Vietnamese: Alignment phân bổ remaining space. `*-content`: vị trí tracks/items trong container. `*-items`: vị trí content trong item area. `*-self`: override từng item. Trong Grid, alignment chỉ có hiệu lực khi tracks không lấp đầy container.

> 💡 **Interview Signal**: Phân biệt được `justify-content` vs `justify-items` là key — nhiều dev nhầm. `content` = di chuyển cả nhóm, `items` = di chuyển nội dung bên trong từng ô.

---

### Q: What layout constraints can Grid and Flexbox solve that Flow cannot? / Grid/Flex giải quyết constraint gì mà Flow không làm được? 🟡 Mid

**A:** Normal Flow limitations that Flexbox/Grid solve:

1. **Vertical centering**: Flow has no simple vertical centering. Flexbox: `align-items: center`. Grid: `place-items: center`.
2. **Equal-height columns**: In Flow, sibling columns do not match heights. Flexbox/Grid items naturally stretch to equal height.
3. **Source order independence**: Grid/Flexbox can reorder visually (`order`, grid placement) without changing HTML.
4. **Space distribution**: Flexbox: `justify-content: space-between`. Grid: fractional units.
5. **Sticky footer**: Grid: `grid-template-rows: auto 1fr auto` — middle row stretches.
6. **Responsive without media queries**: `repeat(auto-fit, minmax(...))` in Grid, `flex-wrap` in Flexbox.

Vietnamese: Flow không thể: căn giữa dọc, equal-height columns, reorder visual, phân bổ space tỷ lệ, sticky footer, responsive tự động. Flexbox/Grid giải quyết tất cả. Lưu ý: vẫn dùng Flow cho text content — không cần flex/grid cho mọi thứ.

> 💡 **Interview Signal**: Sticky footer bằng Grid (`grid-template-rows: auto 1fr auto`) là câu trả lời được đánh giá cao — cho thấy biết áp dụng Grid vào real problem.

---

### Q: How do you maintain Flexbox/Grid layout code in large teams? / Cách maintain layout code trong team lớn 🟡 Mid

**A:** Maintainability strategies:

1. **Reusable layout utilities**: Define 2-3 patterns (stack, cluster, grid-auto) the team reuses. Avoid ad-hoc one-off flex configs.
2. **Gap over margin**: `gap` for sibling spacing. Margin on components creates coupling (parent needs to know child spacing).
3. **Composition**: Build complex layouts by nesting simple ones, not one massive Grid definition.
4. **Named areas**: `grid-template-areas` makes intent readable in code review.
5. **Design tokens**: `var(--space-md)` not magic numbers.
6. **Document decisions**: Comments explaining why `minmax(0, 1fr)` instead of `1fr`.

```css
.stack   { display: flex; flex-direction: column; gap: var(--space, 1rem); }
.cluster { display: flex; flex-wrap: wrap; gap: var(--space, 1rem); align-items: center; }
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min, 250px), 1fr));
  gap: var(--space, 1rem);
}
```

Vietnamese: Trong team lớn: (1) chuẩn hóa 2-3 layout components tái sử dụng, (2) `gap` thay margin để tránh coupling, (3) compose layout đơn giản lồng nhau, (4) `grid-template-areas` cho complex layouts, (5) design tokens thay magic numbers, (6) comment giải thích quyết định kỹ thuật.

> 💡 **Interview Signal**: Nhắc "gap vs margin coupling" và "composition over complexity" là dấu hiệu senior mindset.

---

### Q: How do min-content and max-content work in Grid track sizing? / min-content và max-content trong Grid 🔴 Senior

**A:** In Grid's track sizing algorithm, `min-content` and `max-content` have specific meanings:

For **columns**: `min-content` = width of the widest unbreakable content. `max-content` = width the content would be with no line wrapping.

The key insight: **`1fr` is equivalent to `minmax(auto, 1fr)`**, and `auto` in the `min` position resolves to `min-content`. So `1fr` never shrinks below `min-content` unless you explicitly use `minmax(0, 1fr)`.

```css
/* Problem: 1fr = minmax(auto, 1fr) = minmax(min-content, 1fr) */
/* A long URL in one cell causes that column to overflow */
.grid-overflow {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* Fix: allow shrinking to 0 */
.grid-fixed {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

/* Content-hugging sidebar */
.smart-layout {
  display: grid;
  grid-template-columns: max-content 1fr;
}
```

Vietnamese: `1fr` thực chất là `minmax(auto, 1fr)` và `auto` ở vị trí min = `min-content`. Nghĩa là `1fr` không bao giờ nhỏ hơn từ dài nhất — gây overflow khi content dài. Fix: `minmax(0, 1fr)` cho phép co về 0 (cần `overflow: hidden` để clip content).

> 💡 **Interview Signal**: Đây là câu 🔴 phân biệt senior thực sự. Giải thích được `1fr = minmax(auto, 1fr)` và tại sao cần `minmax(0, 1fr)` là pass ngay.

---

### Q: How does the Grid track sizing algorithm work? / Thuật toán Grid track sizing 🔴 Senior

**A:** The Grid track sizing algorithm resolves track sizes in several passes:

1. **Initialize tracks**: fixed sizes (`px`, `rem`) are set immediately. Content-based and flexible tracks start at their minimum.
2. **Resolve intrinsic sizes**: for each track with `auto`, `min-content`, `max-content`, or `fit-content()`, the algorithm examines items spanning that track to determine base size and growth limit.
3. **Handle spanning items**: items spanning multiple tracks distribute their size requirements across those tracks, prioritizing tracks with less restrictive sizing.
4. **Distribute remaining space to `fr` tracks**: after all intrinsic and fixed tracks are sized, remaining space is divided among `fr` tracks proportionally. A `1fr` track that would be smaller than its `min` is resolved to its minimum first, then remaining `fr` space is redistributed.
5. **Stretch `auto` tracks**: if `align-content`/`justify-content` is `stretch`, auto tracks expand to fill remaining space.

Vietnamese: Track sizing algorithm chạy qua 5 bước: (1) fixed tracks, (2) intrinsic tracks dựa trên content, (3) spanning items phân bổ requirements, (4) chia remaining space cho `fr` tracks, (5) stretch auto tracks nếu cần. Hiểu algorithm này giúp debug tại sao column không đúng kích thước expected — thường do `fr` bị block bởi `min-content` (xem câu trước).

> 💡 **Interview Signal**: Pass nếu giải thích được thứ tự ưu tiên: fixed → intrinsic → fr. Senior level nếu biết fr bị bounded by min size (liên kết với `minmax(0, 1fr)` fix).

---

### Q: How do you reason about main axis vs cross axis in different writing modes? / Trục chính vs trục chéo với writing modes 🔴 Senior

**A:** Flexbox axes are relative to `flex-direction`, not to physical directions. With `writing-mode: vertical-rl` (Japanese/Chinese), the block direction is horizontal and the inline direction is vertical, which changes how flex-direction behaves.

Modern CSS uses **logical properties** (`inline-start`, `block-start`) instead of physical ones (`left`, `top`):
- `flex-direction: row` always follows the **inline** axis of the current writing mode
- `flex-direction: column` always follows the **block** axis

```css
/* Works correctly in both LTR and RTL */
.nav {
  display: flex;
  gap: 1rem; /* flex-direction: row follows inline direction of writing mode */
}

/* Logical properties for i18n */
.card {
  margin-block-end: 1rem;          /* margin-bottom equivalent */
  padding-inline: 1.5rem;          /* padding-left/right equivalent */
  border-inline-start: 3px solid;  /* border-left equivalent */
}
```

Vietnamese: Flexbox axes theo writing mode, không theo hướng vật lý. `row` = inline axis (hướng text), `column` = block axis (vuông góc text). RTL (Arabic): `row` là phải→trái. Vertical writing (Japanese): `row` là trên→dưới. Dùng logical properties để layout hoạt động đúng mọi writing mode mà không cần override CSS.

> 💡 **Interview Signal**: Mention được "logical properties" và tại sao chúng tốt hơn physical properties là strong senior signal.

---

### Q: How does Grid auto-placement work under the hood? / Grid auto-placement hoạt động chi tiết 🔴 Senior

**A:** The auto-placement algorithm:

1. Place all items with explicit positions first.
2. Process remaining items in source order (or modified by `order` property).
3. For each unplaced item, scan the grid for the next available area that fits the item's span.
4. `grid-auto-flow: row` (default): scan left-to-right, top-to-bottom. Never backtrack.
5. `grid-auto-flow: dense`: restart scan from the beginning of the current row/column — backfills gaps left by large spanning items.

The `dense` packing mode is useful for galleries but has an **accessibility problem**: visual order diverges from DOM order, breaking keyboard navigation (Tab order).

Vietnamese: Auto-placement: (1) đặt explicit items trước, (2) items còn lại scan tìm chỗ trống theo source order. `row` (default): không backtrack. `dense`: backfill khoảng trống — gallery đẹp hơn nhưng phá vỡ tab order. Screen reader và keyboard user sẽ đọc theo DOM order, không theo visual order.

> 💡 **Interview Signal**: Nhắc accessibility implication của `dense` là điểm cộng lớn — nhiều dev chỉ dùng mà không biết trade-off này.

---

### Q: What are the performance implications of Flexbox vs Grid? / Flex vs Grid ảnh hưởng performance thế nào? 🔴 Senior

**A:** In modern browsers, both are highly optimized with negligible differences for typical UIs:

**Layout cost**: Grid's multi-pass track sizing is more complex but irrelevant in practice. Deep nesting (5+ levels) of either accumulates layout cost.

**Recalculation scope**: When one item changes size, Flexbox may recalculate all items on the same line (they share proportional space). Grid has more predictable recalculation because explicit track boundaries are independent.

**Real performance issues** (not Flex vs Grid):
- **Layout thrashing**: reading layout properties (`.offsetWidth`, `.getBoundingClientRect()`) inside JS loops forces synchronous layout
- **Excessive DOM depth**: each level adds traversal cost
- Promoting animated items to compositor layers (`will-change: transform`) reduces repaint cost

Vietnamese: Flex vs Grid performance difference là không đáng kể — đừng chọn dựa trên performance. Vấn đề thực sự: (1) layout thrashing — đọc layout properties trong JS loop, (2) DOM quá sâu, (3) không tận dụng compositor layers cho animations.

> 💡 **Interview Signal**: Interviewer muốn nghe "performance difference negligible, real issues are layout thrashing và DOM depth". Đừng nói Grid chậm hơn Flex vì multi-pass — đó là outdated và sai trong practice.

---

### Q: What are common Grid/Flexbox edge cases and gotchas? / Edge cases và gotchas phổ biến 🔴 Senior

**A:** Common pitfalls:

1. **`min-width: auto`**: flex/grid items refuse to shrink below content size. Fix: `min-width: 0` + `overflow: hidden`.
2. **Percentage heights**: `height: 50%` requires explicit parent height. `flex-basis: 50%` works without it.
3. **`position: sticky` in Flex/Grid**: when a flex item has `align-self: stretch`, it fills the container height — no room to scroll, sticky stops working.
4. **`margin: auto` in Flexbox**: consumes all remaining space on that side. Useful: `margin-inline-start: auto` to push last nav item to far end.
5. **Images in Flex**: images stretch/compress. Fix: `object-fit: cover` + `aspect-ratio` + `height: auto`.
6. **`gap` with `calc()`**: `gap: calc(16px + 1vw)` is valid — useful for fluid spacing.

```css
/* Gotcha 1: always on flex/grid items that may overflow */
.flex-item { min-width: 0; }

/* Gotcha 4: push item to far end */
.nav .logout { margin-inline-start: auto; }

/* Gotcha 5: consistent image in flex card */
.card img {
  width: 100%; height: auto;
  object-fit: cover; aspect-ratio: 16/9;
}
```

Vietnamese: Gotchas phổ biến: (1) `min-width: auto` — items không co lại, fix `min-width: 0`, (2) percentage height cần parent explicit height, (3) `sticky` không work khi flex item stretch full height container, (4) `margin: auto` trong flex = hút remaining space, (5) ảnh bị stretch — `object-fit: cover`, (6) `gap` hoạt động với `calc()`.

> 💡 **Interview Signal**: Kể được 3+ gotchas với root cause là senior signal rõ ràng. `min-width: auto` và `sticky` trong flex là 2 câu thường nhất.

---

## Interview Q&A Summary / Tổng Kết

| Level | Question | Key Point |
|---|---|---|
| 🟢 | What is Flexbox? | 1D, space distribution, use case |
| 🟢 | What is CSS Grid? | 2D, track system, 1D vs 2D rule |
| 🟡 | Layout algorithms compared | Flow vs Flex vs Grid, margin collapse |
| 🟡 | Intrinsic sizing | min/max-content, fit-content, auto |
| 🟡 | Alignment system | justify vs align, content vs items |
| 🟡 | Grid/Flex vs Flow | vertical centering, equal-height, sticky footer |
| 🟡 | Maintainability | stack/cluster patterns, gap vs margin |
| 🔴 | 1fr gotcha | `1fr = minmax(auto, 1fr)`, fix = `minmax(0, 1fr)` |
| 🔴 | Track sizing algorithm | 5 passes: fixed → intrinsic → spanning → fr → stretch |
| 🔴 | Writing modes & axes | logical vs physical, inline/block axes |
| 🔴 | Auto-placement dense | backfill gaps, accessibility tab order problem |
| 🔴 | Performance | layout thrashing > Flex vs Grid difference |
| 🔴 | Edge cases | `min-width: 0`, sticky in flex, margin auto |

---

## Cold Call Simulation / Mô Phỏng Phỏng Vấn Nhanh

**Interviewer**: "Your Grid layout is overflowing even with `1fr`. Why?"

**Strong answer**: "`1fr` expands to `minmax(auto, 1fr)`, and `auto` in the min position resolves to `min-content`. So a track can never shrink below the widest unbreakable content in its items. The fix is `minmax(0, 1fr)` — explicitly setting the min to 0 so the track can shrink freely. You'd also add `overflow: hidden` on the items to clip content."

---

**Interviewer**: "Why does `position: sticky` stop working inside a flex container?"

**Strong answer**: "When flex items have `align-self: stretch` (the default), the item fills the entire container height — there's no scrollable space between the item and the container boundary. For sticky to work, the element needs room to scroll within its containing block. The fix is either setting an explicit height on the container, giving the sticky element `align-self: flex-start`, or restructuring so the sticky element has a true scrollable ancestor."

---

**Interviewer**: "When would you choose Flexbox over Grid?"

**Strong answer**: "When the layout is fundamentally one-dimensional — items arranged in a row or column without needing to align across the other axis. Navbars, button groups, tag clouds with wrapping, centering a single element. If I need items in row 2 to align with items in row 1, or I'm building a page-level structure with named areas, I'd use Grid. In practice I often nest them: Grid for the page frame, Flexbox for components within."

---

## Self-Check / Tự Kiểm Tra

1. Không nhìn notes: giải thích tại sao `1fr` column có thể overflow và cách fix.
2. `place-items: center` và `place-content: center` khác nhau thế nào?
3. Khi nào dùng `grid-auto-flow: dense`? Trade-off là gì?
4. Tại sao `margin: auto` trong Flexbox hoạt động khác trong Normal Flow?
5. Liệt kê 3 layout patterns Flexbox không làm được mà Grid làm được.

---

## Connections / Liên Kết

- **Prerequisite**: [CSS Fundamentals](./00-css-fundamentals.md) — box model, stacking context
- **Next**: [Modern CSS Features](./06-modern-css-features.md) — container queries, subgrid, cascade layers
- **Practice**: [Grid & Flexbox Practice](./01-grid-flexbox.md) — hands-on exercises
- **Related**: [CSS Architecture](./02-css-architecture.md) — layout systems in design tokens context
