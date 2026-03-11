# Frontend Authentication / Xác Thực Frontend
## Web Security - Chapter 2 / Bảo Mật Web - Chương 2


---

## Overview / Tổng Quan
- Mục tiêu: hiểu rõ cách frontend phối hợp với backend để xác thực an toàn, giảm rủi ro XSS/CSRF/token leakage/session hijack.
- Trọng tâm phỏng vấn senior: trade-off giữa cookie session và token-based auth trong SPA/SSR/hybrid app.

## Related Reading / Tài Liệu Liên Quan
- [Modern Auth Patterns (Shared)](../../shared/04-security/04-modern-auth-patterns.md)
- [Security Fundamentals (Shared)](../../shared/04-security/01-security-fundamentals.md)
- [Common Vulnerabilities](./01-common-vulnerabilities.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. Differentiate Authentication and Authorization in frontend systems.
**Tổng Quan:**
- Authentication trả lời “bạn là ai”, Authorization trả lời “bạn được làm gì”; frontend chỉ phản ánh state, không phải trust boundary cuối.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q2. Why frontend must not be the source of truth for authorization?
**Tổng Quan:**
- Client có thể bị sửa đổi nên mọi quyết định quyền truy cập phải được backend kiểm tra lại.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q3. Explain cookie-based auth for web apps.
**Tổng Quan:**
- Server tạo session, gửi cookie định danh; browser tự đính kèm cookie theo domain/path khi gọi API.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q4. Role of httpOnly, secure, sameSite cookie flags?
**Tổng Quan:**
- httpOnly chặn JS đọc cookie; secure bắt buộc HTTPS; sameSite giảm nguy cơ CSRF qua cross-site request.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.
```http
Set-Cookie: sid=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1800
```
- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

### 🟢 [Junior] Q5. Compare localStorage vs cookie for JWT storage.
**Tổng Quan:**
- localStorage dễ dùng nhưng lộ khi XSS; httpOnly cookie an toàn hơn trước XSS nhưng cần CSRF defense.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q6. When should in-memory token storage be considered?
**Tổng Quan:**
- Phù hợp app ưu tiên bảo mật cao, chấp nhận mất đăng nhập khi refresh hoặc cần silent refresh phức tạp.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q7. Explain OAuth 2.0 Authorization Code + PKCE for SPA.
**Tổng Quan:**
- SPA tạo code_verifier/code_challenge để đổi code lấy token an toàn, tránh lộ client secret ở trình duyệt.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.
```ts
// PKCE helper (browser)
async function createCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hashBuffer);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
```
- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

### 🟢 [Junior] Q8. Why implicit flow is discouraged for modern SPAs?
**Tổng Quan:**
- Implicit flow đưa access token qua URL fragment dễ rò rỉ qua logs/history/referrer, khó kiểm soát vòng đời token.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q9. How does refresh token rotation improve security?
**Tổng Quan:**
- Mỗi lần refresh phát token mới và vô hiệu token cũ, giúp phát hiện replay attack nếu token cũ bị tái sử dụng.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q10. What is session fixation and mitigation?
**Tổng Quan:**
- Kẻ tấn công ép nạn nhân dùng session ID đã biết; cần rotate session ID sau login/privilege change.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q11. How to implement CSRF protection in React apps?
**Tổng Quan:**
- Dùng SameSite, CSRF token synchronizer/double-submit, và xác thực Origin/Referer ở backend.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.
```tsx
// CSRF token gửi qua custom header
await fetch("/api/profile", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
  },
  body: JSON.stringify(payload),
});
```
- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

### 🟢 [Junior] Q12. How to secure API calls from frontend?
**Tổng Quan:**
- Dùng HTTPS bắt buộc, timeout/retry kiểm soát, validate response schema, và central auth interceptor.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q13. What is Content Security Policy in auth context?
**Tổng Quan:**
- CSP giảm XSS injection, gián tiếp bảo vệ token/session bằng cách hạn chế script nguồn không tin cậy.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟢 [Junior] Q14. Explain CORS and credentialed requests.
**Tổng Quan:**
- Khi gửi cookie cross-origin cần withCredentials + Access-Control-Allow-Credentials + origin cụ thể (không wildcard).
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q15. How to manage auth state in React safely?
**Tổng Quan:**
- Tách auth state machine, tránh lưu token vào global debug logs, đồng bộ tab bằng BroadcastChannel khi logout.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q16. What are protected routes and their limitations?
**Tổng Quan:**
- Route guard chỉ bảo vệ UX; backend vẫn phải từ chối truy cập trái phép ngay cả khi frontend bypass guard.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q17. How do you handle token expiry race conditions?
**Tổng Quan:**
- Queue request khi refresh đang diễn ra, tránh nhiều refresh song song gây invalid token cascade.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.
```ts
let refreshing: Promise<string> | null = null;
async function getAccessToken(): Promise<string> {
  if (isExpired(token)) {
    refreshing ??= refreshToken().finally(() => { refreshing = null; });
    token = await refreshing;
  }
  return token;
}
```
- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

### 🟡 [Mid] Q18. How to implement silent re-authentication?
**Tổng Quan:**
- Dùng refresh token/cookie session hoặc hidden iframe với IdP hỗ trợ, kèm timeout và fallback rõ ràng.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q19. How to secure logout flow?
**Tổng Quan:**
- Xóa state client, revoke server session/refresh token, invalidate cookie và broadcast logout đa tab.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q20. How do SSO integrations work in frontend?
**Tổng Quan:**
- Frontend redirect tới IdP, nhận authorization code, backend/token endpoint xử lý và trả session nội bộ.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q21. What is OpenID Connect and why important for frontend?
**Tổng Quan:**
- OIDC thêm identity layer trên OAuth 2.0 với ID Token + UserInfo để xác định danh tính chuẩn hóa.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q22. How to validate ID Token on frontend?
**Tổng Quan:**
- Frontend chỉ kiểm tra claim cơ bản cho UX; xác minh chữ ký đầy đủ nên ở backend/BFF để tăng trust.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q23. What is BFF (Backend for Frontend) in auth architecture?
**Tổng Quan:**
- BFF giữ token server-side, frontend chỉ giữ session cookie giúp giảm lộ token và đơn giản hóa policy.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.
```ts
// BFF pattern: frontend never sees OAuth refresh token
export async function getSessionUser() {
  const res = await fetch("/bff/session", { credentials: "include" });
  if (!res.ok) throw new Error("Unauthenticated");
  return res.json();
}
```
- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

### 🟡 [Mid] Q24. How to design role/permission UI without leaking security assumptions?
**Tổng Quan:**
- Ẩn/hiện theo role để UX tốt, nhưng mọi endpoint phải enforce permission ở server.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q25. How to mitigate XSS impact on auth?
**Tổng Quan:**
- Sanitize input/output, CSP strict, Trusted Types, tránh dangerouslySetInnerHTML và review third-party scripts.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q26. How to mitigate replay attacks for tokens?
**Tổng Quan:**
- Token ngắn hạn + rotation + sender-constrained token (DPoP/mTLS) + device binding nếu hạ tầng hỗ trợ.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q27. How to handle auth in mobile web and desktop web consistently?
**Tổng Quan:**
- Chuẩn hóa auth contract (claims, expiry, refresh semantics) và policy cookie/cors theo platform behavior.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q28. How to handle multi-tenant authentication in frontend?
**Tổng Quan:**
- Encode tenant context trong subdomain/path/claim và đảm bảo switch tenant invalidate cache nhạy cảm.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q29. How to instrument auth security monitoring?
**Tổng Quan:**
- Log event theo chuẩn (login success/fail, refresh, revoke), gắn correlation ID và alert bất thường.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🟡 [Mid] Q30. How to support MFA/2FA in SPA?
**Tổng Quan:**
- Xây flow step-up auth rõ ràng, hạn chế bypass, timeout OTP hợp lý và backup recovery code.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q31. WebAuthn basics for frontend engineers?
**Tổng Quan:**
- Frontend gọi WebAuthn API để tạo/đăng nhập passkey; private key nằm trên authenticator, chống phishing tốt hơn password.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.
```ts
// WebAuthn registration (simplified)
const credential = await navigator.credentials.create({
  publicKey: publicKeyCreationOptions,
});
await fetch("/api/webauthn/register/finish", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(credential),
});
```
- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

### 🔴 [Senior] Q32. How to combine passkey and password fallback?
**Tổng Quan:**
- Ưu tiên passkey, fallback password + MFA cho thiết bị chưa hỗ trợ; tránh UX gây lockout người dùng.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q33. What is risk-based authentication?
**Tổng Quan:**
- Điểm rủi ro dựa trên device/location/behavior; frontend hiển thị challenge bổ sung khi backend yêu cầu.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q34. How to secure auth data in browser caches?
**Tổng Quan:**
- Đặt cache-control no-store cho response chứa token/PII, tránh lưu trong service worker cache sai phạm vi.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q35. How to do secure API error handling?
**Tổng Quan:**
- Không lộ chi tiết nội bộ (stack/claim), trả mã lỗi nhất quán và map sang UX message an toàn.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q36. How to design auth for offline-first app?
**Tổng Quan:**
- Tối thiểu hóa quyền offline, mã hóa local data, token ngắn hạn và revalidation bắt buộc khi online.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.
```http
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
```
- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

### 🔴 [Senior] Q37. How to handle account linking (Google + Email) securely?
**Tổng Quan:**
- Xác minh quyền sở hữu cả hai identity trước khi liên kết, chống takeover qua email chưa verify.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q38. How to answer auth trade-off in interviews?
**Tổng Quan:**
- Bắt đầu bằng threat model, ràng buộc sản phẩm, compliance, rồi mới chọn kiến trúc lưu token/session.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q39. How does zero-trust mindset apply to frontend auth?
**Tổng Quan:**
- Không tin client/network mặc định; mọi request phải được xác minh danh tính, ngữ cảnh và policy liên tục.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q40. What common auth mistakes do frontend teams make?
**Tổng Quan:**
- Tin tưởng route guard quá mức, lưu token trong localStorage không CSP, refresh logic race condition.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

### 🔴 [Senior] Q41. How to prepare for senior auth system design interviews?
**Tổng Quan:**
- Luyện trình bày end-to-end flow: login, refresh, revoke, logout, incident response, observability.
**Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
**Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

---

## Implementation Checklist / Checklist Triển Khai
- Ưu tiên cookie httpOnly + secure + sameSite phù hợp.
- Thiết kế refresh token rotation và revoke endpoint rõ ràng.
- Bật CSP đủ chặt để giảm nguy cơ XSS ảnh hưởng auth.
- Chuẩn hóa interceptor xử lý 401/403 và race refresh.
- Đo lường tỉ lệ login fail, token refresh fail, suspicious events.

## Cross References / Điều Hướng Kiến Thức
- [Modern Auth Patterns (Shared)](../../shared/04-security/04-modern-auth-patterns.md)
- [Security Fundamentals (Shared)](../../shared/04-security/01-security-fundamentals.md)
- [Common Vulnerabilities](./01-common-vulnerabilities.md)


## Advanced Drill Q&A / Bộ Câu Hỏi Nâng Cao

### 🟡 [Mid] Extra Q1. How to secure social login popup flows?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q2. How to protect against token exfiltration via browser extensions?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q3. How to design account recovery securely?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q4. How to handle passwordless magic-link safely?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q5. How to secure device trust / remember-device features?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q6. How to enforce step-up auth for sensitive operations?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q7. How to prevent open redirect issues in auth callbacks?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q8. How to secure redirect_uri handling in SPA?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q9. How to support enterprise SAML SSO in frontend UX?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q10. How to handle clock skew in token validation?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🟡 [Mid] Extra Q11. How to secure impersonation/admin-switch-user flows?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q12. How to log out from all devices?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q13. How to implement session concurrency limits?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q14. How to secure GraphQL APIs with frontend auth?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q15. How to handle auth when third-party cookies are blocked?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q16. How to protect against session hijacking on shared devices?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q17. How to manage auth for embedded iframes/widgets?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q18. How to design consent + auth flows together?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q19. How to test auth security with automated E2E?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q20. How to handle incident response for leaked refresh token?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q21. How to pass compliance audits for frontend auth?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q22. How to design migration from legacy auth to modern OIDC?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

### 🔴 [Senior] Extra Q23. How to prevent auth regressions during rapid feature delivery?
**Tổng Quan:**
- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
**Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
**Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

[Back to Table of Contents](../00-table-of-contents.md)
