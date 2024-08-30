/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { TestDefinition, ITestDefinitionMetadata } from '../TestDefinition';

export interface IPingSiteTestDefinitionMetadata extends ITestDefinitionMetadata {
	url: string;
	expectedContent?: string;
}

export class PingSiteTestDefinition extends TestDefinition {
	public url: string;

	public expectedContent?: string;

	public constructor( metadata: IPingSiteTestDefinitionMetadata ) {
		super( metadata );
		this.url = metadata.url;
		this.expectedContent = metadata?.expectedContent;
	}
}
