/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export interface ITestDefinitionMetadata {
	organization: string;
	productGroup: string;
	productName: string;
}

export interface ITestDefinition {
	organization: string;
	productGroup: string;
	productName: string;
	formatErrorMessage( testName: string, errorMessage: string, additionalData?: string ): string;
}

export class TestDefinition implements ITestDefinition {
	public organization: string;

	public productGroup: string;

	public productName: string;

	public constructor( metadata: ITestDefinitionMetadata ) {
		this.organization = metadata.organization;
		this.productGroup = metadata.productGroup;
		this.productName = metadata.productName;
	}

	public formatErrorMessage( testName: string, errorMessage: string, additionalData: string = '' ): string {
		return `Test ${ testName } for ${ this.productName } failed. Reason: ${ errorMessage }. ${ additionalData }`;
	}
}
