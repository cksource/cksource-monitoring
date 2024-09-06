/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITest } from './tests/Test';

import PingSiteTest from './tests/PingSiteTest/PingSiteTest';
import { PingSiteTestDefinition } from './tests/PingSiteTest/PingSiteTestDefinition';

// import DomainExpirationTest from './tests/DomainExpirationTest/DomainExpirationTest';
// import { DomainExpirationTestDefinition } from './tests/DomainExpirationTest/DomainExpirationTestDefinition';

// import CertificateExpirationTest from './tests/CertificateExpirationTest/CertificateExpirationTest';
// import { CertificateExpirationTestDefinition } from './tests/CertificateExpirationTest/CertificateExpirationTestDefinition';

import { testsData, IPingTestEntry } from './testsData';

export function getTestsDefinition(): ITest[] {
	const TESTS_DEFINITION: ITest[] = [];

	for ( const [ organization, testTypes ] of Object.entries( testsData ) ) {
		for ( const [ testType, data ] of Object.entries( testTypes ) ) {
			switch ( testType ) {
				case 'ping':
					for ( const [ productGroup, entries ] of Object.entries( data ) ) {
						for ( const entry of entries as IPingTestEntry[] ) {
							TESTS_DEFINITION.push( new PingSiteTest( new PingSiteTestDefinition( {
								organization,
								productGroup,
								productName: entry.name,
								url: entry.url,
								expectedContent: entry.expectedContent
							} ) ) );
						}
					}

					break;

				case 'domain':
					// Temporary disable
					/*
					data.forEach( ( domain: string ) => {
						TESTS_DEFINITION.push( new DomainExpirationTest( new DomainExpirationTestDefinition( {
							organization,
							productGroup: testType,
							productName: domain,
							domain
						} ) ) );
					} );
					 */
					break;

				case 'certificate':
					// Temporary disable
					/*
					data.forEach( ( url: string ) => {
						TESTS_DEFINITION.push( new CertificateExpirationTest( new CertificateExpirationTestDefinition( {
							organization,
							productGroup: testType,
							productName: url,
							url
						} ) ) );
					} );
					*/
					break;

				default:
					console.log( 'Unknown type' );
					break;
			}
		}
	}

	return TESTS_DEFINITION;
}
