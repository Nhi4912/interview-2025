# Information Theory / Lý Thuyết Thông Tin

> **Track**: Shared | **Difficulty**: 🔴 Senior
> **See also**: [Complexity Analysis](./complexity-analysis.md) | [Computation Theory](./08-computation-theory.md)

## Mathematical Foundations / Nền Tảng Toán Học

## Real-World Scenario / Tình Huống Thực Tế

**AI Engineer tại VinAI:** Khi fine-tuning language model cho Vietnamese, engineer gặp câu hỏi: "Tại sao cross-entropy loss là default cho classification?" Câu trả lời nằm trong Information Theory: cross-entropy đo _khoảng cách_ giữa predicted distribution và true distribution. Minimize cross-entropy = maximize likelihood = model học đúng. Không biết entropy, không hiểu tại sao loss function được thiết kế như vậy.

**Bài học:** Information Theory là nền tảng toán học của ML/AI, data compression (zip, WebP), và cryptography. Senior engineer trong AI/ML roles được expect biết entropy, mutual information, và KL divergence.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Entropy giống "mức độ bất ngờ" của thông tin. Tung đồng xu công bằng: kết quả = 1 bit information (50/50 surprise). Tung đồng xu giả luôn ra mặt ngửa: 0 bit information (không có gì bất ngờ). Gzip compress file tốt khi file có low entropy (nhiều patterns lặp lại) — không compress được file random (high entropy).

**English:** Information theory is the mathematical study of quantifying, storing, and communicating information, providing the theoretical foundation for data compression, error correction, and communication systems.

**Tiếng Việt:** Lý thuyết thông tin là nghiên cứu toán học về định lượng, lưu trữ và truyền thông tin, cung cấp nền tảng lý thuyết cho nén dữ liệu, sửa lỗi và hệ thống truyền thông.

## Concept Map / Bản Đồ Khái Niệm

```
    ┌─────────────────────────────────────┐
    │     INFORMATION THEORY              │
    │     Lý Thuyết Thông Tin             │
    └──────────────┬──────────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
  ┌─────────┐ ┌────────┐ ┌──────────┐
  │Entropy  │ │Channel │ │ Coding   │
  │H(X)     │ │Capacity│ │ Theory   │
  │Surprise │ │Shannon │ │Huffman   │
  └────┬────┘ └────┬───┘ └────┬─────┘
       │           │          │
       ▼           ▼          ▼
  ┌─────────┐ ┌────────┐ ┌──────────┐
  │Compress-│ │Error   │ │Crypto-   │
  │ion      │ │Correct.│ │graphy    │
  │ZIP,JPEG │ │Hamming │ │One-Time  │
  └─────────┘ └────────┘ └──────────┘
```

## Overview / Tổng Quan

| #   | Concept                                | Vai trò                                                         | Interview Weight       |
| --- | -------------------------------------- | --------------------------------------------------------------- | ---------------------- |
| 1   | **Shannon Entropy**                    | Đo lượng thông tin/uncertainty — nền tảng mọi thứ               | 🔴 Senior (ML context) |
| 2   | **Data Compression (Lossless)**        | Huffman, LZ77, entropy limit — ZIP/gzip                         | 🟡 Mid                 |
| 3   | **Data Compression (Lossy)**           | JPEG/MP3/H.264 — tradeoff quality vs size                       | 🟡 Mid                 |
| 4   | **Error Detection & Correction**       | Parity, CRC, Hamming, Reed-Solomon — network reliability        | 🟡 Mid                 |
| 5   | **Channel Capacity (Shannon-Hartley)** | Max reliable data rate = B·log₂(1+S/N) — communication limits   | 🔴 Senior              |
| 6   | **Coding Theory**                      | Kraft inequality, optimal codes, Hamming distance — code design | 🔴 Senior              |
| 7   | **Cryptographic Information Theory**   | Perfect secrecy, one-time pad, entropy of keys                  | 🔴 Senior              |

> **Mối liên hệ:** Entropy là đơn vị đo cơ bản → Compression cố gắng đạt entropy limit → Channel Capacity xác định tốc độ truyền tối đa → Error Correction thêm redundancy để truyền tin cậy → Coding Theory tối ưu hóa → Cryptography dùng entropy đảm bảo bảo mật.

## Table of Contents

