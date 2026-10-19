---
title: "IN5020: Distributed Systems"
courseCode: "IN5020"
subtitle: "Master's course on how distributed systems are built: middleware, replication, consensus and peer-to-peer lookup. Three group assignments: a load-balanced Java RMI statistics service with caching and Docker deployment, and a replicated bank account kept consistent with a totally ordered broadcast."
image: "/img/IN5020.png"
tags: ["Java", "Java RMI", "Docker", "Load Balancing", "Caching", "Replication", "Replicated State Machine", "Totally Ordered Broadcast", "Fault Tolerance", "Concurrency", "Chord", "Maven"]
topics: ["Distributed Systems", "Systems", "Cloud"]
year: 2026
order: 2
badge: "Autumn 2026"
links:
  - label: "GitHub: Assignment 1"
    url: "https://github.com/philipfleischer/IN5020-A1-G1-RMI"
  - label: "GitHub: Assignment 2"
    url: "https://github.com/philipfleischer/IN5020-A2-G1-RBA"
---

**IN5020: Distributed Systems** at the University of Oslo, autumn 2026. The course covers the principles and practice of building distributed systems: fundamental system models, distributed middleware (object-based middleware and component architectures), distributed algorithms for consensus and related problems, and newer challenges from cloud, multimedia and IoT. Each assignment is a group project in its own repository.

## The three assignments at a glance

| | Assignment | Topic | Status |
|---|---|---|---|
| **A1** | Java RMI International Statistics Service | Middleware, load balancing, caching | Completed |
| **A2** | Replicated Bank Account | Replication, totally ordered broadcast | Completed |
| **A3** | Chord Peer-to-Peer Lookup | Distributed hash tables, routing | Upcoming |

---

## Assignment 1: Java RMI International Statistics Service

*Status: completed. Group of four. My part: the client and the load-balancing proxy, and the overall request flow between them.*

A distributed statistics service over a dataset of about 140,000 cities. A client sends queries ("what is the population of Norway?") through a load-balancing proxy to one of several zone servers, with optional caching on the server side or the client side. Built with plain Java RMI and no external libraries.

### System design

![System design of the Java RMI statistics service: client, load-balancing proxy and zone servers with optional caches](/img/IN5020_RMI_SYS_Design.png)

The diagram shows one query's path through the system. Every box inside the dashed frame runs as its own Docker container.

1. On startup each zone server registers once with the proxy (`registerServer(...)`) and is given a zone number.
2. For every query the client asks the proxy which server to use (`getServerForZone(zone)`). The proxy looks up its zone-to-server map, checks for overload and calculates distance, then returns the server's host, port, zone and simulated network delay.
3. The client then calls that server directly over RMI (for example `getPopulationofCountry(...)`). The request goes into the server's FIFO queue and is answered by a single execution thread from the ~140,000-city dataset.
4. The server sends back a `QueryResult` with the answer and timing data.

The dashed yellow boxes are the optional caches: the client cache (45 entries) is checked before the proxy is contacted at all, and the server cache (150 entries) is checked before the dataset is searched. Zones 2 to 5 are identical copies of zone 1.

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

---

## Assignment 2: Replicated Bank Account

*Status: completed. Group of three. My part: the command handling, exactly-once execution, the switch between the naive and correct getSyncedBalance, logging, and the fix that stops a frozen replica from blocking the server.*

One bank account that exists as several identical copies at the same time. Each copy (a replica) runs in its own bank server process, possibly on different machines. Users can send commands to any replica: deposit money, add interest, ask for the balance. Wherever a command is given, every replica must end up with exactly the same balance, even while replicas join, leave or crash. Built with plain Java RMI.

All the diagrams below were drawn by our group while working on the assignment, as part of a longer explanation document. Each one is meant to make sense on its own, and the text around it is there to help you get into it quickly. **Click any diagram to see it in full size.**

### At a glance

- **What:** a replicated bank account. N bank servers each hold a full copy, and one Message Delivery server decides the order of every change.
- **Core idea:** same start state + same transactions + same order = same end state. The replicas never compare balances. They only have to agree on the order.
- **Main mechanisms:** a sequencer for total order, ACK before the next message, resend after 2 s, FAIL after 5 s, state transfer for late joiners, and duplicate detection so every transaction runs exactly once.
- **The interesting part:** `getSyncedBalance`, built in a naive and a correct version, and the observed difference between them.
- **Built with:** Java 11, Java RMI in both directions, no external libraries.

### How to read the diagrams

The same colours are used in every diagram.

