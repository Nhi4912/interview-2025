# CSS Grid & Flexbox / Layout hiện đại với Grid và Flexbox

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [CSS Fundamentals](./00-css-fundamentals.md) | [Grid & Flexbox Theory](./05-css-grid-flexbox-theory.md) | [Responsive Design](./03-responsive-design.md)

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What are the Flexbox axes and how does flex-direction work? / Trục Flexbox và flex-direction hoạt động thế nào? 🟢 Junior

**A:** Flexbox has two axes: the **main axis** (direction items flow) and the **cross axis** (perpendicular to main). The `flex-direction` property sets the main axis:

- `row` (default): main axis is horizontal (left→right in LTR), cross axis is vertical
- `row-reverse`: main axis is horizontal right→left
- `column`: main axis is vertical (top→bottom), cross axis is horizontal
- `column-reverse`: main axis is vertical bottom→top

All alignment properties work relative to these axes: `justify-content` aligns along the **main axis**, `align-items` aligns along the **cross axis**.

Vietnamese: Flexbox có 2 trục: main axis (hướng items chảy) và cross axis (vuông góc). `flex-direction` set main axis: `row` (ngang), `column` (dọc). `justify-content` căn theo main axis, `align-items` căn theo cross axis. Key insight: khi đổi `flex-direction: column`, `justify-content` sẽ căn theo chiều dọc -- nhiều người bị nhầm điểm này.

```css
/* Horizontal layout (default) */
.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* horizontal spacing */
  align-items: center;            /* vertical centering */
}

/* Vertical layout */
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* NOW vertical spacing */
  align-items: stretch;           /* NOW horizontal stretch */
}

/* Center anything: the simplest centering trick */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

---

### Q: Explain flex-grow, flex-shrink, and flex-basis / Giải thích flex-grow, flex-shrink, flex-basis 🟡 Mid

**A:** These three properties control how flex items size themselves:

- **`flex-basis`**: the initial size of the item before growing/shrinking. Can be a length (`200px`, `30%`) or `auto` (uses the item's `width`/`height`). Think of it as the "ideal" size.
- **`flex-grow`**: how much the item grows to fill remaining space. `0` = don't grow (default). Values are proportional: if item A has `flex-grow: 2` and item B has `flex-grow: 1`, A gets 2/3 of extra space.
- **`flex-shrink`**: how much the item shrinks when there is not enough space. `1` = shrink proportionally (default). `0` = never shrink.

The shorthand `flex` is preferred: `flex: 1` means `flex: 1 1 0%` (grow equally, shrink equally, base from zero). `flex: auto` means `flex: 1 1 auto` (grow equally, shrink equally, base from content).

Vietnamese: `flex-basis` là kích thước ban đầu (trước khi grow/shrink). `flex-grow` quyết định item chiếm bao nhiêu không gian thừa (tỷ lệ). `flex-shrink` quyết định item co lại bao nhiêu khi thiếu không gian. Nên dùng shorthand `flex`: `flex: 1` = grow equally từ 0, `flex: auto` = grow equally từ content size. Sai lầm phổ biến: `flex: 1` khác `flex: auto` -- `flex: 1` chia đều không gian, `flex: auto` chia theo tỷ lệ nội dung.

```css
/* Equal-width columns regardless of content */
.equal-cols > * {
  flex: 1; /* flex: 1 1 0% -- all start from 0, grow equally */
}

/* Content-proportional sizing */
.auto-cols > * {
  flex: auto; /* flex: 1 1 auto -- start from content, then distribute */
}

/* Fixed sidebar + fluid main */
.layout {
  display: flex;
}
.sidebar {
  flex: 0 0 250px; /* don't grow, don't shrink, 250px fixed */
}
.main {
  flex: 1; /* take remaining space */
  min-width: 0; /* allow shrinking below content size */
}
```

---

### Q: How do alignment properties work in Flexbox and Grid? / Alignment properties trong Flexbox vs Grid 🟡 Mid

**A:** CSS Box Alignment properties work across both Flexbox and Grid, but the axis terminology differs:

| Property | Flexbox | Grid |
|---|---|---|
| `justify-content` | Main axis (items as group) | Inline axis (columns) |
| `align-content` | Cross axis (lines as group, needs wrap) | Block axis (rows) |
| `justify-items` | N/A in Flexbox | Inline axis (each cell) |
| `align-items` | Cross axis (items in line) | Block axis (each cell) |
| `justify-self` | N/A in Flexbox | Inline axis (single cell) |
| `align-self` | Cross axis (single item) | Block axis (single cell) |
| `place-content` | Shorthand: align-content / justify-content |
| `place-items` | Shorthand: align-items / justify-items |
| `gap` | Gap between items | Gap between tracks |

Vietnamese: Alignment properties dùng chung cho cả Flexbox và Grid. `justify-*` căn theo inline/main axis. `align-*` căn theo block/cross axis. `*-content` căn group items/tracks trong container. `*-items` căn tất cả items/cells. `*-self` căn từng item riêng. `gap` thay thế margin giữa items -- ưu điểm: không cần trick loại bỏ margin ở item đầu/cuối.

```css
/* Grid: center everything */
.grid-center {
  display: grid;
  place-items: center; /* align-items: center + justify-items: center */
  min-height: 100dvh;
}

