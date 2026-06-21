---
title: "IN2000 — GeoScore Android App"
courseCode: "IN2000"
subtitle: "Team Android app for climate and natural hazard risk assessment of Norwegian locations. Combines map search, weather data, flood/landslide risk scoring, and AI-generated reports. Nominated among the 10 best projects in the course."
image: "/img/GeoScore_Thumbnail.png"
tags: ["Kotlin", "Android", "Jetpack Compose", "MVVM", "Hilt", "Room", "Google Maps", "Frost API", "NVE Data", "OpenAI API"]
topics: ["Android", "AI / ML", "Full-Stack / Web"]
year: 2025
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/GeoScore"
---

**IN2000 – Software Engineering with Project Work** at UiO. Built in a team of 6 over one semester. GeoScore was **nominated among the 10 best projects** in the course cohort.

## What the app does

GeoScore lets users search for any Norwegian address or location on an interactive map and receive a **combined risk assessment** for:
- Wind exposure (historical data from Frost/MET)
- Precipitation intensity
- Flood risk (NVE flood zone data)
- Landslide risk (NVE susceptibility data)

The app synthesises these into a single score and generates an **AI-powered written report** explaining the risk profile of the location in plain language.

## Architecture

The app follows **MVVM (Model-View-ViewModel)** with clean separation between data, business logic, and UI layers.

```
UI (Jetpack Compose)
      ↓
ViewModel (state + logic)
      ↓
Repository (data coordination)
   ↙         ↘
Remote API   Local cache (Room)
```

**Dependency injection** with Hilt — all repositories and ViewModels are injected, making the architecture testable and avoiding global state.

## Data sources integrated
- **Frost API (MET Norway)** — historical climate data: temperature, wind, precipitation per location
- **NVE flood data** — zone classifications for Norwegian properties
- **NVE landslide data** — susceptibility scoring
- **Google Maps Compose** — interactive map with custom markers and location search

## AI integration (OpenAI API)
After the scoring logic runs, the app sends the risk data to the OpenAI API and receives a natural-language summary. The report explains the risk factors in plain language and suggests practical implications (e.g., "high wind exposure — consider this when planning outdoor structures").

## Local caching with Room
Previously fetched risk assessments are cached in Room (SQLite). This means:
- The app works offline for previously searched locations
- Repeated queries for the same location return instantly
- The cache can be selectively invalidated when data updates

## Navigation
Screen navigation is handled through **Navigation 3** (Jetpack Navigation Compose). Each screen is a composable destination with its own ViewModel scope.

## Team & process
Team of 6. We used GitHub for version control with feature branches and pull requests. Responsibilities were divided across data layer, UI, scoring logic, and AI integration.

## Recognition
Nominated among the **10 best projects** in IN2000 for the semester — selected from the full course cohort based on technical quality, feature completeness, and design.
