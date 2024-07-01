/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export class DemoFailError extends Error {
	public constructor( public readonly demoName: string, message: string ) {
		super( message );
	}
}
