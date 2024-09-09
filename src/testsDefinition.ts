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

import { testsData, IPingTestEntry } from './testsData.js';

export function getTestsDefinition( testTypesToRun: string[] ): ITest[] {
	const TESTS_DEFINITION: ITest[] = [];

	for ( const [ organization, testTypes ] of Object.entries( testsData ) ) {
		for ( const [ testType, data ] of Object.entries( testTypes ) ) {
			switch ( testType ) {
				case 'ping':
					if ( !testTypesToRun.includes( 'ping' ) ) {
						break;
					}

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
					if ( !testTypesToRun.includes( 'domain' ) ) {
						break;
					}

					data.forEach( ( domain: string ) => {
						TESTS_DEFINITION.push( new DomainExpirationTest( new DomainExpirationTestDefinition( {
							organization,
							productGroup: testType,
							productName: domain,
							domain
						} ) ) );
					} );

					break;

				case 'certificate':

					if ( !testTypesToRun.includes( 'certificate' ) ) {
						break;
					}

					data.forEach( ( url: string ) => {
						TESTS_DEFINITION.push( new CertificateExpirationTest( new CertificateExpirationTestDefinition( {
							organization,
							productGroup: testType,
							productName: url,
							url
						} ) ) );
					} );
					break;

				default:
					console.log( 'Unknown type' );
					break;
			}
		}
	}

	return TESTS_DEFINITION;
}
