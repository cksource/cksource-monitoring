/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ICheck } from '../checksSuites/Check.js';

import PingSiteCheck from '../checksSuites/PingSiteCheck/PingSiteCheck.js';
import { PingSiteCheckDefinition } from '../checksSuites/PingSiteCheck/PingSiteCheckDefinition.js';

import DomainExpirationCheck from '../checksSuites/DomainExpirationCheck/DomainExpirationCheck.js';
import { DomainExpirationCheckDefinition } from '../checksSuites/DomainExpirationCheck/DomainExpirationCheckDefinition.js';

import CertificateExpirationCheck from '../checksSuites/CertificateExpirationCheck/CertificateExpirationCheck.js';
import { CertificateExpirationCheckDefinition } from '../checksSuites/CertificateExpirationCheck/CertificateExpirationCheckDefinition.js';

import ButterCMSPostsStatusCheck from '../checksSuites/ButterCMSStatusCheck/ButterCMSPostsStatusCheck.js';
import ButterCMSPagesStatusCheck from '../checksSuites/ButterCMSStatusCheck/ButterCMSPagesStatusCheck.js';
import ButterCMSCollectionsStatusCheck from '../checksSuites/ButterCMSStatusCheck/ButterCMSCollectionsStatusCheck.js';
import { CheckDefinition } from '../checksSuites/CheckDefinition.js';

import { PING, IPingCheckEntry } from '../checks/PING.js';
import { DOMAINS } from '../checks/DOMAINS.js';
import { CERTIFICATES } from '../checks/CERTIFICATES.js';

export function getChecks( checkTypesToRun: string[] ): ICheck[] {
	const CHECKS: ICheck[] = [];

	if ( checkTypesToRun.includes( 'ping' ) ) {
		for ( const [ organization, data ] of Object.entries( PING ) ) {
			for ( const [ productGroup, entries ] of Object.entries( data ) ) {
				for ( const entry of entries as IPingCheckEntry[] ) {
					CHECKS.push( new PingSiteCheck( new PingSiteCheckDefinition( {
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

	if ( checkTypesToRun.includes( 'domain' ) ) {
		for ( const [ organization, data ] of Object.entries( DOMAINS ) ) {
			data.forEach( ( domain: string ) => {
				CHECKS.push( new DomainExpirationCheck( new DomainExpirationCheckDefinition( {
					organization,
					productGroup: 'domain',
					productName: domain,
					domain
				} ) ) );
			} );
		}
	}

	if ( checkTypesToRun.includes( 'certificate' ) ) {
		for ( const [ organization, data ] of Object.entries( CERTIFICATES ) ) {
			data.forEach( ( url: string ) => {
				CHECKS.push( new CertificateExpirationCheck( new CertificateExpirationCheckDefinition( {
					organization,
					productGroup: 'certificate',
					productName: url,
					url
				} ) ) );
			} );
		}
	}

	if ( checkTypesToRun.includes( 'buttercms_status' ) ) {
		CHECKS.push( new ButterCMSPostsStatusCheck( new CheckDefinition( {
			organization: 'ButterCMS',
			productGroup: 'apis',
			productName: 'posts'
		} ) ) );
		CHECKS.push( new ButterCMSPagesStatusCheck( new CheckDefinition( {
			organization: 'ButterCMS',
			productGroup: 'apis',
			productName: 'pages'
		} ) ) );
		CHECKS.push( new ButterCMSCollectionsStatusCheck( new CheckDefinition( {
			organization: 'ButterCMS',
			productGroup: 'apis',
			productName: 'collections'
		} ) ) );
	}

	return CHECKS;
}
