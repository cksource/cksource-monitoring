/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { RequestFailError } from './errors/RequestFailError';

const STATUS_CODES: number[] = [ 400, 500 ];

export default class FailSimulator {
	private _callCount: number = 0;

	public constructor( private readonly _failRatio: number = ( Math.floor( Math.random() * 101 ) + 30 ) ) {}

	public simulate(): void {
		this._callCount++;

		if ( this._callCount % this._failRatio === 0 ) {
			throw new RequestFailError( STATUS_CODES[ Math.floor( Math.random() * STATUS_CODES.length ) ], 'Fake fail' );
		}
	}
}
