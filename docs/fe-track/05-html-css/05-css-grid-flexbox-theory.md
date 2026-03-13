# CSS Grid & Flexbox Theory / Lý thuyết sâu về Grid & Flexbox

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Grid & Flexbox Practice](./01-grid-flexbox.md) | [CSS Fundamentals](./00-css-fundamentals.md) | [Modern CSS Features](./06-modern-css-features.md)

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: How do CSS layout algorithms differ? (Flow, Flex, Grid) / So sánh các thuật toán layout CSS 🟡 Mid

**A:** CSS has multiple layout algorithms (called "formatting contexts"), each with different rules:

**Normal Flow** (Block + Inline): Block elements stack vertically, taking full parent width. Inline elements flow horizontally within text. Margins collapse vertically in block flow. This is the default for most elements.

**Flexbox**: Items are sized based on `flex-grow`, `flex-shrink`, `flex-basis` along one axis. The algorithm distributes remaining/deficit space proportionally. No margin collapsing. Items stretch on the cross axis by default.

**Grid**: Items are placed into a 2D grid of tracks (rows + columns). The track sizing algorithm resolves sizes in multiple passes -- first fixed tracks, then content-based, then fractional (`fr`). Items can span multiple tracks and align on both axes simultaneously.

Vietnamese: CSS có nhiều layout algorithm: **Normal Flow** (block xếp dọc, inline chảy ngang, margin collapse); **Flexbox** (1 chiều, phân phối space thừa/thiếu tỉ lệ theo grow/shrink, không margin collapse); **Grid** (2 chiều, track sizing algorithm resolve qua nhiều pass -- fixed → content-based → fr). Mỗi algorithm có mental model khác nhau, hiểu đúng sẽ debug layout nhanh hơn nhiều.

---

### Q: What is intrinsic sizing in CSS? / Intrinsic sizing là gì? 🟡 Mid

**A:** Intrinsic sizing means the element's size is determined by its content rather than explicit dimensions. CSS provides several intrinsic sizing keywords:

- **`min-content`**: the smallest size without overflow. For text, this is the width of the longest unbreakable word. For images, their natural width.
- **`max-content`**: the ideal size if given infinite space. For text, the entire content on one line with no wrapping.
- **`fit-content(limit)`**: behaves like `max-content` but caps at the limit. Equivalent to `min(max-content, max(min-content, limit))`.
- **`auto`**: in different contexts, resolves to min-content, max-content, or stretch.

These keywords work in `width`, `height`, `grid-template-columns/rows`, `flex-basis`, and `inline-size`/`block-size`.

Vietnamese: Intrinsic sizing = kích thước do nội dung quyết định. `min-content`: nhỏ nhất không overflow (= chiều rộng từ dài nhất). `max-content`: lý tưởng nếu space vô hạn (= nội dung trên 1 dòng). `fit-content(limit)`: như max-content nhưng giới hạn tối đa. Hiểu intrinsic sizing rất quan trọng khi debug Grid/Flexbox vì track sizing algorithm dùng chúng internally.

```css
/* Sidebar shrinks to its content width */
.sidebar {
  width: min-content;
}

/* Button expands to content but caps at 300px */
.button {
  width: fit-content(300px);
}

/* Grid with content-aware columns */
.layout {
  display: grid;
  grid-template-columns: min-content 1fr max-content;
  /* col 1: as narrow as content allows */
  /* col 2: takes remaining space */
  /* col 3: as wide as content wants */
}
```

---

### Q: How do min-content and max-content work in Grid track sizing? / min-content và max-content trong Grid 🔴 Senior

**A:** In Grid's track sizing algorithm, `min-content` and `max-content` have specific meanings:

For **columns**: `min-content` is the width of the widest unbreakable content (longest word or widest replaced element). `max-content` is the width the content would be if line wrapping were turned off.

The track sizing algorithm uses these in `minmax()`: `minmax(min-content, max-content)` means "be at least as wide as the widest word, but grow up to the full content width before using remaining space." This is actually what `auto` resolves to in many grid contexts.

The key insight: `1fr` is equivalent to `minmax(auto, 1fr)`, and `auto` in the `min` position resolves to `min-content`. So `1fr` never shrinks below `min-content` unless you explicitly use `minmax(0, 1fr)`.