/* Flexbox: space between with centered items */
.flex-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem; /* minimum gap between items */
}

/* Grid: different alignment per cell */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.grid-layout .left {
  justify-self: start;
  align-self: end;
}
```

---

### Q: How does flex-wrap work and when do you need it? / flex-wrap hoạt động thế nào? 🟢 Junior

**A:** By default, flex items squeeze onto one line (`flex-wrap: nowrap`), shrinking as needed. `flex-wrap: wrap` allows items to flow to the next line when they cannot fit, like words wrapping in text.

With wrapping, `align-content` controls spacing between wrapped lines (has no effect without wrapping). Each wrap line is independent -- items in different lines do not align with each other (unlike Grid).

Vietnamese: Mặc định flex items nằm trên 1 dòng và co lại. `flex-wrap: wrap` cho phép items xuống dòng mới khi không đủ chỗ. `align-content` kiểm soát spacing giữa các dòng wrapped. Lưu ý: mỗi dòng wrap là independent -- items ở dòng khác nhau không align với nhau. Nếu cần alignment giữa rows, dùng Grid thay vì Flexbox wrap.

```css
/* Responsive card grid with Flexbox wrap */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.card-grid > .card {
  flex: 1 1 300px; /* grow, shrink, min 300px before wrapping */
  /* Cards will wrap to next row when < 300px available */
}

/* Tag/chip list */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag {
  flex: 0 0 auto; /* don't grow or shrink */
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: #e0e0e0;
}
```

---

### Q: What are CSS Grid tracks and how do you size them? / Grid tracks và cách set kích thước 🟡 Mid

**A:** Grid tracks are the rows and columns of a grid. They are defined with `grid-template-columns` and `grid-template-rows`. Sizing options:

- **Fixed**: `200px`, `10rem`
- **Fractional**: `1fr` -- takes a fraction of remaining space after fixed tracks
- **Content-based**: `auto`, `min-content`, `max-content`, `fit-content(300px)`
- **Flexible range**: `minmax(200px, 1fr)` -- at least 200px, can grow to 1fr
- **Repeat**: `repeat(3, 1fr)`, `repeat(auto-fill, minmax(250px, 1fr))`, `repeat(auto-fit, minmax(250px, 1fr))`

`auto-fill` vs `auto-fit`: `auto-fill` creates as many tracks as fit (including empty ones). `auto-fit` collapses empty tracks to 0, allowing items to stretch to fill the row.

Vietnamese: Grid tracks là rows/columns. Sizing: `px`/`rem` (cố định), `fr` (tỷ lệ không gian còn lại), `auto` (theo content), `minmax()` (range min-max). `repeat(auto-fill, ...)` tạo nhiều track nhất có thể (kể cả empty). `repeat(auto-fit, ...)` collapse empty tracks -- items stretch ra. Dùng `auto-fit` cho responsive grid không cần media queries.

```css
/* Fixed + flexible columns */
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr 300px; /* sidebar | main | aside */
  grid-template-rows: auto 1fr auto;       /* header | content | footer */
}

/* Responsive grid without media queries */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  /* auto-fit: items stretch when few; wraps when many */
}

