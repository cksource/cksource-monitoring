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

async function _exportAlerts() {
	await _exportAndSave( 'v1/provisioning/alert-rules', 'alerts/cksource-monitoring-alerts.json' );

	const response = await _export( 'v1/provisioning/contact-points' );

	const slackContactPoint = response.find( cp => cp.name === 'CKSource Slack' );

	_save( slackContactPoint, 'contact-points/cksource-monitoring-slack-contact-point.json' );
}

function _exportDashboards() {
	return _exportAndSave( `dashboards/uid/${ dashboard.dashboard.uid }`, 'dashboards/cksource-monitoring-dashboard.json' );
}

async function _exportAndSave( apiPath, filePath ) {
	const result = await _export( apiPath );

	_save( result, filePath );
}

async function _export( apiPath ) {
	const response = await httpClient.get( `${ GRAFANA_URL }/api/${ apiPath }`, {
		auth: GRAFANA_AUTH,
		headers: {
			'Content-Type': 'application/json'
		}
	} );

	if ( response.statusCode > 299 ) {
		throw new Error( response.text() );
	}

	return response.json();
}

function _save( data, filePath ) {
	fs.writeFileSync( `../grafana/${ filePath }`, JSON.stringify( data, null, 4 ) );
}

( async function() {
	await exportGrafana();
}() );
