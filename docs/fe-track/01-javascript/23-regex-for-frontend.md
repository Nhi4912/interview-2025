# Regex for Frontend Engineers / Regex cho Frontend Engineers

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) · [JavaScript README](./README.md) · [Modern JavaScript Features](./22-modern-javascript-features.md) · [Web Security](../07-web-security/)

---

## Real-World Scenario / Tình Huống Thực Tế

Live coding round. Interviewer asks: _"Write a regex to extract all URLs from a string of arbitrary text."_

Bạn gõ `/(https?:\/\/[^\s]+)/g` — câu trả lời nhìn có vẻ đúng. Nhưng interviewer hỏi tiếp: _"What if the URL has a trailing period from a sentence? What about parentheses from a Markdown link? And what happens if I pass user input directly into `new RegExp(userInput)`?"_

Và bạn bắt đầu hiểu tại sao regex là **sharp tool** — nó cắt rất nhanh, và nếu cầm sai hướng, nó cắt tay bạn.

Frontend engineers dùng regex hàng ngày: form validation (email, phone, URL), input sanitization, search highlighting, URL parameter parsing trong route matchers, log parsing trong DevTools, và cả template engines đơn giản. Nhưng hầu hết frontend regex là **overused và underspecified** — người ta dùng regex cho những thứ có giải pháp tốt hơn (như `URL` constructor, `<input type="email">`, DOMParser), và bỏ qua những thứ regex thực sự cần như escaping input và tránh catastrophic backtracking.

Tóm lại: **Regex là công cụ cuối cùng, không phải đầu tiên. Dùng khi phù hợp, escape input luôn luôn.**

> 🇻🇳 **Tóm tắt**: Regex là công cụ sắc bén — cần dùng đúng lúc, đúng cách. FE engineers thường với tay đến regex quá sớm, bỏ qua các giải pháp tốt hơn như `URL` constructor, `<input type="email">`, hay DOMParser. Phần này dạy bạn cả hai: khi nào KHÔNG dùng regex, và khi dùng thì dùng đúng cách.

---

## When NOT to Use Regex / Khi Nào Không Dùng Regex

Đây là phần quan trọng nhất trong toàn bộ file này. FE engineers thua điểm trong interview không phải vì viết regex sai — mà vì **chọn regex khi có giải pháp tốt hơn**.

### Email Validation

```typescript
// ❌ Anti-pattern: The "I found this on Stack Overflow" regex
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// ✅ Correct: use the browser for client-side validation
// HTML does RFC 5321 validation automatically
<input type="email" required />

// ✅ Correct: check if valid email with the HTML constraint validation API
function isValidEmail(email: string): boolean {
  const input = document.createElement("input");
  input.type = "email";
  input.value = email;
  return input.checkValidity();
}

// ✅ Correct: simple "good enough for UX" check + server validates anyway
const simpleEmailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Lý do**: RFC 5322 (email format spec) có ~250 dòng regex khi viết đầy đủ. Không ai cần implement lại điều đó. Browser đã làm rồi. Quan trọng hơn: **email validation phải diễn ra ở server** — client validation chỉ là UX feedback, không phải security gate.

### HTML Parsing

```typescript
// ❌ Famous Stack Overflow anti-pattern — never parse HTML with regex
const linkText = htmlString.match(/<a[^>]*>(.*?)<\/a>/gi);
// This WILL fail on nested tags, attributes with >, comments, CDATA, etc.

// ✅ Use the DOM parser
function extractLinksFromHTML(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return Array.from(doc.querySelectorAll("a")).map((a) => a.href);
}
```

Stack Overflow có một câu trả lời nổi tiếng nhất lịch sử về việc parse HTML bằng regex (by user bobince, 2009) — được upvote hơn 20,000 lần, miêu tả HTML như là "không thể parse bằng regex vì HTML không phải regular language." Context: HTML có thể chứa nested tags tùy ý, CDATA sections, comments, và character references — không có finite automaton nào describe được toàn bộ cấu trúc này.

### JSON Parsing

```typescript
// ❌ Never extract JSON values with regex
const name = jsonString.match(/"name"\s*:\s*"([^"]+)"/)?.[1];

// ✅ Use JSON.parse
const { name } = JSON.parse(jsonString);
```

### URL Parsing

```typescript
// ❌ Regex for URL components
const domainMatch = url.match(/^https?:\/\/([^/]+)/);
const domain = domainMatch?.[1];

// ✅ Use the URL constructor
const { hostname, pathname, searchParams } = new URL(url);
const domain = hostname;
const page = searchParams.get("page");
```

### Credit Card Validation (Luhn Algorithm)

```typescript
// ❌ Regex can only check format — not validity
const cardRegex = /^\d{16}$/;

// ✅ Luhn algorithm checks mathematical validity
function luhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "").split("").map(Number);
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}
```

> 🇻🇳 **Tóm tắt**: Quy tắc "khi nào KHÔNG dùng regex": Email → `<input type="email">` hoặc `input.checkValidity()`. HTML → `DOMParser`. JSON → `JSON.parse`. URL components → `new URL()`. Credit card validity → Luhn algorithm. Regex chỉ phù hợp khi bạn cần **text pattern matching** mà không có native API nào xử lý được.

---

## Concept Map / Bản Đồ Khái Niệm

```
DECISION TREE: "Should I use regex?"
│
├── Do I need to validate/parse a KNOWN format?
│   ├── Email          → <input type="email"> / checkValidity()
│   ├── URL            → new URL(str)
│   ├── URL params     → URLSearchParams
│   ├── HTML           → DOMParser / querySelector
│   ├── JSON           → JSON.parse
│   ├── Date           → new Date(str) / Temporal
│   └── Credit card    → Luhn algorithm
│
├── Do I need to split / search / replace a string?
│   ├── Fixed delimiter      → str.split(',')
│   ├── Starts/ends with     → str.startsWith() / str.endsWith()
│   ├── Contains substring   → str.includes()
│   ├── Find index           → str.indexOf()
│   └── Replace all (fixed)  → str.replaceAll()
│         ↓
│    ← If none of the above handle it →
│
└── THEN reach for regex
    ├── Simple pattern (no nesting) → /regex literal/flags
    ├── Dynamic pattern             → new RegExp(escaped, flags)
    ├── User input in pattern?      → ALWAYS escape via escapeRegExp()
    └── Nested quantifiers?         → ReDoS risk — redesign pattern
```

> 🇻🇳 **Tóm tắt**: Decision tree này là câu trả lời cho mọi câu hỏi về regex. Bắt đầu từ top — liệu có native API nào xử lý được không? Liệu native string methods (`includes`, `split`, `startsWith`) có đủ không? Chỉ khi tất cả đều không đủ thì mới dùng regex.

---

## Part 1: Regex Anatomy — JS Specific / Cấu Trúc Regex Trong JavaScript

### Literal vs `RegExp` Constructor

```typescript
// Literal — compiled once at parse time, ideal for static patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

// Constructor — evaluated at runtime, required for dynamic patterns
function buildSearchPattern(term: string, flags = "gi"): RegExp {
  // MUST escape user input before injecting into constructor
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, flags);
}

// When to use which:
// Literal:      static patterns known at write time, hot loops (pre-compiled)
// Constructor:  dynamic patterns (user search input, config-driven rules)
```

**The compilation difference**: Regex literals are compiled by V8 when the script is parsed — no runtime cost per call. `new RegExp(str)` compiles every time it is called unless you cache the result. In hot loops, this matters.

```typescript
// ❌ Compiles regex 10,000 times
function badLoop(items: string[]): string[] {
  return items.filter((item) => new RegExp("^foo").test(item));
}

// ✅ Compile once, reuse
const fooPattern = /^foo/;
function goodLoop(items: string[]): string[] {
  return items.filter((item) => fooPattern.test(item));
}
```

### Flags — Every Flag Explained

| Flag | Name        | Behavior                                                         | Common use                                |
| ---- | ----------- | ---------------------------------------------------------------- | ----------------------------------------- |
| `g`  | global      | Find all matches; makes `lastIndex` stateful                     | `matchAll`, `replace` all                 |
| `i`  | ignoreCase  | Case-insensitive matching                                        | User search input                         |
| `m`  | multiline   | `^`/`$` match start/end of **line** (not string)                 | Multi-line text processing                |
| `s`  | dotAll      | `.` matches `\n` (newline) too                                   | Matching across lines                     |
| `u`  | unicode     | Enable full Unicode code point matching + Unicode escapes        | Emoji, non-Latin text (required for `\p`) |
| `v`  | unicodeSets | Superset of `u`: set notation, string properties (ES2024)        | Advanced Unicode, intersection/diff       |
| `y`  | sticky      | Match only at `lastIndex` position (anchored)                    | Tokenizer / parser loops                  |
| `d`  | hasIndices  | Add `.indices` to match result with start/end positions (ES2022) | Code editors, diff tools                  |

> 🇻🇳 **Tóm tắt**: 8 flags. Quan trọng nhất cho FE: `g` (global — có stateful trap), `i` (case-insensitive), `u` (unicode — cần cho emoji/tiếng Việt), `v` (2024+ superset của `u`), `d` (hasIndices — cho text editors). `s` và `m` thường quên nhưng rất hữu ích.

### The `g` Flag Trap — Stateful `lastIndex`

Đây là **bug kinh điển nhất** với regex trong JavaScript. Phải hiểu.

```typescript
const re = /\d+/g; // global flag makes lastIndex stateful

