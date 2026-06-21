---
title: "IN2010 — Algorithms & Data Structures"
courseCode: "IN2010"
subtitle: "Five graded projects covering fundamental algorithms and data structures — including a large-scale IMDB graph with ~100k nodes and 5M edges, Dijkstra, BFS, and AVL trees."
image: "/img/AlgDat.png"
tags: ["Python", "Algorithms", "Data Structures", "Graphs", "Trees", "Performance", "Java", "Dijkstra", "AVL Trees", "BFS"]
topics: ["Algorithms / Data"]
year: 2023
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Algorithms-and-Data-Structures"
---

**IN2010 – Algorithms and Data Structures** at UiO. Five graded assignments building a rigorous understanding of fundamental algorithms — not just using them, but implementing them correctly and understanding their complexity.

## Project 1 — Sorting and complexity
- Implementing and comparing sorting algorithms: insertion sort, merge sort, quicksort
- Empirical complexity analysis: timing runs on input sizes n = 10³ to 10⁷
- Understanding best/worst/average cases and why pivot choice matters for quicksort
- External sorting concepts for data that doesn't fit in memory

## Project 2 — Trees
- **Binary search trees (BST)** — insert, search, delete with correct case handling
- **AVL trees** — self-balancing BST with rotation operations (LL, RR, LR, RL)
- Proving height bound: O(log n) guaranteed for AVL
- Tree traversals: in-order, pre-order, post-order, level-order (BFS)

## Project 3 — Hash tables
- Open addressing (linear probing, quadratic probing, double hashing)
- Separate chaining with linked lists
- Load factor and rehashing — when to grow the table and why
- Designing good hash functions for strings and composite keys

## Project 4 — Graphs (BFS, DFS, shortest paths)
- Graph representation: adjacency list vs adjacency matrix — space/time trade-offs
- **BFS** — unweighted shortest path, level-by-level traversal
- **DFS** — topological sort, strongly connected components (Tarjan's / Kosaraju's)
- **Dijkstra's algorithm** — weighted shortest path with a priority queue (min-heap)

## Project 5 — Large-scale IMDB graph
The most demanding project: a real-world graph with approximately **100,000 nodes** (actors and films) and **5 million edges** (actor-film relationships) from the IMDB dataset.

**Tasks:**
- Load and build the full graph efficiently (adjacency list)
- Find the **shortest path** between any two actors (the "six degrees of Kevin Bacon" problem) using BFS
- **Dijkstra** for weighted shortest paths (weighting by co-star frequency)
- Find **all shortest paths** between two actors (multiple equal-length paths)
- Performance: the full BFS must complete within a few seconds on commodity hardware

**Implementation choices:**
- Python with `collections.deque` for BFS queue
- `heapq` for Dijkstra's priority queue
- Careful memory management — storing the full graph without running out of RAM

## What I learned
Algorithm theory becomes real when you run Dijkstra on 5 million edges and watch it take 40 minutes with a naïve implementation, then 4 seconds after switching to a proper priority queue. Complexity analysis is the tool for predicting this before you run the code.
