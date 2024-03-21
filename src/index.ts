/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Pushgateway } from 'prom-client';

import TestsRunner from './TestsRunner';
import Metrics from './Metrics';
import { ITest } from './tests/Test';
import PingSiteTest from './tests/common/PingSiteTest';

const APPLICATION_NAME: string = 'cksource-monitoring';
const PUSHGATEWAY_URL: string = process.env.PUSHGATEWAY_URL ?? 'http://pushgateway:9091';

const TESTS: ITest[] = [
	new PingSiteTest( 'https://ckeditor.com/' ),
	new PingSiteTest( 'https://cksource.com/' ),
	new PingSiteTest( 'https://onlinehtmleditor.dev/' ),
	new PingSiteTest( 'https://onlinemarkdowneditor.dev/' )
];

// eslint-disable-next-line @typescript-eslint/no-floating-promises
( async function main(): Promise<void> {
	const metrics: Metrics = new Metrics();
	const testRunner: TestsRunner = new TestsRunner( metrics, TESTS );
	const pushGateway: Pushgateway<'text/plain; version=0.0.4; charset=utf-8'> = new Pushgateway(
		PUSHGATEWAY_URL,
		{},
		metrics.register
	);

	await testRunner.runTests();

	// eslint-disable-next-line no-console
	console.log( PUSHGATEWAY_URL );
	await pushGateway.push( { jobName: APPLICATION_NAME } );

	// eslint-disable-next-line no-console
	console.log( '--- Tests finished: ', new Date() );

	process.exit( 0 );
}() );
