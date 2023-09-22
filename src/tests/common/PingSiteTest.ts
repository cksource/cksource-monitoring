/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { URL } from 'url';

import { HttpClient, IHttpClient, IHttpResponse } from '@cksource-cs/http-client-module';

import { ITest } from '../Test';
import { RequestFailError } from '../../errors/RequestFailError';
import FailSimulator from '../../FailSimulator';

const failSimulator: FailSimulator = new FailSimulator();

class PingSiteTest implements ITest {
	public productName: string;

	public testName: string = 'ping';

	public constructor(
		private readonly _address: string,
		private readonly _httpClient: IHttpClient = new HttpClient()
	) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.host;
	}

	public async run(): Promise<void> {
		const httpResponse: IHttpResponse = await this._httpClient.get( this._address );

		if ( httpResponse.statusCode > 399 ) {
			throw new RequestFailError( httpResponse.statusCode, httpResponse.text() );
		}

		failSimulator.simulate();
	}
}

export default PingSiteTest;
