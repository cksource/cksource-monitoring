/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Pushgateway } from 'prom-client';
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

import TestsRunner from './TestsRunner';
import Metrics from './Metrics';
import { ITest } from './tests/Test';
import PingSiteTest from './tests/common/PingSiteTest';
import EditorDemoTest from './tests/common/EditorDemoTest';

import EditorAgent from './agents/EditorAgent';
import IEditorAgent from './agents/IEditorAgent';

const APPLICATION_NAME: string = 'cksource-monitoring';
const PUSHGATEWAY_URL: string = process.env.PUSHGATEWAY_URL ?? 'http://pushgateway:9091';

export const handler = async (): Promise<string> => {
	const DEMOS_URLS: string[] = [
		'https://ckeditor.com/ckeditor-5/demo/feature-rich/',
		'https://ckeditor.com/ckeditor-5/demo/editor-types/#classic',
		'https://ckeditor.com/ckeditor-5/demo/editor-types/#document',
		'https://ckeditor.com/ckeditor-5/demo/editor-types/#balloon',
		'https://ckeditor.com/ckeditor-5/demo/editor-types/#balloon-block',
		'https://ckeditor.com/ckeditor-5/demo/editor-types/#inline',
		'https://ckeditor.com/ckeditor-5/demo/editor-types/#bottom-toolbar',
		'https://ckeditor.com/ckeditor-5/demo/editor-types/#button-grouping',
		'https://ckeditor.com/ai-assistant/',
		'https://ckeditor.com/collaboration/demo/#real-time-collaboration',
		'https://ckeditor.com/collaboration/demo/#collaboration',
		'https://ckeditor.com/productivity-pack/',
		'https://ckeditor.com/ckeditor-5/demo/internationalization/',
		'https://ckeditor.com/export-to-pdf-word/#export-to-pdf',
		'https://ckeditor.com/export-to-pdf-word/#export-to-word',
		'https://ckeditor.com/export-to-pdf-word/#pagination',
		'https://ckeditor.com/import-from-word/demo/#extended-import',
		'https://ckeditor.com/import-from-word/demo/#simple-import',
		'https://ckeditor.com/productivity-pack/paste-from-office-enhanced-demo/',
		'https://ckeditor.com/ckbox/demo/#ckeditor-with-ckbox',
		'https://ckeditor.com/ckeditor-5/demo/html-support/',
		'https://ckeditor.com/ckeditor-5/demo/markdown/',
		'https://ckeditor.com/ckeditor-5/demo/headless/',
		'https://ckeditor.com/mathtype/',
		'https://ckeditor.com/spellchecker/'
	];

	const TESTS: ITest[] = [
		new PingSiteTest( 'https://ckeditor.com/' ),
		new PingSiteTest( 'https://cksource.com/' ),
		new PingSiteTest( 'https://onlinehtmleditor.dev/' ),
		new PingSiteTest( 'https://onlinemarkdowneditor.dev/' )

	];

	const editorAgent: IEditorAgent = new EditorAgent();

	await editorAgent.launchAgent();

	DEMOS_URLS.forEach( ( url, testId ) => TESTS.push( new EditorDemoTest( editorAgent!, url, testId ) ) );

	const metrics: Metrics = new Metrics();
	const testRunner: TestsRunner = new TestsRunner( metrics, TESTS );

	try {
		const BASIC_AUTH_PASSWORD: string = await _getBasicAuthPassword();

		const pushGateway: Pushgateway<'text/plain; version=0.0.4; charset=utf-8'> = new Pushgateway(
			PUSHGATEWAY_URL,
			{
				headers: {
					'Authorization': `Basic ${ Buffer.from( `cks:${ BASIC_AUTH_PASSWORD }` ).toString( 'base64' ) }`
				}
			},
			metrics.register
		);

		await testRunner.runTests();

		await pushGateway.push( { jobName: APPLICATION_NAME } );
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.log( error );
	}

	await editorAgent.stopAgent();

	// eslint-disable-next-line no-console
	console.log( '--- Tests finished: ', new Date() );

	return 'Done';
};

async function _getBasicAuthPassword(): Promise<string> {
	if ( process.env.BASIC_AUTH_PASSWORD ) {
		return process.env.BASIC_AUTH_PASSWORD;
	}

	const sm: SecretsManager = new SecretsManager();

	const { SecretString: secret } = await sm.getSecretValue( {
		SecretId: process.env.BASIC_AUTH_PASSWORD_ID
	} );

	if ( !secret ) {
		throw new Error( 'BASIC_AUTH_PASSWORD value is missing.' );
	}

	return secret;
}
