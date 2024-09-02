/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITestDefinition } from './TestDefinition';

export interface ITest {
	testName: string;
	testDefinition: ITestDefinition;

	run(): void | Promise<void>;
 }