/* Mixed track sizing */
.complex {
  display: grid;
  grid-template-columns:
    minmax(200px, 300px)  /* sidebar: 200-300px */
    1fr                    /* main: takes remaining */
    fit-content(200px);    /* aside: up to 200px, based on content */
}
```

---

### Q: How does Grid auto-placement work? / Grid auto-placement hoạt động thế nào? 🔴 Senior

**A:** Grid auto-placement is the algorithm that places items not explicitly positioned. The algorithm works cell by cell, left-to-right and top-to-bottom (by default), filling in items as it encounters empty cells.

`grid-auto-flow` controls behavior: `row` (default) fills row by row, `column` fills column by column. Adding `dense` (`grid-auto-flow: row dense`) enables backfilling -- the algorithm goes back to fill earlier gaps, which can reorder items visually (accessibility concern: DOM order vs visual order mismatch).

`grid-auto-rows` and `grid-auto-columns` set sizes for implicitly created tracks (tracks not defined in the template but needed for additional items).

Vietnamese: Auto-placement tự động đặt items vào grid cells theo thứ tự. `grid-auto-flow: row` (mặc định) điền từng hàng. `column` điền từng cột. `dense` cho phép lấp khoảng trống bằng cách dời items nhỏ lên -- nhưng gây mismatch giữa DOM order và visual order (vấn đề accessibility). `grid-auto-rows`/`grid-auto-columns` set kích thước cho tracks tự động tạo ra.

```css
/* Masonry-like layout with auto-placement */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  grid-auto-flow: dense; /* fill gaps -- items may reorder visually */
  gap: 0.5rem;
}
.gallery .wide { grid-column: span 2; }
.gallery .tall { grid-row: span 2; }

/* Auto rows for unknown number of items */
.list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(100px, auto); /* implicit rows at least 100px */
}
```

---

### Q: How do grid-template-areas and named grid areas work? / grid-template-areas hoạt động thế nào? 🟢 Junior

**A:** `grid-template-areas` lets you define layout visually using named strings. Each string represents a row, each word a cell. Items are placed by setting `grid-area` to the name.

Rules: each row must have the same number of cells. Named areas must form rectangles. Use `.` for empty cells.

Vietnamese: `grid-template-areas` cho phép định nghĩa layout bằng tên trực quan -- mỗi chuỗi là một hàng, mỗi từ là một ô. Item dùng `grid-area` để chỉ vị trí. Ưu điểm lớn: đọc CSS là thấy ngay layout. Quy tắc: area phải là hình chữ nhật, mỗi hàng cùng số ô, dùng `.` cho ô trống.

```css
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;
}

.page > header  { grid-area: header; }
.page > nav     { grid-area: nav; }
.page > main    { grid-area: main; }
.page > aside   { grid-area: aside; }
.page > footer  { grid-area: footer; }

