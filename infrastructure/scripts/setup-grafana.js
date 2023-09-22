/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable no-console */

const { HttpClient } = require( '@cksource-cs/http-client-module' );

const prometheusDataSource = require( '../grafana/prometheus-data-source.json' );
const cksourceMonitoringDashboard = require( '../grafana/dashboards/cksource-monitoring.json' );

const GRAFANA_URL = 'http://localhost:3000';
const GRAFANA_AUTH = 'cks:pass';

const httpClient = new HttpClient();

async function setupGrafana() {
	try {
		console.log( 'Waiting for Grafana readiness...' );

		await _waitForGrafanaReadiness();

		console.log( 'Grafana is ready.' );

		let response = await httpClient.post( `${ GRAFANA_URL }/api/datasources`, {
			auth: GRAFANA_AUTH,
			body: JSON.stringify( prometheusDataSource ),
			headers: {
				'Content-Type': 'application/json'
			}
		} );

		if ( response.statusCode !== 200 ) {
			throw new Error( response.text() );
		}

		console.log( 'Grafana data source imported.' );

		response = await httpClient.post( `${ GRAFANA_URL }/api/dashboards/db`, {
			auth: GRAFANA_AUTH,
			body: JSON.stringify( {
				dashboard: {
					...cksourceMonitoringDashboard,
					id: null,
					uid: null
				},
				folderId: 0
			} ),
			headers: {
				'Content-Type': 'application/json'
			}
		} );

		if ( response.statusCode !== 200 ) {
			throw new Error( response.text() );
		}

		console.log( 'Grafana dashboards imported.' );
	} catch ( error ) {
		console.log( error );
	}
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

module.exports = setupGrafana;
