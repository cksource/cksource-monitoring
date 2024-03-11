# CKSource-Monitoring

**Note: if this is the first run, see the "[first run](#first-run)" section**

## Quick start

1. `pnpm run docker:start`
3. Go to [Dashboards](http://localhost:3000/dashboards) and browse available dashboards.

## Create/edit Grafana dashboards in UI

1. [Login](http://localhost:3000/login) to Grafana as Admin (`cks`/`pass`).
2. Choose dashboard from [Dashboards](http://localhost:3000/dashboards) or create new one.
3. Edit Dashboard and save changes by pressing "Save dashboard" button.
4. Save changes made in Grafana UI permanently. See the "[Saving changes](#save-changes-made-in-grafana-ui-permanently)" section.

## Create/edit Grafana alerts in UI

1. [Login](http://localhost:3000/login) to Grafana as Admin (`cks`/`pass`).
2. Modify/add some of below resources:
   1. [Alert rules](http://localhost:3000/alerting/list) - verify results of tests
   2. [Contact points](http://localhost:3000/alerting/notifications) - define where alert notifications can be sent
   3. [Notification policies](http://localhost:3000/alerting/routes) - define which alerts should be sent to which contact points
3. Make sure you saved changes in Grafana UI by pressing "Save" button for each modified resource.
4. Save changes made in Grafana UI permanently. See the "[Saving changes](#save-changes-made-in-grafana-ui-permanently)" section.


## First run

### Requirements

- Node min version: `18.12.1`
- PNPM version: `>=8.14.0`. Run `npm install pnpm@8 -g`

## Project setup

1. Clone repository.
2. Go to `cksource-monitoring` main directory and run `pnpm install`

After project setup, the project can be started. See the [Quick start](#quick-start) section.
