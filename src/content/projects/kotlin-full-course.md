---
title: "Kotlin Full Course"
subtitle: "Kotlin learning repository covering syntax, types, control flow, null safety, classes, OOP, coroutines, and Android preparation — structured as a comprehensive reference."
image: "/img/Kotlin_Tut.png"
tags: ["Kotlin", "OOP", "Null Safety", "Coroutines", "Functions", "Collections", "Android Prep"]
topics: ["Android", "Full-Stack / Web"]
featured: false
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Kotlin-Full-Course"
---

Structured Kotlin learning material — built as a personal reference and preparation for Android development (IN2000). Covers the language from the ground up rather than skipping to Android APIs.

## Topics covered

### Language fundamentals
- Variables: `val` vs `var`, type inference, explicit type annotations
- Primitive types and their Kotlin equivalents (`Int`, `Long`, `Double`, `Boolean`, `String`)
- String templates and multi-line strings
- Operators: arithmetic, comparison, logical, bitwise

### Control flow
- `if/else` as expressions (Kotlin `if` returns a value)
- `when` as a powerful `switch` replacement — matching on types, ranges, and conditions
- `for` loops with ranges (`1..10`, `until`, `downTo`, `step`)
- `while` and `do-while`

### Functions
- Named functions, default parameters, named arguments
- Extension functions — adding methods to existing types without inheritance
- Higher-order functions and lambdas
- Inline functions and `crossinline` / `noinline` modifiers

### Null safety
- The nullable type system (`String?` vs `String`)
- Safe calls (`?.`), Elvis operator (`?:`), non-null assertions (`!!`)
- `let`, `run`, `apply`, `also`, `with` — scope functions and when to use each

### Object-Oriented Programming
- `class`, `data class`, `sealed class`, `object` (singleton), `companion object`
- Inheritance, `open`/`final`, interfaces vs abstract classes
- Property delegation and `lazy`

### Coroutines
- `suspend` functions and coroutine scopes
- `launch` vs `async`/`await`
- `Dispatchers.Main` vs `Dispatchers.IO` vs `Dispatchers.Default`
- Structured concurrency and cancellation

### Collections
- `List`, `Set`, `Map` — mutable vs immutable variants
- Functional collection operations: `map`, `filter`, `reduce`, `fold`, `groupBy`, `sortedBy`

## Why a dedicated Kotlin course
Coming from Java, Kotlin's null safety alone removes a large category of bugs. The coroutines section in particular is essential for Android — understanding structured concurrency made the Android app work (`IN2000`) much easier to reason about.
