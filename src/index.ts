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

import Agent from './agents/Agent';

const APPLICATION_NAME: string = 'cksource-monitoring';
const PUSHGATEWAY_URL: string = process.env.PUSHGATEWAY_URL ?? 'http://pushgateway:9091';

export const handler = async (): Promise<string> => {
	const agent: Agent = new Agent();

	await agent.launchAgent();

	const TESTS: ITest[] = [
		new PingSiteTest( 'https://ckeditor.com/' ),
		new PingSiteTest( 'https://cksource.com/' ),
		new PingSiteTest( 'https://onlinehtmleditor.dev/' ),
		new PingSiteTest( 'https://onlinemarkdowneditor.dev/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/feature-rich/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/editor-types/#classic' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/editor-types/#document' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/editor-types/#balloon' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/editor-types/#balloon-block' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/editor-types/#inline' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/editor-types/#bottom-toolbar' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/editor-types/#button-grouping' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ai-assistant/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/collaboration/demo/#real-time-collaboration' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/collaboration/demo/#collaboration' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/productivity-pack/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/internationalization/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/export-to-pdf-word/#export-to-pdf' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/export-to-pdf-word/#export-to-word' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/export-to-pdf-word/#pagination' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/import-from-word/demo/#simple-import' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/productivity-pack/paste-from-office-enhanced-demo/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckbox/demo/#ckeditor-with-ckbox' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/html-support/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/markdown/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/ckeditor-5/demo/headless/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/mathtype/' ),
		new EditorDemoTest( agent, 'https://ckeditor.com/spellchecker/' )
	];

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

	await agent.stopAgent();

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
