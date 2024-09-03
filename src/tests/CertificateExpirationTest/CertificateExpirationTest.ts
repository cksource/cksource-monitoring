/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import https, { RequestOptions } from 'https';
import { TLSSocket } from 'tls';

import { ITest } from '../Test';
import { CertificateExpirationTestDefinition } from './CertificateExpirationTestDefinition';
import { CertificateExpirationError } from '../../errors/CertificateExpirationError';

class CertificateExpirationValidationTest implements ITest {
	public testName: string = 'certificate';

	private readonly _requestOptions: RequestOptions;

	public constructor(
		public testDefinition: CertificateExpirationTestDefinition
	) {
		const parsedUrl: URL = new URL( 'https://' + this.testDefinition.url );

		this._requestOptions = { host: parsedUrl.host, path: parsedUrl.pathname };
	}

	public async run(): Promise<void> {
		const { expiresAt, expiresInDays } = await this._checkCertificate();

		// TODO: save expire dates as metrics
		console.log( expiresAt, expiresInDays );

		if ( expiresInDays <= 14 ) {
			throw new CertificateExpirationError( { expiresAt, expiresInDays } );
		}
	}

	private _checkCertificate(): Promise<{expiresInDays: number; expiresAt: number;}> {
		let certExpiration: string;

		return new Promise( ( resolve, reject ) => {
			const req: ReturnType<typeof https.request> = https.request( this._requestOptions, res => {
				certExpiration = ( res.socket as TLSSocket )?.getPeerCertificate()?.valid_to ?? '';

				const timeDifference: number = ( new Date( certExpiration ) ).getTime() - ( new Date() ).getTime();
				const expiresInDays: number = Math.floor( timeDifference / ( 1000 * 60 * 60 * 24 ) );

				resolve( { expiresInDays, expiresAt: ( new Date( certExpiration ) ).getTime() } );
			} );

			req.on( 'error', error => {
				reject( error );
			} );

			req.end();
		} );
	}
}

export default CertificateExpirationValidationTest;
