---
title: "IN2120 — Information Security"
courseCode: "IN2120"
subtitle: "Introduction to information security covering cryptography, authentication, network security, access control, security protocols, threat modelling, and real-world attack/defence analysis."
image: "/img/Complexity.png"
tags: ["Security", "Cryptography", "Network Security", "Authentication", "TLS", "Access Control", "Threat Modelling"]
topics: ["Security"]
year: 2023
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Security_Introduction"
---

**IN2120 – Introduction to Information Security** at UiO. A comprehensive introduction to the principles and practice of securing software systems and networks.

## Course topics

### Foundations of security
- The **CIA triad**: Confidentiality, Integrity, Availability
- Security policies, security models, and the principle of least privilege
- Attack taxonomy: passive vs active attacks, inside vs outside threats
- Risk assessment: likelihood, impact, and risk mitigation strategies

### Cryptography
- **Symmetric encryption** — AES (block cipher modes: ECB, CBC, CTR, GCM), stream ciphers
- **Public-key cryptography** — RSA, Diffie-Hellman key exchange, elliptic curve cryptography
- **Hash functions** — SHA-256, collision resistance, preimage resistance, birthday attacks
- **Message authentication codes (MACs)** — HMAC, authenticated encryption
- **Digital signatures** — RSA-PSS, ECDSA, certificate chains

### Authentication and access control
- Password storage: hashing with salt, bcrypt, Argon2
- Multi-factor authentication (MFA) — TOTP, FIDO2/WebAuthn
- **Access control models** — DAC, MAC, RBAC, ABAC
- OAuth 2.0 and OpenID Connect — delegated authorisation flows
- JWT structure, signing, and common vulnerabilities (algorithm confusion, `none` attack)

### Network security
- **TLS 1.3** — handshake, certificate validation, forward secrecy with ECDHE
- **Firewalls** — stateless vs stateful packet filtering, application-layer firewalls
- **VPNs** — IPSec, WireGuard, tunnel vs transport mode
- DNS security: DNSSEC, DNS over HTTPS/TLS, DNS spoofing attacks
- Common attacks: MitM, replay attacks, CSRF, XSS, SQL injection

### Security protocols
- **SSH** — key exchange, host authentication, agent forwarding
- **IPSec** — AH vs ESP, IKEv2, tunnel establishment
- **Kerberos** — ticket-granting architecture, AS-REQ/TGS-REQ flow

### Threat modelling
- **STRIDE** — Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege
- Data flow diagrams for identifying trust boundaries
- Applying STRIDE to real systems

### Practical security analysis
- CTF-adjacent exercises: finding and exploiting common vulnerabilities
- Static code analysis: identifying vulnerable patterns (buffer overflows, format strings, SQL injection)
- Reading CVEs and understanding vulnerability disclosure

## Why security matters for all developers
Security is not a feature you add at the end — it's a property you design in. Understanding what an attacker can do with a weak JWT implementation or an unsalted password hash changes how you write code from day one.
