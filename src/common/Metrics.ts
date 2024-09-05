/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry, Summary, LabelValues } from 'prom-client';

const METRICS_BUCKETS: number[] = [ 0.005, 0.01, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 10, 15, 20, 30 ];
const METRIC_DESCRIPTION: string = 'description';

export interface IMetrics {
	register: Registry;
	getResponse(): Promise<{ contentType: string; data: string; }>;
	counter( name: string, labelNames?: string[] ): Counter<string>;
	histogram( name: string, labelNames?: string[], buckets?: number[] ): Histogram<string>;
	gauge( name: string, labelNames?: string[] ): Gauge<string>;
	summary( name: string, labelNames?: string[], percentiles?: number[] ): Summary<string>;
}

export type StopTimerFunction = ( labels?: LabelValues<string> ) => void

/**
 * Creates and prepares metrics object needed to collect metrics stats
 *
 * @see {@link https://prometheus.io/docs/concepts/metric_types/} prometheus documentation
 */
export default class Metrics implements IMetrics {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private static _instance: Metrics;

	private readonly _metricsPrefix: string = '';

	private readonly _register: Registry = new Registry();

	private constructor() {
		collectDefaultMetrics( {
			register: this._register
		} );
	}

	public get register(): Registry {
		return this._register;
	}

	public async getResponse(): Promise<{ contentType: string; data: string; }> {
		return {
			contentType: this.register.contentType,
			data: await this.register.metrics()
		};
	}

	/**
	 * Returns counter or creates new instance if one with given name does not exists.
	 * To use previously created counter use the same name when requesting counter.
	 *
	 * Counters can only go up (and reset, such as when a process restarts). They are useful for accumulating the number of events,
	 * or the amount of something at each event. For example, the total number of HTTP requests,
	 * or the total number of bytes sent in HTTP requests.
	 */
	public counter( name: string, labelNames: string[] = [] ): Counter<string> {
		name = this._prepareMetricName( name, 'counter' );

		return this.register.getSingleMetric( name ) as Counter<string> ||
			new Counter( { registers: [ this.register ], name, help: METRIC_DESCRIPTION, labelNames } );
	}

	/**
	 * Returns histogram or creates new instance if one with given name does not exists.
	 * To use previously created histogram use the same name when requesting histogram.
	 *
	 * A histogram samples observations (usually things like request durations or response sizes) and counts them in configurable buckets.
	 * It also provides a sum of all observed values.
	 */
	public histogram( name: string, labelNames: string[] = [], buckets: number[] = METRICS_BUCKETS ): Histogram<string> {
		name = this._prepareMetricName( name, 'histogram' );

		return this.register.getSingleMetric( name ) as Histogram<string> ||
			new Histogram( {
				registers: [ this.register ],
				name,
				help: METRIC_DESCRIPTION,
				labelNames,
				...( buckets && { buckets } )
			} );
	}

	/**
	 * Returns gauge or creates new instance if one with given name does not exists.
	 * To use previously created gauge use the same name when requesting gauge.
	 *
	 * A gauge is a metric that represents a single numerical value that can arbitrarily go up and down.
	 * Gauges are typically used for measured values like temperatures or current memory usage, but also "counts" that can go up and down,
	 * like the number of running goroutines.
	 */
	public gauge( name: string, labelNames: string[] = [] ): Gauge<string> {
		name = this._prepareMetricName( name, 'gauge' );

		return this.register.getSingleMetric( name ) as Gauge<string> ||
			new Gauge( { registers: [ this.register ], name, help: METRIC_DESCRIPTION, labelNames } );
	}

	/**
	 *
	 * Returns summary or creates new instance if one with given name does not exists.
	 * To use previously created summary use the same name when requesting summary.
	 *
	 * Similar to a histogram, a summary samples observations (usually things like request durations and response sizes).
	 * While it also provides a total count of observations and a sum of all observed values,
	 * it calculates configurable quantiles over a sliding time window.
	 */
	public summary( name: string, labelNames: string[] = [], percentiles?: number[] ): Summary<string> {
		name = this._prepareMetricName( name, 'summary' );

		return this.register.getSingleMetric( name ) as Summary<string> ||
			new Summary( {
				registers: [ this.register ],
				name,
				help: METRIC_DESCRIPTION,
				labelNames,
				...( percentiles && { percentiles } )
			} );
	}

	public static getInstance(): Metrics {
		if ( !Metrics._instance ) {
			Metrics._instance = new Metrics();
		}

		return Metrics._instance;
	}

	private _prepareMetricName( name: string, metricType: string ): string {
		const prefix: string = this._metricsPrefix ? `${ this._metricsPrefix }_` : '';

		return `${ prefix }${ name }_${ metricType }`.replace( /[^a-zA-Z0-9_:]/g, '_' );
	}
}
