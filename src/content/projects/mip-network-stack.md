---
title: "MIP Network Stack (IN3230)"
subtitle: "Designed and implemented a layered network stack with its own link-layer protocol, address resolution and distance-vector routing, tested in Mininet. The focus was on how each layer is structured and why."
image: "/img/Routing.png"
tags: ["C", "Networking", "Linux", "Routing", "Sockets", "Systems Programming"]
topics: ["Networking", "Systems"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Networks/tree/main/IP_Routing_Project"
---

Systems project from IN3230: Network Programming at UiO. The goal was to design a working IP-like protocol stack, decide how its layers and processes should talk to each other, and then implement it in C and test it in an emulated network.

## Project 1: MIP Daemon (Minimal Internet Protocol)

The first assignment built the foundation: a **MIP daemon** that runs on each node in the network and handles packet forwarding at the link layer.

**Key components:**
- Custom MIP addressing scheme (8-bit MIP addresses mapped to Ethernet MACs via ARP-like discovery)
- Raw socket programming using `AF_PACKET` sockets to read/write Ethernet frames directly
- **IPC** between the MIP daemon and application processes using Unix domain sockets
- Packet format: custom header with source/destination MIP addresses, TTL, and payload type
- Tested in **Mininet**: a software-defined network emulator that creates virtual hosts and links

## Project 2: Routing Daemon

The second assignment added dynamic routing on top of the MIP stack.

**Distance-vector routing (Bellman-Ford):**
- Each router maintains a distance table: for every known destination, the cost and next-hop
- Routers periodically broadcast their distance vector to neighbours
- When a shorter path is discovered, the table updates and the change propagates

**Poison reverse:**
- Prevents routing loops from persisting: if router A routes to C via B, A tells B that C is unreachable via A (cost = ∞)
- Eliminates the "count to infinity" problem for two-node loops

**Multi-hop forwarding:**
- Packets traverse multiple routers across a simulated topology
- Each router inspects the MIP destination, looks up the forwarding table, and forwards to the correct interface

## Testing
All tests run in Mininet with configurable topologies (star, chain, mesh). The routing daemon converges correctly after link failures and recovers when links come back up.

## What I took from it
The part I valued most was the design, not the C code itself. Deciding where the boundaries between the daemons should go, what the routing layer needs to know about the layer below it, and how to stop routing loops from forming made it much clearer to me why real protocols like IP and ARP are built the way they are. It is also where I found out that I am more interested in system structure and design trade-offs than in writing low-level code, which shaped the direction I have taken since.
