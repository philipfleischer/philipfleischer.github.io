---
title: "ZTC: Zero-Trust Continuum"
subtitle: "A zero-trust security architecture for the edge-fog-cloud continuum, applied to critical energy infrastructure. Where should access decisions be made, which credentials fit a moving system, and how does trust follow a service when it migrates?"
image: "/img/ZTC.png"
tags: ["Zero Trust", "Security Architecture", "Fog & Edge", "IAM", "Go", "OMNeT++", "Docker", "Kubernetes", "IEC 62443", "NIST SP 800-207"]
topics: ["Security", "Cloud / DevOps", "Networking", "Systems"]
featured: true
order: 1
badge: "Main project"
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/zero-trust-continuum"
---

My main personal project, and the one that best shows the kind of work I want to do: designing how a system should be structured, how access and trust are handled across it, and which trade-offs are made between security, performance and robustness. It is also a candidate topic for my master's thesis. That is still an idea at this stage and not settled.

## The problem

Zero trust ("never trust, always verify") is well established in the cloud, but it quietly assumes a stable, well-connected and centrally managed infrastructure. Fog and edge computing break those assumptions:

- devices join and leave all the time
- links can be slow, or cut off from the cloud entirely
- nodes may be owned by different parties
- tasks move between edge, fog and cloud while the system is running

Every time a task moves, the set of components that can see or touch its data changes, so the trust boundary has to be redrawn. In critical infrastructure such as the power grid this matters a lot. A wrong decision can cause an outage, and adding too much latency means a protection function reacts too late.

## The scenario: a digital substation

ZTC models a smart-grid substation spread over three layers:

- **Cloud** (control centre): certificate authority with short-lived identities, a replicated policy decision point (PDP), telemetry pipeline, analytics and monitoring
- **Fog** (the substation): task execution and offloading, a policy enforcement point (PEP) acting as an mTLS gateway, and an intrusion detection service for industrial protocols (Modbus/TCP, IEC 61850 GOOSE)
- **Edge** (field devices): simulated IEDs, PMUs, RTUs, smart meters and EV chargers

Every arrow between those layers crosses a trust boundary. No component trusts another because of where it sits on the network. Every request carries a verifiable identity (a SPIFFE-style ID in a short-lived X.509 certificate), is authorized by a policy decision (attribute-based rules plus a continuously updated trust score) and is enforced at a PEP. Zones and conduits follow **IEC 62443**, and the overall model follows **NIST SP 800-207**. Network segmentation is expressed three ways (Cisco VLANs/ACLs, Docker networks and Kubernetes NetworkPolicies) so the same security model can be checked at three layers.

## The design questions

| # | Question |
|---|---|
| 1 | **Where should the policy decision point live?** Cloud only, replicated in the fog, or a hierarchy with a cloud authority and a fog cache. What does each option cost in decision latency, availability when the WAN is down, and how stale a revocation can get? |
| 2 | **Which credential model fits a dynamic continuum?** Bearer tokens, certificates (mTLS) or attenuable capabilities. Overhead, revocation speed, and delegation along an offloading chain. |
| 3 | **How does trust follow a migrating service?** Full re-authentication, pre-authentication or token handover. Migration downtime against the window where something is exposed. |
| 4 | **Does continuous verification catch a compromised device fast enough?** Trust-score decay and IDS signals against lateral movement. |

## How it is built

The plan is one shared model (trust score, policy rule, credential, decision cache, migration protocol) that exists in two places on purpose: a reference implementation and a simulation used for evaluation.

- **Reference implementation** in Go, standard library only, so the cryptography, the Raft log and the APIs stay readable end to end
- **Simulation and evaluation** in OMNeT++ with a C++ core, recording the latency, availability and security signals the design questions ask about
- **Deployment** with Docker Compose and Kubernetes (default-deny NetworkPolicies), infrastructure as code with Terraform and Ansible, monitoring with Prometheus and Grafana
- **Analysis** in Python: result parsing, telemetry features and anomaly detection

It also works as a companion to my current courses: it pulls together fog offloading and placement from IN5700, consensus and replication (Raft, gossip, Chord) from IN5020, and industrial security standards and zone models from TEK5520.

## Status

This is a long-running project and it is early. The architecture, scenario and design questions are defined, the repository foundation and CI are in place, and the first Go packages (the continuum model, access request and decision types, configuration) are written. The milestones ahead are the decision chain (policy, trust, PDP, PEP), the fog node and IDS, the distributed-systems parts, and finally the simulation and evaluation. Progress is tracked openly in `STATUS.md` in the repository.
