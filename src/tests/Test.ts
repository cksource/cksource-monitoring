/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITestDefinition } from './TestDefinition';

export interface ITest {
	testName: string;
	testDefinition: ITestDefinition;

	run(): TestResults | Promise<TestResults>;
 }

export type TestResults = { status: number; } & Record<string, string | number | undefined>;
