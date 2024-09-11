/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import * as net from 'net';

import ExpirationCheck from '../ExpirationCheck.js';
import { DomainExpirationCheckDefinition } from './DomainExpirationCheckDefinition.js';

class DomainExpirationCheck extends ExpirationCheck {
	public checkName: string = 'domain_expiration';

	private readonly _domain: string;

	private readonly _whoisServers: { [key: string]: string; } = {
		'com': 'whois.verisign-grs.com',
		'net': 'whois.verisign-grs.com',
		'org': 'whois.pir.org',
		'io': 'whois.nic.io',
		'dev': 'whois.nic.google',
		'cloud': 'whois.nic.cloud'
	};

	public constructor(
		public checkDefinition: DomainExpirationCheckDefinition
	) {
		super( checkDefinition );
		this._domain = checkDefinition.domain;
	}

	protected async getExpirationDate(): Promise<number|null> {
		const domainTld: string = this._domain.slice( this._domain.lastIndexOf( '.' ) + 1 );
		const whoisHost: string = this._whoisServers[ domainTld ];

		if ( !whoisHost ) {
			return null;
		}

		const result: string = await this._whoisQuery( this._domain, whoisHost );

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
}

export default DomainExpirationCheck;
