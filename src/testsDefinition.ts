/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import PingSiteTest from './tests/PingSiteTest/PingSiteTest';
import { PingSiteTestDefinition } from './tests/PingSiteTest/PingSiteTestDefinition';
import { ITest } from './tests/Test';
import CertificateExpirationTest from './tests/CertificateExpirationTest/CertificateExpirationTest';
import { CertificateExpirationTestDefinition } from './tests/CertificateExpirationTest/CertificateExpirationTestDefinition';

const cksourcePingSiteData: Record<string, Record<string, string>[]> = {
	websites: [
		{
			name: 'cksource.com',
			url: 'https://cksource.com/',
			expectedContent: 'CKSource'
		},
		{
			name: 'onlinehtmleditor.dev',
			url: 'https://onlinehtmleditor.dev/',
			expectedContent: 'CKEditor 5'
		},
		{
			name: 'onlinemarkdowneditor.dev',
			url: 'https://onlinemarkdowneditor.dev/',
			expectedContent: 'CKEditor 5'
		}
	],
	ckeditorWebsite: [
		{
			name: 'ckeditor.com',
			url: 'https://ckeditor.com/',
			expectedContent: 'CKEditor 5'
		},
		{
			name: '/docs',
			url: 'https://ckeditor.com/docs/',
			expectedContent: 'CKEditor Ecosystem Documentation'
		},
		{
			name: '/builder',
			url: 'https://ckeditor.com/ckeditor-5/builder/',
			expectedContent: 'CKEditor 5 Builder'
		},
		{
			name: '/cke4',
			url: 'https://ckeditor.com/cke4/addons/plugins/all',
			expectedContent: 'Plugins'
		},
		{
			name: '/docs/ckfinder',
			url: 'https://ckeditor.com/docs/ckfinder/ckfinder3/',
			expectedContent: 'CKFinder 3 Documentation'
		},
		{
			name: '/ckfinder/demo',
			url: 'https://ckeditor.com/ckfinder/demo/',
			expectedContent: 'CKFinder demo'
		},
		{
			name: '/partners',
			url: 'https://ckeditor.com/partners/',
			expectedContent: 'Service'
		},
		{
			name: '/technology-partners',
			url: 'https://ckeditor.com/technology-partners',
			expectedContent: 'Technology'
		}
	],
	CDNs: [
		{
			name: 'CKEditor CDN',
			url: 'https://cdn.ckeditor.com/',
			expectedContent: 'CKEditor CDN'
		},
		{
			name: 'CKSource CDN',
			url: 'https://download.cksource.com/',
			expectedContent: 'download page'
		},
		{
			name: 'CKBox CDN',
			url: 'https://cdn.ckbox.io/healthz.html',
			expectedContent: 'OK!'
		},
		{
			name: 'CKBox zips CDN',
			url: 'https://download.ckbox.io/healthz.html',
			expectedContent: 'OK!'
		}

	],
	internalTools: [
		{
			name: 'CKE5 nightly docs',
			url: 'https://ckeditor5.github.io/docs/nightly/ckeditor5/latest/index.html',
			expectedContent: 'CKEditor 5 documentation'
		},
		{
			name: 'Tiny CLA',
			url: 'https://cla.tiny.cloud/tiny/img/cla-workflow.png'
		},
		{
			name: 'CKEditor CLA',
			url: 'https://cla.ckeditor.com/cksource/img/cla-workflow.png'
		},
		{
			name: 'ButterCMS AI Proxy',
			url: 'https://buttercms-ai-proxy.internal.cke-cs.com/health/liveliness'
		},
		{
			name: 'CKE5 Builder API',
			url: 'https://builder-api.ckeditor.com/healthz/live'
		},
		{
			name: 'Zenhub integration',
			url: 'https://zenhub-integration.internal.cke-cs-dev.com/'
		},
		{
			name: 'Merge branches',
			url: 'https://merge-branches.internal.cke-cs-dev.com/'
		},
		{
			name: 'Hanghub',
			url: 'https://hanghub.cksource.com/healthz'
		}
	]
};

const tiugoPingSiteData: Record<string, Record<string, string>[]> = {
	websites: [
		{
			name: 'tiugotech.com',
			url: 'https://www.tiugotech.com/',
			expectedContent: 'Tiugo Technologies'
		}
	]
};

const butterCMSPingSiteData: Record<string, Record<string, string>[]> = {
	websites: [
		{
			name: 'Landing page',
			url: 'https://buttercms.com',
			expectedContent: 'ButterCMS'
		},
		{
			name: 'Home page',
			url: 'https://buttercms.com/home/',
			expectedContent: 'Login'
		},
		{
			name: 'Login page',
			url: 'https://buttercms.com/login/',
			expectedContent: 'Login'
		}
	],
	apis: [
		{
			name: 'API Main page',
			url: 'https://api.buttercms.com/v2/'
		},
		{
			name: 'Posts API',
			url: 'https://api.buttercms.com/v2/posts/?auth_token=6e9f14b48892b00079604c24c7c64a6a987456cf'
		},
		{
			name: 'Posts API - main page',
			url: 'https://buttercms.com/v2/posts/?auth_token=6e9f14b48892b00079604c24c7c64a6a987456cf'
		}
	]
};

export function getTestsDefinition(): ITest[] {
	const TESTS_DEFINITION: ITest[] = [];

	// // Create ping site tests for CKSource
	// for ( const group in cksourcePingSiteData ) {
	// 	cksourcePingSiteData[ group ].forEach( entry => {
	// 		TESTS_DEFINITION.push( new PingSiteTest( new PingSiteTestDefinition( {
	// 			organization: 'CKSource',
	// 			productGroup: group,
	// 			productName: entry.name,
	// 			url: entry.url,
	// 			expectedContent: entry.expectedContent
	// 		} ) ) );
	// 	} );
	// }

	// // Create ping site tests for Tiugo
	// for ( const group in tiugoPingSiteData ) {
	// 	tiugoPingSiteData[ group ].forEach( entry => {
	// 		TESTS_DEFINITION.push( new PingSiteTest( new PingSiteTestDefinition( {
	// 			organization: 'Tiugo',
	// 			productGroup: group,
	// 			productName: entry.name,
	// 			url: entry.url,
	// 			expectedContent: entry.expectedContent
	// 		} ) ) );
	// 	} );
	// }

	// // Create ping site tests for ButterCMS
	// for ( const group in butterCMSPingSiteData ) {
	// 	butterCMSPingSiteData[ group ].forEach( entry => {
	// 		TESTS_DEFINITION.push( new PingSiteTest( new PingSiteTestDefinition( {
	// 			organization: 'ButterCMS',
	// 			productGroup: group,
	// 			productName: entry.name,
	// 			url: entry.url,
	// 			expectedContent: entry.expectedContent
	// 		} ) ) );
	// 	} );
	// }

	TESTS_DEFINITION.push(
		new CertificateExpirationTest(
			new CertificateExpirationTestDefinition( {
				organization: 'CKSource',
				productGroup: 'websites',
				productName: 'ckeditor.com',
				url: 'ckeditor.com'
			} )
		)
	);

	return TESTS_DEFINITION;
}
