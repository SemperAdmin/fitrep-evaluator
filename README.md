# FitRep Evaluator

A step-by-step aid for Reporting Seniors drafting a USMC Fitness Report, using a left-to-right marking method. It works with synthetic data only.

**Live:** https://fitrep-evaluator.app.cloud.gov
**Also on GitHub Pages:** https://semperadmin.github.io/fitrep-evaluator/

## What it does

- Walks through each trait left to right, one grade at a time: advance only when your evidence supports the next standard, and stop when it does not. Each decision is Does Not Meet, Meets or Surpasses, with a justification you write.
- Collects directed comments and drafts the Section I comment in three styles: comprehensive, concise and promotion-focused.
- Shows a summary of the evaluation that you can print, copy to the clipboard or download as a text file.
- Includes an in-app help guide, a light and dark theme, and the Privacy Policy, Terms of Service and disclaimer inside the app.

The method is described in [docs/METHODOLOGY.md](docs/METHODOLOGY.md).

## Using it

Open the live site in a current browser. No account or CAC is needed. Acknowledge the notice and terms when the page opens, then enter the setup details and begin.

Use synthetic data only. Do not enter real names, EDIPIs, email addresses, ranks tied to identifiable people, real dates of rank, real evaluation periods or real performance text. The setup form expects synthetic identifiers in the form `MARINE_ALPHA_01`. This tool does not produce official Fitness Reports, and its output is not to be submitted up the chain of command.

Nothing is saved. Closing or reloading the page discards everything you entered.

## Privacy and security

- Nothing you enter leaves the browser. The app makes no network requests; its configuration (`js/config.js`) disables them outright.
- Nothing is stored in the browser: no local or session storage, IndexedDB or cookies. Even the theme choice is not remembered.
- The Content Security Policy in `index.html` is `default-src 'self'; object-src 'none'; base-uri 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'`, so the page loads nothing from other sites and cannot connect elsewhere.
- One link leaves the app, and only if you select it: **Feedback** opens an external form in a new tab that needs a .mil network. No data is sent from the app to it.
- The hosting platforms (cloud.gov and GitHub Pages) keep standard web server access logs, such as IP address, time, requested page and browser type, for operations and security. Semper Admin does not add tracking of its own.

See the [Privacy Policy](PRIVACY_POLICY.md), [Terms of Service](TERMS_OF_SERVICE.md), [As-Is Disclaimer](AS_IS_DISCLAIMER.md) and [Security](SECURITY.md).

## Development

Requires Node.js 18 or later (CI uses 20). There is no build step: the app is static HTML, CSS and JavaScript loaded by plain script tags.

```bash
npm ci               # installs ESLint only
# open index.html in a browser, or serve the folder with any static server
npm test             # node tests/run-tests.js
npm run lint         # eslint .
```

## Deployment

| Environment | URL | How |
|---|---|---|
| cloud.gov | https://fitrep-evaluator.app.cloud.gov | `manifest.yml` and `Staticfile` (staticfile buildpack); manual **Deploy to cloud.gov** workflow. The sandbox is managed by the private cloudgov-redeploy repository. |
| GitHub Pages | https://semperadmin.github.io/fitrep-evaluator/ | `.github/workflows/pages.yml` on push to `main`. It runs the tests, then publishes a curated set of files only (the app, its styles and scripts, and the three legal documents), not the whole repository. |

## Documentation

- [docs/METHODOLOGY.md](docs/METHODOLOGY.md): the left-to-right marking method and the synthetic fixture.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the page loads, where state lives, and what the app deliberately lacks.
- [docs/POC-GOVERNANCE.md](docs/POC-GOVERNANCE.md): the original proof-of-concept terms, kept as a record.
- [Privacy Policy](PRIVACY_POLICY.md), [Terms of Service](TERMS_OF_SERVICE.md), [As-Is Disclaimer](AS_IS_DISCLAIMER.md).

## Feedback and support

[Open an issue](https://github.com/SemperAdmin/fitrep-evaluator/issues), or use **Feedback** in the app from a .mil network. Do not post real personnel data in an issue. Report security problems as described in [SECURITY.md](SECURITY.md).

## License and disclaimer

MIT (see [LICENSE](LICENSE)).

> This is an independent tool built to help Marines with administrative
> work. It is not an official Department of the Navy or U.S. Marine Corps
> system and is not endorsed by, affiliated with, or approved by either.
> Always confirm requirements against the current governing orders.

## Part of Semper Admin

One of the tools in the Semper Admin suite. Start at the
[Semper Admin Portal](https://semper-admin-portal.app.cloud.gov) for the
full set.
