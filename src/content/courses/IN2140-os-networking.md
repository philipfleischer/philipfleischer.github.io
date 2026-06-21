---
title: "IN2140 — OS & Networking"
courseCode: "IN2140"
subtitle: "Foundational systems course in C covering low-level I/O, processes, concurrency, synchronization, and networking protocols. Includes a substantial home exam project."
image: "/img/Duplex.png"
tags: ["C", "Systems", "CMake", "Processes", "Concurrency", "Sockets", "Networking"]
topics: ["Systems", "Networking"]
year: 2023
links:
  - label: "Home Exam Repo"
    url: "https://github.com/philipfleischer/OS-DataCommunication/tree/main/HomeExam"
  - label: "Full Repo"
    url: "https://github.com/philipfleischer/OS-DataCommunication"
---

**IN2140 – Introduction to Operating Systems and Data Communication** at UiO. The first encounter with systems programming in C — understanding what the OS does on behalf of user programs and how data moves between machines.

## Course topics

### C programming at the systems level
- Pointer arithmetic, memory layout, stack vs heap allocation
- `malloc`/`free` and manual memory management — preventing leaks and dangling pointers
- Structs, unions, bitfields for low-level data representation
- Undefined behaviour: alignment, overflow, strict aliasing

### Processes and the kernel interface
- `fork()` / `exec()` / `wait()` — process creation and management
- `fork()` semantics: copy-on-write, file descriptor inheritance
- Signals: `SIGINT`, `SIGCHLD`, `kill()`, `sigaction()` handlers
- Process groups and sessions

### I/O
- File descriptors as an abstraction over files, sockets, and pipes
- Blocking vs non-blocking I/O
- `select()` and `poll()` for multiplexing multiple I/O sources
- `epoll` (Linux) for scalable I/O event notification

### Concurrency with threads
- POSIX threads (`pthreads`): creating threads, joining, detaching
- **Mutex locks** — `pthread_mutex_lock`/`unlock`, protecting shared state
- **Condition variables** — `pthread_cond_wait`/`signal`, producer-consumer pattern
- Race conditions, deadlock, livelock — recognising and preventing them

### Networking
- **Socket API** — `socket()`, `bind()`, `listen()`, `accept()`, `connect()`, `send()`, `recv()`
- TCP vs UDP: reliability, ordering, flow control vs best-effort delivery
- **Full-duplex communication** — using `select()` or separate threads for simultaneous send/receive
- HTTP at the protocol level: request/response format, headers, status codes

### CMake build system
- `CMakeLists.txt` structure, targets, include directories
- Out-of-source builds, debug vs release configurations
- Linking libraries (`-lpthread`, `-lm`)

## Home exam
The home exam was a substantial solo programming project requiring integration of multiple course topics: process management, IPC, socket communication, and concurrent data structures — all in C with a CMake build.
