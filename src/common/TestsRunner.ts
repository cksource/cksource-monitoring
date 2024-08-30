/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Counter } from 'prom-client';

import { ITest, TestResults } from '../tests/Test';
import { IMetrics, StopTimerFunction } from './Metrics';

const HISTOGRAM_NAME: string = 'monitoring_test';
const COUNTER_NAME: string = 'monitoring_test_fails';

export default class TestsRunner {
	private readonly _counter: Counter;

	public constructor(
		private readonly _metrics: IMetrics,
		private readonly _tests: ITest[]
	) {
		this._counter = this._metrics.counter(
			COUNTER_NAME,
			[
				'test_name',
				'product_name',
				'product_group',
				'organization'
			]
		);
	}

	public async runTests(): Promise<void> {
		await Promise.all( this._tests.map( test => this._runTest( test ) ) );
	}

	private async _runTest( test: ITest ): Promise<void> {
		const stopTimer: StopTimerFunction = this._startTimer();

		let status: number = 0;

		const { productName, organization, productGroup } = test.testDefinition;

		try {
			const data: TestResults = await test.run();

			status = data.status;
		} catch ( error ) {
			console.log( `Test ${ test.testName }  - ${ productName } - failed. Reason: ${ error.message }` );

			status = 1;
		} finally {
			stopTimer( {
				status,
				test_name: test.testName,
				organization,
				product_group: productGroup,
				product_name: productName
			} );

			// Using separate counter for failed tests is more precise if we want to detect rare and single fails.
			this._counter.labels( {
				test_name: test.testName,
				organization,
				product_group: productGroup,
				product_name: productName
			} ).inc( status );
		}
	}

	private _startTimer(): StopTimerFunction {
		return this._metrics.histogram(
			HISTOGRAM_NAME,
			[
				'status',
				'test_name',
				'product_name',
				'product_group',
				'organization'
			]
		).startTimer();
	}
}
