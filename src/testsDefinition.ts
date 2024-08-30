/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import PingSiteTest from './tests/PingSiteTest/PingSiteTest';
import { PingSiteTestDefinition } from './tests/PingSiteTest/PingSiteTestDefinition';
import { ITest } from './tests/Test';

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
			url: 'https://ckeditor.com/docs/'
		},
		{
			name: '/builder',
			url: 'https://ckeditor.com/ckeditor-5/builder/'
		},
		{
			name: '/cke4',
			url: 'https://ckeditor.com/cke4/addons/plugins/all'
		},
		{
			name: '/docs/ckfinder',
			url: 'https://ckeditor.com/docs/ckfinder/ckfinder3/'
		},
		{
			name: '/ckfinder/demo',
			url: 'https://ckeditor.com/ckfinder/demo/'
		},
		{
			name: '/partners',
			url: 'https://ckeditor.com/partners/'
		},
		{
			name: '/technology',
			url: 'https://ckeditor.com/technology-partners'
		}
	],
	CDNs: [
		{
			name: 'CKEditor CDN',
			url: 'https://cdn.ckeditor.com/'
		},
		{
			name: 'CKSource CDN',
			url: 'https://download.cksource.com/'
		},
		{
			name: 'CKBox CDN',
			url: 'https://cdn.ckbox.io/healthz.html'
		},
		{
			name: 'CKBox zips CDN',
			url: 'https://download.ckbox.io/healthz.html'
		}

	],
	internalTools: [
		{
			name: 'CKE5 nightly docs',
			url: 'https://ckeditor5.github.io/docs/nightly/ckeditor5/latest/index.html'
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
			name: 'Merge branches',
			url: 'https://merge-branches.internal.cke-cs-dev.com/'
		},
		{
			name: 'Hanghub',
			url: 'https://hanghub.cksource.com/healthz'
		}
	]
} as const;

const tiugoPingSiteData: Record<string, Record<string, string>[]> = {
	websites: [
		{
			name: 'tiugotech.com',
			url: 'https://www.tiugotech.com/',
			expectedContent: 'Tiugo Technologies'
		}
	]
} as const;

export function getTestsDefinition(): ITest[] {
	const TESTS_DEFINITION: ITest[] = [];

	// Create ping site tests for CKSource
	for ( const group in cksourcePingSiteData ) {
		cksourcePingSiteData[ group ].forEach( entry => {
			TESTS_DEFINITION.push( new PingSiteTest( new PingSiteTestDefinition( {
				organization: 'CKSource',
				productGroup: group,
				productName: entry.name,
				url: entry.url,
				expectedContent: entry.expectedContent
			} ) ) );
		} );
	}

	// Create ping site tests for Tiugo
	for ( const group in tiugoPingSiteData ) {
		tiugoPingSiteData[ group ].forEach( entry => {
			TESTS_DEFINITION.push( new PingSiteTest( new PingSiteTestDefinition( {
				organization: 'Tiugo',
				productGroup: group,
				productName: entry.name,
				url: entry.url,
				expectedContent: entry.expectedContent
			} ) ) );
		} );
	}

	return TESTS_DEFINITION;
}
