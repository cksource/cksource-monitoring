/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable no-console */

const fs = require( 'fs' );

const RequestHelper = require( './grafana-request-helper' );

const dashboard = require( '../grafana/cksource-monitoring-dashboard.json' );

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
	await _exportAndSave( 'v1/provisioning/alert-rules', 'cksource-monitoring-alerts.json' );

	const response = await RequestHelper.get( 'v1/provisioning/contact-points' );

	const slackContactPoint = response.find( cp => cp.name === 'CKSource Slack' );

	if ( !slackContactPoint ) {
		throw new Error( 'Slack contact point not found.' );
	}

	_save( slackContactPoint, 'cksource-monitoring-slack-contact-point.json' );
}

async function _exportDashboards() {
	const exportedDashboard = await RequestHelper.get( `dashboards/uid/${ dashboard.uid }` );

	if ( !exportedDashboard ) {
		throw new Error( 'CKSource Monitoring dashboard not found.' );
	}

	_save( exportedDashboard.dashboard, 'cksource-monitoring-dashboard.json' );
}

async function _exportAndSave( apiPath, filePath ) {
	const result = await RequestHelper.get( apiPath );

	_save( result, filePath );
}

function _save( data, filePath ) {
	fs.writeFileSync( `../grafana/${ filePath }`, JSON.stringify( data, null, '\t' ) );
}

( async function() {
	await exportGrafana();
}() );
