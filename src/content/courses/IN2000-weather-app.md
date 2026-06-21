---
title: "IN2000 — Android Weather App"
courseCode: "IN2000"
subtitle: "Team Android app with weather tiles on an interactive map, MapLibre rendering, a backend tile server, and real-time meteorological API integration. Nominated among the 10 best projects in the course."
image: "/img/WeatherAPP.png"
tags: ["Kotlin", "Jetpack Compose", "Android", "MVVM", "MapLibre", "APIs", "Coroutines"]
topics: ["Android", "Full-Stack / Web"]
year: 2024
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Weather-Map-Application"
---

**IN2000 – Software Engineering with Project Work** at UiO. Built in a team of 6. This weather map application was **nominated among the 10 best projects** in the course cohort.

## What the app does

An interactive map-based Android app that overlays real-time weather data as visual tiles on a map of Norway. Users can:
- Navigate a live map rendered with **MapLibre**
- See weather conditions visualised directly on the map (precipitation, wind, temperature layers)
- Tap locations to get detailed weather forecasts
- Access alerts and meteorological data per region

## Architecture

**MVVM (Model-View-ViewModel)** with coroutines for async data fetching:

```
Jetpack Compose UI
        ↓
   ViewModel + StateFlow
        ↓
    Repository
   ↙         ↘
Remote API   Local cache
```

### Backend tile server
The map weather tile layer was served from a **custom backend tile server** that:
- Fetches raw meteorological data from Norwegian API sources
- Renders weather data as image tiles (PNG) in the XYZ tile format
- Serves tiles to the app's MapLibre layer

This separation means the heavy processing (data fetching + rendering) happens server-side, and the app just receives ready-to-display tiles.

### MapLibre integration
- MapLibre GL native for Android handles tile rendering and map interaction
- Custom tile source pointing to the backend tile server
- Layer management: toggling weather overlays on/off
- Tap event handling for location-specific queries

### Data sources
- Norwegian Meteorological Institute API (MET/Yr.no) for forecasts
- Gridded data for tile rendering
- Location services for current position

## Team & process
Team of 6, developed over one semester using GitHub with pull request reviews, feature branches, and sprint-based planning (Scrum-adjacent).

## Recognition
Nominated among the **10 best projects** in IN2000 for the semester.
