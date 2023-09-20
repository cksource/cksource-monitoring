/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Pushgateway } from 'prom-client';

import { HttpClient } from '@cksource-cs/http-client-module';

import TestsRunner from './TestsRunner';
import Metrics from './Metrics';
import { ITest } from './tests/Test';
import PingCKEditorSiteTest from './tests/ckeditor.com/PingCKEditorSiteTest';
import PingCKSourceSiteTest from './tests/cksource.com/PingCKSourceSiteTest';
import PingOnlineHtmlEditorSiteTest from './tests/onlinehtmleditor.dev/PingOnlineHtmlEditorSiteTest';
import PingMarkdownHtmlEditorSiteTest from './tests/onlinemarkdowneditor.dev/PingMarkdownHtmlEditorSiteTest';

const APPLICATION_NAME: string = 'cksource-monitoring';

const HTTP_CLIENT: HttpClient = new HttpClient();

const TESTS: ITest[] = [
	new PingCKEditorSiteTest( HTTP_CLIENT ),
	new PingCKSourceSiteTest( HTTP_CLIENT ),
	new PingOnlineHtmlEditorSiteTest( HTTP_CLIENT ),
	new PingMarkdownHtmlEditorSiteTest( HTTP_CLIENT )
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