// First call — works
console.log(re.test("abc 123")); // true — found "123", lastIndex = 7

// Second call — WRONG!
console.log(re.test("abc 123")); // false — lastIndex=7, search starts from end
console.log(re.lastIndex); // 0 — reset after failure

// Third call — works again (lastIndex was reset to 0)
console.log(re.test("abc 123")); // true

// The loop bug — this is the most common mistake
const pattern = /foo/g;
const tests = ["foo bar", "foo baz", "foo qux"];

// ❌ Broken — lastIndex persists across iterations
tests.forEach((str) => {
  console.log(pattern.test(str)); // true, false, true — alternating!
});

// ✅ Fix 1: Reset lastIndex each time
tests.forEach((str) => {
  pattern.lastIndex = 0;
  console.log(pattern.test(str));
});

// ✅ Fix 2: Don't use g flag for .test() — only use g for .matchAll() / .replace()
const patternNoG = /foo/;
tests.forEach((str) => {
  console.log(patternNoG.test(str)); // true, true, true — correct
});

// ✅ Fix 3: Inline regex literal — new regex object each time (no shared state)
tests.forEach((str) => {
  console.log(/foo/g.test(str)); // true, true, true (each call = new regex)
});
```

> 🇻🇳 **Tóm tắt**: `g` flag làm `lastIndex` là stateful. Mỗi lần `.test()` hoặc `.exec()` gọi, nó cập nhật `lastIndex`. Nếu dùng cùng một regex object với `g` flag trong loop, kết quả sẽ sai xen kẽ. Fix: không dùng `g` với `.test()`, hoặc reset `lastIndex = 0` trước mỗi lần gọi.

---

## Part 2: Common Patterns Library / Thư Viện Patterns Phổ Biến

Bảng dưới đây là **12 patterns FE engineers thực sự cần** trong công việc hàng ngày.

| Pattern              | Use case                                 | Regex                                                | Example                                                                            |
| -------------------- | ---------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------ |
| Trim whitespace      | Clean user input                         | `/^\s+\|\s+$/g`                                      | `" hello ".replace(/^\s+\|\s+$/g, "")` → `"hello"`                                 |
| Slugify              | URL-safe strings from titles             | `/[^a-z0-9]+/g`                                      | `"Hello World!".toLowerCase().replace(/[^a-z0-9]+/g, "-")` → `"hello-world"`       |
| Extract digits only  | Phone/ZIP cleanup                        | `/\D/g`                                              | `"(+84) 909-123-456".replace(/\D/g, "")` → `"84909123456"`                         |
| Mask phone           | Display masking                          | `/(\d{3})(\d{3})(\d{4})/`                            | `"5551234567".replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")` → `"(555) 123-4567"` |
| kebab-case           | CSS class generation                     | `/([a-z])([A-Z])/g`                                  | `"fooBar".replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()` → `"foo-bar"`         |
| Validate hex color   | CSS color input                          | `/^#([0-9a-f]{3}\|[0-9a-f]{6})$/i`                   | `/#([0-9a-f]{3}                                                                    | [0-9a-f]{6})$/i.test("#ff0")`→`true` |
| Validate semver      | Version string check                     | `/^\d+\.\d+\.\d+$/`                                  | `/^\d+\.\d+\.\d+$/.test("1.2.3")` → `true`                                         |
| Extract URLs         | Parse URLs from text                     | `/https?:\/\/[^\s<>"')\]]+/gi`                       | See full example below                                                             |
| Mask credit card     | Display 4 last digits only               | `/\d(?=\d{4})/g`                                     | `"4111111111111111".replace(/\d(?=\d{4})/g, "*")` → `"************1111"`           |
| Split on punctuation | Tokenize sentences                       | `/[.!?,;:\s]+/`                                      | `"hello, world! foo.".split(/[.!?,;:\s]+/)` → `["hello","world","foo",""]`         |
| Validate ISO date    | Date string input                        | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Tests `"2024-01-31"` → `true`, `"2024-13-01"` → `false`                            |
| Password strength    | Min 8 chars, 1 upper, 1 digit, 1 special | `/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/`       | Tests presence of required char classes                                            |

### Extract URLs — Full Example

