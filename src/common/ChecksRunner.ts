/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { Counter } from 'prom-client';
import pLimit, { LimitFunction } from 'p-limit';

import { ICheck } from '../checksSuites/Check.js';
import Metrics, { IMetrics, StopTimerFunction } from './Metrics.js';

const HISTOGRAM_NAME: string = 'monitoring_check';
const COUNTER_NAME: string = 'monitoring_check_fails';

type Status = 'success' | 'failure';

export default class ChecksRunner {
	private readonly _counter: Counter;

	private readonly _metrics: IMetrics;

	public constructor(
		private readonly _checks: ICheck[],
		private readonly _checkTypesToRun: string[]
	) {
		this._metrics = Metrics.getInstance();
		this._counter = this._metrics.counter(
			COUNTER_NAME,
			[
				'check_name',
				'product_name',
				'product_group',
				'organization'
			]
		);
	}

	public async runChecks(): Promise<void> {
		const concurrency: number = this._checkTypesToRun.includes( 'domain' ) ? 2 : 8;
		const limit: LimitFunction = pLimit( concurrency );

		await Promise.all( this._checks.map( check => limit( () => this._runCheck( check ) ) ) );
	}

	private async _runCheck( check: ICheck ): Promise<void> {
		const stopTimer: StopTimerFunction = this._startTimer();

		let status: Status = 'success';

		const { productName, organization, productGroup } = check.checkDefinition;

		try {
			await check.run();
		} catch ( error ) {
			console.log( `Check ${ check.checkName }  - ${ productGroup }-${ productName } - failed. ${ error.message }` );

			status = 'failure';
		} finally {
			stopTimer( {
				status,
				check_name: check.checkName,
				organization,
				product_group: productGroup,
				product_name: productName
			} );

			// Using separate counter for failed checks is more precise if we want to detect rare and single fails.
			this._counter.labels( {
				check_name: check.checkName,
				organization,
				product_group: productGroup,
				product_name: productName
			} ).inc( status === 'failure' ? 1 : 0 );
		}
	}

	private _startTimer(): StopTimerFunction {
		return this._metrics.histogram(
			HISTOGRAM_NAME,
			[
				'status',
				'check_name',
				'product_name',
				'product_group',
				'organization'
			]
		).startTimer();
	}
}
