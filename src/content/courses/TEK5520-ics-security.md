---
title: "TEK5520: Cybersecurity in Industrial Systems"
courseCode: "TEK5520"
subtitle: "Master's course on securing industrial control systems, smart grids and sensor networks. Two individual assignments on the WannaCry ransomware: how it could reach ICS and SCADA environments, then a structured Attack Flow with a MITRE ATLAS extension and an IEC 62443-3-2 zones and conduits redesign."
image: "/img/TEK5520.png"
tags: ["ICS / SCADA", "IEC 62443", "Purdue Model", "Cyber Kill Chain", "Defence in Depth", "Risk Analysis", "Threat Modelling", "MITRE ATT&CK", "MITRE ATLAS", "Attack Flow", "Zones and Conduits"]
topics: ["Security", "Networking"]
year: 2026
order: 3
badge: "Autumn 2026"
links: []
---

**TEK5520: Cybersecurity in Industrial Systems** at the University of Oslo, autumn 2026. The course is about security in industrial communication networks, such as oil and gas, smart grids and industrial automation, including the sensor and mobile systems they rely on. It covers how basic security principles apply in these networks, relevant industrial security standards, risk-reduction techniques, intrusion detection and protection mechanisms, and incident monitoring and response. A central theme is the "system of systems" problem: many communication technologies (WirelessHART, ZigBee, 2G to 4G, WLAN and more) have to run side by side and still be secure and reliable enough for critical operations.

The course has two large individual assignments, both about WannaCry.

## Assignment 1: WannaCry and its impact on ICS and SCADA systems

*Individual report and presentation.*

WannaCry (May 2017) was IT ransomware, not malware built for industrial systems, yet it still stopped car production at Renault-Nissan and forced the NHS to cancel thousands of appointments. The report looks at how a purely IT-oriented worm can cross into operational technology when the boundary between IT and OT is not properly enforced.

### What the report covers
- **Purpose and origin**: a self-spreading worm using the leaked NSA exploit EternalBlue against Windows SMBv1, attributed to the Lazarus Group, where the ransom design suggests money was not the main goal
- **Impact on an industrial plant**, mapped level by level onto the Purdue reference architecture used in ISA/IEC 62443: realistic entry points (a maintenance laptop, a misconfigured IT/OT firewall), which levels could be hit, and why the realistic worst case is a loss of view or control rather than direct manipulation of the physical process
- **Cyber Kill Chain analysis**: every phase of the attack mapped to concrete mitigations, with the observation that once one host is infected, the worm performs reconnaissance, delivery and exploitation on its own
- **Defence in depth**: seven layers from the physical process out to people, with network segmentation through zones and conduits and an industrial DMZ as the most important layer against a worm like this
- **WannaCry today**: how AI changes the picture for both attackers (faster exploit development, agentic ransomware) and defenders (anomaly detection, AI-assisted patch prioritisation)
- **Critical comparison with ChatGPT**: the same questions answered by ChatGPT, and where I agree and disagree with it

### Main conclusion
One unpatched, network-reachable SMB service was enough. No phishing, stolen credentials or insider were needed. A patch had existed for two months before the outbreak, so the failure was organisational more than technical. Even without the patch, a correctly segmented network with an industrial DMZ would have kept the worm out of the control network, and tested offline backups would have made recovery fast. That is the practical argument for defence in depth: no single layer has to be perfect.

## Assignment 2: WannaCry Attack Flow, MITRE ATLAS and zones and conduits

*Individual report.*

The second assignment continues the WannaCry analysis from Assignment 1. It models the attack as a structured Attack Flow, extends the flow with AI-related techniques from MITRE ATLAS, analyses every action for detection, prevention and response, and redesigns the affected network with the zone and conduit method from ISA/IEC 62443-3-2.

The three diagrams below are the appendices of the report. The two flows were made in the Attack Flow Builder from the Center for Threat-Informed Defense, and the zones and conduits diagram in draw.io. **Click any diagram to see it in full size.**

### Attack Flow of WannaCry

<figure class="diagram">
  <a href="/img/tek5520-a2/01-attack-flow.svg"><img src="/img/tek5520-a2/01-attack-flow.svg" alt="Attack Flow of WannaCry with 17 actions and 4 conditions, from preparing the worm through the kill-switch check, the propagation and payload threads, and the spread into OT" width="2940" height="2364" loading="lazy" /></a>
  <figcaption><strong>The WannaCry attack as an Attack Flow.</strong> 17 actions (blue) and 4 conditions (green), each action mapped to a MITRE ATT&amp;CK Enterprise or ICS tactic and technique with a confidence value. Mappings I inferred myself are marked with an asterisk.</figcaption>
</figure>

The confidence value (0 to 100) says how well the evidence supports a node, not how dangerous it is. How to read the flow:

1. **Actions 1 and 2** happen before the worm spreads: ransomware is combined with the leaked EternalBlue exploit, and the first host is infected. The entry vector is unconfirmed (exposed SMB or phishing), so action 2 has confidence 50.
2. **Action 3, the kill switch.** If the hard-coded domain answers, the worm halts. Only when the request fails does it go on, which is why registering the domain on 12 May 2017 stopped new infections. The false branch starts two parallel threads.
3. **Actions 4 to 8, propagation:** install a service, scan TCP/445, exploit SMBv1 (MS17-010), run the payload through DoublePulsar and copy the worm to the next host, which repeats the flow from step 3.
4. **Actions 9 to 15, payload:** enumerate files, stop database and mail services, hide files, delete shadow copies, show the ransom note on RDP sessions, contact C2 over Tor and encrypt the files.
5. **Actions 16 and 17, the IT/OT coupling.** If there is a route from the infected IT network to OT, the worm spreads to Windows hosts in the industrial network and operations stop, as at Honda Sayama and several Renault-Nissan plants. No source describes WannaCry manipulating a control process, so the impact nodes (Loss of View, Loss of Availability, Loss of Productivity and Revenue) are inferred.

