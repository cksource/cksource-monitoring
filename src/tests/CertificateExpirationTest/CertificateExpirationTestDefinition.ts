/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { TestDefinition, ITestDefinitionMetadata } from '../TestDefinition';

export interface ICertificateExpirationTestDefinitionMetadata extends ITestDefinitionMetadata {
	host: string;
 }

export class CertificateExpirationTestDefinition extends TestDefinition {
	public host: string;

	public constructor( metadata: ICertificateExpirationTestDefinitionMetadata ) {
		super( metadata );
		this.host = metadata.host;
	}
}
