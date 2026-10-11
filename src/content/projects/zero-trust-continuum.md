---
title: "ZTC: Zero-Trust Continuum"
subtitle: "A zero-trust security architecture for the edge-fog-cloud continuum, applied to critical energy infrastructure. Where should access decisions be made, which credentials fit a moving system, and how does trust follow a service when it migrates?"
image: "/img/ZTC.png"
tags:
  - "Zero Trust"
  - "Security Architecture"
  - "IAM"
  - "Fog & Edge"
  - "Go"
  - "Kubernetes"
  - "Threat Modeling"
  - "STRIDE"
  - "Defence in Depth"
  - "NIST SP 800-207"
  - "IEC 62443"
  - "IEC 61850"
  - "MITRE ATT&CK for ICS"
  - "Purdue Model"
  - "ABAC"
  - "mTLS"
  - "PKI / X.509"
  - "SPIFFE"
  - "Intrusion Detection"
  - "Distributed Systems"
  - "Raft"
  - "SWIM Gossip"
  - "Chord"
  - "Logical Clocks"
  - "C++"
  - "Python"
  - "OMNeT++"
  - "Docker"
  - "Docker Compose"
  - "k3s"
  - "Kustomize"
  - "Helm"
  - "Terraform"
  - "Ansible"
  - "OpenStack"
  - "Cisco IOS"
  - "VLANs & ACLs"
  - "IPsec"
  - "802.1X"
  - "containerlab"
  - "Prometheus"
  - "Grafana"
  - "DevSecOps"
  - "GitHub Actions"
  - "CodeQL"
  - "Trivy"
  - "gosec"
  - "govulncheck"
  - "gitleaks"
  - "SBOM"
  - "Dependabot"
  - "Raspberry Pi"
topics: ["Security", "Cloud / DevOps", "Distributed Systems", "Networking", "Systems"]
featured: true
order: 1
badge: "Main project"
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/zero-trust-continuum"
  - label: "Architecture diagrams"
    url: "https://github.com/philipfleischer/zero-trust-continuum/tree/main/Docs/diagrams"
---

My main personal project, and the one that best shows the kind of work I want to do: designing how a system should be structured, how access and trust are handled across it, and which trade-offs are made between security, performance and robustness. It is also a candidate topic for my master's thesis. That is still an idea at this stage and not settled.

This page walks through the design from the big picture down to the individual building blocks. All the diagrams are ones I drew while planning the project. They are early working drafts and will change as the code catches up, but they show how I think about the system and how I plan to build it. Each diagram is meant to make sense on its own, and the text around it is there to help you get into it quickly. **Click any diagram to see it in full size.**

## At a glance

- **What:** a zero-trust security architecture for systems that are spread over field devices, local servers and the cloud.
- **Where:** a digital power substation, where a wrong or slow access decision has physical consequences.
- **Core idea:** nothing is trusted because of where it sits on the network. Every single request is checked, and trust is re-evaluated all the time.
- **Built with:** Go, C++ with OMNeT++, Python, Docker, Kubernetes, Terraform, Ansible and Cisco IOS.
- **Standards:** NIST SP 800-207 (zero trust), IEC 62443 (industrial security), IEC 61850 (substation communication) and MITRE ATT&CK for ICS.
- **Status:** early. The design is in place, and the foundation and the first decision-making parts are implemented.

## The problem

Zero trust ("never trust, always verify") is well established in the cloud, but it quietly assumes a stable, well-connected and centrally managed infrastructure. Fog and edge computing break those assumptions:

- devices join and leave all the time
- links can be slow, or cut off from the cloud entirely
- nodes may be owned by different parties
- tasks move between edge, fog and cloud while the system is running

Every time a task moves, the set of components that can see or touch its data changes, so the trust boundary has to be redrawn. In critical infrastructure such as the power grid this matters a lot. A wrong decision can cause an outage, and adding too much delay means a protection function reacts too late.

## The scenario: a digital substation

ZTC models a smart-grid substation spread over three layers:

- **Cloud** (the control centre): issues identities, makes access decisions, stores telemetry and runs monitoring.
- **Fog** (the substation itself): local servers that enforce access, run tasks close to the devices and watch for intrusions.
- **Edge** (field devices): measurement units, smart meters, circuit breakers, remote terminal units and EV chargers, all simulated.

Between each layer there is a trust boundary. No component trusts another because of where it sits on the network. Every request carries a verifiable identity, is judged by a policy that also looks at how trustworthy the sender seems right now, and is enforced before it reaches anything that matters.

### How to read the diagrams

The same visual language is used in every diagram, so a colour or line style always means the same thing.

