/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { IHttpClient, IHttpResponse } from '@cksource-cs/http-client-module';

import { ITest } from '../Test';
import { RequestFailError } from '../../errors/RequestFailError';
import FailSimulator from '../../FailSimulator';

const failSimulator: FailSimulator = new FailSimulator();

class PingOnlineHtmlEditorSiteTest implements ITest {
	public productName: string = 'onlinehtmleditor.dev';

	public testName: string = 'ping';

	public constructor( private readonly _httpClient: IHttpClient ) {}

	public async run(): Promise<void> {
		const httpResponse: IHttpResponse = await this._httpClient.get( 'https://onlinehtmleditor.dev/' );

		if ( httpResponse.statusCode > 399 ) {
			throw new RequestFailError( httpResponse.statusCode, httpResponse.text() );
		}

		failSimulator.simulate();
	}
}

export default PingOnlineHtmlEditorSiteTest;
