---
title: "IN3130 — Algorithms & Complexity"
courseCode: "IN3130"
subtitle: "Advanced algorithms course covering A*, NP-completeness, dynamic programming, network flow, and algorithm design with rigorous complexity analysis."
image: "/img/Complexity.png"
tags: ["Algorithms", "Complexity", "Python", "A*", "NP-Completeness", "Dynamic Programming", "Network Flow"]
topics: ["Algorithms / Data"]
year: 2024
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Algorithms-Design-and-efficiency"
---

**IN3130 – Algorithms: Design and Efficiency** at UiO. The theoretical core of computer science — understanding *why* algorithms work, not just *how* to use them.

## Course topics

### Complexity theory
- **Big-O, Big-Θ, Big-Ω** notation — formal definitions, not intuition
- Master theorem for recurrences
- **P vs NP** — what it means for a problem to be in P, NP, NP-hard, and NP-complete
- Polynomial-time reductions: proving NP-hardness by reducing from known problems (SAT, 3-SAT, Vertex Cover, Clique)

### Graph algorithms
- **A\* search** — heuristic-guided pathfinding, admissibility and consistency of heuristics, comparison to Dijkstra
- **Bellman-Ford** — shortest paths with negative weights, detecting negative cycles
- **Floyd-Warshall** — all-pairs shortest paths in O(V³)
- **Topological sorting** — Kahn's algorithm and DFS-based approach, applications to dependency resolution

### Dynamic programming
- Optimal substructure and overlapping subproblems
- Memoization vs tabulation
- Classic problems: longest common subsequence, edit distance, knapsack, matrix chain multiplication, rod cutting
- Designing DP solutions from scratch (identifying state, transition, base case)

### Network flow
- **Max-flow / min-cut theorem** — Ford-Fulkerson algorithm, augmenting paths
- **Bipartite matching** via max-flow reduction
- **Minimum cost flow** — circulation with lower bounds

### Greedy algorithms
- Proving greedy correctness with exchange arguments
- Huffman coding, interval scheduling, fractional knapsack
- When greedy works and when it doesn't (counterexamples)

### Algorithm design paradigms
- Divide and conquer: merge sort, quicksort, Strassen's matrix multiplication
- Branch and bound for exact solutions to NP-hard problems
- Approximation algorithms: 2-approximation for vertex cover, TSP approximation

## What this course means in practice
Understanding NP-completeness is practical: when you can prove your problem is NP-hard, you know to look for approximation algorithms or heuristics rather than searching for a polynomial exact solution. The A* implementation in particular was directly useful in GeoScore for pathfinding in graph-based risk data.
