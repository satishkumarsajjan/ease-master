# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 3.x     | ✅ Yes    |
| 2.x     | ❌ No     |
| 1.x     | ❌ No     |

_Note: Satisium UI v3 is currently in Beta. Security patches will be actively applied to the beta track._

## Reporting a Vulnerability

If you discover a security vulnerability in Satisium UI or any part of the Satisium Ecosystem, please **do not** open a public GitHub issue or post in the public Discord channels.

Instead, please report it to us privately using one of the following methods:

1. **Email:** Send a detailed report to **satisiumhq@gmail.com**.
2. **Discord DM:** Join our official Discord (https://discord.gg/xQ5cPHmT7) and send a direct message to the Server Owner / Founder.

Please include:

- **Component/Tool name** and version affected
- **Steps to reproduce** the vulnerability
- **Expected vs actual behavior**
- **Screenshots or proof-of-concept** if applicable
- **Potential impact** assessment (e.g., XSS, prototype pollution)

We will acknowledge receipt within 48 hours and work with you to patch and disclose the issue responsibly.

_Please note: Satisium is currently an independent design engineering studio. We do not operate a paid bug bounty program at this time._

## Security Best Practices for Consumers

- Always install components directly from the official registry: `https://ui.satisium.com/r/<name>.json`
- Keep your `shadcn` and component dependencies up to date
- Audit your `package-lock.json` / `pnpm-lock.yaml` regularly
- Review component source code before deploying to production environments

## Third-Party Dependencies

Satisium UI depends on several third-party libraries (e.g., GSAP, Three.js, React). We regularly update our dependencies and utilize Dependabot for automated security patches. See our [dependabot configuration](.github/dependabot.yml) for details.
