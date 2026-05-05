# AGENTS.md — 04-security

## OVERVIEW

Security theory, cryptographic primitives, and protocol-level patterns — framework-agnostic.
FE-specific XSS/CSP work lives in `../../fe-track/07-web-security/`; BE-specific JWT/OAuth/mTLS application lives in `../../be-track/02-backend-knowledge/04-auth-security.md`.

---

## WHERE TO LOOK

Scan the first 30 lines of each file to orient; then use the map below.

| Topic                                                              | File                               |
| ------------------------------------------------------------------ | ---------------------------------- |
| CIA triad, threat modeling, attack surfaces, defense-in-depth      | `01-security-fundamentals.md`      |
| Symmetric/asymmetric encryption, hashing, TLS handshake, PKI       | `02-cryptography-and-protocols.md` |
| OWASP Top 10, XSS, CSRF, SQLi, SSRF, insecure deserialization      | `03-web-security-owasp.md`         |
| OAuth 2.0, OIDC, JWT structure/validation, PKCE, passkeys/WebAuthn | `04-modern-auth-patterns.md`       |

---

## CROSS-REFERENCES

- **FE security application** (CSP headers, sanitization, SameSite cookies in React/browser context) → `../../fe-track/07-web-security/`
- **BE auth implementation** (Go/Node middleware, token storage, mTLS service mesh) → `../../be-track/02-backend-knowledge/04-auth-security.md`
- **TLS at the network layer** (handshake sequencing, cipher suites, cert chains) → `../01-cs-fundamentals/networking-theory.md`

**Ownership rule:** protocol theory and attack taxonomy belong here; language- or framework-specific implementation belongs in the relevant track.

---

## ANTI-PATTERNS

- **Don't add React-specific CSP examples here.** JSX nonce injection, `helmet` config, meta-tag CSP — all go in `../../fe-track/07-web-security/`.
- **Don't paste Go/Node middleware code here.** `gin` auth middleware, `express-jwt`, Passport strategies — go in `../../be-track/02-backend-knowledge/04-auth-security.md`.
- **Don't conflate authentication with authorization.** Auth = proving identity (covered in `04-modern-auth-patterns.md`); authz = RBAC/ABAC policy enforcement (distinct section in the same file — keep them separate when writing or referencing).
- **Don't skip `03-web-security-owasp.md` when discussing web security.** The OWASP Top 10 is the primary interview anchor for web vulnerability questions; always cross-check there before answering.
- **Don't duplicate TLS detail here if it belongs in networking.** Handshake mechanics live in `../01-cs-fundamentals/networking-theory.md`; `02-cryptography-and-protocols.md` covers the crypto primitives only.
