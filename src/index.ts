/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Pushgateway } from 'prom-client';
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

import TestsRunner from './common/TestsRunner';
import Metrics from './common/Metrics';
import { ITest } from './tests/Test';

import { getTestsDefinition } from './testsDefinition';

const APPLICATION_NAME: string = 'cksource-monitoring';
const PUSHGATEWAY_URL: string = process.env.PUSHGATEWAY_URL ?? 'http://pushgateway:9091';

const metrics: Metrics = Metrics.getInstance();

export const handler = async ( event: {tests: string[];} ): Promise<string> => {
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

		// Generate the tests set that will be executed by the test runner.
		const TESTS: ITest[] = getTestsDefinition( event.tests );

		const testRunner: TestsRunner = new TestsRunner( TESTS, event.tests );

		await testRunner.runTests();

		await pushGateway.push( { jobName: APPLICATION_NAME } );
	} catch ( error ) {
		console.log( error );
	}

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