| Element | Meaning |
|---|---|
| Blue | cloud / control centre |
| Green | fog / substation |
| Orange | edge / field devices |
| Purple | the buffer zone (DMZ) and wide-area network between substation and control centre |
| Red | an attacker, a security-critical control or a known limitation |
| Yellow note | why something is designed the way it is |
| Solid black arrow | a request or data on its way |
| Dashed red arrow | a trust signal (the system re-checking itself) |
| Dashed blue arrow | control traffic, such as "throw away old decisions" |
| Thick dashed red line | a trust boundary |

## The big picture

This is the finished system I am working towards. Everything else on this page is a zoomed-in part of this picture.

<figure class="diagram">
  <a href="/img/ztc/00-system-overview-1.svg"><img src="/img/ztc/00-system-overview-1.svg" alt="Target architecture of ZTC: cloud control centre, OT-DMZ, fog substation and edge devices, with the numbered zero-trust cycle" width="1784" height="1119" loading="lazy" /></a>
  <figcaption><strong>Target architecture.</strong> The four horizontal bands are the layers of the substation, from the control centre at the top to the field devices at the bottom. Follow the circled numbers ① to ⑥ to see one full cycle of zero trust.</figcaption>
</figure>

### One full cycle, in six steps

1. A field device proves who it is and sends a request together with its credential.
2. The gatekeeper on the substation, called the Policy Enforcement Point (PEP), asks whether the request is allowed.
3. If it has no recent answer stored, it asks the Policy Decision Point (PDP) in the control centre.
4. If the answer is yes, the request goes through to the fog node that does the actual work.
5. An intrusion detection system watches the traffic. If a device starts behaving oddly, its trust score goes down.
6. The control centre tells every gatekeeper to throw away its stored answers, so the next request from that device is denied.

### Choices that shape everything

- **Deciding and enforcing are separate jobs.** One central place holds the rules and makes decisions, and lightweight gatekeepers sit next to the workloads. A compromised gatekeeper cannot change the rules.
- **Identity, never location.** Being on the substation network grants nothing. A rogue laptop plugged into the substation is exactly the threat.
- **Fail closed.** If the decision service cannot be reached, the answer is no. An attacker who cuts the network cable must not be able to switch access control off.
- **Safety comes first.** Protection signals that trip a breaker within milliseconds are observed, but never delayed by access checks.

## The four design questions

The project is built around four open questions. Each one comes from a way the fog differs from the cloud, and each one is answered with measurements at the end.

