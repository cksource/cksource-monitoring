/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITest } from './tests/Test';
import { IMetrics, StopTimerFunction } from './Metrics';

const METRIC_NAME: string = 'monitoring_test';

export default class TestsRunner {
	public constructor(
		private readonly _metrics: IMetrics,
		private readonly _tests: ITest[]
	) {}

	public async runTests(): Promise<void> {
		await Promise.all( this._tests.map( test => this._runTest( test ) ) );
	}

	private async _runTest( test: ITest ): Promise<void> {
		const stopTimer: StopTimerFunction = this._startTimer();

		let statusCode: number = 200;

		try {
			await test.run();
		} catch ( error ) {
			statusCode = error.statusCode ?? 500;
		} finally {
			stopTimer( {
				status_code: statusCode,
				test_name: test.testName,
				product_name: test.productName
			} );
		}
	}

	private _startTimer(): StopTimerFunction {
		return this._metrics.histogram( METRIC_NAME, [ 'status_code', 'test_name', 'product_name' ] ).startTimer();
	}
}
