/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import https, { RequestOptions } from 'https';

import { URL } from 'url';

import { TLSSocket } from 'tls';

import { ITest, TestResults } from '../Test';

class CertificateExpirationValidationTest implements ITest {
	public productName: string;

	public testName: string = 'certificate-expiration-validation';

	public productGroup: string;

	public organization: string;

	public constructor(
        private readonly _address: string
	) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.host;
	}

	public async run(): Promise<TestResults> {
		const certExpiration: string | undefined = await this._requestCertificate( this.productName );

		return { status: typeof certExpiration === 'string' ? 0 : 1, certExpiration };
	}

	private _requestCertificate( host: string ): Promise<string|undefined> {
		let certExpiration: string | undefined;

		return new Promise( ( resolve, reject ) => {
			const options: RequestOptions = {
				host,
				port: 443,
				method: 'GET'
			};

			const req: ReturnType<typeof https.request> = https.request( options, res => {
				certExpiration = ( res.socket as TLSSocket )?.getPeerCertificate()?.valid_to;
			} );

			req.end( () => {
				resolve( certExpiration );
			} );
		} );
	}
}

export default CertificateExpirationValidationTest;
