/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { TestDefinition, ITestDefinitionMetadata } from '../TestDefinition.js';

export interface ICertificateExpirationTestDefinitionMetadata extends ITestDefinitionMetadata {
	url: string;
 }

export class CertificateExpirationTestDefinition extends TestDefinition {
	public url: string;

	public constructor( metadata: ICertificateExpirationTestDefinitionMetadata ) {
		super( metadata );
		this.url = metadata.url;
	}
}
