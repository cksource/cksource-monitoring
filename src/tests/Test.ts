/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export interface ITest {
	productName: string;

	productGroup: string;

	organization: string;

	testName: string;

	run(): TestResults | Promise<TestResults>;
}

export type TestResults = { status: number; } & Record<string, string | number | undefined>;
