/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { URL } from 'url';

import { ITest, TestResults } from '../Test';
import { RequestFailError } from '../../errors/RequestFailError';

class PingSiteTest implements ITest {
	public productName: string;

	public testName: string = 'ping';

	public productGroup: string;

	public organization: string;

	public constructor(
		private readonly _address: string
	) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.host + parsedUrl.pathname;
	}

	public async run(): Promise<TestResults> {
		const httpResponse: Response = await fetch( this._address );

		const statusCode: number = httpResponse.status;

		if ( statusCode > 399 ) {
			throw new RequestFailError( httpResponse.status, await httpResponse.text() );
		}

		return { status: statusCode < 399 ? 1 : 0 };
	}
}

export default PingSiteTest;
