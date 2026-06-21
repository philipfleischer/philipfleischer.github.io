---
title: "Data Engineering Pipeline"
subtitle: "End-to-end ELT pipeline project covering batch processing with Apache Spark, real-time streaming with Kafka, orchestration with Airflow, and PostgreSQL — all containerized with Docker Compose."
image: "/img/Dat_ENG.jpg"
tags: ["Data Engineering", "ELT", "Apache Airflow", "Apache Spark", "Apache Kafka", "PostgreSQL", "Docker", "Python", "SQL"]
topics: ["Data Engineering", "Cloud / DevOps"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Data-Engineering"
---

A structured exploration of the modern data engineering stack: building ELT pipelines that move, transform, and serve data at scale using the same tools used in industry.

## Architecture

The project follows a typical data platform pattern: raw data lands in a source database, gets extracted and transformed by batch/streaming jobs, and lands in an analytical store.

```
Source DB (PostgreSQL)
       ↓
   Airflow DAG (orchestration)
       ↓
  Batch: Apache Spark        Stream: Apache Kafka
       ↓                           ↓
  Transformed data → Analytical PostgreSQL
```

All components run in **Docker Compose**, which means the entire platform can be brought up or torn down with a single command.

## Components

### SQL & PostgreSQL fundamentals
- Database design: users, films, actors with proper relational modeling (FK constraints, normalised tables)
- Advanced SQL: `INNER JOIN`, `LEFT JOIN`, subqueries, `GROUP BY` aggregations, `UNION`/`UNION ALL`
- Multi-table joins across films, film_actors, actors for complex queries

### Apache Airflow (orchestration)
- DAG-based workflow definition in Python
- Scheduling batch extraction jobs to run on a cadence
- Airflow 3 metadata database migration, user creation, and web UI
- Docker-based Airflow stack (webserver + scheduler + metadata DB)

### Apache Spark (batch processing)
- Reading from PostgreSQL source via JDBC
- DataFrame transformations: filtering, aggregation, schema enforcement
- Writing results to the analytical store

### Apache Kafka (streaming)
- Producer pushing events in real time
- Consumer group reading and processing events
- Kafka running in Docker with Zookeeper

## Key takeaway
Setting up Airflow alone requires understanding Docker networking, database initialization order (`depends_on` with health checks), and Airflow's internal component model. The complexity of infrastructure is often underestimated — this project makes it visible.
