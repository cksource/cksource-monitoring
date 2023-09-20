/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITest } from './tests/Test';
import { IMetrics, StopTimerFunction } from './Metrics';

import PingCKEditorPage from './tests/PingCKEditorPage';

const METRIC_NAME: string = 'monitoring_test';

export default class TestsRunner {
	public constructor(
		private readonly _metrics: IMetrics,
		private readonly _tests: ITest[] = [
			new PingCKEditorPage()
		]
	) {}

	public async runTests(): Promise<void> {
		await Promise.all( this._tests.map( test => this._runTest( test ) ) );
	}

	public async getTestResults(): Promise<string> {
		const { data } = await this._metrics.getResponse();

		return data;
	}

	private async _runTest( test: ITest ): Promise<void> {
		const stopTimer: StopTimerFunction = this._startTimer();

		let statusCode: number = 200;

		try {
			await test.run();
		} catch ( error ) {
			statusCode = 500;
		} finally {
			stopTimer( {
				statusCode,
				testName: test.name
			} );
		}
	}

	private _startTimer(): StopTimerFunction {
		return this._metrics.histogram( METRIC_NAME, [ 'statusCode', 'testName' ] ).startTimer();
	}
}
