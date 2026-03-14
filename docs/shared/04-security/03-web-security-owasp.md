# Web Security & OWASP Top 10 / Bảo Mật Web và OWASP

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Security Fundamentals](./01-security-fundamentals.md) | [Cryptography](./02-cryptography-and-protocols.md) | [FE Web Security](../../fe-track/07-web-security/) | [BE Auth](../../be-track/02-backend-knowledge/04-auth-security.md)

## Overview / Tổng Quan
- Tài liệu tổng hợp rủi ro web phổ biến theo OWASP Top 10 (2021) và kỹ thuật phòng thủ nhiều lớp.
- Covers: injection, XSS, CSRF, IDOR, security misconfiguration, and mitigation patterns.

## OWASP Top 10 Snapshot
### Explanation / Giải thích
- OWASP là danh mục ưu tiên risk chứ không phải checklist hoàn chỉnh cho mọi hệ thống.
- Khi phỏng vấn, hãy nêu: attack path, impact, detection, prevention, verification.
### Example / Ví dụ
- Broken Access Control thường gây IDOR hoặc privilege escalation.
- Injection thường xuất hiện ở SQL/NoSQL/OS command khi thiếu validation và parameterization.

## A01:2021 Broken Access Control
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A02:2021 Cryptographic Failures
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A03:2021 Injection
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A04:2021 Insecure Design
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A05:2021 Security Misconfiguration
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A06:2021 Vulnerable and Outdated Components
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A07:2021 Identification and Authentication Failures
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A08:2021 Software and Data Integrity Failures
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A09:2021 Security Logging and Monitoring Failures
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A10:2021 Server-Side Request Forgery (SSRF)
### Overview / Tổng Quan
- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.
### Explanation / Giải thích
- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.
### Example / Ví dụ
- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.
### Interview Angle
- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## XSS Deep Dive
### Overview / Tổng Quan
- Phần này đi sâu vào XSS Deep Dive để chuẩn bị câu hỏi phỏng vấn senior-level.
### Explanation / Giải thích
- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.
### Example / Ví dụ
- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.
### Practical Checklist
- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## CSRF
### Overview / Tổng Quan
- Phần này đi sâu vào CSRF để chuẩn bị câu hỏi phỏng vấn senior-level.
### Explanation / Giải thích
- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.
### Example / Ví dụ
- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.
### Practical Checklist
- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## SQL Injection
### Overview / Tổng Quan
- Phần này đi sâu vào SQL Injection để chuẩn bị câu hỏi phỏng vấn senior-level.
### Explanation / Giải thích
- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.
### Example / Ví dụ
- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.
### Practical Checklist
- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## SSRF
### Overview / Tổng Quan
- Phần này đi sâu vào SSRF để chuẩn bị câu hỏi phỏng vấn senior-level.
### Explanation / Giải thích
- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.
### Example / Ví dụ
- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.
### Practical Checklist
- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## Authentication Attacks
### Overview / Tổng Quan
- Phần này đi sâu vào Authentication Attacks để chuẩn bị câu hỏi phỏng vấn senior-level.
### Explanation / Giải thích
- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.
### Example / Ví dụ
- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.
### Practical Checklist
- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## API Security
### Overview / Tổng Quan
- Phần này đi sâu vào API Security để chuẩn bị câu hỏi phỏng vấn senior-level.
### Explanation / Giải thích
- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.
### Example / Ví dụ
- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.
### Practical Checklist
- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## Security Headers
### Overview / Tổng Quan
- Phần này đi sâu vào Security Headers để chuẩn bị câu hỏi phỏng vấn senior-level.
### Explanation / Giải thích
- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.
### Example / Ví dụ
- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.
### Practical Checklist
- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## Defense in Depth Blueprint
### Overview / Tổng Quan
- Thiết kế web security nên theo nhiều lớp từ client, edge, app, data, đến ops.
### Explanation / Giải thích
- Nếu một lớp bị bypass, lớp tiếp theo vẫn phải giảm thiểu blast radius.
### Example / Ví dụ
- Client: CSP + input constraints.
- Edge: WAF + bot protection + rate limiting.
- App: authz + validation + secure session management.
- Data: encryption + least privilege + audit log.
- Ops: patch cadence + incident runbook + tabletop exercise.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] IDOR là gì?
- **Trả lời:** IDOR là lỗi truy cập object theo ID mà không kiểm tra quyền sở hữu/ủy quyền tương ứng.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🟢 [Junior] Vì sao server-side validation bắt buộc?
- **Trả lời:** Vì attacker có thể bypass mọi kiểm tra phía client bằng request thủ công.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🟡 [Mid] Làm sao giảm rủi ro XSS trong SPA?
- **Trả lời:** Dùng output encoding đúng context, tránh dangerouslySetInnerHTML, bật CSP nonce/hash, và sanitize dữ liệu giàu định dạng.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🟡 [Mid] Rate limiting nên đặt theo gì?
- **Trả lời:** Kết hợp IP, user ID, token fingerprint, và hành vi để tránh bypass khi attacker rotate IP.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🔴 [Senior] Thiết kế chống SSRF cho dịch vụ fetch URL như thế nào?
- **Trả lời:** Bắt buộc allowlist domain, chặn private CIDR/link-local, disable redirect không tin cậy, và egress firewall.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🔴 [Senior] Ưu tiên gì trong giờ đầu incident security?
- **Trả lời:** Containment trước, bảo toàn evidence, rotate secrets, thông báo stakeholders, và bắt đầu timeline điều tra.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🟢 [Junior] Practice question 1: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 2: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 3: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 4: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 5: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 6: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 7: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 8: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 9: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 10: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 11: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 12: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 13: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 14: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 15: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 16: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 17: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 18: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 19: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 20: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 21: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 22: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 23: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 24: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 25: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 26: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 27: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 28: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 29: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 30: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 31: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 32: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 33: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 34: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 35: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 36: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 37: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 38: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 39: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 40: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 41: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 42: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 43: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 44: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 45: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 46: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 47: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 48: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 49: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 50: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 51: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 52: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 53: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 54: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 55: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 56: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 57: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 58: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 59: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 60: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 61: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 62: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 63: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 64: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 65: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 66: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 67: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 68: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 69: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 70: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 71: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 72: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 73: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 74: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 75: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 76: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 77: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 78: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 79: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 80: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 81: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 82: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 83: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 84: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 85: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 86: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 87: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 88: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 89: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 90: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 91: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 92: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 93: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 94: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 95: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 96: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 97: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 98: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 99: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 100: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 101: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 102: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 103: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 104: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 105: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 106: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 107: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 108: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 109: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 110: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 111: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 112: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 113: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 114: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 115: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 116: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 117: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 118: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 119: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 120: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 121: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 122: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 123: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 124: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 125: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 126: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 127: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 128: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 129: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 130: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 131: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 132: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 133: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 134: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 135: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 136: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 137: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 138: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 139: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 140: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 141: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 142: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 143: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 144: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 145: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 146: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 147: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 148: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 149: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 150: How would you analyze and mitigate a web security risk under OWASP?
- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

