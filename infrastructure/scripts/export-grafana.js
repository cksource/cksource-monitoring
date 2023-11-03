/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable no-console */

const fs = require( 'fs' );

const { HttpClient } = require( '@cksource-cs/http-client-module' );
const dashboard = require( '../grafana/dashboards/cksource-monitoring-dashboard.json' );

const GRAFANA_URL = 'http://localhost:3000';
const GRAFANA_AUTH = 'cks:pass';

const httpClient = new HttpClient();

async function exportGrafana() {
	try {
		await _exportDashboards();

		await _exportAlerts();

		console.log( 'Grafana alerts rules exported.' );

		console.log( 'Grafana exported.' );
	} catch ( error ) {
		console.log( error );
	}
}

function _exportAlerts() {
	return _export( 'v1/provisioning/alert-rules', 'alerts/cksource-monitoring-alerts.json' );
}

function _exportDashboards() {
	return _export( `dashboards/uid/${ dashboard.dashboard.uid }`, 'dashboards/cksource-monitoring-dashboard.json' );
}

async function _export( apiPath, filePath ) {
	const response = await httpClient.get( `${ GRAFANA_URL }/api/${ apiPath }`, {
		auth: GRAFANA_AUTH,
		headers: {
			'Content-Type': 'application/json'
		}
	} );

	if ( response.statusCode > 299 ) {
		throw new Error( response.text() );
	}

	fs.writeFileSync( `../grafana/${ filePath }`, response.text() );
}

( async function() {
	await exportGrafana();
}() );
