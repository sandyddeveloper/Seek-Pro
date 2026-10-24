---
name: seek-pro-expo-react-native
description: "Use when implementing, testing, or reviewing Seek-Pro's Expo React Native mobile app in apps/mobile: Expo Router navigation, screens, native UI, state, API integration, assets, or platform behavior."
---

# Seek-Pro Expo React Native

Use this skill for work owned by `apps/mobile`. Follow the repository-wide boundaries in [the architecture guide](../../../docs/architecture.md).

## Structure and ownership

- Use `apps/mobile/src/app/` for Expo Router routes, layouts, and navigation structure. Keep route files thin; compose screen components from `apps/mobile/src/screens/`.
- Put screen-specific `StyleSheet` definitions in `apps/mobile/src/styles/`. Use `apps/mobile/src/components/` for reusable app UI such as main navigation, `apps/mobile/src/constants/` for app-wide constants and shared literal types, and `apps/mobile/src/widgets/` for composed, reusable cards or dashboard elements. Configure reusable components through props and keep widgets data-driven; use `apps/mobile/src/features/` for feature behavior and `apps/mobile/src/lib/` for app-level clients/utilities. Add folders as needed rather than in advance.
- Keep mobile screens, components, and platform behavior in this app. Do not share React Native UI with the Next.js app.
- Add route groups only when navigation needs them. Add folders when code exists; avoid speculative structure.

## Implementation procedure

1. Locate the route under `src/app/` and feature that own the behavior. Inspect nearby screens, components, navigation, and tests before introducing a new pattern.
2. Keep routes focused on route parameters, layout, navigation, and composing screen components. Keep feature state and workflows with the feature.
3. Build accessible, touch-friendly interfaces using React Native primitives and the app's established styling approach. Support platform differences where behavior differs; avoid assuming web-only APIs.
4. Keep API communication in the app's existing client/integration layer. Treat the FastAPI OpenAPI contract as authoritative; do not hand-copy server schemas as a second source of truth. Preserve loading, empty, success, and error states in the UI.
5. Keep secrets out of the client bundle. Treat all shipped app code and configuration as inspectable by users; use server-side enforcement for protected operations.
6. Add or update tests for changed behavior using the test setup already selected by the app. Do not add a new test framework for an isolated feature.
7. Validate with the narrowest applicable type-check, lint, and test commands available in the mobile app.

## Expo and monorepo guardrails

- Follow the Expo SDK and React Native versions already selected by the project; verify version-sensitive APIs against the matching official documentation.
- Prefer Expo's supported monorepo behavior. Do not add custom Metro watch-folder or module-resolution settings unless a reproduced issue and current Expo guidance require them.
- Keep native configuration or platform-specific files only when a feature needs them. Do not add prebuild/native-project complexity speculatively.
- Do not introduce global state, navigation abstractions, or cross-app packages without a concrete use case.
- Update `docs/architecture.md` if a lasting app boundary or structure convention changes.
