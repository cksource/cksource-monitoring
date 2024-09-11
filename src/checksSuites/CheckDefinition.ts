/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export interface ICheckDefinitionMetadata {
	organization: string;
	productGroup: string;
	productName: string;
}

export interface ICheckDefinition {
	organization: string;
	productGroup: string;
	productName: string;
}

export class CheckDefinition implements ICheckDefinition {
	public organization: string;

	public productGroup: string;

	public productName: string;

	public constructor( metadata: ICheckDefinitionMetadata ) {
		this.organization = metadata.organization;
		this.productGroup = metadata.productGroup;
		this.productName = metadata.productName;
	}
}
