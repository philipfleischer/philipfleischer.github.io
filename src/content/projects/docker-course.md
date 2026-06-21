---
title: "Docker Course Projects"
subtitle: "9 structured Docker labs covering containerization fundamentals, networking, storage, private registries, Docker Swarm orchestration, and a Kubernetes comparison."
image: "/img/docker.png"
tags: ["Docker", "Linux", "DevOps", "Containers", "Docker Compose", "Networking"]
topics: ["Cloud / DevOps", "Systems"]
featured: false
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Docker-Course"
---

A lab-driven course through Docker from first principles — not just `docker run`, but understanding what containers actually are and how they differ from virtual machines.

## Lab progression

### Lab 1-2 — Container fundamentals
- Images vs containers, the layer model, and why immutability matters
- `docker build` with multi-stage builds to minimise final image size
- Understanding the Docker daemon, client-server architecture, and the container runtime

### Lab 3 — Networking
- Bridge networks, host networking, and overlay networks
- Container DNS resolution — containers communicate by service name, not IP
- Publishing ports, `--network` flag, and inter-container communication

### Lab 4 — Storage and volumes
- Bind mounts vs named volumes vs `tmpfs`
- Volume lifecycle: create, inspect, prune
- Using volumes for database persistence across container restarts

### Lab 5-6 — Docker Compose
- Multi-service applications with `docker-compose.yml`
- Service dependencies with `depends_on` and health checks
- Environment variable injection and secrets management
- Scaling services with `docker compose up --scale`

### Lab 7 — Private registry
- Running a private Docker registry with `registry:2`
- Tagging and pushing images to a local registry
- Pull policies and authentication

### Lab 8 — Docker Swarm
- Initialising a Swarm cluster, manager vs worker nodes
- Deploying stacks with `docker stack deploy`
- Service replicas, rolling updates, and drain/activate node states

### Lab 9 — Kubernetes comparison
- Side-by-side: what Swarm does vs what Kubernetes does
- When Swarm is enough and when Kubernetes is needed
- Key Kubernetes concepts: Pods, Deployments, Services, Ingress

## Why Docker is worth understanding deeply
A Docker container is just a process with a namespaced view of the filesystem and network. Understanding `namespaces`, `cgroups`, and the OCI spec makes you a better developer regardless of whether you write Dockerfiles every day.
