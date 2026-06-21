---
title: "IN3230 — MIP Network Stack"
courseCode: "IN3230"
subtitle: "Built a minimal IP-style network stack in C — MIP daemon, routing daemon with distance-vector algorithm and poison reverse, IPC, forwarding table, and Mininet testing."
image: "/img/Routing.png"
tags: ["C", "Networking", "Routing", "Linux", "Sockets", "Distance-Vector", "Mininet"]
topics: ["Networking", "Systems"]
year: 2024
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Networks/tree/main/IP_Routing_Project"
  - label: "Full Repo"
    url: "https://github.com/philipfleischer/Networks"
---

**IN3230 – Network Programming** at the University of Oslo. Two major projects building a complete minimal network stack from raw sockets in C.

## Project 1 — MIP Daemon

Implementing a minimal Internet Protocol (MIP) — a custom link-layer protocol running over Ethernet frames.

### What was built
- **MIP daemon** — a background process on each network node that handles MIP-level packet routing
- Custom addressing: 8-bit MIP addresses resolved to Ethernet MACs via an ARP-like discovery protocol
- Raw socket programming with `AF_PACKET` — reading and writing Ethernet frames directly, bypassing the kernel's IP stack
- **Unix domain sockets** for IPC between the MIP daemon and user applications (ping tool, file transfer)
- Custom packet format: header with source/destination MIP addresses, TTL, protocol field, and variable-length payload

### Network environment
All testing done in **Mininet** — a software-defined network emulator that creates virtual hosts, switches, and links within a single Linux machine. Topologies can be defined programmatically (star, chain, ring, mesh).

## Project 2 — Routing Daemon

Added dynamic routing on top of the MIP stack.

### Distance-vector routing (Bellman-Ford)
Each router maintains a distance table: destination → (cost, next-hop). Routers periodically send their full distance vector to neighbours. When a router receives a better path, it updates its table and propagates the change.

Convergence time: depends on topology size and the update period, but typically stabilises within 3–5 update rounds.

### Poison reverse
Prevents routing loops: if A routes to C via B, A advertises cost ∞ for C back to B. This eliminates the classic "count to infinity" problem for two-node loops.

### Multi-hop forwarding
With the routing daemon running, packets traverse multiple MIP routers. Each router:
1. Receives the packet on an interface
2. Looks up the destination in its forwarding table
3. Forwards to the correct next-hop interface

### Testing
- Correct convergence after topology changes (link failure, new node joining)
- Poison reverse prevents loops in verified test scenarios
- End-to-end packet delivery measured with custom ping tool built on top of MIP

## What this project taught me
Building a protocol stack from scratch makes everything abstract in networking courses click. Understanding byte-order conversions (`htons`/`ntohs`), parsing raw Ethernet frames, and debugging with Wireshark inside Mininet gave me a much deeper grasp of how TCP/IP actually works than lecture notes alone.