### Extended with MITRE ATLAS

<figure class="diagram">
  <a href="/img/tek5520-a2/02-attack-flow-atlas.svg"><img src="/img/tek5520-a2/02-attack-flow-atlas.svg" alt="The WannaCry Attack Flow with nine MITRE ATLAS actions, A1 to A9, attached to the actions they affect" width="2955" height="3689" loading="lazy" /></a>
  <figcaption><strong>A what-if overlay with MITRE ATLAS.</strong> Nine AI-related actions (A1 to A9) are attached to the actions in the original flow that they affect. Most have a lower confidence, because they describe how plausible each technique is for a WannaCry-like worm.</figcaption>
</figure>

WannaCry appeared in 2017, before generative AI was a practical attacker tool, so this is not a claim that WannaCry used AI. The overlay shows three effects:

- **Easier and faster to prepare.** Generative AI (A1) and autonomous exploit development (A2) shorten the gap between a patch and a working exploit. Autonomous reconnaissance (A4) ranks targets with IT-OT connections instead of scanning blindly, and LLM-assisted spear phishing (A5) strengthens the uncertain phishing branch.
- **Stealthier.** Verifying the attack against ML detectors (A3), varied environment checks instead of one fixed kill switch (A6), and commands generated at run time (A8) so signatures for fixed strings match less often.
- **More damaging.** With attack-path adaptation (A7), a patched host or closed port 445 makes an agent change route instead of stopping, and autonomous attack orchestration (A9) coordinates many agents.

None of this removes the need to reach a vulnerable host over the network, which is why segmentation is still essential.

### Detection, prevention and response

Every action in both flows, 17 plus A1 to A9, gets a row in a table with how to detect it, how to prevent or limit it and how to respond and recover. Three behaviour-based rules cover most of the flow and also catch the AI-varied actions: one host opening port 445 sessions to many peers within minutes, shadow copy deletion from a non-administrative process, and a burst of file renames to one new extension. The three mitigations with the highest leverage:

1. **Remove the SMBv1 weakness.** The MS17-010 patch existed two months before the outbreak. AI-assisted exploit development makes a short time-to-patch even more important, and unpatchable legacy OT hosts need virtual patching or isolation.
2. **Segment IT from OT, and inside OT, with SMB denied by default.** This works even when patching has failed, and an adaptive agent still has to reach a host over the network.
3. **Detection and response as designed controls:** network sensors, host logs, rehearsed containment and tested offline backups. The 2017 outbreak was slowed by luck, not by detection.

### Zones and conduits

<figure class="diagram">
  <a href="/img/tek5520-a2/03-zones-and-conduits.svg"><img src="/img/tek5520-a2/03-zones-and-conduits.svg" alt="IEC 62443-3-2 zones and conduits design for a generic manufacturing site, with nine zones Z1 to Z9 and conduits C1 to C10, each labelled with its enforcing device and target security level" width="2122" height="3023" loading="lazy" /></a>
  <figcaption><strong>Redesign of a generic manufacturing site with zones and conduits (ISA/IEC 62443-3-2).</strong> Nine zones separate assets by function and trust. Every conduit is drawn with the device that enforces it and a target security level (SL-T). Dashed arrows are restricted one-way conduits.</figcaption>
</figure>

The design follows the zone and conduit requirements ZCR 1 to 7. For a flat network with reachable SMB and unpatched hosts, the risk of a WannaCry-type worm is above what the asset owner would tolerate, which makes partitioning necessary.

- **Z1 Corporate DMZ** keeps internet-facing services out of **Z2 Enterprise IT** (Purdue L4-5). The IT patch server is the only Z2 system with a path toward the plant.
- **Z3 Industrial DMZ** (L3.5) holds the patch mirror, the vendor jump host with MFA and session recording, a historian replica and an offline backup copy.
- **Z4 Site operations, Z5 Supervisory control, Z6 Basic control and Z7 Safety** are separate zones, and every box inside a zone is its own segment (VLAN and access list). **Z8 Security monitoring** receives logs one way, and **Z9 Vendor access** goes straight to the jump host, never through enterprise IT.
- Internet traffic passes three conduits before it reaches the industrial DMZ: **C1** blocks SMB (TCP 445/139) at the border, **C2** allows only mail, web and vendor updates through an application proxy, and **C3** is brokered only, with no routing from IT to OT. C3 is the main barrier against the spread into OT. **C9** is initiated from the OT side only, so the historian replicates out and patches are pulled in.

With C1 and C3 denying SMB and the industrial DMZ in place, a WannaCry-type worm could still infect enterprise IT but could no longer reach OT, so the impact is limited to IT systems. The security levels are assumptions for illustration and would have to be confirmed in a detailed risk assessment with plant-specific data.

## Repository

The reports, presentations, diagram sources and course notes are in my course repository, which is private while the course runs. Available on request.
