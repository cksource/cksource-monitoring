/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable no-console */

const { HttpClient } = require( '@cksource-cs/http-client-module' );

const prometheusDataSource = require( '../grafana/datasources/cksource-monitoring-prometheus-datasource.json' );
const folder = require( '../grafana/folders/cksource-monitoring-folder.json' );
const cksourceMonitoringDashboard = require( '../grafana/dashboards/cksource-monitoring-dashboard.json' );
const alerts = require( '../grafana/alerts/cksource-monitoring-alerts.json' );
const slackContactPoint = require( '../grafana/contact-points/cksource-monitoring-slack-contact-point.json' );

const GRAFANA_URL = 'http://localhost:3000';
const GRAFANA_AUTH = 'cks:pass';
const SLACK_CHANNEL = 'https://hooks.slack.com/services/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';

const httpClient = new HttpClient();

async function setupGrafana() {
	try {
		console.log( 'Waiting for Grafana readiness...' );

		await _waitForGrafanaReadiness();

		console.log( 'Grafana is ready.' );

		await _importDataSource();

		await _importFolder();

		await _importDashboards();

		await _importAlerts();
	} catch ( error ) {
		console.log( error );
	}
}

function _importDataSource() {
	return _import( 'datasources', prometheusDataSource );
}

function _importFolder() {
	return _import( 'folders', folder );
}

function _importDashboards() {
	return _import( 'dashboards/db', {
		dashboard: {
			...cksourceMonitoringDashboard.dashboard,
			id: null
		},
		folderUid: folder.uid
	} );
}

async function _importAlerts() {
	for ( const alert of alerts ) {
		await _import( 'v1/provisioning/alert-rules', { ...alert, folderUID: folder.uid } );
	}

	slackContactPoint.settings.url = SLACK_CHANNEL;

	await _import( 'v1/provisioning/contact-points', slackContactPoint );

	await _update( 'v1/provisioning/policies', { receiver: slackContactPoint.name } );
}

async function _waitForGrafanaReadiness() {
	let isReady = false;

	try {
		const response = ( await httpClient.get( `${ GRAFANA_URL }/api/health` ) ).json();

		isReady = response.database === 'ok';
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

async function _import( apiPath, body ) {
	const response = await httpClient.post( `${ GRAFANA_URL }/api/${ apiPath }`, {
		auth: GRAFANA_AUTH,
		body: JSON.stringify( body ),
		headers: {
			'Content-Type': 'application/json'
		}
	} );

	if ( response.statusCode > 299 ) {
		throw new Error( response.text() );
	}

	console.log( `Grafana ${ apiPath } imported.` );
}

async function _update( apiPath, body ) {
	const response = await httpClient.put( `${ GRAFANA_URL }/api/${ apiPath }`, {
		auth: GRAFANA_AUTH,
		body: JSON.stringify( body ),
		headers: {
			'Content-Type': 'application/json'
		}
	} );

	if ( response.statusCode > 299 ) {
		throw new Error( response.text() );
	}

	console.log( `Grafana ${ apiPath } updated.` );
}

module.exports = setupGrafana;
