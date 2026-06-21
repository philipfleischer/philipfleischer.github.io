---
title: "Minimal Network Programming"
subtitle: "Python networking project collection covering chatrooms, encrypted messaging, HTTP servers, SMTP/IMAP tools, FTP/SFTP clients, port scanning, secure login, and REST API experiments."
image: "/img/Network_Progging.png"
tags: ["Python", "Sockets", "TCP/IP", "HTTP", "SMTP", "IMAP", "FTP/SFTP", "TLS", "Flask", "SQLite"]
topics: ["Networking", "Security", "Systems"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Minimal-Network-Programming"
---

A practical deep-dive into network programming from the socket layer upward. The goal was to understand network protocols by implementing them — not just by consuming library abstractions.

## Projects in this collection

### Raw socket programming
- **TCP/UDP chatrooms** — multi-client chat server using `select()` for non-blocking I/O, handling client disconnects gracefully
- **Port scanner** — concurrent port scanner using `threading` and raw sockets, with service fingerprinting
- **Custom HTTP server** — implements HTTP/1.1 request parsing, response generation, and static file serving from scratch (no Flask/Django)

### Application-layer protocol clients
- **SMTP client** — sends emails via SMTP AUTH LOGIN, handles MIME multipart for attachments
- **IMAP client** — searches, fetches, and parses email with RFC 3501 compliance
- **FTP/SFTP client** — file upload/download using `ftplib` and `paramiko`

### Security-focused experiments
- **TLS encrypted messaging** — mutual TLS with self-signed certificates using Python's `ssl` module
- **Secure login system** — bcrypt-hashed passwords stored in SQLite, session tokens, brute-force rate limiting
- **REST API with auth** — Flask API with JWT authentication, input validation, and rate limiting

## Why this project matters
Most networking courses teach theory. This project is about getting hands dirty with `recvfrom()`, parsing raw byte buffers, and understanding exactly what happens at each layer. The TLS section in particular required understanding certificate chains, handshake sequences, and cipher negotiation — not just calling `ssl.wrap_socket()`.
