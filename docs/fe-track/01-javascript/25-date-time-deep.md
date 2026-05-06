# Date & Time Deep Dive — Xử Lý Ngày Giờ Chuyên Sâu

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [JavaScript Fundamentals](./00-javascript-fundamentals.md), basic understanding of UTC vs local time
> **See also**: [Table of Contents](../00-table-of-contents.md) | [Intl & i18n](./24-intl-i18n.md) | [Performance Patterns](../06-browser-performance/01-core-web-vitals.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Tháng 11/2019, Brazil quyết định bãi bỏ Daylight Saving Time (DST) vĩnh viễn. Hàng triệu ứng dụng toàn cầu — kể cả các hệ thống đặt xe của **Grab** và **Gojek** tại thị trường Brazil — đột ngột tính sai giờ đón khách. Lý do: các app này lưu offsets cố định kiểu `UTC-3` thay vì dùng IANA timezone database (`America/Sao_Paulo`). Khi Brazil thay đổi luật, IANA cập nhật database sau vài ngày — nhưng các app hard-code offset thì không tự cập nhật được.

Tương tự, **Zalo** khi mở rộng sang thị trường Đông Nam Á phải xử lý timestamp tin nhắn trên nhiều múi giờ: UTC+7 (VN/TH), UTC+8 (SG/PH), UTC+5:30 (IN). Một chiếc điện thoại Android ở Hà Nội gửi tin lúc 11:59 PM ngày 31/12, thiết bị iOS ở Singapore nhận lúc 1:59 AM ngày 1/1 — và cả hai timestamp phải hiển thị đúng theo local time của từng thiết bị, trong khi server chỉ lưu một giá trị duy nhất.

**Shopee** flash sale countdown cũng là bài toán cổ điển: đồng hồ đếm ngược phải đồng bộ UTC milliseconds từ server (tránh clock skew ở client), hiển thị đúng múi giờ local, và xử lý trường hợp DST transition ngay trong khoảng thời gian flash sale (dù hiếm, nhưng xảy ra ở các thị trường còn dùng DST như My, TW).

**Notion** và **Linear** xử lý relative timestamps ("5 minutes ago", "last week") cho UI hiển thị — một vấn đề tưởng đơn giản nhưng chứa ẩn số về timezone, locale, và thư viện nào nên dùng. Dùng `Intl.RelativeTimeFormat` hay tự format chuỗi? Cập nhật real-time hay chỉ khi re-render?

Đây là lý do tại sao **Date/Time** là chủ đề Senior trong mọi vòng phỏng vấn kỹ thuật: nó kết hợp JavaScript internals, browser APIs, timezone complexity, library tradeoffs, và performance ở một chỗ.

---

## Mental Model / Bản Đồ Tư Duy

```
DATE/TIME MENTAL MODEL
═══════════════════════════════════════════════════════════════
                        TRUTH: UTC milliseconds
                        (Unix epoch: ms since 1970-01-01T00:00:00Z)
                                    │
          ┌─────────────────────────┼──────────────────────────┐
          │                         │                          │
    STORE AS                  DISPLAY AS               COMPUTE WITH
   UTC/epoch            local formatted string        UTC timestamps
   (in DB, API)         (Intl.DateTimeFormat)        (arithmetic, diffs)
          │                         │                          │
          └────────────── never mix ──────────────────────────┘

JAVASCRIPT DATE OBJECT
┌─────────────────────────────────────────────────────┐
│  new Date()            ← wraps UTC milliseconds      │
│  .getTime()            ← ms since epoch (UTC)        │
│  .toISOString()        ← "2024-01-15T00:00:00.000Z" │
│  .toLocaleDateString() ← locale-dependent (⚠️)       │
│  .getHours()           ← LOCAL hours (⚠️ TZ-sensitive)│
│  .getUTCHours()        ← UTC hours (✅ deterministic) │
└─────────────────────────────────────────────────────┘

DATE STRING PARSING TRAP
  "2024-01-15"      → parsed as UTC midnight → displays Jan 14 in UTC-5!
  "2024/01/15"      → Invalid Date in Safari (⚠️)
  new Date(2024,0,15) → parsed as LOCAL midnight → consistent display

TIMEZONE STACK
  UTC epoch integer
     ↓ IANA tz database (e.g. "Asia/Ho_Chi_Minh")
  Local civil time display
     ↓ Intl.DateTimeFormat / Temporal
  Rendered string in UI

LIBRARY LANDSCAPE (by bundle cost)
  Moment.js   ~67KB  [deprecated] immutable ❌ tree-shake ❌
  Luxon       ~23KB  immutable ✅ TZ ✅ Intl-based
  date-fns    ~2–8KB immutable ✅ tree-shake ✅ functional
  Day.js      ~2KB   immutable ✅ plugin-based ± TZ (plugin needed)
  Temporal    0KB    built-in (Stage 4, polyfill needed today)
  native Date ~0KB   mutable ⚠️ TZ ⚠️ API ⚠️
```

---

## Comparison Matrix / Bảng So Sánh

| Library / API   | Bundle size          | Immutable  | TZ support     | Parsing safety  | Modern API  | Tree-shakeable  | Status                |
| --------------- | -------------------- | ---------- | -------------- | --------------- | ----------- | --------------- | --------------------- |
| **native Date** | 0KB                  | ❌ Mutable | ⚠️ Local only  | ⚠️ Inconsistent | ❌ ES5-era  | N/A             | ✅ Built-in           |
| **Intl API**    | 0KB                  | ✅         | ✅ IANA via OS | N/A (display)   | ✅ Modern   | N/A             | ✅ Built-in           |
| **Temporal**    | 0KB (polyfill ~30KB) | ✅         | ✅ Full        | ✅ Strict       | ✅ Best     | N/A             | 🟡 Stage 4 (polyfill) |
| **Day.js**      | ~2KB core            | ✅         | ⚠️ Plugin only | ⚠️ Moment-like  | ✅ Modern   | ⚠️ Plugin cost  | ✅ Active             |
| **date-fns**    | 2–8KB used           | ✅         | ⚠️ date-fns-tz | ✅ Strict funcs | ✅ FP-style | ✅ Per-function | ✅ Active             |
| **Luxon**       | ~23KB                | ✅         | ✅ Full IANA   | ✅ Strict       | ✅ OOP      | ❌ Whole lib    | ✅ Active             |
| **Moment.js**   | ~67KB                | ❌ Mutable | ✅ moment-tz   | ⚠️ Lenient      | ❌ ES5-era  | ❌ Monolith     | ❌ Deprecated         |

**Quick decision rules / Quy tắc chọn nhanh:**

- 🟢 Simple formatting, no TZ → **Intl.DateTimeFormat** (zero cost)
- 🟡 Relative times ("5 min ago") → **Intl.RelativeTimeFormat** (zero cost)
- 🟡 FP codebase, tree-shake critical → **date-fns** + `date-fns-tz`
- 🟡 Need TZ + nice API, size OK → **Luxon**
- 🟡 Small footprint, familiar Moment API → **Day.js** + plugins
- 🔴 New project, long-lived codebase → **Temporal** (polyfill now, native later)
- ❌ Never start a new project with **Moment.js** (deprecated March 2024)

---

## Part 1: JavaScript Date Internals / Nội Tại Của Date

### How JavaScript stores dates / Cách JS lưu ngày giờ

JavaScript's `Date` object is a thin wrapper around a **UTC millisecond integer** (signed 64-bit float in practice, though stored as float64). Everything else — timezone display, locale formatting — is derived at read time.

```typescript
const d = new Date("2024-01-15T10:30:00.000Z");

// All three access the same underlying UTC number
console.log(d.getTime()); // 1705314600000  (ms since epoch)
console.log(d.valueOf()); // 1705314600000  (same — valueOf() calls getTime())
console.log(+d); // 1705314600000  (same — unary + triggers valueOf)

// These are LOCAL-time getters (TZ-dependent — dangerous!)
d.getHours(); // 17 in UTC+7, 10 in UTC+0
d.getDate(); // could differ by day depending on your TZ

// These are UTC getters (deterministic — safe!)
d.getUTCHours(); // always 10
d.getUTCDate(); // always 15
```

---

## Part 2: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: Why is `new Date('2024-01-15')` different from `new Date(2024, 0, 15)`?

**A:**

This is one of the most dangerous JavaScript Date traps — and a real source of "off-by-one-day" bugs in production.

```typescript
// FORM 1: ISO date-only string → parsed as UTC midnight
const fromString = new Date("2024-01-15");
console.log(fromString.toISOString());
// → "2024-01-15T00:00:00.000Z" ✅ always UTC midnight

// But in UTC-5 timezone (US Eastern in winter):
console.log(fromString.toLocaleDateString("en-US"));
// → "1/14/2024" ⚠️ One day BEHIND! UTC midnight = Jan 14 at 7 PM local

// FORM 2: Constructor with numeric args → parsed as LOCAL midnight
const fromArgs = new Date(2024, 0, 15); // month is 0-indexed!
console.log(fromArgs.toISOString());
// → "2024-01-14T17:00:00.000Z" in UTC-7 (shifted to UTC)
// → "2024-01-15T00:00:00.000Z" only if the viewer is in UTC

// FORM 3: Full ISO datetime string → always unambiguous
const fromFull = new Date("2024-01-15T00:00:00.000Z");
// → Always UTC midnight, always consistent ✅

// FORM 4: The Safari trap — non-ISO separators
const badSafari = new Date("2024/01/15"); // ⚠️ Invalid Date in Safari!
console.log(badSafari.toString()); // "Invalid Date" on WebKit

// SAFE PATTERN: parse dates for "date only" use cases
function parseDateOnly(dateStr: string): Date {
  // Append time to force local midnight interpretation
  return new Date(dateStr + "T00:00:00");
}
```

**Why the ECMAScript spec causes this**: Per ES2015+, an ISO 8601 date-only string (`"2024-01-15"`) is interpreted as UTC. A date-time string without `Z` suffix is treated as local time. This asymmetry is intentional but counterintuitive.

**Production pattern** — always use explicit datetime strings:

```typescript
// ✅ In APIs: always return full ISO datetime
// "2024-01-15T00:00:00.000Z"  — not "2024-01-15"

// ✅ For "date only" values (birthdays, local calendar dates):
// Store as string "2024-01-15" and never pass through Date constructor
// Parse manually: year=2024, month=1, day=15
```

🇻🇳 **Tóm tắt**: `new Date('2024-01-15')` được parse theo UTC → có thể hiển thị sai ngày ở múi giờ âm (UTC-5, UTC-8). `new Date(2024, 0, 15)` được parse theo local time — tháng 0-indexed. Luôn dùng full ISO datetime string với `Z` suffix để tránh ambiguity. Safari còn không parse `"2024/01/15"` (dấu `/` thay dấu `-`) — trả về `Invalid Date`.

💡 **Interview Signal**: ✅ Giải thích được UTC vs local parsing, biết Safari trap với dấu `/`, đề xuất dùng full ISO string. | ❌ Chỉ nói "Date string parsing weird" mà không giải thích tại sao.

---

### 🟢 Q2: What's the difference between `getTime()`, `valueOf()`, and `+date`?

**A:**

All three return the same number — the UTC millisecond timestamp — but they serve different purposes in code style and JavaScript internals.

```typescript
const now = new Date("2024-06-15T12:00:00.000Z");

// getTime() — explicit, self-documenting
const ms1: number = now.getTime(); // 1718452800000

// valueOf() — part of the JS object protocol
// Called implicitly when an object is used in numeric context
const ms2: number = now.valueOf(); // 1718452800000

// Unary + operator — calls valueOf() implicitly
const ms3: number = +now; // 1718452800000

// Also: Date.now() — current time without creating a Date object
const ms4: number = Date.now(); // no object allocation! ✅

// Practical differences:
// 1. Explicit timestamp → use getTime() for readability
// 2. Comparison → you can compare directly because valueOf() is called
const d1 = new Date("2024-01-01T00:00:00Z");
const d2 = new Date("2024-06-01T00:00:00Z");
console.log(d1 < d2); // ✅ true — valueOf() called implicitly
console.log(d1.getTime() < d2.getTime()); // ✅ same, more explicit

// 3. Performance — measure elapsed time
const start = performance.now(); // ✅ high-resolution, sub-ms
// ... heavy computation ...
const elapsed = performance.now() - start; // in milliseconds (float)

// Use Date.now() for wall clock, performance.now() for benchmarking
const t0 = Date.now(); // wall clock ms, integer
const p0 = performance.now(); // monotonic ms, float (not affected by clock skew)

// Type safety note in TypeScript:
function processTimestamp(ts: number) {
  /* ... */
}
processTimestamp(now.getTime()); // ✅ explicit number
processTimestamp(+now); // ✅ works, less readable
// processTimestamp(now);        // ❌ TS error: Date is not assignable to number
```

**Key insight**: `Date.now()` > `+new Date()` for performance-critical code — it avoids creating a `Date` object.

```typescript
// Benchmark: 1 million iterations
// Date.now():        ~15ms
// +new Date():       ~45ms  (allocates object, then calls valueOf)
// new Date().getTime(): ~50ms
```

🇻🇳 **Tóm tắt**: Ba cách đều trả về cùng giá trị ms UTC. `getTime()` là explicit nhất. `valueOf()` là protocol JS gọi khi dùng Date trong numeric context. `+date` là shorthand gọi `valueOf()`. Dùng `Date.now()` khi chỉ cần timestamp hiện tại — không tạo object, nhanh hơn ~3x. Dùng `performance.now()` khi cần đo hiệu năng — monotonic clock, không bị ảnh hưởng bởi clock skew.

💡 **Interview Signal**: ✅ Biết `Date.now()` vs `+new Date()` performance difference, phân biệt wall clock vs monotonic clock. | ❌ Nói "chúng giống nhau, dùng cái nào cũng được" — bỏ qua performance và semantic difference.

---

### 🟡 Q3: What are the pitfalls of timezone handling, especially DST transitions?

**A:**

Timezone bugs are the #1 source of date/time production incidents. Three main categories:

**Pitfall 1: Hardcoded UTC offsets**

```typescript
// ❌ WRONG — Brazil changed DST rules in 2019
const brazilOffset = -3; // "America/Sao_Paulo is UTC-3"
const localTime = new Date(utcTimestamp + brazilOffset * 3600 * 1000);

// ✅ CORRECT — let the IANA database handle it
const formatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "full",
  timeStyle: "short",
});
formatter.format(new Date(utcTimestamp));
// Works correctly before AND after Brazil's 2019 DST removal
```

**Pitfall 2: DST transition gaps and folds**

```typescript
// In regions that observe DST:
// SPRING FORWARD: 2:00 AM → 3:00 AM (1 hour disappears — "gap")
// FALL BACK: 2:00 AM → 1:00 AM (1 hour repeats — "fold")

// Example: US Eastern "spring forward" March 10, 2024 at 2:00 AM
const beforeTransition = new Date("2024-03-10T06:59:59Z"); // 1:59 AM EST
const afterTransition = new Date("2024-03-10T07:00:00Z"); // 3:00 AM EDT (skips 2:xx AM!)

// Gap: 2:00–3:00 AM does not exist on March 10
// Any appointment scheduled at "2:30 AM Eastern" on that day is invalid

// Fold: November 3, 2024 — 1:00 AM Eastern appears TWICE
// "1:30 AM Eastern" is ambiguous — is it the first or second occurrence?

// ✅ Always work in UTC internally, convert to local time only for display
function scheduleEvent(isoUtcDateTime: string, displayTz: string): string {
  const date = new Date(isoUtcDateTime);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: displayTz,
    dateStyle: "full",
    timeStyle: "long", // shows timezone abbreviation
  }).format(date);
}
```

**Pitfall 3: Server vs client timezone mismatch**

```typescript
// Server (Node.js) may run in UTC; client runs in local timezone
// new Date().toLocaleDateString() returns DIFFERENT values on server vs client

// ❌ WRONG: SSR assumes UTC, client assumes local → hydration mismatch
function DateDisplay({ isoString }: { isoString: string }) {
  return <span>{new Date(isoString).toLocaleDateString()}</span>;
  // Server renders "1/15/2024" (UTC), client re-renders "1/14/2024" (UTC-8) ⚠️
}

// ✅ CORRECT: Always pass explicit timezone
function DateDisplay({ isoString, userTz }: { isoString: string; userTz: string }) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: userTz,
    dateStyle: "medium",
  }).format(new Date(isoString));
  return <span>{formatted}</span>;
}
```

**Pitfall 4: The Brazil 2019 case (real-world)**

Brazil's president announced DST cancellation in April 2019, effective immediately from November 2019. Systems that used `moment-timezone` with IANA database received an automatic fix within days when the tz database released `2019b`. Systems with hardcoded `-3` offsets kept showing wrong times through the entire summer season.

**Rule**: Never hardcode a UTC offset. Always use an IANA timezone identifier (`"America/Sao_Paulo"`, `"Asia/Ho_Chi_Minh"`, `"Asia/Bangkok"`).

🇻🇳 **Tóm tắt**: 3 pitfall chính: (1) Hard-code UTC offset thay vì dùng IANA timezone — Brazil 2019 DST removal làm break toàn bộ hệ thống dùng cách này. (2) DST transitions: "spring forward" tạo ra 1 giờ không tồn tại (gap); "fall back" tạo ra 1 giờ xuất hiện hai lần (fold) — schedule vào thời điểm đó sẽ bị sai. (3) Server (UTC) vs client (local) timezone mismatch gây hydration bug trong SSR. Rule: luôn dùng IANA timezone string, luôn lưu UTC, chỉ convert khi display.

💡 **Interview Signal**: ✅ Nêu được Brazil 2019, giải thích DST gap/fold, đề xuất IANA tz + Intl API. | ❌ Chỉ nói "dùng UTC" mà không giải thích tại sao offset cứng là nguy hiểm.

---

### 🟡 Q4: How does `Intl.DateTimeFormat` work, and when is it better than custom formatting?

**A:**

`Intl.DateTimeFormat` is the browser's built-in locale-aware date formatter. It uses the OS's CLDR (Unicode Common Locale Data Repository) data — the same data that powers date display in iOS, Android, and macOS natively.

```typescript
// Basic usage
const date = new Date("2024-01-15T10:30:00.000Z");

// Vietnamese locale with full format
const vnFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});
console.log(vnFormatter.format(date));
// → "Thứ Hai, 15 tháng 1, 2024 lúc 17:30" ✅

// US English
const usFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "America/New_York",
});
console.log(usFormatter.format(date));
// → "January 15, 2024" ✅

// Calendar systems — Vietnamese users may want Solar + show lunar info
const thaiFormatter = new Intl.DateTimeFormat("th-TH", {
  calendar: "buddhist", // Buddhist calendar — years +543 from Gregorian
  dateStyle: "full",
  timeZone: "Asia/Bangkok",
});
console.log(thaiFormatter.format(date));
// → "วันจันทร์ที่ 15 มกราคม พ.ศ. 2567" ✅ (year 2567 in Buddhist era)

// Japanese imperial era
const jpFormatter = new Intl.DateTimeFormat("ja-JP", {
  calendar: "japanese",
  era: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
console.log(jpFormatter.format(new Date("2024-01-15")));
// → "令和6年1月15日" ✅ (Reiwa year 6)

// Numbering systems — Arabic-Indic numerals
const arFormatter = new Intl.DateTimeFormat("ar-SA", {
  numberingSystem: "arab",
  dateStyle: "short",
});
console.log(arFormatter.format(date));
// → "١٥‏/١‏/٢٠٢٤" (Arabic-Indic digits)

// ✅ PERFORMANCE: Reuse the formatter instance
// Creating Intl.DateTimeFormat is expensive (~1ms per instance)
// Calling .format() is cheap (~0.01ms)
const cachedFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  dateStyle: "medium",
});
// ✅ Reuse for thousands of rows
rows.forEach((row) => cachedFormatter.format(row.createdAt));

// formatToParts() — when you need fine-grained control
const parts = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
}).formatToParts(date);
// → [
//   { type: "month", value: "January" },
//   { type: "literal", value: " " },
//   { type: "day", value: "15" },
//   { type: "literal", value: ", " },
//   { type: "year", value: "2024" },
// ]

// Use formatToParts() to build custom layouts while keeping locale correctness
const dayPart = parts.find((p) => p.type === "day")?.value;
```

**When `Intl.DateTimeFormat` beats custom formatting:**

| Scenario                | Custom format     | Intl.DateTimeFormat    |
| ----------------------- | ----------------- | ---------------------- |
| Month names in VI/TH/AR | ❌ Manual map     | ✅ Auto via CLDR       |
| Calendar systems        | ❌ Complex math   | ✅ `calendar` option   |
| Number systems          | ❌ Manual replace | ✅ `numberingSystem`   |
| DST-aware display       | ❌ Hard           | ✅ Via `timeZone` IANA |
| Bundle size             | 0KB custom code   | ✅ 0KB (OS built-in)   |

**The one case where custom wins**: When you need a very specific, non-locale-standard format like `"YYYY-MM-DD"` for machine consumption — then `getUTCFullYear()` + manual construction is clearer.

🇻🇳 **Tóm tắt**: `Intl.DateTimeFormat` dùng dữ liệu CLDR của OS — tự động xử lý tên tháng bằng tiếng Việt/Thái/Ả Rập, calendar systems (Buddhist, Japanese era), numbering systems. Bundle size 0KB. Performance tip: tạo instance một lần rồi tái dùng `.format()` — tạo mới mỗi lần rất tốn. Dùng `formatToParts()` khi cần custom layout nhưng vẫn muốn locale-correct values.

💡 **Interview Signal**: ✅ Biết reuse formatter instance, nêu `formatToParts()`, đề cập `calendar` và `numberingSystem` options. | ❌ Nói "dùng `toLocaleDateString()` với locale string" — thiếu caching strategy và không biết các advanced options.

---

### 🟡 Q5: Day.js vs date-fns vs Luxon — when to choose each?

**A:**

Each library has a distinct design philosophy. Choosing the wrong one creates tech debt.

```typescript
// DAY.JS — Moment.js API clone, 2KB core
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Familiar Moment.js-like API
const d = dayjs("2024-01-15T10:30:00Z")
  .tz("Asia/Ho_Chi_Minh")
  .add(2, "hour")
  .format("DD/MM/YYYY HH:mm"); // "15/01/2024 19:30"

// ⚠️ TZ plugin adds ~30KB — core 2KB promise becomes 32KB
// ⚠️ Plugins must be registered globally — problematic in SSR/testing

// DATE-FNS — functional, tree-shakeable, ~2-8KB actual use
import { format, addDays, isAfter, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const date = parseISO("2024-01-15T10:30:00Z");
const nextWeek = addDays(date, 7);
const formatted = format(nextWeek, "dd/MM/yyyy", { locale: vi }); // with vi locale
const inSaigon = formatInTimeZone(date, "Asia/Ho_Chi_Minh", "HH:mm dd/MM/yyyy");

// ✅ Each function is independently importable — bundler only ships what you use
// ✅ Native Date objects as input/output — no wrapper type lock-in
// ✅ Best choice for functional/FP codebases

// LUXON — built on Intl API, full OOP, ~23KB
import { DateTime } from "luxon";

const dt = DateTime.fromISO("2024-01-15T10:30:00Z").setZone("Asia/Ho_Chi_Minh").plus({ hours: 2 });

console.log(dt.toFormat("dd/MM/yyyy HH:mm")); // "15/01/2024 19:30"
console.log(dt.toRelative()); // "in 5 months" (Intl-based, locale-aware)
console.log(dt.zoneName); // "Asia/Ho_Chi_Minh"
console.log(dt.offset); // 420 (minutes, i.e., UTC+7)
console.log(dt.isInDST); // false

// Luxon's killer feature: Duration and Interval types
import { Interval, Duration } from "luxon";

const interval = Interval.fromDateTimes(
  DateTime.fromISO("2024-01-15"),
  DateTime.fromISO("2024-06-15"),
);
console.log(interval.count("months")); // 5
console.log(interval.toDuration(["months", "days"]).toISO()); // "P5M"
```

**Decision matrix:**

| Scenario                           | Winner      | Reason                            |
| ---------------------------------- | ----------- | --------------------------------- |
| Migrate from Moment.js             | Day.js      | Drop-in API replacement, 2KB core |
| FP codebase, tree-shake critical   | date-fns    | Per-function import, 0-overhead   |
| Need full TZ + Duration + Interval | Luxon       | Best full-featured API            |
| Need relative time only            | Native Intl | `Intl.RelativeTimeFormat` — 0KB   |
| New project, future-proof          | Temporal    | Zero runtime cost when native     |
| Legacy codebase, can't change      | Moment.js   | Don't upgrade just to upgrade     |

**Real bundle size (2024 analysis):**

```
Day.js core only:          2.0 KB gz
Day.js + utc + timezone:  31.4 KB gz (IANA data included)
date-fns (10 functions):   5.2 KB gz
date-fns-tz (2 functions): 8.1 KB gz total
Luxon full:               22.8 KB gz
Moment + moment-timezone: 68.4 KB gz
```

🇻🇳 **Tóm tắt**: Day.js = Moment API clone, 2KB core nhưng TZ plugin thêm ~30KB → tổng gần bằng Luxon. date-fns = functional, tree-shakeable, import từng function → bundle size tối ưu nhất, tốt nhất cho FP codebase. Luxon = OOP đầy đủ, TZ native qua Intl, có Duration/Interval, phù hợp khi cần tính toán phức tạp. Không bao giờ start project mới với Moment.js (deprecated). Nếu chỉ cần display → dùng `Intl.DateTimeFormat` miễn phí.

💡 **Interview Signal**: ✅ Biết Day.js TZ plugin blow up bundle size, so sánh được actual KB numbers, biết khi nào Intl native thay thế được cả ba. | ❌ "Day.js nhỏ nhất vì chỉ 2KB" — sai khi cần TZ support.

---

### 🟡 Q6: How does `Intl.RelativeTimeFormat` work — "5 minutes ago" without a library?

**A:**

`Intl.RelativeTimeFormat` is the browser-native API for locale-aware relative time strings. It's available in all modern browsers since 2020 and eliminates the need for moment.js/date-fns just for "time ago" functionality.

```typescript
// Basic usage
const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });

rtf.format(-1, "day");    // → "hôm qua"
rtf.format(-5, "minute"); // → "5 phút trước"
rtf.format(3, "hour");    // → "sau 3 giờ"
rtf.format(-1, "month");  // → "tháng trước"

// With numeric: "always" (forces numbers even for yesterday/tomorrow)
const rtfNumeric = new Intl.RelativeTimeFormat("en", { numeric: "always" });
rtfNumeric.format(-1, "day"); // → "1 day ago" (not "yesterday")

// Full implementation — a production-ready "time ago" function
const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60,        name: "seconds" },
  { amount: 60,        name: "minutes" },
  { amount: 24,        name: "hours"   },
  { amount: 7,         name: "days"    },
  { amount: 4.34524,   name: "weeks"   },
  { amount: 12,        name: "months"  },
  { amount: Infinity,  name: "years"   },
];

function timeAgo(date: Date, locale = "vi"): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  let duration = (date.getTime() - Date.now()) / 1000; // in seconds

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), "years");
}

// Usage:
timeAgo(new Date(Date.now() - 5 * 60 * 1000), "vi");  // "5 phút trước"
timeAgo(new Date(Date.now() - 5 * 60 * 1000), "en");  // "5 minutes ago"
timeAgo(new Date(Date.now() - 2 * 3600 * 1000), "vi"); // "2 giờ trước"
timeAgo(new Date(Date.now() - 86400 * 1000), "vi");    // "hôm qua"

// React integration — auto-updating relative time
import { useState, useEffect, useRef } from "react";

function RelativeTime({ date, locale = "vi" }: { date: Date; locale?: string }) {
  const [label, setLabel] = useState(() => timeAgo(date, locale));

  useEffect(() => {
    // Update every 30 seconds — no need for every-second polling
    const id = setInterval(() => {
      setLabel(timeAgo(date, locale));
    }, 30_000);
    return () => clearInterval(id);
  }, [date, locale]);

  return (
    <time dateTime={date.toISOString()} title={date.toLocaleString(locale)}>
      {label}
    </time>
  );
}

// ✅ Accessibility: use <time> element with dateTime attr for screen readers
// ✅ title attr gives full absolute date on hover
```

**Locale awareness — Vietnamese specifics:**

```typescript
const rtfVi = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });

// Vietnamese relative time uses natural language patterns
rtfVi.format(-1, "day"); // "hôm qua" (yesterday)
rtfVi.format(-2, "day"); // "2 ngày trước"
rtfVi.format(1, "day"); // "ngày mai" (tomorrow)
rtfVi.format(-1, "week"); // "tuần trước"
rtfVi.format(-1, "month"); // "tháng trước"
rtfVi.format(-1, "year"); // "năm ngoái"
```

🇻🇳 **Tóm tắt**: `Intl.RelativeTimeFormat` built-in trong mọi trình duyệt hiện đại, hỗ trợ tiếng Việt đầy đủ ("hôm qua", "tuần trước"). Implement "X phút trước" chỉ cần ~20 dòng code không cần library. Kết hợp với `<time>` HTML element cho accessibility. Không cần poll mỗi giây — 30 giây là đủ cho "minutes ago" display. Cache `Intl.RelativeTimeFormat` instance nếu dùng cho nhiều rows.

💡 **Interview Signal**: ✅ Biết `Intl.RelativeTimeFormat`, viết được implementation 20-30 dòng, nhắc `<time>` element với `dateTime` attr, biết cache formatter instance. | ❌ "Dùng moment.js `fromNow()`" — ship 67KB chỉ cho 1 feature.

---

### 🔴 Q7: What is the Temporal API and what problems does it solve?

**A:**

The Temporal API is the TC39 proposal (now Stage 4 — landed in spec, awaiting browser implementation) that replaces JavaScript's broken `Date` object. It addresses every major flaw in `Date` with a clean, immutable API.

**Problems with `Date` that Temporal fixes:**

```typescript
// PROBLEM 1: Date is mutable — methods mutate in place
const d = new Date("2024-01-15");
d.setMonth(5); // mutates d! now d is June 15 ⚠️

// PROBLEM 2: No concept of "date without time"
// "2024-01-15" as a concept (birthday, holiday) forces you into UTC midnight tricks
const birthday = new Date("1990-03-25"); // forced into datetime

// PROBLEM 3: Month is 0-indexed (Jan=0, Dec=11)
new Date(2024, 0, 15); // January 15 — "0" is counterintuitive

// PROBLEM 4: No timezone-aware arithmetic
// Adding "1 day" across a DST transition is wrong:
const dst = new Date("2024-03-10T01:00:00"); // 1 AM before spring forward
dst.setDate(dst.getDate() + 1); // adds 24 hours, not 1 calendar day ⚠️

// PROBLEM 5: No Duration type
// "3 months from now" — months have different lengths, need special logic
```

**Temporal's type system:**

```typescript
// Temporal is already usable today via polyfill:
// npm install @js-temporal/polyfill
import { Temporal } from "@js-temporal/polyfill";

// PlainDate — date without time, no timezone
const birthday = Temporal.PlainDate.from("1990-03-25");
console.log(birthday.year); // 1990
console.log(birthday.month); // 3 (1-indexed! ✅)
console.log(birthday.day); // 25

// PlainTime — time without date, no timezone
const meetingTime = Temporal.PlainTime.from("14:30:00");

// PlainDateTime — date + time, no timezone (calendar/local representations)
const localEvent = Temporal.PlainDateTime.from("2024-01-15T14:30:00");

// Instant — exact UTC moment (equivalent to Date epoch ms, but better API)
const now = Temporal.Now.instant();
console.log(now.epochMilliseconds); // same as Date.now()

// ZonedDateTime — date + time + timezone (THE most complete type)
const booking = Temporal.ZonedDateTime.from({
  timeZone: "Asia/Ho_Chi_Minh",
  year: 2024,
  month: 1,
  day: 15,
  hour: 14,
  minute: 30,
});
console.log(booking.toInstant().epochMilliseconds); // UTC epoch

// ✅ Immutable arithmetic — returns new objects
const nextWeek = booking.add({ weeks: 1 }); // booking unchanged!
const nextMonth = birthday.add({ months: 1 }); // calendar-aware

// ✅ Duration type
const duration = Temporal.Duration.from({ months: 3, days: 5 });
const future = Temporal.Now.plainDateISO().add(duration);

// ✅ DST-aware arithmetic
const beforeDST = Temporal.ZonedDateTime.from({
  timeZone: "America/New_York",
  year: 2024,
  month: 3,
  day: 10,
  hour: 1,
});
// Adding 1 day respects DST — result is 1:00 AM EDT (not 25 hours later)
const afterDST = beforeDST.add({ days: 1 });
console.log(afterDST.hour); // 1 (correct calendar day, not +24h)

// ✅ Calendar systems
const thaiDate = Temporal.PlainDate.from({
  calendar: "buddhist",
  year: 2567,
  month: 1,
  day: 15,
});
console.log(thaiDate.withCalendar("iso8601").toString()); // "2024-01-15"
```

**ZonedDateTime vs PlainDateTime — when to use each:**

```typescript
// PlainDateTime: "Meeting at 2 PM" — the concept, not the moment
// If you move the meeting to a different timezone, the wall clock stays 2 PM
const meeting = Temporal.PlainDateTime.from("2024-01-15T14:00:00");
// Use when: calendar appointments, recurring events, birthdays

// ZonedDateTime: "Video call at 2 PM Vietnam Time" — an exact moment
// Represented as a specific UTC instant + timezone for display
const call = Temporal.ZonedDateTime.from({
  timeZone: "Asia/Ho_Chi_Minh",
  year: 2024,
  month: 1,
  day: 15,
  hour: 14,
});
// Use when: booking systems, scheduling across timezones, Grab ride pickup time

// Instant: "This event happened at UTC epoch X" — for storage, comparisons
const stored: bigint = call.toInstant().epochNanoseconds;
```

**Migration strategy:**

```typescript
// Coexistence: Temporal interops with legacy Date
const legacyDate = new Date("2024-01-15T10:30:00Z");

// Date → Temporal
const instant = Temporal.Instant.fromEpochMilliseconds(legacyDate.getTime());
const zdt = instant.toZonedDateTimeISO("Asia/Ho_Chi_Minh");

// Temporal → Date (for legacy APIs)
const backToDate = new Date(zdt.toInstant().epochMilliseconds);
```

🇻🇳 **Tóm tắt**: Temporal giải quyết toàn bộ vấn đề của Date: (1) Immutable — mọi operation trả về object mới. (2) Type system rõ ràng: `PlainDate` (ngày, không giờ), `PlainDateTime` (ngày + giờ, không TZ), `ZonedDateTime` (ngày + giờ + TZ — dùng cho booking), `Instant` (UTC epoch để lưu trữ). (3) Tháng 1-indexed. (4) DST-aware arithmetic. (5) Duration type. Hiện tại Stage 4 (spec finalized), dùng `@js-temporal/polyfill` cho production. Migrate dần: convert Date↔Temporal tại boundary.

💡 **Interview Signal**: ✅ Phân biệt được PlainDate/PlainDateTime/ZonedDateTime/Instant và khi nào dùng cái nào, biết DST-aware arithmetic, biết polyfill. | ❌ "Temporal giống Date nhưng immutable" — đúng một phần, bỏ qua type system và calendar support.

---

### 🔴 Q8: How should you store timestamps for a global user base?

**A:**

This is a system design question with concrete technical implications. There are three common patterns — each with tradeoffs:

```typescript
// OPTION A: Unix epoch (milliseconds integer)
// Store: 1705314600000
// Pros: compact, easy compare/sort, unambiguous
// Cons: not human-readable, no timezone info embedded

// OPTION B: ISO 8601 with UTC offset
// Store: "2024-01-15T17:30:00+07:00"
// Pros: human-readable, timezone info embedded
// Cons: offset at time of writing — if user moves timezone, old records unclear
//       DST: "+07:00" doesn't tell you which timezone, just the offset at that instant

// OPTION C: ISO 8601 UTC (with Z)
// Store: "2024-01-15T10:30:00.000Z"
// Pros: unambiguous, human-readable, standard
// Cons: slightly verbose

// RECOMMENDATION:
// DB storage: UTC ISO string or Unix epoch integer (both unambiguous)
// API transport: ISO 8601 with Z ("2024-01-15T10:30:00.000Z")
// User's timezone: store SEPARATELY as IANA identifier ("Asia/Ho_Chi_Minh")

interface UserEvent {
  // ✅ Store the UTC moment
  occurredAt: string; // "2024-01-15T10:30:00.000Z"
  // ✅ Store the user's timezone at time of event (IANA)
  userTimezone: string; // "Asia/Ho_Chi_Minh"
  // ❌ Never store: "17:30 ICT" — ambiguous, can't convert
  // ❌ Never store: "2024-01-15T17:30:00" (no Z) — timezone unknown
}

// PostgreSQL schema recommendation:
// created_at TIMESTAMPTZ  -- ✅ stores UTC internally, displays with TZ offset
// user_tz VARCHAR(64)     -- "Asia/Ho_Chi_Minh"
// NOT: created_at TIMESTAMP  -- stores local time, TZ-ambiguous ⚠️

// Display: convert at query time or in API response
function formatForUser(isoUtc: string, userTz: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: userTz,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(isoUtc));
}

// GRAB BOOKING EXAMPLE: Timezone-aware receipt
interface GrabBooking {
  pickupRequestedAt: string; // "2024-01-15T03:30:00.000Z" (UTC)
  pickupCity: string; // "hanoi"
  pickupTz: string; // "Asia/Ho_Chi_Minh" (UTC+7)
  // Display: "15/01/2024 lúc 10:30" (local Hanoi time)
}

// What NOT to store — common mistakes:
interface BadBooking {
  pickupTime: string; // "10:30" — what timezone? what date? ❌
  pickupDate: string; // "2024-01-15" — what timezone? ❌
  pickupOffset: number; // 7 — not IANA, breaks with DST ❌
}

// EDGE CASE: "Date-only" values (birthdays, holidays, deadlines)
// These should NOT be stored as timestamps at all!
interface UserProfile {
  birthday: string; // "1990-03-25" — plain date string, no timezone
  // Why: a birthday is the SAME calendar date regardless of timezone
  // Converting to UTC timestamp would give different dates in different TZs
}

// For Zalo message timestamps: store UTC epoch + sender's timezone
interface ChatMessage {
  sentAt: number; // Unix epoch ms — efficient for sorting
  senderTz: string; // "Asia/Ho_Chi_Minh"
  // Display: convert sentAt to user's LOCAL timezone for rendering
}
```

🇻🇳 **Tóm tắt**: 3 cách lưu timestamp: epoch integer, ISO 8601+offset, ISO 8601 UTC (Z). Khuyến nghị: lưu UTC ISO string trong DB, transport qua API dưới dạng ISO Z, lưu thêm IANA timezone của user trong cột riêng. PostgreSQL: dùng `TIMESTAMPTZ` (lưu UTC), không dùng `TIMESTAMP`. "Date-only" values (birthday, holiday) lưu dạng string "YYYY-MM-DD" — không ép vào UTC timestamp sẽ bị lệch ngày. Grab booking cần `pickupTz: "Asia/Ho_Chi_Minh"` riêng vì múi giờ đặt xe và múi giờ của tài khoản user có thể khác nhau.

💡 **Interview Signal**: ✅ Phân biệt timestamp vs date-only, đề xuất lưu IANA timezone riêng, biết `TIMESTAMPTZ` vs `TIMESTAMP` trong Postgres. | ❌ "Lưu UTC là xong" — thiếu case date-only values và lưu user timezone.

---

### 🔴 Q9: How do you render 10,000 rows with relative timestamps efficiently?

**A:**

This combines three performance topics: DOM virtualization, memoization, and Intl object reuse.

```typescript
// NAIVE APPROACH — don't do this ❌
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.text}
          {/* Creates new Intl.RelativeTimeFormat every render × every row! */}
          <span>{new Intl.RelativeTimeFormat("vi").format(
            Math.round((msg.sentAt - Date.now()) / 1000 / 60), "minutes"
          )}</span>
        </div>
      ))}
    </div>
  );
}
// Cost: 10K × 2-3ms per Intl construction = 20-30 seconds of blocking work ❌

// OPTIMIZED APPROACH — 3 techniques
// 1. VIRTUALIZATION: Only render visible rows
import { FixedSizeList as List } from "react-window";

// 2. MEMOIZED FORMATTER: Create once, reuse everywhere
const relativeFormatter = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });

function getRelativeTime(epochMs: number): string {
  const diffMs = epochMs - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours   = Math.round(diffMinutes / 60);
  const diffDays    = Math.round(diffHours / 24);

  if (Math.abs(diffSeconds) < 60)  return relativeFormatter.format(diffSeconds, "seconds");
  if (Math.abs(diffMinutes) < 60)  return relativeFormatter.format(diffMinutes, "minutes");
  if (Math.abs(diffHours) < 24)    return relativeFormatter.format(diffHours, "hours");
  return relativeFormatter.format(diffDays, "days");
}

// 3. MEMOIZED ROW COMPONENT: Prevent re-renders
const MessageRow = React.memo(
  ({ message }: { message: Message }) => {
    const timeLabel = useMemo(
      () => getRelativeTime(message.sentAt),
      [message.sentAt]
    );
    return (
      <div className="message-row">
        <span>{message.text}</span>
        <time dateTime={new Date(message.sentAt).toISOString()}>{timeLabel}</time>
      </div>
    );
  },
  (prev, next) => prev.message.id === next.message.id && prev.message.sentAt === next.message.sentAt
);

// 4. VIRTUALIZED LIST: Only DOM for visible ~15-20 rows
function MessageList({ messages }: { messages: Message[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <MessageRow message={messages[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={messages.length}
      itemSize={60} // row height px
      width="100%"
    >
      {Row}
    </List>
  );
}

// 5. GLOBAL INTERVAL: One timer for all relative timestamps (not one per row!)
useEffect(() => {
  const interval = setInterval(() => {
    // Trigger re-render — but only rows visible in virtual list will re-render
    forceUpdate(); // or use a global atom/store that MessageRow subscribes to
  }, 30_000); // 30 seconds — more than enough for "X min ago" accuracy

  return () => clearInterval(interval);
}, []);

// PERFORMANCE NUMBERS:
// Naive (10K rows, no virtualization, new Intl each time):
//   Initial render: ~8 seconds ❌
//   Update tick: ~8 seconds ❌
//
// Optimized (virtualization + memoized Intl + React.memo):
//   Initial render: ~50ms ✅ (only 15 visible rows)
//   Update tick: ~2ms ✅ (only visible rows, stable memo)
```

**Additional patterns for production:**

```typescript
// Web Worker for bulk formatting (keeps main thread unblocked)
// worker.ts
self.addEventListener("message", (e: MessageEvent<number[]>) => {
  const formatter = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
  const results = e.data.map((ts) => formatRelative(ts, formatter));
  self.postMessage(results);
});

// For absolute date formatting (not relative), use date-cached map:
const absoluteFormatCache = new Map<number, string>();
const absoluteFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  dateStyle: "short",
  timeStyle: "short",
});

function formatAbsolute(epochMs: number): string {
  // Round to minute for cache efficiency
  const roundedMs = Math.floor(epochMs / 60_000) * 60_000;
  if (!absoluteFormatCache.has(roundedMs)) {
    absoluteFormatCache.set(roundedMs, absoluteFormatter.format(new Date(roundedMs)));
  }
  return absoluteFormatCache.get(roundedMs)!;
}
```

🇻🇳 **Tóm tắt**: 5 kỹ thuật cho 10K rows với relative timestamps: (1) Virtualization (react-window) — chỉ render 15-20 rows visible. (2) Memoize Intl formatter — tạo 1 lần, dùng nhiều lần. (3) `React.memo` cho row component. (4) 1 global interval 30 giây — không tạo interval per-row. (5) Web Worker cho bulk formatting nếu cần. Kết quả: từ 8 giây → 50ms initial render.

💡 **Interview Signal**: ✅ Đề xuất đủ 3 layers (virtualization + Intl reuse + React.memo), biết interval thống nhất, nêu con số cụ thể. | ❌ "Dùng `useMemo`" — đúng nhưng chỉ 1 trong 5 cần thiết.

---

### 🔴 Q10: How does JavaScript handle non-Gregorian calendar systems, and what's relevant for Vietnam?

**A:**

The `Intl` API supports multiple calendar systems via the `calendar` option — this powers date display in Thailand (Buddhist), Japan (Imperial era), Saudi Arabia (Islamic/Hijri), Israel (Hebrew), and many others.

```typescript
// CALENDAR SYSTEMS via Intl.DateTimeFormat

const refDate = new Date("2024-01-15T00:00:00Z");

// 1. BUDDHIST CALENDAR (Thailand — used by 70M people)
//    Year = Gregorian + 543
const thaiFormatter = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Bangkok",
});
console.log(thaiFormatter.format(refDate));
// → "15 มกราคม 2567" (year 2567 = 2024 + 543)

// 2. JAPANESE IMPERIAL ERA
//    Currently: Reiwa (令和) era — started May 1, 2019
const jpFormatter = new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
  era: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
console.log(jpFormatter.format(refDate));
// → "令和6年1月15日" (Reiwa year 6)

// Era transitions are automatic — Heisei → Reiwa was handled by CLDR update

// 3. HIJRI / ISLAMIC CALENDAR
const arFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
console.log(arFormatter.format(refDate));
// → "٤ رجب ١٤٤٥" (4 Rajab 1445)

// 4. HEBREW CALENDAR
const heFormatter = new Intl.DateTimeFormat("he-IL-u-ca-hebrew", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
console.log(heFormatter.format(refDate));
// → "ה׳ בשבט תשפ״ד" (5 Shvat 5784)

// TEMPORAL with calendar systems (even cleaner)
import { Temporal } from "@js-temporal/polyfill";

const buddhistDate = Temporal.PlainDate.from({
  calendar: "buddhist",
  year: 2567,
  month: 1,
  day: 15,
});
console.log(buddhistDate.withCalendar("iso8601").toString()); // "2024-01-15"
const isoDate = Temporal.PlainDate.from("2024-01-15");
console.log(isoDate.withCalendar("buddhist").year); // 2567

// VIETNAMESE LUNAR CALENDAR (Âm lịch) — THE special case
// ⚠️ Vietnamese lunar calendar (âm lịch) is NOT directly supported by Intl!
// The "chinese" calendar in Intl is similar but uses Chinese lunar rules
// Vietnamese âm lịch follows traditional East Asian lunisolar calendar
// but with slight differences in which month is considered "leap month"

// What Intl CAN do:
const lunarFormatter = new Intl.DateTimeFormat("vi-VN-u-ca-chinese", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
console.log(lunarFormatter.format(new Date("2024-02-10"))); // Tết Nguyên Đán 2024
// → "tháng 1 năm Giáp Thìn ngày 1" (approximate — uses Chinese rules)

// For ACCURATE Vietnamese âm lịch display:
// Use a dedicated library like "lunar-javascript" or "amlich" npm package
// These implement the traditional Vietnamese astronomical algorithm
import { getLunarDate } from "lunar-javascript"; // example

const solar = { day: 10, month: 2, year: 2024 };
const lunar = getLunarDate(solar.day, solar.month, solar.year);
// → { day: 1, month: 1, year: 2024, isLeap: false } (Tết: ngày 1/1 âm lịch)

// Production pattern for Vietnamese apps showing both calendars:
function formatDualCalendar(date: Date, locale = "vi-VN"): string {
  const solar = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);

  // Âm lịch via Chinese calendar approximation
  const lunar = new Intl.DateTimeFormat("vi-VN-u-ca-chinese", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);

  return `${solar} (${lunar})`; // "10 tháng 2, 2024 (tháng 1 ngày 1)"
}

// GRAB VIETNAM TET CONTEXT: Show âm lịch for holiday pricing
const tetDate = new Date("2024-02-10");
console.log(formatDualCalendar(tetDate));
// → "10 tháng 2, 2024 (tháng 1 ngày 1)" — Tết day for surge pricing context
```

**Calendar support summary:**

| Calendar           | Intl key           | Countries      | Notes                           |
| ------------------ | ------------------ | -------------- | ------------------------------- |
| Gregorian          | `iso8601`          | Global default | Standard                        |
| Buddhist           | `buddhist`         | TH, MM, KH, LK | Year + 543                      |
| Japanese           | `japanese`         | JP             | Imperial era names auto-updated |
| Islamic (civil)    | `islamic`          | SA, AE, many   | Multiple variants               |
| Hijri (tabular)    | `islamic-umalqura` | SA official    | Most accurate for Arabia        |
| Hebrew             | `hebrew`           | IL             | Lunisolar                       |
| Chinese            | `chinese`          | CN             | Base for Vietnamese âm lịch     |
| Vietnamese âm lịch | ❌ Not in Intl     | VN             | Use `lunar-javascript` library  |
| Persian            | `persian`          | IR             | Solar hijri                     |
| Ethiopic           | `ethiopic`         | ET             | +7 years from Gregorian         |

🇻🇳 **Tóm tắt**: Intl API hỗ trợ nhiều calendar systems: Buddhist (+543 năm so Gregorian, dùng ở TH), Japanese Imperial Era (Reiwa/令和, tự động cập nhật khi có era mới), Hijri, Hebrew. Tiếng Việt đặc biệt: Intl có "chinese" calendar gần giống âm lịch VN nhưng không hoàn toàn chính xác — muốn chính xác cần dùng library riêng như `lunar-javascript` hoặc `amlich`. Ứng dụng VN thường hiển thị cả dương lịch lẫn âm lịch — đặc biệt quan trọng cho Tết, giỗ, và các ngày lễ truyền thống.

💡 **Interview Signal**: ✅ Biết `ca-buddhist` cho Thailand, giải thích Japanese era auto-update qua CLDR, nhận biết âm lịch VN không được Intl support trực tiếp và cần library. | ❌ "Intl hỗ trợ hết mọi calendar" — sai với âm lịch VN.

---

## Part 3: Anti-Patterns / Các Lỗi Phổ Biến

---

### ❌ Anti-Pattern 1: Mutating Date objects (Moment.js era habit)

```typescript
// ❌ WRONG — Moment.js trained developers to expect mutable add()
const deadline = new Date("2024-01-15");
deadline.setDate(deadline.getDate() + 7); // mutates original!

// If this deadline is shared in state or across components:
// other code holding reference to 'deadline' now sees the MODIFIED date ⚠️

// ❌ Classic React bug:
const [deadline, setDeadline] = useState(new Date("2024-01-15"));
function handleExtend() {
  deadline.setDate(deadline.getDate() + 7); // mutates the state object!
  // React doesn't detect change — same reference → no re-render ⚠️
}

// ✅ CORRECT — always create new Date
function addDays(date: Date, days: number): Date {
  const result = new Date(date); // copy
  result.setDate(result.getDate() + days);
  return result; // original unchanged
}

const extended = addDays(deadline, 7); // deadline unchanged ✅

// ✅ With Temporal (immutable by design)
const t = Temporal.PlainDate.from("2024-01-15");
const extended = t.add({ days: 7 }); // t unchanged, extended is new ✅
```

🇻🇳 **Tóm tắt**: `Date` object mutable — `setDate()`, `setMonth()`, `setHours()` đều modify in-place. Dễ gây bug trong React (state không re-render) và shared reference bugs. Pattern: luôn `new Date(original)` trước khi modify. Temporal fix vĩnh viễn vấn đề này — mọi operation đều return new object.

---

### ❌ Anti-Pattern 2: Storing local time strings in database

```typescript
// ❌ WRONG — storing local time in DB
// DB record: { event_time: "2024-01-15 17:30:00" }
// Question: which timezone is this? ICT? UTC? Server TZ?

// When server timezone changes (e.g., cloud migration to different region):
// All old records become wrong with no way to fix them ⚠️

// When app goes international:
// User in Singapore queries "events after 17:00" — 17:00 what timezone? ⚠️

// ✅ CORRECT — store UTC, display locally
// DB record: { event_time: "2024-01-15T10:30:00.000Z", user_tz: "Asia/Ho_Chi_Minh" }
// → UTC time is unambiguous regardless of where the server lives
// → user_tz tells us how to display it back to the user

// PostgreSQL: use TIMESTAMPTZ (timestamp with time zone)
// It stores UTC internally and accepts/returns with offset
// TIMESTAMP (without zone) is almost always wrong for global apps
```

🇻🇳 **Tóm tắt**: Lưu local time string trong DB (ví dụ "17:30:00" không có timezone) gây mất thông tin timezone vĩnh viễn. Khi server chuyển region hoặc app mở rộng quốc tế, không thể recover. Luôn lưu UTC (ISO Z string hoặc TIMESTAMPTZ trong Postgres) + user timezone riêng.

---

### ❌ Anti-Pattern 3: Using `toLocaleString()` without explicit locale

```typescript
// ❌ WRONG — browser-dependent output
const d = new Date("2024-01-15T10:30:00Z");
console.log(d.toLocaleString()); // Chrome US: "1/15/2024, 10:30:00 AM"
// Firefox DE: "15.1.2024, 10:30:00"
// Safari VN:  "15:30:00 15 tháng 1, 2024" (??)

// In SSR (Node.js): depends on server locale setting
// In different OS versions: CLDR data version differs → different output!
// Impossible to test consistently ⚠️

// ✅ CORRECT — always pass explicit locale AND timezone
const formatted = d.toLocaleString("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  dateStyle: "short",
  timeStyle: "medium",
});
// → Always: "15/01/2024, 17:30:00" regardless of where code runs ✅

// ✅ BETTER — use Intl.DateTimeFormat with cached instance
const formatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  dateStyle: "short",
  timeStyle: "medium",
});
formatter.format(d); // deterministic ✅
```

🇻🇳 **Tóm tắt**: `toLocaleString()` không có args phụ thuộc browser/OS locale → output khác nhau trên các máy, không thể test nhất quán, gây hydration mismatch trong SSR. Luôn truyền explicit locale string ("vi-VN") và `timeZone` option.

---

### ❌ Anti-Pattern 4: Polyfilling Temporal in production carelessly

```typescript
// ❌ WRONG — importing entire polyfill unconditionally in production
// This adds ~30KB to every page, even in browsers that will ship native Temporal soon
import { Temporal } from "@js-temporal/polyfill"; // always polyfill ❌

// ✅ CORRECT — conditional polyfill (progressive enhancement)
// Option A: Feature detect + dynamic import
const TemporalModule =
  typeof globalThis.Temporal !== "undefined"
    ? globalThis.Temporal
    : (await import("@js-temporal/polyfill")).Temporal;

// Option B: Ponyfill pattern — don't pollute global
import { Temporal } from "@js-temporal/polyfill"; // explicit import, don't assign to window.Temporal

// Option C: Wait for native (expected 2025-2026 in Chrome/Safari/Firefox)
// For new projects in 2024: use polyfill behind feature flag or in dev only
// For legacy projects: stick with date-fns/Luxon until native ships

// ✅ ALSO: @js-temporal/polyfill is Stage 4 aligned but not 100% spec-frozen for
// edge cases — pin the version and read changelog before upgrading
```

🇻🇳 **Tóm tắt**: `@js-temporal/polyfill` thêm ~30KB. Không import unconditionally cho production — dùng feature detect hoặc ponyfill pattern (import explicit, không gán vào `globalThis`). Chrome/Firefox/Safari đang implement Temporal native (expected 2025-2026) — cân nhắc timeline trước khi commit vào polyfill nặng.

---

### ❌ Anti-Pattern 5: Manually computing timezone offsets

```typescript
// ❌ WRONG — manual offset math (DST-unaware)
const VN_OFFSET_MS = 7 * 60 * 60 * 1000; // Vietnam = UTC+7

function toVietnamTime(utcDate: Date): Date {
  return new Date(utcDate.getTime() + VN_OFFSET_MS);
}
// Vietnam doesn't observe DST so this happens to work...
// But Thailand (UTC+7 too, no DST) has occasional historical exceptions
// And this pattern applied to other timezones (e.g., Australia, US) will break ⚠️

// Also: this creates a Date object with WRONG internal value (UTC shifted)
// If you then call .getUTCHours() on it, you get Vietnamese hours — confusing!

// ❌ ALSO WRONG — using getTimezoneOffset() for display
const offset = new Date().getTimezoneOffset(); // in minutes, inverted sign!
// -420 for UTC+7 (inverted! negative means ahead of UTC)
// This only gives the CLIENT's current offset — useless for other users' timezones

// ✅ CORRECT — always use IANA timezone in Intl
function getTimeInZone(utcDate: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(utcDate);
}

getTimeInZone(new Date("2024-03-10T07:30:00Z"), "America/New_York");
// → "03:30" (correctly accounts for DST spring-forward on March 10!) ✅
```

🇻🇳 **Tóm tắt**: Tự tính offset (`UTC+7 = +7*3600*1000`) không account cho DST và historical timezone changes. Kết quả sai khi áp dụng cho các timezone có DST. `getTimezoneOffset()` chỉ trả về offset của client, bị đảo dấu (UTC+7 → -420), không dùng được cho other users. Luôn dùng IANA timezone string với Intl API.

---

### ❌ Anti-Pattern 6: Using `Date` for "date-only" business logic

```typescript
// ❌ WRONG — birthday stored as Date gets timezone-shifted
const birthday = new Date("1990-03-25"); // parsed as UTC midnight
// In UTC-8 timezone: this displays as March 24! ⚠️

// Birthday comparison broken:
function isToday(birthday: Date): boolean {
  const today = new Date();
  return birthday.getDate() === today.getDate() && birthday.getMonth() === today.getMonth();
  // Buggy: birthday is UTC, today is local → different dates at midnight boundary ⚠️
}

// ✅ CORRECT — date-only values stay as strings
type DateString = `${number}-${number}-${number}`; // "1990-03-25"

function isBirthdayToday(birthday: DateString, timezone: string): boolean {
  const today = new Intl.DateTimeFormat("en-CA", {
    // en-CA gives YYYY-MM-DD format
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [todayY, todayM, todayD] = today.split("-");
  const [_, birthM, birthD] = birthday.split("-");
  return birthM === todayM && birthD === todayD;
}

// ✅ With Temporal (cleanest)
function isBirthdayToday_Temporal(birthday: string, timezone: string): boolean {
  const birthDate = Temporal.PlainDate.from(birthday);
  const todayLocal = Temporal.Now.plainDateISO(timezone);
  return birthDate.month === todayLocal.month && birthDate.day === todayLocal.day;
}
```

🇻🇳 **Tóm tắt**: "Date-only" values (birthday, holidays, deadlines không có giờ cụ thể) không nên dùng `Date` object — sẽ bị timezone-shift. Lưu dạng string "YYYY-MM-DD" và compare bằng Intl.DateTimeFormat hoặc Temporal.PlainDate.

---

## 🧠 Memory Hook / Gợi Nhớ

> **"Store UTC, Display Local, Think IANA"** — Lưu UTC, Hiển Thị Local, Nghĩ IANA.
>
> _Temporal = Types for Time. Plain = no TZ. Zoned = with TZ. Instant = UTC raw._
>
> _Intl is free. Moment is dead. date-fns tree-shakes. Luxon has Duration._

---

## Q&A Summary Table / Bảng Tóm Tắt

| #   | Difficulty | Topic                                  | Key Insight                                                                           |
| --- | ---------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| Q1  | 🟢 Junior  | `new Date('...')` vs `new Date(y,m,d)` | ISO date-only string → UTC; numeric args → local; Safari rejects `/` separator        |
| Q2  | 🟢 Junior  | `getTime()` vs `valueOf()` vs `+date`  | All same number; `Date.now()` fastest (no object); `performance.now()` for benchmarks |
| Q3  | 🟡 Mid     | Timezone pitfalls + DST                | Never hardcode offsets; IANA tz always; Brazil 2019 as case study; gap/fold in DST    |
| Q4  | 🟡 Mid     | `Intl.DateTimeFormat`                  | CLDR-based, calendar systems, numberingSystem, reuse instance for perf                |
| Q5  | 🟡 Mid     | Day.js vs date-fns vs Luxon            | Day.js TZ plugin = 32KB; date-fns best for tree-shake; Luxon has Duration/Interval    |
| Q6  | 🟡 Mid     | `Intl.RelativeTimeFormat`              | Zero-library "5 phút trước"; 30s interval; `<time>` element for a11y                  |
| Q7  | 🔴 Senior  | Temporal API                           | PlainDate/PlainDateTime/ZonedDateTime/Instant types; immutable; DST-aware; Stage 4    |
| Q8  | 🔴 Senior  | Storing timestamps globally            | UTC ISO Z in DB; user IANA tz in separate column; date-only as string; TIMESTAMPTZ    |
| Q9  | 🔴 Senior  | 10K rows + relative time perf          | Virtualization + singleton Intl + React.memo + one global interval                    |
| Q10 | 🔴 Senior  | Non-Gregorian calendars                | Buddhist/Japanese/Hijri via Intl `ca-*`; âm lịch VN needs `lunar-javascript`          |

---

## Cold Call / Hỏi Nhanh

**Prompt 1**: "What's wrong with `new Date('2024-01-15')` in a UTC-5 app?"

> **Model answer**: ISO date-only strings are parsed as UTC midnight. At UTC-5, UTC midnight = 7 PM the PREVIOUS day. So `toLocaleDateString()` shows January 14, not 15. Fix: use `new Date('2024-01-15T00:00:00')` (local midnight) or store full ISO UTC strings and display with `Intl.DateTimeFormat` and explicit timezone.

---

**Prompt 2**: "A customer in Brazil reports that all dates shifted by 1 hour after November 2019. What happened?"

> **Model answer**: Brazil canceled DST in 2019. Systems that hardcoded `UTC-3` offset for `America/Sao_Paulo` kept applying the wrong offset. IANA tz database updated `America/Sao_Paulo` rules, so systems using `Intl.DateTimeFormat` with that timezone identifier auto-corrected. Fix: replace hardcoded offsets with IANA timezone identifiers and let the OS/browser handle offset calculation.

---

**Prompt 3**: "How would you implement "3 phút trước" in Vietnamese without any library?"

> **Model answer**: Use `Intl.RelativeTimeFormat('vi', { numeric: 'auto' })`. Calculate the difference in seconds, walk through divisions (60s→minute, 60m→hour, 24h→day, etc.), call `rtf.format(value, unit)`. Wrap in a `useEffect` with a 30-second interval. Use `<time dateTime={isoString}>` for accessibility.

---

**Prompt 4**: "We're building a global ride-booking app. What timestamp fields do we store per booking?"

> **Model answer**: At minimum: `created_at` as UTC ISO string or TIMESTAMPTZ, `pickup_requested_at` UTC, `pickup_timezone` as IANA string (e.g. `"Asia/Ho_Chi_Minh"`). Never store local time strings without timezone. Never store UTC offset integers (Brazil 2019 lesson). For display: format `created_at` in `pickup_timezone` using `Intl.DateTimeFormat`.

---

**Prompt 5**: "A team wants to migrate from Moment.js. What do you recommend and why?"

> **Model answer**: Depends on use case. For simple formatting only → migrate to native `Intl.DateTimeFormat` (zero cost). For relative time → `Intl.RelativeTimeFormat`. For complex date math with TZ → `date-fns` + `date-fns-tz` (tree-shakeable, functional) or `Luxon` (full-featured OOP, has Duration/Interval). For future-proofing → start introducing `Temporal` with `@js-temporal/polyfill`. Moment.js was officially deprecated in 2020/announced retirement; don't add new dependencies on it. Day.js is a drop-in replacement but TZ plugin makes bundle comparable to Luxon.

---

## Self-Check / Tự Kiểm Tra

1. ✅/❌ Can you explain why `new Date('2024-01-15')` can display as January 14 in some timezones?
2. ✅/❌ Do you know the difference between `Date.now()` and `performance.now()` and when to use each?
3. ✅/❌ Can you explain what happened with Brazil DST in 2019 and which systems were affected?
4. ✅/❌ Can you write a `timeAgo()` function in Vietnamese using only built-in browser APIs (no library)?
5. ✅/❌ Do you know the four main Temporal types (PlainDate, PlainDateTime, ZonedDateTime, Instant) and when to use each?
6. ✅/❌ Can you explain why Vietnamese âm lịch is not fully handled by `Intl` and what library fills the gap?
7. ✅/❌ Can you describe 3 techniques for efficiently rendering 10,000 rows with relative timestamps?

---

## Part 4: Advanced Patterns / Các Pattern Nâng Cao

### Clock Skew — Client vs Server Time / Lệch Đồng Hồ

A common bug in countdown timers (Shopee flash sales, Tiki deals): the client clock is wrong. A user with a 5-minute-fast clock sees the flash sale start early; one with a slow clock misses it.

```typescript
// ❌ WRONG — trust client clock for countdown
const saleEndsAt = new Date("2024-01-15T12:00:00.000Z");
const remaining = saleEndsAt.getTime() - Date.now(); // Date.now() = client clock ⚠️

// ✅ CORRECT — compute server clock offset at load time
interface ServerTimeResponse {
  serverTime: string;
} // ISO UTC from server

async function calibrateClockOffset(): Promise<number> {
  const t0 = Date.now();
  const res = await fetch("/api/server-time");
  const t1 = Date.now();
  const { serverTime } = (await res.json()) as ServerTimeResponse;

  const serverMs = new Date(serverTime).getTime();
  const rtt = t1 - t0; // round-trip time
  const estimatedServerNow = serverMs + rtt / 2; // adjust for half RTT

  return estimatedServerNow - t1; // offset in ms (positive = client is behind)
}

let clockOffsetMs = 0;
clockOffsetMs = await calibrateClockOffset(); // call once at startup

function serverNow(): number {
  return Date.now() + clockOffsetMs; // corrected timestamp
}

// Countdown using server-corrected time
function getRemainingMs(saleEndsAtIso: string): number {
  return new Date(saleEndsAtIso).getTime() - serverNow();
}
```

🇻🇳 **Tóm tắt**: Client clock có thể lệch vài phút so với server — đặc biệt nguy hiểm cho countdown timers. Pattern: fetch server time một lần khi load, tính offset (server_time - client_time + RTT/2), dùng offset đó cho mọi timestamp computation.

---

### Recurring Events Across DST / Sự Kiện Lặp Lại Qua DST

Scheduling "every Monday at 9 AM" sounds simple — until you cross a DST boundary.

```typescript
// ❌ WRONG — adding 7 days in ms crosses DST incorrectly
function nextMonday_Wrong(from: Date): Date {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  return new Date(from.getTime() + ONE_WEEK_MS);
  // In spring-forward week: adds 7 × 24 = 168 hours
  // But real Monday 9 AM is 167 hours away (DST removed 1 hour)
  // Result: 10 AM instead of 9 AM! ⚠️
}

// ✅ CORRECT — use Temporal ZonedDateTime for calendar arithmetic
import { Temporal } from "@js-temporal/polyfill";

function nextMonday_Correct(from: Temporal.ZonedDateTime): Temporal.ZonedDateTime {
  // add({ weeks: 1 }) does CALENDAR arithmetic, not raw millisecond arithmetic
  // It figures out the correct UTC moment that corresponds to "next Monday same time"
  return from.add({ weeks: 1 });
}

const meetingVN = Temporal.ZonedDateTime.from({
  timeZone: "Asia/Ho_Chi_Minh",
  year: 2024,
  month: 3,
  day: 4,
  hour: 9,
  minute: 0,
});
const nextWeek = nextMonday_Correct(meetingVN);
console.log(nextWeek.toString()); // "2024-03-11T09:00:00+07:00[Asia/Ho_Chi_Minh]" ✅

// date-fns alternative (before Temporal is native)
import { addWeeks } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

function nextWeekSameLocalTime(utcDate: Date, tz: string): Date {
  const zonedDate = utcToZonedTime(utcDate, tz); // convert to local representation
  const nextZoned = addWeeks(zonedDate, 1); // add in local calendar
  return zonedTimeToUtc(nextZoned, tz); // convert back to UTC
}
```

🇻🇳 **Tóm tắt**: "Thêm 7 ngày" bằng ms không đúng khi qua DST boundary — thêm 7 × 24h = 168h, nhưng local time thay đổi. Temporal `add({ weeks: 1 })` tự động tính calendar arithmetic, kết quả đúng 9:00 AM local bất kể DST. Trong khi chờ Temporal native: dùng `date-fns-tz` pattern convert → add → convert back.

---

### ISO 8601 Duration Strings / Chuỗi Duration ISO

Useful for APIs, databases, and Temporal interop.

```typescript
// ISO 8601 Duration format: P[n]Y[n]M[n]DT[n]H[n]M[n]S
// P = Period prefix (mandatory)
// T = separator between date and time components

const examples = [
  "P1Y", // 1 year
  "P3M", // 3 months
  "P7D", // 7 days
  "PT2H30M", // 2 hours 30 minutes
  "P1Y2M3DT4H5M6S", // 1yr 2mo 3d 4h 5m 6s
];

// Temporal parses ISO duration strings natively
import { Temporal } from "@js-temporal/polyfill";

const duration = Temporal.Duration.from("P1Y2M");
console.log(duration.years); // 1
console.log(duration.months); // 2

const future = Temporal.Now.plainDateISO().add(duration);
console.log(future.toString()); // date 1 year and 2 months from now

// Serializing duration for API storage
const subscription = { duration: Temporal.Duration.from({ months: 12 }) };
const apiPayload = {
  subscriptionDuration: subscription.duration.toISO(), // "P12M"
};
```

---

### Date Formatting for SEO and Accessibility / Format Ngày Cho SEO và A11y

```typescript
// SEO: structured data (JSON-LD) requires ISO 8601
const article = {
  "@type": "Article",
  datePublished: new Date("2024-01-15").toISOString(), // "2024-01-15T00:00:00.000Z"
  dateModified: new Date().toISOString(),
};

// Accessibility: <time> element with machine-readable dateTime attr
function PublishDate({ date }: { date: Date }) {
  const isoString = date.toISOString(); // machine-readable
  const humanString = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "long",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date); // human-readable in Vietnamese

  return (
    // ✅ screen readers read dateTime attr, visual users see humanString
    <time dateTime={isoString} title={isoString}>
      {humanString}
    </time>
  );
  // Renders as: <time datetime="2024-01-15T00:00:00.000Z">15 tháng 1, 2024</time>
}

// Open Graph tags for social sharing
function generateMetaTags(publishedAt: Date) {
  return {
    "article:published_time": publishedAt.toISOString(), // OG standard
    "og:updated_time": new Date().toISOString(),
  };
}
```

🇻🇳 **Tóm tắt**: SEO structured data (JSON-LD) và Open Graph cần ISO 8601 format (`.toISOString()`). HTML `<time>` element: `dateTime` attr dùng ISO string (cho screen reader và search engine), nội dung hiển thị dùng `Intl.DateTimeFormat` locale-aware. Đây là pattern chuẩn cho blog, news, e-commerce product pages.

---

### Testing Date-Dependent Code / Test Code Phụ Thuộc Ngày Giờ

```typescript
// ❌ WRONG — test depends on real current time (flaky!)
function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

test("isWeekend returns true on Saturday", () => {
  // This only passes on actual weekends! ❌
  expect(isWeekend(new Date())).toBe(true);
});

// ✅ CORRECT — inject time as dependency (testable)
function isWeekend(date: Date = new Date()): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

test("isWeekend returns true for Saturday", () => {
  const saturday = new Date("2024-01-13T12:00:00Z"); // known Saturday in UTC
  expect(isWeekend(saturday)).toBe(true); // ✅ deterministic
});

test("isWeekend returns false for Monday", () => {
  const monday = new Date("2024-01-15T12:00:00Z");
  expect(isWeekend(monday)).toBe(false); // ✅
});

// ✅ Using vitest/jest fake timers for module-level Date.now()
import { vi } from "vitest";

test("flash sale countdown shows correct remaining time", () => {
  // Fix Date.now() to a known value
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-01-15T09:00:00.000Z"));

  const saleEnd = new Date("2024-01-15T12:00:00.000Z");
  const remaining = getRemainingMs(saleEnd.toISOString());
  expect(remaining).toBe(3 * 60 * 60 * 1000); // exactly 3 hours ✅

  vi.useRealTimers(); // always restore!
});

// ✅ For Temporal tests — Temporal.Now is mockable
const originalNow = Temporal.Now.instant;
Temporal.Now.instant = () => Temporal.Instant.from("2024-01-15T09:00:00Z");
// ... test ...
Temporal.Now.instant = originalNow; // restore
```

🇻🇳 **Tóm tắt**: Test date-dependent code bằng cách inject date làm parameter (default = `new Date()`). Dùng known timestamps (hard-code ngày cụ thể) để test deterministic. Với `Date.now()` trong module scope: dùng `vi.useFakeTimers()` / `vi.setSystemTime()` trong Vitest/Jest. Luôn `vi.useRealTimers()` trong cleanup để không leak vào test khác.

---

## Further Reading / Đọc Thêm

- [Temporal proposal documentation](https://tc39.es/proposal-temporal/docs/) — Official spec docs with cookbook
- [Moment.js Project Status](https://momentjs.com/docs/#/-project-status/) — Official deprecation notice
- [`@js-temporal/polyfill`](https://github.com/js-temporal/temporal-polyfill) — Production-ready Temporal polyfill
- [IANA Time Zone Database](https://www.iana.org/time-zones) — Source of truth for all timezone rules
- [MDN Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) — Full API reference
- [lunar-javascript](https://github.com/6tail/lunar-javascript) — Vietnamese/Chinese lunar calendar library
- [You Don't Need Moment.js](https://github.com/you-dont-need/You-Dont-Need-Momentjs) — Native Date & Intl alternatives

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../00-table-of-contents.md)
