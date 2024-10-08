/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Pushgateway } from 'prom-client';

import ChecksRunner from './common/ChecksRunner.js';
import Metrics from './common/Metrics.js';
import { ICheck } from './checksSuites/Check.js';
import { getChecks } from './common/getChecks.js';
import SecretsManagerClient, { ISecretsManagerClient } from './common/SecretsManagerClient.js';

const APPLICATION_NAME: string = 'tiugo-monitoring';
const PUSHGATEWAY_URL: string = process.env.PUSHGATEWAY_URL ?? 'http://pushgateway:9091';

const metrics: Metrics = Metrics.getInstance();
const secretsManagerClient: ISecretsManagerClient = SecretsManagerClient.getInstance();

export const handler = async ( event: {checks: string[];} ): Promise<string> => {
	console.log( '--- Checks triggered with the following types: ', event?.checks?.join( ',' ) );

	try {
		const BASIC_AUTH_PASSWORD: string = await secretsManagerClient.getSecretValue( 'BASIC_AUTH_PASSWORD' );
		const pushGateway: Pushgateway<'text/plain; version=0.0.4; charset=utf-8'> = new Pushgateway(
			PUSHGATEWAY_URL,
			{
				headers: {
					'Authorization': `Basic ${ Buffer.from( `cks:${ BASIC_AUTH_PASSWORD }` ).toString( 'base64' ) }`
				}
			},
			metrics.register
		);

		// Generate the checks set that will be executed by the check runner.
		const CHECKS: ICheck[] = getChecks( event.checks );

		const checksRunner: ChecksRunner = new ChecksRunner( CHECKS, event.checks );

		await checksRunner.runChecks();

		await pushGateway.pushAdd( { jobName: APPLICATION_NAME } );
	} catch ( error ) {
		console.log( error );
	}

	console.log( '--- Checks finished: ', new Date() );

	return 'Done';
};
