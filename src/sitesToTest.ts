/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
const pingSiteData: Record<string, string[]> = {
	websites: [
		'https://ckeditor.com/',
		'https://cksource.com/',
		'https://onlinehtmleditor.dev/',
		'https://onlinemarkdowneditor.dev/'
	],
	ckeditorOrigins: [
		'https://ckeditor.com/docs/',
		'https://ckeditor.com/ckeditor-5/builder/',
		'https://ckeditor.com/cke4/addons/plugins/all',
		'https://ckeditor.com/docs/ckfinder/ckfinder3/',
		'https://origin.ckeditor.com/old/forums',
		'https://ckeditor.com/ckfinder/demo/',
		'https://ckeditor.com/partners/',
		'https://ckeditor.com/technology-partners'
	],
	CDNs: [
		'https://cdn.ckeditor.com/',
		'https://download.cksource.com/',
		'https://cdn.ckbox.io/healthz.html',
		'https://download.ckbox.io/healthz.html'
	],
	internalCDNs: [
		'https://ckeditor5.github.io/docs/nightly/ckeditor5/latest/index.html',
		'https://builder.ckeditor-dev.com/ckeditor-5/builder/',
		'https://builder-nightly.ckeditor-dev.com/ckeditor-5/builder/',
		'https://builder-demo.ckeditor-dev.com/ckeditor-5/builder/'
	],
	internalTools: [
		'https://cla.tiny.cloud/tiny/img/cla-workflow.png',
		'https://cla.ckeditor.com/cksource/img/cla-workflow.png',
		'https://buttercms-ai-proxy.internal.cke-cs-dev.com/health/liveliness',
		'https://buttercms-ai-proxy.internal.cke-cs.com/health/liveliness',
		'https://builder-api.internal.cke-cs-dev.com/healthz/live',
		'https://builder-api.ckeditor.com/healthz/live',
		'https://zenhub-integration.internal.cke-cs-dev.com/',
		'https://merge-branches.internal.cke-cs-dev.com/',
		'https://docs-builder.internal.cke-cs-dev.com/favicon.ico',
		'https://scrum-poker.internal.cke-cs-dev.com/',
		'https://qa-automation.internal.cke-cs-dev.com/health',
		'https://hanghub.cksource.com/healthz',
		'https://cs-framework-docs.internal.cke-cs-dev.com/healthz'
	]
};

export { pingSiteData };
