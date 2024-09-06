/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { handler } from '../index';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
( async event => {
	await handler( event );
} )();