/* Responsive: stack on mobile */
@media (max-width: 768px) {
  .page {
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

---

### Q: What is CSS Subgrid and when do you need it? / Subgrid là gì và khi nào cần dùng? 🟡 Mid

**A:** Subgrid allows a nested grid item to adopt its parent grid's track sizing for one or both axes. Without subgrid, a nested grid creates its own independent track sizing, so inner elements cannot align with outer grid tracks.

Use `grid-template-columns: subgrid` or `grid-template-rows: subgrid` on a grid item that is also a grid container. The item inherits its parent's tracks for the spanned area.

Vietnamese: Subgrid cho phép grid con thừa kế track sizing của grid cha. Ví dụ: danh sách card trong grid, mỗi card có title/content/footer -- không subgrid thì title ở các card khác nhau sẽ không align. Với subgrid, title row của tất cả cards align hoàn hảo vì dùng cùng track sizing.

```css
/* Card grid where card internals align across cards */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  display: grid;
  grid-row: span 3; /* card spans 3 rows in parent */
  grid-template-rows: subgrid; /* inherit parent's row tracks */
  /* Now .title, .body, .footer align across all cards */
}

.card .title  { /* automatically placed in row 1 */ }
.card .body   { /* automatically placed in row 2 */ }
.card .footer { /* automatically placed in row 3 */ }
```

---

### Q: When should you use Flexbox vs Grid? / Khi nào dùng Flexbox, khi nào dùng Grid? 🟢 Junior

**A:** The simplest mental model:

- **Flexbox**: 1-dimensional layout (a row OR a column). Content drives layout. Best when items have intrinsic sizes and you want them to flow naturally. Examples: navigation bars, toolbars, centering, card rows, tag lists.
- **Grid**: 2-dimensional layout (rows AND columns simultaneously). Layout drives content. Best when you need items to align on both axes. Examples: page layout, dashboards, image galleries, form layouts, data tables.

They can be combined: a Grid page layout can contain Flexbox navigation within a grid cell.

Vietnamese: Flexbox = 1 chiều, content quyết định layout. Grid = 2 chiều, layout quyết định content. Dùng Flexbox cho: nav bar, toolbar, centering, tag list. Dùng Grid cho: page layout, dashboard, gallery, form layout. Thực tế hay kết hợp cả hai: Grid cho layout tổng thể, Flexbox cho component bên trong.

---

### Q: How do you build a Holy Grail layout with Grid? / Xây dựng Holy Grail layout với Grid 🟡 Mid

**A:** The Holy Grail layout has a header, footer, main content area flanked by two sidebars, with the main content appearing first in the source order for SEO/accessibility:

Vietnamese: Holy Grail layout gồm header, footer, content chính ở giữa, 2 sidebar hai bên. Grid giải quyết vấn đề này đơn giản hơn nhiều so với float/table ngày xưa, đồng thời giữ source order tốt cho SEO/accessibility.

```css
.holy-grail {
  display: grid;
  grid-template:
    "header header  header" auto
    "left   content right"  1fr
    "footer footer  footer" auto
    / 200px  1fr     200px;
  min-height: 100dvh;
  gap: 1rem;
}

header  { grid-area: header; }
.left   { grid-area: left; }
.content{ grid-area: content; }
.right  { grid-area: right; }
footer  { grid-area: footer; }

/* Responsive: stack vertically on mobile */
@media (max-width: 768px) {
  .holy-grail {
    grid-template:
      "header"  auto
      "content" 1fr
      "left"    auto
      "right"   auto
      "footer"  auto
      / 1fr;
  }
}
```

---

### Q: How do you build a responsive dashboard layout? / Xây dựng dashboard layout responsive 🟡 Mid

**A:** Dashboards need a fixed sidebar, top bar, and a content area with flexible widget cards. Grid handles this well:

Vietnamese: Dashboard layout cần sidebar cố định, top bar, và vùng content với các widget cards responsive. Grid tạo layout tổng thể, `auto-fit` tạo responsive card grid bên trong. Sidebar có thể collapsible trên mobile dùng CSS chỉ thay đổi grid-template.

```css
.dashboard {
  display: grid;
  grid-template:
    "sidebar topbar"  60px
    "sidebar content" 1fr
    / 240px   1fr;
  height: 100dvh;
}

.sidebar { grid-area: sidebar; overflow-y: auto; }
.topbar  { grid-area: topbar; }
.content {
  grid-area: content;
  overflow-y: auto;
  padding: 1rem;
}

/* Widget grid inside content area */
.widgets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Some widgets span 2 columns on large screens */
.widget--wide {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .dashboard {
    grid-template:
      "topbar"  60px
      "content" 1fr
      / 1fr;
  }
  .sidebar {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    width: 240px;
    transform: translateX(-100%);
    transition: transform 0.3s;
    z-index: 100;
  }
  .sidebar.open { transform: translateX(0); }
  .widget--wide { grid-column: span 1; }
}
```

---

### Q: How do you debug Flexbox and Grid layout issues? / Cách debug Flexbox/Grid layout 🔴 Senior

**A:** Common debugging approaches:

1. **Browser DevTools**: Chrome/Firefox have dedicated Flexbox and Grid inspectors. Enable grid overlay to see track lines, areas, and gaps. The Flexbox inspector shows grow/shrink behavior visually.

2. **Common Flexbox bugs**:
   - Items overflowing: add `min-width: 0` (flex items have `min-width: auto` by default, preventing shrinking below content)
   - Text not truncating: same fix -- `min-width: 0` on the flex item + `overflow: hidden; text-overflow: ellipsis` on text container
   - Image stretching: `align-self: flex-start` or explicit `height: auto` on the image

3. **Common Grid bugs**:
   - `1fr` not respecting `max-width`: use `minmax(0, 1fr)` instead
   - Items overflowing grid: add `min-width: 0` or `overflow: hidden` on grid items
   - Implicit tracks appearing: items placed outside explicit grid create auto-sized tracks

Vietnamese: Debug Flex/Grid dùng DevTools: Chrome/Firefox có inspector riêng cho Grid overlay (hiện tracks, areas, gaps) và Flexbox inspector. Bugs phổ biến: item overflow → thêm `min-width: 0` (flex item mặc định `min-width: auto`). Text không truncate → `min-width: 0` + `overflow: hidden`. Grid 1fr không respect max-width → dùng `minmax(0, 1fr)`.

```css
/* Fix: flex item won't shrink below content */
.flex-item-fix {
  min-width: 0; /* override min-width: auto */
}

/* Fix: text truncation in flex item */
.truncate-in-flex {
  flex: 1;
  min-width: 0;
}
.truncate-in-flex .text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Fix: grid 1fr not respecting content overflow */
.grid-fix {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  /* instead of: grid-template-columns: 1fr 1fr; */
}
```
