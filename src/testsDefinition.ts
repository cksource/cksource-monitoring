/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITest } from './tests/Test';

import PingSiteTest from './tests/PingSiteTest/PingSiteTest';
import { PingSiteTestDefinition } from './tests/PingSiteTest/PingSiteTestDefinition';

import DomainExpirationTest from './tests/DomainExpirationTest/DomainExpirationTest';
import { DomainExpirationTestDefinition } from './tests/DomainExpirationTest/DomainExpirationTestDefinition';

import CertificateExpirationTest from './tests/CertificateExpirationTest/CertificateExpirationTest';
import { CertificateExpirationTestDefinition } from './tests/CertificateExpirationTest/CertificateExpirationTestDefinition';

import { testsData } from './testsData';

export function getTestsDefinition(): ITest[] {
	const TESTS_DEFINITION: ITest[] = [];

	for ( const [ organization, testTypes ] of Object.entries( testsData ) ) {
		for ( const [ testType, data ] of Object.entries( testTypes ) ) {
			switch ( testType ) {
				case 'ping':
					for ( const [ productGroup, entries ] of Object.entries( data ) ) {
						// @ts-ignore entry is always `any` type
						for ( const entry of entries ) {
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
					// @ts-ignore entry is always `any` type
					data.forEach( entry => {
						TESTS_DEFINITION.push( new DomainExpirationTest( new DomainExpirationTestDefinition( {
							organization,
							productGroup: testType,
							productName: entry,
							domain: entry
						} ) ) );
					} );
					break;

				case 'certificate':
					// @ts-ignore entry is always `any` type
					data.forEach( entry => {
						TESTS_DEFINITION.push( new CertificateExpirationTest( new CertificateExpirationTestDefinition( {
							organization,
							productGroup: testType,
							productName: entry,
							url: entry
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
