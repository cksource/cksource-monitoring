/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import { URL } from 'url';

import { ITest } from '../Test';

import EditorAgent from '../../agents/EditorAgent';
import IEditorAgent from '../../agents/IEditorAgent';

import { DemoFailError } from '../../errors/DemoFailError';

class EditorDemoTest implements ITest {
	public productName: string;

	public testName: string = 'editor-demo';

	public constructor( private readonly _address: string ) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.pathname;
	}

	public async run(): Promise<void> {
		const editorAgent: IEditorAgent = new EditorAgent();

		try {
			await editorAgent.launchAgent();
			await editorAgent.visit( this._address );
			await editorAgent.waitForEditor();
		} catch ( error ) {
			throw new DemoFailError( this.productName, 'Demo is down.' );
		}
	}
}

export default EditorDemoTest;