| Element | Meaning |
|---|---|
| Blue | the Message Delivery server |
| Green | a bank server (replica) |
| Yellow | data inside a replica: balances, lists, counters |
| Purple | a thread |
| Red | a failure, or the naive version |
| Grey | input, commands and notes |
| Green arrow | bank → server (broadcast, ACK) |
| Blue arrow | server → bank (delivery, state transfer) |
| Grey arrow | membership: join, leave, membershipChanged |

### The big picture

This is the most important diagram. Everything else below zooms in on a part of it.

<figure class="diagram">
  <a href="/img/in5020-a2/01-system.svg"><img src="/img/in5020-a2/01-system.svg" alt="The whole system: a Message Delivery server on top, bank servers A, B and C below, and bank D that joins later, connected by numbered RMI calls" width="1700" height="1220" loading="lazy" /></a>
  <figcaption><strong>The whole system: a replicated bank account over Java RMI.</strong> The Message Delivery server at the top, three replicas (A, B, C) below and a replica D that joins later. The numbers on the arrows are the RMI calls listed in the box on the left.</figcaption>
</figure>

#### One transaction, five calls

1. A command like `deposit NOK 100` becomes a transaction in the replica's `outstanding_collection` (the inbox). The balance does not change yet. Every 10 seconds the broadcast thread sends the inbox to the server with `broadcastTransactions`.
2. The server gives the list a message id (0, 1, 2, …), queues it, and sends it to every replica in parallel with `receiveTransaction`.
3. Each replica executes the transactions in that order and calls `ack`. The server only sends the next message when everyone has answered.
4. `join`, `leave` and `membershipChanged` keep everyone's member list up to date.
5. A replica that joins late gets a copy of the state with `updateState` before it receives any new messages.

RMI goes both ways here. The bank passes itself as an argument to `join`, and because it is a `UnicastRemoteObject` the server gets a stub back to it and can push messages to the bank instead of the bank polling.

### Why the order is everything

It is easy to think it is enough that every replica gets every transaction. It is not.

<figure class="diagram">
  <a href="/img/in5020-a2/03-total-order.svg"><img src="/img/in5020-a2/03-total-order.svg" alt="Two replicas executing a deposit and an interest transaction in different orders end with 220 and 210 USD, while with a sequencer both end with 220 USD" width="1600" height="900" loading="lazy" /></a>
  <figcaption><strong>Without a common order the replicas drift apart.</strong> Deposit and interest do not commute: (100 + 100) × 1.10 = 220, but 100 × 1.10 + 100 = 210. With the Message Delivery server both become messages #7 and #8, and everyone ends on 220.</figcaption>
</figure>

It does not matter *which* order the server picks, only that everyone uses the same one. That makes the account a **replicated state machine**, and the server a **sequencer**: the simplest way to get a totally ordered broadcast.

### The bank analogy

Useful when explaining the system out loud. Each row links something everyone knows from a bank to a part of the code.

<figure class="diagram">
  <a href="/img/in5020-a2/02-bank-analogy.svg"><img src="/img/in5020-a2/02-bank-analogy.svg" alt="Table mapping a bank with branches and a head office to the parts of the system" width="1500" height="1246" loading="lazy" /></a>
  <figcaption><strong>The bank analogy.</strong> Left: a bank with many branches and one head office. Right: the matching part of the system.</figcaption>
</figure>

The way I would say it: every bank server is a branch with its own copy of the ledger. The Message Delivery server is the head office with a ticket machine. It books nothing itself, it only decides the order. Because every branch books the same slips in the same order, every ledger ends up the same.

### Life of one transaction

<figure class="diagram">
  <a href="/img/in5020-a2/04-transaction-life.svg"><img src="/img/in5020-a2/04-transaction-life.svg" alt="Sequence diagram of one deposit from the user through bank A, the Message Delivery server and banks B and C" width="1600" height="1330" loading="lazy" /></a>
  <figcaption><strong>Sequence diagram for "deposit NOK 100" on bank A.</strong> Time runs downwards. Between step 1 and step 4, getQuickBalance still shows the old balance.</figcaption>
</figure>

The detail that matters: bank A does not book its own transaction when it is created. It waits, like everyone else, until the transaction comes back from the server. That is the only way A gets it in the same position in the order as B and C.

### The delivery loop: ACK, resend and FAIL

<figure class="diagram">
  <a href="/img/in5020-a2/05-ack-resend-fail.svg"><img src="/img/in5020-a2/05-ack-resend-fail.svg" alt="Flowchart of the server's delivery loop and a timeline where bank C has crashed and is marked FAIL after 5 seconds" width="1600" height="1060" loading="lazy" /></a>
  <figcaption><strong>The server's delivery loop (left) and the timeline for one message where bank C has crashed (right).</strong> Resend after 2 s, FAIL and removal after 5 s.</figcaption>
</figure>

