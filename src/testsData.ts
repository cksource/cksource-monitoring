/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export type OrganizationName = 'Tiugo' | 'CKSource' | 'Tiny' | 'ButterCMS';

export interface IPingTestEntry {
	name: string;
	url: string;
	expectedContent?: string;
}

interface ITestList {
	domain?: string[];
	certificate?: string[];
	ping?: Record<string, IPingTestEntry[]>;
}

export const testsData: Record<OrganizationName, ITestList> = {
	Tiugo: {
		domain: [
			'tiugotech.com'
		],
		certificate: [
			'https://tiugotech.com'
		],
		ping: {
			websites: [
				{
					name: 'tiugotech.com',
					url: 'https://www.tiugotech.com/',
					expectedContent: 'Tiugo Technologies'
				}
			]
		}
	},
	CKSource: {
		domain: [
			'ckbox.io',
			'ckbox.cloud',
			'ckdocs.io',
			'ckeditor-cs.com',
			'ckeditor-dev.com',
			'ckeditor-staging.com',
			'cke-cs.com',
			'cke-cs-staging.com',
			'cke-cs-dev.com',
			'ckeditor.com',
			'ckeditor.dev',
			'ckeditor.net',
			'ckeditor.org',
			'ckfinder.com',
			'ckfinder.net',
			'cksource.com',
			'collaborativeeditor.com',
			'fckeditor.com',
			'fckeditor.net',
			'htmleditor.dev',
			'markdowneditor.dev',
			'onlinehtmleditor.dev',
			'onlinemarkdowneditor.dev',
			'realtimehtmleditor.net',
			'richtexteditor.dev',
			'wordtohtml.dev',
			'wysiwygeditor.dev',
			'wysiwygeditor.net'
		],
		certificate: [
			'https://ckbox.io',
			'https://cdn.ckbox.io',
			'https://download.ckbox.io',
			'https://cdn-source.ckbox.io',

			'https://ckeditor.com',
			'https://builder-api.ckeditor.com',
			'https://cla.ckeditor.com',
			'https://cdn.ckeditor.com',
			'https://cdn-source.ckeditor.com',
			'https://cke4.ckeditor.com',
			'https://ckeditor-demo-preview-1.ckeditor.com',
			'https://prev1.ckeditor.com',
			'https://preview-blog.ckeditor.com',
			'https://preview.ckeditor.com',
			'https://svn.ckeditor.com',
			'https://dev.ckeditor.com',
			'https://d1.ckeditor.com',
			'https://dashboard.ckeditor.com',
			'https://sales.ckeditor.com',
			'https://staging-orders.ckeditor.com',
			'https://staging.ckeditor.com',
			'https://docs-old.ckeditor.com',
			'https://ckeditor.com/docs/',
			'https://ckeditor.com/cke4/addons/plugins/all',

			'https://ckeditor.dev/',
			'https://develop.ckeditor.dev/',

			'https://cke-cs.com',
			'https://cke-cs-staging.com',
			'https://cke-cs-dev.com',

			'https://builder.ckeditor-dev.com',
			'https://builder-demo.ckeditor-dev.com',
			'https://builder-nightly.ckeditor-dev.com',

			'https://cksource.com',
			'https://a.cksource.com',
			'https://c.cksource.com',
			'https://cib.cksource.com',
			'https://download.cksource.com',
			'https://download-source.cksource.com',
			'https://hanghub.cksource.com',
			'https://host04.cksource.com',
			'https://maven.cksource.com',
			'https://outreach.cksource.com',
			'https://preview.cksource.com',
			'https://translations.cksource.com',

			'https://fckeditor.net',
			'https://mediawiki.fckeditor.net',

			'https://onlinehtmleditor.dev',

			'https://onlinemarkdowneditor.dev'
		],
		ping: {
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
					name: '/technology-partners',
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
					name: 'CKEditor CLA',
					url: 'https://cla.ckeditor.com/cksource/img/cla-workflow.png'
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
				},
				{
					name: 'Zenhub integration',
					url: 'https://zenhub-integration.internal.cke-cs-dev.com/'
				}
			]
		}
	},
	Tiny: {
		domain: [
			'tiny.cloud'
		],
		certificate: [
			'https://tiny.cloud',
			'https://cla.tiny.cloud'
		],
		ping: {
			cloud: [
				{
					name: 'Tiny CLA',
					url: 'https://cla.tiny.cloud/tiny/img/cla-workflow.png'
				}
			]
		}
	},
	ButterCMS: {
		domain: [
			'buttercms.com'
		],
		certificate: [
			'https://buttercms.com',
			'https://api.buttercms.com',
			'https://buttercms-ai-proxy.internal.cke-cs.com'
		],
		ping: {
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
				},
				{
					name: 'ButterCMS AI Proxy',
					url: 'https://buttercms-ai-proxy.internal.cke-cs.com/health/liveliness'
				}
			]
		}
	}
};
