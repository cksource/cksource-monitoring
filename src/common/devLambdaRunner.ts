/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { handler } from '../index.js';

const eventData: {tests: string[];} = { tests: [ 'ping' ] };
// const eventData: {tests: string[];} = { tests: [ 'certificate', 'domain' ] };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
( async () => {
	await handler( eventData );
	setInterval( async () => {
		await handler( eventData );
	}, 60 * 1000 );
} )();