## Cross-References
- Security fundamentals: `./01-security-fundamentals.md`
- Cryptography and protocols: `./02-cryptography-and-protocols.md`


---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is SQL injection and how do you prevent it? / SQL injection và cách phòng chống? 🟢 Junior

**A:** SQL injection: user input concatenated into SQL queries → attacker modifies query structure to extract/modify data.

```sql
-- VULNERABLE:
query = "SELECT * FROM users WHERE email = '" + userInput + "'";
-- userInput = "admin' OR '1'='1"
-- → "...WHERE email = 'admin' OR '1'='1'" → ALL users returned!

-- PREVENTION — parameterized queries:
query = "SELECT * FROM users WHERE email = $1", [userInput]
-- Input treated as DATA not SQL → cannot escape string context
```

Prevention priority: (1) Parameterized queries (only reliable defense), (2) ORM (uses params by default), (3) Input validation (secondary), (4) WAF (last resort).

Vietnamese explanation: SQLi là OWASP #1 nhiều năm. Parameterized queries là ONLY reliable prevention — input validation không đủ (attackers encode/obfuscate). Modern ORMs (Sequelize, Prisma, GORM) use params by default → SQLi extremely rare if ORM used correctly. Dangerous: blind SQLi (no error output, extract via true/false responses).

---

### Q: What is XSS and how do you prevent it? / XSS và cách phòng chống? 🟡 Mid

**A:** Cross-Site Scripting: attacker injects malicious scripts into pages viewed by other users. Types: **Stored** (in DB, runs for all), **Reflected** (in URL), **DOM-based** (client-side JS reads malicious data).

```javascript
// VULNERABLE — user content as HTML
element.innerHTML = userComment; // <script>stealCookies()</script>

// PREVENTION:
element.textContent = userComment;                 // escape as text
element.innerHTML = DOMPurify.sanitize(userComment); // for rich text

// Content Security Policy header:
// Content-Security-Policy: default-src 'self'; script-src 'self'
// → blocks inline scripts + external sources
```

Vietnamese explanation: React escapes JSX `{userComment}` by default → protected. `dangerouslySetInnerHTML` + user content = must DOMPurify sanitize. HttpOnly cookie flag: script cannot read → limits XSS damage. CSP = defense in depth: even if payload injected, blocks script execution. CORS ≠ XSS protection (different attack vectors).

---

### Q: What is CSRF and how is it prevented? / CSRF và cách phòng chống? 🟡 Mid

**A:** Cross-Site Request Forgery: attacker tricks authenticated user's browser into making unwanted requests using their session cookies.

```
Attack flow:
1. Alice logs into bank.com → session cookie set
2. Alice visits evil.com (logged in)
3. evil.com: <img src="https://bank.com/transfer?to=attacker&amount=1000">
4. Browser sends request WITH Alice's cookie → transfer executed!

Prevention:
1. CSRF token: server generates random token, client sends in header/form
   Attacker cannot read token (same-origin policy) → can't forge request

2. SameSite cookie: SameSite=Lax/Strict
   → cookie not sent with cross-site requests (modern default)

3. JWT in Authorization header (not cookie) → immune to CSRF
```

Vietnamese explanation: SameSite=Lax (default in modern browsers): not sent for cross-site POST. SameSite=Strict: never sent cross-site. SPA + JWT in Authorization header: không vulnerable (browser không auto-send headers). CSRF chủ yếu affects cookie-based session auth. JWT in localStorage → vulnerable to XSS instead (tradeoff).

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| SQL injection | 🟢 | Parameterized queries ONLY fix; ORMs use by default |
| XSS | 🟡 | React escapes JSX; DOMPurify for rich text; CSP as defense in depth |
| CSRF | 🟡 | CSRF token or SameSite cookie; JWT in header = immune |
