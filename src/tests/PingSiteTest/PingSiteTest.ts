/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITest } from '../Test';
import { PingSiteTestDefinition } from './PingSiteTestDefinition';
import { ContentFailError } from '../../errors/ContentFailError';
import { RequestFailError } from '../../errors/RequestFailError';

class PingSiteTest implements ITest {
	public testName: string = 'ping';

	public constructor(
		public testDefinition: PingSiteTestDefinition
	) {}

	public async run(): Promise<void> {
		const httpResponse: Response = await fetch( this.testDefinition.url );
		const statusCode: number = httpResponse.status;

		if ( statusCode > 399 ) {
			throw new RequestFailError( { statusCode } );
		}

		const content: string = await httpResponse.text();

		if ( this.testDefinition.expectedContent && !content.includes( this.testDefinition.expectedContent ) ) {
			throw new ContentFailError( { expectedContent: this.testDefinition.expectedContent } );
		}
	}
}

export default PingSiteTest;
