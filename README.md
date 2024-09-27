# Tiugo Monitoring

**Note: if this is the first run, see the "[first run](#first-run)" section**

## Quick start

1. `pnpm run docker:start`
3. Go to [Dashboards](http://localhost:3000/dashboards) and browse available dashboards.

## Create/edit Grafana dashboards

1. [Login](http://localhost:3000/login) to Grafana as Admin (use credentials from `.env` file).
2. Choose dashboard from [Dashboards](http://localhost:3000/dashboards) or create new one.
3. Edit Dashboard and save changes by pressing "Save dashboard" button.
4. Export changes. See the "[Exporting changes](#export-changes-made-in-grafana-UI)" section. 

These dashboards are used only for local development. Alerts and dashboards used by [Grafana Cloud}(https://tiugo.grafana.net) will not be updated this way.

## Export changes made in Grafana UI

Run exporting scripts in the root directory of this repo:
```
node scripts/export-grafana-resources.mjs
```

This will update the files in `infrastructure` folder. You can commit these files to share the changes with other devs.

## First run

### Requirements

- Node min version: `18.12.1`
- PNPM version: `>=8.14.0`. Run `npm install pnpm@8 -g`

## Project setup

1. Clone repository.
2. Go to `tiugo-monitoring` main directory and run `pnpm install`.
3. Duplicate `.env.template` file and save it as `.env`. Fill out missing env variables.

After project setup, the project can be started. See the [Quick start](#quick-start) section.

## Editing test data

All test resources are located in `src/checks` folder. Split into separate files by check type:
 - `PING`
 - `DOMAINS`
 - `CERTIFICATES`

Each file contains set of check objects of given type, groupped by organization (Tiugo, CKSource, Tiny, ButterCMS, etc.). 
