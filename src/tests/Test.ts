/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

export interface ITest {
	name: string;

	run(): void|Promise<void>;
 }
