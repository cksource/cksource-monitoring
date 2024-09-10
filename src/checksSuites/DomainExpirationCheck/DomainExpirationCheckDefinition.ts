/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { CheckDefinition, ICheckDefinitionMetadata } from '../CheckDefinition.js';

export interface IDomainExpirationCheckDefinitionMetadata extends ICheckDefinitionMetadata {
	domain: string;
 }

export class DomainExpirationCheckDefinition extends CheckDefinition {
	public domain: string;

	public constructor( metadata: IDomainExpirationCheckDefinitionMetadata ) {
		super( metadata );
		this.domain = metadata.domain;
	}
}
