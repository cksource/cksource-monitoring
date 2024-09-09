/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { IMetrics } from '../common/Metrics.js';
import { ITestDefinition } from './TestDefinition.js';

export interface ITest {
	testName: string;
	testDefinition: ITestDefinition;

	run( metrics?: IMetrics ): void | Promise<void>;
 }