1. [Information Theory Fundamentals](#information-theory-fundamentals)
2. [Entropy](#entropy)
3. [Data Compression](#data-compression)
4. [Error Detection and Correction](#error-detection-and-correction)
5. [Channel Capacity](#channel-capacity)
6. [Coding Theory](#coding-theory)
7. [Cryptographic Information Theory](#cryptographic-information-theory)
8. [Applications](#applications)

## Information Theory Fundamentals

### What is Information?

**Definition:** Reduction of uncertainty about a state or event

**Quantifying Information:**

```
Information content of event with probability p:
I(x) = -log₂(p)

Measured in bits (binary digits)

Examples:
Coin flip (p = 0.5):
I = -log₂(0.5) = 1 bit

Rolling 6 (p = 1/6):
I = -log₂(1/6) ≈ 2.58 bits

Certain event (p = 1):
I = -log₂(1) = 0 bits (no information)
```

**Properties:**

```
1. Rare events have more information
2. Certain events have zero information
3. Independent events: I(x,y) = I(x) + I(y)
4. Information is always non-negative
```

### Shannon's Theory

**Claude Shannon (1948):**

```
"A Mathematical Theory of Communication"
Founded information theory
Established fundamental limits

Key Contributions:
- Entropy definition
- Channel capacity theorem
- Source coding theorem
- Noisy channel coding theorem
```

**Fundamental Theorem:**

```
Information can be transmitted reliably over noisy channel
if transmission rate < channel capacity

Implications:
- Error-free communication possible
- Theoretical limits exist
- Optimal codes achievable
```

## Entropy

### Definition

**Shannon Entropy:**

```
Average information content
Measure of uncertainty
Expected value of information

Formula:
H(X) = -Σ p(x) log₂ p(x)

Where:
- H(X) is entropy
- p(x) is probability of event x
- Sum over all possible events
```

### Entropy Examples

**Fair Coin:**

```
Outcomes: {Heads, Tails}
Probabilities: p(H) = 0.5, p(T) = 0.5

H(X) = -[0.5 log₂(0.5) + 0.5 log₂(0.5)]
     = -[0.5(-1) + 0.5(-1)]
     = -[-0.5 - 0.5]
     = 1 bit

Maximum entropy for 2 outcomes
```

**Biased Coin:**

```
Outcomes: {Heads, Tails}
Probabilities: p(H) = 0.9, p(T) = 0.1

H(X) = -[0.9 log₂(0.9) + 0.1 log₂(0.1)]
     = -[0.9(-0.152) + 0.1(-3.322)]
     = -[-0.137 - 0.332]
     = 0.469 bits

Less entropy than fair coin
More predictable
```

**Die Roll:**

```
Outcomes: {1, 2, 3, 4, 5, 6}
Probabilities: p(i) = 1/6 for all i

H(X) = -6 × (1/6) log₂(1/6)
     = -6 × (1/6) × (-2.585)
     = 2.585 bits

Need ~2.585 bits to represent die roll
```

### Properties of Entropy

**Maximum Entropy:**

```
Occurs when all outcomes equally likely
Uniform distribution
Maximum uncertainty

For n outcomes:
H_max = log₂(n)

Examples:
2 outcomes: H_max = 1 bit
4 outcomes: H_max = 2 bits
8 outcomes: H_max = 3 bits
```

**Minimum Entropy:**

```
Occurs when one outcome certain
H_min = 0 bits
No uncertainty
```

**Joint Entropy:**

```
Entropy of two variables together
H(X,Y) = -ΣΣ p(x,y) log₂ p(x,y)

Properties:
H(X,Y) ≤ H(X) + H(Y)
Equality when X and Y independent
```

**Conditional Entropy:**

```
Entropy of X given Y known
H(X|Y) = H(X,Y) - H(Y)

Interpretation:
Remaining uncertainty in X after observing Y

Properties:
H(X|Y) ≤ H(X)
Knowing Y reduces uncertainty
```

**Mutual Information:**

```
Information shared between variables
I(X;Y) = H(X) - H(X|Y)
       = H(Y) - H(Y|X)
       = H(X) + H(Y) - H(X,Y)

Interpretation:
Reduction in uncertainty about X from observing Y

Properties:
I(X;Y) ≥ 0
I(X;Y) = 0 when independent
I(X;Y) = I(Y;X) (symmetric)
```

## Data Compression

### Lossless Compression

**Definition:** Original data perfectly reconstructed

**Huffman Coding:**

```
Variable-length encoding
Frequent symbols get shorter codes
Optimal prefix-free code

Algorithm:
1. Count symbol frequencies
2. Build binary tree (least frequent combined first)
3. Assign codes (left=0, right=1)

Example:
Text: "AAAAABBBCCD"
Frequencies: A=5, B=3, C=2, D=1

Tree:
        (11)
       /    \
      A(5)  (6)
           /   \
         B(3)  (3)
              /   \
            C(2)  D(1)

Codes:
A: 0 (1 bit)
B: 10 (2 bits)
C: 110 (3 bits)
D: 111 (3 bits)

Original: 11 chars × 8 bits = 88 bits
Compressed: 5×1 + 3×2 + 2×3 + 1×3 = 20 bits
Compression ratio: 88/20 = 4.4:1
```

**Run-Length Encoding:**

```
Replace repeated sequences
Simple but effective for repetitive data

Example:
Original: "AAAAAABBBCCD"
Encoded: "6A3B2C1D"

Works well for:
- Images with solid colors
- Fax transmissions
- Simple graphics
```

**LZ77/LZ78 (Lempel-Ziv):**

```
Dictionary-based compression
Replace repeated sequences with references
Used in ZIP, GZIP, PNG

LZ77:
- Sliding window
- Look back for matches
- (distance, length, next char)

LZ78:
- Build dictionary
- Reference dictionary entries
- More memory efficient
```

### Lossy Compression

**Definition:** Some information lost, cannot perfectly reconstruct

**JPEG (Images):**

```
Discrete Cosine Transform (DCT)
Quantization (loses information)
Huffman coding

Process:
1. Convert RGB to YCbCr
2. Divide into 8×8 blocks
3. Apply DCT
4. Quantize coefficients
5. Huffman encode

Quality vs Size:
- High quality: Larger file, less loss
- Low quality: Smaller file, more loss
```

**MP3 (Audio):**

```
Psychoacoustic model
Remove inaudible frequencies
Perceptual coding

Process:
1. Divide into frames
2. Apply FFT
3. Psychoacoustic analysis
4. Quantization
5. Huffman coding

Bitrates:
- 320 kbps: Near CD quality
- 192 kbps: Good quality
- 128 kbps: Acceptable quality
- 64 kbps: Low quality
```

## Error Detection and Correction

### Error Detection

**Parity Bit:**

```
Single bit added for error detection
Even or odd parity

Even Parity Example:
Data: 1011010 (4 ones)
Parity: 0 (make even number of ones)
Transmitted: 10110100

Detection:
- Count ones
- If odd, error detected
- Cannot correct
- Cannot detect even number of errors
```

**Checksum:**

```
Sum of data values
Detect errors in transmission

Simple Checksum:
Data: [25, 30, 45, 50]
Checksum: (25 + 30 + 45 + 50) mod 256 = 150

Verification:
Received: [25, 30, 45, 50, 150]
Sum: 25 + 30 + 45 + 50 = 150
Match: No error detected
```

**Cyclic Redundancy Check (CRC):**

```
Polynomial division
Powerful error detection
Used in Ethernet, ZIP, PNG

Process:
1. Treat data as polynomial
2. Divide by generator polynomial
3. Remainder is CRC
4. Append to data

Properties:
- Detects all single-bit errors
- Detects all double-bit errors
- Detects odd number of errors
- Detects burst errors up to length of CRC
```

### Error Correction

**Hamming Code:**

```
Add redundant bits for error correction
Can correct single-bit errors
Can detect two-bit errors

Hamming(7,4):
- 4 data bits
- 3 parity bits
- Total: 7 bits

Parity bit positions: powers of 2 (1, 2, 4, 8, ...)
Data bit positions: remaining positions

Example:
Position: 1 2 3 4 5 6 7
Type:     P P D P D D D
          1 2 1 4 2 3 4

P1 checks positions: 1, 3, 5, 7
P2 checks positions: 2, 3, 6, 7
P4 checks positions: 4, 5, 6, 7
```

**Reed-Solomon Codes:**

```
Block-based error correction
Used in CDs, DVDs, QR codes
Can correct multiple errors

Characteristics:
- Corrects burst errors
- Widely used
- Computationally intensive

Applications:
- CD/DVD error correction
- QR codes
- Satellite communication
- Deep space communication
```

## Channel Capacity

### Shannon-Hartley Theorem

**Channel Capacity:**

```
C = B log₂(1 + S/N)

Where:
- C: Channel capacity (bits/second)
- B: Bandwidth (Hz)
- S/N: Signal-to-noise ratio

Example:
Bandwidth: 3000 Hz
SNR: 30 dB = 1000 (power ratio)

C = 3000 × log₂(1 + 1000)
  = 3000 × log₂(1001)
  = 3000 × 9.97
  ≈ 30,000 bits/second

Maximum theoretical data rate
```

**Implications:**

```
1. Capacity increases with bandwidth
2. Capacity increases with SNR
3. Cannot exceed capacity reliably
4. Trade-off between rate and reliability
```

### Nyquist Theorem

**Noiseless Channel:**

```
C = 2B log₂(M)

Where:
- C: Channel capacity
- B: Bandwidth
- M: Number of signal levels

Example:
Bandwidth: 3000 Hz
Signal levels: 4

C = 2 × 3000 × log₂(4)
  = 6000 × 2
  = 12,000 bits/second

Theoretical maximum for noiseless channel
```

## Coding Theory

### Source Coding

**Purpose:** Compress data efficiently

**Kraft Inequality:**

```
For prefix-free code with lengths l₁, l₂, ..., lₙ:
Σ 2^(-lᵢ) ≤ 1

Determines if code lengths are valid

Example:
Lengths: 1, 2, 3, 3
2^(-1) + 2^(-2) + 2^(-3) + 2^(-3) = 0.5 + 0.25 + 0.125 + 0.125 = 1
Valid prefix-free code
```

**Optimal Code Length:**

```
For symbol with probability p:
Optimal length ≈ -log₂(p)

Example:
p = 0.5: length ≈ 1 bit
p = 0.25: length ≈ 2 bits
p = 0.125: length ≈ 3 bits
```

### Channel Coding

**Purpose:** Add redundancy for error correction

**Code Rate:**

```
R = k/n

Where:
- k: Information bits
- n: Total bits (information + redundancy)
- R: Code rate (efficiency)

Example:
Hamming(7,4):
k = 4, n = 7
R = 4/7 ≈ 0.57

Lower rate = more redundancy = better error correction
```

**Hamming Distance:**

```
Number of positions where symbols differ

Example:
x = 1011010
y = 1001001
Hamming distance = 2 (positions 3 and 5)

Properties:
- d(x,y) ≥ 0
- d(x,y) = 0 iff x = y
- d(x,y) = d(y,x)
- d(x,z) ≤ d(x,y) + d(y,z)

Error Detection:
Minimum distance d can detect d-1 errors

Error Correction:
Minimum distance d can correct ⌊(d-1)/2⌋ errors
```

## Applications

### Data Compression

**Text Compression:**

```
Huffman coding
LZ77/LZ78
Arithmetic coding

Applications:
- ZIP files
- GZIP compression
- Text file compression
```

**Image Compression:**

```
Lossless:
- PNG (LZ77 + filters)
- GIF (LZW)

Lossy:
- JPEG (DCT + quantization)
- WebP (VP8 + prediction)
```

**Video Compression:**

```
Temporal compression (between frames)
Spatial compression (within frames)

Codecs:
- H.264/AVC
- H.265/HEVC
- VP9
- AV1
```

### Communication Systems

**Digital Communication:**

```
Source → Encoder → Channel → Decoder → Destination
           ↑                      ↑
        Compression          Error Correction

Information theory provides:
- Optimal compression limits
- Channel capacity limits
- Error correction capabilities
```

**Network Protocols:**

```
TCP:
- Error detection (checksum)
- Error correction (retransmission)
- Flow control

UDP:
- Error detection (checksum)
- No error correction
- Lower overhead
```

### Cryptography

**Perfect Secrecy:**

```
Shannon's theorem:
Perfect secrecy requires key length ≥ message length

One-Time Pad:
- Key as long as message
- Key used only once
- XOR operation
- Perfectly secure

Practical Limitation:
- Key distribution problem
- Key length requirement
- Not practical for most applications
```

**Information-Theoretic Security:**

```
Security based on information theory
Not computational complexity
Unconditionally secure

Examples:
- One-time pad
- Secret sharing schemes
- Quantum cryptography
```

## Interview Questions

**🟢 [Junior] Q: What is entropy in information theory?**

A: Entropy measures average information content or uncertainty. Formula: H(X) = -Σ p(x) log₂ p(x). Higher entropy means more uncertainty, more information per symbol. Fair coin has 1 bit entropy (maximum for 2 outcomes). Biased coin has less. Used to determine optimal compression and channel capacity.

**🔴 [Senior] Q: Explain Shannon's channel capacity theorem.**

A: Channel capacity C = B log₂(1 + S/N), where B is bandwidth and S/N is signal-to-noise ratio. Represents maximum reliable data rate. Cannot exceed capacity without errors. Increasing bandwidth or SNR increases capacity. Fundamental limit for communication systems.

**🟢 [Junior] Q: What's the difference between lossless and lossy compression?**

A: Lossless preserves all information, perfect reconstruction (ZIP, PNG, FLAC). Lossy discards some information, cannot perfectly reconstruct (JPEG, MP3, H.264). Lossless for text and data, lossy for media where some loss acceptable. Lossy achieves higher compression ratios.

**🟡 [Mid] Q: How does Huffman coding work?**

A: Variable-length encoding where frequent symbols get shorter codes. Build binary tree from frequencies (combine least frequent), assign codes (left=0, right=1). Optimal prefix-free code. Achieves compression by using fewer bits for common symbols. Used in JPEG, MP3, ZIP.

**🟡 [Mid] Q: What is Hamming distance and why is it important?**

A: Number of positions where two sequences differ. Important for error detection/correction. Minimum distance d in code can detect d-1 errors and correct ⌊(d-1)/2⌋ errors. Used to design error-correcting codes. Higher distance means better error correction but more redundancy.

---

[← Back to Software Engineering](./08-computation-theory.md) | [Next: Discrete Mathematics →](./08-computation-theory.md)

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: Shannon Entropy

🧠 **Memory Hook:** "Entropy = surprise trung bình — đồng xu fair = 1 bit surprise, đồng xu giả = 0 bit (không bất ngờ)"

**Why exists (3 levels):**

- **Level 1:** Đo lường "lượng thông tin" — cần bao nhiêu bit để encode?
- **Level 2:** Entropy limit = giới hạn nén tối đa. Không compression algorithm nào vượt H(X) bits/symbol.
- **Level 3:** Cross-entropy loss trong ML = entropy + KL divergence. Minimize CE = model học đúng distribution. Temperature LLM: T→0 = entropy→0 (deterministic), T→∞ = max entropy (random).

**Layer 1 — Analogy:**
Entropy giống "mức bất ngờ trung bình" khi mở thư. Thư từ spam folder: không bất ngờ (low entropy). Thư từ người lạ: rất bất ngờ (high entropy). Gzip nén tốt spam (patterns lặp) nhưng không nén được random data.

**Layer 2 — Mechanics:**

```
Shannon Entropy:
  H(X) = -Σ p(x) × log₂(p(x))   [bits]

  Fair coin: H = -(0.5×log₂0.5 + 0.5×log₂0.5) = 1 bit
  Biased 90/10: H = -(0.9×log₂0.9 + 0.1×log₂0.1) ≈ 0.47 bits
  n uniform outcomes: H = log₂(n)

Related measures:
  Joint:       H(X,Y) = -ΣΣ p(x,y) log₂ p(x,y)
  Conditional: H(X|Y) = H(X,Y) - H(Y)
  Mutual info: I(X;Y) = H(X) - H(X|Y) = H(X) + H(Y) - H(X,Y)

  ┌────────────────────────────────────┐
  │         H(X,Y)                     │
  │  ┌──────┐         ┌──────┐        │
  │  │ H(X) │ I(X;Y)  │ H(Y) │        │
  │  │      │◄──────►│      │        │
  │  └──────┘         └──────┘        │
  └────────────────────────────────────┘

ML Applications:
  Cross-entropy: H(p,q) = -Σ p(x) log₂ q(x)
  KL divergence: D_KL(p||q) = H(p,q) - H(p) ≥ 0
  Classification loss: minimize CE ≡ minimize KL to true dist
```

**Layer 3 — Edge Cases:**

- Entropy is 0 only when distribution is deterministic (one outcome p=1).
- Maximum entropy = uniform distribution = log₂(n) bits for n outcomes.
- Differential entropy (continuous) can be negative — unlike discrete.
- Cross-entropy asymmetric: H(p,q) ≠ H(q,p). Order matters in KL divergence.

| Sai lầm                                     | Tại sao sai                                             | Đúng là                                                                       |
| ------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| "Entropy = disorder" (physics)              | Shannon entropy ≠ thermodynamic entropy exactly         | Shannon entropy = average information content / uncertainty                   |
| "Low entropy = bad"                         | Depends on context: low entropy data → compresses well  | Low entropy in crypto keys = bad (predictable), in data = good (compressible) |
| "Cross-entropy và KL divergence giống nhau" | CE = H(p) + D_KL(p\|\|q), includes entropy of true dist | CE minimization ≡ KL minimization (vì H(p) constant during training)          |

🎯 **Interview Pattern:** "Tại sao cross-entropy loss cho classification?" → CE đo khoảng cách predicted vs true distribution → minimize = model learns correct dist.

🔗 **Knowledge Chain:** Entropy → Compression limits → Cross-entropy loss → KL divergence → LLM temperature → Decision trees (information gain)

---

### Concept 2: Data Compression (Lossless)

🧠 **Memory Hook:** "Huffman = frequent gets short code (A:0, B:10, C:110) — LZ77 = 'seen this before, copy from position X, length Y'"

**Why exists (2 levels):**

- **Level 1:** Reduce data size without losing information → ZIP, gzip, PNG
- **Level 2:** Entropy H(X) = theoretical minimum bits/symbol. Huffman approaches it. LZ77 handles patterns across symbols.

**Layer 1 — Analogy:**
Huffman giống viết tắt: từ hay dùng ("the"→"t", "and"→"&") dùng ký hiệu ngắn, từ hiếm giữ nguyên. LZ77 giống "xem lại 5 dòng trước, dòng này giống dòng 3 → copy".

**Layer 2 — Mechanics:**

```
Huffman Coding:
  1. Count frequency: A=5, B=3, C=2, D=1
  2. Build tree (combine least frequent):
         (11)
        /    \
      A(5)   (6)
            /   \
          B(3)  (3)
               /   \
             C(2)  D(1)
  3. Assign codes: A=0, B=10, C=110, D=111
  4. Optimal prefix-free code (no code is prefix of another)

  Compression: 11 chars × 8 bits = 88 → 5+6+6+3 = 20 bits
  Ratio: 4.4:1

LZ77 (sliding window):
  "ABCABCABC" → "ABC" + (back 3, length 6)
  Used in: ZIP, GZIP, PNG (deflate = LZ77 + Huffman)

Kraft Inequality: Σ 2^(-lᵢ) ≤ 1
  Valid prefix-free code iff Kraft satisfied

Entropy limit: average code length ≥ H(X)
  Huffman achieves H(X) ≤ L < H(X) + 1
```

**Layer 3 — Edge Cases:**

- Huffman is optimal for integer-length codes only. Arithmetic coding achieves closer to entropy.
- LZ77 window size tradeoff: larger window = better compression, more memory.
- Already-compressed data (JPEG, MP3) won't compress further — entropy already near minimum.

| Sai lầm                              | Tại sao sai                                                            | Đúng là                                                    |
| ------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| "Gzip compress random data well"     | Random = max entropy → no patterns → can't compress                    | Gzip effective only when entropy < max (patterns exist)    |
| "Huffman always best lossless"       | Huffman optimal for symbol-by-symbol, arithmetic coding better overall | Arithmetic coding closer to entropy limit; modern uses ANS |
| "Nén file ZIP rồi nén lần 2 nhỏ hơn" | First ZIP already near entropy limit                                   | Double compression may increase size (overhead > savings)  |

🎯 **Interview Pattern:** "How does gzip work?" → LZ77 (dictionary) + Huffman (variable length) = Deflate algorithm.

🔗 **Knowledge Chain:** Entropy → Huffman/LZ77 → Deflate (gzip) → Network transfer optimization → CDN compression

---

### Concept 3: Data Compression (Lossy)

🧠 **Memory Hook:** "Lossy = bỏ thông tin human không nhận ra — JPEG bỏ high-freq color, MP3 bỏ inaudible sound"

**Why exists (2 levels):**

- **Level 1:** Media files quá lớn cho lossless → bỏ thông tin không quan trọng
- **Level 2:** Psychoacoustic/psychovisual models: human perception has limits → exploit them

**Layer 1 — Analogy:**
Như in ảnh 300 DPI vs 72 DPI — mắt thường không phân biệt trên screen. Lossy compression bỏ "detail mắt không thấy" để giảm size 10-100x.

**Layer 2 — Mechanics:**

```
JPEG Pipeline:
  RGB → YCbCr (luma/chroma separation)
  → 8×8 blocks → DCT (frequency domain)
  → Quantize (LOSSY step — discard high freq)
  → Huffman encode

  Quality slider controls quantization matrix
  Q=100: minimal loss, large file
  Q=75: balanced
  Q=30: visible artifacts, small file

MP3 Pipeline:
  Audio → FFT → Psychoacoustic model
  → Remove masked frequencies (LOSSY)
  → Quantize → Huffman encode

  320kbps ≈ CD quality, 128kbps = acceptable

Video (H.264/H.265):
  I-frames: full image (JPEG-like)
  P-frames: delta from previous
  B-frames: delta from prev + next
  → Temporal redundancy removal
```

**Layer 3 — Edge Cases:**

- Re-encoding lossy format compounds quality loss (generation loss).
- WebP and AVIF outperform JPEG at same quality — modern codecs with better prediction.
- Perceptual quality metrics (SSIM, VMAF) better than PSNR for measuring loss.

| Sai lầm                                  | Tại sao sai                                          | Đúng là                                                           |
| ---------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| "JPEG lossless nếu quality=100"          | Q=100 still quantizes, just minimally                | True lossless: PNG, TIFF. JPEG always lossy                       |
| "MP3 320kbps = CD quality"               | Close but not identical — masked frequencies removed | Audiophile: FLAC lossless. Most people: 320kbps indistinguishable |
| "Convert PNG→JPEG→PNG restores original" | JPEG step discards data permanently                  | Lossy is one-way — original information lost forever              |

🎯 **Interview Pattern:** "Trade-off image quality vs bandwidth?" → JPEG quality slider → WebP/AVIF modern alternatives → CDN auto-optimization.

🔗 **Knowledge Chain:** Psychoacoustic model → DCT/FFT → Quantization → Modern codecs (WebP, AV1) → CDN optimization → UX performance

---

### Concept 4: Error Detection & Correction

🧠 **Memory Hook:** "Parity = count 1s (detect 1 error), CRC = polynomial division (detect bursts), Hamming = locate & fix 1 error"

**Why exists (2 levels):**

- **Level 1:** Data corruption during transmission (network, disk) → need detection + correction
- **Level 2:** Tradeoff redundancy vs reliability: more parity bits = better correction but lower throughput

**Layer 1 — Analogy:**
Parity giống "đếm lại tiền": nếu tổng lẻ khi lẽ ra chẵn → có sai. CRC giống "checksum phức tạp" phát hiện nhiều lỗi. Hamming giống "mã vạch" — không chỉ biết sai mà còn biết sai ở ĐÂU → sửa được.

**Layer 2 — Mechanics:**

```
Error Detection:
  Parity bit: add 1 bit, count ones
    Detects: 1-bit error
    Misses: 2-bit errors (cancel out)

  CRC (Cyclic Redundancy Check):
    Polynomial division → remainder = CRC
    Used in: Ethernet, ZIP, PNG
    Detects: all 1-bit, all 2-bit, all odd, burst up to CRC length

Error Correction:
  Hamming(7,4): 4 data + 3 parity = 7 bits
    Parity positions: 1, 2, 4 (powers of 2)
    Each checks specific bit positions
    Syndrome → identifies error position → flip to correct

    Hamming distance d → detect d-1, correct ⌊(d-1)/2⌋

  Reed-Solomon: block-based, corrects burst errors
    Used in: CD/DVD, QR codes, satellite
    Can correct t errors with 2t redundancy symbols
```

**Layer 3 — Edge Cases:**

- Hamming code can only correct 1-bit errors. For multi-bit: need stronger codes (BCH, Reed-Solomon).
- TCP uses checksum (weak detection) + retransmission (correction). UDP has checksum only.
- Real-world: ECC memory (SECDED — single error correct, double error detect).

| Sai lầm                                   | Tại sao sai                                                  | Đúng là                                              |
| ----------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| "Checksum = CRC"                          | Checksum simple sum, CRC polynomial division (much stronger) | CRC detects more error patterns than simple checksum |
| "Hamming code fix mọi lỗi"                | Hamming(7,4) chỉ correct 1-bit, detect 2-bit                 | Multi-bit correction cần Reed-Solomon hoặc BCH       |
| "TCP already handles errors, no need ECC" | TCP retransmits, but slow. ECC corrects without retransmit   | ECC for low-latency (memory, disk), TCP for network  |

🎯 **Interview Pattern:** "QR code bị che 30% vẫn scan được?" → Reed-Solomon error correction → can lose up to 30% codewords → design for reliability.

🔗 **Knowledge Chain:** Parity → CRC → Hamming → Reed-Solomon → Network protocols (TCP/UDP) → Storage reliability → QR codes

---

### Concept 5: Channel Capacity (Shannon-Hartley)

🧠 **Memory Hook:** "C = B × log₂(1 + SNR) — bandwidth × signal quality = max reliable speed. Noise limits everything."

**Why exists (2 levels):**

- **Level 1:** Xác định tốc độ truyền tin TỐI ĐA qua kênh có nhiễu — giới hạn vật lý
- **Level 2:** Giải thích tại sao 5G nhanh hơn 4G (wider bandwidth), tại sao fiber > copper (higher SNR)

**Layer 1 — Analogy:**
Channel capacity giống "đường cao tốc": bandwidth = số làn (rộng hơn = nhiều xe hơn), SNR = chất lượng mặt đường (tốt hơn = xe chạy nhanh hơn). Shannon nói: dù tối ưu thế nào, không vượt quá capacity.

**Layer 2 — Mechanics:**

```
Shannon-Hartley Theorem:
  C = B × log₂(1 + S/N)   [bits/second]

  B = bandwidth (Hz)
  S/N = signal-to-noise ratio (power)

  Example: telephone line
    B = 3000 Hz, SNR = 30 dB = 1000
    C = 3000 × log₂(1001) ≈ 30,000 bps

Nyquist (noiseless):
  C = 2B × log₂(M)
  M = number of signal levels

Implications:
  1. More bandwidth → more capacity (linear)
  2. More SNR → more capacity (logarithmic)
  3. CANNOT exceed C reliably (fundamental law)
  4. Error-free transmission possible if rate < C
     (with proper coding — Shannon's promise)
```

**Layer 3 — Edge Cases:**

- Shannon limit is theoretical — practical systems achieve 90-95% (turbo codes, LDPC).
- SNR in dB: 10 dB = 10x, 20 dB = 100x, 30 dB = 1000x power ratio.
- 5G mmWave: huge bandwidth (GHz) but lower range/SNR → net capacity depends on environment.

| Sai lầm                                | Tại sao sai                                       | Đúng là                                                               |
| -------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| "Thêm bandwidth = double speed always" | Capacity = B × log₂(1+SNR), SNR also matters      | Bandwidth is linear factor, but SNR is logarithmic                    |
| "5G always faster than 4G"             | 5G mmWave high bandwidth but low range, SNR drops | Depends on distance, obstacles — sub-6GHz 5G similar to 4G+           |
| "Perfect transmission possible"        | Shannon says possible IF rate < capacity          | Need proper error-correcting codes; raw transmission will have errors |

🎯 **Interview Pattern:** "Why does WiFi slow down with distance?" → SNR decreases with distance → capacity drops → throughput falls.

🔗 **Knowledge Chain:** Shannon-Hartley → Channel coding → Network bandwidth → CDN optimization → System design capacity planning

---

### Concept 6: Coding Theory

🧠 **Memory Hook:** "Source coding = compress (remove redundancy), Channel coding = protect (add redundancy). Kraft inequality = valid code check."

**Why exists (2 levels):**

- **Level 1:** Bridge giữa lý thuyết (entropy, capacity) và thực tế (how to build actual codes)
- **Level 2:** Kraft inequality ensures code is decodable, Hamming distance determines error correction capability

**Layer 1 — Analogy:**
Source coding giống "rút gọn bài viết" (loại bỏ lặp). Channel coding giống "thêm backup" (ghi 2 bản). Kraft inequality giống "quy tắc chấm câu" — đảm bảo decode không nhập nhằng.

**Layer 2 — Mechanics:**

```
Source Coding (compression):
  Kraft Inequality: Σ 2^(-lᵢ) ≤ 1
    Valid prefix-free code iff satisfied
    Example: lengths {1,2,3,3} → 0.5+0.25+0.125+0.125 = 1 ✓

  Optimal code length for symbol with prob p:
    l ≈ -log₂(p)  → H(X) ≤ avg length < H(X) + 1

Channel Coding (error protection):
  Code rate R = k/n (information bits / total bits)
    Hamming(7,4): R = 4/7 ≈ 0.57
    Lower R = more protection but less throughput

  Hamming Distance:
    d(x,y) = positions where x ≠ y
    Min distance d in code:
      Detect: d-1 errors
      Correct: ⌊(d-1)/2⌋ errors

    Hamming(7,4): min distance = 3
    → detect 2, correct 1
```

**Layer 3 — Edge Cases:**

- Arithmetic coding bypasses Kraft: encodes entire message as single fraction, achieving closer to entropy.
- LDPC (Low-Density Parity-Check) codes approach Shannon limit within 0.05 dB — near-optimal.
- Turbo codes (3G/4G) and polar codes (5G) are practical near-Shannon-limit codes.

| Sai lầm                                      | Tại sao sai                                                        | Đúng là                                                                |
| -------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| "More parity bits = always better"           | More redundancy = less throughput → tradeoff                       | Optimize: enough protection for channel quality, no more               |
| "Hamming distance only for error correction" | Also used in: DNA analysis, spelling correction, ML similarity     | General metric for comparing sequences                                 |
| "Source coding + channel coding independent" | Shannon's separation theorem: can optimize separately without loss | Separation is optimal — but joint coding can have practical advantages |

🎯 **Interview Pattern:** "Design error-resilient protocol?" → Determine channel quality → Choose code rate → Balance correction vs throughput.

🔗 **Knowledge Chain:** Kraft inequality → Huffman/Arithmetic → Channel coding → LDPC/Turbo/Polar → 5G/Satellite → Reliable systems

---

### Concept 7: Cryptographic Information Theory

🧠 **Memory Hook:** "Perfect secrecy: key ≥ message (one-time pad). Practical crypto: computationally hard, not information-theoretically perfect."

**Why exists (2 levels):**

- **Level 1:** Shannon proved: perfect secrecy requires key ≥ message length → one-time pad
- **Level 2:** Practical crypto (AES, RSA) relies on computational hardness, not information-theoretic security → if P=NP, all break

**Layer 1 — Analogy:**
One-time pad giống "mật thư 1 lần": mỗi tin nhắn cần chìa khóa dài bằng tin nhắn, dùng 1 lần. AES giống "khóa cửa tốt": không phải impossible phá, nhưng cần hàng tỷ năm → "đủ an toàn" thực tế.

**Layer 2 — Mechanics:**

```
Perfect Secrecy (Shannon, 1949):
  H(M|C) = H(M)  → ciphertext reveals NOTHING about message
  Requirement: |K| ≥ |M|  → key at least as long as message

  One-Time Pad:
    C = M ⊕ K (XOR)
    M = C ⊕ K
    Properties: perfectly secure, key = message length, used once
    Problem: key distribution (need secure channel for key!)

Practical Crypto (computational security):
  AES: 2^128 operations to brute force → secure for decades
  RSA: based on factoring difficulty (likely NP-intermediate)

  NOT information-theoretically secure:
    Given infinite compute → all practical crypto breaks
    Security relies on P ≠ NP assumption

Entropy in Crypto:
  Key entropy: random 128-bit key = 128 bits entropy
  Low-entropy password "password123" ≈ few bits entropy
  → Vulnerable to dictionary attack
  Key derivation: PBKDF2/bcrypt stretch low-entropy input
```

**Layer 3 — Edge Cases:**

- Quantum computing: Shor's algorithm breaks RSA (factoring in poly time). AES-256 still safe (Grover halves key strength).
- Quantum Key Distribution (QKD): information-theoretically secure key exchange (detect eavesdropping).
- Entropy sources: /dev/urandom, hardware RNG crucial — deterministic PRNG predictable.

| Sai lầm                                | Tại sao sai                                           | Đúng là                                                              |
| -------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| "AES unbreakable"                      | Computationally secure, not information-theoretically | AES practical security: 2^128 brute force infeasible, not impossible |
| "Longer password = always more secure" | "aaaa...a" (100 chars) has low entropy                | Entropy matters: random 12-char > pattern 100-char                   |
| "One-time pad là giải pháp hoàn hảo"   | Key distribution problem — cần secure channel cho key | Perfect secrecy nhưng impractical for most use cases                 |

🎯 **Interview Pattern:** "Why is random key generation critical?" → Low entropy keys → predictable → dictionary attack → need /dev/urandom + key stretching.

🔗 **Knowledge Chain:** Shannon perfect secrecy → Computational security → Key entropy → P≠NP assumption → Quantum threats → Post-quantum crypto

---

## Interview Q&A Summary / Tổng Hợp Câu Hỏi Phỏng Vấn

| #   | Question                               | Difficulty | Section        | Key Signal                                           |
| --- | -------------------------------------- | ---------- | -------------- | ---------------------------------------------------- |
| 1   | What is entropy in information theory? | 🟢         | Entropy        | H(X) = avg surprise, max when uniform                |
| 2   | Shannon's channel capacity theorem?    | 🔴         | Channel        | C = B·log₂(1+SNR), fundamental limit                 |
| 3   | Lossless vs lossy compression?         | 🟢         | Compression    | Lossless = perfect reconstruct, lossy = higher ratio |
| 4   | How does Huffman coding work?          | 🟡         | Compression    | Freq→tree→variable-length prefix code                |
| 5   | Hamming distance importance?           | 🟡         | Error Correct  | d→detect d-1, correct ⌊(d-1)/2⌋                      |
| 6   | Entropy in ML (cross-entropy loss)?    | 🔴         | ML Application | CE = H(p,q), minimize = learn true distribution      |

**Distribution:** 🟢 2 | 🟡 2 | 🔴 2 — Senior-weighted (theoretical file).

---

## ⚡ Cold Call Simulation / Mô Phỏng Cold Call

> **Interviewer:** "Tại sao cross-entropy là default loss function cho classification, không phải MSE?"

**30-second answer:**
"Cross-entropy đo khoảng cách giữa predicted distribution và true distribution. Minimize cross-entropy tương đương minimize KL divergence — model đang học phân phối đúng. MSE đo khoảng cách Euclidean, không phù hợp cho probability outputs — gradient MSE gần saturation rất nhỏ (vanishing gradient), trong khi CE gradient tỷ lệ thuận với error, giúp learn nhanh hơn."

> **Follow-up:** "Entropy liên quan gì đến LLM temperature?"

"Temperature scale logits trước softmax: T=1 giữ nguyên distribution, T→0 entropy→0 (argmax, deterministic), T→∞ entropy→max (uniform, random). Temperature controls 'creativity' by adjusting output entropy. Low T = confident/repetitive, high T = diverse/risky."

---

## Self-Check / Tự Kiểm Tra

| #   | Question                                                                            | Key Points                                                        |
| --- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | 🔍 **Retrieval:** Calculate entropy of fair coin, biased coin (90/10), and fair die | 1 bit, 0.47 bits, 2.58 bits                                       |
| 2   | 🎨 **Visual:** Draw Huffman tree for frequencies A=5, B=3, C=2, D=1                 | A=0, B=10, C=110, D=111, 20 bits total                            |
| 3   | 🛠️ **Application:** Tại sao gzip không nén được file random?                        | Random = max entropy, no patterns, already at theoretical minimum |
| 4   | 🐛 **Debug:** QR code bị che 30% vẫn đọc được — explain                             | Reed-Solomon error correction can recover up to 30% codewords     |
| 5   | 🎓 **Teach:** Explain to junior tại sao "temperature" trong LLM liên quan entropy   | T→0: entropy→0 (deterministic), T→∞: entropy→max (random)         |

💬 **Feynman Prompt:** Giải thích tại sao "temperature" trong LLM generation liên quan đến entropy — và temperature=0 (argmax) tương ứng với entropy bằng bao nhiêu? (Answer: 0 bits — no uncertainty, always pick highest probability token.)

---

## Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | Ngày   | Focus                                                      |
| ----- | ------ | ---------------------------------------------------------- |
| 1     | Day 1  | Đọc toàn bộ, làm Self-Check                                |
| 2     | Day 3  | Nhắc lại Entropy formula + Huffman tree construction       |
| 3     | Day 7  | Cold Call simulation + Channel Capacity + Error Correction |
| 4     | Day 14 | Giải thích Cross-entropy loss + LLM temperature cho bạn    |
| 5     | Day 30 | Mock interview: ML loss functions + compression tradeoffs  |

---

## Connections / Liên Kết

**Same-track (CS Fundamentals):**

- ⬅️ [Complexity Analysis](./complexity-analysis.md) — information-theoretic lower bounds (Ω(n log n) sorting)
- 🔗 [Computation Theory](./08-computation-theory.md) — both study fundamental limits of information processing
- 🔗 [Algorithms Theory](./algorithms-theory.md) — sorting lower bounds, compression algorithms
- 🔗 [Networking Theory](./networking-theory.md) — channel capacity, error detection in TCP/UDP
- 🔗 [Data Structures](./data-structures-theory.md) — Huffman tree, hash function entropy

**Cross-track:**

- ➡️ [ML Fundamentals](../06-ai-and-agents/01-ml-fundamentals.md) — entropy, cross-entropy loss, information gain
- 🔗 [Security Fundamentals](../04-security/01-security-fundamentals.md) — key entropy, perfect secrecy, crypto foundations
- 🔗 [BE: Networking](../../be-track/02-backend-knowledge/06-networking-go.md) — TCP checksums, error detection in practice
