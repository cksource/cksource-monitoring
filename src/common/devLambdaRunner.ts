/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { handler } from '../index';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
( async () => {
	await handler();
	setInterval( async () => {
		await handler();
	}, 60 * 1000 );
} )();
