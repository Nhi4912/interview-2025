# Operating Systems Theory

## Understanding System Software Fundamentals

**English:** An operating system is system software that manages computer hardware, software resources, and provides common services for computer programs, acting as an intermediary between users and computer hardware.

**Tiếng Việt:** Hệ điều hành là phần mềm hệ thống quản lý phần cứng máy tính, tài nguyên phần mềm và cung cấp các dịch vụ chung cho các chương trình máy tính, hoạt động như trung gian giữa người dùng và phần cứng máy tính.

## Table of Contents

1. [OS Fundamentals](#os-fundamentals)
2. [Process Management](#process-management)
3. [Thread Management](#thread-management)
4. [CPU Scheduling](#cpu-scheduling)
5. [Memory Management](#memory-management)
6. [File Systems](#file-systems)
7. [I/O Systems](#io-systems)
8. [Deadlocks](#deadlocks)
9. [Security](#security)
10. [Modern OS Concepts](#modern-os-concepts)

## OS Fundamentals

### What is an Operating System?

**Definition:** Software that manages hardware and provides services to applications

**Main Functions:**

```
1. Resource Management
   - CPU, memory, storage, I/O devices

2. Process Management
   - Creation, scheduling, termination

3. Memory Management
   - Allocation, deallocation, virtual memory

4. File System Management
   - File operations, directories, permissions

5. I/O Management
   - Device drivers, buffering, caching

6. Security and Protection
   - Authentication, authorization, access control
```

### OS Structure

**Layered Architecture:**

```
┌─────────────────────────┐
│   User Applications     │
├─────────────────────────┤
│   System Libraries      │
├─────────────────────────┤
│   System Calls          │
├─────────────────────────┤
│   Kernel                │
├─────────────────────────┤
│   Hardware              │
└─────────────────────────┘
```

**Kernel Types:**

**Monolithic Kernel:**

```
All OS services in kernel space
- Fast (no context switching)
- Less secure (everything privileged)
- Example: Linux, Unix
```

**Microkernel:**

```
Minimal kernel, services in user space
- More secure (isolation)
- Slower (more context switching)
- Example: Minix, QNX
```

**Hybrid Kernel:**

```
Combination of both
- Balance performance and security
- Example: Windows NT, macOS
```

### System Calls

**Definition:** Interface between user programs and OS

**Categories:**

```
1. Process Control
   - fork(), exec(), exit(), wait()

2. File Management
   - open(), read(), write(), close()

3. Device Management
   - ioctl(), read(), write()

4. Information Maintenance
   - getpid(), alarm(), sleep()

5. Communication
   - pipe(), shmget(), mmap()
```

**Example (Unix):**

```c
// Process creation
pid_t pid = fork();

if (pid == 0) {
    // Child process
    execl("/bin/ls", "ls", "-l", NULL);
} else {
    // Parent process
    wait(NULL);
}

// File operations
int fd = open("file.txt", O_RDONLY);
char buffer[1024];
read(fd, buffer, sizeof(buffer));
close(fd);
```

## Process Management

### Process Concept

**Definition:** Program in execution

**Process Components:**

```
┌─────────────────────┐
│   Stack             │ ← Function calls, local variables
├─────────────────────┤
│   Heap              │ ← Dynamic memory
├─────────────────────┤
│   Data              │ ← Global variables
├─────────────────────┤
│   Text (Code)       │ ← Program instructions
└─────────────────────┘
```

**Process Control Block (PCB):**

```
- Process ID (PID)
- Process State
- Program Counter
- CPU Registers
- Memory Management Info
- I/O Status
- Accounting Info
```

### Process States

**State Diagram:**

```
        ┌─────────┐
        │   New   │
        └────┬────┘
             ↓
        ┌─────────┐
   ┌───→│  Ready  │←───┐
   │    └────┬────┘    │
   │         ↓         │
   │    ┌─────────┐    │
   │    │ Running │    │
   │    └────┬────┘    │
   │         ↓         │
   │    ┌─────────┐    │
   └────│ Waiting │────┘
        └────┬────┘
             ↓
        ┌─────────┐
        │Terminated│
        └─────────┘
```

**State Transitions:**

```
New → Ready: Process created, loaded into memory
Ready → Running: Scheduler selects process
Running → Ready: Time quantum expired (preemption)
Running → Waiting: I/O or event wait
Waiting → Ready: I/O or event completion
Running → Terminated: Process completes
```

### Process Creation

**Unix fork():**

```c
#include <stdio.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        // Fork failed
        fprintf(stderr, "Fork failed\n");
        return 1;
    } else if (pid == 0) {
        // Child process
        printf("Child process: PID = %d\n", getpid());
        execlp("/bin/ls", "ls", NULL);
    } else {
        // Parent process
        printf("Parent process: PID = %d, Child PID = %d\n",
               getpid(), pid);
        wait(NULL);
        printf("Child completed\n");
    }

    return 0;
}
```

### Inter-Process Communication (IPC)

**Shared Memory:**

```c
// Create shared memory
int shmid = shmget(IPC_PRIVATE, 1024, IPC_CREAT | 0666);

// Attach to shared memory
char *shared = (char *)shmat(shmid, NULL, 0);

// Write to shared memory
strcpy(shared, "Hello from process");

// Detach
shmdt(shared);

// Remove
shmctl(shmid, IPC_RMID, NULL);
```

**Message Passing:**

```c
// Create message queue
int msgid = msgget(IPC_PRIVATE, IPC_CREAT | 0666);

// Send message
struct message {
    long type;
    char text[100];
};

struct message msg;
msg.type = 1;
strcpy(msg.text, "Hello");
msgsnd(msgid, &msg, sizeof(msg.text), 0);

// Receive message
msgrcv(msgid, &msg, sizeof(msg.text), 1, 0);
```

**Pipes:**

```c
int pipefd[2];
pipe(pipefd);

if (fork() == 0) {
    // Child: write to pipe
    close(pipefd[0]); // Close read end
    write(pipefd[1], "Hello", 5);
    close(pipefd[1]);
} else {
    // Parent: read from pipe
    close(pipefd[1]); // Close write end
    char buffer[10];
    read(pipefd[0], buffer, 5);
    close(pipefd[0]);
}
```

## Thread Management

### Thread Concept

**Definition:** Lightweight process, unit of execution within process

**Process vs Thread:**

```
Process:
- Own address space
- Heavy context switch
- Independent
- Isolated

Thread:
- Shared address space
- Light context switch
- Dependent on process
- Not isolated
```

**Thread Components:**

```
Shared:
- Code section
- Data section
- Heap
- Open files

Private:
- Thread ID
- Program counter
- Register set
- Stack
```

### Thread Models

**User-Level Threads:**

```
Managed by user-level library
- Fast (no kernel involvement)
- Portable
- Cannot utilize multiple CPUs
- Blocking system call blocks all threads
```

**Kernel-Level Threads:**

```
Managed by OS kernel
- Can utilize multiple CPUs
- Blocking call doesn't block all threads
- Slower (kernel involvement)
- OS-specific
```

**Hybrid Model:**

```
Many-to-many mapping
- Combines benefits of both
- Complex implementation
```

### POSIX Threads (pthreads)

```c
#include <pthread.h>
#include <stdio.h>

void *thread_function(void *arg) {
    int *num = (int *)arg;
    printf("Thread %d running\n", *num);
    return NULL;
}

int main() {
    pthread_t threads[5];
    int thread_args[5];

    // Create threads
    for (int i = 0; i < 5; i++) {
        thread_args[i] = i;
        pthread_create(&threads[i], NULL, thread_function, &thread_args[i]);
    }

    // Wait for threads
    for (int i = 0; i < 5; i++) {
        pthread_join(threads[i], NULL);
    }

    return 0;
}
```

### Thread Synchronization

**Mutex:**

```c
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
int counter = 0;

void *increment(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&mutex);
        counter++;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}
```

**Semaphore:**

```c
#include <semaphore.h>

sem_t semaphore;
sem_init(&semaphore, 0, 1); // Binary semaphore

void *thread_function(void *arg) {
    sem_wait(&semaphore); // P operation
    // Critical section
    sem_post(&semaphore); // V operation
    return NULL;
}
```

## CPU Scheduling

### Scheduling Algorithms

**First-Come, First-Served (FCFS):**

```
Non-preemptive
Simple but can cause convoy effect

Process | Burst Time | Arrival Time
--------|------------|-------------
P1      | 24         | 0
P2      | 3          | 0
P3      | 3          | 0

Gantt Chart:
|  P1  |P2|P3|
0     24  27 30

Average Waiting Time: (0 + 24 + 27) / 3 = 17
```

**Shortest Job First (SJF):**

```
Non-preemptive
Optimal average waiting time
Requires burst time prediction

Process | Burst Time
--------|------------
P1      | 6
P2      | 8
P3      | 7
P4      | 3

Gantt Chart:
|P4|  P1  |  P3  |   P2   |
0  3     9      16       24

Average Waiting Time: (0 + 3 + 9 + 16) / 4 = 7
```

**Round Robin (RR):**

```
Preemptive
Time quantum = 4

Process | Burst Time
--------|------------
P1      | 24
P2      | 3
P3      | 3

Gantt Chart:
|P1|P2|P3|P1|P1|P1|P1|P1|P1|
0  4  7 10 14 18 22 26 30

Average Waiting Time: 5.66
```

**Priority Scheduling:**

```
Each process has priority
Lower number = higher priority
Can be preemptive or non-preemptive

Process | Burst | Priority
--------|-------|----------
P1      | 10    | 3
P2      | 1     | 1
P3      | 2     | 4
P4      | 1     | 5
P5      | 5     | 2

Order: P2, P5, P1, P3, P4
```

**Multilevel Queue:**

```
Multiple queues with different priorities

┌──────────────────┐
│ System Processes │ ← Highest priority
├──────────────────┤
│ Interactive      │
├──────────────────┤
│ Batch            │ ← Lowest priority
└──────────────────┘
```

## Memory Management

### Memory Hierarchy

```
┌──────────────┐
│  Registers   │ ← Fastest, smallest
├──────────────┤
│  Cache       │
├──────────────┤
│  Main Memory │
├──────────────┤
│  Disk        │ ← Slowest, largest
└──────────────┘
```

### Memory Allocation

**Contiguous Allocation:**

```
Fixed Partitioning:
┌────────┐
│  OS    │
├────────┤
│ Part 1 │
├────────┤
│ Part 2 │
├────────┤
│ Part 3 │
└────────┘

Dynamic Partitioning:
┌────────┐
│  OS    │
├────────┤
│ Proc 1 │
├────────┤
│  Free  │
├────────┤
│ Proc 2 │
└────────┘
```

**Allocation Strategies:**

```
First Fit: Allocate first hole large enough
Best Fit: Allocate smallest hole large enough
Worst Fit: Allocate largest hole
```

### Paging

**Concept:** Divide memory into fixed-size pages

```
Logical Address: [Page Number | Offset]
Physical Address: [Frame Number | Offset]

Page Table:
Page | Frame
-----|------
0    | 5
1    | 2
2    | 7
3    | 1
```

**Address Translation:**

```
Logical Address: 0x1234
Page Size: 4KB (0x1000)

Page Number: 0x1234 / 0x1000 = 0x1
Offset: 0x1234 % 0x1000 = 0x234

Page Table: Page 1 → Frame 5

Physical Address: (5 × 0x1000) + 0x234 = 0x5234
```

### Virtual Memory

**Demand Paging:**

```
Load pages only when needed
- Reduces memory usage
- Increases multiprogramming
- Page faults when page not in memory
```

**Page Replacement Algorithms:**

**FIFO:**

```
Reference String: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5
Frames: 3

Time: 1  2  3  4  1  2  5  1  2  3  4  5
      1  1  1  4  4  4  4  4  4  3  3  3
         2  2  2  2  2  5  5  5  5  4  4
            3  3  3  3  3  3  3  3  3  5
      F  F  F  F  -  -  F  -  -  F  F  F

Page Faults: 9
```

**LRU (Least Recently Used):**

```
Replace page not used for longest time
Better performance than FIFO
More complex implementation
```

## File Systems

### File Concept

**File Attributes:**

```
- Name
- Type
- Location
- Size
- Protection
- Time, date
- User ID
```

**File Operations:**

```
- Create
- Open
- Read
- Write
- Seek
- Close
- Delete
```

### Directory Structure

**Single-Level:**

```
/
├── file1
├── file2
└── file3

Simple but no organization
```

**Two-Level:**

```
/
├── user1/
│   ├── file1
│   └── file2
└── user2/
    ├── file1
    └── file3

Separate directories per user
```

**Tree-Structured:**

```
/
├── home/
│   ├── user1/
│   │   ├── docs/
│   │   └── pics/
│   └── user2/
└── etc/

Most common structure
```

### File Allocation Methods

**Contiguous:**

```
File stored in contiguous blocks
- Fast sequential access
- External fragmentation
- Hard to grow files
```

**Linked:**

```
Each block points to next
- No external fragmentation
- Slow random access
- Pointer overhead
```

**Indexed:**

```
Index block contains pointers
- Fast random access
- No external fragmentation
- Index block overhead
```

### Unix File System

**inode Structure:**

```
- File type and permissions
- Owner and group
- File size
- Timestamps
- Direct pointers (12)
- Single indirect pointer
- Double indirect pointer
- Triple indirect pointer
```

## I/O Systems

### I/O Hardware

**Device Types:**

```
Block Devices:
- Fixed-size blocks
- Random access
- Example: Disk, SSD

Character Devices:
- Stream of characters
- Sequential access
- Example: Keyboard, mouse
```

### I/O Methods

**Programmed I/O:**

```
CPU polls device status
- Simple
- Wastes CPU time
```

**Interrupt-Driven I/O:**

```
Device interrupts CPU when ready
- More efficient
- Still involves CPU for data transfer
```

**DMA (Direct Memory Access):**

```
Device transfers data directly to memory
- Most efficient
- CPU only involved at start and end
```

### Buffering

**Single Buffer:**

```
┌──────┐    ┌────────┐    ┌──────┐
│Device│ →  │ Buffer │ →  │ User │
└──────┘    └────────┘    └──────┘
```

**Double Buffer:**

```
┌──────┐    ┌────────┐
│Device│ →  │Buffer 1│ ⇄ User
└──────┘    ├────────┤
            │Buffer 2│
            └────────┘
```

## Deadlocks

### Deadlock Conditions

**Four Necessary Conditions:**

```
1. Mutual Exclusion
   - Resource cannot be shared

2. Hold and Wait
   - Process holds resource while waiting

3. No Preemption
   - Resource cannot be forcibly taken

4. Circular Wait
   - Circular chain of waiting processes
```

### Deadlock Prevention

**Break One Condition:**

```
1. Mutual Exclusion
   - Make resources sharable (not always possible)

2. Hold and Wait
   - Request all resources at once
   - Release all before requesting new

3. No Preemption
   - Allow resource preemption

4. Circular Wait
   - Order resources, request in order
```

### Deadlock Avoidance

**Banker's Algorithm:**

```
Check if granting request leaves system in safe state

Available: [3, 3, 2]

Process | Allocation | Max | Need
--------|------------|-----|------
P0      | [0,1,0]    |[7,5,3]|[7,4,3]
P1      | [2,0,0]    |[3,2,2]|[1,2,2]
P2      | [3,0,2]    |[9,0,2]|[6,0,0]
P3      | [2,1,1]    |[2,2,2]|[0,1,1]
P4      | [0,0,2]    |[4,3,3]|[4,3,1]

Safe sequence: P1, P3, P4, P2, P0
```

## Security

### Protection Mechanisms

**Access Control:**

```
Access Control Matrix:

        File1  File2  File3
User1   RW     R      -
User2   R      RW     R
User3   -      R      RWX
```

**Access Control Lists (ACL):**

```
File1: User1(RW), User2(R)
File2: User1(R), User2(RW), User3(R)
File3: User3(RWX)
```

**Capabilities:**

```
User1: File1(RW), File2(R)
User2: File1(R), File2(RW)
User3: File2(R), File3(RWX)
```

### Authentication

**Methods:**

```
1. Something you know (password)
2. Something you have (token)
3. Something you are (biometric)
```

## Modern OS Concepts

### Virtualization

**Virtual Machines:**

```
┌─────────────────────────┐
│   Guest OS 1 | Guest OS 2│
├─────────────────────────┤
│   Virtual Machine Monitor│
├─────────────────────────┤
│      Host OS             │
├─────────────────────────┤
│      Hardware            │
└─────────────────────────┘
```

### Containers

**Docker Architecture:**

```
┌─────────────────────────┐
│ Container 1 | Container 2│
├─────────────────────────┤
│   Container Runtime      │
├─────────────────────────┤
│      Host OS             │
├─────────────────────────┤
│      Hardware            │
└─────────────────────────┘

Lighter than VMs
Share kernel
Isolated user space
```

## Interview Questions

**🟢 [Junior] Q: Explain the difference between process and thread.**

A: Process is independent program with own memory space, heavy context switch. Thread is lightweight unit within process, shares memory, light context switch. Use threads for concurrent tasks within application, processes for isolation and security.

**🟡 [Mid] Q: What is a deadlock and how can it be prevented?**

A: Deadlock occurs when processes wait for each other in cycle. Four conditions: mutual exclusion, hold and wait, no preemption, circular wait. Prevention: break one condition (resource ordering, preemption, request all at once). Avoidance: Banker's algorithm checks safe states.

**🟡 [Mid] Q: Explain virtual memory and paging.**

A: Virtual memory gives each process illusion of large address space. Paging divides memory into fixed-size pages, maps virtual to physical addresses via page table. Enables: more processes than physical memory, memory protection, shared memory. Uses demand paging to load pages only when needed.

**🟡 [Mid] Q: What are the main CPU scheduling algorithms?**

A: FCFS (simple, convoy effect), SJF (optimal waiting time, needs prediction), Round Robin (fair, time quantum), Priority (can starve low priority), Multilevel Queue (different queues for different types). Choose based on: fairness, response time, throughput requirements.

**🟡 [Mid] Q: Explain the difference between mutex and semaphore.**

A: Mutex is binary lock for mutual exclusion, owned by thread that locks it. Semaphore is counter for resource access control, can be binary or counting, no ownership. Use mutex for critical sections, semaphore for resource pools or signaling between threads.

---

[← Back to Concurrency Theory](./11-concurrency-parallelism-theory.md) | [Next: Network Theory →](./13-network-theory.md)