```typescript
// Pattern explanation:
// https?://    — http or https
// [^\s<>"')\]] — any char that is NOT whitespace or common URL terminators
// +            — one or more

const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/gi;

function extractUrls(text: string): string[] {
  const matches = text.match(URL_PATTERN) ?? [];
  // Clean trailing punctuation that often appears in prose
  return matches.map((url) => url.replace(/[.,;!?]+$/, ""));
}

// Test
const text = `Check out https://example.com and https://foo.bar/path?q=1#hash.
Also visit (https://in-parens.com) or read https://example.org/article.`;

console.log(extractUrls(text));
// ["https://example.com", "https://foo.bar/path?q=1#hash",
//  "https://in-parens.com", "https://example.org/article"]
```

> 🇻🇳 **Tóm tắt**: 12 patterns này là những gì FE engineers thực sự viết trong production. Học bảng này. Đặc biệt: mask credit card dùng lookahead `(?=\d{4})`, slug dùng `[^a-z0-9]+`, và URL extraction cần clean trailing punctuation sau khi match.

---

## Part 3: Modern Regex Features (2022–2026) / Tính Năng Regex Hiện Đại

### Named Capture Groups — `(?<name>...)`

Available: Chrome 64+, Firefox 78+, Safari 11.1+. **Baseline: safe to use.**

```typescript
// Old style — positional groups (brittle, hard to read)
const dateOld = /(\d{4})-(\d{2})-(\d{2})/;
const m = "2024-03-15".match(dateOld);
const year = m?.[1]; // positional — breaks if regex changes

// Named groups — self-documenting, order-independent
const datePattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;

function parseISODate(str: string) {
  const match = str.match(datePattern);
  if (!match?.groups) return null;
  const { year, month, day } = match.groups;
  return { year: Number(year), month: Number(month), day: Number(day) };
}

console.log(parseISODate("2024-03-15"));
// { year: 2024, month: 3, day: 15 }

// Named backreferences — refer to group by name later in pattern
const duplicateWordPattern = /\b(?<word>\w+)\s+\k<word>\b/i;
console.log(duplicateWordPattern.test("the the")); // true — catches duplicate words
console.log(duplicateWordPattern.test("the cat")); // false

// Named groups in replace
const swapDate = "2024-03-15".replace(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
  "$<day>/$<month>/$<year>",
);
console.log(swapDate); // "15/03/2024"
```

### Lookbehind Assertions — `(?<=...)` and `(?<!...)`

Available: Chrome 62+, Firefox 78+, **Safari 16.4+** (2023). **Baseline: usable with Safari 16.4+ target.**

```typescript
// Positive lookbehind — match only if preceded by $
// "Match digits only if preceded by a dollar sign"
const pricePattern = /(?<=\$)\d+(\.\d{2})?/g;
const text = "Items: $29.99, $5, total: $34.99, code 1234";
console.log(text.match(pricePattern)); // ["29.99", "5", "34.99"] — not "1234"

// Negative lookbehind — match only if NOT preceded by something
// "Match 'foo' not preceded by 'no '"
const noFooPattern = /(?<!no )foo/gi;
console.log("I like foo but no foo here".match(noFooPattern)); // ["foo"]

// Real use case: extract version numbers after "v" prefix only
const versionPattern = /(?<=v)\d+\.\d+\.\d+/g;
const changelog = "Released v1.2.3, hotfix v1.2.4, internal build 1.2.5";
console.log(changelog.match(versionPattern)); // ["1.2.3", "1.2.4"] — not "1.2.5"

// Lookahead (available universally, for comparison)
const positiveLA = /\d+(?= dollars)/g; // digits followed by " dollars"
const negativeLA = /\d+(?! dollars)/g; // digits NOT followed by " dollars"
```

**Browser support note**: Lookbehind assertions were the last major regex feature to arrive in Safari. Safari 16.4 shipped March 2023 — effectively baseline by 2024. If supporting older Safari (iOS <16.4), polyfill or avoid.

### Unicode Property Escapes — `\p{...}` with `u` flag

Available: Chrome 64+, Firefox 78+, Safari 11.1+. **Requires `u` flag.**

```typescript
// Match any Unicode letter (includes Vietnamese, Chinese, Arabic, etc.)
const letterPattern = /^\p{Letter}+$/u;
console.log(letterPattern.test("Hello")); // true
console.log(letterPattern.test("Xin chào")); // true — Vietnamese
console.log(letterPattern.test("你好")); // true — Chinese
console.log(letterPattern.test("hello123")); // false — has digits

// Match emoji
const emojiPattern = /\p{Emoji}/u;
console.log(emojiPattern.test("Hello 👋")); // true
console.log(emojiPattern.test("Hello")); // false

// Match currency symbols
const currencyPattern = /\p{Currency_Symbol}/gu;
"Price: $50 or €45 or ¥6000".match(currencyPattern); // ["$", "€", "¥"]

// Practical: strip non-letter characters (language-safe)
function toSearchableSlug(input: string): string {
  // Remove anything that is not a letter or digit, Unicode-aware
  return input.toLowerCase().replace(/[^\p{Letter}\p{Decimal_Number}]+/gu, "-");
}

toSearchableSlug("Café au lait"); // "café-au-lait" — preserves accents
```

### The `v` Flag — Unicode Sets (ES2024)

Available: Chrome 112+ (April 2023), Safari 17+ (September 2023), Firefox 116+ (August 2023). **Near-baseline.**

The `v` flag is a strict superset of `u`. It enables **set notation** inside character classes.

```typescript
// Set difference: match letters but NOT ASCII letters (= non-Latin letters only)
const nonAsciiLetterPattern = /[\p{Letter}--[a-zA-Z]]/v;
console.log(nonAsciiLetterPattern.test("é")); // true — non-ASCII letter
console.log(nonAsciiLetterPattern.test("a")); // false — ASCII letter

// Set intersection: letters that ARE also Uppercase
const uppercaseLetterPattern = /[\p{Letter}&&\p{Uppercase_Letter}]/v;
console.log(uppercaseLetterPattern.test("A")); // true
console.log(uppercaseLetterPattern.test("a")); // false

// String properties (new in v flag)
const rdoQuotedPattern = /\p{RGI_Emoji}/v;

// v flag also enables nested character classes
const vowelOrDigit = /[[aeiou]|[0-9]]/v; // nested class syntax
```

**When to use `v` vs `u`**: Use `v` for new code when targeting Chrome 112+/Safari 17+/Firefox 116+. Use `u` for broader compatibility. They are **mutually exclusive** — cannot combine both flags.

### The `d` Flag — `hasIndices` (ES2022)

Available: Chrome 90+, Firefox 88+, Safari 15+. **Baseline: safe to use.**

```typescript
// Without d flag — only character values, no positions
const m1 = "2024-03-15".match(/(?<year>\d{4})/);
console.log(m1?.index); // 0 — match start position
// No end position, no per-group positions

// With d flag — adds .indices array
const m2 = "2024-03-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/d);

console.log(m2?.indices);
// [[0, 10], [0, 4], [5, 7], [8, 10]]
//  ^full    ^year   ^month  ^day    [start, end] pairs

console.log(m2?.indices?.groups);
// { year: [0, 4], month: [5, 7], day: [8, 10] }

// Real use case: syntax highlighter needs exact character positions
function highlightMatches(
  source: string,
  pattern: RegExp,
): Array<{ start: number; end: number; text: string }> {
  const withIndices = new RegExp(pattern.source, pattern.flags + "d");
  const results: Array<{ start: number; end: number; text: string }> = [];
  for (const match of source.matchAll(withIndices)) {
    if (match.indices) {
      const [start, end] = match.indices[0];
      results.push({ start, end, text: match[0] });
    }
  }
  return results;
}
```

> 🇻🇳 **Tóm tắt**: 4 modern regex features quan trọng nhất: (1) **Named groups** `(?<name>...)` — đã baseline, dùng ngay. (2) **Lookbehind** `(?<=...)` — baseline từ Safari 16.4+. (3) **Unicode escapes** `\p{Letter}` với `u` flag — cần khi xử lý text đa ngôn ngữ (tiếng Việt, Chinese, emoji). (4) **`v` flag** (2024) — set notation, intersection, difference — Chrome 112+/Safari 17+. (5) **`d` flag** hasIndices — cho editors cần vị trí chính xác.

---

## Part 4: The `g` Flag & Modern Iteration / Flag `g` và Iteration Hiện Đại

### `String.prototype.matchAll` — The Modern Answer

```typescript
// The problem with .match(g) — loses capture groups
const dates = "2024-01-15 and 2024-02-20";
const withG = dates.match(/(\d{4})-(\d{2})-(\d{2})/g);
console.log(withG); // ["2024-01-15", "2024-02-20"] — groups LOST

// exec() loop — old way, stateful, easy to make infinite loops
const pattern = /(\d{4})-(\d{2})-(\d{2})/g;
let match;
while ((match = pattern.exec(dates)) !== null) {
  console.log(match[1], match[2], match[3]); // works but verbose
}

// ✅ matchAll — returns iterator, preserves capture groups, stateless per call
const namedPattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g;
for (const match of dates.matchAll(namedPattern)) {
  const { year, month, day } = match.groups!;
  console.log(`Year: ${year}, Month: ${month}, Day: ${day}`);
}

// Convert to array
const allDates = [...dates.matchAll(namedPattern)].map((m) => m.groups!);
// [{ year: "2024", month: "01", day: "15" },
//  { year: "2024", month: "02", day: "20" }]
```

**`matchAll` requires `g` flag** — will throw `TypeError` if regex doesn't have `g`.

### When to Use Each API

| Method             | Returns             | Preserves groups? | Needs `g`?     | Use when                                  |
| ------------------ | ------------------- | ----------------- | -------------- | ----------------------------------------- |
| `str.match(re)`    | Array or null       | Only without `g`  | Optional       | Simple: "does this match?" or first match |
| `str.match(re/g)`  | Array of strings    | ❌ No             | Yes            | Just need all matched strings             |
| `str.matchAll(re)` | Iterator of matches | ✅ Yes            | Yes (required) | Multiple matches + capture groups         |
| `re.exec(str)`     | Match object        | ✅ Yes            | Optional       | Legacy, avoid in new code                 |
| `re.test(str)`     | boolean             | N/A               | Optional       | Boolean check only — don't use with `g`   |

> 🇻🇳 **Tóm tắt**: `matchAll` là câu trả lời hiện đại cho "tìm tất cả matches với capture groups". Không cần `.exec()` loop nữa. Nhớ: `matchAll` yêu cầu `g` flag. Không dùng `g` với `.test()` — stateful trap.

---

## Part 5: Replace with Function / Thay Thế Bằng Hàm

### `str.replace(regex, fn)` Pattern

```typescript
// Basic: replace with static string
"foo-bar-baz".replace(/-(\w)/g, (_, char) => char.toUpperCase());
// "fooBarBaz" — kebab-case to camelCase

// Full callback signature
// fn(match, ...captureGroups, offset, originalString, namedGroups?)
"2024-03-15".replace(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
  (match, year, month, day, offset, original, groups) => {
    return `${groups!.day}/${groups!.month}/${groups!.year}`;
  },
);
// "15/03/2024"

// Real use case: template engine
function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return String(data[key] ?? match); // keep placeholder if key missing
  });
}
interpolate("Hello {{name}}, you have {{count}} messages", {
  name: "Buu",
  count: 5,
});
// "Hello Buu, you have 5 messages"
```

### `replaceAll` (ES2021)

```typescript
// replaceAll with string — no regex needed
"foo.bar.baz".replaceAll(".", "-"); // "foo-bar-baz"

// replaceAll with regex — must have g flag (throws without it)
"hello WORLD".replaceAll(/[aeiou]/gi, "*"); // "h*ll* W*RLD"
```

### Highlight Search Terms Safely (Security-Critical)

This pattern comes up in live coding. **HTML injection is the trap.**

```typescript
// ❌ INSECURE — XSS if searchTerm contains HTML
function highlightUnsafe(text: string, searchTerm: string): string {
  return text.replace(
    new RegExp(searchTerm, "gi"),
    `<mark>${searchTerm}</mark>`, // searchTerm could be "<script>alert(1)</script>"
  );
}

