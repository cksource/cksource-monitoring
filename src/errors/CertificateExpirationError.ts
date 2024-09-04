/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export class CertificateExpirationError extends Error {
	public reason: string = 'Certificate check failed or is close to expiration.';

	public message: string;

	public constructor( data: Record<string, unknown> = {} ) {
		super( 'CertificateExpirationError' );
		this.message = `Error: ${ this.reason } Data: ${ JSON.stringify( data ) }`;
	}
}
