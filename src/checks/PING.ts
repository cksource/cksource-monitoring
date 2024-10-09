/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { OrganizationName } from '../common/types.js';

export interface IPingCheckEntry {
	name: string;
	url: string;
	expectedContent?: string;
}

export const PING: Record<OrganizationName, Record<string, IPingCheckEntry[]>> = {
	Tiugo: {
		websites: [
			{
				name: 'tiugotech.com',
				url: 'https://www.tiugotech.com/',
				expectedContent: 'Tiugo Technologies'
			}
		]
	},
	CKSource: {
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
			},
			{
				name: 'dashboard.ckeditor.com',
				url: 'https://dashboard.ckeditor.com',
				expectedContent: 'Dashboard'
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
				name: '/technology',
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
			},
			{
				name: 'CKEditor 4 versions',
				url: 'https://cke4.ckeditor.com/ckeditor4-secure-version/versions.json',
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
				name: 'CKEditor CLA',
				url: 'https://cla.ckeditor.com/cksource/img/cla-workflow.png'
			},
			{
				name: 'CKE5 Builder API',
				url: 'https://builder-api.ckeditor.com/healthz/live'
			},
			{
				name: 'CKE5 Builder nightly',
				url: 'https://builder-nightly.ckeditor-dev.com/ckeditor-5/builder/'
			},
			{
				name: 'CKE5 Builder demo',
				url: 'https://builder-demo.ckeditor-dev.com/ckeditor-5/builder/'
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
	},
	Tiny: {
		cloud: [
			{
				name: 'Tiny CLA',
				url: 'https://cla.tiny.cloud/tiny/img/cla-workflow.png'
			}
		]
	},
	ButterCMS: {
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
			},
			{
				name: 'Status page',
				url: 'https://status.buttercms.com',
				expectedContent: 'Uptime'
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
};