// ✅ SECURE — escape both text content and search term
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeRegExp(str: string): string {
  // Escape all regex special characters to treat input as literal
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightSafe(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return escapeHtml(text);

  const escapedTerm = escapeRegExp(searchTerm);
  const pattern = new RegExp(`(${escapedTerm})`, "gi");

  return text
    .split(pattern)
    .map((part) => (pattern.test(part) ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
    .join("");
}

// Test
highlightSafe("Hello World", "world");
// "Hello <mark>World</mark>"

highlightSafe("Hello <script>", "<script>");
// "Hello &lt;script&gt;" — safe, not executed
```

> 🇻🇳 **Tóm tắt**: `str.replace(regex, fn)` là một trong những patterns mạnh nhất. Dùng cho: template engines, format transformations, text highlighting. Khi highlight search terms trong HTML: **phải escape cả regex input (`escapeRegExp`) lẫn HTML output (`escapeHtml`)**. Không escape = XSS vulnerability.

---

## Part 6: ReDoS — Regex Denial of Service / Regex Tấn Công DoS

Đây là phần **không thể bỏ qua** trong interview Senior.

### What Is ReDoS?

ReDoS (Regular Expression Denial of Service) xảy ra khi regex engine (thường là NFA-based, như V8) gặp pattern có **catastrophic backtracking** — số lần thử tăng theo cấp số nhân với length của input.

### The Classic Vulnerable Pattern

```typescript
// VULNERABLE: nested quantifiers without anchor
const vulnerablePattern = /(a+)+b/;

// With legitimate input:
vulnerablePattern.test("aaab"); // fast
vulnerablePattern.test("aaaaab"); // fast

// With malicious input (no 'b' at end):
// "aaaaaaaaaaaaaaa!" — 15 'a's followed by '!'
// Engine tries ALL possible ways to group the a's:
// (a)(a)(a)..., (aa)(a)..., (aaa)..., etc.
// 2^15 = 32,768 combinations for 15 chars
// 2^30 = 1,073,741,824 combinations for 30 chars — HANGS BROWSER

console.time("redos");
vulnerablePattern.test("aaaaaaaaaaaaaaa!"); // may hang or be very slow
console.timeEnd("redos");
```

**Why it happens**: The regex engine tries every possible way to partition the `a` characters across the inner group `(a+)` and the outer group `+`. For N characters, there are 2^(N-1) possible partitions — exponential.

### Real CVEs Involving ReDoS

| Package      | CVE              | Year | Vulnerable Pattern                          | Impact                    |
| ------------ | ---------------- | ---- | ------------------------------------------- | ------------------------- |
| express      | CVE-2014-6393    | 2014 | `path-to-regexp` route parsing              | HTTP routing DoS          |
| marked       | CVE-2017-1000427 | 2017 | Table/heading regex                         | Markdown parser DoS       |
| validator.js | CVE-2021-3765    | 2021 | URL validation regex                        | Validation library DoS    |
| ua-parser-js | CVE-2022-25927   | 2022 | User-agent string parsing                   | Analytics lib DoS         |
| semver       | CVE-2022-25883   | 2023 | Version range parsing `(<= 7.5.1)` affected | npm ecosystem wide impact |

The semver CVE is notable because `semver` is one of the most downloaded npm packages — it affected virtually every Node.js project using version range parsing.

### Identifying Vulnerable Patterns

```typescript
// VULNERABLE patterns — watch for these structures:
/(a+)+/       // nested quantifier — exponential
/([a-z]+)*/   // optional group with quantified char class — exponential
/(a|a)*/      // alternation with overlap — exponential
/(\w|\d)+/    // alternation where classes overlap (\d is subset of \w)

// Why (\w|\d)+ is vulnerable:
// \w matches [a-zA-Z0-9_], \d matches [0-9]
// For each digit, engine tries both \w branch AND \d branch
// n digits = 2^n paths

// SAFE equivalents:
/a+/          // no nesting
/[a-z]*/      // character class, no group nesting
/\w+/         // single pattern, no alternation overlap
```

### Mitigation Strategies

```typescript
// 1. Add anchors to bound the search space
const safe1 = /^(a+)+b$/; // anchored — can fail-fast at string end

// 2. Eliminate ambiguity — use possessive quantifiers (not in JS, but principle)
// In JS, use atomic groups workaround via lookahead trick:
// /(?>a+)/ not valid in JS — but /(?=(a+))\1/ simulates atomic group

// 3. Use linear-time regex with no backtracking (RE2 engine)
// Option: re2 npm package (uses Google's RE2, no backtracking)
import RE2 from "re2"; // npm install re2 (C++ binding)
const safeEngine = new RE2("(a+)+b");
safeEngine.test("aaaaaaaaaaaaaaa!"); // completes in linear time

// 4. Run user-provided regex in a Web Worker with timeout
async function safeRegexTest(pattern: string, input: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Regex timeout — possible ReDoS"));
    }, 100); // 100ms limit

    try {
      const re = new RegExp(pattern);
      const result = re.test(input);
      clearTimeout(timeout);
      resolve(result);
    } catch {
      clearTimeout(timeout);
      reject(new Error("Invalid regex"));
    }
  });
}

// 5. Validate patterns with safe-regex linter (ESLint plugin or CLI)
// npm install -D eslint-plugin-regexp
// Rule: "regexp/no-super-linear-backtracking"

// 6. Length-bound your inputs before applying regex
function safeMatch(input: string, pattern: RegExp, maxLength = 1000): RegExpMatchArray | null {
  if (input.length > maxLength) {
    throw new Error(`Input too long for regex: ${input.length} > ${maxLength}`);
  }
  return input.match(pattern);
}
```

> 🇻🇳 **Tóm tắt**: ReDoS xảy ra khi regex engine backtrack theo cấp số nhân trên input "độc hại". Pattern nguy hiểm nhất: `(a+)+`, `([a-z]+)*`, alternation overlap như `(\w|\d)+`. Có CVE thật trong express, marked, semver. Mitigation: tránh nested quantifiers, dùng anchors, dùng RE2 engine cho user-input patterns, timeout với Web Worker, ESLint plugin `regexp/no-super-linear-backtracking`.

---

## Part 7: Validation Patterns FE Engineers Should Know / Patterns Validation Cần Biết

### Email — The Practical vs The RFC Reality

```typescript
// The practical "good enough" pattern (FE validation only — server re-validates)
// Covers 99%+ of real email addresses
const EMAIL_PRACTICAL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// More strict but still reasonable — RFC 5321 simplified
const EMAIL_STRICT =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

// The RFC 5322 full compliance regex — 6KB+ of regex, never use this in JS
// (It exists as a reference that shows why "use the browser" is correct)

// Best practice in production:
function validateEmail(email: string): boolean {
  // 1. Browser validation (catches format errors)
  const input = document.createElement("input");
  input.type = "email";
  input.value = email;
  if (!input.checkValidity()) return false;

  // 2. Simple additional check for TLD length
  return /\.[a-zA-Z]{2,}$/.test(email);

  // 3. Ultimate validation: send confirmation email (only this proves it exists)
}
```

### Phone — E.164 and Locale Patterns

```typescript
// E.164 international format: +[country code][number], max 15 digits
const E164 = /^\+[1-9]\d{1,14}$/;

// Vietnamese phone (Viettel, Mobifone, Vinaphone format)
const VN_PHONE = /^(0|\+84)(3[2-9]|5[6-9]|7[06-9]|8[0-9]|9[0-9])\d{7}$/;

// US format (flexible — various input styles)
const US_PHONE = /^(\+1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})$/;

