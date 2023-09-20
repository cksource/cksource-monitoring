/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { IHttpClient, IHttpResponse } from '@cksource-cs/http-client-module';

import { ITest } from '../Test';
import { RequestFailError } from '../../errors/RequestFailError';
import FailSimulator from '../../FailSimulator';

const failSimulator: FailSimulator = new FailSimulator();

class PingMarkdownHtmlEditorSiteTest implements ITest {
	public productName: string = 'onlinemarkdowneditor.dev';

	public testName: string = 'ping';

	public constructor( private readonly _httpClient: IHttpClient ) {}

	public async run(): Promise<void> {
		const httpResponse: IHttpResponse = await this._httpClient.get( 'https://onlinemarkdowneditor.dev/' );

		if ( httpResponse.statusCode > 399 ) {
			throw new RequestFailError( httpResponse.statusCode, httpResponse.text() );
		}

		failSimulator.simulate();
	}
}

export default PingMarkdownHtmlEditorSiteTest;
