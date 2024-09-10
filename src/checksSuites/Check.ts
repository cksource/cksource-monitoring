/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { IMetrics } from '../common/Metrics.js';
import { ICheckDefinition } from './CheckDefinition.js';

export interface ICheck {
	checkName: string;
	checkDefinition: ICheckDefinition;

	run( metrics?: IMetrics ): void | Promise<void>;
}
