/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Counter } from 'prom-client';

import { ITest } from './tests/Test';
import { IMetrics, StopTimerFunction } from './Metrics';

const METRIC_NAME: string = 'monitoring_test';
const GAUGE_NAME: string = 'monitoring_test_fails';

export default class TestsRunner {
	private readonly _counter: Counter;

	public constructor(
		private readonly _metrics: IMetrics,
		private readonly _tests: ITest[]
	) {
		this._counter = this._metrics.counter( GAUGE_NAME, [ 'test_name', 'product_name' ] );
	}

	public async runTests(): Promise<void> {
		await Promise.all( this._tests.map( test => this._runTest( test ) ) );
	}

	private async _runTest( test: ITest ): Promise<void> {
		const stopTimer: StopTimerFunction = this._startTimer();

		let statusCode: number = 200;

		try {
			await test.run();
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.log( `Test - ${ test.productName } - failed.` );

			statusCode = error.statusCode ?? 500;
		} finally {
			stopTimer( {
				status_code: statusCode,
				test_name: test.testName,
				product_name: test.productName
			} );

			// Using separate counter for failed tests is more precise if we want to detect rare and single fails.
			this._counter.labels( {
				test_name: test.testName,
				product_name: test.productName
			} ).inc( statusCode > 399 ? 1 : 0 );
		}
	}

	private _startTimer(): StopTimerFunction {
		return this._metrics.histogram( METRIC_NAME, [ 'status_code', 'test_name', 'product_name' ] ).startTimer();
	}
}