Vietnamese: `min-content` = chiều rộng nội dung không thể chia nhỏ hơn (từ dài nhất). `max-content` = chiều rộng nếu không wrap. Trong Grid, `1fr` thực chất là `minmax(auto, 1fr)` và `auto` ở vị trí min = `min-content`. Nghĩa là `1fr` không bao giờ nhỏ hơn từ dài nhất -- gây overflow. Để fix: `minmax(0, 1fr)` cho phép co về 0.

```css
/* Problem: 1fr doesn't shrink below min-content */
.grid-overflow {
  display: grid;
  grid-template-columns: 1fr 1fr; /* = minmax(auto, 1fr) minmax(auto, 1fr) */
  /* A long URL in one cell can overflow the grid */
}

/* Fix: allow shrinking to 0 */
.grid-fixed {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  /* Now items can be smaller than min-content (use overflow:hidden) */
}

/* Useful for content-hugging sidebar */
.smart-layout {
  display: grid;
  grid-template-columns: max-content 1fr;
  /* Sidebar: exactly as wide as its content */
  /* Main: takes all remaining space */
}
```

---

### Q: How does the Grid track sizing algorithm work? / Thuật toán Grid track sizing 🔴 Senior

**A:** The Grid track sizing algorithm resolves track sizes in several passes:

1. **Initialize tracks**: fixed sizes (`px`, `rem`) get their values immediately. Content-based and flexible tracks start at their minimum.
2. **Resolve intrinsic sizes**: for each track with `auto`, `min-content`, `max-content`, or `fit-content()`, the algorithm examines items spanning that track to determine base size and growth limit.
3. **Handle spanning items**: items spanning multiple tracks distribute their size requirements across those tracks, prioritizing tracks with less restrictive sizing.
4. **Distribute remaining space to `fr` tracks**: after all intrinsic and fixed tracks are sized, remaining space is divided among `fr` tracks proportionally. A `1fr` track that would be smaller than its `min` is resolved to its minimum, and remaining `fr` space is redistributed.
5. **Stretch `auto` tracks**: if `align-content`/`justify-content` is `stretch`, auto tracks expand to fill remaining space.

Vietnamese: Track sizing algorithm chạy qua nhiều bước: (1) Set kích thước fixed tracks, (2) resolve intrinsic sizes dựa trên content items, (3) xử lý spanning items -- phân bổ requirement across tracks, (4) chia remaining space cho `fr` tracks theo tỷ lệ, (5) stretch auto tracks nếu cần. Hiểu algorithm này giúp debug tại sao column không đúng kích thước expected.

---

### Q: How does the CSS alignment system work mathematically? / Alignment system hoạt động ra sao? 🟡 Mid

**A:** CSS alignment distributes remaining space within a container. The math is straightforward:

For `justify-content` / `align-content`:
- **`center`**: remaining space / 2 on each side
- **`space-between`**: remaining space / (n - 1) between items, 0 at edges
- **`space-around`**: remaining space / (2n) on each side of each item (edges get half-gaps)
- **`space-evenly`**: remaining space / (n + 1) everywhere including edges

For Grid, `place-content: center` centers all tracks within the container. This only matters when tracks do not fill the entire container (e.g., fixed-width tracks in a larger container).

Vietnamese: Alignment phân bổ remaining space: `center` chia đều 2 bên, `space-between` chia đều giữa items (không ở biên), `space-around` chia đều quanh mỗi item (biên = nửa gap), `space-evenly` chia đều kể cả biên. Trong Grid, alignment chỉ có hiệu lực khi tracks không lấp đầy container.

```css
/* Visualizing space distribution */
/* Container: 1000px, 3 items each 200px, remaining: 400px */

.space-between {
  justify-content: space-between;
  /* |item|----200px----|item|----200px----|item| */
}

.space-around {
  justify-content: space-around;
  /* |--66px--|item|--133px--|item|--133px--|item|--66px--| */
}

.space-evenly {
  justify-content: space-evenly;
  /* |--100px--|item|--100px--|item|--100px--|item|--100px--| */
}
```

---

### Q: How do you reason about main axis vs cross axis in different writing modes? / Trục chính vs trục chéo với writing modes 🔴 Senior

**A:** Flexbox axes are relative to the `flex-direction`, not to physical directions. With `writing-mode: vertical-rl` (Japanese/Chinese), the block direction is horizontal and the inline direction is vertical, which changes how flex-direction behaves.

Modern CSS uses **logical properties** (`inline-start`, `block-start`) instead of physical ones (`left`, `top`). In Flexbox:
- `flex-direction: row` always follows the **inline** axis of the current writing mode
- `flex-direction: column` always follows the **block** axis

