# AGENTS.md — 07-web-security

## OVERVIEW

FE-side security: XSS variants, CSRF + SameSite, CSP headers, CORS, JWT vs session auth, OAuth2 PKCE, clickjacking, supply chain.

## WHERE TO LOOK

| Topic                                                                     | File                               |
| ------------------------------------------------------------------------- | ---------------------------------- |
| XSS (stored / reflected / DOM)                                            | `01-common-vulnerabilities.md`     |
| CSRF + SameSite cookies                                                   | `01-common-vulnerabilities.md`     |
| CSP headers + nonce/hash                                                  | `01-common-vulnerabilities.md`     |
| CORS misconfiguration                                                     | `01-common-vulnerabilities.md`     |
| Clickjacking + X-Frame-Options                                            | `01-common-vulnerabilities.md`     |
| Open redirect + URL validation                                            | `01-common-vulnerabilities.md`     |
| JWT (client handling, storage)                                            | `02-authentication.md`             |
| OAuth2 PKCE + token flows                                                 | `02-authentication.md`             |
| Session auth vs token auth                                                | `02-authentication.md`             |
| Comprehensive threat model                                                | `03-web-security-comprehensive.md` |
| WebCrypto API, payments (PCI-DSS, 3DS, tokenization, Payment Request API) | `04-webcrypto-and-payments.md`     |

## LOCAL CONVENTIONS

- **FE perspective only** — covers what runs in the browser, headers sent by client, token storage decisions.
- XSS defenses: output encoding, DOMPurify usage, `textContent` over `innerHTML`.
- CSRF defenses: SameSite cookie attribute, double-submit cookie pattern.
- JWT: store in `httpOnly` cookie (not `localStorage`) when discussing secure options.
- CSP: teach header structure + reporting (`report-uri`/`report-to`), not server config syntax.

## CROSS-REFERENCES

- Backend auth + JWT signing internals → `../be-track/02-backend-knowledge/04-auth-security.md`
- OWASP Top 10 + broader threat modeling → `../shared/04-security/`
- Security fundamentals (encryption, TLS) → `../shared/04-security/01-security-fundamentals.md`
- Modern auth patterns (PKCE deep-dive) → `../shared/04-security/04-modern-auth-patterns.md`

## ANTI-PATTERNS

- ❌ Don't recommend client-only sanitization as the sole XSS defense — always note server-side encoding too.
- ❌ Don't explain backend auth implementation details (password hashing, DB session storage) — redirect to be-track.
- ❌ Don't add OWASP Top 10 content already covered in `../shared/04-security/` — link instead.
- ❌ Don't conflate JWT _signing/verification_ (server concern) with JWT _storage/transmission_ (FE concern).
