/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITest } from './tests/Test.js';

import PingSiteTest from './tests/PingSiteTest/PingSiteTest.js';
import { PingSiteTestDefinition } from './tests/PingSiteTest/PingSiteTestDefinition.js';

import DomainExpirationTest from './tests/DomainExpirationTest/DomainExpirationTest.js';
import { DomainExpirationTestDefinition } from './tests/DomainExpirationTest/DomainExpirationTestDefinition.js';

import CertificateExpirationTest from './tests/CertificateExpirationTest/CertificateExpirationTest.js';
import { CertificateExpirationTestDefinition } from './tests/CertificateExpirationTest/CertificateExpirationTestDefinition.js';

import { PING_DATA, IPingTestEntry } from './data/PING_DATA.js';
import { DOMAINS_DATA } from './data/DOMAINS_DATA.js';
import { CERTIFICATES_DATA } from './data/CERTIFICATES_DATA.js';

export function getTestsData( testTypesToRun: string[] ): ITest[] {
	const TESTS: ITest[] = [];

	if ( testTypesToRun.includes( 'ping' ) ) {
		for ( const [ organization, data ] of Object.entries( PING_DATA ) ) {
			for ( const [ productGroup, entries ] of Object.entries( data ) ) {
				for ( const entry of entries as IPingTestEntry[] ) {
					TESTS.push( new PingSiteTest( new PingSiteTestDefinition( {
						organization,
						productGroup,
						productName: entry.name,
						url: entry.url,
						expectedContent: entry.expectedContent
					} ) ) );
				}
			}
		}
	}

	if ( testTypesToRun.includes( 'domain' ) ) {
		for ( const [ organization, data ] of Object.entries( DOMAINS_DATA ) ) {
			data.forEach( ( domain: string ) => {
				TESTS.push( new DomainExpirationTest( new DomainExpirationTestDefinition( {
					organization,
					productGroup: 'domain',
					productName: domain,
					domain
				} ) ) );
			} );
		}
	}

	if ( testTypesToRun.includes( 'certificate' ) ) {
		for ( const [ organization, data ] of Object.entries( CERTIFICATES_DATA ) ) {
			data.forEach( ( url: string ) => {
				TESTS.push( new CertificateExpirationTest( new CertificateExpirationTestDefinition( {
					organization,
					productGroup: 'certificate',
					productName: url,
					url
				} ) ) );
			} );
		}
	}

	return TESTS;
}
