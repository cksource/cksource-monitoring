/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable no-console */

const RequestHelper = require( './grafana-request-helper' );

const prometheusDataSource = require( '../grafana/cksource-monitoring-prometheus-datasource.json' );
const cksourceMonitoringFolder = require( '../grafana/cksource-monitoring-folder.json' );
const cksourceMonitoringDashboard = require( '../grafana/cksource-monitoring-dashboard.json' );
const cksourceMonitoringAlerts = require( '../grafana/cksource-monitoring-alerts.json' );
const slackContactPoint = require( '../grafana/cksource-monitoring-slack-contact-point.json' );
const notificationPolicies = require( '../grafana/cksource-monitoring-notification-policies.json' );

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? 'unknown';

async function setupGrafana() {
	try {
		console.log( 'Waiting for Grafana readiness...' );

		await _waitForGrafanaReadiness();

		console.log( 'Grafana is ready.' );

		await _importDataSource();

		await _importFolder();

		await _importDashboard();

		await _importAlerts();
	} catch ( error ) {
		console.log( error );
	}
}

async function _importDataSource() {
	const existingDataSource = await RequestHelper.get( `datasources/uid/${ prometheusDataSource.uid }` );

	if ( !existingDataSource ) {
		await RequestHelper.post( 'datasources', prometheusDataSource );
	} else {
		console.log( 'Grafana DataSource already exists. Import skipped.' );
	}
}

async function _importFolder() {
	const existingFolder = await RequestHelper.get( `folders/${ cksourceMonitoringFolder.uid }` );

	if ( !existingFolder ) {
		await RequestHelper.post( 'folders', cksourceMonitoringFolder );
	} else {
		console.log( 'Grafana Folder already exists. Import skipped.' );
	}
}

async function _importDashboard() {
	const existingDashboard = await RequestHelper.get( `dashboards/uid/${ cksourceMonitoringDashboard.uid }` );

	await RequestHelper.post( 'dashboards/db', {
		dashboard: {
			...cksourceMonitoringDashboard,
			id: null,
			version: existingDashboard ? existingDashboard.dashboard.version : 1
		},
		folderUid: cksourceMonitoringFolder.uid
	} );
}

async function _importAlerts() {
	await _importAlertRules();

	await _importSlackContactPoint();

	await RequestHelper.put(
		'v1/provisioning/policies',
		{ ...notificationPolicies, receiver: slackContactPoint.name }
	);
}

async function _importAlertRules() {
	for ( const alert of cksourceMonitoringAlerts ) {
		const existingAlert = await RequestHelper.get( `v1/provisioning/alert-rules/${ alert.uid }` );

		if ( !existingAlert ) {
			await RequestHelper.post( 'v1/provisioning/alert-rules', { ...alert, folderUID: cksourceMonitoringFolder.uid } );
		} else {
			await RequestHelper.put(
				`v1/provisioning/alert-rules/${ alert.uid }`,
				{ ...alert, folderUID: cksourceMonitoringFolder.uid }
			);
		}
	}
}

async function _importSlackContactPoint() {
	slackContactPoint.settings.url = SLACK_WEBHOOK_URL;

	const response = await RequestHelper.get( 'v1/provisioning/contact-points' );

	const existingSlackContactPoint = response.find( cp => cp.name === 'CKSource Slack' );

	if ( !existingSlackContactPoint ) {
		await RequestHelper.post( 'v1/provisioning/contact-points', slackContactPoint );
	} else {
		await RequestHelper.put(
			`v1/provisioning/contact-points/${ slackContactPoint.uid }`,
			slackContactPoint
		);
	}
}

async function _waitForGrafanaReadiness() {
	let isReady = false;

	try {
		const response = await RequestHelper.get( 'health' );

		isReady = response?.database === 'ok';
	} catch ( error ) {
		isReady = false;
	}

	if ( !isReady ) {
		await _wait( 100 );

		await _waitForGrafanaReadiness();
	}
}

function _wait( time ) {
	return new Promise( resolve => {
		setTimeout( resolve, time );
	} );
}

module.exports = setupGrafana;
