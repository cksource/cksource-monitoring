/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { handler } from './index';

setInterval( async () => {
	await handler();
}, 10 * 1000 );
