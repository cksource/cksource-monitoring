/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { CheckDefinition, ICheckDefinitionMetadata } from '../CheckDefinition.js';

export interface ICertificateExpirationCheckDefinitionMetadata extends ICheckDefinitionMetadata {
	url: string;
 }

export class CertificateExpirationCheckDefinition extends CheckDefinition {
	public url: string;

	public constructor( metadata: ICertificateExpirationCheckDefinitionMetadata ) {
		super( metadata );
		this.url = metadata.url;
	}
}
