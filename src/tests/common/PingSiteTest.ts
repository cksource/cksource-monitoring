/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { URL } from 'url';

import { ITest } from '../Test';
import { RequestFailError } from '../../errors/RequestFailError';

class PingSiteTest implements ITest {
	public productName: string;

	public testName: string = 'ping';

	public constructor(
		public address: string,
		private readonly _basicAuth: boolean
	) {
		const parsedUrl: URL = new URL( this.address );

		this.productName = parsedUrl.host + parsedUrl.pathname;
	}

	public async run(): Promise<void> {
		const headers: { Authorization?: string; } = {};

		if ( this._basicAuth ) {
			headers.Authorization = `Basic ${ this._getWebsiteBasicAuth() }`;
		}

		const httpResponse: Response = await fetch( this.address, { method: 'HEAD', headers } );

		const statusCode: number = httpResponse.status;

		if ( statusCode > 399 ) {
			throw new RequestFailError( httpResponse.status, await httpResponse.text() );
		}
	}

	private _getWebsiteBasicAuth(): string {
		const user: string | undefined = process.env.BASIC_AUTH_WEBSITE_USERNAME;
		const password: string | undefined = process.env.BASIC_AUTH_WEBSITE_PASSWORD;

		return Buffer.from( user + ':' + password, 'binary' ).toString( 'base64' );
	}
}

export default PingSiteTest;