Why wait for every ACK before sending the next message?

- **Same order everywhere.** No replica can get message 8 before everyone has confirmed message 7.
- **Nobody falls far behind.** The difference between replicas is at most one message.
- **A safe point for state transfer.** Between two messages all replicas are in exactly the same state, so that is where a new replica can get its copy.

The cost: the group moves at the speed of the slowest replica, and in the worst case stalls for 5 seconds before a dead one is removed. An ACK means "received and executed", not just "received". A replica that leaves with `exit` calls `leave()` and is removed at once, so a planned leave never waits for the timeout.

### Inside a replica

<figure class="diagram">
  <a href="/img/in5020-a2/06-data-structures.svg"><img src="/img/in5020-a2/06-data-structures.svg" alt="Where a transaction is at each stage: outstanding, ordered, executed, skipped as a duplicate, or cleaned from the history" width="1600" height="880" loading="lazy" /></a>
  <figcaption><strong>The data structures in a replica.</strong> A transaction goes from outstanding to ordered to executed. Two counters are never reset, which is why history numbers stay the same on every replica even after cleanHistory.</figcaption>
</figure>

**Exactly once.** Duplicates can happen in two ways: the broadcast thread resends the whole inbox if the last send has not come back yet, and the server resends a message after 2 s without ACK. Every replica keeps the ids of everything it has executed in `executedIds` and skips anything it has seen before, but still sends the ACK. Because everyone sees the messages in the same order, everyone skips the same duplicates.

Why not just check `executed_list`? Because `cleanHistory` empties it. After a cleanHistory the replica would forget what it had executed, and a duplicate would run twice. `executedIds` is never cleared.

### getSyncedBalance: naive vs correct

This is the part the assignment asks us to observe and explain. `getQuickBalance` answers from the local copy straight away, so it can miss the replica's own transactions that are not ordered yet. `getSyncedBalance` should wait until they are executed.

<figure class="diagram">
  <a href="/img/in5020-a2/07-getsyncedbalance.svg"><img src="/img/in5020-a2/07-getsyncedbalance.svg" alt="The same three commands in the correct version, which answers 100.00, and the naive version, which answers 110.00" width="1600" height="1040" loading="lazy" /></a>
  <figcaption><strong>Same commands in both versions.</strong> The correct version answers 100.00, the naive one 110.00, because it includes a deposit that was issued after the request.</figcaption>
</figure>

- **Naive:** wait until `outstanding_collection` is empty, then read the balance. If new transactions arrive while it waits, they are included in the answer. Under steady load the inbox is never empty and it waits forever. The assignment calls this a deadlock; more precisely it is starvation, since nothing is locked, the condition just never becomes true.
- **Correct:** put a marker in the inbox behind the transactions already there. It is ordered like any other transaction. When it comes back, only the replica that created it answers, and it is not added to the history. The answer is the state exactly where the request sits in the global order, and it always comes within one broadcast round.

Neither version blocks the command loop. That is what makes the difference visible: new commands can come in while the request waits.

What we observed with the example command file, one replica in each mode:

| Call | Correct | Naive | Why they differ |
|---|---|---|---|
| 2 (after deposit USD 100) | 100.00 USD | 110.00 USD | naive includes a deposit issued after the request |
| 4 (after addInterest USD 10) | 120.00 USD | 306.00 USD | naive includes six later deposits |
| 6 (last) | 651.64 USD | 651.64 USD | no new commands, so both agree |

The naive answers depend on timing and change from run to run. The correct ones are always the same.

### Membership: startup, late join, leave and crash

<figure class="diagram">
  <a href="/img/in5020-a2/08-membership.svg"><img src="/img/in5020-a2/08-membership.svg" alt="Four columns showing startup, a late join with state transfer, a planned leave and a crash" width="1700" height="1080" loading="lazy" /></a>
  <figcaption><strong>The four membership situations.</strong> Each one ends with the server sending the new member list to everyone.</figcaption>
</figure>

- **Startup:** each replica waits until N members have joined. The first replicas get no state transfer, so if A sent a transaction before C joined, C would miss it forever.
- **Late join:** the server waits until the current message is ACKed by everyone, takes a snapshot (balances, history, `order_counter`, `executedIds`) from an existing replica, and gives it to the new one before the next message. `executedIds` has to be included, otherwise the new replica could execute a duplicate the others skip.
- **Leave:** send the rest of the inbox, call `leave()`, exit.
- **Crash:** detected by the missing ACK. Transactions that were still in the crashed replica's inbox are lost, but the customer never got them confirmed either.

### Threads and locks

