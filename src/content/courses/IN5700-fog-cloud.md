---
title: "IN5700: Fog and Cloud Computing"
courseCode: "IN5700"
subtitle: "Master's course on designing systems across the edge-fog-cloud continuum. Highlight: a group project in OMNeT++ comparing a cloud-based and a fog-based smart garbage collection system, where the fog design spent about 3.9 times less time on the network."
image: "/img/IN5700.png"
tags: ["OMNeT++", "C++", "INET", "Fog Computing", "Cloud", "Simulation", "Performance Analysis"]
topics: ["Cloud", "Distributed Systems", "Networking"]
year: 2026
order: 1
badge: "Autumn 2026"
links: []
---

**IN5700: Fog and Cloud Computing** at the University of Oslo, autumn 2026. The course covers how to specify, design, implement and analyse fog computing systems and applications, and how fog relates to cloud and near-far computing. Topics include the fog programming model, security, offloading, software-defined networking (SDN), load balancing, communication, containers and orchestration, and application areas like machine learning and healthcare. A recurring question is which approach fits a given problem best, and how to measure and analyse the performance of the result.

This is the course closest to the direction I want to work in, and it is where my [Zero-Trust Continuum](/projects/zero-trust-continuum) project comes from.

## Group project: Smart garbage collection with fog and cloud computing

*Group 10, three members. Built in OMNeT++ 6.4 with INET 4.7.*

A garbage truck drives along three streets. The driver's smartphone asks two smart garbage cans whether they are full, and if a can is full, the central garbage site in the cloud is told so the can gets emptied. The point of the project is to compare two architectures for the same job:

- **Cloud-based**: the smartphone tells the cloud over a slow 4G/LTE link
- **Fog-based**: each full can tells the cloud itself over a fast fiber connection
- **No garbage**: a baseline where the cans are empty and the cloud is never contacted

The first three questions to each can are deliberately lost, so the smartphone has to detect the loss with a timeout and retransmit.

### Design choices
- A shared `NodeBase` class handles creating, sending and counting messages, so the smartphone, cans and cloud only contain their own logic
- Link parameters are based on real technologies and justified in the report: Wi-Fi 802.11g (54 Mbit/s, 5 ms), LTE plus internet to a data centre (10 Mbit/s, 75 ms) and street-level fiber (1 Gbit/s, 10 ms)
- Because the simulation uses plain messages rather than packets, transmission time (size divided by data rate) is calculated explicitly and added on top of the link delay
- The truck moves with INET's mobility model along a scripted route and parks at each can while it asks

### Results
Both garbage scenarios send the same number of messages (14). The difference is *which links* they use. In the cloud-based design four messages cross the slow mobile link, in the fog-based design none do.

| | Cloud-based | Fog-based | No garbage |
|---|---|---|---|
| Messages sent | 14 | 14 | 10 |
| Messages on the slow link | 4 | 0 | 0 |
| Total time on links (sending) | 350.4 ms | 90.1 ms | 50.1 ms |

The fog-based design spent about **3.9 times less** time on the network when sending and about **5.3 times less** when receiving. From the point of view of one full can, the cloud knew about it after 10 ms in the fog design and after 80 ms in the cloud design.

The most useful finding was that the link delays were not the real bottleneck. The 1-second retransmission timeout cost 3 seconds per can, far more than all the link delays combined. The report proposes improvements on that basis: an adaptive timeout based on measured round-trip time, letting the cans push a notification when their sensor says they are full instead of being polled, batching requests over the slow link, and 5G with an edge server to cut the mobile delay.

## Individual work: OMNeT++ labs and assignment

My course repository holds the individual work, including the mandatory **FogCloudProject** assignment: a computer and a cloud node exchanging messages over 100 ms links, where the cloud drops the first test messages and the computer recovers with a self-scheduled retransmission timer until it receives an acknowledgement. The same repository has the queueing, source-sink and Ethernet models I built while learning OMNeT++.

I am also presenting the research paper *Fogify: A Fog Computing Emulation Framework* (IEEE/ACM SEC 2020) together with a fellow student, covering why fog systems need their own testbeds, where existing simulators and emulators fall short, and how Fogify is designed.

## Repositories

| Work | Repository |
|---|---|
| Group project: smart garbage collection | group10-FC-2026 (private while the course runs) |
| Individual assignment and labs | Fog--and-Cloud-Computing (private while the course runs) |

The reports, code and simulation videos are available on request.
