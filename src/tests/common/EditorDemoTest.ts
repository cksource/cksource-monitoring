/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import { URL } from 'url';

import { ITest } from '../Test';

class EditorDemoTest implements ITest {
	public productName: string;

	public testName: string = 'editor-demo';

	public constructor( private readonly _address: string ) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.host;
	}

	public async run(): Promise<void> {

	}
}

export default EditorDemoTest;
