/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Pushgateway } from 'prom-client';

import TestsRunner from './TestsRunner';
import Metrics from './Metrics';
import { ITest } from './tests/Test';
import PingSiteTest from './tests/common/PingSiteTest';

const APPLICATION_NAME: string = 'cksource-monitoring';

const TESTS: ITest[] = [
	new PingSiteTest( 'https://ckeditor.com/' ),
	new PingSiteTest( 'https://cksource.com/' ),
	new PingSiteTest( 'https://onlinehtmleditor.dev/' ),
	new PingSiteTest( 'https://onlinemarkdowneditor.dev/' )
];

( function() {
	const metrics: Metrics = new Metrics();
	const testRunner: TestsRunner = new TestsRunner( metrics, TESTS );
	const pushGateway: Pushgateway = new Pushgateway( 'http://127.0.0.1:9091', {}, metrics.register );

	setInterval(
		async () => {
			await testRunner.runTests();

			await pushGateway.push( { jobName: APPLICATION_NAME } );

			// eslint-disable-next-line no-console
			console.log( '--- Tests finished: ', new Date() );
		},
		5000
	);
}() );
