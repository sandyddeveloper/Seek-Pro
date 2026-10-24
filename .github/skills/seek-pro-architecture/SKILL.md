---
name: seek-pro-architecture
description: "Use when adding, moving, or reviewing files and features in Seek-Pro's FastAPI server, Expo React Native app, Next.js web app, or their API boundaries. Follow the repository architecture and avoid speculative structure."
---

# Seek-Pro architecture

Use this skill when deciding where code, tests, or documentation belong in this repository.

## Procedure

1. Read [the architecture guide](../../../docs/architecture.md) before changing app boundaries or shared code.
2. Identify the owning app: `apps/server`, `apps/mobile`, or `apps/web`. Keep deployable apps independent.
3. Keep business logic with its feature. Keep FastAPI HTTP composition in routers, Expo Router and Next.js route files focused on navigation/request composition, and generic UI local to its platform.
4. For backend features, add a module under `apps/server/app/modules/` only when the feature is implemented. Add only the layers that feature actually needs.
5. For mobile, use Expo Router's `apps/mobile/src/app/` for route structure and sibling folders in `apps/mobile/src/` for feature behavior and app code. For web, use `apps/web/src/app/` for App Router routes and `apps/web/src/features/` for feature logic.
6. Keep tests with the owning app. Backend tests belong in `apps/server/tests/`; colocate web and mobile tests with the code unless their selected runner requires otherwise.
7. Treat the FastAPI OpenAPI schema as the HTTP contract. Do not hand-copy contract types across apps; propose generated types/clients when there is a concrete workflow to maintain.
8. Do not introduce a shared package, cross-app UI dependency, microservice, database layer, task orchestrator, or new directory without a concrete use case and clear ownership.
9. If a change establishes a lasting convention or boundary not covered in the guide, update `docs/architecture.md`.

## Quick ownership map

| Concern | Location |
| --- | --- |
| HTTP endpoints and API version composition | `apps/server/app/api/` |
| Backend-wide configuration and cross-cutting concerns | `apps/server/app/core/` |
| Backend business capabilities | `apps/server/app/modules/<capability>/` |
| Backend tests | `apps/server/tests/` |
| Mobile routes and navigation | `apps/mobile/src/app/` |
| Mobile features, UI, clients, and theme | `apps/mobile/src/` |
| Web routes and layouts | `apps/web/src/app/` |
| Web features, UI, and clients | `apps/web/src/` |
| Static web files | `apps/web/public/` |
| Architecture decisions and conventions | `docs/architecture.md` |
