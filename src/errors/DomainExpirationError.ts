/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export class DomainExpirationError extends Error {
	public reason: string = 'Domain check failed or is close to expiration.';

	public message: string;

	public constructor( data: Record<string, unknown> = {} ) {
		super( 'DomainExpirationError' );
		this.message = `Error: ${ this.reason } Data: ${ JSON.stringify( data ) }`;
	}
}
