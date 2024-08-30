/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITest, TestResults } from '../Test';
import { PingSiteTestDefinition } from './PingSiteTestDefinition';

class PingSiteTest implements ITest {
	public testName: string = 'ping';

	public constructor(
		public testDefinition: PingSiteTestDefinition
	) {}

	public async run(): Promise<TestResults> {
		const httpResponse: Response = await fetch( this.testDefinition.url );
		const statusCode: number = httpResponse.status;

		if ( statusCode > 399 ) {
			console.log(
				this.testDefinition.formatErrorMessage( this.testName, 'Wrong Status Code received', `Received: ${ statusCode }` )
			);

			return { status: 1 };
		}

		const content: string = await httpResponse.text();

		if ( this.testDefinition.expectedContent && !content.includes( this.testDefinition.expectedContent ) ) {
			console.log(
				this.testDefinition.formatErrorMessage( this.testName, 'Expected string was not found in the received content.' )
			);

			return { status: 1 };
		}

		return { status: 0 };
	}
}

export default PingSiteTest;
