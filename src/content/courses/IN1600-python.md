---
title: "Python Programming — Fundamentals & OOP"
courseCode: "IN1600"
subtitle: "Python learning repository covering programming fundamentals, file handling, exceptions, functions, modules, object-oriented programming, and small practical projects."
image: "/img/Python_Prog.png"
tags: ["Python", "Programming Fundamentals", "OOP", "File I/O", "Exceptions", "Functions", "Modules"]
topics: ["Full-Stack / Web", "Algorithms / Data"]
year: 2022
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Python-Programming"
---

**Python Programming** at UiO. First formal introduction to programming — learning to think computationally and express that thinking in code.

## Topics covered

### Language fundamentals
- Variables, types (`int`, `float`, `str`, `bool`, `None`), and dynamic typing
- Operators: arithmetic, comparison, boolean (`and`/`or`/`not`)
- String operations: indexing, slicing, f-strings, `.format()`, common string methods
- Type conversion and input/output (`input()`, `print()`)

### Control flow
- `if`/`elif`/`else` — conditional execution
- `for` loops with `range()`, iterating over lists and strings
- `while` loops and loop control: `break`, `continue`, `pass`
- Nested loops and loop patterns

### Data structures
- **Lists** — indexing, slicing, mutability, `append`, `insert`, `pop`, `sort`
- **Tuples** — immutable sequences, unpacking, use as dictionary keys
- **Dictionaries** — key-value store, `.get()`, `.items()`, `.keys()`, nested dicts
- **Sets** — uniqueness, union/intersection/difference operations

### Functions
- `def` syntax, parameters vs arguments, return values
- Default parameters and keyword arguments
- Scope: local vs global variables, the `global` keyword (and why to avoid it)
- Recursion: factorial, Fibonacci, tree traversal

### File I/O
- Reading and writing text files: `open()`, `read()`, `readline()`, `readlines()`, `write()`
- Context managers (`with` statement) for safe file handling
- CSV parsing with the `csv` module
- JSON serialisation with `json.load()` and `json.dump()`

### Error handling
- `try`/`except`/`else`/`finally`
- Common exception types: `ValueError`, `TypeError`, `FileNotFoundError`, `IndexError`
- Raising custom exceptions with `raise`
- Writing defensive code vs handling failures gracefully

### Modules and packages
- Importing standard library modules: `math`, `random`, `datetime`, `os`, `sys`
- Writing reusable modules and using `if __name__ == '__main__'`
- Installing third-party packages with `pip`

### Object-oriented programming
- `class` definitions, `__init__`, instance attributes vs class attributes
- Methods: instance methods, class methods (`@classmethod`), static methods (`@staticmethod`)
- Inheritance and method overriding
- `__str__`, `__repr__`, `__len__`, `__eq__` — dunder methods

### Small projects
- Calculator with error handling
- Contact book: CRUD with dictionary storage and file persistence
- Simple text-based game with OOP
- Data analysis: reading CSV, computing statistics, writing summaries
