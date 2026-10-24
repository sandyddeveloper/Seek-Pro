# Seek-Pro

> **Your day, with less to manage.**

Seek-Pro is being built as a personal assistant for the moving parts of everyday life: tasks to finish, money to keep track of, health habits to maintain, and the routine details that are easy to forget.

The goal is simple: bring the pieces together, reduce repetitive manual work, and help you make more room for what matters.

> **Project status:** Early development. This repository currently contains the runnable foundations for the web app, mobile app, and API. The product capabilities below describe the vision; they are not yet implemented.

## One assistant for everyday life

### Make the day easier to plan

Keep tasks, priorities, and daily plans in one place. Get a clearer view of what needs attention now and what can wait.

### Understand your money

Build a more useful picture of spending, budgets, and upcoming expenses—without making financial management another full-time task.

### Stay connected to your wellbeing

Make room for health routines and personal goals, and see how small, consistent habits fit into your day.

### Spend less time on repeat work

Seek-Pro aims to turn routine manual steps into helpful automations: reminders, recurring workflows, and timely prompts that support the way you already live.

### See the whole picture

Tasks, finances, health, and everyday responsibilities affect one another. Seek-Pro is designed to help bring that context together, rather than make you juggle disconnected tools.

## Designed to help, not take over

- **Useful by default:** surface what matters without adding noise.
- **Automation with your say-so:** make repeated work easier while keeping actions understandable and under your control.
- **One coherent experience:** connect related parts of daily life without forcing them into the same workflow.
- **Built with care:** treat personal information thoughtfully and make privacy and security part of the product, not an afterthought.

These are product principles, not claims about features currently available in this repository.

## The product at a glance

| App | Technology | Purpose |
| --- | --- | --- |
| **Server** | FastAPI · Python | API and application logic |
| **Mobile** | Expo · React Native · TypeScript | iOS and Android experience |
| **Web** | Next.js · TypeScript · Tailwind CSS | Browser experience |

The apps live in one repository but remain separate applications. The API's OpenAPI schema is intended to be the source of truth for the web and mobile clients.

## Current capabilities

This is the starting point, not a finished personal assistant:

- The FastAPI server exposes a basic `/health` endpoint.
- The Expo mobile app has a minimal home screen.
- The Next.js web app has a minimal home page.
- Task management, finance tools, health features, integrations, and automations are **not implemented yet**.

## Get started

### Prerequisites

- Node.js 24 and npm (see [`.nvmrc`](.nvmrc)).
- Python 3.12 (see [`.python-version`](.python-version)).
- [uv](https://docs.astral.sh/uv/getting-started/installation/) for locked Python dependency management.
- For native mobile development, follow [Expo's environment setup](https://docs.expo.dev/get-started/set-up-your-environment/) for your target platform.

### Install dependencies

From the repository root, in PowerShell:

```powershell
npm install
uv sync --project apps/server --extra dev --locked
```

### Run the apps

Start each app in a separate terminal from the repository root:

```powershell
npm run dev:web
```

```powershell
npm run dev:mobile
```

```powershell
uv run --project apps/server --extra dev python -m uvicorn app.main:app --app-dir apps/server --reload
```

The web app is available at `http://localhost:3000`. The API is at `http://localhost:8000`; interactive API documentation is at `http://localhost:8000/docs`. Expo CLI prints instructions for opening the mobile app. A physical device needs a device-reachable API host instead of `localhost`.

### Run checks

```powershell
npm run lint:web
npm run typecheck:web
npm run lint:mobile
npm run typecheck:mobile
npm run check:mobile-config
npm run export:mobile:check
uv run --project apps/server --extra dev ruff check apps/server
uv run --project apps/server --extra dev ruff format --check apps/server
uv run --project apps/server --extra dev pytest apps/server/tests
```

## Continuous integration

The [CI workflow](.github/workflows/ci.yml) runs the server, web, and mobile checks on every pull request and push. It installs JavaScript dependencies with `npm ci` and Python dependencies with `uv sync --locked`, so CI uses the committed lockfiles.

To make failed checks block merging, a repository administrator must enable branch protection or a ruleset for the default branch and require these status checks:

- `Server checks`
- `Web checks`
- `Mobile checks`

GitHub repository settings control required status checks; adding a workflow alone cannot enforce branch protection.

## Repository guide

- [Architecture and folder conventions](docs/architecture.md)
- [Dependency maintenance and npm security findings](docs/dependency-maintenance.md)
- [Repository architecture skill](.github/skills/seek-pro-architecture/SKILL.md)
- [FastAPI skill](.github/skills/seek-pro-fastapi/SKILL.md)
- [Expo React Native skill](.github/skills/seek-pro-expo-react-native/SKILL.md)
- [Next.js skill](.github/skills/seek-pro-nextjs/SKILL.md)

## Direction

Seek-Pro is starting with a clear foundation for three apps. The next step is to build useful, focused capabilities on top of it—keeping each feature understandable, testing it where it belongs, and automating only the work that genuinely benefits from automation.
