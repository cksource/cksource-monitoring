/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { CheckDefinition, ICheckDefinitionMetadata } from '../CheckDefinition.js';

export interface IPingSiteCheckDefinitionMetadata extends ICheckDefinitionMetadata {
	url: string;
	expectedContent?: string;
}

export class PingSiteCheckDefinition extends CheckDefinition {
	public url: string;

	public expectedContent?: string;

	public constructor( metadata: IPingSiteCheckDefinitionMetadata ) {
		super( metadata );
		this.url = metadata.url;
		this.expectedContent = metadata?.expectedContent;
	}
}
