---
title: "TEK5520: Cybersecurity in Industrial Systems"
courseCode: "TEK5520"
subtitle: "Master's course on securing industrial control systems, smart grids and sensor networks. First assignment: an individual report and presentation on how the WannaCry ransomware could reach ICS and SCADA environments, and which architectural controls would have stopped it."
image: "/img/TEK5520.png"
tags: ["ICS / SCADA", "IEC 62443", "Purdue Model", "Cyber Kill Chain", "Defence in Depth", "Risk Analysis", "Threat Modelling"]
topics: ["Security", "Networking"]
year: 2026
order: 3
badge: "Autumn 2026"
links: []
---

**TEK5520: Cybersecurity in Industrial Systems** at the University of Oslo, autumn 2026. The course is about security in industrial communication networks, such as oil and gas, smart grids and industrial automation, including the sensor and mobile systems they rely on. It covers how basic security principles apply in these networks, relevant industrial security standards, risk-reduction techniques, intrusion detection and protection mechanisms, and incident monitoring and response. A central theme is the "system of systems" problem: many communication technologies (WirelessHART, ZigBee, 2G to 4G, WLAN and more) have to run side by side and still be secure and reliable enough for critical operations.

The course has two large individual assignments. The second one has not been handed out yet.

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

## Repository

The report, presentation and course notes are in my course repository, which is private while the course runs. Available on request.
