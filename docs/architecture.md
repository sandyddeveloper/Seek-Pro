# Repository architecture

## Goals

Seek-Pro is a single repository for three separately deployable applications:

- `apps/server` — Python and FastAPI API.
- `apps/mobile` — React Native app using Expo.
- `apps/web` — TypeScript, Next.js, and Tailwind CSS app.

The structure favors clear ownership and feature-level organization without starting with microservices, a shared-code package, or a large tooling layer. Each app can grow and be tested or deployed independently. A directory is added when the first real feature needs it; the scaffold does not pre-create feature names or speculative infrastructure.

## Directory map

```text
.
├── apps/
│   ├── server/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── v1/              # Versioned HTTP routes and router composition
│   │   │   ├── core/                # App-wide configuration and cross-cutting concerns
│   │   │   └── modules/             # Business capabilities; add one as it is built
│   │   ├── tests/                   # Backend unit and integration tests
│   │   ├── pyproject.toml           # Server dependencies and Python tooling
│   │   └── uv.lock                  # Reproducible server dependency resolution
│   ├── mobile/
│   │   ├── src/
│   │   │   ├── app/                 # Expo Router routes and layouts
│   │   │   ├── screens/             # Mobile screen components rendered by routes
│   │   │   ├── styles/              # Screen and app-level StyleSheet definitions
│   │   │   ├── components/          # Mobile-only reusable UI
│   │   │   ├── constants/           # App-wide constant values and shared literal types
│   │   │   ├── widgets/              # Reusable, composed dashboard and feature cards
│   │   │   ├── features/             # Mobile feature implementation
│   │   │   ├── lib/                 # App-level clients and utilities
│   │   │   └── theme/               # Mobile design tokens and theme
│   │   └── assets/                  # App-owned fonts, images, and other bundled assets
│   └── web/
│       ├── public/                  # Static files served as-is
│       └── src/
│           ├── app/                 # Next.js App Router routes, layouts, and route handlers
│           ├── components/          # Web-only reusable UI
│           ├── features/            # Web feature implementation
│           └── lib/                 # App-level clients and utilities
├── docs/
└── .github/
    └── skills/
        ├── seek-pro-architecture/
        │   └── SKILL.md
        ├── seek-pro-fastapi/
        │   └── SKILL.md
        ├── seek-pro-expo-react-native/
        │   └── SKILL.md
        └── seek-pro-nextjs/
            └── SKILL.md
```

The tree shows ownership and intended locations, not a requirement to create every possible subfolder in advance. For example, create `modules/accounts/` only when the accounts capability is implemented.

## Why this shape

### One repository, separate applications

The `apps/` boundary makes deployable applications obvious and prevents server, mobile, and web code from becoming one tangled project. The server stays Python-native; the JavaScript applications can later use a JavaScript workspace if their package manifests and dependencies call for it. The repository is not required to use one package manager for every language.

### FastAPI: a modular monolith

Start with one API application, not multiple services. FastAPI's `APIRouter` supports composing routes from separate modules, so the API can grow without turning its entry point into a large collection of endpoints.

Organize backend business logic by capability under `app/modules/`. Within a real module, add only the layers it needs, for example:

```text
modules/
└── accounts/
    ├── router.py       # HTTP endpoints for this capability
    ├── schemas.py      # Request and response models
    ├── service.py      # Business rules and orchestration
    ├── repository.py   # Persistence operations, when needed
    └── models.py       # Persistence models, when needed
```

This is a menu, not a mandatory template: do not add empty files or layers. Keep HTTP concerns at the API edge, business rules in the owning module, and shared configuration in `core/`. Avoid a giant global `services/` or `utils/` directory that obscures which capability owns behavior. Split a module only when its responsibilities or team ownership make that boundary useful.

Keep backend tests in `tests/`; separate unit and integration tests as both types exist. Do not create a database, migration system, job queue, or external-service adapter before the product needs one.

### Expo mobile: routes are not feature logic