The key mindset: think in terms of **inline** (text direction) and **block** (perpendicular to text), not left/right/top/bottom. This makes layouts work correctly in RTL languages and vertical writing modes.

Vietnamese: Flexbox axes theo writing mode, không theo hướng vật lý. `flex-direction: row` theo inline axis (hướng text), `column` theo block axis (vuông góc text). Với RTL (Arabic), `row` là phải→trái. Với vertical writing (Japanese), `row` là trên→dưới. Dùng logical properties (inline-start thay left, block-start thay top) để layout hoạt động đúng mọi writing mode.

```css
/* Logical properties for internationalization */
.card {
  margin-block-end: 1rem;     /* instead of margin-bottom */
  padding-inline: 1.5rem;     /* instead of padding-left/right */
  border-inline-start: 3px solid blue; /* instead of border-left */
}

/* This layout works correctly in both LTR and RTL */
.nav {
  display: flex;
  flex-direction: row; /* follows inline direction of writing mode */
  gap: 1rem;
}
```

---

### Q: What layout constraints can Grid and Flexbox solve that Flow cannot? / Grid/Flex giải quyết constraint gì mà Flow không làm được? 🟡 Mid

**A:** Normal Flow limitations that Flexbox/Grid solve:

1. **Vertical centering**: Flow has no simple vertical centering. Flexbox: `align-items: center`. Grid: `place-items: center`.
2. **Equal-height columns**: In Flow, sibling columns do not match heights. Flexbox/Grid items naturally stretch to equal height.
3. **Source order independence**: Flow renders in DOM order. Grid/Flexbox can reorder visually (`order`, grid placement) without changing HTML.
4. **Space distribution**: Flow cannot distribute space between items. Flexbox: `justify-content: space-between`. Grid: fractional units.
5. **Sticky footer**: Making footer stick to bottom when content is short. Grid: `grid-template-rows: auto 1fr auto`.
6. **Responsive reflow without media queries**: `repeat(auto-fit, minmax(...))` in Grid, `flex-wrap` in Flexbox.

Vietnamese: Flow không thể: căn giữa dọc, equal-height columns, reorder visual, phân bổ space, sticky footer, responsive tự động. Flexbox/Grid giải quyết tất cả. Lưu ý: vẫn dùng Flow cho text content (paragraphs, inline elements) -- không cần flex/grid cho mọi thứ.

---

### Q: How does Grid auto-placement work under the hood? / Grid auto-placement hoạt động chi tiết 🔴 Senior

**A:** The auto-placement algorithm places items without explicit `grid-column`/`grid-row` positions. Steps:

1. Place all items with explicit positions first.
2. Process remaining items in source order (or modified by `order` property).
3. For each unplaced item, scan the grid for the next available area that fits the item's span.
4. With `grid-auto-flow: row` (default): scan left-to-right, top-to-bottom, advancing to the next row when the current row is full.
5. With `grid-auto-flow: dense`: instead of always scanning forward, restart from the beginning of the current row (or column), backfilling any gaps.

The `dense` packing mode is useful for galleries but has an accessibility problem: visual order diverges from DOM order, so keyboard navigation (Tab order) does not match what the user sees.

Vietnamese: Auto-placement: (1) đặt items có vị trí explicit trước, (2) với items còn lại, scan grid tìm vùng trống phù hợp. `row`: scan từ trái→phải, trên→dưới. `dense`: scan lại từ đầu để lấp khoảng trống. `dense` tốt cho gallery nhưng gây vấn đề accessibility: tab order theo DOM order nhưng visual order khác, user keyboard navigation bị lộn xộn.

---

### Q: What are the performance implications of Flexbox vs Grid? / Flex vs Grid ảnh hưởng performance thế nào? 🔴 Senior

**A:** In modern browsers, both Flexbox and Grid are highly optimized, but there are subtle differences:

**Layout cost**: Grid's track sizing algorithm is more complex (multiple passes) but this is negligible for typical UIs. Deep nesting of either system (5+ levels) can accumulate layout cost.

**Recalculation scope**: When a single item changes size, Flexbox may need to recalculate all items on the same line (they share space proportionally). Grid has more predictable recalculation because explicit tracks are independent.

**`will-change` and layers**: Layout systems do not directly cause compositing, but forcing items into separate layers (with `will-change: transform`) can reduce repaint cost for animated items within a flex/grid container.

**Practical advice**: Performance differences between Flex and Grid are negligible for 99% of use cases. Choose based on the layout pattern, not performance. The real performance issues come from layout thrashing (reading layout properties during JS-driven mutations) and excessive DOM depth.

