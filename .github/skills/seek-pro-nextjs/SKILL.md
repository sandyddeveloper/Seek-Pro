---
name: seek-pro-nextjs
description: "Use when implementing, testing, or reviewing Seek-Pro's Next.js web app in apps/web: App Router routes, layouts, React components, Tailwind styling, server/client boundaries, data fetching, or API integration."
---

# Seek-Pro Next.js

Use this skill for work owned by `apps/web`. Follow the repository-wide boundaries in [the architecture guide](../../../docs/architecture.md).

## Structure and ownership

- Use `apps/web/src/app/` for App Router routes, layouts, loading/error boundaries, and route handlers. Keep route files focused on URL-level composition and framework conventions.
- Put substantive feature behavior under `apps/web/src/features/`. Use `src/components/` for genuinely reusable web UI, `src/lib/` for app-level clients/utilities, and `public/` for static files served as-is.
- Colocate route-specific files with a route when that improves discoverability; use private folders or feature folders when appropriate. Remember that App Router directory names can define URL segments.
- Keep web-only UI in the web app. Do not import mobile app internals or server-private Python code.

## Implementation procedure

1. Identify the route or feature that owns the change. Read nearby layouts, components, data access, and tests before changing conventions.
2. Respect the React Server Component default. Add a client boundary only when browser APIs, event handlers, or client-side state require it; keep that boundary as small as practical.
3. Keep data access and secrets on the server. Never expose credentials through client components or public environment variables. Validate and authorize protected operations on the server, not only in the UI.
4. Integrate with the FastAPI service through the web app's existing API client. Treat the server's OpenAPI schema as authoritative; do not hand-maintain duplicate request/response contracts. Preserve explicit loading, empty, and error behavior.
5. Follow the existing Tailwind and component conventions. Prefer semantic HTML, keyboard accessibility, and responsive layouts; avoid introducing a second styling system without a concrete reason.
6. Add or update tests for the changed behavior using the existing web test setup. Do not create a new framework for one feature.
7. Run the narrowest applicable type-check, lint, and test commands available in the web app.

## Guardrails

- Follow the Next.js version and routing conventions already selected by the project. Verify version-sensitive framework APIs against the matching official documentation.
- Do not put feature logic into a global catch-all utility folder or expand route handlers into a second backend.
- Avoid unnecessary client-side fetching when server-side data access fits the behavior and existing architecture.
- Do not introduce shared packages or additional routing/data libraries without a concrete need.
- Update `docs/architecture.md` if a lasting app boundary or structure convention changes.
