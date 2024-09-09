/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import https, { RequestOptions } from 'https';
import { TLSSocket } from 'tls';

import ExpirationTest from '../ExpirationTest.js';
import { CertificateExpirationTestDefinition } from './CertificateExpirationTestDefinition.js';

class CertificateExpirationTest extends ExpirationTest {
	public testName: string = 'certificate_expiration';

	private readonly _requestOptions: RequestOptions;

	public constructor(
		public testDefinition: CertificateExpirationTestDefinition
	) {
		super( testDefinition );

		const url: URL = new URL( this.testDefinition.url );

		this._requestOptions = {
			host: url.host,
			path: url.pathname,
			agent: new https.Agent( { maxCachedSessions: 0 } )
		};
	}

	protected getExpirationDate(): Promise<number|null> {
		let certExpiration: string;

		return new Promise( ( resolve, reject ) => {
			const req: ReturnType<typeof https.request> = https.request( this._requestOptions, res => {
				certExpiration = ( res.socket as TLSSocket )?.getPeerCertificate()?.valid_to ?? '';

				if ( !certExpiration ) {
					resolve( null );
				}

				const timeDifference: number = ( new Date( certExpiration ) ).getTime() - ( new Date() ).getTime();
				const expiresInDays: number = Math.floor( timeDifference / ( 1000 * 60 * 60 * 24 ) );

				resolve( expiresInDays );
			} );

			req.on( 'error', error => {
				reject( error );
			} );

			req.end();
		} );
	}
}

export default CertificateExpirationTest;
