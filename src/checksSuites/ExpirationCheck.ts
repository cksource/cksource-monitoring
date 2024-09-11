/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

/* eslint-disable sort-class-members/sort-class-members */

import { Gauge } from 'prom-client';

import { ExpirationError } from '../errors/ExpirationError.js';
import { ICheck } from './Check.js';
import { ICheckDefinition } from './CheckDefinition.js';
import Metrics, { IMetrics } from '../common/Metrics.js';

const GAUGE_NAME: string = 'monitoring_expiration_check';

abstract class ExpirationCheck implements ICheck {
	public abstract readonly checkName: string;

	private readonly _gauge: Gauge<string>;

	public constructor(
		public checkDefinition: ICheckDefinition
	) {
		const metrics: IMetrics = Metrics.getInstance();

		this._gauge = metrics.gauge(
			GAUGE_NAME,
			[
				'check_name',
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
				check_name: this.checkName,
				product_name: this.checkDefinition.productName,
				product_group: this.checkDefinition.productGroup,
				organization: this.checkDefinition.organization
			},
			value
		);
	}
}

export default ExpirationCheck;
