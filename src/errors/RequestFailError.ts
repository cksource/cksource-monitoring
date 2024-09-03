/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export class RequestFailError extends Error {
	public reason: string = 'Requested url returned wrong Status Code.';

	public message: string;

	public constructor( data: Record<string, unknown> = {} ) {
		super( 'RequestFailError' );
		this.message = `Error: ${ this.reason } Data: ${ JSON.stringify( data ) }`;
	}
}
