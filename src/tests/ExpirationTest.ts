/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable sort-class-members/sort-class-members */

import { Gauge } from 'prom-client';

import { ExpirationError } from '../errors/ExpirationError.js';
import { ITest } from './Test.js';
import { ITestDefinition } from './TestDefinition.js';
import Metrics, { IMetrics } from '../common/Metrics.js';

const GAUGE_NAME: string = 'monitoring_expiration_test';

abstract class ExpirationTest implements ITest {
	public abstract readonly testName: string;

	private readonly _gauge: Gauge<string>;

	public constructor(
		public testDefinition: ITestDefinition
	) {
		const metrics: IMetrics = Metrics.getInstance();

		this._gauge = metrics.gauge(
			GAUGE_NAME,
			[
				'test_name',
				'product_name',
				'product_group',
				'organization'
			]
		);
	}

	public async run(): Promise<void> {
		const expiresInDays: number|null = await this.getExpirationDate();

		if ( expiresInDays ) {
			this._setGaugeValue( expiresInDays );
		}

		if ( !expiresInDays || expiresInDays <= 14 ) {
			throw new ExpirationError( { expiresInDays } );
		}
	}

	protected abstract getExpirationDate(): Promise<number|null>;

	private _setGaugeValue( value: number ): void {
		this._gauge.set(
			{
				test_name: this.testName,
				product_name: this.testDefinition.productName,
				product_group: this.testDefinition.productGroup,
				organization: this.testDefinition.organization
			},
			value
		);
	}
}

export default ExpirationTest;
