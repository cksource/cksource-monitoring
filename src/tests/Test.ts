/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export interface ITest {
	productName: string;

	testName: string;

	run(): void|Promise<void>;
 }
