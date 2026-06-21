---
title: "IN1910 — Scientific Programming"
courseCode: "IN1910"
subtitle: "Four programming projects covering version control, OOP, simulations (double pendulum, random walks), numerics, and software design — with testing using pytest and mypy type checking."
image: "/img/RW3D.png"
tags: ["Python", "OOP", "Pytest", "Mypy", "Simulations", "NumPy", "SciPy", "Numerics"]
topics: ["Algorithms / Data"]
year: 2022
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Object-oriented-Programming"
---

**IN1910 – Programming with Scientific Applications** at UiO. Four graded projects building Python skills specifically for scientific computing and engineering applications.

## Project 0 — Version control and tooling
- Git workflow: branching, merging, conflict resolution
- Python environment management with `venv` and `pip`
- Writing `README.md` documentation and structuring a Python project
- Introduction to `pytest` for test-driven development

## Project 1 — Object-oriented programming
- Designing class hierarchies for physical systems
- Operator overloading: `__add__`, `__mul__`, `__repr__`, `__eq__`
- Abstract base classes with `abc.ABC`
- Modelling mathematical objects (vectors, polynomials, complex numbers) as classes
- **mypy** for static type checking: type annotations, `Optional`, `Union`, `List`

## Project 2 — Simulations
The most computationally intensive project. Simulated physical systems numerically:

### Double pendulum
- Derived and solved the equations of motion using 4th-order Runge-Kutta (RK4)
- Visualised chaotic behaviour: two nearly identical initial conditions diverge exponentially
- Phase space plots and energy conservation checks

### Random walks
- 1D, 2D, and **3D random walks** (the 3D walk visualisation is the repo thumbnail)
- Analysed mean displacement: ⟨r²⟩ ∝ N (scaling with number of steps)
- Applications: Brownian motion, polymer modelling, diffusion

### Population dynamics
- Lotka-Volterra predator-prey equations solved with scipy's ODE solver
- Phase portraits and stability analysis

## Project 3 — Numerics
- **Newton's method** for root-finding, convergence analysis
- **Numerical integration** — Trapezoidal rule, Simpson's rule, Gaussian quadrature; error analysis
- **ODE solvers** — Forward Euler, Runge-Kutta methods, adaptive step size
- **Linear systems** — Gaussian elimination, LU decomposition using NumPy
- **Finite difference methods** for PDEs (heat equation 1D)

## Project 4 — Software design and refactoring
- Refactoring earlier code for maintainability: separating concerns, reducing coupling
- Design patterns: strategy pattern for interchangeable solvers
- Performance profiling with `cProfile` and `timeit`
- Documentation with docstrings and Sphinx

## What I learned
Scientific programming is software engineering with different priorities: correctness and reproducibility matter more than raw performance, and testing numerical code requires understanding the expected error bounds. Using `mypy` throughout the project caught a surprising number of subtle type errors.
