---
name: seek-pro-fastapi
description: "Use when implementing, testing, or reviewing the FastAPI backend in apps/server: API routes, Pydantic schemas, business logic, persistence, dependencies, errors, or OpenAPI contracts."
---

# Seek-Pro FastAPI

Use this skill for work owned by `apps/server`. Follow the repository-wide boundaries in [the architecture guide](../../../docs/architecture.md).

## Structure and ownership

- Keep the backend a modular monolith. Do not split services or introduce infrastructure without a concrete requirement.
- Put HTTP versioning and router composition under `apps/server/app/api/`; put app-wide configuration and cross-cutting concerns under `apps/server/app/core/`.
- Put business capabilities under `apps/server/app/modules/<capability>/`. Add a module when implementing a real capability, not as an empty placeholder.
- Inside a module, add only needed layers. Keep request/response schemas, HTTP handlers, business rules, and persistence concerns clearly separated when the module's complexity warrants it. Do not create boilerplate layers that only forward calls.
- Keep backend tests under `apps/server/tests/`. Add unit tests for business rules and integration tests for behavior across HTTP, persistence, or other boundaries as appropriate.

## Implementation procedure

1. Identify the capability and its owning module before editing. Check existing routes, schemas, dependencies, and tests to extend established behavior instead of duplicating it.
2. Keep endpoint handlers focused on HTTP concerns: parse validated inputs, invoke application behavior, and return explicit response models/statuses.
3. Put business rules in the capability that owns them. Keep modules from importing another module's private implementation; introduce an explicit interface only when real cross-module use requires it.
4. Validate external input at the boundary. Use explicit types and response models; do not expose persistence objects as an accidental API contract.
5. Handle expected errors with deliberate HTTP semantics. Do not hide failures with broad exception catches, silent defaults, or success-shaped fallback responses. Preserve useful diagnostic context without returning secrets or internal details to clients.
6. Keep configuration and credentials out of code. Follow the app's existing settings and environment-variable conventions; do not invent a configuration framework when none is needed.
7. Test the changed behavior at the narrowest meaningful layer, including relevant error and validation cases.
8. For API changes, treat FastAPI's OpenAPI schema as the contract for mobile and web. If generated client types exist, update them through the established workflow; do not hand-maintain duplicate contract definitions.

## Guardrails

- Do not add a database, ORM, migration framework, cache, queue, or external-service integration unless the feature requires it.
- Do not create global `utils/`, `services/`, or repository abstractions that weaken capability ownership.
- Keep routes versioned consistently with the existing API. Do not introduce a new API version just to organize code.
- Avoid breaking API changes without an explicit requirement and coordinated client impact.
- Update `docs/architecture.md` if a lasting backend boundary changes.
