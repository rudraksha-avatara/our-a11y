# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately to `security@a11y.itisuniqueofficial.com`.

When reporting, include:

- A clear description of the issue
- Affected version or commit
- Reproduction steps or proof of concept
- Impact assessment if known

Please do not open public GitHub issues for unpatched vulnerabilities.

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |
| < 0.1.0 | No |

## Disclosure guidance

- Give maintainers reasonable time to investigate and prepare a fix
- Avoid publishing exploit details before a fix or mitigation is available
- Coordinate on disclosure timing when possible

## Repository and deployment safety

- Never commit secrets, tokens, private keys, or production credentials
- Treat remote config responses as untrusted input
- Review third-party embed script trust boundaries before deploying to production sites
- Enforce domain allowlists and token validation server-side in any hosted control plane