| # | Question | Where on this page |
|---|---|---|
| RQ1 | **Where should access decisions be made?** In the cloud only, in a hierarchy with a cache on the substation, or with a full copy on the substation. What does each cost in speed, availability when the network is down, and how out of date a decision can get? | [Where decisions are made](#where-should-decisions-be-made) |
| RQ2 | **Which kind of credential fits a moving system?** Tokens, certificates or capabilities that can be narrowed down. Overhead, how fast they can be revoked, and how they pass along a chain of tasks. | [Credentials and trust](#credentials-and-trust) |
| RQ3 | **How does trust follow a service that moves?** Re-authenticate from scratch, prepare the new host in advance, or hand over a short-lived ticket. Downtime against exposure. | [When a service moves](#when-a-service-moves) |
| RQ4 | **Does continuous checking catch a compromised device fast enough?** How quickly a device that is logged in but misbehaving is locked out. | [Catching a compromised device](#catching-a-compromised-device) |

## The plan: one layer at a time

The system is built in eight milestones, M0 to M7. Each one ends with a working, tagged version of the system, and each one adds one layer until the result matches the big picture above. I build a thin version of the whole chain first and widen it afterwards, so integration problems show up early and there is always something that runs.

<figure class="diagram">
  <a href="/img/ztc/01-architecture-evolution-1.svg"><img src="/img/ztc/01-architecture-evolution-1.svg" alt="Eight milestone cards from M0 Foundation to M7 Infrastructure" width="1712" height="871" loading="lazy" /></a>
  <figcaption><strong>Milestones.</strong> Read left to right, top to bottom. Each card says what the milestone adds and what the system can do afterwards.</figcaption>
</figure>

<figure class="diagram">
  <a href="/img/ztc/01-architecture-evolution-2.svg"><img src="/img/ztc/01-architecture-evolution-2.svg" alt="Matrix of services against milestones showing where each is introduced and extended" width="1740" height="610" loading="lazy" /></a>
  <figcaption><strong>How the components grow.</strong> A filled dot marks where a service is introduced, a half dot where it is extended. Most parts start small and grow without being rewritten.</figcaption>
</figure>

A few rules keep this manageable:

- The main branch always builds, passes its tests and runs the demo.
- Big features, like encrypted connections between services, are added behind a switch and only become the default once they work.
- Security analysis (the threat model and the zone model) is pulled early, so it shapes the design instead of auditing it afterwards.
- Every important decision is written down as a short decision record in the same change as the code.

The sections below follow the milestones.

## Foundation: every service built the same way

*Milestone M0.* Before any security feature, every service gets the same base: configuration, logging, metrics, health checks and a clean shutdown. A fix to this base lands in all services at once.

<figure class="diagram">
  <a href="/img/ztc/03-m0-service-foundation-1.svg"><img src="/img/ztc/03-m0-service-foundation-1.svg" alt="The shared service shell: configuration, logger, metrics, health endpoints, HTTP server and graceful shutdown" width="1482" height="831" loading="lazy" /></a>
  <figcaption><strong>One service shell.</strong> The path every service takes when it starts, and the outside systems (monitoring, Kubernetes, logs, CI) that rely on it.</figcaption>
</figure>

<figure class="diagram">
  <a href="/img/ztc/03-m0-service-foundation-2.svg"><img src="/img/ztc/03-m0-service-foundation-2.svg" alt="Go package layering in five layers with imports only pointing downwards" width="1502" height="875" loading="lazy" /></a>
  <figcaption><strong>Code layering.</strong> Five layers, and code only depends on the layers below it. The bottom layer depends on nothing, so it can be mirrored one to one in the simulation later.</figcaption>
</figure>

**Why it is designed this way**

- **Only Go's standard library.** No third-party code in the security path, so the whole path can be read and reviewed, and there are fewer supply-chain risks.
- **Fail fast on bad configuration.** A typo in a setting should stop a service at start, not make it quietly run in the wrong mode.
- **"Alive" and "ready" are different.** A decision service without a policy loaded is alive (do not restart it) but not ready (do not send it traffic).

## The decision chain: how one request is judged

*Milestone M1.* This is the heart of zero trust: the chain from a request arriving to a yes or no.

### Zero trust, by the book

The design follows NIST SP 800-207, the US standard that describes zero trust. A simple way to picture it: every door in a building has a guard (the PEP). The guard does not decide anything alone, but calls a central desk (the PDP) that knows the rules and everyone's current standing. The desk decides, the guard enforces, and the guard lets exactly one approved visit through at a time.

<figure class="diagram">
  <a href="/img/ztc/02-nist-zta-mapping-1.svg"><img src="/img/ztc/02-nist-zta-mapping-1.svg" alt="NIST SP 800-207 logical architecture with each box labelled with the ZTC component that implements it" width="1502" height="1065" loading="lazy" /></a>
  <figcaption><strong>NIST SP 800-207 mapping.</strong> The standard's reference picture, with every box labelled with the ZTC part that fills that role. The inputs on both sides feed the decision.</figcaption>
</figure>

### The two halves: gatekeeper and decision point

<figure class="diagram">
  <a href="/img/ztc/04-m1-decision-chain-1.svg"><img src="/img/ztc/04-m1-decision-chain-1.svg" alt="Components inside the PEP and the PDP" width="1722" height="961" loading="lazy" /></a>
  <figcaption><strong>Inside the PEP and the PDP.</strong> On the left, the seven steps a request passes in the gatekeeper. On the right, how the decision point combines the rules with the current trust score.</figcaption>
</figure>

### One request, step by step

<figure class="diagram">
  <a href="/img/ztc/04-m1-decision-chain-2.svg"><img src="/img/ztc/04-m1-decision-chain-2.svg" alt="Sequence diagram of a telemetry write from a measurement unit through PEP and PDP" width="1540" height="1121" loading="lazy" /></a>
  <figcaption><strong>Request sequence.</strong> A measurement unit sends a reading. Read top to bottom. The red frame at the bottom shows the three ways it can fail: bad credential, denied by policy, or decision service unreachable. All three end in a no.</figcaption>
</figure>

### How the rules decide

<figure class="diagram">
  <a href="/img/ztc/04-m1-decision-chain-3.svg"><img src="/img/ztc/04-m1-decision-chain-3.svg" alt="Flowchart of policy evaluation and the default substation policy with thirteen rules" width="1601" height="971" loading="lazy" /></a>
  <figcaption><strong>Policy evaluation.</strong> The flowchart: any matching deny wins, and if nothing allows the request, it is denied. On the right, the full default policy for the substation, thirteen rules from "deny anyone with low trust" to "who may change the policy".</figcaption>
</figure>

**Why it is designed this way**

- **Rules based on attributes, with trust as one of them.** Roles say *who*. Zero trust also needs *where* (zone), *when* (time, emergency) and *how much* (trust). Putting the trust score in as an ordinary attribute keeps the rules simple.
- **A deny always wins, and the default is deny.** Adding a rule can never open something another rule closes, and a broken rule makes the system stricter, not looser.
- **The decision point owns time and trust.** If the caller could send them, it could replay old timestamps or claim to be more trusted than it is.
- **Short answers for dangerous actions.** Permission to operate a breaker is only valid for 10 seconds, and emergency access for 1 second, so those decisions are made again often.

## Credentials and trust

*Milestone M1, design questions RQ2 and RQ4.* How a device proves who it is, how much the system trusts it right now, and how stored decisions are kept from going stale.

### Three kinds of credentials

<figure class="diagram">
  <a href="/img/ztc/05-m1-credentials-and-trust-1.svg"><img src="/img/ztc/05-m1-credentials-and-trust-1.svg" alt="Comparison of bearer tokens, attenuable capabilities and X.509 certificates over mutual TLS" width="1722" height="1017" loading="lazy" /></a>
  <figcaption><strong>Three credential models.</strong> The same gatekeeper accepts all three, so they can be compared fairly on the same request path.</figcaption>
</figure>

- **Signed tokens** are like a stamped visitor pass: simple, checked without asking anyone, but whoever holds the pass can use it.
- **Capabilities** are passes that anyone can narrow down further (only this task, only this device, only for 30 seconds), but nobody can widen. That makes them a good fit for handing work along a chain.
- **Certificates over mutual TLS** prove that the holder also has a secret key, and they encrypt the connection. They are the strongest of the three.

### The trust score

<figure class="diagram">
  <a href="/img/ztc/05-m1-credentials-and-trust-2.svg"><img src="/img/ztc/05-m1-credentials-and-trust-2.svg" alt="Trust algorithm: signals from PEP, attestation, IDS and PDP combined into a decaying score with four levels" width="1722" height="852" loading="lazy" /></a>
  <figcaption><strong>Trust algorithm.</strong> Signals on the left (how the device logged in, its health, its behaviour, recent denials) are combined into one score between 0 and 1, which maps to four levels the rules can use.</figcaption>
</figure>

The score is not fixed. A login counts for less as time passes (it halves every five minutes), so a sensitive action like operating a breaker needs a recent, strong login. A clear sign of compromise drops the score straight to zero.

### Remembering decisions without opening a hole

<figure class="diagram">
  <a href="/img/ztc/05-m1-credentials-and-trust-3.svg"><img src="/img/ztc/05-m1-credentials-and-trust-3.svg" alt="Decision cache rules: TTL, policy version, revocation epoch and invalidate-on-deny" width="1722" height="712" loading="lazy" /></a>
  <figcaption><strong>Decision cache and revocation.</strong> When a stored answer may be reused, and the events that throw it away.</figcaption>
</figure>

Storing decisions on the substation keeps things fast, but a stored "yes" is a decision made under old conditions. If a device's trust drops and the cache does not notice, the system keeps letting in a device it would now refuse. So a stored answer is only used while it is fresh, while the policy is unchanged, and while no revocation has happened. As soon as a device is denied once, all its stored "yes" answers are dropped.

## Where should decisions be made?

*Design question RQ1.* The same gatekeeper and the same rules, in three different placements, chosen with one setting.

<figure class="diagram">
  <a href="/img/ztc/06-rq1-pdp-placement-1.svg"><img src="/img/ztc/06-rq1-pdp-placement-1.svg" alt="Three PDP placements: cloud only, hierarchical with fog cache, and fog replica, with a trade-off table" width="1723" height="992" loading="lazy" /></a>
  <figcaption><strong>Three placements.</strong> Each column is one option. The table at the bottom summarises the expected trade-offs, which the simulation will measure.</figcaption>
</figure>

- **Cloud only:** always up to date, but if the connection to the control centre is cut, everything is denied.
- **Hierarchical (the default):** a cache on the substation answers repeated requests locally, and the cloud is asked only when needed. During an outage, recent answers survive for a short time.
- **Copy on the substation:** keeps deciding during an outage, at the cost of keeping copies in sync and putting more on a less protected machine.

This is the classic trade-off between consistency and availability. What I would pick for a real utility: hierarchical by default, a local copy at sites with unreliable links, and short lifetimes on dangerous actions everywhere. Whatever the choice, the system never opens up to stay available. Availability must come from placement, not from switching access control off.

## Catching a compromised device

*Milestone M2, design question RQ4.* A device with valid credentials can still be compromised. This part closes the loop that makes the system zero trust rather than a perimeter: watching behaviour and acting on it.

### The data pipeline

<figure class="diagram">
  <a href="/img/ztc/07-m2-fog-telemetry-ids-1.svg"><img src="/img/ztc/07-m2-fog-telemetry-ids-1.svg" alt="Telemetry pipeline from edge devices through PEP and fog node to IDS and upstream aggregates" width="1722" height="880" loading="lazy" /></a>
  <figcaption><strong>Telemetry pipeline.</strong> Readings flow left to right: devices, gatekeeper, fog node. The fog node checks every reading, feeds the intrusion detection, and sends only one-second summaries to the cloud.</figcaption>
</figure>

The fog node sees every raw reading (50 per second), so detection does not depend on the cloud connection. Only summaries cross the network, about 50 times less traffic.

### From anomaly to lock-out

<figure class="diagram">
  <a href="/img/ztc/07-m2-fog-telemetry-ids-2.svg"><img src="/img/ztc/07-m2-fog-telemetry-ids-2.svg" alt="Lock-out loop: compromised PMU, IDS alert, trust signal, revocation epoch, cache flush, denied request" width="1722" height="957" loading="lazy" /></a>
  <figcaption><strong>The lock-out loop.</strong> Follow ① to ⑥. The bar at the bottom splits the time the attacker still has access into three parts: time to detect, time to send the signal, and how long old cached answers can live.</figcaption>
</figure>

A compromised measurement unit starts sending false readings. They are still allowed at first, because the device is logged in and allowed to send data. The intrusion detection spots the unusual values and reports it. The decision point marks the device as compromised and tells every gatekeeper to drop its stored answers, and the very next request is denied. The detection system never blocks anything itself. It only reports, so there is still one place that makes decisions.

### A log nobody can quietly edit

<figure class="diagram">
  <a href="/img/ztc/07-m2-fog-telemetry-ids-3.svg"><img src="/img/ztc/07-m2-fog-telemetry-ids-3.svg" alt="Hash-chained audit log where each entry contains the hash of the previous one" width="1722" height="522" loading="lazy" /></a>
  <figcaption><strong>Audit log.</strong> Each entry includes a fingerprint (hash) of the one before. Changing any entry breaks every link after it, and the verification tool points out the first broken one.</figcaption>
</figure>

## No single point of failure

*Milestone M3.* If the decision point is one machine, it is one machine to break or attack. This part spreads the system over several machines, using the same algorithms I work with in my distributed-systems course.

### A replicated decision point

<figure class="diagram">
  <a href="/img/ztc/08-m3-distributed-systems-1.svg"><img src="/img/ztc/08-m3-distributed-systems-1.svg" alt="Three PDP replicas sharing a Raft log of policy installs and revocations" width="1722" height="972" loading="lazy" /></a>
  <figcaption><strong>Raft cluster.</strong> Three copies of the decision point. Changes (new policy, revocations) go to the leader and only count once a majority has them. Decisions can be read from any copy.</figcaption>
</figure>

### Knowing who is alive

<figure class="diagram">
  <a href="/img/ztc/08-m3-distributed-systems-2.svg"><img src="/img/ztc/08-m3-distributed-systems-2.svg" alt="SWIM failure detection: direct ping, indirect ping, suspect, dead" width="1722" height="891" loading="lazy" /></a>
  <figcaption><strong>SWIM membership.</strong> Fog nodes check on each other without a central registry: direct ping, then asking others to ping, then suspicion, and only then declared dead. One slow link does not cause a false alarm.</figcaption>
</figure>

### Where device data lives

<figure class="diagram">
  <a href="/img/ztc/08-m3-distributed-systems-3.svg"><img src="/img/ztc/08-m3-distributed-systems-3.svg" alt="Chord ring with fog nodes and device keys and a finger table" width="1721" height="819" loading="lazy" /></a>
  <figcaption><strong>Chord placement.</strong> Devices and fog nodes are placed on one ring. A device's state lives on the next fog node clockwise, so there is no central table to lose.</figcaption>
</figure>

### Putting events in the right order

<figure class="diagram">
  <a href="/img/ztc/08-m3-distributed-systems-4.svg"><img src="/img/ztc/08-m3-distributed-systems-4.svg" alt="Hybrid logical clocks stamping events on several nodes" width="1722" height="640" loading="lazy" /></a>
  <figcaption><strong>Logical clocks.</strong> Events get timestamps that respect cause and effect, so logs from several machines can be merged into one timeline during an incident.</figcaption>
</figure>

A design point worth noting: membership information is only a hint about who is alive. It never grants access. The gatekeeper still decides every call.

## Placing work and running it safely

*Milestone M4.* Choosing where to run a task, and packaging the whole system so that the network separation is built in.

### Trust-aware offloading

<figure class="diagram">
  <a href="/img/ztc/09-m4-offloading-containers-1.svg"><img src="/img/ztc/09-m4-offloading-containers-1.svg" alt="Offloading decision using latency, energy and risk, with an attenuated capability for the target" width="1722" height="821" loading="lazy" /></a>
  <figcaption><strong>Offloading.</strong> A fog node picks where to run a task by weighing speed, energy and risk, where risk is how little the target is trusted. The chosen node gets a narrowed pass that lets it run only this task, briefly.</figcaption>
</figure>

A fast but untrusted node is never chosen, and nodes below a minimum trust level are excluded completely, so the cost model can never be tuned into an unsafe choice.

### Containers, one network per zone

<figure class="diagram">
  <a href="/img/ztc/09-m4-offloading-containers-2.svg"><img src="/img/ztc/09-m4-offloading-containers-2.svg" alt="Docker Compose networks per security zone with containers attached only where needed" width="1722" height="901" loading="lazy" /></a>
  <figcaption><strong>Docker Compose zones.</strong> Each horizontal bar is a network for one security zone, and the dots show which containers join it. A container on two networks is a deliberate crossing point.</figcaption>
</figure>

### Kubernetes

<figure class="diagram">
  <a href="/img/ztc/09-m4-offloading-containers-3.svg"><img src="/img/ztc/09-m4-offloading-containers-3.svg" alt="Kubernetes namespace with zone-labelled pods, StatefulSet PDP and default-deny network policies" width="1722" height="861" loading="lazy" /></a>
  <figcaption><strong>Kubernetes.</strong> Everything is blocked by default, and one rule per allowed crossing opens exactly the ports it needs. The decision point runs as three stable copies, and maintenance can never take away the majority.</figcaption>
</figure>

Containers are minimal: no shell, not running as root, read-only file system. That leaves very little for an attacker to work with, and the separation is proven by a test that tries forbidden connections from inside the containers.

## Zones and conduits

*Milestone M5.* Industrial networks are split into zones with controlled crossings between them, following the IEC 62443 standard. ZTC uses both: network separation shrinks what an attacker can reach, and identity checks stop the attacker who is already inside a zone.

<figure class="diagram">
  <a href="/img/ztc/10-m5-iec62443-zones-1.svg"><img src="/img/ztc/10-m5-iec62443-zones-1.svg" alt="Six IEC 62443 zones stacked by Purdue level with conduits and security levels" width="1722" height="930" loading="lazy" /></a>
  <figcaption><strong>Zones and conduits.</strong> Six zones stacked from the enterprise at the top to the protection devices at the bottom, each with a target security level. Arrows are the only allowed crossings. The red arrow is an example the model rejects: a shortcut from the field straight to the control centre that skips the buffer zone.</figcaption>
</figure>

<figure class="diagram">
  <a href="/img/ztc/10-m5-iec62443-zones-2.svg"><img src="/img/ztc/10-m5-iec62443-zones-2.svg" alt="One zone model exported to Kubernetes, Cisco ACLs, Docker Compose and OpenStack security groups" width="1721" height="701" loading="lazy" /></a>
  <figcaption><strong>One model, four layers.</strong> The zone model is written once, checked, and then turned into Kubernetes rules, Cisco switch rules, Docker networks and cloud firewall groups.</figcaption>
</figure>

Hand-written copies of the same rules in four places will drift apart over time. Generating them from one model, and failing the build if any copy is edited by hand, keeps them the same.

## Threat model

*Milestone M5.* Where could an attacker get in, and what stops them?

<figure class="diagram">
  <a href="/img/ztc/11-m5-threat-model-1.svg"><img src="/img/ztc/11-m5-threat-model-1.svg" alt="Data-flow diagram with six trust boundaries and the STRIDE threat table" width="1722" height="1331" loading="lazy" /></a>
  <figcaption><strong>Data flows and trust boundaries.</strong> The red dashed lines are the six places where trust changes. The table below lists sixteen threats, which boundary each one crosses, the control that answers it, and the risk that is left.</figcaption>
</figure>

I used STRIDE, a checklist of six threat types (spoofing, tampering, repudiation, information disclosure, denial of service and elevation of privilege), applied at each trust boundary, because boundaries are where controls must sit. Every threat points to a concrete control in the code, so a threat without one stands out as a gap. Impact is scored for a power grid, where the worst case is loss of grid control or safety. What is left over and what is out of scope is written down, not hidden.

<figure class="diagram">
  <a href="/img/ztc/11-m5-threat-model-2.svg"><img src="/img/ztc/11-m5-threat-model-2.svg" alt="Five nested defence-in-depth layers and an Industroyer-style attack walk-through" width="1722" height="922" loading="lazy" /></a>
  <figcaption><strong>Defence in depth.</strong> Five layers around what must be protected (breaker control, protection settings, correct measurements). The table follows a real-world style attack on the grid step by step and names the layer that stops or detects each step.</figcaption>
</figure>

## Identity and encrypted connections

*Milestone M5.* Every device and service gets its own identity, carried in a short-lived certificate.

<figure class="diagram">
  <a href="/img/ztc/12-m5-identity-mtls-1.svg"><img src="/img/ztc/12-m5-identity-mtls-1.svg" alt="SPIFFE identity and PKI hierarchy with the enrolment life cycle" width="1721" height="861" loading="lazy" /></a>
  <figcaption><strong>Identity and certificates.</strong> At the top, who signs what. Below, the life of a device identity: the key is created on the device, enrolment uses a one-time code, renewal happens automatically, and revocation is the end.</figcaption>
</figure>

The names describe *what* a workload is (layer, type, name), not *where* it is, so they survive address changes and migration, and the same name is used both for the encrypted connection and in the access rules. The private key never leaves the device, and a device cannot pick its own name.

<figure class="diagram">
  <a href="/img/ztc/12-m5-identity-mtls-2.svg"><img src="/img/ztc/12-m5-identity-mtls-2.svg" alt="Sequence of a request over mutual TLS from enrolment to revocation" width="1540" height="1001" loading="lazy" /></a>
  <figcaption><strong>A request over mutual TLS.</strong> Both sides check each other's certificate before anything is sent. When a device is revoked, its open connections are closed too.</figcaption>
</figure>

Certificates live for a short time and are renewed automatically. A substation may not be able to reach a revocation list during an outage, but an identity that is not renewed simply expires on its own.

## When a service moves

*Milestone M6, design question RQ3.* When a running service moves from one fog node to another, the trust boundary moves with it. The new host must get exactly the rights the service had, the state must not leak on the way, and the old host must lose access.

<figure class="diagram">
  <a href="/img/ztc/13-m6-secure-migration-1.svg"><img src="/img/ztc/13-m6-secure-migration-1.svg" alt="Handover ticket sequence between source fog node, target fog node and a local ticket authority" width="1542" height="822" loading="lazy" /></a>
  <figcaption><strong>Handover ticket.</strong> The old host freezes the service and gives the new host a ticket that is single-use, tied to the new host's key and valid for 10 seconds. The state is sent encrypted so only the new host can open it. After the first decision, nothing here needs the cloud.</figcaption>
</figure>

<figure class="diagram">
  <a href="/img/ztc/13-m6-secure-migration-2.svg"><img src="/img/ztc/13-m6-secure-migration-2.svg" alt="Timelines comparing full re-authentication, pre-authentication and token handover" width="1721" height="831" loading="lazy" /></a>
  <figcaption><strong>Three strategies compared.</strong> Timelines showing downtime and how long credentials sit exposed for each approach, and how failures are handled so there is never more than one running copy.</figcaption>
</figure>

Re-authenticating from scratch at the cloud makes downtime grow with network delay and fails during an outage. Preparing the new host in advance gives short downtime but leaves valid credentials sitting there long before they are needed. The ticket gives both short downtime and a short exposure window.

## Proving it with numbers

*Milestone M6.* The running system shows that the design works. A simulation answers the design questions with numbers, because it can vary network delay, outages, scale and attack timing in controlled, repeatable experiments.

<figure class="diagram">
  <a href="/img/ztc/14-m6-simulation-evaluation-1.svg"><img src="/img/ztc/14-m6-simulation-evaluation-1.svg" alt="Shared model in Go and a C++ core inside OMNeT++, feeding a Python analytics pipeline" width="1641" height="871" loading="lazy" /></a>
  <figcaption><strong>One model, two worlds.</strong> The core logic exists both in the Go services and in a C++ core used by the simulator. Both are tested against the same hand-computed examples, so "the simulation behaves like the real code" is something that is checked, not assumed.</figcaption>
</figure>

<figure class="diagram">
  <a href="/img/ztc/14-m6-simulation-evaluation-2.svg"><img src="/img/ztc/14-m6-simulation-evaluation-2.svg" alt="OMNeT++ network with three substations, fog nodes, edge devices and a cloud PDP" width="1722" height="811" loading="lazy" /></a>
  <figcaption><strong>The simulated network.</strong> Three substations connected to a cloud decision point. One controller cuts a substation's connection, another moves services between fog nodes.</figcaption>
</figure>

<figure class="diagram">
  <a href="/img/ztc/14-m6-simulation-evaluation-3.svg"><img src="/img/ztc/14-m6-simulation-evaluation-3.svg" alt="Evaluation matrix for RQ1 to RQ4 with variables, metrics and hypotheses" width="1721" height="601" loading="lazy" /></a>
  <figcaption><strong>Evaluation plan.</strong> For each design question: what is varied, what is measured, and what I expect to find.</figcaption>
</figure>

Every experiment is repeated with confidence intervals, so differences that fall inside the uncertainty are not claimed. The limits of the simulation are written down, so the results are read the right way.

## Real infrastructure and network

*Milestone M7.* Showing that the same zone model holds all the way down to switches and routers, and that the whole setup can be rebuilt from the repository.

<figure class="diagram">
  <a href="/img/ztc/15-m7-infrastructure-network-1.svg"><img src="/img/ztc/15-m7-infrastructure-network-1.svg" alt="Cisco network design with edge router, core switch and industrial access switch" width="1720" height="820" loading="lazy" /></a>
  <figcaption><strong>Network design.</strong> An edge router with a firewall and an encrypted tunnel to the control centre, a core switch that routes between zones, and an access switch that checks every device that plugs in. One VLAN per zone.</figcaption>
</figure>

<figure class="diagram">
  <a href="/img/ztc/15-m7-infrastructure-network-2.svg"><img src="/img/ztc/15-m7-infrastructure-network-2.svg" alt="Infrastructure as code flow from Terraform to Ansible to Kubernetes" width="1722" height="681" loading="lazy" /></a>
  <figcaption><strong>Infrastructure as code.</strong> Terraform creates the machines and networks, Ansible hardens them and installs Kubernetes, and then the system is deployed, including on Raspberry Pi fog nodes.</figcaption>
</figure>

Each tool does the part it is good at: Terraform describes the infrastructure, Ansible configures it, and Kubernetes runs the services. Clock synchronisation is treated as a security control here, because short-lived certificates fail if clocks drift apart.

## Security in the delivery pipeline

Security checks are part of every change, not a separate phase at the end.

<figure class="diagram">
  <a href="/img/ztc/16-devsecops-pipeline-1.svg"><img src="/img/ztc/16-devsecops-pipeline-1.svg" alt="DevSecOps pipeline from branch to pull request with five parallel groups of checks" width="1722" height="822" loading="lazy" /></a>
  <figcaption><strong>DevSecOps pipeline.</strong> A change goes from a short-lived branch through a pull request. Five groups of checks run side by side and all must pass before it is merged.</figcaption>
</figure>

- **Several overlapping scanners**, because each finds a different kind of problem: risky code patterns, known vulnerabilities in dependencies and images, and leaked secrets.
- **The end-to-end demo is a test.** If a change lets a compromised device keep its access, or breaks the audit log, the build fails, even if every unit test passes.
- **Minimal images with a parts list (SBOM)**, so there is less to attack and it is easy to check later whether a new vulnerability affects them.

## How it is built

The plan is one shared model (trust score, policy rules, credentials, decision cache, migration protocol) that exists in two places on purpose: a reference implementation and a simulation used for evaluation.

- **Reference implementation** in Go, standard library only, so the cryptography, the replication log and the APIs stay readable end to end
- **Simulation and evaluation** in OMNeT++ with a C++ core, recording the latency, availability and security signals the design questions ask about
- **Deployment** with Docker Compose and Kubernetes, infrastructure as code with Terraform and Ansible, monitoring with Prometheus and Grafana
- **Analysis** in Python: result parsing, telemetry features and anomaly detection

It also works as a companion to my current courses: it pulls together fog offloading and placement from IN5700, consensus and replication (Raft, gossip, Chord) from IN5020, and industrial security standards and zone models from TEK5520.

## Status

This is a long-running project and it is early. Here is where it stands:

- **Done:** the full architecture and the diagrams on this page, the repository foundation with CI, and the shared service base (M0).
- **In progress (M1):** the policy engine, the trust score and the decision service are implemented and tested. Signed tokens and narrowable capabilities are being added now, with the gatekeeper next.
- **Ahead:** the fog node and intrusion detection, the distributed-systems parts, containers and Kubernetes, the industrial security work, and finally the simulation and evaluation.

The diagrams are first drafts and will be updated as the implementation moves forward. Progress is tracked openly in `STATUS.md` in the repository.
