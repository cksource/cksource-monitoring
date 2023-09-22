# CKSource-Monitoring

**Note: if this is the first run, see the "[first run](#first-run)" section**

## Quick start

1. `pnpm run start:local:infra`
2. Start tests and metrics generation: `pnpm run start:local`
4. Go to [Dashboards](http://localhost:3000/dashboards) and browse available dashboards.

## Create/edit Grafana dashboards

1. [Login](http://localhost:3000/login) to Grafana as Admin (`cks`/`pass`).
2. Choose dashboard from [Dashboards](http://localhost:3000/dashboards) or create new one.
3. Edit Dashboard and save changes by pressing "Save dashboard" button.
4. When you want to save your changes in repository then:
   1. Go to `Dashboard settings > JSON Model`
   2. Copy JSON Model and paste to existing or new `.json` file in `infrastructure/grafana/dashboards` directory.

## First run

### Requirements

- Node min version: `18.12.1`
- PNPM version: `6.24.2`. Run `npm install pnpm@6.24.2 -g`

## Project setup

1. Clone repository.
2. Go to `cksource-monitoring` main directory and run `pnpm install`

After project setup, the project can be started. See the [Quick start](#quick-start) section.
