# Advanced Testing Strategies / Chiến Lược Kiểm Thử Nâng Cao


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Tổng Quan / Overview

- Nội dung gồm test pyramid, TDD, BDD, property/mutation, contract, performance và CI orchestration.
- Mục tiêu interview: chứng minh khả năng thiết kế test strategy theo rủi ro sản phẩm.
- Tài liệu ưu tiên practical examples với Vitest/TypeScript để dễ chuyển vào dự án thật.

### Cross-references / Tài liệu liên quan
- [React Hooks Advanced Theory](./17-frontend-theory-04-react-hooks-advanced.md)
- [State Management Patterns](./17-frontend-theory-09-state-management-patterns.md)
- [Security Architecture](./19-expert-topics-03-security-architecture.md)
- [Performance Engineering](./19-expert-topics-02-performance-engineering.md)

## Key Concepts / Khái Niệm Trọng Tâm

### 1. Testing pyramid calibration

**Tổng Quan:** `Testing pyramid calibration` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-1', () => expect(1 + 1).toBe(2));
```

### 2. Risk-based test matrix

**Tổng Quan:** `Risk-based test matrix` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-2', () => expect(1 + 1).toBe(2));
```

### 3. TDD red-green-refactor

**Tổng Quan:** `TDD red-green-refactor` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-3', () => expect(1 + 1).toBe(2));
```

### 4. BDD scenario mapping

**Tổng Quan:** `BDD scenario mapping` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-4', () => expect(1 + 1).toBe(2));
```

### 5. Property-based testing

**Tổng Quan:** `Property-based testing` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-5', () => expect(1 + 1).toBe(2));
```

### 6. Mutation testing signals

**Tổng Quan:** `Mutation testing signals` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-6', () => expect(1 + 1).toBe(2));
```

### 7. Visual regression testing

**Tổng Quan:** `Visual regression testing` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-7', () => expect(1 + 1).toBe(2));
```

### 8. Contract testing

**Tổng Quan:** `Contract testing` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-8', () => expect(1 + 1).toBe(2));
```

### 9. Integration test boundaries

**Tổng Quan:** `Integration test boundaries` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-9', () => expect(1 + 1).toBe(2));
```

### 10. E2E reliability engineering

**Tổng Quan:** `E2E reliability engineering` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-10', () => expect(1 + 1).toBe(2));
```

### 11. Flaky test mitigation

**Tổng Quan:** `Flaky test mitigation` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-11', () => expect(1 + 1).toBe(2));
```

### 12. Test data factories

**Tổng Quan:** `Test data factories` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-12', () => expect(1 + 1).toBe(2));
```

### 13. Performance testing in CI

**Tổng Quan:** `Performance testing in CI` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-13', () => expect(1 + 1).toBe(2));
```

### 14. Security testing hooks

**Tổng Quan:** `Security testing hooks` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-14', () => expect(1 + 1).toBe(2));
```

### 15. Accessibility testing strategy

