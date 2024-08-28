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
		private readonly _address: string
	) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.host + parsedUrl.pathname;
	}

	public async run(): Promise<void> {
		const httpResponse: Response = await fetch( this._address );

		const statusCode: number = httpResponse.status;

		if ( statusCode > 399 ) {
			throw new RequestFailError( httpResponse.status, await httpResponse.text() );
		}
	}
}

export default PingSiteTest;
