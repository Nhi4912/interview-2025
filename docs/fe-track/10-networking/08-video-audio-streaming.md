# Video & Audio Streaming — HLS, DASH, WebRTC / Streaming Video & Âm Thanh

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [WebSockets & Realtime](./04-websockets-realtime.md), basic Browser APIs
> **See also**: [HTTP/2 & HTTP/3](./01-http2-http3.md) | [CDN & Edge](../08-fe-system-design/05-cdn-edge-caching.md) | [WebRTC Datachannel basics](./04-websockets-realtime.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"TikTok VN muốn thêm tính năng livestream shopping giống Shopee Live. Anh/chị sẽ chọn giao thức streaming nào và tại sao?"_

Ứng viên Junior trả lời ngay: _"Dùng WebRTC vì nó real-time."_ Ứng viên Senior dừng lại và hỏi ngược: "Bao nhiêu viewer đồng thời? Latency yêu cầu bao nhiêu giây? Budget CDN như thế nào?"

Rồi giải thích: **WebRTC là sub-second nhưng tốn $0.10/viewer/giờ egress** — với 100.000 người xem cùng lúc trên Shopee Live là $10.000 mỗi giờ. Trong khi đó LL-HLS đạt 2–3s latency, chạy trên CDN thông thường, chi phí chỉ $0.001/viewer/giờ. Twitch dùng hybrid: WebRTC cho streamer ingest, HLS cho CDN playback. Đây chính xác là kiến thức mà Senior Engineer cần phân biệt.

Streaming video/audio là một trong những bài toán phức tạp nhất của FE vì nó chạm đến: network protocols, browser codec support, DRM/encryption, adaptive bitrate algorithms, memory management trên mobile, và accessibility — tất cả trong cùng một feature.

---

## What & Why / Cái Gì & Tại Sao

**Media Streaming** = truyền tải audio/video theo từng chunk nhỏ (segments) thay vì download toàn bộ file.

```
Progressive download (bad for long video):
  Client ────────────────────────────────── GET /video.mp4
  Server ══════════════════════════════════ 4GB file
  Problem: phải download đủ mới seek được, wasted bandwidth

Adaptive streaming (correct):
  Client ─── GET /playlist.m3u8 ──────────────────────────
  Server ════ manifest file (list of segments + bitrate info)
  Client ─── GET /segment_720p_001.ts ────────────────────
  Client ─── GET /segment_720p_002.ts ────────────────────
  → ABR algorithm: nếu bandwidth drop → switch sang 480p
  → Seek = fetch correct segment index, not byte range
```

**Tại sao FE Engineer phải hiểu điều này?**

→ **Why?** TikTok, YouTube, Netflix, Shopee Live đều dùng adaptive streaming — nếu bạn implement video player mà không hiểu HLS/DASH, player sẽ buffer liên tục, tốn data mobile, crash trên Android tầm trung.

→ **Why?** DRM là yêu cầu bắt buộc cho premium content (Netflix L1, Disney+ FairPlay) — không biết EME/Widevine là dealbreaker cho Senior role ở streaming companies.

→ **Why?** WebRTC real-time call (Zalo, Google Meet) và WebRTC-based streaming (Twitch ingest, Loom recording) dùng cùng API nhưng có trade-off hoàn toàn khác nhau về cost và scale.

---

## Latency Tiers & Protocol Map / Phân Tầng Latency & Bản Đồ Giao Thức

```
STREAMING LATENCY SPECTRUM
─────────────────────────────────────────────────────────────────────
 VOD HLS/DASH                LL-HLS / LL-DASH          WebRTC / WHEP
 ~10–30s latency             ~2–3s latency              <500ms latency
 Netflix, YouTube            Twitch, Shopee Live        Zalo Call, Google Meet
 CDN cost: $0.001/hr/viewer  CDN cost: $0.003/hr/viewer SFU cost: $0.10/hr/viewer
─────────────────────────────────────────────────────────────────────

PROTOCOL DECISION TREE:

Is latency requirement < 1 second?
├── YES → WebRTC (via SFU for 1-to-many)
│         └── Ingest: WHIP protocol
│         └── Playback: WHEP protocol
│         └── Examples: Zalo call, Google Meet, Loom recording
│         └── Cost warning: $0.10/viewer/hr at scale
│
└── NO → Is latency requirement < 5 seconds (interactive live)?
    ├── YES → LL-HLS (Low-Latency HLS) or LL-DASH
    │         └── Partial segments + chunked transfer encoding
    │         └── Examples: Twitch (transitioning), Shopee Live
    │         └── Native: LL-HLS in Safari 14+, hls.js 1.x
    │
    └── NO → Standard HLS or DASH (10–30s latency acceptable)
        ├── VOD / Live with latency OK
        ├── DRM required?
        │   ├── iOS / Safari → HLS + FairPlay (EME)
        │   ├── Android / Chrome → DASH + Widevine (EME)
        │   └── Cross-platform → CMAF + multi-DRM
        │
        ├── Browser support priority?
        │   ├── Must support Safari natively → HLS (m3u8)
        │   └── Modern browsers only → DASH (mpd) or CMAF
        │
        └── Simple VOD, no DRM, no live?
            → Progressive MP4 (< 10 min content only)

CONTAINER / FORMAT LAYER:
  HLS  → .ts segments (legacy) or CMAF/fMP4 segments (modern)
  DASH → always fMP4 / CMAF segments
  CMAF → Common Media Application Format — unified container for both HLS & DASH
```

---

## Comparison Matrix / Bảng So Sánh Giao Thức

| Protocol            | Latency        | Browser Support                      | DRM                | Live Support | Codecs            | CDN Cost/viewer/hr  | Use Case                        |
| ------------------- | -------------- | ------------------------------------ | ------------------ | ------------ | ----------------- | ------------------- | ------------------------------- |
| **HLS**             | 10–30s         | All (native Safari, hls.js for rest) | FairPlay           | ✅ Yes       | H.264, H.265, AV1 | ~$0.001             | Netflix-style VOD, broadcast    |
| **LL-HLS**          | 2–4s           | Safari 14+, hls.js 1.x+              | FairPlay           | ✅ Yes       | H.264, H.265      | ~$0.003             | Twitch, Shopee Live             |
| **DASH**            | 10–30s         | All via dash.js / shaka-player       | Widevine/PlayReady | ✅ Yes       | H.264, H.265, AV1 | ~$0.001             | YouTube, Netflix Android/Web    |
| **LL-DASH**         | 2–4s           | Chromium + dash.js                   | Widevine           | ✅ Yes       | H.264, H.265      | ~$0.003             | Low-latency broadcast           |
| **WebRTC**          | <500ms         | All modern browsers                  | ❌ (SRTP only)     | ✅ Yes       | VP8/VP9/H.264/AV1 | ~$0.10 (SFU egress) | Zalo call, Google Meet, Loom    |
| **WHIP/WHEP**       | <500ms         | Chromium-first (2023+)               | ❌                 | ✅ Yes       | VP8/VP9/H.264     | ~$0.10 (SFU)        | WebRTC ingest/playback standard |
| **Progressive MP4** | N/A (download) | All                                  | ❌                 | ❌ No        | H.264, AV1        | ~$0.001             | Short clips <10min only         |
| **CMAF**            | 2–30s (config) | All via hls.js or dash.js            | Multi-DRM          | ✅ Yes       | H.264, H.265, AV1 | ~$0.001–0.003       | Disney+, modern streaming       |

---

## Part 1: HLS — HTTP Live Streaming / HLS — Apple's Protocol

### What is HLS? / HLS là gì?

HLS (HTTP Live Streaming) được Apple phát triển năm 2009. Đây là giao thức **fragmented HTTP streaming** — server chia video thành các segment nhỏ (~2–10 giây), liệt kê chúng trong file **m3u8 playlist**.

```
Master playlist (index.m3u8):
  #EXTM3U
  #EXT-X-VERSION:6
  #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=1280x720
  720p/index.m3u8
  #EXT-X-STREAM-INF:BANDWIDTH=600000,RESOLUTION=854x480
  480p/index.m3u8
  #EXT-X-STREAM-INF:BANDWIDTH=200000,RESOLUTION=426x240
  240p/index.m3u8

Rendition playlist (720p/index.m3u8):
  #EXTM3U
  #EXT-X-TARGETDURATION:6
  #EXT-X-MEDIA-SEQUENCE:0
  #EXTINF:6.006,
  720p/seg_001.ts
  #EXTINF:6.006,
  720p/seg_002.ts
  ...
```

**Browser support:**

- Safari (iOS + macOS): native `<video src="...m3u8">` — no JS needed
- Chrome / Firefox / Edge: cần **hls.js** (MSE-based)
- Samsung TV / smart TV browsers: varies, hls.js recommended

### hls.js Setup / Cài Đặt hls.js

```typescript
// npm install hls.js
import Hls from "hls.js";

interface HlsPlayerConfig {
  videoEl: HTMLVideoElement;
  src: string;
  autoplay?: boolean;
  startLevel?: number; // -1 = auto ABR
}

function initHlsPlayer({
  videoEl,
  src,
  autoplay = false,
  startLevel = -1,
}: HlsPlayerConfig): Hls | null {
  // Safari supports HLS natively — no hls.js needed
  if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
    videoEl.src = src;
    if (autoplay) videoEl.play();
    return null; // native, no hls instance
  }

  if (!Hls.isSupported()) {
    console.error("HLS not supported in this browser");
    return null;
  }

  const hls = new Hls({
    startLevel, // -1 = let ABR choose initial quality
    maxBufferLength: 30, // seconds of buffer ahead
    maxMaxBufferLength: 60,
    enableWorker: true, // decode in web worker
    lowLatencyMode: false, // set true for LL-HLS
  });

  hls.loadSource(src);
  hls.attachMedia(videoEl);

  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    console.log(`Levels available: ${hls.levels.length}`);
    console.log(`Current level: ${hls.currentLevel}`); // -1 = auto
    if (autoplay)
      videoEl.play().catch(() => {
        // Autoplay blocked — mute and retry (browser policy)
        videoEl.muted = true;
        videoEl.play();
      });
  });

  hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
    console.log(`ABR switched to level ${data.level}: ${hls.levels[data.level].height}p`);
  });

  hls.on(Hls.Events.ERROR, (_, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          hls.startLoad(); // retry on network error
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          hls.destroy();
          break;
      }
    }
  });

  return hls;
}

// Cleanup (important for SPA / feed UIs)
function destroyHlsPlayer(hls: Hls | null): void {
  hls?.destroy();
}
```

### Low-Latency HLS (LL-HLS) / HLS Độ Trễ Thấp

LL-HLS (Apple, iOS 14+, RFC 2021) đạt 2–4s latency bằng cách dùng **Partial Segments**:

```
Standard HLS:    [──────────6s──────────] segment (phải hoàn chỉnh mới phát được)
LL-HLS:          [──0.2s─][──0.2s─][──0.2s─] partial segments
                 → client bắt đầu phát partial ngay, blocking playlist reload
```

Kỹ thuật then chốt của LL-HLS:

1. **Partial segments** (`#EXT-X-PART`) — server publish fragment 200ms thay vì 6s
2. **Playlist Delta Updates** — client chỉ nhận diff của playlist (không reload toàn bộ)
3. **Blocking Playlist Reload** — client request playlist với `_HLS_msn` + `_HLS_part` params — server holds response cho đến khi segment đó sẵn sàng (HTTP/2 server push alternative)
4. **Rendition Report** — playlist bao gồm trạng thái của tất cả variants để giảm round-trips

```typescript
// Enable LL-HLS in hls.js
const hls = new Hls({
  lowLatencyMode: true,
  liveSyncDurationCount: 3, // target 3 segments behind live edge
  liveMaxLatencyDurationCount: 10,
  maxBufferLength: 4,
});
```

---

## Part 2: DASH — Dynamic Adaptive Streaming / DASH — Chuẩn Mở

**MPEG-DASH** (Dynamic Adaptive Streaming over HTTP) là chuẩn quốc tế ISO/IEC 23009, tương tự HLS nhưng dùng XML **MPD (Media Presentation Description)** thay vì m3u8.

```xml
<!-- Simplified MPD manifest -->
<MPD type="dynamic" minimumUpdatePeriod="PT2S">
  <Period>
    <AdaptationSet mimeType="video/mp4" codecs="avc1.42E01E">
      <Representation id="720p" bandwidth="1400000" width="1280" height="720">
        <SegmentTemplate duration="4" media="720p_$Number$.m4s" initialization="720p_init.mp4"/>
      </Representation>
      <Representation id="480p" bandwidth="600000" width="854" height="480">
        <SegmentTemplate duration="4" media="480p_$Number$.m4s" initialization="480p_init.mp4"/>
      </Representation>
    </AdaptationSet>
    <AdaptationSet mimeType="audio/mp4" codecs="mp4a.40.2">
      <Representation id="audio" bandwidth="128000">
        <SegmentTemplate duration="4" media="audio_$Number$.m4s" initialization="audio_init.mp4"/>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
```

**DASH vs HLS — sự khác biệt cốt lõi:**

- HLS: Apple's proprietary → native Safari support; m3u8 playlist; `.ts` segments (legacy) hoặc fMP4
- DASH: ISO open standard; XML MPD; chỉ fMP4/CMAF segments; **không native trên bất kỳ browser nào** → luôn cần dash.js hoặc shaka-player
- YouTube (VOD) dùng DASH; YouTube Live dùng HLS
- Netflix dùng cả hai tùy device: DASH+Widevine trên Android/Chrome; HLS+FairPlay trên iOS/Safari

### Shaka Player Setup (DASH + multi-DRM)

```typescript
// npm install shaka-player
import shaka from "shaka-player/dist/shaka-player.ui";

async function initShakaPlayer(
  videoEl: HTMLVideoElement,
  mpdUrl: string,
  licenseServer?: string,
): Promise<shaka.Player> {
  // Install polyfills
  shaka.polyfill.installAll();

  if (!shaka.Player.isBrowserSupported()) {
    throw new Error("Shaka Player not supported");
  }

  const player = new shaka.Player(videoEl);

  // Configure DRM if needed
  if (licenseServer) {
    player.configure({
      drm: {
        servers: {
          "com.widevine.alpha": licenseServer, // Chrome/Android
          "com.microsoft.playready": licenseServer, // Edge/IE
        },
      },
    });
  }

  player.addEventListener("error", (event) => {
    const error = (event as shaka.PlayerEventMap["error"]).detail;
    console.error("Shaka error", error.code, error.message);
  });

  await player.load(mpdUrl);
  return player;
}
```

---

## Part 3: MSE — MediaSource Extensions / MSE — API Nạp Media Thủ Công

**MSE (MediaSource Extensions)** là browser API cho phép JavaScript **tự nạp media segments** vào `<video>` element — đây là nền tảng mà hls.js, dash.js, shaka-player đều xây dựng trên đó.

Khi không có MSE, bạn chỉ có thể dùng `<video src="...">` — browser tự handle download. Với MSE, JS có toàn quyền kiểm soát: fetch segment nào, khi nào append, ABR logic nào.

```typescript
// MSE skeleton — simplified (hls.js/shaka implement this internally)
async function mseDemo(videoEl: HTMLVideoElement, segmentUrls: string[]): Promise<void> {
  const mediaSource = new MediaSource();
  videoEl.src = URL.createObjectURL(mediaSource);

  await new Promise<void>((resolve) => {
    mediaSource.addEventListener("sourceopen", () => resolve(), { once: true });
  });

  // MIME type must match exactly — codec string matters
  const mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  if (!MediaSource.isTypeSupported(mimeType)) {
    throw new Error(`MIME type not supported: ${mimeType}`);
  }

  const sourceBuffer = mediaSource.addSourceBuffer(mimeType);

  // Sequential segment fetching (real ABR is more complex)
  for (const url of segmentUrls) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    // Wait for sourceBuffer to be ready
    await new Promise<void>((resolve) => {
      if (!sourceBuffer.updating) {
        resolve();
        return;
      }
      sourceBuffer.addEventListener("updateend", () => resolve(), { once: true });
    });

    sourceBuffer.appendBuffer(arrayBuffer);

    // Wait for append to complete
    await new Promise<void>((resolve) => {
      sourceBuffer.addEventListener("updateend", () => resolve(), { once: true });
    });

    // Remove old buffered content to avoid memory leak
    // (real players evict based on buffer health algorithm)
    if (sourceBuffer.buffered.length > 0) {
      const currentTime = videoEl.currentTime;
      const removeEnd = Math.max(0, currentTime - 30); // keep last 30s
      if (removeEnd > 0) {
        sourceBuffer.remove(0, removeEnd);
        await new Promise<void>((resolve) => {
          sourceBuffer.addEventListener("updateend", () => resolve(), { once: true });
        });
      }
    }
  }

  mediaSource.endOfStream();
}

// Simplified ABR algorithm sketch
interface Level {
  bandwidth: number;
  url: string;
  height: number;
}

function abrDecision(levels: Level[], downloadSpeed: number, bufferLength: number): Level {
  // Rule 1: if buffer is dangerously low, drop to lowest quality immediately
  if (bufferLength < 5) return levels[0];

  // Rule 2: pick highest quality that fits in available bandwidth (with 0.8 safety margin)
  const affordable = levels.filter((l) => l.bandwidth < downloadSpeed * 0.8);
  return affordable.at(-1) ?? levels[0]; // highest affordable, or fallback to lowest
}
```

**Tại sao MSE quan trọng trong interview?**

→ Khi interviewer hỏi "hls.js hoạt động thế nào?", câu trả lời là: fetch m3u8 manifest → parse playlist → fetch `.ts`/`.m4s` segments → demux/remux vào fMP4 nếu cần → `appendBuffer()` vào `SourceBuffer` → ABR algorithm quyết định quality → `MediaSource.endOfStream()` khi xong.

---

## Part 4: EME & DRM / Mã Hóa Nội Dung Cao Cấp

**EME (Encrypted Media Extensions)** là browser API cho phép web app giao tiếp với **Content Decryption Module (CDM)** — phần mềm (hoặc phần cứng) xử lý DRM.

```
DRM License Flow:
  1. Player requests encrypted stream
  2. Stream contains initialization data (PSSH box in fMP4)
  3. EME fires 'encrypted' event on <video>
  4. JS creates MediaKeySession
  5. CDM generates license request (opaque blob)
  6. JS sends license request to License Server (your backend)
  7. License Server validates → returns decryption keys
  8. JS calls session.update(licenseResponse)
  9. CDM decrypts stream → video plays
```

### DRM Systems / Các Hệ Thống DRM

| DRM System    | Platform            | Security Level               | Notes                                           |
| ------------- | ------------------- | ---------------------------- | ----------------------------------------------- |
| **Widevine**  | Chrome, Android, TV | L1 (hardware), L2, L3 (SW)   | Google's DRM; L1 required for 1080p+ on Netflix |
| **FairPlay**  | Safari, iOS, tvOS   | Hardware-backed              | Apple's DRM; HLS only; requires HTTPS always    |
| **PlayReady** | Edge, Windows, Xbox | SL3000 (hardware), SL2000 SW | Microsoft's DRM; DASH primary                   |

```typescript
// EME basic flow (simplified)
async function setupDRM(videoEl: HTMLVideoElement, licenseServerUrl: string): Promise<void> {
  // Check which DRM system is available
  const drmSystems = [
    { keySystem: "com.widevine.alpha", robustness: "SW_SECURE_CRYPTO" },
    { keySystem: "com.microsoft.playready", robustness: "" },
    { keySystem: "com.apple.fps", robustness: "" },
  ];

  let keySystemConfig: MediaKeySystemAccess | null = null;
  for (const { keySystem, robustness } of drmSystems) {
    try {
      keySystemConfig = await navigator.requestMediaKeySystemAccess(keySystem, [
        {
          videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"', robustness }],
          audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"', robustness: "" }],
        },
      ]);
      console.log(`DRM: using ${keySystem}`);
      break;
    } catch {
      // This DRM system not available, try next
    }
  }

  if (!keySystemConfig) throw new Error("No DRM system supported");

  const mediaKeys = await keySystemConfig.createMediaKeys();
  await videoEl.setMediaKeys(mediaKeys);

  videoEl.addEventListener("encrypted", async (event) => {
    const session = mediaKeys.createSession();

    session.addEventListener("message", async (msgEvent) => {
      // Send license request to license server
      const response = await fetch(licenseServerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: msgEvent.message,
      });
      const licenseBytes = await response.arrayBuffer();
      await session.update(new Uint8Array(licenseBytes));
    });

    await session.generateRequest(event.initDataType, event.initData);
  });
}
```

### Widevine Security Levels / Cấp Độ Bảo Mật Widevine

```
Widevine L1 (Hardware TEE):
  → Keys và decrypt xảy ra trong Trusted Execution Environment
  → Không thể extract keys bằng software
  → Required cho HD (1080p+) trên Netflix, Disney+
  → Available trên: Android devices với Widevine L1 cert, Chromecast
  → NOT available: Chrome on desktop (L3 only), Linux

Widevine L3 (Software only):
  → Decrypt xảy ra trong browser process
  → Có thể bị attack bởi headless browser + memory dump
  → Max resolution thường bị giới hạn ở 480p–720p bởi content owner
  → Available: Chrome on macOS/Windows, Firefox, Edge

FairPlay (Apple):
  → Hardware-backed trên Apple Silicon
  → Chỉ hoạt động qua HTTPS
  → License server cần implement Apple's FairPlay SPC/CKC protocol
  → Content key KHÔNG được gửi cleartext
```

**Interview insight**: Netflix giới hạn Chrome/macOS ở 720p vì Widevine L3 (software-only decrypt). Muốn 4K cần Windows Edge với PlayReady SL3000 hoặc native app. Đây là lý do tại sao "Netflix trên browser" không bao giờ đạt chất lượng tối đa.

---

## Part 5: WebRTC for Media Streaming / WebRTC Cho Streaming Media

> **Note**: File `04-websockets-realtime.md` đã cover WebRTC DataChannel basics. File này tập trung vào **media streaming** qua WebRTC — getDisplayMedia, SFU architecture, WHIP/WHEP.

### WebRTC Media Architecture

```
1-to-1 call (Zalo, Google Meet):
  Peer A ◄────────── DTLS/SRTP ──────────► Peer B
         ◄── ICE candidates via signaling ─►
         (direct P2P khi không có NAT)
         (TURN relay khi behind NAT)

1-to-many streaming (Twitch ingest, Loom):
  Streamer ──── WHIP ────► SFU (LiveKit / mediasoup)
                                    │
                                    ├─── WHEP ──► Viewer 1
                                    ├─── WHEP ──► Viewer 2
                                    └─── HLS  ──► Viewer 3 (CDN fallback)

  SFU = Selective Forwarding Unit
  → Nhận stream từ publisher, forward đến subscribers
  → KHÔNG transcode (khác MCU — Multipoint Control Unit)
  → Scale tốt hơn MCU vì không CPU-heavy
```

### Basic WebRTC Peer Connection (Media)

```typescript
// Simplified WebRTC media setup for 1-to-1 call
interface SignalingChannel {
  send(msg: object): void;
  onMessage(handler: (msg: object) => void): void;
}

async function startVideoCall(
  localVideo: HTMLVideoElement,
  remoteVideo: HTMLVideoElement,
  signaling: SignalingChannel,
): Promise<RTCPeerConnection> {
  // Get local media
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720, frameRate: 30 },
    audio: { echoCancellation: true, noiseSuppression: true },
  });
  localVideo.srcObject = localStream;

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "turn:turn.example.com", username: "user", credential: "pass" },
    ],
  });

  // Add local tracks
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  // Handle incoming remote stream
  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  // ICE candidate trickle
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      signaling.send({ type: "ice-candidate", candidate: event.candidate });
    }
  };

  // Create and send offer
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  signaling.send({ type: "offer", sdp: offer });

  // Handle incoming signaling messages
  signaling.onMessage(async (msg: any) => {
    if (msg.type === "answer") {
      await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    } else if (msg.type === "ice-candidate") {
      await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
    }
  });

  // Connection state monitoring
  pc.onconnectionstatechange = () => {
    console.log("WebRTC state:", pc.connectionState);
    // States: new → connecting → connected → disconnected → failed → closed
  };

  return pc;
}

// Screen capture for Loom-style recording
async function startScreenShare(): Promise<MediaStream> {
  return navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: "monitor", frameRate: 30 },
    audio: true, // system audio (Chrome only)
  });
}
```

### WHIP / WHEP — WebRTC Ingest/Playback Standard

**WHIP** (WebRTC-HTTP Ingestion Protocol) và **WHEP** (WebRTC-HTTP Egress Protocol) là các draft RFC (2022–2023) chuẩn hóa cách ingest/playback WebRTC qua HTTP — thay cho proprietary signaling.

```
Traditional WebRTC: cần custom signaling server (WebSocket)
WHIP/WHEP: dùng simple HTTP POST/GET cho signaling

WHIP (Ingest):
  Streamer → POST /whip/endpoint (SDP offer body)
  Server   → 201 Created (SDP answer body)
  → ICE negotiation follows
  → Stream begins flowing

WHEP (Playback):
  Viewer → POST /whep/endpoint (SDP offer body)
  Server → 201 Created (SDP answer body)
  → Viewer receives stream via WebRTC

Benefits:
  ✅ Standard protocol — OBS, GStreamer, browser all speak WHIP
  ✅ No custom signaling WebSocket needed
  ✅ CDN-compatible (HTTP semantics)
  ❌ Still very new — 2023 adoption, limited CDN support
  ❌ Not yet Safari-native
```

```typescript
// WHIP client example (simplified)
async function whipIngest(
  whipEndpointUrl: string,
  stream: MediaStream,
): Promise<RTCPeerConnection> {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  // Wait for ICE gathering to complete
  await new Promise<void>((resolve) => {
    if (pc.iceGatheringState === "complete") {
      resolve();
      return;
    }
    pc.onicegatheringstatechange = () => {
      if (pc.iceGatheringState === "complete") resolve();
    };
  });

  // WHIP: single HTTP POST with SDP offer
  const response = await fetch(whipEndpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/sdp",
      Authorization: "Bearer <stream-token>",
    },
    body: pc.localDescription!.sdp,
  });

  if (!response.ok) throw new Error(`WHIP error: ${response.status}`);

  const answerSdp = await response.text();
  await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

  return pc;
}
```

---

## Part 6: CMAF — Common Media Application Format

**CMAF** (ISO 23000-19) là container format thống nhất cho cả HLS và DASH, dùng **fMP4 (fragmented MP4)** thay cho `.ts` segments của HLS cổ điển.

```
Traditional HLS:  .ts segments (MPEG-2 Transport Stream)
                  → không tương thích với DASH
                  → encode 2 lần: .ts cho HLS, .m4s cho DASH

CMAF:             .m4s segments (fragmented MP4 / CMAF Chunk)
                  → một lần encode, dùng cho cả HLS và DASH
                  → 50% storage/bandwidth savings trên CDN
                  → Disney+, Apple TV+ dùng CMAF cho toàn bộ library

CMAF Chunk for LL-HLS:
  → CMAF chunks = 200ms–1s sub-segments
  → Server push via Chunked Transfer Encoding (HTTP/1.1)
  → Không cần HTTP/2 server push
  → hls.js 1.x và shaka-player hỗ trợ CMAF chunks
```

---

## Part 7: Autoplay Policies / Chính Sách Autoplay

Đây là nguồn bug phổ biến nhất khi implement video player.

```
Chrome Autoplay Policy (MEI - Media Engagement Index):
  → Site được score dựa trên lịch sử: user có thường xuyên tương tác với media không?
  → High MEI score (YouTube, Netflix) → autoplay with sound allowed
  → Low MEI score (new sites) → BLOCKED

Universal rules (all browsers):
  ✅ ALLOWED: videoEl.muted = true → autoPlay
  ✅ ALLOWED: autoplay sau user gesture (click, tap, keypress)
  ❌ BLOCKED: videoEl.play() with sound không có user gesture (trừ khi MEI cao)
  ❌ BLOCKED: play() trong setTimeout/setInterval (không phải user gesture)

Firefox: stricter — block autoplay entirely unless whitelisted by user
Safari: block autoplay by default; muted autoplay OK on iOS 10+
```

```typescript
// Safe autoplay pattern
async function safePlay(videoEl: HTMLVideoElement): Promise<void> {
  try {
    await videoEl.play();
  } catch (err) {
    if ((err as Error).name === "NotAllowedError") {
      // Autoplay blocked — mute and retry (TikTok/Instagram pattern)
      videoEl.muted = true;
      try {
        await videoEl.play();
        // Show unmute button to user
        showUnmuteButton(videoEl);
      } catch (mutedErr) {
        console.error("Even muted autoplay blocked:", mutedErr);
      }
    }
  }
}

// iOS-specific: playsInline is REQUIRED to prevent fullscreen
// <video playsInline muted autoplay />
// Without playsInline → forces fullscreen on iOS — terrible UX for feeds
function createMobileVideoElement(src: string): HTMLVideoElement {
  const video = document.createElement("video");
  video.setAttribute("playsinline", ""); // kebab-case for setAttribute
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.src = src;
  return video;
}
```

---

## Part 8: Captions, Subtitles & Accessibility / Phụ Đề & Khả Năng Tiếp Cận

### WebVTT Format

```vtt
WEBVTT

00:00:01.000 --> 00:00:04.000
Xin chào, đây là subtitle tiếng Việt.

00:00:04.500 --> 00:00:08.000 align:center
<v Speaker 1>Hello, this is the English caption.</v>

00:00:08.500 --> 00:00:12.000
Hỗ trợ <b>bold</b>, <i>italic</i>,
và multiline text.
```

### `<track>` Element Integration

```html
<!-- Native track element — accessibility baseline -->
<video controls>
  <source src="video.m3u8" type="application/vnd.apple.mpegurl" />
  <track kind="subtitles" src="/subtitles/vi.vtt" srclang="vi" label="Tiếng Việt" default />
  <track kind="subtitles" src="/subtitles/en.vtt" srclang="en" label="English" />
  <track kind="captions" src="/captions/en-cc.vtt" srclang="en" label="English (CC)" />
</video>
```

```typescript
// Programmatic subtitle control (for custom players)
function setupSubtitles(videoEl: HTMLVideoElement): void {
  const tracks = Array.from(videoEl.textTracks);

  // Disable all tracks initially
  tracks.forEach((track) => {
    track.mode = "disabled";
  });

  // Enable Vietnamese by default
  const viTrack = tracks.find((t) => t.language === "vi");
  if (viTrack) viTrack.mode = "showing";

  // Language switcher
  function switchLanguage(lang: string): void {
    tracks.forEach((track) => {
      track.mode = track.language === lang ? "showing" : "disabled";
    });
  }

  // Listen for cue changes (for custom rendering)
  tracks.forEach((track) => {
    track.addEventListener("cuechange", () => {
      const activeCues = track.activeCues;
      if (activeCues && activeCues.length > 0) {
        const cue = activeCues[0] as VTTCue;
        // Custom render cue.text in your own subtitle overlay
        renderCustomSubtitle(cue.text);
      }
    });
  });
}

// For HLS (hls.js) — subtitles from m3u8 manifest
function setupHlsSubtitles(hls: Hls): void {
  hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
    console.log("Available subtitle tracks:", data.subtitleTracks);
  });

  // Select track by index
  hls.subtitleTrack = 0; // first track
  hls.subtitleDisplay = true;
}
```

**Accessibility requirements / Yêu cầu a11y:**

- ✅ Tất cả video có audio content phải có captions (WCAG 2.1 AA — Success Criterion 1.2.2)
- ✅ Dùng `<track kind="captions">` (closed captions có thêm sound descriptions) không phải chỉ `kind="subtitles"`
- ✅ Player controls keyboard-accessible: Space (play/pause), M (mute), F (fullscreen), ← → (seek 10s)
- ❌ Burnt-in subtitles (baked vào video) = FAIL — không thể tắt, không thể thay ngôn ngữ, không có styling control

---

## Part 9: Video Preloading Strategies / Chiến Lược Preload Video

### `<video preload>` attribute

```html
<!-- preload="none" — không tải gì cả, phải click để bắt đầu -->
<!-- Dùng cho: danh sách video dài, mobile data-conscious -->
<video preload="none" poster="/thumbnail.jpg" src="..."></video>

<!-- preload="metadata" — chỉ tải metadata (duration, dimensions) -->
<!-- Dùng cho: hiển thị duration trước khi play, default recommended -->
<video preload="metadata" src="..."></video>

<!-- preload="auto" — browser quyết định bao nhiêu data tải trước -->
<!-- Dùng cho: hero video above-the-fold, critical playback -->
<video preload="auto" src="..."></video>
```

### TikTok-Style Feed Preloading / Preload Kiểu Feed TikTok

```typescript
// Feed preload manager — critical for TikTok/Reels/Shorts UX
interface FeedItem {
  id: string;
  hlsUrl: string;
  videoEl?: HTMLVideoElement;
  hls?: Hls | null;
}

class FeedPreloadManager {
  private pool: Map<string, { videoEl: HTMLVideoElement; hls: Hls | null }> = new Map();
  private readonly PRELOAD_AHEAD = 2; // preload 2 videos ahead
  private readonly MAX_POOL_SIZE = 5; // keep at most 5 in memory

  preloadItem(item: FeedItem): void {
    if (this.pool.has(item.id)) return; // already preloaded

    const videoEl = document.createElement("video");
    videoEl.setAttribute("playsinline", "");
    videoEl.muted = true;
    videoEl.preload = "auto";
    // Don't attach to DOM — preload in background

    const hls = initHlsPlayer({
      videoEl,
      src: item.hlsUrl,
      autoplay: false,
    });

    this.pool.set(item.id, { videoEl, hls });
    this.evictIfNeeded();
  }

  getItem(id: string): { videoEl: HTMLVideoElement; hls: Hls | null } | undefined {
    return this.pool.get(id);
  }

  releaseItem(id: string): void {
    const item = this.pool.get(id);
    if (!item) return;
    item.hls?.destroy();
    item.videoEl.src = ""; // release media resources
    item.videoEl.load(); // reset
    this.pool.delete(id);
  }

  // Keep pool size bounded (low-end Android memory concern)
  private evictIfNeeded(): void {
    if (this.pool.size <= this.MAX_POOL_SIZE) return;
    // Evict oldest entry (first in insertion order)
    const [oldestId] = this.pool.keys();
    this.releaseItem(oldestId);
  }

  onSwipe(visibleIndex: number, items: FeedItem[]): void {
    // Preload next N items
    for (let i = visibleIndex + 1; i <= visibleIndex + this.PRELOAD_AHEAD; i++) {
      if (items[i]) this.preloadItem(items[i]);
    }
    // Release videos far behind (> 2 positions back)
    for (let i = 0; i < visibleIndex - 2; i++) {
      if (items[i]) this.releaseItem(items[i].id);
    }
  }
}

// IntersectionObserver for autoplay/pause in feed
function setupFeedObserver(items: NodeListOf<Element>, manager: FeedPreloadManager): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const videoEl = entry.target.querySelector("video");
        if (!videoEl) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      });
    },
    { threshold: [0.7] }, // 70% visible = play
  );

  items.forEach((item) => observer.observe(item));
}
```

---

## Part 10: Picture-in-Picture & Media Session API

### Picture-in-Picture (PiP)

```typescript
// PiP API — Chrome 70+, Safari 13+, Firefox 126+
async function togglePictureInPicture(videoEl: HTMLVideoElement): Promise<void> {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  } else if (document.pictureInPictureEnabled) {
    await videoEl.requestPictureInPicture();
  }
}

// Listen for PiP events
function setupPipEvents(videoEl: HTMLVideoElement): void {
  videoEl.addEventListener("enterpictureinpicture", (event) => {
    const pipWindow = (event as PictureInPictureEvent).pictureInPictureWindow;
    console.log(`PiP window size: ${pipWindow.width}x${pipWindow.height}`);
  });

  videoEl.addEventListener("leavepictureinpicture", () => {
    console.log("Left PiP mode");
  });
}
```

### Media Session API (Lock Screen Controls)

```typescript
// Media Session API — shows media controls on lock screen, notification bar
// Used by: Spotify PWA, YouTube Music, podcast apps
function setupMediaSession(videoEl: HTMLVideoElement, title: string, artist: string): void {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
    album: "Streaming App",
    artwork: [
      { src: "/thumbnail-96.jpg", sizes: "96x96", type: "image/jpeg" },
      { src: "/thumbnail-512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
  });

  navigator.mediaSession.setActionHandler("play", () => videoEl.play());
  navigator.mediaSession.setActionHandler("pause", () => videoEl.pause());
  navigator.mediaSession.setActionHandler("seekbackward", () => {
    videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
  });
  navigator.mediaSession.setActionHandler("seekforward", () => {
    videoEl.currentTime = Math.min(videoEl.duration, videoEl.currentTime + 10);
  });
  navigator.mediaSession.setActionHandler("seekto", (details) => {
    if (details.seekTime !== undefined) videoEl.currentTime = details.seekTime;
  });

  // Update position state (for progress bar on lock screen)
  videoEl.addEventListener("timeupdate", () => {
    navigator.mediaSession.setPositionState({
      duration: videoEl.duration || 0,
      playbackRate: videoEl.playbackRate,
      position: videoEl.currentTime,
    });
  });
}
```

---

## Part 11: CDN Considerations for Streaming / CDN Cho Streaming

```
Standard CDN (static assets):
  Origin ──► CDN Edge ──► User
  → Pull caching, long TTL
  → Works for VOD segments (immutable once created)

Live HLS/DASH CDN:
  Encoder → Origin Packager → CDN Edge → Users
  → Playlist (.m3u8/.mpd): TTL = segment duration (e.g. 6s)
  → Segments (.ts/.m4s): TTL = long (immutable, content-addressed)
  → Edge must NOT cache playlist too long → stale = buffering

LL-HLS CDN requirements:
  → Must support Chunked Transfer Encoding (HTTP/1.1)
  → Must NOT buffer chunks before forwarding (streaming proxy)
  → CloudFront: supports, needs specific config
  → Fastly: good LL-HLS support
  → Cloudflare Stream: native LL-HLS

WebRTC CDN (technically SFU):
  → Not CDN in traditional sense — stateful media relay
  → LiveKit Cloud, Agora, Vonage, Twilio TURN
  → Cost: per-minute-per-participant egress
  → Cloudflare Calls: $0.05/GB egress (new 2024)

Multi-CDN strategy (Netflix, YouTube):
  → Multiple CDN vendors for redundancy
  → Client-side CDN selection based on availability + speed
  → QoE metrics feedback loop: choose CDN that minimizes rebuffering
```

---

## Part 12: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: Tại sao không nên dùng `<video src="huge.mp4">` cho video dài? / Why is progressive MP4 bad for long video?

**A:**

Progressive download MP4 has three fundamental problems for long-form content:

**1. No adaptive bitrate.** The file has a single fixed quality. If a user is on 3G, they get the same 4K stream as someone on fiber — resulting in constant buffering. There's no mechanism to switch to a lower quality mid-stream.

**2. Inefficient seeking.** MP4's index (`moov` atom) is typically at the end of the file. To seek to timestamp 00:45:00 in a 1-hour video, the browser may need to download the entire `moov` atom first (can be megabytes). Even with `moov` at the front (using `qt-faststart`), seeking still requires downloading up to that byte offset — you can't seek to content you haven't downloaded.

**3. Wasted bandwidth.** If a user watches 30% then closes the tab, 70% of download is wasted. HLS/DASH only fetch segments near the current playhead.

**The correct approach**: Use HLS or DASH for anything over 5–10 minutes. For truly short clips (< 2 min), progressive MP4 with `preload="metadata"` is acceptable.

Vietnamese: Progressive MP4 có 3 vấn đề: (1) Không có ABR — một chất lượng duy nhất cho mọi kết nối mạng. (2) Seek không hiệu quả — phải download `moov` atom trước, seek = phải download đến byte offset đó. (3) Lãng phí bandwidth — user thoát sớm = download vô ích. Dùng HLS hoặc DASH cho mọi video > 5–10 phút.

**💡 Interview Signal:**

- ✅ Strong: Mentions `moov` atom, explains ABR absence and seek mechanism, knows the 5-10min threshold
- ❌ Weak: "Progressive MP4 is slow" — needs specific mechanism

---

### 🟢 Q2: HLS và DASH khác nhau ở điểm gì? / HLS vs DASH — what's the difference?

**A:**

Both HLS and DASH implement the same core concept — **adaptive bitrate streaming over HTTP** using small segments and a manifest file — but differ in origin, format, and ecosystem:

| Aspect        | HLS                       | DASH                           |
| ------------- | ------------------------- | ------------------------------ |
| Origin        | Apple (2009), proprietary | ISO standard (2012), open      |
| Manifest      | `.m3u8` (plain text)      | `.mpd` (XML)                   |
| Segment       | `.ts` or fMP4             | `.m4s` (always fMP4)           |
| Native Safari | ✅ Yes (no JS needed)     | ❌ No (always needs JS player) |
| DRM           | FairPlay                  | Widevine + PlayReady           |
| Adoption      | Apple devices, broadcast  | YouTube, Android, smart TVs    |

**The key practical point**: You almost always need to support both. Use HLS for Safari/iOS (native support is essential — no MSE on iOS Safari historically), DASH or HLS+CMAF for everywhere else. Modern approach: **CMAF segments work with both HLS and DASH manifests** — encode once, serve both.

Vietnamese: HLS và DASH đều làm cùng một việc — ABR streaming qua HTTP — nhưng khác nhau: HLS là Apple proprietary, dùng m3u8 playlist, Safari native support; DASH là ISO open standard, dùng XML MPD, không có browser nào native (cần JS player). Điểm quan trọng nhất: **Safari on iOS không có MSE** (cho đến 2022+) nên HLS là bắt buộc cho iOS. Giải pháp hiện đại: CMAF segments + cả hai manifest (HLS m3u8 và DASH mpd) từ cùng một lần encode.

**💡 Interview Signal:**

- ✅ Strong: Knows Safari requires HLS (historically no MSE on iOS), mentions CMAF as unified container, can name FairPlay vs Widevine split
- ❌ Weak: "HLS is Apple, DASH is Android" — oversimplified, misses CMAF bridge

---

### 🟡 Q3: Giải thích MSE và `appendBuffer` hoạt động thế nào? / Explain MSE basics.

**A:**

**MediaSource Extensions (MSE)** is a browser API that lets JavaScript manually feed audio/video data to a `<video>` element, bypassing the browser's built-in HTTP fetch behavior. This is what powers hls.js, dash.js, and shaka-player.

The flow:

1. Create `MediaSource` object → create blob URL → set as `video.src`
2. Wait for `sourceopen` event → `MediaSource` is ready
3. Call `mediaSource.addSourceBuffer(mimeType)` → get `SourceBuffer`
4. Fetch a media segment (init segment first, then media segments)
5. Call `sourceBuffer.appendBuffer(arrayBuffer)` → browser decodes and queues for playback
6. Monitor `sourceBuffer.buffered` to know what's buffered
7. Remove old buffered content to prevent memory growth: `sourceBuffer.remove(start, end)`
8. When done: `mediaSource.endOfStream()`

**ABR algorithm sketch:**

```typescript
// Running average of download speed
let avgBandwidth = estimateInitialBandwidth(); // from probe request
function afterSegmentDownload(bytes: number, durationMs: number): void {
  const speedBps = (bytes * 8) / (durationMs / 1000);
  avgBandwidth = 0.7 * avgBandwidth + 0.3 * speedBps; // EWMA
}
// Pick quality: highest level where bandwidth * 0.8 > level.bitrate
```

**SourceBuffer constraint**: You can only have one `appendBuffer` in flight at a time — must wait for `updateend` event before next append. This is why all MSE-based players are async/event-driven.

Vietnamese: MSE cho phép JavaScript tự nạp media data vào `<video>` element thay vì để browser tự fetch. Flow: tạo `MediaSource` → tạo `SourceBuffer` với MIME type → fetch segment → `appendBuffer(arrayBuffer)` → chờ `updateend` → fetch segment tiếp. ABR algorithm: dùng EWMA (Exponential Weighted Moving Average) của download speed để chọn bitrate phù hợp. Quan trọng: chỉ được gọi `appendBuffer` một lần, phải chờ `updateend` trước khi gọi tiếp.

**💡 Interview Signal:**

- ✅ Strong: Explains the blob URL trick, knows `updateend` constraint, can sketch ABR EWMA logic, mentions buffer eviction
- ❌ Weak: "MSE is how hls.js works" — correct but not an explanation

---

### 🟡 Q4: Khi nào chọn hls.js, shaka-player, hay video.js? / When to use hls.js vs shaka-player vs video.js?

**A:**

Three different tools for different needs:

**hls.js** — focused HLS library

- ~230KB minified, tree-shakeable
- Best-in-class HLS and LL-HLS support
- No DRM support built-in
- ✅ When: HLS-only, no DRM, need the best HLS implementation (YouTube Live alternatives, streaming platforms)

**shaka-player** — multi-format + DRM powerhouse

- ~400KB minified
- Supports both HLS and DASH
- Built-in EME/DRM: Widevine, PlayReady, FairPlay
- Used internally by YouTube, Peacock, Disney+
- ✅ When: need DASH + DRM, premium content, multi-platform (especially when Widevine is required)

**video.js** — UI + plugin ecosystem

- Core is ~250KB + plugins
- Player UI (controls, themes, responsive layout)
- HLS via `videojs-http-streaming` plugin (wraps hls.js)
- Large plugin ecosystem: analytics, ads (IMA), quality selector
- ✅ When: need out-of-the-box player UI, media player as a product feature, need ads integration

**Decision matrix:**

```
Need DRM (Widevine/FairPlay)?      → shaka-player (or Bitmovin/THEOplayer commercial)
Need best LL-HLS performance?      → hls.js (lowLatencyMode: true)
Need UI + ads + plugins?           → video.js + videojs-http-streaming
Need DASH without DRM?             → dash.js (lightweight, ~120KB)
Building custom player from scratch?→ hls.js or shaka-player + custom UI
```

Vietnamese: Ba tools cho ba use case khác nhau: **hls.js** = HLS-only, nhẹ, LL-HLS tốt nhất, không có DRM. **shaka-player** = HLS + DASH + DRM đầy đủ (Widevine/FairPlay/PlayReady), dùng bởi YouTube và Disney+. **video.js** = player UI hoàn chỉnh + plugin ecosystem (ads, analytics), HLS qua plugin. Chọn shaka khi cần DRM; hls.js khi chỉ cần HLS thuần; video.js khi cần UI và ecosystem.

**💡 Interview Signal:**

- ✅ Strong: Knows shaka-player is used by YouTube/Disney+, understands that video.js wraps hls.js, gives clear decision criteria
- ❌ Weak: "Use hls.js for HLS, dash.js for DASH" — ignores shaka's unified support and DRM requirement

---

### 🟡 Q5: Giải thích autoplay policies và cách handle trong thực tế? / Autoplay policies — explain and handle them.

**A:**

Browsers block autoplaying video with audio to prevent unwanted noise. Each browser has slightly different rules:

**Chrome**: Uses **MEI (Media Engagement Index)** — a per-site score based on whether the user has played media on that site before. Sites with high MEI (YouTube.com) can autoplay with sound. New sites cannot. The score is not accessible to JS.

**Universal rules (all browsers):**

- ✅ `video.muted = true` → autoplay always allowed
- ✅ Calling `play()` inside a click/touch/keydown handler → always allowed
- ❌ Calling `play()` after `setTimeout` or in non-user-gesture context → blocked (even in click handler if there's an `await` before `play()`)
- ❌ `play()` with sound on new sites without user history → blocked

**Critical edge case**: Calling `await fetch(...)` then `video.play()` in a click handler — the `await` breaks the user gesture chain in some browsers. Store the `play()` call synchronously in the click handler, or use a different pattern.

```typescript
// Safe pattern for user-gesture-gated autoplay
document.getElementById("play-btn")?.addEventListener("click", () => {
  // Do NOT await anything before play() — breaks gesture chain
  const playPromise = videoEl.play(); // synchronous call in gesture
  playPromise?.catch((err) => {
    if (err.name === "NotAllowedError") {
      // Show manual play UI
    }
  });
});
```

**iOS-specific**: `playsInline` attribute is REQUIRED on iOS. Without it, the browser forces fullscreen for any video that plays — completely breaking feed UIs like TikTok Reels.

Vietnamese: Browser block autoplay để tránh tiếng ồn bất ngờ. Chrome dùng MEI score — sites user từng xem media thì được autoplay. Universal rule: **muted autoplay = luôn OK**; play() với sound sau user gesture = OK; play() sau await hoặc setTimeout = bị block. iOS: **bắt buộc phải có `playsInline`** attribute, không thì browser force fullscreen — phá vỡ UI kiểu feed. Pattern an toàn: gọi `video.play()` synchronously ngay trong click handler, không await trước đó.

**💡 Interview Signal:**

- ✅ Strong: Explains MEI, knows the async/await gesture-chain breakage, mentions `playsInline` for iOS
- ❌ Weak: "Just set muted=true" — correct but incomplete; misses gesture chain and playsInline

---

### 🟡 Q6: Captions và subtitles khác nhau thế nào? Implement accessibility như thế nào? / Captions vs subtitles and accessibility.

**A:**

**Subtitles** = translation of spoken dialogue for audiences who don't understand the language. Assumes the viewer CAN hear the audio.

**Closed Captions (CC)** = transcription for deaf/hard-of-hearing viewers. Includes non-speech audio descriptions: `[music playing]`, `[door slams]`, `[explosion]`. Required for accessibility compliance.

**WCAG 2.1 AA requirements for video:**

- Prerecorded video with audio → must have captions (1.2.2)
- Live video → must have captions (1.2.4 — AAA in 2.1, AA in 2.2 draft)
- Audio description or media alternative for prerecorded video-only (1.2.1)

**Implementation layers:**

1. **`<track>` element** — native browser support, WebVTT format, keyboard-accessible via browser UI
2. **hls.js / shaka subtitle events** — for HLS/DASH streams where subtitles are in the manifest (EXT-X-MEDIA TYPE=SUBTITLES)
3. **JS-driven custom overlay** — for full styling control (custom font, position, background opacity)

**Anti-pattern**: Burnt-in subtitles (hardcoded into video pixels) — cannot be disabled, cannot be translated, cannot be restyled for users who need larger text. This fails WCAG and is a common agency mistake.

**Player keyboard controls required:**

- Space/K: play/pause
- M: mute/unmute
- C: toggle captions
- F: fullscreen
- ← →: seek ±10s
- Tab: focus through controls

Vietnamese: Subtitles = dịch lời thoại cho người không hiểu ngôn ngữ. Captions = bản ghi đầy đủ (bao gồm mô tả âm thanh như `[tiếng nhạc]`) cho người điếc/khiếm thính. WCAG 2.1 AA yêu cầu captions cho video có audio. Implementation: `<track>` element với WebVTT là baseline; hls.js/shaka handle HLS subtitle tracks; JS custom overlay cho styling control. Anti-pattern nghiêm trọng: burnt-in subtitles — không tắt được, không đổi ngôn ngữ, không tùy chỉnh size cho người cần chữ lớn.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes captions vs subtitles (non-speech audio), knows WCAG criterion 1.2.2, identifies burnt-in as anti-pattern, mentions keyboard controls
- ❌ Weak: "Add a track element with WebVTT" — correct start but misses the captions vs subtitles distinction and accessibility depth

---

### 🔴 Q7: Làm thế nào để đạt sub-second latency cho live streaming? Tradeoff là gì? / Achieving sub-second latency — LL-HLS vs WebRTC.

**A:**

Two fundamentally different approaches, different cost class:

**LL-HLS + CMAF Chunked Transfer (2–4s latency):**

LL-HLS achieves low latency by:

1. **Partial segments** (200ms–500ms chunks instead of 2–6s segments)
2. **Chunked Transfer Encoding** — server streams chunks over HTTP as they're encoded, no need to wait for full segment
3. **Blocking playlist reload** — client requests playlist with current segment number; server holds response until next segment is ready (eliminates polling delay)
4. **Rendition reports** in playlist — reduces quality-switch round trips

Cost: standard CDN rates ($0.001–0.003/viewer/hr). Scales to millions of viewers with CDN.

**WebRTC (<500ms latency):**

WebRTC achieves sub-second via:

1. UDP-based transport (no TCP head-of-line blocking)
2. No segmentation — continuous RTP stream
3. DTLS-SRTP encryption inline with transmission
4. Jitter buffer at receiver (~100–200ms) — tradeoff for smoothness

Cost: requires SFU (LiveKit, mediasoup, Agora). SFU must forward each viewer's stream = $0.05–0.10/viewer/hr egress. At 100K concurrent viewers: **$5,000–$10,000/hr** vs $100/hr for LL-HLS CDN.

**Twitch's hybrid approach:**

- OBS streamer → RTMP ingest → Transcoding servers → HLS for CDN playback (~10–20s latency)
- Twitch low-latency mode: switching to LL-HLS (2–4s) for interactive streams
- Some experiments: WebRTC for broadcaster monitor feed (<1s), HLS for public viewers

**When to choose what:**

- Interactive real-time (bidirectional call, collaborative): WebRTC — sub-second is non-negotiable
- Interactive live (streamer talks to audience, auction, sports betting): LL-HLS — 2–4s acceptable, CDN scale needed
- Broadcast live (news, concerts): standard HLS/DASH — 10–30s fine, maximum CDN scale

Vietnamese: Hai approach khác nhau hoàn toàn về chi phí: **LL-HLS** (2–4s) dùng partial segments + chunked transfer encoding → chạy trên CDN thông thường, $0.001/viewer/hr, scale đến hàng triệu người xem. **WebRTC** (<500ms) dùng UDP/RTP → cần SFU relay, $0.05–0.10/viewer/hr, 100K viewers = $5000–10000/hr. Twitch dùng hybrid: WebRTC cho broadcaster preview, HLS cho CDN playback. Chọn WebRTC khi: bidirectional call, cần <1s. Chọn LL-HLS khi: interactive live nhưng cần scale CDN. Chọn HLS khi: broadcast, latency 10–30s OK.

**💡 Interview Signal:**

- ✅ Strong: Gives concrete cost numbers ($0.10 vs $0.001), explains partial segments mechanism, knows Twitch's hybrid, categorizes use cases by latency requirement
- ❌ Weak: "Use WebRTC for low latency" — correct but ignores cost and scale implications entirely

---

### 🔴 Q8: Giải thích EME/DRM flow — Widevine L1 vs L3 — tại sao Netflix cần L1 cho HD? / DRM/EME deep dive.

**A:**

**The EME flow end-to-end:**

```
1. Player detects encrypted content (PSSH box in fMP4 init segment)
2. <video> fires 'encrypted' event → JS receives initData (key IDs)
3. JS calls navigator.requestMediaKeySystemAccess('com.widevine.alpha', ...)
4. Creates MediaKeySession → calls generateRequest(initDataType, initData)
5. CDM generates opaque license request (contains key IDs + device certificate)
6. JS POSTs license request to License Server (Netflix's server, or third-party: Axinom, BuyDRM)
7. License Server validates: Does user have entitlement? Is device trusted?
8. License Server returns encrypted license (contains CEK — Content Encryption Key)
9. JS calls session.update(licenseResponse)
10. CDM decrypts license → gets CEK → decrypts stream
```

**Widevine security levels:**

- **L1 (Hardware TEE)**: Decryption and content pipeline runs inside device's Trusted Execution Environment. The Content Encryption Key NEVER enters main processor memory. Even with full root access to the device, you cannot extract the key. Required by Netflix for 1080p+, Disney+ for 4K.

- **L3 (Software only)**: Decryption runs in software within browser process. Vulnerable to: headless browser + memory dump attacks. That's why Netflix caps L3 browsers (Chrome on macOS/Linux) at 480p or 720p.

- **L2**: Intermediate — crypto operations in hardware, content processing in software. Rare.

**FairPlay (Apple):**

Different protocol entirely. Uses SPC (Server Playback Context) / CKC (Content Key Context) exchange:

1. Player calls `WebKitMediaKeys` (or EME on modern Safari)
2. Gets SPC blob from browser
3. Sends SPC to license server
4. Gets CKC back
5. Provides CKC to media element

**Headless client attack vectors (why L1 matters):**

- L3 → Frida hooking (mobile) or Chrome DevTools Protocol + memory scan
- Can extract CEK from process memory during decrypt
- This is why studios require L1 for HD content — software-only DRM is theater, not real protection

**Multi-DRM with CMAF:**
CMAF uses **CENC** (Common Encryption) — same encrypted content, different license servers per CDM. One transcode, Widevine license for Chrome, PlayReady for Edge, FairPlay for Safari.

Vietnamese: EME flow: browser detect encrypted content → CDM generate license request → JS gửi đến License Server → server validate entitlement + return encrypted license → CDM decrypt license → get CEK → decrypt stream. **Widevine L1**: decrypt trong hardware TEE, key không bao giờ vào main memory, không thể extract dù root máy. **L3**: decrypt bằng software, dễ bị memory dump attack → Netflix giới hạn L3 (Chrome macOS/Linux) ở 480–720p. FairPlay của Apple dùng SPC/CKC protocol riêng. Multi-DRM với CMAF: encode một lần, CENC encryption, dùng nhiều license server khác nhau cho từng CDM.

**💡 Interview Signal:**

- ✅ Strong: Explains L1 TEE isolation, knows headless attack vectors (Frida, memory dump), mentions CENC for multi-DRM, can name license server vendors
- ❌ Weak: "L1 is more secure than L3" — correct but no mechanism; interviewer at Netflix/Disney will probe the why

---

### 🔴 Q9: Design TikTok-style infinite video feed. Preloading, memory, low-end Android. / Design TikTok infinite video feed.

**A:**

This is a system design + browser API question. Key constraints: mobile data budget, memory limits on low-end Android (1–2GB RAM), smooth swipe transitions, instant playback.

**Architecture decisions:**

**1. Video element pool (object recycling)**
Don't create/destroy `<video>` elements on each swipe. Keep a pool of 3–5 elements, reassign them as user scrolls.

```typescript
// Recycle pool: 3 video elements for current + prev + next
class VideoElementPool {
  private elements: HTMLVideoElement[];
  constructor(poolSize = 3) {
    this.elements = Array.from({ length: poolSize }, () => {
      const v = document.createElement("video");
      v.setAttribute("playsinline", "");
      v.muted = true;
      v.preload = "auto";
      return v;
    });
  }
  acquire(): HTMLVideoElement {
    return this.elements.pop()!;
  }
  release(el: HTMLVideoElement): void {
    el.pause();
    el.src = "";
    el.load(); // free decoder resources
    this.elements.push(el);
  }
}
```

**2. Preload strategy (bandwidth-aware)**

```typescript
// Preload next 2 videos, evict videos > 2 behind
// Check connection before preloading
function shouldPreload(): boolean {
  const conn = (navigator as any).connection;
  if (!conn) return true;
  // Don't preload on 2G or when data-saver is on
  return conn.effectiveType !== "2g" && !conn.saveData;
}
```

**3. IntersectionObserver for play/pause**

- Threshold 0.7 (70% visible = play, otherwise pause)
- Avoids playing off-screen videos draining CPU/battery

**4. Memory budget**

- Each HLS player (hls.js) holds ~30s buffer × bitrate × number of players
- At 1Mbps × 30s × 5 players = ~18MB buffer per player type (video data only)
- Plus decoded frame buffer: ~1920×1080 × 4 bytes × 30fps buffer ≈ significant RAM
- **Solution**: Set `maxBufferLength: 10` (instead of default 30) for non-active players, and destroy hls instances for videos > 3 positions away

**5. Segment prefetch optimization**

- When user starts swiping (touchstart/pointerdown), immediately start fetching init segment of next video — net gain ~200–400ms on first segment

**6. Thumbnail → video transition**

- Show thumbnail (img) while video loads
- `video.addEventListener('canplay', () => { thumbnail.style.display = 'none'; })` — never show black frame

**Memory budget on low-end Android (2GB RAM, ~800MB available to browser):**

- Active video buffer: ~50MB
- 2 preloaded video buffers: ~30MB each
- App JS + DOM: ~100MB
- Stay under ~250MB total video memory → set conservative buffer limits

Vietnamese: Design TikTok feed cần giải quyết: (1) **Video element pool** — tái dùng 3–5 elements thay vì tạo mới (giảm GC pressure). (2) **Preload 2 videos kế tiếp** nhưng kiểm tra `navigator.connection.saveData` trước khi preload. (3) **IntersectionObserver** với threshold 0.7 để auto play/pause. (4) **Memory budget** — set `maxBufferLength: 10` cho non-active players, destroy hls instance cho videos > 3 vị trí xa. (5) **Touchstart prefetch** — khi user bắt đầu swipe, lập tức fetch init segment của video tiếp theo. (6) Thumbnail → video transition tránh black frame.

**💡 Interview Signal:**

- ✅ Strong: Mentions element recycling pool, `navigator.connection` data-saver check, buffer limits for memory, touchstart prefetch optimization, thumbnail transition
- ❌ Weak: "Use IntersectionObserver and preload next video" — correct start but no memory management or mobile constraints

---

### 🔴 Q10: 1-to-many live streaming at scale — WebRTC SFU vs HLS CDN. Cost analysis. / Live streaming architecture at scale.

**A:**

This is the most important architectural question for streaming products. The answer hinges on **latency requirement vs viewer scale**.

**Option A: HLS/DASH via CDN (Broadcast model)**

```
Streamer → Encoder (OBS/FFMPEG) → RTMP →
  Origin Server (packager: AWS MediaLive, Nimble Streamer) →
  HLS/DASH segments pushed to CDN origin →
  CDN distributes to viewers (pull caching)

Cost: ~$0.001–0.005/viewer/hr CDN egress
Scale: unlimited (CDN handles it)
Latency: 10–30s (standard) / 2–4s (LL-HLS)
```

**Option B: WebRTC SFU (Interactive model)**

```
Streamer → WebRTC → SFU (mediasoup / LiveKit / Janus) →
  SFU selectively forwards to each subscriber via WebRTC

Cost: ~$0.05–0.10/viewer/hr (SFU egress + CPU)
Scale: 10K–50K viewers per SFU cluster (needs horizontal scaling)
Latency: <500ms
```

**Cost comparison at 100K concurrent viewers for 1 hour:**

- HLS CDN: 100,000 × $0.002 × 1hr = **$200**
- WebRTC SFU: 100,000 × $0.08 × 1hr = **$8,000** (40× more expensive)

**Twitch's architecture (the textbook hybrid):**

1. Streamers push via RTMP to Twitch ingest servers
2. Twitch transcodes to multiple bitrates (1080p/720p/480p/360p/160p) — significant GPU spend
3. Serves HLS via Akamai CDN to viewers (~10–20s latency, millions of viewers at $0.001/hr scale)
4. "Low latency mode": switched to LL-HLS for interactive streams (2–4s)
5. Squad Stream / Raids: brief WebRTC connections for inter-streamer coordination

**Shopee Live / TikTok Live approach:**

- RTMP ingest → transcoding cluster
- LL-HLS/RTMP CDN for viewers (2–4s latency acceptable for shopping streams)
- Comment/gift interaction: separate WebSocket channel (not part of video stream)
- Occasional WebRTC for host ↔ guest video call within stream

**When to use WebRTC SFU:**

- Peer count < 500 (interactive lecture, virtual event with speakers)
- Bidirectional communication required (guests speaking, not just host)
- Sub-second latency non-negotiable (live auction, synchronized reactions)

Vietnamese: 1-to-many streaming có hai approach: **HLS CDN** (broadcast) — $0.001/viewer/hr, scale vô hạn, latency 10–30s hoặc LL-HLS 2–4s; **WebRTC SFU** (interactive) — $0.08/viewer/hr, scale ~50K/cluster, latency <500ms. 100K viewers × 1hr: HLS = $200 vs WebRTC = $8.000 (40× đắt hơn). Twitch dùng hybrid: RTMP ingest → transcode → HLS CDN cho viewers; LL-HLS cho low-latency mode. Shopee Live: RTMP/LL-HLS cho viewers, WebSocket riêng cho comment/gift interaction. Chọn WebRTC SFU khi: < 500 viewers, cần bidirectional, latency < 1s bắt buộc.

**💡 Interview Signal:**

- ✅ Strong: Gives concrete cost numbers, knows Twitch's hybrid (RTMP ingest + HLS CDN), separates video stream from interactive channel (WebSocket), frames decision as latency×scale×cost triangle
- ❌ Weak: "Use WebRTC for live streaming" — ignores cost, scale, and that CDN streaming is almost always more appropriate

---

## Anti-Patterns / Lỗi Sai Phổ Biến

---

### ❌ Anti-Pattern 1: `<video src="huge.mp4">` cho video 1 tiếng

```html
<!-- ❌ WRONG — 1-hour video as raw MP4 -->
<video src="https://cdn.example.com/product-demo-full.mp4" controls></video>
```

**Tại sao sai**: Không có ABR — user 3G tải cùng chất lượng với user WiFi. Seek phải download đến byte offset. 70% bandwidth lãng phí nếu user thoát sớm. Mobile users dùng hết data plan.

```typescript
// ✅ CORRECT — HLS with hls.js
const hls = initHlsPlayer({
  videoEl: document.querySelector("video")!,
  src: "https://cdn.example.com/product-demo/index.m3u8",
  autoplay: false,
});
```

---

### ❌ Anti-Pattern 2: Autoplay với âm thanh

```html
<!-- ❌ WRONG — browser will block this on almost all sites -->
<video src="intro.mp4" autoplay></video>
```

**Tại sao sai**: Chrome, Firefox, Safari đều block autoplay với sound trừ khi site có MEI score cao. User thấy frozen video hoặc lỗi play. UX tệ và unpredictable.

```html
<!-- ✅ CORRECT — muted autoplay + unmute button -->
<video src="intro.mp4" autoplay muted playsinline></video>
<!-- Show unmute button in UI, let user opt-in to sound -->
```

---

### ❌ Anti-Pattern 3: Gọi WebRTC khi thực sự muốn nói LL-HLS

Trong discussion: _"Chúng ta nên dùng WebRTC cho tính năng livestream này."_

**Tại sao sai**: WebRTC nghĩa là SFU, $0.10/viewer/hr, không scale tốt. Nếu latency requirement là 2–4s (shopping live, sports), LL-HLS là giải pháp đúng — scale như CDN, $0.001/viewer/hr, không cần SFU infrastructure.

> Chỉ dùng WebRTC khi yêu cầu latency < 1s VÀ số lượng viewer nhỏ HOẶC cần bidirectional media.

---

### ❌ Anti-Pattern 4: Không manage preload trong feed UI

```typescript
// ❌ WRONG — load tất cả videos trong feed ngay lập tức
feedItems.forEach((item) => {
  const video = document.createElement("video");
  video.src = item.url;
  video.preload = "auto"; // kills mobile data + battery
  container.appendChild(video);
});
```

**Tại sao sai**: 20 videos × 30MB preload = 600MB data downloaded khi user mới mở app. Low-end Android OOM killed. Battery drain. Shopee Mobile team đã gặp vấn đề này.

```typescript
// ✅ CORRECT — preload chỉ 2 videos kế tiếp, destroy khi xa
const manager = new FeedPreloadManager();
manager.onSwipe(currentIndex, feedItems);
```

---

### ❌ Anti-Pattern 5: Quên `playsInline` trên iOS

```html
<!-- ❌ WRONG — iOS Safari forces fullscreen for this video -->
<video src="feed-item.mp4" autoplay muted></video>
```

**Tại sao sai**: Trên iOS, video không có `playsinline` attribute sẽ tự động mở fullscreen khi play. Hoàn toàn phá vỡ TikTok-style in-feed UI. Bug cực kỳ phổ biến khi build cho mobile.

```html
<!-- ✅ CORRECT -->
<video src="feed-item.mp4" autoplay muted playsinline></video>
```

```typescript
// When creating programmatically:
videoEl.setAttribute("playsinline", ""); // must use setAttribute, not property
```

---

### ❌ Anti-Pattern 6: Burnt-in subtitles

**Tại sao sai**: Subtitle được encode trực tiếp vào video pixels. Người dùng không thể tắt, không thể chuyển ngôn ngữ, người cần font lớn không thể thay đổi. Fail WCAG 2.1 AA (1.2.2). Không thể A/B test nhiều ngôn ngữ. Một số markets (EU) có thể có legal requirement.

```html
<!-- ✅ CORRECT — WebVTT track, switchable, styleable -->
<video controls>
  <source src="video.m3u8" type="application/vnd.apple.mpegurl" />
  <track kind="captions" src="/vi.vtt" srclang="vi" label="Tiếng Việt" default />
  <track kind="captions" src="/en.vtt" srclang="en" label="English" />
</video>
```

---

## 🧠 Memory Hook / Ghi Nhớ Nhanh

**"LL-HLS là xe buýt BRT, WebRTC là taxi — cùng đến đích nhưng giá và scale hoàn toàn khác."**

```
BRT (LL-HLS):  nhiều người, cheap, 2–4 phút đợi (latency 2–4s)
Taxi (WebRTC): ít người, đắt tiền, đến ngay (latency <500ms)

Khi Shopee Live có 1 triệu viewer → BRT (LL-HLS CDN)
Khi Zalo call 1-1 → Taxi (WebRTC P2P)
Khi hội thảo 100 người → Taxi nhỏ (WebRTC SFU, <$10/hr)
```

**HLS m3u8 = Apple bus schedule** (ai cũng đọc được, Safari tự drive)
**DASH mpd = ISO bus schedule** (cần JS driver — shaka/dash.js)
**CMAF = universal bus ticket** (một vé, cả hai hệ thống chấp nhận)
**MSE = lái xe tự mình** (JS tự fetch segment, tự appendBuffer)
**EME = khóa két sắt** (browser ↔ CDM ↔ License Server ↔ decrypt)

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Difficulty | Topic                                 | Key Answer                                                               |
| --- | ---------- | ------------------------------------- | ------------------------------------------------------------------------ |
| 1   | 🟢         | Progressive MP4 bad for long video    | No ABR, moov-atom seek issues, wasted bandwidth                          |
| 2   | 🟢         | HLS vs DASH                           | Same ABR idea; HLS=Apple/m3u8/Safari-native; DASH=ISO/XML/no-native      |
| 3   | 🟡         | MSE & appendBuffer                    | JS controls segment fetch, appendBuffer into SourceBuffer, ABR EWMA      |
| 4   | 🟡         | hls.js vs shaka vs video.js           | hls.js=HLS-only; shaka=multi+DRM; video.js=UI+plugins                    |
| 5   | 🟡         | Autoplay policies                     | Muted=always OK; MEI score; async breaks gesture; playsInline iOS        |
| 6   | 🟡         | Captions/subtitles/accessibility      | CC vs subtitles; WebVTT+track; burnt-in=anti-pattern; WCAG 1.2.2         |
| 7   | 🔴         | Sub-second latency — LL-HLS vs WebRTC | LL-HLS: 2–4s, $0.001/hr, CDN; WebRTC: <500ms, $0.10/hr, SFU              |
| 8   | 🔴         | DRM / EME / Widevine L1 vs L3         | L1=hardware TEE, key never in main memory; L3=software, memory-dump      |
| 9   | 🔴         | TikTok infinite feed design           | Pool recycling, preload N+2, IntersectionObserver, buffer limits         |
| 10  | 🔴         | 1-to-many live streaming architecture | HLS CDN $200/hr vs WebRTC SFU $8000/hr; Twitch hybrid; LL-HLS sweet spot |

---

## Cold Call / Câu Hỏi Bất Chợt

Interviewer hỏi đột xuất — trả lời trong 30 giây:

**"Why does Netflix show lower resolution on Chrome than on the Netflix app?"**

→ Chrome desktop uses Widevine L3 (software-only DRM) — Content Encryption Keys can theoretically be extracted from process memory. Studios cap L3 at 720p or 1080p. The native app (Windows/macOS) uses PlayReady SL3000 or Widevine L1 hardware security → full 4K allowed.

**"What's the difference between HLS and LL-HLS?"**

→ Standard HLS: 6-second segments, 10–30s latency. LL-HLS: 200ms partial segments + blocking playlist reload + rendition reports → 2–4s latency. Same CDN, same protocol, different segment timing.

**"A video in a feed starts with a black frame before playing. How do you fix it?"**

→ Set `video.poster = thumbnailUrl` — shows the thumbnail image until `canplay` fires. Then `video.addEventListener('canplay', () => { thumbnailEl.hidden = true; })`. Never show a black frame if you preload the thumbnail correctly.

**"What is CMAF and why do companies care about it?"**

→ Common Media Application Format — fMP4 segments that work with both HLS and DASH manifests. Encode once, serve both protocols. Saves ~50% CDN storage. Disney+, Apple TV+ use it for their entire library.

**"What is a SourceBuffer?"**

→ The object returned by `mediaSource.addSourceBuffer(mimeType)`. It's the queue you `appendBuffer()` into. One SourceBuffer per track type (video track, audio track separately). Must wait for `updateend` event before next append.

---

## Self-Check / Tự Kiểm Tra

Trả lời được những câu này = sẵn sàng cho interview:

- [ ] 🟢 Giải thích tại sao `<video src="big.mp4">` tệ cho video 1 tiếng — 3 lý do cụ thể
- [ ] 🟢 Nêu 2 sự khác biệt giữa HLS và DASH (format + browser support)
- [ ] 🟡 Vẽ flow: hls.js fetch m3u8 → `appendBuffer` → video plays
- [ ] 🟡 Giải thích `MediaSource` → `SourceBuffer` → `appendBuffer` → `updateend` cycle
- [ ] 🟡 Viết code safe autoplay với muted fallback và unmute button
- [ ] 🟡 Phân biệt captions vs subtitles, nêu WCAG criterion liên quan
- [ ] 🟡 Giải thích MEI score và tại sao `await` trước `play()` có thể break autoplay
- [ ] 🔴 So sánh LL-HLS vs WebRTC: latency, cost per viewer, khi nào dùng cái nào
- [ ] 🔴 Giải thích Widevine L1 vs L3 — tại sao Netflix giới hạn Chrome ở 720p
- [ ] 🔴 Sketch EME license flow: encrypted event → CDM → license server → session.update
- [ ] 🔴 Design TikTok feed: element pool, preload strategy, memory budget, IntersectionObserver
- [ ] 🔴 Cost analysis: 100K viewers × 1hr — HLS CDN vs WebRTC SFU
- [ ] 🔴 Giải thích CMAF và tại sao nó giúp "encode once, serve both HLS và DASH"
- [ ] 🔴 Twitch's architecture: RTMP ingest → transcode → HLS CDN → LL-HLS low-latency mode

---

> **🇻🇳 Tóm tắt cho interview**: Streaming là bài toán về trade-off — latency vs cost vs scale. Junior biết HLS/DASH là gì. Mid biết MSE, hls.js, autoplay policies. Senior biết DRM/EME Widevine L1 vs L3, LL-HLS vs WebRTC cost analysis, và design TikTok feed với memory management. Câu trả lời "dùng WebRTC cho livestream" mà không đề cập đến cost ($8000/hr ở 100K viewers) là red flag cho Senior role tại Shopee, Zalo, hay Grab.
