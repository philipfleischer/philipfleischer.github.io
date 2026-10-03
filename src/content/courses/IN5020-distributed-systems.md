---
title: "IN5020: Distributed Systems"
courseCode: "IN5020"
subtitle: "Master's course on how distributed systems are built: middleware, replication, consensus and peer-to-peer lookup. Three group assignments, highlighted by a load-balanced Java RMI statistics service with caching and Docker deployment."
image: "/img/IN5020.png"
tags: ["Java", "Java RMI", "Docker", "Load Balancing", "Caching", "Replication", "Chord", "Maven"]
topics: ["Distributed Systems", "Systems", "Cloud"]
year: 2026
order: 2
badge: "Autumn 2026"
links:
  - label: "GitHub: Assignment 1"
    url: "https://github.com/philipfleischer/IN5020-A1-G1-RMI"
---

**IN5020: Distributed Systems** at the University of Oslo, autumn 2026. The course covers the principles and practice of building distributed systems: fundamental system models, distributed middleware (object-based middleware and component architectures), distributed algorithms for consensus and related problems, and newer challenges from cloud, multimedia and IoT. Each assignment is a group project in its own repository.

## Assignment 1: Java RMI International Statistics Service

*Group of four. My part: the client and the load-balancing proxy, and the overall request flow between them.*

A distributed statistics service over a dataset of about 140,000 cities. A client sends queries ("what is the population of Norway?") through a load-balancing proxy to one of several zone servers, with optional caching on the server side or the client side. Built with plain Java RMI and no external libraries.

### Architecture
- **Proxy (load balancer)**: servers register with it on startup and get a zone number. For every query the client asks the proxy which server should handle it.
- **Zone servers**: each has its own thread-safe request queue drained by a single execution thread, so requests are processed in strict FIFO order.
- **Client**: starts each query on its own thread every *T* ms (50 or 20), so queries run concurrently and put realistic load on the system.

### Load-balancing logic
The proxy sends a query to the server in the requested zone unless it is overloaded (18 or more waiting requests). Otherwise it picks the least-loaded neighbour zone, breaking ties by clockwise distance, and falls back to the original zone if every server is overloaded. Choosing a zone further away adds simulated network delay (30 ms per step), so the design had to weigh queue time against distance.

To keep load information fresh without slowing clients down, the proxy refreshes a server's queue length every 18th time it hands that server out, on a background thread, so the bookkeeping call never makes a client wait.

### Caching
A shared generic cache supports two eviction strategies, FIFO and least-recently-used, chosen at startup. The server cache holds 150 entries and the client cache 45. With caching on the server, about 35% of queries were served from cache with execution time under 1 ms. With caching on the client, around 530 of 3,157 queries never touched the network at all.

### Deployment and testing
- One two-stage Docker image (Maven build, slim JRE runtime) runs as proxy, server or client depending on the command. Docker Compose starts the proxy and five zone servers with health checks, so the client only starts once everything it depends on is ready.
- A test script runs all 10 configurations (naive, server cache and client cache, each with both eviction strategies, at T=50 and T=20) against the full 3,166-query input, and a Python script plots turnaround time and queue length per zone (60 graphs in total).

## Assignment 2: Replicated Bank Account (upcoming)

A bank account replicated across several servers as a **replicated state machine**. The replicas agree on the order of every transaction through a **totally ordered group broadcast** built on Java RMI: a delivery server orders and broadcasts messages, waits for acknowledgements, resends on timeout and removes replicas that stop answering. The main design problem is keeping every replica's balance identical while members join, leave or crash, including state transfer to new members and a correct "synced balance" that does not starve under constant load.

## Assignment 3: Chord Peer-to-Peer Lookup (upcoming)

An implementation of the core of the **Chord** protocol in a provided simulator: hashing nodes onto an *m*-bit identifier ring, building each node's finger table, and routing key lookups across the ring in a logarithmic number of hops. Results are measured as the average hop count for networks of 10, 100 and 1,000 nodes.

## Repositories

| Assignment | Repository |
|---|---|
| A1: Java RMI statistics service | [IN5020-A1-G1-RMI](https://github.com/philipfleischer/IN5020-A1-G1-RMI) |
| A2: Replicated bank account | IN5020-A2-G1-RBA (private while the course runs) |
| A3: Chord protocol | IN5020-A3-G1-CP (private while the course runs) |
