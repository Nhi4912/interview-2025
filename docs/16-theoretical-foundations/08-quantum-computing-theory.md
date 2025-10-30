# Quantum Computing Theory
## Foundations of Quantum Information and Computation

**English:** Quantum computing theory explores computation using quantum mechanical phenomena like superposition and entanglement, offering potential exponential speedups for certain problems and fundamentally different computational paradigms.

**Tiếng Việt:** Lý thuyết tính toán lượng tử khám phá tính toán sử dụng các hiện tượng cơ học lượng tử như chồng chất và vướng víu, cung cấp khả năng tăng tốc theo cấp số nhân cho một số vấn đề và các mô hình tính toán khác biệt cơ bản.

## Table of Contents
1. [Quantum Mechanics Foundations](#quantum-mechanics-foundations)
2. [Quantum Bits and Gates](#quantum-bits-and-gates)
3. [Quantum Circuits](#quantum-circuits)
4. [Quantum Algorithms](#quantum-algorithms)
5. [Quantum Complexity](#quantum-complexity)
6. [Quantum Error Correction](#quantum-error-correction)
7. [Quantum Cryptography](#quantum-cryptography)
8. [Quantum Information Theory](#quantum-information-theory)
9. [Quantum Machine Learning](#quantum-machine-learning)
10. [Physical Implementations](#physical-implementations)

## Quantum Mechanics Foundations

### Quantum States

**Qubit:**
Quantum bit - fundamental unit of quantum information.

**State Vector:**
|ψ⟩ = α|0⟩ + β|1⟩

Where α, β ∈ ℂ and |α|² + |β|² = 1.

**Bloch Sphere:**
Geometric representation of qubit state.
- North pole: |0⟩
- South pole: |1⟩
- Equator: Superposition states

**Multi-Qubit States:**
|ψ⟩ = Σᵢ αᵢ|i⟩ where i ranges over n-bit strings.

**Hilbert Space:**
2ⁿ-dimensional complex vector space for n qubits.

### Superposition

**Principle:**
Quantum system can be in multiple states simultaneously.

**Example:**
|ψ⟩ = (|0⟩ + |1⟩)/√2

Equal superposition of 0 and 1.

**Measurement:**
Collapses superposition to basis state.
- Probability of |0⟩: |α|²
- Probability of |1⟩: |β|²

**No-Cloning Theorem:**
Cannot create identical copy of unknown quantum state.

**Proof:**
Assume cloning operation U|ψ⟩|0⟩ = |ψ⟩|ψ⟩.
For orthogonal states, leads to contradiction.

### Entanglement

**Definition:**
Quantum correlation stronger than classical.

**Bell State:**
|Φ⁺⟩ = (|00⟩ + |11⟩)/√2

Cannot be written as tensor product of single-qubit states.

**EPR Paradox:**
Einstein-Podolsky-Rosen thought experiment.
- Spooky action at a distance
- Measurement on one qubit affects other
- No faster-than-light communication

**Bell's Inequality:**
Quantum mechanics violates classical bounds.

**CHSH Inequality:**
Classical: |E| ≤ 2
Quantum: |E| ≤ 2√2

**Applications:**
- Quantum teleportation
- Quantum cryptography
- Quantum algorithms

### Quantum Operations

**Unitary Evolution:**
U†U = UU† = I

Preserves norm (probability).

**Measurement:**
Projects state onto measurement basis.

**Projective Measurement:**
M = {Pₘ} where Pₘ† = Pₘ, Pₘ² = Pₘ, ΣPₘ = I

**POVM (Positive Operator-Valued Measure):**
More general measurement.
{Eₘ} where Eₘ ≥ 0, ΣEₘ = I

**Density Matrix:**
ρ = Σᵢ pᵢ|ψᵢ⟩⟨ψᵢ|

Describes mixed states (statistical mixtures).

## Quantum Bits and Gates

### Single-Qubit Gates

**Pauli Gates:**

**X (NOT):**
```
X = |0 1|
    |1 0|
```
Bit flip: X|0⟩ = |1⟩, X|1⟩ = |0⟩

**Y:**
```
Y = |0 -i|
    |i  0|
```

**Z:**
```
Z = |1  0|
    |0 -1|
```
Phase flip: Z|+⟩ = |-⟩

**Hadamard:**
```
H = 1/√2 |1  1|
         |1 -1|
```
Creates superposition: H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2

**Phase Gates:**

**S (Phase):**
```
S = |1 0|
    |0 i|
```

**T (π/8):**
```
T = |1    0   |
    |0 e^(iπ/4)|
```

**Rotation Gates:**
- Rₓ(θ): Rotation around X-axis
- Rᵧ(θ): Rotation around Y-axis
- Rᵤ(θ): Rotation around Z-axis

### Multi-Qubit Gates

**CNOT (Controlled-NOT):**
```
CNOT = |1 0 0 0|
       |0 1 0 0|
       |0 0 0 1|
       |0 0 1 0|
```

Flips target if control is |1⟩.

**Controlled-U:**
Applies U to target if control is |1⟩.

**SWAP:**
Exchanges two qubits.

**Toffoli (CCNOT):**
Three-qubit gate: flips target if both controls are |1⟩.

**Fredkin (CSWAP):**
Controlled-SWAP.

### Universal Gate Sets

**Definition:**
Set of gates that can approximate any unitary to arbitrary precision.

**Examples:**
- {H, T, CNOT}
- {H, S, T, CNOT}
- {Rᵧ(θ), CNOT} for any irrational θ/π

**Solovay-Kitaev Theorem:**
Efficient approximation of arbitrary unitaries.

**Complexity:**
O(log^c(1/ε)) gates for precision ε.

## Quantum Circuits

### Circuit Model

**Quantum Circuit:**
Sequence of quantum gates applied to qubits.

**Representation:**
- Horizontal lines: Qubits
- Boxes: Gates
- Time flows left to right

**Example - Bell State Preparation:**
```
|0⟩ ─H─●─
       │
|0⟩ ───⊕─
```

**Measurement:**
Represented by meter symbol.

**Classical Control:**
Double lines for classical bits.

### Circuit Complexity

**Depth:**
Number of time steps (parallel gates count as one).

**Size:**
Total number of gates.

**Width:**
Number of qubits.

**Trade-offs:**
- Shallow circuits: Less decoherence
- Deep circuits: More expressive

**Circuit Families:**
Infinite sequence of circuits for different input sizes.

### Quantum Parallelism

**Principle:**
Apply operation to superposition of all inputs simultaneously.

**Example:**
```
|ψ⟩ = 1/√2ⁿ Σₓ|x⟩
Apply f: |x⟩|0⟩ → |x⟩|f(x)⟩
Result: 1/√2ⁿ Σₓ|x⟩|f(x)⟩
```

**Challenge:**
Measurement collapses to single output.

**Solution:**
Quantum algorithms exploit interference.

## Quantum Algorithms

### Deutsch-Jozsa Algorithm

**Problem:**
Given f: {0,1}ⁿ → {0,1}, determine if f is constant or balanced.

**Classical:**
Requires 2ⁿ⁻¹ + 1 queries in worst case.

**Quantum:**
One query suffices.

**Algorithm:**
1. Prepare |+⟩⊗ⁿ|-⟩
2. Apply Uf (oracle)
3. Apply H⊗ⁿ
4. Measure

**Result:**
|0⟩⊗ⁿ if constant, otherwise balanced.

### Grover's Algorithm

**Problem:**
Search unsorted database of N items.

**Classical:**
O(N) queries required.

**Quantum:**
O(√N) queries.

**Algorithm:**
1. Initialize uniform superposition
2. Repeat O(√N) times:
   - Apply oracle (mark solution)
   - Apply diffusion operator
3. Measure

**Amplitude Amplification:**
Increases amplitude of marked states.

**Optimality:**
Proven optimal for unstructured search.

**Applications:**
- Database search
- Constraint satisfaction
- Optimization

### Shor's Algorithm

**Problem:**
Factor integer N.

**Classical:**
Best known: sub-exponential (not polynomial).

**Quantum:**
Polynomial time: O((log N)³).

**Algorithm:**
1. Choose random a < N
2. Use quantum period finding to find r where aʳ ≡ 1 (mod N)
3. If r even and aʳ/² ≢ -1 (mod N), compute gcd(aʳ/² ± 1, N)

**Quantum Fourier Transform:**
Key subroutine for period finding.

**Implications:**
- Breaks RSA cryptography
- Motivates post-quantum cryptography

### Quantum Simulation

**Problem:**
Simulate quantum systems.

**Classical:**
Exponential resources required.

**Quantum:**
Polynomial resources.

**Applications:**
- Chemistry
- Materials science
- Drug discovery

**Variational Quantum Eigensolver (VQE):**
Hybrid quantum-classical algorithm for ground state energy.

## Quantum Complexity

### Complexity Classes

**BQP (Bounded-Error Quantum Polynomial):**
Problems solvable by quantum computer in polynomial time with error ≤ 1/3.

**Relationships:**
P ⊆ BQP ⊆ PSPACE

**Open Questions:**
- BQP vs. NP
- BQP vs. PH (polynomial hierarchy)

**QMA (Quantum Merlin-Arthur):**
Quantum analog of NP.
- Verifier is quantum
- Witness is quantum state

**QCMA:**
Classical witness, quantum verifier.

### Quantum Advantage

**Quantum Supremacy:**
Quantum computer solves problem classical computer cannot (in reasonable time).

**Achieved:**
- Google's Sycamore (2019)
- Random circuit sampling
- 53 qubits, 200 seconds vs. 10,000 years

**Practical Quantum Advantage:**
Quantum computer solves useful problem faster than classical.

**Candidates:**
- Quantum simulation
- Optimization
- Machine learning

### Lower Bounds

**Quantum Query Complexity:**
Number of oracle queries required.

**Adversary Method:**
Technique for proving lower bounds.

**Polynomial Method:**
Uses degree of polynomial representing function.

**Examples:**
- Search: Ω(√N)
- Sorting: Ω(N log N)
- Element distinctness: Ω(N^(2/3))

## Quantum Error Correction

### Quantum Errors

**Types:**
- Bit flip: X error
- Phase flip: Z error
- Both: Y error
- Amplitude damping
- Phase damping

**Decoherence:**
Interaction with environment destroys quantum information.

**No-Cloning:**
Cannot simply copy quantum information for redundancy.

### Quantum Error Correction Codes

**Shor Code:**
9-qubit code correcting arbitrary single-qubit error.

**Encoding:**
|0⟩ → (|000⟩ + |111⟩)⊗³/2√2
|1⟩ → (|000⟩ - |111⟩)⊗³/2√2

**Steane Code:**
7-qubit code, [[7,1,3]] CSS code.

**Surface Codes:**
2D lattice of qubits.
- High threshold
- Local operations
- Scalable

**Stabilizer Codes:**
General framework for quantum codes.

**Stabilizer:**
Subgroup of Pauli group fixing code space.

### Fault-Tolerant Quantum Computation

**Threshold Theorem:**
If physical error rate below threshold, can compute arbitrarily long with arbitrarily small logical error rate.

**Threshold:**
~1% for surface codes.

**Fault-Tolerant Gates:**
Gates that don't propagate errors catastrophically.

**Transversal Gates:**
Apply same gate to each physical qubit independently.

**Magic State Distillation:**
Prepare high-quality ancilla states for non-Clifford gates.

## Quantum Cryptography

### Quantum Key Distribution

**BB84 Protocol:**
1. Alice sends qubits in random bases
2. Bob measures in random bases
3. Alice and Bob compare bases (not results)
4. Keep bits where bases matched

**Security:**
Eavesdropping disturbs quantum states (detectable).

**E91 Protocol:**
Uses entangled pairs.

**Security Proof:**
Based on quantum mechanics, not computational assumptions.

**Practical Implementations:**
- Fiber optic networks
- Satellite-based QKD
- Commercial systems available

### Post-Quantum Cryptography

**Threat:**
Shor's algorithm breaks RSA, ECC.

**Candidates:**
- Lattice-based
- Code-based
- Multivariate
- Hash-based
- Isogeny-based

**NIST Standardization:**
Ongoing process to standardize post-quantum algorithms.

**Hybrid Approaches:**
Combine classical and post-quantum schemes.

## Quantum Information Theory

### Quantum Entropy

**Von Neumann Entropy:**
S(ρ) = -Tr(ρ log ρ)

Quantum analog of Shannon entropy.

**Properties:**
- S(ρ) ≥ 0
- S(ρ) = 0 iff ρ pure
- S(ρ) ≤ log d for d-dimensional system

**Conditional Entropy:**
S(A|B) = S(AB) - S(B)

Can be negative (quantum correlation).

**Mutual Information:**
I(A:B) = S(A) + S(B) - S(AB)

### Quantum Channels

**Quantum Channel:**
Completely positive trace-preserving (CPTP) map.

**Kraus Representation:**
ε(ρ) = Σᵢ KᵢρKᵢ†

Where ΣᵢKᵢ†Kᵢ = I.

**Channel Capacity:**
Maximum rate of reliable quantum communication.

**Classical Capacity:**
Maximum rate of classical communication through quantum channel.

**Quantum Capacity:**
Maximum rate of quantum communication.

### Entanglement Measures

**Entanglement Entropy:**
S(ρₐ) where ρₐ = Trᵦ(ρₐᵦ)

**Entanglement of Formation:**
Minimum average entropy needed to create state.

**Distillable Entanglement:**
Maximum rate of extracting Bell pairs.

**Bound Entanglement:**
Entangled but not distillable.

## Quantum Machine Learning

### Quantum Neural Networks

**Variational Quantum Circuits:**
Parameterized quantum circuits trained classically.

**Architecture:**
- Encoding layer
- Variational layers
- Measurement

**Training:**
Classical optimization of parameters.

**Applications:**
- Classification
- Regression
- Generative models

### Quantum Kernel Methods

**Quantum Feature Maps:**
Map classical data to quantum states.

**Kernel Evaluation:**
K(x, x') = |⟨φ(x)|φ(x')⟩|²

**Quantum Advantage:**
Exponentially large feature space.

**Support Vector Machines:**
Use quantum kernel for classification.

### Quantum Sampling

**Quantum Boltzmann Machines:**
Quantum analog of Boltzmann machines.

**Quantum Annealing:**
Find ground state of Hamiltonian.

**Applications:**
- Optimization
- Sampling
- Generative modeling

## Physical Implementations

### Superconducting Qubits

**Josephson Junctions:**
Superconducting circuits with nonlinear inductance.

**Transmon:**
Most common superconducting qubit.

**Advantages:**
- Fast gates
- High fidelity
- Scalable fabrication

**Challenges:**
- Short coherence times
- Requires dilution refrigerator

**Companies:**
- IBM
- Google
- Rigetti

### Trapped Ions

**Principle:**
Ions trapped by electromagnetic fields.

**Qubits:**
Internal energy levels of ions.

**Gates:**
Laser pulses manipulate states.

**Advantages:**
- Long coherence times
- High gate fidelity
- All-to-all connectivity

**Challenges:**
- Slow gates
- Scaling

**Companies:**
- IonQ
- Honeywell

### Photonic Quantum Computing

**Qubits:**
Photon polarization or path.

**Gates:**
Beam splitters, phase shifters.

**Advantages:**
- Room temperature
- Low decoherence
- Networking

**Challenges:**
- Probabilistic gates
- Photon loss

**Approaches:**
- Linear optical quantum computing
- Measurement-based quantum computing

### Topological Quantum Computing

**Anyons:**
Quasiparticles with exotic statistics.

**Braiding:**
Topologically protected gates.

**Advantages:**
- Inherent error protection
- Fault tolerance

**Challenges:**
- Experimental realization
- Requires exotic materials

**Microsoft:**
Pursuing topological qubits.

## Interview Questions

**Q: Explain the no-cloning theorem and its implications.**

A: The no-cloning theorem states you cannot create an identical copy of an unknown quantum state. Proof: assume cloning operation U|ψ⟩|0⟩ = |ψ⟩|ψ⟩ for all |ψ⟩. For orthogonal states, this leads to contradiction with linearity. Implications: (1) Cannot use redundancy for error correction like classical computing, (2) Quantum information is fundamentally different, (3) Enables quantum cryptography security, (4) Requires special quantum error correction codes.

**Q: How does Grover's algorithm achieve quadratic speedup?**

A: Grover's algorithm searches N items in O(√N) time using amplitude amplification. It repeatedly applies: (1) Oracle marking solution states, (2) Diffusion operator reflecting about average amplitude. This amplifies marked state amplitudes while suppressing others. After O(√N) iterations, marked state has high probability. The quadratic speedup is proven optimal for unstructured search. Applications include database search and constraint satisfaction.

**Q: Explain quantum entanglement and Bell's inequality.**

A: Entanglement is quantum correlation stronger than classical, where measuring one particle instantly affects another. Bell's inequality provides testable bound on classical correlations. Quantum mechanics violates this bound (CHSH: classical ≤2, quantum ≤2√2), proving entanglement is real, not just hidden variables. This enables quantum teleportation, cryptography, and algorithms. EPR paradox questioned this "spooky action," but experiments confirm quantum predictions.

**Q: What is the threshold theorem in quantum error correction?**

A: The threshold theorem states if physical error rate is below a threshold (~1% for surface codes), arbitrarily long quantum computation is possible with arbitrarily small logical error rate using error correction. This requires: (1) Quantum error correction codes, (2) Fault-tolerant gates that don't propagate errors, (3) Error detection and correction faster than error accumulation. This proves scalable quantum computing is theoretically possible despite decoherence.

**Q: Explain BQP and its relationship to other complexity classes.**

A: BQP (Bounded-Error Quantum Polynomial) contains problems solvable by quantum computers in polynomial time with error ≤1/3. Relationships: P ⊆ BQP ⊆ PSPACE. BQP likely contains problems not in P (like factoring) but relationship to NP is unknown - BQP may intersect NP non-trivially. QMA is quantum analog of NP (quantum verifier, quantum witness). Understanding BQP helps characterize quantum computational power.

---

[← Back to Distributed Systems Theory](./07-distributed-systems-theory.md) | [Next: Complexity Theory →](./09-complexity-theory.md)
