/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable no-console */

const { HttpClient } = require( '@cksource-cs/http-client-module' );

const GRAFANA_URL = process.env.GRAFANA_URL ?? 'http://localhost:3000';
const GRAFANA_USER = process.env.GRAFANA_USER ?? 'cks';
const GRAFANA_PASSWORD = process.env.GRAFANA_PASSWORD ?? 'pass';
const GRAFANA_AUTH = `${ GRAFANA_USER }:${ GRAFANA_PASSWORD }`;

const httpClient = new HttpClient();

class GrafanaRequestHelper {
	static async get( apiPath ) {
		const response = await httpClient.get( `${ GRAFANA_URL }/api/${ apiPath }`, {
			auth: GRAFANA_AUTH,
			headers: {
				'Content-Type': 'application/json'
			}
		} );

		if ( response.statusCode === 404 ) {
			return null;
		}

		if ( response.statusCode > 299 ) {
			throw new Error( response.text() );
		}

		return response.json();
	}

	static async post( apiPath, body ) {
		const response = await httpClient.post( `${ GRAFANA_URL }/api/${ apiPath }`, {
			auth: GRAFANA_AUTH,
			body: JSON.stringify( body ),
			headers: {
				'Content-Type': 'application/json',
				'X-Disable-Provenance': 'true'
			}
		} );

		if ( response.statusCode > 299 ) {
			throw new Error( response.text() );
		}

		console.log( `Grafana ${ apiPath } imported.` );
	}

	static async put( apiPath, body ) {
		const response = await httpClient.put( `${ GRAFANA_URL }/api/${ apiPath }`, {
			auth: GRAFANA_AUTH,
			body: JSON.stringify( body ),
			headers: {
				'Content-Type': 'application/json',
				'X-Disable-Provenance': 'true'
			}
		} );

		if ( response.statusCode > 299 ) {
			throw new Error( response.text() );
		}

		console.log( `Grafana ${ apiPath } updated.` );
	}
}

module.exports = GrafanaRequestHelper;
