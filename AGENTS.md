# Repo Notes

## Detected Stack

- Language: TypeScript
- Frontend: React 18 + Vite 8
- Backend: Express 4 + Node.js 20+
- Test runner(s): Playwright 1.54, ESLint 9, Prettier 3
- CI / infra: GitHub Actions, Docker, docker-compose
- Key folders: `src/`, `server/`, `e2e/`, `.github/workflows/`

## Project Shape

- Single-package full-stack app with one root `package.json`.
- Frontend lives in `src/` and uses React Router, Bootstrap, Formik, Yup.
- API lives in `server/` with auth, task routes, middleware, and in-memory models.
- E2E coverage lives in `e2e/` with Page Object Model, fixtures, locators, and visual snapshots.

## Common Commands

- `npm run dev` - run frontend and backend together.
- `npm run frontend` - Vite dev server.
- `npm run backend` - Express server with `tsx watch`.
- `npm run build` - frontend production build.
- `npm run build:server` - compile backend TypeScript.
- `npm run build:all` - build both layers.
- `npm run lint` - lint `src`, `server`, and `e2e`.
- `npm run type-check` - frontend type check.
- `npm run type-check:server` - backend type check.
- `npm run format` / `npm run format:check` - Prettier.
- `npm run test:e2e` - Playwright suite.
- `npm run test:e2e:smoke` / `npm run test:e2e:api` / `npm run test:e2e:visual` - focused Playwright suites.

## Subagent Routing

Full routing table lives in `~/.config/opencode/AGENTS.md` (“New Project Bootstrap”). For this repo:

- Frontend UI, routing, React state, Vite config, `src/` work -> `web-engineer`.
- Express routes, controllers, middleware, auth, server runtime -> `api-services-engineer`.
- Playwright specs, fixtures, locators, visual checks, test stability -> `qa-automation-engineer`.
- Cross-cutting performance, Docker/CI, or release risk -> `devops-sre-engineer` or `security-engineer` as needed.

If a task touches multiple areas, dispatch the relevant specialists in parallel.

## SDD Model Selection

Use the SDD triplet for spec-driven work:

- Implementation (primary) -> `sdd-implementer` (`openai/gpt-5.4`)
- Implementation (explicit code-only opt-in) -> `sdd-implementer-code` (`openai/gpt-5.3-codex-spark`)
- Implementation (fallback) -> `general` (`openai/gpt-5.4-mini`)
- Task review -> `sdd-reviewer` (`openai/gpt-5.5`)
- Architecture / final review -> `sdd-architect` (`openai/gpt-5.5`)

## Notes

- `playwright.config.ts` starts `npm run dev` automatically for local E2E runs.
- Visual snapshots are stored under `e2e/specs/visual/*-snapshots`.
- Keep edits minimal and aligned with the existing React/Express/POM structure.
