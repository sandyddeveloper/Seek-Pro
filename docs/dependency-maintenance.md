# JavaScript dependency security note

Reviewed: 2026-10-24

## Changes made

- Updated the mobile app to Expo SDK `58.0.19` and aligned Expo-managed packages with that SDK using `expo install --fix`.
- The web dependency graph resolves Zod `4.6.7`, which is at or above the patched `4.6.6` release for [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
- Regenerated the root npm lockfile from the workspace manifests. No forced framework downgrade was used.

## Accepted temporary findings

The npm audit still reports five affected dependency nodes, representing two underlying advisories in Expo's build/development tooling:

- **Zod — GHSA-mrhx-c7xc-m3w5:** Expo CLI `58.1.15` requires Zod `^3.25.76`; the advisory's first patched release is `4.6.6`. No patched Zod 3 release is published. Replacing the CLI's declared major version with Zod 4 would exceed its dependency contract, so that override is not applied. Keep this as an open tooling risk and revisit when Expo publishes a compatible CLI dependency update.
- **node-forge — GHSA-86w9-cpqp-85rv:** Expo CLI and `@expo/code-signing-certificates` depend on node-forge `1.4.0`, the latest published release on the review date. The advisory lists no patched release; upstream PR [digitalbazaar/forge#1152](https://github.com/digitalbazaar/forge/pull/1152) is not merged. Do not substitute an unreviewed Git commit or local fork. This dependency is used by build/development tooling, not included in the application JavaScript bundles. Reassess when upstream publishes a fixed release.

The five npm audit entries include parent-package rollups; they are not five separate vulnerabilities. Do not use `npm audit fix --force` as a workaround: npm proposes downgrading Expo to an incompatible major version.

## Recheck

After updating Expo or refreshing dependencies:

```powershell
npm audit
Push-Location apps\mobile
npx expo install --check
npx expo-doctor
Pop-Location
npm run typecheck:mobile
npm run build:web
Push-Location apps\mobile
npx expo export --platform all --output-dir dist
Pop-Location
```

Remove this exception note once all affected dependencies have compatible patched releases and `npm audit` confirms the findings are gone.
