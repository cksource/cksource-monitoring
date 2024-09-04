/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { TestDefinition, ITestDefinitionMetadata } from '../TestDefinition';

export interface IDomainExpirationTestDefinitionMetadata extends ITestDefinitionMetadata {
	domain: string;
 }

export class DomainExpirationTestDefinition extends TestDefinition {
	public domain: string;

	public expectedContent?: string;

	public constructor( metadata: IDomainExpirationTestDefinitionMetadata ) {
		super( metadata );
		this.domain = metadata.domain;
	}
}
