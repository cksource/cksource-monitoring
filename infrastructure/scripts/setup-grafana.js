/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable no-console */

const { HttpClient } = require( '@cksource-cs/http-client-module' );

const prometheusDataSource = require( '../grafana/datasources/prometheus-data-source2.json' );
const folder = require( '../grafana/folders/cksource-monitoring-folder.json' );
const cksourceMonitoringDashboard = require( '../grafana/dashboards/cksource-monitoring-dashboard2.json' );
const alerts = require( '../grafana/alerts/test-alerts2.json' );

const GRAFANA_URL = 'http://localhost:3000';
const GRAFANA_AUTH = 'cks:pass';

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

function _importDashboards() {
	return _import( 'dashboards/db', {
		dashboard: {
			...cksourceMonitoringDashboard.dashboard,
			id: null
		},
		folderUid: folder.uid
	} );
}

function _importAlerts() {
	return _import( 'v1/provisioning/alert-rules', { ...alerts[ 0 ], folderUID: folder.uid } );
}

function _importFolder() {
	return _import( 'folders', folder );
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

module.exports = setupGrafana;
