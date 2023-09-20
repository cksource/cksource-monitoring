/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Pushgateway } from 'prom-client';

import TestsRunner from './TestsRunner';
import Metrics from './Metrics';

const APPLICATION_NAME: string = 'cksource-monitoring';

( function() {
	const metrics: Metrics = new Metrics();
	const testRunner: TestsRunner = new TestsRunner( metrics );
	const pushGateway: Pushgateway = new Pushgateway( 'http://127.0.0.1:9091', {}, metrics.register );

	setInterval(
		async () => {
			await testRunner.runTests();

			await pushGateway.push( { jobName: APPLICATION_NAME } );
		},
		5000
	);
}() );