`src/app/` is the Expo Router route tree. Keep route files focused on navigation and composing screen components from `src/screens/`; keep their `StyleSheet` definitions in `src/styles/`. Put reusable app UI such as the main bottom navigation in `src/components/`, app-wide constant values and shared literal types in `src/constants/`, composed cards and domain-oriented dashboard elements in `src/widgets/`, and app-level clients/utilities in `src/lib/`. Keep reusable components configurable through props and widgets data-driven, so screens can compose and reuse them without embedding feature-specific data. Add route groups such as `(auth)` or `(tabs)` only when the navigation design needs them. As feature-specific screens grow, group them by feature rather than accumulating unrelated screens in a single folder.

Keep React Native components and platform-specific UI in the mobile app. Do not share UI components with Next.js merely to reduce duplication; the platforms have different rendering and interaction models.

### Next.js web: routes at the edge, features inside

`src/app/` follows the Next.js App Router conventions. Route segments own URL structure, layouts, loading/error boundaries, and route handlers. Keep route files focused on composition and put substantive feature behavior under `src/features/`. Use `src/components/` for genuinely reusable web UI and `src/lib/` for app-level clients and utilities. Keep static files in `public/`.

Next.js permits colocating non-route files with routes, so this is a convention for clarity rather than a framework limitation. Keep route-specific components close to their route when that improves discoverability; move code into a feature folder when it has a wider feature boundary or meaningful business behavior.

### API contract between the apps

The FastAPI service is the source of truth for HTTP behavior and its OpenAPI schema. Mobile and web each own their API integration and UI-specific handling. Do not hand-maintain duplicate server request/response definitions in multiple places. When API usage warrants generated TypeScript types or clients, generate them from the server's OpenAPI schema and document the generation workflow. Do not add a shared package until there is actual, stable code to share and a clear owner.

## Dependency and tooling boundaries

- Keep dependencies and scripts owned by the app that uses them.
- When the web and mobile apps are ready for a shared JavaScript install, use a workspace-aware package manager and make its workspace configuration explicit. Expo detects supported workspace setups; do not add custom Metro configuration preemptively.
- Do not introduce a task orchestrator, shared `packages/` directory, or cross-app dependency just because this is a monorepo. Add one when repeated work, real shared code, or build/test performance justifies it.
- Keep secrets and machine-specific configuration out of source control. Provide example environment-variable names in app-specific documentation when configuration is introduced.
- Keep import direction clear: an app may depend on its own modules and deliberate shared packages, but it must not import another app's private implementation.

## Adding a feature

1. Decide which application owns the user experience or business capability.
2. Put the implementation in that app's feature/module boundary; keep route and API entry points thin.
3. Add tests with the owning app. Backend tests live in `apps/server/tests`; web and mobile tests should live beside the feature they cover unless the selected test runner requires another location.
4. For server/API changes, treat the OpenAPI schema as the cross-app contract and update or regenerate client types when that workflow exists.
5. Add a new shared package only after identifying concrete consumers, a stable interface, and clear ownership.
6. Update this document when a lasting boundary or convention changes; do not document every ordinary file addition.

## Research and references

These official references informed the structure:

- [FastAPI — Bigger Applications: Multiple Files](https://fastapi.tiangolo.com/tutorial/bigger-applications/) — Python packages, routers, and composing larger applications.
- [Next.js — Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — App Router conventions, `src/`, route groups, and colocated files.
- [Expo — Work with monorepos](https://docs.expo.dev/guides/monorepos/) — workspace support, automatic Metro configuration, and monorepo trade-offs.
- [Turborepo — Structuring a repository](https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository) — the `apps/` and `packages/` distinction in JavaScript workspaces.
- [pnpm — Workspaces](https://pnpm.io/workspaces) — explicit workspace configuration and local package boundaries.

These are design inputs, not requirements to adopt every tool mentioned. Re-check framework guidance when implementation begins, since framework versions and workspace behavior change.