// Universal: strip formatting, validate digit count
function validatePhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
```

### URL — Constructor First

```typescript
// ✅ Use URL constructor — handles all edge cases
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Only use regex if you need URL extraction from text (not validation)
const URL_FROM_TEXT = /https?:\/\/[^\s<>"')\]]+/gi;
```

### Credit Card Display Masking

```typescript
// Display masking — show only last 4 digits
function maskCardDisplay(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.replace(/\d(?=\d{4})/g, "*");
  // "4111111111111111" → "************1111"
}

// Format for display with spaces (1234 5678 9012 3456)
function formatCardDisplay(cardNumber: string): string {
  return cardNumber.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
}
```

### Password Strength Rules

```typescript
interface PasswordStrength {
  isValid: boolean;
  errors: string[];
}

function checkPasswordStrength(password: string): PasswordStrength {
  const errors: string[] = [];

  if (password.length < 8) errors.push("Minimum 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  if (!/\d/.test(password)) errors.push("At least one digit");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    errors.push("At least one special character");

  // Use separate test() calls — NOT a single mega-regex
  // Lookahead version: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#]).{8,}$/
  // The separate calls version gives better error messages

  return { isValid: errors.length === 0, errors };
}
```

> 🇻🇳 **Tóm tắt**: Validation patterns thực tế: Email → browser `checkValidity()` + simple TLD check, KHÔNG phải RFC 5322 regex. Phone → E.164 hoặc locale-specific + digit count check. URL → `new URL()` constructor. Credit card masking → lookahead `\d(?=\d{4})`. Password → nhiều test() riêng biệt thay vì một mega lookahead regex — tốt hơn cho error messages.

---

## Part 8: Performance / Hiệu Năng

### V8 Regex Engine

V8 uses a **Backtracking NFA (Non-deterministic Finite Automaton)** engine, which:

- Supports all PCRE-style features (lookahead, lookbehind, backreferences)
- Can backtrack exponentially on pathological patterns (hence ReDoS)
- Compiles regex literals at parse time (optimization opportunity)
- Has Irregexp (V8's custom engine) which tries to optimize patterns to DFA where possible

### Pre-compilation vs `new RegExp` in Hot Loops

```typescript
// Performance comparison — simplified benchmark illustration

// ❌ Creates new RegExp object on every invocation — 100K iterations
function slowFilter(items: string[]): string[] {
  return items.filter((item) => new RegExp("^prefix_\\w+$").test(item));
}

// ✅ Compiled once at module load — 100K iterations
const PREFIX_PATTERN = /^prefix_\w+$/;
function fastFilter(items: string[]): string[] {
  return items.filter((item) => PREFIX_PATTERN.test(item));
}

// V8 insight: regex literals are compiled when the function is JIT-compiled.
// new RegExp() is compiled on each call unless you cache the result.
// For 100K items: literal is ~20x faster in microbenchmarks.

// ✅ Dynamic pattern — cache the compiled result
function buildFilter(prefix: string): (s: string) => boolean {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escaped}_\\w+$`); // compiled once
  return (s) => pattern.test(s);
}
const filterFoo = buildFilter("foo"); // pattern compiled here
items.filter(filterFoo); // pattern reused across all items
```

### The `escapeRegExp` Helper — Always Have It

```typescript
/**
 * Escapes all regex special characters in a string so it can be used
 * as a literal pattern in new RegExp(). MDN recommends this exact pattern.
 *
 * Special chars escaped: . * + ? ^ $ { } ( ) | [ ] \
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // $& = the matched character itself
}

// Usage
const userInput = "file.txt"; // "." is special in regex
const pattern = new RegExp(escapeRegExp(userInput), "i");
pattern.test("FILE.TXT"); // true — correctly treats "." as literal dot
pattern.test("filetxt"); // false — not matching without literal dot
```

### Length Bounding for Safety

```typescript
// Always bound input length before applying regex to user-provided content
const MAX_INPUT_LENGTH = 500;

function safeSearch(haystack: string, needle: string): boolean {
  if (needle.length > MAX_INPUT_LENGTH) {
    throw new Error("Search pattern too long");
  }
  const pattern = new RegExp(escapeRegExp(needle), "i");
  return pattern.test(haystack.slice(0, 10_000)); // bound haystack too
}
```

> 🇻🇳 **Tóm tắt**: V8 dùng Backtracking NFA — mạnh nhưng có thể chậm với bad patterns. Performance tips: pre-compile regex literals (không dùng `new RegExp` trong hot loops trừ khi cached), luôn có `escapeRegExp` helper khi nhận user input, bound input length trước khi apply regex.

---

## Part 9: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: What is the difference between `match`, `matchAll`, `exec`, and `test`?

**A:**

Four different entry points into regex matching, each with distinct return values and use cases:

| Method             | On     | Returns                   | Preserves capture groups? | `g` behavior                                 |
| ------------------ | ------ | ------------------------- | ------------------------- | -------------------------------------------- |
| `str.match(re)`    | String | Match array or `null`     | Yes (without `g`)         | Returns all matches as strings (groups lost) |
| `str.matchAll(re)` | String | Iterator of match objects | Yes always                | Requires `g` (throws without)                |
| `re.exec(str)`     | RegExp | Match object or `null`    | Yes                       | Advances `lastIndex` each call               |
| `re.test(str)`     | RegExp | `boolean`                 | N/A                       | Advances `lastIndex` (g trap!)               |

```typescript
const str = "cat bat sat";
const re = /([a-z])at/g;

// match with g — strings only, no groups
str.match(re); // ["cat", "bat", "sat"]

// matchAll — full match objects with groups
[...str.matchAll(re)].map((m) => m[1]); // ["c", "b", "s"] — group 1

// test — boolean only, no match data
/cat/.test(str); // true

// exec — one match at a time, needs loop for all
let m;
const re2 = /([a-z])at/g;
while ((m = re2.exec(str)) !== null) {
  console.log(m[1]); // "c", "b", "s"
}
```

Vietnamese: `match` (không `g`) trả về match object đầu tiên với groups. `match` (với `g`) trả về mảng strings, mất groups. `matchAll` (cần `g`) trả về iterator của tất cả match objects, giữ groups. `exec` giống `matchAll` nhưng gọi từng lần, dùng loop. `test` chỉ trả về boolean.

**💡 Interview Signal:**

- ✅ Strong: Explains the `match(g)` trap (groups lost), recommends `matchAll` for modern code, knows `test` with `g` has stateful `lastIndex`
- ❌ Weak: "match finds a match, test returns true/false" — too shallow, misses the group preservation difference

---

### 🟢 Q2: What is the difference between a regex literal and `new RegExp`? When do you use each?

**A:**

**Regex literal** (`/pattern/flags`) is compiled by the JavaScript parser when the script is parsed. It is a compile-time construct.

**`new RegExp(pattern, flags)`** is compiled at runtime when the constructor is called.

```typescript
// Literal — compile time, static, good for hot code paths
const isHex = /^#[0-9a-f]{3,6}$/i;

// Constructor — runtime, required for dynamic patterns
function buildMatcher(keyword: string): RegExp {
  return new RegExp(escapeRegExp(keyword), "gi");
}
```

**Use literal when**: The pattern is known at write time. In hot loops (avoids re-compilation overhead).

**Use constructor when**: The pattern depends on runtime values (user search input, config-driven patterns, i18n keyword matching).

**The escape trap**: `new RegExp("\\d+")` — backslashes need to be doubled because the string is processed first. Literal `/\d+/` — no doubling needed.

```typescript
new RegExp("\\d+")  // correct — "\\d" in string = "\d" in regex
new RegExp("\d+")   // wrong — "\d" in JS string is just "d"
/\d+/               // correct — no string escaping needed
```

Vietnamese: Literal compile ở parse time — tốt cho performance, dùng khi pattern là static. Constructor compile ở runtime — dùng khi pattern đến từ user input hoặc runtime value. Trap: backslash phải doubled trong string (`"\\d"` = `\d` trong regex).

**💡 Interview Signal:**

- ✅ Strong: Mentions compilation timing, the backslash escaping difference, and `escapeRegExp` for user input in constructor
- ❌ Weak: "They're the same, just different syntax" — misses compilation timing and the security implication

---

### 🟢 Q3: Should you validate email with regex? What's the right approach?

**A:**

**Short answer**: No, not as the primary mechanism. Use the browser's built-in validation.

**The right approach**:

```typescript
// 1. HTML5 type="email" — browser implements RFC 5321 subset
<input type="email" />

// 2. checkValidity() API — same validation, usable in JS
function isValidEmailFormat(email: string): boolean {
  const input = document.createElement("input");
  input.type = "email";
  input.value = email;
  return input.checkValidity();
}

// 3. Regex only for simple feedback (not correctness)
// "Does this look like an email?" — good enough for live validation UX
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 4. Server MUST validate — DNS lookup, MX record, bounce handling
// Only a confirmation email proves deliverability
```

**Why regex fails for email**: RFC 5322 defines email addresses with recursive rules (comments, quoted strings, internationalized addresses). A fully compliant regex is ~6KB and impossible to maintain. Even then, it can't verify the email address exists or is deliverable.

Vietnamese: Không dùng regex làm primary email validation. Dùng `<input type="email">` hoặc `input.checkValidity()` — browser đã implement RFC 5321. Regex chỉ cho UX feedback nhanh. Server phải validate lại. Chỉ confirmation email mới prove deliverability.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes format validation (browser) from deliverability (confirmation email), knows `checkValidity()`, explains why RFC 5322 is too complex for regex
- ❌ Weak: Pastes a Stack Overflow email regex without questioning it

---

### 🟡 Q4: What does the `g` flag do, and what's the trap?

**A:**

The `g` (global) flag tells the regex engine to find **all matches** in the string rather than stopping at the first match. When used with `.exec()` or `.test()` on a **regex object stored in a variable**, it makes `lastIndex` stateful — each call updates `lastIndex` to the position after the last match.

**The trap**: When the same regex object with `g` is reused across calls or in a loop, `lastIndex` persists between calls.

```typescript
const re = /\d+/g;

// Call 1: starts at 0, finds "123", lastIndex → 3
console.log(re.test("abc 123 def")); // true

// Call 2: starts at 3 (not 0!), finds nothing, lastIndex → 0 (reset on fail)
console.log(re.test("abc 123 def")); // false — BUG

// Loop trap — alternates true/false
const pattern = /foo/g;
["foo", "foo", "foo"].forEach((str) => {
  console.log(pattern.test(str)); // true, false, true — WRONG
});

// Fix 1: don't use g with .test()
const noG = /foo/;
["foo", "foo"].forEach((str) => console.log(noG.test(str))); // true, true

// Fix 2: reset lastIndex
["foo", "foo"].forEach((str) => {
  pattern.lastIndex = 0;
  console.log(pattern.test(str)); // true, true
});

// Fix 3: use matchAll for iteration (correct by design)
for (const match of "abc 123 def 456".matchAll(/\d+/g)) {
  console.log(match[0]); // "123", "456"
}
```

Vietnamese: `g` flag làm regex tìm tất cả matches thay vì dừng ở match đầu tiên. Trap: khi dùng với `.test()` hoặc `.exec()` trên regex object, `lastIndex` là stateful và persist giữa các lần gọi. Fix: không dùng `g` với `.test()`, hoặc dùng `matchAll` cho iteration.

**💡 Interview Signal:**

- ✅ Strong: Explains `lastIndex` persistence, demonstrates the loop bug, offers `matchAll` as modern fix, mentions the `lastIndex = 0` manual reset
- ❌ Weak: "g flag means global" — correct but misses the stateful lastIndex trap

---

### 🟡 Q5: Write a regex to extract all URLs from text.

**A:**

```typescript
// Pattern breakdown:
// https?:\/\/  — protocol (http or https)
// [^\s<>"')\]] — any char except whitespace and URL terminators
//               < > " ' ) ] — common characters that follow URLs in HTML/Markdown
// +            — one or more (greedy but limited by exclusion set)
// The trailing punctuation cleanup handles URLs ending with . , ; etc.

const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/gi;

function extractUrls(text: string): string[] {
  const raw = text.match(URL_PATTERN) ?? [];
  // Remove trailing punctuation that often ends a sentence containing a URL
  return raw.map((url) => url.replace(/[.,;!?:'")\]]+$/, ""));
}

// Test cases
const text = `
  Visit https://example.com for info.
  Also check https://foo.bar/path?q=hello&page=2#section
  Markdown: [link](https://link-in-parens.com/path)
  Sentence ending with URL: see https://end-url.com.
`;

console.log(extractUrls(text));
// [
//   "https://example.com",
//   "https://foo.bar/path?q=hello&page=2#section",
//   "https://link-in-parens.com/path",
//   "https://end-url.com"
// ]

// Edge cases to mention in interview:
// - No support for "bare" URLs without scheme (www.example.com) — intentional
// - FTP, mailto not included — intentional unless specified
// - Maximum safety: use URL constructor to validate extracted strings
function extractValidUrls(text: string): URL[] {
  return extractUrls(text).flatMap((url) => {
    try {
      return [new URL(url)];
    } catch {
      return [];
    }
  });
}
```

Vietnamese: Pattern `https?:\/\/[^\s<>"')\]]+` match protocol + "bất kỳ ký tự nào không phải whitespace hoặc URL terminators". Sau đó clean trailing punctuation. Wrap bằng `new URL()` validation để filter false positives.

**💡 Interview Signal:**

- ✅ Strong: Explains why the exclusion set `[^\s<>"')\]]` is chosen, handles trailing punctuation, mentions URL constructor for validation, acknowledges limitations (bare URLs, other protocols)
- ❌ Weak: Writes `https?://\S+` without considering that `\S` matches `>` and `"` which terminates URLs in HTML

---

### 🟡 Q6: What is a lookbehind assertion and when do you need it?

**A:**

A **lookbehind assertion** matches a position in the string only if the text **preceding** that position matches (or doesn't match) a pattern — without consuming the preceding characters.

```typescript
// Positive lookbehind (?<=...)  — match if preceded by
// "Match a number only if preceded by $"
const pricePattern = /(?<=\$)\d+(?:\.\d{2})?/g;

"Items: $29.99, code 4567".match(pricePattern);
// ["29.99"] — NOT "4567" (not preceded by $)

// Negative lookbehind (?<!...) — match if NOT preceded by
// "Match 'import' not preceded by '//'"
const importPattern = /(?<!\/\/ *)import\s+/gm;

// Real use case: extract CSS custom property values
const cssText = "--primary-color: #ff0000; --secondary: blue;";
const varPattern = /(?<=--[\w-]+:\s*)[^;]+/g;
cssText.match(varPattern); // ["#ff0000", "blue"]

// Lookahead (for comparison — available universally)
const lookAhead = /\d+(?= dollars)/g; // digits followed by " dollars"
const negLookAhead = /\d+(?! dollars)/g; // digits NOT followed by " dollars"
```

**When you NEED lookbehind**: When context before the match determines whether it's valid, but you don't want to include that context in your captured text. Without lookbehind, you'd have to use a capture group and discard the first group.

**Browser support**: Safari 16.4+ (March 2023). Safe as 2024+ baseline. Check caniuse if supporting iOS <16.4.

Vietnamese: Lookbehind assertion `(?<=...)` match position trong string CHỈ KHI text TRƯỚC đó match pattern — nhưng không consume text đó. Dùng khi context trước match quyết định tính hợp lệ nhưng bạn không muốn include nó trong captured text. Safari support từ 16.4 (2023) — baseline cho projects 2024+.

**💡 Interview Signal:**

- ✅ Strong: Correctly distinguishes lookbehind (precedes, not consumed) vs match capture, mentions Safari 16.4 baseline, provides real use case with CSS parsing
- ❌ Weak: Confuses lookbehind with negative lookahead, or says "lookbehind doesn't work in Safari" without specifying version

---

### 🔴 Q7: What is ReDoS? Write a vulnerable regex and its fix.

**A:**

**ReDoS** (Regular Expression Denial of Service) is a vulnerability where a specially crafted input causes a regex to take exponential time — potentially hanging the event loop (Node.js) or blocking the main thread (browser).

**Root cause**: NFA-based regex engines (like V8's Irregexp) use backtracking. Certain patterns have **catastrophic backtracking** — the number of possible paths through the NFA grows exponentially with input length.

```typescript
// VULNERABLE: nested quantifier — exponential time
const vulnerable = /(a+)+b/;

// Attack input: N 'a' characters followed by a non-matching char
const attack = "a".repeat(30) + "!";

console.time("vulnerable");
vulnerable.test(attack); // Takes SECONDS — exponential 2^30 paths
console.timeEnd("vulnerable");

// Why: engine tries to partition 30 a's into inner (a+) groups:
// (a)(a)(a)... | (aa)(a)... | (aaa)... | (a)(aa)... etc.
// 2^29 ≈ 500 million combinations

// FIX 1: Eliminate nested quantifiers
const fixed = /a+b/; // linear — no nesting

// FIX 2: Add anchors to bound the search space
const anchored = /^(a+)+b$/; // anchors allow early fail-fast

// FIX 3: Use RE2 engine (no backtracking — linear time guaranteed)
import RE2 from "re2"; // npm install re2
const safeRe = new RE2("(a+)+b");
safeRe.test(attack); // completes immediately

// FIX 4: Length check + timeout (defense in depth)
function safeTest(pattern: RegExp, input: string, maxLen = 1000): boolean {
  if (input.length > maxLen) throw new Error("Input too long");
  return pattern.test(input);
}

// REAL CVEs:
// semver < 7.5.2 — CVE-2022-25883 — version range parsing
// ua-parser-js < 0.7.33 — CVE-2022-25927 — user agent string parsing
// marked < 4.0.10 — CVE-2017-1000427 — Markdown table parsing
```

Vietnamese: ReDoS = regex với catastrophic backtracking làm engine thử số lượng paths tăng theo hàm mũ. Pattern nguy hiểm nhất: `(a+)+`, `([a-z]+)*`, alternation overlap. Fix: bỏ nested quantifiers, dùng anchors, dùng RE2 engine, limit input length. Có CVE thật trong semver (npm), ua-parser-js, marked — đây không phải lý thuyết.

**💡 Interview Signal:**

- ✅ Strong: Explains NFA backtracking mechanism (not just "slow"), writes concrete vulnerable + fixed example, names real CVEs, mentions RE2 as linear-time alternative
- ❌ Weak: "ReDoS is when regex is slow" — correct but needs mechanism (NFA paths, exponential growth)

---

### 🔴 Q8: You need to highlight matched search terms in HTML safely. How?

**A:**

Two separate concerns: **regex injection** (the search term is user input → must escape) and **XSS** (output goes into HTML → must HTML-escape content).

```typescript
// STEP 1: escapeRegExp — makes user input safe for new RegExp()
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// STEP 2: escapeHtml — makes content safe for innerHTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;") // MUST be first
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// STEP 3: highlight — split on pattern (preserves matched text), escape each part
function highlightSearch(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return escapeHtml(text);

  const escapedTerm = escapeRegExp(searchTerm);
  const pattern = new RegExp(`(${escapedTerm})`, "gi");

  // split preserves the matched parts (because of capture group)
  return text
    .split(pattern)
    .map((part) => (pattern.test(part) ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
    .join("");
  // Reset lastIndex after test() with g flag
}

// Alternatively, use replace with callback:
function highlightSearchAlt(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return escapeHtml(text);
  const escaped = escapeRegExp(searchTerm);
  const pattern = new RegExp(`(${escaped})`, "gi");

  // Replace each match with highlighted version in escaped text
  return escapeHtml(text).replace(
    // Re-escape the pattern for use in escaped text context
    new RegExp(escapeRegExp(escapeHtml(searchTerm)), "gi"),
    (match) => `<mark>${match}</mark>`,
  );
  // Note: this approach is simpler but breaks with HTML entities in match
}

// Safest: use split approach (first function) for clarity

// Usage:
highlightSearch("Hello World", "world");
// "Hello <mark>World</mark>"

highlightSearch("Hello <script>alert(1)</script>", "<script>");
// "Hello &lt;script&gt;alert(1)&lt;/script&gt;" — XSS neutralized

highlightSearch("Price: $29.99", "$29");
// "Price: <mark>$29</mark>.99" — special char handled by escapeRegExp
```

Vietnamese: Hai bước bảo mật: (1) `escapeRegExp` — escape ký tự đặc biệt của user input trước khi dùng trong `new RegExp()`. (2) `escapeHtml` — escape HTML trước khi inject vào DOM. Thiếu bước nào cũng tạo vulnerability — thiếu (1) là ReDoS/RegExp injection, thiếu (2) là XSS.

**💡 Interview Signal:**

- ✅ Strong: Identifies BOTH escape needs (regex injection AND HTML injection), implements both helpers, demonstrates that `&` must be escaped first in `escapeHtml`, uses split+capture-group approach correctly
- ❌ Weak: Only does one of the two escaping steps, or uses `innerHTML` without HTML escaping

---

### 🔴 Q9: Performance — regex literal vs `new RegExp` in a hot loop. What's the difference?

**A:**

**Regex literals** are compiled by V8's parser when the JavaScript file is parsed (or when the function containing them is JIT-compiled). The compiled regex automaton is cached — calling the literal repeatedly reuses the same compiled object.

**`new RegExp()`** is compiled at runtime every time the constructor is called, unless you manually cache the result.

```typescript
// Benchmark illustration — 1,000,000 iterations
const items = Array.from({ length: 1_000_000 }, (_, i) => `item_${i}`);

// Approach 1: new RegExp inside loop — recompiles 1M times
console.time("literal in loop");
items.filter((item) => /^item_\d+$/.test(item));
console.timeEnd("literal in loop"); // ~150ms

// Approach 2: new RegExp inside loop — explicit recreation
console.time("new RegExp in loop");
items.filter((item) => new RegExp("^item_\\d+$").test(item));
console.timeEnd("new RegExp in loop"); // ~2500ms — ~16x slower

// Approach 3: cached constructor result
const pattern = new RegExp("^item_\\d+$");
console.time("cached RegExp");
items.filter((item) => pattern.test(item));
console.timeEnd("cached RegExp"); // ~155ms — same as literal

// Conclusion:
// literal ≈ cached new RegExp >> uncached new RegExp
// For hot loops: always pre-compile (either literal or cached constructor)
// Only use new RegExp in loop if pattern MUST be dynamic (and cache it anyway)

// The correct dynamic pattern cache pattern:
const regexCache = new Map<string, RegExp>();

function getCachedRegex(pattern: string, flags = ""): RegExp {
  const key = `${flags}:${pattern}`;
  if (!regexCache.has(key)) {
    regexCache.set(key, new RegExp(pattern, flags));
  }
  return regexCache.get(key)!;
}
```

Vietnamese: Regex literal được compile ở parse time — reuse compiled object. `new RegExp()` compile ở runtime mỗi lần gọi nếu không cache. Trong hot loop với 1M items: uncached `new RegExp` chậm hơn ~16x so với literal. Fix: pre-compile (literal hoặc cached constructor). Nếu cần dynamic pattern, cache bằng Map với pattern string là key.

**💡 Interview Signal:**

- ✅ Strong: Explains V8 compilation timing, knows literal ≈ cached constructor, provides cache pattern with Map, gives rough order-of-magnitude difference
- ❌ Weak: "Literals are always faster" — misleading (cached constructor is same), or has no idea about compilation difference

---

### 🔴 Q10: Browser support strategy for the `v` flag — can you ship it today?

**A:**

**`v` flag baseline support (as of 2026)**:

| Browser     | `v` flag support | Version | Release date   |
| ----------- | ---------------- | ------- | -------------- |
| Chrome/Edge | ✅               | 112+    | April 2023     |
| Firefox     | ✅               | 116+    | August 2023    |
| Safari      | ✅               | 17+     | September 2023 |
| Safari iOS  | ✅               | 17+     | September 2023 |
| Node.js     | ✅               | 20+     | April 2023     |

**Verdict**: The `v` flag reached cross-browser support in September 2023 (Safari 17). In 2026, with ~18+ months of coverage, it is **safely shippable** for most applications — same posture as any other ES2023 feature.

**Caveat — iOS**: iOS Safari version mirrors iOS version. Users on iOS 16 (still ~8% of iOS market in early 2024) do not have Safari 17. Check your analytics.

```typescript
// Strategy 1: Feature detection + fallback
function unicodeSetTest(str: string): boolean {
  try {
    // Try v flag — will throw SyntaxError if not supported
    const re = new RegExp("[\\p{Letter}--[a-zA-Z]]", "v");
    return re.test(str);
  } catch {
    // Fallback: approximate with u flag (less precise)
    return /\p{Letter}/u.test(str) && !/[a-zA-Z]/.test(str);
  }
}

// Strategy 2: Transpilation via Babel plugin or Vite plugin
// @babel/plugin-transform-unicode-sets-regex
// Transforms v flag patterns to u flag equivalents at build time
// → Ship v flag syntax, browser receives compatible u flag output

// Strategy 3: Require support in your team's baseline
// If your project targets iOS 17+ / Chrome 112+ / Firefox 116+:
// → Ship v flag directly, no transpilation needed

// When v flag shines (not replaceable by u alone):
// 1. Set difference: [\p{Letter}--[a-zA-Z]] — letters except ASCII
// 2. Set intersection: [\p{Letter}&&\p{Uppercase_Letter}] — uppercase letters only
// 3. String properties: \p{RGI_Emoji} — emoji sequences

const nonAsciiLetter = /[\p{Letter}--[a-zA-Z]]/v; // Chrome 112+, Firefox 116+, Safari 17+
```

Vietnamese: `v` flag đạt cross-browser support tháng 9/2023 (Safari 17). Năm 2026, an toàn để ship cho hầu hết projects. Caveat: iOS 16 users (~8% thị phần đầu 2024) chưa có Safari 17 — check analytics. Strategy: feature detect với try/catch fallback, hoặc Babel transpile `@babel/plugin-transform-unicode-sets-regex`, hoặc set minimum iOS 17 trong project baseline.

**💡 Interview Signal:**

- ✅ Strong: Gives exact browser version numbers + dates, identifies iOS lag as caveat, knows Babel can transpile `v` flag, explains what `v` enables that `u` can't do (set notation)
- ❌ Weak: "v flag is experimental" — incorrect as of 2026, or "just use u flag" — misses the set notation capability that `u` doesn't have

---

## Anti-Patterns / Lỗi Thường Gặp

### Anti-Pattern 1: Stack Overflow Email Regex Without Context

```typescript
// ❌ Copy-pasted "comprehensive" email regex
const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

// ✅ Use browser validation
<input type="email" required />
// or
const input = document.createElement("input");
input.type = "email";
input.value = userEmail;
return input.checkValidity();
```

**Why it's wrong**: This regex fails to validate `user+tag@example.co.uk` correctly in some variants, rejects valid addresses like `"quoted"@example.com`, and doesn't verify the email actually exists. Server-side validation and confirmation email are always required.

### Anti-Pattern 2: Parsing HTML or JSON with Regex

```typescript
// ❌ Extracting HTML attributes with regex — WILL break
const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);

// ❌ Extracting JSON values with regex — WILL break
const valueMatch = jsonStr.match(/"key"\s*:\s*"([^"]+)"/);

// ✅ Use the right parser
const doc = new DOMParser().parseFromString(html, "text/html");
const title = doc.querySelector("title")?.textContent;

const { key } = JSON.parse(jsonStr);
```

### Anti-Pattern 3: Nested Quantifiers Without Anchors (ReDoS)

```typescript
// ❌ Classic ReDoS pattern — exponential backtracking
const dangerous = /(\w+\s*)+=/; // for "aaaa aaaa aaaa aaaa aaaa aaaa!"

// ❌ Also dangerous
const alsoRisky = /^(([a-z])+.)+[A-Z]([a-z])+$/;

// ✅ Rewrite to eliminate ambiguity
const safe = /\w[\w\s]*=/; // no nested grouping
const alsoSafe = /^[a-z]+(\.[a-z]+)*[A-Z][a-z]+$/;
```

### Anti-Pattern 4: `g` Flag with `.test()` in a Loop

```typescript
// ❌ Classic stateful bug
const hasNumber = /\d+/g; // g flag makes lastIndex persist

["abc123", "def456", "ghi789"].filter((s) => hasNumber.test(s));
// → [true, false, true] — wrong! "def456" skipped

// ✅ No g flag for test()
const hasNumberSafe = /\d+/;
["abc123", "def456", "ghi789"].filter((s) => hasNumberSafe.test(s));
// → [true, true, true] — correct

// ✅ Or reset lastIndex manually if g is needed elsewhere
["abc123", "def456", "ghi789"].filter((s) => {
  hasNumber.lastIndex = 0;
  return hasNumber.test(s);
});
```

### Anti-Pattern 5: User Input in `new RegExp` Without Escaping

```typescript
// ❌ RegExp injection — user controls the pattern
function searchItems(items: string[], query: string): string[] {
  const pattern = new RegExp(query, "gi"); // DANGEROUS
  return items.filter((item) => pattern.test(item));
}
// If query = ".*" → matches everything
// If query = "(a+)+" → ReDoS if items are long

// ✅ Always escape user input
function safeSearchItems(items: string[], query: string): string[] {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escaped, "gi");
  return items.filter((item) => pattern.test(item));
}
```

> 🇻🇳 **Tóm tắt**: 5 anti-patterns cần nhớ: (1) Email regex từ Stack Overflow — dùng browser validation thay thế. (2) Parse HTML/JSON bằng regex — dùng DOMParser/JSON.parse. (3) Nested quantifiers không anchor — ReDoS risk. (4) `g` flag với `.test()` trong loop — stateful `lastIndex` bug. (5) User input trong `new RegExp` không escape — RegExp injection và ReDoS.

---

## Memory Hook / Mẹo Ghi Nhớ

> 🧠 **"Regex is the last tool, not the first. Escape input always, anchor when nesting, and test() without g."**
>
> Tạm dịch: "Regex là công cụ **cuối cùng**, không phải đầu tiên. **Escape input luôn luôn**, **anchor khi có nesting**, **dùng `.test()` không kèm `g`**."

Key triad to remember:

1. **Last tool** — `URL`, `DOMParser`, `JSON.parse`, `checkValidity()` come before regex
2. **Escape always** — `escapeRegExp()` for regex input, `escapeHtml()` for HTML output
3. **`g` trap** — never use `g` with `.test()` in loops; use `matchAll()` instead

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Difficulty | Topic                                     | Key Answer Point                                                    |
| --- | ---------- | ----------------------------------------- | ------------------------------------------------------------------- |
| 1   | 🟢         | match vs matchAll vs exec vs test         | `match(g)` loses capture groups; `matchAll` is modern answer        |
| 2   | 🟢         | Literal vs `new RegExp`                   | Literal = compile time; constructor = runtime; escape backslash     |
| 3   | 🟢         | Email validation                          | Use `<input type="email">` / `checkValidity()`, not regex           |
| 4   | 🟡         | `g` flag trap                             | `lastIndex` persists; never `g` + `test` in loop                    |
| 5   | 🟡         | Extract URLs from text                    | Exclusion set `[^\s<>"')\]]` + trailing punctuation cleanup         |
| 6   | 🟡         | Lookbehind assertion                      | Match position if preceded (not consumed); Safari 16.4+ baseline    |
| 7   | 🔴         | ReDoS                                     | NFA exponential backtracking; `(a+)+`; real CVEs; RE2 fix           |
| 8   | 🔴         | Highlight search terms safely             | `escapeRegExp` (regex injection) + `escapeHtml` (XSS)               |
| 9   | 🔴         | Regex literal vs `new RegExp` performance | Literal = compiled at parse time; uncached constructor = 16x slower |
| 10  | 🔴         | `v` flag browser strategy                 | Baseline Sep 2023 (Safari 17); Babel transpile for iOS 16 tail      |

---

## Cold Call Simulation / Mô Phỏng Câu Hỏi Nhanh

_Interviewer asks without warning — answer in under 60 seconds:_

**"Is `/^(a+)+$/` a safe regex?"**

> No. It contains nested quantifiers `(a+)+` — classic ReDoS pattern. For input of N `a`s not matching the `$` condition, the NFA explores 2^(N-1) paths. For 30 characters, that's 500 million paths — the event loop will hang. Fix: rewrite as `/^a+$/` (equivalent meaning, no nesting).

---

**"What's wrong with `const re = /foo/g; items.forEach(s => re.test(s))`?"**

> The `g` flag makes `lastIndex` stateful on the regex object `re`. After the first successful `.test()`, `lastIndex` points to after the match. The next call starts from there, likely finds nothing, resets `lastIndex` to 0 — and the pattern alternates true/false/true. Fix: remove `g` from the pattern, or add `re.lastIndex = 0` before each `test()` call.

---

**"What does the `d` flag do?"**

> The `d` flag (hasIndices, ES2022) adds an `.indices` property to the match result that contains `[start, end]` position pairs for each capture group. Useful for syntax highlighters, diff tools, and code editors that need to know exactly which character positions were matched. Supported in Chrome 90+, Firefox 88+, Safari 15+.

---

**"What's the difference between `u` and `v` flags?"**

> Both enable full Unicode code point matching. `v` is a strict superset of `u` (cannot use both). `v` additionally enables set notation inside character classes: `--` for difference `[\p{Letter}--[a-zA-Z]]`, `&&` for intersection `[\p{Letter}&&\p{Uppercase_Letter}]`, and nested character classes. `v` requires Chrome 112+/Firefox 116+/Safari 17+ (all reached mid-2023). Use `v` for new code targeting those baselines.

---

## Self-Check / Tự Kiểm Tra

Trước khi rời khỏi topic này, đảm bảo bạn có thể:

- [ ] Draw the "should I use regex?" decision tree from memory — which 5 things come before regex?
- [ ] Explain the `g` flag `lastIndex` trap with a concrete code example
- [ ] Write a safe `highlightSearch(text, term)` function with both `escapeRegExp` and `escapeHtml`
- [ ] Explain catastrophic backtracking on `(a+)+` — why does `"a".repeat(30) + "!"` hang?
- [ ] Name two real CVEs involving ReDoS in popular npm packages
- [ ] Write a named capture group date parser using `(?<year>\d{4})`
- [ ] Explain the difference between `match(g)` (loses groups) and `matchAll` (preserves groups)
- [ ] State the browser support baseline for: lookbehind, `v` flag, `d` flag
- [ ] Write `escapeRegExp` from memory (the MDN-recommended one-liner)
- [ ] Explain when to use `new RegExp` vs literal, and the backslash escaping difference

---

> 🇻🇳 **Tóm tắt cuối**: Regex là sharp tool. Dùng nó **cuối cùng** (sau `URL`, `DOMParser`, `JSON.parse`, `checkValidity()`). Khi dùng: **escape input luôn luôn** (`escapeRegExp` cho regex, `escapeHtml` cho HTML). Tránh **nested quantifiers** (ReDoS). Không dùng **`g` với `.test()`** trong loop. Nắm **named groups**, **`matchAll`**, **lookbehind**, và `v` flag — đây là senior signals trong interview.
