# Information Theory / Lý Thuyết Thông Tin

> **Track**: Shared | **Difficulty**: 🔴 Senior
> **See also**: [Complexity Analysis](./complexity-analysis.md) | [Computation Theory](./08-computation-theory.md)

## Mathematical Foundations / Nền Tảng Toán Học

**English:** Information theory is the mathematical study of quantifying, storing, and communicating information, providing the theoretical foundation for data compression, error correction, and communication systems.

**Tiếng Việt:** Lý thuyết thông tin là nghiên cứu toán học về định lượng, lưu trữ và truyền thông tin, cung cấp nền tảng lý thuyết cho nén dữ liệu, sửa lỗi và hệ thống truyền thông.

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
