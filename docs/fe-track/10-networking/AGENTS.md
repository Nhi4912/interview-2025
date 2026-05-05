# 10-networking — Agent Map

## OVERVIEW

HTTP/WebSocket/WebRTC from the browser's perspective: protocol mechanics, browser APIs, and FE-observable behaviours.

## WHERE TO LOOK

| Topic                                                        | File                        |
| ------------------------------------------------------------ | --------------------------- |
| HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)                          | `01-http-fundamentals.md`   |
| TLS handshake (what the browser sees)                        | `01-http-fundamentals.md`   |
| CORS preflight, `Access-Control-*` headers                   | `06-cors-same-origin.md`    |
| WebSocket vs SSE (API surface, framing, reconnect)           | `04-websockets-realtime.md` |
| WebRTC peer connection (ICE, SDP, data channels)             | `04-websockets-realtime.md` |
| `fetch` API, `AbortController`, streaming body               | `02-rest-api-design.md`     |
| Caching headers (`Cache-Control`, `ETag`, `Vary`)            | `05-caching-cdn.md`         |
| Service Workers (cache strategies, offline, background sync) | `05-caching-cdn.md`         |
| GraphQL over HTTP (batching, persisted queries)              | `03-graphql-basics.md`      |
| CDN, edge caching, stale-while-revalidate                    | `05-caching-cdn.md`         |
| Visual protocol/API relationships                            | `mindmap-networking.md`     |

## LOCAL CONVENTIONS

- Notes are FE-observable only — write what the browser can see, measure, or control.
- Code examples use `fetch`/`WebSocket`/`RTCPeerConnection` browser globals, not Node `http`.
- Bilingual (EN body + VI summary block) per fe-track norm.
- HTTP/3 QUIC coverage: explain benefit (0-RTT, no HOL blocking) without kernel UDP internals.
- CORS section must cover WS (`Sec-WebSocket-*`) separately from XHR/fetch — they differ.
- TLS coverage stops at the handshake summary visible in DevTools Network panel.

## CROSS-REFERENCES

- Backend socket internals, TCP tuning, load balancing → `../be-track/02-backend-knowledge/06-networking-go.md`
- Real-time collaboration & CRDTs (WebSocket usage at app layer) → `../15-modern-platform/02-realtime-collaboration-crdts.md`
- Network impact on Core Web Vitals, resource hints, preconnect → `../06-browser-performance/`
- Auth headers, cookie security, SameSite → `../07-web-security/`

## ANTI-PATTERNS

- ❌ Do not add server-side socket internals (epoll, accept loop, backpressure) — those live in be-track.
- ❌ Do not conflate `XMLHttpRequest` patterns with `fetch` — keep them distinct or omit XHR legacy.
- ❌ Do not skip CORS in the WebSocket section — `Origin` header enforcement differs from XHR/fetch.
- ❌ Do not duplicate CDN/caching content already in `05-caching-cdn.md`; cross-ref instead.
- ❌ Do not describe WebRTC signalling server internals — focus on browser `RTCPeerConnection` API.
