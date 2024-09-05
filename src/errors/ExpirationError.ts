/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export class ExpirationError extends Error {
	public reason: string = 'Check failed or is close to expiration.';

	public message: string;

	public constructor( data: Record<string, unknown> = {} ) {
		super( 'ExpirationError' );
		this.message = `Error: ${ this.reason } Data: ${ JSON.stringify( data ) }`;
	}
}