<figure class="diagram">
  <a href="/img/in5020-a2/09-threads-locks.svg"><img src="/img/in5020-a2/09-threads-locks.svg" alt="The threads in a bank server around the shared state, all using synchronized" width="1600" height="1000" loading="lazy" /></a>
  <figcaption><strong>The threads in a bank server.</strong> Everything that reads or changes the shared state does it inside synchronized. Membership updates use their own lock.</figcaption>
</figure>

Without the lock, `receiveTransaction` could remove a transaction from the inbox while the broadcast thread is copying it. `getSyncedBalance` waits for its answer *without* holding the lock, because otherwise `receiveTransaction` could never get in to deliver it: a deadlock.

### Running and testing

<figure class="diagram">
  <a href="/img/in5020-a2/10-test-scenario.svg"><img src="/img/in5020-a2/10-test-scenario.svg" alt="Timeline of the official test scenario: a server, three replicas at 0 s, two at 7 s and one at 12 s" width="1600" height="960" loading="lazy" /></a>
  <figcaption><strong>The official test scenario.</strong> Three replicas start at 0 s, two more join at 7 s and one at 12 s. A script starts everything and saves each process's log.</figcaption>
</figure>

What we checked:

- every replica that lived to the end has the same final balance
- every replica has the same transaction at every order number (the late joiners' lists are the tail of the others')
- naive and correct mode give different getSyncedBalance answers, and the difference can be explained
- a replica killed in the middle of a run is marked FAIL after 5 s, and the rest carry on

In the final runs all six replicas executed the transactions in the same order and ended on the same balance, in both modes.

### Design choices worth defending

| Choice | Why |
|---|---|
| `executedIds` in addition to `executed_list` | The duplicate check must still work after cleanHistory |
| ACK even when every transaction was a duplicate | Otherwise the server would wait forever, or wrongly declare the bank dead |
| Wait for N replicas before starting | The first replicas get no state transfer, so nobody can send before everyone is in |
| getSyncedBalance does not block the command loop | The only way to observe the naive/correct difference and keep the command file's timing |
| Markers get their own ids (`sync-0`, `sync-1`, …) | `outstanding_counter` only numbers deposit and addInterest, so `checkTxStatus N` hits the right transaction |
| `leave()` on exit | A planned leave should not wait 5 s and end as FAIL |
| Server name = PID + random suffix | The name is part of every transaction id, and a PID alone is only unique on one machine |
| Timeouts on calls the server makes while holding a lock | A frozen replica must not be able to block the server |

### Questions worth being able to answer

- **Why not let the banks send to each other directly?** Messages could arrive in different orders at different replicas. Without a central server you need a distributed ordering algorithm, for example with Lamport clocks. A sequencer is the simplest way to get total order.
- **Isn't the server a single point of failure?** Yes, and a bottleneck, since all traffic goes through it. The assignment does not ask us to solve that. In a real system the sequencer would itself be replicated with a consensus protocol like Raft or Paxos.
- **What does sequential consistency mean here?** The result is as if all operations ran in one order, where each replica's own operations appear in the order it issued them. The server makes the single order, and the inbox is sent as a list, so each replica's own order is kept.
- **Is getQuickBalance wrong?** No, it is deliberately weaker. It is fast and needs no communication, but can miss transactions that are not ordered yet.
- **What if a replica is just slow, not dead?** If it does not answer within 5 s it is removed anyway. That is the classic trade-off with timeout-based failure detection: you cannot tell a slow process from a dead one.
- **Why send transactions and not the new balance?** That is what makes it a replicated state machine, and it gives every replica the same history and order numbers. Sending balances would mean someone has to decide which one wins when two changes happen at once.
- **Why are the replicas equal when the timestamps in the logs differ?** The timestamps are local: when each replica executed the transaction. What has to match is the order and the order number, and it does.
- **Why is the inbox only sent every 10 seconds?** The assignment says so. It batches transactions into fewer messages and ACK rounds, at the cost of up to 10 s of extra delay.

---

## Assignment 3: Chord Peer-to-Peer Lookup

*Status: upcoming.*

An implementation of the core of the **Chord** protocol in a provided simulator: hashing nodes onto an *m*-bit identifier ring, building each node's finger table, and routing key lookups across the ring in a logarithmic number of hops. Results are measured as the average hop count for networks of 10, 100 and 1,000 nodes.

---

## Repositories

| Assignment | Repository |
|---|---|
| A1: Java RMI statistics service | [IN5020-A1-G1-RMI](https://github.com/philipfleischer/IN5020-A1-G1-RMI) |
| A2: Replicated bank account | [IN5020-A2-G1-RBA](https://github.com/philipfleischer/IN5020-A2-G1-RBA) |
| A3: Chord protocol | IN5020-A3-G1-CP (private while the course runs) |
