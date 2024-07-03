/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */
import { URL } from 'url';

import { ITest } from '../Test';

import IEditorAgent from '../../agents/IEditorAgent';

import { DemoFailError } from '../../errors/DemoFailError';

class EditorDemoTest implements ITest {
	public productName: string;

	public testName: string = 'editor-demo';

	public constructor( private readonly _agent: IEditorAgent, private readonly _address: string, private readonly _testId: number ) {
		const parsedUrl: URL = new URL( this._address );

		this.productName = parsedUrl.pathname + parsedUrl.hash;
	}

	public async run(): Promise<void> {
		const editorAgent: IEditorAgent = this._agent;

		await editorAgent.openPage( this._testId );

		try {
			await editorAgent.visit( this._testId, this._address );
			await editorAgent.waitForEditor( this._testId );
			await editorAgent.closePage( this._testId );
		} catch ( error ) {
			throw new DemoFailError( this.productName, 'Demo is down.' );
		}
	}
}

export default EditorDemoTest;
