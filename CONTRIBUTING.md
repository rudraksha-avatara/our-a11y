# Contributing

Thanks for contributing to OurA11y.

## Before you start

- Read `README.md` for project positioning and limitations
- Review `CODE_OF_CONDUCT.md`
- Use issues for bugs, features, and design discussion before large changes

## Development setup

```bash
npm install
npm run typecheck
npm test
npm run build
```

Run the local example server with:

```bash
npm run dev
```

## Branch naming

Suggested branch prefixes:

- `feat/...` for new features
- `fix/...` for bug fixes
- `docs/...` for documentation
- `chore/...` for repo maintenance
- `ci/...` for workflow changes

## Commit style

Use short, descriptive conventional-style messages when possible:

- `feat: add accessible preset support`
- `fix: avoid duplicate skip link injection`
- `docs: clarify remote config security model`

## Pull request expectations

- Keep PRs scoped and reviewable
- Update tests for behavior changes
- Update docs when public API, config, or behavior changes
- Ensure `npm run typecheck`, `npm test`, and `npm run build` pass locally
- Explain why the change is needed, not just what changed

## Code quality expectations

- Preserve framework-agnostic behavior
- Avoid introducing unsafe host-page mutations
- Do not add dependencies without a strong reason
- Keep runtime performance in mind on third-party pages
- Do not make compliance claims the product cannot honestly support

## Reporting issues

- Use the GitHub issue templates when available
- Include browser, reproduction steps, and expected behavior
- For security issues, do not open a public issue; use `security@a11y.itisuniqueofficial.com`
