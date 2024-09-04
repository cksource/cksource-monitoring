/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import * as net from 'net';

import { Gauge } from 'prom-client';

import { ITest } from '../Test';
import { DomainExpirationTestDefinition } from './DomainExpirationTestDefinition';
import { DomainExpirationError } from '../../errors/DomainExpirationError';
import { IMetrics } from '../../common/Metrics';

const GAUGE_NAME: string = 'monitoring_expiration_test';

class DomainExpirationTest implements ITest {
	public testName: string = 'domain_expiration';

	private readonly _whoisServers: { [key: string]: string; } = {
		'com': 'whois.verisign-grs.com',
		'net': 'whois.verisign-grs.com',
		'org': 'whois.pir.org',
		'io': 'whois.nic.io',
		'dev': 'whois.nic.google'
	};

	public constructor(
		public testDefinition: DomainExpirationTestDefinition
	) {}

	public async run( metrics: IMetrics ): Promise<void> {
		const expiresInDays: number|null = await this._requestDomainCheck( this.testDefinition.domain );

		if ( expiresInDays ) {
			this._setGaugeValue( metrics, expiresInDays );
		}

		if ( !expiresInDays || expiresInDays <= 14 ) {
			throw new DomainExpirationError( { expiresInDays } );
		}
	}

	private async _requestDomainCheck( domain: string ): Promise<number|null> {
		const domainTld: string = domain.slice( domain.lastIndexOf( '.' ) + 1 );
		const whoisHost: string = this._whoisServers[ domainTld ];

		if ( !whoisHost ) {
			return null;
		}

		const result: string = await this._whoisQuery( domain, whoisHost );

		return this._getExpireData( result );
	}

	private _whoisQuery( domain: string, server: string ): Promise<string> {
		const port: number = 43;
		const timeout: number = 3000;
		const querySuffix: string = '\r\n';

		return new Promise( ( resolve, reject ) => {
			try {
				let buffer: string = '';

				const client: net.Socket = new net.Socket();

				client.setTimeout( timeout );
				client.connect( port, server, () => client.write( domain + querySuffix ) );

				client.on( 'data', chunk => ( buffer += chunk ) );
				client.on( 'close', hadError => resolve( buffer ) );
				client.on( 'timeout', () => client.destroy( new Error( 'Timeout' ) ) );
				client.on( 'error', err => reject( err ) );
			} catch ( error ) {
				reject( error );
			}
		} );
	}

	private _getExpireData( result: string ): number|null {
		const expiryString: string = 'Registry Expiry Date: ';

		const parsedDate: string = result
			.trim()
			.split( '\n' )
			.map( line => line.trim().replace( '\t', '' ) )
			.filter( line => line.startsWith( expiryString ) )
			.map( line => line.replace( expiryString, '' ).trim() )[ 0 ];

		const timeDifference: number = ( new Date( parsedDate ) ).getTime() - ( new Date() ).getTime();
		const expiresInDays: number = Math.floor( timeDifference / ( 1000 * 60 * 60 * 24 ) );

		return expiresInDays;
	}

	private _setGaugeValue( metrics: IMetrics, value: number ): void {
		const gauge: Gauge<string> = metrics.gauge(
			GAUGE_NAME,
			[
				'test_name',
				'product_name',
				'product_group',
				'organization'
			]
		);

		gauge.set(
			{
				test_name: this.testName,
				product_name: this.testDefinition.productName,
				product_group: this.testDefinition.productGroup,
				organization: this.testDefinition.organization
			},
			value
		);
	}
}

export default DomainExpirationTest;
