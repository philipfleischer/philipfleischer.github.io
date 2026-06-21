---
title: "Operating Systems Internals Experiments"
subtitle: "Low-level systems programming repository with C, assembly, x86 architecture notes, small OS experiments, boot concepts, debugging, and operating system fundamentals."
image: "/img/OS.png"
tags: ["C", "Assembly", "x86", "Operating Systems", "Linux", "GDB", "Systems Programming"]
topics: ["Systems", "Networking"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Operating-Systems-Internals-Experiments"
---

A personal sandbox for exploring OS internals below the abstraction layers that most developers take for granted. This repository sits alongside the formal IN3000 coursework but goes further into personal experiments and notes.

## Areas explored

### Boot process and x86 architecture
- Writing a minimal **bootloader in assembly** that loads a second-stage binary from disk
- Understanding the real mode → protected mode transition, the A20 line, and the Global Descriptor Table (GDT)
- Reading the BIOS interrupt table and using INT 13h for disk I/O before any OS is loaded
- Notes on the x86 register set, calling conventions (cdecl vs System V AMD64 ABI), and stack layout

### Process and memory management in C
- Implementing a minimal **round-robin scheduler** with context switching via `setjmp`/`longjmp`
- Manual memory allocator experiments — `malloc`/`free` with a free-list, coalescing adjacent blocks, and alignment
- Playing with `mmap`, `mprotect`, and `/proc/self/maps` to understand virtual address space layout

### Debugging at the metal
- GDB scripting for automated debugging sessions: breakpoints on function entry, examining registers, disassembling at runtime
- Bochs emulator for running bare-metal code with hardware-accurate CPU simulation
- Using `objdump`, `readelf`, and `nm` to understand ELF binaries

### Linux kernel interfaces
- `ptrace` experiments — attaching to a process, reading/writing memory, intercepting syscalls
- Writing character device drivers as loadable kernel modules (LKM) to understand the kernel module lifecycle
- `/proc` filesystem — reading `/proc/PID/status`, `/proc/meminfo`, and parsing `/proc/self/maps`

## Key insight
The line between "application programmer" and "systems programmer" is mostly familiarity. Once you understand that a process is just a virtual address space + a set of registers, and that the kernel is just code that runs with higher privilege, a lot of previously mysterious behavior becomes obvious.
