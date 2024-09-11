/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ICheck } from '../Check.js';
import { PingSiteCheckDefinition } from './PingSiteCheckDefinition.js';
import { ContentFailError } from '../../errors/ContentFailError.js';
import { RequestFailError } from '../../errors/RequestFailError.js';

class PingSiteCheck implements ICheck {
	public checkName: string = 'ping';

	public constructor(
		public checkDefinition: PingSiteCheckDefinition
	) {}

	public async run(): Promise<void> {
		const httpResponse: Response = await fetch( this.checkDefinition.url );
		const statusCode: number = httpResponse.status;

		if ( statusCode > 399 ) {
			throw new RequestFailError( { statusCode } );
		}

		const content: string = await httpResponse.text();

		if ( this.checkDefinition.expectedContent && !content.includes( this.checkDefinition.expectedContent ) ) {
			throw new ContentFailError( { expectedContent: this.checkDefinition.expectedContent } );
		}
	}
}

export default PingSiteCheck;
