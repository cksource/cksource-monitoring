/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import https, { RequestOptions } from 'https';
import { TLSSocket } from 'tls';

import { Gauge } from 'prom-client';

import { ITest } from '../Test';
import { IMetrics } from '../../common/Metrics';
import { CertificateExpirationTestDefinition } from './CertificateExpirationTestDefinition';
import { CertificateExpirationError } from '../../errors/CertificateExpirationError';

const GAUGE_NAME: string = 'monitoring_expiration_test';

class CertificateExpirationValidationTest implements ITest {
	public testName: string = 'certificate_expiration';

	private readonly _requestOptions: RequestOptions;

	public constructor(
		public testDefinition: CertificateExpirationTestDefinition
	) {
		const parsedUrl: URL = new URL( 'https://' + this.testDefinition.url );

		this._requestOptions = {
			host: parsedUrl.host,
			path: parsedUrl.pathname,
			agent: new https.Agent( { maxCachedSessions: 0 } )
		};
	}

	public async run( metrics: IMetrics ): Promise<void> {
		const expiresInDays: number|null = await this._checkCertificate();

		if ( expiresInDays ) {
			this._setGaugeValue( metrics, expiresInDays );
		}

		if ( !expiresInDays || expiresInDays <= 14 ) {
			throw new CertificateExpirationError( { expiresInDays } );
		}
	}

	private _checkCertificate(): Promise<number|null> {
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

	private _setGaugeValue( metrics: IMetrics, value: number ): void {
		const gauge: Gauge<string> = metrics.gauge(
			GAUGE_NAME,
			[
				'test_name',
				'product_name',
				'product_group',
				'organization',
				'set_at'
			]
		);

		gauge.set(
			{
				test_name: this.testName,
				product_name: this.testDefinition.productName,
				product_group: this.testDefinition.productGroup,
				organization: this.testDefinition.organization,
				set_at: ( new Date() ).toISOString()
			},
			value
		);
	}
}

export default CertificateExpirationValidationTest;
