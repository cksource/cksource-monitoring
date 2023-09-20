/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

import { ITest } from './Test';

class PingCKEditorPage implements ITest {
	public name: string = 'ping ckeditor.com';

	public run(): void {
		// eslint-disable-next-line no-console
		console.log( '--- ping: ', new Date() );
	}
}

export default PingCKEditorPage;
