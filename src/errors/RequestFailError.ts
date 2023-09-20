/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export class RequestFailError extends Error {
	public constructor( public readonly statusCode: number, message: string ) {
		super( message );
	}
}
