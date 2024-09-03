/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export class CertificateExpirationError extends Error {
	public reason: string = 'Certificate will expire soon.';

	public message: string;

	public constructor( data: Record<string, unknown> = {} ) {
		super( 'ContentFailError' );
		this.message = `Error: ${ this.reason } Data: ${ JSON.stringify( data ) }`;
	}
}
