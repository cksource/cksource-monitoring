# CKSource-Monitoring

**Note: if this is the first run, see the "[first run](#first-run)" section**

## Quick start

1. `pnpm run docker:start`
3. Go to [Dashboards](http://localhost:3000/dashboards) and browse available dashboards.

## Create/edit Grafana dashboards in UI

1. [Login](http://localhost:3000/login) to Grafana as Admin (use credentials from `.env` file).
2. Choose dashboard from [Dashboards](http://localhost:3000/dashboards) or create new one.
3. Edit Dashboard and save changes by pressing "Save dashboard" button.
4. Export changes. See the "[Exporting changes](#export-changes-made-in-grafana-UI)" section. 

## Create/edit Grafana alerts in UI

1. [Login](http://localhost:3000/login) to Grafana as Admin (use credentials from `.env` file).
2. Modify/add some of below resources:
   1. [Alert rules](http://localhost:3000/alerting/list) - verify results of tests
   2. [Contact points](http://localhost:3000/alerting/notifications) - define where alert notifications can be sent
   3. [Notification policies](http://localhost:3000/alerting/routes) - define which alerts should be sent to which contact points
3. Make sure you saved changes in Grafana UI by pressing "Save" button for each modified resource.
4. Save changes made in Grafana UI permanently. See the "[Exporting changes](#export-changes-made-in-grafana-ui)" section.

*Note: Already created alert resources cannot be modified through UI. You can still adjust them by modifying files in `infrastructure/grafana/alerting/`.*

## Export changes made in Grafana UI

Run exporting scripts in the root directory of this repo:
```
node scripts/export-grafana-resources.mjs
```

This will update the files in `infrastructure` folder. Commit this files to `master` branch to rebuild the Grafana image and update the service.

## First run

### Requirements

- Node min version: `18.12.1`
- PNPM version: `>=8.14.0`. Run `npm install pnpm@8 -g`

## Project setup

1. Clone repository.
2. Go to `cksource-monitoring` main directory and run `pnpm install`.
3. Duplicate `.env.template` file and save it as `.env`. Fill out missing env variables.

After project setup, the project can be started. See the [Quick start](#quick-start) section.

## Editing test data

All test resources are located in `src/data` folder. Split into separate test type files:
 - `PING_DATA`
 - `DOMAINS_DATA`
 - `CERTIFICATES_DATA`

Each file contains set of data of given type, groupped by organization (Tiugo, CKSource, Tiny, ButterCMS, etc.). 