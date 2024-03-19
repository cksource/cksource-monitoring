/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import fs from 'fs';

const GRAFANA_URL = 'https://monitoring.internal.cke-cs-dev.com';
const GRAFANA_USER = 'cks';
const GRAFANA_PASSWORD = process.env.GRAFANA_PASSWORD;

( async () => {
	const dashboards = await request( '/api/search?query=' );

	for ( const dashboard of dashboards ) {
		if ( dashboard.type !== 'dash-db' ) {
			continue;
		}

		const dashboardData = await request( `/api/dashboards/uid/${ dashboard.uid }` );
		const fileName = `${ dashboard.title.replaceAll( ' ', '-' ).toLowerCase() }.json`;

		fs.writeFileSync(
			`./infrastructure/grafana/dashboards/${ fileName }`,
			JSON.stringify( dashboardData.dashboard, null, 2 )
		);
	}

	const alerts = await request( '/api/v1/provisioning/alert-rules/export', { type: 'text' } );

	fs.writeFileSync( './infrastructure/grafana/alerting/alerting_rules.yaml', alerts );
} )();

async function request( path, { type = 'json' } = {} ) {
	const authorization = 'Basic ' + Buffer.from( `${ GRAFANA_USER }:${ GRAFANA_PASSWORD }` ).toString( 'base64' );

	const res = await fetch( `${ GRAFANA_URL }${ path }`, {
		headers: {
			'Authorization': authorization
		}
	} );

	if ( type === 'text' ) {
		return res.text();
	}

	return res.json();
}

