---
title: "Android Kotlin Apps"
subtitle: "Collection of Android and Kotlin projects covering Jetpack Compose, Activities, Intents, Fragments, Room, ViewModel, API integration, dependency injection, and app architecture."
image: "/img/Android_Kotlin_Apps.png"
tags: ["Kotlin", "Android", "Jetpack Compose", "Room", "ViewModel", "Hilt", "Ktor", "JUnit"]
topics: ["Android", "Full-Stack"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Android-Kotlin-apps"
---

A hands-on collection of Android applications built while deepening Kotlin and Android SDK knowledge beyond university coursework. Each sub-project targets a specific architectural pattern or Android API surface, making it easy to reference individual patterns in isolation.

## What's inside

The repository is structured as a monorepo of small, focused apps rather than one large project. Each app is self-contained with its own `build.gradle`, so you can open any of them independently in Android Studio.

### Architecture patterns explored
- **MVVM with ViewModel + LiveData / StateFlow** — separation of concerns, reactive UI updates without tight coupling to the Activity lifecycle
- **Jetpack Compose** — declarative UI, recomposition, state hoisting, side effects, and custom themes
- **Room + DAO** — local persistence with SQLite under the hood, migrations, and type converters
- **Hilt dependency injection** — constructor injection, `@HiltViewModel`, scoped components

### Networking
- **Ktor HTTP client** — async REST calls, JSON deserialization with `kotlinx.serialization`, error handling and retry logic
- API integration patterns including `suspend` functions, coroutine scopes in ViewModel, and `Flow`-based data streams

### Testing
- Unit tests with **JUnit 4/5** and **Kotlin coroutines test library** (`runTest`, `TestCoroutineDispatcher`)
- UI tests with **Espresso** and **Compose UI test** APIs

## Key learnings
Working through these projects solidified understanding of the Android component lifecycle, how Compose handles state vs. side effects, and why dependency injection frameworks matter at scale. The Hilt setup in particular demonstrates how to avoid the "ViewModel factory boilerplate" problem that makes Android code painful without DI.
