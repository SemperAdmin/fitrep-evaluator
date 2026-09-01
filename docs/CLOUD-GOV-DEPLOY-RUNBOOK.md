# cloud.gov deploy runbook

Reusable steps to push any static app to cloud.gov. Org `sandbox-usmc`, your space `stephen.shorter`.

## 1. One-time setup (per machine)

1. Install the Cloud Foundry CLI v8 or newer.
2. Confirm with `cf version`.
3. You need a cloud.gov account with access to the org and space.

## 2. Per-app files

Each app repo needs three files at its root. Copy these templates and change `APP_NAME`.

### manifest.yml
```yaml
---
applications:
  - name: APP_NAME
    memory: 64M
    disk_quota: 256M
    instances: 1
    path: .
    buildpacks:
      - staticfile_buildpack
```
NGINX needs about 20M, so 64M is safe headroom. The `name` field decides which cloud.gov app gets updated, so give every app a distinct name.

### Staticfile
```
root: .
force_https: true
```
Read section 3 before you skip this file.

### .cfignore
```
.git/
node_modules/
.env
tests/
docs/
package-lock.json
```
Keeps secrets and build cruft out of the uploaded droplet.

## 3. The web-root rule (the part people miss)

The staticfile buildpack serves `./public` by default.

- Your `index.html` lives in `./public` or `./dist`: set `root: public` (or `root: dist`) in `Staticfile`, or rely on the default for `public`.
- Your `index.html` lives at the repo root: set `root: .` in `Staticfile`.

Wrong root produces a deployed site with a 404 on `/`. The site looks deployed in the dashboard but serves nothing.

## 4. Deploy

```
cd PATH\TO\APP
cf login -a api.fr.cloud.gov --sso
cf target -o sandbox-usmc -s stephen.shorter
cf push
```

- `cf login --sso` prints a URL. Open https://login.fr.cloud.gov/passcode, copy the temporary code, paste it back. Login already targets your org and space.
- Re-run `cf target` only if you switched context or a command cleared it.
- `cf push` reads `manifest.yml` from the current directory.
- Default route is `APP_NAME.app.cloud.gov`.

## 5. Common failures

| Symptom | Cause | Fix |
| --- | --- | --- |
| `No org targeted` | Target cleared, often by a placeholder org name | `cf target -o sandbox-usmc -s stephen.shorter` |
| `Organization 'YOUR_ORG' not found` | You pasted a template literally | Use the real names from the login output |
| Blank site or 404 on `/` | Buildpack served empty `./public` | Add root `Staticfile` with `root: .` |
| Wrong app updated | Two repos share a `name` in `manifest.yml` | Give each app a unique `name` |
| First push says app missing | Normal for a new app | `cf push` creates it |

## 6. Non-static apps (nexus, pebd-calculator, and similar)

For a Node, Python, or other runtime app:

- Delete `Staticfile`.
- Swap the buildpack: `nodejs_buildpack`, `python_buildpack`, and so on.
- Add a start command (a `Procfile` or a `start` script in `package.json`).
- Size `memory` for the runtime, not the 64M static default.

Everything else (login, target, push, the `.cfignore`) stays the same.
