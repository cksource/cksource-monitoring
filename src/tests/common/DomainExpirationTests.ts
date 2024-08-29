/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import * as net from 'net';

import { URL } from 'url';

import { WhoisResolvers } from '../WhoisResolvers';

import { ITest, TestResults } from '../Test';
import { RequestFailError } from '../../errors/RequestFailError';

class DomainExpirationValidationTest implements ITest {
	public productName: string;

	public testName: string = 'domain-expiration-validation';

	public productGroup: string;

	public organization: string;

	public hostname: string;

	public constructor(
        private readonly _address: string
	) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.host;
		this.hostname = parsedUrl.hostname.toLowerCase();
	}

	public async run(): Promise<TestResults> {
		const expiresInDays: number | undefined = await this._requestDomainCheck( this.hostname );

		return { status: expiresInDays ? 0 : 1, expiresInDays };
	}

	private async _requestDomainCheck( domain: string ): Promise<number|undefined> {
		const domainTld: string = domain.slice( domain.lastIndexOf( '.' ) + 1 );
		let whoisHost: string;

		if ( WhoisResolvers[ domainTld ] ) {
			whoisHost = WhoisResolvers[ domainTld ];
		}

		if ( !whoisHost ) {
			const tld: string = await this._whoisTld( domain );

			if ( !tld ) {
				throw new RequestFailError( 404, `TLD for "${ domain }" not supported` );
			}

			whoisHost = tld;
			WhoisResolvers[ domainTld ] = tld;
		}

		const result: string = await this._whoisQuery( domain, whoisHost );

		return this._getExpiresInDays( result );
	}

	private _whoisQuery( domain: string, server: string ): Promise<string|undefined> {
		const port: number = 43;
		const timeout: number = 15000;
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

	private _getExpiresInDays( result: string ): number|undefined {
		const expiryStrings: string[] = [
			'registrar registration expiration date',
			'registry expiry date',
			'expires on',
			'expires',
			'expiration time',
			'expire date',
			'expiration date',
			'expires',
			'additional info expires on',
			'paid-till',
			'expiry date',
			'expire',
			'relevant dates expiry date',
			'record will expire on',
			'expired'
		];

		const lines: string[] = result
			.trim()
			.split( '\n' )
			.map( line => line.trim().replace( '\t', '  ' ) )
			.filter( line => (
				!line.startsWith( 'NOTICE:' ) && !line.startsWith( 'TERMS OF USE:' )
			) )
			.filter( line => expiryStrings.some( exp => line.toLowerCase().startsWith( exp ) ) )
			.map( line => line.replace( '::', ':' ) )
			.map( line => {
				expiryStrings.forEach( exp => {
					line = line.toLowerCase().startsWith( exp ) ? line.toLowerCase().replace( exp, '' ) : line;
				} );
				line = line.startsWith( ':' ) ? line.slice( 1 ) : line;

				return line.trim();
			} )
			.filter( ( value, index, self ) => self.indexOf( value ) === index );

		if ( !lines.length ) {
			return undefined;
		}

		const domainExpiration: Date = new Date( lines.pop() );
		const expiresInDays: number = Math.floor( ( domainExpiration.getTime() - ( new Date() ).getTime() ) / ( 1000 * 60 * 60 * 24 ) );

		return expiresInDays > 0 ? expiresInDays : 0;
	}

	/**
	 * This will fetch general domain info but without the expiration dates,
	 * but it will contain refer or whois line with the Whois server to request
	 * more data from.
	 */
	private async _whoisTld( domain: string ): Promise<string|undefined> {
		const whoisHost: string = WhoisResolvers.tld;

		try {
			const result: string | undefined = await this._whoisQuery( domain, whoisHost );

			return new Promise( ( resolve, reject ) => {
				if ( !result ) {
					reject( undefined );
				}

				resolve( this._parseTldResult( result ) );
			} );
		} catch ( error ) {
			return new Promise( ( resolve, reject ) => {
				reject( error );
			} );
		}
	}

	private _parseTldResult( result: string ): string {
		const lines: string[] = result
			.trim()
			.split( '\n' )
			.map( line => line.trim().replace( '\t', '  ' ) )
			.filter( line => line.includes( 'whois:' ) || line.includes( 'refer:' ) )
			.map( line => line.replace( /whois:|refer:/gi, '' ).trim() )
			.filter( ( value, index, self ) => self.indexOf( value ) === index );

		return lines.pop() ?? undefined;
	}
}

export default DomainExpirationValidationTest;
