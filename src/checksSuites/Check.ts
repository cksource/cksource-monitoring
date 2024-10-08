/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ICheckDefinition } from './CheckDefinition.js';

export interface ICheck {
	checkName: string;
	checkDefinition: ICheckDefinition;

	run(): void | Promise<void>;
}
