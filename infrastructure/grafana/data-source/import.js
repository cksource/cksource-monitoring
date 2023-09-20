/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

const { HttpClient } = require( '@cksource-cs/http-client-module' );

const prometheusDataSource = require( '../data-source/prometheus-data-source.json' );
const cksourceMonitoringDashboard = require( '../dashboards/cksource-monitoring.json' );

const httpClient = new HttpClient();

( async function() {
	try {
		await httpClient.post( 'http://localhost:3000/api/datasources', {
			auth: 'admin:admin',
			body: JSON.stringify( prometheusDataSource ),
			headers: {
				'Content-Type': 'application/json'
			}
		} );

		// eslint-disable-next-line no-console
		console.log( 'Grafana data source imported.' );

		await httpClient.post( 'http://localhost:3000/api/dashboards/db', {
			auth: 'admin:admin',
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

		// eslint-disable-next-line no-console
		console.log( 'Grafana dashboard source imported.' );
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.log( error );
	}
}() );
