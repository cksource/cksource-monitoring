/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export class ContentFailError extends Error {
	public reason: string = 'Requested content does not contain the expected string.';

	public message: string;

	public constructor( data: Record<string, unknown> = {} ) {
		super( 'ContentFailError' );
		this.message = `Error: ${ this.reason } Data: ${ JSON.stringify( data ) }`;
	}
}