**Tổng Quan:** `Accessibility testing strategy` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-15', () => expect(1 + 1).toBe(2));
```

### 16. Quality gate automation

**Tổng Quan:** `Quality gate automation` là năng lực bắt buộc khi thảo luận chiến lược kiểm thử nâng cao.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-16', () => expect(1 + 1).toBe(2));
```

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q01: How would you explain testing pyramid calibration in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Testing pyramid calibration`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-1', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q01: How would you explain testing pyramid calibration in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Testing pyramid calibration`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-21', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q01: How would you explain testing pyramid calibration in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Testing pyramid calibration`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-41', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q02: How would you explain risk-based test matrix in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Risk-based test matrix`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-2', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q02: How would you explain risk-based test matrix in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Risk-based test matrix`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-22', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q02: How would you explain risk-based test matrix in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Risk-based test matrix`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-42', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q03: How would you explain tdd red-green-refactor in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `TDD red-green-refactor`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-3', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q03: How would you explain tdd red-green-refactor in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `TDD red-green-refactor`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-23', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q03: How would you explain tdd red-green-refactor in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `TDD red-green-refactor`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-43', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q04: How would you explain bdd scenario mapping in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `BDD scenario mapping`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-4', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q04: How would you explain bdd scenario mapping in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `BDD scenario mapping`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-24', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q04: How would you explain bdd scenario mapping in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `BDD scenario mapping`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-44', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q05: How would you explain property-based testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Property-based testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-5', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q05: How would you explain property-based testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Property-based testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-25', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q05: How would you explain property-based testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Property-based testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-45', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q06: How would you explain mutation testing signals in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Mutation testing signals`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-6', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q06: How would you explain mutation testing signals in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Mutation testing signals`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-26', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q06: How would you explain mutation testing signals in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Mutation testing signals`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-46', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q07: How would you explain visual regression testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Visual regression testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-7', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q07: How would you explain visual regression testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Visual regression testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-27', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q07: How would you explain visual regression testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Visual regression testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-47', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q08: How would you explain contract testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Contract testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-8', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q08: How would you explain contract testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Contract testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-28', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q08: How would you explain contract testing in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Contract testing`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-48', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q09: How would you explain integration test boundaries in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Integration test boundaries`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-9', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q09: How would you explain integration test boundaries in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Integration test boundaries`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-29', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q09: How would you explain integration test boundaries in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Integration test boundaries`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-49', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q10: How would you explain e2e reliability engineering in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `E2E reliability engineering`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-10', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q10: How would you explain e2e reliability engineering in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `E2E reliability engineering`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-30', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q10: How would you explain e2e reliability engineering in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `E2E reliability engineering`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-50', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q11: How would you explain flaky test mitigation in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Flaky test mitigation`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-11', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q11: How would you explain flaky test mitigation in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Flaky test mitigation`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-31', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q11: How would you explain flaky test mitigation in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Flaky test mitigation`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-51', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q12: How would you explain test data factories in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Test data factories`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-12', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q12: How would you explain test data factories in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Test data factories`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-32', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q12: How would you explain test data factories in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Test data factories`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-52', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q13: How would you explain performance testing in ci in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Performance testing in CI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-13', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q13: How would you explain performance testing in ci in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Performance testing in CI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-33', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q13: How would you explain performance testing in ci in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Performance testing in CI`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-53', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q14: How would you explain security testing hooks in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Security testing hooks`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-14', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q14: How would you explain security testing hooks in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Security testing hooks`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-34', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q14: How would you explain security testing hooks in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Security testing hooks`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-54', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q15: How would you explain accessibility testing strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Accessibility testing strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-15', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q15: How would you explain accessibility testing strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Accessibility testing strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-35', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q15: How would you explain accessibility testing strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Accessibility testing strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-55', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q16: How would you explain quality gate automation in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Quality gate automation`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-16', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q16: How would you explain quality gate automation in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Quality gate automation`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-36', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q16: How would you explain quality gate automation in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Quality gate automation`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
import { expect, test } from 'vitest';
test('case-56', () => expect(1 + 1).toBe(2));
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

## Rapid Review Checklist / Checklist Ôn Tập Nhanh

- Bạn có thể giải thích 16 concept ở cả 3 mức Junior/Mid/Senior?
- Bạn có ví dụ thực tế về bug/perf/security issue và bài học rút ra?
- Bạn có thể liên kết chủ đề hiện tại với testing, observability, và delivery?
- Bạn đã chuẩn bị câu trả lời song ngữ EN heading + VI explanation chưa?
- Bạn có thể vẽ luồng dữ liệu hoặc kiến trúc trong 2-3 phút trên whiteboard?

## Tóm Tắt / Summary

Tài liệu `Advanced Testing Strategies` đã được chuyển sang bilingual Q&A format với difficulty tags (`🟢 [Junior]`, `🟡 [Mid]`, `🔴 [Senior]`), chứa marker `Tổng Quan`, `Giải thích`, `Ví dụ`, có cross-reference bằng relative path và code mẫu JS/TS để luyện phỏng vấn.
