# Security Policy

## Supported Versions

Aim to provide security updates and support for the most recent stable version of this project. Older versions are not actively maintained.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅                 |
| Older   | ❌                 |

## Dependency Management

Take software supply chain security seriously. The policy includes:

### Frontend (React, Vite, pnpm)
- All dependencies must be updated to the latest stable version using `pnpm up`.
- `pnpm audit` or `pnpm audit --prod` is used regularly to identify known vulnerabilities.
- High or critical vulnerabilities must be resolved before any new "release".
- Avoid using deprecated or unmaintained packages.
- GitHub Dependabot is enabled on outdated or vulnerable packages.

### Backend (Java, Maven, Spring)
- Use Maven’s versions plugin to track outdated dependencies (`mvn versions:display-dependency-updates`).
- Regular scans with tools such as [OWASP Dependency-Check](https://jeremylong.github.io/DependencyCheck/) or GitHub’s security tools.
- Only actively maintained Spring Boot and Java versions are used (e.g., LTS JDK).
- Apply Spring Security best practices and patch critical vulnerabilities immediately.

## Reporting a Vulnerability

If you discover a security vulnerability, please help us by reporting it responsibly.

**Please do not open a public GitHub issue.**

Instead, send a message to a project owner with:

- A detailed description of the vulnerability.
- Steps to reproduce the issue, if applicable.
- A suggested fix, if possible.

We will coordinate with you regarding disclosure timelines and fixes if the issue is confirmed.

## Disclosure Policy

- We will acknowledge and thank reporters in the "release" notes if requested.
- We follow [responsible disclosure principles](https://en.wikipedia.org/wiki/Responsible_disclosure).

## Tools & Automation

We use the following tools to maintain security posture:
- GitHub Dependabot (enabled)
- Static code analysis (e.g., ESLint)
- Security linters and audit tools (`pnpm audit`, Maven plugin scans)
- OPTIONAL: CI checks for known vulnerability patterns

---

We are committed to securing our users. Thank you for helping in making this project safer!