Vietnamese: Performance: cả Flex và Grid đều được tối ưu tốt trên browser hiện đại. Grid có track sizing algorithm phức tạp hơn nhưng không ảnh hưởng đáng kể. Khi 1 item thay đổi kích thước: Flexbox phải tính lại cả dòng (chia space proportional), Grid có track boundaries rõ ràng hơn. Thực tế: chọn dựa trên layout pattern, không phải performance. Vấn đề performance thực sự là layout thrashing và DOM quá sâu.

---

### Q: How do you maintain Flexbox/Grid layout code in large teams? / Cách maintain layout code trong team lớn 🟡 Mid

**A:** Maintainability strategies for layout CSS:

1. **Consistent patterns**: Define 2-3 layout utilities (stack, cluster, grid) that the team reuses. Avoid ad-hoc flex/grid containers with one-off configurations.
2. **Gap over margin**: Use `gap` for spacing between siblings. Margin on components creates coupling (parent needs to know about child spacing).
3. **Composition over complexity**: Build complex layouts by nesting simple ones (a Grid page containing Flex navbars and Stack content areas), not by creating one massive Grid definition.
4. **Named areas for complex layouts**: `grid-template-areas` makes layout intent readable in code review.
5. **Avoid magic numbers**: Use design tokens for spacing (`--space-sm`, `--space-md`) and breakpoints.
6. **Document layout decisions**: Comments explaining why a layout uses Grid vs Flex, or why `minmax(0, 1fr)` instead of `1fr`.

Vietnamese: Maintainability trong team lớn: (1) Chuẩn hóa 2-3 layout patterns (stack, cluster, grid) tái sử dụng, (2) dùng `gap` thay margin giữa siblings, (3) compose layout đơn giản thay vì 1 Grid phức tạp, (4) dùng `grid-template-areas` để đọc layout rõ ràng trong code review, (5) design tokens thay magic numbers, (6) comment giải thích quyết định layout.

```css
/* Reusable layout utilities */
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space, 1rem);
}

.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, 1rem);
  align-items: center;
}

.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min, 250px), 1fr));
  gap: var(--space, 1rem);
}

/* Usage: compose simple patterns */
<div class="stack" style="--space: 2rem">
  <nav class="cluster">...</nav>
  <div class="grid-auto" style="--min: 300px">...</div>
</div>
```

---

### Q: What are common Grid/Flexbox edge cases and gotchas? / Edge cases và gotchas phổ biến 🔴 Senior

**A:** Common pitfalls:

1. **`min-width: auto`** on flex/grid items: items refuse to shrink below content size. Fix: `min-width: 0` or `overflow: hidden`.
2. **Percentage heights**: `height: 50%` requires parent to have explicit height. In Flexbox, `flex-basis: 50%` works without explicit parent height.
3. **`position: sticky` in Flex/Grid**: the sticky element's scrolling container must have overflow. In Flexbox with `align-items: stretch`, the item fills the container height, leaving no room to scroll.
4. **`margin: auto` in Flexbox**: consumes remaining space, useful for pushing items (e.g., `margin-left: auto` on last nav item). In Grid, `margin: auto` centers items.
5. **Image aspect ratio in Flex**: images stretch/compress. Fix: `object-fit: cover` + explicit `aspect-ratio` or `height: auto`.
6. **`gap` with `calc()`**: `gap: calc(16px + 1vw)` is valid and useful for fluid spacing.

Vietnamese: Gotchas phổ biến: (1) `min-width: auto` -- items không co lại, fix bằng `min-width: 0`, (2) percentage height cần parent có explicit height, (3) `position: sticky` không hoạt động khi container stretch full height trong flex, (4) `margin: auto` trong flex hút remaining space (hữu ích push items), (5) ảnh bị stretch/compress trong flex -- dùng `object-fit: cover`, (6) `gap` hoạt động với `calc()`.

```css
/* Gotcha 1: min-width: auto */
.flex-item {
  min-width: 0; /* ALWAYS add to flex/grid items that may overflow */
}

/* Gotcha 4: margin: auto to push items */
.nav {
  display: flex;
  gap: 1rem;
}
.nav .logout {
  margin-inline-start: auto; /* pushes to far end */
}

/* Gotcha 5: images in flex */
.card img {
  width: 100%;
  height: auto;       /* maintain aspect ratio */
  object-fit: cover;  /* fill without stretching */
  aspect-ratio: 16/9; /* consistent aspect ratio */
}
```
